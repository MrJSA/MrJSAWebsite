# Documentation

Guides for working on the website and for running it on the server.

## Development

- **[DEVELOPMENT.md](DEVELOPMENT.md)** — how the repository is organised, how to run it locally, how to change content and how the image gets to the server.

## Server installation

Do these in order — each guide builds on [INSTALL.md](INSTALL.md).

| Guide | What it sets up |
| --- | --- |
| **[INSTALL.md](INSTALL.md)** | A fresh Debian 13 / Ubuntu 24.04 server with Podman + Caddy, serving `https://mrjsa.com` |
| **[SHOP_INSTALL.md](SHOP_INSTALL.md)** | The RustCraft shop on the same server: `shop.mrjsa.com` + `admin.shop.mrjsa.com` |
| **[WG_INSTALL.md](WG_INSTALL.md)** | A WireGuard VPN container for your laptop and phone |
| **[VW_INSTALL.md](VW_INSTALL.md)** | A Vaultwarden password manager at `vault.mrjsa.com` |

The shop, the VPN and the password manager are optional; only [INSTALL.md](INSTALL.md) is needed for the website.

## GitHub profile

- **[mrjsa/](mrjsa/)** — the README for the [github.com/MrJSA](https://github.com/MrJSA) profile, with the green portrait. Copy the folder's contents (including `.github/`) into the `MrJSA/MrJSA` repository once; after that its workflow pulls `README.md` and `portrait.png` from here every day.

---

Back to the [main README](../README.md).
