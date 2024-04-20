<script context="module" lang="ts">
	// initialize the script only once
	let initialized = false;
</script>

<script lang="ts">
	import type { UmamiTrackerConfiguration } from '$lib/types';
	import { browser } from '$app/environment';

	/** The unique ID of the website */
	export let websiteID: string;
	/** The URL of the Umami Analytics script */
	export let srcURL: string;
	/** Configuration options for the Umami Analytics script */
	export let configuration: UmamiTrackerConfiguration = {};
	/** Overwrite the existing script if it is already initialized, Otherwise it could lead to multiple pages views */
	export let overwrite = false;

	if (initialized && overwrite) {
		if (browser) {
			const script = document.getElementById('umami_analytics_script');
			script?.remove();
		}

		initialized = false;
	}

	let shouldInitialize = !initialized;
	initialized = true;
</script>

<!--
@component
Add this component to your SvelteKit app to track user interactions with Umami Analytics.

- The easiest way to use this component is to add it to the root +layout.svelte of your app.
- It will automatically add the Umami Analytics script to the head of your app.
- You will find the websiteID and srcURL in your Umami instance https://umami.is/docs/collect-data.
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
			{...configuration}
		></script>
	{/if}
</svelte:head>
