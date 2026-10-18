/** @typedef {(navigation: { from?: { url: URL } | null; to?: { url: URL } | null }) => void} AfterNavigateCallback */

/** Vitest mock for `$app/navigation` (SvelteKit). */
/** @type {AfterNavigateCallback[]} */
export const afterNavigateCallbacks = [];

/** @param {AfterNavigateCallback} callback */
export function afterNavigate(callback) {
	afterNavigateCallbacks.push(callback);
}

export function resetAfterNavigateMock() {
	afterNavigateCallbacks.length = 0;
}
