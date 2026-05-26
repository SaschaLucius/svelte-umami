import { writable } from 'svelte/store';

function safeLocalStorage(): Storage | null {
	try {
		if (
			typeof localStorage !== 'undefined' &&
			typeof localStorage.getItem === 'function' &&
			typeof localStorage.setItem === 'function'
		) {
			return localStorage;
		}
	} catch {
		// localStorage is not accessible (e.g. Node.js v25 build environment)
	}
	return null;
}

// Get the value out of storage on load.
const stored = safeLocalStorage()?.getItem('umami') ?? JSON.stringify({ enabled: true });

/** Svelte store to enable and disable the tracking. (https://umami.is/docs/track-events) */
export const isEnabled = writable<boolean>(stored ? JSON.parse(stored).enabled : true);

// Anytime the store changes, update the local storage value.
isEnabled.subscribe((value) =>
	safeLocalStorage()?.setItem('umami', JSON.stringify({ enabled: value }))
);

/** Svelte store to keep track of the status of the Umami script. */
export const status = writable<undefined | 'mounted' | 'removed' | 'loaded' | 'error'>(undefined);
