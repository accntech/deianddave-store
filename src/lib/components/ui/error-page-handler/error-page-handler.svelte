<script lang="ts">
	import { onMount, type Snippet } from 'svelte';

	import type { ErrorResult } from '.';

	type Props = {
		results: ErrorResult[];
		children: Snippet;
		onLoad?: () => void;
	};

	let { results: result, children, onLoad = () => {} }: Props = $props();

	let error: ErrorResult | undefined = $derived.by(() => {
		if (result && result.length > 0) {
			return result.find((result) => result.status !== 200 && result.status !== 201);
		}

		return undefined;
	});

	onMount(() => {
		onLoad();
	});
</script>

{#if error}
	<section class="w-full">
		<div class="flex flex-col items-center justify-center p-6 text-center">
			<h1 class="text-5xl transition-all duration-300 sm:text-7xl">{error.status}</h1>
			{#if error.errors && error.errors.messages && error.errors.messages.length > 0}
				<p class="text-muted-foreground">{error.errors.messages.join(', ')}</p>
			{:else if error.errors && error.errors.custom}
				<p class="text-muted-foreground">{Object.values(error.errors.custom).join(', ')}</p>
			{:else}
				<p class="text-muted-foreground">An unexpected error occurred. Please try again later.</p>
			{/if}
		</div>
	</section>
{:else}
	{@render children()}
{/if}
