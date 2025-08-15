<script lang="ts" module>
	import { z } from 'zod/v4';
	import PaymongoLogo from '$lib/assets/paymongo.svg';

	const schema = z.object({
		fullName: z.string().min(2, { message: 'Name is too short' }),
		email: z.email({ message: 'Invalid email address' }),
		contactNumber: z.string().min(10, { message: 'Invalid contact number' }),
		address: z.string().min(5, { message: 'Address must be at least 5 characters long' })
	});
</script>

<script lang="ts">
	import { getOrderState } from '$lib/client/order.svelte';
	import { focusTrap } from '$lib/components/actions/focus-trap';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { LoaderCircleIcon } from '@lucide/svelte';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { Textarea } from '$lib/components/ui/textarea';
	import Button from '$lib/components/ui/button/button.svelte';
	import { onMount } from 'svelte';

	type Props = {
		index: number;
	};

	let { index = $bindable<number>(0) }: Props = $props();

	let orderState = getOrderState();
	const form = superForm(defaults(zod4(schema)), {
		validators: zod4(schema),
		SPA: true,
		onResult: ({ result }) => {
			if (result.status === 200) {
				orderState.accountInfo = $formData;
				index = 2;
			}
		}
	});
	const { form: formData, enhance, submitting, reset } = form;

	onMount(() => {
		if (orderState.accountInfo) {
			$formData.fullName = orderState.accountInfo.fullName;
			$formData.email = orderState.accountInfo.email;
			$formData.contactNumber = orderState.accountInfo.contactNumber;
			$formData.address = orderState.accountInfo.address;
		} else {
			reset();
		}
	});
</script>

<form method="POST" use:enhance use:focusTrap>
	<Card.Root class="rounded-none border-0 shadow-none sm:w-[375px] sm:rounded-3xl">
		<Card.Header>
			<Card.Title class="sm:text-lg">Account Information</Card.Title>
			<Card.Description>Provide your account information below.</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4">
			<Form.Field {form} name="fullName">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Full name</Form.Label>
						<Input placeholder="Enter your name" {...props} bind:value={$formData.fullName} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Email</Form.Label>
						<Input {...props} placeholder="user@example.com" bind:value={$formData.email} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="contactNumber">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Contact Number</Form.Label>
						<Input
							{...props}
							placeholder="Enter your contact number"
							bind:value={$formData.contactNumber}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="address">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Address</Form.Label>
						<Textarea
							{...props}
							placeholder="Enter your delivery address"
							bind:value={$formData.address}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</Card.Content>
		<Card.Footer class="flex w-full flex-row-reverse justify-between gap-4">
			<Form.Button disabled={$submitting} class="w-32 rounded-lg">
				{#if $submitting}
					<LoaderCircleIcon class="h-5 w-5 animate-spin" />
				{/if}
				Next
			</Form.Button>
			<Button variant="outline" class="w-32 rounded-lg" onclick={() => (index = 0)}>Cancel</Button>
		</Card.Footer>
	</Card.Root>
</form>
