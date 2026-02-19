import React from 'react';
import './ActionBar.css';

export default function ActionBar({ onSaveDraft, onExportPdf, onNewAudit, hasActiveData, isExporting }) {
  return (
    <div className="actions">
      {hasActiveData && (
        <button className="btn btn-new-audit" onClick={onNewAudit} disabled={isExporting}>
          Start New Audit
        </button>
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
