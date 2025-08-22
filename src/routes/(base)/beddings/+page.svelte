<script lang="ts">
	import { PUBLIC_DEFAULT_PRODUCT_IMAGE } from '$env/static/public';
	import { getShopState } from '$lib/client/shop.svelte.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils';
	import { transform } from '$lib/utils/image-helper.js';
	import { splitNumberToString } from '$lib/utils/number-helper';
	import { scrollOnFocus } from '$lib/utils/scroll-helper';
	import { ArrowLeftIcon } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import {
		filterProducts,
		getUniqueAgeGroups,
		getUniqueFabrics,
		groupProducts
	} from '../items-helper.js';

	let { data } = $props();
	const shop = getShopState();

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

	onMount(() => {
		shop.lastShop = window.location.href;
	});
</script>

<div class="flex flex-col">
	<div class="w-full xl:max-w-[1280px] xl:place-self-center">
		<div class="mx-6 my-4">
			<p class="text-xl font-medium">
				Silky-soft, naturally breathable, and gentle on sensitive skin
			</p>
			<p class="text-lg font-light">— made for dreamers of all ages.</p>
		</div>
		<div class="flex flex-col gap-2">
			{#if fabrics.length > 1}
				<div class="relative">
					<div
						class="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background/75 to-transparent"
					></div>
					<div class="no-scrollbar flex items-center gap-4 overflow-x-auto scroll-smooth px-8">
						{#each fabrics as fabric}
							<button
								use:scrollOnFocus={selectedFabric === fabric.id}
								onclick={() => {
									selectedFabric = fabric.id;
									selectedAgeGroup = '';
								}}
								class={cn(
									'rounded-full border border-transparent px-4 py-2 text-sm font-medium text-nowrap transition-colors duration-300 hover:border-primary/40',
									selectedFabric === fabric.id ? 'bg-primary text-primary-foreground' : ''
								)}
							>
								{fabric.name}
							</button>
						{/each}
					</div>
					<div
						class="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background/75 to-transparent"
					></div>
				</div>
			{/if}
			{#if fabrics.length > 1 && ageGroup.length > 1}
				<div class="relative">
					<div
						class="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background/75 to-transparent"
					></div>
					<div class="no-scrollbar flex items-center gap-4 overflow-x-auto scroll-smooth px-8">
						{#each ageGroup as group}
							<button
								onclick={() => (selectedAgeGroup = group.id)}
								use:scrollOnFocus={selectedAgeGroup === group.id}
								class={cn(
									'rounded-full px-4 py-2 text-nowrap',
									selectedAgeGroup === group.id ? 'text-secondary' : ''
								)}
							>
								{group.name}
								<div
									class={cn(
										'h-1 w-0 rounded-lg bg-secondary opacity-0 transition-all duration-300',
										selectedAgeGroup === group.id ? 'w-full opacity-100' : ''
									)}
								></div>
							</button>
						{/each}
					</div>
					<div
						class="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background/75 to-transparent"
					></div>
				</div>
			{:else if ageGroup.length > 1}
				<div class="relative">
					<div
						class="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background/75 to-transparent"
					></div>
					<div class="no-scrollbar flex items-center gap-4 overflow-x-auto scroll-smooth px-8">
						{#each ageGroup as group}
							<button
								use:scrollOnFocus={selectedAgeGroup === group.id}
								onclick={() => (selectedAgeGroup = group.id)}
								class={cn(
									'rounded-full border border-transparent px-4 py-2 text-sm font-medium text-nowrap transition-colors duration-300 last:mr-2 hover:border-primary/40',
									selectedAgeGroup === group.id ? 'bg-primary text-white' : ''
								)}
							>
								{group.name}
							</button>
						{/each}
					</div>
					<div
						class="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background/75 to-transparent"
					></div>
				</div>
			{/if}

			{#if products.length > 0}
				<div class="m-6 flex flex-col gap-4">
					{#each groupProducts(products) as [gender, items]}
						<div class="flex flex-col gap-4">
							<span class="text-lg font-semibold">{gender}</span>
							<div class="flex flex-wrap gap-4">
								{#each items ?? [] as item}
									{@const { wholeNumber, decimal } = splitNumberToString(item.price)}
									{@const image =
										item.image === null || item.image === '' || item.image === undefined
											? PUBLIC_DEFAULT_PRODUCT_IMAGE
											: item.image}

									<div
										class="group transition-width relative isolate w-full overflow-clip rounded-3xl bg-[#EEEEEE] sm:w-[296px]"
									>
										<div class="overflow-clip">
											<img
												class="flex h-[240px] w-full flex-col object-cover text-center duration-300 group-hover:scale-110"
												src={transform(image, 'g_auto:classic,h_600,c_fill')}
												alt={item.product.name}
												loading="lazy"
												decoding="async"
											/>
										</div>
										<div class=" flex flex-col p-4">
											<span class="text-sm text-muted-foreground">{item.fabric.name}</span>
											<a
												href="/add-to-bag?productId={item.product.id}&fabricId={item.fabric
													.id}&ageGroupId={item.ageGroup?.id}&genderGroupId={item.genderGroup?.id}"
												class="font-semibold text-wrap"
											>
												<span class="absolute inset-0 z-40"></span>
												{item.product.name}
											</a>
											{#if item.sets && item.sets.length > 0}
												{#each item.sets.sort((a, b) => a.index - b.index) as set}
													<div class="space-y-1 text-xs">
														<span>{set.quantity}</span>
														<span>{set.name}</span>
													</div>
												{/each}
											{/if}
											<span class="mt-4 text-xs text-muted-foreground">from</span>
											<div class="flex items-baseline gap-2">
												<span class="text-xs font-medium">₱</span>
												<div class="flex gap-1">
													<span class="text-lg font-semibold">{wholeNumber}</span>
													<span class="mt-1 align-top text-xs font-medium">
														{decimal}
													</span>
												</div>
											</div>
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			{/if}
			<Button
				variant="ghost"
				href="/loungewear"
				class="mx-6 mb-20 place-self-start rounded-lg shadow-none"
			>
				<ArrowLeftIcon />
				Go to Loungewear
			</Button>
		</div>
	</div>
</div>
