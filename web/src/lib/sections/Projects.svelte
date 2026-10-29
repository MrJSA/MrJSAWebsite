<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import ProjectCard from '#lib/components/ProjectCard.svelte';
	import SectionHeader from '#lib/components/SectionHeader.svelte';
	import { locale } from '#lib/locale.svelte.js';
	import type { SectionProps } from './registry';
	import type { ProjectsSection } from './types';

	let { section, data }: SectionProps<ProjectsSection> = $props();
	const { t, href } = $derived(locale());

	const all = $derived(
		section.onlyFeatured ? data.projects.filter((p) => p.featured) : data.projects
	);
	const shown = $derived(all.slice(0, section.limit ?? 6));
</script>

{#if shown.length}
	<section class="section" id={section.id}>
		<div class="container">
			<SectionHeader eyebrow={section.eyebrow} title={section.title}>
				<a class="btn" href={href('/projects/')}>{t.allProjects} <Icon name="arrow" size={16} /></a>
			</SectionHeader>
			<div class="grid">
				{#each shown as project, i (project.slug)}
					<ProjectCard {project} delay={(i % 3) * 80} />
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
		gap: 20px;
	}
</style>
