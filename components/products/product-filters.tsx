'use client';

import { useRouter, usePathname } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { categories, getAllBrands } from '@/lib/data';
import { getLocalized } from '@/lib/data';
import type { Locale } from '@/lib/types';

interface ProductFiltersProps {
  locale: Locale;
}

export function ProductFilters({ locale }: ProductFiltersProps) {
  const t = useTranslations('products');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') || '';
  const currentBrand = searchParams.get('brand') || '';
  const currentPrice = searchParams.get('price') || '';

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  const resetFilters = () => {
    router.push(pathname);
  };

  const brands = getAllBrands();

  return (
    <div className="space-y-6 rounded-lg border bg-white p-6 shadow-card" translate="no">
      <div className="space-y-2">
        <Label>{t('filterCategory')}</Label>
        <Select
          value={currentCategory || 'all'}
          onValueChange={(v) => updateFilter('category', v === 'all' ? '' : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('allCategories')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allCategories')}</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {getLocalized(cat.name, locale)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>{t('filterBrand')}</Label>
        <Select
          value={currentBrand || 'all'}
          onValueChange={(v) => updateFilter('brand', v === 'all' ? '' : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('allBrands')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allBrands')}</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>{t('filterPrice')}</Label>
        <Select
          value={currentPrice || 'all'}
          onValueChange={(v) => updateFilter('price', v === 'all' ? '' : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('priceAll')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('priceAll')}</SelectItem>
            <SelectItem value="0-50">{t('priceUnder50')}</SelectItem>
            <SelectItem value="50-100">{t('price50to100')}</SelectItem>
            <SelectItem value="100-200">{t('price100to200')}</SelectItem>
            <SelectItem value="200+">{t('priceOver200')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" className="w-full" onClick={resetFilters}>
        {t('resetFilters')}
      </Button>
    </div>
  );
}
