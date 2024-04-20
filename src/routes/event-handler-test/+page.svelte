<script lang="ts">
	import { UmamiAnalytics, handleEvent, trackPageView } from '$lib';
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
	<h1>Custom Handler Tracking</h1>

	<h2>please add handler to your elements</h2>

	<br />

	<button data-umami-event="clicker" on:click={handleEvent}> Clicker </button>

	<br />

	<input
		data-umami-event="name"
		type="text"
		placeholder="Enter your name"
		on:change={handleEvent}
		on:input={handleEvent}
		on:mousedown={handleEvent}
		on:keypress={handleEvent}
	/>

	<br />

	<label for="cars">Choose a car:</label>
	<select on:change={handleEvent} data-umami-event="cars" name="cars">
		<option value="volvo">Volvo</option>
		<option value="saab">Saab</option>
		<option value="fiat">Fiat</option>
		<option value="audi">Audi</option>
	</select>

	<br />

	<fieldset data-umami-event="monster" on:change={handleEvent}>
		<legend>Choose your monster's features:</legend>

		<div>
			<input type="checkbox" id="scales" name="scales" checked />
			<label for="scales">Scales</label>
		</div>

		<div>
			<input type="checkbox" id="horns" name="horns" />
			<label for="horns">Horns</label>
		</div>
	</fieldset>
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
