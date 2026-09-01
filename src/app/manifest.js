// Web App Manifest — improves mobile/PWA signals and install metadata.
// Served at /manifest.webmanifest by Next.js App Router.

import { SITE_NAME } from '@/lib/seo';

export default function manifest() {
  return {
    name: `${SITE_NAME} — Learn Programming & Databases`,
    short_name: 'DevLearn',
    description:
      'Free, structured tutorials for programming and database/query languages with copy-first code examples.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#16a34a',
    lang: 'en',
    categories: ['education', 'developer', 'productivity'],
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
