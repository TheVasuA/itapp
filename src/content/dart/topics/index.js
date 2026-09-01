// Dart topic tree.
//
// Each node is a ConceptNode: { id, title, level, slug, concepts[], children[] }.
// Routable nodes carry a `slug`. Every Concept renders in the fixed order
// code -> note -> example (example optional).

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  // 1. Getting Started
  {
    id: "dart-getting-started",
    title: "Getting Started",
    level: 1,
    slug: "getting-started",
    concepts: [],
    children: [
      {
        id: "dart-hello-world",
        title: "Your First Program",
        level: 2,
        slug: "hello-world",
        concepts: [
          {
            id: "dart-hello-main",
            code: "void main() {\n  print('Hello, world!');\n}",
            note: "Every Dart program starts at the top-level `main` function. `print` writes a line to the console. Dart files end in `.dart`, and statements are terminated with a semicolon.",
            explanation: {
              heading: 'The entry point',
              intro: 'Every Dart program begins execution at a single top-level function named main, which the runtime calls automatically. Code outside a function does not run on its own, so main is where you wire everything together.',
              points: [
                { term: 'main is required', detail: 'The runtime looks for a function named main and refuses to start without one.' },
                { term: 'void return', detail: 'main usually returns void because its result is not used by the runtime.' },
                { term: 'print for output', detail: 'The built-in print function writes a value followed by a newline to standard output.' },
                { term: 'semicolons matter', detail: 'Each statement ends with a semicolon, and forgetting one is a common compile error.' },
              ],
            },
            example: "// main can also accept command-line arguments:\nvoid main(List<String> args) {\n  print('You passed \${args.length} args');\n}",
          },
          {
            id: "dart-run-compile",
            code: "dart run hello.dart          // run directly with the VM\ndart compile exe hello.dart  // produce a native executable\ndart compile js web.dart     // compile to JavaScript",
            note: "The `dart` CLI runs a file on the Dart VM, compiles it to a self-contained native binary, or transpiles it to JavaScript for the web. This flexibility is why Dart powers Flutter apps on mobile, desktop, and browser from one codebase.",
            explanation: {
              heading: 'One language, many targets',
              intro: 'The dart command line tool can run code directly on a virtual machine for fast iteration, or compile it ahead of time into a standalone native executable or JavaScript. This is what lets a single Dart codebase target servers, desktops, and browsers.',
              points: [
                { term: 'dart run', detail: 'Executes a file immediately on the VM, ideal during development for quick feedback.' },
                { term: 'compile exe', detail: 'Produces a self-contained native binary that starts fast and needs no separate runtime.' },
                { term: 'compile js', detail: 'Transpiles Dart to JavaScript so the same logic can run in a web browser.' },
                { term: 'JIT versus AOT', detail: 'The VM uses just in time compilation for speed while native builds use ahead of time compilation for startup and size.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: "dart-comments-print",
        title: "Comments & Output",
        level: 2,
        slug: "comments-output",
        concepts: [
          {
            id: "dart-comments",
            code: "// single-line comment\n/* block comment */\n/// Doc comment used by dartdoc to describe the next declaration.\nvoid greet() {}",
            note: "Dart supports single-line `//`, block `/* */`, and documentation `///` comments. Doc comments attach to the following declaration and are picked up by tooling to generate API reference pages.",
            explanation: {
              heading: 'Three kinds of comments',
              intro: 'Dart offers ordinary comments for notes to yourself and special documentation comments that tooling understands. Choosing the right kind keeps code readable and produces API docs automatically.',
              points: [
                { term: 'Line comments', detail: 'Two forward slashes start a comment that runs to the end of the line.' },
                { term: 'Block comments', detail: 'Slash star and star slash wrap a comment that can span multiple lines.' },
                { term: 'Doc comments', detail: 'Three forward slashes describe the declaration that follows and feed the dartdoc generator.' },
                { term: 'Markdown support', detail: 'Doc comments accept markdown and square bracket references to link to other symbols.' },
              ],
            },
          },
          {
            id: "dart-string-interpolation",
            code: "var name = 'Ada';\nvar age = 36;\nprint('Name: \$name, next year: \${age + 1}');",
            note: "String interpolation embeds values with `\$name` for a simple variable and `\${expression}` for anything more complex. It is clearer and less error-prone than manual concatenation with `+`.",
            explanation: {
              heading: 'Building strings from values',
              intro: 'Interpolation inserts the value of an expression into a string literal, calling toString on it automatically. It reads better and avoids the awkward spacing mistakes common with plus based concatenation.',
              points: [
                { term: 'Simple form', detail: 'A dollar sign followed by an identifier inserts that single variable directly.' },
                { term: 'Expression form', detail: 'A dollar sign with braces evaluates any expression inside, such as arithmetic or method calls.' },
                { term: 'Automatic toString', detail: 'Each interpolated value has its toString method called so you rarely convert manually.' },
                { term: 'Prefer over plus', detail: 'Interpolation is clearer than joining pieces with the plus operator and avoids missing spaces.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 2. Variables & Null Safety
  {
    id: "dart-variables",
    title: "Variables & Null Safety",
    level: 1,
    slug: "variables",
    concepts: [],
    children: [
      {
        id: "dart-declaring-variables",
        title: "Declaring Variables",
        level: 2,
        slug: "declaring",
        concepts: [
          {
            id: "dart-var-final-const",
            code: "var count = 10;        // type inferred as int\nString label = 'ok';   // explicit type\nfinal now = DateTime.now(); // set once at runtime\nconst pi = 3.14159;    // compile-time constant",
            note: "`var` lets Dart infer the type from the initializer, while an explicit type is always allowed. `final` allows a single assignment computed at runtime, and `const` is for values fully known at compile time. Prefer `final` and `const` for values that never change.",
            explanation: {
              heading: 'var, final, and const',
              intro: 'Dart lets you infer a type with var, lock a value after one assignment with final, or freeze it at compile time with const. Reaching for final and const by default makes intent clear and prevents accidental reassignment.',
              points: [
                { term: 'var infers', detail: 'The compiler picks the type from the initializer, and that type is then fixed.' },
                { term: 'final is runtime', detail: 'A final variable is assigned exactly once but its value can be computed while the program runs.' },
                { term: 'const is compile time', detail: 'A const value must be fully known during compilation and is canonicalized for reuse.' },
                { term: 'Prefer immutability', detail: 'Favor final and const so values that never change cannot be mutated by mistake.' },
              ],
            },
          },
          {
            id: "dart-late",
            code: "late String description;\n\nvoid setup() {\n  description = 'initialized later';\n}",
            note: "`late` declares a non-nullable variable that you promise to initialize before first use, deferring the assignment. It is useful for values that cannot be set at declaration but are never null once used. Reading a `late` variable before assigning it throws at runtime.",
            explanation: {
              heading: 'Deferred initialization',
              intro: 'The late keyword tells the compiler you will assign a non-nullable variable before you read it, so you can defer the assignment past the declaration. It trades a compile time guarantee for a runtime check.',
              points: [
                { term: 'Stays non-nullable', detail: 'A late variable keeps its non-nullable type instead of forcing you to use a nullable question mark type.' },
                { term: 'Runtime check', detail: 'Reading a late variable before assigning it throws a LateInitializationError.' },
                { term: 'Lazy computation', detail: 'A late variable with an initializer runs that initializer only on first access.' },
                { term: 'Common in classes', detail: 'It suits fields set inside a setup or init method rather than at declaration.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: "dart-null-safety",
        title: "Null Safety",
        level: 2,
        slug: "null-safety",
        concepts: [
          {
            id: "dart-nullable-types",
            code: "String name = 'Dart';   // non-nullable, cannot be null\nString? maybe = null;   // nullable, may hold null\nint length = maybe?.length ?? 0; // safe access with fallback",
            note: "Sound null safety means a plain type like `String` can never be null; add `?` to allow null. The `?.` operator short-circuits to null instead of throwing, and `??` supplies a default when the left side is null. This moves an entire class of null errors from runtime to compile time.",
            explanation: {
              heading: 'Sound null safety',
              intro: 'In Dart a plain type can never hold null, and you opt into nullability by adding a question mark to the type. The compiler tracks this so a whole category of null reference bugs becomes a compile error instead of a crash.',
              points: [
                { term: 'Nullable types', detail: 'A trailing question mark on a type such as String question mark allows the value null.' },
                { term: 'Safe access', detail: 'The question mark dot operator returns null instead of throwing when the receiver is null.' },
                { term: 'Default values', detail: 'The double question mark operator supplies a fallback when the left side is null.' },
                { term: 'Sound guarantee', detail: 'Because it is sound, a non-nullable variable is proven never to be null at runtime.' },
              ],
            },
          },
          {
            id: "dart-null-assertion",
            code: "String? input = fetch();\nint n = input!.length;   // ! asserts non-null (throws if wrong)\nmaybe ??= 'default';     // assign only if currently null",
            note: "The `!` operator asserts that a nullable value is non-null, throwing if you are wrong, so use it only when you are certain. The `??=` operator assigns a value only when the target is currently null. Prefer flow analysis and `?.`/`??` over `!` where possible.",
            explanation: {
              heading: 'Assertions and null-aware assignment',
              intro: 'The bang operator forcibly converts a nullable value to non-nullable and throws if it turns out to be null, so it should be a last resort. The null-aware assignment operator only writes a value when the target is currently null.',
              points: [
                { term: 'The bang operator', detail: 'A trailing bang asserts the value is non-null and throws immediately if that promise is broken.' },
                { term: 'Use sparingly', detail: 'Reach for the bang only when you can prove the value is set, since it disables compiler protection.' },
                { term: 'Null-aware assign', detail: 'The double question mark equals operator assigns only if the variable is null right now.' },
                { term: 'Prefer flow analysis', detail: 'Let the compiler narrow types with null checks and use question mark dot before resorting to bang.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 3. Types & Strings
  {
    id: "dart-types",
    title: "Types & Strings",
    level: 1,
    slug: "types",
    concepts: [],
    children: [
      {
        id: "dart-built-in-types",
        title: "Built-in Types",
        level: 2,
        slug: "built-in-types",
        concepts: [
          {
            id: "dart-numbers-bool",
            code: "int whole = 42;\ndouble ratio = 3.14;\nnum either = 7;      // int or double\nbool flag = true;\nvar big = 9007199254740993; // arbitrary precision on native",
            note: "Dart's numeric types are `int` and `double`, both subtypes of `num`. `bool` holds only `true` or `false`, and unlike some languages Dart never treats other values as truthy. Use `num` when a value may be either kind of number.",
            explanation: {
              heading: 'Numbers and booleans',
              intro: 'Dart splits numbers into whole int values and floating point double values, both of which are kinds of num. Booleans are strictly true or false, and Dart never treats any other value as if it were a boolean.',
              points: [
                { term: 'int and double', detail: 'Whole numbers use int while fractional numbers use double, and both share the num supertype.' },
                { term: 'num for either', detail: 'Declare a variable as num when it may hold either an int or a double.' },
                { term: 'Strict booleans', detail: 'A condition must be an actual bool, so numbers and objects are never automatically truthy.' },
                { term: 'Platform precision', detail: 'On native platforms int is sixty four bit while on the web it maps to JavaScript numbers.' },
              ],
            },
          },
          {
            id: "dart-type-conversions",
            code: "int n = int.parse('123');\ndouble d = double.parse('3.5');\nString s = 42.toString();\nint truncated = 3.9.toInt();     // 3\ndouble asDouble = 5.toDouble();  // 5.0",
            note: "Parse text into numbers with `int.parse` and `double.parse`, and convert back with `toString`. Numeric conversions like `toInt` truncate toward zero. Use `int.tryParse` when the input might be invalid, since it returns null instead of throwing.",
            explanation: {
              heading: 'Converting between types',
              intro: 'Dart converts text to numbers with parse methods and numbers to text with toString, while numeric methods change between int and double. Choosing the try variant lets you handle bad input without an exception.',
              points: [
                { term: 'Parsing text', detail: 'int dot parse and double dot parse turn a string into the matching numeric type.' },
                { term: 'tryParse is safe', detail: 'The tryParse variants return null on invalid input instead of throwing a FormatException.' },
                { term: 'Truncation', detail: 'Calling toInt on a double drops the fractional part and truncates toward zero.' },
                { term: 'Back to text', detail: 'Every object has a toString method, so numbers convert to strings easily.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: "dart-strings",
        title: "Strings",
        level: 2,
        slug: "strings",
        concepts: [
          {
            id: "dart-string-basics",
            code: "var single = 'single quotes';\nvar dbl = \"double quotes\";\nvar multi = '''\nline one\nline two\n''';\nvar raw = r'C:\\path\\no\\escapes';",
            note: "Strings use single or double quotes interchangeably. Triple quotes create multi-line strings, and an `r` prefix makes a raw string where backslashes are literal. Adjacent string literals are automatically concatenated.",
            explanation: {
              heading: 'String literal forms',
              intro: 'Dart accepts single or double quotes for strings without any difference in meaning, plus triple quotes for text that spans lines. A raw string prefix disables escape processing, which is handy for paths and regular expressions.',
              points: [
                { term: 'Either quote', detail: 'Single and double quotes are equivalent, so pick whichever avoids escaping the quotes inside.' },
                { term: 'Multi-line', detail: 'Triple quotes preserve line breaks so you can write text across several lines.' },
                { term: 'Raw strings', detail: 'A leading letter r makes backslashes literal instead of starting an escape sequence.' },
                { term: 'Adjacent literals', detail: 'Two string literals written next to each other are automatically joined into one.' },
              ],
            },
          },
          {
            id: "dart-string-methods",
            code: "var s = 'Hello, Dart';\ns.length;                 // 12\ns.toUpperCase();          // 'HELLO, DART'\ns.contains('Dart');       // true\ns.split(', ');            // ['Hello', 'Dart']\ns.replaceAll('l', 'L');   // 'HeLLo, Dart'",
            note: "Strings are immutable and offer a rich method set for querying and transforming text. Methods like `split`, `substring`, `trim`, and `replaceAll` return new strings rather than mutating the original. For building strings in a loop, use a `StringBuffer` to avoid repeated allocations.",
            explanation: {
              heading: 'Immutable text operations',
              intro: 'Strings in Dart cannot be changed in place, so every transforming method returns a brand new string. When you assemble text piece by piece, a StringBuffer avoids the cost of creating many throwaway strings.',
              points: [
                { term: 'Immutable', detail: 'No method changes the original string, they all return a new one instead.' },
                { term: 'Rich API', detail: 'Methods like split, substring, trim, and replaceAll cover most text needs.' },
                { term: 'StringBuffer', detail: 'Use a StringBuffer inside loops to accumulate text without repeated allocations.' },
                { term: 'Query methods', detail: 'Checks like contains and startsWith return booleans for conditional logic.' },
              ],
            },
            example: "var sb = StringBuffer();\nfor (var i = 0; i < 3; i++) sb.write(i);\nprint(sb.toString()); // '012'",
          },
        ],
        children: [],
      },
    ],
  },

  // 4. Collections
  {
    id: "dart-collections",
    title: "Collections",
    level: 1,
    slug: "collections",
    concepts: [],
    children: [
      {
        id: "dart-lists",
        title: "Lists",
        level: 2,
        slug: "lists",
        concepts: [
          {
            id: "dart-list-basics",
            code: "var nums = <int>[1, 2, 3];\nnums.add(4);\nnums[0];              // 1\nnums.length;          // 4\nvar doubled = nums.map((n) => n * 2).toList();",
            note: "A `List` is an ordered, growable collection indexed from zero. The `<int>` type argument keeps it type-safe. Higher-order methods like `map`, `where`, and `reduce` transform lists functionally and return lazy iterables you can materialize with `toList`.",
            explanation: {
              heading: 'Ordered collections',
              intro: 'A List keeps elements in insertion order and lets you access them by a zero based index. Its functional methods return lazy iterables, so nothing is computed until you iterate or call toList.',
              points: [
                { term: 'Zero indexed', detail: 'The first element is at index zero and length gives the current count.' },
                { term: 'Type argument', detail: 'Writing the element type in angle brackets keeps the list type safe and self documenting.' },
                { term: 'Lazy transforms', detail: 'Methods like map and where return an Iterable that is only evaluated when iterated.' },
                { term: 'Materialize', detail: 'Call toList to turn a lazy iterable into a concrete list you can index.' },
              ],
            },
          },
          {
            id: "dart-collection-if-for",
            code: "var showExtra = true;\nvar items = [\n  'base',\n  if (showExtra) 'bonus',\n  for (var i in [1, 2]) 'item\$i',\n];\n// ['base', 'bonus', 'item1', 'item2']",
            note: "Collection literals support inline `if` and `for`, letting you build lists declaratively without temporary variables. A spread with `...` inserts the elements of another collection, and `...?` spreads only when the source is non-null.",
            explanation: {
              heading: 'Declarative collection building',
              intro: 'Dart lets you embed conditionals and loops directly inside a list, set, or map literal. This means you can build a collection in one expression without pushing to a temporary variable afterward.',
              points: [
                { term: 'Collection if', detail: 'An inline if includes an element only when its condition is true.' },
                { term: 'Collection for', detail: 'An inline for generates elements by looping over another iterable.' },
                { term: 'Spread operator', detail: 'Three dots insert all elements of another collection into this one.' },
                { term: 'Null-aware spread', detail: 'Three dots followed by a question mark spreads only when the source is not null.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: "dart-maps-sets",
        title: "Maps & Sets",
        level: 2,
        slug: "maps-sets",
        concepts: [
          {
            id: "dart-map-basics",
            code: "var ages = <String, int>{'alice': 30, 'bob': 25};\nages['carol'] = 40;\nages['alice'];              // 30\nages.containsKey('bob');    // true\nages.forEach((k, v) => print('\$k: \$v'));",
            note: "A `Map` stores key-value pairs with unique keys. Look up and insert with subscript syntax, and iterate with `forEach` or over `entries`. Accessing a missing key returns null rather than throwing, so combine it with `??` for a default.",
            explanation: {
              heading: 'Key-value storage',
              intro: 'A Map associates unique keys with values and gives fast lookup by key. Because a missing key returns null rather than throwing, pairing lookups with a default keeps your code safe.',
              points: [
                { term: 'Unique keys', detail: 'Each key appears once, and assigning to an existing key overwrites its value.' },
                { term: 'Subscript access', detail: 'Square brackets read and write entries by key.' },
                { term: 'Missing returns null', detail: 'Reading a key that is absent yields null, so combine it with the double question mark operator.' },
                { term: 'Iteration', detail: 'Use forEach or loop over entries to visit every key and value pair.' },
              ],
            },
          },
          {
            id: "dart-set-basics",
            code: "var tags = <String>{'a', 'b', 'a'};\ntags.length;            // 2 (duplicates removed)\ntags.add('c');\ntags.contains('a');     // true\ntags.union({'d'});      // {a, b, c, d}",
            note: "A `Set` holds unique values with fast membership tests and no guaranteed order. It automatically discards duplicates and supports set algebra like `union`, `intersection`, and `difference`. Reach for a set when you care about presence rather than position.",
            explanation: {
              heading: 'Unique unordered values',
              intro: 'A Set stores each value at most once and answers membership questions quickly. It is the right choice when you care whether something is present rather than where it sits.',
              points: [
                { term: 'Automatic dedup', detail: 'Adding a value that already exists is silently ignored so duplicates never accumulate.' },
                { term: 'Fast membership', detail: 'The contains check is efficient because a set is backed by a hash table.' },
                { term: 'Set algebra', detail: 'Methods like union, intersection, and difference combine sets mathematically.' },
                { term: 'No order', detail: 'A default set does not promise any particular iteration order.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 5. Control Flow
  {
    id: "dart-control-flow",
    title: "Control Flow",
    level: 1,
    slug: "control-flow",
    concepts: [],
    children: [
      {
        id: "dart-conditionals",
        title: "Conditionals",
        level: 2,
        slug: "conditionals",
        concepts: [
          {
            id: "dart-if-else",
            code: "var score = 82;\nif (score >= 90) {\n  print('A');\n} else if (score >= 80) {\n  print('B');\n} else {\n  print('C');\n}\nvar grade = score >= 60 ? 'pass' : 'fail';",
            note: "`if`/`else if`/`else` chains branch on boolean conditions, and the condition must be a real `bool`. The ternary `condition ? a : b` chooses between two values inline. Dart also narrows nullable types inside an `if` that checks for null.",
            explanation: {
              heading: 'Branching on conditions',
              intro: 'An if statement runs a block only when its boolean condition holds, chaining else if and else for alternatives. The ternary operator picks between two values inline, and Dart even narrows nullable types inside a null check.',
              points: [
                { term: 'Boolean only', detail: 'The condition must evaluate to a real bool, since Dart has no implicit truthiness.' },
                { term: 'Else chains', detail: 'else if and else provide ordered fallbacks when the first condition fails.' },
                { term: 'Ternary', detail: 'The condition then question mark a colon b form chooses one of two values as an expression.' },
                { term: 'Type promotion', detail: 'Checking a nullable value for null inside an if lets Dart treat it as non-null in that branch.' },
              ],
            },
          },
          {
            id: "dart-switch",
            code: "var command = 'start';\nswitch (command) {\n  case 'start':\n    print('starting');\n  case 'stop':\n    print('stopping');\n  default:\n    print('unknown');\n}",
            note: "`switch` compares a value against constant cases. In modern Dart, cases do not fall through and no explicit `break` is needed. Switches over enums are checked for exhaustiveness, warning you if you forget a case.",
            explanation: {
              heading: 'Multi-way selection',
              intro: 'A switch statement compares one value against a series of cases and runs the matching branch. Modern Dart does not fall through between cases and checks enum switches for exhaustiveness.',
              points: [
                { term: 'No fall through', detail: 'Each case runs on its own, so you no longer need a break to separate them.' },
                { term: 'default catch-all', detail: 'The default clause handles any value that matches no listed case.' },
                { term: 'Exhaustiveness', detail: 'Switching over an enum warns you at compile time if a value is not handled.' },
                { term: 'Cleaner than if', detail: 'Switch reads better than a long if else chain when comparing one value to many constants.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: "dart-loops",
        title: "Loops",
        level: 2,
        slug: "loops",
        concepts: [
          {
            id: "dart-for-loops",
            code: "for (var i = 0; i < 3; i++) {\n  print(i);\n}\nfor (var item in ['a', 'b']) {\n  print(item);\n}\n['x', 'y'].forEach(print);",
            note: "The C-style `for` loop uses an index, while `for-in` iterates directly over any Iterable's elements. The `forEach` method offers a functional alternative. Prefer `for-in` when you do not need the index.",
            explanation: {
              heading: 'Iterating with for',
              intro: 'Dart provides an indexed C style for loop and a for in loop that walks the elements of any iterable directly. Preferring for in keeps loops readable whenever the index itself is not needed.',
              points: [
                { term: 'Indexed for', detail: 'The three part for loop gives you a counter, useful when the position matters.' },
                { term: 'for-in', detail: 'The for in form binds each element in turn without exposing an index.' },
                { term: 'forEach method', detail: 'Iterables offer a forEach method that calls a function for each element.' },
                { term: 'Choose by need', detail: 'Use for in for clarity and reserve the indexed loop for when you truly need the index.' },
              ],
            },
          },
          {
            id: "dart-while-loops",
            code: "var n = 3;\nwhile (n > 0) {\n  print(n);\n  n--;\n}\ndo {\n  print('runs once');\n} while (false);",
            note: "`while` tests its condition before each pass, so the body may never run, while `do`/`while` tests afterward and always runs at least once. Use `break` to exit a loop early and `continue` to skip to the next iteration.",
            explanation: {
              heading: 'Condition-driven loops',
              intro: 'A while loop repeats as long as its condition stays true and checks that condition before each pass. A do while loop checks afterward, so its body always runs at least once.',
              points: [
                { term: 'while', detail: 'Tests the condition first, so the body may run zero times.' },
                { term: 'do while', detail: 'Runs the body once and then checks the condition, guaranteeing at least one pass.' },
                { term: 'break', detail: 'Exits the enclosing loop immediately regardless of the condition.' },
                { term: 'continue', detail: 'Skips the rest of the current pass and jumps to the next iteration.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 6. Functions
  {
    id: "dart-functions",
    title: "Functions",
    level: 1,
    slug: "functions",
    concepts: [],
    children: [
      {
        id: "dart-function-basics",
        title: "Defining Functions",
        level: 2,
        slug: "defining",
        concepts: [
          {
            id: "dart-function-def",
            code: "int add(int a, int b) {\n  return a + b;\n}\n\n// Arrow syntax for a single expression:\nint square(int x) => x * x;",
            note: "A function declares a return type, a name, and typed parameters. The fat-arrow `=>` is shorthand for a body that is a single expression, implicitly returning its value. Functions are first-class in Dart, so they can be stored in variables and passed around.",
            explanation: {
              heading: 'Defining functions',
              intro: 'A Dart function pairs a return type and typed parameters with a body, and the fat arrow form condenses a single expression body. Because functions are first class, you can pass them as arguments and store them in variables.',
              points: [
                { term: 'Typed signature', detail: 'The return type and parameter types make each function self documenting and type checked.' },
                { term: 'Arrow shorthand', detail: 'The fat arrow returns the value of one expression without a braces block.' },
                { term: 'First class', detail: 'Functions are values, so they can be assigned, passed, and returned.' },
                { term: 'Inferred returns', detail: 'Omitting the return type lets Dart infer it, though naming it aids readability.' },
              ],
            },
          },
          {
            id: "dart-named-optional",
            code: "String greet(String name, {String greeting = 'Hello'}) =>\n    '\$greeting, \$name';\n\ngreet('Ada');                      // 'Hello, Ada'\ngreet('Ada', greeting: 'Hi');      // 'Hi, Ada'\n\nString tag(String s, [String suffix = '!']) => '\$s\$suffix';",
            note: "Named parameters go in braces and are passed by name, which makes call sites self-documenting; they can have defaults or be marked `required`. Positional optional parameters go in square brackets. Both kinds let you design flexible APIs without overloading.",
            explanation: {
              heading: 'Named and optional parameters',
              intro: 'Dart supports named parameters passed by label and positional optional parameters in square brackets, both of which can carry defaults. Since Dart has no method overloading, these features are how you build flexible APIs.',
              points: [
                { term: 'Named in braces', detail: 'Parameters in braces are passed by name, making call sites clear and order independent.' },
                { term: 'required keyword', detail: 'Marking a named parameter required forces callers to supply it.' },
                { term: 'Positional optional', detail: 'Parameters in square brackets may be omitted and fall back to their defaults.' },
                { term: 'No overloading', detail: 'These features replace the overloaded methods found in some other languages.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: "dart-closures",
        title: "Closures & Higher-Order Functions",
        level: 2,
        slug: "closures",
        concepts: [
          {
            id: "dart-anonymous-functions",
            code: "var numbers = [1, 2, 3, 4];\nvar evens = numbers.where((n) => n.isEven).toList();\nnumbers.sort((a, b) => b.compareTo(a)); // descending",
            note: "Anonymous functions (lambdas) are written inline, most often as arguments to methods like `where`, `map`, and `sort`. They capture variables from their surrounding scope, forming closures. This functional style keeps collection processing concise.",
            explanation: {
              heading: 'Inline anonymous functions',
              intro: 'Anonymous functions have no name and are written right where they are needed, usually as arguments to collection methods. They can read variables from the surrounding scope, which makes them closures.',
              points: [
                { term: 'No name needed', detail: 'A lambda is defined inline instead of as a separate named declaration.' },
                { term: 'Common as callbacks', detail: 'Methods like where, map, and sort take a function argument to customize behavior.' },
                { term: 'Capture scope', detail: 'A lambda can reference variables from the enclosing function, forming a closure.' },
                { term: 'Concise style', detail: 'Combined with arrow syntax they keep collection processing short and readable.' },
              ],
            },
          },
          {
            id: "dart-closure-capture",
            code: "Function makeCounter() {\n  var count = 0;\n  return () => ++count;\n}\n\nvar next = makeCounter();\nnext(); // 1\nnext(); // 2",
            note: "A closure captures and retains the variables from the scope where it was created, even after that scope has exited. Here each returned counter keeps its own private `count`. Closures are the foundation of callbacks and factory functions in Dart.",
            explanation: {
              heading: 'Capturing state',
              intro: 'A closure is a function that remembers the variables from where it was defined, even after that outer function has returned. Each closure instance keeps its own independent copy of that captured state.',
              points: [
                { term: 'Retained variables', detail: 'The captured variables live on as long as the closure that references them exists.' },
                { term: 'Private state', detail: 'Variables captured by a closure are hidden from the outside world.' },
                { term: 'Independent copies', detail: 'Each call to the factory produces a closure with its own separate state.' },
                { term: 'Powers callbacks', detail: 'Closures underpin callbacks, event handlers, and factory functions across Dart.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 7. Classes & Constructors
  {
    id: "dart-classes",
    title: "Classes & Constructors",
    level: 1,
    slug: "classes",
    concepts: [],
    children: [
      {
        id: "dart-class-basics",
        title: "Classes & Fields",
        level: 2,
        slug: "class-basics",
        concepts: [
          {
            id: "dart-class-def",
            code: "class Point {\n  double x;\n  double y;\n\n  Point(this.x, this.y);\n\n  double distanceTo(Point other) {\n    var dx = x - other.x, dy = y - other.y;\n    return (dx * dx + dy * dy);\n  }\n}",
            note: "A class bundles fields and methods. The `this.x` constructor shorthand assigns a parameter straight to a field, avoiding boilerplate. Methods access fields directly and are called with dot notation on an instance.",
            explanation: {
              heading: 'Fields and methods together',
              intro: 'A class groups related data as fields and behavior as methods behind one type. The this dot parameter shorthand assigns a constructor argument straight to a field, cutting out repetitive assignment code.',
              points: [
                { term: 'Fields hold state', detail: 'Instance fields store the data that belongs to each object.' },
                { term: 'this shorthand', detail: 'Writing this dot x in a constructor assigns the argument directly to that field.' },
                { term: 'Methods use fields', detail: 'A method can read and write the object fields directly by name.' },
                { term: 'Dot invocation', detail: 'You call methods and read fields with dot notation on an instance.' },
              ],
            },
          },
          {
            id: "dart-getters-setters",
            code: "class Circle {\n  double radius;\n  Circle(this.radius);\n\n  double get area => 3.14159 * radius * radius;\n  set diameter(double d) => radius = d / 2;\n}\n\nvar c = Circle(2);\nc.area;        // computed getter\nc.diameter = 10;",
            note: "Getters and setters expose computed properties that read like fields but run code. Define them with the `get` and `set` keywords. They let you evolve a public field into a computed value later without changing how callers use it.",
            explanation: {
              heading: 'Computed properties',
              intro: 'Getters and setters look like plain field access at the call site but actually run code behind the scenes. This lets you turn a stored field into a computed one later without breaking any callers.',
              points: [
                { term: 'get keyword', detail: 'A getter computes and returns a value each time the property is read.' },
                { term: 'set keyword', detail: 'A setter takes one value and runs code when the property is assigned.' },
                { term: 'Field-like syntax', detail: 'Callers use them exactly like fields, with no parentheses.' },
                { term: 'Future proofing', detail: 'Starting with a getter lets you change the implementation without touching callers.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: "dart-constructors",
        title: "Constructors",
        level: 2,
        slug: "constructors",
        concepts: [
          {
            id: "dart-named-constructors",
            code: "class Point {\n  final double x, y;\n  Point(this.x, this.y);\n\n  Point.origin() : x = 0, y = 0;      // named constructor\n  const Point.axis(this.x) : y = 0;   // const constructor\n}\n\nvar o = Point.origin();",
            note: "Named constructors like `Point.origin` provide alternative ways to build an instance. An initializer list after the colon sets final fields before the body runs. A `const` constructor allows compile-time constant instances when all fields are final.",
            explanation: {
              heading: 'Named and const constructors',
              intro: 'Named constructors give a class several clearly labeled ways to build an instance, while the initializer list sets final fields before the body runs. A const constructor produces compile time constants when every field is final.',
              points: [
                { term: 'Named form', detail: 'A constructor named like Class dot origin documents an alternative way to construct.' },
                { term: 'Initializer list', detail: 'The part after the colon assigns final fields before the constructor body executes.' },
                { term: 'const constructor', detail: 'Marking a constructor const lets instances become compile time constants.' },
                { term: 'Requires final', detail: 'A const constructor only works when all instance fields are final.' },
              ],
            },
          },
          {
            id: "dart-factory-constructors",
            code: "class Logger {\n  static final _cache = <String, Logger>{};\n  final String name;\n  Logger._internal(this.name);\n\n  factory Logger(String name) =>\n      _cache.putIfAbsent(name, () => Logger._internal(name));\n}",
            note: "A `factory` constructor does not always create a new instance; it can return a cached or subtype object. Here it implements a per-name singleton. The `_internal` private constructor is the actual builder, hidden from outside callers.",
            explanation: {
              heading: 'Factory constructors',
              intro: 'A factory constructor runs code to decide what object to return, so it can hand back a cached instance or a subtype instead of always allocating. It is the standard way to build caches, singletons, and parsers.',
              points: [
                { term: 'Not always new', detail: 'Unlike a normal constructor a factory is not required to create a fresh instance.' },
                { term: 'Return existing', detail: 'It can return a cached object, enabling patterns like a per key singleton.' },
                { term: 'Private builder', detail: 'A leading underscore constructor stays hidden and does the real construction.' },
                { term: 'May return subtype', detail: 'A factory can return any instance assignable to the class type.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 8. Inheritance & Mixins
  {
    id: "dart-inheritance",
    title: "Inheritance & Mixins",
    level: 1,
    slug: "inheritance",
    concepts: [],
    children: [
      {
        id: "dart-extends-override",
        title: "Extending Classes",
        level: 2,
        slug: "extends",
        concepts: [
          {
            id: "dart-inheritance-basic",
            code: "class Animal {\n  String sound() => 'generic';\n}\n\nclass Dog extends Animal {\n  @override\n  String sound() => 'woof';\n}\n\nAnimal a = Dog();\na.sound(); // 'woof'",
            note: "A subclass uses `extends` to inherit fields and methods from a superclass. Marking an overriding method with `@override` lets the compiler verify it really overrides something. Dart resolves method calls dynamically, so the runtime type decides which version runs.",
            explanation: {
              heading: 'Extending a superclass',
              intro: 'A subclass declared with extends inherits the fields and methods of its parent and can override them to change behavior. Because Dart dispatches methods on the runtime type, the most derived override runs.',
              points: [
                { term: 'extends', detail: 'A class inherits members from exactly one superclass using the extends keyword.' },
                { term: 'override annotation', detail: 'Marking a method with the override annotation lets the compiler confirm it really overrides one.' },
                { term: 'Dynamic dispatch', detail: 'The actual runtime type of an object decides which overridden method executes.' },
                { term: 'Single inheritance', detail: 'A class can extend only one superclass, which mixins and interfaces complement.' },
              ],
            },
          },
          {
            id: "dart-super-calls",
            code: "class Base {\n  Base(this.id);\n  final int id;\n  String describe() => 'Base#\$id';\n}\n\nclass Derived extends Base {\n  Derived(int id) : super(id);\n  @override\n  String describe() => 'Derived: \${super.describe()}';\n}",
            note: "Use `super(...)` in the initializer list to invoke the superclass constructor, and `super.method()` to call the parent's implementation from an override. This lets a subclass extend behavior instead of fully replacing it.",
            explanation: {
              heading: 'Calling the parent',
              intro: 'The super keyword reaches the superclass, both to pass arguments to its constructor and to call its version of a method. This lets a subclass build on the parent behavior rather than discarding it.',
              points: [
                { term: 'super constructor', detail: 'Calling super with arguments in the initializer list forwards to the parent constructor.' },
                { term: 'super method', detail: 'super dot method invokes the parent implementation from inside an override.' },
                { term: 'Extend not replace', detail: 'Wrapping a super call lets you add behavior around the inherited version.' },
                { term: 'Runs first', detail: 'The superclass constructor completes before the subclass constructor body runs.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: "dart-mixins",
        title: "Mixins",
        level: 2,
        slug: "mixins",
        concepts: [
          {
            id: "dart-mixin-basic",
            code: "mixin Flyable {\n  void fly() => print('Flying');\n}\nmixin Swimmable {\n  void swim() => print('Swimming');\n}\n\nclass Duck with Flyable, Swimmable {}\n\nvar d = Duck();\nd.fly();\nd.swim();",
            note: "A mixin packages reusable behavior that can be added to many classes with `with`, without forcing a single inheritance chain. A class can mix in several mixins, composing capabilities. Use `on` in a mixin to restrict it to classes that extend a given type.",
            explanation: {
              heading: 'Reusing behavior with mixins',
              intro: 'A mixin bundles methods and fields that many unrelated classes can share by writing with, sidestepping the limit of single inheritance. You can apply several mixins to compose capabilities into one class.',
              points: [
                { term: 'with keyword', detail: 'Applying a mixin with the with keyword adds its members to the class.' },
                { term: 'Compose many', detail: 'A single class can mix in multiple mixins to combine independent features.' },
                { term: 'on restriction', detail: 'An on clause limits a mixin to classes that extend a specified type.' },
                { term: 'Not instantiated', detail: 'A mixin is meant to be mixed in and is not created on its own.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 9. Abstraction & Generics
  {
    id: "dart-abstraction",
    title: "Abstraction & Generics",
    level: 1,
    slug: "abstraction",
    concepts: [],
    children: [
      {
        id: "dart-abstract-interfaces",
        title: "Abstract Classes & Interfaces",
        level: 2,
        slug: "abstract-interfaces",
        concepts: [
          {
            id: "dart-abstract-class",
            code: "abstract class Shape {\n  double area(); // no body: must be implemented\n  String describe() => 'A shape with area \${area()}';\n}\n\nclass Square extends Shape {\n  final double side;\n  Square(this.side);\n  @override\n  double area() => side * side;\n}",
            note: "An `abstract` class cannot be instantiated and may declare methods without bodies that subclasses must implement. It can also provide concrete methods to share. Abstract classes define a common contract while allowing partial implementation.",
            explanation: {
              heading: 'Abstract base classes',
              intro: 'An abstract class defines a shared contract that cannot be instantiated directly and may leave some methods without bodies for subclasses to fill in. It can also supply concrete methods that all subclasses inherit.',
              points: [
                { term: 'Cannot instantiate', detail: 'You cannot create an abstract class directly, only its concrete subclasses.' },
                { term: 'Abstract methods', detail: 'A method with no body must be implemented by every concrete subclass.' },
                { term: 'Shared concretes', detail: 'An abstract class can still provide fully implemented methods to reuse.' },
                { term: 'Common contract', detail: 'It captures what related types share while leaving specifics to subclasses.' },
              ],
            },
          },
          {
            id: "dart-implements",
            code: "class Printable {\n  void printMe() {}\n}\n\nclass Report implements Printable {\n  @override\n  void printMe() => print('report');\n}",
            note: "Any class defines an implicit interface, and `implements` requires you to supply every member of that interface with no inherited implementation. Unlike `extends`, a class can implement multiple interfaces. Use it for pure contracts and `extends` for reuse.",
            explanation: {
              heading: 'Implicit interfaces',
              intro: 'Every Dart class automatically defines an interface consisting of its members. Using implements adopts that interface but inherits none of the implementation, forcing you to write every member yourself.',
              points: [
                { term: 'Implicit interface', detail: 'Any class can be used as an interface without a separate interface keyword.' },
                { term: 'No inheritance', detail: 'implements brings the contract only, so you must supply every member.' },
                { term: 'Multiple interfaces', detail: 'A class can implement several interfaces at once, unlike single extends.' },
                { term: 'Contract versus reuse', detail: 'Use implements for pure contracts and extends when you want to inherit code.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: "dart-generics",
        title: "Generics",
        level: 2,
        slug: "generics",
        concepts: [
          {
            id: "dart-generic-class",
            code: "class Box<T> {\n  final T value;\n  Box(this.value);\n  T unwrap() => value;\n}\n\nvar intBox = Box<int>(42);\nvar strBox = Box('hello'); // T inferred as String",
            note: "Generics let a class or function work with any type while keeping type safety. The type parameter `T` is a placeholder filled in at use, either explicitly or by inference. This avoids duplicating code for each concrete type.",
            explanation: {
              heading: 'Type-safe reuse',
              intro: 'Generics parameterize a class or function over a type, letting one definition serve many concrete types without sacrificing type checking. The type parameter is filled in when you use the type, either explicitly or by inference.',
              points: [
                { term: 'Type parameter', detail: 'A placeholder like T stands in for a real type chosen at the use site.' },
                { term: 'Preserves safety', detail: 'The compiler still checks types, so a box of int cannot leak a string.' },
                { term: 'Inference', detail: 'Dart often infers the type argument from the constructor or arguments.' },
                { term: 'Avoids duplication', detail: 'One generic definition replaces many nearly identical concrete versions.' },
              ],
            },
          },
          {
            id: "dart-generic-bounds",
            code: "T largest<T extends Comparable<T>>(List<T> items) {\n  var best = items.first;\n  for (var x in items) {\n    if (x.compareTo(best) > 0) best = x;\n  }\n  return best;\n}",
            note: "A bound like `T extends Comparable<T>` constrains the type parameter so the function can use members of that bound, here calling `compareTo`. Bounded generics balance flexibility with the ability to operate on the values. This pattern powers reusable algorithms.",
            explanation: {
              heading: 'Bounded type parameters',
              intro: 'A bound constrains a type parameter to subtypes of a given type, which lets the generic code call the members guaranteed by that bound. This is how generic algorithms can safely compare or combine their inputs.',
              points: [
                { term: 'extends bound', detail: 'Writing T extends Comparable restricts T to types that implement Comparable.' },
                { term: 'Unlocks members', detail: 'Within the bound the code can call methods like compareTo on values of type T.' },
                { term: 'Flexible yet safe', detail: 'Bounds keep the function general while still allowing meaningful operations.' },
                { term: 'Powers algorithms', detail: 'Sorting and searching routines rely on bounds to work across many types.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 10. Asynchronous Programming
  {
    id: "dart-async",
    title: "Asynchronous Programming",
    level: 1,
    slug: "async",
    concepts: [],
    children: [
      {
        id: "dart-futures",
        title: "Futures & async/await",
        level: 2,
        slug: "futures",
        concepts: [
          {
            id: "dart-future-basic",
            code: "Future<String> fetchData() async {\n  await Future.delayed(Duration(seconds: 1));\n  return 'done';\n}\n\nvoid main() async {\n  var result = await fetchData();\n  print(result);\n}",
            note: "A `Future` represents a value that will be available later. Marking a function `async` lets you `await` a future, pausing until it completes while keeping the code linear and readable. The function itself returns a `Future` of its result type.",
            explanation: {
              heading: 'Futures and await',
              intro: 'A Future is a placeholder for a value that will arrive later, such as the result of a network call. Marking a function async lets you await a future so the code reads top to bottom while the runtime handles the waiting.',
              points: [
                { term: 'Represents later value', detail: 'A Future completes in the future with either a value or an error.' },
                { term: 'async functions', detail: 'The async keyword allows await inside and makes the function return a Future.' },
                { term: 'await pauses', detail: 'await suspends the function until the future completes without blocking the thread.' },
                { term: 'Linear reading', detail: 'Async and await let asynchronous code look like ordinary sequential code.' },
              ],
            },
          },
          {
            id: "dart-future-combinators",
            code: "var results = await Future.wait([\n  fetchUser(),\n  fetchSettings(),\n]);\n\nawait Future.any([slow(), fast()]); // first to finish wins",
            note: "`Future.wait` runs several futures concurrently and completes when all finish, returning their results in order. `Future.any` completes with the first one to finish. Running independent async work in parallel is faster than awaiting each in sequence.",
            explanation: {
              heading: 'Running futures together',
              intro: 'When several asynchronous operations do not depend on each other, you can start them all and wait for the group rather than awaiting one at a time. This overlaps the waiting and finishes far sooner.',
              points: [
                { term: 'Future.wait', detail: 'Waits for a list of futures and returns all results in the same order.' },
                { term: 'Future.any', detail: 'Completes as soon as the first future in the list finishes.' },
                { term: 'True concurrency', detail: 'Starting the futures before awaiting lets their waiting periods overlap.' },
                { term: 'Faster than serial', detail: 'Awaiting each future in turn wastes time that parallel waiting reclaims.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: "dart-streams",
        title: "Streams",
        level: 2,
        slug: "streams",
        concepts: [
          {
            id: "dart-stream-generator",
            code: "Stream<int> countTo(int n) async* {\n  for (var i = 1; i <= n; i++) {\n    await Future.delayed(Duration(milliseconds: 100));\n    yield i;\n  }\n}\n\nawait for (var value in countTo(3)) {\n  print(value); // 1, 2, 3 over time\n}",
            note: "A `Stream` delivers a sequence of asynchronous events over time. An `async*` function produces one with `yield`, and `await for` consumes each event as it arrives. Streams model things like user input, socket data, and timer ticks.",
            explanation: {
              heading: 'Asynchronous sequences',
              intro: 'A Stream is like a Future that can deliver many values over time instead of a single result. An async generator function produces events with yield, and await for consumes them one by one as they arrive.',
              points: [
                { term: 'Many events', detail: 'A stream emits a sequence of values or errors spread out over time.' },
                { term: 'async star', detail: 'An async star function generates a stream and emits each value with yield.' },
                { term: 'await for', detail: 'The await for loop pauses for and processes each event as it appears.' },
                { term: 'Models sources', detail: 'Streams fit user input, socket data, file chunks, and timer ticks.' },
              ],
            },
          },
          {
            id: "dart-stream-transform",
            code: "var stream = countTo(5)\n    .where((n) => n.isOdd)\n    .map((n) => n * 10);\n\nstream.listen((value) => print(value)); // 10, 30, 50",
            note: "Streams support the same functional operators as iterables, such as `where` and `map`, applied lazily as events flow. Subscribe with `listen` to react to each event, or use the returned subscription to pause and cancel. This is the reactive core of event-driven Dart apps.",
            explanation: {
              heading: 'Transforming and listening',
              intro: 'Streams offer the same functional operators as iterables but apply them lazily as each event flows through. You subscribe with listen and use the returned subscription to control the flow.',
              points: [
                { term: 'Functional operators', detail: 'Methods like where and map build a new stream that transforms events as they pass.' },
                { term: 'listen to subscribe', detail: 'Calling listen registers a callback that runs for every emitted event.' },
                { term: 'Subscription control', detail: 'The returned subscription can pause, resume, and cancel the stream.' },
                { term: 'Reactive core', detail: 'This pattern drives event driven and reactive Dart and Flutter applications.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 11. Error Handling
  {
    id: "dart-error-handling",
    title: "Error Handling",
    level: 1,
    slug: "error-handling",
    concepts: [],
    children: [
      {
        id: "dart-try-catch",
        title: "try / catch / finally",
        level: 2,
        slug: "try-catch",
        concepts: [
          {
            id: "dart-try-catch-basic",
            code: "try {\n  var value = int.parse('not a number');\n} on FormatException catch (e) {\n  print('bad format: \${e.message}');\n} catch (e, stack) {\n  print('other error: \$e');\n} finally {\n  print('always runs');\n}",
            note: "`try` guards code that may throw. Use `on Type` to catch a specific exception class and a bare `catch` for anything else, optionally capturing the stack trace as a second parameter. The `finally` block always runs, making it ideal for cleanup.",
            explanation: {
              heading: 'Guarding risky code',
              intro: 'A try block wraps code that might throw, and matching catch clauses handle the error. A finally block runs no matter what happens, which makes it the right place for cleanup.',
              points: [
                { term: 'on Type', detail: 'An on clause catches only a specific exception class for targeted handling.' },
                { term: 'bare catch', detail: 'A plain catch handles anything and can capture both the error and its stack trace.' },
                { term: 'finally always runs', detail: 'The finally block executes whether or not an exception was thrown.' },
                { term: 'Cleanup', detail: 'Release resources such as files or connections in finally to avoid leaks.' },
              ],
            },
          },
          {
            id: "dart-throw-custom",
            code: "class InsufficientFundsException implements Exception {\n  final double shortfall;\n  InsufficientFundsException(this.shortfall);\n  @override\n  String toString() => 'Short by \$shortfall';\n}\n\nvoid withdraw(double amount, double balance) {\n  if (amount > balance) throw InsufficientFundsException(amount - balance);\n}",
            note: "You can throw any object, but implementing `Exception` signals a recoverable error by convention. A custom exception carries structured data, like the shortfall here, so callers can react precisely. Overriding `toString` gives clear messages in logs.",
            explanation: {
              heading: 'Custom exceptions',
              intro: 'Dart lets you throw any object, but implementing the Exception interface signals by convention that the error is recoverable. A purpose built exception class can carry structured data so callers react precisely.',
              points: [
                { term: 'Throw anything', detail: 'The throw statement accepts any object, though exceptions are the convention.' },
                { term: 'implements Exception', detail: 'Implementing Exception marks a class as a recoverable error type.' },
                { term: 'Carry data', detail: 'Fields on the exception convey details like the amount that was short.' },
                { term: 'Override toString', detail: 'A custom toString produces readable messages in logs and consoles.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 12. Enums & Extensions
  {
    id: "dart-enums-extensions",
    title: "Enums & Extensions",
    level: 1,
    slug: "enums-extensions",
    concepts: [],
    children: [
      {
        id: "dart-enums",
        title: "Enums",
        level: 2,
        slug: "enums",
        concepts: [
          {
            id: "dart-enum-basic",
            code: "enum Status { active, paused, stopped }\n\nvar s = Status.active;\ns.name;      // 'active'\ns.index;     // 0\nStatus.values; // [active, paused, stopped]",
            note: "An enum defines a fixed set of named constants. Each value exposes its `name` and `index`, and `values` lists them all in order. Enums are exhaustively checked in switch statements, so the compiler warns if you miss a case.",
            explanation: {
              heading: 'Fixed sets of constants',
              intro: 'An enum declares a closed set of named values, giving each a type safe identity instead of using loose strings or integers. Because the set is fixed, switches over an enum are checked for exhaustiveness.',
              points: [
                { term: 'Named constants', detail: 'Each enum value is a distinct constant of the enum type.' },
                { term: 'name and index', detail: 'Every value exposes its name as a string and its zero based index.' },
                { term: 'values list', detail: 'The static values getter returns all constants in declaration order.' },
                { term: 'Exhaustive switch', detail: 'A switch over an enum warns when a value is not handled.' },
              ],
            },
          },
          {
            id: "dart-enhanced-enum",
            code: "enum Planet {\n  earth(9.8),\n  mars(3.7);\n\n  final double gravity;\n  const Planet(this.gravity);\n}\n\nPlanet.mars.gravity; // 3.7",
            note: "Enhanced enums can declare fields, a const constructor, and methods, letting each constant carry data. This turns an enum into a compact, type-safe lookup table. It is far cleaner than parallel maps keyed by a plain enum.",
            explanation: {
              heading: 'Enums with data and behavior',
              intro: 'Enhanced enums let each constant hold its own field values through a const constructor and can define methods too. This turns an enum into a self contained, type safe lookup table.',
              points: [
                { term: 'Fields per value', detail: 'Each constant supplies constructor arguments so it carries associated data.' },
                { term: 'const constructor', detail: 'A const constructor initializes the fields for every enum value.' },
                { term: 'Methods allowed', detail: 'Enhanced enums can declare methods and getters like a normal class.' },
                { term: 'Replaces maps', detail: 'Data attached to constants avoids fragile parallel maps keyed by the enum.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: "dart-extensions",
        title: "Extension Methods",
        level: 2,
        slug: "extensions",
        concepts: [
          {
            id: "dart-extension-basic",
            code: "extension NumberParsing on String {\n  int toIntOrZero() => int.tryParse(this) ?? 0;\n}\n\n'42'.toIntOrZero();  // 42\n'oops'.toIntOrZero(); // 0",
            note: "Extension methods add functionality to an existing type without subclassing or modifying it. Inside the extension, `this` refers to the value being extended. They are resolved statically at compile time and are great for readable helpers on built-in types.",
            explanation: {
              heading: 'Adding methods to types',
              intro: 'Extension methods let you attach new methods to a type you do not own, such as String or int, without subclassing it. Inside the extension the keyword this refers to the value being extended.',
              points: [
                { term: 'No subclassing', detail: 'Extensions add behavior to an existing type without modifying or inheriting from it.' },
                { term: 'this is the value', detail: 'Within the extension body this refers to the instance the method is called on.' },
                { term: 'Static resolution', detail: 'Extensions are resolved at compile time based on the static type.' },
                { term: 'Readable helpers', detail: 'They are ideal for concise helper methods on built in types.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 13. Records & Patterns
  {
    id: "dart-records-patterns",
    title: "Records & Patterns",
    level: 1,
    slug: "records-patterns",
    concepts: [],
    children: [
      {
        id: "dart-records",
        title: "Records",
        level: 2,
        slug: "records",
        concepts: [
          {
            id: "dart-record-basic",
            code: "(String, int) getUser() => ('Ada', 36);\n\nvar user = getUser();\nuser.\$1;  // 'Ada'\nuser.\$2;  // 36\n\nvar point = (x: 1.0, y: 2.0); // named fields\npoint.x;  // 1.0",
            note: "A record is a lightweight, anonymous grouping of values, perfect for returning multiple results without defining a class. Positional fields are accessed as `\$1`, `\$2`, and named fields by their label. Records are immutable and compared by value.",
            explanation: {
              heading: 'Lightweight value groups',
              intro: 'A record bundles several values into one anonymous, immutable object without defining a class. It shines when a function needs to return more than one value at once.',
              points: [
                { term: 'Anonymous grouping', detail: 'A record combines values on the fly with no named type declaration.' },
                { term: 'Positional access', detail: 'Positional fields are read as dollar one, dollar two, and so on.' },
                { term: 'Named fields', detail: 'A record can label its fields and read them by that label.' },
                { term: 'Value equality', detail: 'Records are immutable and two with equal fields are considered equal.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: "dart-patterns",
        title: "Pattern Matching",
        level: 2,
        slug: "patterns",
        concepts: [
          {
            id: "dart-destructuring",
            code: "var (name, age) = ('Ada', 36); // destructure a record\nvar [first, second, ...rest] = [1, 2, 3, 4];\nvar {'id': id} = {'id': 7, 'name': 'x'};",
            note: "Patterns destructure records, lists, and maps directly in a declaration, pulling nested values into variables in one step. A rest element `...rest` captures the remaining list items. This removes boilerplate index and key access.",
            explanation: {
              heading: 'Destructuring values',
              intro: 'A pattern in a declaration pulls apart a record, list, or map and binds the inner values to variables in a single step. This removes the repetitive index and key access you would otherwise write.',
              points: [
                { term: 'Record patterns', detail: 'A parenthesized pattern binds each record field to its own variable.' },
                { term: 'List patterns', detail: 'A bracketed pattern binds elements by position.' },
                { term: 'Rest element', detail: 'Three dots followed by a name captures the remaining list items.' },
                { term: 'Map patterns', detail: 'A brace pattern extracts values by key into named variables.' },
              ],
            },
          },
          {
            id: "dart-switch-patterns",
            code: "String describe(Object o) => switch (o) {\n  int n when n < 0 => 'negative int',\n  int() => 'int',\n  String s => 'string of length \${s.length}',\n  _ => 'other',\n};",
            note: "A switch expression returns a value and matches against type and value patterns, with `when` adding a guard clause. The wildcard `_` is the catch-all. Combined with exhaustiveness checks, pattern switches make branching logic safe and concise.",
            explanation: {
              heading: 'Switch expressions and guards',
              intro: 'A switch expression evaluates to a value and matches its subject against type and value patterns rather than plain constants. A when guard adds an extra condition, and the wildcard handles everything else.',
              points: [
                { term: 'Returns a value', detail: 'Unlike a switch statement the expression form yields a value you can assign.' },
                { term: 'Type patterns', detail: 'Cases can match on the runtime type and bind the value at that type.' },
                { term: 'when guard', detail: 'A when clause adds a boolean condition that must also hold to match.' },
                { term: 'Wildcard catch-all', detail: 'The underscore pattern matches anything and completes exhaustiveness.' },
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
