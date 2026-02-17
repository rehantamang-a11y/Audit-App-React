import React from 'react';

export default function FieldGrid({ children, style }) {
  return (
    <div className="field-grid" style={style}>
      {children}
    </div>
  );
}
