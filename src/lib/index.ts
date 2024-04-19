// Reexport your entry components here

export { default as UmamiAnalytics } from '$lib/components/UmamiAnalytics.svelte';
export { default as UmamiAnalyticsEnv } from '$lib/components/UmamiAnalyticsEnv.svelte';
export { default as UmamiTrackClick } from '$lib/components/UmamiTrackClicks.svelte';
export { trackPageView, trackEvent, handleEvent, handleEventWithEventType } from '$lib/tracker';
export { isEnabled } from '$lib/stores/umami';
