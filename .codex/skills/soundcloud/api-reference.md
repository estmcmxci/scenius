# SoundCloud API Reference (Scenius subset)

## Auth

```
POST https://secure.soundcloud.com/oauth/token
Authorization: Basic base64(client_id:client_secret)
Content-Type: application/x-www-form-urlencoded
Body: grant_type=client_credentials
```

Rate: 50 tokens/12h per app, 30 tokens/1h per IP.
Token TTL: 3600s.

## Endpoints

All endpoints require `Authorization: Bearer <token>` header.
Base URL: `https://api.soundcloud.com`

### Resolve URL
```
GET /resolve?url={soundcloud_permalink}
```
Returns user or track object.

### User Profile
```
GET /users/{id}
```
Key fields:
- `id` (number)
- `username` (string)
- `permalink_url` (string)
- `followers_count` (number)
- `track_count` (number)
- `likes_count` (number)
- `city` (string | null)
- `country_code` (string | null)
- `avatar_url` (string | null)

### User Tracks
```
GET /users/{id}/tracks?limit=50
```
Returns array of track objects. May return `{ collection: [...] }` wrapper.

Track key fields:
- `id` (number)
- `title` (string)
- `permalink_url` (string)
- `duration` (number, ms)
- `playback_count` (number | null)
- `likes_count` (number | null)
- `reposts_count` (number | null)
- `comment_count` (number | null)
- `genre` (string | null)
- `tag_list` (string | null)
- `created_at` (string, ISO 8601)
- `artwork_url` (string | null)
- `user` (object: `{ id, username }`)

### Search Tracks
```
GET /tracks?q={query}&limit=20&genres={genre}
```

### Search Users
```
GET /users?q={query}&limit=20
```
