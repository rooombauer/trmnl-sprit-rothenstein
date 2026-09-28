#!/usr/bin/env python3
"""
Erzeugt täglich 5 Rechenaufgaben (kleines Einmaleins, Faktoren 1-10) für die
Küchen-Anzeige und schreibt sie in data/rechnen.json (was TRMNL abruft).

Die Aufgaben sind pro Datum deterministisch (Seed = Datum), damit ein erneuter
Lauf am selben Tag dieselben Aufgaben liefert. Die Lösungen vom Vortag werden
mit ausgegeben, damit man sie am Frühstückstisch gemeinsam kontrollieren kann.
"""
import datetime
import json
import random
from zoneinfo import ZoneInfo
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_PATH = ROOT / "data" / "rechnen.json"
TZ = ZoneInfo("Europe/Berlin")  # Datum nach deutscher Zeit, Runner läuft in UTC

TASK_COUNT = 5
MIN_FACTOR = 2   # 1x... ist zu leicht
MAX_FACTOR = 10
DAYS_AHEAD = 7  # Vorrat, falls der Workflow ausfällt oder spät läuft


def make_tasks(day: datetime.date) -> list:
    rng = random.Random(day.isoformat())
    seen = set()
    tasks = []
    while len(tasks) < TASK_COUNT:
        a = rng.randint(MIN_FACTOR, MAX_FACTOR)
        b = rng.randint(MIN_FACTOR, MAX_FACTOR)
        key = frozenset((a, b))
        if key in seen:
            continue
        seen.add(key)
        tasks.append({"a": a, "b": b, "result": a * b})
    return tasks


def main() -> None:
    today = datetime.datetime.now(TZ).date()
    yesterday = today - datetime.timedelta(days=1)
    # Aufgaben für die nächsten Tage gleich mitliefern: Das Markup sucht sich per
    # Datum den heutigen Tag heraus. So stimmt die Anzeige auch dann, wenn GitHub
    # den nächtlichen Lauf (wie schon passiert) um Stunden verspätet startet.
    days = {}
    for offset in range(DAYS_AHEAD + 1):
        d = today + datetime.timedelta(days=offset)
        prev = d - datetime.timedelta(days=1)
        days[d.isoformat()] = {"tasks": make_tasks(d), "yesterday": {"date": prev.isoformat(), "tasks": make_tasks(prev)}}
    payload = {
        "updated_at": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "date": today.isoformat(),
        "topic": "Kleines Einmaleins",
        "tasks": make_tasks(today),
        "yesterday": {
            "date": yesterday.isoformat(),
            "tasks": make_tasks(yesterday),
        },
        "days": days,
    }
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{OUT_PATH.name}: " + ", ".join(f"{t['a']}×{t['b']}" for t in payload["tasks"]))


if __name__ == "__main__":
    main()
