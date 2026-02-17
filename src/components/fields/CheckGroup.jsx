import React from 'react';

export default function CheckGroup({ label, items, values, onChange }) {
  return (
    <div className="field-group">
      {label && <label className="field-label">{label}</label>}
      <div className="check-group">
        {items.map(item => (
          <label key={item.fieldKey} className="check-label">
            <input
              type="checkbox"
              checked={!!values[item.fieldKey]}
              onChange={(e) => onChange(item.fieldKey, e.target.checked)}
            />
            {item.label}
          </label>
        ))}
      </div>
    </div>
  );
}
