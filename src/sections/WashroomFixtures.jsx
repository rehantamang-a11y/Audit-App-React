import React from 'react';
import SelectField from '../components/fields/SelectField';
import ConditionalField from '../components/fields/ConditionalField';
import FieldGrid from '../components/fields/FieldGrid';
import SectionComments from '../components/Section/SectionComments';
import PhotoUpload from '../components/PhotoUpload/PhotoUpload';

export default function WashroomFixtures({ getField, updateField, photos, addPhotos, removePhoto }) {
  return (
    <>
      <div className="field-group">
        <label className="field-label">WC Commode</label>
        <FieldGrid>
          <SelectField
            label="Type" fieldKey="3-commode-type" value={getField('3-commode-type')}
            onChange={updateField} gridLabel
            options={[
              { value: 'western', label: 'Western' },
              { value: 'indian', label: 'Indian' },
              { value: 'both', label: 'Both' },
            ]}
          />
          <SelectField
            label="Condition" fieldKey="3-commode-cond" value={getField('3-commode-cond')}
            onChange={updateField} gridLabel
            options={[
              { value: 'good', label: 'Good' },
              { value: 'fair', label: 'Fair' },
              { value: 'poor', label: 'Poor' },
            ]}
          />
        </FieldGrid>
      </div>

      <SelectField
        label="Flush" fieldKey="3-flush" value={getField('3-flush')}
        onChange={updateField}
        options={[
          { value: 'working-good', label: 'Working — Good pressure' },
          { value: 'working-weak', label: 'Working — Weak pressure' },
          { value: 'not-working', label: 'Not Working' },
          { value: 'leaking', label: 'Leaking' },
        ]}
      />

      <div className="field-group">
        <label className="field-label">Bidet / Health Faucet</label>
        <FieldGrid>
          <SelectField
            label="Available?" fieldKey="3-bidet-avail" value={getField('3-bidet-avail')}
            onChange={updateField} gridLabel
            options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
          />
          <ConditionalField triggerValue={getField('3-bidet-avail')}>
            <SelectField
              label="Condition" fieldKey="3-bidet-cond" value={getField('3-bidet-cond')}
              onChange={updateField} gridLabel
              options={[
                { value: 'good', label: 'Good' },
                { value: 'fair', label: 'Fair' },
                { value: 'leaking', label: 'Leaking' },
              ]}
            />
          </ConditionalField>
        </FieldGrid>
      </div>

      <SelectField
        label="Washbasin" fieldKey="3-washbasin" value={getField('3-washbasin')}
        onChange={updateField}
        options={[
          { value: 'good', label: 'Good condition' },
          { value: 'cracked', label: 'Cracked' },
          { value: 'stained', label: 'Stained' },
          { value: 'drainage-issue', label: 'Drainage issue' },
        ]}
      />

      <div className="field-group">
        <label className="field-label">Shower Panel</label>
        <FieldGrid>
          <SelectField
            label="Available?" fieldKey="3-shower-avail" value={getField('3-shower-avail')}
            onChange={updateField} gridLabel
            options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
          />
          <ConditionalField triggerValue={getField('3-shower-avail')}>
            <SelectField
              label="Condition" fieldKey="3-shower-cond" value={getField('3-shower-cond')}
              onChange={updateField} gridLabel
              options={[
                { value: 'good', label: 'Good' },
                { value: 'low-pressure', label: 'Low Pressure' },
                { value: 'leaking', label: 'Leaking' },
              ]}
            />
          </ConditionalField>
        </FieldGrid>
      </div>

      <SelectField
        label="Faucets" fieldKey="3-faucets" value={getField('3-faucets')}
        onChange={updateField}
        options={[
          { value: 'working-good', label: 'Working — Good' },
          { value: 'dripping', label: 'Dripping' },
          { value: 'stiff', label: 'Stiff / Hard to operate' },
          { value: 'not-working', label: 'Not Working' },
        ]}
      />

      <div className="field-group">
        <label className="field-label">Utility Tap</label>
        <FieldGrid>
          <SelectField
            label="Available?" fieldKey="3-utility-avail" value={getField('3-utility-avail')}
            onChange={updateField} gridLabel
            options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
          />
          <ConditionalField triggerValue={getField('3-utility-avail')}>
            <SelectField
              label="Condition" fieldKey="3-utility-cond" value={getField('3-utility-cond')}
              onChange={updateField} gridLabel
              options={[
                { value: 'good', label: 'Good' },
                { value: 'leaking', label: 'Leaking' },
                { value: 'not-working', label: 'Not Working' },
              ]}
            />
          </ConditionalField>
        </FieldGrid>
      </div>

      <SelectField
        label="Hot & Cold Water Mixture" fieldKey="3-water-mix" value={getField('3-water-mix')}
        onChange={updateField}
        options={[
          { value: 'available-working', label: 'Available & Working' },
          { value: 'available-not-working', label: 'Available — Not Working' },
          { value: 'not-available', label: 'Not Available' },
        ]}
      />

      <div className="field-group">
        <label className="field-label">Shaft / Window</label>
        <FieldGrid>
          <SelectField
            label="Type" fieldKey="3-shaft-type" value={getField('3-shaft-type')}
            onChange={updateField} gridLabel
            options={[
              { value: 'window', label: 'Window' },
              { value: 'shaft', label: 'Shaft' },
              { value: 'both', label: 'Both' },
              { value: 'none', label: 'None' },
            ]}
          />
          <ConditionalField triggerValue={getField('3-shaft-type')} hideValue="none">
            <SelectField
              label="Condition" fieldKey="3-shaft-cond" value={getField('3-shaft-cond')}
              onChange={updateField} gridLabel
              options={[
                { value: 'good', label: 'Good' },
                { value: 'blocked', label: 'Blocked' },
                { value: 'damaged', label: 'Damaged' },
              ]}
            />
          </ConditionalField>
        </FieldGrid>
      </div>

      <SelectField
        label="Exhaust Fan" fieldKey="3-exhaust" value={getField('3-exhaust')}
        onChange={updateField}
        options={[
          { value: 'available-working', label: 'Available & Working' },
          { value: 'available-not-working', label: 'Available — Not Working' },
          { value: 'noisy', label: 'Noisy' },
          { value: 'not-available', label: 'Not Available' },
        ]}
      />

      <SectionComments
        fieldKey="3-comments"
        value={getField('3-comments')}
        onChange={updateField}
        placeholder="Leaks, pressure issues, repair recommendations..."
      />
      <PhotoUpload sectionId="3" photos={photos} onAdd={addPhotos} onRemove={removePhoto} />
    </>
  );
}
