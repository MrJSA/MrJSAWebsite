<script lang="ts">
	import type { StoreLinks } from '#lib/types.js';
	import { locale } from '#lib/locale.svelte.js';
	import Icon from './Icon.svelte';

	let { stores, compact = false }: { stores?: StoreLinks; compact?: boolean } = $props();

	interface Button {
		href: string;
		icon: string;
		small: string;
		label: string;
	}

	const { t } = $derived(locale());
	const buttons = $derived(
		[
			stores?.googlePlay && { href: stores.googlePlay, icon: 'play', small: t.stores.googlePlay, label: 'Google Play' },
			stores?.appStore && { href: stores.appStore, icon: 'phone', small: t.stores.appStore, label: 'App Store' },
			stores?.web && { href: stores.web, icon: 'globe', small: t.stores.web, label: t.stores.webLabel },
			stores?.source && { href: stores.source, icon: 'github', small: t.stores.source, label: t.stores.sourceLabel }
		].filter((b): b is Button => !!b)
	);
</script>

{#if buttons.length}
	<div class="stores" class:compact>
		{#each buttons as b (b.href)}
			<a class="store" href={b.href} target="_blank" rel="noopener noreferrer">
				<Icon name={b.icon} size={compact ? 16 : 22} />
				<span>
					{#if !compact}<small>{b.small}</small>{/if}
					<strong>{b.label}</strong>
				</span>
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
	.store {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		padding: 10px 18px 10px 14px;
		border-radius: 12px;
		background: var(--text);
		color: var(--bg);
		transition:
			transform 0.2s var(--ease),
			box-shadow 0.2s var(--ease);
	}
	.store:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow);
	}
	.store span {
		display: flex;
		flex-direction: column;
		line-height: 1.15;
	}
	small {
		font-size: 0.68rem;
		opacity: 0.75;
	}
	strong {
		font-size: 1rem;
		font-weight: 650;
	}
	.compact .store {
		padding: 7px 12px;
		border-radius: 999px;
		gap: 8px;
		background: var(--surface-2);
		color: var(--text);
		border: 1px solid var(--border);
	}
	.compact .store:hover {
		border-color: var(--accent);
	}
	.compact strong {
		font-size: 0.85rem;
		font-weight: 600;
	}
</style>
