<script lang="ts">
	import { handleEvent } from '$lib';
	export let name: string;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div data-umami-event={name} on:click={handleEvent}>
	<slot />
</div>
