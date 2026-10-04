'use client';

import Image from 'next/image';
import { useRef, type MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import type { Locale, Project } from '@/lib/types';
import { getLocalized } from '@/lib/data';

interface ProjectCardProps {
  project: Project;
  locale: Locale;
  regionLabel: string;
}

export function ProjectCard({ project, locale, regionLabel }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), {
    stiffness: 200,
    damping: 18
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), {
    stiffness: 200,
    damping: 18
  });

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  const title = getLocalized(project.title, locale);
  const region = getLocalized(project.region, locale);
  const summary = getLocalized(project.summary, locale);

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="overflow-hidden rounded-xl bg-white shadow-card"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={project.image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute inset-0 flex items-end bg-gradient-to-t from-brand-navy/90 via-transparent to-transparent p-6"
        >
          <span className="text-lg font-bold text-brand-ocean">{region}</span>
        </motion.div>
      </div>
      <div className="p-6">
        <Badge variant="outline" className="mb-3">
          {regionLabel}: {region}
        </Badge>
        <h2 className="mb-3 text-xl font-bold">{title}</h2>
        <p className="text-muted-foreground">{summary}</p>
      </div>
    </motion.article>
  );
}
