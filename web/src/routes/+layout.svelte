<script lang="ts">
	import '@fontsource-variable/inter';
	import '@fontsource/chakra-petch/latin-500.css';
	import '@fontsource/chakra-petch/latin-600.css';
	import '@fontsource/chakra-petch/latin-700.css';
	import '@fontsource-variable/jetbrains-mono';
	import '#lib/styles/global.css';
	import Footer from '#lib/components/Footer.svelte';
	import Header from '#lib/components/Header.svelte';

	let { data, children } = $props();
</script>

<a class="skip" href="#main">Skip to content</a>
<Header />
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
