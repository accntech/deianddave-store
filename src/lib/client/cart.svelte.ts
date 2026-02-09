import { browser } from '$app/environment';
import type { Order } from '$lib/services';
import { getContext, setContext } from 'svelte';

export class Cart {
	orders = $state<Order[]>() as Order[];
	private key = 'cart';

	constructor(value: Order[]) {
		this.orders = value;

		if (browser) {
			const item = localStorage.getItem(this.key);
			if (item) this.orders = this.deserialize(item);
		}

		$effect(() => {
			localStorage.setItem(this.key, this.serialize(this.orders));
		});
	}

	serialize(value: Order[]): string {
		return JSON.stringify(value);
	}

	deserialize(item: string): Order[] {
		return JSON.parse(item);
	}

	/**
	 * Remove all orders matching the given inventory item id.
	 * Triggers persistence via the existing $effect.
	 */
	remove(inventoryItemId: string) {
		this.orders = this.orders.filter((o) => o.item.id !== inventoryItemId);
	}
}

const CART_KEY = Symbol('CART');

export function setCartState(value: Order[]) {
	return setContext(CART_KEY, new Cart(value));
}

export function getCartState() {
	return getContext<ReturnType<typeof setCartState>>(CART_KEY);
}
