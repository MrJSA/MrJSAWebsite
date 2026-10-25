<script lang="ts">
	/**
	 * Page-wide dot grid behind all content; an accent copy lights up around the cursor
	 * (same look as the hero, which paints its own grid on top of this one).
	 */
	let field: HTMLElement;
	let lit = $state(false);
	let raf = 0;

	function track(e: PointerEvent) {
		if (e.pointerType !== 'mouse') return;
		cancelAnimationFrame(raf);
		raf = requestAnimationFrame(() => {
			field.style.setProperty('--hx', `${e.clientX}px`);
			field.style.setProperty('--hy', `${e.clientY}px`);
			lit = true;
		});
	}
	// `relatedTarget` is null when the pointer leaves the window.
	const unlight = (e: PointerEvent) => {
		if (!e.relatedTarget) lit = false;
	};
</script>

<svelte:document onpointermove={track} onpointerout={unlight} />

<div class="field" class:lit bind:this={field} aria-hidden="true">
	<div class="dots"></div>
	<div class="dots dots-lit"></div>
</div>

<style>
	.field {
		position: fixed;
		inset: 0;
		z-index: -1;
		pointer-events: none;
	}
	.dots {
		position: absolute;
		inset: 0;
		background-image: radial-gradient(var(--grid-line) 1.3px, transparent 1.6px);
		background-size: 28px 28px;
	}
	.dots-lit {
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
</style>
