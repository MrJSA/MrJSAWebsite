<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { site } from '#lib/config/site.js';

	let { data } = $props();
	const email = $derived(data.supportEmail ?? site.legalEmail);
</script>

<Seo
	title="Privacy policy — {data.title}"
	description="Privacy policy for the {data.title} app."
	breadcrumbs={[
		{ name: 'Apps', path: '/apps/' },
		{ name: data.title, path: `/apps/${data.slug}/` }
	]}
/>

<section class="section">
	<div class="container">
		<a class="back" href="/apps/{data.slug}/"><Icon name="back" size={16} /> {data.title}</a>
		<span class="eyebrow">Privacy policy</span>
		<h1>{data.title}</h1>
		<div class="prose">{@html data.html}</div>
		<p class="contact muted">
			Questions about this policy? Contact <a href="mailto:{email}">{email}</a>.
		</p>
	</div>
</section>

<style>
	.back {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 28px;
		color: var(--text-muted);
		font-size: 0.92rem;
	}
	.back:hover {
		color: var(--accent);
	}
	h1 {
		margin: 14px 0 40px;
		font-size: clamp(2rem, 5vw, 3rem);
	}
	.contact {
		margin-top: 48px;
	}
	.contact a {
		color: var(--accent);
	}
</style>
