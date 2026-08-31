'use client';

import { useEffect, useRef, useState } from 'react';

// Zeigt das Startup-Foto aus /assets als Terminal-Fenster: grüner
// Phosphor-Look, zeilenweiser Bildaufbau beim Reinscrollen. Solange kein
// Foto da ist, erscheint ein gestalteter Hinweis statt eines kaputten Bildes.
export function StartupPhoto({ caption, missingHint }: { caption: string; missingHint: string }) {
  const [state, setState] = useState<'pending' | 'ok' | 'missing'>('pending');
  const frameRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const probe = new Image();
    probe.onload = () => setState('ok');
    probe.onerror = () => setState('missing');
    probe.src = '/assets/startup.jpg';
  }, []);

  // Zeilenweiser Aufbau, sobald das Bild sichtbar wird
  useEffect(() => {
    if (state !== 'ok') return;
    const frame = frameRef.current;
    if (!frame) return;
    const observer = new IntersectionObserver(
      (observed) => {
        observed.forEach((item) => {
          if (item.isIntersecting) {
            frame.querySelector('.scan-img')?.classList.add('is-scanned');
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, [state]);

  return (
    <figure className="photo-frame" ref={frameRef}>
      <div className="term-titlebar">
        <span>xview — /assets/startup.jpg</span>
        <span>800×600 — 1bit(grün)</span>
      </div>
      <div className="term-body" style={{ padding: '0.5rem' }}>
        {state === 'ok' ? (
          <span className="scan-img" style={{ display: 'block' }}>
            <img className="phosphor-img" src="/assets/startup.jpg" alt={caption} />
          </span>
        ) : (
          <div className="photo-frame__missing">{state === 'missing' ? missingHint : ''}</div>
        )}
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
