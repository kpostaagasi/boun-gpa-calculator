/**
 * BOUN GPA Calculator — Final Grade Calculator module
 *
 * "Finalden kaç almalıyım?" — enter the components you already have scores for
 * (midterms, assignments, quizzes) with their weights, pick the final's weight
 * and your target letter grade, and the module computes the score you need on
 * the final. Pure math lives in src/final-grade-math.js (DOM-free, tested).
 *
 * State persists under 'bounGpa:finalGrade' and auto-saves on every change.
 */
import { registerViewInit } from './ui.js';
import { registerViewRefresh, t } from './i18n.js';
import { loadModule, saveModule, registerAppKey, uid } from './store.js';
import { escapeHtml, getNumericGradeEntries } from './grades.js';
import { elements } from './state.js';
import { computeCurrentPoints, requiredFinalScore, achievablePoint, validateWeightTotal, scoreThresholds } from './final-grade-math.js';

const NS = 'finalGrade';
registerAppKey(NS);

function container() { return elements.finalGradeView || document.getElementById('finalGradeView'); }

function load() {
    const d = loadModule(NS);
    return {
        components: Array.isArray(d.components) ? d.components : [],
        finalWeight: d.finalWeight != null ? String(d.finalWeight) : '40',
        targetGrade: d.targetGrade || 'BB'
    };
}
function persist(data) { saveModule(NS, data); }

function blankComponent() {
    return { id: uid(), name: '', weight: '', score: '' };
}

function componentRow(c) {
    return `
        <div class="fg-comp" data-id="${escapeHtml(c.id)}">
            <input type="text" class="form-input fg-name" value="${escapeHtml(c.name)}" placeholder="${t('finalGrade.componentName')}" aria-label="${t('finalGrade.componentName')}">
            <input type="number" class="form-input fg-weight" min="0" max="100" step="0.5" value="${escapeHtml(String(c.weight))}" placeholder="0" aria-label="${t('finalGrade.weight')}">
            <input type="number" class="form-input fg-score" min="0" max="100" step="0.5" value="${escapeHtml(String(c.score))}" placeholder="0" aria-label="${t('finalGrade.score')}">
            <button type="button" class="btn-icon sm" data-action="fg-remove" data-id="${escapeHtml(c.id)}" aria-label="${t('finalGrade.remove')}">✕</button>
        </div>`;
}

function render() {
    const root = container();
    if (!root) return;
    const data = load();
    const gradeOpts = getNumericGradeEntries().map(([grade]) =>
        `<option value="${grade}" ${data.targetGrade === grade ? 'selected' : ''}>${grade} (≥${scoreThresholds[grade]})</option>`).join('');
    const rows = data.components.length
        ? data.components.map(componentRow).join('')
        : `<div class="empty-state"><h3 class="empty-state-title">${t('finalGrade.empty')}</h3>
            <p class="empty-state-desc">${t('finalGrade.emptyDesc')}</p></div>`;
    root.innerHTML = `
        <div class="card">
            <div class="card-header">
                <div><h2 class="card-title">${t('finalGrade.title')}</h2>
                    <p class="card-subtitle">${t('finalGrade.desc')}</p></div>
            </div>
        </div>
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">${t('finalGrade.addComponent')}</h2>
                <button type="button" class="btn btn-primary btn-sm" data-action="fg-add">＋ ${t('finalGrade.addComponent')}</button>
            </div>
            <div class="fg-row fg-head">
                <span>${t('finalGrade.componentName')}</span><span>${t('finalGrade.weight')}</span><span>${t('finalGrade.score')}</span><span></span>
            </div>
            <div id="fgComponents" class="fg-comps">${rows}</div>
            <p class="fg-hint">${t('finalGrade.weightHint')}</p>
        </div>
        <div class="card">
            <div class="card-header"><h2 class="card-title">${t('finalGrade.result')}</h2></div>
            <div class="form-row">
                <div class="form-group"><label class="form-label" for="fgFinalWeight">${t('finalGrade.finalWeight')}</label>
                    <input type="number" id="fgFinalWeight" class="form-input" min="0" max="100" step="0.5" value="${escapeHtml(data.finalWeight)}"></div>
                <div class="form-group"><label class="form-label" for="fgTarget">${t('finalGrade.targetGrade')}</label>
                    <select id="fgTarget" class="form-select">${gradeOpts}</select></div>
            </div>
            <div id="fgResult"></div>
        </div>`;
    updateResults();
}

function collect() {
    const root = container();
    const data = load();
    data.finalWeight = root.querySelector('#fgFinalWeight')?.value ?? '';
    data.targetGrade = root.querySelector('#fgTarget')?.value || 'BB';
    data.components = [...root.querySelectorAll('.fg-comp')].map((row) => ({
        id: row.dataset.id,
        name: row.querySelector('.fg-name')?.value ?? '',
        weight: row.querySelector('.fg-weight')?.value ?? '',
        score: row.querySelector('.fg-score')?.value ?? ''
    }));
    return data;
}

function updateResults() {
    const root = container();
    const out = root.querySelector('#fgResult');
    if (!out) return;
    const data = collect();
    const components = data.components.map((c) => ({ weight: Number(c.weight) / 100, score: Number(c.score) }));
    const currentPoints = computeCurrentPoints(components);
    const finalWeight = Number(data.finalWeight) / 100;
    const weightValidation = validateWeightTotal(components, finalWeight);
    if (!weightValidation.valid) {
        out.innerHTML = `<div class="fg-result fg-muted">${t('finalGrade.weightHint')}</div>`;
        return;
    }
    const targetScore = scoreThresholds[data.targetGrade];
    const res = requiredFinalScore(currentPoints, finalWeight, targetScore);
    const best = achievablePoint(currentPoints, finalWeight, 100);

    const fmt = (n) => (Number.isFinite(n) ? n.toFixed(1) : '—');
    let msg, cls;
    if (res.status === 'ok') { msg = t('finalGrade.required', { n: fmt(res.required) }); cls = 'fg-ok'; }
    else if (res.status === 'achieved') { msg = t('finalGrade.achieved'); cls = 'fg-ok'; }
    else if (res.status === 'impossible') { msg = t('finalGrade.impossible'); cls = 'fg-bad'; }
    else { msg = t('finalGrade.invalid'); cls = 'fg-muted'; }

    out.innerHTML = `
        <div class="fg-stats">
            <div class="fg-stat"><span class="fg-stat-label">${t('finalGrade.currentPoints')}</span><span class="fg-stat-value">${fmt(currentPoints)}</span></div>
            <div class="fg-stat"><span class="fg-stat-label">${t('finalGrade.bestCase')}</span><span class="fg-stat-value">${fmt(best)}</span></div>
        </div>
        <div class="fg-result ${cls}">${msg}</div>`;
}

function onInput() {
    const data = collect();
    persist(data);
    updateResults();
}

function onClick(e) {
    const el = e.target.closest('[data-action]');
    if (!el || !container().contains(el)) return;
    if (el.dataset.action === 'fg-add') {
        const data = load();
        data.components.push(blankComponent());
        persist(data);
        render();
    } else if (el.dataset.action === 'fg-remove') {
        const data = load();
        data.components = data.components.filter((c) => c.id !== el.dataset.id);
        persist(data);
        render();
    }
}

function init() {
    const root = container();
    if (!root) return;
    root.addEventListener('input', onInput);
    root.addEventListener('change', onInput);
    root.addEventListener('click', onClick);
}

registerViewInit('finalGrade', init);
registerViewRefresh('finalGrade', render);
