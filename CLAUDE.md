# CLAUDE.md

## Project Overview

Boğaziçi University GPA Calculator - A static web application for calculating GPA using the Turkish university grade system (AA/BA/BB/CB/CC/DC/DD/FF). Now supports multiple Turkish universities!

**Live site:** https://kpostaagasi.github.io/boun-gpa-calculator

## Tech Stack

- **Frontend:** Vanilla HTML, CSS, JavaScript (no build tools or frameworks)
- **Hosting:** GitHub Pages (static site)
- **Storage:** LocalStorage for data persistence
- **PWA:** Progressive Web App with service worker for offline functionality

## Project Structure

```
boun-gpa-calculator/
├── index.html          # Main HTML file with UI structure
├── script.js           # All JavaScript logic (GPA calculation, storage, theme)
├── styles.css          # Styling with CSS variables for theming
├── service-worker.js   # PWA service worker for offline support
├── site.webmanifest    # PWA manifest
├── assets/
│   ├── favicon/        # Favicon files
│   └── images/         # Logo and social preview images
└── README.md           # Project documentation (Turkish)
```

## Key Features

### Core Features
- GPA calculation with Turkish grade system (4.0 scale)
- **Multi-university support:** BOUN, İTÜ, ODTÜ, Koç, Bilkent, Sabancı, YTÜ, GSÜ
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

### New Features (v1.1.0)
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
- **Academic Calendar:** Add reminders for exams, assignments, projects
- **Quick Add Reminders:** Fast buttons for common reminder types

## Supported Universities

| University | Grade System |
|------------|--------------|
| Boğaziçi (BOUN) | AA/BA/BB/CB/CC/DC/DD/FF |
| İTÜ | AA/BA/BB/CB/CC/DC/DD/FD/FF |
| ODTÜ | AA/BA/BB/CB/CC/DC/DD/FF (S/U) |
| Koç | A/A-/B+/B/B-/C+/C/C-/D+/D/F |
| Bilkent | A/A-/B+/B/B-/C+/C/C-/D+/D/F |
| Sabancı | A/A-/B+/B/B-/C+/C/C-/D+/D/F |
| YTÜ | AA/BA/BB/CB/CC/DC/DD/FF |
| GSÜ | AA/BA/BB/CB/CC/DC/DD/FF |

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

No build process required. Simply edit the files and open `index.html` in a browser.

### Testing locally
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

### Deployment
Push to `main` branch - GitHub Pages auto-deploys from the repository root.

## Code Conventions

- **Language:** UI text is in Turkish and English (i18n support)
- **CSS:** Uses CSS custom properties (variables) for theming
- **JavaScript:** ES6+ syntax, all in single file with DOMContentLoaded wrapper
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

- `script.js:505-620` - University grade system configurations
- `script.js:935-1000` - Course entry creation with drag support
- `script.js:2150-2250` - Keyboard shortcuts implementation
- `script.js:2260-2350` - Import/Export JSON functions
- `styles.css:1530-1750` - New features styles (shortcuts, drag, toast)
- `service-worker.js` - PWA offline caching
