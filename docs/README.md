# Documentation

Guides for working on the website and for running it on the server.

## Development

- **[DEVELOPMENT.md](DEVELOPMENT.md)** — how the repository is organised, how to run it locally, how to change content and how the image gets to the server.

## Server installation

Do these in order — each guide builds on [INSTALL.md](INSTALL.md).

| Guide | What it sets up |
| --- | --- |
| **[INSTALL.md](INSTALL.md)** | A fresh Debian 13 / Ubuntu 24.04 server with Podman + Caddy, serving `https://mrjsa.com` |
| **[SHOP-INSTALL.md](SHOP-INSTALL.md)** | The RustCraft shop on the same server: `shop.mrjsa.com` + `admin.shop.mrjsa.com` |
| **[WG_INSTALL.md](WG_INSTALL.md)** | A WireGuard VPN container for your laptop and phone |

The shop and the VPN are optional; only [INSTALL.md](INSTALL.md) is needed for the website.

## GitHub profile

- **[mrjsa/](mrjsa/)** — the README for the [github.com/MrJSA](https://github.com/MrJSA) profile, with the green portrait. Copy both files into the `MrJSA/MrJSA` repository.

---

Back to the [main README](../README.md).
