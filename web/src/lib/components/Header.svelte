<script lang="ts">
	import { page } from '$app/state';
	import { site } from '#lib/config/site.js';
	import Icon from './Icon.svelte';
	import Logo from './Logo.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	let open = $state(false);
	let scrolled = $state(false);

	// Close the mobile menu after navigating.
	$effect(() => {
		page.url.pathname;
		open = false;
	});

	function isActive(href: string) {
		return !href.includes('#') && href !== '/' && page.url.pathname.startsWith(href);
	}
</script>

<svelte:window onscroll={() => (scrolled = window.scrollY > 8)} />

<header class:scrolled class:open>
	<div class="container bar">
		<Logo />

		<nav aria-label="Main">
			<ul id="main-nav">
				{#each site.nav as item (item.href)}
					<li>
						<a href={item.href} class:active={isActive(item.href)} onclick={() => (open = false)}
							>{item.label}</a
						>
					</li>
				{/each}
			</ul>
		</nav>

		<div class="actions">
			<a class="shop" href={site.shop.href}>
				<Icon name={site.shop.icon} size={16} />
				<span>{site.shop.label}</span>
			</a>
			<ThemeToggle />
			<button
				class="menu"
				aria-label={open ? 'Close menu' : 'Open menu'}
				aria-expanded={open}
				aria-controls="main-nav"
				onclick={() => (open = !open)}
			>
				<Icon name={open ? 'close' : 'menu'} size={20} />
			</button>
		</div>
	</div>
</header>

<style>
	header {
		position: sticky;
		top: 0;
		z-index: 50;
		/* Stays put while the page content cross-fades on navigation. */
		view-transition-name: site-header;
		height: var(--header-h);
		border-bottom: 1px solid transparent;
		transition:
			background 0.3s var(--ease),
			border-color 0.3s var(--ease);
	}
	header.scrolled,
	header.open {
		background: color-mix(in srgb, var(--bg) 78%, transparent);
		backdrop-filter: saturate(160%) blur(14px);
		-webkit-backdrop-filter: saturate(160%) blur(14px);
		border-bottom-color: var(--border);
	}
	.bar {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
	}
	ul {
		display: flex;
		gap: 4px;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	nav a {
		display: block;
		padding: 8px 14px;
		border-radius: 999px;
		color: var(--text-muted);
		font-size: 0.93rem;
		font-weight: 500;
		transition:
			color 0.2s,
			background 0.2s;
	}
	nav a:hover,
	nav a.active {
		color: var(--text);
		background: var(--surface-2);
	}
	.actions {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.shop {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		height: 38px;
		padding: 0 14px;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
		background: var(--accent-soft);
		color: var(--accent);
		font-size: 0.9rem;
		font-weight: 600;
		transition:
			background 0.2s,
			color 0.2s,
			box-shadow 0.2s;
	}
	.shop:hover {
		background: var(--accent);
		color: var(--accent-ink);
		box-shadow: var(--glow);
	}
	.menu {
		display: none;
		place-items: center;
		width: 38px;
		height: 38px;
		border-radius: 999px;
		border: 1px solid var(--border);
		background: transparent;
		color: var(--text);
		cursor: pointer;
	}

	@media (max-width: 760px) {
		.menu {
			display: grid;
		}
		.shop {
			padding: 0 12px;
		}
		nav {
			position: absolute;
			top: var(--header-h);
			left: 0;
			right: 0;
			padding: 8px var(--gutter) 20px;
			background: var(--bg);
			border-bottom: 1px solid var(--border);
			transform: translateY(-8px);
			opacity: 0;
			pointer-events: none;
			transition:
				opacity 0.25s var(--ease),
				transform 0.25s var(--ease);
		}
		header.open nav {
			transform: none;
			opacity: 1;
			pointer-events: auto;
		}
		ul {
			flex-direction: column;
		}
		nav a {
			padding: 14px 12px;
			font-size: 1.05rem;
			border-radius: var(--radius-sm);
		}
	}
</style>
