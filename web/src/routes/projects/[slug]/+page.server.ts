import { findOr404, getCollections } from '#lib/server/content.js';

export function entries() {
	return getCollections().projects.map((p) => ({ slug: p.slug }));
}

export function load({ params }) {
	const { projects } = getCollections();
	const project = findOr404(projects, params.slug);
	const index = projects.indexOf(project);
	const neighbour = (i: number) =>
		projects[i] ? { slug: projects[i].slug, title: projects[i].title } : undefined;
	return { project, prev: neighbour(index - 1), next: neighbour(index + 1) };
}
