<script>
	import { UmamiAnalytics, UmamiTrackClicks } from '$lib';
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
<UmamiTrackClicks name="element clicked">
	<section data-umami-event="section">
		<h1 data-umami-event="header">Click Tracker Track</h1>

		<h2>please add UmamiTrackClicks around your elements and add data-umami-event where needed</h2>

		<button data-umami-event="button"> Click me </button>
	</section>
</UmamiTrackClicks>

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
