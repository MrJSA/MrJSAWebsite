# MrJSA Technologies — Website

Company website of **MrJSA Technologies** — **Svelte** (SvelteKit, prerendered to static HTML) served by a tiny **Rust** (axum) server in a ~6 MB Docker image.

```
web/                 SvelteKit frontend
  content/           ← all content as Markdown (projects, apps, services, legal pages)
  src/lib/config/site.ts   ← name, links, nav and the homepage section list
  static/            images, logo/favicons (generated from .private/Logo.png), og.png
src/                 Rust static file server
deploy/              docker-compose.yml + update.sh for the server
.github/workflows/   CI: checks + builds & pushes the image to GHCR
```

## Develop

```sh
cd web
npm install
npm run dev          # http://localhost:5173 — drafts are visible here
```

Run the production setup locally:

```sh
cd web && npm run build && cd ..
cargo run            # http://localhost:8080 (PORT / SITE_DIR env vars to override)
```

Or as a container next to the locally running webshop (whose storefront uses port 8080):

```sh
docker build --build-arg SHOP_URL=http://localhost:8080 -t mrjsa-website:local .
docker run -d --name mrjsa-website-local -p 127.0.0.1:3000:8080 --read-only --cap-drop ALL mrjsa-website:local
```

The "Shop" links point to `https://shop.mrjsa.com` unless `SHOP_URL` (Docker) / `VITE_SHOP_URL` (npm) is set.

## Add / change content

| What | How |
| --- | --- |
| New project | Add `web/content/projects/<slug>.md` (copy `example-pcb.md`) |
| New app | Add `web/content/apps/<slug>/index.md` (+ optional `privacy.md`) |
| App privacy policy for Google Play | `privacy.md` next to the app → `https://<domain>/apps/<slug>/privacy/` |
| New service | Add `web/content/services/<name>.md` |
| New plain page (e.g. `/about`) | Add `web/content/pages/<slug>.md` (`footer: true` links it in the footer) |
| Remove something | Delete the file |
| Hide temporarily | Add `draft: true` to its frontmatter |
| Homepage order / sections | Edit `home` in `web/src/lib/config/site.ts` |
| Colours & fonts | Tokens at the top of `web/src/lib/styles/global.css` |

Images go in `web/static/images/…` and are referenced as `/images/…`.

## Before going live

- [ ] `web/src/lib/config/site.ts` → `url` if the site moves to a subdomain
- [ ] Conclude the data processing agreements (AVV) the privacy policy mentions: netcup (Customer Control Panel) and IONOS (customer area)
- [ ] Reverse proxy: serve HTTPS only (redirect HTTP), and either disable access logs or rotate them (e.g. 7 days) — whatever the privacy policy says

## Deploy

Every push to `main` builds the image and publishes it as `ghcr.io/mrjsa/mrjsawebsite:latest` (plus a `sha-…` tag; Git tags `v1.2.3` also get `1.2.3`).

**Podman + Caddy (HTTPS) on a fresh server:** see [INSTALL.md](INSTALL.md).

**One-time server setup (Docker Compose)**

```sh
mkdir -p /opt/mrjsa-website && cd /opt/mrjsa-website
# copy deploy/docker-compose.yml and deploy/update.sh here, then:
chmod +x update.sh
docker compose up -d
```

If the repository/package is **private**, log in once so the server can pull:
`echo <PAT with read:packages> | docker login ghcr.io -u MrJSA --password-stdin`
(or make the package public under GitHub → Packages → mrjsawebsite → Package settings).

Point your reverse proxy at `http://127.0.0.1:8080` (or use the Traefik labels in the compose file). TLS/HSTS are handled by the proxy.

**Update to the newest version**

```sh
/opt/mrjsa-website/update.sh
```

Optional — update automatically every night at 04:00 (`crontab -e`):

```
0 4 * * * /opt/mrjsa-website/update.sh >> /var/log/mrjsa-website-update.log 2>&1
```

**Roll back** — set `image: ghcr.io/mrjsa/mrjsawebsite:sha-<commit>` in the compose file and run `docker compose up -d`.
