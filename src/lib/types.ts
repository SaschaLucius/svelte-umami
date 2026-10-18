/**
 * How page views are tracked by UmamiAnalytics / UmamiAnalyticsKit.
 * - `umami` (default): Use the Umami script's built-in auto-tracking. Same behavior as before.
 * - `spa`: Disable automatic pageviews (`data-auto-pageview="false"`, Umami ≥ 3.2) and record
 *   page views manually. Use `UmamiAnalyticsKit` or `UmamiAnalyticsEnv` for SvelteKit
 *   client-side navigations. Click tracking stays enabled; avoid `data-umami-event` on `<a>`
 *   tags if that interferes with routing — use `trackEvent` / `handleEvent` instead.
 */
export type PageTracking = 'umami' | 'spa';

/**
 * Configuration for the Umami Tracker
 * @see https://docs.umami.is/docs/tracker-configuration
 * @property data-host-url - By default, Umami will send data to wherever the script is located. You can override this to send data to another location.
 * @property data-tag - Group events under a named tag for filtering and A/B testing.
 * @property data-auto-track - When `false`, disables tracker initialization entirely (pageviews, clicks, path changes, optional features). Use tracker functions to send data yourself. Prefer `data-auto-pageview` if you only want to turn off automatic pageviews (Umami ≥ 3.2).
 * @property data-auto-pageview - When `false`, disables automatic pageview tracking while keeping the rest of the tracker initialized (Umami ≥ 3.2).
 * @property data-exclude-search - Exclude query parameters from tracked URLs.
 * @property data-exclude-hash - Exclude the URL hash from tracked URLs (Umami ≥ 2.16).
 * @property data-domains - Comma-delimited list of hostnames; the tracker only runs on these domains.
 * @property data-distinct-id - Distinct ID applied from the first request when the user is known at page load (Umami ≥ 3.4). Max 50 characters.
 * @property data-performance - Enable Core Web Vitals collection (Umami ≥ 3.1). Prefer `data-auto-pageview="false"` over `data-auto-track="false"` if you still want performance tracking with manual pageviews.
 * @property data-do-not-track - Respect the browser Do Not Track setting (Umami ≥ 2.17).
 * @property data-before-send - Name of a `window` function called before data is sent; return a payload to continue or a falsy value to cancel (Umami ≥ 2.18). Must be defined before the script loads.
 * @property data-cache - Legacy attribute from older Umami trackers. Kept for backward compatibility; current Umami versions ignore it.
 */
export interface UmamiTrackerConfiguration {
	'data-host-url'?: string;
	'data-tag'?: string;
	'data-auto-track'?: boolean;
	'data-auto-pageview'?: boolean;
	'data-exclude-search'?: boolean;
	'data-exclude-hash'?: boolean;
	'data-domains'?: string;
	'data-distinct-id'?: string;
	'data-performance'?: boolean;
	'data-do-not-track'?: boolean;
	'data-before-send'?: string;
	/** @deprecated No longer supported by current Umami trackers. Still accepted for backward compatibility. */
	'data-cache'?: boolean;
}

/**
 * https://github.com/umami-software/umami/blob/master/src/tracker/index.d.ts
 */

export type TrackedProperties = {
	/**
	 * Hostname of server
	 *
	 * @description extracted from `window.location.hostname`
	 * @example 'analytics.umami.is'
	 */
	hostname: string;

	/**
	 * Browser language
	 *
	 * @description extracted from `window.navigator.language`
	 * @example 'en-US', 'fr-FR'
	 */
	language: string;

	/**
	 * Page referrer
	 *
	 * @description extracted from `document.referrer`
	 * @example 'https://analytics.umami.is/docs/getting-started'
	 */
	referrer: string;

	/**
	 * Screen dimensions
	 *
	 * @description extracted from `window.screen.width` and `window.screen.height`
	 * @example '1920x1080', '2560x1440'
	 */
	screen: string;

	/**
	 * Page title
	 *
	 * @description extracted from `document.querySelector('head > title')`
	 * @example 'umami'
	 */
	title: string;

	/**
	 * Page url
	 *
	 * @description built from `${window.location.pathname}${window.location.search}`
	 * @example 'docs/getting-started'
	 */
	url: string;

	/**
	 * Website ID (required)
	 *
	 * @example 'b59e9c65-ae32-47f1-8400-119fcf4861c4'
	 */
	website: string;

	/**
	 * Optional tag for grouping / filtering events
	 */
	tag?: string;

	/**
	 * Distinct ID used to identify the visitor
	 */
	id?: string;
};

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/**
 *
 * Event Data can work with any JSON data. There are a few rules in place to maintain performance.
 * - Numbers have a max precision of 4.
 * - Strings have a max length of 500.
 * - Arrays are converted to a String, with the same max length of 500.
 * - Objects have a max of 50 properties. Arrays are considered 1 property.
 */
type EventJSON = string | number | boolean | null | EventJSON[] | { [key: string]: EventJSON };
export type EventData = { [key: string]: EventJSON };

export type EventProperties = {
	/**
	 * NOTE: event names will be truncated past 50 characters
	 */
	name: string;
	data?: EventData;
	/**
	 * Optional Unix timestamp in seconds to override the event time
	 */
	timestamp?: number;
} & WithRequired<TrackedProperties, 'website'>;
export type PageViewProperties = WithRequired<TrackedProperties, 'website'>;
export type CustomEventFunction = (
	props: PageViewProperties
) => EventProperties | PageViewProperties;

/**
 * Session Data can work with any JSON data.
 * If the object includes an `id` property, its value is also used as the Distinct ID.
 */
type SessionJSON =
	| string
	| number
	| boolean
	| null
	| SessionJSON[]
	| { [key: string]: SessionJSON };
export type SessionData = { [key: string]: SessionJSON };

export type UmamiTracker = {
	track: {
		/**
		 * Track a page view
		 *
		 * @example ```
		 * umami.track();
		 * ```
		 */
		(): Promise<string>;

		/**
		 * Track an event with a given name
		 *
		 * NOTE: event names will be truncated past 50 characters
		 *
		 * @example ```
		 * umami.track('signup-button');
		 * ```
		 */
		(eventName: string): Promise<string>;

		/**
		 * Tracks an event with dynamic data.
		 *
		 * NOTE: event names will be truncated past 50 characters
		 *
		 * When tracking events, the default properties are included in the payload. This is equivalent to running:
		 *
		 * ```js
		 * umami.track(props => ({
		 *   ...props,
		 *   name: 'signup-button',
		 *   data: {
		 *     name: 'newsletter',
		 *     id: 123
		 *   }
		 * }));
		 * ```
		 *
		 * @example ```
		 * umami.track('signup-button', { name: 'newsletter', id: 123 });
		 * ```
		 */
		(eventName: string, obj: EventData): Promise<string>;

		/**
		 * Tracks a page view with custom properties
		 *
		 * @example ```
		 * umami.track({ website: 'e676c9b4-11e4-4ef1-a4d7-87001773e9f2', url: '/home', title: 'Home page' });
		 * ```
		 */
		(properties: PageViewProperties): Promise<string>;

		/**
		 * Tracks an event with fully customizable dynamic data
		 * If you don't specify any `name` and/or `data`, it will be treated as a page view
		 *
		 * @example ```
		 * umami.track((props) => ({ ...props, url: path }));
		 * ```
		 */
		(eventFunction: CustomEventFunction): Promise<string>;
	};

	identify: {
		/**
		 * Assign a Distinct ID to the current session
		 *
		 * @example ```
		 * umami.identify('user-123');
		 * ```
		 */
		(uniqueId: string): Promise<string>;

		/**
		 * Assign a Distinct ID and session data to the current session
		 *
		 * @example ```
		 * umami.identify('user-123', { email: 'bob@aol.com', name: 'Bob' });
		 * ```
		 */
		(uniqueId: string, sessionData: SessionData): Promise<string>;

		/**
		 * Attach session data to the current session without a unique ID.
		 * If the object includes an `id` property, its value is also used as the Distinct ID.
		 *
		 * @example ```
		 * umami.identify({ email: 'bob@aol.com', name: 'Bob' });
		 * umami.identify({ id: 'unique_id', name: 'Bob' });
		 * ```
		 */
		(sessionData: SessionData): Promise<string>;
	};
};

export type OptionalTrackedProperties = {
	/**
	 * Hostname of server
	 *
	 * @description extracted from `window.location.hostname`
	 * @example 'analytics.umami.is'
	 */
	hostname?: string;

	/**
	 * Browser language
	 *
	 * @description extracted from `window.navigator.language`
	 * @example 'en-US', 'fr-FR'
	 */
	language?: string;

	/**
	 * Page referrer
	 *
	 * @description extracted from `document.referrer`
	 * @example 'https://analytics.umami.is/docs/getting-started'
	 */
	referrer?: string;

	/**
	 * Screen dimensions
	 *
	 * @description extracted from `window.screen.width` and `window.screen.height`
	 * @example '1920x1080', '2560x1440'
	 */
	screen?: string;

	/**
	 * Page title
	 *
	 * @description extracted from `document.querySelector('head > title')`
	 * @example 'umami'
	 */
	title?: string;

	/**
	 * Page url
	 *
	 * @description built from `${window.location.pathname}${window.location.search}`
	 * @example 'docs/getting-started'
	 */
	url?: string;

	/**
	 * Website ID (required)
	 *
	 * @example 'b59e9c65-ae32-47f1-8400-119fcf4861c4'
	 */
	website?: string;

	/**
	 * Optional tag for grouping / filtering events
	 */
	tag?: string;

	/**
	 * Distinct ID used to identify the visitor
	 */
	id?: string;

	/**
	 * Optional Unix timestamp in seconds to override the event time
	 */
	timestamp?: number;
};

export interface WindowWithUmami extends Window {
	umami: UmamiTracker | undefined;
}
