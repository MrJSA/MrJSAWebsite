import { langEntry, langParam, langs } from '#lib/i18n.js';
import { findOr404, getCollections } from '#lib/server/content.js';

export function entries() {
	return langs.flatMap((lang) =>
		getCollections(lang).apps.map((a) => ({ ...langEntry(lang), slug: a.slug }))
	);
}

export function load({ params }) {
	const app = findOr404(getCollections(langParam(params.lang)).apps, params.slug);
	return { app: { ...app, privacyHtml: undefined }, hasPrivacy: !!app.privacyHtml };
}
