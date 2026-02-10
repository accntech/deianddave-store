import { INVENTORIES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { Result } from '$lib/services';
import type { InventoryItem, Product } from '$lib/services/inventory';
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

function toProducts(items: InventoryItem[]): Product[] {
	const groups = new Map<
		string,
		{ item: InventoryItem; minPrice: number; defaultImage: string | undefined }
	>();

	for (const item of items) {
		const key = `${item.product.id}|${item.fabric.id}|${item.ageGroup?.id ?? ''}|${item.genderGroup?.id ?? ''}|${item.type}`;
		const existing = groups.get(key);
		if (!existing) {
			groups.set(key, { item, minPrice: item.price, defaultImage: item.image });
		} else {
			const price = Math.min(existing.minPrice, item.price);
			let image = existing.defaultImage;
			if (item.defaultItem) {
				image = item.image;
			}
			groups.set(key, { item, minPrice: price, defaultImage: image });
		}
	}

	return Array.from(groups.values()).map(({ item, minPrice, defaultImage }) => ({
		id: item.id,
		product: item.product,
		sets: item.sets,
		fabric: item.fabric,
		ageGroup: item.ageGroup,
		genderGroup: item.genderGroup,
		price: minPrice,
		image: defaultImage,
		status: item.status,
		defaultItem: item.defaultItem,
		type: item.type
	}));
}

export const GET: RequestHandler = async ({ url, setHeaders }) => {
	setHeaders({ 'cache-control': 'max-age=600' });

	const q = url.searchParams.get('q')?.trim().toLowerCase() ?? '';

	const jwt = await generateJWT();
	const [beddings, loungewear] = await Promise.all([
		fetchInventory('beddings', jwt),
		fetchInventory('loungewear', jwt)
	]);

	const activeItems = [...beddings, ...loungewear].filter((i) => i.status === 'active');
	let products = toProducts(activeItems);

	if (q) {
		products = products.filter((p) => {
			const name = p.product.name.toLowerCase();
			const fabric = p.fabric.name.toLowerCase();
			const desc = (p.product.description ?? '').toLowerCase();
			return name.includes(q) || fabric.includes(q) || desc.includes(q);
		});
	}

	products.sort((a, b) => {
		if (a.product.index !== b.product.index) return a.product.index - b.product.index;
		if (a.price !== b.price) return a.price - b.price;
		return a.product.name.localeCompare(b.product.name);
	});

	return json({ status: 200, data: products } satisfies Result<Product[]>);
};
