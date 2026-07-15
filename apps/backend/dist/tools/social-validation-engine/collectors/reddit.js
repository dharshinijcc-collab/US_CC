"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectRedditPosts = collectRedditPosts;
const config_1 = require("../config");
const TARGET_SUBREDDITS = [
    "startups",
    "Entrepreneur",
    "SaaS",
    "smallbusiness",
    "productmanagement",
    "indiehackers",
    "webdev",
    "apps",
];
async function getRedditAccessToken() {
    const clientId = process.env.REDDIT_CLIENT_ID || '';
    const clientSecret = process.env.REDDIT_CLIENT_SECRET || '';
    if (!clientId || !clientSecret || clientId.toLowerCase().includes('your_') || clientId.toLowerCase().includes('placeholder')) {
        return null;
    }
    try {
        const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        const response = await fetch('https://www.reddit.com/api/v1/access_token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': process.env.REDDIT_USER_AGENT || 'sve-agent/0.1.0'
            },
            body: 'grant_type=client_credentials'
        });
        if (!response.ok) {
            console.warn(`reddit_collector: Token fetch returned status ${response.status}`);
            return null;
        }
        const data = await response.json();
        return data.access_token || null;
    }
    catch (err) {
        console.error('reddit_collector: Token fetch error:', err);
        return null;
    }
}
async function searchSubreddit(accessToken, keyword, subreddit, limit) {
    const results = [];
    const userAgent = process.env.REDDIT_USER_AGENT || 'sve-agent/0.1.0';
    try {
        const searchUrl = `https://oauth.reddit.com/r/${subreddit}/search.json?q=${encodeURIComponent(keyword)}&sort=relevance&t=year&limit=${limit}`;
        const response = await fetch(searchUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'User-Agent': userAgent
            }
        });
        if (!response.ok) {
            console.warn(`reddit_collector: Search returned status ${response.status} for subreddit r/${subreddit}`);
            return [];
        }
        const resData = await response.json();
        const children = resData.data?.children || [];
        for (const child of children) {
            const submission = child.data;
            if (!submission)
                continue;
            if (submission.score < config_1.SETTINGS.redditMinEngagement)
                continue;
            const postUrl = `https://reddit.com${submission.permalink}`;
            results.push({
                platform: 'reddit',
                url: postUrl,
                content: submission.selftext || submission.title,
                engagement: Number(submission.score),
                posted_at: new Date(submission.created_utc * 1000).toISOString()
            });
            // Fetch top comments for this post if comment limit is set and post has comments
            if (config_1.SETTINGS.redditTopCommentsLimit > 0 && submission.num_comments > 0) {
                try {
                    const commentsUrl = `https://oauth.reddit.com/comments/${submission.id}.json?limit=${config_1.SETTINGS.redditTopCommentsLimit}&depth=1`;
                    const commentsResponse = await fetch(commentsUrl, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'User-Agent': userAgent
                        }
                    });
                    if (commentsResponse.ok) {
                        const commentsData = await commentsResponse.json();
                        // Reddit comments response is a list of two listings: [postListing, commentsListing]
                        const commentsChildren = commentsData[1]?.data?.children || [];
                        for (const commentChild of commentsChildren.slice(0, config_1.SETTINGS.redditTopCommentsLimit)) {
                            const comment = commentChild.data;
                            if (comment && comment.body && comment.score >= config_1.SETTINGS.redditMinEngagement) {
                                results.push({
                                    platform: 'reddit',
                                    url: postUrl,
                                    content: comment.body,
                                    engagement: Number(comment.score),
                                    posted_at: new Date(comment.created_utc * 1000).toISOString()
                                });
                            }
                        }
                    }
                }
                catch (commErr) {
                    console.warn(`reddit_collector: Failed to fetch comments for post ${submission.id}:`, commErr);
                }
            }
        }
    }
    catch (err) {
        console.error(`reddit_collector: Subreddit r/${subreddit} search failed:`, err);
    }
    return results;
}
async function collectRedditPosts(keywords) {
    const token = await getRedditAccessToken();
    if (!token) {
        console.log("reddit_collector: Reddit credentials not configured. Skipping Reddit collection.");
        return [];
    }
    console.log(`reddit_collector: starting search for keywords: ${JSON.stringify(keywords)}`);
    const allRows = [];
    const seenUrls = new Set();
    // Run all subreddit searches in parallel
    const searchPromises = [];
    for (const keyword of keywords.slice(0, 3)) {
        for (const subreddit of TARGET_SUBREDDITS) {
            searchPromises.push(searchSubreddit(token, keyword, subreddit, config_1.SETTINGS.redditPostsPerKeyword));
        }
    }
    const results = await Promise.all(searchPromises);
    for (const list of results) {
        for (const row of list) {
            if (row.url && !seenUrls.has(row.url)) {
                seenUrls.add(row.url);
                allRows.push(row);
            }
        }
    }
    console.log(`reddit_collector: collected ${allRows.length} unique Reddit posts.`);
    return allRows;
}
