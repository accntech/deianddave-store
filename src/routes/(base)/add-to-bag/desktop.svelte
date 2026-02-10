<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Image } from '$lib/components/ui/image';
	import { cn } from '$lib/utils';
	import { textColorBasedOnBackground } from '$lib/utils/color-helper';
	import { splitNumberToString } from '$lib/utils/number-helper';
	import {
		ArrowLeftIcon,
		CheckIcon,
		FullscreenIcon,
		MinusIcon,
		PlusIcon,
		ShoppingBagIcon
	} from '@lucide/svelte';
	import type { Props } from './types';
	import ImageDialog from '../image-dialog.svelte';
	let {
		info,
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
</script>

<div class="flex justify-center px-4 py-12">
	<section class="flex xl:place-self-center gap-12 xl:max-w-7xl">
		<!-- image -->
		<div
			class="flex flex-col min-w-75 lg:min-w-100 max-w-100 lg:max-w-125 transition-[width] duration-300"
		>
			<div class={cn('relative grid', aspectRatio)}>
				{#each images as image (image.source)}
					<div
						class={cn(
							'flex flex-col col-start-1 row-start-1 opacity-0 rounded-xl overflow-clip transition-all duration-300',
							selectedImage.source === image.source ? 'z-10 opacity-100' : ''
						)}
					>
						<Image
							src={image.source}
							alt={info?.product.name ?? ''}
							imageClass="w-full h-full object-cover"
							transform="w_800,c_fill"
						/>
					</div>
				{/each}
				<button
					onclick={() => imageDialog.show(selectedImage.source)}
					class="top-2 left-2 z-20 absolute flex justify-center items-center bg-background/50 hover:bg-background/70 backdrop-blur-md p-1.5 border border-white/20 rounded-full text-foreground/50 transition-all duration-300"
				>
					<FullscreenIcon class="size-6" />
				</button>
			</div>
			{#if info && info.product.description}
				<div class="flex flex-col gap-2 mt-8 max-w-100">
					<span class="text-sm">Description</span>
					<p class="text-muted-foreground text-sm whitespace-pre-line">
						{info.product.description}
					</p>
				</div>
			{/if}
			<Button
				variant="ghost"
				class="place-self-start shadow-none mt-6"
				onclick={() => history.back()}
			>
				<ArrowLeftIcon />
				Back
			</Button>
		</div>
		<!-- details -->
		{#if info}
			{@const { wholeNumber, decimal } = splitNumberToString(price)}
			<div class="w-80 lg:w-90 transition-[width,height] duration-300">
				<div>
					<p class="text-muted-foreground text-sm">{info.fabric.name}</p>
					<p class="font-medium text-lg lg:text-xl">{info.product.name}</p>

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
				<div class="flex items-baseline gap-2 mt-6">
					<span class="font-medium text-primary text-sm">₱</span>
					<div class="flex gap-1">
						<span class="font-semibold text-2xl">{wholeNumber}</span>
						<span class="mt-1 font-medium text-sm align-top">
							.{decimal}
						</span>
					</div>
				</div>
				{#if sizes}
					<div class="flex flex-col gap-1 mt-4 font-medium">
						<span class="text-sm">Size</span>
						<div class="flex flex-wrap items-center gap-1">
							{#each sizes as size (size.id)}
								<button
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
					</div>
				{/if}
				{#if colors}
					<div class="flex flex-col gap-1 mt-4 font-medium">
						<span class="text-sm">
							Color {selectedColor ? `- ${selectedColor.name}` : ''}
						</span>

						<div class="flex items-center gap-4 py-4">
							{#each colors as color (color.id)}
								<button
									aria-label={color.name}
									onclick={() => onColorChanged(color)}
									style="background-color: {color.hexCode}"
									class={cn(
										'flex justify-center border rounded-full size-7 transition-all duration-300',
										selectedColor?.id === color.id ? 'scale-125' : ''
									)}
								>
									<CheckIcon
										style={`stroke:${textColorBasedOnBackground(color.hexCode)}`}
										class={cn(
											'place-self-center opacity-0 size-5 transition-opacity duration-300',
											selectedColor?.id === color.id ? 'opacity-100' : ''
										)}
									/>
								</button>
							{/each}
						</div>
					</div>
				{/if}
				<div class="flex flex-col gap-2 mt-4 font-medium">
					<div class="flex items-center gap-2 text-sm">
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
					<div class="isolate flex items-center">
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

				<button
					onclick={onSubmit}
					disabled={quantity === 0}
					class="bg-primary/85 hover:bg-primary/95 disabled:opacity-50 backdrop-blur-sm mt-8 px-6 py-3 border border-primary-foreground/10 rounded-full w-full font-medium text-primary-foreground text-sm text-center transition-all duration-300 disabled:cursor-not-allowed"
				>
					<ShoppingBagIcon class="inline-block mr-2 size-5" />
					Add to Bag
				</button>
			</div>
		{/if}
	</section>
</div>
<ImageDialog bind:this={imageDialog} />
