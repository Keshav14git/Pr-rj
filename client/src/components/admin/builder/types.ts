// ============================================================
// SECTION BUILDER — TYPE SYSTEM
// Single source of truth for all builder types
// ============================================================

export type SectionType = 'hero' | 'split' | 'grid' | 'statement' | 'custom';
export type Alignment = 'left' | 'center' | 'right';
export type Theme = 'light' | 'dark' | 'custom';
export type EntryAnimation = 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale' | 'none';
export type ScrollBehavior = 'parallax' | 'sticky' | 'none';
export type BuilderMode = 'edit' | 'preview';

export interface ISectionContent {
  title?: string;
  subtitle?: string;
  description?: string;
  cta?: string;
  ctaLink?: string;
  media?: string[];
  backgroundColor?: string;
  textColor?: string;
  // Legacy compat
  heading?: string;
  paragraph?: string;
  images?: string[];
}

export interface ISectionStyle {
  alignment: Alignment;
  padding: string;
  theme: Theme;
}

export interface ISectionAnimation {
  entry: EntryAnimation;
  scroll: ScrollBehavior;
  duration: number;
  easing: string;
}

export interface ISectionSchema {
  _id?: string;
  name: string;
  type: SectionType;
  layout: string;
  height: string;
  content: ISectionContent;
  style: ISectionStyle;
  animation: ISectionAnimation;
  order: number;
  visible: boolean;
  placementIndex: number;
  // Legacy compat
  layoutType?: string;
}

// ============================================================
// GLOBAL DESIGN CONSTRAINT TOKENS
// ============================================================

export const DESIGN_CONSTRAINTS = {
  maxContainerWidth: 1200,
  minSectionPaddingV: 48,
  minSectionPaddingH: 24,
  gridColumnOptions: [1, 2, 3, 4] as const,
  maxTitleLength: 120,
  maxCtaLength: 60,
  maxDescriptionLength: 2000,
} as const;

// ============================================================
// PLACEMENT OPTIONS (matches Home.tsx injection slots)
// ============================================================

export const PLACEMENT_OPTIONS = [
  { index: 0, label: "After Hero" },
  { index: 1, label: "After About" },
  { index: 2, label: "After Core Expertise" },
  { index: 3, label: "After Experience / Projects" },
  { index: 4, label: "After Key Achievements" },
  { index: 5, label: "After Skills" },
] as const;

// ============================================================
// ANIMATION OPTIONS
// ============================================================

export const ENTRY_ANIMATION_OPTIONS: { value: EntryAnimation; label: string }[] = [
  { value: 'fade-up', label: 'Fade Up' },
  { value: 'fade-in', label: 'Fade In' },
  { value: 'slide-left', label: 'Slide Left' },
  { value: 'slide-right', label: 'Slide Right' },
  { value: 'scale', label: 'Scale' },
  { value: 'none', label: 'None' },
];

export const SCROLL_BEHAVIOR_OPTIONS: { value: ScrollBehavior; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'parallax', label: 'Parallax' },
  { value: 'sticky', label: 'Sticky' },
];

export const EASING_OPTIONS = [
  { value: 'easeOut', label: 'Ease Out' },
  { value: 'easeInOut', label: 'Ease In-Out' },
  { value: 'circOut', label: 'Circular Out' },
  { value: 'backOut', label: 'Back Out (Bounce)' },
  { value: 'spring', label: 'Spring' },
] as const;

// ============================================================
// LAYOUT OPTIONS
// ============================================================

export const LAYOUT_OPTIONS: Record<SectionType, { value: string; label: string }[]> = {
  hero: [
    { value: 'full-width', label: 'Full Width' },
    { value: 'centered', label: 'Centered Content' },
  ],
  split: [
    { value: '2-col', label: '50 / 50 Split' },
    { value: '2-col-reverse', label: '50 / 50 Reverse' },
    { value: '60-40', label: '60 / 40 Split' },
    { value: '40-60', label: '40 / 60 Split' },
  ],
  grid: [
    { value: '2-col', label: '2 Columns' },
    { value: '3-col', label: '3 Columns' },
    { value: '4-col', label: '4 Columns' },
  ],
  statement: [
    { value: 'full-width', label: 'Full Width' },
    { value: 'constrained', label: 'Constrained Width' },
  ],
  custom: [
    { value: 'full-width', label: 'Full Width' },
    { value: '2-col', label: '2 Columns' },
    { value: '3-col', label: '3 Columns' },
  ],
};

// ============================================================
// HEIGHT PRESETS
// ============================================================

export const HEIGHT_PRESETS = [
  { value: 'auto', label: 'Auto (Content)' },
  { value: '100dvh', label: 'Full Screen' },
  { value: '80dvh', label: '80% Screen' },
  { value: '60dvh', label: '60% Screen' },
  { value: '50dvh', label: 'Half Screen' },
] as const;

// ============================================================
// THEME COLOR MAPS
// ============================================================

export const THEME_COLORS: Record<Theme, { bg: string; text: string; border: string }> = {
  light: { bg: '#FFFFFF', text: '#0A0A0A', border: '#E0E0E0' },
  dark: { bg: '#0A0A0A', text: '#FFFFFF', border: '#2A2A2A' },
  custom: { bg: '#FFFFFF', text: '#0A0A0A', border: '#E0E0E0' },
};
