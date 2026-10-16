//! Minimal HTTP client used by Docker's HEALTHCHECK, so the runtime image
//! needs no curl/wget.

use std::io::{Read, Write};
use std::net::{SocketAddr, TcpStream};
use std::time::Duration;

/// Returns the process exit code: 0 if `/healthz` answers with 200, otherwise 1.
pub fn run(port: u16) -> i32 {
    match check(port) {
        Ok(()) => 0,
        Err(e) => {
            eprintln!("healthcheck failed: {e}");
            1
        }
    }
}

fn check(port: u16) -> std::io::Result<()> {
    let addr = SocketAddr::from(([127, 0, 0, 1], port));
    let mut stream = TcpStream::connect_timeout(&addr, Duration::from_secs(2))?;
    stream.set_read_timeout(Some(Duration::from_secs(2)))?;
    stream.write_all(b"GET /healthz HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n")?;

    let mut buf = [0u8; 64];
    let n = stream.read(&mut buf)?;
    let status_line = String::from_utf8_lossy(&buf[..n]);
    if status_line.starts_with("HTTP/1.1 200") {
        Ok(())
    } else {
        Err(std::io::Error::other(format!(
            "unexpected response: {status_line:?}"
        )))
    }
}
