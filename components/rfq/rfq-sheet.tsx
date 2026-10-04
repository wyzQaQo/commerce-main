'use client';

import { useTranslations } from 'next-intl';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { InquiryForm } from '@/components/inquiry-form';

interface RfqSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName?: string;
  sku?: string;
  defaultQuantity?: number;
}

export function RfqSheet({
  open,
  onOpenChange,
  productName = '',
  sku = '',
  defaultQuantity
}: RfqSheetProps) {
  const t = useTranslations('products');

  const defaultProduct = [productName, sku].filter(Boolean).join(' · ');

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{t('inquiryTitle')}</SheetTitle>
          <SheetDescription>{t('inquirySubtitle')}</SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <InquiryForm
            compact
            defaultProduct={defaultProduct}
            defaultQuantity={defaultQuantity ?? 1}
            onSuccess={() => onOpenChange(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
