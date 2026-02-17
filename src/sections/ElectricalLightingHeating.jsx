import React from 'react';
import SelectField from '../components/fields/SelectField';
import TextField from '../components/fields/TextField';
import RadioGroup from '../components/fields/RadioGroup';
import FieldGrid from '../components/fields/FieldGrid';
import SectionComments from '../components/Section/SectionComments';
import PhotoUpload from '../components/PhotoUpload/PhotoUpload';

export default function ElectricalLightingHeating({ getField, updateField, photos, addPhotos, removePhoto }) {
  return (
    <>
      <div className="sub-section-title">Power & Lighting</div>

      <SelectField
        label="Power Supply Source" fieldKey="7-power-source" value={getField('7-power-source')}
        onChange={updateField}
        options={[
          { value: 'grid', label: 'Main Grid' },
          { value: 'grid-backup', label: 'Grid + Backup' },
          { value: 'solar', label: 'Solar' },
          { value: 'mixed', label: 'Mixed Sources' },
        ]}
      />

      <SelectField
        label="Switchboard Location" fieldKey="7-switchboard" value={getField('7-switchboard')}
        onChange={updateField}
        options={[
          { value: 'inside-safe', label: 'Inside — Safe position' },
          { value: 'inside-risk', label: 'Inside — Near water' },
          { value: 'outside', label: 'Outside bathroom' },
        ]}
      />

      <FieldGrid>
        <TextField
          label="No. of Light Points" fieldKey="7-light-points" value={getField('7-light-points')}
          onChange={updateField} placeholder="e.g., 2" type="number" min={0} gridLabel
        />
        <SelectField
          label="Ceiling Light Type" fieldKey="7-ceiling-light" value={getField('7-ceiling-light')}
          onChange={updateField} gridLabel
          options={[
            { value: 'led', label: 'LED' },
            { value: 'cfl', label: 'CFL' },
            { value: 'tube', label: 'Tube Light' },
            { value: 'incandescent', label: 'Incandescent' },
            { value: 'none', label: 'None' },
          ]}
        />
      </FieldGrid>

      <FieldGrid style={{ marginTop: 12 }}>
        <SelectField
          label="Light Color" fieldKey="7-light-color" value={getField('7-light-color')}
          onChange={updateField} gridLabel
          options={[
            { value: 'warm-white', label: 'Warm White' },
            { value: 'cool-white', label: 'Cool White' },
            { value: 'daylight', label: 'Daylight' },
            { value: 'yellow', label: 'Yellow' },
          ]}
        />
        <SelectField
          label="Brightness" fieldKey="7-light-lumen" value={getField('7-light-lumen')}
          onChange={updateField} gridLabel
          options={[
            { value: 'bright', label: 'Bright (>800 lm)' },
            { value: 'adequate', label: 'Adequate (400-800 lm)' },
            { value: 'dim', label: 'Dim (<400 lm)' },
          ]}
        />
      </FieldGrid>

      <div className="sub-section-title">Backup</div>
      <FieldGrid>
        <RadioGroup
          label="DG Backup" fieldKey="7-dg" value={getField('7-dg')}
          onChange={updateField} gridLabel
          options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
        />
        <RadioGroup
          label="Inverter Backup" fieldKey="7-inv" value={getField('7-inv')}
          onChange={updateField} gridLabel
          options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
        />
      </FieldGrid>

      <div className="sub-section-title">Heating & Pipes</div>

      <SelectField
        label="Geyser" fieldKey="7-geyser" value={getField('7-geyser')}
        onChange={updateField}
        options={[
          { value: 'electric-working', label: 'Electric — Working' },
          { value: 'electric-not-working', label: 'Electric — Not Working' },
          { value: 'solar', label: 'Solar' },
          { value: 'instant', label: 'Instant Heater' },
          { value: 'none', label: 'None' },
        ]}
      />

      <FieldGrid>
        <SelectField
          label="Pipe Status" fieldKey="7-pipe-status" value={getField('7-pipe-status')}
          onChange={updateField} gridLabel
          options={[
            { value: 'good-insulated', label: 'Good — Insulated' },
            { value: 'good-exposed', label: 'Good — Exposed' },
            { value: 'leaking', label: 'Leaking' },
            { value: 'damaged', label: 'Damaged' },
            { value: 'rusted', label: 'Rusted' },
          ]}
        />
        <SelectField
          label="Thermostat Status" fieldKey="7-thermostat" value={getField('7-thermostat')}
          onChange={updateField} gridLabel
          options={[
            { value: 'available-working', label: 'Available & Working' },
            { value: 'available-not-working', label: 'Not Working' },
            { value: 'not-available', label: 'Not Available' },
          ]}
        />
      </FieldGrid>

      <SectionComments
        fieldKey="7-comments"
        value={getField('7-comments')}
        onChange={updateField}
        placeholder="Electrical safety concerns, heating issues, pipe conditions..."
      />
      <PhotoUpload sectionId="7" photos={photos} onAdd={addPhotos} onRemove={removePhoto} />
    </>
  );
}
