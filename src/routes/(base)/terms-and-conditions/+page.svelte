<script lang="ts">
	import { page } from '$app/state';
	import { PUBLIC_APP_TITLE } from '$env/static/public';
</script>

<svelte:head>
	<title>{PUBLIC_APP_TITLE} | Terms & Conditions</title>
</svelte:head>

<div class="flex justify-stretch xl:justify-center">
	<div class="space-8 m-8 flex w-full flex-col gap-8 xl:max-w-[1280px] xl:self-center">
		<h1 class="text-2xl transition-all duration-300 sm:text-3xl">Terms & Conditions</h1>
		<p>
			These Terms of Use (Terms) govern your use of our website located at
			<a class="hover:underline" href="/" aria-label="Go to home page">
				{page.url.host}
			</a>
			and form a binding contractual agreement between you, the user of the Site and us,
			<strong>DEI & DAVE</strong> the owner.
		</p>
		<p>
			For that reason these Terms are important and you should ensure that you read them carefully
			and contact us with any questions before you use the Site. You can contact us at
			<a class="hover:underline" href="mailto:hello@deianddave.com">hello@deianddave.com</a>
		</p>
		<p>
			By using the Site you acknowledge and agree that you have had sufficient chance to read and
			understand the Terms and you agree to be bound by them. If you do not agree to the Terms,
			please do not use the Site.
		</p>
		<h2 class="text-xl font-bold">License to Use the Site</h2>
		<p>
			We grant you a non-exclusive, worldwide, non-transferable license to use the Site in
			accordance with these Terms.&nbsp;You may access and use the Site (including any incidental
			copying that occurs as part of that use) in the normal manner and may also print one copy of
			any page within the Site for your own personal, non-commercial use.
		</p>
		<p id="paragraph-b">
			You must not add any content to the Site: unless you hold all necessary rights, licenses and
			consents to do so; that would cause you or us to breach any law, regulation, rule, code or
			other legal obligation; that is or could reasonably be considered to be obscene, inappropriate,
			defamatory, disparaging, indecent, seditious, offensive, pornographic, threatening, abusive,
			liable to incite racial hatred, discriminatory, blasphemous, in breach of confidence or in
			breach of privacy; that would bring us, or the Site, into disrepute; or that infringes the
			intellectual property or other rights of any person. The Site contains links to other websites
			as well as content added by people other than us. We do not endorse, sponsor or approve any
			such user generated content or any content available on any linked website.
		</p>
		<p id="paragraph-c">
			You acknowledge and agree that: we retain complete editorial control over the Site and may
			alter, amend or cease the operation of the Site at any time in our sole discretion; and the
			Site will not operate on a continuous basis, and may be unavailable from time to time (including
			for maintenance purposes).
		</p>
		<h2 class="text-xl font-bold">Errors, Inaccuracies and Omissions</h2>
		<p>
			Occasionally there may be information on our site or in the Service that contains typographical
			errors, inaccuracies or omissions that may relate to product descriptions, pricing,
			promotions, offers, product shipping charges, transit times and availability. We reserve the
			right to correct any errors, inaccuracies or omissions, and to change or update information or
			cancel orders if any information in the Service or on any related website is inaccurate at any
			time without prior notice (including after you have submitted your order).
		</p>
		<p>
			We undertake no obligation to update, amend or clarify information in the Service or on any
			related website, including without limitation, pricing information, except as required by law.
			No specified update or refresh date applied in the Service or on any related website, should be
			taken to indicate that all information in the Service or on any related website has been
			modified or updated.
		</p>
		<h2 class="text-xl font-bold">Intellectual Property Rights</h2>
		<p>
			Nothing in these Terms constitutes a transfer of any intellectual property rights. You
			acknowledge and agree that, as between you and us, we own all intellectual property rights in
			the Site. By posting or adding any content onto the Site, you grant us a perpetual,
			non-exclusive, royalty-free, irrevocable, worldwide and transferable right and license to use
			that content in any way (including, without limitation, by reproducing, changing, and
			communicating the content to the public) and permit us to authorize any other person to do the
			same thing. You consent to any act or omission which would otherwise constitute an infringement
			of your moral rights, and if you add any content in which any third party has moral rights, you
			must also ensure that the third party also consents in the same manner. The license in
			paragraph <a class="hover:underline" href="#paragraph-c"> (c) </a>will survive any termination
			of these Terms. You represent and warrant to us that you have all necessary rights to grant the
			licenses and consents set out in paragraphs
			<a class="hover:underline" href="#paragraph-b"> (b) </a>
			and
			<a class="hover:underline" href="#paragraph-c"> (c) </a>.
		</p>
		<h2 class="text-xl font-bold">Prohibited Uses</h2>
		<p>
			In addition to other prohibitions as set forth in the Terms of Service, you are prohibited from
			using the site or its content:
		</p>
		<div class="grid w-full grid-cols-[30px_auto]">
			<p>(a)</p>
			<p>for any unlawful purpose;</p>
			<p>(b)</p>
			<p>to solicit others to perform or participate in any unlawful acts;</p>
			<p>(c)</p>
			<p>
				to violate any international, federal, provincial or state regulations, rules, laws, or local
				ordinances;
			</p>
			<p>(d)</p>
			<p>
				to infringe upon or violate our intellectual property rights or the intellectual property
				rights of others;
			</p>
			<p>(e)</p>
			<p>
				to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate
				based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or
				disability;
			</p>
			<p>(f)</p>
			<p>to submit false or misleading information;</p>
			<p>(g)</p>
			<p>
				to upload or transmit viruses or any other type of malicious code that will or may be used in
				any way that will affect the functionality or operation of the Service or of any related
				website, other websites, or the Internet;
			</p>
			<p>(h)</p>
			<p>to collect or track the personal information of others;</p>
			<p>(i)</p>
			<p>to spam, phish, pharm, pretext, spider, crawl, or scrape;</p>
			<p>(j)</p>
			<p>for any obscene or immoral purpose; or</p>
			<p>(k)</p>
			<p>
				to interfere with or circumvent the security features of the Service or any related website,
				other websites, or the Internet.
			</p>
		</div>
		<p>
			We reserve the right to terminate your use of the Service or any related website for violating
			any of the prohibited uses.
		</p>
		<h2 class="text-xl font-bold">Disclaimer of Warranties; Limitation of Liability</h2>
		<p>
			We do not guarantee, represent or warrant that your use of our service will be uninterrupted,
			timely, secure or error-free.
		</p>
		<p>
			We do not warrant that the results that may be obtained from the use of the service will be
			accurate or reliable.
		</p>
		<p>
			You agree that from time to time we may remove the service for indefinite periods of time or
			cancel the service at any time, without notice to you.
		</p>
		<p>
			You expressly agree that your use of, or inability to use, the service is at your sole risk.
			The service and all products and services delivered to you through the service are (except as
			expressly stated by us) provided 'as is' and 'as available' for your use, without any
			representation, warranties or conditions of any kind, either express or implied, including all
			implied warranties or conditions of merchantability, merchantable quality, fitness for a
			particular purpose, durability, title, and non-infringement.
		</p>
		<p>
			In no case shall <strong>DEI & DAVE</strong>, our directors, officers, employees, affiliates,
			agents, contractors, interns, packers, manufacturers, suppliers, service providers or licensors
			be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special,
			or consequential damages of any kind, including, without limitation lost profits, lost revenue,
			lost savings, loss of data, replacement costs, or any similar damages, whether based in
			contract, tort (including negligence), strict liability or otherwise, arising from your use of
			any of the service or any products procured using this website or this service, or for any
			other claim related in any way to your use of the service or any product, including, but not
			limited to, any errors or omissions in any content, or any loss or damage of any kind incurred
			as a result of the use of the service or any content (or product) posted, transmitted, or
			otherwise made available via the service, even if advised of their possibility. Because some
			states or jurisdictions do not allow the exclusion or the limitation of liability for
			consequential or incidental damages, in such states or jurisdictions, our liability shall be
			limited to the maximum extent permitted by law.
		</p>
		<h2 class="text-xl font-bold">Indemnification</h2>
		<p>
			You agree to indemnify, defend and hold harmless <strong>DEI & DAVE</strong>, subsidiaries,
			affiliates, partners, officers, directors, agents, contractors, licensors, service providers,
			subcontractors, manufacturers, packers, suppliers, interns and employees, harmless from any
			claim or demand, including reasonable attorneys' fees, made by any third-party due to or
			arising out of your breach of these Terms of Service or the documents they incorporate by
			reference, or your violation of any law or the rights of a third-party.
		</p>
		<h2 class="text-xl font-bold">Severability</h2>
		<p>
			In the event that any provision of these Terms & Conditions is determined to be unlawful, void
			or unenforceable, such provision shall nonetheless be enforceable to the fullest extent
			permitted by applicable law, and the unenforceable portion shall be deemed to be severed from
			these Terms of Service, such determination shall not affect the validity and enforceability of
			any other remaining provisions.
		</p>
		<h2 class="text-xl font-bold">Termination</h2>
		<p>
			The obligations and liabilities of the parties incurred prior to the termination date shall
			survive the termination of this agreement for all purposes.
		</p>
		<p>
			These Terms of Service are effective unless and until terminated by either you or us. You may
			terminate these Terms of Service at any time by notifying us that you no longer wish to use our
			Services, or when you cease using our site.
		</p>
		<p>
			If in our sole judgment you fail, or we suspect that you have failed, to comply with any term
			or provision of these Terms of Service, we also may terminate this agreement at any time
			without notice and you will remain liable for all amounts due up to and including the date of
			termination; and/or accordingly may deny you access to our Services (or any part thereof).
		</p>
		<h2 class="text-xl font-bold">Entire Agreement</h2>
		<p>
			The failure of us to exercise or enforce any right or provision of these Terms of Service shall
			not constitute a waiver of such right or provision.
		</p>
		<p>
			These Terms of Service and any policies or operating rules posted by us on this site or in
			respect to The Service constitutes the entire agreement and understanding between you and us
			and govern your use of the Service, superseding any prior or contemporaneous agreements,
			communications and proposals, whether oral or written, between you and us (including, but not
			limited to, any prior versions of the Terms of Service).
		</p>
		<p>
			Any ambiguities in the interpretation of these Terms of Service shall not be construed against
			the drafting party.
		</p>
		<h2 class="text-xl font-bold">Governing Law</h2>
		<p>
			These Terms of Service and any separate agreements whereby we provide you Services shall be
			governed by and construed in accordance with the laws of the Philippines
		</p>
		<h2 class="text-xl font-bold">Changes to Terms of Service</h2>
		<p>You can review the most current version of the Terms of Service at any time on this page.</p>
		<h2 class="text-xl font-bold">General</h2>
		<p>
			You must not assign, sublicense or otherwise deal in any other way with any of your rights
			under these Terms. If a provision of these Terms is invalid or unenforceable, it is to be read
			down or severed to the extent necessary without affecting the validity or enforceability of the
			remaining provisions. Each party must at its own expense do everything reasonably necessary to
			give full effect to this Agreement and the events contemplated by it. These terms are governed
			by the laws of the Philippines and each party submits to the jurisdiction of the courts of the
			Philippines.
		</p>
		<h2 class="text-xl font-bold">Competition and Promotional Discount Codes</h2>
		<p>
			Single Use & Non-Transferability: Any discount codes or other promotional awards resulting from
			competitions, giveaways, or other marketing promotions ("Promotional Awards") are intended for
			the sole use of the individual recipient or winner, as identified by
			<strong>DEI & DAVE</strong>. These Promotional Awards are non-transferable and cannot be
			shared, distributed, or otherwise used by anyone other than the original recipient.
		</p>
		<p>
			Invalidation of Misused Awards: <strong>DEI & DAVE</strong> reserves the right to invalidate
			any Promotional Award and cancel any order or benefit derived from said Promotional Award if it
			is found to be used by someone other than the original recipient or in violation of our terms.
		</p>
		<p>
			Consequences of Misuse: Sharing or distributing Promotional Awards is considered a breach of
			these terms and conditions. In addition to order cancellation or invalidation of the award,
			individuals found to be in breach may be disqualified from participating in future promotions
			or competitions hosted by <strong>DEI & DAVE</strong>.
		</p>
		<p>
			Notification of Misuse: <strong>DEI & DAVE</strong> is under no obligation but may, at its
			discretion, notify individuals of any misuse or perceived breach of these terms. Such
			notifications are purely informational, and any action taken by
			<strong>DEI & DAVE</strong>
			in response to a breach remains at its sole discretion.
		</p>
	</div>
</div>
