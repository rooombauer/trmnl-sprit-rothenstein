'use client';

import { useEffect } from 'react';

// Setzt das lang-Attribut passend zur Sprachversion (das Root-Layout ist
// beim statischen Export für beide Sprachen identisch).
export function LocaleLang({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
