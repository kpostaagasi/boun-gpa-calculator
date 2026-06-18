/**
 * BOUN GPA Calculator — Grade System Configuration & Helpers
 *
 * Boğaziçi University (BOUN) grade system — hardcoded as the sole supported system.
 */
import { t } from './i18n.js';

// ============================================
// Grade Points
// ============================================
export const gradePoints = {
    'AA': 4.0, 'BA': 3.5, 'BB': 3.0, 'CB': 2.5, 'CC': 2.0,
    'DC': 1.5, 'DD': 1.0, 'FF': 0.0, 'P': null
};

export const retakeableGrades = ['FF', 'DD', 'DC'];
export const nonGPAGrades = ['P'];
export const allGrades = ['AA', 'BA', 'BB', 'CB', 'CC', 'DC', 'DD', 'FF', 'P'];

// Returns BOUN grade system (kept for call-site compatibility)
export function getGradeSystem() {
    return { grades: gradePoints, retakeable: retakeableGrades, nonGPA: nonGPAGrades };
}

// Re-render all grade selects (called after language change)
export function updateAllGradeSelects() {
    document.querySelectorAll('.course-grade').forEach(select => {
        const currentValue = select.value;
        select.innerHTML = `
            <option value="" disabled>${t('calc.grade')}</option>
            ${Object.keys(gradePoints).map(grade =>
                `<option value="${grade}" ${currentValue === grade ? 'selected' : ''}>${grade}</option>`
            ).join('')}
        `;
    });

    document.querySelectorAll('.previous-grade').forEach(select => {
        const currentValue = select.value;
        select.innerHTML = `
            <option value="" disabled>${t('calc.previousGrade')}</option>
            ${retakeableGrades.map(grade =>
                `<option value="${grade}" ${currentValue === grade ? 'selected' : ''}>${grade} (${gradePoints[grade]})</option>`
            ).join('')}
        `;
    });
}

export function getNumericGradeEntries() {
    return Object.entries(gradePoints).filter(([_, point]) => typeof point === 'number' && !Number.isNaN(point));
}

export function getSortedNumericGrades(desc = true) {
    const entries = getNumericGradeEntries().sort((a, b) => a[1] - b[1]);
    return desc ? entries.reverse() : entries;
}

export function formatGradePoint(point) {
    const rounded = Math.round(point * 100) / 100;
    if (Number.isInteger(rounded)) return rounded.toFixed(1);
    return String(rounded);
}

export function getGradeLabels() {
    const numeric = getSortedNumericGrades(true).map(([grade]) => grade);
    const nonGpa = Object.keys(gradePoints).filter(grade => nonGPAGrades.includes(grade) || gradePoints[grade] === null);
    const labels = [...numeric];
    nonGpa.forEach(grade => {
        if (!labels.includes(grade)) labels.push(grade);
    });
    return labels;
}

export function getClosestGradeToPoint(targetPoint) {
    const entries = getNumericGradeEntries();
    if (entries.length === 0) return null;
    let closest = entries[0];
    entries.forEach(entry => {
        if (Math.abs(entry[1] - targetPoint) < Math.abs(closest[1] - targetPoint)) {
            closest = entry;
        }
    });
    return closest[0];
}

export function getGradeAtLeastPoint(targetPoint) {
    const entries = getSortedNumericGrades(false);
    if (entries.length === 0) return null;
    const found = entries.find(([, point]) => point >= targetPoint);
    return (found || entries[entries.length - 1])[0];
}

// HTML escape utility to prevent XSS
export function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// Course Templates
// ============================================
export const courseTemplatesData = {
    'cmpe': [
        { code: 'CMPE 150', name: 'Introduction to Computing', credit: 4 },
        { code: 'CMPE 160', name: 'Introduction to OOP', credit: 4 },
        { code: 'CMPE 220', name: 'Discrete Computational Structures', credit: 4 },
        { code: 'CMPE 230', name: 'Systems Programming', credit: 4 },
        { code: 'CMPE 240', name: 'Digital Systems', credit: 4 },
        { code: 'CMPE 250', name: 'Data Structures and Algorithms', credit: 4 },
        { code: 'CMPE 300', name: 'Analysis of Algorithms', credit: 4 },
        { code: 'CMPE 322', name: 'Operating Systems', credit: 4 },
        { code: 'CMPE 343', name: 'Introduction to Probability', credit: 4 },
        { code: 'CMPE 344', name: 'Computer Organization', credit: 4 },
        { code: 'CMPE 350', name: 'Formal Languages and Automata Theory', credit: 3 },
        { code: 'CMPE 352', name: 'Fundamentals of Software Engineering', credit: 3 },
    ],
    'math': [
        { code: 'MATH 101', name: 'Calculus I', credit: 4 },
        { code: 'MATH 102', name: 'Calculus II', credit: 4 },
        { code: 'MATH 201', name: 'Matrix Theory', credit: 4 },
        { code: 'MATH 202', name: 'Differential Equations', credit: 4 },
        { code: 'MATH 203', name: 'Linear Algebra', credit: 4 },
    ],
    'phys': [
        { code: 'PHYS 101', name: 'General Physics I', credit: 4 },
        { code: 'PHYS 102', name: 'General Physics II', credit: 4 },
        { code: 'PHYS 130', name: 'General Physics Lab', credit: 2 },
    ],
    'eng': [
        { code: 'ENG 101', name: 'Academic Writing I', credit: 3 },
        { code: 'ENG 102', name: 'Academic Writing II', credit: 3 },
        { code: 'ENG 201', name: 'Themes in Literature', credit: 3 },
    ],
    'turk': [
        { code: 'TK 101', name: 'Türkçe I', credit: 2 },
        { code: 'TK 102', name: 'Türkçe II', credit: 2 },
        { code: 'HTR 311', name: 'History of the Turkish Republic I', credit: 2 },
        { code: 'HTR 312', name: 'History of the Turkish Republic II', credit: 2 },
    ],
    'econ': [
        { code: 'EC 101', name: 'Principles of Economics I', credit: 3 },
        { code: 'EC 102', name: 'Principles of Economics II', credit: 3 },
        { code: 'AD 303', name: 'Principles of Management', credit: 3 },
    ],
    'ee': [
        { code: 'EE 210', name: 'Circuit Theory', credit: 4 },
        { code: 'EE 212', name: 'Electronics', credit: 4 },
        { code: 'EE 241', name: 'Signals and Systems', credit: 4 },
    ],
};

// Get course templates with translated category names
export function getCourseTemplates() {
    const templates = {};
    Object.entries(courseTemplatesData).forEach(([key, courses]) => {
        templates[t(`templates.cat.${key}`)] = courses;
    });
    return templates;
}
