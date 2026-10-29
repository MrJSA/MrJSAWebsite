import { error } from '@sveltejs/kit';
import { langEntry, langParam, langs } from '#lib/i18n.js';
import { findOr404, getCollections } from '#lib/server/content.js';

export function entries() {
	return langs.flatMap((lang) =>
		getCollections(lang)
			.apps.filter((a) => a.privacyHtml)
			.map((a) => ({ ...langEntry(lang), slug: a.slug }))
	);
}

export function load({ params }) {
	const app = findOr404(getCollections(langParam(params.lang)).apps, params.slug);
	if (!app.privacyHtml) error(404, 'Not found');
	return {
		slug: app.slug,
		title: app.title,
		icon: app.icon,
		supportEmail: app.supportEmail,
		html: app.privacyHtml
	};
}
