<script lang="ts">
	/**
	 * A photo rendered as a green CRT signal: contrast-boosted duotone with grain, scanlines
	 * and a dithered edge that dissolves into the page. A hex rain decodes it on first view;
	 * the pointer bends the scanlines and breaks the picture into glitch blocks — the original
	 * photo is never shown. `src` must have a transparent background (alpha = silhouette).
	 */
	let { src, alt, label }: { src: string; alt: string; label?: string } =
		$props();

	const HEX = '0123456789ABCDEF';
	const FONT = '"JetBrains Mono Variable", ui-monospace, monospace';

	let wrap: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let ratio = $state(620 / 760);
	let touch = $state(false);

	/** Separable box blur on a single-channel buffer. */
	function boxBlur(src: Float32Array, w: number, h: number, r: number) {
		const tmp = new Float32Array(src.length);
		const out = new Float32Array(src.length);
		const k = 2 * r + 1;
		for (let y = 0; y < h; y++) {
			let acc = 0;
			const row = y * w;
			for (let x = -r; x <= r; x++) acc += src[row + Math.min(w - 1, Math.max(0, x))];
			for (let x = 0; x < w; x++) {
				tmp[row + x] = acc / k;
				acc += src[row + Math.min(w - 1, x + r + 1)] - src[row + Math.max(0, x - r)];
			}
		}
		for (let x = 0; x < w; x++) {
			let acc = 0;
			for (let y = -r; y <= r; y++) acc += tmp[Math.min(h - 1, Math.max(0, y)) * w + x];
			for (let y = 0; y < h; y++) {
				out[y * w + x] = acc / k;
				acc += tmp[Math.min(h - 1, y + r + 1) * w + x] - tmp[Math.max(0, y - r) * w + x];
			}
		}
		return out;
	}

	$effect(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const mq = matchMedia('(prefers-color-scheme: light)');
		const img = new Image();
		img.src = src;

		// Buffers (device pixels)
		let W = 0, H = 0, S = 1;
		let base = new Uint8Array(0); // tone 0..255
		let mask = new Uint8Array(0); // soft silhouette 0..255
		let dither = new Uint8Array(0); // static threshold noise
		let frame: ImageData | null = null;
		let out32 = new Uint32Array(0);
		const pal = new Uint32Array(256);
		const grain = new Int8Array(128 * 128).map(() => ((Math.random() * 2 - 1) * 14) | 0);
		let ink = '#25d43a', glyphHead = '#eef3ee';

		// Boot rain
		let band = 10, drops = new Float32Array(0), speeds = new Float32Array(0);
		let booting = !reduce;

		// Pointer field
		let mx = 0, my = 0, lens = 0, lensTarget = 0, hideAt = 0;

		// Random glitch slices
		let glitchUntil = 0, nextGlitch = performance.now() + 2500;
		let slices: { y: number; h: number; dx: number }[] = [];

		let visible = false, raf = 0, last = 0, lastPaint = 0;

		function rgb(color: string): [number, number, number] {
			const c = document.createElement('canvas').getContext('2d')!;
			c.fillStyle = color;
			c.fillRect(0, 0, 1, 1);
			const d = c.getImageData(0, 0, 1, 1).data;
			return [d[0], d[1], d[2]];
		}

		function buildPalette() {
			const cs = getComputedStyle(wrap);
			const v = (n: string, f: string) => cs.getPropertyValue(n).trim() || f;
			ink = v('--accent', ink);
			glyphHead = v('--text', glyphHead);
			const theme = document.documentElement.dataset.theme;
			const dark = theme === 'dark' || (theme !== 'light' && !mq.matches);
			const a = rgb(ink);
			const board = rgb(v('--brand-board', '#005605'));
			const stops: [number, number, number][] = dark
				? [[2, 8, 3], board, a, [a[0] + (255 - a[0]) * 0.75, a[1] + (255 - a[1]) * 0.75, a[2] + (255 - a[2]) * 0.75]]
				: [[3, 26, 6], board, a, [a[0] + (255 - a[0]) * 0.8, a[1] + (255 - a[1]) * 0.8, a[2] + (255 - a[2]) * 0.8]];
			const pos = dark ? [0, 0.5, 0.86, 1] : [0, 0.3, 0.65, 1];
			for (let i = 0; i < 256; i++) {
				const t = i / 255;
				let s = 0;
				while (s < stops.length - 2 && t > pos[s + 1]) s++;
				const f = (t - pos[s]) / (pos[s + 1] - pos[s]);
				const c = stops[s].map((c0, k) => Math.round(c0 + (stops[s + 1][k] - c0) * f));
				pal[i] = (255 << 24) | (c[2] << 16) | (c[1] << 8) | c[0];
			}
		}

		function build() {
			if (!img.naturalWidth) return;
			ratio = img.naturalWidth / img.naturalHeight;
			const cssW = wrap.clientWidth;
			const cssH = Math.round(cssW / ratio);
			S = Math.min(devicePixelRatio || 1, 1.5);
			W = Math.round(cssW * S);
			H = Math.round(cssH * S);
			canvas.width = W;
			canvas.height = H;

			const off = document.createElement('canvas');
			off.width = W;
			off.height = H;
			const o = off.getContext('2d', { willReadFrequently: true })!;
			o.imageSmoothingQuality = 'high';
			o.drawImage(img, 0, 0, W, H);
			const px = o.getImageData(0, 0, W, H).data;

			const n = W * H;
			const lum = new Float32Array(n);
			const alpha = new Float32Array(n);
			const seen: number[] = [];
			for (let i = 0; i < n; i++) {
				lum[i] = px[i * 4] / 255;
				alpha[i] = px[i * 4 + 3] / 255;
				if (alpha[i] > 0.5 && (i & 7) === 0) seen.push(lum[i]);
			}
			seen.sort((a, b) => a - b);
			const lo = seen[Math.floor(seen.length * 0.02)] ?? 0;
			const hi = seen[Math.floor(seen.length * 0.995)] ?? 1;

			// Unsharp mask = the etched, high-detail look; then stretch to the silhouette's range.
			const blur = boxBlur(lum, W, H, Math.round(3 * S));
			base = new Uint8Array(n);
			for (let i = 0; i < n; i++) {
				const sharp = lum[i] + (lum[i] - blur[i]) * 1.6;
				const g = Math.min(1, Math.max(0, (sharp - lo) / (hi - lo || 1)));
				base[i] = Math.round(Math.pow(g, 1.05) * 255);
			}
			// Soft mask + static dither → the edge dissolves into scattered pixels.
			const soft = boxBlur(alpha, W, H, Math.round(7 * S));
			mask = new Uint8Array(n);
			dither = new Uint8Array(n);
			for (let i = 0; i < n; i++) {
				mask[i] = Math.round(Math.min(alpha[i], soft[i] * 1.15) * 255);
				dither[i] = (Math.random() * 254 + 1) | 0;
			}

			frame = ctx!.createImageData(W, H);
			out32 = new Uint32Array(frame.data.buffer);
			band = Math.round(10 * S);
			const bands = Math.ceil(W / band);
			drops = new Float32Array(bands);
			speeds = new Float32Array(bands);
			for (let b = 0; b < bands; b++) {
				drops[b] = -Math.random() * H * 0.7;
				speeds[b] = H * (0.6 + Math.random() * 0.6);
			}
			buildPalette();
			paint(performance.now());
		}

		function paint(now: number) {
			if (!frame) return;
			const t = now / 1000;
			const period = Math.max(2, Math.round(3 * S)); // scanline pitch
			const hiPitch = Math.round(7 * S); // bright signal lines
			const drift = reduce ? 0 : Math.floor(t * 14 * S);
			const R = lens;
			const R2 = R * R;
			const gx = reduce ? 0 : (Math.random() * 128) | 0;
			const gy = reduce ? 0 : (Math.random() * 128) | 0;
			const glitching = now < glitchUntil;
			const fadeStart = H * 0.72;

			for (let y = 0; y < H; y++) {
				let rowShift = 0;
				if (glitching) for (const s of slices) if (y >= s.y && y < s.y + s.h) rowShift += s.dx;
				const gap = y % period === 0;
				const hiRow = (y + drift) % hiPitch === 0;
				const fade = y > fadeStart ? 1 - (y - fadeStart) / (H - fadeStart) : 1;
				const dy = y - my;
				const row = y * W;
				const grow = ((y + gy) & 127) << 7;

				for (let x = 0; x < W; x++) {
					const i = row + x;
					if (booting && y > drops[(x / band) | 0]) {
						out32[i] = 0;
						continue;
					}
					let sx = x + rowShift;
					let sy = y;
					if (R > 1) {
						const dx = x - mx;
						const d2 = dx * dx + dy * dy;
						if (d2 < R2) {
							const f = 1 - Math.sqrt(d2) / R;
							const f2 = f * f;
							// Jagged horizontal tearing, stronger on the bright signal lines…
							sx += Math.sin(y * 0.21 + t * 9) * 14 * S * f2;
							if (hiRow) sx += Math.sin(x * 0.08 + t * 17) * 22 * S * f;
							// …and blocky pixelation towards the centre.
							const q = 1 + ((f2 * 9 * S) | 0);
							sx = sx - (sx % q);
							sy = sy - (sy % q);
						}
					}
					sx = sx < 0 ? 0 : sx >= W ? W - 1 : sx | 0;
					const j = sy * W + sx;
					if (mask[j] * fade <= dither[i]) {
						out32[i] = 0;
						continue;
					}
					let v = base[j] + grain[grow + ((x + gx) & 127)];
					if (gap) v *= 0.62;
					if (hiRow) v = v * 0.55 + 125;
					out32[i] = pal[v < 0 ? 0 : v > 255 ? 255 : v | 0];
				}
			}
			ctx!.putImageData(frame, 0, 0);

			// Rain heads during the boot sequence.
			if (booting) {
				ctx!.font = `500 ${Math.round(band * 1.15)}px ${FONT}`;
				ctx!.textAlign = 'center';
				ctx!.textBaseline = 'bottom';
				for (let b = 0; b < drops.length; b++) {
					const yh = drops[b];
					if (yh < 0 || yh > H + band * 6) continue;
					for (let k = 0; k < 6; k++) {
						ctx!.fillStyle = k === 0 ? glyphHead : ink;
						ctx!.globalAlpha = k === 0 ? 1 : 0.85 - k * 0.14;
						ctx!.fillText(HEX[(Math.random() * 16) | 0], (b + 0.5) * band, yh - k * band * 1.2);
					}
				}
				ctx!.globalAlpha = 1;
			}
			lastPaint = now;
		}

		function tick(now: number) {
			raf = 0;
			const dt = Math.min(0.05, (now - (last || now)) / 1000);
			last = now;

			if (booting) {
				let done = true;
				for (let b = 0; b < drops.length; b++) {
					drops[b] += speeds[b] * dt;
					if (drops[b] < H + band * 8) done = false;
				}
				if (done) booting = false;
			}
			if (hideAt && now > hideAt) {
				lensTarget = 0;
				hideAt = 0;
			}
			lens += (lensTarget - lens) * Math.min(1, dt * 10);
			if (Math.abs(lensTarget - lens) < 0.5) lens = lensTarget;

			if (!reduce && now > nextGlitch) {
				slices = Array.from({ length: 1 + ((Math.random() * 3) | 0) }, () => ({
					y: (Math.random() * H) | 0,
					h: ((4 + Math.random() * 22) * S) | 0,
					dx: ((Math.random() * 2 - 1) * 26 * S) | 0
				}));
				glitchUntil = now + 90 + Math.random() * 140;
				nextGlitch = now + 1800 + Math.random() * 3200;
			}

			const active = booting || lens > 0 || now < glitchUntil;
			// Full frame rate while something moves, ~24 fps for the idle signal drift.
			if (active || now - lastPaint > 42) paint(now);
			if (visible && (active || !reduce)) raf = requestAnimationFrame(tick);
		}

		function wake() {
			if (!raf && visible) {
				last = 0;
				raf = requestAnimationFrame(tick);
			}
		}

		function point(e: PointerEvent) {
			const b = canvas.getBoundingClientRect();
			mx = ((e.clientX - b.left) / b.width) * W;
			my = ((e.clientY - b.top) / b.height) * H;
			if (reduce) return;
			lensTarget = Math.max(70 * S, W * 0.28);
			if (e.pointerType !== 'mouse') {
				touch = true;
				hideAt = performance.now() + 1400;
			}
			wake();
		}
		function leave(e: PointerEvent) {
			if (e.pointerType === 'mouse') lensTarget = 0;
			wake();
		}
		canvas.addEventListener('pointermove', point);
		canvas.addEventListener('pointerdown', point);
		canvas.addEventListener('pointerleave', leave);

		const io = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			if (visible) wake();
		});
		let rebuild = 0;
		const ro = new ResizeObserver(() => {
			cancelAnimationFrame(rebuild);
			rebuild = requestAnimationFrame(() => {
				if (Math.abs(wrap.clientWidth * S - W) > 2) build();
			});
		});
		const retheme = () => {
			buildPalette();
			paint(performance.now());
		};
		const mo = new MutationObserver(retheme);

		let alive = true;
		Promise.all([img.decode(), document.fonts.load(`12px ${FONT}`).catch(() => {})]).then(
			() => {
				if (!alive) return;
				build();
				io.observe(canvas);
				ro.observe(wrap);
				mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
				mq.addEventListener('change', retheme);
			},
			() => {}
		);

		return () => {
			alive = false;
			cancelAnimationFrame(raf);
			cancelAnimationFrame(rebuild);
			io.disconnect();
			ro.disconnect();
			mo.disconnect();
			mq.removeEventListener('change', retheme);
			canvas.removeEventListener('pointermove', point);
			canvas.removeEventListener('pointerdown', point);
			canvas.removeEventListener('pointerleave', leave);
		};
	});
</script>

<figure class="portrait">
	<div class="stage" bind:this={wrap} style="aspect-ratio: {ratio}" role="img" aria-label={alt}>
		<canvas bind:this={canvas}></canvas>
	</div>
	<figcaption>
		{#if label}<span class="label">{label}</span>{/if}
		<span class="hint">{touch ? 'tap' : 'hover'} to glitch</span>
	</figcaption>
</figure>

<style>
	.portrait {
		position: relative;
		margin: 0;
	}
	.stage {
		position: relative;
		width: 100%;
		background: radial-gradient(60% 50% at 50% 40%, var(--accent-soft), transparent 70%);
	}
	canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		cursor: crosshair;
		touch-action: pan-y;
	}
	figcaption {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		margin-top: 10px;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		color: var(--text-faint);
	}
	.label::before {
		content: '// ';
		color: var(--accent);
	}
	.hint {
		color: var(--accent);
	}
</style>
