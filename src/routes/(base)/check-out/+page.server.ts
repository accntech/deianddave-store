import { DISCOUNTS_URL } from '$env/static/private';
import type { Discount, Result } from '$lib/services';
import { generateJWT } from '$lib/utils/jwt-generator';
import crypto from 'crypto';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const csrfToken = crypto.randomBytes(32).toString('hex');
	cookies.set('csrf_token', csrfToken, {
		httpOnly: true,
		sameSite: 'strict',
		secure: true,
		path: '/'
	});

	const jwt = await generateJWT();

	const urlPath = new URL(DISCOUNTS_URL);
	const response = await fetch(urlPath.toString(), {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${jwt}`,
			'Content-Type': 'application/json'
		}
	});

	let discounts: Discount[] = [];
	if (response.ok) {
		const result: Result<Discount[]> = await response.json();
		discounts = result.data;
	}

	return { csrfToken, discounts };
};
