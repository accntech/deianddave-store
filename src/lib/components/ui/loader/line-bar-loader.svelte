<script lang="ts">
	import { cn } from '$lib/utils';

	type Props = {
		class?: string;
		containerClass?: string;
	};

	let { class: className = '', containerClass = '' }: Props = $props();
</script>

<div class={containerClass}>
	<div class={cn('loader bg-primary h-1 rounded-r-full', className)}></div>
</div>

<style>
	.loader {
		animation: loader 5s linear infinite;
	}

	@keyframes loader {
		0% {
			width: 1%;
			opacity: 0;
		}

		30% {
			width: 50%;
		}

		50% {
			width: 100%;
			opacity: 1;
		}

		100% {
			width: 1%;
			opacity: 0;
		}
	}
</style>
