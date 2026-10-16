/**
 * Content loader. Runs only at build time (prerender) — none of this ships to the browser.
 *
 * Layout of `web/content/`:
 *   <collection>/<slug>.md             one entry
 *   <collection>/<slug>/index.md       one entry with sibling files (e.g. apps/<slug>/privacy.md)
 *
 * Adding a file = adding an entry. Deleting a file = removing it. No code changes needed.
 */
import { dev } from '$app/env';
import { error } from '@sveltejs/kit';
import type { App, Collections, Page, Project, Service } from '#lib/types.js';
import { renderMarkdown, splitFrontmatter } from './markdown';

const files = import.meta.glob('/content/**/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

interface RawEntry {
	collection: string;
	slug: string;
	data: Record<string, unknown>;
	html: string;
	/** Sibling markdown files of a folder entry, keyed by file name without extension. */
	extras: Record<string, string>;
}

function load(): Map<string, RawEntry[]> {
	const byKey = new Map<string, RawEntry>();
	const extras: { key: string; name: string; html: string }[] = [];

	for (const [path, raw] of Object.entries(files)) {
		const parts = path.replace(/^\/content\//, '').replace(/\.md$/, '').split('/');
		// Files/folders starting with "_" are ignored (handy for templates and notes).
		if (parts.some((p) => p.startsWith('_'))) continue;

		const [collection, slug, file] = parts;
		if (!collection || !slug) continue;

		const { data, body } = splitFrontmatter(raw);
		const html = renderMarkdown(body);
		const key = `${collection}/${slug}`;

		if (file === undefined || file === 'index') {
			byKey.set(key, { collection, slug: (data.slug as string) ?? slug, data, html, extras: {} });
		} else {
			extras.push({ key, name: file, html });
		}
	}

	for (const extra of extras) {
		const entry = byKey.get(extra.key);
		if (entry) entry.extras[extra.name] = extra.html;
	}

	const out = new Map<string, RawEntry[]>();
	for (const entry of byKey.values()) {
		if (entry.data.draft && !dev) continue;
		if (!out.has(entry.collection)) out.set(entry.collection, []);
		out.get(entry.collection)!.push(entry);
	}
	return out;
}

function sortEntries<T extends { order?: number; date?: string; title: string }>(items: T[]): T[] {
	return items.sort((a, b) => {
		const ao = a.order ?? Number.POSITIVE_INFINITY;
		const bo = b.order ?? Number.POSITIVE_INFINITY;
		if (ao !== bo) return ao - bo;
		if (a.date && b.date && a.date !== b.date) return b.date.localeCompare(a.date);
		return a.title.localeCompare(b.title);
	});
}

function toEntry<T>(raw: RawEntry): T {
	const data = { ...raw.data };
	// YAML parses unquoted dates as Date objects; normalise to YYYY-MM-DD.
	if (data.date instanceof Date) data.date = data.date.toISOString().slice(0, 10);
	if (!data.title) throw new Error(`content/${raw.collection}/${raw.slug}: missing "title" in frontmatter`);
	return { summary: '', ...data, slug: raw.slug, html: raw.html } as T;
}

let cache: Collections | undefined;

export function getCollections(): Collections {
	if (cache && !dev) return cache;
	const raw = load();
	const get = (name: string) => raw.get(name) ?? [];

	cache = {
		projects: sortEntries(get('projects').map((r) => toEntry<Project>(r))),
		apps: sortEntries(
			get('apps').map((r) => ({ ...toEntry<App>(r), privacyHtml: r.extras['privacy'] }))
		),
		services: sortEntries(get('services').map((r) => toEntry<Service>(r))),
		pages: sortEntries(get('pages').map((r) => toEntry<Page>(r)))
	};
	return cache;
}

export function findOr404<T extends { slug: string }>(items: T[], slug: string): T {
	const item = items.find((i) => i.slug === slug);
	if (!item) error(404, 'Not found');
	return item;
}
