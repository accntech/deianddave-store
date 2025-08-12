import { PAYMENT_URL } from '$env/static/private';
import { generateJWT } from '$lib/utils/jwt-generator';
import type { PaymentIntentData } from './paymongo';

export const updatePayment = async (intent: PaymentIntentData) => {
	const jwt = await generateJWT();
	const url = PAYMENT_URL;
	const opts = {
		method: 'POST',
		headers: {
			accept: 'application/json',
			'content-type': 'application/json',
			authorization: `Bearer ${jwt}`
		},
		body: JSON.stringify(intent)
	};

	const response = await fetch(url, opts);
	if (!response.ok) {
		console.error('Unable to update payment information');
		return false;
	}

	return true;
};
