use std::path::PathBuf;

pub struct Config {
    pub port: u16,
    pub site_dir: PathBuf,
}

impl Config {
    pub fn from_env() -> Self {
        let port = std::env::var("PORT")
            .ok()
            .and_then(|p| p.parse().ok())
            .unwrap_or(8080);
        let site_dir = std::env::var_os("SITE_DIR")
            .map(PathBuf::from)
            .unwrap_or_else(|| PathBuf::from("web/build"));
        Self { port, site_dir }
    }
}
