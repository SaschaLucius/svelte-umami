<script lang="ts">
	import { type EventData } from '$lib/types';
	import { trackEvent } from '$lib/tracker';
	export let name: string;

	function handleClick(e: MouseEvent) {
		const target = e.currentTarget as unknown as EventData;
		trackEvent(name, target);
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click={handleClick}>
	<slot />
</div>
