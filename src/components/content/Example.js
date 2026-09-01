// Example — the optional worked example rendered last in a ConceptBlock.
//
// Re-uses CodeBlock so the example shares the dark surface + copy affordance,
// preceded by a small "Example" label.

import CodeBlock from './CodeBlock';

export default function Example({ code, lang, blockId }) {
  return (
    <div className="my-3">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Example
      </p>
      <CodeBlock code={code} lang={lang} blockId={blockId} />
    </div>
  );
}
