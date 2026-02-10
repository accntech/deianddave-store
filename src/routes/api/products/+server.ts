import { INVENTORIES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { Result } from '$lib/services';
import type { InventoryItem } from '$lib/services/inventory';
import { generateJWT } from '$lib/utils/jwt-generator';
import type { RequestHandler } from './$types';

async function fetchInventory(type: string, jwt: string): Promise<InventoryItem[]> {
	const response = await fetch(`${INVENTORIES_URL}/?type=${type}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${jwt}`,
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) return [];

	const result: Result<InventoryItem[]> = await response.json();
	return result.data ?? [];
}

export const GET: RequestHandler = async ({ setHeaders }) => {
	setHeaders({ 'cache-control': 'max-age=1800' });

	const jwt = await generateJWT();
	const [beddings, loungewear] = await Promise.all([
		fetchInventory('beddings', jwt),
		fetchInventory('loungewear', jwt)
	]);

	const activeItems = [...beddings, ...loungewear].filter((i) => i.status === 'active');
	const names = [...new Set(activeItems.map((i) => i.product.name))];

	return json({ status: 200, data: names } satisfies Result<string[]>);
};
