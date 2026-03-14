#!/usr/bin/env bash
# Search SoundCloud for tracks or users.
#
# Usage: ./sc-search.sh <tracks|users> <query> [limit]
# Output: JSON array of results
# Env:    SOUNDCLOUD_CLIENT_ID, SOUNDCLOUD_CLIENT_SECRET

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [[ $# -lt 2 ]]; then
  echo "Usage: sc-search.sh <tracks|users> <query> [limit]" >&2
  exit 1
fi

KIND="$1"
QUERY="$2"
LIMIT="${3:-20}"

if [[ "$KIND" != "tracks" && "$KIND" != "users" ]]; then
  echo "ERROR: first argument must be 'tracks' or 'users'" >&2
  exit 1
fi

TOKEN=$("$SCRIPT_DIR/sc-token.sh")

encoded_query=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=''))" "$QUERY")

response=$(curl -sL "https://api.soundcloud.com/${KIND}?q=${encoded_query}&limit=${LIMIT}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "accept: application/json; charset=utf-8")

echo "$response" | python3 -c "
import sys, json
data = json.load(sys.stdin)
# Handle both array and collection responses
items = data if isinstance(data, list) else data.get('collection', data)
if not isinstance(items, list):
    print(json.dumps(data, indent=2))
    sys.exit(0)

results = []
for item in items:
    kind = item.get('kind', 'unknown')
    if kind == 'track':
        results.append({
            'id': item.get('id'),
            'title': item.get('title'),
            'permalink_url': item.get('permalink_url'),
            'playback_count': item.get('playback_count', 0),
            'likes_count': item.get('likes_count', 0),
            'reposts_count': item.get('reposts_count', 0),
            'genre': item.get('genre'),
            'created_at': item.get('created_at'),
            'user': item.get('user', {}).get('username'),
        })
    elif kind == 'user':
        results.append({
            'id': item.get('id'),
            'username': item.get('username'),
            'permalink_url': item.get('permalink_url'),
            'followers_count': item.get('followers_count', 0),
            'track_count': item.get('track_count', 0),
        })
    else:
        results.append(item)

print(json.dumps(results, indent=2))
"
