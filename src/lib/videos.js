// Video Fetcher — build-time YouTube fetch + on-disk cache, with a synchronous
// cache read for render time.
//
//  - fetchVideosForTopic(query, max): hits the YouTube Data API v3 (build only).
//  - buildVideoCache(): iterates topics, fetches missing/stale entries, writes
//    src/content/.cache/videos.json (cache-first).
//  - getVideosForTopic(topicId): synchronous cache read, NO network.
//
// The API key is read server-side only and never shipped to the browser. On any
// error, quota exhaustion, or missing key, the fetcher falls back to the
// existing cache or an empty list so the build always succeeds.

import fs from 'node:fs';
import path from 'node:path';

import { getAllConceptPaths, getConcept, getLanguageMeta } from '@/lib/content';

const CACHE_DIR = path.join(process.cwd(), 'src', 'content', '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'videos.json');
const STALE_MS = 1000 * 60 * 60 * 24 * 30; // 30 days
const VIDEO_ID_RE = /^[A-Za-z0-9_-]{11}$/;

/** Read the whole cache object ({ [topicId]: { fetchedAt, videos } }). */
function readCache() {
  try {
    const raw = fs.readFileSync(CACHE_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeCache(cache) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
}

/** Map a raw YouTube search item to a VideoRef (no statistics yet). */
function mapItem(item) {
  const videoId = item?.id?.videoId;
  const sn = item?.snippet || {};
  if (!videoId || !VIDEO_ID_RE.test(videoId)) return null;
  return {
    videoId,
    title: sn.title || '',
    channel: sn.channelTitle || undefined,
    thumbnail: sn.thumbnails?.high?.url || sn.thumbnails?.default?.url,
    publishedAt: sn.publishedAt,
    description: sn.description,
  };
}

/** YouTube Data API caps `maxResults` at 50 per request. */
const YT_MAX_RESULTS = 50;

/**
 * Look up statistics (view/like counts) for a batch of video ids via the
 * `videos.list` endpoint. Returns a Map of videoId -> { views, likes }.
 * @param {string[]} ids
 * @param {string} key
 * @returns {Promise<Map<string, { views: number, likes: number }>>}
 */
async function fetchVideoStats(ids, key) {
  const stats = new Map();
  if (!ids.length) return stats;

  const url = new URL('https://www.googleapis.com/youtube/v3/videos');
  url.searchParams.set('part', 'statistics');
  url.searchParams.set('id', ids.join(','));
  url.searchParams.set('maxResults', String(YT_MAX_RESULTS));
  url.searchParams.set('key', key);

  try {
    const res = await fetch(url.toString());
    if (!res.ok) return stats;
    const data = await res.json();
    for (const item of data.items || []) {
      const s = item?.statistics || {};
      stats.set(item.id, {
        views: Number(s.viewCount) || 0,
        likes: Number(s.likeCount) || 0,
      });
    }
  } catch {
    /* fall through — missing stats sort last */
  }
  return stats;
}

/**
 * Fetch related English-language videos from YouTube, ranked by popularity
 * (view count, then like count). Build-time only.
 *
 * Strategy: search ordered by `viewCount` (English), then enrich the results
 * with real statistics and sort by views desc, likes desc. Returns up to
 * `max` VideoRefs (each carrying `views`/`likes`).
 *
 * @param {string} query
 * @param {number} [max=YT_MAX_RESULTS]
 * @returns {Promise<Array>}
 */
export async function fetchVideosForTopic(query, max = YT_MAX_RESULTS) {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return [];

  const capped = Math.min(Math.max(1, max), YT_MAX_RESULTS);

  const url = new URL('https://www.googleapis.com/youtube/v3/search');
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('type', 'video');
  url.searchParams.set('maxResults', String(YT_MAX_RESULTS));
  url.searchParams.set('q', query);
  // English-language results, ordered by popularity.
  url.searchParams.set('relevanceLanguage', 'en');
  url.searchParams.set('order', 'viewCount');
  url.searchParams.set('key', key);

  try {
    const res = await fetch(url.toString());
    if (!res.ok) return [];
    const data = await res.json();
    const items = (data.items || []).map(mapItem).filter(Boolean);
    if (!items.length) return [];

    // Enrich with real view/like counts and rank by highest views, then likes.
    const stats = await fetchVideoStats(
      items.map((v) => v.videoId),
      key
    );
    const enriched = items.map((v) => {
      const s = stats.get(v.videoId) || { views: 0, likes: 0 };
      return { ...v, views: s.views, likes: s.likes };
    });
    enriched.sort((a, b) => b.views - a.views || b.likes - a.likes);
    return enriched.slice(0, capped);
  } catch {
    return [];
  }
}

/**
 * Build/refresh the video cache for every topic. Cache-first: only re-fetches
 * topics that are missing or stale. Falls back to the existing cache on error.
 * @returns {Promise<void>}
 */
export async function buildVideoCache({ force = false } = {}) {
  // Always start from the existing cache so a failed/quota-limited fetch never
  // destroys good data. `force` re-fetches even fresh entries, but the result
  // only replaces a topic when the fetch actually returns videos.
  const cache = readCache();
  const now = Date.now();

  for (const { language, slug } of getAllConceptPaths()) {
    const node = getConcept(language, slug);
    if (!node) continue;
    // Hand-authored videos take precedence and need no fetch.
    if (Array.isArray(node.videos) && node.videos.length) continue;

    const topicId = node.id;
    const existing = cache[topicId];
    const fresh =
      !force &&
      existing &&
      typeof existing.fetchedAt === 'number' &&
      now - existing.fetchedAt < STALE_MS;
    if (fresh) continue;

    const meta = getLanguageMeta(language);
    const query = `${meta?.label || language} ${node.title} tutorial`;
    const videos = await fetchVideosForTopic(query, YT_MAX_RESULTS);

    // Only overwrite when we actually got results; a quota/error fetch returns
    // [] and must not wipe an existing entry.
    if (videos.length) {
      cache[topicId] = { fetchedAt: now, videos };
    } else if (!existing) {
      cache[topicId] = { fetchedAt: now, videos: [] };
    }
  }

  try {
    writeCache(cache);
  } catch {
    // Non-fatal — render falls back to empty lists.
  }
}

/**
 * Synchronous cache read for render time. Validates video ids and caps at 3.
 * @param {string} topicId
 * @returns {Array}
 */
export function getVideosForTopic(topicId) {
  const cache = readCache();
  const entry = cache[topicId];
  if (!entry || !Array.isArray(entry.videos)) return [];
  return entry.videos
    .filter((v) => v && VIDEO_ID_RE.test(v.videoId) && v.title)
    .slice(0, 3);
}
