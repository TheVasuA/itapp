// NavbarWrapper — server component that resolves language data grouped by
// category from the content registry and passes it to the client Navbar/MegaMenu.

import { getLanguages, getLanguageMeta, getCategories, getLanguagesByCategory } from '@/lib/content';
import Navbar from './Navbar';

/** Shorter labels for the top nav bar (categories with long names). */
const NAV_LABELS = {
  'frontend': 'Frontend',
  'backend': 'Backend',
  'mobile': 'Mobile',
  'systems': 'Systems',
  'scripting': 'Scripting',
  'data': 'Data',
  'database-sql': 'SQL',
  'database-nosql': 'NoSQL',
};

export default function NavbarWrapper() {
  const categories = getCategories();
  const languagesByCategory = getLanguagesByCategory();

  // Build the menu data structure: array of { key, label, navLabel, languages: [{key, label}] }
  const menuData = categories
    .filter((cat) => languagesByCategory[cat.key]?.length > 0)
    .map((cat) => ({
      key: cat.key,
      label: cat.label,
      navLabel: NAV_LABELS[cat.key] || cat.label,
      languages: languagesByCategory[cat.key].map((meta) => ({
        key: meta.key,
        label: meta.label,
        tagline: meta.tagline,
        color: meta.color,
      })),
    }));

  return <Navbar menuData={menuData} />;
}
