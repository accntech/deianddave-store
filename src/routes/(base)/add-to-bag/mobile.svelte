<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Image } from '$lib/components/ui/image';
	import { cn } from '$lib/utils';
	import { textColorBasedOnBackground } from '$lib/utils/color-helper';
	import { splitNumberToString } from '$lib/utils/number-helper';
	import { scrollOnFocus } from '$lib/utils/scroll-helper';
	import {
		ArrowLeftIcon,
		CheckIcon,
		FullscreenIcon,
		MinusIcon,
		PlusIcon,
		ShoppingBagIcon
	} from '@lucide/svelte';

	import ImageDialog from '../image-dialog.svelte';
	import type { Info, Props } from './types';

	let {
		info = {} as Info,
		aspectRatio,
		onColorChanged,
		onSubmit,
		selectedImage = $bindable<{ source: string; colorId: string }>(),
		images = $bindable<Array<{ source: string; colorId: string }>>(),
		price = $bindable<number>(),
		selectedSize = $bindable<{ id: string; name: string }>(),
		sizes = $bindable<Array<{ id: string; name: string }>>(),
		selectedColor = $bindable<{ id: string; name: string; hexCode: string }>(),
		colors = $bindable<Array<{ id: string; name: string; hexCode: string }>>(),
		available = $bindable<number>(),
		quantity = $bindable<number>()
	}: Props = $props();

	let imageDialog: { show: (url: string) => void };
	let footerEl: HTMLElement;
	let footerVisible = $state(false);
	let atBottom = $state(false);
	let hideFloating = $derived(footerVisible || atBottom);

	$effect(() => {
		if (!footerEl) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				footerVisible = entry.isIntersecting;
			},
			{ threshold: 0 }
		);
		observer.observe(footerEl);
		return () => observer.disconnect();
	});

	$effect(() => {
		const onScroll = () => {
			const scrollTop = window.scrollY || document.documentElement.scrollTop;
			const scrollHeight = document.documentElement.scrollHeight;
			const clientHeight = document.documentElement.clientHeight;
			atBottom = scrollTop + clientHeight >= scrollHeight - 1;
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

<section class="relative flex flex-col gap-4">
	<div class="overflow-clip">
		{#if images.length > 0}
			<div class="grid w-full p-4">
				{#each images as image}
					<div
						class={cn(
							'col-1 row-1 h-full flex-[0_0_100%] shrink-0 snap-start flex-col overflow-clip rounded-xl opacity-0 transition-all duration-300 ',
							selectedImage.source === image.source ? 'z-10 opacity-100' : '',
							aspectRatio
						)}
					>
						<Image
							src={image.source}
							alt={info?.product.name ?? ''}
							imageClass="w-full h-full object-cover"
							transform="h_600,c_fill"
						/>
					</div>
				{/each}
				<button
					onclick={() => imageDialog.show(selectedImage.source)}
					class="z-20 col-1 row-1 m-4 flex items-center justify-center place-self-start rounded-full border border-white/20 bg-background/50 p-1.5 text-foreground/50 backdrop-blur-md transition-all duration-300 hover:bg-background/70"
				>
					<FullscreenIcon class="size-6" />
				</button>
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
				class="pointer-events-none absolute inset-y-0 left-0 w-8 bg-linear-to-r from-background/75 to-transparent"
			></div>
			<div class="no-scrollbar flex items-center gap-4 overflow-x-auto scroll-smooth px-6">
				{#each sizes as size}
					<button
						use:scrollOnFocus={selectedSize?.id === size.id}
						onclick={() => (selectedSize = size)}
						class={cn(
							'rounded-full px-4 py-2 text-sm font-medium text-nowrap transition-colors duration-300 ',
							selectedSize?.id === size.id
								? 'bg-secondary text-secondary-foreground hover:bg-secondary/60'
								: 'hover:bg-accent'
						)}
					>
						{size.name}
					</button>
				{/each}
			</div>
			<div
				class="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-background/75 to-transparent"
			></div>
		</div>
	{/if}

	{#if colors}
		<div class="relative isolate">
			<span class="z-40 mx-6 text-sm">Color {selectedColor ? `- ${selectedColor.name}` : ''}</span>
			<div
				class="pointer-events-none absolute inset-y-0 left-0 w-8 bg-linear-to-r from-background/75 to-transparent"
			></div>
			<div
				class="-mt-2 no-scrollbar flex items-center gap-4 overflow-x-auto scroll-smooth px-6 py-4"
			>
				{#each colors as color}
					<button
						aria-label={color.name}
						use:scrollOnFocus={selectedColor?.id === color.id}
						onclick={() => onColorChanged(color)}
						style="background-color: {color.hexCode}"
						class={cn(
							'flex size-6 justify-center rounded-full border transition-all duration-300',
							selectedColor?.id === color.id ? 'scale-125' : ''
						)}
					>
						<CheckIcon
							style={`stroke:${textColorBasedOnBackground(color.hexCode)}`}
							class={cn(
								'size-4 place-self-center opacity-0 transition-opacity duration-300',
								selectedColor?.id === color.id ? 'opacity-100' : ''
							)}
						/>
					</button>
				{/each}
			</div>
			<div
				class="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-background/75 to-transparent"
			></div>
		</div>
	{/if}

	<div class="flex flex-col gap-2">
		<div class="mx-6 flex items-center gap-2 text-sm">
			Quantity
			{#if available === 0}
				<span class="rounded-md bg-destructive px-2 py-1 text-sm text-white">Sold out</span>
			{:else}
				<span
					class={cn(
						'rounded-md px-2 py-1 text-sm',
						available <= 3 ? 'bg-secondary' : ' bg-green-700 text-white'
					)}
				>
					{available} available
				</span>
			{/if}
		</div>
		<div class="isolate mx-6 flex items-center">
			<Button
				variant="outline"
				onclick={() => quantity--}
				class="h-9 w-11 rounded-none rounded-l-full shadow-none focus:z-10"
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
				class="h-9 w-11 rounded-none rounded-r-full shadow-none focus:z-10"
			>
				<PlusIcon />
			</Button>
		</div>
	</div>

	{#if info && info.product.description}
		<div class="flex flex-col gap-2">
			<span class="mx-6 text-sm">Description</span>
			<p class="mx-6 text-sm whitespace-pre-line text-muted-foreground">
				{info.product.description}
			</p>
		</div>
	{/if}

	<div bind:this={footerEl} class="mx-6 mt-6 mb-6 flex flex-col gap-4">
		<button
			onclick={onSubmit}
			disabled={quantity === 0}
			class="inline-flex w-full items-center justify-center rounded-full border border-primary-foreground/10 bg-primary/85 px-6 py-3 text-center text-sm font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/95 disabled:cursor-not-allowed disabled:opacity-50"
		>
			<ShoppingBagIcon class="mr-2 inline-block size-5" />
			Add to Bag
		</button>
		<Button
			variant="ghost"
			class="place-self-start shadow-none"
			onclick={() => history.back()}
		>
			<ArrowLeftIcon />
			Back
		</Button>
	</div>
	<div
		class={cn(
			'fixed bottom-0 flex h-16 w-full justify-center bg-linear-to-t from-background to-transparent pb-6 transition-all duration-300',
			hideFloating ? 'pointer-events-none translate-y-full opacity-0' : 'opacity-100'
		)}
	>
		<div class="place-self-center overflow-clip rounded-full bg-background">
			<button
				onclick={onSubmit}
				disabled={quantity === 0}
				class="inline-flex border border-primary-foreground/10 bg-primary/85 px-6 py-3 text-center text-sm font-medium text-primary-foreground backdrop-blur-sm transition-all duration-300 hover:bg-primary/95 disabled:cursor-not-allowed disabled:opacity-50"
			>
				<ShoppingBagIcon class="mr-2 inline-block size-5" />
				Add to Bag
			</button>
		</div>
	</div>
</section>
<ImageDialog bind:this={imageDialog} />
