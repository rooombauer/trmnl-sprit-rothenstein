import Link from 'next/link';
import { StartupPhoto } from '@/components/StartupPhoto';
import { getDict } from '@/lib/i18n';

// Ein getippter Befehl: --n = Zeichenzahl (steuert die Tipp-Animation),
// --d = Verzögerung in der Boot-Sequenz.
function Cmd({ text, delay }: { text: string; delay: number }) {
  return (
    <p className="hero__line">
      <span className="prompt">rbauer@career</span>
      <span
        className="type cmd"
        style={{ ['--n' as string]: text.length, ['--d' as string]: `${delay}s` }}
      >
        {text}
      </span>
    </p>
  );
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDict(locale);
  const logTail = [dict.journey.entries[1], dict.journey.entries[dict.journey.entries.length - 1]];
  const logCmd = locale === 'de' ? 'tail -2 werdegang.log' : 'tail -2 journey.log';

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero__status">
            <span>CAREER-OS v25.1 — tty1</span>
            <span>{dict.home.eyebrow}</span>
            <span>mem: koffein 97% · uptime: 25y+</span>
          </div>

          <Cmd text="whoami" delay={0.2} />
          <div className="appear" style={{ ['--d' as string]: '1s' }}>
            <h1>
              {dict.home.claim}
              <span className="cursor" aria-hidden />
            </h1>
            <p className="comment">{dict.home.comment}</p>
            <p className="lede">{dict.home.subline}</p>
          </div>

          <Cmd text={logCmd} delay={1.6} />
          <div className="appear" style={{ ['--d' as string]: '2.5s' }}>
            {logTail.map((entry) => (
              <p className="hero__out" key={entry.module}>
                [{entry.time}] {entry.module} ...{' '}
                {entry.status === 'RUN' ? <span className="run">RUNNING</span> : <span className="ok">OK</span>}
              </p>
            ))}
          </div>

          <Cmd text="sudo make coffee" delay={3.0} />
          <p className="hero__out appear" style={{ ['--d' as string]: '3.8s' }}>
            [sudo] ******** — {dict.home.sudoResponse}
          </p>

          <div className="hero__actions appear" style={{ ['--d' as string]: '4.1s' }}>
            <Link className="btn btn--primary" href={`/${locale}/journey/`}>
              {dict.home.ctaJourney}
            </Link>
            <Link className="btn" href={`/${locale}/contact/`}>
              {dict.home.ctaContact}
            </Link>
          </div>

          <p className="hero__line appear" style={{ ['--d' as string]: '4.4s' }}>
            <span className="prompt">rbauer@career</span>
            <span className="cursor" aria-hidden />
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="tag">ls kompetenzen/ | head -3</span>
          <div className="grid grid--3">
            {dict.home.pillars.map((pillar) => (
              <article className="card" key={pillar.tag}>
                <span className="tag">cat {pillar.tag}.md</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </article>
            ))}
          </div>
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
