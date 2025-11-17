import { INVENTORIES_URL } from '$env/static/private';
import type { Result } from '$lib/services';
import type { InventoryItem } from '$lib/services/inventory';
import { generateJWT } from '$lib/utils/jwt-generator';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({ 'cache-control': 'max-age=600' });

	const result = async () => {
		const jwt = await generateJWT();
		const url = new URL(INVENTORIES_URL);
		url.searchParams.append('type', 'loungewear');

		const response = await fetch(url.toString(), {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${jwt}`,
				'Content-Type': 'application/json'
			}
		});

		const result: Result<InventoryItem[]> = await response.json();

		return { result };
	};

	return {
		streamed: {
			result: result()
		}
	};
};
