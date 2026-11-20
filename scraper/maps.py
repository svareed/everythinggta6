"""Mirrors the real, official GTA6 map image Rockstar released on launch
day, as reported by RockstarINTEL (already one of site_crawler.py's seed
sites). There is exactly one real official map image, not one per region,
so this writes a single file rather than a JSON record list -- the
per-region "maps" content (name, status, blurb) lives in
web/src/lib/maps.ts instead, hand-authored and cited, the same way
map-of-leonida's region list already was before this script existed.

Confirmed by hand on 2026-11-20: the image URL is a normal WordPress
media upload with no Referer check (unlike GTABase's CDN), so a plain
`requests.get()` mirrors it without needing any special handling.

The article lazy-loads this image (a `data-src` attribute, not `src`,
with an inline SVG placeholder) -- the article's `og:image` meta tag
points at an unrelated promotional screenshot, not the map, so don't
take og:image as the map image for this (or similarly-built) pages.
"""
from __future__ import annotations

from pathlib import Path

import requests

from common import USER_AGENT, robots_allowed

MAP_IMAGE_URL = "https://rockstarintel.com/wp-content/uploads/2026/11/Leonida_Map_Poster.jpg"
SOURCE_ARTICLE = "https://rockstarintel.com/full-gta-vi-map-officially-revealed/"
IMAGE_DIR = Path(__file__).parent / "data" / "images" / "maps"


def fetch() -> str | None:
    """Downloads the map image into IMAGE_DIR and returns the path it
    should be published at (relative to web/public/), or None on failure."""
    if not robots_allowed(MAP_IMAGE_URL):
        print(f"[maps] robots.txt disallows {MAP_IMAGE_URL}; skipping.")
        return None

    filename = MAP_IMAGE_URL.rsplit("/", 1)[-1]
    dest = IMAGE_DIR / filename
    if not dest.exists():
        IMAGE_DIR.mkdir(parents=True, exist_ok=True)
        try:
            resp = requests.get(MAP_IMAGE_URL, headers={"User-Agent": USER_AGENT}, timeout=15)
            resp.raise_for_status()
            if not resp.headers.get("content-type", "").startswith("image/"):
                raise ValueError(f"not an image response: {resp.headers.get('content-type')}")
        except (requests.RequestException, ValueError) as exc:
            print(f"[maps] failed to mirror {MAP_IMAGE_URL}: {exc}")
            return None
        dest.write_bytes(resp.content)
    path = f"/images/maps/{filename}"
    print(f"[maps] mirrored official map image to data/images/maps/{filename} -> publish at {path}")
    print(f"[maps] source article: {SOURCE_ARTICLE}")
    return path


if __name__ == "__main__":
    fetch()
