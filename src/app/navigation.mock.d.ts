/** @param {AfterNavigateCallback} callback */
export function afterNavigate(callback: AfterNavigateCallback): void;
export function resetAfterNavigateMock(): void;
/** @typedef {(navigation: { from?: { url: URL } | null; to?: { url: URL } | null }) => void} AfterNavigateCallback */
/** Vitest mock for `$app/navigation` (SvelteKit). */
/** @type {AfterNavigateCallback[]} */
export const afterNavigateCallbacks: AfterNavigateCallback[];
export type AfterNavigateCallback = (navigation: {
	from?: {
		url: URL;
	} | null;
	to?: {
		url: URL;
	} | null;
}) => void;
