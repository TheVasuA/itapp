// Swift topic tree.
//
// Each node is a ConceptNode: { id, title, level, slug?, concepts[], children[] }.
// Routable nodes carry a `slug`. Every Concept renders in the fixed order
// code -> note -> example (example optional).

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  // ─── 1. Variables & Constants ──────────────────────────────────────
  {
    id: 'swift-variables',
    title: 'Variables & Constants',
    level: 1,
    slug: 'variables',
    concepts: [],
    children: [
      {
        id: 'swift-let-var',
        title: 'let vs var',
        level: 2,
        slug: 'let-var',
        concepts: [
          {
            id: 'swift-let-var-declare',
            code: "let name = \"Swift\" // immutable constant\nvar count = 0      // mutable variable\ncount += 1\n\nlet pi: Double = 3.14159",
            note: 'Use `let` for values that never change and `var` for mutable values. Swift encourages immutability — prefer `let` wherever possible.',
            explanation: {
              heading: 'let and var',
              intro: 'Swift declares constants with let and variables with var, and it encourages using constants wherever a value does not need to change.',
              points: [
                { term: 'let is constant', detail: 'A let binding cannot be reassigned after it is set.' },
                { term: 'var is mutable', detail: 'A var binding can be changed later.' },
                { term: 'Prefer let', detail: 'Using constants by default makes intent clear and code safer.' },
                { term: 'Compiler enforced', detail: 'Reassigning a let is a compile-time error.' },
              ],
            },
            example: "// let cannot be reassigned\nlet language = \"Swift\"\n// language = \"Rust\" // Error: cannot assign to 'let' constant",
          },
        ],
        children: [],
      },
      {
        id: 'swift-type-annotations',
        title: 'Type Annotations & Inference',
        level: 2,
        slug: 'type-annotations',
        concepts: [
          {
            id: 'swift-type-infer',
            code: "let age = 25            // inferred as Int\nlet price = 9.99        // inferred as Double\nlet message = \"Hello\"   // inferred as String\n\n// Explicit annotation\nlet ratio: Float = 0.5\nlet flags: [Bool] = [true, false, true]",
            note: 'Swift infers types from assigned values. Use explicit type annotations when the compiler cannot infer, or when you want a specific type (e.g., Float instead of Double).',
            explanation: {
              heading: 'Type inference',
              intro: 'Swift infers a variable\'s type from its initial value, so explicit type annotations are optional in most declarations.',
              points: [
                { term: 'Inferred from value', detail: 'The compiler derives the type from the assigned expression.' },
                { term: 'Optional annotations', detail: 'You can write the type explicitly for clarity or when there is no initializer.' },
                { term: 'Statically typed', detail: 'Types are fixed at compile time despite the concise syntax.' },
                { term: 'Literal defaults', detail: 'Numeric literals default to Int or Double unless annotated otherwise.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 2. Basic Types ────────────────────────────────────────────────
  {
    id: 'swift-basic-types',
    title: 'Basic Types',
    level: 1,
    slug: 'basic-types',
    concepts: [],
    children: [
      {
        id: 'swift-numeric-types',
        title: 'Numeric Types',
        level: 2,
        slug: 'numeric-types',
        concepts: [
          {
            id: 'swift-numbers',
            code: "let integer: Int = 42\nlet unsigned: UInt = 100\nlet float: Float = 3.14\nlet double: Double = 2.718281828\n\n// Numeric literals\nlet million = 1_000_000\nlet hex = 0xFF\nlet binary = 0b1010\nlet octal = 0o17",
            note: 'Swift provides `Int`, `UInt`, `Float` (32-bit), and `Double` (64-bit). Use underscores in literals for readability. `Int` is platform-sized (64-bit on modern systems).',
            explanation: {
              heading: 'Numeric types',
              intro: 'Swift provides sized integer and floating-point types and requires explicit conversion between them rather than implicit coercion.',
              points: [
                { term: 'Int and Double', detail: 'Int is the common integer type and Double the default floating-point type.' },
                { term: 'No implicit conversion', detail: 'You must convert explicitly by constructing the target type.' },
                { term: 'Underscores in literals', detail: 'Underscores group digits in large numeric literals for readability.' },
                { term: 'Overflow safety', detail: 'Standard arithmetic traps on overflow rather than wrapping silently.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'swift-bool-tuple',
        title: 'Booleans & Tuples',
        level: 2,
        slug: 'bool-tuple',
        concepts: [
          {
            id: 'swift-bool-tuple-intro',
            code: "let isActive: Bool = true\n\n// Tuples group multiple values\nlet coordinates = (x: 3.0, y: 4.5)\nprint(coordinates.x) // 3.0\n\nlet (lat, lon) = (37.7749, -122.4194)\n\n// Tuples as return values\nfunc minMax(_ array: [Int]) -> (min: Int, max: Int) {\n  return (array.min()!, array.max()!)\n}",
            note: 'Booleans are `true`/`false` — no implicit conversion from integers. Tuples group related values without defining a struct, ideal for temporary groupings and multiple return values.',
            explanation: {
              heading: 'Booleans and tuples',
              intro: 'Swift has a dedicated boolean type and tuples that group several values into one compound value without defining a type.',
              points: [
                { term: 'Bool type', detail: 'A boolean holds only true or false, with no truthy coercion.' },
                { term: 'Tuples group values', detail: 'A tuple bundles multiple values of possibly different types.' },
                { term: 'Named elements', detail: 'Tuple elements can be named for clearer access.' },
                { term: 'Decompose', detail: 'You can unpack a tuple into separate constants or variables.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 3. Optionals ──────────────────────────────────────────────────
  {
    id: 'swift-optionals',
    title: 'Optionals',
    level: 1,
    slug: 'optionals',
    concepts: [],
    children: [
      {
        id: 'swift-optional-binding',
        title: 'Optional Binding',
        level: 2,
        slug: 'optional-binding',
        concepts: [
          {
            id: 'swift-if-let-guard',
            code: "var name: String? = \"Alice\"\n\n// if let unwrapping\nif let unwrapped = name {\n  print(\"Hello, \\(unwrapped)\")\n}\n\n// guard let for early exit\nfunc greet(_ name: String?) {\n  guard let name = name else {\n    print(\"No name provided\")\n    return\n  }\n  print(\"Hello, \\(name)\")\n}\n\n// Swift 5.7 shorthand\nif let name {\n  print(name)\n}",
            note: '`if let` binds the unwrapped value within a scope. `guard let` unwraps and makes the value available for the rest of the function, requiring an early exit in the else branch.',
            explanation: {
              heading: 'Optional binding',
              intro: 'Optional binding safely unwraps an optional into a non-optional value, using if let for local scope or guard let for early exit.',
              points: [
                { term: 'if let', detail: 'It unwraps an optional and runs a block only when a value is present.' },
                { term: 'guard let', detail: 'It unwraps and, on failure, exits the current scope early.' },
                { term: 'Widened scope', detail: 'A guard-bound value remains available after the guard statement.' },
                { term: 'Shorthand', detail: 'Recent Swift allows omitting the name when unwrapping into the same identifier.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'swift-optional-chaining',
        title: 'Optional Chaining & Coalescing',
        level: 2,
        slug: 'optional-chaining',
        concepts: [
          {
            id: 'swift-chain-coalesce',
            code: "struct Address {\n  var city: String?\n}\nstruct Person {\n  var address: Address?\n}\n\nlet person: Person? = Person(address: Address(city: \"Seattle\"))\nlet city = person?.address?.city ?? \"Unknown\"\n\n// Force unwrap (use sparingly)\nlet definite: String = name!",
            note: 'Optional chaining (`?.`) safely traverses nested optionals — returns `nil` if any link is nil. The nil-coalescing operator (`??`) provides a default. Avoid force unwrap (`!`) unless you are certain the value exists.',
            explanation: {
              heading: 'Optional chaining and coalescing',
              intro: 'Optional chaining safely accesses members through optionals, and the nil-coalescing operator supplies a default when an optional is nil.',
              points: [
                { term: 'Optional chaining', detail: 'A question mark accesses a member only if the optional holds a value.' },
                { term: 'Propagates nil', detail: 'If any link is nil, the whole chain evaluates to nil.' },
                { term: 'Nil-coalescing', detail: 'The double-question operator returns a fallback when the optional is nil.' },
                { term: 'Concise defaults', detail: 'Together they replace verbose nil-checking code.' },
              ],
            },
            example: "let scores: [String: Int] = [\"math\": 95]\nlet mathScore = scores[\"math\"] ?? 0  // 95\nlet artScore = scores[\"art\"] ?? 0    // 0",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 4. Control Flow ───────────────────────────────────────────────
  {
    id: 'swift-control-flow',
    title: 'Control Flow',
    level: 1,
    slug: 'control-flow',
    concepts: [],
    children: [
      {
        id: 'swift-conditionals',
        title: 'Conditionals',
        level: 2,
        slug: 'conditionals',
        concepts: [
          {
            id: 'swift-if-switch',
            code: "let temp = 72\nif temp > 80 {\n  print(\"Hot\")\n} else if temp > 60 {\n  print(\"Nice\")\n} else {\n  print(\"Cold\")\n}\n\n// switch must be exhaustive\nlet direction = \"north\"\nswitch direction {\ncase \"north\", \"south\":\n  print(\"vertical\")\ncase \"east\", \"west\":\n  print(\"horizontal\")\ndefault:\n  print(\"unknown\")\n}",
            note: 'Swift `if` does not require parentheses. `switch` statements must be exhaustive — cover all cases or include `default`. No implicit fall-through between cases.',
            explanation: {
              heading: 'if and switch',
              intro: 'Swift\'s if handles conditions, while switch matches a value against patterns and must be exhaustive, covering every possible case.',
              points: [
                { term: 'Exhaustive switch', detail: 'A switch must handle all cases, often requiring a default.' },
                { term: 'No implicit fallthrough', detail: 'Cases do not fall through unless you use the fallthrough keyword.' },
                { term: 'Pattern matching', detail: 'Cases can match ranges, tuples, and bind associated values.' },
                { term: 'Expression forms', detail: 'Recent Swift allows if and switch to produce values.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'swift-loops',
        title: 'Loops',
        level: 2,
        slug: 'loops',
        concepts: [
          {
            id: 'swift-for-while',
            code: "// for-in with ranges\nfor i in 1...5 {\n  print(i) // 1, 2, 3, 4, 5\n}\n\nfor i in 0..<3 {\n  print(i) // 0, 1, 2\n}\n\n// while and repeat-while\nvar n = 5\nwhile n > 0 {\n  n -= 1\n}\n\nrepeat {\n  n += 1\n} while n < 3\n\n// stride\nfor i in stride(from: 0, to: 10, by: 2) {\n  print(i) // 0, 2, 4, 6, 8\n}",
            note: '`for-in` iterates over ranges, collections, and sequences. `...` is closed range (inclusive), `..<` is half-open. Use `stride` for custom step values.',
            explanation: {
              heading: 'Loops',
              intro: 'Swift offers a for-in loop for iterating sequences and while loops for condition-based repetition.',
              points: [
                { term: 'for-in', detail: 'It iterates over arrays, ranges, and other sequences.' },
                { term: 'Ranges', detail: 'Range operators drive counting loops cleanly.' },
                { term: 'while and repeat', detail: 'A while loop tests first while a repeat-while runs at least once.' },
                { term: 'where clause', detail: 'A for-in loop can filter elements with a where condition.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 5. Functions ──────────────────────────────────────────────────
  {
    id: 'swift-functions',
    title: 'Functions',
    level: 1,
    slug: 'functions',
    concepts: [],
    children: [
      {
        id: 'swift-func-basics',
        title: 'Function Syntax',
        level: 2,
        slug: 'function-syntax',
        concepts: [
          {
            id: 'swift-func-declare',
            code: "func greet(person name: String, from city: String = \"NYC\") -> String {\n  return \"Hello \\(name) from \\(city)!\"\n}\ngreet(person: \"Alice\", from: \"SF\")\ngreet(person: \"Bob\") // uses default\n\n// Omit argument label with _\nfunc square(_ n: Int) -> Int {\n  n * n // implicit return for single expressions\n}",
            note: 'Swift functions have argument labels (for callers) and parameter names (for the body). Default values, `_` to omit labels, and implicit returns for single-expression bodies.',
            explanation: {
              heading: 'Declaring functions',
              intro: 'Swift functions use the func keyword and support argument labels that make call sites read naturally, plus default parameter values.',
              points: [
                { term: 'func keyword', detail: 'The func keyword introduces a function definition.' },
                { term: 'Argument labels', detail: 'External labels make calls read like phrases at the call site.' },
                { term: 'Underscore hides label', detail: 'An underscore omits the external label for an argument.' },
                { term: 'Default values', detail: 'Parameters can specify defaults, making them optional to pass.' },
              ],
            },
            example: "// Variadic parameters\nfunc sum(_ numbers: Int...) -> Int {\n  numbers.reduce(0, +)\n}\nsum(1, 2, 3, 4) // 10",
          },
        ],
        children: [],
      },
      {
        id: 'swift-inout',
        title: 'inout Parameters',
        level: 2,
        slug: 'inout-parameters',
        concepts: [
          {
            id: 'swift-inout-intro',
            code: "func swapValues(_ a: inout Int, _ b: inout Int) {\n  let temp = a\n  a = b\n  b = temp\n}\n\nvar x = 10, y = 20\nswapValues(&x, &y)\nprint(x, y) // 20, 10",
            note: '`inout` parameters allow a function to modify the caller\'s variable. Pass with `&` to signal mutation. Swift copies in, modifies, then copies out.',
            explanation: {
              heading: 'In-out parameters',
              intro: 'An in-out parameter lets a function modify the caller\'s variable, with changes written back when the function returns.',
              points: [
                { term: 'inout keyword', detail: 'The inout modifier marks a parameter that can be changed in place.' },
                { term: 'Ampersand at call', detail: 'The caller prefixes the argument with an ampersand to pass it.' },
                { term: 'Written back', detail: 'The modified value is copied back to the caller after the call.' },
                { term: 'Requires a variable', detail: 'You cannot pass a constant to an in-out parameter.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 6. Closures ───────────────────────────────────────────────────
  {
    id: 'swift-closures',
    title: 'Closures',
    level: 1,
    slug: 'closures',
    concepts: [],
    children: [
      {
        id: 'swift-closure-syntax',
        title: 'Closure Expressions',
        level: 2,
        slug: 'closure-expressions',
        concepts: [
          {
            id: 'swift-closure-basics',
            code: "// Full closure syntax\nlet doubled = [1, 2, 3].map({ (n: Int) -> Int in\n  return n * 2\n})\n\n// Trailing closure + shorthand\nlet tripled = [1, 2, 3].map { $0 * 3 }\n\n// Multi-line trailing closure\nlet result = [5, 2, 8, 1].sorted { lhs, rhs in\n  lhs < rhs\n}",
            note: 'Closures are self-contained blocks of functionality. Swift supports shorthand argument names (`$0`, `$1`), trailing closure syntax, and implicit returns.',
            explanation: {
              heading: 'Closures',
              intro: 'Closures are self-contained blocks of functionality that can be passed around, and Swift provides concise syntax including trailing closures.',
              points: [
                { term: 'In keyword', detail: 'The in keyword separates a closure\'s parameters from its body.' },
                { term: 'Trailing closure', detail: 'A final closure argument can move outside the call\'s parentheses.' },
                { term: 'Shorthand arguments', detail: 'Dollar-number names refer to closure parameters implicitly.' },
                { term: 'Capture surroundings', detail: 'A closure captures references to variables in its context.' },
              ],
            },
            example: "// Multiple trailing closures (Swift 5.3+)\nUIView.animate(withDuration: 0.3) {\n  view.alpha = 0\n} completion: { _ in\n  view.removeFromSuperview()\n}",
          },
        ],
        children: [],
      },
      {
        id: 'swift-capturing',
        title: 'Capturing Values',
        level: 2,
        slug: 'capturing-values',
        concepts: [
          {
            id: 'swift-capture-list',
            code: "func makeCounter() -> () -> Int {\n  var count = 0\n  return {\n    count += 1\n    return count\n  }\n}\nlet counter = makeCounter()\ncounter() // 1\ncounter() // 2\n\n// Capture list to avoid retain cycles\nclass ViewController {\n  var name = \"Main\"\n  lazy var greeting: () -> String = { [weak self] in\n    return \"Hello from \\(self?.name ?? \"unknown\")\"\n  }\n}",
            note: 'Closures capture and store references to variables from their surrounding context. Use `[weak self]` or `[unowned self]` in capture lists to break retain cycles.',
            explanation: {
              heading: 'Capture lists',
              intro: 'A capture list controls how a closure captures values, and it is key to breaking strong reference cycles with weak or unowned captures.',
              points: [
                { term: 'Bracket list', detail: 'A capture list appears in brackets at the start of the closure.' },
                { term: 'weak self', detail: 'Capturing self weakly avoids a retain cycle and yields an optional.' },
                { term: 'unowned self', detail: 'An unowned capture assumes self outlives the closure and is non-optional.' },
                { term: 'Prevents cycles', detail: 'Capture lists are essential where a closure is stored by the captured object.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 7. Structs vs Classes ─────────────────────────────────────────
  {
    id: 'swift-structs-classes',
    title: 'Structs vs Classes',
    level: 1,
    slug: 'structs-classes',
    concepts: [],
    children: [
      {
        id: 'swift-structs',
        title: 'Structs (Value Types)',
        level: 2,
        slug: 'structs',
        concepts: [
          {
            id: 'swift-struct-intro',
            code: "struct Point {\n  var x: Double\n  var y: Double\n\n  // Memberwise initializer is auto-generated\n  func distanceTo(_ other: Point) -> Double {\n    let dx = x - other.x\n    let dy = y - other.y\n    return (dx * dx + dy * dy).squareRoot()\n  }\n\n  // mutating to modify self\n  mutating func translate(dx: Double, dy: Double) {\n    x += dx\n    y += dy\n  }\n}\n\nvar p1 = Point(x: 0, y: 0)\nvar p2 = p1 // copy\np2.x = 5\nprint(p1.x) // 0 — value semantics",
            note: 'Structs are value types — assignment creates a copy. They get a free memberwise initializer. Use `mutating` for methods that modify properties. Prefer structs for simple data models.',
            explanation: {
              heading: 'Structures',
              intro: 'A struct is a value type that is copied on assignment, and Swift favors structs for modeling data because copies are independent.',
              points: [
                { term: 'Value semantics', detail: 'A struct is copied when assigned or passed, so copies do not share state.' },
                { term: 'Memberwise initializer', detail: 'Swift generates an initializer covering all stored properties.' },
                { term: 'mutating methods', detail: 'A method that changes the struct must be marked mutating.' },
                { term: 'Prefer structs', detail: 'Value semantics make structs a safe default for data models.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'swift-classes',
        title: 'Classes (Reference Types)',
        level: 2,
        slug: 'classes',
        concepts: [
          {
            id: 'swift-class-intro',
            code: "class Vehicle {\n  var speed: Double = 0\n  let wheels: Int\n\n  init(wheels: Int) {\n    self.wheels = wheels\n  }\n\n  func describe() -> String {\n    \"\\(wheels)-wheel vehicle at \\(speed) mph\"\n  }\n\n  deinit {\n    print(\"Vehicle deallocated\")\n  }\n}\n\nclass Car: Vehicle {\n  var brand: String\n\n  init(brand: String) {\n    self.brand = brand\n    super.init(wheels: 4)\n  }\n\n  override func describe() -> String {\n    \"\\(brand): \\(super.describe())\"\n  }\n}",
            note: 'Classes are reference types — assignment shares the same instance. They support inheritance, deinitializers, and reference counting (ARC). Use classes when identity matters or you need inheritance.',
            explanation: {
              heading: 'Classes',
              intro: 'A class is a reference type shared by reference rather than copied, and it supports inheritance and identity comparison.',
              points: [
                { term: 'Reference semantics', detail: 'Assigning a class instance shares the same object rather than copying it.' },
                { term: 'Inheritance', detail: 'Classes can inherit from a superclass, unlike structs.' },
                { term: 'Identity operator', detail: 'The triple-equals operator checks whether two references are the same instance.' },
                { term: 'Deinitializers', detail: 'A class can define a deinitializer that runs before it is freed.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 8. Enumerations ───────────────────────────────────────────────
  {
    id: 'swift-enums',
    title: 'Enumerations',
    level: 1,
    slug: 'enums',
    concepts: [],
    children: [
      {
        id: 'swift-enum-raw',
        title: 'Raw Values',
        level: 2,
        slug: 'enum-raw-values',
        concepts: [
          {
            id: 'swift-enum-raw-intro',
            code: "enum Planet: Int {\n  case mercury = 1, venus, earth, mars\n}\nlet earth = Planet.earth\nprint(earth.rawValue) // 3\n\nenum HTTPMethod: String {\n  case get = \"GET\"\n  case post = \"POST\"\n  case put = \"PUT\"\n  case delete = \"DELETE\"\n}\n\n// Initialize from raw value (returns optional)\nlet method = HTTPMethod(rawValue: \"POST\") // .post",
            note: 'Raw-value enums associate each case with a fixed value (Int, String, etc.). Int raw values auto-increment. Initialize from raw values with the failable initializer.',
            explanation: {
              heading: 'Enums with raw values',
              intro: 'A Swift enum defines a set of related cases, and raw values assign an underlying literal to each case for conversion to and from that type.',
              points: [
                { term: 'Raw value type', detail: 'An enum can declare a backing type such as a string or integer.' },
                { term: 'Automatic values', detail: 'Integer raw values increment automatically from the first case.' },
                { term: 'Failable init', detail: 'Creating an enum from a raw value returns an optional that may be nil.' },
                { term: 'rawValue property', detail: 'Each case exposes its underlying raw value.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'swift-enum-associated',
        title: 'Associated Values',
        level: 2,
        slug: 'enum-associated-values',
        concepts: [
          {
            id: 'swift-enum-assoc-intro',
            code: "enum NetworkResult {\n  case success(data: Data, statusCode: Int)\n  case failure(error: Error)\n  case loading(progress: Double)\n}\n\nlet result = NetworkResult.success(data: Data(), statusCode: 200)\n\nswitch result {\ncase .success(let data, let code):\n  print(\"Got \\(data.count) bytes, status \\(code)\")\ncase .failure(let error):\n  print(\"Error: \\(error.localizedDescription)\")\ncase .loading(let progress):\n  print(\"Loading: \\(progress * 100)%\")\n}",
            note: 'Associated values let each case carry different typed payloads. Unlike raw values, associated values can vary per instance. Extract them with pattern matching in `switch` or `if case`.',
            explanation: {
              heading: 'Enums with associated values',
              intro: 'Enum cases can carry associated values of different types, letting a single enum model varied data shapes precisely.',
              points: [
                { term: 'Per-case data', detail: 'Each case can store its own associated values.' },
                { term: 'Different types', detail: 'Cases may attach different kinds and numbers of values.' },
                { term: 'Extract in switch', detail: 'A switch binds the associated values when matching a case.' },
                { term: 'Model states', detail: 'They express things like a result being success with data or failure with an error.' },
              ],
            },
            example: "// if case let for single-case matching\nif case .success(_, let code) = result, code == 200 {\n  print(\"OK\")\n}",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 9. Protocols ──────────────────────────────────────────────────
  {
    id: 'swift-protocols',
    title: 'Protocols',
    level: 1,
    slug: 'protocols',
    concepts: [],
    children: [
      {
        id: 'swift-protocol-basics',
        title: 'Protocol Conformance',
        level: 2,
        slug: 'protocol-conformance',
        concepts: [
          {
            id: 'swift-protocol-conform',
            code: "protocol Drawable {\n  var boundingBox: CGRect { get }\n  func draw()\n}\n\nprotocol Resizable {\n  mutating func resize(by factor: Double)\n}\n\nstruct Circle: Drawable, Resizable {\n  var radius: Double\n  var boundingBox: CGRect {\n    CGRect(x: -radius, y: -radius, width: radius * 2, height: radius * 2)\n  }\n  func draw() { print(\"Drawing circle r=\\(radius)\") }\n  mutating func resize(by factor: Double) { radius *= factor }\n}",
            note: 'Protocols define a blueprint of required methods and properties. Types can conform to multiple protocols, enabling flexible polymorphism without class inheritance.',
            explanation: {
              heading: 'Protocols',
              intro: 'A protocol defines a set of requirements that a conforming type must satisfy, forming the basis of Swift\'s protocol-oriented design.',
              points: [
                { term: 'Requirements', detail: 'A protocol lists methods and properties a conformer must provide.' },
                { term: 'Conformance', detail: 'A type declares that it adopts a protocol and implements its members.' },
                { term: 'Multiple protocols', detail: 'A type can conform to several protocols at once.' },
                { term: 'Value and reference', detail: 'Both structs and classes can conform to protocols.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'swift-protocol-extensions',
        title: 'Protocol Extensions & Default Implementations',
        level: 2,
        slug: 'protocol-extensions',
        concepts: [
          {
            id: 'swift-protocol-ext-intro',
            code: "protocol Identifiable {\n  var id: String { get }\n}\n\nextension Identifiable {\n  // Default implementation\n  var displayId: String {\n    \"ID: \\(id)\"\n  }\n}\n\nstruct User: Identifiable {\n  let id: String\n  let name: String\n}\n\nlet user = User(id: \"abc123\", name: \"Alice\")\nprint(user.displayId) // \"ID: abc123\"",
            note: 'Protocol extensions provide default implementations so conforming types get behavior for free. This is the foundation of protocol-oriented programming in Swift.',
            explanation: {
              heading: 'Protocol extensions',
              intro: 'A protocol extension provides default implementations for its requirements, letting conforming types inherit shared behavior automatically.',
              points: [
                { term: 'Default methods', detail: 'An extension supplies default implementations of protocol members.' },
                { term: 'Shared behavior', detail: 'Conformers gain the default behavior without writing it themselves.' },
                { term: 'Override allowed', detail: 'A conforming type can still provide its own implementation.' },
                { term: 'Protocol-oriented', detail: 'This is central to composing behavior through protocols.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 10. Extensions ────────────────────────────────────────────────
  {
    id: 'swift-extensions',
    title: 'Extensions',
    level: 1,
    slug: 'extensions',
    concepts: [],
    children: [
      {
        id: 'swift-extension-methods',
        title: 'Adding Functionality',
        level: 2,
        slug: 'extension-methods',
        concepts: [
          {
            id: 'swift-ext-methods',
            code: "extension Int {\n  var isEven: Bool { self % 2 == 0 }\n\n  func repeated(_ action: () -> Void) {\n    for _ in 0..<self { action() }\n  }\n}\n\n4.isEven        // true\n3.repeated { print(\"Hello\") } // prints 3 times\n\nextension String {\n  var trimmed: String {\n    trimmingCharacters(in: .whitespacesAndNewlines)\n  }\n\n  func truncated(to length: Int) -> String {\n    count <= length ? self : String(prefix(length)) + \"...\"\n  }\n}",
            note: 'Extensions add computed properties, methods, initializers, and protocol conformance to existing types — even types you do not own. They cannot add stored properties.',
            explanation: {
              heading: 'Extensions',
              intro: 'Extensions add functionality such as methods and computed properties to an existing type, even one you did not define.',
              points: [
                { term: 'extension keyword', detail: 'An extension block adds members to an existing type.' },
                { term: 'Add to any type', detail: 'You can extend your own types or standard library ones.' },
                { term: 'No stored properties', detail: 'Extensions can add computed properties but not stored ones.' },
                { term: 'Organize code', detail: 'Extensions help group related functionality cleanly.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'swift-conditional-conformance',
        title: 'Conditional Conformance',
        level: 2,
        slug: 'conditional-conformance',
        concepts: [
          {
            id: 'swift-cond-conform',
            code: "// Array conforms to Equatable only when its Element does\nextension Array: Equatable where Element: Equatable {\n  // Already provided by stdlib, shown for illustration\n}\n\n// Custom example\nprotocol Summable {\n  var total: Double { get }\n}\n\nextension Array: Summable where Element == Double {\n  var total: Double { reduce(0, +) }\n}\n\n[1.5, 2.5, 3.0].total // 7.0",
            note: 'Conditional conformance lets a generic type conform to a protocol only when its type parameters meet certain constraints. This enables targeted behavior without compromising type safety.',
            explanation: {
              heading: 'Conditional conformance',
              intro: 'Conditional conformance makes a generic type conform to a protocol only when its type parameter meets certain requirements.',
              points: [
                { term: 'where constraint', detail: 'A where clause states the condition under which conformance applies.' },
                { term: 'Depends on element', detail: 'For example an array conforms only if its elements do.' },
                { term: 'Precise conformance', detail: 'It grants protocol behavior exactly when it makes sense.' },
                { term: 'Composable', detail: 'It lets generic types gain capabilities from their contents.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 11. Generics ──────────────────────────────────────────────────
  {
    id: 'swift-generics',
    title: 'Generics',
    level: 1,
    slug: 'generics',
    concepts: [],
    children: [
      {
        id: 'swift-generic-functions',
        title: 'Generic Functions & Types',
        level: 2,
        slug: 'generic-functions',
        concepts: [
          {
            id: 'swift-generics-intro',
            code: "func swapTwo<T>(_ a: inout T, _ b: inout T) {\n  let temp = a\n  a = b\n  b = temp\n}\n\nstruct Stack<Element> {\n  private var items: [Element] = []\n\n  mutating func push(_ item: Element) {\n    items.append(item)\n  }\n\n  mutating func pop() -> Element? {\n    items.popLast()\n  }\n\n  var peek: Element? { items.last }\n  var isEmpty: Bool { items.isEmpty }\n}\n\nvar intStack = Stack<Int>()\nintStack.push(1)\nintStack.push(2)\nintStack.pop() // 2",
            note: 'Generics let you write flexible, reusable functions and types that work with any type. The placeholder `T` (or `Element`) is replaced by a concrete type at use.',
            explanation: {
              heading: 'Generics',
              intro: 'Generics let functions and types work with any type through placeholders, providing reusable, type-safe abstractions.',
              points: [
                { term: 'Type parameters', detail: 'Angle brackets introduce placeholder type names.' },
                { term: 'Type safety', detail: 'The compiler enforces the actual type at each use.' },
                { term: 'Constraints', detail: 'A constraint requires the type to conform to a protocol.' },
                { term: 'Reusable code', detail: 'One generic definition replaces many type-specific versions.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'swift-generic-constraints',
        title: 'Type Constraints & where Clauses',
        level: 2,
        slug: 'generic-constraints',
        concepts: [
          {
            id: 'swift-where-clause',
            code: "func findIndex<T: Equatable>(of value: T, in array: [T]) -> Int? {\n  for (index, item) in array.enumerated() {\n    if item == value { return index }\n  }\n  return nil\n}\n\n// where clause for complex constraints\nfunc allMatch<C: Collection>(\n  _ collection: C,\n  predicate: (C.Element) -> Bool\n) -> Bool where C.Element: Equatable {\n  collection.allSatisfy(predicate)\n}",
            note: 'Type constraints restrict generics to types conforming to a protocol or inheriting from a class. Use `where` clauses for more complex constraints on associated types.',
            explanation: {
              heading: 'Generic where clauses',
              intro: 'A where clause adds requirements to generic type parameters, constraining associated types or relationships between types.',
              points: [
                { term: 'Extra constraints', detail: 'It refines which types a generic accepts beyond a basic bound.' },
                { term: 'Associated types', detail: 'It can constrain the associated types of a protocol.' },
                { term: 'Type relationships', detail: 'It can require two type parameters to be the same or related.' },
                { term: 'Placement', detail: 'It appears after the parameter list or on an extension.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 12. Error Handling ────────────────────────────────────────────
  {
    id: 'swift-error-handling',
    title: 'Error Handling',
    level: 1,
    slug: 'error-handling',
    concepts: [],
    children: [
      {
        id: 'swift-throwing',
        title: 'Throwing & Catching',
        level: 2,
        slug: 'throwing-catching',
        concepts: [
          {
            id: 'swift-do-try-catch',
            code: "enum ValidationError: Error {\n  case tooShort(minimum: Int)\n  case invalidCharacter(Character)\n  case empty\n}\n\nfunc validate(password: String) throws -> Bool {\n  guard !password.isEmpty else {\n    throw ValidationError.empty\n  }\n  guard password.count >= 8 else {\n    throw ValidationError.tooShort(minimum: 8)\n  }\n  return true\n}\n\ndo {\n  try validate(password: \"abc\")\n} catch ValidationError.tooShort(let min) {\n  print(\"Password must be at least \\(min) characters\")\n} catch {\n  print(\"Error: \\(error)\")\n}",
            note: 'Define errors conforming to `Error` protocol. Functions that can fail are marked `throws`. Handle with `do-try-catch`. The implicit `error` binding is available in generic catch blocks.',
            explanation: {
              heading: 'Error handling',
              intro: 'Swift handles errors with throwing functions and do-catch blocks, requiring the try keyword to mark calls that can fail.',
              points: [
                { term: 'throws functions', detail: 'A function marked throws can signal an error to its caller.' },
                { term: 'try keyword', detail: 'Calls to throwing functions must be prefixed with try.' },
                { term: 'do-catch', detail: 'A do block runs throwing code and catch handles any error.' },
                { term: 'try variants', detail: 'The optional-try and forced-try forms convert or assert errors.' },
              ],
            },
            example: "// try? converts to optional, try! force-unwraps\nlet isValid = try? validate(password: \"longpassword\")\n// isValid: Bool? = true",
          },
        ],
        children: [],
      },
      {
        id: 'swift-result-type',
        title: 'Result Type',
        level: 2,
        slug: 'result-type',
        concepts: [
          {
            id: 'swift-result-intro',
            code: "enum NetworkError: Error {\n  case badURL, timeout, noData\n}\n\nfunc fetchData(from url: String) -> Result<Data, NetworkError> {\n  guard url.hasPrefix(\"https\") else {\n    return .failure(.badURL)\n  }\n  return .success(Data())\n}\n\nswitch fetchData(from: \"https://api.example.com\") {\ncase .success(let data):\n  print(\"Got \\(data.count) bytes\")\ncase .failure(let error):\n  print(\"Failed: \\(error)\")\n}",
            note: '`Result<Success, Failure>` encapsulates either a success value or a typed error. Useful for async callbacks and when you want to delay error handling.',
            explanation: {
              heading: 'The Result type',
              intro: 'The Result type explicitly represents either a success value or a failure error, useful for capturing outcomes without throwing.',
              points: [
                { term: 'success or failure', detail: 'A Result is a success case with a value or a failure case with an error.' },
                { term: 'Typed error', detail: 'The error type is part of the Result\'s type.' },
                { term: 'Common in callbacks', detail: 'It cleanly conveys outcomes in asynchronous completion handlers.' },
                { term: 'get method', detail: 'Calling get returns the value or throws the contained error.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 13. Property Wrappers ─────────────────────────────────────────
  {
    id: 'swift-property-wrappers',
    title: 'Property Wrappers',
    level: 1,
    slug: 'property-wrappers',
    concepts: [],
    children: [
      {
        id: 'swift-property-wrapper-basics',
        title: 'Creating Property Wrappers',
        level: 2,
        slug: 'property-wrapper-basics',
        concepts: [
          {
            id: 'swift-prop-wrapper-intro',
            code: "@propertyWrapper\nstruct Clamped {\n  var wrappedValue: Int {\n    didSet { wrappedValue = min(max(wrappedValue, range.lowerBound), range.upperBound) }\n  }\n  let range: ClosedRange<Int>\n\n  init(wrappedValue: Int, _ range: ClosedRange<Int>) {\n    self.range = range\n    self.wrappedValue = min(max(wrappedValue, range.lowerBound), range.upperBound)\n  }\n}\n\nstruct Player {\n  @Clamped(0...100) var health = 100\n  @Clamped(0...999) var score = 0\n}\n\nvar player = Player()\nplayer.health = 150\nprint(player.health) // 100 (clamped)",
            note: 'Property wrappers encapsulate getter/setter logic in a reusable type. Annotate with `@propertyWrapper` and provide a `wrappedValue` property. Apply with `@WrapperName` on properties.',
            explanation: {
              heading: 'Property wrappers',
              intro: 'A property wrapper factors out reusable logic for how a property is stored or accessed, applied with an at-sign attribute.',
              points: [
                { term: 'Reusable behavior', detail: 'It packages get and set logic that many properties can share.' },
                { term: 'wrappedValue', detail: 'The wrapper exposes the underlying value through a wrapped-value property.' },
                { term: 'Attribute syntax', detail: 'You apply a wrapper by prefixing the property with an at-sign name.' },
                { term: 'Common in frameworks', detail: 'Frameworks use them for state, storage, and dependency features.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'swift-property-wrapper-projected',
        title: 'Projected Values',
        level: 2,
        slug: 'projected-values',
        concepts: [
          {
            id: 'swift-projected-value',
            code: "@propertyWrapper\nstruct UserDefault<T> {\n  let key: String\n  let defaultValue: T\n\n  var wrappedValue: T {\n    get { UserDefaults.standard.object(forKey: key) as? T ?? defaultValue }\n    set { UserDefaults.standard.set(newValue, forKey: key) }\n  }\n\n  var projectedValue: String { key }\n}\n\nstruct Settings {\n  @UserDefault(key: \"theme\", defaultValue: \"light\")\n  var theme: String\n}\n\nvar settings = Settings()\nprint(settings.$theme) // \"theme\" — the projected value (key name)",
            note: 'Property wrappers can expose a `projectedValue` accessed via `$property`. SwiftUI uses this pattern extensively (`$binding` for two-way data binding).',
            explanation: {
              heading: 'Projected values',
              intro: 'A property wrapper can expose a projected value, accessed with a dollar-sign prefix, offering an extra interface alongside the wrapped value.',
              points: [
                { term: 'Dollar-sign access', detail: 'A dollar prefix on the property name reaches the projected value.' },
                { term: 'Secondary interface', detail: 'It provides additional functionality beyond the plain value.' },
                { term: 'projectedValue', detail: 'The wrapper defines a projected-value property to enable this.' },
                { term: 'Framework bindings', detail: 'User-interface frameworks often project bindings this way.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 14. Subscripts ────────────────────────────────────────────────
  {
    id: 'swift-subscripts',
    title: 'Subscripts',
    level: 1,
    slug: 'subscripts',
    concepts: [],
    children: [
      {
        id: 'swift-subscript-basics',
        title: 'Custom Subscripts',
        level: 2,
        slug: 'subscript-basics',
        concepts: [
          {
            id: 'swift-subscript-intro',
            code: "struct Matrix {\n  let rows: Int, columns: Int\n  private var grid: [Double]\n\n  init(rows: Int, columns: Int) {\n    self.rows = rows\n    self.columns = columns\n    grid = Array(repeating: 0.0, count: rows * columns)\n  }\n\n  subscript(row: Int, col: Int) -> Double {\n    get {\n      precondition(row >= 0 && row < rows && col >= 0 && col < columns)\n      return grid[row * columns + col]\n    }\n    set {\n      precondition(row >= 0 && row < rows && col >= 0 && col < columns)\n      grid[row * columns + col] = newValue\n    }\n  }\n}\n\nvar matrix = Matrix(rows: 3, columns: 3)\nmatrix[0, 1] = 5.0\nmatrix[2, 2] = 9.0",
            note: 'Subscripts provide shorthand access to elements of a collection, list, or sequence. Define with `subscript` keyword. They can take multiple parameters and be read-write or read-only.',
            explanation: {
              heading: 'Subscripts',
              intro: 'A subscript lets you access a type\'s elements with bracket syntax, defining custom indexing for your own types.',
              points: [
                { term: 'subscript keyword', detail: 'The subscript keyword defines bracket-based access.' },
                { term: 'Custom indexing', detail: 'You choose the parameter types used inside the brackets.' },
                { term: 'Get and set', detail: 'A subscript can be read-only or support assignment.' },
                { term: 'Multiple parameters', detail: 'A subscript may take several parameters, as for a grid.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'swift-subscript-static',
        title: 'Type Subscripts',
        level: 2,
        slug: 'type-subscripts',
        concepts: [
          {
            id: 'swift-static-subscript',
            code: "enum Setting {\n  static var store: [String: Any] = [:]\n\n  static subscript(key: String) -> Any? {\n    get { store[key] }\n    set { store[key] = newValue }\n  }\n}\n\nSetting[\"darkMode\"] = true\nSetting[\"fontSize\"] = 14\nprint(Setting[\"darkMode\"] as? Bool ?? false) // true",
            note: 'Type subscripts (using `static`) are called on the type itself rather than an instance. Useful for type-level lookup patterns.',
            explanation: {
              heading: 'Type subscripts',
              intro: 'A static subscript is called on the type itself rather than an instance, providing type-level indexed access.',
              points: [
                { term: 'static keyword', detail: 'Marking a subscript static ties it to the type rather than instances.' },
                { term: 'Called on the type', detail: 'You use bracket syntax on the type name directly.' },
                { term: 'Type-level access', detail: 'It suits lookups that belong to the type as a whole.' },
                { term: 'class variant', detail: 'A class subscript allows subclasses to override it.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 15. Access Control ────────────────────────────────────────────
  {
    id: 'swift-access-control',
    title: 'Access Control',
    level: 1,
    slug: 'access-control',
    concepts: [],
    children: [
      {
        id: 'swift-access-levels',
        title: 'Access Levels',
        level: 2,
        slug: 'access-levels',
        concepts: [
          {
            id: 'swift-access-intro',
            code: "// open: accessible & subclassable from any module\nopen class BasePlugin {\n  open func execute() { }\n}\n\n// public: accessible from any module, not subclassable outside\npublic struct APIResponse {\n  public let status: Int\n  public let body: Data\n}\n\n// internal (default): accessible within the same module\nclass DataManager {\n  var cache: [String: Data] = [:]\n}\n\n// fileprivate: accessible within the same file\nfileprivate func helperFunction() { }\n\n// private: accessible within the enclosing declaration\nclass BankAccount {\n  private var balance: Double = 0\n  private(set) var transactionCount = 0\n\n  func deposit(_ amount: Double) {\n    balance += amount\n    transactionCount += 1\n  }\n}",
            note: 'Swift has 5 access levels: `open` > `public` > `internal` > `fileprivate` > `private`. Default is `internal`. Use `private(set)` to make a property publicly readable but privately writable.',
            explanation: {
              heading: 'Access control',
              intro: 'Swift access levels restrict where code can be used, from open across modules down to private within a single declaration.',
              points: [
                { term: 'Level range', detail: 'Levels span open, public, internal, fileprivate, and private.' },
                { term: 'Internal default', detail: 'Without a modifier, entities default to internal within the module.' },
                { term: 'private and fileprivate', detail: 'These limit access to a declaration or a source file respectively.' },
                { term: 'open for subclassing', detail: 'The open level additionally allows overriding across modules.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 16. Collections: Array ────────────────────────────────────────
  {
    id: 'swift-arrays',
    title: 'Arrays',
    level: 1,
    slug: 'arrays',
    concepts: [],
    children: [
      {
        id: 'swift-array-basics',
        title: 'Array Operations',
        level: 2,
        slug: 'array-operations',
        concepts: [
          {
            id: 'swift-array-ops',
            code: "var numbers = [1, 2, 3, 4, 5]\nnumbers.append(6)\nnumbers.insert(0, at: 0)\nnumbers.remove(at: 0)\n\n// Functional transforms\nlet doubled = numbers.map { $0 * 2 }\nlet evens = numbers.filter { $0 % 2 == 0 }\nlet sum = numbers.reduce(0, +)\n\n// Sorting\nlet sorted = numbers.sorted()\nlet descending = numbers.sorted(by: >)\n\n// Slicing\nlet first3 = numbers.prefix(3)\nlet last2 = numbers.suffix(2)",
            note: 'Swift arrays are ordered collections of the same type. They offer rich functional methods (`map`, `filter`, `reduce`, `compactMap`, `flatMap`) and support value semantics via copy-on-write.',
            explanation: {
              heading: 'Arrays',
              intro: 'A Swift array is an ordered value-type collection of same-typed elements with convenient methods for adding and removing items.',
              points: [
                { term: 'Ordered and typed', detail: 'Elements keep their order and share a single element type.' },
                { term: 'Value type', detail: 'Arrays are copied on assignment, so copies are independent.' },
                { term: 'append and remove', detail: 'Methods add or remove elements and adjust the array\'s size.' },
                { term: 'Bounds checking', detail: 'Indexing out of range traps at runtime rather than reading garbage.' },
              ],
            },
            example: "// compactMap removes nils after transform\nlet strings = [\"1\", \"two\", \"3\"]\nlet ints = strings.compactMap { Int($0) } // [1, 3]",
          },
        ],
        children: [],
      },
      {
        id: 'swift-array-higher-order',
        title: 'Higher-Order Array Methods',
        level: 2,
        slug: 'array-higher-order',
        concepts: [
          {
            id: 'swift-array-higher',
            code: "struct Task {\n  let title: String\n  let priority: Int\n  let isComplete: Bool\n}\n\nlet tasks = [\n  Task(title: \"Ship feature\", priority: 1, isComplete: false),\n  Task(title: \"Write tests\", priority: 2, isComplete: true),\n  Task(title: \"Code review\", priority: 1, isComplete: false),\n]\n\n// first(where:) and contains(where:)\nlet urgent = tasks.first { $0.priority == 1 && !$0.isComplete }\nlet hasComplete = tasks.contains { $0.isComplete }\n\n// grouped by property (Dictionary grouping)\nlet byPriority = Dictionary(grouping: tasks) { $0.priority }",
            note: '`first(where:)` finds the first match, `contains(where:)` checks existence. Use `Dictionary(grouping:by:)` to bucket array elements by a key.',
            explanation: {
              heading: 'Higher-order array methods',
              intro: 'Arrays provide functional methods like map, filter, and reduce to transform, select, and aggregate elements declaratively.',
              points: [
                { term: 'map transforms', detail: 'map returns a new array with each element transformed.' },
                { term: 'filter selects', detail: 'filter keeps only elements that satisfy a condition.' },
                { term: 'reduce aggregates', detail: 'reduce combines all elements into a single value.' },
                { term: 'compactMap', detail: 'compactMap transforms and drops nil results in one step.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 17. Collections: Dictionary ───────────────────────────────────
  {
    id: 'swift-dictionaries',
    title: 'Dictionaries',
    level: 1,
    slug: 'dictionaries',
    concepts: [],
    children: [
      {
        id: 'swift-dict-basics',
        title: 'Dictionary Operations',
        level: 2,
        slug: 'dictionary-operations',
        concepts: [
          {
            id: 'swift-dict-ops',
            code: "var scores: [String: Int] = [\n  \"Alice\": 95,\n  \"Bob\": 87,\n  \"Charlie\": 92\n]\n\n// Access (returns optional)\nlet aliceScore = scores[\"Alice\"] // Optional(95)\nlet unknown = scores[\"Dave\"]     // nil\n\n// Default value\nlet daveScore = scores[\"Dave\", default: 0] // 0\n\n// Mutation\nscores[\"Dave\"] = 88\nscores.removeValue(forKey: \"Bob\")\n\n// Iteration\nfor (name, score) in scores {\n  print(\"\\(name): \\(score)\")\n}\n\n// Transform values\nlet curved = scores.mapValues { $0 + 5 }",
            note: 'Dictionaries are unordered key-value collections. Keys must conform to `Hashable`. Subscript access returns an optional. Use `default:` parameter to avoid nil.',
            explanation: {
              heading: 'Dictionaries',
              intro: 'A dictionary stores key-value pairs with fast lookup by key, and accessing a key returns an optional to reflect possible absence.',
              points: [
                { term: 'Key-value pairs', detail: 'Each unique key maps to one value.' },
                { term: 'Optional lookup', detail: 'Reading a key yields an optional that is nil when the key is absent.' },
                { term: 'Unordered', detail: 'Dictionary entries have no guaranteed order.' },
                { term: 'Value type', detail: 'Dictionaries are copied on assignment like other Swift collections.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'swift-dict-merge',
        title: 'Merging & Transforming',
        level: 2,
        slug: 'dictionary-merging',
        concepts: [
          {
            id: 'swift-dict-merge-intro',
            code: "var inventory = [\"apples\": 5, \"bananas\": 3]\nlet newStock = [\"bananas\": 7, \"oranges\": 4]\n\n// Merge with conflict resolution\ninventory.merge(newStock) { current, new in\n  current + new\n}\n// [\"apples\": 5, \"bananas\": 10, \"oranges\": 4]\n\n// Create dictionary from sequence\nlet words = [\"hello\", \"world\", \"hello\", \"swift\"]\nlet frequency = Dictionary(words.map { ($0, 1) }, uniquingKeysWith: +)\n// [\"hello\": 2, \"world\": 1, \"swift\": 1]",
            note: '`merge` combines two dictionaries with a closure to resolve key conflicts. `init(uniquingKeysWith:)` builds a dictionary from key-value pairs, combining duplicate keys.',
            explanation: {
              heading: 'Merging dictionaries',
              intro: 'The merge methods combine dictionaries, using a closure to resolve what happens when both contain the same key.',
              points: [
                { term: 'Combine dictionaries', detail: 'Merging adds entries from another dictionary into this one.' },
                { term: 'Conflict closure', detail: 'A closure decides which value wins when keys collide.' },
                { term: 'merging returns new', detail: 'The merging variant produces a new dictionary rather than mutating.' },
                { term: 'Default handling', detail: 'A common closure keeps either the current or incoming value.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 18. Collections: Set ──────────────────────────────────────────
  {
    id: 'swift-sets',
    title: 'Sets',
    level: 1,
    slug: 'sets',
    concepts: [],
    children: [
      {
        id: 'swift-set-basics',
        title: 'Set Operations',
        level: 2,
        slug: 'set-operations',
        concepts: [
          {
            id: 'swift-set-ops',
            code: "var langs: Set<String> = [\"Swift\", \"Rust\", \"Go\", \"Swift\"]\nprint(langs.count) // 3 — duplicates removed\n\nlangs.insert(\"Python\")\nlangs.remove(\"Go\")\nlangs.contains(\"Swift\") // true\n\nlet frontend: Set = [\"JS\", \"TS\", \"Swift\"]\nlet backend: Set = [\"Go\", \"Rust\", \"Swift\"]\n\nlet both = frontend.intersection(backend)      // {\"Swift\"}\nlet all = frontend.union(backend)              // all languages\nlet onlyFrontend = frontend.subtracting(backend) // {\"JS\", \"TS\"}\nlet exclusive = frontend.symmetricDifference(backend)",
            note: 'Sets store unique values with no defined order. Elements must be `Hashable`. Sets excel at membership tests (O(1)) and set algebra operations (intersection, union, subtracting).',
            explanation: {
              heading: 'Sets',
              intro: 'A set stores unique unordered elements and supports mathematical operations like union, intersection, and difference.',
              points: [
                { term: 'Unique elements', detail: 'A set never contains duplicate values.' },
                { term: 'Fast membership', detail: 'Checking whether an element is present is efficient.' },
                { term: 'Set algebra', detail: 'Union, intersection, and difference combine sets mathematically.' },
                { term: 'Hashable required', detail: 'Elements must conform to the hashable protocol.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 19. Strings ───────────────────────────────────────────────────
  {
    id: 'swift-strings',
    title: 'Strings',
    level: 1,
    slug: 'strings',
    concepts: [],
    children: [
      {
        id: 'swift-string-basics',
        title: 'String Operations',
        level: 2,
        slug: 'string-operations',
        concepts: [
          {
            id: 'swift-string-ops',
            code: "let greeting = \"Hello, Swift!\"\nlet multiline = \"\"\"\n  This is a\n  multiline string\n  \"\"\"\n\n// String interpolation\nlet name = \"World\"\nlet message = \"Hello, \\(name)! 2+2=\\(2+2)\"\n\n// String manipulation\nlet upper = greeting.uppercased()\nlet contains = greeting.contains(\"Swift\") // true\nlet replaced = greeting.replacingOccurrences(of: \"Swift\", with: \"World\")\n\n// Prefix and suffix\ngreeting.hasPrefix(\"Hello\")  // true\ngreeting.hasSuffix(\"!\")      // true",
            note: 'Swift strings are Unicode-correct and value types. Use `\"\"\"` for multiline strings. String interpolation with `\\()` embeds expressions. Strings are Collections of Characters.',
            explanation: {
              heading: 'Strings',
              intro: 'Swift strings are Unicode-correct value types, and interpolation embeds expressions directly inside string literals.',
              points: [
                { term: 'Unicode correct', detail: 'Strings handle full Unicode grapheme clusters as single characters.' },
                { term: 'Interpolation', detail: 'A backslash and parentheses insert an expression into a literal.' },
                { term: 'Value type', detail: 'Strings are copied on assignment like other value types.' },
                { term: 'Multi-line literals', detail: 'Triple-quoted strings span several lines cleanly.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'swift-string-indices',
        title: 'String Indices & Substrings',
        level: 2,
        slug: 'string-indices',
        concepts: [
          {
            id: 'swift-string-index',
            code: "let text = \"Hello, Swift\"\n\n// Strings use String.Index, not integers\nlet start = text.startIndex\nlet fifth = text.index(start, offsetBy: 5)\nlet char = text[fifth] // \",\"\n\n// Substring (shares storage with original)\nlet firstWord = text.prefix(5)          // \"Hello\"\nlet range = text.startIndex..<fifth\nlet sub = text[range]                    // \"Hello\"\n\n// Convert Substring to String for long-term storage\nlet permanent = String(firstWord)\n\n// Split\nlet parts = text.split(separator: \",\") // [\"Hello\", \" Swift\"]",
            note: 'Swift strings do not use integer indexing because characters have variable byte widths (Unicode). Use `String.Index` for safe traversal. Substrings are views — convert to `String` for independent storage.',
            explanation: {
              heading: 'String indices',
              intro: 'Because characters vary in size, Swift strings use opaque indices rather than integers to navigate their contents safely.',
              points: [
                { term: 'Opaque indices', detail: 'String positions use a special index type, not plain integers.' },
                { term: 'startIndex and endIndex', detail: 'These mark the beginning and the position past the last character.' },
                { term: 'Move with methods', detail: 'You advance an index using functions rather than arithmetic.' },
                { term: 'Unicode safety', detail: 'This design keeps indexing correct across multi-byte characters.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 20. Pattern Matching ──────────────────────────────────────────
  {
    id: 'swift-pattern-matching',
    title: 'Pattern Matching',
    level: 1,
    slug: 'pattern-matching',
    concepts: [],
    children: [
      {
        id: 'swift-switch-patterns',
        title: 'Switch Patterns',
        level: 2,
        slug: 'switch-patterns',
        concepts: [
          {
            id: 'swift-pattern-switch',
            code: "let point = (x: 3, y: -2)\n\nswitch point {\ncase (0, 0):\n  print(\"Origin\")\ncase (let x, 0):\n  print(\"On x-axis at \\(x)\")\ncase (0, let y):\n  print(\"On y-axis at \\(y)\")\ncase let (x, y) where x == y:\n  print(\"On diagonal\")\ncase let (x, y):\n  print(\"Somewhere at (\\(x), \\(y))\")\n}\n\n// Range matching\nlet score = 85\nswitch score {\ncase 90...100: print(\"A\")\ncase 80..<90:  print(\"B\")\ncase 70..<80:  print(\"C\")\ndefault:       print(\"F\")\n}",
            note: 'Swift pattern matching goes beyond simple equality. Match tuples, bind values with `let`, add conditions with `where`, and match ranges. Every switch must be exhaustive.',
            explanation: {
              heading: 'Pattern matching in switch',
              intro: 'Swift\'s switch supports rich pattern matching, including value binding, tuple matching, and where clauses for extra conditions.',
              points: [
                { term: 'Value binding', detail: 'A case can bind the matched value to a name for use in its body.' },
                { term: 'Tuple patterns', detail: 'A switch can match multiple values by switching on a tuple.' },
                { term: 'where conditions', detail: 'A where clause adds a boolean test to a case.' },
                { term: 'Ranges', detail: 'Cases can match numeric ranges directly.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'swift-if-case',
        title: 'if-case & for-case',
        level: 2,
        slug: 'if-case',
        concepts: [
          {
            id: 'swift-case-patterns',
            code: "enum Media {\n  case movie(title: String, year: Int)\n  case song(title: String, artist: String)\n  case podcast(title: String, episode: Int)\n}\n\nlet library: [Media] = [\n  .movie(title: \"Inception\", year: 2010),\n  .song(title: \"Imagine\", artist: \"Lennon\"),\n  .movie(title: \"Dune\", year: 2021),\n]\n\n// if case for single-pattern matching\nif case .movie(let title, let year) = library[0] {\n  print(\"\\(title) (\\(year))\")\n}\n\n// for case to filter in loops\nfor case .movie(let title, let year) in library {\n  print(\"Movie: \\(title) (\\(year))\")\n}",
            note: '`if case` and `for case` bring pattern matching outside of switch statements. Use them to extract associated values from a single enum case or to filter collections by pattern.',
            explanation: {
              heading: 'Case patterns',
              intro: 'The case keyword can match patterns outside a switch, enabling optional pattern matching in if, guard, and for statements.',
              points: [
                { term: 'if case', detail: 'An if-case tests whether a value matches a specific pattern.' },
                { term: 'for case', detail: 'A for-case iterates only over elements matching a pattern.' },
                { term: 'Enum extraction', detail: 'It cleanly extracts associated values from a single enum case.' },
                { term: 'Concise checks', detail: 'It avoids a full switch when you care about one pattern.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 21. Async/Await ───────────────────────────────────────────────
  {
    id: 'swift-async-await',
    title: 'Async/Await',
    level: 1,
    slug: 'async-await',
    concepts: [],
    children: [
      {
        id: 'swift-async-functions',
        title: 'Async Functions',
        level: 2,
        slug: 'async-functions',
        concepts: [
          {
            id: 'swift-async-intro',
            code: "func fetchUser(id: Int) async throws -> User {\n  let url = URL(string: \"https://api.example.com/users/\\(id)\")!\n  let (data, response) = try await URLSession.shared.data(from: url)\n\n  guard let http = response as? HTTPURLResponse,\n        http.statusCode == 200 else {\n    throw NetworkError.badResponse\n  }\n\n  return try JSONDecoder().decode(User.self, from: data)\n}\n\n// Calling async from synchronous context\nTask {\n  do {\n    let user = try await fetchUser(id: 42)\n    print(user.name)\n  } catch {\n    print(\"Failed: \\(error)\")\n  }\n}",
            note: 'Mark functions `async` to suspend execution at `await` points without blocking threads. Combine with `throws` for failable async work. Use `Task { }` to bridge from synchronous to async contexts.',
            explanation: {
              heading: 'Async and await',
              intro: 'Swift concurrency marks asynchronous functions with async and suspends at await points, letting code that waits read sequentially.',
              points: [
                { term: 'async functions', detail: 'The async keyword marks a function that can suspend.' },
                { term: 'await points', detail: 'The await keyword marks where execution may pause for a result.' },
                { term: 'Non-blocking', detail: 'Suspension frees the thread instead of blocking it.' },
                { term: 'Sequential style', detail: 'Asynchronous code reads like ordinary sequential steps.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'swift-async-sequences',
        title: 'AsyncSequence',
        level: 2,
        slug: 'async-sequences',
        concepts: [
          {
            id: 'swift-async-seq',
            code: "// Consuming an AsyncSequence\nlet url = URL(string: \"https://example.com/stream\")!\nfor try await line in url.lines {\n  print(line)\n}\n\n// Custom AsyncStream\nfunc countdown(from n: Int) -> AsyncStream<Int> {\n  AsyncStream { continuation in\n    for i in stride(from: n, through: 1, by: -1) {\n      continuation.yield(i)\n      try? await Task.sleep(nanoseconds: 1_000_000_000)\n    }\n    continuation.finish()\n  }\n}\n\nfor await count in countdown(from: 5) {\n  print(count)\n}",
            note: '`AsyncSequence` produces values over time. Use `for await` to consume them. `AsyncStream` bridges callback or delegate-based APIs into the async/await world.',
            explanation: {
              heading: 'Async sequences',
              intro: 'An async sequence yields values over time asynchronously, iterated with a for-await-in loop that suspends between elements.',
              points: [
                { term: 'Values over time', detail: 'An async sequence produces elements as they become available.' },
                { term: 'for await', detail: 'A for-await-in loop consumes the sequence, suspending between elements.' },
                { term: 'Can throw', detail: 'Iteration may need try when the sequence can fail.' },
                { term: 'Streaming', detail: 'It suits streams such as network events or file lines.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 22. Actors ────────────────────────────────────────────────────
  {
    id: 'swift-actors',
    title: 'Actors',
    level: 1,
    slug: 'actors',
    concepts: [],
    children: [
      {
        id: 'swift-actor-basics',
        title: 'Actor Isolation',
        level: 2,
        slug: 'actor-isolation',
        concepts: [
          {
            id: 'swift-actor-intro',
            code: "actor BankAccount {\n  let owner: String\n  private var balance: Double\n\n  init(owner: String, balance: Double) {\n    self.owner = owner\n    self.balance = balance\n  }\n\n  func deposit(_ amount: Double) {\n    balance += amount\n  }\n\n  func withdraw(_ amount: Double) throws -> Double {\n    guard balance >= amount else {\n      throw BankError.insufficientFunds\n    }\n    balance -= amount\n    return amount\n  }\n\n  var currentBalance: Double { balance }\n}\n\n// Accessing actor state requires await\nlet account = BankAccount(owner: \"Alice\", balance: 1000)\nawait account.deposit(500)\nlet balance = await account.currentBalance",
            note: 'Actors protect mutable state from data races. Only one task accesses an actor\'s mutable state at a time. External access requires `await` to suspend until the actor is available.',
            explanation: {
              heading: 'Actors',
              intro: 'An actor protects its mutable state by serializing access, preventing data races in concurrent code through isolation.',
              points: [
                { term: 'State isolation', detail: 'An actor allows only one task to access its state at a time.' },
                { term: 'await to access', detail: 'Reaching an actor\'s members from outside requires await.' },
                { term: 'Prevents data races', detail: 'Serialized access removes a major class of concurrency bugs.' },
                { term: 'Reference type', detail: 'Actors are reference types like classes but with isolation guarantees.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'swift-global-actor',
        title: '@MainActor',
        level: 2,
        slug: 'main-actor',
        concepts: [
          {
            id: 'swift-main-actor-intro',
            code: "@MainActor\nclass ViewModel: ObservableObject {\n  @Published var items: [String] = []\n  @Published var isLoading = false\n\n  func loadItems() async {\n    isLoading = true\n    defer { isLoading = false }\n\n    do {\n      items = try await fetchItemsFromAPI()\n    } catch {\n      print(\"Error: \\(error)\")\n    }\n  }\n}\n\n// Explicitly hop to main actor\nfunc updateUI() async {\n  let data = await fetchData()\n  await MainActor.run {\n    label.text = data.title\n  }\n}",
            note: '`@MainActor` ensures code runs on the main thread — essential for UI updates. Apply to classes, methods, or closures. Use `MainActor.run` for one-off main-thread hops.',
            explanation: {
              heading: 'The main actor',
              intro: 'The main actor ties work to the main thread, which is essential for updating the user interface safely from concurrent code.',
              points: [
                { term: 'Main-thread work', detail: 'Code annotated for the main actor runs on the main thread.' },
                { term: 'UI safety', detail: 'User-interface updates must occur on the main actor.' },
                { term: 'Annotation', detail: 'An at-sign attribute marks types or functions as main-actor bound.' },
                { term: 'Hops as needed', detail: 'Calling into the main actor may suspend to switch execution.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 23. Structured Concurrency ───────────────────────────────────
  {
    id: 'swift-concurrency',
    title: 'Structured Concurrency',
    level: 1,
    slug: 'concurrency',
    concepts: [],
    children: [
      {
        id: 'swift-task-groups',
        title: 'Task Groups',
        level: 2,
        slug: 'task-groups',
        concepts: [
          {
            id: 'swift-task-group-intro',
            code: "func fetchAllUsers(ids: [Int]) async throws -> [User] {\n  try await withThrowingTaskGroup(of: User.self) { group in\n    for id in ids {\n      group.addTask {\n        try await fetchUser(id: id)\n      }\n    }\n\n    var users: [User] = []\n    for try await user in group {\n      users.append(user)\n    }\n    return users\n  }\n}\n\n// async let for fixed concurrency\nfunc loadDashboard() async throws -> Dashboard {\n  async let profile = fetchProfile()\n  async let posts = fetchPosts()\n  async let notifications = fetchNotifications()\n\n  return try await Dashboard(\n    profile: profile,\n    posts: posts,\n    notifications: notifications\n  )\n}",
            note: '`withTaskGroup` runs dynamic numbers of concurrent tasks. `async let` runs a fixed number in parallel. Both are structured — child tasks cannot outlive their parent scope.',
            explanation: {
              heading: 'Task groups',
              intro: 'A task group runs several child tasks concurrently and gathers their results, all within structured concurrency guarantees.',
              points: [
                { term: 'Concurrent children', detail: 'A group spawns multiple tasks that run at the same time.' },
                { term: 'Collect results', detail: 'You iterate the group to gather each child\'s result.' },
                { term: 'Structured', detail: 'The group waits for all children before it completes.' },
                { term: 'Automatic cancellation', detail: 'Cancelling the group cancels its outstanding child tasks.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'swift-task-cancellation',
        title: 'Cancellation & Priorities',
        level: 2,
        slug: 'task-cancellation',
        concepts: [
          {
            id: 'swift-cancellation',
            code: "func processItems(_ items: [Item]) async throws {\n  for item in items {\n    // Check for cancellation cooperatively\n    try Task.checkCancellation()\n\n    // Or check the flag manually\n    if Task.isCancelled {\n      // Perform cleanup\n      break\n    }\n\n    await process(item)\n  }\n}\n\n// Creating and cancelling tasks\nlet task = Task(priority: .userInitiated) {\n  try await processItems(largeList)\n}\n\n// Later...\ntask.cancel()",
            note: 'Tasks support cooperative cancellation — they are not forcefully stopped. Check `Task.isCancelled` or call `Task.checkCancellation()` at suspension points. Set priority with `.userInitiated`, `.utility`, `.background`.',
            explanation: {
              heading: 'Task cancellation',
              intro: 'Swift concurrency uses cooperative cancellation, where tasks check for cancellation and stop work rather than being forcibly killed.',
              points: [
                { term: 'Cooperative', detail: 'A task must check for cancellation to respond to it.' },
                { term: 'Check the flag', detail: 'Code can inspect whether the current task has been cancelled.' },
                { term: 'Throwing check', detail: 'A cancellation check can throw to abort a throwing operation.' },
                { term: 'Propagates', detail: 'Cancelling a parent task propagates to its children.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 24. Opaque & Existential Types ────────────────────────────────
  {
    id: 'swift-opaque-types',
    title: 'Opaque & Existential Types',
    level: 1,
    slug: 'opaque-types',
    concepts: [],
    children: [
      {
        id: 'swift-some-any',
        title: 'some vs any',
        level: 2,
        slug: 'some-any',
        concepts: [
          {
            id: 'swift-some-any-intro',
            code: "protocol Shape {\n  func area() -> Double\n}\n\nstruct Circle: Shape {\n  let radius: Double\n  func area() -> Double { .pi * radius * radius }\n}\n\nstruct Square: Shape {\n  let side: Double\n  func area() -> Double { side * side }\n}\n\n// `some` — opaque type: caller doesn't know the concrete type\nfunc makeShape() -> some Shape {\n  Circle(radius: 5) // always returns the same concrete type\n}\n\n// `any` — existential type: can hold any conforming type\nfunc collectShapes() -> [any Shape] {\n  [Circle(radius: 3), Square(side: 4)]\n}\n\n// Primary associated type constraints (Swift 5.7+)\nfunc process(items: some Collection<Int>) -> Int {\n  items.reduce(0, +)\n}",
            note: '`some` (opaque types) hides the concrete type but preserves type identity — the compiler knows the underlying type. `any` (existential) erases type info, allowing heterogeneous collections at a performance cost.',
            explanation: {
              heading: 'some and any',
              intro: 'The some keyword denotes an opaque type hiding a single concrete conformer, while any denotes a boxed existential that can hold different conformers.',
              points: [
                { term: 'some is opaque', detail: 'It hides the concrete type while guaranteeing one specific type.' },
                { term: 'any is existential', detail: 'It boxes any conforming type and can vary at runtime.' },
                { term: 'Performance difference', detail: 'Opaque types avoid the boxing overhead of existentials.' },
                { term: 'Choose by need', detail: 'Use some for a fixed hidden type and any for heterogeneous values.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 25. Memory Management (ARC) ──────────────────────────────────
  {
    id: 'swift-memory',
    title: 'Memory Management (ARC)',
    level: 1,
    slug: 'memory-management',
    concepts: [],
    children: [
      {
        id: 'swift-arc-basics',
        title: 'Strong, Weak & Unowned',
        level: 2,
        slug: 'arc-basics',
        concepts: [
          {
            id: 'swift-arc-intro',
            code: "class Person {\n  let name: String\n  var apartment: Apartment?\n  init(name: String) { self.name = name }\n  deinit { print(\"\\(name) deinitialized\") }\n}\n\nclass Apartment {\n  let unit: String\n  weak var tenant: Person? // break retain cycle\n  init(unit: String) { self.unit = unit }\n  deinit { print(\"Apartment \\(unit) deinitialized\") }\n}\n\nvar alice: Person? = Person(name: \"Alice\")\nvar apt: Apartment? = Apartment(unit: \"4A\")\nalice?.apartment = apt\napt?.tenant = alice\n\nalice = nil // Person deinitialized (weak breaks cycle)\napt = nil   // Apartment deinitialized",
            note: 'ARC (Automatic Reference Counting) manages memory for class instances. Strong references keep objects alive. Use `weak` (optional, nil when deallocated) or `unowned` (non-optional, crashes if accessed after deallocation) to break retain cycles.',
            explanation: {
              heading: 'Automatic reference counting',
              intro: 'Swift manages class memory with automatic reference counting, freeing an instance when the last strong reference to it goes away.',
              points: [
                { term: 'Counts references', detail: 'Each strong reference increases an instance\'s reference count.' },
                { term: 'Freed at zero', detail: 'The instance is deallocated when its count reaches zero.' },
                { term: 'Strong cycles leak', detail: 'Two objects strongly referencing each other never reach zero.' },
                { term: 'weak and unowned', detail: 'Weak and unowned references break cycles by not increasing the count.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 26. Codable & JSON ────────────────────────────────────────────
  {
    id: 'swift-codable',
    title: 'Codable & JSON',
    level: 1,
    slug: 'codable',
    concepts: [],
    children: [
      {
        id: 'swift-codable-basics',
        title: 'Encoding & Decoding',
        level: 2,
        slug: 'codable-basics',
        concepts: [
          {
            id: 'swift-codable-intro',
            code: "struct User: Codable {\n  let id: Int\n  let name: String\n  let email: String\n  let joinedAt: Date\n\n  enum CodingKeys: String, CodingKey {\n    case id, name, email\n    case joinedAt = \"joined_at\" // map snake_case JSON\n  }\n}\n\n// Encoding\nlet user = User(id: 1, name: \"Alice\", email: \"a@b.com\", joinedAt: Date())\nlet encoder = JSONEncoder()\nencoder.dateEncodingStrategy = .iso8601\nlet json = try encoder.encode(user)\n\n// Decoding\nlet decoder = JSONDecoder()\ndecoder.dateDecodingStrategy = .iso8601\nlet decoded = try decoder.decode(User.self, from: json)",
            note: 'Conform to `Codable` (combines `Encodable` and `Decodable`) for automatic JSON serialization. Use `CodingKeys` to customize key mapping. Configure date strategies on encoder/decoder.',
            explanation: {
              heading: 'Codable',
              intro: 'The Codable protocol lets types encode to and decode from formats like JSON automatically, based on their stored properties.',
              points: [
                { term: 'Encode and decode', detail: 'Codable combines the encodable and decodable capabilities.' },
                { term: 'Automatic synthesis', detail: 'The compiler generates the coding logic from the properties.' },
                { term: 'JSON support', detail: 'Standard encoders and decoders convert to and from JSON.' },
                { term: 'Custom keys', detail: 'A coding-keys enum maps property names to different serialized names.' },
              ],
            },
            example: "// Decoding arrays\nlet users = try decoder.decode([User].self, from: jsonArray)\n\n// Nested decoding with keyDecodingStrategy\ndecoder.keyDecodingStrategy = .convertFromSnakeCase",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 27. Protocols with Associated Types ───────────────────────────
  {
    id: 'swift-associated-types',
    title: 'Protocols with Associated Types',
    level: 1,
    slug: 'associated-types',
    concepts: [],
    children: [
      {
        id: 'swift-assoc-type-basics',
        title: 'Associated Types',
        level: 2,
        slug: 'associated-type-basics',
        concepts: [
          {
            id: 'swift-assoc-type-intro',
            code: "protocol Repository {\n  associatedtype Item: Identifiable\n  associatedtype ID\n\n  func find(by id: ID) async throws -> Item?\n  func save(_ item: Item) async throws\n  func delete(by id: ID) async throws\n  func all() async throws -> [Item]\n}\n\nstruct UserRepository: Repository {\n  typealias Item = User\n  typealias ID = Int\n\n  func find(by id: Int) async throws -> User? { /* ... */ nil }\n  func save(_ item: User) async throws { /* ... */ }\n  func delete(by id: Int) async throws { /* ... */ }\n  func all() async throws -> [User] { /* ... */ [] }\n}",
            note: 'Associated types are protocol-level generics — the conforming type fills in the concrete type. They enable strongly typed abstract interfaces. Cannot be used as existential types without `any`.',
            explanation: {
              heading: 'Associated types',
              intro: 'An associated type is a placeholder in a protocol that each conforming type fills in, making protocols generic over related types.',
              points: [
                { term: 'associatedtype keyword', detail: 'It declares a placeholder type inside a protocol.' },
                { term: 'Filled by conformer', detail: 'Each conforming type specifies the concrete associated type.' },
                { term: 'Generic protocols', detail: 'It lets a protocol abstract over an element or item type.' },
                { term: 'Inferred often', detail: 'The compiler can infer the associated type from the implementation.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'swift-assoc-type-constraints',
        title: 'Constraining Associated Types',
        level: 2,
        slug: 'associated-type-constraints',
        concepts: [
          {
            id: 'swift-assoc-constraint',
            code: "protocol DataStore {\n  associatedtype Key: Hashable\n  associatedtype Value: Codable\n\n  subscript(key: Key) -> Value? { get set }\n  var count: Int { get }\n}\n\n// Using where clause to constrain\nfunc syncStores<S1: DataStore, S2: DataStore>(\n  from source: S1,\n  to destination: inout S2\n) where S1.Key == S2.Key, S1.Value == S2.Value {\n  // Types are guaranteed compatible\n}",
            note: 'Constrain associated types to require protocol conformance. Use `where` clauses to express relationships between associated types of different generic parameters.',
            explanation: {
              heading: 'Constraining associated types',
              intro: 'Where clauses and constraints on associated types let a protocol require that its placeholder types themselves satisfy other protocols.',
              points: [
                { term: 'Protocol constraints', detail: 'An associated type can be required to conform to another protocol.' },
                { term: 'where refinement', detail: 'A where clause adds relationships between associated types.' },
                { term: 'Safer generics', detail: 'Constraints let the protocol rely on the placeholder\'s capabilities.' },
                { term: 'Primary associated types', detail: 'Recent Swift can name associated types in angle brackets for constraints.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 28. KeyPaths ──────────────────────────────────────────────────
  {
    id: 'swift-keypaths',
    title: 'Key Paths',
    level: 1,
    slug: 'keypaths',
    concepts: [],
    children: [
      {
        id: 'swift-keypath-basics',
        title: 'Using Key Paths',
        level: 2,
        slug: 'keypath-basics',
        concepts: [
          {
            id: 'swift-keypath-intro',
            code: "struct Employee {\n  var name: String\n  var department: String\n  var salary: Double\n}\n\nlet employees = [\n  Employee(name: \"Alice\", department: \"Eng\", salary: 120_000),\n  Employee(name: \"Bob\", department: \"Design\", salary: 95_000),\n  Employee(name: \"Charlie\", department: \"Eng\", salary: 110_000),\n]\n\n// Key path as argument\nlet names = employees.map(\\.name)\nlet totalSalary = employees.map(\\.salary).reduce(0, +)\n\n// Sorting with key paths\nlet sorted = employees.sorted(by: \\.salary)\n\n// Subscript with key path\nlet kp = \\Employee.department\nlet dept = employees[0][keyPath: kp] // \"Eng\"",
            note: 'Key paths (`\\.property`) are type-safe references to properties. Use them as shorthand in `map`, `sorted`, and `filter`, or store them as first-class values for dynamic property access.',
            explanation: {
              heading: 'Key paths',
              intro: 'A key path is a type-safe reference to a property that can be stored and passed around, then used to read or write that property later.',
              points: [
                { term: 'Backslash syntax', detail: 'A key path is written with a backslash and the property path.' },
                { term: 'Refers to a property', detail: 'It names a property without accessing it immediately.' },
                { term: 'Reusable', detail: 'You can store a key path and apply it to many instances.' },
                { term: 'Powers APIs', detail: 'Collection and framework methods accept key paths for concise access.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 29. Result Builders ───────────────────────────────────────────
  {
    id: 'swift-result-builders',
    title: 'Result Builders',
    level: 1,
    slug: 'result-builders',
    concepts: [],
    children: [
      {
        id: 'swift-result-builder-basics',
        title: 'Building DSLs',
        level: 2,
        slug: 'result-builder-basics',
        concepts: [
          {
            id: 'swift-result-builder-intro',
            code: "@resultBuilder\nstruct HTMLBuilder {\n  static func buildBlock(_ components: String...) -> String {\n    components.joined(separator: \"\\n\")\n  }\n  static func buildOptional(_ component: String?) -> String {\n    component ?? \"\"\n  }\n  static func buildEither(first component: String) -> String {\n    component\n  }\n  static func buildEither(second component: String) -> String {\n    component\n  }\n}\n\nfunc html(@HTMLBuilder content: () -> String) -> String {\n  \"<html>\\n\\(content())\\n</html>\"\n}\n\nlet page = html {\n  \"<head><title>Hello</title></head>\"\n  \"<body>\"\n  \"<p>Welcome to Swift!</p>\"\n  \"</body>\"\n}",
            note: 'Result builders (used by SwiftUI\'s `@ViewBuilder`) transform a series of statements into a single value. Define `buildBlock`, `buildOptional`, `buildEither` etc. to support conditionals and loops in DSL syntax.',
            explanation: {
              heading: 'Result builders',
              intro: 'Result builders transform a block of expressions into a single combined value, the mechanism behind declarative user-interface DSLs.',
              points: [
                { term: 'Combine expressions', detail: 'A builder collects the statements in a block into one result.' },
                { term: 'Attribute driven', detail: 'An at-sign attribute marks a parameter or function as using the builder.' },
                { term: 'Declarative DSLs', detail: 'They enable declarative syntax for building views and data.' },
                { term: 'Special methods', detail: 'The builder defines methods that assemble the block\'s parts.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 30. Sendable & Data Race Safety ───────────────────────────────
  {
    id: 'swift-sendable',
    title: 'Sendable & Data Race Safety',
    level: 1,
    slug: 'sendable',
    concepts: [],
    children: [
      {
        id: 'swift-sendable-basics',
        title: 'Sendable Protocol',
        level: 2,
        slug: 'sendable-basics',
        concepts: [
          {
            id: 'swift-sendable-intro',
            code: "// Value types are implicitly Sendable\nstruct Config: Sendable {\n  let apiKey: String\n  let timeout: TimeInterval\n}\n\n// Classes must be carefully made Sendable\nfinal class Logger: Sendable {\n  let label: String // only immutable stored properties\n  init(label: String) { self.label = label }\n}\n\n// @unchecked Sendable for types you manually protect\nclass ThreadSafeCache: @unchecked Sendable {\n  private let lock = NSLock()\n  private var store: [String: Any] = [:]\n\n  func set(_ key: String, value: Any) {\n    lock.lock()\n    defer { lock.unlock() }\n    store[key] = value\n  }\n}\n\n// Sendable closures\nfunc runOnBackground(_ work: @Sendable () async -> Void) {\n  Task.detached { await work() }\n}",
            note: '`Sendable` marks types safe to share across concurrency domains. Value types and immutable classes are naturally Sendable. Use `@unchecked Sendable` only when you guarantee thread safety manually.',
            explanation: {
              heading: 'Sendable',
              intro: 'The Sendable protocol marks types that are safe to share across concurrency boundaries, helping the compiler catch data races.',
              points: [
                { term: 'Safe to share', detail: 'A Sendable type can be passed between tasks and actors safely.' },
                { term: 'Compiler checked', detail: 'The compiler verifies that Sendable types cannot introduce data races.' },
                { term: 'Value types often qualify', detail: 'Immutable value types with Sendable members conform naturally.' },
                { term: 'Closures too', detail: 'A sending closure must capture only Sendable values.' },
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
