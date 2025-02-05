<script lang="ts">
	import { UmamiAnalytics, trackEvent, trackEventWithProperties, trackPageView } from '$lib';
	import { onMount } from 'svelte';
	onMount(() => {
		trackPageView();
	});
	let url = '/manualTracking-test';
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

	<button on:click={() => trackEvent('button pressed', { key: 'value' })}> Track Event </button>
	<br />
	<button on:click={() => trackPageView({ url: 'test', referrer: 'google' })}>
		Track Page view
	</button>
	<br />
	url:<input bind:value={url} />
	<button on:click={() => trackEventWithProperties('button pressed on url:', { url: url })}>
		Track Event with custom URL
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
