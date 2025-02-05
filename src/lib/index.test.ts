import { render, waitFor } from '@testing-library/svelte';
import { get } from 'svelte/store';
import { describe, it, expect } from 'vitest';
import { UmamiAnalytics, isEnabled } from './index';

describe('Test Exports', () => {
	it('Functions', () => {
		expect(get(isEnabled)).toBe(true);
	});

	it('Class', async () => {
		// Pass valid props so the component renders the script tag in the head
		render(UmamiAnalytics, {
			websiteID: '',
			srcURL: 'https://eu.umami.is/script.js',
			configuration: {}
		});

		// Wait for the script element to appear in the head
		const script = await waitFor(() =>
			document.head.querySelector('script[src="https://eu.umami.is/script.js"]')
		);
		expect(script).not.toBeNull();
	});
});
