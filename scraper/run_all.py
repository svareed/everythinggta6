"""Orchestrator: run every source module, dedupe by URL, and write output to
scraper/data/YYYY-MM-DD.json and scraper/data/latest.json.

Run directly: `python run_all.py` (from inside scraper/, with deps
installed -- see README.md). Intended to be re-run daily, e.g. via cron.
"""
from __future__ import annotations

import json
from datetime import date
from pathlib import Path
from typing import Any

import article
import newswire
import reddit
import site_crawler
import youtube_transcripts

DATA_DIR = Path(__file__).parent / "data"

SOURCE_MODULES = [reddit, newswire, youtube_transcripts, article, site_crawler]


def run_all() -> list[dict[str, Any]]:
    all_records: list[dict[str, Any]] = []
    for module in SOURCE_MODULES:
        name = module.__name__
        try:
            records = module.fetch()
        except Exception as exc:  # one source's failure shouldn't kill the run
            print(f"[run_all] {name}.fetch() raised {type(exc).__name__}: {exc}")
            continue
        print(f"[run_all] {name}: {len(records)} record(s)")
        all_records.extend(records)

    deduped: dict[str, dict[str, Any]] = {}
    for record in all_records:
        deduped[record["url"]] = record
    return list(deduped.values())


def write_output(records: list[dict[str, Any]]) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(records, indent=2, ensure_ascii=False)

    dated_path = DATA_DIR / f"{date.today().isoformat()}.json"
    latest_path = DATA_DIR / "latest.json"
    dated_path.write_text(payload)
    latest_path.write_text(payload)

    print(f"[run_all] wrote {len(records)} deduped record(s) to {dated_path} and {latest_path}")


if __name__ == "__main__":
    write_output(run_all())
