/**
 * BOUN Pusula — Exam & Assignment Planner
 *
 * One unified, deadline-sorted list of exams/assignments/quizzes/projects,
 * persisted under 'pusula:planner'. Drives Home's countdown + due-soon widgets.
 * Live "days/hours left" badges with urgency tiers reuse the existing semantic
 * color tokens. Optional client-side .ics export (pure string build, no network).
 */
import { registerViewInit, showToast } from './ui.js';
import { registerViewRefresh, t } from './i18n.js';
import { loadModule, saveModule, registerAppKey, uid } from './store.js';
import { escapeHtml } from './grades.js';
import { elements } from './state.js';
import { countdownInfo } from './pusula-utils.js';

const NS = 'planner';
registerAppKey(NS);

const TYPES = ['exam', 'assignment', 'quiz', 'project'];
const TYPE_KEY = { exam: 'planner.typeExam', assignment: 'planner.typeAssignment', quiz: 'planner.typeQuiz', project: 'planner.typeProject' };

let editing = null;

function container() { return elements.plannerView || document.getElementById('plannerView'); }

export function loadPlanner() {
    const d = loadModule(NS);
    return { items: Array.isArray(d.items) ? d.items : [] };
}
function persist(data) { saveModule(NS, data); }

function blankDraft() {
    return { id: null, title: '', type: 'exam', course: '', dueISO: '', weight: '', location: '', done: false };
}

/** Live badge text + urgency tier for an item, relative to `now` (Date). */
export function badgeFor(item, now) {
    const info = countdownInfo(item.dueISO, now);
    if (info.overdue) return { text: t('planner.overdue'), tier: 'danger' };
    if (info.daysLeft < 1) {
        const h = Math.max(0, info.hoursLeft);
        return { text: t('planner.hoursLeft', { n: h }), tier: info.tier };
    }
    return { text: t('planner.daysLeft', { n: info.daysLeft }), tier: info.tier };
}

function sortByDue(items) {
    return [...items].sort((a, b) => new Date(a.dueISO).getTime() - new Date(b.dueISO).getTime());
}

function itemMarkup(item, now) {
    const badge = item.dueISO ? badgeFor(item, now) : { text: '', tier: 'neutral' };
    const due = item.dueISO ? new Date(item.dueISO) : null;
    const dueStr = due ? due.toLocaleString() : '';
    const meta = [t(TYPE_KEY[item.type] || 'planner.typeExam'), item.course, item.weight ? `%${item.weight}` : '', item.location]
        .filter(Boolean).map(escapeHtml).join(' · ');
    return `
        <div class="pl-item ${item.done ? 'pl-done' : ''}">
            <input type="checkbox" class="pl-check" data-action="toggle-done" data-id="${item.id}" ${item.done ? 'checked' : ''} aria-label="${t('planner.markDone')}">
            <div class="pl-body">
                <div class="pl-title">${escapeHtml(item.title || '—')}</div>
                <div class="pl-meta">${meta}${dueStr ? ` · ${escapeHtml(dueStr)}` : ''}</div>
            </div>
            ${item.done ? '' : `<span class="pl-badge ${badge.tier}">${badge.text}</span>`}
            <div class="pl-actions">
                <button type="button" class="btn-icon sm" data-action="edit-item" data-id="${item.id}" aria-label="${t('common.edit')}">✎</button>
                <button type="button" class="btn-icon sm" data-action="delete-item" data-id="${item.id}" aria-label="${t('common.delete')}">✕</button>
            </div>
        </div>`;
}

function formMarkup() {
    const d = editing;
    const typeOpts = TYPES.map(ty => `<option value="${ty}" ${d.type === ty ? 'selected' : ''}>${t(TYPE_KEY[ty])}</option>`).join('');
    return `
        <div class="card pl-form">
            <div class="card-header"><h2 class="card-title">${d.id ? t('common.edit') : t('planner.add')}</h2></div>
            <div class="form-group"><label class="form-label" for="plTitle">${t('planner.titleField')}</label>
                <input type="text" id="plTitle" class="form-input" value="${escapeHtml(d.title)}"></div>
            <div class="form-row">
                <div class="form-group"><label class="form-label" for="plType">${t('planner.type')}</label>
                    <select id="plType" class="form-select">${typeOpts}</select></div>
                <div class="form-group"><label class="form-label" for="plCourse">${t('planner.course')}</label>
                    <input type="text" id="plCourse" class="form-input" value="${escapeHtml(d.course)}"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label class="form-label" for="plDue">${t('planner.due')}</label>
                    <input type="datetime-local" id="plDue" class="form-input" value="${escapeHtml(d.dueISO)}"></div>
                <div class="form-group"><label class="form-label" for="plWeight">${t('planner.weight')}</label>
                    <input type="number" id="plWeight" class="form-input" min="0" max="100" value="${escapeHtml(String(d.weight))}"></div>
            </div>
            <div class="form-group"><label class="form-label" for="plLocation">${t('planner.location')}</label>
                <input type="text" id="plLocation" class="form-input" value="${escapeHtml(d.location)}"></div>
            <div style="display:flex; gap:var(--space-2); margin-top:var(--space-3);">
                <button type="button" class="btn btn-primary" data-action="save-item">${t('common.save')}</button>
                <button type="button" class="btn btn-secondary" data-action="cancel-item">${t('common.cancel')}</button>
            </div>
        </div>`;
}

function render() {
    const root = container();
    if (!root) return;
    const now = new Date();
    const data = loadPlanner();
    const open = sortByDue(data.items.filter(i => !i.done));
    const done = sortByDue(data.items.filter(i => i.done));
    const empty = data.items.length === 0;
    root.innerHTML = `
        <div class="card">
            <div class="card-header">
                <div><h2 class="card-title">${t('planner.title')}</h2>
                    <p class="card-subtitle">${t('planner.desc')}</p></div>
                <div style="display:flex; gap:var(--space-2); flex-wrap:wrap;">
                    ${data.items.length ? `<button type="button" class="btn btn-secondary btn-sm" data-action="export-ics">${t('planner.exportIcs')}</button>` : ''}
                    <button type="button" class="btn btn-primary btn-sm" data-action="add-item">＋ ${t('planner.add')}</button>
                </div>
            </div>
        </div>
        ${editing ? formMarkup() : ''}
        ${empty && !editing ? emptyMarkup() : `
            <div class="card"><div class="pl-list">${open.map(i => itemMarkup(i, now)).join('') || `<p class="empty-message">${t('home.noDueSoon')}</p>`}</div></div>
            ${done.length ? `<div class="card"><details class="pl-completed"><summary>${t('planner.completed')} (${done.length})</summary>
                <div class="pl-list">${done.map(i => itemMarkup(i, now)).join('')}</div></details></div>` : ''}
        `}
    `;
}

function emptyMarkup() {
    return `<div class="card"><div class="empty-state">
        <div class="empty-state-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
        </div>
        <h3 class="empty-state-title">${t('planner.empty')}</h3>
        <p class="empty-state-desc">${t('planner.emptyDesc')}</p>
    </div></div>`;
}

function saveCurrentDraft() {
    const root = container();
    const val = (id) => root.querySelector('#' + id)?.value ?? '';
    editing.title = val('plTitle');
    editing.type = val('plType') || 'exam';
    editing.course = val('plCourse');
    editing.dueISO = val('plDue');
    editing.weight = val('plWeight');
    editing.location = val('plLocation');
    if (!editing.title.trim()) { showToast(t('planner.titleField')); return; }
    const data = loadPlanner();
    if (editing.id) {
        const idx = data.items.findIndex(i => i.id === editing.id);
        if (idx >= 0) data.items[idx] = { ...data.items[idx], ...editing };
    } else {
        data.items.push({ ...editing, id: uid(), done: false });
    }
    persist(data);
    editing = null;
    render();
    showToast(t('planner.saved'));
}

function toICSDate(dueISO) {
    const d = new Date(dueISO);
    if (isNaN(d.getTime())) return '';
    const p = (n) => String(n).padStart(2, '0');
    return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}T${p(d.getUTCHours())}${p(d.getUTCMinutes())}00Z`;
}

function exportICS() {
    const data = loadPlanner();
    const dated = data.items.filter(i => i.dueISO);
    if (!dated.length) { showToast(t('planner.empty')); return; }
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//BOUN Pusula//Planner//TR', 'CALSCALE:GREGORIAN'];
    dated.forEach(i => {
        const dt = toICSDate(i.dueISO);
        if (!dt) return;
        lines.push('BEGIN:VEVENT', `UID:${i.id}@boun-pusula`, `DTSTAMP:${dt}`, `DTSTART:${dt}`,
            `SUMMARY:${(t(TYPE_KEY[i.type]) + ': ' + (i.title || '')).replace(/[\r\n,;]/g, ' ')}`, 'END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'boun-pusula-planner.ics'; a.click();
    URL.revokeObjectURL(url);
}

function onClick(e) {
    const el = e.target.closest('[data-action]');
    if (!el || !container().contains(el)) return;
    const action = el.dataset.action;
    const id = el.dataset.id;
    if (action === 'add-item') { editing = blankDraft(); render(); }
    else if (action === 'edit-item') {
        const item = loadPlanner().items.find(i => i.id === id);
        if (item) { editing = { ...blankDraft(), ...item }; render(); }
    }
    else if (action === 'cancel-item') { editing = null; render(); }
    else if (action === 'save-item') { saveCurrentDraft(); }
    else if (action === 'delete-item') {
        const data = loadPlanner();
        data.items = data.items.filter(i => i.id !== id);
        persist(data); render();
    }
    else if (action === 'export-ics') { exportICS(); }
}

function onChange(e) {
    const el = e.target.closest('[data-action="toggle-done"]');
    if (!el) return;
    const data = loadPlanner();
    const item = data.items.find(i => i.id === el.dataset.id);
    if (item) { item.done = el.checked; persist(data); render(); }
}

function init() {
    const root = container();
    if (!root) return;
    root.addEventListener('click', onClick);
    root.addEventListener('change', onChange);
}

registerViewInit('planner', init);
registerViewRefresh('planner', render);
