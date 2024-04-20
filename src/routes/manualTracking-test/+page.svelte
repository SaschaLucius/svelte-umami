<script lang="ts">
	import { UmamiAnalytics, trackEvent, trackPageView } from '$lib';
	import { onMount } from 'svelte';
	onMount(() => {
		trackPageView();
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<UmamiAnalytics
	websiteID="0904e6a4-a410-4778-8a77-74b102499058"
	srcURL="https://eu.umami.is/script.js"
	configuration={{
		'data-auto-track': false
	}}
	overwrite={true}
/>

<section>
	<h1>Manual Track clicks</h1>

	<button on:click={(e) => trackEvent('button pressed', { key: 'value' })}> Track Event </button>
	<button on:click={(e) => trackPageView({ url: 'test', referrer: 'google' })}>
		Track Page view
	</button>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}
</style>
