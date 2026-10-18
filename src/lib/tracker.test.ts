import { beforeEach, describe, expect, it, vi } from 'vitest';
import { handleEvent } from './tracker';
import { status } from './stores/umami';

describe('handleEvent', () => {
	const track = vi.fn().mockResolvedValue('ok');

	beforeEach(() => {
		track.mockClear();
		status.set('loaded');
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
