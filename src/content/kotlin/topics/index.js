// Kotlin topic tree.
//
// Each node is a ConceptNode: { id, title, level, slug?, concepts[], children[] }.
// Routable nodes carry a `slug`. Every Concept renders in the fixed order
// code -> note -> example (example optional).

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  // ─── 1. Variables & Constants ──────────────────────────────────────
  {
    id: 'kt-variables',
    title: 'Variables & Constants',
    level: 1,
    slug: 'variables',
    concepts: [],
    children: [
      {
        id: 'kt-val-var',
        title: 'val vs var',
        level: 2,
        slug: 'val-var',
        concepts: [
          {
            id: 'kt-val-var-declare',
            code: "val name = \"Kotlin\"    // immutable (read-only)\nvar count = 0          // mutable\ncount += 1\n\nval pi: Double = 3.14159  // explicit type annotation",
            note: '`val` declares a read-only reference (like `final` in Java). `var` allows reassignment. Prefer `val` by default for safety and clarity.',
            explanation: {
              heading: 'val and var',
              intro: 'Kotlin distinguishes read-only bindings declared with val from mutable ones declared with var, and it favors immutability by default.',
              points: [
                { term: 'val is read-only', detail: 'A val cannot be reassigned after it is initialized.' },
                { term: 'var is mutable', detail: 'A var can be reassigned to a new value later.' },
                { term: 'Prefer val', detail: 'Defaulting to val makes code safer and easier to reason about.' },
                { term: 'Not deep immutability', detail: 'A val reference is fixed but the object it points to may still be mutable.' },
              ],
            },
            example: "val list = mutableListOf(1, 2, 3)\nlist.add(4)  // OK — the list contents change, not the reference\n// list = mutableListOf()  // ERROR — val cannot be reassigned",
          },
        ],
        children: [],
      },
      {
        id: 'kt-type-inference',
        title: 'Type Inference',
        level: 2,
        slug: 'type-inference',
        concepts: [
          {
            id: 'kt-inference-basics',
            code: "val message = \"Hello\"       // inferred as String\nval number = 42             // inferred as Int\nval ratio = 3.14            // inferred as Double\nval items = listOf(1, 2, 3) // inferred as List<Int>",
            note: 'Kotlin infers types from the assigned value. Explicit annotations are needed when there is no initializer or when you want a supertype.',
            explanation: {
              heading: 'Type inference',
              intro: 'Kotlin infers the type of a variable from its initializer, so explicit type annotations are optional in most declarations.',
              points: [
                { term: 'Inferred from value', detail: 'The compiler derives the type from the assigned expression.' },
                { term: 'Optional annotations', detail: 'You can still write a type explicitly for clarity or when needed.' },
                { term: 'Statically typed', detail: 'Types are fixed at compile time despite the concise syntax.' },
                { term: 'Required without initializer', detail: 'A declaration with no initializer must state its type.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 2. Basic Types ─────────────────────────────────────────────────
  {
    id: 'kt-basic-types',
    title: 'Basic Types',
    level: 1,
    slug: 'basic-types',
    concepts: [],
    children: [
      {
        id: 'kt-numbers-booleans',
        title: 'Numbers & Booleans',
        level: 2,
        slug: 'numbers-booleans',
        concepts: [
          {
            id: 'kt-numbers',
            code: "val byte: Byte = 127\nval short: Short = 32_767\nval int: Int = 2_147_483_647\nval long: Long = 9_223_372_036_854_775_807L\nval float: Float = 3.14f\nval double: Double = 3.141592653589793\nval flag: Boolean = true",
            note: 'Kotlin has explicit numeric types with no implicit widening conversions. Use underscores in literals for readability. Every type is an object — no primitives at the language level.',
            explanation: {
              heading: 'Numeric types',
              intro: 'Kotlin provides fixed-size numeric types and treats them as objects, requiring explicit conversion between different types.',
              points: [
                { term: 'Sized types', detail: 'Types like Int, Long, and Double have defined bit widths.' },
                { term: 'No implicit widening', detail: 'You must convert explicitly, for example turning an Int into a Long.' },
                { term: 'Underscores in literals', detail: 'Underscores can group digits in numeric literals for readability.' },
                { term: 'Conversion functions', detail: 'Methods such as toLong and toDouble change a number\'s type.' },
              ],
            },
            example: "val converted: Long = int.toLong()\nval hex = 0xFF\nval binary = 0b1010",
          },
        ],
        children: [],
      },
      {
        id: 'kt-strings-chars',
        title: 'Strings & Characters',
        level: 2,
        slug: 'strings-chars',
        concepts: [
          {
            id: 'kt-strings',
            code: "val greeting = \"Hello, World!\"\nval char: Char = 'K'\nval template = \"Length is ${greeting.length}\"\nval raw = \"\"\"\n    |Line 1\n    |Line 2\n\"\"\".trimMargin()",
            note: 'Strings support `${}` template expressions. Raw strings (triple-quoted) preserve formatting. Use `trimMargin()` or `trimIndent()` to strip leading whitespace.',
            explanation: {
              heading: 'Strings and templates',
              intro: 'Kotlin strings support template expressions for embedding values and triple-quoted raw strings for multi-line text.',
              points: [
                { term: 'String templates', detail: 'A dollar sign inserts a variable or braced expression into a string.' },
                { term: 'Raw strings', detail: 'Triple-quoted strings span multiple lines without escaping.' },
                { term: 'Immutable', detail: 'Strings cannot be changed after creation.' },
                { term: 'trimIndent', detail: 'The trimIndent function cleans up indentation in raw strings.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 3. Null Safety ─────────────────────────────────────────────────
  {
    id: 'kt-null-safety',
    title: 'Null Safety',
    level: 1,
    slug: 'null-safety',
    concepts: [],
    children: [
      {
        id: 'kt-nullable-types',
        title: 'Nullable Types & Operators',
        level: 2,
        slug: 'nullable-types',
        concepts: [
          {
            id: 'kt-nullable-basics',
            code: "var name: String = \"Kotlin\"\n// name = null  // compile error\n\nvar nullable: String? = null\nval len: Int? = nullable?.length      // safe call\nval lenOrZero: Int = nullable?.length ?: 0  // elvis operator",
            note: 'Kotlin distinguishes nullable (`T?`) and non-null (`T`) types at compile time. The safe-call `?.` returns null if the receiver is null. The elvis operator `?:` provides a fallback.',
            explanation: {
              heading: 'Null safety',
              intro: 'Kotlin\'s type system separates nullable from non-null types, so a variable can hold null only when its type explicitly allows it.',
              points: [
                { term: 'Nullable types', detail: 'A trailing question mark marks a type that may hold null.' },
                { term: 'Compiler enforced', detail: 'The compiler prevents calling methods on a possibly-null value unsafely.' },
                { term: 'Safe call operator', detail: 'The question-dot operator returns null instead of throwing on a null receiver.' },
                { term: 'Elvis operator', detail: 'The elvis operator supplies a fallback when a value is null.' },
              ],
            },
            example: "// Not-null assertion (throws if null)\nval forced: Int = nullable!!.length\n\n// Safe cast\nval str: String? = value as? String",
          },
        ],
        children: [],
      },
      {
        id: 'kt-smart-casts',
        title: 'Smart Casts',
        level: 2,
        slug: 'smart-casts',
        concepts: [
          {
            id: 'kt-smart-cast-example',
            code: "fun printLength(obj: Any) {\n    if (obj is String) {\n        // obj is auto-cast to String here\n        println(obj.length)\n    }\n}\n\nfun safeParse(input: String?): Int {\n    if (input == null) return 0\n    // input is smart-cast to non-null String\n    return input.toInt()\n}",
            note: 'After a type check (`is`) or null check, the compiler automatically casts the variable. No explicit cast needed inside the checked branch.',
            explanation: {
              heading: 'Smart casts',
              intro: 'After you check a value\'s type or null status, the compiler automatically treats it as that type within the checked scope.',
              points: [
                { term: 'Automatic casting', detail: 'A successful type check lets you use the value as that type without an explicit cast.' },
                { term: 'Null checks', detail: 'Confirming a value is not null smart-casts it to a non-null type.' },
                { term: 'Requires stability', detail: 'Smart casts apply only when the compiler can guarantee the value has not changed.' },
                { term: 'Cleaner code', detail: 'It removes redundant casts after a type or null check.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 4. Control Flow ────────────────────────────────────────────────
  {
    id: 'kt-control-flow',
    title: 'Control Flow',
    level: 1,
    slug: 'control-flow',
    concepts: [],
    children: [
      {
        id: 'kt-when-expression',
        title: 'when Expression',
        level: 2,
        slug: 'when-expression',
        concepts: [
          {
            id: 'kt-when-basics',
            code: "val result = when (val x = getValue()) {\n    0 -> \"zero\"\n    in 1..10 -> \"small\"\n    is String -> \"it's a string: $x\"\n    else -> \"something else\"\n}",
            note: '`when` is Kotlin\'s replacement for `switch`. It is an expression (returns a value), supports ranges, type checks, and arbitrary conditions. `else` is required when used as an expression.',
            explanation: {
              heading: 'The when expression',
              intro: 'The when expression selects a branch by matching a value against conditions and returns a result, replacing long chains of conditionals.',
              points: [
                { term: 'Returns a value', detail: 'when can be used as an expression whose result is assigned.' },
                { term: 'Flexible conditions', detail: 'Branches can match values, ranges, types, or arbitrary conditions.' },
                { term: 'Exhaustive checks', detail: 'As an expression it must cover all cases, often needing an else.' },
                { term: 'Combine cases', detail: 'Several values can share one branch with commas.' },
              ],
            },
            example: "// when without argument (replaces if-else chains)\nval grade = when {\n    score >= 90 -> \"A\"\n    score >= 80 -> \"B\"\n    score >= 70 -> \"C\"\n    else -> \"F\"\n}",
          },
        ],
        children: [],
      },
      {
        id: 'kt-if-loops',
        title: 'if Expression & Loops',
        level: 2,
        slug: 'if-loops',
        concepts: [
          {
            id: 'kt-if-expression',
            code: "// if is an expression in Kotlin\nval max = if (a > b) a else b\n\n// Ranges and loops\nfor (i in 1..5) println(i)       // 1,2,3,4,5\nfor (i in 5 downTo 1 step 2) println(i) // 5,3,1\n\nrepeat(3) { println(\"Hello\") }",
            note: '`if` is an expression that returns a value — no ternary operator needed. Kotlin ranges (`..`, `until`, `downTo`, `step`) make loops concise.',
            explanation: {
              heading: 'if as an expression',
              intro: 'In Kotlin if is an expression that returns a value, so it can be assigned directly and there is no separate ternary operator.',
              points: [
                { term: 'Returns a value', detail: 'An if-else yields the value of the chosen branch.' },
                { term: 'Direct assignment', detail: 'You can assign the result of an if to a variable.' },
                { term: 'No ternary', detail: 'Because if returns a value, Kotlin omits a ternary operator.' },
                { term: 'Block branches', detail: 'A branch block returns the value of its last expression.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 5. Functions ───────────────────────────────────────────────────
  {
    id: 'kt-functions',
    title: 'Functions',
    level: 1,
    slug: 'functions',
    concepts: [],
    children: [
      {
        id: 'kt-function-basics',
        title: 'Function Declarations',
        level: 2,
        slug: 'function-declarations',
        concepts: [
          {
            id: 'kt-func-decl',
            code: "fun greet(name: String): String {\n    return \"Hello, $name!\"\n}\n\n// Single-expression function\nfun double(x: Int) = x * 2\n\n// Default & named arguments\nfun connect(host: String = \"localhost\", port: Int = 8080) {\n    println(\"Connecting to $host:$port\")\n}\nconnect(port = 9090)",
            note: 'Functions use `fun` keyword. Single-expression functions use `=` without braces or explicit return type. Default arguments and named parameters eliminate overloads.',
            explanation: {
              heading: 'Declaring functions',
              intro: 'Functions are declared with the fun keyword, taking typed parameters and an optional return type, with a concise form for single expressions.',
              points: [
                { term: 'fun keyword', detail: 'The fun keyword introduces a function definition.' },
                { term: 'Typed parameters', detail: 'Each parameter names its type after a colon.' },
                { term: 'Expression body', detail: 'A single-expression function uses an equals sign instead of a block.' },
                { term: 'Default arguments', detail: 'Parameters can have defaults, reducing the need for overloads.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'kt-varargs-infix',
        title: 'Varargs & Infix',
        level: 2,
        slug: 'varargs-infix',
        concepts: [
          {
            id: 'kt-vararg-infix',
            code: "fun sum(vararg numbers: Int): Int = numbers.sum()\nsum(1, 2, 3, 4)  // 10\n\n// Spread operator\nval arr = intArrayOf(1, 2, 3)\nsum(*arr)\n\n// Infix functions\ninfix fun Int.power(exp: Int): Int = this.toDouble().pow(exp).toInt()\nval result = 2 power 10  // 1024",
            note: '`vararg` accepts a variable number of arguments. Spread with `*` to pass arrays. `infix` allows calling single-parameter member/extension functions without dot or parens.',
            explanation: {
              heading: 'vararg and infix',
              intro: 'Kotlin lets a function accept a variable number of arguments and can mark two-argument functions for readable infix call syntax.',
              points: [
                { term: 'vararg parameter', detail: 'A vararg parameter accepts any number of arguments as an array.' },
                { term: 'Spread operator', detail: 'The spread operator passes an existing array into a vararg.' },
                { term: 'infix functions', detail: 'An infix function can be called without a dot or parentheses.' },
                { term: 'Readable DSLs', detail: 'Infix notation helps build fluent, English-like expressions.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 6. Extension Functions ─────────────────────────────────────────
  {
    id: 'kt-extension-functions',
    title: 'Extension Functions',
    level: 1,
    slug: 'extension-functions',
    concepts: [],
    children: [
      {
        id: 'kt-ext-basics',
        title: 'Defining Extensions',
        level: 2,
        slug: 'defining-extensions',
        concepts: [
          {
            id: 'kt-ext-define',
            code: "fun String.addExclamation() = \"$this!\"\n\nprintln(\"Hello\".addExclamation())  // Hello!\n\nfun <T> MutableList<T>.swap(i: Int, j: Int) {\n    val tmp = this[i]\n    this[i] = this[j]\n    this[j] = tmp\n}\nval list = mutableListOf(1, 2, 3)\nlist.swap(0, 2)  // [3, 2, 1]",
            note: 'Extension functions add new methods to existing classes without modifying them. They are resolved statically (not virtual) based on the declared type, not the runtime type.',
            explanation: {
              heading: 'Extension functions',
              intro: 'Extension functions add new methods to existing types without modifying them or using inheritance, keeping call sites natural.',
              points: [
                { term: 'Receiver type', detail: 'The type before the function name is the receiver being extended.' },
                { term: 'No modification', detail: 'You add behavior to a type you may not own.' },
                { term: 'Statically resolved', detail: 'Extensions are dispatched by the declared type, not dynamically.' },
                { term: 'Called like members', detail: 'An extension is invoked with the same dot syntax as a real method.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'kt-ext-properties',
        title: 'Extension Properties',
        level: 2,
        slug: 'extension-properties',
        concepts: [
          {
            id: 'kt-ext-prop',
            code: "val String.lastChar: Char\n    get() = this[length - 1]\n\nval <T> List<T>.secondOrNull: T?\n    get() = if (size >= 2) this[1] else null\n\nprintln(\"Kotlin\".lastChar)  // n",
            note: 'Extension properties add computed accessors to existing types. They cannot have backing fields — only custom getters (and setters for `var`).',
            explanation: {
              heading: 'Extension properties',
              intro: 'Extension properties add computed properties to existing types, providing read access through a custom getter without storing state.',
              points: [
                { term: 'Computed only', detail: 'They cannot hold a backing field, so they derive their value.' },
                { term: 'Custom getter', detail: 'A getter defines how the property value is computed.' },
                { term: 'Property syntax', detail: 'They are accessed like a normal property rather than a function call.' },
                { term: 'No stored state', detail: 'Because there is no backing field, they add no per-instance storage.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 7. Lambdas & Higher-Order Functions ────────────────────────────
  {
    id: 'kt-lambdas',
    title: 'Lambdas & Higher-Order Functions',
    level: 1,
    slug: 'lambdas',
    concepts: [],
    children: [
      {
        id: 'kt-lambda-syntax',
        title: 'Lambda Syntax',
        level: 2,
        slug: 'lambda-syntax',
        concepts: [
          {
            id: 'kt-lambda-basics',
            code: "val square: (Int) -> Int = { x -> x * x }\nval sum = { a: Int, b: Int -> a + b }\n\n// Trailing lambda & implicit `it`\nval names = listOf(\"Alice\", \"Bob\", \"Charlie\")\nnames.filter { it.length > 3 }\n     .map { it.uppercase() }",
            note: 'Lambdas are enclosed in `{}`. If the lambda is the last argument, move it outside parentheses. Single-parameter lambdas use implicit `it`.',
            explanation: {
              heading: 'Lambdas',
              intro: 'A lambda is an anonymous function written in braces that can be passed around as a value, forming the basis of Kotlin\'s functional style.',
              points: [
                { term: 'Brace syntax', detail: 'A lambda body is enclosed in braces after its parameters.' },
                { term: 'Implicit parameter', detail: 'A single-parameter lambda can refer to its argument as it.' },
                { term: 'Trailing lambda', detail: 'A lambda that is the last argument can move outside the parentheses.' },
                { term: 'First-class', detail: 'Lambdas can be stored in variables and returned from functions.' },
              ],
            },
            example: "// Destructuring in lambdas\nval map = mapOf(\"a\" to 1, \"b\" to 2)\nmap.forEach { (key, value) -> println(\"$key=$value\") }",
          },
        ],
        children: [],
      },
      {
        id: 'kt-higher-order',
        title: 'Higher-Order Functions',
        level: 2,
        slug: 'higher-order-functions',
        concepts: [
          {
            id: 'kt-hof-define',
            code: "fun <T> List<T>.customFilter(predicate: (T) -> Boolean): List<T> {\n    val result = mutableListOf<T>()\n    for (item in this) {\n        if (predicate(item)) result.add(item)\n    }\n    return result\n}\n\nval evens = listOf(1, 2, 3, 4).customFilter { it % 2 == 0 }",
            note: 'Higher-order functions accept or return functions. Use `inline` on hot-path higher-order functions to avoid lambda object allocation overhead.',
            explanation: {
              heading: 'Higher-order functions',
              intro: 'Higher-order functions take functions as parameters or return them, enabling flexible, reusable abstractions over behavior.',
              points: [
                { term: 'Function parameters', detail: 'A parameter can have a function type that the caller supplies.' },
                { term: 'Function types', detail: 'A function type describes parameter and return types with an arrow.' },
                { term: 'Return functions', detail: 'A higher-order function can produce a new function as its result.' },
                { term: 'Powers collections', detail: 'Operations like map and filter are higher-order functions.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 8. Classes & Inheritance ───────────────────────────────────────
  {
    id: 'kt-classes',
    title: 'Classes & Inheritance',
    level: 1,
    slug: 'classes',
    concepts: [],
    children: [
      {
        id: 'kt-class-basics',
        title: 'Class Declarations',
        level: 2,
        slug: 'class-declarations',
        concepts: [
          {
            id: 'kt-class-decl',
            code: "class Person(val name: String, var age: Int) {\n    init {\n        require(age >= 0) { \"Age must be non-negative\" }\n    }\n\n    fun greet() = \"Hi, I'm $name ($age)\"\n}\n\nval alice = Person(\"Alice\", 30)\nprintln(alice.greet())",
            note: 'Primary constructor parameters declared with `val`/`var` become properties. `init` blocks run during construction. Classes are `final` by default.',
            explanation: {
              heading: 'Classes',
              intro: 'Kotlin classes declare their primary constructor in the header, and classes are final by default unless marked open for inheritance.',
              points: [
                { term: 'Primary constructor', detail: 'Constructor parameters appear directly in the class header.' },
                { term: 'Concise properties', detail: 'Marking a parameter val or var makes it a property.' },
                { term: 'Final by default', detail: 'Classes cannot be inherited unless declared open.' },
                { term: 'init blocks', detail: 'An init block runs initialization code during construction.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'kt-inheritance',
        title: 'Inheritance & Interfaces',
        level: 2,
        slug: 'inheritance',
        concepts: [
          {
            id: 'kt-inherit-example',
            code: "open class Shape(val name: String) {\n    open fun area(): Double = 0.0\n}\n\nclass Circle(val radius: Double) : Shape(\"Circle\") {\n    override fun area() = Math.PI * radius * radius\n}\n\ninterface Drawable {\n    fun draw()\n    val color: String get() = \"black\"  // default implementation\n}",
            note: 'Classes must be `open` to be extended. Use `override` explicitly. Interfaces can have default method bodies and abstract properties. A class can implement multiple interfaces.',
            explanation: {
              heading: 'Inheritance',
              intro: 'A class inherits from an open parent and overrides its open members using the override keyword, with strict rules that make intent explicit.',
              points: [
                { term: 'open to extend', detail: 'A class or member must be open before it can be inherited or overridden.' },
                { term: 'override keyword', detail: 'Overriding a member requires the explicit override keyword.' },
                { term: 'super calls parent', detail: 'The super keyword invokes the parent implementation.' },
                { term: 'Single inheritance', detail: 'A class has one superclass but can implement many interfaces.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 9. Data Classes ────────────────────────────────────────────────
  {
    id: 'kt-data-classes',
    title: 'Data Classes',
    level: 1,
    slug: 'data-classes',
    concepts: [],
    children: [
      {
        id: 'kt-data-class-features',
        title: 'Auto-Generated Methods',
        level: 2,
        slug: 'data-class-features',
        concepts: [
          {
            id: 'kt-data-class-basics',
            code: "data class User(val name: String, val email: String, val age: Int)\n\nval u1 = User(\"Alice\", \"alice@dev.io\", 30)\nval u2 = u1.copy(age = 31)\n\nprintln(u1)           // User(name=Alice, email=alice@dev.io, age=30)\nprintln(u1 == u2)     // false (structural equality)\n\n// Destructuring\nval (name, email, age) = u1",
            note: 'Data classes auto-generate `equals()`, `hashCode()`, `toString()`, `copy()`, and `componentN()` functions from primary constructor properties. Ideal for DTOs and value objects.',
            explanation: {
              heading: 'Data classes',
              intro: 'A data class automatically generates equality, hash code, a readable string, and copy support based on its constructor properties.',
              points: [
                { term: 'Generated members', detail: 'The compiler produces equals, hashCode, and toString from the properties.' },
                { term: 'copy function', detail: 'The generated copy makes a new instance with selected changes.' },
                { term: 'Destructuring', detail: 'Component functions allow destructuring into separate variables.' },
                { term: 'For holding data', detail: 'Data classes are ideal for simple value-carrying objects.' },
              ],
            },
            example: "// Pair and Triple are built-in data classes\nval pair = \"key\" to \"value\"  // Pair<String, String>\nval (k, v) = pair",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 10. Sealed Classes & Enums ─────────────────────────────────────
  {
    id: 'kt-sealed-classes',
    title: 'Sealed Classes & Enums',
    level: 1,
    slug: 'sealed-classes',
    concepts: [],
    children: [
      {
        id: 'kt-sealed-hierarchy',
        title: 'Sealed Class Hierarchies',
        level: 2,
        slug: 'sealed-hierarchy',
        concepts: [
          {
            id: 'kt-sealed-example',
            code: "sealed class Result<out T> {\n    data class Success<T>(val data: T) : Result<T>()\n    data class Error(val message: String) : Result<Nothing>()\n    object Loading : Result<Nothing>()\n}\n\nfun handle(result: Result<String>) = when (result) {\n    is Result.Success -> println(result.data)\n    is Result.Error -> println(\"Error: ${result.message}\")\n    Result.Loading -> println(\"Loading...\")\n    // no else needed — compiler knows all subtypes\n}",
            note: 'Sealed classes restrict inheritance to a known set of subclasses. Combined with `when`, the compiler enforces exhaustive handling — no `else` branch needed.',
            explanation: {
              heading: 'Sealed classes',
              intro: 'A sealed class restricts its subclasses to a known set, letting when expressions exhaustively cover every case without an else.',
              points: [
                { term: 'Restricted subtypes', detail: 'All subclasses are known to the compiler at compile time.' },
                { term: 'Exhaustive when', detail: 'A when over a sealed type needs no else once all cases are handled.' },
                { term: 'Model states', detail: 'They express a closed set of related types such as result states.' },
                { term: 'Safer than enums', detail: 'Unlike enums, each subclass can carry its own distinct data.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'kt-enums',
        title: 'Enum Classes',
        level: 2,
        slug: 'enums',
        concepts: [
          {
            id: 'kt-enum-example',
            code: "enum class Direction(val degrees: Int) {\n    NORTH(0), EAST(90), SOUTH(180), WEST(270);\n\n    fun opposite(): Direction = when (this) {\n        NORTH -> SOUTH\n        SOUTH -> NORTH\n        EAST -> WEST\n        WEST -> EAST\n    }\n}\n\nval dir = Direction.EAST\nprintln(dir.degrees)    // 90\nprintln(dir.opposite()) // WEST",
            note: 'Enum classes define a fixed set of constants that can hold properties and methods. Use `entries` (Kotlin 1.9+) or `values()` to iterate all members.',
            explanation: {
              heading: 'Enum classes',
              intro: 'An enum class defines a fixed set of named constants that can also carry properties and methods for richer behavior.',
              points: [
                { term: 'Named constants', detail: 'An enum lists a fixed set of instances.' },
                { term: 'Properties and methods', detail: 'Enum entries can hold values and define behavior.' },
                { term: 'values and valueOf', detail: 'Built-in functions list all entries or find one by name.' },
                { term: 'Use in when', detail: 'A when over an enum can cover every constant exhaustively.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 11. Objects & Companions ───────────────────────────────────────
  {
    id: 'kt-objects',
    title: 'Objects & Companions',
    level: 1,
    slug: 'objects',
    concepts: [],
    children: [
      {
        id: 'kt-object-declarations',
        title: 'Object Declarations (Singletons)',
        level: 2,
        slug: 'object-declarations',
        concepts: [
          {
            id: 'kt-singleton',
            code: "object DatabaseConfig {\n    val url = \"jdbc:postgresql://localhost/db\"\n    val maxConnections = 10\n\n    fun connect() = println(\"Connected to $url\")\n}\n\nDatabaseConfig.connect()",
            note: '`object` declarations create thread-safe singletons. They are lazily initialized on first access. Use for configuration holders, registries, and stateless utilities.',
            explanation: {
              heading: 'Object declarations',
              intro: 'An object declaration defines a singleton, a class with exactly one instance created lazily on first access.',
              points: [
                { term: 'object keyword', detail: 'The object keyword declares a single-instance type.' },
                { term: 'Lazy creation', detail: 'The instance is created the first time it is used.' },
                { term: 'No constructor', detail: 'An object declaration cannot take constructor parameters.' },
                { term: 'Thread-safe init', detail: 'The single instance is initialized safely across threads.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'kt-companion-objects',
        title: 'Companion Objects',
        level: 2,
        slug: 'companion-objects',
        concepts: [
          {
            id: 'kt-companion-example',
            code: "class User private constructor(val name: String, val role: String) {\n    companion object Factory {\n        fun admin(name: String) = User(name, \"ADMIN\")\n        fun guest() = User(\"Guest\", \"GUEST\")\n\n        const val MAX_NAME_LENGTH = 50\n    }\n}\n\nval admin = User.admin(\"Alice\")\nprintln(User.MAX_NAME_LENGTH)",
            note: 'Companion objects provide class-level members (like Java\'s `static`). They can implement interfaces and be used as factory patterns. `const val` defines compile-time constants.',
            explanation: {
              heading: 'Companion objects',
              intro: 'A companion object holds members tied to a class rather than its instances, serving the role of static members and factory methods.',
              points: [
                { term: 'Class-level members', detail: 'Its members are accessed through the class name.' },
                { term: 'Factory functions', detail: 'It commonly hosts factory methods that build instances.' },
                { term: 'One per class', detail: 'A class can have a single companion object.' },
                { term: 'Can implement interfaces', detail: 'A companion object may implement interfaces or be named.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 12. Collections ────────────────────────────────────────────────
  {
    id: 'kt-collections',
    title: 'Collections',
    level: 1,
    slug: 'collections',
    concepts: [],
    children: [
      {
        id: 'kt-list-set-map',
        title: 'List, Set & Map',
        level: 2,
        slug: 'list-set-map',
        concepts: [
          {
            id: 'kt-collections-create',
            code: "val immutableList = listOf(1, 2, 3)\nval mutableList = mutableListOf(\"a\", \"b\")\nmutableList.add(\"c\")\n\nval set = setOf(1, 2, 2, 3)       // {1, 2, 3}\nval map = mapOf(\"a\" to 1, \"b\" to 2)\nprintln(map[\"a\"])                  // 1",
            note: 'Kotlin separates read-only (`List`, `Set`, `Map`) and mutable (`MutableList`, etc.) collection interfaces. Prefer read-only by default for safety.',
            explanation: {
              heading: 'Creating collections',
              intro: 'Kotlin distinguishes read-only collection interfaces from mutable ones, with factory functions to create each kind.',
              points: [
                { term: 'Read-only by default', detail: 'Functions like listOf create collections without mutation methods.' },
                { term: 'Mutable variants', detail: 'The mutable factory functions produce collections you can modify.' },
                { term: 'Interface based', detail: 'Read-only and mutable are interfaces, not separate storage.' },
                { term: 'Prefer read-only', detail: 'Using read-only collections communicates intent and prevents accidental changes.' },
              ],
            },
            example: "// buildList builder (Kotlin 1.6+)\nval squares = buildList {\n    for (i in 1..5) add(i * i)\n} // [1, 4, 9, 16, 25]",
          },
        ],
        children: [],
      },
      {
        id: 'kt-functional-ops',
        title: 'Functional Operations',
        level: 2,
        slug: 'functional-operations',
        concepts: [
          {
            id: 'kt-collection-transforms',
            code: "val numbers = listOf(1, 2, 3, 4, 5, 6)\n\nval evens = numbers.filter { it % 2 == 0 }          // [2, 4, 6]\nval doubled = numbers.map { it * 2 }                // [2,4,6,8,10,12]\nval sum = numbers.reduce { acc, n -> acc + n }       // 21\nval grouped = numbers.groupBy { if (it % 2 == 0) \"even\" else \"odd\" }",
            note: 'Kotlin collections provide a rich functional API: `filter`, `map`, `flatMap`, `reduce`, `fold`, `groupBy`, `partition`, `zip`, `associate`, and more — all returning new collections.',
            explanation: {
              heading: 'Collection operations',
              intro: 'Kotlin\'s standard library offers a rich set of functional operations for transforming, filtering, and aggregating collections.',
              points: [
                { term: 'map and filter', detail: 'These transform elements or keep those matching a predicate.' },
                { term: 'Aggregation', detail: 'Functions like sum, count, and reduce combine elements into one result.' },
                { term: 'Grouping', detail: 'groupBy and associate organize elements into maps.' },
                { term: 'Eager by default', detail: 'These operations produce new collections immediately.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 13. Sequences ──────────────────────────────────────────────────
  {
    id: 'kt-sequences',
    title: 'Sequences (Lazy Collections)',
    level: 1,
    slug: 'sequences',
    concepts: [],
    children: [
      {
        id: 'kt-sequence-basics',
        title: 'Lazy Evaluation with Sequences',
        level: 2,
        slug: 'sequence-basics',
        concepts: [
          {
            id: 'kt-sequence-example',
            code: "val result = (1..1_000_000)\n    .asSequence()\n    .filter { it % 2 == 0 }\n    .map { it * it }\n    .take(5)\n    .toList()  // [4, 16, 36, 64, 100]",
            note: 'Sequences process elements lazily one-by-one (like Java Streams). Use sequences for large datasets or chained operations to avoid creating intermediate collections.',
            explanation: {
              heading: 'Sequences',
              intro: 'Sequences process elements lazily, applying operations one element at a time, which can be more efficient for large or chained pipelines.',
              points: [
                { term: 'Lazy evaluation', detail: 'Operations run element by element only as results are needed.' },
                { term: 'Avoids intermediates', detail: 'A sequence does not build a new collection between each step.' },
                { term: 'Terminal operations', detail: 'A terminal operation like toList triggers the actual processing.' },
                { term: 'Good for large data', detail: 'They shine when chaining many operations over big collections.' },
              ],
            },
            example: "// Generate infinite sequences\nval fib = generateSequence(Pair(0, 1)) { Pair(it.second, it.first + it.second) }\n    .map { it.first }\n    .take(10)\n    .toList()  // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 14. Scope Functions ────────────────────────────────────────────
  {
    id: 'kt-scope-functions',
    title: 'Scope Functions',
    level: 1,
    slug: 'scope-functions',
    concepts: [],
    children: [
      {
        id: 'kt-let-run',
        title: 'let & run',
        level: 2,
        slug: 'let-run',
        concepts: [
          {
            id: 'kt-let-run-example',
            code: "// let — transforms and null-safe calls\nval length = \"Hello\".let { it.length }  // 5\n\nval name: String? = getNameOrNull()\nname?.let { println(\"Name is $it\") }  // only runs if non-null\n\n// run — execute a block with `this` as receiver\nval result = StringBuilder().run {\n    append(\"Hello\")\n    append(\", \")\n    append(\"World\")\n    toString()\n}  // \"Hello, World\"",
            note: '`let` passes the object as `it` and returns the lambda result. `run` uses `this` as receiver. Both are useful for scoping and transformations.',
            explanation: {
              heading: 'let and run',
              intro: 'The let and run scope functions execute a block on an object, differing in how they refer to the object and what they return.',
              points: [
                { term: 'let uses it', detail: 'The let function passes the object as the it parameter and returns the block result.' },
                { term: 'run uses this', detail: 'The run function makes the object the receiver and returns the block result.' },
                { term: 'Null-safe chaining', detail: 'let combined with the safe call runs a block only when a value is non-null.' },
                { term: 'Scoped operations', detail: 'They group operations on an object into a compact block.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'kt-apply-also-with',
        title: 'apply, also & with',
        level: 2,
        slug: 'apply-also-with',
        concepts: [
          {
            id: 'kt-apply-also-with-example',
            code: "// apply — configure object, returns the object\nval person = Person().apply {\n    name = \"Alice\"\n    age = 30\n    city = \"Berlin\"\n}\n\n// also — side effects, returns the object\nval numbers = mutableListOf(1, 2, 3).also {\n    println(\"Original list: $it\")\n}\n\n// with — non-extension, uses `this`\nval info = with(person) {\n    \"$name, $age, $city\"\n}",
            note: '`apply` configures objects (returns `this`). `also` performs side effects (returns `this`). `with` is a non-extension variant of `run`. Choose based on whether you need `this` vs `it` and the return value.',
            explanation: {
              heading: 'apply, also, with',
              intro: 'These scope functions configure or inspect an object, differing in receiver and return value to suit different intents.',
              points: [
                { term: 'apply returns the object', detail: 'The apply function configures an object and returns it, ideal for setup.' },
                { term: 'also returns the object', detail: 'The also function performs a side effect using it and returns the object.' },
                { term: 'with as receiver', detail: 'The with function operates on an object passed as an argument.' },
                { term: 'Choose by intent', detail: 'Pick the function based on the receiver style and desired return value.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 15. Coroutines: Basics ─────────────────────────────────────────
  {
    id: 'kt-coroutines-basics',
    title: 'Coroutines: Basics',
    level: 1,
    slug: 'coroutines-basics',
    concepts: [],
    children: [
      {
        id: 'kt-suspend-functions',
        title: 'Suspend Functions',
        level: 2,
        slug: 'suspend-functions',
        concepts: [
          {
            id: 'kt-suspend-example',
            code: "suspend fun fetchUser(id: Int): User {\n    delay(1000)  // non-blocking wait\n    return User(id, \"Alice\")\n}\n\nfun main() = runBlocking {\n    val user = fetchUser(1)\n    println(user)\n}",
            note: '`suspend` functions can pause execution without blocking the thread. They can only be called from other suspend functions or coroutine builders. `runBlocking` bridges blocking and suspend worlds.',
            explanation: {
              heading: 'Suspend functions',
              intro: 'A suspend function can pause and resume without blocking a thread, forming the foundation of Kotlin coroutines for asynchronous code.',
              points: [
                { term: 'suspend keyword', detail: 'The suspend modifier marks a function that can be paused and resumed.' },
                { term: 'Non-blocking', detail: 'Suspension frees the thread instead of blocking it while waiting.' },
                { term: 'Called from coroutines', detail: 'A suspend function must be called from a coroutine or another suspend function.' },
                { term: 'Sequential style', detail: 'Asynchronous code reads like straightforward sequential code.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'kt-launch-async',
        title: 'launch & async',
        level: 2,
        slug: 'launch-async',
        concepts: [
          {
            id: 'kt-launch-async-example',
            code: "fun main() = runBlocking {\n    // launch — fire and forget (returns Job)\n    val job = launch {\n        delay(1000)\n        println(\"World\")\n    }\n    println(\"Hello\")\n    job.join()\n\n    // async — returns a Deferred with a result\n    val deferred = async { fetchUser(1) }\n    val user = deferred.await()\n}",
            note: '`launch` starts a coroutine that does not return a result (returns `Job`). `async` starts a coroutine that returns a `Deferred<T>` — call `.await()` to get the result.',
            explanation: {
              heading: 'launch and async',
              intro: 'Coroutine builders start concurrent work; launch fires off a job with no result while async returns a deferred value you can await.',
              points: [
                { term: 'launch for jobs', detail: 'It starts a coroutine that does work without returning a value.' },
                { term: 'async for results', detail: 'It starts a coroutine and returns a deferred that yields a value.' },
                { term: 'await the result', detail: 'Calling await on a deferred suspends until its value is ready.' },
                { term: 'Structured concurrency', detail: 'Builders launch within a scope that tracks and cancels their children.' },
              ],
            },
            example: "// Structured concurrency — parallel decomposition\ncoroutineScope {\n    val users = async { fetchUsers() }\n    val posts = async { fetchPosts() }\n    combine(users.await(), posts.await())\n}",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 16. Coroutines: Flows ──────────────────────────────────────────
  {
    id: 'kt-flows',
    title: 'Coroutines: Flows',
    level: 1,
    slug: 'flows',
    concepts: [],
    children: [
      {
        id: 'kt-flow-basics',
        title: 'Flow Basics',
        level: 2,
        slug: 'flow-basics',
        concepts: [
          {
            id: 'kt-flow-example',
            code: "fun numberFlow(): Flow<Int> = flow {\n    for (i in 1..5) {\n        delay(100)\n        emit(i)\n    }\n}\n\nfun main() = runBlocking {\n    numberFlow()\n        .filter { it % 2 != 0 }\n        .map { it * it }\n        .collect { println(it) }  // 1, 9, 25\n}",
            note: 'Flows are cold asynchronous streams. Values are emitted lazily when collected. They support all collection operators (`map`, `filter`, `take`, etc.) and are cancellation-safe.',
            explanation: {
              heading: 'Flows',
              intro: 'A Flow is a cold asynchronous stream that emits multiple values over time, integrating with coroutines and suspend functions.',
              points: [
                { term: 'Asynchronous stream', detail: 'A flow produces a sequence of values over time.' },
                { term: 'Cold', detail: 'A flow starts emitting only when it is collected.' },
                { term: 'collect consumes', detail: 'The collect function receives each emitted value.' },
                { term: 'Coroutine friendly', detail: 'Flows are built on suspend functions and respect cancellation.' },
              ],
            },
            example: "// StateFlow — hot state holder\nval _state = MutableStateFlow(0)\nval state: StateFlow<Int> = _state.asStateFlow()\n_state.value = 42",
          },
        ],
        children: [],
      },
      {
        id: 'kt-flow-operators',
        title: 'Flow Operators',
        level: 2,
        slug: 'flow-operators',
        concepts: [
          {
            id: 'kt-flow-ops',
            code: "val combined = flow1.combine(flow2) { a, b -> a + b }\n\nval zipped = flow1.zip(flow2) { a, b -> \"$a-$b\" }\n\n// flatMapConcat processes inner flows sequentially\nval nested = ids.asFlow()\n    .flatMapConcat { id -> fetchDetails(id) }\n    .collect { println(it) }",
            note: '`combine` emits whenever either flow emits. `zip` pairs elements 1:1. `flatMapConcat`, `flatMapMerge`, and `flatMapLatest` control concurrency of inner flows.',
            explanation: {
              heading: 'Flow operators',
              intro: 'Flows support operators similar to collections for transforming and combining emitted values within a coroutine context.',
              points: [
                { term: 'Transform operators', detail: 'Operators like map and filter reshape the stream of values.' },
                { term: 'Applied lazily', detail: 'Operators run as values are emitted during collection.' },
                { term: 'Context preservation', detail: 'Flows keep emission and collection contexts separate for safety.' },
                { term: 'Combining flows', detail: 'Operators can merge or zip multiple flows together.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 17. Coroutines: Channels ───────────────────────────────────────
  {
    id: 'kt-channels',
    title: 'Coroutines: Channels',
    level: 1,
    slug: 'channels',
    concepts: [],
    children: [
      {
        id: 'kt-channel-basics',
        title: 'Channel Communication',
        level: 2,
        slug: 'channel-basics',
        concepts: [
          {
            id: 'kt-channel-example',
            code: "fun main() = runBlocking {\n    val channel = Channel<Int>()\n\n    launch {\n        for (i in 1..5) {\n            channel.send(i)\n            delay(100)\n        }\n        channel.close()\n    }\n\n    for (value in channel) {\n        println(value)  // 1, 2, 3, 4, 5\n    }\n}",
            note: 'Channels enable safe communication between coroutines (like Go channels). `send` suspends when the buffer is full; `receive` suspends when empty. Always `close()` when done.',
            explanation: {
              heading: 'Channels',
              intro: 'A channel is a coroutine communication primitive that lets one coroutine send values that another receives, like a concurrent queue.',
              points: [
                { term: 'Hot communication', detail: 'A channel transfers values between coroutines as they are sent.' },
                { term: 'send and receive', detail: 'One side sends values while another receives them.' },
                { term: 'Suspends when needed', detail: 'Sending or receiving suspends rather than blocking a thread.' },
                { term: 'Backpressure', detail: 'Buffer settings control how sending handles a slow receiver.' },
              ],
            },
            example: "// Buffered channel\nval buffered = Channel<Int>(capacity = 10)\n\n// Produce helper\nval numbers = produce {\n    for (i in 1..10) send(i)\n}",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 18. Delegation ─────────────────────────────────────────────────
  {
    id: 'kt-delegation',
    title: 'Delegation',
    level: 1,
    slug: 'delegation',
    concepts: [],
    children: [
      {
        id: 'kt-class-delegation',
        title: 'Class Delegation (by)',
        level: 2,
        slug: 'class-delegation',
        concepts: [
          {
            id: 'kt-delegation-by',
            code: "interface Logger {\n    fun log(message: String)\n}\n\nclass ConsoleLogger : Logger {\n    override fun log(message: String) = println(\"[LOG] $message\")\n}\n\nclass UserService(logger: Logger) : Logger by logger {\n    fun createUser(name: String) {\n        log(\"Creating user: $name\")  // delegated to logger\n    }\n}",
            note: '`by` delegates interface implementation to another object — favoring composition over inheritance. The delegatee handles all interface calls unless explicitly overridden.',
            explanation: {
              heading: 'Class delegation',
              intro: 'The by keyword implements an interface by delegating its methods to another object, favoring composition over inheritance.',
              points: [
                { term: 'Delegate methods', detail: 'An interface\'s calls are forwarded to a supplied delegate object.' },
                { term: 'Composition', detail: 'It reuses behavior without extending a class.' },
                { term: 'Override selectively', detail: 'You can still override specific delegated methods.' },
                { term: 'Less boilerplate', detail: 'The compiler generates the forwarding methods for you.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'kt-delegated-properties',
        title: 'Delegated Properties',
        level: 2,
        slug: 'delegated-properties',
        concepts: [
          {
            id: 'kt-delegated-props',
            code: "val lazyValue: String by lazy {\n    println(\"Computed once\")\n    \"Hello\"\n}\n\nvar observed: String by Delegates.observable(\"initial\") { _, old, new ->\n    println(\"$old -> $new\")\n}\n\n// Map-backed properties\nclass Config(map: Map<String, Any?>) {\n    val host: String by map\n    val port: Int by map\n}",
            note: '`by lazy` initializes on first access. `Delegates.observable` reacts to changes. `by map` reads properties from a map. You can write custom delegates with `getValue`/`setValue` operators.',
            explanation: {
              heading: 'Delegated properties',
              intro: 'A property can delegate its get and set logic to a helper object, enabling reusable patterns like lazy initialization and observation.',
              points: [
                { term: 'by a delegate', detail: 'The by keyword routes property access through a delegate.' },
                { term: 'lazy initialization', detail: 'The lazy delegate computes a value once on first access.' },
                { term: 'observable', detail: 'An observable delegate runs a callback whenever the value changes.' },
                { term: 'Map-backed', detail: 'A property can read its value from a map delegate.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 19. Generics ───────────────────────────────────────────────────
  {
    id: 'kt-generics',
    title: 'Generics',
    level: 1,
    slug: 'generics',
    concepts: [],
    children: [
      {
        id: 'kt-generic-classes',
        title: 'Generic Classes & Functions',
        level: 2,
        slug: 'generic-classes',
        concepts: [
          {
            id: 'kt-generics-basics',
            code: "class Stack<T> {\n    private val items = mutableListOf<T>()\n    fun push(item: T) = items.add(item)\n    fun pop(): T = items.removeAt(items.lastIndex)\n    fun peek(): T = items.last()\n}\n\nfun <T : Comparable<T>> maxOf(a: T, b: T): T = if (a > b) a else b",
            note: 'Generics provide type safety for containers and algorithms. Constrain type parameters with upper bounds (`: Comparable<T>`). Multiple bounds use `where` clause.',
            explanation: {
              heading: 'Generics',
              intro: 'Generics let classes and functions work with any type through type parameters, giving type-safe reuse without duplication.',
              points: [
                { term: 'Type parameters', detail: 'Angle brackets introduce a placeholder type.' },
                { term: 'Type safety', detail: 'The compiler checks the type argument at each use.' },
                { term: 'Constraints', detail: 'An upper bound restricts which types the parameter accepts.' },
                { term: 'Reusable code', detail: 'One generic definition serves many concrete types.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'kt-variance',
        title: 'Variance (in/out)',
        level: 2,
        slug: 'variance',
        concepts: [
          {
            id: 'kt-variance-example',
            code: "// out = covariant (producer), like Java's ? extends\ninterface Source<out T> {\n    fun next(): T\n}\n\n// in = contravariant (consumer), like Java's ? super\ninterface Sink<in T> {\n    fun put(item: T)\n}\n\nfun copy(source: Source<Int>, sink: Sink<Number>) {\n    sink.put(source.next()) // Int is a Number\n}",
            note: '`out` means the type parameter is only produced (covariant). `in` means only consumed (contravariant). Declaration-site variance eliminates wildcard noise at use sites.',
            explanation: {
              heading: 'Variance',
              intro: 'Variance modifiers control the subtyping relationship between generic types, using out for producers and in for consumers.',
              points: [
                { term: 'out for producers', detail: 'The out modifier marks a type parameter that is only produced.' },
                { term: 'in for consumers', detail: 'The in modifier marks a type parameter that is only consumed.' },
                { term: 'Declaration-site', detail: 'Kotlin can declare variance where the type is defined.' },
                { term: 'Star projection', detail: 'A star stands in when the type argument is unknown.' },
              ],
            },
            example: "// Star projection — when you don't care about the type\nfun printAll(items: List<*>) {\n    items.forEach { println(it) }\n}",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 20. Inline & Reified ───────────────────────────────────────────
  {
    id: 'kt-inline-reified',
    title: 'Inline & Reified',
    level: 1,
    slug: 'inline-reified',
    concepts: [],
    children: [
      {
        id: 'kt-inline-functions',
        title: 'Inline Functions',
        level: 2,
        slug: 'inline-functions',
        concepts: [
          {
            id: 'kt-inline-example',
            code: "inline fun <T> measureTime(block: () -> T): T {\n    val start = System.nanoTime()\n    val result = block()\n    println(\"Took ${(System.nanoTime() - start) / 1_000_000}ms\")\n    return result\n}\n\nval data = measureTime { loadFromDisk() }",
            note: '`inline` copies the function body at call sites, eliminating lambda allocation overhead. Use for small, hot-path higher-order functions. Avoid for large function bodies.',
            explanation: {
              heading: 'Inline functions',
              intro: 'An inline function has its body copied into call sites, which removes the overhead of lambda objects passed as arguments.',
              points: [
                { term: 'inline keyword', detail: 'The inline modifier inlines the function and its lambdas at each call.' },
                { term: 'Avoids allocations', detail: 'Inlined lambdas avoid creating function objects at runtime.' },
                { term: 'Non-local returns', detail: 'A lambda passed to an inline function can return from the enclosing function.' },
                { term: 'Use judiciously', detail: 'Inlining large functions can increase code size.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'kt-reified-types',
        title: 'Reified Type Parameters',
        level: 2,
        slug: 'reified-types',
        concepts: [
          {
            id: 'kt-reified-example',
            code: "inline fun <reified T> parseJson(json: String): T {\n    return Gson().fromJson(json, T::class.java)\n}\n\nval user: User = parseJson(\"\"\"{ \"name\": \"Alice\" }\"\"\")\n\n// Type checking with reified\ninline fun <reified T> isType(value: Any): Boolean = value is T",
            note: '`reified` preserves generic type information at runtime (normally erased). Only works in `inline` functions. Enables `is T` checks and `T::class` access.',
            explanation: {
              heading: 'Reified type parameters',
              intro: 'A reified type parameter on an inline function keeps the type available at runtime, allowing type checks and access that generics normally erase.',
              points: [
                { term: 'reified keyword', detail: 'The reified modifier preserves the type argument at runtime.' },
                { term: 'Requires inline', detail: 'Reified parameters work only on inline functions.' },
                { term: 'Runtime type checks', detail: 'You can perform is checks and access the class of the type.' },
                { term: 'Avoids passing classes', detail: 'It removes the need to pass a class object as an argument.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 21. DSLs (Domain-Specific Languages) ──────────────────────────
  {
    id: 'kt-dsls',
    title: 'DSLs (Domain-Specific Languages)',
    level: 1,
    slug: 'dsls',
    concepts: [],
    children: [
      {
        id: 'kt-dsl-building',
        title: 'Building Type-Safe DSLs',
        level: 2,
        slug: 'dsl-building',
        concepts: [
          {
            id: 'kt-dsl-example',
            code: "class Html {\n    private val children = mutableListOf<String>()\n    fun body(init: Body.() -> Unit) {\n        val body = Body().apply(init)\n        children.add(body.render())\n    }\n    fun render() = \"<html>${children.joinToString(\"\")}</html>\"\n}\n\nclass Body {\n    private val elements = mutableListOf<String>()\n    fun p(text: String) { elements.add(\"<p>$text</p>\") }\n    fun h1(text: String) { elements.add(\"<h1>$text</h1>\") }\n    fun render() = \"<body>${elements.joinToString(\"\")}</body>\"\n}\n\nfun html(init: Html.() -> Unit) = Html().apply(init).render()\n\nval page = html {\n    body {\n        h1(\"Welcome\")\n        p(\"This is Kotlin DSL\")\n    }\n}",
            note: 'Kotlin DSLs leverage lambdas with receivers, extension functions, and operator overloading. The receiver (`this`) inside the lambda provides scoped access to builder methods.',
            explanation: {
              heading: 'Type-safe builders',
              intro: 'Kotlin\'s lambdas with receivers enable domain-specific languages where nested builder blocks read like declarative configuration.',
              points: [
                { term: 'Lambda with receiver', detail: 'A receiver lambda lets the block call the builder\'s methods directly.' },
                { term: 'Nested structure', detail: 'Nested blocks mirror the structure of the data being built.' },
                { term: 'Declarative style', detail: 'The result reads like configuration rather than imperative code.' },
                { term: 'Type-safe', detail: 'The compiler checks the builder calls, unlike free-form text.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'kt-dsl-annotations',
        title: '@DslMarker',
        level: 2,
        slug: 'dsl-marker',
        concepts: [
          {
            id: 'kt-dslmarker',
            code: "@DslMarker\nannotation class HtmlDsl\n\n@HtmlDsl\nclass Table {\n    fun tr(init: Row.() -> Unit) { /* ... */ }\n}\n\n@HtmlDsl\nclass Row {\n    fun td(text: String) { /* ... */ }\n}\n\n// @DslMarker prevents accessing outer receiver implicitly\n// table { tr { td(\"cell\") } }  // OK\n// table { tr { tr { } } }      // ERROR — can't access Table from Row",
            note: '`@DslMarker` restricts implicit receiver access in nested lambdas, preventing accidental calls to outer scopes. This makes DSLs safer and less error-prone.',
            explanation: {
              heading: 'DslMarker',
              intro: 'The DslMarker annotation restricts implicit receivers in nested DSL blocks, preventing accidental calls to an outer builder\'s methods.',
              points: [
                { term: 'Scope control', detail: 'It limits which receiver\'s members are accessible in a nested block.' },
                { term: 'Prevents confusion', detail: 'It stops calls from leaking to an unintended outer builder.' },
                { term: 'Applied to annotations', detail: 'You mark your own annotation with DslMarker and apply it to builders.' },
                { term: 'Safer DSLs', detail: 'It makes complex nested builders less error-prone.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 22. Operator Overloading ───────────────────────────────────────
  {
    id: 'kt-operator-overloading',
    title: 'Operator Overloading',
    level: 1,
    slug: 'operator-overloading',
    concepts: [],
    children: [
      {
        id: 'kt-operators',
        title: 'Custom Operators',
        level: 2,
        slug: 'custom-operators',
        concepts: [
          {
            id: 'kt-operator-example',
            code: "data class Vector(val x: Double, val y: Double) {\n    operator fun plus(other: Vector) = Vector(x + other.x, y + other.y)\n    operator fun times(scalar: Double) = Vector(x * scalar, y * scalar)\n    operator fun unaryMinus() = Vector(-x, -y)\n    operator fun get(index: Int) = when (index) {\n        0 -> x; 1 -> y\n        else -> throw IndexOutOfBoundsException()\n    }\n}\n\nval v1 = Vector(1.0, 2.0)\nval v2 = Vector(3.0, 4.0)\nval sum = v1 + v2        // Vector(4.0, 6.0)\nval scaled = v1 * 3.0   // Vector(3.0, 6.0)\nval neg = -v1            // Vector(-1.0, -2.0)",
            note: 'Kotlin allows overloading a fixed set of operators via `operator fun` conventions: `plus`, `minus`, `times`, `div`, `get`, `set`, `invoke`, `compareTo`, etc.',
            explanation: {
              heading: 'Operator overloading',
              intro: 'Kotlin lets you give operators meaning for your own types by defining specially named functions marked with the operator keyword.',
              points: [
                { term: 'operator keyword', detail: 'Marking a function operator enables the corresponding symbol.' },
                { term: 'Conventional names', detail: 'Functions like plus and times back the arithmetic operators.' },
                { term: 'Readable types', detail: 'Overloading makes custom types like vectors natural to use.' },
                { term: 'Use sparingly', detail: 'Overloaded operators should keep their intuitive meaning.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 23. Exception Handling ─────────────────────────────────────────
  {
    id: 'kt-exceptions',
    title: 'Exception Handling',
    level: 1,
    slug: 'exceptions',
    concepts: [],
    children: [
      {
        id: 'kt-try-catch',
        title: 'try/catch as Expression',
        level: 2,
        slug: 'try-catch',
        concepts: [
          {
            id: 'kt-try-expression',
            code: "val number: Int = try {\n    input.toInt()\n} catch (e: NumberFormatException) {\n    println(\"Invalid: ${e.message}\")\n    0  // default value\n} finally {\n    println(\"Parsing attempted\")\n}\n\n// Kotlin has no checked exceptions\nfun readFile(path: String): String {\n    return File(path).readText()  // no throws declaration needed\n}",
            note: '`try/catch` is an expression that returns a value. Kotlin has no checked exceptions — you never need to declare or catch exceptions unless you want to. Use `require`, `check`, and `error` for preconditions.',
            explanation: {
              heading: 'try as an expression',
              intro: 'In Kotlin try is an expression that returns a value, so you can assign the result of a try-catch directly.',
              points: [
                { term: 'Returns a value', detail: 'The try block or a catch branch provides the resulting value.' },
                { term: 'Direct assignment', detail: 'You can bind a variable to the outcome of a try expression.' },
                { term: 'Unchecked exceptions', detail: 'Kotlin does not have checked exceptions, so no throws declarations are needed.' },
                { term: 'finally still runs', detail: 'A finally block executes regardless of the outcome.' },
              ],
            },
            example: "require(age >= 0) { \"Age must be non-negative\" }  // IllegalArgumentException\ncheck(isInitialized) { \"Not initialized\" }        // IllegalStateException\nerror(\"Fatal: unreachable\")                        // IllegalStateException",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 24. Destructuring ──────────────────────────────────────────────
  {
    id: 'kt-destructuring',
    title: 'Destructuring Declarations',
    level: 1,
    slug: 'destructuring',
    concepts: [],
    children: [
      {
        id: 'kt-destructure-basics',
        title: 'Destructuring Patterns',
        level: 2,
        slug: 'destructure-patterns',
        concepts: [
          {
            id: 'kt-destructure-example',
            code: "data class Point(val x: Int, val y: Int)\nval (x, y) = Point(10, 20)\n\n// In loops\nval map = mapOf(\"a\" to 1, \"b\" to 2)\nfor ((key, value) in map) {\n    println(\"$key -> $value\")\n}\n\n// From functions returning Pair/Triple\nfun splitName(full: String): Pair<String, String> {\n    val parts = full.split(\" \")\n    return parts[0] to parts[1]\n}\nval (first, last) = splitName(\"Jane Doe\")",
            note: 'Destructuring uses `componentN()` functions. Data classes get them for free. Use `_` to skip components you don\'t need: `val (_, surname) = splitName(name)`.',
            explanation: {
              heading: 'Destructuring declarations',
              intro: 'Destructuring unpacks an object into several variables at once by calling its component functions in order.',
              points: [
                { term: 'Multiple variables', detail: 'One declaration assigns several variables from an object.' },
                { term: 'Component functions', detail: 'It relies on component functions provided by the type.' },
                { term: 'Data classes support it', detail: 'Data classes generate the needed component functions automatically.' },
                { term: 'Map entries', detail: 'You can destructure a map entry into its key and value in a loop.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 25. Type Aliases & Typechecks ─────────────────────────────────
  {
    id: 'kt-type-aliases',
    title: 'Type Aliases & Typechecks',
    level: 1,
    slug: 'type-aliases',
    concepts: [],
    children: [
      {
        id: 'kt-typealias',
        title: 'Type Aliases',
        level: 2,
        slug: 'typealias',
        concepts: [
          {
            id: 'kt-typealias-example',
            code: "typealias UserId = Int\ntypealias Predicate<T> = (T) -> Boolean\ntypealias UserMap = Map<UserId, List<String>>\n\nfun filterUsers(users: List<String>, predicate: Predicate<String>): List<String> {\n    return users.filter(predicate)\n}",
            note: 'Type aliases create alternative names for existing types — useful for shortening complex generics and improving readability. They do not create new types.',
            explanation: {
              heading: 'Type aliases',
              intro: 'A type alias gives an existing type a shorter or more descriptive name without creating a new distinct type.',
              points: [
                { term: 'typealias keyword', detail: 'It introduces an alternative name for a type.' },
                { term: 'No new type', detail: 'The alias is fully interchangeable with the original type.' },
                { term: 'Shorten long types', detail: 'It simplifies verbose generic or function types.' },
                { term: 'Improves readability', detail: 'A meaningful alias documents intent at use sites.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'kt-type-checks',
        title: 'is & as Operators',
        level: 2,
        slug: 'type-checks',
        concepts: [
          {
            id: 'kt-typecheck-example',
            code: "fun describe(obj: Any): String = when (obj) {\n    is Int -> \"Integer: $obj\"\n    is String -> \"String of length ${obj.length}\"\n    is List<*> -> \"List with ${obj.size} items\"\n    else -> \"Unknown\"\n}\n\n// Unsafe cast (throws ClassCastException)\nval str: String = obj as String\n\n// Safe cast (returns null on failure)\nval strOrNull: String? = obj as? String",
            note: '`is` checks type at runtime and enables smart casting. `as` performs unsafe cast; `as?` returns null on failure. Use `when` with `is` for clean pattern matching.',
            explanation: {
              heading: 'Type checks and casts',
              intro: 'Kotlin checks types with the is operator and casts with the as operator, offering a safe cast variant that yields null on failure.',
              points: [
                { term: 'is operator', detail: 'The is operator tests whether a value has a given type.' },
                { term: 'Smart cast follows', detail: 'A successful is check smart-casts the value automatically.' },
                { term: 'as cast', detail: 'The as operator casts a value, throwing if it does not match.' },
                { term: 'Safe cast', detail: 'The safe as variant returns null instead of throwing on failure.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 26. Annotations & Reflection ──────────────────────────────────
  {
    id: 'kt-annotations',
    title: 'Annotations & Reflection',
    level: 1,
    slug: 'annotations',
    concepts: [],
    children: [
      {
        id: 'kt-annotation-basics',
        title: 'Defining & Using Annotations',
        level: 2,
        slug: 'annotation-basics',
        concepts: [
          {
            id: 'kt-annotation-example',
            code: "@Target(AnnotationTarget.FUNCTION)\n@Retention(AnnotationRetention.RUNTIME)\nannotation class Cached(val ttlSeconds: Int = 60)\n\n@Cached(ttlSeconds = 300)\nfun fetchData(): String = \"expensive result\"\n\n// Reflection\nval func = ::fetchData\nval annotation = func.findAnnotation<Cached>()\nprintln(annotation?.ttlSeconds)  // 300",
            note: 'Annotations add metadata to code. Use `@Target` and `@Retention` to control where and when they are available. Kotlin reflection (`kotlin-reflect` library) reads them at runtime.',
            explanation: {
              heading: 'Annotations',
              intro: 'Annotations attach metadata to code elements, which tools, libraries, and the compiler can read to drive behavior.',
              points: [
                { term: 'Metadata', detail: 'An annotation marks a declaration with machine-readable information.' },
                { term: 'At sign syntax', detail: 'Annotations are applied with an at sign before the target.' },
                { term: 'Parameters', detail: 'Annotations can carry arguments to configure their behavior.' },
                { term: 'Read by tools', detail: 'Frameworks and processors inspect annotations to generate or wire code.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'kt-reflection',
        title: 'KClass & Property References',
        level: 2,
        slug: 'reflection',
        concepts: [
          {
            id: 'kt-reflection-example',
            code: "data class User(val name: String, val age: Int)\n\nval kClass = User::class\nprintln(kClass.simpleName)  // User\n\n// Property references\nval nameProp = User::name\nval alice = User(\"Alice\", 30)\nprintln(nameProp.get(alice))  // Alice\n\n// Function references\nval fn: (Int) -> Int = ::double\nlistOf(1, 2, 3).map(::double)  // [2, 4, 6]",
            note: '`::class` gives a `KClass` reference. `::property` and `::function` create callable references. Function references can be passed as lambdas.',
            explanation: {
              heading: 'Reflection',
              intro: 'Reflection lets a program inspect classes, properties, and functions at runtime, enabling frameworks that work generically.',
              points: [
                { term: 'Runtime inspection', detail: 'Reflection examines types and members while the program runs.' },
                { term: 'Class references', detail: 'A double-colon expression obtains a reference to a class or member.' },
                { term: 'Powers frameworks', detail: 'Serialization and dependency injection often rely on reflection.' },
                { term: 'Has overhead', detail: 'Reflection is slower than direct calls, so use it selectively.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 27. Coroutine Context & Dispatchers ────────────────────────────
  {
    id: 'kt-coroutine-context',
    title: 'Coroutine Context & Dispatchers',
    level: 1,
    slug: 'coroutine-context',
    concepts: [],
    children: [
      {
        id: 'kt-dispatchers',
        title: 'Dispatchers & Context Switching',
        level: 2,
        slug: 'dispatchers',
        concepts: [
          {
            id: 'kt-dispatcher-example',
            code: "import kotlinx.coroutines.*\n\nfun main() = runBlocking {\n    launch(Dispatchers.Default) {\n        // CPU-intensive work\n        val result = heavyComputation()\n    }\n\n    launch(Dispatchers.IO) {\n        // Blocking I/O\n        val data = readFile(\"data.txt\")\n    }\n\n    // Switch context mid-coroutine\n    val result = withContext(Dispatchers.IO) {\n        fetchFromNetwork()\n    }\n    // Back on original dispatcher\n    updateUI(result)\n}",
            note: '`Dispatchers.Default` is for CPU work (thread pool = core count). `Dispatchers.IO` is for blocking I/O (larger pool). `Dispatchers.Main` is for UI. Use `withContext` to switch without creating a new coroutine.',
            explanation: {
              heading: 'Coroutine dispatchers',
              intro: 'A dispatcher determines which thread or thread pool a coroutine runs on, letting you place work on appropriate resources.',
              points: [
                { term: 'Thread assignment', detail: 'A dispatcher controls the thread context for a coroutine.' },
                { term: 'Default for CPU work', detail: 'The default dispatcher targets a pool sized for computation.' },
                { term: 'IO for blocking', detail: 'The IO dispatcher suits blocking input and output operations.' },
                { term: 'withContext switches', detail: 'The withContext function moves execution to another dispatcher.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'kt-structured-concurrency',
        title: 'Structured Concurrency',
        level: 2,
        slug: 'structured-concurrency',
        concepts: [
          {
            id: 'kt-structured-example',
            code: "suspend fun loadDashboard(): Dashboard = coroutineScope {\n    val profile = async { fetchProfile() }\n    val feed = async { fetchFeed() }\n    val notifications = async { fetchNotifications() }\n\n    // If any child fails, all siblings are cancelled\n    Dashboard(profile.await(), feed.await(), notifications.await())\n}\n\n// SupervisorScope — children don't cancel each other\nsupervisorScope {\n    launch { riskyTask1() }  // failure won't cancel task2\n    launch { riskyTask2() }\n}",
            note: '`coroutineScope` enforces structured concurrency: parent waits for all children and cancels siblings on failure. `supervisorScope` allows independent child failure.',
            explanation: {
              heading: 'Structured concurrency',
              intro: 'Structured concurrency ties coroutines to a scope so that their lifetimes are managed together, ensuring none are leaked or forgotten.',
              points: [
                { term: 'Scoped coroutines', detail: 'Coroutines launch within a scope that owns them.' },
                { term: 'Automatic cancellation', detail: 'Cancelling a scope cancels all of its child coroutines.' },
                { term: 'Awaits children', detail: 'A scope waits for its children to finish before completing.' },
                { term: 'Prevents leaks', detail: 'It ensures no coroutine outlives its intended scope.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 28. Value Classes & Inline Classes ─────────────────────────────
  {
    id: 'kt-value-classes',
    title: 'Value Classes',
    level: 1,
    slug: 'value-classes',
    concepts: [],
    children: [
      {
        id: 'kt-value-class-basics',
        title: 'Inline Value Classes',
        level: 2,
        slug: 'value-class-basics',
        concepts: [
          {
            id: 'kt-value-class-example',
            code: "@JvmInline\nvalue class Email(val value: String) {\n    init {\n        require(value.contains(\"@\")) { \"Invalid email\" }\n    }\n    val domain: String get() = value.substringAfter(\"@\")\n}\n\n@JvmInline\nvalue class UserId(val id: Long)\n\n// Type-safe without runtime overhead\nfun sendEmail(to: Email, from: Email) { /* ... */ }\n\nval email = Email(\"alice@dev.io\")\nprintln(email.domain)  // dev.io",
            note: 'Value classes wrap a single value with zero runtime allocation overhead (inlined at compile time). They provide type safety for primitives without the cost of wrapper objects.',
            explanation: {
              heading: 'Value classes',
              intro: 'A value class wraps a single value to add type safety, and the compiler inlines it so the wrapper adds no runtime overhead.',
              points: [
                { term: 'Single property', detail: 'A value class holds exactly one underlying value.' },
                { term: 'No overhead', detail: 'The compiler represents it directly by its wrapped value at runtime.' },
                { term: 'Type safety', detail: 'It prevents mixing values that share the same underlying type.' },
                { term: 'value keyword', detail: 'It is declared with the value modifier and a JVM annotation.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 29. Contracts & Context Receivers ──────────────────────────────
  {
    id: 'kt-contracts',
    title: 'Contracts & Advanced Features',
    level: 1,
    slug: 'contracts',
    concepts: [],
    children: [
      {
        id: 'kt-contracts-basics',
        title: 'Kotlin Contracts',
        level: 2,
        slug: 'contracts-basics',
        concepts: [
          {
            id: 'kt-contract-example',
            code: "import kotlin.contracts.*\n\n@OptIn(ExperimentalContracts::class)\nfun String?.isNotNullOrEmpty(): Boolean {\n    contract {\n        returns(true) implies (this@isNotNullOrEmpty != null)\n    }\n    return this != null && isNotEmpty()\n}\n\nfun process(name: String?) {\n    if (name.isNotNullOrEmpty()) {\n        // Smart cast: name is now String (non-null)\n        println(name.length)\n    }\n}",
            note: 'Contracts tell the compiler about function behavior (e.g., \"if this returns true, the argument is non-null\"). They enable smart casts and initialization analysis in custom functions.',
            explanation: {
              heading: 'Contracts',
              intro: 'Contracts let a function tell the compiler about relationships between its inputs and outputs, improving smart casts and analysis at call sites.',
              points: [
                { term: 'Inform the compiler', detail: 'A contract declares guarantees the function provides.' },
                { term: 'Better smart casts', detail: 'Contracts can let callers smart-cast a value after a check function.' },
                { term: 'Call frequency', detail: 'A contract can state that a lambda is called exactly once.' },
                { term: 'Experimental care', detail: 'The contract API is advanced and evolves carefully.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'kt-context-receivers',
        title: 'Context Receivers',
        level: 2,
        slug: 'context-receivers',
        concepts: [
          {
            id: 'kt-context-example',
            code: "// Context receivers (Kotlin 1.6.20+, experimental)\nclass Logger { fun log(msg: String) = println(msg) }\nclass Database { fun query(sql: String) = listOf<String>() }\n\ncontext(Logger, Database)\nfun fetchUsers(): List<String> {\n    log(\"Fetching users...\")      // from Logger context\n    return query(\"SELECT * FROM users\")  // from Database context\n}\n\n// Call site must provide contexts\nwith(Logger()) {\n    with(Database()) {\n        fetchUsers()\n    }\n}",
            note: 'Context receivers allow functions to require multiple implicit contexts without parameter passing. They make dependency injection patterns cleaner and enable capability-based APIs.',
            explanation: {
              heading: 'Context receivers',
              intro: 'Context receivers let a function require certain contextual types to be in scope at the call site, expressing dependencies without extra parameters.',
              points: [
                { term: 'Required context', detail: 'A function can demand that specific receiver types are available.' },
                { term: 'Implicit access', detail: 'The function can call the context\'s members directly.' },
                { term: 'Fewer parameters', detail: 'It avoids threading dependencies through explicit parameters.' },
                { term: 'Evolving feature', detail: 'It is a newer capability whose design continues to develop.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 30. Multiplatform & Interop ────────────────────────────────────
  {
    id: 'kt-multiplatform',
    title: 'Multiplatform & Java Interop',
    level: 1,
    slug: 'multiplatform',
    concepts: [],
    children: [
      {
        id: 'kt-java-interop',
        title: 'Java Interoperability',
        level: 2,
        slug: 'java-interop',
        concepts: [
          {
            id: 'kt-java-interop-example',
            code: "// Calling Java from Kotlin — seamless\nimport java.time.LocalDate\nimport java.util.stream.Collectors\n\nval today = LocalDate.now()\nval dates = listOf(today, today.plusDays(1))\n\n// Java sees Kotlin properties as getters/setters\nclass Config {\n    @JvmField val version = \"1.0\"          // exposed as field\n    @JvmStatic fun create() = Config()     // static method\n    companion object {\n        @JvmStatic fun default() = Config()\n    }\n}",
            note: 'Kotlin is 100% interoperable with Java. Use `@JvmStatic`, `@JvmField`, `@JvmOverloads`, and `@Throws` to control how Kotlin code appears to Java callers.',
            explanation: {
              heading: 'Java interoperability',
              intro: 'Kotlin is fully interoperable with Java, so you can call Java code from Kotlin and vice versa, easing gradual adoption.',
              points: [
                { term: 'Call Java directly', detail: 'Kotlin can use existing Java classes and libraries without wrappers.' },
                { term: 'Platform types', detail: 'Values from Java have relaxed nullability that you handle carefully.' },
                { term: 'Two-way', detail: 'Java code can also call Kotlin, with annotations to shape the exposed API.' },
                { term: 'Gradual migration', detail: 'Projects can mix Kotlin and Java files freely.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'kt-multiplatform-expect',
        title: 'expect/actual Declarations',
        level: 2,
        slug: 'expect-actual',
        concepts: [
          {
            id: 'kt-expect-actual',
            code: "// Common code (shared)\nexpect fun platformName(): String\nexpect class UUID {\n    fun toString(): String\n}\n\n// JVM implementation\nactual fun platformName() = \"JVM ${System.getProperty(\"java.version\")}\"\n\n// JS implementation\nactual fun platformName() = \"JS\"\n\n// Use in common code\nfun greet() = \"Running on ${platformName()}\"",
            note: '`expect`/`actual` enables writing shared logic in common code with platform-specific implementations. Kotlin Multiplatform supports JVM, JS, Native (iOS, Linux, Windows).',
            explanation: {
              heading: 'Expect and actual',
              intro: 'In Kotlin Multiplatform the expect and actual mechanism declares a common API in shared code and provides platform-specific implementations.',
              points: [
                { term: 'expect declares', detail: 'The expect keyword declares an API the shared code depends on.' },
                { term: 'actual implements', detail: 'Each platform provides an actual implementation of that API.' },
                { term: 'Shared plus specific', detail: 'It lets common code stay portable while using platform features.' },
                { term: 'Multiplatform', detail: 'It underpins sharing logic across JVM, native, and JavaScript targets.' },
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
