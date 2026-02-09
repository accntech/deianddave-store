<script lang="ts">
	import { LoaderCircleIcon } from '@lucide/svelte';
	import { fade } from 'svelte/transition';

	import { cn } from '$lib/utils';

	type Props = {
		class?: string;
		label?: string;
	};

	let { class: className, label = $bindable('') }: Props = $props();
</script>

<div
	in:fade={{ duration: 300, delay: 300 }}
	class={cn(
		'text-muted-foreground flex h-full w-full items-center justify-center place-self-stretch transition-all duration-300',
		className
	)}
>
	<div class="flex items-center gap-2">
		<LoaderCircleIcon class="animate-spin" />
		<span class="hidden sm:block">{label}</span>
	</div>
</div>
