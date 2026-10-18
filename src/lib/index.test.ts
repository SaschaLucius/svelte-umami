import { render, waitFor } from '@testing-library/svelte/svelte5';
import { get } from 'svelte/store';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UmamiAnalytics, isEnabled, status } from './index';
import { afterNavigateCallbacks, resetAfterNavigateMock } from '../app/navigation.mock.js';

describe('Test Exports', () => {
	beforeEach(() => {
		resetAfterNavigateMock();
		document.head.innerHTML = '';
		status.set(undefined);
		delete (window as Window & { umami?: unknown }).umami;
	});

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
		expect(script?.getAttribute('data-auto-track')).toBeNull();
	});

	it('pageTracking spa disables data-auto-track', async () => {
		render(UmamiAnalytics, {
			props: {
				websiteID: 'test-id',
				srcURL: 'https://eu.umami.is/script.js',
				pageTracking: 'spa'
			}
		});

		const script = await waitFor(() =>
			document.head.querySelector('script[src="https://eu.umami.is/script.js"]')
		);
		expect(script?.getAttribute('data-auto-track')).toBe('false');
		expect(afterNavigateCallbacks.length).toBeGreaterThan(0);
	});

	it('pageTracking spa tracks page view on afterNavigate', async () => {
		const track = vi.fn().mockResolvedValue('ok');
		(window as Window & { umami?: { track: typeof track } }).umami = { track };

		const { status } = await import('./stores/umami');
		status.set('loaded');

		render(UmamiAnalytics, {
			props: {
				websiteID: 'test-id',
				srcURL: 'https://eu.umami.is/script.js',
				pageTracking: 'spa',
				overwrite: true
			}
		});

		const callback = afterNavigateCallbacks[afterNavigateCallbacks.length - 1];
		expect(callback).toBeTypeOf('function');

		await callback({
			from: {
				url: new URL('https://example.com/from')
			},
			to: {
				url: new URL('https://example.com/to?q=1')
			}
		});

		await waitFor(() => expect(track).toHaveBeenCalled());
		expect(track).toHaveBeenCalledWith(expect.any(Function));
		const props = track.mock.calls[0][0]({ website: 'test-id' });
		expect(props.url).toBe('/to?q=1');
		expect(props.referrer).toBe('https://example.com/from');
	});
});
