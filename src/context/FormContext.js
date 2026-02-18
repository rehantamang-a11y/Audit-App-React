import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { saveDraft, loadDraft, clearDraft } from '../utils/storage';

const FormContext = createContext(null);

const initialState = {
  meta: { auditor: '', date: new Date().toISOString().split('T')[0], location: '' },
  fields: {},
  timestamp: null,
  lastSaved: null,
};

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_META':
      return { ...state, meta: { ...state.meta, [action.key]: action.value } };
    case 'SET_FIELD':
      return { ...state, fields: { ...state.fields, [action.key]: action.value } };
    case 'RESTORE':
      return { ...action.data, lastSaved: action.data.timestamp };
    case 'MARK_SAVED':
      return { ...state, timestamp: action.timestamp, lastSaved: action.timestamp };
    case 'RESET':
      return {
        meta: { auditor: '', date: new Date().toISOString().split('T')[0], location: '' },
        fields: {},
        timestamp: null,
        lastSaved: null,
      };
    default:
      return state;
  }
}

export function FormProvider({ children }) {
  const [state, dispatch] = useReducer(formReducer, null, () => {
    const draft = loadDraft();
    return draft ? { ...draft, lastSaved: draft.timestamp } : initialState;
  });
  const hasDraft = useRef(state.timestamp !== null);

  const updateMeta = useCallback((key, value) => {
    dispatch({ type: 'SET_META', key, value });
  }, []);

  const updateField = useCallback((key, value) => {
    dispatch({ type: 'SET_FIELD', key, value });
  }, []);

  const getField = useCallback((key) => {
    return state.fields[key] ?? '';
  }, [state.fields]);

  const handleSaveDraft = useCallback(() => {
    const now = new Date().toISOString();
    saveDraft({ meta: state.meta, fields: state.fields, timestamp: now });
    dispatch({ type: 'MARK_SAVED', timestamp: now });
  }, [state.meta, state.fields]);

  const resetForm = useCallback(() => {
    clearDraft();
    dispatch({ type: 'RESET' });
  }, []);

  // Auto-save every 30 seconds
  const stateRef = useRef(state);
  stateRef.current = state;
  useEffect(() => {
    const interval = setInterval(() => {
      const s = stateRef.current;
      // Only auto-save if there's data
      if (Object.keys(s.fields).length > 0 || s.meta.auditor || s.meta.location) {
        const now = new Date().toISOString();
        saveDraft({ meta: s.meta, fields: s.fields, timestamp: now });
        dispatch({ type: 'MARK_SAVED', timestamp: now });
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <FormContext.Provider value={{
      formData: state,
      updateMeta,
      updateField,
      getField,
      handleSaveDraft,
      resetForm,
      hasDraft: hasDraft.current,
    }}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error('useFormContext must be used within FormProvider');
  return ctx;
}
