// Ruby topic tree.
//
// Each node is a ConceptNode: { id, title, level, slug, concepts[], children[] }.
// Routable nodes carry a `slug`. Every Concept renders in the fixed order
// code -> note -> example (example optional).

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  // 1. Basics & Syntax
  {
    id: 'ruby-basics',
    title: 'Basics & Syntax',
    level: 1,
    slug: 'basics',
    concepts: [],
    children: [
      {
        id: 'ruby-hello-world',
        title: 'Hello World & Structure',
        level: 2,
        slug: 'hello-world',
        concepts: [
          {
            id: 'ruby-hello-intro',
            code: "# hello.rb\nputs 'Hello, Ruby!'\nprint 'No newline here'\np [1, 2, 3]",
            note: 'Ruby files run top to bottom with no required boilerplate — there is no mandatory main method. `puts` prints with a trailing newline, `print` without one, and `p` shows the inspected form of an object, which is great for debugging.',
            explanation: {
              heading: 'How it works',
              intro: 'Ruby scripts execute from the top of the file to the bottom with no required boilerplate, and the standard output methods differ mainly in how they format and terminate their output.',
              points: [
                { term: 'No main method', detail: 'Code at the top level runs immediately, so small scripts need no wrapping function or class.' },
                { term: 'puts vs print', detail: 'puts appends a newline after each argument while print writes the text exactly as given.' },
                { term: 'p for debugging', detail: 'p prints the inspect form of an object, showing quotes and structure, and returns the object itself.' },
                { term: 'Everything is an object', detail: 'Even the values you print are objects, so they all respond to methods like to_s and inspect.' },
              ],
            },
            example: "puts 'a', 'b' # prints two lines\np 'a'         # => \"a\" (with quotes)",
          },
          {
            id: 'ruby-comments',
            code: "# A single-line comment\n\n=begin\nThis is a multi-line\ncomment block.\n=end\n\nx = 5 # inline comment",
            note: 'Comments start with `#` and run to the end of the line. For longer notes you can wrap text between `=begin` and `=end`, which must sit at the very start of a line. Comments are ignored by the interpreter.',
            explanation: {
              heading: 'Writing comments',
              intro: 'Comments document code and are ignored by the interpreter; Ruby supports both line comments and a block form for longer notes.',
              points: [
                { term: 'Line comments', detail: 'A hash symbol starts a comment that runs to the end of the current line.' },
                { term: 'Block comments', detail: 'Text between the begin marker and end marker forms a multi-line comment that must start in column one.' },
                { term: 'Inline notes', detail: 'You can place a comment after code on the same line to annotate a specific statement.' },
                { term: 'Prefer line comments', detail: 'Most Ruby code uses hash comments because the block form is rare and easy to misplace.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'ruby-expressions',
        title: 'Everything Is an Expression',
        level: 2,
        slug: 'expressions',
        concepts: [
          {
            id: 'ruby-expr-intro',
            code: "result = if 3 > 2\n           'bigger'\n         else\n           'smaller'\n         end\n\nputs result # => bigger",
            note: 'In Ruby almost everything returns a value, including `if`, `case`, and method bodies. The last evaluated expression becomes the return value, so you rarely need an explicit `return`. This makes assignments from control flow natural and concise.',
            explanation: {
              heading: 'Expressions everywhere',
              intro: 'In Ruby nearly every construct evaluates to a value, so control-flow structures can be assigned directly to variables.',
              points: [
                { term: 'Implicit return', detail: 'The last expression evaluated in a block, method, or branch becomes its value.' },
                { term: 'if as a value', detail: 'An if or unless expression returns the result of whichever branch runs.' },
                { term: 'case returns too', detail: 'A case expression yields the value of the matched branch, ideal for lookups.' },
                { term: 'Fewer temp variables', detail: 'Because blocks return values, you can assign results without extra intermediate variables.' },
              ],
            },
            example: "greeting = case 14\n           when 0..11 then 'morning'\n           else 'afternoon'\n           end",
          },
        ],
        children: [],
      },
    ],
  },

  // 2. Variables & Types
  {
    id: 'ruby-variables-section',
    title: 'Variables & Types',
    level: 1,
    slug: 'variables',
    concepts: [],
    children: [
      {
        id: 'ruby-variables',
        title: 'Variables & Dynamic Typing',
        level: 2,
        slug: 'variable-basics',
        concepts: [
          {
            id: 'ruby-variables-intro',
            code: "name = 'Ruby'\ncount = 42\npi = 3.14\nname = 100 # totally fine — no fixed type",
            note: 'Ruby is dynamically typed: variables are just references to objects and can point to anything at any time. Even integers and floats are full objects with methods. Local variables use snake_case by convention.',
            explanation: {
              heading: 'Dynamic typing',
              intro: 'Ruby variables are untyped references that can point to any object, and the type travels with the value rather than the name.',
              points: [
                { term: 'References not boxes', detail: 'A variable simply names an object, so reassigning it to a different type is allowed.' },
                { term: 'Numbers are objects', detail: 'Integers and floats respond to methods such as times and round like any other object.' },
                { term: 'snake_case names', detail: 'Local variables and method names use lowercase words joined by underscores by convention.' },
                { term: 'No declarations', detail: 'Assigning a value creates the variable; there is no separate declaration step.' },
              ],
            },
            example: "5.times { |i| puts i } # 0 1 2 3 4 each on its own line",
          },
        ],
        children: [],
      },
      {
        id: 'ruby-variable-scopes',
        title: 'Variable Scopes & Constants',
        level: 2,
        slug: 'scopes',
        concepts: [
          {
            id: 'ruby-scopes-intro',
            code: "count = 1        # local variable\n@name = 'Ada'    # instance variable\n@@total = 0      # class variable\n$global = 'rare' # global variable\nMAX = 100        # constant (CamelCase or ALL_CAPS)",
            note: 'A leading sigil signals scope: `@` for instance variables, `@@` for class variables, and `$` for globals. Names starting with an uppercase letter are constants. Reassigning a constant works but triggers a warning, signalling that the value should stay fixed.',
            explanation: {
              heading: 'Scope by sigil',
              intro: 'A leading symbol on a name signals where a variable lives, and capitalized names mark constants that should not change.',
              points: [
                { term: 'Instance variables', detail: 'Names starting with a single at sign hold per-object state and default to nil when unset.' },
                { term: 'Class variables', detail: 'Names starting with two at signs are shared across a class and its subclasses.' },
                { term: 'Globals are rare', detail: 'A dollar sign marks a global variable, which is generally avoided in favor of clearer alternatives.' },
                { term: 'Constants warn', detail: 'Reassigning a constant is allowed but triggers a warning to flag likely mistakes.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'ruby-nil-truthiness',
        title: 'nil & Truthiness',
        level: 2,
        slug: 'nil-truthiness',
        concepts: [
          {
            id: 'ruby-nil-intro',
            code: "value = nil\nputs value.nil?   # => true\nputs value.to_s   # => \"\" (empty string)\n\nputs 'runs' if 0  # 0 is truthy in Ruby!",
            note: 'Only `nil` and `false` are falsy in Ruby; every other value, including `0` and empty strings, is truthy. `nil` represents absence and responds to helpful methods like `nil?` and `to_s`. The safe-navigation operator `&.` calls a method only when the receiver is not nil.',
            explanation: {
              heading: 'Truthiness rules',
              intro: 'Ruby treats only two values as false, which makes conditionals predictable, and it offers safe ways to work with the absence value nil.',
              points: [
                { term: 'Only nil and false', detail: 'Every other value is truthy, so zero and empty strings count as true.' },
                { term: 'nil is an object', detail: 'The single nil value responds to helpers such as the nil query method and to_s.' },
                { term: 'Safe navigation', detail: 'The safe-navigation operator calls a method only when the receiver is not nil, avoiding errors.' },
                { term: 'Absence not error', detail: 'Ruby uses nil to represent missing data rather than throwing on undefined access.' },
              ],
            },
            example: "user = nil\nputs user&.name # => nil, no NoMethodError",
          },
        ],
        children: [],
      },
    ],
  },

  // 3. Strings & Symbols
  {
    id: 'ruby-strings-section',
    title: 'Strings & Symbols',
    level: 1,
    slug: 'strings',
    concepts: [],
    children: [
      {
        id: 'ruby-strings',
        title: 'String Literals & Interpolation',
        level: 2,
        slug: 'string-basics',
        concepts: [
          {
            id: 'ruby-strings-intro',
            code: "name = 'Ada'\ngreeting = \"Hello, #{name}!\" # interpolation\nliteral = 'No #{name} here'   # single quotes: no interpolation\nputs greeting # => Hello, Ada!",
            note: 'Double-quoted strings support interpolation with `#{...}` and escape sequences like `\\n`, while single-quoted strings are almost literal. Ruby strings are mutable objects, so methods like `<<` append in place. Prefer interpolation over concatenation for readability.',
            explanation: {
              heading: 'String literals',
              intro: 'Ruby offers two main quoting styles that differ in whether they interpret escape sequences and interpolation, and strings are mutable objects.',
              points: [
                { term: 'Double quotes interpolate', detail: 'Text inside a hash-brace placeholder is evaluated and inserted into the string.' },
                { term: 'Single quotes are literal', detail: 'Single-quoted strings treat almost everything verbatim and run slightly faster.' },
                { term: 'Mutable objects', detail: 'Strings can be changed in place, for example appending with the double less-than operator.' },
                { term: 'Prefer interpolation', detail: 'Embedding values reads more clearly than chaining many concatenations together.' },
              ],
            },
            example: "sum = \"2 + 2 = #{2 + 2}\" # => \"2 + 2 = 4\"",
          },
          {
            id: 'ruby-string-methods',
            code: "s = '  Ruby Rocks  '\ns.strip        # => 'Ruby Rocks'\ns.upcase       # => '  RUBY ROCKS  '\ns.split(' ')   # => ['Ruby', 'Rocks']\ns.gsub('o', '0') # => '  Ruby R0cks  '",
            note: 'The String class ships with a rich toolbox: `strip`, `upcase`/`downcase`, `split`, `gsub`, `include?`, and many more. Most methods return a new string, while their bang counterparts like `gsub!` mutate the original. Chaining these reads almost like plain English.',
            explanation: {
              heading: 'Working with strings',
              intro: 'The String class provides a large toolbox of methods for transforming and inspecting text, most of which return new strings.',
              points: [
                { term: 'Non-mutating by default', detail: 'Methods like upcase and strip return a fresh string and leave the original untouched.' },
                { term: 'Bang variants mutate', detail: 'A trailing exclamation mark, as in gsub with a bang, changes the receiver in place.' },
                { term: 'Chainable', detail: 'Because each method returns a string, calls can be chained into readable pipelines.' },
                { term: 'Rich standard set', detail: 'split, gsub, include query, and many others cover most common text tasks.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'ruby-symbols',
        title: 'Symbols vs Strings',
        level: 2,
        slug: 'symbols',
        concepts: [
          {
            id: 'ruby-symbols-intro',
            code: "status = :active   # a symbol\nputs status.class  # => Symbol\n\n:active.equal?(:active) # => true (same object)\n'active'.equal?('active') # => false",
            note: 'A symbol like `:active` is an immutable, interned identifier — every reference to the same symbol points to the exact same object in memory. Strings are mutable and create a new object each time. Use symbols for fixed labels such as hash keys and method names, and strings for text that changes or is displayed.',
            explanation: {
              heading: 'Symbols vs strings',
              intro: 'A symbol is an immutable, interned name; every occurrence of the same symbol is the exact same object, which makes symbols ideal for fixed labels.',
              points: [
                { term: 'Interned once', detail: 'Repeating a symbol reuses the same object, unlike strings which create a new object each time.' },
                { term: 'Immutable', detail: 'Symbols cannot be modified, which suits them for keys and identifiers.' },
                { term: 'Hash keys', detail: 'Symbols are the conventional choice for hash keys because of the shorthand syntax and speed.' },
                { term: 'Text uses strings', detail: 'Use strings for content that changes or is shown to users, and symbols for stable names.' },
              ],
            },
            example: "user = { name: 'Ada', role: :admin }\nuser[:role] # => :admin",
          },
        ],
        children: [],
      },
    ],
  },

  // 4. Numbers
  {
    id: 'ruby-numbers-section',
    title: 'Numbers',
    level: 1,
    slug: 'numbers',
    concepts: [],
    children: [
      {
        id: 'ruby-integers-floats',
        title: 'Integers & Floats',
        level: 2,
        slug: 'integers-floats',
        concepts: [
          {
            id: 'ruby-numbers-intro',
            code: "10 / 3       # => 3 (integer division)\n10.0 / 3     # => 3.333...\n10 % 3       # => 1 (modulo)\n2 ** 10      # => 1024\n1_000_000    # underscores for readability",
            note: 'Integer-by-integer division truncates toward zero, so mix in a float to get a decimal result. Integers have arbitrary precision in Ruby and grow beyond machine word size automatically. Underscores inside literals are ignored and just aid readability.',
            explanation: {
              heading: 'Integer and float math',
              intro: 'Ruby distinguishes integers from floats, and dividing two integers truncates, so you mix in a float when you want a decimal result.',
              points: [
                { term: 'Integer division truncates', detail: 'Dividing two integers discards the fractional part rather than rounding.' },
                { term: 'Arbitrary precision', detail: 'Integers grow beyond machine word size automatically, so large results never overflow.' },
                { term: 'Underscores for clarity', detail: 'Underscores inside numeric literals are ignored and just help readability.' },
                { term: 'Numbers have methods', detail: 'Values respond to helpers such as abs, round, and the fdiv float division method.' },
              ],
            },
            example: "(-7).abs   # => 7\n3.14.round # => 3\n7.fdiv(2)  # => 3.5",
          },
        ],
        children: [],
      },
      {
        id: 'ruby-number-methods',
        title: 'Numeric Methods & Conversion',
        level: 2,
        slug: 'numeric-methods',
        concepts: [
          {
            id: 'ruby-number-conv',
            code: "'42'.to_i    # => 42\n'3.9'.to_f   # => 3.9\n42.to_s      # => '42'\n3.7.floor    # => 3\n3.2.ceil     # => 4\n5.times { print '*' } # => *****",
            note: 'Conversions are explicit and predictable: `to_i`, `to_f`, and `to_s` move between numbers and strings. Numbers also behave like objects, so `times`, `upto`, and `step` let you iterate without a manual loop. `to_i` stops at the first non-numeric character rather than raising.',
            explanation: {
              heading: 'Conversion and iteration',
              intro: 'Ruby makes type conversion explicit through named methods and lets numbers act as objects that can drive loops directly.',
              points: [
                { term: 'Explicit conversions', detail: 'The to_i, to_f, and to_s methods move values between numbers and strings clearly.' },
                { term: 'Lenient parsing', detail: 'to_i stops at the first non-numeric character instead of raising an error.' },
                { term: 'Numeric iterators', detail: 'Methods like times, upto, and step let a number control repetition without a manual loop.' },
                { term: 'Rounding helpers', detail: 'floor and ceil move a float down or up to the nearest whole number.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 5. Arrays & Hashes
  {
    id: 'ruby-collections-section',
    title: 'Arrays & Hashes',
    level: 1,
    slug: 'collections',
    concepts: [],
    children: [
      {
        id: 'ruby-arrays',
        title: 'Arrays',
        level: 2,
        slug: 'arrays',
        concepts: [
          {
            id: 'ruby-arrays-intro',
            code: "nums = [1, 2, 3, 4]\nnums.first   # => 1\nnums.last    # => 4\nnums[-1]     # => 4 (negative index from end)\nnums << 5    # push, => [1, 2, 3, 4, 5]\nnums[1..2]   # => [2, 3] (slice)",
            note: 'Arrays are ordered, integer-indexed collections that can hold objects of any type. Negative indexes count back from the end, and ranges slice a sub-array. The `<<` operator is the idiomatic way to push onto the end.',
            explanation: {
              heading: 'Array basics',
              intro: 'Arrays are ordered collections indexed by integers that can hold any mix of objects, with convenient access from either end.',
              points: [
                { term: 'Negative indexing', detail: 'A negative index counts back from the end, so minus one is the last element.' },
                { term: 'Range slicing', detail: 'Passing a range returns a sub-array between the two positions.' },
                { term: 'Push operator', detail: 'The double less-than operator appends an element to the end idiomatically.' },
                { term: 'Mixed types allowed', detail: 'A single array may contain numbers, strings, and other objects together.' },
              ],
            },
            example: "words = %w[red green blue] # => ['red', 'green', 'blue']\nwords.include?('red')      # => true",
          },
          {
            id: 'ruby-array-methods',
            code: "[3, 1, 2].sort       # => [1, 2, 3]\n[1, 2, 2, 3].uniq    # => [1, 2, 3]\n[1, [2, [3]]].flatten # => [1, 2, 3]\n[1, 2, 3].sum        # => 6\n[1, 2, 3].reverse    # => [3, 2, 1]",
            note: 'Arrays offer expressive transformation methods that return new arrays: `sort`, `uniq`, `flatten`, `sum`, and `reverse` among many others. Bang versions like `sort!` mutate in place. Because these compose cleanly, complex data pipelines stay readable.',
            explanation: {
              heading: 'Transforming arrays',
              intro: 'Arrays include a wealth of expressive transformation methods that return new arrays, keeping data pipelines readable.',
              points: [
                { term: 'Return new arrays', detail: 'Methods like sort, uniq, and reverse leave the original untouched by default.' },
                { term: 'Bang variants mutate', detail: 'A trailing exclamation mark version such as sort with a bang changes the array in place.' },
                { term: 'Composable', detail: 'Because results are arrays, calls chain naturally into multi-step transformations.' },
                { term: 'flatten and sum', detail: 'flatten collapses nested arrays and sum aggregates numeric elements quickly.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'ruby-hashes',
        title: 'Hashes',
        level: 2,
        slug: 'hashes',
        concepts: [
          {
            id: 'ruby-hashes-intro',
            code: "person = { name: 'Ada', age: 36 }\nperson[:name]        # => 'Ada'\nperson[:email] = 'a@x.com' # add a key\nperson.fetch(:age)   # => 36\nperson.dig(:name)    # safe nested access",
            note: 'A hash maps keys to values, most often using symbol keys with the shorthand `{ name: value }` syntax. Access with `[]`, or use `fetch` to raise on a missing key and `dig` to walk nested structures safely. Hashes preserve insertion order in modern Ruby.',
            explanation: {
              heading: 'Hash basics',
              intro: 'A hash maps keys to values and commonly uses symbol keys with a compact literal syntax, while offering safe accessors for missing data.',
              points: [
                { term: 'Symbol key shorthand', detail: 'The name-colon-value form creates symbol keys without extra punctuation.' },
                { term: 'fetch is strict', detail: 'fetch raises when a key is missing, unlike bracket access which returns nil.' },
                { term: 'dig for nesting', detail: 'dig walks nested hashes and arrays, returning nil rather than erroring on a gap.' },
                { term: 'Insertion order kept', detail: 'Modern Ruby hashes preserve the order in which keys were added.' },
              ],
            },
            example: "counts = Hash.new(0)\n'aabbc'.each_char { |c| counts[c] += 1 }\ncounts # => {\"a\"=>2, \"b\"=>2, \"c\"=>1}",
          },
          {
            id: 'ruby-hash-iteration',
            code: "scores = { math: 90, art: 85 }\nscores.each do |subject, score|\n  puts \"#{subject}: #{score}\"\nend\n\nscores.map { |k, v| [k, v + 5] }.to_h",
            note: 'Iterating a hash yields both key and value to the block. Because hashes mix well with Enumerable, you can `map`, `select`, and `reduce` over pairs and rebuild a hash with `to_h`. This makes reshaping data expressive and immutable-friendly.',
            explanation: {
              heading: 'Iterating hashes',
              intro: 'Iterating a hash yields each key and value together, and because hashes include Enumerable you can transform pairs and rebuild a hash.',
              points: [
                { term: 'Key and value block', detail: 'each yields two block parameters, one for the key and one for the value.' },
                { term: 'Enumerable methods', detail: 'map, select, and reduce work over pairs just like they do for arrays.' },
                { term: 'Rebuild with to_h', detail: 'Calling to_h turns an array of key-value pairs back into a hash.' },
                { term: 'Immutable-friendly', detail: 'Transformations return new collections, keeping the original hash unchanged.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'ruby-ranges',
        title: 'Range Basics',
        level: 2,
        slug: 'range-basics',
        concepts: [
          {
            id: 'ruby-ranges-intro',
            code: "(1..5).to_a    # => [1, 2, 3, 4, 5] (inclusive)\n(1...5).to_a   # => [1, 2, 3, 4] (exclusive end)\n('a'..'e').to_a # => ['a', 'b', 'c', 'd', 'e']\n(1..10).step(2).to_a # => [1, 3, 5, 7, 9]",
            note: 'A range represents an interval between two values. Two dots `..` include the end, while three dots `...` exclude it. Ranges work with any comparable type, including characters, and support iteration, `step`, and membership tests.',
            explanation: {
              heading: 'Ranges',
              intro: 'A range models an interval between two comparable values and can be inclusive or exclusive of its endpoint.',
              points: [
                { term: 'Two dots include', detail: 'The two-dot form includes the end value in the range.' },
                { term: 'Three dots exclude', detail: 'The three-dot form stops just before the end value.' },
                { term: 'Works with characters', detail: 'Any comparable type, including letters, can define a range.' },
                { term: 'Endless ranges', detail: 'Omitting an endpoint creates an open-ended range useful for take-style operations.' },
              ],
            },
            example: "(1..100).include?(50) # => true\n(1..).first(3)        # => [1, 2, 3] endless range",
          },
        ],
        children: [],
      },
      {
        id: 'ruby-ranges-cases',
        title: 'Ranges in Conditions',
        level: 2,
        slug: 'range-conditions',
        concepts: [
          {
            id: 'ruby-ranges-case',
            code: "score = 82\ngrade = case score\n        when 90..100 then 'A'\n        when 80...90 then 'B'\n        when 70...80 then 'C'\n        else 'F'\n        end\ngrade # => 'B'",
            note: 'Ranges shine inside `case` statements because `when` uses the `===` operator, which for a range means "does this value fall inside?". This gives you clean bucketing logic without chained comparisons. Beginless and endless ranges like `..0` or `18..` are handy for open-ended bounds.',
            explanation: {
              heading: 'Ranges in case',
              intro: 'Ranges pair naturally with case expressions because the when clause uses the case-equality operator, which for a range tests membership.',
              points: [
                { term: 'Membership matching', detail: 'A when clause with a range matches when the value falls inside that range.' },
                { term: 'Clean bucketing', detail: 'Grading and tiering logic reads clearly without chained comparison operators.' },
                { term: 'Open-ended bounds', detail: 'Beginless and endless ranges express one-sided limits like at least eighteen.' },
                { term: 'then for one-liners', detail: 'The then keyword lets a when branch and its result share a single line.' },
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
    id: 'ruby-control-flow-section',
    title: 'Control Flow',
    level: 1,
    slug: 'control-flow',
    concepts: [],
    children: [
      {
        id: 'ruby-conditionals',
        title: 'Conditionals',
        level: 2,
        slug: 'conditionals',
        concepts: [
          {
            id: 'ruby-conditionals-intro',
            code: "puts 'go' if ready?          # modifier if\nputs 'wait' unless ready?    # unless = if not\n\nx = ready? ? 'yes' : 'no'    # ternary\n\nif score > 90\n  'A'\nelsif score > 80\n  'B'\nelse\n  'C'\nend",
            note: 'Ruby offers `if`, `elsif`, `else`, and the negated `unless`. Trailing modifiers such as `puts x if cond` read like English for one-line guards. The ternary operator `cond ? a : b` handles simple either/or expressions.',
            explanation: {
              heading: 'Conditionals',
              intro: 'Ruby offers the familiar if family plus a negated form and trailing modifiers that let simple conditions read like English.',
              points: [
                { term: 'unless is if-not', detail: 'unless runs its body when the condition is false, improving readability of negatives.' },
                { term: 'Trailing modifiers', detail: 'Appending if or unless to a statement makes concise one-line guards.' },
                { term: 'Ternary operator', detail: 'The question-mark colon form chooses between two values in a single expression.' },
                { term: 'elsif chains', detail: 'Multiple elsif branches handle several mutually exclusive conditions in order.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'ruby-loops',
        title: 'Loops',
        level: 2,
        slug: 'loops',
        concepts: [
          {
            id: 'ruby-loops-intro',
            code: "i = 0\nwhile i < 3\n  puts i\n  i += 1\nend\n\n3.times { |n| puts n }\n(1..3).each { |n| puts n }\nloop { break if done? }",
            note: 'Ruby has `while` and `until` loops, but idiomatic code usually prefers iterators like `times` and `each`. `loop` runs forever until you `break`. Inside any loop, `next` skips to the next iteration and `break` exits early.',
            explanation: {
              heading: 'Looping',
              intro: 'Ruby provides traditional while and until loops, but idiomatic code usually reaches for iterator methods that read more clearly.',
              points: [
                { term: 'Prefer iterators', detail: 'Methods like times and each express intent better than manual counter loops.' },
                { term: 'loop with break', detail: 'The loop method repeats indefinitely until a break statement exits it.' },
                { term: 'next and break', detail: 'next skips to the following iteration while break leaves the loop entirely.' },
                { term: 'until inverts while', detail: 'until repeats as long as its condition stays false.' },
              ],
            },
            example: "5.downto(1) { |n| print n } # => 54321",
          },
        ],
        children: [],
      },
    ],
  },

  // 8. Methods & Arguments
  {
    id: 'ruby-methods-section',
    title: 'Methods & Arguments',
    level: 1,
    slug: 'methods',
    concepts: [],
    children: [
      {
        id: 'ruby-method-basics',
        title: 'Defining Methods',
        level: 2,
        slug: 'method-basics',
        concepts: [
          {
            id: 'ruby-methods-intro',
            code: "def greet(name)\n  \"Hello, #{name}!\"\nend\n\ndef add(a, b) = a + b # endless method (Ruby 3.0+)\n\ngreet('Ada') # => 'Hello, Ada!'\nadd(2, 3)    # => 5",
            note: 'Methods are defined with `def` and implicitly return their last expression, so `return` is optional. Ruby 3.0 introduced endless method definitions using `=` for one-liners. Method names may end in `?` for predicates or `!` for mutating or risky variants by convention.',
            explanation: {
              heading: 'Defining methods',
              intro: 'Methods are defined with the def keyword and return their last expression automatically, and naming conventions signal a method\'s role.',
              points: [
                { term: 'Implicit return', detail: 'The value of the final expression is returned, so an explicit return is optional.' },
                { term: 'Endless methods', detail: 'A one-line definition using an equals sign was added in Ruby three point zero.' },
                { term: 'Predicate names', detail: 'A trailing question mark by convention marks methods that return a boolean.' },
                { term: 'Bang names', detail: 'A trailing exclamation mark warns that a method mutates or is otherwise risky.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'ruby-arguments',
        title: 'Argument Types',
        level: 2,
        slug: 'arguments',
        concepts: [
          {
            id: 'ruby-args-intro',
            code: "def build(name, role = 'guest', *tags, age:, **opts)\n  { name: name, role: role, tags: tags, age: age, opts: opts }\nend\n\nbuild('Ada', 'admin', 'a', 'b', age: 36, city: 'NY')",
            note: 'Ruby supports positional args, default values, a splat `*args` that gathers extra positional arguments into an array, required and optional keyword arguments, and a double splat `**opts` that collects extra keywords into a hash. Keyword arguments make call sites self-documenting. This flexibility lets one method handle many shapes of input.',
            explanation: {
              heading: 'Argument flexibility',
              intro: 'Ruby methods support several parameter kinds so one signature can accept positional, optional, variadic, and keyword arguments together.',
              points: [
                { term: 'Splat gathers positionals', detail: 'A single-star parameter collects extra positional arguments into an array.' },
                { term: 'Double splat gathers keywords', detail: 'A double-star parameter collects extra keyword arguments into a hash.' },
                { term: 'Keyword arguments', detail: 'Named parameters make call sites self-documenting and order-independent.' },
                { term: 'Defaults', detail: 'A default value makes a parameter optional when the caller omits it.' },
              ],
            },
            example: "def sum(*nums) = nums.sum\nsum(1, 2, 3) # => 6",
          },
        ],
        children: [],
      },
    ],
  },

  // 9. Blocks, Procs & Lambdas
  {
    id: 'ruby-blocks-section',
    title: 'Blocks, Procs & Lambdas',
    level: 1,
    slug: 'blocks',
    concepts: [],
    children: [
      {
        id: 'ruby-blocks',
        title: 'Blocks & yield',
        level: 2,
        slug: 'block-basics',
        concepts: [
          {
            id: 'ruby-blocks-intro',
            code: "[1, 2, 3].each { |n| puts n }\n\n[1, 2, 3].each do |n|\n  puts n * 2\nend\n\ndef run\n  yield 10 if block_given?\nend\nrun { |x| puts x } # => 10",
            note: 'A block is an anonymous chunk of code passed to a method, written with braces `{}` for one-liners or `do...end` for multi-line bodies. Inside a method you invoke the block with `yield`, and `block_given?` checks whether one was supplied. Blocks are the heart of idiomatic Ruby iteration.',
            explanation: {
              heading: 'Blocks and yield',
              intro: 'A block is an anonymous piece of code passed to a method, and the method runs it with yield, forming the basis of Ruby iteration.',
              points: [
                { term: 'Braces or do-end', detail: 'Use braces for short blocks and the do-end form for multi-line bodies.' },
                { term: 'yield runs it', detail: 'Inside a method, yield invokes the attached block, optionally passing arguments.' },
                { term: 'block_given query', detail: 'The block-given query method checks whether a block was supplied before yielding.' },
                { term: 'Core to iteration', detail: 'Most collection methods accept a block to describe what to do with each element.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'ruby-procs-lambdas',
        title: 'Procs & Lambdas',
        level: 2,
        slug: 'procs-lambdas',
        concepts: [
          {
            id: 'ruby-procs-intro',
            code: "square = ->(x) { x ** 2 } # lambda\nsquare.call(4)  # => 16\nsquare.(4)      # => 16\nsquare[4]       # => 16\n\ndouble = proc { |x| x * 2 }\ndouble.call(5)  # => 10",
            note: 'Procs and lambdas are block objects you can store in variables and pass around. Lambdas (the `->` arrow syntax) check argument count strictly and return only from themselves, while procs are lenient and return from the enclosing method. Call them with `call`, `.()`, or `[]`.',
            explanation: {
              heading: 'Procs and lambdas',
              intro: 'Procs and lambdas turn blocks into objects you can store and pass around, and they differ in how strictly they treat arguments and return.',
              points: [
                { term: 'Lambda arity strict', detail: 'A lambda checks argument count and raises when the number is wrong.' },
                { term: 'Return behavior differs', detail: 'A lambda returns from itself while a proc returns from the enclosing method.' },
                { term: 'Arrow syntax', detail: 'The arrow form is the common way to write a lambda in modern Ruby.' },
                { term: 'Multiple call forms', detail: 'You can invoke them with call, the dot-parenthesis form, or square brackets.' },
              ],
            },
            example: "def apply(x, &fn) = fn.call(x)\napply(3) { |n| n + 1 } # => 4",
          },
        ],
        children: [],
      },
      {
        id: 'ruby-closures',
        title: 'Closures',
        level: 2,
        slug: 'closures',
        concepts: [
          {
            id: 'ruby-closures-intro',
            code: "def counter\n  count = 0\n  -> { count += 1 }\nend\n\ntick = counter\ntick.call # => 1\ntick.call # => 2\ntick.call # => 3",
            note: 'Blocks, procs, and lambdas are closures: they capture the local variables from the scope where they were defined and keep them alive. In the example, each returned lambda remembers its own `count` even after `counter` has finished. This is a powerful way to build stateful, encapsulated behavior.',
            explanation: {
              heading: 'Closures',
              intro: 'Blocks, procs, and lambdas are closures, meaning they capture the local variables from where they were created and keep those alive.',
              points: [
                { term: 'Captures environment', detail: 'A closure remembers the surrounding variables even after that scope has ended.' },
                { term: 'Independent state', detail: 'Each closure instance holds its own copy of the captured variables.' },
                { term: 'Encapsulation', detail: 'Closures let you build small stateful objects without a full class.' },
                { term: 'Live references', detail: 'Captured variables are shared by reference, so updates persist between calls.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 10. Iterators & Enumerable
  {
    id: 'ruby-enumerable-section',
    title: 'Iterators & Enumerable',
    level: 1,
    slug: 'enumerable',
    concepts: [],
    children: [
      {
        id: 'ruby-core-iterators',
        title: 'map, select & reduce',
        level: 2,
        slug: 'core-iterators',
        concepts: [
          {
            id: 'ruby-iterators-intro',
            code: "[1, 2, 3, 4].map { |n| n * 2 }      # => [2, 4, 6, 8]\n[1, 2, 3, 4].select { |n| n.even? } # => [2, 4]\n[1, 2, 3, 4].reject { |n| n.even? } # => [1, 3]\n[1, 2, 3, 4].reduce(0) { |sum, n| sum + n } # => 10",
            note: 'These Enumerable methods replace most manual loops. `map` transforms each element, `select`/`reject` filter by a condition, and `reduce` (aka `inject`) folds a collection down to a single value. They return new collections and read like a description of intent.',
            explanation: {
              heading: 'map, select, reduce',
              intro: 'These Enumerable methods replace most manual loops by expressing transformation, filtering, and aggregation as clear intent.',
              points: [
                { term: 'map transforms', detail: 'map applies the block to each element and returns a new array of results.' },
                { term: 'select and reject filter', detail: 'select keeps matching elements while reject removes them by the block condition.' },
                { term: 'reduce folds', detail: 'reduce combines all elements into a single accumulated value.' },
                { term: 'Return new collections', detail: 'These methods do not mutate the source, keeping data flow predictable.' },
              ],
            },
            example: "%w[a bb ccc].map(&:length) # => [1, 2, 3]",
          },
          {
            id: 'ruby-symbol-shorthand',
            code: "['a', 'b', 'c'].map(&:upcase) # => ['A', 'B', 'C']\n[1, -2, 3].select(&:positive?) # => [1, 3]\n\n# equivalent long form:\n['a', 'b'].map { |s| s.upcase }",
            note: 'The `&:symbol` shorthand converts a symbol into a block that calls that method on each element, so `map(&:upcase)` means `map { |x| x.upcase }`. It keeps simple one-method transformations tidy. Under the hood, `&` calls `to_proc` on the symbol.',
            explanation: {
              heading: 'Symbol-to-proc',
              intro: 'The ampersand-symbol shorthand converts a symbol into a block that calls that method on each element, keeping one-method transformations tidy.',
              points: [
                { term: 'Ampersand symbol', detail: 'The form calling upcase on each item is shorthand for a block invoking that method.' },
                { term: 'Uses to_proc', detail: 'The ampersand calls the to_proc method on the symbol to build the block.' },
                { term: 'Best for single calls', detail: 'It works only when the block simply calls one method with no arguments.' },
                { term: 'Cleaner pipelines', detail: 'It removes block boilerplate from common map and select chains.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'ruby-enumerable-extras',
        title: 'More Enumerable Power',
        level: 2,
        slug: 'enumerable-extras',
        concepts: [
          {
            id: 'ruby-enumerable-extras-intro',
            code: "(1..6).group_by(&:even?)   # => {false=>[1,3,5], true=>[2,4,6]}\n[1, 2, 3].each_with_index.map { |n, i| [i, n] }\n%w[a b c].each_with_object({}) { |x, h| h[x] = x.upcase }\n[3, 1, 2].min_by { |n| -n } # => 3",
            note: 'Beyond the core trio, Enumerable offers `group_by`, `each_with_index`, `each_with_object`, `min_by`/`max_by`, `partition`, and more. Any class that defines `each` and includes Enumerable gains all of these for free. This shared interface is why Ruby collections feel so consistent.',
            explanation: {
              heading: 'More Enumerable',
              intro: 'Beyond the core trio, Enumerable adds many grouping and aggregating methods that any class defining each can inherit.',
              points: [
                { term: 'group_by', detail: 'group_by buckets elements into a hash keyed by the block result.' },
                { term: 'each_with_object', detail: 'This builds up a mutable accumulator such as a hash while iterating.' },
                { term: 'min_by and max_by', detail: 'These select the element with the smallest or largest computed value.' },
                { term: 'Shared interface', detail: 'Defining each and including Enumerable grants all these methods for free.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 11. Object-Oriented Ruby
  {
    id: 'ruby-oop',
    title: 'Object-Oriented Ruby',
    level: 1,
    slug: 'oop',
    concepts: [],
    children: [
      {
        id: 'ruby-classes',
        title: 'Classes & Objects',
        level: 2,
        slug: 'classes',
        concepts: [
          {
            id: 'ruby-classes-intro',
            code: "class Animal\n  def initialize(name)\n    @name = name\n  end\n\n  def speak\n    raise NotImplementedError, 'subclass must define speak'\n  end\nend\n\nAnimal.new('Rex')",
            note: 'A class is a blueprint for objects. The `initialize` method is the constructor, called automatically by `new`, and instance variables like `@name` hold per-object state. Ruby classes are open, meaning you can reopen and add methods to them later.',
            explanation: {
              heading: 'Classes and objects',
              intro: 'A class is a blueprint for objects; the initialize method sets up per-object state and Ruby classes stay open for later extension.',
              points: [
                { term: 'initialize is the constructor', detail: 'Calling new allocates an object and runs initialize automatically.' },
                { term: 'Instance variables', detail: 'Names starting with an at sign store state unique to each object.' },
                { term: 'Open classes', detail: 'You can reopen an existing class later to add or change methods.' },
                { term: 'NotImplementedError', detail: 'Raising it signals that a subclass is expected to provide the method.' },
              ],
            },
          },
          {
            id: 'ruby-inheritance',
            code: "class Dog < Animal\n  def speak\n    \"#{@name} says Woof\"\n  end\nend\n\nDog.new('Rex').speak # => 'Rex says Woof'\nDog.ancestors        # => [Dog, Animal, Object, ...]",
            note: 'Ruby supports single inheritance with the `<` syntax, and a subclass overrides methods simply by redefining them. Call `super` to invoke the parent version. The `ancestors` chain shows the exact order Ruby searches for a method.',
            explanation: {
              heading: 'Inheritance',
              intro: 'Ruby uses single inheritance where a subclass extends one parent and can override methods, calling the parent version with super.',
              points: [
                { term: 'Less-than syntax', detail: 'The less-than symbol declares that a class inherits from a parent.' },
                { term: 'Override by redefining', detail: 'A subclass replaces a method simply by defining one with the same name.' },
                { term: 'super calls parent', detail: 'The super keyword invokes the overridden method in the parent class.' },
                { term: 'ancestors chain', detail: 'The ancestors list shows the exact order Ruby searches for a method.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'ruby-modules-mixins',
        title: 'Modules & Mixins',
        level: 2,
        slug: 'modules-mixins',
        concepts: [
          {
            id: 'ruby-mixins-intro',
            code: "module Walkable\n  def walk\n    \"#{name} is walking\"\n  end\nend\n\nclass Person\n  include Walkable\n  attr_reader :name\n  def initialize(name) = @name = name\nend\n\nPerson.new('Ada').walk",
            note: 'Modules are collections of methods that cannot be instantiated on their own. Mixing one into a class with `include` shares its instance methods, giving Ruby the benefits of multiple inheritance without the pitfalls. `extend` adds a module\'s methods at the class/object level instead.',
            explanation: {
              heading: 'Modules and mixins',
              intro: 'Modules bundle methods that cannot be instantiated alone; mixing one into a class shares behavior, giving multiple-inheritance benefits safely.',
              points: [
                { term: 'include adds instance methods', detail: 'include makes a module\'s methods available to instances of the class.' },
                { term: 'extend adds to the object', detail: 'extend adds a module\'s methods at the class or single-object level instead.' },
                { term: 'Avoids diamond problems', detail: 'Mixins reuse behavior without the pitfalls of full multiple inheritance.' },
                { term: 'Namespacing too', detail: 'Modules also group related constants and classes under a common name.' },
              ],
            },
            example: "module Greet; def hi = 'hi'; end\nobj = Object.new\nobj.extend(Greet)\nobj.hi # => 'hi'",
          },
        ],
        children: [],
      },
      {
        id: 'ruby-duck-typing',
        title: 'Duck Typing',
        level: 2,
        slug: 'duck-typing',
        concepts: [
          {
            id: 'ruby-duck-intro',
            code: "def make_sound(thing)\n  thing.quack # works for anything that responds to quack\nend\n\nclass Duck; def quack = 'Quack!'; end\nclass Toy; def quack = 'Squeak!'; end\n\nmake_sound(Duck.new) # => 'Quack!'\nmake_sound(Toy.new)  # => 'Squeak!'",
            note: 'Duck typing means Ruby cares about what an object can do, not what class it is: "if it walks like a duck and quacks like a duck, treat it as a duck." Code stays flexible because any object responding to the needed methods works. Use `respond_to?` when you want to check capability before calling.',
            explanation: {
              heading: 'Duck typing',
              intro: 'Ruby cares about what an object can do rather than its class, so any object responding to the needed methods can be used interchangeably.',
              points: [
                { term: 'Behavior over class', detail: 'If an object responds to the method you call, its concrete type does not matter.' },
                { term: 'Flexible interfaces', detail: 'Code stays open to new types without changing existing method signatures.' },
                { term: 'respond_to query', detail: 'The respond-to query method checks a capability before you invoke it.' },
                { term: 'No explicit interfaces', detail: 'Ruby has no formal interface keyword; convention and method presence suffice.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 12. Accessors & Metaprogramming
  {
    id: 'ruby-metaprogramming-section',
    title: 'Accessors & Metaprogramming',
    level: 1,
    slug: 'metaprogramming',
    concepts: [],
    children: [
      {
        id: 'ruby-attr-accessor',
        title: 'attr_accessor & Friends',
        level: 2,
        slug: 'attr-accessor',
        concepts: [
          {
            id: 'ruby-attr-intro',
            code: "class User\n  attr_accessor :name  # read + write\n  attr_reader :id      # read only\n\n  def initialize(id, name)\n    @id = id\n    @name = name\n  end\nend\n\nu = User.new(1, 'Ada')\nu.name = 'Grace'\nu.name # => 'Grace'",
            note: 'Writing getter and setter methods by hand is tedious, so Ruby provides `attr_reader`, `attr_writer`, and `attr_accessor` to generate them from symbol names. `attr_accessor :name` creates both `name` and `name=`. These are themselves methods that define methods — your first taste of metaprogramming.',
            explanation: {
              heading: 'Accessor macros',
              intro: 'Ruby generates getter and setter methods from symbol names so you avoid writing repetitive accessor code by hand.',
              points: [
                { term: 'attr_reader', detail: 'It creates a getter method that returns the matching instance variable.' },
                { term: 'attr_writer', detail: 'It creates a setter method that assigns the matching instance variable.' },
                { term: 'attr_accessor', detail: 'It creates both a getter and a setter in one declaration.' },
                { term: 'Metaprogramming preview', detail: 'These are methods that define methods, an early taste of Ruby metaprogramming.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'ruby-dynamic-methods',
        title: 'define_method & method_missing',
        level: 2,
        slug: 'dynamic-methods',
        concepts: [
          {
            id: 'ruby-define-method',
            code: "class Report\n  %i[pdf csv html].each do |fmt|\n    define_method(\"to_#{fmt}\") do\n      \"exporting as #{fmt}\"\n    end\n  end\nend\n\nReport.new.to_csv # => 'exporting as csv'",
            note: '`define_method` creates methods at runtime from data, so you can generate a family of similar methods in a loop instead of copy-pasting. The block becomes the method body and closes over surrounding variables. This keeps repetitive interfaces DRY and data-driven.',
            explanation: {
              heading: 'define_method',
              intro: 'The define_method call creates methods at runtime from data, letting you generate a family of similar methods in a loop instead of repeating code.',
              points: [
                { term: 'Runtime definition', detail: 'Methods are built while the program runs rather than written out statically.' },
                { term: 'Block becomes body', detail: 'The block passed to define_method serves as the new method\'s implementation.' },
                { term: 'Closes over variables', detail: 'The generated method can capture surrounding loop variables like a format name.' },
                { term: 'Keeps code DRY', detail: 'Data-driven definitions remove repetitive near-identical method declarations.' },
              ],
            },
          },
          {
            id: 'ruby-method-missing',
            code: "class Config\n  def initialize = @data = {}\n\n  def method_missing(name, *args)\n    key = name.to_s.chomp('=')\n    name.to_s.end_with?('=') ? @data[key] = args.first : @data[key]\n  end\n\n  def respond_to_missing?(*) = true\nend\n\nc = Config.new\nc.timeout = 30\nc.timeout # => 30",
            note: 'When you call a method that does not exist, Ruby invokes `method_missing` with the name and arguments, letting you handle unknown calls dynamically. It powers flexible APIs like dynamic finders and configuration objects. Always pair it with `respond_to_missing?` so reflection and `respond_to?` stay accurate.',
            explanation: {
              heading: 'method_missing',
              intro: 'When a called method does not exist, Ruby invokes method_missing with the name and arguments, allowing dynamic handling of unknown calls.',
              points: [
                { term: 'Catches unknown calls', detail: 'It receives the method name as a symbol plus any arguments that were passed.' },
                { term: 'Powers dynamic APIs', detail: 'Dynamic finders and flexible configuration objects rely on this hook.' },
                { term: 'Pair with respond_to_missing', detail: 'Overriding the respond-to-missing query keeps reflection and respond-to accurate.' },
                { term: 'Use sparingly', detail: 'It can hide typos and slow method lookup, so prefer explicit methods when practical.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 13. Exceptions
  {
    id: 'ruby-exceptions-section',
    title: 'Exceptions',
    level: 1,
    slug: 'exceptions',
    concepts: [],
    children: [
      {
        id: 'ruby-exceptions',
        title: 'Raising & Rescuing',
        level: 2,
        slug: 'raise-rescue',
        concepts: [
          {
            id: 'ruby-exceptions-intro',
            code: "begin\n  raise ArgumentError, 'bad input' if x.nil?\n  risky_operation\nrescue ArgumentError => e\n  puts \"Caught: #{e.message}\"\nrescue StandardError => e\n  puts 'something else went wrong'\nensure\n  puts 'always runs'\nend",
            note: 'Use `raise` to signal an error and `begin/rescue/end` to handle it. You can rescue specific classes; a bare `rescue` catches `StandardError`, which is what most application errors inherit from. The optional `ensure` block always runs, making it perfect for cleanup like closing files.',
            explanation: {
              heading: 'Raise and rescue',
              intro: 'Ruby signals errors with raise and handles them in a begin-rescue block, with an optional ensure section that always runs for cleanup.',
              points: [
                { term: 'Rescue by type', detail: 'You can rescue specific exception classes, listing the most specific first.' },
                { term: 'StandardError default', detail: 'A bare rescue catches StandardError, the parent of most application errors.' },
                { term: 'ensure for cleanup', detail: 'The ensure block runs whether or not an exception occurred, ideal for closing resources.' },
                { term: 'Method-level rescue', detail: 'A method body can use rescue directly without an explicit begin.' },
              ],
            },
            example: "def divide(a, b)\n  a / b\nrescue ZeroDivisionError\n  Float::INFINITY\nend",
          },
          {
            id: 'ruby-custom-exceptions',
            code: "class PaymentError < StandardError; end\n\nclass InsufficientFunds < PaymentError\n  def initialize(msg = 'not enough money')\n    super\n  end\nend\n\nraise InsufficientFunds",
            note: 'Define your own exceptions by subclassing `StandardError` (not `Exception`, which also traps system-level signals). Custom hierarchies let callers rescue at the granularity they need. Overriding `initialize` can supply a sensible default message via `super`.',
            explanation: {
              heading: 'Custom exceptions',
              intro: 'Define your own error types by subclassing StandardError so callers can rescue exactly the failures they know how to handle.',
              points: [
                { term: 'Subclass StandardError', detail: 'Inherit from StandardError rather than Exception, which also traps system signals.' },
                { term: 'Meaningful hierarchies', detail: 'A tree of related errors lets callers rescue at a broad or narrow level.' },
                { term: 'Default messages', detail: 'Overriding initialize and calling super can supply a sensible default message.' },
                { term: 'Self-documenting', detail: 'Named exception types communicate intent better than a generic error.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 14. Pattern Matching, Regex & I/O
  {
    id: 'ruby-advanced-section',
    title: 'Pattern Matching, Regex & I/O',
    level: 1,
    slug: 'advanced',
    concepts: [],
    children: [
      {
        id: 'ruby-pattern-matching',
        title: 'Pattern Matching (case/in)',
        level: 2,
        slug: 'pattern-matching',
        concepts: [
          {
            id: 'ruby-pattern-intro',
            code: "config = { name: 'Ada', role: :admin }\n\ncase config\nin { role: :admin, name: String => n }\n  puts \"Admin #{n}\"\nin { role: :guest }\n  puts 'Guest access'\nelse\n  puts 'Unknown'\nend",
            note: 'Ruby 3.x offers structural pattern matching with `case/in`. Patterns can destructure arrays and hashes, bind matched pieces to variables (`String => n`), and check types all at once. It is a concise, readable way to branch on the shape of complex data.',
            explanation: {
              heading: 'Pattern matching',
              intro: 'Ruby 3 offers structural pattern matching with case and in that can destructure arrays and hashes, bind pieces to variables, and check types at once.',
              points: [
                { term: 'case with in', detail: 'Each in clause describes a shape that the subject value is tested against.' },
                { term: 'Destructuring', detail: 'Matched arrays and hashes can extract their parts into local variables.' },
                { term: 'Type checks', detail: 'A pattern can require a value to be a certain class while binding it.' },
                { term: 'Concise branching', detail: 'It expresses complex data-shape decisions far more clearly than nested ifs.' },
              ],
            },
            example: "case [1, 2, 3]\nin [first, *rest]\n  first # => 1, rest => [2, 3]\nend",
          },
        ],
        children: [],
      },
      {
        id: 'ruby-regex',
        title: 'Regular Expressions',
        level: 2,
        slug: 'regex',
        concepts: [
          {
            id: 'ruby-regex-intro',
            code: "'hello@example.com' =~ /\\A[\\w.]+@[\\w.]+\\z/ # => 0 (match at index 0)\n\nif 'order-42' =~ /order-(\\d+)/\n  $1 # => '42' (first capture group)\nend\n\n'2024-01-15'.match?(/\\d{4}-\\d{2}-\\d{2}/) # => true",
            note: 'Regex literals sit between forward slashes `/.../`. The `=~` operator returns the match index or nil, `match?` returns a boolean, and captured groups are available via `$1`, `$2`, or named captures. Combine with `scan`, `gsub`, and `split` for powerful text processing.',
            explanation: {
              heading: 'Regular expressions',
              intro: 'Ruby has built-in regular expression literals written between slashes, with operators and match objects for testing and extracting text.',
              points: [
                { term: 'Slash literals', detail: 'A pattern between forward slashes creates a Regexp object directly.' },
                { term: 'Match operator', detail: 'The match operator returns the index of a match or nil when none is found.' },
                { term: 'Capture groups', detail: 'Parentheses capture parts of the match for later extraction, including named groups.' },
                { term: 'scan and gsub', detail: 'scan collects all matches and gsub replaces them, both accepting patterns.' },
              ],
            },
            example: "'a1b2c3'.scan(/\\d/) # => ['1', '2', '3']",
          },
        ],
        children: [],
      },
      {
        id: 'ruby-file-io',
        title: 'File I/O',
        level: 2,
        slug: 'file-io',
        concepts: [
          {
            id: 'ruby-file-intro',
            code: "File.write('notes.txt', \"line 1\\nline 2\\n\")\n\ntext = File.read('notes.txt')\n\nFile.foreach('notes.txt') do |line|\n  puts line.chomp\nend\n\nFile.open('log.txt', 'a') { |f| f.puts 'entry' }",
            note: 'The File class reads and writes files simply: `File.read` slurps the whole file, `File.write` replaces its contents, and `File.foreach` streams line by line without loading everything into memory. Passing a block to `File.open` guarantees the file is closed automatically when the block ends. Use mode `\'a\'` to append rather than overwrite.',
            explanation: {
              heading: 'File I/O',
              intro: 'Ruby reads and writes files through the File class, and passing a block ensures the file is closed automatically when the block ends.',
              points: [
                { term: 'Block auto-closes', detail: 'File.open with a block closes the handle even if an exception occurs.' },
                { term: 'Read helpers', detail: 'Methods like read and readlines pull the whole file or its lines at once.' },
                { term: 'Modes', detail: 'A mode string such as read, write, or append controls how the file opens.' },
                { term: 'each_line streams', detail: 'Iterating line by line avoids loading a huge file entirely into memory.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 15. Gems & Bundler
  {
    id: 'ruby-ecosystem-section',
    title: 'Gems & Bundler',
    level: 1,
    slug: 'ecosystem',
    concepts: [],
    children: [
      {
        id: 'ruby-gems',
        title: 'Using Gems',
        level: 2,
        slug: 'gems',
        concepts: [
          {
            id: 'ruby-gems-intro',
            code: "# install a gem from the command line\n# $ gem install httparty\n\nrequire 'httparty'\nrequire 'json'\n\ndata = JSON.parse('{\"ok\": true}')\ndata['ok'] # => true",
            note: 'A gem is a packaged Ruby library distributed through rubygems.org and installed with `gem install`. Once installed, load it into your program with `require`. The standard library ships many useful modules like `json` and `set` that need only a `require`, no install.',
            explanation: {
              heading: 'Gems',
              intro: 'A gem is a packaged Ruby library distributed through RubyGems, installed with the gem command and loaded with require.',
              points: [
                { term: 'RubyGems registry', detail: 'Gems are published to and fetched from the central RubyGems repository.' },
                { term: 'gem install', detail: 'The gem command downloads and installs a library and its dependencies.' },
                { term: 'require to load', detail: 'You bring an installed gem into your program with a require statement.' },
                { term: 'Semantic versions', detail: 'Gems use version numbers so you can depend on compatible releases.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'ruby-bundler',
        title: 'Bundler & Gemfile',
        level: 2,
        slug: 'bundler',
        concepts: [
          {
            id: 'ruby-bundler-intro',
            code: "# Gemfile\nsource 'https://rubygems.org'\n\ngem 'sinatra', '~> 3.0'\ngem 'rspec', group: :test\n\n# then run:\n# $ bundle install\n# $ bundle exec ruby app.rb",
            note: 'Bundler manages a project\'s dependencies through a `Gemfile`, where you list each gem and optional version constraints like `~> 3.0`. Running `bundle install` resolves compatible versions and records exact ones in `Gemfile.lock` for reproducible setups. Prefix commands with `bundle exec` to run them against the locked gem versions.',
            explanation: {
              heading: 'Bundler',
              intro: 'Bundler manages a project\'s gem dependencies through a Gemfile and lockfile, ensuring every environment uses the same versions.',
              points: [
                { term: 'Gemfile declares deps', detail: 'You list required gems and version constraints in the project Gemfile.' },
                { term: 'Lockfile pins versions', detail: 'The generated lock file records the exact resolved versions for reproducibility.' },
                { term: 'bundle install', detail: 'Running bundle install fetches and locks all declared dependencies.' },
                { term: 'bundle exec', detail: 'Prefixing a command with bundle exec runs it against the locked gem set.' },
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
