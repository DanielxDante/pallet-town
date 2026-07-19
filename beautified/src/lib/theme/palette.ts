/**
 * Theme palettes — single source of truth for both DOM (via CSS vars in app.css)
 * and Three.js/Threlte materials in Scene.svelte.
 *
 * KEEP IN SYNC with the [data-theme='coffee'] and [data-theme='matcha'] blocks
 * in src/app.css. The DOM reads CSS vars (to avoid FOUC on first paint); the
 * 3D scene reads this object because shader uniforms + material `color` props
 * can't consume CSS variables.
 */

export type ThemeName = 'coffee' | 'matcha';

export type Palette = {
	// Page chrome
	bg: string;
	surface: string;
	surfaceAlt: string;
	text: string;
	textMuted: string;
	accent: string;
	accentSoft: string;
	border: string;
	ratMain: string;
	ratBorder: string;

	// Mug / 3D scene
	mug: {
		ceramic: string;
		ceramicAlt: string;
		rim: string;
		interiorDark: string;
		interiorDeep: string;
		liquidDeep: string;
		liquidMid: string;
		liquidCrema: string;
		steam: string;
	};
};

export const palettes: Record<ThemeName, Palette> = {
	coffee: {
		bg: '#1a120b',
		surface: '#2a1a10',
		surfaceAlt: '#3d2817',
		text: '#f4ecd8',
		textMuted: '#c9976a',
		accent: '#c9976a',
		accentSoft: '#e0b98a',
		border: '#5b3620',
		ratMain: 'rgba(201, 151, 106, 0.5)',
		ratBorder: '#c9976a',
		mug: {
			ceramic: '#f7f4ec',
			ceramicAlt: '#e8e2d3',
			rim: '#ffffff',
			interiorDark: '#2a1a10',
			interiorDeep: '#1a0e07',
			liquidDeep: '#2a170d',
			liquidMid: '#5b3620',
			liquidCrema: '#c9976a',
			steam: '#ffffff'
		}
	},
	matcha: {
		bg: '#eef1e0',
		surface: '#c9d6a8',
		surfaceAlt: '#a8bc7d',
		text: '#2d3a1f',
		textMuted: '#5b6b3f',
		accent: '#4f6b2a',
		accentSoft: '#7fa356',
		border: '#7fa356',
		ratMain: 'rgba(79, 107, 42, 0.5)',
		ratBorder: '#4f6b2a',
		mug: {
			ceramic: '#f7f4ec',
			ceramicAlt: '#e8e2d3',
			rim: '#ffffff',
			interiorDark: '#3a4a20',
			interiorDeep: '#22301a',
			liquidDeep: '#3a5a1a',
			liquidMid: '#6a8a3d',
			liquidCrema: '#c9d9a1',
			steam: '#f4f6e8'
		}
	}
};
