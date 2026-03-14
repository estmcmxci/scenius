# spec/stack.md — Stack Conventions

Rules for working in the Scenius codebase. These are enforced invariants, not suggestions.

---

## Next.js 15 Conventions

- Use **App Router** exclusively. No Pages Router.
- **Server Components by default.** Only add `'use client'` when you need browser APIs,
  event handlers, or React hooks. If unsure, start server-side.
- **Route handlers** live in `app/api/`. Use `NextRequest` / `NextResponse`.
- **Layouts** handle Providers (auth, wallet, telemetry). Do not scatter Providers in leaf components.
- **Loading / error boundaries**: every route segment gets a `loading.tsx` and `error.tsx`.
- Env vars accessed server-side only unless prefixed `NEXT_PUBLIC_`.
  Never expose SC credentials or DB URLs to the client.

---

## Zod — Required at All API Edges

Parse, don't validate. Every boundary gets a Zod schema.

**Inbound (API route handlers):**
```typescript
import { z } from 'zod';

const SubmitPredictionSchema = z.object({
  artistId:        z.string().uuid(),
  streamThreshold: z.number().int().positive(),
  predictedOutcome: z.enum(['yes', 'no']),
  horizon:         z.enum(['1w', '2w', '4w', '8w']),
  rationale:       z.string().max(2000).optional(),
});

export async function POST(req: NextRequest) {
  const body = SubmitPredictionSchema.parse(await req.json());
  // body is now fully typed and validated
}
```

**Outbound (SC API responses):** See `spec/sc-api.md` for SC Zod schemas.
**DB reads:** Drizzle returns typed results — still validate any nullable fields before use.

---

## No `any` in Resolution Logic

The resolution cron (`app/domains/resolution/`) must have zero `any` types.
This is a hard rule. The reputation math operates on floats with specific bounds;
untyped data here causes silent incorrect scores.

If TypeScript can't infer a type in resolution logic, add an explicit Zod parse.
Do not cast with `as any` or `as unknown as X`.

---

## File Size Limit

No file over 300 lines. If a file is growing past 200 lines, split it.
Services go in `service.ts`, types in `types.ts`, DB access in `repo.ts`.

---

## Imports

- Use path aliases: `@/domains/soundcloud` not `../../../domains/soundcloud`
- Configure in `tsconfig.json` `paths`
- No barrel files (`index.ts` that re-exports everything) — they hide dependency direction

---

## Tailwind

- CSS variables for brand colors and per-artist theming (V2 zine layer)
- Define tokens in `app/styles/tokens.css`
- No inline `style=` for colors or spacing — use Tailwind classes
- Dark mode via `class` strategy (not `media`)

---

## Environment Variables

All env vars validated at startup in `app/config/env.ts`:

```typescript
import { z } from 'zod';

const EnvSchema = z.object({
  SOUNDCLOUD_CLIENT_ID:     z.string().min(1),
  SOUNDCLOUD_CLIENT_SECRET: z.string().min(1),
  DATABASE_URL:             z.string().url(),
  EAS_CONTRACT_ADDRESS:     z.string(),
  NEXT_PUBLIC_APP_URL:      z.string().url(),
});

export const env = EnvSchema.parse(process.env);
```

If any required var is missing, the app throws at startup with a clear error.
Never use `process.env.X` directly outside this file.

---

## Testing

- Unit tests for: reputation update function, delta formula, weighted consensus
- These are the three functions where a silent bug has the highest impact
- Framework: Vitest (fast, native ESM, works with Next.js)
- Test files colocated: `reputation.test.ts` next to `reputation.ts`
