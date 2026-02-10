<script lang="ts">
	import { cn } from '$lib/utils';
	import { Check } from '@lucide/svelte';
	import { onMount } from 'svelte';

	const sections = [
		{ id: 'our-story', label: 'Our Story' },
		{ id: 'our-company', label: 'Our Company' },
		{ id: 'our-products', label: 'Our Products' },
		{ id: 'our-core-values', label: 'Our Core Values' }
	] as const;

	let activeSection: string = $state(sections[0].id);

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

		return () => observer.disconnect();
	});
</script>

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
				<!-- Our Story -->
				<section id="our-story" class="flex flex-col gap-4 scroll-mt-20">
					<h1 class="font-semibold text-2xl sm:text-3xl">Our Story</h1>
					<div class="space-y-4 text-muted-foreground">
						<p>
							<strong class="text-foreground">Dei & Dave</strong> was founded by a millennial couple whose
							way of living and perspective in life changed after the pandemic hit. Before, they tend
							to just hop on the bed right after going home from a long day of work.
						</p>
						<p>
							But, when the pandemic hit, <br />
							when our everyday routine went on temporary pause, <br />
							when our daily itinerary revolves around the four corners of our home,<br />
							when work from home became a thing in this "new normal", <br />
							it is only the moment they realized that one should invest in high-quality household items,
							starting off with a set of high-quality bedding sheets, because they believe that great
							living starts off with a great sleep.
						</p>
						<p>
							Apart from the aftermath of the pandemic, the rapid change in our climate and the call
							of the environment advocates to embrace the practice of sustainability, the founders
							thought of creating a product that integrates comfort and luxury with sustainability.
						</p>
						<p>
							These reasons gave birth to <strong class="text-foreground">Dei & Dave</strong>, a
							company which aims to offer bedroom essentials where customers can experience ultimate
							comfort and snuggly sleep while being an eco-conscious at the same time.
						</p>
					</div>
				</section>

				<!-- Our Company -->
				<section id="our-company" class="flex flex-col gap-4 scroll-mt-20">
					<h1 class="font-semibold text-2xl sm:text-3xl">Our Company</h1>
					<div class="space-y-4 text-muted-foreground">
						<p>
							<strong class="text-foreground">Dei & Dave</strong> is a company that is dedicated in the
							production of sustainable and eco-friendly bedding products, sleepwear products and other
							bedroom essentials.
						</p>
						<p>
							As we are committed to be a company that employs eco-friendly practices, we extend
							this commitment in also choosing eco-friendly packaging materials.
						</p>
						<p>
							We prioritize giving our customers with natural comfort by offering products where
							they can indulge in luxurious and comfortable sleep that meets sustainability and
							gives conscious living.
						</p>
						<p>
							We operate in our brand values and committed to provide products to our customers that
							follows our branding of:
						</p>
						<div class="flex flex-col md:justify-center gap-4 w-full">
							<div class="flex flex-col md:justify-center md:text-center">
								<p class="font-semibold text-foreground text-lg">#BecauseYourChoiceMatters</p>
								<p>your choice to:</p>
							</div>
							<div class="flex flex-wrap md:justify-center gap-8 transition-all duration-300">
								<div class="space-y-2">
									<p class="font-semibold text-foreground md:text-center">
										Use skin-friendly products
									</p>
									<div class="items-center grid grid-cols-[30px_auto] ml-4 w-full">
										<Check class="w-4 h-4 text-muted-foreground" />
										<p>Gentle on skin</p>
										<Check class="w-4 h-4 text-muted-foreground" />
										<p>Naturally antibacterial</p>
										<Check class="w-4 h-4 text-muted-foreground" />
										<p>Hypoallergenic</p>
									</div>
								</div>
								<div class="space-y-2">
									<p class="font-semibold text-foreground md:text-center">Have a snuggly sleep</p>
									<div class="items-center grid grid-cols-[30px_auto] ml-4 w-full">
										<Check class="w-4 h-4 text-muted-foreground" />
										<p>Soft and smooth to touch</p>
										<Check class="w-4 h-4 text-muted-foreground" />
										<p>Cool and breathable</p>
										<Check class="w-4 h-4 text-muted-foreground" />
										<p>Thermoregulating</p>
									</div>
								</div>
								<div class="space-y-2">
									<p class="font-semibold text-foreground md:text-center">
										Use eco-friendly products
									</p>
									<div class="items-center grid grid-cols-[30px_auto] ml-4 w-full">
										<Check class="w-4 h-4 text-muted-foreground" />
										<p>Derived from plants</p>
										<Check class="w-4 h-4 text-muted-foreground" />
										<p>Sustainable</p>
										<Check class="w-4 h-4 text-muted-foreground" />
										<p>Biodegradable</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<!-- Our Products -->
				<section id="our-products" class="flex flex-col gap-4 scroll-mt-20">
					<h1 class="font-semibold text-2xl sm:text-3xl">Our Products</h1>
					<div class="space-y-4 text-muted-foreground">
						<p>
							Our bedding and sleepwear products are manufactured in a small family-owned factory
							located in Central Luzon, Philippines. These are locally handcrafted by our Filipino
							craftworkers, making our products 100% Philippine made. With your every purchase of
							our products, you are helping our local craftworkers to have a sustainable living.
						</p>
						<p>
							Our bedding and sleepwear products are derived from plants, sourced sustainably and
							made from biodegradable raw materials.
						</p>
						<p>
							Our bedding sets are made from 100% TENCEL™ Lyocell fibers, while our sleepwear sets
							are made from 100% Organic Bamboo Lyocell fibers.
						</p>
					</div>
					<div class="flex flex-col gap-4 text-muted-foreground">
						<h3 class="font-medium text-foreground text-xl">TENCEL™ Lyocell</h3>
						<p>
							TENCEL™ Lyocell fibers originate from the renewable raw material wood. These are wood
							that are extracted from controlled and certified forests using a unique closed loop
							system which recovers and reuses the solvents used, minimizing the environmental
							impact of production.
						</p>
						<p>
							These are certified biobased fibers that are manufactured using an environmentally
							responsible production process. The fibers are certified as compostable and
							biodegradable, and thus can fully revert back to nature.
						</p>
						<p>
							Unique physical properties lead to their high tenacity profile, efficient moisture
							management and gentleness to skin.
							<a class="text-blue-500 text-sm hover:underline italic" href="https://www.tencel.com"
								>(source: https://www.tencel.com)</a
							>
						</p>
					</div>
				</section>

				<!-- Our Core Values -->
				<section id="our-core-values" class="flex flex-col gap-4 scroll-mt-20">
					<h1 class="font-semibold text-2xl sm:text-3xl">Our Core Values</h1>
					<p class="text-muted-foreground">
						At <strong class="text-foreground">Dei & Dave</strong>, we value commitment.
					</p>
					<div class="flex flex-col gap-6 text-muted-foreground">
						<h4 class="font-medium text-foreground text-xl">Commitment to Quality</h4>
						<p>
							The creation of our bedding and sleepwear products involves an intricate process of
							selecting the right fabrics up to ensuring the precision of stitches.
						</p>
						<p>
							We believe that the foundation of any high quality bedding and sleepwear products lies
							in the materials used. To ensure the quality of the fabrics we are using, we carefully
							sourced from fabric manufacturers who has certifications such as Oeko-Tex and SGS.
							Such certifications in the textile industry serve as a mark of assurance that products
							meet specific quality and safety criteria and that production processes adhere to
							strict standards.
						</p>
						<h4 class="font-medium text-foreground text-xl">Commitment to Sustainability</h4>
						<p>
							Our advocacy to employ sustainable practices starts with our proactive approaches. We
							take initiative in careful selection of our bedding materials and extend it to the
							packaging materials we use. As much as possible, they must be derived from plants, has
							a biodegradable component, and produced through a process that doesn't create harmful
							by-products.
						</p>
						<h4 class="font-medium text-foreground text-xl">Commitment to People Empowerment</h4>
						<p>
							We nurture a culture that empowers our people through fostering open communication,
							recognizing their individual contributions and promoting work-life balance.
						</p>
						<h4 class="font-medium text-foreground text-xl">Commitment to Community</h4>
						<p>
							To express our heartfelt gratitude to customers who support our brand, we allot a
							portion of our profit to fund our charity works. For every purchase you made, you are
							also helping communities in need.
						</p>
					</div>
				</section>
			</div>
		</div>
	</div>
</div>
