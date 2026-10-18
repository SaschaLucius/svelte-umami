import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig(({ mode }) => ({
	plugins: [svelte()],
	resolve: {
		conditions: mode === 'test' ? ['browser'] : [],
		alias: [
			{ find: '$lib', replacement: path.resolve(__dirname, 'src/lib') },
			{
				find: '$env/dynamic/public',
				replacement: path.resolve(__dirname, 'src/env/dynamic/public.mock.js')
			},
			{
				find: '$app/navigation',
				replacement: path.resolve(__dirname, 'src/app/navigation.mock.js')
			}
		]
	},
	test: {
		environment: 'jsdom',
		setupFiles: ['./vitest-setup.js'],
		globals: true,
		include: ['src/**/*.{test,spec}.{js,ts}'],
		exclude: ['node_modules/**', 'dist/**', '.svelte-kit/**', 'build/**']
	}
}));
