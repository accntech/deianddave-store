import { INVENTORIES_URL } from '$env/static/private';
import type { Result } from '$lib/services';
import type { InventoryItem } from '$lib/services/inventory';
import { generateJWT } from '$lib/utils/jwt-generator';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
	try {
		const jwt = await generateJWT();
		const url = new URL(INVENTORIES_URL);
		url.searchParams.append('type', 'beddings');

		const response = await fetch(url.toString(), {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${jwt}`,
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const result: Result<InventoryItem[]> = await response.json();
		setHeaders({ 'cache-control': 'max-age=600' });

		return { result };
	} catch (error) {
		console.error('Error fetching items:', error);
		return {
			items: [],
			error: 'Failed to fetch items'
		};
	}
};
