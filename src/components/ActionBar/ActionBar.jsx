import React from 'react';
import './ActionBar.css';

export default function ActionBar({ onSaveDraft, onExportPdf, onNewAudit, hasActiveData }) {
  return (
    <div className="actions">
      {hasActiveData && (
        <button className="btn btn-new-audit" onClick={onNewAudit}>
          Start New Audit
        </button>
      )}
      <div className="actions-row">
        <button className="btn btn-secondary" onClick={onSaveDraft}>
          Save Draft
        </button>
        <button className="btn btn-primary" onClick={onExportPdf}>
          Export as PDF
        </button>
      </div>
    </div>
  );
}
