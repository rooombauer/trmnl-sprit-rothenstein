import type { Metadata } from 'next';
import { getDict } from '@/lib/i18n';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: getDict(locale).contact.title };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDict(locale);
  const contact = dict.contact;

  return (
    <section className="section">
      <div className="container">
        <span className="tag">ping -c1 rbauer</span>
        <h1>{contact.title}</h1>
        <p className="lede">{contact.intro}</p>
        <div className="contact-list" style={{ marginTop: '2.5rem' }}>
          <div className="card">
            <strong>{contact.emailLabel}</strong>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </div>
          <div className="card">
            <strong>{contact.linkedinLabel}</strong>
            <span>{contact.linkedinUrl}</span>
          </div>
          <div className="card">
            <strong>{contact.locationLabel}</strong>
            <span>{contact.location}</span>
          </div>
        </div>
        <p className="mono" style={{ marginTop: '2rem', color: 'var(--ink-faint)' }}>
          {contact.closing}
        </p>
      </div>
    </section>
  );
}
