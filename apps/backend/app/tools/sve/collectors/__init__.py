import asyncio
from typing import List, Dict, Any
from app.tools.sve.collectors.reddit import collect_reddit_posts
from app.tools.sve.collectors.hacker_news import collect_hn_posts
from app.tools.sve.collectors.product_hunt import collect_ph_posts

async def collect_posts(keywords: List[str]) -> List[Dict[str, Any]]:
    print("reddit_collector: starting parallel aggregation for platforms (Reddit, HN, PH)")
    
    # Run all collectors in parallel and capture exceptions
    tasks = [
        collect_reddit_posts(keywords),
        collect_hn_posts(keywords),
        collect_ph_posts(keywords)
    ]
    
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    all_rows = []
    seen_urls = set()
    platforms_count = {"reddit": 0, "hackernews": 0, "producthunt": 0}
    platform_keys = ["reddit", "hackernews", "producthunt"]
    
    for idx, res in enumerate(results):
        platform_name = platform_keys[idx]
        if isinstance(res, Exception):
            print(f"reddit_collector: {platform_name} collector failed during execution: {res}")
            continue
            
        for row in res:
            url = row.get("url")
            if url and url not in seen_urls:
                seen_urls.add(url)
                all_rows.append(row)
                platform = row.get("platform", "unknown")
                if platform in platforms_count:
                    platforms_count[platform] += 1
                else:
                    platforms_count[platform] = 1
                    
    print(f"reddit_collector: aggregated {len(all_rows)} unique sources. Breakdown: {platforms_count}")
    return all_rows
