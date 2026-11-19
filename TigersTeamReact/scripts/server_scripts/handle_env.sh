#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
case "${1:-}" in
  Non-Prod) source_file=.env.development; target=.env.development.local ;;
  Prod) source_file=.env.production; target=.env.production.local ;;
  Stage) source_file=.env.production; target=.env.staging.local ;;
  *) echo "Usage: $0 Non-Prod|Stage|Prod" >&2; exit 1 ;;
esac
# All public requests use the same-origin gateway; no credentials belong here.
cp "$source_file" "$target"
echo "Wrote $target. For Stage build with: npm run build -- --mode staging"
