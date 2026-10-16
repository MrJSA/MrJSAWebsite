<script lang="ts">
	import { page } from '$app/state';
	import { site } from '#lib/config/site.js';

	let {
		title,
		description = site.description,
		image = site.ogImage,
		type = 'website',
		noindex = false
	}: { title?: string; description?: string; image?: string; type?: string; noindex?: boolean } =
		$props();

	const fullTitle = $derived(title ? `${title} · ${site.name}` : site.title);
	const canonical = $derived(site.url + page.url.pathname);
	// Structured data so search engines know the company name and logo.
	const orgJson = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'Organization',
			name: site.name,
			url: site.url,
			logo: site.url + '/logo-512.png',
			founder: { '@type': 'Person', name: site.owner },
			sameAs: site.socials.map((s) => s.href)
		})
	);
	const imageUrl = $derived(image.startsWith('http') ? image : site.url + image);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	{#if noindex}<meta name="robots" content="noindex" />{/if}
	<meta property="og:site_name" content={site.name} />
	<meta property="og:type" content={type} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={imageUrl} />
	<meta name="twitter:card" content="summary_large_image" />
	{#if page.url.pathname === '/'}
		{@html `<script type="application/ld+json">${orgJson}</` + `script>`}
	{/if}
</svelte:head>
