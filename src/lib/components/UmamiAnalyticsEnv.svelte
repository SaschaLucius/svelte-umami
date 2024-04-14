<script lang="ts">
	import UmamiAnalytics from './UmamiAnalytics.svelte';
	import { env } from '$env/dynamic/public';
	const src = env.PUBLIC_UMAMI_SRC ?? '';
	const websiteId = env.PUBLIC_UMAMI_WEBSITE_ID ?? '';
</script>

<UmamiAnalytics websiteID={websiteId} srcURL={src} />
