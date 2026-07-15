import { SourceRow } from '../models/types';

export async function collectHnPosts(keywords: string[]): Promise<Partial<SourceRow>[]> {
  console.log(`hn_collector: starting search for keywords: ${JSON.stringify(keywords)}`);
  const allRows: Partial<SourceRow>[] = [];
  const seenUrls = new Set<string>();

  // Limit search to past 180 days to keep results fresh
  const sinceTimestamp = Math.floor((Date.now() - 180 * 24 * 60 * 60 * 1000) / 1000);

  for (const keyword of keywords.slice(0, 3)) { // Cap keywords to prevent rate limits
    try {
      const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(keyword)}&tags=(story,comment)&numericFilters=created_at_i>${sinceTimestamp}`;
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`hn_collector: Algolia API returned status ${response.status} for query ${keyword}`);
        continue;
      }

      const data = await response.json() as any;
      const hits = data.hits || [];

      for (const hit of hits) {
        const objectId = hit.objectID;
        if (!objectId) continue;

        // Build post URL
        const postUrl = `https://news.ycombinator.com/item?id=${objectId}`;
        if (seenUrls.has(postUrl)) continue;

        // Extract content
        const title = hit.title || "";
        const text = hit.comment_text || "";
        const content = `${title}\n${text}`.trim();

        if (!content || content.length < 15) continue;

        const engagement = hit.points || hit.story_points || 1;

        // Parse timestamp
        const createdAtStr = hit.created_at;
        let postedAt = new Date().toISOString();
        if (createdAtStr) {
          try {
            postedAt = new Date(createdAtStr).toISOString();
          } catch {}
        }

        seenUrls.add(postUrl);
        allRows.push({
          platform: 'hackernews',
          url: postUrl,
          content,
          engagement: Number(engagement),
          posted_at: postedAt
        });
      }
    } catch (e) {
      console.error(`hn_collector: Search failed for keyword ${keyword}:`, e);
    }
  }

  console.log(`hn_collector: collected ${allRows.length} unique Hacker News posts.`);
  return allRows;
}
