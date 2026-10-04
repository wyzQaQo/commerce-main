import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Badge } from '@/components/ui/badge';
import { getFeaturedProjects, getLocalized } from '@/lib/data';
import type { Locale } from '@/lib/types';

interface ProjectsSectionProps {
  locale: Locale;
}

export async function ProjectsSection({ locale }: ProjectsSectionProps) {
  const t = await getTranslations('home');
  const tProjects = await getTranslations('projects');
  const projects = getFeaturedProjects(4);

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold md:text-4xl">{t('projectsTitle')}</h2>
          <p className="text-muted-foreground">{t('projectsSubtitle')}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project) => (
            <article
              key={project.id}
              className="group overflow-hidden rounded-lg bg-white shadow-card product-card-hover"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={project.image}
                  alt={getLocalized(project.title, locale)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="p-4">
                <Badge variant="outline" className="mb-2">
                  {tProjects('region')}: {getLocalized(project.region, locale)}
                </Badge>
                <h3 className="mb-2 font-bold text-brand-navy">
                  {getLocalized(project.title, locale)}
                </h3>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {getLocalized(project.summary, locale)}
                </p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/projects"
            className="text-sm font-semibold text-brand-ocean hover:underline"
          >
            {t('viewProject')} &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
