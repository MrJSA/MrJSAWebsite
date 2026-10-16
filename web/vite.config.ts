import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			// Everything is prerendered to plain HTML at build time.
			// `precompress` writes .br/.gz siblings that the Rust server serves directly.
			// `fallback` is the page the server returns (with status 404) for unknown URLs.
			adapter: adapter({ pages: 'build', assets: 'build', fallback: '404.html', precompress: true }),
			// Inline small CSS files into the HTML to save a request on first paint.
			inlineStyleThreshold: 4096,
			prerender: {
				handleHttpError: 'fail',
				handleMissingId: 'fail',
				// A collection may be empty (e.g. no published apps yet) — that's fine.
				handleUnseenRoutes: 'ignore'
			}
		})
	]
});
