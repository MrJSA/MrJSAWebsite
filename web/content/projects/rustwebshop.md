---
title: RustCraft Webshop
summary: A self-hosted webshop with a Rust backend and SvelteKit storefront and admin — payments, invoices, inventory and German/EU legal features in one Docker stack.
date: 2026-10-16
category: Software
status: Work in progress
featured: true
tags: [Rust, Axum, SQLx, PostgreSQL, SvelteKit, Docker, Stripe, PayPal]
links:
  - label: Source on GitHub
    href: https://github.com/MrJSA/rustwebshop
    icon: github
---

## What it is

RustCraft is a complete online shop that you host yourself. A Rust API does the heavy lifting, while two
SvelteKit apps provide the customer-facing storefront and the admin dashboard. The whole thing runs as a single
Docker Compose stack — including database backups and one-click updates.

## Highlights

- **Catalogue & inventory** — physical and digital products with variants, images and stock, unlimited nested
  categories, and a bill-of-materials system that calculates product stock from shared parts. Low-stock alerts
  and a back-in-stock waitlist included.
- **Checkout & payments** — Stripe and PayPal, coupons, shipping zones with weight-based rates and tracking
  links. Digital-only orders skip shipping entirely.
- **Orders & documents** — status workflow, PDF invoices and packing slips, customer accounts with downloads.
- **Emails** — branded templates for orders, shipping, verification and password resets over any SMTP server.
- **Built for Germany & the EU** — order-button wording, withdrawal waiver, tax modes, sequential order
  numbers, legal page templates and a cookie consent banner.
- **Administration** — role-based access, JSON export/import of store data, a media library with automatic
  WebP conversion and admin-triggered updates with automatic database backups.

## Architecture

| Service      | Technology        | Role                                            |
| ------------ | ----------------- | ----------------------------------------------- |
| `backend`    | Rust, Axum, SQLx  | REST API, checkout, payments, emails, PDFs      |
| `storefront` | SvelteKit         | Server-rendered customer shop                   |
| `admin`      | SvelteKit         | Admin dashboard                                 |
| `db`         | PostgreSQL 16     | Data storage on an internal network             |
| `updater`    | Rust              | Watches releases, backs up the DB, rebuilds     |
| `proxy`      | Caddy (optional)  | Automatic HTTPS for shop and admin domains      |

> The project is still in active development — test thoroughly before running it in production.
