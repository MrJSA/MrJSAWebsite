/**
 * Shared content types. Everything under `web/content/` is parsed into one of these.
 * Frontmatter fields are documented in `.private/AGENTS.md` and in the example files.
 */

export interface Link {
	label: string;
	href: string;
	icon?: string;
}

interface EntryBase {
	slug: string;
	title: string;
	summary: string;
	/** ISO date (YYYY-MM-DD). Used for sorting; newest first. */
	date?: string;
	/** Manual sort key; lower comes first. Takes precedence over `date`. */
	order?: number;
	/** Drafts render in `npm run dev` but are left out of production builds. */
	draft?: boolean;
	tags?: string[];
	/** Image path under `web/static`, e.g. `/images/projects/foo.webp`. */
	cover?: string;
	/** Rendered Markdown body. */
	html: string;
}

export interface Project extends EntryBase {
	/** Free text, e.g. "Hardware", "Software", "Embedded". Shown as a badge and used for filtering. */
	category?: string;
	status?: string;
	featured?: boolean;
	links?: Link[];
}

export interface StoreLinks {
	googlePlay?: string;
	appStore?: string;
	web?: string;
	source?: string;
}

export interface App extends EntryBase {
	/** Square icon under `web/static`, e.g. `/images/apps/foo/icon.png`. */
	icon?: string;
	platforms?: string[];
	status?: string;
	stores?: StoreLinks;
	screenshots?: string[];
	/** Rendered `privacy.md` next to the app's `index.md`, if present. */
	privacyHtml?: string;
	/** Contact address shown on the app's privacy page; falls back to the site email. */
	supportEmail?: string;
}

export interface Service extends EntryBase {
	icon?: string;
}

export interface Page extends EntryBase {
	/** Show in the footer's legal row. */
	footer?: boolean;
}

export interface Collections {
	projects: Project[];
	apps: App[];
	services: Service[];
	pages: Page[];
}
