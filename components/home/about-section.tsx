import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

export async function AboutSection() {
  const t = await getTranslations('home');

  return (
    <section className="section-padding">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-card">
            <Image
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80"
              alt="PalmGrass factory"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t('aboutTitle')}</h2>
            <p className="mb-6 leading-relaxed text-muted-foreground">{t('aboutText')}</p>
            <Button variant="gold" asChild>
              <Link href="/about">{t('learnMore')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
