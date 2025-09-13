// Relax Svelte component constructor typing for @testing-library until Svelte 5 types integrate fully.
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'svelte';

declare global {
	// Minimal shape expected by older testing-library types
	interface __SvelteComponentLike {
		new (options: { target: Element; props?: Record<string, any> }): any;
	}
}

export {};
