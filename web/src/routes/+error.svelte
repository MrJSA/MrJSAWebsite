<script lang="ts">
	import { page } from '$app/state';
	import Icon from '#lib/components/Icon.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { locale } from '#lib/locale.svelte.js';

	const { t, href } = $derived(locale());
</script>

<Seo title={page.status === 404 ? t.notFoundTitle : t.errorTitle} noindex />

<section class="section">
	<div class="container wrap">
		<span class="code">{page.status}</span>
		<h1>{page.status === 404 ? t.notFoundHeading : t.errorHeading}</h1>
		<p class="muted">
			{page.status === 404
				? t.notFoundText
				: page.error?.message}
		</p>
		<a class="btn btn-primary" href={href('/')}><Icon name="back" size={18} /> {t.backHome}</a>
	</div>
</section>

<style>
	.wrap {
		display: grid;
		justify-items: start;
		gap: 18px;
		padding-block: 40px;
	}
	.code {
		font-family: var(--font-mono);
		font-size: clamp(4rem, 14vw, 9rem);
		line-height: 1;
		font-weight: 700;
		background: linear-gradient(95deg, var(--accent), var(--accent-2));
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}
	h1 {
		font-size: clamp(1.8rem, 4vw, 2.6rem);
	}
	.btn {
		margin-top: 12px;
	}
</style>
