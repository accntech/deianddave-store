<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Image } from '$lib/components/ui/image';
	import { cn } from '$lib/utils';
	import { textColorBasedOnBackground } from '$lib/utils/color-helper';
	import { splitNumberToString } from '$lib/utils/number-helper';
	import { ArrowLeftIcon, CheckIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from '@lucide/svelte';
	import type { Props } from './types';
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
</script>

<div class="flex items-center justify-center px-4">
	<section class="grid grid-cols-[1fr_auto] gap-12 xl:max-w-[1280px] xl:place-self-center">
		<div class="col-1 w-[623px]">
			<div class="grid w-full">
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
							transform="h_900,c_fill"
						/>
					</div>
				{/each}
			</div>
			{#if info && info.product.description}
				<div class="mt-8 flex flex-col gap-2">
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
		{#if info}
			{@const { wholeNumber, decimal } = splitNumberToString(price)}
			<div class="transition-[width, height] col-2 w-80 duration-300 lg:w-90">
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
					<span class="text-sm">Quantity {available === 0 ? '' : `- ${available} available`} </span>
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
