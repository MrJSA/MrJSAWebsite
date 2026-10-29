<script lang="ts">
	import ChipVisual from '#lib/components/ChipVisual.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import { scramble } from '#lib/actions/scramble.js';
	import { locale } from '#lib/locale.svelte.js';
	import type { SectionProps } from './registry';
	import type { HeroSection } from './types';

	let { section }: SectionProps<HeroSection> = $props();
	const { t, href } = $derived(locale());
	const lines = $derived(section.title.split('\n'));

	// Cursor position inside the hero — drives the lit-up grid around the pointer.
	let hero: HTMLElement;
	let lit = $state(false);
	let raf = 0;
	function track(e: PointerEvent) {
		if (e.pointerType !== 'mouse') return;
		cancelAnimationFrame(raf);
		raf = requestAnimationFrame(() => {
			const r = hero.getBoundingClientRect();
			hero.style.setProperty('--hx', `${e.clientX - r.left}px`);
			hero.style.setProperty('--hy', `${e.clientY - r.top}px`);
			lit = true;
		});
	}
	const unlight = () => (lit = false);

	// Purely decorative, so listeners are attached here rather than as element handlers.
	$effect(() => {
		hero.addEventListener('pointermove', track);
		hero.addEventListener('pointerleave', unlight);
		return () => {
			hero.removeEventListener('pointermove', track);
			hero.removeEventListener('pointerleave', unlight);
		};
	});
</script>

<section class="hero" class:lit id={section.id} bind:this={hero}>
	<div class="dots" aria-hidden="true"></div>
	<div class="dots dots-lit" aria-hidden="true"></div>
	<svg class="circuit" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
		<defs>
			<radialGradient id="hero-fade" cx="70%" cy="35%" r="70%">
				<stop offset="0" stop-color="#fff" />
				<stop offset="1" stop-color="#000" />
			</radialGradient>
			<mask id="hero-mask"><rect width="1200" height="700" fill="url(#hero-fade)" /></mask>
		</defs>
		<g mask="url(#hero-mask)" fill="none" stroke="var(--trace)" stroke-width="2">
			<path d="M640 0v120l60 60h220l40 40v160" />
			<path d="M1200 140H980l-40 40v60" />
			<path d="M700 700V560l50-50h160l60-60V300" />
			<path d="M1200 420h-120l-40-40" />
			<path d="M560 700V600l40-40h60" />
			<path d="M1200 600h-260l-60 60v40" />
			<path d="M820 0v60l40 40h200" />
			<g class="pulse">
				<path d="M640 0v120l60 60h220l40 40v160" />
				<path d="M700 700V560l50-50h160l60-60V300" />
				<path d="M1200 140H980l-40 40v60" />
			</g>
		</g>
		<g mask="url(#hero-mask)" fill="var(--bg)" stroke="var(--accent)" stroke-width="2" opacity="0.7">
			<circle cx="960" cy="380" r="6" />
			<circle cx="970" cy="300" r="6" />
			<circle cx="940" cy="240" r="6" />
			<circle cx="1040" cy="380" r="5" />
			<circle cx="660" cy="560" r="5" />
			<circle cx="1060" cy="100" r="5" />
		</g>
	</svg>
	<div class="glow" aria-hidden="true"></div>
	<div class="glow glow-2" aria-hidden="true"></div>

	<div class="container inner">
		<div class="copy">
			{#if section.badge}
				<a class="badge" href={href(section.badge.href)}>
					{#if section.badge.tag}<span class="badge-tag">{section.badge.tag}</span>{/if}
					<span>{section.badge.label}</span>
					<Icon name="arrow" size={14} />
				</a>
			{:else if section.eyebrow}
				<span class="eyebrow">{section.eyebrow}</span>
			{/if}
			<h1>
				{#each lines as line, i (i)}
					<span
						class:grad={i === lines.length - 1}
						data-scramble
						use:scramble={{ delay: 150 + i * 280, speed: 34 }}>{line}</span
					>
				{/each}
			</h1>
			<p class="lead">{section.lead}</p>
			{#if section.actions?.length}
				<div class="actions">
					{#each section.actions as a, i (a.href)}
						{@const external = a.href.startsWith('http')}
						<a
							class="btn"
							class:btn-primary={i === 0}
							class:btn-ghost={i > 0}
							href={href(a.href)}
							target={external ? '_blank' : undefined}
							rel={external ? 'noopener noreferrer' : undefined}
						>
							{#if a.icon}<Icon name={a.icon} size={18} />{/if}
							{a.label}
							{#if i === 0}<Icon name="arrow" size={18} />{/if}
						</a>
					{/each}
				</div>
			{/if}
		</div>

		{#if (section.visual ?? 'chip') === 'chip'}
			<ChipVisual />
		{:else if section.visual === 'terminal' && section.terminal?.length}
			<div class="terminal card" aria-label={t.terminalLabel}>
				<div class="term-bar">
					<span></span><span></span><span></span>
					<em>~/workbench</em>
				</div>
				<pre>{#each section.terminal as line, i (i)}<code
							class:prompt={line.prompt}
							style="--i:{i}">{line.text}</code
						>
{/each}<code class="prompt cursor" style="--i:{section.terminal.length}"></code></pre>
			</div>
		{/if}
	</div>
</section>

<style>
	.hero {
		position: relative;
		overflow: hidden;
		margin-top: calc(-1 * var(--header-h));
		padding-top: calc(var(--header-h) + clamp(56px, 10vw, 120px));
		padding-bottom: clamp(64px, 10vw, 120px);
		isolation: isolate;
		/* Opaque, so the page-wide DotField doesn't double up with the hero's own grid. */
		background: var(--bg);
	}
	/* Dot grid; an accent-coloured copy is revealed in a circle around the cursor. */
	.dots {
		position: absolute;
		inset: 0;
		z-index: -3;
		background-image: radial-gradient(var(--grid-line) 1.3px, transparent 1.6px);
		background-size: 28px 28px;
	}
	.dots-lit {
		z-index: -1;
		background-image: radial-gradient(var(--accent) 1.4px, transparent 1.7px);
		opacity: 0;
		transition: opacity 0.5s var(--ease);
		--spot: radial-gradient(
			240px circle at var(--hx, -999px) var(--hy, -999px),
			#000,
			transparent
		);
		mask-image: var(--spot);
		-webkit-mask-image: var(--spot);
	}
	.lit .dots-lit {
		opacity: 0.75;
	}
	.circuit {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: -2;
	}
	.pulse path {
		stroke: var(--accent);
		stroke-width: 2.5;
		stroke-dasharray: 60 1400;
		stroke-dashoffset: 1460;
		animation: pulse 6s linear infinite;
		filter: drop-shadow(0 0 6px var(--accent));
	}
	.pulse path:nth-child(2) {
		animation-delay: -2s;
		animation-duration: 7s;
	}
	.pulse path:nth-child(3) {
		animation-delay: -4s;
		animation-duration: 5s;
	}
	@keyframes pulse {
		to {
			stroke-dashoffset: 0;
		}
	}
	.glow {
		position: absolute;
		z-index: -1;
		width: 720px;
		height: 720px;
		right: -200px;
		top: -260px;
		border-radius: 50%;
		background: radial-gradient(closest-side, var(--accent-soft), transparent);
		filter: blur(20px);
		animation: drift 18s ease-in-out infinite alternate;
	}
	.glow-2 {
		width: 560px;
		height: 560px;
		right: auto;
		top: auto;
		left: -220px;
		bottom: -240px;
		opacity: 0.7;
		animation-duration: 23s;
		animation-direction: alternate-reverse;
	}
	@keyframes drift {
		to {
			transform: translate(-60px, 50px) scale(1.15);
		}
	}
	/* Announcement pill above the headline. */
	.badge {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 5px 14px 5px 5px;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--accent) 35%, var(--border));
		background: color-mix(in srgb, var(--surface) 70%, transparent);
		backdrop-filter: blur(8px);
		color: var(--text-muted);
		font-size: 0.88rem;
		font-weight: 500;
		transition:
			border-color 0.25s var(--ease),
			color 0.25s var(--ease),
			box-shadow 0.25s var(--ease);
	}
	.badge:hover {
		color: var(--text);
		border-color: var(--accent);
		box-shadow: var(--glow);
	}
	.badge :global(svg) {
		transition: transform 0.25s var(--ease);
	}
	.badge:hover :global(svg) {
		transform: translateX(3px);
	}
	.badge-tag {
		padding: 2px 10px;
		border-radius: 999px;
		background: var(--accent);
		color: var(--accent-ink);
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.inner {
		display: grid;
		grid-template-columns: 1.1fr 0.9fr;
		align-items: center;
		gap: clamp(32px, 6vw, 72px);
	}
	h1 {
		margin-top: 22px;
		font-size: clamp(2.6rem, 5.6vw, 4.3rem);
		font-weight: 700;
		letter-spacing: -0.035em;
		line-height: 1;
	}
	h1 span {
		display: block;
	}
	.grad {
		/* A slow highlight sweeps across the gradient line. */
		background: linear-gradient(
				100deg,
				var(--accent) 0%,
				var(--accent-2) 30%,
				var(--accent) 50%,
				var(--accent-2) 80%,
				var(--accent) 100%
			)
			0 0 / 200% 100%;
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		padding-bottom: 0.08em;
		animation: shimmer 8s linear infinite;
	}
	@keyframes shimmer {
		to {
			background-position: -200% 0;
		}
	}
	.lead {
		margin-top: 26px;
		max-width: 52ch;
		font-size: clamp(1.05rem, 1.6vw, 1.2rem);
		color: var(--text-muted);
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 36px;
	}

	.terminal {
		overflow: hidden;
		background: color-mix(in srgb, var(--bg-elev) 85%, transparent);
		backdrop-filter: blur(8px);
	}
	.term-bar {
		display: flex;
		align-items: center;
		gap: 7px;
		padding: 12px 16px;
		border-bottom: 1px solid var(--border);
	}
	.term-bar span {
		width: 11px;
		height: 11px;
		border-radius: 50%;
		background: var(--border-strong);
	}
	.term-bar em {
		margin-left: auto;
		font-style: normal;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--text-faint);
	}
	pre {
		margin: 0;
		padding: 20px 20px 24px;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		line-height: 1.9;
		white-space: pre-wrap;
		word-break: break-word;
	}
	code {
		color: var(--accent);
		opacity: 0;
		animation: type-in 0.4s var(--ease) forwards;
		animation-delay: calc(var(--i) * 0.35s + 0.3s);
	}
	code.prompt {
		color: var(--text);
	}
	code.prompt::before {
		content: '$ ';
		color: var(--accent-2);
	}
	.cursor::after {
		content: '';
		display: inline-block;
		width: 0.55em;
		height: 1.1em;
		vertical-align: text-bottom;
		background: var(--text);
		animation: blink 1.1s steps(1) infinite;
	}
	@keyframes type-in {
		from {
			opacity: 0;
			transform: translateX(-6px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}

	@media (max-width: 900px) {
		.inner {
			grid-template-columns: 1fr;
		}
	}
</style>
