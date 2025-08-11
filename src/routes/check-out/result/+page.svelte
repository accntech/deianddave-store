<script lang="ts">
	import { getCartState } from '$lib/client/cart.svelte.js';
	import { onMount } from 'svelte';

	let { data } = $props();
	getCartState();

	onMount(() => {
		if (data.success) {
			getCartState().value = [];
		}
	});
</script>

<h1>Payment is {data.success ? 'properly processed' : 'not processed. Please try again!'}</h1>
