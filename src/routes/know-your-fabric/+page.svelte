<script lang="ts">
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';

	import BotanicOrigin from './assets/botanic-origin.svg';
	import Biodegradable from './assets/biodegradable.svg';
	import EnhancedBreathability from './assets/enhanced-breathability.svg';
	import Drape from './assets/drape.svg';
	import GentleOnSkin from './assets/gentle-on-skin.svg';
	import MinimalStaticCharge from './assets/minimal-static-charge.svg';
	import ThermalRegulation from './assets/thermal-regulation.svg';
	import SustainableProduction from './assets/sustainable-production.svg';
	import Smoothness from './assets/smoothness.svg';
	import Strength from './assets/strength.svg';
	import UnfavorableForBacterialGrowth from './assets/unfavorable-for-bacterial-growth.svg';
	import Sheen from './assets/sheen.svg';
	import CertifiedSafe from './assets/certified-safe.svg';
	import ProduceInAustria from './assets/produce-in-austria.svg';

	const sections = [
		{ id: 'what-is-lyocell', label: 'What is Lyocell?' },
		{ id: 'bamboo-lyocell', label: 'Bamboo Lyocell' },
		{ id: 'tencel-lyocell', label: 'TENCEL\u2122 Lyocell' }
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

	const benefits = [
		{
			icon: BotanicOrigin,
			label: 'Botanic Origin',
			descriptions: [
				'TENCEL\u2122 Lyocell fibers are derived from sustainable wood sources, harvested from certified and controlled sources following the stringent guidelines of the Lenzing Wood and Pulp Policy.',
				'Moreover, wood and pulp used by the Lenzing Group comes from sustainably managed forests. TENCEL\u2122 Lyocell fibers have earned United States Department of Agriculture (USDA) BioPreferred\u00AE designation.'
			]
		},
		{
			icon: Biodegradable,
			label: 'Biodegradable',
			descriptions: [
				'All TENCEL\u2122 standard Lyocell fiber types have been certified as biodegradable and compostable under industrial, home, soil, fresh water and marine conditions, thus they can fully revert back to nature.'
			]
		},
		{
			icon: EnhancedBreathability,
			label: 'Contributes to Breathability',
			descriptions: [
				'TENCEL\u2122 Lyocell fibers support body temperature regulating properties through their moisture management. Derived from natural material, the microscopic fibrils of lyocell cellulosic fibers are structured to regulate the absorption and release of moisture, contributing to fabric breathability that supports the body\u2019s natural thermal regulation. TENCEL\u2122 Lyocell cellulose fibers have a higher vapor uptake than cotton.'
			]
		},
		{
			icon: Drape,
			label: 'Drape',
			descriptions: [
				'Fabrics containing TENCEL\u2122 Lyocell fibers produce a smooth drape, creating a flattering appearance.'
			]
		},
		{
			icon: GentleOnSkin,
			label: 'Gentle on Skin',
			descriptions: [
				'TENCEL\u2122 Lyocell fibers are naturally soft to the touch and offer long-lasting comfort. When viewed under an electron microscope, TENCEL\u2122 Lyocell fibers exhibit a smooth surface area, giving fabrics a soft feel and ensuring comfort for sensitive skin.'
			]
		},
		{
			icon: MinimalStaticCharge,
			label: 'Minimal Static Charge',
			descriptions: [
				'The ability to absorb moisture makes TENCEL\u2122 Lyocell fibers tension-free with lower electrostatic charging. In comparison with synthetics, there is an absence of electrostatic charge under normal atmospheric conditions.'
			]
		},
		{
			icon: ThermalRegulation,
			label: 'Thermal Regulation',
			descriptions: [
				'TENCEL\u2122 Lyocell fibers support body temperature regulating properties through their moisture management. Derived from natural material, the microscopic fibrils of these cellulosic fibers are structured to regulate the absorption and release of moisture, contributing to fabric breathability that supports the body\u2019s natural thermal regulation.'
			]
		},
		{
			icon: SustainableProduction,
			label: 'Sustainable Production',
			descriptions: [
				'TENCEL\u2122 Lyocell fibers have gained a commendable reputation for their environmentally responsible, closed loop production process, which transforms wood pulp into cellulosic fibers with high resource efficiency and low ecological impact.',
				'This solvent-spinning process recycles process water and reuses the solvent at a recovery rate of more than 99%. This economically viable manufacturing process received the European Award for the Environment from the European Commission in the category \u201CThe Technology Award for Sustainable Development\u201D. TENCEL\u2122 Lyocell fibers have been certified as Bio-based by the U.S. Department of Agriculture (USDA).',
				'Moreover, all Lenzing fiber production sites operate according to a certified Environmental Management and Occupational Health and Safety system (ISO14001, ISO 45001).'
			]
		},
		{
			icon: Smoothness,
			label: 'Smoothness',
			descriptions: [
				'TENCEL\u2122 Lyocell fibers are naturally smooth to the touch. When viewed under an electron microscope, TENCEL\u2122 Lyocell fibers exhibit a sleek surface area, enabling fabrics to glide lightly over skin.'
			]
		},
		{
			icon: Strength,
			label: 'Strength',
			descriptions: [
				'TENCEL\u2122 Lyocell fibers are versatile and distinguished by their high tenacity profile among cellulose fibers.'
			]
		},
		{
			icon: UnfavorableForBacterialGrowth,
			label: 'Unfavorable for Bacterial Growth',
			descriptions: [
				'Through moisture management, TENCEL\u2122 Lyocell fibers absorb moisture efficiently, as measured by the Vapor Uptake test and Water Retention Value. In comparison to polyester and synthetics, and even to cotton, there is less available moisture formed on the surface of the fiber for bacteria to grow. Consequently, TENCEL\u2122 Lyocell fibers provide a less favorable environment for bacterial growth.',
				'Particularly on three of the odor-relevant bacteria types tested (Staphylococcus epidermidis, Pseudomonas aeruginosa, Escherichia coli), a significantly lower growth rate was observed on TENCEL\u2122 Lyocell compared to cotton and polyester under moderate humidity conditions.'
			]
		},
		{
			icon: Sheen,
			label: 'Sheen',
			descriptions: [
				'The efficient dye uptake of LENZING\u2122 Lyocell enables color dyes to penetrate deeply into the fiber structure, resulting in impressive color brilliance. Furthermore, when viewed under an electron microscope, LENZING\u2122 Lyocell fibers exhibit a smooth surface area, giving textiles a luxurious sheen.',
				'The combination of deeper dye uptake and smooth fiber surface makes the color of LENZING\u2122 Lyocell fibers appear brighter and perceptibly more intense than that of cotton fabrics.'
			]
		},
		{
			icon: CertifiedSafe,
			label: 'Certified Safe',
			descriptions: [
				'The STANDARD 100 by OEKO-TEX\u00AE certification confirms that TENCEL\u2122 Lyocell fibers have been tested for numerous regulated and non-regulated harmful substances and are therefore harmless for human health.'
			]
		},
		{
			icon: ProduceInAustria,
			label: 'Produced in Austria',
			descriptions: [
				'TENCEL\u2122 Lyocell fibers are produced at a specialized production site in Austria. They have been certified with the EU Ecolabel for textile products (license no. AT/016/001) as meeting high environmental standards throughout their life cycle: from raw material extraction to production, distribution and disposal.'
			]
		}
	];

	const bambooTypes = [
		{
			number: 1,
			title: 'Bamboo Viscose Fabric',
			paragraphs: [
				'Also known as \u201CBamboo Rayon\u201D, this type of bamboo fabric is the most commonly used. It is a semi-synthetic fiber derived from regenerated cellulose fibers.',
				'This type of bamboo fabric has the most affordable price, hence the reason why it is the most commonly used. Customers who opt to buy products made of this type of bamboo fabric get all the general beneficial properties of bamboo without paying a lot.',
				'However, there is an issue in its claim as an eco-friendly fabric since production of this type of bamboo fabric involves the use of toxic chemicals which are harmful both for the environment and production workers.'
			]
		},
		{
			number: 2,
			title: 'Fine Bamboo Fabric',
			paragraphs: [
				'Also known as \u201CBamboo Linen\u201D, this type of bamboo fabric is a combination of ordinary linen and bamboo fibers.',
				'This is the most expensive type of bamboo fabric and often tagged as the highest quality of all its types. Its production process does not involve cellulose extraction, does not use harmful chemicals, instead, it uses a natural enzyme.',
				'Though it is the most eco-friendly bamboo fabric, it has a coarse surface and texture, thus making it not suitable for products intended to be soft like sleepwear and other intimates.'
			]
		},
		{
			number: 3,
			title: 'Bamboo Lyocell Fabric',
			paragraphs: [
				'This type of bamboo fabric is considered as a highly sustainable fabric as it is made with natural cellulose fibers. Its production process involves a \u201Cclosed-loop\u201D method, where manufacturers can reuse the non-toxic solvents used to breakdown the bamboo pulp.',
				'Through this closed-loop production method, it does not chemically alter the structure of the cellulose fiber, resulting to a chemical-free textile and making this type of bamboo fabric naturally organic. It also lets the bamboo plant retain its unique properties resulting to a very soft and light fabric.',
				'Due to their soft and lightweight properties, bamboo lyocell fabric is very comfortable to wear, thus, making it a perfect fabric for sleepwear.'
			]
		}
	];

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
				<!-- What is Lyocell? -->
				<section id="what-is-lyocell" class="flex flex-col gap-4 scroll-mt-20">
					<h1 class="font-semibold text-2xl sm:text-3xl">What is Lyocell?</h1>
					<div class="space-y-4 text-muted-foreground">
						<p>
							Lyocell is a semi-synthetic fabric that is primarily composed of cellulose which is
							derived from wood. It is commonly used as a substitute for cotton or silk.
						</p>
						<p>
							Lyocell production doesn't create harmful by-products since it employs a
							&ldquo;closed loop&rdquo; extraction process, wherein the dissolvent chemicals involved
							in its production are not toxic and can be reused multiple times.
						</p>
					</div>
				</section>

				<!-- Bamboo Lyocell -->
				<section id="bamboo-lyocell" class="flex flex-col gap-4 scroll-mt-20">
					<h1 class="font-semibold text-2xl sm:text-3xl">Bamboo Lyocell</h1>
					<div class="space-y-4 text-muted-foreground">
						<p>
							Nowadays, the use of bamboo fabric is prevalent in the textile industry due to its
							claimed benefits, unique properties and versatility. But, did you know that there are
							different types of bamboo fabric and not all of them are produced the same way? Some
							types of bamboo fabric are produced ethically and truly eco-friendly while others are
							harmful to environment. To ensure that you are choosing the right type of bamboo
							fabric, it's important to know more about its different types.
						</p>
					</div>

					<h3 class="font-medium text-foreground text-xl mt-4">
						Different types of Bamboo Fabric
					</h3>

					<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{#each bambooTypes as bamboo (bamboo.number)}
							<div class="flex flex-col gap-3 rounded-lg border p-5">
								<div class="flex items-center gap-3">
									<span
										class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold"
									>
										{bamboo.number}
									</span>
									<h4 class="font-medium text-foreground">{bamboo.title}</h4>
								</div>
								<div class="space-y-3 text-sm text-muted-foreground">
									{#each bamboo.paragraphs as paragraph, idx (idx)}
										<p>{paragraph}</p>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				</section>

				<!-- TENCEL Lyocell -->
				<section id="tencel-lyocell" class="flex flex-col gap-4 scroll-mt-20">
					<h1 class="font-semibold text-2xl sm:text-3xl">TENCEL&#8482; Lyocell</h1>
					<div class="space-y-4 text-muted-foreground">
						<h3 class="font-medium text-foreground text-xl">What is TENCEL&#8482;?</h3>
						<p>
							TENCEL&#8482; is a registered trademark of Lenzing AG, a company based in Austria
							known for their advocacy of ecologically responsible production of specialty fibers
							made from wood as a renewable raw material. TENCEL&#8482; cellulosic fibers derived
							from European wood sources liberate movement with an exquisitely soft, flexible fit.
						</p>
						<p>
							The fiber composition on our fabric has the following key benefits:
						</p>
					</div>

					<!-- Benefits grid -->
					<div class="rounded-lg border divide-y">
						{#each benefits as benefit, i (benefit.label)}
							<div class="flex flex-col sm:flex-row gap-4 sm:gap-6 p-5">
								<div class="flex items-start gap-3 sm:w-56 shrink-0">
									<img
										src={benefit.icon}
										alt={benefit.label}
										class="h-10 w-10 shrink-0"
									/>
									<span class="text-sm font-medium text-primary">
										{benefit.label}
									</span>
								</div>
								<div class="space-y-3 text-sm text-muted-foreground">
									{#each benefit.descriptions as desc, idx (idx)}
										<p>{desc}</p>
									{/each}
								</div>
							</div>
						{/each}
					</div>

					<div class="space-y-4 text-muted-foreground mt-4">
						<p class="text-sm italic">
							TENCEL&#8482; is a trademark of Lenzing AG.
						</p>
						<p>
							To learn more about TENCEL&#8482; and their advocacy in sustainable practices, visit
							their website at:
							<a
								class="text-blue-500 text-sm hover:underline"
								href="https://www.tencel.com"
								target="_blank"
								rel="noopener noreferrer"
							>
								https://www.tencel.com
							</a>
						</p>
					</div>
				</section>
			</div>
		</div>
	</div>
</div>
