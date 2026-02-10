import { browser } from '$app/environment';
import { getContext, setContext } from 'svelte';
import { toast } from 'svelte-sonner';
import type { Result } from '$lib/services';

const FAKE_NAMES = [
	'John',
	'Maria',
	'Anna',
	'Carlos',
	'Sofia',
	'James',
	'Elena',
	'Marco',
	'Linda',
	'David',
	'Grace',
	'Paolo',
	'Diana',
	'Miguel',
	'Sarah',
	'Angela',
	'Rico',
	'Bea',
	'Mark',
	'Joy',
	'Trisha',
	'Rafael',
	'Camille',
	'Jerome',
	'Nicole',
	'Patrick',
	'Karen',
	'Dennis',
	'April',
	'Bryan',
	'Cherry',
	'Ryan',
	'Jasmine',
	'Kevin',
	'Bianca',
	'Raymond',
	'Hannah',
	'Christian',
	'Arianne',
	'Justin',
	'Megan',
	'Gabriel',
	'Katrina',
	'Aaron',
	'Denise',
	'Andrei',
	'Yvonne',
	'Neil',
	'Kristine',
	'Leo'
];

const CYCLE_MS = 30 * 60 * 1000;
const TOASTS_PER_CYCLE = 3;
const TOAST_DURATION = 5000;

const dateFormatter = new Intl.DateTimeFormat('en-US', {
	month: 'short',
	day: 'numeric',
	year: 'numeric',
	hour: 'numeric',
	minute: '2-digit'
});

function maskName(name: string): string {
	if (name.length <= 2) return name;
	if (name.length >= 5) {
		return name.slice(0, 2) + '*'.repeat(name.length - 3) + name.slice(-1);
	}
	return name[0] + '*'.repeat(name.length - 2) + name.slice(-1);
}

function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

export class SocialProof {
	productNames: string[] = [];
	private timers: ReturnType<typeof setTimeout>[] = [];

	constructor() {
		if (browser) {
			this.init();
		}
	}

	private async init() {
		try {
			const res = await fetch('/api/products');
			if (res.ok) {
				const result: Result<string[]> = await res.json();
				this.productNames = result.data ?? [];
			}
		} catch {
			// silently fail — no toasts if products can't be fetched
		}

		if (this.productNames.length > 0) {
			this.scheduleCycle();
		}
	}

	private scheduleCycle() {
		const delays = Array.from({ length: TOASTS_PER_CYCLE }, () =>
			Math.floor(Math.random() * CYCLE_MS)
		).sort((a, b) => a - b);

		for (const delay of delays) {
			const timer = setTimeout(() => this.showToast(), delay);
			this.timers.push(timer);
		}

		const cycleTimer = setTimeout(() => this.scheduleCycle(), CYCLE_MS);
		this.timers.push(cycleTimer);
	}

	private showToast() {
		const productName = pickRandom(this.productNames);
		const fakeName = maskName(pickRandom(FAKE_NAMES));
		const qty = randomInt(1, 3);

		const minutesAgo = randomInt(1, 15);
		const timestamp = new Date(Date.now() - minutesAgo * 60 * 1000);
		const formattedTime = dateFormatter.format(timestamp);

		toast(`${fakeName} purchased ${productName}`, {
			description: `Qty: ${qty} · ${formattedTime}`,
			duration: TOAST_DURATION
		});
	}

	destroy() {
		for (const timer of this.timers) {
			clearTimeout(timer);
		}
		this.timers = [];
	}
}

const SOCIAL_PROOF_KEY = Symbol('SOCIAL_PROOF');

export function setSocialProofState() {
	return setContext(SOCIAL_PROOF_KEY, new SocialProof());
}

export function getSocialProofState() {
	return getContext<ReturnType<typeof setSocialProofState>>(SOCIAL_PROOF_KEY);
}
