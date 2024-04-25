<script>
	import Counter from './Counter.svelte';
	import { base } from '$app/paths';
	import { UmamiAnalytics } from '$lib';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<UmamiAnalytics
	websiteID="0904e6a4-a410-4778-8a77-74b102499058"
	srcURL="https://eu.umami.is/script.js"
/>

<section>
	<h1>
		<span class="welcome">
			<picture>
				<source srcset="${base}/svelte-welcome.webp" type="image/webp" />
				<img src="${base}/svelte-welcome.png" alt="Welcome" />
			</picture>
		</span>

		to your new<br />SvelteKit app
	</h1>

	<h2>
		try editing <strong>src/routes/+page.svelte</strong>
	</h2>

	<Counter />
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

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
