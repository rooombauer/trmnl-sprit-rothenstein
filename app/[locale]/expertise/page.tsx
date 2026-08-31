import type { Metadata } from 'next';
import { StatBar } from '@/components/StatBar';
import { getDict } from '@/lib/i18n';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: getDict(locale).expertise.title };
}

export default async function ExpertisePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDict(locale);

  return (
    <section className="section">
      <div className="container">
        <span className="tag">stack.layers</span>
        <h1>{dict.expertise.title}</h1>
        <p className="lede">{dict.expertise.intro}</p>
        <div className="grid grid--2" style={{ marginTop: '2.5rem' }}>
          {dict.expertise.areas.map((area) => (
            <article className="card" key={area.tag}>
              <span className="tag">{area.tag}</span>
              <h3>{area.title}</h3>
              <p>{area.text}</p>
              <ul>
                {area.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <StatBar label={area.tag} value={area.stat} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
