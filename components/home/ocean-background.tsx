'use client';

import { CoastalHorizon } from '@/components/effects/coastal-horizon';

/** Hero ocean mood — visible horizon waves, zero drag interaction */
export function OceanBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/80 via-slate-900/70 to-sky-950/80" />
      <CoastalHorizon />
    </div>
  );
}
