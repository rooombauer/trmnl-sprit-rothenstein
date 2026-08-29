# Portfolio: Vom Microsoft-Ingenieur zum CXO

Persönliche Portfolio-Website (Branch `claude/portfolio-cxo-journey-vctx8a`) —
Next.js (App Router, statischer Export), sechs Seiten, DE/EN-Umschalter,
Foto-Galerie mit Lightbox und dem Werdegang als **Boot-Log** (Signature-Element).

## Starten

```bash
npm install
npm run dev        # http://localhost:3000 → leitet auf /de/ bzw. /en/ weiter
npm run build      # statischer Export nach /out (überall hostbar)
```

## Seiten

| Route          | Inhalt                                        |
| -------------- | --------------------------------------------- |
| `/de/` `/en/`  | Hero mit Claim, drei Säulen, Boot-Log-Teaser, Startup-Foto |
| `…/journey/`   | Kompletter Werdegang als System-Startprotokoll |
| `…/expertise/` | Vier Kompetenz-Ebenen (Strategie, KI, Engineering, Führung) |
| `…/projects/`  | Projekt-Karten (Kontext / Rolle / Ergebnis)    |
| `…/gallery/`   | Foto-Galerie mit Lightbox (Pfeiltasten, Esc)   |
| `…/contact/`   | Kontakt                                        |

## Design

- Warmes Anthrazit (`#262220`) statt Standard-Schwarz, Kupfer-Akzent (`#c9835a`)
- Serifen-Headlines (**Fraunces**), Monospace-Details (**IBM Plex Mono**), Fließtext **Inter**
- Alle Farben/Schriften als CSS-Variablen in `app/globals.css`

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
