<script lang="ts">
	import favicon from '$lib/assets/favicon.png';
	import Logo from '$lib/assets/logo.png';
	import { getCartState, setCartState } from '$lib/client/cart.svelte';
	import '@fontsource-variable/geist';
	import '../app.css';
	import { MenuIcon, ShoppingBagIcon } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { setShopState } from '$lib/client/shop.svelte';

	let { children } = $props();
	setCartState([]);
	setShopState('');
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<main class="relative">
	<nav
		class="sticky top-0 z-40 grid h-16 grid-cols-[auto_1fr_auto] bg-background/10 p-4 text-primary backdrop-blur-sm"
	>
		<button
			class="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg p-2 transition-all outline-none hover:bg-accent focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:hover:bg-input/50 [&_svg]:size-5"
		>
			<MenuIcon />
		</button>
		<a href="/" class="absolute place-self-center">
			<img src={Logo} alt="Logo" class="h-8" />
		</a>
		<div class="col-3">
			<button
				onclick={() => goto('/check-out')}
				class="relative inline-flex shrink-0 items-center justify-center gap-2 rounded-lg p-2 transition-all outline-none hover:bg-accent focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:hover:bg-input/50 [&_svg]:size-5"
			>
				<ShoppingBagIcon />
				{#if getCartState().orders.length > 0}
					<div class="circle absolute top-1 right-1"></div>
				{/if}
			</button>
		</div>
	</nav>
	{@render children?.()}
</main>

<style>
	.circle {
		background-color: var(--secondary);
		border-radius: 50%;
		animation: pulse-primary 2s infinite;
		height: 12px;
		width: 12px;
	}

	@keyframes pulse-primary {
		0% {
			transform: scale(0.9);
			box-shadow: 0 0 0 0 var(--secondary);
		}

		70% {
			transform: scale(1);
			box-shadow: 0 0 0 4px transparent;
		}

		100% {
			transform: scale(0.9);
			box-shadow: 0 0 0 0 transparent;
		}
	}
</style>
