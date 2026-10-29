# MrJSA Technologies — Website

The source of [mrjsa.com](https://mrjsa.com), the website of **MrJSA Technologies**.

## About me

Hi, I'm Joshua Schulz-Andres, an engineer based in Germany. I enjoy the full journey of a product: from the
first sketch of a circuit, through the board layout and the firmware, all the way to the app in the store.

With MrJSA Technologies I design PCBs, write embedded firmware and build apps and software — for my own
products and for people who want to bring theirs to life. Pragmatic, well documented and built to last.

## About this website

The website shows what I do: my services, projects like the [RustCraft](https://mrjsa.com/projects/rustcraft/)
shop, my apps and a way to get in touch. It is available in English and German.

It is built the same way I build the rest of my software — small, fast and fully under my control:

- **SvelteKit** renders every page to static HTML at build time; all content is plain Markdown.
- A tiny **Rust** (axum) server delivers it from a minimal Docker image.
- No PHP, no database, no cookies, no trackers and no third-party requests.

More about how it works: [This Website](https://mrjsa.com/projects/mrjsa-website/).

Notes on development, content and deployment are in [`docs/`](docs/).
