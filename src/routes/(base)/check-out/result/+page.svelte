<script lang="ts">
	import { page } from '$app/state';
	import { PUBLIC_APP_TITLE } from '$env/static/public';
	import { getCartState } from '$lib/client/cart.svelte';
	import { MailCheckIcon } from '@lucide/svelte';
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

	const emailString =
		"An email receipt including the details about your order has been sent to the email address you provided. If you didn't receive it, please check your spam folder.\n\nFor further assistance, please contact our support team.";
</script>

<svelte:head>
	<title>{PUBLIC_APP_TITLE} | Result</title>
	<meta
		name="description"
		content="Thank you for your order! Here you can find the result of your checkout process."
	/>
</svelte:head>

<div class="flex h-[calc(100dvh-4rem)] flex-col items-center justify-center">
	{#if data.id}
		{#if success}
			{@render successContent()}
		{:else}
			{@render failedContent()}
		{/if}
	{:else}
		{@render noInfoContent()}
	{/if}
</div>

{#snippet successContent()}
	<div class="mx-8 flex flex-col items-center justify-center">
		<h1 class="text-[clamp(1.5rem,calc(5vw+1rem),4rem)] font-semibold text-primary">Thank you!</h1>
		<h2 class="text-[clamp(0.875rem,calc(3vw),2rem)]">
			Your order has been successfully processed.
		</h2>

		<div class="mt-24 flex max-w-150 flex-col items-center gap-4 sm:flex-row sm:items-start">
			<MailCheckIcon class="size-12 shrink-0 text-muted-foreground" />
			<p class="text-sm text-pretty whitespace-pre-wrap">{emailString}</p>
		</div>
	</div>
{/snippet}

{#snippet failedContent()}
	<div class="mx-8 flex flex-col items-center justify-center">
		<h1 class="text-[clamp(1.5rem,calc(5vw+1rem),4rem)] font-semibold text-secondary">Oops!</h1>
		<h2 class="text-center text-[clamp(0.875rem,calc(3vw),2rem)]">
			<p>We're unable to process your order at this time.</p>
			<p>Please try again!</p>
		</h2>
	</div>
{/snippet}

{#snippet noInfoContent()}
	<div class="mx-8 flex flex-col items-center justify-center">
		<h1 class="text-[clamp(1.5rem,calc(5vw+1rem),4rem)] font-semibold text-accent-foreground">
			Sorry!
		</h1>
		<h2 class="text-center text-[clamp(0.875rem,calc(3vw),2rem)]">
			<p>No payment information available.</p>
			<p>Make sure you properly filled out the checkout form.</p>
		</h2>
	</div>
{/snippet}
