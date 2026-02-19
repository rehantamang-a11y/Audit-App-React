import React from 'react';
import './RiskDashboard.css';

const LEVEL_LABELS = {
  'safe':      'Safe',
  'caution':   'Caution',
  'at-risk':   'At Risk',
  'high-risk': 'High Risk',
};

const LEVEL_DESCS = {
  'safe':      'No significant hazards identified',
  'caution':   'Some hazards found — review flagged items',
  'at-risk':   'Multiple hazards present — action recommended',
  'high-risk': 'Serious hazards detected — immediate action required',
};

const SEVERITY_LABELS = {
  critical: 'Critical',
  high:     'High',
  medium:   'Medium',
};

function sectionBarClass(score) {
  if (score >= 80) return 'risk-bar-fill-safe';
  if (score >= 60) return 'risk-bar-fill-caution';
  if (score >= 40) return 'risk-bar-fill-at-risk';
  return 'risk-bar-fill-high-risk';
}

export default function RiskDashboard({ risk }) {
  if (!risk || !risk.hasAnyData) {
    return (
      <div className="risk-dashboard risk-dashboard-empty">
        <p className="risk-empty-text">Complete the audit sections above to see the safety score.</p>
      </div>
    );
  }

  const { score, level, sectionScores, flags } = risk;

  const sectionList = Object.entries(sectionScores)
    .filter(([, s]) => s.hasData && s.score !== null)
    .map(([num, s]) => ({ num: Number(num), ...s }));

  return (
    <div className={`risk-dashboard risk-level-${level}`}>
      <div className="risk-dashboard-title">Safety Score</div>

      {/* Score row */}
      <div className="risk-score-row">
        <div className="risk-score-block">
          <span className="risk-score-number">{score}</span>
          <span className="risk-score-denom">/100</span>
        </div>
        <div className="risk-score-right">
          <span className={`risk-level-badge risk-level-badge-${level}`}>
            {LEVEL_LABELS[level]}
          </span>
          <p className="risk-level-desc">{LEVEL_DESCS[level]}</p>
        </div>
      </div>

      {/* Overall bar */}
      <div
        className="risk-bar-track"
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Safety score: ${score} out of 100`}
      >
        <div
          className={`risk-bar-fill risk-bar-fill-${level}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Section sub-scores */}
      {sectionList.length > 0 && (
        <div className="risk-sections">
          <div className="risk-sections-title">Section Breakdown</div>
          <div className="risk-sections-grid">
            {sectionList.map(s => (
              <div className="risk-section-row" key={s.num}>
                <span className="risk-section-name" title={s.name}>{s.name}</span>
                <div
                  className="risk-section-bar-track"
                  role="img"
                  aria-label={`${s.name}: ${s.score} out of 100`}
                >
                  <div
                    className={`risk-section-bar-fill ${sectionBarClass(s.score)}`}
                    style={{ width: `${s.score}%` }}
                  />
                </div>
                <span className="risk-section-score">{s.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Flags */}
      {flags.length > 0 && (
        <div className="risk-flags">
          <div className="risk-flags-title">Identified Risks ({flags.length})</div>
          <ul className="risk-flags-list">
            {flags.map((f, i) => (
              <li key={i} className={`risk-flag risk-flag-${f.severity}`}>
                <span className="risk-flag-dot" aria-hidden="true" />
                <span className="risk-flag-text">{f.flag}</span>
                <span className={`risk-flag-severity risk-flag-severity-${f.severity}`}>
                  {SEVERITY_LABELS[f.severity]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
