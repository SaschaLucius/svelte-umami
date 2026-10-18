import { render, waitFor } from '@testing-library/svelte/svelte5';
import { get } from 'svelte/store';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
	UmamiAnalytics,
	UmamiAnalyticsKit,
	isEnabled,
	status,
	trackPageView,
	trackEvent,
	trackSession
} from './index';
import { afterNavigateCallbacks, resetAfterNavigateMock } from '../app/navigation.mock.js';

describe('Test Exports', () => {
	beforeEach(() => {
		resetAfterNavigateMock();
		document.head.innerHTML = '';
		status.set(undefined);
		isEnabled.set(true);
		delete (window as Window & { umami?: unknown }).umami;
	});

	it('Functions', () => {
		expect(get(isEnabled)).toBe(true);
	});

	it('Class', async () => {
		render(UmamiAnalytics, {
			props: {
				websiteID: '',
				srcURL: 'https://eu.umami.is/script.js',
				configuration: {}
			}
		});

		const script = await waitFor(() =>
			document.head.querySelector('script[src="https://eu.umami.is/script.js"]')
		);
		expect(script).not.toBeNull();
		expect(script?.getAttribute('data-auto-track')).toBeNull();
		expect(script?.getAttribute('data-auto-pageview')).toBeNull();
		expect(afterNavigateCallbacks.length).toBe(0);
	});

	it('renders false config flags as string attributes', async () => {
		render(UmamiAnalytics, {
			props: {
				websiteID: 'test-id',
				srcURL: 'https://eu.umami.is/script.js',
				configuration: {
					'data-auto-pageview': false,
					'data-exclude-search': true
				}
			}
		});

		const script = await waitFor(() =>
			document.head.querySelector('script[src="https://eu.umami.is/script.js"]')
		);
		expect(script?.getAttribute('data-auto-pageview')).toBe('false');
		expect(script?.getAttribute('data-exclude-search')).toBe('true');
	});

	it('pageTracking spa disables data-auto-pageview and tracks initial view', async () => {
		const track = vi.fn().mockResolvedValue('ok');
		(window as Window & { umami?: { track: typeof track } }).umami = { track };

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
		expect(script?.getAttribute('data-auto-pageview')).toBe('false');
		expect(script?.getAttribute('data-auto-track')).toBeNull();
		await waitFor(() => expect(track).toHaveBeenCalled());
	});

	it('UmamiAnalyticsKit tracks page view on afterNavigate when spa', async () => {
		const track = vi.fn().mockResolvedValue('ok');
		(window as Window & { umami?: { track: typeof track } }).umami = { track };
		status.set('loaded');

		render(UmamiAnalyticsKit, {
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
		const propsCall = track.mock.calls.find((call) => typeof call[0] === 'function');
		expect(propsCall).toBeTruthy();
		const props = propsCall![0]({ website: 'test-id' });
		expect(props.url).toBe('/to?q=1');
		expect(props.referrer).toBe('https://example.com/from');
	});

	it('isEnabled gates tracker functions', async () => {
		const track = vi.fn().mockResolvedValue('ok');
		const identify = vi.fn().mockResolvedValue('ok');
		(window as Window & { umami?: { track: typeof track; identify: typeof identify } }).umami = {
			track,
			identify
		};
		status.set('loaded');
		isEnabled.set(false);

		await expect(trackPageView()).resolves.toBe('Umami disabled.');
		await expect(trackEvent('x')).resolves.toBe('Umami disabled.');
		await expect(trackSession('user-1')).resolves.toBe('Umami disabled.');
		expect(track).not.toHaveBeenCalled();
		expect(identify).not.toHaveBeenCalled();
	});
});
