---
title: X32 / M32 Praxishandbuch
summary: Ein vollständiges technisches Handbuch und Praxisleitfaden für die Digitalmischpulte Behringer X32 und Midas M32 — 19 Kapitel von Gain Staging und AES50-Stageboxen bis Waves SuperRack Performer, auf Deutsch und Englisch.
category: Audio
tags: [Live-Sound, Behringer X32, Midas M32, AES50, Waves SuperRack, SvelteKit, Rust, Docker]
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

Über das Pult hinaus geht es auch um die Bühne und alles drumherum: DI-Boxen und symmetrische Leitungen,
Mikrofonierung, Einmessen der Anlage und Funkgrundlagen. Vier Kapitel zeigen, wie man **Waves SuperRack
Performer** neben dem X32 betreibt — den kompletten Waves-Plugin-Katalog über die vorhandene X-USB- oder
X-LIVE-Karte, ohne SoundGrid-Server.

## Was es abdeckt

| #   | Kapitel                               | Schwerpunkt                                                               |
| --- | ------------------------------------- | ------------------------------------------------------------------------- |
| 01  | Hardware & Bedienoberfläche           | Faderbänke, Kanalzug, Display, Scribble Strips, die fünf Modelle          |
| 02  | Stageboxen & AES50-Netzwerke          | S16/S32/SD/DL-Stageboxen, geschirmte Kabel, Clocking, Kaskaden            |
| 03  | Routing & Patching                    | Achterblöcke, Abgriffpunkte, +M-Abgriffe, XLR/Aux/Ultranet/Card-Ausgänge  |
| 04  | User Routing ab Firmware 4.x          | 1:1-Patching mit User In / User Out, mehrere Stageboxen                   |
| 05  | Gain Staging & Vorverstärker          | Headamp vs. Trim, Phantomspeisung, Gain Split, DI-Boxen, Mikrofonierung   |
| 06  | Kanalbearbeitung                      | Low Cut, Gate/Ducker, 4-Band-PEQ, Parallelkompression, Grenzen von Aux In |
| 07  | Mix-Busse, Sends on Faders & Matrizen | Wedges vs. IEMs, Subgruppen, die sechs Matrix-Mixe                        |
| 08  | DCAs & Mute-Gruppen                   | DCA vs. Subgruppe, Pre/Post-Fader-Fallen, DCA Spill                       |
| 09  | Virtuelles Effekt-Rack                | 1176/LA-2A/Fairchild-Modelle, Pultec-EQs, Hall und Delay                  |
| 10  | Abhören, Solo & Talkback              | PFL vs. AFL, Talkback A/B, Oszillator, Dugan-Automixer                    |
| 11  | Persönliches Monitoring               | Ultranet P16 und Midas DP48 über AES50                                    |
| 12  | Szenen, Cues & Snippets               | Show-Hierarchie, Parameter- und Channel-Safes                             |
| 13  | Aufnahme & Erweiterungskarten         | USB-Recorder, X-USB, X-LIVE-SD-Aufnahme, alle Karten im Vergleich         |
| 14  | Netzwerk & Fernsteuerung              | Statische IP, WLAN, sicheres Sync mit X32-Edit, Mixing Station, OSC       |
| 15  | Live-Mixing-Workflows                 | Soundcheck, PA-Laufzeitausgleich, Einpfeifen, Streaming, Einmessen, Funk  |
| 16  | Waves SuperRack Performer: Einrichtung | Nativer Plugin-Host über X-USB / X-LIVE, Hardware-Checkliste, Mute-Test  |
| 17  | SuperRack-Routing-Methoden            | Direkteingang, Aux-Inserts, Ultranet-Subgruppen, X-DANTE, User Routing    |
| 18  | SuperRack: Latenz & Puffergröße       | Round-Trip-Latenz, Grenzen für IEMs und Wedges, Bild-Ton-Synchronität     |
| 19  | SuperRack-Plugin-Ketten               | Ketten für Leadgesang und Summe, ein ausfallsicherer Ablauf               |

## Wie es gebaut ist

Das Handbuch nutzt denselben Stack wie diese Website: Jedes Kapitel ist in Markdown geschrieben und wird mit
SvelteKit zu statischem HTML vorgerendert — inklusive einer Volltextsuche, die erst bei Bedarf lädt, einer
Kapitel-Seitenleiste und echten Tabellen statt ASCII-Diagrammen. Das Design setzt auf weiche, abgerundete Karten mit
Farbverläufen, treibende Wellenlinien hinter jeder Seite und ein Punktraster, das rund um den Mauszeiger aufleuchtet.
Jede Seite bringt Vorschaubilder für soziale Netzwerke, strukturierte Daten für Suchmaschinen und deutsch-englische
Sprachverweise mit.

Ein winziger Rust-Server (axum) liefert vorkomprimierte Brotli/Gzip-Dateien mit strenger Content-Security-Policy aus
einem schreibgeschützten `scratch`-Container von etwa 10 MB. Keine Cookies, keine Tracker, keine Datenbank — nur
schnelle Seiten, die auch am FOH-Platz bei schwachem Empfang noch auf dem Handy laden.
