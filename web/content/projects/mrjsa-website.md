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

## How it works

- Content lives in plain Markdown files. A new project is a new file.
- **SvelteKit** renders every page to static HTML at build time.
- A small **Rust** server (axum) serves the files with Brotli/Gzip compression,
  long-term caching and security headers.
- **GitHub Actions** builds a Docker image on every push, and the server pulls the new version with a single command.
