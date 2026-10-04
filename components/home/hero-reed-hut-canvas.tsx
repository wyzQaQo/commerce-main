'use client';

import { Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { ReedHutSceneContent } from '@/components/home/reed-hut-model';

interface HeroReedHutCanvasProps {
  mouse: { x: number; y: number };
  scrollProgress?: number;
}

export function HeroReedHutCanvas({ mouse, scrollProgress = 0 }: HeroReedHutCanvasProps) {
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div className="absolute inset-0 h-full w-full min-h-[400px]" onWheel={onWheel}>
      <Canvas
        className="h-full w-full cursor-grab active:cursor-grabbing"
        style={{ width: '100%', height: '100%', display: 'block' }}
        dpr={[1, 1.5]}
        frameloop="always"
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'default'
        }}
        camera={{ position: [8, 4, 8], fov: 42, near: 0.1, far: 120 }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0f2744');
        }}
      >
        <Suspense fallback={null}>
          <ReedHutSceneContent mouse={mouse} scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
