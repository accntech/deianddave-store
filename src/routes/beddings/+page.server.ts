import type { PageServerLoad } from './$types';
import { generateJWT } from '$lib/utils/jwt-generator';
import { INVENTORIES_URL } from '$env/static/private';
import type { InventoryItem } from '$lib/services/inventory';
import type { Result } from '$lib/services';
import { CACHE_DURATION, memoryCache } from '$lib/services/cache';

export const load: PageServerLoad = async () => {
	try {
		const now = Date.now();

		const cache = memoryCache.find((item: { key: string }) => item.key === 'products');

		if (cache && now < cache.expiry) {
			return { result: cache.data };
		}

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

		const index = memoryCache.findIndex((item) => item.key === 'products');
		if (index !== -1) {
			memoryCache.splice(index, 1);
		}

		memoryCache.push({
			key: 'products',
			data: result,
			expiry: Date.now() + CACHE_DURATION
		});

		const beddings = result.data.filter((item: InventoryItem) => item.type === 'beddings');
		return {
			result: {
				status: result.status,
				data: beddings,
				errors: result.errors
			} as Result<InventoryItem[]>
		};
	} catch (error) {
		console.error('Error fetching items:', error);
		return {
			items: [],
			error: 'Failed to fetch items'
		};
	}
};
