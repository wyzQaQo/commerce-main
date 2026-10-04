'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  Award,
  Building2,
  CheckCircle2,
  Factory,
  Flame,
  Globe2,
  Mail,
  MapPin,
  Phone,
  Settings2,
  ShieldCheck
} from 'lucide-react';
import { aboutContent, getLocalized } from '@/lib/data';
import { CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE } from '@/lib/constants';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { FadeInView } from '@/components/motion/fade-in-view';
import { StatsSection } from '@/components/home/stats-section';
import type { Locale } from '@/lib/types';

interface AboutPageContentProps {
  locale: Locale;
}

const expertiseIcons = [Factory, Flame, Globe2, Settings2] as const;

export function AboutPageContent({ locale }: AboutPageContentProps) {
  const t = useTranslations('about');
  const serveItems = [
    t('serveItem1'),
    t('serveItem2'),
    t('serveItem3'),
    t('serveItem4'),
    t('serveItem5')
  ];
  const expertiseItems = [
    { title: t('expertise1Title'), text: t('expertise1Text') },
    { title: t('expertise2Title'), text: t('expertise2Text') },
    { title: t('expertise3Title'), text: t('expertise3Text') },
    { title: t('expertise4Title'), text: t('expertise4Text') }
  ];

  return (
    <>
      {/* Intro */}
      <section className="section-padding">
        <div className="container max-w-screen-2xl">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <FadeInView>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl ring-1 ring-brand-ocean/10">
                <Image
                  src={aboutContent.introImage}
                  alt={t('introImageAlt')}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </FadeInView>
            <FadeInView delay={0.1}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-ocean">
                {t('founded')}
              </p>
              <h2 className="mb-4 text-2xl font-bold md:text-3xl">{t('introTitle')}</h2>
              <p className="mb-6 leading-relaxed text-muted-foreground">{t('introText')}</p>
              <p className="rounded-xl border border-brand-ocean/20 bg-sky-50/60 px-5 py-4 text-sm leading-relaxed text-brand-navy/90">
                {t('eeatAuthorityText')}
              </p>
            </FadeInView>
          </div>
        </div>
      </section>

      <StatsSection locale={locale} />

      {/* Experience */}
      <section className="section-padding bg-secondary/30">
        <div className="container max-w-screen-2xl">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <FadeInView className="order-2 lg:order-1">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-ocean">
                E-E-A-T
              </p>
              <h2 className="mb-4 text-2xl font-bold md:text-3xl">{t('eeatExperienceTitle')}</h2>
              <p className="leading-relaxed text-muted-foreground">{t('eeatExperienceText')}</p>
            </FadeInView>
            <FadeInView delay={0.1} className="order-1 lg:order-2">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src="/images/hero/hero-2.jpg"
                  alt={t('introImageAlt')}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </FadeInView>
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="section-padding">
        <div className="container max-w-screen-2xl">
          <FadeInView className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-bold md:text-3xl">{t('eeatExpertiseTitle')}</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">{t('eeatExpertiseSubtitle')}</p>
          </FadeInView>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {expertiseItems.map((item, i) => {
              const Icon = expertiseIcons[i] ?? Factory;
              return (
                <FadeInView key={item.title} delay={i * 0.08}>
                  <div className="h-full rounded-2xl border bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-ocean/10 text-brand-ocean">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mb-2 font-bold text-brand-navy">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                  </div>
                </FadeInView>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who we serve */}
      <section className="section-padding bg-gradient-to-b from-brand-navy to-[#0c3d5c] text-white">
        <div className="container max-w-screen-2xl">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <FadeInView>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/15">
                <Image
                  src="/images/hero/hero-3.jpg"
                  alt="Overwater resort with synthetic thatch"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </FadeInView>
            <FadeInView delay={0.1}>
              <div className="flex items-center gap-2 text-sky-300">
                <Building2 className="h-5 w-5" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                  {t('whoWeServeTitle')}
                </span>
              </div>
              <h2 className="mb-4 mt-3 text-2xl font-bold md:text-3xl">{t('whoWeServeTitle')}</h2>
              <p className="mb-6 text-white/75">{t('whoWeServeText')}</p>
              <ul className="space-y-3">
                {serveItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/90">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-ocean" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </FadeInView>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-secondary/30">
        <div className="container max-w-3xl">
          <FadeInView className="mb-10 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">{t('timelineTitle')}</h2>
          </FadeInView>
          <div className="relative space-y-0">
            <div className="absolute bottom-0 left-[1.125rem] top-0 w-px bg-brand-ocean/25 md:left-1/2 md:-translate-x-px" />
            {aboutContent.timeline.map((entry, i) => (
              <FadeInView key={entry.year} delay={i * 0.06}>
                <div
                  className={`relative flex flex-col gap-3 pb-10 md:flex-row md:items-center md:gap-8 ${
                    i % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  <div className="hidden flex-1 md:block" />
                  <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-brand-ocean bg-white text-xs font-bold text-brand-ocean shadow-md md:absolute md:left-1/2 md:-translate-x-1/2">
                    {entry.year.slice(2)}
                  </div>
                  <div className="flex-1 rounded-xl border bg-white p-5 shadow-sm md:max-w-[calc(50%-2.5rem)]">
                    <p className="mb-1 text-sm font-bold text-brand-ocean">{entry.year}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {getLocalized(entry.text, locale)}
                    </p>
                  </div>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates */}
      <section className="section-padding">
        <div className="container max-w-screen-2xl">
          <FadeInView className="mb-10 text-center">
            <div className="mb-3 flex justify-center">
              <ShieldCheck className="h-8 w-8 text-brand-ocean" />
            </div>
            <h2 className="mb-3 text-2xl font-bold md:text-3xl">{t('certificatesTitle')}</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">{t('certificatesSubtitle')}</p>
          </FadeInView>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {aboutContent.certificates.map((cert, i) => (
              <FadeInView key={cert.id} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-brand-ocean/15 bg-gradient-to-b from-sky-50/80 to-white p-6">
                  <Award className="mb-3 h-6 w-6 text-brand-ocean" />
                  <h3 className="mb-2 font-bold text-brand-navy">
                    {getLocalized(cert.title, locale)}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {getLocalized(cert.description, locale)}
                  </p>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* Factory photos */}
      <section className="section-padding bg-secondary/30">
        <div className="container max-w-screen-2xl">
          <FadeInView className="mb-10 text-center">
            <h2 className="mb-3 text-2xl font-bold md:text-3xl">{t('factoryPhotosTitle')}</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">{t('factoryPhotosSubtitle')}</p>
          </FadeInView>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {aboutContent.factoryPhotos.map((item, i) => (
              <FadeInView key={item.src} delay={i * 0.04}>
                <figure className="group overflow-hidden rounded-2xl bg-white shadow-card">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={item.src}
                      alt={getLocalized(item.caption, locale)}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                  <figcaption className="p-4 text-sm leading-relaxed text-muted-foreground">
                    {getLocalized(item.caption, locale)}
                  </figcaption>
                </figure>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* Project gallery */}
      <section className="section-padding">
        <div className="container max-w-screen-2xl">
          <FadeInView className="mb-10 text-center">
            <h2 className="mb-3 text-2xl font-bold md:text-3xl">{t('factoryTitle')}</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">{t('factorySubtitle')}</p>
          </FadeInView>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {aboutContent.gallery.map((item, i) => (
              <FadeInView key={item.src} delay={i * 0.05}>
                <figure className="group overflow-hidden rounded-2xl bg-white shadow-card">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={item.src}
                      alt={getLocalized(item.caption, locale)}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <figcaption className="p-4 text-sm leading-relaxed text-muted-foreground">
                    {getLocalized(item.caption, locale)}
                  </figcaption>
                </figure>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & contact CTA */}
      <section className="section-padding">
        <div className="container max-w-screen-2xl">
          <FadeInView>
            <div className="overflow-hidden rounded-2xl border bg-gradient-to-br from-brand-navy via-[#0f2744] to-sky-950 p-8 text-white md:p-12">
              <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
                    {t('eeatTrustTitle')}
                  </p>
                  <h2 className="mb-4 text-2xl font-bold md:text-3xl">{t('trustHeading')}</h2>
                  <p className="leading-relaxed text-white/75">{t('eeatTrustText')}</p>
                </div>
                <div className="rounded-xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
                  <ul className="mb-6 space-y-4 text-sm text-white/85">
                    <li className="flex gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                      <div>
                        <p className="font-semibold text-white">{t('addressLabel')}</p>
                        <p>{CONTACT_ADDRESS}</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                      <div>
                        <p className="font-semibold text-white">{t('emailLabel')}</p>
                        <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-sky-300">
                          {CONTACT_EMAIL}
                        </a>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                      <div>
                        <p className="font-semibold text-white">{t('phoneLabel')}</p>
                        <p>{CONTACT_PHONE}</p>
                      </div>
                    </li>
                  </ul>
                  <Button variant="gold" size="lg" asChild className="w-full sm:w-auto">
                    <Link href="/contact">{t('contactCtaButton')}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </FadeInView>
        </div>
      </section>
    </>
  );
}
