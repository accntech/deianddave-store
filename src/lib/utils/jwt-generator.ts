import { createSecretKey } from 'crypto';
import { API_KEY } from '$env/static/private';
import * as jose from 'jose';

export const generateJWT = async () => {
	const secret = createSecretKey(Buffer.from(API_KEY!, 'utf-8'));

	const jwt = await new jose.SignJWT()
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.sign(secret);

	return jwt;
};
