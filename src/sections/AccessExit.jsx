import React from 'react';
import SelectField from '../components/fields/SelectField';
import FieldGrid from '../components/fields/FieldGrid';
import SectionComments from '../components/Section/SectionComments';
import PhotoUpload from '../components/PhotoUpload/PhotoUpload';

export default function AccessExit({ getField, updateField, photos, addPhotos, removePhoto }) {
  return (
    <>
      <SelectField
        label="Step on Floor (Threshold)" fieldKey="8-step" value={getField('8-step')}
        onChange={updateField}
        options={[
          { value: 'none', label: 'No Step — Level entry' },
          { value: 'small', label: 'Small Step (<2 inches)' },
          { value: 'medium', label: 'Medium Step (2-4 inches)' },
          { value: 'large', label: 'Large Step (>4 inches)' },
        ]}
      />

      <FieldGrid>
        <SelectField
          label="Level Variation" fieldKey="8-level-variation" value={getField('8-level-variation')}
          onChange={updateField} gridLabel
          options={[
            { value: 'none', label: 'None — Level floor' },
            { value: 'slight', label: 'Slight variation' },
            { value: 'significant', label: 'Significant' },
            { value: 'tripping-hazard', label: 'Tripping hazard' },
          ]}
        />
        <SelectField
          label="Floor Variation Inside" fieldKey="8-floor-variation" value={getField('8-floor-variation')}
          onChange={updateField} gridLabel
          options={[
            { value: 'level', label: 'Level throughout' },
            { value: 'slight-slope', label: 'Slight slope (drainage)' },
            { value: 'uneven', label: 'Uneven' },
            { value: 'hazardous', label: 'Hazardous' },
          ]}
        />
      </FieldGrid>

      <div style={{ marginTop: 12 }}>
        <SelectField
          label="Lighting Outside Bathroom Door" fieldKey="8-outside-lighting"
          value={getField('8-outside-lighting')} onChange={updateField}
          options={[
            { value: 'bright', label: 'Bright' },
            { value: 'adequate', label: 'Adequate' },
            { value: 'dim', label: 'Dim' },
            { value: 'none', label: 'None / Dark' },
            { value: 'motion-sensor', label: 'Motion Sensor Light' },
          ]}
        />
      </div>

      <FieldGrid>
        <SelectField
          label="Door Type" fieldKey="8-door-type" value={getField('8-door-type')}
          onChange={updateField} gridLabel
          options={[
            { value: 'hinged-outward', label: 'Hinged — Opens Outward' },
            { value: 'hinged-inward', label: 'Hinged — Opens Inward' },
            { value: 'sliding', label: 'Sliding' },
            { value: 'folding', label: 'Folding' },
          ]}
        />
        <SelectField
          label="Door Width" fieldKey="8-door-width" value={getField('8-door-width')}
          onChange={updateField} gridLabel
          options={[
            { value: 'wide', label: 'Wide (>32 inches)' },
            { value: 'standard', label: 'Standard (30-32 in)' },
            { value: 'narrow', label: 'Narrow (<30 inches)' },
          ]}
        />
      </FieldGrid>

      <SectionComments
        fieldKey="8-comments"
        value={getField('8-comments')}
        onChange={updateField}
        placeholder="Tripping hazards, poor lighting on path, door concerns..."
      />
      <PhotoUpload sectionId="8" photos={photos} onAdd={addPhotos} onRemove={removePhoto} />
    </>
  );
}
