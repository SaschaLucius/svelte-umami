import { render } from '@testing-library/svelte';

import { describe, it, expect } from 'vitest';
import { UmamiAnalytics, enableTracking } from './index';

describe('Test Exports', () => {
	it('Functions', () => {
		expect(enableTracking()).toBe(undefined);
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
