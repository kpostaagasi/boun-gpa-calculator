/**
 * BOUN Pusula — Weekly Schedule Module
 *
 * User-built weekly class timetable persisted under 'pusula:schedule'.
 * Renders a Mon–Fri (optional Sat) column grid of colored class blocks and
 * feeds Home's "today's classes" widget. Listeners are bound once on the view
 * container via delegation (registerViewInit); render runs on every visit and
 * on language change (registerViewRefresh).
 */
import { registerViewInit, showToast } from './ui.js';
import { registerViewRefresh, t } from './i18n.js';
import { loadModule, saveModule, registerAppKey, uid } from './store.js';
import { escapeHtml } from './grades.js';
import { state, elements } from './state.js';
import { scheduleHasOverlap, blocksOverlap, parseHM } from './pusula-utils.js';

const NS = 'schedule';
registerAppKey(NS);

export const SCHEDULE_COLORS = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];
const DAY_KEYS = ['day.mon', 'day.tue', 'day.wed', 'day.thu', 'day.fri', 'day.sat', 'day.sun'];

let editing = null; // draft course being added/edited, or null

function container() { return elements.scheduleView || document.getElementById('scheduleView'); }

export function loadSchedule() {
    const d = loadModule(NS);
    return {
        courses: Array.isArray(d.courses) ? d.courses : [],
        settings: d.settings && typeof d.settings === 'object' ? d.settings : { showSaturday: false }
    };
}

function persist(data) { saveModule(NS, data); }

function blankDraft() {
    return { id: null, name: '', code: '', instructor: '', location: '', colorToken: 'c1',
        blocks: [{ day: 0, start: '09:00', end: '10:50' }] };
}

// Read the open form's fields into `editing` so re-renders don't lose input.
function syncDraftFromDom() {
    if (!editing) return;
    const root = container();
    const val = (sel) => root.querySelector(sel)?.value ?? '';
    editing.name = val('#schName');
    editing.code = val('#schCode');
    editing.instructor = val('#schInstructor');
    editing.location = val('#schLocation');
    editing.colorToken = val('#schColor') || 'c1';
    editing.blocks = [...root.querySelectorAll('.sch-block-row')].map(row => ({
        day: parseInt(row.querySelector('.sch-day').value, 10) || 0,
        start: row.querySelector('.sch-start').value || '09:00',
        end: row.querySelector('.sch-end').value || '10:00'
    }));
    if (!editing.blocks.length) editing.blocks = [{ day: 0, start: '09:00', end: '10:50' }];
}

function visibleDays(settings) {
    return settings.showSaturday ? [0, 1, 2, 3, 4, 5] : [0, 1, 2, 3, 4];
}

function formMarkup() {
    const d = editing;
    const colorOpts = SCHEDULE_COLORS.map(c =>
        `<option value="${c}" ${d.colorToken === c ? 'selected' : ''}>${c.toUpperCase()}</option>`).join('');
    const dayOpts = (sel) => DAY_KEYS.map((k, i) =>
        `<option value="${i}" ${sel === i ? 'selected' : ''}>${t(k)}</option>`).join('');
    const blockRows = d.blocks.map((b, i) => `
        <div class="sch-block-row" data-idx="${i}">
            <select class="form-select sch-day" aria-label="${t('schedule.day')}">${dayOpts(b.day)}</select>
            <input type="time" class="form-input sch-start" value="${b.start}" aria-label="${t('schedule.start')}">
            <input type="time" class="form-input sch-end" value="${b.end}" aria-label="${t('schedule.end')}">
            <button type="button" class="btn-icon sm" data-action="remove-block" data-idx="${i}" aria-label="${t('common.delete')}">✕</button>
        </div>`).join('');
    return `
        <div class="card sch-form">
            <div class="card-header"><h2 class="card-title">${d.id ? t('common.edit') : t('schedule.addCourse')}</h2></div>
            <div class="form-row">
                <div class="form-group"><label class="form-label" for="schName">${t('schedule.name')}</label>
                    <input type="text" id="schName" class="form-input" value="${escapeHtml(d.name)}"></div>
                <div class="form-group"><label class="form-label" for="schCode">${t('schedule.code')}</label>
                    <input type="text" id="schCode" class="form-input" value="${escapeHtml(d.code)}"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label class="form-label" for="schInstructor">${t('schedule.instructor')}</label>
                    <input type="text" id="schInstructor" class="form-input" value="${escapeHtml(d.instructor)}"></div>
                <div class="form-group"><label class="form-label" for="schLocation">${t('schedule.location')}</label>
                    <input type="text" id="schLocation" class="form-input" value="${escapeHtml(d.location)}"></div>
            </div>
            <div class="form-group" style="max-width:160px;"><label class="form-label" for="schColor">${t('schedule.color')}</label>
                <select id="schColor" class="form-select">${colorOpts}</select></div>
            <div class="form-group"><label class="form-label">${t('schedule.day')} / ${t('schedule.start')} / ${t('schedule.end')}</label>
                <div class="sch-block-list">${blockRows}</div>
                <button type="button" class="btn btn-secondary btn-sm" data-action="add-block" style="margin-top:var(--space-2);">＋ ${t('schedule.addBlock')}</button>
            </div>
            <div style="display:flex; gap:var(--space-2); margin-top:var(--space-3);">
                <button type="button" class="btn btn-primary" data-action="save-class">${t('common.save')}</button>
                <button type="button" class="btn btn-secondary" data-action="cancel-class">${t('common.cancel')}</button>
            </div>
        </div>`;
}

function gridMarkup(data) {
    const days = visibleDays(data.settings);
    const cols = days.map(day => {
        const items = [];
        data.courses.forEach(c => (c.blocks || []).forEach(b => {
            if (b.day === day) items.push({ c, b });
        }));
        items.sort((a, b) => parseHM(a.b.start) - parseHM(b.b.start));
        const blocks = items.map(({ c, b }) => {
            const overlap = data.courses.some(o => (o.blocks || []).some(ob =>
                !(o === c && ob === b) && blocksOverlap(b, ob)));
            return `
            <div class="sch-block sch-${c.colorToken || 'c1'} ${overlap ? 'sch-overlap' : ''}"
                 data-action="edit-class" data-id="${c.id}" role="button" tabindex="0">
                <span class="sch-block-time">${b.start}–${b.end}</span>
                <span class="sch-block-name">${escapeHtml(c.code || c.name || '—')}</span>
                ${c.location ? `<span class="sch-block-loc">${escapeHtml(c.location)}</span>` : ''}
            </div>`;
        }).join('') || `<div class="sch-empty-col">·</div>`;
        return `<div class="sch-col"><div class="sch-col-head">${t(DAY_KEYS[day])}</div>${blocks}</div>`;
    }).join('');
    return `<div class="sch-grid" style="--sch-cols:${days.length};">${cols}</div>`;
}

function render() {
    const root = container();
    if (!root) return;
    const data = loadSchedule();
    const overlap = scheduleHasOverlap(data.courses);
    const empty = data.courses.length === 0;
    root.innerHTML = `
        <div class="card">
            <div class="card-header">
                <div><h2 class="card-title">${t('schedule.title')}</h2>
                    <p class="card-subtitle">${t('schedule.desc')}</p></div>
                <div style="display:flex; gap:var(--space-2); flex-wrap:wrap;">
                    <button type="button" class="btn btn-secondary btn-sm" data-action="pull-gpa">${t('schedule.pullFromGPA')}</button>
                    <button type="button" class="btn btn-primary btn-sm" data-action="add-class">＋ ${t('schedule.addCourse')}</button>
                </div>
            </div>
            <label class="sch-toggle"><input type="checkbox" data-action="toggle-saturday" ${data.settings.showSaturday ? 'checked' : ''}> ${t('schedule.showSaturday')}</label>
            ${overlap ? `<div class="sch-warn">⚠ ${t('schedule.overlap')}</div>` : ''}
        </div>
        ${editing ? formMarkup() : ''}
        ${empty && !editing ? emptyMarkup() : `<div class="card">${gridMarkup(data)}</div>`}
    `;
}

function emptyMarkup() {
    return `
        <div class="card"><div class="empty-state">
            <div class="empty-state-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
            </div>
            <h3 class="empty-state-title">${t('schedule.empty')}</h3>
            <p class="empty-state-desc">${t('schedule.emptyDesc')}</p>
        </div></div>`;
}

function saveCurrentDraft() {
    syncDraftFromDom();
    if (!editing.name.trim() && !editing.code.trim()) { showToast(t('schedule.name')); return; }
    const data = loadSchedule();
    if (editing.id) {
        const idx = data.courses.findIndex(c => c.id === editing.id);
        if (idx >= 0) data.courses[idx] = { ...editing };
    } else {
        data.courses.push({ ...editing, id: uid() });
    }
    persist(data);
    editing = null;
    render();
    showToast(t('schedule.saved'));
}

function pullFromGPA() {
    const names = (state.courses || []).map(c => (c.name || '').trim()).filter(Boolean);
    if (!names.length) { showToast(t('schedule.empty')); return; }
    const data = loadSchedule();
    const existing = new Set(data.courses.map(c => (c.name || '').toLowerCase()));
    let added = 0;
    names.forEach(n => {
        if (!existing.has(n.toLowerCase())) {
            data.courses.push({ id: uid(), name: n, code: n.split(' ')[0] || '', instructor: '', location: '',
                colorToken: SCHEDULE_COLORS[added % SCHEDULE_COLORS.length], blocks: [] });
            added++;
        }
    });
    persist(data);
    render();
}

function onClick(e) {
    const el = e.target.closest('[data-action]');
    if (!el || !container().contains(el)) return;
    const action = el.dataset.action;
    if (action === 'add-class') { editing = blankDraft(); render(); }
    else if (action === 'edit-class') {
        const data = loadSchedule();
        const c = data.courses.find(x => x.id === el.dataset.id);
        if (c) { editing = JSON.parse(JSON.stringify(c)); if (!editing.blocks?.length) editing.blocks = blankDraft().blocks; render(); }
    }
    else if (action === 'cancel-class') { editing = null; render(); }
    else if (action === 'save-class') { saveCurrentDraft(); }
    else if (action === 'add-block') { syncDraftFromDom(); editing.blocks.push({ day: 0, start: '09:00', end: '10:50' }); render(); }
    else if (action === 'remove-block') { syncDraftFromDom(); editing.blocks.splice(parseInt(el.dataset.idx, 10), 1); render(); }
    else if (action === 'pull-gpa') { pullFromGPA(); }
}

function onChange(e) {
    const el = e.target.closest('[data-action="toggle-saturday"]');
    if (!el) return;
    const data = loadSchedule();
    data.settings.showSaturday = el.checked;
    persist(data);
    render();
}

function init() {
    const root = container();
    if (!root) return;
    root.addEventListener('click', onClick);
    root.addEventListener('change', onChange);
    root.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const el = e.target.closest('[data-action="edit-class"]');
            if (el) { e.preventDefault(); el.click(); }
        }
    });
}

registerViewInit('schedule', init);
registerViewRefresh('schedule', render);
