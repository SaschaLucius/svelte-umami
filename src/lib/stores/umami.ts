import { derived, writable } from 'svelte/store';

// Get the value out of storage on load.
const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('umami') : '';

// Set the stored value or a sane default.
export const settings = writable<{ enabled: boolean }>(
	stored ? JSON.parse(stored) : { enabled: true }
);

// Anytime the store changes, update the local storage value.
settings.subscribe(
	(value) =>
		typeof localStorage !== 'undefined' && localStorage.setItem('umami', JSON.stringify(value))
);

// Create a derived store for isEnabled
export const isEnabled = derived(settings, ($settings) => $settings.enabled);

export const isInitialized = writable<boolean>(false);
