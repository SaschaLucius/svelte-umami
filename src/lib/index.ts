// Reexport your entry components here

export { default as UmamiAnalytics } from '$lib/components/UmamiAnalytics.svelte';
export { default as UmamiTrackClick } from '$lib/components/UmamiTrackClick.svelte';
export { disableTracking, enableTracking, trackPageView, trackEvent } from '$lib/tracker';
