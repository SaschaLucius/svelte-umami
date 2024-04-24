# Svelte Umami Analytics

Add Umami Analytics easily to your Svelte or SvelteKit app and track analytics and custom events.
All by this type-safe Svelte component.

*Important* - this requires a [Umami Analytics](https://umami.is/) account.

Components:
- UmamiAnalytics: Umami initialization
- UmamiAnalyticsEnv: Umami initialization with environment variables
- UmamiTrackClicks: Track clicks in an area

Functions:
- trackPageView: Manual page view tracking
- trackEvent: Event tracking
- handleEvent: Svelte event handler for event tracking

Stores:
- isEnabled: Store for reading and writing if the tracking is enabled
- status: Store for keeping track of the Script status

## Install the package

```bash
npm i --save-dev @lukulent/svelte-umami
```

## Usage

https://umami.is/docs/collect-data

### Add tracking to your website

-  include somewhere, where it will be run once e.g. +layout.svelte

```svelte
<script>
  import { UmamiAnalytics } from '@lukulent/svelte-umami';
</script>

<UmamiAnalytics
	websiteID="123456"
	srcURL="https://eu.umami.is/script.js"
/>
```

### Configure Tracking

https://umami.is/docs/tracker-configuration

```svelte
<script>
  import { UmamiAnalytics } from '@lukulent/svelte-umami';
</script>

<UmamiAnalytics
	websiteID="123456"
	srcURL="https://eu.umami.is/script.js"
  configuration={{
		'data-auto-track': true,
		'data-tag': 'example',
		'data-exclude-search': true,
		'data-host-url': 'https://eu.umami.is',
		'data-domains': 'saschalucius.github.io',
		'data-cache': true
	}}
/>
```

### Add tracking to your website with Environment variables

- .env
```bash
PUBLIC_UMAMI_SRC=https://eu.umami.is/script.js
PUBLIC_UMAMI_WEBSITE_ID=123456
```

- +layout.svelte
```svelte
<script>
  import { UmamiAnalyticsEnv } from '@lukulent/svelte-umami';
</script>

<UmamiAnalyticsEnv/>
```

### Track Page views

https://umami.is/docs/tracker-functions

Per default all page views will be tracked als long as, UmamiAnalytics is initialized.
You can disable this behavior by adding 'data-auto-track': false to the configuration property.

#### Track Page views manually

```svelte
<script lang="ts">
	import { trackPageView } from '@lukulent/svelte-umami';
	import { onMount } from 'svelte';
	onMount(() => {
		trackPageView();
	});
</script>
```

or use custom properties as defined here https://umami.is/docs/tracker-functions
```svelte
<button on:click={(e) => trackPageView({ url: 'test', referrer: 'google' })}>
```

### Track events

https://umami.is/docs/tracker-functions

Per default all events will be tracked als long as, UmamiAnalytics is initialized and the element has the data-umami-event property.
You can disable this behavior by adding 'data-auto-track': false to the configuration property.

```svelte
<script>
	import { UmamiAnalytics } from '@lukulent/svelte-umami';
</script>

<UmamiAnalytics
	websiteID="123456"
	srcURL="https://eu.umami.is/script.js"
/>

<button data-umami-event="button pressed"> Click me </button>
```

#### Track events manually

```svelte
<script lang="ts">
	import { UmamiAnalytics, trackEvent } from '@lukulent/svelte-umami';
</script>

<UmamiAnalytics
	websiteID="123456"
	srcURL="https://eu.umami.is/script.js"
	configuration={{
		'data-auto-track': false
	}}
/>

<button on:click={(e) => trackEvent('button pressed', { key: 'value' })}> Track Event </button>
```

### Helpers

#### Event Handler

there is a pre-defined event handler in this library

```svelte
<script lang="ts">
	import { UmamiAnalytics, handleEvent } from '@lukulent/svelte-umami';
</script>

<UmamiAnalytics
	websiteID="123456"
	srcURL="https://eu.umami.is/script.js"
	configuration={{
		'data-auto-track': false
	}}
/>

<button data-umami-event="clicker" on:click={handleEvent}> Clicker </button>

<input
  data-umami-event="name"
  type="text"
  on:change={handleEvent}
/>

<select on:change={handleEvent} data-umami-event="cars">
  <option value="volvo">Volvo</option>
  <option value="saab">Saab</option>
</select>
```

#### ClickTracker

If you want to track clicks for a complete section of your website or just multiple elements together, you can use UmamiTrackClicks.

```svelte
<script>
	import { UmamiAnalytics, UmamiTrackClicks } from '@lukulent/svelte-umami';
</script>

<UmamiAnalytics
	websiteID="123456"
	srcURL="https://eu.umami.is/script.js"
	configuration={{
		'data-auto-track': false
	}}
/>

<UmamiTrackClicks name="element clicked">
	<section data-umami-event="section">
		<h1 data-umami-event="header">Click Tracker Track</h1>

		<h2>please add UmamiTrackClicks around your elements and add data-umami-event where needed</h2>

		<button data-umami-event="button"> Click me </button>
	</section>
</UmamiTrackClicks>
```

# How to contribute

Everything you need to build a Svelte library, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

Read more about creating a library [in the docs](https://kit.svelte.dev/docs/packaging).

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Everything inside `src/lib` is part of your library, everything inside `src/routes` can be used as a showcase or preview app.

## Testing Your Package

To test a package, you can use npm link, which links a package globally, and lets you use it anywhere.

```bash
npm link
```

You can run the following command to see your linked packages:

```bash
npm ls --link --global
```

## Building

To build your library:

```bash
npm run package
```

To create a production version of your showcase app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Publishing

Go into the `package.json` and give your package the desired name through the `"name"` option. Also consider adding a `"license"` field and point it to a `LICENSE` file which you can create from a template (one popular option is the [MIT license](https://opensource.org/license/mit/)).

To publish your library to [npm](https://www.npmjs.com):

```bash
npm publish --access public
```
