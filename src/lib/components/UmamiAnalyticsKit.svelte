<script lang="ts">
	import UmamiAnalytics from './UmamiAnalytics.svelte';
	import type { PageTracking, UmamiTrackerConfiguration } from '$lib/types';
	import { trackPageView } from '$lib/tracker';
	import { BROWSER } from 'esm-env';
	import { afterNavigate } from '$app/navigation';

	/** The unique ID of the website */
	export let websiteID: string;
	/** The URL of the Umami Analytics script */
	export let srcURL: string;
	/** Configuration options for the Umami Analytics script */
	export let configuration: UmamiTrackerConfiguration = {};
	/** Overwrite the existing script if it is already initialized, Otherwise it could lead to multiple pages views */
	export let overwrite = false;
	/**
	 * How page views are tracked.
	 * - `umami` (default): Umami script auto-tracking
	 * - `spa`: Sets `data-auto-pageview="false"` (Umami ≥ 3.2) and tracks page views on
	 *   SvelteKit navigations via `afterNavigate`. Requires SvelteKit and Umami ≥ 3.2.
	 */
	export let pageTracking: PageTracking = 'umami';

	afterNavigate(({ from, to }) => {
		if (pageTracking !== 'spa' || !BROWSER || !to) return;
		// Skip the rare case with no `from` — UmamiAnalytics already records the initial view on mount.
		if (!from) return;

		trackPageView({
			url: `${to.url.pathname}${to.url.search}`,
			title: document.title,
			referrer: `${from.url.origin}${from.url.pathname}${from.url.search}`
		});
	});
</script>

<!--
@component
SvelteKit-aware Umami Analytics component.

- Same props as `UmamiAnalytics`, plus client-side navigation pageviews when `pageTracking="spa"`.
- Requires SvelteKit and Umami ≥ 3.2 for SPA mode.
- For plain Svelte apps, use `UmamiAnalytics` instead.
-->

<UmamiAnalytics {websiteID} {srcURL} {configuration} {overwrite} {pageTracking} />
