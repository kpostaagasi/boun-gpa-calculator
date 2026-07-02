/**
 * BOUN Pusula — Grade System Guide (read-only reference)
 *
 * Rendered FROM the live grades.js constants so it can never drift from the
 * calculator: AA–FF ↔ point table, P/non-GPA grades, honor thresholds, retake
 * rules and a short FAQ. No persistence, no data — just markup + i18n. A single
 * "Open Calculator" action cross-links into the calculator.
 */
import { registerViewInit, switchView } from './ui.js';
import { registerViewRefresh, t } from './i18n.js';
import { gradePoints, retakeableGrades, nonGPAGrades, getSortedNumericGrades, formatGradePoint } from './grades.js';
import { elements } from './state.js';

function container() { return elements.gradeGuideView || document.getElementById('gradeGuideView'); }

function tableMarkup() {
    const rows = getSortedNumericGrades(true).map(([grade, point]) =>
        `<tr><td class="gg-grade">${grade}</td><td>${formatGradePoint(point)}</td></tr>`).join('');
    return `
        <table class="gg-table">
            <thead><tr><th>${t('guide.grade')}</th><th>${t('guide.points')}</th></tr></thead>
            <tbody>${rows}</tbody>
        </table>`;
}

function faqMarkup() {
    const items = [
        ['guide.faq1Q', 'guide.faq1A'],
        ['guide.faq2Q', 'guide.faq2A'],
        ['guide.faq3Q', 'guide.faq3A']
    ];
    return items.map(([q, a]) =>
        `<details class="gg-faq"><summary>${t(q)}</summary><p>${t(a)}</p></details>`).join('');
}

function render() {
    const root = container();
    if (!root) return;
    const nonGpaList = nonGPAGrades.join(', ');
    root.innerHTML = `
        <div class="card">
            <div class="card-header"><div><h2 class="card-title">${t('guide.title')}</h2>
                <p class="card-subtitle">${t('guide.desc')}</p></div>
                <button type="button" class="btn btn-primary btn-sm" data-action="open-calculator">${t('guide.openCalculator')}</button>
            </div>
        </div>
        <div class="card">
            <div class="card-header"><h2 class="card-title">${t('guide.gradeTable')}</h2></div>
            ${tableMarkup()}
            <p class="gg-note"><strong>${t('guide.nonGpa')} (${nonGpaList}):</strong> ${t('guide.nonGpaDesc')}</p>
        </div>
        <div class="card">
            <div class="card-header"><h2 class="card-title">${t('guide.honorTitle')}</h2></div>
            <ul class="gg-list"><li>🏅 ${t('guide.honor')}</li><li>🏆 ${t('guide.highHonor')}</li></ul>
        </div>
        <div class="card">
            <div class="card-header"><h2 class="card-title">${t('guide.retakeTitle')}</h2></div>
            <p class="gg-note">${t('guide.retakeDesc')} <strong>(${retakeableGrades.join(', ')})</strong></p>
        </div>
        <div class="card">
            <div class="card-header"><h2 class="card-title">${t('guide.faqTitle')}</h2></div>
            ${faqMarkup()}
        </div>`;
}

function init() {
    const root = container();
    if (!root) return;
    root.addEventListener('click', (e) => {
        if (e.target.closest('[data-action="open-calculator"]')) switchView('calculator');
    });
}

registerViewInit('gradeGuide', init);
registerViewRefresh('gradeGuide', render);
