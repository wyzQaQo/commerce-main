'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { FadeInView } from '@/components/motion/fade-in-view';

export function AboutSectionClient() {
  const t = useTranslations('home');
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={ref} className="section-padding overflow-hidden bg-gradient-to-b from-white to-sky-50/80">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div style={{ y: imageY }} className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl ring-1 ring-brand-ocean/10">
            <Image
              src="/images/projects/project-1.jpg"
              alt="PalmGrass Pro synthetic thatch resort project"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
          <FadeInView>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t('aboutTitle')}</h2>
            <p className="mb-6 leading-relaxed text-muted-foreground">{t('aboutText')}</p>
            <Button variant="gold" asChild>
              <Link href="/about">{t('learnMore')}</Link>
            </Button>
          </FadeInView>
        </div>
      </div>
    </section>
  );
}
