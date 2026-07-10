"""
modules/reddit_collector.py — Module 3 (TDD §2.3)

Takes keyword list → searches Reddit → returns raw post + comment rows
ready to insert into the `sources` table.

Design notes (from TDD §7.1 + PRD §11):
- Uses asyncpraw which wraps PRAW in async context.
- Rate limit budget: 100 req/min (free tier ceiling even after commercial approval).
- Exponential backoff on 429s (TDD §7.3).
- Author field intentionally omitted — PRD §12: 'probably skip for privacy reasons'.
- Engagement filter applied before returning rows (TDD §2.3: 'recency + engagement').
- Posts with engagement < settings.reddit_min_engagement are dropped.
"""
from __future__ import annotations

import asyncio
import logging
from datetime import datetime, timezone
from typing import Any

import asyncpraw
import asyncprawcore
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

from config import settings

log = logging.getLogger(__name__)


def _make_reddit() -> asyncpraw.Reddit:
    return asyncpraw.Reddit(
        client_id=settings.reddit_client_id,
        client_secret=settings.reddit_client_secret,
        user_agent=settings.reddit_user_agent,
    )


@retry(
    retry=retry_if_exception_type(asyncprawcore.exceptions.RequestException),
    stop=stop_after_attempt(settings.reddit_max_retries),
    wait=wait_exponential(multiplier=1, min=2, max=30),
    reraise=True,
)
async def _search_subreddit(
    reddit: asyncpraw.Reddit,
    keyword: str,
    subreddit_name: str,
    limit: int,
) -> list[dict[str, Any]]:
    """Search one subreddit for a keyword, return filtered post dicts."""
    results: list[dict[str, Any]] = []
    try:
        subreddit = await reddit.subreddit(subreddit_name)
        async for submission in subreddit.search(
            query=keyword,
            sort="relevance",
            time_filter="year",
            limit=limit,
        ):
            if submission.score < settings.reddit_min_engagement:
                continue

            row: dict[str, Any] = {
                "platform": "reddit",
                "url": f"https://reddit.com{submission.permalink}",
                "content": submission.selftext or submission.title,
                "engagement": submission.score,
                "posted_at": datetime.fromtimestamp(
                    submission.created_utc, tz=timezone.utc
                ).isoformat(),
            }
            results.append(row)

            # Pull top comments for richer pain-point signal
            submission.comment_limit = settings.reddit_top_comments_limit
            await submission.load()
            for comment in submission.comments[:settings.reddit_top_comments_limit]:
                if hasattr(comment, "body") and comment.score >= settings.reddit_min_engagement:
                    results.append({
                        "platform": "reddit",
                        "url": f"https://reddit.com{submission.permalink}",
                        "content": comment.body,
                        "engagement": comment.score,
                        "posted_at": datetime.fromtimestamp(
                            comment.created_utc, tz=timezone.utc
                        ).isoformat(),
                    })
    except asyncprawcore.exceptions.NotFound:
        log.warning("reddit_collector: subreddit r/%s not found, skipping.", subreddit_name)
    return results


TARGET_SUBREDDITS = [
    "startups",
    "Entrepreneur",
    "SaaS",
    "smallbusiness",
    "productmanagement",
    "indiehackers",
    "webdev",
    "apps",
]


async def collect_posts(keywords: list[str]) -> list[dict[str, Any]]:
    """
    For each keyword, search across TARGET_SUBREDDITS and aggregate raw post/comment rows.
    Returns a deduplicated list (by URL) ready for DB insert.
    """
    reddit = _make_reddit()
    all_rows: list[dict[str, Any]] = []
    seen_urls: set[str] = set()

    try:
        tasks = [
            _search_subreddit(
                reddit,
                keyword,
                subreddit,
                settings.reddit_posts_per_keyword,
            )
            for keyword in keywords
            for subreddit in TARGET_SUBREDDITS
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        for result in results:
            if isinstance(result, Exception):
                log.warning("reddit_collector: sub-search failed: %s", result)
                continue
            for row in result:
                if row["url"] not in seen_urls:
                    seen_urls.add(row["url"])
                    all_rows.append(row)
    finally:
        await reddit.close()

    log.info("reddit_collector: collected %d unique posts/comments.", len(all_rows))
    return all_rows
