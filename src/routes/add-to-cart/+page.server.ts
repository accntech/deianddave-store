import { INVENTORIES_URL } from '$env/static/private';
import type { Result } from '$lib/services';
import type { InventoryItem } from '$lib/services/inventory';
import { generateJWT } from '$lib/utils/jwt-generator';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders, url }) => {
	try {
		const productId = url.searchParams.get('productId') || '';
		const fabricId = url.searchParams.get('fabricId') || '';
		const ageGroupId = url.searchParams.get('ageGroupId') || '';
		const genderGroupId = url.searchParams.get('genderGroupId') || '';

		const jwt = await generateJWT();
		const path = new URL(INVENTORIES_URL);
		path.searchParams.append('productId', productId);
		path.searchParams.append('fabricId', fabricId);
		path.searchParams.append('ageGroupId', ageGroupId);
		path.searchParams.append('genderGroupId', genderGroupId);

		const response = await fetch(path.toString(), {
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
