import type { Locale } from './types';

export type GalleryItem = {
  src: string;
  caption: Record<Locale, string>;
};

// Eigene Fotos: Datei in /assets legen (wird nach /public/assets kopiert)
// und hier mit Pfad "/assets/dateiname.jpg" eintragen.
// Die SVGs unten sind gestaltete Platzhalter, bis echte Fotos da sind.
export const galleryItems: GalleryItem[] = [
  {
    src: '/gallery/placeholder-01.svg',
    caption: {
      de: '‹Startup-Foto: /assets/startup.jpg eintragen›',
      en: '‹Startup photo: add /assets/startup.jpg›',
    },
  },
  {
    src: '/gallery/placeholder-02.svg',
    caption: {
      de: '‹Server-Raum / frühe Jahre›',
      en: '‹Server room / early years›',
    },
  },
  {
    src: '/gallery/placeholder-03.svg',
    caption: {
      de: '‹Team-Moment›',
      en: '‹Team moment›',
    },
  },
  {
    src: '/gallery/placeholder-04.svg',
    caption: {
      de: '‹Vortrag / Bühne›',
      en: '‹Talk / stage›',
    },
  },
  {
    src: '/gallery/placeholder-05.svg',
    caption: {
      de: '‹Workshop / Whiteboard›',
      en: '‹Workshop / whiteboard›',
    },
  },
  {
    src: '/gallery/placeholder-06.svg',
    caption: {
      de: '‹Unterwegs / Konferenz›',
      en: '‹On the road / conference›',
    },
  },
];
