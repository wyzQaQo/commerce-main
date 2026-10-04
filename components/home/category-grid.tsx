'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { FadeInView } from '@/components/motion/fade-in-view';
import { TiltCard } from '@/components/motion/tilt-card';
import { categories, getLocalized } from '@/lib/data';
import type { Locale } from '@/lib/types';

interface CategoryGridProps {
  locale: Locale;
}

export function CategoryGrid({ locale }: CategoryGridProps) {
  const t = useTranslations('home');

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container">
        <FadeInView className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold md:text-4xl">{t('categoriesTitle')}</h2>
          <p className="text-muted-foreground">{t('categoriesSubtitle')}</p>
        </FadeInView>
        <motion.div
          layout
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map((cat, i) => (
            <FadeInView key={cat.id} delay={i * 0.06}>
              <TiltCard intensity={8}>
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="group block overflow-hidden rounded-lg bg-white shadow-card transition-shadow hover:shadow-card-hover"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={cat.image}
                      alt={getLocalized(cat.name, locale)}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-lg font-bold text-white">
                        {getLocalized(cat.name, locale)}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {getLocalized(cat.description, locale)}
                    </p>
                    <Button variant="outline" size="sm" className="ml-3 shrink-0">
                      {t('viewCategory')}
                    </Button>
                  </div>
                </Link>
              </TiltCard>
            </FadeInView>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
