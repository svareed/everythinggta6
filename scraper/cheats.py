"""Scraper for GTA6's confirmed cheat codes, from GTABoom's cheat-code hub.

GTABoom publishes the same 18 confirmed D-pad sequences twice -- once
under a PS5 tab panel, once under an identical Xbox Series X|S panel
(the codes are plain D-pad directions, so they don't actually differ by
platform). Each row's `id` is prefixed `gta-6-ps5-cheats--` or
`gta-6-xbox-series-xs-cheats--`; we keep only the PS5 rows so each cheat
is recorded once, matching how GTABoom's own article describes it
("Xbox sequences are the same as PS5").

Named cheats that are confirmed to exist but have no public input code
yet aren't on this page at all (verified by hand on 2026-11-19: all 18
rows carry a real D-pad sequence, none are blank). Those few come from
separate reporting -- TweakTown (citing Insider Gaming/PowerPyx) and
Player.one, both 2026-11-18 -- and are kept here as a short, manually
sourced fallback list, each flagged `confirmed: false`. TweakTown's own
URL for this is an RSS click-redirect link rather than a stable article
page, so it isn't a realistic re-scrape target; if GTABoom or another
outlet ever publishes a real code for one of these, move it out of this
list and let the scraper pick it up from the live page instead.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import requests
from bs4 import BeautifulSoup
from bs4.element import Tag

from common import USER_AGENT, now_iso, robots_allowed

CHEATS_URL = "https://www.gtaboom.com/gta-6-cheats"
UNCONFIRMED_SOURCE_URL = "https://www.tweaktown.com/rss/click/news/114769/?c=news-mf"

UNCONFIRMED_CHEATS: list[dict[str, Any]] = [
    {
        "name": "Spawn Hauners Rhino Tank",
        "sequence": None,
        "requirement": "Finish the main story, complete all survival challenges — input code not yet public",
        "confirmed": False,
        "source_url": UNCONFIRMED_SOURCE_URL,
    },
    {
        "name": "Inflatable Flamingo",
        "sequence": None,
        "requirement": 'Destroy 50 "cocaine flamingos" — input code not yet public',
        "confirmed": False,
        "source_url": UNCONFIRMED_SOURCE_URL,
    },
    {
        "name": "Golden Hour (screen filter)",
        "sequence": None,
        "requirement": "Spend 4 hours holding hands with your partner — input code not yet public",
        "confirmed": False,
        "source_url": UNCONFIRMED_SOURCE_URL,
    },
]


def _clean_requirement(req_el: Tag) -> str:
    text = req_el.get_text(" ", strip=True)
    label = req_el.find("strong")
    if label:
        label_text = label.get_text(strip=True)
        if text.startswith(label_text):
            text = text[len(label_text):].strip()
    return text.rstrip(".")


def fetch() -> list[dict[str, Any]]:
    unconfirmed = [{**c, "scraped_at": now_iso()} for c in UNCONFIRMED_CHEATS]

    if not robots_allowed(CHEATS_URL):
        print(f"[cheats] robots.txt disallows {CHEATS_URL}; skipping confirmed codes.")
        return unconfirmed

    try:
        resp = requests.get(CHEATS_URL, headers={"User-Agent": USER_AGENT}, timeout=10)
        resp.raise_for_status()
    except requests.RequestException as exc:
        print(f"[cheats] failed to fetch {CHEATS_URL}: {exc}")
        return unconfirmed

    soup = BeautifulSoup(resp.text, "html.parser")
    records: list[dict[str, Any]] = []
    for row in soup.select("li.uc-row"):
        row_id = row.get("id") or ""
        if not row_id.startswith("gta-6-ps5-cheats--"):
            continue  # skip the duplicate Xbox panel -- identical D-pad codes

        name_el = row.select_one("strong.uc-name")
        if not name_el:
            continue

        sequence_keys = [k.get_text(strip=True) for k in row.select("span.uc-t kbd")]
        req_el = row.select_one("p.uc-activation-requirement")

        records.append(
            {
                "name": name_el.get_text(strip=True),
                "sequence": ", ".join(sequence_keys) if sequence_keys else None,
                "requirement": _clean_requirement(req_el) if req_el else "",
                "confirmed": bool(sequence_keys),
                "source_url": CHEATS_URL,
                "scraped_at": now_iso(),
            }
        )

    return records + unconfirmed


def write_output(records: list[dict[str, Any]]) -> None:
    out = Path(__file__).parent / "data" / "cheats.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(records, indent=2, ensure_ascii=False) + "\n")
    print(f"[cheats] wrote {len(records)} record(s) to {out}")


if __name__ == "__main__":
    write_output(fetch())
