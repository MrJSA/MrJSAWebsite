<script lang="ts">
	import type { StoreLinks } from '#lib/types.js';
	import { locale } from '#lib/locale.svelte.js';
	import Icon from './Icon.svelte';

	let { stores }: { stores?: StoreLinks } = $props();

	interface Button {
		href: string;
		icon: string;
		label: string;
	}

	const { t } = $derived(locale());
	const buttons = $derived(
		[
			stores?.googlePlay && { href: stores.googlePlay, icon: 'play', label: `${t.stores.googlePlay} Google Play` },
			stores?.appStore && { href: stores.appStore, icon: 'phone', label: `${t.stores.appStore} App Store` },
			stores?.website && { href: stores.website, icon: 'globe', label: `${t.stores.website} ${t.stores.websiteLabel}` },
			stores?.web && { href: stores.web, icon: 'globe', label: `${t.stores.web} ${t.stores.webLabel}` },
			stores?.source && { href: stores.source, icon: 'github', label: `${t.stores.source} ${t.stores.sourceLabel}` }
		].filter((b): b is Button => !!b)
	);
</script>

{#if buttons.length}
	<div class="stores">
		{#each buttons as b, i (b.href)}
			<a class="btn" class:btn-primary={i === 0} href={b.href} target="_blank" rel="noopener noreferrer">
				<Icon name={b.icon} size={16} />
				{b.label}
			</a>
		{/each}
	</div>
{/if}

<style>
	.stores {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}
</style>
