<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { site } from '#lib/config/site.js';
	import StoreButtons from '#lib/components/StoreButtons.svelte';
	import { locale } from '#lib/locale.svelte.js';

	let { data } = $props();
	const app = $derived(data.app);
	const { t, href } = $derived(locale());

	// The screenshots sit right after the first section ("What it is"), so split the body at the second h2.
	const parts = $derived.by(() => {
		const html = app.html ?? '';
		const first = html.indexOf('<h2');
		const second = first === -1 ? -1 : html.indexOf('<h2', first + 3);
		return second === -1 ? [html, ''] : [html.slice(0, second), html.slice(second)];
	});

	let dialog = $state<HTMLDialogElement>();
	let current = $state(0);
	const shots = $derived(app.screenshots ?? []);

	function open(i: number) {
		current = i;
		dialog?.showModal();
	}
	function step(d: number) {
		current = (current + d + shots.length) % shots.length;
	}
	function onKey(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') step(-1);
		else if (e.key === 'ArrowRight') step(1);
		else return;
		e.preventDefault();
	}
	function onBackdrop(e: MouseEvent) {
		if (e.target === e.currentTarget) dialog?.close();
	}
</script>

<Seo
	title={app.title}
	description={app.summary}
	image={app.cover ?? app.icon}
	breadcrumbs={[{ name: t.apps, path: '/apps/' }]}
	schema={{
		'@type': 'SoftwareApplication',
		name: app.title,
		description: app.summary,
		...(app.platforms?.length && { operatingSystem: app.platforms.join(', ') }),
		author: { '@id': `${site.url}/#founder` },
		publisher: { '@id': `${site.url}/#organization` }
	}}
/>

<article class="section">
	<div class="container">
		<a class="back" href={href('/apps/')}><Icon name="back" size={16} /> {t.allApps}</a>

		<header>
			<div class="meta">
				{#if app.status}<span class="chip chip-accent">{app.status}</span>{/if}
				{#each app.platforms ?? [] as p (p)}<span class="chip">{p}</span>{/each}
			</div>
			<div class="title">
				<div class="icon">
					{#if app.icon}
						<img src={app.icon} alt="" width="88" height="88" />
					{:else}
						<Icon name="phone" size={36} />
					{/if}
				</div>
				<h1>{app.title}</h1>
			</div>
			<p class="lead muted">{app.summary}</p>
			<div class="links"><StoreButtons stores={app.stores} /></div>
		</header>

		<hr class="rule" />

		<div class="layout">
			<div class="main">
				<div class="prose">{@html parts[0]}</div>
				{#if shots.length}
					<div class="gallery card">
						<div class="shots" aria-label={t.screenshots}>
							{#each shots as src, i (src)}
								<button type="button" onclick={() => open(i)} aria-label="{t.enlargeImage} {i + 1}">
									<img {src} alt="{app.title} {t.screenshot} {i + 1}" loading="lazy" decoding="async" />
								</button>
							{/each}
						</div>
					</div>
				{/if}
				{#if parts[1]}<div class="prose">{@html parts[1]}</div>{/if}
			</div>
			{#if app.platforms?.length || app.tags?.length}
				<aside>
					{#if app.platforms?.length}
						<h2>{t.platforms}</h2>
						<ul>
							{#each app.platforms as p (p)}<li class="chip">{p}</li>{/each}
						</ul>
					{/if}
					{#if app.tags?.length}
						<h2>{t.tech}</h2>
						<ul>
							{#each app.tags as tag (tag)}<li class="chip">{tag}</li>{/each}
						</ul>
					{/if}
				</aside>
			{/if}
		</div>

		{#if shots.length}
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
			<dialog class="lightbox" bind:this={dialog} onkeydown={onKey} onclick={onBackdrop} aria-label={t.screenshots}>
				<img src={shots[current]} alt="{app.title} {t.screenshot} {current + 1}" />
				<span class="count">{current + 1} / {shots.length}</span>
				<button type="button" class="nav close" onclick={() => dialog?.close()} aria-label={t.close}>
					<Icon name="close" size={22} />
				</button>
				{#if shots.length > 1}
					<button type="button" class="nav nav-prev" onclick={() => step(-1)} aria-label={t.previousImage}>
						<Icon name="chevronLeft" size={26} />
					</button>
					<button type="button" class="nav nav-next" onclick={() => step(1)} aria-label={t.nextImage}>
						<Icon name="chevronRight" size={26} />
					</button>
				{/if}
			</dialog>
		{/if}

		{#if data.hasPrivacy}
			<a class="privacy" href={href(`/apps/${app.slug}/privacy/`)}>
				<Icon name="shield" size={18} /> {t.privacyFor} {app.title}
			</a>
		{/if}

		{#if data.prev || data.next}
			<nav class="pager" aria-label={t.apps}>
				{#if data.prev}
					<a href={href(`/apps/${data.prev.slug}/`)}><small>{t.previous}</small>{data.prev.title}</a>
				{:else}<span></span>{/if}
				{#if data.next}
					<a class="next" href={href(`/apps/${data.next.slug}/`)}><small>{t.next}</small>{data.next.title}</a>
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
	.title {
		display: flex;
		align-items: center;
		gap: clamp(16px, 3vw, 24px);
		margin-top: 18px;
	}
	.icon {
		display: grid;
		place-items: center;
		width: clamp(64px, 10vw, 88px);
		aspect-ratio: 1;
		flex: none;
		border-radius: 24%;
		background: var(--accent-soft);
		color: var(--accent);
		overflow: hidden;
		border: 1px solid var(--border);
		box-shadow: var(--shadow);
	}
	.icon img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	h1 {
		font-size: clamp(2.2rem, 5.5vw, 3.8rem);
		letter-spacing: -0.03em;
	}
	.lead {
		margin-top: 18px;
		font-size: 1.2rem;
	}
	.links {
		margin-top: 28px;
	}
	.gallery {
		margin: 32px 0 40px;
		overflow: hidden;
		background:
			radial-gradient(circle, var(--border-strong) 1px, transparent 1.2px) 0 0 / 16px 16px,
			radial-gradient(60% 80% at 50% 50%, var(--accent-soft), transparent 70%),
			linear-gradient(140deg, var(--surface-2), var(--bg-elev));
	}
	.shots {
		display: flex;
		gap: 20px;
		overflow-x: auto;
		padding: clamp(20px, 4vw, 36px);
		scroll-snap-type: x mandatory;
		scroll-padding: clamp(20px, 4vw, 36px);
	}
	.shots button {
		flex: none;
		padding: 0;
		border: 0;
		background: none;
		cursor: zoom-in;
		scroll-snap-align: start;
		border-radius: 20px;
		transition: transform 0.2s ease;
	}
	.shots button:hover {
		transform: translateY(-3px);
	}
	.shots button:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
	}
	.shots img {
		display: block;
		height: 440px;
		box-shadow: var(--shadow);
		width: auto;
		max-width: none;
		border-radius: 20px;
		border: 1px solid var(--border);
	}
	.lightbox {
		width: 100vw;
		height: 100dvh;
		max-width: none;
		max-height: none;
		margin: 0;
		padding: 56px clamp(56px, 8vw, 96px);
		border: 0;
		background: transparent;
		color: #fff;
		place-items: center;
	}
	.lightbox[open] {
		display: grid;
	}
	.lightbox::backdrop {
		background: rgb(0 0 0 / 0.85);
		backdrop-filter: blur(4px);
	}
	.lightbox img {
		max-width: 100%;
		max-height: 100%;
		width: auto;
		height: auto;
		object-fit: contain;
		border-radius: 20px;
		box-shadow: 0 20px 60px rgb(0 0 0 / 0.5);
	}
	.count {
		position: absolute;
		bottom: 16px;
		left: 50%;
		translate: -50% 0;
		font-family: var(--font-mono);
		font-size: 0.85rem;
		opacity: 0.8;
	}
	.nav {
		position: absolute;
		display: grid;
		place-items: center;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		border: 1px solid rgb(255 255 255 / 0.25);
		background: rgb(255 255 255 / 0.12);
		color: #fff;
		cursor: pointer;
		transition: background 0.15s ease;
	}
	.nav:hover,
	.nav:focus-visible {
		background: rgb(255 255 255 / 0.25);
	}
	.nav-prev,
	.nav-next {
		top: 50%;
		translate: 0 -50%;
	}
	.nav-prev {
		left: clamp(4px, 2vw, 24px);
	}
	.nav-next {
		right: clamp(4px, 2vw, 24px);
	}
	.close {
		top: 12px;
		right: 12px;
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
	}
	aside {
		position: sticky;
		top: calc(var(--header-h) + 24px);
		align-self: start;
		display: grid;
		gap: 14px;
	}
	aside ul + h2 {
		margin-top: 18px;
	}
	aside ul {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.privacy {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin-top: 48px;
		color: var(--text-muted);
	}
	.privacy:hover {
		color: var(--accent);
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
	@media (max-width: 640px) {
		.shots img {
			height: 360px;
		}
	}
</style>
