import React from 'react';
import SelectField from '../components/fields/SelectField';
import SectionComments from '../components/Section/SectionComments';
import PhotoUpload from '../components/PhotoUpload/PhotoUpload';

export default function SharpEdgesPlumbing({ getField, updateField, photos, addPhotos, removePhoto }) {
  return (
    <>
      <div className="sub-section-title">Sharp Edges & Hazards</div>

      <SelectField
        label="Slab Corner" fieldKey="4-slab-corner" value={getField('4-slab-corner')}
        onChange={updateField}
        options={[
          { value: 'no-risk', label: 'No Risk — Rounded / Protected' },
          { value: 'low-risk', label: 'Low Risk' },
          { value: 'medium-risk', label: 'Medium Risk' },
          { value: 'high-risk', label: 'High Risk — Immediate action needed' },
        ]}
      />

      <SelectField
        label="Bidet Edges" fieldKey="4-bidet-edges" value={getField('4-bidet-edges')}
        onChange={updateField}
        options={[
          { value: 'no-risk', label: 'No Risk' },
          { value: 'low-risk', label: 'Low Risk' },
          { value: 'medium-risk', label: 'Medium Risk' },
          { value: 'high-risk', label: 'High Risk' },
        ]}
      />

      <SelectField
        label="Protruding Objects" fieldKey="4-protruding" value={getField('4-protruding')}
        onChange={updateField}
        options={[
          { value: 'none', label: 'None' },
          { value: 'hooks-safe', label: 'Hooks — Safely rounded' },
          { value: 'hooks-sharp', label: 'Hooks — Sharp' },
          { value: 'pipes', label: 'Exposed pipes' },
          { value: 'fixtures', label: 'Sharp fixtures' },
        ]}
      />

      <SelectField
        label="Electric Shock Risk" fieldKey="4-electric-risk" value={getField('4-electric-risk')}
        onChange={updateField}
        options={[
          { value: 'no-risk', label: 'No Risk — Properly insulated' },
          { value: 'low-risk', label: 'Low Risk' },
          { value: 'medium-risk', label: 'Medium Risk — Check needed' },
          { value: 'high-risk', label: 'High Risk — Exposed wiring' },
        ]}
      />

      <div className="sub-section-title">Plumbing Drainage</div>

      <SelectField
        label="Shower Drain" fieldKey="4-shower-drain" value={getField('4-shower-drain')}
        onChange={updateField}
        options={[
          { value: 'working-well', label: 'Working well' },
          { value: 'slow', label: 'Slow drainage' },
          { value: 'clogged', label: 'Clogged / Blocked' },
          { value: 'overflowing', label: 'Overflowing' },
          { value: 'no-drain', label: 'No drain' },
        ]}
      />

      <SelectField
        label="Utility Drain" fieldKey="4-utility-drain" value={getField('4-utility-drain')}
        onChange={updateField}
        options={[
          { value: 'working-well', label: 'Working well' },
          { value: 'slow', label: 'Slow drainage' },
          { value: 'clogged', label: 'Clogged / Blocked' },
          { value: 'not-available', label: 'Not available' },
        ]}
      />

      <SelectField
        label="WC Drain" fieldKey="4-wc-drain" value={getField('4-wc-drain')}
        onChange={updateField}
        options={[
          { value: 'working-well', label: 'Working well' },
          { value: 'slow', label: 'Slow drainage' },
          { value: 'frequent-clog', label: 'Frequent clogging' },
          { value: 'odor', label: 'Odour issues' },
        ]}
      />

      <SelectField
        label="Sink Drain" fieldKey="4-sink-drain" value={getField('4-sink-drain')}
        onChange={updateField}
        options={[
          { value: 'working-well', label: 'Working well' },
          { value: 'slow', label: 'Slow drainage' },
          { value: 'clogged', label: 'Clogged' },
          { value: 'leaking', label: 'Leaking' },
        ]}
      />

      <SectionComments
        fieldKey="4-comments"
        value={getField('4-comments')}
        onChange={updateField}
        placeholder="Describe sharp edges, immediate risks, or drain issues that need urgent attention..."
      />
      <PhotoUpload sectionId="4" photos={photos} onAdd={addPhotos} onRemove={removePhoto} />
    </>
  );
}
