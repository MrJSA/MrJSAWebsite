#!/bin/sh
# Pulls the newest image from GitHub and restarts the website container.
# Usage (on the server):  ./update.sh
set -eu
cd "$(dirname "$0")"

docker compose pull
docker compose up -d --remove-orphans
docker image prune -f >/dev/null

echo "Website updated:"
docker compose ps
