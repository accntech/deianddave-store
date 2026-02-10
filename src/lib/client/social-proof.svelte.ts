import { browser } from '$app/environment';
import { getContext, setContext } from 'svelte';
import { toast } from 'svelte-sonner';
import { source } from 'sveltekit-sse';

const TOAST_DURATION = 5000;

const dateFormatter = new Intl.DateTimeFormat('en-US', {
	month: 'short',
	day: 'numeric',
	year: 'numeric',
	hour: 'numeric',
	minute: '2-digit'
});

type SocialProofEvent = {
	name: string;
	product: string;
	qty: number;
};

export class SocialProof {
	private connection: ReturnType<typeof source> | null = null;
	private unsubscribe: (() => void) | null = null;

	constructor() {
		if (browser) {
			this.init();
		}
	}

	private init() {
		this.connection = source('/api/events/social-proof', {
			close({ connect }) {
				connect();
			}
		});

		const value = this.connection.select('social-proof');

		this.unsubscribe = value.subscribe((data) => {
			if (!data || data === '') return;
			try {
				const event: SocialProofEvent = JSON.parse(data);
				const formattedTime = dateFormatter.format(new Date());

				toast(`${event.name} purchased ${event.product}`, {
					description: `Qty: ${event.qty} · ${formattedTime}`,
					duration: TOAST_DURATION
				});
			} catch {
				// ignore parse errors
			}
		});
	}

	destroy() {
		this.unsubscribe?.();
		this.unsubscribe = null;
		this.connection?.close();
		this.connection = null;
	}
}

const SOCIAL_PROOF_KEY = Symbol('SOCIAL_PROOF');

export function setSocialProofState() {
	return setContext(SOCIAL_PROOF_KEY, new SocialProof());
}

export function getSocialProofState() {
	return getContext<ReturnType<typeof setSocialProofState>>(SOCIAL_PROOF_KEY);
}
