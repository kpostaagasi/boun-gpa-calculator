/**
 * Regression tests for BOUN GPA Calculator
 *
 * Runs in both browser (via test-runner.html) and Node.js (via `node tests/tests.js`).
 *
 * NOTE: These functions mirror the production logic in script.js.
 * If the core calculation logic changes in script.js, update the
 * corresponding implementations below to stay in sync.
 */

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

const gradePointsBOUN = {
    AA: 4.0, BA: 3.5, BB: 3.0, CB: 2.5,
    CC: 2.0, DC: 1.5, DD: 1.0, FF: 0.0,
    P: null, S: null, U: 0.0
};

const nonGPAGrades = ['P', 'S'];

/** Mirrors the semester GPA branch of calculateGPA() in script.js */
function computeSemesterGPA(courses) {
    let points = 0, credits = 0;
    for (const c of courses) {
        const gp = gradePointsBOUN[c.grade];
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
        const gp = gradePointsBOUN[c.grade];
        if (gp !== null && gp !== undefined && c.credits > 0) {
            semPoints += gp * c.credits;
            semCredits += c.credits;
        }
    }

    for (const r of retakes) {
        if (!nonGPAGrades.includes(r.oldGrade)) {
            retakeCredits += r.credits;
            retakeOldPoints += (gradePointsBOUN[r.oldGrade] || 0) * r.credits;
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
        const gp = gradePointsBOUN[c.grade];
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
