import React from 'react';
import './Header.css';

export default function Header({ expandedCount, totalSections }) {
  const progressPercent = Math.round((expandedCount / totalSections) * 100);

  return (
    <div className="header">
      <div className="header-top">
        <div className="header-icon">&#128705;</div>
        <h1>Bathroom Safety Audit</h1>
      </div>
      <p className="header-sub">Complete all sections with observations and photos where relevant</p>
      <div className="progress-wrap">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
        <span className="progress-label">
          {expandedCount} / {totalSections} sections opened
        </span>
      </div>
    </div>
  );
}
