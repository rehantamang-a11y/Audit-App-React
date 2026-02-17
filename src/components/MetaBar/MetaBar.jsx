import React from 'react';
import './MetaBar.css';

export default function MetaBar({ meta, onUpdate }) {
  return (
    <div className="meta-bar">
      <div className="meta-field">
        <label>Auditor Name</label>
        <input
          type="text"
          value={meta.auditor}
          onChange={(e) => onUpdate('auditor', e.target.value)}
          placeholder="Your name"
        />
      </div>
      <div className="meta-field">
        <label>Audit Date</label>
        <input
          type="date"
          value={meta.date}
          onChange={(e) => onUpdate('date', e.target.value)}
        />
      </div>
      <div className="meta-field">
        <label>Location / Address</label>
        <input
          type="text"
          value={meta.location}
          onChange={(e) => onUpdate('location', e.target.value)}
          placeholder="Property address"
        />
      </div>
    </div>
  );
}
