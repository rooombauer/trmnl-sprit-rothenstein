# Sprit-Preise Rothenstein – TRMNL Plugin

Zeigt Super E5 & Super E10 im 10-km-Umkreis von Rothenstein bei Jena + 30-Tage-Verlauf.

**Wichtig:** Super Plus (98 Oktan) wird von keiner freien deutschen Quelle erfasst
(gesetzliche Meldepflicht MTS-K gilt nur für E5, E10, Diesel). Das Plugin zeigt
daher E5 + E10 statt Super Plus.

Tankerkönig liefert nur Live-Preise, keine Historie. Der Chart füllt sich deshalb
ab dem ersten Lauf täglich mit einem echten neuen Datenpunkt (nach 30 Tagen voll).

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
- Läuft danach automatisch täglich 05:00 UTC

**5. TRMNL Private Plugin anlegen**
- Voraussetzung: Developer-Addon oder BYOD-Lizenz in deinem TRMNL-Account aktiv
- Neues Private Plugin → Strategy: **Polling**
- Polling-URL:
  `https://raw.githubusercontent.com/<DEIN-USER>/<DEIN-REPO>/main/data/latest.json`
- "Edit Markup" öffnen, Tab "Full", Inhalt aus `trmnl/full.liquid` reinkopieren
- Speichern, "Force Refresh" zum Testen

Fertig – Plugin zeigt jetzt aktuelle Preise + wachsenden 30-Tage-Verlauf.

## Standort
Rothenstein bei Jena, Thüringen (50.85, 11.60), Radius 10 km – in `scripts/fetch_prices.py`
über `LAT`/`LNG`/`RAD_KM` änderbar.

## Quelle
Tankerkönig-API (creativecommons.tankerkoenig.de), Daten: Bundeskartellamt
Markttransparenzstelle für Kraftstoffe (MTS-K), Lizenz CC BY 4.0 – Attribution
ist im Plugin-Footer enthalten (Pflicht laut Lizenz).
