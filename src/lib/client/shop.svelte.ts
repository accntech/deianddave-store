import { browser } from '$app/environment';
import type { Order } from '$lib/services';
import { getContext, setContext } from 'svelte';

export class Shop {
	lastShop = $state('');
	private key = 'lastShop';

	constructor(url: string) {
		this.lastShop = url;

		if (browser) {
			const item = localStorage.getItem(this.key);
			if (item) this.lastShop = item;
		}

		$effect(() => {
			localStorage.setItem(this.key, this.lastShop);
		});
	}
}

const SHOP_KEY = Symbol('SHOP_KEY');

export function setShopState(url: string) {
	return setContext(SHOP_KEY, new Shop(url));
}

export function getShopState() {
	return getContext<ReturnType<typeof setShopState>>(SHOP_KEY);
}
