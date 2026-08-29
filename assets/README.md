# Eigene Assets

Lege hier deine Dateien ab – sie werden bei `npm run dev` / `npm run build`
automatisch nach `public/assets/` kopiert und sind dann unter `/assets/...` erreichbar.

Erwartet werden:

| Datei              | Verwendung                                        |
| ------------------ | ------------------------------------------------- |
| `logo.svg` (oder `logo.png`) | Logo im Header (Fallback: Monogramm "RB.") |
| `startup.jpg`      | Startup-Foto auf der Startseite und in der Galerie |

Weitere Fotos für die Galerie kannst du zusätzlich hier ablegen und in
`lib/content/gallery.ts` eintragen (Pfad `/assets/dein-foto.jpg` + Bildunterschrift DE/EN).
