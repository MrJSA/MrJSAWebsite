---
title: RustCraft Webshop
summary: A self-hosted webshop with a Rust backend and SvelteKit storefront and admin — payments, invoices, inventory and German/EU legal features in one Docker stack with one-click updates.
date: 2026-10-16
category: Software
status: Live
featured: true
tags: [Rust, Axum, SQLx, PostgreSQL, SvelteKit, Docker, Stripe, PayPal]
links:
  - label: See it in action
    href: https://shop.mrjsa.com
    icon: bag
  - label: Source on GitHub
    href: https://github.com/MrJSA/RustCraft
    icon: github
  - label: Wiki
    href: https://github.com/MrJSA/RustCraft/wiki
    icon: file
---

## What it is

RustCraft is a complete online shop that you host yourself. A Rust API (Axum, SQLx, PostgreSQL) does the heavy
lifting, while two SvelteKit apps provide the customer-facing storefront and the admin dashboard. Everything ships
as one Docker Compose stack with one-click updates — [shop.mrjsa.com](https://shop.mrjsa.com) runs on it.

## Highlights

- **Catalogue & inventory** — physical and digital products with variants, per-variant images and stock, and
  unlimited nested categories. A bill-of-materials system shares parts by SKU and calculates how many units can be
  built; sales update part stock automatically. Low-stock alerts and a back-in-stock waitlist included.
- **Checkout & payments** — Stripe (cards, Apple Pay, Google Pay, Klarna, SEPA, iDEAL and more) and PayPal,
  coupons, and shipping zones with weight-based rates and tracking links. Digital-only orders skip shipping.
- **Orders & documents** — status workflow, PDF invoices attached to the payment email, optional EN 16931
  e-invoices (ZUGFeRD / Factur-X), packing slips, credit notes, and customer accounts with downloads.
- **Storefront** — two homepage hero layouts, product carousels, custom logo, menus and Markdown pages, plus
  optional reviews from verified buyers and a double opt-in newsletter.
- **Emails** — one branded layout for orders, shipping, back-in-stock, verification and password resets over any
  SMTP server, with test sends from the admin.
- **Built for Germany & the EU** — order-button wording, withdrawal button and digital-goods waiver, tax modes
  (small business, B2C, B2B), sequential order numbers, 30-day lowest price for sales, VIES check for EU
  businesses, GPSR product safety info, legal page templates and a cookie consent banner.
- **Administration** — roles with per-section permissions, JSON export/import of store data, a media library with
  automatic WebP conversion, scheduled backups to a private GitHub repository, and updates from the admin on a
  stable or beta channel with an automatic database backup first.

## Architecture

| Service      | Technology        | Role                                                    |
| ------------ | ----------------- | ------------------------------------------------------- |
| `backend`    | Rust, Axum, SQLx  | REST API, checkout, payments, emails, PDFs, migrations  |
| `storefront` | SvelteKit         | Server-rendered customer shop                           |
| `admin`      | SvelteKit         | Admin dashboard                                         |
| `db`         | PostgreSQL 16     | Data storage on an internal network                     |
| `updater`    | Rust              | Checks releases, backs up the DB, rebuilds the stack    |
| `proxy`      | Caddy (optional)  | Automatic HTTPS for shop and admin domains              |

Installing it on your own server? The [installation guide](https://github.com/MrJSA/RustCraft/wiki/Installation)
in the wiki covers domains, HTTPS, first login, backups and updates.
