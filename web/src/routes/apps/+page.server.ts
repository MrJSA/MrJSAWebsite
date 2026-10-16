import { getCollections } from '#lib/server/content.js';

export function load() {
	return { apps: getCollections().apps.map((a) => ({ ...a, html: '', privacyHtml: undefined })) };
}
