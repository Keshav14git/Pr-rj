// ============================================================
// SECTION BUILDER — Entry Point
// Re-exports BuilderLayout as the admin module component
// ============================================================

import BuilderLayout from './builder/BuilderLayout';

export default function SectionBuilder() {
  return <BuilderLayout />;
}
