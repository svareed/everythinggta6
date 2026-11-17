"""One-off research script: pull real Ahrefs v3 data with the paid API key.

Not part of the daily scraper pipeline -- run manually to get the top related
queries for "gta 6" and the top-10 ranking pages for a few target queries, so
we know which sites to write crawlers for later.

Key comes from /Users/sonus/Desktop/claude/code/.env (AHREFS_API_KEY_PROD),
loaded at runtime only -- never read or printed by hand.
"""
from __future__ import annotations

import json
import os
import sys

import requests
from dotenv import load_dotenv

load_dotenv(dotenv_path="/Users/sonus/Desktop/claude/code/.env")

API_KEY = os.getenv("AHREFS_API_KEY_PROD")
BASE = "https://api.ahrefs.com/v3"

QUERIES = ["gta 6", "gta 6 tips", "gta 6 hidden gems"]

# Candidate endpoint paths -- Ahrefs' own docs are inconsistent across
# mirrors, so try a few shapes per call and report which one actually works.
RELATED_TERMS_PATHS = [
    "/keywords-explorer/related-terms",
    "/keywords-explorer/matching-terms",
]
SERP_OVERVIEW_PATHS = [
    "/serp-overview",
    "/serp-overview/serp-overview",
]


def _get(path: str, params: dict) -> tuple[int, dict | str]:
    url = f"{BASE}{path}"
    resp = requests.get(
        url,
        headers={"Authorization": f"Bearer {API_KEY}", "Accept": "application/json"},
        params=params,
        timeout=20,
    )
    try:
        body = resp.json()
    except ValueError:
        body = resp.text[:500]
    return resp.status_code, body


def try_related_terms(keyword: str) -> dict | None:
    params = {
        "select": "keyword,volume",
        "country": "us",
        "keywords": keyword,
        "terms": "all",
        "view_for": "top_100",
        "limit": 100,
        "order_by": "volume:desc",
    }
    for path in RELATED_TERMS_PATHS:
        status, body = _get(path, params)
        print(f"[related-terms] {path} -> {status}")
        if status == 200:
            return body
        print(f"  {json.dumps(body)[:300]}")
    return None


def try_serp_overview(keyword: str) -> dict | None:
    params = {
        "select": "url,title,position",
        "keyword": keyword,
        "country": "us",
        "top_positions": 10,
    }
    for path in SERP_OVERVIEW_PATHS:
        status, body = _get(path, params)
        print(f"[serp-overview:{keyword}] {path} -> {status}")
        if status == 200:
            return body
        print(f"  {json.dumps(body)[:300]}")
    return None


def main() -> None:
    if not API_KEY:
        print("AHREFS_API_KEY_PROD not found -- check /Users/sonus/Desktop/claude/code/.env", file=sys.stderr)
        sys.exit(1)

    related = try_related_terms("gta 6")
    if related:
        print(json.dumps(related, indent=2)[:3000])

    for q in QUERIES:
        serp = try_serp_overview(q)
        if serp:
            print(json.dumps(serp, indent=2)[:3000])


if __name__ == "__main__":
    main()
