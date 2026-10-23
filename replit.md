# Toy’s Village

A supervised mobile prototype that turns toy tidy-up into two audio-led village games: Time Game and Color Game.

## Run & Operate

- `pnpm --filter @workspace/toys-village run dev` — run the Expo prototype
- `pnpm --filter @workspace/toys-village run typecheck` — typecheck the mobile app
- `pnpm run typecheck` — full typecheck across packages
- `pnpm run test` — rule, voice, session, and sensor tests
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-server run dev` — optional health-check API (port 5000). The game does not call it.
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `DATABASE_URL` is not required to run the app. It is only for the optional `@workspace/db` package, which play does not use.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5, health check only
- DB: optional PostgreSQL + Drizzle, unused by the game
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Mobile: Expo, React 19

## Where things live

- `artifacts/toys-village` — the playable app
- `artifacts/toys-village/gameData.ts` — the six residents
- `artifacts/toys-village-deck` — product claims
- `lib/api-spec/openapi.yaml` — health check only

## Architecture decisions

- Session totals stay on the device for the grown-up. No accounts, no session API, and no populated database schema.
- Tempo, placement, scan judgment, and the next color target are pure functions in `artifacts/toys-village/game/rules.ts`, with node tests.
- Screens send `SimulatedSensor` placement and scan events. Camera and location packages are not installed. See `artifacts/toys-village/docs/sensing-week-one.md`.
- Speech and music are separate. Steady tempo locks playback at 1. The rising curve stays in `tempoFor`. Speech uses a system voice, with a lower pitch and a near-natural rate. No paid TTS.
- Routes are `app/index.tsx`, `app/grown-up.tsx`, `app/play/time.tsx`, and `app/play/color.tsx`. Session state sits above the stack. Grown-up controls are press-and-hold.

## Product

- Time Game: a returning toy adds an instrument and a gentle tempo increase. Taking a toy back out does not undo the song.
- Color Game: a spoken color and one large swatch. The next target is random among toys still out. Color names are not printed on the child screen.
- Toy placement and scanning are simulated. No camera or box sensor is connected.
- A grown-up starts the session and can record prompts, mismatches, and toys accepted. That record stays on the device.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Grown-up controls, including start and finish, open on press-and-hold.
- Do not require `DATABASE_URL` to boot or understand the app.
- Do not add a camera scan unless `artifacts/toys-village/docs/sensing-week-one.md` is changed to choose one. It currently does not.
- CI runs `pnpm run typecheck` and `pnpm run test` on Node 22.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
