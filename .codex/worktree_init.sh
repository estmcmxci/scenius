#!/usr/bin/env bash
set -eo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"

cd "$repo_root"

# Install dependencies
pnpm install

# Copy env template if .env.local doesn't exist yet
if [ ! -f .env.local ]; then
  cp .env.local.example .env.local
  echo "[worktree_init] .env.local created from template — fill in secrets before running pnpm dev"
fi

echo "[worktree_init] Scenius workspace ready at $repo_root"
