'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from '@/components/product-card';
import { categories } from '@/lib/data';
import type { Locale, Product } from '@/lib/types';

interface ProductGridLayoutProps {
  items: Product[];
  locale: Locale;
}

export function ProductGridLayout({ items, locale }: ProductGridLayoutProps) {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category');

  const filtered = useMemo(() => {
    if (!categorySlug) return items;
    const cat = categories.find((c) => c.slug === categorySlug);
    if (!cat) return items;
    return items.filter((p) => p.categoryId === cat.id);
  }, [items, categorySlug]);

  return (
    <motion.div
      layout
      className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 min-[1400px]:grid-cols-3"
    >
      <AnimatePresence mode="popLayout">
        {filtered.map((product) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
          >
            <ProductCard product={product} locale={locale} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
