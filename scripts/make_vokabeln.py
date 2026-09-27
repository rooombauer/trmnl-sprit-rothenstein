#!/usr/bin/env python3
"""
Wählt täglich 5 Englischvokabeln (Niveau Klasse 5, Gymnasium) für die
Küchen-Anzeige aus data/vokabeln_liste.json und schreibt data/vokabeln.json
(was TRMNL abruft).

Die Liste wird einmal fest gemischt und dann Tag für Tag der Reihe nach
abgearbeitet, damit sich Wörter erst wiederholen, wenn alle einmal dran waren.
Jede Vokabel: englisch, deutsch, Wortart, Beispielsatz.
"""
import datetime
import json
import random
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parent.parent
LIST_PATH = ROOT / "data" / "vokabeln_liste.json"
OUT_PATH = ROOT / "data" / "vokabeln.json"
TZ = ZoneInfo("Europe/Berlin")

WORDS_PER_DAY = 5
START = datetime.date(2026, 9, 28)  # Tag 0 der Reihenfolge
SHUFFLE_SEED = "vokabeln-klasse-5"


def words_for(day: datetime.date, words: list) -> list:
    order = list(range(len(words)))
    random.Random(SHUFFLE_SEED).shuffle(order)
    start = ((day - START).days * WORDS_PER_DAY) % len(order)
    picked = [order[(start + i) % len(order)] for i in range(WORDS_PER_DAY)]
    return [
        {"en": words[i][0], "de": words[i][1], "type": words[i][2], "example": words[i][3]}
        for i in picked
    ]


def main() -> None:
    words = json.loads(LIST_PATH.read_text(encoding="utf-8"))
    today = datetime.datetime.now(TZ).date()
    payload = {
        "updated_at": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "date": today.isoformat(),
        "topic": "Englisch · 5. Klasse",
        "words": words_for(today, words),
    }
    OUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{OUT_PATH.name}: " + ", ".join(w["en"] for w in payload["words"]))


if __name__ == "__main__":
    main()
