// ============================================================
// SECTION BUILDER — STATE MANAGEMENT
// React Context + useReducer with undo/redo history
// Supports optimistic creation (works even without server)
// ============================================================

import React, { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import type { ISectionSchema, BuilderMode } from './types';

// ============================================================
// STATE
// ============================================================

interface BuilderState {
  sections: ISectionSchema[];
  selectedId: string | null;
  mode: BuilderMode;
  isSaving: boolean;
  lastSaved: number | null;
  hasUnsavedChanges: boolean;
}

const initialState: BuilderState = {
  sections: [],
  selectedId: null,
  mode: 'edit',
  isSaving: false,
  lastSaved: null,
  hasUnsavedChanges: false,
};

// ============================================================
// ACTIONS
// ============================================================

type BuilderAction =
  | { type: 'SET_SECTIONS'; payload: ISectionSchema[] }
  | { type: 'ADD_SECTION'; payload: ISectionSchema }
  | { type: 'UPDATE_SECTION'; payload: { id: string; updates: Partial<ISectionSchema> } }
  | { type: 'UPDATE_SECTION_CONTENT'; payload: { id: string; content: Partial<ISectionSchema['content']> } }
  | { type: 'UPDATE_SECTION_STYLE'; payload: { id: string; style: Partial<ISectionSchema['style']> } }
  | { type: 'UPDATE_SECTION_ANIMATION'; payload: { id: string; animation: Partial<ISectionSchema['animation']> } }
  | { type: 'DELETE_SECTION'; payload: string }
  | { type: 'REORDER_SECTIONS'; payload: { sourceIndex: number; destIndex: number } }
  | { type: 'DUPLICATE_SECTION'; payload: string }
  | { type: 'SET_SELECTED'; payload: string | null }
  | { type: 'SET_MODE'; payload: BuilderMode }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'MARK_SAVED' }
  | { type: 'UNDO' }
  | { type: 'REDO' };

// ============================================================
// TEMP ID GENERATOR
// ============================================================

let tempIdCounter = 0;
function generateTempId(): string {
  tempIdCounter++;
  return `temp_${Date.now()}_${tempIdCounter}`;
}

// ============================================================
// REDUCER
// ============================================================

function builderReducer(state: BuilderState, action: BuilderAction): BuilderState {
  switch (action.type) {
    case 'SET_SECTIONS':
      return { ...state, sections: action.payload, hasUnsavedChanges: false };

    case 'ADD_SECTION': {
      const section = action.payload._id ? action.payload : { ...action.payload, _id: generateTempId() };
      const newSections = [...state.sections, section].map((s, i) => ({ ...s, order: i }));
      return {
        ...state,
        sections: newSections,
        selectedId: section._id || null,
        hasUnsavedChanges: true,
      };
    }

    case 'UPDATE_SECTION': {
      const sections = state.sections.map(s =>
        s._id === action.payload.id ? { ...s, ...action.payload.updates } : s
      );
      return { ...state, sections, hasUnsavedChanges: true };
    }

    case 'UPDATE_SECTION_CONTENT': {
      const sections = state.sections.map(s =>
        s._id === action.payload.id
          ? { ...s, content: { ...s.content, ...action.payload.content } }
          : s
      );
      return { ...state, sections, hasUnsavedChanges: true };
    }

    case 'UPDATE_SECTION_STYLE': {
      const sections = state.sections.map(s =>
        s._id === action.payload.id
          ? { ...s, style: { ...s.style, ...action.payload.style } }
          : s
      );
      return { ...state, sections, hasUnsavedChanges: true };
    }

    case 'UPDATE_SECTION_ANIMATION': {
      const sections = state.sections.map(s =>
        s._id === action.payload.id
          ? { ...s, animation: { ...s.animation, ...action.payload.animation } }
          : s
      );
      return { ...state, sections, hasUnsavedChanges: true };
    }

    case 'DELETE_SECTION': {
      const sections = state.sections
        .filter(s => s._id !== action.payload)
        .map((s, i) => ({ ...s, order: i }));
      return {
        ...state,
        sections,
        selectedId: state.selectedId === action.payload ? null : state.selectedId,
        hasUnsavedChanges: true,
      };
    }

    case 'REORDER_SECTIONS': {
      const items = [...state.sections];
      const [moved] = items.splice(action.payload.sourceIndex, 1);
      items.splice(action.payload.destIndex, 0, moved);
      const reordered = items.map((s, i) => ({ ...s, order: i }));
      return { ...state, sections: reordered, hasUnsavedChanges: true };
    }

    case 'DUPLICATE_SECTION': {
      const original = state.sections.find(s => s._id === action.payload);
      if (!original) return state;
      const clone: ISectionSchema = {
        ...structuredClone(original),
        _id: generateTempId(),
        name: `${original.name} (Copy)`,
        order: state.sections.length,
      };
      return {
        ...state,
        sections: [...state.sections, clone].map((s, i) => ({ ...s, order: i })),
        selectedId: clone._id ?? null,
        hasUnsavedChanges: true,
      };
    }

    case 'SET_SELECTED':
      return { ...state, selectedId: action.payload };

    case 'SET_MODE':
      return { ...state, mode: action.payload, selectedId: action.payload === 'preview' ? null : state.selectedId };

    case 'SET_SAVING':
      return { ...state, isSaving: action.payload };

    case 'MARK_SAVED':
      return { ...state, isSaving: false, lastSaved: Date.now(), hasUnsavedChanges: false };

    default:
      return state;
  }
}

// ============================================================
// HISTORY WRAPPER (UNDO/REDO)
// ============================================================

interface HistoryState {
  past: BuilderState[];
  present: BuilderState;
  future: BuilderState[];
}

const MAX_HISTORY = 20;

function historyReducer(historyState: HistoryState, action: BuilderAction): HistoryState {
  const { past, present, future } = historyState;

  if (action.type === 'UNDO') {
    if (past.length === 0) return historyState;
    const previous = past[past.length - 1];
    return { past: past.slice(0, -1), present: previous, future: [present, ...future] };
  }

  if (action.type === 'REDO') {
    if (future.length === 0) return historyState;
    const next = future[0];
    return { past: [...past, present], present: next, future: future.slice(1) };
  }

  const newPresent = builderReducer(present, action);

  const skipHistoryActions = ['SET_SELECTED', 'SET_MODE', 'SET_SAVING', 'MARK_SAVED', 'SET_SECTIONS'];
  if (skipHistoryActions.includes(action.type)) {
    return { ...historyState, present: newPresent };
  }

  const newPast = [...past, present].slice(-MAX_HISTORY);
  return { past: newPast, present: newPresent, future: [] };
}

// ============================================================
// CONTEXT
// ============================================================

interface BuilderContextType {
  state: BuilderState;
  dispatch: React.Dispatch<BuilderAction>;
  selectedSection: ISectionSchema | null;
  canUndo: boolean;
  canRedo: boolean;
  saveAllSections: () => Promise<void>;
  createSection: (section: ISectionSchema) => Promise<void>;
  deleteSection: (id: string) => Promise<void>;
  duplicateSection: (id: string) => Promise<void>;
  uploadImage: (file: File) => Promise<string | null>;
}

const BuilderContext = createContext<BuilderContextType | null>(null);

export function useBuilder() {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error('useBuilder must be used inside BuilderProvider');
  return ctx;
}

// ============================================================
// PROVIDER
// ============================================================

export function BuilderProvider({ children }: { children: React.ReactNode }) {
  const [history, dispatchHistory] = useReducer(historyReducer, {
    past: [],
    present: initialState,
    future: [],
  });

  const state = history.present;
  const dispatch = dispatchHistory;
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const getToken = () => localStorage.getItem('adminToken') || '';
  const selectedSection = state.sections.find(s => s._id === state.selectedId) || null;

  // ── Fetch sections on mount ──
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('https://pr-rj.onrender.com/api/portfolio/sections');
        if (res.ok) {
          const data = await res.json();
          const normalized = (data.data || []).map(normalizeLegacySection);
          dispatch({ type: 'SET_SECTIONS', payload: normalized });
        }
      } catch (err) {
        console.error('[Builder] Fetch failed (server may be down):', err);
        // Sections start empty — user can still add optimistically
      }
    })();
  }, []);

  // ── Debounced auto-save ──
  useEffect(() => {
    if (!state.hasUnsavedChanges) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveAllSections();
    }, 2000);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [state.sections, state.hasUnsavedChanges]);

  // ── API: Save all sections ──
  const saveAllSections = useCallback(async () => {
    const currentState = stateRef.current;
    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      const token = getToken();

      for (const section of currentState.sections) {
        const isTemp = !section._id || section._id.startsWith('temp_');

        if (isTemp) {
          // Create new section on server
          const { _id, ...rest } = section;
          const res = await fetch('https://pr-rj.onrender.com/api/portfolio/sections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(rest),
          });
          if (res.ok) {
            const data = await res.json();
            // Replace temp ID with real server ID
            dispatch({ type: 'UPDATE_SECTION', payload: { id: _id!, updates: { _id: data.data._id } } });
          }
        } else {
          // Update existing section
          await fetch(`https://pr-rj.onrender.com/api/portfolio/sections/${section._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(section),
          });
        }
      }

      // Re-fetch to sync IDs
      const res = await fetch('https://pr-rj.onrender.com/api/portfolio/sections');
      if (res.ok) {
        const data = await res.json();
        const normalized = (data.data || []).map(normalizeLegacySection);
        dispatch({ type: 'SET_SECTIONS', payload: normalized });
      }
      dispatch({ type: 'MARK_SAVED' });
    } catch (err) {
      console.error('[Builder] Save failed (server may be down):', err);
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  }, []);

  // ── API: Create section (optimistic) ──
  const createSection = useCallback(async (section: ISectionSchema) => {
    // Add immediately with temp ID (works without server)
    const tempId = generateTempId();
    const optimisticSection = { ...section, _id: tempId };
    dispatch({ type: 'ADD_SECTION', payload: optimisticSection });

    // Try to persist to server
    try {
      const token = getToken();
      const res = await fetch('https://pr-rj.onrender.com/api/portfolio/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(section),
      });
      if (res.ok) {
        const data = await res.json();
        // Swap temp ID for real ID
        dispatch({ type: 'UPDATE_SECTION', payload: { id: tempId, updates: { _id: data.data._id } } });
      }
    } catch (err) {
      console.error('[Builder] Server create failed, section saved locally:', err);
      // Section stays in UI with temp ID — will sync on next save
    }
  }, []);

  // ── API: Delete section ──
  const deleteSection = useCallback(async (id: string) => {
    dispatch({ type: 'DELETE_SECTION', payload: id });

    if (!id.startsWith('temp_')) {
      try {
        const token = getToken();
        await fetch(`https://pr-rj.onrender.com/api/portfolio/sections/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error('[Builder] Delete failed:', err);
      }
    }
  }, []);

  // ── API: Duplicate section (optimistic) ──
  const duplicateSection = useCallback(async (id: string) => {
    const original = stateRef.current.sections.find(s => s._id === id);
    if (!original) return;

    // Add clone locally
    dispatch({ type: 'DUPLICATE_SECTION', payload: id });

    // Try to persist
    try {
      const token = getToken();
      const { _id, ...rest } = original;
      const clone = { ...rest, name: `${original.name} (Copy)`, order: stateRef.current.sections.length };
      const res = await fetch('https://pr-rj.onrender.com/api/portfolio/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(clone),
      });
      if (res.ok) {
        // Will sync on next auto-save/refetch
      }
    } catch (err) {
      console.error('[Builder] Duplicate persist failed:', err);
    }
  }, []);

  // ── API: Upload image ──
  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const token = getToken();
      const res = await fetch('https://pr-rj.onrender.com/api/portfolio/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      return data.success ? data.url : null;
    } catch (err) {
      console.error('[Builder] Upload failed:', err);
      return null;
    }
  }, []);

  const value: BuilderContextType = {
    state, dispatch, selectedSection, canUndo, canRedo,
    saveAllSections, createSection, deleteSection, duplicateSection, uploadImage,
  };

  return (
    <BuilderContext.Provider value={value}>
      {children}
    </BuilderContext.Provider>
  );
}

// ============================================================
// LEGACY NORMALIZATION
// ============================================================

function normalizeLegacySection(raw: any): ISectionSchema {
  const typeMap: Record<string, string> = {
    'text-split': 'split',
    'gallery': 'grid',
    'statement': 'statement',
  };

  const type = raw.type || typeMap[raw.layoutType] || 'custom';

  const oldAnimMap: Record<string, string> = {
    'fade-up': 'fade-up',
    'slide-right': 'slide-right',
    'reveal-scale': 'scale',
    'none': 'none',
  };

  const animation = raw.animation && typeof raw.animation === 'object'
    ? raw.animation
    : {
        entry: oldAnimMap[raw.animation] || 'fade-up',
        scroll: 'none',
        duration: 0.8,
        easing: 'easeOut',
      };

  const content = {
    title: raw.content?.title || raw.content?.heading || '',
    subtitle: raw.content?.subtitle || '',
    description: raw.content?.description || raw.content?.paragraph || '',
    cta: raw.content?.cta || '',
    ctaLink: raw.content?.ctaLink || '',
    media: raw.content?.media || raw.content?.images || [],
    backgroundColor: raw.content?.backgroundColor || '#FFFFFF',
    textColor: raw.content?.textColor || '#0A0A0A',
  };

  const style = raw.style || {
    alignment: 'center' as const,
    padding: '48px 24px',
    theme: 'light' as const,
  };

  return {
    _id: raw._id,
    name: raw.name || 'Untitled Section',
    type,
    layout: raw.layout || 'full-width',
    height: raw.height || 'auto',
    content,
    style,
    animation,
    order: raw.order ?? raw.placementIndex ?? 0,
    visible: raw.visible !== false,
    placementIndex: raw.placementIndex ?? 0,
  };
}
