<script lang="ts">
	import { PUBLIC_DEFAULT_PRODUCT_IMAGE } from '$env/static/public';
	import { getCartState } from '$lib/client/cart.svelte';
	import { Button } from '$lib/components/ui/button';
	import type { InventoryItem } from '$lib/services/inventory';
	import { splitNumberToString } from '$lib/utils/number-helper';
	import { ShoppingCartIcon, XIcon } from '@lucide/svelte';
	import MasterCard from '$lib/assets/mastercard.svg';
	import Visa from '$lib/assets/visa.svg';
	import Gcash from '$lib/assets/gcash.svg';
	import PayMaya from '$lib/assets/paymaya.svg';
	import GrabPay from '$lib/assets/grabpay.svg';
	import { getShopState } from '$lib/client/shop.svelte';
	import { goto } from '$app/navigation';

	type Props = {
		index: number;
	};

	let { index = $bindable<number>(0) }: Props = $props();

	const checkout = () => {
		console.log('Checking out');
		index = 1;
	};

	const cart = getCartState();

	const createDescription = (item: InventoryItem) => {
		const ageGroup = item.ageGroup ? `  |  ${item.ageGroup.name}` : '';
		const genderGroup = item.genderGroup ? ` - ${item.genderGroup.name}` : '';

		return item.fabric.name + ageGroup + genderGroup;
	};

	const totalAmount = $derived(
		cart.orders.reduce((acc, { item, quantity }) => {
			return acc + item.price * quantity;
		}, 0)
	);

	const shop = getShopState();
</script>

{#if cart.orders.length > 0}
	<div class="space-y-4 px-4 py-6">
		{#each cart.orders as { item, quantity }}
			{@const { wholeNumber, decimal } = splitNumberToString(item.price * quantity)}
			<div class="relative flex gap-2 rounded-3xl bg-[#EEEEEE] p-4">
				<object
					type="image/png"
					data={item.image === '' ? PUBLIC_DEFAULT_PRODUCT_IMAGE : item.image}
					class="size-24 shrink-0 rounded-xl border object-cover"
					aria-label={item.product.name}
				>
					<img
						src={PUBLIC_DEFAULT_PRODUCT_IMAGE}
						alt={item.product.name}
						class="h-full w-full object-cover"
					/>
				</object>
				<div class="flex-1">
					<span class="text-md font-medium">{item.product.name}</span>
					<span class="flex flex-nowrap gap-4 text-sm whitespace-pre-wrap text-muted-foreground">
						{createDescription(item)}
					</span>
					<div class="flex items-center text-sm text-muted-foreground">
						<span>{quantity} {item.size.name}</span>
						<div
							style="background-color: {item.color.hexCode}"
							class="mr-1 ml-4 size-4 shrink-0 rounded-full"
						></div>
						<span>{item.color.name}</span>
					</div>
					<div class="mt-2 flex items-baseline gap-2">
						<span class="text-xs font-medium text-primary">₱</span>
						<div class="flex gap-1">
							<span class="text-md font-semibold">{wholeNumber}</span>
							<span class="mt-1 align-top text-xs font-medium">
								{decimal}
							</span>
						</div>
					</div>
				</div>
				<button
					type="button"
					class="absolute top-3 right-3 shrink-0 rounded-full border p-0.5"
					onclick={() => cart.remove(item.id)}
					aria-label={`Remove ${item.product.name}`}
				>
					<XIcon class="size-4" />
				</button>
			</div>
		{/each}
	</div>
{:else}
	<div class="flex h-32 w-full items-center justify-center">
		<span class="text-muted-foreground"> Your cart is empty. </span>
	</div>
{/if}
<Button
	variant="outline"
	class="mx-4 mb-56 place-self-start rounded-lg shadow-none"
	onclick={() => goto(shop.lastShop)}
>
	<ShoppingCartIcon />
	Continue shopping
</Button>

{#if cart.orders.length > 0}
	<div
		class="fixed bottom-0 flex w-full flex-col gap-4 rounded-t-4xl border-t bg-muted/75 p-6 backdrop-blur-sm"
	>
		<div class="flex flex-col">
			<span class="-mb-1 text-xs">Total Amount</span>
			{#if totalAmount > 0}
				{@const { wholeNumber, decimal } = splitNumberToString(totalAmount)}
				<div class="flex items-baseline gap-2">
					<span class="text-xs font-medium text-primary">₱</span>
					<div class="flex gap-1">
						<span class="text-xl font-semibold">{wholeNumber}</span>
						<span class="mt-1 align-top text-xs font-medium">
							{decimal}
						</span>
					</div>
				</div>
			{:else}
				<span class="text-sm text-muted-foreground">₱ 0.00</span>
			{/if}
		</div>
		<button
			onclick={checkout}
			disabled={cart.orders.length === 0}
			class="w-full rounded-xl bg-primary px-6 py-3 text-center text-sm font-medium text-primary-foreground transition-all duration-300 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-input/50"
		>
			Checkout Now
		</button>
		<div class="space-y-1">
			<p class="text-sm font-medium">You can pay thru the following</p>
			<div class="flex flex-wrap gap-2">
				<img class="w-12 rounded-md border object-cover" src={MasterCard} alt="Mastercard" />
				<img class="w-12 rounded-md border object-cover" src={Visa} alt="Visa" />
				<img class="w-12 rounded-md border object-cover" src={Gcash} alt="Gcash" />
				<img class="w-12 rounded-md border object-cover" src={PayMaya} alt="PayMaya" />
				<img class="w-12 rounded-md border object-cover" src={GrabPay} alt="GrabPay" />
			</div>
		</div>
	</div>
{/if}
