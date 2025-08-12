<script lang="ts">
	import { page } from '$app/state';
	import { getCartState } from '$lib/client/cart.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();
	getCartState();

	const cart = getCartState();
	let success = $derived(page.url.searchParams.get('success') === 'true');

	onMount(() => {
		if (data.id) {
			cart.orders = [];
		}
	});
</script>

{#if data.id}
	<div class="flex flex-col items-center justify-center">
		{#if success}
			<h1>Payment is properly processed</h1>
		{:else}
			<h1>Payment is not processed. Please try again!</h1>
		{/if}
	</div>
{:else}
	<div class="flex flex-col items-center justify-center">
		<h1>No payment information available</h1>
	</div>
{/if}
