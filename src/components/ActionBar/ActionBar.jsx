import React from 'react';
import './ActionBar.css';

export default function ActionBar({
  onSaveDraft, onExportPdf, onNewAudit, hasActiveData, isExporting,
  validationBanner, onFixFirst, onExportAnyway,
  confirmNewAuditBanner, onConfirmNewAudit, onCancelNewAudit,
  onSendReport, onRetry, isSyncing, syncStatus, syncedAuditId, syncError,
  pendingRetry, editedAfterSync,
}) {
  // Determine Send Report button label and state
  const getSendReportButtonLabel = () => {
    if (syncStatus === 'syncing') return 'Sending…';
    if (syncStatus === 'success') return 'Sent ✓';
    if (syncStatus === 'error') return 'Send failed — retry';
    if (syncStatus === 'offline') return 'No connection';
    return 'Send Report';
  };

  const getSendReportButtonClass = () => {
    if (syncStatus === 'error') return 'btn-send-error';
    if (syncStatus === 'offline') return 'btn-send-offline';
    return 'btn-send-report';
  };

  const isSendReportDisabled = () => {
    return isExporting || isSyncing || syncStatus === 'syncing' || syncStatus === 'offline';
  };

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
        <button className="btn btn-new-audit" onClick={onNewAudit} disabled={isExporting || isSyncing}>
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
      
      {syncedAuditId && (
        <div className="sync-audit-id">
          Report ID: <code>{syncedAuditId}</code>
        </div>
      )}

      <div className="actions-row">
        <button className="btn btn-secondary" onClick={onSaveDraft} disabled={isExporting || isSyncing}>
          Save Draft
        </button>
        <button
          className={`btn ${getSendReportButtonClass()}`}
          onClick={onSendReport}
          disabled={isSendReportDisabled()}
        >
          {getSendReportButtonLabel()}
          {syncStatus === 'syncing' && <span className="spinner"></span>}
        </button>
        <button className="btn btn-primary" onClick={onExportPdf} disabled={isExporting || isSyncing}>
          {isExporting ? 'Generating…' : 'Export as PDF'}
        </button>
      </div>

      {(pendingRetry || syncStatus === 'offline') && (
        <button className="btn btn-retry" onClick={onRetry} disabled={isSyncing}>
          Retry sending
        </button>
      )}

      {editedAfterSync && syncStatus === 'success' && (
        <div className="sync-info">
          Edits made after sync — tap Send Report to re-send
        </div>
      )}
    </div>
  );
}
