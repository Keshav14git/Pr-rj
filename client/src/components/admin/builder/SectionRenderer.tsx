// ============================================================
// SECTION RENDERER
// Renders a single section based on its schema
// The same component is used in both builder canvas & public site
// ============================================================

import { motion } from 'framer-motion';
import type { ISectionSchema } from './types';
import { DESIGN_CONSTRAINTS } from './types';
import {
  getEntryAnimationProps,
  getScrollBehaviorStyle,
  getStaggerContainerProps,
  getStaggerChildProps,
} from './AnimationEngine';

interface SectionRendererProps {
  section: ISectionSchema;
  isSelected?: boolean;
  isEditMode?: boolean;
  onSelect?: () => void;
  onTitleChange?: (value: string) => void;
  onSubtitleChange?: (value: string) => void;
  onDescriptionChange?: (value: string) => void;
  onCtaChange?: (value: string) => void;
}

export default function SectionRenderer({
  section,
  isSelected = false,
  isEditMode = false,
  onSelect,
  onTitleChange,
  onSubtitleChange,
  onDescriptionChange,
  onCtaChange,
}: SectionRendererProps) {
  if (!section.visible && !isEditMode) return null;

  const animProps = getEntryAnimationProps(section.animation, isEditMode);
  const scrollStyle = getScrollBehaviorStyle(section.animation, isEditMode);

  const sectionHeight = section.height === 'auto' ? 'auto' : section.height;

  const bgColor = section.content.backgroundColor || (section.style.theme === 'dark' ? '#0A0A0A' : '#FFFFFF');
  const textColor = section.content.textColor || (section.style.theme === 'dark' ? '#FFFFFF' : '#0A0A0A');

  const alignClass =
    section.style.alignment === 'left' ? 'text-left items-start' :
    section.style.alignment === 'right' ? 'text-right items-end' :
    'text-center items-center';

  const containerStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    color: textColor,
    minHeight: sectionHeight === 'auto' ? '200px' : sectionHeight,
    height: sectionHeight === 'auto' ? 'auto' : sectionHeight,
    ...scrollStyle,
    opacity: !section.visible && isEditMode ? 0.4 : 1,
  };

  const innerStyle: React.CSSProperties = {
    maxWidth: `${DESIGN_CONSTRAINTS.maxContainerWidth}px`,
    margin: '0 auto',
    padding: section.style.padding || '48px 24px',
    width: '100%',
    height: '100%',
  };

  const media = section.content.media || [];
  const hasMedia = media.length > 0;

  // Editable text handler
  const handleBlur = (field: string) => (e: React.FocusEvent<HTMLElement>) => {
    const text = e.currentTarget.textContent || '';
    switch (field) {
      case 'title': onTitleChange?.(text); break;
      case 'subtitle': onSubtitleChange?.(text); break;
      case 'description': onDescriptionChange?.(text); break;
      case 'cta': onCtaChange?.(text); break;
    }
  };

  const editableProps = (field: string) =>
    isEditMode
      ? {
          contentEditable: true,
          suppressContentEditableWarning: true,
          onBlur: handleBlur(field),
          style: {
            outline: 'none',
            cursor: 'text',
            borderBottom: '1px dashed rgba(128,128,128,0.3)',
          } as React.CSSProperties,
        }
      : {};

  // ── Render based on type ─────────────────────────────────────────
  const renderContent = () => {
    switch (section.type) {
      case 'hero':
        return renderHero();
      case 'split':
        return renderSplit();
      case 'grid':
        return renderGrid();
      case 'statement':
        return renderStatement();
      case 'custom':
        return renderCustom();
      default:
        return renderCustom();
    }
  };

  // ── HERO ──
  const renderHero = () => (
    <motion.div {...animProps} style={innerStyle} className={`flex flex-col justify-center ${alignClass} gap-6`}>
      {section.content.title && (
        <h2
          className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-none"
          {...editableProps('title')}
        >
          {section.content.title}
        </h2>
      )}
      {section.content.subtitle && (
        <p
          className="text-sm md:text-base uppercase tracking-[0.2em] opacity-60 max-w-xl"
          {...editableProps('subtitle')}
        >
          {section.content.subtitle}
        </p>
      )}
      {section.content.description && (
        <p
          className="text-sm md:text-base opacity-50 max-w-lg leading-relaxed"
          {...editableProps('description')}
        >
          {section.content.description}
        </p>
      )}
      {section.content.cta && (
        <span
          className="inline-block mt-4 px-8 py-3 border text-xs uppercase tracking-[0.2em] font-bold hover:bg-white hover:text-black transition-all cursor-pointer"
          style={{ borderColor: textColor }}
          {...editableProps('cta')}
        >
          {section.content.cta}
        </span>
      )}
      {hasMedia && (
        <div className="absolute inset-0 z-0 opacity-20">
          <img src={media[0]} alt="" className="w-full h-full object-cover" />
        </div>
      )}
    </motion.div>
  );

  // ── SPLIT ──
  const renderSplit = () => {
    const isReverse = section.layout === '2-col-reverse' || section.layout === '40-60';
    const textWidth = section.layout === '60-40' ? 'w-full md:w-[60%]' : section.layout === '40-60' ? 'w-full md:w-[40%]' : 'w-full md:w-1/2';
    const mediaWidth = section.layout === '60-40' ? 'w-full md:w-[40%]' : section.layout === '40-60' ? 'w-full md:w-[60%]' : 'w-full md:w-1/2';

    return (
      <motion.div {...animProps} className={`flex flex-col ${isReverse ? 'md:flex-row-reverse' : 'md:flex-row'} w-full`} style={{ height: '100%' }}>
        {/* Text Side */}
        <div className={`${textWidth} flex flex-col justify-center gap-5`} style={{ padding: section.style.padding || '48px 24px' }}>
          <div className={`max-w-xl ${section.style.alignment === 'right' ? 'ml-auto' : section.style.alignment === 'center' ? 'mx-auto text-center' : ''}`}>
            {section.content.title && (
              <h2
                className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-none mb-4"
                {...editableProps('title')}
              >
                {section.content.title}
              </h2>
            )}
            {section.content.subtitle && (
              <p className="text-xs uppercase tracking-[0.2em] opacity-40 mb-4" {...editableProps('subtitle')}>
                {section.content.subtitle}
              </p>
            )}
            {section.content.description && (
              <p className="text-sm md:text-base opacity-60 leading-relaxed" {...editableProps('description')}>
                {section.content.description}
              </p>
            )}
            {section.content.cta && (
              <span
                className="inline-block mt-6 px-6 py-2.5 border text-xs uppercase tracking-[0.2em] font-bold hover:bg-white hover:text-black transition-all cursor-pointer"
                style={{ borderColor: textColor }}
                {...editableProps('cta')}
              >
                {section.content.cta}
              </span>
            )}
          </div>
        </div>

        {/* Media Side */}
        <div className={`${mediaWidth} min-h-[300px] md:min-h-0 relative overflow-hidden`} style={{ backgroundColor: section.style.theme === 'dark' ? '#1A1A1A' : '#F0F0F0' }}>
          {hasMedia ? (
            <img src={media[0]} alt={section.content.title || 'Section image'} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-xs uppercase tracking-widest opacity-30 font-bold">No Media</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // ── GRID ──
  const renderGrid = () => {
    const colCount = section.layout === '4-col' ? 4 : section.layout === '2-col' ? 2 : 3;
    const gridClass = colCount === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
                      colCount === 2 ? 'grid-cols-1 md:grid-cols-2' :
                      'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

    const staggerContainer = getStaggerContainerProps(section.animation, isEditMode);
    const staggerChild = getStaggerChildProps(section.animation);

    return (
      <div style={innerStyle} className={`flex flex-col ${alignClass}`}>
        {section.content.title && (
          <motion.h2
            {...animProps}
            className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-2"
            {...editableProps('title')}
          >
            {section.content.title}
          </motion.h2>
        )}
        {section.content.subtitle && (
          <motion.p {...animProps} className="text-xs uppercase tracking-[0.2em] opacity-40 mb-8" {...editableProps('subtitle')}>
            {section.content.subtitle}
          </motion.p>
        )}

        <motion.div {...staggerContainer} className={`grid ${gridClass} gap-4 md:gap-6 w-full`}>
          {hasMedia ? media.map((img, i) => (
            <motion.div key={i} {...staggerChild} className="aspect-[4/5] overflow-hidden group bg-black/5">
              <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </motion.div>
          )) : (
            <div className={`col-span-full py-16 flex items-center justify-center`}>
              <span className="text-xs uppercase tracking-widest opacity-30 font-bold">
                {isEditMode ? 'Upload images in the properties panel →' : 'Gallery Empty'}
              </span>
            </div>
          )}
        </motion.div>
      </div>
    );
  };

  // ── STATEMENT ──
  const renderStatement = () => (
    <motion.div {...animProps} style={innerStyle} className={`flex flex-col justify-center ${alignClass} gap-4`}>
      {section.content.title && (
        <h2
          className={`text-3xl md:text-5xl lg:text-7xl font-bold uppercase leading-tight ${
            section.layout === 'constrained' ? 'max-w-4xl mx-auto' : ''
          }`}
          style={{ letterSpacing: '0.04em' }}
          {...editableProps('title')}
        >
          {section.content.title}
        </h2>
      )}
      {section.content.subtitle && (
        <p className="text-sm uppercase tracking-[0.3em] opacity-40 mt-4" {...editableProps('subtitle')}>
          {section.content.subtitle}
        </p>
      )}
    </motion.div>
  );

  // ── CUSTOM ──
  const renderCustom = () => (
    <motion.div {...animProps} style={innerStyle} className={`flex flex-col ${alignClass} gap-5`}>
      {section.content.title && (
        <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight" {...editableProps('title')}>
          {section.content.title}
        </h2>
      )}
      {section.content.subtitle && (
        <p className="text-xs uppercase tracking-[0.2em] opacity-40" {...editableProps('subtitle')}>
          {section.content.subtitle}
        </p>
      )}
      {section.content.description && (
        <p className="text-sm md:text-base opacity-60 leading-relaxed max-w-2xl" {...editableProps('description')}>
          {section.content.description}
        </p>
      )}
      {section.content.cta && (
        <span
          className="inline-block mt-4 px-6 py-2.5 border text-xs uppercase tracking-[0.2em] font-bold cursor-pointer"
          style={{ borderColor: textColor }}
          {...editableProps('cta')}
        >
          {section.content.cta}
        </span>
      )}
      {hasMedia && (
        <div className={`grid ${section.layout === '3-col' ? 'grid-cols-1 md:grid-cols-3' : section.layout === '2-col' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-4 w-full mt-4`}>
          {media.map((img, i) => (
            <div key={i} className="aspect-video overflow-hidden bg-black/5">
              <img src={img} alt={`Media ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );

  // ── Main wrapper ──
  return (
    <section
      onClick={isEditMode ? onSelect : undefined}
      className={`relative w-full overflow-hidden transition-all duration-200 ${
        isEditMode ? 'cursor-pointer' : ''
      } ${
        isSelected ? 'ring-2 ring-blue-500/60 ring-offset-0' : ''
      } ${
        !section.visible && isEditMode ? 'opacity-40' : ''
      }`}
      style={containerStyle}
    >
      {/* Selection indicator */}
      {isSelected && isEditMode && (
        <div className="absolute top-0 left-0 z-20 bg-blue-500 text-white text-[9px] px-3 py-1 uppercase tracking-widest font-bold">
          {section.type} — {section.name}
        </div>
      )}

      {/* Hidden section overlay */}
      {!section.visible && isEditMode && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <span className="text-xs uppercase tracking-widest font-bold opacity-50 bg-black/50 text-white px-4 py-2">Hidden</span>
        </div>
      )}

      {renderContent()}
    </section>
  );
}
