// Go topic tree.
//
// Each node is a ConceptNode: { id, title, level, slug?, concepts[], children[] }.
// Routable nodes carry a `slug`. Every Concept renders in the fixed order
// code -> note -> example (example optional).

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  // 1. Variables & Declarations
  {
    id: 'go-variables',
    title: 'Variables & Declarations',
    level: 1,
    slug: 'variables',
    concepts: [],
    children: [
      {
        id: 'go-var-declare',
        title: 'Variable Declarations',
        level: 2,
        slug: 'var-declarations',
        concepts: [
          {
            id: 'go-var-short',
            code: `package main

import "fmt"

func main() {
    name := "Go"          // short declaration (inferred type)
    var age int = 10      // explicit type
    var active = true     // type inferred from value
    fmt.Println(name, age, active)
}`,
            note: 'Inside functions, `:=` is the short variable declaration operator. Outside functions, you must use `var`. Go infers types from the right-hand side when possible.',
            explanation: {
              heading: 'Declaring variables in Go',
              intro: 'Go is statically typed but lets you omit the type when it can be inferred from the initializer. There are two ways to introduce a variable, and where you write it decides which one is allowed.',
              points: [
                { term: 'Short declaration', detail: 'The colon equals form declares and initializes a new variable in one step and is only legal inside a function body.' },
                { term: 'The var keyword', detail: 'The var form works everywhere including package scope, and it lets you state the type explicitly or leave it to be inferred.' },
                { term: 'Type inference', detail: 'When you supply a value, the compiler picks the type from the right hand side, so an untyped integer literal becomes an int and a decimal becomes a float64.' },
                { term: 'No unused variables', detail: 'Go refuses to compile if a declared local variable is never used, which keeps code clean but can surprise newcomers.' },
                { term: 'Grouped declarations', detail: 'A var block with parentheses groups several related declarations together, which is common for package level configuration values.' },
              ],
            },
            example: `// Multiple declarations
var (
    host = "localhost"
    port = 8080
)`,
          },
        ],
        children: [],
      },
      {
        id: 'go-zero-values',
        title: 'Zero Values',
        level: 2,
        slug: 'zero-values',
        concepts: [
          {
            id: 'go-zero-values-intro',
            code: `var i int       // 0
var f float64   // 0.0
var b bool      // false
var s string    // ""
var p *int      // nil`,
            note: 'Every type in Go has a zero value. Numeric types default to 0, booleans to false, strings to empty, and pointers/slices/maps/channels to nil.',
            explanation: {
              heading: 'Why zero values matter',
              intro: 'Go guarantees that every declared variable is initialized to a well defined zero value even when you do not assign one. This removes a whole class of uninitialized memory bugs found in some other languages.',
              points: [
                { term: 'Numeric zero', detail: 'Integer and floating point types start at zero, so counters and accumulators are safe to use immediately after declaration.' },
                { term: 'Booleans and strings', detail: 'A bool starts as false and a string starts as an empty value, which are usually the natural defaults for flags and text.' },
                { term: 'Nil reference types', detail: 'Pointers, slices, maps, channels, functions, and interfaces begin as nil, meaning they refer to nothing until you assign something.' },
                { term: 'Usable versus not', detail: 'A nil slice can be appended to safely, but writing to a nil map panics, so maps must be created with make before use.' },
                { term: 'Struct zeroing', detail: 'A struct zero value sets every field to its own zero value, which makes it easy to design types that are useful without an explicit constructor.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 2. Constants
  {
    id: 'go-constants',
    title: 'Constants',
    level: 1,
    slug: 'constants',
    concepts: [],
    children: [
      {
        id: 'go-const-basics',
        title: 'Declaring Constants',
        level: 2,
        slug: 'const-basics',
        concepts: [
          {
            id: 'go-const-declare',
            code: `const Pi = 3.14159
const (
    StatusOK    = 200
    StatusNotFound = 404
)`,
            note: 'Constants are declared with `const` and cannot be changed after assignment. They can be character, string, boolean, or numeric values.',
            explanation: {
              heading: 'Working with constants',
              intro: 'Constants are values fixed at compile time and can never change while the program runs. They exist only for boolean, rune, string, and numeric kinds, which makes them predictable and safe to share.',
              points: [
                { term: 'Compile time only', detail: 'A constant must be assigned an expression the compiler can evaluate, so it cannot hold a value computed at runtime such as a function result.' },
                { term: 'Untyped constants', detail: 'A constant without an explicit type stays untyped until used, letting the same value serve as an int in one place and a float64 in another.' },
                { term: 'High precision', detail: 'Untyped numeric constants are kept at very high precision during evaluation and only rounded when assigned to a typed variable.' },
                { term: 'Grouping with blocks', detail: 'A const block groups related constants and pairs naturally with the iota generator for enumerations.' },
                { term: 'Immutability benefit', detail: 'Because they cannot change, constants document intent clearly and let the compiler catch attempts to reassign them.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'go-iota',
        title: 'Iota Enumerations',
        level: 2,
        slug: 'iota',
        concepts: [
          {
            id: 'go-iota-intro',
            code: `type Direction int

const (
    North Direction = iota  // 0
    East                    // 1
    South                   // 2
    West                    // 3
)`,
            note: '`iota` is a built-in constant generator that starts at 0 and increments by 1 for each constant in a `const` block. It resets in each new block.',
            explanation: {
              heading: 'Generating enumerations with iota',
              intro: 'The iota identifier is a counter the compiler uses inside a const block to produce a sequence of related values without writing each number by hand. It is the idiomatic way to build enumerations in Go.',
              points: [
                { term: 'Starts at zero', detail: 'Within a const block iota begins at zero on the first line and increases by one for each following constant specification.' },
                { term: 'Resets per block', detail: 'Each new const block restarts iota at zero, so counters in separate blocks do not interfere with each other.' },
                { term: 'Expressions carry down', detail: 'When a line omits its expression, Go repeats the previous one, which is how a single iota formula fills an entire block.' },
                { term: 'Building bit flags', detail: 'Shifting one left by iota produces powers of two, giving each flag a distinct bit that can be combined with the OR operator.' },
                { term: 'Named types', detail: 'Pairing iota with a defined integer type gives your enumeration a real name that the compiler can check against.' },
              ],
            },
            example: `// Bit flags with iota
const (
    Read   = 1 << iota  // 1
    Write               // 2
    Execute             // 4
)`,
          },
        ],
        children: [],
      },
    ],
  },

  // 3. Basic Types
  {
    id: 'go-types',
    title: 'Basic Types',
    level: 1,
    slug: 'types',
    concepts: [],
    children: [
      {
        id: 'go-numeric-types',
        title: 'Numeric Types',
        level: 2,
        slug: 'numeric-types',
        concepts: [
          {
            id: 'go-numeric-intro',
            code: `var i int = 42          // platform-dependent size
var i8 int8 = 127      // -128 to 127
var u uint = 100       // unsigned integer
var f32 float32 = 3.14
var f64 float64 = 2.718281828
var c complex128 = 3 + 4i`,
            note: 'Go has sized integers (int8, int16, int32, int64), unsigned variants (uint8 through uint64), two float sizes (float32, float64), and complex numbers.',
            explanation: {
              heading: 'Choosing numeric types',
              intro: 'Go offers a rich set of numeric types with explicit sizes so you can control memory and range precisely. Picking the right one balances portability, correctness, and performance.',
              points: [
                { term: 'Sized integers', detail: 'Types such as int8 through int64 fix the width in bits, which matters for binary formats and for guaranteeing a range across platforms.' },
                { term: 'Platform sized int', detail: 'The plain int type is thirty two or sixty four bits depending on the target, and it is the sensible default for counting and indexing.' },
                { term: 'Unsigned variants', detail: 'The uint family stores only non negative numbers and doubles the positive range, but it wraps around on subtraction below zero.' },
                { term: 'Floating point', detail: 'The float64 type is the default for real numbers with about fifteen digits of precision, while float32 trades accuracy for smaller size.' },
                { term: 'No implicit mixing', detail: 'Go never converts between numeric types automatically, so mixing an int and a float64 requires an explicit conversion.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'go-strings-runes',
        title: 'Strings & Runes',
        level: 2,
        slug: 'strings-runes',
        concepts: [
          {
            id: 'go-strings-basics',
            code: `s := "Hello, 世界"
fmt.Println(len(s))          // byte length: 13
fmt.Println(utf8.RuneCountInString(s))  // rune count: 9

for i, r := range s {
    fmt.Printf("%d: %c\\n", i, r)
}`,
            note: 'Strings are immutable byte slices. A `rune` is an alias for `int32` representing a Unicode code point. Use `range` to iterate by rune rather than byte.',
            explanation: {
              heading: 'Strings, bytes, and runes',
              intro: 'A Go string is an immutable sequence of bytes that usually holds UTF eight encoded text. Understanding the difference between a byte and a rune is essential for correct handling of non ASCII characters.',
              points: [
                { term: 'Immutable bytes', detail: 'Once created a string cannot be changed, so operations that look like edits actually build a new string.' },
                { term: 'Length in bytes', detail: 'The len function returns the number of bytes, which is not the same as the number of characters for multi byte text.' },
                { term: 'Runes are code points', detail: 'A rune is an alias for int32 and represents a single Unicode code point, so it can hold characters that need more than one byte.' },
                { term: 'Range decodes runes', detail: 'Ranging over a string decodes UTF eight and yields the byte index and the rune, which is the correct way to walk characters.' },
                { term: 'Counting characters', detail: 'To count actual characters rather than bytes, use the rune counting helper in the utf8 package instead of len.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 4. Operators
  {
    id: 'go-operators',
    title: 'Operators',
    level: 1,
    slug: 'operators',
    concepts: [],
    children: [
      {
        id: 'go-arithmetic-ops',
        title: 'Arithmetic & Comparison',
        level: 2,
        slug: 'arithmetic-comparison',
        concepts: [
          {
            id: 'go-arith-ops',
            code: `a, b := 10, 3
fmt.Println(a + b)   // 13
fmt.Println(a - b)   // 7
fmt.Println(a * b)   // 30
fmt.Println(a / b)   // 3 (integer division)
fmt.Println(a % b)   // 1
fmt.Println(a == b)  // false
fmt.Println(a > b)   // true`,
            note: 'Go supports standard arithmetic operators. Integer division truncates. Comparison operators return a `bool`. There is no ternary operator in Go.',
            explanation: {
              heading: 'Arithmetic and comparison rules',
              intro: 'Go provides the familiar arithmetic and comparison operators, but a few rules around integer division and typing catch newcomers. Knowing them avoids subtle bugs.',
              points: [
                { term: 'Integer division truncates', detail: 'Dividing two integers discards the fractional part, so ten divided by three yields three rather than a rounded result.' },
                { term: 'Modulo for remainder', detail: 'The percent operator returns the remainder of integer division and is only defined for integer types.' },
                { term: 'Comparisons yield bool', detail: 'Operators like equals and greater than always produce a bool, which is the only type accepted by conditions in Go.' },
                { term: 'No ternary operator', detail: 'Go deliberately omits the question mark colon operator, so you write a short if or else block instead of a one line conditional expression.' },
                { term: 'Matching operand types', detail: 'Both operands of an arithmetic operator must share a type, so you convert explicitly before combining different numeric types.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'go-logical-bitwise',
        title: 'Logical & Bitwise',
        level: 2,
        slug: 'logical-bitwise',
        concepts: [
          {
            id: 'go-bitwise-ops',
            code: `x := 0b1010  // 10
y := 0b1100  // 12
fmt.Printf("%04b\\n", x & y)   // 1000 (AND)
fmt.Printf("%04b\\n", x | y)   // 1110 (OR)
fmt.Printf("%04b\\n", x ^ y)   // 0110 (XOR)
fmt.Printf("%04b\\n", x << 1)  // 10100 (left shift)`,
            note: 'Bitwise operators work on integer types. Go also provides `&^` (AND NOT / bit clear) which is unique to Go.',
            explanation: {
              heading: 'Logical and bitwise operators',
              intro: 'Go separates logical operators that work on booleans from bitwise operators that manipulate the individual bits of integers. Both are common in flags, permissions, and low level code.',
              points: [
                { term: 'Short circuit logic', detail: 'The logical AND and OR operators stop evaluating as soon as the result is known, which lets you guard against nil or divide by zero.' },
                { term: 'Bitwise basics', detail: 'The single ampersand, pipe, and caret perform AND, OR, and exclusive OR on each bit of two integer operands.' },
                { term: 'Shifting bits', detail: 'Left and right shift move bits to multiply or divide by powers of two and are the basis for building bit flags.' },
                { term: 'Bit clear operator', detail: 'The and not operator unique to Go clears the bits set in the right operand from the left operand in a single step.' },
                { term: 'Integer only', detail: 'Bitwise operators require integer types, so they cannot be applied to floating point or boolean values.' },
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
    id: 'go-control-flow',
    title: 'Control Flow',
    level: 1,
    slug: 'control-flow',
    concepts: [],
    children: [
      {
        id: 'go-if-else',
        title: 'If / Else',
        level: 2,
        slug: 'if-else',
        concepts: [
          {
            id: 'go-if-statement',
            code: `if x := compute(); x > 10 {
    fmt.Println("large")
} else if x > 5 {
    fmt.Println("medium")
} else {
    fmt.Println("small")
}`,
            note: 'Go `if` statements do not need parentheses but require braces. A short statement can precede the condition — the variable is scoped to the if/else block.',
            explanation: {
              heading: 'Conditionals in Go',
              intro: 'The if statement in Go drops the parentheses around the condition but always requires braces around the body. A special initializer form keeps helper variables tightly scoped.',
              points: [
                { term: 'No parentheses', detail: 'The condition is written without surrounding parentheses, while braces are mandatory even for a single statement.' },
                { term: 'Initializer clause', detail: 'A short statement before the condition runs first, which is ideal for computing a value or checking an error right where it is used.' },
                { term: 'Block scoping', detail: 'A variable declared in the initializer is visible only inside the if and its else branches, keeping the surrounding scope clean.' },
                { term: 'Boolean only', detail: 'The condition must be a bool, since Go does not treat numbers or strings as truthy or falsy.' },
                { term: 'Chaining branches', detail: 'You can chain else if branches, but a type switch or expression switch is often clearer when there are many cases.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'go-for-loops',
        title: 'For Loops',
        level: 2,
        slug: 'for-loops',
        concepts: [
          {
            id: 'go-for-variants',
            code: `// Classic for
for i := 0; i < 5; i++ {
    fmt.Println(i)
}

// While-style
n := 1
for n < 100 {
    n *= 2
}

// Infinite loop
for {
    break // exits immediately
}`,
            note: 'Go has only `for` as its looping construct. It covers traditional for-loops, while-loops, and infinite loops depending on the syntax used.',
            explanation: {
              heading: 'The single loop keyword',
              intro: 'Go simplifies looping by providing only the for keyword, which flexes into every loop shape other languages spell differently. The form you get depends on which clauses you include.',
              points: [
                { term: 'Three clause form', detail: 'The classic form with an initializer, condition, and post statement counts through a range of values just like a traditional for loop.' },
                { term: 'While style', detail: 'Writing for with only a condition behaves like a while loop, repeating until the condition becomes false.' },
                { term: 'Infinite loop', detail: 'A bare for with no clauses loops forever, so you exit it with break, return, or a condition inside the body.' },
                { term: 'Range iteration', detail: 'The range form walks slices, arrays, maps, strings, and channels, yielding index and value pairs as it goes.' },
                { term: 'Break and continue', detail: 'Break exits the loop entirely while continue skips to the next iteration, and labels let you target an outer loop.' },
              ],
            },
            example: `// Range over slice
nums := []int{2, 4, 6}
for idx, val := range nums {
    fmt.Println(idx, val)
}`,
          },
        ],
        children: [],
      },
    ],
  },

  // 6. Switch Statement
  {
    id: 'go-switch',
    title: 'Switch Statement',
    level: 1,
    slug: 'switch',
    concepts: [],
    children: [
      {
        id: 'go-switch-basic',
        title: 'Expression Switch',
        level: 2,
        slug: 'switch-basic',
        concepts: [
          {
            id: 'go-switch-intro',
            code: `switch day := time.Now().Weekday(); day {
case time.Saturday, time.Sunday:
    fmt.Println("Weekend")
default:
    fmt.Println("Weekday")
}`,
            note: 'Switch cases in Go do not fall through by default (no `break` needed). Use `fallthrough` keyword explicitly if you want fall-through behavior.',
            explanation: {
              heading: 'Expression switch behavior',
              intro: 'A switch in Go compares a value against a series of cases and runs the first that matches. Unlike C, cases do not fall into the next one, which removes a common source of bugs.',
              points: [
                { term: 'No implicit fallthrough', detail: 'Each case breaks automatically after running, so you do not write break and cannot accidentally run the next case.' },
                { term: 'Explicit fallthrough', detail: 'When you truly want the next case to run, the fallthrough keyword forces it, and it must be the last statement in the case.' },
                { term: 'Multiple values', detail: 'A single case can list several comma separated values, matching if the switch value equals any of them.' },
                { term: 'Initializer statement', detail: 'Like if, a switch can begin with a short statement whose variable is scoped to the whole switch.' },
                { term: 'Tagless switch', detail: 'Omitting the switch expression lets each case hold a boolean condition, which reads more cleanly than a long if else chain.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'go-switch-type',
        title: 'Type Switch',
        level: 2,
        slug: 'switch-type',
        concepts: [
          {
            id: 'go-type-switch',
            code: `func describe(i interface{}) string {
    switch v := i.(type) {
    case int:
        return fmt.Sprintf("int: %d", v)
    case string:
        return fmt.Sprintf("string: %q", v)
    default:
        return fmt.Sprintf("unknown: %T", v)
    }
}`,
            note: 'A type switch lets you branch on the dynamic type of an interface value. The variable `v` is already the asserted type inside each case.',
            explanation: {
              heading: 'Switching on dynamic type',
              intro: 'A type switch inspects the concrete type stored inside an interface value and branches accordingly. It is the safe, readable way to handle values whose type is only known at runtime.',
              points: [
                { term: 'The type assertion form', detail: 'Writing the assertion with the type keyword tells Go to match on the dynamic type rather than a value.' },
                { term: 'Bound variable', detail: 'The variable captured in the switch is already converted to the matched type inside each case, so no extra assertion is needed.' },
                { term: 'Default case', detail: 'A default branch handles any type you did not list explicitly, which is useful for logging unexpected inputs.' },
                { term: 'Multiple types per case', detail: 'Listing several types in one case keeps the bound variable as the interface type, since the exact type is ambiguous.' },
                { term: 'Common uses', detail: 'Type switches drive JSON decoding of unknown shapes, formatting helpers, and handling of the empty interface.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 7. Functions
  {
    id: 'go-functions',
    title: 'Functions',
    level: 1,
    slug: 'functions',
    concepts: [],
    children: [
      {
        id: 'go-func-basics',
        title: 'Function Basics',
        level: 2,
        slug: 'func-basics',
        concepts: [
          {
            id: 'go-func-declare',
            code: `func add(a, b int) int {
    return a + b
}

func greet(name string) string {
    return "Hello, " + name
}`,
            note: 'Functions are declared with `func`. Parameters of the same type can share a type annotation. The return type follows the parameter list.',
            explanation: {
              heading: 'Declaring functions',
              intro: 'Functions are the core building block of Go programs and are declared with the func keyword. The signature places parameter names before their types and lists the return type after the parameters.',
              points: [
                { term: 'Parameter syntax', detail: 'Each parameter is written as a name followed by its type, the reverse of some languages, which keeps declarations readable.' },
                { term: 'Shared type annotation', detail: 'Consecutive parameters of the same type can share one annotation, so two int parameters can be written together.' },
                { term: 'Return type placement', detail: 'The return type appears after the parameter list, and a function with no return simply omits it.' },
                { term: 'First class values', detail: 'Functions are values in Go, so they can be stored in variables, passed as arguments, and returned from other functions.' },
                { term: 'Exported names', detail: 'A function whose name starts with an uppercase letter is exported from its package, while a lowercase name stays private.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'go-named-returns',
        title: 'Named Return Values',
        level: 2,
        slug: 'named-returns',
        concepts: [
          {
            id: 'go-named-return-intro',
            code: `func divide(a, b float64) (result float64, err error) {
    if b == 0 {
        err = fmt.Errorf("division by zero")
        return
    }
    result = a / b
    return
}`,
            note: 'Named return values act as variables declared at the top of the function. A bare `return` sends back their current values. Use sparingly for clarity.',
            explanation: {
              heading: 'Named return values',
              intro: 'Go lets you name the values a function returns, which declares them as variables ready to use inside the body. This can clarify intent but is easy to overuse.',
              points: [
                { term: 'Declared automatically', detail: 'Named results behave like local variables initialized to their zero values at the start of the function.' },
                { term: 'Bare return', detail: 'A return with no arguments sends back the current values of the named results, which shortens simple functions.' },
                { term: 'Documentation value', detail: 'Good names on returns document what each value means, especially when a function returns several values of the same type.' },
                { term: 'Works with defer', detail: 'A deferred function can read and modify named results, which is how recover based error handling sets an error before returning.' },
                { term: 'Use sparingly', detail: 'Bare returns in long functions hurt readability, so reserve named results for short helpers or the defer pattern.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 8. Multiple Return Values
  {
    id: 'go-multiple-returns',
    title: 'Multiple Return Values',
    level: 1,
    slug: 'multiple-returns',
    concepts: [],
    children: [
      {
        id: 'go-multi-return-basic',
        title: 'Returning Multiple Values',
        level: 2,
        slug: 'multi-return-basic',
        concepts: [
          {
            id: 'go-multi-return-intro',
            code: `func swap(a, b string) (string, string) {
    return b, a
}

func main() {
    x, y := swap("hello", "world")
    fmt.Println(x, y)  // world hello
}`,
            note: 'Go functions can return multiple values. This is idiomatically used to return a result and an error, eliminating the need for exceptions.',
            explanation: {
              heading: 'Returning multiple values',
              intro: 'Go functions can return more than one value at once, a feature that shapes how the language handles errors and paired results. It removes the need for output parameters or exceptions.',
              points: [
                { term: 'Result and error pair', detail: 'The dominant convention returns a result plus an error, so the caller checks the error immediately after the call.' },
                { term: 'Comma ok idiom', detail: 'Map lookups, type assertions, and channel receives return a second boolean that reports whether the operation succeeded.' },
                { term: 'Blank identifier', detail: 'Assigning an unwanted return to the underscore tells the compiler you intentionally ignore it, avoiding an unused variable error.' },
                { term: 'Parallel assignment', detail: 'Multiple returns pair naturally with multiple assignment, letting you capture every value in a single statement.' },
                { term: 'No exceptions needed', detail: 'Because errors travel as ordinary return values, control flow stays explicit and easy to follow.' },
              ],
            },
            example: `// Ignoring a return value with blank identifier
val, _ := strconv.Atoi("42")`,
          },
        ],
        children: [],
      },
    ],
  },

  // 9. Variadic Functions
  {
    id: 'go-variadic',
    title: 'Variadic Functions',
    level: 1,
    slug: 'variadic',
    concepts: [],
    children: [
      {
        id: 'go-variadic-basic',
        title: 'Variadic Parameters',
        level: 2,
        slug: 'variadic-params',
        concepts: [
          {
            id: 'go-variadic-intro',
            code: `func sum(nums ...int) int {
    total := 0
    for _, n := range nums {
        total += n
    }
    return total
}

fmt.Println(sum(1, 2, 3))      // 6
fmt.Println(sum([]int{4,5}...)) // 9 — spread a slice`,
            note: 'The `...` before the type makes the last parameter variadic. Inside the function it behaves as a slice. Spread an existing slice with `slice...`.',
            explanation: {
              heading: 'Functions with variable arguments',
              intro: 'A variadic function accepts any number of trailing arguments of a given type. Inside the body those arguments are collected into a slice, so you handle them with ordinary slice operations.',
              points: [
                { term: 'The ellipsis parameter', detail: 'Placing three dots before the type of the final parameter lets callers pass zero, one, or many values of that type.' },
                { term: 'Behaves as a slice', detail: 'Within the function the variadic parameter is a regular slice, so you range over it and check its length normally.' },
                { term: 'Spreading a slice', detail: 'To pass an existing slice as the arguments, append three dots after it, which expands its elements into the call.' },
                { term: 'Must be last', detail: 'Only the final parameter can be variadic, since Go needs a fixed boundary for the preceding parameters.' },
                { term: 'Empty is valid', detail: 'Calling with no variadic arguments yields a nil slice, which is safe to range over and reports length zero.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 10. Closures
  {
    id: 'go-closures',
    title: 'Closures',
    level: 1,
    slug: 'closures',
    concepts: [],
    children: [
      {
        id: 'go-closure-basic',
        title: 'Function Closures',
        level: 2,
        slug: 'closure-basics',
        concepts: [
          {
            id: 'go-closure-intro',
            code: `func counter() func() int {
    count := 0
    return func() int {
        count++
        return count
    }
}

c := counter()
fmt.Println(c())  // 1
fmt.Println(c())  // 2`,
            note: 'A closure is a function value that references variables from outside its body. The function "closes over" those variables and retains access to them.',
            explanation: {
              heading: 'How closures capture state',
              intro: 'A closure is a function that remembers the variables from the scope where it was created, even after that scope has returned. This lets you build stateful function values without a struct.',
              points: [
                { term: 'Captures by reference', detail: 'A closure refers to the actual outer variable, not a copy, so changes it makes persist between calls.' },
                { term: 'Private state', detail: 'Because the captured variable is not visible elsewhere, a closure gives you encapsulated state like a counter or generator.' },
                { term: 'Each call fresh', detail: 'Every call to a factory function creates new captured variables, so two returned closures do not share state.' },
                { term: 'Loop variable pitfall', detail: 'Capturing a loop variable in older Go could share one variable across iterations, so pass it as an argument to be safe.' },
                { term: 'Common uses', detail: 'Closures power callbacks, deferred cleanup, middleware, and goroutine bodies that need access to surrounding data.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'go-anon-functions',
        title: 'Anonymous Functions',
        level: 2,
        slug: 'anonymous-functions',
        concepts: [
          {
            id: 'go-anon-func-intro',
            code: `// Immediately invoked
result := func(a, b int) int {
    return a + b
}(3, 4)

// Assigned to variable
double := func(n int) int { return n * 2 }
fmt.Println(double(5))  // 10`,
            note: 'Anonymous functions can be declared inline and either invoked immediately or assigned to a variable. They are often used as goroutine bodies or callbacks.',
            explanation: {
              heading: 'Functions without names',
              intro: 'An anonymous function is a function literal written inline without a declared name. It is handy wherever a short piece of behavior is needed close to where it is used.',
              points: [
                { term: 'Inline definition', detail: 'You write the full func literal at the point of use rather than declaring a named function elsewhere.' },
                { term: 'Immediate invocation', detail: 'Following the literal with an argument list calls it right away, which is useful for one time setup expressions.' },
                { term: 'Assign to variables', detail: 'Storing the literal in a variable lets you call it repeatedly and pass it around like any other value.' },
                { term: 'Goroutine bodies', detail: 'Anonymous functions are the usual way to start a goroutine that needs to capture surrounding variables.' },
                { term: 'Closures combined', detail: 'When an anonymous function references outer variables it becomes a closure, which is why the two ideas often appear together.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 11. Arrays
  {
    id: 'go-arrays',
    title: 'Arrays',
    level: 1,
    slug: 'arrays',
    concepts: [],
    children: [
      {
        id: 'go-array-basics',
        title: 'Array Fundamentals',
        level: 2,
        slug: 'array-basics',
        concepts: [
          {
            id: 'go-array-intro',
            code: `var a [5]int              // zero-valued array of 5 ints
b := [3]string{"go", "is", "fun"}
c := [...]int{1, 2, 3, 4} // compiler counts elements

fmt.Println(len(a))  // 5
a[0] = 42`,
            note: 'Arrays in Go have a fixed length that is part of the type. `[3]int` and `[5]int` are different types. Arrays are values — assigning copies all elements.',
            explanation: {
              heading: 'Fixed length arrays',
              intro: 'An array in Go holds a fixed number of elements of one type, and that length is baked into the type itself. Arrays are true values, which affects how they are copied and passed around.',
              points: [
                { term: 'Length is part of type', detail: 'An array of three ints is a different type from an array of five ints, so the size cannot change after declaration.' },
                { term: 'Value semantics', detail: 'Assigning or passing an array copies every element, so functions receive an independent copy unless you pass a pointer.' },
                { term: 'Compiler counting', detail: 'Using three dots as the length lets the compiler count the elements in the literal for you.' },
                { term: 'Rarely used directly', detail: 'Most Go code prefers slices for flexibility, reaching for arrays mainly for fixed size buffers or map keys.' },
                { term: 'Backing for slices', detail: 'Every slice is a view over an underlying array, so arrays quietly power much of Go collection handling.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 12. Slices
  {
    id: 'go-slices',
    title: 'Slices',
    level: 1,
    slug: 'slices',
    concepts: [],
    children: [
      {
        id: 'go-slice-basics',
        title: 'Slice Operations',
        level: 2,
        slug: 'slice-ops',
        concepts: [
          {
            id: 'go-slice-intro',
            code: `s := []int{1, 2, 3}
s = append(s, 4, 5)
fmt.Println(s)        // [1 2 3 4 5]
fmt.Println(len(s))   // 5
fmt.Println(cap(s))   // ≥ 5

sub := s[1:3]         // [2 3] — shares underlying array`,
            note: 'Slices are dynamically-sized views into arrays. They have length and capacity. `append` grows a slice, potentially allocating a new backing array.',
            explanation: {
              heading: 'Slices and their capacity',
              intro: 'A slice is a lightweight view into an underlying array described by a pointer, a length, and a capacity. This design makes slices flexible and cheap to pass while sharing storage.',
              points: [
                { term: 'Length versus capacity', detail: 'Length is how many elements the slice currently exposes, while capacity is how many the backing array can hold before a regrow.' },
                { term: 'Growing with append', detail: 'The append function adds elements, and when capacity runs out it allocates a larger array and copies the data over.' },
                { term: 'Shared backing array', detail: 'Slicing an existing slice shares the same storage, so writing through one view can be seen through another.' },
                { term: 'Make with capacity', detail: 'Preallocating with make and a capacity avoids repeated regrowth when you know roughly how many elements you will add.' },
                { term: 'Nil is usable', detail: 'A nil slice has length zero yet can be appended to safely, so you rarely need to initialize it explicitly first.' },
              ],
            },
            example: `// Make with length and capacity
buf := make([]byte, 0, 1024)
buf = append(buf, []byte("hello")...)`,
          },
        ],
        children: [],
      },
      {
        id: 'go-slice-patterns',
        title: 'Slice Patterns',
        level: 2,
        slug: 'slice-patterns',
        concepts: [
          {
            id: 'go-slice-copy-delete',
            code: `// Copy
src := []int{1, 2, 3}
dst := make([]int, len(src))
copy(dst, src)

// Delete element at index i
i := 1
s := []int{10, 20, 30, 40}
s = append(s[:i], s[i+1:]...)  // [10 30 40]`,
            note: 'Use `copy` to clone a slice without sharing memory. Delete elements by appending around the index. These are common idiomatic patterns.',
            explanation: {
              heading: 'Common slice idioms',
              intro: 'Because slices share their backing array, everyday tasks like cloning and deleting use specific idioms to avoid surprises. Learning them prevents accidental aliasing bugs.',
              points: [
                { term: 'Independent copy', detail: 'The copy builtin duplicates elements into a separate slice so later edits do not affect the original storage.' },
                { term: 'Sizing the destination', detail: 'Copy transfers only as many elements as fit in the shorter slice, so size the destination before copying.' },
                { term: 'Deleting an element', detail: 'Appending the tail after the index onto the head before it removes an element while preserving order.' },
                { term: 'Order not required', detail: 'When order does not matter, swapping the target with the last element and shrinking is faster than shifting.' },
                { term: 'Watch for leaks', detail: 'Slicing a large array to keep a small piece keeps the whole array alive, so copy out when you need only a fragment.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 13. Maps
  {
    id: 'go-maps',
    title: 'Maps',
    level: 1,
    slug: 'maps',
    concepts: [],
    children: [
      {
        id: 'go-map-basics',
        title: 'Map Operations',
        level: 2,
        slug: 'map-basics',
        concepts: [
          {
            id: 'go-map-intro',
            code: `m := map[string]int{
    "alice": 90,
    "bob":   85,
}

m["carol"] = 92         // insert
score, ok := m["dave"]  // check existence
if !ok {
    fmt.Println("dave not found")
}
delete(m, "bob")        // remove key`,
            note: 'Maps are hash tables mapping keys to values. Always check the second return value (`ok`) to distinguish a missing key from a zero value.',
            explanation: {
              heading: 'Working with maps',
              intro: 'A map is Go built in hash table associating unique keys with values. It offers fast lookup, insertion, and deletion but requires care around missing keys and initialization.',
              points: [
                { term: 'Create with make', detail: 'A map must be created with make or a literal before use, since writing to a nil map causes a panic.' },
                { term: 'Comma ok lookup', detail: 'Indexing returns the value and a boolean, and checking the boolean distinguishes a stored zero value from an absent key.' },
                { term: 'Delete builtin', detail: 'The delete function removes a key, and deleting a key that is not present is a harmless no operation.' },
                { term: 'Random iteration order', detail: 'Ranging over a map visits keys in an unspecified order that changes between runs, so sort keys when order matters.' },
                { term: 'Comparable keys only', detail: 'Keys must be a comparable type such as a string or number, so slices and other maps cannot serve as keys.' },
              ],
            },
            example: `// Iterate (order is random)
for k, v := range m {
    fmt.Printf("%s: %d\\n", k, v)
}`,
          },
        ],
        children: [],
      },
    ],
  },

  // 14. Structs
  {
    id: 'go-structs',
    title: 'Structs',
    level: 1,
    slug: 'structs',
    concepts: [],
    children: [
      {
        id: 'go-struct-define',
        title: 'Defining Structs',
        level: 2,
        slug: 'struct-define',
        concepts: [
          {
            id: 'go-struct-basics',
            code: `type User struct {
    Name  string
    Email string
    Age   int
}

u := User{Name: "Alice", Email: "alice@example.com", Age: 30}
fmt.Println(u.Name)

// Pointer to struct
p := &User{Name: "Bob"}
p.Age = 25  // automatic dereferencing`,
            note: 'Structs are composite types that group fields. Fields are accessed with dot notation. Go automatically dereferences struct pointers for field access.',
            explanation: {
              heading: 'Defining and using structs',
              intro: 'A struct groups related fields into a single composite type, forming the backbone of data modeling in Go. Structs are values, so understanding copies and pointers is important.',
              points: [
                { term: 'Field access', detail: 'You read and write fields with dot notation, and Go automatically dereferences a struct pointer so you do not write an explicit star.' },
                { term: 'Value semantics', detail: 'Assigning or passing a struct copies all its fields, so functions receive an independent copy unless you pass a pointer.' },
                { term: 'Composite literals', detail: 'You build a struct with a literal, and naming the fields makes the code robust against future field reordering.' },
                { term: 'Exported fields', detail: 'A field beginning with an uppercase letter is visible outside the package, which also controls what encoders can access.' },
                { term: 'Zero value ready', detail: 'A struct zero value sets each field to its own zero, which often makes the type usable without a constructor.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'go-struct-tags',
        title: 'Struct Tags',
        level: 2,
        slug: 'struct-tags',
        concepts: [
          {
            id: 'go-struct-tags-intro',
            code: `type Config struct {
    Host    string \`json:"host" env:"APP_HOST"\`
    Port    int    \`json:"port" env:"APP_PORT"\`
    Debug   bool   \`json:"debug,omitempty"\`
}`,
            note: 'Struct tags are string metadata attached to fields, commonly used by encoding/json, ORMs, and validation libraries via the `reflect` package.',
            explanation: {
              heading: 'Metadata with struct tags',
              intro: 'A struct tag is a short string literal placed after a field that libraries read at runtime through reflection. Tags let you control behavior like JSON naming without changing the field itself.',
              points: [
                { term: 'Key value format', detail: 'A tag holds space separated key value pairs, so one field can carry instructions for several libraries at once.' },
                { term: 'JSON control', detail: 'The json key renames a field in output and options like omitempty drop it when the value is empty.' },
                { term: 'Read by reflection', detail: 'Tags have no meaning to the compiler and are only interpreted by code that inspects them through the reflect package.' },
                { term: 'Wide library use', detail: 'Database mappers, form validators, and configuration loaders all rely on tags to map fields to external names.' },
                { term: 'Backtick literals', detail: 'Tags use backtick quoted strings so the embedded double quotes around each value do not need escaping.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 15. Methods
  {
    id: 'go-methods',
    title: 'Methods',
    level: 1,
    slug: 'methods',
    concepts: [],
    children: [
      {
        id: 'go-method-receivers',
        title: 'Value & Pointer Receivers',
        level: 2,
        slug: 'method-receivers',
        concepts: [
          {
            id: 'go-methods-intro',
            code: `type Rect struct {
    Width, Height float64
}

// Value receiver — does not mutate
func (r Rect) Area() float64 {
    return r.Width * r.Height
}

// Pointer receiver — can mutate
func (r *Rect) Scale(factor float64) {
    r.Width *= factor
    r.Height *= factor
}`,
            note: 'Value receivers get a copy of the struct. Pointer receivers can modify the original. Use pointer receivers when the method mutates state or the struct is large.',
            explanation: {
              heading: 'Value versus pointer receivers',
              intro: 'A method is a function with a receiver argument that binds it to a type. Choosing a value or pointer receiver decides whether the method can change the original and how the value is copied.',
              points: [
                { term: 'Value receiver copies', detail: 'A value receiver operates on a copy, so any changes it makes are lost when the method returns.' },
                { term: 'Pointer receiver mutates', detail: 'A pointer receiver works on the original value, which is required whenever the method needs to change state.' },
                { term: 'Large struct efficiency', detail: 'Pointer receivers avoid copying large structs on every call, which can matter for performance.' },
                { term: 'Consistency matters', detail: 'Mixing receiver kinds on one type is discouraged, so pick one style per type to keep the method set predictable.' },
                { term: 'Automatic addressing', detail: 'Go automatically takes the address of an addressable value when you call a pointer method, so the call site stays clean.' },
              ],
            },
            example: `r := Rect{3, 4}
r.Scale(2)
fmt.Println(r.Area())  // 24`,
          },
        ],
        children: [],
      },
    ],
  },

  // 16. Interfaces
  {
    id: 'go-interfaces',
    title: 'Interfaces',
    level: 1,
    slug: 'interfaces',
    concepts: [],
    children: [
      {
        id: 'go-interface-basics',
        title: 'Interface Basics',
        level: 2,
        slug: 'interface-basics',
        concepts: [
          {
            id: 'go-interface-intro',
            code: `type Shape interface {
    Area() float64
    Perimeter() float64
}

type Circle struct{ Radius float64 }

func (c Circle) Area() float64      { return math.Pi * c.Radius * c.Radius }
func (c Circle) Perimeter() float64 { return 2 * math.Pi * c.Radius }

// Circle implicitly satisfies Shape
var s Shape = Circle{Radius: 5}`,
            note: 'Interfaces are satisfied implicitly — no `implements` keyword. Any type that has the required methods automatically satisfies the interface.',
            explanation: {
              heading: 'Implicit interfaces',
              intro: 'An interface in Go lists a set of method signatures, and any type that provides those methods satisfies it automatically. This structural approach decouples code from concrete types.',
              points: [
                { term: 'No implements keyword', detail: 'Satisfaction is implicit, so a type conforms simply by having the required methods with no declaration linking them.' },
                { term: 'Small interfaces', detail: 'Idiomatic Go favors tiny interfaces, often a single method, which makes them easy to satisfy and compose.' },
                { term: 'Accept interfaces', detail: 'Functions that accept an interface can work with any conforming type, which improves testability and flexibility.' },
                { term: 'Dynamic dispatch', detail: 'Calling a method through an interface dispatches to the concrete type stored inside at runtime.' },
                { term: 'Define at the consumer', detail: 'Because satisfaction is implicit, interfaces are best declared where they are used rather than beside the implementing type.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'go-empty-interface',
        title: 'Empty Interface & Type Assertions',
        level: 2,
        slug: 'empty-interface',
        concepts: [
          {
            id: 'go-any-type',
            code: `func printAny(v any) {  // any == interface{}
    if s, ok := v.(string); ok {
        fmt.Println("string:", s)
    } else {
        fmt.Printf("other: %v\\n", v)
    }
}`,
            note: '`any` (alias for `interface{}`) can hold any value. Type assertions extract the concrete value. Always use the comma-ok form to avoid panics.',
            explanation: {
              heading: 'The empty interface and assertions',
              intro: 'The empty interface, spelled any since Go one eighteen, imposes no method requirements so it can hold a value of any type. Extracting the concrete value back out is done with a type assertion.',
              points: [
                { term: 'Holds anything', detail: 'Because it requires no methods, the any type accepts every value, which is useful for generic containers and printing helpers.' },
                { term: 'Type assertion', detail: 'An assertion attempts to recover the concrete type stored inside, giving back that value when the type matches.' },
                { term: 'Comma ok form', detail: 'Using the two result assertion returns a boolean instead of panicking when the type does not match, which is the safe choice.' },
                { term: 'Panic on mismatch', detail: 'The single result assertion panics if the stored type is wrong, so reserve it for cases you are certain about.' },
                { term: 'Prefer concrete types', detail: 'Overusing any discards compile time checking, so reach for it only when the type genuinely cannot be known in advance.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 17. Embedding & Composition
  {
    id: 'go-embedding',
    title: 'Embedding & Composition',
    level: 1,
    slug: 'embedding',
    concepts: [],
    children: [
      {
        id: 'go-struct-embedding',
        title: 'Struct Embedding',
        level: 2,
        slug: 'struct-embedding',
        concepts: [
          {
            id: 'go-embed-intro',
            code: `type Animal struct {
    Name string
}

func (a Animal) Speak() string {
    return a.Name + " speaks"
}

type Dog struct {
    Animal  // embedded — Dog "inherits" Animal's methods
    Breed string
}

d := Dog{Animal: Animal{Name: "Rex"}, Breed: "Labrador"}
fmt.Println(d.Speak())  // Rex speaks
fmt.Println(d.Name)     // Rex — promoted field`,
            note: 'Go uses composition over inheritance. Embedding promotes the embedded type\'s fields and methods to the outer type, enabling code reuse without class hierarchies.',
            explanation: {
              heading: 'Struct embedding',
              intro: 'Embedding places one type inside another without a field name, and the outer type gains the inner type fields and methods as if they were its own. This is how Go reuses code without inheritance.',
              points: [
                { term: 'Promoted members', detail: 'Fields and methods of the embedded type become directly accessible on the outer type through promotion.' },
                { term: 'Composition not inheritance', detail: 'Embedding models a has a relationship rather than an is a hierarchy, which keeps designs flat and flexible.' },
                { term: 'Method overriding', detail: 'Defining a method on the outer type with the same name shadows the promoted one, letting you customize behavior.' },
                { term: 'Interface satisfaction', detail: 'Promoted methods can satisfy an interface on the outer type, so embedding an implementer wires it up automatically.' },
                { term: 'Name conflicts', detail: 'When two embedded types share a member name you must qualify it explicitly to resolve the ambiguity.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'go-interface-embedding',
        title: 'Interface Embedding',
        level: 2,
        slug: 'interface-embedding',
        concepts: [
          {
            id: 'go-iface-embed',
            code: `type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

// Composed interface
type ReadWriter interface {
    Reader
    Writer
}`,
            note: 'Interfaces can embed other interfaces to compose larger contracts. This is how the standard library builds `io.ReadWriter` from `io.Reader` and `io.Writer`.',
            explanation: {
              heading: 'Composing interfaces',
              intro: 'An interface can embed other interfaces, and the resulting interface requires every method from all of them. This lets you build larger contracts out of small focused ones.',
              points: [
                { term: 'Method set union', detail: 'An embedding interface demands all the methods of each embedded interface combined into one set.' },
                { term: 'Standard library pattern', detail: 'The read writer interface is simply the reader and the writer embedded together, a model used throughout the standard library.' },
                { term: 'Keep pieces small', detail: 'Defining tiny interfaces and composing them keeps each concept reusable and easy to satisfy.' },
                { term: 'Satisfied by any type', detail: 'A concrete type satisfies the composed interface as long as it implements every required method, regardless of how the interface was built.' },
                { term: 'Cleaner than large interfaces', detail: 'Composition avoids duplicating method lists and keeps the relationships between contracts explicit.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 18. Pointers
  {
    id: 'go-pointers',
    title: 'Pointers',
    level: 1,
    slug: 'pointers',
    concepts: [],
    children: [
      {
        id: 'go-pointer-basics',
        title: 'Pointer Basics',
        level: 2,
        slug: 'pointer-basics',
        concepts: [
          {
            id: 'go-pointer-intro',
            code: `x := 42
p := &x         // p is *int, points to x
fmt.Println(*p) // 42 — dereference

*p = 100
fmt.Println(x)  // 100 — x was modified through p`,
            note: '`&` takes the address of a variable. `*` dereferences a pointer. Go has no pointer arithmetic, making pointers safer than in C/C++.',
            explanation: {
              heading: 'Pointers in Go',
              intro: 'A pointer stores the memory address of a value, letting you refer to and modify that value indirectly. Go pointers are deliberately restricted to keep memory access safe.',
              points: [
                { term: 'Address and dereference', detail: 'The ampersand operator takes the address of a variable and the star operator reads or writes the value it points to.' },
                { term: 'No pointer arithmetic', detail: 'Unlike C, Go forbids adding to or subtracting from a pointer, which removes a common source of memory corruption.' },
                { term: 'Nil pointer', detail: 'A pointer that points to nothing is nil, and dereferencing it panics, so guard against nil before use.' },
                { term: 'Allocating with new', detail: 'The new builtin allocates a zeroed value and returns a pointer to it, which is handy for creating addressable values.' },
                { term: 'Garbage collected', detail: 'The runtime tracks references and frees memory automatically, so you never manually free what a pointer references.' },
              ],
            },
            example: `// new() allocates and returns a pointer
n := new(int)   // *int pointing to 0
*n = 7`,
          },
        ],
        children: [],
      },
      {
        id: 'go-pointer-functions',
        title: 'Pointers in Functions',
        level: 2,
        slug: 'pointer-functions',
        concepts: [
          {
            id: 'go-pointer-param',
            code: `func increment(val *int) {
    *val++
}

count := 5
increment(&count)
fmt.Println(count)  // 6`,
            note: 'Pass a pointer to allow a function to modify the caller\'s variable. This avoids copying large structs and enables in-place mutation.',
            explanation: {
              heading: 'Passing pointers to functions',
              intro: 'Go passes every argument by value, so a function normally receives a copy it cannot use to change the original. Passing a pointer instead lets the function reach back and modify the caller value.',
              points: [
                { term: 'Everything is copied', detail: 'Arguments are copied on each call, so mutating a plain value parameter affects only the local copy.' },
                { term: 'Pointer enables mutation', detail: 'Passing the address lets the function dereference it and write changes that the caller can see afterward.' },
                { term: 'Avoiding large copies', detail: 'Passing a pointer to a big struct skips copying all its fields, which can improve performance.' },
                { term: 'Nil safety', detail: 'A pointer parameter can be nil, so a function should check before dereferencing to avoid a panic.' },
                { term: 'Slices and maps', detail: 'Slices and maps already hold internal references, so they can be modified without an explicit pointer parameter.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 19. Goroutines
  {
    id: 'go-goroutines',
    title: 'Goroutines',
    level: 1,
    slug: 'goroutines',
    concepts: [],
    children: [
      {
        id: 'go-goroutine-basics',
        title: 'Launching Goroutines',
        level: 2,
        slug: 'goroutine-basics',
        concepts: [
          {
            id: 'go-goroutine-intro',
            code: `func worker(id int) {
    fmt.Printf("Worker %d started\\n", id)
    time.Sleep(time.Second)
    fmt.Printf("Worker %d done\\n", id)
}

func main() {
    for i := 1; i <= 3; i++ {
        go worker(i)  // launches concurrently
    }
    time.Sleep(2 * time.Second)  // wait (use sync.WaitGroup in real code)
}`,
            note: 'Goroutines are lightweight concurrent functions launched with the `go` keyword. They run on a small stack (~2KB) and are multiplexed onto OS threads by the Go scheduler.',
            explanation: {
              heading: 'Lightweight concurrency',
              intro: 'A goroutine is a function running concurrently with others, started by placing the go keyword before a call. Goroutines are cheap, so a program can run thousands at once.',
              points: [
                { term: 'The go keyword', detail: 'Prefixing a call with go launches it as an independent goroutine and returns immediately without waiting for it.' },
                { term: 'Tiny stacks', detail: 'Each goroutine starts with a small stack of a few kilobytes that grows and shrinks as needed, unlike heavy OS threads.' },
                { term: 'Scheduler multiplexing', detail: 'The Go runtime multiplexes many goroutines onto a smaller pool of operating system threads for efficiency.' },
                { term: 'Need synchronization', detail: 'The main function does not wait for goroutines, so use a wait group or channel to keep the program alive until they finish.' },
                { term: 'Communicate safely', detail: 'Share data between goroutines through channels rather than shared memory to avoid races.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 20. Channels
  {
    id: 'go-channels',
    title: 'Channels',
    level: 1,
    slug: 'channels',
    concepts: [],
    children: [
      {
        id: 'go-channel-basics',
        title: 'Channel Fundamentals',
        level: 2,
        slug: 'channel-basics',
        concepts: [
          {
            id: 'go-chan-intro',
            code: `ch := make(chan string)

go func() {
    ch <- "hello"  // send
}()

msg := <-ch  // receive (blocks until value available)
fmt.Println(msg)`,
            note: 'Channels are typed conduits for communication between goroutines. Sends block until a receiver is ready (for unbuffered channels), providing synchronization.',
            explanation: {
              heading: 'Communicating through channels',
              intro: 'A channel is a typed pipe that lets goroutines send and receive values safely. Channels are the primary way Go encourages sharing by communicating rather than by locking shared memory.',
              points: [
                { term: 'Send and receive', detail: 'The arrow operator sends a value into a channel or receives one out of it, carrying data between goroutines.' },
                { term: 'Unbuffered synchronizes', detail: 'An unbuffered channel makes a send block until a receiver is ready, which synchronizes the two goroutines at that point.' },
                { term: 'Buffered channels', detail: 'Giving make a capacity creates a buffer, so sends only block when the buffer is full and receives only block when it is empty.' },
                { term: 'Closing a channel', detail: 'Closing signals that no more values will be sent, and receivers can detect this through the second return value.' },
                { term: 'Zero value nil', detail: 'A nil channel blocks forever on send and receive, so always create channels with make before use.' },
              ],
            },
            example: `// Buffered channel — non-blocking until full
bch := make(chan int, 3)
bch <- 1
bch <- 2
fmt.Println(<-bch)  // 1`,
          },
        ],
        children: [],
      },
      {
        id: 'go-channel-direction',
        title: 'Directional Channels',
        level: 2,
        slug: 'channel-direction',
        concepts: [
          {
            id: 'go-chan-direction',
            code: `func producer(out chan<- int) {  // send-only
    for i := 0; i < 5; i++ {
        out <- i
    }
    close(out)
}

func consumer(in <-chan int) {  // receive-only
    for val := range in {
        fmt.Println(val)
    }
}`,
            note: 'Channel direction constraints (`chan<-` send-only, `<-chan` receive-only) provide compile-time safety. `range` over a channel iterates until it is closed.',
            explanation: {
              heading: 'Restricting channel direction',
              intro: 'A function parameter can constrain a channel to be send only or receive only, which documents intent and lets the compiler catch misuse. A bidirectional channel converts to either restricted form automatically.',
              points: [
                { term: 'Send only type', detail: 'A channel written with the arrow pointing into it can only be sent on, so a producer cannot accidentally receive.' },
                { term: 'Receive only type', detail: 'A channel written with the arrow pointing out can only be received from, which suits a consumer function.' },
                { term: 'Compile time safety', detail: 'Directional types turn a whole class of concurrency mistakes into compile errors rather than runtime bugs.' },
                { term: 'Range until closed', detail: 'Ranging over a channel yields values until it is closed, making it a clean way to drain a producer.' },
                { term: 'Automatic narrowing', detail: 'A regular bidirectional channel converts implicitly to a directional one when passed to such a parameter.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 21. Select Statement
  {
    id: 'go-select',
    title: 'Select Statement',
    level: 1,
    slug: 'select',
    concepts: [],
    children: [
      {
        id: 'go-select-basics',
        title: 'Select Basics',
        level: 2,
        slug: 'select-basics',
        concepts: [
          {
            id: 'go-select-intro',
            code: `ch1 := make(chan string)
ch2 := make(chan string)

go func() { time.Sleep(100 * time.Millisecond); ch1 <- "one" }()
go func() { time.Sleep(200 * time.Millisecond); ch2 <- "two" }()

select {
case msg := <-ch1:
    fmt.Println("Received", msg)
case msg := <-ch2:
    fmt.Println("Received", msg)
case <-time.After(1 * time.Second):
    fmt.Println("timeout")
}`,
            note: '`select` lets a goroutine wait on multiple channel operations simultaneously. It blocks until one case is ready; if multiple are ready, one is chosen at random.',
            explanation: {
              heading: 'Waiting on many channels',
              intro: 'The select statement lets a goroutine wait on several channel operations at once and proceed with whichever becomes ready first. It is the switch statement of concurrency.',
              points: [
                { term: 'Blocks until ready', detail: 'Select waits until at least one of its cases can proceed, then runs that case body.' },
                { term: 'Random when tied', detail: 'If several cases are ready at the same time, select picks one at random, which prevents starvation.' },
                { term: 'Timeout with after', detail: 'Adding a case that receives from a timer channel implements a clean timeout on the whole operation.' },
                { term: 'Cancellation', detail: 'Selecting on a context done channel lets a goroutine stop promptly when its work is cancelled.' },
                { term: 'One case per turn', detail: 'Each execution of select handles exactly one case, so wrap it in a loop to keep servicing channels.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'go-select-default',
        title: 'Non-Blocking Select',
        level: 2,
        slug: 'select-default',
        concepts: [
          {
            id: 'go-select-nonblock',
            code: `select {
case msg := <-ch:
    fmt.Println(msg)
default:
    fmt.Println("no message available")
}`,
            note: 'Adding a `default` case makes `select` non-blocking. This is useful for polling channels or implementing try-send/try-receive patterns.',
            explanation: {
              heading: 'Non blocking channel operations',
              intro: 'Adding a default case to a select gives it something to do when no channel is ready, so it never blocks. This turns select into a try style operation.',
              points: [
                { term: 'Default runs immediately', detail: 'When no other case is ready the default branch executes at once, so the goroutine keeps moving.' },
                { term: 'Try receive', detail: 'A non blocking select lets you take a value only if one is waiting, otherwise you fall through to default.' },
                { term: 'Try send', detail: 'The same pattern attempts a send and gives up gracefully if the channel cannot accept a value right now.' },
                { term: 'Polling', detail: 'Wrapping a non blocking select in a loop polls channels, though a plain blocking receive is usually preferable when possible.' },
                { term: 'Avoid busy loops', detail: 'A tight loop with default can spin the CPU, so add a small sleep or prefer blocking select when you can.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 22. Sync Package
  {
    id: 'go-sync',
    title: 'Sync Package',
    level: 1,
    slug: 'sync',
    concepts: [],
    children: [
      {
        id: 'go-waitgroup',
        title: 'WaitGroup',
        level: 2,
        slug: 'waitgroup',
        concepts: [
          {
            id: 'go-waitgroup-intro',
            code: `var wg sync.WaitGroup

for i := 0; i < 5; i++ {
    wg.Add(1)
    go func(id int) {
        defer wg.Done()
        fmt.Printf("Worker %d\\n", id)
    }(i)
}

wg.Wait()  // blocks until all goroutines call Done()`,
            note: '`sync.WaitGroup` waits for a collection of goroutines to finish. Call `Add` before launching, `Done` when finished, and `Wait` to block until the counter reaches zero.',
            explanation: {
              heading: 'Waiting for goroutines to finish',
              intro: 'A wait group is a counter that lets one goroutine wait for a set of others to complete. It is the standard way to know when concurrent work has finished.',
              points: [
                { term: 'Add before launch', detail: 'Call Add with the number of goroutines before starting them so the counter is set before any of them finish.' },
                { term: 'Done when complete', detail: 'Each goroutine calls Done when it finishes, which decrements the counter, and deferring it guarantees the call happens.' },
                { term: 'Wait blocks', detail: 'The Wait method blocks the caller until the counter returns to zero, signalling that all work is done.' },
                { term: 'Pass by pointer', detail: 'A wait group must be shared by pointer, since copying it would split the counter and break the coordination.' },
                { term: 'No negative counter', detail: 'Calling Done more times than Add drives the counter below zero and panics, so keep the calls balanced.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'go-mutex',
        title: 'Mutex',
        level: 2,
        slug: 'mutex',
        concepts: [
          {
            id: 'go-mutex-intro',
            code: `type SafeCounter struct {
    mu sync.Mutex
    v  map[string]int
}

func (c *SafeCounter) Inc(key string) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.v[key]++
}

func (c *SafeCounter) Value(key string) int {
    c.mu.Lock()
    defer c.mu.Unlock()
    return c.v[key]
}`,
            note: '`sync.Mutex` provides mutual exclusion. Always use `defer mu.Unlock()` right after locking to guarantee release even if a panic occurs.',
            explanation: {
              heading: 'Protecting shared state',
              intro: 'A mutex enforces mutual exclusion so that only one goroutine touches shared data at a time. It is the tool to reach for when communication through channels does not fit.',
              points: [
                { term: 'Lock and unlock', detail: 'Calling Lock blocks other goroutines until the holder calls Unlock, creating a critical section around shared state.' },
                { term: 'Defer the unlock', detail: 'Deferring Unlock right after Lock guarantees release even if the function returns early or panics.' },
                { term: 'Guards the data', detail: 'A mutex is usually embedded beside the data it protects so the pairing between lock and state is clear.' },
                { term: 'Read write variant', detail: 'A read write mutex allows many concurrent readers but a single writer, which helps read heavy workloads.' },
                { term: 'Do not copy', detail: 'Copying a mutex after use breaks its guarantees, so share the struct that holds it by pointer.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 23. Context
  {
    id: 'go-context',
    title: 'Context',
    level: 1,
    slug: 'context',
    concepts: [],
    children: [
      {
        id: 'go-context-basics',
        title: 'Context Basics',
        level: 2,
        slug: 'context-basics',
        concepts: [
          {
            id: 'go-context-intro',
            code: `func fetchData(ctx context.Context, url string) error {
    req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
    if err != nil {
        return err
    }
    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return err
    }
    defer resp.Body.Close()
    return nil
}`,
            note: 'Context carries deadlines, cancellation signals, and request-scoped values across API boundaries. Always pass it as the first parameter.',
            explanation: {
              heading: 'Carrying request scope',
              intro: 'A context threads deadlines, cancellation, and request scoped values through a call chain. It is the standard mechanism for controlling and cleaning up long running or networked operations.',
              points: [
                { term: 'First parameter', detail: 'By convention a context is the first argument to any function that performs cancellable or deadline bound work.' },
                { term: 'Propagates cancellation', detail: 'When a parent context is cancelled, every derived context is cancelled too, stopping work down the chain.' },
                { term: 'Deadlines and timeouts', detail: 'A context can carry a deadline so operations abort automatically when they run out of time.' },
                { term: 'Request values sparingly', detail: 'It can hold request scoped values such as a trace id, but it should not carry optional parameters or configuration.' },
                { term: 'Do not store', detail: 'A context is meant to flow through calls rather than be stored in a struct, which keeps its lifetime clear.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'go-context-cancel',
        title: 'Cancellation & Timeout',
        level: 2,
        slug: 'context-cancel',
        concepts: [
          {
            id: 'go-context-timeout',
            code: `ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

select {
case result := <-doWork(ctx):
    fmt.Println(result)
case <-ctx.Done():
    fmt.Println("timed out:", ctx.Err())
}`,
            note: '`WithTimeout` and `WithCancel` create derived contexts. Always `defer cancel()` to release resources. Check `ctx.Done()` in long-running operations.',
            explanation: {
              heading: 'Cancellation and timeouts',
              intro: 'Derived contexts let you attach a cancel function or a time limit to a piece of work. Reacting to their done channel is how goroutines stop cleanly instead of leaking.',
              points: [
                { term: 'With cancel', detail: 'The cancel constructor returns a function you call to stop the operation manually when it is no longer needed.' },
                { term: 'With timeout', detail: 'The timeout constructor cancels the context automatically after a duration, which bounds how long work can run.' },
                { term: 'Always defer cancel', detail: 'Deferring the returned cancel function releases the associated resources even when the operation finishes early.' },
                { term: 'Watch the done channel', detail: 'Long running loops should select on the done channel so they exit promptly once the context is cancelled.' },
                { term: 'Inspect the error', detail: 'After done fires, the context error reports whether it was cancelled or the deadline was exceeded.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 24. Error Handling
  {
    id: 'go-errors',
    title: 'Error Handling',
    level: 1,
    slug: 'errors',
    concepts: [],
    children: [
      {
        id: 'go-error-basics',
        title: 'Error Basics',
        level: 2,
        slug: 'error-basics',
        concepts: [
          {
            id: 'go-error-intro',
            code: `func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("cannot divide %f by zero", a)
    }
    return a / b, nil
}

result, err := divide(10, 0)
if err != nil {
    log.Fatal(err)
}`,
            note: 'Go handles errors explicitly via return values rather than exceptions. The convention is to return an error as the last value and check it immediately.',
            explanation: {
              heading: 'Explicit error handling',
              intro: 'Go treats errors as ordinary values returned from functions rather than exceptions thrown up the stack. This makes failure paths visible and forces the caller to decide what to do.',
              points: [
                { term: 'Error as last return', detail: 'The convention places an error as the final return value, so a caller checks it right after the call.' },
                { term: 'Nil means success', detail: 'A nil error signals success, so the common pattern tests whether the error is not nil before proceeding.' },
                { term: 'The error interface', detail: 'An error is any value with an Error method returning a string, so custom types can carry extra detail.' },
                { term: 'Create with helpers', detail: 'The errors package and the formatting helper build simple error values with a descriptive message.' },
                { term: 'Handle or return', detail: 'At each level you either handle the error or return it upward, which keeps responsibility explicit.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'go-custom-errors',
        title: 'Custom Errors & Wrapping',
        level: 2,
        slug: 'custom-errors',
        concepts: [
          {
            id: 'go-error-wrap',
            code: `type NotFoundError struct {
    ID string
}

func (e *NotFoundError) Error() string {
    return fmt.Sprintf("resource %s not found", e.ID)
}

// Wrapping errors (Go 1.13+)
if err != nil {
    return fmt.Errorf("fetching user: %w", err)
}

// Unwrapping
if errors.Is(err, os.ErrNotExist) { /* handle */ }

var nfe *NotFoundError
if errors.As(err, &nfe) { /* access nfe.ID */ }`,
            note: 'Use `%w` to wrap errors preserving the chain. `errors.Is` checks for a specific error value. `errors.As` checks for a specific error type in the chain.',
            explanation: {
              heading: 'Custom and wrapped errors',
              intro: 'You can define your own error types and wrap lower level errors to add context while preserving the original. The errors package then lets you inspect the chain safely.',
              points: [
                { term: 'Custom error type', detail: 'Any type with an Error method becomes an error, letting you attach structured fields such as an identifier.' },
                { term: 'Wrapping with percent w', detail: 'The wrapping verb embeds the original error inside a new message so the underlying cause stays reachable.' },
                { term: 'Checking with Is', detail: 'The Is helper walks the chain to test whether it matches a specific sentinel error value.' },
                { term: 'Extracting with As', detail: 'The As helper searches the chain for a particular error type and copies it out so you can read its fields.' },
                { term: 'Add context not noise', detail: 'Wrap with a short phrase describing what failed, which builds a readable trail without repeating information.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 25. Panic & Recover
  {
    id: 'go-panic-recover',
    title: 'Panic & Recover',
    level: 1,
    slug: 'panic-recover',
    concepts: [],
    children: [
      {
        id: 'go-panic-basics',
        title: 'Panic',
        level: 2,
        slug: 'panic-basics',
        concepts: [
          {
            id: 'go-panic-intro',
            code: `func mustEnv(key string) string {
    val := os.Getenv(key)
    if val == "" {
        panic(fmt.Sprintf("required env var %s not set", key))
    }
    return val
}`,
            note: '`panic` stops normal execution, runs deferred functions, then terminates the program. Use it only for truly unrecoverable situations, not for normal error handling.',
            explanation: {
              heading: 'When panic happens',
              intro: 'A panic halts the normal flow of a function, unwinds the stack while running deferred calls, and crashes the program if nothing recovers. It is reserved for situations a program cannot sensibly continue past.',
              points: [
                { term: 'Stops normal flow', detail: 'Once a panic starts, the current function stops executing and control begins unwinding up the call stack.' },
                { term: 'Runs deferred calls', detail: 'Deferred functions still run during the unwind, which gives cleanup and recovery a chance to act.' },
                { term: 'Reserve for the fatal', detail: 'Use panic only for truly unrecoverable states such as a broken invariant, not for expected errors like bad input.' },
                { term: 'Runtime panics', detail: 'The runtime itself panics on events like a nil dereference or an out of range index.' },
                { term: 'Prefer errors', detail: 'For ordinary failures return an error value instead, keeping control flow explicit and testable.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'go-recover-basics',
        title: 'Recover',
        level: 2,
        slug: 'recover-basics',
        concepts: [
          {
            id: 'go-recover-intro',
            code: `func safeDiv(a, b int) (result int, err error) {
    defer func() {
        if r := recover(); r != nil {
            err = fmt.Errorf("recovered: %v", r)
        }
    }()
    return a / b, nil  // panics if b == 0
}

val, err := safeDiv(10, 0)
fmt.Println(val, err)  // 0 recovered: runtime error: integer divide by zero`,
            note: '`recover` catches a panic inside a deferred function, preventing program termination. It returns the value passed to `panic` or nil if not panicking.',
            explanation: {
              heading: 'Recovering from a panic',
              intro: 'The recover builtin regains control of a panicking goroutine, but only when called from inside a deferred function. It lets a program turn a panic into a handled error instead of crashing.',
              points: [
                { term: 'Only inside defer', detail: 'Recover has an effect only when called directly from a deferred function during a panic, and returns nil otherwise.' },
                { term: 'Returns the panic value', detail: 'When it stops a panic, recover returns whatever value was passed to panic so you can inspect the cause.' },
                { term: 'Convert to error', detail: 'A common pattern assigns the recovered value to a named error return, turning a panic into a normal failure.' },
                { term: 'Guard boundaries', detail: 'Recovering at a server or worker boundary keeps one bad request from taking down the whole process.' },
                { term: 'Do not overuse', detail: 'Routine control flow should still use errors, reserving recover for isolating unexpected panics.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 26. Generics
  {
    id: 'go-generics',
    title: 'Generics',
    level: 1,
    slug: 'generics',
    concepts: [],
    children: [
      {
        id: 'go-generic-functions',
        title: 'Generic Functions',
        level: 2,
        slug: 'generic-functions',
        concepts: [
          {
            id: 'go-generic-func',
            code: `func Map[T any, U any](slice []T, fn func(T) U) []U {
    result := make([]U, len(slice))
    for i, v := range slice {
        result[i] = fn(v)
    }
    return result
}

doubled := Map([]int{1, 2, 3}, func(n int) int { return n * 2 })`,
            note: 'Go 1.18+ supports type parameters. Generic functions use brackets `[T constraint]` before the parameter list. `any` is the unconstrained type.',
            explanation: {
              heading: 'Writing generic functions',
              intro: 'Generics let a function work over many types while keeping full compile time type checking. Type parameters are declared in brackets before the ordinary parameter list.',
              points: [
                { term: 'Type parameters', detail: 'The bracketed list names one or more type parameters and the constraint each must satisfy.' },
                { term: 'Constraint required', detail: 'Every type parameter needs a constraint, and any serves when the function places no requirement on the type.' },
                { term: 'Inference', detail: 'The compiler usually infers the type arguments from the ordinary arguments, so callers rarely spell them out.' },
                { term: 'Avoid over generalizing', detail: 'Reach for generics only when a concrete type or an interface does not express the reuse cleanly.' },
                { term: 'One implementation', detail: 'A single generic function replaces near duplicate copies written for each type, reducing maintenance.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'go-generic-constraints',
        title: 'Type Constraints',
        level: 2,
        slug: 'generic-constraints',
        concepts: [
          {
            id: 'go-constraints-intro',
            code: `type Number interface {
    ~int | ~float64 | ~int64
}

func Sum[T Number](nums []T) T {
    var total T
    for _, n := range nums {
        total += n
    }
    return total
}

fmt.Println(Sum([]int{1, 2, 3}))        // 6
fmt.Println(Sum([]float64{1.1, 2.2}))   // 3.3`,
            note: 'Constraints are interfaces that restrict type parameters. The `~` prefix includes underlying types (e.g., `type MyInt int` satisfies `~int`). Use `comparable` for == support.',
            explanation: {
              heading: 'Constraining type parameters',
              intro: 'A constraint is an interface that limits which types a generic can accept and what operations are allowed on them. Constraints turn a wide open type parameter into a precise contract.',
              points: [
                { term: 'Interfaces as constraints', detail: 'A constraint is written as an interface, either listing methods or listing the concrete types that are allowed.' },
                { term: 'Type sets with union', detail: 'A constraint can list several types joined by the pipe symbol, permitting any of them as the argument.' },
                { term: 'The tilde form', detail: 'Prefixing a type with a tilde also admits any type whose underlying type matches, so named integer types still qualify.' },
                { term: 'Comparable', detail: 'The built in comparable constraint allows equality comparison, which is needed for map keys and equality checks.' },
                { term: 'Enables operators', detail: 'Restricting to numeric types lets the generic body use arithmetic operators that would be illegal on an arbitrary type.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 27. Reflection
  {
    id: 'go-reflection',
    title: 'Reflection',
    level: 1,
    slug: 'reflection',
    concepts: [],
    children: [
      {
        id: 'go-reflect-basics',
        title: 'Reflect Package',
        level: 2,
        slug: 'reflect-basics',
        concepts: [
          {
            id: 'go-reflect-intro',
            code: `import "reflect"

func inspect(v any) {
    t := reflect.TypeOf(v)
    val := reflect.ValueOf(v)

    fmt.Println("Type:", t)
    fmt.Println("Kind:", t.Kind())
    fmt.Println("Value:", val)

    if t.Kind() == reflect.Struct {
        for i := 0; i < t.NumField(); i++ {
            fmt.Printf("  %s: %v\\n", t.Field(i).Name, val.Field(i))
        }
    }
}`,
            note: 'The `reflect` package provides runtime type introspection. Use it sparingly — it is slower than static code and bypasses compile-time type safety.',
            explanation: {
              heading: 'Runtime type introspection',
              intro: 'The reflect package inspects and manipulates values whose types are not known until runtime. It powers general purpose libraries but sacrifices speed and compile time safety.',
              points: [
                { term: 'Type and value', detail: 'The type and value functions expose a value dynamic type and its contents for examination at runtime.' },
                { term: 'Kind classification', detail: 'The kind reports the broad category such as struct or slice, which guides how you walk the value.' },
                { term: 'Reading struct fields', detail: 'Reflection can enumerate struct fields and their tags, which is how encoders map fields to external names.' },
                { term: 'Performance cost', detail: 'Reflective code is slower than direct code and harder to read, so prefer static solutions when possible.' },
                { term: 'Bypasses the compiler', detail: 'Because checks move to runtime, mistakes surface as panics rather than compile errors, so use it carefully.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 28. Modules & Packages
  {
    id: 'go-modules',
    title: 'Modules & Packages',
    level: 1,
    slug: 'modules',
    concepts: [],
    children: [
      {
        id: 'go-module-init',
        title: 'Module Basics',
        level: 2,
        slug: 'module-init',
        concepts: [
          {
            id: 'go-mod-intro',
            code: `// Initialize a module
// $ go mod init github.com/user/myproject

// go.mod file
module github.com/user/myproject

go 1.21

require (
    github.com/gin-gonic/gin v1.9.1
)`,
            note: 'Go modules manage dependencies. `go mod init` creates a module. `go get` adds dependencies. `go mod tidy` removes unused ones and adds missing ones.',
            explanation: {
              heading: 'Managing dependencies with modules',
              intro: 'A module is a collection of packages versioned together and described by a go mod file. Modules give Go reproducible builds with explicit dependency versions.',
              points: [
                { term: 'Initialize a module', detail: 'The mod init command creates the go mod file and records the module path used as the import prefix.' },
                { term: 'The go mod file', detail: 'This file lists the module path, the Go version, and each required dependency with its selected version.' },
                { term: 'Adding dependencies', detail: 'Fetching a package with go get records it in the module file and downloads it into the local cache.' },
                { term: 'Tidying', detail: 'The mod tidy command adds any missing requirements and removes ones no longer imported, keeping the file accurate.' },
                { term: 'Reproducible builds', detail: 'A companion sum file records cryptographic hashes so every build resolves to the exact same dependency code.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'go-package-structure',
        title: 'Package Organization',
        level: 2,
        slug: 'package-structure',
        concepts: [
          {
            id: 'go-pkg-struct',
            code: `// project layout
// myproject/
// ├── go.mod
// ├── main.go           (package main)
// ├── internal/         (private to module)
// │   └── auth/
// │       └── auth.go   (package auth)
// └── pkg/              (public libraries)
//     └── util/
//         └── util.go   (package util)

// Exported names start with uppercase
package util

func FormatName(first, last string) string {
    return first + " " + last
}`,
            note: 'Each directory is a package. Exported identifiers start with an uppercase letter. The `internal/` directory restricts imports to the parent module only.',
            explanation: {
              heading: 'Organizing packages',
              intro: 'Go maps each directory to one package and controls visibility by the case of identifier names. A clear layout keeps large projects understandable and enforces boundaries.',
              points: [
                { term: 'Directory equals package', detail: 'All Go files in a directory belong to the same package, and the directory name usually matches the package name.' },
                { term: 'Exported by case', detail: 'An identifier starting with an uppercase letter is visible to other packages, while a lowercase one stays private.' },
                { term: 'The internal directory', detail: 'Code under an internal directory can be imported only by packages rooted at its parent, hiding implementation details.' },
                { term: 'Main package', detail: 'The special main package with a main function produces an executable rather than an importable library.' },
                { term: 'Small focused packages', detail: 'Grouping related functionality into cohesive packages reduces coupling and makes dependencies easier to reason about.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 29. Testing
  {
    id: 'go-testing',
    title: 'Testing',
    level: 1,
    slug: 'testing',
    concepts: [],
    children: [
      {
        id: 'go-test-basics',
        title: 'Unit Tests',
        level: 2,
        slug: 'test-basics',
        concepts: [
          {
            id: 'go-test-intro',
            code: `// math_test.go
package math

import "testing"

func TestAdd(t *testing.T) {
    got := Add(2, 3)
    want := 5
    if got != want {
        t.Errorf("Add(2, 3) = %d; want %d", got, want)
    }
}

// Run: go test ./...`,
            note: 'Test files end in `_test.go` and live alongside the code. Test functions start with `Test` and take `*testing.T`. Run with `go test`.',
            explanation: {
              heading: 'Writing unit tests',
              intro: 'Go ships testing as part of the standard toolchain, so tests live beside the code and run with a single command. The conventions are simple and require no external framework.',
              points: [
                { term: 'Test file naming', detail: 'A file whose name ends in underscore test dot go holds tests and is excluded from normal builds.' },
                { term: 'Test function shape', detail: 'A test is a function beginning with Test that takes a testing pointer used to report failures.' },
                { term: 'Reporting failures', detail: 'Calling the error method records a failure and continues, while the fatal method stops the current test immediately.' },
                { term: 'Running tests', detail: 'The go test command compiles and runs the tests, and adding the recursive path pattern covers the whole module.' },
                { term: 'No assertions library', detail: 'Idiomatic Go compares values with plain if statements rather than an assertion library, keeping tests explicit.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'go-table-tests',
        title: 'Table-Driven Tests',
        level: 2,
        slug: 'table-tests',
        concepts: [
          {
            id: 'go-table-test-intro',
            code: `func TestDivide(t *testing.T) {
    tests := []struct {
        name    string
        a, b    float64
        want    float64
        wantErr bool
    }{
        {"normal", 10, 2, 5, false},
        {"divide by zero", 10, 0, 0, true},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got, err := Divide(tt.a, tt.b)
            if (err != nil) != tt.wantErr {
                t.Fatalf("error = %v, wantErr %v", err, tt.wantErr)
            }
            if got != tt.want {
                t.Errorf("got %f, want %f", got, tt.want)
            }
        })
    }
}`,
            note: 'Table-driven tests are the idiomatic Go pattern for testing multiple cases. Each case is a struct in a slice, and `t.Run` creates named subtests.',
            explanation: {
              heading: 'Table driven testing',
              intro: 'The table driven pattern collects many test cases into a slice of structs and loops over them with one shared body. It is the idiomatic Go way to cover many inputs without repetition.',
              points: [
                { term: 'Cases as data', detail: 'Each case is a struct holding the inputs and expected outputs, so adding a scenario means adding one row.' },
                { term: 'Named subtests', detail: 'Running each case through the run method gives it a name that appears in output and can be filtered individually.' },
                { term: 'Shared assertions', detail: 'One block of checks runs against every case, so the verification logic stays in a single place.' },
                { term: 'Easy to extend', detail: 'New edge cases are added by appending to the table rather than writing another whole test function.' },
                { term: 'Clear failures', detail: 'Including a descriptive name and the offending values in failure messages makes it obvious which case broke.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 30. IO: Readers & Writers
  {
    id: 'go-io',
    title: 'IO: Readers & Writers',
    level: 1,
    slug: 'io',
    concepts: [],
    children: [
      {
        id: 'go-reader-writer',
        title: 'Reader & Writer Interfaces',
        level: 2,
        slug: 'reader-writer',
        concepts: [
          {
            id: 'go-io-basics',
            code: `// Reading from a string
r := strings.NewReader("Hello, Go!")
buf := make([]byte, 4)
for {
    n, err := r.Read(buf)
    if err == io.EOF {
        break
    }
    fmt.Print(string(buf[:n]))
}`,
            note: '`io.Reader` and `io.Writer` are the fundamental I/O interfaces. Many standard library types implement them: files, network connections, buffers, HTTP bodies.',
            explanation: {
              heading: 'The reader and writer interfaces',
              intro: 'The reader and writer interfaces define a single method each for streaming bytes, and countless types implement them. This shared abstraction lets data flow between unrelated sources and sinks.',
              points: [
                { term: 'One method each', detail: 'A reader supplies a read method and a writer supplies a write method, which is all a type needs to participate.' },
                { term: 'End of stream', detail: 'A read returns a special end of file error to signal that no more data remains, which loops check to stop.' },
                { term: 'Widely implemented', detail: 'Files, network connections, buffers, and HTTP bodies all implement these interfaces, so the same code handles them all.' },
                { term: 'Composable helpers', detail: 'The copy helper moves data from any reader to any writer without knowing their concrete types.' },
                { term: 'Small and powerful', detail: 'Because the interfaces are tiny, they compose into buffered, limited, and multiplexed variants throughout the standard library.' },
              ],
            },
            example: `// Copying between reader and writer
src := strings.NewReader("copy me")
dst := &bytes.Buffer{}
io.Copy(dst, src)`,
          },
        ],
        children: [],
      },
      {
        id: 'go-file-io',
        title: 'File I/O',
        level: 2,
        slug: 'file-io',
        concepts: [
          {
            id: 'go-file-read-write',
            code: `// Write file
err := os.WriteFile("output.txt", []byte("hello"), 0644)

// Read file
data, err := os.ReadFile("output.txt")
fmt.Println(string(data))

// Buffered writing
f, _ := os.Create("log.txt")
defer f.Close()
w := bufio.NewWriter(f)
w.WriteString("buffered line\\n")
w.Flush()`,
            note: '`os.ReadFile` and `os.WriteFile` handle simple cases. For large files or streaming, use `os.Open`/`os.Create` with `bufio` for buffered I/O.',
            explanation: {
              heading: 'Reading and writing files',
              intro: 'Go offers both whole file helpers and streaming primitives for file access. Choosing between them depends on file size and whether you can hold the contents in memory.',
              points: [
                { term: 'Whole file helpers', detail: 'The read file and write file functions handle small files in one call, returning or accepting a byte slice.' },
                { term: 'Open and create', detail: 'For streaming you open or create a file handle that implements the reader and writer interfaces.' },
                { term: 'Buffered io', detail: 'Wrapping a file in a buffered reader or writer reduces system calls, which matters for many small operations.' },
                { term: 'Always close', detail: 'Deferring a close on an opened file releases the operating system handle and flushes pending data.' },
                { term: 'File permissions', detail: 'When creating a file you supply a permission mode that controls who may read and write it.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 31. HTTP & Networking
  {
    id: 'go-http',
    title: 'HTTP & Networking',
    level: 1,
    slug: 'http',
    concepts: [],
    children: [
      {
        id: 'go-http-server',
        title: 'HTTP Server',
        level: 2,
        slug: 'http-server',
        concepts: [
          {
            id: 'go-http-server-intro',
            code: `func helloHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello, %s!", r.URL.Query().Get("name"))
}

func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("GET /hello", helloHandler)

    srv := &http.Server{
        Addr:         ":8080",
        Handler:      mux,
        ReadTimeout:  5 * time.Second,
        WriteTimeout: 10 * time.Second,
    }
    log.Fatal(srv.ListenAndServe())
}`,
            note: 'Go\'s `net/http` package provides a production-ready HTTP server. Go 1.22+ supports method-based routing in `ServeMux`. Always set timeouts on the server.',
            explanation: {
              heading: 'Serving HTTP',
              intro: 'The net http package includes a production capable server, so you rarely need a third party framework for basic services. Handlers receive a response writer and a request and write the reply.',
              points: [
                { term: 'Handler signature', detail: 'A handler takes a response writer to send the reply and a request holding the incoming data.' },
                { term: 'Routing with mux', detail: 'A serve mux maps paths to handlers, and recent Go versions let a pattern include the HTTP method.' },
                { term: 'Set timeouts', detail: 'Configuring read and write timeouts on the server protects it from slow or stalled clients.' },
                { term: 'Concurrent by default', detail: 'The server runs each request in its own goroutine, so handlers must be safe for concurrent use.' },
                { term: 'Middleware', detail: 'Wrapping handlers in functions that add logging or authentication is the idiomatic way to build middleware.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'go-http-client',
        title: 'HTTP Client',
        level: 2,
        slug: 'http-client',
        concepts: [
          {
            id: 'go-http-client-intro',
            code: `client := &http.Client{Timeout: 10 * time.Second}

resp, err := client.Get("https://api.example.com/data")
if err != nil {
    log.Fatal(err)
}
defer resp.Body.Close()

body, err := io.ReadAll(resp.Body)
fmt.Println(string(body))`,
            note: 'Always close `resp.Body` with `defer`. Use a custom `http.Client` with timeouts rather than the default client in production code.',
            explanation: {
              heading: 'Making HTTP requests',
              intro: 'The http client sends requests and returns responses whose body you must read and close. Careful client configuration keeps a program resilient against slow or unreachable servers.',
              points: [
                { term: 'Close the body', detail: 'Deferring a close on the response body frees the connection so it can be reused rather than leaked.' },
                { term: 'Custom client', detail: 'A client configured with a timeout is safer than the shared default, which waits forever by default.' },
                { term: 'Read fully', detail: 'Reading the body to completion before closing lets the underlying connection return to the pool.' },
                { term: 'Check status', detail: 'A returned error covers transport failures, so you still inspect the status code to detect application level errors.' },
                { term: 'Reuse the client', detail: 'One client is safe for concurrent use and reuses connections, so create it once rather than per request.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 32. JSON
  {
    id: 'go-json',
    title: 'JSON',
    level: 1,
    slug: 'json',
    concepts: [],
    children: [
      {
        id: 'go-json-marshal',
        title: 'Marshaling & Unmarshaling',
        level: 2,
        slug: 'json-marshal',
        concepts: [
          {
            id: 'go-json-intro',
            code: `type User struct {
    Name  string \`json:"name"\`
    Email string \`json:"email"\`
    Age   int    \`json:"age,omitempty"\`
}

// Struct -> JSON
u := User{Name: "Alice", Email: "alice@go.dev", Age: 30}
data, _ := json.Marshal(u)
fmt.Println(string(data))

// JSON -> Struct
var u2 User
json.Unmarshal([]byte(\`{"name":"Bob","email":"bob@go.dev"}\`), &u2)`,
            note: '`json.Marshal` encodes Go values to JSON bytes. `json.Unmarshal` decodes. Struct tags control field names and behaviors like `omitempty`.',
            explanation: {
              heading: 'Encoding and decoding JSON',
              intro: 'The encoding json package converts between Go values and JSON text using reflection and struct tags. It handles the common mapping automatically while tags give you fine control.',
              points: [
                { term: 'Marshal to bytes', detail: 'The marshal function serializes a Go value into JSON bytes, following struct tags for field names.' },
                { term: 'Unmarshal into a value', detail: 'The unmarshal function fills a Go value from JSON bytes and needs a pointer so it can write the result.' },
                { term: 'Exported fields only', detail: 'Only exported fields are encoded or decoded, since reflection cannot access unexported ones.' },
                { term: 'Tag options', detail: 'The json tag renames fields and options like omitempty skip zero valued fields in the output.' },
                { term: 'Unknown shapes', detail: 'Decoding into a map or the any type handles JSON whose structure is not known ahead of time.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'go-json-streaming',
        title: 'Streaming JSON',
        level: 2,
        slug: 'json-streaming',
        concepts: [
          {
            id: 'go-json-encoder',
            code: `// Encode directly to an io.Writer (e.g., http.ResponseWriter)
func writeJSON(w http.ResponseWriter, data any) {
    w.Header().Set("Content-Type", "application/json")
    enc := json.NewEncoder(w)
    enc.SetIndent("", "  ")
    enc.Encode(data)
}

// Decode from io.Reader
func readJSON(r io.Reader, dst any) error {
    dec := json.NewDecoder(r)
    dec.DisallowUnknownFields()
    return dec.Decode(dst)
}`,
            note: '`json.NewEncoder`/`json.NewDecoder` stream JSON without buffering the entire payload in memory. Prefer them for HTTP handlers and large payloads.',
            explanation: {
              heading: 'Streaming JSON',
              intro: 'The encoder and decoder read and write JSON directly to and from a stream rather than a fully buffered byte slice. This suits HTTP handlers and large payloads where memory matters.',
              points: [
                { term: 'Encoder to a writer', detail: 'An encoder writes JSON straight to any writer, such as an HTTP response, without building the whole document first.' },
                { term: 'Decoder from a reader', detail: 'A decoder reads JSON from any reader, so you can consume a request body as it arrives.' },
                { term: 'Strict decoding', detail: 'Disallowing unknown fields makes the decoder reject unexpected keys, which catches typos and API drift.' },
                { term: 'Lower memory', detail: 'Streaming avoids holding an entire large payload in memory, which improves scalability under load.' },
                { term: 'Multiple values', detail: 'A decoder can read a sequence of JSON values from one stream, which fits newline delimited formats.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 33. Defer
  {
    id: 'go-defer',
    title: 'Defer',
    level: 1,
    slug: 'defer',
    concepts: [],
    children: [
      {
        id: 'go-defer-basics',
        title: 'Defer Basics',
        level: 2,
        slug: 'defer-basics',
        concepts: [
          {
            id: 'go-defer-intro',
            code: `func readFile(path string) (string, error) {
    f, err := os.Open(path)
    if err != nil {
        return "", err
    }
    defer f.Close()  // guaranteed to run when function returns

    data, err := io.ReadAll(f)
    return string(data), err
}`,
            note: '`defer` schedules a function call to run when the enclosing function returns. Deferred calls execute in LIFO order. Arguments are evaluated immediately.',
            explanation: {
              heading: 'Deferring cleanup',
              intro: 'The defer statement schedules a function call to run just before the surrounding function returns. It keeps cleanup code close to the resource it manages and guarantees it always runs.',
              points: [
                { term: 'Runs on return', detail: 'A deferred call executes when the enclosing function returns, whether normally or through a panic.' },
                { term: 'Last in first out', detail: 'Multiple deferred calls run in reverse order, so the most recently deferred cleanup happens first.' },
                { term: 'Arguments evaluated now', detail: 'The arguments to a deferred call are captured immediately, even though the call itself runs later.' },
                { term: 'Pairs with acquire', detail: 'Placing a defer right after opening a resource keeps the release visible and prevents forgotten cleanup.' },
                { term: 'Can modify returns', detail: 'A deferred closure can read and change named return values, which underpins recover based error handling.' },
              ],
            },
            example: `// Multiple defers (LIFO)
defer fmt.Println("first")
defer fmt.Println("second")
// Output: second, then first`,
          },
        ],
        children: [],
      },
    ],
  },

  // 34. Concurrency Patterns
  {
    id: 'go-concurrency-patterns',
    title: 'Concurrency Patterns',
    level: 1,
    slug: 'concurrency-patterns',
    concepts: [],
    children: [
      {
        id: 'go-worker-pool',
        title: 'Worker Pool',
        level: 2,
        slug: 'worker-pool',
        concepts: [
          {
            id: 'go-worker-pool-intro',
            code: `func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        fmt.Printf("worker %d processing job %d\\n", id, j)
        time.Sleep(time.Second)
        results <- j * 2
    }
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)

    // Start 3 workers
    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }

    // Send 9 jobs
    for j := 1; j <= 9; j++ {
        jobs <- j
    }
    close(jobs)

    for i := 1; i <= 9; i++ {
        fmt.Println(<-results)
    }
}`,
            note: 'A worker pool limits concurrency by launching a fixed number of goroutines that consume from a shared job channel. This prevents resource exhaustion.',
            explanation: {
              heading: 'Bounded concurrency with a pool',
              intro: 'A worker pool starts a fixed number of goroutines that pull tasks from a shared channel. Capping the count keeps concurrency bounded so the program does not overwhelm the machine or a downstream service.',
              points: [
                { term: 'Fixed workers', detail: 'A set number of goroutines run for the pool lifetime, each looping to pull the next job from a channel.' },
                { term: 'Shared job channel', detail: 'Jobs are sent into one channel and any free worker receives the next, balancing work automatically.' },
                { term: 'Results channel', detail: 'Workers send outcomes to a results channel so the coordinator can collect them as they complete.' },
                { term: 'Close to finish', detail: 'Closing the jobs channel after the last job tells workers to stop once the channel is drained.' },
                { term: 'Prevents exhaustion', detail: 'Bounding the worker count protects memory and connection limits compared to launching a goroutine per task.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'go-fan-out-in',
        title: 'Fan-Out / Fan-In',
        level: 2,
        slug: 'fan-out-in',
        concepts: [
          {
            id: 'go-fan-pattern',
            code: `func fanIn(channels ...<-chan int) <-chan int {
    var wg sync.WaitGroup
    merged := make(chan int)

    output := func(ch <-chan int) {
        defer wg.Done()
        for v := range ch {
            merged <- v
        }
    }

    wg.Add(len(channels))
    for _, ch := range channels {
        go output(ch)
    }

    go func() {
        wg.Wait()
        close(merged)
    }()

    return merged
}`,
            note: 'Fan-out distributes work across multiple goroutines. Fan-in merges multiple channels into one. Together they form a pipeline for parallel processing.',
            explanation: {
              heading: 'Fan out and fan in',
              intro: 'Fan out spreads work across several goroutines reading from one source, and fan in merges several result channels back into one. Combined they build concurrent pipelines that scale across cores.',
              points: [
                { term: 'Fan out', detail: 'Starting multiple goroutines that read from the same input channel parallelizes a stage of work.' },
                { term: 'Fan in', detail: 'A merge function reads from many channels and forwards their values onto a single output channel.' },
                { term: 'Wait group to close', detail: 'A wait group tracks the merging goroutines so the merged channel is closed only after all inputs finish.' },
                { term: 'Pipeline stages', detail: 'Chaining stages that each receive and send on channels forms a pipeline where data flows through transformations.' },
                { term: 'Propagate cancellation', detail: 'Passing a context through the stages lets the whole pipeline shut down cleanly when work is cancelled.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 35. Type Conversions & Assertions
  {
    id: 'go-type-conversions',
    title: 'Type Conversions & Assertions',
    level: 1,
    slug: 'type-conversions',
    concepts: [],
    children: [
      {
        id: 'go-type-convert',
        title: 'Type Conversions',
        level: 2,
        slug: 'conversions',
        concepts: [
          {
            id: 'go-convert-intro',
            code: `var i int = 42
var f float64 = float64(i)
var u uint = uint(f)

// String conversions
s := strconv.Itoa(42)       // int -> string
n, _ := strconv.Atoi("42") // string -> int

// Byte slice <-> string
bs := []byte("hello")
str := string(bs)`,
            note: 'Go requires explicit type conversions — there is no implicit coercion. Use `strconv` for string/number conversions. `T(v)` converts value `v` to type `T`.',
            explanation: {
              heading: 'Explicit type conversions',
              intro: 'Go never converts between types automatically, so you must state every conversion in code. This strictness prevents silent precision loss and makes the cost of a conversion visible.',
              points: [
                { term: 'Conversion syntax', detail: 'Writing the target type followed by the value in parentheses converts between compatible numeric or related types.' },
                { term: 'No implicit coercion', detail: 'Mixing an int and a float64 without a conversion is a compile error, which forces you to decide how to combine them.' },
                { term: 'Strings and numbers', detail: 'Converting between text and numbers uses the strconv package rather than a direct type conversion.' },
                { term: 'Bytes and strings', detail: 'Converting between a byte slice and a string copies the data, so it is not free for large values.' },
                { term: 'Watch for overflow', detail: 'Narrowing a large integer into a smaller type silently truncates, so validate ranges before converting.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 36. Benchmarks & Profiling
  {
    id: 'go-benchmarks',
    title: 'Benchmarks & Profiling',
    level: 1,
    slug: 'benchmarks',
    concepts: [],
    children: [
      {
        id: 'go-benchmark-basics',
        title: 'Writing Benchmarks',
        level: 2,
        slug: 'benchmark-basics',
        concepts: [
          {
            id: 'go-benchmark-intro',
            code: `func BenchmarkFib(b *testing.B) {
    for i := 0; i < b.N; i++ {
        Fib(20)
    }
}

// Run: go test -bench=. -benchmem
// Output:
// BenchmarkFib-8   30000   45000 ns/op   0 B/op   0 allocs/op`,
            note: 'Benchmark functions start with `Benchmark` and take `*testing.B`. The framework adjusts `b.N` to get stable measurements. Use `-benchmem` to see allocations.',
            explanation: {
              heading: 'Measuring performance',
              intro: 'Benchmarks live in the same testing framework as unit tests and measure how fast a piece of code runs. The framework repeats the work automatically until the timing is statistically stable.',
              points: [
                { term: 'Benchmark shape', detail: 'A benchmark is a function beginning with Benchmark that takes a testing pointer used to control the run.' },
                { term: 'The loop count', detail: 'The body loops the given number of times, and the framework raises that count until it gathers reliable timings.' },
                { term: 'Report allocations', detail: 'Adding the memory flag reports bytes and allocations per operation, which exposes hidden garbage.' },
                { term: 'Avoid dead code', detail: 'Store results into a package level variable so the compiler does not optimize away the work being measured.' },
                { term: 'Compare with care', detail: 'Run benchmarks on a quiet machine and repeat them, since background load can distort the numbers.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 37. Embedding Files (embed)
  {
    id: 'go-embed',
    title: 'Embedding Files',
    level: 1,
    slug: 'embed',
    concepts: [],
    children: [
      {
        id: 'go-embed-basics',
        title: 'Using //go:embed',
        level: 2,
        slug: 'embed-basics',
        concepts: [
          {
            id: 'go-embed-intro',
            code: `import "embed"

//go:embed templates/*.html
var templates embed.FS

//go:embed version.txt
var version string

//go:embed logo.png
var logo []byte`,
            note: 'The `embed` package allows embedding files into the binary at compile time. Use `embed.FS` for directories, `string` for text files, and `[]byte` for binary data.',
            explanation: {
              heading: 'Embedding files in the binary',
              intro: 'The embed package bakes files into the compiled binary at build time, so assets ship as part of a single executable. A special comment directive tells the compiler which files to include.',
              points: [
                { term: 'The embed directive', detail: 'A comment beginning with go colon embed above a variable names the files or patterns to include.' },
                { term: 'Choosing the type', detail: 'A string holds a text file, a byte slice holds binary data, and the embed file system holds whole directories.' },
                { term: 'Single binary deploy', detail: 'Embedding templates, static assets, or configuration removes the need to ship separate files alongside the program.' },
                { term: 'Read only', detail: 'Embedded contents are fixed at build time and cannot be modified at runtime, since they live in the binary.' },
                { term: 'Import required', detail: 'Using the file system type requires importing the embed package even when the variable is a plain string.' },
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
