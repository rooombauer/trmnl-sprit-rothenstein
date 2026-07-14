#!/usr/bin/env python3
"""
Holt aktuelle Spritpreise (Super E5 / Super E10) im 10-km-Umkreis von
Rothenstein bei Jena (Thüringen) über die Tankerkönig-API, schreibt sie
in data/history.json (Langzeit-Log) und data/latest.json (was TRMNL abruft).

Hinweis: Tankerkönig / MTS-K erfasst nur E5, E10 und Diesel.
"Super Plus" (98 Oktan) wird gesetzlich nicht gemeldet und ist daher
in keiner freien Quelle live verfügbar.
"""
import json
import os
import sys
import urllib.request
import urllib.error
import datetime
from pathlib import Path

LAT = 50.85
LNG = 11.60
RAD_KM = 10
ROOT = Path(__file__).resolve().parent.parent
HISTORY_PATH = ROOT / "data" / "history.json"
LATEST_PATH = ROOT / "data" / "latest.json"

CHART_WIDTH = 480
CHART_HEIGHT = 110
CHART_PAD = 6
TREND_DAYS = 30


def fetch_stations(api_key: str) -> list:
    url = (
        "https://creativecommons.tankerkoenig.de/json/list.php"
        f"?lat={LAT}&lng={LNG}&rad={RAD_KM}&sort=dist&type=all&apikey={api_key}"
    )
    with urllib.request.urlopen(url, timeout=30) as resp:
        payload = json.loads(resp.read().decode("utf-8"))
    if not payload.get("ok"):
        raise RuntimeError(f"Tankerkoenig API Fehler: {payload.get('message')}")
    return payload.get("stations", [])


def pick_fuel(stations: list, fuel: str):
    valid = [
        s for s in stations
        if isinstance(s.get(fuel), (int, float)) and s.get(fuel) > 0
    ]
    if not valid:
        return None
    avg = round(sum(s[fuel] for s in valid) / len(valid), 3)
    cheapest = min(valid, key=lambda s: s[fuel])
    return {
        "avg": avg,
        "min": round(cheapest[fuel], 3),
        "min_station": f"{cheapest.get('brand', cheapest.get('name', '?'))} {cheapest.get('place', '')}".strip(),
    }, len(valid)


def load_json(path: Path, default):
    if path.exists():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return default
    return default


def make_points(values, vmin, vmax):
    n = len(values)
    if n < 2:
        return ""
    rng = (vmax - vmin) or 0.01
    step = (CHART_WIDTH - 2 * CHART_PAD) / (n - 1)
    pts = []
    for i, v in enumerate(values):
        x = CHART_PAD + i * step
        y = CHART_PAD + (CHART_HEIGHT - 2 * CHART_PAD) * (1 - (v - vmin) / rng)
        pts.append(f"{x:.1f},{y:.1f}")
    return " ".join(pts)


def main():
    api_key = os.environ.get("TANKERKOENIG_API_KEY")
    if not api_key:
        print("Fehler: TANKERKOENIG_API_KEY nicht gesetzt", file=sys.stderr)
        sys.exit(1)

    stations = fetch_stations(api_key)
    if not stations:
        print("Warnung: keine Stationen im Umkreis gefunden", file=sys.stderr)
        sys.exit(1)

    e5_result = pick_fuel(stations, "e5")
    e10_result = pick_fuel(stations, "e10")
    if not e5_result or not e10_result:
        print("Warnung: keine gültigen E5/E10-Preise erhalten", file=sys.stderr)
        sys.exit(1)

    e5, e5_count = e5_result
    e10, e10_count = e10_result

    today = datetime.date.today().isoformat()
    history = load_json(HISTORY_PATH, [])
    history = [h for h in history if h.get("date") != today]  # idempotent bei Re-Run
    history.append({
        "date": today,
        "e5_avg": e5["avg"],
        "e5_min": e5["min"],
        "e10_avg": e10["avg"],
        "e10_min": e10["min"],
        "station_count": max(e5_count, e10_count),
    })
    history.sort(key=lambda h: h["date"])
    HISTORY_PATH.write_text(json.dumps(history, ensure_ascii=False, indent=2), encoding="utf-8")

    trend = history[-TREND_DAYS:]
    e5_series = [d["e5_avg"] for d in trend]
    e10_series = [d["e10_avg"] for d in trend]
    combined = e5_series + e10_series
    vmin, vmax = (min(combined), max(combined)) if combined else (0, 1)

    latest = {
        "updated_at": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "location": "Rothenstein bei Jena, Thüringen",
        "radius_km": RAD_KM,
        "station_count": max(e5_count, e10_count),
        "current": {
            "e5": e5,
            "e10": e10,
        },
        "trend_days": len(trend),
        "chart": {
            "width": CHART_WIDTH,
            "height": CHART_HEIGHT,
            "e5_points": make_points(e5_series, vmin, vmax),
            "e10_points": make_points(e10_series, vmin, vmax),
            "min_price": round(vmin, 3),
            "max_price": round(vmax, 3),
            "first_date": trend[0]["date"] if trend else None,
            "last_date": trend[-1]["date"] if trend else None,
        },
        "trend": trend,
        "source": "Tankerkönig-API (creativecommons.tankerkoenig.de), Daten: Bundeskartellamt MTS-K. Super Plus (98) wird nicht erfasst.",
    }
    LATEST_PATH.write_text(json.dumps(latest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"OK: {today} E5={e5['avg']} E10={e10['avg']} ({max(e5_count, e10_count)} Stationen)")


if __name__ == "__main__":
    main()
