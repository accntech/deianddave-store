<script lang="ts">
	import { goto } from '$app/navigation';
	import { getCartState } from '$lib/client/cart.svelte.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import { textColorBasedOnBackground } from '$lib/utils/color-helper.js';
	import { transform } from '$lib/utils/image-helper';
	import { splitNumberToString } from '$lib/utils/number-helper';
	import { scrollOnFocus } from '$lib/utils/scroll-helper';
	import { ArrowLeftIcon, CheckIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let { data } = $props();

	let info = $derived.by(() => {
		const items = data.result!.data;

		const item = items[0];
		return {
			id: item.id,
			product: item.product,
			fabric: item.fabric,
			ageGroup: item.ageGroup,
			genderGroup: item.genderGroup
		};
	});

	let sizes = $derived.by(() => {
		const result = data.result;

		if (!result?.data?.length) return [];

		const seen = new Set();
		const unique = [];

		for (const item of result.data) {
			if (!seen.has(item.size.id)) {
				seen.add(item.size.id);
				unique.push(item.size);
			}
		}
		return unique.sort((a, b) => {
			if (a.index !== b.index) {
				return a.index - b.index;
			}
			return a.name.localeCompare(b.name);
		});
	});

	let colors = $derived.by(() => {
		const result = data.result;

		if (!result?.data?.length) return [];

		const seen = new Set();
		const unique = [];

		for (const item of result.data) {
			if (!seen.has(item.color.id)) {
				seen.add(item.color.id);
				unique.push(item.color);
			}
		}
		return unique.sort((a, b) => {
			if (a.index !== b.index) {
				return a.index - b.index;
			}
			return a.name.localeCompare(b.name);
		});
	});

	let selectedImage = $state('');
	let images = $derived.by(() => {
		const result = data.result;
		const list = result?.data ?? [];
		if (!list.length) return [] as string[];

		const seen = new Set<string>();
		const entries: { image: string; colorIndex: number; colorName: string }[] = [];

		for (let i = 0; i < list.length; i++) {
			const item = list[i];
			const colorId = item?.color?.id as string | undefined;
			if (!colorId || seen.has(colorId)) continue;

			const img = (item?.image ?? '') as string;
			const trimmed = typeof img === 'string' ? img.trim() : '';
			if (!trimmed) continue;

			seen.add(colorId);
			entries.push({
				image: trimmed,
				colorIndex: (item.color?.index ?? 0) as number,
				colorName: (item.color?.name ?? '') as string
			});
		}

		entries.sort((a, b) => {
			if (a.colorIndex !== b.colorIndex) return a.colorIndex - b.colorIndex;
			return a.colorName.localeCompare(b.colorName);
		});

		return entries.map((x) => x.image);
	});

	let selectedSize = $state({}) as { id: string; name: string };
	let selectedColor = $state({}) as { id: string; name: string; hexCode: string };

	let selectedItem = $derived.by(() => {
		const result = data.result;

		if (!result?.data?.length) return null;

		return result.data.find(
			(item) => item.size.id === selectedSize.id && item.color.id === selectedColor.id
		);
	});

	let available = $derived.by(() => {
		if (!selectedItem) return 0;

		return selectedItem?.quantity || 0;
	});

	let quantity = $state(1);

	$effect(() => {
		if (quantity == null || Number.isNaN(quantity)) {
			quantity = 0;
		}
		if (quantity < 0) {
			quantity = 0;
		}

		if (quantity > available) {
			quantity = available;
		}

		if (quantity === 0 && available > 0) {
			quantity = 1;
		}
	});

	let price = $derived.by(() => {
		const result = data.result;

		if (!result?.data?.length) return 0;

		const item = result.data.find(
			(item) => item.size.id === selectedSize.id && item.color.id === selectedColor.id
		);
		const price = item?.price || 0;

		return price * quantity;
	});

	onMount(() => {
		if (images.length > 0) {
			selectedImage = images[0];
		}
		selectedSize = sizes[0];
		selectedColor = colors[0];
		quantity = available > 0 ? 1 : 0;
	});

	const cart = getCartState();

	const onSubmit = async () => {
		if (selectedItem) {
			const matchIndex = cart.orders.findIndex(({ item }) => {
				return (
					item.product.id === selectedItem.product.id &&
					item.fabric.id === selectedItem.fabric.id &&
					(item.genderGroup?.id ?? null) === (selectedItem.genderGroup?.id ?? null) &&
					(item.ageGroup?.id ?? null) === (selectedItem.ageGroup?.id ?? null) &&
					item.size.id === selectedItem.size.id &&
					item.color.id === selectedItem.color.id
				);
			});

			if (matchIndex !== -1) {
				const existing = cart.orders[matchIndex];
				cart.orders[matchIndex] = {
					...existing,
					quantity: existing.quantity + quantity
				};
			} else {
				cart.orders.push({
					quantity,
					item: selectedItem
				});
			}

			goto('/check-out');
		}
	};
</script>

<div class="relative flex flex-col gap-4">
	<div
		class="relative -mt-16 h-[364px] overflow-clip rounded-b-3xl bg-gradient-to-t from-[#EEEEEE] to-transparent"
	>
		<img
			src={transform(selectedImage, 'h_650,c_fill')}
			class="h-full w-full [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_35%,rgba(0,0,0,1)_100%)] [mask-size:100%_100%] [mask-repeat:no-repeat] object-cover [-webkit-mask-image:linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_35%,rgba(0,0,0,1)_100%)] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:100%_100%]"
			alt={info.product.name}
		/>
		{#if images.length}
			<div
				class={cn(
					'absolute bottom-0 isolate m-1 no-scrollbar flex w-full gap-1 overflow-x-auto overflow-y-hidden scroll-smooth p-8',
					images.length === 1 ? 'justify-center' : ''
				)}
			>
				{#each images as image}
					<button
						class={cn(
							'shrink-0 overflow-clip rounded-md opacity-75 transition-all duration-300',
							selectedImage === image ? 'z-10 scale-125 opacity-100 shadow-lg' : ''
						)}
						use:scrollOnFocus={selectedImage === image}
						onclick={() => (selectedImage = image)}
					>
						<img
							src={transform(image, 'h_375,c_fill')}
							alt={info.product.name}
							class="h-24 w-46 object-cover"
							loading="lazy"
						/>
					</button>
				{/each}
			</div>
		{/if}
	</div>
	<div class="mx-8 grid grid-cols-[1fr-auto] gap-2">
		{#if info}
			<span class="text-sm text-muted-foreground">{info.fabric.name}</span>
			<div class="col-1">
				<span class="text-lg font-semibold">{info.product.name}</span>
				<div class="flex gap-4 text-sm">
					{#if info.ageGroup}
						<div class="flex gap-1">
							<p>{info.ageGroup.name}</p>
							{#if info.genderGroup}
								- <p>{info.genderGroup.name}</p>
							{/if}
						</div>
					{/if}
				</div>
			</div>
			{@const { wholeNumber, decimal } = splitNumberToString(price)}
			<div class="col-2 flex items-baseline justify-end gap-2">
				<span class="text-xs font-medium text-primary">₱</span>
				<div class="flex gap-1">
					<span class="text-lg font-semibold">{wholeNumber}</span>
					<span class="mt-1 align-top text-xs font-medium">
						{decimal}
					</span>
				</div>
			</div>
		{/if}
	</div>

	{#if sizes}
		<div class="relative isolate">
			<span class="z-40 mx-6 text-sm">Size</span>
			<div
				class="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background/75 to-transparent"
			></div>
			<div class="no-scrollbar flex items-center gap-4 overflow-x-auto scroll-smooth px-6">
				{#each sizes as size}
					<button
						use:scrollOnFocus={selectedSize.id === size.id}
						onclick={() => (selectedSize = size)}
						class={cn(
							'rounded-lg px-4 py-2 text-sm font-medium text-nowrap transition-colors duration-300 ',
							selectedSize.id === size.id
								? 'bg-secondary text-secondary-foreground hover:bg-secondary/60'
								: 'hover:bg-accent'
						)}
					>
						{size.name}
					</button>
				{/each}
			</div>
			<div
				class="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background/75 to-transparent"
			></div>
		</div>
	{/if}

	{#if colors}
		<div class="relative isolate">
			<span class="z-40 mx-6 text-sm">Color - {selectedColor.name}</span>
			<div
				class="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background/75 to-transparent"
			></div>
			<div
				class="-mt-2 no-scrollbar flex items-center gap-4 overflow-x-auto scroll-smooth px-6 py-4"
			>
				{#each colors as color}
					<button
						aria-label={color.name}
						use:scrollOnFocus={selectedColor.id === color.id}
						onclick={() => (selectedColor = color)}
						style="background-color: {color.hexCode}"
						class={cn(
							'flex size-6 justify-center rounded-full border transition-all duration-300',
							selectedColor.id === color.id ? 'scale-125' : ''
						)}
					>
						<CheckIcon
							style={`stroke:${textColorBasedOnBackground(color.hexCode)}`}
							class={cn(
								'size-4 place-self-center opacity-0 transition-opacity duration-300',
								selectedColor.id === color.id ? 'opacity-100' : ''
							)}
						/>
					</button>
				{/each}
			</div>
			<div
				class="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background/75 to-transparent"
			></div>
		</div>
	{/if}

	<div class="flex flex-col gap-2">
		<span class="mx-6 text-sm">Quantity - {available} available</span>
		<div class="isolate mx-6 flex items-center">
			<Button
				variant="outline"
				onclick={() => quantity--}
				class="h-9 w-11 rounded-none rounded-l-lg shadow-none focus:z-10"
				size="icon"
			>
				<MinusIcon />
			</Button>
			<input
				type="number"
				bind:value={quantity}
				class="flex size-9 min-w-0 border-y border-input bg-background px-2 py-1 text-center font-medium ring-offset-background transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30"
			/>
			<Button
				variant="outline"
				onclick={() => quantity++}
				class="h-9 w-11 rounded-none rounded-r-lg shadow-none focus:z-10"
			>
				<PlusIcon />
			</Button>
		</div>
	</div>

	{#if info.product.description}
		<div class="flex flex-col gap-2">
			<span class="mx-6 text-sm">Description</span>
			<p class="mx-6 text-sm whitespace-pre-line text-muted-foreground">
				{info.product.description}
			</p>
		</div>
	{/if}

	<Button
		variant="ghost"
		class="mx-6 mb-20 place-self-start rounded-lg shadow-none"
		onclick={() => history.back()}
	>
		<ArrowLeftIcon />
		Back
	</Button>
	<div
		class="fixed bottom-0 flex h-16 w-full justify-center bg-gradient-to-t from-background to-transparent pb-6"
	>
		<div class="place-self-center overflow-clip rounded-full bg-background">
			<button
				onclick={onSubmit}
				disabled={quantity === 0}
				class="inline-flex bg-primary px-6 py-3 text-center text-sm font-medium text-primary-foreground transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
			>
				<ShoppingBagIcon class="mr-2 inline-block size-5" />
				Add to Bag
			</button>
		</div>
	</div>
</div>
