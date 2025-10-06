<script lang="ts">
	import favicon from '$lib/assets/favicon.png';
	import Logo from '$lib/assets/logo.png';
	import { getCartState, setCartState } from '$lib/client/cart.svelte';
	import '@fontsource-variable/geist';
	import '../app.css';
	import { MenuIcon, ShoppingBagIcon } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { setShopState } from '$lib/client/shop.svelte';
	import { onMount } from 'svelte';
	import Banner from './banner.svelte';
	import { PUBLIC_SHOW_BANNER } from '$env/static/public';
	import { page } from '$app/state';

	let { children } = $props();
	setCartState([]);
	setShopState('');

	let scrolled = $state(false);
	const handleScroll = () => {
		scrolled = typeof window !== 'undefined' ? window.scrollY > 4 : false;
	};

	onMount(() => {
		handleScroll();
	});

	let showBanner = $derived(PUBLIC_SHOW_BANNER === 'true');
</script>

<svelte:window on:scroll={handleScroll} />

<svelte:head>
	<link rel="icon" href={favicon} />
	<!-- Meta Pixel Code -->
	<script>
		!(function (f, b, e, v, n, t, s) {
			if (f.fbq) return;
			n = f.fbq = function () {
				n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
			};
			if (!f._fbq) f._fbq = n;
			n.push = n;
			n.loaded = !0;
			n.version = '2.0';
			n.queue = [];
			t = b.createElement(e);
			t.async = !0;
			t.src = v;
			s = b.getElementsByTagName(e)[0];
			s.parentNode.insertBefore(t, s);
		})(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
		fbq('init', '1720231195329289');
		fbq('track', 'PageView');
	</script>
	<noscript>
		<img
			height="1"
			width="1"
			style="display:none"
			src="https://www.facebook.com/tr?id=1720231195329289&ev=PageView&noscript=1"
			alt="Dei&Dave Pixel"
		/></noscript
	>
	<!-- End Meta Pixel Code -->
</svelte:head>

<main class="relative">
	<nav
		class={`sticky top-0 z-40 flex min-h-16 flex-col justify-center text-primary transition-all duration-300 xl:items-center ${scrolled ? 'bg-white/85 backdrop-blur' : 'bg-background/10'}`}
	>
		<div class="flex w-full flex-col items-center p-4">
			<div class="relative grid w-full grid-cols-[auto_1fr_auto] justify-center xl:max-w-[1280px]">
				<button
					class="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg p-2 transition-all outline-none hover:bg-accent focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:hidden dark:hover:bg-input/50 [&_svg]:size-5"
				>
					<MenuIcon />
				</button>
				<a href="/" class="absolute place-self-center sm:place-self-start">
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
			</div>
		</div>
		{#if showBanner && page.url.pathname === '/'}
			<Banner />
		{/if}
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
