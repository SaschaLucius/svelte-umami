<script context="module" lang="ts">
	import { status } from '$lib/stores/umami';
	status.set(undefined);
	declare let window: WindowWithUmami;
</script>

<script lang="ts">
	import type { PageTracking, UmamiTrackerConfiguration, WindowWithUmami } from '$lib/types';
	import { trackPageView } from '$lib/tracker';
	import { BROWSER } from 'esm-env';
	import { onMount, onDestroy } from 'svelte';
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
	 * - `umami` (default): Umami script auto-tracking — unchanged from previous versions
	 * - `spa`: Disables Umami auto-tracking and tracks page views on SvelteKit navigations
	 *   (avoids full page reloads when Umami's auto-tracker hijacks client-side routing)
	 */
	export let pageTracking: PageTracking = 'umami';

	// Keep other config, but never leave Umami auto-track on in spa mode.
	$: scriptConfiguration =
		pageTracking === 'spa' ? { ...configuration, 'data-auto-track': false } : configuration;

	afterNavigate(({ from, to }) => {
		if (pageTracking !== 'spa' || !BROWSER || !to) return;

		trackPageView({
			url: `${to.url.pathname}${to.url.search}`,
			title: document.title,
			referrer: from
				? `${from.url.origin}${from.url.pathname}${from.url.search}`
				: undefined
		});
	});

	onMount(() => {
		if (BROWSER && pageTracking === 'spa') {
			const script = document.getElementById('umami_analytics_script');
			// Ensure the attribute is present as the string "false" (Umami reads it from the DOM).
			script?.setAttribute('data-auto-track', 'false');
		}

		if (
			BROWSER &&
			document.getElementById('umami_analytics_script') !== null &&
			$status !== 'loaded'
		) {
			$status = 'mounted';
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
Add this component to your SvelteKit app to track user interactions with Umami Analytics.

- The easiest way to use this component is to add it to the root +layout.svelte of your app.
- It will automatically add the Umami Analytics script to the head of your app.
- You will find the websiteID and srcURL in your Umami instance https://umami.is/docs/collect-data.
- Set `pageTracking="spa"` if Umami auto-tracking breaks SvelteKit client-side navigation.
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
			{...scriptConfiguration}
			on:load={scriptLoaded}
			on:error={errorHappened}
		></script>
	{/if}
</svelte:head>
