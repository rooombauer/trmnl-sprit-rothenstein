'use client';

import { useEffect } from 'react';

// Statischer Export kennt keine Server-Redirects: die Startseite leitet
// clientseitig auf die passende Sprachversion weiter.
export default function RootRedirect() {
  useEffect(() => {
    const target = navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'de';
    window.location.replace(`/${target}/`);
  }, []);

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.9rem',
      }}
    >
      <a href="/de/">Deutsch</a>
      <span aria-hidden>·</span>
      <a href="/en/">English</a>
    </main>
  );
}
