<script context="module" lang="ts">
	let initialized = false;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import type { UmamiTrackerConfiguration } from '$lib/types';
	import { browser } from '$app/environment';

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
			data-host-url="http://stats.mywebsite.com"
			data-auto-track="false"
			data-cache="true"
			data-domains="mywebsite.com,mywebsite2.com"
			data-exclude-search="true"
			data-tag="example"
		></script>
	{/if}
</svelte:head>
