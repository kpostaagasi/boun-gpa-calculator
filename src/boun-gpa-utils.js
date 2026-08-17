/**
 * BOUN GPA Calculator — Pure Utilities (no DOM, no state imports)
 *
 * Time/date/scheduling math shared by the schedule, planner and home modules.
 * Kept dependency-free so it can be imported and unit-tested directly under Node
 * (unlike the DOM-coupled modules). All "now" inputs are passed in for testability.
 */

/** 'HH:MM' -> minutes since midnight. */
export function parseHM(hhmm) {
    const value = String(hhmm ?? '');
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return NaN;
    const [h, m] = value.split(':').map(Number);
    return h * 60 + m;
}

export function isValidScheduleBlock(block) {
    return block && Number.isInteger(block.day) && block.day >= 0 && block.day <= 6 &&
        Number.isFinite(parseHM(block.start)) && Number.isFinite(parseHM(block.end)) &&
        parseHM(block.end) > parseHM(block.start);
}

/** JS Date.getDay() (0=Sun..6=Sat) -> Monday-indexed (0=Mon..6=Sun). */
export function jsDayToMon(jsDay) {
    return (jsDay + 6) % 7;
}

/** Half-open interval overlap test. */
export function rangesOverlap(s1, e1, s2, e2) {
    return s1 < e2 && s2 < e1;
}

/** Two schedule blocks {day,start,end} overlap iff same day and times intersect. */
export function blocksOverlap(a, b) {
    if (!isValidScheduleBlock(a) || !isValidScheduleBlock(b) || a.day !== b.day) return false;
    return rangesOverlap(parseHM(a.start), parseHM(a.end), parseHM(b.start), parseHM(b.end));
}

/** True if any two blocks across all courses collide. courses: [{blocks:[...]}]. */
export function scheduleHasOverlap(courses) {
    const all = [];
    for (const c of courses || []) {
        for (const b of (c.blocks || [])) all.push(b);
    }
    for (let i = 0; i < all.length; i++) {
        for (let j = i + 1; j < all.length; j++) {
            if (blocksOverlap(all[i], all[j])) return true;
        }
    }
    return false;
}

/**
 * Next departure from a list of 'HH:MM' times relative to nowMinutes.
 * Returns { time, tomorrow } — tomorrow=true when it wraps past the last run.
 */
export function nextDeparture(times, nowMinutes) {
    if (!times || !times.length) return null;
    const sorted = [...times].sort();
    for (const t of sorted) {
        if (parseHM(t) >= nowMinutes) return { time: t, tomorrow: false };
    }
    return { time: sorted[0], tomorrow: true };
}

/** Urgency tier for a countdown: overdue/<2d -> danger, <=7d -> warning, else neutral. */
export function urgencyTier(ms) {
    if (ms < 0) return 'danger';
    const days = ms / 86400000;
    if (days < 2) return 'danger';
    if (days <= 7) return 'warning';
    return 'neutral';
}

/**
 * Countdown breakdown for a due date relative to `now` (a Date).
 * daysLeft/hoursLeft are signed (negative = overdue).
 */
export function countdownInfo(dueISO, now) {
    const dueDate = new Date(dueISO);
    if (!Number.isFinite(dueDate.getTime())) return { ms: NaN, overdue: false, daysLeft: 0, hoursLeft: 0, tier: 'neutral', invalid: true };
    const due = dueDate.getTime();
    const ms = due - now.getTime();
    return {
        ms,
        overdue: ms < 0,
        daysLeft: Math.floor(ms / 86400000),
        hoursLeft: Math.floor(ms / 3600000),
        tier: urgencyTier(ms),
        invalid: false
    };
}
