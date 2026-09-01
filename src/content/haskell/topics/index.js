// Haskell topic tree.
//
// Each node is a ConceptNode: { id, title, level, slug?, concepts[], children[] }.
// Routable nodes carry a `slug`. Every Concept renders in the fixed order
// code -> note -> example (example optional).

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  // 1. Getting Started
  {
    id: 'hs-getting-started',
    title: 'Getting Started & GHCi',
    level: 1,
    slug: 'getting-started',
    concepts: [],
    children: [
      {
        id: 'hs-hello-world',
        title: 'Hello, World',
        level: 2,
        slug: 'hello-world',
        concepts: [
          {
            id: 'hs-hello-world-intro',
            code: 'main :: IO ()\nmain = putStrLn "Hello, World!"',
            note: 'Every executable Haskell program starts from `main`, which has type `IO ()`. `putStrLn` prints a string followed by a newline. You compile with `ghc` or run directly with `runghc`.',
            explanation: {
              heading: 'Program structure',
              intro: 'A Haskell program begins execution at the main action, and printing to the screen is an input-output action rather than an ordinary function.',
              points: [
                { term: 'main entry point', detail: 'The runtime runs the top-level action named main.' },
                { term: 'putStrLn prints', detail: 'The put-string-line action writes a string followed by a newline.' },
                { term: 'IO is a type', detail: 'Actions that touch the outside world have an IO type in their signature.' },
                { term: 'Compiled or interpreted', detail: 'You can compile with the compiler or run interactively in the interpreter.' },
              ],
            },
            example: '-- Compile and run\n-- $ ghc hello.hs && ./hello\n-- Hello, World!',
          },
        ],
        children: [],
      },
      {
        id: 'hs-ghci',
        title: 'The GHCi REPL',
        level: 2,
        slug: 'ghci',
        concepts: [
          {
            id: 'hs-ghci-basics',
            code: 'ghci> 2 + 3\n5\nghci> :type "hello"\n"hello" :: String\nghci> :info Bool\ndata Bool = False | True',
            note: 'GHCi is the interactive interpreter for Haskell. You can evaluate expressions, inspect types with `:type` (or `:t`), and view definitions with `:info` (or `:i`). It is the fastest way to explore the language.',
            explanation: {
              heading: 'The interpreter',
              intro: 'The interactive interpreter lets you evaluate expressions, inspect types, and experiment without compiling a whole program.',
              points: [
                { term: 'Evaluate expressions', detail: 'Typing an expression prints its evaluated result immediately.' },
                { term: 'Type command', detail: 'A type command shows the inferred type of any expression.' },
                { term: 'Fast feedback', detail: 'It is ideal for learning and quickly testing ideas.' },
                { term: 'Info command', detail: 'An info command reveals definitions and instances for a name.' },
              ],
            },
          },
          {
            id: 'hs-ghci-load',
            code: 'ghci> :load Main.hs\nghci> :reload\nghci> :browse\nghci> :quit',
            note: 'Use `:load` (`:l`) to bring a source file into scope and `:reload` (`:r`) to pick up edits. `:browse` lists everything a module exports. These commands turn GHCi into a live workbench for your code.',
            explanation: {
              heading: 'Loading files',
              intro: 'You can load a source file into the interpreter to call its functions interactively and reload after edits.',
              points: [
                { term: 'Load command', detail: 'A load command brings a source file\'s definitions into scope.' },
                { term: 'Reload command', detail: 'A reload command re-reads the file after you change it.' },
                { term: 'Interactive testing', detail: 'Loaded functions can be called directly at the prompt.' },
                { term: 'Rapid iteration', detail: 'Editing and reloading gives a tight development loop.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 2. Expressions & Types
  {
    id: 'hs-expressions-types',
    title: 'Expressions & Types',
    level: 1,
    slug: 'expressions-types',
    concepts: [],
    children: [
      {
        id: 'hs-basic-types',
        title: 'Basic Types',
        level: 2,
        slug: 'basic-types',
        concepts: [
          {
            id: 'hs-basic-types-intro',
            code: "n :: Int\nn = 42\n\npi' :: Double\npi' = 3.14159\n\nletter :: Char\nletter = 'a'\n\nflag :: Bool\nflag = True\n\ngreeting :: String  -- String is [Char]\ngreeting = \"hi\"",
            note: 'Haskell is statically typed with full type inference. Common base types include `Int` (fixed-width), `Integer` (arbitrary precision), `Double`, `Char`, `Bool`, and `String`. You rarely need to write signatures for local values, but they aid readability.',
            explanation: {
              heading: 'Basic types',
              intro: 'Haskell is statically typed with a strong set of built-in types, and every value has a type known at compile time.',
              points: [
                { term: 'Int and Integer', detail: 'Int is a fixed-size integer while Integer has arbitrary precision.' },
                { term: 'Bool and Char', detail: 'Bool holds true or false and Char holds a single character.' },
                { term: 'Double for reals', detail: 'Double represents floating-point numbers.' },
                { term: 'Strong static typing', detail: 'The compiler checks all types before the program runs.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'hs-type-signatures',
        title: 'Type Signatures & Inference',
        level: 2,
        slug: 'type-signatures',
        concepts: [
          {
            id: 'hs-type-sig-intro',
            code: "square :: Int -> Int\nsquare x = x * x\n\n-- Inference works without a signature too\ndouble x = x + x",
            note: 'A signature `name :: Type` documents intent and lets the compiler check your code. The `::` reads as "has type". Even without an explicit signature, Haskell infers the most general type for every expression.',
            explanation: {
              heading: 'Type signatures',
              intro: 'A type signature declares the type of a function, and although the compiler can infer types, explicit signatures document intent and catch mistakes.',
              points: [
                { term: 'Double colon', detail: 'The double colon reads as has type and precedes the type.' },
                { term: 'Arrows for functions', detail: 'Arrows separate argument types from the result type.' },
                { term: 'Inference available', detail: 'The compiler infers types even when you omit the signature.' },
                { term: 'Documentation', detail: 'Explicit signatures make top-level functions easier to understand.' },
              ],
            },
            example: 'ghci> :type square\nsquare :: Int -> Int',
          },
        ],
        children: [],
      },
      {
        id: 'hs-immutability',
        title: 'Immutability & Purity',
        level: 2,
        slug: 'immutability',
        concepts: [
          {
            id: 'hs-immutability-intro',
            code: 'x :: Int\nx = 10\n-- x = 20  -- illegal: names are bound once, not reassigned',
            note: 'Values in Haskell are immutable: a name refers to a single value for its whole scope. Functions are pure by default, meaning they cannot mutate state or perform side effects. This makes code easier to reason about and safe to evaluate lazily.',
            explanation: {
              heading: 'Immutability',
              intro: 'Haskell values are immutable, so a name always refers to the same value and there is no assignment that changes existing data.',
              points: [
                { term: 'No mutation', detail: 'Once bound, a value never changes for the rest of its scope.' },
                { term: 'New values instead', detail: 'Transformations produce fresh values rather than editing old ones.' },
                { term: 'Easier reasoning', detail: 'Immutability removes a large class of state-related bugs.' },
                { term: 'Safe sharing', detail: 'Immutable data can be shared freely without defensive copying.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 3. Functions & Currying
  {
    id: 'hs-functions',
    title: 'Functions & Currying',
    level: 1,
    slug: 'functions',
    concepts: [],
    children: [
      {
        id: 'hs-function-basics',
        title: 'Defining Functions',
        level: 2,
        slug: 'function-basics',
        concepts: [
          {
            id: 'hs-function-def',
            code: "add :: Int -> Int -> Int\nadd x y = x + y\n\ngreet :: String -> String\ngreet name = \"Hello, \" ++ name",
            note: 'Functions are defined by writing the name, its parameters, and the body after `=`. Application uses whitespace, not parentheses: `add 2 3`. Function calls bind more tightly than any operator.',
            explanation: {
              heading: 'Defining functions',
              intro: 'Functions are defined by equations that give the result for their arguments, and application is written simply by juxtaposition.',
              points: [
                { term: 'Equation style', detail: 'You define a function by writing its name, arguments, and result.' },
                { term: 'Application by space', detail: 'Calling a function places arguments after the name separated by spaces.' },
                { term: 'No parentheses needed', detail: 'Function application does not require wrapping arguments in parentheses.' },
                { term: 'Pure by default', detail: 'A plain function has no side effects and depends only on its inputs.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'hs-currying',
        title: 'Currying & Partial Application',
        level: 2,
        slug: 'currying',
        concepts: [
          {
            id: 'hs-currying-intro',
            code: "add :: Int -> Int -> Int\nadd x y = x + y\n\naddFive :: Int -> Int\naddFive = add 5   -- partial application\n\nresult = addFive 10  -- 15",
            note: 'Every function in Haskell takes exactly one argument and returns a function for the rest. This is called currying: `Int -> Int -> Int` really means `Int -> (Int -> Int)`. Supplying fewer arguments than expected yields a new function.',
            explanation: {
              heading: 'Currying',
              intro: 'Every Haskell function of several arguments is really a chain of one-argument functions, so you can partially apply it to get a new function.',
              points: [
                { term: 'One argument at a time', detail: 'A multi-argument function takes one argument and returns another function.' },
                { term: 'Partial application', detail: 'Supplying some arguments yields a function awaiting the rest.' },
                { term: 'Right-associative arrows', detail: 'The arrows in a type group to the right, reflecting the chaining.' },
                { term: 'Enables composition', detail: 'Currying makes it easy to build specialized functions from general ones.' },
              ],
            },
            example: 'ghci> map (add 100) [1, 2, 3]\n[101,102,103]',
          },
        ],
        children: [],
      },
      {
        id: 'hs-lambdas',
        title: 'Lambdas & Operators',
        level: 2,
        slug: 'lambdas',
        concepts: [
          {
            id: 'hs-lambda-intro',
            code: "square = \\x -> x * x\n\n-- Infix use of a named function with backticks\nseven = 3 `add` 4\n\n-- Operator sections\ntimesTwo = (* 2)\nsubFrom10 = (10 -)",
            note: 'Anonymous functions use `\\arg -> body` syntax (the backslash resembles a lambda). Any two-argument function can be used infix with backticks, and operators can be partially applied as "sections" like `(* 2)`.',
            explanation: {
              heading: 'Lambda expressions',
              intro: 'A lambda is an anonymous function written inline, useful for short functions passed to higher-order functions.',
              points: [
                { term: 'Backslash syntax', detail: 'A backslash introduces the parameters of an anonymous function.' },
                { term: 'Arrow to body', detail: 'An arrow separates the parameters from the function body.' },
                { term: 'Inline use', detail: 'Lambdas are handy as arguments to functions like map.' },
                { term: 'Closures', detail: 'A lambda captures variables from its surrounding scope.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 4. Pattern Matching
  {
    id: 'hs-pattern-matching',
    title: 'Pattern Matching',
    level: 1,
    slug: 'pattern-matching',
    concepts: [],
    children: [
      {
        id: 'hs-pattern-basics',
        title: 'Matching on Values',
        level: 2,
        slug: 'pattern-basics',
        concepts: [
          {
            id: 'hs-pattern-intro',
            code: "describe :: Int -> String\ndescribe 0 = \"zero\"\ndescribe 1 = \"one\"\ndescribe _ = \"many\"",
            note: 'A function can be defined by several equations, each matching a different pattern. Patterns are tried top to bottom, and the first match wins. The underscore `_` is a wildcard that matches anything without binding a name.',
            explanation: {
              heading: 'Pattern matching',
              intro: 'Functions can be defined by multiple equations that match on the shape of their arguments, choosing the first pattern that fits.',
              points: [
                { term: 'Match by shape', detail: 'Each equation matches a particular form of the input.' },
                { term: 'Top-down order', detail: 'The first matching equation from the top is used.' },
                { term: 'Literal patterns', detail: 'You can match specific values like zero directly.' },
                { term: 'Wildcard', detail: 'An underscore matches anything without binding it.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'hs-list-patterns',
        title: 'Deconstructing Lists & Tuples',
        level: 2,
        slug: 'list-patterns',
        concepts: [
          {
            id: 'hs-list-pattern-intro',
            code: "sumList :: [Int] -> Int\nsumList [] = 0\nsumList (x:xs) = x + sumList xs\n\nfst' :: (a, b) -> a\nfst' (a, _) = a",
            note: 'The pattern `(x:xs)` splits a non-empty list into its head `x` and tail `xs`, while `[]` matches the empty list. Tuples are matched by shape, e.g. `(a, _)`. Deconstruction like this is the natural way to walk data structures.',
            explanation: {
              heading: 'List patterns',
              intro: 'Lists are matched by splitting them into a head element and a tail list, which drives most recursive list processing.',
              points: [
                { term: 'Cons pattern', detail: 'The cons operator pattern separates the first element from the rest.' },
                { term: 'Empty list pattern', detail: 'The empty list pattern handles the base case of a recursion.' },
                { term: 'Recursive processing', detail: 'Splitting head and tail lets a function recurse over a list.' },
                { term: 'Fixed-length patterns', detail: 'You can match lists of an exact small length by listing elements.' },
              ],
            },
            example: 'ghci> sumList [1, 2, 3, 4]\n10',
          },
        ],
        children: [],
      },
      {
        id: 'hs-as-patterns',
        title: 'As-Patterns & Case',
        level: 2,
        slug: 'as-patterns',
        concepts: [
          {
            id: 'hs-as-pattern-intro',
            code: "firstTwoSame :: [Int] -> Bool\nfirstTwoSame all@(x:y:_) = x == y\nfirstTwoSame _ = False\n\nclassify :: Int -> String\nclassify n = case compare n 0 of\n  LT -> \"negative\"\n  EQ -> \"zero\"\n  GT -> \"positive\"",
            note: 'An as-pattern `name@pattern` binds the whole value to `name` while still matching its structure. The `case ... of` expression pattern-matches inline on any expression, which is handy when you cannot split across function equations.',
            explanation: {
              heading: 'As-patterns',
              intro: 'An as-pattern binds a name to a whole value while also matching its internal structure, so you can refer to both at once.',
              points: [
                { term: 'At sign binds whole', detail: 'The at sign names the entire value alongside its pattern.' },
                { term: 'Avoid rebuilding', detail: 'You reuse the original value instead of reconstructing it from parts.' },
                { term: 'Clearer code', detail: 'It keeps both the whole and its pieces available in one equation.' },
                { term: 'Common with lists', detail: 'It often pairs with a head-tail pattern on lists.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 5. Guards, let & where
  {
    id: 'hs-guards-bindings',
    title: 'Guards, let & where',
    level: 1,
    slug: 'guards-bindings',
    concepts: [],
    children: [
      {
        id: 'hs-guards',
        title: 'Guards',
        level: 2,
        slug: 'guards',
        concepts: [
          {
            id: 'hs-guards-intro',
            code: "grade :: Int -> Char\ngrade score\n  | score >= 90 = 'A'\n  | score >= 80 = 'B'\n  | score >= 70 = 'C'\n  | otherwise   = 'F'",
            note: 'Guards are boolean conditions written after `|` that select which equation body to use. They are tested top to bottom, and `otherwise` (which is just `True`) serves as the catch-all. Guards keep multi-branch logic readable.',
            explanation: {
              heading: 'Guards',
              intro: 'Guards attach boolean conditions to a function equation, selecting a result based on tests rather than only on structural shape.',
              points: [
                { term: 'Boolean conditions', detail: 'Each guard is a condition checked in order from the top.' },
                { term: 'otherwise catch-all', detail: 'The otherwise guard is always true and acts as a default.' },
                { term: 'Pipe syntax', detail: 'A vertical bar introduces each guarded alternative.' },
                { term: 'Cleaner than nested if', detail: 'Guards read more clearly than deeply nested conditional expressions.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'hs-where',
        title: 'where Bindings',
        level: 2,
        slug: 'where',
        concepts: [
          {
            id: 'hs-where-intro',
            code: "bmiTell :: Double -> Double -> String\nbmiTell weight height\n  | bmi <= thin = \"underweight\"\n  | bmi <= fat  = \"normal\"\n  | otherwise   = \"overweight\"\n  where bmi  = weight / height ^ 2\n        thin = 18.5\n        fat  = 25.0",
            note: 'A `where` clause introduces helper definitions that are visible across all guards and the whole function body. It appears after the equation, which keeps the main logic up front and supporting details below.',
            explanation: {
              heading: 'where clauses',
              intro: 'A where clause defines helper bindings local to a function equation, keeping intermediate names close to where they are used.',
              points: [
                { term: 'Local definitions', detail: 'Names in a where clause are visible only within that equation.' },
                { term: 'Shared across guards', detail: 'Where bindings can be used by all guards of the equation.' },
                { term: 'Improves readability', detail: 'Naming subexpressions clarifies what a formula computes.' },
                { term: 'Defined after use', detail: 'The helper appears below the main expression that references it.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'hs-let',
        title: 'let Expressions',
        level: 2,
        slug: 'let',
        concepts: [
          {
            id: 'hs-let-intro',
            code: "cylinderArea :: Double -> Double -> Double\ncylinderArea r h =\n  let sideArea = 2 * pi * r * h\n      topArea  = pi * r ^ 2\n  in sideArea + 2 * topArea",
            note: '`let ... in ...` binds local names within a single expression. Unlike `where`, `let` is itself an expression and can appear almost anywhere. Use `let` for tightly-scoped intermediate values.',
            explanation: {
              heading: 'let expressions',
              intro: 'A let expression introduces local bindings within an expression, defining values before the part that uses them.',
              points: [
                { term: 'Local bindings', detail: 'let names values available in the following expression.' },
                { term: 'Expression scoped', detail: 'Unlike where, let is itself an expression that yields a value.' },
                { term: 'let and in', detail: 'The bindings after let are used in the expression after in.' },
                { term: 'Handy in do blocks', detail: 'A let without in binds values inside a do block.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 6. Lists & Ranges
  {
    id: 'hs-lists',
    title: 'Lists & Ranges',
    level: 1,
    slug: 'lists',
    concepts: [],
    children: [
      {
        id: 'hs-list-basics',
        title: 'List Basics',
        level: 2,
        slug: 'list-basics',
        concepts: [
          {
            id: 'hs-list-basics-intro',
            code: "nums = [1, 2, 3, 4, 5]\n\nhead nums    -- 1\ntail nums    -- [2,3,4,5]\nlength nums  -- 5\n0 : nums     -- [0,1,2,3,4,5]  (cons)\n[1,2] ++ [3] -- [1,2,3]        (append)",
            note: 'A list holds any number of values of the same type. `:` (cons) prepends a single element, and `++` concatenates two lists. Elements are accessed with functions like `head`, `tail`, and `!!` rather than index syntax.',
            explanation: {
              heading: 'Lists',
              intro: 'The list is Haskell\'s fundamental collection, a homogeneous sequence built from cons cells and processed heavily by recursion and higher-order functions.',
              points: [
                { term: 'Homogeneous', detail: 'Every element of a list shares the same type.' },
                { term: 'Built with cons', detail: 'Lists are formed by prepending elements onto the empty list.' },
                { term: 'Head and tail', detail: 'A list is its first element followed by the remaining list.' },
                { term: 'Lazy', detail: 'Lists can be infinite because elements are produced on demand.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'hs-ranges',
        title: 'Ranges',
        level: 2,
        slug: 'ranges',
        concepts: [
          {
            id: 'hs-ranges-intro',
            code: "[1..5]      -- [1,2,3,4,5]\n[2,4..10]   -- [2,4,6,8,10]  (step of 2)\n['a'..'e']  -- \"abcde\"\n[10,9..1]   -- [10,9,8,7,6,5,4,3,2,1]",
            note: 'Ranges generate sequences from a start (and optional second element to set the step) to an end. They work for any enumerable type, including characters. Ranges are lazy, so you can even write infinite ones like `[1..]`.',
            explanation: {
              heading: 'Ranges',
              intro: 'Range notation generates lists of sequential values, and thanks to laziness these ranges can even be infinite.',
              points: [
                { term: 'Dot-dot notation', detail: 'Two dots between bounds produce a list of values in that interval.' },
                { term: 'Step by example', detail: 'Giving the first two elements sets the step between values.' },
                { term: 'Works on enums', detail: 'Ranges work for any enumerable type, including characters.' },
                { term: 'Infinite ranges', detail: 'Omitting the upper bound creates an infinite list evaluated lazily.' },
              ],
            },
            example: "ghci> take 5 [1..]\n[1,2,3,4,5]",
          },
        ],
        children: [],
      },
    ],
  },

  // 7. List Comprehensions
  {
    id: 'hs-comprehensions',
    title: 'List Comprehensions',
    level: 1,
    slug: 'comprehensions',
    concepts: [],
    children: [
      {
        id: 'hs-comprehension-basics',
        title: 'Generators & Filters',
        level: 2,
        slug: 'comprehension-basics',
        concepts: [
          {
            id: 'hs-comprehension-intro',
            code: "squares = [x * x | x <- [1..10]]\n-- [1,4,9,16,25,36,49,64,81,100]\n\nevens = [x | x <- [1..20], even x]\n-- [2,4,6,8,10,12,14,16,18,20]",
            note: 'A list comprehension reads as "the list of `expr` for each `x` drawn from a source". The `x <- source` part is a generator, and any boolean expression after a comma acts as a filter (guard). It mirrors set-builder notation in math.',
            explanation: {
              heading: 'List comprehensions',
              intro: 'A list comprehension builds a new list by drawing elements from a source, optionally filtering them, and transforming each one.',
              points: [
                { term: 'Generator', detail: 'An arrow clause draws elements from a source list.' },
                { term: 'Predicate', detail: 'A boolean condition filters which elements are kept.' },
                { term: 'Output expression', detail: 'The part before the pipe describes each result element.' },
                { term: 'Set-builder style', detail: 'The notation mirrors mathematical set-builder syntax.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'hs-comprehension-multi',
        title: 'Multiple Generators',
        level: 2,
        slug: 'comprehension-multi',
        concepts: [
          {
            id: 'hs-comprehension-multi-intro',
            code: "pairs = [(x, y) | x <- [1..3], y <- \"ab\"]\n-- [(1,'a'),(1,'b'),(2,'a'),(2,'b'),(3,'a'),(3,'b')]\n\npythag = [(a, b, c) | c <- [1..20], b <- [1..c], a <- [1..b], a^2 + b^2 == c^2]",
            note: 'Multiple generators nest like loops: the rightmost varies fastest. Combined with guards, comprehensions express rich queries such as finding Pythagorean triples in a single readable line.',
            explanation: {
              heading: 'Multiple generators',
              intro: 'A comprehension can draw from several generators at once, combining them like nested loops to produce every combination.',
              points: [
                { term: 'Nested iteration', detail: 'Multiple generators behave like nested loops over each source.' },
                { term: 'Rightmost varies fastest', detail: 'The last generator advances most quickly as elements are produced.' },
                { term: 'Combined filters', detail: 'Predicates can reference variables from any generator.' },
                { term: 'Cartesian products', detail: 'Two generators easily produce all pairs of their elements.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 8. Higher-Order Functions
  {
    id: 'hs-higher-order',
    title: 'Higher-Order Functions',
    level: 1,
    slug: 'higher-order',
    concepts: [],
    children: [
      {
        id: 'hs-map-filter',
        title: 'map & filter',
        level: 2,
        slug: 'map-filter',
        concepts: [
          {
            id: 'hs-map-filter-intro',
            code: "map (* 2) [1, 2, 3]        -- [2,4,6]\nfilter even [1..10]        -- [2,4,6,8,10]\nmap show [1, 2, 3]         -- [\"1\",\"2\",\"3\"]",
            note: '`map` applies a function to every element of a list, producing a new list. `filter` keeps only the elements that satisfy a predicate. Both take a function as an argument, which is what makes them higher-order.',
            explanation: {
              heading: 'map and filter',
              intro: 'The map and filter functions are core higher-order tools that transform every element or keep only those passing a test.',
              points: [
                { term: 'map transforms', detail: 'map applies a function to each element and returns the results.' },
                { term: 'filter selects', detail: 'filter keeps only elements for which the predicate is true.' },
                { term: 'Higher-order', detail: 'Both take a function as their first argument.' },
                { term: 'Lazy results', detail: 'The resulting list is produced lazily as it is consumed.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'hs-folds',
        title: 'foldr & foldl',
        level: 2,
        slug: 'folds',
        concepts: [
          {
            id: 'hs-folds-intro',
            code: "foldr (+) 0 [1, 2, 3]   -- 1 + (2 + (3 + 0)) = 6\nfoldl (+) 0 [1, 2, 3]   -- ((0 + 1) + 2) + 3 = 6\nfoldr (:) [] [1, 2, 3]  -- [1,2,3]  (rebuilds the list)",
            note: 'Folds collapse a list into a single value using an accumulator. `foldr` associates to the right and works with lazy/infinite structures, while `foldl` (or the stricter `foldl\'`) associates left. Most list operations can be expressed as a fold.',
            explanation: {
              heading: 'Folds',
              intro: 'Folds collapse a list into a single value by repeatedly combining elements with an accumulator, generalizing many aggregation patterns.',
              points: [
                { term: 'foldr and foldl', detail: 'foldr associates from the right and foldl from the left.' },
                { term: 'Accumulator', detail: 'A running value threads through each combining step.' },
                { term: 'Seed value', detail: 'You provide an initial value to start the accumulation.' },
                { term: 'General aggregation', detail: 'Sum, product, and length are all expressible as folds.' },
              ],
            },
            example: "product' = foldr (*) 1\nghci> product' [1, 2, 3, 4]\n24",
          },
        ],
        children: [],
      },
      {
        id: 'hs-zip-apply',
        title: 'zipWith & Function Arguments',
        level: 2,
        slug: 'zip-apply',
        concepts: [
          {
            id: 'hs-zipwith-intro',
            code: "zipWith (+) [1, 2, 3] [10, 20, 30]  -- [11,22,33]\n\napplyTwice :: (a -> a) -> a -> a\napplyTwice f x = f (f x)\n\napplyTwice (+ 3) 10  -- 16",
            note: '`zipWith` combines two lists element by element using a function. Functions like `applyTwice` show how easily Haskell passes functions around, letting you build powerful abstractions from small pieces.',
            explanation: {
              heading: 'zip and zipWith',
              intro: 'The zip family combines two lists element by element, either into pairs or by applying a function to each corresponding pair.',
              points: [
                { term: 'zip makes pairs', detail: 'zip pairs up elements from two lists by position.' },
                { term: 'zipWith applies a function', detail: 'zipWith combines each corresponding pair with a supplied function.' },
                { term: 'Stops at shortest', detail: 'The result length matches the shorter of the two lists.' },
                { term: 'Parallel processing', detail: 'It is ideal for working through two sequences in lockstep.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 9. Recursion
  {
    id: 'hs-recursion',
    title: 'Recursion',
    level: 1,
    slug: 'recursion',
    concepts: [],
    children: [
      {
        id: 'hs-recursion-basics',
        title: 'Recursive Definitions',
        level: 2,
        slug: 'recursion-basics',
        concepts: [
          {
            id: 'hs-recursion-intro',
            code: "factorial :: Integer -> Integer\nfactorial 0 = 1\nfactorial n = n * factorial (n - 1)\n\nfibonacci :: Int -> Int\nfibonacci 0 = 0\nfibonacci 1 = 1\nfibonacci n = fibonacci (n - 1) + fibonacci (n - 2)",
            note: 'Haskell has no loops, so repetition is expressed with recursion. Each definition needs at least one base case to stop and a recursive case that moves toward it. Pattern matching makes base and recursive cases read cleanly.',
            explanation: {
              heading: 'Recursion',
              intro: 'Without loops, Haskell expresses repetition through recursion, defining a base case and a recursive case that shrinks toward it.',
              points: [
                { term: 'Base case', detail: 'A non-recursive case stops the recursion and returns a result.' },
                { term: 'Recursive case', detail: 'The function calls itself on a smaller input.' },
                { term: 'No loops', detail: 'Haskell replaces imperative loops with recursive definitions.' },
                { term: 'Pattern-driven', detail: 'Pattern matching usually distinguishes the base and recursive cases.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'hs-accumulator-recursion',
        title: 'Accumulator Recursion',
        level: 2,
        slug: 'accumulator-recursion',
        concepts: [
          {
            id: 'hs-accumulator-intro',
            code: "sumList :: [Int] -> Int\nsumList = go 0\n  where go acc []     = acc\n        go acc (x:xs) = go (acc + x) xs",
            note: 'An accumulator carries a running result through each recursive call. This turns the recursion into a tight tail-recursive loop, which the compiler can optimize to avoid growing the call stack. It is a common pattern for efficient traversals.',
            explanation: {
              heading: 'Accumulator recursion',
              intro: 'An accumulator parameter carries a partial result through recursive calls, often enabling more efficient tail-recursive definitions.',
              points: [
                { term: 'Extra parameter', detail: 'A helper function threads a running result as an additional argument.' },
                { term: 'Tail recursion', detail: 'The recursive call is the last action, which the compiler can optimize.' },
                { term: 'Avoids buildup', detail: 'It can prevent large chains of deferred computations from accumulating.' },
                { term: 'Hidden helper', detail: 'The accumulator is usually kept in an inner worker function.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 10. Tuples
  {
    id: 'hs-tuples',
    title: 'Tuples',
    level: 1,
    slug: 'tuples',
    concepts: [],
    children: [
      {
        id: 'hs-tuple-basics',
        title: 'Tuple Basics',
        level: 2,
        slug: 'tuple-basics',
        concepts: [
          {
            id: 'hs-tuple-intro',
            code: "point :: (Int, Int)\npoint = (3, 4)\n\nfst point   -- 3\nsnd point   -- 4\n\nrecord :: (String, Int, Bool)\nrecord = (\"Ada\", 36, True)",
            note: 'A tuple groups a fixed number of values that may have different types. Its length and the type of each position are part of the type. `fst` and `snd` access the two components of a pair; larger tuples are usually deconstructed with pattern matching.',
            explanation: {
              heading: 'Tuples',
              intro: 'A tuple bundles a fixed number of values of possibly different types, useful for returning several results from a function.',
              points: [
                { term: 'Fixed size', detail: 'The number of elements is part of the tuple\'s type.' },
                { term: 'Mixed types', detail: 'Each position can hold a different type.' },
                { term: 'fst and snd', detail: 'Built-in helpers extract the two parts of a pair.' },
                { term: 'Pattern matching', detail: 'You can destructure a tuple to bind its components.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'hs-tuple-patterns',
        title: 'Tuples in Practice',
        level: 2,
        slug: 'tuple-patterns',
        concepts: [
          {
            id: 'hs-tuple-zip',
            code: "zip [1, 2, 3] \"abc\"  -- [(1,'a'),(2,'b'),(3,'c')]\n\ndistance :: (Double, Double) -> (Double, Double) -> Double\ndistance (x1, y1) (x2, y2) = sqrt ((x2 - x1)^2 + (y2 - y1)^2)",
            note: '`zip` pairs up two lists into a list of tuples, which is great for iterating with indices or labels. Destructuring tuples directly in a function\'s parameters, as in `distance`, keeps coordinate-style code concise.',
            explanation: {
              heading: 'Pairs and zipping',
              intro: 'Pairs work naturally with the zip functions, which combine two lists into a list of tuples for parallel processing.',
              points: [
                { term: 'List of pairs', detail: 'Zipping two lists produces a list of two-element tuples.' },
                { term: 'unzip reverses it', detail: 'The unzip function splits a list of pairs back into two lists.' },
                { term: 'Index by zipping', detail: 'Zipping with a range attaches a position to each element.' },
                { term: 'Destructure in map', detail: 'A lambda can pattern-match each pair while mapping.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 11. Algebraic Data Types
  {
    id: 'hs-adts',
    title: 'Algebraic Data Types',
    level: 1,
    slug: 'algebraic-data-types',
    concepts: [],
    children: [
      {
        id: 'hs-adt-basics',
        title: 'data Declarations',
        level: 2,
        slug: 'adt-basics',
        concepts: [
          {
            id: 'hs-adt-intro',
            code: "data Color = Red | Green | Blue\n\ndata Shape\n  = Circle Double\n  | Rectangle Double Double\n\narea :: Shape -> Double\narea (Circle r)      = pi * r * r\narea (Rectangle w h) = w * h",
            note: 'The `data` keyword defines a new type as a choice between constructors separated by `|`. Constructors can carry fields (like `Circle Double`). Functions handle each case by pattern matching, and the compiler warns if you miss one.',
            explanation: {
              heading: 'Algebraic data types',
              intro: 'The data keyword defines new types as a choice among constructors, each of which may carry fields, modeling data precisely.',
              points: [
                { term: 'Sum of constructors', detail: 'A type can be one of several named constructors separated by a bar.' },
                { term: 'Constructors carry data', detail: 'Each constructor may hold zero or more typed fields.' },
                { term: 'Pattern match to use', detail: 'You inspect a value by matching on its constructor.' },
                { term: 'Precise modeling', detail: 'ADTs express exactly the valid shapes of your data.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'hs-recursive-adts',
        title: 'Recursive & Parameterized Types',
        level: 2,
        slug: 'recursive-adts',
        concepts: [
          {
            id: 'hs-recursive-adt-intro',
            code: "data Tree a\n  = Leaf\n  | Node (Tree a) a (Tree a)\n\ntreeSize :: Tree a -> Int\ntreeSize Leaf         = 0\ntreeSize (Node l _ r) = 1 + treeSize l + treeSize r",
            note: 'A data type can refer to itself, which is how you build trees and other recursive structures. The type parameter `a` makes the type generic, so a single `Tree` definition works for any element type. This combines recursion with polymorphism.',
            explanation: {
              heading: 'Recursive data types',
              intro: 'An algebraic data type can refer to itself, which lets you define recursive structures such as trees and custom lists.',
              points: [
                { term: 'Self-reference', detail: 'A constructor can contain values of the type being defined.' },
                { term: 'Trees and lists', detail: 'Recursive types naturally model branching and sequential structures.' },
                { term: 'Recursive processing', detail: 'Functions over these types usually recurse over the sub-values.' },
                { term: 'Base constructor', detail: 'A non-recursive constructor terminates the structure.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 12. Type Classes
  {
    id: 'hs-type-classes',
    title: 'Type Classes',
    level: 1,
    slug: 'type-classes',
    concepts: [],
    children: [
      {
        id: 'hs-common-classes',
        title: 'Eq, Ord, Show, Num',
        level: 2,
        slug: 'common-classes',
        concepts: [
          {
            id: 'hs-common-classes-intro',
            code: "3 == 3        -- Eq:   True\ncompare 2 5   -- Ord:  LT\nshow 42       -- Show: \"42\"\n5 + 3 * 2     -- Num:  11",
            note: 'A type class describes a set of behaviors a type can support. `Eq` provides equality, `Ord` provides ordering, `Show` converts to a string, and `Num` provides arithmetic. A constraint like `Ord a =>` in a signature means "any type that is an instance of Ord".',
            explanation: {
              heading: 'Common type classes',
              intro: 'Type classes define shared behavior across many types; common ones cover equality, ordering, and text representation.',
              points: [
                { term: 'Eq for equality', detail: 'The Eq class provides equality comparison for a type.' },
                { term: 'Ord for ordering', detail: 'The Ord class adds less-than and greater-than comparisons.' },
                { term: 'Show and Read', detail: 'Show converts values to text and Read parses them back.' },
                { term: 'Constraints', detail: 'A class appears as a constraint before the arrow in a signature.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'hs-deriving',
        title: 'Deriving Instances',
        level: 2,
        slug: 'deriving',
        concepts: [
          {
            id: 'hs-deriving-intro',
            code: "data Suit = Clubs | Diamonds | Hearts | Spades\n  deriving (Eq, Ord, Show, Enum, Bounded)\n\nshow Hearts       -- \"Hearts\"\nHearts < Spades   -- True\n[minBound ..]     -- [Clubs,Diamonds,Hearts,Spades]",
            note: 'The `deriving` clause asks the compiler to generate standard instances for you. Deriving `Eq`, `Ord`, `Show`, `Enum`, and `Bounded` covers most everyday needs without any boilerplate. Ordering follows the order the constructors are declared.',
            explanation: {
              heading: 'Deriving instances',
              intro: 'The deriving clause asks the compiler to generate standard type-class instances automatically, saving repetitive boilerplate.',
              points: [
                { term: 'Automatic instances', detail: 'The compiler writes the instance code for you.' },
                { term: 'Common classes', detail: 'You can derive Eq, Ord, Show, and several others.' },
                { term: 'Attached to data', detail: 'A deriving clause follows a data type definition.' },
                { term: 'Sensible defaults', detail: 'Derived instances follow the natural structure of the type.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'hs-custom-instances',
        title: 'Writing Instances',
        level: 2,
        slug: 'custom-instances',
        concepts: [
          {
            id: 'hs-custom-instance-intro',
            code: "data Temperature = Temp Double\n\ninstance Show Temperature where\n  show (Temp c) = show c ++ \"C\"\n\ninstance Eq Temperature where\n  Temp a == Temp b = a == b",
            note: 'When the derived behavior is not what you want, write an `instance` block that defines the class methods for your type. Here `show` adds a unit suffix. Custom instances let your types integrate with the same functions the built-in types use.',
            explanation: {
              heading: 'Custom instances',
              intro: 'When the derived behavior is not what you want, you can write an instance by hand to define exactly how a type implements a class.',
              points: [
                { term: 'instance keyword', detail: 'An instance declaration provides the methods for a class and type.' },
                { term: 'Define required methods', detail: 'You implement the class\'s methods for your specific type.' },
                { term: 'Custom behavior', detail: 'Hand-written instances control formatting or comparison precisely.' },
                { term: 'Laws matter', detail: 'Instances are expected to obey the class\'s laws for correctness.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 13. Maybe & Either
  {
    id: 'hs-maybe-either',
    title: 'Maybe & Either',
    level: 1,
    slug: 'maybe-either',
    concepts: [],
    children: [
      {
        id: 'hs-maybe',
        title: 'Maybe for Absence',
        level: 2,
        slug: 'maybe',
        concepts: [
          {
            id: 'hs-maybe-intro',
            code: "safeDiv :: Int -> Int -> Maybe Int\nsafeDiv _ 0 = Nothing\nsafeDiv x y = Just (x `div` y)\n\nsafeHead :: [a] -> Maybe a\nsafeHead []    = Nothing\nsafeHead (x:_) = Just x",
            note: '`Maybe a` represents a value that might be missing: `Just x` holds a result while `Nothing` signals absence. It replaces null and forces callers to handle the empty case explicitly, so failures never sneak past the type checker.',
            explanation: {
              heading: 'The Maybe type',
              intro: 'Maybe represents an optional value, being either Just a value or Nothing, replacing null with a type-checked alternative.',
              points: [
                { term: 'Just or Nothing', detail: 'A Maybe is either Just wrapping a value or an empty Nothing.' },
                { term: 'No null', detail: 'Optionality is explicit in the type, so absence cannot be forgotten.' },
                { term: 'Safe operations', detail: 'Functions that may fail return Maybe instead of crashing.' },
                { term: 'fromMaybe default', detail: 'A helper supplies a fallback when the value is Nothing.' },
              ],
            },
            example: "ghci> safeDiv 10 2\nJust 5\nghci> safeDiv 10 0\nNothing",
          },
        ],
        children: [],
      },
      {
        id: 'hs-either',
        title: 'Either for Errors',
        level: 2,
        slug: 'either',
        concepts: [
          {
            id: 'hs-either-intro',
            code: "parseAge :: String -> Either String Int\nparseAge s = case reads s of\n  [(n, \"\")] | n >= 0 -> Right n\n  _                  -> Left (\"invalid age: \" ++ s)",
            note: '`Either e a` carries either a `Left` error value or a `Right` success value. Unlike `Maybe`, it explains why something failed. By convention `Right` is the correct result and `Left` holds the error, often a message or error type.',
            explanation: {
              heading: 'The Either type',
              intro: 'Either carries one of two values and is commonly used for computations that yield a success or a descriptive error.',
              points: [
                { term: 'Left and Right', detail: 'By convention Right holds success and Left holds an error.' },
                { term: 'Typed errors', detail: 'The error type is part of the signature, unlike exceptions.' },
                { term: 'Pattern match', detail: 'You handle both outcomes by matching on Left and Right.' },
                { term: 'Monad instance', detail: 'Either chains fallible steps, short-circuiting on the first Left.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 14. Lazy Evaluation
  {
    id: 'hs-laziness',
    title: 'Lazy Evaluation',
    level: 1,
    slug: 'laziness',
    concepts: [],
    children: [
      {
        id: 'hs-laziness-basics',
        title: 'Lazy Evaluation Basics',
        level: 2,
        slug: 'laziness-basics',
        concepts: [
          {
            id: 'hs-laziness-intro',
            code: "ones :: [Int]\nones = 1 : ones          -- infinite list\n\ntake 5 ones              -- [1,1,1,1,1]\ntake 10 [1..]            -- [1,2,3,4,5,6,7,8,9,10]",
            note: 'Haskell evaluates expressions only when their results are needed. This lets you define and manipulate infinite structures like `[1..]` and take only the part you use. Unused computations are never performed at all.',
            explanation: {
              heading: 'Lazy evaluation',
              intro: 'Haskell evaluates expressions lazily, computing values only when they are actually needed, which enables working with infinite structures.',
              points: [
                { term: 'Evaluated on demand', detail: 'An expression is computed only when its result is required.' },
                { term: 'Thunks', detail: 'Unevaluated computations are stored as deferred thunks.' },
                { term: 'Infinite structures', detail: 'Laziness lets you define and use infinite lists safely.' },
                { term: 'Space caution', detail: 'Deferred computations can build up and use unexpected memory.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'hs-laziness-patterns',
        title: 'Working with Laziness',
        level: 2,
        slug: 'laziness-patterns',
        concepts: [
          {
            id: 'hs-laziness-fibs',
            code: "fibs :: [Integer]\nfibs = 0 : 1 : zipWith (+) fibs (tail fibs)\n\ntake 8 fibs  -- [0,1,1,2,3,5,8,13]",
            note: 'Laziness enables elegant self-referential definitions: `fibs` builds each Fibonacci number from earlier ones in the same list. Be aware that laziness can build up unevaluated "thunks", so for strict accumulation prefer `foldl\'` or bang patterns.',
            explanation: {
              heading: 'Infinite lists',
              intro: 'Because of laziness you can define a self-referential infinite list, such as the Fibonacci sequence, and take only the part you need.',
              points: [
                { term: 'Self-reference', detail: 'An infinite list can be defined in terms of itself.' },
                { term: 'take a prefix', detail: 'The take function pulls a finite number of elements from it.' },
                { term: 'Only what is needed', detail: 'Elements beyond what you consume are never computed.' },
                { term: 'Elegant definitions', detail: 'Streams like primes and Fibonacci read very concisely.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 15. Composition & Point-Free Style
  {
    id: 'hs-composition',
    title: 'Composition & Point-Free Style',
    level: 1,
    slug: 'composition',
    concepts: [],
    children: [
      {
        id: 'hs-function-composition',
        title: 'Function Composition',
        level: 2,
        slug: 'function-composition',
        concepts: [
          {
            id: 'hs-composition-intro',
            code: "import Data.Char (toUpper)\n\nshout :: String -> String\nshout = reverse . map toUpper\n\nshout \"hello\"  -- \"OLLEH\"",
            note: 'The `.` operator composes two functions: `(f . g) x` equals `f (g x)`. It reads right to left, so data flows through `g` first and then `f`. Composition lets you build a pipeline from small, reusable functions.',
            explanation: {
              heading: 'Function composition',
              intro: 'The composition operator combines two functions into one that applies them in sequence, building complex behavior from simple parts.',
              points: [
                { term: 'Dot operator', detail: 'A dot between two functions applies the right one then the left.' },
                { term: 'Right to left', detail: 'The rightmost function runs first on the input.' },
                { term: 'Build pipelines', detail: 'Composing several functions expresses a transformation chain.' },
                { term: 'Reusable', detail: 'Composed functions can themselves be named and reused.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'hs-point-free',
        title: 'Point-Free Style & $',
        level: 2,
        slug: 'point-free',
        concepts: [
          {
            id: 'hs-point-free-intro',
            code: "-- Pointful\nsumOfSquares xs = sum (map (^ 2) xs)\n\n-- Point-free\nsumOfSquares' = sum . map (^ 2)\n\n-- $ avoids parentheses\nprint $ sum [1, 2, 3]",
            note: 'Point-free style defines functions by composing others without naming the arguments, which can make intent clearer. The `$` operator applies a function with the lowest precedence, so `f $ x` lets you drop parentheses around the argument.',
            explanation: {
              heading: 'Point-free style',
              intro: 'Point-free style defines functions by composing others without explicitly naming their arguments, emphasizing what is computed over how.',
              points: [
                { term: 'No named arguments', detail: 'The function is built from composition rather than mentioning its input.' },
                { term: 'Uses composition', detail: 'It relies on the composition operator to wire functions together.' },
                { term: 'Concise', detail: 'It can make simple pipelines very compact.' },
                { term: 'Readability tradeoff', detail: 'Overusing it can obscure meaning, so apply it judiciously.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 16. Functor, Applicative & Monad
  {
    id: 'hs-fam',
    title: 'Functor, Applicative & Monad',
    level: 1,
    slug: 'functor-applicative-monad',
    concepts: [],
    children: [
      {
        id: 'hs-functor',
        title: 'Functor',
        level: 2,
        slug: 'functor',
        concepts: [
          {
            id: 'hs-functor-intro',
            code: "fmap (+ 1) (Just 5)    -- Just 6\nfmap (+ 1) Nothing     -- Nothing\nfmap (* 2) [1, 2, 3]   -- [2,4,6]\n(+ 1) <$> Just 5       -- Just 6",
            note: 'A `Functor` is anything you can map over with `fmap`, applying a function to the value(s) inside a context without touching the context itself. `Maybe`, lists, and `Either` are all functors. The `<$>` operator is an infix alias for `fmap`.',
            explanation: {
              heading: 'Functor',
              intro: 'Functor is the type class for things that can be mapped over, generalizing map to apply a function inside a container or context.',
              points: [
                { term: 'fmap generalizes map', detail: 'The fmap method applies a function to values inside a structure.' },
                { term: 'Preserves shape', detail: 'Mapping changes the contents but not the container\'s structure.' },
                { term: 'Many instances', detail: 'Lists, Maybe, and many other types are functors.' },
                { term: 'Laws', detail: 'A lawful functor preserves identity and composition of functions.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'hs-applicative',
        title: 'Applicative',
        level: 2,
        slug: 'applicative',
        concepts: [
          {
            id: 'hs-applicative-intro',
            code: "pure (+) <*> Just 3 <*> Just 4   -- Just 7\n(+) <$> Just 3 <*> Just 4        -- Just 7\n(+) <$> Just 3 <*> Nothing       -- Nothing",
            note: '`Applicative` extends `Functor` so you can apply a function that is itself inside a context using `<*>`. `pure` lifts a plain value into the context. This is what lets you combine several `Maybe` or `Either` values in one expression.',
            explanation: {
              heading: 'Applicative',
              intro: 'Applicative extends Functor so you can apply a function that is itself inside a context to a value inside a context.',
              points: [
                { term: 'pure lifts values', detail: 'The pure method wraps a plain value into the context.' },
                { term: 'Apply operator', detail: 'The apply operator combines a wrapped function with a wrapped argument.' },
                { term: 'Multiple contexts', detail: 'It lets you combine several independent contextual values.' },
                { term: 'Between functor and monad', detail: 'It is more powerful than Functor but less than Monad.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'hs-monad',
        title: 'Monad & Bind',
        level: 2,
        slug: 'monad',
        concepts: [
          {
            id: 'hs-monad-intro',
            code: "safeDiv :: Int -> Int -> Maybe Int\nsafeDiv _ 0 = Nothing\nsafeDiv x y = Just (x `div` y)\n\nchain :: Maybe Int\nchain = Just 100 >>= safeDiv 1000 >>= safeDiv 50",
            note: 'A `Monad` lets you sequence computations where each step depends on the previous result, using the bind operator `>>=`. For `Maybe`, a `Nothing` anywhere short-circuits the whole chain. Monads generalize this "and then" pattern across many contexts.',
            explanation: {
              heading: 'Monad',
              intro: 'Monad captures sequencing of computations in a context, letting each step depend on the result of the previous one through bind.',
              points: [
                { term: 'Bind operator', detail: 'The bind operator feeds a wrapped result into the next step.' },
                { term: 'Sequencing', detail: 'Monads chain dependent computations in order.' },
                { term: 'return wraps', detail: 'The return method injects a plain value into the monad.' },
                { term: 'Many instances', detail: 'Maybe, Either, lists, and IO are all monads.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 17. IO & do Notation
  {
    id: 'hs-io',
    title: 'IO & do Notation',
    level: 1,
    slug: 'io',
    concepts: [],
    children: [
      {
        id: 'hs-io-basics',
        title: 'The IO Monad',
        level: 2,
        slug: 'io-basics',
        concepts: [
          {
            id: 'hs-io-intro',
            code: "main :: IO ()\nmain = do\n  putStrLn \"What is your name?\"\n  name <- getLine\n  putStrLn (\"Hello, \" ++ name ++ \"!\")",
            note: 'Side effects like reading input and printing output live in the `IO` monad, which keeps them separate from pure code. `do` notation sequences IO actions in order. The `<-` binds the result of an action, while plain actions like `putStrLn` are just run.',
            explanation: {
              heading: 'The IO type',
              intro: 'Side effects in Haskell are represented as IO actions, which describe effects as values that the runtime performs when it runs main.',
              points: [
                { term: 'Effects as values', detail: 'An IO action is a description of an effect, not the effect itself.' },
                { term: 'Purity preserved', detail: 'Wrapping effects in IO keeps the rest of the language pure.' },
                { term: 'Sequenced by bind', detail: 'IO actions are combined and ordered like any other monad.' },
                { term: 'Run at main', detail: 'The runtime actually performs the actions assembled into main.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'hs-do-notation',
        title: 'do Notation & return',
        level: 2,
        slug: 'do-notation',
        concepts: [
          {
            id: 'hs-do-intro',
            code: "askAge :: IO Int\naskAge = do\n  putStr \"Age: \"\n  line <- getLine\n  let age = read line :: Int\n  return age",
            note: '`do` blocks work for any monad, not just IO, giving imperative-looking syntax over monadic sequencing. Use `let` for pure bindings inside a `do` block and `return` to wrap a pure value back into the monad. `return` does not exit the function like in other languages.',
            explanation: {
              heading: 'do notation',
              intro: 'The do notation offers an imperative-looking syntax for sequencing monadic actions, which the compiler desugars into bind operations.',
              points: [
                { term: 'Imperative look', detail: 'do blocks read like a sequence of steps.' },
                { term: 'Left arrow binds', detail: 'A left arrow names the result extracted from an action.' },
                { term: 'Desugars to bind', detail: 'The compiler rewrites do into bind and related operators.' },
                { term: 'Works for any monad', detail: 'The same notation serves IO, Maybe, lists, and more.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 18. Records
  {
    id: 'hs-records',
    title: 'Records',
    level: 1,
    slug: 'records',
    concepts: [],
    children: [
      {
        id: 'hs-record-syntax',
        title: 'Record Syntax',
        level: 2,
        slug: 'record-syntax',
        concepts: [
          {
            id: 'hs-record-intro',
            code: "data Person = Person\n  { name :: String\n  , age  :: Int\n  } deriving (Show)\n\nalice :: Person\nalice = Person { name = \"Alice\", age = 30 }\n\nname alice  -- \"Alice\"\nage alice   -- 30",
            note: 'Record syntax names each field of a constructor and automatically creates accessor functions (`name`, `age`). You can construct values with `Field = value` pairs in any order, which is clearer than positional constructors for types with many fields.',
            explanation: {
              heading: 'Record syntax',
              intro: 'Record syntax names the fields of a constructor, generating accessor functions and allowing construction by field name.',
              points: [
                { term: 'Named fields', detail: 'Each field gets a name inside the data declaration.' },
                { term: 'Accessor functions', detail: 'The compiler generates a function to read each field.' },
                { term: 'Construct by name', detail: 'You can build a value by assigning fields by name.' },
                { term: 'Clearer than positions', detail: 'Named fields avoid confusion over positional arguments.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'hs-record-update',
        title: 'Record Update',
        level: 2,
        slug: 'record-update',
        concepts: [
          {
            id: 'hs-record-update-intro',
            code: "birthday :: Person -> Person\nbirthday p = p { age = age p + 1 }\n\nolderAlice = birthday alice  -- Person {name = \"Alice\", age = 31}",
            note: 'The `record { field = newValue }` syntax creates a copy of a record with some fields changed, leaving the original untouched. Because values are immutable, this "update" always returns a new record rather than mutating in place.',
            explanation: {
              heading: 'Record update',
              intro: 'Record update syntax produces a new value that copies an existing record while changing selected fields, respecting immutability.',
              points: [
                { term: 'Copy with changes', detail: 'The syntax creates a new record based on an old one.' },
                { term: 'Change some fields', detail: 'Only the listed fields differ from the original.' },
                { term: 'Immutable', detail: 'The original record is left unchanged.' },
                { term: 'Concise', detail: 'It avoids restating every unchanged field.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 19. data vs newtype vs type
  {
    id: 'hs-type-definitions',
    title: 'data vs newtype vs type',
    level: 1,
    slug: 'type-definitions',
    concepts: [],
    children: [
      {
        id: 'hs-type-alias',
        title: 'type Aliases',
        level: 2,
        slug: 'type-alias',
        concepts: [
          {
            id: 'hs-type-alias-intro',
            code: "type Name = String\ntype Age  = Int\ntype Phonebook = [(Name, String)]\n\nlookupNumber :: Name -> Phonebook -> Maybe String\nlookupNumber = lookup",
            note: 'A `type` declaration creates a synonym for an existing type. It adds no new type at runtime and is fully interchangeable with the original. Aliases exist purely to make signatures more descriptive and self-documenting.',
            explanation: {
              heading: 'Type aliases',
              intro: 'The type keyword gives an existing type a new name, improving readability without creating a distinct new type.',
              points: [
                { term: 'type keyword', detail: 'A type declaration introduces a synonym for an existing type.' },
                { term: 'No new type', detail: 'The alias is interchangeable with the original type.' },
                { term: 'Readability', detail: 'A meaningful name documents what a value represents.' },
                { term: 'String example', detail: 'The String type is itself an alias for a list of characters.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'hs-newtype',
        title: 'newtype',
        level: 2,
        slug: 'newtype',
        concepts: [
          {
            id: 'hs-newtype-intro',
            code: "newtype Age = Age Int deriving (Show, Eq, Ord)\n\nnewtype Email = Email String\n\ngetAge :: Age -> Int\ngetAge (Age n) = n",
            note: '`newtype` wraps a single existing type in a brand-new, distinct type with zero runtime overhead. It prevents mixing up values that share a representation, like an `Age` and a raw `Int`. Use it when you want type safety without the cost of `data`.',
            explanation: {
              heading: 'newtype',
              intro: 'A newtype wraps a single existing type in a distinct new type with no runtime overhead, adding type safety without cost.',
              points: [
                { term: 'Single constructor', detail: 'A newtype has exactly one constructor with one field.' },
                { term: 'Zero cost', detail: 'The wrapper is erased at runtime, so it adds no overhead.' },
                { term: 'Distinct type', detail: 'Unlike an alias, it creates a genuinely separate type.' },
                { term: 'Prevents mix-ups', detail: 'It stops values with the same underlying type from being confused.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'hs-data-vs',
        title: 'Choosing Between Them',
        level: 2,
        slug: 'data-vs',
        concepts: [
          {
            id: 'hs-data-vs-intro',
            code: "type UserId = Int              -- synonym, no safety\nnewtype Wrapped = Wrapped Int  -- one constructor, one field\ndata Value = IntVal Int | StrVal String  -- multiple shapes",
            note: 'Use `type` for readable aliases, `newtype` for a single-field wrapper that adds type safety cheaply, and `data` when you need multiple constructors or multiple fields. Only `data` can represent genuine alternatives or product types with several fields.',
            explanation: {
              heading: 'data vs newtype vs type',
              intro: 'Haskell offers three ways to introduce type names, each with different capabilities and runtime characteristics.',
              points: [
                { term: 'type is an alias', detail: 'The type keyword only renames an existing type.' },
                { term: 'newtype wraps one field', detail: 'A newtype makes a distinct single-field type with no overhead.' },
                { term: 'data is general', detail: 'The data keyword defines full algebraic types with many constructors.' },
                { term: 'Choose by need', detail: 'Pick the lightest option that expresses your intent safely.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 20. Parametric Polymorphism
  {
    id: 'hs-polymorphism',
    title: 'Parametric Polymorphism',
    level: 1,
    slug: 'polymorphism',
    concepts: [],
    children: [
      {
        id: 'hs-generic-functions',
        title: 'Generic Functions',
        level: 2,
        slug: 'generic-functions',
        concepts: [
          {
            id: 'hs-generic-intro',
            code: "identity :: a -> a\nidentity x = x\n\nswap :: (a, b) -> (b, a)\nswap (x, y) = (y, x)\n\nlength' :: [a] -> Int\nlength' []     = 0\nlength' (_:xs) = 1 + length' xs",
            note: 'A lowercase type variable like `a` stands for any type at all, making a function parametrically polymorphic. Because the function cannot know the concrete type, it must treat those values uniformly, which strongly constrains what it can do and often pins down its behavior.',
            explanation: {
              heading: 'Parametric polymorphism',
              intro: 'Functions can be written generically over any type using type variables, so the same code works for every element type.',
              points: [
                { term: 'Type variables', detail: 'A lowercase name in a signature stands for any type.' },
                { term: 'Works for all types', detail: 'The function behaves identically regardless of the concrete type.' },
                { term: 'Type safety', detail: 'The compiler still checks that types line up consistently.' },
                { term: 'Reusable code', detail: 'One generic definition replaces many type-specific versions.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'hs-constrained-polymorphism',
        title: 'Constrained Polymorphism',
        level: 2,
        slug: 'constrained-polymorphism',
        concepts: [
          {
            id: 'hs-constrained-intro',
            code: "largest :: Ord a => [a] -> a\nlargest = foldr1 max\n\ndescribe :: Show a => a -> String\ndescribe x = \"value: \" ++ show x",
            note: 'A class constraint like `Ord a =>` says the type variable must belong to a type class, unlocking that class\'s methods. This blends generic code with the specific operations you need, such as comparing with `max` or stringifying with `show`.',
            explanation: {
              heading: 'Constrained polymorphism',
              intro: 'A type-class constraint restricts a generic type variable to types that support certain operations, combining generality with capability.',
              points: [
                { term: 'Class constraint', detail: 'A constraint before the arrow requires an instance of a class.' },
                { term: 'Enables operations', detail: 'The constraint lets you use that class\'s methods on the variable.' },
                { term: 'Still generic', detail: 'The function works for every type meeting the constraint.' },
                { term: 'Multiple constraints', detail: 'Several constraints can be combined in a tuple before the arrow.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 21. Common Patterns
  {
    id: 'hs-patterns',
    title: 'Common Patterns',
    level: 1,
    slug: 'patterns',
    concepts: [],
    children: [
      {
        id: 'hs-maybe-chaining',
        title: 'Safe Chaining',
        level: 2,
        slug: 'maybe-chaining',
        concepts: [
          {
            id: 'hs-maybe-chaining-intro',
            code: "import Data.Maybe (fromMaybe, mapMaybe)\n\nfromMaybe 0 (Just 5)        -- 5\nfromMaybe 0 Nothing         -- 0\nmapMaybe safeHead [[1],[],[3]]  -- [1,3]\n  where safeHead (x:_) = Just x\n        safeHead []    = Nothing",
            note: '`fromMaybe` supplies a default when a value is absent, and `mapMaybe` maps a function and keeps only the `Just` results. These helpers from `Data.Maybe` make working with optional values concise and safe without manual pattern matching everywhere.',
            explanation: {
              heading: 'Chaining Maybe',
              intro: 'Because Maybe is a monad, you can chain operations that might fail so the whole computation short-circuits to Nothing on the first failure.',
              points: [
                { term: 'Short-circuits', detail: 'A Nothing anywhere stops the chain and yields Nothing.' },
                { term: 'Bind sequences', detail: 'The bind operator threads a Just value into the next step.' },
                { term: 'do notation', detail: 'A do block makes chained Maybe operations read clearly.' },
                { term: 'Avoids nesting', detail: 'It flattens what would otherwise be deeply nested checks.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'hs-list-utilities',
        title: 'List Processing Idioms',
        level: 2,
        slug: 'list-utilities',
        concepts: [
          {
            id: 'hs-list-utilities-intro',
            code: "import Data.List (sort, group, nub)\n\nsort [3, 1, 2]        -- [1,2,3]\nnub [1, 1, 2, 3, 3]   -- [1,2,3]\nmap length (group \"aabbbc\")  -- [2,3,1]",
            note: '`Data.List` provides a rich toolkit: `sort` orders a list, `nub` removes duplicates, and `group` clusters adjacent equal elements. Combining these small functions handles many everyday data-wrangling tasks in a single expression.',
            explanation: {
              heading: 'List utilities',
              intro: 'The standard library and the Data.List module provide many helper functions for common list tasks beyond the basics.',
              points: [
                { term: 'Rich standard set', detail: 'Functions like length, reverse, and elem cover everyday needs.' },
                { term: 'Data.List module', detail: 'Importing it adds sorting, grouping, and many more helpers.' },
                { term: 'Prefer library functions', detail: 'Using existing helpers is clearer and less error-prone than reinventing them.' },
                { term: 'Composable', detail: 'These functions combine well with map, filter, and folds.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'hs-folding-patterns',
        title: 'Folding for Aggregation',
        level: 2,
        slug: 'folding-patterns',
        concepts: [
          {
            id: 'hs-folding-patterns-intro',
            code: "import Data.List (foldl')\n\naverage :: [Double] -> Double\naverage xs = total / fromIntegral count\n  where (total, count) = foldl' step (0, 0 :: Int) xs\n        step (s, c) x = (s + x, c + 1)",
            note: 'A single strict fold can compute several aggregates at once by threading a tuple accumulator. Using `foldl\'` keeps the accumulator evaluated, avoiding the thunk buildup that a lazy `foldl` would cause on large lists. This pattern is both efficient and expressive.',
            explanation: {
              heading: 'Folding patterns',
              intro: 'Many common computations can be expressed as folds, and recognizing this pattern leads to concise, reusable definitions.',
              points: [
                { term: 'Aggregation as fold', detail: 'Summing, counting, and combining are natural folds.' },
                { term: 'Choose direction', detail: 'Pick foldr or foldl based on associativity and laziness needs.' },
                { term: 'Replace explicit recursion', detail: 'A fold often captures a recursion pattern more clearly.' },
                { term: 'Strict fold for performance', detail: 'A strict left fold avoids space buildup in large aggregations.' },
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
