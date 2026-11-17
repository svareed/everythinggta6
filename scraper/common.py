"""Shared helpers used by every source module.

Kept deliberately small: a User-Agent string that honestly identifies this
scraper, a timestamp helper, and a robots.txt check. Each source module is
responsible for calling `robots_allowed()` before it fetches anything and for
rate-limiting itself (see REQUEST_DELAY_SECONDS).
"""
from __future__ import annotations

import os
from datetime import datetime, timezone
from urllib import robotparser
from urllib.parse import urljoin, urlparse

import requests
from dotenv import load_dotenv

load_dotenv()

# Identify ourselves honestly to every site we hit. Override via .env
# (SCRAPER_USER_AGENT) once this is deployed somewhere with a real contact
# point/repo URL.
USER_AGENT = os.getenv(
    "SCRAPER_USER_AGENT",
    "egta6-fanblog-scraper/0.1 (non-commercial GTA6 fan blog aggregator; "
    "contact: set SCRAPER_USER_AGENT in .env with a real contact URL)",
)

# Politeness delay (seconds) between requests made by a single source module.
REQUEST_DELAY_SECONDS = float(os.getenv("SCRAPER_REQUEST_DELAY_SECONDS", "2"))

_robots_cache: dict[str, robotparser.RobotFileParser] = {}


def now_iso() -> str:
    """Current UTC time as an ISO-8601 string, used for `scraped_at`."""
    return datetime.now(timezone.utc).isoformat()


def robots_allowed(url: str, user_agent: str = USER_AGENT) -> bool:
    """Check robots.txt for `url` before fetching it.

    Caches one RobotFileParser per host per process. We fetch robots.txt
    ourselves with our own identifying User-Agent (rather than letting
    RobotFileParser.read() do it with Python's bare default User-Agent,
    which some sites 403 outright, which would make us *think* we're
    disallowed everywhere on that host). A missing robots.txt (404) means
    "no rules, allow"; any other failure to read it fails closed
    (disallowed) rather than guessing.
    """
    parsed = urlparse(url)
    host = f"{parsed.scheme}://{parsed.netloc}"
    rp = _robots_cache.get(host)
    if rp is None:
        robots_url = urljoin(host, "/robots.txt")
        rp = robotparser.RobotFileParser()
        rp.set_url(robots_url)
        try:
            resp = requests.get(robots_url, headers={"User-Agent": user_agent}, timeout=10)
            if resp.status_code == 404:
                rp.allow_all = True
            else:
                resp.raise_for_status()
                rp.parse(resp.text.splitlines())
        except requests.RequestException as exc:
            print(f"[robots] could not read robots.txt for {host}: {exc}")
            return False
        _robots_cache[host] = rp
    return rp.can_fetch(user_agent, url)
