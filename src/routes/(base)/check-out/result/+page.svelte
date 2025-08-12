<script lang="ts">
	import { page } from '$app/state';
	import { getCartState } from '$lib/client/cart.svelte.js';
	import { onMount } from 'svelte';

	getCartState();

	const cart = getCartState();

	let success = $derived(page.url.searchParams.get('success') === 'true');

	onMount(() => {
		if (success) {
			cart.orders = [];
		}
	});
</script>

<div class="flex flex-col items-center justify-center">
	{#if success}
		<h1>Payment is properly processed</h1>
	{:else}
		<h1>Payment is not processed. Please try again!</h1>
	{/if}
</div>
