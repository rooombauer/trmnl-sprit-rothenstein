'use client';

import { useEffect, useRef } from 'react';

// Skill-Bar im Spiele-Stil: füllt sich, sobald sie ins Bild scrollt.
export function StatBar({ label, value }: { label: string; value: number }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    // Beobachtet die Leiste (nicht die anfangs 0px breite Füllung)
    const observer = new IntersectionObserver(
      (observed) => {
        observed.forEach((item) => {
          if (item.isIntersecting) {
            track.querySelector('.statbar__fill')?.classList.add('is-visible');
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="statbar">
      <div className="statbar__label">
        <span>{label}</span>
        <span>{value}/100</span>
      </div>
      <div
        ref={trackRef}
        className="statbar__track"
        role="meter"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <span className="statbar__fill" style={{ ['--stat' as string]: `${value}%` }} />
      </div>
    </div>
  );
}
