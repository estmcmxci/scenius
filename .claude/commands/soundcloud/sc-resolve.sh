#!/usr/bin/env bash
# Resolve a SoundCloud permalink URL to its full metadata.
#
# Usage: ./sc-resolve.sh <soundcloud-url>
# Output: JSON resource (user or track object)
# Env:    SOUNDCLOUD_CLIENT_ID, SOUNDCLOUD_CLIENT_SECRET

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [[ $# -lt 1 ]]; then
  echo "Usage: sc-resolve.sh <soundcloud-url>" >&2
  exit 1
fi

SC_URL="$1"
TOKEN=$("$SCRIPT_DIR/sc-token.sh")

encoded_url=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=''))" "$SC_URL")

response=$(curl -sL "https://api.soundcloud.com/resolve?url=${encoded_url}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "accept: application/json; charset=utf-8")

echo "$response" | python3 -c "
import sys, json
data = json.load(sys.stdin)
kind = data.get('kind', 'unknown')
if kind == 'user':
    print(json.dumps({
        'kind': kind,
        'id': data.get('id'),
        'username': data.get('username'),
        'permalink_url': data.get('permalink_url'),
        'followers_count': data.get('followers_count', 0),
        'track_count': data.get('track_count', 0),
        'likes_count': data.get('likes_count', 0),
        'city': data.get('city'),
        'country_code': data.get('country_code'),
        'avatar_url': data.get('avatar_url'),
    }, indent=2))
elif kind == 'track':
    print(json.dumps({
        'kind': kind,
        'id': data.get('id'),
        'title': data.get('title'),
        'permalink_url': data.get('permalink_url'),
        'duration': data.get('duration'),
        'playback_count': data.get('playback_count', 0),
        'likes_count': data.get('likes_count', 0),
        'reposts_count': data.get('reposts_count', 0),
        'comment_count': data.get('comment_count', 0),
        'genre': data.get('genre'),
        'tag_list': data.get('tag_list'),
        'created_at': data.get('created_at'),
        'artwork_url': data.get('artwork_url'),
        'user': {
            'id': data.get('user', {}).get('id'),
            'username': data.get('user', {}).get('username'),
        } if data.get('user') else None,
    }, indent=2))
else:
    print(json.dumps(data, indent=2))
"
