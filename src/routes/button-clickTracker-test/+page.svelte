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

<section>
	<UmamiTrackClick name="element clicked">
		<h1>Click Handler Track</h1>

		<h2>please add data-umami-event to your elements</h2>

		<button on:click={(e) => handleClick(e, 'button pressed')}>
			<svg aria-hidden="true" viewBox="0 0 1 1">
				<path d="M0,0.5 L1,0.5" />
			</svg>
		</button>
	</UmamiTrackClick>
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
