"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectRedditPosts = exports.collectPhPosts = exports.collectHnPosts = void 0;
exports.collectPosts = collectPosts;
const hackernews_1 = require("./hackernews");
const producthunt_1 = require("./producthunt");
const reddit_1 = require("./reddit");
async function collectPosts(keywords) {
    console.log("reddit_collector: starting parallel aggregation for platforms (Reddit, HN, PH)");
    // Run all collectors in parallel and ignore total failures (empty array on error)
    const results = await Promise.allSettled([
        (0, reddit_1.collectRedditPosts)(keywords),
        (0, hackernews_1.collectHnPosts)(keywords),
        (0, producthunt_1.collectPhPosts)(keywords),
    ]);
    const allRows = [];
    const seenUrls = new Set();
    const platformsCount = { reddit: 0, hackernews: 0, producthunt: 0 };
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
        }
        else {
            console.error("reddit_collector: a source collector failed during execution:", res.reason);
        }
    }
    console.log(`reddit_collector: aggregated ${allRows.length} unique sources. Breakdown: ${JSON.stringify(platformsCount)}`);
    return allRows;
}
var hackernews_2 = require("./hackernews");
Object.defineProperty(exports, "collectHnPosts", { enumerable: true, get: function () { return hackernews_2.collectHnPosts; } });
var producthunt_2 = require("./producthunt");
Object.defineProperty(exports, "collectPhPosts", { enumerable: true, get: function () { return producthunt_2.collectPhPosts; } });
var reddit_2 = require("./reddit");
Object.defineProperty(exports, "collectRedditPosts", { enumerable: true, get: function () { return reddit_2.collectRedditPosts; } });
