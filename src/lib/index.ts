export { default as UmamiAnalytics } from '$lib/components/UmamiAnalytics.svelte';
export { default as UmamiAnalyticsEnv } from '$lib/components/UmamiAnalyticsEnv.svelte';
export { default as UmamiTrackClicks } from '$lib/components/UmamiTrackClicks.svelte';
export { trackPageView, trackEvent, trackEventWithProperties, handleEvent } from '$lib/tracker';
export { isEnabled } from '$lib/stores/umami';
