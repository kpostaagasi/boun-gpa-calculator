# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> For an extended agent reference — file-by-file roles, common gotchas, and "what not to do" — see [AGENTS.md](AGENTS.md). Keep both files in sync when architecture changes.

## Project Overview

**BOUN Pusula** — a static, offline-first PWA that is a multi-module student SuperApp for Boğaziçi University. The GPA calculator (BOUN grade system AA/BA/BB/CB/CC/DC/DD/FF) is now **one module among several**: a Home hub ("Bugün"/"Today"), Weekly Schedule, Exam & Assignment Planner, Notes & Tasks, Campus services, and a Grade System Guide. Built with native ES modules — no framework, no build step, no bundler.

**Live site:** https://kpostaagasi.github.io/boun-gpa-calculator (repo/URL path unchanged for PWA/link continuity)

## Tech Stack

- **Frontend:** Vanilla HTML, CSS, JavaScript (native ES modules, no build tools or frameworks)
- **Hosting:** GitHub Pages (static site)
- **Storage:** LocalStorage for data persistence
- **PWA:** Progressive Web App with service worker for offline functionality

## Project Structure

```
boun-gpa-calculator/
├── index.html              # Main HTML file with UI structure
├── styles.css              # Styling with CSS variables for theming
├── service-worker.js       # PWA service worker for offline support
├── site.webmanifest        # PWA manifest
├── package.json            # {"type":"module"} — for Node.js test compatibility
├── src/
│   ├── main.js             # Entry point (imports ui.js + all side-effect modules)
│   ├── state.js            # Application state + DOM element references
│   ├── i18n.js             # Translations (TR+EN), t(), language switching
│   ├── grades.js           # BOUN grade system, helpers, escapeHtml, templates
│   ├── gpa.js              # Pure GPA math (no DOM access)
│   ├── ui.js               # DOM manipulation, calculateGPA(), storage, navigation, switchView
│   ├── charts.js           # Chart.js rendering
│   ├── features.js         # Goal, export/import, history, simulation, graduation, achievements
│   │  # ── BOUN Pusula SuperApp modules (each self-registers via the registration pattern) ──
│   ├── store.js            # Per-module localStorage helper: loadModule/saveModule('pusula:*'), APP_KEYS, pickLang
│   ├── pusula-utils.js     # PURE time/schedule math (no DOM) — directly imported by tests
│   ├── campus-seed.js      # Static, bundled campus reference data (export default; never fetched)
│   ├── home.js             # Home hub ("Bugün"): read-only widget aggregation over other modules
│   ├── schedule.js         # Weekly class timetable grid
│   ├── planner.js          # Exam/assignment/quiz/project deadlines with live countdowns + .ics export
│   ├── notes.js            # Quick notes (pin/search) + simple tasks
│   ├── campus.js           # Static campus links / ring & shuttle times / contacts (render-only)
│   └── gradeGuide.js       # Read-only grade table + FAQ derived from grades.js/gpa.js
├── assets/
│   ├── favicon/            # Favicon files
│   └── images/             # Logo and social preview images
├── tests/
│   ├── tests.js            # Regression tests (pure functions mirroring production logic)
│   └── test-runner.html    # Browser test runner page
└── README.md               # Project documentation (Turkish)
```

## Key Features

### Core Features
- GPA calculation with BOUN grade system (4.0 scale)
- Previous GPA/credit input for cumulative calculations
- **Course retake support** - for courses previously taken with FF/DD/DC grades
- Semester selection (8 semesters)
- Auto-save to LocalStorage
- Dark/Light theme toggle
- **Turkish/English language support**
- Help modal with usage instructions
- Mobile responsive design

### Advanced Features
- **Keyboard shortcuts** (Ctrl+N, Ctrl+S, Ctrl+E, etc.)
- **Drag-and-drop course reordering**
- **JSON backup/restore**
- **User feedback form**
- **Full offline PWA support**

### Additional Features
- **GPA Simulation:** "What if" scenarios - try different grade combinations
- **Quick Scenarios:** Instantly see what happens with all AA, BB, CC or random grades
- **Save Scenarios:** Store multiple grade scenarios for comparison
- **Graduation Calculator:** Track progress toward graduation requirements
- **Honor Status:** See if you qualify for Honor/High Honor status
- **Achievement Badges:** Gamification with 13 unlockable badges
  - First Course, Five Courses, Twenty Courses
  - First AA, Honor Student, High Honor, Perfect GPA
  - First Semester, Four Semesters, Eight Semesters
  - Night Owl, Early Bird, Explorer

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+N | Add new course |
| Ctrl+S | Save data |
| Ctrl+E | Go to Export |
| Ctrl+D | Go to Dashboard |
| Ctrl+K | Go to Calculator |
| Ctrl+T | Toggle theme |
| Ctrl+L | Toggle language |
| ? | Open help |
| Esc | Close modal |

## Development

ES modules require an HTTP server — you cannot open `index.html` directly via `file://`.

### Testing locally
```bash
# Start a local server
python3 -m http.server 8000
# then open http://localhost:8000

# Run regression tests via CLI (no deps, no test framework)
node tests/tests.js

# Or open tests/test-runner.html in the browser for a visual pass/fail view
```

`tests/tests.js` **re-implements** the pure logic from `src/gpa.js` / `src/grades.js` as standalone functions rather than importing it. This is deliberate: importing `src/` pulls in `src/state.js`, which calls `document.getElementById()` at module load and throws under Node. **When you change GPA math, retake adjustment, achievements, or goal logic, update the mirrored functions in `tests/tests.js` to match** — they will not catch regressions otherwise. Exception: `src/pusula-utils.js` is DOM-free, so the tests **import it directly** (real coverage, no mirror) — extend those tests when you change schedule-overlap / countdown / next-departure math.

### Deployment
Push to `main` branch - GitHub Pages auto-deploys from the repository root.

## Code Conventions

- **Language:** UI text is in Turkish and English (i18n support via `data-i18n` attributes + `t()` function)
- **CSS:** Uses CSS custom properties (variables) for theming, including dark/light mode
- **JavaScript:** Native ES modules (`export`/`import`), no build tool. Entry point: `src/main.js`
- **Architecture:** Registration pattern for view init (`registerViewInit`) and view refresh (`registerViewRefresh`) avoids circular imports between modules
- **Accessibility:** ARIA labels on interactive elements

## SuperApp Module Architecture

Each SuperApp module (`home`, `schedule`, `planner`, `notes`, `campus`, `gradeGuide`) is a self-contained ES module imported for side-effects in `src/main.js`. It plugs into the existing shell **without touching the nav engine**:

1. Its view container `<div class="view" id="<key>View">` lives in `index.html`; its nav item `<button class="nav-item" data-view="<key>">` sits in the sidebar's Daily/Academic sections.
2. It calls `registerViewInit('<key>', init)` (binds **delegated** listeners on the container **once**) and `registerViewRefresh('<key>', render)` (rebuilds `innerHTML` on every visit + on language change). `switchView()` in `src/ui.js` routes these via one shared branch: `initViewIfNeeded(id)` then `refreshView(id)`.
3. Persistence goes through **`src/store.js`**: `loadModule(ns)`/`saveModule(ns, obj)` read/write `localStorage['pusula:<ns>']` (isolated from the calculator's legacy `gpaSaveData` blob) and flash the shared auto-save indicator. Every module calls `registerAppKey(ns)` at load so `clearAllData()` and the versioned JSON backup/restore (`src/features.js`) cover all keys generically.
4. All user-entered text is inserted via `escapeHtml()` (from `grades.js`) — required, since modules build DOM with template strings.
5. Pure time/schedule math lives in **`src/pusula-utils.js`** (no DOM/state imports), so `tests/tests.js` imports it directly instead of mirroring it.

`home.js` is a **read-only projection** over the other modules' `pusula:*` data + `state.lastCalculated*` + `campus-seed.js`; its only write is the inline "due soon" checkbox toggling a planner item. A shell-level `setInterval(60000)` in `init()` re-renders Home only while it is the active view (timer, never a fetch). `campus-seed.js` is static bundled data — never fetched — and is exported as `export default {...}` (not raw JSON) to sidestep GitHub Pages MIME/import-assertion issues. When adding a module, follow this exact pattern; do **not** convert `switchView`'s dispatch into a data-driven registry.

## Course Retake Logic

When a student retakes a course (previously FF/DD/DC):
1. Semester GPA includes the new grade normally
2. Cumulative GPA calculation:
   - Subtracts old grade's contribution from previous credits/points
   - Adds new grade's contribution
   - Formula: `adjustedPreviousCredits = previousCredits - retakeCredits`
   - Formula: `adjustedPreviousPoints = previousPoints - (oldGrade * credits)`

## Important Files

- `src/grades.js:11` - BOUN grade system configuration (`gradePoints` map)
- `src/ui.js:308` - `calculateGPA()` — the main GPA orchestrator (reads DOM, calls pure math, writes DOM)
- `src/gpa.js` - Pure GPA math (no DOM, testable): `computeSemesterGPA`, `computeCumulativeGPA`, `calculateGoalRequirement`
- `src/i18n.js:12` - Translations (TR + EN)
- `src/ui.js:924` - Keyboard shortcuts implementation
- `src/features.js` - Export/import JSON (versioned envelope covering `pusula:*` modules), simulation, graduation, achievements
- `src/store.js` - Per-module storage (`pusula:*`), `APP_KEYS`, `pickLang` for `{tr,en}` seed labels
- `src/home.js` - Home hub aggregation; `src/pusula-utils.js` - pure scheduling/countdown math (tested)
- `service-worker.js` - PWA offline caching (`CACHE_NAME` = `boun-pusula-v3.0.0`; bump when deploying, and add any new `src/*.js` to `PRECACHE_ASSETS`)
