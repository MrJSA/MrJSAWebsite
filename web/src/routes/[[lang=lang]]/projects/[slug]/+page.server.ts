import { langEntry, langParam, langs } from '#lib/i18n.js';
import { findOr404, getCollections } from '#lib/server/content.js';

export function entries() {
	return langs.flatMap((lang) =>
		getCollections(lang).projects.map((p) => ({ ...langEntry(lang), slug: p.slug }))
	);
}

export function load({ params }) {
	const { projects } = getCollections(langParam(params.lang));
	const project = findOr404(projects, params.slug);
	const index = projects.indexOf(project);
	const neighbour = (i: number) =>
		projects[i] ? { slug: projects[i].slug, title: projects[i].title } : undefined;
	return { project, prev: neighbour(index - 1), next: neighbour(index + 1) };
}
