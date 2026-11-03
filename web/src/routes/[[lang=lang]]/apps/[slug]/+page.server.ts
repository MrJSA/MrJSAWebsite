import { langEntry, langParam, langs } from '#lib/i18n.js';
import { findOr404, getCollections } from '#lib/server/content.js';

export function entries() {
	return langs.flatMap((lang) =>
		getCollections(lang).apps.map((a) => ({ ...langEntry(lang), slug: a.slug }))
	);
}

export function load({ params }) {
	const { apps } = getCollections(langParam(params.lang));
	const app = findOr404(apps, params.slug);
	const index = apps.indexOf(app);
	const neighbour = (i: number) => (apps[i] ? { slug: apps[i].slug, title: apps[i].title } : undefined);
	return {
		app: { ...app, privacyHtml: undefined },
		hasPrivacy: !!app.privacyHtml,
		prev: neighbour(index - 1),
		next: neighbour(index + 1)
	};
}
