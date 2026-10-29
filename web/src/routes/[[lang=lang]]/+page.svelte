<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import { home } from '#lib/config/site.js';
	import { locale } from '#lib/locale.svelte.js';
	import { sections } from '#lib/sections/registry.js';

	let { data } = $props();
	const { lang } = $derived(locale());
</script>

<Seo />

{#each home[lang] as section, i (i)}
	{@const Section = sections[section.type]}
	<Section {section} data={data.collections} />
{/each}
