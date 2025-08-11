<script lang="ts">
	import { setOrderState } from '$lib/client/order.svelte';
	import AccountInfo from './account-info.svelte';
	import ConfirmOrder from './confirm-order.svelte';
	import Orders from './orders.svelte';
	import PaymentDetails from './payment-details.svelte';

	let { data } = $props();
	let pageIndex = $state(0);
	setOrderState();
</script>

{#if pageIndex === 0}
	<Orders bind:index={pageIndex} />
{:else if pageIndex === 1}
	<AccountInfo bind:index={pageIndex} />
{:else if pageIndex === 2}
	<PaymentDetails bind:index={pageIndex} />
{:else if pageIndex === 3}
	<ConfirmOrder bind:index={pageIndex} csrfToken={data.csrfToken} />
{/if}
