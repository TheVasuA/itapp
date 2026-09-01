#!/usr/bin/env node
// One-off DEMO seeder: injects a few real, popular YouTube videos into the
// cache for a handful of FREE (unlocked) topics so you can preview the video
// feature without spending YouTube API quota. Safe to re-run; only touches the
// listed topic ids and never removes other entries.
//
// Usage: node scripts/seed-demo-videos.js
//
// NOTE: These are real, well-known educational videos chosen for stability.
// Replace them anytime by running `npm run fetch:videos` once quota resets.

const fs = require('fs');
const path = require('path');

const CACHE_FILE = path.join(process.cwd(), 'src', 'content', '.cache', 'videos.json');

const now = Date.now();
const v = (videoId, title, channel) => ({
  videoId,
  title,
  channel,
  thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  publishedAt: '2023-01-01T00:00:00Z',
  description: title,
});

// topicId -> up to 3 videos. Topic ids come from the content trees.
const DEMO = {
  // JavaScript (free, unlocked)
  'js-fundamentals': [
    v('lkIFF4maKMU', 'Learn JavaScript - Full Course for Beginners', 'freeCodeCamp.org'),
    v('W6NZfCO5SIk', 'JavaScript Tutorial for Beginners', 'Programming with Mosh'),
    v('PkZNo7MFNFg', 'Learn JavaScript in 1 Hour', 'freeCodeCamp.org'),
  ],
  'js-variables': [
    v('9WIJQDvt4Us', 'JavaScript Variables (let, const, var)', 'Programming with Mosh'),
    v('edlFjlzxkSI', 'let vs const vs var in JavaScript', 'Web Dev Simplified'),
  ],
  'js-data-types': [
    v('864Jol9icHU', 'JavaScript Data Types Explained', 'Web Dev Simplified'),
    v('AILhufU5rH8', 'JavaScript Type Coercion', 'Fireship'),
  ],
  'js-functions': [
    v('N8ap4k_1QEQ', 'JavaScript Functions Explained', 'Web Dev Simplified'),
    v('gigtS_5KOqo', 'Arrow Functions in JavaScript', 'Web Dev Simplified'),
  ],
  // Python (free, unlocked)
  'py-fundamentals': [
    v('rfscVS0vtbw', 'Learn Python - Full Course for Beginners', 'freeCodeCamp.org'),
    v('_uQrJ0TkZlc', 'Python Tutorial for Beginners', 'Programming with Mosh'),
    v('kqtD5dpn9C8', 'Python for Beginners', 'Programming with Mosh'),
  ],
  'py-variables': [
    v('cQT33yu9pY8', 'Python Variables and Data Types', 'Programming with Mosh'),
    v('ppsCLuScQMk', 'Python Variables Explained', 'Corey Schafer'),
  ],
};

function main() {
  let cache = {};
  try {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  } catch {
    cache = {};
  }

  let seeded = 0;
  for (const [topicId, videos] of Object.entries(DEMO)) {
    cache[topicId] = { fetchedAt: now, videos };
    seeded += videos.length;
  }

  fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
  console.log(
    `[seed] Seeded ${seeded} demo videos across ${Object.keys(DEMO).length} topics.`
  );
  console.log('[seed] Preview these pages:');
  console.log('  /javascript/fundamentals');
  console.log('  /javascript/fundamentals/variables');
  console.log('  /javascript/fundamentals/data-types');
  console.log('  /python/fundamentals');
  console.log('  /python/fundamentals/variables');
}

main();
