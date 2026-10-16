import type { Component } from 'svelte';
import type { Collections } from '#lib/types.js';
import type { HomeSection } from './types';
import About from './About.svelte';
import Apps from './Apps.svelte';
import Contact from './Contact.svelte';
import Hero from './Hero.svelte';
import Markdown from './Markdown.svelte';
import Marquee from './Marquee.svelte';
import Projects from './Projects.svelte';
import Services from './Services.svelte';
import Skills from './Skills.svelte';

export interface SectionProps<T extends HomeSection = HomeSection> {
	section: T;
	data: Collections;
}

/** Maps a section `type` (used in `site.ts` → `home`) to its component. */
export const sections: Record<HomeSection['type'], Component<SectionProps<any>>> = {
	hero: Hero,
	marquee: Marquee,
	services: Services,
	projects: Projects,
	apps: Apps,
	skills: Skills,
	about: About,
	contact: Contact,
	markdown: Markdown
};
