<script lang="ts">
	import { PUBLIC_APP_TITLE, PUBLIC_DEFAULT_PRODUCT_IMAGE } from '$env/static/public';
	import { getShopState } from '$lib/client/shop.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Image } from '$lib/components/ui/image';
	import type { InventoryItem } from '$lib/services/inventory';
	import { cn } from '$lib/utils';
	import { splitNumberToString } from '$lib/utils/number-helper';
	import { scrollOnFocus } from '$lib/utils/scroll-helper';
	import { ArrowLeftIcon, FullscreenIcon } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import ImageDialog from '../image-dialog.svelte';
	import {
		filterProducts,
		getUniqueAgeGroups,
		getUniqueFabrics,
		groupProducts
	} from '../items-helper';
	import Preview from '../preview.svelte';

	let { data } = $props();
	const shop = getShopState();

	let selectedFabric = $state('');

	let items = $state<InventoryItem[]>([]);

	let fabrics = $derived.by(() => getUniqueFabrics(items));

	let selectedAgeGroup = $state('');
	let ageGroup = $derived.by(() => getUniqueAgeGroups(items, selectedFabric));

	$effect(() => {
		selectedFabric = fabrics.length >= 1 ? fabrics[0].id : '';
	});

	$effect(() => {
		selectedAgeGroup = ageGroup.length >= 1 ? ageGroup[0].id : '';
	});

	let products = $derived.by(() => filterProducts(items, selectedFabric, selectedAgeGroup));

	let loaded = $state(false);
	onMount(async () => {
		const action = await data.streamed.result;
		items = action?.result.data || [];
		shop.lastShop = window.location.href;
		loaded = true;
	});

	let imageDialog: { show: (url: string) => void };
</script>

<svelte:head>
	<title>{PUBLIC_APP_TITLE} | Beddings</title>
	<meta
		name="description"
		content="Explore our luxurious bedding collection, featuring sustainable materials and exquisite designs."
	/>
</svelte:head>

<div class="flex flex-col">
	<div class="xl:place-self-center w-full xl:max-w-7xl">
		<div class="mx-6 my-4">
			<p class="font-medium text-xl">Sustainably Luxurious</p>
			<p class="font-light text-lg">— Choose Your Signature Bedding Fabric</p>
		</div>
		{#if loaded}
			<div class="flex flex-col gap-2">
				{#if fabrics.length > 1}
					<div class="relative">
						<div
							class="left-0 absolute inset-y-0 bg-linear-to-r from-background/75 to-transparent w-8 pointer-events-none"
						></div>
						<div class="flex items-center gap-4 px-8 overflow-x-auto scroll-smooth no-scrollbar">
							{#each fabrics as fabric}
								<button
									use:scrollOnFocus={selectedFabric === fabric.id}
									onclick={() => {
										selectedFabric = fabric.id;
										selectedAgeGroup = '';
									}}
									class={cn(
										'px-4 py-2 border border-transparent hover:border-primary/40 rounded-full font-medium text-sm text-nowrap transition-colors duration-300',
										selectedFabric === fabric.id ? 'bg-primary text-primary-foreground' : ''
									)}
								>
									{fabric.name}
								</button>
							{/each}
						</div>
						<div
							class="right-0 absolute inset-y-0 bg-linear-to-l from-background/75 to-transparent w-8 pointer-events-none"
						></div>
					</div>
				{/if}
				{#if fabrics.length > 1 && ageGroup.length > 1}
					<div class="relative">
						<div
							class="left-0 absolute inset-y-0 bg-linear-to-r from-background/75 to-transparent w-8 pointer-events-none"
						></div>
						<div class="flex items-center gap-4 px-8 overflow-x-auto scroll-smooth no-scrollbar">
							{#each ageGroup as group}
								<button
									onclick={() => (selectedAgeGroup = group.id)}
									use:scrollOnFocus={selectedAgeGroup === group.id}
									class={cn(
										'px-4 py-2 rounded-full text-nowrap',
										selectedAgeGroup === group.id ? 'text-secondary' : ''
									)}
								>
									{group.name}
									<div
										class={cn(
											'bg-secondary opacity-0 rounded-lg w-0 h-1 transition-all duration-300',
											selectedAgeGroup === group.id ? 'w-full opacity-100' : ''
										)}
									></div>
								</button>
							{/each}
						</div>
						<div
							class="right-0 absolute inset-y-0 bg-linear-to-l from-background/75 to-transparent w-8 pointer-events-none"
						></div>
					</div>
				{:else if ageGroup.length > 1}
					<div class="relative">
						<div
							class="left-0 absolute inset-y-0 bg-linear-to-r from-background/75 to-transparent w-8 pointer-events-none"
						></div>
						<div class="flex items-center gap-4 px-8 overflow-x-auto scroll-smooth no-scrollbar">
							{#each ageGroup as group}
								<button
									use:scrollOnFocus={selectedAgeGroup === group.id}
									onclick={() => (selectedAgeGroup = group.id)}
									class={cn(
										'last:mr-2 px-4 py-2 border border-transparent hover:border-primary/40 rounded-full font-medium text-sm text-nowrap transition-colors duration-300',
										selectedAgeGroup === group.id ? 'bg-primary text-white' : ''
									)}
								>
									{group.name}
								</button>
							{/each}
						</div>
						<div
							class="right-0 absolute inset-y-0 bg-linear-to-l from-background/75 to-transparent w-8 pointer-events-none"
						></div>
					</div>
				{/if}

				{#if products.length > 0}
					<div class="flex flex-col gap-4 m-6">
						{#each groupProducts(products) as [gender, items]}
							<div class="flex flex-col gap-4">
								<span class="font-semibold text-lg">{gender}</span>
								<div class="flex flex-wrap gap-4">
									{#each items ?? [] as item}
										{@const { wholeNumber, decimal } = splitNumberToString(item.price)}
										<div
											class="group isolate relative bg-accent shadow-sm rounded-3xl w-full sm:w-74 overflow-clip transition-all duration-300"
										>
											<div class="overflow-clip">
												<Image
													class="w-full h-60"
													imageClass="h-full w-full object-cover group-hover:scale-105"
													src={item.image || PUBLIC_DEFAULT_PRODUCT_IMAGE}
													alt={item.product.name}
													transform="g_auto:classic,w_500,c_fill"
												/>
											</div>
											<div class="flex flex-col p-4">
												<span class="text-muted-foreground text-sm">{item.fabric.name}</span>
												<a
													href="/add-to-bag?productId={item.product.id}&fabricId={item.fabric
														.id}&ageGroupId={item.ageGroup?.id}&genderGroupId={item.genderGroup
														?.id}"
													class="font-semibold text-wrap"
												>
													<span class="z-40 absolute inset-0"></span>
													{item.product.name}
												</a>
												{#if item.sets && item.sets.length > 0}
													{@const sortedSets = [...item.sets].sort((a, b) => a.index - b.index)}
													{#each sortedSets as set}
														<div class="space-y-1 text-xs">
															<span>{set.quantity}</span>
															<span>{set.name}</span>
														</div>
													{/each}
												{/if}
												<span class="mt-4 text-muted-foreground text-xs">from</span>
												<div class="flex items-baseline gap-2">
													<span class="font-medium text-xs">₱</span>
													<div class="flex gap-1">
														<span class="font-semibold text-lg">{wholeNumber}</span>
														<span class="mt-1 font-medium text-xs align-top">
															{decimal}
														</span>
													</div>
												</div>
											</div>
											{#if item.image}
												<button
													onclick={() => imageDialog.show(item.image!)}
													class="top-0 left-0 z-50 absolute flex justify-center items-center bg-background/50 hover:bg-background/70 backdrop-blur-md m-4 p-1.5 border border-white/20 rounded-full text-foreground/50 transition-all duration-300 col-1 row-1"
												>
													<FullscreenIcon class="size-6" />
												</button>
											{/if}
										</div>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				{/if}
				<Button variant="ghost" href="/loungewear" class="place-self-start shadow-none mx-6 mb-20">
					<ArrowLeftIcon />
					Go to Loungewear
				</Button>
			</div>
		{:else}
			<Preview />
		{/if}
	</div>
</div>
<ImageDialog bind:this={imageDialog} />
