import { CART_ITEMS_URL, PAYMONGO_REDIRECT_URL } from '$env/static/private';
import type { AccountInfo, Discount, Order, PaymentMethod, Result } from '$lib/services';
import type { InventoryItem } from '$lib/services/inventory';
import { updatePayment } from '$lib/services/payment';
import { paymongo } from '$lib/services/paymongo';
import { saveSalesOrder } from '$lib/services/sales';
import { tryParseCardDate } from '$lib/utils/card-helper';
import { computeDiscount } from '$lib/utils/discount-helper';
import { generateJWT } from '$lib/utils/jwt-generator';
import { error, json } from '@sveltejs/kit';
import pRetry from 'p-retry';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const idsParam = url.searchParams.get('ids');

	if (!idsParam) {
		return error(400, 'No ids provided');
	}

	const path = new URL(CART_ITEMS_URL);
	path.searchParams.set('ids', idsParam);

	const jwt = await generateJWT();
	const response = await fetch(path.toString(), {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${jwt}`,
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		return error(response.status, `Status: ${response.status}`);
	}

	const result: Result<InventoryItem[]> = await response.json();
	return json(result);
};

type Body = {
	info: AccountInfo;
	discount: Discount;
	payment: PaymentMethod;
	orders: Order[];
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const csrfCookie = cookies.get('csrf_token');
		const csrfHeader = request.headers.get('x-csrf-token');

		if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
			return json({ error: 'Invalid CSRF token' }, { status: 403 });
		}
		const body: Body = await request.json();

		const amount = body.orders.reduce(
			(total, order) => total + order.item.price * order.quantity,
			0
		);

		const discount = computeDiscount(amount, body.discount);
		const roundedMinorAmount = Math.round((amount - discount) * 10) * 10;
		const paymentIntentPromise = paymongo.createPaymentIntent({ amount: roundedMinorAmount });

		const cardNumber = body.payment.cardNumber.replace(/\s/g, '');
		const expiry = tryParseCardDate(body.payment.expiryDate);
		const paymentMethodPromise = paymongo.createPaymentMethod({
			type: body.payment.method === 'card' ? 'card' : body.payment.ewallet,
			billing: {
				address: {
					city: body.info.address,
					country: null,
					line1: null,
					line2: null,
					postal_code: null,
					state: null
				},
				email: body.info.email,
				name: body.payment.holderName || body.info.fullName,
				phone: body.info.contactNumber
			},
			details: {
				card_number: cardNumber,
				exp_month: expiry.date.month,
				exp_year: expiry.date.year,
				cvc: body.payment.cvv
			}
		});

		const [paymentIntent, paymentMethod] = await Promise.all([
			paymentIntentPromise,
			paymentMethodPromise
		]);

		if (!paymentIntent || !paymentIntent.data) {
			return json({ error: 'Failed to create payment intent' }, { status: 500 });
		}

		if (!paymentMethod || !paymentMethod.data) {
			return json({ error: 'Failed to create payment method' }, { status: 500 });
		}

		const savedOrder = await pRetry(
			() => saveSalesOrder(paymentIntent.data.id, body.discount, body.info, body.orders),
			{
				retries: 5,
				onFailedAttempt: (error) => {
					console.error(`Attempt ${error.attemptNumber} failed. Retrying...`, error);
				}
			}
		);

		if (!savedOrder) {
			return json({ error: 'Failed to save sales order' }, { status: 500 });
		}

		const attachment = await pRetry(
			() =>
				paymongo.attachPaymentIntent({
					payment_intent: paymentIntent.data.id,
					payment_method: paymentMethod.data.id,
					client_key: paymentIntent.data.attributes.client_key,
					return_url: PAYMONGO_REDIRECT_URL
				}),
			{
				retries: 5,
				onFailedAttempt: (error) => {
					console.error(`Attempt ${error.attemptNumber} failed. Retrying...`, error);
				}
			}
		);

		if (!attachment || !attachment.data) {
			return json(
				{ error: attachment.error || 'Failed to attach payment intent' },
				{ status: 500 }
			);
		}

		cookies.set('payment_intent_id', attachment.data.id, {
			path: '/',
			httpOnly: true,
			maxAge: 3600,
			secure: true
		});

		if (attachment.data.attributes.status === 'succeeded') {
			await pRetry(() => updatePayment(attachment), {
				retries: 5,
				onFailedAttempt: (error) => {
					console.error(`Attempt ${error.attemptNumber} failed. Retrying...`, error);
				}
			});
		}

		return json({
			status: attachment.data.attributes.status,
			redirect: attachment.data.attributes.next_action?.redirect.url || ''
		});
	} catch (error) {
		return json({ error: 'An error occurred while processing the request' }, { status: 500 });
	}
};
