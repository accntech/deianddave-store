<script lang="ts">
	import { PUBLIC_DEFAULT_PRODUCT_IMAGE } from '$env/static/public';
	import { cn } from '$lib/utils';
	import { scrollOnFocus } from '$lib/utils/scroll-helper.js';
	import {
		filterProducts,
		getUniqueAgeGroups,
		getUniqueFabrics,
		groupProducts
	} from '../items-helper.js';

	let { data } = $props();

	let selectedFabric = $state('');
	let fabrics = $derived.by(() => getUniqueFabrics(data.result?.data || []));

	let selectedAgeGroup = $state('');
	let ageGroup = $derived.by(() => getUniqueAgeGroups(data.result?.data || [], selectedFabric));

	$effect(() => {
		selectedFabric = fabrics.length >= 1 ? fabrics[0].id : '';
	});

	$effect(() => {
		selectedAgeGroup = ageGroup.length >= 1 ? ageGroup[0].id : '';
	});

	let products = $derived.by(() =>
		filterProducts(data.result?.data || [], selectedFabric, selectedAgeGroup)
	);
</script>

<div class="flex flex-col gap-4">
	{#if fabrics.length > 1}
		<div class="relative">
			<div
				class="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white/95 to-transparent"
			></div>
			<div class="no-scrollbar flex items-center gap-4 overflow-x-auto scroll-smooth px-2">
				<div class="w-1 shrink-0" aria-hidden="true"></div>
				{#each fabrics as fabric}
					<button
						use:scrollOnFocus={selectedFabric === fabric.id}
						onclick={() => {
							selectedFabric = fabric.id;
							selectedAgeGroup = '';
						}}
						class={cn(
							'rounded-full border border-transparent px-4 py-2 text-sm font-medium text-nowrap transition-colors duration-300 hover:border-primary/40',
							selectedFabric === fabric.id ? 'bg-primary text-white' : ''
						)}
					>
						{fabric.name}
					</button>
				{/each}
				<div class="w-1 shrink-0" aria-hidden="true"></div>
			</div>
			<div
				class="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white/95 to-transparent"
			></div>
		</div>
	{/if}
	{#if fabrics.length > 1}
		{#if ageGroup.length > 1}
			<ul class="flex items-center gap-4">
				{#each ageGroup as group}
					<button
						onclick={() => (selectedAgeGroup = group.id)}
						class={cn(
							'rounded-full px-4 py-2 ',
							selectedAgeGroup === group.id ? 'text-primary' : ''
						)}
					>
						{group.name}
						<div
							class={cn(
								'h-1 w-0 rounded-full bg-primary opacity-0 transition-all duration-300',
								selectedAgeGroup === group.id ? 'w-full opacity-100' : ''
							)}
						></div>
					</button>
				{/each}
			</ul>
		{/if}
	{:else}
		<div class="relative">
			<div
				class="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white/95 to-transparent"
			></div>
			<div class="no-scrollbar flex items-center gap-4 overflow-x-auto scroll-smooth px-2">
				<div class="w-1 shrink-0" aria-hidden="true"></div>
				{#each ageGroup as group}
					<button
						use:scrollOnFocus={selectedAgeGroup === group.id}
						onclick={() => (selectedAgeGroup = group.id)}
						class={cn(
							'rounded-full border border-transparent px-4 py-2 text-sm font-medium text-nowrap transition-colors duration-300 hover:border-primary/40',
							selectedAgeGroup === group.id ? 'bg-primary text-white' : ''
						)}
					>
						{group.name}
					</button>
				{/each}
				<div class="w-1 shrink-0" aria-hidden="true"></div>
			</div>
			<div
				class="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white/95 to-transparent"
			></div>
		</div>
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
								{#if item.sets && item.sets.length > 0}
									{#each item.sets.sort((a, b) => a.index - b.index) as set}
										<div>
											<span>{set.quantity}</span>
											<span>{set.name}</span>
										</div>
									{/each}
								{/if}
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
