<script lang="ts">
	import { reveal } from '#lib/actions/reveal.js';
	import SectionHeader from '#lib/components/SectionHeader.svelte';
	import type { SectionProps } from './registry';
	import type { SkillsSection } from './types';

	let { section }: SectionProps<SkillsSection> = $props();
</script>

<section class="section" id={section.id}>
	<div class="container">
		<SectionHeader eyebrow={section.eyebrow} title={section.title} />
		<div class="groups">
			{#each section.groups as group, i (group.label)}
				<div class="group" use:reveal={i * 80}>
					<h3><span>0{i + 1}</span>{group.label}</h3>
					<ul>
						{#each group.items as item (item)}<li class="chip">{item}</li>{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.groups {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		border-top: 1px solid var(--border);
	}
	.group {
		padding: 28px 28px 32px 0;
	}
	.group + .group {
		padding-left: 28px;
		border-left: 1px solid var(--border);
	}
	h3 {
		display: flex;
		align-items: baseline;
		gap: 12px;
		font-size: 1.15rem;
		margin-bottom: 18px;
	}
	h3 span {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--accent);
	}
	ul {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.chip {
		font-size: 0.82rem;
		padding: 6px 12px;
		color: var(--text);
	}
	@media (max-width: 860px) {
		.group,
		.group + .group {
			padding: 24px 0;
			border-left: 0;
			border-bottom: 1px solid var(--border);
		}
	}
</style>
