#!/usr/bin/env python3
"""
Holt gute Nachrichten für die Küchen-Anzeige: 2 lokale aus Jena und Umgebung
(Stadt Jena, MDR Ostthüringen, OTZ Jena) und 2 aus aller Welt (Good News
Magazin). Filtert alles heraus, was für Kinder am Frühstückstisch nicht passt,
bevorzugt neue Meldungen und zeigt nichts zweimal (data/news_shown.json).
Dazu ein Kinderwitz des Tages. Ergebnis: data/news.json (TRMNL-Polling).
"""
import datetime
import email.utils
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

SHOWN_PATH = ROOT / "data" / "news_shown.json"

WORLD_FEEDS = [("https://goodnews-magazin.de/feed/", "Good News Magazin")]
LOCAL_FEEDS = [
    ("https://rathaus.jena.de/rss.xml", "Stadt Jena"),
    ("https://www.mdr.de/nachrichten/thueringen/ost-thueringen/index-rss.xml", "MDR Thüringen"),
    ("https://www.otz.de/lokales/jena/rss", "OTZ Jena"),
]
LOCAL_COUNT = 2
WORLD_COUNT = 2
MAX_AGE_DAYS = 6
TEASER_MAX = 120

# Lokale Meldungen: nur wenn sie erkennbar schön/interessant für Kinder sind
LOCAL_POSITIVE = [
    "fest ", "festakt", "feiern", "feiert", "jubiläum", "kinder", "familie", "zoo", "tier", "park", "natur", "wald",
    "museum", "konzert", "musik", "theater", "festival", "eröffn", "rekord", "wander", "garten",
    "blume", "planetarium", "sternwarte", "bibliothek", "bücherei", "lernspiel", "gesellschaftsspiel",
    "besucher", "kürbis", "laterne", "drachen", "zirkus", "ziegen", "herbstfest", "altstadtfest",
    "naturwunder", "partnerschaft", "singen", "tolkien", "skulptur", "kunst", "ausstellung",
    "schwimm", "baden", "spielplatz", "radweg", "baum", "pflanz", "ernte", "apfel", "weihnacht",
]
LOCAL_BLOCK = [
    "polizei", "unfall", "diebstahl", "randale", "ermittel", "prozess", "gericht", "insolvenz",
    "streik", "sperrung", "gesperrt", "baustelle", "sitzung", "einladung", "stadtrat", "ausschuss",
    "videobotschaft", "kartellamt", "investor", "übernahme", "gasleck", "misshandlung", "verletz",
    "trauer", "abschied", "kündig", "entlass", "brand", "feuer", "durchsuchung", "betrug",
    "die nachrichten für jena", "vorstand", "kreisvorstand", "schüsse", "schuss", "verlust",
    "um das leben", "gerücht", "rezension", "krimi", "maut", "debatte", "leserin", "leser ", "bier",
    "nachrichten am", "kracher", "durchgegriffen", "regimekritik", "gedenk", "grab", "nachtbürgermeister",
    "clubs", "partys", "fleischerei", "maßnahmen", "bäckerei", "nahverkehr", "bilder vom", "bilder des", "schönsten bilder", "fotos vom",
]
# MDR Ostthüringen deckt mehr ab: nur Jena und Umgebung
REGION = [
    "jena", "kahla", "stadtroda", "saale-holzland", "holzland", "hermsdorf", "eisenberg",
    "dornburg", "camburg", "rothenstein", "weimar", "apolda", "rudolstadt", "saalfeld",
    "pößneck", "leuchtenburg", "saale",
]

# Themen, die am Frühstückstisch mit Kind nichts verloren haben
BLOCKLIST = [
    "krebs", "tumor", "tod", "tot", "stirbt", "starb", "sterben", "leiche",
    "krieg", "waffe", "bombe", "militär", "terror", "anschlag", "mord", "gewalt",
    "missbrauch", "vergewalt", "drogen", "sucht", "suizid", "selbstmord",
    "sex", "porno", "fuck", "alkohol", "prostata", "brust", "hiv", "aids",
    "politik", "partei", "wahl", "afd", "steuer", "impf", "pandemie", "virus",
    "krankheit", "patient", "demenz", "alzheimer", "diabetes",
    "nazi", "ns-", "holocaust", "rassis", "extremis", "flucht", "katastroph",
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


def fetch(url: str, source: str) -> list:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (TRMNL Kuechen-Anzeige)"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            root = ET.fromstring(resp.read())
    except Exception as exc:  # eine ausgefallene Quelle darf die Seite nicht leeren
        print(f"Warnung: {source} nicht erreichbar: {exc}")
        return []
    items = []
    for it in root.iter("item"):
        title = html.unescape((it.findtext("title") or "").strip())
        desc = html.unescape(re.sub(r"<[^>]+>", " ", it.findtext("description") or ""))
        desc = re.sub(r"\s+", " ", desc).strip()
        try:
            published = email.utils.parsedate_to_datetime(it.findtext("pubDate") or "")
        except (TypeError, ValueError):
            published = None
        if title:
            items.append({"title": title, "teaser": desc, "source": source, "published": published})
    return items


def text_of(item: dict) -> str:
    return f"{item['title']} {item['teaser']}".lower()


def is_ok(item: dict) -> bool:
    text = text_of(item)
    if any(p in text for p in SKIP_PATTERNS):
        return False
    return not any(re.search(rf"\b{re.escape(w)}", text) for w in BLOCKLIST)


def is_good_local(item: dict) -> bool:
    text = text_of(item)
    if any(w in text for w in LOCAL_BLOCK):
        return False
    if item["source"] == "MDR Thüringen" and not any(w in text for w in REGION):
        return False
    return any(w in text for w in LOCAL_POSITIVE)


def score(item: dict) -> int:
    text = text_of(item)
    return sum(1 for w in BOOST if w in text)


def shorten(text: str) -> str:
    # erster Satz, sonst hart kürzen
    first = re.split(r"(?<=[.!?])(?<!\d\.)\s", text, maxsplit=1)[0]  # nicht bei „29. Oktober“ trennen
    if len(first) <= TEASER_MAX:
        return first
    return first[: TEASER_MAX - 1].rsplit(" ", 1)[0] + " …"


def pick(items: list, count: int, today: datetime.date, shown: dict) -> list:
    """Neueste zuerst; was an einem früheren Tag schon lief, kommt nur als Notnagel."""
    now = datetime.datetime.now(datetime.timezone.utc)

    def fresh(i):
        return i["published"] is None or (now - i["published"]).days <= MAX_AGE_DAYS

    def new(i):
        first = shown.get(i["title"])
        return first is None or first == today.isoformat()

    def order(i):
        ts = i["published"].timestamp() if i["published"] else 0
        return (-ts, -score(i))

    seen, result = set(), []
    for group in (
        [i for i in items if new(i) and fresh(i)],
        [i for i in items if fresh(i)],
        items,
    ):
        for i in sorted(group, key=order):
            if len(result) >= count:
                return result
            if i["title"] not in seen:
                seen.add(i["title"])
                result.append(i)
    return result


def main() -> None:
    today = datetime.datetime.now(TZ).date()
    shown = json.loads(SHOWN_PATH.read_text(encoding="utf-8")) if SHOWN_PATH.exists() else {}

    world = [i for url, src in WORLD_FEEDS for i in fetch(url, src) if is_ok(i)]
    local = [i for url, src in LOCAL_FEEDS for i in fetch(url, src) if is_ok(i) and is_good_local(i)]

    local_pick = pick(local, LOCAL_COUNT, today, shown)
    world_pick = pick(world, WORLD_COUNT + LOCAL_COUNT - len(local_pick), today, shown)

    for i in local_pick + world_pick:
        shown.setdefault(i["title"], today.isoformat())
    cutoff = (today - datetime.timedelta(days=60)).isoformat()
    shown = {t: d for t, d in shown.items() if d >= cutoff}

    def out(items):
        return [{"title": i["title"], "teaser": shorten(i["teaser"]), "source": i["source"]} for i in items]

    joke = random.Random(today.isoformat()).choice(JOKES)
    sources = sorted({i["source"] for i in local_pick + world_pick})
    payload = {
        "updated_at": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "date": today.isoformat(),
        "local": out(local_pick),
        "world": out(world_pick),
        "items": out(local_pick + world_pick),
        "joke": joke,
        "source": ", ".join(sources),
    }
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    SHOWN_PATH.write_text(json.dumps(shown, ensure_ascii=False, indent=1, sort_keys=True) + "\n", encoding="utf-8")
    print(f"{OUT_PATH.name}: {len(local_pick)} lokal, {len(world_pick)} Welt")
    for i in local_pick + world_pick:
        print(" -", i["source"], "|", i["title"])


if __name__ == "__main__":
    main()
