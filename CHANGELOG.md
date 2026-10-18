# Changelog

## 0.0.6

### Fixes

- Restore plain Svelte compatibility: `UmamiAnalytics` no longer imports `$app/navigation`.
- SPA mode uses `data-auto-pageview="false"` (Umami ≥ 3.2) so `window.umami` still initializes.
- Boolean tracker config flags are rendered as explicit `"true"` / `"false"` attributes.
- `isEnabled` now gates `trackPageView`, `trackEvent`, `trackEventWithProperties`, `trackSession`, and `handleEvent`.
- Unit tests no longer pick up packaged `.svelte-kit/__package__` artifacts.

### Features

- Add `UmamiAnalyticsKit` for SvelteKit `afterNavigate` pageviews when `pageTracking="spa"`.
- `UmamiAnalyticsEnv` uses the Kit component so env-based SPA mode tracks client navigations.
- Export `SessionData`, `EventData`, `UmamiTrackerConfiguration`, and related public types.

### Breaking / behavior notes

- SPA mode requires **Umami ≥ 3.2**. Prefer `UmamiAnalyticsKit` or `UmamiAnalyticsEnv` for full SvelteKit SPA tracking.
- `handleEvent` sends plain JSON event data (not the DOM `Event`) — already fixed on the 0.0.5 line.
- `@sveltejs/kit` is an optional peer dependency (required for Kit components).

### Security / tooling

- Production dependencies: 0 vulnerabilities.
- Dev toolchain upgraded (Vitest 5, Vite 6.4, Playwright, TypeScript ESLint, eslint-plugin-svelte 3).
- Remaining low-severity `cookie` advisory comes from `@sveltejs/kit@2` (requires Kit 3 major to clear).

## 0.0.5

- Svelte 5 tooling upgrade, `trackSession`, SPA opt-in experiments, tracker type alignment (superseded by 0.0.6 fixes).

## 0.0.4

- Previous stable release on npm.
