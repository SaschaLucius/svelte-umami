import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	handleEvent,
	trackEvent,
	trackPageView,
	trackSession,
	umamiConfigToAttributes
} from './tracker';
import { isEnabled, status } from './stores/umami';

describe('handleEvent', () => {
	const track = vi.fn().mockResolvedValue('ok');

	beforeEach(() => {
		track.mockClear();
		status.set('loaded');
		isEnabled.set(true);
		(window as Window & { umami?: { track: typeof track } }).umami = { track };
	});

	it('tracks click without sending the DOM Event as data', async () => {
		const button = document.createElement('button');
		button.setAttribute('data-umami-event', 'clicker');

		handleEvent({
			type: 'click',
			target: button,
			currentTarget: button
		} as unknown as Event & { currentTarget: HTMLElement });

		await vi.waitFor(() => expect(track).toHaveBeenCalled());
		expect(track).toHaveBeenCalledWith('clicker click');
		expect(track.mock.calls[0][1]).toBeUndefined();
	});

	it('includes form value as plain JSON event data', async () => {
		const input = document.createElement('input');
		input.setAttribute('data-umami-event', 'name');
		input.value = 'Bob';

		handleEvent({
			type: 'change',
			target: input,
			currentTarget: input
		} as unknown as Event & { currentTarget: HTMLElement });

		await vi.waitFor(() => expect(track).toHaveBeenCalled());
		expect(track).toHaveBeenCalledWith('name change', { value: 'Bob' });
	});

	it('includes data-umami-event-* attributes', async () => {
		const button = document.createElement('button');
		button.setAttribute('data-umami-event', 'signup');
		button.setAttribute('data-umami-event-plan', 'pro');

		handleEvent({
			type: 'click',
			target: button,
			currentTarget: button
		} as unknown as Event & { currentTarget: HTMLElement });

		await vi.waitFor(() => expect(track).toHaveBeenCalled());
		expect(track).toHaveBeenCalledWith('signup click', { plan: 'pro' });
	});
});

describe('trackSession', () => {
	const identify = vi.fn().mockResolvedValue('ok');
	const track = vi.fn().mockResolvedValue('ok');

	beforeEach(() => {
		identify.mockClear();
		track.mockClear();
		status.set('loaded');
		isEnabled.set(true);
		(window as Window & { umami?: { track: typeof track; identify: typeof identify } }).umami = {
			track,
			identify
		};
	});

	it('identifies with a unique id', async () => {
		await trackSession('user-123');
		expect(identify).toHaveBeenCalledWith('user-123');
	});

	it('identifies with a unique id and session data', async () => {
		await trackSession('user-123', { email: 'bob@aol.com' });
		expect(identify).toHaveBeenCalledWith('user-123', { email: 'bob@aol.com' });
	});

	it('identifies with session data only', async () => {
		await trackSession({ email: 'bob@aol.com', name: 'Bob' });
		expect(identify).toHaveBeenCalledWith({ email: 'bob@aol.com', name: 'Bob' });
	});
});

describe('umamiConfigToAttributes', () => {
	it('stringifies boolean false so attributes are not dropped', () => {
		expect(
			umamiConfigToAttributes({
				'data-auto-pageview': false,
				'data-exclude-search': true,
				'data-tag': 'a'
			})
		).toEqual({
			'data-auto-pageview': 'false',
			'data-exclude-search': 'true',
			'data-tag': 'a'
		});
	});
});

describe('tracker gating', () => {
	beforeEach(() => {
		status.set('loaded');
		isEnabled.set(true);
		(window as Window & { umami?: unknown }).umami = {
			track: vi.fn().mockResolvedValue('ok'),
			identify: vi.fn().mockResolvedValue('ok')
		};
	});

	it('returns disabled when isEnabled is false', async () => {
		isEnabled.set(false);
		await expect(trackPageView()).resolves.toBe('Umami disabled.');
		await expect(trackEvent('click')).resolves.toBe('Umami disabled.');
	});
});
