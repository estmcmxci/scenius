# spec/data-model.md — Supabase Schema

Full Postgres schema for the Scenius MVP. Managed via Drizzle ORM.
Source of truth for all DB work. Do not add columns without updating this file.

---

## `artists`

SoundCloud-anchored artist records. Context for predictions, never a destination.

```sql
CREATE TABLE artists (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  soundcloud_id    TEXT,                   -- SC user or track ID
  name             TEXT NOT NULL,
  soundcloud_url   TEXT,                   -- full SC permalink
  genre            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);
```

## `catalog_snapshots`

SC metrics captured at a point in time. Delta between two snapshots = resolution oracle.

```sql
CREATE TABLE catalog_snapshots (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id        UUID NOT NULL REFERENCES artists(id),
  taken_at         TIMESTAMPTZ NOT NULL,
  plays            INTEGER,
  likes            INTEGER,
  reposts          INTEGER,
  followers        INTEGER,
  comment_count    INTEGER,
  track_count      INTEGER
);
```

> Two snapshots per prediction: `snapshot_id` (at creation) and `resolution_snapshot_id` (at resolution).
> Delta = `resolution_snapshot.plays - snapshot.plays`.

## `tastemakers`

Users with reputation. ENS names displayed on profiles.

```sql
CREATE TABLE tastemakers (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 TEXT,
  ens_name             TEXT,
  bio                  TEXT,
  memory_protocol_id   TEXT,              -- Memory Protocol portable ID
  reputation_score     FLOAT DEFAULT 1.0, -- EMA proper scoring rule, init = 1.0
  created_at           TIMESTAMPTZ DEFAULT NOW()
);
```

> Reputation is clamped to [0.01, 0.99] at all times. See `spec/resolution-logic.md`.

## `predictions`

Binary breakout forecasts. Atomic unit of the product.

```sql
CREATE TABLE predictions (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tastemaker_id          UUID NOT NULL REFERENCES tastemakers(id),
  artist_id              UUID NOT NULL REFERENCES artists(id),
  stream_threshold       INTEGER NOT NULL,        -- e.g. 500000
  predicted_outcome      TEXT NOT NULL            -- CHECK IN ('yes', 'no')
                         CHECK (predicted_outcome IN ('yes', 'no')),
  horizon                TEXT NOT NULL            -- CHECK IN ('1w','2w','4w','8w')
                         CHECK (horizon IN ('1w', '2w', '4w', '8w')),
  rationale              TEXT,
  snapshot_id            UUID REFERENCES catalog_snapshots(id),
  resolution_snapshot_id UUID REFERENCES catalog_snapshots(id),
  outcome                TEXT DEFAULT 'pending'
                         CHECK (outcome IN ('pending', 'yes', 'no')),
  reputation_delta       FLOAT,
  eas_attestation_uid    TEXT,                    -- written at resolution
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  resolved_at            TIMESTAMPTZ
);
```

## `posts`

Editorial content. Every post optionally anchored to a prediction.

```sql
CREATE TABLE posts (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tastemaker_id    UUID NOT NULL REFERENCES tastemakers(id),
  prediction_id    UUID REFERENCES predictions(id),  -- nullable (editorial-only posts)
  title            TEXT,
  body             TEXT,
  tags             TEXT[],
  genre            TEXT,
  published_at     TIMESTAMPTZ
);
```

---

## Indexes (add as needed)

```sql
CREATE INDEX idx_predictions_artist    ON predictions(artist_id);
CREATE INDEX idx_predictions_tastemaker ON predictions(tastemaker_id);
CREATE INDEX idx_predictions_outcome   ON predictions(outcome);
CREATE INDEX idx_snapshots_artist      ON catalog_snapshots(artist_id);
CREATE INDEX idx_posts_tastemaker      ON posts(tastemaker_id);
CREATE INDEX idx_posts_prediction      ON posts(prediction_id);
```

---

## Drizzle ORM notes

- Schema lives in `app/domains/*/repo/schema.ts` per domain
- Migrations in `app/db/migrations/`
- Run `drizzle-kit generate` after any schema change
- Never edit migration files by hand
