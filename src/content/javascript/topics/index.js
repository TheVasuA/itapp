// JavaScript topic tree.
//
// Each node is a ConceptNode: { id, title, level, slug?, concepts[], children[] }.
// Routable nodes carry a `slug`. Every Concept renders in the fixed order
// code -> note -> example (example optional).

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  // ─── 1. Fundamentals ───────────────────────────────────────────────
  {
    id: 'js-fundamentals',
    title: 'Fundamentals',
    level: 1,
    slug: 'fundamentals',
    concepts: [],
    children: [
      {
        id: 'js-variables',
        title: 'Variables: let, const, var',
        level: 2,
        slug: 'variables',
        concepts: [
          {
            id: 'js-variables-declare',
            code: "const name = 'Ada';\nlet count = 0;\ncount += 1;",
            note: 'Use `const` for bindings that never get reassigned and `let` when the value changes. Avoid `var`, which is function-scoped and hoisted.',
            explanation: {
              heading: 'Choosing let, const, and var',
              intro:
                'JavaScript gives you three ways to declare variables, but they behave very differently around scope and reassignment. Reaching for const by default and let only when needed keeps code predictable and signals intent to anyone reading it.',
              points: [
                {
                  term: 'const is a binding, not deep immutability',
                  detail:
                    'const stops you from reassigning the variable, but the value it points at can still change — you can push to a const array or edit properties of a const object.',
                },
                {
                  term: 'Block scope',
                  detail:
                    'let and const live only inside the nearest curly braces, so a variable declared in a loop or if block cannot leak out and clash with code elsewhere.',
                },
                {
                  term: 'Why avoid var',
                  detail:
                    'var ignores block scope and is hoisted as undefined, which leads to subtle bugs where a variable is visible and usable in places you did not expect.',
                },
                {
                  term: 'When to reach for let',
                  detail:
                    'Use let for counters, accumulators, or any binding whose value genuinely needs to be reassigned as the program runs.',
                },
                {
                  term: 'Readability payoff',
                  detail:
                    'Defaulting to const tells the next reader that a value is fixed, so they can reason about the code without hunting for later reassignments.',
                },
              ],
            },
            example:
              "const PI = 3.14159;\n// PI = 3; // TypeError: Assignment to constant variable.",
          },
          {
            id: 'js-variables-tdz',
            code: "console.log(typeof x); // 'undefined' is NOT printed\nlet x = 5;",
            note: '`let` and `const` are hoisted but live in the temporal dead zone until declared, so referencing them early throws a ReferenceError.',
            explanation: {
              heading: 'The temporal dead zone',
              intro:
                'The temporal dead zone (TDZ) is the stretch of code from the start of a block up to the line where a let or const is declared. During that window the binding exists but cannot be touched, and any access throws a ReferenceError.',
              points: [
                {
                  term: 'Hoisted but not initialized',
                  detail:
                    'let and const are hoisted to the top of their block like var, but they are not given a value, so they stay off-limits until the declaration line runs.',
                },
                {
                  term: 'Difference from var',
                  detail:
                    'var starts life as undefined and can be read early, while a TDZ access is a hard error — the TDZ exists to catch use-before-declare mistakes.',
                },
                {
                  term: 'typeof is not safe here',
                  detail:
                    'typeof normally never throws, but on a variable still in its TDZ it does throw a ReferenceError instead of returning a harmless string.',
                },
                {
                  term: 'Practical benefit',
                  detail:
                    'The TDZ nudges you to declare variables before you use them, which makes control flow easier to follow and surfaces typos immediately.',
                },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'js-data-types',
        title: 'Data Types & Type Coercion',
        level: 2,
        slug: 'data-types',
        concepts: [
          {
            id: 'js-types-primitives',
            code: "typeof 42;          // 'number'\ntypeof 'hello';    // 'string'\ntypeof true;       // 'boolean'\ntypeof undefined;  // 'undefined'\ntypeof null;       // 'object' (legacy bug)\ntypeof Symbol();   // 'symbol'\ntypeof 9007199254740991n; // 'bigint'",
            note: 'JavaScript has 7 primitives (string, number, bigint, boolean, undefined, symbol, null) plus Object. Use `typeof` for runtime checks, but beware the null quirk.',
            explanation: {
              heading: 'Primitive types and typeof',
              intro:
                'Primitives are the simplest values in JavaScript: they are immutable and compared by value rather than by reference. Everything that is not a primitive is an object, including arrays and functions.',
              points: [
                {
                  term: 'Immutable by value',
                  detail:
                    'You never change a primitive in place; operations like uppercasing a string produce a brand new value and leave the original untouched.',
                },
                {
                  term: 'The typeof null bug',
                  detail:
                    'typeof null returns the string object — a long-standing quirk kept for backward compatibility, so test for null with a direct value === null check.',
                },
                {
                  term: 'Numbers versus BigInt',
                  detail:
                    'number is a 64-bit float that loses precision past about 2 to the 53rd, while bigint handles arbitrarily large integers when you append n to a literal.',
                },
                {
                  term: 'Autoboxing',
                  detail:
                    'When you call a method like "hi".length, JavaScript temporarily wraps the primitive in an object so the method works, then discards the wrapper.',
                },
                {
                  term: 'Checking objects',
                  detail:
                    'typeof cannot tell an array from a plain object; use Array.isArray for arrays and be aware functions report as function.',
                },
              ],
            },
          },
          {
            id: 'js-types-coercion',
            code: "'5' + 3;    // '53' (string concat)\n'5' - 3;    // 2 (numeric coercion)\n!!0;         // false\n!![];        // true",
            note: 'JavaScript coerces types implicitly. The `+` operator prefers string concatenation, while `-`, `*`, `/` coerce to number. Use `===` to avoid coercion surprises.',
            explanation: {
              heading: 'Type coercion rules',
              intro:
                'Coercion is JavaScript automatically converting a value from one type to another so an operation can proceed. Understanding when it kicks in turns confusing results into predictable ones.',
              points: [
                {
                  term: 'The overloaded plus',
                  detail:
                    'If either side of + is a string, JavaScript concatenates; otherwise it adds numerically, which is why "5" + 3 gives "53" but "5" - 3 gives 2.',
                },
                {
                  term: 'Truthy and falsy',
                  detail:
                    'In boolean contexts the falsy values are false, 0, empty string, null, undefined, and NaN; everything else, including empty arrays and objects, is truthy.',
                },
                {
                  term: 'Prefer strict equality',
                  detail:
                    'Use === and !== so comparisons never coerce; loose == applies conversion rules that produce surprises like 0 equalling an empty string.',
                },
                {
                  term: 'Explicit is clearer',
                  detail:
                    'Convert on purpose with Number(), String(), or Boolean() so the reader sees the intent instead of relying on hidden implicit rules.',
                },
                {
                  term: 'Watch for NaN',
                  detail:
                    'Coercing a non-numeric string to a number yields NaN, and NaN is never equal to anything, so guard with Number.isNaN when parsing input.',
                },
              ],
            },
            example: "Number('42');   // 42\nString(42);     // '42'\nBoolean('');    // false",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 2. Control Flow ───────────────────────────────────────────────
  {
    id: 'js-control-flow',
    title: 'Control Flow',
    level: 1,
    slug: 'control-flow',
    concepts: [],
    children: [
      {
        id: 'js-conditionals',
        title: 'Conditionals',
        level: 2,
        slug: 'conditionals',
        concepts: [
          {
            id: 'js-if-else',
            code: "const age = 20;\nif (age >= 18) {\n  console.log('adult');\n} else if (age >= 13) {\n  console.log('teen');\n} else {\n  console.log('child');\n}",
            note: 'Standard `if/else` branching. JavaScript also supports the ternary operator `condition ? a : b` for inline expressions.',
            explanation: {
              heading: 'Branching with if/else',
              intro:
                'if/else is the core tool for making decisions in code. The condition is evaluated for truthiness, so any value — not just a boolean — can steer which branch runs.',
              points: [
                {
                  term: 'Truthiness drives it',
                  detail:
                    'The parentheses can hold any expression; JavaScript coerces the result to boolean, so remember that 0, empty string, null, and undefined take the else path.',
                },
                {
                  term: 'else if chains',
                  detail:
                    'Conditions are checked top to bottom and the first match wins, so order your cases from most specific to most general.',
                },
                {
                  term: 'Ternary for expressions',
                  detail:
                    'Use condition ? a : b when you need a value inline, such as assigning to a variable, and keep it to a single simple choice for readability.',
                },
                {
                  term: 'Guard clauses',
                  detail:
                    'Returning early on edge cases at the top of a function flattens nesting and often reads more clearly than deeply nested if blocks.',
                },
                {
                  term: 'Always brace',
                  detail:
                    'Wrapping branches in curly braces even for one line prevents bugs when someone later adds a second statement to the branch.',
                },
              ],
            },
          },
          {
            id: 'js-switch',
            code: "switch (status) {\n  case 'active':\n    activate();\n    break;\n  case 'idle':\n    pause();\n    break;\n  default:\n    reset();\n}",
            note: 'Switch uses strict equality (`===`). Always include `break` unless you intentionally want fall-through behavior.',
            explanation: {
              heading: 'Using switch statements',
              intro:
                'A switch compares one value against several possible cases and is a tidy alternative to a long else-if ladder when you are checking a single expression against fixed options.',
              points: [
                {
                  term: 'Strict comparison',
                  detail:
                    'Each case is matched with === against the switch value, so a numeric 1 will not match the string case "1".',
                },
                {
                  term: 'Break to stop',
                  detail:
                    'Without break, execution falls through into the next case, running its code too; this is a frequent source of accidental bugs.',
                },
                {
                  term: 'Intentional fall-through',
                  detail:
                    'You can stack case labels with no code between them to let several values share one block, which is the one time fall-through is useful.',
                },
                {
                  term: 'The default case',
                  detail:
                    'default handles anything that does not match and can sit anywhere, though putting it last keeps the intent obvious.',
                },
                {
                  term: 'Block scoping in cases',
                  detail:
                    'Wrap a case body in braces when you declare let or const inside it, otherwise the binding leaks across sibling cases and can throw.',
                },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'js-loops',
        title: 'Loops & Iteration',
        level: 2,
        slug: 'loops',
        concepts: [
          {
            id: 'js-for-loops',
            code: "for (let i = 0; i < 5; i++) {\n  console.log(i);\n}\n\nconst fruits = ['apple', 'banana', 'cherry'];\nfor (const fruit of fruits) {\n  console.log(fruit);\n}",
            note: '`for...of` iterates values of iterables (arrays, strings, maps). `for...in` iterates enumerable property keys — avoid it on arrays.',
            explanation: {
              heading: 'Loop forms and when to use them',
              intro:
                'JavaScript offers several loops that look similar but read very different things. Picking the right one makes intent clear and avoids the classic mix-up between keys and values.',
              points: [
                {
                  term: 'Classic for',
                  detail:
                    'The three-part for loop gives you full control over the index, which is handy when you need the position or want to skip or step by more than one.',
                },
                {
                  term: 'for...of for values',
                  detail:
                    'for...of walks the values of any iterable — arrays, strings, Maps, Sets — and is the cleanest choice when you do not care about the index.',
                },
                {
                  term: 'for...in for keys',
                  detail:
                    'for...in iterates enumerable property names, so it suits plain objects; on arrays it yields string indices and can pick up inherited keys.',
                },
                {
                  term: 'Array helpers',
                  detail:
                    'forEach, map, and filter express intent even more clearly for arrays, though a plain loop is better when you need to break out early.',
                },
                {
                  term: 'Breaking out',
                  detail:
                    'break and continue work in for and for...of but not in forEach, so reach for a real loop when early exit matters.',
                },
              ],
            },
            example: "const obj = { a: 1, b: 2 };\nfor (const key in obj) {\n  console.log(key, obj[key]);\n}",
          },
          {
            id: 'js-while-do',
            code: "let n = 5;\nwhile (n > 0) {\n  n--;\n}\n\ndo {\n  n++;\n} while (n < 3);",
            note: '`while` checks the condition before each iteration; `do...while` always runs at least once.',
            explanation: {
              heading: 'while and do...while',
              intro:
                'These loops repeat while a condition holds and are the right choice when you do not know the number of iterations up front, such as reading until input runs out.',
              points: [
                {
                  term: 'Condition first',
                  detail:
                    'while tests the condition before the body, so if it starts false the body never runs even once.',
                },
                {
                  term: 'do...while runs first',
                  detail:
                    'do...while executes the body once and then checks the condition, which fits menus and prompts that must show at least one time.',
                },
                {
                  term: 'Avoid infinite loops',
                  detail:
                    'Make sure something inside the body changes the condition toward false, or the loop will never end and freeze the thread.',
                },
                {
                  term: 'Prefer for when counting',
                  detail:
                    'If you are iterating a known number of times, a for loop keeps the counter and its update together and is easier to read.',
                },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 3. Functions ──────────────────────────────────────────────────
  {
    id: 'js-functions',
    title: 'Functions',
    level: 1,
    slug: 'functions',
    concepts: [],
    children: [
      {
        id: 'js-func-declarations',
        title: 'Declarations & Expressions',
        level: 2,
        slug: 'function-declarations',
        concepts: [
          {
            id: 'js-func-decl',
            code: "function greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconst greet2 = function(name) {\n  return `Hi, ${name}!`;\n};",
            note: 'Function declarations are hoisted (usable before they appear). Function expressions are not hoisted.',
            explanation: {
              heading: 'Declarations vs expressions',
              intro:
                'There are two main ways to define a function: as a standalone declaration or as an expression assigned to a variable. The difference mostly shows up in hoisting and how you intend to reuse the function.',
              points: [
                {
                  term: 'Declarations are hoisted',
                  detail:
                    'A function declaration is available throughout its scope even before the line it appears on, so you can call it above its definition.',
                },
                {
                  term: 'Expressions follow the variable',
                  detail:
                    'A function expression is only usable after the assignment runs; called earlier with let or const it hits the temporal dead zone.',
                },
                {
                  term: 'Named expressions',
                  detail:
                    'Giving an expression a name helps in stack traces and lets the function refer to itself for recursion without relying on the outer variable.',
                },
                {
                  term: 'Style guidance',
                  detail:
                    'Declarations read well for top-level helpers, while expressions suit functions passed as arguments or stored on objects.',
                },
              ],
            },
          },
          {
            id: 'js-functions-arrow',
            code: 'const add = (a, b) => a + b;\nconst square = n => n * n;',
            note: 'Arrow functions are concise and capture `this` lexically from their enclosing scope rather than binding their own.',
            explanation: {
              heading: 'Arrow functions and lexical this',
              intro:
                'Arrow functions offer a compact syntax and, more importantly, do not create their own this. Instead they inherit this from the surrounding scope, which solves a whole class of callback bugs.',
              points: [
                {
                  term: 'Lexical this',
                  detail:
                    'An arrow captures this from where it is defined, so callbacks inside a method keep pointing at the right object without bind or a saved reference.',
                },
                {
                  term: 'Concise returns',
                  detail:
                    'With no braces the body is an implicit return; to return an object literal, wrap it in parentheses so it is not read as a block.',
                },
                {
                  term: 'No arguments object',
                  detail:
                    'Arrows have no arguments binding of their own, so use rest parameters like (...args) when you need the full list.',
                },
                {
                  term: 'Not for methods or constructors',
                  detail:
                    'Because they lack their own this and cannot be called with new, avoid arrows for object methods and class constructors.',
                },
                {
                  term: 'Great for one-liners',
                  detail:
                    'They shine as short callbacks to map, filter, and reduce where brevity and inherited this both help.',
                },
              ],
            },
            example: 'const nums = [1, 2, 3].map(n => n * 2); // [2, 4, 6]',
          },
        ],
        children: [],
      },
      {
        id: 'js-closures',
        title: 'Closures & Scope',
        level: 2,
        slug: 'closures',
        concepts: [
          {
            id: 'js-closure-basic',
            code: "function counter() {\n  let count = 0;\n  return {\n    increment: () => ++count,\n    get: () => count,\n  };\n}\nconst c = counter();\nc.increment(); // 1\nc.increment(); // 2",
            note: 'A closure is a function bundled together with references to its surrounding state (its lexical environment). It lets an inner function keep accessing variables from the scope where it was created, even after that outer scope has finished running.',
            explanation: {
              heading: 'How closures work',
              intro:
                'Every time a function is created in JavaScript, a closure is created along with it. The inner function keeps a live reference to the variables of its outer function — not a copy — so it can read and update them long after the outer function has returned. In the example above, each object returned by counter() carries its own private count.',
              points: [
                {
                  term: 'Lexical scope',
                  detail:
                    'Where a function is written in the source decides which outer variables it can see, not where it is later called from.',
                },
                {
                  term: 'Persistent state',
                  detail:
                    'The captured variables stay alive as long as the closure exists, so a returned function remembers values between calls.',
                },
                {
                  term: 'Data privacy',
                  detail:
                    'Variables like count are unreachable from outside; the only way to touch them is through the methods the closure exposes.',
                },
                {
                  term: 'Common uses',
                  detail:
                    'Function factories, module patterns, memoization/caching, and event or callback handlers that need to remember context.',
                },
                {
                  term: 'Gotcha',
                  detail:
                    'Closures capture the variable itself, so a loop that shares one `var` can surprise you — use `let` per iteration to capture a fresh binding.',
                },
              ],
            },
          },
          {
            id: 'js-iife',
            code: "const module = (() => {\n  let private = 0;\n  return { next: () => ++private };\n})();\nmodule.next(); // 1",
            note: 'An IIFE (Immediately Invoked Function Expression) runs once and creates a private scope, useful for encapsulating state before ES modules.',
            explanation: {
              heading: 'Immediately invoked functions',
              intro:
                'An IIFE is a function that is defined and called on the spot. Its main value is creating a private scope so variables inside do not pollute the surrounding code.',
              points: [
                {
                  term: 'Instant execution',
                  detail:
                    'Wrapping a function in parentheses and adding () right after defines and runs it in one step, producing a value or side effect immediately.',
                },
                {
                  term: 'Scope isolation',
                  detail:
                    'Anything declared inside stays local, which historically kept the global namespace clean before block scope and modules existed.',
                },
                {
                  term: 'Module pattern',
                  detail:
                    'Returning an object of methods from an IIFE exposes a public API while keeping helper state private through closure.',
                },
                {
                  term: 'Modern relevance',
                  detail:
                    'ES modules give each file its own scope, so IIFEs are less common now but still handy in bundled scripts or quick isolation.',
                },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'js-higher-order',
        title: 'Higher-Order Functions',
        level: 2,
        slug: 'higher-order',
        concepts: [
          {
            id: 'js-hof-basic',
            code: "function repeat(n, action) {\n  for (let i = 0; i < n; i++) action(i);\n}\nrepeat(3, console.log); // 0, 1, 2",
            note: 'A higher-order function accepts functions as arguments or returns them. This enables composition and abstraction over actions.',
            explanation: {
              heading: 'Higher-order functions',
              intro:
                'A higher-order function treats other functions as data — taking them as parameters or returning them. This is the backbone of functional style in JavaScript and powers most array methods.',
              points: [
                {
                  term: 'Functions as arguments',
                  detail:
                    'Passing a function lets a helper stay generic; repeat does not care what action runs, only that it can call it each iteration.',
                },
                {
                  term: 'Functions as return values',
                  detail:
                    'Returning a function creates configurable factories, such as an adder that remembers a fixed amount through closure.',
                },
                {
                  term: 'Built-in examples',
                  detail:
                    'map, filter, reduce, and addEventListener are all higher-order — they accept the callback that describes what to do.',
                },
                {
                  term: 'Abstraction over actions',
                  detail:
                    'They let you separate the what from the how, reducing duplication by isolating the varying behavior into a passed-in function.',
                },
                {
                  term: 'Keep callbacks pure',
                  detail:
                    'Callbacks that avoid side effects are easier to test and reason about, especially when composed together.',
                },
              ],
            },
            example: "const twice = fn => x => fn(fn(x));\nconst addOne = x => x + 1;\ntwice(addOne)(5); // 7",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 4. Objects ────────────────────────────────────────────────────
  {
    id: 'js-objects',
    title: 'Objects',
    level: 1,
    slug: 'objects',
    concepts: [],
    children: [
      {
        id: 'js-object-basics',
        title: 'Object Literals & Access',
        level: 2,
        slug: 'object-literals',
        concepts: [
          {
            id: 'js-obj-literal',
            code: "const user = {\n  name: 'Alice',\n  age: 30,\n  greet() {\n    return `Hi, I'm ${this.name}`;\n  },\n};\nconsole.log(user.name);       // 'Alice'\nconsole.log(user['age']);     // 30",
            note: 'Objects are key-value collections. Access properties with dot notation or brackets. Methods are functions stored as properties.',
            explanation: {
              heading: 'Working with object literals',
              intro:
                'The object literal is the everyday way to group related data and behavior under named keys. It is flexible, easy to read, and the foundation for most data structures in JavaScript.',
              points: [
                {
                  term: 'Dot vs bracket access',
                  detail:
                    'Use dot notation for fixed keys and bracket notation when the key is dynamic or held in a variable, like obj[keyName].',
                },
                {
                  term: 'Methods and this',
                  detail:
                    'A function stored on an object is a method, and inside it this refers to the object it was called on.',
                },
                {
                  term: 'Shorthand syntax',
                  detail:
                    'Modern syntax lets you write { name } instead of { name: name } and greet() {} instead of greet: function() {}.',
                },
                {
                  term: 'Reference semantics',
                  detail:
                    'Objects are copied by reference, so assigning one to a new variable shares the same underlying data rather than cloning it.',
                },
                {
                  term: 'Missing keys',
                  detail:
                    'Reading a key that does not exist returns undefined rather than throwing, so guard before using nested values.',
                },
              ],
            },
          },
          {
            id: 'js-obj-destructuring',
            code: "const { name, age, city = 'Unknown' } = user;\nconsole.log(name); // 'Alice'\nconsole.log(city); // 'Unknown'",
            note: 'Destructuring extracts properties into variables. Default values apply when the property is `undefined`.',
            explanation: {
              heading: 'Object destructuring',
              intro:
                'Destructuring pulls values out of an object into standalone variables in a single, readable statement. It cuts down repetitive property access and makes function inputs self-documenting.',
              points: [
                {
                  term: 'Match by name',
                  detail:
                    'The variable name must match the property key; the order of keys does not matter as it would with array destructuring.',
                },
                {
                  term: 'Defaults for missing values',
                  detail:
                    'A default like city = "Unknown" only applies when the property is undefined, not when it is null or an empty string.',
                },
                {
                  term: 'Rename while extracting',
                  detail:
                    'Use { name: userName } to store the name property in a variable called userName, avoiding clashes with existing names.',
                },
                {
                  term: 'In function parameters',
                  detail:
                    'Destructuring the parameter object lets a function declare exactly which fields it needs and supply defaults inline.',
                },
                {
                  term: 'Guard against undefined',
                  detail:
                    'Destructuring null or undefined throws, so provide a fallback like ({} = maybeObj) when the source might be missing.',
                },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'js-prototypes',
        title: 'Prototypes & Inheritance',
        level: 2,
        slug: 'prototypes',
        concepts: [
          {
            id: 'js-proto-chain',
            code: "const animal = { eats: true };\nconst rabbit = Object.create(animal);\nrabbit.jumps = true;\nconsole.log(rabbit.eats); // true (inherited)",
            note: 'Every object has a hidden [[Prototype]] link. Property lookup walks up the prototype chain until it finds the key or reaches null.',
            explanation: {
              heading: 'The prototype chain',
              intro:
                'JavaScript objects inherit through a chain of prototypes rather than classes under the hood. When you read a property, the engine checks the object itself, then its prototype, then that prototype, until it finds the key or hits null.',
              points: [
                {
                  term: 'Lookup walks upward',
                  detail:
                    'A property access searches the own object first and then each linked prototype in turn, returning the first match it finds.',
                },
                {
                  term: 'Object.create',
                  detail:
                    'Object.create(proto) makes a new object whose prototype is proto, which is the most direct way to set up inheritance.',
                },
                {
                  term: 'Own vs inherited',
                  detail:
                    'hasOwnProperty tells you whether a key lives directly on the object or was found further up the chain.',
                },
                {
                  term: 'Shared methods',
                  detail:
                    'Placing methods on a prototype lets many instances share one function in memory instead of each holding its own copy.',
                },
                {
                  term: 'Chain ends at null',
                  detail:
                    'Most chains end at Object.prototype whose own prototype is null; reaching null means the property does not exist and you get undefined.',
                },
              ],
            },
            example: "console.log(rabbit.hasOwnProperty('jumps')); // true\nconsole.log(rabbit.hasOwnProperty('eats'));  // false",
          },
        ],
        children: [],
      },
      {
        id: 'js-classes',
        title: 'Classes (ES6)',
        level: 2,
        slug: 'classes',
        concepts: [
          {
            id: 'js-class-syntax',
            code: "class Animal {\n  constructor(name) {\n    this.name = name;\n  }\n  speak() {\n    return `${this.name} makes a noise.`;\n  }\n}\n\nclass Dog extends Animal {\n  speak() {\n    return `${this.name} barks.`;\n  }\n}",
            note: 'Classes are syntactic sugar over prototypal inheritance. Use `extends` for subclassing and `super` to call the parent constructor or methods.',
            explanation: {
              heading: 'ES6 class syntax',
              intro:
                'The class keyword gives a familiar, readable way to define object blueprints, but it is built on the same prototype system underneath. It bundles a constructor with methods and supports clean inheritance.',
              points: [
                {
                  term: 'Constructor sets up state',
                  detail:
                    'The constructor runs when you call new and is where you assign the instance properties via this.',
                },
                {
                  term: 'Methods live on the prototype',
                  detail:
                    'Methods defined in the class body are shared through the prototype, so every instance uses the same function objects.',
                },
                {
                  term: 'extends and super',
                  detail:
                    'extends links a subclass to its parent, and super calls the parent constructor or a parent method that the child overrides.',
                },
                {
                  term: 'Must use new',
                  detail:
                    'Unlike ordinary functions, class constructors throw if called without new, which prevents a common category of mistakes.',
                },
                {
                  term: 'Fields and privacy',
                  detail:
                    'You can declare instance fields directly and mark truly private members with a leading # so they are inaccessible from outside.',
                },
              ],
            },
            example: "const d = new Dog('Rex');\nd.speak(); // 'Rex barks.'",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 5. Arrays ─────────────────────────────────────────────────────
  {
    id: 'js-arrays',
    title: 'Arrays',
    level: 1,
    slug: 'arrays',
    concepts: [],
    children: [
      {
        id: 'js-array-methods',
        title: 'Array Methods',
        level: 2,
        slug: 'array-methods',
        concepts: [
          {
            id: 'js-array-transform',
            code: "const nums = [1, 2, 3, 4, 5];\nconst doubled = nums.map(n => n * 2);          // [2,4,6,8,10]\nconst evens = nums.filter(n => n % 2 === 0);   // [2,4]\nconst sum = nums.reduce((a, b) => a + b, 0);   // 15",
            note: '`map` transforms each element, `filter` selects elements, and `reduce` accumulates to a single value. All return new arrays (immutable pattern).',
            explanation: {
              heading: 'map, filter, and reduce',
              intro:
                'These three methods express most array processing declaratively. Instead of writing loops with mutable accumulators, you describe the transformation and let the method handle iteration.',
              points: [
                {
                  term: 'map transforms',
                  detail:
                    'map returns a new array of the same length where each element is the result of the callback applied to the original.',
                },
                {
                  term: 'filter selects',
                  detail:
                    'filter returns a new array containing only the elements for which the callback returns a truthy value.',
                },
                {
                  term: 'reduce folds',
                  detail:
                    'reduce collapses the array into a single value by threading an accumulator through each element; always pass an initial value.',
                },
                {
                  term: 'Non-mutating',
                  detail:
                    'These methods leave the source array untouched and return fresh arrays, which fits an immutable, side-effect-free style.',
                },
                {
                  term: 'Chaining and cost',
                  detail:
                    'You can chain them for readable pipelines, but each call makes another pass, so combine steps for very large arrays if performance matters.',
                },
              ],
            },
          },
          {
            id: 'js-array-find',
            code: "const users = [{id:1,name:'A'},{id:2,name:'B'}];\nconst found = users.find(u => u.id === 2);   // {id:2,name:'B'}\nconst idx = users.findIndex(u => u.id === 2); // 1\nconst has = users.some(u => u.name === 'A');  // true",
            note: '`find` returns the first match, `findIndex` its index, `some` checks if any pass, `every` checks if all pass.',
            explanation: {
              heading: 'Searching and testing arrays',
              intro:
                'When you need to locate an element or ask a yes/no question about a collection, these predicate-based methods read far more clearly than a manual loop with a flag variable.',
              points: [
                {
                  term: 'find and findIndex',
                  detail:
                    'find returns the first element that satisfies the callback, or undefined; findIndex returns its position, or -1 when nothing matches.',
                },
                {
                  term: 'some for any',
                  detail:
                    'some returns true as soon as one element passes the test, short-circuiting the rest of the iteration.',
                },
                {
                  term: 'every for all',
                  detail:
                    'every returns true only if all elements pass, and stops early the moment one fails.',
                },
                {
                  term: 'includes vs find',
                  detail:
                    'For a simple value membership check use includes; reach for find when you need to match on a computed condition.',
                },
                {
                  term: 'Empty array behavior',
                  detail:
                    'On an empty array some returns false and every returns true, which follows from their logical definitions.',
                },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'js-array-destructuring',
        title: 'Spread, Rest & Destructuring',
        level: 2,
        slug: 'array-destructuring',
        concepts: [
          {
            id: 'js-array-spread',
            code: "const a = [1, 2, 3];\nconst b = [...a, 4, 5]; // [1,2,3,4,5]\n\nconst [first, ...rest] = b;\n// first = 1, rest = [2,3,4,5]",
            note: 'The spread operator (`...`) copies elements into a new array. Rest syntax collects remaining items into an array during destructuring.',
            explanation: {
              heading: 'Spread and rest syntax',
              intro:
                'The three-dot syntax does two mirror-image jobs: spread expands an iterable into individual pieces, while rest gathers many pieces into one array. Context decides which one you are using.',
              points: [
                {
                  term: 'Spread expands',
                  detail:
                    'In a call or literal, ...arr unpacks the elements, making it easy to copy or merge arrays and to pass an array as separate arguments.',
                },
                {
                  term: 'Rest collects',
                  detail:
                    'In a parameter list or destructuring target, ...rest bundles the remaining items into a real array you can iterate.',
                },
                {
                  term: 'Shallow copies',
                  detail:
                    'Spreading an array copies the top level only; nested objects are still shared, so deeply mutating a copy affects the original.',
                },
                {
                  term: 'Variadic functions',
                  detail:
                    'Rest parameters give a genuine array in place of the old arguments object and work in arrow functions too.',
                },
                {
                  term: 'Works on iterables',
                  detail:
                    'Spread accepts any iterable, so you can expand strings, Sets, and Maps, not just arrays.',
                },
              ],
            },
            example: "function sum(...nums) {\n  return nums.reduce((a, b) => a + b, 0);\n}\nsum(1, 2, 3); // 6",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 6. Strings ────────────────────────────────────────────────────
  {
    id: 'js-strings',
    title: 'Strings',
    level: 1,
    slug: 'strings',
    concepts: [],
    children: [
      {
        id: 'js-string-methods',
        title: 'String Methods & Templates',
        level: 2,
        slug: 'string-methods',
        concepts: [
          {
            id: 'js-template-literals',
            code: "const name = 'World';\nconst greeting = `Hello, ${name}!`;\n\nconst multiline = `\n  Line 1\n  Line 2\n`;",
            note: 'Template literals use backticks and support interpolation (`${expr}`) and multi-line strings without escape characters.',
            explanation: {
              heading: 'Template literals',
              intro:
                'Template literals are strings written with backticks that can embed expressions and span multiple lines. They replace clumsy concatenation with readable, inline substitution.',
              points: [
                {
                  term: 'Interpolation',
                  detail:
                    'Anything inside the dollar-brace placeholder is evaluated as an expression and its result is converted to a string.',
                },
                {
                  term: 'Multi-line by default',
                  detail:
                    'Line breaks inside the backticks are preserved, so you can write formatted text without joining with newline escapes.',
                },
                {
                  term: 'Any expression',
                  detail:
                    'Placeholders accept function calls, arithmetic, and ternaries, letting you build dynamic strings in one place.',
                },
                {
                  term: 'Tagged templates',
                  detail:
                    'Prefixing a template with a function lets that function process the parts, which powers libraries for escaping HTML or building styled components.',
                },
                {
                  term: 'Escaping backticks',
                  detail:
                    'To include a literal backtick or dollar-brace inside the string, escape it with a backslash.',
                },
              ],
            },
          },
          {
            id: 'js-string-ops',
            code: "'hello'.includes('ell');     // true\n'hello'.startsWith('he');   // true\n'hello'.padStart(8, '.');   // '...hello'\n'  hi  '.trim();            // 'hi'\n'a,b,c'.split(',');         // ['a','b','c']",
            note: 'Modern string methods cover searching, padding, trimming, and splitting. They are all immutable — strings cannot be changed in place.',
            explanation: {
              heading: 'Common string operations',
              intro:
                'Strings come with a rich set of methods for inspecting and reshaping text. Because strings are immutable, every method returns a new string rather than editing the original.',
              points: [
                {
                  term: 'Searching',
                  detail:
                    'includes, startsWith, and endsWith give clear boolean checks, while indexOf returns a position or -1 when the substring is absent.',
                },
                {
                  term: 'Trimming and padding',
                  detail:
                    'trim removes surrounding whitespace, and padStart or padEnd fill a string to a target length, handy for aligning output.',
                },
                {
                  term: 'Splitting and joining',
                  detail:
                    'split turns a string into an array on a separator, and the array method join reverses that operation.',
                },
                {
                  term: 'Immutability',
                  detail:
                    'Since methods do not mutate, remember to capture the return value; calling trim without assigning it changes nothing.',
                },
                {
                  term: 'Unicode awareness',
                  detail:
                    'Indexing by character position can split multi-byte characters; spread or Array.from handle code points more safely.',
                },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'js-regex',
        title: 'Regular Expressions',
        level: 2,
        slug: 'regex',
        concepts: [
          {
            id: 'js-regex-basics',
            code: "const re = /\\d{3}-\\d{4}/g;\n'Call 555-1234 or 555-5678'.match(re);\n// ['555-1234', '555-5678']\n\n/^hello$/i.test('Hello'); // true",
            note: 'Regex literals are delimited by `/`. Common flags: `g` (global), `i` (case-insensitive), `m` (multiline). Use `test()` for boolean match and `match()` to extract.',
            explanation: {
              heading: 'Regular expression basics',
              intro:
                'Regular expressions describe patterns in text for matching, extraction, and replacement. They are compact and powerful, but readability suffers quickly, so keep patterns focused and commented.',
              points: [
                {
                  term: 'Literals and flags',
                  detail:
                    'A pattern between slashes can carry flags such as g for all matches, i for case-insensitive, and m for multiline anchors.',
                },
                {
                  term: 'test vs match',
                  detail:
                    'test returns a simple boolean, while match and matchAll pull out the matched text and capture groups.',
                },
                {
                  term: 'Character classes and quantifiers',
                  detail:
                    'Classes like backslash-d and quantifiers like + or {3} describe what and how many characters to match.',
                },
                {
                  term: 'Anchors and groups',
                  detail:
                    'Caret and dollar anchor to start and end, and parentheses create capture groups you can reference in replacements.',
                },
                {
                  term: 'The global flag pitfall',
                  detail:
                    'A regex with g keeps a lastIndex between calls, so reusing the same object across tests can give alternating results.',
                },
              ],
            },
            example: "const email = /^[\\w.]+@[\\w.]+\\.[a-z]{2,}$/i;\nemail.test('a@b.com'); // true",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 7. ES6+ Features ─────────────────────────────────────────────
  {
    id: 'js-es6-plus',
    title: 'ES6+ Features',
    level: 1,
    slug: 'es6-plus',
    concepts: [],
    children: [
      {
        id: 'js-modules',
        title: 'Modules (import/export)',
        level: 2,
        slug: 'modules',
        concepts: [
          {
            id: 'js-modules-syntax',
            code: "// math.js\nexport const PI = 3.14159;\nexport function add(a, b) { return a + b; }\nexport default class Calculator {}\n\n// main.js\nimport Calculator, { PI, add } from './math.js';",
            note: 'ES modules use `export` for named exports and `export default` for a single main export. `import` is statically analyzed and hoisted.',
            explanation: {
              heading: 'ES module syntax',
              intro:
                'ES modules split code into files that explicitly declare what they share and what they depend on. Each module has its own scope, so nothing leaks globally unless you export it.',
              points: [
                {
                  term: 'Named vs default',
                  detail:
                    'Named exports let a file expose many values by name, while a single default export is the one main thing a module provides.',
                },
                {
                  term: 'Static structure',
                  detail:
                    'import and export are analyzed before code runs, which lets tools tree-shake unused exports and catch missing bindings early.',
                },
                {
                  term: 'Live bindings',
                  detail:
                    'Imports are read-only live views of the exported values, so if the exporter updates a value the importer sees the new one.',
                },
                {
                  term: 'Single evaluation',
                  detail:
                    'A module runs once no matter how many files import it, and its top-level state is shared, which makes it a natural singleton.',
                },
                {
                  term: 'Dynamic import',
                  detail:
                    'For code you only sometimes need, the function-like import() loads a module lazily at runtime and returns a promise.',
                },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'js-symbols-iterators',
        title: 'Symbols & Iterators',
        level: 2,
        slug: 'symbols-iterators',
        concepts: [
          {
            id: 'js-symbol-basic',
            code: "const id = Symbol('id');\nconst obj = { [id]: 123, name: 'test' };\nconsole.log(obj[id]); // 123\n// Symbol keys are not enumerable in for...in",
            note: 'Symbols are unique, immutable identifiers useful for non-colliding object keys and implementing well-known protocols like `Symbol.iterator`.',
            explanation: {
              heading: 'Symbols as unique keys',
              intro:
                'A Symbol is a primitive whose only job is to be unique. Every call to Symbol() produces a value that is equal to nothing but itself, which makes symbols ideal for keys that must never collide.',
              points: [
                {
                  term: 'Guaranteed uniqueness',
                  detail:
                    'Two symbols are never equal even with the same description, so using one as a key avoids clashing with existing or future string keys.',
                },
                {
                  term: 'Hidden-ish properties',
                  detail:
                    'Symbol keys are skipped by for...in and Object.keys, so they stay out of the way of ordinary enumeration.',
                },
                {
                  term: 'Well-known symbols',
                  detail:
                    'Built-in symbols like Symbol.iterator let objects hook into language features such as for...of and the spread operator.',
                },
                {
                  term: 'The global registry',
                  detail:
                    'Symbol.for(key) returns a shared symbol from a global registry, useful when different modules must agree on the same symbol.',
                },
                {
                  term: 'Not fully private',
                  detail:
                    'Symbol keys are discoverable via Object.getOwnPropertySymbols, so they hide from casual iteration but are not a security boundary.',
                },
              ],
            },
          },
          {
            id: 'js-iterator-protocol',
            code: "const range = {\n  from: 1, to: 5,\n  [Symbol.iterator]() {\n    let current = this.from;\n    return {\n      next: () => current <= this.to\n        ? { value: current++, done: false }\n        : { done: true },\n    };\n  },\n};\n[...range]; // [1, 2, 3, 4, 5]",
            note: 'An iterable implements `[Symbol.iterator]()` returning an object with a `next()` method. This enables `for...of`, spread, and destructuring.',
            explanation: {
              heading: 'The iterator protocol',
              intro:
                'Iteration in JavaScript follows a simple contract: an iterable exposes a method that hands back an iterator, and the iterator produces values one at a time until it reports it is done.',
              points: [
                {
                  term: 'Two linked protocols',
                  detail:
                    'An iterable has a Symbol.iterator method; the object it returns is the iterator and must implement next().',
                },
                {
                  term: 'The next result shape',
                  detail:
                    'Each next() call returns an object with value and done, where done becomes true once the sequence is exhausted.',
                },
                {
                  term: 'What it unlocks',
                  detail:
                    'Implementing the protocol lets your object work with for...of, spread, array destructuring, and Array.from.',
                },
                {
                  term: 'Laziness',
                  detail:
                    'Values are produced on demand, so an iterator can represent an infinite or expensive sequence without computing everything up front.',
                },
                {
                  term: 'Generators simplify it',
                  detail:
                    'Writing a generator function is usually easier than hand-coding next(), since it produces a conforming iterator automatically.',
                },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 8. Asynchronous JavaScript ───────────────────────────────────
  {
    id: 'js-async',
    title: 'Asynchronous JavaScript',
    level: 1,
    slug: 'async',
    concepts: [],
    children: [
      {
        id: 'js-promises',
        title: 'Promises',
        level: 2,
        slug: 'promises',
        concepts: [
          {
            id: 'js-promises-basic',
            code: "fetch('/api/data')\n  .then(res => res.json())\n  .then(data => console.log(data))\n  .catch(err => console.error(err));",
            note: 'A Promise represents a value that may be available now, later, or never. Chain `.then()` for success and `.catch()` for errors.',
            explanation: {
              heading: 'How promises work',
              intro:
                'A promise is a placeholder for a value that will exist after an asynchronous operation finishes. It starts pending and later settles into either fulfilled with a value or rejected with a reason.',
              points: [
                {
                  term: 'Three states',
                  detail:
                    'A promise is pending, then either fulfilled or rejected exactly once; once settled it never changes state again.',
                },
                {
                  term: 'Chaining',
                  detail:
                    'then returns a new promise, so you can chain steps; returning a value passes it along and returning a promise waits for it.',
                },
                {
                  term: 'Error propagation',
                  detail:
                    'A rejection skips down the chain until a catch handles it, so one catch at the end can cover several then steps.',
                },
                {
                  term: 'Always handle rejections',
                  detail:
                    'An unhandled rejection is a common bug source, so end chains with catch or use try/catch when awaiting.',
                },
                {
                  term: 'finally for cleanup',
                  detail:
                    'finally runs whether the promise fulfilled or rejected, which is the right place for teardown like hiding a spinner.',
                },
              ],
            },
          },
          {
            id: 'js-promises-async-await',
            code: "async function load() {\n  try {\n    const res = await fetch('/api/data');\n    return await res.json();\n  } catch (err) {\n    console.error(err);\n  }\n}",
            note: '`async`/`await` is syntactic sugar over promises that lets you write asynchronous code in a synchronous-looking style.',
            explanation: {
              heading: 'async and await',
              intro:
                'async and await let you write promise-based code that reads top to bottom like synchronous code. await pauses the function until a promise settles, then resumes with its value.',
              points: [
                {
                  term: 'async returns a promise',
                  detail:
                    'Any function marked async always returns a promise, wrapping its return value or any thrown error automatically.',
                },
                {
                  term: 'await unwraps',
                  detail:
                    'await suspends the async function until the awaited promise resolves and then yields the resolved value.',
                },
                {
                  term: 'Errors via try/catch',
                  detail:
                    'A rejected awaited promise throws, so ordinary try/catch handles async errors just like synchronous ones.',
                },
                {
                  term: 'Avoid needless serialization',
                  detail:
                    'Awaiting independent tasks one by one wastes time; start them together and await Promise.all to run them concurrently.',
                },
                {
                  term: 'Non-blocking',
                  detail:
                    'await pauses only the current async function, not the whole thread, so other work keeps running while it waits.',
                },
              ],
            },
            example:
              "load().then(data => console.log('loaded', data));",
          },
        ],
        children: [],
      },
      {
        id: 'js-event-loop',
        title: 'The Event Loop',
        level: 2,
        slug: 'event-loop',
        concepts: [
          {
            id: 'js-event-loop-phases',
            code: "console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');\n// Output: 1, 4, 3, 2",
            note: 'JavaScript is single-threaded. The event loop processes: call stack → microtasks (promises) → macrotasks (setTimeout, I/O). Microtasks always run before the next macrotask.',
            explanation: {
              heading: 'The event loop and task queues',
              intro:
                'JavaScript runs on a single thread, so it relies on an event loop to juggle asynchronous work. The loop drains the call stack, then runs queued callbacks in a specific order that explains many timing surprises.',
              points: [
                {
                  term: 'Run to completion',
                  detail:
                    'The engine finishes the current synchronous task fully before handling any queued callback, so nothing interrupts mid-function.',
                },
                {
                  term: 'Microtasks first',
                  detail:
                    'Promise callbacks land in the microtask queue, which is fully emptied after each task and before any timer callback runs.',
                },
                {
                  term: 'Macrotasks',
                  detail:
                    'setTimeout, I/O, and events queue as macrotasks; only one runs per loop turn, followed again by all pending microtasks.',
                },
                {
                  term: 'Ordering example',
                  detail:
                    'That is why a Promise.then logs before a setTimeout(0) even though both were scheduled to run as soon as possible.',
                },
                {
                  term: 'Do not block',
                  detail:
                    'Long synchronous work freezes everything, including the UI, so break heavy computation up or move it to a worker.',
                },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'js-promise-combinators',
        title: 'Promise Combinators',
        level: 2,
        slug: 'promise-combinators',
        concepts: [
          {
            id: 'js-promise-all',
            code: "const [users, posts] = await Promise.all([\n  fetch('/users').then(r => r.json()),\n  fetch('/posts').then(r => r.json()),\n]);\n\nconst first = await Promise.race([fetch('/a'), fetch('/b')]);",
            note: '`Promise.all` waits for all to resolve (fails fast on any rejection). `Promise.race` resolves/rejects with the first settled. `Promise.allSettled` waits for all regardless of outcome.',
            explanation: {
              heading: 'Promise combinators',
              intro:
                'The combinator methods coordinate several promises at once. Choosing the right one depends on whether you need every result, the fastest, or a tolerant collection of successes and failures.',
              points: [
                {
                  term: 'Promise.all',
                  detail:
                    'Resolves with an array of all values once every input fulfills, but rejects immediately if any single one rejects.',
                },
                {
                  term: 'Promise.allSettled',
                  detail:
                    'Waits for every promise regardless of outcome and reports each as fulfilled with a value or rejected with a reason.',
                },
                {
                  term: 'Promise.race',
                  detail:
                    'Settles as soon as the first input settles, whether that is a resolve or a reject, useful for timeouts.',
                },
                {
                  term: 'Promise.any',
                  detail:
                    'Resolves with the first fulfillment and only rejects if every input rejects, ideal for trying redundant sources.',
                },
                {
                  term: 'Concurrency benefit',
                  detail:
                    'Starting tasks together and combining them runs them in parallel, which is far faster than awaiting each in sequence.',
                },
              ],
            },
            example: "const results = await Promise.allSettled([p1, p2, p3]);\nresults.forEach(r => console.log(r.status)); // 'fulfilled' or 'rejected'",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 9. DOM Manipulation ───────────────────────────────────────────
  {
    id: 'js-dom',
    title: 'DOM Manipulation',
    level: 1,
    slug: 'dom',
    concepts: [],
    children: [
      {
        id: 'js-dom-selection',
        title: 'Selecting & Traversing',
        level: 2,
        slug: 'dom-selection',
        concepts: [
          {
            id: 'js-dom-query',
            code: "const el = document.querySelector('.card');\nconst all = document.querySelectorAll('li');\nconst parent = el.parentElement;\nconst children = el.children;",
            note: '`querySelector` returns the first match; `querySelectorAll` returns a static NodeList. Navigate the tree with `parentElement`, `children`, `nextElementSibling`.',
            explanation: {
              heading: 'Selecting and traversing the DOM',
              intro:
                'Before you can change the page you have to find the right elements. The query methods use familiar CSS selectors, and traversal properties let you move around relative to a node you already hold.',
              points: [
                {
                  term: 'CSS-based selection',
                  detail:
                    'querySelector and querySelectorAll accept any CSS selector, so the same syntax you use for styling locates elements in script.',
                },
                {
                  term: 'Single vs list',
                  detail:
                    'querySelector returns the first match or null, while querySelectorAll returns a static NodeList of every match.',
                },
                {
                  term: 'Static NodeList',
                  detail:
                    'The list from querySelectorAll does not update if the DOM changes later, and you often spread it to an array to use array methods.',
                },
                {
                  term: 'Element vs node traversal',
                  detail:
                    'Prefer parentElement, children, and nextElementSibling over the node versions to skip text and whitespace nodes.',
                },
                {
                  term: 'Scope your queries',
                  detail:
                    'Calling querySelector on an element rather than document limits the search to that subtree, which is faster and less error-prone.',
                },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'js-dom-events',
        title: 'Events & Delegation',
        level: 2,
        slug: 'dom-events',
        concepts: [
          {
            id: 'js-dom-event-listen',
            code: "document.querySelector('#btn').addEventListener('click', e => {\n  console.log('clicked', e.target);\n});\n\n// Event delegation\ndocument.querySelector('ul').addEventListener('click', e => {\n  if (e.target.matches('li')) {\n    console.log('item:', e.target.textContent);\n  }\n});",
            note: 'Event delegation attaches one listener to a parent and uses `e.target` to handle child events. This is efficient for dynamic lists.',
            explanation: {
              heading: 'Event listeners and delegation',
              intro:
                'Events let your code respond to user actions. Because events bubble up through ancestors, you can often attach one listener high in the tree instead of many on individual elements.',
              points: [
                {
                  term: 'addEventListener',
                  detail:
                    'This method registers a handler and can be called multiple times for the same event without overwriting earlier handlers.',
                },
                {
                  term: 'Bubbling',
                  detail:
                    'Most events travel from the target up through its ancestors, which is exactly what makes delegation possible.',
                },
                {
                  term: 'Delegation with e.target',
                  detail:
                    'Listen on a stable parent and check e.target, so newly added children are handled without wiring up new listeners.',
                },
                {
                  term: 'Options object',
                  detail:
                    'The third argument supports once for auto-removal, passive for smoother scrolling, and capture to handle on the way down.',
                },
                {
                  term: 'Remember to remove',
                  detail:
                    'Use removeEventListener with the same function reference to avoid leaks, so prefer named handlers over inline arrows when cleanup matters.',
                },
              ],
            },
            example: "el.addEventListener('keydown', e => {\n  if (e.key === 'Enter') submit();\n}, { once: true });",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 10. Error Handling ────────────────────────────────────────────
  {
    id: 'js-error-handling',
    title: 'Error Handling',
    level: 1,
    slug: 'error-handling',
    concepts: [],
    children: [
      {
        id: 'js-try-catch',
        title: 'Try/Catch/Finally',
        level: 2,
        slug: 'try-catch',
        concepts: [
          {
            id: 'js-try-basic',
            code: "try {\n  JSON.parse('invalid');\n} catch (err) {\n  console.error(err.message); // Unexpected token i...\n} finally {\n  console.log('always runs');\n}",
            note: '`try/catch` handles synchronous errors. `finally` always executes, useful for cleanup. For async code, use try/catch inside `async` functions.',
            explanation: {
              heading: 'try, catch, and finally',
              intro:
                'The try statement lets you attempt code that might fail and react gracefully instead of crashing. catch receives the thrown error and finally runs cleanup no matter what happened.',
              points: [
                {
                  term: 'Catches thrown errors',
                  detail:
                    'Any error thrown inside the try block jumps to catch, whether it came from your code or a built-in operation.',
                },
                {
                  term: 'finally always runs',
                  detail:
                    'finally executes on success, on error, and even when the try or catch returns, making it the place for releasing resources.',
                },
                {
                  term: 'Only synchronous by default',
                  detail:
                    'A callback that throws later will not be caught here; inside async functions, await lets try/catch cover asynchronous failures.',
                },
                {
                  term: 'Do not swallow errors',
                  detail:
                    'An empty catch hides bugs, so at minimum log the error or rethrow it after handling what you can.',
                },
                {
                  term: 'Catch narrowly',
                  detail:
                    'Wrap only the code that can fail so you do not accidentally mask unrelated errors from surrounding logic.',
                },
              ],
            },
          },
          {
            id: 'js-custom-error',
            code: "class ValidationError extends Error {\n  constructor(field, message) {\n    super(message);\n    this.name = 'ValidationError';\n    this.field = field;\n  }\n}\n\nthrow new ValidationError('email', 'Invalid format');",
            note: 'Extend `Error` to create domain-specific error types with additional context. Always set `this.name` for clear stack traces.',
            explanation: {
              heading: 'Custom error types',
              intro:
                'Subclassing Error lets you create meaningful error categories carrying extra data. Callers can then distinguish a validation problem from a network problem and respond appropriately.',
              points: [
                {
                  term: 'Call super with a message',
                  detail:
                    'Pass the human-readable message to super(message) so the standard message property and stack trace are set up correctly.',
                },
                {
                  term: 'Set the name',
                  detail:
                    'Assigning this.name to the class name makes logs and stack traces label the error clearly instead of a generic Error.',
                },
                {
                  term: 'Attach context',
                  detail:
                    'Add fields like field or statusCode so the handler has structured details rather than parsing a message string.',
                },
                {
                  term: 'Discriminate with instanceof',
                  detail:
                    'catch blocks can branch on instanceof ValidationError to handle different failure kinds in different ways.',
                },
                {
                  term: 'Prefer throwing Error objects',
                  detail:
                    'Throw real Error instances rather than strings so you keep the stack trace and consistent handling everywhere.',
                },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 11. This & Execution Context ─────────────────────────────────
  {
    id: 'js-this',
    title: 'this & Execution Context',
    level: 1,
    slug: 'this-context',
    concepts: [],
    children: [
      {
        id: 'js-this-binding',
        title: 'this Binding Rules',
        level: 2,
        slug: 'this-binding',
        concepts: [
          {
            id: 'js-this-rules',
            code: "const obj = {\n  name: 'obj',\n  greet() { return this.name; },\n};\nobj.greet();            // 'obj' (implicit binding)\n\nconst fn = obj.greet;\nfn();                   // undefined (default binding)\n\nfn.call({ name: 'X' }); // 'X' (explicit binding)",
            note: '`this` is determined at call time: 1) `new` binding, 2) explicit (`call/apply/bind`), 3) implicit (object method), 4) default (`undefined` in strict mode).',
            explanation: {
              heading: 'How this is determined',
              intro:
                'The value of this is not fixed when a function is written; it is decided by how the function is called. Four rules cover it, and knowing their priority order clears up most confusion.',
              points: [
                {
                  term: 'new binding',
                  detail:
                    'Calling with new creates a fresh object and binds this to it, which is why constructors assign to this.',
                },
                {
                  term: 'Explicit binding',
                  detail:
                    'call and apply invoke the function with a this you choose, and bind returns a new function permanently tied to that this.',
                },
                {
                  term: 'Implicit binding',
                  detail:
                    'When called as obj.method(), this is the object before the dot; detach the method and that link is lost.',
                },
                {
                  term: 'Default binding',
                  detail:
                    'A plain call sets this to undefined in strict mode or the global object otherwise, a frequent source of bugs.',
                },
                {
                  term: 'Arrows opt out',
                  detail:
                    'Arrow functions ignore these rules and inherit this from the enclosing scope, which is why they suit callbacks.',
                },
              ],
            },
            example: "const bound = obj.greet.bind(obj);\nbound(); // 'obj' — bind returns a new function with fixed this",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 12. Map, Set & WeakRef ────────────────────────────────────────
  {
    id: 'js-collections',
    title: 'Map, Set & WeakRef',
    level: 1,
    slug: 'collections',
    concepts: [],
    children: [
      {
        id: 'js-map-set',
        title: 'Map & Set',
        level: 2,
        slug: 'map-set',
        concepts: [
          {
            id: 'js-map-basic',
            code: "const map = new Map();\nmap.set('key', 'value');\nmap.set(42, 'number key');\nmap.get('key');  // 'value'\nmap.size;        // 2\n\nconst set = new Set([1, 2, 2, 3]);\nset.size; // 3 (duplicates removed)",
            note: 'Map preserves insertion order and allows any key type (not just strings). Set stores unique values. Both are iterable.',
            explanation: {
              heading: 'Map and Set collections',
              intro:
                'Map and Set are purpose-built collections that fill gaps plain objects and arrays leave open. Map is a keyed store with any key type, and Set holds unique values.',
              points: [
                {
                  term: 'Any key type',
                  detail:
                    'Map keys can be objects, functions, or numbers, unlike plain object keys which are coerced to strings.',
                },
                {
                  term: 'Insertion order',
                  detail:
                    'Both iterate in the order items were added, giving predictable ordering that object key order does not always guarantee.',
                },
                {
                  term: 'Fast membership',
                  detail:
                    'Map.has and Set.has check for a key or value efficiently, and size reports the count directly.',
                },
                {
                  term: 'Deduplication',
                  detail:
                    'Feeding an array into a Set drops duplicates, and spreading it back out is a clean one-line way to get unique values.',
                },
                {
                  term: 'When to prefer them',
                  detail:
                    'Reach for Map over an object when keys are dynamic or non-string, and for Set when uniqueness is the whole point.',
                },
              ],
            },
            example: "// Deduplicate an array\nconst unique = [...new Set([1, 1, 2, 3, 3])]; // [1, 2, 3]",
          },
        ],
        children: [],
      },
      {
        id: 'js-weakmap-weakset',
        title: 'WeakMap & WeakSet',
        level: 2,
        slug: 'weak-collections',
        concepts: [
          {
            id: 'js-weakmap-basic',
            code: "const cache = new WeakMap();\nlet obj = { data: 'expensive' };\ncache.set(obj, computeResult(obj));\n// When obj is GC'd, the WeakMap entry is auto-removed",
            note: 'WeakMap/WeakSet hold weak references — entries are garbage-collected when no other reference exists. Keys must be objects. Not iterable.',
            explanation: {
              heading: 'WeakMap and WeakSet',
              intro:
                'These collections hold their keys weakly, meaning they do not keep an object alive. When nothing else references a key, the garbage collector can reclaim it and the entry disappears on its own.',
              points: [
                {
                  term: 'Object-only keys',
                  detail:
                    'Keys must be objects because primitives have no identity to hold weakly; a string could not be reclaimed the same way.',
                },
                {
                  term: 'Automatic cleanup',
                  detail:
                    'Once the only reference to a key is inside the WeakMap, the pair becomes eligible for collection, preventing memory leaks.',
                },
                {
                  term: 'Not iterable',
                  detail:
                    'You cannot loop over or read the size, since entries can vanish at any time and enumeration would be unpredictable.',
                },
                {
                  term: 'Ideal for private data',
                  detail:
                    'They are great for associating metadata or a cache with an object without modifying the object itself.',
                },
                {
                  term: 'Non-deterministic timing',
                  detail:
                    'You cannot predict exactly when collection happens, so never rely on it for logic that must run at a set moment.',
                },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 13. Destructuring & Spread ────────────────────────────────────
  {
    id: 'js-destructuring',
    title: 'Destructuring & Spread',
    level: 1,
    slug: 'destructuring',
    concepts: [],
    children: [
      {
        id: 'js-advanced-destructuring',
        title: 'Advanced Patterns',
        level: 2,
        slug: 'advanced-destructuring',
        concepts: [
          {
            id: 'js-nested-destructure',
            code: "const { address: { city, zip } } = user;\n\n// Renaming\nconst { name: userName, age: userAge } = user;\n\n// Computed keys\nconst key = 'email';\nconst { [key]: email } = user;",
            note: 'Destructuring supports nesting, renaming with `:`, computed property keys, and default values. Works in function parameters too.',
            explanation: {
              heading: 'Advanced destructuring patterns',
              intro:
                'Beyond pulling out top-level fields, destructuring can reach into nested structures, rename bindings, use computed keys, and set defaults at every level. Used well it makes function signatures self-documenting.',
              points: [
                {
                  term: 'Nested patterns',
                  detail:
                    'You can destructure inside destructuring to reach nested fields, but every intermediate object must exist or it throws.',
                },
                {
                  term: 'Renaming',
                  detail:
                    'The colon syntax maps a property to a differently named variable, avoiding clashes and improving clarity.',
                },
                {
                  term: 'Computed keys',
                  detail:
                    'Wrapping a key in brackets lets you destructure a property whose name is held in a variable at runtime.',
                },
                {
                  term: 'Parameter defaults',
                  detail:
                    'Destructuring parameters with a default empty object lets a function be called with no arguments and still apply field defaults.',
                },
                {
                  term: 'Keep it shallow',
                  detail:
                    'Deeply nested destructuring can hurt readability, so extract in a couple of steps when the shape gets complex.',
                },
              ],
            },
            example: "function draw({ x = 0, y = 0, color = 'black' } = {}) {\n  // defaults at every level\n}",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 14. Generators ────────────────────────────────────────────────
  {
    id: 'js-generators',
    title: 'Generators',
    level: 1,
    slug: 'generators',
    concepts: [],
    children: [
      {
        id: 'js-generator-basics',
        title: 'Generator Functions',
        level: 2,
        slug: 'generator-basics',
        concepts: [
          {
            id: 'js-gen-basic',
            code: "function* idMaker() {\n  let id = 0;\n  while (true) {\n    yield id++;\n  }\n}\nconst gen = idMaker();\ngen.next(); // { value: 0, done: false }\ngen.next(); // { value: 1, done: false }",
            note: 'Generators are functions that can pause (`yield`) and resume. They return an iterator and are useful for lazy sequences and custom iteration.',
            explanation: {
              heading: 'Generator functions',
              intro:
                'A generator is a special function that can pause partway through and hand control back to the caller. Calling it returns an iterator, and each next() resumes execution until the following yield.',
              points: [
                {
                  term: 'Pause and resume',
                  detail:
                    'yield suspends the function and returns a value; the next next() call picks up right where it left off with local state intact.',
                },
                {
                  term: 'Lazy sequences',
                  detail:
                    'Because values are produced on demand, a generator can model an infinite stream without ever computing all of it.',
                },
                {
                  term: 'Iterator for free',
                  detail:
                    'The returned object already satisfies the iterator protocol, so it works with for...of and spread without extra code.',
                },
                {
                  term: 'Two-way communication',
                  detail:
                    'A value passed to next() becomes the result of the paused yield expression, letting the caller feed data back in.',
                },
                {
                  term: 'Watch infinite loops',
                  detail:
                    'A generator with while(true) is fine as long as the consumer stops pulling; spreading it fully would never end.',
                },
              ],
            },
          },
          {
            id: 'js-gen-delegation',
            code: "function* inner() { yield 'a'; yield 'b'; }\nfunction* outer() {\n  yield 1;\n  yield* inner();\n  yield 2;\n}\n[...outer()]; // [1, 'a', 'b', 2]",
            note: '`yield*` delegates to another iterable or generator, flattening its values into the outer sequence.',
            explanation: {
              heading: 'Generator delegation with yield*',
              intro:
                'yield* lets one generator hand off to another iterable, forwarding all of its values as if they were produced directly. It is the composition tool for generators.',
              points: [
                {
                  term: 'Flattening sequences',
                  detail:
                    'yield* iterates the delegate fully and yields each value outward, so nested generators combine into one flat stream.',
                },
                {
                  term: 'Any iterable',
                  detail:
                    'The target can be another generator, an array, a string, or anything iterable, not just generators.',
                },
                {
                  term: 'Passes the return value',
                  detail:
                    'The expression yield* evaluates to the delegated generators return value, which you can capture and use.',
                },
                {
                  term: 'Composition benefit',
                  detail:
                    'Delegation lets you build a big sequence from small, reusable generators instead of one large tangled function.',
                },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 15. Async Iterators & for-await-of ────────────────────────────
  {
    id: 'js-async-iterators',
    title: 'Async Iterators',
    level: 1,
    slug: 'async-iterators',
    concepts: [],
    children: [
      {
        id: 'js-async-gen',
        title: 'Async Generators & for-await-of',
        level: 2,
        slug: 'async-generators',
        concepts: [
          {
            id: 'js-async-gen-basic',
            code: "async function* fetchPages(url) {\n  let page = 1;\n  while (true) {\n    const res = await fetch(`${url}?page=${page}`);\n    const data = await res.json();\n    if (data.length === 0) return;\n    yield data;\n    page++;\n  }\n}\n\nfor await (const page of fetchPages('/api/items')) {\n  console.log(page);\n}",
            note: 'Async generators combine `async` and `function*`. Use `for await...of` to consume async iterables like paginated APIs or streams.',
            explanation: {
              heading: 'Async generators',
              intro:
                'An async generator can both await asynchronous work and yield values over time. It is the natural fit for data that arrives in chunks, such as paginated APIs or readable streams.',
              points: [
                {
                  term: 'await plus yield',
                  detail:
                    'Inside an async generator you can await a promise before each yield, so values are produced only once their data is ready.',
                },
                {
                  term: 'Consumed with for await...of',
                  detail:
                    'for await...of pulls each value in turn, pausing the loop until the next asynchronous value resolves.',
                },
                {
                  term: 'Backpressure friendly',
                  detail:
                    'Because the next chunk is only fetched when the consumer asks, memory stays bounded even for large sources.',
                },
                {
                  term: 'Pagination and streams',
                  detail:
                    'They express paging loops cleanly, yielding one page at a time until the source signals it is exhausted.',
                },
                {
                  term: 'Error handling',
                  detail:
                    'A rejection during iteration surfaces as a thrown error in the for await loop, so wrap it in try/catch.',
                },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 16. Proxy & Reflect (Metaprogramming) ─────────────────────────
  {
    id: 'js-proxy-reflect',
    title: 'Proxy & Reflect',
    level: 1,
    slug: 'proxy-reflect',
    concepts: [],
    children: [
      {
        id: 'js-proxy-basics',
        title: 'Proxy Traps',
        level: 2,
        slug: 'proxy-traps',
        concepts: [
          {
            id: 'js-proxy-get-set',
            code: "const handler = {\n  get(target, prop) {\n    return prop in target ? target[prop] : `No ${prop}`;\n  },\n  set(target, prop, value) {\n    if (typeof value !== 'number') throw TypeError('Must be number');\n    target[prop] = value;\n    return true;\n  },\n};\nconst obj = new Proxy({}, handler);\nobj.x = 5;        // OK\nobj.missing;       // 'No missing'",
            note: 'A Proxy wraps an object and intercepts operations via handler traps (get, set, has, deleteProperty, etc.). Enables validation, logging, and virtual properties.',
            explanation: {
              heading: 'Proxy traps',
              intro:
                'A Proxy wraps a target object and lets you intercept fundamental operations like reading, writing, or deleting properties. Each intercepted operation is a trap you define in a handler.',
              points: [
                {
                  term: 'Traps for operations',
                  detail:
                    'Handler methods such as get, set, has, and deleteProperty run in place of the default behavior on the target.',
                },
                {
                  term: 'Validation and defaults',
                  detail:
                    'A set trap can reject bad values before they land, and a get trap can supply computed or fallback values on the fly.',
                },
                {
                  term: 'Return values matter',
                  detail:
                    'The set trap must return true on success; returning a falsy value throws in strict mode, so be deliberate about it.',
                },
                {
                  term: 'Transparent wrapper',
                  detail:
                    'Code interacts with the proxy exactly like the original object, which makes it powerful for logging or reactive systems.',
                },
                {
                  term: 'Cost and caveats',
                  detail:
                    'Every trapped operation adds overhead, and proxies cannot be fully polyfilled, so use them where the flexibility earns its keep.',
                },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'js-reflect-api',
        title: 'Reflect API',
        level: 2,
        slug: 'reflect-api',
        concepts: [
          {
            id: 'js-reflect-basic',
            code: "const obj = { a: 1 };\nReflect.set(obj, 'b', 2);         // true\nReflect.has(obj, 'a');            // true\nReflect.ownKeys(obj);             // ['a', 'b']\nReflect.deleteProperty(obj, 'a'); // true",
            note: 'Reflect provides methods mirroring Proxy traps. Use Reflect inside trap handlers for correct default behavior and proper return values.',
            explanation: {
              heading: 'The Reflect API',
              intro:
                'Reflect is a built-in object of static methods that perform the same low-level operations as proxy traps. It gives a clean, function-style way to do things that were previously scattered across operators and Object methods.',
              points: [
                {
                  term: 'Mirrors the traps',
                  detail:
                    'Methods like Reflect.get, Reflect.set, and Reflect.has line up one-to-one with proxy handler traps.',
                },
                {
                  term: 'Correct defaults in traps',
                  detail:
                    'Calling the matching Reflect method inside a trap performs the standard behavior while preserving the right receiver and return value.',
                },
                {
                  term: 'Predictable return values',
                  detail:
                    'Reflect.set and Reflect.deleteProperty return a boolean instead of throwing, which is easier to branch on than the operator forms.',
                },
                {
                  term: 'Function-style operations',
                  detail:
                    'Reflect turns constructs like the in operator and delete into ordinary function calls that are easy to pass around.',
                },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 17. Currying & Partial Application ────────────────────────────
  {
    id: 'js-currying',
    title: 'Currying & Partial Application',
    level: 1,
    slug: 'currying',
    concepts: [],
    children: [
      {
        id: 'js-curry-basics',
        title: 'Currying Techniques',
        level: 2,
        slug: 'curry-techniques',
        concepts: [
          {
            id: 'js-curry-manual',
            code: "const curry = fn => a => b => fn(a, b);\nconst add = curry((a, b) => a + b);\nadd(2)(3); // 5\n\n// Generic curry\nconst curryN = fn => {\n  const arity = fn.length;\n  return function curried(...args) {\n    return args.length >= arity\n      ? fn(...args)\n      : (...more) => curried(...args, ...more);\n  };\n};",
            note: 'Currying transforms a function with multiple arguments into a sequence of single-argument functions. Enables partial application and point-free composition.',
            explanation: {
              heading: 'Currying and partial application',
              intro:
                'Currying reshapes a multi-argument function into a chain of functions that each take one argument. This unlocks partial application, where you lock in some arguments now and supply the rest later.',
              points: [
                {
                  term: 'One argument at a time',
                  detail:
                    'A curried function returns another function until all arguments are gathered, then it finally computes the result.',
                },
                {
                  term: 'Partial application',
                  detail:
                    'Fixing the first arguments produces a specialized function, such as an add(5) that always adds five to its input.',
                },
                {
                  term: 'Building with closures',
                  detail:
                    'Each returned function closes over the arguments collected so far, remembering them until the call completes.',
                },
                {
                  term: 'Point-free style',
                  detail:
                    'Curried functions plug neatly into pipelines, letting you compose behavior without naming intermediate values.',
                },
                {
                  term: 'Know the arity',
                  detail:
                    'A generic curry relies on fn.length to know when enough arguments have arrived, which breaks for variadic or defaulted parameters.',
                },
              ],
            },
            example: "const multiply = curryN((a, b, c) => a * b * c);\nmultiply(2)(3)(4); // 24\nmultiply(2, 3)(4); // 24",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 18. Memoization ───────────────────────────────────────────────
  {
    id: 'js-memoization',
    title: 'Memoization',
    level: 1,
    slug: 'memoization',
    concepts: [],
    children: [
      {
        id: 'js-memo-basics',
        title: 'Caching Function Results',
        level: 2,
        slug: 'memo-basics',
        concepts: [
          {
            id: 'js-memo-impl',
            code: "function memoize(fn) {\n  const cache = new Map();\n  return function(...args) {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) return cache.get(key);\n    const result = fn.apply(this, args);\n    cache.set(key, result);\n    return result;\n  };\n}\n\nconst fib = memoize(n => n <= 1 ? n : fib(n - 1) + fib(n - 2));\nfib(40); // instant",
            note: 'Memoization caches return values based on arguments, trading memory for speed. Ideal for pure functions with expensive computations.',
            explanation: {
              heading: 'Memoization',
              intro:
                'Memoization remembers the result of a function for a given set of arguments so repeat calls return instantly from a cache. It trades memory for speed and only works well on pure functions.',
              points: [
                {
                  term: 'Cache by arguments',
                  detail:
                    'A key derived from the arguments maps to the previously computed result, so identical calls skip the work entirely.',
                },
                {
                  term: 'Only for pure functions',
                  detail:
                    'The technique assumes the same inputs always yield the same output, so functions with side effects or changing dependencies are unsafe to cache.',
                },
                {
                  term: 'Key generation matters',
                  detail:
                    'Serializing arguments with JSON.stringify is simple but breaks on functions, circular data, or key order differences.',
                },
                {
                  term: 'WeakMap for object keys',
                  detail:
                    'When the argument is an object, a WeakMap lets the cache entry be collected once the object is no longer used, avoiding leaks.',
                },
                {
                  term: 'Bound cache growth',
                  detail:
                    'An unbounded cache can balloon memory, so consider a size limit or eviction policy for long-lived caches.',
                },
              ],
            },
            example: "// WeakMap-based memo for object keys\nconst memo = new WeakMap();\nfunction process(obj) {\n  if (memo.has(obj)) return memo.get(obj);\n  const result = expensiveWork(obj);\n  memo.set(obj, result);\n  return result;\n}",
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 19. Design Patterns ───────────────────────────────────────────
  {
    id: 'js-design-patterns',
    title: 'Design Patterns',
    level: 1,
    slug: 'design-patterns',
    concepts: [],
    children: [
      {
        id: 'js-pattern-observer',
        title: 'Observer / Pub-Sub',
        level: 2,
        slug: 'observer-pattern',
        concepts: [
          {
            id: 'js-observer-impl',
            code: "class EventEmitter {\n  #listeners = new Map();\n  on(event, fn) {\n    if (!this.#listeners.has(event)) this.#listeners.set(event, []);\n    this.#listeners.get(event).push(fn);\n  }\n  emit(event, ...args) {\n    (this.#listeners.get(event) || []).forEach(fn => fn(...args));\n  }\n  off(event, fn) {\n    const fns = this.#listeners.get(event) || [];\n    this.#listeners.set(event, fns.filter(f => f !== fn));\n  }\n}",
            note: 'Observer pattern decouples producers from consumers. Components subscribe to events without knowing who emits them.',
            explanation: {
              heading: 'Observer and pub-sub',
              intro:
                'The observer pattern lets objects subscribe to events and get notified when something happens, without the emitter knowing who is listening. It is the backbone of event-driven code.',
              points: [
                {
                  term: 'Loose coupling',
                  detail:
                    'Emitters and listeners only share event names, so either side can change independently as long as the contract holds.',
                },
                {
                  term: 'Subscribe and unsubscribe',
                  detail:
                    'on registers a handler and off removes it; always keep the reference so you can detach and avoid leaks.',
                },
                {
                  term: 'One-to-many',
                  detail:
                    'A single emit can notify many listeners, which makes it easy to add new reactions without touching the source.',
                },
                {
                  term: 'Error isolation',
                  detail:
                    'A throwing listener can break the emit loop, so robust emitters wrap each callback so one failure does not stop the rest.',
                },
                {
                  term: 'Watch for leaks',
                  detail:
                    'Listeners that are never removed keep their captured data alive, a common memory leak in long-running apps.',
                },
              ],
            },
            example: "const bus = new EventEmitter();\nbus.on('save', data => console.log('saved', data));\nbus.emit('save', { id: 1 });",
          },
        ],
        children: [],
      },
      {
        id: 'js-pattern-singleton',
        title: 'Module / Singleton',
        level: 2,
        slug: 'singleton-pattern',
        concepts: [
          {
            id: 'js-singleton-impl',
            code: "// Module pattern (ES modules are singletons by default)\nlet instance;\nexport function getDB() {\n  if (!instance) instance = createConnection();\n  return instance;\n}",
            note: 'In ES modules, top-level state is shared across all importers — effectively a singleton. No extra pattern needed.',
            explanation: {
              heading: 'Module and singleton pattern',
              intro:
                'A singleton ensures a single shared instance across an application. In JavaScript, ES modules give you this almost for free because a module runs once and its exports are shared.',
              points: [
                {
                  term: 'Modules are singletons',
                  detail:
                    'A module is evaluated a single time and cached, so every importer sees the same top-level state and instances.',
                },
                {
                  term: 'Lazy initialization',
                  detail:
                    'Creating the instance only on first use, as getDB does, defers expensive setup until it is actually needed.',
                },
                {
                  term: 'Encapsulation',
                  detail:
                    'Keeping the instance in module scope and exposing an accessor hides construction details from callers.',
                },
                {
                  term: 'Testing caution',
                  detail:
                    'Shared mutable singletons can leak state between tests, so provide a reset or inject dependencies where testability matters.',
                },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'js-pattern-factory',
        title: 'Factory Pattern',
        level: 2,
        slug: 'factory-pattern',
        concepts: [
          {
            id: 'js-factory-impl',
            code: "function createUser(type) {\n  switch (type) {\n    case 'admin': return { role: 'admin', perms: ['all'] };\n    case 'guest': return { role: 'guest', perms: ['read'] };\n    default:     return { role: 'user', perms: ['read', 'write'] };\n  }\n}",
            note: 'Factory functions create objects without exposing construction logic. Useful when creation depends on runtime conditions.',
            explanation: {
              heading: 'The factory pattern',
              intro:
                'A factory is a function that builds and returns objects, hiding the details of which concrete shape to create. It centralizes construction so callers ask for what they want, not how to make it.',
              points: [
                {
                  term: 'Hides construction',
                  detail:
                    'Callers get a ready-to-use object without knowing the branching or setup that produced it.',
                },
                {
                  term: 'Runtime decisions',
                  detail:
                    'The factory can pick different results based on a type argument or configuration, which a plain constructor cannot do as cleanly.',
                },
                {
                  term: 'No new keyword',
                  detail:
                    'Because it is just a function returning an object, callers avoid new and the mistakes that come with forgetting it.',
                },
                {
                  term: 'Easy to extend',
                  detail:
                    'Adding a new variant means adding a branch in one place rather than changing every call site.',
                },
                {
                  term: 'Pairs with closures',
                  detail:
                    'Factories can capture private state in a closure, giving each produced object encapsulated data without classes.',
                },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 20. Performance & Web Workers ─────────────────────────────────
  {
    id: 'js-performance',
    title: 'Performance & Web Workers',
    level: 1,
    slug: 'performance',
    concepts: [],
    children: [
      {
        id: 'js-perf-techniques',
        title: 'Optimization Techniques',
        level: 2,
        slug: 'perf-techniques',
        concepts: [
          {
            id: 'js-debounce-throttle',
            code: "function debounce(fn, ms) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), ms);\n  };\n}\n\nfunction throttle(fn, ms) {\n  let last = 0;\n  return (...args) => {\n    const now = Date.now();\n    if (now - last >= ms) {\n      last = now;\n      fn(...args);\n    }\n  };\n}",
            note: 'Debounce delays execution until input stops. Throttle limits execution to once per interval. Both reduce expensive operations on rapid events.',
            explanation: {
              heading: 'Debounce and throttle',
              intro:
                'Both techniques tame functions that would otherwise fire far too often on rapid events like typing, scrolling, or resizing. They differ in exactly when they let the work through.',
              points: [
                {
                  term: 'Debounce waits for quiet',
                  detail:
                    'Debounce postpones the call until events stop for a set delay, so it runs once after the burst ends — ideal for search-as-you-type.',
                },
                {
                  term: 'Throttle paces it',
                  detail:
                    'Throttle allows at most one call per interval no matter how many events fire, which suits scroll or resize handlers.',
                },
                {
                  term: 'Timer management',
                  detail:
                    'Debounce clears and resets a timer on every event, while throttle checks elapsed time against the last run.',
                },
                {
                  term: 'Choosing between them',
                  detail:
                    'Use debounce when only the final state matters and throttle when you want steady periodic updates during the activity.',
                },
                {
                  term: 'Leading and trailing edges',
                  detail:
                    'Real-world versions often add options to fire on the first event, the last, or both, so pick behavior deliberately.',
                },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'js-web-workers',
        title: 'Web Workers',
        level: 2,
        slug: 'web-workers',
        concepts: [
          {
            id: 'js-worker-basic',
            code: "// main.js\nconst worker = new Worker('worker.js');\nworker.postMessage({ task: 'compute', data: largeArray });\nworker.onmessage = e => console.log('Result:', e.data);\n\n// worker.js\nself.onmessage = e => {\n  const result = heavyComputation(e.data.data);\n  self.postMessage(result);\n};",
            note: 'Web Workers run JavaScript on a separate thread. Communication is via `postMessage` — no shared memory (unless using SharedArrayBuffer). Ideal for CPU-heavy work.',
            explanation: {
              heading: 'Web Workers',
              intro:
                'Web Workers run scripts on a background thread so heavy computation does not freeze the user interface. The main thread and worker talk by passing messages rather than sharing variables.',
              points: [
                {
                  term: 'True parallelism',
                  detail:
                    'A worker runs on its own thread, so a long calculation there leaves the main thread free to keep the page responsive.',
                },
                {
                  term: 'Message passing',
                  detail:
                    'postMessage sends data and onmessage receives it; the data is copied, so the two sides never share the same object.',
                },
                {
                  term: 'No DOM access',
                  detail:
                    'Workers cannot touch the DOM or window, so they are best for pure computation and must send results back for rendering.',
                },
                {
                  term: 'Transferables and shared memory',
                  detail:
                    'Large buffers can be transferred to avoid copying, and SharedArrayBuffer allows real shared memory when carefully synchronized.',
                },
                {
                  term: 'When it is worth it',
                  detail:
                    'Spinning up a worker has overhead, so reserve it for genuinely CPU-heavy tasks rather than trivial work.',
                },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 21. Functional Programming ────────────────────────────────────
  {
    id: 'js-functional',
    title: 'Functional Programming',
    level: 1,
    slug: 'functional',
    concepts: [],
    children: [
      {
        id: 'js-pure-functions',
        title: 'Pure Functions & Immutability',
        level: 2,
        slug: 'pure-functions',
        concepts: [
          {
            id: 'js-pure-fn',
            code: "// Pure: same input → same output, no side effects\nconst add = (a, b) => a + b;\n\n// Immutable update\nconst updated = { ...user, age: user.age + 1 };\nconst newArr = [...items.slice(0, idx), newItem, ...items.slice(idx + 1)];",
            note: 'Pure functions are predictable and testable. Avoid mutating data — use spread/slice to create new copies instead of modifying in place.',
            explanation: {
              heading: 'Pure functions and immutability',
              intro:
                'A pure function always returns the same output for the same input and causes no side effects. Combined with immutable updates, purity makes code easier to reason about, test, and parallelize.',
              points: [
                {
                  term: 'Deterministic',
                  detail:
                    'With no hidden dependencies, the same arguments always give the same result, which makes behavior easy to predict.',
                },
                {
                  term: 'No side effects',
                  detail:
                    'A pure function does not mutate its inputs, touch global state, or perform I/O, so calling it cannot surprise other code.',
                },
                {
                  term: 'Immutable updates',
                  detail:
                    'Instead of editing data in place, create new copies with spread or slice so previous values stay intact.',
                },
                {
                  term: 'Easy to test',
                  detail:
                    'Purity means tests just check inputs against outputs, with no setup, mocks, or cleanup for external state.',
                },
                {
                  term: 'Shallow copy caveat',
                  detail:
                    'Spreading copies only the top level, so nested objects are still shared; copy the nested pieces you intend to change.',
                },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'js-composition',
        title: 'Function Composition',
        level: 2,
        slug: 'composition',
        concepts: [
          {
            id: 'js-compose-pipe',
            code: "const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);\nconst compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);\n\nconst process = pipe(\n  str => str.trim(),\n  str => str.toLowerCase(),\n  str => str.split(' '),\n);\nprocess('  Hello World  '); // ['hello', 'world']",
            note: '`pipe` applies functions left-to-right; `compose` applies right-to-left. Both build complex transformations from simple, reusable parts.',
            explanation: {
              heading: 'Function composition',
              intro:
                'Composition chains small single-purpose functions into a larger transformation, passing each result into the next. It favors building behavior from reusable parts over writing one big function.',
              points: [
                {
                  term: 'pipe reads forward',
                  detail:
                    'pipe applies functions left to right, matching the order you read them, which many find the most intuitive.',
                },
                {
                  term: 'compose reads backward',
                  detail:
                    'compose applies right to left, mirroring the mathematical notation where the innermost function runs first.',
                },
                {
                  term: 'Unary functions',
                  detail:
                    'Composition works cleanly when each step takes and returns a single value, so shape your functions that way or curry them.',
                },
                {
                  term: 'Reusability',
                  detail:
                    'Because each step is independent, you can reorder, add, or remove stages without rewriting the whole pipeline.',
                },
                {
                  term: 'Debugging tip',
                  detail:
                    'Drop a small logging function into the chain to inspect the value flowing between steps without breaking the composition.',
                },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 22. Modules & Bundling ────────────────────────────────────────
  {
    id: 'js-modules-advanced',
    title: 'Modules & Dynamic Import',
    level: 1,
    slug: 'modules-advanced',
    concepts: [],
    children: [
      {
        id: 'js-dynamic-import',
        title: 'Dynamic import() & Code Splitting',
        level: 2,
        slug: 'dynamic-import',
        concepts: [
          {
            id: 'js-dynamic-import-basic',
            code: "// Lazy load a module\nconst module = await import('./heavy-module.js');\nmodule.doWork();\n\n// Conditional import\nif (condition) {\n  const { feature } = await import('./feature.js');\n  feature();\n}",
            note: '`import()` returns a promise and loads modules at runtime. Bundlers use this for code splitting — only loading code when needed.',
            explanation: {
              heading: 'Dynamic import and code splitting',
              intro:
                'The dynamic import() form loads a module on demand and returns a promise for its exports. It lets you defer loading code until the moment it is actually needed, shrinking the initial download.',
              points: [
                {
                  term: 'Runtime loading',
                  detail:
                    'Unlike static import, import() runs during execution, so you can load a module inside a condition or after an event.',
                },
                {
                  term: 'Returns a promise',
                  detail:
                    'The call resolves to the module namespace object, so await it or use then to reach its exports.',
                },
                {
                  term: 'Code splitting',
                  detail:
                    'Bundlers split each dynamically imported module into a separate chunk that downloads only when the import runs.',
                },
                {
                  term: 'Faster first load',
                  detail:
                    'Lazy-loading rarely used features keeps the initial bundle small and improves time to interactive.',
                },
                {
                  term: 'Handle failures',
                  detail:
                    'A network error rejects the promise, so wrap the import in try/catch and show a fallback when a chunk fails to load.',
                },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 23. JSON & Serialization ──────────────────────────────────────
  {
    id: 'js-json',
    title: 'JSON & Serialization',
    level: 1,
    slug: 'json',
    concepts: [],
    children: [
      {
        id: 'js-json-methods',
        title: 'JSON.parse & JSON.stringify',
        level: 2,
        slug: 'json-methods',
        concepts: [
          {
            id: 'js-json-basic',
            code: "const obj = { name: 'Alice', age: 30, joined: new Date() };\nconst json = JSON.stringify(obj, null, 2);\nconst parsed = JSON.parse(json);\n\n// Custom replacer/reviver\nJSON.stringify(obj, (key, val) =>\n  key === 'age' ? undefined : val\n);",
            note: '`stringify` converts to JSON string (skips `undefined`, functions, Symbols). `parse` deserializes. Use replacer/reviver for custom serialization logic.',
            explanation: {
              heading: 'JSON parse and stringify',
              intro:
                'JSON is the common format for exchanging data with APIs and storage. stringify serializes a value to a JSON string and parse turns a JSON string back into JavaScript values.',
              points: [
                {
                  term: 'What stringify drops',
                  detail:
                    'undefined, functions, and symbols are omitted from objects or turned into null in arrays, since JSON cannot represent them.',
                },
                {
                  term: 'Dates become strings',
                  detail:
                    'A Date serializes to an ISO string and does not automatically revive as a Date, so reconstruct it yourself on parse.',
                },
                {
                  term: 'Replacer and reviver',
                  detail:
                    'stringify accepts a replacer to filter or transform values, and parse accepts a reviver to post-process each parsed entry.',
                },
                {
                  term: 'Pretty printing',
                  detail:
                    'Passing a spacing argument to stringify indents the output, which is handy for logs and human-readable files.',
                },
                {
                  term: 'Clone limitations',
                  detail:
                    'The stringify-then-parse clone trick only works for plain JSON-safe data and throws on circular references.',
                },
              ],
            },
            example: "// Deep clone (simple objects only)\nconst clone = JSON.parse(JSON.stringify(original));",
          },
        ],
        children: [],
      },
      {
        id: 'js-structured-clone',
        title: 'structuredClone',
        level: 2,
        slug: 'structured-clone',
        concepts: [
          {
            id: 'js-structured-clone-basic',
            code: "const original = { date: new Date(), set: new Set([1,2]), nested: { a: 1 } };\nconst clone = structuredClone(original);\nclone.nested.a = 99;\nconsole.log(original.nested.a); // 1 (independent copy)",
            note: '`structuredClone` deep-copies objects including Dates, Maps, Sets, and ArrayBuffers — unlike JSON which loses type info. Cannot clone functions or DOM nodes.',
            explanation: {
              heading: 'Deep copying with structuredClone',
              intro:
                'structuredClone is a built-in that makes a genuine deep copy of most values. It preserves types the JSON trick loses and correctly handles data structures that reference themselves.',
              points: [
                {
                  term: 'True deep copy',
                  detail:
                    'Nested objects and arrays are fully duplicated, so changing the clone never affects the original at any depth.',
                },
                {
                  term: 'Preserves rich types',
                  detail:
                    'Dates, Maps, Sets, RegExps, and ArrayBuffers survive the copy as their proper types rather than degrading to plain objects.',
                },
                {
                  term: 'Handles cycles',
                  detail:
                    'Circular references are cloned correctly, whereas JSON.stringify would throw on the same structure.',
                },
                {
                  term: 'What it cannot clone',
                  detail:
                    'Functions, DOM nodes, and class instances with custom behavior cannot be cloned and cause an error.',
                },
                {
                  term: 'When to prefer it',
                  detail:
                    'Choose it over the JSON approach whenever your data holds dates, maps, or cycles, or when correctness matters more than legacy support.',
                },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 24. Storage & Web APIs ────────────────────────────────────────
  {
    id: 'js-web-apis',
    title: 'Storage & Browser APIs',
    level: 1,
    slug: 'web-apis',
    concepts: [],
    children: [
      {
        id: 'js-localstorage',
        title: 'localStorage & sessionStorage',
        level: 2,
        slug: 'local-storage',
        concepts: [
          {
            id: 'js-storage-basic',
            code: "localStorage.setItem('theme', 'dark');\nconst theme = localStorage.getItem('theme'); // 'dark'\nlocalStorage.removeItem('theme');\n\n// Store objects\nlocalStorage.setItem('user', JSON.stringify({ id: 1, name: 'A' }));\nconst user = JSON.parse(localStorage.getItem('user'));",
            note: 'localStorage persists across sessions (~5MB limit). sessionStorage clears on tab close. Both store strings only — serialize objects with JSON.',
            explanation: {
              heading: 'Web Storage',
              intro:
                'The Web Storage API offers a simple key-value store in the browser. localStorage keeps data until it is explicitly cleared, while sessionStorage lasts only for the life of a tab.',
              points: [
                {
                  term: 'Strings only',
                  detail:
                    'Both stores hold strings, so serialize objects with JSON.stringify on the way in and JSON.parse on the way out.',
                },
                {
                  term: 'Persistence difference',
                  detail:
                    'localStorage survives reloads and restarts, whereas sessionStorage is wiped when the tab or window closes.',
                },
                {
                  term: 'Synchronous and limited',
                  detail:
                    'The API is synchronous and capped at a few megabytes, so avoid storing large data or writing on hot paths.',
                },
                {
                  term: 'Same-origin scope',
                  detail:
                    'Data is isolated per origin, so different sites cannot read each others storage.',
                },
                {
                  term: 'Never store secrets',
                  detail:
                    'Any script on the page can read storage, so keep tokens and sensitive data out of it to limit XSS damage.',
                },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'js-fetch-api',
        title: 'Fetch API',
        level: 2,
        slug: 'fetch-api',
        concepts: [
          {
            id: 'js-fetch-patterns',
            code: "const res = await fetch('/api/users', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ name: 'Alice' }),\n});\nif (!res.ok) throw new Error(`HTTP ${res.status}`);\nconst data = await res.json();",
            note: 'Fetch does not reject on HTTP errors (404, 500) — always check `res.ok`. Supports streaming via `res.body` (ReadableStream).',
            explanation: {
              heading: 'Fetch patterns',
              intro:
                'The Fetch API is the modern, promise-based way to make network requests. It is flexible and stream-capable, but it has one famous surprise: it does not treat HTTP error codes as failures.',
              points: [
                {
                  term: 'Check res.ok',
                  detail:
                    'A 404 or 500 still resolves the promise, so inspect res.ok or res.status and throw yourself when the response is an error.',
                },
                {
                  term: 'Reading the body',
                  detail:
                    'Call res.json, res.text, or res.blob to consume the body; the body is a stream you can only read once.',
                },
                {
                  term: 'Sending data',
                  detail:
                    'Set the method, headers, and a stringified body for POST and PUT requests, and include the correct Content-Type.',
                },
                {
                  term: 'Cancellation',
                  detail:
                    'Pass an AbortController signal to cancel a request, which is essential for timeouts and cleaning up on unmount.',
                },
                {
                  term: 'Network vs HTTP errors',
                  detail:
                    'The promise only rejects on network failure, so combine that catch with an explicit status check for full error handling.',
                },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 25. Optional Chaining & Nullish Coalescing ────────────────────
  {
    id: 'js-optional-chaining',
    title: 'Optional Chaining & Nullish Coalescing',
    level: 1,
    slug: 'optional-chaining',
    concepts: [],
    children: [
      {
        id: 'js-optional-syntax',
        title: 'Safe Property Access',
        level: 2,
        slug: 'safe-access',
        concepts: [
          {
            id: 'js-optional-basic',
            code: "const city = user?.address?.city;         // undefined if any link is null/undefined\nconst first = arr?.[0];\nconst result = obj?.method?.();          // calls only if method exists\n\nconst name = input ?? 'default';          // only if input is null/undefined\nconst val = 0 ?? 42;                      // 0 (not nullish)\nconst val2 = 0 || 42;                     // 42 (falsy)",
            note: '`?.` short-circuits to `undefined` on null/undefined. `??` (nullish coalescing) only falls through on `null`/`undefined`, unlike `||` which catches all falsy values.',
            explanation: {
              heading: 'Optional chaining and nullish coalescing',
              intro:
                'These two operators make working with possibly missing values far safer and shorter. Optional chaining guards deep property access, and nullish coalescing supplies fallbacks only when a value is truly absent.',
              points: [
                {
                  term: 'Short-circuit access',
                  detail:
                    'If any link before ?. is null or undefined, the whole expression stops and yields undefined instead of throwing.',
                },
                {
                  term: 'Works on calls and indexes',
                  detail:
                    'The forms ?.() and ?.[key] safely call a method or index only when the preceding value exists.',
                },
                {
                  term: 'Nullish vs falsy',
                  detail:
                    'The ?? operator falls back only on null or undefined, so valid values like 0 and empty string are preserved.',
                },
                {
                  term: 'Why not just ||',
                  detail:
                    'Using || for defaults wrongly replaces 0, false, or empty string, which is exactly the bug ?? was designed to fix.',
                },
                {
                  term: 'Do not overuse',
                  detail:
                    'Chaining ?. everywhere can hide real structural bugs, so use it where a value is genuinely optional, not to paper over unknown shapes.',
                },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 26. Testing & Debugging ───────────────────────────────────────
  {
    id: 'js-testing',
    title: 'Testing & Debugging',
    level: 1,
    slug: 'testing',
    concepts: [],
    children: [
      {
        id: 'js-unit-testing',
        title: 'Unit Testing Patterns',
        level: 2,
        slug: 'unit-testing',
        concepts: [
          {
            id: 'js-test-basic',
            code: "// Using a testing framework (Jest/Vitest)\nimport { describe, it, expect } from 'vitest';\n\ndescribe('add', () => {\n  it('adds two numbers', () => {\n    expect(add(2, 3)).toBe(5);\n  });\n  it('handles negative numbers', () => {\n    expect(add(-1, 1)).toBe(0);\n  });\n});",
            note: 'Structure tests with `describe` (group) and `it` (case). Use `expect` matchers for assertions. Aim for testing behavior, not implementation.',
            explanation: {
              heading: 'Unit testing patterns',
              intro:
                'Unit tests check small pieces of code in isolation so you can change them with confidence. A good test states an expectation clearly and fails loudly when behavior regresses.',
              points: [
                {
                  term: 'Arrange, act, assert',
                  detail:
                    'Set up inputs, run the code under test, then assert on the result; keeping these steps distinct makes tests readable.',
                },
                {
                  term: 'describe and it',
                  detail:
                    'describe groups related cases and it names a single expected behavior, so failures read like sentences.',
                },
                {
                  term: 'Test behavior, not internals',
                  detail:
                    'Assert on observable outputs rather than private details so refactors do not break otherwise-correct tests.',
                },
                {
                  term: 'Cover the edges',
                  detail:
                    'Include boundary and error cases like empty input or negatives, where bugs most often hide.',
                },
                {
                  term: 'Keep tests independent',
                  detail:
                    'Each test should set up its own state so it can run alone and in any order without depending on others.',
                },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'js-debugging',
        title: 'Debugging Techniques',
        level: 2,
        slug: 'debugging',
        concepts: [
          {
            id: 'js-debug-tools',
            code: "console.table([{a:1,b:2},{a:3,b:4}]);\nconsole.time('op'); doWork(); console.timeEnd('op');\nconsole.trace('call stack here');\n\n// Conditional breakpoint in code\nif (suspiciousValue > 100) debugger;",
            note: 'Beyond `console.log`: use `console.table` for arrays/objects, `console.time` for performance, `console.trace` for call stacks, and `debugger` for breakpoints.',
            explanation: {
              heading: 'Debugging techniques',
              intro:
                'Effective debugging is more than scattering log statements. The console offers richer tools, and breakpoints let you pause and inspect the live state of your program.',
              points: [
                {
                  term: 'Beyond console.log',
                  detail:
                    'console.table renders arrays and objects as a grid, and console.dir shows an interactive object tree that log often flattens.',
                },
                {
                  term: 'Measuring time',
                  detail:
                    'console.time and console.timeEnd bracket a block to report how long it took, handy for spotting slow sections.',
                },
                {
                  term: 'Tracing calls',
                  detail:
                    'console.trace prints the call stack at that point, which helps answer how execution reached a surprising line.',
                },
                {
                  term: 'Breakpoints and debugger',
                  detail:
                    'The debugger statement or a devtools breakpoint pauses execution so you can inspect variables and step through code.',
                },
                {
                  term: 'Conditional pausing',
                  detail:
                    'Conditional breakpoints stop only when an expression is true, saving you from stepping through many irrelevant iterations.',
                },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 27. TypedArrays & Binary Data ─────────────────────────────────
  {
    id: 'js-typed-arrays',
    title: 'TypedArrays & Binary Data',
    level: 1,
    slug: 'typed-arrays',
    concepts: [],
    children: [
      {
        id: 'js-arraybuffer',
        title: 'ArrayBuffer & Views',
        level: 2,
        slug: 'arraybuffer',
        concepts: [
          {
            id: 'js-typed-basic',
            code: "const buffer = new ArrayBuffer(16); // 16 bytes\nconst view = new Float64Array(buffer); // 2 float64 values\nview[0] = 3.14;\nview[1] = 2.71;\n\nconst uint8 = new Uint8Array([72, 101, 108, 108, 111]);\nString.fromCharCode(...uint8); // 'Hello'",
            note: 'ArrayBuffer is raw binary memory. TypedArrays (Uint8Array, Float64Array, etc.) provide typed views over buffers. Essential for WebGL, audio, and network protocols.',
            explanation: {
              heading: 'TypedArrays and binary data',
              intro:
                'When you need to work with raw bytes rather than high-level values, ArrayBuffer holds a block of memory and typed array views let you read and write it as specific numeric types.',
              points: [
                {
                  term: 'Buffer plus view',
                  detail:
                    'An ArrayBuffer is just bytes; a view like Uint8Array or Float64Array interprets those bytes as numbers of a given type.',
                },
                {
                  term: 'Fixed size and type',
                  detail:
                    'Each typed array has a set length and element type, and writing an out-of-range value wraps or clamps rather than growing the array.',
                },
                {
                  term: 'Shared underlying memory',
                  detail:
                    'Multiple views over the same buffer read the same bytes, so a change through one view is visible through another.',
                },
                {
                  term: 'DataView for mixed layouts',
                  detail:
                    'DataView reads mixed types at chosen offsets and lets you control byte order, which matters for network and file formats.',
                },
                {
                  term: 'Where they shine',
                  detail:
                    'They power WebGL, audio processing, image manipulation, and any protocol that speaks in raw bytes.',
                },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 28. WeakRef & FinalizationRegistry ────────────────────────────
  {
    id: 'js-weakref',
    title: 'WeakRef & FinalizationRegistry',
    level: 1,
    slug: 'weakref',
    concepts: [],
    children: [
      {
        id: 'js-weakref-basics',
        title: 'Weak References & Cleanup',
        level: 2,
        slug: 'weakref-basics',
        concepts: [
          {
            id: 'js-weakref-impl',
            code: "let target = { data: 'important' };\nconst ref = new WeakRef(target);\n\n// Later - may be garbage collected\nconst obj = ref.deref();\nif (obj) console.log(obj.data);\n\n// Cleanup callback\nconst registry = new FinalizationRegistry(key => {\n  console.log(`${key} was garbage collected`);\n});\nregistry.register(target, 'my-target');",
            note: 'WeakRef holds a reference that does not prevent garbage collection. FinalizationRegistry runs a callback after an object is collected. Use sparingly — GC timing is non-deterministic.',
            explanation: {
              heading: 'WeakRef and FinalizationRegistry',
              intro:
                'These advanced tools let you observe garbage collection. A WeakRef points at an object without keeping it alive, and a FinalizationRegistry can run cleanup after an object is reclaimed.',
              points: [
                {
                  term: 'Non-retaining reference',
                  detail:
                    'A WeakRef does not stop the object from being collected, so it is useful for caches that should not extend an objects lifetime.',
                },
                {
                  term: 'deref may return undefined',
                  detail:
                    'Call deref to get the object, but always handle the case where it has already been collected and returns undefined.',
                },
                {
                  term: 'Cleanup callbacks',
                  detail:
                    'FinalizationRegistry lets you register a held value and run a callback after the target is collected, for example to free an external resource.',
                },
                {
                  term: 'Non-deterministic timing',
                  detail:
                    'You cannot predict when or whether collection and callbacks run, so never depend on them for correctness-critical logic.',
                },
                {
                  term: 'Use sparingly',
                  detail:
                    'These features complicate reasoning about lifetimes, so reach for them only for genuine caching or resource-cleanup needs.',
                },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 29. Temporal & Intl (Internationalization) ────────────────────
  {
    id: 'js-intl',
    title: 'Intl & Date Formatting',
    level: 1,
    slug: 'intl',
    concepts: [],
    children: [
      {
        id: 'js-intl-format',
        title: 'Intl Formatters',
        level: 2,
        slug: 'intl-formatters',
        concepts: [
          {
            id: 'js-intl-number',
            code: "new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })\n  .format(1234.5); // '$1,234.50'\n\nnew Intl.DateTimeFormat('de-DE', { dateStyle: 'long' })\n  .format(new Date()); // '17. Juni 2024'\n\nnew Intl.RelativeTimeFormat('en', { numeric: 'auto' })\n  .format(-1, 'day'); // 'yesterday'",
            note: 'The Intl API handles locale-aware formatting for numbers, dates, and relative time without external libraries. Always specify locale explicitly for consistency.',
            explanation: {
              heading: 'Locale-aware formatting with Intl',
              intro:
                'The Intl namespace formats numbers, currencies, dates, and relative times according to a locale, so output matches what users in different regions expect without pulling in a heavy library.',
              points: [
                {
                  term: 'Formatters for each need',
                  detail:
                    'NumberFormat handles currencies and units, DateTimeFormat handles dates and times, and RelativeTimeFormat produces phrases like yesterday.',
                },
                {
                  term: 'Specify the locale',
                  detail:
                    'Passing an explicit locale keeps output consistent instead of depending on the machines default, which can vary.',
                },
                {
                  term: 'Options object',
                  detail:
                    'Options such as style, currency, and dateStyle fine-tune the output without manual string building.',
                },
                {
                  term: 'Reuse formatters',
                  detail:
                    'Creating a formatter has cost, so build it once and reuse it when formatting many values in a loop.',
                },
                {
                  term: 'Correct by default',
                  detail:
                    'Intl handles grouping separators, decimal marks, and pluralization rules that hand-rolled formatting usually gets wrong.',
                },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // ─── 30. Security & Best Practices ─────────────────────────────────
  {
    id: 'js-security',
    title: 'Security & Best Practices',
    level: 1,
    slug: 'security',
    concepts: [],
    children: [
      {
        id: 'js-xss-prevention',
        title: 'XSS & Input Sanitization',
        level: 2,
        slug: 'xss-prevention',
        concepts: [
          {
            id: 'js-xss-basic',
            code: "// DANGEROUS: never insert untrusted HTML\nel.innerHTML = userInput; // XSS vulnerability!\n\n// SAFE: use textContent or sanitize\nel.textContent = userInput;\n\n// Encode for attributes\nfunction escapeHTML(str) {\n  return str.replace(/[&<>\"']/g, c =>\n    ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '\"':'&quot;', \"'\":'&#39;' }[c])\n  );\n}",
            note: 'Never use `innerHTML` with unsanitized user input. Prefer `textContent`, template frameworks with auto-escaping, or DOMPurify for rich content.',
            explanation: {
              heading: 'Preventing XSS',
              intro:
                'Cross-site scripting happens when untrusted input is inserted into the page as markup and then executed as script. The defense is to treat user data as text and never as HTML unless it has been carefully sanitized.',
              points: [
                {
                  term: 'The core danger',
                  detail:
                    'Assigning user input to innerHTML lets an attacker inject script or event handlers that run with your pages privileges.',
                },
                {
                  term: 'Prefer textContent',
                  detail:
                    'Setting textContent inserts the value as plain text, so any tags show up literally instead of being parsed and run.',
                },
                {
                  term: 'Escape for context',
                  detail:
                    'When you must build markup, encode characters like the angle brackets and ampersand so they cannot start a tag or entity.',
                },
                {
                  term: 'Use a sanitizer',
                  detail:
                    'For genuinely rich user HTML, run it through a vetted library such as DOMPurify rather than writing your own filter.',
                },
                {
                  term: 'Defense in depth',
                  detail:
                    'A Content-Security-Policy header limits what scripts can run, reducing the damage even if a hole slips through.',
                },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'js-secure-patterns',
        title: 'Secure Coding Patterns',
        level: 2,
        slug: 'secure-patterns',
        concepts: [
          {
            id: 'js-secure-basics',
            code: "// Object.freeze for immutable config\nconst CONFIG = Object.freeze({\n  apiUrl: 'https://api.example.com',\n  timeout: 5000,\n});\n\n// Avoid eval and new Function\n// eval(userCode); // NEVER\n\n// Use Content-Security-Policy headers\n// Validate on the server, never trust client input",
            note: 'Freeze configuration objects, avoid `eval`/`new Function`, validate input server-side, use CSP headers, and follow the principle of least privilege.',
            explanation: {
              heading: 'Secure coding patterns',
              intro:
                'Security is built from many small, consistent habits rather than one big feature. A handful of defensive defaults dramatically shrinks the surface an attacker can exploit.',
              points: [
                {
                  term: 'Freeze constants',
                  detail:
                    'Object.freeze on configuration prevents accidental or malicious mutation of values other code depends on.',
                },
                {
                  term: 'Avoid eval',
                  detail:
                    'eval and new Function turn strings into runnable code, so feeding them any untrusted input invites arbitrary execution.',
                },
                {
                  term: 'Validate on the server',
                  detail:
                    'Client checks improve UX but can be bypassed, so always re-validate and authorize on the server where you control the code.',
                },
                {
                  term: 'Least privilege',
                  detail:
                    'Give code and credentials only the access they truly need, so a compromise has the smallest possible blast radius.',
                },
                {
                  term: 'Content Security Policy',
                  detail:
                    'A CSP header restricts which scripts and resources may load, acting as a strong backstop against injection attacks.',
                },
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
