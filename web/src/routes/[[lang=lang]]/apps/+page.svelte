<script lang="ts">
	import AppCard from '#lib/components/AppCard.svelte';
	import SectionHeader from '#lib/components/SectionHeader.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { locale } from '#lib/locale.svelte.js';

	let { data } = $props();
	const { t } = $derived(locale());
</script>

<Seo title={t.apps} description={t.appsDescription} />

<section class="section">
	<div class="container">
		<SectionHeader eyebrow={t.download} title={t.apps} level={1} />
		{#if data.apps.length}
			<div class="grid">
				{#each data.apps as app, i (app.slug)}
					<AppCard {app} delay={(i % 3) * 80} />
				{/each}
			</div>
		{:else}
			<p class="muted">{t.noApps}</p>
		{/if}
	</div>
</section>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
		gap: 20px;
	}
</style>
