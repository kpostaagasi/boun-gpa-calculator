/**
 * BOUN GPA Calculator — UI Orchestration Module
 *
 * Contains all DOM manipulation, event handling, storage, and navigation code.
 * This is the largest module — it orchestrates the entire application but does NOT
 * import from charts.js or features.js (those modules register callbacks via the
 * registration pattern in i18n.js and viewInitializers in this module).
 */
import { state, elements, viewInitFlags } from './state.js';
import { t, translatePage, setLanguage, toggleLanguage, updateLangToggle, initLanguage, registerViewRefresh, refreshView } from './i18n.js';
import { gradePoints, retakeableGrades, nonGPAGrades, allGrades, getGradeSystem, updateAllGradeSelects, escapeHtml, getCourseTemplates, getClosestGradeToPoint, getSortedNumericGrades, formatGradePoint, getGradeAtLeastPoint, getGradeLabels } from './grades.js';
import { computeSemesterGPA, computeCumulativeGPA, calculateGoalRequirement, getTotalCourseCount, hasGrade } from './gpa.js';

// ============================================
// View Initialization Registration Pattern
// ============================================
const viewInitializers = {};

export function registerViewInit(viewId, callback) {
    viewInitializers[viewId] = callback;
}

/**
 * Calls the registered initializer for a view exactly once.
 * Uses !viewInitFlags[viewId] as the guard so that views without a
 * predefined flag (e.g. 'charts') are treated as uninitialized on first call.
 */
function initViewIfNeeded(viewId) {
    if (!viewInitFlags[viewId] && viewInitializers[viewId]) {
        viewInitializers[viewId]();
        viewInitFlags[viewId] = true;
    }
}

// ============================================
// Dynamic View Titles
// ============================================
export const viewTitles = {
    get home() { return t('nav.home'); },
    get schedule() { return t('nav.schedule'); },
    get planner() { return t('nav.planner'); },
    get notes() { return t('nav.notes'); },
    get campus() { return t('nav.campus'); },
    get gradeGuide() { return t('nav.gradeGuide'); },
    get dashboard() { return t('nav.home'); },
    get calculator() { return t('nav.calculator'); },
    get goal() { return t('nav.goal'); },
    get history() { return t('nav.history'); },
    get charts() { return t('nav.statistics'); },
    get export() { return t('nav.export'); },
    get simulation() { return t('nav.simulation'); },
    get graduation() { return t('nav.graduation'); },
    get achievements() { return t('nav.achievements'); }
};

// ============================================
// Navigation
// ============================================
export function switchView(viewId) {
    // Update nav items
    elements.navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.view === viewId);
    });

    // Update views
    elements.views.forEach(view => {
        view.classList.toggle('active', view.id === `${viewId}View`);
    });

    // Update title
    elements.pageTitle.textContent = viewTitles[viewId] || 'Dashboard';

    // Close mobile menu
    closeMobileMenu();

    // Update state
    state.currentView = viewId;

    // Track views for achievements
    trackViewedView(viewId);
    checkAchievements();

    // Initialize view-specific content via registration pattern
    if (viewId === 'charts') {
        initViewIfNeeded('charts');
    } else if (viewId === 'history') {
        refreshView('history');
    } else if (viewId === 'goal') {
        initViewIfNeeded('goal');
    } else if (viewId === 'simulation') {
        initViewIfNeeded('simulation');
    } else if (viewId === 'graduation') {
        initViewIfNeeded('graduation');
    } else if (viewId === 'achievements') {
        initViewIfNeeded('achievements');
    } else if (['home', 'schedule', 'planner', 'notes', 'campus', 'gradeGuide'].includes(viewId)) {
        // BOUN Pusula modules: bind delegated listeners once, then (re)render each visit
        initViewIfNeeded(viewId);
        refreshView(viewId);
    }
}

export function initNavigation() {
    elements.navItems.forEach(item => {
        item.addEventListener('click', () => {
            const viewId = item.dataset.view;
            if (viewId) {
                switchView(viewId);
            }
        });
    });

    // Mobile menu
    elements.mobileMenuToggle?.addEventListener('click', toggleMobileMenu);
    elements.sidebarOverlay?.addEventListener('click', closeMobileMenu);

    // Dashboard quick actions
    document.querySelectorAll('[data-action]').forEach(el => {
        el.addEventListener('click', () => {
            const action = el.dataset.action;
            if (action === 'go-calculator') {
                switchView('calculator');
            } else if (action === 'open-templates') {
                switchView('calculator');
                setTimeout(() => openTemplatesModal(), 300);
            } else if (action === 'go-goal') {
                switchView('goal');
            }
        });
    });
}

export function toggleMobileMenu() {
    elements.sidebar?.classList.toggle('open');
    elements.sidebarOverlay?.classList.toggle('active');
}

export function closeMobileMenu() {
    elements.sidebar?.classList.remove('open');
    elements.sidebarOverlay?.classList.remove('active');
}

// ============================================
// Theme Management
// ============================================
export function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

export function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);

    // Reinitialize charts with new theme colors
    if (state.currentView === 'charts') {
        initViewIfNeeded('charts');
    }
}

export function updateThemeIcon(theme) {
    const sunIcon = elements.themeToggle?.querySelector('.sun-icon');
    const moonIcon = elements.themeToggle?.querySelector('.moon-icon');

    if (sunIcon && moonIcon) {
        sunIcon.style.display = theme === 'light' ? 'block' : 'none';
        moonIcon.style.display = theme === 'dark' ? 'block' : 'none';
    }
}

// ============================================
// Course Management
// ============================================
export function createCourseEntry(courseData = {}) {
    const courseEntry = document.createElement('div');
    courseEntry.className = 'course-entry';
    courseEntry.draggable = true;

    // Escape course name for safe HTML attribute insertion
    const escapedName = escapeHtml(courseData.name || '').replace(/"/g, '&quot;');

    courseEntry.innerHTML = `
        <div class="drag-handle" title="Sürükle">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="9" cy="6" r="1.5"></circle>
                <circle cx="15" cy="6" r="1.5"></circle>
                <circle cx="9" cy="12" r="1.5"></circle>
                <circle cx="15" cy="12" r="1.5"></circle>
                <circle cx="9" cy="18" r="1.5"></circle>
                <circle cx="15" cy="18" r="1.5"></circle>
            </svg>
        </div>
        <div class="course-name-group">
            <input type="text" placeholder="${t('calc.courseName')}" class="form-input course-name" value="${escapedName}" aria-label="${t('calc.courseName')}">
            <div class="course-retake-row">
                <label class="retake-checkbox">
                    <input type="checkbox" class="is-retake" ${courseData.isRetake ? 'checked' : ''}>
                    <span>${t('calc.isRetake')}</span>
                </label>
                <select class="form-select retake-select previous-grade" style="display: ${courseData.isRetake ? 'block' : 'none'}; max-width: 140px;" aria-label="${t('calc.previousGrade')}">
                    <option value="" disabled ${!courseData.previousGrade ? 'selected' : ''}>${t('calc.previousGrade')}</option>
                    ${retakeableGrades.map(grade =>
                        `<option value="${grade}" ${courseData.previousGrade === grade ? 'selected' : ''}>${grade} (${gradePoints[grade]})</option>`
                    ).join('')}
                </select>
            </div>
        </div>
        <select class="form-select course-credit" aria-label="${t('calc.credit')}">
            ${[1, 2, 3, 4, 5, 6, 7, 8].map(credit =>
                `<option value="${credit}" ${(courseData.credit || 3) == credit ? 'selected' : ''}>${credit}</option>`
            ).join('')}
        </select>
        <select class="form-select course-grade" aria-label="${t('calc.grade')}">
            <option value="" disabled ${!courseData.grade ? 'selected' : ''}>${t('calc.grade')}</option>
            ${Object.entries(gradePoints).map(([grade, point]) =>
                `<option value="${grade}" ${courseData.grade === grade ? 'selected' : ''}>${grade}</option>`
            ).join('')}
        </select>
        <button class="delete-course-btn" aria-label="${t('misc.delete')}">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;

    addCourseEventListeners(courseEntry);
    return courseEntry;
}

export function addCourseEventListeners(entry) {
    // All inputs trigger recalculation
    entry.querySelectorAll('select, input').forEach(el => {
        el.addEventListener('change', () => {
            calculateGPA();
            saveCourses();
        });
    });

    // Retake checkbox toggle
    const retakeCheckbox = entry.querySelector('.is-retake');
    const previousGradeSelect = entry.querySelector('.previous-grade');

    retakeCheckbox?.addEventListener('change', () => {
        previousGradeSelect.style.display = retakeCheckbox.checked ? 'block' : 'none';
        if (!retakeCheckbox.checked) {
            previousGradeSelect.value = '';
        }
        calculateGPA();
        saveCourses();
    });

    // Duplicate course name detection on blur
    const nameInput = entry.querySelector('.course-name');
    nameInput?.addEventListener('blur', () => {
        const enteredName = nameInput.value.trim().toLowerCase();
        if (!enteredName) {
            nameInput.classList.remove('duplicate-warning');
            return;
        }
        const allNames = Array.from(
            document.querySelectorAll('.course-entry .course-name')
        ).filter(el => el !== nameInput).map(el => el.value.trim().toLowerCase());

        if (allNames.includes(enteredName)) {
            nameInput.classList.add('duplicate-warning');
            showToast(t('duplicateCourseWarning'), 3000);
        } else {
            nameInput.classList.remove('duplicate-warning');
        }
    });
    nameInput?.addEventListener('input', () => {
        nameInput.classList.remove('duplicate-warning');
    });

    // Delete button
    entry.querySelector('.delete-course-btn')?.addEventListener('click', () => {
        entry.classList.add('removing');
        setTimeout(() => {
            entry.remove();
            // Clear duplicate warnings that may now be resolved
            document.querySelectorAll('.course-name.duplicate-warning').forEach(el => {
                el.classList.remove('duplicate-warning');
            });
            calculateGPA();
            saveCourses();
            updateCoursesEmptyState();
        }, 150);
    });
}

export function addCourse(courseData = {}) {
    const entry = createCourseEntry(courseData);
    elements.courseList.appendChild(entry);
    updateCoursesEmptyState();
    calculateGPA();

    // Focus on name input if empty
    if (!courseData.name) {
        entry.querySelector('.course-name')?.focus();
    }
}

export function updateCoursesEmptyState() {
    const hasCourses = elements.courseList.children.length > 0;
    elements.emptyCoursesState.style.display = hasCourses ? 'none' : 'flex';
    elements.resultsGrid.style.display = hasCourses ? 'grid' : 'none';
}

// ============================================
// GPA Calculation
// ============================================
export function calculateGPA() {
    let semesterPoints = 0;
    let semesterCredits = 0;
    let retakeCredits = 0;
    let retakeOldPoints = 0;

    // Calculate current semester
    let semesterCreditsForGPA = 0;  // Credits used for GPA calculation (excludes P)
    let totalSemesterCredits = 0;   // All credits including P

    document.querySelectorAll('.course-entry').forEach(entry => {
        const credit = parseFloat(entry.querySelector('.course-credit').value);
        const grade = entry.querySelector('.course-grade').value;
        const isRetake = entry.querySelector('.is-retake').checked;
        const previousGrade = entry.querySelector('.previous-grade').value;

        if (credit && grade) {
            totalSemesterCredits += credit;

            // Handle retake adjustment FIRST (even for P grades, old grade must be removed from cumulative)
            // This ensures that if someone retakes FF and gets P, the FF is still removed
            if (isRetake && previousGrade && !nonGPAGrades.includes(previousGrade)) {
                retakeCredits += credit;
                retakeOldPoints += credit * gradePoints[previousGrade];
            }

            // P grade doesn't affect GPA but counts as credit
            if (!nonGPAGrades.includes(grade)) {
                semesterPoints += credit * gradePoints[grade];
                semesterCreditsForGPA += credit;
            }
        }
    });

    semesterCredits = semesterCreditsForGPA;

    // Get previous values
    const previousGPA = parseFloat(elements.previousGPAInput.value) || 0;
    const previousCredits = parseFloat(elements.previousCreditsInput.value) || 0;
    const previousPoints = previousGPA * previousCredits;

    // Calculate semester GPA
    const semesterGPA = semesterCredits > 0 ? (semesterPoints / semesterCredits) : 0;

    // Calculate cumulative GPA (with retake adjustment)
    const adjustedPreviousCredits = Math.max(0, previousCredits - retakeCredits);
    const adjustedPreviousPoints = Math.max(0, previousPoints - retakeOldPoints);
    const creditsForGPA = semesterCredits + adjustedPreviousCredits;
    const totalPoints = semesterPoints + adjustedPreviousPoints;
    const cumulativeGPA = creditsForGPA > 0 ? (totalPoints / creditsForGPA) : 0;

    // Total credits includes P grades
    const totalCredits = totalSemesterCredits + adjustedPreviousCredits;

    // Update displays with animation
    animateValue(elements.semesterGPA, semesterGPA.toFixed(2));
    animateValue(elements.gpa, cumulativeGPA.toFixed(2));
    animateValue(elements.totalCredits, totalCredits);

    // Update dashboard
    animateValue(elements.dashboardSemesterGPA, semesterGPA.toFixed(2));
    animateValue(elements.dashboardGPA, cumulativeGPA.toFixed(2));
    animateValue(elements.dashboardCredits, totalCredits);

    // Update export preview
    if (elements.exportSemesterGPA) elements.exportSemesterGPA.textContent = semesterGPA.toFixed(2);
    if (elements.exportGPA) elements.exportGPA.textContent = cumulativeGPA.toFixed(2);
    if (elements.exportCredits) elements.exportCredits.textContent = totalCredits;

    // Update semester display
    const semesterValue = elements.semesterSelect?.value || '';
    if (elements.dashboardSemester) elements.dashboardSemester.textContent = semesterValue ? t('semester.format', { n: semesterValue }) : '-';

    // Color coding for GPA
    applyGPAColorCoding(elements.gpa, cumulativeGPA);
    applyGPAColorCoding(elements.semesterGPA, semesterGPA);

    // Store state
    state.previousGPA = previousGPA;
    state.previousCredits = previousCredits;
    state.semester = semesterValue;

    state.lastCalculatedGPA = cumulativeGPA;
    state.lastCalculatedSemesterGPA = semesterGPA;
    state.lastCalculatedCreditsForGPA = creditsForGPA;
    state.lastCalculatedTotalCredits = totalCredits;

    checkAchievements();

    // Return both total credits (includes P) and GPA-affecting credits (excludes P)
    return { semesterGPA, cumulativeGPA, totalCredits, creditsForGPA };
}

export function getCurrentGPAValue() {
    if (typeof state.lastCalculatedGPA === 'number' && !Number.isNaN(state.lastCalculatedGPA)) {
        return state.lastCalculatedGPA;
    }
    return parseFloat(elements.gpa?.textContent) || 0;
}

export function applyGPAColorCoding(element, gpa) {
    if (!element) return;
    element.classList.remove('success', 'warning', 'danger');
    if (gpa >= 3.0) {
        element.classList.add('success');
    } else if (gpa >= 2.0) {
        element.classList.add('warning');
    } else if (gpa > 0) {
        element.classList.add('danger');
    }
}

export function animateValue(element, newValue) {
    if (!element) return;

    const currentValue = element.textContent;
    if (currentValue !== String(newValue)) {
        element.classList.add('animate-count-up');
        element.textContent = newValue;
        setTimeout(() => element.classList.remove('animate-count-up'), 150);
    }
}

// ============================================
// Templates
// ============================================
export function renderTemplates(filter = '') {
    const filterLower = filter.toLowerCase();
    let html = '';
    const courseTemplates = getCourseTemplates();

    for (const [category, courses] of Object.entries(courseTemplates)) {
        const filteredCourses = courses.filter(c =>
            c.code.toLowerCase().includes(filterLower) ||
            c.name.toLowerCase().includes(filterLower) ||
            category.toLowerCase().includes(filterLower)
        );

        if (filteredCourses.length > 0) {
            html += `
                <div class="template-category">
                    <div class="template-category-title">${category}</div>
                    ${filteredCourses.map(course => `
                        <div class="template-item" data-code="${course.code}" data-name="${course.name}" data-credit="${course.credit}">
                            <div class="template-item-info">
                                <div class="template-item-name">${course.code}</div>
                                <div class="template-item-meta">${course.name} • ${course.credit} ${t('templates.credit')}</div>
                            </div>
                            <button class="template-item-add">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            </button>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    elements.templateList.innerHTML = html || `<p style="text-align: center; color: var(--text-secondary);">${t('templates.notFound')}</p>`;

    // Add click handlers
    elements.templateList.querySelectorAll('.template-item').forEach(item => {
        item.addEventListener('click', () => {
            const code = item.dataset.code;
            const name = item.dataset.name;
            const credit = item.dataset.credit;

            addCourse({
                name: `${code} - ${name}`,
                credit: credit
            });

            closeTemplatesModal();
        });
    });
}

export function openTemplatesModal() {
    elements.templatesModal.classList.add('active');
    renderTemplates();
    elements.templateSearch.value = '';
    elements.templateSearch.focus();
}

export function closeTemplatesModal() {
    elements.templatesModal.classList.remove('active');
}

// ============================================
// Semester / Data Persistence
// ============================================
export function saveCurrentCoursesToSemester(semesterId) {
    if (!semesterId) return;
    const courses = [];
    let totalPoints = 0;
    let creditsForGPA = 0;

    document.querySelectorAll('.course-entry').forEach(entry => {
        const name = entry.querySelector('.course-name').value.trim();
        const credit = parseFloat(entry.querySelector('.course-credit').value);
        const grade = entry.querySelector('.course-grade').value;
        const isRetake = entry.querySelector('.is-retake').checked;
        const previousGrade = entry.querySelector('.previous-grade').value;

        if (credit && grade) {
            courses.push({ name, credit, grade, isRetake, previousGrade });
            if (!nonGPAGrades.includes(grade)) {
                totalPoints += credit * gradePoints[grade];
                creditsForGPA += credit;
            }
        }
    });

    const notes = elements.semesterNotesInput?.value.trim() || '';
    if (courses.length > 0 || notes) {
        state.semesters[semesterId] = {
            ...(state.semesters[semesterId] || {}),
            courses,
            gpa: creditsForGPA > 0 ? totalPoints / creditsForGPA : 0,
            credits: creditsForGPA,
            notes
        };
    }
}

export function loadCoursesFromSemester(courses) {
    courses.forEach(course => {
        addCourse(course);
    });
}

export function saveSemester() {
    const semesterValue = elements.semesterSelect.value;
    if (!semesterValue) return;

    // Use semester number as key (language-agnostic)
    const semesterId = semesterValue;
    const courses = [];
    let totalPoints = 0;
    let creditsForGPA = 0;

    document.querySelectorAll('.course-entry').forEach(entry => {
        const name = entry.querySelector('.course-name').value.trim();
        const credit = parseFloat(entry.querySelector('.course-credit').value);
        const grade = entry.querySelector('.course-grade').value;

        if (credit && grade) {
            courses.push({ name, credit, grade });
            // P grade doesn't affect GPA
            if (!nonGPAGrades.includes(grade)) {
                totalPoints += credit * gradePoints[grade];
                creditsForGPA += credit;
            }
        }
    });

    if (courses.length > 0) {
        // Save base semester info before first save
        saveBaseSemesterInfo();

        state.semesters[semesterId] = {
            courses,
            gpa: creditsForGPA > 0 ? totalPoints / creditsForGPA : 0,
            credits: creditsForGPA  // Credits used for GPA calculation (excludes P)
        };
        saveToLocalStorage();
    }
}

// Calculate cumulative GPA/credits from base + all saved semesters before current one
export function calculatePreviousSemestersStats(currentSemesterNum) {
    // Start with base values (semesters before user started using the app)
    let totalPoints = state.baseGPA * state.baseCredits;
    let totalCredits = state.baseCredits;

    // Add all saved semesters before current one
    Object.entries(state.semesters).forEach(([semesterId, semesterData]) => {
        // Extract semester number from id like "3. Dönem" -> 3
        const semNum = parseInt(semesterId, 10);
        if (!isNaN(semNum) && semNum < currentSemesterNum) {
            totalPoints += (semesterData.gpa || 0) * (semesterData.credits || 0);
            totalCredits += semesterData.credits || 0;
        }
    });

    const cumulativeGPA = totalCredits > 0 ? totalPoints / totalCredits : 0;
    return { gpa: cumulativeGPA, credits: totalCredits };
}

// Update previous GPA/credits inputs from semester history (only if we have saved data)
export function updatePreviousFromHistory(currentSemesterNum) {
    // Check if we have any saved semesters before current one
    const hasPreviousSemesters = Object.keys(state.semesters).some(semesterId => {
        const semNum = parseInt(semesterId, 10);
        return !isNaN(semNum) && semNum < currentSemesterNum;
    });

    // Only update if we have base data OR saved semester history
    // Otherwise keep user's manual input untouched
    if (state.baseSemester !== null || hasPreviousSemesters) {
        const stats = calculatePreviousSemestersStats(currentSemesterNum);
        // Only update fields when we have real credit data — never clear user's manual input
        if (stats.credits > 0) {
            elements.previousGPAInput.value = stats.gpa.toFixed(2);
            elements.previousCreditsInput.value = stats.credits;
        }
        // If stats.credits === 0, leave the fields untouched
    }
    // If no history and no base, don't touch the fields - user may have entered values manually
}

// Save base semester info when user first enters data
export function saveBaseSemesterInfo() {
    const currentSemesterNum = parseInt(elements.semesterSelect.value, 10) || 0;

    // Only set base if not already set and we have a semester selected
    if (state.baseSemester === null && currentSemesterNum > 0) {
        state.baseSemester = currentSemesterNum;
        state.baseGPA = parseFloat(elements.previousGPAInput.value) || 0;
        state.baseCredits = parseFloat(elements.previousCreditsInput.value) || 0;
    }
}

// ============================================
// Data Persistence
// ============================================
export function saveCourses() {
    const courses = [];
    document.querySelectorAll('.course-entry').forEach(entry => {
        const name = entry.querySelector('.course-name').value.trim();
        const credit = entry.querySelector('.course-credit').value;
        const grade = entry.querySelector('.course-grade').value;
        const isRetake = entry.querySelector('.is-retake').checked;
        const previousGrade = entry.querySelector('.previous-grade').value;

        if (credit && grade) {
            courses.push({ name, credit, grade, isRetake, previousGrade });
        }
    });

    state.courses = courses;
    saveSemester();
    saveToLocalStorage();
}

export function saveToLocalStorage() {
    const saveData = {
        courses: state.courses,
        semester: state.semester,
        previousGPA: elements.previousGPAInput.value,
        previousCredits: elements.previousCreditsInput.value,
        semesters: state.semesters,
        // Base semester info for cumulative calculation
        baseSemester: state.baseSemester,
        baseGPA: state.baseGPA,
        baseCredits: state.baseCredits,
        achievements: state.achievements,
        scenarios: state.scenarios
    };

    try {
        localStorage.setItem('gpaSaveData', JSON.stringify(saveData));
        showAutoSaveIndicator();
    } catch (e) {
        showToast(t('alert.storageFull'));
    }
}

let _autoSaveTimer = null;

export function showAutoSaveIndicator() {
    const el = elements.autoSaveIndicator;
    if (!el) return;
    el.textContent = t('autoSaved');
    el.classList.add('visible');
    clearTimeout(_autoSaveTimer);
    _autoSaveTimer = setTimeout(() => el.classList.remove('visible'), 2000);
}

export function loadFromLocalStorage() {
    let savedData;
    try {
        savedData = localStorage.getItem('gpaSaveData');
    } catch (e) {
        return;
    }
    if (!savedData) return;

    try {
        const data = JSON.parse(savedData);

        // Load base semester info first
        if (data.baseSemester !== undefined) state.baseSemester = data.baseSemester;
        if (data.baseGPA !== undefined) state.baseGPA = data.baseGPA;
        if (data.baseCredits !== undefined) state.baseCredits = data.baseCredits;

        // Load features data
        if (data.achievements && typeof data.achievements === 'object') state.achievements = data.achievements;
        if (Array.isArray(data.scenarios)) state.scenarios = data.scenarios;

        // Load semester and history
        if (data.semester) elements.semesterSelect.value = data.semester;
        if (data.semesters) state.semesters = data.semesters;

        // Load previous GPA/credits
        const currentSemesterNum = parseInt(data.semester, 10) || 0;

        // If we have base info or saved semesters, calculate cumulative
        if (state.baseSemester !== null || Object.keys(state.semesters).length > 0) {
            updatePreviousFromHistory(currentSemesterNum);
        } else {
            // Fallback to saved values (for backward compatibility)
            if (data.previousGPA !== undefined) elements.previousGPAInput.value = data.previousGPA;
            if (data.previousCredits !== undefined) elements.previousCreditsInput.value = data.previousCredits;
        }

        // Load courses
        elements.courseList.innerHTML = '';
        if (data.courses && data.courses.length > 0) {
            data.courses.forEach(course => addCourse(course));
        }

        // Restore semester notes for current semester
        if (elements.semesterNotesInput && data.semester && state.semesters[data.semester]) {
            elements.semesterNotesInput.value = state.semesters[data.semester].notes || '';
        }

        updateCoursesEmptyState();
        calculateGPA();
    } catch (error) {
        console.error('Error loading saved data:', error);
    }
}

export function clearAllData() {
    if (confirm(t('alert.clearConfirm'))) {
        localStorage.removeItem('gpaSaveData');
        // Remove all BOUN Pusula module data (pusula:*) as well
        Object.keys(localStorage)
            .filter(k => k.startsWith('pusula:'))
            .forEach(k => localStorage.removeItem(k));
        location.reload();
    }
}

// ============================================
// Help Modal
// ============================================
export function initHelpModal() {
    const closeBtn = elements.helpModal?.querySelector('.close');

    elements.helpBtn?.addEventListener('click', () => {
        elements.helpModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeBtn?.addEventListener('click', closeHelpModal);

    elements.helpModal?.addEventListener('click', (e) => {
        if (e.target === elements.helpModal) {
            closeHelpModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.helpModal?.classList.contains('active')) {
            closeHelpModal();
        }
    });
}

export function closeHelpModal() {
    elements.helpModal?.classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================
// Event Listeners Setup
// ============================================
export function initEventListeners() {
    // Add course button
    elements.addCourseBtn?.addEventListener('click', () => addCourse());

    // Previous GPA/Credits inputs
    elements.previousGPAInput?.addEventListener('input', () => {
        let value = parseFloat(elements.previousGPAInput.value);
        if (value < 0) elements.previousGPAInput.value = 0;
        else if (value > 4) elements.previousGPAInput.value = 4;
        calculateGPA();
        saveCourses();
    });

    elements.previousCreditsInput?.addEventListener('input', () => {
        let value = parseInt(elements.previousCreditsInput.value, 10);
        if (value < 0) elements.previousCreditsInput.value = 0;
        else if (value > 300) elements.previousCreditsInput.value = 300;
        calculateGPA();
        saveCourses();
    });

    elements.semesterSelect?.addEventListener('change', () => {
        const oldId = state.semester;           // still OLD value (calculateGPA hasn't run yet)
        const newId = elements.semesterSelect.value;

        // 1. Save current DOM courses to the OLD semester before switching
        if (oldId) {
            saveCurrentCoursesToSemester(oldId);
        }

        // 2. Load saved courses for the NEW semester, or start fresh
        elements.courseList.innerHTML = '';
        const saved = state.semesters[newId];
        if (saved && saved.courses && saved.courses.length > 0) {
            loadCoursesFromSemester(saved.courses);
        } else {
            addCourse();
        }
        updateCoursesEmptyState();

        // 2b. Restore semester notes
        if (elements.semesterNotesInput) {
            elements.semesterNotesInput.value = saved?.notes || '';
        }

        // 3. Update previous GPA/credits from semester history
        const newSemNum = parseInt(newId, 10) || 0;
        updatePreviousFromHistory(newSemNum);

        calculateGPA();
        saveToLocalStorage();
    });

    // Templates
    elements.openTemplatesBtn?.addEventListener('click', openTemplatesModal);
    elements.closeTemplatesModal?.addEventListener('click', closeTemplatesModal);
    elements.templatesModal?.addEventListener('click', (e) => {
        if (e.target === elements.templatesModal) closeTemplatesModal();
    });
    elements.templateSearch?.addEventListener('input', (e) => renderTemplates(e.target.value));

    // Semester notes auto-save
    elements.semesterNotesInput?.addEventListener('input', () => {
        const currentId = state.semester;
        if (currentId && state.semesters[currentId]) {
            state.semesters[currentId].notes = elements.semesterNotesInput.value.trim();
            saveToLocalStorage();
        }
    });

    // Theme
    elements.themeToggle?.addEventListener('click', toggleTheme);

    // Language toggle
    document.getElementById('langToggle')?.addEventListener('click', toggleLanguage);

    // Clear data
    elements.clearDataBtn?.addEventListener('click', clearAllData);

    // Add semester
    elements.addSemesterBtn?.addEventListener('click', () => {
        switchView('calculator');
    });

    // Feedback modal
    const feedbackBtn = document.getElementById('feedbackBtn');
    const feedbackModal = document.getElementById('feedbackModal');
    const feedbackModalClose = document.getElementById('feedbackModalClose');
    const feedbackForm = document.getElementById('feedbackForm');

    feedbackBtn?.addEventListener('click', () => {
        feedbackModal?.classList.add('active');
        closeMobileMenu();
    });

    feedbackModalClose?.addEventListener('click', () => {
        feedbackModal?.classList.remove('active');
    });

    feedbackModal?.addEventListener('click', (e) => {
        if (e.target === feedbackModal) feedbackModal.classList.remove('active');
    });

    feedbackForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        // In a real app, you'd send this to a server
        const formData = {
            type: document.getElementById('feedbackType').value,
            message: document.getElementById('feedbackMessage').value,
            email: document.getElementById('feedbackEmail').value
        };
        alert(t('alert.feedbackSuccess'));
        feedbackForm.reset();
        feedbackModal?.classList.remove('active');
    });

    // Shortcuts modal
    const shortcutsBtn = document.getElementById('shortcutsBtn');
    const shortcutsModal = document.getElementById('shortcutsModal');
    const shortcutsModalClose = document.getElementById('shortcutsModalClose');

    shortcutsBtn?.addEventListener('click', () => {
        shortcutsModal?.classList.add('active');
        closeMobileMenu();
    });

    shortcutsModalClose?.addEventListener('click', () => {
        shortcutsModal?.classList.remove('active');
    });

    shortcutsModal?.addEventListener('click', (e) => {
        if (e.target === shortcutsModal) shortcutsModal.classList.remove('active');
    });
}

// ============================================
// Keyboard Shortcuts
// ============================================
export function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Don't trigger shortcuts when typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            // Only allow Escape in inputs
            if (e.key === 'Escape') {
                closeAllModals();
            }
            return;
        }

        // Ctrl/Cmd + key shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'n':
                    e.preventDefault();
                    if (state.currentView === 'calculator') {
                        addCourse();
                    } else {
                        switchView('calculator');
                        setTimeout(() => addCourse(), 100);
                    }
                    break;
                case 's':
                    e.preventDefault();
                    saveCourses();
                    // Visual feedback
                    showToast(t('shortcut.saved'));
                    break;
                case 'e':
                    e.preventDefault();
                    switchView('export');
                    break;
                case 'd':
                    e.preventDefault();
                    switchView('home');
                    break;
                case 'k':
                    e.preventDefault();
                    switchView('calculator');
                    break;
                case 't':
                    e.preventDefault();
                    toggleTheme();
                    break;
                case 'l':
                    e.preventDefault();
                    toggleLanguage();
                    break;
            }
        }

        // Single key shortcuts
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
            switch (e.key) {
                case '?':
                    elements.helpModal?.classList.add('active');
                    break;
                case 'Escape':
                    closeAllModals();
                    break;
            }
        }
    });
}

export function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

export function showToast(message, duration = 2000) {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--bg-secondary);
        color: var(--text-primary);
        padding: 12px 24px;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideUp 0.3s ease;
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ============================================
// Drag and Drop for Courses
// ============================================
export function initDragAndDrop() {
    let draggedItem = null;

    elements.courseList?.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('course-entry')) {
            draggedItem = e.target;
            e.target.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        }
    });

    elements.courseList?.addEventListener('dragend', (e) => {
        if (e.target.classList.contains('course-entry')) {
            e.target.classList.remove('dragging');
            draggedItem = null;
            saveCourses();
        }
    });

    elements.courseList?.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(elements.courseList, e.clientY);
        const dragging = document.querySelector('.dragging');
        if (dragging) {
            if (afterElement == null) {
                elements.courseList.appendChild(dragging);
            } else {
                elements.courseList.insertBefore(dragging, afterElement);
            }
        }
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.course-entry:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// ============================================
// Achievements View Functions
// ============================================
export const achievementsList = [
    { id: 'first_course', icon: '', nameKey: 'achFirstCourse', descKey: 'achFirstCourseDesc', condition: (s) => getTotalCourseCount(s) >= 1 },
    { id: 'five_courses', icon: '', nameKey: 'achFiveCourses', descKey: 'achFiveCoursesDesc', condition: (s) => getTotalCourseCount(s) >= 5 },
    { id: 'twenty_courses', icon: '', nameKey: 'achTwentyCourses', descKey: 'achTwentyCoursesDesc', condition: (s) => getTotalCourseCount(s) >= 20 },
    { id: 'first_aa', icon: '', nameKey: 'achFirstAA', descKey: 'achFirstAADesc', condition: (s) => hasGrade(s, 'AA') },
    { id: 'honor_student', icon: '', nameKey: 'achHonor', descKey: 'achHonorDesc', condition: (s) => getCurrentGPA() >= 3.00 },
    { id: 'high_honor', icon: '', nameKey: 'achHighHonor', descKey: 'achHighHonorDesc', condition: (s) => getCurrentGPA() >= 3.50 },
    { id: 'perfect_gpa', icon: '', nameKey: 'achPerfectGPA', descKey: 'achPerfectGPADesc', condition: (s) => getCurrentGPA() >= 3.995 },
    { id: 'first_semester', icon: '', nameKey: 'achFirstSemester', descKey: 'achFirstSemesterDesc', condition: (s) => Object.keys(s.semesters).length >= 1 },
    { id: 'four_semesters', icon: '', nameKey: 'achFourSemesters', descKey: 'achFourSemestersDesc', condition: (s) => Object.keys(s.semesters).length >= 4 },
    { id: 'eight_semesters', icon: '', nameKey: 'achEightSemesters', descKey: 'achEightSemestersDesc', condition: (s) => Object.keys(s.semesters).length >= 8 },
    { id: 'night_owl', icon: '', nameKey: 'achNightOwl', descKey: 'achNightOwlDesc', condition: () => new Date().getHours() >= 0 && new Date().getHours() < 6 },
    { id: 'early_bird', icon: '', nameKey: 'achEarlyBird', descKey: 'achEarlyBirdDesc', condition: () => new Date().getHours() >= 5 && new Date().getHours() < 8 },
    { id: 'explorer', icon: '', nameKey: 'achExplorer', descKey: 'achExplorerDesc', condition: () => (localStorage.getItem('viewedViews')?.split(',') ?? []).length >= 5 }
];

export function getCurrentGPA() {
    return getCurrentGPAValue();
}

export function initAchievementsView() {
    checkAchievements();
    refreshView('achievements');
}

export function checkAchievements() {
    const newlyUnlocked = [];

    achievementsList.forEach(ach => {
        const wasUnlocked = state.achievements[ach.id];
        const isNowUnlocked = ach.condition(state);

        if (!wasUnlocked && isNowUnlocked) {
            state.achievements[ach.id] = {
                unlockedAt: new Date().toISOString()
            };
            newlyUnlocked.push(ach);
        }
    });

    if (newlyUnlocked.length > 0) {
        saveToLocalStorage();
        newlyUnlocked.forEach(ach => {
            showAchievementNotification(ach);
        });
    }

    if (state.currentView === 'achievements') {
        refreshView('achievements');
    }

    return newlyUnlocked;
}

export function showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-text">
            <span class="achievement-title">${t('achievementUnlocked')}</span>
            <span class="achievement-name">${t(achievement.nameKey)}</span>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Track viewed views for explorer achievement
export function trackViewedView(view) {
    const viewed = localStorage.getItem('viewedViews')?.split(',') || [];
    if (!viewed.includes(view)) {
        viewed.push(view);
        localStorage.setItem('viewedViews', viewed.join(','));
    }
}

// ============================================
// Bootstrap
// ============================================
export function init() {
    initTheme();
    initLanguage();
    initNavigation();
    initEventListeners();
    initHelpModal();
    initKeyboardShortcuts();
    initDragAndDrop();
    // Initialize state.semester to match the current select value before loading
    state.semester = elements.semesterSelect?.value || '';
    loadFromLocalStorage();
    state.semester = elements.semesterSelect?.value || state.semester;
    updateCoursesEmptyState();
    calculateGPA();

    // BOUN Pusula: render the initial landing view (Home) via the registration pattern.
    switchView(state.currentView);

    // Live tick — keep Home's countdowns / current-class fresh without a reload.
    // Timer only (never a fetch); runs renderHome() only while Home is the active view.
    setInterval(() => {
        if (state.currentView === 'home') refreshView('home');
    }, 60000);
}
