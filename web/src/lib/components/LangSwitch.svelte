<script lang="ts">
	import { page } from '$app/state';
	import { localize, unlocalize, type Lang } from '#lib/i18n.js';
	import { locale } from '#lib/locale.svelte.js';

	const { lang, t } = $derived(locale());
	const other: Lang = $derived(lang === 'de' ? 'en' : 'de');
	// Same page in the other language; keeps the section anchor (e.g. `/#about`).
	const target = $derived(localize(unlocalize(page.url.pathname), other) + page.url.hash);

	// Remembered like the theme (see app.html); the privacy policy mentions the `lang` key.
	function remember() {
		try {
			localStorage.setItem('lang', other);
		} catch {}
	}
</script>

<a class="toggle" href={target} hreflang={other} lang={other} aria-label={t.switchLang} onclick={remember}>
	{other.toUpperCase()}
</a>

<style>
	.toggle {
		display: grid;
		place-items: center;
		width: 38px;
		height: 38px;
		border-radius: 999px;
		border: 1px solid var(--border);
		color: var(--text-muted);
		font-family: var(--font-mono);
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		transition:
			color 0.2s,
			border-color 0.2s;
	}
	.toggle:hover {
		color: var(--text);
		border-color: var(--border-strong);
	}
</style>
