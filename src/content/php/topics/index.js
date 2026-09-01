// PHP topic tree.
//
// Each node is a ConceptNode: { id, title, level, slug?, concepts[], children[] }.
// Routable nodes carry a `slug`. Every Concept renders in the fixed order
// code -> note -> example (example optional). Content targets modern PHP 8.x.

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  // 1. Language Basics
  {
    id: 'php-basics',
    title: 'Language Basics',
    level: 1,
    slug: 'basics',
    concepts: [],
    children: [
      {
        id: 'php-syntax',
        title: 'Syntax & Tags',
        level: 2,
        slug: 'syntax',
        concepts: [
          {
            id: 'php-syntax-tags',
            code: "<?php\necho 'Hello, world!';\n\n// A single-line comment\n# Also a single-line comment\n/* A block comment */\n\n$total = 5 + 3;\necho \"Total is $total\";",
            note: 'PHP code lives between `<?php` and `?>` tags; everything outside them is emitted as raw output. Every statement ends with a semicolon. In files that are pure PHP, the closing `?>` tag is intentionally omitted to avoid accidentally sending whitespace.',
            explanation: {
              heading: 'PHP tags and statements',
              intro: 'PHP code lives inside opening and closing tags, and anything outside those tags is sent straight to the output as raw text.',
              points: [
                { term: 'Opening tag', detail: 'Code runs only between the PHP open tag and its closing tag.' },
                { term: 'Statements end with semicolons', detail: 'Each instruction must be terminated by a semicolon.' },
                { term: 'Omit the closing tag', detail: 'Pure PHP files leave off the closing tag to avoid emitting stray whitespace.' },
                { term: 'Multiple comment styles', detail: 'Double-slash, hash, and slash-star forms all mark comments.' },
              ],
            },
            example: "<?php\n// A file mixing HTML and PHP\n?>\n<h1><?= 'Welcome' ?></h1>\n<?php // <?= is shorthand for echo ?>",
          },
          {
            id: 'php-syntax-output',
            code: "echo 'one', 'two';        // echo can take multiple args\nprint 'returns 1';        // print is an expression\nprintf('%d items', 3);    // formatted output\n$s = sprintf('%.2f', 3.14159); // 3.14",
            note: '`echo` is the fastest way to output text and accepts several comma-separated values. `print` behaves similarly but returns 1, so it can be used in expressions. Use `printf`/`sprintf` when you need C-style formatting.',
            explanation: {
              heading: 'Producing output',
              intro: 'PHP offers several ways to send text to the output stream, differing in return value and formatting capability.',
              points: [
                { term: 'echo is fastest', detail: 'echo prints one or more comma-separated values and returns nothing.' },
                { term: 'print is an expression', detail: 'print outputs a single value and returns one, so it can appear in expressions.' },
                { term: 'printf formats', detail: 'printf writes text using C-style placeholders such as percent-d for integers.' },
                { term: 'sprintf builds strings', detail: 'sprintf returns the formatted text instead of printing it.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'php-constants',
        title: 'Constants',
        level: 2,
        slug: 'constants',
        concepts: [
          {
            id: 'php-constants-define',
            code: "const MAX_USERS = 100;\ndefine('APP_ENV', 'production');\n\necho MAX_USERS;\necho APP_ENV;\necho PHP_VERSION; // built-in constant",
            note: 'Use the `const` keyword for compile-time constants and `define()` when the name or value is computed at runtime. Constants are global, immutable, and conventionally written in UPPER_SNAKE_CASE. PHP ships with many predefined constants such as `PHP_VERSION` and `PHP_EOL`.',
            explanation: {
              heading: 'Defining constants',
              intro: 'Constants hold values that never change after definition and are visible everywhere in the program without a dollar sign.',
              points: [
                { term: 'const at compile time', detail: 'The const keyword defines a constant whose name and value are known when the file is parsed.' },
                { term: 'define at runtime', detail: 'The define function sets a constant when the name or value is computed while running.' },
                { term: 'Uppercase convention', detail: 'Constant names are conventionally written in upper snake case.' },
                { term: 'Built-in constants', detail: 'PHP predefines many constants such as the version and end-of-line markers.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 2. Variables & Types
  {
    id: 'php-variables-types',
    title: 'Variables & Types',
    level: 1,
    slug: 'variables-types',
    concepts: [],
    children: [
      {
        id: 'php-variables',
        title: 'Variables & Scope',
        level: 2,
        slug: 'variables',
        concepts: [
          {
            id: 'php-variables-intro',
            code: "$name = 'PHP';\n$version = 8.3;\n$active = true;\n\n$copy = $name;      // scalars are copied by value\n$ref = &$name;      // & creates a reference (alias)",
            note: 'Variables always start with `$` and are dynamically typed, so the same variable can hold different types over time. Assigning a scalar copies its value, while the `&` operator creates a reference that aliases the same underlying storage.',
            explanation: {
              heading: 'Variables and references',
              intro: 'PHP variables begin with a dollar sign and are dynamically typed, and scalars are copied on assignment unless you create a reference.',
              points: [
                { term: 'Dollar sign prefix', detail: 'Every variable name starts with a dollar sign.' },
                { term: 'Dynamically typed', detail: 'A variable can hold different types over its lifetime.' },
                { term: 'Copy by value', detail: 'Assigning a scalar duplicates its value into the new variable.' },
                { term: 'Reference with ampersand', detail: 'The ampersand operator makes two names alias the same storage.' },
              ],
            },
          },
          {
            id: 'php-variables-scope',
            code: "$counter = 0;\n\nfunction increment() {\n  global $counter;   // pull in the global\n  $counter++;\n}\n\nfunction tick() {\n  static $calls = 0; // persists between calls\n  return ++$calls;\n}",
            note: 'Function bodies have their own local scope and cannot see outer variables unless you use the `global` keyword or the `$GLOBALS` array. A `static` local variable keeps its value across calls, which is handy for counters and memoization.',
            explanation: {
              heading: 'Function scope',
              intro: 'Functions have their own local scope and cannot see outer variables unless explicitly told to, and static locals persist between calls.',
              points: [
                { term: 'Local by default', detail: 'Variables inside a function are separate from those outside it.' },
                { term: 'global keyword', detail: 'The global keyword pulls an outer variable into the function scope.' },
                { term: 'static persists', detail: 'A static local variable keeps its value across successive calls.' },
                { term: 'GLOBALS array', detail: 'The GLOBALS superglobal is an alternative way to reach global variables.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'php-types',
        title: 'Scalar & Type System',
        level: 2,
        slug: 'types',
        concepts: [
          {
            id: 'php-types-scalars',
            code: "$i = 42;            // int\n$f = 3.14;          // float\n$s = 'text';        // string\n$b = false;         // bool\n$n = null;          // null\n\nvar_dump(gettype($i));  // \"integer\"\nsettype($i, 'string');  // coerce type",
            note: 'PHP has four scalar types (int, float, string, bool) plus null, arrays, objects, callables, and resources. Use `gettype()` or the `is_*` functions to inspect a value, and `var_dump()` to see its type and contents during debugging.',
            explanation: {
              heading: 'The type system',
              intro: 'PHP has four scalar types plus null, arrays, objects, callables, and resources, and provides functions to inspect any value.',
              points: [
                { term: 'Four scalars', detail: 'The scalar types are integer, float, string, and boolean.' },
                { term: 'gettype and is functions', detail: 'gettype names a value\'s type while the is-family functions test for a specific one.' },
                { term: 'var_dump for debugging', detail: 'var_dump prints a value with its type and structure.' },
                { term: 'settype coerces', detail: 'The settype function converts a variable to another type in place.' },
              ],
            },
          },
          {
            id: 'php-types-declarations',
            code: "declare(strict_types=1);\n\nfunction area(float $w, float $h): float {\n  return $w * $h;\n}\n\nfunction find(int $id): ?User {  // nullable return\n  return $id > 0 ? new User() : null;\n}",
            note: 'You can declare parameter and return types, including nullable types with a leading `?` and union types like `int|string`. Adding `declare(strict_types=1)` at the top of a file disables silent coercion so a `float` parameter rejects a string, catching bugs early.',
            explanation: {
              heading: 'Type declarations',
              intro: 'You can declare parameter and return types, including nullable and union types, and strict mode disables silent coercion for safer code.',
              points: [
                { term: 'Parameter and return types', detail: 'Type hints document and enforce what a function accepts and returns.' },
                { term: 'Nullable types', detail: 'A leading question mark allows null in addition to the declared type.' },
                { term: 'Union types', detail: 'A pipe separates several allowed types, such as int or string.' },
                { term: 'strict_types', detail: 'Declaring strict types makes PHP reject implicit type conversions.' },
              ],
            },
            example: "function label(int|string $id): string {\n  return \"ID: $id\"; // accepts either int or string\n}",
          },
        ],
        children: [],
      },
    ],
  },

  // 3. Operators
  {
    id: 'php-operators',
    title: 'Operators',
    level: 1,
    slug: 'operators',
    concepts: [],
    children: [
      {
        id: 'php-operators-arithmetic',
        title: 'Arithmetic & Comparison',
        level: 2,
        slug: 'arithmetic-comparison',
        concepts: [
          {
            id: 'php-operators-arith',
            code: "echo 10 + 3;   // 13\necho 10 % 3;   // 1  (modulo)\necho 2 ** 8;   // 256 (exponent)\necho intdiv(10, 3); // 3 (integer division)\n\nvar_dump(1 == '1');  // true  (loose)\nvar_dump(1 === '1'); // false (strict, type matters)",
            note: 'PHP supports the usual arithmetic operators plus `**` for exponentiation and `intdiv()` for integer division. Prefer `===` and `!==` over `==` and `!=` because the strict operators compare both value and type, avoiding surprising coercions.',
            explanation: {
              heading: 'Arithmetic and comparison',
              intro: 'PHP supports the usual math operators plus exponentiation, and it offers both loose and strict comparison operators.',
              points: [
                { term: 'Exponent operator', detail: 'The double-star operator raises a number to a power.' },
                { term: 'intdiv for integers', detail: 'The intdiv function performs integer division without a remainder.' },
                { term: 'Loose equality coerces', detail: 'The double-equals operator converts types before comparing, which can surprise.' },
                { term: 'Prefer strict equality', detail: 'The triple-equals operator compares value and type, avoiding coercion bugs.' },
              ],
            },
          },
          {
            id: 'php-operators-spaceship',
            code: "echo 1 <=> 2;  // -1  (left is less)\necho 2 <=> 2;  //  0  (equal)\necho 3 <=> 2;  //  1  (left is greater)\n\n$nums = [3, 1, 2];\nusort($nums, fn($a, $b) => $a <=> $b); // sorts ascending",
            note: 'The spaceship operator `<=>` returns -1, 0, or 1 depending on whether the left operand is less than, equal to, or greater than the right. It is the idiomatic way to write comparison callbacks for `usort()` and similar sorting functions.',
            explanation: {
              heading: 'Spaceship operator',
              intro: 'The three-way comparison operator returns negative one, zero, or one, which is the idiomatic way to write sorting callbacks.',
              points: [
                { term: 'Three-way result', detail: 'It yields minus one, zero, or one for less, equal, or greater.' },
                { term: 'Sorting callbacks', detail: 'It is the natural body for a usort comparison function.' },
                { term: 'Works on many types', detail: 'It compares numbers, strings, and arrays consistently.' },
                { term: 'Concise ordering', detail: 'It replaces verbose if-else chains in comparison logic.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'php-operators-null',
        title: 'Null-Handling Operators',
        level: 2,
        slug: 'null-operators',
        concepts: [
          {
            id: 'php-operators-coalesce',
            code: "$name = $_GET['name'] ?? 'guest';   // null coalescing\n$config['timeout'] ??= 30;          // assign if null/unset\n\n$city = $user?->address?->city;     // nullsafe chain",
            note: 'The `??` operator returns its right side when the left is null or undefined, without raising a notice. `??=` assigns only when the target is null, and the nullsafe operator `?->` short-circuits a method or property chain to null instead of erroring on a null object.',
            explanation: {
              heading: 'Null-handling operators',
              intro: 'PHP provides operators that gracefully handle null or undefined values without raising notices, simplifying default handling and safe chaining.',
              points: [
                { term: 'Null coalescing', detail: 'The double-question operator returns its right side when the left is null or unset.' },
                { term: 'Coalescing assignment', detail: 'The double-question-equals operator assigns only when the target is null.' },
                { term: 'Nullsafe operator', detail: 'The question-arrow operator short-circuits a chain to null on a null object.' },
                { term: 'No notices', detail: 'These operators avoid the warnings that plain access to undefined keys would raise.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 4. Strings
  {
    id: 'php-strings',
    title: 'Strings',
    level: 1,
    slug: 'strings',
    concepts: [],
    children: [
      {
        id: 'php-strings-basics',
        title: 'Quoting & Interpolation',
        level: 2,
        slug: 'quoting',
        concepts: [
          {
            id: 'php-strings-quotes',
            code: "$name = 'Ada';\necho \"Hello, $name\";        // interpolated -> Hello, Ada\necho 'Hello, $name';        // literal    -> Hello, $name\necho \"Total: {$order['sum']}\"; // braces for complex expressions",
            note: 'Double-quoted strings interpolate variables and interpret escape sequences like `\\n`, while single-quoted strings treat almost everything literally and are marginally faster. Wrap complex expressions such as array elements or properties in `{}` so PHP parses them correctly.',
            explanation: {
              heading: 'Quoting and interpolation',
              intro: 'PHP\'s two quote styles differ in whether they interpret variables and escape sequences, and braces help embed complex expressions.',
              points: [
                { term: 'Double quotes interpolate', detail: 'Variables inside double quotes are replaced with their values.' },
                { term: 'Single quotes are literal', detail: 'Single-quoted text is taken almost verbatim and is marginally faster.' },
                { term: 'Braces for complex parts', detail: 'Wrapping an array element or property in braces ensures correct parsing.' },
                { term: 'Escape sequences', detail: 'Only double-quoted strings interpret escapes such as the newline sequence.' },
              ],
            },
          },
          {
            id: 'php-strings-heredoc',
            code: "$body = <<<HTML\n<p>Dear $name,</p>\n<p>Welcome aboard.</p>\nHTML;\n\n$raw = <<<'TXT'\nNo $interpolation here.\nTXT;",
            note: 'Heredoc syntax (`<<<LABEL`) behaves like a double-quoted string across multiple lines and supports interpolation, which is ideal for building blocks of HTML or email. Nowdoc (`<<<\'LABEL\'`) uses single quotes around the label and behaves like a single-quoted string with no interpolation.',
            explanation: {
              heading: 'Heredoc and nowdoc',
              intro: 'These multi-line string syntaxes make it easy to build large blocks of text, mirroring the behavior of double and single quotes.',
              points: [
                { term: 'Heredoc interpolates', detail: 'A heredoc behaves like a double-quoted string across many lines.' },
                { term: 'Nowdoc is literal', detail: 'A nowdoc, with quotes around the label, behaves like a single-quoted string.' },
                { term: 'Great for HTML', detail: 'They are ideal for embedding templates and email bodies.' },
                { term: 'Closing label', detail: 'The block ends at a line beginning with the chosen label identifier.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'php-strings-functions',
        title: 'String Functions',
        level: 2,
        slug: 'string-functions',
        concepts: [
          {
            id: 'php-strings-common',
            code: "$s = ' Hello World ';\necho strlen($s);            // 13\necho trim($s);              // 'Hello World'\necho strtolower($s);        // ' hello world '\necho str_replace('World', 'PHP', $s);\necho substr('abcdef', 1, 3); // 'bcd'\nvar_dump(str_contains($s, 'World')); // true",
            note: 'PHP has a rich set of built-in string functions such as `strlen`, `trim`, `str_replace`, and `substr`. PHP 8 added intuitive helpers like `str_contains`, `str_starts_with`, and `str_ends_with` that return booleans and read clearly.',
            explanation: {
              heading: 'Common string functions',
              intro: 'PHP ships a large library of string functions, and PHP 8 added intuitive boolean helpers for common membership checks.',
              points: [
                { term: 'Length and trimming', detail: 'strlen measures bytes and trim removes surrounding whitespace.' },
                { term: 'Search and replace', detail: 'str_replace substitutes text and substr extracts a portion.' },
                { term: 'Boolean helpers', detail: 'str_contains, str_starts_with, and str_ends_with return clear true or false.' },
                { term: 'Case functions', detail: 'strtolower and strtoupper change the case of a string.' },
              ],
            },
          },
          {
            id: 'php-strings-multibyte',
            code: "$s = 'café';\necho strlen($s);      // 5 (bytes)\necho mb_strlen($s);   // 4 (characters)\necho mb_strtoupper($s); // CAFÉ",
            note: 'Regular string functions operate on bytes, which breaks for multi-byte UTF-8 text. Use the `mb_*` functions from the mbstring extension (`mb_strlen`, `mb_substr`, `mb_strtoupper`) whenever you handle Unicode content.',
            explanation: {
              heading: 'Multibyte strings',
              intro: 'Standard string functions count bytes, which breaks on multi-byte UTF-8 text, so the mbstring functions operate on characters instead.',
              points: [
                { term: 'Bytes vs characters', detail: 'A UTF-8 character can span several bytes, so byte-based counts mislead.' },
                { term: 'mb functions', detail: 'The mb-prefixed functions handle Unicode correctly by working per character.' },
                { term: 'Encoding awareness', detail: 'Many mb functions accept an encoding argument for precise handling.' },
                { term: 'Use for user text', detail: 'Prefer mb functions whenever the data may contain non-ASCII characters.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 5. Arrays
  {
    id: 'php-arrays',
    title: 'Arrays',
    level: 1,
    slug: 'arrays',
    concepts: [],
    children: [
      {
        id: 'php-arrays-basics',
        title: 'Indexed & Associative Arrays',
        level: 2,
        slug: 'array-basics',
        concepts: [
          {
            id: 'php-arrays-intro',
            code: "$fruits = ['apple', 'banana', 'cherry'];\n$fruits[] = 'date';          // append\n\n$user = [\n  'name' => 'Ada',\n  'role' => 'admin',\n];\necho $user['name'];          // Ada\n\n['name' => $n, 'role' => $r] = $user; // destructuring",
            note: 'A PHP array is an ordered map that works as both a list and a dictionary. Numeric keys create indexed arrays while string keys create associative arrays, and the two can be mixed. You can destructure arrays into variables with `[...]` on the left of an assignment.',
            explanation: {
              heading: 'Arrays as ordered maps',
              intro: 'A PHP array is a single flexible structure that works as both a list and a dictionary, and it can be destructured on assignment.',
              points: [
                { term: 'One structure', detail: 'The same array type serves for indexed lists and keyed maps.' },
                { term: 'Numeric and string keys', detail: 'Numeric keys make a list while string keys make an associative array.' },
                { term: 'Append shorthand', detail: 'Assigning to empty brackets adds an element to the end.' },
                { term: 'Destructuring', detail: 'Brackets on the left of an assignment unpack an array into variables.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'php-arrays-functions',
        title: 'Array Functions',
        level: 2,
        slug: 'array-functions',
        concepts: [
          {
            id: 'php-arrays-hof',
            code: "$nums = [1, 2, 3, 4];\n$doubled = array_map(fn($n) => $n * 2, $nums);   // [2,4,6,8]\n$evens   = array_filter($nums, fn($n) => $n % 2 === 0); // [2,4]\n$sum     = array_reduce($nums, fn($c, $n) => $c + $n, 0); // 10\n\nin_array(3, $nums);      // true\narray_keys(['a' => 1]);  // ['a']",
            note: '`array_map`, `array_filter`, and `array_reduce` cover most transform, select, and aggregate needs functionally. Note that `array_filter` preserves the original keys, so apply `array_values()` afterward when you need a clean, re-indexed list.',
            explanation: {
              heading: 'Higher-order array functions',
              intro: 'The map, filter, and reduce functions cover most functional array processing, though some preserve keys in ways worth noting.',
              points: [
                { term: 'array_map transforms', detail: 'It applies a callback to each element and returns the results.' },
                { term: 'array_filter keeps keys', detail: 'It selects matching elements but preserves their original keys.' },
                { term: 'Re-index with array_values', detail: 'Call array_values after filtering to get a clean zero-based list.' },
                { term: 'array_reduce aggregates', detail: 'It folds all elements down into one accumulated value.' },
              ],
            },
            example: "$merged = [...$a, ...$b];       // spread operator\n$flat = array_merge($a, $b);    // merge with re-indexing",
          },
          {
            id: 'php-arrays-sorting',
            code: "$nums = [3, 1, 2];\nsort($nums);              // [1, 2, 3]\nrsort($nums);             // [3, 2, 1]\n\n$scores = ['bob' => 2, 'ada' => 9];\narsort($scores);          // sort by value, keep keys\nksort($scores);           // sort by key\nusort($nums, fn($a, $b) => $a <=> $b); // custom",
            note: 'PHP provides a family of sort functions: `sort`/`rsort` reindex a list, while `asort`/`ksort` sort associative arrays by value or key while preserving keys. Use `usort` with a comparison callback (typically using `<=>`) when you need custom ordering.',
            explanation: {
              heading: 'Sorting arrays',
              intro: 'PHP offers a family of sort functions that differ in direction and in whether they preserve keys, plus a callback-based custom sort.',
              points: [
                { term: 'sort re-indexes', detail: 'The sort and rsort functions reorder a list and reset numeric keys.' },
                { term: 'asort keeps keys', detail: 'The asort and ksort functions sort associative arrays by value or key while keeping keys.' },
                { term: 'usort is custom', detail: 'usort orders elements using a comparison callback you supply.' },
                { term: 'In-place mutation', detail: 'These functions sort the array by reference rather than returning a copy.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 6. Control Flow
  {
    id: 'php-control-flow',
    title: 'Control Flow',
    level: 1,
    slug: 'control-flow',
    concepts: [],
    children: [
      {
        id: 'php-conditionals',
        title: 'Conditionals',
        level: 2,
        slug: 'conditionals',
        concepts: [
          {
            id: 'php-conditionals-if',
            code: "if ($score >= 90) {\n  $grade = 'A';\n} elseif ($score >= 80) {\n  $grade = 'B';\n} else {\n  $grade = 'C';\n}\n\n$label = $active ? 'on' : 'off'; // ternary\n$name  = $input ?: 'anonymous';  // short ternary (Elvis)",
            note: 'PHP uses `if`/`elseif`/`else` with the same C-style syntax as many languages. The ternary `?:` is a compact conditional, and its shorthand form `$a ?: $b` returns `$a` when it is truthy, otherwise `$b`.',
            explanation: {
              heading: 'Conditionals',
              intro: 'PHP uses C-style if, elseif, and else statements, along with compact ternary forms for simple either-or choices.',
              points: [
                { term: 'elseif chains', detail: 'Multiple elseif branches test several conditions in order.' },
                { term: 'Ternary operator', detail: 'The question-colon form selects between two values inline.' },
                { term: 'Elvis shorthand', detail: 'The short ternary returns the left value when it is truthy, otherwise the right.' },
                { term: 'Truthiness', detail: 'Empty strings, zero, and empty arrays evaluate as false in conditions.' },
              ],
            },
          },
          {
            id: 'php-conditionals-match',
            code: "$status = match ($code) {\n  200, 201 => 'Success',\n  404      => 'Not Found',\n  500      => 'Server Error',\n  default  => 'Unknown',\n};",
            note: 'The `match` expression (PHP 8.0+) returns a value, uses strict `===` comparison, and requires no `break` statements. Multiple conditions can share an arm with commas, and an unmatched value with no `default` throws an `UnhandledMatchError` rather than failing silently.',
            explanation: {
              heading: 'The match expression',
              intro: 'The match expression returns a value using strict comparison and requires no break statements, making it safer than a switch.',
              points: [
                { term: 'Returns a value', detail: 'match evaluates to the result of the matching arm.' },
                { term: 'Strict comparison', detail: 'It compares with triple-equals, avoiding loose type coercion.' },
                { term: 'No fallthrough', detail: 'Arms do not fall through, so no break statements are needed.' },
                { term: 'Throws on no match', detail: 'An unmatched value without a default raises an unhandled match error.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'php-loops',
        title: 'Loops',
        level: 2,
        slug: 'loops',
        concepts: [
          {
            id: 'php-loops-foreach',
            code: "foreach (['a', 'b', 'c'] as $i => $letter) {\n  echo \"$i: $letter\\n\";\n}\n\nforeach ($users as $user) {\n  if ($user->banned) continue; // skip\n  if ($user->id === 0) break;  // stop\n}",
            note: '`foreach` is the idiomatic way to iterate arrays and iterables, optionally capturing the key with `$key => $value`. Traditional `for`, `while`, and `do...while` loops are also available, and `continue`/`break` control iteration flow.',
            explanation: {
              heading: 'Loops',
              intro: 'The foreach loop is the idiomatic way to iterate arrays and iterables, while for and while cover counter and condition-based repetition.',
              points: [
                { term: 'foreach for collections', detail: 'It walks each element and can capture the key as well as the value.' },
                { term: 'continue and break', detail: 'continue skips to the next iteration and break exits the loop.' },
                { term: 'for with counter', detail: 'The for loop is best when you manage an explicit index.' },
                { term: 'while and do-while', detail: 'These repeat based on a condition, with do-while running at least once.' },
              ],
            },
            example: "for ($i = 0; $i < 3; $i++) {\n  echo $i;\n}\n\n$n = 0;\nwhile ($n < 3) { $n++; }",
          },
        ],
        children: [],
      },
    ],
  },

  // 7. Functions
  {
    id: 'php-functions',
    title: 'Functions',
    level: 1,
    slug: 'functions',
    concepts: [],
    children: [
      {
        id: 'php-functions-basics',
        title: 'Declaring Functions',
        level: 2,
        slug: 'function-basics',
        concepts: [
          {
            id: 'php-functions-declare',
            code: "function greet(string $name, string $greeting = 'Hello'): string {\n  return \"$greeting, $name\";\n}\n\necho greet('Ada');              // Hello, Ada\necho greet('Ada', 'Hi');        // Hi, Ada\n\nfunction sum(int ...$nums): int {\n  return array_sum($nums);       // variadic\n}",
            note: 'Functions declare typed parameters and return types, and parameters can have default values that make them optional. A trailing variadic parameter written with `...` collects any number of extra arguments into an array.',
            explanation: {
              heading: 'Declaring functions',
              intro: 'PHP functions can declare typed parameters with defaults and a return type, and a trailing variadic parameter accepts any number of arguments.',
              points: [
                { term: 'Typed parameters', detail: 'Each parameter may specify a type that the caller must satisfy.' },
                { term: 'Default values', detail: 'A default makes a parameter optional when the caller omits it.' },
                { term: 'Return type', detail: 'A return type after the parameter list documents and enforces the output.' },
                { term: 'Variadic parameter', detail: 'A parameter prefixed with three dots collects extra arguments into an array.' },
              ],
            },
          },
          {
            id: 'php-functions-named-args',
            code: "function makeCoffee(string $size, bool $decaf = false, int $sugar = 0) {\n  // ...\n}\n\nmakeCoffee(size: 'large', sugar: 2); // skip decaf, set sugar",
            note: 'Named arguments (PHP 8.0+) let you pass arguments by parameter name in any order, so you can skip optional parameters you do not care about. They also make call sites self-documenting, which is especially valuable for functions with several boolean flags.',
            explanation: {
              heading: 'Named arguments',
              intro: 'Named arguments let you pass values by parameter name in any order, so you can skip optional parameters and document call sites clearly.',
              points: [
                { term: 'Pass by name', detail: 'Arguments are matched to parameters by name rather than position.' },
                { term: 'Skip optionals', detail: 'You can supply only the optional parameters you care about.' },
                { term: 'Self-documenting', detail: 'Named boolean flags at the call site explain what each value means.' },
                { term: 'Order independent', detail: 'Named arguments may appear in any order after positional ones.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'php-functions-refs',
        title: 'Pass by Reference',
        level: 2,
        slug: 'pass-by-reference',
        concepts: [
          {
            id: 'php-functions-byref',
            code: "function addOne(int &$n): void {\n  $n++;\n}\n\n$value = 5;\naddOne($value);\necho $value; // 6\n\nsort($myArray); // core functions like sort take by reference",
            note: 'By default arguments are passed by value, so changes inside the function do not affect the caller. Prefixing a parameter with `&` passes it by reference, allowing the function to modify the original variable, which is how functions like `sort()` mutate arrays in place.',
            explanation: {
              heading: 'Pass by reference',
              intro: 'Arguments pass by value by default, but prefixing a parameter with an ampersand lets a function modify the caller\'s original variable.',
              points: [
                { term: 'Value by default', detail: 'Changes to a normal parameter do not affect the caller.' },
                { term: 'Ampersand for reference', detail: 'An ampersand before a parameter makes it alias the caller\'s variable.' },
                { term: 'Enables mutation', detail: 'Reference parameters allow a function to update data in place.' },
                { term: 'Core sort functions', detail: 'Built-ins like sort take arrays by reference and reorder them directly.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 8. Object-Oriented Programming
  {
    id: 'php-oop',
    title: 'Object-Oriented Programming',
    level: 1,
    slug: 'oop',
    concepts: [],
    children: [
      {
        id: 'php-oop-classes',
        title: 'Classes & Objects',
        level: 2,
        slug: 'classes',
        concepts: [
          {
            id: 'php-oop-class',
            code: "class User {\n  public function __construct(\n    private string $name,\n    private string $email,\n  ) {}\n\n  public function getName(): string {\n    return $this->name;\n  }\n}\n\n$u = new User('Ada', 'ada@example.com');\necho $u->getName();",
            note: 'Constructor property promotion (PHP 8.0+) lets you declare and assign properties directly in the constructor signature, cutting boilerplate. Visibility keywords `public`, `protected`, and `private` control access, and `$this` refers to the current instance.',
            explanation: {
              heading: 'Classes and objects',
              intro: 'PHP classes bundle state and behavior, and constructor property promotion lets you declare and assign properties in one place.',
              points: [
                { term: 'Property promotion', detail: 'Declaring properties in the constructor signature removes assignment boilerplate.' },
                { term: 'Visibility keywords', detail: 'Public, protected, and private control who can access each member.' },
                { term: 'this refers to the instance', detail: 'Inside methods, this points at the current object.' },
                { term: 'new creates objects', detail: 'The new keyword instantiates a class and runs its constructor.' },
              ],
            },
          },
          {
            id: 'php-oop-inheritance',
            code: "class Animal {\n  public function __construct(protected string $name) {}\n  public function speak(): string { return '...'; }\n}\n\nclass Dog extends Animal {\n  public function speak(): string {\n    return \"$this->name says woof\";\n  }\n}\n\necho (new Dog('Rex'))->speak();",
            note: 'A class `extends` a parent to inherit its properties and methods, and a child can override methods to specialize behavior. Use `parent::method()` to call the overridden implementation, and mark a method or class `final` to prevent further overriding or extension.',
            explanation: {
              heading: 'Inheritance',
              intro: 'A class extends a parent to inherit its members, and a child can override methods while still reaching the original with parent.',
              points: [
                { term: 'extends a parent', detail: 'The extends keyword makes a class inherit properties and methods.' },
                { term: 'Method overriding', detail: 'A child redefines a method to specialize the parent behavior.' },
                { term: 'parent call', detail: 'The parent scope resolution reaches the overridden implementation.' },
                { term: 'final locks it', detail: 'Marking a class or method final prevents further extension or overriding.' },
              ],
            },
          },
          {
            id: 'php-oop-static',
            code: "class Counter {\n  private static int $count = 0;\n  const VERSION = '1.0';\n\n  public static function tick(): int {\n    return ++self::$count;\n  }\n}\n\nCounter::tick();          // 1\necho Counter::VERSION;    // 1.0",
            note: 'Static properties and methods belong to the class rather than any instance and are accessed with `::`. Refer to static members from inside the class with `self::` (or `static::` for late static binding), and declare class constants with `const`.',
            explanation: {
              heading: 'Static members',
              intro: 'Static properties and methods belong to the class itself rather than any instance and are reached through the scope resolution operator.',
              points: [
                { term: 'Belong to the class', detail: 'Static members are shared rather than duplicated per object.' },
                { term: 'Access with double colon', detail: 'The scope resolution operator reaches static members and constants.' },
                { term: 'self and static', detail: 'self refers to the defining class while static enables late static binding.' },
                { term: 'Class constants', detail: 'The const keyword defines an immutable value tied to the class.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'php-oop-interfaces',
        title: 'Interfaces & Abstract Classes',
        level: 2,
        slug: 'interfaces',
        concepts: [
          {
            id: 'php-oop-interface',
            code: "interface Shape {\n  public function area(): float;\n}\n\nclass Circle implements Shape {\n  public function __construct(private float $r) {}\n  public function area(): float {\n    return M_PI * $this->r ** 2;\n  }\n}",
            note: 'An interface defines a contract of method signatures that implementing classes must fulfill, and a class can implement many interfaces. This enables polymorphism: any object typed as `Shape` is guaranteed to have an `area()` method regardless of its concrete class.',
            explanation: {
              heading: 'Interfaces',
              intro: 'An interface defines a contract of method signatures that implementing classes must fulfill, enabling polymorphism across unrelated types.',
              points: [
                { term: 'Contract of methods', detail: 'An interface lists methods without providing their bodies.' },
                { term: 'implements keyword', detail: 'A class declares it fulfills an interface with the implements keyword.' },
                { term: 'Multiple interfaces', detail: 'A single class can implement several interfaces at once.' },
                { term: 'Enables polymorphism', detail: 'Code typed to the interface works with any conforming class.' },
              ],
            },
          },
          {
            id: 'php-oop-abstract',
            code: "abstract class Report {\n  abstract protected function rows(): array;\n\n  public function render(): string {\n    return implode(\"\\n\", $this->rows());\n  }\n}\n\nclass SalesReport extends Report {\n  protected function rows(): array { return ['Q1', 'Q2']; }\n}",
            note: 'An abstract class cannot be instantiated directly and may mix concrete methods with abstract ones that subclasses must implement. This is the classic template-method pattern: shared logic lives in the base class while subclasses fill in the specific pieces.',
            explanation: {
              heading: 'Abstract classes',
              intro: 'An abstract class cannot be instantiated directly and can mix concrete methods with abstract ones that subclasses must implement.',
              points: [
                { term: 'Cannot instantiate', detail: 'You must extend an abstract class rather than create it directly.' },
                { term: 'Abstract methods', detail: 'Declared without a body, these force subclasses to provide an implementation.' },
                { term: 'Shared logic', detail: 'Concrete methods in the base class supply behavior common to all subclasses.' },
                { term: 'Template method', detail: 'This pattern keeps the skeleton in the base and details in the children.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'php-oop-traits',
        title: 'Traits',
        level: 2,
        slug: 'traits',
        concepts: [
          {
            id: 'php-oop-trait',
            code: "trait Timestampable {\n  public ?string $createdAt = null;\n\n  public function touch(): void {\n    $this->createdAt = date('c');\n  }\n}\n\nclass Post {\n  use Timestampable;\n}\n\n$p = new Post();\n$p->touch();",
            note: 'Traits let you reuse a set of methods and properties across unrelated classes, working around PHP\'s single-inheritance limitation. A class pulls in a trait with `use`, and multiple traits can be combined, with explicit conflict resolution if two traits define the same method.',
            explanation: {
              heading: 'Traits',
              intro: 'Traits let you reuse a set of methods and properties across unrelated classes, working around PHP\'s single-inheritance limitation.',
              points: [
                { term: 'Horizontal reuse', detail: 'A trait shares code among classes that do not share a parent.' },
                { term: 'use keyword', detail: 'A class pulls in a trait with the use keyword inside its body.' },
                { term: 'Combine multiple', detail: 'A class can use several traits together.' },
                { term: 'Conflict resolution', detail: 'Explicit rules resolve clashes when two traits define the same method.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'php-oop-enums',
        title: 'Enums',
        level: 2,
        slug: 'enums',
        concepts: [
          {
            id: 'php-oop-enum',
            code: "enum Status: string {\n  case Draft     = 'draft';\n  case Published = 'published';\n\n  public function label(): string {\n    return match ($this) {\n      Status::Draft     => 'In progress',\n      Status::Published => 'Live',\n    };\n  }\n}\n\n$s = Status::from('draft'); // Status::Draft\necho $s->label();",
            note: 'Enums (PHP 8.1+) define a fixed set of named cases and can be pure or backed by a string/int scalar. Backed enums provide `from()` and `tryFrom()` to convert scalars into cases, and enums may contain methods and implement interfaces, making them ideal for type-safe state.',
            explanation: {
              heading: 'Enums',
              intro: 'Enums define a fixed set of named cases and may be pure or backed by a scalar, giving type-safe representation of a closed set of values.',
              points: [
                { term: 'Fixed cases', detail: 'An enum lists all its allowed values as named cases.' },
                { term: 'Backed enums', detail: 'A backed enum ties each case to a string or integer value.' },
                { term: 'from and tryFrom', detail: 'These convert a scalar into the matching case, with tryFrom returning null on miss.' },
                { term: 'Methods allowed', detail: 'Enums can hold methods and implement interfaces for richer behavior.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 9. Namespaces & Autoloading
  {
    id: 'php-namespaces',
    title: 'Namespaces & Autoloading',
    level: 1,
    slug: 'namespaces',
    concepts: [],
    children: [
      {
        id: 'php-namespaces-basics',
        title: 'Namespaces',
        level: 2,
        slug: 'namespace-basics',
        concepts: [
          {
            id: 'php-namespaces-declare',
            code: "<?php\nnamespace App\\Models;\n\nclass User {}\n\n// In another file:\nnamespace App\\Controllers;\n\nuse App\\Models\\User;\nuse App\\Models\\Order as PurchaseOrder;\n\n$u = new User();",
            note: 'Namespaces organize code and prevent name collisions between classes from different packages. Declare one with `namespace` at the top of a file, and import symbols elsewhere with `use`, optionally aliasing them with `as` to resolve conflicts.',
            explanation: {
              heading: 'Namespaces',
              intro: 'Namespaces organize code and prevent name collisions between classes from different packages, with imports controlled by the use keyword.',
              points: [
                { term: 'Declare at file top', detail: 'The namespace statement must appear before other code in the file.' },
                { term: 'Prevent collisions', detail: 'Two classes with the same short name coexist under different namespaces.' },
                { term: 'use to import', detail: 'The use keyword brings a namespaced symbol into the current file.' },
                { term: 'Alias with as', detail: 'The as keyword renames an imported symbol to resolve conflicts.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'php-autoloading',
        title: 'Composer Autoloading',
        level: 2,
        slug: 'autoloading',
        concepts: [
          {
            id: 'php-autoloading-psr4',
            code: "// composer.json\n{\n  \"autoload\": {\n    \"psr-4\": { \"App\\\\\": \"src/\" }\n  }\n}\n\n// after `composer dump-autoload`\nrequire 'vendor/autoload.php';\n$u = new App\\Models\\User(); // class file loaded on demand",
            note: 'PSR-4 autoloading maps a namespace prefix to a directory, so `App\\Models\\User` resolves to `src/Models/User.php`. Composer generates the autoloader; you include `vendor/autoload.php` once and classes load automatically the first time they are used, eliminating manual `require` calls.',
            explanation: {
              heading: 'PSR-4 autoloading',
              intro: 'PSR-4 autoloading maps a namespace prefix to a directory so classes load on demand, eliminating manual include statements.',
              points: [
                { term: 'Namespace to folder', detail: 'A prefix maps to a base directory that mirrors the namespace structure.' },
                { term: 'Composer generates it', detail: 'Composer builds the autoloader from the settings in composer.json.' },
                { term: 'Single include', detail: 'You include the vendor autoload file once at the program start.' },
                { term: 'Loaded on first use', detail: 'A class file loads automatically the first time the class is referenced.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 10. Error & Exception Handling
  {
    id: 'php-errors',
    title: 'Error & Exception Handling',
    level: 1,
    slug: 'errors',
    concepts: [],
    children: [
      {
        id: 'php-exceptions',
        title: 'Exceptions',
        level: 2,
        slug: 'exceptions',
        concepts: [
          {
            id: 'php-exceptions-trycatch',
            code: "try {\n  $result = 10 / $divisor;\n} catch (DivisionByZeroError $e) {\n  echo 'Cannot divide by zero';\n} catch (Throwable $e) {\n  echo 'Error: ' . $e->getMessage();\n} finally {\n  echo 'Always runs';\n}",
            note: 'Wrap risky code in `try` and handle failures in `catch` blocks, most specific type first. In PHP both `Exception` and `Error` implement `Throwable`, so catching `Throwable` catches everything. The optional `finally` block always executes for cleanup regardless of the outcome.',
            explanation: {
              heading: 'Try, catch, finally',
              intro: 'Risky code goes in a try block and failures are handled in catch blocks, with an optional finally section that always runs for cleanup.',
              points: [
                { term: 'Specific first', detail: 'List more specific exception types before broader ones.' },
                { term: 'Throwable catches all', detail: 'Both exceptions and errors implement Throwable, so catching it handles everything.' },
                { term: 'finally always runs', detail: 'The finally block executes whether or not an exception occurred.' },
                { term: 'Errors vs exceptions', detail: 'PHP separates internal Error types from application Exception types.' },
              ],
            },
          },
          {
            id: 'php-exceptions-custom',
            code: "class NotFoundException extends \\RuntimeException {}\n\nfunction findUser(int $id): User {\n  $user = $repo->find($id);\n  if ($user === null) {\n    throw new NotFoundException(\"User $id not found\");\n  }\n  return $user;\n}",
            note: 'Define custom exceptions by extending built-in types such as `RuntimeException` or `InvalidArgumentException` to convey meaning. Throwing specific exception types lets callers catch exactly the failures they can handle, and PHP 8 also supports catching without binding a variable (`catch (NotFoundException)`).',
            explanation: {
              heading: 'Custom exceptions',
              intro: 'Extending built-in exception types creates meaningful error classes so callers can catch precisely the failures they can handle.',
              points: [
                { term: 'Extend built-ins', detail: 'Subclass types like runtime or invalid-argument exceptions to convey intent.' },
                { term: 'Precise catching', detail: 'Specific types let callers handle only the errors they expect.' },
                { term: 'Catch without variable', detail: 'PHP 8 allows catching an exception type without binding it to a variable.' },
                { term: 'Convey meaning', detail: 'Named exceptions document what went wrong better than a generic one.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 11. Closures & Generators
  {
    id: 'php-closures-generators',
    title: 'Closures & Generators',
    level: 1,
    slug: 'closures-generators',
    concepts: [],
    children: [
      {
        id: 'php-closures',
        title: 'Closures & Arrow Functions',
        level: 2,
        slug: 'closures',
        concepts: [
          {
            id: 'php-closures-use',
            code: "$factor = 3;\n$multiply = function (int $n) use ($factor): int {\n  return $n * $factor;\n};\necho $multiply(5); // 15\n\n$add = fn(int $a, int $b) => $a + $b; // arrow fn",
            note: 'A closure is an anonymous function; it must explicitly import outer variables with `use`, capturing them by value (or by reference with `&`). Arrow functions written with `fn` are a concise single-expression form that automatically capture outer variables by value.',
            explanation: {
              heading: 'Closures and arrow functions',
              intro: 'A closure is an anonymous function that must import outer variables explicitly, while arrow functions capture them automatically for short expressions.',
              points: [
                { term: 'use imports variables', detail: 'A closure lists the outer variables it needs with the use clause.' },
                { term: 'Capture by value', detail: 'Imported variables copy their value unless captured by reference.' },
                { term: 'Arrow functions', detail: 'The fn form is a concise single-expression closure.' },
                { term: 'Automatic capture', detail: 'Arrow functions grab outer variables by value without a use clause.' },
              ],
            },
          },
          {
            id: 'php-closures-firstclass',
            code: "$fn = strlen(...);        // first-class callable syntax\necho $fn('hello');        // 5\n\n$user = new User('Ada');\n$getName = $user->getName(...); // bind a method\necho $getName();",
            note: 'The first-class callable syntax `foo(...)` (PHP 8.1+) creates a `Closure` from any function or method without invoking it. It replaces older, error-prone string and array callable forms with a type-safe, IDE-friendly reference you can pass around.',
            explanation: {
              heading: 'First-class callables',
              intro: 'The first-class callable syntax turns any function or method into a Closure object without invoking it, replacing older string and array forms.',
              points: [
                { term: 'Three-dot syntax', detail: 'Following a function name with three dots creates a callable reference.' },
                { term: 'No invocation', detail: 'It produces the closure without calling the underlying function.' },
                { term: 'Type-safe', detail: 'It is checked at compile time, unlike error-prone string callables.' },
                { term: 'Bind methods', detail: 'The same syntax captures an object\'s method as a callable.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'php-generators',
        title: 'Generators',
        level: 2,
        slug: 'generators',
        concepts: [
          {
            id: 'php-generators-yield',
            code: "function countTo(int $max): Generator {\n  for ($i = 1; $i <= $max; $i++) {\n    yield $i;\n  }\n}\n\nforeach (countTo(3) as $n) {\n  echo $n; // 123\n}",
            note: 'A generator is a function containing `yield` that produces values lazily, one at a time, without building the whole result set in memory. This makes it perfect for streaming large datasets or reading big files, since each value is computed only when the loop asks for it.',
            explanation: {
              heading: 'Generators',
              intro: 'A generator is a function containing yield that produces values lazily one at a time, avoiding building an entire result set in memory.',
              points: [
                { term: 'yield produces values', detail: 'Each yield hands back one value and pauses the function.' },
                { term: 'Lazy evaluation', detail: 'Values are computed only as the consuming loop requests them.' },
                { term: 'Low memory', detail: 'Streaming large files or datasets avoids loading everything at once.' },
                { term: 'Iterable', detail: 'A generator can be iterated directly with foreach.' },
              ],
            },
            example: "function readLines(string $path): Generator {\n  $fh = fopen($path, 'r');\n  while (($line = fgets($fh)) !== false) {\n    yield $line;\n  }\n  fclose($fh);\n}",
          },
        ],
        children: [],
      },
    ],
  },

  // 12. Dates, Files & JSON
  {
    id: 'php-dates-files-json',
    title: 'Dates, Files & JSON',
    level: 1,
    slug: 'dates-files-json',
    concepts: [],
    children: [
      {
        id: 'php-dates',
        title: 'Dates & Times',
        level: 2,
        slug: 'dates',
        concepts: [
          {
            id: 'php-dates-datetime',
            code: "$now = new DateTimeImmutable('now');\n$tomorrow = $now->modify('+1 day');\n\necho $now->format('Y-m-d H:i:s');\n\n$diff = $now->diff($tomorrow);\necho $diff->days; // 1",
            note: 'Prefer `DateTimeImmutable` over `DateTime` so that operations like `modify()` return a new object instead of mutating the original, preventing subtle bugs. Format output with `format()` using date tokens, and compare two dates with `diff()` to get a `DateInterval`.',
            explanation: {
              heading: 'Dates and times',
              intro: 'The immutable date type is preferred because its operations return new objects, preventing subtle bugs from shared mutable state.',
              points: [
                { term: 'Prefer immutable', detail: 'The immutable variant returns a new object rather than changing the original.' },
                { term: 'modify shifts time', detail: 'The modify method applies a relative change like adding one day.' },
                { term: 'format for output', detail: 'The format method renders a date using token characters.' },
                { term: 'diff compares', detail: 'The diff method returns an interval describing the gap between two dates.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'php-files',
        title: 'File I/O',
        level: 2,
        slug: 'file-io',
        concepts: [
          {
            id: 'php-files-read-write',
            code: "file_put_contents('log.txt', \"entry\\n\", FILE_APPEND);\n$contents = file_get_contents('log.txt');\n$lines = file('log.txt', FILE_IGNORE_NEW_LINES);\n\nif (file_exists('config.json')) {\n  // process file\n}",
            note: 'For simple cases `file_get_contents` and `file_put_contents` read or write an entire file in one call, and the `FILE_APPEND` flag adds to the end rather than overwriting. Use the `fopen`/`fgets`/`fclose` handle API when you need to stream large files line by line.',
            explanation: {
              heading: 'File input and output',
              intro: 'PHP offers simple whole-file helpers for small files and a handle-based streaming API for large ones read line by line.',
              points: [
                { term: 'Whole-file helpers', detail: 'get and put contents read or write an entire file in one call.' },
                { term: 'Append flag', detail: 'The append flag adds to the end of a file instead of overwriting it.' },
                { term: 'Streaming API', detail: 'Open, read-line, and close functions process large files a line at a time.' },
                { term: 'Check existence', detail: 'The file-exists function verifies a path before you use it.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'php-json',
        title: 'JSON',
        level: 2,
        slug: 'json',
        concepts: [
          {
            id: 'php-json-encode-decode',
            code: "$data = ['name' => 'Ada', 'roles' => ['admin']];\n$json = json_encode($data, JSON_PRETTY_PRINT);\n\n$decoded = json_decode($json, true); // true -> assoc array\n$object  = json_decode($json);       // stdClass object\n\njson_decode('{bad', true, flags: JSON_THROW_ON_ERROR);",
            note: '`json_encode` serializes PHP values to a JSON string and `json_decode` parses one back, returning an associative array when the second argument is `true` or a `stdClass` object otherwise. Pass the `JSON_THROW_ON_ERROR` flag so malformed JSON raises a `JsonException` instead of returning null silently.',
            explanation: {
              heading: 'Working with JSON',
              intro: 'PHP converts between values and JSON text with two functions, and a flag makes malformed input raise an exception instead of failing silently.',
              points: [
                { term: 'encode serializes', detail: 'The encode function turns PHP values into a JSON string.' },
                { term: 'decode parses', detail: 'The decode function reads JSON back into PHP values.' },
                { term: 'Associative flag', detail: 'Passing true to decode returns arrays instead of standard objects.' },
                { term: 'Throw on error', detail: 'The throw-on-error flag raises an exception for invalid JSON.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 13. Web: Forms, Sessions & Security
  {
    id: 'php-web',
    title: 'Web: Forms, Sessions & Security',
    level: 1,
    slug: 'web',
    concepts: [],
    children: [
      {
        id: 'php-superglobals',
        title: 'Superglobals & Forms',
        level: 2,
        slug: 'superglobals',
        concepts: [
          {
            id: 'php-superglobals-intro',
            code: "// Handle a submitted form\nif ($_SERVER['REQUEST_METHOD'] === 'POST') {\n  $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);\n  $name  = htmlspecialchars(trim($_POST['name'] ?? ''));\n\n  if ($email === false) {\n    $errors[] = 'Invalid email';\n  }\n}",
            note: 'Superglobals like `$_GET`, `$_POST`, and `$_SERVER` are always in scope and carry request data. Never trust their contents: validate with `filter_input`/`filter_var` and escape any value you echo back into HTML using `htmlspecialchars` to prevent cross-site scripting (XSS).',
            explanation: {
              heading: 'Superglobals and forms',
              intro: 'Superglobals hold request data and are available everywhere, but their contents come from users and must always be validated and escaped.',
              points: [
                { term: 'Always in scope', detail: 'Superglobals such as the post and server arrays are accessible without importing.' },
                { term: 'Never trust input', detail: 'Request data can be malicious, so treat every value as untrusted.' },
                { term: 'Validate input', detail: 'Filter functions check and sanitize incoming values.' },
                { term: 'Escape output', detail: 'Escaping values before printing them into HTML prevents cross-site scripting.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'php-sessions',
        title: 'Sessions & Cookies',
        level: 2,
        slug: 'sessions',
        concepts: [
          {
            id: 'php-sessions-intro',
            code: "session_start();\n$_SESSION['user_id'] = 42;\n\n// On login, prevent session fixation\nsession_regenerate_id(true);\n\n// Secure cookie\nsetcookie('theme', 'dark', [\n  'expires'  => time() + 86400,\n  'httponly' => true,\n  'secure'   => true,\n  'samesite' => 'Lax',\n]);",
            note: 'Call `session_start()` before any output to enable the `$_SESSION` store, which persists per-user data across requests via a cookie. Call `session_regenerate_id(true)` after a privilege change like login to prevent session fixation, and set the `httponly`, `secure`, and `samesite` cookie flags to harden against theft.',
            explanation: {
              heading: 'Sessions and cookies',
              intro: 'Sessions store per-user data across requests using a cookie, and hardening steps protect against fixation and theft.',
              points: [
                { term: 'Start before output', detail: 'The session start call must run before any content is sent.' },
                { term: 'Regenerate on login', detail: 'Regenerating the session id after a privilege change prevents fixation attacks.' },
                { term: 'Cookie flags', detail: 'The http-only, secure, and same-site flags reduce cookie theft and misuse.' },
                { term: 'Server-side store', detail: 'Session values live on the server while only an id travels in the cookie.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'php-security',
        title: 'Security Essentials',
        level: 2,
        slug: 'security',
        concepts: [
          {
            id: 'php-security-passwords',
            code: "// Hashing on registration\n$hash = password_hash($plain, PASSWORD_DEFAULT);\n\n// Verification on login\nif (password_verify($plain, $hash)) {\n  if (password_needs_rehash($hash, PASSWORD_DEFAULT)) {\n    $hash = password_hash($plain, PASSWORD_DEFAULT);\n  }\n}",
            note: 'Never store plaintext passwords; hash them with `password_hash`, which uses a strong, salted algorithm (bcrypt by default) automatically. Check credentials with `password_verify`, and use `password_needs_rehash` to transparently upgrade hashes as security defaults improve over time.',
            explanation: {
              heading: 'Password hashing',
              intro: 'Passwords must never be stored in plaintext; PHP hashes them with a strong salted algorithm and verifies them safely.',
              points: [
                { term: 'Never store plaintext', detail: 'Always hash a password before saving it.' },
                { term: 'hash function', detail: 'The password hash function uses a strong salted algorithm by default.' },
                { term: 'verify function', detail: 'The password verify function safely checks a candidate against the stored hash.' },
                { term: 'Rehash on upgrade', detail: 'The needs-rehash check lets you transparently strengthen old hashes over time.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 14. Database Access with PDO
  {
    id: 'php-database',
    title: 'Database Access with PDO',
    level: 1,
    slug: 'database',
    concepts: [],
    children: [
      {
        id: 'php-pdo-connect',
        title: 'Connecting with PDO',
        level: 2,
        slug: 'pdo-connect',
        concepts: [
          {
            id: 'php-pdo-connection',
            code: "$dsn = 'mysql:host=localhost;dbname=app;charset=utf8mb4';\n$pdo = new PDO($dsn, $user, $pass, [\n  PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,\n  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,\n  PDO::ATTR_EMULATE_PREPARES  => false,\n]);",
            note: 'PDO is PHP\'s database-agnostic access layer; you connect using a DSN string plus credentials. Set `ERRMODE_EXCEPTION` so query failures throw exceptions, and disable emulated prepares so the driver uses real server-side prepared statements for safety and correctness.',
            explanation: {
              heading: 'Connecting with PDO',
              intro: 'PDO is PHP\'s database-agnostic access layer; you connect with a data source string and configure it for safe, predictable behavior.',
              points: [
                { term: 'Database agnostic', detail: 'The same API works across many database engines via drivers.' },
                { term: 'DSN string', detail: 'The data source name specifies the driver, host, and database.' },
                { term: 'Exception error mode', detail: 'Setting exception error mode makes query failures throw rather than pass silently.' },
                { term: 'Disable emulated prepares', detail: 'Turning off emulation uses real server-side prepared statements for correctness.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'php-pdo-queries',
        title: 'Prepared Statements',
        level: 2,
        slug: 'prepared-statements',
        concepts: [
          {
            id: 'php-pdo-prepared',
            code: "$stmt = $pdo->prepare(\n  'SELECT * FROM users WHERE role = :role AND active = :active'\n);\n$stmt->execute(['role' => 'admin', 'active' => 1]);\n$admins = $stmt->fetchAll();\n\n// Insert and get the new id\n$ins = $pdo->prepare('INSERT INTO users (name) VALUES (?)');\n$ins->execute(['Ada']);\n$id = $pdo->lastInsertId();",
            note: 'Always use prepared statements with bound parameters instead of concatenating user input into SQL; this is the primary defense against SQL injection. Placeholders can be named (`:role`) or positional (`?`), and the driver safely separates data from the query structure.',
            explanation: {
              heading: 'Prepared statements',
              intro: 'Prepared statements with bound parameters separate data from query structure, forming the primary defense against SQL injection.',
              points: [
                { term: 'Bind parameters', detail: 'Placeholders receive user values safely instead of concatenating strings.' },
                { term: 'Named or positional', detail: 'Placeholders can be named with a colon or positional question marks.' },
                { term: 'Prevents injection', detail: 'The driver keeps data and SQL separate so input cannot alter the query.' },
                { term: 'Last insert id', detail: 'After an insert you can retrieve the newly generated primary key.' },
              ],
            },
          },
          {
            id: 'php-pdo-transactions',
            code: "$pdo->beginTransaction();\ntry {\n  $pdo->prepare('UPDATE accounts SET bal = bal - ? WHERE id = ?')\n      ->execute([100, 1]);\n  $pdo->prepare('UPDATE accounts SET bal = bal + ? WHERE id = ?')\n      ->execute([100, 2]);\n  $pdo->commit();\n} catch (Throwable $e) {\n  $pdo->rollBack();\n  throw $e;\n}",
            note: 'Wrap related writes in a transaction so they succeed or fail as a unit, preserving data integrity. Call `beginTransaction()`, then `commit()` on success, and `rollBack()` inside a catch block if anything throws, guaranteeing the database is never left half-updated.',
            explanation: {
              heading: 'Transactions',
              intro: 'Wrapping related writes in a transaction makes them succeed or fail as a unit, preserving data integrity when something goes wrong.',
              points: [
                { term: 'All or nothing', detail: 'Grouped statements either all commit or none take effect.' },
                { term: 'begin then commit', detail: 'You start a transaction, run the writes, and commit on success.' },
                { term: 'Roll back on error', detail: 'A catch block rolls back so the database is never left half-updated.' },
                { term: 'Data integrity', detail: 'Transactions protect invariants like transferring money between accounts.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 15. Regular Expressions
  {
    id: 'php-regex',
    title: 'Regular Expressions',
    level: 1,
    slug: 'regex',
    concepts: [],
    children: [
      {
        id: 'php-regex-basics',
        title: 'PCRE Functions',
        level: 2,
        slug: 'pcre',
        concepts: [
          {
            id: 'php-regex-match',
            code: "if (preg_match('/^\\d{3}-\\d{4}$/', '555-1234')) {\n  echo 'valid';\n}\n\npreg_match('/(\\w+)@(\\w+)/', 'ada@site', $m);\n// $m[1] = 'ada', $m[2] = 'site'\n\n$clean = preg_replace('/\\s+/', ' ', $messy);",
            note: 'PHP\'s `preg_*` functions use PCRE (Perl-compatible) syntax, with the pattern wrapped in delimiters like `/.../`. Use `preg_match` to test and capture groups, `preg_match_all` for every occurrence, and `preg_replace` to substitute matches.',
            explanation: {
              heading: 'PCRE matching',
              intro: 'PHP\'s regular expression functions use Perl-compatible syntax with the pattern wrapped in delimiters, supporting testing and capturing.',
              points: [
                { term: 'Delimiters required', detail: 'The pattern is wrapped in delimiter characters such as forward slashes.' },
                { term: 'match tests and captures', detail: 'The match function returns whether it matched and fills capture groups.' },
                { term: 'match all', detail: 'The match-all function collects every occurrence in the subject.' },
                { term: 'replace', detail: 'The replace function substitutes text wherever the pattern matches.' },
              ],
            },
          },
          {
            id: 'php-regex-split',
            code: "$parts = preg_split('/[\\s,]+/', 'a, b  c');   // ['a','b','c']\n\n$slug = preg_replace_callback(\n  '/[A-Z]/',\n  fn($m) => '-' . strtolower($m[0]),\n  'CamelCase'\n); // -camel-case",
            note: '`preg_split` breaks a string on a pattern, which is handy for flexible delimiters. `preg_replace_callback` runs a function on each match so you can compute the replacement dynamically, useful for transformations like case conversion.',
            explanation: {
              heading: 'Splitting and callbacks',
              intro: 'Beyond matching, PCRE functions can split strings on a pattern and compute replacements dynamically through a callback.',
              points: [
                { term: 'split on pattern', detail: 'The split function breaks a string wherever the pattern matches.' },
                { term: 'Flexible delimiters', detail: 'A pattern can match runs of spaces and commas as one separator.' },
                { term: 'replace with callback', detail: 'The callback replace runs a function to build each replacement.' },
                { term: 'Dynamic output', detail: 'Callbacks enable transformations such as case conversion per match.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 16. Modern PHP Features
  {
    id: 'php-modern',
    title: 'Modern PHP Features',
    level: 1,
    slug: 'modern',
    concepts: [],
    children: [
      {
        id: 'php-modern-readonly',
        title: 'Readonly Properties',
        level: 2,
        slug: 'readonly',
        concepts: [
          {
            id: 'php-modern-readonly-props',
            code: "final class Point {\n  public function __construct(\n    public readonly int $x,\n    public readonly int $y,\n  ) {}\n}\n\n$p = new Point(1, 2);\necho $p->x;   // 1\n$p->x = 9;    // Error: cannot modify readonly property",
            note: 'A `readonly` property (PHP 8.1+) can be assigned exactly once, typically in the constructor, and then becomes immutable. This is the simplest way to build value objects and DTOs whose state cannot change after creation, reducing an entire class of bugs.',
            explanation: {
              heading: 'Readonly properties',
              intro: 'A readonly property can be assigned exactly once, usually in the constructor, and then becomes immutable, ideal for value objects.',
              points: [
                { term: 'Assign once', detail: 'The property may be set a single time, typically during construction.' },
                { term: 'Immutable after', detail: 'Any later attempt to modify it raises an error.' },
                { term: 'Value objects', detail: 'It is the simplest way to build objects whose state cannot change.' },
                { term: 'Fewer bugs', detail: 'Immutability removes a whole class of accidental mutation bugs.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'php-modern-attributes',
        title: 'Attributes',
        level: 2,
        slug: 'attributes',
        concepts: [
          {
            id: 'php-modern-attributes-intro',
            code: "#[Attribute]\nclass Route {\n  public function __construct(public string $path) {}\n}\n\nclass HomeController {\n  #[Route('/home')]\n  public function index() {}\n}\n\n// Read at runtime via reflection\n$refl = new ReflectionMethod(HomeController::class, 'index');\n$attrs = $refl->getAttributes(Route::class);",
            note: 'Attributes (PHP 8.0+) are structured, native metadata you attach to classes, methods, or properties using `#[...]` syntax, replacing docblock annotations. Frameworks read them at runtime through the Reflection API to drive routing, validation, and dependency injection.',
            explanation: {
              heading: 'Attributes',
              intro: 'Attributes are structured native metadata attached to classes, methods, or properties, replacing docblock annotations and read at runtime via reflection.',
              points: [
                { term: 'Native metadata', detail: 'Attributes attach machine-readable data using a bracket syntax.' },
                { term: 'Replace docblocks', detail: 'They supersede comment-based annotations with a first-class language feature.' },
                { term: 'Read via reflection', detail: 'Frameworks inspect attributes at runtime through the reflection API.' },
                { term: 'Drive frameworks', detail: 'Routing, validation, and dependency injection commonly use attributes.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'php-modern-fibers',
        title: 'Fibers',
        level: 2,
        slug: 'fibers',
        concepts: [
          {
            id: 'php-modern-fibers-intro',
            code: "$fiber = new Fiber(function (): void {\n  $received = Fiber::suspend('paused');\n  echo \"Resumed with: $received\";\n});\n\n$value = $fiber->start();   // 'paused'\n$fiber->resume('go');       // prints: Resumed with: go",
            note: 'Fibers (PHP 8.1+) are full-stack, interruptible functions that can pause with `Fiber::suspend()` and later resume where they left off. They are a low-level building block for cooperative multitasking, powering async event loops in libraries like ReactPHP and AMPHP rather than being used directly in everyday code.',
            explanation: {
              heading: 'Fibers',
              intro: 'Fibers are interruptible functions that can pause and later resume where they left off, providing a low-level base for cooperative multitasking.',
              points: [
                { term: 'Suspend and resume', detail: 'A fiber can pause with suspend and continue later from the same point.' },
                { term: 'Full stack', detail: 'Fibers preserve their entire call stack while paused.' },
                { term: 'Cooperative multitasking', detail: 'They let code yield control voluntarily rather than run in parallel.' },
                { term: 'Powers async libraries', detail: 'Event-loop libraries use fibers under the hood rather than everyday code.' },
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
