/**
 * BOUN GPA Calculator — Features Module
 *
 * Contains goal calculator, export, semester history, simulation,
 * graduation, and achievements rendering.
 */
import { state, elements, viewInitFlags } from './state.js';
import { t, currentLanguage, registerViewRefresh, refreshView } from './i18n.js';
import { gradePoints, retakeableGrades, nonGPAGrades, getClosestGradeToPoint, getSortedNumericGrades, escapeHtml, getGradeLabels, formatGradePoint, getGradeAtLeastPoint } from './grades.js';
import { calculateGPA, getCurrentGPAValue, registerViewInit, closeMobileMenu, showToast, saveToLocalStorage, switchView, achievementsList, checkAchievements, addCourse, updateCoursesEmptyState } from './ui.js';
import { computeSemesterGPA, computeCumulativeGPA, calculateGoalRequirement, getTotalCourseCount, hasGrade } from './gpa.js';

// ============================================
// Registration
// ============================================
registerViewInit('goal', syncGoalInputsFromCalculator);
registerViewInit('simulation', initSimulationView);
registerViewInit('graduation', initGraduationView);

registerViewRefresh('history', renderSemesterHistory);
registerViewRefresh('graduation', calculateGraduationProgress);
registerViewRefresh('achievements', renderAchievements);

// Simulation refresh is special — save grades, re-render, restore grades
registerViewRefresh('simulation', () => {
    const currentGrades = Array.from(document.querySelectorAll('.sim-grade-select')).map(s => s.value);
    renderSimulationView();
    if (currentGrades.length > 0) {
        applySimulationGrades(currentGrades);
    }
    renderSavedScenarios();
});

// ============================================
// Goal Calculator
// ============================================
export function calculateGoal() {
    const currentGPA = parseFloat(elements.goalCurrentGPA.value) || 0;
    const currentCredits = parseFloat(elements.goalCurrentCredits.value) || 0;
    const targetGPA = parseFloat(elements.goalTargetGPA.value) || 0;
    const plannedCredits = parseFloat(elements.goalPlannedCredits.value) || 0;

    if (plannedCredits <= 0) {
        showGoalResult('danger', '-', t('goal.enterCredits'));
        return;
    }

    if (targetGPA <= 0) {
        showGoalResult('danger', '-', t('goal.enterTargetGpa'));
        return;
    }

    // Calculate required GPA for planned credits
    // targetGPA = (currentGPA * currentCredits + requiredGPA * plannedCredits) / (currentCredits + plannedCredits)
    // requiredGPA = (targetGPA * (currentCredits + plannedCredits) - currentGPA * currentCredits) / plannedCredits

    const targetTotalPoints = targetGPA * (currentCredits + plannedCredits);
    const currentPoints = currentGPA * currentCredits;
    const requiredPoints = targetTotalPoints - currentPoints;
    const requiredGPA = requiredPoints / plannedCredits;

    let status, description;

    if (requiredGPA > 4.0) {
        status = 'danger';
        description = t('goal.impossible', { credits: plannedCredits, gpa: requiredGPA.toFixed(2) });
    } else if (requiredGPA < 0) {
        status = 'success';
        description = t('goal.alreadyAchieved');
    } else if (requiredGPA >= 3.5) {
        status = 'warning';
        description = t('goal.difficult', { credits: plannedCredits, grade: getGradeForGPA(requiredGPA) });
    } else {
        status = 'success';
        description = t('goal.achievable', { credits: plannedCredits, grade: getGradeForGPA(requiredGPA) });
    }

    const displayGPA = requiredGPA < 0 ? '\u2713' : requiredGPA > 4 ? '4.00+' : requiredGPA.toFixed(2);
    showGoalResult(status, displayGPA, description);

    // Progress bar (targetGPA is guaranteed > 0 from validation above)
    const progress = Math.min(100, Math.max(0, (currentGPA / targetGPA) * 100));
    elements.goalProgressBar.style.display = 'block';
    elements.goalProgressFill.style.width = `${progress}%`;
    elements.goalProgressFill.classList.remove('success', 'warning', 'danger');
    elements.goalProgressFill.classList.add(status);
}

export function showGoalResult(status, value, description) {
    elements.goalResultIcon.classList.remove('success', 'warning', 'danger');
    elements.goalResultIcon.classList.add(status);
    elements.goalResultValue.textContent = value;
    elements.goalResultDesc.textContent = description;
}

export function getGradeForGPA(gpa) {
    const grade = getGradeAtLeastPoint(gpa);
    if (!grade) return '';
    const point = gradePoints[grade];
    if (typeof point !== 'number') return grade;
    return `${grade} (${formatGradePoint(point)})`;
}

export function syncGoalInputsFromCalculator() {
    // Sync current values from calculator to goal inputs
    // Use creditsForGPA (excludes P) because goal calculation formula requires GPA-affecting credits
    const { cumulativeGPA, creditsForGPA } = calculateGPA();
    elements.goalCurrentGPA.value = cumulativeGPA.toFixed(2);
    elements.goalCurrentCredits.value = creditsForGPA;
}

// ============================================
// Export Functions
// ============================================
export async function exportAsPNG() {
    try {
        const canvas = await html2canvas(elements.exportPreview, {
            backgroundColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#1e293b' : '#ffffff',
            scale: 2
        });

        const link = document.createElement('a');
        link.download = `boun-gpa-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (error) {
        console.error('Export error:', error);
        alert(t('alert.exportError'));
    }
}

export function exportAsPDF() {
    buildTranscript();
    window.print();
}

export function buildTranscript() {
    const el = document.getElementById('transcriptPrint');
    if (!el) return;

    const now = new Date().toLocaleDateString(currentLanguage === 'tr' ? 'tr-TR' : 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    // Collect all semester data, sorted by numeric ID
    const semesterEntries = Object.entries(state.semesters)
        .map(([id, data]) => ({ id, num: parseInt(id, 10) || 0, data }))
        .sort((a, b) => a.num - b.num);

    // Include the current semester if it has courses
    const currentSemId = state.semester;
    const currentCourses = [];
    document.querySelectorAll('.course-entry').forEach(entry => {
        const name = entry.querySelector('.course-name').value.trim();
        const credit = parseFloat(entry.querySelector('.course-credit').value);
        const grade = entry.querySelector('.course-grade').value;
        if (credit && grade) currentCourses.push({ name, credit, grade });
    });
    const currentIsNew = currentSemId && !semesterEntries.find(e => e.id === currentSemId) && currentCourses.length > 0;

    // Compute overall cumulative GPA
    const cumulativeGPA = state.lastCalculatedGPA || 0;
    const totalCreditsAll = state.lastCalculatedTotalCredits || 0;
    const semCount = semesterEntries.length + (currentIsNew ? 1 : 0);

    // Honor status
    let honorKey = 'transcript.noHonor';
    if (cumulativeGPA >= 3.5) honorKey = 'transcript.highHonor';
    else if (cumulativeGPA >= 3.0) honorKey = 'transcript.honor';

    // GPA progress bar HTML
    function gpaBarHtml(label, gpa) {
        const pct = Math.min(100, (gpa / 4.0) * 100).toFixed(1);
        return `
            <div class="transcript-gpa-row">
                <span class="transcript-gpa-label">${escapeHtml(label)}</span>
                <span class="transcript-gpa-bar-bg"><span class="transcript-gpa-bar-fill" style="width:${pct}%"></span></span>
                <span class="transcript-gpa-value">${gpa.toFixed(2)}</span>
            </div>`;
    }

    // Build GPA progress section
    let progressHtml = '';
    semesterEntries.forEach(({ id, data }) => {
        const label = `${t('semester.format', { n: id })}`;
        progressHtml += gpaBarHtml(label, data.gpa || 0);
    });
    if (currentIsNew) {
        progressHtml += gpaBarHtml(t('transcript.currentSem'), state.lastCalculatedSemesterGPA || 0);
    }
    if (!progressHtml) {
        progressHtml = `<p style="font-size:9pt;color:#777">${t('transcript.noSemesters')}</p>`;
    }

    // Build semester detail tables
    function semesterTableHtml(courses, semLabel, gpa, credits, notes) {
        const rows = courses.map(c => `
            <tr>
                <td>${escapeHtml(c.name || t('history.unnamed'))}</td>
                <td>${c.credit || c.credits || 0}</td>
                <td>${escapeHtml(c.grade || '')}</td>
            </tr>`).join('');
        const notesHtml = notes
            ? `<div style="font-size:8pt;color:#666;font-style:italic;margin-top:3pt">${escapeHtml(notes)}</div>`
            : '';
        return `
            <div class="transcript-semester">
                <div class="transcript-semester-title">
                    ${escapeHtml(semLabel)} &nbsp;\u00b7&nbsp; GPA: ${(gpa || 0).toFixed(2)} &nbsp;\u00b7&nbsp; ${t('calc.totalCredits')}: ${credits || 0}
                </div>
                ${notesHtml}
                <table class="transcript-table">
                    <thead><tr>
                        <th>${t('calc.courseName')}</th>
                        <th>${t('calc.credit')}</th>
                        <th>${t('calc.grade')}</th>
                    </tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>`;
    }

    let semTablesHtml = '';
    if (semesterEntries.length === 0 && !currentIsNew) {
        semTablesHtml = `<p style="font-size:9pt;color:#777">${t('transcript.noSemesters')}</p>`;
    } else {
        semesterEntries.forEach(({ id, data }) => {
            semTablesHtml += semesterTableHtml(
                data.courses || [],
                t('semester.format', { n: id }),
                data.gpa,
                data.credits,
                data.notes || ''
            );
        });
        if (currentIsNew) {
            const currentNotes = elements.semesterNotesInput?.value.trim() || '';
            semTablesHtml += semesterTableHtml(
                currentCourses,
                t('transcript.currentSem'),
                state.lastCalculatedSemesterGPA || 0,
                state.lastCalculatedCreditsForGPA || 0,
                currentNotes
            );
        }
    }

    // Grade scale
    const gradeScaleEntries = Object.entries(gradePoints)
        .filter(([, v]) => v !== null)
        .map(([g, v]) => `${g}=${v.toFixed(1)}`)
        .join(' &nbsp;|&nbsp; ');
    const nonGpaStr = nonGPAGrades.join(', ');

    el.innerHTML = `
        <div class="transcript-header">
            <div class="transcript-header-text">
                <h1>Bo\u011fazi\u00e7i \u00dcniversitesi</h1>
                <p>${t('transcript.title')}</p>
                <p>${t('transcript.generated')}: ${escapeHtml(now)}</p>
            </div>
        </div>

        <div class="transcript-section-title">${t('transcript.summary')}</div>
        <div class="transcript-summary">
            <div class="transcript-summary-item">
                <span class="transcript-summary-label">${t('calc.overallGpa')}:</span>
                <span>${cumulativeGPA.toFixed(2)}</span>
            </div>
            <div class="transcript-summary-item">
                <span class="transcript-summary-label">${t('calc.totalCredits')}:</span>
                <span>${totalCreditsAll}</span>
            </div>
            <div class="transcript-summary-item">
                <span class="transcript-summary-label">${t('transcript.semCount')}:</span>
                <span>${semCount}</span>
            </div>
            <div class="transcript-summary-item">
                <span class="transcript-summary-label">${t('transcript.honorStatus')}:</span>
                <span>${t(honorKey)}</span>
            </div>
        </div>

        <div class="transcript-section-title">${t('transcript.gpaProgress')}</div>
        ${progressHtml}

        <div class="transcript-section-title">${t('transcript.semHeader')}</div>
        ${semTablesHtml}

        <div class="transcript-grade-scale">
            <strong>${t('transcript.gradeScale')}:</strong> ${gradeScaleEntries}
            &nbsp;&nbsp; Non-GPA: ${escapeHtml(nonGpaStr)}
        </div>
        <div class="transcript-footer">
            ${t('transcript.generated')}: ${escapeHtml(now)} — boun-gpa-calculator
        </div>
    `;
}

window.addEventListener('afterprint', () => {
    const el = document.getElementById('transcriptPrint');
    if (el) el.innerHTML = '';
});

export async function shareResults() {
    const { cumulativeGPA, totalCredits } = calculateGPA();
    const gpaLabel = currentLanguage === 'tr' ? 'GPA\'m' : 'My GPA';
    const creditsLabel = t('calc.totalCredits');
    const shareData = {
        title: 'BOUN GPA Calculator',
        text: `${gpaLabel}: ${cumulativeGPA.toFixed(2)} | ${creditsLabel}: ${totalCredits}`,
        url: window.location.href
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            // Share was cancelled by user
        }
    } else {
        // Fallback: copy to clipboard
        const text = `${shareData.text}\n${shareData.url}`;
        try {
            await navigator.clipboard.writeText(text);
            alert(t('export.copied'));
        } catch (err) {
            alert(t('export.copied'));
        }
    }
}

// Collect every BOUN Pusula module blob ('pusula:*') as raw JSON strings.
function collectPusulaModules() {
    const out = {};
    Object.keys(localStorage).forEach(k => {
        if (k.startsWith('pusula:')) out[k] = localStorage.getItem(k);
    });
    return out;
}

export function exportAsJSON() {
    const data = {
        // schemaVersion 3 = BOUN Pusula envelope (GPA data + module data).
        // Legacy GPA-only backups (no schemaVersion / no pusulaModules) still import.
        schemaVersion: 3,
        version: '3.0',
        exportDate: new Date().toISOString(),
        language: currentLanguage,
        courses: state.courses,
        semester: state.semester,
        previousGPA: elements.previousGPAInput?.value,
        previousCredits: elements.previousCreditsInput?.value,
        semesters: state.semesters,
        baseSemester: state.baseSemester,
        baseGPA: state.baseGPA,
        baseCredits: state.baseCredits,
        achievements: state.achievements,
        scenarios: state.scenarios,
        pusulaModules: collectPusulaModules()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `boun-pusula-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
}

export function importData() {
    const jsonInput = document.getElementById('importJson');
    const jsonText = jsonInput?.value?.trim();

    if (!jsonText) {
        alert(t('alert.importError'));
        return;
    }

    try {
        const data = JSON.parse(jsonText);

        // Validate data structure
        if (!data.courses && !data.semesters) {
            throw new Error('Invalid data structure');
        }

        // Import language
        if (data.language) {
            // setLanguage will be handled by the registered import from i18n.js
            // when the module is loaded; for now, just store the preference
            localStorage.setItem('language', data.language);
        }

        // Import base semester info
        if (data.baseSemester !== undefined) state.baseSemester = data.baseSemester;
        if (data.baseGPA !== undefined) state.baseGPA = data.baseGPA;
        if (data.baseCredits !== undefined) state.baseCredits = data.baseCredits;

        // Import semester and history
        if (data.semester && elements.semesterSelect) {
            elements.semesterSelect.value = data.semester;
        }
        if (data.semesters) state.semesters = data.semesters;

        // Import previous GPA/credits
        if (data.previousGPA !== undefined && elements.previousGPAInput) {
            elements.previousGPAInput.value = data.previousGPA;
        }
        if (data.previousCredits !== undefined && elements.previousCreditsInput) {
            elements.previousCreditsInput.value = data.previousCredits;
        }

        // Import achievements and scenarios
        if (data.achievements && typeof data.achievements === 'object') state.achievements = data.achievements;
        if (Array.isArray(data.scenarios)) state.scenarios = data.scenarios;

        // Import BOUN Pusula module data (schemaVersion 3+). Absent in legacy backups.
        if (data.pusulaModules && typeof data.pusulaModules === 'object') {
            Object.entries(data.pusulaModules).forEach(([k, v]) => {
                if (k.startsWith('pusula:') && typeof v === 'string') localStorage.setItem(k, v);
            });
        }

        // Import courses
        if (data.courses && elements.courseList) {
            elements.courseList.innerHTML = '';
            data.courses.forEach(course => addCourse(course));
        }

        // Save and update
        saveToLocalStorage();
        updateCoursesEmptyState();
        calculateGPA();

        if (state.currentView === 'simulation') {
            initSimulationView();
        }
        if (state.currentView === 'achievements') {
            renderAchievements();
        }
        if (state.currentView === 'graduation') {
            calculateGraduationProgress();
        }
        // Re-render any BOUN Pusula module view that's currently open
        if (['home', 'schedule', 'planner', 'notes', 'campus', 'gradeGuide'].includes(state.currentView)) {
            refreshView(state.currentView);
        }

        // Close modal
        document.getElementById('importModal')?.classList.remove('active');

        alert(t('alert.importSuccess'));

    } catch (error) {
        console.error('Import error:', error);
        alert(t('alert.importError'));
    }
}

// ============================================
// Semester History
// ============================================
export function renderSemesterHistory() {
    const semesters = Object.entries(state.semesters);

    if (semesters.length === 0) {
        elements.emptySemesterState.style.display = 'flex';
        elements.semesterTabs.innerHTML = '';
        return;
    }

    elements.emptySemesterState.style.display = 'none';

    // Render tabs with translated semester names
    elements.semesterTabs.innerHTML = semesters.map(([id, sem], index) => `
        <button class="semester-tab ${index === 0 ? 'active' : ''}" data-semester-id="${id}">
            ${t('semester.format', { n: id })}
        </button>
    `).join('');

    // Tab click handlers
    elements.semesterTabs.querySelectorAll('.semester-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            elements.semesterTabs.querySelectorAll('.semester-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderSemesterContent(tab.dataset.semesterId);
        });
    });

    // Render first semester content
    if (semesters.length > 0) {
        renderSemesterContent(semesters[0][0]);
    }
}

export function renderSemesterContent(semesterId) {
    const semester = state.semesters[semesterId];
    if (!semester) return;

    const content = `
        <div class="card" style="margin-top: var(--space-4);">
            <div class="results-grid" style="border: none; padding: 0; margin: 0 0 var(--space-6) 0;">
                <div class="result-item">
                    <div class="result-label">${t('history.semesterGpa')}</div>
                    <div class="result-value">${semester.gpa?.toFixed(2) || '0.00'}</div>
                </div>
                <div class="result-item">
                    <div class="result-label">${t('history.semesterCredits')}</div>
                    <div class="result-value">${semester.credits || 0}</div>
                </div>
                <div class="result-item">
                    <div class="result-label">${t('history.courseCount')}</div>
                    <div class="result-value">${semester.courses?.length || 0}</div>
                </div>
            </div>
            ${semester.courses?.length > 0 ? `
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <th style="text-align: left; padding: var(--space-3); color: var(--text-secondary); font-weight: 500;">${t('history.course')}</th>
                            <th style="text-align: center; padding: var(--space-3); color: var(--text-secondary); font-weight: 500;">${t('calc.credit')}</th>
                            <th style="text-align: center; padding: var(--space-3); color: var(--text-secondary); font-weight: 500;">${t('calc.grade')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${semester.courses.map(course => `
                            <tr style="border-bottom: 1px solid var(--border-color);">
                                <td style="padding: var(--space-3);">${escapeHtml(course.name) || t('history.unnamed')}</td>
                                <td style="text-align: center; padding: var(--space-3);">${escapeHtml(String(course.credit))}</td>
                                <td style="text-align: center; padding: var(--space-3); font-weight: 600;">${escapeHtml(course.grade)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            ` : `<p style="text-align: center; color: var(--text-secondary);">${t('misc.noCourseRecords')}</p>`}
        </div>
    `;

    elements.semesterContent.innerHTML = content;
}

// ============================================
// Simulation Functions
// ============================================
export function initSimulationView() {
    renderSimulationView();
    renderSavedScenarios();
    if (!viewInitFlags.simulation) {
        setupSimulationEventListeners();
        viewInitFlags.simulation = true;
    }
}

export function renderSimulationView() {
    const container = document.getElementById('simulationCourses');
    if (!container) return;

    // Get current courses for simulation
    const courses = state.courses.length > 0 ? state.courses : getSampleCourses();
    const fallbackGrade = getSortedNumericGrades(true)[0]?.[0] || Object.keys(gradePoints)[0] || '';

    container.innerHTML = courses.map((course, index) => `
        <div class="simulation-course" data-index="${index}">
            <div class="sim-course-info">
                <span class="sim-course-name">${course.name || t('course') + ' ' + (index + 1)}</span>
                <span class="sim-course-credits">${course.credits ?? course.credit ?? 3} ${t('credits')}</span>
            </div>
            <select class="sim-grade-select" data-index="${index}">
                ${Object.keys(gradePoints).map(grade =>
                    `<option value="${grade}" ${(gradePoints[course.grade] !== undefined ? course.grade : fallbackGrade) === grade ? 'selected' : ''}>${grade}</option>`
                ).join('')}
            </select>
        </div>
    `).join('');

    calculateSimulationGPA();
}

export function getSampleCourses() {
    const targets = [4.0, 3.5, 3.0, 2.5];
    const grades = targets.map(point => getClosestGradeToPoint(point)).filter(Boolean);
    const fallbackGrade = getSortedNumericGrades(true)[0]?.[0] || Object.keys(gradePoints)[0] || '';
    return [
        { name: t('course') + ' 1', credits: 3, grade: grades[0] || fallbackGrade },
        { name: t('course') + ' 2', credits: 3, grade: grades[1] || fallbackGrade },
        { name: t('course') + ' 3', credits: 4, grade: grades[2] || fallbackGrade },
        { name: t('course') + ' 4', credits: 3, grade: grades[3] || fallbackGrade }
    ];
}

export function calculateSimulationGPA() {
    const selects = document.querySelectorAll('.sim-grade-select');
    const courses = state.courses.length > 0 ? state.courses : getSampleCourses();

    let totalPoints = 0;
    let totalCredits = 0;

    selects.forEach((select, index) => {
        const grade = select.value;
        const credits = parseFloat(courses[index]?.credits ?? courses[index]?.credit) || 3;

        if (!nonGPAGrades.includes(grade) && gradePoints[grade] !== undefined) {
            totalPoints += gradePoints[grade] * credits;
            totalCredits += credits;
        }
    });

    const simGPA = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';

    const resultEl = document.getElementById('simulatedGPA');
    const changeEl = document.getElementById('gpaChange');

    if (resultEl) resultEl.textContent = simGPA;

    if (changeEl) {
        const currentSemGPA = state.lastCalculatedSemesterGPA || 0;
        const change = (parseFloat(simGPA) - currentSemGPA).toFixed(2);
        const prefix = change >= 0 ? '+' : '';
        changeEl.textContent = `(${prefix}${change})`;
        changeEl.className = 'gpa-change ' + (change >= 0 ? 'positive' : 'negative');
    }
}

export function setupSimulationEventListeners() {
    // Grade select changes
    document.getElementById('simulationCourses')?.addEventListener('change', (e) => {
        if (e.target.classList.contains('sim-grade-select')) {
            calculateSimulationGPA();
        }
    });

    // Quick scenario buttons
    document.querySelectorAll('.quick-scenario-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const scenario = btn.dataset.scenario;
            applyQuickScenario(scenario);
        });
    });

    // Save scenario button
    document.getElementById('saveScenarioBtn')?.addEventListener('click', saveCurrentScenario);

    // Reset simulation
    document.getElementById('resetSimulationBtn')?.addEventListener('click', () => {
        renderSimulationView();
    });

    // Saved scenarios actions
    document.getElementById('savedScenarios')?.addEventListener('click', (e) => {
        const loadBtn = e.target.closest('.load-scenario-btn');
        const deleteBtn = e.target.closest('.delete-scenario-btn');
        if (loadBtn) {
            const id = parseInt(loadBtn.dataset.id, 10);
            loadScenario(id);
        }
        if (deleteBtn) {
            const id = parseInt(deleteBtn.dataset.id, 10);
            deleteScenario(id);
        }
    });
}

export function applyQuickScenario(scenario) {
    const selects = document.querySelectorAll('.sim-grade-select');
    const gradeKeys = Object.keys(gradePoints).filter(g => !nonGPAGrades.includes(g));
    const topGrade = getSortedNumericGrades(true)[0]?.[0] || gradeKeys[0];
    const midGrade = getClosestGradeToPoint(3.0) || topGrade;
    const lowGrade = getClosestGradeToPoint(2.0) || topGrade;

    if (gradeKeys.length === 0) return;

    selects.forEach(select => {
        switch(scenario) {
            case 'all-aa':
                select.value = topGrade;
                break;
            case 'all-bb':
                select.value = midGrade;
                break;
            case 'all-cc':
                select.value = lowGrade;
                break;
            case 'random':
                select.value = gradeKeys[Math.floor(Math.random() * gradeKeys.length)];
                break;
        }
    });

    calculateSimulationGPA();
}

export function saveCurrentScenario() {
    const selects = document.querySelectorAll('.sim-grade-select');
    const grades = Array.from(selects).map(s => s.value);
    const simGPA = document.getElementById('simulatedGPA')?.textContent || '0.00';
    const courses = state.courses.length > 0 ? state.courses : getSampleCourses();
    const courseSnapshot = courses.map(c => c.name || '').slice(0, grades.length);

    const scenario = {
        id: Date.now(),
        name: `${t('scenario')} ${state.scenarios.length + 1}`,
        semesterId: state.semester,
        courseSnapshot,
        grades: grades,
        gpa: simGPA,
        date: new Date().toLocaleDateString()
    };

    state.scenarios.push(scenario);
    saveToLocalStorage();
    renderSavedScenarios();
    showToast(t('scenarioSaved'));
}

export function renderSavedScenarios() {
    const container = document.getElementById('savedScenarios');
    if (!container) return;

    if (state.scenarios.length === 0) {
        container.innerHTML = `<p class="empty-message">${t('noSavedScenarios')}</p>`;
        return;
    }

    container.innerHTML = state.scenarios.map(scenario => `
        <div class="scenario-card" data-id="${scenario.id}">
            <div class="scenario-info">
                <span class="scenario-name">${scenario.name}</span>
                <span class="scenario-gpa">GPA: ${scenario.gpa}</span>
            </div>
            <div class="scenario-actions">
                <button class="load-scenario-btn" data-id="${scenario.id}">${t('load')}</button>
                <button class="delete-scenario-btn" data-id="${scenario.id}">&times;</button>
            </div>
        </div>
    `).join('');
}

export function applySimulationGrades(grades) {
    const selects = document.querySelectorAll('.sim-grade-select');
    grades.forEach((grade, index) => {
        if (selects[index]) {
            selects[index].value = grade;
        }
    });
    calculateSimulationGPA();
}

export function loadScenario(id) {
    const scenario = state.scenarios.find(s => s.id === id);
    if (!scenario) return;
    if (scenario.semesterId && scenario.semesterId !== state.semester) {
        showToast(t('simulation.semesterMismatch'));
    }
    applySimulationGrades(scenario.grades || []);
}

export function deleteScenario(id) {
    state.scenarios = state.scenarios.filter(s => s.id !== id);
    saveToLocalStorage();
    renderSavedScenarios();
}

// ============================================
// Graduation Calculator
// ============================================
export function initGraduationView() {
    if (!viewInitFlags.graduation) {
        setupGraduationEventListeners();
        viewInitFlags.graduation = true;
    }
    calculateGraduationProgress();
}

export function setupGraduationEventListeners() {
    document.getElementById('calculateGraduationBtn')?.addEventListener('click', calculateGraduationProgress);

    // Auto-calculate on input change
    ['targetCredits', 'targetGPA'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', calculateGraduationProgress);
    });
}

export function calculateGraduationProgress() {
    const targetCreditsInput = document.getElementById('targetCredits');
    const targetGPAInput = document.getElementById('targetGPA');

    const targetCredits = parseFloat(targetCreditsInput?.value) || 140;
    const targetGPA = parseFloat(targetGPAInput?.value) || 2.50;

    // Calculate current stats
    calculateGPA();
    const currentCredits = calculateTotalCredits();
    const currentGPA = getCurrentGPAValue();

    // Remaining credits
    const remainingCredits = Math.max(0, targetCredits - currentCredits);

    // Required GPA for remaining courses
    const currentPoints = currentGPA * currentCredits;
    const targetPoints = targetGPA * targetCredits;
    const neededPoints = targetPoints - currentPoints;
    const requiredGPA = remainingCredits > 0 ? (neededPoints / remainingCredits).toFixed(2) : 0;

    // Update UI
    updateGraduationUI({
        currentCredits,
        targetCredits,
        remainingCredits,
        currentGPA,
        targetGPA,
        requiredGPA
    });

    // Check honor status
    updateHonorStatus(currentGPA);
}

export function calculateTotalCredits() {
    let total = state.baseCredits || 0;

    Object.values(state.semesters).forEach(semester => {
        semester.courses.forEach(course => {
            total += parseFloat(course.credits ?? course.credit) || 0;
        });
    });

    // Add current semester courses
    state.courses.forEach(course => {
        total += parseFloat(course.credits ?? course.credit) || 0;
    });

    return total;
}

export function updateGraduationUI(data) {
    // Credit progress
    const creditProgress = Math.min(100, (data.currentCredits / data.targetCredits) * 100);
    const creditFill = document.getElementById('creditProgressFill');
    const creditText = document.getElementById('creditProgressText');

    if (creditFill) creditFill.style.width = `${creditProgress}%`;
    if (creditText) creditText.textContent = `${data.currentCredits} / ${data.targetCredits} ${t('credits')}`;

    // GPA progress
    const gpaProgress = Math.min(100, (data.currentGPA / 4.0) * 100);
    const gpaFill = document.getElementById('gpaProgressFill');
    const gpaText = document.getElementById('gpaProgressText');

    if (gpaFill) gpaFill.style.width = `${gpaProgress}%`;
    if (gpaText) gpaText.textContent = `${data.currentGPA.toFixed(2)} / 4.00`;

    // Required GPA display
    const requiredEl = document.getElementById('requiredGPA');
    if (requiredEl) {
        const reqGPA = parseFloat(data.requiredGPA);
        requiredEl.textContent = data.requiredGPA;
        requiredEl.className = 'required-gpa-value ' + (reqGPA > 4.0 ? 'impossible' : reqGPA > 3.5 ? 'hard' : 'achievable');
    }

    // Remaining credits
    const remainingEl = document.getElementById('remainingCredits');
    if (remainingEl) remainingEl.textContent = data.remainingCredits;

    // Graduation message
    const messageEl = document.getElementById('graduationMessage');
    if (messageEl) {
        const reqGPA = parseFloat(data.requiredGPA);
        if (data.remainingCredits === 0) {
            messageEl.innerHTML = `<span class="success">\ud83c\udf93 ${t('graduationComplete')}</span>`;
        } else if (reqGPA > 4.0) {
            messageEl.innerHTML = `<span class="warning">\u26a0\ufe0f ${t('targetUnreachable')}</span>`;
        } else if (reqGPA > 3.5) {
            messageEl.innerHTML = `<span class="caution">${t('targetChallenging')}</span>`;
        } else {
            messageEl.innerHTML = `<span class="good">${t('targetAchievable')}</span>`;
        }
    }
}

export function updateHonorStatus(gpa) {
    const badges = document.querySelectorAll('.honor-badge');
    badges.forEach(badge => {
        const minGPA = parseFloat(badge.dataset.mingpa);
        if (gpa >= minGPA) {
            badge.classList.add('achieved');
        } else {
            badge.classList.remove('achieved');
        }
    });
}

// ============================================
// Achievements Rendering
// ============================================
export function renderAchievements() {
    const container = document.getElementById('achievementsList');
    if (!container) return;

    const unlockedCount = Object.keys(state.achievements).length;
    const totalCount = achievementsList.length;

    // Update progress
    const progressEl = document.getElementById('achievementProgress');
    if (progressEl) {
        progressEl.textContent = `${unlockedCount} / ${totalCount}`;
    }

    const progressFill = document.getElementById('achievementProgressFill');
    if (progressFill) {
        progressFill.style.width = `${(unlockedCount / totalCount) * 100}%`;
    }

    // Render badges
    container.innerHTML = achievementsList.map(ach => {
        const isUnlocked = !!state.achievements[ach.id];
        const unlockedDate = isUnlocked ? new Date(state.achievements[ach.id].unlockedAt).toLocaleDateString() : '';

        return `
            <div class="achievement-badge ${isUnlocked ? 'unlocked' : 'locked'}">
                <div class="badge-icon">${isUnlocked ? ach.icon : '\ud83d\udd12'}</div>
                <div class="badge-info">
                    <span class="badge-name">${t(ach.nameKey)}</span>
                    <span class="badge-desc">${t(ach.descKey)}</span>
                    ${isUnlocked ? `<span class="badge-date">${unlockedDate}</span>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// Event Bindings (was in initEventListeners in script.js)
// ============================================

// Goal calculator bindings
elements.calculateGoalBtn?.addEventListener('click', calculateGoal);
[elements.goalCurrentGPA, elements.goalCurrentCredits, elements.goalTargetGPA, elements.goalPlannedCredits].forEach(el => {
    el?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') calculateGoal();
    });
});

// Export bindings
elements.exportPNG?.addEventListener('click', exportAsPNG);
elements.exportPDF?.addEventListener('click', exportAsPDF);
elements.exportShare?.addEventListener('click', shareResults);
document.getElementById('exportJSON')?.addEventListener('click', exportAsJSON);

// Import modal bindings
const importBtn = document.getElementById('importBtn');
const importModal = document.getElementById('importModal');
const importModalClose = document.getElementById('importModalClose');
const importDataBtn = document.getElementById('importDataBtn');
const importCancelBtn = document.getElementById('importCancelBtn');
const importFile = document.getElementById('importFile');
const importFileName = document.getElementById('importFileName');

importBtn?.addEventListener('click', () => {
    importModal?.classList.add('active');
    closeMobileMenu();
});
importModalClose?.addEventListener('click', () => {
    importModal?.classList.remove('active');
});
importCancelBtn?.addEventListener('click', () => {
    importModal?.classList.remove('active');
});
importModal?.addEventListener('click', (e) => {
    if (e.target === importModal) importModal.classList.remove('active');
});
importFile?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        importFileName.textContent = file.name;
        const reader = new FileReader();
        reader.onload = (event) => {
            document.getElementById('importJson').value = event.target.result;
        };
        reader.readAsText(file);
    }
});
importDataBtn?.addEventListener('click', () => {
    importData();
});
