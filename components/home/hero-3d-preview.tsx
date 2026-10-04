'use client';

import { useEffect, useState, type ComponentType } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Box, ZoomIn } from 'lucide-react';
import { CanvasErrorBoundary } from '@/components/home/canvas-error-boundary';

type CanvasProps = {
  mouse: { x: number; y: number };
  scrollProgress?: number;
};

function Hero3DLoading() {
  const t = useTranslations('hero');
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0f2744]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-ocean border-t-transparent" />
        <span className="text-xs text-white/60">{t('loading3d')}</span>
      </div>
    </div>
  );
}

function Hero3DFallback() {
  return (
    <div className="absolute inset-0">
      <Image
        src="/images/hero/hero-1.jpg"
        alt="Synthetic thatch resort"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}

interface Hero3DPreviewProps {
  alt: string;
  scrollProgress?: number;
}

export function Hero3DPreview({ alt, scrollProgress = 0 }: Hero3DPreviewProps) {
  const t = useTranslations('hero');
  const [CanvasComponent, setCanvasComponent] = useState<ComponentType<CanvasProps> | null>(
    null
  );
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Preload FBX while the Three.js chunk downloads
    fetch('/models/reed-hut/lowpoly_Reed_Hut_01.fbx', { cache: 'force-cache' }).catch(
      () => undefined
    );

    import('@/components/home/hero-reed-hut-canvas')
      .then((mod) => {
        if (!cancelled) setCanvasComponent(() => mod.HeroReedHutCanvas);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative h-[min(560px,68vh)] w-full min-h-[420px]">
      <div className="absolute -inset-4 rounded-3xl bg-brand-ocean/25 blur-3xl" />
      <div className="relative h-full min-h-[420px] overflow-hidden rounded-2xl border border-white/25 bg-[#0f2744] shadow-2xl shadow-brand-ocean/30 ring-1 ring-white/15">
        <div className="absolute inset-0">
          {loadError ? (
            <Hero3DFallback />
          ) : CanvasComponent ? (
            <CanvasErrorBoundary fallbackImage="/images/hero/hero-1.jpg">
              <CanvasComponent mouse={{ x: 0, y: 0 }} scrollProgress={scrollProgress} />
            </CanvasErrorBoundary>
          ) : (
            <Hero3DLoading />
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-navy/35 via-transparent to-sky-400/5" />
        <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand-navy shadow-md">
          <Box className="h-3.5 w-3.5 text-brand-ocean" />
          {t('view3d')}
        </div>
        <div className="sr-only">{alt}</div>
        <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-10 flex items-center gap-2 rounded-lg border border-white/10 bg-black/55 px-3 py-2 text-xs text-white/90 backdrop-blur-md">
          <ZoomIn className="h-3.5 w-3.5 shrink-0 text-brand-ocean" />
          <span>{t('view3dHint')}</span>
        </div>
      </div>
    </div>
  );
}
