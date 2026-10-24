<script lang="ts">
	/**
	 * Shows `src` if given, otherwise a generated board: a bus of traces fanning into an
	 * IC that carries the entry's initials. Layout varies per `seed`, so cards look
	 * distinct even before you have photos.
	 */
	let { src, alt = '', seed, label }: { src?: string; alt?: string; seed: string; label?: string } =
		$props();

	function hash(s: string) {
		let h = 2166136261;
		for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
		return h >>> 0;
	}

	const board = $derived.by(() => {
		let h = hash(seed);
		const rnd = () => {
			h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
			return (h % 1000) / 1000;
		};
		const pins = 4 + Math.floor(rnd() * 3);
		const pitch = 14;
		const chip = { x: 236 + Math.round(rnd() * 30), w: 92, h: pins * pitch + 18 };
		const cy = 100;
		const top = cy - chip.h / 2;
		const end = chip.x - 34; // every diagonal finishes here, so the fan never crosses
		const spread = 1.7 + rnd() * 0.8;
		const left = Array.from({ length: pins }, (_, k) => {
			const py = top + 9 + pitch / 2 + k * pitch;
			const sy = Math.round(cy + (py - cy) * spread);
			const dy = py - sy;
			return { d: `M0 ${sy}H${end - Math.abs(dy)}L${end} ${py}H${chip.x}`, sy, py };
		});
		// Right side fans outwards from the centre line, so these never cross either.
		const rx = chip.x + chip.w + 16 + Math.round(rnd() * 20);
		const jog = 10 + Math.round(rnd() * 20);
		const right = Array.from({ length: 2 + Math.floor(rnd() * 2) }, (_, k) => {
			const py = top + 9 + pitch / 2 + k * pitch * 2;
			const dy = (py < cy ? -1 : 1) * jog;
			return `M${chip.x + chip.w} ${py}H${rx}l${jog} ${dy}H400`;
		});
		const initials = (alt || seed)
			.split(/[\s-]+/)
			.filter((w) => /^[A-Za-z0-9]/.test(w))
			.map((w) => w[0].toUpperCase())
			.slice(0, 2)
			.join('');
		return { left, right, chip: { ...chip, y: top }, pitch, initials };
	});
</script>

<div class="cover">
	{#if src}
		<img {src} {alt} loading="lazy" decoding="async" />
	{:else}
		<svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
			<defs>
				<pattern id="dots-{seed}" width="16" height="16" patternUnits="userSpaceOnUse">
					<circle cx="2" cy="2" r="1" fill="var(--border-strong)" />
				</pattern>
			</defs>
			<rect width="400" height="200" fill="url(#dots-{seed})" />
			<g class="traces">
				{#each board.left as t, i (i)}
					<path d={t.d} />
					<circle cx="14" cy={t.sy} r="3.2" class="via" />
				{/each}
				{#each board.right as d, i (i)}<path {d} />{/each}
			</g>
			{#each board.left as t, i (i)}
				<rect x={board.chip.x - 7} y={t.py - 2.5} width="8" height="5" class="pin" />
			{/each}
			<rect
				x={board.chip.x}
				y={board.chip.y}
				width={board.chip.w}
				height={board.chip.h}
				rx="4"
				class="ic"
			/>
			<circle cx={board.chip.x + 10} cy={board.chip.y + 10} r="2.5" class="pin1" />
			<text x={board.chip.x + board.chip.w / 2} y={board.chip.y + board.chip.h / 2} class="mark">
				{board.initials}
			</text>
		</svg>
		{#if label}<span class="label">{label}</span>{/if}
	{/if}
</div>

<style>
	.cover {
		position: relative;
		aspect-ratio: 2 / 1;
		overflow: hidden;
		background:
			radial-gradient(80% 90% at 70% 50%, var(--accent-soft), transparent 70%),
			linear-gradient(140deg, var(--surface-2), var(--bg-elev));
		border-bottom: 1px solid var(--border);
	}
	img,
	svg {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.traces {
		fill: none;
		stroke: var(--accent);
		stroke-width: 2;
		stroke-opacity: 0.4;
		stroke-linejoin: round;
		transition: stroke-opacity 0.35s var(--ease);
	}
	:global(.project:hover) .traces {
		stroke-opacity: 0.75;
	}
	.via {
		fill: var(--surface);
		stroke-width: 1.5;
	}
	.pin {
		fill: var(--accent-2);
		opacity: 0.7;
	}
	.ic {
		fill: var(--bg);
		stroke: var(--border-strong);
	}
	.pin1 {
		fill: var(--accent);
	}
	.mark {
		fill: var(--text);
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 30px;
		letter-spacing: 0.02em;
		text-anchor: middle;
		dominant-baseline: central;
	}
	.label {
		position: absolute;
		left: 16px;
		bottom: 14px;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--text-faint);
	}
</style>
