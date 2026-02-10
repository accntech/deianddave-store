import { browser } from '$app/environment';
import { getContext, setContext } from 'svelte';

export class Consent {
	accepted = $state(false);
	private key = 'consent';

	constructor() {
		if (browser) {
			this.accepted = localStorage.getItem(this.key) === 'true';
		}

		$effect(() => {
			localStorage.setItem(this.key, String(this.accepted));
		});
	}

	accept() {
		this.accepted = true;
	}
}

const CONSENT_KEY = Symbol('CONSENT');

export function setConsentState() {
	return setContext(CONSENT_KEY, new Consent());
}

export function getConsentState() {
	return getContext<ReturnType<typeof setConsentState>>(CONSENT_KEY);
}
