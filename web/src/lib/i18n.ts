/**
 * Languages. English lives at `/…`, every other language under `/<lang>/…`.
 * Content translations sit next to the English file as `<name>.<lang>.md`; anything without a
 * translation falls back to English. Text in the site config is per language in `site.ts`,
 * UI labels of the components are in `ui` below.
 */

export const langs = ['en', 'de'] as const;
export type Lang = (typeof langs)[number];
export const defaultLang: Lang = 'en';

export const langNames: Record<Lang, string> = { en: 'English', de: 'Deutsch' };
/** Open Graph locale. */
export const locales: Record<Lang, string> = { en: 'en_US', de: 'de_DE' };

export function isLang(value: unknown): value is Lang {
	return langs.includes(value as Lang);
}

/** Language of a path: `/de/projects/` → `de`, `/projects/` → `en`. */
export function langOf(pathname: string): Lang {
	const first = pathname.split('/')[1];
	return isLang(first) && first !== defaultLang ? first : defaultLang;
}

/** Strips the language prefix: `/de/projects/` → `/projects/`. */
export function unlocalize(pathname: string): string {
	const lang = langOf(pathname);
	return lang === defaultLang ? pathname : pathname.slice(lang.length + 1) || '/';
}

/** Prefixes an internal link: `/projects/` → `/de/projects/`. External links, `mailto:` etc. stay as they are. */
export function localize(href: string, lang: Lang): string {
	if (lang === defaultLang || !href.startsWith('/') || href.startsWith('//')) return href;
	return `/${lang}${href}`;
}

/** The `lang` route param (`undefined` for English) → a language. */
export function langParam(param: string | undefined): Lang {
	return isLang(param) ? param : defaultLang;
}

/** Route param value for `entries()`: English has no prefix. */
export function langEntry(lang: Lang): { lang?: Exclude<Lang, 'en'> } {
	return lang === 'en' ? {} : { lang };
}

const en = {
	skip: 'Skip to content',
	home: 'Home',
	homeLabel: 'home',
	openMenu: 'Open menu',
	closeMenu: 'Close menu',
	toLight: 'Switch to light mode',
	toDark: 'Switch to dark mode',
	switchLang: 'Deutsche Version',
	footerSite: 'Site',
	footerConnect: 'Connect',
	readMore: 'Read more',
	allProjects: 'All projects',
	allApps: 'All apps',
	previous: 'Previous',
	next: 'Next',
	moreProjects: 'More projects',
	tech: 'Tech',
	projects: 'Projects',
	apps: 'Apps',
	portfolio: 'Portfolio',
	projectsDescription:
		'PCB designs, embedded firmware, apps and web services by MrJSA Technologies — hardware and software projects engineered end to end.',
	filterCategory: 'Filter by category',
	filterAll: 'All',
	noProjects: 'Nothing here yet — check back soon.',
	download: 'Download',
	appsDescription:
		'Apps for Android, iOS and the web by MrJSA Technologies — designed, built and published in-house, from first idea to store release.',
	noApps: 'The first apps are on their way — check back soon.',
	screenshots: 'Screenshots',
	screenshot: 'screenshot',
	privacyPolicy: 'Privacy policy',
	privacyFor: 'Privacy policy for',
	privacyDescription: (app: string) => `Privacy policy for the ${app} app.`,
	privacyQuestions: 'Questions about this policy? Contact',
	stores: {
		googlePlay: 'Get it on',
		appStore: 'Download on the',
		web: 'Open the',
		webLabel: 'Web app',
		source: 'View the',
		sourceLabel: 'Source code'
	},
	glitchHint: (touch: boolean) => `${touch ? 'tap' : 'hover'} to glitch`,
	chipLabel: 'MrJSA Technologies logo: a microchip on a circuit board',
	terminalLabel: 'Example workflow',
	notFoundTitle: 'Page not found',
	errorTitle: 'Error',
	notFoundHeading: 'This trace leads nowhere.',
	errorHeading: 'Something went wrong.',
	notFoundText: 'The page you are looking for does not exist or has been moved.',
	backHome: 'Back to home',
	dateLocale: 'en-GB'
};

export type UiText = typeof en;

const de: UiText = {
	skip: 'Zum Inhalt springen',
	home: 'Startseite',
	homeLabel: 'Startseite',
	openMenu: 'Menü öffnen',
	closeMenu: 'Menü schließen',
	toLight: 'Zum hellen Design wechseln',
	toDark: 'Zum dunklen Design wechseln',
	switchLang: 'English version',
	footerSite: 'Seite',
	footerConnect: 'Kontakt',
	readMore: 'Mehr erfahren',
	allProjects: 'Alle Projekte',
	allApps: 'Alle Apps',
	previous: 'Zurück',
	next: 'Weiter',
	moreProjects: 'Weitere Projekte',
	tech: 'Technik',
	projects: 'Projekte',
	apps: 'Apps',
	portfolio: 'Portfolio',
	projectsDescription:
		'Platinendesign, Embedded-Firmware, Apps und Webdienste von MrJSA Technologies — Hardware- und Softwareprojekte von Anfang bis Ende entwickelt.',
	filterCategory: 'Nach Kategorie filtern',
	filterAll: 'Alle',
	noProjects: 'Hier ist noch nichts — schau bald wieder vorbei.',
	download: 'Download',
	appsDescription:
		'Apps für Android, iOS und das Web von MrJSA Technologies — selbst entworfen, entwickelt und veröffentlicht, von der ersten Idee bis zum Store-Release.',
	noApps: 'Die ersten Apps sind unterwegs — schau bald wieder vorbei.',
	screenshots: 'Screenshots',
	screenshot: 'Screenshot',
	privacyPolicy: 'Datenschutzerklärung',
	privacyFor: 'Datenschutzerklärung für',
	privacyDescription: (app: string) => `Datenschutzerklärung für die App ${app}.`,
	privacyQuestions: 'Fragen zu dieser Datenschutzerklärung? Schreib an',
	stores: {
		googlePlay: 'Jetzt bei',
		appStore: 'Laden im',
		web: 'Öffne die',
		webLabel: 'Web-App',
		source: 'Zum',
		sourceLabel: 'Quellcode'
	},
	glitchHint: (touch: boolean) => `${touch ? 'Tippen' : 'Hovern'} zum Glitchen`,
	chipLabel: 'Logo von MrJSA Technologies: ein Mikrochip auf einer Platine',
	terminalLabel: 'Beispiel-Workflow',
	notFoundTitle: 'Seite nicht gefunden',
	errorTitle: 'Fehler',
	notFoundHeading: 'Diese Leiterbahn führt ins Leere.',
	errorHeading: 'Etwas ist schiefgelaufen.',
	notFoundText: 'Die gesuchte Seite existiert nicht oder wurde verschoben.',
	backHome: 'Zur Startseite',
	dateLocale: 'de-DE'
};

export const ui: Record<Lang, UiText> = { en, de };
