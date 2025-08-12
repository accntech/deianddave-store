<script lang="ts">
	import { getCartState } from '$lib/client/cart.svelte';
	import { getOrderState } from '$lib/client/order.svelte';
	import type { Order } from '$lib/services';
	import { onMount } from 'svelte';

	type Props = {
		index: number;
	};

	let { index = $bindable<number>(0) }: Props = $props();

	const checkout = () => {
		console.log('Checking out');
		index = 1;
	};

	const cart = getCartState();
</script>

<div class="space-y-4 p-4">
	{#each cart.orders as { item, quantity }}
		<div class="rounded-lg border p-4">
			<h2>{item.product.name}</h2>
			<div class="flex gap-4 text-sm text-muted-foreground">
				<p>{item.fabric.name}</p>
				{#if item.ageGroup}
					|
					<div class="flex gap-1">
						<p>{item.ageGroup.name}</p>
						{#if item.genderGroup}
							- <p>{item.genderGroup.name}</p>
						{/if}
					</div>
				{/if}
			</div>
			<p>x{quantity} {item.size.name}</p>
			<p>Price: {item.price * quantity}</p>
		</div>
	{/each}
	<button onclick={checkout} class="place-self-start rounded-md bg-primary px-4 py-2 text-white">
		Checkout
	</button>
</div>
