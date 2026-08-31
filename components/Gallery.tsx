'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { GalleryItem } from '@/lib/content/gallery';
import type { Locale } from '@/lib/content/types';

export function Gallery({ items, locale }: { items: GalleryItem[]; locale: Locale }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Thumbnails bauen sich zeilenweise auf, sobald sie ins Bild scrollen
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const frames = Array.from(grid.querySelectorAll<HTMLElement>('.scan-img'));
    const observer = new IntersectionObserver(
      (observed) => {
        observed.forEach((item, ) => {
          if (!item.isIntersecting) return;
          const el = item.target as HTMLElement;
          const index = frames.indexOf(el);
          window.setTimeout(() => el.classList.add('is-scanned'), (index % 3) * 180);
          observer.unobserve(el);
        });
      },
      { threshold: 0.25 },
    );
    frames.forEach((frame) => observer.observe(frame));
    return () => observer.disconnect();
  }, []);

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (delta: number) => {
      setOpenIndex((current) =>
        current === null ? null : (current + delta + items.length) % items.length,
      );
    },
    [items.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [openIndex, close, step]);

  const active = openIndex === null ? null : items[openIndex];

  return (
    <>
      <div className="gallery-grid" ref={gridRef}>
        {items.map((item, index) => {
          const filename = item.src.split('/').pop();
          return (
            <button
              key={item.src}
              type="button"
              className="gallery-item"
              onClick={() => setOpenIndex(index)}
              aria-label={item.caption[locale]}
            >
              <figure style={{ margin: 0 }}>
                <div className="term-titlebar">
                  <span>xview — {filename}</span>
                </div>
                <div className="term-body">
                  <span className="scan-img" style={{ display: 'block' }}>
                    <img
                      className="phosphor-img"
                      src={item.src}
                      alt={item.caption[locale]}
                      loading="lazy"
                    />
                  </span>
                  <figcaption>{item.caption[locale]}</figcaption>
                </div>
              </figure>
            </button>
          );
        })}
      </div>

      {active && (
        <div
          className="pda-scene"
          role="dialog"
          aria-modal="true"
          aria-label={active.caption[locale]}
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div className="pda-rig">
            {/* Hand-Silhouette hinter dem Gerät (Unterarm + Handballen) */}
            <svg className="pda-hand" viewBox="0 0 300 520" aria-hidden>
              <path
                d="M112 520 L110 268 C108 206 128 172 174 158 C230 142 264 176 260 236 C256 300 252 430 252 520 Z"
                fill="#221a14"
                stroke="rgba(157,255,190,0.16)"
                strokeWidth="3"
              />
            </svg>

            <div className="pda">
              <span className="pda-stylus" aria-hidden />
              <div className="pda-top">
                <span className="pda-brand">POCKETPIX 2000 · COLOR LCD</span>
                <span className="pda-led" aria-hidden />
              </div>
              <div className="pda-screen">
                {/* key erzwingt Remount pro Bild → zeilenweiser Aufbau bei jedem Wechsel.
                    Bewusst OHNE Phosphor-Filter: das LCD zeigt Originalfarben. */}
                <span key={active.src} className="scan-img scan-img--lcd is-scanned" style={{ display: 'block' }}>
                  <img src={active.src} alt={active.caption[locale]} />
                </span>
                <div className="pda-status">
                  <span>{active.caption[locale]}</span>
                  <span>
                    {(openIndex ?? 0) + 1}/{items.length}
                  </span>
                </div>
              </div>
              <div className="pda-controls">
                <button
                  type="button"
                  className="pda-btn"
                  onClick={() => step(-1)}
                  aria-label={locale === 'de' ? 'Vorheriges Bild' : 'Previous image'}
                >
                  ◀
                </button>
                <button
                  type="button"
                  className="pda-btn"
                  onClick={() => step(1)}
                  aria-label={locale === 'de' ? 'Nächstes Bild' : 'Next image'}
                  autoFocus
                >
                  ▶
                </button>
                <button
                  type="button"
                  className="pda-btn pda-btn--power"
                  onClick={close}
                  aria-label={locale === 'de' ? 'Schließen' : 'Close'}
                >
                  ⏻
                </button>
              </div>
            </div>

            {/* Daumen liegt vorn auf dem Gehäuse */}
            <svg className="pda-thumb" viewBox="0 0 140 220" aria-hidden>
              <path
                d="M78 220 C44 174 30 122 48 70 C60 34 94 24 110 48 C126 72 114 112 102 152 C94 182 90 202 88 220 Z"
                fill="#2a211a"
                stroke="rgba(157,255,190,0.14)"
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>
      )}
    </>
  );
}
