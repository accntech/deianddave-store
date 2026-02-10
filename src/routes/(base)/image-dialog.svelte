<script lang="ts">
	import { LoaderCircleIcon, XIcon } from '@lucide/svelte';

	let imageUrl = $state('');
	let dialogEl: HTMLDialogElement;

	let scale = $state(1);
	let translateX = $state(0);
	let translateY = $state(0);

	// Drag state
	let dragging = false;
	let dragStartX = 0;
	let dragStartY = 0;
	let dragStartTranslateX = 0;
	let dragStartTranslateY = 0;

	// Pinch state
	let initialPinchDistance = 0;
	let initialPinchScale = 1;

	let animated = $state(false);
	let loaded = $state(false);

	const MIN_SCALE = 1;
	const MAX_SCALE = 5;

	function resetTransform() {
		scale = 1;
		translateX = 0;
		translateY = 0;
	}

	export const show = (url: string) => {
		imageUrl = '';
		loaded = false;
		resetTransform();
		requestAnimationFrame(() => {
			imageUrl = url;
			dialogEl.showModal();
			document.body.style.overflow = 'hidden';
		});
	};

	function onClose() {
		imageUrl = '';
		loaded = false;
		resetTransform();
		document.body.style.overflow = '';
	}

	function wheelAction(node: HTMLElement) {
		node.addEventListener('wheel', onWheel, { passive: false });
		return {
			destroy() {
				node.removeEventListener('wheel', onWheel);
			}
		};
	}

	function clampTranslate() {
		if (scale <= 1) {
			translateX = 0;
			translateY = 0;
		}
	}

	function onWheel(e: WheelEvent) {
		e.preventDefault();
		animated = true;
		const delta = e.deltaY > 0 ? -0.2 : 0.2;
		scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale + delta));
		clampTranslate();
	}

	function onPointerDown(e: PointerEvent) {
		if (e.pointerType === 'touch') return;
		if (scale <= 1) return;
		animated = false;
		dragging = true;
		dragStartX = e.clientX;
		dragStartY = e.clientY;
		dragStartTranslateX = translateX;
		dragStartTranslateY = translateY;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging) return;
		translateX = dragStartTranslateX + (e.clientX - dragStartX);
		translateY = dragStartTranslateY + (e.clientY - dragStartY);
	}

	function onPointerUp() {
		dragging = false;
	}

	function getTouchDistance(t1: Touch, t2: Touch) {
		return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
	}

	function onTouchStart(e: TouchEvent) {
		if (e.touches.length === 2) {
			e.preventDefault();
			animated = false;
			initialPinchDistance = getTouchDistance(e.touches[0], e.touches[1]);
			initialPinchScale = scale;
		} else if (e.touches.length === 1 && scale > 1) {
			animated = false;
			dragging = true;
			dragStartX = e.touches[0].clientX;
			dragStartY = e.touches[0].clientY;
			dragStartTranslateX = translateX;
			dragStartTranslateY = translateY;
		}
	}

	function onTouchMove(e: TouchEvent) {
		if (e.touches.length === 2) {
			e.preventDefault();
			const dist = getTouchDistance(e.touches[0], e.touches[1]);
			scale = Math.min(
				MAX_SCALE,
				Math.max(MIN_SCALE, initialPinchScale * (dist / initialPinchDistance))
			);
			clampTranslate();
		} else if (e.touches.length === 1 && dragging) {
			translateX = dragStartTranslateX + (e.touches[0].clientX - dragStartX);
			translateY = dragStartTranslateY + (e.touches[0].clientY - dragStartY);
		}
	}

	function onTouchEnd() {
		dragging = false;
		initialPinchDistance = 0;
	}

	function onDblClick() {
		animated = true;
		if (scale > 1) {
			resetTransform();
		} else {
			scale = 3;
		}
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialogEl}
	class="h-full max-h-full w-full max-w-full bg-transparent backdrop:bg-black/50 backdrop:backdrop-blur-sm"
	onclick={(e: MouseEvent) => {
		if (e.target === dialogEl) dialogEl.close();
	}}
	onkeydown={(e: KeyboardEvent) => {
		if (e.key === 'Escape') dialogEl.close();
	}}
	onclose={onClose}
>
	<button
		class="pointer-events-auto fixed top-4 right-4 z-10 rounded-full bg-black/50 p-1.5 text-white"
		onclick={() => dialogEl.close()}
		aria-label="Close"
	>
		<XIcon class="size-5" />
	</button>
	<div
		class="pointer-events-none flex h-full items-center justify-center overflow-hidden"
		role="img"
	>
		{#if !loaded}
			<div class="absolute flex gap-1 text-sm text-white">
				<LoaderCircleIcon class="animate-spin" /> Loading...
			</div>
		{/if}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<img
			src={imageUrl}
			alt="Preview"
			onload={() => (loaded = true)}
			class="pointer-events-auto max-h-[90vh] max-w-lg touch-none rounded-md object-contain select-none sm:rounded-xl"
			class:opacity-0={!loaded}
			style="transform: scale({scale}) translate({translateX / scale}px, {translateY / scale}px); will-change: transform; transition: {animated ? 'transform 0.2s ease-out' : 'none'}; cursor: {scale > 1 ? 'grab' : 'zoom-in'};"
			use:wheelAction
			onpointerdown={onPointerDown}
			onpointermove={onPointerMove}
			onpointerup={onPointerUp}
			ontouchstart={onTouchStart}
			ontouchmove={onTouchMove}
			ontouchend={onTouchEnd}
			ondblclick={onDblClick}
			draggable="false"
		/>
	</div>
</dialog>
