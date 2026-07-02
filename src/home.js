/**
 * BOUN Pusula — Home Hub ("Bugün" / "Today")
 *
 * The default landing view and the product's center of gravity: a daily-glance
 * hub, not a static report. renderHome() is a read-only projection over the other
 * modules (schedule/planner/notes via their loaders), state.lastCalculated* and
 * the campus transport seed, recomputed against the device clock on every entry
 * and on the shell's 60s tick. Home owns no module data; its ONLY write is the
 * inline "due soon" complete-checkbox, which toggles a planner item.
 */
import { registerViewInit, switchView } from './ui.js';
import { registerViewRefresh, t } from './i18n.js';
import { loadModule, saveModule, pickLang } from './store.js';
import { escapeHtml } from './grades.js';
import { state, elements } from './state.js';
import { parseHM, nextDeparture, jsDayToMon, countdownInfo } from './pusula-utils.js';
import { loadSchedule } from './schedule.js';
import { loadPlanner, badgeFor } from './planner.js';
import { loadNotes } from './notes.js';
import seed from './campus-seed.js';

function container() { return elements.homeView || document.getElementById('homeView'); }

function greetingKey(h) {
    if (h < 6) return 'home.greetingNight';
    if (h < 12) return 'home.greetingMorning';
    if (h < 18) return 'home.greetingAfternoon';
    return 'home.greetingEvening';
}

function greetingMarkup(now) {
    const dateStr = now.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
    // Nearest upcoming academic-calendar event
    const todayMid = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const upcoming = (seed.academicCalendar || [])
        .map(e => ({ e, ms: new Date(e.dateISO).getTime() - todayMid }))
        .filter(x => x.ms >= 0)
        .sort((a, b) => a.ms - b.ms)[0];
    const term = upcoming
        ? `<span class="hm-term">${escapeHtml(pickLang(upcoming.e.label))} · ${t('home.daysLeft', { n: Math.round(upcoming.ms / 86400000) })}</span>`
        : '';
    return `
        <div class="hm-greeting">
            <h2 class="hm-greeting-text">${t(greetingKey(now.getHours()))} 👋</h2>
            <p class="hm-date">${escapeHtml(dateStr)} ${term}</p>
        </div>`;
}

function todayClassesMarkup(now) {
    const data = loadSchedule();
    const today = jsDayToMon(now.getDay());
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const items = [];
    data.courses.forEach(c => (c.blocks || []).forEach(b => {
        if (b.day === today) items.push({ c, b, start: parseHM(b.start), end: parseHM(b.end) });
    }));
    items.sort((a, b) => a.start - b.start);

    let body;
    if (!items.length) {
        body = `<div class="empty-state hm-empty"><p class="empty-state-desc">${t('home.noClassesToday')}</p>
            <button type="button" class="btn btn-secondary btn-sm" data-action="launch" data-target="schedule">${t('home.noClassesTodayCta')}</button></div>`;
    } else {
        const nextUp = items.find(i => i.start > nowMin);
        body = items.map(i => {
            const current = nowMin >= i.start && nowMin < i.end;
            const isNext = nextUp && i === nextUp;
            const chip = current ? `<span class="hm-chip hm-chip-now">${t('home.now')}</span>`
                : isNext ? `<span class="hm-chip">${t('home.startsIn', { n: i.start - nowMin })}</span>` : '';
            return `
                <div class="hm-class ${current ? 'hm-class-now' : ''}">
                    <span class="hm-class-time">${i.b.start}</span>
                    <span class="hm-class-name">${escapeHtml(i.c.code || i.c.name || '—')}</span>
                    <span class="hm-class-loc">${escapeHtml(i.c.location || '')}</span>
                    ${chip}
                </div>`;
        }).join('');
    }
    return widget(t('home.todayClasses'), body, 'schedule');
}

function nextDeadlineMarkup(now) {
    const open = loadPlanner().items.filter(i => !i.done && i.dueISO);
    open.sort((a, b) => new Date(a.dueISO).getTime() - new Date(b.dueISO).getTime());
    const next = open[0];
    let body;
    if (!next) {
        body = `<div class="empty-state hm-empty"><p class="empty-state-desc">${t('home.noDeadlines')}</p>
            <button type="button" class="btn btn-secondary btn-sm" data-action="launch" data-target="planner">${t('home.addDeadlineCta')}</button></div>`;
    } else {
        const b = badgeFor(next, now);
        body = `<div class="hm-deadline">
            <div class="hm-deadline-title">${escapeHtml(next.title)}</div>
            <div class="hm-deadline-meta">${escapeHtml(next.course || '')}</div>
            <div class="hm-deadline-badge ${b.tier}">${b.text}</div>
        </div>`;
    }
    return widget(t('home.nextDeadline'), body, 'planner');
}

function dueSoonMarkup(now) {
    const open = loadPlanner().items.filter(i => !i.done && i.dueISO);
    open.sort((a, b) => new Date(a.dueISO).getTime() - new Date(b.dueISO).getTime());
    const top = open.slice(0, 3);
    let body;
    if (!top.length) {
        body = `<p class="empty-message">${t('home.noDueSoon')}</p>`;
    } else {
        body = top.map(i => {
            const b = badgeFor(i, now);
            return `<div class="hm-due">
                <input type="checkbox" data-action="home-toggle-done" data-id="${i.id}" aria-label="${t('planner.markDone')}">
                <span class="hm-due-title">${escapeHtml(i.title)}</span>
                <span class="hm-due-badge ${b.tier}">${b.text}</span>
            </div>`;
        }).join('');
    }
    return widget(t('home.dueSoon'), body, 'planner');
}

function nextRingMarkup(now) {
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const weekend = now.getDay() === 0 || now.getDay() === 6;
    const body = [seed.transport.ring, seed.transport.shuttle].map(svc => {
        const nd = nextDeparture(weekend ? svc.weekend : svc.weekday, nowMin);
        return `<div class="hm-ring">
            <span class="hm-ring-name">${escapeHtml(pickLang(svc.label))}</span>
            <span class="hm-ring-time">${nd ? nd.time + (nd.tomorrow ? ' (+1)' : '') : '—'}</span>
        </div>`;
    }).join('');
    return widget(t('home.nextRing'), body, 'campus');
}

function gpaSnapshotMarkup() {
    const gpa = (state.lastCalculatedGPA || 0).toFixed(2);
    const sem = (state.lastCalculatedSemesterGPA || 0).toFixed(2);
    const credits = state.lastCalculatedTotalCredits || 0;
    const cards = [
        { v: gpa, l: t('dashboard.gpa'), cls: 'primary' },
        { v: sem, l: t('dashboard.semesterGpa'), cls: 'success' },
        { v: credits, l: t('dashboard.totalCredits'), cls: 'warning' }
    ].map(c => `
        <div class="stat-card" data-action="launch" data-target="calculator" role="button" tabindex="0">
            <div class="stat-card-value">${c.v}</div>
            <div class="stat-card-label">${c.l}</div>
        </div>`).join('');
    return widget(t('home.gpaSnapshot'), `<div class="stats-grid">${cards}</div>`, 'calculator');
}

function launcherMarkup() {
    const mods = [
        { k: 'schedule', icon: '🗓️' }, { k: 'planner', icon: '⏰' }, { k: 'notes', icon: '📝' },
        { k: 'calculator', icon: '🧮' }, { k: 'campus', icon: '📍' }, { k: 'gradeGuide', icon: '📖' }
    ];
    const tiles = mods.map(m => `
        <button type="button" class="hm-tile" data-action="launch" data-target="${m.k}">
            <span class="hm-tile-icon">${m.icon}</span>
            <span class="hm-tile-name">${t('nav.' + m.k)}</span>
        </button>`).join('');
    return `<div class="card"><div class="card-header"><h2 class="card-title">${t('home.launcher')}</h2></div>
        <div class="hm-tiles">${tiles}</div></div>`;
}

function widget(title, bodyHtml, target) {
    return `<div class="card hm-widget">
        <div class="card-header"><h2 class="card-title">${title}</h2>
            <button type="button" class="btn-ghost btn-sm" data-action="launch" data-target="${target}">→</button></div>
        ${bodyHtml}</div>`;
}

function render() {
    const root = container();
    if (!root) return;
    const now = new Date();
    root.innerHTML = `
        ${greetingMarkup(now)}
        ${todayClassesMarkup(now)}
        <div class="hm-row">
            ${nextDeadlineMarkup(now)}
            ${dueSoonMarkup(now)}
        </div>
        <div class="hm-row">
            ${nextRingMarkup(now)}
            ${gpaSnapshotMarkup()}
        </div>
        ${launcherMarkup()}`;
}

function onClick(e) {
    const el = e.target.closest('[data-action="launch"]');
    if (el && container().contains(el)) { switchView(el.dataset.target); }
}

function onChange(e) {
    const el = e.target.closest('[data-action="home-toggle-done"]');
    if (!el) return;
    const data = loadModule('planner');
    const items = Array.isArray(data.items) ? data.items : [];
    const item = items.find(i => i.id === el.dataset.id);
    if (item) { item.done = el.checked; saveModule('planner', { items }); render(); }
}

function init() {
    const root = container();
    if (!root) return;
    root.addEventListener('click', onClick);
    root.addEventListener('change', onChange);
    root.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('[data-action="launch"]')) {
            e.preventDefault(); e.target.closest('[data-action="launch"]').click();
        }
    });
}

export function renderHome() { render(); }

registerViewInit('home', init);
registerViewRefresh('home', render);
