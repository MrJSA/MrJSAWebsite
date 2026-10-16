<script lang="ts">
	import type { App } from '#lib/types.js';
	import { reveal } from '#lib/actions/reveal.js';
	import Icon from './Icon.svelte';
	import StoreButtons from './StoreButtons.svelte';

	let { app, delay = 0 }: { app: App; delay?: number } = $props();
</script>

<article class="card app" use:reveal={delay}>
	<a class="top" href="/apps/{app.slug}/">
		<div class="icon">
			{#if app.icon}
				<img src={app.icon} alt="" width="64" height="64" loading="lazy" />
			{:else}
				<Icon name="phone" size={30} />
			{/if}
		</div>
		<div>
			<h3>{app.title}</h3>
			{#if app.platforms?.length}
				<p class="platforms">{app.platforms.join(' · ')}</p>
			{/if}
		</div>
	</a>
	<p class="muted">{app.summary}</p>
	<StoreButtons stores={app.stores} compact />
</article>

<style>
	.app {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 24px;
		transition: border-color 0.3s var(--ease);
	}
	.app:hover {
		border-color: color-mix(in srgb, var(--accent) 45%, transparent);
	}
	.top {
		display: flex;
		align-items: center;
		gap: 16px;
	}
	.icon {
		display: grid;
		place-items: center;
		width: 64px;
		height: 64px;
		flex: none;
		border-radius: 16px;
		background: var(--accent-soft);
		color: var(--accent);
		overflow: hidden;
		border: 1px solid var(--border);
	}
	h3 {
		font-size: 1.25rem;
	}
	.platforms {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		color: var(--text-faint);
		margin-top: 4px;
	}
	.app > p {
		font-size: 0.97rem;
		flex: 1;
	}
</style>
