<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { getCartState } from '$lib/client/cart.svelte';
	import { getOrderState } from '$lib/client/order.svelte';

	type Props = {
		index: number;
		csrfToken: string;
	};

	let { index = $bindable<number>(0), csrfToken }: Props = $props();

	const order = getOrderState();
	const cart = getCartState();

	const submit = async () => {
		try {
			const url = new URL(page.url.href);
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-csrf-token': csrfToken
				},
				body: JSON.stringify({
					info: order.accountInfo,
					payment: order.paymentMethod,
					orders: cart.value
				})
			});

			if (!response.ok) {
				const { error } = await response.json();
				console.error('Error submitting payment:', error);
				return;
			}

			const { status, redirect } = await response.json();

			if (status === 'succeeded') {
				goto('/check-out/result');
			} else if (status === 'awaiting_next_action') {
				window.location.href = redirect;
			}
		} catch (error) {
			console.error('Error submitting payment:', error);
		}
	};
</script>

<h1>Confirm Payment</h1>

<button onclick={submit} class="place-self-start rounded-md bg-primary px-4 py-2 text-white">
	Submit Payment
</button>

<button onclick={() => (index = 2)} class="place-self-start rounded-md border px-4 py-2">
	Cancel
</button>
