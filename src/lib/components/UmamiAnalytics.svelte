<script context="module" lang="ts">
	// initialize the script only once
	let initialized = false;
</script>

<script lang="ts">
	import type { UmamiTrackerConfiguration } from '$lib/types';

	export let websiteID: string;
	export let srcURL: string;
	export let configuration: UmamiTrackerConfiguration = {};

	let shouldInitialize = !initialized;
	initialized = true;
</script>

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
