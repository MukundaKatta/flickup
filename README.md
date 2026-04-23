# Flickup

One podcast. Sixty scroll-stopping shorts.

**Status:** v0 skeleton — landing page + clip-finder route. Full AI not yet wired.

**Landing:** https://flickup.vercel.app

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind v4 |
| Fonts | Inter via `next/font/google` |
| Hosting | Vercel (zero config) |
| Waitlist | https://waitlist-api-sigma.vercel.app |

## Run locally

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Deploy

Push to `main` — Vercel picks it up automatically. No environment variables required.

## Routes

| Route | Description |
|---|---|
| `/` | Landing page (original copy + design preserved) |
| `/try` | v0 clip finder — paste a transcript, get 3 mocked clipworthy moments |
| `/api/waitlist` | `POST { email }` → forwards to waitlist-api-sigma |

## What's next

- Wire real AI (clip detection + caption generation) behind `/try`
- Multi-platform export (TikTok, Reels, Shorts)
- Scheduling integration
