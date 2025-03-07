import { writable } from 'svelte/store';

// Get the value out of storage on load.
const stored =
	typeof localStorage !== 'undefined'
		? localStorage.getItem('umami')
		: JSON.stringify({ enabled: true });

/** Svelte store to enable and disable the tracking. (https://umami.is/docs/track-events) */
export const isEnabled = writable<boolean>(stored ? JSON.parse(stored).enabled : true);

// Anytime the store changes, update the local storage value.
isEnabled.subscribe(
	(value) =>
		typeof localStorage !== 'undefined' &&
		localStorage.setItem('umami', JSON.stringify({ enabled: value }))
);

/** Svelte store to keep track of the status of the Umami script. */
export const status = writable<undefined | 'mounted' | 'removed' | 'loaded' | 'error'>(undefined);
