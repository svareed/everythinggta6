"""Bounded, on-topic crawler for a curated list of GTA6-covering fan/news
sites, producing short excerpts + citation links -- not full-text copies.

Checked robots.txt directly for each site on 2026-11-18 before adding it
here. Left out: gamerguides.com (robots.txt disallows "Anthropic-ai" by
name) and dexerto.com (disallows "ClaudeBot"/"Claude-Web"/"anthropic-ai"
by name); pushsquare.com and twinfinite.net (both sit behind a Cloudflare
JS challenge -- not something to work around); fandomwire.com (its
robots.txt reserves text-and-data-mining rights against bulk extraction,
allowing only "citation with attribution", which rules out crawling its
whole site).

Each seed site is crawled breadth-first from one known GTA6 hub/article
URL, following only same-domain links whose path looks GTA6-related,
capped at MAX_PAGES_PER_SITE pages. For every page we keep a title/
author/date plus a short excerpt of the body (EXCERPT_CHARS) -- the rest
stays on the source's own site, where `url` points. Record `type` is
"citation" (not "article") specifically so downstream rendering treats it
as excerpt-plus-attribution, not full content.
"""
from __future__ import annotations

import os
import re
import time
from typing import Any
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

from common import REQUEST_DELAY_SECONDS, USER_AGENT, now_iso, robots_allowed

MAX_PAGES_PER_SITE = int(os.getenv("SITE_CRAWLER_MAX_PAGES", "6"))
EXCERPT_CHARS = 500
MIN_EXCERPT_CHARS = 150  # below this, the page is a thin listing/hub, not an article

TOPIC_RE = re.compile(r"gta|grand-theft-auto", re.IGNORECASE)
# Category/tag/archive/pagination pages: fine as link-discovery stepping
# stones, but not real articles -- never record them, and don't chase their
# sibling-category links (that's how a crawl drifts off-topic into every
# other category a hub page happens to link to).
HUB_PATH_RE = re.compile(r"/(category|tag|tags|archives?|author|page|search)(/|$)", re.IGNORECASE)

SEED_SITES = {
    "RockstarINTEL": ["https://rockstarintel.com/category/gta/gta-6/"],
    "GTA Intel": ["https://gtaintel.com/"],
    "GTABase": ["https://www.gtabase.com/gta-6/guides/"],
    "Mobalytics": ["https://mobalytics.gg/gamebase/grand-theft-auto-6"],
    "GGRecon": ["https://www.ggrecon.com/articles/everything-you-missed-in-the-gta-6-trailer/"],
    "Den of Geek": [
        "https://www.denofgeek.com/games/the-gta-6-trailers-best-easter-eggs-references-and-hidden-details/"
    ],
    "Gameranx": ["https://gameranx.com/tag/gta-6/"],
    "Tom's Guide": [
        "https://www.tomsguide.com/gaming/gta-6-rumor-report-your-weekly-guide-to-the-latest-grand-theft-auto-updates"
    ],
}


def _extract(url: str, site_name: str) -> tuple[dict[str, Any] | None, set[str]]:
    if not robots_allowed(url):
        print(f"[site_crawler] robots.txt disallows {url}; skipping.")
        return None, set()

    try:
        resp = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=10)
        resp.raise_for_status()
    except requests.RequestException as exc:
        print(f"[site_crawler] failed to fetch {url}: {exc}")
        return None, set()

    soup = BeautifulSoup(resp.text, "html.parser")

    title_tag = soup.find("h1") or soup.find("title")
    title = title_tag.get_text(strip=True) if title_tag else ""

    paragraphs = [p.get_text(strip=True) for p in soup.find_all("p")]
    body = "\n\n".join(p for p in paragraphs if p)
    excerpt = body[:EXCERPT_CHARS]
    if len(body) > EXCERPT_CHARS:
        excerpt = excerpt.rsplit(" ", 1)[0] + "..."

    author_meta = soup.find("meta", attrs={"name": "author"})
    author = author_meta.get("content", "") if author_meta else site_name

    published_meta = soup.find("meta", attrs={"property": "article:published_time"})
    published_at = published_meta.get("content", "") if published_meta else ""

    same_domain_topic_links: set[str] = set()
    for a in soup.find_all("a", href=True):
        href = urljoin(url, a["href"]).split("#")[0]
        parsed = urlparse(href)
        if (
            parsed.scheme.startswith("http")
            and parsed.netloc == urlparse(url).netloc
            and TOPIC_RE.search(parsed.path)
            and not HUB_PATH_RE.search(parsed.path)
        ):
            same_domain_topic_links.add(href)

    is_hub_page = bool(HUB_PATH_RE.search(urlparse(url).path))
    record = None
    if not is_hub_page and title and len(excerpt) >= MIN_EXCERPT_CHARS:
        record = {
            "source": site_name,
            "type": "citation",
            "title": title,
            "url": url,
            "author": author,
            "published_at": published_at,
            "content": excerpt,
            "scraped_at": now_iso(),
        }
    return record, same_domain_topic_links


def _crawl_site(site_name: str, seed_urls: list[str]) -> list[dict[str, Any]]:
    visited: set[str] = set()
    queue: list[str] = list(seed_urls)
    records: list[dict[str, Any]] = []

    while queue and len(visited) < MAX_PAGES_PER_SITE:
        url = queue.pop(0)
        if url in visited:
            continue
        visited.add(url)

        record, links = _extract(url, site_name)
        time.sleep(REQUEST_DELAY_SECONDS)
        if record:
            records.append(record)
        for link in links:
            if link not in visited:
                queue.append(link)

    return records


def fetch() -> list[dict[str, Any]]:
    all_records: list[dict[str, Any]] = []
    for site_name, seed_urls in SEED_SITES.items():
        try:
            records = _crawl_site(site_name, seed_urls)
        except Exception as exc:  # one site's failure shouldn't kill the run
            print(f"[site_crawler] {site_name} crawl raised {type(exc).__name__}: {exc}")
            continue
        print(f"[site_crawler] {site_name}: {len(records)} record(s)")
        all_records.extend(records)
    return all_records


if __name__ == "__main__":
    import json

    print(json.dumps(fetch(), indent=2)[:3000])
