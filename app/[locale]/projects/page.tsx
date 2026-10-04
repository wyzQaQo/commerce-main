import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ProjectCard } from '@/components/projects/project-card';
import { projects } from '@/lib/data';
import { buildMetadata } from '@/lib/metadata';
import type { Locale } from '@/lib/types';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ru' }, { locale: 'es' }];
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projects' });
  return buildMetadata({
    title: t('title'),
    description: t('description'),
    path: '/projects',
    locale
  });
}

export default async function ProjectsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('projects');
  const loc = locale as Locale;

  return (
    <div className="section-padding">
      <div className="container">
        <div className="mb-10">
          <h1 className="mb-3 text-3xl font-bold md:text-4xl">{t('title')}</h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              locale={loc}
              regionLabel={t('region')}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
