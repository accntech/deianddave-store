import { updatePayment } from '$lib/services/payment';
import { paymongo } from '$lib/services/paymongo';
import { redirect, type RequestHandler } from '@sveltejs/kit';
import pRetry from 'p-retry';

const list: string[] = [];

export const GET: RequestHandler = async ({ url, cookies }) => {
	const id = url.searchParams.get('payment_intent_id');

	if (!id) {
		return new Response('Invalid payment intent ID', { status: 400 });
	}

	cookies.set('payment_intent_id', id, {
		path: '/',
		httpOnly: true,
		maxAge: 3600,
		secure: true
	});

	if (id) {
		if (list.includes(id)) {
			return new Response('Payment intent ID already processed', { status: 400 });
		}

		const intent = await paymongo.getPaymentIntent(id);

		if (!intent || !intent.data) {
			redirect(308, `/check-out/result?success=false`);
		}

		await pRetry(() => updatePayment(intent), {
			retries: 5,
			onFailedAttempt: (error) => {
				console.error(`Attempt ${error.attemptNumber} failed. Retrying...`, error);
			}
		});

		list.push(id);
		redirect(308, `/check-out/result?success=true`);
	}
	redirect(308, `/check-out/result?success=false`);
};
