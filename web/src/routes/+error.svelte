<script lang="ts">
	import { page } from '$app/state';
	import Icon from '#lib/components/Icon.svelte';
	import Seo from '#lib/components/Seo.svelte';
</script>

<Seo title={page.status === 404 ? 'Page not found' : 'Error'} noindex />

<section class="section">
	<div class="container wrap">
		<span class="code">{page.status}</span>
		<h1>{page.status === 404 ? 'This trace leads nowhere.' : 'Something went wrong.'}</h1>
		<p class="muted">
			{page.status === 404
				? 'The page you are looking for does not exist or has been moved.'
				: page.error?.message}
		</p>
		<a class="btn btn-primary" href="/"><Icon name="back" size={18} /> Back to home</a>
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
