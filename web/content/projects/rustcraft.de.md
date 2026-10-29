---
summary: Ein selbst gehosteter Webshop mit Rust-Backend sowie SvelteKit-Storefront und -Admin — Zahlungen, Rechnungen, Lagerverwaltung und Funktionen für deutsches/EU-Recht in einem Docker-Stack mit Ein-Klick-Updates.
category: Software
links:
  - label: Live ansehen
    href: https://shop.mrjsa.com
    icon: bag
  - label: Quellcode auf GitHub
    href: https://github.com/MrJSA/RustCraft
    icon: github
  - label: Wiki
    href: https://github.com/MrJSA/RustCraft/wiki
    icon: file
---

## Worum es geht

RustCraft ist ein kompletter Onlineshop, den du selbst hostest. Eine Rust-API (Axum, SQLx, PostgreSQL) erledigt
die schwere Arbeit, zwei SvelteKit-Apps liefern den Shop für Kunden und das Admin-Dashboard. Alles kommt als ein
Docker-Compose-Stack mit Ein-Klick-Updates — [shop.mrjsa.com](https://shop.mrjsa.com) läuft damit.

## Highlights

- **Katalog & Lager** — physische und digitale Produkte mit Varianten, Bildern und Bestand je Variante sowie
  beliebig verschachtelten Kategorien. Eine Stückliste teilt Bauteile per SKU und berechnet, wie viele Einheiten
  gebaut werden können; Verkäufe buchen den Bauteilbestand automatisch ab. Mit Warnungen bei niedrigem Bestand
  und einer Benachrichtigung, sobald ein Artikel wieder verfügbar ist.
- **Checkout & Zahlung** — Stripe (Karten, Apple Pay, Google Pay, Klarna, SEPA, iDEAL und mehr) und PayPal,
  Gutscheine sowie Versandzonen mit gewichtsabhängigen Preisen und Sendungsverfolgung. Rein digitale Bestellungen
  überspringen den Versand.
- **Bestellungen & Dokumente** — Status-Workflow, PDF-Rechnungen im Anhang der Zahlungsbestätigung, optional
  E-Rechnungen nach EN 16931 (ZUGFeRD / Factur-X), Lieferscheine, Gutschriften und Kundenkonten mit Downloads.
- **Shop** — zwei Layouts für die Startseite, Produktkarussells, eigenes Logo, Menüs und Markdown-Seiten,
  dazu optional Bewertungen verifizierter Käufer und ein Newsletter mit Double-Opt-in.
- **E-Mails** — ein einheitliches Layout für Bestellung, Versand, Wieder-verfügbar, Bestätigung und
  Passwort-Reset über jeden SMTP-Server, mit Testversand aus dem Admin.
- **Gemacht für Deutschland & die EU** — „Zahlungspflichtig bestellen“-Button, Widerrufsbutton und Verzicht auf
  das Widerrufsrecht bei digitalen Gütern, Steuermodi (Kleinunternehmer, B2C, B2B), fortlaufende
  Bestellnummern, niedrigster Preis der letzten 30 Tage bei Rabatten, VIES-Prüfung für EU-Unternehmen,
  GPSR-Produktsicherheitsangaben, Vorlagen für Rechtstexte und ein Cookie-Banner.
- **Verwaltung** — Rollen mit Rechten je Bereich, JSON-Export/-Import der Shopdaten, eine Mediathek mit
  automatischer WebP-Umwandlung, geplante Backups in ein privates GitHub-Repository und Updates aus dem Admin
  über einen Stable- oder Beta-Kanal, mit automatischem Datenbank-Backup vorab.

## Architektur

| Dienst       | Technik           | Aufgabe                                                      |
| ------------ | ----------------- | ------------------------------------------------------------ |
| `backend`    | Rust, Axum, SQLx  | REST-API, Checkout, Zahlungen, E-Mails, PDFs, Migrationen    |
| `storefront` | SvelteKit         | Serverseitig gerenderter Shop für Kunden                     |
| `admin`      | SvelteKit         | Admin-Dashboard                                              |
| `db`         | PostgreSQL 16     | Datenspeicher in einem internen Netzwerk                     |
| `updater`    | Rust              | Prüft auf neue Releases, sichert die DB, baut den Stack neu  |
| `proxy`      | Caddy (optional)  | Automatisches HTTPS für Shop- und Admin-Domain               |

Du willst ihn auf deinem eigenen Server installieren? Die
[Installationsanleitung](https://github.com/MrJSA/RustCraft/wiki/Installation) im Wiki (auf Englisch) erklärt
Domains, HTTPS, den ersten Login, Backups und Updates.
