//! Cache and security headers added to every response.

use axum::{
    extract::Request,
    http::{HeaderMap, HeaderName, HeaderValue, header},
    middleware::Next,
    response::Response,
};

/// Fingerprinted build output — the file name changes whenever the content does.
const IMMUTABLE: &str = "public, max-age=31536000, immutable";
/// Images, icons etc. from `web/static` — may change, but rarely.
const STATIC_ASSET: &str = "public, max-age=86400";
/// HTML and data — always revalidate so a new deploy is visible immediately.
const REVALIDATE: &str = "public, no-cache";

const SECURITY_HEADERS: &[(&str, &str)] = &[
    ("x-content-type-options", "nosniff"),
    ("x-frame-options", "DENY"),
    ("referrer-policy", "strict-origin-when-cross-origin"),
    (
        "permissions-policy",
        "camera=(), microphone=(), geolocation=(), interest-cohort=()",
    ),
    ("cross-origin-opener-policy", "same-origin"),
];

pub async fn apply(req: Request, next: Next) -> Response {
    let cache = cache_policy(req.uri().path());
    let mut res = next.run(req).await;
    let status = res.status();
    let headers = res.headers_mut();

    if status.is_success() || status.is_redirection() {
        set(headers, header::CACHE_CONTROL, cache);
    } else {
        set(headers, header::CACHE_CONTROL, "no-store");
    }
    for (name, value) in SECURITY_HEADERS {
        set(headers, HeaderName::from_static(name), value);
    }
    res
}

const STATIC_EXTENSIONS: &[&str] = &[
    ".svg",
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".avif",
    ".ico",
    ".webmanifest",
];

fn cache_policy(path: &str) -> &'static str {
    if path.starts_with("/_app/immutable/") {
        IMMUTABLE
    } else if path.starts_with("/images/") || STATIC_EXTENSIONS.iter().any(|e| path.ends_with(e)) {
        STATIC_ASSET
    } else {
        REVALIDATE
    }
}

fn set(headers: &mut HeaderMap, name: HeaderName, value: &'static str) {
    headers
        .entry(name)
        .or_insert(HeaderValue::from_static(value));
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn cache_policies() {
        assert_eq!(cache_policy("/_app/immutable/chunks/abc.js"), IMMUTABLE);
        assert_eq!(cache_policy("/images/apps/x/icon.png"), STATIC_ASSET);
        assert_eq!(cache_policy("/favicon-32.png"), STATIC_ASSET);
        assert_eq!(cache_policy("/chip.webp"), STATIC_ASSET);
        assert_eq!(cache_policy("/"), REVALIDATE);
        assert_eq!(cache_policy("/projects/foo/"), REVALIDATE);
        assert_eq!(cache_policy("/_app/version.json"), REVALIDATE);
    }
}
