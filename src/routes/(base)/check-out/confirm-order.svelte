<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import GCashLogo from '$lib/assets/gcash.svg';
	import GrabPayLogo from '$lib/assets/grabpay.svg';
	import MasterCardLogo from '$lib/assets/mastercard.svg';
	import PayMayaLogo from '$lib/assets/paymaya.svg';
	import VisaLogo from '$lib/assets/visa.svg';
	import { getCartState } from '$lib/client/cart.svelte';
	import { getOrderState } from '$lib/client/order.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import type { InventoryItem } from '$lib/services/inventory';
	import { getCardType, maskCardNumber } from '$lib/utils/card-helper';
	import { LoaderCircleIcon } from '@lucide/svelte';

	type Props = {
		index: number;
		csrfToken: string;
	};

	let { index = $bindable<number>(0), csrfToken }: Props = $props();

	const order = getOrderState();
	const cart = getCartState();

	const createDescription = (item: InventoryItem) => {
		const ageGroup = item.ageGroup ? `  |  ${item.ageGroup.name}` : '';
		const genderGroup = item.genderGroup ? ` - ${item.genderGroup.name}` : '';

		return item.fabric.name + ageGroup + genderGroup;
	};

	let submitting = $state(false);
	let total = $derived(
		cart.orders.reduce((acc, { item, quantity }) => {
			return acc + item.price * quantity;
		}, 0)
	);
	const submit = async () => {
		try {
			submitting = true;
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
					orders: cart.orders
				})
			});

			if (!response.ok) {
				const { error } = await response.json();
				console.error('Error submitting payment:', error);
				return;
			}

			const { status, redirect } = await response.json();

			if (status === 'succeeded') {
				goto('/check-out/result?success=true');
			} else if (status === 'awaiting_next_action') {
				window.location.href = redirect;
			}
		} catch (error) {
			console.error('Error submitting payment:', error);
		} finally {
			submitting = false;
		}
	};
</script>

<Card.Root class="rounded-none border-0 shadow-none sm:w-[375px] sm:rounded-3xl">
	<Card.Header>
		<Card.Title class="sm:text-lg">Review the order</Card.Title>
		<Card.Description>
			Please review your order details before confirming and proceeding to payment.
		</Card.Description>
	</Card.Header>
	<Card.Content class="space-y-4">
		<div class="flex flex-col rounded-lg border p-4">
			<span class="mb-2 font-semibold">Customer Info</span>
			<span class="font-medium">{order.accountInfo.fullName}</span>
			<span class="text-sm text-muted-foreground">{order.accountInfo.email}</span>
			<span class="text-sm text-muted-foreground">{order.accountInfo.contactNumber}</span>
			<span class="text-sm text-muted-foreground">{order.accountInfo.address}</span>
		</div>
		<div class="flex flex-col rounded-lg border p-4">
			<span class="mb-2 font-semibold">Payment Method</span>
			<div class="flex gap-2">
				{#if order.paymentMethod.method === 'card'}
					<div class="flex w-full items-center gap-1">
						<div class="flex flex-grow items-center gap-1">
							{#if getCardType(order.paymentMethod.cardNumber) === 'visa'}
								<img class="w-[50px] object-cover" src={VisaLogo} alt="visa" />
							{:else if getCardType(order.paymentMethod.cardNumber) === 'master-card'}
								<img class="w-[50px] object-cover" src={MasterCardLogo} alt="mastercard" />
							{/if}
							<p>{maskCardNumber(order.paymentMethod.cardNumber)}</p>
						</div>
						<p class="flex-grow-0">{order.paymentMethod.expiryDate}</p>
					</div>
				{:else if order.paymentMethod.method === 'e-wallet'}
					{#if order.paymentMethod.ewallet === 'gcash'}
						<img
							class="w-[75px] overflow-hidden rounded-lg border object-cover"
							src={GCashLogo}
							alt={order.paymentMethod.ewallet}
						/>
					{:else if order.paymentMethod.ewallet === 'paymaya'}
						<img
							class="w-[75px] overflow-hidden rounded-lg border object-cover"
							src={PayMayaLogo}
							alt={order.paymentMethod.ewallet}
						/>
					{:else if order.paymentMethod.ewallet === 'grab_pay'}
						<img
							class="w-[75px] overflow-hidden rounded-lg border object-cover"
							src={GrabPayLogo}
							alt={order.paymentMethod.ewallet}
						/>
					{/if}
				{/if}
			</div>
		</div>
		<div class="flex flex-col rounded-lg border p-4">
			<span class="mb-2 font-semibold">
				{`${cart.orders.length > 1 ? 'Items' : 'Item'} Ordered`}
			</span>
			<div class="grid grid-cols-[1fr_auto] gap-3">
				{#each cart.orders as i}
					<div class="col-1 flex flex-col">
						<span class="text-sm font-medium text-wrap">x{i.quantity} {i.item.product.name}</span>
						<span class="flex flex-nowrap gap-4 text-sm whitespace-pre-wrap text-muted-foreground">
							{createDescription(i.item)}
						</span>
						<div class="flex flex-wrap gap-1 text-xs text-muted-foreground">
							<span>{i.item.size.name}</span> |
							<div class="inline-flex items-center gap-1">
								<div
									style="background-color: {i.item.color.hexCode}"
									class="size-4 shrink-0 rounded-full"
								></div>
								<span>{i.item.color.name}</span>
							</div>
						</div>
					</div>
					<span class="col-2 text-end text-sm">
						{(i.item.price * i.quantity).toLocaleString('en-US', {
							style: 'currency',
							currency: 'PHP'
						})}
					</span>
				{/each}
			</div>
			<div class="col-span-2 my-2 h-[1px] bg-border"></div>
			<div class="grid grid-cols-[1fr_auto] gap-1">
				<span class="col-1 text-sm font-medium">Total</span>
				<span class="col-2 text-end text-sm font-medium">
					{total.toLocaleString('en-US', {
						style: 'currency',
						currency: 'PHP'
					})}
				</span>
				<span class="col-1 text-sm">Less: Discount</span>
				<span class="col-2 text-end text-sm">
					{order.discount.toLocaleString('en-US', {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					})}
				</span>
				<div class="col-span-2 my-1 h-[1px] bg-border"></div>
				<span class="col-1 text-base font-semibold">Amount Due</span>
				<span class="col-2 text-end text-base font-semibold">
					{(total - order.discount).toLocaleString('en-US', {
						style: 'currency',
						currency: 'PHP'
					})}
				</span>
			</div>
		</div>
	</Card.Content>
	<Card.Footer class="flex flex-col gap-4 ">
		<span class="text-sm text-muted-foreground">
			By pressing the 'Confirm and Pay' button, you agree to our terms and conditions privacy
			policy.
		</span>
		<Button onclick={submit} disabled={submitting} class="w-full rounded-lg">
			{#if submitting}
				<LoaderCircleIcon class="h-5 w-5 animate-spin" />
			{/if}
			Confirm and Pay
		</Button>
		<Button variant="outline" class="w-full rounded-lg" onclick={() => (index = 2)}>Back</Button>
	</Card.Footer>
</Card.Root>
