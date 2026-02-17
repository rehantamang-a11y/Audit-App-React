import React from 'react';
import SelectField from '../components/fields/SelectField';
import SectionComments from '../components/Section/SectionComments';
import PhotoUpload from '../components/PhotoUpload/PhotoUpload';

export default function WashroomConfiguration({ getField, updateField, photos, addPhotos, removePhoto }) {
  return (
    <>
      <SelectField
        label="Configuration Type"
        fieldKey="6-config-type"
        value={getField('6-config-type')}
        onChange={updateField}
        options={[
          { value: 'powder-room', label: 'Powder Room (Half Bath)' },
          { value: 'full-bath', label: 'Full Bath' },
          { value: 'three-quarter', label: 'Three-Quarter Bath' },
          { value: 'en-suite', label: 'En Suite Bathroom' },
          { value: 'jack-jill', label: 'Jack-and-Jill Bathroom' },
          { value: 'wet-room', label: 'Wet Room' },
          { value: 'family', label: 'Family Bathroom' },
          { value: 'split', label: 'Split Bathroom' },
          { value: 'master', label: 'Master Bathroom' },
          { value: 'compact', label: 'Compact / Corner Bathroom' },
          { value: 'laundry-combo', label: 'Laundry-Bathroom Combo' },
        ]}
      />
      <SectionComments
        fieldKey="6-comments"
        value={getField('6-comments')}
        onChange={updateField}
        placeholder="Layout concerns, space constraints, or special features..."
      />
      <PhotoUpload sectionId="6" photos={photos} onAdd={addPhotos} onRemove={removePhoto} />
    </>
  );
}
