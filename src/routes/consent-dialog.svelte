<script lang="ts">
	import { page } from '$app/state';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { getConsentState } from '$lib/client/consent.svelte';

	const consent = getConsentState();
	const excludedPaths = ['/terms-and-conditions', '/privacy-policy'];
	let isExcluded = $derived(excludedPaths.includes(page.url.pathname));
</script>

<Dialog.Root open={!consent.accepted && !isExcluded} onOpenChange={() => {}}>
	<Dialog.Content
		showCloseButton={false}
		onInteractOutside={(e) => e.preventDefault()}
		onEscapeKeydown={(e) => e.preventDefault()}
		class="sm:max-w-md"
	>
		<Dialog.Header>
			<Dialog.Title>Terms & Privacy</Dialog.Title>
			<Dialog.Description>
				By continuing to use this site, you agree to our
				<a
					href="/terms-and-conditions"
					target="_blank"
					tabindex={-1}
					class="hover:text-primary underline underline-offset-4"
				>
					Terms & Conditions
				</a>
				and
				<a
					href="/privacy-policy"
					target="_blank"
					tabindex={-1}
					class="hover:text-primary underline underline-offset-4"
				>
					Privacy Policy</a
				>.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button onclick={() => consent.accept()} class="w-full">I Agree</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
