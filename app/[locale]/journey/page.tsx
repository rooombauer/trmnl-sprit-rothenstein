import type { Metadata } from 'next';
import { BootLog } from '@/components/BootLog';
import { getDict } from '@/lib/i18n';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: getDict(locale).journey.title };
}

export default async function JourneyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDict(locale);

  return (
    <section className="section">
      <div className="container">
        <span className="tag">journey.log</span>
        <h1>{dict.journey.title}</h1>
        <p className="lede">{dict.journey.intro}</p>
        <div style={{ marginTop: '2.5rem' }}>
          <BootLog
            header={dict.journey.logHeader}
            progressLabel={dict.journey.progressLabel}
            entries={dict.journey.entries}
            readyLine={dict.journey.readyLine}
          />
        </div>
        <p className="lede" style={{ marginTop: '2.5rem' }}>
          {dict.journey.outro}
        </p>
      </div>
    </section>
  );
}
