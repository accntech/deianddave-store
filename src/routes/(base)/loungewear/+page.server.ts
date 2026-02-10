import { INVENTORIES_URL } from '$env/static/private';
import type { Result } from '$lib/services';
import type { InventoryItem } from '$lib/services/inventory';
import { generateJWT } from '$lib/utils/jwt-generator';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({ 'cache-control': 'max-age=600' });

	const result = async () => {
		const jwt = await generateJWT();
		const response = await fetch(`${INVENTORIES_URL}/?type=loungewear`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${jwt}`,
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			console.log(`HTTP error! status: ${response.status}`);
			return {
				result: { data: [], errors: { message: `HTTP error! status: ${response.status}` } }
			};
		}

		const result: Result<InventoryItem[]> = await response.json();
		if (result.errors) {
			return { result: { data: [], errors: result.errors } };
		}

		return {
			result: { data: result.data.filter((item) => item.status !== 'inactive'), errors: null }
		};
	};

	return {
		streamed: {
			result: result()
		}
	};
};
