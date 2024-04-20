<script>
	import { UmamiAnalytics } from '$lib';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<UmamiAnalytics
	websiteID="0904e6a4-a410-4778-8a77-74b102499058"
	srcURL="https://eu.umami.is/script.js"
	configuration={{
		'data-auto-track': true,
		'data-tag': 'example',
		'data-exclude-search': true,
		'data-host-url': 'https://eu.umami.is',
		'data-domains': 'saschalucius.github.io',
		'data-cache': true
	}}
	overwrite={true}
/>

<section>
	<h1>Advanced Configuration</h1>

	<h2>You can add multiple configuration parameter to the UmamiAnalytics element</h2>

	<button data-umami-event="Click me button">
		Click me and the URL parameter will not be tracked</button
	>
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
