/**
 * BOUN Pusula — Final Grade Calculator (pure math)
 *
 * No DOM access, no imports — safe to import directly from Node tests
 * (same pattern as src/pusula-utils.js).
 *
 * Model: a course grade is the weighted sum of component scores. Each
 * component weight is a fraction of the total (e.g. 0.3 = 30%), and scores
 * are on the 0–100 scale.
 *   total = Σ(weight_i · score_i) + weight_final · score_final
 */

/**
 * BOUN letter-grade score thresholds on the 0–100 course scale (absolute
 * grading, the standard BOUN convention). The target letter grade maps to the
 * minimum course score that earns it; the required-final math operates on this
 * scale — never on the 0–4 GPA point scale.
 */
export const scoreThresholds = {
    AA: 90, BA: 85, BB: 75, CB: 65, CC: 55, DC: 45, DD: 35, FF: 0
};

/**
 * Weighted sum of the completed components: Σ weight·score.
 * Non-numeric or missing weights/scores contribute 0.
 */
export function computeCurrentPoints(components) {
    return (components || []).reduce((sum, c) => {
        const w = Number(c.weight);
        const s = Number(c.score);
        return sum + (Number.isFinite(w) && Number.isFinite(s) ? w * s : 0);
    }, 0);
}

/**
 * Validate that the completed components and final account for the whole
 * course. We use fractional weights here (0.3 = 30%), like the other pure
 * math helpers in this module.
 */
export function validateWeightTotal(components, finalWeight, tolerance = 0.0001) {
    const componentWeights = (components || []).map(c => Number(c.weight));
    const final = Number(finalWeight);
    if (!Number.isFinite(final) || final < 0 || !componentWeights.every(w => Number.isFinite(w) && w >= 0)) {
        return { valid: false, total: NaN };
    }
    const total = componentWeights.reduce((sum, weight) => sum + weight, 0) + final;
    return { valid: Math.abs(total - 1) <= tolerance, total };
}

/**
 * Required score on the final component (0–100 scale) to reach targetScore
 * (also 0–100, e.g. from scoreThresholds). finalWeight is the final's weight
 * as a fraction of the total (e.g. 0.4).
 *
 * Returns one of:
 *   { status: 'invalid' }                    — finalWeight <= 0 or targetScore missing
 *   { status: 'achieved', required: 0 }      — target already reached with current points
 *   { status: 'impossible', required }       — required > 100: unreachable even with a perfect final
 *   { status: 'ok', required }               — required in (0, 100]
 */
export function requiredFinalScore(currentPoints, finalWeight, targetScore) {
    const w = Number(finalWeight);
    const target = Number(targetScore);
    if (!Number.isFinite(w) || w <= 0 || !Number.isFinite(target) || target < 0) {
        return { status: 'invalid' };
    }
    const required = (target - currentPoints) / w;
    if (required <= 0) return { status: 'achieved', required: 0 };
    if (required > 100) return { status: 'impossible', required };
    return { status: 'ok', required };
}

/**
 * Total point achieved if the final component scores `finalScore` (0–100).
 * Non-numeric inputs fall back to the current points alone.
 */
export function achievablePoint(currentPoints, finalWeight, finalScore) {
    const w = Number(finalWeight);
    const s = Number(finalScore);
    if (!Number.isFinite(w) || !Number.isFinite(s)) return currentPoints;
    return currentPoints + w * s;
}
