import React from 'react';
import SelectField from '../components/fields/SelectField';
import ConditionalField from '../components/fields/ConditionalField';
import FieldGrid from '../components/fields/FieldGrid';
import SectionComments from '../components/Section/SectionComments';
import PhotoUpload from '../components/PhotoUpload/PhotoUpload';

const conditionOptions = [
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
];

function AccessoryRow({ label, prefix, getField, updateField, noOptions, condOptions }) {
  const availKey = `${prefix}-avail`;
  const condKey = `${prefix}-cond`;

  return (
    <div className="field-group">
      <label className="field-label">{label}</label>
      <FieldGrid>
        <SelectField
          label="Available?"
          fieldKey={availKey}
          value={getField(availKey)}
          onChange={updateField}
          gridLabel
          options={noOptions || [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
        />
        <ConditionalField triggerValue={getField(availKey)}>
          <SelectField
            label="Condition"
            fieldKey={condKey}
            value={getField(condKey)}
            onChange={updateField}
            gridLabel
            options={condOptions || conditionOptions}
          />
        </ConditionalField>
      </FieldGrid>
    </div>
  );
}

export default function Accessories({ getField, updateField, photos, addPhotos, removePhoto }) {
  const items = [
    { label: 'Bucket', prefix: '2-bucket' },
    { label: 'Round Tub', prefix: '2-tub' },
    { label: 'Plastic Stool', prefix: '2-stool' },
    { label: 'Racks', prefix: '2-racks' },
    { label: 'Wiper', prefix: '2-wiper' },
    { label: 'Wiper Wall Stand', prefix: '2-wiperstand' },
    { label: 'Towel Hanger', prefix: '2-towel' },
  ];

  return (
    <>
      {items.map(item => (
        <AccessoryRow
          key={item.prefix}
          label={item.label}
          prefix={item.prefix}
          getField={getField}
          updateField={updateField}
        />
      ))}

      <AccessoryRow
        label="Anti-Skid Mat"
        prefix="2-antiskid"
        getField={getField}
        updateField={updateField}
        noOptions={[
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No — Recommend immediately' },
        ]}
        condOptions={[
          { value: 'good', label: 'Good' },
          { value: 'fair', label: 'Fair' },
          { value: 'poor', label: 'Poor — Replace' },
        ]}
      />

      <AccessoryRow
        label="PVC Floor Outdoor Mat"
        prefix="2-pvcmat"
        getField={getField}
        updateField={updateField}
      />

      <SectionComments
        fieldKey="2-comments"
        value={getField('2-comments')}
        onChange={updateField}
        placeholder="Missing items, urgent replacements, or general observations..."
      />
      <PhotoUpload
        sectionId="2"
        photos={photos}
        onAdd={addPhotos}
        onRemove={removePhoto}
      />
    </>
  );
}
