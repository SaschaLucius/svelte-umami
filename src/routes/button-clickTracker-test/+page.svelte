<script>
	import { UmamiAnalytics, UmamiTrackClick, handleClick } from '$lib';
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
/>
<UmamiTrackClick name="element clicked">
	<section>
		<h1>Click Tracker Track</h1>

		<h2>please add clickHandler to your elements</h2>

		<button on:click={(e) => handleClick(e, 'button pressed')}> Click me </button>
	</section>
</UmamiTrackClick>

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
