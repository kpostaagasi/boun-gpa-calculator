# CLAUDE.md

## Project Overview

Boğaziçi University GPA Calculator - A static web application for calculating GPA using the Turkish university grade system (AA/BA/BB/CB/CC/DC/DD/FF).

**Live site:** https://kpostaagasi.github.io/boun-gpa-calculator

## Tech Stack

- **Frontend:** Vanilla HTML, CSS, JavaScript (no build tools or frameworks)
- **Hosting:** GitHub Pages (static site)
- **Storage:** LocalStorage for data persistence
- **PWA:** Progressive Web App with service worker manifest

## Project Structure

```
boun-gpa-calculator/
├── index.html          # Main HTML file with UI structure
├── script.js           # All JavaScript logic (GPA calculation, storage, theme)
├── styles.css          # Styling with CSS variables for theming
├── site.webmanifest    # PWA manifest
├── assets/
│   ├── favicon/        # Favicon files
│   └── images/         # Logo and social preview images
└── README.md           # Project documentation (Turkish)
```

## Key Features

- GPA calculation with Turkish grade system (4.0 scale)
- Previous GPA/credit input for cumulative calculations
- Semester selection (8 semesters)
- Auto-save to LocalStorage
- Dark/Light theme toggle
- Help modal with usage instructions
- Mobile responsive design

## Grade Point Scale

| Grade | Points |
|-------|--------|
| AA    | 4.0    |
| BA    | 3.5    |
| BB    | 3.0    |
| CB    | 2.5    |
| CC    | 2.0    |
| DC    | 1.5    |
| DD    | 1.0    |
| FF    | 0.0    |

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

- **Language:** UI text is in Turkish
- **CSS:** Uses CSS custom properties (variables) for theming
- **JavaScript:** ES6+ syntax, all in single file with DOMContentLoaded wrapper
- **Accessibility:** ARIA labels on interactive elements

## Important Files

- `script.js:11-20` - Grade point definitions
- `script.js:131-166` - GPA calculation logic
- `script.js:214-237` - Theme toggle implementation
- `styles.css:19-48` - Theme CSS variables (dark/light)
