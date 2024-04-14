import { get } from 'svelte/store';

import { describe, it, expect, beforeEach } from 'vitest';
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
