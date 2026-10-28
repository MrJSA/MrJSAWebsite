import { site } from '#lib/config/site.js';
import { getCollections } from '#lib/server/content.js';

export const prerender = true;
export const trailingSlash = 'never';

export function GET() {
	if (site.url.includes('example.com') || site.email.includes('example.com')) {
		console.warn('\n⚠  site.url / site.email in src/lib/config/site.ts are still placeholders.\n');
	}
	const { projects, apps, pages } = getCollections();
	// `lastmod` only where the content has a date — search engines ignore it once it proves unreliable.
	const entries: { path: string; date?: string }[] = [
		{ path: '/' },
		{ path: '/projects/' },
		...projects.map((p) => ({ path: `/projects/${p.slug}/`, date: p.date })),
		{ path: '/apps/' },
		...apps.flatMap((a) => [
			{ path: `/apps/${a.slug}/`, date: a.date },
			...(a.privacyHtml ? [{ path: `/apps/${a.slug}/privacy/` }] : [])
		]),
		...pages.map((p) => ({ path: `/${p.slug}/` }))
	];
	const urls = entries
		.map(
			(e) =>
				`  <url><loc>${site.url}${e.path}</loc>${e.date ? `<lastmod>${e.date}</lastmod>` : ''}</url>`
		)
		.join('\n');
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
	return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
