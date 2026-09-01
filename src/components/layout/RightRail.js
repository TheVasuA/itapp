// RightRail — "points to remember" / quick navigation rail shown on wide
// viewports. Server component, purely presentational.
//
// Accepts a `concepts` array (the concept node's concepts) and extracts key
// points to display as a summary rail. Also accepts a flat `items` array
// for generic quick-nav anchor links (headings, sections, etc.).
//
// Requirement 23.1 — no page-level horizontal overflow; this rail is hidden
// below xl and has a fixed width.

/**
 * Truncate a note string to a given max length, adding ellipsis if needed.
 */
function truncate(str, max = 80) {
  if (!str) return '';
  const cleaned = str.replace(/`[^`]*`/g, (m) => m.slice(1, -1));
  if (cleaned.length <= max) return cleaned;
  return cleaned.slice(0, max).trimEnd() + '…';
}

/**
 * Build rail items from a concept node's concepts array.
 * Each concept becomes a point-to-remember with its id and a short summary
 * derived from its note.
 */
function buildItemsFromConcepts(concepts) {
  if (!concepts || !concepts.length) return [];
  return concepts.map((c, i) => ({
    id: c.id || `concept-${i}`,
    title: truncate(c.note, 60) || `Point ${i + 1}`,
  }));
}

export default function RightRail({ concepts, items }) {
  // Derive items from concepts if explicit items aren't provided
  const railItems = items && items.length > 0
    ? items
    : buildItemsFromConcepts(concepts);

  if (!railItems.length) return null;

  return (
    <>
      {/* Desktop: sticky sidebar rail */}
      <aside
        className="hidden w-56 shrink-0 xl:block"
        aria-label="Points to remember"
      >
        <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Points to remember
          </h2>
          <ul className="space-y-1.5 border-l border-border pl-3 text-sm">
            {railItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="block rounded px-2 py-1 leading-snug text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Mobile/Tablet: inline section below content */}
      <section
        className="mt-8 rounded-md border border-border p-4 xl:hidden"
        aria-label="Points to remember"
      >
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Points to remember
        </h2>
        <ul className="space-y-2 text-sm">
          {railItems.map((item) => (
            <li key={item.id} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              <span className="text-foreground">{item.title}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
