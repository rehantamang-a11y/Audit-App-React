import React, { useState, useCallback, useEffect } from 'react';
import { generatePdf } from './utils/generatePdf';
import Header from './components/Header/Header';
import MetaBar from './components/MetaBar/MetaBar';
import Section from './components/Section/Section';
import ActionBar from './components/ActionBar/ActionBar';
import Toast from './components/Toast/Toast';
import { useFormContext } from './context/FormContext';
import { usePhotoContext } from './context/PhotoContext';

import PhysicalInfrastructure from './sections/PhysicalInfrastructure';
import Accessories from './sections/Accessories';
import WashroomFixtures from './sections/WashroomFixtures';
import SharpEdgesPlumbing from './sections/SharpEdgesPlumbing';
import UserProfiles from './sections/UserProfiles';
import WashroomConfiguration from './sections/WashroomConfiguration';
import ElectricalLightingHeating from './sections/ElectricalLightingHeating';
import AccessExit from './sections/AccessExit';

import './App.css';

const SECTIONS = [
  { id: 's1', number: 1, title: 'Physical Civil Infrastructure', badge: 'Floor · Walls · Light', hint: 'Inspect the floor surface, wall finishing, and overall lighting quality.', Component: PhysicalInfrastructure },
  { id: 's2', number: 2, title: 'Accessories', badge: 'Mats · Racks · Hooks', hint: 'Anti-skid mat and outdoor PVC mat are critical safety items — flag if missing or worn.', Component: Accessories },
  { id: 's3', number: 3, title: 'Washroom Fixtures', badge: 'Commode · Taps · Shower', hint: 'Check each fixture for availability, working condition, leaks, or pressure issues.', Component: WashroomFixtures },
  { id: 's4', number: 4, title: 'Sharp Edges & Plumbing', badge: 'Hazards · Drains', hint: 'Rate each hazard. Flag any High Risk items for immediate action in your comments.', Component: SharpEdgesPlumbing },
  { id: 's5', number: 5, title: 'User Profiles', badge: 'Multiple users supported', hint: 'Add a profile for each person who uses this bathroom. More users = more personalised safety assessment.', Component: UserProfiles },
  { id: 's6', number: 6, title: 'Washroom Configuration', badge: 'Type · Layout', hint: 'Select the bathroom type that best describes this space\'s layout.', Component: WashroomConfiguration },
  { id: 's7', number: 7, title: 'Electrical, Lighting & Heating', badge: 'Power · Geyser · Pipes', hint: 'Verify power sources, backup availability, geyser function, and pipe condition.', Component: ElectricalLightingHeating },
  { id: 's8', number: 8, title: 'Access & Exit', badge: 'Door · Steps · Path', hint: 'Steps, floor transitions, and door type are critical for fall risk — especially for night-time bathroom visits.', Component: AccessExit },
];

export default function App() {
  const { formData, updateMeta, updateField, getField, handleSaveDraft, resetForm, hasDraft } = useFormContext();
  const { photos, addPhotos, removePhoto, getPhotos, photoError, clearPhotoError, resetPhotos } = usePhotoContext();
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [toast, setToast] = useState(hasDraft ? 'Draft restored' : '');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (photoError) {
      setToast(photoError);
      clearPhotoError();
    }
  }, [photoError, clearPhotoError]);

  const toggleSection = useCallback((id) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const onSaveDraft = () => {
    handleSaveDraft();
    setToast('Draft saved');
  };

  const onExportPdf = () => {
    if (isExporting) return;
    setIsExporting(true);
    setToast('Generating PDF…');
    // Small timeout lets the toast render before the synchronous PDF work blocks the thread
    setTimeout(() => {
      try {
        generatePdf(formData, photos);
        setToast('PDF saved!');
      } catch (err) {
        setToast(err.message || 'PDF export failed. Please try again.');
      } finally {
        setIsExporting(false);
      }
    }, 80);
  };

  const hasActiveData =
    Object.keys(formData.fields).length > 0 ||
    !!formData.meta.auditor ||
    !!formData.meta.location;

  const onNewAudit = () => {
    if (!window.confirm('Start a new audit? This will clear all current form data and photos.')) return;
    resetForm();
    resetPhotos();
    setExpandedSections(new Set());
  };

  return (
    <div className="container">
      <Header expandedCount={expandedSections.size} totalSections={SECTIONS.length} />
      <MetaBar meta={formData.meta} onUpdate={updateMeta} />

      <div className="content">
        {SECTIONS.map(({ id, number, title, badge, hint, Component }) => (
          <Section
            key={id}
            number={number}
            title={title}
            badge={badge}
            hint={hint}
            expanded={expandedSections.has(id)}
            onToggle={() => toggleSection(id)}
          >
            <Component
              getField={getField}
              updateField={updateField}
              photos={getPhotos(String(number))}
              addPhotos={addPhotos}
              removePhoto={removePhoto}
            />
          </Section>
        ))}
      </div>

      <ActionBar onSaveDraft={onSaveDraft} onExportPdf={onExportPdf} onNewAudit={onNewAudit} hasActiveData={hasActiveData} isExporting={isExporting} />
      <Toast message={toast} onDone={() => setToast('')} />
    </div>
  );
}
