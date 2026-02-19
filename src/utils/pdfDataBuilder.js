/**
 * pdfDataBuilder.js
 *
 * Transforms raw formData + photos from context into a clean, display-ready
 * array of section objects consumed by generatePdf.js.
 *
 * All raw field values (e.g. 'ceramic-tiles') are resolved to their
 * human-readable labels (e.g. 'Ceramic Tiles') using sectionSchema options.
 * Internal management keys (5-userIds, 5-nextId) are stripped.
 */

import { sectionSchema } from '../data/sectionSchema';

// ─── Value resolution ───────────────────────────────────────────────────────

const DEFAULT_AVAIL_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

const DEFAULT_COND_OPTIONS = [
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
];

function resolveLabel(value, options) {
  if (!value && value !== 0) return null;
  if (!options || options.length === 0) return String(value);
  const found = options.find(o => o.value === value);
  return found ? found.label : String(value);
}

// Values that warrant red high-risk styling in the PDF
const HIGH_RISK_PATTERNS = [
  'high-risk', 'poor', 'not-working', 'clogged', 'overflowing',
  'leaking', 'damaged', 'rusted', 'insufficient', 'hazardous',
  'tripping-hazard', 'inside-risk', 'hooks-sharp', 'frequent-clog',
  'needs-replacement',
];

function isHighRisk(value) {
  if (!value) return false;
  return HIGH_RISK_PATTERNS.includes(value);
}

// ─── Field processors ────────────────────────────────────────────────────────

/**
 * Walks a fields array from sectionSchema and builds a flat rows array.
 * @param {Array}  fields     - sectionSchema fields array
 * @param {Object} formFields - formData.fields (raw key→value map)
 * @param {Array}  rows       - output array (mutated in place)
 * @param {string} prefix     - replaces '{prefix}' in dynamic field keys (Section 5)
 */
function processFields(fields, formFields, rows, prefix = '') {
  for (const field of fields) {

    // ── Sub-section heading (no data, just a visual divider) ──
    if (field.type === 'subsection') {
      rows.push({ type: 'subheading', label: field.label });
      continue;
    }

    // ── Grid / labeled-grid (container — recurse into nested fields) ──
    if (field.type === 'grid' || field.type === 'labeled-grid') {
      if (field.label) {
        rows.push({ type: 'subheading', label: field.label });
      }
      if (field.fields) processFields(field.fields, formFields, rows, prefix);
      continue;
    }

    // ── Accessory (availability + condition pair, e.g. Anti-Skid Mat) ──
    if (field.type === 'accessory') {
      const availKey = `${field.prefix}-avail`;
      const condKey  = `${field.prefix}-cond`;
      const availVal = formFields[availKey];
      const condVal  = formFields[condKey];
      const availOpts = field.availOptions || DEFAULT_AVAIL_OPTIONS;
      const condOpts  = field.condOptions  || DEFAULT_COND_OPTIONS;

      rows.push({
        type: 'field',
        label: field.label,
        subLabel: 'Availability',
        rawValue: availVal,
        value: resolveLabel(availVal, availOpts) || '—',
        highRisk: isHighRisk(availVal),
      });

      // Only show condition row when item is present
      if (availVal === 'yes' && condVal) {
        rows.push({
          type: 'field',
          label: '',
          subLabel: 'Condition',
          rawValue: condVal,
          value: resolveLabel(condVal, condOpts) || '—',
          highRisk: isHighRisk(condVal),
        });
      }
      continue;
    }

    // ── Avail-condition pair (e.g. Shower Panel, Bidet) ──
    if (field.type === 'avail-condition') {
      const availVal = formFields[field.availKey];
      const condVal  = formFields[field.condKey];

      rows.push({
        type: 'field',
        label: field.label,
        subLabel: 'Available',
        rawValue: availVal,
        value: resolveLabel(availVal, DEFAULT_AVAIL_OPTIONS) || '—',
        highRisk: false,
      });

      if (availVal === 'yes' && condVal) {
        rows.push({
          type: 'field',
          label: '',
          subLabel: 'Condition',
          rawValue: condVal,
          value: resolveLabel(condVal, field.condOptions || DEFAULT_COND_OPTIONS) || '—',
          highRisk: isHighRisk(condVal),
        });
      }
      continue;
    }

    // ── Checkgroup (multiple-choice checkboxes) ──
    if (field.type === 'checkgroup') {
      const checkedLabels = (field.items || [])
        .filter(item => {
          const k = item.fieldKey.replace('{prefix}', prefix);
          return formFields[k] === true || formFields[k] === 'true';
        })
        .map(item => item.label);

      rows.push({
        type: 'field',
        label: field.label,
        rawValue: null,
        value: checkedLabels.length > 0 ? checkedLabels.join(', ') : '—',
        highRisk: false,
      });
      continue;
    }

    // ── Standard field (select / text / textarea / radio) ──
    if (field.key) {
      const key      = field.key.replace('{prefix}', prefix);
      const rawValue = formFields[key];
      const display  = resolveLabel(rawValue, field.options);

      rows.push({
        type: 'field',
        label: field.label,
        rawValue,
        value: display || '—',
        highRisk: isHighRisk(rawValue),
      });
    }
  }
}

// ─── Section 5 — dynamic user profiles ─────────────────────────────────────

function processSection5(schema, formFields) {
  const rows = [];

  let userIds;
  try {
    userIds = JSON.parse(formFields['5-userIds'] || '[]');
  } catch {
    userIds = [1];
  }

  if (userIds.length === 0) {
    return [{ type: 'field', label: 'No user profiles recorded', value: '—', highRisk: false }];
  }

  for (const id of userIds) {
    const prefix = `u${id}`;
    rows.push({ type: 'user-header', label: `User ${id}` });
    // Deep-clone field defs so we never mutate the imported schema object
    const clonedFields = JSON.parse(JSON.stringify(schema.userFields));
    processFields(clonedFields, formFields, rows, prefix);
  }

  return rows;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * @param {Object} formData - from FormContext: { meta, fields }
 * @param {Object} photos   - from PhotoContext: { '1': [{id, name, data}], ... }
 * @returns {Array} sections - ready for generatePdf.js
 *   Each section: { sectionNum, title, rows, comments, photos }
 *   Each row:     { type: 'field'|'subheading'|'user-header', label, value, highRisk }
 *   photos:       string[] of base64 data URIs
 */
export function buildPdfData(formData, photos) {
  const sections = [];

  for (let num = 1; num <= 8; num++) {
    const schema = sectionSchema[num];
    if (!schema) continue;

    let rows;
    if (schema.dynamic) {
      rows = processSection5(schema, formData.fields);
    } else {
      rows = [];
      processFields(schema.fields, formData.fields, rows);
    }

    const comments     = formData.fields[`${num}-comments`] || '';
    const rawPhotos    = photos[String(num)] || [];
    const sectionPhotos = rawPhotos.map(p => p.data).filter(Boolean);

    sections.push({
      sectionNum: num,
      title:      schema.title,
      rows,
      comments,
      photos: sectionPhotos,
    });
  }

  return sections;
}
