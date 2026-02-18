import React from 'react';
import SelectField from './SelectField';
import TextField from './TextField';
import TextAreaField from './TextAreaField';
import RadioGroup from './RadioGroup';
import CheckGroup from './CheckGroup';
import ConditionalField from './ConditionalField';
import FieldGrid from './FieldGrid';
import { useFormContext } from '../../context/FormContext';

function SingleField({ field, errors }) {
  const { getField, updateField } = useFormContext();
  const error = errors?.[field.key];
  const gridLabel = field._gridLabel;

  switch (field.type) {
    case 'select':
      return (
        <SelectField
          label={field.label}
          fieldKey={field.key}
          value={getField(field.key)}
          onChange={updateField}
          options={field.options}
          gridLabel={gridLabel}
          error={error}
        />
      );
    case 'text':
      return (
        <div style={field.wrapStyle}>
          <TextField
            label={field.label}
            fieldKey={field.key}
            value={getField(field.key)}
            onChange={updateField}
            placeholder={field.placeholder}
            type={field.inputType || 'text'}
            min={field.min}
            max={field.max}
            gridLabel={gridLabel}
            error={error}
          />
        </div>
      );
    case 'textarea':
      return (
        <TextAreaField
          label={field.label}
          fieldKey={field.key}
          value={getField(field.key)}
          onChange={updateField}
          placeholder={field.placeholder}
          minHeight={field.minHeight}
          error={error}
        />
      );
    case 'radio':
      return (
        <RadioGroup
          label={field.label}
          fieldKey={field.key}
          value={getField(field.key)}
          onChange={updateField}
          options={field.options}
          gridLabel={gridLabel}
          error={error}
        />
      );
    default:
      return null;
  }
}

function AccessoryRow({ field, errors }) {
  const { getField, updateField } = useFormContext();
  const availKey = `${field.prefix}-avail`;
  const condKey = `${field.prefix}-cond`;
  const conditionOptions = field.condOptions || [
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
  ];
  const availOptions = field.availOptions || [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ];

  return (
    <div className="field-group">
      <label className="field-label">{field.label}</label>
      <FieldGrid>
        <SelectField
          label="Available?"
          fieldKey={availKey}
          value={getField(availKey)}
          onChange={updateField}
          gridLabel
          options={availOptions}
          error={errors?.[availKey]}
        />
        <ConditionalField triggerValue={getField(availKey)}>
          <SelectField
            label="Condition"
            fieldKey={condKey}
            value={getField(condKey)}
            onChange={updateField}
            gridLabel
            options={conditionOptions}
          />
        </ConditionalField>
      </FieldGrid>
    </div>
  );
}

function AvailConditionRow({ field, errors }) {
  const { getField, updateField } = useFormContext();
  const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];

  return (
    <div className="field-group">
      <label className="field-label">{field.label}</label>
      <FieldGrid>
        <SelectField
          label="Available?"
          fieldKey={field.availKey}
          value={getField(field.availKey)}
          onChange={updateField}
          gridLabel
          options={yesNo}
          error={errors?.[field.availKey]}
        />
        <ConditionalField triggerValue={getField(field.availKey)}>
          <SelectField
            label="Condition"
            fieldKey={field.condKey}
            value={getField(field.condKey)}
            onChange={updateField}
            gridLabel
            options={field.condOptions}
          />
        </ConditionalField>
      </FieldGrid>
    </div>
  );
}

function LabeledGrid({ field, errors }) {
  const { getField } = useFormContext();

  return (
    <div className="field-group">
      <label className="field-label">{field.label}</label>
      <FieldGrid>
        {field.fields.map((f) => {
          if (f.condition) {
            const triggerVal = getField(f.condition.field);
            return (
              <ConditionalField key={f.key} triggerValue={triggerVal} hideValue={f.condition.hideValue}>
                <SingleField field={{ ...f, _gridLabel: true }} errors={errors} />
              </ConditionalField>
            );
          }
          return <SingleField key={f.key} field={{ ...f, _gridLabel: true }} errors={errors} />;
        })}
      </FieldGrid>
    </div>
  );
}

export default function FieldRenderer({ fields, errors }) {
  return (
    <>
      {fields.map((field, idx) => {
        switch (field.type) {
          case 'subsection':
            return <div key={idx} className="sub-section-title">{field.label}</div>;

          case 'grid':
            return (
              <FieldGrid key={idx} style={field.wrapStyle}>
                {field.fields.map((f) => (
                  <SingleField key={f.key} field={{ ...f, _gridLabel: true }} errors={errors} />
                ))}
              </FieldGrid>
            );

          case 'labeled-grid':
            return <LabeledGrid key={idx} field={field} errors={errors} />;

          case 'accessory':
            return <AccessoryRow key={field.prefix} field={field} errors={errors} />;

          case 'avail-condition':
            return <AvailConditionRow key={field.availKey} field={field} errors={errors} />;

          case 'select':
          case 'text':
          case 'textarea':
          case 'radio':
            return <SingleField key={field.key} field={field} errors={errors} />;

          case 'checkgroup':
            return null; // handled in UserProfile

          default:
            return null;
        }
      })}
    </>
  );
}
