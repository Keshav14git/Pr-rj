import mongoose, { Document, Schema } from 'mongoose';

export interface ISectionContent {
  title?: string;
  subtitle?: string;
  description?: string;
  cta?: string;
  ctaLink?: string;
  media?: string[];
  backgroundColor?: string;
  textColor?: string;
  // Legacy fields (backward compat)
  heading?: string;
  paragraph?: string;
  images?: string[];
  caption?: string;
}

export interface ISectionStyle {
  alignment: 'left' | 'center' | 'right';
  padding: string;
  theme: 'light' | 'dark' | 'custom';
}

export interface ISectionAnimation {
  entry: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale' | 'none';
  scroll: 'parallax' | 'sticky' | 'none';
  duration: number;
  easing: string;
}

export interface ISection extends Document {
  name: string;
  type: 'hero' | 'split' | 'grid' | 'statement' | 'custom';
  layout: string;
  height: string;
  content: ISectionContent;
  style: ISectionStyle;
  animation: ISectionAnimation;
  order: number;
  visible: boolean;
  placementIndex: number;
  // Legacy fields
  layoutType?: string;
  createdAt: Date;
  updatedAt: Date;
}

const sectionSchema = new Schema<ISection>({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['hero', 'split', 'grid', 'statement', 'custom'],
    default: 'split'
  },
  layout: { type: String, default: 'full-width' },
  height: { type: String, default: 'auto' },
  content: {
    title: { type: String },
    subtitle: { type: String },
    description: { type: String },
    cta: { type: String },
    ctaLink: { type: String },
    media: [{ type: String }],
    backgroundColor: { type: String, default: '#FFFFFF' },
    textColor: { type: String, default: '#0A0A0A' },
    // Legacy
    heading: { type: String },
    paragraph: { type: String },
    images: [{ type: String }],
    caption: { type: String }
  },
  style: {
    alignment: { type: String, enum: ['left', 'center', 'right'], default: 'center' },
    padding: { type: String, default: '48px 24px' },
    theme: { type: String, enum: ['light', 'dark', 'custom'], default: 'light' }
  },
  animation: {
    entry: {
      type: String,
      enum: ['fade-up', 'fade-in', 'slide-left', 'slide-right', 'scale', 'none'],
      default: 'fade-up'
    },
    scroll: { type: String, enum: ['parallax', 'sticky', 'none'], default: 'none' },
    duration: { type: Number, default: 0.8 },
    easing: { type: String, default: 'easeOut' }
  },
  order: { type: Number, default: 0 },
  visible: { type: Boolean, default: true },
  placementIndex: { type: Number, required: true, default: 0 },
  // Legacy
  layoutType: { type: String }
}, { timestamps: true });

export default mongoose.model<ISection>('Section', sectionSchema);
