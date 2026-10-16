<script lang="ts">
	/**
	 * Shows `src` if given, otherwise a generated PCB-style pattern that is
	 * unique per `seed` — so entries look good even before you have photos.
	 */
	let { src, alt = '', seed, label }: { src?: string; alt?: string; seed: string; label?: string } =
		$props();

	function hash(s: string) {
		let h = 2166136261;
		for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
		return h >>> 0;
	}

	const traces = $derived.by(() => {
		let h = hash(seed);
		const rnd = () => {
			h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
			return (h % 1000) / 1000;
		};
		return Array.from({ length: 7 }, () => {
			const y = 20 + Math.round(rnd() * 160);
			const x1 = Math.round(rnd() * 140);
			const x2 = x1 + 60 + Math.round(rnd() * 120);
			const dy = (rnd() > 0.5 ? 1 : -1) * (20 + Math.round(rnd() * 40));
			return { d: `M${x1} ${y}H${x2}l${Math.abs(dy)} ${dy}H400`, cx: x1, cy: y };
		});
	});
	const color = $derived(hash(seed) % 2 === 0 ? 'var(--accent)' : 'var(--accent-2)');
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
			{#each traces as t, i (i)}
				<path d={t.d} fill="none" stroke={color} stroke-opacity="0.5" stroke-width="2" />
				<circle cx={t.cx} cy={t.cy} r="4" fill="var(--surface)" stroke={color} stroke-width="2" />
			{/each}
		</svg>
		{#if label}<span class="label">{label}</span>{/if}
	{/if}
</div>

<style>
	.cover {
		position: relative;
		aspect-ratio: 2 / 1;
		overflow: hidden;
		background: linear-gradient(140deg, var(--surface-2), var(--bg-elev));
		border-bottom: 1px solid var(--border);
	}
	img,
	svg {
		width: 100%;
		height: 100%;
		object-fit: cover;
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
