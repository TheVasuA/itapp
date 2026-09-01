// Java topic tree.
//
// Each node is a ConceptNode: { id, title, level, slug?, concepts[], children[] }.
// Routable nodes carry a `slug`. Every Concept renders in the fixed order
// code -> note -> example (example optional).

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  // ─── 1. Fundamentals ───────────────────────────────────────────────────
  {
    id: 'java-fundamentals',
    title: 'Fundamentals',
    level: 1,
    slug: 'fundamentals',
    concepts: [],
    children: [
      {
        id: 'java-hello-world',
        title: 'Hello World & Main Method',
        level: 2,
        slug: 'hello-world',
        concepts: [
          {
            id: 'java-hello-main',
            code: "public class HelloWorld {\n  public static void main(String[] args) {\n    System.out.println(\"Hello, Java!\");\n  }\n}",
            note: 'Every Java application starts from a `main` method. The class name must match the filename. `public static void main(String[] args)` is the entry point the JVM looks for.',
            explanation: {
              heading: 'How the entry point works',
              intro: 'A Java program is compiled to bytecode and run by the JVM, which locates a special method to begin execution. The hello world class shows the minimum wiring the runtime expects.',
              points: [
                { term: 'The main signature', detail: 'The JVM looks for a method that is public, static, returns void, and takes a String array, so any change to that signature stops the program from launching.' },
                { term: 'Static means no instance', detail: 'Because main is static it runs without creating an object, which is why the runtime can call it before any of your constructors execute.' },
                { term: 'Class and file naming', detail: 'A public class must live in a file whose name matches the class exactly, so the compiler can find and load it by name.' },
                { term: 'Command line arguments', detail: 'The String array parameter receives arguments passed on the command line, giving the program simple external input at startup.' },
                { term: 'Printing output', detail: 'The call to System out println writes a line to standard output, which is the usual way a console program reports results.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'java-variables-basics',
        title: 'Variables & Type Inference',
        level: 2,
        slug: 'variables',
        concepts: [
          {
            id: 'java-var-declare',
            code: "int count = 10;\nfinal double PI = 3.14159;\nvar message = \"Hello\"; // Java 10+ local variable type inference",
            note: 'Java is statically typed. Use `final` for constants. Since Java 10, `var` lets the compiler infer local variable types while keeping full type safety.',
            explanation: {
              heading: 'Declaring variables and inferring types',
              intro: 'Java checks types at compile time, so every variable has a fixed type. The var keyword does not weaken that guarantee; it only lets the compiler deduce the type from the initializer.',
              points: [
                { term: 'Static typing', detail: 'The type of a variable is fixed when it is declared and checked at compile time, which catches many mistakes before the program ever runs.' },
                { term: 'The final keyword', detail: 'Marking a variable final prevents reassignment, which is the idiomatic way to declare constants and to make intent clear to readers.' },
                { term: 'How var infers', detail: 'The var keyword works only for local variables with an initializer, from which the compiler deduces a concrete type while keeping full type safety.' },
                { term: 'When var helps', detail: 'It reduces noise for long generic types on the right hand side, but overusing it can hide the type from a reader, so use it where the type is obvious.' },
                { term: 'Numeric readability', detail: 'Underscores may be placed inside numeric literals to group digits, making large numbers easier to scan without changing their value.' },
              ],
            },
            example: "var list = new ArrayList<String>();\nlist.add(\"item\"); // compiler knows list is ArrayList<String>",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 2. Data Types ─────────────────────────────────────────────────────
  {
    id: 'java-data-types',
    title: 'Data Types',
    level: 1,
    slug: 'data-types',
    concepts: [],
    children: [
      {
        id: 'java-primitives',
        title: 'Primitive Types',
        level: 2,
        slug: 'primitives',
        concepts: [
          {
            id: 'java-primitives-overview',
            code: "byte b = 127;        // 8-bit\nshort s = 32000;     // 16-bit\nint i = 2_000_000;   // 32-bit\nlong l = 9_000_000_000L; // 64-bit\nfloat f = 3.14f;     // 32-bit IEEE 754\ndouble d = 3.14159;  // 64-bit IEEE 754\nchar c = 'A';        // 16-bit Unicode\nboolean flag = true; // true or false",
            note: 'Java has 8 primitive types stored on the stack. Use underscores in numeric literals for readability. Primitives are not objects and cannot be null.',
            explanation: {
              heading: 'The eight primitive types',
              intro: 'Primitives are the built in value types that hold raw numbers, characters, and truth values directly rather than as objects. Choosing the right one affects range, precision, and memory.',
              points: [
                { term: 'Integer family', detail: 'The types byte, short, int, and long store whole numbers of increasing width, and int is the sensible default for counting and indexing.' },
                { term: 'Floating point family', detail: 'The double type is the default for real numbers with about fifteen significant digits, while float is smaller and less precise; neither represents every decimal exactly.' },
                { term: 'Character and boolean', detail: 'A char holds a single sixteen bit Unicode unit and boolean holds only true or false, so they model text and logic rather than arithmetic.' },
                { term: 'Not objects', detail: 'Primitives are not references, cannot be null, and always carry a default value such as zero or false when they are fields.' },
                { term: 'Fixed widths', detail: 'Unlike some languages the sizes are the same on every platform, which makes numeric behavior predictable across systems.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'java-wrapper-classes',
        title: 'Wrapper Classes & Autoboxing',
        level: 2,
        slug: 'wrappers',
        concepts: [
          {
            id: 'java-autoboxing',
            code: "Integer boxed = 42;           // autoboxing: int -> Integer\nint unboxed = boxed;          // unboxing: Integer -> int\nDouble.parseDouble(\"3.14\");   // parsing from String\nInteger.valueOf(100);         // cached instances for -128 to 127",
            note: 'Each primitive has a wrapper class (int → Integer, etc.). Autoboxing/unboxing converts automatically. Beware: wrappers can be null, causing NullPointerException when unboxed.',
            explanation: {
              heading: 'Wrappers and automatic conversion',
              intro: 'Wrapper classes let primitive values behave as objects so they can live in collections and generics. The compiler inserts conversions for you, which is convenient but carries a few traps.',
              points: [
                { term: 'One wrapper per primitive', detail: 'Each primitive has a matching class such as Integer for int and Double for double, adding object behavior like nullability and methods.' },
                { term: 'Autoboxing and unboxing', detail: 'The compiler converts between a primitive and its wrapper automatically, so you can assign an int to an Integer and back without explicit casts.' },
                { term: 'The null unboxing trap', detail: 'A wrapper reference can be null, and unboxing a null value throws a NullPointerException, which is a common surprise in collections.' },
                { term: 'Cached instances', detail: 'Integer values from negative one hundred twenty eight to one hundred twenty seven are cached, so reference comparison can behave inconsistently; always compare values with equals.' },
                { term: 'Prefer primitives in loops', detail: 'Boxing inside tight loops creates many short lived objects, so use primitive types for heavy numeric work when possible.' },
              ],
            },
            example: "List<Integer> nums = new ArrayList<>();\nnums.add(5); // autoboxing int -> Integer",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 3. Operators ──────────────────────────────────────────────────────
  {
    id: 'java-operators',
    title: 'Operators',
    level: 1,
    slug: 'operators',
    concepts: [],
    children: [
      {
        id: 'java-arithmetic-logical',
        title: 'Arithmetic & Logical Operators',
        level: 2,
        slug: 'arithmetic-logical',
        concepts: [
          {
            id: 'java-ops-arithmetic',
            code: "int sum = 10 + 3;    // 13\nint mod = 10 % 3;    // 1\nboolean and = true && false; // false\nboolean or = true || false;  // true\nint shifted = 8 >> 1; // 4 (bit shift right)",
            note: 'Java supports arithmetic (+, -, *, /, %), comparison (==, !=, <, >, <=, >=), logical (&&, ||, !), bitwise (&, |, ^, ~, <<, >>, >>>), and assignment operators. Short-circuit evaluation applies to && and ||.',
            explanation: {
              heading: 'Operator families and their rules',
              intro: 'Operators combine values into expressions, but Java has specific rules for integer division, short circuit logic, and bit level manipulation that matter for correctness.',
              points: [
                { term: 'Integer division', detail: 'Dividing two integers discards the fraction and the percent operator returns the remainder, so make an operand floating point when you want a real quotient.' },
                { term: 'Short circuit logic', detail: 'The double ampersand and double pipe stop evaluating as soon as the result is known, which lets you guard against null or costly calls on the right side.' },
                { term: 'Bitwise operators', detail: 'Operators such as ampersand, pipe, caret, and the shift operators work on individual bits and are used for flags, masks, and low level performance code.' },
                { term: 'Unsigned right shift', detail: 'The triple right angle operator shifts in zero bits from the left, which differs from the arithmetic shift that preserves the sign.' },
                { term: 'Compound assignment', detail: 'Forms like plus equals combine an operation with assignment and quietly perform a narrowing cast, so watch for unexpected truncation.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'java-ternary-instanceof',
        title: 'Ternary & instanceof',
        level: 2,
        slug: 'ternary-instanceof',
        concepts: [
          {
            id: 'java-ops-ternary',
            code: "String status = (score >= 60) ? \"pass\" : \"fail\";\n\n// Pattern matching instanceof (Java 16+)\nif (obj instanceof String s) {\n  System.out.println(s.length());\n}",
            note: 'The ternary operator provides inline conditionals. The enhanced `instanceof` with pattern matching eliminates explicit casting.',
            explanation: {
              heading: 'Concise conditionals and type tests',
              intro: 'The ternary operator returns one of two values based on a condition, and pattern matching for instanceof tests a type and binds a variable in one step. Both reduce boilerplate.',
              points: [
                { term: 'Ternary as an expression', detail: 'The condition question colon form yields a value, so it fits inside assignments and arguments where a full if statement would not.' },
                { term: 'Instanceof pattern binding', detail: 'Since Java sixteen a successful instanceof test can bind a typed variable directly, removing the separate cast that older code required.' },
                { term: 'Combining with logic', detail: 'The bound pattern variable is available in the rest of the condition, so you can add extra checks with the double ampersand on the same line.' },
                { term: 'Scope of the binding', detail: 'The pattern variable is in scope only where the test is known to be true, which the compiler enforces to keep it safe.' },
                { term: 'Keep it readable', detail: 'Nesting many ternary operators harms clarity, so reserve the operator for simple either or choices and use if statements for complex branching.' },
              ],
            },
            example: "Object val = 42;\nif (val instanceof Integer n && n > 0) {\n  System.out.println(\"Positive: \" + n);\n}",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 4. Control Flow ───────────────────────────────────────────────────
  {
    id: 'java-control-flow',
    title: 'Control Flow',
    level: 1,
    slug: 'control-flow',
    concepts: [],
    children: [
      {
        id: 'java-conditionals',
        title: 'If/Else & Switch',
        level: 2,
        slug: 'conditionals',
        concepts: [
          {
            id: 'java-if-switch',
            code: "// Enhanced switch expression (Java 14+)\nString day = \"MON\";\nint numLetters = switch (day) {\n  case \"MON\", \"FRI\", \"SUN\" -> 3;\n  case \"TUES\"             -> 4;\n  case \"THURS\", \"WEDS\"    -> 5;\n  default -> throw new IllegalArgumentException(day);\n};",
            note: 'Switch expressions (Java 14+) return values directly and use arrow syntax. They must be exhaustive — either cover all cases or include a default.',
            explanation: {
              heading: 'Modern branching with switch',
              intro: 'The switch expression turns multi way branching into a value producing form using arrow syntax. It is safer than the old statement because the compiler enforces exhaustiveness.',
              points: [
                { term: 'Expression yields a value', detail: 'A switch expression produces a result you can assign directly, which removes the repetitive temporary variable and assignment of the older style.' },
                { term: 'Arrow avoids fall through', detail: 'The arrow form runs only the matched branch, so it eliminates the accidental fall through that plagued the traditional colon and break syntax.' },
                { term: 'Multiple labels', detail: 'Several constants can share one branch by listing them separated by commas, which keeps related cases together.' },
                { term: 'Exhaustiveness', detail: 'A switch expression must cover every possible input or provide a default, so the compiler rejects code that forgets a case.' },
                { term: 'Yield for blocks', detail: 'When a branch needs several statements you use a block and the yield keyword to return its value from the switch.' },
              ],
            },
            example: "// Traditional if/else\nif (temp > 30) {\n  System.out.println(\"Hot\");\n} else if (temp > 15) {\n  System.out.println(\"Warm\");\n} else {\n  System.out.println(\"Cold\");\n}",
          },
        ],
        children: [],
      },
      {
        id: 'java-loops',
        title: 'Loops: for, while, do-while',
        level: 2,
        slug: 'loops',
        concepts: [
          {
            id: 'java-loops-types',
            code: "// Enhanced for-each\nfor (String item : list) {\n  System.out.println(item);\n}\n\n// Classic for loop\nfor (int i = 0; i < 10; i++) {\n  if (i == 5) continue;\n  System.out.println(i);\n}\n\n// while loop\nwhile (scanner.hasNext()) {\n  process(scanner.next());\n}",
            note: 'For-each is preferred for iterating collections. Use labeled break/continue to control nested loops. Infinite loops use `while(true)` or `for(;;)`.',
            explanation: {
              heading: 'Choosing the right loop',
              intro: 'Java offers several loop forms, each suited to a different situation. Picking the clearest one makes iteration intent obvious and avoids off by one and index mistakes.',
              points: [
                { term: 'The for each loop', detail: 'The enhanced for reads each element of a collection or array in turn and is preferred when you do not need the index, since it cannot go out of bounds.' },
                { term: 'The classic for loop', detail: 'The three part for loop gives explicit control over an index counter, which is right when you need position, step, or reverse iteration.' },
                { term: 'While and do while', detail: 'A while loop tests before the body while a do while runs the body at least once, so the choice depends on whether the first check must happen up front.' },
                { term: 'Break and continue', detail: 'The break keyword exits a loop early and continue skips to the next iteration, and labels let them target an outer loop when nesting.' },
                { term: 'Infinite loops', detail: 'Writing while true or an empty for header creates a deliberate endless loop, usually broken by an internal condition or return.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 5. Arrays ─────────────────────────────────────────────────────────
  {
    id: 'java-arrays',
    title: 'Arrays',
    level: 1,
    slug: 'arrays',
    concepts: [],
    children: [
      {
        id: 'java-arrays-basics',
        title: 'Array Declaration & Manipulation',
        level: 2,
        slug: 'array-basics',
        concepts: [
          {
            id: 'java-array-declare',
            code: "int[] nums = {1, 2, 3, 4, 5};\nString[] names = new String[3];\nnames[0] = \"Alice\";\n\n// Multi-dimensional\nint[][] matrix = {\n  {1, 2, 3},\n  {4, 5, 6}\n};",
            note: 'Arrays are fixed-size, zero-indexed containers. They live on the heap and store elements contiguously. Array length is accessed via `.length` (not a method).',
            explanation: {
              heading: 'Working with fixed size arrays',
              intro: 'An array is a contiguous block of elements of a single type whose size is fixed at creation. It offers fast indexed access but cannot grow, which shapes how you use it.',
              points: [
                { term: 'Fixed size', detail: 'The length is chosen when the array is created and can never change, so you must allocate a new array to store more elements.' },
                { term: 'Zero based indexing', detail: 'Elements are numbered from zero to length minus one, and accessing an index outside that range throws an ArrayIndexOutOfBoundsException.' },
                { term: 'The length field', detail: 'You read the size through the length field rather than a method call, which is a small syntactic difference from collections.' },
                { term: 'Default values', detail: 'A newly created array is filled with default values such as zero, false, or null depending on the element type.' },
                { term: 'Multidimensional arrays', detail: 'A two dimensional array is really an array of arrays, so rows can have different lengths in a jagged layout.' },
              ],
            },
            example: "Arrays.sort(nums);\nint[] copy = Arrays.copyOf(nums, nums.length);\nSystem.out.println(Arrays.toString(nums)); // [1, 2, 3, 4, 5]",
          },
        ],
        children: [],
      },
      {
        id: 'java-arrays-utility',
        title: 'Arrays Utility Class',
        level: 2,
        slug: 'arrays-utility',
        concepts: [
          {
            id: 'java-arrays-util',
            code: "int[] a = {5, 3, 1, 4, 2};\nArrays.sort(a);                    // [1, 2, 3, 4, 5]\nint idx = Arrays.binarySearch(a, 3); // 2\nboolean eq = Arrays.equals(a, b);  // deep comparison\nint[] filled = new int[10];\nArrays.fill(filled, -1);          // all elements set to -1",
            note: '`java.util.Arrays` provides static methods for sorting, searching, comparing, and filling arrays. Use `Arrays.deepEquals()` for multi-dimensional arrays.',
            explanation: {
              heading: 'The Arrays helper class',
              intro: 'The Arrays utility class collects static methods for common array chores so you do not hand write loops for sorting, searching, or comparing. Knowing it saves effort and avoids bugs.',
              points: [
                { term: 'Sorting', detail: 'The sort method orders an array in place using an efficient algorithm, and an overload accepts a comparator for custom ordering of objects.' },
                { term: 'Binary search', detail: 'The binarySearch method finds an element quickly but requires the array to be sorted first, otherwise the result is undefined.' },
                { term: 'Equality and printing', detail: 'The equals method compares element by element and toString produces a readable form, which the array reference itself does not.' },
                { term: 'Filling and copying', detail: 'The fill method sets every slot to one value and copyOf produces a resized copy, which is the usual way to grow an array.' },
                { term: 'Nested arrays', detail: 'For multidimensional arrays use deepEquals and deepToString, since the plain versions only look one level deep.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 6. Strings ────────────────────────────────────────────────────────
  {
    id: 'java-strings',
    title: 'Strings',
    level: 1,
    slug: 'strings',
    concepts: [],
    children: [
      {
        id: 'java-string-ops',
        title: 'String Operations & Immutability',
        level: 2,
        slug: 'string-operations',
        concepts: [
          {
            id: 'java-string-basics',
            code: "String s = \"Hello, World!\";\ns.length();            // 13\ns.substring(0, 5);     // \"Hello\"\ns.contains(\"World\");   // true\ns.replace(\"World\", \"Java\"); // \"Hello, Java!\"\n\n// String is immutable — all operations return a new String\nString upper = s.toUpperCase();",
            note: 'Strings are immutable objects backed by a `char[]` (or `byte[]` since Java 9). String literals are interned in the string pool. Use `.equals()` for content comparison, never `==`.',
            explanation: {
              heading: 'Why strings are immutable',
              intro: 'A String cannot change after it is created, so every operation that seems to modify it actually returns a new String. This design brings safety and sharing benefits.',
              points: [
                { term: 'Immutability', detail: 'Methods such as toUpperCase and replace return a new String and leave the original untouched, which makes strings safe to share across threads.' },
                { term: 'The string pool', detail: 'Identical string literals are interned into a shared pool so they refer to the same object, saving memory for common text.' },
                { term: 'Compare with equals', detail: 'The double equals operator tests reference identity, so you must use the equals method to compare the actual characters of two strings.' },
                { term: 'Cost of concatenation', detail: 'Building a string by repeated concatenation in a loop creates many intermediate objects, which is why a builder is preferred there.' },
                { term: 'Text blocks', detail: 'A multi line text block written with triple quotes keeps formatting readable for content such as JSON or SQL without escape clutter.' },
              ],
            },
            example: "// Text blocks (Java 15+)\nString json = \"\"\"\n  {\n    \"name\": \"Java\",\n    \"version\": 21\n  }\n  \"\"\";",
          },
        ],
        children: [],
      },
      {
        id: 'java-string-builder',
        title: 'StringBuilder & Formatting',
        level: 2,
        slug: 'string-builder',
        concepts: [
          {
            id: 'java-sb-format',
            code: "// StringBuilder for efficient concatenation\nvar sb = new StringBuilder();\nfor (int i = 0; i < 100; i++) {\n  sb.append(i).append(\", \");\n}\nString result = sb.toString();\n\n// String.format & formatted (Java 15+)\nString msg = \"Hello %s, you are %d years old\".formatted(\"Alice\", 30);",
            note: 'Use `StringBuilder` when concatenating in loops — it avoids creating intermediate String objects. `String.format()` and `.formatted()` provide printf-style formatting.',
            explanation: {
              heading: 'Efficient building and formatting',
              intro: 'When you assemble text piece by piece a mutable builder avoids the waste of creating many temporary strings. Formatting methods handle inserting values into templates cleanly.',
              points: [
                { term: 'Mutable buffer', detail: 'A StringBuilder holds a growable character buffer you can append to repeatedly, then convert to a String once with toString.' },
                { term: 'Loop concatenation', detail: 'Using a builder inside a loop turns many short lived strings into a single buffer, which is far more efficient for large output.' },
                { term: 'Fluent chaining', detail: 'Append returns the builder itself so calls can be chained in one expression, keeping construction compact and readable.' },
                { term: 'Thread safety', detail: 'StringBuilder is not synchronized and is the fast default, while StringBuffer offers thread safety at a performance cost when shared.' },
                { term: 'Printf style formatting', detail: 'The format and formatted methods substitute values into placeholders such as string and number specifiers, which is cleaner than manual concatenation.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 7. OOP: Classes & Objects ─────────────────────────────────────────
  {
    id: 'java-classes',
    title: 'Classes & Objects',
    level: 1,
    slug: 'classes',
    concepts: [],
    children: [
      {
        id: 'java-class-anatomy',
        title: 'Class Anatomy & Constructors',
        level: 2,
        slug: 'class-anatomy',
        concepts: [
          {
            id: 'java-class-define',
            code: "public class Person {\n  private final String name;\n  private int age;\n\n  public Person(String name, int age) {\n    this.name = name;\n    this.age = age;\n  }\n\n  // Copy constructor\n  public Person(Person other) {\n    this(other.name, other.age);\n  }\n\n  @Override\n  public String toString() {\n    return \"%s (age %d)\".formatted(name, age);\n  }\n}",
            note: 'A class bundles state (fields) and behavior (methods). Constructors initialize objects. Use `this()` to chain constructors. Always override `toString()`, `equals()`, and `hashCode()` for value-like classes.',
            explanation: {
              heading: 'Anatomy of a class',
              intro: 'A class is the blueprint that combines data fields with the methods that operate on them. Constructors set up each new object so it starts in a valid state.',
              points: [
                { term: 'Fields and methods', detail: 'Fields hold the state of an object while methods define its behavior, and grouping them models a real concept as a single unit.' },
                { term: 'Constructors', detail: 'A constructor runs when an object is created and assigns initial values, and the this keyword distinguishes a field from a parameter of the same name.' },
                { term: 'Constructor chaining', detail: 'Calling this with arguments from one constructor invokes another in the same class, which avoids duplicating initialization logic.' },
                { term: 'Override the object methods', detail: 'For value like classes override toString for readable output and equals with hashCode so instances compare and hash by their contents.' },
                { term: 'Final fields', detail: 'Marking a field final means it must be set once during construction and never reassigned, which encourages immutable and safer objects.' },
              ],
            },
            example: "Person p = new Person(\"Alice\", 30);\nSystem.out.println(p); // Alice (age 30)",
          },
        ],
        children: [],
      },
      {
        id: 'java-static-members',
        title: 'Static Members & Initializers',
        level: 2,
        slug: 'static-members',
        concepts: [
          {
            id: 'java-static',
            code: "public class Counter {\n  private static int instanceCount = 0;\n\n  static {\n    System.out.println(\"Class loaded\");\n  }\n\n  public Counter() {\n    instanceCount++;\n  }\n\n  public static int getCount() {\n    return instanceCount;\n  }\n}",
            note: 'Static fields and methods belong to the class, not instances. Static initializer blocks run once when the class is first loaded. Use static factory methods as an alternative to constructors.',
            explanation: {
              heading: 'Members that belong to the class',
              intro: 'Static members are associated with the class itself rather than any single object, so they exist once and are shared by all instances. This suits shared state and utility behavior.',
              points: [
                { term: 'Shared state', detail: 'A static field has a single copy shared across every instance, which is useful for counters, caches, and constants.' },
                { term: 'Static methods', detail: 'A static method is called on the class without an object and cannot use instance fields, which fits stateless helper and factory logic.' },
                { term: 'Static initializer', detail: 'A static block runs once when the class is first loaded, giving a place to set up complex static state before any use.' },
                { term: 'Static factory methods', detail: 'A named static method that returns an instance can be clearer than a constructor and may reuse cached objects instead of always creating new ones.' },
                { term: 'Avoid mutable static state', detail: 'Shared mutable static fields are hard to reason about across threads, so keep them constant or guard access carefully.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 8. Inheritance ────────────────────────────────────────────────────
  {
    id: 'java-inheritance',
    title: 'Inheritance',
    level: 1,
    slug: 'inheritance',
    concepts: [],
    children: [
      {
        id: 'java-extends',
        title: 'Extending Classes',
        level: 2,
        slug: 'extends',
        concepts: [
          {
            id: 'java-extends-basic',
            code: "public class Animal {\n  protected String name;\n  public Animal(String name) { this.name = name; }\n  public void speak() { System.out.println(name + \" makes a sound\"); }\n}\n\npublic class Dog extends Animal {\n  public Dog(String name) { super(name); }\n\n  @Override\n  public void speak() { System.out.println(name + \" barks\"); }\n}",
            note: 'Java supports single class inheritance via `extends`. Subclasses inherit all non-private members. Call `super()` in the constructor to initialize the parent. Use `@Override` to catch signature mismatches at compile time.',
            explanation: {
              heading: 'Extending a base class',
              intro: 'Inheritance lets a subclass reuse and specialize the members of a parent class through the extends keyword. Java allows only one direct superclass to keep the hierarchy simple.',
              points: [
                { term: 'Single inheritance', detail: 'A class can extend exactly one parent, which avoids the ambiguity of multiple class inheritance while still allowing many interfaces.' },
                { term: 'Inherited members', detail: 'A subclass inherits all non private fields and methods of its parent and can add new ones or refine existing behavior.' },
                { term: 'Calling super', detail: 'A subclass constructor must initialize its parent by calling super, which runs first so the inherited state is ready before subclass code.' },
                { term: 'The override annotation', detail: 'Marking a redefined method with the override annotation makes the compiler verify it truly overrides a parent method, catching signature typos.' },
                { term: 'Prefer composition when unsure', detail: 'Inheritance couples a subclass tightly to its parent, so favor composition when the relationship is not a genuine is a relationship.' },
              ],
            },
            example: "Animal a = new Dog(\"Rex\");\na.speak(); // Rex barks — dynamic dispatch",
          },
        ],
        children: [],
      },
      {
        id: 'java-abstract-classes',
        title: 'Abstract Classes',
        level: 2,
        slug: 'abstract-classes',
        concepts: [
          {
            id: 'java-abstract',
            code: "public abstract class Shape {\n  abstract double area();\n  abstract double perimeter();\n\n  // Concrete method available to all subclasses\n  public void printInfo() {\n    System.out.printf(\"Area: %.2f, Perimeter: %.2f%n\", area(), perimeter());\n  }\n}\n\npublic class Circle extends Shape {\n  private final double radius;\n  public Circle(double r) { this.radius = r; }\n  @Override double area() { return Math.PI * radius * radius; }\n  @Override double perimeter() { return 2 * Math.PI * radius; }\n}",
            note: 'Abstract classes cannot be instantiated. They can contain both abstract (unimplemented) and concrete methods. Use them when subclasses share common behavior but differ in specifics.',
            explanation: {
              heading: 'Partial base classes',
              intro: 'An abstract class defines a template that mixes finished behavior with methods that subclasses must complete. It cannot be created directly because it is intentionally incomplete.',
              points: [
                { term: 'Cannot be instantiated', detail: 'You cannot create an object of an abstract class directly; you extend it and instantiate a concrete subclass that fills in the gaps.' },
                { term: 'Abstract methods', detail: 'An abstract method declares a signature with no body, forcing every concrete subclass to provide its own implementation.' },
                { term: 'Concrete shared behavior', detail: 'An abstract class can also hold fully implemented methods and fields, which lets subclasses share common logic without duplication.' },
                { term: 'Template method pattern', detail: 'A concrete method can call abstract ones to define a fixed sequence while letting subclasses supply the varying steps.' },
                { term: 'Class versus interface', detail: 'Choose an abstract class when subclasses share state and implementation, and an interface when you only need to describe a capability.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 9. Polymorphism ───────────────────────────────────────────────────
  {
    id: 'java-polymorphism',
    title: 'Polymorphism',
    level: 1,
    slug: 'polymorphism',
    concepts: [],
    children: [
      {
        id: 'java-runtime-poly',
        title: 'Runtime Polymorphism',
        level: 2,
        slug: 'runtime-polymorphism',
        concepts: [
          {
            id: 'java-dynamic-dispatch',
            code: "public interface Drawable {\n  void draw();\n}\n\npublic class Square implements Drawable {\n  @Override public void draw() { System.out.println(\"Drawing square\"); }\n}\n\npublic class Triangle implements Drawable {\n  @Override public void draw() { System.out.println(\"Drawing triangle\"); }\n}\n\n// Polymorphic usage\nList<Drawable> shapes = List.of(new Square(), new Triangle());\nshapes.forEach(Drawable::draw);",
            note: 'Polymorphism lets you treat different types uniformly through a shared interface or superclass. The JVM resolves the actual method at runtime (dynamic dispatch). This enables open/closed design — add new types without changing existing code.',
            explanation: {
              heading: 'One interface, many behaviors',
              intro: 'Runtime polymorphism lets code call a method on a common type while the actual behavior comes from the concrete object. The JVM decides which implementation runs based on the real type.',
              points: [
                { term: 'Dynamic dispatch', detail: 'When you call an overridden method the JVM picks the version belonging to the objects real class at runtime, not the declared reference type.' },
                { term: 'Program to an interface', detail: 'Holding objects through a shared interface or superclass lets the same code work with any implementation, present or future.' },
                { term: 'Open closed design', detail: 'You can add new implementing types without editing the code that uses the interface, which keeps existing logic stable.' },
                { term: 'Fields are not polymorphic', detail: 'Only instance methods are dispatched dynamically; field access and static methods bind to the declared type, which can surprise beginners.' },
                { term: 'Enables clean collections', detail: 'A list of the shared type can hold mixed concrete objects and iterate over them uniformly, as when drawing many shapes.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'java-method-overloading',
        title: 'Method Overloading (Compile-time)',
        level: 2,
        slug: 'overloading',
        concepts: [
          {
            id: 'java-overload',
            code: "public class MathUtils {\n  public static int add(int a, int b) { return a + b; }\n  public static double add(double a, double b) { return a + b; }\n  public static int add(int a, int b, int c) { return a + b + c; }\n}",
            note: 'Overloading means multiple methods with the same name but different parameter types or counts. Resolution happens at compile time based on the argument types. Avoid overloading with ambiguous types (e.g., int vs Integer).',
            explanation: {
              heading: 'Same name, different parameters',
              intro: 'Overloading lets several methods share a name as long as their parameter lists differ. The compiler chooses which one to call from the argument types, unlike overriding which happens at runtime.',
              points: [
                { term: 'Distinct signatures', detail: 'Overloaded methods must differ in the number or types of parameters, since the return type alone cannot distinguish them.' },
                { term: 'Compile time resolution', detail: 'The compiler selects the best matching overload from the static types of the arguments, which is why it is called static dispatch.' },
                { term: 'Widening and boxing', detail: 'When no exact match exists the compiler may widen a primitive or box it, and these rules can pick a surprising overload.' },
                { term: 'Avoid ambiguity', detail: 'Overloads that differ only by a primitive and its wrapper such as int and Integer are easy to confuse, so prefer distinct names when unclear.' },
                { term: 'Overloading versus overriding', detail: 'Overloading varies parameters within a class while overriding replaces a parent method with the same signature in a subclass.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 10. Encapsulation ─────────────────────────────────────────────────
  {
    id: 'java-encapsulation',
    title: 'Encapsulation',
    level: 1,
    slug: 'encapsulation',
    concepts: [],
    children: [
      {
        id: 'java-access-modifiers',
        title: 'Access Modifiers & Getters/Setters',
        level: 2,
        slug: 'access-modifiers',
        concepts: [
          {
            id: 'java-encap-access',
            code: "public class BankAccount {\n  private double balance; // hidden from outside\n\n  public BankAccount(double initial) {\n    if (initial < 0) throw new IllegalArgumentException(\"Negative initial balance\");\n    this.balance = initial;\n  }\n\n  public double getBalance() { return balance; }\n\n  public void deposit(double amount) {\n    if (amount <= 0) throw new IllegalArgumentException(\"Must deposit positive amount\");\n    balance += amount;\n  }\n\n  public void withdraw(double amount) {\n    if (amount > balance) throw new IllegalStateException(\"Insufficient funds\");\n    balance -= amount;\n  }\n}",
            note: 'Encapsulation protects internal state by making fields `private` and exposing controlled access through methods. Access levels: `private` → `default` (package) → `protected` → `public`. Validate inputs in setters to maintain invariants.',
            explanation: {
              heading: 'Guarding internal state',
              intro: 'Encapsulation hides an objects data behind methods so it can enforce rules about how that data changes. Private fields with controlled accessors keep an object always valid.',
              points: [
                { term: 'Private fields', detail: 'Making fields private prevents outside code from changing them directly, so the class stays in control of its own state.' },
                { term: 'Controlled access', detail: 'Getters and methods expose only the operations you intend, which lets you validate input and preserve invariants before any change.' },
                { term: 'Four access levels', detail: 'Visibility ranges from private through package default and protected to public, letting you widen access only as far as truly needed.' },
                { term: 'Maintain invariants', detail: 'Validating arguments inside methods, such as rejecting a negative balance, guarantees the object can never enter an illegal state.' },
                { term: 'Freedom to change', detail: 'Because callers depend only on the public methods, you can refactor the internal representation later without breaking them.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 11. Interfaces ────────────────────────────────────────────────────
  {
    id: 'java-interfaces',
    title: 'Interfaces',
    level: 1,
    slug: 'interfaces',
    concepts: [],
    children: [
      {
        id: 'java-interface-basics',
        title: 'Defining & Implementing Interfaces',
        level: 2,
        slug: 'interface-basics',
        concepts: [
          {
            id: 'java-interface-define',
            code: "public interface Sortable<T> {\n  int compareTo(T other);\n\n  // Default method (Java 8+)\n  default boolean isGreaterThan(T other) {\n    return compareTo(other) > 0;\n  }\n\n  // Static method\n  static <T extends Sortable<T>> T max(T a, T b) {\n    return a.compareTo(b) >= 0 ? a : b;\n  }\n}",
            note: 'Interfaces define contracts. Since Java 8 they can have `default` and `static` methods. Since Java 9 they can have `private` helper methods. A class can implement multiple interfaces — Java\'s answer to multiple inheritance.',
            explanation: {
              heading: 'Contracts a class can fulfill',
              intro: 'An interface describes a set of methods a type promises to provide without saying how. A class can implement many interfaces, which gives Java a safe form of multiple inheritance of behavior.',
              points: [
                { term: 'A pure contract', detail: 'An interface lists method signatures that implementers must supply, letting unrelated classes share a common capability.' },
                { term: 'Multiple implementation', detail: 'A class can implement several interfaces at once, so it can play many roles without the pitfalls of multiple class inheritance.' },
                { term: 'Default methods', detail: 'Since Java eight an interface can provide a default method body, which lets libraries add methods without breaking existing implementers.' },
                { term: 'Static and private helpers', detail: 'Interfaces may hold static utility methods and, since Java nine, private helpers that support their default methods.' },
                { term: 'Program to interfaces', detail: 'Depending on an interface rather than a concrete class keeps code flexible and makes swapping implementations straightforward.' },
              ],
            },
            example: "public class Temperature implements Sortable<Temperature> {\n  private final double celsius;\n  public Temperature(double c) { this.celsius = c; }\n  @Override public int compareTo(Temperature o) {\n    return Double.compare(celsius, o.celsius);\n  }\n}",
          },
        ],
        children: [],
      },
      {
        id: 'java-functional-interfaces',
        title: 'Functional Interfaces',
        level: 2,
        slug: 'functional-interfaces',
        concepts: [
          {
            id: 'java-func-interface',
            code: "@FunctionalInterface\npublic interface Transformer<T, R> {\n  R transform(T input);\n}\n\n// Usage with lambda\nTransformer<String, Integer> length = String::length;\nSystem.out.println(length.transform(\"hello\")); // 5",
            note: 'A functional interface has exactly one abstract method and can be implemented with a lambda. The `@FunctionalInterface` annotation is optional but prevents accidental additions. Common built-in ones: Function, Predicate, Consumer, Supplier.',
            explanation: {
              heading: 'Interfaces that lambdas satisfy',
              intro: 'A functional interface declares a single abstract method, which makes it the target type for a lambda or method reference. This is the foundation of Java functional style.',
              points: [
                { term: 'Single abstract method', detail: 'Exactly one unimplemented method defines the interface, so the compiler can treat a lambda as its implementation unambiguously.' },
                { term: 'The annotation', detail: 'Adding the functional interface annotation is optional but asks the compiler to fail if a second abstract method is ever introduced.' },
                { term: 'Built in interfaces', detail: 'The library supplies common shapes such as Function, Predicate, Consumer, and Supplier so you rarely need to define your own.' },
                { term: 'Default methods allowed', detail: 'A functional interface may still contain default and static methods, since only abstract methods count toward the single method rule.' },
                { term: 'Lambdas and references', detail: 'Both a lambda and a method reference can supply the one method, which keeps callback style code short and readable.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 12. Collections: List ─────────────────────────────────────────────
  {
    id: 'java-collections-list',
    title: 'Collections: List',
    level: 1,
    slug: 'collections-list',
    concepts: [],
    children: [
      {
        id: 'java-arraylist',
        title: 'ArrayList & LinkedList',
        level: 2,
        slug: 'arraylist',
        concepts: [
          {
            id: 'java-list-ops',
            code: "// Immutable list (Java 9+)\nList<String> immutable = List.of(\"a\", \"b\", \"c\");\n\n// Mutable ArrayList\nList<String> list = new ArrayList<>(immutable);\nlist.add(\"d\");\nlist.remove(0);\nlist.set(0, \"B\");\nString first = list.get(0);\n\n// LinkedList for frequent insertions/removals\nLinkedList<Integer> linked = new LinkedList<>();\nlinked.addFirst(1);\nlinked.addLast(2);",
            note: 'ArrayList is backed by a dynamic array — O(1) random access, O(n) insertion at arbitrary positions. LinkedList is doubly-linked — O(1) insertion at ends, O(n) access. Prefer ArrayList in most cases.',
            explanation: {
              heading: 'Choosing a list implementation',
              intro: 'The List interface describes an ordered, index based collection, and the two main implementations trade off differently. Knowing their internals guides the right choice.',
              points: [
                { term: 'ArrayList internals', detail: 'An ArrayList stores elements in a backing array that resizes as it grows, giving constant time random access by index.' },
                { term: 'Insertion cost', detail: 'Inserting or removing in the middle of an ArrayList shifts later elements, which is linear time, so it favors appends and reads.' },
                { term: 'LinkedList internals', detail: 'A LinkedList chains nodes with forward and backward links, so adding or removing at the ends is constant time but indexed access is slow.' },
                { term: 'Practical default', detail: 'ArrayList is the right choice for the vast majority of cases because access patterns usually favor indexing and appending.' },
                { term: 'Immutable lists', detail: 'The List of factory creates a fixed contents list that cannot be modified, which is ideal for constants and safe sharing.' },
              ],
            },
            example: "// Sorting and searching\nCollections.sort(list);\nint idx = Collections.binarySearch(list, \"B\");",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 13. Collections: Set ──────────────────────────────────────────────
  {
    id: 'java-collections-set',
    title: 'Collections: Set',
    level: 1,
    slug: 'collections-set',
    concepts: [],
    children: [
      {
        id: 'java-hashset',
        title: 'HashSet, TreeSet & LinkedHashSet',
        level: 2,
        slug: 'hashset',
        concepts: [
          {
            id: 'java-set-ops',
            code: "Set<String> hash = new HashSet<>(Set.of(\"a\", \"b\", \"c\"));\nhash.add(\"d\");           // O(1) average\nhash.contains(\"a\");      // true, O(1)\n\nSet<Integer> sorted = new TreeSet<>(List.of(5, 1, 3)); // {1, 3, 5}\nSet<String> ordered = new LinkedHashSet<>(); // maintains insertion order\n\n// Set operations\nSet<Integer> union = new HashSet<>(setA);\nunion.addAll(setB);\nSet<Integer> intersection = new HashSet<>(setA);\nintersection.retainAll(setB);",
            note: 'Sets contain no duplicates. HashSet uses a hash table (O(1) ops). TreeSet keeps elements sorted (O(log n) ops). LinkedHashSet preserves insertion order. Always override `equals()` and `hashCode()` for custom Set elements.',
            explanation: {
              heading: 'Collections without duplicates',
              intro: 'A Set stores unique elements and rejects duplicates. The three main implementations differ in ordering and performance, so you pick based on whether you need speed, sorting, or insertion order.',
              points: [
                { term: 'Uniqueness', detail: 'A set never holds two equal elements, which makes it ideal for membership tests and removing duplicates from a collection.' },
                { term: 'HashSet performance', detail: 'A HashSet uses a hash table for average constant time add, remove, and contains, but it makes no promise about ordering.' },
                { term: 'TreeSet ordering', detail: 'A TreeSet keeps elements sorted by natural order or a comparator with logarithmic time operations, useful for ranges and ordered iteration.' },
                { term: 'LinkedHashSet order', detail: 'A LinkedHashSet preserves the order in which elements were inserted while keeping near constant time operations.' },
                { term: 'Correct equality', detail: 'Custom element types must override equals and hashCode consistently, otherwise the set cannot detect duplicates reliably.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 14. Collections: Map ──────────────────────────────────────────────
  {
    id: 'java-collections-map',
    title: 'Collections: Map',
    level: 1,
    slug: 'collections-map',
    concepts: [],
    children: [
      {
        id: 'java-hashmap',
        title: 'HashMap, TreeMap & Utilities',
        level: 2,
        slug: 'hashmap',
        concepts: [
          {
            id: 'java-map-ops',
            code: "Map<String, Integer> map = new HashMap<>();\nmap.put(\"alice\", 90);\nmap.put(\"bob\", 85);\nmap.getOrDefault(\"charlie\", 0); // 0\nmap.putIfAbsent(\"alice\", 100);  // no-op, key exists\n\n// Compute patterns\nmap.compute(\"alice\", (k, v) -> v + 10); // 100\nmap.merge(\"bob\", 5, Integer::sum);      // 90\n\n// Immutable map (Java 9+)\nvar scores = Map.of(\"x\", 1, \"y\", 2);",
            note: 'HashMap provides O(1) average get/put. TreeMap keeps keys sorted (O(log n)). LinkedHashMap preserves insertion or access order. Use `compute`, `merge`, and `putIfAbsent` to avoid check-then-act race patterns.',
            explanation: {
              heading: 'Key to value lookups',
              intro: 'A Map associates unique keys with values for fast lookup. As with sets the implementation choice controls ordering and performance, and modern methods simplify update logic.',
              points: [
                { term: 'HashMap performance', detail: 'A HashMap offers average constant time get and put by hashing keys, but iteration order is unspecified and may change.' },
                { term: 'TreeMap ordering', detail: 'A TreeMap keeps keys sorted with logarithmic operations and supports range queries such as finding the next higher key.' },
                { term: 'LinkedHashMap order', detail: 'A LinkedHashMap preserves insertion order, or access order when configured, which is handy for building simple caches.' },
                { term: 'Atomic update helpers', detail: 'Methods such as compute, merge, and putIfAbsent combine a check and an update in one call, avoiding fragile read then write logic.' },
                { term: 'Good keys', detail: 'Keys should be immutable and implement equals and hashCode correctly, since mutating a key after insertion can lose the entry.' },
              ],
            },
            example: "// Iterating a map\nfor (var entry : map.entrySet()) {\n  System.out.println(entry.getKey() + \": \" + entry.getValue());\n}\nmap.forEach((k, v) -> System.out.println(k + \"=\" + v));",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 15. Generics ──────────────────────────────────────────────────────
  {
    id: 'java-generics',
    title: 'Generics',
    level: 1,
    slug: 'generics',
    concepts: [],
    children: [
      {
        id: 'java-generics-classes',
        title: 'Generic Classes & Methods',
        level: 2,
        slug: 'generic-classes',
        concepts: [
          {
            id: 'java-generic-class',
            code: "public class Pair<A, B> {\n  private final A first;\n  private final B second;\n\n  public Pair(A first, B second) {\n    this.first = first;\n    this.second = second;\n  }\n\n  public A getFirst() { return first; }\n  public B getSecond() { return second; }\n\n  // Generic method\n  public static <T extends Comparable<T>> T max(T a, T b) {\n    return a.compareTo(b) >= 0 ? a : b;\n  }\n}",
            note: 'Generics provide compile-time type safety without casting. Type parameters are erased at runtime (type erasure). Bounded types (`<T extends X>`) restrict acceptable types. Generic methods can have their own type parameters independent of the class.',
            explanation: {
              heading: 'Type safe containers and methods',
              intro: 'Generics let a class or method work with a type supplied by the caller while keeping full compile time checking. This removes casts and prevents whole categories of runtime type errors.',
              points: [
                { term: 'Type parameters', detail: 'A placeholder such as T stands for a type chosen when the class or method is used, so the same code serves many concrete types safely.' },
                { term: 'No casting', detail: 'Because the compiler knows the element type, values come out already typed and you avoid the error prone casts of raw collections.' },
                { term: 'Type erasure', detail: 'Generic type information is removed at runtime, so you cannot query a type argument or create an array of a parameterized type directly.' },
                { term: 'Bounded types', detail: 'Writing T extends some type restricts the allowed arguments and lets the method call the bound methods, such as compareTo on a Comparable.' },
                { term: 'Generic methods', detail: 'A method can declare its own type parameters independent of the class, which is common for static utility methods.' },
              ],
            },
            example: "Pair<String, Integer> p = new Pair<>(\"age\", 30);\nString max = Pair.max(\"apple\", \"banana\"); // \"banana\"",
          },
        ],
        children: [],
      },
      {
        id: 'java-wildcards',
        title: 'Wildcards: extends & super',
        level: 2,
        slug: 'wildcards',
        concepts: [
          {
            id: 'java-wildcard-pecs',
            code: "// Producer Extends, Consumer Super (PECS)\npublic static double sum(List<? extends Number> numbers) {\n  return numbers.stream().mapToDouble(Number::doubleValue).sum();\n}\n\npublic static void addInts(List<? super Integer> list) {\n  list.add(1);\n  list.add(2);\n}\n\n// Unbounded wildcard\npublic static void printAll(List<?> items) {\n  items.forEach(System.out::println);\n}",
            note: 'Use `? extends T` when you only read (producer). Use `? super T` when you only write (consumer). This is the PECS principle. Unbounded `<?>` means any type but you can only read as Object.',
            explanation: {
              heading: 'Flexible generics with wildcards',
              intro: 'Wildcards let a method accept a family of related generic types instead of one exact type. The direction of the bound controls whether you can read from or write to the structure.',
              points: [
                { term: 'Extends for producers', detail: 'A parameter of type list of some subtype lets you read elements as the upper bound, but you cannot add items because the exact type is unknown.' },
                { term: 'Super for consumers', detail: 'A parameter of type list of some supertype lets you add elements of the bound, since any supertype can hold them safely.' },
                { term: 'The PECS rule', detail: 'The mnemonic producer extends consumer super reminds you to use extends when a structure supplies values and super when it receives them.' },
                { term: 'Unbounded wildcard', detail: 'A plain question mark means any type, but you can only read elements as Object and cannot add anything except null.' },
                { term: 'Wider apis', detail: 'Wildcards make methods more reusable by accepting related parameterizations, which a single exact type parameter would reject.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 16. Exceptions ────────────────────────────────────────────────────
  {
    id: 'java-exceptions',
    title: 'Exception Handling',
    level: 1,
    slug: 'exceptions',
    concepts: [],
    children: [
      {
        id: 'java-try-catch',
        title: 'Try/Catch & Custom Exceptions',
        level: 2,
        slug: 'try-catch',
        concepts: [
          {
            id: 'java-exception-handling',
            code: "// Try-with-resources (auto-close)\ntry (var reader = new BufferedReader(new FileReader(\"data.txt\"))) {\n  String line = reader.readLine();\n} catch (FileNotFoundException e) {\n  System.err.println(\"File not found: \" + e.getMessage());\n} catch (IOException e) {\n  throw new RuntimeException(\"IO error\", e); // wrap & rethrow\n} finally {\n  System.out.println(\"Always executes\");\n}",
            note: 'Checked exceptions must be caught or declared. Unchecked (RuntimeException) do not. Try-with-resources (Java 7+) auto-closes any AutoCloseable. Prefer specific catch clauses over catching Exception. Chain exceptions with the cause constructor.',
            explanation: {
              heading: 'Handling errors safely',
              intro: 'Java signals errors by throwing exception objects that unwind the call stack until a matching catch handles them. Structured try blocks let you recover or clean up reliably.',
              points: [
                { term: 'Checked versus unchecked', detail: 'Checked exceptions must be caught or declared with throws, while unchecked runtime exceptions need no declaration and usually signal programming mistakes.' },
                { term: 'Try with resources', detail: 'Declaring a resource in the try header closes it automatically when the block ends, which prevents leaks even if an exception is thrown.' },
                { term: 'Specific catches', detail: 'Catching narrow exception types lets you respond appropriately to each failure, while catching broad Exception can hide bugs.' },
                { term: 'The finally block', detail: 'Code in a finally block always runs whether or not an exception occurred, making it a place for cleanup that must happen.' },
                { term: 'Chaining causes', detail: 'Wrapping a low level exception in a higher level one while passing the original as the cause preserves the full diagnostic trail.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'java-custom-exceptions',
        title: 'Custom Exceptions & Best Practices',
        level: 2,
        slug: 'custom-exceptions',
        concepts: [
          {
            id: 'java-custom-exc',
            code: "public class InsufficientFundsException extends Exception {\n  private final double deficit;\n\n  public InsufficientFundsException(double deficit) {\n    super(\"Insufficient funds. Deficit: \" + deficit);\n    this.deficit = deficit;\n  }\n\n  public double getDeficit() { return deficit; }\n}",
            note: 'Create custom exceptions for domain-specific error conditions. Extend Exception for checked, RuntimeException for unchecked. Include context (deficit amount, invalid value) to aid debugging. Never use exceptions for flow control.',
            explanation: {
              heading: 'Designing your own exceptions',
              intro: 'A custom exception type gives a meaningful name to a domain specific failure and can carry extra data about what went wrong. Choosing the right base class sets whether callers must handle it.',
              points: [
                { term: 'Checked or unchecked', detail: 'Extend Exception for a checked error callers are expected to handle, or RuntimeException for a programming error that should propagate freely.' },
                { term: 'Carry context', detail: 'Adding fields such as the deficit amount lets handlers inspect the specifics rather than parsing a message string.' },
                { term: 'Preserve the cause', detail: 'Passing an underlying exception to the super constructor keeps the original stack trace so the root cause is not lost.' },
                { term: 'Meaningful names', detail: 'A clear class name such as insufficient funds communicates intent far better than a generic exception with only a message.' },
                { term: 'Not for control flow', detail: 'Exceptions are costly and obscure logic when used for ordinary branching, so reserve them for genuinely exceptional conditions.' },
              ],
            },
            example: "public void withdraw(double amount) throws InsufficientFundsException {\n  if (amount > balance)\n    throw new InsufficientFundsException(amount - balance);\n  balance -= amount;\n}",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 17. Streams & Lambdas ─────────────────────────────────────────────
  {
    id: 'java-streams-lambdas',
    title: 'Streams & Lambdas',
    level: 1,
    slug: 'streams-lambdas',
    concepts: [],
    children: [
      {
        id: 'java-lambda-syntax',
        title: 'Lambda Expressions',
        level: 2,
        slug: 'lambdas',
        concepts: [
          {
            id: 'java-lambda-basics',
            code: "// Lambda syntax variations\nComparator<String> byLength = (a, b) -> Integer.compare(a.length(), b.length());\nRunnable task = () -> System.out.println(\"Running\");\nFunction<String, Integer> parse = Integer::parseInt; // method reference\n\n// Effectively final capture\nString prefix = \"Hello\";\nFunction<String, String> greet = name -> prefix + \" \" + name;",
            note: 'Lambdas implement functional interfaces concisely. They capture effectively final local variables from enclosing scope. Method references (Class::method) are shorthand for common lambda patterns: static, instance, and constructor references.',
            explanation: {
              heading: 'Compact anonymous functions',
              intro: 'A lambda is a short block of behavior you can pass around like a value, implementing a functional interface without a named class. Method references make the most common cases even shorter.',
              points: [
                { term: 'Concise syntax', detail: 'A lambda writes just parameters and a body, and the compiler infers the target type from the surrounding functional interface.' },
                { term: 'Capturing variables', detail: 'A lambda can use local variables from its enclosing scope only if they are effectively final, which keeps the captured value stable.' },
                { term: 'Method references', detail: 'When a lambda simply calls an existing method you can replace it with a method reference using the double colon syntax for clarity.' },
                { term: 'Reference kinds', detail: 'Method references come in static, bound instance, unbound instance, and constructor forms, covering most lambda shapes you write.' },
                { term: 'Behavior as data', detail: 'Passing lambdas lets you parameterize algorithms with behavior, which powers comparators, callbacks, and stream operations.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'java-stream-pipeline',
        title: 'Stream Pipelines',
        level: 2,
        slug: 'stream-pipelines',
        concepts: [
          {
            id: 'java-stream-ops',
            code: "List<String> names = List.of(\"Alice\", \"Bob\", \"Charlie\", \"Dave\");\n\n// Filter, map, collect\nList<String> result = names.stream()\n  .filter(n -> n.length() > 3)\n  .map(String::toUpperCase)\n  .sorted()\n  .collect(Collectors.toList());\n\n// Reduce\nint total = IntStream.rangeClosed(1, 100).sum(); // 5050\n\n// Grouping\nMap<Integer, List<String>> byLength = names.stream()\n  .collect(Collectors.groupingBy(String::length));",
            note: 'Streams are lazy pipelines: intermediate ops (filter, map, sorted) build the pipeline; terminal ops (collect, forEach, reduce) trigger execution. Streams are single-use. Use `parallelStream()` for CPU-bound work on large datasets.',
            explanation: {
              heading: 'Declarative data pipelines',
              intro: 'A stream expresses a sequence of transformations over data in a readable pipeline. Operations are lazy and only run when a terminal step demands a result, which enables efficient processing.',
              points: [
                { term: 'Intermediate operations', detail: 'Steps such as filter, map, and sorted return a new stream and build up the pipeline without doing any work yet.' },
                { term: 'Terminal operations', detail: 'A terminal step such as collect, reduce, or forEach triggers execution, consumes the stream, and produces a final result.' },
                { term: 'Laziness and fusion', detail: 'Because processing is deferred the runtime can fuse steps and stop early, for example when finding the first match.' },
                { term: 'Single use', detail: 'A stream cannot be reused after a terminal operation, so you create a fresh stream from the source each time.' },
                { term: 'Parallel with care', detail: 'A parallel stream can speed up large CPU bound work, but it requires stateless side effect free operations to stay correct.' },
              ],
            },
            example: "// Find first match\nOptional<String> found = names.stream()\n  .filter(n -> n.startsWith(\"C\"))\n  .findFirst(); // Optional[Charlie]",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 18. Optionals ─────────────────────────────────────────────────────
  {
    id: 'java-optionals',
    title: 'Optionals',
    level: 1,
    slug: 'optionals',
    concepts: [],
    children: [
      {
        id: 'java-optional-usage',
        title: 'Creating & Using Optionals',
        level: 2,
        slug: 'optional-usage',
        concepts: [
          {
            id: 'java-optional-basics',
            code: "// Creating optionals\nOptional<String> present = Optional.of(\"hello\");\nOptional<String> empty = Optional.empty();\nOptional<String> nullable = Optional.ofNullable(getValue());\n\n// Chaining operations\nString result = nullable\n  .filter(s -> s.length() > 3)\n  .map(String::toUpperCase)\n  .orElse(\"DEFAULT\");\n\n// Throwing if absent\nString value = nullable\n  .orElseThrow(() -> new IllegalStateException(\"Value required\"));",
            note: 'Optional represents a value that may or may not be present. Use it as a return type for methods that might not find a result. Never use Optional for fields or method parameters. Prefer `orElse`, `map`, and `flatMap` over `isPresent()`/`get()`.',
            explanation: {
              heading: 'Modeling absence explicitly',
              intro: 'Optional is a container that either holds a value or is empty, making the possibility of no result visible in the type. Used well it reduces null checks and prevents null pointer errors.',
              points: [
                { term: 'A return type', detail: 'Optional shines as the return type of a method that might not find a value, since it forces the caller to consider the empty case.' },
                { term: 'Transforming safely', detail: 'The map and flatMap methods apply logic only when a value is present, letting you chain operations without explicit null checks.' },
                { term: 'Supplying defaults', detail: 'Methods such as orElse and orElseThrow define what happens when the value is missing, either substituting a fallback or raising an error.' },
                { term: 'Avoid get', detail: 'Calling get without checking can throw, so prefer the functional methods over the isPresent and get pair.' },
                { term: 'Not for fields', detail: 'Optional is meant for return values, not for fields or parameters, where it adds overhead without clear benefit.' },
              ],
            },
            example: "// flatMap for nested Optionals\nOptional<String> city = findUser(id)\n  .flatMap(User::getAddress)\n  .flatMap(Address::getCity);",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 19. Records ───────────────────────────────────────────────────────
  {
    id: 'java-records',
    title: 'Records',
    level: 1,
    slug: 'records',
    concepts: [],
    children: [
      {
        id: 'java-record-basics',
        title: 'Defining & Using Records',
        level: 2,
        slug: 'record-basics',
        concepts: [
          {
            id: 'java-record-define',
            code: "// Compact immutable data carrier (Java 16+)\npublic record Point(double x, double y) {\n  // Compact constructor for validation\n  public Point {\n    if (Double.isNaN(x) || Double.isNaN(y))\n      throw new IllegalArgumentException(\"Coordinates cannot be NaN\");\n  }\n\n  // Custom method\n  public double distanceTo(Point other) {\n    return Math.sqrt(Math.pow(x - other.x, 2) + Math.pow(y - other.y, 2));\n  }\n}",
            note: 'Records auto-generate constructor, accessors (`x()`, `y()`), `equals()`, `hashCode()`, and `toString()`. They are implicitly final and cannot extend other classes. Use compact constructors for validation. Records can implement interfaces.',
            explanation: {
              heading: 'Concise immutable data carriers',
              intro: 'A record is a transparent holder for a fixed set of values that the compiler fills out for you. It removes the boilerplate of writing constructors, accessors, and equality by hand.',
              points: [
                { term: 'Generated members', detail: 'From the header the compiler creates a canonical constructor, an accessor per component, and correct equals, hashCode, and toString methods.' },
                { term: 'Immutable by design', detail: 'Record components are final, so a record instance never changes after construction, which makes it safe to share and reason about.' },
                { term: 'Compact constructor', detail: 'A compact constructor lets you validate or normalize arguments before the fields are assigned, without repeating the parameter list.' },
                { term: 'Restrictions', detail: 'A record is implicitly final and cannot extend another class, though it may implement interfaces and add extra methods.' },
                { term: 'Great for data transfer', detail: 'Records suit value objects, keys, and data transfer where identity is defined purely by the contained values.' },
              ],
            },
            example: "Point p1 = new Point(0, 0);\nPoint p2 = new Point(3, 4);\nSystem.out.println(p1.distanceTo(p2)); // 5.0\nSystem.out.println(p1); // Point[x=0.0, y=0.0]",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 20. Sealed Classes ────────────────────────────────────────────────
  {
    id: 'java-sealed-classes',
    title: 'Sealed Classes',
    level: 1,
    slug: 'sealed-classes',
    concepts: [],
    children: [
      {
        id: 'java-sealed-basics',
        title: 'Sealed Hierarchies',
        level: 2,
        slug: 'sealed-basics',
        concepts: [
          {
            id: 'java-sealed-define',
            code: "// Sealed interface restricts implementations (Java 17)\npublic sealed interface Shape\n  permits Circle, Rectangle, Triangle {}\n\npublic record Circle(double radius) implements Shape {}\npublic record Rectangle(double w, double h) implements Shape {}\npublic final class Triangle implements Shape {\n  private final double a, b, c;\n  public Triangle(double a, double b, double c) {\n    this.a = a; this.b = b; this.c = c;\n  }\n}",
            note: 'Sealed classes/interfaces restrict which types can extend them via `permits`. Subclasses must be `final`, `sealed`, or `non-sealed`. This enables exhaustive pattern matching and models closed domain hierarchies.',
            explanation: {
              heading: 'Controlled class hierarchies',
              intro: 'A sealed type names exactly which classes may extend or implement it, closing the hierarchy to a known set. This lets the compiler reason about all possible subtypes.',
              points: [
                { term: 'The permits clause', detail: 'A sealed type lists its allowed direct subtypes with permits, so no outside class can join the hierarchy unexpectedly.' },
                { term: 'Subtype obligations', detail: 'Each permitted subtype must declare itself final, sealed, or non sealed, which keeps the closure explicit and intentional.' },
                { term: 'Exhaustive switches', detail: 'Because the compiler knows every subtype, a switch over a sealed type can be exhaustive without a default branch.' },
                { term: 'Modeling closed domains', detail: 'Sealed hierarchies express domains with a fixed set of variants, such as a small set of shapes or message kinds.' },
                { term: 'Pairs with records', detail: 'Sealed interfaces implemented by records give a concise algebraic style that combines fixed variants with immutable data.' },
              ],
            },
            example: "// Exhaustive switch with sealed types\ndouble area = switch (shape) {\n  case Circle c    -> Math.PI * c.radius() * c.radius();\n  case Rectangle r -> r.w() * r.h();\n  case Triangle t  -> computeTriangleArea(t);\n}; // no default needed — compiler knows all cases",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 21. Pattern Matching ──────────────────────────────────────────────
  {
    id: 'java-pattern-matching',
    title: 'Pattern Matching',
    level: 1,
    slug: 'pattern-matching',
    concepts: [],
    children: [
      {
        id: 'java-pattern-switch',
        title: 'Pattern Matching in Switch',
        level: 2,
        slug: 'pattern-switch',
        concepts: [
          {
            id: 'java-pattern-switch-code',
            code: "// Pattern matching for switch (Java 21)\nstatic String describe(Object obj) {\n  return switch (obj) {\n    case Integer i when i > 0 -> \"Positive int: \" + i;\n    case Integer i            -> \"Non-positive int: \" + i;\n    case String s             -> \"String of length \" + s.length();\n    case int[] arr            -> \"Int array of length \" + arr.length;\n    case null                 -> \"null value\";\n    default                   -> \"Unknown: \" + obj.getClass().getName();\n  };\n}",
            note: 'Pattern matching combines type checking, casting, and deconstruction into one step. Guarded patterns use `when` clauses. Patterns are checked top-to-bottom; more specific patterns must come before general ones. Null can be handled explicitly.',
            explanation: {
              heading: 'Testing shape and extracting data',
              intro: 'Pattern matching in switch tests the type of a value and binds it in one move, and record patterns can pull apart nested components. This turns verbose type checks into clear branches.',
              points: [
                { term: 'Type patterns', detail: 'A case can match a type and bind a typed variable at once, removing the separate cast that older switch code needed.' },
                { term: 'Guarded patterns', detail: 'Adding a when clause refines a case with an extra boolean condition, so you can distinguish positive from non positive values.' },
                { term: 'Ordering matters', detail: 'Cases are checked from top to bottom, so more specific patterns must appear before broader ones or they become unreachable.' },
                { term: 'Record deconstruction', detail: 'A record pattern matches a record and binds its components directly, even nested, which reads far cleaner than manual accessor calls.' },
                { term: 'Explicit null', detail: 'A switch can include a null case so a null value is handled deliberately rather than throwing before any branch runs.' },
              ],
            },
            example: "// Record patterns (deconstruction)\nrecord Rect(Point topLeft, Point bottomRight) {}\n\nif (shape instanceof Rect(Point(var x1, var y1), Point(var x2, var y2))) {\n  double width = Math.abs(x2 - x1);\n}",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 22. Concurrency: Threads & Executors ──────────────────────────────
  {
    id: 'java-concurrency',
    title: 'Concurrency',
    level: 1,
    slug: 'concurrency',
    concepts: [],
    children: [
      {
        id: 'java-threads',
        title: 'Threads & Synchronization',
        level: 2,
        slug: 'threads',
        concepts: [
          {
            id: 'java-threads-basics',
            code: "// Creating threads\nThread t1 = new Thread(() -> {\n  System.out.println(\"Running in: \" + Thread.currentThread().getName());\n});\nt1.start();\n\n// Synchronized method\npublic class Counter {\n  private int count = 0;\n  public synchronized void increment() { count++; }\n  public synchronized int getCount() { return count; }\n}\n\n// ReentrantLock for finer control\nprivate final Lock lock = new ReentrantLock();\npublic void safeIncrement() {\n  lock.lock();\n  try { count++; }\n  finally { lock.unlock(); }\n}",
            note: 'Threads are the basic unit of concurrency in Java. Use `synchronized` for simple mutual exclusion. Prefer `ReentrantLock` when you need try-lock, timed locks, or multiple conditions. Always release locks in a `finally` block.',
            explanation: {
              heading: 'Running code concurrently',
              intro: 'A thread is an independent path of execution within a program, letting work proceed in parallel. Shared mutable state between threads must be coordinated to avoid corruption.',
              points: [
                { term: 'Starting a thread', detail: 'Passing a runnable to a thread and calling start runs its body on a separate thread, while calling run directly would not create concurrency.' },
                { term: 'Race conditions', detail: 'When multiple threads read and write the same field without coordination the result can be inconsistent, which is a data race.' },
                { term: 'The synchronized keyword', detail: 'Marking a method or block synchronized lets only one thread hold the objects monitor at a time, providing simple mutual exclusion.' },
                { term: 'Reentrant lock', detail: 'A ReentrantLock offers finer control such as timed and interruptible attempts, but you must release it in a finally block.' },
                { term: 'Visibility', detail: 'Changes made by one thread are not automatically visible to others, so use synchronization or the volatile keyword to publish updates safely.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'java-executors',
        title: 'ExecutorService & Thread Pools',
        level: 2,
        slug: 'executors',
        concepts: [
          {
            id: 'java-executor-basics',
            code: "// Thread pool\nExecutorService pool = Executors.newFixedThreadPool(4);\n\n// Submit tasks\nFuture<String> future = pool.submit(() -> {\n  Thread.sleep(1000);\n  return \"Result\";\n});\n\nString result = future.get(5, TimeUnit.SECONDS); // blocks\n\n// Shutdown gracefully\npool.shutdown();\nif (!pool.awaitTermination(10, TimeUnit.SECONDS)) {\n  pool.shutdownNow();\n}",
            note: 'ExecutorService manages a pool of threads, reusing them for submitted tasks. Never create unbounded threads manually — use pools. `submit()` returns a Future for async results. Always shut down executors to prevent resource leaks.',
            explanation: {
              heading: 'Managing threads with pools',
              intro: 'An executor service hides thread creation behind a reusable pool that runs the tasks you submit. This bounds resource use and separates task logic from thread management.',
              points: [
                { term: 'Thread reuse', detail: 'A pool keeps a fixed set of worker threads alive and hands them tasks in turn, avoiding the cost of creating a thread per task.' },
                { term: 'Submitting work', detail: 'The submit method queues a task and returns a Future, which represents the eventual result you can retrieve or cancel.' },
                { term: 'Blocking for results', detail: 'Calling get on a Future waits for the task to finish, and a timed overload lets you avoid waiting forever.' },
                { term: 'Orderly shutdown', detail: 'Calling shutdown stops accepting new tasks and lets running ones finish, which prevents the application from leaking threads.' },
                { term: 'Bounded over unbounded', detail: 'Creating threads by hand for every task can exhaust the system, so a sized pool keeps concurrency under control.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 23. CompletableFuture ─────────────────────────────────────────────
  {
    id: 'java-completable-future',
    title: 'CompletableFuture',
    level: 1,
    slug: 'completable-future',
    concepts: [],
    children: [
      {
        id: 'java-cf-chaining',
        title: 'Async Composition',
        level: 2,
        slug: 'cf-chaining',
        concepts: [
          {
            id: 'java-cf-basics',
            code: "CompletableFuture<String> cf = CompletableFuture\n  .supplyAsync(() -> fetchData(\"url\"))       // runs in ForkJoinPool\n  .thenApply(data -> parse(data))             // transform\n  .thenCompose(parsed -> saveAsync(parsed))   // flatMap another CF\n  .exceptionally(ex -> {\n    logger.error(\"Failed\", ex);\n    return fallback();\n  });\n\n// Combine multiple futures\nCompletableFuture<Void> all = CompletableFuture.allOf(cf1, cf2, cf3);\nCompletableFuture<Object> any = CompletableFuture.anyOf(cf1, cf2);",
            note: 'CompletableFuture enables non-blocking async pipelines. Use `thenApply` for sync transforms, `thenCompose` for async chaining (like flatMap), and `thenCombine` to merge two futures. `exceptionally` and `handle` provide error recovery. All operations have `*Async` variants for controlling the executor.',
            explanation: {
              heading: 'Composing asynchronous work',
              intro: 'A CompletableFuture represents a result that will arrive later and lets you attach follow up steps without blocking. You build a pipeline that runs as each stage completes.',
              points: [
                { term: 'Starting async', detail: 'The supplyAsync method runs a task on a background executor and returns a future that will hold its eventual result.' },
                { term: 'Transform versus compose', detail: 'The thenApply method maps a completed value synchronously, while thenCompose chains another future like a flatMap for async steps.' },
                { term: 'Combining futures', detail: 'The thenCombine method merges two independent futures once both finish, and allOf waits for a whole group to complete.' },
                { term: 'Error recovery', detail: 'The exceptionally and handle methods intercept a failure to supply a fallback value or transform the outcome.' },
                { term: 'Controlling the executor', detail: 'Each stage has an async variant that lets you choose the thread pool, which matters for blocking or CPU heavy work.' },
              ],
            },
            example: "// Combine two independent results\nCompletableFuture<String> greeting = \n  CompletableFuture.supplyAsync(() -> \"Hello\")\n    .thenCombine(\n      CompletableFuture.supplyAsync(() -> \"World\"),\n      (a, b) -> a + \" \" + b\n    ); // \"Hello World\"",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 24. I/O ───────────────────────────────────────────────────────────
  {
    id: 'java-io',
    title: 'I/O (Input/Output)',
    level: 1,
    slug: 'io',
    concepts: [],
    children: [
      {
        id: 'java-file-io',
        title: 'File Reading & Writing',
        level: 2,
        slug: 'file-io',
        concepts: [
          {
            id: 'java-file-ops',
            code: "// Reading a file (modern approach)\nString content = Files.readString(Path.of(\"data.txt\"));\nList<String> lines = Files.readAllLines(Path.of(\"data.txt\"));\n\n// Writing\nFiles.writeString(Path.of(\"out.txt\"), \"Hello\\n\",\n  StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);\n\n// Streaming large files\ntry (Stream<String> stream = Files.lines(Path.of(\"large.txt\"))) {\n  stream.filter(line -> line.contains(\"ERROR\"))\n    .forEach(System.out::println);\n}",
            note: '`java.nio.file.Files` is the modern API for file operations. It handles charset encoding (defaults to UTF-8 since Java 18). For large files, use streaming with `Files.lines()` to avoid loading everything into memory.',
            explanation: {
              heading: 'Reading and writing files',
              intro: 'The Files utility class offers concise static methods for common file tasks so you rarely open raw streams by hand. Choosing between whole file and streaming methods depends on size.',
              points: [
                { term: 'Whole file convenience', detail: 'Methods such as readString and readAllLines load an entire file in one call, which is simple and fine for small inputs.' },
                { term: 'Writing with options', detail: 'The writeString method saves text and accepts open options that control whether to create, append, or truncate the target.' },
                { term: 'Streaming large files', detail: 'The lines method returns a lazy stream so you can process a huge file line by line without loading it all into memory.' },
                { term: 'Close the stream', detail: 'A file backed stream holds an open handle, so wrap it in a try with resources block to release the file promptly.' },
                { term: 'Character encoding', detail: 'These methods default to the UTF eight charset on modern releases, giving consistent text handling across platforms.' },
              ],
            },
            example: "// Buffered reading for performance\ntry (var br = Files.newBufferedReader(Path.of(\"data.csv\"))) {\n  String line;\n  while ((line = br.readLine()) != null) {\n    process(line);\n  }\n}",
          },
        ],
        children: [],
      },
      {
        id: 'java-serialization',
        title: 'Serialization & Streams',
        level: 2,
        slug: 'serialization',
        concepts: [
          {
            id: 'java-serial',
            code: "// InputStream/OutputStream for binary data\ntry (var out = new ObjectOutputStream(new FileOutputStream(\"obj.dat\"))) {\n  out.writeObject(myObject);\n}\n\ntry (var in = new ObjectInputStream(new FileInputStream(\"obj.dat\"))) {\n  MyClass obj = (MyClass) in.readObject();\n}",
            note: 'Java serialization (`Serializable`) converts objects to bytes and back. It is legacy and has security concerns — prefer JSON/protobuf for new code. InputStream/OutputStream are for byte streams; Reader/Writer are for character streams.',
            explanation: {
              heading: 'Turning objects into bytes',
              intro: 'Serialization writes an object graph to a byte stream so it can be stored or sent, and deserialization rebuilds it. Java has built in support but it comes with important caveats.',
              points: [
                { term: 'The serializable marker', detail: 'A class opts in by implementing the serializable interface, after which object streams can write and read its instances.' },
                { term: 'Byte versus character streams', detail: 'Input and output streams move raw bytes for binary data, while readers and writers handle text with a charset.' },
                { term: 'Security concerns', detail: 'Deserializing untrusted bytes can execute dangerous code paths, so avoid it on external input and prefer safer formats.' },
                { term: 'Prefer modern formats', detail: 'For new systems formats such as JSON or protocol buffers are more portable and safer than built in serialization.' },
                { term: 'Version compatibility', detail: 'Changing a class can break reading old data, so a serial version identifier helps manage compatibility across versions.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 25. NIO (Non-blocking I/O) ────────────────────────────────────────
  {
    id: 'java-nio',
    title: 'NIO & Paths',
    level: 1,
    slug: 'nio',
    concepts: [],
    children: [
      {
        id: 'java-nio-paths',
        title: 'Paths, Channels & Buffers',
        level: 2,
        slug: 'nio-paths',
        concepts: [
          {
            id: 'java-nio-basics',
            code: "// Path operations\nPath path = Path.of(\"/home\", \"user\", \"docs\", \"file.txt\");\nPath parent = path.getParent();     // /home/user/docs\nPath resolved = parent.resolve(\"other.txt\");\nboolean exists = Files.exists(path);\n\n// Directory walking\ntry (Stream<Path> walk = Files.walk(Path.of(\"src\"), 3)) {\n  walk.filter(p -> p.toString().endsWith(\".java\"))\n    .forEach(System.out::println);\n}\n\n// Watch service for file system events\nWatchService watcher = FileSystems.getDefault().newWatchService();\nPath.of(\".\").register(watcher, ENTRY_CREATE, ENTRY_MODIFY);",
            note: 'NIO.2 (java.nio.file) provides the modern Path API replacing java.io.File. `Files.walk()` recursively traverses directories. WatchService monitors file system changes. Channels and Buffers enable non-blocking I/O for high-throughput scenarios.',
            explanation: {
              heading: 'The modern path and channel API',
              intro: 'The newer file API centers on the Path type for locations and adds powerful traversal and monitoring tools. Channels and buffers underpin high throughput non blocking transfers.',
              points: [
                { term: 'Path over file', detail: 'A Path represents a location in the file system and offers robust operations such as resolve and getParent that the old file class handled awkwardly.' },
                { term: 'Directory walking', detail: 'The walk method returns a stream of paths under a directory to a chosen depth, which makes recursive traversal concise.' },
                { term: 'Watching for changes', detail: 'A watch service reports file system events such as creation and modification, useful for tools that react to edits.' },
                { term: 'Channels and buffers', detail: 'Channels move data through reusable buffers and support non blocking modes for high throughput input and output.' },
                { term: 'Close traversal streams', detail: 'Streams from walk and lines hold system resources, so use them inside a try with resources block.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 26. Reflection ────────────────────────────────────────────────────
  {
    id: 'java-reflection',
    title: 'Reflection',
    level: 1,
    slug: 'reflection',
    concepts: [],
    children: [
      {
        id: 'java-reflection-basics',
        title: 'Inspecting & Invoking at Runtime',
        level: 2,
        slug: 'reflection-basics',
        concepts: [
          {
            id: 'java-reflect-code',
            code: "Class<?> clazz = Class.forName(\"com.example.MyService\");\n\n// Inspect methods\nMethod[] methods = clazz.getDeclaredMethods();\nfor (Method m : methods) {\n  System.out.println(m.getName() + \" -> \" + m.getReturnType());\n}\n\n// Instantiate and invoke\nObject instance = clazz.getDeclaredConstructor().newInstance();\nMethod greet = clazz.getMethod(\"greet\", String.class);\ngreet.setAccessible(true); // bypass private\nString result = (String) greet.invoke(instance, \"World\");",
            note: 'Reflection allows inspecting and manipulating classes, methods, and fields at runtime. It powers frameworks like Spring and Hibernate. Performance cost is real — avoid in hot paths. Module system (JPMS) restricts deep reflection by default.',
            explanation: {
              heading: 'Inspecting code at runtime',
              intro: 'Reflection lets a program examine and use classes, methods, and fields that were unknown at compile time. It is the mechanism many frameworks rely on to wire code dynamically.',
              points: [
                { term: 'Discovering members', detail: 'From a class object you can list its constructors, methods, and fields, then read their names, types, and modifiers at runtime.' },
                { term: 'Dynamic invocation', detail: 'Reflection can create instances and call methods chosen by name, which is how dependency injection and plugin systems operate.' },
                { term: 'Breaking encapsulation', detail: 'Setting a member accessible can bypass private access, so use it sparingly and be aware it can violate class invariants.' },
                { term: 'Performance cost', detail: 'Reflective calls are slower than direct ones, so avoid them on hot paths and cache the resolved members when reused.' },
                { term: 'Module restrictions', detail: 'The module system blocks deep reflection into a package unless it is opened, which keeps strong encapsulation intact.' },
              ],
            },
            example: "// Get all fields including private\nfor (Field f : clazz.getDeclaredFields()) {\n  f.setAccessible(true);\n  System.out.println(f.getName() + \" = \" + f.get(instance));\n}",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 27. Annotations ───────────────────────────────────────────────────
  {
    id: 'java-annotations',
    title: 'Annotations',
    level: 1,
    slug: 'annotations',
    concepts: [],
    children: [
      {
        id: 'java-annotation-basics',
        title: 'Built-in & Custom Annotations',
        level: 2,
        slug: 'annotation-basics',
        concepts: [
          {
            id: 'java-annotation-define',
            code: "// Custom annotation\n@Retention(RetentionPolicy.RUNTIME)\n@Target(ElementType.METHOD)\npublic @interface Cached {\n  int ttlSeconds() default 300;\n  String key() default \"\";\n}\n\n// Usage\npublic class UserService {\n  @Cached(ttlSeconds = 60)\n  public User findById(long id) {\n    return db.query(id);\n  }\n}",
            note: 'Annotations add metadata to code elements. Retention: SOURCE (compile-time only), CLASS (in bytecode), RUNTIME (accessible via reflection). Built-in: @Override, @Deprecated, @SuppressWarnings, @FunctionalInterface. Frameworks read custom annotations to wire behavior (DI, caching, validation).',
            explanation: {
              heading: 'Metadata attached to code',
              intro: 'An annotation attaches structured metadata to a class, method, or field without changing its behavior directly. Tools and frameworks read that metadata to drive processing.',
              points: [
                { term: 'Declaring an annotation', detail: 'You define an annotation type with the at interface syntax and give its elements optional default values.' },
                { term: 'Retention policy', detail: 'Retention controls how long an annotation survives, from source only to bytecode to runtime where reflection can read it.' },
                { term: 'Target restriction', detail: 'The target meta annotation limits where a custom annotation may be applied, such as methods or fields only.' },
                { term: 'Built in annotations', detail: 'Standard annotations such as override and deprecated communicate intent to the compiler and to other developers.' },
                { term: 'Framework driven behavior', detail: 'Frameworks scan for annotations at build time or runtime to wire features like injection, caching, and validation.' },
              ],
            },
            example: "// Processing annotation at runtime\nfor (Method m : clazz.getDeclaredMethods()) {\n  if (m.isAnnotationPresent(Cached.class)) {\n    Cached c = m.getAnnotation(Cached.class);\n    System.out.println(m.getName() + \" cached for \" + c.ttlSeconds() + \"s\");\n  }\n}",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 28. Modules (JPMS) ────────────────────────────────────────────────
  {
    id: 'java-modules',
    title: 'Modules (JPMS)',
    level: 1,
    slug: 'modules',
    concepts: [],
    children: [
      {
        id: 'java-module-system',
        title: 'Module Declarations',
        level: 2,
        slug: 'module-system',
        concepts: [
          {
            id: 'java-module-define',
            code: "// module-info.java\nmodule com.myapp.core {\n  requires java.net.http;\n  requires transitive com.myapp.model;\n\n  exports com.myapp.core.api;\n  exports com.myapp.core.spi to com.myapp.plugins;\n\n  opens com.myapp.core.internal to com.google.gson;\n\n  provides com.myapp.core.spi.Storage\n    with com.myapp.core.internal.FileStorage;\n}",
            note: 'The Java Platform Module System (Java 9+) enforces strong encapsulation at the package level. `exports` makes packages public API. `opens` allows deep reflection (for frameworks). `requires transitive` passes dependencies to consumers. Modules replace the fragile classpath with explicit dependency declarations.',
            explanation: {
              heading: 'Strong encapsulation at scale',
              intro: 'The module system groups related packages into a named module that declares what it needs and what it shares. This replaces the flat classpath with explicit, enforced boundaries.',
              points: [
                { term: 'Declaring a module', detail: 'A module info file names the module and lists its requirements and the packages it exposes, forming a clear contract.' },
                { term: 'Exports control visibility', detail: 'Only packages that are exported are visible to other modules, so internal packages stay hidden even if their classes are public.' },
                { term: 'Requires dependencies', detail: 'The requires directive states which modules this one depends on, and requires transitive passes a dependency on to consumers.' },
                { term: 'Opens for reflection', detail: 'The opens directive grants deep reflective access to a package, which frameworks need while normal code stays encapsulated.' },
                { term: 'Reliable configuration', detail: 'Because dependencies are explicit the runtime can detect missing or conflicting modules early rather than failing deep into execution.' },
              ],
            },
            example: "// Consuming a service\nmodule com.myapp.web {\n  requires com.myapp.core;\n  uses com.myapp.core.spi.Storage;\n}",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 29. JVM, GC & Class Loading ──────────────────────────────────────
  {
    id: 'java-jvm',
    title: 'JVM, GC & Class Loading',
    level: 1,
    slug: 'jvm',
    concepts: [],
    children: [
      {
        id: 'java-memory-model',
        title: 'Memory Model & Garbage Collection',
        level: 2,
        slug: 'memory-gc',
        concepts: [
          {
            id: 'java-jvm-memory',
            code: "// JVM memory areas (conceptual)\n// Heap: objects (Young Gen -> Old Gen)\n// Stack: local variables, method frames\n// Metaspace: class metadata (replaced PermGen in Java 8)\n\n// GC tuning flags (example)\n// -Xms512m -Xmx2g\n// -XX:+UseG1GC\n// -XX:MaxGCPauseMillis=200\n\n// Requesting GC (hint only — JVM may ignore)\nSystem.gc();\n\n// Runtime memory info\nRuntime rt = Runtime.getRuntime();\nlong free = rt.freeMemory();\nlong total = rt.totalMemory();\nlong max = rt.maxMemory();",
            note: 'The JVM divides memory into Heap (objects), Stack (frames), and Metaspace (class metadata). GC automatically reclaims unreachable objects. Modern collectors: G1 (default since Java 9), ZGC and Shenandoah (low-pause). Never rely on `System.gc()` — it is only a hint.',
            explanation: {
              heading: 'Memory and automatic reclamation',
              intro: 'The JVM organizes memory into distinct regions and reclaims unused objects automatically through garbage collection. Understanding the layout helps you reason about performance and leaks.',
              points: [
                { term: 'Heap and stack', detail: 'Objects live on the shared heap while each thread has its own stack holding method frames and local variables.' },
                { term: 'Metaspace', detail: 'Class metadata resides in metaspace, which grows in native memory and replaced the older fixed permanent generation.' },
                { term: 'Garbage collection', detail: 'The collector finds objects no longer reachable from live references and frees their memory without manual deallocation.' },
                { term: 'Modern collectors', detail: 'The G one collector is the default, while ZGC and Shenandoah target very low pause times for large heaps.' },
                { term: 'System gc is a hint', detail: 'Calling for a collection only suggests one to the runtime, so never depend on it to control memory behavior.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'java-classloading',
        title: 'Class Loading Mechanism',
        level: 2,
        slug: 'classloading',
        concepts: [
          {
            id: 'java-classloader',
            code: "// Class loading hierarchy\n// Bootstrap -> Platform -> Application -> Custom\n\n// Get classloader info\nClassLoader cl = MyClass.class.getClassLoader();\nSystem.out.println(cl);          // AppClassLoader\nSystem.out.println(cl.getParent()); // PlatformClassLoader\n\n// Loading a class dynamically\nClass<?> loaded = Class.forName(\"com.example.Plugin\");\n\n// Custom classloader (simplified)\npublic class PluginLoader extends ClassLoader {\n  @Override\n  protected Class<?> findClass(String name) throws ClassNotFoundException {\n    byte[] bytes = loadPluginBytes(name);\n    return defineClass(name, bytes, 0, bytes.length);\n  }\n}",
            note: 'Classes are loaded lazily on first use. The delegation model: child classloaders ask parents first. Custom classloaders enable plugin architectures, hot-reloading, and isolation. A class identity is defined by its fully-qualified name AND its classloader.',
            explanation: {
              heading: 'How classes enter the JVM',
              intro: 'Class loaders read class definitions and make them available to the running JVM, usually on first use. Their delegation structure and identity rules enable isolation and plugin systems.',
              points: [
                { term: 'Lazy loading', detail: 'A class is typically loaded and initialized only when first needed, which spreads startup cost and avoids loading unused code.' },
                { term: 'Delegation model', detail: 'A class loader asks its parent to load a class before trying itself, which prevents core library classes from being replaced.' },
                { term: 'The loader hierarchy', detail: 'Loaders form a chain from the bootstrap loader through the platform and application loaders that handle the classpath.' },
                { term: 'Custom loaders', detail: 'A custom class loader can read bytes from anywhere, enabling plugins, hot reloading, and isolating separately loaded code.' },
                { term: 'Identity includes the loader', detail: 'A classs identity is its full name together with the loader that defined it, so the same bytes loaded twice yield incompatible types.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 30. Enums ─────────────────────────────────────────────────────────
  {
    id: 'java-enums',
    title: 'Enums',
    level: 1,
    slug: 'enums',
    concepts: [],
    children: [
      {
        id: 'java-enum-basics',
        title: 'Enum Types & Methods',
        level: 2,
        slug: 'enum-basics',
        concepts: [
          {
            id: 'java-enum-define',
            code: "public enum Planet {\n  MERCURY(3.303e+23, 2.4397e6),\n  VENUS(4.869e+24, 6.0518e6),\n  EARTH(5.976e+24, 6.37814e6);\n\n  private final double mass;\n  private final double radius;\n\n  Planet(double mass, double radius) {\n    this.mass = mass;\n    this.radius = radius;\n  }\n\n  public double surfaceGravity() {\n    final double G = 6.67300E-11;\n    return G * mass / (radius * radius);\n  }\n\n  public double surfaceWeight(double otherMass) {\n    return otherMass * surfaceGravity();\n  }\n}",
            note: 'Enums are full classes with a fixed set of instances. They can have fields, constructors, and methods. Use them instead of integer constants. Enums are inherently serializable and thread-safe. They can implement interfaces but cannot extend other classes.',
            explanation: {
              heading: 'Type safe fixed constants',
              intro: 'An enum defines a type with a fixed, named set of instances created once at load time. It is far safer than using integer or string constants because the compiler checks every value.',
              points: [
                { term: 'A closed set of instances', detail: 'The constants listed in an enum are its only instances, created once, so a variable of that type can hold nothing else.' },
                { term: 'Rich behavior', detail: 'An enum can declare fields, a constructor, and methods, so each constant can carry data such as a planets mass and radius.' },
                { term: 'Safer than constants', detail: 'Using an enum instead of magic integers gives readable names and prevents invalid values from ever being assigned.' },
                { term: 'Built in safety', detail: 'Enums are inherently serializable, comparable, and safe to use as singletons, and switch statements over them read cleanly.' },
                { term: 'Can implement interfaces', detail: 'An enum may implement interfaces to share behavior, though it cannot extend another class because it already extends the enum base.' },
              ],
            },
            example: "double weight = Planet.EARTH.surfaceWeight(75);\nfor (Planet p : Planet.values()) {\n  System.out.printf(\"%s: %.2f N%n\", p, p.surfaceWeight(75));\n}",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 31. Virtual Threads & Structured Concurrency ──────────────────────
  {
    id: 'java-virtual-threads',
    title: 'Virtual Threads',
    level: 1,
    slug: 'virtual-threads',
    concepts: [],
    children: [
      {
        id: 'java-vthreads-basics',
        title: 'Virtual Threads (Project Loom)',
        level: 2,
        slug: 'vthreads-basics',
        concepts: [
          {
            id: 'java-vthread-code',
            code: "// Virtual threads (Java 21)\ntry (var executor = Executors.newVirtualThreadPerTaskExecutor()) {\n  List<Future<String>> futures = new ArrayList<>();\n  for (int i = 0; i < 10_000; i++) {\n    futures.add(executor.submit(() -> {\n      Thread.sleep(Duration.ofSeconds(1));\n      return Thread.currentThread().toString();\n    }));\n  }\n  // All 10,000 tasks run concurrently on a handful of OS threads\n}\n\n// Direct creation\nThread.startVirtualThread(() -> System.out.println(\"Virtual!\"));",
            note: 'Virtual threads are lightweight (few KB vs ~1MB for platform threads). They are scheduled by the JVM, not the OS. Ideal for I/O-bound workloads — you can have millions concurrently. They mount/unmount from carrier (platform) threads when blocking. Avoid `synchronized` in virtual threads — prefer ReentrantLock.',
            explanation: {
              heading: 'Lightweight threads for scale',
              intro: 'Virtual threads are cheap threads managed by the JVM rather than the operating system, so you can run millions of them. They make simple blocking code scale like complex asynchronous code.',
              points: [
                { term: 'Very low cost', detail: 'A virtual thread uses only a few kilobytes and is scheduled by the runtime, so creating huge numbers of them is affordable.' },
                { term: 'Mount and unmount', detail: 'A virtual thread runs on a platform carrier thread and steps off it when it blocks, freeing the carrier for other work.' },
                { term: 'Best for input output', detail: 'They shine for tasks that spend time waiting on network or disk, where blocking a virtual thread wastes almost nothing.' },
                { term: 'Simple blocking style', detail: 'You write straightforward blocking code and gain the scalability that previously required callbacks or reactive frameworks.' },
                { term: 'Avoid pinning', detail: 'Holding a synchronized block during a blocking call can pin a virtual thread to its carrier, so prefer a reentrant lock there.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 32. Collections: Queue & Deque ────────────────────────────────────
  {
    id: 'java-collections-queue',
    title: 'Collections: Queue & Deque',
    level: 1,
    slug: 'collections-queue',
    concepts: [],
    children: [
      {
        id: 'java-queue-basics',
        title: 'PriorityQueue & ArrayDeque',
        level: 2,
        slug: 'queue-basics',
        concepts: [
          {
            id: 'java-queue-code',
            code: "// PriorityQueue (min-heap by default)\nQueue<Integer> pq = new PriorityQueue<>();\npq.offer(5); pq.offer(1); pq.offer(3);\npq.poll(); // 1 (smallest first)\n\n// Custom comparator (max-heap)\nQueue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());\n\n// ArrayDeque as stack and queue\nDeque<String> stack = new ArrayDeque<>();\nstack.push(\"a\"); stack.push(\"b\");\nstack.pop(); // \"b\"\n\nDeque<String> queue = new ArrayDeque<>();\nqueue.offer(\"first\"); queue.offer(\"second\");\nqueue.poll(); // \"first\"",
            note: 'PriorityQueue orders elements by natural order or a Comparator (not FIFO). ArrayDeque is faster than Stack and LinkedList for both stack (LIFO) and queue (FIFO) usage. BlockingQueue implementations (LinkedBlockingQueue, ArrayBlockingQueue) are used in producer-consumer patterns.',
            explanation: {
              heading: 'Ordered ends and priorities',
              intro: 'Queues and deques model collections you add to and remove from at the ends, and a priority queue orders by importance instead. Picking the right one clarifies intent and improves performance.',
              points: [
                { term: 'Priority queue', detail: 'A priority queue always yields the smallest element by natural order or a comparator, which suits scheduling and shortest path algorithms.' },
                { term: 'Not first in first out', detail: 'Despite the name a priority queue does not preserve insertion order, so do not use it when you need plain queue behavior.' },
                { term: 'ArrayDeque as stack and queue', detail: 'An ArrayDeque efficiently supports adding and removing at both ends, making it the preferred choice over the legacy stack class.' },
                { term: 'Offer and poll', detail: 'The offer and poll methods add and remove without throwing on capacity or emptiness, unlike add and remove which raise exceptions.' },
                { term: 'Blocking queues', detail: 'Blocking queue implementations coordinate producers and consumers by waiting when full or empty, which underlies many thread pools.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 33. Functional Programming Patterns ───────────────────────────────
  {
    id: 'java-functional',
    title: 'Functional Programming Patterns',
    level: 1,
    slug: 'functional',
    concepts: [],
    children: [
      {
        id: 'java-fp-composition',
        title: 'Function Composition & Currying',
        level: 2,
        slug: 'fp-composition',
        concepts: [
          {
            id: 'java-fp-code',
            code: "// Function composition\nFunction<String, String> trim = String::trim;\nFunction<String, String> upper = String::toUpperCase;\nFunction<String, String> prepare = trim.andThen(upper);\nprepare.apply(\"  hello  \"); // \"HELLO\"\n\n// Predicate composition\nPredicate<Integer> isPositive = n -> n > 0;\nPredicate<Integer> isEven = n -> n % 2 == 0;\nPredicate<Integer> isPositiveEven = isPositive.and(isEven);\n\n// Supplier + lazy evaluation\nSupplier<List<String>> lazyData = () -> expensiveLoad();\n// Only calls expensiveLoad() when .get() is invoked",
            note: 'Java supports functional composition through `andThen`, `compose`, `and`, `or`, `negate` on Function/Predicate/Consumer. This enables building complex behavior from simple reusable pieces without inheritance.',
            explanation: {
              heading: 'Building behavior from pieces',
              intro: 'Functional composition combines small functions and predicates into larger ones without writing new classes. This lets you assemble behavior declaratively and reuse the parts freely.',
              points: [
                { term: 'Chaining functions', detail: 'The andThen method runs one function then feeds its result to another, while compose runs them in the reverse order.' },
                { term: 'Combining predicates', detail: 'Predicates join with and, or, and negate to express compound conditions from simple reusable tests.' },
                { term: 'Reuse over inheritance', detail: 'Composing behavior avoids deep class hierarchies, so you build complex logic from small independent pieces.' },
                { term: 'Lazy suppliers', detail: 'A supplier defers work until its get method is called, which lets you delay expensive computation until it is actually needed.' },
                { term: 'Readable pipelines', detail: 'Named function values make each transformation explicit, which improves readability compared with one large method.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'java-collectors-advanced',
        title: 'Advanced Collectors',
        level: 2,
        slug: 'collectors-advanced',
        concepts: [
          {
            id: 'java-collectors-code',
            code: "List<Transaction> transactions = getTransactions();\n\n// Partition by predicate\nMap<Boolean, List<Transaction>> partitioned = transactions.stream()\n  .collect(Collectors.partitioningBy(t -> t.amount() > 1000));\n\n// Multi-level grouping\nMap<String, Map<Integer, List<Transaction>>> grouped = transactions.stream()\n  .collect(Collectors.groupingBy(\n    Transaction::category,\n    Collectors.groupingBy(t -> t.date().getYear())\n  ));\n\n// Custom collector: joining with prefix/suffix\nString csv = transactions.stream()\n  .map(Transaction::id)\n  .collect(Collectors.joining(\", \", \"[\", \"]\"));",
            note: 'Collectors provide powerful aggregation operations. `partitioningBy` splits into two groups. Downstream collectors enable nested grouping, counting, summing, and averaging. Create custom collectors with `Collector.of()` for specialized accumulation.',
            explanation: {
              heading: 'Aggregating stream results',
              intro: 'Collectors are recipes that gather stream elements into a final result such as a list, a map, or a summary. Combining them lets you express rich aggregations in a single pipeline.',
              points: [
                { term: 'Grouping', detail: 'The groupingBy collector partitions elements into a map keyed by a classifier function, which is the workhorse of aggregation.' },
                { term: 'Partitioning', detail: 'The partitioningBy collector splits elements into just two groups based on a predicate, giving a map with true and false keys.' },
                { term: 'Downstream collectors', detail: 'A grouping can nest another collector to count, sum, average, or group again, producing multi level summaries.' },
                { term: 'Joining strings', detail: 'The joining collector concatenates text with an optional separator, prefix, and suffix, which is handy for building lists.' },
                { term: 'Custom collectors', detail: 'When the built in recipes fall short you can define one with the collector factory by supplying supplier, accumulator, and combiner functions.' },
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
