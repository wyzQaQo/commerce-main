'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  inquirySchema,
  MIN_PROJECT_AREA_SQM,
  type InquiryFormData
} from '@/lib/inquiry-schema';
import { INQUIRY_COUNTRIES } from '@/lib/countries';

interface InquiryFormProps {
  defaultProduct?: string;
  defaultQuantity?: number;
  compact?: boolean;
  onSuccess?: () => void;
}

function fieldError(
  errors: Record<string, { message?: string } | undefined>,
  key: keyof InquiryFormData,
  tVal: (k: string, values?: Record<string, number>) => string
) {
  const err = errors[key];
  if (!err?.message) return null;
  const msg = String(err.message);
  if (msg === 'minProjectArea') {
    return tVal('minProjectArea', { min: MIN_PROJECT_AREA_SQM });
  }
  return tVal(msg) !== msg ? tVal(msg) : tVal('required');
}

export function InquiryForm({
  defaultProduct = '',
  defaultQuantity = 1,
  compact = false,
  onSuccess
}: InquiryFormProps) {
  const t = useTranslations('contact');
  const tVal = useTranslations('validation');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      product: defaultProduct,
      quantity: defaultQuantity,
      projectAreaSqm: undefined
    }
  });

  const onSubmit = async (data: InquiryFormData) => {
    setStatus('loading');
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      reset();
      onSuccess?.();
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center text-green-800">
        {t('success')}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="rounded-md border border-brand-ocean/30 bg-brand-ocean/5 px-3 py-2 text-xs text-brand-navy">
        {t('b2bNotice')}
      </p>

      <div className={compact ? 'space-y-4' : 'grid gap-4 sm:grid-cols-2'}>
        <div className="space-y-2">
          <Label htmlFor="name">
            {t('name')} <span className="text-red-500">*</span>
          </Label>
          <Input id="name" {...register('name')} />
          {errors.name && (
            <p className="text-xs text-red-500">
              {fieldError(errors, 'name', tVal)}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">
            {t('email')} <span className="text-red-500">*</span>
          </Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email && (
            <p className="text-xs text-red-500">
              {fieldError(errors, 'email', tVal)}
            </p>
          )}
        </div>
      </div>

      <div className={compact ? 'space-y-4' : 'grid gap-4 sm:grid-cols-2'}>
        <div className="space-y-2">
          <Label htmlFor="whatsapp">
            {t('whatsapp')} <span className="text-red-500">*</span>
          </Label>
          <Input id="whatsapp" placeholder="+1 234 567 8900" {...register('whatsapp')} />
          {errors.whatsapp && (
            <p className="text-xs text-red-500">
              {fieldError(errors, 'whatsapp', tVal)}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="projectCountry">
            {t('projectCountry')} <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="projectCountry"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="projectCountry">
                  <SelectValue placeholder={t('selectCountry')} />
                </SelectTrigger>
                <SelectContent>
                  {INQUIRY_COUNTRIES.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.projectCountry && (
            <p className="text-xs text-red-500">
              {fieldError(errors, 'projectCountry', tVal)}
            </p>
          )}
        </div>
      </div>

      <div className={compact ? 'space-y-4' : 'grid gap-4 sm:grid-cols-2'}>
        <div className="space-y-2">
          <Label htmlFor="projectAreaSqm">
            {t('projectArea')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="projectAreaSqm"
            type="number"
            min={MIN_PROJECT_AREA_SQM}
            step={1}
            placeholder={t('projectAreaPlaceholder', { min: MIN_PROJECT_AREA_SQM })}
            {...register('projectAreaSqm')}
          />
          <p className="text-xs text-muted-foreground">{t('projectAreaHint')}</p>
          {errors.projectAreaSqm && (
            <p className="text-xs text-red-500">
              {fieldError(errors, 'projectAreaSqm', tVal)}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">{t('quantity')}</Label>
          <Input id="quantity" type="number" min={1} {...register('quantity')} />
          {errors.quantity && (
            <p className="text-xs text-red-500">
              {fieldError(errors, 'quantity', tVal)}
            </p>
          )}
        </div>
      </div>

      {!compact && (
        <div className="space-y-2">
          <Label htmlFor="product">{t('product')}</Label>
          <Input id="product" {...register('product')} />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="message">{t('message')}</Label>
        <Textarea
          id="message"
          rows={compact ? 3 : 4}
          placeholder={t('messagePlaceholder')}
          {...register('message')}
        />
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-500">{t('error')}</p>
      )}

      <Button type="submit" variant="gold" className="w-full" disabled={status === 'loading'}>
        {status === 'loading' ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}
