<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { PUBLIC_SHOW_BANNER } from '$env/static/public';
	import favicon from '$lib/assets/favicon.png';
	import Logo from '$lib/assets/logo.png';
	import { getCartState, setCartState } from '$lib/client/cart.svelte';
	import { setShopState } from '$lib/client/shop.svelte';
	import { cn } from '$lib/utils';
	import '@fontsource-variable/geist';
	import { MenuIcon, SearchIcon, ShoppingBagIcon, X } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import '../app.css';
	import Banner from './banner.svelte';
	import { Footer } from '$lib/components/ui/footer';
	import SearchDialog from './search-dialog.svelte';

	let { children } = $props();
	setCartState([]);
	setShopState('');

	let scrolled = $state(false);
	let drawerOpen = $state(false);
	let searchOpen = $state(false);

	function handleKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			e.preventDefault();
			searchOpen = !searchOpen;
		}
	}

	const handleScroll = () => {
		scrolled = typeof window !== 'undefined' ? window.scrollY > 4 : false;
	};

	onMount(() => {
		handleScroll();
	});

	let showBanner = $derived(PUBLIC_SHOW_BANNER === 'true');

	const navLinks = [
		{ href: '/about-us', label: 'About Us' },
		{ href: '/know-your-fabric', label: 'Know your fabric' },
		{ href: '/customer-care', label: 'Customer Care' }
	] as const;

	function isActive(href: string) {
		if (href === '/') return page.url.pathname === '/';
		return page.url.pathname.startsWith(href);
	}
</script>

<svelte:window onscroll={handleScroll} onkeydown={handleKeydown} />

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
		class={cn(
			'top-0 z-40 sticky flex flex-col justify-center xl:items-center min-h-16 text-primary transition-all duration-300',
			scrolled ? 'bg-white/90 shadow-sm backdrop-blur' : 'bg-background/10'
		)}
	>
		<div class="flex flex-col items-center p-4 w-full">
			<div class="relative items-center grid grid-cols-[auto_1fr_auto] w-full xl:max-w-7xl">
				<button
					onclick={() => (drawerOpen = true)}
					class="md:hidden inline-flex justify-center items-center gap-2 hover:bg-accent dark:hover:bg-input/50 p-2 focus-visible:border-ring rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-5 transition-all shrink-0"
					aria-label="Open menu"
				>
					<MenuIcon />
				</button>
				<a href="/" class="hidden md:inline-flex place-self-start shrink-0">
					<img src={Logo} alt="Logo" class="h-8 shrink-0" />
				</a>
				<a href="/" class="md:hidden absolute place-self-center shrink-0">
					<img src={Logo} alt="Logo" class="h-8 shrink-0" />
				</a>
				<div class="hidden md:flex justify-self-end place-self-end md:gap-1 mx-2 text-sm">
					{#each navLinks as link (link.href)}
						<a
							href={link.href}
							class={cn(
								'hover:bg-accent px-3 py-1.5 rounded-md text-nowrap transition-colors',
								isActive(link.href) && 'font-semibold'
							)}
						>
							{link.label}
						</a>
					{/each}
				</div>
				<div class="flex justify-self-end items-center gap-1">
					<!-- Desktop search trigger -->
					<button
						onclick={() => (searchOpen = true)}
						class="hidden md:flex items-center gap-2 bg-background hover:bg-accent px-3 py-1.5 border border-input rounded-full min-w-44 text-muted-foreground text-sm transition-colors"
					>
						<SearchIcon class="size-4" />
						<span>Search</span>
						<kbd
							class="bg-muted ml-auto px-1.5 py-0.5 border border-border rounded font-medium text-xs"
							>⌘K</kbd
						>
					</button>
					<!-- Mobile search trigger -->
					<button
						onclick={() => (searchOpen = true)}
						class="md:hidden inline-flex justify-center items-center hover:bg-accent dark:hover:bg-input/50 p-2 focus-visible:border-ring rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-5 transition-all shrink-0"
						aria-label="Search"
					>
						<SearchIcon />
					</button>
					<button
						onclick={() => goto('/check-out')}
						class="inline-flex relative justify-center items-center gap-2 hover:bg-accent dark:hover:bg-input/50 p-2 focus-visible:border-ring rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-5 transition-all shrink-0"
						aria-label="Shopping bag"
					>
						<ShoppingBagIcon />
						{#if getCartState().orders.length > 0}
							<div class="top-1 right-1 absolute circle"></div>
						{/if}
					</button>
				</div>
			</div>
		</div>
		{#if showBanner && page.url.pathname === '/'}
			<Banner />
		{/if}
	</nav>

	<!-- Mobile drawer backdrop -->
	{#if drawerOpen}
		<button
			class="z-50 fixed inset-0 bg-black/40 transition-opacity"
			onclick={() => (drawerOpen = false)}
			aria-label="Close menu"
		></button>
	{/if}

	<!-- Mobile drawer panel -->
	<aside
		class={cn(
			'md:hidden top-0 left-0 z-50 fixed flex flex-col bg-background shadow-lg p-6 w-64 h-full transition-transform duration-300 ease-in-out',
			drawerOpen ? 'translate-x-0' : '-translate-x-full'
		)}
	>
		<div class="flex items-center justify-between mb-8">
			<a href="/" onclick={() => (drawerOpen = false)}>
				<img src={Logo} alt="Logo" class="h-7 shrink-0" />
			</a>
			<button
				onclick={() => (drawerOpen = false)}
				class="inline-flex justify-center items-center hover:bg-accent rounded-lg size-8 transition-colors"
				aria-label="Close menu"
			>
				<X class="size-5" />
			</button>
		</div>
		<!-- Drawer search trigger -->
		<button
			onclick={() => {
				drawerOpen = false;
				searchOpen = true;
			}}
			class="flex items-center gap-2 bg-background hover:bg-accent mb-4 px-3 py-2 border border-input rounded-lg w-full text-muted-foreground text-sm transition-colors"
		>
			<SearchIcon class="size-4" />
			<span>Search products...</span>
		</button>
		<nav class="flex flex-col gap-4">
			{#each navLinks as link (link.href)}
				<a
					href={link.href}
					onclick={() => (drawerOpen = false)}
					class={cn(
						'hover:bg-accent px-3 py-2 rounded-md text-sm transition-colors',
						isActive(link.href) && 'bg-accent font-semibold'
					)}
				>
					{link.label}
				</a>
			{/each}
		</nav>
		<div class="mt-auto flex flex-col gap-2 border-t border-border pt-4">
			<a
				href="/terms-and-conditions"
				onclick={() => (drawerOpen = false)}
				class={cn(
					'hover:bg-accent px-3 py-1.5 rounded-md text-xs text-muted-foreground transition-colors',
					isActive('/terms-and-conditions') && 'bg-accent font-semibold'
				)}
			>
				Terms & Conditions
			</a>
			<a
				href="/privacy-policy"
				onclick={() => (drawerOpen = false)}
				class={cn(
					'hover:bg-accent px-3 py-1.5 rounded-md text-xs text-muted-foreground transition-colors',
					isActive('/privacy-policy') && 'bg-accent font-semibold'
				)}
			>
				Privacy Policy
			</a>
		</div>
	</aside>

	{@render children?.()}

	<Footer />
</main>

<SearchDialog bind:open={searchOpen} />

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
