/** @type {import('next').NextConfig} */

// Resolve the canonical site URL from the environment so that `metadataBase`,
// canonical URLs, sitemap entries, and Open Graph/Twitter images all resolve to
// absolute URLs in every environment (local, preview, production).
//
// Priority:
//   1. NEXT_PUBLIC_SITE_URL  — explicit, browser-safe canonical origin.
//   2. SITE_URL              — server/build-only override.
//   3. VERCEL_URL            — auto-provided on Vercel preview/prod (host only).
//   4. http://localhost:3000 — local development fallback.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
  'http://localhost:3000';

// Security headers applied to every route. CSP is intentionally conservative
// while still permitting Next.js inline runtime, the theming no-flash script,
// JSON-LD, and the privacy-friendly youtube-nocookie video embeds.
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const nextConfig = {
  reactStrictMode: true,

  // Expose the resolved canonical origin to both server and client code so the
  // SEO builders (lib/seo.js) can construct `metadataBase` consistently.
  env: {
    NEXT_PUBLIC_SITE_URL: siteUrl,
  },

  async headers() {
    return [
      {
        // Security headers on all routes.
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        // Long-lived immutable caching for Next.js build output (hashed assets).
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache static media served from /public (icons, OG images, fonts).
        source: '/og/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
