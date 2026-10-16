<script lang="ts">
	/**
	 * A PCB trace along the left edge (wide screens only). A glowing signal travels
	 * down it as you scroll, with a mono readout of the progress.
	 */
	import { page } from '$app/state';

	let progress = $state(0);
	let visible = $state(false);
	let raf = 0;

	function update() {
		cancelAnimationFrame(raf);
		raf = requestAnimationFrame(() => {
			const max = document.documentElement.scrollHeight - innerHeight;
			visible = max > innerHeight * 0.5;
			progress = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
		});
	}

	// Recalculate after every navigation (page height changes).
	$effect(() => {
		page.url.pathname;
		update();
	});
</script>

<svelte:window onscroll={update} onresize={update} />

<div class="trace" class:visible style="--p: {progress}" aria-hidden="true">
	<span class="jog"></span>
	<span class="line">
		<span class="fill"></span>
		<span class="head"></span>
	</span>
	<span class="pad"></span>
	<span class="readout">{String(Math.round(progress * 100)).padStart(3, '0')}</span>
</div>

<style>
	.trace {
		--x: max(18px, calc((100vw - var(--container)) / 2 - 36px));
		position: fixed;
		z-index: 40;
		left: var(--x);
		top: calc(var(--header-h) + 40px);
		bottom: 48px;
		width: 14px;
		display: none;
		flex-direction: column;
		align-items: center;
		opacity: 0;
		transition: opacity 0.6s var(--ease);
		pointer-events: none;
	}
	.trace.visible {
		opacity: 1;
	}
	@media (min-width: 1300px) {
		.trace {
			display: flex;
		}
	}
	/* Via at the top. */
	.jog {
		width: 12px;
		height: 12px;
		flex: none;
		border-radius: 50%;
		border: 2px solid var(--accent);
		background: var(--bg);
	}
	.line {
		position: relative;
		flex: 1;
		width: 2px;
		background: var(--border-strong);
	}
	.fill {
		position: absolute;
		inset: 0 0 auto;
		height: calc(var(--p) * 100%);
		background: linear-gradient(var(--accent), color-mix(in srgb, var(--accent) 60%, #fff));
		box-shadow: 0 0 10px var(--accent);
	}
	.head {
		position: absolute;
		left: 50%;
		top: calc(var(--p) * 100%);
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: #d9ffdd;
		translate: -50% -50%;
		box-shadow:
			0 0 0 3px color-mix(in srgb, var(--accent) 40%, transparent),
			0 0 18px 4px var(--accent);
	}
	/* Pad at the bottom. */
	.pad {
		width: 12px;
		height: 18px;
		flex: none;
		border-radius: 2px;
		background: var(--brand-pad);
	}
	.readout {
		position: absolute;
		left: 50%;
		bottom: -26px;
		translate: -50% 0;
		font-family: var(--font-mono);
		font-size: 0.68rem;
		color: var(--text-faint);
	}
</style>
