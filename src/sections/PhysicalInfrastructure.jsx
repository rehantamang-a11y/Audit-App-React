import React from 'react';
import SelectField from '../components/fields/SelectField';
import TextField from '../components/fields/TextField';
import FieldGrid from '../components/fields/FieldGrid';
import SectionComments from '../components/Section/SectionComments';
import PhotoUpload from '../components/PhotoUpload/PhotoUpload';

export default function PhysicalInfrastructure({ getField, updateField, photos, addPhotos, removePhoto }) {
  return (
    <>
      <div className="sub-section-title">Floor</div>
      <SelectField
        label="Surface Type"
        fieldKey="1-floor-type"
        value={getField('1-floor-type')}
        onChange={updateField}
        options={[
          { value: 'ceramic-tiles', label: 'Ceramic Tiles' },
          { value: 'vitrified-tiles', label: 'Vitrified Tiles' },
          { value: 'mosaic', label: 'Mosaic' },
          { value: 'marble', label: 'Marble' },
          { value: 'granite', label: 'Granite' },
          { value: 'anti-skid-tiles', label: 'Anti-Skid Tiles' },
          { value: 'vinyl', label: 'Vinyl' },
          { value: 'other', label: 'Other' },
        ]}
      />
      <FieldGrid>
        <SelectField
          label="Availability"
          fieldKey="1-floor-avail"
          value={getField('1-floor-avail')}
          onChange={updateField}
          gridLabel
          options={[
            { value: 'yes', label: 'Present' },
            { value: 'no', label: 'Missing / Broken' },
          ]}
        />
        <SelectField
          label="Quality / Condition"
          fieldKey="1-floor-quality"
          value={getField('1-floor-quality')}
          onChange={updateField}
          gridLabel
          options={[
            { value: 'excellent', label: 'Excellent' },
            { value: 'good', label: 'Good' },
            { value: 'fair', label: 'Fair' },
            { value: 'poor', label: 'Poor' },
            { value: 'needs-replacement', label: 'Needs Replacement' },
          ]}
        />
      </FieldGrid>
      <div style={{ marginTop: 12 }}>
        <TextField
          label="Floor Color"
          fieldKey="1-floor-color"
          value={getField('1-floor-color')}
          onChange={updateField}
          placeholder="e.g., White, Beige, Grey"
        />
      </div>

      <div className="sub-section-title">Walls</div>
      <FieldGrid>
        <SelectField
          label="Wall Type"
          fieldKey="1-wall-type"
          value={getField('1-wall-type')}
          onChange={updateField}
          gridLabel
          options={[
            { value: 'ceramic-tiles', label: 'Ceramic Tiles' },
            { value: 'vitrified-tiles', label: 'Vitrified Tiles' },
            { value: 'paint', label: 'Paint' },
            { value: 'waterproof-paint', label: 'Waterproof Paint' },
            { value: 'pvc-panels', label: 'PVC Panels' },
            { value: 'glass', label: 'Glass' },
            { value: 'other', label: 'Other' },
          ]}
        />
        <TextField
          label="Wall Color"
          fieldKey="1-wall-color"
          value={getField('1-wall-color')}
          onChange={updateField}
          placeholder="e.g., White, Cream"
          gridLabel
        />
      </FieldGrid>

      <div className="sub-section-title">Lighting</div>
      <SelectField
        label="Washroom Light Adequacy"
        fieldKey="1-washroom-light"
        value={getField('1-washroom-light')}
        onChange={updateField}
        options={[
          { value: 'bright', label: 'Bright — No issues' },
          { value: 'adequate', label: 'Adequate' },
          { value: 'dim', label: 'Dim — Improvement needed' },
          { value: 'insufficient', label: 'Insufficient — Risk for elderly' },
        ]}
      />

      <SectionComments
        fieldKey="1-comments"
        value={getField('1-comments')}
        onChange={updateField}
        placeholder="Note observations, defects, or recommendations for this section..."
      />
      <PhotoUpload
        sectionId="1"
        photos={photos}
        onAdd={addPhotos}
        onRemove={removePhoto}
      />
    </>
  );
}
