import { langParam } from '#lib/i18n.js';
import { getCollections } from '#lib/server/content.js';

export function load({ params }) {
	return {
		projects: getCollections(langParam(params.lang)).projects.map((p) => ({ ...p, html: '' }))
	};
}
