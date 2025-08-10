<script lang="ts">
	import { getCartState } from '$lib/client/cart.svelte';

	const cart = getCartState();
</script>

<pre>{JSON.stringify(cart.value, null, 2)}</pre>
