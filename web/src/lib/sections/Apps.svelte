<script lang="ts">
	import AppCard from '#lib/components/AppCard.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import SectionHeader from '#lib/components/SectionHeader.svelte';
	import { locale } from '#lib/locale.svelte.js';
	import type { SectionProps } from './registry';
	import type { AppsSection } from './types';

	let { section, data }: SectionProps<AppsSection> = $props();
	const { t, href } = $derived(locale());
	const shown = $derived(data.apps.slice(0, section.limit ?? 6));
</script>

{#if shown.length}
	<section class="section" id={section.id}>
		<div class="container">
			<SectionHeader eyebrow={section.eyebrow} title={section.title}>
				<a class="btn" href={href('/apps/')}>{t.allApps} <Icon name="arrow" size={16} /></a>
			</SectionHeader>
			<div class="grid">
				{#each shown as app, i (app.slug)}
					<AppCard {app} delay={(i % 3) * 80} />
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
		gap: 20px;
	}
</style>
