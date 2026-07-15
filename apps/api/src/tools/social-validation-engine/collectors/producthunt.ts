import { SourceRow } from '../models/types';

export async function collectPhPosts(keywords: string[]): Promise<Partial<SourceRow>[]> {
  const apiKey = process.env.PRODUCTHUNT_API_KEY || '';
  if (!apiKey || apiKey.toLowerCase().includes('your_') || apiKey.toLowerCase().includes('placeholder')) {
    console.log("ph_collector: PRODUCTHUNT_API_KEY is not configured. Skipping Product Hunt collection.");
    return [];
  }

  console.log(`ph_collector: searching Product Hunt API for keywords: ${JSON.stringify(keywords)}`);
  const allRows: Partial<SourceRow>[] = [];
  const seenUrls = new Set<string>();

  const url = "https://api.producthunt.com/v2/api/graphql";
  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  };

  const query = `
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
  `;

  for (const keyword of keywords.slice(0, 3)) { // Cap keywords to avoid rate limits
    try {
      const variables = { query: keyword };
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables })
      });

      if (!response.ok) {
        console.warn(`ph_collector: API returned status ${response.status} for query ${keyword}`);
        continue;
      }

      const resData = await response.json() as any;
      if (resData.errors) {
        console.warn(`ph_collector: GraphQL errors for query ${keyword}:`, resData.errors);
        continue;
      }

      const postsEdges = resData.data?.posts?.edges || [];
      for (const edge of postsEdges) {
        const node = edge.node || {};
        const postUrl = node.url;
        if (!postUrl || seenUrls.has(postUrl)) continue;

        // 1. Add the main post as a source
        const name = node.name || "";
        const tagline = node.tagline || "";
        const desc = node.description || "";
        const content = `${name} - ${tagline}\n${desc}`.trim();
        
        if (content && content.length >= 15) {
          seenUrls.add(postUrl);
          allRows.push({
            platform: "producthunt",
            url: postUrl,
            content,
            engagement: Number(node.votesCount || 1),
            posted_at: node.createdAt || new Date().toISOString()
          });
        }

        // 2. Add comments as separate sources
        const commentsEdges = node.comments?.edges || [];
        for (const cEdge of commentsEdges) {
          const cNode = cEdge.node || {};
          const cBody = cNode.body;
          if (!cBody || cBody.length < 15) continue;
          
          const cId = cNode.id;
          const cUrl = cId ? `${postUrl}#comment-${cId}` : postUrl;
          if (seenUrls.has(cUrl)) continue;
              
          seenUrls.add(cUrl);
          allRows.push({
            platform: "producthunt",
            url: cUrl,
            content: cBody,
            engagement: Number(cNode.votesCount || 1),
            posted_at: cNode.createdAt || new Date().toISOString()
          });
        }
      }
    } catch (e) {
      console.error(`ph_collector: Search failed for keyword ${keyword}:`, e);
    }
  }

  console.log(`ph_collector: collected ${allRows.length} unique Product Hunt mentions.`);
  return allRows;
}
