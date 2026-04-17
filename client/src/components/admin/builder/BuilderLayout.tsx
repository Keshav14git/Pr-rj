// ============================================================
// BUILDER LAYOUT — 3-PANEL ORCHESTRATOR
// Light, minimal design with collapsible panels
// ============================================================

import { useState } from 'react';
import {
  Undo2, Redo2, Eye, Pencil, Save, Check, Loader2,
  PanelLeftClose, PanelRightClose, PanelLeft, PanelRight,
} from 'lucide-react';
import { BuilderProvider, useBuilder } from './sectionStore';
import SectionLibrary from './SectionLibrary';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';

function BuilderInner() {
  const { state, dispatch, canUndo, canRedo, saveAllSections } = useBuilder();
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  const isPreview = state.mode === 'preview';

  const handleSave = async () => {
    await saveAllSections();
  };

  const formatSaveTime = () => {
    if (!state.lastSaved) return null;
    const d = new Date(state.lastSaved);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // ── Preview Mode ──
  if (isPreview) {
    return (
      <div className="flex flex-col h-full w-full bg-[#FAFAFA] overflow-hidden">
        {/* Preview toolbar */}
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-5 shrink-0 shadow-sm relative z-10">
          <div className="flex items-center gap-2">
            <Eye size={16} className="text-gray-500" />
            <span className="text-sm font-bold text-gray-900">Preview Mode</span>
          </div>
          <button
            onClick={() => dispatch({ type: 'SET_MODE', payload: 'edit' })}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-[13px] font-bold rounded hover:bg-gray-800 transition-none cursor-pointer"
          >
            <Pencil size={13} />
            Back to Editor
          </button>
        </div>
        <Canvas />
      </div>
    );
  }

  // ── Edit Mode ──
  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden">
      {/* ── Top Toolbar ── */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.02)] relative z-10">
        {/* Left: Panel toggles & Undo/Redo */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setLeftOpen(!leftOpen)}
            className="w-8 h-8 flex items-center justify-center rounded text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-none cursor-pointer"
            title={leftOpen ? 'Hide library' : 'Show library'}
          >
            {leftOpen ? <PanelLeftClose size={17} /> : <PanelLeft size={17} />}
          </button>

          <div className="w-px h-5 bg-gray-200 mx-1" />

          <button
            onClick={() => dispatch({ type: 'UNDO' })}
            disabled={!canUndo}
            className="w-8 h-8 flex items-center justify-center rounded text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-transparent transition-none cursor-pointer disabled:cursor-default"
            title="Undo"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={() => dispatch({ type: 'REDO' })}
            disabled={!canRedo}
            className="w-8 h-8 flex items-center justify-center rounded text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-transparent transition-none cursor-pointer disabled:cursor-default"
            title="Redo"
          >
            <Redo2 size={16} />
          </button>
        </div>

        {/* Center: Save Status */}
        <div className="flex items-center gap-3">
          {state.isSaving ? (
            <span className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <Loader2 size={13} className="animate-spin" />
              Saving...
            </span>
          ) : state.hasUnsavedChanges ? (
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
              Unsaved changes
            </span>
          ) : state.lastSaved ? (
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <Check size={13} className="text-gray-500" />
              Saved at {formatSaveTime()}
            </span>
          ) : null}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={state.isSaving || !state.hasUnsavedChanges}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-200 text-xs font-bold text-gray-700 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-30 transition-none cursor-pointer disabled:cursor-default shadow-sm"
          >
            <Save size={13} />
            Save
          </button>

          <button
            onClick={() => dispatch({ type: 'SET_MODE', payload: 'preview' })}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded hover:bg-gray-800 transition-none cursor-pointer shadow-sm"
          >
            <Eye size={13} />
            Preview
          </button>

          <div className="w-px h-5 bg-gray-200 mx-1" />

          <button
            onClick={() => setRightOpen(!rightOpen)}
            className="w-8 h-8 flex items-center justify-center rounded text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-none cursor-pointer"
            title={rightOpen ? 'Hide properties' : 'Show properties'}
          >
            {rightOpen ? <PanelRightClose size={17} /> : <PanelRight size={17} />}
          </button>
        </div>
      </div>

      {/* ── 3-Panel Body ── */}
      <div className="flex flex-1 overflow-hidden bg-[#FAFAFA]">
        {/* Left Panel */}
        {leftOpen && (
          <aside className="w-[260px] bg-white border-r border-gray-200 shrink-0 overflow-hidden relative z-10 shadow-[1px_0_3px_rgba(0,0,0,0.02)]">
            <SectionLibrary />
          </aside>
        )}

        {/* Center: Canvas */}
        <Canvas />

        {/* Right Panel */}
        {rightOpen && (
          <aside className="w-[320px] bg-white border-l border-gray-200 shrink-0 overflow-hidden relative z-10 shadow-[-1px_0_3px_rgba(0,0,0,0.02)]">
            <PropertiesPanel />
          </aside>
        )}
      </div>
    </div>
  );
}

export default function BuilderLayout() {
  return (
    <BuilderProvider>
      <BuilderInner />
    </BuilderProvider>
  );
}
