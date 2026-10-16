<script lang="ts">
	import type { SectionProps } from './registry';
	import type { MarqueeSection } from './types';

	let { section }: SectionProps<MarqueeSection> = $props();
</script>

<section class="marquee" id={section.id} aria-label={section.items.join(', ')}>
	<div class="track" style="--speed: {section.speed ?? 40}s" aria-hidden="true">
		{#each [0, 1] as copy (copy)}
			<ul>
				{#each section.items as item (item)}
					<li>{item}</li>
				{/each}
			</ul>
		{/each}
	</div>
</section>

<style>
	.marquee {
		overflow: hidden;
		border-block: 1px solid var(--border);
		background: var(--bg-elev);
		padding-block: 22px;
		mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
	}
	.track {
		display: flex;
		width: max-content;
		animation: scroll var(--speed) linear infinite;
	}
	.marquee:hover .track {
		animation-play-state: paused;
	}
	ul {
		display: flex;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	li {
		display: flex;
		align-items: center;
		font-family: var(--font-display);
		font-size: clamp(1.4rem, 3vw, 2.2rem);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.02em;
		color: var(--text-faint);
		white-space: nowrap;
		transition: color 0.2s;
	}
	li:hover {
		color: var(--text);
	}
	/* A pad-shaped separator between items. */
	li::after {
		content: '';
		width: 12px;
		height: 22px;
		margin-inline: clamp(24px, 4vw, 48px);
		background: var(--accent);
		border-radius: 2px;
		opacity: 0.8;
	}
	@keyframes scroll {
		to {
			transform: translateX(-50%);
		}
	}
</style>
