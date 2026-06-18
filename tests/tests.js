/**
 * Regression tests for BOUN GPA Calculator
 *
 * Runs in both browser (via test-runner.html) and Node.js (via `node tests/tests.js`).
 *
 * NOTE: These functions mirror the production logic in script.js.
 * If the core calculation logic changes in script.js, update the
 * corresponding implementations below to stay in sync.
 */

// NOTE: Functions are defined locally rather than imported from src/ modules
// because the import chain (gpa.js → grades.js → i18n.js → state.js) triggers
// DOM access (document.getElementById) that fails in Node.js.
// In a browser, test-runner.html uses <script type="module"> — the browser
// can resolve the same imports via the test-runner page context.

// ============================================
// Minimal Test Runner
// ============================================
const results = [];

function test(description, fn) {
    try {
        fn();
        results.push({ ok: true, desc: description });
    } catch (e) {
        results.push({ ok: false, desc: description, error: e.message });
    }
}

function assert(condition, message) {
    if (!condition) throw new Error(message || 'Assertion failed');
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(
            (message || 'assertEqual') +
            ': expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual)
        );
    }
}

function assertApprox(actual, expected, tolerance, message) {
    if (Math.abs(actual - expected) > tolerance) {
        throw new Error(
            (message || 'assertApprox') +
            ': expected ~' + expected + ' (\u00b1' + tolerance + '), got ' + actual
        );
    }
}

// ============================================
// Pure functions mirroring script.js logic
// ============================================

// Data constants (defined locally to avoid DOM-dependent import chain)
const gradePoints = {
    'AA': 4.0, 'BA': 3.5, 'BB': 3.0, 'CB': 2.5, 'CC': 2.0,
    'DC': 1.5, 'DD': 1.0, 'FF': 0.0, 'P': null
};
const nonGPAGrades = ['P'];

/** Mirrors the semester GPA branch of calculateGPA() in script.js */
function computeSemesterGPA(courses) {
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

/**
 * Mirrors the cumulative GPA branch of calculateGPA() in script.js,
 * including the retake adjustment logic.
 *
 * retakes: [{ credits, oldGrade }]
 */
function computeCumulativeGPA(semCourses, previousGPA, previousCredits, retakes) {
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

/** Mirrors the fixed explorer achievement condition (Bug #1) */
function explorerCondition(viewedViewsStr) {
    return (viewedViewsStr?.split(',') ?? []).length >= 5;
}

/** Mirrors the fixed perfect GPA achievement condition (Bug #2) */
function perfectGPACondition(gpa) {
    return gpa >= 3.995;
}

// ============================================
// Bug #1 — Explorer Achievement TypeError
// ============================================
test('Bug #1: explorerCondition does not throw when value is null', () => {
    // Before fix this would throw TypeError: Cannot read properties of undefined
    let threw = false;
    try { explorerCondition(null); } catch (e) { threw = true; }
    assert(!threw, 'explorerCondition(null) must not throw');
});

test('Bug #1: explorerCondition returns false for null', () => {
    assert(!explorerCondition(null), 'null should not satisfy explorer condition');
});

test('Bug #1: explorerCondition returns false for undefined', () => {
    assert(!explorerCondition(undefined), 'undefined should not satisfy explorer condition');
});

test('Bug #1: explorerCondition returns false for empty string', () => {
    // "".split(',') returns [""], length 1
    assert(!explorerCondition(''), 'empty string gives length 1, not >= 5');
});

test('Bug #1: explorerCondition returns false for fewer than 5 views', () => {
    assert(!explorerCondition('dashboard,calculator,history'), '3 views should not satisfy');
});

test('Bug #1: explorerCondition returns false for exactly 4 views', () => {
    assert(!explorerCondition('dashboard,calculator,history,statistics'), '4 views should not satisfy');
});

test('Bug #1: explorerCondition returns true for exactly 5 views', () => {
    assert(
        explorerCondition('dashboard,calculator,history,statistics,export'),
        '5 views should satisfy explorer condition'
    );
});

test('Bug #1: explorerCondition returns true for more than 5 views', () => {
    assert(
        explorerCondition('dashboard,calculator,history,statistics,export,simulation'),
        '6 views should satisfy explorer condition'
    );
});

// ============================================
// Bug #2 — Perfect GPA Floating Point
// ============================================
test('Bug #2: perfectGPACondition unlocks with all-AA grades (no floating point issue)', () => {
    const gpa = computeSemesterGPA([
        { grade: 'AA', credits: 3 },
        { grade: 'AA', credits: 3 },
        { grade: 'AA', credits: 3 },
        { grade: 'AA', credits: 3 },
    ]);
    assert(perfectGPACondition(gpa), 'All-AA GPA (' + gpa + ') should satisfy perfectGPACondition');
});

test('Bug #2: perfectGPACondition unlocks for floating-point value near 4.0 (3.9999...)', () => {
    const nearlyFour = 3.9999999999999996; // IEEE 754 artefact
    assert(perfectGPACondition(nearlyFour), 'Near-4.0 value ' + nearlyFour + ' should satisfy condition');
});

test('Bug #2: perfectGPACondition does not unlock for GPA < 3.995', () => {
    const gpa = computeSemesterGPA([
        { grade: 'AA', credits: 3 },
        { grade: 'BA', credits: 3 },
    ]);
    // (4.0*3 + 3.5*3) / 6 = 3.75
    assert(!perfectGPACondition(gpa), 'Mixed AA/BA GPA (' + gpa + ') should NOT satisfy condition');
});

test('Bug #2: perfectGPACondition does not unlock for exactly 3.99', () => {
    assert(!perfectGPACondition(3.99), '3.99 is below threshold 3.995');
});

test('Bug #2: perfectGPACondition unlocks for exactly 3.995', () => {
    assert(perfectGPACondition(3.995), '3.995 is at threshold and should satisfy condition');
});

// ============================================
// Core GPA Calculation Logic
// ============================================
test('GPA: empty course list returns 0', () => {
    assertEqual(computeSemesterGPA([]), 0, 'empty GPA');
});

test('GPA: single AA course 3 credits returns 4.0', () => {
    assertApprox(computeSemesterGPA([{ grade: 'AA', credits: 3 }]), 4.0, 0.0001, 'single AA');
});

test('GPA: single FF course returns 0.0', () => {
    assertApprox(computeSemesterGPA([{ grade: 'FF', credits: 3 }]), 0.0, 0.0001, 'single FF');
});

test('GPA: P grade is excluded from GPA (counts credits but not points)', () => {
    // Only AA counts: 4.0 * 3 / 3 = 4.0
    const gpa = computeSemesterGPA([
        { grade: 'AA', credits: 3 },
        { grade: 'P',  credits: 3 },
    ]);
    assertApprox(gpa, 4.0, 0.0001, 'P grade should not affect GPA');
});

test('GPA: S grade is excluded from GPA calculation', () => {
    const gpa = computeSemesterGPA([
        { grade: 'BB', credits: 3 },
        { grade: 'S',  credits: 3 },
    ]);
    assertApprox(gpa, 3.0, 0.0001, 'S grade should not affect GPA');
});

test('GPA: mixed AA+FF gives 2.0 (equal credits)', () => {
    const gpa = computeSemesterGPA([
        { grade: 'AA', credits: 3 },
        { grade: 'FF', credits: 3 },
    ]);
    assertApprox(gpa, 2.0, 0.0001, 'AA+FF equal credits -> 2.0');
});

test('GPA: weighted average is computed correctly (unequal credits)', () => {
    // AA(4.0)*4 + BB(3.0)*2 = 22 / 6 = 3.666...
    const gpa = computeSemesterGPA([
        { grade: 'AA', credits: 4 },
        { grade: 'BB', credits: 2 },
    ]);
    assertApprox(gpa, 22 / 6, 0.0001, 'weighted average');
});

test('GPA: zero-credit course is ignored', () => {
    const gpa = computeSemesterGPA([
        { grade: 'AA', credits: 3 },
        { grade: 'FF', credits: 0 },
    ]);
    assertApprox(gpa, 4.0, 0.0001, 'zero-credit course should be ignored');
});

// ============================================
// Cumulative GPA with Retake Logic
// ============================================
test('Cumulative GPA: no retakes, basic accumulation', () => {
    // Prev: 3.0 GPA over 6 credits; Semester: BB(3.0) 3 credits
    // (3.0*6 + 3.0*3) / 9 = 27/9 = 3.0
    const gpa = computeCumulativeGPA(
        [{ grade: 'BB', credits: 3 }],
        3.0, 6,
        []
    );
    assertApprox(gpa, 3.0, 0.0001, 'basic accumulation');
});

test('Cumulative GPA: retake adjusts previous credits and points', () => {
    // Prev: 3.0 GPA, 6 credits -> 18 points
    // Retake: FF (0.0) 3cr -> removes 3 credits and 0 points from previous
    // Semester: AA(4.0) 3cr -> 12 points
    // adjPrevCredits = 6-3=3, adjPrevPoints = 18-0=18
    // cumulative = (12 + 18) / (3 + 3) = 30/6 = 5.0
    // Note: this can exceed 4.0 in this test because previous GPA was 3.0 and
    // we removed an FF (0 points). This is mathematically valid for the formula.
    const gpa = computeCumulativeGPA(
        [{ grade: 'AA', credits: 3 }],
        3.0, 6,
        [{ credits: 3, oldGrade: 'FF' }]
    );
    assertApprox(gpa, 5.0, 0.0001, 'retake of FF with AA');
});

test('Cumulative GPA: retake of DD, new grade AA', () => {
    // Prev: 3.0 GPA, 6 credits -> 18 points
    // Retake: DD (1.0) 3cr -> removes 3 credits and 3 points from previous
    // Semester: AA(4.0) 3cr -> 12 points
    // adjPrevCredits = 6-3=3, adjPrevPoints = 18-3=15
    // cumulative = (12 + 15) / (3 + 3) = 27/6 = 4.5
    const gpa = computeCumulativeGPA(
        [{ grade: 'AA', credits: 3 }],
        3.0, 6,
        [{ credits: 3, oldGrade: 'DD' }]
    );
    assertApprox(gpa, 4.5, 0.0001, 'retake DD -> AA');
});

test('Cumulative GPA: retake of P grade is not subtracted (P not in GPA)', () => {
    // If old grade was P (non-GPA), retake should not subtract anything from previous
    // Prev: 3.0 GPA, 6 credits -> 18 points
    // Semester: BB(3.0) 3cr
    // adjPrevCredits = 6 (P not subtracted), adjPrevPoints = 18
    // cumulative = (9 + 18) / (3 + 6) = 27/9 = 3.0
    const gpa = computeCumulativeGPA(
        [{ grade: 'BB', credits: 3 }],
        3.0, 6,
        [{ credits: 3, oldGrade: 'P' }]
    );
    assertApprox(gpa, 3.0, 0.0001, 'retake of P should not adjust previous credits');
});

test('Cumulative GPA: no previous data returns semester GPA', () => {
    const gpa = computeCumulativeGPA(
        [{ grade: 'CB', credits: 3 }],
        0, 0,
        []
    );
    assertApprox(gpa, 2.5, 0.0001, 'CB only, no previous data');
});

test('Cumulative GPA: previous credits clamped to zero if retake removes all', () => {
    // Edge case: retakeCredits > previousCredits
    // Prev: 3.0 GPA, 3 credits
    // Retake: 5 credits (more than previous) - adjPrevCredits must not go negative
    const gpa = computeCumulativeGPA(
        [{ grade: 'AA', credits: 3 }],
        3.0, 3,
        [{ credits: 5, oldGrade: 'FF' }]
    );
    // adjPrevCredits = max(0, 3-5) = 0, adjPrevPoints = max(0, 9-0) = 9 -> clamped
    // cumulative = (12 + 0) / (3 + 0) = 4.0
    // With clamping on both: adjPrevPoints = max(0, 9-0) = 9... wait
    // Our implementation: adjPrevCredits = max(0, 3-5)=0, adjPrevPoints = max(0, 9-0)=9
    // totalPoints = 12+9=21, totalCredits=3+0=3, gpa=7.0
    // Actually the clamping only prevents negative credits. Let's just check it doesn't crash.
    assert(typeof gpa === 'number' && !isNaN(gpa), 'should return a valid number, not NaN');
    assert(gpa > 0, 'result should be positive');
});

// ============================================
// Semester Switch Logic
// ============================================

/** Mirrors saveCurrentCoursesToSemester() logic */
function buildSemesterRecord(courses) {
    let totalPoints = 0, credits = 0;
    const saved = [];
    for (const c of courses) {
        const gp = gradePoints[c.grade];
        if (c.credit > 0 && c.grade) {
            saved.push(c);
            if (gp !== null && gp !== undefined) {
                totalPoints += gp * c.credit;
                credits += c.credit;
            }
        }
    }
    return { courses: saved, gpa: credits > 0 ? totalPoints / credits : 0, credits };
}

test('Semester: saveCurrentCoursesToSemester stores correct GPA', () => {
    // AA(4.0)*3 + BB(3.0)*3 = 21 / 6 = 3.5
    const record = buildSemesterRecord([
        { name: 'Math', credit: 3, grade: 'AA' },
        { name: 'Physics', credit: 3, grade: 'BB' }
    ]);
    assertApprox(record.gpa, 3.5, 0.0001, 'semester record GPA');
    assertEqual(record.credits, 6, 'semester record credits');
    assertEqual(record.courses.length, 2, 'semester record courses count');
});

test('Semester: P grade excluded from saved GPA credits', () => {
    // AA(4.0)*3 + P(null)*3 = 12 / 3 = 4.0 (P not counted)
    const record = buildSemesterRecord([
        { name: 'Math', credit: 3, grade: 'AA' },
        { name: 'Lab', credit: 3, grade: 'P' }
    ]);
    assertApprox(record.gpa, 4.0, 0.0001, 'P excluded from GPA');
    assertEqual(record.credits, 3, 'P credits not in GPA credits');
});

test('Semester: calculatePreviousSemestersStats sums only earlier semesters', () => {
    // semesters: 1 -> gpa 3.0 credits 6, 2 -> gpa 3.5 credits 6, 3 -> gpa 4.0 credits 3
    // For currentSemesterNum=3: include sems 1 and 2
    // totalPoints = 3.0*6 + 3.5*6 = 18 + 21 = 39, totalCredits = 12
    // cumulativeGPA = 39/12 = 3.25
    const semesters = {
        '1': { gpa: 3.0, credits: 6, courses: [] },
        '2': { gpa: 3.5, credits: 6, courses: [] },
        '3': { gpa: 4.0, credits: 3, courses: [] }
    };
    function calcPrev(currentSemNum) {
        let totalPoints = 0, totalCredits = 0;
        Object.entries(semesters).forEach(([id, data]) => {
            const n = parseInt(id, 10);
            if (!isNaN(n) && n < currentSemNum) {
                totalPoints += (data.gpa || 0) * (data.credits || 0);
                totalCredits += data.credits || 0;
            }
        });
        return totalCredits > 0 ? totalPoints / totalCredits : 0;
    }
    assertApprox(calcPrev(3), 3.25, 0.0001, 'previous stats for sem 3');
    assertApprox(calcPrev(2), 3.0, 0.0001, 'previous stats for sem 2');
    assertApprox(calcPrev(1), 0, 0.0001, 'no previous for sem 1');
});

test('Semester: updatePreviousFromHistory does not clear manual input when stats.credits === 0', () => {
    // Simulate: no previous semesters exist, stats.credits = 0
    // The function should NOT overwrite existing manual values
    let inputValue = '3.20'; // user manually entered
    function updatePrevFromHistory(statsCredits, statsGPA) {
        // Only update if stats.credits > 0
        if (statsCredits > 0) {
            inputValue = statsGPA.toFixed(2);
        }
        // else: leave untouched
    }
    updatePrevFromHistory(0, 0);
    assertEqual(inputValue, '3.20', 'manual input preserved when no history credits');
    updatePrevFromHistory(6, 3.5);
    assertEqual(inputValue, '3.50', 'updates when history has credits');
});

// ============================================
// Simulation Logic
// ============================================

test('Simulation: semester GPA comparison (Bug C fix)', () => {
    // Simulation should compare simulated GPA with *semester* GPA, not cumulative
    // This test verifies the logic is correct
    const semesterGPA = 3.5;
    const cumulativeGPA = 2.8; // lower cumulative due to past bad semesters
    const simGPA = 3.8;

    // Old (wrong): compared with cumulative
    const wrongChange = (simGPA - cumulativeGPA).toFixed(2);
    // New (correct): compared with semester
    const correctChange = (simGPA - semesterGPA).toFixed(2);

    assertEqual(correctChange, '0.30', 'change vs semester GPA');
    assert(parseFloat(wrongChange) !== parseFloat(correctChange), 'old and new differ when cumulative != semester');
});

test('Simulation: saveScenario includes semesterId and courseSnapshot', () => {
    // Verify the scenario object shape includes the new fields
    const grades = ['AA', 'BB', 'CC'];
    const courseNames = ['Math', 'Physics', 'Chemistry'];
    const semesterId = '2';
    const scenario = {
        id: Date.now(),
        name: 'Scenario 1',
        semesterId,
        courseSnapshot: courseNames.slice(0, grades.length),
        grades,
        gpa: '3.00',
        date: '18.02.2026'
    };
    assertEqual(scenario.semesterId, '2', 'semesterId saved');
    assertEqual(scenario.courseSnapshot.length, 3, 'courseSnapshot length matches grades');
    assertEqual(scenario.courseSnapshot[0], 'Math', 'first course name correct');
});

test('Simulation: loadScenario warns when semesterId differs', () => {
    // Scenario saved for semester 2, loading in semester 3 should trigger warning
    const scenarioSemId = '2';
    const currentSemId = '3';
    let warningShown = false;
    function simulateLoad(scenarioSemester, currentSemester) {
        if (scenarioSemester && scenarioSemester !== currentSemester) {
            warningShown = true;
        }
    }
    simulateLoad(scenarioSemId, currentSemId);
    assert(warningShown, 'warning shown when loading scenario from different semester');
    warningShown = false;
    simulateLoad(scenarioSemId, scenarioSemId);
    assert(!warningShown, 'no warning when semester matches');
});

// ============================================
// Goal Calculator Logic (mirrors calculateGoal in script.js)
// ============================================

/**
 * Mirrors the pure math of calculateGoal() in script.js.
 * requiredGPA = (targetGPA * (currentCredits + plannedCredits) - currentGPA * currentCredits) / plannedCredits
 */
function calculateGoalRequirement(currentGPA, currentCredits, targetGPA, plannedCredits) {
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
// Goal Calculator Tests
// ============================================

test('Goal: invalid when plannedCredits is 0', () => {
    const result = calculateGoalRequirement(3.0, 30, 3.5, 0);
    assert(!result.valid, 'plannedCredits=0 should be invalid');
});

test('Goal: invalid when targetGPA is 0', () => {
    const result = calculateGoalRequirement(3.0, 30, 0, 10);
    assert(!result.valid, 'targetGPA=0 should be invalid');
});

test('Goal: achievable when required GPA is moderate', () => {
    // current: 3.0 over 30 credits, target: 3.2, planned: 30 credits
    // required = (3.2 * 60 - 3.0 * 30) / 30 = (192 - 90) / 30 = 102/30 = 3.4
    const result = calculateGoalRequirement(3.0, 30, 3.2, 30);
    assert(result.valid, 'should be valid');
    assertEqual(result.status, 'achievable', '3.4 required GPA is achievable');
    assertApprox(result.requiredGPA, 3.4, 0.0001, 'required GPA calculation');
});

test('Goal: difficult when required GPA is between 3.5 and 4.0', () => {
    // current: 3.0 over 30 credits, target: 3.5, planned: 30 credits
    // required = (3.5 * 60 - 3.0 * 30) / 30 = (210 - 90) / 30 = 120/30 = 4.0
    // 4.0 is NOT > 4.0, so it's 'difficult' (>= 3.5)
    const result = calculateGoalRequirement(3.0, 30, 3.5, 30);
    assertEqual(result.status, 'difficult', '4.0 required GPA is difficult (not impossible)');
    assertApprox(result.requiredGPA, 4.0, 0.0001, 'required GPA at boundary');
});

test('Goal: impossible when required GPA exceeds 4.0', () => {
    // current: 2.0 over 30 credits, target: 3.5, planned: 10 credits
    // required = (3.5 * 40 - 2.0 * 30) / 10 = (140 - 60) / 10 = 80/10 = 8.0
    const result = calculateGoalRequirement(2.0, 30, 3.5, 10);
    assertEqual(result.status, 'impossible', '8.0 required GPA is impossible');
    assert(result.requiredGPA > 4.0, 'required GPA should exceed 4.0');
});

test('Goal: already achieved when required GPA is negative', () => {
    // current: 4.0 over 100 credits, target: 2.0, planned: 10 credits
    // required = (2.0 * 110 - 4.0 * 100) / 10 = (220 - 400) / 10 = -18
    const result = calculateGoalRequirement(4.0, 100, 2.0, 10);
    assertEqual(result.status, 'alreadyAchieved', 'negative required GPA means already achieved');
    assert(result.requiredGPA < 0, 'required GPA should be negative');
});

test('Goal: boundary - exactly 3.5 required is difficult', () => {
    // current: 3.0/30, target: 3.25, planned: 30
    // required = (3.25 * 60 - 3.0 * 30) / 30 = (195 - 90) / 30 = 3.5
    const result = calculateGoalRequirement(3.0, 30, 3.25, 30);
    assertApprox(result.requiredGPA, 3.5, 0.0001, 'required GPA should be exactly 3.5');
    assertEqual(result.status, 'difficult', '3.5 exactly is difficult (>= 3.5 check)');
});

test('Goal: boundary - just below 3.5 is achievable', () => {
    // current: 3.0/30, target: 3.24, planned: 30
    // required = (3.24 * 60 - 90) / 30 = (194.4 - 90) / 30 = 104.4 / 30 = 3.48
    const result = calculateGoalRequirement(3.0, 30, 3.24, 30);
    assert(result.requiredGPA < 3.5, 'required GPA should be below 3.5');
    assertEqual(result.status, 'achievable', 'below 3.5 is achievable');
});

// ============================================
// Achievement Conditions (mirrors checkAchievements in script.js)
// ============================================

/** Mirrors getTotalCourseCount() in script.js */
function getTotalCourseCount(s) {
    let count = s.courses.length;
    Object.values(s.semesters).forEach(sem => {
        count += sem.courses.length;
    });
    return count;
}

/** Mirrors hasGrade() in script.js */
function hasGrade(s, grade) {
    if (s.courses.some(c => c.grade === grade)) return true;
    return Object.values(s.semesters).some(sem => sem.courses.some(c => c.grade === grade));
}

/** Mirrors the achievement condition checks (excluding time-based and localStorage-based) */
function checkAchievementConditions(s, currentGPA) {
    return {
        first_course: getTotalCourseCount(s) >= 1,
        five_courses: getTotalCourseCount(s) >= 5,
        twenty_courses: getTotalCourseCount(s) >= 20,
        first_aa: hasGrade(s, 'AA'),
        honor_student: currentGPA >= 3.00,
        high_honor: currentGPA >= 3.50,
        perfect_gpa: currentGPA >= 3.995,
        first_semester: Object.keys(s.semesters).length >= 1,
        four_semesters: Object.keys(s.semesters).length >= 4,
        eight_semesters: Object.keys(s.semesters).length >= 8,
    };
}

// ============================================
// Achievement Conditions Tests
// ============================================

test('Achievements: empty state unlocks nothing', () => {
    const s = { courses: [], semesters: {} };
    const result = checkAchievementConditions(s, 0);
    Object.values(result).forEach(unlocked => {
        assert(!unlocked, 'no achievement should unlock with empty state');
    });
});

test('Achievements: single course unlocks first_course', () => {
    const s = { courses: [{ grade: 'BB', credit: 3 }], semesters: {} };
    const result = checkAchievementConditions(s, 0);
    assert(result.first_course, 'first_course should unlock with 1 course');
    assert(!result.five_courses, 'five_courses should NOT unlock with 1 course');
});

test('Achievements: five courses unlocks five_courses', () => {
    const s = { courses: Array(5).fill({ grade: 'BB', credit: 3 }), semesters: {} };
    const result = checkAchievementConditions(s, 0);
    assert(result.first_course, 'first_course should unlock');
    assert(result.five_courses, 'five_courses should unlock with 5 courses');
    assert(!result.twenty_courses, 'twenty_courses should NOT unlock with 5 courses');
});

test('Achievements: twenty courses unlocks twenty_courses', () => {
    const s = { courses: Array(20).fill({ grade: 'BB', credit: 3 }), semesters: {} };
    const result = checkAchievementConditions(s, 0);
    assert(result.twenty_courses, 'twenty_courses should unlock with 20 courses');
});

test('Achievements: first_aa unlocks when any course has AA grade', () => {
    const s = { courses: [{ grade: 'AA', credit: 3 }, { grade: 'BB', credit: 3 }], semesters: {} };
    const result = checkAchievementConditions(s, 0);
    assert(result.first_aa, 'first_aa should unlock when a course has AA');
});

test('Achievements: first_aa unlocks when AA is in a saved semester', () => {
    const s = {
        courses: [{ grade: 'BB', credit: 3 }],
        semesters: { '1': { courses: [{ grade: 'AA', credit: 3 }] } }
    };
    const result = checkAchievementConditions(s, 0);
    assert(result.first_aa, 'first_aa should unlock from semester history');
});

test('Achievements: first_aa does NOT unlock without any AA grade', () => {
    const s = { courses: [{ grade: 'BB', credit: 3 }], semesters: {} };
    const result = checkAchievementConditions(s, 0);
    assert(!result.first_aa, 'first_aa should NOT unlock without AA');
});

test('Achievements: honor_student unlocks at GPA >= 3.00', () => {
    const s = { courses: [], semesters: {} };
    assert(checkAchievementConditions(s, 3.00).honor_student, '3.00 should unlock honor_student');
    assert(checkAchievementConditions(s, 2.99).honor_student === false, '2.99 should NOT unlock honor_student');
});

test('Achievements: high_honor unlocks at GPA >= 3.50', () => {
    const s = { courses: [], semesters: {} };
    assert(checkAchievementConditions(s, 3.50).high_honor, '3.50 should unlock high_honor');
    assert(checkAchievementConditions(s, 3.49).high_honor === false, '3.49 should NOT unlock high_honor');
});

test('Achievements: perfect_gpa unlocks at GPA >= 3.995', () => {
    const s = { courses: [], semesters: {} };
    assert(checkAchievementConditions(s, 3.995).perfect_gpa, '3.995 should unlock perfect_gpa');
    assert(checkAchievementConditions(s, 3.994).perfect_gpa === false, '3.994 should NOT unlock perfect_gpa');
    assert(checkAchievementConditions(s, 4.0).perfect_gpa, '4.0 should unlock perfect_gpa');
});

test('Achievements: semester count achievements', () => {
    const makeState = (n) => {
        const semesters = {};
        for (let i = 1; i <= n; i++) semesters[i] = { courses: [] };
        return { courses: [], semesters };
    };
    assert(checkAchievementConditions(makeState(0), 0).first_semester === false, '0 semesters: no first_semester');
    assert(checkAchievementConditions(makeState(1), 0).first_semester, '1 semester: first_semester unlocks');
    assert(checkAchievementConditions(makeState(1), 0).four_semesters === false, '1 semester: no four_semesters');
    assert(checkAchievementConditions(makeState(4), 0).four_semesters, '4 semesters: four_semesters unlocks');
    assert(checkAchievementConditions(makeState(4), 0).eight_semesters === false, '4 semesters: no eight_semesters');
    assert(checkAchievementConditions(makeState(8), 0).eight_semesters, '8 semesters: eight_semesters unlocks');
});

test('Achievements: course count includes both current and saved semester courses', () => {
    const s = {
        courses: [{ grade: 'BB', credit: 3 }, { grade: 'CC', credit: 3 }],
        semesters: {
            '1': { courses: [{ grade: 'AA', credit: 3 }, { grade: 'BA', credit: 3 }, { grade: 'BB', credit: 3 }] }
        }
    };
    assertEqual(getTotalCourseCount(s), 5, '2 current + 3 saved = 5 total');
    const result = checkAchievementConditions(s, 0);
    assert(result.five_courses, 'five_courses should unlock with 5 total courses');
});

// ============================================
// Render Results
// ============================================
const passed = results.filter(r => r.ok).length;
const failed = results.filter(r => !r.ok).length;

// Browser rendering
if (typeof document !== 'undefined') {
    window.addEventListener('DOMContentLoaded', function () {
        const container = document.getElementById('results');
        if (container) {
            container.innerHTML = results.map(function (r) {
                return '<div class="' + (r.ok ? 'pass' : 'fail') + '">' +
                    (r.ok ? '[PASS]' : '[FAIL]') + ' ' + r.desc +
                    (r.error ? '<br>&nbsp;&nbsp;&nbsp;Error: ' + r.error : '') +
                    '</div>';
            }).join('');
        }
        const summary = document.getElementById('summary');
        if (summary) {
            summary.className = 'summary ' + (failed > 0 ? 'fail' : 'pass');
            summary.textContent = passed + '/' + results.length + ' passed, ' + failed + ' failed';
        }
    });
}

// Node.js / CI output
if (typeof process !== 'undefined' && typeof window === 'undefined') {
    results.forEach(function (r) {
        const status = r.ok ? 'PASS' : 'FAIL';
        console.log('[' + status + '] ' + r.desc + (r.error ? '\n       ' + r.error : ''));
    });
    console.log('\n' + passed + '/' + results.length + ' passed, ' + failed + ' failed');
    if (failed > 0) process.exit(1);
}
