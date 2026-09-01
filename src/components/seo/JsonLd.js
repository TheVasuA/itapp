// JsonLd — emits one or more JSON-LD blobs as <script type="application/ld+json">.
//
// Accepts a single object or an array. Server-renderable (no client JS).

export default function JsonLd({ data }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.filter(Boolean).map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          // JSON-LD content is build-time, derived from trusted content data.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
