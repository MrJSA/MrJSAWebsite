---
title: X32 / M32 Praxishandbuch
summary: Ein vollständiges technisches Handbuch und Praxisleitfaden für die Digitalmischpulte Behringer X32 und Midas M32 — 15 Kapitel von Gain Staging bis AES50-Stageboxen, auf Deutsch und Englisch.
category: Audio
tags: [Live-Sound, Behringer X32, Midas M32, AES50, SvelteKit, Rust, Docker]
links:
  - label: Handbuch lesen
    href: https://x32.mrjsa.com/de/
    icon: file
  - label: Quellcode auf GitHub
    href: https://github.com/MrJSA/X32-Manual
    icon: github
---

## Worum es geht

Das X32 / M32 Praxishandbuch ist eine praxisnahe, ausführliche Referenz zum Einrichten, Routen, Bearbeiten und
Mischen auf den Digitalpulten Behringer X32 und Midas M32 mit Firmware 4.x. Es ist aus der Sicht von jemandem
geschrieben, der bei einer echten Show hinter dem Pult steht: was jedes Bedienelement macht, wohin das Signal
wirklich läuft und zu welchen Einstellungen man beim Soundcheck greift. Alles gilt gleichermaßen für X32 Full,
Compact, Producer, Rack und Core sowie für Midas M32 / M32R.

## Was es abdeckt

| #   | Kapitel                               | Schwerpunkt                                                         |
| --- | ------------------------------------- | ------------------------------------------------------------------- |
| 01  | Hardware & Bedienoberfläche           | Faderbänke, Kanalzug, Display, Scribble Strips, Rückseite           |
| 02  | Stageboxen & AES50-Netzwerke          | S16/S32/SD/DL-Stageboxen, geschirmte Kabel, Clocking, Kaskaden      |
| 03  | Routing & Patching                    | Achterblöcke, Abgriffpunkte, XLR/Aux/Ultranet/Card-Ausgänge         |
| 04  | User Routing ab Firmware 4.x          | 1:1-Patching mit User In / User Out, mehrere Stageboxen             |
| 05  | Gain Staging & Vorverstärker          | Headamp vs. Trim, Zielpegel −18 dBFS, Phantomspeisung, Gain Split   |
| 06  | Kanalbearbeitung                      | Low Cut, Gate/Ducker, 4-Band-PEQ mit RTA, Parallelkompression       |
| 07  | Mix-Busse, Sends on Faders & Matrizen | Wedges vs. IEMs, Subgruppen, die sechs Matrix-Mixe                  |
| 08  | DCAs & Mute-Gruppen                   | DCA vs. Subgruppe, Pre/Post-Fader-Fallen, DCA Spill                 |
| 09  | Virtuelles Effekt-Rack                | 1176/LA-2A/Fairchild-Modelle, Pultec-EQs, Hall und Delay            |
| 10  | Abhören, Solo & Talkback              | PFL vs. AFL, Talkback A/B, Oszillator, Dugan-Automixer              |
| 11  | Persönliches Monitoring               | Ultranet P16 und Midas DP48 über AES50                              |
| 12  | Szenen, Cues & Snippets               | Show-Hierarchie, Parameter- und Channel-Safes                       |
| 13  | Aufnahme & Erweiterungskarten         | USB-Recorder, X-USB, X-LIVE-SD-Aufnahme, virtueller Soundcheck      |
| 14  | Netzwerk & Fernsteuerung              | Statische IP, WLAN, sicheres Sync mit X32-Edit, Mixing Station, OSC |
| 15  | Live-Mixing-Workflows                 | Soundcheck-Ablauf, PA-Laufzeitausgleich, Einpfeifen, Streaming      |

## Wie es gebaut ist

Das Handbuch nutzt denselben Stack wie diese Website: Jedes Kapitel ist in Markdown geschrieben und wird mit
SvelteKit zu statischem HTML vorgerendert — inklusive Volltextsuche, Kapitel-Seitenleiste und echten Tabellen
statt ASCII-Diagrammen. Ein winziger Rust-Server (axum) liefert vorkomprimierte Brotli/Gzip-Dateien aus einem
schreibgeschützten `scratch`-Container von etwa 10 MB. Keine Cookies, keine Tracker, keine Datenbank — nur
schnelle Seiten, die auch am FOH-Platz bei schwachem Empfang noch auf dem Handy laden.
