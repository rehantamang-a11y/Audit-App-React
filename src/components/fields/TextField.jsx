import React from 'react';

export default function TextField({ label, fieldKey, value, onChange, placeholder, type = 'text', gridLabel, min, max }) {
  const LabelTag = gridLabel ? 'span' : 'label';
  const labelClass = gridLabel ? 'field-grid-label' : 'field-label';

  return (
    <div className={gridLabel ? undefined : 'field-group'}>
      {label && <LabelTag className={labelClass}>{label}</LabelTag>}
      <input
        type={type}
        className="field-input"
        value={value || ''}
        onChange={(e) => onChange(fieldKey, e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
      />
    </div>
  );
}
