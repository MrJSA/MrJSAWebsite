<script lang="ts">
	import { locale } from '#lib/locale.svelte.js';
	import Icon from './Icon.svelte';

	const { t } = $derived(locale());

	let theme = $state<'light' | 'dark'>('dark');

	$effect(() => {
		const explicit = document.documentElement.dataset.theme;
		theme =
			explicit === 'light' || explicit === 'dark'
				? explicit
				: matchMedia('(prefers-color-scheme: light)').matches
					? 'light'
					: 'dark';
	});

	function toggle() {
		theme = theme === 'dark' ? 'light' : 'dark';
		document.documentElement.dataset.theme = theme;
		try {
			localStorage.setItem('theme', theme);
		} catch {}
	}
</script>

<button class="toggle" onclick={toggle} aria-label={theme === 'dark' ? t.toLight : t.toDark}>
	<Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
</button>

<style>
	.toggle {
		display: grid;
		place-items: center;
		width: 38px;
		height: 38px;
		border-radius: 999px;
		border: 1px solid var(--border);
		background: transparent;
		color: var(--text-muted);
		cursor: pointer;
		transition:
			color 0.2s,
			border-color 0.2s;
	}
	.toggle:hover {
		color: var(--text);
		border-color: var(--border-strong);
	}
</style>
