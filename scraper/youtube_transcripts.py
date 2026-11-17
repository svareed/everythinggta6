"""Fetch transcripts for a configurable list of GTA6-related YouTube videos.

No API key needed for the transcripts themselves: the youtube-transcript-api
package pulls publicly available captions directly.

Seed list: real, currently-live videos on Rockstar Games' official YouTube
channel (youtube.com/@RockstarGames), confirmed by fetching that channel's
page directly while building this.

CHANNEL_HANDLES below extends this to creators, not just Rockstar's own
videos: each channel's latest uploads are looked up via the official
YouTube Data API (channels.list + search.list), which needs YOUTUBE_API_KEY
set in .env -- without it, this contributes 0 records, same as before.
Subscriber counts are from a 2026-11-17 web search and are
approximate/stale by the time you read this -- re-check before treating
them as current.
"""
from __future__ import annotations

import os
from typing import Any

import requests
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import CouldNotRetrieveTranscript

from common import now_iso

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
_YT_API = "https://www.googleapis.com/youtube/v3"

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

def _resolve_channel_id(handle: str) -> str | None:
    """Resolve a @handle to a channel ID via the official Data API."""
    try:
        resp = requests.get(
            f"{_YT_API}/channels",
            params={"part": "id", "forHandle": handle, "key": YOUTUBE_API_KEY},
            timeout=10,
        )
        resp.raise_for_status()
        items = resp.json().get("items", [])
        return items[0]["id"] if items else None
    except requests.RequestException as exc:
        print(f"[youtube_transcripts] failed to resolve channel {handle}: {exc}")
        return None


def _latest_from_channel(handle: str, display_name: str, limit: int = 3) -> dict[str, str]:
    """Returns {video_id: title} for a channel's most recent uploads, via the Data API."""
    if not YOUTUBE_API_KEY:
        return {}
    channel_id = _resolve_channel_id(handle)
    if not channel_id:
        return {}
    try:
        resp = requests.get(
            f"{_YT_API}/search",
            params={
                "part": "snippet",
                "channelId": channel_id,
                "order": "date",
                "type": "video",
                "maxResults": limit,
                "key": YOUTUBE_API_KEY,
            },
            timeout=10,
        )
        resp.raise_for_status()
    except requests.RequestException as exc:
        print(f"[youtube_transcripts] search failed for {handle}: {exc}")
        return {}
    found = {}
    for item in resp.json().get("items", []):
        video_id = item.get("id", {}).get("videoId")
        title = item.get("snippet", {}).get("title")
        if video_id and title:
            found[video_id] = f"{display_name}: {title}"
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
