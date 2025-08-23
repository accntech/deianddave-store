import { updatePayment } from '$lib/services/payment';
import { paymongo } from '$lib/services/paymongo';
import { redirect, type RequestHandler } from '@sveltejs/kit';
import pRetry from 'p-retry';

const processedPaymentIntents = new Set<string>();
const MAX_PROCESSED_INTENTS = 1000;

const maintainSetSize = () => {
	if (processedPaymentIntents.size > MAX_PROCESSED_INTENTS) {
		const oldest = Array.from(processedPaymentIntents)[0];
		processedPaymentIntents.delete(oldest);
	}
};

export const GET: RequestHandler = async ({ url, cookies }) => {
	let id = url.searchParams.get('payment_intent_id');

	if (!id) {
		id = cookies.get('payment_intent_id') ?? null;

		if (!id) {
			return new Response('Invalid payment intent ID', { status: 400 });
		}
	}

	if (id) {
		if (processedPaymentIntents.has(id)) {
			return new Response('Payment intent ID already processed', { status: 400 });
		}

		const intent = await paymongo.getPaymentIntent(id);

		if (!intent || !intent.data) {
			redirect(308, `/check-out/result?success=false`);
		}

		if (intent.data.attributes.status !== 'succeeded') {
			cookies.delete('payment_intent_id', { path: '/' });
			redirect(308, '/check-out/result?success=false');
		}

		await pRetry(() => updatePayment(intent), {
			retries: 5,
			onFailedAttempt: (error) => {
				console.error(`Attempt ${error.attemptNumber} failed. Retrying...`, error);
			}
		});

		processedPaymentIntents.add(id);
		maintainSetSize();
		redirect(308, '/check-out/result?success=true');
	}
	redirect(308, '/check-out/result?success=false');
};
