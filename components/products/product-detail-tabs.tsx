'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
interface ProductDetailTabsProps {
  description: string;
  specs: { label: string; value: string }[];
  installationGuide: string;
  certifications: { title: string; description: string }[];
}

export function ProductDetailTabs({
  description,
  specs,
  installationGuide,
  certifications
}: ProductDetailTabsProps) {
  const t = useTranslations('products');

  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid h-auto w-full grid-cols-2 gap-1 md:grid-cols-4">
        <TabsTrigger value="description">{t('tabDescription')}</TabsTrigger>
        <TabsTrigger value="specs">{t('tabSpecs')}</TabsTrigger>
        <TabsTrigger value="installation">{t('tabInstallation')}</TabsTrigger>
        <TabsTrigger value="certifications">{t('tabCertifications')}</TabsTrigger>
      </TabsList>

      <TabsContent value="description">
        <p className="leading-relaxed text-muted-foreground">{description}</p>
      </TabsContent>

      <TabsContent value="specs">
        {specs.length > 0 ? (
          <table className="w-full text-sm">
            <tbody>
              {specs.map((spec, i) => (
                <tr key={i} className="border-b">
                  <td className="py-3 pr-4 font-medium text-brand-navy">
                    {spec.label}
                  </td>
                  <td className="py-3 text-muted-foreground">{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted-foreground">{t('noSpecs')}</p>
        )}
      </TabsContent>

      <TabsContent value="installation">
        <div className="prose prose-sm max-w-none prose-headings:text-brand-navy">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {installationGuide}
          </ReactMarkdown>
        </div>
      </TabsContent>

      <TabsContent value="certifications">
        <div className="grid gap-4 sm:grid-cols-2">
          {certifications.map((cert) => (
            <div
              key={cert.title}
              className="rounded-lg border border-brand-ocean/20 bg-secondary/30 p-4"
            >
              <h4 className="mb-2 font-bold text-brand-navy">{cert.title}</h4>
              <p className="text-sm text-muted-foreground">{cert.description}</p>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
