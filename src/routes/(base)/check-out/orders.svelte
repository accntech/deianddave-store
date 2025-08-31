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

<div class="flex w-full flex-col items-center">
	<section
		class="w-full grid-cols-[1fr_auto] gap-6 p-6 sm:grid sm:p-8 sm:px-4 xl:max-w-[1280px] xl:px-0"
	>
		{#if cart.orders.length > 0}
			<div class="w-full">
				<div class="space-y-4 pb-6">
					{#each cart.orders as { item, quantity }}
						{@const { wholeNumber, decimal } = splitNumberToString(item.price * quantity)}
						<div class="relative flex gap-2 rounded-3xl bg-accent p-4 pr-8">
							<Image
								src={item.image || PUBLIC_DEFAULT_PRODUCT_IMAGE}
								alt={item.product.name}
								transform="h_300,c_fill"
								imageClass="object-cover w-full h-full"
								class="size-24 shrink-0 rounded-xl border"
							/>
							<div class="flex-1">
								<span class="text-md font-medium">{item.product.name}</span>
								<span
									class="flex flex-nowrap gap-4 text-sm whitespace-pre-wrap text-muted-foreground"
								>
									{createDescription(item)}
								</span>
								<div class="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
									<span class="text-base font-semibold text-foreground">x{quantity}</span> |
									<span>{item.size.name}</span>
									<div class="flex items-center gap-1">
										<div
											style="background-color: {item.color.hexCode}"
											class="size-4 shrink-0 rounded-full"
										></div>
										<span>{item.color.name}</span>
									</div>
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
								class="absolute top-3 right-3 shrink-0 rounded-full border bg-muted p-0.5"
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
					class="mx-4 mb-8 place-self-start rounded-lg shadow-none"
					onclick={() => goto(shop.lastShop === '' ? '/' : shop.lastShop)}
				>
					<ShoppingCartIcon />
					Continue shopping
				</Button>
			</div>
			<div
				class="transition-width w-full place-self-start duration-300 sm:w-xs sm:rounded-3xl sm:border sm:p-6 sm:shadow-lg lg:w-sm"
			>
				<div class="border-t border-b py-4 pt-6 sm:border-t-0 sm:pt-2">
					<DiscountComponent {discounts} />
				</div>
				<div class="flex flex-col gap-4 pb-8">
					<div class="flex flex-col border-b py-4">
						<div class="grid grid-cols-[1fr_auto] gap-2">
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
							<span class="text-right text-sm">
								{toDecimalString(discount)}
							</span>

							<p class="font-semibold uppercase">Total Due</p>
							<p class="text-right text-lg font-semibold">{toPeso(netAmount)}</p>
						</div>
					</div>
					<button
						onclick={checkout}
						disabled={cart.orders.length === 0}
						class="w-full rounded-full bg-primary px-6 py-3 text-center text-sm font-medium text-primary-foreground transition-all duration-300 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-input/50"
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
			</div>
		{:else}
			<div class="flex h-[calc(100dvh-4rem)] items-center">
				<div class="flex w-full flex-col items-center justify-center gap-4">
					<svg
						class="size-20 fill-foreground/50 transition-all duration-300 sm:size-26"
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
						class="mt-8 flex items-center gap-2 rounded-full bg-primary px-6 py-2 font-medium text-primary-foreground shadow-none"
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
