<script>
	import { cn } from '$lib/utils';

	let { aspectRatio = '' } = $props();
</script>

<div class="flex flex-col px-4 lg:items-center">
	<div class="grid gap-12 md:grid-cols-[1fr_auto] lg:w-full lg:max-w-[1128px]">
		<div class={cn('grid', aspectRatio)}>
			<div class="animate-pulse rounded-xl bg-muted"></div>
		</div>
		<div class="mt-8 sm:w-80 md:mt-0 lg:w-90">
			<div class="row-2 mb-2 h-4 w-36 animate-pulse justify-start rounded bg-muted"></div>
			<div class="row-2 h-8 w-full animate-pulse rounded-md bg-muted"></div>

			<div
				class="row-2 mt-8 mb-2 hidden h-9 w-28 animate-pulse justify-start rounded-md bg-muted sm:block"
			></div>

			<div class="row-2 mt-8 mb-2 h-4 w-20 animate-pulse justify-start rounded bg-muted"></div>
			<div class="flex gap-4">
				<div class="row-2 mb-2 h-9 w-28 animate-pulse justify-start rounded-lg bg-muted"></div>
				<div class="row-2 mb-2 h-9 w-28 animate-pulse justify-start rounded-lg bg-muted"></div>
			</div>
			<div
				class="col-1 row-2 mt-6 mb-2 h-4 w-20 animate-pulse justify-start rounded bg-muted"
			></div>
			<div class="flex gap-4">
				<div class="row-2 mb-2 size-6 animate-pulse justify-start rounded-full bg-muted"></div>
				<div class="row-2 mb-2 size-6 animate-pulse justify-start rounded-full bg-muted"></div>
				<div class="row-2 mb-2 size-6 animate-pulse justify-start rounded-full bg-muted"></div>
				<div class="row-2 mb-2 size-6 animate-pulse justify-start rounded-full bg-muted"></div>
			</div>
			<div class="row-2 mt-6 mb-2 h-4 w-20 animate-pulse justify-start rounded bg-muted"></div>
			<div class="row-2 mb-2 h-9 w-28 animate-pulse justify-start rounded-lg bg-muted"></div>

			<div
				class="row-2 mt-8 mb-2 hidden h-12 w-full animate-pulse justify-start rounded-full bg-muted sm:block"
			></div>
		</div>
	</div>
</div>
