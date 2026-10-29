/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SITE CONFIG — the one file to edit for names, links and homepage layout.
 *  Content (projects, apps, services, legal pages) lives in `web/content/`.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import type { Lang } from '#lib/i18n.js';
import type { Link } from '#lib/types.js';
import type { HomeSection } from '#lib/sections/types.js';

export const site = {
	/** Company name — used in titles, footer, legal pages. */
	name: 'MrJSA Technologies',
	/** Short form for tight spots (header wordmark, watermark). */
	shortName: 'MrJSA',
	owner: 'Joshua Schulz-Andres',
	/** Public URL without trailing slash. Used for canonical links, Open Graph and the sitemap. */
	url: 'https://mrjsa.com', // TODO: change if the site moves to a subdomain
	/** Contact address shown in the contact section and footer. */
	email: 'joshua@mrjsa.com',
	/** Address for legal matters (imprint, privacy policies); fallback contact for app privacy pages. */
	legalEmail: 'admin@mrjsa.com',
	/** Business address (same as in the imprint). Tells search engines where the company is based. */
	address: {
		street: 'Lessingstraße 2 D',
		postalCode: '42499',
		city: 'Hückeswagen',
		country: 'DE'
	},
	/** Open Graph preview image under `web/static`. */
	ogImage: '/og.png',
	/** Square logo under `web/static` (header, structured data). */
	logo: '/logo-256.webp',

	/**
	 * The webshop (separate app on the same server). Set `VITE_SHOP_URL` at build time to
	 * point elsewhere, e.g. `docker build --build-arg SHOP_URL=http://localhost:8080 .`
	 */
	shop: {
		href:
			import.meta.env.VITE_SHOP_URL ||
			(import.meta.env.DEV ? 'http://localhost:8080' : 'https://shop.mrjsa.com'),
		icon: 'bag'
	},

	socials: [
		{ label: 'GitHub', href: 'https://github.com/MrJSA', icon: 'github' },
		{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/mrjsa', icon: 'linkedin' }
	] satisfies Link[],

	/** Text per language. Internal links are written without the language prefix — it's added automatically. */
	text: {
		en: {
			title: 'MrJSA Technologies — PCB Design, Embedded & Software',
			description:
				'MrJSA Technologies designs PCBs, writes embedded firmware and builds apps and software — engineered end to end.',
			shop: 'Shop',
			nav: [
				{ label: 'Services', href: '/#services' },
				{ label: 'Projects', href: '/projects/' },
				{ label: 'Apps', href: '/apps/' },
				{ label: 'About', href: '/#about' },
				{ label: 'Contact', href: '/#contact' }
			]
		},
		de: {
			title: 'MrJSA Technologies — Platinendesign, Embedded & Software',
			description:
				'MrJSA Technologies entwickelt Platinen, schreibt Embedded-Firmware und baut Apps und Software — alles aus einer Hand.',
			shop: 'Shop',
			nav: [
				{ label: 'Leistungen', href: '/#services' },
				{ label: 'Projekte', href: '/projects/' },
				{ label: 'Apps', href: '/apps/' },
				{ label: 'Über mich', href: '/#about' },
				{ label: 'Kontakt', href: '/#contact' }
			]
		}
	} satisfies Record<Lang, { title: string; description: string; shop: string; nav: Link[] }>
};

/** Command-line card of the hero (`visual: 'terminal'`) — the same in every language. */
const terminal = [
	{ prompt: true, text: 'kicad-cli pcb export gerbers board.kicad_pcb' },
	{ text: '✓ 4 layers · 0 DRC errors' },
	{ prompt: true, text: 'cargo build --release --target thumbv7em-none-eabihf' },
	{ text: '✓ Finished `release` in 12.4s' },
	{ prompt: true, text: './gradlew bundleRelease' },
	{ text: '✓ app-release.aab ready for Google Play' }
];

/**
 * Homepage per language, top to bottom. Reorder, duplicate or delete entries freely —
 * keep both languages in the same order. Internal links get the language prefix automatically.
 * Each `type` maps to a component in `src/lib/sections/` (see `registry.ts`).
 */
const homeEn: HomeSection[] = [
	{
		type: 'hero',
		eyebrow: 'MrJSA Technologies',
		title: 'From schematic\nto shipped app.',
		lead: 'I design PCBs, write the firmware that runs on them and build the apps and software that talk to them — one engineer, the whole stack.',
		actions: [
			{ label: 'See my work', href: '/projects/' },
			{ label: 'Get in touch', href: '/#contact' },
			{ label: 'GitHub', href: 'https://github.com/MrJSA', icon: 'github' }
		],
		/** 'chip' = animated logo chip on a PCB, 'terminal' = the command-line card below. */
		visual: 'chip',
		terminal
	},
	{
		type: 'marquee',
		items: [
			'PCB Design',
			'Embedded Firmware',
			'Rust',
			'Android Apps',
			'KiCad',
			'ESP32',
			'Svelte',
			'Prototyping',
			'Docker',
			'IoT'
		]
	},
	{
		type: 'shop',
		id: 'shop',
		eyebrow: 'Shop',
		title: 'Straight from\nthe workbench.',
		lead: 'Products designed and built by MrJSA Technologies — order them directly in the official shop.',
		features: ['Designed & built in-house', 'Secure checkout', 'Shipped from Germany'],
		cta: 'Visit the shop'
	},
	{ type: 'services', id: 'services', eyebrow: 'What I do', title: 'Services' },
	{
		type: 'projects',
		id: 'projects',
		eyebrow: 'Selected work',
		title: 'Projects',
		limit: 6,
		onlyFeatured: false
	},
	{ type: 'apps', id: 'apps', eyebrow: 'Available now', title: 'Apps' },
	{
		type: 'skills',
		id: 'stack',
		eyebrow: 'Toolbox',
		title: 'Tech I work with',
		groups: [
			{ label: 'Hardware', items: ['KiCad', 'Altium', 'Schematic & layout', 'DFM / JLCPCB', 'Soldering & rework'] },
			{ label: 'Embedded', items: ['Rust (embassy, no_std)', 'C / C++', 'ESP32', 'STM32', 'nRF52'] },
			{ label: 'Apps & Software', items: ['Rust', 'Svelte', 'Kotlin', 'TypeScript', 'Docker', 'Linux'] }
		]
	},
	{
		type: 'about',
		id: 'about',
		eyebrow: 'About',
		title: 'Hi, I’m Joshua.',
		paragraphs: [
			'I’m an engineer who enjoys the full journey of a product: from the first sketch of a circuit, through the board layout and firmware, all the way to the app in the store.',
			'With MrJSA Technologies I build my own products and help others bring theirs to life — pragmatic, well documented and built to last.'
		],
		portrait: {
			src: '/images/portrait/joshua.webp',
			alt: 'Portrait of Joshua Schulz-Andres'
		},
		facts: [
			{ label: 'Based in', value: 'Germany' },
			{ label: 'Focus', value: 'PCBs, embedded, apps' },
			{ label: 'Languages', value: 'German, English' }
		]
	},
	{
		type: 'contact',
		id: 'contact',
		eyebrow: 'Contact',
		title: 'Have a project in mind?',
		lead: 'Whether it is a board, a device, an app or something in between — send me a message and I’ll get back to you.'
	}
];

const homeDe: HomeSection[] = [
	{
		type: 'hero',
		eyebrow: 'MrJSA Technologies',
		title: 'Vom Schaltplan\nbis zur fertigen App.',
		lead: 'Ich entwerfe Platinen, schreibe die Firmware, die darauf läuft, und baue die Apps und Software, die mit ihnen sprechen — ein Entwickler, der ganze Stack.',
		actions: [
			{ label: 'Meine Projekte', href: '/projects/' },
			{ label: 'Kontakt aufnehmen', href: '/#contact' },
			{ label: 'GitHub', href: 'https://github.com/MrJSA', icon: 'github' }
		],
		visual: 'chip',
		terminal
	},
	{
		type: 'marquee',
		items: [
			'Platinendesign',
			'Embedded-Firmware',
			'Rust',
			'Android-Apps',
			'KiCad',
			'ESP32',
			'Svelte',
			'Prototypenbau',
			'Docker',
			'IoT'
		]
	},
	{
		type: 'shop',
		id: 'shop',
		eyebrow: 'Shop',
		title: 'Direkt von\nder Werkbank.',
		lead: 'Produkte, entworfen und gebaut von MrJSA Technologies — direkt im offiziellen Shop bestellen.',
		features: ['Selbst entwickelt & gebaut', 'Sicherer Checkout', 'Versand aus Deutschland'],
		cta: 'Zum Shop'
	},
	{ type: 'services', id: 'services', eyebrow: 'Was ich mache', title: 'Leistungen' },
	{
		type: 'projects',
		id: 'projects',
		eyebrow: 'Ausgewählte Arbeiten',
		title: 'Projekte',
		limit: 6,
		onlyFeatured: false
	},
	{ type: 'apps', id: 'apps', eyebrow: 'Jetzt verfügbar', title: 'Apps' },
	{
		type: 'skills',
		id: 'stack',
		eyebrow: 'Werkzeugkasten',
		title: 'Womit ich arbeite',
		groups: [
			{ label: 'Hardware', items: ['KiCad', 'Altium', 'Schaltplan & Layout', 'DFM / JLCPCB', 'Löten & Rework'] },
			{ label: 'Embedded', items: ['Rust (embassy, no_std)', 'C / C++', 'ESP32', 'STM32', 'nRF52'] },
			{ label: 'Apps & Software', items: ['Rust', 'Svelte', 'Kotlin', 'TypeScript', 'Docker', 'Linux'] }
		]
	},
	{
		type: 'about',
		id: 'about',
		eyebrow: 'Über mich',
		title: 'Hi, ich bin Joshua.',
		paragraphs: [
			'Ich bin Ingenieur und mag den ganzen Weg eines Produkts: von der ersten Skizze einer Schaltung über das Platinenlayout und die Firmware bis zur App im Store.',
			'Mit MrJSA Technologies baue ich eigene Produkte und helfe anderen, ihre Ideen umzusetzen — pragmatisch, gut dokumentiert und auf Dauer gebaut.'
		],
		portrait: {
			src: '/images/portrait/joshua.webp',
			alt: 'Porträt von Joshua Schulz-Andres'
		},
		facts: [
			{ label: 'Standort', value: 'Deutschland' },
			{ label: 'Schwerpunkt', value: 'Platinen, Embedded, Apps' },
			{ label: 'Sprachen', value: 'Deutsch, Englisch' }
		]
	},
	{
		type: 'contact',
		id: 'contact',
		eyebrow: 'Kontakt',
		title: 'Du hast ein Projekt im Kopf?',
		lead: 'Ob Platine, Gerät, App oder etwas dazwischen — schreib mir eine Nachricht und ich melde mich bei dir.'
	}
];

export const home: Record<Lang, HomeSection[]> = { en: homeEn, de: homeDe };
