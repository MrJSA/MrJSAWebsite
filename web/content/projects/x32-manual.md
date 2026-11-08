---
title: X32 / M32 Field Guide
summary: A complete technical manual and field guide for the Behringer X32 and Midas M32 digital mixing consoles — 15 chapters from gain staging to AES50 stageboxes, in English and German.
date: 2026-11-08
order: 3
category: Audio
status: Live
featured: true
tags: [Live Sound, Behringer X32, Midas M32, AES50, SvelteKit, Rust, Docker]
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

## What it covers

| #   | Chapter                               | Focus                                                           |
| --- | ------------------------------------- | --------------------------------------------------------------- |
| 01  | Hardware overview & surface anatomy   | Fader banks, channel strip, screen, scribble strips, rear panel |
| 02  | Stageboxes & AES50 networks           | S16/S32/SD/DL stageboxes, shielded cabling, clocking, cascading |
| 03  | Routing & patching                    | Blocks of eight, tap points, XLR/Aux/Ultranet/Card outputs      |
| 04  | Firmware 4.x user routing             | 1:1 User In / User Out patching, multi-stagebox setups          |
| 05  | Gain staging & preamps                | Headamp vs. trim, −18 dBFS target, phantom power, gain split    |
| 06  | Channel processing                    | Low cut, gate/ducker, 4-band PEQ with RTA, parallel compression |
| 07  | Mix buses, sends on faders & matrices | Wedges vs. IEMs, subgroups, the six matrix mixes                |
| 08  | DCAs & mute groups                    | DCA vs. subgroup, pre/post-fader gotchas, DCA spill             |
| 09  | Virtual effects rack                  | 1176/LA-2A/Fairchild models, Pultec EQs, reverbs and delays     |
| 10  | Monitoring, solo & talkback           | PFL vs. AFL, talkback A/B, oscillator, Dugan automixer          |
| 11  | Personal monitoring                   | Ultranet P16 and Midas DP48 over AES50                          |
| 12  | Scenes, cues & snippets               | Show control hierarchy, parameter and channel safes             |
| 13  | Recording & expansion cards           | USB recorder, X-USB, X-LIVE SD recording, virtual soundcheck    |
| 14  | Network & remote control              | Static IP, Wi-Fi, X32-Edit sync safety, Mixing Station, OSC     |
| 15  | Live mixing workflows                 | Soundcheck protocol, PA time alignment, ringing out, streaming  |

## How it is built

The manual uses the same stack as this website: every chapter is written in Markdown and prerendered to static
HTML with SvelteKit, including a built-in full-text search, a chapter sidebar and real tables instead of ASCII
diagrams. A tiny Rust (axum) server delivers precompressed Brotli/Gzip files from a read-only `scratch`
container of about 10 MB. No cookies, no trackers, no database — just fast pages that still load on a phone at
the front-of-house position with a weak signal.
