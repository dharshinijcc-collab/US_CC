import httpx
import urllib.parse
import time
from datetime import datetime, timezone
from typing import List, Dict, Any

async def collect_hn_posts(keywords: List[str]) -> List[Dict[str, Any]]:
    print(f"hn_collector: starting search for keywords: {keywords}")
    all_rows = []
    seen_urls = set()

    # Limit search to past 180 days to keep results fresh
    since_timestamp = int(time.time() - 180 * 24 * 60 * 60)

    async with httpx.AsyncClient(timeout=10.0) as client:
        for keyword in keywords[:3]:  # Cap keywords to prevent rate limits
            try:
                encoded_query = urllib.parse.quote(keyword)
                url = f"https://hn.algolia.com/api/v1/search?query={encoded_query}&tags=(story,comment)&numericFilters=created_at_i>{since_timestamp}"
                response = await client.get(url)
                if response.status_code != 200:
                    print(f"hn_collector: Algolia API returned status {response.status_code} for query {keyword}")
                    continue

                data = response.json()
                hits = data.get("hits", [])

                for hit in hits:
                    object_id = hit.get("objectID")
                    if not object_id:
                        continue

                    # Build post URL
                    post_url = f"https://news.ycombinator.com/item?id={object_id}"
                    if post_url in seen_urls:
                        continue

                    # Extract content
                    title = hit.get("title") or ""
                    text = hit.get("comment_text") or ""
                    content = f"{title}\n{text}".strip()

                    if not content or len(content) < 15:
                        continue

                    engagement = hit.get("points") or hit.get("story_points") or 1
                    created_at_str = hit.get("created_at")
                    posted_at = datetime.now(timezone.utc).isoformat()
                    if created_at_str:
                        try:
                            # Normalize Z format if needed
                            posted_at = datetime.fromisoformat(created_at_str.replace("Z", "+00:00")).isoformat()
                        except Exception:
                            pass

                    seen_urls.add(post_url)
                    all_rows.append({
                        "platform": "hackernews",
                        "url": post_url,
                        "content": content,
                        "engagement": int(engagement),
                        "posted_at": posted_at
                    })
            except Exception as e:
                print(f"hn_collector: Search failed for keyword {keyword}: {e}")

    print(f"hn_collector: collected {len(all_rows)} unique Hacker News posts.")
    return all_rows
