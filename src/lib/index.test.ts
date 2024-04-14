import { render } from '@testing-library/svelte';
import { get } from 'svelte/store';

import { describe, it, expect } from 'vitest';
import { UmamiAnalytics, isEnabled } from './index';

describe('Test Exports', () => {
	it('Functions', () => {
		expect(get(isEnabled)).toBe(true);
	});

	it('Class', () => {
		const { getByTestId } = render(UmamiAnalytics, {
			websiteID: '',
			srcURL: '',
			configuration: {}
		});

		const script = getByTestId('umami_analytics_script');
		expect(script).toBe('Hello, Test!');
	});
});
