<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';

	let { data } = $props();
	const p = $derived(data.page);
</script>

<Seo title={p.title} description={p.summary || undefined} />

<section class="section">
	<div class="container">
		<h1>{p.title}</h1>
		{#if p.summary}<p class="lead muted">{p.summary}</p>{/if}
		<div class="prose">{@html p.html}</div>
	</div>
</section>

<style>
	h1 {
		font-size: clamp(2.2rem, 5vw, 3.4rem);
	}
	.lead {
		margin-top: 16px;
		font-size: 1.15rem;
		max-width: 60ch;
	}
	.prose {
		margin-top: 40px;
	}
</style>
