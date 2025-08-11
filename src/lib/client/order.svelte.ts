import type { AccountInfo, Order, PaymentMethod } from '$lib/services';
import { getContext, setContext } from 'svelte';

export class OrderDetails {
	items: Order[] = $state<Order[]>() as Order[];
	accountInfo: AccountInfo = $state<AccountInfo>() as AccountInfo;
	paymentMethod: PaymentMethod = $state<PaymentMethod>() as PaymentMethod;
}

const ORDER_DETAILS_KEY = Symbol('ORDER_DETAILS');

export function setOrderState() {
	return setContext(ORDER_DETAILS_KEY, new OrderDetails());
}

export function getOrderState() {
	return getContext<ReturnType<typeof setOrderState>>(ORDER_DETAILS_KEY);
}
