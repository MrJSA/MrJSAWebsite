import { langEntry, langParam, langs } from '#lib/i18n.js';
import { findOr404, getCollections } from '#lib/server/content.js';

/** Every file in `content/pages/` becomes `/<slug>/` (imprint, privacy, …). */
export function entries() {
	return langs.flatMap((lang) =>
		getCollections(lang).pages.map((p) => ({ ...langEntry(lang), page: p.slug }))
	);
}

export function load({ params }) {
	return { page: findOr404(getCollections(langParam(params.lang)).pages, params.page) };
}
