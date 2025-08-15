<script lang="ts">
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';

	type Props = {
		active: number;
		steps: string[];
		allowClick?: boolean;
		containerClass?: string;
		labelClass?: string;
		onStepChange?: (step: number) => void;
	};

	let {
		active = $bindable(),
		steps,
		allowClick,
		containerClass,
		labelClass,
		onStepChange
	}: Props = $props();

	let container: HTMLElement, circles: any[] | NodeListOf<Element>, progress: HTMLElement;

	onMount(() => {
		circles = container.querySelectorAll('.circle');
		update();
	});

	export const handleProgress = (stepIncrement: number) => {
		if (stepIncrement == 1) {
			active++;

			if (active > circles.length) {
				active = circles.length;
			}
		} else {
			active--;

			if (active < 1) {
				active = 1;
			}
		}

		update();
	};

	const onClick = (step: number) => {
		if (allowClick) {
			active = step;
			update();
		}
	};

	$effect(() => {
		update();
	});

	const update = () => {
		circles.forEach((circle, idx) => {
			if (idx < active) {
				circle.classList.add('active');
			} else {
				circle.classList.remove('active');
			}
		});

		const actives = document.querySelectorAll('.active');

		progress.style.width = ((actives.length - 1) / (circles.length - 1)) * 100 + '%';

		onStepChange?.(active);
	};
</script>

<div class={cn('progress-container', containerClass)} bind:this={container}>
	<div class="progress" bind:this={progress}></div>
	{#each steps as step, i}
		<button
			onclick={() => onClick(i + 1)}
			class={cn(
				'circle text-sm text-nowrap',
				i === 0 ? 'active' : '',
				allowClick ? '' : 'cursor-default',
				labelClass
			)}
			data-title={step}
		>
			{i + 1}
		</button>
	{/each}
</div>

<style>
	.progress-container {
		display: flex;
		justify-content: space-between;
		position: relative;
		border-radius: calc(infinity * 1px);
		margin-bottom: 25px;
		max-width: 100%;
	}

	.progress-container::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
		height: 4px;
		width: 100%;
		z-index: 0;
		background-color: var(--accent);
	}

	.progress {
		position: absolute;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
		height: 4px;
		width: 0%;
		z-index: 0;
		transition: 0.4s ease;
		background-color: var(--primary);
	}

	.circle {
		z-index: 0;
		border-radius: 50%;
		height: 30px;
		width: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 3px solid;
		transition: 0.4s ease;
		background-color: var(--accent);
		border-color: var(--accent);
		color: var(--accent-foreground);
	}

	.circle::after {
		content: attr(data-title) ' ';
		position: absolute;
		top: 35px;
		transition: 0.4s ease;
		color: color-mix(in oklab, var(--primary) 50%, transparent);
	}

	.circle.active::after {
		color: var(--primary);
	}

	.circle.active {
		border-color: var(--primary);
		font-weight: var(--font-weight-semibold);
	}
</style>
