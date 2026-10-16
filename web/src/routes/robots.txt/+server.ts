import { site } from '#lib/config/site.js';

export const prerender = true;
export const trailingSlash = 'never';

export function GET() {
	return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`, {
		headers: { 'Content-Type': 'text/plain' }
	});
}
