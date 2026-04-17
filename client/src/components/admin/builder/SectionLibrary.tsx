// ============================================================
// SECTION LIBRARY — LEFT PANEL
// Light, minimal template catalog with clear add actions
// ============================================================

import { Monitor, Columns2, LayoutGrid, Quote, PenTool, Plus } from 'lucide-react';
import { SECTION_TEMPLATES, createSectionFromTemplate } from './templates';
import type { SectionTemplate } from './templates';
import { useBuilder } from './sectionStore';

const ICON_MAP: Record<string, any> = {
  Monitor,
  Columns2,
  LayoutGrid,
  Quote,
  PenTool,
};

const CATEGORY_LABELS: Record<string, string> = {
  content: 'Content',
  media: 'Media',
  statement: 'Statement',
};

export default function SectionLibrary() {
  const { state, createSection } = useBuilder();

  const handleAdd = async (template: SectionTemplate) => {
    const section = createSectionFromTemplate(
      template.id,
      state.sections.length,
      0
    );
    await createSection(section);
  };

  // Group by category
  const grouped = SECTION_TEMPLATES.reduce((acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category].push(t);
    return acc;
  }, {} as Record<string, SectionTemplate[]>);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-200">
        <h3 className="text-sm font-bold text-gray-900">
          Section Library
        </h3>
        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mt-1">
          {state.sections.length} section{state.sections.length !== 1 ? 's' : ''} active
        </p>
      </div>

      {/* Templates */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 flex flex-col gap-5">
        {Object.entries(grouped).map(([category, templates]) => (
          <div key={category}>
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-2.5 block px-1">
              {CATEGORY_LABELS[category] || category}
            </span>

            <div className="flex flex-col gap-1.5">
              {templates.map(template => {
                const Icon = ICON_MAP[template.icon] || PenTool;
                return (
                  <button
                    key={template.id}
                    onClick={() => handleAdd(template)}
                    className="group flex items-center gap-3 px-3 py-3 rounded-md border border-gray-200 hover:border-gray-900 bg-white hover:bg-gray-50 transition-none text-left w-full cursor-pointer shadow-sm"
                  >
                    <div className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white group-hover:bg-gray-100 transition-none shrink-0">
                      <Icon size={16} className="text-gray-500 group-hover:text-gray-900 transition-none" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[13px] font-bold text-gray-900 block leading-tight">
                        {template.name}
                      </span>
                      <span className="text-[11px] font-medium text-gray-500 block mt-0.5 truncate">
                        {template.description}
                      </span>
                    </div>
                    <div className="w-7 h-7 flex items-center justify-center rounded bg-gray-900 text-white transition-none shrink-0 opacity-0 group-hover:opacity-100">
                      <Plus size={14} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
