// TypeScript topic tree.
//
// Each node is a ConceptNode: { id, title, level, slug?, concepts[], children[] }.
// Routable nodes carry a `slug`. Every Concept renders in the fixed order
// code -> note -> example (example optional).

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  // ─── 1. Type Annotations & Inference ───────────────────────────────────
  {
    id: 'ts-annotations',
    title: 'Type Annotations & Inference',
    level: 1,
    slug: 'annotations',
    concepts: [],
    children: [
      {
        id: 'ts-annotations-explicit',
        title: 'Explicit Annotations',
        level: 2,
        slug: 'explicit-annotations',
        concepts: [
          {
            id: 'ts-annotations-variables',
            code: "let name: string = 'Alice';\nlet age: number = 30;\nlet active: boolean = true;\nlet scores: number[] = [95, 87, 91];",
            note: 'Type annotations are placed after the variable name with a colon. They tell the compiler the exact type a binding may hold.',
            explanation: {
              heading: 'Writing explicit type annotations',
              intro: 'An explicit annotation is a colon plus a type written right after a name. It pins down exactly what a variable, parameter, or return value is allowed to hold, and the compiler enforces that contract on every later assignment.',
              points: [
                { term: 'Syntax', detail: 'The pattern is name: Type. It works on variables, function parameters, and return positions the same way.' },
                { term: 'When to be explicit', detail: 'Annotate function parameters, public APIs, and any binding whose type is not obvious from its initializer, since those are the spots where mistakes slip in.' },
                { term: 'The compiler enforces it', detail: 'Once a variable is annotated as string, assigning a number to it later is a compile error rather than a silent bug at runtime.' },
                { term: 'Do not over-annotate', detail: 'Annotating a value the compiler could infer just adds noise and can drift out of sync, so reach for annotations where they add clarity, not everywhere.' },
              ],
            },
            example: "const greeting: string = `Hello, ${name}`;",
          },
        ],
        children: [],
      },
      {
        id: 'ts-annotations-inference',
        title: 'Type Inference',
        level: 2,
        slug: 'type-inference',
        concepts: [
          {
            id: 'ts-inference-basic',
            code: "let city = 'Tokyo';    // inferred as string\nlet count = 42;        // inferred as number\nlet items = [1, 2, 3]; // inferred as number[]",
            note: 'TypeScript infers types from initializers. Explicit annotations are optional when the compiler can determine the type automatically.',
            explanation: {
              heading: 'How type inference works',
              intro: 'When you initialize a value, TypeScript studies the right-hand side and gives the binding the most useful type it can. This lets you write code that reads almost like plain JavaScript while still getting full type safety.',
              points: [
                { term: 'Contextual typing', detail: 'The surrounding context can supply types too, such as a callback parameter whose type comes from the function it is passed to.' },
                { term: 'Widening', detail: 'A let binding initialized with a literal widens to the general type, so let x = 3 becomes number, while const x = 3 keeps the literal type 3.' },
                { term: 'Return types are inferred', detail: 'A function without a return annotation gets its return type computed from the code inside it, which stays accurate as you refactor.' },
                { term: 'When to still annotate', detail: 'Add an explicit type when inference would be too wide or when you want an error at the definition rather than far away at the call site.' },
              ],
            },
            example: "const double = (n: number) => n * 2; // return type inferred as number",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 2. Primitive Types ─────────────────────────────────────────────────
  {
    id: 'ts-primitives',
    title: 'Primitive Types',
    level: 1,
    slug: 'primitives',
    concepts: [],
    children: [
      {
        id: 'ts-primitives-core',
        title: 'Core Primitives',
        level: 2,
        slug: 'core-primitives',
        concepts: [
          {
            id: 'ts-prim-core',
            code: "let s: string = 'hello';\nlet n: number = 3.14;\nlet b: boolean = false;\nlet big: bigint = 100n;\nlet sym: symbol = Symbol('id');",
            note: 'TypeScript has seven primitive types: string, number, boolean, bigint, symbol, undefined, and null. They mirror the JavaScript runtime primitives.',
            explanation: {
              heading: 'The core primitive types',
              intro: 'Primitives are the simplest values in the language and each maps directly to a JavaScript runtime primitive. Knowing them well is the foundation for every richer type you will build later.',
              points: [
                { term: 'Lowercase names', detail: 'Use the lowercase string, number, and boolean. The capitalized String, Number, and Boolean refer to wrapper object types and should be avoided.' },
                { term: 'One number type', detail: 'All numbers are floating point under the type number, while bigint is separate and exists for integers beyond the safe integer range.' },
                { term: 'symbol for unique keys', detail: 'A symbol produces a guaranteed unique value, commonly used as a non-colliding object key or well-known protocol hook.' },
                { term: 'null and undefined', detail: 'Under strict null checks these are distinct types you must handle explicitly, which prevents a large class of missing-value bugs.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'ts-primitives-special',
        title: 'Special Types: any, unknown, never, void',
        level: 2,
        slug: 'special-types',
        concepts: [
          {
            id: 'ts-prim-special',
            code: "let anything: any = 'oops';     // disables type checking\nlet safe: unknown = getData();  // must narrow before use\nfunction fail(): never { throw new Error('boom'); }\nfunction log(msg: string): void { console.log(msg); }",
            note: '`unknown` is a type-safe counterpart to `any`. `never` represents values that never occur. `void` is for functions that return nothing.',
            explanation: {
              heading: 'The special top and bottom types',
              intro: 'Beyond ordinary values, TypeScript has a few special types that describe the edges of the type system: fully dynamic values, safely dynamic values, impossible values, and the absence of a return.',
              points: [
                { term: 'any turns checking off', detail: 'A value typed as any accepts and produces anything, which silently disables safety, so treat it as a last resort or migration aid.' },
                { term: 'unknown is the safe top type', detail: 'It can hold any value like any, but you must narrow it with a check before you are allowed to use it, keeping safety intact.' },
                { term: 'never is the bottom type', detail: 'It represents a value that can never occur, so it is the return type of a function that always throws or loops forever.' },
                { term: 'void means no useful return', detail: 'A void function may return undefined, and callers are expected to ignore whatever it returns.' },
                { term: 'Prefer unknown over any', detail: 'When you truly do not know a shape, reach for unknown so the compiler forces a check instead of letting bugs through.' },
              ],
            },
            example: "// unknown forces a check before use\nif (typeof safe === 'string') {\n  console.log(safe.toUpperCase());\n}",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 3. Union & Intersection Types ─────────────────────────────────────
  {
    id: 'ts-unions-intersections',
    title: 'Union & Intersection Types',
    level: 1,
    slug: 'unions-intersections',
    concepts: [],
    children: [
      {
        id: 'ts-union-types',
        title: 'Union Types',
        level: 2,
        slug: 'union-types',
        concepts: [
          {
            id: 'ts-union-basic',
            code: "type StringOrNumber = string | number;\n\nfunction format(value: StringOrNumber): string {\n  if (typeof value === 'string') return value.toUpperCase();\n  return value.toFixed(2);\n}",
            note: 'A union type (`A | B`) allows a value to be one of several types. You must narrow the type before using type-specific methods.',
            explanation: {
              heading: 'Working with union types',
              intro: 'A union describes a value that could be any one of several types at a given moment. It is one of the most common ways to model real data, such as an input that might be a string or a number.',
              points: [
                { term: 'Only shared members are usable', detail: 'Before narrowing, you can only touch members that exist on every branch of the union, which keeps type-specific calls safe.' },
                { term: 'Narrowing unlocks a branch', detail: 'A check like typeof value equals string tells the compiler which member you have, and inside that block the type is refined to just that branch.' },
                { term: 'Literal unions model states', detail: 'Unions of string literals are great for finite sets like a status of loading, success, or error.' },
                { term: 'Pitfall of missing branches', detail: 'If you forget to handle a branch the compiler will flag the unhandled case, especially when combined with exhaustiveness checks.' },
              ],
            },
            example: "type Status = 'loading' | 'success' | 'error';\nlet current: Status = 'loading';",
          },
        ],
        children: [],
      },
      {
        id: 'ts-intersection-types',
        title: 'Intersection Types',
        level: 2,
        slug: 'intersection-types',
        concepts: [
          {
            id: 'ts-intersection-basic',
            code: "type HasName = { name: string };\ntype HasAge = { age: number };\ntype Person = HasName & HasAge;\n\nconst p: Person = { name: 'Bob', age: 25 };",
            note: 'An intersection type (`A & B`) combines multiple types into one — the resulting type has ALL members of each constituent type.',
            explanation: {
              heading: 'Combining types with intersections',
              intro: 'An intersection merges several types so the result must satisfy all of them at once. It is the natural tool for composing small, focused shapes into a larger one.',
              points: [
                { term: 'All members are required', detail: 'A value of A & B must have every property from A and every property from B, unlike a union where it satisfies just one side.' },
                { term: 'Great for mixins', detail: 'Intersections let you layer capabilities, such as adding a createdAt field on top of any existing shape.' },
                { term: 'Conflicting members collapse', detail: 'If two sides declare the same property with incompatible types, the combined property becomes never, which is a common gotcha.' },
                { term: 'Union versus intersection', detail: 'Remember that union widens the set of allowed values while intersection narrows it, so they pull in opposite directions.' },
              ],
            },
            example: "type Timestamped<T> = T & { createdAt: Date };\ntype TimestampedPerson = Timestamped<Person>;",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 4. Type Aliases ───────────────────────────────────────────────────
  {
    id: 'ts-type-aliases',
    title: 'Type Aliases',
    level: 1,
    slug: 'type-aliases',
    concepts: [],
    children: [
      {
        id: 'ts-alias-object',
        title: 'Object Type Aliases',
        level: 2,
        slug: 'object-aliases',
        concepts: [
          {
            id: 'ts-alias-obj',
            code: "type Point = { x: number; y: number };\ntype Config = {\n  host: string;\n  port: number;\n  secure?: boolean;\n};",
            note: 'Type aliases create names for any type shape. Unlike interfaces, they can also represent primitives, unions, tuples, and mapped types.',
            explanation: {
              heading: 'Naming shapes with type aliases',
              intro: 'A type alias gives a reusable name to any type expression at all, from a simple object shape to a complex union. It is purely a compile-time label and produces no runtime code.',
              points: [
                { term: 'Aliases any type', detail: 'Unlike an interface, an alias can name primitives, unions, tuples, and function types, not just object shapes.' },
                { term: 'No declaration merging', detail: 'Declaring the same alias name twice is an error, whereas interfaces silently merge, so aliases are a bit more predictable.' },
                { term: 'Readability over duplication', detail: 'Give a meaningful name to a shape you use in several places so a change lands in one spot instead of many.' },
                { term: 'Interface versus alias', detail: 'Prefer an interface for public object contracts that may be extended, and reach for an alias when you need unions or other non-object types.' },
              ],
            },
            example: "type ID = string | number;\ntype Callback = (err: Error | null, data: unknown) => void;",
          },
        ],
        children: [],
      },
      {
        id: 'ts-alias-generic',
        title: 'Generic Type Aliases',
        level: 2,
        slug: 'generic-aliases',
        concepts: [
          {
            id: 'ts-alias-gen',
            code: "type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };\n\nconst success: Result<number> = { ok: true, value: 42 };\nconst failure: Result<number> = { ok: false, error: new Error('oops') };",
            note: 'Type aliases support generic parameters with optional defaults, enabling reusable type patterns across the codebase.',
            explanation: {
              heading: 'Parameterizing aliases with generics',
              intro: 'A generic type alias takes type parameters, letting one definition serve many concrete shapes. This is how reusable patterns like a result wrapper or a paginated response are expressed once and applied everywhere.',
              points: [
                { term: 'Type parameters', detail: 'The angle-bracket parameters act as placeholders that callers fill in, so Result of number and Result of string share one definition.' },
                { term: 'Default parameters', detail: 'A parameter can carry a default, such as an error type that falls back to Error, so callers only specify what they need.' },
                { term: 'Composes with unions', detail: 'Generic aliases pair naturally with discriminated unions to model success and failure branches in a single reusable type.' },
                { term: 'Keep constraints tight', detail: 'Add extends constraints when a parameter must have a certain shape, which gives better errors and editor hints at the call site.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 5. Interfaces ─────────────────────────────────────────────────────
  {
    id: 'ts-interfaces',
    title: 'Interfaces',
    level: 1,
    slug: 'interfaces',
    concepts: [],
    children: [
      {
        id: 'ts-interface-declare',
        title: 'Declaring & Extending Interfaces',
        level: 2,
        slug: 'declaring-interfaces',
        concepts: [
          {
            id: 'ts-iface-declare',
            code: "interface Animal {\n  name: string;\n  sound(): string;\n}\n\ninterface Dog extends Animal {\n  breed: string;\n}",
            note: 'Interfaces describe object contracts. They support extension via `extends` and can extend multiple interfaces simultaneously.',
            explanation: {
              heading: 'Declaring and extending interfaces',
              intro: 'An interface describes the shape an object must have. Extension lets you build larger contracts from smaller ones, mirroring how real-world entities specialize from more general ones.',
              points: [
                { term: 'Structural contract', detail: 'Any object that has the required members satisfies the interface, regardless of how it was declared, because TypeScript is structurally typed.' },
                { term: 'Single and multiple extension', detail: 'An interface can extend one or several parent interfaces, inheriting all of their members into the new contract.' },
                { term: 'Methods and properties', detail: 'Interfaces can describe both data properties and method signatures, so they capture behavior as well as shape.' },
                { term: 'Prefer for public APIs', detail: 'Interfaces give clearer error messages and support augmentation, making them the usual choice for exported object contracts.' },
              ],
            },
            example: "const rex: Dog = { name: 'Rex', breed: 'Labrador', sound: () => 'Woof' };",
          },
        ],
        children: [],
      },
      {
        id: 'ts-interface-merge',
        title: 'Declaration Merging',
        level: 2,
        slug: 'declaration-merging',
        concepts: [
          {
            id: 'ts-iface-merge',
            code: "interface Window {\n  appVersion: string;\n}\ninterface Window {\n  analytics: { track(event: string): void };\n}\n// Both declarations are merged into a single Window interface",
            note: 'Multiple interface declarations with the same name are automatically merged. This is useful for augmenting third-party types or global objects.',
            explanation: {
              heading: 'Understanding declaration merging',
              intro: 'When the same interface name is declared more than once in a scope, TypeScript combines every declaration into one. This is a deliberate feature that makes it possible to extend types you do not own.',
              points: [
                { term: 'Members combine', detail: 'All properties and methods from each declaration are unioned into a single interface as if you had written them together.' },
                { term: 'Augmenting globals', detail: 'You can add fields to built-in types like Window or to a third-party module by redeclaring its interface with your extra members.' },
                { term: 'Only interfaces merge', detail: 'Type aliases do not merge, so if you need this behavior you must use an interface rather than an alias.' },
                { term: 'Use it sparingly', detail: 'Merging can surprise readers who do not expect a type to be defined in several files, so document augmentations clearly.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 6. Functions ──────────────────────────────────────────────────────
  {
    id: 'ts-functions',
    title: 'Functions',
    level: 1,
    slug: 'functions',
    concepts: [],
    children: [
      {
        id: 'ts-func-signatures',
        title: 'Function Signatures & Parameters',
        level: 2,
        slug: 'function-signatures',
        concepts: [
          {
            id: 'ts-func-sig',
            code: "function add(a: number, b: number): number {\n  return a + b;\n}\n\nconst multiply = (a: number, b: number): number => a * b;\n\nfunction greet(name: string, greeting = 'Hello'): string {\n  return `${greeting}, ${name}`;\n}",
            note: 'Parameters and return types can be annotated explicitly. Default values also act as type annotations via inference.',
            explanation: {
              heading: 'Typing function signatures',
              intro: 'A function signature describes the types of the parameters and the return value. Getting these right is the single most valuable place to annotate, because a function is a contract many callers rely on.',
              points: [
                { term: 'Annotate parameters', detail: 'Parameters are rarely inferable on their own, so annotating them documents the contract and catches wrong arguments at the call site.' },
                { term: 'Return types are optional', detail: 'The return type is usually inferred, but writing it explicitly turns a mistake into an error at the definition rather than downstream.' },
                { term: 'Defaults imply types', detail: 'A default value lets the compiler infer the parameter type, so greeting equals Hello makes greeting a string automatically.' },
                { term: 'Function type aliases', detail: 'You can name a whole signature with a type alias and reuse it, which keeps related callbacks consistent.' },
              ],
            },
            example: "type MathOp = (a: number, b: number) => number;\nconst subtract: MathOp = (a, b) => a - b;",
          },
        ],
        children: [],
      },
      {
        id: 'ts-func-rest-optional',
        title: 'Optional & Rest Parameters',
        level: 2,
        slug: 'optional-rest-params',
        concepts: [
          {
            id: 'ts-func-rest',
            code: "function log(message: string, ...tags: string[]): void {\n  console.log(`[${tags.join(',')}]`, message);\n}\n\nfunction fetch(url: string, options?: RequestInit): Promise<Response> {\n  return globalThis.fetch(url, options);\n}",
            note: 'Optional parameters use `?` and must come after required ones. Rest parameters collect remaining arguments into a typed array.',
            explanation: {
              heading: 'Optional and rest parameters',
              intro: 'Real functions rarely take a fixed list of required arguments. Optional and rest parameters let a signature describe arguments that may be absent or that can appear any number of times.',
              points: [
                { term: 'Optional with a question mark', detail: 'Marking a parameter with a question mark makes its type include undefined, so you must handle the missing case inside the body.' },
                { term: 'Ordering rule', detail: 'Optional parameters must follow all required ones, because arguments are matched by position from the left.' },
                { term: 'Rest collects the tail', detail: 'A rest parameter gathers every remaining argument into a typed array, which is ideal for variadic helpers like logging.' },
                { term: 'Defaults versus optional', detail: 'A default value also makes an argument skippable but substitutes a concrete value instead of leaving it undefined.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 7. Generics ───────────────────────────────────────────────────────
  {
    id: 'ts-generics',
    title: 'Generics',
    level: 1,
    slug: 'generics',
    concepts: [],
    children: [
      {
        id: 'ts-generics-functions',
        title: 'Generic Functions',
        level: 2,
        slug: 'generic-functions',
        concepts: [
          {
            id: 'ts-gen-func',
            code: "function identity<T>(value: T): T {\n  return value;\n}\n\nfunction first<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\n\nconst num = identity(42);       // T inferred as number\nconst str = first(['a', 'b']); // T inferred as string",
            note: 'Generic type parameters let functions work with any type while preserving the relationship between input and output types.',
            explanation: {
              heading: 'Writing generic functions',
              intro: 'A generic function introduces a type variable that is filled in per call, letting one implementation work for many types while keeping the link between what goes in and what comes out.',
              points: [
                { term: 'Type variables', detail: 'The angle-bracket parameter, often named T, stands for whatever type the caller uses, and the same T flows through parameters and return value.' },
                { term: 'Inference at the call site', detail: 'You usually do not pass the type explicitly because the compiler infers it from the arguments you provide.' },
                { term: 'Preserves relationships', detail: 'Returning T instead of a fixed type means the caller gets back exactly what they passed in, not a widened any.' },
                { term: 'Avoid needless generics', detail: 'A type parameter used only once adds no safety, so introduce one only when two positions need to share a type.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'ts-generics-constraints',
        title: 'Constraints & Defaults',
        level: 2,
        slug: 'generic-constraints',
        concepts: [
          {
            id: 'ts-gen-constraint',
            code: "interface HasLength {\n  length: number;\n}\n\nfunction longest<T extends HasLength>(a: T, b: T): T {\n  return a.length >= b.length ? a : b;\n}\n\nlongest('hello', 'hi');   // works: string has length\nlongest([1,2,3], [1]);    // works: array has length",
            note: 'Use `extends` to constrain generic parameters. This ensures the type argument satisfies a minimum shape.',
            explanation: {
              heading: 'Constraints and default type parameters',
              intro: 'An unconstrained generic could be literally anything, which limits what you can do with it inside the function. Constraints require a minimum shape, and defaults supply a fallback when a caller omits the type.',
              points: [
                { term: 'The extends constraint', detail: 'Writing T extends HasLength guarantees every T has a length, so you can safely read that property in the body.' },
                { term: 'Better call-site errors', detail: 'A constraint rejects unsuitable arguments right where they are passed, giving a clear message instead of a confusing downstream one.' },
                { term: 'Default parameters', detail: 'A default like T equals string lets callers write the type without arguments while still allowing them to override it.' },
                { term: 'Balance flexibility and safety', detail: 'Constrain only as much as the body actually needs, since an overly tight constraint blocks valid uses.' },
              ],
            },
            example: "type Container<T = string> = { value: T };\nconst c: Container = { value: 'default' }; // T defaults to string",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 8. Utility Types ──────────────────────────────────────────────────
  {
    id: 'ts-utility-types',
    title: 'Utility Types',
    level: 1,
    slug: 'utility-types',
    concepts: [],
    children: [
      {
        id: 'ts-utility-partial-required',
        title: 'Partial, Required & Readonly',
        level: 2,
        slug: 'partial-required-readonly',
        concepts: [
          {
            id: 'ts-util-partial',
            code: "interface Todo {\n  title: string;\n  done: boolean;\n}\n\nfunction updateTodo(todo: Todo, patch: Partial<Todo>): Todo {\n  return { ...todo, ...patch };\n}\n\nconst locked: Readonly<Todo> = { title: 'Read', done: false };\n// locked.done = true; // Error: cannot assign to readonly",
            note: '`Partial<T>` makes all properties optional. `Required<T>` makes them all required. `Readonly<T>` prevents reassignment.',
            explanation: {
              heading: 'Partial, Required, and Readonly',
              intro: 'These built-in utility types transform an existing type by flipping property modifiers. They save you from hand-writing near-duplicate shapes for patches, guaranteed-complete objects, and immutable data.',
              points: [
                { term: 'Partial for updates', detail: 'Partial makes every property optional, which is perfect for a patch object that only carries the fields you want to change.' },
                { term: 'Required for completeness', detail: 'Required removes optionality from every property, useful after you have filled in defaults and want to guarantee nothing is missing.' },
                { term: 'Readonly for immutability', detail: 'Readonly forbids reassignment of properties at compile time, signaling that a value should not be mutated after creation.' },
                { term: 'Shallow by design', detail: 'These utilities only affect the top level, so nested objects keep their original modifiers unless you apply the transform recursively.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'ts-utility-pick-omit',
        title: 'Pick, Omit & Record',
        level: 2,
        slug: 'pick-omit-record',
        concepts: [
          {
            id: 'ts-util-pick',
            code: "type TodoPreview = Pick<Todo, 'title'>;\ntype TodoWithoutDone = Omit<Todo, 'done'>;\n\ntype StatusMap = Record<'active' | 'archived', Todo[]>;\nconst map: StatusMap = { active: [], archived: [] };",
            note: '`Pick` selects a subset of properties. `Omit` excludes them. `Record<K,V>` creates an object type with keys K and values V.',
            explanation: {
              heading: 'Pick, Omit, and Record',
              intro: 'This trio reshapes object types by selecting, dropping, or constructing keys. Together they cover most day-to-day type surgery without repeating property definitions.',
              points: [
                { term: 'Pick selects keys', detail: 'Pick keeps only the named properties from a source type, which is handy for building a lightweight preview of a larger entity.' },
                { term: 'Omit removes keys', detail: 'Omit produces a type with the listed properties stripped out, useful when a value is derived minus a server-managed field.' },
                { term: 'Record builds maps', detail: 'Record takes a key type and a value type and produces an object with those keys, ideal for lookup tables keyed by a literal union.' },
                { term: 'Keys stay in sync', detail: 'Because Pick and Omit reference the original property names, renaming a field in the source updates these derived types automatically.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 9. Mapped Types ───────────────────────────────────────────────────
  {
    id: 'ts-mapped-types',
    title: 'Mapped Types',
    level: 1,
    slug: 'mapped-types',
    concepts: [],
    children: [
      {
        id: 'ts-mapped-basic',
        title: 'Basic Mapped Types',
        level: 2,
        slug: 'basic-mapped',
        concepts: [
          {
            id: 'ts-mapped-intro',
            code: "type Optional<T> = {\n  [K in keyof T]?: T[K];\n};\n\ntype Nullable<T> = {\n  [K in keyof T]: T[K] | null;\n};",
            note: 'Mapped types iterate over the keys of a type using `in keyof` to transform each property — making them optional, nullable, readonly, etc.',
            explanation: {
              heading: 'Basics of mapped types',
              intro: 'A mapped type walks over the keys of an existing type and produces a new property for each one. It is the engine behind many utility types and lets you apply a uniform transform across an entire shape.',
              points: [
                { term: 'The in keyof pattern', detail: 'Writing K in keyof T iterates over every key of T, binding each key to K so you can compute its new value type.' },
                { term: 'Transform the value', detail: 'The right side of the mapping can wrap the original T of K, for example making it nullable by unioning with null.' },
                { term: 'Adjust modifiers', detail: 'You can add or remove optional and readonly modifiers during the map, which is how Partial and Readonly are built.' },
                { term: 'Homomorphic behavior', detail: 'Mapping directly over keyof T preserves the original modifiers unless you change them, keeping the result faithful to the source.' },
              ],
            },
            example: "type Flags<T> = { [K in keyof T]: boolean };\ntype TodoFlags = Flags<Todo>; // { title: boolean; done: boolean }",
          },
        ],
        children: [],
      },
      {
        id: 'ts-mapped-modifiers',
        title: 'Key Remapping & Modifiers',
        level: 2,
        slug: 'mapped-modifiers',
        concepts: [
          {
            id: 'ts-mapped-remap',
            code: "type Getters<T> = {\n  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];\n};\n\ntype TodoGetters = Getters<Todo>;\n// { getTitle: () => string; getDone: () => boolean }",
            note: 'The `as` clause remaps keys during mapping. Combine with template literal types for powerful naming transformations.',
            explanation: {
              heading: 'Key remapping and modifiers',
              intro: 'A mapped type can rename its keys as it goes using an as clause, and it can tune optional and readonly modifiers at the same time. This unlocks transformations like generating getter names from property names.',
              points: [
                { term: 'The as clause', detail: 'Adding as followed by a new key expression renames each property, often composed with the backtick syntax to build names like getTitle.' },
                { term: 'Filtering keys', detail: 'Remapping a key to never removes it entirely, which lets you drop properties that do not match a condition.' },
                { term: 'Modifier prefixes', detail: 'A plus or minus before readonly or the optional marker adds or strips that modifier for every mapped property.' },
                { term: 'Combine with intrinsics', detail: 'String helpers such as Capitalize pair with key remapping to produce cleanly cased derived names.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 10. Conditional Types ─────────────────────────────────────────────
  {
    id: 'ts-conditional-types',
    title: 'Conditional Types',
    level: 1,
    slug: 'conditional-types',
    concepts: [],
    children: [
      {
        id: 'ts-cond-basic',
        title: 'Basic Conditional Types',
        level: 2,
        slug: 'basic-conditional',
        concepts: [
          {
            id: 'ts-cond-intro',
            code: "type IsString<T> = T extends string ? true : false;\n\ntype A = IsString<'hello'>; // true\ntype B = IsString<42>;      // false",
            note: 'Conditional types follow `T extends U ? X : Y` syntax. They allow types to branch based on assignability checks.',
            explanation: {
              heading: 'Basics of conditional types',
              intro: 'A conditional type chooses between two result types based on whether one type is assignable to another. It brings if-style branching into the type system, which is the basis for many advanced type utilities.',
              points: [
                { term: 'The ternary shape', detail: 'The form T extends U ? X : Y yields X when T is assignable to U and Y otherwise, mirroring a runtime ternary.' },
                { term: 'Assignability, not equality', detail: 'The check asks whether T fits into U, so a subtype passes even when the two types are not identical.' },
                { term: 'Pairs with infer', detail: 'You can capture part of the matched type in the true branch using infer, for example pulling the element type out of an array.' },
                { term: 'Keeps types precise', detail: 'Conditionals let a helper return a tailored type per input instead of a single broad type, improving downstream inference.' },
              ],
            },
            example: "type Flatten<T> = T extends Array<infer U> ? U : T;\ntype Num = Flatten<number[]>; // number\ntype Str = Flatten<string>;   // string",
          },
        ],
        children: [],
      },
      {
        id: 'ts-cond-distributive',
        title: 'Distributive Conditional Types',
        level: 2,
        slug: 'distributive-conditional',
        concepts: [
          {
            id: 'ts-cond-dist',
            code: "type ToArray<T> = T extends unknown ? T[] : never;\n\ntype Result = ToArray<string | number>;\n// string[] | number[]  (distributed over union members)",
            note: 'When a conditional type acts on a naked type parameter that is a union, it distributes over each member. Wrap in `[T]` to prevent distribution.',
            explanation: {
              heading: 'Distribution over unions',
              intro: 'When a conditional type is applied to a bare type parameter that turns out to be a union, it runs the condition separately on each member and unions the results. This behavior is powerful but surprising the first time you meet it.',
              points: [
                { term: 'Naked parameter triggers it', detail: 'Distribution only happens when the checked type is a lone type parameter, so ToArray of string or number becomes an array of string or an array of number.' },
                { term: 'never disappears', detail: 'Because distributing over the empty union yields never, a conditional applied to never simply produces never.' },
                { term: 'Wrap to opt out', detail: 'Surrounding both sides in a single-element tuple, as in bracket T bracket, stops distribution and treats the union as one whole.' },
                { term: 'Know which you want', detail: 'Choosing distributive or non-distributive form is a common design decision when writing reusable conditional helpers.' },
              ],
            },
            example: "type NoDistribute<T> = [T] extends [unknown] ? T[] : never;\ntype R2 = NoDistribute<string | number>; // (string | number)[]",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 11. keyof & typeof ────────────────────────────────────────────────
  {
    id: 'ts-keyof-typeof',
    title: 'keyof & typeof Operators',
    level: 1,
    slug: 'keyof-typeof',
    concepts: [],
    children: [
      {
        id: 'ts-keyof',
        title: 'keyof Operator',
        level: 2,
        slug: 'keyof',
        concepts: [
          {
            id: 'ts-keyof-basic',
            code: "interface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\ntype UserKey = keyof User; // 'id' | 'name' | 'email'\n\nfunction getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}",
            note: '`keyof T` produces a union of all known public property names of T. Use it to create type-safe property access utilities.',
            explanation: {
              heading: 'The keyof operator',
              intro: 'The keyof operator takes an object type and produces a union of its property names as literal types. This is the key that unlocks type-safe generic property access and many mapped-type patterns.',
              points: [
                { term: 'Produces a key union', detail: 'For a type with id, name, and email, keyof yields the union of those three string literals.' },
                { term: 'Constrains index access', detail: 'Pairing K extends keyof T with a T of K return type lets a getter accept only valid keys and return the matching value type.' },
                { term: 'Reflects index signatures', detail: 'If a type has a string index signature, its keyof includes string and number rather than a finite set of names.' },
                { term: 'Foundation for mapping', detail: 'Mapped types iterate over keyof T, so understanding keyof is a prerequisite for reading and writing them.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'ts-typeof',
        title: 'typeof Operator (Type Context)',
        level: 2,
        slug: 'typeof',
        concepts: [
          {
            id: 'ts-typeof-basic',
            code: "const config = { host: 'localhost', port: 3000, debug: true };\n\ntype Config = typeof config;\n// { host: string; port: number; debug: boolean }\n\nconst colors = ['red', 'green', 'blue'] as const;\ntype Color = (typeof colors)[number]; // 'red' | 'green' | 'blue'",
            note: '`typeof` in type position extracts the TypeScript type from a runtime value. Pair with `as const` to capture literal types.',
            explanation: {
              heading: 'The typeof type operator',
              intro: 'Used in a type position, typeof reads the static type of an existing runtime value. It lets you derive types from real objects so the two never drift apart.',
              points: [
                { term: 'Two different typeofs', detail: 'The runtime typeof returns a string, while the type-level typeof used in annotations produces a type; context decides which one applies.' },
                { term: 'Single source of truth', detail: 'Deriving a Config type from a config object means editing the object automatically updates the type.' },
                { term: 'Combine with as const', detail: 'Applying as const before typeof captures literal values, turning an array into a union of its exact members via indexing with number.' },
                { term: 'Great for constants', detail: 'This pattern shines for configuration blocks and enum-like constant objects where you want the type to follow the data.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 12. Template Literal Types ────────────────────────────────────────
  {
    id: 'ts-template-literals',
    title: 'Template Literal Types',
    level: 1,
    slug: 'template-literal-types',
    concepts: [],
    children: [
      {
        id: 'ts-tpl-basic',
        title: 'String Manipulation Types',
        level: 2,
        slug: 'string-manipulation-types',
        concepts: [
          {
            id: 'ts-tpl-intro',
            code: "type EventName = `on${Capitalize<'click' | 'focus' | 'blur'>}`;\n// 'onClick' | 'onFocus' | 'onBlur'\n\ntype HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';\ntype Endpoint = `/${string}`;\ntype Route = `${HTTPMethod} ${Endpoint}`;",
            note: 'Template literal types use backtick syntax to compose string types. They distribute over unions to produce all combinations.',
            explanation: {
              heading: 'Composing string literal types',
              intro: 'Template literal types build new string literal types by interpolating other types into a pattern written with backtick syntax. They let the type system model naming conventions and structured strings.',
              points: [
                { term: 'Interpolate types', detail: 'You can splice a union or a string type into a pattern, and the result is a literal type describing every allowed string.' },
                { term: 'Distribution builds combinations', detail: 'When you interpolate a union, the type expands to every combination, so an on-prefix over three events yields three event names.' },
                { term: 'Pattern constraints', detail: 'A type like a slash followed by string constrains values to a shape, useful for route or path validation.' },
                { term: 'Pairs with inference', detail: 'Template literals can be matched and split with infer to extract parts of a string at the type level.' },
              ],
            },
            example: "type CSSProperty = `${string}-${'top' | 'right' | 'bottom' | 'left'}`;\n// matches 'margin-top', 'padding-left', etc.",
          },
        ],
        children: [],
      },
      {
        id: 'ts-tpl-intrinsic',
        title: 'Intrinsic String Types',
        level: 2,
        slug: 'intrinsic-string-types',
        concepts: [
          {
            id: 'ts-tpl-intrinsic',
            code: "type Upper = Uppercase<'hello'>;      // 'HELLO'\ntype Lower = Lowercase<'HELLO'>;      // 'hello'\ntype Cap = Capitalize<'hello'>;        // 'Hello'\ntype Uncap = Uncapitalize<'Hello'>;    // 'hello'",
            note: 'TypeScript provides four built-in string manipulation types: Uppercase, Lowercase, Capitalize, and Uncapitalize.',
            explanation: {
              heading: 'Intrinsic string manipulation types',
              intro: 'TypeScript ships four special string helper types that change the casing of string literal types at compile time. They are called intrinsic because the compiler implements them natively rather than in TypeScript source.',
              points: [
                { term: 'The four helpers', detail: 'Uppercase and Lowercase change every character, while Capitalize and Uncapitalize only touch the first character.' },
                { term: 'Compile-time only', detail: 'These operate on types, not values, so they produce new literal types and generate no runtime code.' },
                { term: 'Great with templates', detail: 'They combine with template literal types and key remapping to enforce naming conventions like generated getter names.' },
                { term: 'Work on unions too', detail: 'Applying one to a union of literals transforms each member, yielding a union of the transformed strings.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 13. Type Narrowing & Guards ───────────────────────────────────────
  {
    id: 'ts-narrowing',
    title: 'Type Narrowing & Guards',
    level: 1,
    slug: 'narrowing',
    concepts: [],
    children: [
      {
        id: 'ts-narrowing-builtin',
        title: 'Built-in Narrowing',
        level: 2,
        slug: 'builtin-narrowing',
        concepts: [
          {
            id: 'ts-narrow-typeof',
            code: "function process(value: string | number) {\n  if (typeof value === 'string') {\n    return value.toUpperCase(); // narrowed to string\n  }\n  return value.toFixed(2); // narrowed to number\n}",
            note: 'TypeScript narrows types via control flow: `typeof`, `instanceof`, truthiness checks, equality checks, and the `in` operator all trigger narrowing.',
            explanation: {
              heading: 'Built-in narrowing',
              intro: 'Narrowing is how TypeScript refines a broad type to a more specific one inside a branch of code. The compiler follows your control flow and understands common JavaScript checks automatically.',
              points: [
                { term: 'typeof guards', detail: 'A typeof check against string or number tells the compiler which primitive you have inside that branch.' },
                { term: 'instanceof and in', detail: 'The instanceof operator narrows to a class, and the in operator narrows based on whether a property exists on the value.' },
                { term: 'Truthiness and equality', detail: 'Checking for a falsy value or comparing against a literal removes those possibilities from the type in the matching branch.' },
                { term: 'Flow analysis', detail: 'The compiler tracks narrowing across if branches, early returns, and reassignments, so the type reflects what is actually possible at each line.' },
              ],
            },
            example: "function isDate(val: unknown): val is Date {\n  return val instanceof Date;\n}",
          },
        ],
        children: [],
      },
      {
        id: 'ts-narrowing-custom',
        title: 'Custom Type Guards',
        level: 2,
        slug: 'custom-guards',
        concepts: [
          {
            id: 'ts-guard-custom',
            code: "interface Fish { swim(): void }\ninterface Bird { fly(): void }\n\nfunction isFish(pet: Fish | Bird): pet is Fish {\n  return (pet as Fish).swim !== undefined;\n}\n\nfunction move(pet: Fish | Bird) {\n  if (isFish(pet)) {\n    pet.swim(); // narrowed to Fish\n  } else {\n    pet.fly();  // narrowed to Bird\n  }\n}",
            note: 'A user-defined type guard is a function whose return type is `paramName is Type`. It tells the compiler how to narrow within the true branch.',
            explanation: {
              heading: 'Custom type guards',
              intro: 'When the built-in checks are not enough, you can teach the compiler how to narrow by writing a function that returns a type predicate. This packages a runtime check into a reusable, self-documenting helper.',
              points: [
                { term: 'The is predicate', detail: 'A return type of pet is Fish signals that a true result means the argument is a Fish, so the compiler narrows accordingly.' },
                { term: 'Runtime must match', detail: 'The body should genuinely verify the shape it claims, because the compiler trusts your predicate without checking it.' },
                { term: 'Reusable and composable', detail: 'A guard function can be shared across the codebase and combined, unlike an inline check that only helps one spot.' },
                { term: 'Safer than assertions', detail: 'Guards perform a real runtime test, making them far safer than casting with as, which blindly overrides the type.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 14. Discriminated Unions ──────────────────────────────────────────
  {
    id: 'ts-discriminated-unions',
    title: 'Discriminated Unions',
    level: 1,
    slug: 'discriminated-unions',
    concepts: [],
    children: [
      {
        id: 'ts-discrim-pattern',
        title: 'The Discriminant Pattern',
        level: 2,
        slug: 'discriminant-pattern',
        concepts: [
          {
            id: 'ts-discrim-basic',
            code: "type Shape =\n  | { kind: 'circle'; radius: number }\n  | { kind: 'rect'; width: number; height: number };\n\nfunction area(s: Shape): number {\n  switch (s.kind) {\n    case 'circle': return Math.PI * s.radius ** 2;\n    case 'rect':   return s.width * s.height;\n  }\n}",
            note: 'A discriminated union has a common literal property (the discriminant) that TypeScript uses for exhaustive narrowing in switch/if statements.',
            explanation: {
              heading: 'The discriminant pattern',
              intro: 'A discriminated union is a union of object types that all share one literal property whose value differs per member. That shared tag gives the compiler a reliable way to tell the members apart.',
              points: [
                { term: 'The shared tag', detail: 'Each member carries a common field, often named kind or type, set to a distinct literal like circle or rect.' },
                { term: 'Switch narrows cleanly', detail: 'Branching on the tag in a switch or if narrows the whole object to the matching member, unlocking its specific fields.' },
                { term: 'Models finite states', detail: 'This pattern is ideal for shapes, actions, and request states where each variant carries different data.' },
                { term: 'Keep the tag a literal', detail: 'The discriminant must be a literal type, not a plain string, or the compiler cannot distinguish the members.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'ts-discrim-exhaustive',
        title: 'Exhaustiveness Checking',
        level: 2,
        slug: 'exhaustiveness',
        concepts: [
          {
            id: 'ts-discrim-exhaust',
            code: "function assertNever(x: never): never {\n  throw new Error(`Unexpected value: ${x}`);\n}\n\nfunction describe(s: Shape): string {\n  switch (s.kind) {\n    case 'circle': return `Circle r=${s.radius}`;\n    case 'rect':   return `Rect ${s.width}x${s.height}`;\n    default:       return assertNever(s); // compile error if case missed\n  }\n}",
            note: 'Assign the discriminant variable to `never` in the default branch. If a new variant is added but not handled, the compiler raises an error.',
            explanation: {
              heading: 'Exhaustiveness checking',
              intro: 'Exhaustiveness checking makes the compiler prove that you have handled every member of a union. It turns the addition of a new variant into a compile error at every place that forgot to handle it.',
              points: [
                { term: 'The never trick', detail: 'In the default branch the remaining type should be never, so passing it to a function typed to accept never fails if a case was missed.' },
                { term: 'assertNever helper', detail: 'A small helper that takes a never parameter and throws gives both a compile-time guard and a runtime safety net.' },
                { term: 'Refactor with confidence', detail: 'Adding a new union member surfaces every unhandled switch immediately, which is invaluable in large codebases.' },
                { term: 'Prefer switch over if chains', detail: 'A switch on the discriminant reads clearly and pairs naturally with the default branch used for the check.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 15. Classes ───────────────────────────────────────────────────────
  {
    id: 'ts-classes',
    title: 'Classes',
    level: 1,
    slug: 'classes',
    concepts: [],
    children: [
      {
        id: 'ts-class-basics',
        title: 'Class Members & Visibility',
        level: 2,
        slug: 'class-members',
        concepts: [
          {
            id: 'ts-class-members',
            code: "class Account {\n  private balance: number;\n  readonly id: string;\n\n  constructor(id: string, initial: number) {\n    this.id = id;\n    this.balance = initial;\n  }\n\n  deposit(amount: number): void {\n    this.balance += amount;\n  }\n\n  getBalance(): number {\n    return this.balance;\n  }\n}",
            note: 'TypeScript adds `public`, `private`, `protected`, and `readonly` modifiers to class members. These are compile-time only — use `#field` for runtime privacy.',
            explanation: {
              heading: 'Class members and visibility',
              intro: 'TypeScript layers access modifiers on top of standard JavaScript classes to control who can read or write each member. These modifiers document intent and prevent misuse during development.',
              points: [
                { term: 'The visibility levels', detail: 'public is the default and open to all, protected is visible to subclasses, and private is limited to the declaring class.' },
                { term: 'Compile-time enforcement', detail: 'These modifiers are erased when compiled, so they guide developers but do not stop access at runtime.' },
                { term: 'True privacy with hash fields', detail: 'A field prefixed with the hash symbol is genuinely private in JavaScript itself, enforced even after compilation.' },
                { term: 'readonly for immutable slots', detail: 'A readonly member can be set in the constructor but not reassigned afterward, protecting values like an id.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'ts-class-abstract',
        title: 'Abstract Classes & Implements',
        level: 2,
        slug: 'abstract-classes',
        concepts: [
          {
            id: 'ts-class-abstract',
            code: "abstract class Shape {\n  abstract area(): number;\n  describe(): string {\n    return `Area: ${this.area()}`;\n  }\n}\n\nclass Circle extends Shape {\n  constructor(private radius: number) { super(); }\n  area(): number { return Math.PI * this.radius ** 2; }\n}",
            note: 'Abstract classes cannot be instantiated directly. They define a contract that subclasses must fulfill while providing shared implementation.',
            explanation: {
              heading: 'Abstract classes and implements',
              intro: 'An abstract class is a partial base that mixes required-but-unimplemented members with shared concrete ones. It sits between a plain interface and a fully implemented class.',
              points: [
                { term: 'Cannot be instantiated', detail: 'You cannot create an abstract class directly; you must extend it and implement its abstract members first.' },
                { term: 'Abstract members are contracts', detail: 'An abstract method declares a signature with no body, forcing every subclass to provide its own implementation.' },
                { term: 'Shared implementation', detail: 'Concrete methods on the abstract class are inherited, so common behavior lives in one place instead of being duplicated.' },
                { term: 'implements versus extends', detail: 'A class can extend one base for shared code and implement several interfaces to promise multiple contracts at once.' },
              ],
            },
            example: "interface Serializable { serialize(): string; }\nclass JsonCircle extends Circle implements Serializable {\n  serialize() { return JSON.stringify({ r: this.area() }); }\n}",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 16. Enums ─────────────────────────────────────────────────────────
  {
    id: 'ts-enums',
    title: 'Enums',
    level: 1,
    slug: 'enums',
    concepts: [],
    children: [
      {
        id: 'ts-enum-numeric-string',
        title: 'Numeric & String Enums',
        level: 2,
        slug: 'numeric-string-enums',
        concepts: [
          {
            id: 'ts-enum-types',
            code: "enum Direction {\n  Up,    // 0\n  Down,  // 1\n  Left,  // 2\n  Right, // 3\n}\n\nenum Status {\n  Active = 'ACTIVE',\n  Inactive = 'INACTIVE',\n  Pending = 'PENDING',\n}",
            note: 'Numeric enums auto-increment from 0. String enums require explicit values but produce more readable output at runtime.',
            explanation: {
              heading: 'Numeric and string enums',
              intro: 'An enum gives names to a set of related constant values. TypeScript supports both numeric enums that count up automatically and string enums whose values you spell out explicitly.',
              points: [
                { term: 'Numeric auto-increment', detail: 'Numeric enum members start at zero and each following member increments by one unless you assign a value.' },
                { term: 'String enums read clearly', detail: 'String enums require an explicit value per member but produce meaningful values in logs and serialized data.' },
                { term: 'Reverse mappings', detail: 'Numeric enums generate a reverse lookup from value back to name at runtime, which string enums intentionally do not.' },
                { term: 'They emit runtime code', detail: 'Unlike type aliases, enums create a real object at runtime, so be aware of the added output when weighing alternatives.' },
              ],
            },
            example: "const move = (dir: Direction) => { /* ... */ };\nmove(Direction.Up);",
          },
        ],
        children: [],
      },
      {
        id: 'ts-enum-const',
        title: 'const Enums & Alternatives',
        level: 2,
        slug: 'const-enums',
        concepts: [
          {
            id: 'ts-enum-const',
            code: "const enum Color {\n  Red = '#f00',\n  Green = '#0f0',\n  Blue = '#00f',\n}\n// const enums are inlined at compile time — no runtime object\n\n// Preferred alternative: union of literals\ntype Color2 = 'red' | 'green' | 'blue';",
            note: '`const enum` eliminates the runtime object by inlining values. Many teams prefer string literal unions instead for simpler, tree-shakeable types.',
            explanation: {
              heading: 'const enums and alternatives',
              intro: 'A const enum trades the runtime object of a normal enum for inlined values, and many teams skip enums entirely in favor of plain literal unions. Knowing the tradeoffs helps you pick the right tool.',
              points: [
                { term: 'Inlining', detail: 'A const enum has its member values substituted directly into the emitted code, so no lookup object is generated.' },
                { term: 'Bundler caveats', detail: 'const enums can behave inconsistently across build setups and isolated module compilation, which is why some configs disallow them.' },
                { term: 'Literal unions', detail: 'A union of string literals covers most enum use cases with zero runtime cost and better tree-shaking.' },
                { term: 'Choose intentionally', detail: 'Reach for a runtime enum when you need reverse mappings or a value object, and prefer a literal union for simple finite sets.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 17. Modules & Namespaces ──────────────────────────────────────────
  {
    id: 'ts-modules',
    title: 'Modules & Namespaces',
    level: 1,
    slug: 'modules',
    concepts: [],
    children: [
      {
        id: 'ts-modules-esm',
        title: 'ES Module Syntax',
        level: 2,
        slug: 'es-modules',
        concepts: [
          {
            id: 'ts-mod-esm',
            code: "// math.ts\nexport function add(a: number, b: number): number {\n  return a + b;\n}\nexport const PI = 3.14159;\n\n// app.ts\nimport { add, PI } from './math';\nimport type { Result } from './types'; // type-only import",
            note: 'TypeScript uses standard ES module syntax. `import type` ensures the import is erased at compile time — useful for interfaces and type aliases.',
            explanation: {
              heading: 'ES module syntax',
              intro: 'TypeScript builds on the standard ECMAScript module system for sharing code across files. Each file is its own module, and you use export and import to expose and consume members.',
              points: [
                { term: 'Named and default exports', detail: 'A module can expose many named exports and at most one default export, and importers pick exactly what they need.' },
                { term: 'Type-only imports', detail: 'Writing import type guarantees the import carries no runtime value and is fully erased, which avoids accidental side effects.' },
                { term: 'File scope by default', detail: 'Any file with an import or export is a module whose top-level names stay private unless exported.' },
                { term: 'Resolution matters', detail: 'Module resolution settings decide how paths map to files, so align tsconfig with your runtime to avoid surprises.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'ts-modules-namespace',
        title: 'Namespaces',
        level: 2,
        slug: 'namespaces',
        concepts: [
          {
            id: 'ts-mod-ns',
            code: "namespace Validation {\n  export interface StringValidator {\n    isValid(s: string): boolean;\n  }\n\n  export class EmailValidator implements StringValidator {\n    isValid(s: string) {\n      return s.includes('@');\n    }\n  }\n}",
            note: 'Namespaces are a TypeScript-specific way to organize code. In modern codebases ES modules are preferred, but namespaces remain useful for declaration merging and ambient types.',
            explanation: {
              heading: 'Namespaces',
              intro: 'Namespaces are a TypeScript feature for grouping related declarations under a single named container. They predate ES modules and see limited use today, but they still matter for certain typing scenarios.',
              points: [
                { term: 'Grouping with export', detail: 'Members inside a namespace are private unless marked export, and consumers reach them through the namespace name.' },
                { term: 'Prefer modules', detail: 'For application code, ES modules are the recommended way to organize files, so reach for namespaces only when they add value.' },
                { term: 'Useful in declarations', detail: 'Namespaces remain handy inside declaration files for structuring ambient types and describing global libraries.' },
                { term: 'Merging behavior', detail: 'Namespaces merge across declarations and can even merge with functions or classes, which enables some advanced typing patterns.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 18. Declaration Files ─────────────────────────────────────────────
  {
    id: 'ts-declaration-files',
    title: 'Declaration Files (.d.ts)',
    level: 1,
    slug: 'declaration-files',
    concepts: [],
    children: [
      {
        id: 'ts-dts-writing',
        title: 'Writing Declarations',
        level: 2,
        slug: 'writing-declarations',
        concepts: [
          {
            id: 'ts-dts-write',
            code: "// global.d.ts\ndeclare const APP_VERSION: string;\n\n// module declaration\ndeclare module '*.css' {\n  const classes: Record<string, string>;\n  export default classes;\n}\n\n// augmenting an existing module\ndeclare module 'express' {\n  interface Request {\n    userId?: string;\n  }\n}",
            note: 'Declaration files provide type information for JavaScript libraries. Use `declare` for ambient values and `declare module` to type non-TS imports or augment existing modules.',
            explanation: {
              heading: 'Writing declaration files',
              intro: 'A declaration file ending in d.ts contains only type information and no implementation. It describes the shape of JavaScript that exists elsewhere so TypeScript can check code that uses it.',
              points: [
                { term: 'The declare keyword', detail: 'declare introduces an ambient value or type that you promise exists at runtime, without emitting any code for it.' },
                { term: 'Typing non-code imports', detail: 'A declare module block can describe imports like CSS or image files so bundler-specific imports type-check cleanly.' },
                { term: 'Module augmentation', detail: 'Reopening an existing module with declare module lets you add fields to its types, such as extending a request object.' },
                { term: 'No implementation allowed', detail: 'Declaration files must not contain function bodies or logic, since their whole job is to describe types.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'ts-dts-definitely-typed',
        title: 'DefinitelyTyped & @types',
        level: 2,
        slug: 'definitely-typed',
        concepts: [
          {
            id: 'ts-dts-at-types',
            code: "// Install types for a JS library\n// npm install --save-dev @types/lodash\n\nimport _ from 'lodash';\nconst sorted = _.sortBy([3, 1, 2]); // fully typed",
            note: 'The `@types` scope on npm hosts community-maintained type declarations via the DefinitelyTyped project. TypeScript auto-discovers them from node_modules/@types.',
            explanation: {
              heading: 'DefinitelyTyped and the types scope',
              intro: 'Many JavaScript libraries ship without their own types, so the community publishes declarations for them under the types scope on npm. TypeScript finds and applies these automatically.',
              points: [
                { term: 'Community declarations', detail: 'DefinitelyTyped is a large shared repository whose packages are published under the types scope for thousands of libraries.' },
                { term: 'Automatic discovery', detail: 'Packages installed into the types folder inside node_modules are picked up without any explicit import of the type package.' },
                { term: 'Install as dev dependencies', detail: 'Type packages only matter at build time, so install them as development dependencies rather than runtime ones.' },
                { term: 'Prefer bundled types', detail: 'When a library ships its own types you do not need the community package, and mixing the two can cause version conflicts.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 19. tsconfig & Strict Mode ────────────────────────────────────────
  {
    id: 'ts-tsconfig',
    title: 'tsconfig & Strict Mode',
    level: 1,
    slug: 'tsconfig',
    concepts: [],
    children: [
      {
        id: 'ts-tsconfig-strict',
        title: 'Strict Compiler Options',
        level: 2,
        slug: 'strict-options',
        concepts: [
          {
            id: 'ts-tsconfig-strict',
            code: '// tsconfig.json\n{\n  "compilerOptions": {\n    "strict": true,              // enables all strict checks\n    "noUncheckedIndexedAccess": true,\n    "exactOptionalPropertyTypes": true,\n    "target": "ES2022",\n    "module": "NodeNext",\n    "moduleResolution": "NodeNext"\n  }\n}',
            note: '`"strict": true` enables strictNullChecks, noImplicitAny, strictFunctionTypes, and more. Start strict on new projects — it catches many bugs that are hard to retrofit later.',
            explanation: {
              heading: 'Strict compiler options',
              intro: 'The strict flag turns on a family of checks that catch the mistakes TypeScript is best at preventing. Enabling it from day one is far easier than retrofitting it into a mature codebase.',
              points: [
                { term: 'A bundle of checks', detail: 'Setting strict to true switches on strict null checks, no implicit any, strict function types, and several related rules at once.' },
                { term: 'Null safety', detail: 'Strict null checks make null and undefined distinct, forcing you to handle missing values instead of hitting them at runtime.' },
                { term: 'Extra opt-in checks', detail: 'Options like no unchecked indexed access add even tighter guarantees that go beyond the base strict set.' },
                { term: 'Adopt early', detail: 'Turning strict on for a large existing project can surface many errors, so enable it on new code and migrate legacy code gradually.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'ts-tsconfig-paths',
        title: 'Path Aliases & Project References',
        level: 2,
        slug: 'paths-references',
        concepts: [
          {
            id: 'ts-tsconfig-paths',
            code: '// tsconfig.json\n{\n  "compilerOptions": {\n    "baseUrl": ".",\n    "paths": {\n      "@/*": ["src/*"],\n      "@utils/*": ["src/utils/*"]\n    }\n  },\n  "references": [\n    { "path": "./packages/shared" }\n  ]\n}',
            note: 'Path aliases simplify deep imports. Project references enable incremental builds in monorepos by declaring package dependencies.',
            explanation: {
              heading: 'Path aliases and project references',
              intro: 'As projects grow, deep relative import paths and slow full rebuilds become painful. Path aliases and project references address both by remapping imports and splitting a build into linked pieces.',
              points: [
                { term: 'Cleaner imports', detail: 'A paths entry maps a prefix like the at-sign to a source folder, so you import from a stable alias instead of long relative chains.' },
                { term: 'Runtime must agree', detail: 'Path aliases only affect type checking, so your bundler or runtime needs matching resolution or the imports will fail at run time.' },
                { term: 'Incremental builds', detail: 'Project references split a monorepo into sub-projects that build independently and only rebuild when their inputs change.' },
                { term: 'Declared dependencies', detail: 'The references array states which projects depend on which, letting the compiler build them in the correct order.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 20. Decorators ────────────────────────────────────────────────────
  {
    id: 'ts-decorators',
    title: 'Decorators',
    level: 1,
    slug: 'decorators',
    concepts: [],
    children: [
      {
        id: 'ts-decorator-class',
        title: 'Class & Method Decorators',
        level: 2,
        slug: 'class-method-decorators',
        concepts: [
          {
            id: 'ts-deco-class',
            code: "function sealed(constructor: Function) {\n  Object.seal(constructor);\n  Object.seal(constructor.prototype);\n}\n\n@sealed\nclass Greeter {\n  greeting: string;\n  constructor(message: string) {\n    this.greeting = message;\n  }\n}",
            note: 'Decorators are functions applied to classes, methods, or properties via `@decorator` syntax. Stage-3 decorators landed in TypeScript 5.0.',
            explanation: {
              heading: 'Class and method decorators',
              intro: 'A decorator is a function attached to a declaration with the at-sign syntax that can observe or modify it. They let you add cross-cutting behavior like logging or sealing without cluttering the class body.',
              points: [
                { term: 'Where they apply', detail: 'Decorators can target classes, methods, accessors, properties, and parameters, each receiving different information about what it decorates.' },
                { term: 'They run at definition', detail: 'A decorator executes when the class is defined, not when instances are created, so it shapes the class up front.' },
                { term: 'Wrapping behavior', detail: 'A method decorator can replace the original implementation with a wrapper, which is how logging and timing decorators work.' },
                { term: 'Standard since 5.0', detail: 'The stage-3 decorator standard arrived in TypeScript 5.0 and works without the older experimental flag.' },
              ],
            },
            example: "function log(_target: any, key: string, desc: PropertyDescriptor) {\n  const orig = desc.value;\n  desc.value = function(...args: any[]) {\n    console.log(`${key} called`, args);\n    return orig.apply(this, args);\n  };\n}",
          },
        ],
        children: [],
      },
      {
        id: 'ts-decorator-tc39',
        title: 'TC39 Stage-3 Decorators',
        level: 2,
        slug: 'tc39-decorators',
        concepts: [
          {
            id: 'ts-deco-tc39',
            code: "function bound<T extends (...args: any[]) => any>(\n  _target: T,\n  context: ClassMethodDecoratorContext\n) {\n  context.addInitializer(function (this: any) {\n    this[context.name] = this[context.name].bind(this);\n  });\n}",
            note: 'Stage-3 decorators use a new API with a `context` object. They are the standard going forward and work without `experimentalDecorators`.',
            explanation: {
              heading: 'TC39 stage-3 decorators',
              intro: 'The modern decorator standard replaces the older experimental design with a cleaner API centered on a context object. This is the form to learn because it matches the language proposal and needs no special flag.',
              points: [
                { term: 'The context object', detail: 'Each decorator receives a context describing the member name, its kind, and helpers like an initializer hook.' },
                { term: 'addInitializer', detail: 'The context lets you register logic that runs when an instance is set up, useful for binding methods to their instance.' },
                { term: 'No experimental flag', detail: 'Standard decorators work out of the box and do not require the legacy experimental decorators setting.' },
                { term: 'Different from the old API', detail: 'The parameter shapes differ from legacy decorators, so code written for the experimental version needs updating to migrate.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 21. The infer Keyword ─────────────────────────────────────────────
  {
    id: 'ts-infer',
    title: 'The infer Keyword',
    level: 1,
    slug: 'infer',
    concepts: [],
    children: [
      {
        id: 'ts-infer-basic',
        title: 'Extracting Types with infer',
        level: 2,
        slug: 'infer-basics',
        concepts: [
          {
            id: 'ts-infer-intro',
            code: "type ReturnOf<T> = T extends (...args: any[]) => infer R ? R : never;\n\ntype Str = ReturnOf<() => string>;    // string\ntype Num = ReturnOf<(x: number) => number>; // number",
            note: "`infer` declares a type variable inside a conditional type's `extends` clause, capturing a piece of the matched type for use in the true branch.",
            explanation: {
              heading: 'Extracting types with infer',
              intro: 'The infer keyword lets a conditional type capture part of the type it is matching against and give that part a name. It is the mechanism behind utilities that pull the return type out of a function or the value out of a promise.',
              points: [
                { term: 'Declared in extends', detail: 'You write infer followed by a name inside the extends clause, and the name becomes a type variable bound to whatever matched.' },
                { term: 'Available in the true branch', detail: 'The captured variable is only in scope in the true branch, where you return it or transform it further.' },
                { term: 'Powers built-in utilities', detail: 'Helpers like the return type and awaited utilities are built by matching a pattern and inferring the interesting piece.' },
                { term: 'Recursion is possible', detail: 'A conditional can call itself with the inferred type, which is how a deep awaited type unwraps nested promises.' },
              ],
            },
            example: "type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;\ntype Resolved = Awaited<Promise<Promise<number>>>; // number",
          },
        ],
        children: [],
      },
      {
        id: 'ts-infer-advanced',
        title: 'Advanced infer Patterns',
        level: 2,
        slug: 'infer-advanced',
        concepts: [
          {
            id: 'ts-infer-adv',
            code: "type FirstArg<T> = T extends (first: infer A, ...rest: any[]) => any ? A : never;\ntype Head<T extends any[]> = T extends [infer H, ...any[]] ? H : never;\ntype Last<T extends any[]> = T extends [...any[], infer L] ? L : never;\n\ntype F = FirstArg<(a: string, b: number) => void>; // string\ntype H = Head<[1, 2, 3]>; // 1\ntype L = Last<[1, 2, 3]>; // 3",
            note: 'You can use `infer` with tuple rest patterns to extract the first, last, or intermediate elements of tuple types.',
            explanation: {
              heading: 'Advanced infer patterns',
              intro: 'Combining infer with tuple and function patterns lets you deconstruct complex types precisely. This is how libraries type helpers that operate on argument lists and array shapes.',
              points: [
                { term: 'Head and tail', detail: 'Matching a tuple against a first element plus a rest pattern captures the head, and mirroring it captures the last element.' },
                { term: 'Function argument extraction', detail: 'You can infer the first parameter of a function type by matching its signature and naming that position.' },
                { term: 'Position-specific spreads', detail: 'A rest pattern can appear at the start or end, so you can pull the trailing element even when the length varies.' },
                { term: 'Read carefully', detail: 'These patterns are compact and dense, so name your inferred variables clearly to keep the intent readable.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 22. satisfies Operator ────────────────────────────────────────────
  {
    id: 'ts-satisfies',
    title: 'The satisfies Operator',
    level: 1,
    slug: 'satisfies',
    concepts: [],
    children: [
      {
        id: 'ts-satisfies-usage',
        title: 'Type Validation Without Widening',
        level: 2,
        slug: 'satisfies-usage',
        concepts: [
          {
            id: 'ts-satisfies-intro',
            code: "type Colors = Record<string, [number, number, number] | string>;\n\nconst palette = {\n  red: [255, 0, 0],\n  green: '#00ff00',\n  blue: [0, 0, 255],\n} satisfies Colors;\n\n// palette.red is still [number, number, number], not string | [number,number,number]\nconst r = palette.red[0]; // number — no narrowing needed",
            note: '`satisfies` validates that an expression matches a type without widening the inferred type. This keeps the narrowest possible type for downstream usage.',
            explanation: {
              heading: 'Validation without widening',
              intro: 'The satisfies operator checks that a value conforms to a type while keeping the more specific type the compiler inferred from the value itself. You get validation and precise types at the same time.',
              points: [
                { term: 'Checks conformance', detail: 'It verifies the expression is assignable to the given type, so typos and wrong shapes are caught immediately.' },
                { term: 'Keeps the narrow type', detail: 'Unlike an annotation, the variable keeps its inferred literal and tuple types, so a member stays a tuple rather than widening to a union.' },
                { term: 'Best of both', detail: 'You get the safety of a type check and the precision of inference, which helps downstream code avoid extra narrowing.' },
                { term: 'Great for config objects', detail: 'It shines on lookup tables and configuration where you want each entry validated but individually precise.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'ts-satisfies-vs-annotation',
        title: 'satisfies vs Type Annotation',
        level: 2,
        slug: 'satisfies-vs-annotation',
        concepts: [
          {
            id: 'ts-satisfies-cmp',
            code: "type Route = { path: string; method: 'GET' | 'POST' };\n\n// Annotation widens:\nconst r1: Route = { path: '/api', method: 'GET' };\n// r1.method is 'GET' | 'POST'\n\n// satisfies preserves:\nconst r2 = { path: '/api', method: 'GET' } satisfies Route;\n// r2.method is 'GET' (literal type preserved)",
            note: 'A type annotation widens the value to the declared type. `satisfies` checks conformance while retaining the inferred literal types.',
            explanation: {
              heading: 'satisfies versus a type annotation',
              intro: 'Both an annotation and satisfies check a value against a type, but they differ in what type the variable ends up with. Understanding the difference helps you preserve literal types when you need them.',
              points: [
                { term: 'Annotation widens', detail: 'A colon annotation forces the variable to the declared type, so a method literal broadens to the full union of allowed values.' },
                { term: 'satisfies preserves', detail: 'With satisfies the variable keeps its inferred literal, so the method stays exactly the value you wrote.' },
                { term: 'Pick by intent', detail: 'Use an annotation when you want the broad declared type, and satisfies when you want validation plus the narrow inferred type.' },
                { term: 'Errors still surface', detail: 'Both forms report a mismatch, so choosing satisfies does not sacrifice the compile-time check.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 23. const Assertions ──────────────────────────────────────────────
  {
    id: 'ts-const-assertions',
    title: 'const Assertions',
    level: 1,
    slug: 'const-assertions',
    concepts: [],
    children: [
      {
        id: 'ts-const-as-const',
        title: 'as const',
        level: 2,
        slug: 'as-const',
        concepts: [
          {
            id: 'ts-const-basic',
            code: "const routes = ['/', '/about', '/contact'] as const;\n// type: readonly ['/', '/about', '/contact']\n\ntype Route = (typeof routes)[number];\n// '/' | '/about' | '/contact'\n\nconst config = {\n  api: 'https://api.example.com',\n  timeout: 5000,\n} as const;\n// All properties become readonly with literal types",
            note: '`as const` makes the entire expression deeply readonly with the narrowest literal types. It turns arrays into readonly tuples and objects into readonly records.',
            explanation: {
              heading: 'Using as const',
              intro: 'A const assertion tells the compiler to infer the narrowest, deeply immutable type for a literal expression. It is the simplest way to lock in exact values instead of letting them widen.',
              points: [
                { term: 'Literal types', detail: 'Values keep their exact literal type, so a string stays that specific string rather than widening to string.' },
                { term: 'Deep readonly', detail: 'Every nested property and array element becomes readonly, signaling that the whole structure should not be mutated.' },
                { term: 'Arrays become tuples', detail: 'An array literal turns into a readonly tuple, which lets you derive a precise union of its members by indexing with number.' },
                { term: 'Handy for constants', detail: 'It is ideal for route lists, config blocks, and other fixed data you want treated as exact, unchanging values.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'ts-const-generic',
        title: 'const Type Parameters (TS 5.0)',
        level: 2,
        slug: 'const-type-params',
        concepts: [
          {
            id: 'ts-const-param',
            code: "function createRoute<const T extends readonly string[]>(paths: T): T {\n  return paths;\n}\n\nconst r = createRoute(['/home', '/about']);\n// type: readonly ['/home', '/about'] — literal types preserved",
            note: 'The `const` modifier on a type parameter infers literal/readonly types from arguments without requiring callers to write `as const`.',
            explanation: {
              heading: 'const type parameters',
              intro: 'Introduced in TypeScript 5.0, a const modifier on a generic parameter makes the compiler infer literal and readonly types from arguments automatically. It moves the burden of writing a const assertion off the caller.',
              points: [
                { term: 'The const modifier', detail: 'Writing const before a type parameter tells inference to capture the narrowest literal types from whatever the caller passes.' },
                { term: 'No caller boilerplate', detail: 'Callers get precise literal results without having to append a const assertion at every call site.' },
                { term: 'Great for helper APIs', detail: 'It suits functions that accept configuration or route arrays and want to preserve the exact values for later use.' },
                { term: 'Pairs with constraints', detail: 'You can still constrain the parameter, for example to a readonly string array, while keeping the literal inference.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 24. Tuples ────────────────────────────────────────────────────────
  {
    id: 'ts-tuples',
    title: 'Tuples',
    level: 1,
    slug: 'tuples',
    concepts: [],
    children: [
      {
        id: 'ts-tuple-basics',
        title: 'Tuple Types',
        level: 2,
        slug: 'tuple-types',
        concepts: [
          {
            id: 'ts-tuple-basic',
            code: "type Point = [number, number];\ntype NamedPoint = [x: number, y: number, label?: string];\n\nconst origin: Point = [0, 0];\nconst named: NamedPoint = [10, 20, 'center'];",
            note: 'Tuples are fixed-length arrays where each position has a known type. Labels are optional but improve readability and IDE hints.',
            explanation: {
              heading: 'Tuple types',
              intro: 'A tuple is an array type where the length is fixed and each position carries its own type. Tuples model ordered, heterogeneous data such as a coordinate pair or a state hook return value.',
              points: [
                { term: 'Position matters', detail: 'Each index has a specific type, so the first slot might be a number and the second a string, unlike a uniform array.' },
                { term: 'Optional and labeled slots', detail: 'Positions can be marked optional and given names, which improves editor hints without affecting runtime behavior.' },
                { term: 'Common return pattern', detail: 'Returning a tuple lets a function hand back several values in order, as seen in state-and-setter pairs.' },
                { term: 'Watch mutation', detail: 'A plain tuple can still be pushed to at runtime, so use a readonly tuple when you want the length and contents fixed.' },
              ],
            },
            example: "function useState<T>(init: T): [T, (v: T) => void] {\n  let state = init;\n  return [state, (v) => { state = v; }];\n}",
          },
        ],
        children: [],
      },
      {
        id: 'ts-tuple-variadic',
        title: 'Variadic Tuple Types',
        level: 2,
        slug: 'variadic-tuples',
        concepts: [
          {
            id: 'ts-tuple-variadic',
            code: "type Concat<A extends unknown[], B extends unknown[]> = [...A, ...B];\ntype AB = Concat<[1, 2], [3, 4]>; // [1, 2, 3, 4]\n\nfunction tail<T extends unknown[], R extends unknown[]>(\n  _head: T[0], ...rest: R\n): R {\n  return rest as any;\n}",
            note: 'Variadic tuple types use spread syntax in type position. They enable precise typing of functions that manipulate argument lists like `concat`, `curry`, and `pipe`.',
            explanation: {
              heading: 'Variadic tuple types',
              intro: 'Variadic tuples allow a spread of another tuple type inside a tuple, so lengths and element types can be composed generically. They make it possible to type functions that combine or reshape argument lists precisely.',
              points: [
                { term: 'Spread in type position', detail: 'You can splice one tuple type into another with a spread, producing a combined tuple whose shape follows the inputs.' },
                { term: 'Generic length', detail: 'Because the spread parts are generic, a single type can describe concatenation of tuples of any length.' },
                { term: 'Powers functional helpers', detail: 'Utilities like concat, curry, and pipe rely on variadic tuples to track how arguments flow through them.' },
                { term: 'Combine with infer', detail: 'Pairing variadic tuples with inference lets you split off the first or last argument while keeping the rest typed.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 25. Function Overloads ────────────────────────────────────────────
  {
    id: 'ts-overloads',
    title: 'Function Overloads',
    level: 1,
    slug: 'overloads',
    concepts: [],
    children: [
      {
        id: 'ts-overloads-basic',
        title: 'Overload Signatures',
        level: 2,
        slug: 'overload-signatures',
        concepts: [
          {
            id: 'ts-overload-intro',
            code: "function createElement(tag: 'canvas'): HTMLCanvasElement;\nfunction createElement(tag: 'div'): HTMLDivElement;\nfunction createElement(tag: string): HTMLElement;\nfunction createElement(tag: string): HTMLElement {\n  return document.createElement(tag);\n}\n\nconst canvas = createElement('canvas'); // HTMLCanvasElement",
            note: 'Overload signatures declare multiple call signatures. The implementation signature is not visible to callers — only the overloads above it are.',
            explanation: {
              heading: 'Overload signatures',
              intro: 'Function overloads let one function present several distinct call signatures to callers while sharing a single implementation. They shine when the return type depends on which specific arguments were passed.',
              points: [
                { term: 'Multiple public signatures', detail: 'You list several signatures above the implementation, and callers see only those, choosing whichever matches their arguments.' },
                { term: 'Hidden implementation signature', detail: 'The final signature with the body must be broad enough to cover all overloads and is not callable directly.' },
                { term: 'Order matters', detail: 'The compiler picks the first matching overload from top to bottom, so place more specific signatures before broader ones.' },
                { term: 'Keep them honest', detail: 'The implementation must actually satisfy every advertised overload, since the compiler does not verify each branch against them.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'ts-overloads-generics',
        title: 'Overloads vs Generics',
        level: 2,
        slug: 'overloads-vs-generics',
        concepts: [
          {
            id: 'ts-overload-vs-gen',
            code: "// Prefer generics when the relationship is uniform\nfunction first<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\n\n// Use overloads when return type depends on specific input values\nfunction parse(input: string, asNumber: true): number;\nfunction parse(input: string, asNumber: false): string;\nfunction parse(input: string, asNumber: boolean): string | number {\n  return asNumber ? Number(input) : input;\n}",
            note: 'Prefer generics for uniform relationships. Use overloads when the return type changes based on specific argument values that cannot be captured generically.',
            explanation: {
              heading: 'Overloads versus generics',
              intro: 'Overloads and generics can both express varied function behavior, but they suit different situations. Choosing the right one keeps signatures clear and inference accurate.',
              points: [
                { term: 'Generics for uniform links', detail: 'When the output relates to the input by a single rule, a type parameter captures that relationship with one clean signature.' },
                { term: 'Overloads for value-driven types', detail: 'When the return type flips based on a specific literal argument, overloads express each case where a generic cannot.' },
                { term: 'Fewer signatures are clearer', detail: 'Prefer a single generic signature where possible, since long overload lists are harder to read and maintain.' },
                { term: 'Watch inference quality', detail: 'Overloads can produce confusing errors when no signature matches, so ensure the cases cover realistic calls.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 26. Type Assertions & Casting ─────────────────────────────────────
  {
    id: 'ts-assertions',
    title: 'Type Assertions & Casting',
    level: 1,
    slug: 'assertions',
    concepts: [],
    children: [
      {
        id: 'ts-assert-as',
        title: 'as Syntax & Non-null Assertion',
        level: 2,
        slug: 'as-syntax',
        concepts: [
          {
            id: 'ts-assert-intro',
            code: "const input = document.getElementById('name') as HTMLInputElement;\ninput.value = 'TypeScript';\n\n// Non-null assertion (use sparingly)\nfunction getLength(s: string | undefined): number {\n  return s!.length; // asserts s is not null/undefined\n}",
            note: "Type assertions (`as T`) override the compiler's inferred type. Non-null assertions (`!`) tell the compiler a value is not null/undefined. Both bypass safety — prefer narrowing.",
            explanation: {
              heading: 'as syntax and non-null assertion',
              intro: 'Assertions let you tell the compiler you know more about a type than it can infer. They are useful escape hatches but they turn off checking, so they should be a considered choice rather than a habit.',
              points: [
                { term: 'The as operator', detail: 'Writing as followed by a type overrides the inferred type, commonly used when reading DOM elements whose specific type the compiler cannot know.' },
                { term: 'Non-null assertion', detail: 'The trailing exclamation mark asserts a value is not null or undefined, removing those from the type without any runtime check.' },
                { term: 'No runtime effect', detail: 'Assertions are erased at compile time, so a wrong assertion will not fail loudly; it simply lets a bug through.' },
                { term: 'Prefer narrowing', detail: 'Whenever practical, use a real check or type guard instead, since those verify the value rather than merely claiming it.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'ts-assert-unknown',
        title: 'Safe Assertions via unknown',
        level: 2,
        slug: 'safe-assertions',
        concepts: [
          {
            id: 'ts-assert-safe',
            code: "// Double assertion through unknown (escape hatch)\nconst value = someExpr as unknown as TargetType;\n\n// Better: use a type guard\nfunction isString(val: unknown): val is string {\n  return typeof val === 'string';\n}",
            note: 'If a direct assertion fails because types do not overlap, you can go through `unknown` first. However, prefer runtime checks or type guards for safety.',
            explanation: {
              heading: 'Safe assertions via unknown',
              intro: 'The compiler blocks a direct assertion between two unrelated types to protect you. Routing through unknown is the sanctioned escape hatch, but it is a signal to double-check that a real verification is happening somewhere.',
              points: [
                { term: 'Why the double step', detail: 'A direct as between non-overlapping types is rejected, so casting to unknown first and then to the target satisfies the compiler.' },
                { term: 'A loud warning sign', detail: 'Needing a double assertion usually means the types genuinely do not match, so treat it as a prompt to reconsider the design.' },
                { term: 'Prefer a guard', detail: 'A type guard that actually inspects the value gives real safety, unlike an assertion that merely silences the error.' },
                { term: 'Isolate the risk', detail: 'If you must assert, wrap it in a small well-named function so the unsafe step is contained and easy to audit.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 27. Indexed Access Types ──────────────────────────────────────────
  {
    id: 'ts-indexed-access',
    title: 'Indexed Access Types',
    level: 1,
    slug: 'indexed-access',
    concepts: [],
    children: [
      {
        id: 'ts-indexed-basic',
        title: 'Accessing Property Types',
        level: 2,
        slug: 'property-types',
        concepts: [
          {
            id: 'ts-indexed-intro',
            code: "interface ApiResponse {\n  data: { users: { id: number; name: string }[] };\n  status: number;\n}\n\ntype Users = ApiResponse['data']['users'];        // { id: number; name: string }[]\ntype User = ApiResponse['data']['users'][number]; // { id: number; name: string }",
            note: 'Indexed access types (`T[K]`) look up the type of a property. Use `[number]` to extract the element type from an array type.',
            explanation: {
              heading: 'Accessing property types',
              intro: 'Indexed access types let you look up the type of a property by its key, much like reading a value from an object but at the type level. This keeps derived types tied to their source shape.',
              points: [
                { term: 'The lookup syntax', detail: 'Writing a type followed by a key in brackets returns the type stored at that key, and you can chain lookups for nested properties.' },
                { term: 'Array element type', detail: 'Indexing an array type with number yields the type of its elements, a common way to unwrap collections.' },
                { term: 'Keys can be unions', detail: 'Indexing with a union of keys returns a union of the corresponding value types, which pairs well with keyof.' },
                { term: 'Stays in sync', detail: 'Because the derived type references the original, changing a property type updates every place that looks it up.' },
              ],
            },
            example: "type StatusCode = ApiResponse['status']; // number",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 28. Recursive Types ───────────────────────────────────────────────
  {
    id: 'ts-recursive-types',
    title: 'Recursive Types',
    level: 1,
    slug: 'recursive-types',
    concepts: [],
    children: [
      {
        id: 'ts-recursive-basic',
        title: 'Self-Referencing Types',
        level: 2,
        slug: 'self-referencing',
        concepts: [
          {
            id: 'ts-recursive-intro',
            code: "type Json =\n  | string\n  | number\n  | boolean\n  | null\n  | Json[]\n  | { [key: string]: Json };\n\ntype TreeNode<T> = {\n  value: T;\n  children: TreeNode<T>[];\n};",
            note: 'Types can reference themselves to model recursive data structures like JSON, trees, and linked lists.',
            explanation: {
              heading: 'Self-referencing types',
              intro: 'A recursive type refers to itself in its own definition, which lets you describe data structures of arbitrary depth. This is the natural way to type JSON, trees, and nested menus.',
              points: [
                { term: 'Direct self-reference', detail: 'A type like a JSON value can list itself among its members, so an array or object of the same type is allowed to any depth.' },
                { term: 'Generic recursion', detail: 'Recursive generics like a tree node parameterized by a value type model containers whose children share the same shape.' },
                { term: 'Recursive transforms', detail: 'Mapped types can recurse into nested objects, which is how a deep partial makes every level optional.' },
                { term: 'Mind the limits', detail: 'Extremely deep or unbounded recursion can exceed the compiler depth limit, so some recursive types need a stopping condition.' },
              ],
            },
            example: "type DeepPartial<T> = {\n  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];\n};",
          },
        ],
        children: [],
      },
      {
        id: 'ts-recursive-depth',
        title: 'Depth-Limited Recursion',
        level: 2,
        slug: 'depth-limited',
        concepts: [
          {
            id: 'ts-recursive-depth',
            code: "type PathKeys<T, Depth extends unknown[] = []> =\n  Depth['length'] extends 4 ? never :\n  T extends object\n    ? { [K in keyof T & string]:\n        K | `${K}.${PathKeys<T[K], [...Depth, unknown]>}`\n      }[keyof T & string]\n    : never;",
            note: "Deeply recursive types can hit the compiler's depth limit. Use a tuple-length counter to cap recursion and avoid infinite instantiation errors.",
            explanation: {
              heading: 'Depth-limited recursion',
              intro: 'Recursive types are powerful but the compiler enforces a maximum instantiation depth to stay responsive. Capping recursion with a counter keeps advanced types working without triggering errors.',
              points: [
                { term: 'Why a limit exists', detail: 'Without a bound, a self-referencing type could expand forever, so the compiler stops after a certain depth and reports an error.' },
                { term: 'Tuple-length counters', detail: 'A common trick tracks depth by growing a tuple and reading its length, stopping when it reaches a chosen number.' },
                { term: 'Trade depth for safety', detail: 'Limiting depth means very deep structures are not fully typed, which is usually an acceptable cost for a working type.' },
                { term: 'Keep it readable', detail: 'These counters are dense, so comment the intent and the chosen limit so future readers understand the guard.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 29. Branded & Nominal Types ───────────────────────────────────────
  {
    id: 'ts-branded-types',
    title: 'Branded & Nominal Types',
    level: 1,
    slug: 'branded-types',
    concepts: [],
    children: [
      {
        id: 'ts-brand-pattern',
        title: 'The Brand Pattern',
        level: 2,
        slug: 'brand-pattern',
        concepts: [
          {
            id: 'ts-brand-intro',
            code: "type USD = number & { readonly __brand: 'USD' };\ntype EUR = number & { readonly __brand: 'EUR' };\n\nfunction usd(amount: number): USD {\n  return amount as USD;\n}\n\nfunction addUSD(a: USD, b: USD): USD {\n  return (a + b) as USD;\n}\n\nconst price = usd(9.99);\n// addUSD(price, 5 as EUR); // Error: EUR is not assignable to USD",
            note: 'TypeScript uses structural typing, so two identical shapes are compatible. Branding adds a phantom property to create nominal-like types that prevent accidental mixing.',
            explanation: {
              heading: 'The brand pattern',
              intro: 'Because TypeScript compares types by shape, two numbers meaning different things are freely interchangeable. Branding attaches a phantom marker so the compiler treats otherwise identical types as distinct.',
              points: [
                { term: 'The phantom property', detail: 'Intersecting a base type with an object carrying a unique brand marker gives it a nominal identity that plain values do not have.' },
                { term: 'Prevents mixing', detail: 'A currency amount branded as USD cannot be passed where EUR is expected, catching category errors that structural typing would miss.' },
                { term: 'No runtime cost', detail: 'The brand exists only in the type system, so branded values are just ordinary numbers or strings at run time.' },
                { term: 'Construct through helpers', detail: 'Because the brand is fake at runtime, you create branded values with a small function that asserts the brand in one controlled spot.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'ts-brand-validation',
        title: 'Validated Branded Types',
        level: 2,
        slug: 'validated-brands',
        concepts: [
          {
            id: 'ts-brand-valid',
            code: "type Email = string & { readonly __brand: 'Email' };\n\nfunction validateEmail(input: string): Email {\n  if (!input.includes('@')) throw new Error('Invalid email');\n  return input as Email;\n}\n\nfunction sendMail(to: Email, body: string): void {\n  // 'to' is guaranteed to be a validated email\n}",
            note: 'Combine branding with validation functions to create types that can only be constructed through runtime checks, encoding invariants in the type system.',
            explanation: {
              heading: 'Validated branded types',
              intro: 'Branding becomes far more powerful when the only way to obtain a branded value is through a validation function. This encodes an invariant such as a well-formed email into the type itself.',
              points: [
                { term: 'Validation as the gate', detail: 'A function checks the input, throws on failure, and returns the branded type on success, so the brand implies the check passed.' },
                { term: 'Invariants in the type', detail: 'Once a value carries the brand, downstream code can trust it is valid without re-checking, because it could only be made one way.' },
                { term: 'Centralized rules', detail: 'The validation logic lives in a single function, so the rule for what counts as valid is defined and maintained in one place.' },
                { term: 'Fail fast', detail: 'Validating at the boundary where data enters the system keeps invalid values from spreading deep into your code.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 30. Type Compatibility & Structural Typing ────────────────────────
  {
    id: 'ts-structural-typing',
    title: 'Structural Typing & Compatibility',
    level: 1,
    slug: 'structural-typing',
    concepts: [],
    children: [
      {
        id: 'ts-structural-basics',
        title: 'Structural vs Nominal',
        level: 2,
        slug: 'structural-basics',
        concepts: [
          {
            id: 'ts-structural-intro',
            code: "interface Point2D { x: number; y: number }\ninterface Point3D { x: number; y: number; z: number }\n\nfunction plotXY(p: Point2D) { /* ... */ }\n\nconst p3: Point3D = { x: 1, y: 2, z: 3 };\nplotXY(p3); // OK — Point3D is structurally compatible with Point2D",
            note: 'TypeScript is structurally typed: if an object has the required properties, it is assignable regardless of its declared type. Extra properties are allowed when passing variables (but not literals).',
            explanation: {
              heading: 'Structural versus nominal typing',
              intro: 'TypeScript decides compatibility by shape rather than by name, which is called structural typing. An object is accepted anywhere its required members are present, no matter what type it was declared as.',
              points: [
                { term: 'Shape decides compatibility', detail: 'If a value has all the members a target type needs, it is assignable even if the two types were declared separately.' },
                { term: 'Extra members are fine', detail: 'A richer object can stand in for a simpler expected type, so a 3D point works where a 2D point is required.' },
                { term: 'Contrast with nominal systems', detail: 'Many languages require matching declared names, whereas TypeScript only cares that the structures line up.' },
                { term: 'When you want names', detail: 'If structural matching is too loose for a case, the brand pattern simulates nominal typing on top of it.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'ts-excess-property',
        title: 'Excess Property Checks',
        level: 2,
        slug: 'excess-property-checks',
        concepts: [
          {
            id: 'ts-excess-prop',
            code: "interface Config { host: string; port: number }\n\n// Error: Object literal may only specify known properties\n// const c: Config = { host: 'localhost', port: 3000, debug: true };\n\n// Workaround: assign to variable first or use index signature\nconst obj = { host: 'localhost', port: 3000, debug: true };\nconst c: Config = obj; // OK — no excess property check on variables",
            note: 'Object literals undergo stricter "excess property checks" to catch typos and unexpected keys. This only applies to direct literal assignments.',
            explanation: {
              heading: 'Excess property checks',
              intro: 'Although structural typing normally allows extra members, TypeScript applies a stricter check when you assign an object literal directly. This special rule catches typos and stray keys right at the point of assignment.',
              points: [
                { term: 'Fresh literals are strict', detail: 'A newly written object literal assigned to a typed target may only contain known properties, so an unexpected key is flagged.' },
                { term: 'Why the extra check', detail: 'It exists to catch mistakes like a misspelled option name that structural typing would otherwise quietly permit.' },
                { term: 'Assigning through a variable', detail: 'Storing the literal in a variable first relaxes the check, because the freshness that triggers it is lost.' },
                { term: 'Index signatures opt out', detail: 'Adding an index signature to the target type tells the compiler extra keys are expected, disabling the check intentionally.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

];

export default topics;
