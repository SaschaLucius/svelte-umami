import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig(({ mode }) => ({
	plugins: [svelte()],
	resolve: {
		conditions: mode === 'test' ? ['browser'] : []
	},
	alias: [{ find: /^svelte$/, replacement: 'svelte/internal' }],
	test: {
		environment: 'jsdom',
		setupFiles: ['./vitest-setup.js'],
		globals: true
	}
}));
