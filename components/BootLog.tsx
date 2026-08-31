'use client';

import { useEffect, useRef } from 'react';
import type { BootLogEntry } from '@/lib/content/types';

// Signature-Element: der Werdegang als Quest-Log mit Leveln und XP.
// Die Level erscheinen nacheinander, sobald das Log ins Bild scrollt.
export function BootLog({
  header,
  progressLabel,
  entries,
  readyLine,
}: {
  header: string;
  progressLabel?: string;
  entries: BootLogEntry[];
  readyLine: string;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;

    const rows = Array.from(body.querySelectorAll<HTMLElement>('.quest'));
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
          window.setTimeout(() => row.classList.add('is-visible'), index * 130);
          observer.unobserve(row);
        });
      },
      { threshold: 0.15 },
    );

    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <div className="questlog__header">
        <span>{header}</span>
        {progressLabel && (
          <span className="questlog__progress">
            <span>{progressLabel}</span>
            <span className="questlog__progressbar">
              <span className="questlog__progressfill" />
            </span>
          </span>
        )}
      </div>
      <div className="questlog" ref={bodyRef}>
        {entries.map((entry) => (
          <div
            className={`quest${entry.status === 'RUN' ? ' quest--current' : ''}`}
            key={entry.module}
          >
            <span className="quest__time">{entry.time}</span>
            <span className="quest__module">{entry.module}</span>
            <span>
              <p className="quest__title">
                {entry.title}
                {entry.status === 'RUN' ? ' ▮' : ' … OK'}
              </p>
              <p className="quest__detail">{entry.detail}</p>
            </span>
            <span className="quest__xp">{entry.xp}</span>
          </div>
        ))}
        <p className="questlog__ready">
          {readyLine}
          <span className="questlog__cursor" aria-hidden />
        </p>
      </div>
    </div>
  );
}
