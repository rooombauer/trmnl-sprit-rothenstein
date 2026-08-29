import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { LocaleLang } from '@/components/LocaleLang';
import { getDict, locales } from '@/lib/i18n';

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDict(locale);
  return {
    title: {
      default: `${dict.meta.siteName} — ${dict.meta.titleSuffix}`,
      template: `%s — ${dict.meta.siteName}`,
    },
    description: dict.meta.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDict(locale);
  return (
    <>
      <LocaleLang locale={locale} />
      <SiteHeader locale={locale} nav={dict.nav} siteName={dict.meta.siteName} />
      <main>{children}</main>
      <SiteFooter siteName={dict.meta.siteName} line={dict.footer.line} />
    </>
  );
}
