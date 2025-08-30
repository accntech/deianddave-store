<script>
	import { ChevronLeftIcon } from '@lucide/svelte';

	import { page } from '$app/state';
	import { PUBLIC_APP_TITLE } from '$env/static/public';

	import { Button } from '$lib/components/ui/button';
</script>

<svelte:head>
	<title>{PUBLIC_APP_TITLE} | Error</title>
	<meta name="description" content="Invalid request" />
</svelte:head>

<div class="flex h-[calc(100dvh-4rem)] w-full flex-col items-center justify-center">
	<h1 class="text-7xl font-bold text-primary sm:text-9xl">{page.status}</h1>
	<span class="mt-3 text-muted-foreground">
		{page.error?.message ?? 'Oops, something went wrong.'}</span
	>
	<Button variant="outline" href="/" class="mt-6">
		<ChevronLeftIcon />
		Go back to home
	</Button>
</div>
