import type { Metadata } from 'next';
import { Gallery } from '@/components/Gallery';
import { galleryItems } from '@/lib/content/gallery';
import { getDict, isLocale, defaultLocale } from '@/lib/i18n';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: getDict(locale).gallery.title };
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDict(locale);

  return (
    <section className="section">
      <div className="container">
        <span className="tag">xview ~/gallery/*.jpg</span>
        <h1>{dict.gallery.title}</h1>
        <p className="lede">{dict.gallery.intro}</p>
        <div style={{ marginTop: '2.5rem' }}>
          <Gallery items={galleryItems} locale={isLocale(locale) ? locale : defaultLocale} />
        </div>
        <p className="mono" style={{ marginTop: '2rem', color: 'var(--ink-faint)' }}>
          {dict.gallery.hint}
        </p>
      </div>
    </section>
  );
}
