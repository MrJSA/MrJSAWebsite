<script lang="ts">
	/**
	 * The MrJSA Technologies logo as a living PCB: pads and traces are drawn in SVG
	 * (proportions taken from the logo) with signal pulses running along the traces;
	 * the chip body is the original artwork (`/chip.webp`). Tilts towards the pointer.
	 */
	const SIZE = 600;
	const CHIP = 300; // chip body edge length
	const C0 = (SIZE - CHIP) / 2; // chip offset
	const PAD_W = 23;
	const PAD_L = 46;
	const PITCH = 46;
	const PAD_OFFSET = 23; // first pad's distance from the chip corner

	// One side's traces (top); the other three sides are the same group rotated.
	const traces = Array.from({ length: 6 }, (_, i) => {
		const x = C0 + PAD_OFFSET + PAD_W / 2 + i * PITCH;
		const yPad = C0 - PAD_L;
		const fan = (x - SIZE / 2) * 0.55;
		const bendY = yPad - 26 - Math.abs(i - 2.5) * 6;
		return `M${x} ${yPad}V${bendY}l${fan} ${-Math.abs(fan)}V0`;
	});
	const pads = Array.from({ length: 6 }, (_, i) => C0 + PAD_OFFSET + i * PITCH);
	const sides = [0, 90, 180, 270];

	let rx = $state(0);
	let ry = $state(0);
	let reduce = false;

	$effect(() => {
		reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
	});

	function tilt(e: PointerEvent) {
		if (reduce || e.pointerType !== 'mouse') return;
		const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
		ry = ((e.clientX - r.left) / r.width - 0.5) * 14;
		rx = -((e.clientY - r.top) / r.height - 0.5) * 14;
	}
</script>

<div
	class="stage"
	role="img"
	aria-label="MrJSA Technologies logo: a microchip on a circuit board"
	onpointermove={tilt}
	onpointerleave={() => ((rx = 0), (ry = 0))}
>
	<div class="board" style="transform: rotateX({rx}deg) rotateY({ry}deg)">
		<svg viewBox="0 0 {SIZE} {SIZE}" aria-hidden="true">
			<defs>
				<radialGradient id="cv-light" cx="30%" cy="20%" r="90%">
					<stop offset="0" stop-color="#fff" stop-opacity="0.10" />
					<stop offset="1" stop-color="#000" stop-opacity="0.25" />
				</radialGradient>
				<linearGradient id="cv-sheen" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stop-color="#fff" stop-opacity="0.14" />
					<stop offset="0.45" stop-color="#fff" stop-opacity="0" />
				</linearGradient>
				<filter id="cv-glow" x="-50%" y="-50%" width="200%" height="200%">
					<feGaussianBlur stdDeviation="4" result="b" />
					<feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
				</filter>
			</defs>

			<rect width={SIZE} height={SIZE} fill="var(--brand-board)" />

			{#each sides as deg (deg)}
				<g transform="rotate({deg} {SIZE / 2} {SIZE / 2})">
					{#each traces as d, i (i)}
						<path {d} class="trace-edge" />
						<path {d} class="trace" />
						<path
							{d}
							class="pulse"
							filter="url(#cv-glow)"
							style="--d: {((i * 7 + deg / 30) % 11) * -0.55}s; --t: {3.2 + ((i + deg / 90) % 4) * 0.7}s"
						/>
					{/each}
					{#each pads as x (x)}
						<rect {x} y={C0 - PAD_L} width={PAD_W} height={PAD_L + 2} class="pad" />
					{/each}
				</g>
			{/each}

			<rect x={C0} y={C0} width={CHIP} height={CHIP} fill="var(--brand-chip)" />
			<image href="/chip.webp" x={C0} y={C0} width={CHIP} height={CHIP} />
			<rect x={C0} y={C0} width={CHIP} height={CHIP} fill="url(#cv-sheen)" />
			<rect width={SIZE} height={SIZE} fill="url(#cv-light)" />
		</svg>
	</div>
</div>

<style>
	.stage {
		perspective: 1100px;
		width: 100%;
		max-width: 520px;
		margin-inline: auto;
		animation: float 7s ease-in-out infinite;
	}
	.board {
		position: relative;
		aspect-ratio: 1;
		border-radius: 28px;
		overflow: hidden;
		border: 1px solid rgb(255 255 255 / 0.1);
		box-shadow:
			0 40px 80px -30px rgb(0 0 0 / 0.7),
			0 0 120px -20px color-mix(in srgb, var(--brand-trace) 55%, transparent);
		transition: transform 0.4s var(--ease);
		transform-style: preserve-3d;
	}
	svg {
		width: 100%;
		height: 100%;
	}
	.trace-edge {
		fill: none;
		stroke: var(--brand-board-dark);
		stroke-width: 13;
		stroke-linejoin: miter;
	}
	.trace {
		fill: none;
		stroke: var(--brand-trace);
		stroke-width: 6;
		stroke-linejoin: miter;
	}
	.pulse {
		fill: none;
		stroke: #7dff8a;
		stroke-width: 4;
		stroke-linecap: round;
		stroke-dasharray: 18 400;
		stroke-dashoffset: 0;
		animation: pulse var(--t) linear infinite;
		animation-delay: var(--d);
	}
	.pad {
		fill: var(--brand-pad);
	}
	@keyframes pulse {
		from {
			stroke-dashoffset: 0;
		}
		to {
			stroke-dashoffset: 418;
		}
	}
	@keyframes float {
		50% {
			translate: 0 -10px;
		}
	}
</style>
