<script lang="ts">
	import { handleClick } from '$lib';
	export let name: string;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click={(e) => handleClick(e, name)}>
	<slot />
</div>
