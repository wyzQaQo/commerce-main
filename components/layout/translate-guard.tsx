'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export function TranslateGuard() {
  const t = useTranslations('translateGuard');

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('translate', 'no');
    html.classList.add('notranslate');

    const onError = (event: ErrorEvent) => {
      const msg = String(event.message ?? '');
      if (msg.includes('removeChild') || msg.includes('insertBefore')) {
        event.preventDefault();
      }
    };

    window.addEventListener('error', onError);
    return () => window.removeEventListener('error', onError);
  }, []);

  return null;
}
