import { getCollections } from '#lib/server/content.js';

export function load() {
	const { projects, apps, services, pages } = getCollections();
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
