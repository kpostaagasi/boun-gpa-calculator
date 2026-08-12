/**
 * BOUN Pusula — Course Registration Planner (pure math)
 *
 * No DOM access, no imports — safe to import directly from Node tests.
 *
 * Planned courses are { credits, point } objects where `point` is the
 * predicted grade point (number) or null for non-GPA grades (P). P courses
 * count toward the total credit load but NOT toward GPA, mirroring the
 * calculator's cumulative GPA model (see src/gpa.js).
 */

/** Total credits of planned courses (all count, including P / null-point). */
export function creditTotal(plannedCourses) {
    return (plannedCourses || []).reduce((sum, c) => sum + (Number(c.credits) || 0), 0);
}

/** Credits that contribute to GPA (excludes P / null-point courses). */
export function gpaCreditTotal(plannedCourses) {
    return (plannedCourses || []).reduce((sum, c) => {
        const p = c.point == null ? null : Number(c.point);
        return sum + (Number.isFinite(p) ? (Number(c.credits) || 0) : 0);
    }, 0);
}

/**
 * Projected cumulative GPA after completing plannedCourses on top of the
 * current cumulative GPA (currentGPA over currentCredits).
 *
 * Returns { gpa, credits } where credits is the post-plan GPA credit total.
 * gpa is 0 when there are no GPA credits at all.
 */
export function projectedGPA(currentGPA, currentCredits, plannedCourses) {
    const baseCredits = Number(currentCredits) || 0;
    let points = (Number(currentGPA) || 0) * baseCredits;
    let credits = baseCredits;
    (plannedCourses || []).forEach((c) => {
        const p = c.point == null ? null : Number(c.point);
        const cr = Number(c.credits) || 0;
        if (Number.isFinite(p)) {
            points += p * cr;
            credits += cr;
        }
    });
    return { gpa: credits > 0 ? points / credits : 0, credits };
}

/**
 * Average GPA required on the planned credits to reach targetGPA.
 * Same formula as calculateGoalRequirement() in src/gpa.js (kept DOM-free
 * here so Node tests can import it directly):
 *   required = (target · (currentCredits + plannedCredits) − currentGPA · currentCredits) / plannedCredits
 *
 * Returns null when plannedCredits is 0 (no plan to average over).
 * A negative result means the target is already met; > 4 means unreachable.
 */
export function requiredPlannedGPA(currentGPA, currentCredits, targetGPA, plannedCredits) {
    const cur = Number(currentGPA) || 0;
    const curCr = Number(currentCredits) || 0;
    const target = Number(targetGPA);
    const planCr = Number(plannedCredits) || 0;
    if (planCr <= 0 || !Number.isFinite(target)) return null;
    return (target * (curCr + planCr) - cur * curCr) / planCr;
}
