<script lang="ts">
	import { PUBLIC_DEFAULT_PRODUCT_IMAGE } from '$env/static/public';
	import { Button } from '$lib/components/ui/button';
	import { Image } from '$lib/components/ui/image';
	import { cn } from '$lib/utils';
	import { textColorBasedOnBackground } from '$lib/utils/color-helper';
	import { splitNumberToString } from '$lib/utils/number-helper';
	import { scrollOnFocus } from '$lib/utils/scroll-helper';
	import { ArrowLeftIcon, CheckIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from '@lucide/svelte';

	import type { Info, Props } from './types';

	let {
		selectedImage = $bindable<string>(),
		images = $bindable<string[]>(),
		info = $bindable<Info>(),
		price = $bindable<number>(),
		selectedSize = $bindable<{ id: string; name: string }>(),
		sizes = $bindable<Array<{ id: string; name: string }>>(),
		selectedColor = $bindable<{ id: string; name: string; hexCode: string }>(),
		colors = $bindable<Array<{ id: string; name: string; hexCode: string }>>(),
		available = $bindable<number>(),
		quantity = $bindable<number>(),
		onSubmit = $bindable<() => void>()
	}: Props = $props();

	const isDefaultImage = (image: string) => image === PUBLIC_DEFAULT_PRODUCT_IMAGE;
	const source = (image: string) => image || PUBLIC_DEFAULT_PRODUCT_IMAGE;
</script>

<section class="relative flex flex-col gap-4">
	<div class="relative h-[360px] overflow-clip rounded-b-3xl">
		{#if images.length <= 1}
			<Image
				imageClass={cn(isDefaultImage(source(images[0])) ? '' : 'object-top')}
				src={source(images[0])}
				alt={info.product.name}
				transform="h_500,c_fill"
			/>
		{:else}
			<div class="relative inset-0 flex">
				{#each images as image}
					<div
						class={cn(
							'absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500',
							selectedImage === image ? 'opacity-100' : ''
						)}
					>
						<Image
							imageClass={cn(isDefaultImage(source(image)) ? '' : 'object-top')}
							src={source(image)}
							alt={info.product.name}
							transform="h_500,c_fill"
						/>
					</div>
				{/each}
			</div>
		{/if}
		{#if images.length > 1}
			<div
				class="absolute bottom-0 isolate m-1 no-scrollbar flex w-full gap-1 overflow-x-auto overflow-y-hidden scroll-smooth p-8"
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
						<Image
							src={image}
							alt={info.product.name}
							imageClass="object-cover object-middle"
							class="h-24 w-46 object-cover"
							transform="h_275,c_fill"
						/>
					</button>
				{/each}
			</div>
		{/if}
	</div>
	<div class="mx-8 grid grid-cols-[1fr-auto] gap-2">
		{#if info}
			<div class="col-1">
				<p class="text-sm text-muted-foreground">{info.fabric.name}</p>
				<p class="text-lg font-semibold">{info.product.name}</p>
				<div class="flex gap-2 text-sm">
					{#if info.ageGroup}
						<p class="rounded-full bg-accent px-2 py-0.5">
							{info.ageGroup.name}
						</p>
					{/if}

					{#if info.genderGroup}
						<p class="rounded-full bg-accent px-2 py-0.5">
							{info.genderGroup.name}
						</p>
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
		class="mx-6 mt-6 mb-24 place-self-start rounded-lg shadow-none"
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
</section>
