/**
 * riskEngine.js
 *
 * Pure function that computes a Safety Score (0–100) from raw form field values.
 * Higher score = safer. No side effects, no imports.
 *
 * Returns:
 *   { score, level, sectionScores, flags, hasAnyData }
 */

// ─── Declarative rules ───────────────────────────────────────────────────────
// Each rule maps a field key → its possible risky values → deduction + flag.
// maxDeduction = worst-case deduction for this rule (used for section sub-scores).

const RULES = [
  // ── Section 1: Physical Civil Infrastructure ──────────────────────────────
  { field: '1-floor-quality', section: 1, maxDeduction: 12, values: {
    'needs-replacement': { deduction: 12, flag: 'Floor needs replacement — slip and trip risk', severity: 'high' },
    'poor':              { deduction: 8,  flag: 'Floor in poor condition — slip risk', severity: 'high' },
    'fair':              { deduction: 4,  flag: null },
  }},
  { field: '1-washroom-light', section: 1, maxDeduction: 10, values: {
    'insufficient': { deduction: 10, flag: 'Insufficient washroom lighting — fall risk especially at night', severity: 'high' },
    'dim':          { deduction: 6,  flag: 'Dim washroom lighting — improvement recommended', severity: 'medium' },
  }},

  // ── Section 2: Accessories ────────────────────────────────────────────────
  { field: '2-antiskid-avail', section: 2, maxDeduction: 20, values: {
    'no': { deduction: 20, flag: 'Anti-skid mat missing — critical fall risk', severity: 'critical' },
  }},
  { field: '2-antiskid-cond', section: 2, maxDeduction: 8, values: {
    'poor': { deduction: 8, flag: 'Anti-skid mat in poor condition — replace immediately', severity: 'high' },
    'fair': { deduction: 3, flag: null },
  }},
  { field: '2-pvcmat-avail', section: 2, maxDeduction: 8, values: {
    'no': { deduction: 8, flag: 'PVC outdoor mat missing — wet entry slip risk', severity: 'medium' },
  }},

  // ── Section 3: Washroom Fixtures ──────────────────────────────────────────
  { field: '3-flush', section: 3, maxDeduction: 8, values: {
    'not-working': { deduction: 8, flag: 'Flush not working', severity: 'high' },
    'leaking':     { deduction: 6, flag: 'Flush leaking — water on floor creates slip risk', severity: 'medium' },
  }},
  { field: '3-faucets', section: 3, maxDeduction: 8, values: {
    'not-working': { deduction: 8, flag: 'Faucets not working', severity: 'high' },
    'stiff':       { deduction: 5, flag: 'Faucets stiff — difficulty for elderly or arthritic users', severity: 'medium' },
  }},
  { field: '3-washbasin', section: 3, maxDeduction: 6, values: {
    'cracked':        { deduction: 6, flag: 'Washbasin cracked — injury risk', severity: 'high' },
    'drainage-issue': { deduction: 3, flag: null },
  }},

  // ── Section 4: Sharp Edges & Plumbing ─────────────────────────────────────
  { field: '4-slab-corner', section: 4, maxDeduction: 15, values: {
    'high-risk':   { deduction: 15, flag: 'Slab corner rated high risk — immediate protective action needed', severity: 'critical' },
    'medium-risk': { deduction: 8,  flag: 'Slab corner rated medium risk — consider protective padding', severity: 'medium' },
    'low-risk':    { deduction: 3,  flag: null },
  }},
  { field: '4-bidet-edges', section: 4, maxDeduction: 12, values: {
    'high-risk':   { deduction: 12, flag: 'Bidet edges rated high risk — injury risk', severity: 'critical' },
    'medium-risk': { deduction: 6,  flag: 'Bidet edges rated medium risk', severity: 'medium' },
    'low-risk':    { deduction: 2,  flag: null },
  }},
  { field: '4-protruding', section: 4, maxDeduction: 8, values: {
    'hooks-sharp': { deduction: 8, flag: 'Sharp hooks present — injury risk', severity: 'high' },
    'fixtures':    { deduction: 8, flag: 'Sharp fixtures present — injury risk', severity: 'high' },
    'pipes':       { deduction: 6, flag: 'Exposed pipes — bump and burn risk', severity: 'medium' },
  }},
  { field: '4-electric-risk', section: 4, maxDeduction: 20, values: {
    'high-risk':   { deduction: 20, flag: 'High-risk electrical exposure — professional inspection required immediately', severity: 'critical' },
    'medium-risk': { deduction: 10, flag: 'Electrical risk detected — inspection recommended', severity: 'high' },
    'low-risk':    { deduction: 4,  flag: null },
  }},
  { field: '4-shower-drain', section: 4, maxDeduction: 10, values: {
    'overflowing': { deduction: 10, flag: 'Shower drain overflowing — serious slip risk', severity: 'critical' },
    'clogged':     { deduction: 8,  flag: 'Shower drain clogged — standing water, slip risk', severity: 'high' },
    'slow':        { deduction: 4,  flag: null },
  }},

  // ── Section 7: Electrical, Lighting & Heating ─────────────────────────────
  { field: '7-switchboard', section: 7, maxDeduction: 10, values: {
    'inside-risk': { deduction: 10, flag: 'Switchboard located near water — electrocution risk', severity: 'critical' },
  }},
  { field: '7-pipe-status', section: 7, maxDeduction: 8, values: {
    'leaking': { deduction: 8, flag: 'Pipes leaking — water damage and slip risk', severity: 'high' },
    'damaged': { deduction: 8, flag: 'Pipes damaged', severity: 'high' },
    'rusted':  { deduction: 6, flag: 'Pipes rusted — water quality and leak risk', severity: 'medium' },
  }},

  // ── Section 8: Access & Exit ──────────────────────────────────────────────
  { field: '8-step', section: 8, maxDeduction: 15, values: {
    'large':  { deduction: 15, flag: 'Large step at bathroom entrance — high fall risk, especially for elderly', severity: 'critical' },
    'medium': { deduction: 8,  flag: 'Medium step at entrance — fall risk', severity: 'high' },
    'small':  { deduction: 4,  flag: 'Small step at entrance — trip risk for elderly users', severity: 'medium' },
  }},
  { field: '8-level-variation', section: 8, maxDeduction: 15, values: {
    'tripping-hazard': { deduction: 15, flag: 'Floor level variation is a tripping hazard — immediate attention needed', severity: 'critical' },
    'significant':     { deduction: 8,  flag: 'Significant floor level variation — trip risk', severity: 'high' },
    'slight':          { deduction: 3,  flag: null },
  }},
  { field: '8-floor-variation', section: 8, maxDeduction: 12, values: {
    'hazardous': { deduction: 12, flag: 'Hazardous floor variation inside bathroom — immediate attention needed', severity: 'critical' },
    'uneven':    { deduction: 6,  flag: 'Uneven floor inside bathroom — slip and trip risk', severity: 'high' },
  }},
  { field: '8-outside-lighting', section: 8, maxDeduction: 15, values: {
    'none': { deduction: 15, flag: 'No lighting outside bathroom — critical fall risk for night-time visits', severity: 'critical' },
    'dim':  { deduction: 8,  flag: 'Dim lighting outside bathroom — improve for night safety', severity: 'high' },
  }},
  { field: '8-door-type', section: 8, maxDeduction: 6, values: {
    'hinged-inward': { deduction: 6, flag: 'Inward-opening door — can trap a fallen user', severity: 'medium' },
  }},
  { field: '8-door-width', section: 8, maxDeduction: 6, values: {
    'narrow': { deduction: 6, flag: 'Narrow door (<30 in) — accessibility concern', severity: 'medium' },
  }},
];

const SECTION_NAMES = {
  1: 'Infrastructure',
  2: 'Accessories',
  3: 'Fixtures',
  4: 'Hazards',
  5: 'User Profiles',
  6: 'Configuration',
  7: 'Electrical',
  8: 'Access & Exit',
};

const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2 };

// ─── Main export ──────────────────────────────────────────────────────────────

export function computeRiskScore(formFields) {
  let totalDeduction = 0;
  const flags = [];

  // Per-section tracking
  const sectionDeductions = {};
  const sectionMaxes = {};
  const sectionHasData = {};
  for (let i = 1; i <= 8; i++) {
    sectionDeductions[i] = 0;
    sectionMaxes[i] = 0;
    sectionHasData[i] = false;
  }

  // Accumulate section max deductions from static rules
  RULES.forEach(rule => { sectionMaxes[rule.section] += rule.maxDeduction; });

  // ── Section 5: User profile risk analysis ──────────────────────────────
  let ageMultiplier = 1.0;
  try {
    const userIds = JSON.parse(formFields['5-userIds'] || '[]');
    const ids = userIds.length > 0 ? userIds : [1];
    let maxAge = 0;

    ids.forEach(id => {
      const rawAge = formFields[`u${id}-age`];
      if (rawAge) {
        sectionHasData[5] = true;
        const age = parseInt(rawAge, 10);
        if (!isNaN(age) && age > maxAge) maxAge = age;
      }

      // Mobility conditions increase risk of physical hazards
      if (formFields[`u${id}-cond-mobility`] === 'true') {
        sectionHasData[5] = true;
        sectionDeductions[5] += 5;
        sectionMaxes[5] += 5;
        totalDeduction += 5;
        flags.push({ flag: 'User with mobility issues — all physical hazards carry elevated risk', severity: 'high', section: 5 });
      }

      // Bathroom path
      const path = formFields[`u${id}-path-access`];
      if (path) {
        sectionHasData[5] = true;
        if (path === 'stairs') {
          sectionDeductions[5] += 8;
          sectionMaxes[5] += 8;
          totalDeduction += 8;
          flags.push({ flag: 'Bathroom path includes stairs — serious fall risk', severity: 'high', section: 5 });
        } else if (path === 'difficult') {
          sectionDeductions[5] += 6;
          sectionMaxes[5] += 6;
          totalDeduction += 6;
          flags.push({ flag: 'Difficult bathroom path access', severity: 'medium', section: 5 });
        }
      }
    });

    // Age multiplier amplifies critical/high deductions
    if (maxAge >= 70) ageMultiplier = 1.3;
    else if (maxAge >= 60) ageMultiplier = 1.15;
  } catch {
    // Ignore malformed user data
  }

  // ── Field-based rules ──────────────────────────────────────────────────
  RULES.forEach(rule => {
    const val = formFields[rule.field];
    if (!val) return;

    sectionHasData[rule.section] = true;
    const match = rule.values[val];
    if (!match) return;

    let deduction = match.deduction;
    if (ageMultiplier > 1 && (match.severity === 'critical' || match.severity === 'high')) {
      deduction = Math.round(deduction * ageMultiplier);
    }

    totalDeduction += deduction;
    sectionDeductions[rule.section] += deduction;

    if (match.flag) {
      flags.push({ flag: match.flag, severity: match.severity, section: rule.section });
    }
  });

  // ── Overall score ──────────────────────────────────────────────────────
  const score = Math.max(0, Math.min(100, 100 - totalDeduction));

  let level;
  if (score >= 80) level = 'safe';
  else if (score >= 60) level = 'caution';
  else if (score >= 40) level = 'at-risk';
  else level = 'high-risk';

  // ── Section scores ─────────────────────────────────────────────────────
  const sectionScores = {};
  for (let i = 1; i <= 8; i++) {
    const max = sectionMaxes[i];
    const deducted = sectionDeductions[i];
    const hasData = sectionHasData[i];
    if (max === 0 || !hasData) {
      sectionScores[i] = { score: null, name: SECTION_NAMES[i], hasData };
    } else {
      const s = Math.max(0, Math.min(100, 100 - Math.round((deducted / max) * 100)));
      sectionScores[i] = { score: s, name: SECTION_NAMES[i], hasData };
    }
  }

  // ── Deduplicate and sort flags ─────────────────────────────────────────
  const seen = new Set();
  const uniqueFlags = flags.filter(f => {
    if (seen.has(f.flag)) return false;
    seen.add(f.flag);
    return true;
  });
  uniqueFlags.sort((a, b) => (SEVERITY_ORDER[a.severity] ?? 3) - (SEVERITY_ORDER[b.severity] ?? 3));

  const hasAnyData = Object.values(sectionHasData).some(Boolean);

  return { score, level, sectionScores, flags: uniqueFlags, hasAnyData };
}
