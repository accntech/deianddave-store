import type { InventoryItem, Product } from '$lib/services/inventory';

export const getUniqueFabrics = (items: InventoryItem[]) => {
	if (!items.length) return [];

	const seen = new Set();
	const unique = [];

	for (const item of items) {
		const fabricId = item.fabric.id;
		if (!seen.has(fabricId)) {
			seen.add(fabricId);
			unique.push({
				id: fabricId,
				index: item.fabric.index,
				name: item.fabric.name
			});
		}
	}

	if (unique.length === 0) {
		return [];
	}

	if (unique.length === 1) {
		return unique;
	}

	unique.sort((a, b) => {
		if (a.index !== b.index) {
			return a.index - b.index;
		}
		return a.name.localeCompare(b.name);
	});
	return unique;
};

export const getUniqueAgeGroups = (items: InventoryItem[], fabricId: string) => {
	if (!items.length) return [];

	const seen = new Set();
	const unique = [];

	let hasGenericAgeGroup = false;
	for (const item of items) {
		if (!item.ageGroup) {
			hasGenericAgeGroup = true;
			continue;
		}
		if (fabricId && item.fabric.id !== fabricId) continue;

		const ageGroupId = item.ageGroup?.id;
		if (!seen.has(ageGroupId)) {
			seen.add(ageGroupId);

			if (ageGroupId) {
				unique.push({
					id: ageGroupId,
					index: item.ageGroup.index,
					name: item.ageGroup?.name
				});
			}
		}
	}

	if (unique.length <= 1) {
		return [];
	}

	unique.sort((a, b) => {
		if (a.index !== b.index) {
			return a.index - b.index;
		}
		return a.name.localeCompare(b.name);
	});

	if (hasGenericAgeGroup) return [{ id: '', name: 'Generic' }, ...unique];
	return unique;
};

export const filterProducts = (items: InventoryItem[], fabric: string, age: string) => {
	if (!fabric) return [] as Product[];

	if (!items.length) return [] as Product[];

	const groups = new Map<string, { item: any; minPrice: number }>();

	for (const item of items) {
		if (fabric && item.fabric.id !== fabric) continue;
		if (age && item.ageGroup?.id !== age) continue;

		const key = `${item.product.id}|${item.fabric.id}|${item.genderGroup ? item.genderGroup.id : ''}|${item.status}`;
		const existing = groups.get(key);
		if (!existing) {
			groups.set(key, { item, minPrice: item.price });
		} else if (item.price < existing.minPrice) {
			groups.set(key, { item, minPrice: item.price });
		}
	}

	const unique = Array.from(groups.values()).map(({ item, minPrice }) => ({
		...item,
		price: minPrice
	}));

	const products = unique.map((x) => ({
		id: x.id,
		product: x.product,
		sets: x.sets,
		fabric: x.fabric,
		ageGroup: x.ageGroup,
		genderGroup: x.genderGroup,
		status: x.status,
		price: x.price,
		image: x.image
	})) as Product[];

	if (unique.length <= 1) {
		return products;
	}

	products.sort((a, b) => {
		if (a.product.index !== b.product.index) {
			return a.product.index - b.product.index;
		}

		if (a.price !== b.price) {
			return a.price - b.price;
		}

		return a.product.name.localeCompare(b.product.name);
	});
	return products;
};

export const groupProducts = (products: Product[]) => {
	const groups = Object.groupBy(products, (item) => item.genderGroup?.name || '');
	const entries = Object.entries(groups);
	entries.sort(([, a], [, b]) => {
		const ai =
			a?.reduce(
				(min, i) => Math.min(min, i.genderGroup?.index ?? Number.MAX_SAFE_INTEGER),
				Number.MAX_SAFE_INTEGER
			) ?? Number.MAX_SAFE_INTEGER;
		const bi =
			b?.reduce(
				(min, i) => Math.min(min, i.genderGroup?.index ?? Number.MAX_SAFE_INTEGER),
				Number.MAX_SAFE_INTEGER
			) ?? Number.MAX_SAFE_INTEGER;
		if (ai !== bi) return ai - bi;

		const an = a?.[0]?.genderGroup?.name ?? '';
		const bn = b?.[0]?.genderGroup?.name ?? '';
		return an.localeCompare(bn);
	});
	return entries as [string, Product[]][];
};
