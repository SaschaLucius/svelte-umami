import { render } from '@testing-library/svelte';

import { describe, it, expect } from 'vitest';
import { greeting, HelloWorld } from './index';

describe('greeting test', () => {
	it('Hello World', () => {
		expect(greeting('World')).toBe('Hello, World!');
	});

	it('Class', () => {
		const { getByTestId } = render(HelloWorld, {
			name: 'Test'
		});

		const greeting = getByTestId('greeting');
		expect(greeting).toHaveTextContent('Hello, Test!');
	});
});
