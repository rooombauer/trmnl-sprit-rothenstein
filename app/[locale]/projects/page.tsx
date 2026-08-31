import type { Metadata } from 'next';
import { getDict } from '@/lib/i18n';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: getDict(locale).projects.title };
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDict(locale);

  return (
    <section className="section">
      <div className="container">
        <span className="tag">selected.work</span>
        <h1>{dict.projects.title}</h1>
        <p className="lede">{dict.projects.intro}</p>
        <div className="grid grid--3" style={{ marginTop: '2.5rem' }}>
          {dict.projects.items.map((project) => (
            <article className="card" key={project.tag}>
              <span className="quest-ribbon">{project.quest}</span>
              <br />
              <span className="tag">{project.tag}</span>
              <h3>{project.title}</h3>
              <dl className="project-meta">
                <dt>{dict.projects.labels.context}</dt>
                <dd>{project.context}</dd>
                <dt>{dict.projects.labels.role}</dt>
                <dd>{project.role}</dd>
                <dt>{dict.projects.labels.outcome}</dt>
                <dd>{project.outcome}</dd>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
