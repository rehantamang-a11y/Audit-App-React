import React from 'react';
import './Section.css';

export default function Section({ number, title, badge, hint, expanded, onToggle, children }) {
  return (
    <div className={`section ${expanded ? 'expanded' : ''}`}>
      <div className="section-header" onClick={onToggle}>
        <div className="section-header-left">
          <span className="section-number">{number}</span>
          <span className="section-title">{title}</span>
          <span className="section-badge">{badge}</span>
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
