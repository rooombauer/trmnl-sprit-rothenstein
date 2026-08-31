'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Dict } from '@/lib/content/types';

const XP_KEY = 'cxo-quest-xp';
const PAGES_KEY = 'cxo-quest-pages';
const PAGE_XP = 40;
const KONAMI_XP = 100;
const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

type PageKey = keyof Dict['hud']['pages'];

function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

function writeStore(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage nicht verfügbar – das Spiel läuft trotzdem weiter
  }
}

function pageKeyFromPath(pathname: string): PageKey {
  const rest = pathname.replace(/^\/(de|en)\/?/, '').replace(/\/$/, '');
  const known: PageKey[] = ['journey', 'expertise', 'projects', 'gallery', 'contact'];
  return (known as string[]).includes(rest) ? (rest as PageKey) : 'home';
}

// Kleines Spiel im Spiel: XP für erkundete Seiten, Achievements als Toast,
// Level-Anzeige unten links – und ein Konami-Code-Easteregg.
export function GameHud({ hud }: { hud: Dict['hud'] }) {
  const pathname = usePathname() ?? '/';
  const [xp, setXp] = useState(0);
  const [toast, setToast] = useState<{ title: string; text: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  // Toast automatisch ausblenden
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  // Seitenbesuch = Achievement + XP (einmal pro Seite)
  useEffect(() => {
    setMounted(true);
    const key = pageKeyFromPath(pathname);
    const visited = readStore<string[]>(PAGES_KEY, []);
    let currentXp = readStore<number>(XP_KEY, 0);

    if (!visited.includes(key)) {
      visited.push(key);
      currentXp += PAGE_XP;
      writeStore(PAGES_KEY, visited);
      writeStore(XP_KEY, currentXp);
      setToast({ title: hud.unlockedLabel, text: `🏆 ${hud.pages[key]} (+${PAGE_XP} ${hud.xpLabel})` });
    }
    setXp(currentXp);
  }, [pathname, hud]);

  // Konami-Code: ↑↑↓↓←→←→BA
  useEffect(() => {
    let progress = 0;
    const onKey = (event: KeyboardEvent) => {
      const expected = KONAMI[progress];
      progress = event.key === expected ? progress + 1 : event.key === KONAMI[0] ? 1 : 0;
      if (progress < KONAMI.length) return;
      progress = 0;
      const currentXp = readStore<number>(XP_KEY, 0) + KONAMI_XP;
      writeStore(XP_KEY, currentXp);
      setXp(currentXp);
      setToast({ title: hud.unlockedLabel, text: `🕹️ ${hud.konami} (+${KONAMI_XP} ${hud.xpLabel})` });
      document.documentElement.classList.add('god-mode');
      window.setTimeout(() => document.documentElement.classList.remove('god-mode'), 3000);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [hud]);

  if (!mounted) return null;

  const level = Math.floor(xp / 100) + 1;
  const withinLevel = xp % 100;

  return (
    <>
      <div className="hud" aria-live="polite">
        <span className="hud__level">
          {hud.levelLabel} {level}
        </span>
        <span className="hud__bar" aria-hidden>
          <span className="hud__fill" style={{ width: `${withinLevel}%` }} />
        </span>
        <span>
          {xp} {hud.xpLabel}
        </span>
      </div>
      {toast && (
        <div className="toast" role="status">
          <strong>{toast.title}</strong>
          {toast.text}
        </div>
      )}
    </>
  );
}
