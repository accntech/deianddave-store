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
			const fabricId = item.fabricId;
			if (!seen.has(fabricId)) {
				seen.add(fabricId);
				unique.push({
					id: fabricId,
					name: item.fabricName
				});
			}
		}

		if (unique.length === 0) {
			return [];
		}

		if (unique.length === 1) {
			return unique;
		}

		unique.sort((a, b) => a.name.localeCompare(b.name));
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
			if (selectedFabric && item.fabricId !== selectedFabric) continue;

			const ageGroupId = item.ageGroupId;
			if (!seen.has(ageGroupId)) {
				seen.add(ageGroupId);

				if (ageGroupId) {
					unique.push({
						id: ageGroupId,
						name: item.ageGroupName
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

		unique.sort((a, b) => a.name.localeCompare(b.name));

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
			if (selectedFabric && item.fabricId !== selectedFabric) continue;
			if (selectedAgeGroup && item.ageGroupId !== selectedAgeGroup) continue;

			const key = `${item.productId}|${item.fabricId}|${item.genderGroupId}|${item.status}`;
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
			productId: x.productId,
			productName: x.productName,
			productDescription: x.productDescription,
			productImage: x.productImage,
			fabricId: x.fabricId,
			fabricName: x.fabricName,
			ageGroupId: x.ageGroupId,
			ageGroupName: x.ageGroupName,
			genderGroupId: x.genderGroupId,
			genderGroupName: x.genderGroupName,
			productSets: x.productSets,
			status: x.status,
			price: x.price,
			image: x.image
		})) as Product[];

		if (unique.length <= 1) {
			return products;
		}

		products.sort((a, b) => a.productName.localeCompare(b.productName));
		return products;
	});
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
		{#each Object.entries(Object.groupBy(products, (item) => item.genderGroupName || '')).sort( ([a], [b]) => a.localeCompare(b) ) as [gender, items]}
			<div class="mb-2">
				<div class="mb-1 text-lg font-bold">{gender}</div>
				<ul class="ml-4 flex list-disc gap-4">
					{#each items ?? [] as item}
						<a
							class="group max-w-[300px] overflow-clip rounded-2xl border"
							href="/add-to-cart?productId={item.productId}&fabricId={item.fabricId}&ageGroupId={item.ageGroupId}&genderGroupId={item.genderGroupId}"
						>
							<div class="overflow-clip">
								<img
									class="transition-scale size-[300px] object-cover duration-300 group-hover:scale-110"
									src={item.productImage === '' ? PUBLIC_DEFAULT_PRODUCT_IMAGE : item.productImage}
									alt={item.productName}
									loading="lazy"
									decoding="async"
								/>
							</div>
							<div class="p-4">
								<span class="text-wrap">{item.productName}</span>
								<span>{item.fabricName}</span>
								{#each item.productSets as set}
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
