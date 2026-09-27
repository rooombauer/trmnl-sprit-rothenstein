#!/usr/bin/env python3
"""
Holt gute Nachrichten (goodnews-magazin.de, RSS) für die Küchen-Anzeige,
filtert alles heraus, was für Kinder am Frühstückstisch nicht passt, und
ergänzt einen Kinderwitz des Tages. Ergebnis: data/news.json (TRMNL-Polling).
"""
import datetime
import html
import json
import random
import re
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parent.parent
OUT_PATH = ROOT / "data" / "news.json"
TZ = ZoneInfo("Europe/Berlin")

FEED_URL = "https://goodnews-magazin.de/feed/"
SOURCE = "Good News Magazin (goodnews-magazin.de)"
ITEM_COUNT = 3
TEASER_MAX = 160

# Themen, die am Frühstückstisch mit Kind nichts verloren haben
BLOCKLIST = [
    "krebs", "tumor", "tod", "tot", "stirbt", "starb", "sterben", "leiche",
    "krieg", "waffe", "bombe", "militär", "terror", "anschlag", "mord", "gewalt",
    "missbrauch", "vergewalt", "drogen", "sucht", "suizid", "selbstmord",
    "sex", "porno", "fuck", "alkohol", "prostata", "brust", "hiv", "aids",
    "politik", "partei", "wahl", "afd", "steuer", "impf", "pandemie", "virus",
    "krankheit", "patient", "demenz", "alzheimer", "diabetes",
]
# Sammelartikel ("Nachrichten-Überblick") sind zu lang und gemischt
SKIP_PATTERNS = ["nachrichten-überblick", "hier kommt der lösungsorientierte"]

# Bevorzugte Themen: Tiere, Natur, Entdeckungen, Kurioses
BOOST = [
    "tier", "katze", "hund", "vogel", "wal", "delfin", "schildkröte", "elefant",
    "wald", "baum", "natur", "meer", "entdeck", "art ", "wiederentdeckt",
    "rekord", "kinder", "schule", "lesen", "weltraum", "stern", "mond",
]

JOKES = [
    "Was ist grün und klopft an die Tür? – Ein Klopfsalat!",
    "Wie nennt man einen Bumerang, der nicht zurückkommt? – Stock.",
    "Was macht ein Pirat am Computer? – Er drückt die Enter-Taste.",
    "Welcher Bus fährt über den Ozean? – Ein Kolumbus!",
    "Was ist orange und läuft durch den Wald? – Eine Wanderine.",
    "Warum können Seeräuber keinen Kreis berechnen? – Weil sie Pi raten.",
    "Was ist weiß und springt im Wald herum? – Ein Jogurt.",
    "Was liegt am Strand und spricht undeutlich? – Eine Nuschel.",
    "Warum summen Bienen? – Weil sie den Text vergessen haben.",
    "Was sagt der große Stift zum kleinen Stift? – Wachs mal Stift!",
    "Was ist ein Keks unter einem Baum? – Ein schattiges Plätzchen.",
    "Wo wohnen Katzen? – Im Mietzhaus.",
    "Was macht eine Wolke mit Juckreiz? – Sie fliegt zum Wolkenkratzer.",
    "Welches Tier kann am besten rechnen? – Der Oktoplus.",
    "Was ist braun und sitzt hinter Gittern? – Eine Knastanie.",
    "Wie nennt man ein Schaf ohne Beine? – Eine Wolke.",
    "Was trinken Ziegen am liebsten? – Meckermilch.",
    "Was macht ein Clown im Büro? – Faxen!",
    "Was ist ein Cowboy ohne Pferd? – Ein Sattelschlepper.",
    "Was ist grün und rennt weg? – Ein Fluchtsalat.",
    "Was sagt die Null zur Acht? – Schicker Gürtel!",
    "Was ist das Lieblingsfach von Schlangen? – Zischkunde.",
    "Warum sind Fische so schlau? – Weil sie in Schulen gehen.",
    "Wie heißt ein Spanier ohne Auto? – Carlos.",
    "Was ist grün und hat Räder? – Gras. Das mit den Rädern war geschwindelt.",
    "Was hat vier Beine und kann fliegen? – Zwei Vögel.",
    "Was ist blau und riecht nach roter Farbe? – Blaue Farbe.",
    "Was macht ein Hai am Computer? – Er surft im Internet.",
    "Was ist rot und steht am Wegrand? – Eine Hagebutte.",
]


def fetch_items() -> list:
    req = urllib.request.Request(FEED_URL, headers={"User-Agent": "Mozilla/5.0 (TRMNL Kuechen-Anzeige)"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        root = ET.fromstring(resp.read())
    items = []
    for it in root.iter("item"):
        title = html.unescape((it.findtext("title") or "").strip())
        desc = html.unescape(re.sub(r"<[^>]+>", " ", it.findtext("description") or ""))
        desc = re.sub(r"\s+", " ", desc).strip()
        items.append({"title": title, "teaser": desc})
    return items


def is_ok(item: dict) -> bool:
    text = f"{item['title']} {item['teaser']}".lower()
    if any(p in text for p in SKIP_PATTERNS):
        return False
    return not any(re.search(rf"\b{re.escape(w)}", text) for w in BLOCKLIST)


def score(item: dict) -> int:
    text = f"{item['title']} {item['teaser']}".lower()
    return sum(1 for w in BOOST if w in text)


def shorten(text: str) -> str:
    # erster Satz, sonst hart kürzen
    first = re.split(r"(?<=[.!?])\s", text, maxsplit=1)[0]
    if len(first) <= TEASER_MAX:
        return first
    return first[: TEASER_MAX - 1].rsplit(" ", 1)[0] + " …"


def main() -> None:
    today = datetime.datetime.now(TZ).date()
    items = [i for i in fetch_items() if is_ok(i)]
    # stabile Sortierung: Tier-/Naturthemen nach vorn, sonst Feed-Reihenfolge
    items = sorted(items, key=score, reverse=True)[:ITEM_COUNT]
    joke = random.Random(today.isoformat()).choice(JOKES)
    payload = {
        "updated_at": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "date": today.isoformat(),
        "items": [{"title": i["title"], "teaser": shorten(i["teaser"])} for i in items],
        "joke": joke,
        "source": SOURCE,
    }
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{OUT_PATH.name}: {len(items)} Meldungen")
    for i in payload["items"]:
        print(" -", i["title"])


if __name__ == "__main__":
    main()
