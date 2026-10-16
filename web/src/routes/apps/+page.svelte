<script lang="ts">
	import AppCard from '#lib/components/AppCard.svelte';
	import SectionHeader from '#lib/components/SectionHeader.svelte';
	import Seo from '#lib/components/Seo.svelte';

	let { data } = $props();
</script>

<Seo title="Apps" description="Apps for Android, iOS and the web." />

<section class="section">
	<div class="container">
		<SectionHeader eyebrow="Download" title="Apps" level={1} />
		{#if data.apps.length}
			<div class="grid">
				{#each data.apps as app, i (app.slug)}
					<AppCard {app} delay={(i % 3) * 80} />
				{/each}
			</div>
		{:else}
			<p class="muted">The first apps are on their way — check back soon.</p>
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
