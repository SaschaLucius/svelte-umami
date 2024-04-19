<script lang="ts">
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
		'data-auto-track': false
	}}
	overwrite={true}
/>

<section>
	<h1>Click Handler Track</h1>

	<h2>please add data-umami-event to your elements</h2>

	<button id="clicker" on:click={(e) => handleEvent('Clicker', e)}> Clicker </button>

	<input
		id="name"
		type="text"
		placeholder="Enter your name"
		on:change={(e) => handleEvent('name', e)}
		on:input={(e) => handleEvent('name', e)}
		on:mousedown={(e) => handleEvent('name', e)}
		on:keypress={(e) => handleEvent('name', e)}
	/>

	<label for="cars">Choose a car:</label>
	<select on:change={(e) => handleEvent('car', e)} id="cars" name="cars">
		<option value="volvo">Volvo</option>
		<option value="saab">Saab</option>
		<option value="fiat">Fiat</option>
		<option value="audi">Audi</option>
	</select>
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
