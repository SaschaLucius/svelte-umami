import { writable } from 'svelte/store';

// Get the value out of storage on load.
const stored =
	typeof localStorage !== 'undefined'
		? localStorage.getItem('umami')
		: JSON.stringify({ enabled: true });

// Set the stored value or a sane default.
export const isEnabled = writable<boolean>(stored ? JSON.parse(stored).enabled : true);

// Anytime the store changes, update the local storage value.
isEnabled.subscribe(
	(value) =>
		typeof localStorage !== 'undefined' &&
		localStorage.setItem('umami', JSON.stringify({ enabled: value }))
);
