import React from 'react';
import './ActionBar.css';

export default function ActionBar({ onSaveDraft, onExportPdf }) {
  return (
    <div className="actions">
      <button className="btn btn-secondary" onClick={onSaveDraft}>
        Save Draft
      </button>
      <button className="btn btn-primary" onClick={onExportPdf}>
        Export as PDF
      </button>
    </div>
  );
}
