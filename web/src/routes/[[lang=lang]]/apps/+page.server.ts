import { langParam } from '#lib/i18n.js';
import { getCollections } from '#lib/server/content.js';

export function load({ params }) {
	return {
		apps: getCollections(langParam(params.lang)).apps.map((a) => ({
			...a,
			html: '',
			privacyHtml: undefined
		}))
	};
}
