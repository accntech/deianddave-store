<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Image } from '$lib/components/ui/image';
	import { cn } from '$lib/utils';
	import { LoaderCircleIcon } from '@lucide/svelte';
	import { Viewer } from 'svelte-image-viewer';

	let imageUrl = $state('');
	let open = $state(false);

	export const show = (url: string) => {
		imageUrl = url;
		open = true;
	};

	let loaded = $state(false);
</script>

<Dialog.Root bind:open>
	<Dialog.Content
		class="isolate aspect-6/9 h-full max-h-full max-w-full rounded-none border-0 bg-white/50 p-0 shadow-none backdrop-blur-sm sm:max-h-full sm:max-w-full"
	>
		<div
			class={cn(
				'flex gap-1 place-self-center text-center text-sm text-white transition-opacity duration-300',
				loaded ? 'opacity-0' : ''
			)}
		>
			<LoaderCircleIcon class="animate-spin" /> Loading...
		</div>
		<Viewer>
			<Image
				src={imageUrl}
				onLoaded={() => (loaded = true)}
				alt="Image Preview"
				class="flex max-w-lg items-center rounded-md sm:rounded-xl"
				imageClass="w-full object-fit"
			/>
		</Viewer>
	</Dialog.Content>
</Dialog.Root>
