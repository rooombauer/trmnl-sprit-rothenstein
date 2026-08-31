import type { Metadata } from 'next';
import { IBM_Plex_Mono, VT323 } from 'next/font/google';
import './globals.css';

const vt323 = VT323({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-vt323',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-plex',
});

export const metadata: Metadata = {
  title: 'R. Bauer — Vom Microsoft-Ingenieur zum CXO',
  description:
    'Vom Microsoft-zertifizierten Systemingenieur zum CXO – Technologie, Führung und KI-Transformation.',
};

import { CrtFx } from '@/components/CrtFx';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="de"
      suppressHydrationWarning
      className={`${vt323.variable} ${plexMono.variable}`}
    >
      <body>
        {children}
        {/* CRT-Overlays: Flimmern, Scanlines, Rollbalken, Rauschen,
            Vignette/Krümmung, Glas-Reflex, Röhren-Ecken, Weißblitz */}
        <div className="crt crt-flicker" aria-hidden />
        <div className="crt crt-scanlines" aria-hidden />
        <div className="crt crt-roll" aria-hidden />
        <div className="crt crt-static" aria-hidden />
        <div className="crt crt-vignette" aria-hidden />
        <div className="crt crt-glare" aria-hidden />
        <div className="crt crt-corners" aria-hidden />
        <div className="crt crt-white" aria-hidden />
        <CrtFx />
      </body>
    </html>
  );
}
