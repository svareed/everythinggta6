"""Fetch transcripts for a configurable list of GTA6-related YouTube videos.

No API key needed: the youtube-transcript-api package pulls publicly
available captions directly. Swap VIDEO_IDS for a YouTube Data API search
once a key is configured (see .env.example / README) instead of maintaining
this list by hand -- that's a config/code change in this one file, nothing
else needs to move.

Seed list: real, currently-live videos on Rockstar Games' official YouTube
channel (youtube.com/@RockstarGames), confirmed by fetching that channel's
page directly while building this.

CHANNEL_HANDLES below extends this to creators, not just Rockstar's own
videos: each channel's public Atom feed (no API key needed) gives its
latest uploads, which get the same transcript treatment. Subscriber counts
are from a 2026-11-17 web search and are approximate/stale by the time you
read this -- re-check before treating them as current.
"""
from __future__ import annotations

import re
from typing import Any

import feedparser
import requests
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import CouldNotRetrieveTranscript

from common import USER_AGENT, now_iso, robots_allowed

VIDEO_IDS = {
    "rz1B4B2yBZY": "Grand Theft Auto VI Launch Trailer",
    "VQRLujxTm3c": "Grand Theft Auto VI Trailer 2",
    "tJbzMqJGH4k": "Grand Theft Auto VI: An Extended Look",
    "EiQEBYDox_k": "Grand Theft Auto VI: Official Cover Art Reveal",
}

# Popular GTA6-covering creators (~100K+ subscribers per a 2026-11-17 search).
# Handle -> display name. Added to the scrape target list on request; each
# channel's latest uploads get pulled via its public RSS feed below.
CHANNEL_HANDLES = {
    "TypicalGamer": "Typical Gamer",
    "MrBossFTW": "MrBossFTW",
    "jellywtf": "Jelly",
    "FlyingKitty": "FlyingKittyyy",
    "any_austin": "any_austin",
    "KaiCenat": "Kai Cenat",
}

_CHANNEL_ID_RE = re.compile(r'"channelId":"(UC[0-9A-Za-z_-]{22})"')


def _resolve_channel_id(handle: str) -> str | None:
    url = f"https://www.youtube.com/@{handle}"
    if not robots_allowed(url):
        print(f"[youtube_transcripts] robots.txt disallows {url}; skipping.")
        return None
    try:
        resp = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=10)
        resp.raise_for_status()
    except requests.RequestException as exc:
        print(f"[youtube_transcripts] failed to resolve channel {handle}: {exc}")
        return None
    match = _CHANNEL_ID_RE.search(resp.text)
    return match.group(1) if match else None


def _latest_from_channel(handle: str, display_name: str, limit: int = 3) -> dict[str, str]:
    """Returns {video_id: title} for a channel's most recent uploads."""
    channel_id = _resolve_channel_id(handle)
    if not channel_id:
        return {}
    feed_url = f"https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}"
    if not robots_allowed(feed_url):
        print(f"[youtube_transcripts] robots.txt disallows {feed_url}; skipping.")
        return {}
    parsed = feedparser.parse(feed_url, request_headers={"User-Agent": USER_AGENT})
    found = {}
    for entry in parsed.entries[:limit]:
        video_id = getattr(entry, "yt_videoid", None)
        if video_id:
            found[video_id] = f"{display_name}: {entry.title}"
    return found


def _fetch_one(video_id: str, title: str) -> dict[str, Any] | None:
    try:
        transcript = YouTubeTranscriptApi().fetch(video_id)
    except CouldNotRetrieveTranscript as exc:
        print(f"[youtube_transcripts] no transcript for {video_id} ({title}): {exc}")
        return None

    text = " ".join(snippet.text for snippet in transcript)
    return {
        "source": "youtube",
        "type": "transcript",
        "title": title,
        "url": f"https://www.youtube.com/watch?v={video_id}",
        "author": "Rockstar Games",
        "published_at": "",
        "content": text,
        "scraped_at": now_iso(),
    }


def fetch() -> list[dict[str, Any]]:
    all_ids = dict(VIDEO_IDS)
    for handle, display_name in CHANNEL_HANDLES.items():
        all_ids.update(_latest_from_channel(handle, display_name))

    records = []
    for video_id, title in all_ids.items():
        record = _fetch_one(video_id, title)
        if record:
            records.append(record)
    return records


if __name__ == "__main__":
    import json

    print(json.dumps(fetch(), indent=2)[:2000])
