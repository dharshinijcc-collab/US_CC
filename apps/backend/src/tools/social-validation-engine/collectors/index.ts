import { SourceRow } from '../models/types';
import { collectHnPosts } from './hacker-news';
import { collectPhPosts } from './product-hunt';
import { collectRedditPosts } from './reddit';

export async function collectPosts(keywords: string[]): Promise<Partial<SourceRow>[]> {
  console.log("reddit_collector: starting parallel aggregation for platforms (Reddit, HN, PH)");

  // Run all collectors in parallel and ignore total failures (empty array on error)
  const results = await Promise.allSettled([
    collectRedditPosts(keywords),
    collectHnPosts(keywords),
    collectPhPosts(keywords),
  ]);

  const allRows: Partial<SourceRow>[] = [];
  const seenUrls = new Set<string>();
  const platformsCount: Record<string, number> = { reddit: 0, hackernews: 0, producthunt: 0 };

  for (const res of results) {
    if (res.status === 'fulfilled') {
      const list = res.value;
      for (const row of list) {
        const url = row.url;
        if (url && !seenUrls.has(url)) {
          seenUrls.add(url);
          allRows.push(row);
          const platform = row.platform || 'unknown';
          platformsCount[platform] = (platformsCount[platform] || 0) + 1;
        }
      }
    } else {
      console.error("reddit_collector: a source collector failed during execution:", res.reason);
    }
  }

  console.log(
    `reddit_collector: aggregated ${allRows.length} unique sources. Breakdown: ${JSON.stringify(platformsCount)}`
  );
  return allRows;
}
export { collectHnPosts } from './hacker-news';
export { collectPhPosts } from './product-hunt';
export { collectRedditPosts } from './reddit';
