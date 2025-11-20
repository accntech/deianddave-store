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
		width: 100%;
		background: color-mix(in oklab, var(--primary) 70%, transparent);
		white-space: nowrap;
		position: relative;
	}

	.banner:hover .banner-slide {
		animation-play-state: paused;
	}

	.banner-slide {
		animation: 20s slide infinite linear;
	}
</style>
