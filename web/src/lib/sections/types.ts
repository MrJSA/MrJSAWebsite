import type { Link } from '#lib/types.js';

/**
 * Every homepage section is described by one of these. To add a new section type:
 *   1. add an interface here and include it in `HomeSection`,
 *   2. create the component in this folder,
 *   3. register it in `registry.ts`.
 */
interface SectionBase {
	/** Anchor id, so `/#<id>` scrolls to it. */
	id?: string;
	eyebrow?: string;
	title?: string;
}

export interface HeroSection extends SectionBase {
	type: 'hero';
	title: string;
	lead: string;
	actions?: Link[];
	/** Right-hand visual. Defaults to 'chip'. */
	visual?: 'chip' | 'terminal' | 'none';
	terminal?: { prompt?: boolean; text: string }[];
}

export interface MarqueeSection extends SectionBase {
	type: 'marquee';
	items: string[];
	/** Seconds for one full loop. */
	speed?: number;
}

export interface ServicesSection extends SectionBase {
	type: 'services';
}

export interface ProjectsSection extends SectionBase {
	type: 'projects';
	limit?: number;
	onlyFeatured?: boolean;
}

export interface AppsSection extends SectionBase {
	type: 'apps';
	limit?: number;
}

export interface SkillsSection extends SectionBase {
	type: 'skills';
	groups: { label: string; items: string[] }[];
}

export interface AboutSection extends SectionBase {
	type: 'about';
	paragraphs: string[];
	facts?: { label: string; value: string }[];
}

export interface ContactSection extends SectionBase {
	type: 'contact';
	lead?: string;
}

export interface MarkdownSection extends SectionBase {
	type: 'markdown';
	/** Slug of a file in `content/pages/` whose body is rendered inline. */
	page: string;
}

export type HomeSection =
	| HeroSection
	| MarqueeSection
	| ServicesSection
	| ProjectsSection
	| AppsSection
	| SkillsSection
	| AboutSection
	| ContactSection
	| MarkdownSection;
