<script lang="ts">
	import { site } from '#lib/config/site.js';
</script>

<a href="/" class="logo" aria-label="{site.name} — home">
	<img src="/icon-192.png" alt="" width="38" height="38" />
	<span class="word">
		<strong>{site.shortName}</strong>
		<small>Technologies</small>
	</span>
</a>

<style>
	.logo {
		display: inline-flex;
		align-items: center;
		gap: 11px;
	}
	img {
		border-radius: 9px;
		box-shadow: 0 0 0 1px var(--border);
	}
	.word {
		display: flex;
		flex-direction: column;
		line-height: 1;
		font-family: var(--font-display);
	}
	strong {
		font-size: 1.2rem;
		font-weight: 700;
		letter-spacing: 0.01em;
	}
	small {
		margin-top: 3px;
		font-size: 0.68rem;
		font-weight: 500;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--text-muted);
	}
</style>
