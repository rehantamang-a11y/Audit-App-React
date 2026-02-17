import React from 'react';
import TextField from '../fields/TextField';
import SelectField from '../fields/SelectField';
import TextAreaField from '../fields/TextAreaField';
import CheckGroup from '../fields/CheckGroup';
import FieldGrid from '../fields/FieldGrid';
import './UserProfile.css';

export default function UserProfile({ uid, onRemove, getField, updateField, canRemove }) {
  const prefix = `u${uid}`;

  return (
    <div className="user-card">
      <div className="user-card-header">
        <div className="user-card-title">
          <div className="user-avatar">{uid}</div>
          User {uid}
        </div>
        {canRemove && (
          <button className="remove-user-btn" onClick={() => onRemove(uid)}>
            Remove
          </button>
        )}
      </div>
      <div className="user-card-body">
        <FieldGrid style={{ marginBottom: 14 }}>
          <TextField
            label="Age"
            fieldKey={`${prefix}-age`}
            value={getField(`${prefix}-age`)}
            onChange={updateField}
            placeholder="e.g., 65"
            type="number"
            min={0}
            max={120}
            gridLabel
          />
          <TextField
            label="Weight (kg)"
            fieldKey={`${prefix}-weight`}
            value={getField(`${prefix}-weight`)}
            onChange={updateField}
            placeholder="e.g., 70"
            type="number"
            gridLabel
          />
        </FieldGrid>

        <FieldGrid style={{ marginBottom: 14 }}>
          <TextField
            label="Height (cm)"
            fieldKey={`${prefix}-height`}
            value={getField(`${prefix}-height`)}
            onChange={updateField}
            placeholder="e.g., 165"
            type="number"
            gridLabel
          />
          <SelectField
            label="Relationship"
            fieldKey={`${prefix}-relation`}
            value={getField(`${prefix}-relation`)}
            onChange={updateField}
            gridLabel
            options={[
              { value: 'self', label: 'Self' },
              { value: 'spouse', label: 'Spouse / Partner' },
              { value: 'parent', label: 'Parent' },
              { value: 'child', label: 'Child' },
              { value: 'other', label: 'Other' },
            ]}
          />
        </FieldGrid>

        <CheckGroup
          label="Known Conditions"
          items={[
            { fieldKey: `${prefix}-cond-bp`, label: 'Blood Pressure' },
            { fieldKey: `${prefix}-cond-diabetes`, label: 'Diabetes' },
            { fieldKey: `${prefix}-cond-heart`, label: 'Heart' },
            { fieldKey: `${prefix}-cond-mobility`, label: 'Mobility Issues' },
          ]}
          values={{
            [`${prefix}-cond-bp`]: getField(`${prefix}-cond-bp`),
            [`${prefix}-cond-diabetes`]: getField(`${prefix}-cond-diabetes`),
            [`${prefix}-cond-heart`]: getField(`${prefix}-cond-heart`),
            [`${prefix}-cond-mobility`]: getField(`${prefix}-cond-mobility`),
          }}
          onChange={updateField}
        />

        <TextAreaField
          label="Other Conditions / Medications"
          fieldKey={`${prefix}-conditions-other`}
          value={getField(`${prefix}-conditions-other`)}
          onChange={updateField}
          placeholder="Other conditions or medications..."
          minHeight="56px"
        />

        <FieldGrid style={{ marginBottom: 14 }}>
          <SelectField
            label="Wake Time"
            fieldKey={`${prefix}-wake-time`}
            value={getField(`${prefix}-wake-time`)}
            onChange={updateField}
            gridLabel
            options={[
              { value: 'before-5am', label: 'Before 5 AM' },
              { value: '5am-6am', label: '5-6 AM' },
              { value: '6am-7am', label: '6-7 AM' },
              { value: '7am-8am', label: '7-8 AM' },
              { value: 'after-8am', label: 'After 8 AM' },
            ]}
          />
          <SelectField
            label="Sleep Time"
            fieldKey={`${prefix}-sleep-time`}
            value={getField(`${prefix}-sleep-time`)}
            onChange={updateField}
            gridLabel
            options={[
              { value: 'before-9pm', label: 'Before 9 PM' },
              { value: '9pm-10pm', label: '9-10 PM' },
              { value: '10pm-11pm', label: '10-11 PM' },
              { value: '11pm-12am', label: '11 PM-12 AM' },
              { value: 'after-12am', label: 'After 12 AM' },
            ]}
          />
        </FieldGrid>

        <FieldGrid style={{ marginBottom: 14 }}>
          <SelectField
            label="Dinner Time"
            fieldKey={`${prefix}-dinner`}
            value={getField(`${prefix}-dinner`)}
            onChange={updateField}
            gridLabel
            options={[
              { value: 'before-7pm', label: 'Before 7 PM' },
              { value: '7pm-8pm', label: '7-8 PM' },
              { value: '8pm-9pm', label: '8-9 PM' },
              { value: '9pm-10pm', label: '9-10 PM' },
              { value: 'after-10pm', label: 'After 10 PM' },
            ]}
          />
          <SelectField
            label="Water Before Bed"
            fieldKey={`${prefix}-water-habit`}
            value={getField(`${prefix}-water-habit`)}
            onChange={updateField}
            gridLabel
            options={[
              { value: 'none', label: 'None' },
              { value: 'sips', label: 'Few sips' },
              { value: 'one-glass', label: 'One glass' },
              { value: 'two-plus', label: 'Two+ glasses' },
            ]}
          />
        </FieldGrid>

        <SelectField
          label="Bathroom Path Access"
          fieldKey={`${prefix}-path-access`}
          value={getField(`${prefix}-path-access`)}
          onChange={updateField}
          options={[
            { value: 'direct', label: 'Direct from bedroom' },
            { value: 'hallway', label: 'Through hallway' },
            { value: 'stairs', label: 'Includes stairs' },
            { value: 'difficult', label: 'Difficult access' },
          ]}
        />

        <TextAreaField
          label="Sleep Habits / Notes"
          fieldKey={`${prefix}-sleep-notes`}
          value={getField(`${prefix}-sleep-notes`)}
          onChange={updateField}
          placeholder="e.g., Light sleeper, wakes frequently, uses walking aid..."
          minHeight="56px"
        />
      </div>
    </div>
  );
}
