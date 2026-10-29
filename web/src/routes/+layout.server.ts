import { langParam, localize } from '#lib/i18n.js';
import { getCollections } from '#lib/server/content.js';

// Every page is rendered to static HTML at build time.
export const prerender = true;
// `/about` is emitted as `about/index.html`, which any static file server understands.
export const trailingSlash = 'always';

export function load({ params }) {
	const lang = langParam('lang' in params ? params.lang : undefined);
	const legal = getCollections(lang)
		.pages.filter((p) => p.footer)
		.map((p) => ({ label: p.title, href: localize(`/${p.slug}/`, lang) }));
	return { legal };
}
