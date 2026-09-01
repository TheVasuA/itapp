// Rust topic tree.
//
// Each node is a ConceptNode: { id, title, level, slug?, concepts[], children[] }.
// Routable nodes carry a `slug`. Every Concept renders in the fixed order
// code -> note -> example (example optional).

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  // 1. Variables & Mutability
  {
    id: 'rust-variables',
    title: 'Variables & Mutability',
    level: 1,
    slug: 'variables',
    concepts: [],
    children: [
      {
        id: 'rust-let-bindings',
        title: 'Let Bindings & Immutability',
        level: 2,
        slug: 'let-bindings',
        concepts: [
          {
            id: 'rust-let-intro',
            code: `let x = 5;          // immutable by default
// x = 6;           // ERROR: cannot assign twice to immutable variable
let mut y = 10;     // mutable binding
y = 20;             // OK

let name = "Rust";  // type inferred as &str
let age: u32 = 3;   // explicit type annotation`,
            note: 'Variables in Rust are immutable by default. Use `mut` to opt into mutability. This encourages safe, predictable code while still allowing mutation when needed.',
            explanation: {
              heading: 'How immutability works',
              intro: 'A let binding in Rust is immutable unless you opt in to mutation, which flips the usual default found in most languages. This choice makes the compiler your ally when reasoning about what can change.',
              points: [
                { term: 'Immutable by default', detail: 'A plain let binding cannot be reassigned, so the compiler rejects a second assignment. This makes state changes explicit and easy to audit.' },
                { term: 'Opting into mutation', detail: 'Adding the mut keyword marks a binding as mutable so you can reassign or modify it in place when the logic genuinely needs to change a value.' },
                { term: 'Type inference', detail: 'The compiler usually infers the type from the initializer, but you can add an explicit annotation after the name when you want to pin the type down.' },
                { term: 'Safety benefit', detail: 'Immutable defaults help prevent accidental writes and interact well with the borrow checker, since shared references to immutable data are always safe.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'rust-shadowing',
        title: 'Shadowing',
        level: 2,
        slug: 'shadowing',
        concepts: [
          {
            id: 'rust-shadow-intro',
            code: `let x = 5;
let x = x + 1;       // shadows previous x
let x = x * 2;       // shadows again
println!("{x}");      // 12

// Shadowing can change types
let spaces = "   ";        // &str
let spaces = spaces.len(); // now usize`,
            note: 'Shadowing lets you reuse a variable name with `let`. Unlike `mut`, shadowing creates a new binding — you can even change the type. The previous value is dropped.',
            explanation: {
              heading: 'How shadowing works',
              intro: 'Shadowing declares a fresh binding that reuses an existing name, so the earlier binding is hidden for the rest of the scope. It is distinct from mutation because a brand new value and even a new type can take over the name.',
              points: [
                { term: 'A new binding', detail: 'Each let with the same name creates a separate binding rather than changing the old one, which keeps the original value immutable up to that point.' },
                { term: 'Type can change', detail: 'Because a new binding is created, the shadowing value may have a different type, which is impossible with a mutable variable that is locked to one type.' },
                { term: 'Different from mut', detail: 'Mutation reuses the same storage and requires the mut keyword, while shadowing introduces new storage and needs the let keyword each time.' },
                { term: 'Scoped effect', detail: 'A shadow only applies within its scope, so once the block ends the previous binding becomes visible again if it is still alive.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 2. Data Types
  {
    id: 'rust-data-types',
    title: 'Data Types',
    level: 1,
    slug: 'data-types',
    concepts: [],
    children: [
      {
        id: 'rust-scalar-types',
        title: 'Scalar Types',
        level: 2,
        slug: 'scalar-types',
        concepts: [
          {
            id: 'rust-scalars',
            code: `// Integers: i8, i16, i32, i64, i128, isize
// Unsigned: u8, u16, u32, u64, u128, usize
let integer: i32 = -42;
let unsigned: u64 = 1_000_000; // underscores for readability

// Floating point
let pi: f64 = 3.14159;

// Boolean
let active: bool = true;

// Character (4 bytes, Unicode scalar value)
let emoji: char = '🦀';`,
            note: 'Rust has four scalar types: integers (signed/unsigned in various sizes), floats (f32/f64), bool, and char. `char` is 4 bytes and represents a Unicode scalar value.',
            explanation: {
              heading: 'The scalar types',
              intro: 'Scalar types represent a single value and cover integers, floating point numbers, booleans, and characters. Choosing the right width and signedness affects correctness, overflow behavior, and memory use.',
              points: [
                { term: 'Sized integers', detail: 'Integers come in signed and unsigned variants at fixed bit widths, plus the pointer sized isize and usize. Picking the smallest type that fits documents intent and can save space.' },
                { term: 'Floating point', detail: 'The f64 type is the default for real numbers and offers more precision than f32. Neither can represent every decimal exactly, so avoid exact equality checks.' },
                { term: 'Character is not a byte', detail: 'A char is four bytes and holds a full Unicode scalar value, not a single byte, so it can store characters far beyond the basic ASCII range.' },
                { term: 'Overflow checks', detail: 'In debug builds integer overflow panics, while release builds wrap by default. Use the checked, wrapping, or saturating methods when you need explicit control.' },
                { term: 'Copy semantics', detail: 'All scalar types implement Copy, so assigning or passing them duplicates the value on the stack instead of moving ownership.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'rust-compound-types',
        title: 'Compound Types',
        level: 2,
        slug: 'compound-types',
        concepts: [
          {
            id: 'rust-compounds',
            code: `// Tuple — fixed-size, mixed types
let tup: (i32, f64, char) = (500, 6.4, 'z');
let (x, y, z) = tup;          // destructure
let first = tup.0;            // index access

// Array — fixed-size, same type, stack-allocated
let arr: [i32; 5] = [1, 2, 3, 4, 5];
let zeros = [0; 10];          // [0, 0, 0, ..., 0] (10 elements)
let third = arr[2];           // bounds-checked at runtime`,
            note: 'Tuples group different types with fixed length. Arrays have fixed length and same type. Both live on the stack. For dynamic sizes, use `Vec`.',
            explanation: {
              heading: 'Grouping values',
              intro: 'Compound types combine several values into one. Tuples mix different types with a fixed arity, while arrays hold a fixed number of same typed elements, and both have a size known at compile time.',
              points: [
                { term: 'Tuples mix types', detail: 'A tuple can hold values of different types together and you access them by position with a dot index or by destructuring into named parts.' },
                { term: 'Arrays are uniform', detail: 'An array stores a fixed count of elements of a single type, with the length baked into the type itself so it cannot grow or shrink.' },
                { term: 'Stack allocation', detail: 'Because their sizes are fixed and known, both tuples and arrays live on the stack, which makes them cheap to create and copy.' },
                { term: 'Bounds checking', detail: 'Array indexing is checked at runtime and panics on an out of range index, protecting you from reading past the end of the buffer.' },
                { term: 'When to use Vec', detail: 'When the number of elements is not known ahead of time, reach for a growable Vec, which allocates its contents on the heap instead.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 3. Functions
  {
    id: 'rust-functions',
    title: 'Functions',
    level: 1,
    slug: 'functions',
    concepts: [],
    children: [
      {
        id: 'rust-fn-basics',
        title: 'Function Definitions',
        level: 2,
        slug: 'fn-basics',
        concepts: [
          {
            id: 'rust-fn-intro',
            code: `fn add(a: i32, b: i32) -> i32 {
    a + b // no semicolon = expression returned
}

fn greet(name: &str) {
    println!("Hello, {name}!");
}

fn main() {
    let sum = add(3, 4);
    greet("world");
}`,
            note: 'Functions use `fn`. Parameter types are always required. The last expression without a semicolon is the return value. Use `-> Type` for the return type.',
            explanation: {
              heading: 'Defining functions',
              intro: 'Functions are declared with the fn keyword and require an explicit type for every parameter, since Rust does not infer parameter types. The body is a block whose final expression can serve as the return value.',
              points: [
                { term: 'Explicit parameters', detail: 'Every parameter must state its type, which keeps signatures clear and lets the compiler check every call site precisely.' },
                { term: 'Return by expression', detail: 'The last expression in the body, written without a trailing semicolon, becomes the return value, so an explicit return keyword is often unnecessary.' },
                { term: 'The arrow syntax', detail: 'A function that returns a value declares the type after an arrow. A function with no arrow returns the unit type, which carries no data.' },
                { term: 'Ownership at the boundary', detail: 'Passing an owned value into a function moves it unless the type is Copy, so accept a reference when the caller should keep using the value afterward.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'rust-expressions',
        title: 'Statements vs Expressions',
        level: 2,
        slug: 'expressions',
        concepts: [
          {
            id: 'rust-expr-intro',
            code: `// Blocks are expressions
let y = {
    let x = 3;
    x + 1  // no semicolon — this is the block's value
}; // y = 4

// if is an expression
let condition = true;
let number = if condition { 5 } else { 6 };

// Early return with explicit keyword
fn first_positive(nums: &[i32]) -> Option<i32> {
    for &n in nums {
        if n > 0 { return Some(n); }
    }
    None
}`,
            note: 'Almost everything in Rust is an expression that returns a value. Blocks, `if`, `match`, and loops can all produce values. Adding a semicolon turns an expression into a statement.',
            explanation: {
              heading: 'Expressions versus statements',
              intro: 'Rust is an expression oriented language, meaning most constructs evaluate to a value that you can bind or return. Statements, by contrast, perform an action but do not produce a usable value.',
              points: [
                { term: 'Blocks yield values', detail: 'A block enclosed in braces evaluates to its final expression, so you can assign the result of a whole block to a variable.' },
                { term: 'Control flow as values', detail: 'An if or a match is an expression, so you can bind its result directly instead of assigning inside each branch.' },
                { term: 'The semicolon rule', detail: 'Adding a semicolon discards an expression value and turns it into a statement that evaluates to the unit type, which is a common cause of type mismatch errors.' },
                { term: 'Let is a statement', detail: 'A let binding is a statement and does not itself return a value, which is why you cannot assign the result of a let to another variable.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 4. Ownership
  {
    id: 'rust-ownership',
    title: 'Ownership',
    level: 1,
    slug: 'ownership',
    concepts: [],
    children: [
      {
        id: 'rust-ownership-rules',
        title: 'Ownership Rules & Move Semantics',
        level: 2,
        slug: 'ownership-rules',
        concepts: [
          {
            id: 'rust-ownership-intro',
            code: `let s1 = String::from("hello");
let s2 = s1;  // s1 is MOVED to s2
// println!("{s1}"); // ERROR: value used after move

// Clone for deep copy
let s3 = s2.clone();
println!("{s2} and {s3}"); // both valid

// Copy types (stack-only data) are copied, not moved
let x = 5;
let y = x;
println!("{x} {y}"); // both valid — i32 implements Copy`,
            note: 'Each value has exactly one owner. When assigned or passed to a function, ownership moves and the original binding becomes invalid. Types implementing `Copy` (integers, bools, chars) are duplicated instead.',
            explanation: {
              heading: 'Ownership and moves',
              intro: 'Ownership is the core rule that lets Rust manage memory without a garbage collector. Every value has a single owner, and when the owner goes out of scope the value is freed exactly once.',
              points: [
                { term: 'One owner rule', detail: 'Each value is bound to exactly one owner at a time, which gives the compiler a clear point at which the memory can be released.' },
                { term: 'Move semantics', detail: 'Assigning or passing a heap owning value transfers ownership and invalidates the original binding, so using the moved value afterward is a compile error.' },
                { term: 'Copy types', detail: 'Small stack only types such as integers, booleans, and chars implement Copy, so they are duplicated on assignment and both bindings stay valid.' },
                { term: 'Explicit cloning', detail: 'When you truly need a deep, independent duplicate of heap data, call clone, which makes the cost of the copy visible in the code.' },
                { term: 'No double free', detail: 'Because moves invalidate the source, only one owner ever frees a value, which rules out double free and use after free bugs at compile time.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'rust-ownership-functions',
        title: 'Ownership & Functions',
        level: 2,
        slug: 'ownership-functions',
        concepts: [
          {
            id: 'rust-own-fn',
            code: `fn takes_ownership(s: String) {
    println!("{s}");
} // s is dropped here

fn gives_ownership() -> String {
    String::from("yours now")
}

fn main() {
    let s = String::from("hello");
    takes_ownership(s);
    // println!("{s}"); // ERROR: s was moved

    let s2 = gives_ownership(); // ownership transferred to s2
    println!("{s2}");
}`,
            note: 'Passing a value to a function moves it (unless it implements `Copy`). Returning a value transfers ownership to the caller. This ensures memory is freed exactly once.',
            explanation: {
              heading: 'Ownership across calls',
              intro: 'Function boundaries participate in ownership just like assignments do. Passing a value in moves ownership to the function, and returning a value hands ownership back out to the caller.',
              points: [
                { term: 'Passing moves in', detail: 'Handing an owned value to a function transfers ownership, so unless the type is Copy the caller can no longer use that value afterward.' },
                { term: 'Returning moves out', detail: 'A function can produce ownership by returning a value, which transfers responsibility for freeing it to the caller.' },
                { term: 'Borrow to keep access', detail: 'When the caller still needs the value, pass a reference instead of the value so the function borrows it without taking ownership.' },
                { term: 'Deterministic cleanup', detail: 'Because ownership tracks exactly where a value ends up, the value is dropped once and only once when its final owner goes out of scope.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 5. Borrowing & References
  {
    id: 'rust-borrowing',
    title: 'Borrowing & References',
    level: 1,
    slug: 'borrowing',
    concepts: [],
    children: [
      {
        id: 'rust-immutable-refs',
        title: 'Immutable References',
        level: 2,
        slug: 'immutable-refs',
        concepts: [
          {
            id: 'rust-imm-ref-intro',
            code: `fn calculate_length(s: &String) -> usize {
    s.len()
} // s goes out of scope but doesn't drop the value (it's borrowed)

fn main() {
    let s = String::from("hello");
    let len = calculate_length(&s); // borrow s
    println!("{s} has length {len}"); // s is still valid
}`,
            note: 'References (`&T`) let you refer to a value without taking ownership. You can have multiple immutable references simultaneously. The borrow checker enforces this at compile time.',
            explanation: {
              heading: 'Borrowing without owning',
              intro: 'An immutable reference lets a function read a value without taking ownership, which avoids unnecessary moves and copies. The borrow checker guarantees the reference never outlives the data it points to.',
              points: [
                { term: 'Shared read access', detail: 'A reference written with an ampersand borrows a value so the callee can read it while the original owner keeps ownership and remains valid.' },
                { term: 'Many readers allowed', detail: 'You may hold any number of immutable references at once because concurrent reads cannot cause a data race or invalidate each other.' },
                { term: 'No mutation', detail: 'An immutable reference cannot modify the value it points to, so it guarantees the data stays unchanged for the duration of the borrow.' },
                { term: 'Compile time checking', detail: 'The borrow checker verifies at compile time that a reference cannot outlive its owner, which prevents dangling pointers with no runtime cost.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'rust-mutable-refs',
        title: 'Mutable References',
        level: 2,
        slug: 'mutable-refs',
        concepts: [
          {
            id: 'rust-mut-ref-intro',
            code: `fn push_world(s: &mut String) {
    s.push_str(", world");
}

fn main() {
    let mut s = String::from("hello");
    push_world(&mut s);
    println!("{s}"); // "hello, world"

    // Only ONE mutable reference at a time
    let r1 = &mut s;
    // let r2 = &mut s; // ERROR: cannot borrow mutably twice
    r1.push_str("!");
}`,
            note: 'A mutable reference (`&mut T`) allows modification of the borrowed value. You can have exactly one mutable reference OR any number of immutable references — never both simultaneously.',
            explanation: {
              heading: 'Exclusive mutable access',
              intro: 'A mutable reference grants temporary exclusive access to modify a value the caller still owns. The borrow checker enforces an aliasing rule that makes data races impossible at compile time.',
              points: [
                { term: 'One writer at a time', detail: 'You may hold only a single mutable reference to a value at once, which guarantees no other code can observe a partial update.' },
                { term: 'No mixing with shared', detail: 'A mutable borrow cannot coexist with any immutable borrow of the same value, since a reader must never see data change underneath it.' },
                { term: 'Requires a mutable owner', detail: 'You can only take a mutable reference to a binding declared with mut, because borrowing mutably from an immutable value would be contradictory.' },
                { term: 'Prevents data races', detail: 'This exclusive access rule is exactly what lets the compiler rule out data races without a runtime lock, forming the basis of fearless concurrency.' },
              ],
            },
            example: `// Cannot mix mutable and immutable borrows
let mut s = String::from("hi");
let r1 = &s;
let r2 = &s;
// let r3 = &mut s; // ERROR while r1, r2 are alive
println!("{r1} {r2}");
// r1, r2 no longer used — now we can borrow mutably
let r3 = &mut s; // OK`,
          },
        ],
        children: [],
      },
    ],
  },

  // 6. Lifetimes
  {
    id: 'rust-lifetimes',
    title: 'Lifetimes',
    level: 1,
    slug: 'lifetimes',
    concepts: [],
    children: [
      {
        id: 'rust-lifetime-annotations',
        title: 'Lifetime Annotations',
        level: 2,
        slug: 'lifetime-annotations',
        concepts: [
          {
            id: 'rust-lifetime-intro',
            code: `// Without annotation: compiler can't determine which reference is returned
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

fn main() {
    let s1 = String::from("long string");
    let result;
    {
        let s2 = String::from("xyz");
        result = longest(s1.as_str(), s2.as_str());
        println!("{result}"); // OK: s2 still alive here
    }
    // println!("{result}"); // ERROR if s2 was shorter-lived
}`,
            note: 'Lifetime annotations (`\'a`) tell the compiler how long references live relative to each other. They don\'t change lifetimes — they describe relationships so the borrow checker can verify safety.',
            explanation: {
              heading: 'Relating reference lifetimes',
              intro: 'Lifetime annotations describe how the lifetimes of several references relate to one another so the borrow checker can prove a returned reference stays valid. They are purely descriptive and do not extend how long anything lives.',
              points: [
                { term: 'Describing not changing', detail: 'A lifetime parameter names a relationship between inputs and outputs, but it never makes a value live longer than it naturally would.' },
                { term: 'Tying outputs to inputs', detail: 'Annotating a function shows the compiler which input a returned reference borrows from, so it can reject callers that let the source drop too early.' },
                { term: 'Elision rules', detail: 'For common patterns the compiler infers lifetimes automatically, so explicit annotations are only required when the relationship is ambiguous.' },
                { term: 'Preventing dangles', detail: 'By checking these relationships at compile time, the borrow checker guarantees a reference can never point at freed memory.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'rust-lifetime-structs',
        title: 'Lifetimes in Structs',
        level: 2,
        slug: 'lifetime-structs',
        concepts: [
          {
            id: 'rust-lifetime-struct',
            code: `struct Excerpt<'a> {
    part: &'a str,
}

impl<'a> Excerpt<'a> {
    fn level(&self) -> i32 {
        3
    }
    fn announce(&self, announcement: &str) -> &'a str {
        println!("Attention: {announcement}");
        self.part
    }
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_sentence = novel.split('.').next().unwrap();
    let excerpt = Excerpt { part: first_sentence };
    println!("{}", excerpt.part);
}`,
            note: 'Structs that hold references must annotate lifetimes. This guarantees the struct cannot outlive the data it references. Lifetime elision rules often infer lifetimes in methods.',
            explanation: {
              heading: 'Lifetimes in structs',
              intro: 'When a struct stores a reference rather than owned data, it must carry a lifetime parameter that ties the struct to the borrowed value. This ensures an instance can never outlive the data it points at.',
              points: [
                { term: 'Annotate borrowed fields', detail: 'A struct that holds a reference declares a lifetime parameter and applies it to the field, which links the struct to the source of the borrow.' },
                { term: 'Cannot outlive source', detail: 'The compiler ensures the struct instance is dropped before the referenced data, preventing a stored reference from dangling.' },
                { term: 'Owned versus borrowed', detail: 'If you want the struct to be free of lifetime parameters, store owned data such as a String instead of a borrowed slice.' },
                { term: 'Method elision', detail: 'Inside an impl block, elision rules usually infer method lifetimes, so you rarely need to repeat the annotations on every method.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 7. Structs
  {
    id: 'rust-structs',
    title: 'Structs',
    level: 1,
    slug: 'structs',
    concepts: [],
    children: [
      {
        id: 'rust-struct-basics',
        title: 'Defining & Instantiating Structs',
        level: 2,
        slug: 'struct-basics',
        concepts: [
          {
            id: 'rust-struct-intro',
            code: `struct User {
    username: String,
    email: String,
    active: bool,
    sign_in_count: u64,
}

fn build_user(email: String, username: String) -> User {
    User {
        email,            // field init shorthand
        username,
        active: true,
        sign_in_count: 1,
    }
}

let user1 = build_user("alice@example.com".into(), "alice".into());
// Struct update syntax
let user2 = User { email: "bob@example.com".into(), ..user1 };`,
            note: 'Structs group related data with named fields. Field init shorthand works when variable and field names match. Struct update syntax (`..`) copies remaining fields from another instance.',
            explanation: {
              heading: 'Building structs',
              intro: 'A struct groups related values under named fields into a single custom type. Rust offers concise syntax for constructing instances and for deriving one instance from another.',
              points: [
                { term: 'Named fields', detail: 'Each field has a name and a type, which makes the data self documenting compared to positional tuples and lets you access members by name.' },
                { term: 'Field init shorthand', detail: 'When a local variable has the same name as a field, you can list it once instead of writing name equals name, which trims boilerplate in constructors.' },
                { term: 'Struct update syntax', detail: 'The double dot syntax copies the remaining fields from an existing instance, but be aware it moves non Copy fields out of the source.' },
                { term: 'Ownership of fields', detail: 'A struct owns its fields, so the whole struct is dropped as a unit and moving the struct moves every owned field with it.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'rust-struct-methods',
        title: 'Methods & Associated Functions',
        level: 2,
        slug: 'struct-methods',
        concepts: [
          {
            id: 'rust-impl-block',
            code: `struct Rectangle {
    width: f64,
    height: f64,
}

impl Rectangle {
    // Associated function (no self) — constructor pattern
    fn new(width: f64, height: f64) -> Self {
        Self { width, height }
    }

    // Method — borrows self immutably
    fn area(&self) -> f64 {
        self.width * self.height
    }

    // Method — borrows self mutably
    fn scale(&mut self, factor: f64) {
        self.width *= factor;
        self.height *= factor;
    }
}

let mut rect = Rectangle::new(3.0, 4.0);
println!("Area: {}", rect.area()); // 12.0
rect.scale(2.0);
println!("Scaled area: {}", rect.area()); // 48.0`,
            note: 'Methods are defined in `impl` blocks. `&self` borrows immutably, `&mut self` borrows mutably, and `self` takes ownership. Associated functions without `self` serve as constructors.',
            explanation: {
              heading: 'Methods and self',
              intro: 'Methods and associated functions live in an impl block attached to a type. The way a method receives self decides whether it borrows the instance or consumes it, which mirrors the broader ownership rules.',
              points: [
                { term: 'Shared self', detail: 'Taking self by reference borrows the instance immutably, letting the method read fields while callers keep using the value elsewhere.' },
                { term: 'Mutable self', detail: 'Taking self by mutable reference lets the method modify fields in place and requires the caller to hold the value mutably.' },
                { term: 'Consuming self', detail: 'Taking self by value moves the instance into the method, which is useful for builder style transformations that produce a new value.' },
                { term: 'Associated functions', detail: 'Functions in the impl block that do not take self are called on the type itself and commonly serve as constructors returning Self.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 8. Enums
  {
    id: 'rust-enums',
    title: 'Enums',
    level: 1,
    slug: 'enums',
    concepts: [],
    children: [
      {
        id: 'rust-enum-basics',
        title: 'Defining Enums',
        level: 2,
        slug: 'enum-basics',
        concepts: [
          {
            id: 'rust-enum-intro',
            code: `enum IpAddr {
    V4(u8, u8, u8, u8),
    V6(String),
}

enum Message {
    Quit,                       // no data
    Move { x: i32, y: i32 },   // named fields (struct variant)
    Write(String),              // single value
    ChangeColor(i32, i32, i32), // tuple variant
}

impl Message {
    fn call(&self) {
        match self {
            Message::Write(text) => println!("{text}"),
            Message::Quit => println!("Quitting"),
            _ => println!("Other message"),
        }
    }
}

let msg = Message::Write(String::from("hello"));
msg.call();`,
            note: 'Enums in Rust can hold data in each variant — they are algebraic data types (sum types). Each variant can be a unit, tuple, or struct-like variant. You can implement methods on enums.',
            explanation: {
              heading: 'Enums as sum types',
              intro: 'An enum defines a type by listing its possible variants, and each variant can carry its own data. This makes enums true sum types that model a value which is exactly one of several shapes.',
              points: [
                { term: 'Data per variant', detail: 'Each variant may hold no data, a tuple of values, or named struct like fields, so a single enum can represent several distinct payloads.' },
                { term: 'Exhaustive by design', detail: 'Because the type enumerates every valid case, a match over the enum must handle all of them, catching missing cases at compile time.' },
                { term: 'Methods on enums', detail: 'You can attach methods in an impl block, and they typically match on self to behave differently depending on the active variant.' },
                { term: 'Compact representation', detail: 'The compiler stores a tag plus the largest variant payload, so an enum uses only as much space as its biggest case needs.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'rust-enum-option',
        title: 'Option Enum',
        level: 2,
        slug: 'enum-option',
        concepts: [
          {
            id: 'rust-option-intro',
            code: `// Option<T> is in the prelude — no import needed
// enum Option<T> { Some(T), None }

fn divide(a: f64, b: f64) -> Option<f64> {
    if b == 0.0 { None } else { Some(a / b) }
}

let result = divide(10.0, 2.0);
// Using combinators
let doubled = result.map(|v| v * 2.0);
let value = result.unwrap_or(0.0);

// if let for single-pattern matching
if let Some(v) = divide(10.0, 3.0) {
    println!("Result: {v:.2}");
}`,
            note: '`Option<T>` replaces null in Rust. It forces explicit handling of absence. Use `map`, `and_then`, `unwrap_or`, or pattern matching. Avoid `unwrap()` in production — it panics on `None`.',
            explanation: {
              heading: 'Encoding absence',
              intro: 'The Option type represents a value that might be present or missing, replacing the null references found in many languages. Because absence is part of the type, the compiler forces you to handle the empty case.',
              points: [
                { term: 'Two variants', detail: 'An Option is either Some wrapping a value or None indicating no value, so the possibility of nothing is encoded directly in the type.' },
                { term: 'No null surprises', detail: 'You cannot use the inner value without first accounting for None, which eliminates an entire class of null dereference bugs.' },
                { term: 'Combinators', detail: 'Methods such as map, and_then, and unwrap_or transform or supply defaults for an Option without verbose branching.' },
                { term: 'Avoid blind unwrap', detail: 'Calling unwrap panics on None, so prefer pattern matching or a fallback method in code that must not crash.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 9. Pattern Matching
  {
    id: 'rust-pattern-matching',
    title: 'Pattern Matching',
    level: 1,
    slug: 'pattern-matching',
    concepts: [],
    children: [
      {
        id: 'rust-match-expr',
        title: 'Match Expressions',
        level: 2,
        slug: 'match-expressions',
        concepts: [
          {
            id: 'rust-match-intro',
            code: `enum Coin {
    Penny, Nickel, Dime, Quarter(UsState),
}

fn value_in_cents(coin: &Coin) -> u32 {
    match coin {
        Coin::Penny => {
            println!("Lucky penny!");
            1
        }
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter(state) => {
            println!("Quarter from {state:?}");
            25
        }
    }
}

// Match with guards
let num = 4;
match num {
    n if n < 0 => println!("negative"),
    0 => println!("zero"),
    1..=9 => println!("single digit"),
    _ => println!("multiple digits"),
}`,
            note: 'The `match` expression must be exhaustive — all possibilities covered. It can destructure enums, tuples, structs. Guards (`if` conditions) add extra filtering. `_` is the catch-all pattern.',
            explanation: {
              heading: 'Matching exhaustively',
              intro: 'A match expression compares a value against a series of patterns and runs the arm for the first that fits. The compiler requires that the arms cover every possible case, which turns forgotten cases into compile errors.',
              points: [
                { term: 'Exhaustiveness', detail: 'Every possible value must be handled, so adding a new enum variant later forces you to revisit each match and decide how to treat it.' },
                { term: 'Destructuring', detail: 'Patterns can pull apart enums, tuples, and structs, binding inner fields to names that the matching arm can then use directly.' },
                { term: 'Match guards', detail: 'An if condition attached to an arm adds an extra test, letting you distinguish cases that share the same structural pattern.' },
                { term: 'Catch all arm', detail: 'The underscore pattern matches anything not already covered, which satisfies exhaustiveness when you deliberately want a default.' },
                { term: 'Match is an expression', detail: 'Because match yields a value, every arm must produce the same type, and you can bind the whole result to a variable.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'rust-if-let-while-let',
        title: 'if let & while let',
        level: 2,
        slug: 'if-let-while-let',
        concepts: [
          {
            id: 'rust-if-let-intro',
            code: `// if let — concise single-pattern match
let config_max: Option<u8> = Some(3);
if let Some(max) = config_max {
    println!("Maximum is {max}");
}

// while let — loop while pattern matches
let mut stack = vec![1, 2, 3];
while let Some(top) = stack.pop() {
    println!("{top}");
}
// prints: 3, 2, 1

// let-else (Rust 1.65+) — diverge on mismatch
fn get_count(s: &str) -> u64 {
    let Ok(count) = s.parse::<u64>() else {
        return 0; // must diverge: return, break, panic, etc.
    };
    count
}`,
            note: '`if let` is syntactic sugar for a match with one pattern. `while let` loops while the pattern holds. `let-else` (Rust 1.65+) provides early-return when a pattern fails.',
            explanation: {
              heading: 'Concise pattern matching',
              intro: 'These constructs offer lighter weight alternatives to a full match when you care about a single pattern. They trade exhaustiveness for brevity where a complete match would be noisy.',
              points: [
                { term: 'if let', detail: 'The if let form runs a block only when a value matches one pattern, binding its contents, which reads more cleanly than a match with a single arm and a catch all.' },
                { term: 'while let', detail: 'The while let form repeats a loop body as long as a pattern keeps matching, which is ideal for draining a collection with a method like pop.' },
                { term: 'let else', detail: 'A let else binding requires the pattern to match and otherwise runs a diverging block that must return, break, or panic, giving clean early exits.' },
                { term: 'When to prefer match', detail: 'These forms skip exhaustiveness checks, so reach for a full match when you must ensure every case is handled.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 10. Error Handling (Option & Result)
  {
    id: 'rust-error-handling',
    title: 'Error Handling',
    level: 1,
    slug: 'error-handling',
    concepts: [],
    children: [
      {
        id: 'rust-result-type',
        title: 'Result Type & the ? Operator',
        level: 2,
        slug: 'result-type',
        concepts: [
          {
            id: 'rust-result-intro',
            code: `use std::fs;
use std::io;

// Result<T, E> — Ok(T) or Err(E)
fn read_username() -> Result<String, io::Error> {
    let mut s = fs::read_to_string("username.txt")?; // ? propagates error
    s.trim_end().to_string();
    Ok(s)
}

// Chaining with ?
fn read_and_parse() -> Result<u32, Box<dyn std::error::Error>> {
    let content = fs::read_to_string("number.txt")?;
    let num = content.trim().parse::<u32>()?;
    Ok(num)
}`,
            note: 'The `?` operator unwraps `Ok` or returns `Err` early from the function. It works with both `Result` and `Option`. Use `Box<dyn Error>` when functions can return multiple error types.',
            explanation: {
              heading: 'Propagating with the question mark',
              intro: 'The Result type represents an operation that can succeed with a value or fail with an error. The question mark operator makes error propagation concise by unwrapping success and returning failure early.',
              points: [
                { term: 'Two variants', detail: 'A Result is either Ok holding a success value or Err holding an error, so callers must acknowledge the possibility of failure.' },
                { term: 'Early return operator', detail: 'The question mark unwraps an Ok in place, but on an Err it returns that error from the current function, keeping the happy path readable.' },
                { term: 'Automatic conversion', detail: 'When propagating, the operator converts the error into the function return type using the From trait, which unifies different error sources.' },
                { term: 'Works on Option', detail: 'The same operator applies to Option, returning None early, so you can chain fallible steps without nested matches.' },
                { term: 'Boxed errors', detail: 'A boxed dynamic error type lets a function return several unrelated error types behind one interface when precise typing is not required.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'rust-custom-errors',
        title: 'Custom Error Types',
        level: 2,
        slug: 'custom-errors',
        concepts: [
          {
            id: 'rust-custom-err',
            code: `use std::fmt;
use std::num::ParseIntError;

#[derive(Debug)]
enum AppError {
    Io(std::io::Error),
    Parse(ParseIntError),
    Custom(String),
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            AppError::Io(e) => write!(f, "IO error: {e}"),
            AppError::Parse(e) => write!(f, "Parse error: {e}"),
            AppError::Custom(msg) => write!(f, "{msg}"),
        }
    }
}

impl From<std::io::Error> for AppError {
    fn from(e: std::io::Error) -> Self { AppError::Io(e) }
}

impl From<ParseIntError> for AppError {
    fn from(e: ParseIntError) -> Self { AppError::Parse(e) }
}`,
            note: 'Custom error enums unify multiple error sources. Implementing `From` enables the `?` operator to auto-convert. In practice, crates like `thiserror` or `anyhow` reduce boilerplate.',
            explanation: {
              heading: 'Designing custom errors',
              intro: 'A custom error enum lets a library present a single error type that wraps every failure it can produce. Implementing the standard traits makes the type interoperate smoothly with the question mark operator and error reporting.',
              points: [
                { term: 'One unified type', detail: 'An enum with a variant per failure source lets callers handle each cause distinctly while your function signatures return a single error type.' },
                { term: 'Implement Display', detail: 'Providing a Display implementation gives each variant a human readable message, which is expected of a well behaved error type.' },
                { term: 'From for conversion', detail: 'Implementing From for each underlying error lets the question mark operator convert automatically, so propagation stays terse.' },
                { term: 'Crates reduce boilerplate', detail: 'The thiserror crate derives these implementations for you, and anyhow offers a ready made dynamic error type for applications.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 11. Traits
  {
    id: 'rust-traits',
    title: 'Traits',
    level: 1,
    slug: 'traits',
    concepts: [],
    children: [
      {
        id: 'rust-trait-basics',
        title: 'Defining & Implementing Traits',
        level: 2,
        slug: 'trait-basics',
        concepts: [
          {
            id: 'rust-trait-intro',
            code: `trait Summary {
    fn summarize_author(&self) -> String;

    // Default implementation
    fn summarize(&self) -> String {
        format!("(Read more from {}...)", self.summarize_author())
    }
}

struct Article {
    title: String,
    author: String,
    content: String,
}

impl Summary for Article {
    fn summarize_author(&self) -> String {
        self.author.clone()
    }

    fn summarize(&self) -> String {
        format!("{}, by {} — {}", self.title, self.author, &self.content[..50])
    }
}`,
            note: 'Traits define shared behavior (like interfaces). They can have default method implementations. Types implement traits with `impl Trait for Type`. This enables polymorphism without inheritance.',
            explanation: {
              heading: 'Defining shared behavior',
              intro: 'A trait declares a set of methods that a type can promise to provide, much like an interface in other languages. Rust uses traits rather than inheritance to share behavior across unrelated types.',
              points: [
                { term: 'Behavior contracts', detail: 'A trait lists method signatures that any implementing type must supply, which lets functions accept any type that fulfills the contract.' },
                { term: 'Default methods', detail: 'A trait can provide default bodies that implementors inherit unless they override them, reducing repetition for common logic.' },
                { term: 'Implement for a type', detail: 'You add behavior with an impl of the trait for a type, and a type may implement many traits without any class hierarchy.' },
                { term: 'The orphan rule', detail: 'You can implement a trait only when either the trait or the type is local to your crate, which prevents conflicting external implementations.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'rust-trait-objects',
        title: 'Trait Objects & Dynamic Dispatch',
        level: 2,
        slug: 'trait-objects',
        concepts: [
          {
            id: 'rust-dyn-dispatch',
            code: `trait Draw {
    fn draw(&self);
}

struct Circle { radius: f64 }
struct Square { side: f64 }

impl Draw for Circle {
    fn draw(&self) { println!("Drawing circle r={}", self.radius); }
}
impl Draw for Square {
    fn draw(&self) { println!("Drawing square s={}", self.side); }
}

// Trait object: dynamic dispatch via vtable
fn draw_all(shapes: &[Box<dyn Draw>]) {
    for shape in shapes {
        shape.draw(); // dispatched at runtime
    }
}

let shapes: Vec<Box<dyn Draw>> = vec![
    Box::new(Circle { radius: 1.0 }),
    Box::new(Square { side: 2.0 }),
];
draw_all(&shapes);`,
            note: '`dyn Trait` enables runtime polymorphism via a vtable (dynamic dispatch). Use `Box<dyn Trait>` for owned trait objects or `&dyn Trait` for borrowed ones. This has a small runtime cost vs generics.',
            explanation: {
              heading: 'Runtime polymorphism',
              intro: 'A trait object lets you store values of different concrete types behind one trait and call their methods without knowing the type at compile time. This dynamic dispatch trades a little speed for flexibility.',
              points: [
                { term: 'The dyn keyword', detail: 'Writing dyn before a trait creates a trait object, a type erased handle that can point at any value implementing that trait.' },
                { term: 'Vtable dispatch', detail: 'Method calls go through a table of function pointers resolved at runtime, which is why the concrete type need not be known when the code is compiled.' },
                { term: 'Owned or borrowed', detail: 'A boxed trait object owns its value on the heap, while a reference to a trait object borrows one, so choose based on ownership needs.' },
                { term: 'Cost versus generics', detail: 'Dynamic dispatch adds an indirect call and prevents inlining, whereas generics are monomorphized for zero runtime cost but larger code.' },
                { term: 'Object safety', detail: 'Only object safe traits can become trait objects, which broadly means methods must not return Self or use generic type parameters.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 12. Generics
  {
    id: 'rust-generics',
    title: 'Generics',
    level: 1,
    slug: 'generics',
    concepts: [],
    children: [
      {
        id: 'rust-generic-functions',
        title: 'Generic Functions & Structs',
        level: 2,
        slug: 'generic-functions',
        concepts: [
          {
            id: 'rust-generics-intro',
            code: `// Generic function
fn largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut largest = &list[0];
    for item in &list[1..] {
        if item > largest {
            largest = item;
        }
    }
    largest
}

// Generic struct
struct Point<T, U> {
    x: T,
    y: U,
}

impl<T, U> Point<T, U> {
    fn mixup<V, W>(self, other: Point<V, W>) -> Point<T, W> {
        Point { x: self.x, y: other.y }
    }
}

let p1 = Point { x: 5, y: 10.4 };
let p2 = Point { x: "Hello", y: 'c' };
let p3 = p1.mixup(p2); // Point { x: 5, y: 'c' }`,
            note: 'Generics enable code reuse across types with zero runtime cost — Rust monomorphizes generics at compile time, generating specialized code for each concrete type used.',
            explanation: {
              heading: 'Reuse without overhead',
              intro: 'Generics let you write functions and structs that work over many types while keeping full type safety. Rust compiles them into specialized versions so there is no runtime penalty for the abstraction.',
              points: [
                { term: 'Type parameters', detail: 'A generic item declares placeholder type parameters that callers fill in, so one definition serves every concrete type that satisfies the bounds.' },
                { term: 'Monomorphization', detail: 'At compile time the compiler generates a separate concrete copy for each type used, so generic code runs exactly as fast as hand written specialized code.' },
                { term: 'Zero cost abstraction', detail: 'Because the specialization happens statically, generics add no indirection or boxing, which is the essence of a zero cost abstraction.' },
                { term: 'Code size tradeoff', detail: 'The one downside is that many instantiations can grow the compiled binary, since each concrete type produces its own machine code.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 13. Trait Bounds
  {
    id: 'rust-trait-bounds',
    title: 'Trait Bounds',
    level: 1,
    slug: 'trait-bounds',
    concepts: [],
    children: [
      {
        id: 'rust-bounds-syntax',
        title: 'Bound Syntax & Where Clauses',
        level: 2,
        slug: 'bounds-syntax',
        concepts: [
          {
            id: 'rust-bounds-intro',
            code: `use std::fmt::{Debug, Display};

// Trait bound syntax
fn print_info<T: Display + Debug>(item: &T) {
    println!("Display: {item}");
    println!("Debug: {item:?}");
}

// impl Trait syntax (sugar for simple cases)
fn notify(item: &impl Summary) {
    println!("Breaking: {}", item.summarize());
}

// Where clause — cleaner for complex bounds
fn complex<T, U>(t: &T, u: &U) -> String
where
    T: Display + Clone,
    U: Debug + PartialOrd,
{
    format!("{t} and {u:?}")
}

// Returning impl Trait
fn make_adder(x: i32) -> impl Fn(i32) -> i32 {
    move |y| x + y
}`,
            note: 'Trait bounds constrain generic types to those implementing specific traits. Use `+` for multiple bounds. `where` clauses improve readability. `impl Trait` in return position hides the concrete type.',
            explanation: {
              heading: 'Constraining generics',
              intro: 'Trait bounds restrict a generic type parameter to types that implement particular traits, which lets the body call the methods those traits guarantee. They are how generics stay both flexible and type safe.',
              points: [
                { term: 'Bounds enable methods', detail: 'A bound tells the compiler the type provides certain behavior, so the generic body may call the trait methods it declares.' },
                { term: 'Combining bounds', detail: 'You combine several requirements with the plus sign, requiring a type to implement every listed trait at once.' },
                { term: 'Where clauses', detail: 'A where clause moves complex bounds below the signature, which keeps the parameter list readable when there are many constraints.' },
                { term: 'impl Trait', detail: 'Using impl Trait in a return position hides the concrete type while still dispatching statically, useful for returning closures or iterators.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'rust-associated-types',
        title: 'Associated Types',
        level: 2,
        slug: 'associated-types',
        concepts: [
          {
            id: 'rust-assoc-types',
            code: `// Associated type — one implementation per type
trait Iterator {
    type Item;
    fn next(&mut self) -> Option<Self::Item>;
}

struct Counter { count: u32 }

impl Iterator for Counter {
    type Item = u32;
    fn next(&mut self) -> Option<Self::Item> {
        self.count += 1;
        if self.count <= 5 { Some(self.count) } else { None }
    }
}`,
            note: 'Associated types are placeholders in traits that implementors fill in. Unlike generics on the trait, there can only be one implementation per type — no ambiguity about which `Item` to use.',
            explanation: {
              heading: 'Types tied to a trait',
              intro: 'An associated type is a placeholder type declared inside a trait that each implementor chooses concretely. It expresses a type that belongs to the implementation rather than being supplied by the caller.',
              points: [
                { term: 'One choice per impl', detail: 'Each type that implements the trait fixes the associated type exactly once, so there is never ambiguity about which concrete type it means.' },
                { term: 'Cleaner than generics', detail: 'Compared with a generic trait parameter, associated types keep call sites simpler because the caller does not have to specify the type.' },
                { term: 'The Iterator example', detail: 'The Iterator trait uses an associated Item type so that next returns an Option of exactly the element type that iterator produces.' },
                { term: 'Referenced with Self', detail: 'Inside the trait you refer to the placeholder through the Self qualified path, which links the type firmly to the implementing type.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 14. Collections (Vec, HashMap, HashSet)
  {
    id: 'rust-collections',
    title: 'Collections',
    level: 1,
    slug: 'collections',
    concepts: [],
    children: [
      {
        id: 'rust-vec',
        title: 'Vec<T>',
        level: 2,
        slug: 'vec',
        concepts: [
          {
            id: 'rust-vec-intro',
            code: `// Creating vectors
let mut v: Vec<i32> = Vec::new();
v.push(1);
v.push(2);
v.push(3);

let v2 = vec![10, 20, 30]; // macro shorthand

// Accessing elements
let third = &v2[2];          // panics if out of bounds
let maybe = v2.get(2);       // returns Option<&i32>

// Iterating
for val in &v {
    println!("{val}");
}

// Mutable iteration
for val in &mut v {
    *val *= 2;
}

// Useful methods
v.retain(|&x| x > 2);
v.sort();
v.dedup();`,
            note: '`Vec<T>` is a growable, heap-allocated array. Use `push`/`pop` to modify, indexing or `.get()` for access. Prefer `.get()` for safe access that returns `Option` instead of panicking.',
            explanation: {
              heading: 'Growable arrays',
              intro: 'A Vec is the workhorse collection for a contiguous, growable sequence of values stored on the heap. It owns its elements and frees them all when the vector itself is dropped.',
              points: [
                { term: 'Heap storage', detail: 'A vector keeps a pointer, length, and capacity, allocating its elements on the heap so it can grow beyond a fixed size.' },
                { term: 'Push and pop', detail: 'Adding with push may trigger a reallocation when capacity is exceeded, while pop removes and returns the last element as an Option.' },
                { term: 'Safe versus indexed access', detail: 'Indexing panics on an out of range position, whereas the get method returns an Option, so prefer get when an index might be invalid.' },
                { term: 'Borrowing while iterating', detail: 'The borrow checker forbids modifying a vector while an iterator or reference into it is alive, which prevents invalidated pointers.' },
                { term: 'Ownership of elements', detail: 'A vector owns its contents, so dropping the vector drops every element and moving an element out requires methods like remove or swap remove.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'rust-hashmap',
        title: 'HashMap & HashSet',
        level: 2,
        slug: 'hashmap',
        concepts: [
          {
            id: 'rust-hashmap-intro',
            code: `use std::collections::{HashMap, HashSet};

// HashMap<K, V>
let mut scores: HashMap<String, i32> = HashMap::new();
scores.insert("Alice".into(), 100);
scores.insert("Bob".into(), 85);

// Entry API — insert only if key absent
scores.entry("Carol".into()).or_insert(90);

// Update based on old value
let count = scores.entry("Alice".into()).or_insert(0);
*count += 10;

// HashSet<T>
let mut langs: HashSet<&str> = HashSet::new();
langs.insert("Rust");
langs.insert("Go");
langs.insert("Rust"); // no-op, already present
println!("Contains Rust: {}", langs.contains("Rust"));

// Set operations
let a: HashSet<i32> = [1, 2, 3].into();
let b: HashSet<i32> = [2, 3, 4].into();
let intersection: Vec<_> = a.intersection(&b).collect();`,
            note: '`HashMap` stores key-value pairs with O(1) average lookup. The entry API avoids double lookups. `HashSet` is a set of unique values backed by a HashMap. Both require keys to implement `Hash + Eq`.',
            explanation: {
              heading: 'Hash based collections',
              intro: 'A HashMap associates keys with values for fast average time lookup, and a HashSet stores unique values with the same underlying mechanism. Both rely on hashing the keys, so key types must support hashing and equality.',
              points: [
                { term: 'Key requirements', detail: 'Keys must implement the Hash and Eq traits so the map can compute a bucket and compare keys for equality within it.' },
                { term: 'Average constant time', detail: 'Insertion and lookup run in average constant time, though a poor hash distribution can degrade this in the worst case.' },
                { term: 'The entry API', detail: 'The entry method looks up a key once and lets you insert a default or update the existing value, avoiding a second redundant lookup.' },
                { term: 'HashSet uniqueness', detail: 'A HashSet is a map from values to nothing, so it holds each element at most once and supports set operations like intersection.' },
                { term: 'Ownership of keys', detail: 'Inserting typically moves the key and value into the map, so it takes ownership and returns any previous value it displaced.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 15. Iterators & Closures
  {
    id: 'rust-iterators',
    title: 'Iterators & Closures',
    level: 1,
    slug: 'iterators',
    concepts: [],
    children: [
      {
        id: 'rust-closures',
        title: 'Closures',
        level: 2,
        slug: 'closures',
        concepts: [
          {
            id: 'rust-closure-intro',
            code: `// Closures capture environment
let offset = 10;
let add_offset = |x: i32| x + offset; // borrows offset
println!("{}", add_offset(5)); // 15

// Closure types: Fn, FnMut, FnOnce
let mut count = 0;
let mut increment = || { count += 1; }; // FnMut — mutably borrows
increment();
increment();
println!("{count}"); // 2

// move closure — takes ownership
let name = String::from("Rust");
let greet = move || println!("Hello, {name}!");
// println!("{name}"); // ERROR: name was moved
greet();`,
            note: 'Closures are anonymous functions that capture their environment. Rust infers which trait they implement: `Fn` (borrows), `FnMut` (borrows mutably), or `FnOnce` (takes ownership). Use `move` to force ownership.',
            explanation: {
              heading: 'Functions that capture',
              intro: 'A closure is an anonymous function that can capture variables from the scope where it is defined. How it captures determines which of the function traits it implements and thus how it can be called.',
              points: [
                { term: 'Environment capture', detail: 'A closure automatically captures the variables it uses, borrowing them by default and only taking more access than needed when required.' },
                { term: 'The three traits', detail: 'A closure implements Fn if it only reads captures, FnMut if it mutates them, and FnOnce if it consumes them, which limits how many times it can run.' },
                { term: 'The move keyword', detail: 'Prefixing a closure with move forces it to take ownership of its captures, which is essential when passing a closure to a thread that outlives the current scope.' },
                { term: 'Borrow implications', detail: 'A closure that borrows a variable holds that borrow for its lifetime, so the borrow checker restricts other access to the captured value while the closure exists.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'rust-iterator-adaptors',
        title: 'Iterator Adaptors & Consumers',
        level: 2,
        slug: 'iterator-adaptors',
        concepts: [
          {
            id: 'rust-iter-intro',
            code: `let numbers = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Chaining adaptors (lazy — nothing happens until consumed)
let result: Vec<i32> = numbers.iter()
    .filter(|&&x| x % 2 == 0)  // keep evens
    .map(|&x| x * x)            // square them
    .collect();                  // consume into Vec
// [4, 16, 36, 64, 100]

// Other useful consumers
let sum: i32 = numbers.iter().sum();
let any_big = numbers.iter().any(|&x| x > 5);
let first_even = numbers.iter().find(|&&x| x % 2 == 0);

// Folding (reduce)
let product = numbers.iter().fold(1, |acc, &x| acc * x);

// Enumerate and zip
for (i, val) in numbers.iter().enumerate() {
    println!("{i}: {val}");
}`,
            note: 'Iterators are lazy — adaptors like `map`, `filter`, `take` build a chain that only executes when a consumer (`collect`, `sum`, `for_each`, `fold`) drives it. Zero-cost abstraction: compiles to the same code as hand-written loops.',
            explanation: {
              heading: 'Lazy iterator chains',
              intro: 'Iterator adaptors let you describe a data transformation as a pipeline of steps. Nothing runs until a consumer pulls values through the chain, and the whole pipeline compiles down to efficient loop code.',
              points: [
                { term: 'Adaptors are lazy', detail: 'Methods such as map, filter, and take return a new iterator without doing work, so building a chain merely assembles the recipe.' },
                { term: 'Consumers drive execution', detail: 'A terminal operation like collect, sum, or for_each pulls items through the chain, which is when the queued transformations actually run.' },
                { term: 'Zero cost abstraction', detail: 'The compiler optimizes iterator chains into the same machine code as an equivalent hand written loop, so the expressive style costs nothing at runtime.' },
                { term: 'Borrowing versus owning', detail: 'Using iter borrows each element, iter_mut yields mutable references, and into_iter consumes the collection and yields owned values.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 16. Strings (String vs &str)
  {
    id: 'rust-strings',
    title: 'Strings',
    level: 1,
    slug: 'strings',
    concepts: [],
    children: [
      {
        id: 'rust-string-types',
        title: 'String vs &str',
        level: 2,
        slug: 'string-types',
        concepts: [
          {
            id: 'rust-string-intro',
            code: `// &str — string slice, borrowed, immutable view
let literal: &str = "hello, world"; // stored in binary

// String — owned, growable, heap-allocated UTF-8
let mut owned = String::from("hello");
owned.push_str(", world");
owned.push('!');

// Conversions
let s: String = literal.to_string(); // &str -> String
let slice: &str = &owned;            // String -> &str (deref coercion)
let from_owned: &str = owned.as_str();

// String is UTF-8: no indexing by position
// let c = owned[0]; // ERROR: cannot index String
let first_char = owned.chars().next(); // Some('h')
let sub = &owned[0..5]; // "hello" — byte slice (panics if not on char boundary)`,
            note: '`&str` is an immutable borrowed string slice. `String` is an owned, growable UTF-8 string on the heap. Functions should generally accept `&str` for flexibility. Strings cannot be indexed by integer — use `.chars()` or byte slices.',
            explanation: {
              heading: 'Owned versus borrowed strings',
              intro: 'Rust splits string handling into two main types. A String owns growable heap text, while a string slice is an immutable borrowed view into text owned elsewhere, and both are guaranteed valid UTF-8.',
              points: [
                { term: 'String owns text', detail: 'A String owns a heap buffer it can grow and mutate, and it frees that buffer when it goes out of scope.' },
                { term: 'Slices borrow text', detail: 'A string slice is a borrowed, read only view described by a pointer and length, often pointing into a String or a string literal in the binary.' },
                { term: 'Accept slices in APIs', detail: 'Functions should take a string slice parameter so they accept both owned strings and literals, thanks to automatic deref coercion.' },
                { term: 'No integer indexing', detail: 'Because text is UTF-8 and characters vary in byte length, you cannot index a string by position and instead iterate with chars or take a byte range on a boundary.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'rust-string-methods',
        title: 'Common String Operations',
        level: 2,
        slug: 'string-methods',
        concepts: [
          {
            id: 'rust-string-ops',
            code: `let s = String::from("Hello, Rust World!");

// Searching
let contains = s.contains("Rust");       // true
let starts = s.starts_with("Hello");     // true
let pos = s.find("Rust");                // Some(7)

// Transforming
let upper = s.to_uppercase();
let replaced = s.replace("Rust", "Safe");
let trimmed = "  spaces  ".trim();       // "spaces"

// Splitting
let words: Vec<&str> = s.split_whitespace().collect();
let parts: Vec<&str> = "a,b,c".split(',').collect();

// Formatting
let name = "ferris";
let greeting = format!("Hello, {name}! You have {} messages.", 5);`,
            note: '`format!` creates a new String without printing. Most string methods return new values since strings are UTF-8 and mutation is complex. Use `split`, `trim`, `replace` for common transformations.',
            explanation: {
              heading: 'Working with string data',
              intro: 'The standard library offers a rich set of methods for searching, transforming, and splitting strings. Many return new values or borrowed slices rather than mutating in place, which suits the UTF-8 representation.',
              points: [
                { term: 'Building strings', detail: 'The format macro assembles a new String from a template and arguments without printing, which is the idiomatic way to compose text.' },
                { term: 'Transformations return new data', detail: 'Methods like to_uppercase and replace produce a fresh String, because changing bytes in place could break UTF-8 boundaries.' },
                { term: 'Splitting yields slices', detail: 'Methods such as split and split_whitespace return iterators of borrowed slices into the original string, avoiding extra allocations.' },
                { term: 'Trimming borrows', detail: 'The trim family returns a slice of the existing buffer, so it removes surrounding whitespace without copying the retained characters.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 17. Smart Pointers
  {
    id: 'rust-smart-pointers',
    title: 'Smart Pointers',
    level: 1,
    slug: 'smart-pointers',
    concepts: [],
    children: [
      {
        id: 'rust-box',
        title: 'Box<T> & Rc<T>',
        level: 2,
        slug: 'box-rc',
        concepts: [
          {
            id: 'rust-box-intro',
            code: `// Box<T> — heap allocation with single ownership
let boxed = Box::new(42);
println!("{boxed}"); // auto-derefs

// Recursive types need indirection
enum List {
    Cons(i32, Box<List>),
    Nil,
}
let list = List::Cons(1, Box::new(List::Cons(2, Box::new(List::Nil))));

// Rc<T> — reference counting (single-threaded shared ownership)
use std::rc::Rc;

let shared = Rc::new(String::from("shared data"));
let clone1 = Rc::clone(&shared); // increments count, no deep copy
let clone2 = Rc::clone(&shared);
println!("References: {}", Rc::strong_count(&shared)); // 3`,
            note: '`Box<T>` puts data on the heap with single ownership — useful for recursive types or large data. `Rc<T>` enables multiple owners via reference counting (single-threaded only). Neither allows mutation of inner data.',
            explanation: {
              heading: 'Heap ownership pointers',
              intro: 'Box and Rc are smart pointers that store data on the heap while following ownership rules. Box provides a single owner, and Rc allows several owners of the same data through reference counting.',
              points: [
                { term: 'Box for single ownership', detail: 'A Box owns one heap allocated value and behaves like the value itself through automatic dereferencing, freeing it when the Box is dropped.' },
                { term: 'Enabling recursive types', detail: 'Because a Box has a known pointer size, it breaks the infinite size problem that arises when a type would otherwise contain itself directly.' },
                { term: 'Rc shares ownership', detail: 'Rc keeps a count of owners and only frees the data when the last clone is dropped, letting several parts of a program share read only data.' },
                { term: 'Single threaded only', detail: 'Rc uses non atomic counting and is not thread safe, so cross thread sharing requires the atomic Arc instead.' },
                { term: 'No inner mutation', detail: 'Neither type grants mutable access to shared data by itself, so combine Rc with a cell type when interior mutability is needed.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'rust-refcell-arc',
        title: 'RefCell<T> & Arc<T>',
        level: 2,
        slug: 'refcell-arc',
        concepts: [
          {
            id: 'rust-refcell-intro',
            code: `use std::cell::RefCell;
use std::rc::Rc;
use std::sync::Arc;

// RefCell<T> — interior mutability (runtime borrow checking)
let data = RefCell::new(vec![1, 2, 3]);
data.borrow_mut().push(4); // mutable borrow at runtime
println!("{:?}", data.borrow()); // [1, 2, 3, 4]

// Common pattern: Rc<RefCell<T>> — shared + mutable
let shared = Rc::new(RefCell::new(0));
let a = Rc::clone(&shared);
let b = Rc::clone(&shared);
*a.borrow_mut() += 10;
*b.borrow_mut() += 20;
println!("{}", shared.borrow()); // 30

// Arc<T> — atomic reference counting (thread-safe Rc)
use std::thread;
let arc_data = Arc::new(vec![1, 2, 3]);
let arc_clone = Arc::clone(&arc_data);
let handle = thread::spawn(move || {
    println!("From thread: {:?}", arc_clone);
});
handle.join().unwrap();`,
            note: '`RefCell<T>` enables interior mutability with runtime borrow checks — panics if rules are violated. `Arc<T>` is the thread-safe version of `Rc<T>` using atomic operations. Combine `Arc<Mutex<T>>` for shared mutable state across threads.',
            explanation: {
              heading: 'Interior mutability and sharing',
              intro: 'RefCell and Arc extend what the basic smart pointers allow. RefCell moves borrow checking to runtime so you can mutate through a shared reference, and Arc is the thread safe reference counter.',
              points: [
                { term: 'Runtime borrow checks', detail: 'RefCell tracks borrows at runtime rather than compile time, allowing mutation through a shared reference but panicking if the borrow rules are broken.' },
                { term: 'Rc plus RefCell', detail: 'Wrapping a RefCell in an Rc gives multiple owners that can each mutate the shared value, a common pattern for single threaded shared state.' },
                { term: 'Arc for threads', detail: 'Arc counts owners with atomic operations so it can be safely shared across threads, at a small performance cost versus Rc.' },
                { term: 'Arc plus Mutex', detail: 'Since Arc alone gives only shared read access, combine it with a Mutex to allow synchronized mutation of shared state from several threads.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 18. Concurrency
  {
    id: 'rust-concurrency',
    title: 'Concurrency',
    level: 1,
    slug: 'concurrency',
    concepts: [],
    children: [
      {
        id: 'rust-threads',
        title: 'Threads & Message Passing',
        level: 2,
        slug: 'threads',
        concepts: [
          {
            id: 'rust-threads-intro',
            code: `use std::thread;
use std::sync::mpsc; // multiple producer, single consumer
use std::time::Duration;

// Spawning threads
let handle = thread::spawn(|| {
    for i in 1..5 {
        println!("spawned thread: {i}");
        thread::sleep(Duration::from_millis(1));
    }
});
handle.join().unwrap(); // wait for thread to finish

// Channels for message passing
let (tx, rx) = mpsc::channel();
let tx2 = tx.clone(); // multiple producers

thread::spawn(move || {
    tx.send(String::from("hello from tx1")).unwrap();
});
thread::spawn(move || {
    tx2.send(String::from("hello from tx2")).unwrap();
});

for received in rx {
    println!("Got: {received}");
}`,
            note: 'Rust\'s ownership system prevents data races at compile time. Channels implement "share memory by communicating." `mpsc::channel` gives a transmitter/receiver pair. Clone `tx` for multiple producers.',
            explanation: {
              heading: 'Threads and channels',
              intro: 'Rust lets you spawn operating system threads and coordinate them through channels that pass ownership of messages. The ownership system extends across threads to rule out data races at compile time.',
              points: [
                { term: 'Spawning threads', detail: 'The spawn function starts a new thread running a closure, and joining its handle blocks until that thread finishes so results are not lost.' },
                { term: 'Move into threads', detail: 'A thread closure usually needs the move keyword so it takes ownership of the data it uses, since the new thread may outlive the spawning scope.' },
                { term: 'Message passing', detail: 'A channel provides a transmitter and receiver pair, and sending a value transfers its ownership to the receiving thread rather than sharing memory.' },
                { term: 'Multiple producers', detail: 'Cloning the transmitter lets several threads send into the same receiver, following the multiple producer single consumer model.' },
                { term: 'Compile time safety', detail: 'Because ownership moves with each message, two threads never hold mutable access to the same value at once, which prevents data races.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'rust-mutex',
        title: 'Mutex & Shared State',
        level: 2,
        slug: 'mutex',
        concepts: [
          {
            id: 'rust-mutex-intro',
            code: `use std::sync::{Arc, Mutex};
use std::thread;

let counter = Arc::new(Mutex::new(0));
let mut handles = vec![];

for _ in 0..10 {
    let counter = Arc::clone(&counter);
    let handle = thread::spawn(move || {
        let mut num = counter.lock().unwrap();
        *num += 1;
    }); // MutexGuard dropped here, lock released
    handles.push(handle);
}

for handle in handles {
    handle.join().unwrap();
}
println!("Result: {}", *counter.lock().unwrap()); // 10`,
            note: '`Mutex<T>` provides mutual exclusion — `lock()` returns a `MutexGuard` that auto-unlocks on drop. Pair with `Arc` for multi-threaded shared ownership. The compiler ensures you cannot access data without holding the lock.',
            explanation: {
              heading: 'Synchronized shared state',
              intro: 'A Mutex protects shared data by allowing only one thread to access it at a time. In Rust the data lives inside the mutex, so the type system ensures you can only reach it while holding the lock.',
              points: [
                { term: 'Data lives in the lock', detail: 'Unlike lock primitives that guard nothing in particular, a Mutex wraps the protected value, so access is impossible without locking first.' },
                { term: 'Guard based unlocking', detail: 'Calling lock returns a guard that dereferences to the data, and the lock releases automatically when the guard is dropped at the end of scope.' },
                { term: 'Pair with Arc', detail: 'To share a mutex across threads you wrap it in an Arc, giving each thread an owned handle to the same synchronized value.' },
                { term: 'Poisoning', detail: 'If a thread panics while holding the lock the mutex becomes poisoned, so lock returns a Result to signal that the data may be inconsistent.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 19. Async/Await
  {
    id: 'rust-async',
    title: 'Async / Await',
    level: 1,
    slug: 'async-await',
    concepts: [],
    children: [
      {
        id: 'rust-async-basics',
        title: 'Async Functions & Futures',
        level: 2,
        slug: 'async-basics',
        concepts: [
          {
            id: 'rust-async-intro',
            code: `// async fn returns impl Future<Output = T>
async fn fetch_data(url: &str) -> Result<String, reqwest::Error> {
    let response = reqwest::get(url).await?;
    let body = response.text().await?;
    Ok(body)
}

// Futures are lazy — nothing happens until polled
async fn process() {
    let data = fetch_data("https://api.example.com").await;
    match data {
        Ok(body) => println!("Got {} bytes", body.len()),
        Err(e) => eprintln!("Error: {e}"),
    }
}

// Running with tokio runtime
#[tokio::main]
async fn main() {
    // Concurrent execution
    let (a, b) = tokio::join!(
        fetch_data("https://api.example.com/a"),
        fetch_data("https://api.example.com/b"),
    );
}`,
            note: 'Async functions return a `Future` that must be `.await`ed or spawned on a runtime (like tokio or async-std). Futures are lazy and zero-cost. `tokio::join!` runs futures concurrently. The `?` operator works in async functions.',
            explanation: {
              heading: 'Asynchronous functions',
              intro: 'An async function returns a future, a value that represents a computation which will complete later. Futures do nothing on their own and must be awaited or driven by a runtime that polls them to completion.',
              points: [
                { term: 'Futures are lazy', detail: 'Calling an async function only builds a future and runs no code, so the work happens only once something awaits or spawns it.' },
                { term: 'Awaiting', detail: 'The await keyword suspends the current async function until the awaited future is ready, yielding control so the runtime can progress other tasks meanwhile.' },
                { term: 'A runtime is required', detail: 'Rust ships the future abstraction but not an executor, so a runtime such as tokio is needed to poll futures and schedule tasks.' },
                { term: 'Concurrent combinators', detail: 'A join combinator polls several futures together so their waiting overlaps, which is more efficient than awaiting each one in sequence.' },
                { term: 'Error propagation', detail: 'The question mark operator works inside async functions, so fallible awaited calls propagate errors just as they do in synchronous code.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'rust-async-patterns',
        title: 'Spawning & Select',
        level: 2,
        slug: 'async-patterns',
        concepts: [
          {
            id: 'rust-spawn-select',
            code: `use tokio::time::{sleep, Duration};

// Spawning independent tasks
async fn background_work() {
    let handle = tokio::spawn(async {
        sleep(Duration::from_secs(1)).await;
        42
    });
    let result = handle.await.unwrap(); // 42
}

// tokio::select! — race multiple futures
async fn timeout_fetch(url: &str) -> Option<String> {
    tokio::select! {
        result = fetch_data(url) => result.ok(),
        _ = sleep(Duration::from_secs(5)) => {
            eprintln!("Timeout!");
            None
        }
    }
}`,
            note: '`tokio::spawn` runs a future on the runtime as an independent task. `select!` races multiple futures and returns when the first completes — useful for timeouts, cancellation, and multiplexing.',
            explanation: {
              heading: 'Spawning and racing tasks',
              intro: 'Beyond awaiting a single future, async runtimes let you launch independent tasks and race several futures against each other. These primitives support concurrency patterns like background work and timeouts.',
              points: [
                { term: 'Independent tasks', detail: 'Spawning schedules a future to run concurrently as its own task, returning a handle you can await later to collect its result.' },
                { term: 'Racing with select', detail: 'The select macro polls several futures at once and proceeds with the first to complete, cancelling the rest, which is ideal for timeouts.' },
                { term: 'Send bounds on tasks', detail: 'A spawned task may move to another worker thread, so the future and its captures generally must be Send, which the compiler enforces.' },
                { term: 'Cancellation', detail: 'Dropping a future stops its progress, so racing a timeout against work naturally cancels the slower branch without extra bookkeeping.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 20. Macros
  {
    id: 'rust-macros',
    title: 'Macros',
    level: 1,
    slug: 'macros',
    concepts: [],
    children: [
      {
        id: 'rust-declarative-macros',
        title: 'Declarative Macros (macro_rules!)',
        level: 2,
        slug: 'declarative-macros',
        concepts: [
          {
            id: 'rust-macro-rules',
            code: `// Simple macro
macro_rules! say_hello {
    () => { println!("Hello!") };
    ($name:expr) => { println!("Hello, {}!", $name) };
}

say_hello!();         // "Hello!"
say_hello!("Rust");   // "Hello, Rust!"

// Variadic macro (like vec![])
macro_rules! my_vec {
    () => { Vec::new() };
    ($($element:expr),+ $(,)?) => {{
        let mut v = Vec::new();
        $( v.push($element); )+
        v
    }};
}

let v = my_vec![1, 2, 3];

// HashMap shorthand macro
macro_rules! hashmap {
    ($($key:expr => $val:expr),* $(,)?) => {{
        let mut map = std::collections::HashMap::new();
        $( map.insert($key, $val); )*
        map
    }};
}
let m = hashmap!{ "a" => 1, "b" => 2 };`,
            note: 'Declarative macros (`macro_rules!`) work by pattern matching on token trees. They run at compile time and generate code. The `$(...)+` syntax repeats for one or more matches, `$(...)*` for zero or more.',
            explanation: {
              heading: 'Pattern based code generation',
              intro: 'Declarative macros let you match on the syntax of the tokens passed to them and expand into new code at compile time. They are hygienic and enable variadic, syntax level features that ordinary functions cannot express.',
              points: [
                { term: 'Match on tokens', detail: 'A macro rule pairs a pattern of token trees with a template, so calling the macro selects the first matching rule and substitutes captured fragments.' },
                { term: 'Fragment specifiers', detail: 'Captured pieces are typed as fragments such as expression or identifier, which tells the parser how to read each part of the input.' },
                { term: 'Repetition', detail: 'Repetition syntax expands a pattern for a sequence of inputs, with one form requiring at least one match and another allowing zero or more.' },
                { term: 'Compile time expansion', detail: 'Macros expand before type checking, so they generate real code with no runtime cost, which is how constructs like the vector macro work.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'rust-derive-macros',
        title: 'Derive & Procedural Macros',
        level: 2,
        slug: 'derive-macros',
        concepts: [
          {
            id: 'rust-proc-macro',
            code: `// Using derive macros (most common procedural macros)
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
struct Point {
    x: i32,
    y: i32,
}

// serde — the most popular derive macro crate
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
struct Config {
    host: String,
    port: u16,
    #[serde(default)]
    debug: bool,
}

// Attribute macros (e.g., from frameworks)
// #[tokio::main]     — transforms main into async runtime
// #[test]            — marks a function as a test
// #[cfg(test)]       — conditional compilation

// Custom derive macros are defined in separate proc-macro crates
// using the syn and quote crates to parse and generate token streams`,
            note: 'Procedural macros operate on Rust syntax at compile time. Derive macros auto-implement traits. Attribute macros transform items. They are defined in separate crates using `proc_macro`, `syn`, and `quote`.',
            explanation: {
              heading: 'Procedural macros',
              intro: 'Procedural macros are functions that receive Rust code as a stream of tokens and produce new tokens, running at compile time. They power features like automatically implementing traits with a derive attribute.',
              points: [
                { term: 'Derive macros', detail: 'A derive macro reads a struct or enum definition and generates a trait implementation for it, which is why deriving Debug or Clone saves so much boilerplate.' },
                { term: 'Attribute and function macros', detail: 'Attribute macros can transform the item they annotate, while function like procedural macros are invoked with parentheses and expand their arguments.' },
                { term: 'Separate crate', detail: 'Procedural macros must live in their own crate marked as a proc macro, because they are compiled and run as part of the compiler.' },
                { term: 'Parsing and generating', detail: 'The common approach parses tokens with the syn crate and emits new code with the quote crate, giving structured control over the output.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 21. Modules & Crates
  {
    id: 'rust-modules',
    title: 'Modules & Crates',
    level: 1,
    slug: 'modules',
    concepts: [],
    children: [
      {
        id: 'rust-mod-system',
        title: 'Module System',
        level: 2,
        slug: 'mod-system',
        concepts: [
          {
            id: 'rust-mod-intro',
            code: `// src/lib.rs or src/main.rs
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
        fn seat_at_table() {} // private
    }

    mod serving {
        fn take_order() {}
    }
}

// Absolute path
crate::front_of_house::hosting::add_to_waitlist();

// Use statement with alias
use front_of_house::hosting;
hosting::add_to_waitlist();

// Re-exporting
pub use front_of_house::hosting as public_hosting;

// File-based modules: mod.rs or filename.rs
// src/routes/mod.rs  OR  src/routes.rs
// src/routes/users.rs`,
            note: 'Modules control privacy and namespace. Everything is private by default — use `pub` to expose. `use` brings paths into scope. Modules map to files: `mod foo;` looks for `foo.rs` or `foo/mod.rs`.',
            explanation: {
              heading: 'Organizing with modules',
              intro: 'Modules group related items into namespaces and control what is visible outside them. They form a tree rooted at the crate and map naturally onto the file system for larger projects.',
              points: [
                { term: 'Private by default', detail: 'Items are private to their module unless marked with pub, which enforces encapsulation and keeps internal details from leaking.' },
                { term: 'Paths and use', detail: 'You refer to items by a path through the module tree, and a use declaration brings a path into scope so you can name it without the full prefix.' },
                { term: 'File mapping', detail: 'Declaring a module by name without a body tells the compiler to load it from a matching file or a directory with a module file inside.' },
                { term: 'Re exporting', detail: 'A pub use statement re exports an item under a new path, letting you present a clean public interface while hiding internal structure.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'rust-cargo-deps',
        title: 'Cargo & Dependencies',
        level: 2,
        slug: 'cargo-deps',
        concepts: [
          {
            id: 'rust-cargo-intro',
            code: `// Cargo.toml
// [package]
// name = "my-project"
// version = "0.1.0"
// edition = "2021"
//
// [dependencies]
// serde = { version = "1.0", features = ["derive"] }
// tokio = { version = "1", features = ["full"] }
// anyhow = "1.0"
//
// [dev-dependencies]
// criterion = "0.5"

// Common cargo commands:
// cargo new my-project      — create new project
// cargo build               — compile
// cargo build --release     — optimized build
// cargo run                 — compile and run
// cargo test                — run tests
// cargo doc --open          — generate and open docs
// cargo clippy              — linter
// cargo fmt                 — format code`,
            note: 'Cargo is Rust\'s build system and package manager. `Cargo.toml` declares metadata and dependencies. `Cargo.lock` pins exact versions. Features enable optional functionality in dependencies.',
            explanation: {
              heading: 'Building with Cargo',
              intro: 'Cargo is the official build tool and package manager that compiles code, runs tests, and manages dependencies. A manifest file describes the package, and a lock file records the exact versions used.',
              points: [
                { term: 'The manifest', detail: 'The Cargo manifest lists package metadata and the dependencies your crate needs, along with their version requirements.' },
                { term: 'The lock file', detail: 'Cargo records the precise resolved versions in a lock file so that builds are reproducible across machines and over time.' },
                { term: 'Features', detail: 'Features toggle optional pieces of a dependency, letting you enable only the functionality you need and keep compile times down.' },
                { term: 'Common commands', detail: 'Subcommands build, run, and test the project, while a release flag turns on optimizations for production builds.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 22. Testing
  {
    id: 'rust-testing',
    title: 'Testing',
    level: 1,
    slug: 'testing',
    concepts: [],
    children: [
      {
        id: 'rust-unit-tests',
        title: 'Unit & Integration Tests',
        level: 2,
        slug: 'unit-tests',
        concepts: [
          {
            id: 'rust-test-intro',
            code: `// Unit tests — in the same file
pub fn add(a: i32, b: i32) -> i32 { a + b }

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add() {
        assert_eq!(add(2, 3), 5);
    }

    #[test]
    fn test_add_negative() {
        assert_eq!(add(-1, 1), 0);
    }

    #[test]
    #[should_panic(expected = "overflow")]
    fn test_overflow() {
        panic!("overflow");
    }

    #[test]
    fn test_result() -> Result<(), String> {
        if add(2, 2) == 4 {
            Ok(())
        } else {
            Err("math is broken".into())
        }
    }
}`,
            note: '`#[cfg(test)]` compiles the module only for testing. `#[test]` marks test functions. Use `assert!`, `assert_eq!`, `assert_ne!` for assertions. Tests can return `Result` to use `?` for cleaner error handling.',
            explanation: {
              heading: 'Built in testing',
              intro: 'Rust has testing support baked into the language and Cargo, so you write tests alongside your code and run them with a single command. Attributes mark test code so it is excluded from normal builds.',
              points: [
                { term: 'Test attribute', detail: 'A function annotated as a test is run by the test harness, and it passes unless it panics or returns an error.' },
                { term: 'Conditional compilation', detail: 'Marking a module for test configuration means it compiles only during testing, so helper code and assertions add nothing to release builds.' },
                { term: 'Assertion macros', detail: 'The assert family checks conditions and equality, printing the compared values on failure to make the cause of a break obvious.' },
                { term: 'Unit versus integration', detail: 'Unit tests live inside the module they exercise and can reach private items, while integration tests sit in a separate directory and use only the public interface.' },
                { term: 'Returning Result', detail: 'A test may return a Result so it can use the question mark operator, letting failures surface as errors instead of manual unwrapping.' },
              ],
            },
            example: `// Integration tests go in tests/ directory
// tests/integration_test.rs
use my_crate::add;

#[test]
fn it_adds() {
    assert_eq!(add(10, 20), 30);
}`,
          },
        ],
        children: [],
      },
    ],
  },

  // 23. Unsafe Rust
  {
    id: 'rust-unsafe',
    title: 'Unsafe Rust',
    level: 1,
    slug: 'unsafe-rust',
    concepts: [],
    children: [
      {
        id: 'rust-unsafe-basics',
        title: 'Unsafe Superpowers',
        level: 2,
        slug: 'unsafe-basics',
        concepts: [
          {
            id: 'rust-unsafe-intro',
            code: `// Unsafe allows 5 things the safe compiler forbids:
// 1. Dereference raw pointers
let mut num = 5;
let r1 = &num as *const i32;   // raw pointer (immutable)
let r2 = &mut num as *mut i32; // raw pointer (mutable)
unsafe {
    println!("r1 = {}", *r1);
    *r2 = 10;
}

// 2. Call unsafe functions
unsafe fn dangerous() {
    // contract: caller must ensure safety invariants
}
unsafe { dangerous(); }

// 3. Safe abstraction over unsafe code
fn split_at_mut(values: &mut [i32], mid: usize) -> (&mut [i32], &mut [i32]) {
    let len = values.len();
    let ptr = values.as_mut_ptr();
    assert!(mid <= len);
    unsafe {
        (
            std::slice::from_raw_parts_mut(ptr, mid),
            std::slice::from_raw_parts_mut(ptr.add(mid), len - mid),
        )
    }
}`,
            note: '`unsafe` does NOT turn off the borrow checker — it only unlocks five extra capabilities: raw pointer derefs, unsafe function calls, mutable static access, unsafe trait impls, and FFI. Minimize unsafe blocks and document safety invariants.',
            explanation: {
              heading: 'The unsafe contract',
              intro: 'The unsafe keyword unlocks a small set of operations the compiler cannot verify, shifting responsibility for upholding safety onto the programmer. It does not disable the ownership and borrow checking that governs the rest of the code.',
              points: [
                { term: 'Five extra powers', detail: 'Unsafe permits dereferencing raw pointers, calling unsafe functions, accessing mutable statics, implementing unsafe traits, and interfacing with foreign code.' },
                { term: 'Borrow checker stays on', detail: 'Ownership and borrowing rules remain fully enforced inside an unsafe block, so unsafe is far narrower than turning safety off entirely.' },
                { term: 'Uphold invariants', detail: 'You must manually guarantee the invariants the compiler normally checks, such as valid pointers and correct aliasing, or undefined behavior can result.' },
                { term: 'Safe abstractions', detail: 'Idiomatic Rust wraps a small unsafe core in a safe interface, keeping unsafe blocks tiny and documenting the conditions callers rely on.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'rust-ffi',
        title: 'FFI (Foreign Function Interface)',
        level: 2,
        slug: 'ffi',
        concepts: [
          {
            id: 'rust-ffi-intro',
            code: `// Calling C functions from Rust
extern "C" {
    fn abs(input: i32) -> i32;
    fn strlen(s: *const u8) -> usize;
}

fn main() {
    unsafe {
        println!("abs(-3) = {}", abs(-3));
    }
}

// Exposing Rust functions to C
#[no_mangle]
pub extern "C" fn rust_add(a: i32, b: i32) -> i32 {
    a + b
}`,
            note: 'FFI lets Rust call C code and be called from C. `extern "C"` uses the C calling convention. `#[no_mangle]` prevents Rust from changing the function name. All FFI calls are `unsafe` because Rust cannot verify foreign code.',
            explanation: {
              heading: 'Crossing the language boundary',
              intro: 'The foreign function interface lets Rust call functions written in C and expose Rust functions to C code. Because the compiler cannot verify foreign code, every such call sits in unsafe territory.',
              points: [
                { term: 'The C calling convention', detail: 'Declaring functions with the C ABI makes their argument passing and return layout match what a C compiler expects on both sides.' },
                { term: 'Stable symbol names', detail: 'Applying the no mangle attribute stops Rust from decorating a function name so external linkers can find it under its plain name.' },
                { term: 'Unsafe by nature', detail: 'Calling foreign code is unsafe because Rust cannot check the memory safety or contracts of code compiled outside its rules.' },
                { term: 'Raw pointers and types', detail: 'Data crossing the boundary uses raw pointers and layout compatible types, so you must manage lifetimes and ownership manually across the divide.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 24. Type System Advanced
  {
    id: 'rust-type-system',
    title: 'Advanced Type System',
    level: 1,
    slug: 'type-system',
    concepts: [],
    children: [
      {
        id: 'rust-newtype-alias',
        title: 'Newtype Pattern & Type Aliases',
        level: 2,
        slug: 'newtype-alias',
        concepts: [
          {
            id: 'rust-newtype-intro',
            code: `// Newtype pattern — wraps existing type for type safety
struct Meters(f64);
struct Seconds(f64);

impl Meters {
    fn new(val: f64) -> Self { Meters(val) }
}

// Cannot accidentally mix Meters and Seconds
fn speed(distance: Meters, time: Seconds) -> f64 {
    distance.0 / time.0
}

// Type alias — just a synonym, no type safety
type Kilometers = f64;
type Result<T> = std::result::Result<T, std::io::Error>;

// The never type (!) — for functions that never return
fn diverges() -> ! {
    panic!("This function never returns");
}`,
            note: 'The newtype pattern wraps a type in a single-field tuple struct for type safety and to implement foreign traits on foreign types. Type aliases create synonyms without new types. `!` is the never type for diverging functions.',
            explanation: {
              heading: 'Newtypes and aliases',
              intro: 'These tools shape how types appear and behave without runtime cost. A newtype creates a distinct type by wrapping another, while a type alias merely gives an existing type a second name.',
              points: [
                { term: 'Distinct newtypes', detail: 'Wrapping a value in a single field tuple struct produces a genuinely new type, so the compiler prevents mixing, for example, meters with seconds.' },
                { term: 'Working around the orphan rule', detail: 'A newtype lets you implement an external trait for an external type by wrapping it, since the wrapper is now local to your crate.' },
                { term: 'Aliases are synonyms', detail: 'A type alias introduces no new type and offers no extra safety, but it shortens long generic names to improve readability.' },
                { term: 'The never type', detail: 'The never type marks functions that never return, such as those that always panic or loop forever, and it coerces into any other type.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'rust-phantom-data',
        title: 'PhantomData & Zero-Sized Types',
        level: 2,
        slug: 'phantom-data',
        concepts: [
          {
            id: 'rust-phantom-intro',
            code: `use std::marker::PhantomData;

// PhantomData — tells compiler about unused type parameters
struct Slice<'a, T: 'a> {
    start: *const T,
    end: *const T,
    phantom: PhantomData<&'a T>, // "pretend" we hold a &'a T
}

// Zero-sized types for type-level state
struct Locked;
struct Unlocked;

struct Door<State> {
    _state: PhantomData<State>,
}

impl Door<Locked> {
    fn unlock(self) -> Door<Unlocked> {
        Door { _state: PhantomData }
    }
}

impl Door<Unlocked> {
    fn open(&self) { println!("Door opened!"); }
}

let door: Door<Locked> = Door { _state: PhantomData };
let door = door.unlock();
door.open(); // Only callable on unlocked doors`,
            note: '`PhantomData` allows type parameters that do not appear in struct fields — useful for lifetimes and type-state patterns. Zero-sized types enable compile-time state machines where invalid states are unrepresentable.',
            explanation: {
              heading: 'Marker types and zero size',
              intro: 'PhantomData is a marker that lets a type carry a generic parameter or lifetime it does not actually store. Combined with zero sized types, it enables encoding state in the type system with no runtime footprint.',
              points: [
                { term: 'Declaring intent', detail: 'PhantomData tells the compiler to treat a struct as though it held a value of a type or lifetime, which affects ownership, variance, and drop checking.' },
                { term: 'Zero sized types', detail: 'A type with no fields occupies no memory, so using it as a marker adds no cost while still being distinct to the type checker.' },
                { term: 'Type state pattern', detail: 'Encoding a state such as locked or unlocked as a type parameter lets the compiler reject calls that are invalid for the current state.' },
                { term: 'Lifetime tracking', detail: 'When a struct holds a raw pointer, a phantom reference field records the borrow so the borrow checker still enforces the intended lifetime.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 25. Error Handling Patterns
  {
    id: 'rust-error-patterns',
    title: 'Error Handling Patterns',
    level: 1,
    slug: 'error-patterns',
    concepts: [],
    children: [
      {
        id: 'rust-anyhow-thiserror',
        title: 'anyhow & thiserror',
        level: 2,
        slug: 'anyhow-thiserror',
        concepts: [
          {
            id: 'rust-error-crates',
            code: `// thiserror — for library error types
use thiserror::Error;

#[derive(Error, Debug)]
enum DataError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Parse error at line {line}: {message}")]
    Parse { line: usize, message: String },

    #[error("Not found: {0}")]
    NotFound(String),
}

// anyhow — for application error handling
use anyhow::{Context, Result};

fn load_config(path: &str) -> Result<Config> {
    let content = std::fs::read_to_string(path)
        .with_context(|| format!("Failed to read config: {path}"))?;
    let config: Config = toml::from_str(&content)
        .context("Failed to parse TOML")?;
    Ok(config)
}`,
            note: '`thiserror` auto-derives `Error` + `Display` + `From` for library error enums. `anyhow` provides a dynamic error type with context chaining for applications. Use thiserror in libraries, anyhow in binaries.',
            explanation: {
              heading: 'Ergonomic error crates',
              intro: 'Two popular crates streamline error handling for different audiences. The thiserror crate helps libraries define precise error types, and the anyhow crate gives applications a convenient catch all error type.',
              points: [
                { term: 'thiserror for libraries', detail: 'A derive macro generates the Display, Error, and From implementations for a custom enum, so a library exposes a well typed error with little boilerplate.' },
                { term: 'anyhow for applications', detail: 'The anyhow error type erases the concrete error behind a single dynamic type, which is convenient when a binary only needs to report and exit.' },
                { term: 'Adding context', detail: 'A context method attaches a descriptive message as an error travels up the stack, producing a readable chain that aids debugging.' },
                { term: 'Choosing between them', detail: 'Prefer thiserror where callers must match on specific errors, and reach for anyhow in top level application code where flexibility matters more.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 26. Traits in Depth
  {
    id: 'rust-traits-advanced',
    title: 'Traits in Depth',
    level: 1,
    slug: 'traits-advanced',
    concepts: [],
    children: [
      {
        id: 'rust-common-traits',
        title: 'Common Standard Traits',
        level: 2,
        slug: 'common-traits',
        concepts: [
          {
            id: 'rust-std-traits',
            code: `use std::fmt;

// Display — user-facing string representation
struct Color { r: u8, g: u8, b: u8 }

impl fmt::Display for Color {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "#{:02X}{:02X}{:02X}", self.r, self.g, self.b)
    }
}

// From/Into — type conversions
impl From<(u8, u8, u8)> for Color {
    fn from((r, g, b): (u8, u8, u8)) -> Self {
        Color { r, g, b }
    }
}
let c: Color = (255, 128, 0).into();

// Iterator
struct Fibonacci { a: u64, b: u64 }
impl Iterator for Fibonacci {
    type Item = u64;
    fn next(&mut self) -> Option<Self::Item> {
        let next = self.a + self.b;
        self.a = self.b;
        self.b = next;
        Some(self.a)
    }
}`,
            note: 'Key standard traits: `Display` (user output), `Debug` (developer output), `Clone`/`Copy` (duplication), `From`/`Into` (conversion), `Iterator` (sequences), `Default` (default values), `Drop` (cleanup).',
            explanation: {
              heading: 'The standard trait vocabulary',
              intro: 'A handful of standard library traits recur throughout Rust and define common behaviors that other code relies on. Implementing or deriving them makes your types cooperate with formatting, conversion, and iteration.',
              points: [
                { term: 'Formatting traits', detail: 'Display provides a user facing representation you write by hand, while Debug provides a developer view that can be derived automatically.' },
                { term: 'Duplication traits', detail: 'Clone gives an explicit deep copy, and Copy marks cheap stack values that duplicate implicitly on assignment rather than moving.' },
                { term: 'Conversion traits', detail: 'Implementing From for a type automatically grants the matching Into, which powers ergonomic conversions and the question mark operator.' },
                { term: 'Iterator and Default', detail: 'Implementing Iterator lets a type drive for loops, and Default supplies a sensible zero value used by many builder and container patterns.' },
                { term: 'Drop for cleanup', detail: 'Implementing Drop runs custom logic when a value goes out of scope, which is how Rust handles resource cleanup deterministically.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'rust-operator-overload',
        title: 'Operator Overloading',
        level: 2,
        slug: 'operator-overload',
        concepts: [
          {
            id: 'rust-ops-traits',
            code: `use std::ops::{Add, Mul};

#[derive(Debug, Clone, Copy)]
struct Vector2D { x: f64, y: f64 }

impl Add for Vector2D {
    type Output = Self;
    fn add(self, other: Self) -> Self {
        Vector2D { x: self.x + other.x, y: self.y + other.y }
    }
}

impl Mul<f64> for Vector2D {
    type Output = Self;
    fn mul(self, scalar: f64) -> Self {
        Vector2D { x: self.x * scalar, y: self.y * scalar }
    }
}

let a = Vector2D { x: 1.0, y: 2.0 };
let b = Vector2D { x: 3.0, y: 4.0 };
let c = a + b;        // Vector2D { x: 4.0, y: 6.0 }
let d = a * 2.0;     // Vector2D { x: 2.0, y: 4.0 }`,
            note: 'Operators in Rust are trait-based (`std::ops`). Implementing `Add`, `Sub`, `Mul`, `Index`, `Deref`, etc. lets your types use operators. The associated `Output` type allows flexible return types.',
            explanation: {
              heading: 'Operators as traits',
              intro: 'In Rust each operator corresponds to a trait, so a type gains operator support by implementing the matching trait. This keeps operator behavior explicit and lets it participate in generic code through bounds.',
              points: [
                { term: 'One trait per operator', detail: 'Traits in the ops module map to symbols, so implementing Add gives your type the plus operator and Mul gives it multiplication.' },
                { term: 'The Output type', detail: 'Each operator trait has an associated output type, which lets an operation return a different type than its operands when that makes sense.' },
                { term: 'Ownership of operands', detail: 'The standard operator methods take operands by value and thus consume them, so implement the trait for references when you want to avoid moves.' },
                { term: 'Deref and Index', detail: 'Beyond arithmetic, implementing Deref enables the dereference operator and Index enables bracket access, which smart pointers and collections rely on.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 27. Control Flow Advanced
  {
    id: 'rust-control-flow',
    title: 'Control Flow',
    level: 1,
    slug: 'control-flow',
    concepts: [],
    children: [
      {
        id: 'rust-loops',
        title: 'Loops & Loop Labels',
        level: 2,
        slug: 'loops',
        concepts: [
          {
            id: 'rust-loops-intro',
            code: `// loop — infinite loop, can return values
let mut counter = 0;
let result = loop {
    counter += 1;
    if counter == 10 {
        break counter * 2; // loop returns 20
    }
};

// Loop labels — break/continue outer loops
'outer: for i in 0..5 {
    for j in 0..5 {
        if i + j == 6 {
            break 'outer; // exits both loops
        }
        if j == 3 {
            continue 'outer; // skips to next i
        }
    }
}

// while and for
let mut n = 0;
while n < 5 { n += 1; }

for i in 0..5 { println!("{i}"); }       // 0 to 4
for i in 0..=5 { println!("{i}"); }      // 0 to 5 (inclusive)
for ch in "hello".chars() { print!("{ch} "); }`,
            note: '`loop` is for infinite loops and can return values via `break value`. Loop labels (`\'label:`) allow breaking/continuing outer loops from nested ones. `for` works with any type implementing `IntoIterator`.',
            explanation: {
              heading: 'Looping constructs',
              intro: 'Rust offers three loop forms plus labels for controlling nested iteration. Loops are expressions in the sense that an infinite loop can produce a value when it breaks.',
              points: [
                { term: 'The loop keyword', detail: 'A plain loop runs forever until a break, and breaking with a value makes the whole loop evaluate to that value, which is handy for retry logic.' },
                { term: 'while and for', detail: 'A while loop repeats while a condition holds, and a for loop walks any type that can produce an iterator, which is the idiomatic choice for sequences.' },
                { term: 'Loop labels', detail: 'Naming a loop with a label lets an inner loop break or continue an outer one directly, avoiding awkward flag variables.' },
                { term: 'For consumes iterators', detail: 'A for loop takes ownership through into_iter by default, so iterate over a reference when you want to keep using the collection afterward.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 28. Slices & Destructuring
  {
    id: 'rust-slices',
    title: 'Slices & Destructuring',
    level: 1,
    slug: 'slices',
    concepts: [],
    children: [
      {
        id: 'rust-slice-basics',
        title: 'Slice Types',
        level: 2,
        slug: 'slice-basics',
        concepts: [
          {
            id: 'rust-slice-intro',
            code: `// Slices are references to a contiguous sequence
fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &byte) in bytes.iter().enumerate() {
        if byte == b' ' {
            return &s[..i];
        }
    }
    s
}

let s = String::from("hello world");
let word = first_word(&s); // "hello"

// Array slices
let arr = [1, 2, 3, 4, 5];
let slice: &[i32] = &arr[1..4]; // [2, 3, 4]

// Destructuring in patterns
let (first, rest) = slice.split_first().unwrap();
println!("first: {first}, rest: {rest:?}");

// Slice patterns (Rust 1.26+)
match slice {
    [] => println!("empty"),
    [one] => println!("one element: {one}"),
    [first, .., last] => println!("first: {first}, last: {last}"),
}`,
            note: 'Slices (`&[T]` and `&str`) are fat pointers: a pointer + length. They provide a view into contiguous data without ownership. Slice patterns enable destructuring arrays and slices in `match` arms.',
            explanation: {
              heading: 'Views into contiguous data',
              intro: 'A slice is a borrowed view into a run of elements stored in something else, such as an array, vector, or string. It carries both a pointer and a length, so it knows exactly how much data it covers.',
              points: [
                { term: 'Fat pointer', detail: 'A slice reference stores a pointer to the first element together with the count, which lets it describe any subrange without copying the data.' },
                { term: 'Borrowed not owned', detail: 'A slice does not own its elements, so the borrow checker ensures the underlying collection outlives the slice and is not modified while it is alive.' },
                { term: 'Flexible parameters', detail: 'Accepting a slice lets a function work with arrays, vectors, and other contiguous sources uniformly, which makes APIs more general.' },
                { term: 'Slice patterns', detail: 'A match can destructure a slice by its shape, binding the first, last, or a rest portion, which reads cleanly for handling variable length data.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 29. Cargo & Project Structure
  {
    id: 'rust-project-structure',
    title: 'Project Structure',
    level: 1,
    slug: 'project-structure',
    concepts: [],
    children: [
      {
        id: 'rust-workspace',
        title: 'Workspaces & Project Layout',
        level: 2,
        slug: 'workspace',
        concepts: [
          {
            id: 'rust-workspace-intro',
            code: `// Typical project layout:
// my-project/
// ├── Cargo.toml          (workspace root or package manifest)
// ├── src/
// │   ├── main.rs         (binary entry point)
// │   ├── lib.rs          (library root)
// │   └── utils/
// │       ├── mod.rs      (module declaration)
// │       └── helpers.rs
// ├── tests/              (integration tests)
// │   └── api_test.rs
// ├── benches/            (benchmarks)
// │   └── bench.rs
// └── examples/
//     └── demo.rs

// Workspace Cargo.toml
// [workspace]
// members = ["crates/core", "crates/cli", "crates/api"]
// resolver = "2"
//
// [workspace.dependencies]
// serde = { version = "1.0", features = ["derive"] }
// tokio = { version = "1", features = ["full"] }

// Member crate can reference workspace deps:
// [dependencies]
// serde = { workspace = true }`,
            note: 'Workspaces let you manage multiple related crates in one repo, sharing a `Cargo.lock` and output directory. Use `src/main.rs` for binaries, `src/lib.rs` for libraries. The `tests/` directory holds integration tests.',
            explanation: {
              heading: 'Structuring larger projects',
              intro: 'Cargo defines conventional locations for source, tests, and examples, and workspaces let several crates live together in one repository. Following these conventions keeps builds predictable and tooling happy.',
              points: [
                { term: 'Binary and library roots', detail: 'The main source file is the entry point for an executable, while the library source file is the root of a reusable library crate.' },
                { term: 'Test and example directories', detail: 'Integration tests live in a dedicated tests directory and see only the public interface, while runnable examples sit in an examples directory.' },
                { term: 'Workspaces', detail: 'A workspace groups multiple crates that share one lock file and build output, which speeds up builds and keeps dependency versions aligned.' },
                { term: 'Shared dependencies', detail: 'Declaring dependencies at the workspace level lets member crates inherit consistent versions instead of each specifying its own.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 30. Fearless Concurrency Patterns
  {
    id: 'rust-concurrency-patterns',
    title: 'Concurrency Patterns',
    level: 1,
    slug: 'concurrency-patterns',
    concepts: [],
    children: [
      {
        id: 'rust-send-sync',
        title: 'Send & Sync Traits',
        level: 2,
        slug: 'send-sync',
        concepts: [
          {
            id: 'rust-send-sync-intro',
            code: `// Send: safe to transfer between threads
// Sync: safe to reference from multiple threads (&T is Send)

// Most types are Send + Sync automatically
// Rc<T> is NOT Send (use Arc<T> instead)
// RefCell<T> is NOT Sync (use Mutex<T> instead)
// Raw pointers are neither Send nor Sync

use std::sync::{Arc, Mutex, RwLock};

// RwLock — multiple readers OR one writer
let data = Arc::new(RwLock::new(vec![1, 2, 3]));

// Reader threads (concurrent)
let data_clone = Arc::clone(&data);
std::thread::spawn(move || {
    let read_guard = data_clone.read().unwrap();
    println!("Read: {:?}", *read_guard);
});

// Writer thread (exclusive)
let data_clone = Arc::clone(&data);
std::thread::spawn(move || {
    let mut write_guard = data_clone.write().unwrap();
    write_guard.push(4);
});`,
            note: '`Send` and `Sync` are marker traits that the compiler uses to guarantee thread safety. `Send` means ownership can transfer between threads. `Sync` means shared references are safe across threads. These are auto-implemented when all fields qualify.',
            explanation: {
              heading: 'Marker traits for thread safety',
              intro: 'Send and Sync are automatic marker traits that encode whether a type is safe to move between threads or share across them. The compiler uses them to make concurrency safe without any runtime checks.',
              points: [
                { term: 'Send meaning', detail: 'A type is Send when its ownership can be transferred to another thread safely, which is required to move a value into a spawned thread.' },
                { term: 'Sync meaning', detail: 'A type is Sync when a shared reference to it can be handed to multiple threads at once, meaning concurrent reads are safe.' },
                { term: 'Automatic derivation', detail: 'The compiler implements both traits automatically for a type when all of its fields qualify, so most ordinary types are thread safe by default.' },
                { term: 'Notable exceptions', detail: 'Reference counted Rc is not Send and a plain cell is not Sync, which is why cross thread sharing uses Arc together with a lock.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'rust-rayon',
        title: 'Parallel Iterators (Rayon)',
        level: 2,
        slug: 'rayon',
        concepts: [
          {
            id: 'rust-rayon-intro',
            code: `use rayon::prelude::*;

// Turn any iterator into a parallel one
let numbers: Vec<u64> = (0..1_000_000).collect();

let sum: u64 = numbers.par_iter().sum();

let squares: Vec<u64> = numbers.par_iter()
    .filter(|&&x| x % 2 == 0)
    .map(|&x| x * x)
    .collect();

// Parallel sort
let mut data = vec![5, 2, 8, 1, 9, 3];
data.par_sort();

// Custom parallel work
(0..100).into_par_iter().for_each(|i| {
    // each iteration may run on a different thread
    expensive_computation(i);
});`,
            note: 'The `rayon` crate provides data parallelism by replacing `.iter()` with `.par_iter()`. It uses work-stealing for load balancing. Thanks to Rust\'s type system, adding parallelism is often a one-line change with no data races.',
            explanation: {
              heading: 'Effortless data parallelism',
              intro: 'The rayon crate turns sequential iterator chains into parallel ones with a minimal change, distributing work across a thread pool. The type system guarantees the parallelism stays free of data races.',
              points: [
                { term: 'Parallel iterators', detail: 'Swapping the standard iterator method for the parallel one splits the work across threads while keeping the same familiar map and filter operations.' },
                { term: 'Work stealing', detail: 'Idle threads steal chunks of work from busy ones, which balances the load automatically without manual thread management.' },
                { term: 'Safety from the type system', detail: 'Because closures passed to parallel iterators must satisfy Send and Sync bounds, the compiler rejects code that could race, keeping parallelism safe.' },
                { term: 'When it pays off', detail: 'Parallelism helps for large workloads where the computation per element outweighs the overhead of splitting and coordinating threads.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 31. Enums in Depth
  {
    id: 'rust-enums-advanced',
    title: 'Enums in Depth',
    level: 1,
    slug: 'enums-advanced',
    concepts: [],
    children: [
      {
        id: 'rust-result-combinators',
        title: 'Result & Option Combinators',
        level: 2,
        slug: 'result-combinators',
        concepts: [
          {
            id: 'rust-combinators',
            code: `// Option combinators
let name: Option<String> = Some("Alice".into());
let greeting = name
    .as_deref()                   // Option<&str>
    .map(|n| format!("Hello, {n}!"))
    .unwrap_or_else(|| "Hello, stranger!".into());

// Chaining fallible operations with and_then
fn parse_port(s: &str) -> Option<u16> {
    s.strip_prefix(':')
        .and_then(|p| p.parse().ok())
}

// Result combinators
fn read_config() -> Result<Config, AppError> {
    std::fs::read_to_string("config.toml")
        .map_err(AppError::Io)?
        .parse::<Config>()
        .map_err(AppError::Parse)
}

// Converting between Option and Result
let opt: Option<i32> = Some(42);
let res: Result<i32, &str> = opt.ok_or("missing value");

let res: Result<i32, &str> = Err("oops");
let opt: Option<i32> = res.ok();`,
            note: 'Combinators transform `Option`/`Result` without explicit pattern matching: `map`, `and_then` (flatmap), `unwrap_or`, `ok_or`, `map_err`. They compose into readable chains for data transformations.',
            explanation: {
              heading: 'Composing fallible values',
              intro: 'Combinators are methods on Option and Result that transform, chain, and unwrap them without writing explicit match blocks. They let you express a pipeline of fallible steps as a readable chain.',
              points: [
                { term: 'Transforming the value', detail: 'The map method applies a function to the contained value while leaving the None or Err case untouched, which keeps success handling concise.' },
                { term: 'Chaining fallible steps', detail: 'The and_then method feeds the inner value into a function that itself returns an Option or Result, flattening nested wrappers.' },
                { term: 'Supplying defaults', detail: 'Methods such as unwrap_or and unwrap_or_else replace an empty or error case with a fallback value instead of panicking.' },
                { term: 'Converting between types', detail: 'The ok_or method turns an Option into a Result by attaching an error, and map_err rewrites an error into a different type for propagation.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 32. Memory & Performance
  {
    id: 'rust-memory',
    title: 'Memory & Performance',
    level: 1,
    slug: 'memory',
    concepts: [],
    children: [
      {
        id: 'rust-stack-heap',
        title: 'Stack vs Heap & Drop',
        level: 2,
        slug: 'stack-heap',
        concepts: [
          {
            id: 'rust-memory-intro',
            code: `// Stack: fixed-size, fast, automatic cleanup
let x: i32 = 42;        // on the stack
let arr = [0u8; 1024];  // on the stack (known size)

// Heap: dynamic size, manual-ish management via ownership
let s = String::from("heap allocated");  // data on heap
let v = vec![1, 2, 3];                  // data on heap

// Drop trait — custom cleanup
struct FileHandle { name: String }

impl Drop for FileHandle {
    fn drop(&mut self) {
        println!("Closing file: {}", self.name);
        // cleanup logic here
    }
}

{
    let _f = FileHandle { name: "data.txt".into() };
} // drop() called here automatically

// std::mem utilities
let size = std::mem::size_of::<i64>();   // 8 bytes
let v_size = std::mem::size_of::<Vec<i32>>(); // 24 bytes (ptr + len + cap)
let opt_size = std::mem::size_of::<Option<&i32>>(); // 8 (null-pointer optimization)`,
            note: 'Rust has no garbage collector. Stack memory is freed when scope ends. Heap data is freed when its owner is dropped. The `Drop` trait provides deterministic cleanup (like RAII in C++). The compiler applies null-pointer optimization to `Option<&T>`.',
            explanation: {
              heading: 'Memory model and cleanup',
              intro: 'Rust manages memory through ownership rather than a garbage collector, so cleanup is deterministic. Values on the stack disappear when their scope ends, and heap data is freed the moment its owner is dropped.',
              points: [
                { term: 'Stack versus heap', detail: 'Fixed size values live on the fast stack and are released when the scope exits, while dynamically sized data lives on the heap behind an owning type.' },
                { term: 'Ownership drives freeing', detail: 'Heap data is released exactly when its single owner goes out of scope, which gives predictable timing without a background collector.' },
                { term: 'The Drop trait', detail: 'Implementing Drop lets a type run cleanup logic automatically when it is destroyed, mirroring the resource acquisition is initialization pattern from C plus plus.' },
                { term: 'Layout optimizations', detail: 'The compiler can shrink types like an optional reference by using a special null representation for the empty case, saving space with no extra tag.' },
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
