'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Package, Ship, Weight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateShipping } from '@/lib/shipping';
import type { PackagingSpec } from '@/lib/types';

interface CbmCalculatorProps {
  packaging: PackagingSpec;
  unitLabel?: string;
}

export function CbmCalculator({ packaging, unitLabel }: CbmCalculatorProps) {
  const t = useTranslations('cbm');
  const [quantity, setQuantity] = useState('1000');

  const result = useMemo(() => {
    const qty = parseInt(quantity, 10);
    if (!qty || qty < 1) return null;
    return calculateShipping(qty, packaging);
  }, [quantity, packaging]);

  return (
    <Card className="border-brand-ocean/20 shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Ship className="h-5 w-5 text-brand-ocean" />
          {t('title')}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="cbm-qty">
            {t('quantityLabel')} ({unitLabel ?? t('unitPieces')})
          </Label>
          <Input
            id="cbm-qty"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="max-w-xs"
          />
          <p className="text-xs text-muted-foreground">
            {t('packagingHint', {
              pieces: packaging.piecesPerCarton,
              l: packaging.lengthCm,
              w: packaging.widthCm,
              h: packaging.heightCm
            })}
          </p>
        </div>

        {result && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-secondary/50 p-4">
              <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Package className="h-3.5 w-3.5" />
                {t('totalCbm')}
              </div>
              <p className="text-2xl font-bold text-brand-navy">
                {result.totalCbm}{' '}
                <span className="text-sm font-normal">m³</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t('cartons', { count: result.cartons })}
              </p>
            </div>

            <div className="rounded-lg bg-secondary/50 p-4">
              <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Weight className="h-3.5 w-3.5" />
                {t('totalWeight')}
              </div>
              <p className="text-2xl font-bold text-brand-navy">
                {result.totalWeightKg}{' '}
                <span className="text-sm font-normal">kg</span>
              </p>
            </div>

            <div className="rounded-lg border border-brand-ocean/30 bg-brand-ocean/5 p-4 sm:col-span-2">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-ocean">
                {t('containerEstimate')}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-brand-navy">
                    {t('container20ft')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('fitsApprox', { count: result.maxPieces20ft.toLocaleString() })}
                  </p>
                  <p className="mt-1 text-xs text-brand-ocean">
                    {t('orderFill', { percent: result.containerFill20ft })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-navy">
                    {t('container40hc')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('fitsApprox', { count: result.maxPieces40hc.toLocaleString() })}
                  </p>
                  <p className="mt-1 text-xs text-brand-ocean">
                    {t('orderFill', { percent: result.containerFill40hc })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
