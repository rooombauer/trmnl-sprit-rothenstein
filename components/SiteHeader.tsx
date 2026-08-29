'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { Dict } from '@/lib/content/types';

const NAV_ORDER: { key: keyof Dict['nav']; path: string }[] = [
  { key: 'home', path: '' },
  { key: 'journey', path: 'journey' },
  { key: 'expertise', path: 'expertise' },
  { key: 'projects', path: 'projects' },
  { key: 'gallery', path: 'gallery' },
  { key: 'contact', path: 'contact' },
];

function Logo({ siteName }: { siteName: string }) {
  // Erst nach dem Mount versuchen wir das Logo zu laden – so gibt es nie ein
  // kaputtes Bild-Icon, falls /assets/logo.svg (noch) fehlt.
  const [state, setState] = useState<'pending' | 'ok' | 'missing'>('pending');
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const probe = new Image();
    probe.onload = () => setState('ok');
    probe.onerror = () => setState('missing');
    probe.src = '/assets/logo.svg';
  }, []);

  if (state !== 'ok') {
    // Fallback-Monogramm, solange kein Logo in /assets liegt
    return <span className="logo__mark">RB.</span>;
  }
  return <img ref={ref} className="logo__img" src="/assets/logo.svg" alt={`${siteName} Logo`} />;
}

export function SiteHeader({
  locale,
  nav,
  siteName,
}: {
  locale: string;
  nav: Dict['nav'];
  siteName: string;
}) {
  const pathname = usePathname() ?? `/${locale}/`;
  // Pfad ohne Sprachpräfix, z. B. "/de/journey/" -> "journey"
  const rest = pathname.replace(/^\/(de|en)\/?/, '').replace(/\/$/, '');

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href={`/${locale}/`} className="logo">
          <Logo siteName={siteName} />
          <span>{siteName}</span>
        </Link>
        <nav className="nav" aria-label="Hauptnavigation">
          {NAV_ORDER.map(({ key, path }) => {
            const href = path ? `/${locale}/${path}/` : `/${locale}/`;
            const active = rest === path;
            return (
              <Link key={key} href={href} aria-current={active ? 'page' : undefined}>
                {nav[key]}
              </Link>
            );
          })}
        </nav>
        <div className="lang-switch" aria-label="Sprache / Language">
          {(['de', 'en'] as const).map((l) => (
            <Link
              key={l}
              href={`/${l}/${rest ? `${rest}/` : ''}`}
              aria-current={locale === l ? 'true' : undefined}
              hrefLang={l}
            >
              {l.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
