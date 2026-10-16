<script lang="ts">
	import type { SectionProps } from './registry';
	import type { MarqueeSection } from './types';

	let { section }: SectionProps<MarqueeSection> = $props();

	// The second row runs the other way, in outline, with the items in reverse order.
	const rows = $derived(
		(section.rows ?? 2) === 2 ? [section.items, [...section.items].reverse()] : [section.items]
	);
</script>

<section class="marquee" id={section.id} aria-label={section.items.join(', ')}>
	{#each rows as items, r (r)}
		<div
			class="track"
			class:reverse={r === 1}
			style="--speed: {(section.speed ?? 40) * (r === 1 ? 1.25 : 1)}s"
			aria-hidden="true"
		>
			{#each [0, 1] as copy (copy)}
				<ul>
					{#each items as item (item)}
						<li>{item}</li>
					{/each}
				</ul>
			{/each}
		</div>
	{/each}
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
	.track.reverse {
		margin-top: 10px;
		animation-direction: reverse;
	}
	.reverse li {
		color: transparent;
		-webkit-text-stroke: 1px var(--border-strong);
	}
	.reverse li:hover {
		-webkit-text-stroke-color: var(--accent);
	}
	.reverse li::after {
		background: transparent;
		border: 1.5px solid var(--accent);
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
