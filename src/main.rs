//! Static file server for the MrJSA website.
//!
//! Serves the prerendered SvelteKit build (`web/build`) with precompressed
//! Brotli/Gzip files, cache headers and security headers.
//!
//! Configuration (environment variables):
//! - `PORT`      port to listen on (default `8080`)
//! - `SITE_DIR`  directory with the built site (default `./web/build`)
//! - `RUST_LOG`  log filter (default `info`)
//!
//! `server --healthcheck` exits with 0 if the running server answers on `/healthz`.

mod config;
mod headers;
mod healthcheck;

use std::io::IsTerminal;
use std::time::Instant;

use axum::{
    Router,
    extract::Request,
    middleware::{self, Next},
    response::{Redirect, Response},
    routing::get,
};
use tower_http::services::{ServeDir, ServeFile};
use tracing::info;
use tracing_subscriber::EnvFilter;

use crate::config::Config;

/// Renamed pages, answered with a permanent redirect so old links and search
/// ranking carry over. Never remove an entry — the old URL may be linked anywhere.
const MOVED: &[(&str, &str)] = &[("/projects/rustwebshop/", "/projects/rustcraft/")];

#[tokio::main]
async fn main() {
    let config = Config::from_env();

    if std::env::args().any(|a| a == "--healthcheck") {
        std::process::exit(healthcheck::run(config.port));
    }

    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()))
        .with_target(false)
        .with_ansi(std::io::stdout().is_terminal())
        .init();

    if !config.site_dir.join("index.html").is_file() {
        tracing::warn!(
            "{} has no index.html — did you run `npm run build` in web/?",
            config.site_dir.display()
        );
    }

    let not_found = ServeFile::new(config.site_dir.join("404.html"))
        .precompressed_br()
        .precompressed_gzip();
    let static_files = ServeDir::new(&config.site_dir)
        .precompressed_br()
        .precompressed_gzip()
        .not_found_service(not_found);

    let mut app = Router::new().route("/healthz", get(|| async { "ok" }));
    for &(from, to) in MOVED {
        let redirect = get(move || async move { Redirect::permanent(to) });
        app = app
            .route(from, redirect.clone())
            .route(from.trim_end_matches('/'), redirect);
    }
    let app = app
        .fallback_service(static_files)
        .layer(middleware::from_fn(headers::apply))
        .layer(middleware::from_fn(log_request));

    let addr = std::net::SocketAddr::from(([0, 0, 0, 0], config.port));
    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .unwrap_or_else(|e| panic!("failed to bind {addr}: {e}"));
    info!("serving {} on http://{addr}", config.site_dir.display());

    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await
        .expect("server error");
}

/// Logs method, path, status and latency. Deliberately does not log IP addresses (GDPR).
async fn log_request(req: Request, next: Next) -> Response {
    let start = Instant::now();
    let method = req.method().clone();
    let path = req.uri().path().to_owned();
    let res = next.run(req).await;
    if path != "/healthz" {
        info!(
            "{method} {path} {} {:.1?}",
            res.status().as_u16(),
            start.elapsed()
        );
    }
    res
}

/// Resolves on Ctrl+C or SIGTERM (what `docker stop` sends).
async fn shutdown_signal() {
    let ctrl_c = async {
        tokio::signal::ctrl_c().await.ok();
    };

    #[cfg(unix)]
    let terminate = async {
        if let Ok(mut s) = tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
        {
            s.recv().await;
        }
    };
    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }
    info!("shutting down");
}
