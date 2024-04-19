<script>
	import { UmamiAnalytics, handleEvent } from '$lib';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<UmamiAnalytics
	websiteID="0904e6a4-a410-4778-8a77-74b102499058"
	srcURL="https://eu.umami.is/script.js"
	configuration={{
		'data-auto-track': false,
		'data-tag': 'example',
		'data-exclude-search': true
	}}
	overwrite={true}
/>

<section>
	<h1>Click Handler Track</h1>

	<h2>please add data-umami-event to your elements</h2>

	<button on:click={(e) => handleEvent('Click me button', e)}> Click me </button>
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
