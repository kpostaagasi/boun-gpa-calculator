/**
 * BOUN GPA Calculator — Pure GPA Calculation Functions
 *
 * No DOM access — pure math extracted from calculateGPA and related functions in script.js.
 */
import { gradePoints, nonGPAGrades } from './grades.js';

// ============================================
// Semester GPA
// ============================================
/**
 * Mirrors the semester GPA branch of calculateGPA() in script.js.
 * Takes array of { grade, credits } objects. Returns GPA (0 if no credits).
 */
export function computeSemesterGPA(courses) {
    return computeSemesterStats(courses).gpa;
}

/** Returns the weighted semester totals, including credits for non-GPA grades. */
export function computeSemesterStats(courses) {
    let points = 0, gpaCredits = 0, totalCredits = 0;
    for (const c of courses) {
        const credits = Number(c.credits);
        const gp = gradePoints[c.grade];
        if (Number.isFinite(credits) && credits > 0 && c.grade) {
            totalCredits += credits;
            if (gp !== null && gp !== undefined) {
                points += gp * credits;
                gpaCredits += credits;
            }
        }
    }
    return { points, gpaCredits, totalCredits, gpa: gpaCredits > 0 ? points / gpaCredits : 0 };
}

// ============================================
// Cumulative GPA with Retake Logic
// ============================================
/**
 * Mirrors the cumulative GPA branch of calculateGPA() in script.js,
 * including the retake adjustment logic.
 *
 * retakes: [{ credits, oldGrade }]
 */
export function computeCumulativeGPA(semCourses, previousGPA, previousCredits, retakes) {
    return computeCumulativeStats(semCourses, previousGPA, previousCredits, retakes).gpa;
}

/** Returns cumulative totals after removing the previous contribution of retakes. */
export function computeCumulativeStats(semCourses, previousGPA, previousCredits, retakes = []) {
    const semester = computeSemesterStats(semCourses);
    let retakeCredits = 0, retakeOldPoints = 0;
    const prevCredits = Number(previousCredits);
    const safePrevCredits = Number.isFinite(prevCredits) ? Math.max(0, prevCredits) : 0;
    let remainingPreviousCredits = safePrevCredits;

    for (const r of retakes) {
        const credits = Number(r.credits);
        const oldGradePoints = gradePoints[r.oldGrade];
        // A malformed retake must not remove more of the baseline than exists.
        // In particular, cap the aggregate credits rather than clamping credits
        // and points independently (which can produce an impossible GPA).
        if (Number.isFinite(credits) && credits > 0 &&
            !nonGPAGrades.includes(r.oldGrade) && Number.isFinite(oldGradePoints)) {
            const appliedCredits = Math.min(credits, remainingPreviousCredits);
            retakeCredits += appliedCredits;
            retakeOldPoints += oldGradePoints * appliedCredits;
            remainingPreviousCredits -= appliedCredits;
        }
    }

    const prevGPAValue = Number(previousGPA);
    const prevGPA = Number.isFinite(prevGPAValue) ? Math.min(4, Math.max(0, prevGPAValue)) : 0;
    const prevPoints = prevGPA * safePrevCredits;
    const adjPrevCredits = safePrevCredits - retakeCredits;
    // Keep the adjusted baseline valid even when the supplied GPA and retake
    // records are mutually inconsistent.
    const adjPrevPoints = Math.min(adjPrevCredits * 4, Math.max(0, prevPoints - retakeOldPoints));
    const gpaCredits = semester.gpaCredits + adjPrevCredits;
    const totalPoints = semester.points + adjPrevPoints;
    const rawGPA = gpaCredits > 0 ? totalPoints / gpaCredits : 0;
    return {
        gpa: Math.min(4, Math.max(0, rawGPA)),
        gpaCredits,
        totalCredits: semester.totalCredits + adjPrevCredits,
        points: totalPoints,
        adjustedPreviousCredits: adjPrevCredits
    };
}

// ============================================
// Goal Requirement Calculator
// ============================================
/**
 * Mirrors the pure math of calculateGoal() in script.js.
 * requiredGPA = (targetGPA * (currentCredits + plannedCredits) - currentGPA * currentCredits) / plannedCredits
 */
export function calculateGoalRequirement(currentGPA, currentCredits, targetGPA, plannedCredits) {
    if (plannedCredits <= 0) return { valid: false, status: 'invalid', requiredGPA: null };
    if (targetGPA <= 0) return { valid: false, status: 'invalid', requiredGPA: null };

    const targetTotalPoints = targetGPA * (currentCredits + plannedCredits);
    const currentPoints = currentGPA * currentCredits;
    const requiredGPA = (targetTotalPoints - currentPoints) / plannedCredits;

    let status;
    if (requiredGPA > 4.0) status = 'impossible';
    else if (requiredGPA < 0) status = 'alreadyAchieved';
    else if (requiredGPA >= 3.5) status = 'difficult';
    else status = 'achievable';

    return { valid: true, status, requiredGPA };
}

// ============================================
// Achievement Condition Helpers
// ============================================
/**
 * Mirrors getTotalCourseCount() in script.js.
 * Takes state object with courses and semesters, returns total course count.
 */
export function getTotalCourseCount(s) {
    let count = s.courses.length;
    Object.values(s.semesters).forEach(sem => {
        count += sem.courses.length;
    });
    return count;
}

/**
 * Mirrors hasGrade() in script.js.
 * Takes state object and grade string, returns boolean.
 */
export function hasGrade(s, grade) {
    if (s.courses.some(c => c.grade === grade)) return true;
    return Object.values(s.semesters).some(sem => sem.courses.some(c => c.grade === grade));
}
