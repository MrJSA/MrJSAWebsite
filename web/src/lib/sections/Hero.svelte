<script lang="ts">
	import ChipVisual from '#lib/components/ChipVisual.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import { scramble } from '#lib/actions/scramble.js';
	import type { SectionProps } from './registry';
	import type { HeroSection } from './types';

	let { section }: SectionProps<HeroSection> = $props();
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

	<div class="container inner">
		<div class="copy">
			{#if section.eyebrow}<span class="eyebrow">{section.eyebrow}</span>{/if}
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
						<a class="btn" class:btn-primary={i === 0} href={a.href}>
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
			<div class="terminal card" aria-label="Example workflow">
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
		background: linear-gradient(95deg, var(--accent) 10%, var(--accent-2) 90%);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		padding-bottom: 0.08em;
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
