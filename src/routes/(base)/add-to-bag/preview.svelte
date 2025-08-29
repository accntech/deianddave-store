<script>
	import { cn } from '$lib/utils';

	let { aspectRatio = '' } = $props();
</script>

<div class="flex flex-col">
	<div class="grid gap-12 sm:grid-cols-[1fr_auto] sm:place-self-center xl:max-w-[1280px]">
		<div
			class={cn('row-1mx-4 col-1 animate-pulse rounded-xl bg-muted sm:w-[623px]', aspectRatio)}
		></div>
		<div class="mx-4 my-8 sm:m-0 sm:w-80 lg:w-90">
			<div class="row-2 mb-2 h-4 w-36 animate-pulse justify-start rounded bg-muted"></div>
			<div class="row-2 h-8 w-full animate-pulse rounded-md bg-muted"></div>
			<div class="row-2 mt-8 mb-2 h-4 w-20 animate-pulse justify-start rounded bg-muted"></div>
			<div class="flex gap-4">
				<div class="row-2 mb-2 h-9 w-28 animate-pulse justify-start rounded-md bg-muted"></div>
				<div class="row-2 mb-2 h-9 w-28 animate-pulse justify-start rounded-md bg-muted"></div>
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
			<div class="row-2 mb-2 h-9 w-28 animate-pulse justify-start rounded-md bg-muted"></div>
		</div>
	</div>
</div>
