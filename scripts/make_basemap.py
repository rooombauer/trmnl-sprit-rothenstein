#!/usr/bin/env python3
"""
Erzeugt einmalig die Grundkarte data/karte.png für die Sprit-Seite:
minimalistische Straßenkarte mit Ortsnamen, Norden oben, schwarz-weiß für
das E-Ink-Display. Die Daten kommen per Overpass-API aus OpenStreetMap.

Die Karte ändert sich nicht, deshalb läuft das Skript nicht im Workflow,
sondern nur von Hand, wenn der Ausschnitt geändert wird (Werte in
karte_proj.py). Braucht Pillow (pip install pillow) und eine TTF-Schrift
(Standard: Arial von macOS, per FONT_PATH änderbar).

Kartendaten © OpenStreetMap-Mitwirkende (ODbL).
"""
import json
import math
import os
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from karte_proj import CENTER_LAT, CENTER_LNG, MAP_SIZE, TILE_PX, TILE_ZOOM, scale, to_map, world_px

ROOT = Path(__file__).resolve().parent.parent
OUT_PATH = ROOT / "data" / "karte.png"
OVERPASS_URL = "https://overpass-api.de/api/interpreter"
USER_AGENT = "TRMNL-Kuechenanzeige/1.0 (privat, einmalige Grundkarte)"
FONT_DIR = os.environ.get("FONT_DIR", "/System/Library/Fonts/Supplemental")

SS = 2  # Supersampling: doppelt zeichnen, dann verkleinern (glattere Linien)

# Straßenklasse -> (Linienbreite in Kartenpixeln, Grauwert)
ROAD_STYLE = {
    "motorway": (3.2, 0), "motorway_link": (1.4, 0),
    "trunk": (2.6, 0), "trunk_link": (1.2, 0),
    "primary": (2.0, 0),
    "secondary": (1.3, 60),
    "tertiary": (0.8, 150),
}
ROAD_ORDER = ["tertiary", "secondary", "primary", "trunk_link", "trunk", "motorway_link", "motorway"]

# Ortsnamen: Städte immer, dazu ausgewählte Dörfer (sonst wird es zu voll)
ALWAYS = {"Jena", "Kahla", "Stadtroda", "Rothenstein"}
MAX_VILLAGES = 7
CENTER_FREE = 22  # Radius um die Heim-Markierung (wird im SVG gezeichnet), dort keine Namen


def bbox():
    cx, cy = world_px(CENTER_LAT, CENTER_LNG)
    half = (MAP_SIZE / 2) / scale()
    n = TILE_PX * 2 ** TILE_ZOOM

    def inv(x, y):
        lng = x / n * 360 - 180
        lat = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * y / n))))
        return lat, lng

    s, w = inv(cx - half, cy + half)
    no, e = inv(cx + half, cy - half)
    return s, w, no, e


def fetch_osm() -> list:
    s, w, n, e = bbox()
    query = (
        f'[out:json][timeout:90];('
        f'way["highway"~"^({"|".join(ROAD_STYLE)})$"]({s},{w},{n},{e});'
        f'node["place"~"^(city|town|village)$"]({s},{w},{n},{e}););out geom;'
    )
    req = urllib.request.Request(
        OVERPASS_URL,
        data=urllib.parse.urlencode({"data": query}).encode(),
        headers={"User-Agent": USER_AGENT},
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        return json.loads(resp.read())["elements"]


def font(bold: bool, size: int):
    name = "Arial Bold.ttf" if bold else "Arial.ttf"
    return ImageFont.truetype(str(Path(FONT_DIR) / name), size * SS)


def main() -> None:
    cache = os.environ.get("OSM_CACHE")  # optional: Overpass-Antwort wiederverwenden
    if cache and Path(cache).exists():
        elements = json.loads(Path(cache).read_text())["elements"]
    else:
        elements = fetch_osm()
    size = MAP_SIZE * SS
    img = Image.new("L", (size, size), 255)
    draw = ImageDraw.Draw(img)

    ways = [e for e in elements if e["type"] == "way"]
    for cls in ROAD_ORDER:
        width, gray = ROAD_STYLE[cls]
        for way in (w for w in ways if w["tags"].get("highway") == cls):
            pts = [tuple(v * SS for v in to_map(p["lat"], p["lon"])) for p in way["geometry"]]
            draw.line(pts, fill=gray, width=max(1, round(width * SS)), joint="curve")

    # Ortsnamen gierig platzieren: Städte zuerst, dann Dörfer nach Einwohnerzahl
    places = [e for e in elements if e["type"] == "node" and e["tags"].get("name")]

    def prio(p):
        t = p["tags"]
        pop = int(t.get("population", "0").replace(".", "") or 0) if t.get("population", "").replace(".", "").isdigit() else 0
        return (t["name"] not in ALWAYS, {"city": 0, "town": 1}.get(t["place"], 2), -pop)

    taken, villages = [], 0
    c = size / 2
    # Tankstellen liegen fest: ihre Marker (aus dem letzten Lauf) nicht mit Namen überdecken
    latest = ROOT / "data" / "latest.json"
    if latest.exists():
        karte = json.loads(latest.read_text()).get("karte", {})
        k = MAP_SIZE / karte.get("size", MAP_SIZE) * SS
        r = 13 * SS
        for p in karte.get("near", []) + karte.get("others", []):
            taken.append((p["x"] * k - r, p["y"] * k - r, p["x"] * k + r, p["y"] * k + r))
    for p in sorted(places, key=prio):
        name, kind = p["tags"]["name"], p["tags"]["place"]
        important = name in ALWAYS
        if not important and villages >= MAX_VILLAGES:
            continue
        x, y = (v * SS for v in to_map(p["lat"], p["lon"]))
        big = kind in ("city", "town")
        f = font(bold=big, size=15 if kind == "city" else 13 if big else 11)
        l, t, r, b = draw.textbbox((0, 0), name, font=f)
        w, h = r - l, b - t
        pad = 3 * SS
        for dx, dy in ((0, -h - 6 * SS), (0, 6 * SS), (8 * SS, -h / 2), (-w - 8 * SS, -h / 2)):
            bx = x + dx - (w / 2 if dx == 0 else 0)
            by = y + dy
            box = (bx - pad, by - pad, bx + w + pad, by + h + pad)
            inside = box[0] > 0 and box[1] > 0 and box[2] < size and box[3] < size
            clear_of_home = math.hypot(bx + w / 2 - c, by + h / 2 - c) > CENTER_FREE * SS + w / 2
            if inside and clear_of_home and not any(
                not (box[2] < o[0] or o[2] < box[0] or box[3] < o[1] or o[3] < box[1]) for o in taken
            ):
                taken.append(box)
                draw.text((bx - l, by - t), name, font=f, fill=0, stroke_width=3 * SS, stroke_fill=255)
                if not big and name != "Rothenstein":
                    draw.ellipse((x - 2 * SS, y - 2 * SS, x + 2 * SS, y + 2 * SS), fill=0)
                if not important:
                    villages += 1
                break

    img = img.resize((MAP_SIZE, MAP_SIZE), Image.LANCZOS)
    # auf die 4 Graustufen des Displays abbilden
    img = img.point(lambda v: 0 if v < 64 else 85 if v < 150 else 170 if v < 225 else 255)
    img.save(OUT_PATH, optimize=True)
    print(f"{OUT_PATH.name}: {MAP_SIZE}x{MAP_SIZE}, {len(ways)} Straßenabschnitte, {len(taken)} Ortsnamen")


if __name__ == "__main__":
    main()
