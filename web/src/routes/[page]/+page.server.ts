import { findOr404, getCollections } from '#lib/server/content.js';

/** Every file in `content/pages/` becomes `/<slug>/` (imprint, privacy, …). */
export function entries() {
	return getCollections().pages.map((p) => ({ page: p.slug }));
}

export function load({ params }) {
	return { page: findOr404(getCollections().pages, params.page) };
}
