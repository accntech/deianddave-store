<script lang="ts">
	import { getOrderState } from '$lib/client/order.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import type { Discount } from '$lib/services';
	import { TagIcon, XIcon } from '@lucide/svelte';
	import * as InputGroup from '$lib/components/ui/input-group';

	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { z } from 'zod/v4';

	type Props = {
		discounts: Discount[];
	};

	let { discounts }: Props = $props();

	const order = getOrderState();

	const schema = z
		.object({
			discountCode: z.string().default('')
		})
		.superRefine(async (data, ctx) => {
			if (data.discountCode !== '') {
				const discount = discounts.find((d) => d.code === data.discountCode);
				if (discount?.status !== 'active') {
					ctx.addIssue({
						code: 'custom',
						message: 'Invalid discount code',
						path: ['discountCode']
					});
				}
			}
		});

	const form = superForm(defaults(zod4(schema)), {
		validators: zod4(schema),
		SPA: true,
		onResult: async ({ result }) => {
			if (result.status === 200) {
				order.discount =
					discounts.find((d) => d.code === $formData.discountCode) ||
					({ code: '', type: 'fixed', value: 0 } as Discount);
			}
		}
	});
	const { form: formData, enhance } = form;

	const onDiscountCodeChange = () => {
		if ($formData.discountCode === '') {
			order.discount = { code: '', type: 'fixed', value: 0 } as Discount;
		}
	};
</script>

<form method="POST" use:enhance class="gap-2 grid grid-cols-[1fr_auto]">
	<Form.Field {form} name="discountCode" class="col-1">
		<Form.Control>
			{#snippet children({ props })}
				 <InputGroup.Root>
				<InputGroup.Input placeholder="Discount code"
					{...props}
					bind:value={$formData.discountCode}
					onchange={onDiscountCodeChange}/>
					<InputGroup.Addon align="inline-end">
					<InputGroup.Button variant="ghost"  disabled={$formData.discountCode === ''}>Apply</InputGroup.Button>
					</InputGroup.Addon>
				</InputGroup.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
</form>
{#if order.discount?.code}
	<button
		class="flex bg-secondary px-2 py-1 rounded-sm text-secondary-foreground text-xs"
		onclick={() => (order.discount = { code: '', type: 'fixed', value: 0 } as Discount)}
	>
		<XIcon class="mr-2 size-4" />
		{order.discount.code}
		<TagIcon class="ml-1 size-4" />
	</button>
{/if}
