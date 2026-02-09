import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const id = cookies.get('payment_intent_id');

	if (!id) {
		return { id: '' };
	}

	cookies.delete('payment_intent_id', { path: '/' });
	return { id };
};
