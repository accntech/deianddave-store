<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_DEFAULT_PRODUCT_IMAGE } from '$env/static/public';
	import Gcash from '$lib/assets/gcash.svg';
	import GrabPay from '$lib/assets/grabpay.svg';
	import MasterCard from '$lib/assets/mastercard.svg';
	import PayMaya from '$lib/assets/paymaya.svg';
	import Visa from '$lib/assets/visa.svg';
	import { getCartState } from '$lib/client/cart.svelte';
	import { getOrderState } from '$lib/client/order.svelte';
	import { getShopState } from '$lib/client/shop.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Image } from '$lib/components/ui/image';
	import type { Discount } from '$lib/services';
	import type { InventoryItem } from '$lib/services/inventory';
	import { computeDiscount } from '$lib/utils/discount-helper';
	import { splitNumberToString, toDecimalString, toPeso } from '$lib/utils/number-helper';
	import { HomeIcon, ShoppingCartIcon, TagIcon, XIcon } from '@lucide/svelte';
	import DiscountComponent from './discount.svelte';

	type Props = {
		index: number;
		discounts: Discount[];
	};

	let { index = $bindable<number>(0), discounts }: Props = $props();

	const checkout = () => {
		console.log('Checking out');
		index = 1;
	};

	const cart = getCartState();
	const order = getOrderState();

	const createDescription = (item: InventoryItem) => {
		const ageGroup = item.ageGroup ? `  |  ${item.ageGroup.name}` : '';
		const genderGroup = item.genderGroup ? ` - ${item.genderGroup.name}` : '';

		return item.fabric.name + ageGroup + genderGroup;
	};

	const totalAmount = $derived.by(() => {
		const total = cart.orders.reduce((acc, { item, quantity }) => {
			return acc + item.price * quantity;
		}, 0);

		return total;
	});

	const shop = getShopState();

	let discount = $derived.by(() => {
		return computeDiscount(totalAmount, order.discount);
	});

	let netAmount = $derived.by(() => {
		return totalAmount - discount;
	});
</script>

<div class="flex flex-col items-center w-full">
	<section
		class="gap-6 sm:grid grid-cols-[1fr_auto] p-6 sm:p-8 sm:px-4 xl:px-0 w-full xl:max-w-7xl"
	>
		{#if cart.orders.length > 0}
			<div class="w-full">
				<div class="space-y-4 pb-6">
					{#each cart.orders as { item, quantity }}
						{@const { wholeNumber, decimal } = splitNumberToString(item.price * quantity)}
						<div class="relative flex gap-2 bg-accent p-4 pr-8 rounded-3xl">
							<Image
								src={item.image || PUBLIC_DEFAULT_PRODUCT_IMAGE}
								alt={item.product.name}
								transform="h_300,c_fill"
								imageClass="object-cover w-full h-full"
								class="border rounded-xl size-24 shrink-0"
							/>
							<div class="flex-1">
								<span class="font-medium text-md">{item.product.name}</span>
								<span
									class="flex flex-nowrap gap-4 text-muted-foreground text-sm whitespace-pre-wrap"
								>
									{createDescription(item)}
								</span>
								<div class="flex flex-wrap items-center gap-x-2 text-muted-foreground text-sm">
									<span class="font-semibold text-foreground text-base">x{quantity}</span> |
									<span>{item.size.name}</span>
									<div class="flex items-center gap-1">
										<div
											style="background-color: {item.color.hexCode}"
											class="rounded-full size-4 shrink-0"
										></div>
										<span>{item.color.name}</span>
									</div>
								</div>
								<div class="flex items-baseline gap-2 mt-2">
									<span class="font-medium text-primary text-xs">₱</span>
									<div class="flex gap-1">
										<span class="font-semibold text-md">{wholeNumber}</span>
										<span class="mt-1 font-medium text-xs align-top">
											{decimal}
										</span>
									</div>
								</div>
							</div>
							<button
								type="button"
								class="top-3 right-3 absolute bg-muted p-0.5 border rounded-full shrink-0"
								onclick={() => cart.remove(item.id)}
								aria-label={`Remove ${item.product.name}`}
							>
								<XIcon class="size-4" />
							</button>
						</div>
					{/each}
				</div>
				<Button
					variant="ghost"
					class="place-self-start shadow-none mx-4 mb-8 rounded-full"
					onclick={() => goto(shop.lastShop === '' ? '/' : shop.lastShop)}
				>
					<ShoppingCartIcon />
					Continue shopping
				</Button>
			</div>
			<div
				class="place-self-start sm:shadow-lg sm:p-6 sm:border sm:rounded-3xl w-full sm:w-xs lg:w-sm transition-width duration-300"
			>
				<div class="py-4 pt-6 sm:pt-2 border-t sm:border-t-0 border-b">
					<DiscountComponent {discounts} />
				</div>
				<div class="flex flex-col gap-4 pb-8">
					<div class="flex flex-col py-4 border-b">
						<div class="gap-2 grid grid-cols-[1fr_auto]">
							<p class="uppercase">Subtotal</p>
							<p class="text-right">{toPeso(totalAmount)}</p>
							<div class="flex gap-2 text-sm">
								<span>Discount</span>
								{#if order.discount?.code}
									<span class="flex items-center"
										>{order.discount.code}<TagIcon class="ml-1 size-4" /></span
									>
								{/if}
							</div>
							<span class="text-sm text-right">
								{toDecimalString(discount)}
							</span>

							<p class="font-semibold uppercase">Total Due</p>
							<p class="font-semibold text-lg text-right">{toPeso(netAmount)}</p>
						</div>
					</div>
					<button
						onclick={checkout}
						disabled={cart.orders.length === 0}
						class="bg-primary/85 hover:bg-primary/95 disabled:opacity-50 backdrop-blur-sm px-6 py-3 border border-primary-foreground/10 focus-visible:border-ring rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 w-full font-medium text-primary-foreground text-sm text-center transition-all duration-300 disabled:cursor-not-allowed disabled:pointer-events-none"
					>
						Checkout Now
					</button>
					<div class="space-y-1">
						<p class="font-medium text-sm">You can pay thru the following</p>
						<div class="flex flex-wrap gap-2">
							<img class="border rounded-md w-12 object-cover" src={MasterCard} alt="Mastercard" />
							<img class="border rounded-md w-12 object-cover" src={Visa} alt="Visa" />
							<img class="border rounded-md w-12 object-cover" src={Gcash} alt="Gcash" />
							<img class="border rounded-md w-12 object-cover" src={PayMaya} alt="PayMaya" />
							<img class="border rounded-md w-12 object-cover" src={GrabPay} alt="GrabPay" />
						</div>
					</div>
				</div>
			</div>
		{:else}
			<div class="flex items-center h-[calc(100dvh-4rem)]">
				<div class="flex flex-col justify-center items-center gap-4 w-full">
					<svg
						class="fill-foreground/50 size-20 sm:size-26 transition-all duration-300"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						viewBox="0 0 483.1 483.1"
						xml:space="preserve"
					>
						<g>
							<g>
								<path
									d="M434.55,418.7l-27.8-313.3c-0.5-6.2-5.7-10.9-12-10.9h-58.6c-0.1-52.1-42.5-94.5-94.6-94.5s-94.5,42.4-94.6,94.5h-58.6
							c-6.2,0-11.4,4.7-12,10.9l-27.8,313.3c0,0.4,0,0.7,0,1.1c0,34.9,32.1,63.3,71.5,63.3h243c39.4,0,71.5-28.4,71.5-63.3
							C434.55,419.4,434.55,419.1,434.55,418.7z M241.55,24c38.9,0,70.5,31.6,70.6,70.5h-141.2C171.05,55.6,202.65,24,241.55,24z
							M363.05,459h-243c-26,0-47.2-17.3-47.5-38.8l26.8-301.7h47.6v42.1c0,6.6,5.4,12,12,12s12-5.4,12-12v-42.1h141.2v42.1
							c0,6.6,5.4,12,12,12s12-5.4,12-12v-42.1h47.6l26.8,301.8C410.25,441.7,389.05,459,363.05,459z"
								/>
								<path
									d="M292.35,251.1c-4.7-4.7-12.3-4.7-17,0l-33.8,33.9l-33.9-33.9c-4.7-4.7-12.3-4.7-17,0s-4.7,12.3,0,17l33.9,33.9l-33.9,33.9
							c-4.7,4.7-4.7,12.3,0,17c2.3,2.3,5.4,3.5,8.5,3.5s6.1-1.2,8.5-3.5l33.9-33.9l33.9,33.9c2.3,2.3,5.4,3.5,8.5,3.5s6.1-1.2,8.5-3.5
							c4.7-4.7,4.7-12.3,0-17l-33.9-33.9l33.9-33.9C297.05,263.4,297.05,255.8,292.35,251.1z"
								/>
							</g>
						</g>
					</svg>
					<span class="text-muted-foreground"> Your cart is empty. </span>
					<a
						class="flex items-center gap-2 bg-primary shadow-none mt-8 px-6 py-2 rounded-full font-medium text-primary-foreground"
						href="/"
					>
						<HomeIcon class="size-5" />
						Home
					</a>
				</div>
			</div>
		{/if}
	</section>
</div>
