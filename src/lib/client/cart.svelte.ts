import { browser } from '$app/environment';
import type { Order } from '$lib/services';
import { getContext, setContext } from 'svelte';

export class Cart {
	value = $state<Order[]>() as Order[];
	key = 'cart';

	constructor(value: Order[]) {
		this.value = value;

		if (browser) {
			const item = localStorage.getItem(this.key);
			if (item) this.value = this.deserialize(item);
		}

		$effect(() => {
			localStorage.setItem(this.key, this.serialize(this.value));
		});
	}

	serialize(value: Order[]): string {
		return JSON.stringify(value);
	}

	deserialize(item: string): Order[] {
		return JSON.parse(item);
	}
}

const CART_KEY = Symbol('CART');

export function setCartState(value: Order[]) {
	return setContext(CART_KEY, new Cart(value));
}

export function getCartState() {
	return getContext<ReturnType<typeof setCartState>>(CART_KEY);
}
