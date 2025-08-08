import type { PageServerLoad } from './$types';
import { generateJWT } from '$lib/utils/jwt-generator';
import { INVENTORIES_URL } from '$env/static/private';
import type { InventoryItem } from '$lib/services/inventory';
import type { Result } from '$lib/services';

export const load: PageServerLoad = async () => {
	const jwt = await generateJWT();

	try {
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

		return { result };
	} catch (error) {
		console.error('Error fetching items:', error);
		return {
			items: [],
			error: 'Failed to fetch items'
		};
	}
};
