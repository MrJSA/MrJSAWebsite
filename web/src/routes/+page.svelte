<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import { home } from '#lib/config/site.js';
	import { sections } from '#lib/sections/registry.js';

	let { data } = $props();
</script>

<Seo />

{#each home as section, i (i)}
	{@const Section = sections[section.type]}
	<Section {section} data={data.collections} />
{/each}
