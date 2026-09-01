// ConceptBlock — renders a single Concept in the fixed order:
//   code  ->  note  ->  example (rendered last, only when defined)
//
// This ordering is a core correctness property (Requirement 5), so the JSX
// order here is deliberate and must not change.

import CodeBlock from './CodeBlock';
import Notes from './Notes';
import Example from './Example';
import Explanation from './Explanation';

export default function ConceptBlock({ concept }) {
  if (!concept) return null;

  return (
    <section className="my-6">
      <CodeBlock
        code={concept.code}
        lang={concept.lang}
        blockId={concept.id ? `${concept.id}-code` : undefined}
      />
      <Notes>{concept.note}</Notes>
      {concept.explanation ? (
        <Explanation explanation={concept.explanation} />
      ) : null}
      {concept.example ? (
        <Example
          code={concept.example}
          lang={concept.lang}
          blockId={concept.id ? `${concept.id}-example` : undefined}
        />
      ) : null}
    </section>
  );
}
