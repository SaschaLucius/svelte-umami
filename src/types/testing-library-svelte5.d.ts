// Temporary Svelte 5 testing-library type shim until upstream fully typed.
// Allows using render(Component, { props }) without casts.
declare module '@testing-library/svelte/svelte5' {
	export * from '@testing-library/svelte';
}
