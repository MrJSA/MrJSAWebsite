import { getCollections } from '#lib/server/content.js';

export function load() {
	return { projects: getCollections().projects.map((p) => ({ ...p, html: '' })) };
}
