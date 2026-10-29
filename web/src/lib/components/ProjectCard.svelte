<script lang="ts">
	import type { Project } from '#lib/types.js';
	import { reveal } from '#lib/actions/reveal.js';
	import { locale } from '#lib/locale.svelte.js';
	import Cover from './Cover.svelte';
	import Icon from './Icon.svelte';

	let { project, delay = 0 }: { project: Project; delay?: number } = $props();
	const { t, href } = $derived(locale());
</script>

<a class="card project spotlight" href={href(`/projects/${project.slug}/`)} use:reveal={delay}>
	<Cover src={project.cover} alt={project.title} seed={project.slug} label={project.category} />
	<div class="body">
		<div class="meta">
			{#if project.category}<span class="chip chip-accent">{project.category}</span>{/if}
			{#if project.status}<span class="chip">{project.status}</span>{/if}
		</div>
		<h3>{project.title}</h3>
		<p class="muted">{project.summary}</p>
		{#if project.tags?.length}
			<ul class="tags">
				{#each project.tags.slice(0, 4) as tag (tag)}<li class="chip">{tag}</li>{/each}
			</ul>
		{/if}
		<span class="more">{t.readMore} <Icon name="arrow" size={16} /></span>
	</div>
</a>

<style>
	.project {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		transition:
			transform 0.35s var(--ease),
			border-color 0.35s var(--ease),
			box-shadow 0.35s var(--ease);
	}
	.project:hover {
		transform: translateY(-4px);
		border-color: color-mix(in srgb, var(--accent) 45%, transparent);
	}
	.body {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 22px 24px 24px;
		flex: 1;
	}
	.meta,
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	h3 {
		font-size: 1.3rem;
	}
	p {
		font-size: 0.97rem;
	}
	.more {
		margin-top: auto;
		padding-top: 6px;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: var(--accent);
		font-weight: 600;
		font-size: 0.92rem;
	}
	.more :global(svg) {
		transition: transform 0.25s var(--ease);
	}
	.project:hover .more :global(svg) {
		transform: translateX(4px);
	}
</style>
