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
    let points = 0, credits = 0;
    for (const c of courses) {
        const gp = gradePoints[c.grade];
        if (gp !== null && gp !== undefined && c.credits > 0) {
            points += gp * c.credits;
            credits += c.credits;
        }
    }
    return credits > 0 ? points / credits : 0;
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
    let semPoints = 0, semCredits = 0;
    let retakeCredits = 0, retakeOldPoints = 0;

    for (const c of semCourses) {
        const gp = gradePoints[c.grade];
        if (gp !== null && gp !== undefined && c.credits > 0) {
            semPoints += gp * c.credits;
            semCredits += c.credits;
        }
    }

    for (const r of retakes) {
        if (!nonGPAGrades.includes(r.oldGrade)) {
            retakeCredits += r.credits;
            retakeOldPoints += (gradePoints[r.oldGrade] || 0) * r.credits;
        }
    }

    const prevPoints = previousGPA * previousCredits;
    const adjPrevCredits = Math.max(0, previousCredits - retakeCredits);
    const adjPrevPoints = Math.max(0, prevPoints - retakeOldPoints);
    const totalCredits = semCredits + adjPrevCredits;
    const totalPoints = semPoints + adjPrevPoints;
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
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
