import { findOr404, getCollections } from '#lib/server/content.js';

export function entries() {
	return getCollections().apps.map((a) => ({ slug: a.slug }));
}

export function load({ params }) {
	const app = findOr404(getCollections().apps, params.slug);
	return { app: { ...app, privacyHtml: undefined }, hasPrivacy: !!app.privacyHtml };
}
