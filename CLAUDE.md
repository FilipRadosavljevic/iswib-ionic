# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

Ionic 6 + Angular 13 + Capacitor 4 app (TypeScript 4.4) backed by Firebase
(Auth, Firestore, Storage, Cloud Functions). Capacitor app id `com.iswib.app`,
web dir `./www`. Firebase project `iswib-app-30f00`. The app is the ISWiB
conference companion — schedule, workshops, discovery, restaurants, currency
converter.

## Commands

App (run from repo root):
- `npm start` — `ng serve` dev server
- `npm run build` — production `ng build` (outputs to `./www`)
- `npm test` — Karma + Jasmine in headed Chrome (config: `karma.conf.js`,
  coverage at `./coverage/ngv`)
- `npm test -- --include='**/some.spec.ts'` — run a single spec
- `npm run lint` — `ng lint` (ESLint, Angular + TS rules)
- `npm run start:emulators` — Firebase emulators (Auth 9099, Firestore 8080,
  Functions 5001, Storage 9199, UI on) with
  `--import=./firebase-exports --export-on-exit`. The seed data lives in
  `./firebase-exports/` — that folder, not `dir/`, is what the emulators
  read.
- `npm run import-firestore-data`, `npm run create-bucket` — GCS-based
  helpers for promoting the local export into a `gs://` bucket and running
  `gcloud firestore import` against the live project

Cloud Functions (`functions/`, Node 18, TypeScript):
- `npm --prefix functions run lint`
- `npm --prefix functions run build`
- `npm --prefix functions run serve` — build + start functions emulator
- `npm --prefix functions run deploy`

Functions deploy runs lint + build as predeploy hooks (see `firebase.json`).

Formatting: Prettier (`.prettierrc.json`) — 2-space indent, single quotes,
**no semicolons**, 100-char width, trailing commas. ESLint enforces
component class suffixes (`Page` or `Component`) and the `app-` selector
prefix.

## Architecture

### Routing & feature modules

Tab-based shell with lazy-loaded feature modules under `src/app/tabs/`
(schedule, workshops, discovery, restaurants). Auth-gated routes use
`canActivate: [AuthGuard]` (`src/app/services/auth/auth.guard.ts`). The
login page uses `redirectLoggedInToHome` to bounce already-authenticated
users.

### Data layer — Firestore converters everywhere

Every domain model ships a `FirestoreDataConverter<T>` co-located with the
model (`src/app/tabs/workshops/models/workshop.model.ts`,
`src/app/tabs/schedule/models/schedule-day.model.ts`,
`src/app/models/user.model.ts`). `DataService`
(`src/app/services/data.service.ts`) is a thin layer that returns
`collectionData()` observables with the converter applied — when adding a
new entity, follow the converter pattern rather than mapping in
components.

**Schedule quirk:** events in a `ScheduleDay` are stored in Firestore as
an object keyed by numeric index (not an array). The converter parses
those keys back into a sorted array — see `schedule-day.model.ts`
`fromFirestore`. Preserve this shape when writing schedule data.

### Auth & registration flow

- `AuthService` (`src/app/services/auth/auth.service.ts`) exposes a `user$`
  observable built by `switchMap`-ing Firebase Auth state to the Firestore
  `users/{uid}` doc and `shareReplay(1)`-ing the result. Treat this as the
  single source of truth for the current user — don't reach for
  `auth.currentUser` directly outside the service.
- Registration calls the `createUserRequest` HTTPS callable
  (`functions/src/index.ts:8`, region **`europe-central2`** — the client
  sets `this.functions.region = 'europe-central2'` in
  `auth.service.ts:71`). The function creates the Firebase Auth user
  **disabled** and writes a `UserRequest` doc for admin approval. Don't
  bypass this with `createUserWithEmailAndPassword` directly — the
  approval workflow would be skipped.
- Role lives on the `User` doc. The current values (from
  `registration.page.ts:24-29`) are `ORG`, `GG`, `INFO`, `LOG`, `MEDIA`,
  `PARTICIPANT`. `AuthGuard` only checks authentication; role-based UI
  gating is done ad-hoc in components.

### State management

No NgRx / Akita. Services-as-stores with RxJS: components subscribe to
`AuthService.user$` and the various `DataService` getters. Add new shared
state as a service exposing an `Observable` + `shareReplay(1)` rather
than introducing a store library.

### Cloud Functions

`functions/src/index.ts` currently exports `createUserRequest`. The region
is pinned to `europe-central2` on both sides; match it when adding new
callables so the client config keeps working.

### Environments

`src/environments/environment.ts` holds Firebase config, the currency API
key, and emulator host/port flags. The emulator ports above must stay in
sync with `firebase.json` if changed.

## Repo layout notes

- `firebase-exports/` is what `start:emulators` imports from / exports
  to — touch this if you need to refresh local seed data.
- `www/` is the Capacitor build output; `android/` and `ios/` are the
  native Capacitor projects. Both are gitignored — they're regenerated
  with `npx cap add <platform>` when missing.
- No `e2e/` tests exist despite a Protractor config in `angular.json`.
- `README.md` is the unmodified Ionic CLI template — not a useful
  reference.
