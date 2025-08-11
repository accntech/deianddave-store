import { paymongo } from '$lib/services/paymongo';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ url }) => {
	const id = url.searchParams.get('payment_intent_id');

	if (id) {
		const intent = await paymongo.getPaymentIntent(id);

		if (!intent || !intent.data) {
			return { success: false };
		}

		return { success: intent.data.attributes.status === 'succeeded' };
	}
	return { success: true };
};
