# Sideline — Sports Discussion Platform

Reddit-style discussion, scoped to sports, with live scores pulled from
external APIs and normalized across leagues.

## Stack

- **Next.js 14 (App Router) + TypeScript** — pages, API routes, SSR for SEO
- **Tailwind CSS** — styling, using the design tokens in `tailwind.config.ts`
- **Prisma + Postgres (via Supabase)** — posts, comments, votes, users
- **Supabase Auth** — magic-link sign-in (swap for OAuth providers later if you want)
- **SWR** — client-side data fetching/caching for comments

## Getting started

```bash
npm install
cp .env.example .env       # fill in your Supabase + sports API keys
npx prisma db push         # create tables in your Supabase Postgres
npx prisma db seed         # seed the NBA and World Cup league rows
npm run dev
```

Open http://localhost:3000.

### Setting up Supabase (free tier is enough to start)

1. Create a project at supabase.com
2. Grab the Postgres connection string (Project Settings → Database) → `DATABASE_URL`
3. Grab the Project URL + anon key (Project Settings → API) → `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Enable Email auth (Authentication → Providers) for the magic-link sign-in to work

### Sports API keys

- **NBA**: [balldontlie.io](https://balldontlie.io) — free tier works without a key for basic endpoints; sign up for higher rate limits
- **World Cup / soccer**: [football-data.org](https://www.football-data.org) — free tier is 10 requests/minute, which is why every adapter call caches for 30s (`next: { revalidate: 30 }`)

## Architecture notes

### The sports data layer (`lib/adapters/*`, `lib/sports-api.ts`)

Each league is a separate "adapter" implementing the `SportsAdapter` interface
(`types/sports.ts`). Adapters normalize wildly different API shapes (NBA box
scores vs. soccer goal-scorer lists) into a common `NormalizedGame` /
`NormalizedPlayerStatLine` shape. **The UI never touches raw API responses** —
only the normalized types. This is the key design decision: adding a third
league (NFL, Premier League, whatever) means writing one new adapter file and
registering it in `sports-api.ts`. Nothing in `app/` or `components/` changes.

### The community layer (Prisma schema)

Modeled closely after Reddit: `League` (like a subreddit) → `Post` (thread) →
`Comment` (nested via self-relation `parentId`) → `Vote` (polymorphic,
works for both posts and comments via nullable foreign keys). Posts can
optionally tag a `Team` or a `gameId` — that `gameId` field is what would let
you auto-generate "game thread" posts tied to a specific live game later.

### What's stubbed / left for you to wire up

- **Auth session → API routes**: `authorId`/`userId` are currently passed as
  literal strings from the client (see `TODO-current-user-id` in
  `CommentThread.tsx`, `post/new/page.tsx`, `VoteButtons.tsx`). Once you add
  Supabase session middleware, these should come from the server-verified
  session instead of the client — don't trust a client-supplied user id in
  production.
- **User provisioning**: when someone signs in via Supabase for the first
  time, you'll want a hook (Supabase's `on auth user created` or a check on
  first request) that creates the matching `User` row in Prisma with a
  chosen username.
- **Optimistic vote state**: `VoteButtons` does optimistic UI updates but
  doesn't yet read the user's *existing* vote on page load — the API routes
  return `userVote: 0` always (see `TODO` comments in the API routes).
- **Real-time score updates**: currently games refresh via the 30s cache
  revalidation on each page load. For a livelier feed, add client-side
  polling (SWR with `refreshInterval`) or move to WebSockets.

## Adding a new league

1. Create `lib/adapters/yourLeague.ts` implementing `SportsAdapter`
2. Register it in `lib/sports-api.ts`'s `adapters` object
3. Add the league to the `LEAGUES` arrays in `components/Navbar.tsx` and
   `app/post/new/page.tsx`
4. Seed the `League` row in `prisma/seed.ts`

## Project structure

```
app/
  page.tsx                 → home feed (all leagues)
  league/[league]/page.tsx → league feed + scoreboard
  post/[id]/page.tsx       → thread + nested comments
  post/new/page.tsx        → create a thread
  auth/sign-in/page.tsx    → magic-link sign-in
  api/posts/route.ts       → list/create posts
  api/comments/route.ts    → list/create comments
  api/votes/route.ts       → cast/remove votes
components/
  ScoreboardTicker.tsx     → live-scrolling scores (signature UI element)
  PostCard.tsx, VoteButtons.tsx, CommentThread.tsx, Navbar.tsx
lib/
  adapters/nba.ts, worldCup.ts  → per-league API normalization
  sports-api.ts            → adapter registry
  prisma.ts, supabase.ts   → client singletons
types/
  sports.ts                → NormalizedGame etc — the adapter contract
  post.ts, comment.ts      → UI-facing content types
prisma/
  schema.prisma            → full data model
  seed.ts                  → seeds league rows
```
