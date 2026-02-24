import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { saveDraft, loadDraft, clearDraft } from '../utils/storage';

const FormContext = createContext(null);

const PENDING_SUBMISSIONS_KEY = 'eyeagle_pending_submissions';

const initialState = {
  meta: { auditor: '', date: new Date().toISOString().split('T')[0], location: '' },
  fields: {},
  timestamp: null,
  lastSaved: null,
  syncStatus: 'idle', // 'idle' | 'syncing' | 'success' | 'error' | 'offline'
  syncedAuditId: null,
  syncError: null,
  pendingRetry: false,
  editedAfterSync: false,
};

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_META':
      return {
        ...state,
        meta: { ...state.meta, [action.key]: action.value },
        ...(state.syncStatus === 'success' && { editedAfterSync: true }),
      };
    case 'SET_FIELD':
      return {
        ...state,
        fields: { ...state.fields, [action.key]: action.value },
        ...(state.syncStatus === 'success' && { editedAfterSync: true }),
      };
    case 'RESTORE':
      return {
        ...action.data,
        lastSaved: action.data.timestamp,
        syncStatus: 'idle',
        syncedAuditId: null,
        syncError: null,
        pendingRetry: false,
        editedAfterSync: false,
      };
    case 'MARK_SAVED':
      return { ...state, timestamp: action.timestamp, lastSaved: action.timestamp };
    case 'RESET':
      return {
        meta: { auditor: '', date: new Date().toISOString().split('T')[0], location: '' },
        fields: {},
        timestamp: null,
        lastSaved: null,
        syncStatus: 'idle',
        syncedAuditId: null,
        syncError: null,
        pendingRetry: false,
        editedAfterSync: false,
      };
    case 'SYNC_START':
      return { ...state, syncStatus: 'syncing', syncError: null };
    case 'SYNC_SUCCESS':
      return {
        ...state,
        syncStatus: 'success',
        syncedAuditId: action.auditId,
        syncError: null,
        editedAfterSync: false,
        pendingRetry: false,
      };
    case 'SYNC_ERROR':
      return {
        ...state,
        syncStatus: action.isOffline ? 'offline' : 'error',
        syncError: action.message,
        pendingRetry: true,
      };
    case 'SYNC_RESET':
      return {
        ...state,
        syncStatus: 'idle',
        syncError: null,
        pendingRetry: false,
      };
    default:
      return state;
  }
}

export function FormProvider({ children }) {
  const [state, dispatch] = useReducer(formReducer, null, () => {
    const draft = loadDraft();
    return draft ? { ...draft, ...initialState, lastSaved: draft.timestamp } : initialState;
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
    clearPendingSubmission();
    dispatch({ type: 'RESET' });
  }, []);

  const setSyncStart = useCallback(() => {
    dispatch({ type: 'SYNC_START' });
  }, []);

  const setSyncSuccess = useCallback((auditId) => {
    dispatch({ type: 'SYNC_SUCCESS', auditId });
    clearPendingSubmission();
  }, []);

  const setSyncError = useCallback((message, isOffline = false, riskScore = null) => {
    dispatch({ type: 'SYNC_ERROR', message, isOffline });
    if (isOffline) {
      savePendingSubmission({
        formData: { meta: state.meta, fields: state.fields },
        riskScore,
        timestamp: new Date().toISOString(),
      });
    }
  }, [state]);

  const setSyncReset = useCallback(() => {
    dispatch({ type: 'SYNC_RESET' });
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
      formData: {
        meta: state.meta,
        fields: state.fields,
      },
      syncStatus: state.syncStatus,
      syncedAuditId: state.syncedAuditId,
      syncError: state.syncError,
      pendingRetry: state.pendingRetry,
      editedAfterSync: state.editedAfterSync,
      updateMeta,
      updateField,
      getField,
      handleSaveDraft,
      resetForm,
      hasDraft: hasDraft.current,
      setSyncStart,
      setSyncSuccess,
      setSyncError,
      setSyncReset,
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

// Offline queue helpers
export function savePendingSubmission(submission) {
  try {
    localStorage.setItem(PENDING_SUBMISSIONS_KEY, JSON.stringify(submission));
  } catch (err) {
    console.error('Failed to save pending submission:', err);
  }
}

export function getPendingSubmission() {
  try {
    const raw = localStorage.getItem(PENDING_SUBMISSIONS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('Failed to load pending submission:', err);
    return null;
  }
}

export function clearPendingSubmission() {
  try {
    localStorage.removeItem(PENDING_SUBMISSIONS_KEY);
  } catch (err) {
    console.error('Failed to clear pending submission:', err);
  }
}
