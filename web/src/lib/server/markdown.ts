import { Marked } from 'marked';
import { parse as parseYaml } from 'yaml';

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

export function splitFrontmatter(raw: string): { data: Record<string, unknown>; body: string } {
	const match = FRONTMATTER.exec(raw);
	if (!match) return { data: {}, body: raw };
	return { data: (parseYaml(match[1]) as Record<string, unknown>) ?? {}, body: raw.slice(match[0].length) };
}

export function slugify(text: string): string {
	return text
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/<[^>]*>/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

const marked = new Marked({
	gfm: true,
	renderer: {
		heading({ tokens, depth }) {
			const text = this.parser.parseInline(tokens);
			const id = slugify(text);
			return `<h${depth} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true" tabindex="-1">#</a>${text}</h${depth}>\n`;
		},
		link({ href, title, tokens }) {
			const text = this.parser.parseInline(tokens);
			const external = /^https?:\/\//.test(href);
			const titleAttr = title ? ` title="${title}"` : '';
			const rel = external ? ' target="_blank" rel="noopener noreferrer"' : '';
			return `<a href="${href}"${titleAttr}${rel}>${text}</a>`;
		},
		image({ href, title, text }) {
			const titleAttr = title ? ` title="${title}"` : '';
			return `<img src="${href}" alt="${text}"${titleAttr} loading="lazy" decoding="async">`;
		}
	}
});

export function renderMarkdown(body: string): string {
	return marked.parse(body, { async: false });
}
