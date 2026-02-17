import React from 'react';

export default function RadioGroup({ label, fieldKey, options, value, onChange, gridLabel }) {
  const LabelTag = gridLabel ? 'span' : 'label';
  const labelClass = gridLabel ? 'field-grid-label' : 'field-label';

  return (
    <div>
      {label && <LabelTag className={labelClass}>{label}</LabelTag>}
      <div className="radio-group">
        {options.map(opt => (
          <label key={opt.value} className="radio-label">
            <input
              type="radio"
              name={fieldKey}
              value={opt.value}
              checked={value === opt.value}
              onChange={(e) => onChange(fieldKey, e.target.value)}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}
