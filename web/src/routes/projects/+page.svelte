<script lang="ts">
	import ProjectCard from '#lib/components/ProjectCard.svelte';
	import SectionHeader from '#lib/components/SectionHeader.svelte';
	import Seo from '#lib/components/Seo.svelte';

	let { data } = $props();

	const categories = $derived([
		...new Set(data.projects.map((p) => p.category).filter((c): c is string => !!c))
	]);
	let active = $state<string | null>(null);
	const shown = $derived(
		active ? data.projects.filter((p) => p.category === active) : data.projects
	);
</script>

<Seo
	title="Projects"
	description="PCB designs, embedded firmware, apps and web services by MrJSA Technologies — hardware and software projects engineered end to end."
/>

<section class="section">
	<div class="container">
		<SectionHeader eyebrow="Portfolio" title="Projects" level={1} />

		{#if categories.length > 1}
			<div class="filters" role="group" aria-label="Filter by category">
				<button class:on={active === null} onclick={() => (active = null)}>All</button>
				{#each categories as c (c)}
					<button class:on={active === c} onclick={() => (active = c)}>{c}</button>
				{/each}
			</div>
		{/if}

		{#if shown.length}
			<div class="grid">
				{#each shown as project, i (project.slug)}
					<ProjectCard {project} delay={(i % 3) * 80} />
				{/each}
			</div>
		{:else}
			<p class="muted">Nothing here yet — check back soon.</p>
		{/if}
	</div>
</section>

<style>
	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin: -24px 0 32px;
	}
	.filters button {
		padding: 8px 16px;
		border-radius: 999px;
		border: 1px solid var(--border);
		background: transparent;
		color: var(--text-muted);
		font: inherit;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s var(--ease);
	}
	.filters button:hover {
		color: var(--text);
		border-color: var(--border-strong);
	}
	.filters button.on {
		background: var(--accent);
		border-color: var(--accent);
		color: var(--accent-ink);
		font-weight: 600;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
		gap: 20px;
	}
</style>
