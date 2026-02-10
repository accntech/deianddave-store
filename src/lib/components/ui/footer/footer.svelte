<script lang="ts">
	import Logo from '$lib/assets/logo.png';
	import { MailIcon } from '@lucide/svelte';
</script>

<footer class="bg-primary text-primary-foreground">
	<div class="mx-auto px-6 lg:px-8 py-12 w-full max-w-7xl">
		<div class="gap-10 grid sm:grid-cols-2 lg:grid-cols-4">
			<div class="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
				<a href="/">
					<img src={Logo} alt="Dei & Dave" class="brightness-0 invert h-8" />
				</a>
				<p class="max-w-xs text-primary-foreground/70 text-sm leading-relaxed">
					Sustainably luxurious beddings & loungewear — because your choice matters.
				</p>
			</div>

			<div class="flex flex-col gap-3">
				<span class="font-semibold text-primary-foreground/50 text-xs uppercase tracking-wider">
					Shop
				</span>
				<nav class="flex flex-col gap-2">
					<a href="/beddings" class="footer-link">Beddings</a>
					<a href="/loungewear" class="footer-link">Loungewear</a>
				</nav>
			</div>

			<div class="flex flex-col gap-3">
				<span class="font-semibold text-primary-foreground/50 text-xs uppercase tracking-wider">
					Company
				</span>
				<nav class="flex flex-col gap-2">
					<a href="/about-us" class="footer-link">About Us</a>
					<a href="/know-your-fabric" class="footer-link">Know Your Fabric</a>
					<a href="/customer-care" class="footer-link">Customer Care</a>
				</nav>
			</div>

			<div class="flex flex-col gap-3">
				<span class="font-semibold text-primary-foreground/50 text-xs uppercase tracking-wider">
					Legal
				</span>
				<nav class="flex flex-col gap-2">
					<a href="/terms-and-conditions" class="footer-link">Terms & Conditions</a>
					<a href="/privacy-policy" class="footer-link">Privacy Policy</a>
				</nav>
			</div>
		</div>

		<div class="mt-10 pt-8 border-primary-foreground/10 border-t">
			<div class="flex md:flex-row flex-col md:justify-between items-center gap-4">
				<p class="text-primary-foreground/50 text-xs">
					&copy; {new Date().getFullYear()} Dei & Dave. All rights reserved.
				</p>

				<a
					href="mailto:hello@deianddave.com"
					class="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors duration-200"
				>
					<MailIcon class="size-4" />
					hello@deianddave.com
				</a>

				<div class="flex items-center gap-1">
					<a
						href="https://www.facebook.com/people/Dei-and-Dave/61568834423596/"
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex justify-center items-center hover:bg-primary-foreground/10 rounded-full size-9 text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-200"
						aria-label="Facebook"
					>
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
						</svg>
					</a>
					<a
						href="https://www.instagram.com/deianddave"
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex justify-center items-center hover:bg-primary-foreground/10 rounded-full size-9 text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-200"
						aria-label="Instagram"
					>
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
							<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
							<line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
						</svg>
					</a>
					<a
						href="https://www.tiktok.com/@deianddave"
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex justify-center items-center hover:bg-primary-foreground/10 rounded-full size-9 text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-200"
						aria-label="TikTok"
					>
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="currentColor"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 10.86 4.46A6.3 6.3 0 0 0 15.82 15V8.36a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.21v.02Z"
							/>
						</svg>
					</a>
				</div>
			</div>
		</div>
	</div>
</footer>

<style>
	.footer-link {
		font-size: 0.875rem;
		line-height: 1.25rem;
		color: oklch(0.97 0.014 254.604 / 0.75);
		transition: color 0.2s;
	}

	.footer-link:hover {
		color: oklch(0.97 0.014 254.604);
	}
</style>
