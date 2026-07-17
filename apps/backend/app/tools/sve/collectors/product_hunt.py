import os
import httpx
from datetime import datetime, timezone
from typing import List, Dict, Any

async def collect_ph_posts(keywords: List[str]) -> List[Dict[str, Any]]:
    api_key = os.getenv("PRODUCTHUNT_API_KEY", "")
    if not api_key or any(placeholder in api_key.lower() for placeholder in ["your_", "placeholder"]):
        print("ph_collector: PRODUCTHUNT_API_KEY is not configured. Skipping Product Hunt collection.")
        return []

    print(f"ph_collector: searching Product Hunt API for keywords: {keywords}")
    all_rows = []
    seen_urls = set()

    url = "https://api.producthunt.com/v2/api/graphql"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    query = """
    query SearchPosts($query: String!) {
      posts(search: $query, first: 5) {
        edges {
          node {
            id
            name
            tagline
            description
            url
            votesCount
            createdAt
            comments(first: 3) {
              edges {
                node {
                  id
                  body
                  votesCount
                  createdAt
                }
              }
            }
          }
        }
      }
    }
    """

    async with httpx.AsyncClient(timeout=15.0) as client:
        for keyword in keywords[:3]:  # Cap keywords to avoid rate limits
            try:
                variables = {"query": keyword}
                response = await client.post(
                    url,
                    headers=headers,
                    json={"query": query, "variables": variables}
                )

                if response.status_code != 200:
                    print(f"ph_collector: API returned status {response.status_code} for query {keyword}")
                    continue

                res_data = response.json()
                if "errors" in res_data:
                    print(f"ph_collector: GraphQL errors for query {keyword}: {res_data['errors']}")
                    continue

                posts_edges = res_data.get("data", {}).get("posts", {}).get("edges", []) or []
                for edge in posts_edges:
                    node = edge.get("node", {}) or {}
                    post_url = node.get("url")
                    if not post_url or post_url in seen_urls:
                        continue

                    # 1. Add the main post as a source
                    name = node.get("name") or ""
                    tagline = node.get("tagline") or ""
                    desc = node.get("description") or ""
                    content = f"{name} - {tagline}\n{desc}".strip()

                    if content and len(content) >= 15:
                        seen_urls.add(post_url)
                        all_rows.append({
                            "platform": "producthunt",
                            "url": post_url,
                            "content": content,
                            "engagement": int(node.get("votesCount") or 1),
                            "posted_at": node.get("createdAt") or datetime.now(timezone.utc).isoformat()
                        })

                    # 2. Add comments as separate sources
                    comments_edges = node.get("comments", {}).get("edges", []) or []
                    for c_edge in comments_edges:
                        c_node = c_edge.get("node", {}) or {}
                        c_body = c_node.get("body")
                        if not c_body or len(c_body) < 15:
                            continue

                        c_id = c_node.get("id")
                        c_url = f"{post_url}#comment-{c_id}" if c_id else post_url
                        if c_url in seen_urls:
                            continue

                        seen_urls.add(c_url)
                        all_rows.append({
                            "platform": "producthunt",
                            "url": c_url,
                            "content": c_body,
                            "engagement": int(c_node.get("votesCount") or 1),
                            "posted_at": c_node.get("createdAt") or datetime.now(timezone.utc).isoformat()
                        })
            except Exception as e:
                print(f"ph_collector: Search failed for keyword {keyword}: {e}")

    print(f"ph_collector: collected {len(all_rows)} unique Product Hunt mentions.")
    return all_rows
