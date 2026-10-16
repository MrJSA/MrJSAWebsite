<script lang="ts">
	import { reveal } from '#lib/actions/reveal.js';
	import Icon from '#lib/components/Icon.svelte';
	import { site } from '#lib/config/site.js';
	import type { SectionProps } from './registry';
	import type { ContactSection } from './types';

	let { section }: SectionProps<ContactSection> = $props();
</script>

<section class="section" id={section.id}>
	<div class="container">
		<div class="panel card" use:reveal>
			<div>
				{#if section.eyebrow}<span class="eyebrow">{section.eyebrow}</span>{/if}
				{#if section.title}<h2 class="section-title">{section.title}</h2>{/if}
				{#if section.lead}<p class="lead muted">{section.lead}</p>{/if}
			</div>
			<div class="actions">
				<a class="btn btn-primary" href="mailto:{site.email}">
					<Icon name="mail" size={18} />
					{site.email}
				</a>
				{#each site.socials as s (s.href)}
					<a class="btn" href={s.href} target="_blank" rel="noopener noreferrer">
						<Icon name={s.icon ?? 'globe'} size={18} />
						{s.label}
					</a>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.panel {
		display: grid;
		grid-template-columns: 1.3fr 1fr;
		align-items: end;
		gap: 32px;
		padding: clamp(28px, 6vw, 64px);
		overflow: hidden;
		background:
			radial-gradient(600px 300px at 100% 0%, var(--accent-soft), transparent 70%),
			var(--surface);
	}
	.lead {
		margin-top: 18px;
		max-width: 48ch;
		font-size: 1.1rem;
	}
	.actions {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 12px;
	}
	.actions .btn {
		height: 52px;
		word-break: break-all;
	}
	@media (max-width: 860px) {
		.panel {
			grid-template-columns: 1fr;
		}
	}
</style>
