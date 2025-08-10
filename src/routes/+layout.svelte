<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { getCartState, setCartState } from '$lib/client/cart.svelte';
	import '@fontsource-variable/geist';
	import '../app.css';

	let { children } = $props();
	setCartState([]);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<span>cart {getCartState().value.length}</span>
{@render children?.()}
