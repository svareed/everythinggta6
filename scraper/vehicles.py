"""Scraper for GTA6's full vehicle catalog, from GTABase's vehicle database.

GTABase splits vehicles into class pages (verified by hand against the
live HTML on 2026-11-21):
`https://www.gtabase.com/gta-6/vehicles/best-vehicles/?class=<slug>`.
There is no single page listing all vehicles -- the class pages are the
only way to enumerate them. 21 classes exist; "compacts" currently
returns zero vehicles (not a scraper bug -- confirmed by hand, that
class is just empty on GTABase right now). A few vehicles are tagged
under more than one class (e.g. the Maibatsu Sanchez motorcycle also
shows up under "Off-Road") -- this script dedupes by each vehicle's
own GTABase URL slug, keeping the first class it's seen under.

Each class page uses the same `items-row` card structure already
documented in missions.py's docstring: a manufacturer `badge` + model
name, a thumbnail, a "Based on:" real-world-inspiration field, and
0-2 numeric rating fields (their labels vary by class -- Road/Off-Road
Rating for off-road vehicles, Speed/Acceleration for some others, none
at all for several classes) alongside a link to the vehicle's own detail
page.

Every vehicle's own detail page (verified by hand 2026-11-21, e.g.
/gta-6/vehicles/benson) carries a further info-box of real, distinct
specs GTABase doesn't put on the class-list card: Era, Body Condition,
Specialist, Seats, Mass/Weight, Drive Train, Gears, and a "How To Get"
field, plus the same Speed/Acceleration/Asphalt Handling/Off-Road
Handling/Strength stat bars for every vehicle (the class-list card only
has these for some classes). `_fetch_detail()` visits that page -- a
second HTTP request per vehicle (358 of them), gated by
`robots_allowed()` and `REQUEST_DELAY_SECONDS` like missions.py's own
per-mission detail fetch, so a full run takes several minutes.

Images are mirrored locally for the same reason missions.py mirrors
them: GTABase's CDN 403s any image request carrying a foreign Referer
header, so hotlinking these URLs would show broken images to real
visitors even though the URLs themselves are genuine.
"""
from __future__ import annotations

import json
import re
import time
from pathlib import Path
from typing import Any
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

from common import REQUEST_DELAY_SECONDS, USER_AGENT, now_iso, robots_allowed

VEHICLES_URL = "https://www.gtabase.com/gta-6/vehicles/best-vehicles/"
IMAGE_DIR = Path(__file__).parent / "data" / "images" / "vehicles"

# Confirmed by hand on 2026-11-21: every slug below returns at least one
# vehicle except "compacts" (kept anyway so a future re-run notices if
# Rockstar/GTABase ever populates it, rather than silently never
# checking again).
CLASSES = [
    "boats", "commercial", "compacts", "coupes", "cycles", "emergency",
    "helicopters", "industrial", "military", "motorcycles", "muscle",
    "off-road", "planes", "sedans", "service", "sports", "sports-classic",
    "super", "suvs", "utility", "vans",
]

CLASS_LABELS = {
    "off-road": "Off-Road",
    "suvs": "SUVs",
    "sports-classic": "Sports Classic",
}


def _class_label(slug: str) -> str:
    return CLASS_LABELS.get(slug, slug.replace("-", " ").title())


def _mirror_image(url: str) -> str | None:
    filename = url.split("/")[-1].split("?")[0]
    dest = IMAGE_DIR / filename
    if not dest.exists():
        IMAGE_DIR.mkdir(parents=True, exist_ok=True)
        try:
            resp = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=10)
            resp.raise_for_status()
            if not resp.headers.get("content-type", "").startswith("image/"):
                raise ValueError(f"not an image response: {resp.headers.get('content-type')}")
        except (requests.RequestException, ValueError) as exc:
            print(f"[vehicles] failed to mirror image {url}: {exc}")
            return None
        dest.write_bytes(resp.content)
    return f"/images/vehicles/{filename}"


def _parse_card(card, class_slug: str, seen_urls: set[str]) -> dict[str, Any] | None:
    link = card.find("a", href=True)
    if not link:
        return None
    detail_url = urljoin(VEHICLES_URL, link["href"])
    if detail_url in seen_urls:
        return None  # already captured under an earlier class

    h3 = card.find("h3")
    if not h3:
        return None
    badge = h3.find("span", class_="badge")
    manufacturer = badge.get_text(strip=True) if badge else None
    full_name = h3.get_text(" ", strip=True)

    img_tag = card.find("img")
    img_path = None
    if img_tag and img_tag.get("src"):
        img_url = urljoin(VEHICLES_URL, img_tag["src"])
        # Same "tba" placeholder GTABase uses when it has no real screenshot
        # yet, as already handled in missions.py -- skip rather than mirror
        # a fake match.
        if not img_url.rsplit("/", 1)[-1].startswith("tba_"):
            img_path = _mirror_image(img_url)

    based_on = None
    ratings: dict[str, int] = {}
    for info in card.find_all("div", class_="article-info"):
        text = info.get_text(" ", strip=True)
        if text.startswith("Based on:"):
            based_on = text.split("Based on:", 1)[1].strip()
            continue
        for part in text.split("·"):
            m = re.match(r"\s*([\w\s/-]+?):\s*(\d+)\s*$", part)
            if m:
                ratings[m.group(1).strip()] = int(m.group(2))

    seen_urls.add(detail_url)
    return {
        "name": full_name,
        "manufacturer": manufacturer,
        "class": _class_label(class_slug),
        "based_on": based_on,
        "ratings": ratings or None,
        "img": img_path,
        "detail_url": detail_url,
        "source_url": f"{VEHICLES_URL}?class={class_slug}",
        "scraped_at": now_iso(),
    }


# Labels GTABase repeats in the detail page's main info-box that are
# already captured from the class-list card (name/manufacturer/class/
# based_on) -- skipped here rather than duplicated into `specs`. "Rating"
# is GTABase's own opaque overall composite score, excluded as unhelpful
# without their own scoring context.
SKIP_SPEC_LABELS = {"Vehicle Class", "Manufacturer", "Based on (Real Life)", "Rating"}


def _parse_detail_fields(soup: BeautifulSoup) -> tuple[dict[str, float], dict[str, str]]:
    """Splits every `li.field-entry` on a vehicle detail page into numeric
    stat-bar ratings (Speed/Acceleration/etc -- identified by the
    `stats-bar` sibling GTABase renders only for those) and the remaining
    text specs (Era, Body Condition, Seats, Mass, Drive Train, Gears, How
    To Get...). Entries with no label (e.g. GTABase's internal
    `rating-asphalt` composite score) are skipped."""
    ratings: dict[str, float] = {}
    specs: dict[str, str] = {}
    for li in soup.select("li.field-entry"):
        label_el = li.find(class_="field-label")
        value_el = li.find(class_="field-value")
        if not label_el or not value_el:
            continue
        label = label_el.get_text(" ", strip=True)
        value = value_el.get_text(" ", strip=True)
        if not label or not value:
            continue
        if li.find(class_="stats-bar") is not None:
            try:
                ratings[label] = float(value)
            except ValueError:
                pass
        elif label not in SKIP_SPEC_LABELS:
            specs[label] = value
    return ratings, specs


def _fetch_detail(url: str) -> dict[str, Any]:
    """Visit one vehicle's own GTABase detail page for the specs and
    ratings the class-list card doesn't carry (or only carries for some
    classes). Returns an empty dict on any failure, same convention as
    missions.py's own `_fetch_detail`."""
    if not robots_allowed(url):
        print(f"[vehicles] robots.txt disallows {url}; skipping detail fetch.")
        return {}
    try:
        resp = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=10)
        resp.raise_for_status()
    except requests.RequestException as exc:
        print(f"[vehicles] failed to fetch detail {url}: {exc}")
        return {}

    soup = BeautifulSoup(resp.text, "html.parser")
    ratings, specs = _parse_detail_fields(soup)

    detail: dict[str, Any] = {}
    if ratings:
        detail["ratings"] = ratings
    if specs:
        detail["specs"] = specs
    return detail


def fetch() -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    seen_urls: set[str] = set()

    for class_slug in CLASSES:
        url = f"{VEHICLES_URL}?class={class_slug}"
        if not robots_allowed(url):
            print(f"[vehicles] robots.txt disallows {url}; skipping.")
            continue
        try:
            resp = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=20)
            resp.raise_for_status()
        except requests.RequestException as exc:
            print(f"[vehicles] failed to fetch {url}: {exc}")
            continue

        soup = BeautifulSoup(resp.text, "html.parser")
        cards = soup.find_all(class_="items-row")
        added = 0
        for card in cards:
            record = _parse_card(card, class_slug, seen_urls)
            if record:
                records.append(record)
                added += 1
        print(f"[vehicles] {class_slug}: {len(cards)} card(s) on page, {added} new")
        time.sleep(REQUEST_DELAY_SECONDS)

    for record in records:
        time.sleep(REQUEST_DELAY_SECONDS)
        detail = _fetch_detail(record["detail_url"])
        if detail.get("ratings"):
            record["ratings"] = detail["ratings"]
        if detail.get("specs"):
            record["specs"] = detail["specs"]

    return records


def write_output(records: list[dict[str, Any]]) -> None:
    out = Path(__file__).parent / "data" / "vehicles.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(records, indent=2, ensure_ascii=False) + "\n")
    print(f"[vehicles] wrote {len(records)} record(s) to {out}")


if __name__ == "__main__":
    write_output(fetch())
