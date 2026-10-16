/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SITE CONFIG — the one file to edit for names, links and homepage layout.
 *  Content (projects, apps, services, legal pages) lives in `web/content/`.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import type { Link } from '#lib/types.js';
import type { HomeSection } from '#lib/sections/types.js';

export const site = {
	/** Company name — used in titles, footer, legal pages. */
	name: 'MrJSA Technologies',
	/** Short form for tight spots (header wordmark, watermark). */
	shortName: 'MrJSA',
	owner: 'Joshua Schulz-Andres',
	/** Public URL without trailing slash. Used for canonical links, Open Graph and the sitemap. */
	url: 'https://example.com', // TODO: set to your real domain
	/** Shown publicly; also the fallback contact for app privacy pages. */
	email: 'hello@example.com', // TODO: set to your real address
	lang: 'en',
	title: 'MrJSA Technologies — PCB Design, Embedded & Software',
	description:
		'MrJSA Technologies designs PCBs, writes embedded firmware and builds apps and software — engineered end to end.',
	/** Open Graph preview image under `web/static`. */
	ogImage: '/og.png',
	/** Square logo under `web/static` (header, structured data). */
	logo: '/logo-256.webp',

	nav: [
		{ label: 'Services', href: '/#services' },
		{ label: 'Projects', href: '/projects/' },
		{ label: 'Apps', href: '/apps/' },
		{ label: 'About', href: '/#about' },
		{ label: 'Contact', href: '/#contact' }
	] satisfies Link[],

	socials: [
		{ label: 'GitHub', href: 'https://github.com/MrJSA', icon: 'github' }
		// { label: 'LinkedIn', href: 'https://linkedin.com/in/…', icon: 'linkedin' },
	] satisfies Link[]
};

/**
 * Homepage, top to bottom. Reorder, duplicate or delete entries freely.
 * Each `type` maps to a component in `src/lib/sections/` (see `registry.ts`).
 */
export const home: HomeSection[] = [
	{
		type: 'hero',
		eyebrow: 'MrJSA Technologies',
		title: 'From schematic\nto shipped app.',
		lead: 'I design PCBs, write the firmware that runs on them and build the apps and software that talk to them — one engineer, the whole stack.',
		actions: [
			{ label: 'See my work', href: '/projects/' },
			{ label: 'Get in touch', href: '/#contact' }
		],
		/** 'chip' = animated logo chip on a PCB, 'terminal' = the command-line card below. */
		visual: 'chip',
		terminal: [
			{ prompt: true, text: 'kicad-cli pcb export gerbers board.kicad_pcb' },
			{ text: '✓ 4 layers · 0 DRC errors' },
			{ prompt: true, text: 'cargo build --release --target thumbv7em-none-eabihf' },
			{ text: '✓ Finished `release` in 12.4s' },
			{ prompt: true, text: './gradlew bundleRelease' },
			{ text: '✓ app-release.aab ready for Google Play' }
		]
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
