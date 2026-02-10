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
			<div class="grid p-4 w-full">
				{#each images as image}
					<div
						class={cn(
							'flex-col flex-[0_0_100%] opacity-0 rounded-xl h-full overflow-clip transition-all duration-300 snap-start col-1 row-1 shrink-0',
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
					class="z-20 flex justify-center items-center place-self-start bg-background/50 hover:bg-background/70 backdrop-blur-md m-4 p-1.5 border border-white/20 rounded-full text-foreground/50 transition-all duration-300 col-1 row-1"
				>
					<FullscreenIcon class="size-6" />
				</button>
			</div>
		{/if}
	</div>
	<div class="gap-2 grid grid-cols-[1fr-auto] mx-8">
		{#if info}
			<div class="col-1">
				<p class="text-muted-foreground text-sm">{info.fabric.name}</p>
				<p class="font-semibold text-lg">{info.product.name}</p>
				<div class="flex gap-2 text-sm">
					{#if info.ageGroup}
						<p class="bg-accent px-2 py-0.5 rounded-full">
							{info.ageGroup.name}
						</p>
					{/if}

					{#if info.genderGroup}
						<p class="bg-accent px-2 py-0.5 rounded-full">
							{info.genderGroup.name}
						</p>
					{/if}
				</div>
			</div>
			{@const { wholeNumber, decimal } = splitNumberToString(price)}
			<div class="flex justify-end items-baseline gap-2 col-2">
				<span class="font-medium text-primary text-xs">₱</span>
				<div class="flex gap-1">
					<span class="font-semibold text-lg">{wholeNumber}</span>
					<span class="mt-1 font-medium text-xs align-top">
						{decimal}
					</span>
				</div>
			</div>
		{/if}
	</div>

	{#if sizes}
		<div class="isolate relative">
			<span class="z-40 mx-6 text-sm">Size</span>
			<div
				class="left-0 absolute inset-y-0 bg-linear-to-r from-background/75 to-transparent w-8 pointer-events-none"
			></div>
			<div class="flex items-center gap-4 px-6 overflow-x-auto scroll-smooth no-scrollbar">
				{#each sizes as size}
					<button
						use:scrollOnFocus={selectedSize?.id === size.id}
						onclick={() => (selectedSize = size)}
						class={cn(
							'px-4 py-2 rounded-full font-medium text-sm text-nowrap transition-colors duration-300',
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
				class="right-0 absolute inset-y-0 bg-linear-to-l from-background/75 to-transparent w-8 pointer-events-none"
			></div>
		</div>
	{/if}

	{#if colors}
		<div class="isolate relative">
			<span class="z-40 mx-6 text-sm">Color {selectedColor ? `- ${selectedColor.name}` : ''}</span>
			<div
				class="left-0 absolute inset-y-0 bg-linear-to-r from-background/75 to-transparent w-8 pointer-events-none"
			></div>
			<div
				class="flex items-center gap-4 -mt-2 px-6 py-4 overflow-x-auto scroll-smooth no-scrollbar"
			>
				{#each colors as color}
					<button
						aria-label={color.name}
						use:scrollOnFocus={selectedColor?.id === color.id}
						onclick={() => onColorChanged(color)}
						style="background-color: {color.hexCode}"
						class={cn(
							'flex justify-center border rounded-full size-6 transition-all duration-300',
							selectedColor?.id === color.id ? 'scale-125' : ''
						)}
					>
						<CheckIcon
							style={`stroke:${textColorBasedOnBackground(color.hexCode)}`}
							class={cn(
								'place-self-center opacity-0 size-4 transition-opacity duration-300',
								selectedColor?.id === color.id ? 'opacity-100' : ''
							)}
						/>
					</button>
				{/each}
			</div>
			<div
				class="right-0 absolute inset-y-0 bg-linear-to-l from-background/75 to-transparent w-8 pointer-events-none"
			></div>
		</div>
	{/if}

	<div class="flex flex-col gap-2">
		<div class="flex items-center gap-2 mx-6 text-sm">
			Quantity
			{#if available === 0}
				<span class="bg-destructive px-2 py-1 rounded-md text-white text-sm">Sold out</span>
			{:else}
				<span
					class={cn(
						'px-2 py-1 rounded-md text-sm',
						available <= 3 ? 'bg-secondary' : ' bg-green-700 text-white'
					)}
				>
					{available} available
				</span>
			{/if}
		</div>
		<div class="isolate flex items-center mx-6">
			<Button
				variant="outline"
				onclick={() => quantity--}
				class="focus:z-10 shadow-none rounded-none rounded-l-full w-11 h-9"
				size="icon"
			>
				<MinusIcon />
			</Button>
			<input
				type="number"
				bind:value={quantity}
				class="focus:z-10 flex bg-background selection:bg-primary dark:bg-input/30 disabled:opacity-50 px-2 py-1 border-input border-y focus-visible:border-ring outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 ring-offset-background min-w-0 size-9 font-medium selection:text-primary-foreground placeholder:text-muted-foreground md:text-sm text-center transition-[color,box-shadow] disabled:cursor-not-allowed"
			/>
			<Button
				variant="outline"
				onclick={() => quantity++}
				class="focus:z-10 shadow-none rounded-none rounded-r-full w-11 h-9"
			>
				<PlusIcon />
			</Button>
		</div>
	</div>

	{#if info && info.product.description}
		<div class="flex flex-col gap-2">
			<span class="mx-6 text-sm">Description</span>
			<p class="mx-6 text-muted-foreground text-sm whitespace-pre-line">
				{info.product.description}
			</p>
		</div>
	{/if}

	<div bind:this={footerEl} class="flex flex-col gap-4 mx-6 mt-6 mb-6">
		<button
			onclick={onSubmit}
			disabled={quantity === 0}
			class="inline-flex justify-center items-center bg-primary/85 hover:bg-primary/95 disabled:opacity-50 px-6 py-3 border border-primary-foreground/10 rounded-full w-full font-medium text-primary-foreground text-sm text-center transition-all duration-300 disabled:cursor-not-allowed"
		>
			<ShoppingBagIcon class="inline-block mr-2 size-5" />
			Add to Bag
		</button>
		<Button
			variant="ghost"
			class="place-self-start shadow-none rounded-full"
			onclick={() => history.back()}
		>
			<ArrowLeftIcon />
			Back
		</Button>
	</div>
	<div
		class={cn(
			'bottom-0 fixed flex justify-center bg-linear-to-t from-background to-transparent pb-6 w-full h-16 transition-all duration-300',
			hideFloating ? 'pointer-events-none translate-y-full opacity-0' : 'opacity-100'
		)}
	>
		<div class="place-self-center bg-background rounded-full overflow-clip">
			<button
				onclick={onSubmit}
				disabled={quantity === 0}
				class="inline-flex bg-primary/85 hover:bg-primary/95 disabled:opacity-50 backdrop-blur-sm px-6 py-3 border border-primary-foreground/10 font-medium text-primary-foreground text-sm text-center transition-all duration-300 disabled:cursor-not-allowed"
			>
				<ShoppingBagIcon class="inline-block mr-2 size-5" />
				Add to Bag
			</button>
		</div>
	</div>
</section>
<ImageDialog bind:this={imageDialog} />
