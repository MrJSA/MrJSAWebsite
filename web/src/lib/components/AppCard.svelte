<script lang="ts">
	import type { App } from '#lib/types.js';
	import { reveal } from '#lib/actions/reveal.js';
	import { locale } from '#lib/locale.svelte.js';
	import Icon from './Icon.svelte';

	let { app, delay = 0 }: { app: App; delay?: number } = $props();
	const { t, href } = $derived(locale());
</script>

<a class="card app spotlight" href={href(`/apps/${app.slug}/`)} use:reveal={delay}>
	<div class="cover">
		<div class="icon">
			{#if app.icon}
				<img src={app.icon} alt="" width="96" height="96" loading="lazy" />
			{:else}
				<Icon name="phone" size={40} />
			{/if}
		</div>
	</div>
	<div class="body">
		<div class="meta">
			{#if app.status}<span class="chip chip-accent">{app.status}</span>{/if}
			{#each app.platforms ?? [] as p (p)}<span class="chip">{p}</span>{/each}
		</div>
		<h3>{app.title}</h3>
		<p class="muted">{app.summary}</p>
		{#if app.tags?.length}
			<ul class="tags">
				{#each app.tags.slice(0, 4) as tag (tag)}<li class="chip">{tag}</li>{/each}
			</ul>
		{/if}
		<span class="more">{t.readMore} <Icon name="arrow" size={16} /></span>
	</div>
</a>

<style>
	.app {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		transition:
			transform 0.35s var(--ease),
			border-color 0.35s var(--ease),
			box-shadow 0.35s var(--ease);
	}
	.app:hover {
		transform: translateY(-4px);
		border-color: color-mix(in srgb, var(--accent) 45%, transparent);
	}
	.cover {
		display: grid;
		place-items: center;
		aspect-ratio: 2 / 1;
		background:
			radial-gradient(circle, var(--border-strong) 1px, transparent 1.2px) 0 0 / 16px 16px,
			radial-gradient(60% 80% at 50% 50%, var(--accent-soft), transparent 70%),
			linear-gradient(140deg, var(--surface-2), var(--bg-elev));
		border-bottom: 1px solid var(--border);
	}
	.icon {
		display: grid;
		place-items: center;
		width: 96px;
		height: 96px;
		border-radius: 24px;
		background: var(--accent-soft);
		color: var(--accent);
		overflow: hidden;
		border: 1px solid var(--border);
		box-shadow: var(--shadow);
		transition: transform 0.35s var(--ease);
	}
	.icon img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.app:hover .icon {
		transform: scale(1.06);
	}
	.body {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 22px 24px 24px;
		flex: 1;
	}
	.meta,
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	h3 {
		font-size: 1.3rem;
	}
	p {
		font-size: 0.97rem;
	}
	.more {
		margin-top: auto;
		padding-top: 6px;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: var(--accent);
		font-weight: 600;
		font-size: 0.92rem;
	}
	.more :global(svg) {
		transition: transform 0.25s var(--ease);
	}
	.app:hover .more :global(svg) {
		transform: translateX(4px);
	}
</style>
