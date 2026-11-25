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

Each mission row is itself a link to GTABase's own per-mission walkthrough
page (verified by hand 2026-11-20, e.g. /gta-6/missions/gone-fishing).
`_fetch_detail()` visits that page for a short excerpt plus the
"given by X, where you play as Y, mission #N" facts GTABase states in its
own opening sentence -- not the full walkthrough, which stays on
GTABase's own page via `walkthrough_url`. This is a second HTTP request
per mission (136 of them), each still gated by `robots_allowed()` and
`REQUEST_DELAY_SECONDS`, so a full run takes several minutes.
"""
from __future__ import annotations

import copy
import json
import re
import time
from pathlib import Path
from typing import Any
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

from common import REQUEST_DELAY_SECONDS, USER_AGENT, now_iso, robots_allowed

MISSIONS_URL = "https://www.gtabase.com/gta-6/missions"
IMAGE_DIR = Path(__file__).parent / "data" / "images" / "missions"

CHAPTER_RE = re.compile(r"^(Prologue|Chapter \d+)$")
NUMBER_PREFIX_RE = re.compile(r"^\d+\.\s*")
EXCERPT_CHARS = 500

# Matches GTABase's own standard opening sentence, e.g.:
# "Gone Fishing is a main story mission in Grand Theft Auto VI, given by
# Cal Hampton, where you play as Jason Duval. It's mission #2 of the GTA 6
# story in chronological order." The "given by X" clause is absent for a
# few missions (e.g. the Prologue), hence it's optional in the pattern.
INTRO_RE = re.compile(
    r"is an? (?P<kind>[\w\s]+?) mission in Grand Theft Auto VI"
    r"(?:\s*,\s*given by\s*(?P<given_by>[^,]+?))?\s*,\s*where you play as\s*(?P<playable_as>[^.]+?)\s*\."
    r"\s*It'?s mission\s*#\s*(?P<number>\d+)",
    re.IGNORECASE,
)


def _tidy_spacing(text: str) -> str:
    """GTABase wraps names in their own inline tags with no source
    whitespace before the following punctuation (e.g. "<b>Cal Hampton</b>,"),
    so get_text(" ") inserts a stray space before commas/periods and after
    "#". Collapse those back to normal prose spacing before regex-matching
    or displaying this text."""
    text = re.sub(r"\s+([,.])", r"\1", text)
    text = re.sub(r"#\s+(\d)", r"#\1", text)
    return re.sub(r"\s{2,}", " ", text).strip()


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


def _fetch_detail(url: str) -> dict[str, Any]:
    """Visit one mission's own GTABase walkthrough page for a short
    excerpt plus the given-by/playable-as/mission-number facts, without
    copying the full walkthrough. Returns an empty dict on any failure
    (robots disallowed, network error, or an intro sentence that doesn't
    match GTABase's usual phrasing) -- callers should treat that mission
    as text-only/link-only rather than show a fabricated description."""
    if not robots_allowed(url):
        print(f"[missions] robots.txt disallows {url}; skipping detail fetch.")
        return {}
    try:
        resp = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=10)
        resp.raise_for_status()
    except requests.RequestException as exc:
        print(f"[missions] failed to fetch detail {url}: {exc}")
        return {}

    soup = BeautifulSoup(resp.text, "html.parser")
    paragraphs = [_tidy_spacing(p.get_text(" ", strip=True)) for p in soup.find_all("p")]
    paragraphs = [p for p in paragraphs if p and "login with your GTABase account" not in p]
    if not paragraphs:
        return {}

    detail: dict[str, Any] = {"walkthrough_url": url}
    m = INTRO_RE.search(paragraphs[0])
    if m:
        detail["mission_type"] = m.group("kind").strip().title()
        detail["given_by"] = (m.group("given_by") or "").strip() or None
        detail["playable_as"] = m.group("playable_as").strip()
        detail["story_number"] = int(m.group("number"))

    # "Required for 100%" lives in GTABase's own info-box widget (an
    # `li.field-entry.required-for-100`, same markup vehicles.py's own
    # detail fetch uses), not in the opening-sentence prose INTRO_RE parses.
    required_li = soup.select_one("li.field-entry.required-for-100")
    if required_li:
        value_el = required_li.find(class_="field-value")
        if value_el:
            detail["required_for_100"] = value_el.get_text(strip=True).lower() == "yes"

    # Excerpt: the first real walkthrough paragraph (paragraphs[0] is just
    # GTABase's own intro sentence, already captured above), plus one
    # "Tip:" paragraph if there is one, capped to EXCERPT_CHARS.
    body_paras = paragraphs[1:]
    excerpt_parts = body_paras[:1]
    tip = next((p for p in body_paras[1:] if p.lower().startswith("tip:")), None)
    if tip:
        excerpt_parts.append(tip)
    excerpt = " ".join(excerpt_parts)[:EXCERPT_CHARS]
    if excerpt:
        detail["description"] = excerpt

    return detail


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
        if title_el:
            name_source = title_el
        else:
            # No gtm-title wrapper (current markup, verified 2026-11-25):
            # the name is bare text in the h3 itself, alongside a
            # "gtm-badges" span -- e.g. GTABase's new post-launch
            # "CHAPTER 4 POINT OF NO RETURN" marker -- that get_text()
            # would otherwise concatenate straight onto the name with no
            # separator. Strip badge spans from a copy before reading text.
            name_source = copy.copy(h3)
            for badge in name_source.select("span.gtm-badges"):
                badge.decompose()
        name = NUMBER_PREFIX_RE.sub("", name_source.get_text(strip=True))
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

        href = el.get("href")
        mission_url = urljoin(MISSIONS_URL, href) if href else None
        slug = mission_url.rstrip("/").rsplit("/", 1)[-1] if mission_url else None

        records.append(
            {
                "chapter": current_chapter,
                "name": name,
                "slug": slug,
                "optional": optional,
                "img": img_path,
                "source_url": MISSIONS_URL,
                "scraped_at": now_iso(),
                "_detail_url": mission_url,  # internal only, stripped before writing
            }
        )

    for record in records:
        detail_url = record.pop("_detail_url", None)
        if not detail_url:
            continue
        time.sleep(REQUEST_DELAY_SECONDS)
        record.update(_fetch_detail(detail_url))

    return records


def write_output(records: list[dict[str, Any]]) -> None:
    out = Path(__file__).parent / "data" / "missions.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(records, indent=2, ensure_ascii=False) + "\n")
    print(f"[missions] wrote {len(records)} record(s) to {out}")


if __name__ == "__main__":
    write_output(fetch())
