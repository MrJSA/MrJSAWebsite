<script lang="ts">
	import type { Snippet } from 'svelte';
	import { reveal } from '#lib/actions/reveal.js';

	let {
		eyebrow,
		title,
		level = 2,
		children
	}: { eyebrow?: string; title?: string; level?: 1 | 2; children?: Snippet } = $props();
</script>

<div class="head" use:reveal>
	<div>
		{#if eyebrow}<span class="eyebrow">{eyebrow}</span>{/if}
		{#if title}
			<svelte:element this={level === 1 ? 'h1' : 'h2'} class="section-title">{title}</svelte:element>
		{/if}
	</div>
	{#if children}<div class="extra">{@render children()}</div>{/if}
</div>

<style>
	.head {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 24px;
		flex-wrap: wrap;
		margin-bottom: clamp(32px, 5vw, 56px);
	}
</style>
