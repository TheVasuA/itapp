const topics = [
  // 1. Fundamentals
  {
    id: 'cpp-fundamentals',
    title: 'Fundamentals',
    level: 1,
    slug: 'fundamentals',
    concepts: [],
    children: [
      {
        id: 'cpp-hello-world',
        title: 'Hello World and Program Structure',
        level: 2,
        slug: 'hello-world',
        concepts: [
          {
            id: 'cpp-hello-world-intro',
            code: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
            note: 'Every C++ program starts at `main()`. `#include` brings in headers. `std::cout` writes to standard output. `return 0` signals success.',
            explanation: {
              heading: 'Anatomy of a C++ program',
              intro: 'Every C++ program is compiled to native code and begins execution at a single entry point named main. The pieces in a hello world program map directly onto the core mechanics you use in every larger program.',
              points: [
                { term: 'The main entry point', detail: 'Execution always starts at the function named main, which returns an int. Returning zero tells the operating system the program finished successfully, while a non zero value signals an error.' },
                { term: 'Include directives', detail: 'The line beginning with hash include asks the preprocessor to pull in a header such as iostream, which declares the stream objects and operators needed for input and output.' },
                { term: 'Streams and the insertion operator', detail: 'std cout is the standard output stream and the double left angle operator feeds values into it. Chaining lets you write several items in one statement.' },
                { term: 'The std namespace', detail: 'Standard library names live in the std namespace, so you qualify them as std cout. This avoids clashes with your own identifiers and is why the std prefix appears everywhere.' },
                { term: 'Newlines and flushing', detail: 'Using std endl both writes a newline and flushes the buffer, which can be slower in loops. Prefer a plain newline character when you do not need an immediate flush.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cpp-compilation',
        title: 'Compilation and Linking',
        level: 2,
        slug: 'compilation',
        concepts: [
          {
            id: 'cpp-compilation-intro',
            code: '// Compile: g++ -std=c++20 -Wall -o app main.cpp\n// Stages: preprocessing -> compilation -> assembly -> linking',
            note: 'C++ is compiled to native machine code. The preprocessor expands macros and includes, the compiler produces object files, and the linker combines them into an executable.',
            explanation: {
              heading: 'From source to executable',
              intro: 'A C++ build runs through distinct stages, and understanding them helps you diagnose whether a problem is a syntax error, a missing definition, or an unresolved symbol. Each stage produces a well defined artifact.',
              points: [
                { term: 'Preprocessing', detail: 'The preprocessor handles directives that start with hash, expanding include files and macros into a single translation unit before the compiler proper ever sees the code.' },
                { term: 'Compilation to object files', detail: 'The compiler translates each translation unit into an object file of machine code, resolving names within that file but leaving references to external functions unresolved.' },
                { term: 'Linking', detail: 'The linker stitches object files and libraries together, matching each external reference to a single definition. A missing or duplicated definition produces a link error rather than a compile error.' },
                { term: 'Separate compilation', detail: 'Splitting code across files lets you rebuild only what changed, which speeds up large projects. Headers declare interfaces while source files provide the definitions.' },
                { term: 'Useful compiler flags', detail: 'Passing a standard flag such as std c plus plus twenty selects the language version, and enabling all warnings catches many bugs before they reach runtime.' },
              ],
            },
            example: '// Separate compilation:\n// g++ -c math.cpp -o math.o\n// g++ -c main.cpp -o main.o\n// g++ math.o main.o -o app',
          },
        ],
        children: [],
      },
    ],
  },

  // 2. Variables and Data Types
  {
    id: 'cpp-variables',
    title: 'Variables & Data Types',
    level: 1,
    slug: 'variables-types',
    concepts: [],
    children: [
      {
        id: 'cpp-primitive-types',
        title: 'Primitive Types',
        level: 2,
        slug: 'primitive-types',
        concepts: [
          {
            id: 'cpp-primitive-types-intro',
            code: 'int age = 30;\ndouble pi = 3.14159;\nchar grade = \'A\';\nbool isActive = true;\nlong long bigNum = 9\'000\'000\'000LL;',
            note: 'C++ has fundamental types: `int`, `double`, `float`, `char`, `bool`, `long long`. Digit separators (`\'`) improve readability. Size varies by platform — use `<cstdint>` for fixed-width types.',
            explanation: {
              heading: 'Choosing fundamental types',
              intro: 'C++ provides a small set of built in types for integers, floating point numbers, characters, and booleans. Picking the right one affects correctness, portability, and performance.',
              points: [
                { term: 'Integer types', detail: 'Types like int and long long store whole numbers. The int type is meant to match the natural word size of the machine, so it is a sensible default for counting and indexing.' },
                { term: 'Floating point types', detail: 'The double type offers about fifteen significant digits and is the default for real numbers, while float trades precision for smaller size. Neither can represent every decimal exactly.' },
                { term: 'Platform dependent sizes', detail: 'The exact width of int and long can differ across compilers and operating systems. When you need a guaranteed size, reach for the fixed width aliases in the cstdint header such as int thirty two.' },
                { term: 'Characters and booleans', detail: 'A char holds a single byte and often a text character, while bool holds only true or false. Mixing them with integer arithmetic can surprise you, so keep their roles clear.' },
                { term: 'Readability helpers', detail: 'Digit separators let you group long numeric literals for readability, and suffixes such as the double L mark a literal as long long so it does not overflow a narrower type.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cpp-type-inference',
        title: 'Type Inference with auto and decltype',
        level: 2,
        slug: 'type-inference',
        concepts: [
          {
            id: 'cpp-auto-decltype',
            code: 'auto x = 42;          // int\nauto y = 3.14;        // double\nauto name = std::string("C++");\n\ndecltype(x) z = 100;  // int, same type as x',
            note: '`auto` deduces the type from the initializer. `decltype` queries the type of an expression without evaluating it. Prefer `auto` for complex iterator types and lambda captures.',
            explanation: {
              heading: 'Letting the compiler deduce types',
              intro: 'Type inference lets you write variables without spelling out verbose type names, keeping code readable while the compiler still enforces static typing. Two tools cover most cases: auto and decltype.',
              points: [
                { term: 'How auto deduces', detail: 'The auto keyword takes the type from the initializer using the same rules as template argument deduction, which by default strips references and top level const qualifiers.' },
                { term: 'When auto shines', detail: 'It removes noise for long iterator and lambda types where writing the full name is impractical or impossible, and it prevents accidental narrowing conversions.' },
                { term: 'What decltype does', detail: 'The decltype operator reports the declared type of an expression without evaluating it, preserving references and const, which makes it precise for return types and forwarding.' },
                { term: 'A common gotcha', detail: 'Because plain auto drops references, use auto with an ampersand when you want to bind to and modify an existing object rather than copy it.' },
                { term: 'Balance readability', detail: 'Overusing auto can hide important types from a reader. Prefer it where the type is obvious or unwieldy, and write the type explicitly when it aids understanding.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 3. Operators
  {
    id: 'cpp-operators',
    title: 'Operators',
    level: 1,
    slug: 'operators',
    concepts: [],
    children: [
      {
        id: 'cpp-arithmetic-ops',
        title: 'Arithmetic and Assignment',
        level: 2,
        slug: 'arithmetic-operators',
        concepts: [
          {
            id: 'cpp-arithmetic-intro',
            code: 'int a = 10, b = 3;\nint sum = a + b;    // 13\nint mod = a % b;    // 1\na += 5;             // a = 15\nint pre = ++b;      // b=4, pre=4\nint post = b++;     // post=4, b=5',
            note: 'C++ supports `+`, `-`, `*`, `/`, `%`. Compound assignment (`+=`, `-=`) modifies in place. Pre-increment returns the new value; post-increment returns the old.',
            explanation: {
              heading: 'Arithmetic and increment behavior',
              intro: 'Arithmetic operators look familiar, but C++ has rules around integer division, modulo, and the two forms of increment that trip up newcomers. Knowing them avoids subtle bugs.',
              points: [
                { term: 'Integer versus real division', detail: 'Dividing two integers discards the fractional part and yields an integer. To get a real result, make at least one operand a floating point value.' },
                { term: 'The modulo operator', detail: 'The percent operator returns the remainder of integer division and is only defined for integer types. It is handy for wrapping indices and checking divisibility.' },
                { term: 'Compound assignment', detail: 'Forms such as plus equals combine an operation with assignment, updating a variable in place. They are concise and can be more efficient for heavy user defined types.' },
                { term: 'Pre versus post increment', detail: 'Pre increment changes the value then yields the new value, while post increment yields the old value then changes it. The distinction matters when the result is used in the same expression.' },
                { term: 'Prefer prefix for objects', detail: 'For non trivial types like iterators, prefix increment avoids creating a temporary copy, so it is the conventional choice in loops.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cpp-logical-bitwise',
        title: 'Logical, Comparison, and Bitwise',
        level: 2,
        slug: 'logical-bitwise',
        concepts: [
          {
            id: 'cpp-logical-intro',
            code: 'bool result = (a > 5) && (b < 10);  // logical AND\nbool either = (a == 0) || (b != 0);  // logical OR\n\nunsigned flags = 0b1010;\nflags |= 0b0100;   // set bit 2\nflags &= ~0b0010;  // clear bit 1\nbool bit3 = flags & (1 << 3);  // test bit 3',
            note: 'Logical operators (`&&`, `||`, `!`) short-circuit. Bitwise operators (`&`, `|`, `^`, `~`, `<<`, `>>`) manipulate individual bits — common in systems programming and flag management.',
            explanation: {
              heading: 'Logic, comparison, and bit manipulation',
              intro: 'C++ separates logical operators that reason about truth from bitwise operators that work on individual bits. Confusing the two is a classic source of hard to find bugs.',
              points: [
                { term: 'Short circuit evaluation', detail: 'Logical and stops as soon as it sees a false operand, and logical or stops on a true one. This lets you guard an expression, for example checking a pointer before dereferencing it.' },
                { term: 'Comparison results', detail: 'Comparison operators produce a bool. Beware of writing a single equals sign where you meant two, since that assigns instead of comparing.' },
                { term: 'Bitwise operators', detail: 'The single ampersand, single pipe, caret, and tilde operate on every bit of their operands, which is how you combine and test flags packed into an integer.' },
                { term: 'Shifting bits', detail: 'The left and right shift operators move bits by a number of positions, giving fast multiplication or division by powers of two on unsigned values.' },
                { term: 'Setting and clearing flags', detail: 'Use or with a mask to set bits, and use and with the complement of a mask to clear them. Prefer unsigned types for bit work to avoid sign related surprises.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 4. Control Flow
  {
    id: 'cpp-control-flow',
    title: 'Control Flow',
    level: 1,
    slug: 'control-flow',
    concepts: [],
    children: [
      {
        id: 'cpp-conditionals',
        title: 'Conditionals and Switch',
        level: 2,
        slug: 'conditionals',
        concepts: [
          {
            id: 'cpp-if-switch',
            code: 'if (int val = compute(); val > 0) {\n    std::cout << "positive: " << val;\n} else if (val == 0) {\n    std::cout << "zero";\n} else {\n    std::cout << "negative";\n}\n\nswitch (day) {\n    case 1: std::cout << "Mon"; break;\n    case 2: std::cout << "Tue"; break;\n    default: std::cout << "Other";\n}',
            note: 'C++17 allows init-statements in `if` and `switch`. The `switch` requires `break` to avoid fall-through (or use `[[fallthrough]]` attribute intentionally).',
            explanation: {
              heading: 'Branching with if and switch',
              intro: 'Conditionals steer program flow based on runtime values. C++ offers a flexible if else chain and a switch that is well suited to dispatching on a single integral value.',
              points: [
                { term: 'If else chains', detail: 'An if statement runs a block when its condition is true, and optional else if and else clauses cover the remaining cases. Conditions must reduce to a bool.' },
                { term: 'Init statements', detail: 'Since the seventeenth standard you can declare a variable in the condition itself, scoping it to the if or switch so it does not leak into the surrounding code.' },
                { term: 'How switch works', detail: 'A switch compares an integral or enumeration value against case labels and jumps to the matching one, which can be faster and clearer than a long if chain.' },
                { term: 'Fall through', detail: 'Without a break, control falls through into the next case. This is occasionally useful, and you can mark intentional fall through with an attribute to silence warnings.' },
                { term: 'The default case', detail: 'Provide a default label to handle unexpected values. Leaving it out for an enumeration means unhandled values pass through silently.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cpp-loops',
        title: 'Loops (for, while, range-based)',
        level: 2,
        slug: 'loops',
        concepts: [
          {
            id: 'cpp-loops-intro',
            code: 'for (int i = 0; i < 10; ++i) {\n    std::cout << i << " ";\n}\n\nstd::vector<int> nums = {1, 2, 3, 4, 5};\nfor (const auto& n : nums) {\n    std::cout << n << " ";\n}\n\nint count = 5;\nwhile (count-- > 0) {\n    std::cout << count << " ";\n}',
            note: 'Range-based `for` (C++11) iterates over any container with `begin()`/`end()`. Use `const auto&` to avoid copies. Prefer `++i` over `i++` for non-trivial types.',
            explanation: {
              heading: 'Loop forms and when to use them',
              intro: 'C++ offers several looping constructs, each fitting a different situation. Choosing the right one makes intent clear and helps avoid off by one and copy related mistakes.',
              points: [
                { term: 'The counting for loop', detail: 'The classic three part for loop is ideal when you need an index, a custom step, or precise control over start and end conditions.' },
                { term: 'Range based for', detail: 'Introduced in the eleventh standard, this form visits every element of a container without manual index bookkeeping, which eliminates a whole class of bounds errors.' },
                { term: 'Avoiding hidden copies', detail: 'Binding the loop variable as a const reference reads each element without copying it, which matters for strings and other heavy types.' },
                { term: 'While and do while', detail: 'A while loop tests before each pass and may run zero times, while a do while runs at least once. Pick the one that matches whether the body must always execute.' },
                { term: 'Breaking and continuing', detail: 'The break statement exits a loop early and continue skips to the next iteration. Use them to keep loop bodies flat and readable rather than deeply nested.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 5. Functions
  {
    id: 'cpp-functions',
    title: 'Functions',
    level: 1,
    slug: 'functions',
    concepts: [],
    children: [
      {
        id: 'cpp-function-basics',
        title: 'Declaration, Overloading, and Defaults',
        level: 2,
        slug: 'function-basics',
        concepts: [
          {
            id: 'cpp-fn-basics',
            code: '// Declaration with default parameter\nint add(int a, int b = 0);\n\n// Overloading\ndouble add(double a, double b) {\n    return a + b;\n}\n\nint add(int a, int b) {\n    return a + b;\n}',
            note: 'C++ supports function overloading — same name, different parameter types. Default arguments fill in from the right. Declare before use or provide a forward declaration.',
            explanation: {
              heading: 'Declaring and overloading functions',
              intro: 'Functions package reusable behavior. C++ adds overloading and default arguments so one logical operation can present several convenient call shapes.',
              points: [
                { term: 'Declaration versus definition', detail: 'A declaration announces a name and signature so callers can use it, while the definition provides the body. Splitting them across header and source enables separate compilation.' },
                { term: 'Overload resolution', detail: 'Several functions may share a name if their parameter lists differ. The compiler picks the best match based on the argument types, reporting an error if the choice is ambiguous.' },
                { term: 'Default arguments', detail: 'Trailing parameters can carry default values so callers may omit them. Defaults are supplied from the right, so once you skip one you must skip the rest.' },
                { term: 'Return by value', detail: 'Returning a value copies or moves the result to the caller. Modern compilers frequently elide that copy, so returning objects is efficient and clear.' },
                { term: 'Passing large objects', detail: 'Pass big inputs by const reference to avoid copying, and reserve pass by value for small types or when the function needs its own modifiable copy.' },
              ],
            },
            example: 'std::cout << add(3, 4);       // 7 (int)\nstd::cout << add(1.5, 2.5);  // 4.0 (double)\nstd::cout << add(5);          // 5 (uses default b=0)',
          },
        ],
        children: [],
      },
      {
        id: 'cpp-inline-constexpr-fn',
        title: 'Inline and constexpr Functions',
        level: 2,
        slug: 'inline-constexpr-functions',
        concepts: [
          {
            id: 'cpp-constexpr-fn',
            code: 'constexpr int factorial(int n) {\n    return n <= 1 ? 1 : n * factorial(n - 1);\n}\n\n// Evaluated at compile time\nconstexpr int f5 = factorial(5);  // 120\n\n// Also valid at runtime\nint runtime_val = factorial(some_variable);',
            note: '`constexpr` functions can be evaluated at compile time when given constant arguments. Since C++14 they can contain loops and local variables. `consteval` (C++20) forces compile-time evaluation.',
            explanation: {
              heading: 'Inline and compile time functions',
              intro: 'The inline and constexpr keywords influence how and when a function is processed. They let you push work to compile time and place definitions in headers safely.',
              points: [
                { term: 'What inline really means', detail: 'The inline keyword mainly permits a function to be defined in multiple translation units without a link error. It is a hint about inlining, not a guarantee the compiler will inline the call.' },
                { term: 'Constexpr functions', detail: 'A constexpr function may run during compilation when its arguments are constants, producing a value with no runtime cost, and it can still be called normally at runtime.' },
                { term: 'Relaxed rules over time', detail: 'From the fourteenth standard onward, constexpr functions can contain loops, branches, and local variables, making meaningful compile time computation practical.' },
                { term: 'Forcing compile time', detail: 'The consteval keyword from the twentieth standard marks a function that must be evaluated at compile time, so calling it with a runtime value is an error.' },
                { term: 'Why it matters', detail: 'Moving work to compile time can shrink runtime overhead and enable values usable as array sizes or template arguments, at the cost of longer builds.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 6. Pointers and References
  {
    id: 'cpp-pointers-refs',
    title: 'Pointers & References',
    level: 1,
    slug: 'pointers-references',
    concepts: [],
    children: [
      {
        id: 'cpp-pointers',
        title: 'Raw Pointers',
        level: 2,
        slug: 'raw-pointers',
        concepts: [
          {
            id: 'cpp-pointers-intro',
            code: 'int x = 42;\nint* ptr = &x;       // pointer to x\n*ptr = 100;          // x is now 100\n\nint* arr = new int[5];\narr[0] = 10;\ndelete[] arr;        // must manually free\n\nint* null_ptr = nullptr;  // prefer over NULL',
            note: 'Pointers hold memory addresses. `&` gets an address, `*` dereferences. `new`/`delete` manage heap memory. Always initialize pointers — use `nullptr` for null. Prefer smart pointers in modern C++.',
            explanation: {
              heading: 'Working with raw pointers',
              intro: 'A pointer is a variable that stores the address of another object. Pointers give you low level control over memory, but that power comes with responsibility for lifetime and null handling.',
              points: [
                { term: 'Address and dereference', detail: 'The address of operator produces a pointer to an object, and the dereference operator reads or writes the object the pointer refers to.' },
                { term: 'Heap allocation', detail: 'The new expression allocates an object on the heap and returns a pointer, and you must release it later with delete to avoid leaking memory.' },
                { term: 'Arrays and delete square brackets', detail: 'Allocating an array with new square brackets must be matched by delete square brackets. Mismatching the two forms is undefined behavior.' },
                { term: 'Null and dangling pointers', detail: 'Always initialize a pointer, using nullptr for none, and never dereference a pointer to freed or uninitialized memory, which is a leading cause of crashes.' },
                { term: 'Prefer smart pointers', detail: 'In modern C++, owning raw pointers are discouraged. Smart pointers manage lifetime automatically, leaving raw pointers for non owning observation.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cpp-references',
        title: 'Lvalue and Rvalue References',
        level: 2,
        slug: 'references',
        concepts: [
          {
            id: 'cpp-refs-intro',
            code: 'int x = 10;\nint& ref = x;      // lvalue reference (alias)\nref = 20;          // x is now 20\n\nvoid process(const std::string& s);  // no copy\n\n// Rvalue reference (C++11)\nstd::string&& temp = std::string("hello");\nvoid sink(std::string&& s);  // takes ownership',
            note: 'Lvalue references (`&`) are aliases — no null, no reassignment. Use `const&` for read-only parameters. Rvalue references (`&&`) bind to temporaries, enabling move semantics.',
            explanation: {
              heading: 'References and value categories',
              intro: 'References are aliases for existing objects, giving pointer like indirection with safer, cleaner syntax. C++ distinguishes lvalue references from rvalue references, and the difference underpins move semantics.',
              points: [
                { term: 'Lvalue references', detail: 'An lvalue reference binds to a named object and acts as another name for it. It cannot be null and cannot be rebound to a different object after initialization.' },
                { term: 'Const references for parameters', detail: 'Taking a parameter as a const reference lets a function read a large object without copying it, while promising not to modify the caller data.' },
                { term: 'Lvalues versus rvalues', detail: 'An lvalue has a persistent identity you can take the address of, while an rvalue is a temporary that is about to expire. This category drives overload selection.' },
                { term: 'Rvalue references', detail: 'Declared with two ampersands, an rvalue reference binds to temporaries. It signals that a function may steal the resources of an expiring object rather than copy them.' },
                { term: 'Why it enables moves', detail: 'By overloading on rvalue references, a type can transfer ownership of internal buffers cheaply, which is the foundation of efficient move semantics.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 7. Arrays
  {
    id: 'cpp-arrays',
    title: 'Arrays',
    level: 1,
    slug: 'arrays',
    concepts: [],
    children: [
      {
        id: 'cpp-c-arrays',
        title: 'C-Style Arrays and std::array',
        level: 2,
        slug: 'c-arrays',
        concepts: [
          {
            id: 'cpp-arrays-intro',
            code: '// C-style array\nint nums[5] = {1, 2, 3, 4, 5};\nint size = sizeof(nums) / sizeof(nums[0]); // 5\n\n// Modern: std::array (fixed size, stack)\n#include <array>\nstd::array<int, 5> arr = {10, 20, 30, 40, 50};\narr.at(2);  // bounds-checked access: 30\narr.size(); // 5',
            note: 'C-style arrays decay to pointers when passed to functions, losing size info. `std::array` is a zero-overhead wrapper with bounds checking via `.at()` and full STL compatibility.',
            explanation: {
              heading: 'Fixed size arrays done right',
              intro: 'C++ inherits raw arrays from C and adds a safer standard library wrapper. Knowing the difference helps you avoid the classic pitfalls of raw arrays while keeping their performance.',
              points: [
                { term: 'Array decay', detail: 'When you pass a raw array to a function it decays to a pointer to its first element, so the receiving function no longer knows the length.' },
                { term: 'The std array wrapper', detail: 'The standard array is a thin wrapper that stores its size as part of the type, adds member functions, and carries no overhead compared to a raw array.' },
                { term: 'Bounds checked access', detail: 'The at member function checks the index and throws on an out of range access, while the subscript operator skips the check for speed.' },
                { term: 'Container compatibility', detail: 'Because it exposes begin and end, a standard array works with range based loops and algorithms, unlike a bare raw array in a function parameter.' },
                { term: 'Stack storage', detail: 'A standard array lives where you declare it, typically on the stack, making it a great fixed capacity choice when the size is known at compile time.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cpp-multidim-arrays',
        title: 'Multidimensional Arrays',
        level: 2,
        slug: 'multidimensional-arrays',
        concepts: [
          {
            id: 'cpp-multidim-intro',
            code: '// Stack-allocated 2D array\nint matrix[3][4] = {};\nmatrix[1][2] = 42;\n\n// Dynamic 2D with vector\nstd::vector<std::vector<int>> grid(3, std::vector<int>(4, 0));\ngrid[1][2] = 42;',
            note: 'Fixed-size 2D arrays live on the stack. For dynamic sizes, use nested `std::vector`. For performance-critical code, consider a flat 1D vector with row*cols indexing.',
            explanation: {
              heading: 'Representing grids and matrices',
              intro: 'C++ lets you model multidimensional data in several ways, each with different tradeoffs in flexibility, memory layout, and speed. The right choice depends on whether dimensions are known ahead of time.',
              points: [
                { term: 'True multidimensional arrays', detail: 'A fixed size two dimensional array stores its elements contiguously in row major order on the stack, which is fast but requires the size to be a compile time constant.' },
                { term: 'Nested vectors', detail: 'A vector of vectors supports dimensions chosen at runtime and rows of differing lengths, at the cost of an extra allocation and pointer chase per row.' },
                { term: 'The flat layout', detail: 'For hot loops, a single one dimensional vector indexed by row times width plus column keeps all data contiguous, which improves cache locality significantly.' },
                { term: 'Cache locality matters', detail: 'Traversing memory in the order it is laid out lets the processor prefetch effectively, so iterate rows before columns for row major storage.' },
                { term: 'Bounds discipline', detail: 'With manual indexing you own the bounds checking, so validate row and column indices to prevent reading or writing outside the buffer.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 8. Strings
  {
    id: 'cpp-strings',
    title: 'Strings',
    level: 1,
    slug: 'strings',
    concepts: [],
    children: [
      {
        id: 'cpp-c-strings',
        title: 'C-Style Strings',
        level: 2,
        slug: 'c-style-strings',
        concepts: [
          {
            id: 'cpp-cstr-intro',
            code: '#include <cstring>\n\nconst char* greeting = "Hello";\nchar buf[20];\nstrcpy(buf, greeting);\nstrcat(buf, " World");\nsize_t len = strlen(buf);  // 11',
            note: 'C-style strings are null-terminated `char` arrays. Functions like `strcpy`, `strcat`, `strlen` from `<cstring>` operate on them. Prone to buffer overflows — prefer `std::string` in modern C++.',
            explanation: {
              heading: 'Understanding C style strings',
              intro: 'Before the standard string class, text in C and C++ was represented as an array of characters ending in a special null byte. You still meet these strings when interfacing with C libraries and the operating system.',
              points: [
                { term: 'The null terminator', detail: 'A C style string is a sequence of characters followed by a zero byte that marks the end. Every C string function relies on that terminator being present.' },
                { term: 'The cstring functions', detail: 'Helpers such as copy, concatenate, and length walk the characters until they hit the terminator. They do no bounds checking of their own.' },
                { term: 'Buffer overflow risk', detail: 'Because these functions trust the destination to be large enough, copying too much data writes past the buffer, which corrupts memory and is a common security hole.' },
                { term: 'Length is linear', detail: 'Computing the length scans the whole string every time, so repeatedly asking for it in a loop turns a cheap operation into a costly one.' },
                { term: 'Prefer the string class', detail: 'Modern code should use the standard string, which tracks its own length and manages memory, reserving raw character buffers for narrow interop needs.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cpp-std-string',
        title: 'std::string and string_view',
        level: 2,
        slug: 'std-string',
        concepts: [
          {
            id: 'cpp-stdstring-intro',
            code: '#include <string>\n#include <string_view>\n\nstd::string s = "Hello";\ns += " C++";               // concatenation\nstd::string sub = s.substr(0, 5);  // "Hello"\nsize_t pos = s.find("C++");        // 6\n\n// string_view: non-owning, no allocation\nvoid print(std::string_view sv) {\n    std::cout << sv << "\\n";\n}',
            note: '`std::string` manages memory automatically with SSO (small string optimization). `std::string_view` (C++17) provides a lightweight, non-owning view — zero-copy for read-only access.',
            explanation: {
              heading: 'Modern string handling',
              intro: 'The standard string type gives you safe, growable text with a rich set of operations, while string view offers a cheap non owning window into existing text. Together they cover most string needs.',
              points: [
                { term: 'Automatic memory', detail: 'The string class owns and resizes its buffer for you, so concatenation and substrings do not require manual allocation or freeing.' },
                { term: 'Small string optimization', detail: 'Many implementations store short strings directly inside the string object, avoiding a heap allocation entirely for common small values.' },
                { term: 'What string view is', detail: 'Introduced in the seventeenth standard, string view holds a pointer and length that refer to characters someone else owns, making read only access allocation free.' },
                { term: 'The dangling danger', detail: 'A string view does not extend the lifetime of what it points at, so never return one that refers to a local string or a temporary that has already expired.' },
                { term: 'Choosing parameters', detail: 'Accept string view for read only text parameters to avoid copies from any string like source, and accept a string by value only when you intend to keep it.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 9. OOP - Classes
  {
    id: 'cpp-oop-classes',
    title: 'OOP: Classes',
    level: 1,
    slug: 'oop-classes',
    concepts: [],
    children: [
      {
        id: 'cpp-class-basics',
        title: 'Class Definition and Access Specifiers',
        level: 2,
        slug: 'class-basics',
        concepts: [
          {
            id: 'cpp-class-intro',
            code: 'class Circle {\nprivate:\n    double radius_;\n\npublic:\n    Circle(double r) : radius_(r) {}  // constructor\n\n    double area() const {\n        return 3.14159 * radius_ * radius_;\n    }\n\n    double getRadius() const { return radius_; }\n    void setRadius(double r) { radius_ = r; }\n};',
            note: 'Classes bundle data and behavior. `private` hides internals, `public` exposes the interface. Use member initializer lists for construction. Mark read-only methods `const`.',
            explanation: {
              heading: 'Encapsulating data with classes',
              intro: 'A class groups related data and the operations on that data into a single type. Access specifiers let you hide implementation details behind a stable public interface.',
              points: [
                { term: 'Access specifiers', detail: 'Members marked private are reachable only from inside the class, while public members form the interface that outside code depends on. This separation is the heart of encapsulation.' },
                { term: 'Constructors', detail: 'A constructor runs when an object is created and establishes its invariants. Providing one guarantees the object starts in a valid state.' },
                { term: 'Member initializer lists', detail: 'Initializing members in the list after the constructor colon constructs them directly, which is more efficient and required for const and reference members.' },
                { term: 'Const member functions', detail: 'Marking a method const promises it will not modify the object, allowing it to be called on const instances and documenting read only intent.' },
                { term: 'Invariants', detail: 'By funneling all changes through public methods, a class can enforce rules that its data must always satisfy, which callers cannot accidentally break.' },
              ],
            },
            example: 'Circle c(5.0);\nstd::cout << c.area();  // 78.5397',
          },
        ],
        children: [],
      },
      {
        id: 'cpp-constructors-destructors',
        title: 'Constructors, Destructors, Rule of Five',
        level: 2,
        slug: 'constructors-destructors',
        concepts: [
          {
            id: 'cpp-rule-of-five',
            code: 'class Buffer {\n    int* data_;\n    size_t size_;\npublic:\n    Buffer(size_t n) : data_(new int[n]), size_(n) {}\n    ~Buffer() { delete[] data_; }\n\n    // Copy constructor\n    Buffer(const Buffer& o) : data_(new int[o.size_]), size_(o.size_) {\n        std::copy(o.data_, o.data_ + size_, data_);\n    }\n    // Copy assignment\n    Buffer& operator=(const Buffer& o) {\n        if (this != &o) {\n            delete[] data_;\n            size_ = o.size_;\n            data_ = new int[size_];\n            std::copy(o.data_, o.data_ + size_, data_);\n        }\n        return *this;\n    }\n    // Move constructor\n    Buffer(Buffer&& o) noexcept : data_(o.data_), size_(o.size_) {\n        o.data_ = nullptr; o.size_ = 0;\n    }\n    // Move assignment\n    Buffer& operator=(Buffer&& o) noexcept {\n        if (this != &o) {\n            delete[] data_;\n            data_ = o.data_; size_ = o.size_;\n            o.data_ = nullptr; o.size_ = 0;\n        }\n        return *this;\n    }\n};',
            note: 'Rule of Five: if you define any of destructor, copy/move constructor, or copy/move assignment, define all five. For most classes, prefer = default or use smart pointers to follow the Rule of Zero.',
            explanation: {
              heading: 'Object lifecycle and the Rule of Five',
              intro: 'C++ gives you precise control over how objects are created, copied, moved, and destroyed. When a class manages a resource directly, these special member functions must cooperate correctly.',
              points: [
                { term: 'The five special functions', detail: 'They are the destructor, the copy constructor, the copy assignment, the move constructor, and the move assignment. Each governs one part of an object lifecycle.' },
                { term: 'Why they travel together', detail: 'If you write one because your class owns a resource, the compiler generated versions of the others are usually wrong, so you should define or default all five.' },
                { term: 'Copy versus move', detail: 'Copy operations duplicate the underlying resource, while move operations transfer it and leave the source empty, which is far cheaper for large buffers.' },
                { term: 'Guard against self assignment', detail: 'Assignment operators should handle the case where the source and destination are the same object, or they may free a resource they are about to reuse.' },
                { term: 'The Rule of Zero', detail: 'The cleanest design avoids all five by storing resources in members that manage themselves, such as smart pointers and containers, so the defaults just work.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 10. OOP - Inheritance
  {
    id: 'cpp-oop-inheritance',
    title: 'OOP: Inheritance',
    level: 1,
    slug: 'oop-inheritance',
    concepts: [],
    children: [
      {
        id: 'cpp-inheritance-basics',
        title: 'Single and Multiple Inheritance',
        level: 2,
        slug: 'inheritance-basics',
        concepts: [
          {
            id: 'cpp-inheritance-intro',
            code: 'class Shape {\nprotected:\n    std::string color_;\npublic:\n    Shape(std::string c) : color_(std::move(c)) {}\n    virtual double area() const = 0;  // pure virtual\n    virtual ~Shape() = default;\n};\n\nclass Rectangle : public Shape {\n    double w_, h_;\npublic:\n    Rectangle(double w, double h, std::string c)\n        : Shape(std::move(c)), w_(w), h_(h) {}\n    double area() const override { return w_ * h_; }\n};',
            note: 'Inheritance models "is-a" relationships. Use `public` inheritance for interface conformance. `protected` members are accessible to derived classes. Always declare base destructors `virtual`.',
            explanation: {
              heading: 'Building type hierarchies',
              intro: 'Inheritance lets a derived class reuse and extend a base class, expressing that one type is a specialized kind of another. Used with care it enables polymorphism and code reuse.',
              points: [
                { term: 'The is a relationship', detail: 'Public inheritance should model that a derived object can stand in wherever a base object is expected. If that substitution does not hold, prefer composition instead.' },
                { term: 'Protected members', detail: 'Members marked protected are hidden from outside code but accessible to derived classes, which lets a base share implementation helpers with its descendants.' },
                { term: 'Calling base constructors', detail: 'A derived constructor must initialize its base part first, typically by naming the base in its member initializer list before setting its own fields.' },
                { term: 'Virtual destructors', detail: 'When you delete a derived object through a base pointer, the base destructor must be virtual, otherwise only the base part is destroyed and resources leak.' },
                { term: 'Beware deep hierarchies', detail: 'Tall inheritance trees become brittle and hard to reason about. Favor shallow hierarchies and interfaces over sprawling chains of derivation.' },
              ],
            },
            example: 'std::unique_ptr<Shape> s = std::make_unique<Rectangle>(3, 4, "red");\nstd::cout << s->area();  // 12',
          },
        ],
        children: [],
      },
      {
        id: 'cpp-virtual-dispatch',
        title: 'Virtual Functions and vtable',
        level: 2,
        slug: 'virtual-dispatch',
        concepts: [
          {
            id: 'cpp-vtable-intro',
            code: 'class Animal {\npublic:\n    virtual void speak() const {\n        std::cout << "...";\n    }\n    virtual ~Animal() = default;\n};\n\nclass Dog : public Animal {\npublic:\n    void speak() const override {\n        std::cout << "Woof!";\n    }\n};\n\nvoid makeNoise(const Animal& a) {\n    a.speak();  // dynamic dispatch via vtable\n}',
            note: 'Virtual functions enable runtime polymorphism via the vtable. `override` catches mismatches at compile time. `final` prevents further overriding. Non-virtual calls are resolved at compile time (faster).',
            explanation: {
              heading: 'Runtime polymorphism and the vtable',
              intro: 'Virtual functions let a call through a base reference or pointer select the derived implementation at runtime. This dynamic dispatch is the mechanism behind polymorphic behavior.',
              points: [
                { term: 'How dispatch works', detail: 'Each polymorphic object carries a hidden pointer to a table of function addresses. A virtual call looks up the right function in that table at runtime.' },
                { term: 'The override keyword', detail: 'Marking an overriding function with override asks the compiler to verify it truly matches a base virtual function, catching subtle signature mistakes early.' },
                { term: 'Preventing overrides', detail: 'The final specifier stops a function or class from being overridden or derived further, which documents intent and can enable optimizations.' },
                { term: 'The cost', detail: 'A virtual call adds one indirection and usually prevents inlining, so avoid making functions virtual on hot paths where static dispatch would do.' },
                { term: 'Object slicing', detail: 'Copying a derived object into a base value keeps only the base part and loses polymorphism, so store and pass polymorphic objects by reference or pointer.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 11. OOP - Polymorphism and Abstract Classes
  {
    id: 'cpp-oop-polymorphism',
    title: 'OOP: Polymorphism & Abstract Classes',
    level: 1,
    slug: 'oop-polymorphism',
    concepts: [],
    children: [
      {
        id: 'cpp-abstract-classes',
        title: 'Abstract Classes and Interfaces',
        level: 2,
        slug: 'abstract-classes',
        concepts: [
          {
            id: 'cpp-abstract-intro',
            code: '// Pure interface (all pure virtual)\nclass Serializable {\npublic:\n    virtual std::string serialize() const = 0;\n    virtual void deserialize(const std::string& data) = 0;\n    virtual ~Serializable() = default;\n};\n\nclass Config : public Serializable {\n    std::map<std::string, std::string> data_;\npublic:\n    std::string serialize() const override {\n        std::string result;\n        for (auto& [k, v] : data_)\n            result += k + "=" + v + "\\n";\n        return result;\n    }\n    void deserialize(const std::string& data) override {\n        // parse key=value pairs\n    }\n};',
            note: 'A class with at least one pure virtual function (`= 0`) is abstract — it cannot be instantiated. Use abstract classes as interfaces to define contracts without implementation.',
            explanation: {
              heading: 'Abstract classes as contracts',
              intro: 'An abstract class defines an interface that derived classes must fulfill. It describes what operations exist without committing to how they are implemented, which decouples callers from concrete types.',
              points: [
                { term: 'Pure virtual functions', detail: 'Declaring a virtual function equal to zero makes it pure, meaning it has no body in the base and must be overridden by any concrete derived class.' },
                { term: 'Cannot be instantiated', detail: 'A class with any pure virtual function is abstract, so you cannot create objects of it directly, only of concrete classes that implement every such function.' },
                { term: 'Interfaces in C++', detail: 'A class made entirely of pure virtual functions acts as a pure interface, similar to interfaces in other languages, defining a contract with no state.' },
                { term: 'Program to the interface', detail: 'Writing code against the abstract base lets you swap in any implementation later, which improves testability and reduces coupling between components.' },
                { term: 'Virtual destructor still needed', detail: 'Even abstract bases need a virtual destructor so that deleting a derived object through a base pointer cleans up correctly.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cpp-operator-overloading',
        title: 'Operator Overloading',
        level: 2,
        slug: 'operator-overloading',
        concepts: [
          {
            id: 'cpp-operator-intro',
            code: 'class Vec2 {\npublic:\n    double x, y;\n    Vec2(double x, double y) : x(x), y(y) {}\n\n    Vec2 operator+(const Vec2& o) const {\n        return {x + o.x, y + o.y};\n    }\n    bool operator==(const Vec2& o) const = default; // C++20\n\n    friend std::ostream& operator<<(std::ostream& os, const Vec2& v) {\n        return os << "(" << v.x << ", " << v.y << ")";\n    }\n};',
            note: 'Operator overloading lets user-defined types behave like builtins. C++20 `= default` for `==` auto-generates `!=`. Use `friend` for symmetric operators like `<<`.',
            explanation: {
              heading: 'Giving types natural syntax',
              intro: 'Operator overloading lets your own types support familiar operators like plus and equals, so they read like built in types. Used judiciously it makes numeric and container like classes intuitive.',
              points: [
                { term: 'Member versus free operators', detail: 'Symmetric operators such as plus are often written as free functions so both operands convert equally, while operators that modify the object suit member functions.' },
                { term: 'Defaulted comparison', detail: 'From the twentieth standard you can default the equality operator, and the compiler generates a sensible member wise comparison and the matching not equal.' },
                { term: 'Stream insertion', detail: 'Overloading the output operator as a friend gives your type a printable form. It takes the stream by reference and returns it to allow chaining.' },
                { term: 'Keep semantics intuitive', detail: 'Overloaded operators should behave the way readers expect. Making plus do something surprising undermines the readability benefit entirely.' },
                { term: 'The spaceship operator', detail: 'The three way comparison operator can synthesize all the relational operators at once, saving boilerplate when a type has a natural ordering.' },
              ],
            },
            example: 'Vec2 a{1, 2}, b{3, 4};\nVec2 c = a + b;\nstd::cout << c;  // (4, 6)',
          },
        ],
        children: [],
      },
    ],
  },

  // 12. Templates
  {
    id: 'cpp-templates',
    title: 'Templates',
    level: 1,
    slug: 'templates',
    concepts: [],
    children: [
      {
        id: 'cpp-function-templates',
        title: 'Function Templates',
        level: 2,
        slug: 'function-templates',
        concepts: [
          {
            id: 'cpp-fn-template',
            code: 'template <typename T>\nT maximum(T a, T b) {\n    return (a > b) ? a : b;\n}\n\n// Explicit specialization\ntemplate <>\nconst char* maximum(const char* a, const char* b) {\n    return std::strcmp(a, b) > 0 ? a : b;\n}',
            note: 'Function templates let you write type-generic code. The compiler generates a specialization for each type used. Explicit specializations handle edge cases.',
            explanation: {
              heading: 'Writing generic functions',
              intro: 'Function templates let you write an algorithm once and have it work for many types. The compiler stamps out a concrete version for each set of types you actually use.',
              points: [
                { term: 'Template parameters', detail: 'A type parameter stands in for a real type chosen at the call site. The body must compile for every type it is instantiated with.' },
                { term: 'Argument deduction', detail: 'The compiler usually infers the type parameters from the call arguments, so you rarely spell them out explicitly.' },
                { term: 'Instantiation', detail: 'A separate copy of the function is generated for each distinct type used, which trades a larger binary for zero runtime dispatch cost.' },
                { term: 'Explicit specialization', detail: 'When the generic logic is wrong for a particular type, you can provide a hand written version that the compiler uses instead for that exact type.' },
                { term: 'Definitions in headers', detail: 'Because the compiler needs the full template body to instantiate it, template definitions typically live in headers rather than separate source files.' },
              ],
            },
            example: 'auto m1 = maximum(3, 7);        // int: 7\nauto m2 = maximum(3.14, 2.71);  // double: 3.14\nauto m3 = maximum("abc", "xyz"); // specialized: "xyz"',
          },
        ],
        children: [],
      },
      {
        id: 'cpp-class-templates',
        title: 'Class Templates and Variadic Templates',
        level: 2,
        slug: 'class-templates',
        concepts: [
          {
            id: 'cpp-class-tmpl',
            code: 'template <typename T, size_t N>\nclass Stack {\n    std::array<T, N> data_;\n    size_t top_ = 0;\npublic:\n    void push(const T& val) { data_[top_++] = val; }\n    T pop() { return data_[--top_]; }\n    bool empty() const { return top_ == 0; }\n};\n\n// Variadic template\ntemplate <typename... Args>\nvoid print(Args&&... args) {\n    (std::cout << ... << args) << "\\n";  // fold expression\n}',
            note: 'Class templates create generic data structures. Non-type parameters (like `N`) are compile-time constants. Variadic templates accept any number of arguments — fold expressions (C++17) simplify expansion.',
            explanation: {
              heading: 'Generic types and variadic templates',
              intro: 'Class templates let you build containers and utilities that work with any element type, and variadic templates extend that flexibility to any number of arguments.',
              points: [
                { term: 'Type parameters', detail: 'A class template is parameterized by one or more types, so a single definition can produce a container of integers, strings, or any other type on demand.' },
                { term: 'Non type parameters', detail: 'Templates can also take compile time constants such as a fixed size, which become part of the type and allow stack based fixed capacity structures.' },
                { term: 'Variadic templates', detail: 'A parameter pack accepts any number of arguments of varying types, which is how utilities like tuples and print helpers handle arbitrary argument lists.' },
                { term: 'Fold expressions', detail: 'Introduced in the seventeenth standard, fold expressions apply an operator across a parameter pack in one concise line instead of manual recursion.' },
                { term: 'Compile time cost', detail: 'Each unique instantiation generates code, so heavily parameterized templates can grow build times and binary size, a tradeoff worth watching.' },
              ],
            },
            example: 'Stack<int, 10> s;\ns.push(42);\nprint("Hello", \' \', "World", \'!\');  // Hello World!',
          },
        ],
        children: [],
      },
    ],
  },

  // 13. STL - Vector and Array
  {
    id: 'cpp-stl-vector',
    title: 'STL: vector & array',
    level: 1,
    slug: 'stl-vector',
    concepts: [],
    children: [
      {
        id: 'cpp-vector-basics',
        title: 'std::vector Operations',
        level: 2,
        slug: 'vector-basics',
        concepts: [
          {
            id: 'cpp-vector-intro',
            code: '#include <vector>\n\nstd::vector<int> v = {1, 2, 3, 4, 5};\nv.push_back(6);\nv.emplace_back(7);  // constructs in-place\nv.pop_back();\n\nv.insert(v.begin() + 2, 99);\nv.erase(v.begin());  // remove first\n\nstd::cout << v.size() << " " << v.capacity();',
            note: '`std::vector` is a dynamic array with amortized O(1) push_back. `emplace_back` avoids copies by constructing in-place. Capacity grows geometrically (usually 2x). Use `reserve()` to avoid reallocations.',
            explanation: {
              heading: 'The workhorse dynamic array',
              intro: 'Vector is the default sequence container in C++. It stores elements contiguously and grows as needed, giving fast indexed access with the flexibility of a resizable array.',
              points: [
                { term: 'Contiguous storage', detail: 'Elements sit in one block of memory, so indexed access is constant time and iteration is cache friendly, which is why vector is the recommended default.' },
                { term: 'Amortized growth', detail: 'Appending is constant time on average because capacity grows geometrically. Occasional reallocations copy or move everything to a larger block.' },
                { term: 'Reserve to avoid churn', detail: 'If you know roughly how many elements you will add, calling reserve up front prevents repeated reallocations and pointer invalidation.' },
                { term: 'Emplace versus push', detail: 'The emplace back function constructs the element directly in place from its arguments, skipping the temporary that push back may otherwise create.' },
                { term: 'Iterator invalidation', detail: 'A reallocation invalidates existing iterators, pointers, and references into the vector, so do not hold them across operations that might grow it.' },
              ],
            },
            example: 'std::vector<std::string> names;\nnames.reserve(100);  // pre-allocate\nnames.emplace_back("Alice");\nnames.emplace_back("Bob");',
          },
        ],
        children: [],
      },
      {
        id: 'cpp-vector-advanced',
        title: 'Vector Algorithms and Patterns',
        level: 2,
        slug: 'vector-advanced',
        concepts: [
          {
            id: 'cpp-vector-patterns',
            code: '// Erase-remove idiom\nstd::vector<int> v = {1, 2, 3, 2, 4, 2, 5};\nv.erase(std::remove(v.begin(), v.end(), 2), v.end());\n// C++20: simpler\nstd::erase(v, 2);\n\n// Shrink to fit\nv.shrink_to_fit();\n\n// Structured bindings with enumerate (C++20 ranges)\nfor (auto [i, val] : v | std::views::enumerate) {\n    std::cout << i << ": " << val << "\\n";\n}',
            note: 'The erase-remove idiom is the classic way to remove elements. C++20 adds `std::erase`/`std::erase_if` for simpler syntax. `shrink_to_fit` releases excess capacity.',
            explanation: {
              heading: 'Removing and reshaping vectors',
              intro: 'Removing elements from a vector is more subtle than it looks because the container keeps its elements contiguous. Understanding the idioms avoids accidentally leaving stale data behind.',
              points: [
                { term: 'The erase remove idiom', detail: 'The remove algorithm shuffles unwanted elements to the end and returns a new logical end, then erase actually shrinks the container. Both steps are required.' },
                { term: 'Simpler in C plus plus twenty', detail: 'The free erase and erase if functions combine the two step idiom into a single readable call, which is now the preferred way to delete by value or predicate.' },
                { term: 'Capacity versus size', detail: 'Erasing elements reduces the size but not the capacity, so the memory stays reserved. This keeps future insertions fast at the cost of holding memory.' },
                { term: 'Releasing memory', detail: 'When you truly want to give memory back after shrinking, the shrink to fit request asks the container to reduce its capacity toward its size.' },
                { term: 'Ranges views', detail: 'For read only transformations, ranges views compose filters and maps lazily without modifying or copying the underlying vector at all.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 14. STL - Map and Set
  {
    id: 'cpp-stl-map-set',
    title: 'STL: map & set',
    level: 1,
    slug: 'stl-map-set',
    concepts: [],
    children: [
      {
        id: 'cpp-map-basics',
        title: 'std::map and std::unordered_map',
        level: 2,
        slug: 'map-basics',
        concepts: [
          {
            id: 'cpp-map-intro',
            code: '#include <map>\n#include <unordered_map>\n\nstd::map<std::string, int> ages;  // sorted by key (red-black tree)\nages["Alice"] = 30;\nages.insert({"Bob", 25});\nages.emplace("Charlie", 35);\n\nif (auto it = ages.find("Alice"); it != ages.end()) {\n    std::cout << it->second;  // 30\n}\n\n// O(1) average lookup\nstd::unordered_map<std::string, int> fast_map;\nfast_map.reserve(1000);',
            note: '`std::map` uses a balanced BST — O(log n) ops, keys sorted. `std::unordered_map` uses hash table — O(1) average. Use `try_emplace` (C++17) to avoid constructing values for existing keys.',
            explanation: {
              heading: 'Associative key value containers',
              intro: 'C++ offers two flavors of key value maps that suit different needs. Ordered map keeps keys sorted, while unordered map trades ordering for faster average lookup.',
              points: [
                { term: 'Ordered map', detail: 'The standard map stores entries in a balanced binary search tree, giving logarithmic operations and keeping keys in sorted order for ordered traversal and range queries.' },
                { term: 'Unordered map', detail: 'The unordered map uses a hash table for average constant time lookup, insertion, and erase, but does not maintain any key order and needs a good hash function.' },
                { term: 'Lookup patterns', detail: 'Prefer find combined with an init statement in an if to test for a key and use its value in one step, avoiding a double lookup with count then subscript.' },
                { term: 'Subscript inserts', detail: 'The subscript operator inserts a default value if the key is absent, which is convenient but can silently create entries you did not intend.' },
                { term: 'Efficient emplacement', detail: 'The try emplace function from the seventeenth standard skips constructing the value when the key already exists, saving work for expensive value types.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cpp-set-basics',
        title: 'std::set and std::unordered_set',
        level: 2,
        slug: 'set-basics',
        concepts: [
          {
            id: 'cpp-set-intro',
            code: '#include <set>\n\nstd::set<int> s = {3, 1, 4, 1, 5};  // {1, 3, 4, 5} - sorted, unique\ns.insert(2);\ns.erase(4);\nbool has3 = s.contains(3);  // C++20\n\n// Custom comparator\nstd::set<std::string, std::greater<>> desc = {"apple", "banana", "cherry"};\n// {"cherry", "banana", "apple"}',
            note: '`std::set` stores unique sorted elements. `.contains()` (C++20) is cleaner than `.count()` or `.find()`. `std::multiset` allows duplicates. Use custom comparators for non-default ordering.',
            explanation: {
              heading: 'Sets of unique elements',
              intro: 'A set stores a collection of unique values and answers membership questions efficiently. Like maps, it comes in ordered and unordered variants for different tradeoffs.',
              points: [
                { term: 'Uniqueness guarantee', detail: 'A set automatically rejects duplicate insertions, so it is ideal for tracking membership or deduplicating a stream of values.' },
                { term: 'Ordered iteration', detail: 'The ordered set keeps elements sorted, which lets you traverse them in order and perform range based queries with lower and upper bound.' },
                { term: 'Membership testing', detail: 'The contains member from the twentieth standard reads more clearly than counting or finding when you only care whether an element is present.' },
                { term: 'Allowing duplicates', detail: 'When you need repeated values, the multiset variant keeps duplicates while preserving order, which suits frequency and multiset arithmetic use cases.' },
                { term: 'Custom ordering', detail: 'Supplying a comparator changes the sort order or defines ordering for user types, letting you build sets sorted descending or by a specific field.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 15. STL - List, Queue, Stack
  {
    id: 'cpp-stl-list-queue-stack',
    title: 'STL: list, queue & stack',
    level: 1,
    slug: 'stl-list-queue-stack',
    concepts: [],
    children: [
      {
        id: 'cpp-list-basics',
        title: 'std::list and std::deque',
        level: 2,
        slug: 'list-deque',
        concepts: [
          {
            id: 'cpp-list-intro',
            code: '#include <list>\n#include <deque>\n\n// Doubly-linked list: O(1) insert/remove anywhere\nstd::list<int> lst = {1, 2, 3, 4, 5};\nauto it = std::next(lst.begin(), 2);\nlst.insert(it, 99);  // {1, 2, 99, 3, 4, 5}\nlst.remove(3);       // remove by value\nlst.sort();          // member sort (stable)\n\n// Deque: O(1) push/pop at both ends\nstd::deque<int> dq;\ndq.push_front(1);\ndq.push_back(2);\ndq.pop_front();',
            note: '`std::list` is a doubly-linked list — O(1) splice and insert with an iterator, but no random access. `std::deque` supports O(1) operations at both ends with random access. Choose based on access patterns.',
            explanation: {
              heading: 'Linked lists and double ended queues',
              intro: 'Beyond the contiguous vector, C++ provides node based and segmented containers for cases where insertion patterns or end operations dominate. Each has a distinct memory layout.',
              points: [
                { term: 'The doubly linked list', detail: 'A list stores each element in its own node with links both ways, so inserting or splicing at a known position is constant time without shifting other elements.' },
                { term: 'No random access', detail: 'Because nodes are scattered, a list cannot jump to an index directly. Reaching the nth element requires walking the links, which is linear.' },
                { term: 'The deque', detail: 'A double ended queue supports fast insertion and removal at both the front and back and still allows indexed access, backed by a sequence of memory chunks.' },
                { term: 'Cache behavior', detail: 'Vector usually wins on real workloads thanks to contiguous memory, so reach for a list only when frequent middle insertions with stable references truly matter.' },
                { term: 'Choosing wisely', detail: 'Match the container to your dominant operation: vector for indexing and iteration, deque for growth at both ends, list for splicing with kept references.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cpp-queue-stack',
        title: 'std::queue, stack, and priority_queue',
        level: 2,
        slug: 'queue-stack',
        concepts: [
          {
            id: 'cpp-queue-stack-intro',
            code: '#include <queue>\n#include <stack>\n\nstd::stack<int> st;\nst.push(10); st.push(20); st.push(30);\nst.top();  // 30\nst.pop();  // removes 30\n\nstd::queue<std::string> q;\nq.push("first"); q.push("second");\nq.front(); // "first"\nq.pop();\n\n// Max-heap by default\nstd::priority_queue<int> pq;\npq.push(3); pq.push(1); pq.push(4);\npq.top();  // 4\n\n// Min-heap\nstd::priority_queue<int, std::vector<int>, std::greater<>> min_pq;',
            note: '`stack` is LIFO, `queue` is FIFO — both are container adaptors (default: `deque`). `priority_queue` is a max-heap; use `std::greater<>` for min-heap. None provide iterators.',
            explanation: {
              heading: 'Container adaptors for ordered access',
              intro: 'Stack, queue, and priority queue are adaptors that restrict a general container to a specific access discipline. They express intent clearly by exposing only the operations that fit their model.',
              points: [
                { term: 'Last in first out', detail: 'A stack only lets you push, inspect the top, and pop, which matches undo histories, expression evaluation, and depth first traversal.' },
                { term: 'First in first out', detail: 'A queue adds at the back and removes from the front, modeling waiting lines, task buffers, and breadth first traversal.' },
                { term: 'Priority queue', detail: 'This adaptor keeps the largest element accessible at the top by default, which is a heap. It is perfect for scheduling and greedy algorithms.' },
                { term: 'Building a min heap', detail: 'Supplying the greater comparator flips the ordering so the smallest element sits on top, a common need in shortest path algorithms.' },
                { term: 'No iteration', detail: 'These adaptors intentionally hide the underlying container and provide no iterators, so if you need to traverse elements choose a different container.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 16. Iterators
  {
    id: 'cpp-iterators',
    title: 'Iterators',
    level: 1,
    slug: 'iterators',
    concepts: [],
    children: [
      {
        id: 'cpp-iterator-categories',
        title: 'Iterator Categories and Usage',
        level: 2,
        slug: 'iterator-categories',
        concepts: [
          {
            id: 'cpp-iterators-intro',
            code: '#include <vector>\n#include <iterator>\n\nstd::vector<int> v = {10, 20, 30, 40, 50};\n\n// Forward iteration\nfor (auto it = v.begin(); it != v.end(); ++it) {\n    *it *= 2;  // modify through iterator\n}\n\n// Reverse iteration\nfor (auto rit = v.rbegin(); rit != v.rend(); ++rit) {\n    std::cout << *rit << " ";\n}\n\n// Iterator arithmetic (random access)\nauto mid = v.begin() + v.size() / 2;\nstd::ptrdiff_t dist = std::distance(v.begin(), mid);',
            note: 'Iterator categories: Input, Output, Forward, Bidirectional, Random Access, Contiguous (C++20). Algorithms require minimum iterator category. `std::distance` and `std::advance` work with all categories.',
            explanation: {
              heading: 'Iterators as the glue of the STL',
              intro: 'Iterators generalize the idea of a pointer, letting algorithms traverse any container through a uniform interface. Their category describes what movements and access they support.',
              points: [
                { term: 'The category ladder', detail: 'Categories range from input and output that allow a single forward pass, through forward and bidirectional, up to random access and contiguous which support jumps and pointer arithmetic.' },
                { term: 'Half open ranges', detail: 'A range is expressed as a begin iterator and a one past the end iterator. The end marks the stop point and is never dereferenced.' },
                { term: 'Algorithm requirements', detail: 'Each algorithm needs a minimum category. Sorting demands random access, while a simple find works with input iterators, which is why some algorithms suit only some containers.' },
                { term: 'Generic navigation', detail: 'The distance and advance helpers move and measure iterators in a category aware way, so the same code works whether the iterator supports jumps or only stepping.' },
                { term: 'Invalidation awareness', detail: 'Operations that modify a container may invalidate its iterators, so re fetch them after such changes rather than reusing stale ones.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cpp-iterator-adaptors',
        title: 'Insert and Stream Iterators',
        level: 2,
        slug: 'iterator-adaptors',
        concepts: [
          {
            id: 'cpp-insert-iters',
            code: '#include <iterator>\n#include <algorithm>\n\nstd::vector<int> src = {1, 2, 3, 4, 5};\nstd::vector<int> dst;\n\n// Back insert iterator\nstd::copy(src.begin(), src.end(), std::back_inserter(dst));\n\n// Stream iterator — print with delimiter\nstd::copy(src.begin(), src.end(),\n    std::ostream_iterator<int>(std::cout, ", "));\n\n// Read from stdin\nstd::vector<int> input(\n    std::istream_iterator<int>(std::cin),\n    std::istream_iterator<int>());',
            note: '`back_inserter` auto-calls `push_back`. `ostream_iterator` writes to a stream with a delimiter. `istream_iterator` reads from a stream until EOF. These bridge algorithms with I/O.',
            explanation: {
              heading: 'Iterator adaptors and stream bridges',
              intro: 'Some iterators do not point into a container at all. Instead they adapt insertion and stream input or output to the iterator interface, letting algorithms drive growth and I/O directly.',
              points: [
                { term: 'Insert iterators', detail: 'A back insert iterator turns an assignment through the iterator into a push back call, so an algorithm can grow a destination container rather than overwrite it.' },
                { term: 'Output stream iterator', detail: 'Writing through an output stream iterator sends each value to a stream, optionally separated by a delimiter, which is a compact way to print a range.' },
                { term: 'Input stream iterator', detail: 'An input stream iterator reads values from a stream one at a time until the end of input, letting you build a container straight from parsed data.' },
                { term: 'Decoupling algorithms', detail: 'These adaptors let a single algorithm target memory or I/O interchangeably, which is a powerful expression of the separation between algorithms and destinations.' },
                { term: 'Watch the sizing', detail: 'With plain copy into a fixed destination you must ensure room exists, whereas an insert iterator sidesteps that by growing the target as needed.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 17. Algorithms
  {
    id: 'cpp-algorithms',
    title: 'Algorithms',
    level: 1,
    slug: 'algorithms',
    concepts: [],
    children: [
      {
        id: 'cpp-sorting-searching',
        title: 'Sorting and Searching',
        level: 2,
        slug: 'sorting-searching',
        concepts: [
          {
            id: 'cpp-algo-sort',
            code: '#include <algorithm>\n\nstd::vector<int> v = {5, 2, 8, 1, 9, 3};\nstd::sort(v.begin(), v.end());  // ascending\nstd::sort(v.begin(), v.end(), std::greater<>());  // descending\n\n// Binary search (requires sorted range)\nbool found = std::binary_search(v.begin(), v.end(), 5);\nauto lb = std::lower_bound(v.begin(), v.end(), 5);\n\n// Partial sort — only sort first 3\nstd::partial_sort(v.begin(), v.begin() + 3, v.end());',
            note: '`std::sort` is O(n log n) introsort. `binary_search` returns bool; use `lower_bound`/`upper_bound` for position. `partial_sort` is efficient when you only need the top K elements.',
            explanation: {
              heading: 'Sorting and efficient searching',
              intro: 'The standard library provides well tested sorting and searching algorithms so you rarely write your own. Choosing the right one and respecting its preconditions is key to correctness and speed.',
              points: [
                { term: 'General sorting', detail: 'The sort algorithm runs in n log n time using an introsort hybrid and works on random access ranges. Supply a comparator to control the ordering.' },
                { term: 'Binary search needs sorted data', detail: 'Binary search and its relatives assume the range is already sorted by the same criterion. Running them on unsorted data gives wrong answers, not errors.' },
                { term: 'Finding positions', detail: 'Where binary search returns only a yes or no, lower bound and upper bound return iterators to the first and just past the last matching element.' },
                { term: 'Partial and nth element', detail: 'When you need only the top few results, partial sort and nth element do less work than a full sort by arranging just the portion you care about.' },
                { term: 'Stability', detail: 'Plain sort may reorder equal elements, so use stable sort when you must preserve the original relative order of items that compare equal.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cpp-transform-accumulate',
        title: 'Transform, Accumulate, and Reduce',
        level: 2,
        slug: 'transform-accumulate',
        concepts: [
          {
            id: 'cpp-algo-transform',
            code: '#include <algorithm>\n#include <numeric>\n\nstd::vector<int> v = {1, 2, 3, 4, 5};\n\n// Transform: apply function to each element\nstd::vector<int> squared;\nstd::transform(v.begin(), v.end(), std::back_inserter(squared),\n    [](int x) { return x * x; });\n\n// Accumulate: fold left\nint sum = std::accumulate(v.begin(), v.end(), 0);\n\n// Reduce: parallelizable (C++17)\nint product = std::reduce(v.begin(), v.end(), 1, std::multiplies<>());',
            note: '`transform` maps a function over a range. `accumulate` is sequential fold. `reduce` (C++17) allows parallel execution with `std::execution::par`. Use `transform_reduce` for map-reduce patterns.',
            explanation: {
              heading: 'Mapping and folding ranges',
              intro: 'Transform and the numeric fold algorithms let you express map and reduce style computations declaratively, replacing hand written loops with named, tested operations.',
              points: [
                { term: 'Transform maps values', detail: 'The transform algorithm applies a function to each element and writes the results to an output, which is the map half of map reduce.' },
                { term: 'Accumulate folds left', detail: 'Accumulate combines elements with a running result in strict left to right order, making it deterministic even for operations that are not associative.' },
                { term: 'Reduce enables parallelism', detail: 'Reduce from the seventeenth standard may reorder and group operations, so it can run in parallel but requires the combining operation to be associative and commutative.' },
                { term: 'Fused map reduce', detail: 'The transform reduce algorithm applies a mapping and combines the results in one pass, which is both concise and cache friendly.' },
                { term: 'Mind the initial value type', detail: 'The type of the seed argument determines the accumulation type, so pass a floating point seed when summing doubles to avoid truncation to integer.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 18. Smart Pointers
  {
    id: 'cpp-smart-pointers',
    title: 'Smart Pointers',
    level: 1,
    slug: 'smart-pointers',
    concepts: [],
    children: [
      {
        id: 'cpp-unique-ptr',
        title: 'std::unique_ptr',
        level: 2,
        slug: 'unique-ptr',
        concepts: [
          {
            id: 'cpp-unique-ptr-intro',
            code: '#include <memory>\n\n// Exclusive ownership — no copies allowed\nauto p = std::make_unique<int>(42);\nstd::cout << *p;  // 42\n\n// Transfer ownership\nauto p2 = std::move(p);  // p is now nullptr\n\n// Custom deleter\nauto file = std::unique_ptr<FILE, decltype(&fclose)>(\n    fopen("data.txt", "r"), &fclose\n);\n\n// Array form\nauto arr = std::make_unique<int[]>(10);',
            note: '`unique_ptr` has exclusive ownership — zero overhead over raw pointers. Cannot be copied, only moved. Use `make_unique` to avoid exception-safety issues. Custom deleters handle non-memory resources.',
            explanation: {
              heading: 'Exclusive ownership with unique pointer',
              intro: 'Unique pointer is the default smart pointer for single owner heap objects. It automatically frees what it owns when it goes out of scope, eliminating most manual delete calls.',
              points: [
                { term: 'Single owner', detail: 'At any time exactly one unique pointer owns the object. It cannot be copied, which enforces the single owner rule at compile time.' },
                { term: 'Transfer with move', detail: 'You transfer ownership by moving the pointer, after which the source becomes null. This makes handing off resources explicit and safe.' },
                { term: 'Prefer the factory', detail: 'Creating the pointer with make unique is exception safe and avoids a naked new, which prevents leaks if construction of surrounding arguments throws.' },
                { term: 'Zero overhead', detail: 'A unique pointer with the default deleter is the same size as a raw pointer and adds no runtime cost, so there is no reason to avoid it for owned memory.' },
                { term: 'Custom deleters', detail: 'Supplying a deleter lets a unique pointer manage non memory resources such as file handles or C library objects, cleaning them up automatically.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cpp-shared-ptr',
        title: 'std::shared_ptr and weak_ptr',
        level: 2,
        slug: 'shared-ptr',
        concepts: [
          {
            id: 'cpp-shared-ptr-intro',
            code: '#include <memory>\n\nauto sp1 = std::make_shared<std::string>("hello");\nauto sp2 = sp1;  // reference count: 2\nstd::cout << sp1.use_count();  // 2\n\n// weak_ptr breaks circular references\nstruct Node {\n    std::shared_ptr<Node> next;\n    std::weak_ptr<Node> prev;  // doesn\'t increment count\n};\n\nstd::weak_ptr<std::string> wp = sp1;\nif (auto locked = wp.lock()) {\n    std::cout << *locked;  // safe access\n}',
            note: '`shared_ptr` uses reference counting — destroyed when count hits zero. `make_shared` does a single allocation. `weak_ptr` observes without ownership — use `.lock()` to get a temporary `shared_ptr`.',
            explanation: {
              heading: 'Shared ownership and breaking cycles',
              intro: 'Shared pointer lets several owners share responsibility for an object, which is destroyed once the last owner releases it. Weak pointer observes such an object without keeping it alive.',
              points: [
                { term: 'Reference counting', detail: 'A shared pointer maintains a count of owners. Copying increments it and destruction decrements it, and the object is freed when the count reaches zero.' },
                { term: 'Single allocation factory', detail: 'Creating with make shared allocates the object and its control block together, which is faster and more cache friendly than constructing the two separately.' },
                { term: 'The cost of sharing', detail: 'The count updates are atomic to be thread safe, adding overhead, so prefer unique pointer unless ownership is genuinely shared.' },
                { term: 'Weak observers', detail: 'A weak pointer refers to a shared object without owning it, so it does not affect the count and detects when the object has already been destroyed.' },
                { term: 'Breaking reference cycles', detail: 'Two shared pointers referring to each other never reach a zero count and leak. Making one direction a weak pointer breaks the cycle so cleanup can proceed.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 19. Move Semantics
  {
    id: 'cpp-move-semantics',
    title: 'Move Semantics',
    level: 1,
    slug: 'move-semantics',
    concepts: [],
    children: [
      {
        id: 'cpp-move-basics',
        title: 'std::move and Rvalue References',
        level: 2,
        slug: 'move-basics',
        concepts: [
          {
            id: 'cpp-move-intro',
            code: '#include <utility>\n#include <vector>\n\nstd::vector<int> createLargeVector() {\n    std::vector<int> v(1000000, 42);\n    return v;  // NRVO: no copy, no move\n}\n\nstd::string a = "Hello World";\nstd::string b = std::move(a);  // a is now in valid-but-unspecified state\n// a.size() == 0 (typically)\n\nvoid process(std::vector<int>&& data) {\n    // data is an lvalue inside this function!\n    storage_ = std::move(data);  // must move again\n}',
            note: '`std::move` casts to rvalue reference — it does not move! The move constructor/assignment does the actual transfer. After moving, the source is in a valid but unspecified state. NRVO often eliminates moves entirely.',
            explanation: {
              heading: 'What move semantics really do',
              intro: 'Move semantics let objects transfer ownership of their resources instead of copying them, which is a major performance win for containers and strings. The mechanics surprise many newcomers.',
              points: [
                { term: 'Move is just a cast', detail: 'The move function does not move anything by itself. It casts its argument to an rvalue reference so that a move constructor or move assignment is chosen instead of a copy.' },
                { term: 'The moved from state', detail: 'After being moved from, an object is valid but unspecified, meaning you can safely destroy or reassign it but should not rely on its former contents.' },
                { term: 'Copy elision', detail: 'Returning a local object often skips both copy and move entirely because the compiler constructs the result directly in the caller, a benefit that is now guaranteed in some cases.' },
                { term: 'Do not move a return', detail: 'Wrapping a returned local in move usually pessimizes it by disabling elision, so return the local directly and let the compiler optimize.' },
                { term: 'When moving helps', detail: 'Apply move when you are done with a heavyweight local and want to hand its resources to another object, such as pushing a large string into a container.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cpp-move-constructors',
        title: 'Writing Move Constructors',
        level: 2,
        slug: 'move-constructors',
        concepts: [
          {
            id: 'cpp-move-ctor',
            code: 'class Image {\n    unsigned char* pixels_;\n    size_t width_, height_;\npublic:\n    // Move constructor\n    Image(Image&& other) noexcept\n        : pixels_(other.pixels_)\n        , width_(other.width_)\n        , height_(other.height_) {\n        other.pixels_ = nullptr;\n        other.width_ = other.height_ = 0;\n    }\n\n    // Move assignment\n    Image& operator=(Image&& other) noexcept {\n        if (this != &other) {\n            delete[] pixels_;\n            pixels_ = other.pixels_;\n            width_ = other.width_;\n            height_ = other.height_;\n            other.pixels_ = nullptr;\n            other.width_ = other.height_ = 0;\n        }\n        return *this;\n    }\n};',
            note: 'Move constructors steal resources from the source. Always mark them `noexcept` — STL containers only use move when it\'s noexcept (otherwise they copy for exception safety). Null out the source\'s pointers.',
            explanation: {
              heading: 'Implementing move operations',
              intro: 'When a class owns a resource directly, writing correct move operations makes it cheap to relocate. The pattern is to steal the source pointers and leave the source in a safe empty state.',
              points: [
                { term: 'Steal, do not copy', detail: 'A move constructor copies the pointers and sizes from the source rather than duplicating the buffer, then it resets the source so it no longer owns them.' },
                { term: 'Leave the source safe', detail: 'Null out the source handles and zero its sizes so its destructor does not free the resource you just stole. Failing to do so causes double free crashes.' },
                { term: 'Mark them noexcept', detail: 'Move operations should promise not to throw, because containers only choose move over copy during reallocation when the move is guaranteed not to throw.' },
                { term: 'Move assignment cleanup', detail: 'Move assignment must first release any resource it currently holds, guard against self assignment, and then take over the source resource.' },
                { term: 'Prefer the defaults', detail: 'If every member manages itself, defaulting the move operations lets the compiler generate correct code, so hand written moves are only for raw resource owners.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 20. Perfect Forwarding
  {
    id: 'cpp-perfect-forwarding',
    title: 'Perfect Forwarding',
    level: 1,
    slug: 'perfect-forwarding',
    concepts: [],
    children: [
      {
        id: 'cpp-forwarding-refs',
        title: 'Forwarding References and std::forward',
        level: 2,
        slug: 'forwarding-references',
        concepts: [
          {
            id: 'cpp-forward-intro',
            code: '// Forwarding reference (T&& with template deduction)\ntemplate <typename T>\nvoid wrapper(T&& arg) {\n    // Preserves value category: lvalue stays lvalue, rvalue stays rvalue\n    process(std::forward<T>(arg));\n}\n\n// Factory pattern with perfect forwarding\ntemplate <typename T, typename... Args>\nstd::unique_ptr<T> make(Args&&... args) {\n    return std::unique_ptr<T>(new T(std::forward<Args>(args)...));\n}',
            note: '`T&&` in a template is a forwarding reference (not rvalue reference). `std::forward` conditionally casts to rvalue only if the original argument was an rvalue. Essential for generic factory functions and wrappers.',
            explanation: {
              heading: 'Preserving value category with forwarding',
              intro: 'Perfect forwarding lets a wrapper pass its arguments onward exactly as it received them, keeping lvalues as lvalues and rvalues as rvalues. This is essential for generic factory and wrapper functions.',
              points: [
                { term: 'Forwarding references', detail: 'A parameter written as two ampersands after a deduced template type is a forwarding reference, which binds to both lvalues and rvalues and remembers which it was.' },
                { term: 'The forward helper', detail: 'The forward function casts back to an rvalue only when the original argument was an rvalue, so it restores the value category the caller supplied.' },
                { term: 'Move versus forward', detail: 'Use move for a concrete object you own and forward for a deduced forwarding reference. Confusing them either copies too much or moves something you should not.' },
                { term: 'Why factories need it', detail: 'A generic factory forwards its arguments into a constructor so that temporaries are moved and named objects are copied, matching a direct construction call.' },
                { term: 'Forward once', detail: 'Forward or move each argument at most once, because after forwarding an rvalue its contents may have been transferred away.' },
              ],
            },
            example: 'std::string s = "hello";\nwrapper(s);             // T=string&, forwards as lvalue\nwrapper(std::string()); // T=string, forwards as rvalue',
          },
        ],
        children: [],
      },
      {
        id: 'cpp-emplace-pattern',
        title: 'Emplace and In-Place Construction',
        level: 2,
        slug: 'emplace-pattern',
        concepts: [
          {
            id: 'cpp-emplace-intro',
            code: 'std::vector<std::pair<std::string, int>> v;\n\n// push_back: constructs pair, then moves into vector\nv.push_back({"Alice", 30});\n\n// emplace_back: constructs directly in vector memory\nv.emplace_back("Bob", 25);  // no temporary pair created\n\n// map emplace\nstd::map<std::string, std::vector<int>> m;\nm.emplace("scores", std::initializer_list<int>{90, 85, 92});\n\n// try_emplace: won\'t construct value if key exists\nm.try_emplace("scores", {100});  // no-op, key exists',
            note: 'Emplace functions use perfect forwarding to construct objects directly in container memory. `try_emplace` (C++17) avoids constructing the value if the key already exists — more efficient for expensive types.',
            explanation: {
              heading: 'In place construction with emplace',
              intro: 'Emplace functions build an element directly inside a container from constructor arguments, skipping the temporary that a push style call may create. They rely on perfect forwarding under the hood.',
              points: [
                { term: 'Constructing in place', detail: 'Emplace forwards its arguments straight to the element constructor within the container storage, avoiding a separate temporary and an extra move or copy.' },
                { term: 'When it helps most', detail: 'The savings are largest for expensive to construct types. For small trivial types the difference between push and emplace is negligible.' },
                { term: 'Conditional insertion', detail: 'The try emplace function for maps does nothing if the key already exists, and crucially it does not even build the value, which matters for heavy value types.' },
                { term: 'Argument ambiguity', detail: 'Because emplace forwards raw constructor arguments, a braced list can be ambiguous, so occasionally you must spell out the element type explicitly.' },
                { term: 'Readability tradeoff', detail: 'Emplace can be less obvious than push back at a glance, so prefer push back when clarity matters and the performance gain is not meaningful.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 21. RAII
  {
    id: 'cpp-raii',
    title: 'RAII (Resource Acquisition Is Initialization)',
    level: 1,
    slug: 'raii',
    concepts: [],
    children: [
      {
        id: 'cpp-raii-pattern',
        title: 'RAII Pattern and Scope Guards',
        level: 2,
        slug: 'raii-pattern',
        concepts: [
          {
            id: 'cpp-raii-intro',
            code: 'class FileHandle {\n    FILE* file_;\npublic:\n    FileHandle(const char* path, const char* mode)\n        : file_(fopen(path, mode)) {\n        if (!file_) throw std::runtime_error("Cannot open file");\n    }\n    ~FileHandle() { if (file_) fclose(file_); }\n\n    // Non-copyable, movable\n    FileHandle(const FileHandle&) = delete;\n    FileHandle& operator=(const FileHandle&) = delete;\n    FileHandle(FileHandle&& o) noexcept : file_(o.file_) { o.file_ = nullptr; }\n\n    FILE* get() const { return file_; }\n};',
            note: 'RAII binds resource lifetime to object scope. Constructors acquire; destructors release. This guarantees cleanup even on exceptions. Core C++ idiom — applies to memory, files, locks, sockets, and more.',
            explanation: {
              heading: 'Tying resources to object lifetime',
              intro: 'Resource acquisition is initialization is the defining C++ idiom for managing resources. By binding a resource to the lifetime of an object, cleanup happens automatically and reliably.',
              points: [
                { term: 'Acquire in the constructor', detail: 'The constructor obtains the resource, such as opening a file or locking a mutex, so a fully constructed object always holds a valid resource.' },
                { term: 'Release in the destructor', detail: 'The destructor gives the resource back. Because destructors run automatically at scope exit, you cannot forget to release the resource.' },
                { term: 'Exception safety', detail: 'When an exception unwinds the stack, destructors of local objects still run, so resources are freed even on error paths without any explicit cleanup code.' },
                { term: 'Broadly applicable', detail: 'The same pattern manages memory, file handles, locks, sockets, and database connections, which is why the standard smart pointers and lock guards all use it.' },
                { term: 'Control copying', detail: 'A resource owning class should decide whether it can be copied or only moved, otherwise two objects may try to release the same resource.' },
              ],
            },
            example: 'void process() {\n    FileHandle f("data.txt", "r");  // opened\n    // ... use f.get() ...\n}  // automatically closed here, even if exception thrown',
          },
        ],
        children: [],
      },
      {
        id: 'cpp-lock-guard',
        title: 'RAII for Locks and Transactions',
        level: 2,
        slug: 'lock-guard',
        concepts: [
          {
            id: 'cpp-lockguard-intro',
            code: '#include <mutex>\n\nstd::mutex mtx;\nint shared_data = 0;\n\nvoid safe_increment() {\n    std::lock_guard<std::mutex> lock(mtx);  // locked\n    ++shared_data;\n}  // unlocked automatically\n\n// C++17: std::scoped_lock for multiple mutexes\nvoid transfer(Account& from, Account& to, int amount) {\n    std::scoped_lock lock(from.mtx, to.mtx);  // deadlock-free\n    from.balance -= amount;\n    to.balance += amount;\n}',
            note: '`lock_guard` is the simplest RAII lock wrapper. `scoped_lock` (C++17) locks multiple mutexes atomically without deadlock. `unique_lock` adds deferred locking and condition variable support.',
            explanation: {
              heading: 'RAII wrappers for locking',
              intro: 'Applying the resource idiom to mutexes guarantees that a lock is always released, even when a function returns early or throws. The standard library provides several lock wrappers for different needs.',
              points: [
                { term: 'The simple guard', detail: 'A lock guard locks a mutex when constructed and unlocks it when destroyed, which covers the common case of protecting a critical section within a scope.' },
                { term: 'Locking multiple mutexes', detail: 'The scoped lock introduced in the seventeenth standard locks several mutexes at once using a deadlock avoidance algorithm, so lock order does not cause hangs.' },
                { term: 'The flexible unique lock', detail: 'A unique lock supports deferred locking, timed attempts, and manual unlocking, and it is required when waiting on a condition variable.' },
                { term: 'Avoiding deadlock', detail: 'When you must lock mutexes separately, always acquire them in a consistent global order across the program to prevent circular waiting.' },
                { term: 'Keep sections small', detail: 'Hold locks for as short a time as possible to reduce contention, releasing before doing slow work like input and output where practical.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 22. Exceptions
  {
    id: 'cpp-exceptions',
    title: 'Exceptions',
    level: 1,
    slug: 'exceptions',
    concepts: [],
    children: [
      {
        id: 'cpp-exception-handling',
        title: 'Try-Catch and Exception Hierarchy',
        level: 2,
        slug: 'exception-handling',
        concepts: [
          {
            id: 'cpp-exceptions-intro',
            code: '#include <stdexcept>\n\ndouble divide(double a, double b) {\n    if (b == 0.0)\n        throw std::invalid_argument("Division by zero");\n    return a / b;\n}\n\ntry {\n    double result = divide(10, 0);\n} catch (const std::invalid_argument& e) {\n    std::cerr << "Error: " << e.what() << "\\n";\n} catch (const std::exception& e) {\n    std::cerr << "General: " << e.what() << "\\n";\n} catch (...) {\n    std::cerr << "Unknown exception\\n";\n}',
            note: 'Exceptions propagate up the call stack until caught. Catch by `const&` to avoid slicing. Order catches from most specific to least. Use standard exception classes from `<stdexcept>` as base.',
            explanation: {
              heading: 'Handling errors with exceptions',
              intro: 'Exceptions separate error handling from normal control flow by propagating a thrown object up the call stack until a matching handler catches it. This keeps the happy path clean.',
              points: [
                { term: 'Throw and catch', detail: 'A throw expression raises an exception, and the runtime unwinds the stack running destructors until it finds a catch block whose type matches.' },
                { term: 'Catch by const reference', detail: 'Catching by const reference avoids copying the exception and prevents slicing, which would otherwise discard the derived part of a polymorphic exception.' },
                { term: 'Order matters', detail: 'The first matching handler wins, so list more specific exception types before their base classes, otherwise the base handler intercepts everything.' },
                { term: 'The standard hierarchy', detail: 'Deriving your exceptions from the standard exception types lets generic handlers catch them and read a human readable message through a common interface.' },
                { term: 'Exception safety', detail: 'Aim to leave objects in a valid state when an exception passes through, ideally the strong guarantee where an operation either fully succeeds or has no effect.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cpp-custom-exceptions',
        title: 'Custom Exceptions and noexcept',
        level: 2,
        slug: 'custom-exceptions',
        concepts: [
          {
            id: 'cpp-custom-exc',
            code: 'class NetworkError : public std::runtime_error {\n    int code_;\npublic:\n    NetworkError(const std::string& msg, int code)\n        : std::runtime_error(msg), code_(code) {}\n    int code() const noexcept { return code_; }\n};\n\n// noexcept specification\nvoid swap(int& a, int& b) noexcept {\n    int tmp = a; a = b; b = tmp;\n}\n\n// Conditional noexcept\ntemplate <typename T>\nvoid safe_swap(T& a, T& b) noexcept(noexcept(std::swap(a, b))) {\n    std::swap(a, b);\n}',
            note: '`noexcept` promises no exceptions — enables optimizations and is required for move operations used by containers. `noexcept(expr)` conditionally propagates the noexcept status of inner operations.',
            explanation: {
              heading: 'Custom exceptions and noexcept',
              intro: 'Defining your own exception types adds context to errors, and the noexcept specifier documents and enforces that a function will not throw. Both improve reliability and performance.',
              points: [
                { term: 'Deriving exceptions', detail: 'Base your exception on a standard runtime or logic error so it fits the existing hierarchy, and add fields such as an error code to carry extra context.' },
                { term: 'The what message', detail: 'The inherited what function returns a description of the error, so passing a helpful message to the base constructor aids debugging.' },
                { term: 'The noexcept promise', detail: 'Marking a function noexcept declares it will not throw. If it does throw anyway, the program terminates, so only promise it when you are certain.' },
                { term: 'Why containers care', detail: 'Standard containers only move elements during reallocation when the move is noexcept, otherwise they copy for safety, so noexcept move operations improve performance.' },
                { term: 'Conditional noexcept', detail: 'The noexcept operator lets a function propagate the throwing status of the operations it calls, which is useful for generic wrappers and swaps.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 23. Namespaces
  {
    id: 'cpp-namespaces',
    title: 'Namespaces',
    level: 1,
    slug: 'namespaces',
    concepts: [],
    children: [
      {
        id: 'cpp-namespace-basics',
        title: 'Namespace Declaration and Usage',
        level: 2,
        slug: 'namespace-basics',
        concepts: [
          {
            id: 'cpp-namespace-intro',
            code: 'namespace math {\n    constexpr double PI = 3.14159265358979;\n\n    double circleArea(double r) {\n        return PI * r * r;\n    }\n\n    namespace geometry {\n        struct Point { double x, y; };\n    }\n}\n\n// C++17: nested namespace shorthand\nnamespace math::geometry::three_d {\n    struct Point3D { double x, y, z; };\n}\n\n// Usage\nusing math::geometry::Point;\nPoint p{1.0, 2.0};\ndouble area = math::circleArea(5.0);',
            note: 'Namespaces prevent name collisions. Use `::` for qualified access. `using` declarations import specific names; avoid `using namespace` in headers. C++17 allows nested namespace definitions.',
            explanation: {
              heading: 'Organizing names to avoid clashes',
              intro: 'Namespaces group related declarations under a name so that identifiers from different libraries do not collide. They are essential for building and combining large codebases.',
              points: [
                { term: 'Qualified access', detail: 'You reach a name inside a namespace with the scope resolution operator, spelling out the namespace and then the name, which makes the origin explicit.' },
                { term: 'Using declarations', detail: 'A using declaration brings a single name into scope for convenience, which is safer than importing an entire namespace and polluting the current scope.' },
                { term: 'Avoid using directives in headers', detail: 'Placing a whole namespace import in a header leaks it into every file that includes the header, inviting surprising ambiguities, so keep such directives out of headers.' },
                { term: 'Nested shorthand', detail: 'The seventeenth standard lets you declare nested namespaces in one compact line, which reduces indentation for deeply nested library structures.' },
                { term: 'Argument dependent lookup', detail: 'The compiler also searches the namespaces of a function argument type, which is how operators defined alongside a type are found without qualification.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cpp-anonymous-inline-ns',
        title: 'Anonymous and Inline Namespaces',
        level: 2,
        slug: 'anonymous-inline-ns',
        concepts: [
          {
            id: 'cpp-anon-ns',
            code: '// Anonymous namespace: internal linkage (like static)\nnamespace {\n    int helper_counter = 0;\n    void internal_impl() { ++helper_counter; }\n}\n\n// Inline namespace: for API versioning\nnamespace mylib {\n    inline namespace v2 {\n        void process() { /* v2 implementation */ }\n    }\n    namespace v1 {\n        void process() { /* legacy */ }\n    }\n}\n\nmylib::process();      // calls v2\nmylib::v1::process();  // explicit v1',
            note: 'Anonymous namespaces provide file-scope internal linkage (preferred over `static` for functions). Inline namespaces make their contents visible in the enclosing namespace — used for ABI versioning.',
            explanation: {
              heading: 'Anonymous and inline namespaces',
              intro: 'Two special forms of namespace serve distinct purposes: one hides names from other files, and the other exposes a versioned inner namespace as if it were the outer one.',
              points: [
                { term: 'Internal linkage', detail: 'Names in an anonymous namespace are visible only within their own translation unit, which is the modern way to keep helpers private to a file.' },
                { term: 'Preferred over file static', detail: 'For functions and types, an anonymous namespace is preferred to the older file scope static keyword because it works uniformly for all kinds of declarations.' },
                { term: 'Inline namespaces', detail: 'An inline namespace makes its contents appear as though they belong to the enclosing namespace, so callers use the short name while the version stays recorded.' },
                { term: 'Versioning', detail: 'Library authors wrap the current version of an interface in an inline namespace so newer and older versions can coexist and the linker distinguishes them.' },
                { term: 'Symbol distinction', detail: 'Because the versioned name is part of the mangled symbol, code compiled against different versions will not accidentally link together, preventing subtle mismatches.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 24. constexpr and Compile-Time Programming
  {
    id: 'cpp-constexpr',
    title: 'constexpr & Compile-Time',
    level: 1,
    slug: 'constexpr',
    concepts: [],
    children: [
      {
        id: 'cpp-constexpr-vars',
        title: 'constexpr Variables and if constexpr',
        level: 2,
        slug: 'constexpr-variables',
        concepts: [
          {
            id: 'cpp-constexpr-intro',
            code: 'constexpr int MAX_SIZE = 1024;\nconstexpr double GOLDEN = 1.618033988749;\n\n// if constexpr: compile-time branching (C++17)\ntemplate <typename T>\nstd::string stringify(T value) {\n    if constexpr (std::is_arithmetic_v<T>) {\n        return std::to_string(value);\n    } else if constexpr (std::is_same_v<T, std::string>) {\n        return value;\n    } else {\n        return "unknown";\n    }\n}',
            note: '`constexpr` variables are compile-time constants. `if constexpr` (C++17) discards branches at compile time — no runtime cost, no need for SFINAE. Dead branches are not instantiated.',
            explanation: {
              heading: 'Compile time constants and branching',
              intro: 'Compile time programming moves work from runtime into the build, producing constants and selecting code paths before the program ever runs. This can improve both performance and type safety.',
              points: [
                { term: 'Constexpr variables', detail: 'A constexpr variable is a true compile time constant usable where the language requires one, such as an array size or a template argument.' },
                { term: 'Compile time branching', detail: 'The if constexpr form evaluates its condition during compilation and discards the branch not taken, so the discarded code is never even instantiated.' },
                { term: 'Simplifying generic code', detail: 'Because the dead branch is dropped, if constexpr lets a template handle several type cases in one function without the older substitution failure tricks.' },
                { term: 'Const versus constexpr', detail: 'A const value merely cannot change, while a constexpr value must be computable at compile time, which is a stronger and more useful guarantee here.' },
                { term: 'Build time tradeoff', detail: 'Shifting computation to compile time trims runtime cost but can lengthen builds, so reserve heavy compile time work for cases that genuinely benefit.' },
              ],
            },
            example: 'auto s1 = stringify(42);         // "42"\nauto s2 = stringify(std::string("hi")); // "hi"',
          },
        ],
        children: [],
      },
      {
        id: 'cpp-consteval-constinit',
        title: 'consteval and constinit (C++20)',
        level: 2,
        slug: 'consteval-constinit',
        concepts: [
          {
            id: 'cpp-consteval-intro',
            code: '// consteval: MUST be evaluated at compile time\nconsteval int square(int n) { return n * n; }\nconstexpr int s = square(5);  // OK: 25\n// int x = 5; square(x);  // ERROR: not a constant expression\n\n// constinit: ensures static initialization\nconstinit int global_val = 42;  // no static init order fiasco\n// global_val = 100;  // OK: can be modified at runtime\n\n// Compile-time string processing\nconsteval bool starts_with(const char* str, const char* prefix) {\n    while (*prefix) {\n        if (*str++ != *prefix++) return false;\n    }\n    return true;\n}\nstatic_assert(starts_with("hello world", "hello"));',
            note: '`consteval` (C++20) creates immediate functions — always compile-time. `constinit` ensures a variable is initialized at compile time but allows runtime modification. Eliminates the static initialization order fiasco.',
            explanation: {
              heading: 'Stronger compile time guarantees',
              intro: 'The twentieth standard adds two keywords that tighten control over when things happen. One forces a function to run at compile time, and the other guarantees static initialization without freezing the value.',
              points: [
                { term: 'Immediate functions', detail: 'A consteval function must be evaluated at compile time, so every call produces a constant and passing a runtime value is a compile error.' },
                { term: 'Guaranteed static init', detail: 'A constinit variable must be initialized during compilation, which removes runtime initialization while still permitting later modification, unlike constexpr.' },
                { term: 'The initialization order fiasco', detail: 'Global objects in different files have unspecified initialization order, which can cause one to use another before it is ready. Constinit sidesteps this for constant initialized globals.' },
                { term: 'Choosing among them', detail: 'Use constexpr for values usable at compile or run time, consteval when compile time is mandatory, and constinit to fix static initialization timing.' },
                { term: 'Compile time strings', detail: 'These features enable compile time processing such as validating string literals, with results checked by static assertions before the program runs.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 25. Lambdas
  {
    id: 'cpp-lambdas',
    title: 'Lambdas',
    level: 1,
    slug: 'lambdas',
    concepts: [],
    children: [
      {
        id: 'cpp-lambda-basics',
        title: 'Lambda Syntax and Captures',
        level: 2,
        slug: 'lambda-basics',
        concepts: [
          {
            id: 'cpp-lambda-intro',
            code: '// Basic lambda\nauto add = [](int a, int b) { return a + b; };\n\n// Captures\nint factor = 3;\nauto multiply = [factor](int x) { return x * factor; };\nauto increment = [&factor]() { ++factor; };  // by reference\n\n// Generic lambda (C++14)\nauto print = [](const auto& x) { std::cout << x << "\\n"; };\n\n// Mutable lambda\nauto counter = [n = 0]() mutable { return ++n; };\nstd::cout << counter() << counter();  // 1 2',
            note: 'Lambdas are inline function objects. `[]` captures nothing, `[=]` copies all, `[&]` references all. Init captures (`[n = 0]`) create new variables. `mutable` allows modifying captured copies.',
            explanation: {
              heading: 'Inline function objects',
              intro: 'A lambda is a compact way to define an anonymous function object right where you use it. Lambdas are the natural companion to standard algorithms that take a callable.',
              points: [
                { term: 'The capture list', detail: 'The brackets specify what surrounding variables the lambda can use. An empty list captures nothing, while explicit names capture just what you need.' },
                { term: 'By value versus by reference', detail: 'Capturing by value copies a variable into the lambda, while capturing by reference lets it read and modify the original. Reference captures risk dangling if the lambda outlives them.' },
                { term: 'Init captures', detail: 'You can introduce a brand new member in the capture, initialized from any expression, which is how you move an object into a lambda or hold state.' },
                { term: 'Mutable lambdas', detail: 'By default the call operator is const, so captured copies cannot be changed. Adding mutable lets the lambda modify its own captured copies between calls.' },
                { term: 'Prefer explicit captures', detail: 'Capturing everything by reference or value is convenient but can hide bugs and lifetime issues, so listing captures explicitly is clearer and safer.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cpp-lambda-advanced',
        title: 'Lambda Templates and Recursive Lambdas',
        level: 2,
        slug: 'lambda-advanced',
        concepts: [
          {
            id: 'cpp-lambda-adv',
            code: '// Template lambda (C++20)\nauto get_size = []<typename T>(const std::vector<T>& v) {\n    return v.size();\n};\n\n// Immediately-invoked lambda\nconst auto config = [&]() {\n    Config c;\n    c.load("settings.ini");\n    return c;\n}();  // called immediately\n\n// Recursive lambda with std::function or deducing this (C++23)\nauto fib = [](this auto self, int n) -> int {\n    return n <= 1 ? n : self(n-1) + self(n-2);\n};',
            note: 'C++20 template lambdas give full template syntax. Immediately-invoked lambdas initialize complex constants. C++23 deducing `this` enables recursive lambdas without `std::function` overhead.',
            explanation: {
              heading: 'Advanced lambda techniques',
              intro: 'Modern standards expand what lambdas can express, from full template parameter lists to self reference. These techniques keep even complex logic local and readable.',
              points: [
                { term: 'Generic and template lambdas', detail: 'A lambda parameter declared as auto is generic, and the twentieth standard adds explicit template parameter syntax for cases needing the type name directly.' },
                { term: 'Immediately invoked lambdas', detail: 'Defining a lambda and calling it at once lets you run setup logic inline and initialize a complex constant, keeping the setup close to its result.' },
                { term: 'Recursive lambdas', detail: 'The twenty three deducing this feature gives a lambda a name for itself, enabling recursion without the overhead of wrapping it in a general purpose function object.' },
                { term: 'Capturing this', detail: 'Inside a class, a lambda can capture the enclosing object, but be careful that the object outlives the lambda or capture the needed members by value.' },
                { term: 'Storing lambdas', detail: 'Each lambda has a unique unnamed type, so to store one in a variable of fixed type you use a general callable wrapper, at some runtime cost.' },
              ],
            },
            example: 'std::vector<int> v = {3, 1, 4, 1, 5};\nstd::sort(v.begin(), v.end(), [](int a, int b) { return a > b; });\n// v: {5, 4, 3, 1, 1}',
          },
        ],
        children: [],
      },
    ],
  },

  // 26. Ranges (C++20)
  {
    id: 'cpp-ranges',
    title: 'Ranges (C++20)',
    level: 1,
    slug: 'ranges',
    concepts: [],
    children: [
      {
        id: 'cpp-ranges-views',
        title: 'Views and Pipe Syntax',
        level: 2,
        slug: 'ranges-views',
        concepts: [
          {
            id: 'cpp-ranges-intro',
            code: '#include <ranges>\n#include <vector>\n\nstd::vector<int> nums = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};\n\n// Composable, lazy views with pipe syntax\nauto result = nums\n    | std::views::filter([](int n) { return n % 2 == 0; })\n    | std::views::transform([](int n) { return n * n; })\n    | std::views::take(3);\n\n// result: {4, 16, 36} — computed lazily\nfor (int x : result) {\n    std::cout << x << " ";\n}',
            note: 'Ranges provide composable, lazy operations on sequences using pipe (`|`) syntax. Views are non-owning and cheap to copy. No intermediate containers are created — each element flows through the pipeline.',
            explanation: {
              heading: 'Composable lazy pipelines',
              intro: 'Ranges let you express data transformations as a pipeline of small steps joined with the pipe operator. The result reads top to bottom and computes elements only as they are consumed.',
              points: [
                { term: 'Views are lazy', detail: 'A view does not process any elements until you iterate it, so chaining a filter and a transform does the work one element at a time on demand.' },
                { term: 'No intermediate containers', detail: 'Because each element flows through the whole pipeline before the next one is produced, no temporary vectors are allocated between stages, saving memory.' },
                { term: 'Non owning and cheap', detail: 'Views refer to an underlying range rather than owning it, so copying a view is cheap, but the underlying data must outlive the view.' },
                { term: 'Composability', detail: 'Small adaptors like filter, transform, and take combine into readable pipelines that replace nested loops and manual bookkeeping.' },
                { term: 'Materializing results', detail: 'When you need a concrete container from a view, copy its elements into a vector, since a view itself only describes the computation.' },
              ],
            },
            example: 'auto words = std::string("hello world foo")\n    | std::views::split(\' \')\n    | std::views::transform([](auto rng) {\n        return std::string(rng.begin(), rng.end());\n    });',
          },
        ],
        children: [],
      },
      {
        id: 'cpp-ranges-algorithms',
        title: 'Range Algorithms and Projections',
        level: 2,
        slug: 'ranges-algorithms',
        concepts: [
          {
            id: 'cpp-ranges-algo',
            code: '#include <ranges>\n#include <algorithm>\n\nstruct Person {\n    std::string name;\n    int age;\n};\n\nstd::vector<Person> people = {\n    {"Alice", 30}, {"Bob", 25}, {"Charlie", 35}\n};\n\n// Range algorithm with projection\nstd::ranges::sort(people, {}, &Person::age);  // sort by age\n\n// Range algorithms take the container directly\nauto oldest = std::ranges::max_element(people, {}, &Person::age);\n\n// Dangling protection\n// auto it = std::ranges::find(getVector(), 42);  // compile error: dangling!',
            note: 'Range algorithms accept containers directly (no begin/end). Projections apply a transformation before comparison. The library prevents dangling iterators at compile time with `std::ranges::dangling`.',
            explanation: {
              heading: 'Range algorithms and projections',
              intro: 'The range versions of the standard algorithms are safer and more convenient than the iterator pair forms. They take whole containers and add projections for cleaner comparisons.',
              points: [
                { term: 'Pass containers directly', detail: 'Range algorithms accept a container in one argument instead of a begin and end pair, which removes a common mistake of mismatched iterators.' },
                { term: 'Projections', detail: 'A projection is a function applied to each element before the algorithm compares it, so you can sort a list of records by a single field without a custom comparator.' },
                { term: 'Dangling protection', detail: 'If you pass a temporary container, the library returns a special dangling marker instead of an iterator into destroyed memory, catching the bug at compile time.' },
                { term: 'Constrained by concepts', detail: 'Range algorithms are defined with concepts, so misusing them yields clearer error messages than the older unconstrained templates.' },
                { term: 'Interop with views', detail: 'You can feed a view into a range algorithm, combining lazy pipelines with eager operations like finding a maximum in one expressive statement.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 27. Concepts (C++20)
  {
    id: 'cpp-concepts',
    title: 'Concepts (C++20)',
    level: 1,
    slug: 'concepts',
    concepts: [],
    children: [
      {
        id: 'cpp-concepts-basics',
        title: 'Defining and Using Concepts',
        level: 2,
        slug: 'concepts-basics',
        concepts: [
          {
            id: 'cpp-concepts-intro',
            code: '#include <concepts>\n\n// Define a concept\ntemplate <typename T>\nconcept Numeric = std::integral<T> || std::floating_point<T>;\n\n// Constrained template\ntemplate <Numeric T>\nT average(std::span<const T> values) {\n    T sum = std::accumulate(values.begin(), values.end(), T{});\n    return sum / static_cast<T>(values.size());\n}\n\n// Shorthand with auto\nvoid print(std::integral auto n) {\n    std::cout << n << "\\n";\n}\n\n// requires clause\ntemplate <typename T>\n    requires std::copyable<T> && std::equality_comparable<T>\nclass Cache { /* ... */ };',
            note: 'Concepts constrain templates with readable requirements. They replace SFINAE with clear compile errors. Use standard concepts from `<concepts>` or define your own with `concept` keyword.',
            explanation: {
              heading: 'Constraining templates readably',
              intro: 'Concepts let you state the requirements a template type must meet in plain, named terms. They replace obscure metaprogramming tricks with intent revealing constraints and much better error messages.',
              points: [
                { term: 'What a concept is', detail: 'A concept is a named compile time predicate on types. A template constrained by a concept only accepts types that satisfy it, and others are rejected clearly.' },
                { term: 'Better error messages', detail: 'When a type fails a concept, the compiler reports which requirement was not met, instead of the deep cascade of errors typical of the older substitution based approach.' },
                { term: 'Standard concepts', detail: 'The concepts header supplies ready made predicates like integral and copyable, so you often constrain templates without defining anything yourself.' },
                { term: 'Terse syntax', detail: 'A constrained parameter can be written with the concept name in place of the type, which reads like an ordinary parameter while enforcing the requirement.' },
                { term: 'Documenting intent', detail: 'Because the constraint names the expected capabilities, the template signature itself documents what kinds of type it works with, aiding readers and tools.' },
              ],
            },
            example: '// average(std::span<const std::string>{});  // compile error: string is not Numeric',
          },
        ],
        children: [],
      },
      {
        id: 'cpp-concepts-advanced',
        title: 'Compound Requirements and Subsumption',
        level: 2,
        slug: 'concepts-advanced',
        concepts: [
          {
            id: 'cpp-concepts-adv',
            code: 'template <typename T>\nconcept Hashable = requires(T t) {\n    { std::hash<T>{}(t) } -> std::convertible_to<size_t>;\n};\n\ntemplate <typename C>\nconcept Container = requires(C c) {\n    typename C::value_type;\n    typename C::iterator;\n    { c.begin() } -> std::input_or_output_iterator;\n    { c.end() } -> std::sentinel_for<decltype(c.begin())>;\n    { c.size() } -> std::convertible_to<size_t>;\n};\n\n// Concept subsumption: more constrained overload wins\ntemplate <std::integral T>\nvoid process(T val) { /* integral path */ }\n\ntemplate <std::signed_integral T>\nvoid process(T val) { /* more specific: signed integral */ }',
            note: 'Compound `requires` expressions check syntax, return types, and associated types. Concept subsumption enables overload resolution — the most constrained matching concept wins without ambiguity.',
            explanation: {
              heading: 'Rich requirements and overload selection',
              intro: 'Beyond simple predicates, concepts can express detailed requirements about a type using requires expressions, and the compiler uses their relative strength to choose among overloads.',
              points: [
                { term: 'Requires expressions', detail: 'A requires expression lists operations that must be valid for a type, such as calling a method or naming a nested type, forming a checklist the type must pass.' },
                { term: 'Checking return types', detail: 'A compound requirement can also constrain the result of an expression, for example demanding that a hash call yields something convertible to a size type.' },
                { term: 'Associated types', detail: 'Requirements can insist that a type provides certain member type aliases, which is how container like concepts express their element and iterator types.' },
                { term: 'Subsumption', detail: 'When several constrained overloads match, the one with the more specific set of requirements is chosen, so a signed integral overload wins over a plain integral one.' },
                { term: 'Composing concepts', detail: 'You build larger concepts from smaller ones with logical operators, and the subsumption rules understand this structure to resolve overloads without ambiguity.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 28. Coroutines (C++20)
  {
    id: 'cpp-coroutines',
    title: 'Coroutines (C++20)',
    level: 1,
    slug: 'coroutines',
    concepts: [],
    children: [
      {
        id: 'cpp-coroutine-basics',
        title: 'Generators with co_yield',
        level: 2,
        slug: 'coroutine-basics',
        concepts: [
          {
            id: 'cpp-coroutine-intro',
            code: '#include <coroutine>\n#include <generator>  // C++23, or custom implementation\n\n// Generator: lazily produces values\nstd::generator<int> fibonacci() {\n    int a = 0, b = 1;\n    while (true) {\n        co_yield a;\n        auto next = a + b;\n        a = b;\n        b = next;\n    }\n}\n\n// Usage\nfor (int val : fibonacci() | std::views::take(10)) {\n    std::cout << val << " ";  // 0 1 1 2 3 5 8 13 21 34\n}',
            note: 'Coroutines are functions that can suspend (`co_yield`, `co_await`, `co_return`) and resume. Generators lazily produce sequences. The coroutine state is heap-allocated (compiler may optimize away).',
            explanation: {
              heading: 'Functions that pause and resume',
              intro: 'Coroutines are functions that can suspend their execution and resume later, keeping their local state across the pause. They make lazy generators and asynchronous code read like ordinary sequential code.',
              points: [
                { term: 'The coroutine keywords', detail: 'A function becomes a coroutine when its body uses yield, await, or the coroutine return statement, which introduce suspension and resumption points.' },
                { term: 'Yielding values', detail: 'A generator uses the yield expression to produce a value and pause. The caller pulls the next value on demand, so an infinite sequence is fine when consumed finitely.' },
                { term: 'State preservation', detail: 'Between suspensions the coroutine keeps its locals in a state object, typically on the heap, though the compiler can sometimes elide that allocation.' },
                { term: 'Library support needed', detail: 'The language provides the machinery, but you rely on a return type such as a generator to actually use coroutines, with a standard generator arriving in the twenty three standard.' },
                { term: 'Lazy evaluation benefits', detail: 'Because values are produced only as requested, generators compose neatly with ranges views and avoid building large intermediate collections.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cpp-async-coroutines',
        title: 'Async Tasks with co_await',
        level: 2,
        slug: 'async-coroutines',
        concepts: [
          {
            id: 'cpp-coawait-intro',
            code: '// Simplified async task (real code needs a Task<T> type)\nTask<std::string> fetch_data(std::string url) {\n    auto connection = co_await async_connect(url);\n    auto response = co_await connection.read();\n    co_return response.body();\n}\n\nTask<void> process_all() {\n    auto data1 = co_await fetch_data("https://api.example.com/a");\n    auto data2 = co_await fetch_data("https://api.example.com/b");\n    std::cout << data1 << data2;\n}\n\n// The promise_type and awaiter customization points:\n// - promise_type: controls coroutine behavior\n// - operator co_await: defines how suspension works\n// - await_ready, await_suspend, await_resume: awaiter interface',
            note: '`co_await` suspends until an async operation completes. The compiler transforms coroutines into state machines. You need a library or custom `Task<T>` type — the standard provides the machinery, not the types (until C++23 `std::generator`).',
            explanation: {
              heading: 'Asynchronous code with await',
              intro: 'The await expression lets a coroutine suspend until an asynchronous operation finishes, then resume with its result. This turns callback heavy asynchronous logic into straight line code.',
              points: [
                { term: 'Awaiting operations', detail: 'When a coroutine awaits an operation that is not ready, it suspends and returns control to its caller, resuming automatically once the awaited result becomes available.' },
                { term: 'Compiler transformation', detail: 'The compiler rewrites the coroutine into a state machine that records where it paused and what locals it holds, so resumption continues exactly where it left off.' },
                { term: 'Task types', detail: 'You need a task like return type that defines how the coroutine is scheduled and how its result is delivered. Libraries provide these building blocks.' },
                { term: 'The awaiter interface', detail: 'Customization points decide whether to suspend, what to do on suspension, and what value to hand back on resume, giving fine control over scheduling.' },
                { term: 'Avoiding thread blocking', detail: 'Done well, awaiting frees the thread to do other work while waiting, which scales far better than blocking a thread per pending operation.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 29. Modules (C++20)
  {
    id: 'cpp-modules',
    title: 'Modules (C++20)',
    level: 1,
    slug: 'modules',
    concepts: [],
    children: [
      {
        id: 'cpp-module-basics',
        title: 'Module Declaration and Export',
        level: 2,
        slug: 'module-basics',
        concepts: [
          {
            id: 'cpp-module-intro',
            code: '// math.cppm (module interface unit)\nexport module math;\n\nexport namespace math {\n    constexpr double PI = 3.14159265358979;\n\n    double square(double x) { return x * x; }\n    double circle_area(double r) { return PI * r * r; }\n}\n\n// Non-exported (module-private)\nnamespace math::detail {\n    double helper() { return 0.0; }\n}\n\n// main.cpp (consumer)\nimport math;\n\nint main() {\n    std::cout << math::circle_area(5.0);\n    // math::detail::helper();  // ERROR: not exported\n}',
            note: 'Modules replace `#include` with `import`. Only `export`ed names are visible to importers. Benefits: faster compilation (no reparsing), no macro leakage, no include order issues, explicit interface boundaries.',
            explanation: {
              heading: 'A modern alternative to headers',
              intro: 'Modules give C++ a real component system that replaces textual header inclusion with a compiled interface. They address long standing problems with build times and macro leakage.',
              points: [
                { term: 'Import instead of include', detail: 'Importing a module makes its exported names available without re parsing source text every time, which is the root cause of much header build overhead.' },
                { term: 'Explicit exports', detail: 'Only names marked for export are visible to importers, so a module can keep implementation details truly private rather than merely conventionally so.' },
                { term: 'No macro leakage', detail: 'Macros defined inside a module do not escape to importers, ending the fragile ordering and name clash issues that plague header based code.' },
                { term: 'Faster builds', detail: 'A module interface is compiled once into a binary form that consumers reuse, which can dramatically cut compilation time in large projects.' },
                { term: 'Adoption realities', detail: 'Tooling and build system support has matured gradually, so many projects mix modules with headers during a transition rather than switching all at once.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cpp-module-partitions',
        title: 'Module Partitions and Migration',
        level: 2,
        slug: 'module-partitions',
        concepts: [
          {
            id: 'cpp-module-parts',
            code: '// math-types.cppm (partition interface)\nexport module math:types;\n\nexport struct Vec3 { float x, y, z; };\nexport struct Mat4 { float data[16]; };\n\n// math-ops.cppm (partition interface)\nexport module math:ops;\nimport :types;\n\nexport Vec3 cross(const Vec3& a, const Vec3& b);\n\n// math.cppm (primary module interface)\nexport module math;\nexport import :types;\nexport import :ops;\n\n// Interop with headers\nmodule;\n#include <legacy_lib.h>  // global module fragment\nexport module modern_wrapper;\nimport <iostream>;  // header unit',
            note: 'Module partitions split large modules into manageable pieces. The primary interface re-exports partitions. The global module fragment allows including legacy headers. Header units (`import <header>`) bridge old and new.',
            explanation: {
              heading: 'Structuring and migrating modules',
              intro: 'Real modules need to scale to large interfaces and coexist with existing header based code. Partitions, the global module fragment, and header units provide the tools for both.',
              points: [
                { term: 'Partitions', detail: 'A partition is a piece of one module, letting you split a large interface across files while keeping a single logical module name for consumers.' },
                { term: 'Re exporting', detail: 'The primary module interface can re export its partitions so importers see one unified module, hiding the internal file structure.' },
                { term: 'Global module fragment', detail: 'A special region at the top of a module file lets you include traditional headers, which is essential for using legacy libraries from within a module.' },
                { term: 'Header units', detail: 'Importing a header as a unit compiles it in a module like way, offering some benefits of modules for code that still ships as headers.' },
                { term: 'Incremental migration', detail: 'These features let a codebase adopt modules gradually, wrapping old headers behind modern module interfaces rather than requiring a big rewrite.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 30. Memory Management
  {
    id: 'cpp-memory',
    title: 'Memory Management',
    level: 1,
    slug: 'memory-management',
    concepts: [],
    children: [
      {
        id: 'cpp-stack-heap',
        title: 'Stack vs Heap Allocation',
        level: 2,
        slug: 'stack-heap',
        concepts: [
          {
            id: 'cpp-memory-intro',
            code: '// Stack: fast, automatic, limited size\nvoid stackExample() {\n    int local = 42;                 // stack\n    std::array<int, 100> arr = {};  // stack\n}  // all freed automatically\n\n// Heap: dynamic, manual (or smart ptr)\nvoid heapExample() {\n    int* p = new int(42);           // heap\n    int* arr = new int[1000];       // heap array\n    delete p;\n    delete[] arr;\n}\n\n// Placement new: construct in pre-allocated memory\nalignas(16) char buffer[sizeof(Widget)];\nWidget* w = new (buffer) Widget(args);\nw->~Widget();  // explicit destructor call',
            note: 'Stack allocation is fast (just moves stack pointer) but limited in size (~1-8MB). Heap is flexible but slower (system call). Placement new constructs objects in existing memory — used in allocators and pools.',
            explanation: {
              heading: 'Stack versus heap memory',
              intro: 'C++ programs use two main memory regions with very different characteristics. Understanding when each is used and their tradeoffs is fundamental to writing correct and efficient code.',
              points: [
                { term: 'Stack allocation', detail: 'Local variables live on the stack, allocated by simply adjusting a pointer, which makes creation and destruction extremely fast and fully automatic.' },
                { term: 'Stack limits', detail: 'The stack is small, often a few megabytes, so large arrays or deep recursion can overflow it, which typically crashes the program.' },
                { term: 'Heap allocation', detail: 'The heap serves dynamic and large allocations whose size or lifetime is not known at compile time, at the cost of slower allocation and manual or smart pointer cleanup.' },
                { term: 'Placement new', detail: 'Placement new constructs an object in memory you already own without allocating, which is how allocators and object pools reuse buffers efficiently.' },
                { term: 'Prefer automatic storage', detail: 'Favor stack objects and containers that manage their own heap memory, reserving raw heap management for the rare cases that truly need it.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cpp-allocators',
        title: 'Custom Allocators and Memory Pools',
        level: 2,
        slug: 'allocators',
        concepts: [
          {
            id: 'cpp-allocator-intro',
            code: '#include <memory_resource>\n\n// Monotonic buffer: fast, no individual deallocation\nchar buffer[1024];\nstd::pmr::monotonic_buffer_resource pool(buffer, sizeof(buffer));\nstd::pmr::vector<int> v(&pool);\nv.push_back(1);  // allocates from buffer[], not heap\n\n// Pool resource: reuses freed blocks\nstd::pmr::unsynchronized_pool_resource upool;\nstd::pmr::map<std::string, int> m(&upool);\n\n// Stack allocator pattern\ntemplate <typename T, size_t N>\nclass StackAllocator {\n    alignas(T) char buf_[N * sizeof(T)];\n    size_t offset_ = 0;\npublic:\n    T* allocate(size_t n) {\n        T* p = reinterpret_cast<T*>(buf_ + offset_);\n        offset_ += n * sizeof(T);\n        return p;\n    }\n};',
            note: '`<memory_resource>` (C++17) provides polymorphic allocators. `monotonic_buffer_resource` is ultra-fast for temporary allocations. Custom allocators reduce heap fragmentation and improve cache locality in hot paths.',
            explanation: {
              heading: 'Custom allocation strategies',
              intro: 'For performance critical code you can control how memory is obtained instead of relying on the general purpose heap. The polymorphic memory resource facilities make this practical and composable.',
              points: [
                { term: 'Polymorphic allocators', detail: 'The memory resource facilities from the seventeenth standard let containers accept a runtime chosen allocation strategy without changing the container type.' },
                { term: 'Monotonic buffer', detail: 'A monotonic resource hands out chunks from a fixed buffer and never frees individual objects, making allocation almost free for short lived batches of work.' },
                { term: 'Pool resources', detail: 'A pool resource groups allocations by size and reuses freed blocks, which reduces fragmentation for many small objects of similar sizes.' },
                { term: 'Cache locality', detail: 'Keeping related objects in a contiguous arena improves cache behavior, which can matter more than raw allocation speed on hot code paths.' },
                { term: 'Measure first', detail: 'Custom allocators add complexity, so profile to confirm allocation is a real bottleneck before replacing the default heap in a hot path.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 31. Concurrency - Threads and Mutex
  {
    id: 'cpp-concurrency',
    title: 'Concurrency: Threads & Mutex',
    level: 1,
    slug: 'concurrency-threads',
    concepts: [],
    children: [
      {
        id: 'cpp-threads',
        title: 'std::thread and std::jthread',
        level: 2,
        slug: 'threads',
        concepts: [
          {
            id: 'cpp-threads-intro',
            code: '#include <thread>\n\nvoid worker(int id) {\n    std::cout << "Thread " << id << " running\\n";\n}\n\n// Basic thread\nstd::thread t1(worker, 1);\nt1.join();  // wait for completion\n\n// jthread (C++20): auto-joins, supports stop_token\nstd::jthread jt([](std::stop_token st) {\n    while (!st.stop_requested()) {\n        // do work\n        std::this_thread::sleep_for(std::chrono::milliseconds(100));\n    }\n});\n// jt automatically requests stop and joins on destruction\n\nstd::cout << "Hardware threads: " << std::thread::hardware_concurrency();',
            note: '`std::thread` must be joined or detached before destruction. `std::jthread` (C++20) auto-joins and supports cooperative cancellation via `stop_token`. Never let a joinable thread go out of scope.',
            explanation: {
              heading: 'Launching and managing threads',
              intro: 'Threads let a program run work concurrently on multiple cores. The standard thread types make launching work easy, but you must manage their lifetime carefully to avoid crashes.',
              points: [
                { term: 'Join or detach', detail: 'Before a thread object is destroyed you must either join it, which waits for completion, or detach it. Destroying a still joinable thread terminates the program.' },
                { term: 'The self joining thread', detail: 'The twentieth standard adds a thread type that automatically joins in its destructor, which prevents the common mistake of forgetting to join.' },
                { term: 'Cooperative cancellation', detail: 'The newer thread type carries a stop token so the worker can periodically check whether a stop was requested and exit its loop cleanly.' },
                { term: 'Passing arguments safely', detail: 'Arguments are copied into the thread by default. To share data pass a reference wrapper deliberately, and ensure the referent outlives the thread.' },
                { term: 'Right sizing parallelism', detail: 'The hardware concurrency hint reports how many threads can truly run at once, guiding how many workers to spawn without oversubscribing the cores.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cpp-mutex-sync',
        title: 'Mutexes and Condition Variables',
        level: 2,
        slug: 'mutex-sync',
        concepts: [
          {
            id: 'cpp-mutex-intro',
            code: '#include <mutex>\n#include <condition_variable>\n\nstd::mutex mtx;\nstd::condition_variable cv;\nstd::queue<int> tasks;\nbool done = false;\n\nvoid producer() {\n    for (int i = 0; i < 10; ++i) {\n        {\n            std::lock_guard lock(mtx);\n            tasks.push(i);\n        }\n        cv.notify_one();\n    }\n    { std::lock_guard lock(mtx); done = true; }\n    cv.notify_all();\n}\n\nvoid consumer() {\n    while (true) {\n        std::unique_lock lock(mtx);\n        cv.wait(lock, [&] { return !tasks.empty() || done; });\n        if (tasks.empty() && done) break;\n        int task = tasks.front(); tasks.pop();\n        lock.unlock();\n        process(task);\n    }\n}',
            note: 'Mutex protects shared data. `condition_variable` enables waiting for state changes without busy-polling. Always use the predicate overload of `wait()` to handle spurious wakeups. `unique_lock` is required for condition variables.',
            explanation: {
              heading: 'Synchronizing shared state',
              intro: 'When threads share data you must coordinate access to avoid data races. A mutex provides mutual exclusion, and a condition variable lets threads wait efficiently for a state change.',
              points: [
                { term: 'Protecting shared data', detail: 'A mutex ensures only one thread accesses the guarded data at a time. Every access to that data, reads included, must hold the lock to be safe.' },
                { term: 'Condition variables', detail: 'A condition variable lets a thread sleep until another signals that a condition may now hold, avoiding wasteful busy waiting on a flag.' },
                { term: 'Handle spurious wakeups', detail: 'A waiting thread can wake without being notified, so always wait with a predicate that rechecks the condition and goes back to sleep if it is not yet true.' },
                { term: 'Why unique lock', detail: 'Waiting on a condition variable requires a lock it can release and reacquire, which is why the flexible unique lock rather than the simple guard is used.' },
                { term: 'Notify appropriately', detail: 'Notify one waiter when a single item becomes available and notify all when a shared state change should wake every waiter, such as a shutdown signal.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 32. Concurrency - Atomics and Async
  {
    id: 'cpp-atomics-async',
    title: 'Concurrency: Atomics & Async',
    level: 1,
    slug: 'concurrency-atomics',
    concepts: [],
    children: [
      {
        id: 'cpp-atomics',
        title: 'std::atomic and Memory Ordering',
        level: 2,
        slug: 'atomics',
        concepts: [
          {
            id: 'cpp-atomic-intro',
            code: '#include <atomic>\n\nstd::atomic<int> counter{0};\nstd::atomic<bool> ready{false};\n\nvoid increment() {\n    counter.fetch_add(1, std::memory_order_relaxed);\n}\n\n// Spin lock with atomic_flag\nclass SpinLock {\n    std::atomic_flag flag_ = ATOMIC_FLAG_INIT;\npublic:\n    void lock() {\n        while (flag_.test_and_set(std::memory_order_acquire)) {\n            flag_.wait(true);  // C++20: efficient wait\n        }\n    }\n    void unlock() {\n        flag_.clear(std::memory_order_release);\n        flag_.notify_one();  // C++20\n    }\n};',
            note: 'Atomics provide lock-free thread-safe operations. Memory orderings: `relaxed` (no ordering), `acquire/release` (synchronize producer-consumer), `seq_cst` (default, strongest). C++20 adds `wait()`/`notify()` for efficient polling.',
            explanation: {
              heading: 'Lock free operations with atomics',
              intro: 'Atomic variables let multiple threads read and modify a value without a mutex, and memory orderings specify how their effects become visible to other threads. This is powerful but subtle.',
              points: [
                { term: 'Atomic operations', detail: 'Operations on an atomic complete indivisibly, so no other thread can observe a half updated value, which prevents the data races that plain variables suffer.' },
                { term: 'Memory ordering', detail: 'The ordering argument controls how surrounding reads and writes are allowed to be reordered. Relaxed gives only atomicity while sequentially consistent gives the strongest guarantees.' },
                { term: 'Acquire and release', detail: 'A release store paired with an acquire load establishes a happens before relationship, which is how a producer safely publishes data to a consumer.' },
                { term: 'Default to strongest', detail: 'Sequentially consistent ordering is the safe default. Only weaken it after careful reasoning, because subtle reordering bugs are extremely hard to reproduce.' },
                { term: 'Efficient waiting', detail: 'The twentieth standard adds wait and notify on atomics so a thread can block until a value changes rather than spinning and wasting a core.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cpp-async-future',
        title: 'std::async, future, and promise',
        level: 2,
        slug: 'async-future',
        concepts: [
          {
            id: 'cpp-async-intro',
            code: '#include <future>\n\n// Async: run function asynchronously\nauto future = std::async(std::launch::async, []() {\n    std::this_thread::sleep_for(std::chrono::seconds(1));\n    return 42;\n});\nint result = future.get();  // blocks until ready\n\n// Promise/future pair for manual control\nstd::promise<std::string> prom;\nstd::future<std::string> fut = prom.get_future();\n\nstd::thread t([&prom]() {\n    try {\n        prom.set_value(compute_result());\n    } catch (...) {\n        prom.set_exception(std::current_exception());\n    }\n});\n\nstd::string val = fut.get();  // receives value or rethrows exception\nt.join();',
            note: '`std::async` is the simplest way to run work asynchronously. `future::get()` blocks once and retrieves the result (or rethrows exceptions). `promise` gives explicit control over when a value is produced.',
            explanation: {
              heading: 'Futures and asynchronous results',
              intro: 'The future and promise facilities model a value that will be produced later. They let one thread hand a result, or an exception, to another without manual synchronization.',
              points: [
                { term: 'Running work with async', detail: 'The async helper launches a function, possibly on another thread, and returns a future that will eventually hold its result, which is the simplest way to parallelize a task.' },
                { term: 'Getting the result', detail: 'Calling get on a future blocks until the value is ready, returns it once, and rethrows any exception the task threw, unifying success and failure handling.' },
                { term: 'Promise and future pair', detail: 'A promise is the writing end and its future is the reading end. One thread sets the value or exception on the promise and another receives it through the future.' },
                { term: 'Exceptions cross threads', detail: 'Storing an exception on a promise lets it surface in the thread that calls get, so error handling works across the thread boundary naturally.' },
                { term: 'Launch policy', detail: 'Choosing the async launch policy forces a separate thread, while the deferred policy runs the work lazily when get is first called, so pick deliberately.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 33. Structured Bindings and std::optional
  {
    id: 'cpp-modern-utilities',
    title: 'Modern Utilities',
    level: 1,
    slug: 'modern-utilities',
    concepts: [],
    children: [
      {
        id: 'cpp-structured-bindings',
        title: 'Structured Bindings and std::tuple',
        level: 2,
        slug: 'structured-bindings',
        concepts: [
          {
            id: 'cpp-struct-bindings',
            code: '#include <tuple>\n#include <map>\n\n// Structured bindings (C++17)\nauto [x, y, z] = std::tuple{1, 2.0, "three"};\n\n// With maps\nstd::map<std::string, int> scores = {{"Alice", 95}, {"Bob", 87}};\nfor (const auto& [name, score] : scores) {\n    std::cout << name << ": " << score << "\\n";\n}\n\n// With custom structs\nstruct Result { bool success; std::string message; };\nauto [ok, msg] = Result{true, "done"};\n\n// Multiple return values\nauto minmax(std::span<const int> v) {\n    return std::pair{*std::min_element(v.begin(), v.end()),\n                     *std::max_element(v.begin(), v.end())};\n}',
            note: 'Structured bindings (C++17) decompose structs, tuples, and arrays into named variables. Works with any type that has public members or supports `std::get`. Cleaner than `std::tie` or `.first`/`.second`.',
            explanation: {
              heading: 'Unpacking aggregates cleanly',
              intro: 'Structured bindings let you split a struct, tuple, pair, or array into individually named variables in one declaration. This makes code that returns or iterates over grouped values far more readable.',
              points: [
                { term: 'How it works', detail: 'A single declaration introduces a name for each element of the aggregate, so a pair becomes two clearly named variables instead of anonymous first and second members.' },
                { term: 'Works broadly', detail: 'It supports tuples and pairs, arrays, and any struct with accessible members, which covers most grouped return values you encounter.' },
                { term: 'Iterating maps', detail: 'Binding a key and value in a range based loop over a map reads naturally and avoids the clumsy first and second member access on each entry.' },
                { term: 'Reference bindings', detail: 'You can bind by reference to modify the elements in place, or by const reference to inspect them without copying the underlying aggregate.' },
                { term: 'Multiple return values', detail: 'Returning a tuple or struct and unpacking it at the call site is a clean idiom for functions that naturally produce more than one result.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cpp-optional-variant',
        title: 'std::optional, variant, and any',
        level: 2,
        slug: 'optional-variant',
        concepts: [
          {
            id: 'cpp-optional-intro',
            code: '#include <optional>\n#include <variant>\n\n// optional: nullable value without pointers\nstd::optional<int> find_index(const std::vector<int>& v, int target) {\n    for (size_t i = 0; i < v.size(); ++i)\n        if (v[i] == target) return static_cast<int>(i);\n    return std::nullopt;\n}\n\nauto idx = find_index({1,2,3}, 2);\nint val = idx.value_or(-1);  // 1\n\n// variant: type-safe union\nusing JsonValue = std::variant<int, double, std::string, bool, std::nullptr_t>;\n\nJsonValue jv = "hello";\nstd::visit([](auto&& arg) {\n    std::cout << arg;\n}, jv);',
            note: '`optional` represents a value that may not exist — replaces sentinel values and output params. `variant` holds one of several types — type-safe alternative to unions. `std::visit` dispatches on the active type.',
            explanation: {
              heading: 'Optional, variant, and any',
              intro: 'These vocabulary types model common situations precisely: a value that might be absent, a value that is one of several types, and a value of any type. They replace error prone idioms with safe alternatives.',
              points: [
                { term: 'Optional for maybe values', detail: 'An optional either holds a value or is empty, which cleanly expresses a function that may fail to produce a result without resorting to magic sentinel values.' },
                { term: 'Safe access', detail: 'Read an optional only after checking it holds a value, or use value or to supply a fallback. Dereferencing an empty optional is undefined behavior.' },
                { term: 'Variant as a safe union', detail: 'A variant holds exactly one value from a fixed set of types and tracks which is active, unlike a raw union which leaves type tracking to you.' },
                { term: 'Visiting a variant', detail: 'The visit function calls the right handler for whichever type is currently stored, giving exhaustive, type safe dispatch over the alternatives.' },
                { term: 'Any for unknown types', detail: 'The any type stores a value of any type and requires a checked cast to retrieve it, useful for heterogeneous storage though it sacrifices compile time typing.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 34. Type Traits and SFINAE
  {
    id: 'cpp-type-traits',
    title: 'Type Traits & Metaprogramming',
    level: 1,
    slug: 'type-traits',
    concepts: [],
    children: [
      {
        id: 'cpp-type-traits-basics',
        title: 'Type Traits and static_assert',
        level: 2,
        slug: 'type-traits-basics',
        concepts: [
          {
            id: 'cpp-traits-intro',
            code: '#include <type_traits>\n\ntemplate <typename T>\nclass Container {\n    static_assert(std::is_default_constructible_v<T>,\n        "T must be default constructible");\n    static_assert(!std::is_pointer_v<T>,\n        "Use smart pointers instead of raw pointers");\n\npublic:\n    using value_type = std::remove_cv_t<T>;\n    using reference = std::add_lvalue_reference_t<T>;\n\n    // Conditionally enable methods\n    void serialize() requires std::is_trivially_copyable_v<T> {\n        // binary serialization only for trivial types\n    }\n};',
            note: 'Type traits from `<type_traits>` query and transform types at compile time. `static_assert` enforces constraints with clear messages. `_v` and `_t` suffixes are shorthand for `::value` and `::type`.',
            explanation: {
              heading: 'Inspecting types at compile time',
              intro: 'Type traits are small templates that answer questions about types or transform them during compilation. Combined with static assertions they let you enforce requirements and adapt generic code.',
              points: [
                { term: 'Querying properties', detail: 'A trait like is integral reports at compile time whether a type has some property, producing a boolean constant you can branch on in templates.' },
                { term: 'Transforming types', detail: 'Other traits produce a new type, for example removing a reference or const qualifier, which is handy for computing the right member or return types.' },
                { term: 'Static assertions', detail: 'A static assert checks a compile time condition and fails the build with your message if it is false, catching misuse early with a clear explanation.' },
                { term: 'Convenience suffixes', detail: 'The v suffix gives the boolean value of a trait directly and the t suffix gives the resulting type, saving the verbose value and type member accesses.' },
                { term: 'Foundation for generics', detail: 'Traits underpin much of the standard library, enabling code to select optimal implementations based on whether a type is trivially copyable or has other properties.' },
              ],
            },
            example: 'static_assert(std::is_integral_v<int>);      // passes\nstatic_assert(std::is_same_v<int, int32_t>);  // platform-dependent',
          },
        ],
        children: [],
      },
      {
        id: 'cpp-sfinae',
        title: 'SFINAE and enable_if',
        level: 2,
        slug: 'sfinae',
        concepts: [
          {
            id: 'cpp-sfinae-intro',
            code: '// SFINAE: Substitution Failure Is Not An Error\n// Pre-C++20 way to constrain templates\n\ntemplate <typename T,\n    std::enable_if_t<std::is_integral_v<T>, int> = 0>\nvoid process(T val) {\n    std::cout << "integer: " << val << "\\n";\n}\n\ntemplate <typename T,\n    std::enable_if_t<std::is_floating_point_v<T>, int> = 0>\nvoid process(T val) {\n    std::cout << "float: " << val << "\\n";\n}\n\n// Modern alternative: concepts (C++20)\ntemplate <std::integral T>\nvoid modern_process(T val) { /* ... */ }',
            note: 'SFINAE removes template overloads from consideration when substitution fails. `enable_if` is the classic tool. In C++20, prefer concepts for the same purpose with much cleaner syntax and better error messages.',
            explanation: {
              heading: 'Constraining templates before concepts',
              intro: 'Substitution failure is not an error, often abbreviated as a four letter acronym, is the classic technique for enabling or disabling template overloads based on type properties. Concepts now do this more clearly.',
              points: [
                { term: 'The core rule', detail: 'When substituting template arguments produces an invalid type in the immediate context, the compiler quietly removes that overload rather than reporting an error.' },
                { term: 'The enable if tool', detail: 'The enable if helper exposes a type only when a condition holds, so placing it in a signature switches an overload on or off based on trait results.' },
                { term: 'Why it was hard', detail: 'The technique is verbose and its error messages are notoriously cryptic, since a failed constraint often shows as a confusing no matching function rather than a clear reason.' },
                { term: 'Prefer concepts now', detail: 'From the twentieth standard, concepts express the same constraints far more readably and produce error messages that name the unmet requirement directly.' },
                { term: 'Still worth recognizing', detail: 'Plenty of existing libraries use this older approach, so understanding it helps you read and maintain code written before concepts were available.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 35. File I/O and Filesystem
  {
    id: 'cpp-file-io',
    title: 'File I/O & Filesystem',
    level: 1,
    slug: 'file-io',
    concepts: [],
    children: [
      {
        id: 'cpp-streams-io',
        title: 'File Streams (fstream)',
        level: 2,
        slug: 'fstream',
        concepts: [
          {
            id: 'cpp-fstream-intro',
            code: '#include <fstream>\n#include <sstream>\n\n// Write to file\nstd::ofstream out("data.txt");\nout << "Line 1\\n" << "Line 2\\n";\nout.close();\n\n// Read line by line\nstd::ifstream in("data.txt");\nstd::string line;\nwhile (std::getline(in, line)) {\n    std::cout << line << "\\n";\n}\n\n// Read entire file into string\nstd::ifstream file("data.txt");\nstd::string content(\n    (std::istreambuf_iterator<char>(file)),\n    std::istreambuf_iterator<char>());',
            note: '`ofstream` writes, `ifstream` reads, `fstream` does both. Streams auto-close on destruction (RAII). `std::getline` reads line by line. Check `is_open()` and stream state for error handling.',
            explanation: {
              heading: 'Reading and writing files',
              intro: 'File streams extend the familiar console stream interface to files, so the same insertion and extraction operators work on disk. They manage the underlying file handle automatically.',
              points: [
                { term: 'Choosing the stream', detail: 'An output file stream writes, an input file stream reads, and a combined file stream does both. Pick the narrowest one that matches your intent.' },
                { term: 'Automatic closing', detail: 'A file stream closes its file when it goes out of scope, following the resource idiom, so you rarely need to close it manually.' },
                { term: 'Reading line by line', detail: 'The getline function reads up to a newline into a string, which is the standard way to process a text file one line at a time.' },
                { term: 'Check for errors', detail: 'Opening can fail, so verify the stream is open and test its state after operations, since a failed read leaves the target unchanged and sets an error flag.' },
                { term: 'Text versus binary', detail: 'Open a stream in binary mode when reading or writing raw bytes, because text mode may translate newlines and misrepresent non text data.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'cpp-filesystem',
        title: 'std::filesystem (C++17)',
        level: 2,
        slug: 'filesystem',
        concepts: [
          {
            id: 'cpp-fs-intro',
            code: '#include <filesystem>\nnamespace fs = std::filesystem;\n\nfs::path p = "/home/user/project/src/main.cpp";\nstd::cout << p.filename();   // "main.cpp"\nstd::cout << p.extension();  // ".cpp"\nstd::cout << p.parent_path(); // "/home/user/project/src"\n\n// Directory operations\nfs::create_directories("output/logs");\nfor (auto& entry : fs::recursive_directory_iterator("src")) {\n    if (entry.path().extension() == ".cpp")\n        std::cout << entry.path() << " (" << entry.file_size() << " bytes)\\n";\n}\n\n// File operations\nfs::copy("src.txt", "backup.txt", fs::copy_options::overwrite_existing);\nbool exists = fs::exists("data.txt");\nauto size = fs::file_size("data.txt");',
            note: '`std::filesystem` (C++17) provides cross-platform path manipulation and directory traversal. `path` handles OS-specific separators. All operations throw `filesystem_error` or accept `error_code` overloads.',
            explanation: {
              heading: 'Portable filesystem operations',
              intro: 'The filesystem library gives a cross platform way to manipulate paths, query files, and traverse directories. It hides operating system differences behind a uniform interface.',
              points: [
                { term: 'The path type', detail: 'A path object represents a filesystem location and offers methods to extract the filename, extension, and parent, handling separator differences across systems.' },
                { term: 'Querying and modifying', detail: 'Free functions check existence, report file size, create directories, and copy or remove files, covering the common needs of file management code.' },
                { term: 'Directory traversal', detail: 'Directory iterators visit the entries of a folder, and a recursive variant descends into subfolders, which makes scanning a tree straightforward.' },
                { term: 'Two error styles', detail: 'Each operation comes in a throwing form and a form that reports failures through an error code argument, so you can choose exceptions or return codes.' },
                { term: 'Watch race conditions', detail: 'Checking that a file exists and then using it are separate steps, so another process can change things in between. Handle the failure of the actual operation rather than trusting a prior check.' },
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
