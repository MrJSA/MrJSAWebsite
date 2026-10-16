import { site } from '#lib/config/site.js';
import { getCollections } from '#lib/server/content.js';

export const prerender = true;
export const trailingSlash = 'never';

export function GET() {
	if (site.url.includes('example.com') || site.email.includes('example.com')) {
		console.warn('\n⚠  site.url / site.email in src/lib/config/site.ts are still placeholders.\n');
	}
	const { projects, apps, pages } = getCollections();
	const paths = [
		'/',
		'/projects/',
		...projects.map((p) => `/projects/${p.slug}/`),
		'/apps/',
		...apps.flatMap((a) => [`/apps/${a.slug}/`, ...(a.privacyHtml ? [`/apps/${a.slug}/privacy/`] : [])]),
		...pages.map((p) => `/${p.slug}/`)
	];
	const urls = paths.map((p) => `  <url><loc>${site.url}${p}</loc></url>`).join('\n');
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
	return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
