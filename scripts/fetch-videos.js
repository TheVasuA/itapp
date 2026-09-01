#!/usr/bin/env node
// Build-time script: fetches YouTube videos for all topics and writes
// the cache to src/content/.cache/videos.json.
//
// Usage: node scripts/fetch-videos.js   (or `npm run fetch:videos`)
//
// Requires YOUTUBE_API_KEY in the environment. Falls back gracefully when
// the key is missing — existing cache is preserved and the script exits 0.

const fs = require('fs');
const path = require('path');
const jiti = require('jiti');

// Minimal .env loader (no dependency). Loads KEY=VALUE lines into process.env
// without overwriting variables already set in the environment.
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');
  let raw;
  try {
    raw = fs.readFileSync(envPath, 'utf8');
  } catch {
    return;
  }
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    // Strip surrounding quotes if present.
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key && !(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnv();

// Create a jiti instance that resolves @/ to src/ (mirrors jsconfig paths)
const load = jiti(__filename, {
  alias: {
    '@/': path.join(process.cwd(), 'src') + '/',
  },
  interopDefault: false,
});

async function main() {
  if (!process.env.YOUTUBE_API_KEY) {
    console.log(
      '[fetch:videos] YOUTUBE_API_KEY not set — skipping fetch, using existing cache.'
    );
    process.exit(0);
  }

  const force = process.argv.includes('--force') || process.argv.includes('-f');
  console.log(
    `[fetch:videos] Building video cache${force ? ' (force refresh — replacing all cached videos)' : ''}…`
  );
  const { buildVideoCache } = load(path.join(process.cwd(), 'src', 'lib', 'videos.js'));
  await buildVideoCache({ force });
  console.log('[fetch:videos] Done.');
}

main().catch((err) => {
  // Non-fatal: the build should still succeed even if video fetching fails.
  console.error('[fetch:videos] Error (non-fatal):', err.message || err);
  process.exit(0);
});
