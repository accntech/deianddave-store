import {
	PAYMONGO_PAYMENT_WEBHOOK_URL,
	PAYMONGO_REDIRECT_URL,
	SALES_URL
} from '$env/static/private';
import type { AccountInfo, Order, PaymentMethod } from '$lib/services';
import { paymongo } from '$lib/services/paymongo';
import { tryParseCardDate } from '$lib/utils/card-helper';
import { generateJWT } from '$lib/utils/jwt-generator';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

type Body = {
	info: AccountInfo;
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

		const roundedMinorAmount = Math.round(amount * 10) * 10;
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
				name: body.info.fullName,
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

		if (!(await saveSalesOrder(paymentIntent.data.id, body.info, body.orders))) {
			return json({ error: 'Failed to save sales order' }, { status: 500 });
		}

		const attachment = await paymongo.attachPaymentIntent({
			payment_intent: paymentIntent.data.id,
			payment_method: paymentMethod.data.id,
			client_key: paymentIntent.data.attributes.client_key,
			return_url: PAYMONGO_REDIRECT_URL
		});

		if (!attachment || !attachment.data) {
			return json({ error: 'Failed to attach payment intent' }, { status: 500 });
		}

		//send payment notification

		return json({
			status: attachment.data.attributes.status,
			redirect: attachment.data.attributes.next_action?.redirect.url || ''
		});
	} catch (error) {
		return json({ error: 'An error occurred while processing the request' }, { status: 500 });
	}
};

const saveSalesOrder = async (paymentIntent: string, accountInfo: AccountInfo, orders: Order[]) => {
	const jwt = await generateJWT();
	const url = SALES_URL;
	const opts = {
		method: 'POST',
		headers: {
			accept: 'application/json',
			'content-type': 'application/json',
			authorization: `Bearer ${jwt}`
		},
		body: JSON.stringify({
			paymentIntent: paymentIntent,
			accountInfo: accountInfo,
			orders: orders
		})
	};

	const response = await fetch(url, opts);
	if (!response.ok) {
		console.error('Error saving sales order:', await response.json());
		return false;
	}

	return true;
};
