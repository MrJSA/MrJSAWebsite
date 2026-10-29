<script lang="ts">
	import { reveal } from '#lib/actions/reveal.js';
	import { scramble } from '#lib/actions/scramble.js';
	import Icon from '#lib/components/Icon.svelte';
	import { site } from '#lib/config/site.js';
	import { locale } from '#lib/locale.svelte.js';
	import type { SectionProps } from './registry';
	import type { ShopSection } from './types';

	let { section }: SectionProps<ShopSection> = $props();
	const { lang } = $derived(locale());
	const lines = $derived((section.title ?? site.text[lang].shop).split('\n'));

	// The logo chip with the same pad proportions as `ChipVisual.svelte`, scaled down.
	// One side (top) is computed; the other three are the same group rotated.
	const SIZE = 300;
	const CHIP = 140;
	const C0 = (SIZE - CHIP) / 2;
	const K = CHIP / 300; // scale relative to the hero chip
	const PAD_W = 23 * K;
	const PAD_L = 46 * K;
	const PITCH = 46 * K;
	const PAD_OFFSET = 23 * K;
	const pads = Array.from({ length: 6 }, (_, i) => C0 + PAD_OFFSET + i * PITCH);
	const traces = pads.map((p, i) => {
		const x = +(p + PAD_W / 2).toFixed(2);
		const yPad = +(C0 - PAD_L).toFixed(2);
		const fan = +((x - SIZE / 2) * 0.55).toFixed(2);
		const bendY = +(yPad - 12 - Math.abs(i - 2.5) * 3).toFixed(2);
		return `M${x} ${yPad}V${bendY}l${fan} ${-Math.abs(fan)}V0`;
	});
	const sides = [0, 90, 180, 270];
</script>

<section class="section" id={section.id}>
	<div class="container">
		<div class="shop" use:reveal>
			<div class="watermark" aria-hidden="true">SHOP</div>

			<div class="copy">
				{#if section.eyebrow}<span class="eyebrow">{section.eyebrow}</span>{/if}
				<h2>
					{#each lines as line, i (i)}
						<span use:scramble={{ trigger: 'visible', delay: i * 200, speed: 26 }}>{line}</span>
					{/each}
				</h2>
				{#if section.lead}<p class="lead">{section.lead}</p>{/if}
				{#if section.features?.length}
					<ul class="features">
						{#each section.features as f (f)}
							<li><Icon name="check" size={16} />{f}</li>
						{/each}
					</ul>
				{/if}
				<div class="actions">
					<a class="btn cta" href={site.shop.href} target="_blank" rel="noopener noreferrer">
						<Icon name={site.shop.icon} size={18} />
						{section.cta ?? site.text[lang].shop}
						<Icon name="arrow" size={18} />
					</a>
				</div>
			</div>

			<svg class="visual" viewBox="0 0 {SIZE} {SIZE}" aria-hidden="true">
				{#each sides as deg, s (deg)}
					<g transform="rotate({deg} {SIZE / 2} {SIZE / 2})">
						<g class="traces">
							{#each traces as d (d)}<path {d} />{/each}
						</g>
						<g class="pulse">
							<path d={traces[s % 2 ? 1 : 4]} style="--i:{s}" />
						</g>
						<g class="pins">
							{#each pads as x (x)}
								<rect {x} y={C0 - PAD_L} width={PAD_W} height={PAD_L} />
							{/each}
						</g>
					</g>
				{/each}
				<defs>
					<linearGradient id="shop-sheen" x1="0" y1="0" x2="1" y2="1">
						<stop offset="0" stop-color="#fff" stop-opacity="0.14" />
						<stop offset="0.45" stop-color="#fff" stop-opacity="0" />
					</linearGradient>
				</defs>
				<!-- Chip body styled like the logo chip, labelled in the same silkscreen lettering. -->
				<rect class="body" x={C0} y={C0} width={CHIP} height={CHIP} />
				<rect x={C0} y={C0} width={CHIP} height={CHIP} fill="url(#shop-sheen)" />
				<circle class="pin1" cx={C0 + 18} cy={C0 + 18} r="5" />
				<text x={SIZE / 2} y={SIZE / 2}>SHOP</text>
			</svg>
		</div>
	</div>
</section>

<style>
	@property --angle {
		syntax: '<angle>';
		initial-value: 0deg;
		inherits: false;
	}

	/* A slice of the logo's green PCB, lit from the top left. */
	.shop {
		--silk: var(--brand-silk);
		--silk-muted: color-mix(in srgb, var(--brand-silk) 74%, transparent);
		position: relative;
		isolation: isolate;
		overflow: hidden;
		display: grid;
		grid-template-columns: 1.15fr 1fr;
		align-items: center;
		gap: clamp(24px, 5vw, 64px);
		padding: clamp(28px, 6vw, 72px);
		border-radius: var(--radius-lg);
		color: var(--silk);
		background:
			radial-gradient(700px 420px at 0% 0%, rgb(255 255 255 / 0.12), transparent 70%),
			radial-gradient(color-mix(in srgb, var(--brand-silk) 13%, transparent) 1px, transparent 1.4px) 0 0 /
				22px 22px,
			linear-gradient(135deg, var(--brand-board), var(--brand-board-dark));
		box-shadow:
			0 30px 80px -30px color-mix(in srgb, var(--brand-trace) 70%, transparent),
			0 0 0 1px rgb(255 255 255 / 0.08) inset;
	}
	/* A highlight that keeps orbiting the card's edge. */
	.shop::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 1;
		padding: 1.5px;
		border-radius: inherit;
		background: conic-gradient(
			from var(--angle),
			transparent 0 65%,
			color-mix(in srgb, var(--brand-silk) 85%, transparent) 82%,
			transparent 92%
		);
		-webkit-mask:
			linear-gradient(#000 0 0) content-box,
			linear-gradient(#000 0 0);
		-webkit-mask-composite: xor;
		mask:
			linear-gradient(#000 0 0) content-box,
			linear-gradient(#000 0 0);
		mask-composite: exclude;
		animation: orbit 6s linear infinite;
		pointer-events: none;
	}
	@keyframes orbit {
		to {
			--angle: 360deg;
		}
	}
	.watermark {
		position: absolute;
		z-index: -1;
		right: -0.06em;
		bottom: -0.2em;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(7rem, 22vw, 17rem);
		line-height: 1;
		color: transparent;
		-webkit-text-stroke: 1px color-mix(in srgb, var(--brand-silk) 16%, transparent);
		user-select: none;
	}

	.eyebrow {
		color: var(--silk);
	}
	h2 {
		margin-top: 16px;
		font-size: clamp(2.2rem, 5vw, 3.6rem);
		font-weight: 700;
		letter-spacing: -0.03em;
		line-height: 1.02;
	}
	h2 span {
		display: block;
	}
	.lead {
		margin-top: 20px;
		max-width: 46ch;
		font-size: 1.1rem;
		color: var(--silk-muted);
	}
	.features {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin: 26px 0 0;
		padding: 0;
		list-style: none;
	}
	.features li {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		padding: 6px 12px;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--brand-silk) 22%, transparent);
		background: rgb(0 0 0 / 0.18);
		font-size: 0.86rem;
		font-weight: 500;
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 14px 20px;
		margin-top: 34px;
	}
	.cta {
		--btn-bg: var(--brand-silk);
		--btn-fg: var(--brand-board-dark);
		height: 54px;
		padding: 0 26px;
		font-size: 1.02rem;
		border-color: transparent;
	}
	.cta:hover {
		border-color: transparent;
		box-shadow:
			0 0 0 4px rgb(255 255 255 / 0.18),
			0 14px 40px -10px rgb(0 0 0 / 0.6);
	}
	.cta :global(svg:last-child) {
		transition: transform 0.25s var(--ease);
	}
	.cta:hover :global(svg:last-child) {
		transform: translateX(4px);
	}

	.visual {
		width: 100%;
		max-width: 400px;
		justify-self: center;
		overflow: visible;
		filter: drop-shadow(0 24px 30px rgb(0 0 0 / 0.35));
		transition: transform 0.6s var(--ease);
	}
	.shop:hover .visual {
		transform: translateY(-6px) rotate(-1.5deg);
	}
	.traces path,
	.pulse path {
		fill: none;
		stroke-width: 2.6;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.traces path {
		stroke: var(--brand-trace);
	}
	.pulse path {
		stroke: var(--brand-silk);
		stroke-width: 2;
		stroke-dasharray: 16 220;
		stroke-dashoffset: 0;
		animation: travel 3.2s linear infinite;
		animation-delay: calc(var(--i) * -0.8s);
		filter: drop-shadow(0 0 5px var(--brand-silk));
	}
	@keyframes travel {
		to {
			stroke-dashoffset: -236;
		}
	}
	.pins rect {
		fill: var(--brand-pad);
	}
	.body {
		fill: var(--brand-chip);
		stroke: rgb(255 255 255 / 0.12);
	}
	.pin1 {
		fill: var(--brand-silk);
	}
	text {
		fill: var(--brand-silk);
		font-family: var(--font-display);
		font-size: 44px;
		font-weight: 700;
		letter-spacing: 0.02em;
		text-anchor: middle;
		dominant-baseline: central;
	}

	@media (max-width: 860px) {
		.shop {
			grid-template-columns: 1fr;
		}
		.visual {
			max-width: 300px;
			grid-row: 1;
		}
	}
</style>
