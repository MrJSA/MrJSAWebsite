<script lang="ts">
	import SectionHeader from '#lib/components/SectionHeader.svelte';
	import type { SectionProps } from './registry';
	import type { MarkdownSection } from './types';

	let { section, data }: SectionProps<MarkdownSection> = $props();
	const page = $derived(data.pages.find((p) => p.slug === section.page));
</script>

{#if page}
	<section class="section" id={section.id}>
		<div class="container">
			<SectionHeader eyebrow={section.eyebrow} title={section.title ?? page.title} />
			<div class="prose">{@html page.html}</div>
		</div>
	</section>
{/if}
