#!/usr/bin/env bash
# Acquire and cache a SoundCloud OAuth2 bearer token.
# Uses client credentials flow against the new secure endpoint.
# Caches token in /tmp/.sc_token with TTL check.
#
# Usage: ./sc-token.sh
# Output: bearer token string to stdout
# Env:    SOUNDCLOUD_CLIENT_ID, SOUNDCLOUD_CLIENT_SECRET

set -euo pipefail

TOKEN_FILE="/tmp/.sc_token"
TOKEN_TTL=3500  # seconds (token lasts 3600, refresh slightly early)

if [[ -z "${SOUNDCLOUD_CLIENT_ID:-}" || -z "${SOUNDCLOUD_CLIENT_SECRET:-}" ]]; then
  echo "ERROR: SOUNDCLOUD_CLIENT_ID and SOUNDCLOUD_CLIENT_SECRET must be set" >&2
  exit 1
fi

# Check if cached token is still valid
if [[ -f "$TOKEN_FILE" ]]; then
  token_age=$(( $(date +%s) - $(stat -f %m "$TOKEN_FILE" 2>/dev/null || stat -c %Y "$TOKEN_FILE" 2>/dev/null) ))
  if (( token_age < TOKEN_TTL )); then
    cat "$TOKEN_FILE"
    exit 0
  fi
fi

# Request new token
credentials=$(printf '%s:%s' "$SOUNDCLOUD_CLIENT_ID" "$SOUNDCLOUD_CLIENT_SECRET" | base64 | tr -d '\n')

response=$(curl -s -X POST "https://secure.soundcloud.com/oauth/token" \
  -H "accept: application/json; charset=utf-8" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Authorization: Basic ${credentials}" \
  --data-urlencode "grant_type=client_credentials")

# Extract access_token
token=$(echo "$response" | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])" 2>/dev/null)

if [[ -z "$token" ]]; then
  echo "ERROR: Failed to obtain token. Response: $response" >&2
  exit 1
fi

# Cache and output
echo -n "$token" > "$TOKEN_FILE"
chmod 600 "$TOKEN_FILE"
echo -n "$token"
