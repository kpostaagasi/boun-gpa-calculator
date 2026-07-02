/**
 * BOUN Pusula — Campus Services Module
 *
 * Static, fully-offline campus launcher + reference rendered from
 * src/campus-seed.js (never fetched). Three sections: official BOUN links
 * (open in a new tab), ring/shuttle timetables with a client-computed
 * "next departure" vs the device clock, and tap-to-call emergency contacts.
 * Render-only; every section carries an "unofficial — verify" disclaimer.
 */
import { registerViewRefresh, t, currentLanguage } from './i18n.js';
import { pickLang } from './store.js';
import { escapeHtml } from './grades.js';
import { elements } from './state.js';
import { parseHM, nextDeparture } from './pusula-utils.js';
import seed from './campus-seed.js';

function container() { return elements.campusView || document.getElementById('campusView'); }

function linksMarkup() {
    const tiles = seed.links.map(l => `
        <a class="cm-link" href="${encodeURI(l.url)}" target="_blank" rel="noopener noreferrer">
            <span class="cm-link-name">${escapeHtml(pickLang(l.name))}</span>
            <span class="cm-link-arrow">↗</span>
        </a>`).join('');
    return `<div class="cm-links">${tiles}</div>`;
}

function transportMarkup() {
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const weekend = now.getDay() === 0 || now.getDay() === 6;
    const lines = [seed.transport.ring, seed.transport.shuttle].map(svc => {
        const times = weekend ? svc.weekend : svc.weekday;
        const nd = nextDeparture(times, nowMin);
        const nextLabel = nd
            ? `${nd.time}${nd.tomorrow ? ' (+1)' : ''}`
            : '—';
        return `
            <div class="cm-transport">
                <div class="cm-transport-head">
                    <span class="cm-transport-name">${escapeHtml(pickLang(svc.label))}</span>
                    <span class="cm-transport-next">${t('campus.nextDeparture')}: <strong>${nextLabel}</strong></span>
                </div>
                <div class="cm-times">${times.map(tm => {
                    const isNext = nd && !nd.tomorrow && tm === nd.time;
                    return `<span class="cm-time ${isNext ? 'cm-time-next' : ''}">${tm}</span>`;
                }).join('')}</div>
                <div class="cm-times-label">${weekend ? t('campus.weekend') : t('campus.weekday')}</div>
            </div>`;
    }).join('');
    return lines;
}

function contactsMarkup() {
    return `<div class="cm-contacts">${seed.contacts.map(c => `
        <a class="cm-contact" href="tel:${escapeHtml(c.tel)}">
            <span class="cm-contact-name">${escapeHtml(pickLang(c.name))}</span>
            <span class="cm-contact-tel">${escapeHtml(c.tel)} 📞</span>
        </a>`).join('')}</div>`;
}

function disclaimer() {
    return `<div class="cm-disclaimer">⚠ ${escapeHtml(pickLang(seed.sourceNote))} <em>(${t('campus.lastUpdated')}: ${seed.updatedAt})</em></div>`;
}

function render() {
    const root = container();
    if (!root) return;
    root.innerHTML = `
        <div class="card">
            <div class="card-header"><div><h2 class="card-title">${t('campus.title')}</h2>
                <p class="card-subtitle">${t('campus.desc')}</p></div></div>
            ${disclaimer()}
        </div>
        <div class="card">
            <div class="card-header"><h2 class="card-title">${t('campus.links')}</h2></div>
            ${linksMarkup()}
        </div>
        <div class="card">
            <div class="card-header"><h2 class="card-title">${t('campus.transport')}</h2></div>
            ${transportMarkup()}
        </div>
        <div class="card">
            <div class="card-header"><h2 class="card-title">${t('campus.contacts')}</h2></div>
            ${contactsMarkup()}
        </div>`;
}

registerViewRefresh('campus', render);
