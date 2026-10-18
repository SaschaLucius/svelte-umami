#!/usr/bin/env node
/**
 * Lightweight package smoke checks for plain Svelte vs SvelteKit surfaces.
 * Run after `npm run package`.
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const failures = [];

function assert(condition, message) {
	if (!condition) failures.push(message);
}

const analytics = resolve(root, 'dist/components/UmamiAnalytics.svelte');
const kit = resolve(root, 'dist/components/UmamiAnalyticsKit.svelte');
const envComp = resolve(root, 'dist/components/UmamiAnalyticsEnv.svelte');
const indexDts = resolve(root, 'dist/index.d.ts');
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));

assert(
	existsSync(analytics),
	'dist/components/UmamiAnalytics.svelte missing — run npm run package'
);
assert(existsSync(kit), 'dist/components/UmamiAnalyticsKit.svelte missing — run npm run package');
assert(existsSync(envComp), 'dist/components/UmamiAnalyticsEnv.svelte missing');
assert(existsSync(indexDts), 'dist/index.d.ts missing');

if (existsSync(analytics)) {
	const src = readFileSync(analytics, 'utf8');
	assert(
		!src.includes('$app/navigation'),
		'UmamiAnalytics.svelte must not import $app/navigation (plain Svelte breakage)'
	);
	assert(
		src.includes('data-auto-pageview') || src.includes("'data-auto-pageview'"),
		'UmamiAnalytics spa mode should reference data-auto-pageview'
	);
}

if (existsSync(kit)) {
	const src = readFileSync(kit, 'utf8');
	assert(
		src.includes('$app/navigation'),
		'UmamiAnalyticsKit.svelte should import $app/navigation for SPA navigations'
	);
}

if (existsSync(indexDts)) {
	const dts = readFileSync(indexDts, 'utf8');
	assert(dts.includes('UmamiAnalyticsKit'), 'index.d.ts should export UmamiAnalyticsKit');
	assert(
		dts.includes('SessionData') || dts.includes('trackSession'),
		'public API types/session export missing'
	);
}

assert(pkg.peerDependencies?.svelte, 'svelte peerDependency required');
assert(
	pkg.peerDependenciesMeta?.['@sveltejs/kit']?.optional === true,
	'@sveltejs/kit should be an optional peerDependency'
);

if (failures.length) {
	console.error('consumer-smoke failed:');
	for (const f of failures) console.error(' -', f);
	process.exit(1);
}

console.log('consumer-smoke: ok (plain Svelte UmamiAnalytics; Kit SPA in UmamiAnalyticsKit)');
