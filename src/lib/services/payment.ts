import { PAYMENT_URL } from '$env/static/private';
import { generateJWT } from '$lib/utils/jwt-generator';

export const updatePayment = async (paymentIntent: string) => {
	const jwt = await generateJWT();
	const url = PAYMENT_URL;
	const opts = {
		method: 'POST',
		headers: {
			accept: 'application/json',
			'content-type': 'application/json',
			authorization: `Bearer ${jwt}`
		},
		body: JSON.stringify({
			paymentIntent: paymentIntent
		})
	};

	const response = await fetch(url, opts);
	if (!response.ok) {
		console.error('Unable to update payment information');
		return false;
	}

	return true;
};
