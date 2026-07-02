# AGENTS.md — BOUN GPA Calculator

## What this project is

**BOUN Pusula** — a static, offline-first PWA that is a multi-module student SuperApp for Boğaziçi University (BOUN), hosted on GitHub Pages. The GPA calculator is now one module among several (Home hub, Weekly Schedule, Planner, Notes & Tasks, Campus, Grade Guide). The codebase uses native ES modules (no build step, no bundler) loaded via `<script type="module">`. A minimal `package.json` with `"type": "module"` exists only so Node.js treats `.js` files as ES modules for the test suite.

**Adding a SuperApp module** (see CLAUDE.md → "SuperApp Module Architecture" for the full contract): create `src/<key>.js`, add a `<div class="view" id="<key>View">` + a `data-view="<key>"` nav button in `index.html`, `registerViewInit`/`registerViewRefresh` at module top level, `import './<key>.js'` in `main.js`, persist via `store.js` (`loadModule`/`saveModule` + `registerAppKey`), escape user text with `escapeHtml`, and add the file to `service-worker.js` `PRECACHE_ASSETS`. Do NOT rewrite `switchView`'s dispatch into a registry.

## Key files at a glance

| File | Role | Lines |
|---|---|---|
| `index.html` | UI shell with all modals, sidebar nav, i18n attributes | 1025 |
| `styles.css` | CSS custom properties theming, responsive, print styles | ~2922 |
| `service-worker.js` | PWA offline caching (cache-first for assets, network-first for CDN) | 192 |
| `package.json` | `{"type":"module"}` — enables ES module syntax for Node.js tests | 4 |
| `src/main.js` | Entry point: imports `ui.js` + side-effect modules (`charts.js`, `features.js`) | 20 |
| `src/state.js` | Application `state` object, `elements` DOM refs, `viewInitFlags` | 123 |
| `src/i18n.js` | Translations (TR+EN), `t()`, language switching, `registerViewRefresh()` | 806 |
| `src/grades.js` | BOUN grade system, helper functions, `escapeHtml()`, course templates | 160 |
| `src/gpa.js` | Pure GPA math (no DOM): `computeSemesterGPA`, `computeCumulativeGPA`, etc. | 109 |
| `src/ui.js` | DOM manipulation, `calculateGPA()`, storage, navigation, achievements, `init()` | 1178 |
| `src/charts.js` | Chart.js rendering; registers `'charts'` view init + refresh | 341 |
| `src/features.js` | Goal calculator, export/import (versioned envelope), semester history, simulation, graduation, achievements | 970+ |
| `src/store.js` | Per-module storage helper: `loadModule`/`saveModule` (`pusula:*`), `APP_KEYS`, `registerAppKey`, `pickLang`, `uid` | ~65 |
| `src/pusula-utils.js` | PURE time/schedule math (no DOM) — imported directly by tests | ~90 |
| `src/campus-seed.js` | Static bundled campus data (`export default`; links, ring/shuttle, contacts, calendar) | ~140 |
| `src/home.js` | Home hub ("Bugün") — read-only widget aggregation over other modules + 60s tick | ~230 |
| `src/schedule.js` | Weekly timetable grid module | ~250 |
| `src/planner.js` | Exam/assignment planner with countdowns + `.ics` export | ~230 |
| `src/notes.js` | Notes (pin/search) + tasks module | ~200 |
| `src/campus.js` | Campus links / transport / contacts (render-only from seed) | ~110 |
| `src/gradeGuide.js` | Read-only grade table + FAQ derived from `grades.js`/`gpa.js` | ~90 |
| `tests/tests.js` | Regression tests (mirror GPA logic; import `pusula-utils.js` directly) | 800+ |
| `tests/test-runner.html` | Browser test runner page (loads tests.js as `type="module"`) | 23 |

Source modules live in `src/`. Assets live under `assets/favicon/` and `assets/images/`.

## Truths that differ from README/CLAUDE.md

- **Grade system is BOUN-only.** Despite CLAUDE.md listing 8 universities, the code at `src/grades.js:11` hardcodes a single `gradePoints` map (AA→4.0, BA→3.5, …, P→null). Multi-university support was removed. Do not add "İTÜ" or "Koç" grade entries unless the user explicitly asks.
- **No linter, formatter, typecheck, or build tool exists.** Do not introduce one without an explicit request.
- **`output/` and `tmp/` directories** exist for PDF generation artifacts. They are gitignored and safe to delete.

## How to run tests

```bash
# CLI (preferred for quick feedback)
node tests/tests.js

# Browser (for visual pass/fail display)
open tests/test-runner.html
```

Tests are standalone pure functions that mirror production logic in `src/gpa.js` and `src/grades.js`. The test file duplicates some logic locally (rather than importing from `src/`) because the import chain triggers `document.getElementById()` calls in `src/state.js` that fail in Node.js. If you touch `calculateGPA()`, `checkAchievements()`, `calculateGoal()`, or the retake/explorer/perfectGPA logic in `src/ui.js` or `src/gpa.js`, update the corresponding test functions in `tests/tests.js` to stay in sync.

## JavaScript architecture and patterns

- **ES modules, no build tool.** All modules use `export`/`import`. The entry point is `src/main.js`, loaded via `<script type="module" src="src/main.js">` in `index.html`. Module scripts are deferred by default (execute after DOM parse).
- **Bootstrap.** `src/main.js` imports `init` from `src/ui.js` and calls it on `DOMContentLoaded` (with a `readyState` guard). `init()` wires up theme, language, navigation, event listeners, keyboard shortcuts, drag-drop, then loads persisted data and runs the first GPA calculation.
- **Shared state.** The `state` object (`src/state.js:11`) and `elements` object (DOM refs) are exported as `const` and imported by any module that needs them. Mutations are direct (`state.x = y`) — no pub/sub, no immutability layer. This mirrors the original closure-scoped pattern.
- **View initialization pattern.** `src/ui.js` exports `registerViewInit(viewId, callback)`. Feature modules (`charts.js`, `features.js`) register their init functions at module top level. `switchView()` in `src/ui.js` calls `initViewIfNeeded(viewId)` on first visit to a view, guarded by `viewInitFlags` to prevent double-binding.
- **View refresh on language change.** `src/i18n.js` exports `registerViewRefresh(viewId, callback)`. Feature modules register refresh callbacks. `translatePage()` calls `refreshView(state.currentView)` after updating all `data-i18n` elements, so each view re-renders its dynamic content in the new language.
- **i18n system.** Uses `data-i18n` attribute on HTML elements and a `t('key', params)` function exported from `src/i18n.js:673`. Translations are in `src/i18n.js:12` (Turkish and English in one object). Never hardcode user-facing text.
- **Grade system.** Retakeable grades are `['FF', 'DD', 'DC']`, non-GPA grades are `['P']`. Defined at `src/grades.js:16-17`.
- **Retake logic.** Old grade's contribution is subtracted from cumulative GPA before adding the new grade. See `src/ui.js:329-331` (accumulation) and `src/ui.js:353-356` (adjustment) inside `calculateGPA()`.
- **Pure vs DOM functions.** `src/gpa.js` contains pure math (no DOM access). `src/ui.js` contains the `calculateGPA()` orchestrator that reads DOM, calls pure functions, writes DOM, and mutates state. Tests mirror the pure functions.

## CDN dependencies (loaded via `<script>` tags in index.html)

- Chart.js 4.4.1 (UMD) — accessed as global `Chart` from `src/charts.js`
- html2canvas 1.4.1 — accessed as global `html2canvas` from `src/features.js`
- Google Fonts: DM Sans (via CSS `@import`)

These regular `<script>` tags execute before the `type="module"` entry point, so the globals are available when modules run. The service worker caches these CDN resources on first request. No npm/pip dependencies exist (the `node_modules/` directory, if present, is gitignored and not used by the app).

## Common gotchas for agents

1. **`t()` is exported from `src/i18n.js`.** Any module that needs translations must `import { t } from './i18n.js'`. It works at module scope — no DOMContentLoaded wrapper needed.
2. **`escapeHtml()` is at `src/grades.js:93`.** Import it when inserting user-provided course names into the DOM. Used in `src/ui.js` (course entry creation) and `src/features.js` (transcript builder, semester history).
3. **Grade selects are rebuilt on language change** via `updateAllGradeSelects()` in `src/grades.js`. If you add a grade, make sure it renders correctly in both `course-grade` and `previous-grade` selects.
4. **The service worker caches aggressively.** In development, open DevTools → Application → Service Workers and check "Bypass for network" or use `python3 -m http.server` and hard-refresh. The `CACHE_NAME` in `service-worker.js` must be bumped when deploying changes to force cache refresh for returning visitors.
5. **P grades** (Pass) count toward total credits but not GPA. The retake adjustment for old grades happens _before_ the P check — if someone retakes an FF and gets P, the FF is still removed from cumulative.
6. **Keyboard shortcuts** are bound in `initKeyboardShortcuts()` at `src/ui.js:924`. They check for `e.ctrlKey` or `e.metaKey`. Adding a new shortcut must register here and in the shortcuts modal HTML.
7. **ES modules require HTTP.** You cannot open `index.html` directly via `file://` — browsers block module loading over the file protocol. Always use a local server (see Development workflow).
8. **Circular dependencies.** The architecture avoids circular imports via the registration pattern (`registerViewInit` in `src/ui.js`, `registerViewRefresh` in `src/i18n.js`). Do not introduce direct imports that create cycles. If a feature module needs to call a ui.js function, import it from `src/ui.js` (one-way). If ui.js needs to trigger a feature view, use `registerViewInit`/`initViewIfNeeded`.
9. **Adding a new view.** Create the view HTML in `index.html`, add a nav item, then in the relevant feature module call `registerViewInit('yourView', initFunction)` and optionally `registerViewRefresh('yourView', refreshFunction)` at module top level. No changes needed to `src/ui.js`'s `switchView()` — it uses the registration map.

## Development workflow

A local server is required (ES modules don't work over `file://`):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

For service worker testing, use the same server and hard-refresh or check "Bypass for network" in DevTools.

Push to `main` → GitHub Actions deploys to https://kpostaagasi.github.io/boun-gpa-calculator.

## What not to do

- Do not add build tools, bundlers, or npm dependencies unless explicitly asked.
- Do not suppress or work around the service worker cache in production.
- Do not add emoji to code or UI unless the user asks for it.
- Do not introduce circular imports between modules — use the registration pattern.
- Do not import from `src/state.js` in test files — the `elements` object calls `document.getElementById()` at module load time, which fails in Node.js. Keep test helper functions self-contained.
