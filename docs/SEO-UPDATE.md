# SEO update

Status of the website's search engine optimisation and what is still left to do.

## Already in place

- A unique `<title>` and meta description on every page (`web/src/lib/components/Seo.svelte`)
- Canonical URLs, plus `hreflang` links between the English and German versions (including `x-default`)
- `sitemap.xml` with language alternates and `lastmod` dates, and `robots.txt` pointing to it
- Open Graph and Twitter cards, with a 1200×630 `og.png` as the default preview image
- Structured data (JSON-LD): Organization, Person (founder), WebSite, WebPage, BreadcrumbList,
  `Article` for projects and `SoftwareApplication` for apps
- Every page is pre-rendered to static HTML, which Google reads most easily
- The site is registered in Google Search Console

## Changed in this update

Every indexable page now carries:

```html
<meta name="robots" content="max-image-preview:large, max-snippet:-1, max-video-preview:-1">
```

This explicitly allows Google to show large preview images and full-length text snippets in search
results. Pages with `noindex` (error pages) are unchanged.

## Thumbnails in search results

Google chooses the thumbnail itself, from the images on the page plus `og:image` and the structured
data. It cannot be forced, but these make it much more likely:

1. **Give each project a real cover image.** No published project has a `cover` at the moment, so
   they all fall back to the generic `og.png`. Add a photo (JPG, PNG or WebP, at least about 1200px
   wide) to `web/static/images/projects/` and set `cover:` in the project's front matter, starting
   with RustCraft.
2. **Don't use SVG for covers.** Social networks don't accept SVG preview images, and Google handles
   them less reliably.
3. **Keep in mind that the homepage portrait is a `<canvas>`.** Google can't see it as an image, so
   it never becomes a thumbnail.

## Google Search Console

1. **URL inspection → Request indexing** for the homepage, `/de/`, `/projects/` and each project
   page after deploying, so Google picks up the change sooner. Otherwise it can take weeks.
2. **Sitemaps:** `https://mrjsa.com/sitemap.xml` should be listed with status "Success" and a
   discovered URL count. If it's missing, submit it there.
3. **Enhancements:** check the structured data reports (e.g. Breadcrumbs) for errors. Single pages
   can also be tested at <https://search.google.com/test/rich-results>.
4. **Pages:** lists pages Google left out, with the reason. If many pages are left out, the
   hreflang/canonical setup or thin content is the likely cause.
5. **Performance:** shows the search terms the site already appears for and at what position. Terms
   that rank on page 2 are the best ones to write more content about.

## Rankings

Rankings depend far more on content and links than on further technical tweaks:

- More project write-ups that use specific terms people search for
  (e.g. "KiCad PCB design service Germany")
- Links from other sites, such as GitHub, LinkedIn and the shop
