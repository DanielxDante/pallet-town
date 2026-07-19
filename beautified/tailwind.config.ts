import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				// Semantic tokens — resolve to CSS vars set per-theme in app.css.
				bg: 'var(--color-bg)',
				surface: 'var(--color-surface)',
				'surface-alt': 'var(--color-surface-alt)',
				fg: 'var(--color-text)',
				muted: 'var(--color-text-muted)',
				accent: 'var(--color-accent)',
				'accent-soft': 'var(--color-accent-soft)',
				line: 'var(--color-border)'
			}
		}
	},

	plugins: [typography]
} satisfies Config;
