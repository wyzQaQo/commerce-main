import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string>;
}

export async function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams = {}
}: PaginationProps) {
  const t = await getTranslations('pagination');

  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <div className="mt-10 flex items-center justify-center gap-4">
      {currentPage > 1 ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={buildUrl(currentPage - 1)}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            {t('previous')}
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          <ChevronLeft className="mr-1 h-4 w-4" />
          {t('previous')}
        </Button>
      )}

      <span className="text-sm text-muted-foreground">
        {t('page', { current: currentPage, total: totalPages })}
      </span>

      {currentPage < totalPages ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={buildUrl(currentPage + 1)}>
            {t('next')}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          {t('next')}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
