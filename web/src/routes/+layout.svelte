<script lang="ts">
	import '@fontsource-variable/inter';
	import '@fontsource/chakra-petch/latin-500.css';
	import '@fontsource/chakra-petch/latin-600.css';
	import '@fontsource/chakra-petch/latin-700.css';
	import '@fontsource-variable/jetbrains-mono';
	import '#lib/styles/global.css';
	import { onNavigate } from '$app/navigation';
	import DotField from '#lib/components/DotField.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import Header from '#lib/components/Header.svelte';
	import ScrollTrace from '#lib/components/ScrollTrace.svelte';
	import { locale } from '#lib/locale.svelte.js';

	let { data, children } = $props();
	const { lang, t } = $derived(locale());

	// `app.html` sets it on page load; this keeps it right after switching language in the app.
	$effect(() => {
		document.documentElement.lang = lang;
	});

	// Smooth cross-fade between pages where the browser supports View Transitions.
	onNavigate((navigation) => {
		if (!document.startViewTransition || navigation.from?.url.pathname === navigation.to?.url.pathname)
			return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	// One listener feeds the cursor position to whichever `.spotlight` card is hovered.
	function spotlight(e: PointerEvent) {
		const el = (e.target as Element | null)?.closest?.<HTMLElement>('.spotlight');
		if (!el) return;
		const r = el.getBoundingClientRect();
		el.style.setProperty('--mx', `${e.clientX - r.left}px`);
		el.style.setProperty('--my', `${e.clientY - r.top}px`);
	}
</script>

<svelte:document onpointermove={spotlight} />

<DotField />
<a class="skip" href="#main">{t.skip}</a>
<Header />
<ScrollTrace />
<main id="main">
	{@render children()}
</main>
<Footer legal={data.legal} />

<style>
	main {
		min-height: 60vh;
	}
	.skip {
		position: absolute;
		left: 16px;
		top: -100px;
		z-index: 100;
		padding: 10px 16px;
		border-radius: 8px;
		background: var(--accent);
		color: var(--accent-ink);
		font-weight: 600;
	}
	.skip:focus {
		top: 12px;
	}
</style>
