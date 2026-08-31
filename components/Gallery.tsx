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
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={active.caption[locale]}
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <button
            type="button"
            className="lightbox__btn lightbox__btn--close"
            onClick={close}
            aria-label={locale === 'de' ? 'Schließen' : 'Close'}
            autoFocus
          >
            ×
          </button>
          <button
            type="button"
            className="lightbox__btn lightbox__btn--prev"
            onClick={() => step(-1)}
            aria-label={locale === 'de' ? 'Vorheriges Bild' : 'Previous image'}
          >
            ‹
          </button>
          {/* key erzwingt Remount pro Bild → der zeilenweise Aufbau läuft jedes Mal */}
          <span key={active.src} className="scan-img is-scanned" style={{ display: 'block' }}>
            <img className="phosphor-img" src={active.src} alt={active.caption[locale]} />
          </span>
          <p className="lightbox__caption">
            {(openIndex ?? 0) + 1}/{items.length} — {active.caption[locale]}
          </p>
          <button
            type="button"
            className="lightbox__btn lightbox__btn--next"
            onClick={() => step(1)}
            aria-label={locale === 'de' ? 'Nächstes Bild' : 'Next image'}
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
