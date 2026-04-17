// ============================================================
// SECTION TEMPLATE REGISTRY
// Predefined templates with sensible defaults
// ============================================================

import type { ISectionSchema } from './types';

export interface SectionTemplate {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  category: 'content' | 'media' | 'statement';
  defaults: Omit<ISectionSchema, '_id' | 'order' | 'placementIndex'>;
}

export const SECTION_TEMPLATES: SectionTemplate[] = [
  {
    id: 'hero-banner',
    name: 'Hero Banner',
    description: 'Full-screen hero with title, subtitle, and CTA',
    icon: 'Monitor',
    category: 'content',
    defaults: {
      name: 'Hero Banner',
      type: 'hero',
      layout: 'full-width',
      height: '100dvh',
      content: {
        title: 'Your Headline Here',
        subtitle: 'A powerful subtitle that supports your main message',
        description: '',
        cta: 'Learn More',
        media: [],
        backgroundColor: '#0A0A0A',
        textColor: '#FFFFFF',
      },
      style: {
        alignment: 'center',
        padding: '80px 24px',
        theme: 'dark',
      },
      animation: {
        entry: 'fade-up',
        scroll: 'none',
        duration: 1.0,
        easing: 'easeOut',
      },
      visible: true,
    },
  },
  {
    id: 'split-panel',
    name: 'Split Panel',
    description: '50/50 image and text side-by-side layout',
    icon: 'Columns2',
    category: 'content',
    defaults: {
      name: 'Split Panel',
      type: 'split',
      layout: '2-col',
      height: 'auto',
      content: {
        title: 'Section Title',
        subtitle: '',
        description: 'Write your detailed content here. This panel supports longer-form text alongside a visual asset.',
        cta: '',
        media: [],
        backgroundColor: '#FFFFFF',
        textColor: '#0A0A0A',
      },
      style: {
        alignment: 'left',
        padding: '48px 24px',
        theme: 'light',
      },
      animation: {
        entry: 'fade-up',
        scroll: 'none',
        duration: 0.8,
        easing: 'easeOut',
      },
      visible: true,
    },
  },
  {
    id: 'grid-gallery',
    name: 'Grid Gallery',
    description: 'Responsive image grid with hover effects',
    icon: 'LayoutGrid',
    category: 'media',
    defaults: {
      name: 'Grid Gallery',
      type: 'grid',
      layout: '3-col',
      height: 'auto',
      content: {
        title: 'Gallery',
        subtitle: 'A curated collection',
        description: '',
        cta: '',
        media: [],
        backgroundColor: '#FAFAFA',
        textColor: '#0A0A0A',
      },
      style: {
        alignment: 'center',
        padding: '64px 24px',
        theme: 'light',
      },
      animation: {
        entry: 'scale',
        scroll: 'none',
        duration: 0.6,
        easing: 'easeOut',
      },
      visible: true,
    },
  },
  {
    id: 'bold-statement',
    name: 'Bold Statement',
    description: 'Full-width centered headline or quote',
    icon: 'Quote',
    category: 'statement',
    defaults: {
      name: 'Bold Statement',
      type: 'statement',
      layout: 'full-width',
      height: 'auto',
      content: {
        title: '"Design is not what it looks like. Design is how it works."',
        subtitle: '— Steve Jobs',
        description: '',
        cta: '',
        media: [],
        backgroundColor: '#0A0A0A',
        textColor: '#FFFFFF',
      },
      style: {
        alignment: 'center',
        padding: '96px 24px',
        theme: 'dark',
      },
      animation: {
        entry: 'fade-in',
        scroll: 'none',
        duration: 1.2,
        easing: 'easeOut',
      },
      visible: true,
    },
  },
  {
    id: 'custom-blank',
    name: 'Custom Block',
    description: 'Blank canvas — build whatever you need',
    icon: 'PenTool',
    category: 'content',
    defaults: {
      name: 'Custom Section',
      type: 'custom',
      layout: 'full-width',
      height: 'auto',
      content: {
        title: 'Custom Section',
        subtitle: '',
        description: 'Start building your custom content here.',
        cta: '',
        media: [],
        backgroundColor: '#FFFFFF',
        textColor: '#0A0A0A',
      },
      style: {
        alignment: 'left',
        padding: '48px 24px',
        theme: 'light',
      },
      animation: {
        entry: 'fade-up',
        scroll: 'none',
        duration: 0.8,
        easing: 'easeOut',
      },
      visible: true,
    },
  },
];

/**
 * Creates a new section from a template, assigning a fresh ID
 * and default order/placement values.
 */
export function createSectionFromTemplate(
  templateId: string,
  order: number,
  placementIndex: number = 0
): ISectionSchema {
  const template = SECTION_TEMPLATES.find(t => t.id === templateId);
  if (!template) {
    throw new Error(`Template not found: ${templateId}`);
  }

  return {
    ...structuredClone(template.defaults),
    order,
    placementIndex,
  };
}

/**
 * Get templates grouped by category
 */
export function getTemplatesByCategory() {
  const categories = {
    content: [] as SectionTemplate[],
    media: [] as SectionTemplate[],
    statement: [] as SectionTemplate[],
  };

  SECTION_TEMPLATES.forEach(t => {
    categories[t.category].push(t);
  });

  return categories;
}
