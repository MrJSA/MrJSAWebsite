<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import StoreButtons from '#lib/components/StoreButtons.svelte';

	let { data } = $props();
	const app = $derived(data.app);
</script>

<Seo title={app.title} description={app.summary} image={app.cover ?? app.icon} />

<section class="section">
	<div class="container">
		<a class="back" href="/apps/"><Icon name="back" size={16} /> All apps</a>

		<header class="hero card">
			<div class="icon">
				{#if app.icon}
					<img src={app.icon} alt="" width="120" height="120" />
				{:else}
					<Icon name="phone" size={48} />
				{/if}
			</div>
			<div class="text">
				<div class="meta">
					{#if app.status}<span class="chip chip-accent">{app.status}</span>{/if}
					{#each app.platforms ?? [] as p (p)}<span class="chip">{p}</span>{/each}
				</div>
				<h1>{app.title}</h1>
				<p class="muted">{app.summary}</p>
				<StoreButtons stores={app.stores} />
			</div>
		</header>

		{#if app.screenshots?.length}
			<div class="shots" aria-label="Screenshots">
				{#each app.screenshots as src, i (src)}
					<img {src} alt="{app.title} screenshot {i + 1}" loading="lazy" decoding="async" />
				{/each}
			</div>
		{/if}

		<div class="prose body">{@html app.html}</div>

		{#if data.hasPrivacy}
			<a class="privacy" href="/apps/{app.slug}/privacy/">
				<Icon name="shield" size={18} /> Privacy policy for {app.title}
			</a>
		{/if}
	</div>
</section>

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
	.hero {
		display: flex;
		gap: clamp(20px, 4vw, 40px);
		align-items: center;
		margin-top: 28px;
		padding: clamp(24px, 5vw, 48px);
		background:
			radial-gradient(500px 260px at 0% 0%, var(--accent-soft), transparent 70%),
			var(--surface);
	}
	.icon {
		display: grid;
		place-items: center;
		width: clamp(88px, 14vw, 120px);
		aspect-ratio: 1;
		flex: none;
		border-radius: 26%;
		background: var(--accent-soft);
		color: var(--accent);
		overflow: hidden;
		border: 1px solid var(--border);
		box-shadow: var(--shadow);
	}
	.text {
		display: grid;
		gap: 14px;
		justify-items: start;
	}
	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	h1 {
		font-size: clamp(2rem, 5vw, 3.2rem);
	}
	.text p {
		font-size: 1.1rem;
		max-width: 60ch;
		margin-bottom: 8px;
	}
	.shots {
		display: flex;
		gap: 16px;
		overflow-x: auto;
		margin-top: 40px;
		padding-bottom: 8px;
		scroll-snap-type: x mandatory;
	}
	.shots img {
		height: 460px;
		width: auto;
		max-width: none;
		border-radius: 20px;
		border: 1px solid var(--border);
		scroll-snap-align: start;
	}
	.body {
		margin-top: 48px;
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
	@media (max-width: 640px) {
		.hero {
			flex-direction: column;
			align-items: flex-start;
		}
		.shots img {
			height: 360px;
		}
	}
</style>
