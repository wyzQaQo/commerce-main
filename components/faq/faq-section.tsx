'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

interface FaqSectionProps {
  title: string;
  subtitle?: string;
  items: { id: string; question: string; answer: string }[];
  variant?: 'default' | 'sidebar';
}

export function FaqSection({
  title,
  subtitle,
  items,
  variant = 'default'
}: FaqSectionProps) {
  return (
    <section
      className={
        variant === 'sidebar'
          ? 'rounded-lg border bg-white p-6 shadow-card'
          : 'section-padding bg-secondary/30'
      }
    >
      <div className={variant === 'sidebar' ? '' : 'container max-w-3xl'}>
        <div className={variant === 'sidebar' ? 'mb-4' : 'mb-10 text-center'}>
          <h2
            className={
              variant === 'sidebar'
                ? 'text-lg font-bold text-brand-navy'
                : 'mb-3 text-3xl font-bold md:text-4xl'
            }
          >
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <Accordion type="single" collapsible className="w-full">
          {items.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
