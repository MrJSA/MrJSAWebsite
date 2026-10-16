# syntax=docker/dockerfile:1

# ── 1. Build the static site (SvelteKit → web/build) ─────────────────
FROM node:24-alpine AS web
WORKDIR /web
COPY web/package.json web/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY web/ ./
RUN npm run build

# ── 2. Build the Rust server as a static musl binary ─────────────────
FROM rust:1.91-alpine AS server
RUN apk add --no-cache musl-dev
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
# Build dependencies first so they are cached between code changes.
RUN mkdir src && echo 'fn main() {}' > src/main.rs \
    && cargo build --release --locked \
    && rm -rf src
COPY src ./src
RUN touch src/main.rs && cargo build --release --locked

# ── 3. Runtime: nothing but the binary and the files (~10 MB) ────────
FROM scratch
COPY --from=server /app/target/release/server /server
COPY --from=web /web/build /site
ENV PORT=8080 \
    SITE_DIR=/site \
    RUST_LOG=info
USER 65534:65534
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD ["/server", "--healthcheck"]
ENTRYPOINT ["/server"]
