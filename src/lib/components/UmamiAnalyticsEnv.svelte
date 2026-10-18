<script lang="ts">
	import UmamiAnalytics from './UmamiAnalytics.svelte';
	import type { PageTracking, UmamiTrackerConfiguration } from '$lib/types';
	import { env } from '$env/dynamic/public';
	const src = env.PUBLIC_UMAMI_SRC ?? '';
	const websiteId = env.PUBLIC_UMAMI_WEBSITE_ID ?? '';

	/** Configuration options for the Umami Analytics script */
	export let configuration: UmamiTrackerConfiguration = {};
	/**
	 * How page views are tracked.
	 * - `umami` (default): Umami script auto-tracking — unchanged from previous versions
	 * - `spa`: Disables Umami auto-tracking and tracks page views on SvelteKit navigations
	 */
	export let pageTracking: PageTracking = 'umami';
</script>

<!--
@component
Add this component to your SvelteKit app to track user interactions with Umami Analytics.

- The easiest way to use this component is to add it to the root +layout.svelte of your app.
- It will automatically add the Umami Analytics script to the head of your app.
- The srcURL and websiteID are set in the .env file by the variables PUBLIC_UMAMI_SRC and PUBLIC_UMAMI_WEBSITE_ID.
- Set `pageTracking="spa"` if Umami auto-tracking breaks SvelteKit client-side navigation.
-->

<UmamiAnalytics
	websiteID={websiteId}
	srcURL={src}
	{configuration}
	{pageTracking}
/>
