import React from 'react';
import './Section.css';

function StatusChip({ completion, hasError }) {
  if (!completion) return null;
  const { filled, total, complete } = completion;

  if (hasError) {
    return (
      <span
        className="section-status status-error"
        aria-label={`Section incomplete — ${filled} of ${total} required fields filled`}
      >
        <span aria-hidden="true">! {filled}/{total}</span>
      </span>
    );
  }
  if (complete) {
    return (
      <span
        className="section-status status-complete"
        aria-label="Section complete"
      >
        <span aria-hidden="true">✓</span>
      </span>
    );
  }
  if (filled > 0) {
    return (
      <span
        className="section-status status-partial"
        aria-label={`${filled} of ${total} required fields filled`}
      >
        <span aria-hidden="true">{filled}/{total}</span>
      </span>
    );
  }
  return null;
}

export default function Section({ number, title, badge, hint, expanded, onToggle, children, completion, hasError }) {
  const contentId = `section-content-${number}`;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <div className={`section ${expanded ? 'expanded' : ''}`}>
      <div
        className="section-header"
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-expanded={expanded}
        aria-controls={contentId}
      >
        <div className="section-header-left">
          <span className="section-number" aria-hidden="true">{number}</span>
          <span className="section-title" title={title}>{title}</span>
          <span className="section-badge" aria-hidden="true">{badge}</span>
          <StatusChip completion={completion} hasError={hasError} />
        </div>
        <span className="expand-icon" aria-hidden="true">&#9660;</span>
      </div>
      <div id={contentId} className="section-content" aria-hidden={!expanded}>
        {hint && <div className="section-hint">{hint}</div>}
        <div className="section-body">
          {children}
        </div>
      </div>
    </div>
  );
}
