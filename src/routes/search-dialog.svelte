<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Image } from '$lib/components/ui/image';
	import { toPeso } from '$lib/utils/number-helper';
	import { Search, Loader2, X } from '@lucide/svelte';
	import { PUBLIC_DEFAULT_PRODUCT_IMAGE } from '$env/static/public';
	import type { Product } from '$lib/services/inventory';
	import type { Result } from '$lib/services';

	let { open = $bindable(false) }: { open: boolean } = $props();

	let query = $state('');
	let results = $state<Product[]>([]);
	let loading = $state(false);
	let debounceTimer: ReturnType<typeof setTimeout>;

	$effect(() => {
		if (!open) {
			query = '';
			results = [];
			return;
		}
	});

	$effect(() => {
		const q = query.trim();

		clearTimeout(debounceTimer);

		if (!q) {
			results = [];
			loading = false;
			return;
		}

		loading = true;

		debounceTimer = setTimeout(async () => {
			try {
				const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
				const data: Result<Product[]> = await res.json();
				results = data.data;
			} catch {
				results = [];
			} finally {
				loading = false;
			}
		}, 300);
	});

	function clearQuery() {
		query = '';
	}
</script>

<Dialog.Root
	{open}
	onOpenChange={(value) => {
		open = value;
	}}
>
	<Dialog.Content showCloseButton={false} class="sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col p-0">
		<Dialog.Title class="sr-only">Search products</Dialog.Title>
		<Dialog.Description class="sr-only">Search for beddings and loungewear products</Dialog.Description>

		<!-- Search header -->
		<!-- svelte-ignore a11y_autofocus -->
		<div class="flex items-center gap-2 border-b px-4 py-3">
			<Search class="size-4 shrink-0 text-muted-foreground" />
			<input
				type="text"
				placeholder="Search products..."
				autofocus
				bind:value={query}
				class="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
			/>
			{#if query}
				<button onclick={clearQuery}>
					<X class="size-4" />
				</button>
			{/if}
		</div>

		<!-- Results area -->
		<div class="flex-1 overflow-y-auto p-2">
			{#if loading}
				<div class="flex items-center justify-center py-8">
					<Loader2 class="size-5 animate-spin text-muted-foreground" />
				</div>
			{:else if query && results.length === 0}
				<p class="py-8 text-center text-sm text-muted-foreground">No results found</p>
			{:else if !query}
				<p class="py-8 text-center text-sm text-muted-foreground">Search for products...</p>
			{:else}
				{#each results as p (p.id)}
					<a
						href="/add-to-bag?productId={p.product.id}&fabricId={p.fabric.id}&ageGroupId={p.ageGroup?.id}&genderGroupId={p.genderGroup?.id}"
						onclick={() => (open = false)}
						class="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-accent"
					>
						<div class="size-12 shrink-0 overflow-hidden rounded-md">
							<Image
								src={p.image || PUBLIC_DEFAULT_PRODUCT_IMAGE}
								alt={p.product.name}
								transform="g_auto:classic,w_100,c_fill"
								class="size-full"
								imageClass="size-full object-cover"
							/>
						</div>
						<div class="flex flex-1 flex-col gap-0.5 overflow-hidden">
							<span class="truncate text-sm font-medium">{p.product.name}</span>
							<span class="truncate text-xs text-muted-foreground">{p.fabric.name}</span>
						</div>
						<div class="flex flex-col items-end gap-0.5">
							<span class="text-sm font-medium">{toPeso(p.price)}</span>
							<span class="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium capitalize"
								>{p.type}</span
							>
						</div>
					</a>
				{/each}
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>
