import React from 'react';
import './Section.css';

function StatusChip({ completion, hasError }) {
  if (!completion) return null;
  const { filled, total, complete } = completion;

  if (hasError) {
    return <span className="section-status status-error">! {filled}/{total}</span>;
  }
  if (complete) {
    return <span className="section-status status-complete">✓</span>;
  }
  if (filled > 0) {
    return <span className="section-status status-partial">{filled}/{total}</span>;
  }
  return null;
}

export default function Section({ number, title, badge, hint, expanded, onToggle, children, completion, hasError }) {
  return (
    <div className={`section ${expanded ? 'expanded' : ''}`}>
      <div className="section-header" onClick={onToggle}>
        <div className="section-header-left">
          <span className="section-number">{number}</span>
          <span className="section-title">{title}</span>
          <span className="section-badge">{badge}</span>
          <StatusChip completion={completion} hasError={hasError} />
        </div>
        <span className="expand-icon">&#9660;</span>
      </div>
      <div className="section-content">
        {hint && <div className="section-hint">{hint}</div>}
        <div className="section-body">
          {children}
        </div>
      </div>
    </div>
  );
}
