<script lang="ts">
	import Header from '$lib/assets/header.webp';
	import { onMount, onDestroy } from 'svelte';

	let displayText = $state('');

	const words = ['endures.', 'prevails.', 'elevates.', 'empowers.', 'Matters!'];

	const TYPE_SPEED = 50;

	const typewriter = (content: string) => {
		displayText = '';
		let index = 0;

		const interval = setInterval(() => {
			displayText += content[index];
			index++;
			if (index >= content.length) {
				clearInterval(interval);
			}
		}, TYPE_SPEED);
	};

	let cancelled = false;
	let holdTimeout: ReturnType<typeof setTimeout> | null = null;
	let typeTimeout: ReturnType<typeof setTimeout> | null = null;
	let backspaceInterval: ReturnType<typeof setInterval> | null = null;

	const wait = (ms: number) =>
		new Promise<void>((resolve) => {
			holdTimeout = setTimeout(() => {
				resolve();
			}, ms);
		});

	const backspace = (speed = TYPE_SPEED) =>
		new Promise<void>((resolve) => {
			backspaceInterval = setInterval(() => {
				if (cancelled) {
					if (backspaceInterval) clearInterval(backspaceInterval);
					backspaceInterval = null;
					resolve();
					return;
				}
				if (!displayText?.length) {
					if (backspaceInterval) clearInterval(backspaceInterval);
					backspaceInterval = null;
					resolve();
					return;
				}
				displayText = displayText.slice(0, -1);
			}, speed);
		});

	onMount(async () => {
		cancelled = false;
		while (!cancelled) {
			for (const word of words) {
				if (cancelled) break;
				typewriter(word);
				await new Promise<void>((resolve) => {
					const ms = Math.max(0, word.length * TYPE_SPEED);
					typeTimeout = setTimeout(() => resolve(), ms);
				});

				const isMatters = word.replace(/[^A-Za-z]/g, '') === 'Matters';
				const holdMs = isMatters ? 30_000 : 10_000;
				await wait(holdMs);

				await backspace(TYPE_SPEED);
			}
		}
	});

	onDestroy(() => {
		cancelled = true;
		if (holdTimeout) clearTimeout(holdTimeout);
		if (typeTimeout) clearTimeout(typeTimeout);
		if (backspaceInterval) clearInterval(backspaceInterval);
		holdTimeout = null;
		typeTimeout = null;
		backspaceInterval = null;
	});
</script>

<div class="relative -mt-16 h-70 w-full">
	<img
		src={Header}
		alt="Header"
		class="h-full w-full [mask-image:linear-gradient(to_bottom,transparent_10%,#000_75%,#000_100%)] object-cover opacity-75 [-webkit-mask-image:linear-gradient(to_bottom,transparent_10%,#000_75%,#000_100%)]"
	/>

	<div class="absolute top-24 left-0 mx-8">
		<p class="text-3xl font-medium text-primary">Because your choice</p>
		<p class="text-3xl font-bold text-[#F5711C]">{displayText}</p>
	</div>
</div>
<div class="h-56 bg-accent">
	<div class="flex flex-col items-center gap-4">
		<span>Beddings</span>
		<a href="/beddings" class="rounded-full bg-blue-700 px-4 py-2 text-white">Shop Collection</a>
	</div>
	<div class="flex flex-col items-center gap-4">
		<span>Loungewear</span>
		<a href="/loungewear" class="rounded-full bg-blue-700 px-4 py-2 text-white">Shop Collection</a>
	</div>
</div>
