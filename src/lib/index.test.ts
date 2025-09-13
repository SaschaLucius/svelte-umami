import { render, waitFor } from '@testing-library/svelte/svelte5';
import { get } from 'svelte/store';
import { describe, it, expect } from 'vitest';
import { UmamiAnalytics, isEnabled } from './index';

describe('Test Exports', () => {
	it('Functions', () => {
		expect(get(isEnabled)).toBe(true);
	});

	it('Class', async () => {
		// Render component with props (Svelte 5 testing entrypoint)
		// TEMP: cast component to any until @testing-library/svelte provides proper Svelte 5 types
		render(UmamiAnalytics, {
			props: {
				websiteID: '',
				srcURL: 'https://eu.umami.is/script.js',
				configuration: {}
			}
		});

		// Wait for the script element to appear in the head
		const script = await waitFor(() =>
			document.head.querySelector('script[src="https://eu.umami.is/script.js"]')
		);
		expect(script).not.toBeNull();
	});
});
