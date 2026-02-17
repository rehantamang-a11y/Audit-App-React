import { useState, useCallback, useEffect } from 'react';
import { saveDraft, loadDraft } from '../utils/storage';

export function useFormData() {
  const [formData, setFormData] = useState(() => {
    const draft = loadDraft();
    return draft || {
      meta: { auditor: '', date: new Date().toISOString().split('T')[0], location: '' },
      fields: {},
      timestamp: new Date().toISOString(),
    };
  });

  const [hasDraft, setHasDraft] = useState(() => !!loadDraft());

  const updateMeta = useCallback((key, value) => {
    setFormData(prev => ({
      ...prev,
      meta: { ...prev.meta, [key]: value },
    }));
  }, []);

  const updateField = useCallback((fieldKey, value) => {
    setFormData(prev => ({
      ...prev,
      fields: { ...prev.fields, [fieldKey]: value },
    }));
  }, []);

  const getField = useCallback((fieldKey) => {
    return formData.fields[fieldKey] ?? '';
  }, [formData.fields]);

  const handleSaveDraft = useCallback(() => {
    saveDraft({ ...formData, timestamp: new Date().toISOString() });
  }, [formData]);

  // Clear draft restored flag after initial load
  useEffect(() => {
    if (hasDraft) setHasDraft(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    formData,
    updateMeta,
    updateField,
    getField,
    handleSaveDraft,
    hasDraft,
  };
}
