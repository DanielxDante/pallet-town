/**
 * Theme store (Svelte 5 runes).
 *
 * - Persists selection in `localStorage['theme']`.
 * - Falls back to `prefers-color-scheme` (dark → coffee, light → matcha).
 * - Mirrors state onto `<html data-theme>` so CSS vars in app.css can drive
 *   the DOM styling. The 3D scene subscribes to `theme.current` directly to
 *   update Three.js material colors + shader uniforms.
 *
 * Pre-hydration boot script in app.html sets the attribute BEFORE Svelte
 * mounts, so there's no flash of the wrong theme on first paint.
 */

import { browser } from '$app/environment';
import type { ThemeName } from './palette';

const STORAGE_KEY = 'theme';

function detectInitial(): ThemeName {
	if (!browser) return 'coffee';
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === 'coffee' || stored === 'matcha') return stored;

	// Read what the pre-hydration script already applied, if any
	const attr = document.documentElement.dataset.theme;
	if (attr === 'coffee' || attr === 'matcha') return attr;

	return window.matchMedia('(prefers-color-scheme: light)').matches ? 'matcha' : 'coffee';
}

function applyToDom(name: ThemeName) {
	if (!browser) return;
	document.documentElement.dataset.theme = name;
}

function createTheme() {
	let current = $state<ThemeName>(detectInitial());

	// Any change to `current` reflects into the DOM. Persistence is only
	// written when the user actively toggles (see setTheme/toggleTheme) so
	// system-pref detection remains sticky-per-visit but not per-user until
	// they explicitly choose.
	$effect.root(() => {
		$effect(() => {
			applyToDom(current);
		});
	});

	return {
		get current() {
			return current;
		},
		set(name: ThemeName) {
			current = name;
			if (browser) localStorage.setItem(STORAGE_KEY, name);
		},
		toggle() {
			const next: ThemeName = current === 'coffee' ? 'matcha' : 'coffee';
			current = next;
			if (browser) localStorage.setItem(STORAGE_KEY, next);
		}
	};
}

export const theme = createTheme();
