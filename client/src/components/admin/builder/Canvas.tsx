// ============================================================
// CANVAS — CENTER PANEL
// Light, minimal live section canvas with drag-and-drop
// ============================================================

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { GripVertical, Copy, Trash2, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react';
import { useBuilder } from './sectionStore';
import SectionRenderer from './SectionRenderer';

export default function Canvas() {
  const { state, dispatch, deleteSection, duplicateSection } = useBuilder();
  const { sections, selectedId, mode } = state;
  const isEdit = mode === 'edit';

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;

    dispatch({
      type: 'REORDER_SECTIONS',
      payload: {
        sourceIndex: result.source.index,
        destIndex: result.destination.index,
      },
    });
  };

  const handleSelect = (id: string | undefined) => {
    if (!id || !isEdit) return;
    dispatch({ type: 'SET_SELECTED', payload: id === selectedId ? null : id });
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    dispatch({ type: 'REORDER_SECTIONS', payload: { sourceIndex: index, destIndex: index - 1 } });
  };

  const handleMoveDown = (index: number) => {
    if (index >= sections.length - 1) return;
    dispatch({ type: 'REORDER_SECTIONS', payload: { sourceIndex: index, destIndex: index + 1 } });
  };

  const handleToggleVisibility = (id: string, currentVisible: boolean) => {
    dispatch({ type: 'UPDATE_SECTION', payload: { id, updates: { visible: !currentVisible } } });
  };

  const handleTitleChange = (id: string, value: string) => {
    dispatch({ type: 'UPDATE_SECTION_CONTENT', payload: { id, content: { title: value } } });
  };

  const handleSubtitleChange = (id: string, value: string) => {
    dispatch({ type: 'UPDATE_SECTION_CONTENT', payload: { id, content: { subtitle: value } } });
  };

  const handleDescriptionChange = (id: string, value: string) => {
    dispatch({ type: 'UPDATE_SECTION_CONTENT', payload: { id, content: { description: value } } });
  };

  const handleCtaChange = (id: string, value: string) => {
    dispatch({ type: 'UPDATE_SECTION_CONTENT', payload: { id, content: { cta: value } } });
  };

  // ── Preview Mode ──
  if (mode === 'preview') {
    return (
      <div className="flex-1 overflow-y-auto bg-white no-scrollbar">
        {sections
          .filter(s => s.visible)
          .sort((a, b) => a.order - b.order)
          .map(section => (
            <SectionRenderer key={section._id || section.order} section={section} />
          ))}
        {sections.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-gray-400">No sections to preview</p>
          </div>
        )}
      </div>
    );
  }

  // ── Edit Mode ──
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-gray-50">
      {sections.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center gap-4 text-gray-400">
          <div className="w-16 h-16 rounded border border-dashed border-gray-300 flex items-center justify-center text-3xl text-gray-400 bg-white shadow-sm">
            +
          </div>
          <p className="text-sm font-bold text-gray-900 uppercase tracking-wider">No Sections Yet</p>
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            Click a template on the left to add your first section
          </p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="builder-canvas">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-col p-4 gap-3"
              >
                {sections
                  .sort((a, b) => a.order - b.order)
                  .map((section, index) => (
                    <Draggable
                      key={section._id || `temp-${index}`}
                      draggableId={section._id || `temp-${index}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`relative group rounded border transition-none bg-white ${
                            snapshot.isDragging ? 'shadow-2xl z-50 scale-[1.01] border-gray-400' : 'shadow-sm hover:border-gray-300 border-gray-200'
                          } ${
                            selectedId === section._id
                              ? 'ring-2 ring-gray-900 ring-offset-2 ring-offset-gray-50 border-gray-900'
                              : ''
                          }`}
                        >
                          {/* ── Section Toolbar Overlay ── */}
                          <div className={`absolute top-3 right-3 z-30 flex items-center bg-white border border-gray-200 rounded shadow-sm transition-none overflow-hidden ${
                            selectedId === section._id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`}>
                            {/* Drag Handle */}
                            <div
                              {...provided.dragHandleProps}
                              className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-50 text-gray-400 hover:text-gray-900 cursor-grab border-r border-gray-200 transition-none"
                              title="Drag to reorder"
                            >
                              <GripVertical size={13} />
                            </div>

                            <button
                              onClick={(e) => { e.stopPropagation(); handleMoveUp(index); }}
                              disabled={index === 0}
                              className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-900 disabled:opacity-30 border-r border-gray-200 transition-none cursor-pointer disabled:cursor-default"
                              title="Move up"
                            >
                              <ChevronUp size={13} />
                            </button>

                            <button
                              onClick={(e) => { e.stopPropagation(); handleMoveDown(index); }}
                              disabled={index === sections.length - 1}
                              className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-900 disabled:opacity-30 border-r border-gray-200 transition-none cursor-pointer disabled:cursor-default"
                              title="Move down"
                            >
                              <ChevronDown size={13} />
                            </button>

                            <button
                              onClick={(e) => { e.stopPropagation(); handleToggleVisibility(section._id!, section.visible); }}
                              className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-900 border-r border-gray-200 transition-none cursor-pointer"
                              title={section.visible ? 'Hide' : 'Show'}
                            >
                              {section.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                            </button>

                            <button
                              onClick={(e) => { e.stopPropagation(); duplicateSection(section._id!); }}
                              className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-900 border-r border-gray-200 transition-none cursor-pointer"
                              title="Duplicate"
                            >
                              <Copy size={13} />
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Delete "${section.name}"?`)) {
                                  deleteSection(section._id!);
                                }
                              }}
                              className="w-8 h-8 flex items-center justify-center bg-white hover:bg-red-50 text-red-500 hover:text-red-700 transition-none cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          {/* ── Selection Badge ── */}
                          {selectedId === section._id && (
                            <div className="absolute top-3 left-3 z-20 bg-gray-900 text-white text-[10px] px-2.5 py-1 rounded font-bold shadow-sm uppercase tracking-wider">
                              {section.name}
                            </div>
                          )}

                          {/* ── Hidden Overlay ── */}
                          {!section.visible && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-50/80">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-white px-4 py-2 rounded shadow-sm border border-gray-200">
                                <EyeOff size={13} className="inline mr-1.5 -mt-0.5" />
                                Hidden from site
                              </span>
                            </div>
                          )}

                          {/* ── Section Render ── */}
                          <SectionRenderer
                            section={section}
                            isSelected={selectedId === section._id}
                            isEditMode={true}
                            onSelect={() => handleSelect(section._id)}
                            onTitleChange={(v) => handleTitleChange(section._id!, v)}
                            onSubtitleChange={(v) => handleSubtitleChange(section._id!, v)}
                            onDescriptionChange={(v) => handleDescriptionChange(section._id!, v)}
                            onCtaChange={(v) => handleCtaChange(section._id!, v)}
                          />

                          {/* Order badge */}
                          <div className="absolute bottom-3 left-3 z-20 text-[10px] text-gray-500 font-bold uppercase tracking-wider bg-white border border-gray-200 px-2 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-none">
                            #{index + 1} · {section.type}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}
