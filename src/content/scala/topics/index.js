const topics = [
  {
    id: 'scala-basics',
    title: 'Basics',
    level: 1,
    slug: 'basics',
    concepts: [],
    children: [
      {
        id: 'scala-basics-val-var',
        title: 'val, var and Types',
        level: 2,
        slug: 'val-var',
        concepts: [
          {
            id: 'scala-basics-val',
            code: "val name = \"Ada\"     // immutable binding, type inferred as String\nvar count = 0        // mutable binding\ncount = count + 1    // reassignment allowed for var\nval pi: Double = 3.14 // explicit type annotation",
            note: 'A val is an immutable binding: once assigned it cannot point to a new value. A var can be reassigned. Prefer val by default and reach for var only when mutation is genuinely needed. Types are usually inferred, but you can annotate them explicitly after a colon.',
            explanation: {
              heading: 'val and var',
              intro: 'Scala distinguishes immutable bindings from mutable ones, and idiomatic code strongly favors immutability by default.',
              points: [
                { term: 'val is immutable', detail: 'A val binds a name to a value that can never be reassigned.' },
                { term: 'var is mutable', detail: 'A var allows reassignment but is discouraged in functional style.' },
                { term: 'Prefer val', detail: 'Defaulting to val makes code easier to reason about and thread-safe.' },
                { term: 'Type inference', detail: 'The compiler usually infers the type so you can omit an explicit annotation.' },
              ],
            },
          },
          {
            id: 'scala-basics-types',
            code: "val i: Int = 42\nval l: Long = 42L\nval d: Double = 3.14\nval b: Boolean = true\nval c: Char = 'A'\nval s: String = \"hello\"\nval anything: Any = 1  // Any is the root of all types",
            note: 'Scala has a unified type hierarchy where every value is an object. AnyVal covers value types like Int, Double and Boolean, while AnyRef covers reference types. Both descend from Any, and Nothing sits at the bottom as a subtype of everything.',
            explanation: {
              heading: 'The type hierarchy',
              intro: 'Scala unifies all values under a single hierarchy rooted at Any, blending object-oriented and functional type concepts.',
              points: [
                { term: 'Any at the top', detail: 'Every type is a subtype of Any, spanning both objects and primitives.' },
                { term: 'AnyVal and AnyRef', detail: 'AnyVal covers value types while AnyRef covers reference types.' },
                { term: 'Nothing at the bottom', detail: 'Nothing is a subtype of everything and represents no value at all.' },
                { term: 'No true primitives', detail: 'Even numbers are objects with methods, though the compiler optimizes them.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'scala-basics-repl',
        title: 'The REPL and Worksheets',
        level: 2,
        slug: 'repl',
        concepts: [
          {
            id: 'scala-basics-repl-intro',
            code: "$ scala\nscala> val x = 2 + 3\nval x: Int = 5\nscala> x * 10\nval res0: Int = 50",
            note: 'The REPL (Read-Eval-Print Loop) lets you type expressions and see results immediately, which is perfect for learning and quick experiments. Each result is bound to an auto-named value like res0. Scala 3 ships the REPL with the `scala` command.',
            explanation: {
              heading: 'The REPL',
              intro: 'Scala includes an interactive read-evaluate-print loop for experimenting with expressions and inspecting inferred types.',
              points: [
                { term: 'Interactive shell', detail: 'You type expressions and see their results and types immediately.' },
                { term: 'Great for learning', detail: 'It gives fast feedback while exploring the language and libraries.' },
                { term: 'Shows inferred types', detail: 'Each result displays the type the compiler inferred.' },
                { term: 'Worksheet alternative', detail: 'IDE worksheets offer a similar evaluate-as-you-type experience.' },
              ],
            },
            example: "scala> def square(n: Int) = n * n\ndef square(n: Int): Int\nscala> square(6)\nval res1: Int = 36",
          },
        ],
        children: [],
      },
      {
        id: 'scala-basics-blocks',
        title: 'Expressions and Blocks',
        level: 2,
        slug: 'expressions',
        concepts: [
          {
            id: 'scala-basics-block',
            code: "val result = {\n  val a = 10\n  val b = 20\n  a + b   // last expression is the block's value\n}\n// result == 30",
            note: 'In Scala almost everything is an expression that yields a value, including blocks wrapped in braces. A block evaluates its statements in order and returns the value of its final expression. This is why you rarely need an explicit return keyword.',
            explanation: {
              heading: 'Blocks are expressions',
              intro: 'In Scala a block of code is an expression whose value is that of its last statement, so control structures return values.',
              points: [
                { term: 'Last line is the value', detail: 'A braced block evaluates to its final expression.' },
                { term: 'if returns a value', detail: 'An if-else expression yields the result of the chosen branch.' },
                { term: 'Fewer explicit returns', detail: 'Because blocks return values, an explicit return keyword is rarely needed.' },
                { term: 'Expression-oriented', detail: 'Most constructs produce values rather than only causing side effects.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'scala-functions',
    title: 'Functions and Methods',
    level: 1,
    slug: 'functions',
    concepts: [],
    children: [
      {
        id: 'scala-functions-methods',
        title: 'Defining Methods',
        level: 2,
        slug: 'methods',
        concepts: [
          {
            id: 'scala-functions-def',
            code: "def add(x: Int, y: Int): Int = x + y\n\ndef greet(name: String): String =\n  s\"Hello, $name\"\n\n// multi-line body uses a block\ndef factorial(n: Int): Int =\n  if n <= 1 then 1 else n * factorial(n - 1)",
            note: 'Methods are defined with def, listing typed parameters and an optional return type. The body after = is an expression whose value is returned automatically. Explicit return types are recommended for public and recursive methods since they aid readability and inference.',
            explanation: {
              heading: 'Defining methods',
              intro: 'Methods are declared with def, taking typed parameters and returning the value of their body expression.',
              points: [
                { term: 'def keyword', detail: 'The def keyword introduces a method definition.' },
                { term: 'Typed parameters', detail: 'Each parameter names a type after a colon.' },
                { term: 'Inferred return', detail: 'The return type is often inferred, though annotating it aids clarity.' },
                { term: 'Body is an expression', detail: 'The last expression of the body becomes the return value.' },
              ],
            },
          },
          {
            id: 'scala-functions-default',
            code: "def connect(host: String, port: Int = 5432): String =\n  s\"$host:$port\"\n\nconnect(\"localhost\")            // uses default port\nconnect(\"db\", port = 8080)      // named argument",
            note: 'Parameters can have default values, so callers may omit them. Named arguments let you pass values by parameter name in any order, which improves clarity for methods with many parameters. Together they reduce the need for overloaded methods.',
            explanation: {
              heading: 'Default and named arguments',
              intro: 'Parameters can carry default values, and callers may pass arguments by name, making optional configuration convenient and readable.',
              points: [
                { term: 'Default values', detail: 'A parameter default makes it optional at the call site.' },
                { term: 'Named arguments', detail: 'Passing by name lets you skip defaults and reorder arguments.' },
                { term: 'Fewer overloads', detail: 'Defaults reduce the need for many overloaded method versions.' },
                { term: 'Self-documenting calls', detail: 'Named arguments clarify what each value means at the call site.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'scala-functions-values',
        title: 'Function Values and Lambdas',
        level: 2,
        slug: 'function-values',
        concepts: [
          {
            id: 'scala-functions-lambda',
            code: "val double: Int => Int = x => x * 2\nval add = (a: Int, b: Int) => a + b\n\ndouble(21)     // 42\nadd(2, 3)      // 5\n\nList(1, 2, 3).map(_ * 2)  // underscore shorthand",
            note: 'Functions are first-class values you can store, pass and return. A lambda uses the syntax params => body, and its type is written A => B. The underscore is a placeholder for a single argument in concise expressions like _ * 2.',
            explanation: {
              heading: 'Function literals',
              intro: 'Scala treats functions as first-class values, so you can write anonymous functions and pass them around like any other value.',
              points: [
                { term: 'Arrow syntax', detail: 'A function literal uses a fat arrow between parameters and body.' },
                { term: 'First-class values', detail: 'Functions can be stored in variables and passed as arguments.' },
                { term: 'Placeholder syntax', detail: 'An underscore can stand for a single parameter in a concise literal.' },
                { term: 'Closures', detail: 'A literal captures variables from its surrounding scope.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'scala-functions-varargs',
        title: 'Varargs and Multiple Parameter Lists',
        level: 2,
        slug: 'varargs',
        concepts: [
          {
            id: 'scala-functions-vararg',
            code: "def sum(nums: Int*): Int = nums.sum\nsum(1, 2, 3, 4)        // 10\n\nval xs = Seq(1, 2, 3)\nsum(xs*)               // splat a sequence into varargs\n\n// multiple parameter lists (currying)\ndef mul(a: Int)(b: Int): Int = a * b\nval triple = mul(3)    // partially applied",
            note: 'A parameter typed A* accepts a variable number of arguments, collected as a sequence. You can spread an existing sequence into varargs with the postfix * operator. Multiple parameter lists enable currying and partial application, where supplying the first list returns a function awaiting the rest.',
            explanation: {
              heading: 'Variable arguments',
              intro: 'A method can accept a variable number of arguments, gathering them into a sequence the body can iterate over.',
              points: [
                { term: 'Star after the type', detail: 'A trailing star marks the parameter as accepting many values.' },
                { term: 'Received as a sequence', detail: 'Inside the method the arguments arrive as a sequence.' },
                { term: 'Spread with a splat', detail: 'An existing sequence can be expanded into the varargs at the call site.' },
                { term: 'Convenient APIs', detail: 'Varargs make functions like printing or list building flexible.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'scala-control',
    title: 'Control Structures',
    level: 1,
    slug: 'control',
    concepts: [],
    children: [
      {
        id: 'scala-control-if',
        title: 'if as an Expression',
        level: 2,
        slug: 'if-expression',
        concepts: [
          {
            id: 'scala-control-if-intro',
            code: "val max = if a > b then a else b\n\n// Scala 2 syntax used parentheses\nval max2 = if (a > b) a else b",
            note: 'In Scala if is an expression that returns a value, so it doubles as the ternary operator found in other languages. Scala 3 introduces the cleaner then keyword and optional parentheses, while Scala 2 requires parentheses around the condition. Both branches contribute to the inferred result type.',
            explanation: {
              heading: 'if as an expression',
              intro: 'Scala\'s if is an expression that returns a value, so you can assign its result directly rather than mutating a variable.',
              points: [
                { term: 'Returns a value', detail: 'The if-else evaluates to the value of the taken branch.' },
                { term: 'Direct assignment', detail: 'You can bind a val to the result of an if expression.' },
                { term: 'No ternary needed', detail: 'Because if returns a value, Scala has no separate ternary operator.' },
                { term: 'Both branches typed', detail: 'The result type is the common type of both branches.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'scala-control-match',
        title: 'match Expressions',
        level: 2,
        slug: 'match',
        concepts: [
          {
            id: 'scala-control-match-intro',
            code: "val label = day match\n  case 6 | 7 => \"weekend\"\n  case d if d >= 1 && d <= 5 => \"weekday\"\n  case _ => \"unknown\"",
            note: 'A match expression tests a value against a series of patterns and returns the first matching branch. Patterns can combine alternatives with |, add guards with if, and use _ as a catch-all. Because it is an expression, its value can be assigned directly.',
            explanation: {
              heading: 'Pattern matching',
              intro: 'The match expression tests a value against patterns and returns the result of the first match, a cornerstone of Scala style.',
              points: [
                { term: 'case clauses', detail: 'Each case describes a pattern and the expression to run when it matches.' },
                { term: 'Returns a value', detail: 'match evaluates to the result of the matching case.' },
                { term: 'Exhaustiveness', detail: 'The compiler can warn when a match on a sealed type misses a case.' },
                { term: 'Guards', detail: 'An if guard adds an extra condition to a pattern.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'scala-control-loops',
        title: 'while and Ranges',
        level: 2,
        slug: 'loops',
        concepts: [
          {
            id: 'scala-control-while',
            code: "var i = 0\nwhile i < 3 do\n  println(i)\n  i += 1\n\nfor n <- 1 to 5 do print(n)   // 12345\nfor n <- 1 until 5 do print(n) // 1234",
            note: 'while loops repeat while a condition holds and return Unit, so they are used for side effects. Ranges created with `to` are inclusive of the upper bound while `until` is exclusive. In idiomatic Scala these are often replaced by higher-order operations on collections.',
            explanation: {
              heading: 'while loops',
              intro: 'Scala provides a traditional while loop for imperative repetition, though functional alternatives are usually preferred.',
              points: [
                { term: 'Condition based', detail: 'A while loop repeats as long as its condition stays true.' },
                { term: 'Returns unit', detail: 'A while loop produces the unit value rather than a useful result.' },
                { term: 'Prefer recursion or higher order', detail: 'Idiomatic Scala favors recursion or collection methods over while.' },
                { term: 'Side-effecting', detail: 'While loops rely on mutating state, which functional code minimizes.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'scala-collections',
    title: 'Collections',
    level: 1,
    slug: 'collections',
    concepts: [],
    children: [
      {
        id: 'scala-collections-seq',
        title: 'List, Seq and Vector',
        level: 2,
        slug: 'sequences',
        concepts: [
          {
            id: 'scala-collections-list',
            code: "val nums = List(1, 2, 3)\nval more = 0 :: nums        // prepend, O(1) -> List(0,1,2,3)\nnums.head                  // 1\nnums.tail                  // List(2, 3)\n\nval vec = Vector(1, 2, 3)  // indexed, fast random access\nval seq: Seq[Int] = Seq(1, 2, 3)",
            note: 'List is a singly linked, immutable sequence with fast prepend via ::. Vector is an immutable indexed sequence offering effectively constant-time access and updates, making it a good general-purpose default. Seq is the common abstract type both implement.',
            explanation: {
              heading: 'Lists',
              intro: 'The Scala List is an immutable singly linked sequence optimized for adding elements to the front and recursive processing.',
              points: [
                { term: 'Immutable', detail: 'Operations return a new list rather than modifying the original.' },
                { term: 'Prepend is fast', detail: 'Adding to the head is constant time using the cons operator.' },
                { term: 'Head and tail', detail: 'A list splits into its first element and the rest for recursion.' },
                { term: 'Rich methods', detail: 'map, filter, and many others transform lists functionally.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'scala-collections-setmap',
        title: 'Set and Map',
        level: 2,
        slug: 'set-map',
        concepts: [
          {
            id: 'scala-collections-set',
            code: "val s = Set(1, 2, 2, 3)   // Set(1, 2, 3), duplicates removed\ns.contains(2)             // true\ns + 4                     // Set(1, 2, 3, 4)",
            note: 'A Set stores unique elements and answers membership questions efficiently. Adding an element that is already present leaves the set unchanged. Operations on immutable sets return a new set rather than mutating the original.',
            explanation: {
              heading: 'Sets',
              intro: 'A Set is an unordered collection of distinct elements, useful for membership tests and removing duplicates.',
              points: [
                { term: 'No duplicates', detail: 'Adding an existing element leaves the set unchanged.' },
                { term: 'Fast membership', detail: 'Checking whether an element is present is efficient.' },
                { term: 'Immutable by default', detail: 'The default set is immutable, returning new sets on updates.' },
                { term: 'Set operations', detail: 'Union, intersection, and difference combine sets mathematically.' },
              ],
            },
          },
          {
            id: 'scala-collections-map',
            code: "val ages = Map(\"Ada\" -> 36, \"Alan\" -> 41)\nages(\"Ada\")              // 36\nages.get(\"Grace\")        // None (safe lookup)\nages + (\"Grace\" -> 45)   // new map with entry added",
            note: 'A Map associates keys with values, written with the key -> value arrow. Direct lookup with parentheses throws if the key is missing, while get returns an Option for safe access. Like other immutable collections, updates produce a new map.',
            explanation: {
              heading: 'Maps',
              intro: 'A Map associates keys with values, providing lookup, update, and iteration over key-value pairs.',
              points: [
                { term: 'Key to value', detail: 'Each key maps to exactly one value in the collection.' },
                { term: 'Immutable default', detail: 'The default map returns a new map when you add or remove entries.' },
                { term: 'Safe lookup', detail: 'The get method returns an Option so missing keys do not throw.' },
                { term: 'Pairs', detail: 'Entries are key-value tuples you can iterate and destructure.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'scala-collections-immutable',
        title: 'Immutability by Default',
        level: 2,
        slug: 'immutability',
        concepts: [
          {
            id: 'scala-collections-immutable-intro',
            code: "val a = List(1, 2, 3)\nval b = a :+ 4     // b == List(1,2,3,4), a unchanged\n// a is still List(1, 2, 3)\n\nimport scala.collection.mutable\nval buf = mutable.ListBuffer(1, 2)\nbuf += 3           // opt into mutation explicitly",
            note: 'The default collections in scala.collection.immutable never change in place; transformations return brand-new collections. This makes reasoning and sharing safe across threads. When you truly need mutation, import from scala.collection.mutable to opt in deliberately.',
            explanation: {
              heading: 'Immutable collections',
              intro: 'Scala\'s standard library defaults to immutable collections, which return updated copies and are inherently safe to share across threads.',
              points: [
                { term: 'Return copies', detail: 'Updating an immutable collection yields a new one instead of mutating it.' },
                { term: 'Thread-safe', detail: 'Shared immutable data cannot be corrupted by concurrent access.' },
                { term: 'Structural sharing', detail: 'New versions reuse parts of the old structure for efficiency.' },
                { term: 'Mutable opt-in', detail: 'Mutable collections exist in a separate package when you truly need them.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'scala-hof',
    title: 'Higher-Order Functions and For-Comprehensions',
    level: 1,
    slug: 'higher-order-functions',
    concepts: [],
    children: [
      {
        id: 'scala-hof-map-filter',
        title: 'map, filter and flatMap',
        level: 2,
        slug: 'map-filter',
        concepts: [
          {
            id: 'scala-hof-map',
            code: "val nums = List(1, 2, 3, 4)\nnums.map(_ * 2)          // List(2, 4, 6, 8)\nnums.filter(_ % 2 == 0)  // List(2, 4)\nList(List(1, 2), List(3)).flatMap(identity) // List(1, 2, 3)",
            note: 'map applies a function to every element, producing a new collection of the same size. filter keeps only elements satisfying a predicate. flatMap maps then flattens one level, which is invaluable for working with nested structures.',
            explanation: {
              heading: 'map and filter',
              intro: 'Higher-order collection methods like map and filter take functions as arguments to transform and select elements declaratively.',
              points: [
                { term: 'map transforms', detail: 'map applies a function to each element and returns the results.' },
                { term: 'filter selects', detail: 'filter keeps only the elements that satisfy a predicate.' },
                { term: 'Return new collections', detail: 'These methods do not mutate the source collection.' },
                { term: 'Composable', detail: 'Chaining map and filter builds clear data pipelines.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'scala-hof-fold',
        title: 'fold, reduce and Aggregation',
        level: 2,
        slug: 'fold',
        concepts: [
          {
            id: 'scala-hof-fold-intro',
            code: "val nums = List(1, 2, 3, 4)\nnums.foldLeft(0)(_ + _)   // 10, starts from a seed\nnums.reduce(_ + _)        // 10, no seed (non-empty only)\nnums.foldLeft(\"\")((acc, n) => acc + n) // \"1234\"",
            note: 'foldLeft combines elements left to right starting from an initial seed, letting the accumulator have a different type than the elements. reduce is similar but uses the first element as the seed and fails on empty collections. These are the workhorses for turning a collection into a single value.',
            explanation: {
              heading: 'Folding',
              intro: 'Fold operations reduce a collection to a single value by combining elements with an accumulator and a binary function.',
              points: [
                { term: 'Accumulator', detail: 'A fold threads a running result through every element.' },
                { term: 'foldLeft direction', detail: 'foldLeft processes elements from the start to the end.' },
                { term: 'Initial value', detail: 'You supply a starting value that seeds the accumulation.' },
                { term: 'General purpose', detail: 'Many aggregations like sum and product are special cases of fold.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'scala-for-yield',
        title: 'Generators and yield',
        level: 2,
        slug: 'for-yield',
        concepts: [
          {
            id: 'scala-for-yield-intro',
            code: "val pairs = for\n  x <- 1 to 3\n  y <- 1 to 3\n  if x < y\nyield (x, y)\n// Vector((1,2), (1,3), (2,3))",
            note: 'A for-comprehension iterates over one or more generators and, with yield, builds a new collection from the results. Guard clauses with if filter the iterations. Under the hood this desugars into calls to flatMap, map and withFilter.',
            explanation: {
              heading: 'for comprehensions',
              intro: 'A for comprehension with yield iterates over collections and produces a new collection, reading like a declarative query.',
              points: [
                { term: 'yield builds results', detail: 'The yield keyword collects each iteration\'s value into a new collection.' },
                { term: 'Generators', detail: 'Each arrow clause draws values from a collection.' },
                { term: 'Guards and bindings', detail: 'You can add filter conditions and intermediate value bindings.' },
                { term: 'Desugars to methods', detail: 'The compiler rewrites it into map, flatMap, and filter calls.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'scala-for-monadic',
        title: 'Comprehensions over Option and Either',
        level: 2,
        slug: 'for-monadic',
        concepts: [
          {
            id: 'scala-for-monadic-intro',
            code: "val result = for\n  a <- Some(2)\n  b <- Some(3)\nyield a + b\n// Some(5); if any step is None the whole result is None",
            note: 'Because for-comprehensions rely only on map and flatMap, they work over any monadic type, not just collections. Chaining Options short-circuits to None as soon as one step is empty. This gives clean, sequential code for computations that might fail.',
            explanation: {
              heading: 'Monadic for',
              intro: 'Because for comprehensions desugar to flatMap and map, they work over any monadic type such as Option, Either, or Future.',
              points: [
                { term: 'Beyond collections', detail: 'The same syntax sequences Options, Eithers, and Futures.' },
                { term: 'Short-circuiting', detail: 'A None or failure stops the comprehension and propagates the result.' },
                { term: 'flatMap under the hood', detail: 'Each generator becomes a flatMap except the last, which becomes a map.' },
                { term: 'Readable composition', detail: 'It flattens nested callbacks into linear, readable steps.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'scala-pattern-matching',
    title: 'Pattern Matching and Case Classes',
    level: 1,
    slug: 'pattern-matching',
    concepts: [],
    children: [
      {
        id: 'scala-pm-caseclass',
        title: 'Case Classes',
        level: 2,
        slug: 'case-classes',
        concepts: [
          {
            id: 'scala-pm-caseclass-intro',
            code: "case class Point(x: Int, y: Int)\n\nval p = Point(1, 2)   // no 'new' needed\np.x                   // 1\nval p2 = p.copy(y = 9) // Point(1, 9)\np == Point(1, 2)      // true, structural equality",
            note: 'A case class is an immutable data holder that automatically provides a factory apply method, structural equality, a readable toString, and a copy method. Its fields are public vals by default. Case classes are the idiomatic way to model plain data in Scala.',
            explanation: {
              heading: 'Case classes',
              intro: 'A case class is an immutable data holder that the compiler augments with equality, a readable toString, and pattern-matching support.',
              points: [
                { term: 'Auto-generated members', detail: 'The compiler adds equals, hashCode, and toString automatically.' },
                { term: 'No new needed', detail: 'A companion apply method lets you construct instances without the new keyword.' },
                { term: 'Immutable fields', detail: 'Constructor parameters become public immutable values.' },
                { term: 'Pattern matching', detail: 'Case classes can be deconstructed directly in match expressions.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'scala-pm-deconstruct',
        title: 'Destructuring in match',
        level: 2,
        slug: 'destructuring',
        concepts: [
          {
            id: 'scala-pm-deconstruct-intro',
            code: "case class Point(x: Int, y: Int)\n\ndef describe(p: Point): String = p match\n  case Point(0, 0) => \"origin\"\n  case Point(x, 0) => s\"on x-axis at $x\"\n  case Point(_, y) => s\"y is $y\"",
            note: 'Pattern matching can destructure case classes, binding their fields to names for use in the branch. Literal patterns like Point(0, 0) match exact values, while variable patterns capture any value. This makes matching both expressive and type-safe.',
            explanation: {
              heading: 'Deconstruction',
              intro: 'Pattern matching can destructure case classes, tuples, and lists, binding their inner parts to names in a single step.',
              points: [
                { term: 'Extract fields', detail: 'A pattern pulls a case class\'s fields into local variables.' },
                { term: 'Nested patterns', detail: 'Patterns can nest to match deep structures at once.' },
                { term: 'List patterns', detail: 'The head-tail pattern splits a list for recursive processing.' },
                { term: 'Wildcards', detail: 'An underscore ignores parts you do not need to bind.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'scala-options',
    title: 'Options and Error Handling',
    level: 1,
    slug: 'options',
    concepts: [],
    children: [
      {
        id: 'scala-options-intro',
        title: 'Option, Some and None',
        level: 2,
        slug: 'option',
        concepts: [
          {
            id: 'scala-options-basic',
            code: "def findUser(id: Int): Option[String] =\n  if id == 1 then Some(\"Ada\") else None\n\nfindUser(1)  // Some(\"Ada\")\nfindUser(9)  // None",
            note: 'Option models a value that may be absent, replacing null with a type-safe alternative. Some(x) wraps a present value while None represents absence. Because the compiler forces you to handle both cases, entire classes of null-pointer errors disappear.',
            explanation: {
              heading: 'The Option type',
              intro: 'Option represents a value that may be absent, replacing null with an explicit type of either Some value or None.',
              points: [
                { term: 'Some or None', detail: 'An Option is either a Some wrapping a value or an empty None.' },
                { term: 'No null needed', detail: 'Option makes absence explicit in the type, avoiding null errors.' },
                { term: 'getOrElse', detail: 'You can supply a fallback value when the option is empty.' },
                { term: 'Map and flatMap', detail: 'You transform the contained value without unwrapping it manually.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'scala-options-handling',
        title: 'Working with Option',
        level: 2,
        slug: 'option-handling',
        concepts: [
          {
            id: 'scala-options-handling-intro',
            code: "val name: Option[String] = Some(\"Ada\")\nname.getOrElse(\"guest\")        // \"Ada\"\nname.map(_.toUpperCase)         // Some(\"ADA\")\n\nname match\n  case Some(n) => println(n)\n  case None    => println(\"none\")",
            note: 'You transform an Option with map and flatMap just like a collection of zero or one element. getOrElse supplies a fallback when the value is absent. Pattern matching over Some and None is the explicit way to branch on presence.',
            explanation: {
              heading: 'Handling options',
              intro: 'Idiomatic Scala transforms and combines Options with higher-order methods and pattern matching rather than checking for null.',
              points: [
                { term: 'Pattern match', detail: 'Matching on Some and None handles both cases explicitly.' },
                { term: 'map for transforms', detail: 'map applies a function only when a value is present.' },
                { term: 'getOrElse default', detail: 'getOrElse provides a fallback when the option is empty.' },
                { term: 'Avoid get', detail: 'Calling get on an empty option throws, so prefer safer combinators.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'scala-either',
        title: 'Either',
        level: 2,
        slug: 'either',
        concepts: [
          {
            id: 'scala-either-intro',
            code: "def parse(s: String): Either[String, Int] =\n  s.toIntOption match\n    case Some(n) => Right(n)\n    case None    => Left(s\"invalid: $s\")\n\nparse(\"42\")  // Right(42)\nparse(\"xy\")  // Left(\"invalid: xy\")",
            note: 'Either represents a value that is one of two possibilities, conventionally Left for failure and Right for success. Unlike Option it carries information about why something failed. Its map and flatMap operate on the Right side, so it chains cleanly in for-comprehensions.',
            explanation: {
              heading: 'The Either type',
              intro: 'Either represents a value that is one of two possibilities, commonly used to carry a success value or an error explanation.',
              points: [
                { term: 'Left and Right', detail: 'By convention Right holds success and Left holds an error.' },
                { term: 'Typed errors', detail: 'Unlike exceptions, the error type is part of the signature.' },
                { term: 'Right-biased', detail: 'map and flatMap operate on the Right side for easy chaining.' },
                { term: 'Composable', detail: 'Eithers combine in for comprehensions to sequence fallible steps.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'scala-try',
        title: 'Try, Success and Failure',
        level: 2,
        slug: 'try',
        concepts: [
          {
            id: 'scala-try-intro',
            code: "import scala.util.{Try, Success, Failure}\n\nval r = Try(\"123\".toInt)   // Success(123)\nval bad = Try(\"x\".toInt)    // Failure(NumberFormatException)\n\nr match\n  case Success(n) => println(n)\n  case Failure(e) => println(e.getMessage)",
            note: 'Try wraps a computation that might throw an exception, capturing the outcome as Success or Failure. It lets you handle exceptions functionally without try/catch blocks scattered through your code. Failures propagate through map and flatMap, so chains short-circuit safely.',
            explanation: {
              heading: 'The Try type',
              intro: 'Try wraps a computation that might throw, capturing the outcome as either a Success value or a Failure holding the exception.',
              points: [
                { term: 'Success or Failure', detail: 'A Try is a Success with a value or a Failure with a thrown exception.' },
                { term: 'Captures exceptions', detail: 'Wrapping code in Try turns thrown errors into values you can handle.' },
                { term: 'Composable', detail: 'map and recover transform successes and handle failures functionally.' },
                { term: 'Great for parsing', detail: 'It suits operations like parsing input that may fail at runtime.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'scala-oop',
    title: 'Classes, Objects and Companions',
    level: 1,
    slug: 'oop',
    concepts: [],
    children: [
      {
        id: 'scala-oop-classes',
        title: 'Classes and Objects',
        level: 2,
        slug: 'classes',
        concepts: [
          {
            id: 'scala-oop-class-intro',
            code: "class Account(val owner: String, private var balance: Double):\n  def deposit(amount: Double): Unit = balance += amount\n  def show: String = s\"$owner: $balance\"\n\nval a = Account(\"Ada\", 100)\na.deposit(50)\n\nobject Config:            // a singleton\n  val version = \"1.0\"",
            note: 'A class defines a template; constructor parameters are declared right after the class name and can be exposed as fields with val. The object keyword defines a singleton, a single instance that is ideal for utilities and configuration. Scala 3 favors significant indentation over braces for bodies.',
            explanation: {
              heading: 'Classes',
              intro: 'Scala classes combine constructor parameters directly in the class header and blend object-oriented features with functional ones.',
              points: [
                { term: 'Primary constructor', detail: 'Parameters in the class header form the primary constructor.' },
                { term: 'Concise fields', detail: 'Marking a parameter val or var turns it into a member field.' },
                { term: 'Methods with def', detail: 'Instance behavior is defined with def inside the class body.' },
                { term: 'Inheritance', detail: 'The extends keyword derives one class from another.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'scala-oop-companion',
        title: 'Companion Objects',
        level: 2,
        slug: 'companion-objects',
        concepts: [
          {
            id: 'scala-oop-companion-intro',
            code: "class Circle(val radius: Double)\n\nobject Circle:\n  def unit: Circle = Circle(1.0)\n  def apply(r: Double): Circle = new Circle(r)\n\nval c = Circle(2.0)   // calls companion's apply\nval u = Circle.unit",
            note: 'A companion object shares its name and file with a class and can access the class private members. It is the natural home for factory methods and constants that belong to the type rather than an instance. Defining apply on the companion lets callers construct instances without new.',
            explanation: {
              heading: 'Companion objects',
              intro: 'A companion object shares a name with a class and holds members that belong to the type rather than any instance, like factory methods.',
              points: [
                { term: 'Same name', detail: 'The object and class share a name and can access each other\'s private members.' },
                { term: 'Static-like members', detail: 'It holds the equivalent of static methods and fields.' },
                { term: 'apply factories', detail: 'An apply method lets you build instances without the new keyword.' },
                { term: 'Single instance', detail: 'The object itself is a singleton created lazily on first use.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'scala-traits',
    title: 'Traits, Mixins and ADTs',
    level: 1,
    slug: 'traits',
    concepts: [],
    children: [
      {
        id: 'scala-traits-mixins',
        title: 'Traits and Mixins',
        level: 2,
        slug: 'mixins',
        concepts: [
          {
            id: 'scala-traits-intro',
            code: "trait Greeter:\n  def name: String\n  def greet: String = s\"Hi, I am $name\"\n\ntrait Loud:\n  def shout(s: String): String = s.toUpperCase\n\nclass Person(val name: String) extends Greeter, Loud",
            note: 'A trait bundles abstract and concrete members that classes can mix in, similar to interfaces with default methods. A single class may extend multiple traits, composing behavior from several sources. Scala 3 separates multiple parents with commas.',
            explanation: {
              heading: 'Traits',
              intro: 'Traits are reusable units of behavior that classes can mix in, supporting both abstract and concrete members and multiple inheritance.',
              points: [
                { term: 'Mixin composition', detail: 'A class can mix in several traits with the with keyword.' },
                { term: 'Concrete and abstract', detail: 'Traits may provide implementations or leave members abstract.' },
                { term: 'Interfaces plus code', detail: 'They serve as interfaces that can also carry default behavior.' },
                { term: 'Linearization', detail: 'A defined order resolves how mixed-in members combine.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'scala-traits-sealed',
        title: 'Sealed Traits and Algebraic Data Types',
        level: 2,
        slug: 'sealed-adts',
        concepts: [
          {
            id: 'scala-traits-sealed-intro',
            code: "sealed trait Shape\ncase class Circle(r: Double) extends Shape\ncase class Rect(w: Double, h: Double) extends Shape\n\ndef area(s: Shape): Double = s match\n  case Circle(r)  => math.Pi * r * r\n  case Rect(w, h) => w * h",
            note: 'A sealed trait restricts its subtypes to the same file, forming an algebraic data type that enumerates all possible cases. The compiler can then check that a match handles every subtype and warn you if a case is missing. This pairing of sealed traits with case classes is the backbone of type-safe domain modeling.',
            explanation: {
              heading: 'Sealed hierarchies',
              intro: 'A sealed trait or class restricts its subtypes to the same file, letting the compiler check that pattern matches cover every case.',
              points: [
                { term: 'Restricted subtypes', detail: 'All direct subtypes must be declared in the same source file.' },
                { term: 'Exhaustive matching', detail: 'The compiler warns if a match misses one of the known subtypes.' },
                { term: 'Model closed sets', detail: 'Sealed hierarchies express a fixed set of alternatives cleanly.' },
                { term: 'Algebraic data types', detail: 'Combined with case classes they form idiomatic sum types.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'scala-tuples-strings',
    title: 'Tuples and Strings',
    level: 1,
    slug: 'tuples-strings',
    concepts: [],
    children: [
      {
        id: 'scala-tuples',
        title: 'Tuples',
        level: 2,
        slug: 'tuples',
        concepts: [
          {
            id: 'scala-tuples-intro',
            code: "val pair = (\"Ada\", 36)\npair._1          // \"Ada\"\npair._2          // 36\n\nval (name, age) = pair   // destructuring\nval triple = (1, 2, 3)",
            note: 'A tuple groups a fixed number of values of possibly different types without defining a class. Elements are accessed by position with _1, _2, and so on, or destructured into named values. Tuples are handy for returning multiple results from a method.',
            explanation: {
              heading: 'Tuples',
              intro: 'A tuple groups a fixed number of values of possibly different types into a single value without defining a dedicated class.',
              points: [
                { term: 'Fixed size', detail: 'A tuple holds a set number of elements decided at creation.' },
                { term: 'Mixed types', detail: 'Each position may have a different type.' },
                { term: 'Access by position', detail: 'Elements are reached by position, or destructured in a pattern.' },
                { term: 'Lightweight', detail: 'Tuples avoid a full class when you only need to bundle values briefly.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'scala-string-interpolation',
        title: 'String Interpolation',
        level: 2,
        slug: 'string-interpolation',
        concepts: [
          {
            id: 'scala-string-interp-intro',
            code: "val name = \"Ada\"\nval n = 42\ns\"Hello $name, count is $n\"      // simple interpolation\ns\"Sum: ${n + 1}\"                  // expression in braces\nf\"Pi is ${math.Pi}%.2f\"           // formatted -> Pi is 3.14\nraw\"line1\\nline2\"                 // raw, no escaping",
            note: 'Prefixing a string with s enables interpolation, substituting $variable or ${expression} inline. The f interpolator adds printf-style formatting such as %.2f for two decimals. The raw interpolator leaves escape sequences like backslash-n untouched.',
            explanation: {
              heading: 'String interpolation',
              intro: 'Scala offers interpolators that embed expressions inside string literals, with variants for formatting and raw output.',
              points: [
                { term: 'The s interpolator', detail: 'Prefixing a string with s inserts variables and expressions marked by a dollar sign.' },
                { term: 'The f interpolator', detail: 'The f interpolator applies printf-style formatting to embedded values.' },
                { term: 'The raw interpolator', detail: 'The raw interpolator leaves escape sequences untouched.' },
                { term: 'Braces for expressions', detail: 'Curly braces let you embed a full expression, not just a name.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'scala-implicits-givens',
    title: 'Implicits and Givens',
    level: 1,
    slug: 'implicits-givens',
    concepts: [],
    children: [
      {
        id: 'scala-givens',
        title: 'given and using (Scala 3)',
        level: 2,
        slug: 'given-using',
        concepts: [
          {
            id: 'scala-givens-intro',
            code: "case class Config(env: String)\n\ngiven Config = Config(\"prod\")\n\ndef run(task: String)(using c: Config): String =\n  s\"$task in ${c.env}\"\n\nrun(\"deploy\")   // Config supplied implicitly -> \"deploy in prod\"",
            note: 'Scala 3 replaces the older implicit keyword with given for defining contextual values and using for consuming them. A using parameter is filled automatically from a matching given in scope, so callers need not pass it explicitly. In Scala 2 the same idea was written with implicit val and implicit parameters.',
            explanation: {
              heading: 'Given instances',
              intro: 'Scala 3 given instances and using clauses provide contextual values automatically, the modern replacement for implicits.',
              points: [
                { term: 'given defines context', detail: 'A given declares a value the compiler can supply implicitly.' },
                { term: 'using requests it', detail: 'A using parameter asks the compiler to fill in a matching given.' },
                { term: 'Type class pattern', detail: 'Givens power type classes by providing behavior for specific types.' },
                { term: 'Clearer than implicits', detail: 'The new keywords make implicit resolution more explicit and readable.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'scala-extension',
        title: 'Extension Methods',
        level: 2,
        slug: 'extension-methods',
        concepts: [
          {
            id: 'scala-extension-intro',
            code: "extension (s: String)\n  def shout: String = s.toUpperCase + \"!\"\n\n\"hello\".shout   // \"HELLO!\"\n\n// Scala 2 achieved this with implicit classes",
            note: 'Extension methods add new methods to existing types without modifying their source or subclassing. In Scala 3 you declare them with the extension keyword on a receiver parameter. This is the modern replacement for the implicit class pattern used in Scala 2.',
            explanation: {
              heading: 'Extension methods',
              intro: 'Extension methods add new methods to existing types without modifying them, letting you extend even library classes cleanly.',
              points: [
                { term: 'extension keyword', detail: 'An extension block declares methods on a chosen receiver type.' },
                { term: 'Enrich existing types', detail: 'You can add behavior to types you do not own, such as standard library ones.' },
                { term: 'Call like members', detail: 'The added methods are invoked as if they were defined on the type.' },
                { term: 'Replaces implicit classes', detail: 'It is the Scala 3 successor to the older implicit class technique.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'scala-advanced-types',
    title: 'Advanced Types',
    level: 1,
    slug: 'advanced-types',
    concepts: [],
    children: [
      {
        id: 'scala-generics',
        title: 'Generics and Type Parameters',
        level: 2,
        slug: 'generics',
        concepts: [
          {
            id: 'scala-generics-intro',
            code: "def firstOr[A](xs: List[A], default: A): A =\n  xs.headOption.getOrElse(default)\n\nfirstOr(List(1, 2), 0)      // 1\nfirstOr(List.empty[String], \"x\") // \"x\"\n\nclass Box[A](val value: A)",
            note: 'Generics let you write code that works uniformly across types by declaring type parameters in square brackets. The compiler infers concrete types at each call site while preserving full type safety. This is how the standard collections stay both reusable and strongly typed.',
            explanation: {
              heading: 'Generics',
              intro: 'Generics let classes and methods operate over any type through type parameters, enabling reusable, type-safe abstractions.',
              points: [
                { term: 'Type parameters', detail: 'Square brackets introduce a placeholder type on a class or method.' },
                { term: 'Type safety', detail: 'The compiler enforces the parameter type at each use site.' },
                { term: 'Bounds', detail: 'Upper and lower bounds constrain which types are allowed.' },
                { term: 'Variance annotations', detail: 'Plus and minus markers control subtyping between parameterized types.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'scala-hkt',
        title: 'Higher-Kinded Types',
        level: 2,
        slug: 'higher-kinded-types',
        concepts: [
          {
            id: 'scala-hkt-intro',
            code: "trait Mappable[F[_]]:\n  def map[A, B](fa: F[A])(f: A => B): F[B]\n\ngiven Mappable[Option] with\n  def map[A, B](fa: Option[A])(f: A => B): Option[B] =\n    fa.map(f)",
            note: 'A higher-kinded type abstracts over type constructors like List or Option rather than over concrete types. The notation F[_] means F itself takes a type argument, so Mappable works for any such container. This capability underpins general abstractions like functors and monads.',
            explanation: {
              heading: 'Higher-kinded types',
              intro: 'Higher-kinded types abstract over type constructors like List or Option themselves, enabling very general functional abstractions.',
              points: [
                { term: 'Abstract over constructors', detail: 'A parameter can stand for a type that itself takes a type, such as a container.' },
                { term: 'Enables type classes', detail: 'Abstractions like Functor and Monad rely on higher-kinded parameters.' },
                { term: 'Placeholder notation', detail: 'An underscore inside the parameter marks the missing inner type.' },
                { term: 'Powerful but advanced', detail: 'They unlock generic libraries but require careful design.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'scala-concurrency',
    title: 'Futures and Concurrency',
    level: 1,
    slug: 'concurrency',
    concepts: [],
    children: [
      {
        id: 'scala-futures',
        title: 'Future',
        level: 2,
        slug: 'futures',
        concepts: [
          {
            id: 'scala-futures-intro',
            code: "import scala.concurrent.Future\nimport scala.concurrent.ExecutionContext.Implicits.global\n\nval f: Future[Int] = Future { 21 * 2 }\nf.map(_ + 1)          // Future(43) when complete\nf.foreach(println)    // side effect on completion",
            note: 'A Future represents a computation that will complete asynchronously, possibly on another thread. You transform its eventual result with map and flatMap without blocking, and it requires an ExecutionContext to schedule work. Failures are captured inside the Future and can be recovered.',
            explanation: {
              heading: 'Futures',
              intro: 'A Future represents a computation that runs asynchronously and will eventually hold a result or a failure, without blocking the caller.',
              points: [
                { term: 'Asynchronous result', detail: 'A Future holds a value that becomes available later.' },
                { term: 'Execution context', detail: 'It needs an execution context that supplies a thread pool.' },
                { term: 'Non-blocking', detail: 'You register callbacks or transformations instead of waiting.' },
                { term: 'Success or failure', detail: 'A completed Future carries either a value or an exception.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'scala-futures-compose',
        title: 'Composing Futures',
        level: 2,
        slug: 'composing-futures',
        concepts: [
          {
            id: 'scala-futures-compose-intro',
            code: "import scala.concurrent.Future\nimport scala.concurrent.ExecutionContext.Implicits.global\n\ndef fetchUser(id: Int): Future[String] = Future(s\"user-$id\")\ndef fetchOrders(u: String): Future[Int] = Future(u.length)\n\nval combined = for\n  u <- fetchUser(1)\n  n <- fetchOrders(u)\nyield n",
            note: 'Because Future supports map and flatMap, you can sequence dependent asynchronous steps inside a for-comprehension. Each step runs only after the previous one completes, and any failure short-circuits the whole chain. This keeps async code readable and free of nested callbacks.',
            explanation: {
              heading: 'Composing futures',
              intro: 'Futures compose with map and flatMap so you can chain asynchronous steps declaratively, often inside a for comprehension.',
              points: [
                { term: 'map transforms result', detail: 'map applies a function to the eventual value once it is ready.' },
                { term: 'flatMap sequences', detail: 'flatMap chains a second future that depends on the first result.' },
                { term: 'for comprehension', detail: 'A for block reads sequential async steps as clear linear code.' },
                { term: 'recover handles errors', detail: 'The recover method supplies a fallback when a future fails.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'scala-functional-idioms',
    title: 'Functional Idioms',
    level: 1,
    slug: 'functional-idioms',
    concepts: [],
    children: [
      {
        id: 'scala-fp-purity',
        title: 'Pure Functions and Immutability',
        level: 2,
        slug: 'purity',
        concepts: [
          {
            id: 'scala-fp-purity-intro',
            code: "// pure: output depends only on input, no side effects\ndef addTax(price: Double, rate: Double): Double =\n  price * (1 + rate)\n\n// prefer transformation over mutation\nval updated = List(1, 2, 3).map(_ + 1) // List(2, 3, 4)",
            note: 'A pure function always returns the same output for the same input and causes no observable side effects. Combined with immutable data, purity makes code easier to test, reason about, and run in parallel. Idiomatic Scala favors transforming data into new values over mutating existing state.',
            explanation: {
              heading: 'Pure functions',
              intro: 'A pure function returns the same output for the same input and causes no observable side effects, making code predictable and testable.',
              points: [
                { term: 'Deterministic', detail: 'Given the same arguments it always produces the same result.' },
                { term: 'No side effects', detail: 'It does not mutate state or perform hidden input and output.' },
                { term: 'Referential transparency', detail: 'A call can be replaced by its result without changing behavior.' },
                { term: 'Easy to test', detail: 'Pure functions need no setup and are simple to verify.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'scala-fp-composition',
        title: 'Function Composition and Currying',
        level: 2,
        slug: 'composition',
        concepts: [
          {
            id: 'scala-fp-composition-intro',
            code: "val inc = (x: Int) => x + 1\nval dbl = (x: Int) => x * 2\n\nval incThenDbl = inc andThen dbl   // dbl(inc(x))\nincThenDbl(3)                      // 8\n\nval dblThenInc = inc compose dbl   // inc(dbl(x))\ndblThenInc(3)                      // 7",
            note: 'Functions compose with andThen, which applies the left function first, and compose, which applies the right one first. Building small functions and gluing them together yields readable, reusable pipelines. This point-free style is a hallmark of functional programming.',
            explanation: {
              heading: 'Function composition',
              intro: 'Small pure functions can be combined into larger ones through composition, building complex behavior from simple, reusable parts.',
              points: [
                { term: 'compose and andThen', detail: 'These methods chain two functions so one feeds into the other.' },
                { term: 'Build from small parts', detail: 'Composition assembles big transformations from tiny functions.' },
                { term: 'Reusable', detail: 'Each small function can be reused in many different compositions.' },
                { term: 'Point-free style', detail: 'Composition often lets you omit naming intermediate arguments.' },
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
