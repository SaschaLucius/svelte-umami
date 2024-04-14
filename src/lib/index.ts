// Reexport your entry components here

export { default as UmamiAnalytics } from '$lib/components/UmamiAnalytics.svelte';
export { default as UmamiAnalyticsEnv } from '$lib/components/UmamiAnalyticsEnv.svelte';
export { default as UmamiTrackClick } from '$lib/components/UmamiTrackClick.svelte';
export {
	disableTracking,
	enableTracking,
	trackPageView,
	trackEvent,
	handleClick
} from '$lib/tracker';
