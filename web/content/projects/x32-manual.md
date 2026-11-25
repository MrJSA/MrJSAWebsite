---
title: X32 / M32 Field Guide
summary: A complete technical manual and field guide for the Behringer X32 and Midas M32 digital mixing consoles — 19 chapters from gain staging and AES50 stageboxes to Waves SuperRack Performer, in English and German.
date: 2026-11-08
order: 3
category: Audio
status: Live
cover: /images/projects/x32-manual.webp
featured: true
tags: [Live Sound, Behringer X32, Midas M32, AES50, Waves SuperRack, SvelteKit, Rust, Docker]
links:
  - label: Read the manual
    href: https://x32.mrjsa.com
    icon: file
  - label: Source on GitHub
    href: https://github.com/MrJSA/X32-Manual
    icon: github
---

## What it is

The X32 / M32 Field Guide is a practical, in-depth reference for configuring, routing, processing and mixing on
the Behringer X32 and Midas M32 digital consoles running firmware 4.x. It is written from the perspective of
someone standing behind the desk at a real show: what each control does, where the signal actually goes, and
which settings to reach for during soundcheck. Everything applies equally to the X32 Full, Compact, Producer,
Rack and Core as well as the Midas M32 / M32R.

Beyond the console itself, the guide covers what happens on stage and around it: DI boxes and balanced lines,
microphone placement, system measurement and wireless basics. Four chapters show how to run **Waves SuperRack
Performer** next to the X32 — the full Waves plugin catalogue over the stock X-USB or X-LIVE card, without a
SoundGrid server.

## What it covers

| #   | Chapter                               | Focus                                                                   |
| --- | ------------------------------------- | ----------------------------------------------------------------------- |
| 01  | Hardware overview & surface anatomy   | Fader banks, channel strip, screen, scribble strips, the five models    |
| 02  | Stageboxes & AES50 networks           | S16/S32/SD/DL stageboxes, shielded cabling, clocking, cascading         |
| 03  | Routing & patching                    | Blocks of eight, tap points, +M taps, XLR/Aux/Ultranet/Card outputs     |
| 04  | Firmware 4.x user routing             | 1:1 User In / User Out patching, multi-stagebox setups                  |
| 05  | Gain staging & preamps                | Headamp vs. trim, phantom power, gain split, DI boxes, stage miking     |
| 06  | Channel processing                    | Low cut, gate/ducker, 4-band PEQ, parallel compression, Aux In limits   |
| 07  | Mix buses, sends on faders & matrices | Wedges vs. IEMs, subgroups, the six matrix mixes                        |
| 08  | DCAs & mute groups                    | DCA vs. subgroup, pre/post-fader gotchas, DCA spill                     |
| 09  | Virtual effects rack                  | 1176/LA-2A/Fairchild models, Pultec EQs, reverbs and delays             |
| 10  | Monitoring, solo & talkback           | PFL vs. AFL, talkback A/B, oscillator, Dugan automixer                  |
| 11  | Personal monitoring                   | Ultranet P16 and Midas DP48 over AES50                                  |
| 12  | Scenes, cues & snippets               | Show control hierarchy, parameter and channel safes                     |
| 13  | Recording & expansion cards           | USB recorder, X-USB, X-LIVE SD recording, all expansion cards compared  |
| 14  | Network & remote control              | Static IP, Wi-Fi, X32-Edit sync safety, Mixing Station, OSC             |
| 15  | Live mixing workflows                 | Soundcheck, PA time alignment, ringing out, streaming, measurement, RF  |
| 16  | Waves SuperRack Performer: setup      | Native plugin host over X-USB / X-LIVE, hardware checklist, mute test   |
| 17  | SuperRack routing methods             | Direct input, aux inserts, Ultranet subgroups, X-DANTE, User Routing    |
| 18  | SuperRack latency & buffer size       | Round-trip latency, limits for IEMs and wedges, broadcast A/V sync      |
| 19  | SuperRack plugin chains               | Lead vocal and Main LR chains, a failsafe workflow                      |

## How it is built

The manual uses the same stack as this website: every chapter is written in Markdown and prerendered to static
HTML with SvelteKit, including a full-text search that loads on demand, a chapter sidebar and real tables instead
of ASCII diagrams. The design has soft, rounded cards with gradient accents, drifting wave lines behind every page
and a dot grid that lights up around the cursor. Every page carries social preview images, structured data for
search engines and English / German alternates.

A tiny Rust (axum) server delivers precompressed Brotli/Gzip files with a strict Content-Security-Policy from a
read-only `scratch` container of about 10 MB. No cookies, no trackers, no database — just fast pages that still
load on a phone at the front-of-house position with a weak signal.
