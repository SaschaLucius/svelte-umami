<script context="module" lang="ts">
	import { status } from '$lib/stores/umami';
	status.set(undefined);
	declare let window: WindowWithUmami;
</script>

<script lang="ts">
	import type { PageTracking, UmamiTrackerConfiguration, WindowWithUmami } from '$lib/types';
	import { trackPageView, umamiConfigToAttributes } from '$lib/tracker';
	import { BROWSER } from 'esm-env';
	import { onMount, onDestroy } from 'svelte';

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
	 * - `umami` (default): Umami script auto-tracking — unchanged from previous versions
	 * - `spa`: Sets `data-auto-pageview="false"` (Umami ≥ 3.2) and records the initial page view.
	 *   For SvelteKit client-side navigations, use `UmamiAnalyticsKit` or `UmamiAnalyticsEnv`.
	 */
	export let pageTracking: PageTracking = 'umami';

	// Keep other config; in spa mode disable automatic pageviews only so window.umami still initializes.
	$: scriptConfiguration =
		pageTracking === 'spa' ? { ...configuration, 'data-auto-pageview': false } : configuration;
	$: scriptAttributes = umamiConfigToAttributes(scriptConfiguration);

	onMount(() => {
		if (BROWSER && pageTracking === 'spa') {
			const script = document.getElementById('umami_analytics_script');
			// Ensure the attribute is present as the string "false" (Umami reads it from the DOM).
			script?.setAttribute('data-auto-pageview', 'false');
		}

		if (
			BROWSER &&
			document.getElementById('umami_analytics_script') !== null &&
			$status !== 'loaded'
		) {
			$status = 'mounted';
		}

		// Initial pageview for spa mode (SvelteKit afterNavigate misses the hydration enter).
		if (BROWSER && pageTracking === 'spa') {
			trackPageView();
		}
	});

	onDestroy(() => {
		if (BROWSER) {
			const script = document.getElementById('umami_analytics_script');
			if (script !== null) {
				script.remove();
				$status = 'removed';
				window.umami = undefined;
			}
		}
	});

	if (overwrite && BROWSER) {
		const script = document.getElementById('umami_analytics_script');
		if (script !== null) {
			script.remove();
			$status = 'removed';
		}
	}

	let shouldInitialize = [undefined, 'removed', 'error'].includes($status);

	// It triggers after the script was loaded and executed
	function scriptLoaded() {
		$status = 'loaded';
	}

	// Errors that occur during the loading of the script
	function errorHappened() {
		$status = 'error';
	}
</script>

<!--
@component
Add this component to your Svelte or SvelteKit app to track user interactions with Umami Analytics.

- The easiest way to use this component is to add it once near the root of your app.
- It will automatically add the Umami Analytics script to the head of your app.
- You will find the websiteID and srcURL in your Umami instance https://umami.is/docs/collect-data.
- For SvelteKit SPA page tracking (`pageTracking="spa"`), prefer `UmamiAnalyticsKit` or `UmamiAnalyticsEnv`.
-->

<svelte:head>
	{#if shouldInitialize}
		<script
			async
			defer
			id="umami_analytics_script"
			data-testid="umami_analytics_script"
			src={srcURL}
			data-website-id={websiteID}
			{...scriptAttributes}
			on:load={scriptLoaded}
			on:error={errorHappened}
		></script>
	{/if}
</svelte:head>
