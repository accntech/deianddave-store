<script lang="ts">
	import { PUBLIC_DEFAULT_PRODUCT_IMAGE } from '$env/static/public';
	import type { Product } from '$lib/services/inventory';

	let { data } = $props();

	let selectedFabric = $state('');
	let fabrics = $derived.by(() => {
		const result = data.result;

		if (!result?.data?.length) return [];

		const seen = new Set();
		const unique = [];

		for (const item of result.data) {
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
	});

	let selectedAgeGroup = $state('');
	let ageGroup = $derived.by(() => {
		const result = data.result;

		if (!result?.data?.length) return [];

		const seen = new Set();
		const unique = [];

		let hasGenericAgeGroup = false;
		for (const item of result.data) {
			if (!item.ageGroup) continue;
			if (selectedFabric && item.fabric.id !== selectedFabric) continue;

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
				if (ageGroupId === '') {
					hasGenericAgeGroup = true;
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
	});

	$effect(() => {
		selectedFabric = fabrics.length >= 1 ? fabrics[0].id : '';
	});

	$effect(() => {
		selectedAgeGroup = ageGroup.length >= 1 ? ageGroup[0].id : '';
	});

	let products = $derived.by(() => {
		const result = data.result;
		if (!selectedFabric) return [] as Product[];

		if (!result?.data?.length) return [] as Product[];

		const groups = new Map<string, { item: any; minPrice: number }>();

		for (const item of result.data) {
			if (selectedFabric && item.fabric.id !== selectedFabric) continue;
			if (selectedAgeGroup && item.ageGroup?.id !== selectedAgeGroup) continue;

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
	});

	const groupProducts = (products: Product[]) => {
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
</script>

<div class="flex flex-col gap-4">
	{#if fabrics.length > 1}
		<ul class="flex items-center gap-4">
			{#each fabrics as fabric}
				<button
					onclick={() => {
						selectedFabric = fabric.id;
						selectedAgeGroup = '';
					}}
					class="rounded-full bg-white px-4 py-2"
				>
					{fabric.name}
				</button>
			{/each}
		</ul>
	{/if}

	{#if ageGroup.length > 1}
		<ul class="flex items-center gap-4">
			{#each ageGroup as group}
				<button
					onclick={() => (selectedAgeGroup = group.id)}
					class="rounded-full bg-white px-4 py-2"
				>
					{group.name}
				</button>
			{/each}
		</ul>
	{/if}

	{#if products.length > 0}
		{#each groupProducts(products) as [gender, items]}
			<div class="mb-2">
				<div class="mb-1 text-lg font-bold">{gender}</div>
				<ul class="ml-4 flex list-disc gap-4">
					{#each items ?? [] as item}
						<a
							class="group max-w-[300px] overflow-clip rounded-2xl border"
							href="/add-to-cart?productId={item.product.id}&fabricId={item.fabric
								.id}&ageGroupId={item.ageGroup?.id}&genderGroupId={item.genderGroup?.id}"
						>
							<div class="overflow-clip">
								<img
									class="transition-scale size-[300px] object-cover duration-300 group-hover:scale-110"
									src={item.product.image === null
										? PUBLIC_DEFAULT_PRODUCT_IMAGE
										: item.product.image}
									alt={item.product.name}
									loading="lazy"
									decoding="async"
								/>
							</div>
							<div class="p-4">
								<span class="text-wrap">{item.product.name}</span>
								<span>{item.fabric.name}</span>
								{#each item.sets as set}
									<div>
										<span>{set.quantity}</span>
										<span>{set.name}</span>
									</div>
								{/each}
								<div class="flex flex-col">
									from
									<span>{item.price}</span>
								</div>
							</div>
						</a>
					{/each}
				</ul>
			</div>
		{/each}
	{/if}
</div>
