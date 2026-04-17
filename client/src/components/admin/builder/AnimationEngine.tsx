// ============================================================
// ANIMATION ENGINE
// Maps schema animation presets to Framer Motion props
// ============================================================

import type { ISectionAnimation } from './types';

interface MotionAnimationProps {
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  whileInView?: Record<string, any>;
  viewport?: Record<string, any>;
  transition?: Record<string, any>;
  style?: Record<string, any>;
}

/**
 * Returns Framer Motion props for a section's entry animation.
 * Returns empty object if animation is 'none' or disabled.
 */
export function getEntryAnimationProps(
  animation: ISectionAnimation,
  disabled: boolean = false
): MotionAnimationProps {
  if (disabled || animation.entry === 'none') return {};

  const transition = {
    duration: animation.duration || 0.8,
    ease: mapEasing(animation.easing),
  };

  const viewport = { once: true, margin: '-80px' };

  switch (animation.entry) {
    case 'fade-up':
      return {
        initial: { opacity: 0, y: 60 },
        whileInView: { opacity: 1, y: 0 },
        viewport,
        transition,
      };

    case 'fade-in':
      return {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport,
        transition,
      };

    case 'slide-left':
      return {
        initial: { opacity: 0, x: 80 },
        whileInView: { opacity: 1, x: 0 },
        viewport,
        transition,
      };

    case 'slide-right':
      return {
        initial: { opacity: 0, x: -80 },
        whileInView: { opacity: 1, x: 0 },
        viewport,
        transition,
      };

    case 'scale':
      return {
        initial: { opacity: 0, scale: 0.85 },
        whileInView: { opacity: 1, scale: 1 },
        viewport,
        transition: { ...transition, ease: 'backOut' },
      };

    default:
      return {};
  }
}

/**
 * Returns scroll-based styles/props for a section.
 */
export function getScrollBehaviorStyle(
  animation: ISectionAnimation,
  disabled: boolean = false
): React.CSSProperties {
  if (disabled || animation.scroll === 'none') return {};

  switch (animation.scroll) {
    case 'sticky':
      return { position: 'sticky' as const, top: 0, zIndex: 1 };

    case 'parallax':
      // Parallax is handled via transform in the renderer
      return {};

    default:
      return {};
  }
}

/**
 * Maps easing string to Framer Motion easing array or string
 */
function mapEasing(easing: string): "easeOut" | "easeInOut" | "circOut" | "backOut" {
  switch (easing) {
    case 'easeOut': return 'easeOut';
    case 'easeInOut': return 'easeInOut';
    case 'circOut': return 'circOut';
    case 'backOut': return 'backOut';
    case 'spring': return 'easeOut'; // Spring is handled via spring transition
    default: return 'easeOut';
  }
}

/**
 * Returns staggered animation props for children elements
 * (used in grid layouts)
 */
export function getStaggerContainerProps(
  animation: ISectionAnimation,
  disabled: boolean = false
) {
  if (disabled || animation.entry === 'none') return {};

  return {
    initial: 'hidden',
    whileInView: 'visible',
    viewport: { once: true, margin: '-80px' },
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  };
}

export function getStaggerChildProps(animation: ISectionAnimation) {
  if (animation.entry === 'none') return {};

  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: animation.duration || 0.5,
        ease: mapEasing(animation.easing),
      },
    },
  };

  return { variants };
}
