#!/usr/bin/env bash
# Snapshot an artist's profile and catalog with aggregated metrics.
# This is the core data operation for Scenius predictions.
#
# Usage: ./sc-snapshot.sh <user-id-or-soundcloud-url>
# Output: JSON with profile + aggregated catalog totals + track list
# Env:    SOUNDCLOUD_CLIENT_ID, SOUNDCLOUD_CLIENT_SECRET

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [[ $# -lt 1 ]]; then
  echo "Usage: sc-snapshot.sh <user-id-or-soundcloud-url>" >&2
  exit 1
fi

INPUT="$1"
TOKEN=$("$SCRIPT_DIR/sc-token.sh")

# If input looks like a URL, resolve it first
if [[ "$INPUT" == http* ]]; then
  encoded_url=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=''))" "$INPUT")
  resolve_response=$(curl -sL "https://api.soundcloud.com/resolve?url=${encoded_url}" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "accept: application/json; charset=utf-8")
  USER_ID=$(echo "$resolve_response" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
else
  USER_ID="$INPUT"
fi

# Fetch user profile
user_response=$(curl -sL "https://api.soundcloud.com/users/${USER_ID}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "accept: application/json; charset=utf-8")

# Fetch tracks (up to 50 for MVP)
tracks_response=$(curl -sL "https://api.soundcloud.com/users/${USER_ID}/tracks?limit=50" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "accept: application/json; charset=utf-8")

# Combine and aggregate via stdin (avoids shell quoting issues)
printf '%s\n%s' "$user_response" "$tracks_response" | python3 -c "
import sys, json
from datetime import datetime, timezone

lines = sys.stdin.read().split('\n', 1)
user = json.loads(lines[0])
tracks_raw = json.loads(lines[1])

# Handle both array and collection responses
tracks = tracks_raw if isinstance(tracks_raw, list) else tracks_raw.get('collection', [])

# Aggregate totals (handle null/missing fields)
total_plays = sum(t.get('playback_count') or 0 for t in tracks)
total_likes = sum(t.get('likes_count') or 0 for t in tracks)
total_reposts = sum(t.get('reposts_count') or 0 for t in tracks)
total_comments = sum(t.get('comment_count') or 0 for t in tracks)

snapshot = {
    'snapshot_taken_at': datetime.now(timezone.utc).isoformat(),
    'artist': {
        'id': user.get('id'),
        'username': user.get('username'),
        'permalink_url': user.get('permalink_url'),
        'followers_count': user.get('followers_count', 0),
        'track_count': user.get('track_count', 0),
        'city': user.get('city'),
        'country_code': user.get('country_code'),
        'avatar_url': user.get('avatar_url'),
    },
    'catalog_totals': {
        'plays': total_plays,
        'likes': total_likes,
        'reposts': total_reposts,
        'comments': total_comments,
        'tracks_fetched': len(tracks),
    },
    'tracks': [
        {
            'id': t.get('id'),
            'title': t.get('title'),
            'permalink_url': t.get('permalink_url'),
            'playback_count': t.get('playback_count') or 0,
            'likes_count': t.get('likes_count') or 0,
            'reposts_count': t.get('reposts_count') or 0,
            'comment_count': t.get('comment_count') or 0,
            'genre': t.get('genre'),
            'created_at': t.get('created_at'),
        }
        for t in tracks
    ],
}

print(json.dumps(snapshot, indent=2))
"
