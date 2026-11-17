"""Fetch articles from the Rockstar Games Newswire.

Tries RSS first (a few plausible feed paths), then falls back to fetching
the public listing page and parsing whatever HTML comes back.

IMPORTANT caveat found while building this: rockstargames.com/newswire has
no published RSS feed, and the listing page is a client-side-rendered
single-page app -- the HTML a plain HTTP GET receives is just an empty
<body> plus JS bundle references, with no article content in it. We do not
spin up a headless browser to execute that JS and scrape the rendered DOM;
doing so starts to look like working around how the site is built, which is
outside what this project asked for (politely fetching public pages, not
getting around anything). So when the page has no article links in its raw
markup, this module honestly returns an empty list instead of faking
content. If Rockstar ever ships an RSS feed or server-rendered markup, this
will pick it up automatically with no code changes.
"""
from __future__ import annotations

from typing import Any
from urllib.parse import urljoin

import feedparser
import requests
from bs4 import BeautifulSoup

from common import USER_AGENT, now_iso, robots_allowed

NEWSWIRE_URL = "https://www.rockstargames.com/newswire"

# Plausible RSS locations -- none are confirmed to exist; tried in order and
# skipped quietly if they 404 or don't parse as a feed.
CANDIDATE_RSS_URLS = [
    "https://www.rockstargames.com/newswire/feed",
    "https://www.rockstargames.com/newswire.rss",
    "https://www.rockstargames.com/newswire/rss",
]


def _fetch_rss() -> list[dict[str, Any]]:
    for url in CANDIDATE_RSS_URLS:
        if not robots_allowed(url):
            continue
        feed = feedparser.parse(url, request_headers={"User-Agent": USER_AGENT})
        if feed.bozo or not feed.entries:
            continue
        records = []
        for entry in feed.entries:
            records.append(
                {
                    "source": "newswire",
                    "type": "article",
                    "title": entry.get("title", ""),
                    "url": entry.get("link", ""),
                    "author": entry.get("author", "Rockstar Games"),
                    "published_at": entry.get("published", ""),
                    "content": entry.get("summary", ""),
                    "scraped_at": now_iso(),
                }
            )
        if records:
            return records
    return []


def _fetch_page() -> list[dict[str, Any]]:
    if not robots_allowed(NEWSWIRE_URL):
        print(f"[newswire] robots.txt disallows {NEWSWIRE_URL}; skipping.")
        return []

    try:
        resp = requests.get(NEWSWIRE_URL, headers={"User-Agent": USER_AGENT}, timeout=10)
        resp.raise_for_status()
    except requests.RequestException as exc:
        print(f"[newswire] failed to fetch {NEWSWIRE_URL}: {exc}")
        return []

    soup = BeautifulSoup(resp.text, "html.parser")
    records = []
    seen_urls = set()
    for link in soup.select("a[href*='/newswire/']"):
        href = (link.get("href") or "").strip()
        title = link.get_text(strip=True)
        full_url = urljoin(NEWSWIRE_URL, href)
        if not href or not title or full_url == NEWSWIRE_URL or full_url in seen_urls:
            continue
        seen_urls.add(full_url)
        records.append(
            {
                "source": "newswire",
                "type": "article",
                "title": title,
                "url": full_url,
                "author": "Rockstar Games",
                "published_at": "",
                "content": "",
                "scraped_at": now_iso(),
            }
        )

    if not records:
        print(
            f"[newswire] no article links found in {NEWSWIRE_URL}'s raw HTML "
            "(the page is a JS-rendered SPA shell and no RSS feed was found)."
        )
    return records


def fetch() -> list[dict[str, Any]]:
    records = _fetch_rss()
    if records:
        return records
    return _fetch_page()


if __name__ == "__main__":
    import json

    print(json.dumps(fetch(), indent=2))
