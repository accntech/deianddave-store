<script lang="ts">
	import { goto } from '$app/navigation';
	import { getCartState } from '$lib/client/cart.svelte.js';
	import { isMobile } from '$lib/hooks/is-mobile.svelte';
	import { onMount } from 'svelte';
	import Desktop from './desktop.svelte';
	import Mobile from './mobile.svelte';
	import type { InventoryItem } from '$lib/services/inventory';

	let { data } = $props();

	let items = $state<InventoryItem[]>([]);

	let info = $derived.by(() => {
		if (items.length === 0) return null;

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
		if (items.length === 0) return [];

		const seen = new Set();
		const unique = [];

		for (const item of items) {
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
		if (items.length === 0) return [];

		const seen = new Set();
		const unique = [];

		for (const item of items) {
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
		if (items.length === 0) return [] as string[];

		const seen = new Set<string>();
		const entries: { image: string; colorIndex: number; colorName: string }[] = [];

		for (let i = 0; i < items.length; i++) {
			const item = items[i];
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
		if (items.length === 0 || !selectedSize?.id || !selectedColor?.id) return null;

		return items.find(
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
		if (items.length === 0 || !selectedSize?.id || !selectedColor?.id) return 0;

		const item = items.find(
			(item) => item.size.id === selectedSize.id && item.color.id === selectedColor.id
		);
		const price = item?.price || 0;

		return price * quantity;
	});

	onMount(async () => {
		const action = await data.streamed.result;

		console.log('action', action);
		items = action.result.data || [];

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

{#if isMobile.current}
	<Mobile
		bind:selectedImage
		bind:images
		bind:info
		bind:price
		bind:selectedSize
		bind:sizes
		bind:selectedColor
		bind:colors
		bind:available
		bind:quantity
		{onSubmit}
	/>
{:else}
	<Desktop
		bind:selectedImage
		bind:images
		bind:info
		bind:price
		bind:selectedSize
		bind:sizes
		bind:selectedColor
		bind:colors
		bind:available
		bind:quantity
		{onSubmit}
	/>
{/if}
