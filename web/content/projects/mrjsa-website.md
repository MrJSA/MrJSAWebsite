---
title: This Website
summary: A fast, fully static portfolio built with Svelte and served by a tiny Rust web server in Docker.
date: 2026-10-16
category: Software
status: Live
featured: true
tags: [Rust, Svelte, SvelteKit, Docker, GitHub Actions]
links:
  - label: Source on GitHub
    href: https://github.com/MrJSA/MrJSAWebsite
    icon: github
---

## Why

I wanted a home on the web that is **quick to load**, **easy to extend** and that I fully control — no
page builders, no trackers, no database.

And I didn't want any PHP. No WordPress, no plugins that need weekly security updates, no admin login waiting
to be brute-forced. Most of the web still runs on that stack, and for a site that changes a few times a month
it is far more moving parts than necessary. So I built it the way I build the rest of my software: in Rust,
with as little as possible running on the server.

## How it works

- Content lives in plain Markdown files. A new project is a new file, hiding one is a single line.
- **SvelteKit** renders every page to static HTML at build time, so the server never generates anything
  on request.
- A small **Rust** server (axum) — under 300 lines — serves the files with precompressed Brotli/Gzip,
  long-term caching for assets and security headers on every response.
- The Docker image contains nothing but that server and the built files: no shell, no package manager,
  no interpreter, and it runs as an unprivileged user with a read-only file system.
- **GitHub Actions** checks and builds a new image on every push, and the server pulls it with a single
  command. If the new version doesn't start, it rolls back automatically.
- **Caddy** sits in front for automatic HTTPS, on the same server as my [RustCraft](/projects/rustcraft/) shop.

## Two languages, no library

The site is available in English and German, and the translation is built in-house instead of using an i18n
package — for a small, fully static site that is a few helper functions, not a dependency.

- English lives at `/…`, German under `/de/…`. Both are prerendered, so every language is just more static HTML.
- A German page is a Markdown file next to the English one (`.de.md`). If there is no translation yet, the
  English version is shown instead.
- The interface labels — buttons, menus, footer — sit in one typed object per language, so a missing
  translation is a type error, not a blank spot on the page.
- Browsers set to German get the German pages automatically. The switch in the header links to the same page
  in the other language and remembers your choice.

## Privacy by design

No cookies, no analytics, no ads and no third-party requests — fonts, images and scripts all come from my own
server. That also means there is no cookie banner, because there is nothing to consent to.
