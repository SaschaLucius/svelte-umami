import { get } from 'svelte/store';

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { isEnabled } from './umami';

describe('Store Test', () => {
	beforeEach(async () => {
		localStorage.removeItem('umami');
	});

	it('default', () => {
		expect(get(isEnabled)).toBe(true);
	});

	it('disabled', () => {
		isEnabled.set(false);
		expect(get(isEnabled)).toBe(false);
	});

	it('re enable', () => {
		isEnabled.set(false);
		expect(get(isEnabled)).toBe(false);
		isEnabled.set(true);
		expect(get(isEnabled)).toBe(true);
	});
});

describe('Store Test – non-functional localStorage (Node.js v25)', () => {
	beforeEach(() => {
		// Simulate Node.js v25 where localStorage exists but getItem/setItem are not functions
		vi.stubGlobal('localStorage', { getItem: undefined, setItem: undefined });
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('falls back to enabled=true when localStorage methods are not functions', async () => {
		// Re-import to exercise module initialisation with the stubbed localStorage
		vi.resetModules();
		const { isEnabled: freshStore } = await import('./umami');
		expect(get(freshStore)).toBe(true);
	});

	it('does not throw when subscribing with non-functional localStorage', async () => {
		vi.resetModules();
		const { isEnabled: freshStore } = await import('./umami');
		expect(() => freshStore.set(false)).not.toThrow();
	});
});
