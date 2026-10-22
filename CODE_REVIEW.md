# Code review — **Sakay!** (GenSan tricycle fare calculator)

**Reviewed:** commit `59729c8` ("Add files via upload"), branch `main`
**Stack:** React 19.2 · Vite 7.3 · Tailwind CSS 4.1 · Leaflet 1.9 / react-leaflet 5 · TypeScript 5.9
**Size:** 2,172 lines across 15 source files, one page, no backend

---

## Verdict

This is a genuinely nice prototype with a clear identity and better-than-average attention to the
details most people skip (reduced-motion handling, request-abort logic, legal attribution, a real
centralized fare model). It builds clean and type-checks clean.

But it is **not yet safe to publish as an authority on fares**, for three reasons:

1. A layout bug means the navigation never actually sticks.
2. The "am I in GenSan?" geolocation check is logically inverted, and nothing else validates
   geography — the app will happily print an official-looking ₱1,419 fare for a pin in Manila
   (fallback estimate; see H3).
3. The cluster badge is presented as information but is computed from 21 hand-picked points that all
   sit within 4.6 km of the CBD, so beyond ~3 km it is effectively a function of compass bearing.

The good news: all three are small, well-contained fixes.

---

## What I verified

```
$ npm ci                      → 101 packages
$ npm audit                   → 5 advisories (4 high, 1 low) — dev-only, see M14
$ npx tsc --noEmit            → exit 0, no errors
$ npm run build               → dist/index.html  455.92 kB │ gzip: 135.14 kB
```

I also ran the fare model and the classifier directly against the data file:

* `computeFare()` is **consistent with all 49 posted matrix rows** — zero mismatches. The
  `- 1e-9` epsilon at the 4 km boundary is a thoughtful touch (4.000 km → ₱15, 4.0001 km → ₱16).
* All 21 cluster reference points lie **0.39 – 4.58 km from the CBD** (details in H4).
* Real-world coordinates run through the geolocation bounds check (details in H2).

---

## What's working well

* **Fare logic is centralized and testable.** `computeFare` / `haversineKm` / `guessCluster` are
  pure functions in `src/data/fareData.ts`; the UI never re-implements the formula. Every matrix row
  agrees with the computed value — that is rare and worth preserving.
* **Request hygiene.** `Calculator` uses an `AbortController` *and* an aborted-signal check before
  `setState`; `LocationCard` uses a monotonic `seq` ref to discard stale searches. Most codebases
  get this wrong.
* **Fallback behavior.** If OSRM fails, the app degrades to a straight-line estimate instead of
  dying, and labels the source.
* **Motion accessibility.** `prefers-reduced-motion` is handled in both CSS *and* JS
  (`prefersReducedMotion()` in `hooks.tsx`), which almost nobody does.
* **Design system.** Tailwind v4 `@theme` tokens are actually used as tokens; colors, fonts and
  radii are named rather than scattered hex values (mostly — see L2).
* **Honest copy.** The legal quote is attributed, the estimate disclaimer exists, and the fallback
  is disclosed. The tone ("dungagi lang singko", "tunay na rate ito, kuya") is a real asset.
* **No XSS surface.** All HTML-string injection (`pinIcon`) uses constants, never user input.

---

## Findings

| ID | Severity | Area | Finding |
|----|----------|------|---------|
| **H1** | High | CSS | `overflow-hidden` on `<header>` defeats `position: sticky`; the nav never sticks |
| **H2** | High | Logic | Geolocation bounds check uses `&&` where it needs `\|\|` — Tacloban is "in GenSan" |
| **H3** | High | Correctness | No city-bounds guard on the calculator; out-of-city pins produce authoritative-looking fares |
| **H4** | High | Data | Cluster classifier is 21 points inside a 4.6 km box — the badge is essentially bearing-only |
| **M1** | Medium | UX | 2 of 3 geolocation error paths set `error` without opening the dropdown → errors are invisible |
| **M2** | Medium | UX | No fetch timeouts; a stalled OSRM/Nominatim call spins forever |
| **M3** | Medium | Edge case | Identical start and drop-off → "Computing…" forever |
| **M4** | Medium | Ops | Public demo servers (OSRM demo, Nominatim) in the production path, no rate limiting/cache |
| **M5** | Medium | Correctness | Straight-line fallback under-reported in the UI; ±1–3 ₱ on winding roads |
| **M6** | Medium | A11y | 6 contrast failures (computed), incl. 1.40:1 input borders |
| **M7** | Medium | A11y | Fare result never announced; mode toggle has no `aria-pressed`; inputs are placeholder-only |
| **M8** | Medium | UX | Anchor links scroll section headers under the sticky nav (no `scroll-margin-top`) |
| **M9** | Medium | Animation | `useCountUp` jumps on rapid changes; ~60 `setState`/s for a cosmetic number |
| **M10** | Medium | Tooling | `npm run build` never type-checks; no lint, tests, or CI |
| **M11** | Medium | Repo | No `.gitignore`, README, or LICENSE; `dist/` + `node_modules/` already untracked |
| **M12** | Medium | Dead code | `utils/cn.ts` + `clsx` + `tailwind-merge` are unused |
| **M13** | Medium | Packaging | `@types/leaflet` is a runtime dependency; package still named `react-vite-tailwind@0.0.0` |
| **M14** | Medium | Deps | `npm audit`: 4 high + 1 low advisory, all fixable without a breaking change |
| L1–L15 | Low | Polish | Hardcoded fare strings, duplicate city-center coords, scroll-hijack, font bloat, etc. |

---

## High severity

### H1 — The sticky nav never sticks

`src/components/Hero.tsx:91` and `:98`

```tsx
<header className="relative overflow-hidden">        {/* ← the culprit */}
  <nav className="sticky top-0 z-[1300] ...">        {/* ← never sticks */}
```

`position: sticky` is resolved against the nearest **scroll container**. `overflow: hidden` on
`<header>` makes the header itself a scroll container, and that container never scrolls — so the nav
is pinned to the top of the header (i.e. its static position) and scrolls out of view with the page.
This is the classic ancestor-overflow sticky trap; `z-[1300]` and `backdrop-blur` do nothing to help.

**Fix** — keep the clipping, drop the scroll container:

```diff
- <header className="relative overflow-hidden">
+ <header className="relative overflow-x-clip">
```

`overflow: clip` clips identically but does not create a scroll container, so sticky resumes working
against the viewport. (If you also need vertical clipping, wrap the ₱ watermark in its own
`absolute inset-0 overflow-hidden pointer-events-none` layer instead.)

**Why it matters:** the hero is more than one viewport tall, and those four links are the only
navigation on the page. I confirmed this from the CSS cascade rather than a browser run — worth a
30-second visual check after the change.

---

### H2 — `&&` instead of `||` in the geolocation bounds check

`src/components/LocationCard.tsx:73–79`

```tsx
if (
  (latitude < 5.9 || latitude > 6.4) &&
  (longitude < 124.9 || longitude > 125.4)
) {
  setError("You appear to be outside GenSan — pin on the map instead.");
  return;
}
```

The error only fires when the point is out of range on **both** axes. Any point that is out of range
on exactly one axis is accepted as a GenSan location.

I ran real coordinates through the exact expression:

| Location | Coords | Result |
|---|---|---|
| GenSan CBD | 6.1112, 125.1735 | accept ✅ |
| Manila | 14.5995, 120.9842 | reject ✅ |
| Davao City | 7.1907, 125.4553 | reject ✅ |
| **Malaybalay, Bukidnon** | 8.1575, 125.1278 | **accept ❌** |
| **Tacloban City** | 11.244, 125.003 | **accept ❌** |
| **Middle of the Sulu Sea** | 8.0, 125.0 | **accept ❌** |

**Fix:**

```diff
- (latitude < 5.9 || latitude > 6.4) &&
- (longitude < 124.9 || longitude > 125.4)
+ latitude < 5.9 || latitude > 6.4 ||
+ longitude < 124.9 || longitude > 125.4
```

Better: lift the box into `fareData.ts` as a single `isWithinCity()` helper and use it here **and**
in the calculator (H3), so the two can't drift.

---

### H3 — Nothing stops the calculator from pricing a trip outside GenSan

Three separate gaps line up:

* Nominatim is queried with `countrycodes=ph` (the whole country) and a `viewbox` that only
  **biases** results — `bounded=1` is missing — so a Manila result is a legal selection
  (`LocationCard.tsx:44`).
* Map clicks are unbounded (`FareMap.tsx` `MapClicker`).
* `computeFare()` extrapolates the ₱1/km rule with no ceiling.

Running the real math on real coordinates, this is what the ticket would display:

| Pin | Distance | Ticket says | Badge |
|---|---|---|---|
| SM Mall of Asia, Manila | ≈1,043 km | **₱1,419** | "White Cluster zone" |
| Cebu City | ≈489 km | ₱671 | "White Cluster zone" |
| Davao City | ≈124 km | ₱179 | "White Cluster zone" |
| Koronadal | ≈57 km | ₱88 | "White Cluster zone" |

Distances above use the straight-line ×1.35 fallback (`Calculator.tsx:102`); a live OSRM road route
would give somewhat different kilometrage, but the order of magnitude — and the absurdity — stands.

The UI then prints "Total fare", "Pay your driver", and a colored zone badge — which reads as
authoritative. The ordinance governs *intra-city* trips, so this isn't merely imprecise; it's out of
scope.

**Fix:** validate both pins before pricing.

```ts
// fareData.ts
export const CITY_BOUNDS = { minLat: 5.9, maxLat: 6.4, minLng: 124.9, maxLng: 125.4 };

export function isWithinCity(lat: number, lng: number): boolean {
  return (
    lat >= CITY_BOUNDS.minLat && lat <= CITY_BOUNDS.maxLat &&
    lng >= CITY_BOUNDS.minLng && lng <= CITY_BOUNDS.maxLng
  );
}
```

Then in `Calculator`, gate the route effect / fare display, and render an explicit out-of-area state
("That drop-off is outside General Santos City — fares here cover city trips only."). Also add
`&bounded=1` to the Nominatim query so "search" means "search the city".

---

### H4 — The cluster badge is a nearest-neighbour over 21 points, all downtown

`src/data/fareData.ts:95–104, 139–146, 181–189`

Measured distance of every reference point from `CITY_CENTER`:

| Cluster | refs | nearest ref | farthest ref |
|---|---|---|---|
| White | 8 | 0.98 km | 4.58 km |
| Green | 6 | 0.51 km | 2.60 km |
| Red | 7 | 0.39 km | 2.59 km |

Centroid separations: **green ↔ red = 1.07 km**, white ↔ green = 2.34 km, white ↔ red = 2.52 km.
The three "zones" are basically on top of each other.

Probing `guessCluster()` at 3 / 6 / 10 / 15 / 20 / 25 km on six bearings gives the *same* answer at
every distance:

```
 3 km -> N:white  S:red  E:green  W:white  NE:white  SW:white
25 km -> N:white  S:red  E:white  W:white  NE:white  SW:white
```

So past ~3 km the badge is a function of compass bearing, not of the barangay you're in. Meanwhile
the matrix itself contains 25 km runs (Upper Labay) — the tool's own data covers areas the badge
cannot resolve.

There is also a data-model mismatch: `areas` and `refs` are parallel arrays with nothing linking
them. White lists **Katangawan** and Red lists **Gensan Port** with no corresponding reference point
(9 areas / 8 refs, 8 / 7 refs).

**Fix options, in order of preference:**

1. Make the relationship explicit and complete, and source the points properly:
   ```ts
   interface ClusterArea { name: string; ref: [number, number]; }
   ```
   Then all 23 areas have a centroid (PSA/OSM barangay polygons, not eyeballed).
2. Keep the heuristic but add a confidence gate: if the nearest reference is more than ~1.5 km away,
   render "zone uncertain" instead of naming a cluster.
3. If neither is feasible before launch, remove the badge. Right now it's the least defensible claim
   in the UI, and it sits directly under a peso amount, which lends it authority it hasn't earned.

Note the copy already hedges ("Zone badge estimates…", `Calculator.tsx:275`), but a colored pill
that says "White Cluster zone" is read as a fact, not an estimate.

---

## Medium severity

### M1 — Two geolocation errors are invisible

`src/components/LocationCard.tsx:63–88` — the error list only renders when `open === true`
(`:187`), but two paths set an error without opening it:

```tsx
setError("You appear to be outside GenSan — pin on the map instead.");
return;                                   // no setOpen(true)
...
() => setError("Location permission denied — click the map instead.")   // no setOpen(true)
```

Concrete consequence: a first-time visitor clicks **here**, denies the permission prompt, and the
button appears dead — nothing on screen changes. Only the "unsupported browser" path opens the
dropdown (`:66`).

**Fix:** `setOpen(true)` on every error path, or (better) move geolocation errors out of the
search-results `<ul>` into a small inline status line under the input, where they can't be hidden
behind dropdown state.

### M2 — No fetch timeouts

`src/components/Calculator.tsx:85` and `src/components/LocationCard.tsx:47`

Neither request has a deadline. The `AbortController` and `seq` guard only cancel when a *new*
request supersedes the old one — they do nothing if the server simply stalls. Result: "Measuring the
road…" or "Searching General Santos…" spins forever with no way out but a reload.

```ts
const signal = AbortSignal.any([ctrl.signal, AbortSignal.timeout(8000)]);
const res = await fetch(url, { signal });
```

(For older Safari, fall back to a `setTimeout` that calls `ctrl.abort()`.)

### M3 — Same start and drop-off = permanent "Computing…"

`Calculator.tsx:68–75` returns early with `route = null`, `loading = false`.
`ResultTicket.tsx:136–141` then sees `hasBoth === true` and prints "Computing…" — forever, because
no request will ever complete.

Reproduce: search the same barangay for both pins, or double-click one spot on the map.

**Fix:** a distinct state — "Start and drop-off are the same place." Add a `samePoint` flag to the
ticket props rather than overloading `hasRoute`.

### M4 — Public demo infrastructure in the production path

| Service | Used for | Status |
|---|---|---|
| `router.project-osrm.org` | every distance/ETA | OSRM's **demo** server: no SLA, shared, rate-limited |
| `nominatim.openstreetmap.org` | place search | Public instance: max ~1 req/s, requires identifying app, no heavy use |
| `tile.openstreetmap.org` | map tiles | Usage policy limits; fine at small scale, needs attribution (present ✅) |

The app fires a routing request on **every** pin change with no debounce, cache, or throttle. For a
city-wide civic tool, this is exactly the pattern that gets an origin blocked during a traffic spike
— right when people need it.

**Recommend:** self-host OSRM/Valhalla (the GenSan extract is tiny) or use a paid provider; put a
caching layer in front keyed by rounded coordinates (`lat.toFixed(3)` ≈ 100 m) so repeated lookups
never leave the client; throttle Nominatim to 1 req/s and cache by query string.

### M5 — The straight-line fallback is under-disclosed

`Calculator.tsx:102`: `haversineKm(...) * 1.35`, ETA at a flat 18 km/h (while the OSRM path uses car
duration × 1.25 — two different models).

On GenSan's grid this is defensible. On the winding upland roads that the matrix itself covers
(Conel, Olympog, Upper Labay) a 1.35 factor can be well off, and because the fare is a **step**
function, ±0.9 km is ±₱1. The only signal is a 9px caption at the bottom of the ticket
(`ResultTicket.tsx:161–165`).

**Fix:**
* Draw a dashed straight line between the pins when `source === "approx"` so the user *sees* that no
  road was traced.
* Surface the caveat next to the total, not in the fine print: "Approximate route — fare may differ
  by ₱1–3."

### M6 — Contrast failures (computed, WCAG 2.1)

| Usage | Ratio | Required | |
|---|---|---|---|
| `text-cream/40` on ink — footer fine print, 10px | **3.61** | 4.5 | ❌ |
| `text-ink-soft/80` on paper | **3.56** | 4.5 | ❌ |
| `text-ink-soft/70` on paper | **2.94** | 4.5 | ❌ |
| `placeholder:text-ink-soft/60` | **2.45** | 4.5 | ❌ |
| `text-tri-red` on cream — error text, 12px | **4.26** | 4.5 | ❌ |
| Input border `#e3d7bd` on cream — 1.4.11 | **1.40** | 3.0 | ❌ |
| Hover border `#cbbb96` on cream | **1.86** | 3.0 | ❌ |
| `text-ink-soft` on paper (baseline) | 5.38 | 4.5 | ✅ |
| `text-tri-yellow` on ink | 9.67 | 4.5 | ✅ |

**Fixes that measure correctly:**
* Error text → `#b2332d` (`tri-red-deep`) = **6.06:1**.
* Input/hover borders → `#9c8c66` = **3.25:1**.
* Alpha text: use full `text-ink-soft` (5.38) or `text-cream/70` (8.04) instead of `/80`, `/70`, `/60`,
  `/40`.

### M7 — The core result is not accessible

* The fare, distance and ETA update silently. No `aria-live`, no `role="status"` anywhere
  (verified by grep) — a screen-reader user pins two points and hears nothing.
* The Start / Drop-off mode toggle (`Calculator.tsx:186–205`) has no `aria-pressed`; its state is
  conveyed by color (yellow vs red) plus a "●" glyph.
* Both search inputs are **placeholder-only** — no `<label>`, no `aria-label`, and no combobox
  semantics on the results list.

```tsx
<p role="status" aria-live="polite" className="sr-only">
  {route ? `Fare ₱${fare.total}, ${route.km.toFixed(1)} kilometres, about ${Math.round(route.etaMin)} minutes` : ""}
</p>
```

Also: no skip-to-content link, and the map container has no accessible name.

### M8 — Anchor targets land under the nav

The nav is `py-3` + a 40px logo + a 2px border ≈ **66px** tall. Sections use `py-14` (56px) and
`py-16` (64px), and there is no `scroll-margin-top` anywhere (verified by grep). So clicking
"Calculate" in the nav puts the "· The calculator" eyebrow behind the nav bar.

```css
html { scroll-padding-top: 5.5rem; }
```

### M9 — `useCountUp` jumps, and re-renders 60×/s

`src/hooks.tsx:59–82`. On a target change, the cleanup runs *before* the new effect and does:

```ts
return () => {
  cancelAnimationFrame(raf);
  prevRef.current = to;      // ← "to" is the OLD target, not the current displayed value
};
```

So a change mid-animation starts the next tween from the **previous target**, not from what's on
screen — a visible jump. Dragging the "Try the formula" slider (`HowItWorks.tsx:122`) makes this
obvious, since every `step=0.1` change interrupts the previous tween.

**Fix:** record the current value inside `tick` and use that as `from`; don't overwrite it in
cleanup.

```ts
const shownRef = useRef(target);
// inside tick: shownRef.current = next; setValue(next);
// new effect: const from = shownRef.current;
```

Separately: driving 650 ms of animation through `useState` gives ~40 renders per animated number
and ~60/s while dragging. For a purely cosmetic value, write to a ref + text node, or use CSS
transitions on a `transform`/`counter` — but that's an optimization, not a bug.

### M10 — `npm run build` doesn't type-check; no lint, tests, or CI

```json
"build": "vite build"
```

Vite strips types without checking them. `tsc --noEmit` passes today, but nothing enforces that it
keeps passing. There are two `// eslint-disable` comments (`hooks.tsx:19`, `FareMap.tsx:51`)
referencing a linter that isn't installed.

**Suggested:**

```json
"scripts": {
  "dev": "vite",
  "typecheck": "tsc --noEmit",
  "lint": "eslint .",
  "test": "vitest run",
  "build": "tsc --noEmit && vite build",
  "preview": "vite preview"
}
```

The pure logic is *ideal* for tests — no DOM needed:

```ts
expect(computeFare(3.99).total).toBe(15);
expect(computeFare(4).total).toBe(15);
expect(computeFare(4.0001).total).toBe(16);
expect(computeFare(25).total).toBe(36);   // matches the Upper Labay row
```

Plus one component test asserting that an out-of-city coordinate is rejected (H2/H3), which is
exactly the bug class that slipped through here.

### M11 — Repo hygiene

* **No `.gitignore`.** `git status` currently shows `sakay!/dist/` and `sakay!/node_modules/` as
  untracked. A `git add .` would commit 101 packages and the build output.
* No `README.md`, `LICENSE`, CI workflow, or editor config.
* Single commit `"Add files via upload"` — no meaningful history to bisect.
* The project lives one level down in a directory literally named **`sakay!`**. The `!` is a history-
  expansion character in interactive bash (`cd sakay!` → `bash: !: event not found`), needs quoting
  in every script/CI path, and breaks naive URL handling. Recommend renaming to `sakay` and, ideally,
  moving the project to the repo root so `npm ci` works from the clone directory.

### M12 — Dead code and unused dependencies

`src/utils/cn.ts` is never imported (verified). Its only dependencies — `clsx` and `tailwind-merge` —
are therefore shipped for nothing. Either adopt `cn()` in the class-heavy components
(`Calculator`, `LocationCard`, `FareMatrix`) or delete all three. The bundle cost is small, but
`cn()` is the conventional helper in this stack and its absence shows up as 200-character template
literals in `Calculator.tsx:188–202`.

### M13 — Packaging details

* `@types/leaflet` is in `dependencies` — it should be in `devDependencies` (it's a type-only package
  and currently installed in production).
* `package.json` still says `"name": "react-vite-tailwind"`, `"version": "0.0.0"` — scaffolding
  leftovers. `npm run build` currently prints `> react-vite-tailwind@0.0.0 build`. Add `description`,
  `license`, and ideally `engines` / `packageManager`.

### M14 — Four high-severity advisories in dev dependencies

`npm audit` reports 5 advisories (4 high, 1 low). All are build/dev-server tooling, so the deployed
static HTML is unaffected — but anyone running `npm run dev` locally is exposed:

| Package | Severity | Issue | Fix |
|---|---|---|---|
| `vite` 7.0.0–7.3.6 (installed 7.3.2) | high | `launch-editor` NTLMv2 hash disclosure via UNC path handling on Windows | `vite@7.3.7` |
| `vite-plugin-singlefile` ≤2.3.3 (installed 2.3.0) | high | pulls vulnerable `micromatch` / `braces` | `vite-plugin-singlefile@2.3.4` |
| `micromatch` ≥0.2.0 | high | ReDoS via `braces` | via the above |
| `braces` | high | stack-exhaustion DoS on deeply nested patterns | via the above |
| `esbuild` 0.27.3–0.28.0 | low | arbitrary file read when running the dev server on Windows | `npm audit fix` |

All four are fixable with patch/minor bumps and no code changes:

```bash
npm i -D vite@^7.3.7 vite-plugin-singlefile@^2.3.4
npm audit
```

Worth adding `npm audit --audit-level=high` to CI once CI exists (M10) so this doesn't drift.

---

## Low severity / polish

| ID | Where | Issue |
|----|-------|-------|
| L1 | 6 files | Fare literals duplicated: `"₱1.00"` appears 4×, `"first 4 km"` 3×, despite `PER_KM`/`BASE_KM` existing. `ResultTicket.tsx:116`, `HowItWorks.tsx:144`, `Hero.tsx:84-85`, `Clusters.tsx:18`, `FareMatrix.tsx:27`, `Calculator.tsx:274`. Interpolate the constants instead. |
| L2 | `fareData.ts:26` vs `Footer.tsx:81` | Two different "city center" coordinates: `[6.1112, 125.1735]` vs `6.1141° N, 125.1728° E`. Pick one and derive the other. |
| L3 | `FareMap.tsx:78` | `scrollWheelZoom` is always on — the map hijacks page scroll on desktop and drag on touch. Use click-to-activate (`scrollWheelZoom="center"`) or disable while off-screen. |
| L4 | `LocationCard.tsx:44` | Nominatim `viewbox` corners are passed bottom-left/top-right (`6.0 … 6.22`) while the API expects top-left → bottom-right; and without `bounded=1` it's only a bias. The empty state says "No matches in the Philippines" though the intent is GenSan. |
| L5 | `LocationCard.tsx:154` | `onBlur={() => setTimeout(...)}` — timer isn't cleared on unmount and can fire after navigation. |
| L6 | `index.html` | No favicon, `theme-color`, Open Graph/Twitter cards, canonical URL, or `<noscript>` fallback (JS-off users get a blank page). For a shareable civic tool, the OG card matters. |
| L7 | `index.html:2` | `lang="en"` while the headline is Tagalog ("Pamasahe? Sakay na"). Wrap those spans in `lang="tl"` so screen readers switch pronunciation. |
| L8 | `index.html:8–13` | Three Google font families including Space Mono **italics**, which are never used, and Karla's full 300–800 range + italics. Render-blocking third-party CSS; self-host and subset, or drop the italic axes. |
| L9 | `FareMap.tsx:20–34` | `pinIcon` builds HTML with template literals. Safe today (constants only) — leave a comment so nobody passes a search label into it later. |
| L10 | `hooks.tsx:30` | If `IntersectionObserver` is unavailable, the constructor throws in an effect and `.reveal` stays at `opacity: 0` forever. Guard with `if (!("IntersectionObserver" in window))` → `setInView(true)`. |
| L11 | `Calculator.tsx:172` | The map is initialized inside a `.reveal` wrapper that animates `transform: translateY(26px)`. Leaflet's geometry math uses layout rects, so tiles can be offset during the reveal. Low risk (translate only), but calling `map.invalidateSize()` on reveal end is the robust fix. |
| L12 | repo root | Directory name `sakay!` — see M11. |
| L13 | `fareData.ts:180` | Red cluster cites **Ord. No. 37, s. 2018 (amended 2023)** while the app asserts one formula for all three clusters. Confirm the 2023 amendment really retains ₱15 / 4 km + ₱1/km. |
| L14 | `HowItWorks.tsx:123–124` | Slider `max={25}` duplicates the longest matrix row (Upper Labay, 25 km). Derive it from the data. |
| L15 | `ResultTicket.tsx:95` vs `:122` | Big total renders with 0 decimals (`₱16`) but the breakdown shows 2 (`₱16.00`). Fares are whole pesos, so this is cosmetic — just be consistent. |

---

## Suggested sequence

**Before showing this to anyone**

1. **H1** — one class change (`overflow-x-clip`).
2. **H2** — one operator change (`&&` → `||`), plus extract `isWithinCity()`.
3. **M1** — `setOpen(true)` on the two error paths.

**Before calling it a fare calculator**

4. **H3** — gate pricing on city bounds; add `bounded=1` to Nominatim.
5. **M3** — handle the same-point case; **M2** — add request timeouts.
6. **M5** — make the approximate-route case visible in the ticket.

**Before launch**

7. **H4** — rebuild `refs` from real barangay centroids (or add the uncertainty state, or drop the
   badge). This is the only item that needs research rather than code.
8. **M4** — move off the demo routing server and cache lookups.
9. **M6–M8** — accessibility pass (contrast, `aria-live`, labels, `scroll-padding`).
10. **M14** — `npm i -D vite@^7.3.7 vite-plugin-singlefile@^2.3.4` and re-audit.
11. **M10–M13** — typecheck in build, vitest for the fare math, `.gitignore`, README, rename package.

---

## Appendix — reproducing the checks

```bash
cd 'sakay!'                                  # note the quote: the folder name contains !

npm ci                 # 101 packages
npm audit              # 4 high + 1 low, dev-only
npx tsc --noEmit                             # 0 errors
npm run build                                # 455.92 kB → 135.14 kB gzip

# fare math + matrix consistency + cluster geometry
node --experimental-strip-types /tmp/probe.ts
# → km=4 → ₱15, km=4.0001 → ₱16, km=25 → ₱36
# → all 49 rows consistent
# → white 0.98–4.58 km, green 0.51–2.60 km, red 0.39–2.59 km from CBD
# → green↔red centroids 1.07 km apart; classifier constant per bearing at 3–25 km
```

The three probe scripts were throwaway (`/tmp`), not added to the repo. Happy to turn them into a
`vitest` suite instead — that's the natural home for them.
