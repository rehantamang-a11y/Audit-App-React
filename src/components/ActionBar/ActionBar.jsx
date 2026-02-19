import React from 'react';
import './ActionBar.css';

export default function ActionBar({
  onSaveDraft, onExportPdf, onNewAudit, hasActiveData, isExporting,
  validationBanner, onFixFirst, onExportAnyway,
  confirmNewAuditBanner, onConfirmNewAudit, onCancelNewAudit,
}) {
  return (
    <div className="actions">
      {validationBanner && (
        <div className="validation-banner" role="alert">
          <p className="validation-banner-title">Some required fields are missing:</p>
          <ul className="validation-banner-list">
            {validationBanner.missingMeta && (
              <li>Auditor name / Location (top bar)</li>
            )}
            {validationBanner.incompleteSections.map(s => (
              <li key={s.number}>Section {s.number}: {s.title}</li>
            ))}
          </ul>
          <div className="validation-banner-actions">
            <button className="btn btn-banner-fix" onClick={onFixFirst}>
              Fix first
            </button>
            <button className="btn btn-banner-export" onClick={onExportAnyway}>
              Export anyway
            </button>
          </div>
        </div>
      )}
      {hasActiveData && !confirmNewAuditBanner && (
        <button className="btn btn-new-audit" onClick={onNewAudit} disabled={isExporting}>
          Start New Audit
        </button>
      )}
      {confirmNewAuditBanner && (
        <div className="validation-banner banner-confirm" role="alert">
          <p className="validation-banner-title">Clear all form data and photos?</p>
          <p className="validation-banner-subtitle">This cannot be undone.</p>
          <div className="validation-banner-actions">
            <button className="btn btn-banner-fix" onClick={onCancelNewAudit}>
              Cancel
            </button>
            <button className="btn btn-banner-export" onClick={onConfirmNewAudit}>
              Yes, clear everything
            </button>
          </div>
        </div>
      )}
      <div className="actions-row">
        <button className="btn btn-secondary" onClick={onSaveDraft} disabled={isExporting}>
          Save Draft
        </button>
        <button className="btn btn-primary" onClick={onExportPdf} disabled={isExporting}>
          {isExporting ? 'Generating…' : 'Export as PDF'}
        </button>
      </div>
    </div>
  );
}
