import React from 'react';

export default function TextAreaField({ label, fieldKey, value, onChange, placeholder, minHeight }) {
  return (
    <div className="field-group">
      {label && <label className="field-label">{label}</label>}
      <textarea
        className="field-input"
        value={value || ''}
        onChange={(e) => onChange(fieldKey, e.target.value)}
        placeholder={placeholder}
        style={minHeight ? { minHeight } : undefined}
      />
    </div>
  );
}
