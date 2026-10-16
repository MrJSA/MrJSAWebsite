import { getCollections } from '#lib/server/content.js';

// Every page is rendered to static HTML at build time.
export const prerender = true;
// `/about` is emitted as `about/index.html`, which any static file server understands.
export const trailingSlash = 'always';

export function load() {
	const legal = getCollections()
		.pages.filter((p) => p.footer)
		.map((p) => ({ label: p.title, href: `/${p.slug}/` }));
	return { legal };
}
