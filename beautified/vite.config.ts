import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { paraglideVitePlugin } from '@inlang/paraglide-js';

export default defineConfig({
	plugins: [
		sveltekit(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			strategy: ['cookie', 'preferredLanguage', 'url', 'baseLocale']
		})
	],
	server: {
		port: 3000,
		strictPort: false
	},
	preview: {
		port: 8888,
		strictPort: false
	}
});
