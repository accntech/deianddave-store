<script lang="ts">
	import { goto } from '$app/navigation';
	import { getCartState } from '$lib/client/cart.svelte.js';
	import { cn } from '$lib/utils';
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

	let selectedSize = $state('');
	let selectedColor = $state('');

	let quantity = $state(1);

	let selectedItem = $derived.by(() => {
		const result = data.result;

		if (!result?.data?.length) return null;

		return result.data.find(
			(item) => item.size.id === selectedSize && item.color.id === selectedColor
		);
	});

	let available = $derived.by(() => {
		if (!selectedItem) return 0;

		return selectedItem?.quantity || 0;
	});

	let price = $derived.by(() => {
		const result = data.result;

		if (!result?.data?.length) return 0;

		const item = result.data.find(
			(item) => item.size.id === selectedSize && item.color.id === selectedColor
		);
		const price = item?.price || 0;

		return price * quantity;
	});

	onMount(() => {
		selectedSize = sizes[0]?.id;
		selectedColor = colors[0]?.id;
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

<div class="flex flex-col gap-4 p-4">
	<span>{price}</span>
	{#if info}
		<div>
			<p>{info.product.name}</p>
			<div class="flex gap-4 text-sm text-muted-foreground">
				<p>{info.fabric.name}</p>
				{#if info.ageGroup}
					|
					<div class="flex gap-1">
						<p>{info.ageGroup.name}</p>
						{#if info.genderGroup}
							- <p>{info.genderGroup.name}</p>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	{/if}

	{#if sizes}
		<div>
			<span>Size</span>
			<div class="flex gap-2">
				{#each sizes as size}
					<button
						class={cn('rounded-md border px-2 py-1 text-sm transition-colors', {
							'border-none bg-primary text-white': selectedSize === size.id
						})}
						onclick={() => (selectedSize = size.id)}>{size.name}</button
					>
				{/each}
			</div>
		</div>
	{/if}

	{#if colors}
		<div>
			<span>Color</span>
			<div class="flex gap-2">
				{#each colors as color}
					<button
						class={cn('rounded-md border px-2 py-1 text-sm', {
							'border-none bg-primary text-white': selectedColor === color.id
						})}
						onclick={() => (selectedColor = color.id)}>{color.name}</button
					>
				{/each}
			</div>
		</div>
	{/if}

	{#if available}
		<div>
			<span>Available</span>
			<p>{available}</p>
		</div>
	{/if}

	<div>
		<span>Quantity</span>
		<input
			type="number"
			bind:value={quantity}
			min="1"
			class="w-16 rounded-md border px-2 py-1 text-sm"
		/>
	</div>
	<button onclick={onSubmit} class="place-self-start rounded-md bg-primary px-4 py-2 text-white">
		Add to Cart
	</button>
</div>
