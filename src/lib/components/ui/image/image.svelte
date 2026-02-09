<script lang="ts">
	import { cn } from '$lib/utils';
	import { transform } from '$lib/utils/image-helper';
	import { onMount } from 'svelte';

	type Props = {
		class?: string;
		imageClass?: string;
		src: string;
		alt: string;
		transform?: string;
		background?: string;
		onLoaded?: () => void;
	};

	let {
		class: className,
		imageClass,
		src = $bindable<string>(),
		alt,
		transform: transformStr,
		background,
		onLoaded = () => {}
	}: Props = $props();

	let ref: HTMLDivElement;

	onMount(() => {
		const img = ref.querySelector('img');
		function loaded() {
			ref?.classList?.add('loaded');
			onLoaded();
		}
		if (!img) return;

		if (img.complete) {
			loaded();
		} else {
			img.addEventListener('load', loaded);
		}
	});
</script>

<div
	bind:this={ref}
	class={cn('skeleton-img h-full', className)}
	style={`background-color: ${background ?? '#e2e2e2'}`}
>
	<img
		src={`${transform(src, transformStr ?? '')}`}
		class={imageClass}
		loading="lazy"
		decoding="async"
		{alt}
	/>
</div>

<style>
	.skeleton-img {
		position: relative;
		overflow: hidden;
	}

	.skeleton-img img {
		opacity: 0;
		transition: all 300ms;
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
