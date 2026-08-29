import { de } from './content/de';
import { en } from './content/en';
import type { Dict, Locale } from './content/types';

export const locales: Locale[] = ['de', 'en'];
export const defaultLocale: Locale = 'de';

const dicts: Record<Locale, Dict> = { de, en };

export function isLocale(value: string): value is Locale {
  return (locales as string[]).includes(value);
}

export function getDict(locale: string): Dict {
  return dicts[isLocale(locale) ? locale : defaultLocale];
}
