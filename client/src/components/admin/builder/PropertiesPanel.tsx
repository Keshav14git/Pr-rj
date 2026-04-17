// ============================================================
// PROPERTIES PANEL — RIGHT PANEL
// Light, minimal design with grouped controls
// ============================================================

import { useState, useEffect } from 'react';
import {
  Type, AlignLeft, AlignCenter, AlignRight,
  Image as ImageIcon, Trash2, Sun, Moon, Palette,
} from 'lucide-react';
import { useBuilder } from './sectionStore';
import type { ISectionSchema, Alignment, Theme, EntryAnimation, ScrollBehavior } from './types';
import {
  PLACEMENT_OPTIONS,
  ENTRY_ANIMATION_OPTIONS,
  SCROLL_BEHAVIOR_OPTIONS,
  EASING_OPTIONS,
  LAYOUT_OPTIONS,
  HEIGHT_PRESETS,
  DESIGN_CONSTRAINTS,
} from './types';

// ── Helpers ──

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-medium text-gray-400">{label}</label>
      {children}
    </div>
  );
}

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 pt-5 pb-1">
      <span className="text-xs font-semibold text-gray-700">{title}</span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

const inputClass = "w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-gray-900 text-[13px] font-medium focus:outline-none focus:border-gray-900 transition-none shadow-sm placeholder:text-gray-400";
const selectClass = "w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-gray-900 text-[13px] font-medium focus:outline-none focus:border-gray-900 transition-none appearance-none cursor-pointer shadow-sm";

function CtaLinkAutocomplete({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [projects, setProjects] = useState<{label:string, value:string}[]>([]);

  const internalSections = [
    { label: 'Hero / Top', value: '#hero' },
    { label: 'About / Profile', value: '#about' },
    { label: 'Expertise / Services', value: '#expertise' },
    { label: 'Experience / Timeline', value: '#projects' },
    { label: 'Key Achievements', value: '#achievements' },
    { label: 'Contact Form', value: '#contact' },
  ];

  useEffect(() => {
    // Fetch live experiences from database for / autocomplete
    fetch('https://pr-rj.onrender.com/api/portfolio/experiences')
      .then(res => res.json())
      .then(data => {
        if (data && data.success && data.data) {
           setProjects(data.data.map((e: any) => ({
             label: e.company || 'Project',
             value: `/project/${(e.company || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
           })));
        }
      })
      .catch(() => {});
  }, []);

  const suggestions = value.startsWith('#')
    ? internalSections.filter(s => s.value.startsWith(value) || value === '#')
    : value.startsWith('/')
    ? projects.filter(p => p.value.startsWith(value) || value === '/')
    : [];

  return (
    <div className="relative">
      <input
        type="text" value={value}
        onChange={(e) => {
           onChange(e.target.value);
           setShowSuggestions(e.target.value.startsWith('#') || e.target.value.startsWith('/'));
        }}
        onFocus={() => {
           if (value.startsWith('#') || value.startsWith('/')) setShowSuggestions(true);
        }}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        className={inputClass} placeholder="e.g. #contact or / to browse projects"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-[105%] left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden max-h-48 overflow-y-auto">
          {suggestions.map((s) => (
            <div
              key={s.value}
              className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-xs font-medium border-b border-gray-100 last:border-0"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(s.value);
                setShowSuggestions(false);
              }}
            >
              <div className="font-bold text-gray-900">{s.label}</div>
              <div className="text-[10px] text-gray-500 font-mono mt-0.5">{s.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Component ──

export default function PropertiesPanel() {
  const { dispatch, selectedSection, uploadImage } = useBuilder();
  const [uploading, setUploading] = useState(false);

  if (!selectedSection) {
    return (
      <div className="flex flex-col h-full items-center justify-center px-6">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto bg-white border border-gray-200 rounded-lg flex items-center justify-center mb-4 shadow-sm">
            <Type size={18} className="text-gray-400" />
          </div>
          <p className="text-sm font-bold text-gray-900">No selection</p>
          <p className="text-xs font-medium text-gray-500 mt-1">
            Click a section on the canvas to edit
          </p>
        </div>
      </div>
    );
  }

  const s = selectedSection;
  const id = s._id!;

  const updateField = (updates: Partial<ISectionSchema>) => {
    dispatch({ type: 'UPDATE_SECTION', payload: { id, updates } });
  };

  const updateContent = (content: Partial<ISectionSchema['content']>) => {
    dispatch({ type: 'UPDATE_SECTION_CONTENT', payload: { id, content } });
  };

  const updateStyle = (style: Partial<ISectionSchema['style']>) => {
    dispatch({ type: 'UPDATE_SECTION_STYLE', payload: { id, style } });
  };

  const updateAnimation = (animation: Partial<ISectionSchema['animation']>) => {
    dispatch({ type: 'UPDATE_SECTION_ANIMATION', payload: { id, animation } });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    const currentMedia = [...(s.content.media || [])];
    for (let i = 0; i < files.length; i++) {
      const url = await uploadImage(files[i]);
      if (url) currentMedia.push(url);
    }
    updateContent({ media: currentMedia });
    setUploading(false);
  };

  const removeImage = (index: number) => {
    const newMedia = [...(s.content.media || [])];
    newMedia.splice(index, 1);
    updateContent({ media: newMedia });
  };

  const layoutOpts = LAYOUT_OPTIONS[s.type] || LAYOUT_OPTIONS.custom;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-200 shrink-0">
        <h3 className="text-sm font-bold text-gray-900">Properties</h3>
        <p className="text-xs font-medium text-gray-500 mt-0.5 truncate">{s.name}</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4 flex flex-col gap-4">

        {/* ── SECTION ── */}
        <SectionDivider title="Section" />

        <FieldGroup label="Name (admin only)">
          <input type="text" value={s.name} onChange={(e) => updateField({ name: e.target.value })} className={inputClass} maxLength={60} />
        </FieldGroup>

        <div className="grid grid-cols-2 gap-3">
          <FieldGroup label="Type">
            <select
              value={s.type}
              onChange={(e) => {
                const newType = e.target.value as ISectionSchema['type'];
                const newLayoutOpts = LAYOUT_OPTIONS[newType];
                updateField({ type: newType, layout: newLayoutOpts?.[0]?.value || 'full-width' });
              }}
              className={selectClass}
            >
              <option value="hero">Hero</option>
              <option value="split">Split Panel</option>
              <option value="grid">Grid Gallery</option>
              <option value="statement">Statement</option>
              <option value="custom">Custom</option>
            </select>
          </FieldGroup>

          <FieldGroup label="Layout">
            <select value={s.layout} onChange={(e) => updateField({ layout: e.target.value })} className={selectClass}>
              {layoutOpts.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
            </select>
          </FieldGroup>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FieldGroup label="Height">
            <select
              value={HEIGHT_PRESETS.some(h => h.value === s.height) ? s.height : 'custom'}
              onChange={(e) => { if (e.target.value !== 'custom') updateField({ height: e.target.value }); }}
              className={selectClass}
            >
              {HEIGHT_PRESETS.map(h => (<option key={h.value} value={h.value}>{h.label}</option>))}
              <option value="custom">Custom</option>
            </select>
          </FieldGroup>

          <FieldGroup label="Placement">
            <select value={s.placementIndex} onChange={(e) => updateField({ placementIndex: parseInt(e.target.value) })} className={selectClass}>
              {PLACEMENT_OPTIONS.map(opt => (<option key={opt.index} value={opt.index}>{opt.label}</option>))}
            </select>
          </FieldGroup>
        </div>

        {!HEIGHT_PRESETS.some(h => h.value === s.height) && (
          <FieldGroup label="Custom Height">
            <input type="text" value={s.height} onChange={(e) => updateField({ height: e.target.value })} className={inputClass} placeholder="e.g., 500px, 70vh" />
          </FieldGroup>
        )}

        {/* ── CONTENT ── */}
        <SectionDivider title="Content" />

        <FieldGroup label="Title">
          <input
            type="text" value={s.content.title || ''}
            onChange={(e) => updateContent({ title: e.target.value.slice(0, DESIGN_CONSTRAINTS.maxTitleLength) })}
            className={inputClass} placeholder="Main headline" maxLength={DESIGN_CONSTRAINTS.maxTitleLength}
          />
          <span className="text-[10px] text-gray-300 text-right">{(s.content.title || '').length}/{DESIGN_CONSTRAINTS.maxTitleLength}</span>
        </FieldGroup>

        <FieldGroup label="Subtitle">
          <input type="text" value={s.content.subtitle || ''} onChange={(e) => updateContent({ subtitle: e.target.value })} className={inputClass} placeholder="Optional subtitle" />
        </FieldGroup>

        {s.type !== 'statement' && (
          <FieldGroup label="Description">
            <textarea
              value={s.content.description || ''}
              onChange={(e) => updateContent({ description: e.target.value.slice(0, DESIGN_CONSTRAINTS.maxDescriptionLength) })}
              className={`${inputClass} h-24 resize-none`} placeholder="Body text"
              maxLength={DESIGN_CONSTRAINTS.maxDescriptionLength}
            />
          </FieldGroup>
        )}

        {s.type !== 'statement' && s.type !== 'grid' && (
          <div className="flex flex-col gap-3">
            <FieldGroup label="CTA Button">
              <input
                type="text" value={s.content.cta || ''}
                onChange={(e) => updateContent({ cta: e.target.value.slice(0, DESIGN_CONSTRAINTS.maxCtaLength) })}
                className={inputClass} placeholder="e.g., Learn More" maxLength={DESIGN_CONSTRAINTS.maxCtaLength}
              />
            </FieldGroup>
            <FieldGroup label="CTA Link (URL or #hash)">
              <CtaLinkAutocomplete 
                value={s.content.ctaLink || ''} 
                onChange={(val) => updateContent({ ctaLink: val })} 
              />
            </FieldGroup>
          </div>
        )}

        {/* ── MEDIA ── */}
        {s.type !== 'statement' && (
          <>
            <SectionDivider title="Media" />

            <label className="relative border border-dashed border-gray-300 hover:border-gray-900 bg-white hover:bg-gray-50 transition-none rounded-md p-6 flex flex-col items-center justify-center cursor-pointer group shadow-sm">
              <ImageIcon size={20} className="text-gray-400 group-hover:text-gray-900 mb-2 transition-none" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 group-hover:text-gray-900 transition-none">
                {uploading ? 'Uploading...' : 'Click to upload'}
              </span>
              <input type="file" className="hidden" accept="image/*" multiple={s.type === 'grid'} onChange={handleImageUpload} disabled={uploading} />
            </label>

            {s.content.media && s.content.media.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {s.content.media.map((img, i) => (
                  <div key={i} className="relative aspect-square bg-gray-50 rounded-md group overflow-hidden border border-gray-200 shadow-sm">
                    <img src={img} alt={`Media ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-white text-gray-500 hover:text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-none cursor-pointer rounded shadow-sm border border-gray-200"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── STYLE ── */}
        <SectionDivider title="Style" />

        <FieldGroup label="Alignment">
          <div className="flex gap-1">
            {(['left', 'center', 'right'] as Alignment[]).map(align => {
              const Icon = align === 'left' ? AlignLeft : align === 'right' ? AlignRight : AlignCenter;
              return (
                <button
                  key={align}
                  onClick={() => updateStyle({ alignment: align })}
                  className={`flex-1 py-2.5 flex items-center justify-center rounded border transition-none cursor-pointer shadow-sm ${
                    s.style.alignment === align
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={14} />
                </button>
              );
            })}
          </div>
        </FieldGroup>

        <FieldGroup label="Theme">
          <div className="flex gap-1">
            {[
              { value: 'light' as Theme, icon: Sun, label: 'Light' },
              { value: 'dark' as Theme, icon: Moon, label: 'Dark' },
              { value: 'custom' as Theme, icon: Palette, label: 'Custom' },
            ].map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => {
                  const colors = value === 'dark'
                    ? { backgroundColor: '#0A0A0A', textColor: '#FFFFFF' }
                    : value === 'light'
                    ? { backgroundColor: '#FFFFFF', textColor: '#0A0A0A' }
                    : {};
                  updateStyle({ theme: value });
                  if (value !== 'custom') updateContent(colors);
                }}
                className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 rounded border text-[11px] font-bold transition-none cursor-pointer shadow-sm ${
                  s.style.theme === value
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>
        </FieldGroup>

        {s.style.theme === 'custom' && (
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Background">
              <div className="flex gap-2">
                <input type="color" value={s.content.backgroundColor || '#FFFFFF'} onChange={(e) => updateContent({ backgroundColor: e.target.value })} className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
                <input type="text" value={s.content.backgroundColor || '#FFFFFF'} onChange={(e) => updateContent({ backgroundColor: e.target.value })} className={`${inputClass} flex-1`} />
              </div>
            </FieldGroup>
            <FieldGroup label="Text">
              <div className="flex gap-2">
                <input type="color" value={s.content.textColor || '#0A0A0A'} onChange={(e) => updateContent({ textColor: e.target.value })} className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
                <input type="text" value={s.content.textColor || '#0A0A0A'} onChange={(e) => updateContent({ textColor: e.target.value })} className={`${inputClass} flex-1`} />
              </div>
            </FieldGroup>
          </div>
        )}

        <FieldGroup label="Padding">
          <input type="text" value={s.style.padding} onChange={(e) => updateStyle({ padding: e.target.value })} className={inputClass} placeholder="e.g., 48px 24px" />
        </FieldGroup>

        {/* ── ANIMATION ── */}
        <SectionDivider title="Animation" />

        <div className="grid grid-cols-2 gap-3">
          <FieldGroup label="Entry">
            <select value={s.animation.entry} onChange={(e) => updateAnimation({ entry: e.target.value as EntryAnimation })} className={selectClass}>
              {ENTRY_ANIMATION_OPTIONS.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
            </select>
          </FieldGroup>

          <FieldGroup label="Scroll">
            <select value={s.animation.scroll} onChange={(e) => updateAnimation({ scroll: e.target.value as ScrollBehavior })} className={selectClass}>
              {SCROLL_BEHAVIOR_OPTIONS.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
            </select>
          </FieldGroup>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FieldGroup label={`Duration: ${s.animation.duration}s`}>
            <input
              type="range" min={0.2} max={2.0} step={0.1}
              value={s.animation.duration}
              onChange={(e) => updateAnimation({ duration: parseFloat(e.target.value) })}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </FieldGroup>
          <FieldGroup label="Easing">
            <select value={s.animation.easing} onChange={(e) => updateAnimation({ easing: e.target.value })} className={selectClass}>
              {EASING_OPTIONS.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
            </select>
          </FieldGroup>
        </div>

        {/* ── VISIBILITY ── */}
        <SectionDivider title="Visibility" />

        <div className="flex items-center justify-between p-4 bg-white rounded-md border border-gray-200 shadow-sm">
          <span className="text-[11px] font-bold text-gray-900 uppercase tracking-wider">
            {s.visible ? 'Visible on site' : 'Hidden from site'}
          </span>
          <button
            onClick={() => updateField({ visible: !s.visible })}
            className={`px-4 py-2 text-[11px] font-bold rounded transition-none cursor-pointer ${
              s.visible
                ? 'bg-gray-900 text-white border border-gray-900 hover:bg-gray-800'
                : 'bg-white text-gray-500 border border-gray-200 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {s.visible ? 'Visible' : 'Hidden'}
          </button>
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}
