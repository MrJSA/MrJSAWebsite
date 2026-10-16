import { error } from '@sveltejs/kit';
import { findOr404, getCollections } from '#lib/server/content.js';

export function entries() {
	return getCollections()
		.apps.filter((a) => a.privacyHtml)
		.map((a) => ({ slug: a.slug }));
}

export function load({ params }) {
	const app = findOr404(getCollections().apps, params.slug);
	if (!app.privacyHtml) error(404, 'Not found');
	return {
		slug: app.slug,
		title: app.title,
		icon: app.icon,
		supportEmail: app.supportEmail,
		html: app.privacyHtml
	};
}
