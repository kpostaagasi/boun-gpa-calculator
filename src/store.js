/**
 * BOUN GPA Calculator — Per-Module Storage Helper
 *
 * Each SuperApp module persists its own state under a namespaced key
 * ('bounGpa:<module>'), kept completely separate from the GPA calculator's
 * legacy 'gpaSaveData' blob. This mirrors the calculator's auto-save UX by
 * flashing the same indicator on every write.
 */
import { showAutoSaveIndicator } from './ui.js';
import { currentLanguage } from './i18n.js';

const PREFIX = 'bounGpa:';
// Retained solely to migrate data created by older releases.
const LEGACY_PREFIX = 'pusula:';

/**
 * Registry of every localStorage key the app owns. Modules push their namespaced
 * key here on load so "Clear all data" and the backup/restore envelope can find
 * them generically. 'gpaSaveData' (the legacy calculator key) is always present.
 */
export const APP_KEYS = ['gpaSaveData'];

export function registerAppKey(ns) {
    const key = PREFIX + ns;
    if (!APP_KEYS.includes(key)) APP_KEYS.push(key);
    return key;
}

/** Load a module's data object. Returns {} on missing/corrupt data (never throws). */
export function loadModule(ns) {
    try {
        const activeKey = PREFIX + ns;
        let raw = localStorage.getItem(activeKey);
        if (raw == null) {
            const legacyKey = LEGACY_PREFIX + ns;
            raw = localStorage.getItem(legacyKey);
            if (raw != null) {
                const migrated = JSON.parse(raw);
                localStorage.setItem(activeKey, JSON.stringify(migrated));
                localStorage.removeItem(legacyKey);
                return migrated || {};
            }
        }
        return JSON.parse(raw || '{}') || {};
    } catch {
        return {};
    }
}

/** Persist a module's data object and flash the shared auto-save indicator. */
export function saveModule(ns, obj) {
    try {
        localStorage.setItem(PREFIX + ns, JSON.stringify(obj));
        showAutoSaveIndicator();
        return true;
    } catch {
        return false;
    }
}

/** Pick the active-language string from a { tr, en } label object. */
export function pickLang(label) {
    if (label == null) return '';
    if (typeof label === 'string') return label;
    return label[currentLanguage] || label.tr || label.en || '';
}

/** Small id generator (no Date/Math.random dependency in tests; fine in-browser). */
export function uid() {
    return 'id-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 1e6).toString(36);
}
