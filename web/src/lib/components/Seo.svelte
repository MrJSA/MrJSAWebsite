<script lang="ts">
	import { page } from '$app/state';
	import { home, site } from '#lib/config/site.js';

	type Crumb = { name: string; path: string };

	let {
		title,
		description = site.description,
		image = site.ogImage,
		type = 'website',
		noindex = false,
		breadcrumbs = [],
		schema
	}: {
		title?: string;
		description?: string;
		image?: string;
		type?: string;
		noindex?: boolean;
		/** Parent pages between Home and this page, e.g. `[{ name: 'Projects', path: '/projects/' }]`. */
		breadcrumbs?: Crumb[];
		/** The page's main thing as schema.org data, e.g. `{ '@type': 'Article', … }`. */
		schema?: Record<string, unknown>;
	} = $props();

	const fullTitle = $derived(title ? `${title} · ${site.name}` : site.title);
	const canonical = $derived(site.url + page.url.pathname);
	const imageUrl = $derived(image.startsWith('http') ? image : site.url + image);
	const isHome = $derived(page.url.pathname === '/');

	// Structured data (schema.org): who runs the site, where the company is based and
	// where this page sits — search engines use it for rich results and the knowledge panel.
	const ORG = `${site.url}/#organization`;
	const PERSON = `${site.url}/#founder`;
	const WEBSITE = `${site.url}/#website`;
	const portrait = home.find((s) => s.type === 'about')?.portrait?.src;
	const sameAs = site.socials.map((s) => s.href);

	const jsonLd = $derived.by(() => {
		const crumbs: Crumb[] = isHome
			? []
			: [{ name: 'Home', path: '/' }, ...breadcrumbs, { name: title ?? site.name, path: page.url.pathname }];
		const graph: Record<string, unknown>[] = [
			{
				'@type': 'Organization',
				'@id': ORG,
				name: site.name,
				alternateName: site.shortName,
				url: `${site.url}/`,
				logo: { '@type': 'ImageObject', url: `${site.url}/logo-512.png`, width: 512, height: 512 },
				description: site.description,
				email: site.email,
				address: {
					'@type': 'PostalAddress',
					streetAddress: site.address.street,
					postalCode: site.address.postalCode,
					addressLocality: site.address.city,
					addressCountry: site.address.country
				},
				founder: { '@id': PERSON },
				sameAs
			},
			{
				'@type': 'Person',
				'@id': PERSON,
				name: site.owner,
				url: `${site.url}/#about`,
				...(portrait && { image: site.url + portrait }),
				worksFor: { '@id': ORG },
				sameAs
			},
			{
				'@type': 'WebSite',
				'@id': WEBSITE,
				url: `${site.url}/`,
				name: site.name,
				inLanguage: site.lang,
				publisher: { '@id': ORG }
			},
			{
				'@type': 'WebPage',
				'@id': canonical,
				url: canonical,
				name: fullTitle,
				description,
				inLanguage: site.lang,
				isPartOf: { '@id': WEBSITE },
				primaryImageOfPage: { '@type': 'ImageObject', url: imageUrl },
				...(crumbs.length && { breadcrumb: { '@id': `${canonical}#breadcrumb` } })
			}
		];
		if (crumbs.length) {
			graph.push({
				'@type': 'BreadcrumbList',
				'@id': `${canonical}#breadcrumb`,
				itemListElement: crumbs.map((c, i) => ({
					'@type': 'ListItem',
					position: i + 1,
					name: c.name,
					item: site.url + c.path
				}))
			});
		}
		if (schema) {
			graph.push({
				'@id': `${canonical}#main`,
				url: canonical,
				image: imageUrl,
				mainEntityOfPage: { '@id': canonical },
				...schema
			});
		}
		// `<` escaped so text inside the data can never close the script tag.
		return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(
			/</g,
			'\\u003c'
		);
	});
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
	<meta property="og:image:alt" content={fullTitle} />
	{#if image === site.ogImage}
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
	{/if}
	<meta name="twitter:card" content="summary_large_image" />
	{#if !noindex}
		{@html `<script type="application/ld+json">${jsonLd}</` + `script>`}
	{/if}
</svelte:head>
