<script lang="ts">
	import { reveal } from '#lib/actions/reveal.js';
	import type { SectionProps } from './registry';
	import type { AboutSection } from './types';

	let { section }: SectionProps<AboutSection> = $props();
</script>

<section class="section" id={section.id}>
	<div class="container grid">
		<div use:reveal>
			{#if section.eyebrow}<span class="eyebrow">{section.eyebrow}</span>{/if}
			{#if section.title}<h2 class="section-title">{section.title}</h2>{/if}
		</div>
		<div class="text" use:reveal={100}>
			{#each section.paragraphs as p, i (i)}<p>{p}</p>{/each}
			{#if section.facts?.length}
				<dl>
					{#each section.facts as f (f.label)}
						<div>
							<dt>{f.label}</dt>
							<dd>{f.value}</dd>
						</div>
					{/each}
				</dl>
			{/if}
		</div>
	</div>
</section>

<style>
	.grid {
		display: grid;
		grid-template-columns: 0.9fr 1.1fr;
		gap: clamp(24px, 6vw, 80px);
	}
	.text {
		display: grid;
		gap: 18px;
		font-size: 1.1rem;
		color: var(--text-muted);
	}
	.text p:first-child {
		color: var(--text);
		font-size: 1.25rem;
		line-height: 1.55;
	}
	dl {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 16px;
		margin: 18px 0 0;
		padding-top: 24px;
		border-top: 1px solid var(--border);
	}
	dt {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--text-faint);
	}
	dd {
		margin: 6px 0 0;
		color: var(--text);
		font-weight: 550;
		font-size: 1rem;
	}
	@media (max-width: 860px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
