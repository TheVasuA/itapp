// C topic tree.
//
// Each node is a ConceptNode: { id, title, level, slug, concepts[], children[] }.
// Routable nodes carry a `slug`. Every Concept renders in the fixed order
// code -> note -> example (example optional).

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  // 1. Getting Started
  {
    id: 'c-getting-started',
    title: 'Getting Started',
    level: 1,
    slug: 'getting-started',
    concepts: [],
    children: [
      {
        id: 'c-hello-world',
        title: 'Your First Program',
        level: 2,
        slug: 'hello-world',
        concepts: [
          {
            id: 'c-hello-main',
            code: "#include <stdio.h>\n\nint main(void) {\n  printf(\"Hello, world!\\n\");\n  return 0;\n}",
            note: "Every C program starts executing at `main`. Writing `int main(void)` says main takes no arguments and returns an int status code. Returning 0 tells the operating system the program finished successfully.",
            explanation: {
              heading: 'The entry point',
              intro: 'Execution of a hosted C program begins in the main function, which acts as the single well-defined starting point the runtime hands control to after startup. Its integer return value becomes the process exit status reported back to the operating system or shell.',
              points: [
                { term: 'Standard signatures', detail: 'The C standard sanctions int main(void) and int main(int argc, char *argv[]); other forms are implementation defined.' },
                { term: 'Return means exit', detail: 'Returning from main is equivalent to calling exit with that value, and returning 0 signals success.' },
                { term: 'Convenience macros', detail: 'EXIT_SUCCESS and EXIT_FAILURE from stdlib.h are portable alternatives to hard-coded status numbers.' },
                { term: 'Implicit return', detail: 'In C99 and later, reaching the end of main without a return implicitly returns 0, but being explicit is clearer.' },
              ],
            },
            example: "// A non-zero return signals an error to the shell:\nreturn 1;",
          },
          {
            id: 'c-hello-printf',
            code: "#include <stdio.h>\n\nint main(void) {\n  int n = 42;\n  printf(\"The answer is %d\\n\", n);\n  return 0;\n}",
            note: "`printf` from <stdio.h> prints formatted text. Format specifiers like `%d` (int), `%f` (double), `%c` (char), and `%s` (string) are replaced by the matching arguments. The `\\n` writes a newline. Passing an argument whose type does not match its specifier is undefined behavior.",
            explanation: {
              heading: 'Formatted output with printf',
              intro: 'printf walks its format string and, each time it meets a conversion specifier introduced by a percent sign, consumes the next argument and renders it as text. Because printf is variadic, the compiler cannot verify that your arguments match the specifiers, so correctness is your responsibility.',
              points: [
                { term: 'Specifier must match type', detail: 'Use percent d for int, percent u for unsigned, percent f for double, percent c for char, and percent s for a string.' },
                { term: 'Undefined on mismatch', detail: 'A specifier that disagrees with the actual argument type is undefined behavior, not merely a wrong value.' },
                { term: 'Default promotions', detail: 'Variadic arguments are promoted, so float becomes double and small integers become int before printf sees them.' },
                { term: 'Buffered output', detail: 'stdout is typically line buffered when attached to a terminal, so a trailing backslash n helps flush a line promptly.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'c-compilation',
        title: 'Compiling & Running',
        level: 2,
        slug: 'compilation',
        concepts: [
          {
            id: 'c-compile-gcc',
            code: "gcc -std=c11 -Wall -Wextra hello.c -o hello\n./hello",
            note: "C is a compiled language: a compiler such as gcc or clang turns source into a native executable. `-std=c11` picks the language standard, and `-Wall -Wextra` enable helpful warnings that catch bugs early. The `-o` flag names the output file.",
            explanation: {
              heading: 'Invoking the compiler',
              intro: 'A C compiler like gcc or clang reads your source text and emits a native executable that the operating system can run directly. Command-line flags control which language rules apply, how much the compiler warns you, and what the output file is called.',
              points: [
                { term: 'Pick a standard', detail: 'The -std flag such as -std=c11 selects which version of the C language the compiler enforces.' },
                { term: 'Turn on warnings', detail: 'Combining -Wall and -Wextra surfaces suspicious code early, and many teams add -Werror to treat warnings as build failures.' },
                { term: 'Name the output', detail: 'Without -o the default executable is named a.out, so -o hello gives it a clear name.' },
                { term: 'Add debug info', detail: 'The -g flag embeds symbols so a debugger like gdb can map machine code back to your source lines.' },
              ],
            },
            example: "// Add debug symbols for a debugger like gdb:\ngcc -g -std=c11 hello.c -o hello",
          },
          {
            id: 'c-compile-stages',
            code: "// Preprocess -> Compile -> Assemble -> Link\ngcc -E hello.c    // preprocessor output\ngcc -c hello.c    // produces hello.o (object file)\ngcc hello.o -o hello  // links into an executable",
            note: "Building a program happens in stages. The preprocessor expands `#include` and macros, the compiler produces object code, and the linker combines object files with libraries into a final executable. Understanding the stages helps you read error messages, since a linker error is very different from a compile error.",
            explanation: {
              heading: 'From source to executable',
              intro: 'Turning C source into a runnable program is a pipeline of distinct stages, each transforming the output of the previous one. Knowing which stage fails tells you what kind of mistake you are looking at.',
              points: [
                { term: 'Preprocess', detail: 'The preprocessor expands include directives and macros, producing a single expanded translation unit; gcc -E shows this text.' },
                { term: 'Compile and assemble', detail: 'The compiler translates the expanded source into machine code, and gcc -c stops at an object file rather than a full program.' },
                { term: 'Link', detail: 'The linker stitches object files and libraries together and resolves every symbol into one final executable.' },
                { term: 'Read errors by stage', detail: 'A missing semicolon is a compile error, while an undefined reference to a function is a link error, and the fixes differ.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 2. Types & Variables
  {
    id: 'c-types-variables',
    title: 'Types & Variables',
    level: 1,
    slug: 'types-variables',
    concepts: [],
    children: [
      {
        id: 'c-data-types',
        title: 'Data Types & Sizes',
        level: 2,
        slug: 'data-types',
        concepts: [
          {
            id: 'c-fundamental-types',
            code: "char   c = 'A';    // usually 1 byte\nint    i = 100;    // typically 4 bytes\nlong   l = 100000; // at least 4 bytes\nfloat  f = 3.14f;  // single precision\ndouble d = 3.14;   // double precision",
            note: "C's fundamental types are integers (`char`, `short`, `int`, `long`, `long long`) and floating point (`float`, `double`). The standard only guarantees minimum sizes, not exact ones, so a plain `int` is often 4 bytes but is not required to be. Integer types can be `signed` or `unsigned`.",
            explanation: {
              heading: 'Built-in numeric types',
              intro: 'C provides a family of integer and floating-point types that map closely onto what the hardware supports. The language pins down only minimum ranges, leaving exact sizes up to each implementation, which is why portable code avoids assuming a specific width.',
              points: [
                { term: 'Sizes are minimums', detail: 'The standard guarantees int holds at least 16 bits and long at least 32, but common desktops give int 32 bits.' },
                { term: 'Signed versus unsigned', detail: 'An unsigned integer never holds a negative value and wraps around modulo its range, while signed overflow is undefined behavior.' },
                { term: 'Plain char is ambiguous', detail: 'Whether a bare char is signed or unsigned is implementation defined, so use signed char or unsigned char when the sign matters.' },
                { term: 'Floating point is approximate', detail: 'float and double store binary approximations, so values like 0.1 cannot be represented exactly.' },
              ],
            },
          },
          {
            id: 'c-sizeof',
            code: "#include <stdio.h>\n\nint main(void) {\n  printf(\"int is %zu bytes\\n\", sizeof(int));\n  printf(\"double is %zu bytes\\n\", sizeof(double));\n  return 0;\n}",
            note: "`sizeof` reports the size in bytes of a type or expression, and its result has type `size_t`, which you print with `%zu`. Because sizes are implementation-defined, use `sizeof` instead of hard-coding numbers. For portable fixed-width integers, include <stdint.h> and use types like `int32_t` or `uint8_t`.",
            explanation: {
              heading: 'Measuring types with sizeof',
              intro: 'The sizeof operator yields how many bytes a type or object occupies, evaluated by the compiler rather than at run time. Using it instead of literal numbers keeps code correct even when it moves to a platform with different type sizes.',
              points: [
                { term: 'Result is size_t', detail: 'sizeof produces an unsigned size_t, which you print with the percent z u specifier to stay portable.' },
                { term: 'Compile-time value', detail: 'For most operands sizeof is computed during compilation, so it costs nothing at run time and its operand is not evaluated.' },
                { term: 'Prefer it over constants', detail: 'Writing sizeof(int) rather than the number four keeps allocations and loops correct across platforms.' },
                { term: 'Fixed-width when needed', detail: 'When you need an exact width, include stdint.h and use types like int32_t or uint8_t.' },
              ],
            },
            example: "#include <stdint.h>\nuint32_t exactly_four = 0; // always 32 bits",
          },
        ],
        children: [],
      },
      {
        id: 'c-variables-constants',
        title: 'Variables & Constants',
        level: 2,
        slug: 'variables-constants',
        concepts: [
          {
            id: 'c-declaring-variables',
            code: "int count;        // declared, but uninitialized (garbage value)\nint total = 0;    // declared and initialized\ncount = 5;        // assignment",
            note: "A declaration introduces a variable; an initializer gives it a starting value. Reading a local variable before initializing it is undefined behavior, since it holds an indeterminate value. Get in the habit of initializing variables as you declare them.",
            explanation: {
              heading: 'Declaring and initializing',
              intro: 'A declaration reserves storage and names it, while an initializer sets the first value that storage holds. In C the two steps are separate, and skipping initialization leaves an ordinary local variable holding whatever garbage was already in memory.',
              points: [
                { term: 'Uninitialized locals', detail: 'A local variable without an initializer holds an indeterminate value, and reading it before assigning is undefined behavior.' },
                { term: 'Statics start at zero', detail: 'Variables with static or global storage are automatically zero-initialized, unlike locals on the stack.' },
                { term: 'Initialize at declaration', detail: 'Giving a value on the same line as the declaration prevents accidental use of garbage and reads more clearly.' },
                { term: 'Assignment versus init', detail: 'The equals sign in a declaration is initialization, while a later equals sign is assignment that overwrites the current value.' },
              ],
            },
          },
          {
            id: 'c-const-keyword',
            code: "const double PI = 3.14159;\n// PI = 3.0; // error: assignment of read-only variable\n\nenum { MAX_USERS = 100 };",
            note: "`const` marks a variable read-only after initialization, letting the compiler catch accidental writes. For compile-time integer constants, an unnamed `enum` or a `#define` is also common. `const` is preferred over `#define` for typed values because it respects scope and types.",
            explanation: {
              heading: 'Constants and read-only data',
              intro: 'Marking a value as constant tells the compiler it must not change after initialization, so any accidental write becomes a compile error. C offers several ways to express a constant, and each interacts differently with types, scope, and the preprocessor.',
              points: [
                { term: 'const is typed', detail: 'A const variable has a real type and obeys normal scope rules, so the compiler can type-check its use.' },
                { term: 'define is textual', detail: 'A define macro is a preprocessor text substitution with no type and no scope, which can cause surprises in expressions.' },
                { term: 'enum for integer constants', detail: 'An unnamed enum creates named integer constants that are usable in case labels and array sizes.' },
                { term: 'Prefer const for values', detail: 'For typed constants, const is safer than define because it respects scope and produces clearer diagnostics.' },
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
    id: 'c-operators',
    title: 'Operators',
    level: 1,
    slug: 'operators',
    concepts: [],
    children: [
      {
        id: 'c-arithmetic-operators',
        title: 'Arithmetic & Assignment',
        level: 2,
        slug: 'arithmetic',
        concepts: [
          {
            id: 'c-integer-division',
            code: "int a = 7, b = 2;\nint q = a / b;   // 3 (integer division truncates)\nint r = a % b;   // 1 (remainder)\ndouble d = 7.0 / 2.0; // 3.5",
            note: "When both operands are integers, `/` performs integer division and discards the fractional part, while `%` gives the remainder. To get a fractional result, make at least one operand a floating-point value. Dividing by zero is undefined behavior, so guard against a zero divisor.",
            explanation: {
              heading: 'Integer division and remainder',
              intro: 'Arithmetic in C depends on the operand types, and division between two integers throws away any fractional part rather than rounding. The remainder operator returns what is left over, and together they let you split a value into a quotient and a remainder.',
              points: [
                { term: 'Truncation toward zero', detail: 'Integer division discards the fraction and truncates toward zero, so seven divided by two is three, not three and a half.' },
                { term: 'Promote for fractions', detail: 'Make at least one operand a double, for example by writing 7.0, to get a floating-point result.' },
                { term: 'Modulo is integer only', detail: 'The percent operator works on integers and gives the remainder, and its sign follows the dividend in modern C.' },
                { term: 'Guard against zero', detail: 'Dividing or taking a remainder by zero is undefined behavior, so check the divisor before the operation.' },
              ],
            },
          },
          {
            id: 'c-compound-assignment',
            code: "int x = 10;\nx += 5;  // x = x + 5  -> 15\nx *= 2;  // x = x * 2  -> 30\nx++;     // post-increment -> 31",
            note: "Compound assignment operators like `+=`, `-=`, `*=`, and `/=` update a variable in place and are more concise than writing the variable twice. `++` and `--` increment and decrement by one. Avoid modifying the same variable more than once in a single expression, as that can be undefined behavior.",
            explanation: {
              heading: 'Compound assignment and increment',
              intro: 'Compound assignment operators fold an operation and an assignment into one token, updating a variable using its own current value. The increment and decrement operators are a specialized shorthand for adding or subtracting one.',
              points: [
                { term: 'Read-modify-write', detail: 'x plus-equals five means x becomes x plus five, naming the variable once and reducing typos.' },
                { term: 'Pre versus post', detail: 'Pre-increment changes the value before the expression uses it, while post-increment yields the old value first.' },
                { term: 'Avoid double modification', detail: 'Modifying the same object twice with no sequence point between, such as i equals i plus plus, is undefined behavior.' },
                { term: 'Works on pointers too', detail: 'Increment and compound assignment also apply to pointers, advancing them by whole elements rather than bytes.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'c-logical-relational',
        title: 'Logical & Relational',
        level: 2,
        slug: 'logical-relational',
        concepts: [
          {
            id: 'c-comparison-operators',
            code: "int age = 20;\nif (age >= 18 && age < 65) {\n  printf(\"working age\\n\");\n}\nint eq = (3 == 3); // 1 (true)",
            note: "Relational operators (`<`, `>`, `<=`, `>=`, `==`, `!=`) produce 1 for true and 0 for false. Logical operators `&&`, `||`, and `!` combine conditions. A common bug is writing `=` (assignment) where you meant `==` (comparison).",
            explanation: {
              heading: 'Comparisons and boolean logic',
              intro: 'Relational and equality operators compare two values and produce an integer that is one when the relation holds and zero otherwise. Logical operators then combine these results into larger conditions used by if statements and loops.',
              points: [
                { term: 'Results are int', detail: 'A comparison yields the int value one for true or zero for false, since C had no built-in boolean type before stdbool.h.' },
                { term: 'Truthiness rule', detail: 'In a condition any non-zero value counts as true and only zero counts as false.' },
                { term: 'Equality has two equals', detail: 'Use double equals to compare; a single equals is assignment and is a classic bug in an if condition.' },
                { term: 'Logical not relational', detail: 'The operators and-and and or-or work on whole truth values, not on individual bits like the single-character bitwise versions.' },
              ],
            },
          },
          {
            id: 'c-short-circuit',
            code: "int *p = NULL;\nif (p != NULL && *p == 5) {\n  // safe: *p is only read when p is not NULL\n}",
            note: "`&&` and `||` short-circuit: `&&` stops at the first false operand and `||` stops at the first true one. This lets you guard a risky operation with a preceding check, as when confirming a pointer is non-NULL before dereferencing it. Ordering the checks correctly is what makes the code safe.",
            explanation: {
              heading: 'Short-circuit evaluation',
              intro: 'The logical and-and and or-or operators evaluate their left operand first and only touch the right one if the outcome is still in doubt. This ordering guarantee lets you place a safety check before an operation that would otherwise be dangerous.',
              points: [
                { term: 'and-and stops early', detail: 'If the left side is false the whole expression is false, so the right side is never evaluated.' },
                { term: 'or-or stops early', detail: 'If the left side is true the whole expression is true, so the right side is skipped.' },
                { term: 'Guard then act', detail: 'Checking p is not NULL before dereferencing p works only because the null check runs first.' },
                { term: 'Beware skipped effects', detail: 'Any side effect on the right operand, such as a function call, may not happen when the left side short-circuits.' },
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
    id: 'c-control-flow',
    title: 'Control Flow',
    level: 1,
    slug: 'control-flow',
    concepts: [],
    children: [
      {
        id: 'c-conditionals',
        title: 'Conditionals',
        level: 2,
        slug: 'conditionals',
        concepts: [
          {
            id: 'c-if-else',
            code: "int score = 82;\nif (score >= 90) {\n  printf(\"A\\n\");\n} else if (score >= 80) {\n  printf(\"B\\n\");\n} else {\n  printf(\"C or below\\n\");\n}",
            note: "`if`/`else if`/`else` chains pick one branch based on conditions evaluated top to bottom. Always use braces `{}` even for single statements, since it prevents subtle bugs when you later add a line. In C any non-zero value is treated as true and zero as false.",
            explanation: {
              heading: 'Branching with if and else',
              intro: 'An if statement runs a block only when its condition is true, and chaining else if and else lets you select exactly one path from several. The conditions are tested from top to bottom, and the first that succeeds wins.',
              points: [
                { term: 'Zero is false', detail: 'The condition is treated as false only when it evaluates to zero, and any other value counts as true.' },
                { term: 'Always brace', detail: 'Wrapping each branch in braces avoids the dangling-statement bug where a newly added line silently falls outside the if.' },
                { term: 'First match wins', detail: 'In an else-if chain, once a condition matches the rest are skipped, so order conditions from most to least specific.' },
                { term: 'Dangling else', detail: 'An else binds to the nearest unmatched if, which braces make explicit and unambiguous.' },
              ],
            },
          },
          {
            id: 'c-switch',
            code: "switch (choice) {\n  case 1:\n    printf(\"one\\n\");\n    break;\n  case 2:\n    printf(\"two\\n\");\n    break;\n  default:\n    printf(\"other\\n\");\n}",
            note: "`switch` compares an integer or character expression against `case` labels. Each case usually ends with `break`; without it, execution falls through into the next case, which is occasionally useful but often a bug. The `default` case handles any value that no label matched.",
            explanation: {
              heading: 'Multi-way selection with switch',
              intro: 'A switch statement jumps to the case label whose constant matches an integer expression, which can be clearer and faster than a long if chain. Execution then continues from that label until a break is reached.',
              points: [
                { term: 'Integer labels only', detail: 'The controlling expression and every case label must be integer constants, so floating point and strings are not allowed.' },
                { term: 'Fall-through by default', detail: 'Without a break, control flows into the following case, which is deliberate for shared handling but a common accidental bug.' },
                { term: 'default catches the rest', detail: 'The default label handles any value no case matched and may appear anywhere, though placing it last is conventional.' },
                { term: 'Declarations need braces', detail: 'Declaring a variable inside a case usually requires wrapping that case body in its own braces to give it a clear scope.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'c-loops',
        title: 'Loops',
        level: 2,
        slug: 'loops',
        concepts: [
          {
            id: 'c-for-loop',
            code: "for (int i = 0; i < 5; i++) {\n  printf(\"%d \", i); // 0 1 2 3 4\n}",
            note: "A `for` loop has three parts: initialization, a condition tested before each iteration, and an update run after each iteration. Declaring the counter inside the `for` (a C99 feature) keeps it scoped to the loop. When the condition becomes false the loop ends.",
            explanation: {
              heading: 'Counting with a for loop',
              intro: 'A for loop packages the three parts of a counted loop, the setup, the test, and the step, into one compact header. This keeps everything that controls the loop in a single readable place.',
              points: [
                { term: 'Three clauses', detail: 'The header holds initialization run once, a condition tested before each pass, and an update run after each pass.' },
                { term: 'Condition first', detail: 'Because the test happens before the body, a for loop can execute zero times if the condition starts false.' },
                { term: 'Loop-scoped counter', detail: 'Declaring the counter inside the for, allowed since C99, limits its scope to the loop and avoids leaking it.' },
                { term: 'All parts optional', detail: 'Any of the three clauses may be omitted, and an empty condition means an intentional infinite loop.' },
              ],
            },
          },
          {
            id: 'c-while-do',
            code: "int n = 3;\nwhile (n > 0) {\n  printf(\"%d\\n\", n);\n  n--;\n}\n\ndo {\n  printf(\"runs at least once\\n\");\n} while (0);",
            note: "`while` checks its condition before each pass, so the body may run zero times. `do`/`while` checks after the body, guaranteeing at least one execution. Use `break` to exit a loop early and `continue` to skip to the next iteration.",
            explanation: {
              heading: 'while and do-while loops',
              intro: 'A while loop repeats its body as long as a condition stays true, testing before each pass, while a do-while loop tests after the body so it always runs at least once. Choosing between them depends on whether the body must execute before the first check.',
              points: [
                { term: 'Pre-test while', detail: 'Because while checks the condition first, the body may run zero times when the condition begins false.' },
                { term: 'Post-test do-while', detail: 'A do-while runs the body once before checking, which suits menus and input that must be read at least once.' },
                { term: 'break and continue', detail: 'break exits the enclosing loop immediately, and continue jumps to the next iteration skipping the rest of the body.' },
                { term: 'Progress the condition', detail: 'Something in the body must eventually make the condition false, or the loop never ends.' },
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
    id: 'c-functions',
    title: 'Functions & Recursion',
    level: 1,
    slug: 'functions',
    concepts: [],
    children: [
      {
        id: 'c-function-basics',
        title: 'Defining Functions',
        level: 2,
        slug: 'defining',
        concepts: [
          {
            id: 'c-function-def',
            code: "// Prototype (declaration)\nint add(int a, int b);\n\n// Definition\nint add(int a, int b) {\n  return a + b;\n}\n\nint main(void) {\n  printf(\"%d\\n\", add(2, 3)); // 5\n  return 0;\n}",
            note: "A function has a return type, a name, and a parameter list. Declaring a prototype before use lets the compiler check your calls even if the definition appears later. C passes arguments by value, meaning the function receives copies, so changes to parameters do not affect the caller's variables.",
            explanation: {
              heading: 'Defining and calling functions',
              intro: 'A function bundles a piece of logic behind a name, a return type, and a list of typed parameters. A prototype announces that signature ahead of time so the compiler can verify every call site, even when the full definition lives elsewhere.',
              points: [
                { term: 'Prototype first', detail: 'Declaring a prototype before the first call lets the compiler check argument counts and types and convert them correctly.' },
                { term: 'Pass by value', detail: 'Each argument is copied into its parameter, so assigning to a parameter changes only the local copy, not the caller.' },
                { term: 'void means none', detail: 'Writing void in the parameter list states the function takes no arguments, which is stricter than empty parentheses.' },
                { term: 'One return type', detail: 'A function returns a single value of its declared type, and returning void means it produces no value at all.' },
              ],
            },
          },
          {
            id: 'c-pass-by-pointer',
            code: "void increment(int *n) {\n  (*n)++;\n}\n\nint x = 5;\nincrement(&x);\n// x is now 6",
            note: "To let a function modify a caller's variable, pass its address and accept a pointer parameter. The function dereferences the pointer to reach the original storage. This pointer idiom is how C simulates pass-by-reference and how functions return more than one value.",
            explanation: {
              heading: 'Simulating pass by reference',
              intro: 'Because C copies arguments, a function cannot change a caller variable directly, but it can change the storage that a pointer refers to. Passing the address of a variable and dereferencing the pointer reaches back into the caller.',
              points: [
                { term: 'Take the address', detail: 'The caller uses the ampersand operator to pass the address, and the function declares a matching pointer parameter.' },
                { term: 'Dereference to modify', detail: 'Inside the function, writing through the star operator updates the original object rather than a copy.' },
                { term: 'Return several values', detail: 'Output parameters via pointers let a function report more than one result at once.' },
                { term: 'Validate the pointer', detail: 'A function should assume nothing about a pointer argument and guard against NULL before dereferencing it.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'c-recursion',
        title: 'Recursion',
        level: 2,
        slug: 'recursion',
        concepts: [
          {
            id: 'c-recursion-factorial',
            code: "long factorial(int n) {\n  if (n <= 1) return 1; // base case\n  return n * factorial(n - 1);\n}",
            note: "A recursive function calls itself, breaking a problem into smaller instances. Every recursion needs a base case that stops the calls, or it will recurse forever and overflow the stack. Each call uses stack space, so deep recursion can be costly compared to an iterative loop.",
            explanation: {
              heading: 'Solving problems recursively',
              intro: 'A recursive function expresses a problem in terms of smaller versions of itself, calling itself with reduced input until it reaches a case simple enough to answer directly. The base case is what keeps the recursion finite.',
              points: [
                { term: 'Base case required', detail: 'At least one condition must return without recursing, or the calls never stop and the stack overflows.' },
                { term: 'Move toward the base', detail: 'Each recursive call must make the argument closer to the base case, such as decreasing n by one.' },
                { term: 'Stack cost', detail: 'Every pending call keeps a frame on the stack, so very deep recursion can exhaust stack space and crash.' },
                { term: 'Iterate when hot', detail: 'Because loops avoid call overhead and stack growth, rewriting deep recursion as iteration is a common optimization.' },
              ],
            },
            example: "factorial(4) = 4 * 3 * 2 * 1 = 24",
          },
        ],
        children: [],
      },
    ],
  },

  // 6. Arrays & Strings
  {
    id: 'c-arrays-strings',
    title: 'Arrays & Strings',
    level: 1,
    slug: 'arrays-strings',
    concepts: [],
    children: [
      {
        id: 'c-arrays',
        title: 'Arrays',
        level: 2,
        slug: 'arrays',
        concepts: [
          {
            id: 'c-array-basics',
            code: "int nums[5] = { 10, 20, 30, 40, 50 };\nprintf(\"%d\\n\", nums[0]); // 10\nint len = sizeof(nums) / sizeof(nums[0]); // 5",
            note: "An array stores a fixed number of elements of the same type in contiguous memory, indexed from 0. C does not check bounds, so reading or writing outside the array is undefined behavior and a frequent source of crashes. The `sizeof` trick above computes the element count only for a real array, not a pointer.",
            explanation: {
              heading: 'Fixed-size arrays',
              intro: 'An array is a block of same-typed elements laid out back to back in memory, addressed by an index that starts at zero. Its length is fixed when declared, and C leaves it entirely to you to stay within that length.',
              points: [
                { term: 'Zero-based indexing', detail: 'The first element is index zero and the last is length minus one, so an array of five has valid indices zero through four.' },
                { term: 'No bounds checking', detail: 'Reading or writing outside the array is undefined behavior that may corrupt memory or crash rather than raise an error.' },
                { term: 'Element count trick', detail: 'Dividing sizeof the whole array by sizeof one element gives the length, but only where the real array type is visible.' },
                { term: 'Contiguous layout', detail: 'Elements sit adjacently in memory, which is what makes indexing and pointer arithmetic fast and predictable.' },
              ],
            },
          },
          {
            id: 'c-array-decay',
            code: "void sum(int *a, int n) {\n  int total = 0;\n  for (int i = 0; i < n; i++) total += a[i];\n  printf(\"%d\\n\", total);\n}\n\nint data[3] = { 1, 2, 3 };\nsum(data, 3); // pass length separately",
            note: "When an array is passed to a function it decays into a pointer to its first element, losing its length. That is why you almost always pass the element count as a separate argument. Inside the function `sizeof` would measure the pointer, not the original array.",
            explanation: {
              heading: 'Array decay to a pointer',
              intro: 'In most expressions an array name automatically converts, or decays, into a pointer to its first element. This is why a function that seems to take an array really receives only a pointer, with no knowledge of how many elements exist.',
              points: [
                { term: 'Length is lost', detail: 'Once decayed to a pointer the size information is gone, so the callee cannot recover the original element count.' },
                { term: 'Pass the count', detail: 'The standard remedy is to pass the element count as a separate parameter alongside the pointer.' },
                { term: 'sizeof surprises', detail: 'Inside the function sizeof on the parameter measures the pointer, typically eight bytes, not the whole array.' },
                { term: 'Parameter forms are equal', detail: 'Declaring a parameter as int a bracket bracket is identical to int star a because of decay.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'c-strings',
        title: 'Strings',
        level: 2,
        slug: 'strings',
        concepts: [
          {
            id: 'c-string-basics',
            code: "char greeting[] = \"hello\"; // 6 bytes: 'h','e','l','l','o','\\0'\nprintf(\"%s\\n\", greeting);\nprintf(\"length: %zu\\n\", strlen(greeting)); // 5",
            note: "A C string is just a char array ending in a null terminator `'\\0'`. Functions like `printf(\"%s\")` and `strlen` rely on that terminator to know where the string stops. `strlen` counts characters before the null, so it returns 5 for \"hello\" even though the array holds 6 bytes.",
            explanation: {
              heading: 'Null-terminated strings',
              intro: 'C has no dedicated string type; a string is simply a char array whose end is marked by a null character with value zero. Every standard string function relies on that terminator to find where the text stops.',
              points: [
                { term: 'The terminator counts', detail: 'A literal like hello occupies six bytes because the hidden null terminator is stored after the five letters.' },
                { term: 'strlen excludes the null', detail: 'strlen returns the number of characters before the terminator, so it reports five for hello.' },
                { term: 'Missing null is dangerous', detail: 'If the terminator is absent, string functions read past the buffer until they stumble on a zero byte, which is undefined behavior.' },
                { term: 'Literals are read-only', detail: 'A string literal has static storage and must not be modified, so store it in a char array when you need to change it.' },
              ],
            },
          },
          {
            id: 'c-string-functions',
            code: "#include <string.h>\n\nchar dst[16];\nstrcpy(dst, \"hi\");        // copy\nstrcat(dst, \" there\");     // append -> \"hi there\"\nif (strcmp(dst, \"hi there\") == 0) { /* equal */ }",
            note: "<string.h> provides `strcpy`, `strcat`, `strcmp`, and friends. `strcmp` returns 0 when strings are equal, so never compare strings with `==` (that compares addresses). These functions do not check the destination size, so ensure the buffer is large enough; safer variants like `snprintf` help avoid overflow.",
            explanation: {
              heading: 'Working with string.h',
              intro: 'The string.h header supplies the standard routines for copying, joining, and comparing null-terminated strings. Most of them trust you to provide a destination large enough, so buffer sizing is the programmer responsibility.',
              points: [
                { term: 'Compare with strcmp', detail: 'strcmp returns zero when the strings match, so comparing with double equals only tests whether two addresses are the same.' },
                { term: 'No size checks', detail: 'strcpy and strcat write until the source terminator, and if the destination is too small they overflow it.' },
                { term: 'Prefer bounded calls', detail: 'snprintf writes at most a given number of bytes and always terminates, which avoids the classic buffer overflow.' },
                { term: 'Copy needs room for null', detail: 'The destination must hold the source length plus one extra byte for the terminating null.' },
              ],
            },
            example: "// Safer bounded formatting:\nsnprintf(dst, sizeof(dst), \"%s %s\", \"hi\", \"there\");",
          },
        ],
        children: [],
      },
    ],
  },

  // 7. Pointers
  {
    id: 'c-pointers-section',
    title: 'Pointers',
    level: 1,
    slug: 'pointers',
    concepts: [],
    children: [
      {
        id: 'c-pointer-basics',
        title: 'Pointer Basics',
        level: 2,
        slug: 'basics',
        concepts: [
          {
            id: 'c-pointer-intro',
            code: "int x = 10;\nint *p = &x;        // p holds the address of x\nprintf(\"%d\\n\", *p); // 10 (dereference)\n*p = 20;            // changes x through the pointer\n// x is now 20",
            note: "A pointer stores a memory address. The `&` operator takes the address of a variable and `*` dereferences a pointer to read or write the value it points to. A pointer should point to valid storage; dereferencing an uninitialized or NULL pointer is undefined behavior.",
            explanation: {
              heading: 'What a pointer holds',
              intro: 'A pointer is a variable whose value is the memory address of another object rather than a number or character itself. Two operators tie pointers to the values they name: one takes an address and the other follows it.',
              points: [
                { term: 'Address-of operator', detail: 'The ampersand yields the address of a variable, which is exactly what you store into a pointer.' },
                { term: 'Dereference operator', detail: 'The star follows the pointer to reach the pointed-to object so you can read or write its value.' },
                { term: 'Pointers are typed', detail: 'An int pointer and a char pointer differ so the compiler knows the size and layout of what they reference.' },
                { term: 'Point somewhere valid', detail: 'Dereferencing a NULL or uninitialized pointer is undefined behavior, so initialize pointers before use.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'c-pointer-arithmetic',
        title: 'Pointer Arithmetic',
        level: 2,
        slug: 'arithmetic',
        concepts: [
          {
            id: 'c-pointer-arith-intro',
            code: "int a[4] = { 10, 20, 30, 40 };\nint *p = a;      // points to a[0]\nprintf(\"%d\\n\", *(p + 2)); // 30\np++;             // now points to a[1]\nprintf(\"%d\\n\", *p);       // 20",
            note: "Adding an integer to a pointer moves it by that many elements, not bytes, because the compiler scales by the element size. So `p + 2` on an int pointer advances 2 * sizeof(int) bytes. Arithmetic is only defined within an array (and one past the end); going further is undefined behavior.",
            explanation: {
              heading: 'Pointer arithmetic',
              intro: 'Arithmetic on a pointer counts in elements rather than raw bytes, so the compiler multiplies by the size of the pointed-to type behind the scenes. This is what makes indexing and iterating over an array natural with pointers.',
              points: [
                { term: 'Scaled by element size', detail: 'Adding two to an int pointer advances two times the size of an int in bytes, landing on the next-but-one element.' },
                { term: 'Indexing is sugar', detail: 'The expression p bracket i bracket is defined as star of p plus i, so arrays and pointers share the same arithmetic.' },
                { term: 'Stay inside the array', detail: 'Arithmetic is defined only within an array and one position past its end; going beyond is undefined behavior.' },
                { term: 'Subtracting pointers', detail: 'Subtracting two pointers into the same array gives the element distance between them as a signed count.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'c-pointers-to-pointers',
        title: 'Pointers to Pointers',
        level: 2,
        slug: 'pointers-to-pointers',
        concepts: [
          {
            id: 'c-double-pointer',
            code: "void allocate(int **out) {\n  *out = malloc(sizeof(int));\n  **out = 99;\n}\n\nint *value = NULL;\nallocate(&value);\nprintf(\"%d\\n\", *value); // 99\nfree(value);",
            note: "A pointer to a pointer (`int **`) lets a function change where a caller's pointer points. You pass the address of the pointer, then write through it with `*out`. This is the standard pattern when a function must allocate memory and hand it back to the caller.",
            explanation: {
              heading: 'Pointers to pointers',
              intro: 'A double pointer holds the address of another pointer, adding one more level of indirection. It is the tool you reach for when a function needs to change which object a caller pointer refers to, not just the pointed-to value.',
              points: [
                { term: 'Extra indirection', detail: 'An int double-star points at an int pointer, so dereferencing once yields the pointer and twice yields the int.' },
                { term: 'Allocate and hand back', detail: 'Passing the address of a pointer lets a function allocate memory and store the new address into the caller pointer.' },
                { term: 'Pass the address', detail: 'The caller uses the ampersand on its pointer, matching the double-pointer parameter the function expects.' },
                { term: 'Arrays of pointers', detail: 'The same type describes an array of strings, which is why argv is declared as a char double-star.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'c-function-pointers',
        title: 'Function Pointers',
        level: 2,
        slug: 'function-pointers',
        concepts: [
          {
            id: 'c-func-pointer-intro',
            code: "int add(int a, int b) { return a + b; }\n\nint (*op)(int, int) = add; // pointer to function\nprintf(\"%d\\n\", op(2, 3));  // 5",
            note: "A function pointer stores the address of a function so you can call it indirectly or pass it as an argument. The declaration `int (*op)(int, int)` reads as a pointer to a function taking two ints and returning an int. This enables callbacks and pluggable behavior, such as `qsort`'s comparison function.",
            explanation: {
              heading: 'Function pointers and callbacks',
              intro: 'Functions live at addresses too, and a function pointer stores one so code can be selected and called at run time. This lets you pass behavior into other functions, which is how the standard library supports callbacks like the comparator that qsort needs.',
              points: [
                { term: 'Reading the type', detail: 'The declaration int paren star op paren int comma int names a pointer to a function taking two ints and returning an int.' },
                { term: 'Parentheses matter', detail: 'The parentheses around star op are required, since without them the declaration would mean a function returning a pointer.' },
                { term: 'Call through it', detail: 'You invoke a function pointer just like a function, and the name of a function converts to its address automatically.' },
                { term: 'Enables callbacks', detail: 'Passing a function pointer lets a routine like qsort call your comparison logic without knowing it in advance.' },
              ],
            },
            example: "#include <stdlib.h>\nint cmp(const void *a, const void *b) {\n  return (*(int *)a - *(int *)b);\n}\nint arr[] = { 3, 1, 2 };\nqsort(arr, 3, sizeof(int), cmp);",
          },
        ],
        children: [],
      },
    ],
  },

  // 8. Dynamic Memory
  {
    id: 'c-dynamic-memory',
    title: 'Dynamic Memory',
    level: 1,
    slug: 'dynamic-memory',
    concepts: [],
    children: [
      {
        id: 'c-allocation',
        title: 'Allocating Memory',
        level: 2,
        slug: 'allocation',
        concepts: [
          {
            id: 'c-malloc-calloc',
            code: "int *a = malloc(10 * sizeof(int));   // uninitialized\nif (a == NULL) { /* handle out of memory */ }\n\nint *b = calloc(10, sizeof(int));    // zero-initialized\nif (b == NULL) { /* handle */ }",
            note: "`malloc` reserves a block of heap memory and returns a pointer to it, or NULL if it fails, so always check the result. `calloc` does the same but also zeroes the memory and takes count and size separately. Neither knows the type; you decide by how you use the returned pointer.",
            explanation: {
              heading: 'Requesting heap memory',
              intro: 'malloc and calloc carve out a block of memory on the heap that outlives the current function and hand you a pointer to it. They report failure by returning NULL, so a check on the result belongs right after every allocation.',
              points: [
                { term: 'malloc is uninitialized', detail: 'malloc reserves the requested bytes but leaves their contents indeterminate, so read them only after you write them.' },
                { term: 'calloc zeroes and counts', detail: 'calloc takes a count and an element size, clears the block to zero, and guards against overflow in the multiplication.' },
                { term: 'Always check for NULL', detail: 'Allocation can fail, and dereferencing the returned NULL is undefined behavior, so branch on the result first.' },
                { term: 'Size with sizeof', detail: 'Computing the byte count as count times sizeof of the element keeps the request correct across platforms.' },
              ],
            },
          },
          {
            id: 'c-realloc',
            code: "int *tmp = realloc(a, 20 * sizeof(int));\nif (tmp == NULL) {\n  free(a); // original block is still valid; avoid leaking it\n} else {\n  a = tmp; // only overwrite a on success\n}",
            note: "`realloc` grows or shrinks an existing block, possibly moving it to a new address and copying the contents. Assign its result to a temporary first: if it returns NULL the original pointer is still valid, and overwriting it directly would leak the old block. On success, the old pointer must not be used again.",
            explanation: {
              heading: 'Resizing an allocation',
              intro: 'realloc changes the size of a block you already own, keeping the existing contents up to the smaller of the old and new sizes. It may enlarge the block in place or move it entirely, in which case it copies your data and frees the old location.',
              points: [
                { term: 'Use a temporary', detail: 'Assign the result to a separate pointer first, because on failure realloc returns NULL while the original block stays valid.' },
                { term: 'Avoid the leak', detail: 'Overwriting your only pointer with a NULL result loses the address of the still-allocated block and leaks it.' },
                { term: 'The block may move', detail: 'After a successful realloc the old pointer may be dangling, so use only the newly returned pointer.' },
                { term: 'Grown bytes are raw', detail: 'When realloc enlarges a block the added bytes are uninitialized, just like memory from malloc.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'c-freeing',
        title: 'Freeing & Leaks',
        level: 2,
        slug: 'freeing',
        concepts: [
          {
            id: 'c-free-basics',
            code: "int *p = malloc(sizeof(int));\n*p = 42;\nfree(p);   // release the memory\np = NULL;  // avoid a dangling pointer",
            note: "Every successful allocation must be released exactly once with `free`, or the program leaks memory. After freeing, set the pointer to NULL so you cannot accidentally use it, since accessing freed memory (a dangling pointer) is undefined behavior. Calling `free` twice on the same block is also undefined behavior.",
            explanation: {
              heading: 'Releasing memory with free',
              intro: 'Heap memory stays reserved until you hand it back with free, so every successful allocation needs exactly one matching release. Getting the count wrong in either direction leads to leaks or corruption.',
              points: [
                { term: 'Free exactly once', detail: 'Releasing a block more than once is a double free and is undefined behavior that can corrupt the allocator.' },
                { term: 'Null after freeing', detail: 'Setting the pointer to NULL after free prevents accidental reuse, since a later free of NULL is safely a no-op.' },
                { term: 'No use after free', detail: 'Reading or writing through a pointer to freed memory is undefined behavior even if the value looks intact.' },
                { term: 'Match the source', detail: 'Only pass free a pointer that came from malloc, calloc, or realloc, never a stack or arbitrary address.' },
              ],
            },
          },
          {
            id: 'c-common-leaks',
            code: "// Leak: overwriting the only pointer to a block\nchar *s = malloc(100);\ns = malloc(200); // the first 100 bytes are now unreachable\n\n// Leak: early return before free\nint *buf = malloc(64);\nif (error) return; // forgot to free(buf)",
            note: "A memory leak happens when the last pointer to an allocation is lost without freeing it. Common causes are reassigning a pointer before freeing, and returning early on an error path. Tools like Valgrind or AddressSanitizer detect leaks and invalid accesses during testing.",
            explanation: {
              heading: 'Recognizing memory leaks',
              intro: 'A leak occurs when a program loses every pointer to a heap block before freeing it, so that memory can never be reclaimed while the program runs. Leaks accumulate silently and can slowly exhaust available memory in long-running programs.',
              points: [
                { term: 'Overwriting the handle', detail: 'Assigning a new allocation to a pointer before freeing the old one strands the first block permanently.' },
                { term: 'Early returns', detail: 'Returning on an error path without freeing already-allocated buffers is a frequent leak in functions with several exits.' },
                { term: 'Single owner', detail: 'Deciding which pointer owns and must free a block keeps responsibility clear when several pointers alias it.' },
                { term: 'Use tooling', detail: 'Valgrind and AddressSanitizer report leaks and invalid accesses during testing so you catch them before shipping.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 9. Structs, Unions & Enums
  {
    id: 'c-aggregates',
    title: 'Structs, Unions & Enums',
    level: 1,
    slug: 'aggregates',
    concepts: [],
    children: [
      {
        id: 'c-structs',
        title: 'Structs',
        level: 2,
        slug: 'structs',
        concepts: [
          {
            id: 'c-struct-def',
            code: "typedef struct {\n  double x;\n  double y;\n} Point;\n\nPoint p = { .x = 1.0, .y = 2.0 };\nprintf(\"%f\\n\", p.x);",
            note: "A struct groups related fields into one type, accessed with the `.` operator. Designated initializers like `{ .x = 1.0 }` (C99) make setup clear and order-independent. When you have a pointer to a struct, use the `->` operator, as in `ptr->x`.",
            explanation: {
              heading: 'Grouping data with structs',
              intro: 'A struct bundles several named fields, possibly of different types, into a single value you can pass around as a unit. It is the primary way C models records like a point, a customer, or a node in a data structure.',
              points: [
                { term: 'Dot versus arrow', detail: 'Use the dot operator on a struct value and the arrow operator on a pointer to a struct, where arrow means dereference then dot.' },
                { term: 'Designated initializers', detail: 'Writing dot x equals one point zero sets fields by name, which is order-independent and leaves the rest zeroed.' },
                { term: 'Copied by value', detail: 'Assigning or passing a struct copies every field, so large structs are often passed by pointer for efficiency.' },
                { term: 'Padding exists', detail: 'The compiler may insert padding between fields for alignment, so the struct size can exceed the sum of its members.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'c-unions',
        title: 'Unions',
        level: 2,
        slug: 'unions',
        concepts: [
          {
            id: 'c-union-def',
            code: "union Value {\n  int i;\n  float f;\n};\n\nunion Value v;\nv.i = 65;\n// Reading v.f now is not meaningful",
            note: "A union stores any one of its members at a time, all sharing the same memory, so its size is that of its largest member. Writing one member and then reading a different one generally gives implementation-defined or undefined results. Unions are typically paired with a separate tag field that records which member is currently active.",
            explanation: {
              heading: 'Overlapping storage with unions',
              intro: 'A union declares several members that all share the same block of memory, so it can hold any one of them at a time but never more than one. It is used to save space or to interpret the same bytes in more than one way.',
              points: [
                { term: 'Size of the largest', detail: 'Because all members overlap, the union is only as big as its largest member plus any alignment padding.' },
                { term: 'One active member', detail: 'Writing one member and then reading a different one gives implementation-defined or undefined results in general.' },
                { term: 'Tag the union', detail: 'Pairing the union with a separate enum tag records which member is currently valid, forming a tagged union.' },
                { term: 'Type punning caveat', detail: 'Reinterpreting bytes through a union is common practice but subject to alignment and representation rules.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'c-enums',
        title: 'Enums',
        level: 2,
        slug: 'enums',
        concepts: [
          {
            id: 'c-enum-def',
            code: "typedef enum {\n  RED,     // 0\n  GREEN,   // 1\n  BLUE     // 2\n} Color;\n\nColor c = GREEN;",
            note: "An enum defines a set of named integer constants, improving readability over magic numbers. Values start at 0 and increment by one unless you assign specific values. Enums are ordinary integers under the hood, so they work in `switch` statements and comparisons.",
            explanation: {
              heading: 'Named integer constants',
              intro: 'An enum introduces a group of named integer constants, replacing anonymous magic numbers with readable identifiers. The names document intent while the underlying values remain plain integers the compiler can compare and switch on.',
              points: [
                { term: 'Automatic numbering', detail: 'The first enumerator is zero by default and each following one is one greater unless you assign an explicit value.' },
                { term: 'Explicit values allowed', detail: 'You may set specific values, and later enumerators continue counting from the last assigned number.' },
                { term: 'Just integers', detail: 'Enumerators are integer constants, so they work directly in case labels, comparisons, and array sizes.' },
                { term: 'No range checking', detail: 'An enum variable can legally hold values outside the named set, so it does not enforce a closed list.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 10. Typedef
  {
    id: 'c-typedef',
    title: 'Typedef',
    level: 1,
    slug: 'typedef',
    concepts: [],
    children: [
      {
        id: 'c-typedef-basics',
        title: 'Type Aliases',
        level: 2,
        slug: 'aliases',
        concepts: [
          {
            id: 'c-typedef-intro',
            code: "typedef unsigned long ulong;\ntypedef struct Node Node;\n\nstruct Node {\n  int value;\n  Node *next;\n};",
            note: "`typedef` creates an alias for an existing type, which shortens verbose declarations and clarifies intent. It is especially handy for structs so you can write `Node` instead of `struct Node`. A typedef does not create a new type; it is purely another name for the same one.",
            explanation: {
              heading: 'Aliasing types',
              intro: 'A typedef gives an existing type a second, usually shorter name that you can use anywhere the original type is allowed. It improves readability without changing the type system, since the alias and the original are fully interchangeable.',
              points: [
                { term: 'Not a new type', detail: 'A typedef only adds a name, so the alias and the underlying type are identical and freely mix in expressions.' },
                { term: 'Tidies struct names', detail: 'Aliasing struct Node to Node lets you drop the struct keyword everywhere the type is used.' },
                { term: 'Self-referential structs', detail: 'A struct that points to itself still needs its own tag inside, because the typedef name is not yet visible there.' },
                { term: 'Clarifies intent', detail: 'Naming an alias like Comparator or ulong documents purpose better than repeating a verbose raw type.' },
              ],
            },
          },
          {
            id: 'c-typedef-funcptr',
            code: "typedef int (*Comparator)(const void *, const void *);\n\nComparator cmp = my_compare; // much clearer than the raw type",
            note: "typedef shines with complex declarations like function pointers, turning an unreadable type into a simple name. Here `Comparator` names a pointer to a comparison function. Using the alias makes function signatures and variable declarations far easier to read.",
            explanation: {
              heading: 'Taming complex types',
              intro: 'C declaration syntax grows hard to read for things like pointers to functions, where the name sits buried inside layers of parentheses and asterisks. A typedef captures that tangled type once and gives it a plain name you can reuse.',
              points: [
                { term: 'Hide the syntax', detail: 'The alias Comparator stands in for a pointer to a function taking two const void pointers and returning an int.' },
                { term: 'Cleaner signatures', detail: 'Functions that accept or return such pointers read far more clearly when they use the alias instead of the raw form.' },
                { term: 'Consistency', detail: 'Defining the type in one place ensures every callback variable and parameter agrees on the exact signature.' },
                { term: 'Still the same type', detail: 'As with any typedef the alias does not create a distinct type, so it interchanges with the raw pointer type.' },
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
    id: 'c-file-io',
    title: 'File I/O',
    level: 1,
    slug: 'file-io',
    concepts: [],
    children: [
      {
        id: 'c-text-files',
        title: 'Text Files',
        level: 2,
        slug: 'text-files',
        concepts: [
          {
            id: 'c-fopen-fprintf',
            code: "FILE *fp = fopen(\"out.txt\", \"w\");\nif (fp == NULL) { perror(\"fopen\"); return 1; }\nfprintf(fp, \"count = %d\\n\", 42);\nfclose(fp);",
            note: "`fopen` opens a file and returns a `FILE *`, or NULL on failure, so always check it. The mode string chooses the operation: \"r\" read, \"w\" write (truncates), \"a\" append. `fprintf` writes formatted text like `printf` but to the file, and `fclose` flushes buffers and releases the handle.",
            explanation: {
              heading: 'Reading and writing text files',
              intro: 'The standard I/O library models a file as a FILE stream that you open, use, and then close. fopen returns a handle to that stream or NULL when it cannot open the file, so checking the result is the first step of safe file handling.',
              points: [
                { term: 'Mode selects behavior', detail: 'The mode r reads, w writes and truncates any existing content, and a appends to the end of the file.' },
                { term: 'Check the handle', detail: 'fopen returns NULL on failure, and perror prints a helpful message describing why the open did not succeed.' },
                { term: 'Formatted writing', detail: 'fprintf works exactly like printf but sends its output to the given stream instead of standard output.' },
                { term: 'Close to flush', detail: 'fclose flushes buffered data to disk and releases the handle, so forgetting it can lose the last writes.' },
              ],
            },
          },
          {
            id: 'c-fgets-read',
            code: "char line[256];\nFILE *fp = fopen(\"in.txt\", \"r\");\nif (fp) {\n  while (fgets(line, sizeof(line), fp) != NULL) {\n    printf(\"%s\", line);\n  }\n  fclose(fp);\n}",
            note: "`fgets` reads up to one line at a time into a fixed buffer and stops at a newline or when the buffer is nearly full, keeping it safe from overflow. It returns NULL at end of file or on error, which makes it a natural loop condition. Prefer `fgets` over the unsafe `gets`, which was removed from the standard.",
            explanation: {
              heading: 'Reading lines safely',
              intro: 'fgets reads characters into a buffer until it hits a newline, fills the buffer, or reaches end of file, and it always leaves room for a terminating null. This built-in size limit is what makes it a safe replacement for the removed gets function.',
              points: [
                { term: 'Bounded read', detail: 'You pass the buffer size, so fgets never writes more than that many bytes and cannot overflow the buffer.' },
                { term: 'Keeps the newline', detail: 'When a full line fits, the trailing newline is stored in the buffer, which you may want to strip.' },
                { term: 'NULL ends the loop', detail: 'fgets returns NULL at end of file or on error, making a while loop on its result the natural reading idiom.' },
                { term: 'Never use gets', detail: 'The old gets had no size limit and was removed from the standard because it invited buffer overflows.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'c-binary-files',
        title: 'Binary Files',
        level: 2,
        slug: 'binary-files',
        concepts: [
          {
            id: 'c-fread-fwrite',
            code: "int data[4] = { 1, 2, 3, 4 };\nFILE *fp = fopen(\"data.bin\", \"wb\");\nfwrite(data, sizeof(int), 4, fp);\nfclose(fp);\n\nint back[4];\nfp = fopen(\"data.bin\", \"rb\");\nfread(back, sizeof(int), 4, fp);\nfclose(fp);",
            note: "`fwrite` and `fread` transfer raw bytes, taking a pointer, the size of one element, the element count, and the file. Open binary files with the \"b\" mode flag so the bytes are not translated. Note that raw binary layouts are not portable across machines with different sizes or byte order.",
            explanation: {
              heading: 'Binary reads and writes',
              intro: 'fread and fwrite move raw bytes between memory and a stream without any text interpretation, which suits storing numbers, structs, and other binary data compactly. Each call takes a pointer, the size of one element, how many elements, and the stream.',
              points: [
                { term: 'Open in binary mode', detail: 'Adding b to the mode, as in rb or wb, stops the library from translating bytes such as line endings.' },
                { term: 'Element size and count', detail: 'The two size arguments multiply to the total bytes, and the return value is the number of elements actually transferred.' },
                { term: 'Check the count', detail: 'A short return from fread or fwrite signals end of file or an error, so compare it against the requested count.' },
                { term: 'Layout is not portable', detail: 'Type sizes, padding, and byte order differ between machines, so raw dumps may not read back correctly elsewhere.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 12. The Preprocessor
  {
    id: 'c-preprocessor',
    title: 'The Preprocessor',
    level: 1,
    slug: 'preprocessor',
    concepts: [],
    children: [
      {
        id: 'c-macros',
        title: 'Macros & Includes',
        level: 2,
        slug: 'macros',
        concepts: [
          {
            id: 'c-define-include',
            code: "#include <stdio.h>   // system header\n#include \"myutil.h\"  // local header\n\n#define PI 3.14159\n#define SQUARE(x) ((x) * (x))\n\nint area = SQUARE(3); // expands to ((3) * (3)) = 9",
            note: "The preprocessor runs before compilation, doing pure text substitution. `#include` pastes a header's contents, and `#define` creates object-like or function-like macros. Always wrap macro parameters and the whole body in parentheses, as in `SQUARE`, to avoid surprises from operator precedence.",
            explanation: {
              heading: 'Macros and includes',
              intro: 'The preprocessor runs first and manipulates your source purely as text, before the compiler ever sees types or expressions. Include directives paste in header contents and define directives set up macros that expand wherever their name appears.',
              points: [
                { term: 'Include pastes headers', detail: 'Angle brackets search system directories while quotes search local ones, and either way the header text is inserted in place.' },
                { term: 'Two macro kinds', detail: 'An object-like macro replaces a name with text, while a function-like macro also substitutes its arguments into the body.' },
                { term: 'Parenthesize everything', detail: 'Wrap each parameter and the whole body in parentheses so surrounding operators do not reorder the expansion.' },
                { term: 'No type checking', detail: 'Because expansion is textual, macros ignore types and can evaluate an argument more than once, causing surprises with side effects.' },
              ],
            },
            example: "// Without parentheses this would be wrong:\n// #define SQUARE(x) x * x  -> SQUARE(1+2) = 1+2*1+2 = 5",
          },
        ],
        children: [],
      },
      {
        id: 'c-conditional-compilation',
        title: 'Conditional Compilation',
        level: 2,
        slug: 'conditional-compilation',
        concepts: [
          {
            id: 'c-ifdef',
            code: "#ifndef CONFIG_H\n#define CONFIG_H\n// header contents go here\n#endif\n\n#ifdef DEBUG\n  printf(\"debug: x = %d\\n\", x);\n#endif",
            note: "Conditional directives include or exclude code before compilation. The `#ifndef`/`#define`/`#endif` include guard prevents a header from being processed twice in one translation unit. `#ifdef DEBUG` lets you compile diagnostics only when a macro is defined, for example via `-DDEBUG` on the command line.",
            explanation: {
              heading: 'Conditional compilation',
              intro: 'Conditional directives let the preprocessor keep or discard blocks of code based on whether macros are defined, all before the compiler runs. This drives include guards, debug-only code, and platform-specific sections.',
              points: [
                { term: 'Include guards', detail: 'The ifndef, define, endif pattern ensures a header is processed only once even if it is included many times.' },
                { term: 'Compile on a flag', detail: 'Wrapping diagnostics in ifdef DEBUG compiles them only when DEBUG is defined, for example via -DDEBUG on the command line.' },
                { term: 'Define from the compiler', detail: 'The -D option defines a macro at build time without editing the source, which is handy for configuration.' },
                { term: 'Pragma once alternative', detail: 'Many compilers accept pragma once as a shorter, though non-standard, way to achieve the same single-inclusion guarantee.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 13. Bit Manipulation
  {
    id: 'c-bit-manipulation',
    title: 'Bit Manipulation',
    level: 1,
    slug: 'bit-manipulation',
    concepts: [],
    children: [
      {
        id: 'c-bitwise-operators',
        title: 'Bitwise Operators',
        level: 2,
        slug: 'bitwise-operators',
        concepts: [
          {
            id: 'c-bitwise-intro',
            code: "unsigned x = 0b1100; // 12\nunsigned y = 0b1010; // 10\nx & y;   // 0b1000 = 8  (AND)\nx | y;   // 0b1110 = 14 (OR)\nx ^ y;   // 0b0110 = 6  (XOR)\n~x;      // bitwise NOT\nx << 1;  // 0b11000 = 24 (left shift)",
            note: "Bitwise operators work on individual bits: `&`, `|`, `^`, and `~` combine or invert bits, while `<<` and `>>` shift them. Left-shifting by n multiplies by 2^n for unsigned values. Prefer unsigned types for bit work, since shifting into or past the sign bit of a signed integer can be undefined behavior.",
            explanation: {
              heading: 'Operating on bits',
              intro: 'Bitwise operators treat an integer as a row of individual bits rather than a single number, letting you combine, flip, and shift those bits directly. They are the foundation for flags, masks, and low-level data packing.',
              points: [
                { term: 'Combine and invert', detail: 'The and, or, and xor operators merge two values bit by bit, while the tilde flips every bit of one value.' },
                { term: 'Shifts scale by powers of two', detail: 'A left shift by n multiplies an unsigned value by two to the n, and a right shift divides it.' },
                { term: 'Prefer unsigned', detail: 'Do bit work on unsigned types, since shifting into or past the sign bit of a signed integer can be undefined behavior.' },
                { term: 'Not the logical versions', detail: 'Single-character and and or work on bits, unlike the doubled logical operators that produce a single truth value.' },
              ],
            },
          },
          {
            id: 'c-bit-flags',
            code: "#define FLAG_A (1u << 0)\n#define FLAG_B (1u << 1)\n\nunsigned opts = 0;\nopts |= FLAG_A;              // set a bit\nif (opts & FLAG_B) { }      // test a bit\nopts &= ~FLAG_A;            // clear a bit",
            note: "A common use of bit operations is packing many on/off flags into a single integer. Set a bit with `|=`, test it with `&`, and clear it with `&= ~`. Defining each flag as `1u << n` keeps the bit positions clear and self-documenting.",
            explanation: {
              heading: 'Bit flags and masks',
              intro: 'A single integer can store many independent on-or-off options by dedicating one bit to each, which is compact and fast to test. A mask, usually one bit shifted into position, selects which bit an operation affects.',
              points: [
                { term: 'Set a bit', detail: 'Or-assigning a mask turns its bit on while leaving all the other bits untouched.' },
                { term: 'Test a bit', detail: 'And-ing with a mask yields nonzero only when that bit is set, which reads naturally inside an if.' },
                { term: 'Clear a bit', detail: 'And-assigning the inverted mask, written and-equals tilde mask, turns a single bit off.' },
                { term: 'Name the positions', detail: 'Defining each flag as one unsigned shifted left by n keeps the bit positions explicit and self-documenting.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 14. Standard Library & Program Entry
  {
    id: 'c-stdlib-cli',
    title: 'Standard Library & CLI',
    level: 1,
    slug: 'stdlib-cli',
    concepts: [],
    children: [
      {
        id: 'c-stdlib-highlights',
        title: 'Standard Library Highlights',
        level: 2,
        slug: 'stdlib-highlights',
        concepts: [
          {
            id: 'c-stdlib-functions',
            code: "#include <stdlib.h>\n#include <math.h>\n\nint n = atoi(\"42\");        // string to int\ndouble d = strtod(\"3.14\", NULL);\nint r = abs(-7);           // 7\ndouble root = sqrt(2.0);   // needs -lm to link math",
            note: "The C standard library is a toolbox: <stdlib.h> offers conversions (`atoi`, `strtod`), memory (`malloc`, `free`), and utilities (`qsort`, `rand`), while <math.h> provides `sqrt`, `pow`, and trig functions. Prefer `strtol`/`strtod` over `atoi` when you need to detect conversion errors. On many systems, math functions require linking with `-lm`.",
            explanation: {
              heading: 'Using the standard library',
              intro: 'The C standard library is a collection of headers, each grouping related functions you can rely on across platforms. Knowing which header provides which tool saves you from reinventing conversions, sorting, and math.',
              points: [
                { term: 'stdlib is the toolbox', detail: 'It holds conversions like atoi and strtod, memory functions like malloc and free, and utilities like qsort and rand.' },
                { term: 'Detect conversion errors', detail: 'Prefer strtol and strtod over atoi, since they can report where parsing stopped and whether it failed.' },
                { term: 'math needs a header', detail: 'Functions like sqrt and pow live in math.h, and you must include it to get correct prototypes.' },
                { term: 'Link the math library', detail: 'On many Unix systems math functions require adding -lm to the compile command so the linker finds them.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'c-command-line-args',
        title: 'Command-Line Arguments',
        level: 2,
        slug: 'command-line-args',
        concepts: [
          {
            id: 'c-argc-argv',
            code: "int main(int argc, char *argv[]) {\n  printf(\"program: %s\\n\", argv[0]);\n  for (int i = 1; i < argc; i++) {\n    printf(\"arg %d: %s\\n\", i, argv[i]);\n  }\n  return 0;\n}",
            note: "When you declare `main(int argc, char *argv[])`, `argc` is the number of arguments and `argv` is an array of C strings. `argv[0]` is the program name, and `argv[1]` onward are the user's arguments. `argv[argc]` is guaranteed to be NULL, which some loops rely on.",
            explanation: {
              heading: 'Reading command-line arguments',
              intro: 'When main takes the two-parameter form, the runtime hands it the words typed on the command line as an array of strings plus a count. This is how a program receives file names, options, and other input from the shell.',
              points: [
                { term: 'argc counts everything', detail: 'The count includes the program name itself, so a program invoked with two arguments sees argc equal to three.' },
                { term: 'argv holds strings', detail: 'Each argv entry is a null-terminated string, with index zero being the program name and later indices the arguments.' },
                { term: 'Terminating NULL', detail: 'The standard guarantees argv at index argc is a NULL pointer, which some loops use as a stopping condition.' },
                { term: 'Convert as needed', detail: 'Arguments arrive as text, so use strtol or strtod to turn a numeric argument into an actual number.' },
              ],
            },
            example: "// ./myprog hello 42\n// argc == 3, argv[1] == \"hello\", argv[2] == \"42\"",
          },
        ],
        children: [],
      },
      {
        id: 'c-undefined-behavior',
        title: 'Undefined Behavior Pitfalls',
        level: 2,
        slug: 'undefined-behavior',
        concepts: [
          {
            id: 'c-ub-examples',
            code: "int a[3];\na[5] = 1;          // out-of-bounds write: UB\n\nint *p;\n*p = 10;           // dereferencing uninitialized pointer: UB\n\nint x = INT_MAX;\nx = x + 1;         // signed integer overflow: UB",
            note: "Undefined behavior means the standard imposes no requirements: the program might crash, produce wrong results, or appear to work by luck. Classic causes include out-of-bounds array access, dereferencing invalid pointers, signed integer overflow, and using memory after freeing it. Enable warnings and sanitizers (`-fsanitize=address,undefined`) to catch these during development.",
            explanation: {
              heading: 'Avoiding undefined behavior',
              intro: 'Undefined behavior is a program construct for which the C standard places no requirements at all, so the compiler may do anything from crashing to silently producing wrong answers. Dangerously, such code can appear to work during testing and fail later after an optimization or platform change.',
              points: [
                { term: 'No guarantees', detail: 'Once a program hits undefined behavior the whole execution is meaningless, not just the offending line.' },
                { term: 'Classic triggers', detail: 'Out-of-bounds access, dereferencing invalid pointers, signed overflow, and use after free are the usual culprits.' },
                { term: 'Optimizers assume none', detail: 'Compilers assume undefined behavior never happens, so relying on it can make code break when optimizations are enabled.' },
                { term: 'Catch it early', detail: 'Enable warnings and run with the address and undefined sanitizers to surface these bugs during development.' },
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
