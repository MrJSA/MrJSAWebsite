---
title: Diese Website
summary: Ein schnelles, komplett statisches Portfolio, gebaut mit Svelte und ausgeliefert von einem winzigen Rust-Webserver in Docker.
links:
  - label: Quellcode auf GitHub
    href: https://github.com/MrJSA/MrJSAWebsite
    icon: github
---

## Warum

Ich wollte ein Zuhause im Netz, das **schnell lädt**, **leicht erweiterbar** ist und das ich komplett selbst in
der Hand habe — keine Baukästen, keine Tracker, keine Datenbank.

Und ich wollte kein PHP. Kein WordPress, keine Plugins, die jede Woche Sicherheitsupdates brauchen, kein
Admin-Login, das darauf wartet, per Brute Force geknackt zu werden. Ein Großteil des Webs läuft noch auf diesem
Stack, und für eine Seite, die sich ein paarmal im Monat ändert, sind das viel zu viele bewegliche Teile. Also
habe ich sie so gebaut wie den Rest meiner Software: in Rust, mit so wenig wie möglich auf dem Server.

## Wie sie funktioniert

- Inhalte liegen in einfachen Markdown-Dateien. Ein neues Projekt ist eine neue Datei, eines auszublenden
  eine einzige Zeile. Übersetzungen liegen als `.de.md` direkt daneben.
- **SvelteKit** rendert beim Build jede Seite zu statischem HTML, der Server erzeugt also nie etwas
  auf Anfrage.
- Ein kleiner **Rust**-Server (axum) — unter 300 Zeilen — liefert die Dateien vorkomprimiert mit Brotli/Gzip aus,
  mit langem Caching für Assets und Sicherheits-Headern bei jeder Antwort.
- Das Docker-Image enthält nichts außer diesem Server und den fertigen Dateien: keine Shell, keinen
  Paketmanager, keinen Interpreter, und es läuft als unprivilegierter Benutzer mit schreibgeschütztem
  Dateisystem.
- **GitHub Actions** prüft und baut bei jedem Push ein neues Image, der Server holt es mit einem einzigen
  Befehl. Startet die neue Version nicht, wird automatisch zurückgerollt.
- Davor sitzt **Caddy** für automatisches HTTPS, auf demselben Server wie mein Shop
  [RustCraft](/de/projects/rustcraft/).

## Datenschutz von Anfang an

Keine Cookies, keine Analyse, keine Werbung und keine Anfragen an Dritte — Schriften, Bilder und Skripte kommen
alle von meinem eigenen Server. Deshalb gibt es auch keinen Cookie-Banner: Es gibt nichts, dem man zustimmen
müsste.
