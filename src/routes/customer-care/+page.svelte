<script lang="ts">
	import { cn } from '$lib/utils';
	import { PUBLIC_APP_TITLE } from '$env/static/public';
	import { Check, Dot } from '@lucide/svelte';
	import { onMount } from 'svelte';

	import CareBasin from './assets/care-basin.svg';
	import CareBleach from './assets/care-bleach.svg';
	import CareTumbleDry from './assets/care-tumble-dry.svg';
	import CareIron from './assets/care-iron.svg';
	import CareDryClean from './assets/care-dry-clean.svg';

	const sections = [
		{ id: 'shipping', label: 'Shipping' },
		{ id: 'care-guide', label: 'Care Guide' },
		{ id: 'size-guide', label: 'Size Guide' },
		{ id: 'return-and-exchange', label: 'Return & Exchange' },
		{ id: 'faq', label: 'FAQ' }
	] as const;

	let activeSection: string = $state(sections[0].id);

	const careIcons = [
		{ src: CareBasin, alt: 'Wash at water temperature not above 30°C' },
		{ src: CareBleach, alt: 'Do not bleach' },
		{ src: CareTumbleDry, alt: 'Tumble dry, low temperature' },
		{ src: CareIron, alt: 'Iron on low heat' },
		{ src: CareDryClean, alt: 'Do not dry clean' }
	];

	const washingInstructions = [
		'Do not use fabric softener!',
		'Use only mild detergent.',
		'Wash with same color.',
		'Wash separately to avoid abrasion.',
		'Avoid washing together with other types of fabric.'
	];

	const beddingSizes = [
		{
			size: 'Single / Twin',
			pillowcase: '20" x 26"',
			fittedSheet: '40" x 75" + 16" deep',
			flatSheet: '66" x 96" + 4"'
		},
		{
			size: 'Double/Full',
			pillowcase: '20" x 26"',
			fittedSheet: '54" x 75" + 16" deep',
			flatSheet: '81" x 96" + 4"'
		},
		{
			size: 'Queen',
			pillowcase: '20" x 30"',
			fittedSheet: '60" x 80" + 16" deep',
			flatSheet: '90" x 102" + 4"'
		},
		{
			size: 'King',
			pillowcase: '20" x 36"',
			fittedSheet: '78" x 80" + 16" deep',
			flatSheet: '108" x 102" + 4"'
		}
	];

	const loungewearSizes = [
		{ label: 'Shoulder', small: '17"', medium: '18"', large: '19.5"' },
		{ label: 'Sleeve Length', small: '7.5"', medium: '8"', large: '8"' },
		{ label: 'Chest', small: '40"', medium: '42"', large: '44"' },
		{ label: 'Shirt Length', small: '24.5"', medium: '26"', large: '28"' },
		{ label: 'Waist', small: '40"', medium: '44"', large: '48"' },
		{ label: 'Pants Length', small: '40"', medium: '41"', large: '40"' },
		{ label: 'Shorts Length', small: '16"', medium: '27"', large: '19"' }
	];

	const returnChecklist = [
		'Email Subject: Return and Exchange \u2013 Order Number',
		'Description of your product concerns',
		'Photo of the items',
		'Unboxing Video'
	];

	const returnConditions = [
		'The items delivered were wrong or had a notable factory damage;',
		'There is a video of unboxing of items (No video, No return and exchange). Unboxing video must show that items are being inspected for any factory damages or if you receive the wrong items;',
		'The items must be in the same condition that you received it \u2013 unwashed, unworn or unused, in their original packaging with hang tags and complete accessories;',
		'The items are accompanied with proof of purchase such as sales invoice, and/or acknowledgement receipt;',
		'Items purchased at a discount or during sale are not eligible for return and exchange.'
	];

	const exchangeSteps = [
		'You will receive a notification of approval, otherwise a separate email of disapproval will be sent.',
		'A Customer Credit Voucher will be issued which can be used in checking out the new ordered items.',
		'Should the new ordered item has a higher value as the item/s being exchanged, the price difference must be paid. If the voucher is not fully utilized, excess amounts are waived.',
		'Shipping fees to return and exchange are shouldered by customer.'
	];

	const faqs = [
		{
			question: 'Do you offer same day delivery?',
			answer:
				'Due to limited logistic options available in our factory site, we are not yet offering same day delivery. But, we will be working on it to serve you better.'
		},
		{
			question: 'Do you have physical store?',
			answer:
				'As of the moment, we are purely operating online. With your continued support, soon, we will open our own physical store.'
		},
		{
			question: 'Do you ship internationally?',
			answer:
				'Soon. We will update you once we are ready to ship internationally.'
		}
	];

	let paused = false;

	function navigateTo(e: MouseEvent, id: string) {
		e.preventDefault();
		activeSection = id;
		paused = true;
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
		setTimeout(() => (paused = false), 1000);
	}

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (paused) return;
				for (const entry of entries) {
					if (entry.isIntersecting) {
						activeSection = entry.target.id;
					}
				}
			},
			{ rootMargin: '-20% 0px -60% 0px' }
		);

		for (const section of sections) {
			const el = document.getElementById(section.id);
			if (el) observer.observe(el);
		}

		function onScroll() {
			if (paused) return;
			const atBottom =
				window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
			if (atBottom) {
				activeSection = 'faq';
			}
		}

		window.addEventListener('scroll', onScroll, { passive: true });

		return () => {
			observer.disconnect();
			window.removeEventListener('scroll', onScroll);
		};
	});
</script>

<svelte:head>
	<title>{PUBLIC_APP_TITLE} | Customer Care</title>
</svelte:head>

<div class="flex justify-center px-6 sm:px-10 lg:px-16 py-10">
	<div class="flex items-start gap-16 w-full xl:max-w-7xl">
		<!-- Sidebar nav (lg+) -->
		<nav class="hidden lg:block lg:top-20 lg:sticky w-44 shrink-0">
			<ul class="flex flex-col gap-1">
				{#each sections as section (section.id)}
					<li>
						<a
							href="#{section.id}"
							onclick={(e: MouseEvent) => navigateTo(e, section.id)}
							class={cn(
								'block py-1.5 pl-3 border-l-2 text-sm transition-colors',
								activeSection === section.id
									? 'border-primary font-medium text-primary'
									: 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
							)}
						>
							{section.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<!-- Main content -->
		<div class="flex flex-col flex-1 min-w-0">
			<!-- Mobile nav -->
			<nav class="lg:hidden mb-8">
				<ul class="flex gap-2 overflow-x-auto no-scrollbar">
					{#each sections as section (section.id)}
						<li>
							<a
								href="#{section.id}"
								onclick={(e: MouseEvent) => navigateTo(e, section.id)}
								class={cn(
									'block px-3 py-1 border rounded-full text-sm whitespace-nowrap transition-colors',
									activeSection === section.id
										? 'border-primary bg-primary text-primary-foreground'
										: 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
								)}
							>
								{section.label}
							</a>
						</li>
					{/each}
				</ul>
			</nav>

			<div class="flex flex-col gap-20">
				<!-- Shipping -->
				<section id="shipping" class="flex flex-col gap-4 scroll-mt-20">
					<h1 class="font-semibold text-2xl sm:text-3xl">Shipping</h1>
					<div class="space-y-4 text-muted-foreground">
						<p>
							For a limited time only, we offer <strong class="text-foreground"
								>FREE shipping nationwide</strong
							>, NO MINIMUM amount of purchase required!
						</p>
						<p>
							Orders are shipped within two (2) days after we received your payment.
						</p>
						<p>
							Upon shipment and as per our partner courier, you will receive your order:
						</p>
						<ul class="space-y-1">
							<li class="flex items-start gap-1">
								<Dot class="h-6 w-6 shrink-0" />
								<span
									>1-3 days for Metro Manila, Region 3 (except for Aurora province) and Region
									4A (except for Quezon province)</span
								>
							</li>
							<li class="flex items-start gap-1">
								<Dot class="h-6 w-6 shrink-0" />
								<span>4-5 days for other provinces in Luzon</span>
							</li>
							<li class="flex items-start gap-1">
								<Dot class="h-6 w-6 shrink-0" />
								<span>5-7 days for Visayas region</span>
							</li>
							<li class="flex items-start gap-1">
								<Dot class="h-6 w-6 shrink-0" />
								<span>7-12 days for Mindanao region</span>
							</li>
						</ul>
						<p>
							Please take note that any delay on the deliveries are beyond our control since
							shipments are already being handled by a third party.
						</p>
						<p>A tracking number will be sent to you to track your package.</p>
					</div>
				</section>

				<!-- Care Guide -->
				<section id="care-guide" class="flex flex-col gap-4 scroll-mt-20">
					<h1 class="font-semibold text-2xl sm:text-3xl">Care Guide</h1>
					<div class="space-y-6 text-muted-foreground">
						<h3 class="font-medium text-foreground text-xl">
							Washing and Care Instruction
						</h3>
						<div class="grid grid-cols-[min-content_auto] items-start gap-x-2 gap-y-2">
							{#each washingInstructions as instruction, i (instruction)}
								<span class="font-semibold text-foreground whitespace-nowrap"
									>({i + 1})</span
								>
								<span>{instruction}</span>
							{/each}
						</div>
						<div
							class="flex flex-wrap justify-center gap-8 pt-4"
						>
							{#each careIcons as icon (icon.alt)}
								<div class="flex flex-col items-center gap-2 w-28">
									<img src={icon.src} alt={icon.alt} class="h-16 w-16" />
									<p class="text-center text-xs">{icon.alt}</p>
								</div>
							{/each}
						</div>
					</div>
				</section>

				<!-- Size Guide -->
				<section id="size-guide" class="flex flex-col gap-6 scroll-mt-20">
					<h1 class="font-semibold text-2xl sm:text-3xl">Size Guide</h1>

					<!-- Beddings Sizes -->
					<div class="flex flex-col gap-4">
						<h3 class="font-medium text-foreground text-xl">Beddings Sizes</h3>
						<div class="overflow-x-auto rounded-lg border">
							<table class="size-table w-full">
								<thead class="bg-accent">
									<tr>
										<th></th>
										<th>Pillowcase</th>
										<th>Fitted Sheet</th>
										<th>Flat Sheet</th>
									</tr>
								</thead>
								<tbody>
									{#each beddingSizes as row (row.size)}
										<tr>
											<td class="row-label">{row.size}</td>
											<td>{row.pillowcase}</td>
											<td>{row.fittedSheet}</td>
											<td>{row.flatSheet}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>

					<!-- Loungewear Sizes -->
					<div class="flex flex-col gap-4">
						<h3 class="font-medium text-foreground text-xl">Loungewear Sizes</h3>
						<div class="overflow-x-auto rounded-lg border">
							<table class="size-table w-full">
								<thead class="bg-accent">
									<tr>
										<th></th>
										<th>Small</th>
										<th>Medium</th>
										<th>Large</th>
									</tr>
								</thead>
								<tbody>
									{#each loungewearSizes as row (row.label)}
										<tr>
											<td class="row-label">{row.label}</td>
											<td>{row.small}</td>
											<td>{row.medium}</td>
											<td>{row.large}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				</section>

				<!-- Return & Exchange Policy -->
				<section id="return-and-exchange" class="flex flex-col gap-4 scroll-mt-20">
					<h1 class="font-semibold text-2xl sm:text-3xl">Return & Exchange Policy</h1>
					<div class="space-y-4 text-muted-foreground">
						<p>
							As part of our core value's "Commitment to Quality", we do extensive quality
							assurance inspection before packing and shipping your orders. However, if you
							have concerns with your order, we will attend to them as soon as possible. Just
							send us an email at <strong class="text-foreground"
								>hello@deianddave.com</strong
							> with the following details:
						</p>
						<div class="grid grid-cols-[min-content_auto] items-center gap-x-2 gap-y-2 ml-4">
							{#each returnChecklist as item (item)}
								<Check class="w-4 h-4 text-muted-foreground" />
								<span>{item}</span>
							{/each}
						</div>
						<p>
							Please note that we do not provide refunds but only allow exchange of item with
							the same or higher value as the item/s being exchanged.
						</p>
						<p>
							Items bought may be returned and exchanged within seven (7) days from the date
							of purchase, provided that:
						</p>
						<div class="grid grid-cols-[min-content_auto] items-start gap-x-2 gap-y-2">
							{#each returnConditions as condition, i (condition)}
								<span class="font-semibold text-foreground whitespace-nowrap"
									>({i + 1})</span
								>
								<span>{condition}</span>
							{/each}
						</div>
						<p>If your orders are eligible for a return and exchange:</p>
						<div class="grid grid-cols-[min-content_auto] items-start gap-x-2 gap-y-2">
							{#each exchangeSteps as step, i (step)}
								<span class="font-semibold text-foreground whitespace-nowrap"
									>({i + 1})</span
								>
								<span>{step}</span>
							{/each}
						</div>
					</div>
				</section>

				<!-- FAQ -->
				<section id="faq" class="flex flex-col gap-4 scroll-mt-20">
					<h1 class="font-semibold text-2xl sm:text-3xl">FAQ</h1>
					<div class="flex flex-col gap-8">
						{#each faqs as faq (faq.question)}
							<div class="flex flex-col gap-2">
								<p class="text-lg font-medium">Q: {faq.question}</p>
								<p class="text-muted-foreground">A: {faq.answer}</p>
							</div>
						{/each}
					</div>
				</section>
			</div>
		</div>
	</div>
</div>

<style>
	.size-table th {
		border-bottom-width: 1px;
		padding: 1rem;
		font-size: 0.875rem;
		line-height: 1.25rem;
		font-weight: 500;
		text-align: center;
	}

	.size-table th:not(:last-child),
	.size-table td:not(:last-child) {
		border-right-width: 1px;
	}

	.size-table td {
		padding: 1rem;
		font-size: 0.875rem;
		line-height: 1.25rem;
		text-align: center;
	}

	.size-table .row-label {
		font-weight: 600;
		color: var(--color-muted-foreground);
		text-align: left;
	}

	.size-table tbody tr:not(:last-child) td {
		border-bottom-width: 1px;
	}
</style>
