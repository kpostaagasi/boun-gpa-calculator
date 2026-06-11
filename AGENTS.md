# AGENTS.md — BOUN GPA Calculator

## What this project is

A static GPA calculator PWA for Turkish universities hosted on GitHub Pages. All logic lives in a single JavaScript file inside a `DOMContentLoaded` closure — no framework, no build step, no package manager.

## Key files at a glance

| File | Role | Lines |
|---|---|---|
| `index.html` | UI shell with all modals, sidebar nav, i18n attributes | 1025 |
| `script.js` | All JS: GPA calc, i18n, storage, nav, drag/drop, simulation, charts | ~3447 |
| `styles.css` | CSS custom properties theming, responsive, print styles | ~2786 |
| `service-worker.js` | PWA offline caching (cache-first for assets, network-first for CDN) | 192 |
| `tests/tests.js` | Regression tests that mirror production logic (must stay in sync) | 513 |
| `tests/test-runner.html` | Browser test runner page | 23 |

All 6 source files are flat in the repo root. Assets live under `assets/favicon/` and `assets/images/`.

## Truths that differ from README/CLAUDE.md

- **Grade system is BOUN-only.** Despite CLAUDE.md listing 8 universities, the code at `script.js:783` hardcodes a single `gradePoints` map (AA→4.0, BA→3.5, …, P→null). Multi-university support was removed. Do not add "İTÜ" or "Koç" grade entries unless the user explicitly asks.
- **No linter, formatter, typecheck, or build tool exists.** Do not introduce one without an explicit request.
- **`output/` and `tmp/` directories** exist for PDF generation artifacts. They are gitignored and safe to delete.

## How to run tests

```bash
# CLI (preferred for quick feedback)
node tests/tests.js

# Browser (for visual pass/fail display)
open tests/test-runner.html
```

Tests are standalone pure functions that mirror `script.js` logic. If you touch `calculateGPA()`, `checkAchievements()`, or the retake/explorer/perfectGPA logic in script.js, update the corresponding test functions in `tests/tests.js` to stay in sync.

## JavaScript scope and patterns

- Everything is inside `document.addEventListener('DOMContentLoaded', () => { … })` — there are no global functions. All functions and state are closure-scoped.
- The i18n system uses `data-i18n` attribute on HTML elements and a `t('key', params)` function. Translations are in `script.js:10-656` (Turkish at lines 10-475, English at 482-656). Never hardcode user-facing text.
- State is held in a `state` object at the top of the closure. Key values: `state.previousGPA`, `state.previousCredits`, `state.semester`, `state.lastCalculatedGPA`, `state.lastCalculatedSemesterGPA`, etc.
- Grade system: retakeable grades are `['FF', 'DD', 'DC']`, non-GPA grades are `['P']`. This is defined at `script.js:787-788`.
- Retake logic: old grade's contribution is subtracted from cumulative GPA before adding the new grade. See `script.js:1338-1343` for the adjustment.

## CDN dependencies (loaded via `<script>` tags in index.html)

- Chart.js 4.4.1 (UMD)
- html2canvas 1.4.1
- Google Fonts: DM Sans (via CSS `@import`)

These are cached by the service worker on first request. No npm/pip dependencies exist.

## Common gotchas for agents

1. **`t()` calls fail outside the DOMContentLoaded closure.** Any new code referencing translations must be inside the `DOMContentLoaded` callback.
2. **`escapeHtml()` is at `script.js:864`.** Use it when inserting user-provided course names into the DOM.
3. **Grade selects are rebuilt on language change** via `updateAllGradeSelects()`. If you add a grade, make sure it renders correctly in both `course-grade` and `previous-grade` selects.
4. **The service worker caches aggressively.** In development, open DevTools → Application → Service Workers and check "Bypass for network" or use `npx serve` and hard-refresh.
5. **P grades** (Pass) count toward total credits but not GPA. The retake adjustment for old grades happens _before_ the P check — if someone retakes an FF and gets P, the FF is still removed from cumulative.
6. **Keyboard shortcuts** are bound globally at `script.js:2469`. They check for `e.ctrlKey` or `e.metaKey`. Adding a new shortcut must register here and in the shortcuts modal HTML.

## Development workflow

No server needed — just open `index.html` directly in a browser. For service worker testing, serve via:

```bash
python -m http.server 8000
# or
npx serve
```

Push to `main` → GitHub Actions deploys to https://kpostaagasi.github.io/boun-gpa-calculator.

## What not to do

- Do not add build tools, frameworks, or npm dependencies unless explicitly asked.
- Do not convert to a multi-file architecture — the project is intentionally monolithic.
- Do not suppress or work around the service worker cache in production.
- Do not add emoji to code or UI unless the user asks for it.
