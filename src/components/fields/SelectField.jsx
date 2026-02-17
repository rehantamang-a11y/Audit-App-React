import React from 'react';

export default function SelectField({ label, fieldKey, options, value, onChange, gridLabel }) {
  const LabelTag = gridLabel ? 'span' : 'label';
  const labelClass = gridLabel ? 'field-grid-label' : 'field-label';

  return (
    <div className={gridLabel ? undefined : 'field-group'}>
      {label && <LabelTag className={labelClass}>{label}</LabelTag>}
      <select
        className="field-input"
        value={value || ''}
        onChange={(e) => onChange(fieldKey, e.target.value)}
      >
        <option value="">Select...</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
