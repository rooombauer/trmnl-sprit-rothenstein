#!/usr/bin/env python3
"""
Holt aktuelle Super-E5-Preise rund um Rothenstein bei Jena (Thüringen) über
die Tankerkönig-API und schreibt:

- data/latest.json: was TRMNL abruft. Die vier nächstgelegenen Tankstellen
  plus eine fertig berechnete Mini-Karte (Pixelkoordinaten fürs SVG), auf der
  zusätzlich die günstigsten übrigen Tankstellen im Umkreis eingezeichnet sind.
- data/history.json: Langzeit-Log (ein Eintrag pro Tag, letzter Lauf gewinnt).

Hinweis: Tankerkönig / MTS-K erfasst nur E5, E10 und Diesel.
"""
import json
import math
import os
import sys
import urllib.request
import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

LAT = 50.85
LNG = 11.60
RAD_KM = 10
NEAREST = 4          # so viele Tankstellen in der Liste
CHEAP_OTHERS = 3     # so viele weitere günstige Tankstellen auf der Karte
ROOT = Path(__file__).resolve().parent.parent
HISTORY_PATH = ROOT / "data" / "history.json"
LATEST_PATH = ROOT / "data" / "latest.json"

MAP_SIZE = 400
MAP_PAD = 16
NEAR_R = 11
OTHER_R = 5
FONT_W = 7.2         # grobe Zeichenbreite bei 13px, für Label-Kollisionen

# Orientierungspunkte auf der Karte (nur wenn im Ausschnitt)
TOWNS = [
    ("Jena", 50.9272, 11.5892),
    ("Kahla", 50.8067, 11.5866),
    ("Stadtroda", 50.8567, 11.7267),
]


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


def load_json(path: Path, default):
    if path.exists():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return default
    return default


def has_price(s, fuel="e5"):
    return isinstance(s.get(fuel), (int, float)) and s[fuel] > 0


def split_price(p: float):
    """2.289 -> ("2,28", "9") für die klassische hochgestellte 9."""
    txt = f"{p:.3f}".replace(".", ",")
    return txt[:-1], txt[-1]


def title_case(txt: str) -> str:
    txt = (txt or "").strip()
    return txt.title() if txt.isupper() and len(txt) > 4 else txt


def brand_of(s) -> str:
    brand = title_case(s.get("brand") or "")
    return brand or title_case(s.get("name") or "Tankstelle")


def street_of(s) -> str:
    street = title_case(s.get("street") or "")
    no = (s.get("houseNumber") or "").strip()
    return f"{street} {no}".strip()


def to_km(lat, lng):
    x = (lng - LNG) * 111.32 * math.cos(math.radians(LAT))
    y = (lat - LAT) * 110.57
    return x, y


def nice_ring(extent_km: float) -> float:
    for step in (1, 2, 5, 10):
        if extent_km / step <= 2.2:
            return step
    return 10


def overlaps(a, b):
    return not (a[2] <= b[0] or b[2] <= a[0] or a[3] <= b[1] or b[3] <= a[1])


def overlap_area(a, b):
    w = min(a[2], b[2]) - max(a[0], b[0])
    h = min(a[3], b[3]) - max(a[1], b[1])
    return max(w, 0) * max(h, 0)


def place_label(x, y, r, text_len, taken, size=MAP_SIZE):
    """Sucht eine freie Position rechts/links/oben/unten vom Punkt."""
    w, h = text_len * FONT_W, 15
    gap = r + 4
    candidates = [
        ("start", x + gap, y + 5, (x + gap, y - 9, x + gap + w, y + 6)),
        ("end", x - gap, y + 5, (x - gap - w, y - 9, x - gap, y + 6)),
        ("middle", x, y - gap - 3, (x - w / 2, y - gap - h, x + w / 2, y - gap)),
        ("middle", x, y + gap + 12, (x - w / 2, y + gap, x + w / 2, y + gap + h)),
    ]
    best, best_cost = None, None
    for anchor, lx, ly, box in candidates:
        out = box[0] < 0 or box[1] < 0 or box[2] > size or box[3] > size
        cost = sum(overlap_area(box, t) for t in taken) + (10_000 if out else 0)
        if best_cost is None or cost < best_cost:
            best, best_cost = (anchor, lx, ly, box), cost
        if cost == 0:
            break
    anchor, lx, ly, box = best
    taken.append(box)
    return {"anchor": anchor, "lx": round(lx, 1), "ly": round(ly, 1)}


def spread(points, fixed, min_gap=2 * NEAR_R + 4, rounds=60):
    """Schiebt zu dicht liegende Marker auseinander (Karte ist schematisch)."""
    for _ in range(rounds):
        moved = False
        for i, a in enumerate(points):
            others = [(b["x"], b["y"]) for j, b in enumerate(points) if j != i] + fixed
            for bx, by in others:
                dx, dy = a["x"] - bx, a["y"] - by
                d = math.hypot(dx, dy)
                if d < min_gap:
                    if d < 0.01:
                        dx, dy, d = 1.0, 0.0, 1.0
                    push = (min_gap - d) / 2
                    a["x"] += dx / d * push
                    a["y"] += dy / d * push
                    moved = True
        if not moved:
            break
    for p in points:
        p["x"], p["y"] = round(p["x"], 1), round(p["y"], 1)


def build_map(near: list, others: list) -> dict:
    pts = [to_km(s["lat"], s["lng"]) for s in near + others]
    max_d = max([math.hypot(x, y) for x, y in pts] + [1.0])
    extent = max_d * 1.1
    radius_px = MAP_SIZE / 2 - MAP_PAD
    scale = radius_px / extent
    c = MAP_SIZE / 2

    def px(lat, lng):
        x, y = to_km(lat, lng)
        return round(c + x * scale, 1), round(c - y * scale, 1)

    near_pts = [{"n": i, "x": px(s["lat"], s["lng"])[0], "y": px(s["lat"], s["lng"])[1]}
                for i, s in enumerate(near, 1)]
    other_pts = [{"x": px(s["lat"], s["lng"])[0], "y": px(s["lat"], s["lng"])[1], "s": s}
                 for s in others]
    spread(near_pts + other_pts, fixed=[(c, c)])

    # Punkte zuerst als belegt markieren, damit Labels ihnen ausweichen
    taken = [(c - 9, c - 9, c + 9, c + 9)]
    for p in near_pts:
        taken.append((p["x"] - NEAR_R, p["y"] - NEAR_R, p["x"] + NEAR_R, p["y"] + NEAR_R))
    for p in other_pts:
        taken.append((p["x"] - OTHER_R, p["y"] - OTHER_R, p["x"] + OTHER_R, p["y"] + OTHER_R))

    step = nice_ring(extent)
    rings = []
    k = step
    while k <= extent:
        r = round(k * scale, 1)
        label = f"{k:g} km"
        rings.append({"r": r, "label": label, "lx": round(c + r * 0.707 + 4, 1), "ly": round(c + r * 0.707 + 4, 1)})
        taken.append((c + r * 0.707, c + r * 0.707 - 6, c + r * 0.707 + 40, c + r * 0.707 + 8))
        k += step

    for o in other_pts:
        s = o.pop("s")
        brand = brand_of(s)
        main, sup = split_price(s["e5"])
        o["brand"] = brand
        o["price_main"] = main
        o["price_sup"] = sup
        o.update(place_label(o["x"], o["y"], OTHER_R, len(brand) + 6, taken))

    towns = []
    for name, lat, lng in TOWNS:
        x, y = px(lat, lng)
        if MAP_PAD < x < MAP_SIZE - MAP_PAD and MAP_PAD < y < MAP_SIZE - MAP_PAD:
            box = (x - len(name) * 3.6, y - 7, x + len(name) * 3.6, y + 7)
            if not any(overlaps(box, t) for t in taken):
                taken.append(box)
                towns.append({"name": name, "x": x, "y": round(y + 4, 1)})

    return {
        "size": MAP_SIZE,
        "cx": c,
        "cy": c,
        "rings": rings,
        "near": near_pts,
        "others": other_pts,
        "towns": towns,
    }


def main():
    api_key = os.environ.get("TANKERKOENIG_API_KEY")
    if not api_key:
        print("Fehler: TANKERKOENIG_API_KEY nicht gesetzt", file=sys.stderr)
        sys.exit(1)

    stations = [s for s in fetch_stations(api_key) if has_price(s)]
    if not stations:
        print("Warnung: keine gültigen E5-Preise im Umkreis", file=sys.stderr)
        sys.exit(1)

    stations.sort(key=lambda s: s.get("dist", 99))
    near = stations[:NEAREST]
    near_ids = {s["id"] for s in near}
    others = sorted(
        (s for s in stations if s["id"] not in near_ids and s.get("isOpen", True)),
        key=lambda s: s["e5"],
    )[:CHEAP_OTHERS]

    open_near = [s for s in near if s.get("isOpen", True)] or near
    cheapest_id = min(open_near, key=lambda s: s["e5"])["id"]
    rows = []
    for i, s in enumerate(near, 1):
        main, sup = split_price(s["e5"])
        rows.append({
            "n": i,
            "brand": brand_of(s),
            "street": street_of(s),
            "place": title_case(s.get("place") or ""),
            "dist": f"{s.get('dist', 0):.1f}".replace(".", ",") + " km",
            "price_main": main,
            "price_sup": sup,
            "open": bool(s.get("isOpen", True)),
            "cheapest": s["id"] == cheapest_id,
        })

    all_e5 = [s["e5"] for s in stations]
    today = datetime.date.today().isoformat()
    history = load_json(HISTORY_PATH, [])
    history = [h for h in history if h.get("date") != today]  # letzter Lauf des Tages gewinnt
    history.append({
        "date": today,
        "e5_avg": round(sum(all_e5) / len(all_e5), 3),
        "e5_min": round(min(all_e5), 3),
        "station_count": len(stations),
    })
    history.sort(key=lambda h: h["date"])
    HISTORY_PATH.write_text(json.dumps(history, ensure_ascii=False, indent=2), encoding="utf-8")

    now = datetime.datetime.now(datetime.timezone.utc)
    local = now.astimezone(ZoneInfo("Europe/Berlin"))
    latest = {
        "updated_at": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "updated_local": local.strftime("%d.%m. %H:%M"),
        "location": "Rothenstein",
        "radius_km": RAD_KM,
        "stations": rows,
        "karte": build_map(near, others),
        "source": "Tankerkönig-API (creativecommons.tankerkoenig.de), Daten: Bundeskartellamt MTS-K, CC BY 4.0",
    }
    LATEST_PATH.write_text(json.dumps(latest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"OK: {today} E5 " + ", ".join(f"{r['brand']} {r['price_main']}{r['price_sup']}" for r in rows))


if __name__ == "__main__":
    main()
