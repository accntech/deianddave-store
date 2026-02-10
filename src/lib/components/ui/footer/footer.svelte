<script lang="ts">
	import Logo from '$lib/assets/logo.png';
	import { MailIcon } from '@lucide/svelte';
</script>

<footer class="bg-primary text-primary-foreground">
	<div class="mx-auto w-full max-w-7xl px-6 py-12 lg:px-8">
		<div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
			<div class="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
				<a href="/">
					<img src={Logo} alt="Dei & Dave" class="h-8 brightness-0 invert" />
				</a>
				<p class="max-w-xs text-sm leading-relaxed text-primary-foreground/70">
					Sustainably luxurious beddings & loungewear — because your choice matters.
				</p>
			</div>

			<div class="flex flex-col gap-3">
				<span class="text-xs font-semibold uppercase tracking-wider text-primary-foreground/50">
					Shop
				</span>
				<nav class="flex flex-col gap-2">
					<a href="/beddings" class="footer-link">Beddings</a>
					<a href="/loungewear" class="footer-link">Loungewear</a>
				</nav>
			</div>

			<div class="flex flex-col gap-3">
				<span class="text-xs font-semibold uppercase tracking-wider text-primary-foreground/50">
					Company
				</span>
				<nav class="flex flex-col gap-2">
					<a href="/about-us" class="footer-link">About Us</a>
					<a href="/know-your-fabric" class="footer-link">Know Your Fabric</a>
					<a href="/customer-care" class="footer-link">Customer Care</a>
				</nav>
			</div>

			<div class="flex flex-col gap-3">
				<span class="text-xs font-semibold uppercase tracking-wider text-primary-foreground/50">
					Legal
				</span>
				<nav class="flex flex-col gap-2">
					<a href="/terms-and-conditions" class="footer-link">Terms & Conditions</a>
					<a href="/privacy-policy" class="footer-link">Privacy Policy</a>
				</nav>
			</div>
		</div>

		<div class="mt-10 border-t border-primary-foreground/10 pt-8">
			<div class="flex flex-col items-center gap-4 md:flex-row md:justify-between">
				<p class="text-xs text-primary-foreground/50">
					&copy; {new Date().getFullYear()} Dei & Dave. All rights reserved.
				</p>

				<a
					href="mailto:hello@deianddave.com"
					class="flex items-center gap-2 text-sm text-primary-foreground/70 transition-colors duration-200 hover:text-primary-foreground"
				>
					<MailIcon class="size-4" />
					hello@deianddave.com
				</a>

				<div class="flex items-center gap-1">
					<a
						href="https://facebook.com"
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex size-9 items-center justify-center rounded-full text-primary-foreground/70 transition-colors duration-200 hover:bg-primary-foreground/10 hover:text-primary-foreground"
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
							<path
								d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
							/>
						</svg>
					</a>
					<a
						href="https://instagram.com"
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex size-9 items-center justify-center rounded-full text-primary-foreground/70 transition-colors duration-200 hover:bg-primary-foreground/10 hover:text-primary-foreground"
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
						href="https://tiktok.com"
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex size-9 items-center justify-center rounded-full text-primary-foreground/70 transition-colors duration-200 hover:bg-primary-foreground/10 hover:text-primary-foreground"
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
