<script lang="ts">
	import { cn } from '$lib/utils';
	import { transform } from '$lib/utils/image-helper';
	import { onMount } from 'svelte';

	type Props = {
		class?: string;
		imageClass?: string;
		src: string;
		alt: string;
		transform: string;
	};

	let {
		class: className,
		imageClass,
		src = $bindable<string>(),
		alt,
		transform: transformStr
	}: Props = $props();

	let ref: HTMLDivElement;

	onMount(() => {
		const img = ref.querySelector('img');
		function loaded() {
			ref.classList?.add('loaded');
		}
		if (!img) return;

		if (img.complete) {
			loaded();
		} else {
			img.addEventListener('load', loaded);
		}
	});
</script>

<div bind:this={ref} class={cn('skeleton-img h-full w-full', className)}>
	<img
		src={`${transform(src, transformStr)}`}
		class={cn('h-full w-full object-cover', imageClass)}
		loading="lazy"
		decoding="async"
		{alt}
	/>
</div>

<style>
	.skeleton-img {
		background-color: #e2e2e2;
		overflow: hidden;
	}

	.skeleton-img img {
		opacity: 0;
		transition: opacity 500ms ease-in-out;
	}

	.skeleton-img::before {
		content: '';
		position: absolute;
		opacity: 0;
		inset: 0;
		animation: pulse 2.5s infinite;
		background-color: white;
	}

	@keyframes pulse {
		0% {
			opacity: 0;
		}
		50% {
			opacity: 0.75;
		}
		100% {
			opacity: 0;
		}
	}

	.skeleton-img.loaded {
		filter: none;
	}

	.skeleton-img.loaded::before {
		animation: none;
		content: none;
		filter: none;
	}

	.skeleton-img.loaded img {
		opacity: 1;
	}
</style>
