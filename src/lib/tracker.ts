import type {
	EventData,
	OptionalTrackedProperties,
	SessionData,
	TrackedProperties,
	UmamiTracker,
	WindowWithUmami
} from './types';
import type { UmamiTrackerConfiguration } from './types';
import { status } from '$lib/stores/umami';
import { get } from 'svelte/store';

declare let window: WindowWithUmami;

// https://github.com/flexdinesh/browser-or-node
const browser: boolean = typeof window !== 'undefined' && typeof window.document !== 'undefined';

/**
 * Track a page view with and without custom properties
 * @param properties
 * @returns
 */
export function trackPageView(properties?: OptionalTrackedProperties): Promise<string> {
	if (!browser) return Promise.resolve('');
	if ([undefined, 'error', 'removed'].includes(get(status)))
		return Promise.resolve('Umami not found.');

	return waitForUmami().then((umami) => {
		if (properties) {
			return umami.track((props: TrackedProperties) => ({
				...props,
				...properties
			}));
		} else {
			return umami.track();
		}
	});
}

async function waitForUmami(): Promise<UmamiTracker> {
	let count = 50; // try max 5 seconds
	while (!window.umami) {
		if ([undefined, 'error', 'removed'].includes(get(status)) || count <= 0) {
			return {
				track: () => Promise.resolve('Umami not found.'),
				identify: () => Promise.resolve('Umami not found.')
			};
		}
		await new Promise((resolve) => setTimeout(resolve, 100));
		count--;
	}
	return window.umami;
}

/**
 * Track an event with a given name
 * @param eventName Note: event names will be truncated past 50 characters
 * @param eventData Note: Event Data Limits
						Event Data can work with any JSON data. There are a few rules in place to maintain performance.
						- Numbers have a max precision of 4.
						- Strings have a max length of 500.
						- Arrays are converted to a String, with the same max length of 500.
						- Objects have a max of 50 properties. Arrays are considered 1 property.
						- When tracking events, the default properties are included in the payload. 
 * @returns
 */
export function trackEvent(eventName: string, eventData?: EventData): Promise<string> {
	if (!browser) return Promise.resolve('');
	if ([undefined, 'error', 'removed'].includes(get(status)))
		return Promise.resolve('Umami not found.');

	return waitForUmami().then((umami) => {
		if (eventData) {
			return umami.track(eventName, eventData);
		} else {
			return umami.track(eventName);
		}
	});
}

/**
 * Track an event with a given name and custom properties
 * @param eventName Note: event names will be truncated past 50 characters
 * @param properties the default properties you want to overwrite 
 * @param eventData Note: Event Data Limits
						Event Data can work with any JSON data. There are a few rules in place to maintain performance.
						- Numbers have a max precision of 4.
						- Strings have a max length of 500.
						- Arrays are converted to a String, with the same max length of 500.
						- Objects have a max of 50 properties. Arrays are considered 1 property.
						- When tracking events, the default properties are included in the payload.
 * @returns 
 */
export function trackEventWithProperties(
	eventName: string,
	properties: OptionalTrackedProperties,
	eventData?: EventData
): Promise<string> {
	if (!browser) return Promise.resolve('');
	if ([undefined, 'error', 'removed'].includes(get(status)))
		return Promise.resolve('Umami not found.');

	return waitForUmami().then((umami) => {
		if (eventData) {
			return umami.track((props) => ({
				...props,
				...properties,
				name: eventName,
				data: eventData
			}));
		} else {
			return umami.track((props) => ({
				...props,
				...properties,
				name: eventName
			}));
		}
	});
}

/**
 * Identify the current session with a unique ID and/or session data.
 * @param uniqueIdOrSessionData A unique identifier string, or a SessionData object to attach to the session.
 * @param sessionData Optional session data when the first argument is a unique ID string.
 * @returns
 */
export function trackSession(
	uniqueIdOrSessionData: string | SessionData,
	sessionData?: SessionData
): Promise<string> {
	if (!browser) return Promise.resolve('');
	if ([undefined, 'error', 'removed'].includes(get(status)))
		return Promise.resolve('Umami not found.');
	return waitForUmami().then((umami) => {
		if (typeof uniqueIdOrSessionData === 'string') {
			if (sessionData) {
				return umami.identify(uniqueIdOrSessionData, sessionData);
			} else {
				return umami.identify(uniqueIdOrSessionData);
			}
		} else {
			return umami.identify(uniqueIdOrSessionData);
		}
	});
}

const SCRIPT_ID = 'umami_analytics_script';

/**
 * Adding the script would fail for example if the user is running
 * an ad blocker. This Promise can handle that case.
 */
async function registerUmamiScript(
	websiteID: string,
	srcURL: string = 'https://eu.umami.is/script.js'
) {
	return new Promise((resolve, reject) => {
		const head = document.head || document.getElementsByTagName('head')[0];

		const script = document.createElement('script');
		script.id = SCRIPT_ID;
		script.async = true;
		script.defer = true;
		script.setAttribute('data-website-id', websiteID);
		script.setAttribute('data-testid', SCRIPT_ID);
		script.src = srcURL;

		const element = head.appendChild(script);

		script.onload = resolve;
		script.onerror = reject;

		return element;
	});
}

export async function registerUmami(
	websiteID: string,
	srcURL: string,
	configuration: UmamiTrackerConfiguration
) {
	// We add the script only once even when the component rendered twice and don't run while SSR.
	if (!browser || window.document.getElementById(SCRIPT_ID)) return;

	try {
		registerUmamiScript(websiteID, srcURL);

		const umamiScript = document.getElementById(SCRIPT_ID);
		if (umamiScript) {
			setScriptSettingsProps(umamiScript, configuration);
		} else {
			console.error('umami script not found');
		}
	} catch {
		console.error('umami failure');
		const s = window.document.getElementById(SCRIPT_ID);
		if (s) {
			s.remove();
		}
	}
}

function setScriptSettingsProps(scriptElem: HTMLElement, config: UmamiTrackerConfiguration) {
	if (config['data-host-url']) scriptElem.setAttribute('data-host-url', config['data-host-url']);
	if (config['data-auto-track'] !== undefined && !config['data-auto-track'])
		scriptElem.setAttribute('data-auto-track', 'false');
	if (config['data-auto-pageview'] !== undefined && !config['data-auto-pageview'])
		scriptElem.setAttribute('data-auto-pageview', 'false');
	if (config['data-cache']) scriptElem.setAttribute('data-cache', 'true');
	if (config['data-domains']) scriptElem.setAttribute('data-domains', config['data-domains']);
	if (config['data-exclude-search']) scriptElem.setAttribute('data-exclude-search', 'true');
	if (config['data-exclude-hash']) scriptElem.setAttribute('data-exclude-hash', 'true');
	if (config['data-tag']) scriptElem.setAttribute('data-tag', config['data-tag']);
	if (config['data-distinct-id'])
		scriptElem.setAttribute('data-distinct-id', config['data-distinct-id']);
	if (config['data-performance']) scriptElem.setAttribute('data-performance', 'true');
	if (config['data-do-not-track']) scriptElem.setAttribute('data-do-not-track', 'true');
	if (config['data-before-send'])
		scriptElem.setAttribute('data-before-send', config['data-before-send']);
}

/**
 * Collect plain JSON event data from an element for Umami.
 * Includes `data-umami-event-*` attributes and form control values when present.
 */
function eventDataFromElement(el: Element | null | undefined): EventData {
	const data: EventData = {};
	if (!el) return data;

	for (const attr of Array.from(el.attributes)) {
		if (attr.name.startsWith('data-umami-event-')) {
			data[attr.name.slice('data-umami-event-'.length)] = attr.value;
		}
	}

	if (el instanceof HTMLInputElement) {
		if (el.type === 'checkbox' || el.type === 'radio') {
			data.checked = el.checked;
			data.value = el.value;
		} else if (el.value !== '') {
			data.value = el.value;
		}
	} else if (el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
		if (el.value !== '') {
			data.value = el.value;
		}
	}

	return data;
}

/**
 * Svelte Event Handler, which tracks the event within UmamiAnalytics.
 * Sends plain JSON event data (never the DOM Event object).
 * @param e: Event
 */
export function handleEvent(e: Event & { currentTarget: HTMLElement }) {
	// target = element the event occurred on; currentTarget = element with the listener
	const target = e.target as Element | null;
	const currentTarget = e.currentTarget;
	const targetUmamiId = target?.getAttribute('data-umami-event');
	const currentTargetUmamiId = currentTarget?.getAttribute('data-umami-event');
	const targetId = target?.getAttribute('id');
	const currentTargetId = currentTarget?.getAttribute('id');

	const eventName = `${targetUmamiId ?? currentTargetUmamiId ?? targetId ?? currentTargetId} ${e.type}`;
	const eventData = {
		...eventDataFromElement(currentTarget),
		...eventDataFromElement(target)
	};

	if (Object.keys(eventData).length > 0) {
		trackEvent(eventName, eventData);
	} else {
		trackEvent(eventName);
	}
}
