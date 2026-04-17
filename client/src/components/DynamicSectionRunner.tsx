import { motion } from 'framer-motion';

interface IContent {
  title?: string;
  subtitle?: string;
  description?: string;
  cta?: string;
  ctaLink?: string;
  media?: string[];
  // Legacy
  heading?: string;
  paragraph?: string;
  images?: string[];
  caption?: string;
  backgroundColor?: string;
  textColor?: string;
}

interface ISectionStyle {
  alignment?: 'left' | 'center' | 'right';
  padding?: string;
  theme?: 'light' | 'dark' | 'custom';
}

interface ISectionAnimation {
  entry?: string;
  scroll?: string;
  duration?: number;
  easing?: string;
}

interface ISection {
  _id?: string;
  name: string;
  type?: 'hero' | 'split' | 'grid' | 'statement' | 'custom';
  layout?: string;
  height?: string;
  content: IContent;
  style?: ISectionStyle;
  animation?: ISectionAnimation | string;
  visible?: boolean;
  // Legacy
  layoutType?: 'text-split' | 'gallery' | 'statement';
  placementIndex?: number;
}

const getAnimationProps = (animation: ISectionAnimation | string | undefined): any => {
  // Handle new object-based animation
  if (animation && typeof animation === 'object') {
    const entry = animation.entry || 'none';
    const duration = animation.duration || 0.8;
    const easing = animation.easing || 'easeOut';

    const transition = { duration, ease: easing };
    const viewport = { once: true, margin: '-100px' };

    switch (entry) {
      case 'fade-up':
        return { initial: { opacity: 0, y: 50 }, whileInView: { opacity: 1, y: 0 }, viewport, transition };
      case 'fade-in':
        return { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport, transition };
      case 'slide-left':
        return { initial: { opacity: 0, x: 80 }, whileInView: { opacity: 1, x: 0 }, viewport, transition };
      case 'slide-right':
        return { initial: { opacity: 0, x: -80 }, whileInView: { opacity: 1, x: 0 }, viewport, transition };
      case 'scale':
        return { initial: { opacity: 0, scale: 0.8 }, whileInView: { opacity: 1, scale: 1 }, viewport, transition: { ...transition, ease: 'backOut' } };
      default:
        return {};
    }
  }

  // Handle legacy string-based animation
  const type = typeof animation === 'string' ? animation : 'none';
  switch (type) {
    case 'fade-up':
      return { initial: { opacity: 0, y: 50 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-100px' }, transition: { duration: 0.8, ease: 'easeOut' } };
    case 'slide-right':
      return { initial: { opacity: 0, x: -100 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true, margin: '-100px' }, transition: { duration: 1, ease: 'circOut' } };
    case 'reveal-scale':
      return { initial: { opacity: 0, scale: 0.8 }, whileInView: { opacity: 1, scale: 1 }, viewport: { once: true, margin: '-100px' }, transition: { duration: 1.2, ease: 'backOut' } };
    default:
      return {};
  }
};

const SectionHeader = ({ title, textColor }: { title: string, textColor: string }) => (
  <div className="absolute top-8 lg:top-16 left-0 right-0 z-20 pointer-events-none flex flex-col items-center">
    <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8 }}
    >
        <h2 className="text-center tracking-[0.2em] font-bold text-xl md:text-2xl lg:text-3xl uppercase" style={{ color: textColor }}>
            {title}
        </h2>
        <div className="w-16 md:w-24 h-px mx-auto mt-4 md:mt-6 opacity-30" style={{ backgroundColor: textColor }} />
    </motion.div>
  </div>
);

export default function DynamicSectionRunner({ data }: { data: ISection }) {
  // Handle visibility (new schema)
  if (data.visible === false) return null;

  const animProps = getAnimationProps(data.animation);

  // Determine section type (new or legacy)
  const sectionType = data.type || (data.layoutType === 'text-split' ? 'split' : data.layoutType === 'gallery' ? 'grid' : data.layoutType || 'custom');

  // Content normalization
  const title = data.content.title || data.content.heading || '';
  const description = data.content.description || data.content.paragraph || '';
  const subtitle = data.content.subtitle || '';
  const cta = data.content.cta || '';
  const ctaLink = data.content.ctaLink || '#';
  const media = data.content.media || data.content.images || [];
  const bgColor = data.content.backgroundColor || (data.style?.theme === 'dark' ? '#0A0A0A' : '#FFFFFF');
  const textColor = data.content.textColor || (data.style?.theme === 'dark' ? '#FFFFFF' : '#0A0A0A');

  const sectionHeight = data.height || 'auto';
  const alignment = data.style?.alignment || 'center';

  const alignClass = alignment === 'left' ? 'text-left items-start' : alignment === 'right' ? 'text-right items-end' : 'text-center items-center';

  const sectionStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    color: textColor,
    minHeight: sectionHeight === 'auto' ? undefined : sectionHeight,
  };

  // If we're injecting a top header, we need to ensure the top padding is at least 120px to prevent collision
  const padding = `140px 24px 60px 24px`;

  // ── HERO ──
  if (sectionType === 'hero') {
    return (
      <section style={sectionStyle} className="w-full relative overflow-hidden">
        <SectionHeader title={data.name} textColor={textColor} />
        <motion.div {...animProps} className={`max-w-[1200px] mx-auto flex flex-col justify-center ${alignClass} gap-6 relative z-10`} style={{ padding, minHeight: sectionHeight === 'auto' ? '400px' : sectionHeight }}>
          {title && <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-none">{title}</h2>}
          {subtitle && <p className="text-sm md:text-base uppercase tracking-[0.2em] opacity-60 max-w-xl">{subtitle}</p>}
          {description && <p className="text-sm md:text-base opacity-50 max-w-lg leading-relaxed">{description}</p>}
          {cta && (
            <a href={ctaLink} target={ctaLink.startsWith('http') ? '_blank' : '_self'} rel="noreferrer" className="inline-block mt-4">
              <span className="px-8 py-3 border text-xs uppercase tracking-[0.2em] font-bold transition-opacity hover:opacity-70" style={{ borderColor: textColor }}>{cta}</span>
            </a>
          )}
          {media.length > 0 && (
            <div className="absolute inset-0 z-0 opacity-20">
              <img src={media[0]} alt="" className="w-full h-full object-cover" />
            </div>
          )}
        </motion.div>
      </section>
    );
  }

  // ── SPLIT ──
  if (sectionType === 'split') {
    const layout = data.layout || '2-col';
    const isReverse = layout === '2-col-reverse' || layout === '40-60';

    return (
      <section style={sectionStyle} className={`w-full relative flex flex-col ${isReverse ? 'md:flex-row-reverse' : 'md:flex-row'} overflow-hidden`}>
        <SectionHeader title={data.name} textColor={textColor} />
        <motion.div {...animProps} className="w-full md:w-1/2 flex flex-col justify-center relative z-10 pt-24 lg:pt-32" style={{ padding }}>
          <div className="max-w-xl">
            {title && <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-none mb-4">{title}</h2>}
            {subtitle && <p className="text-xs uppercase tracking-[0.2em] opacity-40 mb-4">{subtitle}</p>}
            {description && <p className="text-sm md:text-base opacity-60 leading-relaxed">{description}</p>}
            {cta && (
              <a href={ctaLink} target={ctaLink.startsWith('http') ? '_blank' : '_self'} rel="noreferrer" className="inline-block mt-6">
                <span className="px-6 py-2.5 border text-xs uppercase tracking-[0.2em] font-bold transition-opacity hover:opacity-70" style={{ borderColor: textColor }}>{cta}</span>
              </a>
            )}
          </div>
        </motion.div>
        <div className="w-full md:w-1/2 min-h-[300px] md:min-h-0" style={{ backgroundColor: data.style?.theme === 'dark' ? '#1A1A1A' : '#F0F0F0' }}>
          {media.length > 0 ? (
            <img src={media[0]} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full min-h-[400px] flex items-center justify-center">
              <span className="text-xs uppercase tracking-widest opacity-30 font-bold">No Media</span>
            </div>
          )}
        </div>
      </section>
    );
  }

  // ── GRID / GALLERY ──
  if (sectionType === 'grid') {
    const cols = data.layout === '4-col' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
                 data.layout === '2-col' ? 'grid-cols-1 md:grid-cols-2' :
                 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

    return (
      <section style={sectionStyle} className="w-full relative overflow-hidden">
        <SectionHeader title={data.name} textColor={textColor} />
        <div className="max-w-[1200px] mx-auto relative z-10 pt-24 lg:pt-32" style={{ padding }}>
          {title && (
            <motion.div {...animProps} className={`${alignClass} flex flex-col mb-8`}>
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-2">{title}</h2>
              {subtitle && <p className="text-xs uppercase tracking-[0.2em] opacity-40">{subtitle}</p>}
            </motion.div>
          )}
          <motion.div {...animProps} className={`grid ${cols} gap-4 md:gap-8`}>
            {media.length > 0 ? media.map((img, i) => (
              <div key={i} className="aspect-[4/5] overflow-hidden group bg-black/5">
                <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            )) : (
              <div className="col-span-full py-12 text-center text-xs font-bold tracking-widest uppercase opacity-30">
                Gallery Empty
              </div>
            )}
          </motion.div>
        </div>
      </section>
    );
  }

  // ── STATEMENT ──
  if (sectionType === 'statement') {
    return (
      <section style={sectionStyle} className="w-full relative flex items-center justify-center overflow-hidden">
        <SectionHeader title={data.name} textColor={textColor} />
        <motion.div {...animProps} className={`max-w-4xl mx-auto ${alignClass} relative z-10 pt-24 lg:pt-32`} style={{ padding }}>
          {title && <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold uppercase tracking-widest leading-tight">{title}</h2>}
          {subtitle && <p className="text-sm uppercase tracking-[0.3em] opacity-40 mt-4">{subtitle}</p>}
        </motion.div>
      </section>
    );
  }

  // ── CUSTOM / FALLBACK ──
  return (
    <section style={sectionStyle} className="w-full relative overflow-hidden">
      <SectionHeader title={data.name} textColor={textColor} />
      <motion.div {...animProps} className={`max-w-[1200px] mx-auto flex flex-col ${alignClass} gap-5 relative z-10 pt-24 lg:pt-32`} style={{ padding }}>
        {title && <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight">{title}</h2>}
        {subtitle && <p className="text-xs uppercase tracking-[0.2em] opacity-40">{subtitle}</p>}
        {description && <p className="text-sm md:text-base opacity-60 leading-relaxed max-w-2xl">{description}</p>}
        {cta && (
          <a href={ctaLink} target={ctaLink.startsWith('http') ? '_blank' : '_self'} rel="noreferrer" className="inline-block mt-4">
            <span className="px-6 py-2.5 border text-xs uppercase tracking-[0.2em] font-bold transition-opacity hover:opacity-70" style={{ borderColor: textColor }}>{cta}</span>
          </a>
        )}
        {media.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4">
            {media.map((img, i) => (
              <div key={i} className="aspect-video overflow-hidden bg-black/5">
                <img src={img} alt={`Media ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
