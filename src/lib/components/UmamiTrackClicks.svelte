<script lang="ts">
	import { handleEvent } from '$lib';
	/** The name of the event to track */
	export let name: string;
</script>

<!--
@component
Surround elements with this component to track clicks with Umami Analytics.

- Note: This component is not a replacement for the UmamiAnalytics component. It needs to be initialized separately.
- Usage:
  ```tsx
  <UmamiTrackClicks name="Click me button">
	<button data-umami-event='my button'>Click me</button>
  </UmamiTrackClicks>
	```
  -->

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div data-umami-event={name} on:click={handleEvent}>
	<slot />
</div>
