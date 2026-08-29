import Link from 'next/link';
import { BootLog } from '@/components/BootLog';
import { StartupPhoto } from '@/components/StartupPhoto';
import { getDict } from '@/lib/i18n';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDict(locale);
  const teaserEntries = [dict.journey.entries[1], dict.journey.entries[dict.journey.entries.length - 1]];

  return (
    <>
      <section className="hero">
        <div className="container">
          <span className="eyebrow">{dict.home.eyebrow}</span>
          <h1>{dict.home.claim}</h1>
          <p className="lede">{dict.home.subline}</p>
          <div className="hero__actions">
            <Link className="btn btn--primary" href={`/${locale}/journey/`}>
              {dict.home.ctaJourney}
            </Link>
            <Link className="btn" href={`/${locale}/contact/`}>
              {dict.home.ctaContact}
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid--3">
          {dict.home.pillars.map((pillar) => (
            <article className="card" key={pillar.tag}>
              <span className="tag">{pillar.tag}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section--tight">
        <div className="container grid grid--2" style={{ alignItems: 'start' }}>
          <div>
            <h2>{dict.home.bootTeaserTitle}</h2>
            <p className="lede">{dict.home.bootTeaserText}</p>
            <p>
              <Link href={`/${locale}/journey/`}>{dict.home.bootTeaserLink}</Link>
            </p>
          </div>
          <BootLog
            header={dict.journey.logHeader}
            entries={teaserEntries}
            readyLine={dict.journey.readyLine}
          />
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '46rem' }}>
          <StartupPhoto
            caption={dict.home.photoCaption}
            missingHint={
              locale === 'de'
                ? 'startup.jpg in den /assets-Ordner legen — das Foto erscheint dann hier.'
                : 'Drop startup.jpg into the /assets folder — the photo will appear here.'
            }
          />
        </div>
      </section>
    </>
  );
}
