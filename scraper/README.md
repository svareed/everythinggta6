# egta6 scraper

Re-runnable pipeline that collects GTA6-related content from public, no-login
sources for the fan blog. Each source is a small Python module with a common
interface:

```python
def fetch() -> list[dict]:
    """Returns normalized records:
    {source, type, title, url, author, published_at, content, scraped_at}
    """
```

`run_all.py` runs every source, dedupes the results by `url`, and writes
`data/YYYY-MM-DD.json` (that day's run) and `data/latest.json` (always the
most recent run).

## Sources

| Module                    | What it does                                                | Needs a key? |
|---------------------------|--------------------------------------------------------------|--------------|
| `reddit.py`               | r/GTA6 `top.json` / `new.json` public endpoints               | No           |
| `newswire.py`              | Rockstar Games Newswire (RSS, else page fetch)                | No           |
| `youtube_transcripts.py`  | Transcripts for a hardcoded seed list of video IDs             | No           |
| `article.py`               | Generic title/author/date/body extraction for any article URL | No           |

All four run with **zero credentials**. All requests check the target site's
`robots.txt` first (and skip, rather than fetch, if it says no), send an
identifying `User-Agent`, and pause briefly between requests to the same
site (`SCRAPER_REQUEST_DELAY_SECONDS` in `.env`, default 2s).

**Known current limitations, not bugs:**
- `reddit.py`: reddit.com's robots.txt currently disallows crawling for
  every user agent (`User-agent: * / Disallow: /`), which covers these JSON
  endpoints. This module checks robots.txt before every request and will
  return no records while that's the case -- it isn't broken, it's obeying
  the site's stated policy. It'll resume working the moment that changes, or
  once real Reddit OAuth credentials move it onto the authenticated API.
- `youtube_transcripts.py` also now pulls from `CHANNEL_HANDLES`, a seed
  list of popular GTA6-covering creators (~100K+ subscribers per a
  2026-11-17 search, so treat the counts as approximate/stale) added on
  request to the scrape target list. This now goes through the official
  YouTube Data API (`channels.list` + `search.list`) instead of scraping
  channel pages or the RSS feed, since both of those paths run into
  youtube.com's robots.txt. It needs `YOUTUBE_API_KEY` set in `.env` --
  with no key, it contributes 0 records, same as before. Verified against
  the live API on 2026-11-17: both handles in `CHANNEL_HANDLES` resolve
  correctly now (`jelly` -> Jelly, 23.3M subs; `flyingkittyyy` -> FlyingKitty,
  3.27M subs) -- the earlier guesses (`jellywtf`, `FlyingKitty`) 404ed.
- `newswire.py`: rockstargames.com/newswire has no RSS feed, and its listing
  page is a client-rendered single-page app -- the server sends back an
  empty `<body>` with JS bundle references, no article content, so a plain
  HTTP fetch has nothing to parse. We don't run a headless browser to
  execute that JS and scrape the rendered DOM (that starts to look like
  working around the site rather than politely fetching it). If Rockstar
  ever adds an RSS feed or server-rendered markup, this module picks it up
  automatically, no code changes needed.

## Setup & running

```bash
cd scraper
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python run_all.py
```

Output lands in `scraper/data/<today>.json` and `scraper/data/latest.json`.
Each module can also be run on its own for quick checks, e.g.
`python youtube_transcripts.py` or `python article.py <url> <url> ...`.

## Running it daily (cron)

Example crontab entry that runs the pipeline every day at 06:00, logging to
a file:

```cron
0 6 * * * cd /path/to/egta6/scraper && venv/bin/python run_all.py >> run.log 2>&1
```

(`run.log` isn't committed -- add it to `.gitignore` if you keep this around.)

## Adding real credentials later

No API credentials exist yet for Reddit's OAuth flow, the YouTube Data API,
or the X/Twitter API. Copy `.env.example` to `.env` and fill in real values
when you have them -- `.env` is already git-ignored and is loaded
automatically via `python-dotenv` (see `common.py`). Nothing below requires
touching the module interfaces or `run_all.py`.

- **Reddit** (`REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`, `REDDIT_USER_AGENT`):
  create a "script" app at <https://www.reddit.com/prefs/apps>. Once set,
  `reddit.py` should be switched to call Reddit's authenticated API (e.g. via
  `praw` or direct OAuth token requests) instead of the public JSON
  endpoints, for higher rate limits and to sidestep the current robots.txt
  block on anonymous access.
- **YouTube** (`YOUTUBE_API_KEY`): create a key at
  <https://console.cloud.google.com/apis/credentials> with the YouTube Data
  API v3 enabled. Once set, `youtube_transcripts.py` can use
  `search.list` to find new GTA6 videos by keyword and feed the resulting
  IDs into the existing transcript-fetching logic, instead of maintaining
  `VIDEO_IDS` by hand.
- **X/Twitter** (`X_BEARER_TOKEN`): create a developer app at
  <https://developer.x.com/>. Once set, add a new `x_twitter.py` module with
  the same `fetch() -> list[dict]` interface as the other sources, and add it
  to `SOURCE_MODULES` in `run_all.py`.

Never commit the real `.env` file or print/log its contents.
