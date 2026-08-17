/**
 * BOUN GPA Calculator — Course Registration Planner module
 *
 * Plan the next term: add courses with predicted grades, see the total credit
 * load, the projected cumulative GPA, and the average you would need on the
 * planned credits to hit a target GPA. P grades count toward credits but not
 * GPA, mirroring the calculator's model. Pure math lives in
 * src/course-planner-math.js (DOM-free, tested).
 *
 * State persists under 'bounGpa:coursePlanner' and auto-saves on every change.
 * The "Import from current semester" action pulls the active semester's
 * courses from the GPA calculator (state.courses) as a starting point.
 */
import { registerViewInit, showToast } from './ui.js';
import { registerViewRefresh, t } from './i18n.js';
import { loadModule, saveModule, registerAppKey, uid } from './store.js';
import { escapeHtml, gradePoints, allGrades } from './grades.js';
import { elements, state } from './state.js';
import { creditTotal, gpaCreditTotal, projectedGPA, requiredPlannedGPA } from './course-planner-math.js';

const NS = 'coursePlanner';
registerAppKey(NS);

const CREDIT_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

function container() { return elements.coursePlannerView || document.getElementById('coursePlannerView'); }

function load() {
    const d = loadModule(NS);
    return {
        currentGPA: d.currentGPA != null ? String(d.currentGPA) : '',
        currentCredits: d.currentCredits != null ? String(d.currentCredits) : '',
        targetGPA: d.targetGPA != null ? String(d.targetGPA) : '3.0',
        courses: Array.isArray(d.courses) ? d.courses : []
    };
}
function persist(data) { saveModule(NS, data); }

function blankCourse() {
    return { id: uid(), name: '', credits: 3, grade: 'CC' };
}

function gradeOptions(selected) {
    return allGrades.map((g) => {
        const point = gradePoints[g];
        const label = point == null ? `${g} (${t('guide.nonGpa')})` : `${g} (${point})`;
        return `<option value="${g}" ${selected === g ? 'selected' : ''}>${label}</option>`;
    }).join('');
}

function creditOptions(selected) {
    return CREDIT_OPTIONS.map((c) => `<option value="${c}" ${Number(selected) === c ? 'selected' : ''}>${c}</option>`).join('');
}

function courseRow(c) {
    return `
        <div class="cp-course" data-id="${escapeHtml(c.id)}">
            <input type="text" class="form-input cp-name" value="${escapeHtml(c.name)}" placeholder="${t('coursePlanner.courseName')}" aria-label="${t('coursePlanner.courseName')}">
            <select class="form-select cp-credits" aria-label="${t('coursePlanner.credits')}">${creditOptions(c.credits)}</select>
            <select class="form-select cp-grade" aria-label="${t('coursePlanner.predictedGrade')}">${gradeOptions(c.grade)}</select>
            <button type="button" class="btn-icon sm" data-action="cp-remove" data-id="${escapeHtml(c.id)}" aria-label="${t('coursePlanner.remove')}">✕</button>
        </div>`;
}

function render() {
    const root = container();
    if (!root) return;
    const data = load();
    const canPull = Array.isArray(state.courses) && state.courses.length > 0;
    const rows = data.courses.length
        ? data.courses.map(courseRow).join('')
        : `<div class="empty-state"><h3 class="empty-state-title">${t('coursePlanner.empty')}</h3>
            <p class="empty-state-desc">${t('coursePlanner.emptyDesc')}</p></div>`;
    root.innerHTML = `
        <div class="card">
            <div class="card-header">
                <div><h2 class="card-title">${t('coursePlanner.title')}</h2>
                    <p class="card-subtitle">${t('coursePlanner.desc')}</p></div>
                ${canPull ? `<button type="button" class="btn btn-secondary btn-sm" data-action="cp-pull">${t('coursePlanner.pullFromGPA')}</button>` : ''}
            </div>
        </div>
        <div class="card">
            <div class="card-header"><h2 class="card-title">${t('coursePlanner.addCourse')}</h2>
                <button type="button" class="btn btn-primary btn-sm" data-action="cp-add">＋ ${t('coursePlanner.addCourse')}</button></div>
            <div class="cp-row cp-head">
                <span>${t('coursePlanner.courseName')}</span><span>${t('coursePlanner.credits')}</span><span>${t('coursePlanner.predictedGrade')}</span><span></span>
            </div>
            <div class="cp-courses">${rows}</div>
        </div>
        <div class="card">
            <div class="card-header"><h2 class="card-title">${t('coursePlanner.projectedGPA')}</h2></div>
            <div class="form-row">
                <div class="form-group"><label class="form-label" for="cpCurrentGPA">${t('coursePlanner.currentGPA')}</label>
                    <input type="number" id="cpCurrentGPA" class="form-input" min="0" max="4" step="0.01" value="${escapeHtml(data.currentGPA)}"></div>
                <div class="form-group"><label class="form-label" for="cpCurrentCredits">${t('coursePlanner.currentCredits')}</label>
                    <input type="number" id="cpCurrentCredits" class="form-input" min="0" max="400" step="1" value="${escapeHtml(data.currentCredits)}"></div>
                <div class="form-group"><label class="form-label" for="cpTargetGPA">${t('coursePlanner.targetGPA')}</label>
                    <input type="number" id="cpTargetGPA" class="form-input" min="0" max="4" step="0.01" value="${escapeHtml(data.targetGPA)}"></div>
            </div>
            <div id="cpSummary"></div>
        </div>`;
    updateSummary();
}

function collect() {
    const root = container();
    const data = load();
    data.currentGPA = root.querySelector('#cpCurrentGPA')?.value ?? '';
    data.currentCredits = root.querySelector('#cpCurrentCredits')?.value ?? '';
    data.targetGPA = root.querySelector('#cpTargetGPA')?.value ?? '';
    data.courses = [...root.querySelectorAll('.cp-course')].map((row) => ({
        id: row.dataset.id,
        name: row.querySelector('.cp-name')?.value ?? '',
        credits: Number(row.querySelector('.cp-credits')?.value) || 0,
        grade: row.querySelector('.cp-grade')?.value || 'CC'
    }));
    return data;
}

function updateSummary() {
    const root = container();
    const out = root.querySelector('#cpSummary');
    if (!out) return;
    const data = collect();
    const courses = data.courses.map((c) => ({ credits: c.credits, point: c.grade === 'P' ? null : gradePoints[c.grade] }));
    const currentGPA = Number(data.currentGPA) || 0;
    const currentCredits = Number(data.currentCredits) || 0;
    const targetGPA = Number(data.targetGPA);
    const total = creditTotal(courses);
    const proj = projectedGPA(currentGPA, currentCredits, courses);
    const delta = proj.gpa - currentGPA;
    const planGpaCredits = gpaCreditTotal(courses);
    const req = requiredPlannedGPA(currentGPA, currentCredits, targetGPA, planGpaCredits);

    const fmt = (n, digits = 2) => (Number.isFinite(n) ? n.toFixed(digits) : '—');
    const deltaStr = `${delta >= 0 ? '+' : ''}${fmt(delta)}`;

    let reqMsg, reqCls;
    if (req == null) { reqMsg = t('coursePlanner.requiredNoPlan'); reqCls = 'fg-muted'; }
    else if (req < 0) { reqMsg = t('coursePlanner.requiredMet'); reqCls = 'fg-ok'; }
    else if (req > 4) { reqMsg = t('coursePlanner.requiredImpossible'); reqCls = 'fg-bad'; }
    else { reqMsg = `${t('coursePlanner.requiredGPA')}: ${fmt(req)} — ${t('coursePlanner.requiredReachable')}`; reqCls = 'fg-ok'; }

    out.innerHTML = `
        <div class="fg-stats">
            <div class="fg-stat"><span class="fg-stat-label">${t('coursePlanner.totalCredits')}</span><span class="fg-stat-value">${total}</span></div>
            <div class="fg-stat"><span class="fg-stat-label">${t('coursePlanner.projectedGPA')}</span><span class="fg-stat-value">${fmt(proj.gpa)}</span></div>
            <div class="fg-stat"><span class="fg-stat-label">${t('coursePlanner.delta')}</span><span class="fg-stat-value">${deltaStr}</span></div>
        </div>
        <div class="fg-result ${reqCls}">${reqMsg}</div>`;
}

function onInput() {
    const data = collect();
    persist(data);
    updateSummary();
}

function onClick(e) {
    const el = e.target.closest('[data-action]');
    if (!el || !container().contains(el)) return;
    if (el.dataset.action === 'cp-add') {
        const data = load();
        data.courses.push(blankCourse());
        persist(data);
        render();
    } else if (el.dataset.action === 'cp-remove') {
        const data = load();
        data.courses = data.courses.filter((c) => c.id !== el.dataset.id);
        persist(data);
        render();
    } else if (el.dataset.action === 'cp-pull') {
        const data = load();
        const existing = new Set(data.courses.map((c) => c.name.trim()));
        (state.courses || []).forEach((c) => {
            const name = String(c.name || '').trim();
            if (!name || existing.has(name)) return;
            existing.add(name);
            data.courses.push({ id: uid(), name, credits: Number(c.credit) || 3, grade: c.grade || 'CC' });
        });
        persist(data);
        render();
        showToast(t('coursePlanner.saved'));
    }
}

function init() {
    const root = container();
    if (!root) return;
    root.addEventListener('input', onInput);
    root.addEventListener('change', onInput);
    root.addEventListener('click', onClick);
}

registerViewInit('coursePlanner', init);
registerViewRefresh('coursePlanner', render);
