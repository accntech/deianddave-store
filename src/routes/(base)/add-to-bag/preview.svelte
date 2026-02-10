<script>
	import { cn } from '$lib/utils';

	let { aspectRatio = '' } = $props();
</script>

<div class="flex justify-center px-4 py-12">
	<section class="flex gap-12">
		<!-- image placeholder -->
		<div class="min-w-75 lg:min-w-100 max-w-100 lg:max-w-125">
			<div class={cn('grid', aspectRatio)}>
				<div class="animate-pulse rounded-xl bg-muted"></div>
			</div>
		</div>
		<!-- details placeholder -->
		<div class="w-80 lg:w-90">
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
	</section>
</div>
