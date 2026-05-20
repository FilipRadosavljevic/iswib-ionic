# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

Ionic 8 + Angular 21 + Capacitor 8 app (TypeScript 5.9) backed by Firebase
(Auth, Firestore, Storage, Cloud Functions). Capacitor app id
`com.iswib.app`, web dir `./www/browser` (application builder output).
Firebase project `iswib-app-30f00`. The app is the ISWiB conference
companion — schedule, workshops, discovery, restaurants, currency
converter, plus paused-but-tracked shop / cart / profile features (see
"Paused features" below).

Key satellite versions:
- AngularFire 20 (`@angular/fire@20.0.1`) held in place by a
  `package.json` `overrides` block until `@angular/fire@21` ships stable
  — see `memory/project_deferred_cleanups.md`.
- Firebase JS SDK 10.x.
- ESLint 9 (flat config in `eslint.config.js`), `typescript-eslint` 8,
  `@angular-eslint` 21.
- Swiper 12 (used for the sponsors carousel; replaces the deprecated
  `ion-slides`).
- Build uses Angular's **application builder** (esbuild) — fast,
  outputs to `www/browser/`.

## Commands

App (run from repo root):
- `npm start` — `ng serve` dev server
- `npm run build` — `ng build` via the application builder (outputs to
  `./www/browser/`)
- `npm run lint` — `ng lint` against `eslint.config.js`
- `npm run start:emulators` — Firebase emulators (Auth 9099, Firestore
  8080, Functions 5001, Storage 9199, UI on) with
  `--import=./firebase-exports --export-on-exit`. Seed data lives in
  `./firebase-exports/`.
- `npm run import-firestore-data`, `npm run create-bucket` — GCS-based
  helpers for promoting the local export into a `gs://` bucket and
  running `gcloud firestore import` against the live project.

No test or e2e scripts — the previous Karma + Protractor scaffold was
removed during the upgrade cleanup. Reintroduce with a modern runner
(Vitest, Jest, or Web Test Runner) if/when you decide to write tests.

Cloud Functions (`functions/`, Node 18, TypeScript):
- `npm --prefix functions run lint`
- `npm --prefix functions run build`
- `npm --prefix functions run serve` — build + start functions emulator
- `npm --prefix functions run deploy`

Functions deploy runs lint + build as predeploy hooks (see
`firebase.json`).

Native (Capacitor 8, requires Android Studio Otter 2025.2.1+, JDK 21):
- `npx cap sync android` — copy `www/browser/` into `android/` +
  refresh plugins
- `npx cap open android` — open the Android Studio project
- `npx cap open ios` — Mac-only (Xcode 26+). The `ios/` folder is
  committable on Windows but you can't build it locally.

Formatting: Prettier (`.prettierrc.json`) — 2-space indent, single
quotes, **no semicolons**, 100-char width, trailing commas. ESLint
enforces component class suffixes (`Page` or `Component`) and the
`app-` selector prefix.

## Architecture

### Standalone everywhere

No NgModules in app code. Components import their own dependencies via
the `imports` array on the `@Component` decorator. Bootstrap goes
through `bootstrapApplication(AppComponent, appConfig)` in
`src/main.ts`, with all `provideFirebaseApp` / `provideAuth` /
`provideFirestore` / `provideStorage` / `provideFunctions` etc. in the
`providers` array.

NgModule wrappers (`*.module.ts`, `*-routing.module.ts`) still exist
for the lazy-loaded tabs because their routing module declares the
`loadComponent` route — the wrapper survives even after the standalone
migration. The pages they wrap are standalone components.

### Routing & feature layout

Tab-based shell with lazy-loaded routes under `src/app/tabs/` (schedule,
workshops, discovery, restaurants — plus paused `shop` / `store-cart`).
Top-level routes: `/` (login), `/registration`, `/forgot-password`,
`/converter` (auth-gated), `/discovery-page`, `/profile` (auth-gated).

Tab inner routes use `loadComponent: () => import(...).then(m => m.X)`.
Outer (per-tab) routes still use `loadChildren` against the surviving
module wrappers — that's correct, the inner standalone components do
the actual rendering.

Auth-gated routes use `canActivate: [AuthGuard]`
(`src/app/services/auth/auth.guard.ts`). The login page uses
`redirectLoggedInToHome` (from `@angular/fire/auth-guard`) to bounce
already-authenticated users.

### Data layer — Firestore converters everywhere

Every domain model ships a `FirestoreDataConverter<T>` co-located with
the model (`src/app/tabs/workshops/models/workshop.model.ts`,
`src/app/tabs/schedule/models/schedule-day.model.ts`,
`src/app/models/user.model.ts`). `DataService`
(`src/app/services/data.service.ts`) is a thin layer that returns
`collectionData()` observables with the converter applied — when
adding a new entity, follow the converter pattern rather than mapping
in components.

Note the explicit `Observable<T[]>` return type + `as Observable<T[]>`
cast in `getSchedule()` and `getWorkshops()`. This is because rxfire 6
/ AngularFire 19+ widened `collectionData()`'s return type with
`WithFieldValue<T>` even when `.withConverter()` is applied — a
typing-only regression. The cast is at the data-service boundary so
consumers stay clean.

**Schedule quirk:** events in a `ScheduleDay` are stored in Firestore
as an object keyed by numeric index (not an array). The converter
parses those keys back into a sorted array — see
`schedule-day.model.ts` `fromFirestore`. Preserve this shape when
writing schedule data.

### Auth & registration flow

- `AuthService` (`src/app/services/auth/auth.service.ts`) exposes a
  `user$` observable built by `switchMap`-ing Firebase Auth state to
  the Firestore `users/{uid}` doc and `shareReplay(1)`-ing the result.
  Treat this as the single source of truth for the current user —
  don't reach for `auth.currentUser` directly outside the service.
- Registration calls the `createUserRequest` HTTPS callable (region
  **`europe-central2`** — the client sets `this.functions.region =
  'europe-central2'`). The function creates the Firebase Auth user
  **disabled** and writes a `UserRequest` doc for admin approval.
  Don't bypass this with `createUserWithEmailAndPassword` directly —
  the approval workflow would be skipped.
- Role lives on the `User` doc. Current values (from
  `registration.page.ts`): `ORG`, `GG`, `INFO`, `LOG`, `MEDIA`,
  `PARTICIPANT`. `AuthGuard` only checks authentication; role-based
  UI gating is done ad-hoc in components.

### Swiper integration (sponsors carousel)

The sponsors carousel in `src/app/tabs/restaurants/tab5.page.html` uses
Swiper Web Components instead of the deprecated `ion-slides`. Setup is
in `src/app/app.component.ts` (`registerSwiperElements()` at module
load). `Tab5Page` declares `schemas: [CUSTOM_ELEMENTS_SCHEMA]` to accept
the `<swiper-container>` / `<swiper-slide>` tags. `IonicSlides` is
passed via `[modules]="swiperModules"` to preserve the Ionic-tuned
swipe feel.

### State management

No NgRx / Akita. Services-as-stores with RxJS: components subscribe to
`AuthService.user$` and the various `DataService` getters. Signal-based
state is also used where the migration schematic converted
`@ViewChild` / `@Input` to `viewChild()` / `input()`. Add new shared
state as a service exposing an `Observable` + `shareReplay(1)` or a
signal — don't introduce a store library.

### Cloud Functions

`functions/src/index.ts` exports `createUserRequest`. Region pinned to
`europe-central2`; match it when adding new callables so the client
config keeps working.

### Environments

`src/environments/environment.ts` holds Firebase config, the currency
API key, and emulator host/port flags. The emulator ports above must
stay in sync with `firebase.json` if changed.

## Paused features (do NOT delete)

The shop / cart / profile features have commented-out routes in the
routing modules but their source code is preserved and modernized to
Angular 21 standards:

- `src/app/profile/` — user profile page, route commented in
  `src/app/app-routing.module.ts`
- `src/app/tabs/shop/` — store page (Tab3), route commented in
  `src/app/tabs/tabs-routing.module.ts`
- `src/app/tabs/store-cart/` — cart modal, route commented in
  `src/app/tabs/tabs-routing.module.ts`
- `src/data/storeData.ts` — typed seed data (`Partial<Product>[]`)

To resume any of these features, uncomment the relevant route, run
`npm run build`, and pick up the work. Known WIP issues are noted in
`memory/project_deferred_cleanups.md`.

## Repo layout notes

- `firebase-exports/` is what `start:emulators` imports from / exports
  to — touch this if you need to refresh local seed data.
- `www/` is the Capacitor build output (the actual bundle lives in
  `www/browser/` under the application builder). `android/` and
  `ios/` are the native Capacitor projects, both gitignored —
  regenerate with `npx cap add <platform>` when missing.
- `eslint.config.js` is the flat-config ESLint setup using the
  `defineConfig()` helper from `eslint/config`. No `.eslintrc.json`.
- `package.json` has an `overrides` block forcing `@angular/fire`'s
  Angular peers to the root project versions; remove once
  `@angular/fire@21` ships stable.
- `tsconfig.json` has `skipLibCheck: true` — this is Angular CLI's
  modern default and stays.
- `README.md` is the unmodified Ionic CLI template — not a useful
  reference.

## Always consult official documentation before suggesting or changing anything

Before applying any change or recommending an approach involving any framework, tool, or library used in this repo (Angular, Ionic, Capacitor, ESLint, TypeScript, AngularFire, Firebase, RxJS, Swiper, `@typescript-eslint`, `@angular-eslint`, Prettier, etc.), check the canonical official documentation first. Do NOT rely on training-data recall — versions move fast and recommendations change.

**Source priority:**
1. **Official documentation site** — `angular.dev`, `ionicframework.com/docs`, `capacitorjs.com/docs`, `eslint.org/docs`, `typescript-eslint.io`, `firebase.google.com/docs`, `rxjs.dev`, `swiperjs.com`, etc.
2. **npm package page** (`npmjs.com/package/<name>`) for projects without a dedicated docs site — for version-pinned metadata, README excerpts, deprecation notes.
3. **GitHub repository** — for migration guides under `docs/`, the CHANGELOG, breaking changes, source of truth for any "official" claim.

**Use `WebFetch` proactively, not reactively.** When the user asks about a migration or new feature, fetch the relevant guide *as part of the same turn*, not after they ask. Quote literal recommendations / commands from the docs in your reply so the user can see the source.

**Concrete situations:**
- **Major-version migrations** (e.g. ESLint 8→9, Capacitor 7→8, Angular 20→21): fetch the migration guide for that exact version range. Don't approximate from memory.
- **New package adoption**: check the package's current API on the docs site.
- **Writing a new feature**: consult the relevant Angular guide (`angular.dev/guide/...` for forms, routing, signals, change detection, control flow, etc.) before settling on an approach.
- **Choosing between two ways to do something**: confirm which is the *currently* recommended path (the one schematics target, the one official examples use).
- **Bug fixing**: check whether the behavior in question is documented, deprecated, or has a known workaround in the docs.

**Intent:** This codebase should reflect the latest official Angular-team recommendations end-to-end. When in doubt, fetch and quote.

## Angular style guide (official: https://angular.dev/style-guide)

Apply these rules whenever writing or reviewing code in this repo.
They are the canonical Angular team's recommendations as of v21+; this
codebase has been migrated to match.

**File & folder naming**
- kebab-case file names: `user-profile.component.ts` (no camelCase)
- shared base name across extensions: `user-profile.ts` + `.html` +
  `.css` + `.spec.ts`
- avoid generic names like `helpers.ts`, `utils.ts`, `common.ts`
- co-locate a component's `.ts`, `.html`, `.css`, and tests in the
  same directory
- organize by feature (`tabs/<tab>/`, top-level pages, `services/`,
  `models/`, `components/`), NOT by code type when adding new
  features — group what changes together
- one concept per file (one component, one service, one directive)

**Class member order**
- inside a class: injected dependencies → `input()` / `output()` /
  `model()` / signal queries → other properties → constructor (if
  any) → lifecycle hooks → methods
- mark Angular-initialized properties `readonly` (`input()`,
  `output()`, `model()`, `viewChild()`, `contentChild()`, etc.)
- use `protected` for members consumed only from the template
- properties before methods

**Dependency injection**
- use `inject()`, NOT constructor parameters. Better type inference,
  cleaner reads, handles comments well.

**Components & directives**
- standalone by default. Register dependencies in the component's
  `imports` array.
- attribute selectors with camelCase names for directives (e.g.
  `[mrTooltip]`); apply the `app-` prefix
- keep components focused on presentation; refactor business logic
  into services or pure functions
- implement lifecycle interfaces (`OnInit`, `OnDestroy`, etc.) —
  guarantees correct method names
- lifecycle hooks stay thin; delegate to well-named methods
- name event handlers for the action, not the DOM event:
  `saveUserData()` not `handleClick()`

**Templates**
- use modern control flow `@if` / `@for` / `@switch` (NOT `*ngIf` /
  `*ngFor` / `*ngSwitch`)
- use `[class.foo]="cond"` and `[style.foo]="value"` (NOT `[ngClass]`
  / `[ngStyle]`)
- use kebab-case CSS property names in style bindings:
  `[style.background-color]` (the IDE's CSS validator only recognizes
  kebab-case even though Angular accepts both)
- self-closing tags for void-content components: `<my-comp />` not
  `<my-comp></my-comp>`
- avoid complex template expressions — compute via `computed()`
  signals in the component

**Signals & change detection**
- prefer signal APIs everywhere: `input()`, `output()`, `viewChild()`,
  `signal()`, `computed()`, `effect()`
- new components default to `OnPush` change detection

**Routing**
- use `loadComponent: () => import('./x').then(m => m.X)` for lazy
  routes (NOT `loadChildren` against NgModules)
