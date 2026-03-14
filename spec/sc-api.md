# spec/sc-api.md — SoundCloud API

SoundCloud is the data anchor. All prediction resolution is computed from SC metrics.
See also `spec/attribution.md` for ToS constraints.

---

## Auth

Client Credentials flow. No user login required — public data only.

```typescript
// POST https://api.soundcloud.com/oauth2/token
// body: grant_type=client_credentials
// headers: Authorization: Basic base64(CLIENT_ID:CLIENT_SECRET)

const token = await fetch('https://secure.soundcloud.com/oauth/token', {
  method: 'POST',
  headers: {
    'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: 'grant_type=client_credentials',
});
```

Credentials: `SOUNDCLOUD_CLIENT_ID`, `SOUNDCLOUD_CLIENT_SECRET` in `.env`.
Tokens expire — implement refresh or re-fetch on 401.

---

## Key Endpoints

### Resolve a SC URL → structured data
```
GET /resolve?url={soundcloud_permalink}
```
Use this to let tastemakers paste any SC URL on the submit form.
Returns a user or track object with `id`, `username`, `playback_count`, etc.

### Artist profile + follower count
```
GET /users/{id}
```
Returns: `id`, `username`, `followers_count`, `track_count`, `permalink_url`

### Artist catalog with per-track metrics
```
GET /users/{id}/tracks?limit=50
```
Returns array of tracks, each with: `playback_count`, `likes_count`, `reposts_count`, `comment_count`

### Discovery search
```
GET /tracks?q={artist}&genres={genre}&limit=20
```
Used for seeding initial catalog list.

---

## Snapshot Job

Run at two points:
1. **On prediction creation** — pull current metrics, store as `catalog_snapshots`, link as `prediction.snapshot_id`
2. **Every Friday via Vercel Cron** — snapshot all artists with pending predictions, trigger resolution for any whose horizon has elapsed

```typescript
async function snapshotArtist(artistId: string): Promise<CatalogSnapshot> {
  const user = await sc.get(`/users/${artistId}`);
  const tracks = await sc.get(`/users/${artistId}/tracks?limit=50`);

  const totals = tracks.reduce((acc, t) => ({
    plays:    acc.plays    + t.playback_count,
    likes:    acc.likes    + t.likes_count,
    reposts:  acc.reposts  + t.reposts_count,
    comments: acc.comments + t.comment_count,
  }), { plays: 0, likes: 0, reposts: 0, comments: 0 });

  return db.catalog_snapshots.insert({
    artist_id:     artistId,
    taken_at:      new Date(),
    plays:         totals.plays,
    likes:         totals.likes,
    reposts:       totals.reposts,
    followers:     user.followers_count,
    comment_count: totals.comments,
    track_count:   tracks.length,
  });
}
```

---

## Rate Limits

- Standard registered app: 15,000 requests/hour
- Cache all snapshots in Supabase — never pull live data on page render
- Only fetch from SC in two places: snapshot-on-prediction-create and Friday cron
- Implement exponential backoff on 429 responses

---

## Zod Schemas (required)

All SC API responses must be parsed through Zod at the boundary.
Never trust the shape of SC API data.

```typescript
// app/domains/soundcloud/types/sc-user.ts
import { z } from 'zod';

export const ScUserSchema = z.object({
  id:              z.number(),
  username:        z.string(),
  followers_count: z.number(),
  track_count:     z.number(),
  permalink_url:   z.string().url(),
  avatar_url:      z.string().url().optional(),
});

export const ScTrackSchema = z.object({
  id:             z.number(),
  title:          z.string(),
  playback_count: z.number(),
  likes_count:    z.number(),
  reposts_count:  z.number(),
  comment_count:  z.number(),
  artwork_url:    z.string().url().nullable(),
});
```
