import type { PageServerLoad } from './$types';
import crypto from 'crypto';

export const load: PageServerLoad = async ({ cookies }) => {
	const csrfToken = crypto.randomBytes(32).toString('hex');
	cookies.set('csrf_token', csrfToken, {
		httpOnly: true,
		sameSite: 'strict',
		secure: true,
		path: '/'
	});
	return { csrfToken };
};
