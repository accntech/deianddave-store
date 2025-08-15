<script lang="ts" module>
	import { z } from 'zod/v4';

	const schema = z
		.object({
			methodType: z.enum(['card', 'e-wallet']).default('card'),
			holderName: z.string().default(''),
			cardNumber: z.string().default(''),
			expiryDate: z.string().default(''),
			cvv: z.string().default(''),
			ewallet: z.enum(['gcash', 'paymaya', 'grab_pay']).default('gcash')
		})
		.superRefine((data, ctx) => {
			if (data.methodType === 'card') {
				if (data.holderName.length === 0) {
					ctx.addIssue({
						code: 'custom',
						message: 'Card holder name is required',
						path: ['holderName']
					});
				}
				if (data.cardNumber.length === 0) {
					ctx.addIssue({
						code: 'custom',
						message: 'Card number is required',
						path: ['cardNumber']
					});
				} else {
					const num = data.cardNumber.replace(/\s/g, '');

					if (!tryParseCardNumber(num).success) {
						ctx.addIssue({
							code: 'custom',
							message: 'Card type is not supported',
							path: ['cardNumber']
						});
					}
				}
				if (data.expiryDate.length === 0) {
					ctx.addIssue({
						code: 'custom',
						message: 'Expiry date is required',
						path: ['expiryDate']
					});
				} else if (!tryParseCardDate(data.expiryDate).success) {
					ctx.addIssue({
						code: 'custom',
						message: 'Invalid expiry date',
						path: ['expiryDate']
					});
				}

				if (!tryParseCvv(data.cvv).success) {
					ctx.addIssue({
						code: 'custom',
						message: 'Invalid value',
						path: ['cvv']
					});
				}
			}
		});
</script>

<script lang="ts">
	import GCashLogo from '$lib/assets/gcash.svg';
	import GrabPayLogo from '$lib/assets/grabpay.svg';
	import PayMayaLogo from '$lib/assets/paymaya.svg';
	import VisaMasterCardLogo from '$lib/assets/visa-mastercard.webp';
	import { getOrderState } from '$lib/client/order.svelte';
	import { focusTrap } from '$lib/components/actions/focus-trap';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { MaskInput } from '$lib/components/ui/mask-input';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { tryParseCardDate, tryParseCardNumber, tryParseCvv } from '$lib/utils/card-helper';
	import { CheckIcon, CreditCardIcon, LoaderCircleIcon, WalletIcon } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';

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
				orderState.paymentMethod = { method: $formData.methodType, ...$formData };
				index = 3;
			}
		}
	});
	const { form: formData, enhance, submitting, reset, errors } = form;

	onMount(() => {
		if (orderState.paymentMethod) {
			$formData.methodType = orderState.paymentMethod.holderName ? 'card' : 'e-wallet';
			$formData.holderName = orderState.paymentMethod.holderName;
			$formData.cardNumber = orderState.paymentMethod.cardNumber;
			$formData.expiryDate = orderState.paymentMethod.expiryDate;
			$formData.cvv = orderState.paymentMethod.cvv;
			$formData.ewallet = orderState.paymentMethod.ewallet;
		} else {
			reset();
		}
	});

	const onMethodChanged = (value: string) => {
		if (value === 'card') {
			$formData.ewallet = 'gcash';
		} else {
			$formData.holderName = '';
			$formData.cardNumber = '';
			$formData.expiryDate = '';
			$formData.cvv = '';
			$formData.ewallet = 'gcash';
		}

		errors.clear();
	};

	const onWalletChanged = (value: string) => {
		$formData.ewallet = value as 'gcash' | 'paymaya' | 'grab_pay';
		errors.clear();
	};
</script>

<form method="POST" use:enhance use:focusTrap>
	<Card.Root class="rounded-none border-0 shadow-none sm:w-[375px] sm:rounded-3xl">
		<Card.Header>
			<Card.Title class="sm:text-lg">Payment Details</Card.Title>
			<Card.Description>Complete your purchase by providing your payment details</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4">
			<Form.Fieldset {form} name="methodType">
				<Form.Legend>Payment Method</Form.Legend>
				<RadioGroup.Root
					name="methodType"
					class="flex gap-2"
					onValueChange={onMethodChanged}
					bind:value={$formData.methodType}
				>
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label
								class="transition-color relative flex w-24 cursor-pointer flex-col items-center justify-between gap-2 rounded-lg border-2 border-muted bg-popover p-4 duration-300 hover:bg-secondary [&:has([data-state=checked])]:border-primary"
							>
								<RadioGroup.Item class="peer sr-only" value="card" {...props} />
								<CreditCardIcon size="28" />
								<CheckIcon
									class="absolute top-1 right-2 text-primary opacity-0 transition-opacity duration-300 peer-data-[state=checked]:opacity-100"
									size="20"
								/>
								Card
							</Form.Label>
						{/snippet}
					</Form.Control>
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label
								class="transition-color relative flex w-24 cursor-pointer flex-col items-center justify-between gap-2 rounded-lg border-2 border-muted bg-popover p-4 duration-300 hover:bg-secondary [&:has([data-state=checked])]:border-primary"
							>
								<RadioGroup.Item class="peer sr-only" value="e-wallet" {...props} />
								<WalletIcon size="28" />
								<CheckIcon
									class="absolute top-1 right-2 text-primary opacity-0 transition-opacity duration-300 peer-data-[state=checked]:opacity-100"
									size="20"
								/>
								E-Wallet
							</Form.Label>
						{/snippet}
					</Form.Control>
				</RadioGroup.Root>
				<Form.FieldErrors />
			</Form.Fieldset>
			{#if $formData.methodType === 'card'}
				<Form.Field {form} name="holderName">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Card Holder Name</Form.Label>
							<Input
								{...props}
								placeholder="Enter card holder name"
								bind:value={$formData.holderName}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} class="self-baseline" name="cardNumber">
					<Form.Control>
						{#snippet children({ props })}
							<div class="flex items-center gap-2">
								<Form.Label class="flex-grow">Card Number</Form.Label>
								<img
									class="h-6 w-24 object-cover antialiased"
									src={VisaMasterCardLogo}
									alt="Visa/Mastercard"
								/>
							</div>
							<MaskInput
								mask="9999 9999 9999 9999"
								placeholder="1234 5678 9012 3456"
								bind:value={$formData.cardNumber}
								{...props}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<div class="flex gap-4">
					<Form.Field {form} name="expiryDate">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Expiry Date</Form.Label>
								<MaskInput
									mask="99/99"
									bind:value={$formData.expiryDate}
									type="text"
									placeholder="MM/YY"
									{...props}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="cvv">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>CVV</Form.Label>
								<MaskInput mask="999" placeholder="123" bind:value={$formData.cvv} {...props} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
			{:else}
				<Form.Fieldset {form} name="ewallet">
					<Form.Legend>Digital Wallet</Form.Legend>
					<RadioGroup.Root
						onValueChange={onWalletChanged}
						name="ewallet"
						class="grid grid-cols-3"
						bind:value={$formData.ewallet}
					>
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label
									class="transition-color relative flex w-full cursor-pointer flex-col items-center justify-between gap-2 rounded-lg border-2 border-muted bg-popover p-4 duration-300 hover:bg-secondary [&:has([data-state=checked])]:border-primary"
								>
									<RadioGroup.Item class="peer sr-only" value="gcash" {...props} />
									<CheckIcon
										class="absolute top-1 right-2 text-primary opacity-0 transition-opacity duration-300 peer-data-[state=checked]:opacity-100"
										size="20"
									/>
									<img class="object-cover" src={GCashLogo} alt="GCash" />
								</Form.Label>
							{/snippet}
						</Form.Control>
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label
									class="transition-color relative flex w-full cursor-pointer flex-col items-center justify-between gap-2 overflow-clip rounded-lg border-2 border-muted bg-popover duration-300 hover:bg-secondary [&:has([data-state=checked])]:border-primary"
								>
									<RadioGroup.Item class="peer sr-only" value="paymaya" {...props} />
									<CheckIcon
										class="absolute top-1 right-2 text-white opacity-0 transition-opacity duration-300 peer-data-[state=checked]:opacity-100"
										size="20"
									/>
									<img class="h-full w-full object-cover" src={PayMayaLogo} alt="Paymaya" />
								</Form.Label>
							{/snippet}
						</Form.Control>
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label
									class="transition-color relative flex w-full cursor-pointer flex-col items-center justify-between gap-2 rounded-lg border-2 border-muted bg-popover p-4 duration-300 hover:bg-accent [&:has([data-state=checked])]:border-primary"
								>
									<RadioGroup.Item class="peer sr-only" value="grab_pay" {...props} />
									<CheckIcon
										class="absolute top-1 right-2 text-primary opacity-0 transition-opacity duration-300 peer-data-[state=checked]:opacity-100"
										size="20"
									/>
									<img class="object-cover" src={GrabPayLogo} alt="GrabPay" />
								</Form.Label>
							{/snippet}
						</Form.Control>
					</RadioGroup.Root>
					<Form.FieldErrors />
				</Form.Fieldset>
			{/if}
		</Card.Content>
		<Card.Footer class="flex w-full flex-row-reverse  justify-between gap-4">
			<Form.Button disabled={$submitting} class="w-32 rounded-lg">
				{#if $submitting}
					<LoaderCircleIcon class="h-5 w-5 animate-spin" />
				{/if}
				Next
			</Form.Button>
			<Button variant="outline" class="w-32 rounded-lg" onclick={() => (index = 1)}>Back</Button>
		</Card.Footer>
	</Card.Root>
</form>
