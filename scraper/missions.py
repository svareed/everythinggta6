"""Scraper for GTA6's mission list, from GTABase's mission tracker.

GTABase's tracker page structure (verified by hand against the live HTML
on 2026-11-19): each chapter is a plain `<h2>Chapter N</h2>` (or
`<h2>Prologue</h2>`), followed by one `<a class="items-row">` per
mission -- optional/missable missions get an extra `items-row--opt`
class, nothing else distinguishes them. The mission's thumbnail is the
first `<img>` inside that `<a>`.

Real per-mission screenshots are mirrored to data/images/missions/
rather than referenced by their live gtabase.com URL: GTABase's CDN
rejects image requests that carry a foreign `Referer` header (confirmed
by hand on 2026-11-19 -- a bare request with no Referer gets a 200, the
same request with Referer set to another site's page gets a 403), so a
page on this site hotlinking those URLs directly would show broken
images for real visitors, even though the URL itself is real. A plain
`requests.get()` here sends no Referer at all, so the download succeeds;
publishing the result (see README.md) copies the mirrored files into
web/public/images/missions/ and points `img` at that local path instead.
"""
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

from common import USER_AGENT, now_iso, robots_allowed

MISSIONS_URL = "https://www.gtabase.com/gta-6/missions"
IMAGE_DIR = Path(__file__).parent / "data" / "images" / "missions"

CHAPTER_RE = re.compile(r"^(Prologue|Chapter \d+)$")
NUMBER_PREFIX_RE = re.compile(r"^\d+\.\s*")


def _mirror_image(url: str) -> str | None:
    """Download `url` into IMAGE_DIR and return the path it should be
    published at (relative to web/public/), or None if the download
    fails -- callers should treat that mission as text-only rather than
    link an image likely to 403 for real visitors."""
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
            print(f"[missions] failed to mirror image {url}: {exc}")
            return None
        dest.write_bytes(resp.content)
    return f"/images/missions/{filename}"


def fetch() -> list[dict[str, Any]]:
    if not robots_allowed(MISSIONS_URL):
        print(f"[missions] robots.txt disallows {MISSIONS_URL}; skipping.")
        return []

    try:
        resp = requests.get(MISSIONS_URL, headers={"User-Agent": USER_AGENT}, timeout=10)
        resp.raise_for_status()
    except requests.RequestException as exc:
        print(f"[missions] failed to fetch {MISSIONS_URL}: {exc}")
        return []

    soup = BeautifulSoup(resp.text, "html.parser")
    records: list[dict[str, Any]] = []
    current_chapter: str | None = None

    for el in soup.find_all(["h2", "a"]):
        if el.name == "h2":
            text = el.get_text(strip=True)
            if CHAPTER_RE.match(text):
                current_chapter = text
            continue

        classes = el.get("class") or []
        if "items-row" not in classes or current_chapter is None:
            continue

        h3 = el.find("h3", class_="contentheading")
        if not h3:
            continue
        title_el = h3.find("span", class_="gtm-title")
        name = NUMBER_PREFIX_RE.sub("", (title_el or h3).get_text(strip=True))
        # "OPTIONAL"/"MISSABLE" render as their own badge spans inside the
        # h3 -- items-row--opt on the <a> already flags this, but checking
        # the badges directly is the more precise signal and doesn't rely
        # on get_text() picking up badge text by accident.
        optional = bool(h3.select("span.gtm-badge"))

        img_tag = el.find("img")
        img_path = None
        if img_tag and img_tag.get("src"):
            img_url = urljoin(MISSIONS_URL, img_tag["src"])
            if img_url.rsplit("/", 1)[-1] != "tba_320x180.jpg":
                img_path = _mirror_image(img_url)

        records.append(
            {
                "chapter": current_chapter,
                "name": name,
                "optional": optional,
                "img": img_path,
                "source_url": MISSIONS_URL,
                "scraped_at": now_iso(),
            }
        )

    return records


def write_output(records: list[dict[str, Any]]) -> None:
    out = Path(__file__).parent / "data" / "missions.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(records, indent=2, ensure_ascii=False) + "\n")
    print(f"[missions] wrote {len(records)} record(s) to {out}")


if __name__ == "__main__":
    write_output(fetch())
