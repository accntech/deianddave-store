<script>
	import { CircleDotIcon, TruckIcon } from '@lucide/svelte';
</script>

<div class="banner">
	{#each Array(8) as _}
		<div class="banner-slide flex flex-row items-center gap-2 p-2 text-white">
			<CircleDotIcon class="h-3 -scale-x-100" />
			<TruckIcon class="h-6 w-8 -scale-x-100" />
			<p class="text-sm">Free shipping nationwide, NO MINIMUM amount of purchase required!</p>
		</div>
	{/each}
</div>

<style>
	@keyframes slide {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-100%);
		}
	}

	.banner {
		overflow: hidden;
		display: flex;
		background: color-mix(in oklab, var(--primary) 70%, transparent);
		white-space: nowrap;
		position: relative;
	}

	.banner:before,
	.banner:after {
		position: absolute;
		top: 0;
		width: 50px;
		height: 100%;
		content: '';
		z-index: 2;
	}

	.banner:before {
		left: 0;
		background: linear-gradient(
			to left,
			rgba(255, 255, 255, 0),
			color-mix(in oklab, var(--primary) 70%, transparent)
		);
	}

	.banner:after {
		right: 0;
		background: linear-gradient(
			to right,
			rgba(255, 255, 255, 0),
			color-mix(in oklab, var(--primary) 70%, transparent)
		);
	}

	.banner:hover .banner-slide {
		animation-play-state: paused;
	}

	.banner-slide {
		animation: 20s slide infinite linear;
	}
</style>
