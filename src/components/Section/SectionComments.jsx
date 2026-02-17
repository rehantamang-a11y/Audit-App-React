import React from 'react';

export default function SectionComments({ fieldKey, value, onChange, placeholder }) {
  return (
    <div className="section-comments">
      <div className="comment-label">Auditor Comments</div>
      <textarea
        className="comment-input"
        value={value || ''}
        onChange={(e) => onChange(fieldKey, e.target.value)}
        placeholder={placeholder || 'Note observations, defects, or recommendations...'}
      />
    </div>
  );
}
