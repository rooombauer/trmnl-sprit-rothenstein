#!/usr/bin/env python3
"""
Wählt täglich 5 Vokabeln pro Sprache für die Küchen-Anzeige aus und schreibt
sie als JSON (was TRMNL abruft):

- Englisch, Niveau Klasse 5 Gymnasium: data/vokabeln_liste.json -> data/vokabeln.json
- Hocharabisch, Niveau A2:              data/arabisch_liste.json -> data/arabisch.json

Jede Liste wird einmal fest gemischt und dann Tag für Tag der Reihe nach
abgearbeitet, damit sich Wörter erst wiederholen, wenn alle einmal dran waren.
"""
import datetime
import json
import random
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parent.parent
TZ = ZoneInfo("Europe/Berlin")

WORDS_PER_DAY = 5
START = datetime.date(2026, 9, 28)  # Tag 0 der Reihenfolge
DAYS_AHEAD = 7  # Vorrat: Markup wählt per Datum, falls der Workflow spät läuft

SETS = [
    {
        "list": ROOT / "data" / "vokabeln_liste.json",
        "out": ROOT / "data" / "vokabeln.json",
        "seed": "vokabeln-klasse-5",
        "topic": "Englisch · 5. Klasse",
    },
    {
        "list": ROOT / "data" / "arabisch_liste.json",
        "out": ROOT / "data" / "arabisch.json",
        "seed": "arabisch-a2",
        "topic": "Hocharabisch · A2",
    },
]


def as_entry(raw) -> dict:
    # Englisch-Liste: [englisch, deutsch, Wortart, Beispielsatz]
    if isinstance(raw, list):
        return {"en": raw[0], "de": raw[1], "type": raw[2], "example": raw[3]}
    return raw


def words_for(day: datetime.date, words: list, seed: str) -> list:
    order = list(range(len(words)))
    random.Random(seed).shuffle(order)
    start = ((day - START).days * WORDS_PER_DAY) % len(order)
    return [as_entry(words[order[(start + i) % len(order)]]) for i in range(WORDS_PER_DAY)]


def main() -> None:
    today = datetime.datetime.now(TZ).date()
    for cfg in SETS:
        words = json.loads(cfg["list"].read_text(encoding="utf-8"))
        payload = {
            "updated_at": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "date": today.isoformat(),
            "topic": cfg["topic"],
            "words": words_for(today, words, cfg["seed"]),
            "days": {
                (today + datetime.timedelta(days=o)).isoformat(): {
                    "words": words_for(today + datetime.timedelta(days=o), words, cfg["seed"])
                }
                for o in range(DAYS_AHEAD + 1)
            },
        }
        cfg["out"].write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"{cfg['out'].name}: " + ", ".join(w.get("en") or w.get("de") for w in payload["words"]))


if __name__ == "__main__":
    main()
