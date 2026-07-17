import os
import base64
import httpx
import asyncio
from datetime import datetime, timezone
from typing import List, Dict, Any
from app.tools.sve.config import SETTINGS

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

async def get_reddit_access_token() -> str | None:
    client_id = os.getenv("REDDIT_CLIENT_ID", "")
    client_secret = os.getenv("REDDIT_CLIENT_SECRET", "")

    if not client_id or not client_secret or any(placeholder in client_id.lower() for placeholder in ["your_", "placeholder"]):
        return None

    try:
        auth_bytes = f"{client_id}:{client_secret}".encode("utf-8")
        auth_header = base64.b64encode(auth_bytes).decode("utf-8")
        
        headers = {
            "Authorization": f"Basic {auth_header}",
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": os.getenv("REDDIT_USER_AGENT", "sve-agent/0.1.0")
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                "https://www.reddit.com/api/v1/access_token",
                headers=headers,
                content="grant_type=client_credentials"
            )
            
            if response.status_code != 200:
                print(f"reddit_collector: Token fetch returned status {response.status_code}")
                return None
                
            data = response.json()
            return data.get("access_token")
    except Exception as e:
        print(f"reddit_collector: Token fetch error: {e}")
        return None

async def search_subreddit(
    client: httpx.AsyncClient,
    access_token: str,
    keyword: str,
    subreddit: str,
    limit: int
) -> List[Dict[str, Any]]:
    results = []
    user_agent = os.getenv("REDDIT_USER_AGENT", "sve-agent/0.1.0")
    headers = {
        "Authorization": f"Bearer {access_token}",
        "User-Agent": user_agent
    }

    try:
        encoded_keyword = httpx.utils.quote(keyword)
        search_url = f"https://oauth.reddit.com/r/{subreddit}/search.json?q={encoded_keyword}&sort=relevance&t=year&limit={limit}"
        response = await client.get(search_url, headers=headers)

        if response.status_code != 200:
            print(f"reddit_collector: Search returned status {response.status_code} for subreddit r/{subreddit}")
            return []

        res_data = response.json()
        children = res_data.get("data", {}).get("children", []) or []

        for child in children:
            submission = child.get("data", {}) or {}
            score = submission.get("score", 0)
            if score < SETTINGS["redditMinEngagement"]:
                continue

            permalink = submission.get("permalink", "")
            post_url = f"https://reddit.com{permalink}"
            
            results.append({
                "platform": "reddit",
                "url": post_url,
                "content": submission.get("selftext") or submission.get("title") or "",
                "engagement": int(score),
                "posted_at": datetime.fromtimestamp(submission.get("created_utc", 0), timezone.utc).isoformat()
            })

            # Fetch top comments
            num_comments = submission.get("num_comments", 0)
            comments_limit = SETTINGS["redditTopCommentsLimit"]
            if comments_limit > 0 and num_comments > 0:
                try:
                    sub_id = submission.get("id")
                    comments_url = f"https://oauth.reddit.com/comments/{sub_id}.json?limit={comments_limit}&depth=1"
                    comments_response = await client.get(comments_url, headers=headers)
                    if comments_response.status_code == 200:
                        comments_data = comments_response.json()
                        comments_children = comments_data[1].get("data", {}).get("children", []) or []
                        for comment_child in comments_children[:comments_limit]:
                            comment = comment_child.get("data", {}) or {}
                            c_body = comment.get("body")
                            c_score = comment.get("score", 0)
                            if c_body and c_score >= SETTINGS["redditMinEngagement"]:
                                results.append({
                                    "platform": "reddit",
                                    "url": post_url,
                                    "content": c_body,
                                    "engagement": int(c_score),
                                    "posted_at": datetime.fromtimestamp(comment.get("created_utc", 0), timezone.utc).isoformat()
                                })
                except Exception as comm_err:
                    print(f"reddit_collector: Failed to fetch comments for post {submission.get('id')}: {comm_err}")
    except Exception as e:
        print(f"reddit_collector: Subreddit r/{subreddit} search failed: {e}")

    return results

async def collect_reddit_posts(keywords: List[str]) -> List[Dict[str, Any]]:
    token = await get_reddit_access_token()
    if not token:
        print("reddit_collector: Reddit credentials not configured. Skipping Reddit collection.")
        return []

    print(f"reddit_collector: starting search for keywords: {keywords}")
    all_rows = []
    seen_urls = set()

    async with httpx.AsyncClient(timeout=15.0) as client:
        tasks = []
        for keyword in keywords[:3]:
            for subreddit in TARGET_SUBREDDITS:
                tasks.append(
                    search_subreddit(client, token, keyword, subreddit, SETTINGS["redditPostsPerKeyword"])
                )

        results = await asyncio.gather(*tasks, return_exceptions=True)
        for sub_results in results:
            if isinstance(sub_results, list):
                for row in sub_results:
                    url = row.get("url")
                    if url and url not in seen_urls:
                        seen_urls.add(url)
                        all_rows.append(row)

    print(f"reddit_collector: collected {len(all_rows)} unique Reddit posts.")
    return all_rows
