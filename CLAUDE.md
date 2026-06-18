# CLAUDE.md

## Project Overview

Boğaziçi University GPA Calculator - A static web application for calculating GPA using the BOUN grade system (AA/BA/BB/CB/CC/DC/DD/FF). Built with native ES modules — no framework, no build step, no bundler.

**Live site:** https://kpostaagasi.github.io/boun-gpa-calculator

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
│   ├── main.js             # Entry point (imports ui.js + side-effect modules)
│   ├── state.js            # Application state + DOM element references
│   ├── i18n.js             # Translations (TR+EN), t(), language switching
│   ├── grades.js           # BOUN grade system, helpers, escapeHtml, templates
│   ├── gpa.js              # Pure GPA math (no DOM access)
│   ├── ui.js               # DOM manipulation, calculateGPA(), storage, navigation
│   ├── charts.js           # Chart.js rendering
│   └── features.js         # Goal, export, history, simulation, graduation, achievements
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

# Run regression tests via CLI
node tests/tests.js
```

### Deployment
Push to `main` branch - GitHub Pages auto-deploys from the repository root.

## Code Conventions

- **Language:** UI text is in Turkish and English (i18n support via `data-i18n` attributes + `t()` function)
- **CSS:** Uses CSS custom properties (variables) for theming, including dark/light mode
- **JavaScript:** Native ES modules (`export`/`import`), no build tool. Entry point: `src/main.js`
- **Architecture:** Registration pattern for view init (`registerViewInit`) and view refresh (`registerViewRefresh`) avoids circular imports between modules
- **Accessibility:** ARIA labels on interactive elements

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
- `src/gpa.js` - Pure GPA math functions (no DOM access, testable)
- `src/i18n.js:12` - Translations (TR + EN)
- `src/ui.js:924` - Keyboard shortcuts implementation
- `src/features.js` - Export/import JSON, simulation, graduation, achievements
- `service-worker.js` - PWA offline caching (bump `CACHE_NAME` when deploying changes)
