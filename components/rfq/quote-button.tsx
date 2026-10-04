'use client';

import { useTranslations } from 'next-intl';
import { Button, type ButtonProps } from '@/components/ui/button';
import { useRfq } from '@/components/rfq/rfq-provider';

interface QuoteButtonProps extends Omit<ButtonProps, 'onClick'> {
  productName?: string;
  sku?: string;
  quantity?: number;
  label?: string;
  onClick?: () => void;
}

export function QuoteButton({
  productName,
  sku,
  quantity,
  label,
  onClick,
  variant = 'outline',
  size = 'sm',
  className,
  ...props
}: QuoteButtonProps) {
  const t = useTranslations('nav');
  const { openRfq } = useRfq();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={() => {
        openRfq({ productName, sku, quantity });
        onClick?.();
      }}
      {...props}
    >
      {label ?? t('getQuote')}
    </Button>
  );
}
