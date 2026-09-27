# Sprit-Preise Rothenstein – TRMNL Plugin

Zeigt den Super-E5-Preis der vier nächstgelegenen Tankstellen um Rothenstein bei
Jena, dazu eine kleine Karte. Darauf sind die vier Tankstellen (1–4) und die drei
günstigsten übrigen Tankstellen im 10-km-Umkreis mit Preis eingezeichnet.

Die Karte ist eine echte, minimalistische Straßenkarte mit Ortsnamen (Norden oben,
OpenStreetMap-Daten). Die Grundkarte `data/karte.png` ist fest und wird nur von Hand
mit `scripts/make_basemap.py` neu erzeugt (braucht Pillow). `scripts/fetch_prices.py`
rechnet die Tankstellen mit derselben Projektion (`scripts/karte_proj.py`) in
Pixelkoordinaten um, das Markup legt sie als SVG über die Grundkarte. `data/history.json` führt pro Tag Ø- und
Minimalpreis weiter.

## Setup (einmalig, ~15 Min)

**1. Tankerkönig API-Key holen**
- https://creativecommons.tankerkoenig.de/ → "API-Key beantragen"
- Formular ausfüllen, Key kommt per Mail (sofort)

**2. Repo anlegen**
- Neues GitHub-Repo erstellen, alle Dateien aus diesem Ordner hochladen
  (Struktur beibehalten: `.github/workflows/`, `scripts/`, `data/`, `trmnl/`)
- Repo muss **public** sein (sonst kein freier Lesezugriff für TRMNL)

**3. API-Key als Secret hinterlegen**
- Repo → Settings → Secrets and variables → Actions → New repository secret
- Name: `TANKERKOENIG_API_KEY`, Wert: dein Key aus Schritt 1

**4. Workflow testen**
- Repo → Actions → "Fetch fuel prices" → Run workflow (manuell einmal anstoßen)
- Danach prüfen: `data/latest.json` im Repo sollte Werte statt `null` zeigen
- Läuft danach automatisch alle 2 Stunden (04–20 UTC)

**5. TRMNL Private Plugin anlegen**
- Voraussetzung: Developer-Addon oder BYOD-Lizenz in deinem TRMNL-Account aktiv
- Neues Private Plugin → Strategy: **Polling**
- Polling-URL:
  `https://raw.githubusercontent.com/<DEIN-USER>/<DEIN-REPO>/main/data/latest.json`
- "Edit Markup" öffnen, Tab "Full", Inhalt aus `trmnl/full.liquid` reinkopieren
- Speichern, "Force Refresh" zum Testen

Fertig – Plugin zeigt jetzt aktuelle E5-Preise + Karte.

## Standort
Rothenstein bei Jena, Thüringen (50.85, 11.60), Radius 10 km – in `scripts/fetch_prices.py`
über `LAT`/`LNG`/`RAD_KM` änderbar, Anzahl über `NEAREST`/`CHEAP_OTHERS`.

## Quelle
Tankerkönig-API (creativecommons.tankerkoenig.de), Daten: Bundeskartellamt
Markttransparenzstelle für Kraftstoffe (MTS-K), Lizenz CC BY 4.0 – Attribution
ist im Plugin-Footer enthalten (Pflicht laut Lizenz).

Kartendaten © OpenStreetMap-Mitwirkende (ODbL), Hinweis steht auf der Karte.
