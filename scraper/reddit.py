"""Fetch posts from Reddit's public JSON endpoints for r/GTA6.

No credentials required for this path. Add REDDIT_CLIENT_ID /
REDDIT_CLIENT_SECRET in .env (see .env.example) later to switch to Reddit's
official OAuth API for higher rate limits -- that's a config change, not a
rewrite, but it isn't wired up here since no app credentials exist yet.

IMPORTANT: as of this writing, https://www.reddit.com/robots.txt disallows
ALL crawling for ALL user agents ("User-agent: *" / "Disallow: /"), which
covers these JSON endpoints too. We check robots.txt before every request
and skip (returning no records, not raising) when it says to -- this module
will start actually fetching again automatically if/when Reddit's robots.txt
changes, or once real OAuth credentials move us onto the authenticated API.
"""
from __future__ import annotations

import time
from datetime import datetime, timezone
from typing import Any

import requests

from common import REQUEST_DELAY_SECONDS, USER_AGENT, now_iso, robots_allowed

SUBREDDIT = "GTA6"
LISTINGS = ["top", "new"]
URL_TEMPLATE = f"https://www.reddit.com/r/{SUBREDDIT}/{{listing}}.json"


def _fetch_listing(listing: str) -> list[dict[str, Any]]:
    url = URL_TEMPLATE.format(listing=listing)
    if not robots_allowed(url):
        print(f"[reddit] robots.txt disallows {url}; skipping.")
        return []

    try:
        resp = requests.get(
            url,
            headers={"User-Agent": USER_AGENT},
            params={"limit": 25},
            timeout=10,
        )
        resp.raise_for_status()
    except requests.RequestException as exc:
        print(f"[reddit] failed to fetch {url}: {exc}")
        return []

    records = []
    for child in resp.json().get("data", {}).get("children", []):
        post = child.get("data", {})
        created_utc = post.get("created_utc")
        published_at = (
            datetime.fromtimestamp(created_utc, tz=timezone.utc).isoformat()
            if created_utc
            else ""
        )
        records.append(
            {
                "source": "reddit",
                "type": "post",
                "title": post.get("title", ""),
                "url": "https://www.reddit.com" + post.get("permalink", ""),
                "author": post.get("author", ""),
                "published_at": published_at,
                "content": post.get("selftext", ""),
                "scraped_at": now_iso(),
            }
        )
    return records


def fetch() -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    for i, listing in enumerate(LISTINGS):
        if i > 0:
            time.sleep(REQUEST_DELAY_SECONDS)
        records.extend(_fetch_listing(listing))
    return records


if __name__ == "__main__":
    import json

    print(json.dumps(fetch(), indent=2)[:2000])
