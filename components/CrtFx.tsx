'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

// Macht aus der Seite einen lebendigen alten PC:
// - Einschalt-Effekt der Röhre beim ersten Laden
// - "Kanalwechsel" (Bild klappt zusammen + Rauschen) bei Seitenwechseln
// - Jitter/Blip/Krisseln bei Klicks
// - zufällige Störungen alle paar Sekunden
// Respektiert prefers-reduced-motion (dann passiert nichts davon).
function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function fx(name: string, ms: number) {
  if (reducedMotion()) return;
  const el = document.documentElement;
  el.classList.add(`fx-${name}`);
  window.setTimeout(() => el.classList.remove(`fx-${name}`), ms);
}

export function CrtFx() {
  const pathname = usePathname();
  const firstRender = useRef(true);
  const cooldown = useRef(false);

  // Röhre einschalten
  useEffect(() => {
    fx('boot', 950);
  }, []);

  // Seitenwechsel = Kanalwechsel
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    fx('reload', 520);
  }, [pathname]);

  // Klick-Effekte (leicht gedrosselt, zufällig gemischt)
  useEffect(() => {
    const onClick = () => {
      if (cooldown.current) return;
      cooldown.current = true;
      const roll = Math.random();
      if (roll < 0.5) fx('jitter', 190);
      else if (roll < 0.82) fx('blip', 170);
      else fx('static', 240);
      window.setTimeout(() => {
        cooldown.current = false;
      }, 260);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Ab und zu krisselt es einfach so
  useEffect(() => {
    let timer: number;
    const schedule = () => {
      timer = window.setTimeout(() => {
        fx('static', 200 + Math.random() * 320);
        schedule();
      }, 9000 + Math.random() * 14000);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
