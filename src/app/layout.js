// Root layout — document shell, SEO metadata base, responsive viewport, the
// Redux store provider, the no-flash theme script, global font, and navigation.

import '@/app/globals.css';

import { Inter } from 'next/font/google';
import StoreProvider from '@/store/StoreProvider';
import NavbarWrapper from '@/components/layout/NavbarWrapper';
import Footer from '@/components/layout/Footer';
import AuthProvider from '@/components/auth/AuthProvider';
import SignInModal from '@/components/auth/SignInModal';
import { siteUrl, SITE_NAME } from '@/lib/seo';

// ---------------------------------------------------------------------------
// Font — Inter via next/font/google (Req 23.6, good baseline for UI)
// ---------------------------------------------------------------------------
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// ---------------------------------------------------------------------------
// Metadata (Req 11.5) — title template + metadataBase from production domain
// ---------------------------------------------------------------------------
export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} — Learn Programming & Databases Free`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Free, structured tutorials for programming and database/query languages, with copy-first code blocks, real-world projects, and system-design diagrams.',
  applicationName: SITE_NAME,
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: '/',
    languages: { en: '/', 'x-default': '/' },
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/favicon.ico',
  },
};

// ---------------------------------------------------------------------------
// Viewport (Req 23.6) — width=device-width, initial-scale=1
// ---------------------------------------------------------------------------
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

// ---------------------------------------------------------------------------
// No-flash theme script — runs before first paint (Req 21.2)
// ---------------------------------------------------------------------------
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var mode = stored || 'system';
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = mode === 'dark' || (mode === 'system' && systemDark);
    document.documentElement.classList.toggle('dark', isDark);
  } catch (e) {}
})();
`;

// ---------------------------------------------------------------------------
// Root Layout
// ---------------------------------------------------------------------------
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen overflow-x-hidden bg-background text-foreground font-sans antialiased">
        <StoreProvider>
          <AuthProvider>
            {/* Navigation — top bar with language links + projects link */}
            <NavbarWrapper />

            <main className="flex-1">{children}</main>

            <Footer />

            {/* Google sign-in dialog (opened from the sidebar) */}
            <SignInModal />
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
