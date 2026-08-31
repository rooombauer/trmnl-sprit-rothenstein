# Portfolio: Vom Microsoft-Ingenieur zum CXO

Persönliche Portfolio-Website (Branch `claude/portfolio-cxo-journey-vctx8a`) —
Next.js (App Router, statischer Export), sechs Seiten, DE/EN-Umschalter,
Foto-Galerie mit Lightbox und dem Werdegang als **Quest-Log** (Signature-Element).

## Starten

```bash
npm install
npm run dev        # http://localhost:3000 → leitet auf /de/ bzw. /en/ weiter
npm run build      # statischer Export nach /out (überall hostbar)
```

## Seiten

| Route          | Inhalt                                        |
| -------------- | --------------------------------------------- |
| `/de/` `/en/`  | Hero mit Claim + Deko-Stickern, drei Säulen, Quest-Log-Teaser, Startup-Foto |
| `…/journey/`   | Kompletter Werdegang als Quest-Log (Level, XP, Fortschrittsbalken) |
| `…/expertise/` | Vier Kompetenz-Ebenen mit animierten Skill-Bars |
| `…/projects/`  | Quest-Karten (SIDE QUEST / MAIN QUEST / NEW GAME+) |
| `…/gallery/`   | Polaroid-Galerie mit Lightbox (Pfeiltasten, Esc) |
| `…/contact/`   | Kontakt                                        |

## Design & Gamification

- Verspielter Neo-Brutalismus: Schwarz-Weiß, dicke Ränder, harte Schatten,
  leicht gedrehte Sticker-Elemente – Petrol (`#0a7285`) als einziger Akzent
- Headlines **Space Grotesk**, Game-Details **JetBrains Mono**
- Alle Farben/Schriften als CSS-Variablen in `app/globals.css`
- **XP-HUD** unten links: Seitenbesuche schalten Achievements frei (+40 XP,
  gespeichert in `localStorage`), Level steigt alle 100 XP
- **Konami-Code** (↑↑↓↓←→←→BA) aktiviert kurz den God-Mode (+100 XP)
- Animationen respektieren `prefers-reduced-motion`

## Inhalte pflegen (WICHTIG)

Alle Texte liegen zentral in zwei Dateien:

- `lib/content/de.ts` (Deutsch)
- `lib/content/en.ts` (Englisch)

**Alles in `‹spitzen Klammern›` ist Platzhalter** und muss durch echte Daten ersetzt werden:

1. **Name**: aktuell „R. Bauer" (`meta.siteName`, Monogramm „RB." in `components/SiteHeader.tsx`)
2. **Boot-Log** (`journey.entries`): Jahre und Stationen (Unternehmen, Rollen) eintragen —
   die Struktur MCSE → Systems Engineering → Führung → CXO → KI steht bereits
3. **Projekte** (`projects.items`): drei Struktur-Platzhalter durch echte Projekte ersetzen
4. **Kontakt**: LinkedIn-URL und Standort eintragen (E-Mail ist vorbelegt)
5. **Galerie** (`lib/content/gallery.ts`): echte Fotos referenzieren

## Eigene Dateien (Logo, Fotos)

In den **`/assets`-Ordner** legen (wird beim Build automatisch nach `public/assets/` kopiert):

- `logo.svg` → erscheint im Header (bis dahin: Monogramm „RB.")
- `startup.jpg` → erscheint auf der Startseite (bis dahin: gestalteter Hinweis)
- weitere Fotos → in `lib/content/gallery.ts` mit Pfad `/assets/…` eintragen

## Claim-Varianten für den Hero

Aktuell: **„Vom Microsoft-Ingenieur zum CXO."** — Alternativen zum Ausprobieren
(in `home.claim` in `lib/content/de.ts` / `en.ts`):

1. „Vom Server-Raum in die Geschäftsführung." / "From the server room to the boardroom."
2. „Systeme verstehen. Unternehmen transformieren." / "Understand systems. Transform companies."
3. „Technologie führen — nicht nur verwalten." / "Leading technology — not just managing it."

## Hinweis zum Repository

Dieser Branch enthält zusätzlich die Dateien des TRMNL-Spritpreis-Trackers
(`data/`, `trmnl/`, `scripts/fetch_prices.py`) aus `main`. Das Portfolio ist davon
unabhängig; es kann später problemlos in ein eigenes Repository umziehen.
