/**
 * BOUN Pusula — Notes & Tasks Module
 *
 * Lightweight notes (title + plain-text body, pin, search) and simple
 * check-off tasks (no deadlines — that's the Planner's job), persisted under
 * 'pusula:notes'. All user text is rendered through escapeHtml (XSS-safe).
 * Pinned-note and open-task counts surface on Home.
 */
import { registerViewInit, showToast } from './ui.js';
import { registerViewRefresh, t } from './i18n.js';
import { loadModule, saveModule, registerAppKey, uid } from './store.js';
import { escapeHtml } from './grades.js';
import { elements } from './state.js';

const NS = 'notes';
registerAppKey(NS);

let activeTab = 'notes';
let searchQuery = '';

function container() { return elements.notesView || document.getElementById('notesView'); }

export function loadNotes() {
    const d = loadModule(NS);
    return {
        notes: Array.isArray(d.notes) ? d.notes : [],
        tasks: Array.isArray(d.tasks) ? d.tasks : []
    };
}
function persist(data) { saveModule(NS, data); }

function nowISO() { return new Date().toISOString(); }

function sortedNotes(notes) {
    return [...notes].sort((a, b) => {
        if (!!b.pinned !== !!a.pinned) return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
        return String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''));
    });
}

function noteMarkup(n) {
    return `
        <div class="nt-note ${n.pinned ? 'nt-pinned' : ''}">
            <div class="nt-note-head">
                <input type="text" class="nt-note-title" data-action="edit-note-title" data-id="${n.id}"
                    value="${escapeHtml(n.title)}" placeholder="${t('notes.noteTitle')}">
                <button type="button" class="btn-icon sm" data-action="toggle-pin" data-id="${n.id}" aria-label="${n.pinned ? t('notes.unpin') : t('notes.pin')}">${n.pinned ? '★' : '☆'}</button>
                <button type="button" class="btn-icon sm" data-action="delete-note" data-id="${n.id}" aria-label="${t('common.delete')}">✕</button>
            </div>
            <textarea class="nt-note-body form-input" data-action="edit-note-body" data-id="${n.id}" rows="3" placeholder="${t('notes.noteBody')}">${escapeHtml(n.body)}</textarea>
        </div>`;
}

function taskMarkup(tk) {
    return `
        <div class="nt-task ${tk.done ? 'nt-task-done' : ''}">
            <input type="checkbox" data-action="toggle-task" data-id="${tk.id}" ${tk.done ? 'checked' : ''} aria-label="${t('planner.markDone')}">
            <span class="nt-task-text">${escapeHtml(tk.text)}</span>
            <button type="button" class="btn-icon sm" data-action="delete-task" data-id="${tk.id}" aria-label="${t('common.delete')}">✕</button>
        </div>`;
}

function render() {
    const root = container();
    if (!root) return;
    const data = loadNotes();
    const q = searchQuery.trim().toLowerCase();
    const notes = sortedNotes(data.notes).filter(n =>
        !q || (n.title || '').toLowerCase().includes(q) || (n.body || '').toLowerCase().includes(q));
    const tasks = data.tasks;

    const notesPane = `
        <div class="nt-quickadd">
            <input type="text" id="ntQuickNote" class="form-input" placeholder="${t('notes.quickAddNote')}">
            <button type="button" class="btn btn-primary btn-sm" data-action="add-note">＋</button>
        </div>
        ${data.notes.length ? `<input type="text" id="ntSearch" class="form-input nt-search" placeholder="${t('notes.search')}" value="${escapeHtml(searchQuery)}">` : ''}
        ${notes.length ? `<div class="nt-notes">${notes.map(noteMarkup).join('')}</div>`
            : `<div class="empty-state"><h3 class="empty-state-title">${t('notes.emptyNotes')}</h3><p class="empty-state-desc">${t('notes.emptyNotesDesc')}</p></div>`}
    `;
    const tasksPane = `
        <div class="nt-quickadd">
            <input type="text" id="ntQuickTask" class="form-input" placeholder="${t('notes.quickAddTask')}">
            <button type="button" class="btn btn-primary btn-sm" data-action="add-task">＋</button>
        </div>
        ${tasks.length ? `<div class="nt-tasks">${tasks.map(taskMarkup).join('')}</div>`
            : `<div class="empty-state"><h3 class="empty-state-title">${t('notes.emptyTasks')}</h3><p class="empty-state-desc">${t('notes.emptyTasksDesc')}</p></div>`}
    `;

    root.innerHTML = `
        <div class="card">
            <div class="card-header"><div><h2 class="card-title">${t('notes.title')}</h2>
                <p class="card-subtitle">${t('notes.desc')}</p></div></div>
            <div class="nt-tabs">
                <button type="button" class="nt-tab ${activeTab === 'notes' ? 'active' : ''}" data-action="tab" data-tab="notes">${t('notes.notesTab')}</button>
                <button type="button" class="nt-tab ${activeTab === 'tasks' ? 'active' : ''}" data-action="tab" data-tab="tasks">${t('notes.tasksTab')}</button>
            </div>
            ${activeTab === 'notes' ? notesPane : tasksPane}
        </div>`;
}

function addNote() {
    const root = container();
    const input = root.querySelector('#ntQuickNote');
    const title = (input?.value || '').trim();
    if (!title) { input?.focus(); return; }
    const data = loadNotes();
    data.notes.unshift({ id: uid(), title, body: '', course: '', pinned: false, updatedAt: nowISO() });
    persist(data);
    render();
}

function addTask() {
    const root = container();
    const input = root.querySelector('#ntQuickTask');
    const text = (input?.value || '').trim();
    if (!text) { input?.focus(); return; }
    const data = loadNotes();
    data.tasks.unshift({ id: uid(), text, course: '', done: false, createdAt: nowISO() });
    persist(data);
    render();
}

function onClick(e) {
    const el = e.target.closest('[data-action]');
    if (!el || !container().contains(el)) return;
    const action = el.dataset.action;
    const id = el.dataset.id;
    if (action === 'tab') { activeTab = el.dataset.tab; render(); }
    else if (action === 'add-note') { addNote(); }
    else if (action === 'add-task') { addTask(); }
    else if (action === 'toggle-pin') {
        const data = loadNotes();
        const n = data.notes.find(x => x.id === id);
        if (n) { n.pinned = !n.pinned; n.updatedAt = nowISO(); persist(data); render(); }
    }
    else if (action === 'delete-note') {
        const data = loadNotes();
        data.notes = data.notes.filter(x => x.id !== id);
        persist(data); render();
    }
    else if (action === 'delete-task') {
        const data = loadNotes();
        data.tasks = data.tasks.filter(x => x.id !== id);
        persist(data); render();
    }
}

function onChange(e) {
    const el = e.target.closest('[data-action="toggle-task"]');
    if (el) {
        const data = loadNotes();
        const tk = data.tasks.find(x => x.id === el.dataset.id);
        if (tk) { tk.done = el.checked; persist(data); render(); }
    }
}

// Persist note title/body edits without a full re-render (keeps caret position).
function onInput(e) {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const action = el.dataset.action;
    if (action === 'edit-note-title' || action === 'edit-note-body') {
        const data = loadNotes();
        const n = data.notes.find(x => x.id === el.dataset.id);
        if (n) {
            if (action === 'edit-note-title') n.title = el.value;
            else n.body = el.value;
            n.updatedAt = nowISO();
            persist(data);
        }
    } else if (el.id === 'ntSearch') {
        searchQuery = el.value;
    }
}

function onKeydown(e) {
    if (e.key !== 'Enter') return;
    if (e.target.id === 'ntQuickNote') { e.preventDefault(); addNote(); }
    else if (e.target.id === 'ntQuickTask') { e.preventDefault(); addTask(); }
}

function init() {
    const root = container();
    if (!root) return;
    root.addEventListener('click', onClick);
    root.addEventListener('change', onChange);
    root.addEventListener('input', onInput);
    root.addEventListener('keydown', onKeydown);
}

registerViewInit('notes', init);
registerViewRefresh('notes', render);
