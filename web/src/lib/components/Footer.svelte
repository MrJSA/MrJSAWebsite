<script lang="ts">
	import { site } from '#lib/config/site.js';
	import type { Link } from '#lib/types.js';
	import Icon from './Icon.svelte';
	import Logo from './Logo.svelte';

	let { legal = [] }: { legal?: Link[] } = $props();
	const year = new Date().getFullYear();
</script>

<footer>
	<div class="container grid">
		<div class="brand">
			<Logo />
			<p class="muted">{site.description}</p>
		</div>

		<nav aria-label="Footer">
			<h2>Site</h2>
			<ul>
				{#each site.nav as item (item.href)}
					<li><a href={item.href}>{item.label}</a></li>
				{/each}
			</ul>
		</nav>

		<div>
			<h2>Connect</h2>
			<ul>
				<li>
					<a href="mailto:{site.email}"><Icon name="mail" size={16} />{site.email}</a>
				</li>
				{#each site.socials as s (s.href)}
					<li>
						<a href={s.href} target="_blank" rel="noopener noreferrer"
							><Icon name={s.icon ?? 'globe'} size={16} />{s.label}</a
						>
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<div class="watermark" aria-hidden="true">{site.shortName}</div>

	<div class="container bottom">
		<span>© {year} {site.name} · {site.owner}</span>
		<ul class="legal">
			{#each legal as l (l.href)}
				<li><a href={l.href}>{l.label}</a></li>
			{/each}
		</ul>
	</div>
</footer>

<style>
	footer {
		position: relative;
		overflow: hidden;
		margin-top: 40px;
		border-top: 1px solid var(--border);
		background: var(--bg-elev);
		font-size: 0.93rem;
	}
	.grid {
		display: grid;
		grid-template-columns: 2fr 1fr 1fr;
		gap: 40px;
		padding-block: 56px 40px;
	}
	.brand p {
		margin-top: 14px;
		max-width: 38ch;
	}
	h2 {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--text-faint);
		margin-bottom: 14px;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 10px;
	}
	ul a {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		color: var(--text-muted);
		transition: color 0.2s;
		word-break: break-all;
	}
	ul a:hover {
		color: var(--accent);
	}
	.watermark {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(5rem, 24vw, 22rem);
		line-height: 0.8;
		text-align: center;
		letter-spacing: -0.02em;
		color: transparent;
		-webkit-text-stroke: 1px var(--border-strong);
		background: linear-gradient(180deg, var(--accent-soft), transparent 80%);
		-webkit-background-clip: text;
		background-clip: text;
		user-select: none;
		margin-bottom: -0.12em;
	}
	.bottom {
		position: relative;
		background: var(--bg-elev);
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 16px;
		padding-block: 20px 28px;
		border-top: 1px solid var(--border);
		color: var(--text-faint);
		font-size: 0.85rem;
	}
	.legal {
		display: flex;
		gap: 20px;
	}
	@media (max-width: 760px) {
		.grid {
			grid-template-columns: 1fr 1fr;
		}
		.brand {
			grid-column: 1 / -1;
		}
	}
</style>
