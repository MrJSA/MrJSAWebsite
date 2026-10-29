import { langParam } from '#lib/i18n.js';
import { getCollections } from '#lib/server/content.js';

export function load({ params }) {
	const { projects, apps, services, pages } = getCollections(langParam(params.lang));
	// The homepage only shows cards, so drop the long Markdown bodies to keep the page small.
	return {
		collections: {
			projects: projects.map((p) => ({ ...p, html: '' })),
			apps: apps.map((a) => ({ ...a, html: '', privacyHtml: undefined })),
			services,
			pages
		}
	};
}
