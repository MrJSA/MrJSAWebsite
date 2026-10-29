/**
 * Content loader. Runs only at build time (prerender) — none of this ships to the browser.
 *
 * Layout of `web/content/`:
 *   <collection>/<slug>.md             one entry
 *   <collection>/<slug>/index.md       one entry with sibling files (e.g. apps/<slug>/privacy.md)
 *   …/<name>.de.md                     German translation of <name>.md (same for every language)
 *
 * Adding a file = adding an entry. Deleting a file = removing it. No code changes needed.
 * A translation overrides the English frontmatter field by field and replaces the body;
 * entries without a translation are shown in English.
 */
import { dev } from '$app/env';
import { error } from '@sveltejs/kit';
import { defaultLang, isLang, type Lang } from '#lib/i18n.js';
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

interface Parsed {
	data: Record<string, unknown>;
	html: string;
}

function load(lang: Lang): Map<string, RawEntry[]> {
	// `<collection>/<slug>` → language → main file / sibling files
	const mains = new Map<string, Partial<Record<Lang, Parsed>>>();
	const extras = new Map<string, Partial<Record<Lang, Record<string, string>>>>();

	for (const [path, raw] of Object.entries(files)) {
		const parts = path.replace(/^\/content\//, '').replace(/\.md$/, '').split('/');
		// Files/folders starting with "_" are ignored (handy for templates and notes).
		if (parts.some((p) => p.startsWith('_'))) continue;

		// `privacy.de` → name `privacy`, language `de`
		const last = parts[parts.length - 1].split('.');
		const fileLang = last.length > 1 && isLang(last[last.length - 1]) ? (last.pop() as Lang) : defaultLang;
		parts[parts.length - 1] = last.join('.');

		const [collection, slug, file] = parts;
		if (!collection || !slug) continue;

		const { data, body } = splitFrontmatter(raw);
		const html = renderMarkdown(body);
		const key = `${collection}/${slug}`;

		if (file === undefined || file === 'index') {
			mains.set(key, { ...mains.get(key), [fileLang]: { data, html } });
		} else {
			const byLang = extras.get(key) ?? {};
			byLang[fileLang] = { ...byLang[fileLang], [file]: html };
			extras.set(key, byLang);
		}
	}

	const out = new Map<string, RawEntry[]>();
	for (const [key, byLang] of mains) {
		const base = byLang[defaultLang];
		// A translation without the English original is ignored.
		if (!base) continue;
		const own = lang === defaultLang ? undefined : byLang[lang];
		const data = { ...base.data, ...own?.data };
		if (data.draft && !dev) continue;

		const [collection, fileSlug] = key.split('/');
		const entry: RawEntry = {
			collection,
			slug: (base.data.slug as string) ?? fileSlug,
			data,
			html: own?.html.trim() ? own.html : base.html,
			extras: { ...extras.get(key)?.[defaultLang], ...(own && extras.get(key)?.[lang]) }
		};
		if (!out.has(collection)) out.set(collection, []);
		out.get(collection)!.push(entry);
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

const cache = new Map<Lang, Collections>();

export function getCollections(lang: Lang = defaultLang): Collections {
	const cached = cache.get(lang);
	if (cached && !dev) return cached;
	const raw = load(lang);
	const get = (name: string) => raw.get(name) ?? [];

	const collections: Collections = {
		projects: sortEntries(get('projects').map((r) => toEntry<Project>(r))),
		apps: sortEntries(
			get('apps').map((r) => ({ ...toEntry<App>(r), privacyHtml: r.extras['privacy'] }))
		),
		services: sortEntries(get('services').map((r) => toEntry<Service>(r))),
		pages: sortEntries(get('pages').map((r) => toEntry<Page>(r)))
	};
	cache.set(lang, collections);
	return collections;
}

export function findOr404<T extends { slug: string }>(items: T[], slug: string): T {
	const item = items.find((i) => i.slug === slug);
	if (!item) error(404, 'Not found');
	return item;
}
