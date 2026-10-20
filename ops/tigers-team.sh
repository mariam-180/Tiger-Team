#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE=(docker compose -f "$ROOT_DIR/compose.yaml")

green='\033[0;32m'; cyan='\033[0;36m'; yellow='\033[1;33m'; reset='\033[0m'
say() { printf "${cyan}%s${reset}\n" "$*"; }
fail() { printf "${yellow}%s${reset}\n" "$*" >&2; }

status() {
  "${COMPOSE[@]}" ps
}

smoke() {
  say "Running gateway smoke checks"
  curl --fail --silent --show-error http://127.0.0.1/health >/dev/null
  curl --fail --silent --show-error http://127.0.0.1/api/health >/dev/null || curl --fail --silent --show-error http://127.0.0.1/ >/dev/null
  curl --fail --silent --show-error http://127.0.0.1/hls/ >/dev/null || true
  printf "${green}Smoke checks passed${reset}\n"
}

deploy_remote() {
  local host user remote_dir
  read -r -p "Server IP/hostname: " host
  read -r -p "SSH username: " user
  read -r -p "Remote project directory [/opt/tigers-team]: " remote_dir
  remote_dir="${remote_dir:-/opt/tigers-team}"
  say "Syncing project to ${user}@${host}:${remote_dir}"
  ssh "$user@$host" "mkdir -p '$remote_dir'"
  rsync -az --delete --exclude '.git' --exclude 'node_modules' --exclude '.env' \
    "$ROOT_DIR/" "$user@$host:$remote_dir/"
  say "Starting remote Compose stack"
  ssh -t "$user@$host" "cd '$remote_dir' && docker compose up -d --build"
}

ssl() {
  local domain email
  read -r -p "Domain (e.g. tigers-team.com): " domain
  read -r -p "Let's Encrypt email: " email
  [[ "$domain" =~ ^[A-Za-z0-9.-]+$ ]] || { fail "Invalid domain"; return 1; }
  say "Issuing certificate via webroot"
  "${COMPOSE[@]}" --profile ssl run --rm certbot certonly --webroot -w /var/www/certbot \
    -d "$domain" -d "www.$domain" --email "$email" --agree-tos --no-eff-email
  cp "$ROOT_DIR/ops/nginx/default.conf" "$ROOT_DIR/ops/nginx/default.conf.bak"
  sed "s/__DOMAIN__/$domain/g" "$ROOT_DIR/ops/nginx/default.ssl.conf" > "$ROOT_DIR/ops/nginx/default.conf"
  "${COMPOSE[@]}" exec nginx nginx -t
  "${COMPOSE[@]}" exec nginx nginx -s reload
  say "HTTPS enabled for $domain and www.$domain"
}

seed_admin() {
  local username email password
  read -r -p "Admin username: " username
  read -r -p "Admin email: " email
  read -r -s -p "Admin password: " password
  printf '\n'
  "${COMPOSE[@]}" run --rm api python -m scripts.seed_admin \
    --username "$username" --email "$email" --password "$password"
}

seed_data() {
  "${COMPOSE[@]}" run --rm api python -m scripts.seeders --only all
}

configure_hosts() {
  local backup
  backup="$ROOT_DIR/ops/hosts.backup.$(date +%Y%m%d%H%M%S)"
  cp /etc/hosts "$backup"
  if ! grep -Eq '^[[:space:]]*127\.0\.0\.1[[:space:]]+.*(^|[[:space:]])tigers-team-local\.com([[:space:]]|$)' /etc/hosts; then
    printf '\n127.0.0.1\ttigers-team-local.com\n' | sudo tee -a /etc/hosts >/dev/null
  fi
  say "Hosts backup: $backup"
  say "Local URL: http://tigers-team-local.com"
}

while true; do
  printf "\n${cyan}TIGERS TEAM OPERATIONS${reset}\n"
  printf "1) Start/update stack\n2) Stop stack\n3) Container status\n4) Logs\n5) Smoke test\n6) Sync and deploy over SSH\n7) Issue Certbot certificate\n8) Seed/update admin\n9) Configure local hostname\n10) Seed reference data\n0) Exit\n\n"
  read -r -p "Select: " choice
  case "$choice" in
    1) "${COMPOSE[@]}" up -d --build ;;
    2) "${COMPOSE[@]}" down ;;
    3) status ;;
    4) "${COMPOSE[@]}" logs -f --tail=100 ;;
    5) smoke ;;
    6) deploy_remote ;;
    7) ssl ;;
    8) seed_admin ;;
    9) configure_hosts ;;
    10) seed_data ;;
    0) exit 0 ;;
    *) fail "Unknown option" ;;
  esac
done
