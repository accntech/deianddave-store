import { SALES_URL } from '$env/static/private';
import { generateJWT } from '$lib/utils/jwt-generator';
import type { AccountInfo, Order } from '.';

export const saveSalesOrder = async (
	paymentIntent: string,
	accountInfo: AccountInfo,
	orders: Order[]
) => {
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
