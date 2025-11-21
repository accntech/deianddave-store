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

<div class="flex justify-center px-4">
	<section class="flex gap-12 xl:max-w-7xl xl:place-self-center">
		<!-- image -->
		<div
			class="flex max-h-[400px] min-h-[300px] max-w-[400px] min-w-[300px] flex-col transition-[width,height] duration-300 lg:max-h-[500px] lg:min-h-[400px] lg:max-w-[500px] lg:min-w-[400px]"
		>
			<div class={cn('relative grid', aspectRatio)}>
				{#each images as image}
					<div
						class={cn(
							'col-start-1 row-start-1 flex flex-col overflow-clip rounded-xl opacity-0 transition-all duration-300',
							selectedImage.source === image.source ? 'z-10 opacity-100' : ''
						)}
					>
						<Image
							src={image.source}
							alt={info?.product.name ?? ''}
							imageClass="w-full h-full object-cover"
							transform="h_900,c_fill"
						/>
					</div>
				{/each}
				<button
					onclick={() => imageDialog.show(selectedImage.source)}
					class="absolute top-2 left-2 z-20 flex items-center justify-center rounded-md border bg-background/75 p-1 text-foreground/50 transition-all duration-300 hover:bg-accent/75"
				>
					<FullscreenIcon class="size-6" />
				</button>
			</div>
			{#if info && info.product.description}
				<div class="mt-8 flex max-w-[400px] flex-col gap-2">
					<span class="text-sm">Description</span>
					<p class="text-sm whitespace-pre-line text-muted-foreground">
						{info.product.description}
					</p>
				</div>
			{/if}
			<Button
				variant="ghost"
				class="mt-6 mb-24 place-self-start rounded-lg shadow-none"
				onclick={() => history.back()}
			>
				<ArrowLeftIcon />
				Back
			</Button>
		</div>
		<!-- details -->
		{#if info}
			{@const { wholeNumber, decimal } = splitNumberToString(price)}
			<div class="w-80 transition-[width,height] duration-300 lg:w-90">
				<div>
					<p class="text-sm text-muted-foreground">{info.fabric.name}</p>
					<p class="text-lg font-medium lg:text-xl">{info.product.name}</p>

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
				<div class="mt-6 flex items-baseline gap-2">
					<span class="text-sm font-medium text-primary">₱</span>
					<div class="flex gap-1">
						<span class="text-2xl font-semibold">{wholeNumber}</span>
						<span class="mt-1 align-top text-sm font-medium">
							.{decimal}
						</span>
					</div>
				</div>
				{#if sizes}
					<div class="mt-4 flex flex-col gap-1 font-medium">
						<span class="text-sm">Size</span>
						<div class="flex flex-wrap items-center gap-1">
							{#each sizes as size}
								<button
									onclick={() => (selectedSize = size)}
									class={cn(
										'rounded-lg px-4 py-2 text-sm font-medium text-nowrap transition-colors duration-300 ',
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
					<div class="mt-4 flex flex-col gap-1 font-medium">
						<span class="text-sm">
							Color {selectedColor ? `- ${selectedColor.name}` : ''}
						</span>

						<div class="flex items-center gap-4 py-4">
							{#each colors as color}
								<button
									aria-label={color.name}
									onclick={() => onColorChanged(color)}
									style="background-color: {color.hexCode}"
									class={cn(
										'flex size-7 justify-center rounded-full border transition-all duration-300',
										selectedColor?.id === color.id ? 'scale-125' : ''
									)}
								>
									<CheckIcon
										style={`stroke:${textColorBasedOnBackground(color.hexCode)}`}
										class={cn(
											'size-5 place-self-center opacity-0 transition-opacity duration-300',
											selectedColor?.id === color.id ? 'opacity-100' : ''
										)}
									/>
								</button>
							{/each}
						</div>
					</div>
				{/if}
				<div class="mt-4 flex flex-col gap-2 font-medium">
					<div class="flex items-center gap-2 text-sm">
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
					<div class="isolate flex items-center">
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

				<button
					onclick={onSubmit}
					disabled={quantity === 0}
					class="mt-8 w-full rounded-full bg-primary px-6 py-3 text-center text-sm font-medium text-primary-foreground transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<ShoppingBagIcon class="mr-2 inline-block size-5" />
					Add to Bag
				</button>
			</div>
		{/if}
	</section>
</div>
<ImageDialog bind:this={imageDialog} />
