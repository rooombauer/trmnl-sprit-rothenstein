"""
Gemeinsame Kartenprojektion für Grundkarte (make_basemap.py) und
Tankstellen-Marker (fetch_prices.py): Web-Mercator, Norden oben, fester
Ausschnitt rund um Rothenstein. Beide Skripte müssen dieselben Werte nutzen,
sonst liegen die Marker neben den Straßen.
"""
import math

CENTER_LAT = 50.85
CENTER_LNG = 11.60
MAP_SIZE = 340        # Kantenlänge in Pixel = tatsächliche Größe auf dem Display (sonst skaliert TRMNL unscharf)
EXTENT_KM = 10.8      # Radius, der sicher auf die Karte passt (Tankerkönig-Umkreis 10 km)
TILE_ZOOM = 11        # CARTO-Kachelzoom (Beschriftung in passender Größe)
TILE_PX = 512         # @2x-Kacheln


def world_px(lat: float, lng: float, zoom: int = TILE_ZOOM, tile_px: int = TILE_PX):
    n = tile_px * 2 ** zoom
    x = (lng + 180.0) / 360.0 * n
    s = math.sin(math.radians(lat))
    y = (0.5 - math.log((1 + s) / (1 - s)) / (4 * math.pi)) * n
    return x, y


def scale() -> float:
    """Faktor Welt-Pixel (TILE_ZOOM, @2x) -> Karten-Pixel."""
    m_per_px = 40075016.686 * math.cos(math.radians(CENTER_LAT)) / (TILE_PX * 2 ** TILE_ZOOM)
    extent_px = EXTENT_KM * 1000 / m_per_px
    return (MAP_SIZE / 2) / extent_px


def to_map(lat: float, lng: float):
    cx, cy = world_px(CENTER_LAT, CENTER_LNG)
    x, y = world_px(lat, lng)
    k = scale()
    return round(MAP_SIZE / 2 + (x - cx) * k, 1), round(MAP_SIZE / 2 + (y - cy) * k, 1)
