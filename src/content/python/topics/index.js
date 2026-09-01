// Python topic tree.

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  {
    id: 'py-fundamentals',
    title: 'Fundamentals',
    level: 1,
    slug: 'fundamentals',
    concepts: [],
    children: [
      {
        id: 'py-variables',
        title: 'Variables and Types',
        level: 2,
        slug: 'variables',
        concepts: [
          {
            id: 'py-variables-assign',
            code: 'name = "Ada"\ncount = 0\ncount += 1',
            note: 'Python variables are names bound to objects. Types are dynamic — a name can be rebound to a value of any type.',
            explanation: {
              heading: 'Names, objects, and dynamic typing',
              intro: 'In Python a variable is not a box that holds a value; it is a name that points at an object living in memory. Assignment binds a name to an object, and the same name can later point at a completely different object of a different type.',
              points: [
                { term: 'Names bind to objects', detail: 'Assignment creates a reference, not a copy. Two names can point at the same object, so mutating it through one name is visible through the other.' },
                { term: 'Dynamic typing', detail: 'The type travels with the object, not the name. You can rebind count from an int to a string, which is flexible but means type errors surface at runtime.' },
                { term: 'Augmented assignment', detail: 'count += 1 rebinds count to a new int object for immutable types, while for mutable types like lists it modifies the object in place.' },
                { term: 'Common gotcha', detail: 'Using a mutable default such as a list shared across calls can leak state, because the same object is reused. Prefer None as the default and create the object inside the function.' },
              ],
            },
            example: 'x, y = 1, 2  # tuple unpacking\nx, y = y, x  # swap',
          },
        ],
        children: [],
      },
      {
        id: 'py-comprehensions',
        title: 'List Comprehensions',
        level: 2,
        slug: 'comprehensions',
        concepts: [
          {
            id: 'py-comprehensions-basic',
            code: 'squares = [n * n for n in range(5)]\nevens = [n for n in range(10) if n % 2 == 0]',
            note: 'Comprehensions build a list from an iterable in a single expression, optionally filtering with an `if` clause.',
            explanation: {
              heading: 'Building lists declaratively',
              intro: 'A list comprehension expresses the shape of the result directly: take each item from an iterable, optionally keep only the ones that pass a test, and transform each kept item. It reads as a single readable expression instead of an explicit loop that appends.',
              points: [
                { term: 'How it reads', detail: 'The pattern is [expression for item in iterable if condition]. The condition is optional and filters items before the expression runs.' },
                { term: 'When to use', detail: 'Reach for a comprehension when you are mapping or filtering into a new list. If the body needs several statements or side effects, a plain loop is clearer.' },
                { term: 'Readability limit', detail: 'Deeply nested or multi-condition comprehensions become hard to scan. Break them into a loop once the logic stops fitting on one line comfortably.' },
                { term: 'Related forms', detail: 'The same syntax with parentheses gives a lazy generator, and with braces gives set or dict comprehensions, so the mental model transfers directly.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'py-functions',
    title: 'Functions',
    level: 1,
    slug: 'functions',
    concepts: [],
    children: [
      {
        id: 'py-decorators',
        title: 'Decorators',
        level: 2,
        slug: 'decorators',
        concepts: [
          {
            id: 'py-decorators-basic',
            code: 'def log(fn):\n    def wrapper(*args, **kwargs):\n        print(f"calling {fn.__name__}")\n        return fn(*args, **kwargs)\n    return wrapper\n\n@log\ndef greet(name):\n    return f"Hello, {name}"',
            note: 'A decorator wraps a function to extend its behavior without modifying its body. `@log` is shorthand for `greet = log(greet)`.',
            explanation: {
              heading: 'Wrapping behavior around a function',
              intro: 'A decorator is a callable that takes a function and returns a replacement, usually a wrapper that runs extra code before or after calling the original. The @ syntax simply applies that transformation at definition time.',
              points: [
                { term: 'Syntactic sugar', detail: 'Writing @log above greet is exactly the same as writing greet = log(greet) after the definition. The name ends up bound to the wrapper.' },
                { term: 'Forwarding arguments', detail: 'The wrapper accepts *args and **kwargs so it can pass any call through to the original function unchanged, regardless of its signature.' },
                { term: 'Preserve metadata', detail: 'A plain wrapper hides the original name and docstring. Apply functools.wraps to the wrapper so introspection and debugging still report the real function.' },
                { term: 'Typical uses', detail: 'Logging, timing, access checks, caching, and retry logic are all cross-cutting concerns that decorators add without touching the wrapped body.' },
              ],
            },
            example: 'greet("Ada")  # prints "calling greet" then returns "Hello, Ada"',
          },
        ],
        children: [],
      },
    ],
  },
  // 3. Control Flow
  {
    id: 'py-control-flow',
    title: 'Control Flow',
    level: 1,
    slug: 'control-flow',
    concepts: [],
    children: [
      {
        id: 'py-conditionals',
        title: 'Conditionals',
        level: 2,
        slug: 'conditionals',
        concepts: [
          {
            id: 'py-conditionals-if',
            code: 'score = 85\nif score >= 90:\n    grade = "A"\nelif score >= 80:\n    grade = "B"\nelse:\n    grade = "C"',
            note: 'Python uses `if/elif/else` for branching. There is no switch statement prior to 3.10; use `match` for structural pattern matching.',
            explanation: {
              heading: 'Branching with if, elif, and else',
              intro: 'Conditionals choose which block of code runs based on truthy evaluation of expressions. Python checks each branch in order and executes the first one whose condition is true, skipping the rest.',
              points: [
                { term: 'First match wins', detail: 'Branches are tested top to bottom, so order matters. Put the most specific conditions before broader ones or they will never be reached.' },
                { term: 'Truthiness', detail: 'Conditions do not need to be real booleans. Empty containers, zero, None, and empty strings are falsy, while most other objects are truthy.' },
                { term: 'Ternary expressions', detail: 'For a simple either-or value, the inline form value_if_true if condition else value_if_false keeps assignments compact and readable.' },
                { term: 'When to use match', detail: 'For dispatch on the shape or structure of data rather than plain comparisons, structural pattern matching with match (3.10+) is clearer than a long elif chain.' },
              ],
            },
            example: '# Ternary expression\nresult = "pass" if score >= 60 else "fail"',
          },
        ],
        children: [],
      },
      {
        id: 'py-loops',
        title: 'Loops and Iteration',
        level: 2,
        slug: 'loops',
        concepts: [
          {
            id: 'py-loops-for',
            code: 'for i, val in enumerate(["a", "b", "c"]):\n    print(i, val)\n\nwhile (line := input("> ")) != "quit":\n    print(line)',
            note: '`for` iterates over any iterable. `while` loops until a condition is falsy. The walrus operator `:=` assigns in expressions (3.8+).',
            explanation: {
              heading: 'Iterating and repeating',
              intro: 'Python loops work over iterables rather than raw index counters. A for loop pulls items one at a time from anything iterable, while a while loop repeats as long as its condition stays truthy.',
              points: [
                { term: 'for over iterables', detail: 'A for loop asks the object for an iterator and consumes it, so it works uniformly across lists, strings, files, generators, and ranges.' },
                { term: 'enumerate for indexes', detail: 'When you need both the position and the value, enumerate pairs them together, which is cleaner and less error prone than manual index counters.' },
                { term: 'while for open-ended loops', detail: 'Use while when the number of repetitions is not known ahead of time and depends on a condition changing during the loop.' },
                { term: 'break, continue, else', detail: 'break exits early, continue skips to the next iteration, and a loop else block runs only when the loop finished without hitting a break.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-match',
        title: 'Pattern Matching',
        level: 2,
        slug: 'pattern-matching',
        concepts: [
          {
            id: 'py-match-basic',
            code: 'def handle(command):\n    match command.split():\n        case ["quit"]:\n            return "bye"\n        case ["go", direction]:\n            return f"going {direction}"\n        case _:\n            return "unknown"',
            note: 'Structural pattern matching (3.10+) destructures sequences, mappings, and objects. The `_` wildcard catches everything.',
            explanation: {
              heading: 'Matching on structure',
              intro: 'Structural pattern matching (3.10+) compares a value against patterns that describe its shape, binding parts of it to names as it goes. It is far more expressive than a simple switch because it can look inside sequences, mappings, and objects.',
              points: [
                { term: 'Patterns bind names', detail: 'A case like ["go", direction] both checks the shape and captures the second element into direction, combining testing and unpacking in one step.' },
                { term: 'Wildcard and capture', detail: 'A bare name captures anything, and the special _ matches without binding. Place a _ case last as the catch-all default.' },
                { term: 'Guards', detail: 'Add an if clause to a case to refine a match with an extra condition, so a pattern only applies when both the shape and the guard hold.' },
                { term: 'When not to use it', detail: 'For a single equality check or a couple of branches, plain if/elif is simpler. Reserve match for genuinely structured data.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  // 4. Data Structures
  {
    id: 'py-data-structures',
    title: 'Data Structures',
    level: 1,
    slug: 'data-structures',
    concepts: [],
    children: [
      {
        id: 'py-lists-tuples',
        title: 'Lists and Tuples',
        level: 2,
        slug: 'lists-tuples',
        concepts: [
          {
            id: 'py-lists-ops',
            code: 'items = [1, 2, 3]\nitems.append(4)\nitems.extend([5, 6])\nsliced = items[1:4]  # [2, 3, 4]',
            note: 'Lists are mutable sequences. Tuples are immutable. Both support indexing, slicing, and iteration.',
            explanation: {
              heading: 'Lists versus tuples',
              intro: 'Lists and tuples are both ordered sequences you can index and slice, but they differ in mutability. A list can grow, shrink, and change in place, while a tuple is fixed once created.',
              points: [
                { term: 'Mutability', detail: 'Lists support append, extend, and item assignment. Tuples cannot change after creation, which makes them safer to pass around and share.' },
                { term: 'Slicing', detail: 'Slicing with start:stop:step returns a new sequence and never mutates the original, so items[1:4] copies a range without touching items.' },
                { term: 'Choosing between them', detail: 'Use a list for a homogeneous collection you will modify, and a tuple for a fixed record of related values, such as coordinates.' },
                { term: 'Hashability', detail: 'Because tuples are immutable and hashable, they can serve as dictionary keys or set members, whereas lists cannot.' },
              ],
            },
            example: 'point = (3, 4)  # immutable tuple\nx, y = point    # unpack',
          },
        ],
        children: [],
      },
      {
        id: 'py-dicts',
        title: 'Dictionaries',
        level: 2,
        slug: 'dictionaries',
        concepts: [
          {
            id: 'py-dicts-ops',
            code: 'user = {"name": "Ada", "age": 36}\nuser["email"] = "ada@example.com"\nmerged = {**user, "role": "admin"}\n\nfor key, val in user.items():\n    print(key, val)',
            note: 'Dicts are hash maps with O(1) average lookup. Use `.get(key, default)` to avoid KeyError. Dict order is insertion order (3.7+).',
            explanation: {
              heading: 'Key-value mapping',
              intro: 'A dictionary maps hashable keys to values using a hash table, giving fast average-case lookup, insertion, and deletion. It is the workhorse container for representing structured records and lookups.',
              points: [
                { term: 'O(1) average access', detail: 'Keys are hashed to find their slot, so retrieving a value does not scan the whole dict. Performance degrades only in rare, pathological hash-collision cases.' },
                { term: 'Safe access with get', detail: 'Indexing a missing key raises KeyError. Using .get(key, default) returns a fallback instead, which avoids wrapping lookups in try/except.' },
                { term: 'Insertion order', detail: 'Since 3.7 dicts remember the order keys were added, so iterating yields them in that order, which is handy for predictable output.' },
                { term: 'Merging and unpacking', detail: 'The {**a, **b} form builds a new dict from others, with later keys overriding earlier ones, useful for applying overrides or defaults.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-sets',
        title: 'Sets and Frozensets',
        level: 2,
        slug: 'sets',
        concepts: [
          {
            id: 'py-sets-ops',
            code: 'a = {1, 2, 3}\nb = {2, 3, 4}\nprint(a & b)  # {2, 3} intersection\nprint(a | b)  # {1, 2, 3, 4} union\nprint(a - b)  # {1} difference',
            note: 'Sets are unordered collections of unique hashable items. Frozensets are immutable and can be used as dict keys.',
            explanation: {
              heading: 'Unique collections and set algebra',
              intro: 'A set stores unique hashable items with no defined order, backed by a hash table like a dict without values. It excels at membership tests and at combining collections with mathematical set operations.',
              points: [
                { term: 'Uniqueness and speed', detail: 'Adding a duplicate is a no-op, and checking whether an item is present is O(1) on average, far faster than scanning a list.' },
                { term: 'Set operations', detail: 'Intersection &, union |, difference -, and symmetric difference ^ express relationships between collections concisely and efficiently.' },
                { term: 'No ordering or indexing', detail: 'Sets cannot be indexed or sliced and iteration order is not guaranteed, so use a list when position matters.' },
                { term: 'Frozensets', detail: 'A frozenset is an immutable, hashable set, so it can be used as a dict key or stored inside another set when you need a fixed group.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  // 5. Comprehensions (Advanced)
  {
    id: 'py-comprehensions-adv',
    title: 'Comprehensions',
    level: 1,
    slug: 'comprehensions-advanced',
    concepts: [],
    children: [
      {
        id: 'py-dict-set-comp',
        title: 'Dict and Set Comprehensions',
        level: 2,
        slug: 'dict-set-comprehensions',
        concepts: [
          {
            id: 'py-dict-comp',
            code: 'words = ["hello", "world", "python"]\nlengths = {w: len(w) for w in words}\nunique_lengths = {len(w) for w in words}',
            note: 'Dict comprehensions produce `{key: value}` pairs. Set comprehensions use `{expr for ...}` and deduplicate automatically.',
            explanation: {
              heading: 'Comprehensions for dicts and sets',
              intro: 'The comprehension syntax extends beyond lists to build dictionaries and sets in a single expression. The braces plus a key-value or single expression tell Python which container to construct.',
              points: [
                { term: 'Dict comprehension shape', detail: 'Writing {key: value for item in iterable} produces a dict, letting you map or transform keys and values together in one pass.' },
                { term: 'Set comprehension shape', detail: 'Writing {expr for item in iterable} produces a set, so duplicate results collapse automatically without a separate deduplication step.' },
                { term: 'Filtering', detail: 'Both forms accept an if clause to keep only items that pass a test, exactly like a list comprehension.' },
                { term: 'Watch the braces', detail: 'An empty {} is a dict, not a set. Use set() for an empty set, and remember a colon in the expression is what distinguishes a dict comprehension.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-nested-comp',
        title: 'Nested Comprehensions',
        level: 2,
        slug: 'nested-comprehensions',
        concepts: [
          {
            id: 'py-nested-comp-matrix',
            code: 'matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\nflat = [x for row in matrix for x in row]\ntransposed = [[row[i] for row in matrix] for i in range(3)]',
            note: 'Nested comprehensions read left-to-right like nested for loops. Use them for flattening or transposing 2D structures.',
            explanation: {
              heading: 'Comprehensions with multiple loops',
              intro: 'A comprehension can contain more than one for clause, which behaves like nested loops written in reading order. This handles flattening nested data and rearranging grids compactly.',
              points: [
                { term: 'Left-to-right ordering', detail: 'In [x for row in matrix for x in row] the outer loop is written first, matching how you would nest the equivalent for statements.' },
                { term: 'Flattening', detail: 'Iterating the outer sequence then each inner sequence collapses a list of lists into a single flat list of items.' },
                { term: 'Nested brackets for grids', detail: 'Wrapping an inner comprehension in another set of brackets builds a new 2D structure, as when transposing rows and columns.' },
                { term: 'Readability tradeoff', detail: 'Two levels are usually fine, but three or more become cryptic. Fall back to explicit loops once the intent stops being obvious at a glance.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  // 6. Functions (Advanced)
  {
    id: 'py-functions-adv',
    title: 'Advanced Functions',
    level: 1,
    slug: 'advanced-functions',
    concepts: [],
    children: [
      {
        id: 'py-closures',
        title: 'Closures and Scoping',
        level: 2,
        slug: 'closures',
        concepts: [
          {
            id: 'py-closures-basic',
            code: 'def make_counter(start=0):\n    count = start\n    def increment():\n        nonlocal count\n        count += 1\n        return count\n    return increment\n\nc = make_counter()\nprint(c(), c())  # 1, 2',
            note: 'A closure captures variables from its enclosing scope. Use `nonlocal` to rebind enclosed variables.',
            explanation: {
              heading: 'How closures work',
              intro: 'When a function is defined inside another function, it remembers the variables of the enclosing scope even after the outer function returns. That combination of an inner function plus its captured environment is a closure.',
              points: [
                { term: 'Lexical capture', detail: 'The inner function sees the names that were in scope where it was written, not where it is later called, so make_counter can keep its own count.' },
                { term: 'nonlocal for rebinding', detail: 'Reading a captured variable works by default, but assigning to it needs nonlocal, otherwise Python treats the name as a new local variable.' },
                { term: 'Persistent private state', detail: 'Captured variables live as long as the closure does, giving each returned function its own independent, encapsulated state without a class.' },
                { term: 'Late-binding pitfall', detail: 'Closures created in a loop capture the variable, not its value at creation time. Bind the current value via a default argument to avoid every closure seeing the final value.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-args-kwargs',
        title: '*args and **kwargs',
        level: 2,
        slug: 'args-kwargs',
        concepts: [
          {
            id: 'py-args-kwargs-usage',
            code: 'def tag(name, *children, **attrs):\n    attr_str = " ".join(f\'{k}="{v}"\' for k, v in attrs.items())\n    body = "".join(children)\n    return f"<{name} {attr_str}>{body}</{name}>"\n\nprint(tag("div", "hello", id="main", class_="container"))',
            note: '`*args` collects positional arguments into a tuple. `**kwargs` collects keyword arguments into a dict. They enable flexible function signatures.',
            explanation: {
              heading: 'Variadic arguments',
              intro: 'The star syntax lets a function accept any number of extra arguments. A single star gathers positional arguments and a double star gathers keyword arguments, so one signature can adapt to many call shapes.',
              points: [
                { term: 'args is a tuple', detail: 'Any positional arguments beyond the named parameters are packed into the args tuple, letting the function work with a variable count of inputs.' },
                { term: 'kwargs is a dict', detail: 'Extra keyword arguments are collected into the kwargs dict, keyed by name, which is ideal for passing through optional configuration.' },
                { term: 'Packing and unpacking', detail: 'The same star operators unpack in a call: func(*seq, **mapping) spreads a sequence and a dict into positional and keyword arguments.' },
                { term: 'Forwarding to wrappers', detail: 'Decorators and wrappers use (*args, **kwargs) to accept and relay any call unchanged, which is why the pattern appears so often.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-lambda',
        title: 'Lambda Expressions',
        level: 2,
        slug: 'lambda',
        concepts: [
          {
            id: 'py-lambda-usage',
            code: 'pairs = [(1, "one"), (3, "three"), (2, "two")]\npairs.sort(key=lambda p: p[1])  # sort by second element\n\nfrom functools import reduce\nproduct = reduce(lambda a, b: a * b, [1, 2, 3, 4])  # 24',
            note: 'Lambdas are anonymous single-expression functions. Best for short callbacks; prefer named functions for complex logic.',
            explanation: {
              heading: 'Anonymous functions',
              intro: 'A lambda is a small unnamed function limited to a single expression whose value is returned automatically. It is convenient for short throwaway callbacks passed directly into another function.',
              points: [
                { term: 'Single expression only', detail: 'A lambda cannot contain statements, assignments, or multiple lines. If you need those, define a normal function with def.' },
                { term: 'Common use as a key', detail: 'Functions like sort, sorted, min, and max take a key callable, and a lambda expresses that small extraction inline without cluttering the code.' },
                { term: 'Readability', detail: 'Assigning a lambda to a name defeats its purpose; if it deserves a name, use def, which also yields a better traceback and docstring support.' },
                { term: 'Same closure rules', detail: 'A lambda captures enclosing variables just like a nested def, so watch the same late-binding behavior inside loops.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  // 7. Decorators (Advanced)
  {
    id: 'py-decorators-adv',
    title: 'Advanced Decorators',
    level: 1,
    slug: 'advanced-decorators',
    concepts: [],
    children: [
      {
        id: 'py-param-decorators',
        title: 'Parameterized Decorators',
        level: 2,
        slug: 'parameterized-decorators',
        concepts: [
          {
            id: 'py-param-dec-impl',
            code: 'import functools\n\ndef retry(times=3):\n    def decorator(fn):\n        @functools.wraps(fn)\n        def wrapper(*args, **kwargs):\n            for attempt in range(times):\n                try:\n                    return fn(*args, **kwargs)\n                except Exception as e:\n                    if attempt == times - 1:\n                        raise\n        return wrapper\n    return decorator\n\n@retry(times=5)\ndef fetch(url):\n    ...',
            note: 'A parameterized decorator is a function that returns a decorator. The outer function accepts config, the middle accepts the function, and the inner is the wrapper.',
            explanation: {
              heading: 'Decorators that take arguments',
              intro: 'A decorator that accepts configuration needs one extra layer of nesting. The outermost function receives the options, returns a real decorator, which in turn wraps the target function.',
              points: [
                { term: 'Three nested layers', detail: 'Outer takes the config such as times, middle takes the function, and the innermost wrapper performs the work. @retry(times=5) calls the outer layer first.' },
                { term: 'Why the extra call', detail: 'Because retry(times=5) must evaluate to a decorator before it is applied, the arguments are captured in a closure available to every layer beneath.' },
                { term: 'Preserve identity', detail: 'Apply functools.wraps to the wrapper so the decorated function keeps its original name, docstring, and signature for introspection.' },
                { term: 'Handle the final failure', detail: 'Retry logic should re-raise on the last attempt rather than swallow the error, so callers still learn that all attempts failed.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-class-decorators',
        title: 'Class-based Decorators',
        level: 2,
        slug: 'class-decorators',
        concepts: [
          {
            id: 'py-class-dec-impl',
            code: 'class Cache:\n    def __init__(self, fn):\n        self.fn = fn\n        self.store = {}\n\n    def __call__(self, *args):\n        if args not in self.store:\n            self.store[args] = self.fn(*args)\n        return self.store[args]\n\n@Cache\ndef fib(n):\n    return n if n < 2 else fib(n - 1) + fib(n - 2)',
            note: 'A class with `__call__` can serve as a decorator, maintaining state between invocations via instance attributes.',
            explanation: {
              heading: 'Classes as decorators',
              intro: 'Any object that is callable can decorate a function, and a class becomes callable by defining __call__. Using a class instead of nested functions gives the decorator a natural place to keep state.',
              points: [
                { term: 'Instance stores state', detail: 'The decorated function and any cache or counters live as instance attributes, so state persists across calls without relying on closures.' },
                { term: '__call__ runs on each call', detail: 'When the decorated name is invoked, Python calls the instance, which routes into __call__ where the wrapping logic lives.' },
                { term: 'Good fit for caching', detail: 'A memoizing decorator maps argument tuples to results in an instance dict, which is easy to inspect or reset compared with a hidden closure variable.' },
                { term: 'Watch mutable arguments', detail: 'Cache keys must be hashable, so arguments like lists will fail. Also apply functools.wraps or set attributes to preserve the wrapped function metadata.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  // 8. Generators
  {
    id: 'py-generators',
    title: 'Generators',
    level: 1,
    slug: 'generators',
    concepts: [],
    children: [
      {
        id: 'py-generator-funcs',
        title: 'Generator Functions',
        level: 2,
        slug: 'generator-functions',
        concepts: [
          {
            id: 'py-gen-basic',
            code: 'def fibonacci():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n\nfib = fibonacci()\nfirst_ten = [next(fib) for _ in range(10)]',
            note: '`yield` suspends a function and returns a value. Each `next()` call resumes execution. Generators are lazy and memory-efficient for infinite sequences.',
            explanation: {
              heading: 'Lazy sequences with yield',
              intro: 'A function containing yield becomes a generator. Calling it returns a generator object that produces values one at a time, pausing its state between each item instead of computing everything up front.',
              points: [
                { term: 'Suspend and resume', detail: 'Each yield hands back a value and freezes local state. The next call to next resumes right after that yield, so local variables survive between values.' },
                { term: 'Laziness', detail: 'Values are produced on demand, so a generator can model an infinite sequence like Fibonacci and you simply stop pulling when you have enough.' },
                { term: 'Constant memory', detail: 'Because only the current state is held, generators use far less memory than building a full list, which matters for large or streamed data.' },
                { term: 'Single pass', detail: 'A generator is exhausted after one iteration. To iterate again you must create a new one, since it does not store its produced values.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-gen-expressions',
        title: 'Generator Expressions',
        level: 2,
        slug: 'generator-expressions',
        concepts: [
          {
            id: 'py-genexpr',
            code: 'total = sum(x * x for x in range(1_000_000))\n\nimport sys\nlist_size = sys.getsizeof([x for x in range(10000)])\ngen_size = sys.getsizeof(x for x in range(10000))\n# gen_size is ~120 bytes vs list_size ~85000 bytes',
            note: 'Generator expressions use `()` instead of `[]`. They produce items one at a time, using constant memory regardless of sequence length.',
            explanation: {
              heading: 'Generator expressions',
              intro: 'A generator expression looks like a list comprehension but uses parentheses and produces values lazily. It is the memory-friendly choice when you only need to iterate once and never hold the whole result.',
              points: [
                { term: 'Lazy evaluation', detail: 'Items are computed as they are consumed, so summing over a million squares never materializes a million-element list.' },
                { term: 'Constant memory', detail: 'Only one value exists at a time, so a generator object stays tiny regardless of how many items it will eventually yield.' },
                { term: 'Passing to functions', detail: 'When a generator expression is the sole argument to a function like sum or any, you can drop the extra parentheses for cleaner code.' },
                { term: 'When a list is better', detail: 'If you need to index, re-iterate, or know the length, build a list instead, since a generator supports none of those directly.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-yield-from',
        title: 'yield from and Coroutines',
        level: 2,
        slug: 'yield-from',
        concepts: [
          {
            id: 'py-yield-from-basic',
            code: 'def flatten(nested):\n    for item in nested:\n        if isinstance(item, list):\n            yield from flatten(item)\n        else:\n            yield item\n\nprint(list(flatten([1, [2, [3, 4]], 5])))  # [1, 2, 3, 4, 5]',
            note: '`yield from` delegates to a sub-generator, flattening nested iteration. It also forwards `.send()` and `.throw()` for coroutine protocols.',
            explanation: {
              heading: 'Delegating with yield from',
              intro: 'The yield from expression lets one generator delegate part of its work to another iterable, yielding all of that iterable values as if they came from the outer generator directly.',
              points: [
                { term: 'Cleaner delegation', detail: 'yield from sub replaces the boilerplate loop that would otherwise yield each item of sub one at a time.' },
                { term: 'Recursion', detail: 'It shines in recursive generators like flattening arbitrarily nested lists, where each level delegates to a recursive call on its sublists.' },
                { term: 'Coroutine forwarding', detail: 'Beyond values, it transparently forwards send and throw to the delegated generator and returns its final value, supporting coroutine pipelines.' },
                { term: 'Modern alternative', detail: 'For asynchronous code, native async/await has largely replaced generator-based coroutines, but yield from remains useful for plain iterator composition.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  // 9. Object-Oriented Programming
  {
    id: 'py-oop',
    title: 'Object-Oriented Programming',
    level: 1,
    slug: 'oop',
    concepts: [],
    children: [
      {
        id: 'py-classes',
        title: 'Classes and Instances',
        level: 2,
        slug: 'classes',
        concepts: [
          {
            id: 'py-class-basic',
            code: 'class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\n    def distance_to(self, other):\n        return ((self.x - other.x)**2 + (self.y - other.y)**2) ** 0.5\n\n    def __repr__(self):\n        return f"Point({self.x}, {self.y})"',
            note: '`__init__` initializes new instances. `self` refers to the current instance. Dunder methods like `__repr__` customize built-in behavior.',
            explanation: {
              heading: 'Classes and instances',
              intro: 'A class is a blueprint that bundles data and the methods that operate on it. Calling the class creates an instance, and __init__ runs to set up that instance initial attributes.',
              points: [
                { term: 'self is explicit', detail: 'Every method receives the instance as its first parameter, conventionally named self, which is how methods read and write per-instance state.' },
                { term: '__init__ initializes', detail: '__init__ is not a constructor that creates the object; it configures an already-created instance by assigning its starting attributes.' },
                { term: 'Dunder methods', detail: 'Special methods with double underscores hook into language features, so defining __repr__ controls how the object prints in the shell and logs.' },
                { term: 'Instance versus class attributes', detail: 'Attributes set on self belong to one instance, while attributes defined in the class body are shared across all instances unless shadowed.' },
              ],
            },
            example: 'p = Point(3, 4)\nprint(p.distance_to(Point(0, 0)))  # 5.0',
          },
        ],
        children: [],
      },
      {
        id: 'py-inheritance',
        title: 'Inheritance and super()',
        level: 2,
        slug: 'inheritance',
        concepts: [
          {
            id: 'py-inherit-basic',
            code: 'class Shape:\n    def area(self):\n        raise NotImplementedError\n\nclass Circle(Shape):\n    def __init__(self, radius):\n        self.radius = radius\n\n    def area(self):\n        return 3.14159 * self.radius ** 2\n\nclass Cylinder(Circle):\n    def __init__(self, radius, height):\n        super().__init__(radius)\n        self.height = height\n\n    def volume(self):\n        return self.area() * self.height',
            note: '`super()` calls the parent method following the MRO. Python supports multiple inheritance — the C3 linearization algorithm resolves method order.',
            explanation: {
              heading: 'Inheritance and super',
              intro: 'Inheritance lets a class reuse and extend the behavior of a parent class. Calling super() dispatches to the next class in the resolution order, which is how subclasses build on top of what they inherit.',
              points: [
                { term: 'Extending behavior', detail: 'A subclass inherits parent methods and may override them, calling super() to keep the parent behavior while adding its own, as when Cylinder reuses Circle setup.' },
                { term: 'super follows the MRO', detail: 'super() does not simply mean the parent; it means the next class along the method resolution order, which matters under multiple inheritance.' },
                { term: 'Cooperative initialization', detail: 'Calling super().__init__ ensures each class in the hierarchy gets a chance to initialize, avoiding skipped or duplicated setup.' },
                { term: 'Favor composition sometimes', detail: 'Deep inheritance chains grow fragile. When behavior is not truly is-a, composing objects is often clearer than extending them.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-dataclasses',
        title: 'Dataclasses',
        level: 2,
        slug: 'dataclasses',
        concepts: [
          {
            id: 'py-dataclass-basic',
            code: 'from dataclasses import dataclass, field\n\n@dataclass(frozen=True)\nclass Config:\n    host: str = "localhost"\n    port: int = 8080\n    tags: list[str] = field(default_factory=list)\n\nc = Config(port=9090)\nprint(c)  # Config(host=\'localhost\', port=9090, tags=[])',
            note: '`@dataclass` auto-generates `__init__`, `__repr__`, `__eq__`. Use `frozen=True` for immutable instances and `field()` for mutable defaults.',
            explanation: {
              heading: 'Boilerplate-free data classes',
              intro: 'The dataclass decorator inspects your annotated class attributes and generates the tedious methods for you. You declare the fields once and get a sensible constructor, representation, and equality for free.',
              points: [
                { term: 'Generated methods', detail: 'By default it writes __init__, __repr__, and __eq__ from the annotated fields, so the class body stays focused on data and real behavior.' },
                { term: 'frozen for immutability', detail: 'Passing frozen=True makes instances read-only and hashable, which is handy for values you want to treat like immutable records.' },
                { term: 'Mutable defaults need field', detail: 'A field defaulting to a list or dict must use field(default_factory=list); a bare mutable default would be shared across instances and is rejected.' },
                { term: 'When to use', detail: 'Dataclasses fit plain data containers well. For rich validation or serialization, libraries like pydantic or attrs may be a better fit.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  // 10. Modules and Packages
  {
    id: 'py-modules',
    title: 'Modules and Packages',
    level: 1,
    slug: 'modules',
    concepts: [],
    children: [
      {
        id: 'py-imports',
        title: 'Import System',
        level: 2,
        slug: 'imports',
        concepts: [
          {
            id: 'py-import-patterns',
            code: 'import os\nfrom pathlib import Path\nfrom collections import defaultdict, Counter\nimport json as j\n\n# Relative imports within a package\n# from .utils import helper\n# from ..config import settings',
            note: 'Python locates modules via `sys.path`. Use absolute imports for clarity. Relative imports (`.` prefix) work only inside packages.',
            explanation: {
              heading: 'How imports resolve',
              intro: 'Importing loads another module and binds names from it into the current namespace. Python searches a list of locations to find the module, then caches it so repeated imports are cheap.',
              points: [
                { term: 'The search path', detail: 'Python looks through sys.path, which includes the script directory, installed packages, and standard library, using the first match it finds.' },
                { term: 'Import forms', detail: 'import module keeps a namespace, from module import name pulls specific names, and as gives an alias to shorten or disambiguate long names.' },
                { term: 'Absolute versus relative', detail: 'Absolute imports name the full path from the top package and read clearly. Relative imports with a leading dot work only inside a package.' },
                { term: 'Modules run once', detail: 'A module executes on first import and is cached in sys.modules, so top-level side effects happen a single time even if imported repeatedly.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-packages',
        title: 'Package Structure',
        level: 2,
        slug: 'packages',
        concepts: [
          {
            id: 'py-package-init',
            code: '# mypackage/__init__.py\nfrom .core import Engine\nfrom .utils import helpers\n\n__all__ = ["Engine", "helpers"]\n__version__ = "1.0.0"',
            note: '`__init__.py` makes a directory a package. `__all__` controls what `from pkg import *` exports. Modern tools support namespace packages without `__init__.py`.',
            explanation: {
              heading: 'Organizing code into packages',
              intro: 'A package is a directory of modules that Python treats as a single importable unit. An __init__.py file marks the directory as a package and can curate the public interface it exposes.',
              points: [
                { term: 'The __init__ file', detail: 'Code in __init__.py runs when the package is first imported, so it can re-export key names to give users a clean, flat import surface.' },
                { term: 'Controlling wildcard exports', detail: 'Defining __all__ lists the names that from package import * brings in, keeping internal helpers private by omission.' },
                { term: 'Metadata conventions', detail: 'Attributes like __version__ live naturally in __init__.py, giving tools and users a single place to read package information.' },
                { term: 'Namespace packages', detail: 'Modern Python allows packages split across directories without an __init__.py, useful for plugins, though an explicit file remains clearer for ordinary projects.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  // 11. File I/O
  {
    id: 'py-file-io',
    title: 'File I/O',
    level: 1,
    slug: 'file-io',
    concepts: [],
    children: [
      {
        id: 'py-reading-writing',
        title: 'Reading and Writing Files',
        level: 2,
        slug: 'reading-writing',
        concepts: [
          {
            id: 'py-file-rw',
            code: 'from pathlib import Path\n\n# Modern pathlib approach\npath = Path("data.txt")\npath.write_text("hello\\nworld")\nlines = path.read_text().splitlines()\n\n# Context manager approach\nwith open("data.txt", "r", encoding="utf-8") as f:\n    for line in f:\n        print(line.strip())',
            note: 'Always use `with` or pathlib to ensure files are properly closed. Specify `encoding="utf-8"` explicitly to avoid platform-dependent defaults.',
            explanation: {
              heading: 'Reading and writing files safely',
              intro: 'Working with files means opening a resource, transferring text or bytes, and closing it. Python offers both a modern pathlib interface and the classic open call, and both should guarantee the file is closed.',
              points: [
                { term: 'Always close with with', detail: 'Wrapping open in a with block closes the file automatically even if an error occurs, preventing leaked file handles and unflushed writes.' },
                { term: 'pathlib convenience', detail: 'Path objects offer read_text and write_text for one-line whole-file operations, which is cleaner than manual open and close for small files.' },
                { term: 'Set the encoding', detail: 'Passing encoding utf-8 avoids relying on a platform default that differs across systems and can silently corrupt non-ASCII text.' },
                { term: 'Stream large files', detail: 'Iterating over a file object yields one line at a time, so you can process gigabytes without loading the whole file into memory.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-json-csv',
        title: 'JSON and CSV',
        level: 2,
        slug: 'json-csv',
        concepts: [
          {
            id: 'py-json-csv-ops',
            code: 'import json, csv\n\n# JSON\ndata = {"users": [{"name": "Ada", "age": 36}]}\nPath("data.json").write_text(json.dumps(data, indent=2))\nloaded = json.loads(Path("data.json").read_text())\n\n# CSV\nwith open("out.csv", "w", newline="") as f:\n    writer = csv.DictWriter(f, fieldnames=["name", "age"])\n    writer.writeheader()\n    writer.writerows(data["users"])',
            note: '`json` handles serialization of dicts, lists, strings, and numbers. `csv.DictWriter` maps dicts to rows with named columns.',
            explanation: {
              heading: 'Structured data formats',
              intro: 'JSON and CSV are two of the most common interchange formats. The standard library ships modules for both, converting between Python objects and their textual representation.',
              points: [
                { term: 'JSON round-trips', detail: 'json.dumps serializes dicts, lists, strings, numbers, booleans, and None to text, and json.loads parses text back into those Python objects.' },
                { term: 'Readable output', detail: 'Passing indent to dumps produces pretty-printed, human-readable JSON, useful for config files and debugging output.' },
                { term: 'CSV with named columns', detail: 'csv.DictWriter maps dictionaries to rows using fieldnames, so you write a header once and each record aligns by key rather than position.' },
                { term: 'Newline handling', detail: 'Open CSV files with newline set to an empty string so the csv module controls line endings and avoids blank rows on some platforms.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  // 12. Error Handling
  {
    id: 'py-error-handling',
    title: 'Error Handling',
    level: 1,
    slug: 'error-handling',
    concepts: [],
    children: [
      {
        id: 'py-try-except',
        title: 'try / except / finally',
        level: 2,
        slug: 'try-except',
        concepts: [
          {
            id: 'py-exceptions-basic',
            code: 'def divide(a, b):\n    try:\n        result = a / b\n    except ZeroDivisionError:\n        return None\n    except (TypeError, ValueError) as e:\n        raise RuntimeError(f"bad input: {e}") from e\n    else:\n        return result\n    finally:\n        print("done")',
            note: '`else` runs only if no exception was raised. `finally` always runs for cleanup. Chain exceptions with `from e` to preserve the original traceback.',
            explanation: {
              heading: 'Structured error handling',
              intro: 'The try statement lets you attempt risky code and respond when it fails. Optional except, else, and finally clauses give precise control over recovery, success handling, and cleanup.',
              points: [
                { term: 'Targeted except clauses', detail: 'Catch specific exception types rather than a bare except, so you only handle failures you understand and let unexpected ones propagate.' },
                { term: 'else and finally roles', detail: 'The else block runs only when no exception occurred, while finally always runs, making it the right place for releasing resources.' },
                { term: 'Preserve the cause', detail: 'Raising a new exception with from e chains it to the original, keeping the underlying traceback so the root cause is not lost.' },
                { term: 'Do not swallow errors', detail: 'Catching everything and continuing silently hides bugs. Handle what you can act on, and re-raise or log the rest.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-custom-exceptions',
        title: 'Custom Exceptions',
        level: 2,
        slug: 'custom-exceptions',
        concepts: [
          {
            id: 'py-custom-exc',
            code: 'class AppError(Exception):\n    """Base error for the application."""\n\nclass ValidationError(AppError):\n    def __init__(self, field, message):\n        self.field = field\n        super().__init__(f"{field}: {message}")\n\ntry:\n    raise ValidationError("email", "invalid format")\nexcept AppError as e:\n    print(e)  # email: invalid format',
            note: 'Define a hierarchy of custom exceptions to enable granular catching. Always inherit from `Exception`, not `BaseException`.',
            explanation: {
              heading: 'Designing your own exceptions',
              intro: 'Custom exception classes give errors meaningful names and let callers catch exactly the failures they care about. Organizing them into a hierarchy makes handling both precise and flexible.',
              points: [
                { term: 'Inherit from Exception', detail: 'Base your errors on Exception, not BaseException, so normal handling and constructs like except Exception still work as expected.' },
                { term: 'A base per application', detail: 'A single root error such as AppError lets callers catch every error from your library with one except while still allowing finer types beneath it.' },
                { term: 'Carry useful data', detail: 'Store attributes like the offending field on the exception, so handlers can inspect structured context instead of parsing the message string.' },
                { term: 'Catch by category', detail: 'Because subclasses are caught by their base, except AppError handles the whole family, which keeps handlers concise while remaining specific.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-exception-groups',
        title: 'Exception Groups (3.11+)',
        level: 2,
        slug: 'exception-groups',
        concepts: [
          {
            id: 'py-exc-group',
            code: 'def process_batch(items):\n    errors = []\n    for item in items:\n        try:\n            validate(item)\n        except ValueError as e:\n            errors.append(e)\n    if errors:\n        raise ExceptionGroup("batch failed", errors)\n\ntry:\n    process_batch(data)\nexcept* ValueError as eg:\n    for e in eg.exceptions:\n        log(e)',
            note: '`ExceptionGroup` bundles multiple errors. `except*` (3.11+) handles subgroups, enabling structured concurrency error propagation.',
            explanation: {
              heading: 'Handling many errors at once',
              intro: 'Some operations can fail in several independent ways at the same time, such as processing a batch or running concurrent tasks. ExceptionGroup (3.11+) collects those failures and except* handles them by type.',
              points: [
                { term: 'Bundling failures', detail: 'Instead of surfacing only the first error, you gather each failure and raise them together in a single ExceptionGroup once processing finishes.' },
                { term: 'except star matching', detail: 'The except* syntax pulls out the subset of the group matching a given type, letting different handlers deal with different error kinds from the same group.' },
                { term: 'Structured concurrency', detail: 'This model pairs naturally with TaskGroup, where several concurrent tasks may each fail and their errors propagate together rather than one masking the rest.' },
                { term: 'Version awareness', detail: 'ExceptionGroup and except* are new in 3.11, so guard usage on the interpreter version if your code must run on older releases.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  // 13. Metaclasses
  {
    id: 'py-metaclasses',
    title: 'Metaclasses',
    level: 1,
    slug: 'metaclasses',
    concepts: [],
    children: [
      {
        id: 'py-meta-basics',
        title: 'Custom Metaclasses',
        level: 2,
        slug: 'custom-metaclasses',
        concepts: [
          {
            id: 'py-meta-impl',
            code: 'class SingletonMeta(type):\n    _instances = {}\n\n    def __call__(cls, *args, **kwargs):\n        if cls not in cls._instances:\n            cls._instances[cls] = super().__call__(*args, **kwargs)\n        return cls._instances[cls]\n\nclass Database(metaclass=SingletonMeta):\n    def __init__(self):\n        self.connection = "connected"\n\nassert Database() is Database()  # same instance',
            note: 'A metaclass controls class creation. `type` is the default metaclass. Override `__new__` or `__call__` to customize instantiation or class construction.',
            explanation: {
              heading: 'Controlling class creation',
              intro: 'Just as a class is a template for its instances, a metaclass is a template for classes. By default every class is built by type, but a custom metaclass can intercept and customize how classes and their instances come into being.',
              points: [
                { term: 'Classes are objects', detail: 'A class is itself an instance of its metaclass, so overriding metaclass hooks lets you shape the class at definition time.' },
                { term: 'new versus call', detail: 'Overriding __new__ on the metaclass customizes how the class is constructed, while overriding __call__ customizes what happens each time the class is instantiated.' },
                { term: 'Singleton example', detail: 'Caching instances in the metaclass __call__ enforces one shared instance per class, since every instantiation routes through that method.' },
                { term: 'Use sparingly', detail: 'Metaclasses are powerful but obscure. For most needs, __init_subclass__ or class decorators are simpler and easier for others to follow.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-meta-init-subclass',
        title: '__init_subclass__',
        level: 2,
        slug: 'init-subclass',
        concepts: [
          {
            id: 'py-init-subclass',
            code: 'class Plugin:\n    registry = []\n\n    def __init_subclass__(cls, **kwargs):\n        super().__init_subclass__(**kwargs)\n        cls.registry.append(cls)\n\nclass AuthPlugin(Plugin): ...\nclass CachePlugin(Plugin): ...\n\nprint(Plugin.registry)  # [AuthPlugin, CachePlugin]',
            note: '`__init_subclass__` (3.6+) is a simpler alternative to metaclasses for hooking into subclass creation without the complexity of `type.__new__`.',
            explanation: {
              heading: 'Reacting to subclass creation',
              intro: 'The __init_subclass__ hook (3.6+) runs on a base class each time a new subclass is defined. It offers most of the power of a metaclass for subclass customization with far less ceremony.',
              points: [
                { term: 'Runs per subclass', detail: 'Python calls the hook on the parent when a subclass is created, passing the new class, which is ideal for auto-registering plugins or validating requirements.' },
                { term: 'Simpler than metaclasses', detail: 'You avoid writing a separate metaclass and overriding type internals; the behavior lives as a plain classmethod on the base.' },
                { term: 'Cooperate with super', detail: 'Always call super().__init_subclass__ so multiple levels or mixins that also define the hook still run correctly.' },
                { term: 'Accepts keyword arguments', detail: 'Subclasses can pass class-level keyword arguments in their definition, which the hook receives, enabling per-subclass configuration.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  // 14. Descriptors
  {
    id: 'py-descriptors',
    title: 'Descriptors',
    level: 1,
    slug: 'descriptors',
    concepts: [],
    children: [
      {
        id: 'py-descriptor-protocol',
        title: 'Descriptor Protocol',
        level: 2,
        slug: 'descriptor-protocol',
        concepts: [
          {
            id: 'py-descriptor-impl',
            code: 'class Validated:\n    def __set_name__(self, owner, name):\n        self.name = name\n\n    def __get__(self, obj, objtype=None):\n        return obj.__dict__.get(self.name)\n\n    def __set__(self, obj, value):\n        if not isinstance(value, int) or value < 0:\n            raise ValueError(f"{self.name} must be a positive int")\n        obj.__dict__[self.name] = value\n\nclass Order:\n    quantity = Validated()\n    price = Validated()',
            note: 'Descriptors implement `__get__`, `__set__`, and/or `__delete__`. They power `property`, `classmethod`, `staticmethod`, and ORMs like SQLAlchemy.',
            explanation: {
              heading: 'The descriptor protocol',
              intro: 'A descriptor is an object that customizes what happens when an attribute is read, written, or deleted on another object. Defining the special access methods lets a reusable class manage attribute behavior across many owners.',
              points: [
                { term: 'The three hooks', detail: 'Implementing __get__, __set__, or __delete__ intercepts attribute access, so a single Validated descriptor can enforce rules for every field that uses it.' },
                { term: 'Knowing its name', detail: 'The __set_name__ hook receives the attribute name at class creation, letting the descriptor store each managed value without hardcoding names.' },
                { term: 'Data versus non-data', detail: 'A descriptor with __set__ is a data descriptor and takes priority over the instance dict, while one with only __get__ can be shadowed by instance attributes.' },
                { term: 'Powers built-ins', detail: 'property, classmethod, staticmethod, and ORM fields are all built on descriptors, so understanding them demystifies a lot of Python machinery.' },
              ],
            },
            example: 'o = Order()\no.quantity = 5   # OK\no.quantity = -1  # raises ValueError',
          },
        ],
        children: [],
      },
      {
        id: 'py-properties',
        title: 'Properties',
        level: 2,
        slug: 'properties',
        concepts: [
          {
            id: 'py-property-usage',
            code: 'class Temperature:\n    def __init__(self, celsius=0):\n        self.celsius = celsius\n\n    @property\n    def fahrenheit(self):\n        return self.celsius * 9 / 5 + 32\n\n    @fahrenheit.setter\n    def fahrenheit(self, value):\n        self.celsius = (value - 32) * 5 / 9',
            note: '`@property` creates a managed attribute using the descriptor protocol. Use it to add validation or computed values without changing the public API.',
            explanation: {
              heading: 'Managed attributes with property',
              intro: 'A property turns method calls into attribute access. Callers read and assign what looks like a plain attribute, while behind the scenes your getter and setter run to compute or validate the value.',
              points: [
                { term: 'Computed on access', detail: 'A property getter can derive a value from other attributes, like converting celsius to fahrenheit each time it is read, without storing a stale copy.' },
                { term: 'Add a setter', detail: 'The matching setter, defined with the name.setter decorator, lets assignment validate input or update related state instead of blindly storing a value.' },
                { term: 'Preserve the interface', detail: 'You can convert a plain attribute into a property later without changing calling code, since access syntax stays identical.' },
                { term: 'Built on descriptors', detail: 'property is a descriptor, so understanding it explains how classmethod and other attribute-managing built-ins work under the hood.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  // 15. ABCs and MRO
  {
    id: 'py-abcs-mro',
    title: 'ABCs and MRO',
    level: 1,
    slug: 'abcs-mro',
    concepts: [],
    children: [
      {
        id: 'py-abc-usage',
        title: 'Abstract Base Classes',
        level: 2,
        slug: 'abstract-base-classes',
        concepts: [
          {
            id: 'py-abc-impl',
            code: 'from abc import ABC, abstractmethod\n\nclass Serializable(ABC):\n    @abstractmethod\n    def serialize(self) -> bytes:\n        ...\n\n    @abstractmethod\n    def deserialize(self, data: bytes) -> "Serializable":\n        ...\n\nclass JsonDoc(Serializable):\n    def serialize(self):\n        return json.dumps(self.__dict__).encode()\n\n    def deserialize(self, data):\n        return JsonDoc(**json.loads(data))',
            note: 'ABCs define interfaces with `@abstractmethod`. Subclasses must implement all abstract methods or they cannot be instantiated.',
            explanation: {
              heading: 'Defining interfaces with ABCs',
              intro: 'An abstract base class declares a contract that subclasses must fulfill. Marking methods as abstract prevents incomplete implementations from being instantiated, catching missing pieces early.',
              points: [
                { term: 'Enforced implementation', detail: 'A class inheriting from an ABC cannot be instantiated until it overrides every method marked with @abstractmethod, so the interface is guaranteed.' },
                { term: 'Documents intent', detail: 'ABCs make an interface explicit in code, communicating to readers exactly which methods any concrete subclass is expected to provide.' },
                { term: 'isinstance checks', detail: 'Concrete subclasses register as instances of the ABC, so isinstance can verify that an object honors the interface at runtime.' },
                { term: 'ABCs versus protocols', detail: 'ABCs require explicit inheritance, while protocols rely on structural matching. Choose ABCs when you want an enforced, nominal contract.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-mro',
        title: 'Method Resolution Order',
        level: 2,
        slug: 'mro',
        concepts: [
          {
            id: 'py-mro-c3',
            code: 'class A:\n    def method(self): return "A"\n\nclass B(A):\n    def method(self): return "B"\n\nclass C(A):\n    def method(self): return "C"\n\nclass D(B, C):\n    pass\n\nprint(D().method())   # "B"\nprint(D.__mro__)      # D -> B -> C -> A -> object',
            note: 'Python uses C3 linearization to resolve method lookup in multiple inheritance. Check `ClassName.__mro__` to see the order.',
            explanation: {
              heading: 'Method resolution order',
              intro: 'When a class inherits from several bases, Python must decide which parent supplies an attribute. The method resolution order is the single, consistent sequence it searches, computed by the C3 linearization algorithm.',
              points: [
                { term: 'A predictable order', detail: 'C3 produces one ordering that respects each class before its parents and preserves the left-to-right order of bases, so lookups are deterministic.' },
                { term: 'Inspecting the MRO', detail: 'Reading ClassName.__mro__ shows the exact chain, which is invaluable for understanding why a particular method was chosen.' },
                { term: 'super follows it', detail: 'A super() call advances to the next class in the MRO rather than a fixed parent, which is what makes cooperative multiple inheritance work.' },
                { term: 'Inconsistent hierarchies fail', detail: 'If bases cannot be ordered consistently, Python raises a TypeError at class creation instead of guessing, forcing you to fix the design.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  // 16. Functools
  {
    id: 'py-functools',
    title: 'Functools',
    level: 1,
    slug: 'functools',
    concepts: [],
    children: [
      {
        id: 'py-functools-cache',
        title: 'Caching and Memoization',
        level: 2,
        slug: 'caching',
        concepts: [
          {
            id: 'py-lru-cache',
            code: 'from functools import lru_cache, cache\n\n@lru_cache(maxsize=128)\ndef expensive(n):\n    print(f"computing {n}")\n    return sum(range(n))\n\nexpensive(1000)  # computes\nexpensive(1000)  # cached\nprint(expensive.cache_info())',
            note: '`@lru_cache` memoizes results keyed by arguments. `@cache` (3.9+) is an unbounded variant. Use `.cache_clear()` to reset.',
            explanation: {
              heading: 'Memoizing with lru_cache',
              intro: 'The lru_cache decorator stores results keyed by the arguments a function was called with, returning the saved value on repeat calls. It trades memory for speed on pure, repeatedly called functions.',
              points: [
                { term: 'Cache by arguments', detail: 'The cache keys on the call arguments, so identical calls skip recomputation. Arguments must be hashable to serve as keys.' },
                { term: 'Bounded versus unbounded', detail: 'lru_cache with a maxsize evicts the least recently used entries when full, while cache (3.9+) keeps everything without eviction.' },
                { term: 'Only for pure functions', detail: 'Memoization is safe only when output depends solely on inputs. Caching a function with side effects or changing external state causes stale results.' },
                { term: 'Inspect and reset', detail: 'cache_info reports hits and misses to gauge effectiveness, and cache_clear empties the cache when inputs or dependencies change.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-functools-partial',
        title: 'partial and reduce',
        level: 2,
        slug: 'partial-reduce',
        concepts: [
          {
            id: 'py-partial-usage',
            code: 'from functools import partial, reduce\n\nint_from_hex = partial(int, base=16)\nprint(int_from_hex("ff"))  # 255\n\n# reduce folds a sequence\nfactorial = lambda n: reduce(lambda a, b: a * b, range(1, n + 1))\nprint(factorial(5))  # 120',
            note: '`partial` freezes some arguments of a function, creating a new callable. `reduce` applies a binary function cumulatively to a sequence.',
            explanation: {
              heading: 'Adapting and folding functions',
              intro: 'partial and reduce are two functional tools. partial pre-fills arguments to specialize a function, while reduce collapses a sequence into a single value by repeatedly applying a two-argument function.',
              points: [
                { term: 'partial pre-binds arguments', detail: 'It returns a new callable with some arguments fixed, so partial(int, base=16) becomes a hex parser without writing a wrapper function.' },
                { term: 'reduce folds left', detail: 'reduce applies a binary function across the sequence, carrying an accumulator, to compute things like a running product or sum in one call.' },
                { term: 'Prefer clarity', detail: 'For sums and similar, built-ins like sum are clearer than reduce. Reach for reduce only when no dedicated built-in expresses the fold.' },
                { term: 'Useful for callbacks', detail: 'partial shines when an API expects a zero or one argument callable but your function needs preset configuration supplied ahead of time.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-singledispatch',
        title: 'Single Dispatch',
        level: 2,
        slug: 'singledispatch',
        concepts: [
          {
            id: 'py-singledispatch-impl',
            code: 'from functools import singledispatch\n\n@singledispatch\ndef format_val(val):\n    return str(val)\n\n@format_val.register(list)\ndef _(val):\n    return ", ".join(map(str, val))\n\n@format_val.register(dict)\ndef _(val):\n    return "; ".join(f"{k}={v}" for k, v in val.items())\n\nprint(format_val([1, 2, 3]))  # "1, 2, 3"',
            note: '`@singledispatch` provides function overloading by the type of the first argument. Register specialized implementations with `.register`.',
            explanation: {
              heading: 'Type-based function overloading',
              intro: 'singledispatch turns a function into a generic that picks an implementation based on the type of its first argument. It offers clean, extensible dispatch without a chain of isinstance checks.',
              points: [
                { term: 'One default, many specializations', detail: 'The decorated function is the fallback, and each registered variant handles a specific type, so the right code runs automatically for each argument type.' },
                { term: 'Registering variants', detail: 'You attach implementations with the register decorator, keyed by type, which keeps each case isolated and easy to read.' },
                { term: 'Open for extension', detail: 'New types can be supported later, even from other modules, by registering another implementation without editing the original function.' },
                { term: 'First argument only', detail: 'Dispatch considers just the first argument. For dispatch on multiple arguments or on methods, look at singledispatchmethod or other designs.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  // 17. Threading
  {
    id: 'py-threading',
    title: 'Threading',
    level: 1,
    slug: 'threading',
    concepts: [],
    children: [
      {
        id: 'py-threads',
        title: 'Threads and Synchronization',
        level: 2,
        slug: 'threads',
        concepts: [
          {
            id: 'py-threads-basic',
            code: 'import threading\n\nlock = threading.Lock()\ncounter = 0\n\ndef increment(n):\n    global counter\n    for _ in range(n):\n        with lock:\n            counter += 1\n\nthreads = [threading.Thread(target=increment, args=(100_000,)) for _ in range(4)]\nfor t in threads: t.start()\nfor t in threads: t.join()\nprint(counter)  # 400000',
            note: 'The GIL allows only one thread to execute Python bytecode at a time, but threads still help with I/O-bound work. Use `Lock` to protect shared mutable state.',
            explanation: {
              heading: 'Threads and shared state',
              intro: 'Threads run within one process and share memory, which makes communication easy but coordination essential. In CPython the GIL serializes bytecode execution, so threads shine for I/O rather than CPU work.',
              points: [
                { term: 'Best for I/O-bound work', detail: 'While a thread waits on network or disk, others can run, so threading improves throughput for I/O even though the GIL limits parallel computation.' },
                { term: 'Protect shared data', detail: 'Concurrent updates to shared mutable state can interleave and corrupt it. A Lock ensures only one thread enters a critical section at a time.' },
                { term: 'Use with for locks', detail: 'Acquiring a lock in a with block guarantees it is released even if the body raises, avoiding deadlocks from forgotten releases.' },
                { term: 'Join to wait', detail: 'Calling join on a thread blocks until it finishes, which is how the main thread collects results before continuing.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-thread-pool',
        title: 'ThreadPoolExecutor',
        level: 2,
        slug: 'thread-pool',
        concepts: [
          {
            id: 'py-threadpool',
            code: 'from concurrent.futures import ThreadPoolExecutor, as_completed\nimport urllib.request\n\nurls = ["https://example.com"] * 5\n\ndef fetch(url):\n    with urllib.request.urlopen(url) as r:\n        return len(r.read())\n\nwith ThreadPoolExecutor(max_workers=4) as pool:\n    futures = {pool.submit(fetch, u): u for u in urls}\n    for f in as_completed(futures):\n        print(f"{futures[f]}: {f.result()} bytes")',
            note: '`ThreadPoolExecutor` manages a pool of worker threads. `as_completed` yields futures as they finish, enabling non-blocking result processing.',
            explanation: {
              heading: 'Pooling worker threads',
              intro: 'ThreadPoolExecutor from concurrent.futures manages a fixed set of worker threads and hands you a future for each submitted job. It abstracts thread lifecycle so you focus on the work rather than manual thread management.',
              points: [
                { term: 'Submit returns futures', detail: 'Each submit schedules a callable and returns a future, a handle whose result you can retrieve later once the work completes.' },
                { term: 'Process as they finish', detail: 'as_completed yields futures in completion order, so you can handle the fastest results first instead of waiting on submission order.' },
                { term: 'Bounded concurrency', detail: 'max_workers caps how many threads run at once, which prevents overwhelming a remote service or exhausting local resources.' },
                { term: 'Best for I/O', detail: 'Like plain threads, the pool helps I/O-bound tasks. For CPU-bound work use ProcessPoolExecutor to sidestep the GIL.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  // 18. Multiprocessing
  {
    id: 'py-multiprocessing',
    title: 'Multiprocessing',
    level: 1,
    slug: 'multiprocessing',
    concepts: [],
    children: [
      {
        id: 'py-process-pool',
        title: 'ProcessPoolExecutor',
        level: 2,
        slug: 'process-pool',
        concepts: [
          {
            id: 'py-processpool',
            code: 'from concurrent.futures import ProcessPoolExecutor\nimport math\n\ndef is_prime(n):\n    if n < 2: return False\n    return all(n % i != 0 for i in range(2, int(math.sqrt(n)) + 1))\n\nnumbers = range(100_000, 100_020)\n\nwith ProcessPoolExecutor() as pool:\n    results = list(pool.map(is_prime, numbers))\n    primes = [n for n, prime in zip(numbers, results) if prime]\n    print(primes)',
            note: 'Processes bypass the GIL for CPU-bound work. Each process has its own memory space — data is serialized via pickle to communicate between them.',
            explanation: {
              heading: 'Parallelism with processes',
              intro: 'ProcessPoolExecutor runs work in separate processes, each with its own interpreter and GIL. That sidesteps the single-process GIL and delivers genuine parallelism for CPU-bound computation across cores.',
              points: [
                { term: 'True parallelism', detail: 'Because each process has an independent GIL, CPU-heavy tasks like prime checking actually run simultaneously on multiple cores.' },
                { term: 'Separate memory', detail: 'Processes do not share memory, so arguments and results are pickled and copied between them, which shapes what you can pass.' },
                { term: 'Serialization cost', detail: 'Only picklable objects can cross the boundary, and large payloads add overhead, so processes suit coarse-grained work rather than tiny tasks.' },
                { term: 'map preserves order', detail: 'pool.map returns results in the same order as the inputs, making it easy to pair each result with its originating value.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-shared-memory',
        title: 'Shared State',
        level: 2,
        slug: 'shared-state',
        concepts: [
          {
            id: 'py-mp-shared',
            code: 'from multiprocessing import Process, Value, Array\n\ndef worker(counter, arr):\n    with counter.get_lock():\n        counter.value += 1\n    for i in range(len(arr)):\n        arr[i] *= 2\n\ncounter = Value("i", 0)\narr = Array("d", [1.0, 2.0, 3.0])\n\np = Process(target=worker, args=(counter, arr))\np.start()\np.join()\nprint(counter.value, list(arr))',
            note: '`Value` and `Array` provide shared memory between processes. Use locks (`get_lock()`) to prevent race conditions on shared data.',
            explanation: {
              heading: 'Sharing state across processes',
              intro: 'Because processes do not share ordinary memory, exchanging mutable state needs explicit shared objects. Value and Array place simple data in shared memory that multiple processes can read and update.',
              points: [
                { term: 'Typed shared memory', detail: 'Value holds a single typed scalar and Array holds a typed sequence, both stored in memory the operating system shares between processes.' },
                { term: 'Guard with locks', detail: 'Concurrent updates still race, so use the built-in lock via get_lock to make read-modify-write sequences atomic and avoid lost updates.' },
                { term: 'Keep it simple', detail: 'Shared memory suits small primitive data. For richer structures, message passing through a Queue or Pipe is usually clearer and safer.' },
                { term: 'Prefer higher-level tools', detail: 'When possible, return results from workers instead of mutating shared state, which avoids synchronization bugs entirely.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  // 19. Asyncio
  {
    id: 'py-asyncio',
    title: 'Asyncio',
    level: 1,
    slug: 'asyncio',
    concepts: [],
    children: [
      {
        id: 'py-async-await',
        title: 'async/await Basics',
        level: 2,
        slug: 'async-await',
        concepts: [
          {
            id: 'py-async-basic',
            code: 'import asyncio\n\nasync def fetch_data(url, delay):\n    await asyncio.sleep(delay)  # simulates I/O\n    return f"data from {url}"\n\nasync def main():\n    results = await asyncio.gather(\n        fetch_data("api/users", 1),\n        fetch_data("api/posts", 2),\n    )\n    print(results)\n\nasyncio.run(main())',
            note: '`async def` creates a coroutine. `await` suspends until a result is ready. `asyncio.gather` runs coroutines concurrently on a single thread.',
            explanation: {
              heading: 'Cooperative concurrency with async',
              intro: 'Async code achieves concurrency on a single thread by letting coroutines voluntarily pause at await points while waiting on I/O. The event loop runs other coroutines during those pauses, so many operations overlap without threads.',
              points: [
                { term: 'Coroutines and await', detail: 'An async def function is a coroutine, and await suspends it until an awaited operation completes, freeing the loop to run other work meanwhile.' },
                { term: 'Concurrency, not parallelism', detail: 'Everything runs on one thread, so async excels at overlapping many I/O waits but does not speed up CPU-bound computation.' },
                { term: 'gather runs together', detail: 'asyncio.gather schedules several coroutines and awaits them together, so total time approaches the slowest one rather than their sum.' },
                { term: 'Do not block the loop', detail: 'Calling a slow synchronous function inside a coroutine stalls the whole loop; use async libraries or offload blocking work to an executor.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-async-patterns',
        title: 'Tasks and Semaphores',
        level: 2,
        slug: 'async-patterns',
        concepts: [
          {
            id: 'py-async-semaphore',
            code: 'import asyncio\n\nasync def limited_fetch(sem, url):\n    async with sem:\n        await asyncio.sleep(0.5)\n        return f"done: {url}"\n\nasync def main():\n    sem = asyncio.Semaphore(5)  # max 5 concurrent\n    tasks = [asyncio.create_task(limited_fetch(sem, f"url/{i}")) for i in range(20)]\n    results = await asyncio.gather(*tasks)\n    print(len(results))\n\nasyncio.run(main())',
            note: '`Semaphore` limits concurrency. `create_task` schedules a coroutine immediately. Use `TaskGroup` (3.11+) for structured concurrency with automatic cancellation.',
            explanation: {
              heading: 'Scheduling and throttling tasks',
              intro: 'Beyond awaiting single coroutines, asyncio lets you launch many tasks and control how many run at once. Tasks schedule work eagerly, while a semaphore caps concurrency to protect downstream resources.',
              points: [
                { term: 'create_task runs eagerly', detail: 'create_task schedules a coroutine on the loop immediately and returns a task handle, so work begins before you await it.' },
                { term: 'Semaphore limits load', detail: 'An async Semaphore permits only a set number of coroutines past it at once, which prevents flooding a server with too many simultaneous requests.' },
                { term: 'Structured concurrency', detail: 'TaskGroup (3.11+) manages a set of tasks together, awaiting them as a unit and cancelling the rest if one fails, which avoids orphaned tasks.' },
                { term: 'Await for results', detail: 'gather with the scheduled tasks collects their results, so you throttle with the semaphore while still gathering every outcome.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-async-iterators',
        title: 'Async Iterators and Generators',
        level: 2,
        slug: 'async-iterators',
        concepts: [
          {
            id: 'py-async-gen',
            code: 'import asyncio\n\nasync def ticker(n, delay):\n    for i in range(n):\n        await asyncio.sleep(delay)\n        yield i\n\nasync def main():\n    async for val in ticker(5, 0.2):\n        print(val)\n\nasyncio.run(main())',
            note: '`async for` iterates over async generators that `yield` between awaits. Useful for streaming data from network sources or databases.',
            explanation: {
              heading: 'Asynchronous iteration',
              intro: 'Async generators combine the laziness of generators with the suspension of coroutines. They can await between yields, so async for consumes a stream of values that each arrive after some asynchronous work.',
              points: [
                { term: 'yield plus await', detail: 'An async generator awaits inside its body and yields values over time, modeling streams like paginated APIs or live database cursors.' },
                { term: 'Consume with async for', detail: 'The async for loop pulls values as they become ready, suspending politely between them so the event loop keeps serving other tasks.' },
                { term: 'Backpressure friendly', detail: 'Because values are produced on demand, the consumer sets the pace, which naturally limits how far ahead the producer runs.' },
                { term: 'Cleanup matters', detail: 'Async generators may hold resources like connections, so close them properly, often via async with or explicit aclose, to release them promptly.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  // 20. GIL and Concurrency
  {
    id: 'py-gil',
    title: 'The GIL',
    level: 1,
    slug: 'gil',
    concepts: [],
    children: [
      {
        id: 'py-gil-explained',
        title: 'Understanding the GIL',
        level: 2,
        slug: 'gil-explained',
        concepts: [
          {
            id: 'py-gil-impact',
            code: 'import threading, time\n\ndef cpu_bound(n):\n    total = 0\n    for i in range(n):\n        total += i * i\n    return total\n\nstart = time.perf_counter()\n# Two threads won\'t speed up CPU work\nt1 = threading.Thread(target=cpu_bound, args=(10_000_000,))\nt2 = threading.Thread(target=cpu_bound, args=(10_000_000,))\nt1.start(); t2.start()\nt1.join(); t2.join()\nprint(f"Threaded: {time.perf_counter() - start:.2f}s")',
            note: 'The Global Interpreter Lock prevents true parallel execution of Python bytecode. CPU-bound threads gain no speedup — use multiprocessing or C extensions instead.',
            explanation: {
              heading: 'Understanding the GIL',
              intro: 'The Global Interpreter Lock is a mutex in CPython that lets only one thread execute Python bytecode at a time. It simplifies memory management but limits how much threads can help with heavy computation.',
              points: [
                { term: 'Why it exists', detail: 'The GIL makes CPython object memory management simpler and faster in the single-threaded case by avoiding fine-grained locking on every operation.' },
                { term: 'No CPU speedup from threads', detail: 'Because only one thread runs bytecode at once, splitting a CPU-bound loop across threads yields little or no gain and can even add overhead.' },
                { term: 'I/O releases the lock', detail: 'The GIL is released during blocking I/O, so threads still overlap network and disk waits effectively, which is where threading pays off.' },
                { term: 'Ways around it', detail: 'For parallel computation, use multiprocessing, native extensions that release the GIL, or the newer free-threaded build.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-free-threading',
        title: 'Free-Threaded Python (3.13+)',
        level: 2,
        slug: 'free-threading',
        concepts: [
          {
            id: 'py-nogil',
            code: '# Python 3.13+ experimental free-threaded mode\n# Build with: ./configure --disable-gil\n# Or: python3.13t (free-threaded binary)\nimport sys\nprint(sys._is_gil_enabled())  # False in free-threaded build\n\n# True parallel threads for CPU-bound work\n# Requires thread-safe C extensions',
            note: 'PEP 703 introduces an optional GIL-free build. Libraries must be updated for thread safety. This is experimental in 3.13 and aims for full support in future versions.',
            explanation: {
              heading: 'The free-threaded build',
              intro: 'PEP 703 introduces an experimental build of CPython that removes the GIL, allowing threads to execute Python bytecode in parallel. It is available as an optional build starting in 3.13 and is still maturing.',
              points: [
                { term: 'Real thread parallelism', detail: 'Without the GIL, CPU-bound threads can run simultaneously across cores, closing a long-standing gap with multiprocessing for shared-memory workloads.' },
                { term: 'Opt-in build', detail: 'It is a separate build, not the default. You must obtain a free-threaded interpreter and can check the state at runtime rather than assume it.' },
                { term: 'Library thread safety', detail: 'C extensions and libraries that relied on the GIL for implicit safety must be updated, so the ecosystem needs time to adapt before broad use.' },
                { term: 'Still experimental', detail: 'Expect performance and compatibility rough edges in 3.13. Treat it as forward-looking rather than production-ready for most projects today.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  // 21. Type Hints
  {
    id: 'py-typing',
    title: 'Type Hints',
    level: 1,
    slug: 'typing',
    concepts: [],
    children: [
      {
        id: 'py-typing-basics',
        title: 'Basic Type Annotations',
        level: 2,
        slug: 'type-annotations',
        concepts: [
          {
            id: 'py-typing-basic',
            code: 'from typing import Optional\n\ndef greet(name: str, times: int = 1) -> str:\n    return (f"Hello, {name}! " * times).strip()\n\ndef find_user(user_id: int) -> Optional[dict]:\n    users = {1: {"name": "Ada"}}\n    return users.get(user_id)\n\n# Python 3.10+ union syntax\ndef process(data: str | bytes) -> str:\n    if isinstance(data, bytes):\n        return data.decode()\n    return data',
            note: 'Type hints are not enforced at runtime — they are for static checkers like mypy and pyright. Use `X | Y` (3.10+) instead of `Union[X, Y]`.',
            explanation: {
              heading: 'Annotating types',
              intro: 'Type hints document the types a function expects and returns. Python itself does not enforce them, but static analysis tools read them to catch mismatches before the code ever runs.',
              points: [
                { term: 'Checked statically, not at runtime', detail: 'Tools like mypy and pyright verify hints during analysis. At runtime the annotations are metadata and do not coerce or reject values on their own.' },
                { term: 'Modern union syntax', detail: 'Since 3.10 you can write X | Y for a union and use built-in generics like list[int], which is cleaner than the older typing module forms.' },
                { term: 'Optional values', detail: 'A value that may be missing is typed as Optional or X | None, signaling to both readers and checkers that None is a valid result.' },
                { term: 'Gradual adoption', detail: 'You can annotate incrementally, adding hints to the most important boundaries first, which makes large untyped codebases safer over time.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-protocols',
        title: 'Protocols (Structural Typing)',
        level: 2,
        slug: 'protocols',
        concepts: [
          {
            id: 'py-protocol-impl',
            code: 'from typing import Protocol, runtime_checkable\n\n@runtime_checkable\nclass Drawable(Protocol):\n    def draw(self) -> None: ...\n\nclass Circle:\n    def draw(self) -> None:\n        print("drawing circle")\n\ndef render(shape: Drawable) -> None:\n    shape.draw()\n\nrender(Circle())  # OK — Circle satisfies Drawable structurally\nprint(isinstance(Circle(), Drawable))  # True',
            note: 'Protocols define structural (duck-type) interfaces. A class satisfies a Protocol without explicitly inheriting it — just implement the required methods.',
            explanation: {
              heading: 'Structural typing with protocols',
              intro: 'A Protocol describes an interface by its methods and attributes rather than by inheritance. Any class that has the right members satisfies the protocol automatically, formalizing Python duck typing for static checkers.',
              points: [
                { term: 'No inheritance needed', detail: 'A class conforms simply by implementing the required methods, so existing classes can satisfy a protocol without being modified or importing it.' },
                { term: 'Duck typing made explicit', detail: 'Protocols capture the informal if it has draw, it is drawable rule in a form that mypy and pyright can verify.' },
                { term: 'Optional runtime checks', detail: 'Decorating a protocol with runtime_checkable lets isinstance verify the required methods exist, though it checks presence, not signatures.' },
                { term: 'Protocols versus ABCs', detail: 'Choose protocols for loose, structural contracts and ABCs when you want explicit, enforced inheritance and shared implementation.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-typeddict',
        title: 'TypedDict',
        level: 2,
        slug: 'typeddict',
        concepts: [
          {
            id: 'py-typeddict-impl',
            code: 'from typing import TypedDict, NotRequired\n\nclass UserProfile(TypedDict):\n    name: str\n    email: str\n    age: NotRequired[int]\n\ndef create_user(profile: UserProfile) -> None:\n    print(f"Creating {profile[\'name\']}")\n\ncreate_user({"name": "Ada", "email": "ada@example.com"})  # OK\n# create_user({"name": "Ada"})  # mypy error: missing "email"',
            note: '`TypedDict` types plain dicts with specific key-value types. `NotRequired` (3.11+) marks optional keys. Useful for JSON payloads and config objects.',
            explanation: {
              heading: 'Typing dictionary shapes',
              intro: 'A TypedDict describes the expected keys and value types of a plain dict. It gives static checkers insight into dictionary-shaped data like JSON payloads without changing how the dict behaves at runtime.',
              points: [
                { term: 'Keys with types', detail: 'Each declared key maps to a value type, so a checker flags missing keys, unexpected keys, or values of the wrong type.' },
                { term: 'Optional keys', detail: 'NotRequired (3.11+) marks a key that may be absent, distinguishing genuinely optional fields from required ones in the same structure.' },
                { term: 'Still a plain dict', detail: 'At runtime a TypedDict instance is an ordinary dict with no extra checks, so the typing benefit is entirely at analysis time.' },
                { term: 'Good for payloads', detail: 'It is well suited to describing API request and response bodies or config objects where a dataclass would be heavier than needed.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  // 22. Packaging
  {
    id: 'py-packaging',
    title: 'Packaging',
    level: 1,
    slug: 'packaging',
    concepts: [],
    children: [
      {
        id: 'py-pyproject',
        title: 'pyproject.toml',
        level: 2,
        slug: 'pyproject-toml',
        concepts: [
          {
            id: 'py-pyproject-setup',
            code: '# pyproject.toml\n# [project]\n# name = "mypackage"\n# version = "1.0.0"\n# requires-python = ">=3.10"\n# dependencies = ["httpx>=0.25", "pydantic>=2.0"]\n#\n# [project.scripts]\n# mycli = "mypackage.cli:main"\n#\n# [build-system]\n# requires = ["hatchling"]\n# build-backend = "hatchling.build"',
            note: 'PEP 621 standardizes project metadata in `pyproject.toml`. Build backends (hatchling, setuptools, flit) handle wheel creation. `pip install -e .` for editable installs.',
            explanation: {
              heading: 'Declaring project metadata',
              intro: 'The pyproject.toml file is the modern, standardized home for a project name, version, dependencies, and build configuration. It replaces the older scattered setup files with a single declarative source.',
              points: [
                { term: 'Standard project table', detail: 'PEP 621 defines the project section, so name, version, dependencies, and the required Python version live in one predictable place.' },
                { term: 'Pluggable build backends', detail: 'The build-system section names a backend such as hatchling, setuptools, or flit, which turns your source into installable wheels.' },
                { term: 'Entry points', detail: 'Declaring project.scripts wires a command-line name to a function, so installing the package exposes a runnable CLI.' },
                { term: 'Editable installs', detail: 'Running pip install with -e links the package to your source tree, so code changes take effect without reinstalling during development.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-virtual-envs',
        title: 'Virtual Environments',
        level: 2,
        slug: 'virtual-envs',
        concepts: [
          {
            id: 'py-venv-usage',
            code: '# Create and activate a virtual environment\n# python -m venv .venv\n# source .venv/bin/activate  (Linux/macOS)\n# .venv\\Scripts\\activate     (Windows)\n\n# Install dependencies\n# pip install -r requirements.txt\n# pip freeze > requirements.txt\n\n# Modern alternative: uv\n# uv venv\n# uv pip install httpx',
            note: 'Virtual environments isolate project dependencies. Use `venv` (stdlib) or `uv` (fast Rust-based installer). Never install packages globally for projects.',
            explanation: {
              heading: 'Isolating dependencies',
              intro: 'A virtual environment is a self-contained directory with its own Python and installed packages. It keeps each project dependencies separate, so different projects can require different, even conflicting, versions.',
              points: [
                { term: 'Per-project isolation', detail: 'Installing into an activated environment affects only that project, which prevents one project from breaking another through shared global packages.' },
                { term: 'Activate to use', detail: 'Activation adjusts your shell so python and pip point at the environment. The activation command differs slightly between Windows and Unix shells.' },
                { term: 'Pin dependencies', detail: 'Freezing installed versions into a requirements file lets teammates and deployments recreate the exact same environment reliably.' },
                { term: 'Modern tooling', detail: 'The stdlib venv works everywhere, while faster tools like uv speed up creation and installation, but the isolation principle is the same.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  // 23. Testing with Pytest
  {
    id: 'py-pytest',
    title: 'Testing with Pytest',
    level: 1,
    slug: 'pytest',
    concepts: [],
    children: [
      {
        id: 'py-pytest-basics',
        title: 'Writing Tests',
        level: 2,
        slug: 'writing-tests',
        concepts: [
          {
            id: 'py-pytest-test',
            code: 'import pytest\n\ndef add(a, b):\n    return a + b\n\ndef test_add():\n    assert add(2, 3) == 5\n    assert add(-1, 1) == 0\n\n@pytest.mark.parametrize("a,b,expected", [\n    (1, 2, 3),\n    (0, 0, 0),\n    (-1, -1, -2),\n])\ndef test_add_parametrized(a, b, expected):\n    assert add(a, b) == expected',
            note: 'Pytest discovers `test_*` functions automatically. Use plain `assert` — pytest rewrites assertions to show detailed failure info. `@parametrize` runs a test with multiple inputs.',
            explanation: {
              heading: 'Writing tests with pytest',
              intro: 'Pytest lets you write tests as plain functions using ordinary assert statements. It discovers them automatically and reports rich failure details, keeping tests concise and readable.',
              points: [
                { term: 'Convention-based discovery', detail: 'Files and functions named with a test prefix are found and run automatically, so there is little ceremony to add a new test.' },
                { term: 'Plain assert', detail: 'Pytest rewrites assert statements to show the actual values on failure, so you get informative diagnostics without special assertion methods.' },
                { term: 'Parametrize inputs', detail: 'The parametrize marker runs the same test across many input sets, turning repetitive cases into one compact, well-labeled table.' },
                { term: 'Test one thing', detail: 'Keep each test focused on a single behavior so a failure points clearly at what broke rather than a tangle of unrelated checks.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-pytest-fixtures',
        title: 'Fixtures and Mocking',
        level: 2,
        slug: 'fixtures',
        concepts: [
          {
            id: 'py-fixtures-impl',
            code: 'import pytest\nfrom unittest.mock import patch, MagicMock\n\n@pytest.fixture\ndef db():\n    conn = create_connection()\n    yield conn\n    conn.close()\n\ndef test_query(db):\n    result = db.execute("SELECT 1")\n    assert result is not None\n\n@patch("myapp.service.requests.get")\ndef test_api_call(mock_get):\n    mock_get.return_value = MagicMock(status_code=200, json=lambda: {"ok": True})\n    response = my_service.fetch_data()\n    assert response["ok"] is True',
            note: 'Fixtures provide setup/teardown via `yield`. They support scopes (function, module, session). Use `unittest.mock.patch` to replace external dependencies in tests.',
            explanation: {
              heading: 'Fixtures and test doubles',
              intro: 'Fixtures supply the setup a test needs and clean up afterward, injected simply by naming them as parameters. Mocking replaces real external dependencies so tests stay fast, deterministic, and isolated.',
              points: [
                { term: 'Setup and teardown', detail: 'A fixture that yields runs setup before the yield and teardown after, so resources like connections are opened and reliably closed around each test.' },
                { term: 'Scopes control reuse', detail: 'Fixture scope such as function, module, or session decides how often it is recreated, letting you share expensive setup when it is safe to do so.' },
                { term: 'Patch external calls', detail: 'unittest.mock.patch temporarily swaps out network or filesystem calls with controllable stand-ins, so tests do not depend on outside services.' },
                { term: 'Assert on interactions', detail: 'Mock objects record how they were called, letting you verify that your code invoked a dependency with the expected arguments.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  // 24. Context Managers
  {
    id: 'py-context-managers',
    title: 'Context Managers',
    level: 1,
    slug: 'context-managers',
    concepts: [],
    children: [
      {
        id: 'py-with-statement',
        title: 'The with Statement',
        level: 2,
        slug: 'with-statement',
        concepts: [
          {
            id: 'py-contextmanager-impl',
            code: 'from contextlib import contextmanager\nimport time\n\n@contextmanager\ndef timer(label):\n    start = time.perf_counter()\n    yield\n    elapsed = time.perf_counter() - start\n    print(f"{label}: {elapsed:.3f}s")\n\nwith timer("sort"):\n    sorted(range(1_000_000, 0, -1))',
            note: '`@contextmanager` turns a generator into a context manager. Code before `yield` is `__enter__`, code after is `__exit__`. Ideal for timing, transactions, and temp state.',
            explanation: {
              heading: 'Context managers from generators',
              intro: 'The contextmanager decorator lets you write a context manager as a simple generator with one yield. It is a lightweight alternative to defining a class with enter and exit methods.',
              points: [
                { term: 'Split by yield', detail: 'Everything before the yield acts as setup that runs on entering the with block, and everything after runs as cleanup on exit.' },
                { term: 'Guaranteed cleanup', detail: 'The with statement ensures the code after yield runs even if the body raises, so resources and temporary state are always restored.' },
                { term: 'Handle errors with try', detail: 'To react to exceptions, wrap the yield in try and finally so cleanup happens and you can optionally observe or re-raise the error.' },
                { term: 'When to prefer a class', detail: 'The generator form is ideal for simple setup and teardown; a class-based manager is clearer when you need to store state or suppress exceptions.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-class-context-mgr',
        title: 'Class-based Context Managers',
        level: 2,
        slug: 'class-context-managers',
        concepts: [
          {
            id: 'py-class-cm',
            code: 'class DatabaseTransaction:\n    def __init__(self, conn):\n        self.conn = conn\n\n    def __enter__(self):\n        self.conn.begin()\n        return self.conn\n\n    def __exit__(self, exc_type, exc_val, exc_tb):\n        if exc_type:\n            self.conn.rollback()\n        else:\n            self.conn.commit()\n        return False  # do not suppress exceptions\n\nwith DatabaseTransaction(conn) as db:\n    db.execute("INSERT ...")',
            note: '`__enter__` sets up the resource, `__exit__` cleans up. Return `True` from `__exit__` to suppress exceptions (rarely desired).',
            explanation: {
              heading: 'Class-based context managers',
              intro: 'Implementing __enter__ and __exit__ makes a class usable in a with statement. This form suits managers that hold state or need full control over how exceptions are handled on exit.',
              points: [
                { term: 'enter returns the resource', detail: '__enter__ performs setup and returns the object bound by the as clause, which is what the body of the with block works with.' },
                { term: 'exit always runs', detail: '__exit__ runs on leaving the block whether it finished normally or raised, receiving details of any exception so it can commit or roll back.' },
                { term: 'Suppressing exceptions', detail: 'Returning a truthy value from __exit__ swallows the exception. This is rarely desired, so return False to let errors propagate normally.' },
                { term: 'Transactional pattern', detail: 'Databases and locks fit this shape well: acquire in enter, then commit on success or roll back and release in exit.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  // 25. Itertools
  {
    id: 'py-itertools',
    title: 'Itertools',
    level: 1,
    slug: 'itertools',
    concepts: [],
    children: [
      {
        id: 'py-itertools-combinatoric',
        title: 'Combinatoric Iterators',
        level: 2,
        slug: 'combinatoric',
        concepts: [
          {
            id: 'py-itertools-combo',
            code: 'from itertools import combinations, permutations, product\n\nprint(list(combinations("ABCD", 2)))\n# [(A,B),(A,C),(A,D),(B,C),(B,D),(C,D)]\n\nprint(list(permutations("AB", 2)))\n# [(A,B),(B,A)]\n\n# Cartesian product\nprint(list(product([0, 1], repeat=3)))\n# all 3-bit binary numbers',
            note: '`combinations` gives subsets without repetition. `permutations` gives ordered arrangements. `product` gives the Cartesian product (nested loops).',
            explanation: {
              heading: 'Combinatoric iterators',
              intro: 'The itertools module provides efficient building blocks for generating arrangements of items. combinations, permutations, and product cover the common combinatorial needs without hand-written nested loops.',
              points: [
                { term: 'combinations', detail: 'It yields unordered subsets of a chosen size with no repeats, so choosing 2 from ABCD treats AB and BA as the same pair.' },
                { term: 'permutations', detail: 'It yields ordered arrangements, so order matters and AB differs from BA, which suits ranking or sequencing problems.' },
                { term: 'product', detail: 'It computes the Cartesian product, equivalent to nested for loops, and repeat lets you pair a sequence with itself several times.' },
                { term: 'Lazy and large', detail: 'These return iterators, computing items on demand, which is essential because the number of arrangements grows explosively with input size.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-itertools-chaining',
        title: 'Chaining and Grouping',
        level: 2,
        slug: 'chaining-grouping',
        concepts: [
          {
            id: 'py-itertools-chain',
            code: 'from itertools import chain, groupby, islice\n\n# Flatten multiple iterables\nflat = list(chain([1, 2], [3, 4], [5]))\n\n# Group consecutive items\ndata = sorted(["apple", "avocado", "banana", "blueberry"], key=lambda s: s[0])\nfor key, group in groupby(data, key=lambda s: s[0]):\n    print(key, list(group))\n\n# Take first N from infinite iterator\nfrom itertools import count\nfirst_5_evens = list(islice((x for x in count() if x % 2 == 0), 5))',
            note: '`chain` concatenates iterables lazily. `groupby` clusters consecutive items by key (sort first!). `islice` takes a slice from any iterator.',
            explanation: {
              heading: 'Chaining, grouping, and slicing streams',
              intro: 'These itertools helpers manipulate iterators lazily. They let you join, cluster, and slice sequences without building intermediate lists, which keeps memory use low even on large or infinite streams.',
              points: [
                { term: 'chain concatenates', detail: 'chain treats several iterables as one continuous stream, iterating them back to back without copying their contents into a new list.' },
                { term: 'groupby needs sorting', detail: 'groupby clusters only consecutive items sharing a key, so you must sort by that same key first or groups will be fragmented.' },
                { term: 'islice for slicing iterators', detail: 'Ordinary slicing does not work on iterators, but islice takes a start, stop, and step from any iterator, even an infinite one.' },
                { term: 'Groups are consumed once', detail: 'The group iterator that groupby yields is valid only until the next group, so materialize it with list if you need it later.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  // 26. String Formatting
  {
    id: 'py-string-formatting',
    title: 'String Formatting',
    level: 1,
    slug: 'string-formatting',
    concepts: [],
    children: [
      {
        id: 'py-fstrings',
        title: 'f-strings',
        level: 2,
        slug: 'fstrings',
        concepts: [
          {
            id: 'py-fstring-features',
            code: "name = \"Ada\"\npi = 3.14159\n\n# Basic interpolation\nprint(f\"Hello, {name}!\")\n\n# Format specs\nprint(f\"Pi is {pi:.2f}\")        # 3.14\nprint(f\"{'left':<10}|{'right':>10}\")\n\n# Expressions and debugging (3.8+)\nprint(f\"{len(name) = }\")         # len(name) = 3\nprint(f\"{name!r}\")               # 'Ada' (repr)",
            note: 'f-strings (3.6+) embed expressions in `{}`. Use `:` for format specs. The `=` suffix (3.8+) prints both the expression and its value for debugging.',
            explanation: {
              heading: 'Formatting with f-strings',
              intro: 'An f-string embeds expressions directly inside string literals, evaluating them and inserting the results. It is the fastest and most readable way to build strings from values in modern Python.',
              points: [
                { term: 'Inline expressions', detail: 'Anything inside the braces is a real expression, so you can call functions, do arithmetic, or index right where the value belongs.' },
                { term: 'Format specifications', detail: 'A colon inside the braces introduces a format spec controlling precision, width, and alignment, such as limiting a float to two decimals.' },
                { term: 'Debug shorthand', detail: 'The equals suffix (3.8+) prints both the expression text and its value, which is a quick, self-labeling way to inspect variables.' },
                { term: 'repr with bang r', detail: 'Adding an r conversion inserts the repr of a value rather than its str, useful for showing quotes and unambiguous representations.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-template-strings',
        title: 'Template Strings',
        level: 2,
        slug: 'template-strings',
        concepts: [
          {
            id: 'py-template-impl',
            code: 'from string import Template\n\n# Safe substitution for user-provided templates\ntmpl = Template("Hello, $name! You have $count messages.")\nresult = tmpl.safe_substitute(name="Ada", count=5)\nprint(result)\n\n# .format() for reusable patterns\npattern = "{verb} the {noun}"\nprint(pattern.format(verb="Feed", noun="cat"))',
            note: '`Template` is safe for user-provided format strings (no code execution). Use `.format()` for reusable templates. Prefer f-strings for internal code.',
            explanation: {
              heading: 'Template and format strings',
              intro: 'When the template text comes from outside your code, or you want a reusable pattern applied many times, string.Template and the format method are safer or more flexible choices than embedding logic in an f-string.',
              points: [
                { term: 'Safe substitution', detail: 'Template uses simple dollar placeholders and never evaluates code, so it is appropriate for format strings supplied by users or config.' },
                { term: 'safe_substitute tolerates gaps', detail: 'Its safe_substitute leaves unknown placeholders untouched instead of raising, which is forgiving when not every field is provided.' },
                { term: 'Reusable format patterns', detail: 'The format method fills numbered or named braces from arguments, so one pattern string can be reused with different values.' },
                { term: 'When to use each', detail: 'Prefer f-strings for internal code you control, format for stored reusable patterns, and Template whenever the pattern is untrusted input.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  // 27. Magic Methods (Dunder Methods)
  {
    id: 'py-magic-methods',
    title: 'Magic Methods',
    level: 1,
    slug: 'magic-methods',
    concepts: [],
    children: [
      {
        id: 'py-operator-overloading',
        title: 'Operator Overloading',
        level: 2,
        slug: 'operator-overloading',
        concepts: [
          {
            id: 'py-operators',
            code: 'class Vector:\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n\n    def __add__(self, other):\n        return Vector(self.x + other.x, self.y + other.y)\n\n    def __mul__(self, scalar):\n        return Vector(self.x * scalar, self.y * scalar)\n\n    def __repr__(self):\n        return f"Vector({self.x}, {self.y})"\n\n    def __eq__(self, other):\n        return (self.x, self.y) == (other.x, other.y)\n\nv = Vector(1, 2) + Vector(3, 4)  # Vector(4, 6)',
            note: 'Dunder methods let objects work with operators and built-in functions. `__add__` enables `+`, `__eq__` enables `==`, `__repr__` controls `repr()`.',
            explanation: {
              heading: 'Overloading operators',
              intro: 'Special dunder methods let your objects participate in built-in syntax. By defining the right methods, a custom class can support arithmetic operators, comparisons, and readable representations like a native type.',
              points: [
                { term: 'Operators map to methods', detail: 'Python translates a + b into a.__add__(b), so defining __add__ on Vector makes the plus operator combine two vectors meaningfully.' },
                { term: 'Equality and repr', detail: 'Implementing __eq__ defines what equal means for your objects, while __repr__ gives a clear, ideally unambiguous, string for debugging.' },
                { term: 'Return new objects', detail: 'Arithmetic dunders usually return a new instance rather than mutating self, matching how numbers behave and avoiding surprising side effects.' },
                { term: 'Keep semantics intuitive', detail: 'Overload operators only when the meaning is obvious. Surprising behavior, like a plus that subtracts, makes code harder to reason about.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-container-protocol',
        title: 'Container Protocol',
        level: 2,
        slug: 'container-protocol',
        concepts: [
          {
            id: 'py-container-impl',
            code: 'class Registry:\n    def __init__(self):\n        self._items = {}\n\n    def __setitem__(self, key, value):\n        self._items[key] = value\n\n    def __getitem__(self, key):\n        return self._items[key]\n\n    def __contains__(self, key):\n        return key in self._items\n\n    def __len__(self):\n        return len(self._items)\n\n    def __iter__(self):\n        return iter(self._items)\n\nreg = Registry()\nreg["user"] = "Ada"\nprint("user" in reg)  # True',
            note: 'Implement `__getitem__`, `__setitem__`, `__contains__`, `__len__`, and `__iter__` to make objects behave like built-in containers.',
            explanation: {
              heading: 'The container protocol',
              intro: 'By implementing a handful of dunder methods, a class can behave like a built-in container, supporting indexing, membership tests, length, and iteration. Callers then use familiar syntax without knowing the internals.',
              points: [
                { term: 'Indexing', detail: 'Defining __getitem__ and __setitem__ enables square-bracket access and assignment, so obj[key] reads and writes just like a dict or list.' },
                { term: 'Membership and length', detail: '__contains__ powers the in operator and __len__ powers len, letting your object answer common questions efficiently and idiomatically.' },
                { term: 'Iteration', detail: '__iter__ makes the object usable in for loops and comprehensions by returning an iterator over its contents.' },
                { term: 'Consider existing bases', detail: 'For richer behavior, subclassing collections.abc types provides many mixin methods for free once you implement the required few.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  // 28. Regular Expressions
  {
    id: 'py-regex',
    title: 'Regular Expressions',
    level: 1,
    slug: 'regex',
    concepts: [],
    children: [
      {
        id: 'py-regex-patterns',
        title: 'Pattern Matching',
        level: 2,
        slug: 'regex-patterns',
        concepts: [
          {
            id: 'py-regex-basic',
            code: 'import re\n\ntext = "Contact: alice@example.com or bob@test.org"\npattern = r"[\\w.+-]+@[\\w-]+\\.[\\w.-]+"\n\nemails = re.findall(pattern, text)\nprint(emails)  # [\'alice@example.com\', \'bob@test.org\']\n\n# Named groups\nm = re.match(r"(?P<year>\\d{4})-(?P<month>\\d{2})", "2024-03-15")\nprint(m.group("year"))  # 2024\n\n# Compiled pattern for reuse\nemail_re = re.compile(pattern)\nassert email_re.search("hi bob@test.org") is not None',
            note: 'Use raw strings (`r""`) for regex patterns. `re.compile()` pre-compiles for performance. Named groups `(?P<name>...)` improve readability.',
            explanation: {
              heading: 'Matching patterns with regex',
              intro: 'Regular expressions describe text patterns for searching, extracting, and validating strings. The re module compiles these patterns and offers functions to find matches and pull out captured pieces.',
              points: [
                { term: 'Use raw strings', detail: 'Writing patterns as raw strings prevents Python from interpreting backslashes first, so regex escapes like word boundaries reach the engine intact.' },
                { term: 'Capture groups', detail: 'Parentheses capture sub-parts of a match, and named groups make those captures self-documenting and easier to reference than numeric positions.' },
                { term: 'Compile for reuse', detail: 'Compiling a pattern once with re.compile avoids recompiling on every call, which matters when the same pattern runs in a loop.' },
                { term: 'Mind readability', detail: 'Complex regexes become write-only. Comment them, split them up, or use verbose mode so future readers can follow the intent.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-regex-sub',
        title: 'Substitution and Splitting',
        level: 2,
        slug: 'regex-sub',
        concepts: [
          {
            id: 'py-regex-replace',
            code: 'import re\n\n# Replace with backreference\nresult = re.sub(r"(\\w+)@(\\w+)", r"\\1 [at] \\2", "user@domain")\nprint(result)  # "user [at] domain"\n\n# Split on multiple delimiters\nparts = re.split(r"[;,\\s]+", "one, two;three   four")\nprint(parts)  # [\'one\', \'two\', \'three\', \'four\']',
            note: '`re.sub` replaces matches, supporting backreferences (`\\1`). `re.split` splits on regex patterns — more flexible than `str.split()`.',
            explanation: {
              heading: 'Substituting and splitting with regex',
              intro: 'Beyond finding matches, regex can transform text. re.sub replaces every match with new content, and re.split breaks a string wherever a pattern matches, both handling cases plain string methods cannot.',
              points: [
                { term: 'Replacement with backreferences', detail: 'In the replacement text a backreference like the first group inserts what a capture group matched, so you can rearrange rather than just erase.' },
                { term: 'Pattern-based splitting', detail: 're.split divides on a regex, so you can split on any run of whitespace or several delimiters at once, which str.split cannot express.' },
                { term: 'Callable replacements', detail: 'Passing a function to re.sub computes each replacement dynamically from the match object, enabling context-aware transformations.' },
                { term: 'Watch empty matches', detail: 'Patterns that can match empty strings may produce surprising splits or replacements, so test edge cases like leading or trailing delimiters.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  // 29. Collections Module
  {
    id: 'py-collections',
    title: 'Collections Module',
    level: 1,
    slug: 'collections',
    concepts: [],
    children: [
      {
        id: 'py-counter-defaultdict',
        title: 'Counter and defaultdict',
        level: 2,
        slug: 'counter-defaultdict',
        concepts: [
          {
            id: 'py-counter-dd',
            code: 'from collections import Counter, defaultdict\n\nwords = "the cat sat on the mat the cat".split()\nfreqs = Counter(words)\nprint(freqs.most_common(2))  # [(\'the\', 3), (\'cat\', 2)]\n\n# Group items by key\ngraph = defaultdict(list)\nedges = [(1, 2), (1, 3), (2, 4)]\nfor src, dst in edges:\n    graph[src].append(dst)\nprint(dict(graph))  # {1: [2, 3], 2: [4]}',
            note: '`Counter` tallies hashable items. `defaultdict` auto-initializes missing keys with a factory function — avoids `setdefault` boilerplate.',
            explanation: {
              heading: 'Counting and grouping',
              intro: 'Counter and defaultdict are dict subclasses that remove common boilerplate. Counter tallies occurrences of items, while defaultdict supplies a default value for any missing key on first access.',
              points: [
                { term: 'Counter tallies', detail: 'Feeding an iterable to Counter counts each element, and most_common returns the highest-frequency items, which is ideal for word or event frequencies.' },
                { term: 'defaultdict auto-initializes', detail: 'Accessing a missing key calls the factory to create a default, so appending to defaultdict(list) needs no explicit check or setdefault.' },
                { term: 'Choose the factory', detail: 'The factory determines the default: list for grouping, int for counting, set for collecting unique members per key.' },
                { term: 'Access can create keys', detail: 'With defaultdict, merely reading a missing key inserts it, so guard against unintentionally growing the dict during lookups.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-namedtuple-deque',
        title: 'namedtuple and deque',
        level: 2,
        slug: 'namedtuple-deque',
        concepts: [
          {
            id: 'py-nt-deque',
            code: 'from collections import namedtuple, deque\n\nPoint = namedtuple("Point", ["x", "y"])\np = Point(3, 4)\nprint(p.x, p._asdict())  # 3, {\'x\': 3, \'y\': 4}\n\n# deque: O(1) append/pop from both ends\nhistory = deque(maxlen=5)\nfor i in range(10):\n    history.append(i)\nprint(list(history))  # [5, 6, 7, 8, 9]',
            note: '`namedtuple` creates lightweight immutable records. `deque` is a double-ended queue — ideal for sliding windows, BFS, and bounded histories.',
            explanation: {
              heading: 'Records and double-ended queues',
              intro: 'namedtuple and deque address two different needs. namedtuple gives tuples readable field names for lightweight records, while deque offers fast additions and removals at both ends of a sequence.',
              points: [
                { term: 'Named fields on tuples', detail: 'A namedtuple keeps the immutability and small footprint of a tuple but lets you access elements by name, improving clarity over positional indexing.' },
                { term: 'Efficient at both ends', detail: 'A deque supports O(1) append and pop from either end, unlike a list where inserting or removing at the front is O(n).' },
                { term: 'Bounded histories', detail: 'Setting maxlen makes a deque drop items from the opposite end as new ones arrive, perfect for rolling windows and recent-history buffers.' },
                { term: 'Fits queues and BFS', detail: 'Its fast front removal makes deque the natural queue for breadth-first search and producer-consumer patterns.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  // 30. Slots and Memory
  {
    id: 'py-slots',
    title: 'Slots and Memory Optimization',
    level: 1,
    slug: 'slots',
    concepts: [],
    children: [
      {
        id: 'py-slots-usage',
        title: '__slots__',
        level: 2,
        slug: 'slots-usage',
        concepts: [
          {
            id: 'py-slots-impl',
            code: 'import sys\n\nclass WithDict:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\nclass WithSlots:\n    __slots__ = ("x", "y")\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\na = WithDict(1, 2)\nb = WithSlots(1, 2)\nprint(sys.getsizeof(a.__dict__))  # ~104 bytes\n# b has no __dict__ — uses ~48 bytes total',
            note: '`__slots__` replaces the instance `__dict__` with fixed-size storage. Saves memory for millions of instances but prevents dynamic attribute assignment.',
            explanation: {
              heading: 'Trimming memory with slots',
              intro: 'By default each instance carries a per-instance dict to hold its attributes, which is flexible but costly at scale. Declaring __slots__ replaces that dict with compact fixed storage for a known set of attributes.',
              points: [
                { term: 'Fixed attribute set', detail: 'Listing attribute names in __slots__ reserves space for exactly those, dropping the per-instance dict and reducing memory per object.' },
                { term: 'Big savings at scale', detail: 'The reduction is negligible for a few objects but significant when you create millions of instances, such as nodes or records.' },
                { term: 'No dynamic attributes', detail: 'Because there is no dict, you cannot add attributes not listed in __slots__, which is a real constraint to weigh against the savings.' },
                { term: 'Inheritance caveats', detail: 'Slots interact with inheritance and other features carefully; a subclass without its own __slots__ regains a dict, undoing the benefit.' },
              ],
            },
            example: '# Cannot add new attributes:\n# b.z = 3  # raises AttributeError',
          },
        ],
        children: [],
      },
    ],
  },
  // 31. Walrus Operator and Newer Syntax
  {
    id: 'py-modern-syntax',
    title: 'Modern Python Syntax',
    level: 1,
    slug: 'modern-syntax',
    concepts: [],
    children: [
      {
        id: 'py-walrus',
        title: 'Walrus Operator (:=)',
        level: 2,
        slug: 'walrus-operator',
        concepts: [
          {
            id: 'py-walrus-usage',
            code: '# Assignment expression — assign and use in one step\nimport re\n\ntext = "Price: $42.99"\nif m := re.search(r"\\$(\\d+\\.\\d+)", text):\n    print(f"Found price: {m.group(1)}")\n\n# Filter and transform in one pass\nresults = [y for x in data if (y := expensive(x)) > threshold]',
            note: 'The walrus operator `:=` (3.8+) assigns a value as part of an expression. Useful in `while` loops, `if` checks, and comprehension filters to avoid redundant computation.',
            explanation: {
              heading: 'Assignment expressions',
              intro: 'The walrus operator (3.8+) assigns a value to a name and yields that value at the same time. It lets you capture a result inside an expression, avoiding a separate assignment line or a repeated computation.',
              points: [
                { term: 'Assign and use at once', detail: 'Writing if (m := pattern.search(text)) both stores the match and tests it, so you use the same result without computing it twice.' },
                { term: 'Cleaner loops', detail: 'In a while loop it captures and tests input in one step, replacing the older read-then-check-then-read-again structure.' },
                { term: 'Comprehension reuse', detail: 'Inside a comprehension it lets the filter and the output share one computed value, avoiding an expensive call in both places.' },
                { term: 'Use it sparingly', detail: 'Overusing walrus in dense expressions hurts readability. Reach for it only when it genuinely removes duplication or an awkward extra line.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'py-type-statements',
        title: 'type Statement (3.12+)',
        level: 2,
        slug: 'type-statement',
        concepts: [
          {
            id: 'py-type-alias',
            code: '# Python 3.12+ type alias syntax\ntype Vector = list[float]\ntype Matrix = list[Vector]\n\n# Generic type alias\ntype Pair[T] = tuple[T, T]\n\ndef distance(a: Vector, b: Vector) -> float:\n    return sum((x - y) ** 2 for x, y in zip(a, b)) ** 0.5',
            note: 'The `type` statement (3.12+) creates explicit type aliases with cleaner syntax than `TypeAlias`. Supports generic parameters directly.',
            explanation: {
              heading: 'Explicit type aliases',
              intro: 'The type statement (3.12+) declares a named alias for a type in a clear, dedicated syntax. It makes complex annotations reusable and readable without the older assignment-based conventions.',
              points: [
                { term: 'Named aliases', detail: 'Writing type Vector = list[float] gives a meaningful name to a repeated annotation, so signatures read in domain terms rather than raw generics.' },
                { term: 'Cleaner than the old way', detail: 'It replaces the need to annotate an assignment with TypeAlias, making the intent obvious and unambiguous to both readers and checkers.' },
                { term: 'Built-in generics', detail: 'The statement accepts type parameters directly, so an alias like Pair can be parameterized without extra TypeVar boilerplate.' },
                { term: 'Aliases are transparent', detail: 'An alias is not a distinct type; it is a synonym, so it improves readability but does not create a new type for runtime checks.' },
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
