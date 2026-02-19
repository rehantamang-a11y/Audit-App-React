import React from 'react';
import './Header.css';

export default function Header({ completedCount, totalSections }) {
  const progressPercent = totalSections > 0 ? Math.round((completedCount / totalSections) * 100) : 0;
  const allComplete = completedCount === totalSections;

  return (
    <div className="header">
      <div className="header-top">
        <div className="header-icon" aria-hidden="true">&#128705;</div>
        <h1>Bathroom Safety Audit</h1>
      </div>
      <p className="header-sub">Complete all sections with observations and photos where relevant</p>
      <div className="progress-wrap">
        <div
          className="progress-bar"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Audit completion progress"
        >
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
        <span className="progress-label">
          {allComplete ? 'All sections complete' : `${completedCount} / ${totalSections} sections complete`}
        </span>
      </div>
    </div>
  );
}
