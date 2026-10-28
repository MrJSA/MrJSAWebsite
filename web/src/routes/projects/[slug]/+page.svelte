<script lang="ts">
	import Cover from '#lib/components/Cover.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { site } from '#lib/config/site.js';

	let { data } = $props();
	const p = $derived(data.project);
	const date = $derived(
		p.date
			? new Date(p.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })
			: undefined
	);
</script>

<Seo
	title={p.title}
	description={p.summary}
	image={p.cover}
	type="article"
	breadcrumbs={[{ name: 'Projects', path: '/projects/' }]}
	schema={{
		'@type': 'Article',
		headline: p.title,
		description: p.summary,
		...(p.date && { datePublished: p.date }),
		...(p.tags?.length && { keywords: p.tags.join(', ') }),
		author: { '@id': `${site.url}/#founder` },
		publisher: { '@id': `${site.url}/#organization` }
	}}
/>

<article class="section">
	<div class="container">
		<a class="back" href="/projects/"><Icon name="back" size={16} /> All projects</a>

		<header>
			<div class="meta">
				{#if p.category}<span class="chip chip-accent">{p.category}</span>{/if}
				{#if p.status}<span class="chip">{p.status}</span>{/if}
				{#if date}<span class="chip">{date}</span>{/if}
			</div>
			<h1>{p.title}</h1>
			<p class="lead muted">{p.summary}</p>
			{#if p.links?.length}
				<div class="links">
					{#each p.links as l, i (l.href)}
						<a class="btn" class:btn-primary={i === 0} href={l.href} target="_blank" rel="noopener noreferrer">
							<Icon name={l.icon ?? 'external'} size={16} />
							{l.label}
						</a>
					{/each}
				</div>
			{/if}
		</header>

		{#if p.cover}
			<div class="cover card">
				<Cover src={p.cover} alt={p.title} seed={p.slug} />
			</div>
		{:else}
			<hr class="rule" />
		{/if}

		<div class="layout">
			<div class="prose">{@html p.html}</div>
			{#if p.tags?.length}
				<aside>
					<h2>Tech</h2>
					<ul>
						{#each p.tags as tag (tag)}<li class="chip">{tag}</li>{/each}
					</ul>
				</aside>
			{/if}
		</div>

		{#if data.prev || data.next}
			<nav class="pager" aria-label="More projects">
				{#if data.prev}
					<a href="/projects/{data.prev.slug}/"><small>Previous</small>{data.prev.title}</a>
				{:else}<span></span>{/if}
				{#if data.next}
					<a class="next" href="/projects/{data.next.slug}/"><small>Next</small>{data.next.title}</a>
				{/if}
			</nav>
		{/if}
	</div>
</article>

<style>
	.back {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		color: var(--text-muted);
		font-size: 0.92rem;
	}
	.back:hover {
		color: var(--accent);
	}
	header {
		margin-top: 28px;
		max-width: 820px;
	}
	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	h1 {
		margin-top: 18px;
		font-size: clamp(2.2rem, 5.5vw, 3.8rem);
		letter-spacing: -0.03em;
	}
	.lead {
		margin-top: 18px;
		font-size: 1.2rem;
	}
	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 28px;
	}
	.cover {
		margin-top: 48px;
		overflow: hidden;
	}
	.cover :global(.cover) {
		aspect-ratio: 21 / 9;
		border-bottom: 0;
	}
	.rule {
		margin: 56px 0 0;
		height: 1px;
		border: 0;
		background: linear-gradient(90deg, var(--accent), var(--border) 30%, transparent);
	}
	.layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 240px;
		gap: 56px;
		margin-top: 56px;
	}
	aside h2 {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--text-faint);
		margin-bottom: 14px;
	}
	aside ul {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		list-style: none;
		margin: 0;
		padding: 0;
		position: sticky;
		top: calc(var(--header-h) + 24px);
	}
	.pager {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
		margin-top: 80px;
		padding-top: 32px;
		border-top: 1px solid var(--border);
	}
	.pager a {
		display: grid;
		gap: 4px;
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 1.1rem;
	}
	.pager a:hover {
		color: var(--accent);
	}
	.pager small {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--text-faint);
		font-weight: 400;
	}
	.pager .next {
		text-align: right;
	}
	@media (max-width: 860px) {
		.layout {
			grid-template-columns: 1fr;
			gap: 32px;
		}
		aside {
			order: -1;
		}
	}
</style>
