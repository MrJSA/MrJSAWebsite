---
# ── Example / template ───────────────────────────────────────────
# `draft: true` means this only shows up in `npm run dev`, never in production.
# Copy this file, rename it (the file name becomes the URL), fill it in and remove `draft`.
title: Example PCB Project
summary: One or two sentences that appear on the project card.
date: 2026-01-15            # used for sorting (newest first)
# order: 1                  # optional: lower numbers are shown first, overrides date
category: Hardware          # shown as a badge and used for the filter on /projects/
status: Prototype           # optional free text: Live, Prototype, In progress, Archived, …
featured: true              # optional: used by `onlyFeatured` on the homepage
tags: [KiCad, ESP32, 4-layer, Rust]
cover: /images/projects/example-pcb.svg   # optional: put the image in web/static/images/…
links:
  - label: GitHub
    href: https://github.com/MrJSA
    icon: github            # any key from src/lib/components/Icon.svelte
draft: true
---

Everything below the frontmatter is normal **Markdown**.

## The problem

Describe what the project solves.

## The design

![Board render](/images/projects/example-pcb.svg)

| Spec      | Value          |
| --------- | -------------- |
| Layers    | 4              |
| MCU       | ESP32-S3       |
| Size      | 50 × 30 mm     |

```rust
#[embassy_executor::main]
async fn main(_spawner: Spawner) {
    // firmware snippet
}
```
