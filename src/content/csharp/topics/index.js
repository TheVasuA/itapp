// C# topic tree.
//
// Each node is a ConceptNode: { id, title, level, slug?, concepts[], children[] }.
// Routable nodes carry a `slug`. Every Concept renders in the fixed order
// code -> note -> example (example optional).

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  // ─── 1. Variables & Data Types ─────────────────────────────────────
  {
    id: 'cs-variables',
    title: 'Variables & Data Types',
    level: 1,
    slug: 'variables',
    concepts: [],
    children: [
      {
        id: 'cs-value-types',
        title: 'Value Types',
        level: 2,
        slug: 'value-types',
        concepts: [
          {
            id: 'cs-value-types-intro',
            code: "int count = 42;\ndouble pi = 3.14159;\nbool isActive = true;\nchar letter = 'A';\ndecimal price = 19.99m;",
            note: 'Value types are stored on the stack and hold data directly. They include `int`, `double`, `decimal`, `bool`, `char`, `byte`, `long`, `float`, and custom structs.',
            explanation: {
              heading: 'How value types behave',
              intro: 'A value type holds its data directly rather than pointing to it elsewhere. When you assign one value type to another or pass it to a method, the runtime copies the whole value, so the two variables never share storage.',
              points: [
                { term: 'Copy semantics', detail: 'Assigning a value type copies every field, so modifying the copy leaves the original untouched.' },
                { term: 'Stack allocation', detail: 'Local value types typically live on the stack and are cleaned up automatically when the method returns, avoiding garbage collector work.' },
                { term: 'Default values', detail: 'An uninitialized value type is zeroed by the runtime, so numbers start at zero, bool starts at false, and char starts at the null character.' },
                { term: 'The decimal suffix', detail: 'Use the m suffix for decimal literals because decimal is base ten and better suited to money than the base two double type.' },
                { term: 'Custom structs', detail: 'A struct you define is also a value type, so it follows the same copy and stack rules as the built in numeric types.' },
              ],
            },
            example: "// Default values for uninitialized fields\nint x;       // 0\nbool flag;   // false\ndouble d;    // 0.0",
          },
          {
            id: 'cs-var-inference',
            code: "var name = \"Alice\";    // inferred as string\nvar nums = new[] { 1, 2, 3 }; // inferred as int[]\nvar map = new Dictionary<string, int>();",
            note: '`var` lets the compiler infer the type from the right-hand side. The variable is still statically typed — only the declaration is shorter.',
            explanation: {
              heading: 'How var inference works',
              intro: 'The var keyword asks the compiler to deduce the variable type from the expression on the right of the assignment. The result is exactly as strongly typed as if you had written the type by hand.',
              points: [
                { term: 'Compile time only', detail: 'Inference happens during compilation, so var carries no runtime cost and is not the same as a dynamic type.' },
                { term: 'Requires an initializer', detail: 'You must assign a value in the same statement because the compiler needs the expression to work out the type.' },
                { term: 'Reduces noise', detail: 'It shines when the type is long or obvious, such as a generic dictionary or an anonymous type from a query.' },
                { term: 'Readability tradeoff', detail: 'Prefer an explicit type when the inferred type is not clear from the right hand side, so a reader can still follow the code.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cs-reference-types',
        title: 'Reference Types & Strings',
        level: 2,
        slug: 'reference-types',
        concepts: [
          {
            id: 'cs-ref-types-intro',
            code: "string greeting = \"Hello, World!\";\nobject obj = 42;         // boxing\nint unboxed = (int)obj;  // unboxing\n\nstring? nullable = null; // nullable reference type",
            note: 'Reference types (class, string, array, object) are stored on the heap with a stack reference. Boxing wraps a value type in an object; unboxing extracts it.',
            explanation: {
              heading: 'How reference types work',
              intro: 'A reference type stores its data on the managed heap, and your variable holds a reference that points to that data. Copying the variable copies the reference, so two variables can observe the same underlying object.',
              points: [
                { term: 'Shared identity', detail: 'Assigning one reference to another makes both point at the same object, so a change through one is visible through the other.' },
                { term: 'Garbage collection', detail: 'Heap objects are reclaimed automatically by the garbage collector once no references remain, so you do not free them by hand.' },
                { term: 'Boxing', detail: 'Boxing copies a value type into a new heap object typed as object, which allocates memory and can hurt performance in hot loops.' },
                { term: 'Unboxing', detail: 'Unboxing casts a boxed object back to its exact value type, and using the wrong type throws an InvalidCastException.' },
                { term: 'Nullable references', detail: 'A reference can be null, and the nullable annotation with a question mark documents when null is an expected value.' },
              ],
            },
          },
          {
            id: 'cs-constants',
            code: "const double Gravity = 9.81;\nreadonly DateTime startTime = DateTime.Now;\n\n// const is compile-time, readonly is runtime\npublic static readonly int MaxRetries = 3;",
            note: '`const` values are embedded at compile time and must be primitives or strings. `readonly` fields can be set in constructors and hold any type.',
            explanation: {
              heading: 'Choosing const versus readonly',
              intro: 'Both keywords produce values that cannot change after they are set, but they differ in when the value is fixed and what types they allow. Picking the right one affects versioning and flexibility.',
              points: [
                { term: 'Compile time constants', detail: 'A const is baked into the calling code at compile time, so it must be a literal known at build and limited to primitives or strings.' },
                { term: 'Runtime immutability', detail: 'A readonly field is assigned once in a constructor or initializer and then frozen, allowing any type including objects and structs.' },
                { term: 'Versioning caution', detail: 'Because const values are copied into other assemblies at build time, changing one requires recompiling every consumer.' },
                { term: 'Implicit static', detail: 'A const is implicitly static and shared, while readonly can be per instance unless you also mark it static.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 2. Operators & Expressions ─────────────────────────────────────
  {
    id: 'cs-operators',
    title: 'Operators & Expressions',
    level: 1,
    slug: 'operators',
    concepts: [],
    children: [
      {
        id: 'cs-arithmetic-logical',
        title: 'Arithmetic & Logical Operators',
        level: 2,
        slug: 'arithmetic-logical',
        concepts: [
          {
            id: 'cs-arithmetic-ops',
            code: "int sum = 10 + 3;    // 13\nint mod = 10 % 3;   // 1\nbool and = true && false;  // false\nbool or = true || false;   // true\nint shifted = 1 << 3;     // 8",
            note: 'C# supports standard arithmetic (`+`, `-`, `*`, `/`, `%`), logical (`&&`, `||`, `!`), bitwise (`&`, `|`, `^`, `~`, `<<`, `>>`), and comparison (`==`, `!=`, `<`, `>`) operators.',
            explanation: {
              heading: 'Operator families and evaluation',
              intro: 'C# groups operators into arithmetic, logical, bitwise, and comparison families, each with its own precedence. Understanding how they evaluate prevents surprising results in mixed expressions.',
              points: [
                { term: 'Integer division', detail: 'Dividing two integers drops the fractional part, so cast one operand to double when you need a real quotient.' },
                { term: 'Short circuit logic', detail: 'The double ampersand and double pipe stop evaluating as soon as the outcome is known, which safely guards against null or costly calls.' },
                { term: 'Bitwise operators', detail: 'Single ampersand, pipe, caret, and the shift operators work on individual bits and are useful for flags and low level manipulation.' },
                { term: 'Precedence and parentheses', detail: 'Multiplication binds tighter than addition and logical and binds tighter than logical or, so add parentheses when intent is unclear.' },
              ],
            },
          },
          {
            id: 'cs-null-operators',
            code: "string? name = null;\nstring display = name ?? \"Unknown\";  // null-coalescing\nint? length = name?.Length;           // null-conditional\nname ??= \"Default\";                   // null-coalescing assignment",
            note: '`??` provides a fallback for null. `?.` short-circuits to null if the left side is null. `??=` assigns only when the variable is null.',
            explanation: {
              heading: 'Working with null gracefully',
              intro: 'The null operators let you handle possibly missing references without verbose if checks. They compose cleanly so long access chains stay readable and safe.',
              points: [
                { term: 'Null coalescing', detail: 'The double question mark returns the left operand when it is not null and otherwise falls back to the right operand.' },
                { term: 'Null conditional', detail: 'The question mark dot stops the whole expression and yields null the moment any link in the chain is null, avoiding a null reference exception.' },
                { term: 'Coalescing assignment', detail: 'The double question mark equals assigns a value only when the target is currently null, which is handy for lazy defaults.' },
                { term: 'Nullable value results', detail: 'Applying null conditional to a value type such as Length produces a nullable result, so the type becomes an int with a question mark.' },
              ],
            },
            example: "// Chaining null-conditional\nvar city = user?.Address?.City ?? \"N/A\";",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 3. Control Flow ────────────────────────────────────────────────
  {
    id: 'cs-control-flow',
    title: 'Control Flow',
    level: 1,
    slug: 'control-flow',
    concepts: [],
    children: [
      {
        id: 'cs-conditionals',
        title: 'Conditionals',
        level: 2,
        slug: 'conditionals',
        concepts: [
          {
            id: 'cs-if-else',
            code: "int score = 85;\nif (score >= 90)\n    Console.WriteLine(\"A\");\nelse if (score >= 80)\n    Console.WriteLine(\"B\");\nelse\n    Console.WriteLine(\"C\");\n\n// Ternary\nstring grade = score >= 60 ? \"Pass\" : \"Fail\";",
            note: 'Standard `if/else` branching. C# also supports the ternary operator for inline conditional expressions.',
            explanation: {
              heading: 'Branching with conditions',
              intro: 'The if and else statements steer execution based on a boolean condition, and the ternary operator lets a condition choose between two values inline. Both rely on expressions that evaluate to true or false.',
              points: [
                { term: 'Boolean only', detail: 'The condition must be a bool, so unlike some languages you cannot use a number or a reference directly as a truth value.' },
                { term: 'Chaining else if', detail: 'Stacking else if lets you test several mutually exclusive cases, and the first matching branch runs while the rest are skipped.' },
                { term: 'The ternary operator', detail: 'The condition then question value then colon value form returns one of two results and is best kept short for readability.' },
                { term: 'Braces for safety', detail: 'Using braces even for single statement branches avoids bugs when someone later adds a second line.' },
              ],
            },
          },
          {
            id: 'cs-switch-statement',
            code: "switch (dayOfWeek)\n{\n    case DayOfWeek.Monday:\n    case DayOfWeek.Tuesday:\n        Console.WriteLine(\"Early week\");\n        break;\n    case DayOfWeek.Friday:\n        Console.WriteLine(\"TGIF\");\n        break;\n    default:\n        Console.WriteLine(\"Other day\");\n        break;\n}",
            note: 'Switch statements require explicit `break` (no fall-through). Multiple case labels can share a body. Use `default` as a catch-all.',
            explanation: {
              heading: 'How switch statements branch',
              intro: 'A switch statement compares one value against several case labels and runs the matching block. C# forbids silent fall through, which removes a common source of bugs found in older languages.',
              points: [
                { term: 'No fall through', detail: 'Each case must end with break, return, or throw, so control cannot accidentally slide into the next case.' },
                { term: 'Shared bodies', detail: 'Stacking several case labels with no code between them lets multiple values run the same block.' },
                { term: 'The default label', detail: 'The default case handles any value that no other label matched and acts as a catch all.' },
                { term: 'Prefer switch expressions', detail: 'For returning a value, the newer switch expression form is more concise than a statement with assignments.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cs-loops',
        title: 'Loops',
        level: 2,
        slug: 'loops',
        concepts: [
          {
            id: 'cs-loop-types',
            code: "for (int i = 0; i < 5; i++)\n    Console.WriteLine(i);\n\nforeach (var item in collection)\n    Console.WriteLine(item);\n\nwhile (condition)\n    Process();\n\ndo { Retry(); } while (!success);",
            note: '`for` for counted loops, `foreach` for enumerables, `while` checks before each iteration, `do...while` guarantees at least one execution.',
            explanation: {
              heading: 'Choosing the right loop',
              intro: 'C# offers four looping constructs that differ in when the condition is tested and how the iteration variable is managed. Matching the loop to the task keeps intent clear.',
              points: [
                { term: 'The for loop', detail: 'It bundles initialization, condition, and step in one header, which suits counting a known number of iterations.' },
                { term: 'The foreach loop', detail: 'It iterates any type that implements IEnumerable, hiding the index so you focus on each element rather than positions.' },
                { term: 'While versus do while', detail: 'A while loop checks the condition before the first pass, while a do while runs the body once before checking.' },
                { term: 'Breaking and continuing', detail: 'Use break to exit early and continue to skip to the next iteration, but avoid modifying a collection while foreach iterates it.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 4. Arrays & Collections ────────────────────────────────────────
  {
    id: 'cs-arrays-collections',
    title: 'Arrays & Collections',
    level: 1,
    slug: 'arrays-collections',
    concepts: [],
    children: [
      {
        id: 'cs-arrays',
        title: 'Arrays',
        level: 2,
        slug: 'arrays',
        concepts: [
          {
            id: 'cs-array-basics',
            code: "int[] nums = { 1, 2, 3, 4, 5 };\nstring[] names = new string[3];\nint[,] matrix = { { 1, 2 }, { 3, 4 } };\nint[][] jagged = new int[3][];\n\nArray.Sort(nums);\nArray.Reverse(nums);\nint idx = Array.IndexOf(nums, 3);",
            note: 'Arrays are fixed-size, zero-indexed collections. C# supports single-dimensional, multi-dimensional (`[,]`), and jagged (`[][]`) arrays.',
            explanation: {
              heading: 'How arrays are laid out',
              intro: 'An array is a contiguous block of elements of one type whose length is fixed when it is created. Arrays are reference types, so the variable points at the block stored on the heap.',
              points: [
                { term: 'Fixed size', detail: 'Once allocated an array cannot grow, so choose a List when the number of elements changes over time.' },
                { term: 'Zero based indexing', detail: 'The first element is at index zero and the last at length minus one, and going outside that range throws an IndexOutOfRangeException.' },
                { term: 'Rectangular versus jagged', detail: 'A comma inside the brackets makes a true multi dimensional grid, while an array of arrays with double brackets lets rows vary in length.' },
                { term: 'Helper methods', detail: 'The static Array class offers Sort, Reverse, and IndexOf so you rarely write these loops by hand.' },
                { term: 'Range slicing', detail: 'The range operator produces a new array copy of the requested segment, leaving the source array untouched.' },
              ],
            },
            example: "// Slice with ranges (C# 8+)\nint[] slice = nums[1..4]; // { 2, 3, 4 }",
          },
        ],
        children: [],
      },
      {
        id: 'cs-generic-collections',
        title: 'Generic Collections',
        level: 2,
        slug: 'generic-collections',
        concepts: [
          {
            id: 'cs-list-dict',
            code: "var list = new List<int> { 1, 2, 3 };\nlist.Add(4);\nlist.RemoveAt(0);\n\nvar dict = new Dictionary<string, int>\n{\n    [\"alice\"] = 90,\n    [\"bob\"] = 85\n};\ndict.TryGetValue(\"alice\", out int score);",
            note: '`List<T>` is a resizable array. `Dictionary<TKey, TValue>` provides O(1) lookup by key. Use `TryGetValue` to avoid exceptions on missing keys.',
            explanation: {
              heading: 'Generic collection choices',
              intro: 'The generic collections in the System Collections Generic namespace give type safe containers with different performance profiles. Choosing the right one depends on how you add, find, and order elements.',
              points: [
                { term: 'List for sequences', detail: 'A List wraps a growable array with fast indexed access, and it resizes automatically as you add items.' },
                { term: 'Dictionary for lookup', detail: 'A Dictionary maps keys to values using a hash table, giving near constant time retrieval by key.' },
                { term: 'Safe key access', detail: 'Calling TryGetValue returns a bool and an out result instead of throwing when a key is missing.' },
                { term: 'Sets and adapters', detail: 'A HashSet stores unique items, while Queue and Stack model first in first out and last in first out order.' },
              ],
            },
            example: "var set = new HashSet<int> { 1, 2, 3 };\nset.Add(2); // no duplicate, count stays 3\n\nvar queue = new Queue<string>();\nvar stack = new Stack<string>();",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 5. Strings & Formatting ────────────────────────────────────────
  {
    id: 'cs-strings',
    title: 'Strings & Formatting',
    level: 1,
    slug: 'strings',
    concepts: [],
    children: [
      {
        id: 'cs-string-operations',
        title: 'String Operations',
        level: 2,
        slug: 'string-operations',
        concepts: [
          {
            id: 'cs-string-methods',
            code: "string s = \"Hello, World!\";\ns.Contains(\"World\");    // true\ns.StartsWith(\"He\");    // true\ns.ToUpper();           // \"HELLO, WORLD!\"\ns.Substring(7, 5);    // \"World\"\ns.Split(',');          // [\"Hello\", \" World!\"]\nstring.Join(\"-\", new[] { \"a\", \"b\", \"c\" }); // \"a-b-c\"",
            note: 'Strings are immutable in C#. Every operation returns a new string. Use `StringBuilder` for efficient repeated concatenation.',
            explanation: {
              heading: 'How string methods behave',
              intro: 'A string in C# is an immutable sequence of characters, so methods that seem to change it actually return a brand new string. The rich method set covers searching, slicing, and transforming text.',
              points: [
                { term: 'Immutability', detail: 'Because the original is never modified, methods like ToUpper and Substring hand back a new string that you must capture.' },
                { term: 'Searching', detail: 'Methods such as Contains, StartsWith, and IndexOf report whether or where a substring occurs.' },
                { term: 'Splitting and joining', detail: 'Split breaks a string into an array on a separator, and the static Join stitches pieces back together with a delimiter.' },
                { term: 'Efficient building', detail: 'Concatenating in a loop creates many throwaway strings, so use a StringBuilder to accumulate text in one buffer.' },
              ],
            },
          },
          {
            id: 'cs-string-interpolation',
            code: "var name = \"Alice\";\nvar age = 30;\n\n// Interpolation\nvar msg = $\"Name: {name}, Age: {age}\";\n\n// Raw string literals (C# 11)\nvar json = \"\"\"\n    {\n        \"name\": \"Alice\",\n        \"age\": 30\n    }\n    \"\"\";\n\n// Verbatim strings\nvar path = @\"C:\\Users\\Alice\\file.txt\";",
            note: '`$\"\"` enables interpolation. `@\"\"` is verbatim (no escape processing). `\"\"\"` raw string literals (C# 11) allow multi-line text without escaping.',
            explanation: {
              heading: 'String literal styles',
              intro: 'C# offers several literal forms so you can embed values, keep backslashes literal, or write multi line blocks cleanly. Each prefix changes how the compiler reads the text.',
              points: [
                { term: 'Interpolation', detail: 'A dollar sign prefix lets you place expressions in braces directly inside the string, which the runtime formats and inserts.' },
                { term: 'Verbatim strings', detail: 'An at sign prefix turns off escape processing so a backslash stays literal, which is ideal for file paths and regular expressions.' },
                { term: 'Raw string literals', detail: 'Triple quotes let you write multi line text containing quotes and braces with no escaping, and leading whitespace aligns to the closing quotes.' },
                { term: 'Combining prefixes', detail: 'You can mix the dollar sign and at sign to get an interpolated verbatim string when you need both features at once.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 6. Classes & Objects ───────────────────────────────────────────
  {
    id: 'cs-classes',
    title: 'Classes & Objects',
    level: 1,
    slug: 'classes',
    concepts: [],
    children: [
      {
        id: 'cs-class-basics',
        title: 'Class Fundamentals',
        level: 2,
        slug: 'class-basics',
        concepts: [
          {
            id: 'cs-class-define',
            code: "public class Person\n{\n    public string Name { get; set; }\n    public int Age { get; init; }\n\n    public Person(string name, int age)\n    {\n        Name = name;\n        Age = age;\n    }\n\n    public string Greet() => $\"Hi, I'm {Name}\";\n}",
            note: 'Classes are reference types with fields, properties, constructors, and methods. `init` setters allow assignment only during initialization.',
            explanation: {
              heading: 'Anatomy of a class',
              intro: 'A class is a blueprint for objects, bundling state as fields and properties with behavior as methods. Because a class is a reference type, instances live on the heap and are shared by reference.',
              points: [
                { term: 'Constructors', detail: 'A constructor runs when you use new and initializes the object, often taking arguments to set required state.' },
                { term: 'Fields and properties', detail: 'Fields hold raw data while properties expose it through get and set accessors, letting you add validation later.' },
                { term: 'Init only setters', detail: 'An init accessor allows assignment only during object initialization, which supports immutable data after construction.' },
                { term: 'Expression bodied members', detail: 'The fat arrow syntax gives a concise single expression body for methods and read only properties.' },
              ],
            },
            example: "var p = new Person(\"Alice\", 30);\nConsole.WriteLine(p.Greet()); // \"Hi, I'm Alice\"",
          },
          {
            id: 'cs-access-modifiers',
            code: "public class Account\n{\n    private decimal _balance;           // class only\n    protected string Owner { get; }     // class + derived\n    internal void Log() { }            // same assembly\n    public decimal Balance => _balance; // everywhere\n}",
            note: '`private` restricts to the class, `protected` allows derived classes, `internal` limits to the assembly, `public` has no restriction. Default for class members is `private`.',
            explanation: {
              heading: 'Controlling visibility',
              intro: 'Access modifiers set the boundary within which a member can be used, which is the foundation of encapsulation. Narrower access keeps implementation details hidden and easier to change.',
              points: [
                { term: 'Private members', detail: 'A private member is reachable only inside the declaring type, making it the safest default for fields.' },
                { term: 'Protected members', detail: 'A protected member is visible to the class and any type that derives from it, which supports controlled inheritance.' },
                { term: 'Internal members', detail: 'An internal member is available anywhere in the same assembly but hidden from outside code that references it.' },
                { term: 'Public surface', detail: 'A public member forms the external contract of your type, so keep it small and stable.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cs-properties',
        title: 'Properties & Indexers',
        level: 2,
        slug: 'properties',
        concepts: [
          {
            id: 'cs-prop-patterns',
            code: "public class Temperature\n{\n    private double _celsius;\n    public double Celsius\n    {\n        get => _celsius;\n        set => _celsius = value < -273.15\n            ? throw new ArgumentException(\"Below absolute zero\")\n            : value;\n    }\n    public double Fahrenheit => _celsius * 9 / 5 + 32;\n}\n\n// Required properties (C# 11)\npublic class Config\n{\n    public required string ConnectionString { get; init; }\n}",
            note: 'Properties encapsulate fields with get/set accessors. Expression-bodied members (`=>`) work for read-only properties. `required` enforces setting at construction.',
            explanation: {
              heading: 'Properties as smart fields',
              intro: 'A property looks like a field to callers but runs get and set accessors behind the scenes. This lets you validate input, compute values, and control mutability without changing the calling code.',
              points: [
                { term: 'Backing logic', detail: 'The set accessor can validate the incoming value and throw when it is invalid, protecting the object from bad state.' },
                { term: 'Computed properties', detail: 'A get only property with an expression body derives its value from other members each time it is read.' },
                { term: 'Auto properties', detail: 'Writing get and set with no body lets the compiler generate a hidden backing field for you.' },
                { term: 'Required members', detail: 'Marking a property required forces callers to assign it in the object initializer or the code will not compile.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 7. Structs & Records ───────────────────────────────────────────
  {
    id: 'cs-structs-records',
    title: 'Structs & Records',
    level: 1,
    slug: 'structs-records',
    concepts: [],
    children: [
      {
        id: 'cs-structs',
        title: 'Structs',
        level: 2,
        slug: 'structs',
        concepts: [
          {
            id: 'cs-struct-define',
            code: "public readonly struct Point\n{\n    public double X { get; }\n    public double Y { get; }\n\n    public Point(double x, double y) => (X, Y) = (x, y);\n\n    public double DistanceTo(Point other) =>\n        Math.Sqrt(Math.Pow(X - other.X, 2) + Math.Pow(Y - other.Y, 2));\n}",
            note: 'Structs are value types allocated on the stack. Use `readonly struct` to guarantee immutability. Prefer structs for small, data-centric types without inheritance needs.',
            explanation: {
              heading: 'When to reach for a struct',
              intro: 'A struct is a value type, so it is copied on assignment and often lives on the stack or inline within other objects. This can reduce allocations for small, frequently created data types.',
              points: [
                { term: 'Value semantics', detail: 'Each variable holds its own copy of a struct, so passing one to a method does not let that method change the caller copy unless you use ref.' },
                { term: 'Readonly structs', detail: 'Marking a struct readonly guarantees no member can mutate it, which the compiler enforces and can optimize.' },
                { term: 'No inheritance', detail: 'A struct cannot inherit from another struct or class, though it can implement interfaces.' },
                { term: 'Keep them small', detail: 'Large structs are expensive to copy, so prefer structs for small groups of related values and use classes otherwise.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cs-records',
        title: 'Records',
        level: 2,
        slug: 'records',
        concepts: [
          {
            id: 'cs-record-types',
            code: "// Positional record (immutable reference type)\npublic record Person(string Name, int Age);\n\n// Record struct (value type, C# 10)\npublic readonly record struct Coord(double X, double Y);\n\n// Non-destructive mutation with 'with'\nvar alice = new Person(\"Alice\", 30);\nvar older = alice with { Age = 31 };",
            note: 'Records provide value-based equality, immutability by default, and built-in `ToString`. `record class` is a reference type; `record struct` is a value type.',
            explanation: {
              heading: 'Records for data models',
              intro: 'A record is a type designed to hold immutable data, and the compiler generates value equality, a readable ToString, and support for non destructive copying. This makes records ideal for DTOs and domain values.',
              points: [
                { term: 'Value equality', detail: 'Two records are equal when all their members are equal, unlike classes which compare by reference by default.' },
                { term: 'Positional syntax', detail: 'Declaring parameters in the header creates init only properties and a matching constructor and deconstructor.' },
                { term: 'Non destructive mutation', detail: 'The with expression copies a record and changes only the named members, leaving the original untouched.' },
                { term: 'Class or struct', detail: 'A record class is a reference type while a record struct is a value type, so choose based on copy and sharing needs.' },
              ],
            },
            example: "// Records support deconstruction\nvar (name, age) = alice;\nConsole.WriteLine($\"{name} is {age}\"); // \"Alice is 30\"",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 8. Inheritance & Polymorphism ──────────────────────────────────
  {
    id: 'cs-inheritance',
    title: 'Inheritance & Polymorphism',
    level: 1,
    slug: 'inheritance',
    concepts: [],
    children: [
      {
        id: 'cs-class-inheritance',
        title: 'Class Inheritance',
        level: 2,
        slug: 'class-inheritance',
        concepts: [
          {
            id: 'cs-inherit-basics',
            code: "public class Animal\n{\n    public string Name { get; }\n    public Animal(string name) => Name = name;\n    public virtual string Speak() => \"...\";\n}\n\npublic class Dog : Animal\n{\n    public Dog(string name) : base(name) { }\n    public override string Speak() => \"Woof!\";\n}\n\npublic sealed class GoldenRetriever : Dog\n{\n    public GoldenRetriever(string name) : base(name) { }\n}",
            note: 'C# supports single class inheritance. `virtual` enables override in derived classes. `sealed` prevents further derivation. Use `base` to call parent constructors or methods.',
            explanation: {
              heading: 'Inheritance and polymorphism',
              intro: 'Inheritance lets a derived class reuse and extend a base class, and virtual methods enable the runtime to pick the right implementation based on the actual object type. This is the core of polymorphism.',
              points: [
                { term: 'Single base class', detail: 'A class can inherit from only one base class, though it may also implement many interfaces.' },
                { term: 'Virtual and override', detail: 'A base method marked virtual can be replaced in a derived class with override, and calls dispatch to the most derived version.' },
                { term: 'Calling the base', detail: 'The base keyword invokes the parent constructor or a parent method, letting you reuse rather than duplicate logic.' },
                { term: 'Sealing types', detail: 'Marking a class or override sealed stops further derivation, which can document intent and allow optimizations.' },
              ],
            },
            example: "Animal pet = new Dog(\"Rex\");\nConsole.WriteLine(pet.Speak()); // \"Woof!\" (runtime polymorphism)",
          },
        ],
        children: [],
      },
      {
        id: 'cs-casting-type-check',
        title: 'Type Checking & Casting',
        level: 2,
        slug: 'type-checking',
        concepts: [
          {
            id: 'cs-is-as-cast',
            code: "object obj = \"hello\";\n\n// is keyword\nif (obj is string s)\n    Console.WriteLine(s.ToUpper());\n\n// as keyword (returns null if cast fails)\nstring? str = obj as string;\n\n// Direct cast (throws if invalid)\nstring direct = (string)obj;",
            note: '`is` performs a type check and optional pattern variable. `as` returns null on failure (reference types only). Direct casts throw `InvalidCastException` on failure.',
            explanation: {
              heading: 'Testing and converting types',
              intro: 'C# gives three ways to check or change an object type at runtime, and they differ in how they handle failure. Choosing the right one keeps code both safe and clear.',
              points: [
                { term: 'The is operator', detail: 'It returns true when the object matches the type and can bind the result to a new variable in one step.' },
                { term: 'The as operator', detail: 'It attempts a reference conversion and yields null on failure instead of throwing, so always null check the result.' },
                { term: 'Direct cast', detail: 'A parenthesized cast converts when valid but throws InvalidCastException when the object is not the expected type.' },
                { term: 'Choosing safely', detail: 'Prefer is with a pattern for conditional logic and reserve a direct cast for when you are certain of the type.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 9. Interfaces ─────────────────────────────────────────────────
  {
    id: 'cs-interfaces',
    title: 'Interfaces',
    level: 1,
    slug: 'interfaces',
    concepts: [],
    children: [
      {
        id: 'cs-interface-basics',
        title: 'Interface Definition & Implementation',
        level: 2,
        slug: 'interface-basics',
        concepts: [
          {
            id: 'cs-interface-define',
            code: "public interface IRepository<T>\n{\n    T? GetById(int id);\n    IEnumerable<T> GetAll();\n    void Add(T entity);\n    void Delete(int id);\n}\n\npublic class UserRepository : IRepository<User>\n{\n    private readonly List<User> _users = new();\n    public User? GetById(int id) => _users.FirstOrDefault(u => u.Id == id);\n    public IEnumerable<User> GetAll() => _users;\n    public void Add(User entity) => _users.Add(entity);\n    public void Delete(int id) => _users.RemoveAll(u => u.Id == id);\n}",
            note: 'Interfaces define contracts without implementation. A class can implement multiple interfaces. C# 8+ allows default implementations in interfaces.',
            explanation: {
              heading: 'Interfaces as contracts',
              intro: 'An interface declares a set of members that an implementing type promises to provide, without saying how. Programming to interfaces decouples callers from concrete types and enables testing and substitution.',
              points: [
                { term: 'Pure contract', detail: 'A traditional interface has no state and no implementation, so each implementing class supplies the bodies.' },
                { term: 'Multiple implementation', detail: 'A class can implement several interfaces at once, which sidesteps the single base class limit for sharing capabilities.' },
                { term: 'Generic interfaces', detail: 'An interface can take type parameters, as with a repository of T, so the contract stays type safe across element types.' },
                { term: 'Loose coupling', detail: 'Depending on an interface rather than a class lets you swap implementations, which is the basis of dependency injection.' },
              ],
            },
          },
          {
            id: 'cs-interface-default',
            code: "public interface ILogger\n{\n    void Log(string message);\n\n    // Default implementation (C# 8+)\n    void LogError(string message) => Log($\"ERROR: {message}\");\n    void LogWarning(string message) => Log($\"WARN: {message}\");\n}",
            note: 'Default interface methods provide a body that implementing classes inherit without requiring explicit implementation. Useful for evolving interfaces without breaking existing code.',
            explanation: {
              heading: 'Default interface methods',
              intro: 'Since C# 8 an interface member can carry a body, giving implementing types a fallback they inherit automatically. This lets you add members to a published interface without breaking existing implementers.',
              points: [
                { term: 'Optional override', detail: 'A class gets the default behavior for free but may still provide its own override when it needs different logic.' },
                { term: 'Safe evolution', detail: 'Adding a defaulted member does not force every existing implementer to change, which avoids breaking downstream code.' },
                { term: 'Access through the interface', detail: 'A default member is generally callable only through an interface typed reference, not directly on the class.' },
                { term: 'Use sparingly', detail: 'Reserve default methods for extending contracts, not as a substitute for shared logic that a base class handles better.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 10. Abstract Classes ───────────────────────────────────────────
  {
    id: 'cs-abstract',
    title: 'Abstract Classes',
    level: 1,
    slug: 'abstract-classes',
    concepts: [],
    children: [
      {
        id: 'cs-abstract-definition',
        title: 'Abstract Members & Template Method',
        level: 2,
        slug: 'abstract-definition',
        concepts: [
          {
            id: 'cs-abstract-class',
            code: "public abstract class Shape\n{\n    public string Color { get; set; } = \"Red\";\n\n    // Must be implemented by derived classes\n    public abstract double Area();\n    public abstract double Perimeter();\n\n    // Shared logic\n    public void PrintInfo() =>\n        Console.WriteLine($\"{GetType().Name}: Area={Area():F2}\");\n}\n\npublic class Circle : Shape\n{\n    public double Radius { get; init; }\n    public override double Area() => Math.PI * Radius * Radius;\n    public override double Perimeter() => 2 * Math.PI * Radius;\n}",
            note: 'Abstract classes cannot be instantiated. They can mix abstract members (no body, must override) with concrete methods. Use when related classes share behavior but differ in specifics.',
            explanation: {
              heading: 'Abstract base classes',
              intro: 'An abstract class defines a partial implementation that derived classes complete. It suits families of related types that share common behavior but must each fill in specific details.',
              points: [
                { term: 'Cannot instantiate', detail: 'You cannot create an abstract class directly, so it exists only to be inherited and completed.' },
                { term: 'Abstract members', detail: 'An abstract method has no body and must be overridden by every non abstract derived class.' },
                { term: 'Shared concrete logic', detail: 'Abstract classes may include fields and fully implemented methods, unlike a pure interface, so common code lives in one place.' },
                { term: 'Template method pattern', detail: 'A concrete method can call abstract members to define an algorithm skeleton that subclasses customize.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 11. Generics ────────────────────────────────────────────────────
  {
    id: 'cs-generics',
    title: 'Generics',
    level: 1,
    slug: 'generics',
    concepts: [],
    children: [
      {
        id: 'cs-generic-classes-methods',
        title: 'Generic Types & Methods',
        level: 2,
        slug: 'generic-types',
        concepts: [
          {
            id: 'cs-generic-class',
            code: "public class Result<T>\n{\n    public T Value { get; }\n    public bool IsSuccess { get; }\n    public string? Error { get; }\n\n    private Result(T value) { Value = value; IsSuccess = true; }\n    private Result(string error) { Value = default!; IsSuccess = false; Error = error; }\n\n    public static Result<T> Ok(T value) => new(value);\n    public static Result<T> Fail(string error) => new(error);\n}",
            note: 'Generics let you write type-safe code without committing to a specific type. The compiler enforces constraints at compile time, avoiding runtime casts.',
            explanation: {
              heading: 'Writing generic types',
              intro: 'Generics let a class or method work over a type parameter that callers supply, so one implementation serves many concrete types. The compiler checks usage per type, which keeps code type safe and avoids casts.',
              points: [
                { term: 'Type parameters', detail: 'A placeholder such as T stands in for a real type chosen when the type or method is used.' },
                { term: 'No boxing', detail: 'Because the element type is known, value types are stored directly rather than boxed into object, improving performance.' },
                { term: 'Reusable logic', detail: 'A single generic definition like a result wrapper works for any payload type without duplicating code.' },
                { term: 'The default keyword', detail: 'The default of T expression yields the natural zero or null for whatever type is supplied.' },
              ],
            },
          },
          {
            id: 'cs-generic-constraints',
            code: "public T Max<T>(T a, T b) where T : IComparable<T>\n    => a.CompareTo(b) >= 0 ? a : b;\n\npublic class Factory<T> where T : class, new()\n{\n    public T Create() => new T();\n}\n\n// Multiple constraints\npublic void Process<T>(T item)\n    where T : IDisposable, ICloneable\n{\n    var copy = (T)item.Clone();\n    copy.Dispose();\n}",
            note: 'Constraints restrict type parameters: `where T : struct` (value type), `where T : class` (reference type), `where T : new()` (parameterless constructor), `where T : BaseClass`, `where T : IInterface`.',
            explanation: {
              heading: 'Constraining type parameters',
              intro: 'A where clause narrows which types may be used for a type parameter, which unlocks the operations those types guarantee. Constraints let generic code call members it could not otherwise assume exist.',
              points: [
                { term: 'Interface constraints', detail: 'Requiring where T implements IComparable lets the method call CompareTo on any supplied type.' },
                { term: 'Class and struct', detail: 'The class constraint limits T to reference types while struct limits it to value types.' },
                { term: 'Constructor constraint', detail: 'The new constraint promises a public parameterless constructor so the code can write new T.' },
                { term: 'Combining constraints', detail: 'You can list several constraints together, and they all must hold for a type to qualify.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 12. LINQ ──────────────────────────────────────────────────────
  {
    id: 'cs-linq',
    title: 'LINQ',
    level: 1,
    slug: 'linq',
    concepts: [],
    children: [
      {
        id: 'cs-linq-methods',
        title: 'LINQ Method Syntax',
        level: 2,
        slug: 'linq-methods',
        concepts: [
          {
            id: 'cs-linq-basics',
            code: "var numbers = new[] { 5, 3, 8, 1, 9, 2, 7 };\n\nvar evens = numbers.Where(n => n % 2 == 0);           // { 8, 2 }\nvar doubled = numbers.Select(n => n * 2);             // { 10, 6, 16, ... }\nvar sorted = numbers.OrderBy(n => n);                 // { 1, 2, 3, ... }\nvar first = numbers.First(n => n > 5);                // 8\nvar sum = numbers.Sum();                              // 35\nvar any = numbers.Any(n => n > 10);                   // false",
            note: 'LINQ extends `IEnumerable<T>` with declarative query methods. Execution is deferred (lazy) until the result is iterated or a terminal operation (`.ToList()`, `.Count()`) is called.',
            explanation: {
              heading: 'LINQ method syntax basics',
              intro: 'LINQ adds a set of extension methods over sequences so you describe what you want rather than how to loop. Many operators are lazy, building a pipeline that only runs when the result is enumerated.',
              points: [
                { term: 'Filtering and projecting', detail: 'Where keeps elements that match a predicate and Select transforms each element into a new shape.' },
                { term: 'Deferred execution', detail: 'Operators like Where and Select do not run immediately, so the query executes when you iterate it or call a terminal method.' },
                { term: 'Terminal operators', detail: 'Methods such as ToList, Count, First, and Sum force execution and produce a concrete result.' },
                { term: 'Beware multiple enumeration', detail: 'Iterating a deferred query twice runs it twice, so materialize with ToList when you need to reuse results.' },
              ],
            },
          },
          {
            id: 'cs-linq-advanced',
            code: "var people = new List<Person> { /* ... */ };\n\n// GroupBy\nvar byAge = people.GroupBy(p => p.Age / 10 * 10)\n    .Select(g => new { Decade = g.Key, Count = g.Count() });\n\n// SelectMany (flatten)\nvar allTags = posts.SelectMany(p => p.Tags).Distinct();\n\n// Aggregate\nvar csv = names.Aggregate((a, b) => $\"{a},{b}\");",
            note: '`GroupBy` partitions sequences. `SelectMany` flattens nested collections. `Aggregate` reduces a sequence to a single value (like `reduce` in other languages).',
            explanation: {
              heading: 'Advanced LINQ operators',
              intro: 'Beyond simple filters, LINQ offers operators that reshape data in powerful ways. Grouping, flattening, and reducing cover most analytical transformations you need over collections.',
              points: [
                { term: 'Grouping', detail: 'GroupBy partitions a sequence into groups keyed by a selector, and each group exposes its key and its members.' },
                { term: 'Flattening', detail: 'SelectMany projects each element to a sequence and concatenates them, turning nested collections into one flat stream.' },
                { term: 'Reducing', detail: 'Aggregate folds a sequence into a single accumulated value using a combining function, similar to reduce elsewhere.' },
                { term: 'Composability', detail: 'These operators chain with Where and Select so a single expression can filter, group, and summarize.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cs-linq-query',
        title: 'LINQ Query Syntax',
        level: 2,
        slug: 'linq-query',
        concepts: [
          {
            id: 'cs-linq-query-expr',
            code: "var results =\n    from student in students\n    where student.Grade >= 80\n    orderby student.Name\n    select new { student.Name, student.Grade };\n\n// Join\nvar joined =\n    from order in orders\n    join customer in customers on order.CustomerId equals customer.Id\n    select new { customer.Name, order.Total };",
            note: 'Query syntax is an alternative SQL-like form compiled to the same method calls. Use whichever is more readable — method syntax is more common for simple transforms.',
            explanation: {
              heading: 'LINQ query syntax',
              intro: 'Query syntax gives LINQ a declarative SQL like shape with from, where, orderby, and select clauses. The compiler rewrites it into the same method calls, so the two styles are fully equivalent.',
              points: [
                { term: 'Range variables', detail: 'The from clause introduces a range variable that stands for each element as the query flows through later clauses.' },
                { term: 'Clause order', detail: 'A query starts with from and ends with select or group, which reads naturally from source to result.' },
                { term: 'Joins', detail: 'The join clause with equals correlates two sequences on matching keys, similar to a database join.' },
                { term: 'When to choose it', detail: 'Query syntax often reads better for joins and multiple range variables, while method syntax suits simple single step transforms.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 13. Async / Await / Task ───────────────────────────────────────
  {
    id: 'cs-async',
    title: 'Async & Await',
    level: 1,
    slug: 'async-await',
    concepts: [],
    children: [
      {
        id: 'cs-async-basics',
        title: 'Async Methods & Task',
        level: 2,
        slug: 'async-basics',
        concepts: [
          {
            id: 'cs-async-method',
            code: "public async Task<string> FetchDataAsync(string url)\n{\n    using var client = new HttpClient();\n    var response = await client.GetStringAsync(url);\n    return response;\n}\n\n// Calling async code\nvar data = await FetchDataAsync(\"https://api.example.com/data\");",
            note: '`async` marks a method as asynchronous. `await` suspends execution until the `Task` completes without blocking the thread. Always return `Task` or `Task<T>` from async methods.',
            explanation: {
              heading: 'Async methods and Task',
              intro: 'The async and await keywords let you write non blocking code that reads like sequential code. A Task represents work in progress, and awaiting it frees the current thread until the result is ready.',
              points: [
                { term: 'Non blocking waits', detail: 'Awaiting a Task releases the thread to do other work rather than sitting idle, which keeps apps responsive and scalable.' },
                { term: 'Return types', detail: 'An async method returns Task when it produces no value, Task of T when it produces a value, and void only for event handlers.' },
                { term: 'Awaiting results', detail: 'The await keyword unwraps the Task result and rethrows any exception the operation captured.' },
                { term: 'Avoid blocking', detail: 'Calling Result or Wait on a Task can deadlock, so await all the way up rather than blocking on async code.' },
              ],
            },
          },
          {
            id: 'cs-async-patterns',
            code: "// Run multiple tasks concurrently\nvar task1 = FetchDataAsync(\"url1\");\nvar task2 = FetchDataAsync(\"url2\");\nvar results = await Task.WhenAll(task1, task2);\n\n// Timeout with cancellation\nusing var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));\nawait DoWorkAsync(cts.Token);\n\n// ValueTask for hot-path optimization\npublic ValueTask<int> GetCachedAsync()\n    => _cache != null ? new ValueTask<int>(_cache.Value) : new ValueTask<int>(LoadAsync());",
            note: '`Task.WhenAll` awaits multiple tasks concurrently. `CancellationToken` enables cooperative cancellation. `ValueTask<T>` avoids heap allocation when results are often synchronous.',
            explanation: {
              heading: 'Async coordination patterns',
              intro: 'Real async code often runs several operations at once, needs to be cancellable, and must stay efficient on hot paths. A few library types cover these needs cleanly.',
              points: [
                { term: 'Concurrent awaits', detail: 'Starting tasks first then awaiting Task WhenAll runs them in parallel rather than one after another.' },
                { term: 'Cooperative cancellation', detail: 'Passing a CancellationToken lets long running work observe a cancel request and stop promptly.' },
                { term: 'ValueTask optimization', detail: 'A ValueTask avoids allocating when a result is frequently available synchronously, such as a cache hit.' },
                { term: 'Do not await twice', detail: 'A ValueTask should be awaited only once, so convert it with AsTask if you need to await it repeatedly.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cs-async-streams',
        title: 'Async Streams',
        level: 2,
        slug: 'async-streams',
        concepts: [
          {
            id: 'cs-iasyncenumerable',
            code: "public async IAsyncEnumerable<int> GenerateAsync()\n{\n    for (int i = 0; i < 10; i++)\n    {\n        await Task.Delay(100);\n        yield return i;\n    }\n}\n\n// Consuming\nawait foreach (var item in GenerateAsync())\n    Console.WriteLine(item);",
            note: '`IAsyncEnumerable<T>` (C# 8) enables asynchronous iteration with `await foreach`. The producer yields items as they become available without buffering the entire collection.',
            explanation: {
              heading: 'Streaming data asynchronously',
              intro: 'An async stream lets a method produce a sequence over time, awaiting between items, while the consumer pulls them with await foreach. This suits paged APIs and live feeds where data arrives gradually.',
              points: [
                { term: 'Async iterators', detail: 'Combining yield return with async lets a method emit items one at a time without buffering the whole set in memory.' },
                { term: 'Consuming with await foreach', detail: 'The await foreach loop awaits each item as it arrives, keeping the thread free between elements.' },
                { term: 'Backpressure friendly', detail: 'Because items flow on demand, the producer only advances as fast as the consumer reads.' },
                { term: 'Cancellation support', detail: 'An async stream can accept a cancellation token so a long lived enumeration can be stopped cleanly.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 14. Delegates & Events ─────────────────────────────────────────
  {
    id: 'cs-delegates-events',
    title: 'Delegates & Events',
    level: 1,
    slug: 'delegates-events',
    concepts: [],
    children: [
      {
        id: 'cs-delegates',
        title: 'Delegates',
        level: 2,
        slug: 'delegates',
        concepts: [
          {
            id: 'cs-delegate-basics',
            code: "// Custom delegate type\npublic delegate int MathOp(int a, int b);\n\n// Built-in delegates\nFunc<int, int, int> add = (a, b) => a + b;\nAction<string> print = msg => Console.WriteLine(msg);\nPredicate<int> isEven = n => n % 2 == 0;\n\n// Usage\nint result = add(3, 4);  // 7\nprint(\"Hello\");          // prints \"Hello\"\nbool check = isEven(6);  // true",
            note: '`Func<...>` returns a value (last type param is return type). `Action<...>` returns void. `Predicate<T>` returns bool. These cover most delegate needs without custom declarations.',
            explanation: {
              heading: 'Delegates as method references',
              intro: 'A delegate is a type safe reference to a method, letting you pass behavior as a value. The built in generic delegates cover almost every signature, so you rarely need to declare your own.',
              points: [
                { term: 'Func for results', detail: 'A Func takes zero or more inputs and returns a value, with the last type argument naming the return type.' },
                { term: 'Action for side effects', detail: 'An Action takes inputs but returns nothing, which fits callbacks that only perform an operation.' },
                { term: 'Predicate for tests', detail: 'A Predicate takes one argument and returns a bool, commonly used for filtering.' },
                { term: 'Multicast delegates', detail: 'Delegates can chain multiple methods with plus equals, invoking them in order when the delegate is called.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cs-events',
        title: 'Events',
        level: 2,
        slug: 'events',
        concepts: [
          {
            id: 'cs-event-pattern',
            code: "public class Button\n{\n    public event EventHandler<ClickEventArgs>? Clicked;\n\n    protected virtual void OnClicked(ClickEventArgs e)\n        => Clicked?.Invoke(this, e);\n\n    public void SimulateClick()\n        => OnClicked(new ClickEventArgs { X = 10, Y = 20 });\n}\n\npublic class ClickEventArgs : EventArgs\n{\n    public int X { get; init; }\n    public int Y { get; init; }\n}\n\n// Subscribe\nvar btn = new Button();\nbtn.Clicked += (sender, e) => Console.WriteLine($\"Click at ({e.X},{e.Y})\");",
            note: 'Events use the publisher-subscriber pattern. Declare with `event` keyword to restrict invocation to the declaring class. Subscribers attach with `+=` and detach with `-=`.',
            explanation: {
              heading: 'The event pattern',
              intro: 'An event is a delegate wrapped with access rules so only the declaring type can raise it while outsiders can subscribe. This is how types notify interested listeners without knowing who they are.',
              points: [
                { term: 'Publisher and subscribers', detail: 'The declaring class raises the event and any number of subscribers register handlers to react.' },
                { term: 'Attach and detach', detail: 'Subscribers add a handler with plus equals and should remove it with minus equals to avoid memory leaks.' },
                { term: 'Safe raising', detail: 'Invoking the event through the null conditional operator prevents a null reference when there are no subscribers.' },
                { term: 'Standard signature', detail: 'The conventional handler takes a sender object and an EventArgs derived type, which keeps events consistent across the framework.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 15. Lambda Expressions ─────────────────────────────────────────
  {
    id: 'cs-lambdas',
    title: 'Lambda Expressions',
    level: 1,
    slug: 'lambdas',
    concepts: [],
    children: [
      {
        id: 'cs-lambda-syntax',
        title: 'Lambda Syntax & Closures',
        level: 2,
        slug: 'lambda-syntax',
        concepts: [
          {
            id: 'cs-lambda-forms',
            code: "// Expression lambda\nFunc<int, int> square = x => x * x;\n\n// Statement lambda\nFunc<int, int, int> max = (a, b) =>\n{\n    if (a >= b) return a;\n    return b;\n};\n\n// Discard unused parameters\nbutton.Clicked += (_, _) => Console.WriteLine(\"Clicked!\");\n\n// Natural type (C# 10)\nvar parse = (string s) => int.Parse(s);",
            note: 'Lambdas are anonymous functions. Expression lambdas have a single expression body. Statement lambdas use braces for multiple statements. C# 10 supports natural type inference for lambdas.',
            explanation: {
              heading: 'Lambda expression forms',
              intro: 'A lambda is a concise inline function you can assign to a delegate or pass as an argument. C# supports both a compact expression form and a fuller statement form for more logic.',
              points: [
                { term: 'Expression lambdas', detail: 'A single expression after the arrow becomes the return value, ideal for short projections and predicates.' },
                { term: 'Statement lambdas', detail: 'Wrapping the body in braces allows multiple statements and explicit return statements for richer logic.' },
                { term: 'Discards', detail: 'Naming an unused parameter with an underscore signals that the lambda ignores it, which is common in event handlers.' },
                { term: 'Natural typing', detail: 'Since C# 10 a lambda can be assigned to var because the compiler infers a matching delegate type.' },
              ],
            },
          },
          {
            id: 'cs-lambda-closure',
            code: "int multiplier = 3;\nFunc<int, int> multiply = x => x * multiplier;\n\nConsole.WriteLine(multiply(5)); // 15\nmultiplier = 10;\nConsole.WriteLine(multiply(5)); // 50 (captures variable, not value)",
            note: 'Lambdas capture variables by reference (closures). The enclosed variable is shared, so changes to it after the lambda is created affect the lambda behavior.',
            explanation: {
              heading: 'Closures over variables',
              intro: 'When a lambda uses a variable from its surrounding scope it forms a closure, capturing that variable rather than a snapshot of its value. The captured variable is shared, so later changes are visible inside the lambda.',
              points: [
                { term: 'Capture by reference', detail: 'The lambda holds the variable itself, so mutating it after creating the lambda changes what the lambda sees.' },
                { term: 'Extended lifetime', detail: 'A captured local outlives its normal scope because the compiler moves it into a hidden object kept alive by the lambda.' },
                { term: 'Loop variable pitfall', detail: 'Capturing a loop variable can surprise you, so copy it into a local inside the loop when each lambda needs its own value.' },
                { term: 'Useful for callbacks', detail: 'Closures let event handlers and deferred work remember context without passing it through parameters.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 16. Enums ──────────────────────────────────────────────────────
  {
    id: 'cs-enums',
    title: 'Enums',
    level: 1,
    slug: 'enums',
    concepts: [],
    children: [
      {
        id: 'cs-enum-usage',
        title: 'Enum Definition & Flags',
        level: 2,
        slug: 'enum-usage',
        concepts: [
          {
            id: 'cs-enum-basics',
            code: "public enum Direction { North, South, East, West }\n\npublic enum HttpStatus : ushort\n{\n    Ok = 200,\n    NotFound = 404,\n    ServerError = 500\n}\n\n// Flags enum for bitwise combinations\n[Flags]\npublic enum Permissions\n{\n    None = 0,\n    Read = 1,\n    Write = 2,\n    Execute = 4,\n    All = Read | Write | Execute\n}",
            note: 'Enums define named constants backed by an integral type (default `int`). `[Flags]` enables bitwise combination. Use enums to avoid magic numbers and add type safety.',
            explanation: {
              heading: 'Named constants and flags',
              intro: 'An enum gives friendly names to a fixed set of related integer values, improving readability and type safety. Marking one with the Flags attribute lets you combine members as bit fields.',
              points: [
                { term: 'Underlying type', detail: 'By default an enum is backed by int, but you can choose another integral type such as ushort when size matters.' },
                { term: 'Explicit values', detail: 'You can assign specific numbers, which is important for wire protocols like HTTP status codes.' },
                { term: 'Flags enums', detail: 'Assigning power of two values and adding the Flags attribute lets you combine and test options with bitwise operators.' },
                { term: 'Parsing and checking', detail: 'Enum Parse converts a string to a member, and HasFlag tests whether a combined value contains a given flag.' },
              ],
            },
            example: "var perms = Permissions.Read | Permissions.Write;\nbool canWrite = perms.HasFlag(Permissions.Write); // true\n\n// Parsing\nvar dir = Enum.Parse<Direction>(\"North\");",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 17. Exception Handling ─────────────────────────────────────────
  {
    id: 'cs-exceptions',
    title: 'Exception Handling',
    level: 1,
    slug: 'exceptions',
    concepts: [],
    children: [
      {
        id: 'cs-try-catch',
        title: 'Try / Catch / Finally',
        level: 2,
        slug: 'try-catch',
        concepts: [
          {
            id: 'cs-exception-handling',
            code: "try\n{\n    var data = File.ReadAllText(\"config.json\");\n    var config = JsonSerializer.Deserialize<Config>(data);\n}\ncatch (FileNotFoundException ex)\n{\n    Console.WriteLine($\"File not found: {ex.FileName}\");\n}\ncatch (JsonException ex) when (ex.LineNumber > 0)\n{\n    Console.WriteLine($\"JSON error at line {ex.LineNumber}\");\n}\ncatch (Exception ex)\n{\n    Logger.LogError(ex, \"Unexpected error\");\n    throw; // re-throw preserving stack trace\n}\nfinally\n{\n    Console.WriteLine(\"Cleanup complete\");\n}",
            note: 'Catch specific exceptions first, general last. `when` adds filter conditions. `throw;` re-throws preserving the original stack trace. `finally` always executes for cleanup.',
            explanation: {
              heading: 'Structured exception handling',
              intro: 'A try block guards code that may fail, catch blocks handle specific errors, and a finally block runs cleanup no matter what. Ordering and rethrow style determine whether diagnostics stay intact.',
              points: [
                { term: 'Specific before general', detail: 'List narrower exception types first because the runtime uses the first matching catch and a broad Exception catch would shadow the rest.' },
                { term: 'Exception filters', detail: 'The when keyword adds a condition so a catch runs only when the filter is true, keeping the stack intact otherwise.' },
                { term: 'Preserving the stack', detail: 'A bare throw rethrows the current exception with its original stack trace, unlike throw ex which resets it.' },
                { term: 'Guaranteed cleanup', detail: 'Code in finally runs whether or not an exception occurred, which is the right place to release resources.' },
              ],
            },
          },
          {
            id: 'cs-custom-exception',
            code: "public class OrderException : Exception\n{\n    public string OrderId { get; }\n\n    public OrderException(string orderId, string message)\n        : base(message)\n    {\n        OrderId = orderId;\n    }\n\n    public OrderException(string orderId, string message, Exception inner)\n        : base(message, inner)\n    {\n        OrderId = orderId;\n    }\n}",
            note: 'Custom exceptions derive from `Exception`. Include relevant context as properties. Always provide the inner exception constructor for exception chaining.',
            explanation: {
              heading: 'Designing custom exceptions',
              intro: 'A custom exception type communicates a specific failure and can carry extra context that helps callers respond. Deriving from Exception and following conventions makes it fit naturally into the framework.',
              points: [
                { term: 'Carry context', detail: 'Adding properties like an order identifier lets a handler act on the specific data that failed.' },
                { term: 'Inner exception constructor', detail: 'Accepting an inner exception preserves the original cause so the full chain appears in logs.' },
                { term: 'Pass the message up', detail: 'Calling the base constructor with a message ensures the standard Message property is populated.' },
                { term: 'Use sparingly', detail: 'Create a custom type only when callers need to distinguish it, otherwise reuse existing framework exceptions.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 18. Pattern Matching ───────────────────────────────────────────
  {
    id: 'cs-pattern-matching',
    title: 'Pattern Matching',
    level: 1,
    slug: 'pattern-matching',
    concepts: [],
    children: [
      {
        id: 'cs-patterns-switch',
        title: 'Switch Expressions & Patterns',
        level: 2,
        slug: 'patterns-switch',
        concepts: [
          {
            id: 'cs-switch-expression',
            code: "// Type patterns in switch expression\nstring Describe(object obj) => obj switch\n{\n    int n when n < 0 => \"negative\",\n    int n => $\"integer: {n}\",\n    string s => $\"string of length {s.Length}\",\n    null => \"null\",\n    _ => \"unknown\"\n};\n\n// Relational & logical patterns (C# 9)\nstring GetDiscount(int quantity) => quantity switch\n{\n    <= 0 => throw new ArgumentException(\"Invalid\"),\n    < 10 => \"No discount\",\n    >= 10 and < 50 => \"10% off\",\n    >= 50 => \"25% off\"\n};",
            note: 'Switch expressions (C# 8) return values directly. C# 9 adds relational (`<`, `>=`) and logical (`and`, `or`, `not`) patterns for expressive conditions without temporary variables.',
            explanation: {
              heading: 'Switch expressions and patterns',
              intro: 'A switch expression maps an input to a result value using patterns rather than statement blocks. Combined with relational and logical patterns it replaces long if chains with concise, exhaustive matching.',
              points: [
                { term: 'Value producing', detail: 'Unlike a switch statement, a switch expression evaluates to a value you can assign or return directly.' },
                { term: 'Type patterns', detail: 'Matching on a type binds the input to a typed variable so the arm can use it without a cast.' },
                { term: 'Relational and logical', detail: 'Patterns like less than ten combined with and or or express numeric ranges cleanly.' },
                { term: 'Exhaustiveness', detail: 'The underscore discard arm handles anything unmatched, and the compiler warns when cases may be missing.' },
              ],
            },
          },
          {
            id: 'cs-property-pattern',
            code: "// Property patterns\nstring EvaluateOrder(Order order) => order switch\n{\n    { Total: > 1000, Customer.IsPremium: true } => \"Priority shipping\",\n    { Total: > 500 } => \"Free shipping\",\n    { Items.Count: 0 } => \"Empty order\",\n    _ => \"Standard shipping\"\n};\n\n// List patterns (C# 11)\nint[] arr = { 1, 2, 3, 4 };\nvar result = arr switch\n{\n    [1, 2, ..] => \"Starts with 1,2\",\n    [.., 4] => \"Ends with 4\",\n    [] => \"Empty\",\n    _ => \"Other\"\n};",
            note: 'Property patterns match on nested properties. List patterns (C# 11) match array/list structure with `..` as a slice/discard. Patterns compose for complex matching logic.',
            explanation: {
              heading: 'Property and list patterns',
              intro: 'Advanced patterns let you match against the shape of data, from nested property values to the structure of a sequence. They compose so a single arm can express a rich condition.',
              points: [
                { term: 'Property patterns', detail: 'Braces let you match on member values, and you can drill into nested members with a dotted path.' },
                { term: 'List patterns', detail: 'Square bracket patterns match a sequence by position, so you can require specific leading or trailing elements.' },
                { term: 'Slice pattern', detail: 'The two dot slice matches any number of elements, letting you ignore the middle while pinning the ends.' },
                { term: 'Composition', detail: 'Property, relational, and list patterns nest freely, replacing tangled conditionals with one readable expression.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 19. Nullable Reference Types ───────────────────────────────────
  {
    id: 'cs-nullable',
    title: 'Nullable Reference Types',
    level: 1,
    slug: 'nullable-types',
    concepts: [],
    children: [
      {
        id: 'cs-nullable-usage',
        title: 'Nullable Annotations & Flow Analysis',
        level: 2,
        slug: 'nullable-usage',
        concepts: [
          {
            id: 'cs-nullable-ref',
            code: "#nullable enable\n\npublic class UserService\n{\n    // Non-nullable: compiler warns if null is assigned\n    public string GetName(int id) => _repo.Find(id)?.Name ?? \"Unknown\";\n\n    // Nullable: caller must handle null\n    public User? FindUser(string email)\n        => _users.FirstOrDefault(u => u.Email == email);\n\n    // Null-forgiving operator (trust me, compiler)\n    public string ForceGet(int id) => _repo.Find(id)!.Name;\n}",
            note: 'Enable nullable context with `#nullable enable` or in the project file. `T?` annotates references that may be null. The compiler warns on potential null dereferences. Use `!` sparingly to suppress false positives.',
            explanation: {
              heading: 'Nullable reference types',
              intro: 'The nullable reference feature turns null intent into part of the type, letting the compiler track where null is allowed and warn about unsafe dereferences. It is an opt in analysis rather than a runtime change.',
              points: [
                { term: 'Annotations', detail: 'A reference type without a question mark is treated as non null, while adding a question mark marks it as possibly null.' },
                { term: 'Flow analysis', detail: 'The compiler follows null checks through your code and only warns when a value could still be null at the point of use.' },
                { term: 'The null forgiving operator', detail: 'A trailing exclamation mark tells the compiler you know a value is not null, which should be used only when you are certain.' },
                { term: 'Opt in context', detail: 'You enable the feature with a directive or a project setting, and it produces warnings rather than blocking compilation.' },
              ],
            },
            example: "// Null parameter checking (C# 11)\npublic void Process(string name!!)\n{\n    // throws ArgumentNullException if name is null\n}",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 20. Tuples & Deconstruction ────────────────────────────────────
  {
    id: 'cs-tuples',
    title: 'Tuples & Deconstruction',
    level: 1,
    slug: 'tuples',
    concepts: [],
    children: [
      {
        id: 'cs-tuple-usage',
        title: 'ValueTuple & Deconstruction',
        level: 2,
        slug: 'tuple-usage',
        concepts: [
          {
            id: 'cs-tuple-basics',
            code: "// Named tuples\n(string Name, int Age) person = (\"Alice\", 30);\nConsole.WriteLine(person.Name); // \"Alice\"\n\n// Return multiple values\npublic (int Min, int Max) GetRange(int[] numbers)\n    => (numbers.Min(), numbers.Max());\n\nvar range = GetRange(new[] { 3, 1, 7, 2 });\nConsole.WriteLine($\"{range.Min} to {range.Max}\"); // \"1 to 7\"",
            note: 'Value tuples are lightweight structs for grouping values. Named elements improve readability. They are ideal for returning multiple values without creating a dedicated type.',
            explanation: {
              heading: 'Grouping values with tuples',
              intro: 'A value tuple bundles several values into one lightweight structure without declaring a class. It is a value type, so it is copied on assignment and well suited to returning multiple results.',
              points: [
                { term: 'Named elements', detail: 'Giving tuple elements names like Min and Max makes the members self documenting at the call site.' },
                { term: 'Multiple returns', detail: 'A method can return a tuple to hand back several values at once instead of using out parameters.' },
                { term: 'Value semantics', detail: 'Because it is a struct, a tuple compares by its contents and copies its fields on assignment.' },
                { term: 'Lightweight not a model', detail: 'Tuples suit small transient groupings, but prefer a record or class when the data has meaning across the codebase.' },
              ],
            },
          },
          {
            id: 'cs-deconstruction',
            code: "// Deconstruct tuples\nvar (name, age) = person;\n\n// Deconstruct custom types\npublic class Point\n{\n    public double X { get; }\n    public double Y { get; }\n    public void Deconstruct(out double x, out double y)\n        => (x, y) = (X, Y);\n}\n\nvar p = new Point(3, 4);\nvar (x, y) = p; // uses Deconstruct method",
            note: 'Deconstruction works with tuples and any type implementing a `Deconstruct` method. Use `_` discards to ignore unwanted elements: `var (_, age) = person;`.',
            explanation: {
              heading: 'Deconstructing into variables',
              intro: 'Deconstruction splits a composite value into separate variables in one statement. It works for tuples out of the box and for any type that exposes a Deconstruct method.',
              points: [
                { term: 'Tuple unpacking', detail: 'Assigning a tuple to a parenthesized list of variables copies each element into its own variable.' },
                { term: 'Custom Deconstruct', detail: 'Adding a Deconstruct method with out parameters lets your own type be split the same way.' },
                { term: 'Discards', detail: 'Using an underscore for an element you do not need makes the intent to ignore it explicit.' },
                { term: 'Records included', detail: 'Positional records generate a Deconstruct automatically, so they support unpacking with no extra code.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 21. Indexes & Ranges ──────────────────────────────────────────
  {
    id: 'cs-indexes-ranges',
    title: 'Indexes & Ranges',
    level: 1,
    slug: 'indexes-ranges',
    concepts: [],
    children: [
      {
        id: 'cs-index-range-ops',
        title: 'Index & Range Operators',
        level: 2,
        slug: 'index-range-ops',
        concepts: [
          {
            id: 'cs-index-range',
            code: "int[] numbers = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 };\n\n// Index from end\nint last = numbers[^1];      // 9\nint secondLast = numbers[^2]; // 8\n\n// Range slicing\nint[] middle = numbers[3..7];   // { 3, 4, 5, 6 }\nint[] fromStart = numbers[..4]; // { 0, 1, 2, 3 }\nint[] toEnd = numbers[7..];     // { 7, 8, 9 }\nint[] copy = numbers[..];       // full copy\n\n// Index and Range types\nIndex idx = ^3;\nRange range = 1..^1;\nint[] sub = numbers[range]; // { 1, 2, ..., 8 }",
            note: '`^n` counts from the end (`^1` is last element). `a..b` creates a range (inclusive start, exclusive end). Works with arrays, strings, `Span<T>`, and any type with indexer/`Length`/`Count`.',
            explanation: {
              heading: 'Index and range operators',
              intro: 'The index from end and range operators let you address elements relative to either end of a sequence and slice out segments with clear syntax. They work across arrays, strings, and spans.',
              points: [
                { term: 'From the end', detail: 'The caret operator counts backward, so caret one is the last element and avoids the off by one length minus one arithmetic.' },
                { term: 'Range bounds', detail: 'A range includes the start index and excludes the end index, so a range of one to four covers three elements.' },
                { term: 'Open ended ranges', detail: 'Omitting a bound means start or end, so double dot four takes the first four and seven double dot takes the rest.' },
                { term: 'Reusable Index and Range', detail: 'The Index and Range types let you store a position or slice in a variable and apply it later.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 22. Extension Methods ──────────────────────────────────────────
  {
    id: 'cs-extension-methods',
    title: 'Extension Methods',
    level: 1,
    slug: 'extension-methods',
    concepts: [],
    children: [
      {
        id: 'cs-extensions',
        title: 'Writing Extension Methods',
        level: 2,
        slug: 'extensions',
        concepts: [
          {
            id: 'cs-extension-define',
            code: "public static class StringExtensions\n{\n    public static string Truncate(this string str, int maxLength)\n        => str.Length <= maxLength ? str : str[..maxLength] + \"...\";\n\n    public static bool IsNullOrEmpty(this string? str)\n        => string.IsNullOrEmpty(str);\n\n    public static string ToTitleCase(this string str)\n        => CultureInfo.CurrentCulture.TextInfo.ToTitleCase(str.ToLower());\n}\n\n// Usage — looks like an instance method\nvar title = \"hello world\".ToTitleCase(); // \"Hello World\"\nvar short_ = \"A long sentence\".Truncate(6); // \"A long...\"",
            note: 'Extension methods add functionality to existing types without modifying them. They must be `static` methods in a `static` class with `this` on the first parameter. Import with `using`.',
            explanation: {
              heading: 'Extending types you do not own',
              intro: 'An extension method lets you call a static helper as if it were an instance method on an existing type, even one you cannot edit such as string. The compiler rewrites the call to the static method.',
              points: [
                { term: 'The this parameter', detail: 'Prefixing the first parameter with this marks the method as an extension of that parameter type.' },
                { term: 'Static container', detail: 'Extension methods must live in a top level static class so the compiler can discover them.' },
                { term: 'Import with using', detail: 'The extension is available only when its namespace is in scope, so a using directive brings it in.' },
                { term: 'Not true members', detail: 'Extensions cannot access private state and are shadowed by real instance methods with the same name.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 23. Span & Memory ─────────────────────────────────────────────
  {
    id: 'cs-spans',
    title: 'Span & Memory',
    level: 1,
    slug: 'spans-memory',
    concepts: [],
    children: [
      {
        id: 'cs-span-usage',
        title: 'Span<T> & Memory<T>',
        level: 2,
        slug: 'span-usage',
        concepts: [
          {
            id: 'cs-span-basics',
            code: "// Stack-allocated array with span\nSpan<int> numbers = stackalloc int[] { 1, 2, 3, 4, 5 };\n\n// Slice without allocation\nint[] array = { 10, 20, 30, 40, 50 };\nSpan<int> slice = array.AsSpan(1..4); // { 20, 30, 40 }\nslice[0] = 99; // modifies original array!\n\n// String parsing without allocation\nReadOnlySpan<char> text = \"2024-01-15\".AsSpan();\nvar year = int.Parse(text[..4]);   // 2024\nvar month = int.Parse(text[5..7]); // 1\nvar day = int.Parse(text[8..]);    // 15",
            note: '`Span<T>` is a stack-only ref struct providing a view over contiguous memory without allocation. Use for high-performance parsing, slicing, and interop. `Memory<T>` can be stored on the heap.',
            explanation: {
              heading: 'Zero allocation views with Span',
              intro: 'A Span is a lightweight window over a contiguous region of memory such as an array, stack buffer, or unmanaged block. Slicing a span creates another view rather than copying, which keeps hot paths allocation free.',
              points: [
                { term: 'View not a copy', detail: 'A span refers to existing memory, so writing through it changes the underlying array.' },
                { term: 'Stack only', detail: 'Span is a ref struct that cannot live on the heap, so it cannot be a field of a class or captured by a lambda or awaited across.' },
                { term: 'Memory for storage', detail: 'When you need to hold a view on the heap or use it in async code, use Memory of T which is not stack bound.' },
                { term: 'Efficient parsing', detail: 'Slicing spans lets you read numbers and segments from text without allocating substrings.' },
              ],
            },
          },
          {
            id: 'cs-memory-pool',
            code: "// ArrayPool for reduced GC pressure\nvar pool = ArrayPool<byte>.Shared;\nbyte[] buffer = pool.Rent(1024);\ntry\n{\n    // Use buffer...\n    ProcessData(buffer.AsSpan(0, bytesRead));\n}\nfinally\n{\n    pool.Return(buffer);\n}",
            note: '`ArrayPool<T>` rents and returns buffers to reduce garbage collection overhead in hot paths. Always return rented arrays in a `finally` block.',
            explanation: {
              heading: 'Reusing buffers with ArrayPool',
              intro: 'ArrayPool lends out reusable arrays so hot code can avoid allocating a fresh buffer each time. Reusing memory reduces pressure on the garbage collector and can improve throughput.',
              points: [
                { term: 'Rent and return', detail: 'Rent asks the pool for an array of at least the requested size, and Return hands it back for reuse.' },
                { term: 'Return in finally', detail: 'Wrapping usage in try finally guarantees the buffer is returned even when an exception occurs.' },
                { term: 'May be larger', detail: 'A rented array can be bigger than requested, so track how many elements you actually filled.' },
                { term: 'Do not keep references', detail: 'After returning an array you must not use it, since the pool may hand it to other code.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 24. Reflection & Attributes ─────────────────────────────────────
  {
    id: 'cs-reflection',
    title: 'Reflection & Attributes',
    level: 1,
    slug: 'reflection',
    concepts: [],
    children: [
      {
        id: 'cs-attributes',
        title: 'Attributes',
        level: 2,
        slug: 'attributes',
        concepts: [
          {
            id: 'cs-attribute-usage',
            code: "// Built-in attributes\n[Obsolete(\"Use NewMethod() instead\")]\npublic void OldMethod() { }\n\n[Serializable]\npublic class DataPacket { }\n\n// Custom attribute\n[AttributeUsage(AttributeTargets.Method)]\npublic class CacheAttribute : Attribute\n{\n    public int DurationSeconds { get; }\n    public CacheAttribute(int duration) => DurationSeconds = duration;\n}\n\n[Cache(300)]\npublic Data GetData() => _repo.Load();",
            note: 'Attributes are metadata annotations. Built-in ones include `[Obsolete]`, `[Serializable]`, `[Conditional]`. Custom attributes extend `Attribute` and are read via reflection at runtime.',
            explanation: {
              heading: 'Declarative metadata',
              intro: 'An attribute attaches structured metadata to code elements like classes, methods, and parameters. Tools, frameworks, and your own reflection code can read this metadata to change behavior without altering logic.',
              points: [
                { term: 'Built in attributes', detail: 'The framework ships attributes such as Obsolete to warn on outdated APIs and Serializable to mark data types.' },
                { term: 'Custom attributes', detail: 'Deriving from Attribute defines your own annotation whose constructor arguments become configuration data.' },
                { term: 'Targets and usage', detail: 'The AttributeUsage attribute restricts where your attribute may be applied and whether it can repeat.' },
                { term: 'Read at runtime', detail: 'Attributes carry no behavior on their own, so reflection reads them to drive validation, mapping, or dispatch.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cs-reflection-api',
        title: 'Reflection API',
        level: 2,
        slug: 'reflection-api',
        concepts: [
          {
            id: 'cs-reflection-basics',
            code: "Type type = typeof(Person);\n\n// Inspect properties\nforeach (var prop in type.GetProperties())\n    Console.WriteLine($\"{prop.Name}: {prop.PropertyType.Name}\");\n\n// Invoke method dynamically\nobject instance = Activator.CreateInstance(type, \"Alice\", 30)!;\nvar method = type.GetMethod(\"Greet\")!;\nstring result = (string)method.Invoke(instance, null)!;",
            note: 'Reflection inspects types at runtime — useful for serialization, DI containers, and plugin systems. It is slower than direct calls; cache `MethodInfo`/`PropertyInfo` when possible.',
            explanation: {
              heading: 'Inspecting types at runtime',
              intro: 'Reflection lets code examine and manipulate types, members, and attributes while the program runs. Frameworks use it for serialization, dependency injection, and plugin discovery where types are not known at compile time.',
              points: [
                { term: 'Type objects', detail: 'The typeof operator or GetType returns a Type that exposes properties, methods, and attributes for inspection.' },
                { term: 'Dynamic invocation', detail: 'Activator CreateInstance builds an object and MethodInfo Invoke calls a method chosen by name at runtime.' },
                { term: 'Performance cost', detail: 'Reflective access is far slower than direct calls, so cache the discovered MethodInfo and PropertyInfo when reusing them.' },
                { term: 'Discovering types', detail: 'Scanning an assembly for types that implement an interface enables plugin and handler registration.' },
              ],
            },
            example: "// Find all types implementing an interface\nvar handlers = Assembly.GetExecutingAssembly()\n    .GetTypes()\n    .Where(t => typeof(IHandler).IsAssignableFrom(t) && !t.IsAbstract);",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 25. Disposable & Resource Management ───────────────────────────
  {
    id: 'cs-disposable',
    title: 'Disposable & Resource Management',
    level: 1,
    slug: 'disposable',
    concepts: [],
    children: [
      {
        id: 'cs-using-pattern',
        title: 'Using & IDisposable',
        level: 2,
        slug: 'using-pattern',
        concepts: [
          {
            id: 'cs-using-statement',
            code: "// using declaration (C# 8) — disposed at end of scope\nusing var file = File.OpenRead(\"data.bin\");\nusing var reader = new StreamReader(file);\nvar content = await reader.ReadToEndAsync();\n\n// Classic using block\nusing (var connection = new SqlConnection(connStr))\n{\n    await connection.OpenAsync();\n    // work...\n} // Dispose() called here\n\n// Implementing IDisposable\npublic class TempFile : IDisposable\n{\n    public string Path { get; } = System.IO.Path.GetTempFileName();\n    public void Dispose() => File.Delete(Path);\n}",
            note: '`using` ensures `Dispose()` is called even if an exception occurs. Implement `IDisposable` (or `IAsyncDisposable`) for types holding unmanaged resources like files, connections, or handles.',
            explanation: {
              heading: 'Deterministic cleanup',
              intro: 'The using construct guarantees that Dispose runs when a resource leaves scope, even if an exception is thrown. This gives deterministic release of files, connections, and other unmanaged handles.',
              points: [
                { term: 'Guaranteed disposal', detail: 'A using block or declaration calls Dispose automatically at the end of scope, so you never forget cleanup.' },
                { term: 'Using declaration', detail: 'The declaration form disposes the object when the enclosing scope exits, removing a level of nesting.' },
                { term: 'Implementing IDisposable', detail: 'Types that hold unmanaged resources implement IDisposable so callers can release them promptly.' },
                { term: 'Async disposal', detail: 'For resources with async cleanup, implement IAsyncDisposable and use await using to release them without blocking.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 26. Collections & Immutability ─────────────────────────────────
  {
    id: 'cs-immutable-collections',
    title: 'Immutable Collections',
    level: 1,
    slug: 'immutable-collections',
    concepts: [],
    children: [
      {
        id: 'cs-immutable-types',
        title: 'Immutable & Frozen Collections',
        level: 2,
        slug: 'immutable-types',
        concepts: [
          {
            id: 'cs-immutable-list',
            code: "using System.Collections.Immutable;\n\nvar list = ImmutableList.Create(1, 2, 3);\nvar newList = list.Add(4); // returns new list, original unchanged\n\nvar dict = ImmutableDictionary<string, int>.Empty\n    .Add(\"a\", 1)\n    .Add(\"b\", 2);\n\n// FrozenDictionary (.NET 8) — optimized for read-heavy workloads\nusing System.Collections.Frozen;\nvar frozen = dict.ToFrozenDictionary();",
            note: 'Immutable collections return new instances on modification — thread-safe by design. `FrozenDictionary` (.NET 8) is even faster for lookups but cannot be modified after creation.',
            explanation: {
              heading: 'Collections that never change',
              intro: 'An immutable collection cannot be altered after creation, so any operation that seems to modify it returns a new collection instead. Because the data never changes, these collections are safe to share across threads.',
              points: [
                { term: 'Copy on modify', detail: 'Methods like Add return a new collection while the original stays intact, which supports safe sharing.' },
                { term: 'Thread safety', detail: 'Since no thread can mutate the data, immutable collections avoid the locks that mutable ones would need.' },
                { term: 'Structural sharing', detail: 'Implementations reuse most of the existing structure internally, so producing a new version is cheaper than a full copy.' },
                { term: 'Frozen collections', detail: 'A FrozenDictionary trades the ability to change for the fastest possible lookups, ideal for build once read many data.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 27. File I/O & Streams ─────────────────────────────────────────
  {
    id: 'cs-file-io',
    title: 'File I/O & Streams',
    level: 1,
    slug: 'file-io',
    concepts: [],
    children: [
      {
        id: 'cs-file-operations',
        title: 'File & Stream Operations',
        level: 2,
        slug: 'file-operations',
        concepts: [
          {
            id: 'cs-file-basics',
            code: "// Simple read/write\nstring text = await File.ReadAllTextAsync(\"input.txt\");\nawait File.WriteAllTextAsync(\"output.txt\", text.ToUpper());\n\n// Line-by-line streaming\nawait foreach (var line in File.ReadLinesAsync(\"large.csv\"))\n    Process(line);\n\n// Stream-based for large files\nusing var stream = File.OpenRead(\"data.bin\");\nvar buffer = new byte[4096];\nint bytesRead;\nwhile ((bytesRead = await stream.ReadAsync(buffer)) > 0)\n    ProcessChunk(buffer.AsSpan(0, bytesRead));",
            note: '`File` helper methods work for small files. Use streams for large files to avoid loading everything into memory. Always use async I/O variants in server applications.',
            explanation: {
              heading: 'Reading and writing files',
              intro: 'The File class offers one line helpers for whole file reads and writes, while streams give fine grained control for large data. Async variants keep threads free during slow disk operations.',
              points: [
                { term: 'Whole file helpers', detail: 'Methods like ReadAllText and WriteAllText are simplest for small files that fit comfortably in memory.' },
                { term: 'Streaming large files', detail: 'Reading in chunks through a stream avoids loading a huge file entirely, which controls memory use.' },
                { term: 'Async I O', detail: 'Server code should use the async methods so the thread can serve other requests while the disk works.' },
                { term: 'Line by line', detail: 'ReadLinesAsync yields lines lazily, which suits processing large text files record by record.' },
              ],
            },
          },
          {
            id: 'cs-path-directory',
            code: "// Path operations\nvar full = Path.Combine(\"dir\", \"sub\", \"file.txt\");\nvar ext = Path.GetExtension(\"data.json\"); // \".json\"\nvar name = Path.GetFileNameWithoutExtension(full);\n\n// Directory operations\nDirectory.CreateDirectory(\"output/logs\");\nvar files = Directory.EnumerateFiles(\".\", \"*.cs\", SearchOption.AllDirectories);",
            note: 'Use `Path.Combine` instead of string concatenation for cross-platform paths. `Directory.EnumerateFiles` lazily yields results unlike `GetFiles` which buffers all at once.',
            explanation: {
              heading: 'Working with paths and directories',
              intro: 'The Path and Directory helpers manipulate file system locations correctly across operating systems. They handle separators, extensions, and enumeration so you avoid brittle string surgery.',
              points: [
                { term: 'Combine safely', detail: 'Path Combine joins segments with the correct separator for the current platform, unlike manual concatenation.' },
                { term: 'Inspecting paths', detail: 'Helpers such as GetExtension and GetFileNameWithoutExtension pull apart a path without parsing it yourself.' },
                { term: 'Lazy enumeration', detail: 'Directory EnumerateFiles streams results as it walks the tree, while GetFiles buffers the entire list first.' },
                { term: 'Creating directories', detail: 'Directory CreateDirectory makes any missing parent folders and does nothing if the folder already exists.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 28. Dependency Injection ───────────────────────────────────────
  {
    id: 'cs-dependency-injection',
    title: 'Dependency Injection',
    level: 1,
    slug: 'dependency-injection',
    concepts: [],
    children: [
      {
        id: 'cs-di-basics',
        title: 'DI Container & Lifetimes',
        level: 2,
        slug: 'di-basics',
        concepts: [
          {
            id: 'cs-di-registration',
            code: "var builder = WebApplication.CreateBuilder(args);\n\n// Register services with different lifetimes\nbuilder.Services.AddSingleton<ICacheService, RedisCacheService>();\nbuilder.Services.AddScoped<IUserRepository, UserRepository>();\nbuilder.Services.AddTransient<IEmailSender, SmtpEmailSender>();\n\n// Constructor injection\npublic class OrderService\n{\n    private readonly IUserRepository _users;\n    private readonly IEmailSender _email;\n\n    public OrderService(IUserRepository users, IEmailSender email)\n    {\n        _users = users;\n        _email = email;\n    }\n}",
            note: 'The built-in DI container supports three lifetimes: `Singleton` (one instance), `Scoped` (one per request), `Transient` (new each time). Inject dependencies via constructors for testability.',
            explanation: {
              heading: 'Dependency injection lifetimes',
              intro: 'Dependency injection hands a class the services it needs rather than letting it create them, which decouples code and eases testing. The container manages how long each service instance lives.',
              points: [
                { term: 'Singleton lifetime', detail: 'One instance is created and shared for the whole application, suitable for stateless or thread safe services.' },
                { term: 'Scoped lifetime', detail: 'A new instance is created per scope, typically per web request, so state does not leak between requests.' },
                { term: 'Transient lifetime', detail: 'A fresh instance is provided every time it is requested, which fits lightweight stateless helpers.' },
                { term: 'Constructor injection', detail: 'Declaring dependencies as constructor parameters lets the container supply them and makes tests able to pass fakes.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 29. Records & Init-Only Setters ────────────────────────────────
  {
    id: 'cs-init-only',
    title: 'Init-Only & Required Members',
    level: 1,
    slug: 'init-only',
    concepts: [],
    children: [
      {
        id: 'cs-init-required',
        title: 'Init & Required Keywords',
        level: 2,
        slug: 'init-required',
        concepts: [
          {
            id: 'cs-init-setters',
            code: "public class Options\n{\n    public required string Host { get; init; }\n    public int Port { get; init; } = 8080;\n    public bool UseSsl { get; init; }\n}\n\n// Must set required properties at creation\nvar opts = new Options\n{\n    Host = \"localhost\",\n    UseSsl = true\n};\n\n// opts.Host = \"other\"; // Error: init-only property",
            note: '`init` allows setting only during object initialization. `required` (C# 11) forces callers to set the property — the compiler errors if it is omitted from the initializer.',
            explanation: {
              heading: 'Init only and required members',
              intro: 'These keywords let you build objects that are immutable after construction while still using the readable object initializer syntax. Together they enforce valid state at creation time.',
              points: [
                { term: 'Init accessors', detail: 'An init only setter permits assignment during construction or in an object initializer and then locks the property.' },
                { term: 'Required members', detail: 'The required modifier makes the compiler reject any initializer that omits the property, guaranteeing it is set.' },
                { term: 'Immutable after build', detail: 'Combining init with required yields objects that are fully populated and then read only.' },
                { term: 'No constructor needed', detail: 'You can enforce mandatory data through required properties without writing a matching constructor.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 30. Primary Constructors & Top-Level Statements ────────────────
  {
    id: 'cs-modern-syntax',
    title: 'Modern C# Syntax',
    level: 1,
    slug: 'modern-syntax',
    concepts: [],
    children: [
      {
        id: 'cs-primary-constructors',
        title: 'Primary Constructors & Global Using',
        level: 2,
        slug: 'primary-constructors',
        concepts: [
          {
            id: 'cs-primary-ctor',
            code: "// Primary constructor (C# 12)\npublic class UserService(IUserRepository repo, ILogger<UserService> logger)\n{\n    public User? GetUser(int id)\n    {\n        logger.LogInformation(\"Fetching user {Id}\", id);\n        return repo.FindById(id);\n    }\n}\n\n// Top-level statements (C# 9)\n// Program.cs — no class or Main method needed\nvar builder = WebApplication.CreateBuilder(args);\nvar app = builder.Build();\napp.MapGet(\"/\", () => \"Hello World\");\napp.Run();",
            note: 'Primary constructors (C# 12) inject parameters directly into the class declaration. Top-level statements (C# 9) remove boilerplate for simple programs. `global using` applies usings project-wide.',
            explanation: {
              heading: 'Modern syntax that cuts boilerplate',
              intro: 'Recent C# versions trim repetitive ceremony so common patterns read more directly. Primary constructors, top level statements, and global usings each remove a layer of boilerplate.',
              points: [
                { term: 'Primary constructors', detail: 'Declaring parameters on the class header makes them available throughout the body without repeating fields and assignments.' },
                { term: 'Top level statements', detail: 'A program entry file can hold statements directly, so simple apps skip the explicit class and Main method.' },
                { term: 'Global using', detail: 'A global using directive imports a namespace for the whole project, removing repeated using lines in every file.' },
                { term: 'Great for injection', detail: 'Primary constructors pair well with dependency injection since injected services are captured directly.' },
              ],
            },
          },
          {
            id: 'cs-file-scoped',
            code: "// File-scoped namespace (C# 10)\nnamespace MyApp.Services;\n\npublic class PaymentService { }\n\n// Global using (C# 10)\n// In GlobalUsings.cs\nglobal using System.Collections.Generic;\nglobal using Microsoft.Extensions.Logging;",
            note: 'File-scoped namespaces reduce nesting by one level. `global using` declares imports available throughout the entire project, reducing repetitive using directives.',
            explanation: {
              heading: 'File-scoped namespaces and global usings',
              intro: 'These features reduce visual clutter in everyday files. A file scoped namespace removes a layer of indentation, and global usings centralize common imports in one place.',
              points: [
                { term: 'One namespace per file', detail: 'Ending the namespace declaration with a semicolon applies it to the whole file without wrapping braces.' },
                { term: 'Less indentation', detail: 'Removing the namespace braces shifts every member left by one level, which improves readability.' },
                { term: 'Central global usings', detail: 'Placing global using directives in a single file makes frequent imports available across the project.' },
                { term: 'Cleaner files', detail: 'Combined, these features let each source file focus on its own types rather than repeated ceremony.' },
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
