<script lang="ts">
	import { reveal } from '#lib/actions/reveal.js';
	import Icon from '#lib/components/Icon.svelte';
	import SectionHeader from '#lib/components/SectionHeader.svelte';
	import type { SectionProps } from './registry';
	import type { ServicesSection } from './types';

	let { section, data }: SectionProps<ServicesSection> = $props();
</script>

{#if data.services.length}
	<section class="section" id={section.id}>
		<div class="container">
			<SectionHeader eyebrow={section.eyebrow} title={section.title} />
			<div class="grid">
				{#each data.services as s, i (s.slug)}
					<article class="card service spotlight" use:reveal={i * 80}>
						<span class="num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
						<div class="icon"><Icon name={s.icon ?? 'layers'} size={24} /></div>
						<h3>{s.title}</h3>
						<p class="muted">{s.summary}</p>
						{#if s.html.trim()}
							<div class="details">{@html s.html}</div>
						{/if}
					</article>
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	/* Bento: wide, narrow / narrow, wide — repeats for any number of services. */
	.grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
	}
	.service:nth-child(4n + 1),
	.service:nth-child(4n + 4) {
		grid-column: span 2;
	}
	@media (max-width: 860px) {
		.grid {
			grid-template-columns: minmax(0, 1fr);
		}
		.service:nth-child(n) {
			grid-column: auto;
		}
	}
	.num {
		position: absolute;
		top: 18px;
		right: 24px;
		font-family: var(--font-display);
		font-size: 3.6rem;
		font-weight: 700;
		line-height: 1;
		color: transparent;
		-webkit-text-stroke: 1px var(--border-strong);
		transition: -webkit-text-stroke-color 0.3s;
	}
	.service:hover .num {
		-webkit-text-stroke-color: var(--accent);
	}
	.service {
		padding: 32px 30px;
		overflow: hidden;
		transition:
			border-color 0.3s var(--ease),
			transform 0.3s var(--ease);
	}
	.service::after {
		content: '';
		position: absolute;
		inset: 0 0 auto;
		height: 2px;
		background: linear-gradient(90deg, var(--accent), var(--accent-2));
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.5s var(--ease);
	}
	.service:hover {
		transform: translateY(-3px);
		border-color: var(--border-strong);
	}
	.service:hover::after {
		transform: scaleX(1);
	}
	.icon {
		display: grid;
		place-items: center;
		width: 48px;
		height: 48px;
		border-radius: 12px;
		background: var(--accent-soft);
		color: var(--accent);
		margin-bottom: 22px;
	}
	h3 {
		font-size: 1.2rem;
		margin-bottom: 10px;
	}
	p {
		font-size: 0.96rem;
	}
	.details {
		margin-top: 16px;
		font-size: 0.9rem;
		color: var(--text-muted);
	}
	.details :global(ul) {
		margin: 0;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 6px;
	}
	.details :global(li) {
		position: relative;
		padding-left: 18px;
	}
	.details :global(li)::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.6em;
		width: 7px;
		height: 7px;
		border-radius: 2px;
		border: 1.5px solid var(--accent);
	}
</style>
