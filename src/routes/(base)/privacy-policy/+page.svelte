<script lang="ts">
	import { PUBLIC_APP_TITLE } from '$env/static/public';
	import { Check } from '@lucide/svelte';
</script>

<svelte:head>
	<title>{PUBLIC_APP_TITLE} | Privacy Policy</title>
</svelte:head>

<div class="flex justify-stretch xl:justify-center">
	<div class="flex flex-col xl:self-center gap-8 m-8 w-full xl:max-w-7xl space-8">
		<h1 class="text-2xl sm:text-3xl transition-all duration-300">Privacy Policy</h1>
		<h2 class="font-bold text-xl">We respect your privacy</h2>
		<p>
			<strong>DEI & DAVE</strong> respects your right to privacy and this policy sets out how we collect
			and treat your personal information. "Personal information" is information we hold which is identifiable
			as being about you.
		</p>
		<h2 class="font-bold text-xl">What personal information we collect</h2>
		<div>
			<p class="mb-2">We may collect the following types of personal information from you:</p>
			<div class="items-center grid grid-cols-[30px_auto] w-full">
				<Check class="w-4 h-4" />
				<p>Name</p>
				<Check class="w-4 h-4" />
				<p>Email Address</p>
				<Check class="w-4 h-4" />
				<p>Postal / Delivery Address</p>
				<Check class="w-4 h-4" />
				<p>Phone Number</p>
				<Check class="w-4 h-4" />
				<p>Age</p>
				<Check class="w-4 h-4" />
				<p>Payment details</p>
			</div>
		</div>
		<h2 class="font-bold text-xl">How we collect your personal information</h2>
		<p>
			We collect personal information from you in a variety of ways, including: when you interact
			with us electronically or in person; when you access our website; and when we provide our
			services to you.
		</p>
		<h2 class="font-bold text-xl">Use of your personal information</h2>
		<p>
			We use your information to provide our service to you. We also use it to improve our service
			and to notify you of opportunities that we think you might be interested in. We do not provide
			your information to third parties, except that we may provide your information to our business
			partners who assist us in the provision of our services to you.
		</p>
		<h2 class="font-bold text-xl">Disclosure of your personal information</h2>
		<p>
			We are likely to disclose your personal information to recipients in the following countries:
			– Philippines
		</p>
		<h2 class="font-bold text-xl">Security of your personal information</h2>
		<p>
			We take reasonable steps to protect your personal information. However we are not liable for
			any unauthorized access to this information.
		</p>
		<h2 class="font-bold text-xl">Access to your personal information</h2>
		<p>
			You can access and update your personal information by contacting us on hello@deianddave.com.
			We may charge a reasonable administration fee for this access.
		</p>
		<h2 class="font-bold text-xl">Complaints about privacy</h2>
		<p>
			If you have any complaints about our privacy practices, please feel free to send in details of
			your complaints to
			<a class="hover:underline" href="mailto:hello@deianddave.com">hello@deianddave.com</a>. We
			take complaints very seriously and will respond shortly after receiving written notice of your
			complaint.
		</p>
		<h2 class="font-bold text-xl">Changes to Privacy Policy</h2>
		<p>
			Please be aware that we may change this Privacy Policy in the future. The revised versions
			will be uploaded onto our website, so please check back from time to time.
		</p>
		<h2 class="font-bold text-xl">Website</h2>
		<p>
			When you come on to our website we may collect certain information such as browser type,
			operating system, website visited immediately before coming to our site, etc. This information
			is used in an aggregated manner to analyze how people use our site, such that we can improve
			our service.
		</p>
		<h2 class="font-bold text-xl">Cookies</h2>
		<p>
			As is very common for companies, we use cookies on our website. Cookies are very small files
			which a website uses to identify you when you come back to the site and to store details about
			your use of the site. Cookies are not malicious programs that access or damage your computer.
			We use cookies to improve the experience of people using our website.
		</p>
		<h2 class="font-bold text-xl">Third Party Sites</h2>
		<p>
			Our site has links to other websites not owned or controlled by us. We are not responsible for
			these sites or the consequences of you going on to those sites.
		</p>

		<p class="text-sm">Last updated: January 01, 2026</p>
	</div>
</div>
