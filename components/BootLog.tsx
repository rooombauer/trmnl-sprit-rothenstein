'use client';

import { useEffect, useRef } from 'react';
import type { BootLogEntry } from '@/lib/content/types';

// Signature-Element: der Werdegang als System-Startprotokoll.
// Die Zeilen erscheinen nacheinander, sobald das Log ins Bild scrollt.
export function BootLog({
  header,
  entries,
  readyLine,
}: {
  header: string;
  entries: BootLogEntry[];
  readyLine: string;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;

    const rows = Array.from(body.querySelectorAll<HTMLElement>('.bootlog__entry'));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      rows.forEach((row) => row.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (observed) => {
        observed.forEach((item) => {
          if (!item.isIntersecting) return;
          const row = item.target as HTMLElement;
          const index = rows.indexOf(row);
          window.setTimeout(() => row.classList.add('is-visible'), index * 140);
          observer.unobserve(row);
        });
      },
      { threshold: 0.2 },
    );

    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bootlog">
      <div className="bootlog__titlebar">
        <span className="bootlog__dot bootlog__dot--copper" aria-hidden />
        <span className="bootlog__dot" aria-hidden />
        <span className="bootlog__dot" aria-hidden />
        <span>{header}</span>
      </div>
      <div className="bootlog__body" ref={bodyRef}>
        {entries.map((entry) => (
          <div className="bootlog__entry" key={entry.module}>
            <span className="bootlog__time">{entry.time}</span>
            <span
              className={`bootlog__status ${
                entry.status === 'RUN' ? 'bootlog__status--run' : 'bootlog__status--ok'
              }`}
            >
              {entry.status}
            </span>
            <span className="bootlog__module">{entry.module}</span>
            <span className="bootlog__text">
              <strong>{entry.title}</strong>
              <span>{entry.detail}</span>
            </span>
          </div>
        ))}
        <p className="bootlog__ready">
          {readyLine}
          <span className="bootlog__cursor" aria-hidden />
        </p>
      </div>
    </div>
  );
}
