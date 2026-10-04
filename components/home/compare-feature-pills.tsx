'use client';

import { motion } from 'framer-motion';
import { FadeInView } from '@/components/motion/fade-in-view';
import { Shield, Sun, Waves, Wind } from 'lucide-react';

const FEATURES = [
  { icon: Sun, label: 'UV Resistant', side: 'left' as const },
  { icon: Shield, label: 'Class B1 Fire Rated', side: 'right' as const },
  { icon: Wind, label: 'Hurricane Tested', side: 'left' as const },
  { icon: Waves, label: 'Salt-Spray Ready', side: 'right' as const }
];

export function CompareFeaturePills() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block">
      {FEATURES.map((f, i) => (
        <FadeInView
          key={f.label}
          delay={0.1 + i * 0.08}
          y={f.side === 'left' ? -20 : 20}
          className={`absolute top-1/2 ${f.side === 'left' ? '-left-2 lg:left-4' : '-right-2 lg:right-4'} -translate-y-1/2`}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 rounded-full border border-brand-ocean/30 bg-brand-navy/90 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-md"
            style={{ marginTop: `${(i - 1.5) * 56}px` }}
          >
            <f.icon className="h-4 w-4 text-brand-ocean-light" />
            {f.label}
          </motion.div>
        </FadeInView>
      ))}
    </div>
  );
}
