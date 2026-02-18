import { sectionSchema, getRequiredFields, getAllFieldKeys } from '../data/sectionSchema';

/**
 * Validate all required fields, return errors object { fieldKey: 'Required' }
 */
export function validateForm(fields, meta) {
  const errors = {};

  // Meta validation
  if (!meta.auditor?.trim()) errors['meta-auditor'] = 'Required';
  if (!meta.date) errors['meta-date'] = 'Required';
  if (!meta.location?.trim()) errors['meta-location'] = 'Required';

  // Section field validation
  for (let sectionNum = 1; sectionNum <= 8; sectionNum++) {
    if (sectionNum === 5) continue; // dynamic section, validated separately
    const required = getRequiredFields(sectionNum);
    for (const key of required) {
      if (!fields[key]) {
        errors[key] = 'Required';
      }
    }
  }

  return errors;
}

/**
 * Check if critical fields are filled (blocks PDF export)
 */
export function hasCriticalFields(meta) {
  return !!(meta.auditor?.trim() && meta.date && meta.location?.trim());
}

/**
 * Calculate completion percentage for a section
 */
export function getSectionCompletion(sectionNum, fields) {
  if (sectionNum === 5) {
    // For user profiles, check if at least one user has basic data
    const hasUserData = fields['u1-age'] || fields['u1-relation'];
    return hasUserData ? { filled: 1, total: 1, percent: 100 } : { filled: 0, total: 1, percent: 0 };
  }

  const allKeys = getAllFieldKeys(sectionNum);
  const total = allKeys.length;
  if (total === 0) return { filled: 0, total: 0, percent: 100 };

  const filled = allKeys.filter(key => {
    const val = fields[key];
    return val !== undefined && val !== '' && val !== false;
  }).length;

  return {
    filled,
    total,
    percent: Math.round((filled / total) * 100),
  };
}

/**
 * Calculate required field completion for a section
 */
export function getSectionRequiredCompletion(sectionNum, fields) {
  if (sectionNum === 5) {
    const hasUserData = fields['u1-age'] || fields['u1-relation'];
    return { filled: hasUserData ? 1 : 0, total: 1, percent: hasUserData ? 100 : 0 };
  }

  const required = getRequiredFields(sectionNum);
  const total = required.length;
  if (total === 0) return { filled: 0, total: 0, percent: 100 };

  const filled = required.filter(key => !!fields[key]).length;
  return {
    filled,
    total,
    percent: Math.round((filled / total) * 100),
  };
}

/**
 * Get section-level errors (required fields missing in a section)
 */
export function getSectionErrors(sectionNum, fields) {
  if (sectionNum === 5) return {};
  const required = getRequiredFields(sectionNum);
  const errors = {};
  for (const key of required) {
    if (!fields[key]) errors[key] = 'Required';
  }
  return errors;
}
