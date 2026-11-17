"""Generic fetcher for arbitrary article URLs: requests + BeautifulSoup,
extracting a title, author, publish date, and body text.

Works for ordinary server-rendered pages (news sites, wikis, blogs). It will
not work on JavaScript-rendered single-page apps, since it never executes
JS (see newswire.py for a concrete example of that limitation).
"""
from __future__ import annotations

import os
from typing import Any
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

from common import USER_AGENT, now_iso, robots_allowed

# Used when no URLs are passed in and ARTICLE_URLS isn't set in .env --
# a couple of real, stable, server-rendered pages about GTA6 so this module
# produces real output out of the box.
#
# GTABase and KeenGamer added per a 2026-11-17 source scan: both run
# dedicated GTA6 guide hubs on ordinary server-rendered pages (no SPA/JS
# wall), so the generic fetcher works on them directly.
DEFAULT_URLS = [
    "https://en.wikipedia.org/wiki/Grand_Theft_Auto_VI",
    "https://www.gtabase.com/gta-6/guides/",
    "https://www.keengamer.com/games/grand-theft-auto-vi/guides/",
]


def fetch_article(url: str) -> dict[str, Any] | None:
    if not robots_allowed(url):
        print(f"[article] robots.txt disallows {url}; skipping.")
        return None

    try:
        resp = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=10)
        resp.raise_for_status()
    except requests.RequestException as exc:
        print(f"[article] failed to fetch {url}: {exc}")
        return None

    soup = BeautifulSoup(resp.text, "html.parser")

    title_tag = soup.find("h1") or soup.find("title")
    title = title_tag.get_text(strip=True) if title_tag else ""

    paragraphs = [p.get_text(strip=True) for p in soup.find_all("p")]
    content = "\n\n".join(p for p in paragraphs if p)

    author_meta = soup.find("meta", attrs={"name": "author"})
    author = author_meta.get("content", "") if author_meta else ""

    published_meta = soup.find("meta", attrs={"property": "article:published_time"})
    published_at = published_meta.get("content", "") if published_meta else ""

    image_meta = soup.find("meta", attrs={"property": "og:image"})
    image = urljoin(url, image_meta["content"]) if image_meta and image_meta.get("content") else ""

    return {
        "source": "article",
        "type": "article",
        "title": title,
        "url": url,
        "author": author,
        "published_at": published_at,
        "content": content,
        "image": image,
        "scraped_at": now_iso(),
    }


def fetch(urls: list[str] | None = None) -> list[dict[str, Any]]:
    """Fetch a list of arbitrary article URLs.

    Pass `urls` explicitly, or set ARTICLE_URLS (comma-separated) in .env to
    control what run_all.py fetches without touching code. Falls back to
    DEFAULT_URLS if neither is given.
    """
    if urls is None:
        raw = os.getenv("ARTICLE_URLS", "")
        urls = [u.strip() for u in raw.split(",") if u.strip()] or DEFAULT_URLS

    records = []
    for url in urls:
        record = fetch_article(url)
        if record:
            records.append(record)
    return records


if __name__ == "__main__":
    import json
    import sys

    print(json.dumps(fetch(sys.argv[1:] or None), indent=2)[:3000])
