// Bash / shell scripting topic tree.
//
// Each node is a ConceptNode: { id, title, level, slug, concepts[], children[] }.
// Routable nodes carry a `slug`. Every Concept renders in the fixed order
// code -> note -> example (example optional).

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  // 1. Scripts & Execution
  {
    id: 'bash-scripts-execution',
    title: 'Scripts & Execution',
    level: 1,
    slug: 'scripts-execution',
    concepts: [],
    children: [
      {
        id: 'bash-shebang',
        title: 'Shebang & Interpreters',
        level: 2,
        slug: 'shebang',
        concepts: [
          {
            id: 'bash-shebang-basic',
            code: "#!/usr/bin/env bash\necho \"Hello from Bash\"",
            note: "The shebang line on the very first line tells the kernel which interpreter should run the script. Using `#!/usr/bin/env bash` finds bash on the user's PATH, which is more portable than hard-coding `/bin/bash`. Without a shebang the script runs in whatever shell invokes it, which can behave differently.",
            explanation: {
              heading: 'How the shebang selects an interpreter',
              intro: 'The shebang is the first line of a script and starts with a hash and an exclamation mark followed by the path to an interpreter. When you run the file directly, the kernel reads this line and launches that interpreter to execute the rest of the script.',
              points: [
                { term: 'First line only', detail: 'The shebang is honored only when it is the very first line of the file with no blank lines or spaces before it.' },
                { term: 'env for portability', detail: 'Writing env bash searches the PATH for bash so the script works even when bash lives in a different directory across systems.' },
                { term: 'Direct execution', detail: 'The shebang matters when you run the script by path such as dot slash script, not when you pass it to bash by hand.' },
                { term: 'POSIX fallback', detail: 'Choosing sh instead of bash keeps a script to portable POSIX features and avoids bash-only extensions.' },
              ],
            },
            example: "#!/bin/sh\n# Use sh for POSIX-only scripts that avoid bash extensions",
          },
        ],
        children: [],
      },
      {
        id: 'bash-running',
        title: 'Running Scripts',
        level: 2,
        slug: 'running',
        concepts: [
          {
            id: 'bash-run-permissions',
            code: "chmod +x script.sh   # make it executable\n./script.sh          # run via shebang\nbash script.sh       # run explicitly with bash\nsource script.sh     # run in the current shell",
            note: "To run a script directly you first give it the execute permission with `chmod +x`. Running `./script.sh` uses the shebang to pick the interpreter, while `bash script.sh` ignores the shebang and forces bash. Using `source` (or `.`) runs the script in your current shell so its variable changes persist.",
            explanation: {
              heading: 'Four ways to run a script',
              intro: 'Bash offers several ways to execute a script, and each differs in which interpreter runs and whether the code affects your current shell. Choosing the right one depends on whether you need the script to change your environment.',
              points: [
                { term: 'Execute permission', detail: 'The chmod plus x command sets the executable bit so the file can be run by path rather than only as an argument to bash.' },
                { term: 'Run by path', detail: 'Running dot slash script uses the shebang line to pick the interpreter and runs the code in a separate child process.' },
                { term: 'Force bash', detail: 'Passing the file to bash directly ignores the shebang and always runs it with bash.' },
                { term: 'source keeps state', detail: 'Using source or the dot command runs the file in the current shell so variable assignments and directory changes persist afterward.' },
              ],
            },
            example: ". ./setenv.sh   # dot is a shorthand for source",
          },
        ],
        children: [],
      },
      {
        id: 'bash-debugging',
        title: 'Debugging Scripts',
        level: 2,
        slug: 'debugging',
        concepts: [
          {
            id: 'bash-debug-x',
            code: "bash -x script.sh    # trace every command as it runs\nset -x               # turn tracing on inside a script\nset +x               # turn tracing off again",
            note: "The `-x` option prints each command with its expanded arguments before executing it, which is invaluable for seeing what your script actually does. You can enable it for the whole run with `bash -x` or toggle it around a suspicious block using `set -x` and `set +x`. Combine it with `-v` to also echo the raw script lines.",
            explanation: {
              heading: 'Tracing execution with set minus x',
              intro: 'Bash can print a trace of every command it runs so you can watch how expansions and control flow actually behave. This turns a mysterious script into a visible step by step log without adding echo statements everywhere.',
              points: [
                { term: 'Expanded commands', detail: 'The minus x option shows each command after variable and glob expansion so you see the real arguments being used.' },
                { term: 'Whole run tracing', detail: 'Running bash with minus x traces the entire script from start to finish.' },
                { term: 'Targeted tracing', detail: 'Wrapping a block with set minus x and set plus x limits the noise to just the suspicious section.' },
                { term: 'Combine with verbose', detail: 'Adding the minus v option also echoes the raw source lines before they are expanded.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 2. Variables & Expansion
  {
    id: 'bash-variables-expansion',
    title: 'Variables & Expansion',
    level: 1,
    slug: 'variables-expansion',
    concepts: [],
    children: [
      {
        id: 'bash-variables',
        title: 'Variables & Quoting',
        level: 2,
        slug: 'variables',
        concepts: [
          {
            id: 'bash-vars-assign',
            code: "name=\"World\"\ngreeting='Hello'\necho \"$greeting, $name\"\necho 'Literal: $name'",
            note: "Assign variables with `name=value` and no spaces around the equals sign, or bash treats it as a command. Double quotes allow variable expansion while single quotes keep every character literal. Always quote your expansions with `\"$name\"` to protect against word splitting and globbing.",
            explanation: {
              heading: 'Assignment and quoting rules',
              intro: 'Bash variables are assigned with a name, an equals sign, and a value with no surrounding spaces, and they are read back by prefixing the name with a dollar sign. The kind of quotes you wrap around a value or expansion decides whether bash expands it or treats it literally.',
              points: [
                { term: 'No spaces', detail: 'Spaces around the equals sign make bash read the name as a command instead of an assignment.' },
                { term: 'Double quotes expand', detail: 'Text inside double quotes still expands variables and command substitutions while keeping the value as one word.' },
                { term: 'Single quotes are literal', detail: 'Text inside single quotes is taken exactly as written with no expansion of any kind.' },
                { term: 'Quote expansions', detail: 'Wrapping an expansion in double quotes prevents word splitting and glob expansion of the value.' },
              ],
            },
            example: "count=5   # correct\ncount = 5 # WRONG: runs the command 'count' with args '=' and '5'",
          },
          {
            id: 'bash-vars-readonly',
            code: "readonly PI=3.14159\nlocal tmp=\"scratch\"   # only valid inside a function\nunset name             # remove a variable",
            note: "`readonly` marks a variable as constant so later assignments fail, which guards important configuration. Inside a function, `local` keeps a variable scoped to that function instead of leaking into the global namespace. `unset` removes a variable entirely.",
            explanation: {
              heading: 'Controlling variable scope and lifetime',
              intro: 'Bash gives you keywords to constrain how a variable can change and where it can be seen. Using them makes scripts safer and prevents functions from accidentally clobbering shared state.',
              points: [
                { term: 'readonly constants', detail: 'Marking a variable readonly makes any later assignment to it fail so important values cannot be overwritten.' },
                { term: 'local scoping', detail: 'Declaring a variable local inside a function keeps it out of the global namespace and confined to that function.' },
                { term: 'unset removes', detail: 'The unset builtin deletes a variable entirely so a later reference behaves as if it was never set.' },
                { term: 'Function safety', detail: 'Combining local with quoting avoids surprising interactions between a function and the caller variables.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'bash-command-substitution',
        title: 'Command Substitution',
        level: 2,
        slug: 'command-substitution',
        concepts: [
          {
            id: 'bash-cmdsub-basic',
            code: "today=$(date +%Y-%m-%d)\nfiles=$(ls | wc -l)\necho \"On $today there are $files files\"",
            note: "Command substitution runs a command and replaces it with its standard output. Prefer the `$( )` form over legacy backticks because it nests cleanly and is easier to read. The trailing newline of the captured output is stripped automatically.",
            explanation: {
              heading: 'Capturing command output into a value',
              intro: 'Command substitution runs a command and substitutes its standard output right into the surrounding line. This lets you store the result of a program in a variable or pass it as an argument to another command.',
              points: [
                { term: 'Dollar parentheses form', detail: 'Wrapping a command in a dollar sign and parentheses captures its standard output as text.' },
                { term: 'Prefer over backticks', detail: 'The dollar parentheses form nests cleanly inside itself and is far easier to read than the older backtick syntax.' },
                { term: 'Trailing newline stripped', detail: 'Bash removes trailing newlines from the captured output so the value is clean for reuse.' },
                { term: 'Quote the result', detail: 'Assigning the result to a quoted expansion protects it from word splitting when it contains spaces.' },
              ],
            },
            example: "kernel=$(uname -r)\nnested=$(echo \"outer $(echo inner)\")",
          },
        ],
        children: [],
      },
      {
        id: 'bash-parameter-expansion',
        title: 'Parameter Expansion',
        level: 2,
        slug: 'parameter-expansion',
        concepts: [
          {
            id: 'bash-paramexp-defaults',
            code: "echo \"${name:-guest}\"      # use 'guest' if name is unset/empty\necho \"${name:=guest}\"      # assign 'guest' if unset/empty\necho \"${config:?must be set}\" # error out if unset/empty",
            note: "Parameter expansion lets you supply defaults and validate variables inline. `${var:-word}` substitutes a fallback without changing var, while `${var:=word}` also assigns it. `${var:?message}` exits with the given error when var is empty, which is great for required inputs.",
            explanation: {
              heading: 'Defaults and required values',
              intro: 'Parameter expansion can supply fallback values or enforce that a variable is set, all inside the braces without a separate if statement. This keeps input handling compact and reliable.',
              points: [
                { term: 'Fallback value', detail: 'The colon minus form substitutes a default word when the variable is unset or empty but leaves the variable unchanged.' },
                { term: 'Assign default', detail: 'The colon equals form substitutes a default and also assigns it back to the variable for later use.' },
                { term: 'Require value', detail: 'The colon question mark form prints the given message and exits when the variable is unset or empty.' },
                { term: 'Guard required input', detail: 'These forms make missing configuration fail loudly rather than silently producing an empty string.' },
              ],
            },
          },
          {
            id: 'bash-paramexp-slicing',
            code: "path=\"/home/user/file.txt\"\necho \"${path##*/}\"   # file.txt  (strip longest leading match)\necho \"${path%/*}\"    # /home/user (strip shortest trailing match)\necho \"${path%.txt}\"  # /home/user/file (strip extension)\necho \"${path/user/admin}\" # replace first match",
            note: "Bash can slice and edit strings without external tools. `#`/`##` remove matching text from the front and `%`/`%%` from the back, with the doubled form being greedy. The `${var/old/new}` form does search-and-replace, and `${var//old/new}` replaces every occurrence.",
            explanation: {
              heading: 'Trimming and replacing inside strings',
              intro: 'Bash can strip prefixes and suffixes and perform substitutions on a variable purely through parameter expansion. This avoids spawning external tools and is fast and portable within bash.',
              points: [
                { term: 'Strip from front', detail: 'A single hash removes the shortest match from the start of the value and a double hash removes the longest match.' },
                { term: 'Strip from back', detail: 'A single percent removes the shortest match from the end and a double percent removes the longest match.' },
                { term: 'Replace first', detail: 'The slash old slash new form replaces only the first occurrence of the pattern.' },
                { term: 'Replace all', detail: 'The double slash form replaces every occurrence of the pattern in the value.' },
              ],
            },
            example: "name=\"report.tar.gz\"\necho \"${name%%.*}\"  # report  (strip everything from first dot)",
          },
          {
            id: 'bash-paramexp-length',
            code: "word=\"bash\"\necho \"${#word}\"       # 4 (length)\necho \"${word:1:2}\"    # 'as' (substring: offset 1, length 2)\necho \"${word^^}\"      # BASH (uppercase)\necho \"${word,,}\"      # bash (lowercase)",
            note: "`${#var}` gives the length of a string, and `${var:offset:length}` extracts a substring. The `^^` and `,,` operators change case for the whole value, while single `^` and `,` change only the first character. These are pure-bash operations that avoid spawning `wc` or `tr`.",
            explanation: {
              heading: 'Length, substrings, and case',
              intro: 'Parameter expansion also reports the length of a value, cuts out a substring, and changes letter case. These operations run inside bash so no external command is needed.',
              points: [
                { term: 'String length', detail: 'The hash inside the braces before the name expands to the number of characters in the value.' },
                { term: 'Substring slice', detail: 'The offset and length form extracts part of the value starting at a zero based position.' },
                { term: 'Full case change', detail: 'The doubled caret uppercases the whole value and the doubled comma lowercases it.' },
                { term: 'First character', detail: 'A single caret or comma changes only the first character rather than the entire string.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'bash-arithmetic',
        title: 'Arithmetic',
        level: 2,
        slug: 'arithmetic',
        concepts: [
          {
            id: 'bash-arith-basic',
            code: "a=7\nb=2\necho $(( a + b ))    # 9\necho $(( a * b ))    # 14\necho $(( a / b ))    # 3 (integer division)\necho $(( a % b ))    # 1 (remainder)\n(( count++ ))        # increment in place",
            note: "Arithmetic happens inside `$(( ))` for a value or `(( ))` as a statement. Bash arithmetic is integer only, so division truncates toward zero. Inside these constructs you can reference variables without the `$` prefix and use C-style operators like `++`, `+=`, and comparisons.",
            explanation: {
              heading: 'Integer math in bash',
              intro: 'Bash evaluates integer arithmetic inside dedicated double parenthesis constructs. One form yields a value you can capture while the other runs as a statement whose exit status reflects the result.',
              points: [
                { term: 'Value form', detail: 'The dollar sign with double parentheses evaluates an expression and expands to its numeric result.' },
                { term: 'Statement form', detail: 'Plain double parentheses run arithmetic for its side effects and set a success status when the result is non zero.' },
                { term: 'Integer only', detail: 'Bash arithmetic works only with whole numbers so division discards any fractional part.' },
                { term: 'Bare variable names', detail: 'Inside these constructs you can reference variables without the dollar sign and use C style operators.' },
              ],
            },
            example: "if (( a > b )); then echo \"a is larger\"; fi",
          },
        ],
        children: [],
      },
    ],
  },

  // 3. Arrays
  {
    id: 'bash-arrays',
    title: 'Arrays',
    level: 1,
    slug: 'arrays',
    concepts: [],
    children: [
      {
        id: 'bash-indexed-arrays',
        title: 'Indexed Arrays',
        level: 2,
        slug: 'indexed-arrays',
        concepts: [
          {
            id: 'bash-array-index',
            code: "fruits=(apple banana cherry)\necho \"${fruits[0]}\"      # apple\nfruits+=(date)           # append\necho \"${fruits[@]}\"      # all elements\necho \"${#fruits[@]}\"     # 4 (count)",
            note: "Indexed arrays are created with parentheses and accessed by numeric subscript starting at zero. Use `${arr[@]}` to expand every element and `${#arr[@]}` for the count. Always quote `\"${arr[@]}\"` so elements containing spaces stay intact when iterating.",
            explanation: {
              heading: 'Ordered lists with numeric keys',
              intro: 'Indexed arrays store an ordered list of values addressed by a number starting at zero. Bash provides special expansions to read a single element, all elements, or the total count.',
              points: [
                { term: 'Create with parentheses', detail: 'Wrapping a space separated list in parentheses builds an array with elements numbered from zero.' },
                { term: 'Expand all elements', detail: 'The at sign subscript expands to every element and the hash with at sign gives the element count.' },
                { term: 'Append elements', detail: 'The plus equals operator adds one or more elements to the end of an existing array.' },
                { term: 'Quote for iteration', detail: 'Quoting the at sign expansion keeps elements that contain spaces intact when looping over them.' },
              ],
            },
            example: "for f in \"${fruits[@]}\"; do\n  echo \"$f\"\ndone",
          },
        ],
        children: [],
      },
      {
        id: 'bash-associative-arrays',
        title: 'Associative Arrays',
        level: 2,
        slug: 'associative-arrays',
        concepts: [
          {
            id: 'bash-array-assoc',
            code: "declare -A colors\ncolors[apple]=red\ncolors[lime]=green\necho \"${colors[apple]}\"     # red\nfor key in \"${!colors[@]}\"; do\n  echo \"$key => ${colors[$key]}\"\ndone",
            note: "Associative arrays map string keys to values and require `declare -A` before use (bash 4+). Access values by key with `${arr[key]}` and get the list of keys with `${!arr[@]}`. They are perfect for lookup tables and counting occurrences.",
            explanation: {
              heading: 'Key to value lookup tables',
              intro: 'Associative arrays map arbitrary string keys to values, much like a dictionary in other languages. They must be declared explicitly and are available in bash version four and later.',
              points: [
                { term: 'Declare first', detail: 'The declare command with a capital A creates an associative array before any keys are assigned.' },
                { term: 'Access by key', detail: 'Reading the array with a string key inside the subscript returns the value stored under that key.' },
                { term: 'List the keys', detail: 'The exclamation mark with the at sign subscript expands to all the keys in the array.' },
                { term: 'Ideal for counting', detail: 'Keys make them well suited to lookup tables and tallying how often each value appears.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 4. Conditionals & Tests
  {
    id: 'bash-conditionals-tests',
    title: 'Conditionals & Tests',
    level: 1,
    slug: 'conditionals-tests',
    concepts: [],
    children: [
      {
        id: 'bash-test-conditions',
        title: 'test & [[ ]]',
        level: 2,
        slug: 'test-conditions',
        concepts: [
          {
            id: 'bash-test-numeric',
            code: "x=10\nif [[ $x -gt 5 ]]; then\n  echo \"big\"\nelif [[ $x -eq 5 ]]; then\n  echo \"exactly five\"\nelse\n  echo \"small\"\nfi",
            note: "`[[ ]]` is bash's preferred conditional construct because it avoids many quoting pitfalls of the older `[ ]`. Numeric comparisons use `-eq`, `-ne`, `-lt`, `-le`, `-gt`, and `-ge`. The `if`/`elif`/`else`/`fi` structure branches on the exit status of the test.",
            explanation: {
              heading: 'Testing conditions with double brackets',
              intro: 'The double square bracket construct is the modern bash way to evaluate a condition and produce a success or failure status. An if statement then branches on that status to choose which block to run.',
              points: [
                { term: 'Safer than single brackets', detail: 'The double bracket form avoids many word splitting and globbing pitfalls that trip up the older single bracket test.' },
                { term: 'Numeric operators', detail: 'Comparisons like minus gt and minus eq compare integers rather than strings.' },
                { term: 'Branch on status', detail: 'The if elif else fi structure runs each block based on whether the test succeeds.' },
                { term: 'Exit status driven', detail: 'A condition succeeds when the test returns a zero exit status and fails otherwise.' },
              ],
            },
            example: "if (( x > 5 )); then echo \"arithmetic form\"; fi",
          },
          {
            id: 'bash-test-files',
            code: "if [[ -f config.txt ]]; then echo \"file exists\"; fi\nif [[ -d /tmp ]]; then echo \"directory exists\"; fi\nif [[ -r data && -w data ]]; then echo \"readable & writable\"; fi\nif [[ -z \"$var\" ]]; then echo \"var is empty\"; fi",
            note: "File test operators let scripts react to the filesystem: `-f` checks a regular file, `-d` a directory, `-e` any path, and `-r`/`-w`/`-x` test permissions. String tests `-z` and `-n` check for empty and non-empty values. Combine tests with `&&` and `||` inside `[[ ]]`.",
            explanation: {
              heading: 'File and string tests',
              intro: 'Bash provides operators that inspect the filesystem and check string contents so scripts can react to what actually exists. These tests are placed inside the double bracket construct.',
              points: [
                { term: 'File type checks', detail: 'The minus f operator tests for a regular file, minus d for a directory, and minus e for any path that exists.' },
                { term: 'Permission checks', detail: 'The minus r, minus w, and minus x operators test read, write, and execute permission on a path.' },
                { term: 'Empty string checks', detail: 'The minus z operator succeeds when a value is empty and minus n when it is non empty.' },
                { term: 'Combine conditions', detail: 'The and and or operators join several tests together inside the same double bracket.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'bash-string-comparison',
        title: 'String Comparison',
        level: 2,
        slug: 'string-comparison',
        concepts: [
          {
            id: 'bash-string-compare',
            code: "a=\"hello\"\nif [[ $a == \"hello\" ]]; then echo \"equal\"; fi\nif [[ $a != \"world\" ]]; then echo \"not equal\"; fi\nif [[ $a < \"world\" ]]; then echo \"a sorts first\"; fi\nif [[ $a == h* ]]; then echo \"starts with h\"; fi",
            note: "Inside `[[ ]]` use `==` and `!=` for string equality and `<`/`>` for lexical ordering. The right side of `==` is treated as a glob pattern unless quoted, so `$a == h*` matches any value starting with h. Quote the pattern to force a literal comparison.",
            explanation: {
              heading: 'Comparing strings',
              intro: 'The double bracket construct compares strings for equality and lexical order, and it can also match against glob patterns. Whether you quote the right side decides between pattern matching and a literal comparison.',
              points: [
                { term: 'Equality operators', detail: 'The double equals tests for equal strings and the exclamation equals tests for unequal strings.' },
                { term: 'Lexical ordering', detail: 'The less than and greater than operators compare strings by their sort order.' },
                { term: 'Pattern on the right', detail: 'An unquoted right side of the double equals is treated as a glob pattern so a trailing star matches any suffix.' },
                { term: 'Quote for literal', detail: 'Quoting the right side forces an exact character by character comparison instead of pattern matching.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'bash-case',
        title: 'case Statements',
        level: 2,
        slug: 'case',
        concepts: [
          {
            id: 'bash-case-basic',
            code: "case \"$1\" in\n  start)  echo \"starting\" ;;\n  stop)   echo \"stopping\" ;;\n  *.log)  echo \"a log file\" ;;\n  *)      echo \"unknown\" ;;\nesac",
            note: "`case` matches a value against glob-style patterns, which is cleaner than a long `if`/`elif` chain. Each branch ends with `;;`, and the `*)` catch-all handles anything unmatched. Patterns can use `*`, `?`, and `[...]`, and you can match several with `pattern1|pattern2)`.",
            explanation: {
              heading: 'Branching on patterns',
              intro: 'A case statement compares one value against a series of glob style patterns and runs the first branch that matches. It reads much more cleanly than a long chain of if and elif tests.',
              points: [
                { term: 'Glob patterns', detail: 'Each branch pattern may use star, question mark, and bracket ranges just like filename globbing.' },
                { term: 'Branch terminator', detail: 'Two semicolons close each branch so bash knows where one set of commands ends.' },
                { term: 'Catch all', detail: 'A branch with a lone star matches anything and is used as the default case at the end.' },
                { term: 'Multiple patterns', detail: 'Joining patterns with a pipe lets one branch match several alternatives.' },
              ],
            },
            example: "case \"$answer\" in\n  y|Y|yes) echo \"confirmed\" ;;\n  *)       echo \"cancelled\" ;;\nesac",
          },
        ],
        children: [],
      },
    ],
  },

  // 5. Loops
  {
    id: 'bash-loops',
    title: 'Loops',
    level: 1,
    slug: 'loops',
    concepts: [],
    children: [
      {
        id: 'bash-for-loops',
        title: 'for Loops',
        level: 2,
        slug: 'for-loops',
        concepts: [
          {
            id: 'bash-for-list',
            code: "for name in alice bob carol; do\n  echo \"Hi $name\"\ndone\n\nfor f in *.txt; do\n  echo \"Processing $f\"\ndone\n\nfor i in {1..5}; do\n  echo \"$i\"\ndone",
            note: "The `for` loop iterates over a list of words, a glob expansion, or a brace range like `{1..5}`. When looping over filenames from a glob, quote `\"$f\"` so names with spaces are handled correctly. A glob that matches nothing expands to itself unless `nullglob` is set.",
            explanation: {
              heading: 'Iterating over a list',
              intro: 'A for loop walks through a list of words one at a time, binding each to a loop variable. The list can be literal words, the result of a glob, or a generated range.',
              points: [
                { term: 'Word list', detail: 'The loop assigns each word in the list to the loop variable for one pass of the body.' },
                { term: 'Glob expansion', detail: 'A glob pattern in the list expands to matching filenames before the loop begins.' },
                { term: 'Brace range', detail: 'A brace range like one dot dot five generates a sequence of numbers to loop over.' },
                { term: 'Quote the variable', detail: 'Quoting the loop variable keeps filenames with spaces from splitting into multiple iterations.' },
              ],
            },
            example: "for (( i = 0; i < 3; i++ )); do\n  echo \"C-style index $i\"\ndone",
          },
        ],
        children: [],
      },
      {
        id: 'bash-while-until',
        title: 'while & until',
        level: 2,
        slug: 'while-until',
        concepts: [
          {
            id: 'bash-while-read',
            code: "count=0\nwhile (( count < 3 )); do\n  echo \"count=$count\"\n  (( count++ ))\ndone\n\nwhile IFS= read -r line; do\n  echo \"line: $line\"\ndone < input.txt",
            note: "A `while` loop repeats as long as its condition succeeds, and `until` repeats until its condition succeeds. The idiom `while IFS= read -r line` is the safe way to read a file line by line: `IFS=` preserves leading whitespace and `-r` stops backslash mangling. Feed the file in with a redirection after `done`.",
            explanation: {
              heading: 'Condition driven loops',
              intro: 'A while loop repeats its body as long as a condition keeps succeeding, and until is its mirror image that repeats until the condition succeeds. A common use is reading a file one line at a time.',
              points: [
                { term: 'while repeats on success', detail: 'The body runs again each time the condition returns a success status.' },
                { term: 'until repeats on failure', detail: 'The until loop keeps running until its condition finally succeeds.' },
                { term: 'Safe line reading', detail: 'Clearing IFS and passing minus r to read preserves leading whitespace and stops backslash mangling.' },
                { term: 'Redirect the input', detail: 'A redirection placed after the done keyword feeds a file into the loop body.' },
              ],
            },
            example: "until ping -c1 host >/dev/null 2>&1; do\n  echo \"waiting for host\"\n  sleep 1\ndone",
          },
          {
            id: 'bash-loop-control',
            code: "for i in {1..10}; do\n  (( i == 3 )) && continue   # skip 3\n  (( i == 6 )) && break      # stop at 6\n  echo \"$i\"\ndone",
            note: "`break` exits the enclosing loop immediately, while `continue` skips to the next iteration. Both accept an optional number to affect an outer loop, such as `break 2`. Use them to short-circuit work once a condition is met.",
            explanation: {
              heading: 'Controlling loop flow',
              intro: 'Bash lets you alter the normal flow of a loop with two builtins that either stop it or skip ahead. They make it easy to short circuit work as soon as a condition is met.',
              points: [
                { term: 'break exits', detail: 'The break builtin leaves the enclosing loop immediately and continues after it.' },
                { term: 'continue skips', detail: 'The continue builtin abandons the current iteration and jumps to the next one.' },
                { term: 'Level argument', detail: 'Both accept a number to act on an outer loop, so break two exits two levels of loops.' },
                { term: 'Combine with tests', detail: 'Pairing them with a condition using the and operator gives concise early exits.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 6. Functions & Arguments
  {
    id: 'bash-functions-arguments',
    title: 'Functions & Arguments',
    level: 1,
    slug: 'functions-arguments',
    concepts: [],
    children: [
      {
        id: 'bash-functions',
        title: 'Defining Functions',
        level: 2,
        slug: 'functions',
        concepts: [
          {
            id: 'bash-func-basic',
            code: "greet() {\n  local who=\"$1\"\n  echo \"Hello, $who\"\n}\n\ngreet \"World\"",
            note: "Define a function with `name() { ... }` and call it like any command, passing arguments after the name. Use `local` for internal variables so they do not clobber globals. A function returns the exit status of its last command unless you use `return` with an explicit code.",
            explanation: {
              heading: 'Defining and calling functions',
              intro: 'A bash function bundles commands under a name so you can reuse them by calling the name like any other command. Arguments are passed positionally and internal variables should be scoped to avoid side effects.',
              points: [
                { term: 'Definition syntax', detail: 'Writing the name followed by empty parentheses and a brace block defines a reusable function.' },
                { term: 'Positional arguments', detail: 'Words after the function name become the positional parameters inside the body.' },
                { term: 'Local variables', detail: 'Declaring variables local keeps them from clobbering values in the surrounding script.' },
                { term: 'Implicit status', detail: 'A function returns the exit status of its last command unless return supplies an explicit code.' },
              ],
            },
            example: "sum() {\n  echo $(( $1 + $2 ))\n}\nresult=$(sum 3 4)   # capture output",
          },
          {
            id: 'bash-func-return',
            code: "is_even() {\n  (( $1 % 2 == 0 ))   # exit status becomes the result\n}\n\nif is_even 4; then\n  echo \"even\"\nfi",
            note: "Functions communicate success through their exit status, where 0 means success and non-zero means failure. Return a status explicitly with `return N`, and print data on stdout to capture it with command substitution. Avoid using `return` for large values since it only carries 0-255.",
            explanation: {
              heading: 'Returning results from functions',
              intro: 'A bash function reports success or failure through a small exit status, not a rich return value. To hand back real data you print it and capture the output with command substitution.',
              points: [
                { term: 'Status convention', detail: 'A zero status means success and any non zero value means failure.' },
                { term: 'Explicit return', detail: 'The return builtin ends the function with a chosen status code.' },
                { term: 'Data through stdout', detail: 'Printing a value on standard output lets the caller capture it with command substitution.' },
                { term: 'Limited range', detail: 'A returned status only fits values from zero to two hundred fifty five so it is unsuitable for large numbers.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'bash-positional-parameters',
        title: 'Positional Parameters',
        level: 2,
        slug: 'positional-parameters',
        concepts: [
          {
            id: 'bash-positional',
            code: "echo \"script name: $0\"\necho \"first arg:   $1\"\necho \"arg count:   $#\"\necho \"all args:    $@\"\nshift                # drop $1, shift the rest left",
            note: "Inside a script or function `$1`, `$2`, and so on hold the positional arguments, `$0` is the script name, and `$#` is how many arguments were given. Always quote `\"$@\"` to expand each argument as a separate word, which is what you almost always want. `shift` discards the first argument so you can process them in a loop.",
            explanation: {
              heading: 'Reading arguments passed to a script',
              intro: 'When a script or function runs, its arguments are available through numbered positional parameters along with a few special variables. Quoting them correctly keeps arguments with spaces intact.',
              points: [
                { term: 'Numbered parameters', detail: 'The variables dollar one and dollar two hold the first and second arguments in order.' },
                { term: 'Name and count', detail: 'Dollar zero holds the script name and dollar hash holds how many arguments were given.' },
                { term: 'Quote the at sign', detail: 'Quoting the dollar at sign expands each argument as its own separate word.' },
                { term: 'shift consumes', detail: 'The shift builtin drops the first argument and moves the rest down so they can be processed in a loop.' },
              ],
            },
            example: "for arg in \"$@\"; do\n  echo \"got: $arg\"\ndone",
          },
          {
            id: 'bash-at-vs-star',
            code: "printf '[%s]\\n' \"$@\"   # one bracket per argument\nprintf '[%s]\\n' \"$*\"   # all arguments joined by IFS",
            note: "`\"$@\"` and `\"$*\"` look similar but differ when quoted: `\"$@\"` preserves each argument as its own word, while `\"$*\"` joins them into a single string separated by the first character of IFS (a space by default). Reach for `\"$@\"` when forwarding arguments and `\"$*\"` only when you want one combined string.",
            explanation: {
              heading: 'The at sign versus the star',
              intro: 'The at sign and star special parameters both stand for all positional arguments, but they behave very differently once you quote them. Knowing the difference avoids subtle bugs when forwarding arguments.',
              points: [
                { term: 'Quoted at sign', detail: 'The quoted at sign expands each argument into its own separate word.' },
                { term: 'Quoted star', detail: 'The quoted star joins all arguments into a single string separated by the first character of IFS.' },
                { term: 'Default separator', detail: 'That separator is a space unless IFS has been changed.' },
                { term: 'Pick the right one', detail: 'Use the at sign when forwarding arguments and the star only when you truly want one combined string.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'bash-exit-codes',
        title: 'Exit Codes & $?',
        level: 2,
        slug: 'exit-codes',
        concepts: [
          {
            id: 'bash-exit-status',
            code: "grep -q \"pattern\" file.txt\nif [[ $? -eq 0 ]]; then\n  echo \"found\"\nfi\n\nexit 1   # end the script with a failure status",
            note: "Every command sets `$?` to its exit status: 0 for success and non-zero for failure. Check it right after the command since the next command overwrites it, or better, test the command directly in an `if`. Use `exit N` to end your script with a meaningful status for callers and CI systems.",
            explanation: {
              heading: 'Exit status and the question mark variable',
              intro: 'Every command finishes with an exit status that signals whether it succeeded, and bash stores the most recent one in a special variable. Scripts use this status to make decisions and to report their own result.',
              points: [
                { term: 'Status variable', detail: 'The dollar question mark variable holds the exit status of the command that just ran.' },
                { term: 'Zero is success', detail: 'A status of zero means success and any non zero value indicates a failure.' },
                { term: 'Check immediately', detail: 'The next command overwrites the variable so test it right away or test the command directly in an if.' },
                { term: 'Exit with meaning', detail: 'The exit builtin ends the script with a chosen status that callers and CI systems can act on.' },
              ],
            },
            example: "command || exit 1   # bail out if command fails",
          },
        ],
        children: [],
      },
    ],
  },

  // 7. Redirection & Pipes
  {
    id: 'bash-redirection-pipes',
    title: 'Redirection & Pipes',
    level: 1,
    slug: 'redirection-pipes',
    concepts: [],
    children: [
      {
        id: 'bash-redirection',
        title: 'Redirection',
        level: 2,
        slug: 'redirection',
        concepts: [
          {
            id: 'bash-redirect-basic',
            code: "echo \"log entry\" > out.txt      # overwrite stdout to file\necho \"more\" >> out.txt          # append\ncommand 2> errors.txt           # redirect stderr\ncommand > all.txt 2>&1           # merge stderr into stdout\ncommand < input.txt             # feed stdin from a file",
            note: "Redirection sends a command's streams to or from files. `>` overwrites while `>>` appends, and file descriptor 2 is stderr, so `2>` captures errors separately. The order matters in `> all.txt 2>&1`: stdout is pointed at the file first, then stderr is pointed at wherever stdout goes.",
            explanation: {
              heading: 'Redirecting input and output streams',
              intro: 'Redirection connects a command standard streams to files instead of the terminal. Each stream has a numeric file descriptor, and the order of redirections controls where each one ends up.',
              points: [
                { term: 'Overwrite and append', detail: 'A single greater than overwrites a file while a double greater than appends to it.' },
                { term: 'Standard error', detail: 'File descriptor two is standard error so a two followed by greater than captures error output separately.' },
                { term: 'Merge streams', detail: 'The two greater than ampersand one form sends standard error to wherever standard output currently points.' },
                { term: 'Order matters', detail: 'Standard output must be redirected to the file before merging error into it or the two diverge.' },
              ],
            },
            example: "command >/dev/null 2>&1   # discard all output",
          },
        ],
        children: [],
      },
      {
        id: 'bash-pipes',
        title: 'Pipes',
        level: 2,
        slug: 'pipes',
        concepts: [
          {
            id: 'bash-pipe-chain',
            code: "cat access.log | grep 'ERROR' | awk '{print $1}' | sort | uniq -c | sort -rn",
            note: "A pipe `|` connects the stdout of one command to the stdin of the next, letting you build powerful data pipelines from small tools. This chain filters errors, extracts the first field, then counts and ranks unique values. Each stage runs concurrently, streaming data as it becomes available.",
            explanation: {
              heading: 'Building pipelines with pipes',
              intro: 'A pipe connects the standard output of one command to the standard input of the next, letting you compose small tools into a larger data pipeline. Stages run at the same time and stream data as it flows through.',
              points: [
                { term: 'Connect streams', detail: 'The pipe sends the output of the command on its left as input to the command on its right.' },
                { term: 'Compose small tools', detail: 'Chaining focused commands like filter, extract, and count builds complex processing from simple parts.' },
                { term: 'Concurrent stages', detail: 'Each stage runs as its own process and works on data as soon as it arrives.' },
                { term: 'Fail with pipefail', detail: 'Enabling the pipefail option makes the pipeline report failure if any stage fails, not just the last one.' },
              ],
            },
            example: "set -o pipefail   # make a pipeline fail if any stage fails",
          },
        ],
        children: [],
      },
      {
        id: 'bash-heredocs',
        title: 'Here-Documents',
        level: 2,
        slug: 'heredocs',
        concepts: [
          {
            id: 'bash-heredoc-basic',
            code: "cat <<EOF\nUser: $USER\nHome: $HOME\nEOF\n\ncat <<'EOF'\nLiteral $USER, no expansion here\nEOF",
            note: "A here-document feeds a block of inline text to a command's stdin until it sees the delimiter word. Variables and command substitutions expand normally, but quoting the delimiter as `'EOF'` disables expansion for literal blocks. Use `<<-` to allow leading tabs so you can indent the block neatly.",
            explanation: {
              heading: 'Feeding inline text as input',
              intro: 'A here document supplies a multi line block of text to a command standard input right inside the script. Bash reads everything up to a chosen delimiter word and passes it along.',
              points: [
                { term: 'Delimiter word', detail: 'Text is fed to the command until bash sees the delimiter word alone on a line.' },
                { term: 'Expansion by default', detail: 'Variables and command substitutions inside the block expand just like in double quotes.' },
                { term: 'Quote to disable', detail: 'Quoting the delimiter turns off all expansion so the block is treated literally.' },
                { term: 'Indent with dash', detail: 'The dash form of the operator strips leading tabs so the block can be indented neatly.' },
              ],
            },
            example: "grep name <<< \"one-line here-string\"   # here-string with <<<",
          },
        ],
        children: [],
      },
    ],
  },

  // 8. Globbing & Pattern Matching
  {
    id: 'bash-globbing-patterns',
    title: 'Globbing & Pattern Matching',
    level: 1,
    slug: 'globbing-patterns',
    concepts: [],
    children: [
      {
        id: 'bash-globbing',
        title: 'Globbing & Wildcards',
        level: 2,
        slug: 'globbing',
        concepts: [
          {
            id: 'bash-glob-basic',
            code: "ls *.txt          # any name ending in .txt\nls file?.log      # single-character wildcard\nls img[0-9].png   # a digit in the bracket range\nshopt -s globstar\nls **/*.js        # recursive match with globstar",
            note: "Globs let the shell expand patterns into matching filenames before running a command. `*` matches any run of characters, `?` matches exactly one, and `[...]` matches a character class. Enabling `globstar` makes `**` recurse into subdirectories, and `nullglob` makes a non-matching pattern expand to nothing instead of itself.",
            explanation: {
              heading: 'Matching filenames with globs',
              intro: 'Globbing is how the shell turns a wildcard pattern into a list of matching filenames before the command runs. This pathname expansion happens automatically unless you quote the pattern.',
              points: [
                { term: 'Star and question mark', detail: 'A star matches any run of characters and a question mark matches exactly one character.' },
                { term: 'Character class', detail: 'A bracket expression matches any single character from the set or range inside it.' },
                { term: 'Recursive globstar', detail: 'Enabling the globstar option makes a double star match across nested subdirectories.' },
                { term: 'Empty matches', detail: 'The nullglob option makes a pattern that matches nothing expand to nothing instead of to itself.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'bash-regex',
        title: 'Regex Matching',
        level: 2,
        slug: 'regex',
        concepts: [
          {
            id: 'bash-regex-match',
            code: "email=\"me@example.com\"\nif [[ $email =~ ^[^@]+@[^@]+\\.[a-z]+$ ]]; then\n  echo \"looks like an email\"\n  echo \"domain: ${BASH_REMATCH[0]}\"\nfi",
            note: "The `=~` operator inside `[[ ]]` matches a value against an extended regular expression. Do not quote the pattern or it becomes a literal string; use a variable for complex patterns if quoting is a concern. After a match, the array `BASH_REMATCH` holds the whole match at index 0 and any captured groups after it.",
            explanation: {
              heading: 'Regular expression matching',
              intro: 'Bash can test a value against an extended regular expression using a dedicated operator inside the double bracket construct. Successful matches also expose their captured groups for later use.',
              points: [
                { term: 'Match operator', detail: 'The equals tilde operator tests whether the left value matches the regular expression on the right.' },
                { term: 'Do not quote the pattern', detail: 'Quoting the pattern turns it into a literal string so leave it unquoted or store it in a variable.' },
                { term: 'Captured groups', detail: 'After a match the BASH_REMATCH array holds the full match at index zero and each group after it.' },
                { term: 'Inside double brackets', detail: 'The operator is only available within the double bracket conditional construct.' },
              ],
            },
            example: "if [[ $version =~ ^([0-9]+)\\.([0-9]+)$ ]]; then\n  echo \"major=${BASH_REMATCH[1]} minor=${BASH_REMATCH[2]}\"\nfi",
          },
        ],
        children: [],
      },
    ],
  },

  // 9. Command Composition
  {
    id: 'bash-command-composition',
    title: 'Command Composition',
    level: 1,
    slug: 'command-composition',
    concepts: [],
    children: [
      {
        id: 'bash-chaining',
        title: 'Chaining with && and ||',
        level: 2,
        slug: 'chaining',
        concepts: [
          {
            id: 'bash-chain-basic',
            code: "mkdir build && cd build && cmake ..\ncommand -v git >/dev/null || echo \"git not installed\"\nmake && echo \"ok\" || echo \"build failed\"",
            note: "`&&` runs the next command only if the previous one succeeded, and `||` runs it only if the previous one failed. Chaining them expresses short conditional logic without a full `if` block. Be careful mixing them, since `a && b || c` runs c when either a or b fails.",
            explanation: {
              heading: 'Short circuit chaining',
              intro: 'Bash can chain commands so that the next one runs only based on the success or failure of the previous. This expresses simple conditional logic compactly without writing a full if block.',
              points: [
                { term: 'And on success', detail: 'The double ampersand runs the next command only when the previous one succeeded.' },
                { term: 'Or on failure', detail: 'The double pipe runs the next command only when the previous one failed.' },
                { term: 'Compact logic', detail: 'Chaining these operators replaces small if statements with a single readable line.' },
                { term: 'Mixing caution', detail: 'Combining and then or can run the final command when either earlier command fails, which surprises many people.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'bash-subshells-grouping',
        title: 'Subshells & Grouping',
        level: 2,
        slug: 'subshells-grouping',
        concepts: [
          {
            id: 'bash-subshell',
            code: "( cd /tmp && ls )   # runs in a subshell; cwd change is local\ncd /tmp; ls          # would change the parent shell's cwd\n\n{ echo one; echo two; } > out.txt   # group without a subshell",
            note: "Parentheses `( )` run commands in a subshell, an isolated child process, so directory changes and variable assignments do not affect the parent. Curly braces `{ }` group commands in the current shell and are handy for redirecting several commands at once. Note the required spaces and trailing semicolon inside braces.",
            explanation: {
              heading: 'Subshells versus brace groups',
              intro: 'Bash offers two ways to group commands, and they differ in whether the group runs in an isolated child process. Choosing the right one controls whether side effects leak back to the parent shell.',
              points: [
                { term: 'Subshell isolation', detail: 'Parentheses run the group in a subshell so directory changes and variable assignments stay local.' },
                { term: 'Brace grouping', detail: 'Curly braces group commands in the current shell so their effects persist afterward.' },
                { term: 'Shared redirection', detail: 'Grouping lets you apply a single redirection to the output of several commands at once.' },
                { term: 'Brace syntax', detail: 'Braces need surrounding spaces and a trailing semicolon before the closing brace.' },
              ],
            },
            example: "total=$( { cat a.txt; cat b.txt; } | wc -l )",
          },
        ],
        children: [],
      },
      {
        id: 'bash-process-substitution',
        title: 'Process Substitution',
        level: 2,
        slug: 'process-substitution',
        concepts: [
          {
            id: 'bash-procsub',
            code: "diff <(sort a.txt) <(sort b.txt)\nwhile read -r line; do\n  echo \"$line\"\ndone < <(grep foo bar.txt)",
            note: "Process substitution with `<(command)` lets a command's output appear as a temporary file, so tools that expect filenames can read a live stream. This avoids creating temporary files just to diff or compare two command outputs. The `< <(...)` form feeds a command into a `while read` loop without the subshell that a pipe would create.",
            explanation: {
              heading: 'Treating command output as a file',
              intro: 'Process substitution makes the output of a command look like a temporary file path that other tools can read. This lets you compare live streams without manually creating temporary files.',
              points: [
                { term: 'Output as a path', detail: 'The less than parentheses form gives a filename that yields the command output when read.' },
                { term: 'Compare two streams', detail: 'Tools that expect filenames can diff or compare two commands directly with two process substitutions.' },
                { term: 'No temporary files', detail: 'The stream is fed through a special path so you avoid writing and cleaning up scratch files.' },
                { term: 'Loop without subshell', detail: 'Feeding a while read loop this way keeps variable changes because it avoids the subshell a pipe would create.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 10. Input & Environment
  {
    id: 'bash-input-environment',
    title: 'Input & Environment',
    level: 1,
    slug: 'input-environment',
    concepts: [],
    children: [
      {
        id: 'bash-read',
        title: 'read & User Input',
        level: 2,
        slug: 'read',
        concepts: [
          {
            id: 'bash-read-basic',
            code: "read -rp \"Enter your name: \" name\necho \"Hello, $name\"\n\nread -rsp \"Password: \" pass; echo\nread -t 5 -rp \"Quick, answer: \" reply || echo \"timed out\"",
            note: "`read` collects a line of input into one or more variables, and `-p` shows a prompt without a separate echo. Always pass `-r` so backslashes are read literally, and use `-s` to hide sensitive input like passwords. Options like `-t` add a timeout and `-n` limit the number of characters.",
            explanation: {
              heading: 'Collecting user input',
              intro: 'The read builtin reads a line of input into one or more variables, making scripts interactive. A handful of options control prompting, safety, and how much input is accepted.',
              points: [
                { term: 'Prompt inline', detail: 'The minus p option shows a prompt on the same line without a separate echo command.' },
                { term: 'Raw mode', detail: 'The minus r option reads backslashes literally instead of treating them as escapes.' },
                { term: 'Hidden input', detail: 'The minus s option hides typed characters which is ideal for passwords.' },
                { term: 'Timeout and length', detail: 'The minus t option adds a timeout and minus n limits how many characters are read.' },
              ],
            },
            example: "read -ra parts <<< \"a b c\"   # split a line into an array",
          },
        ],
        children: [],
      },
      {
        id: 'bash-environment-variables',
        title: 'Environment Variables',
        level: 2,
        slug: 'environment-variables',
        concepts: [
          {
            id: 'bash-env-export',
            code: "export API_URL=\"https://example.com\"\necho \"$PATH\"\nPATH=\"$HOME/bin:$PATH\"   # prepend a directory\nDEBUG=1 ./script.sh      # set for one command only",
            note: "`export` marks a variable so it is passed to child processes, turning a shell variable into an environment variable. Common ones like `PATH`, `HOME`, and `USER` are provided by the login shell. You can set a variable for a single command by placing the assignment right before it.",
            explanation: {
              heading: 'Environment variables and child processes',
              intro: 'An ordinary shell variable is private to the current shell, but exporting it makes it part of the environment inherited by child processes. This is how configuration flows into the programs a script runs.',
              points: [
                { term: 'Export to children', detail: 'The export builtin marks a variable so it is passed down to every child process.' },
                { term: 'Common variables', detail: 'The login shell provides standard variables such as PATH, HOME, and USER.' },
                { term: 'Per command values', detail: 'Placing an assignment directly before a command sets that variable for only that one command.' },
                { term: 'Extend the path', detail: 'Prepending a directory to PATH lets your own programs be found before system ones.' },
              ],
            },
            example: "env | sort            # list the current environment\nprintenv PATH         # print one variable",
          },
        ],
        children: [],
      },
    ],
  },

  // 11. Signals & Options
  {
    id: 'bash-signals-options',
    title: 'Signals & Options',
    level: 1,
    slug: 'signals-options',
    concepts: [],
    children: [
      {
        id: 'bash-trap',
        title: 'trap & Signals',
        level: 2,
        slug: 'trap',
        concepts: [
          {
            id: 'bash-trap-cleanup',
            code: "tmp=$(mktemp)\ncleanup() {\n  rm -f \"$tmp\"\n}\ntrap cleanup EXIT\ntrap 'echo interrupted; exit 130' INT",
            note: "`trap` registers a command to run when the shell receives a signal or on special events like `EXIT`. Trapping `EXIT` is the reliable way to clean up temporary files no matter how the script ends. Handling `INT` (Ctrl+C) or `TERM` lets you shut down gracefully instead of dying mid-operation.",
            explanation: {
              heading: 'Reacting to signals and exit',
              intro: 'The trap builtin registers a command to run when the shell receives a signal or reaches special events like exiting. It is the standard way to guarantee cleanup and graceful shutdown.',
              points: [
                { term: 'Register a handler', detail: 'The trap builtin ties a command to one or more signals or pseudo signals.' },
                { term: 'Reliable cleanup', detail: 'Trapping the exit event runs cleanup no matter how the script terminates.' },
                { term: 'Handle interrupts', detail: 'Trapping the interrupt signal lets a script respond to a control C rather than dying abruptly.' },
                { term: 'Ignore signals', detail: 'Trapping a signal with an empty command makes the script ignore that signal entirely.' },
              ],
            },
            example: "trap '' INT   # ignore Ctrl+C entirely",
          },
        ],
        children: [],
      },
      {
        id: 'bash-getopts',
        title: 'getopts',
        level: 2,
        slug: 'getopts',
        concepts: [
          {
            id: 'bash-getopts-basic',
            code: "verbose=0\nwhile getopts \":vo:\" opt; do\n  case \"$opt\" in\n    v) verbose=1 ;;\n    o) outfile=\"$OPTARG\" ;;\n    \\?) echo \"unknown: -$OPTARG\" >&2; exit 1 ;;\n  esac\ndone\nshift $((OPTIND - 1))",
            note: "`getopts` parses single-letter options in a loop, storing the current flag in a variable you name. A colon after a letter (like `o:`) means that option takes an argument, delivered in `$OPTARG`. After the loop, `shift $((OPTIND - 1))` drops the parsed options so `\"$@\"` holds the remaining positional arguments.",
            explanation: {
              heading: 'Parsing single letter options',
              intro: 'The getopts builtin parses short command line options one at a time inside a loop. It handles option arguments and error reporting so scripts can accept flags in a standard way.',
              points: [
                { term: 'Loop over flags', detail: 'Each pass of getopts stores the current option letter in a variable you name.' },
                { term: 'Option arguments', detail: 'A colon after a letter in the spec means that option takes a value delivered in the OPTARG variable.' },
                { term: 'Consume parsed options', detail: 'Shifting by OPTIND minus one after the loop drops the options so the remaining arguments stay in the at sign.' },
                { term: 'Error handling', detail: 'A leading colon in the spec switches getopts to quiet mode so the script reports unknown options itself.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 12. Standard Tools in Scripts
  {
    id: 'bash-standard-tools',
    title: 'Standard Tools in Scripts',
    level: 1,
    slug: 'standard-tools',
    concepts: [],
    children: [
      {
        id: 'bash-grep-sed',
        title: 'grep & sed',
        level: 2,
        slug: 'grep-sed',
        concepts: [
          {
            id: 'bash-grep-usage',
            code: "grep -rn \"TODO\" src/         # recursive, with line numbers\ngrep -Ei \"error|warn\" log.txt # extended regex, case-insensitive\ngrep -c \"200\" access.log      # count matching lines",
            note: "`grep` searches text for lines matching a pattern and is the workhorse of shell filtering. Useful flags include `-r` for recursion, `-n` for line numbers, `-i` to ignore case, and `-E` for extended regular expressions. Use `-q` when you only care about the exit status inside an `if`.",
            explanation: {
              heading: 'Searching text with grep',
              intro: 'The grep tool scans input line by line and prints those that match a pattern, making it the core filter of shell pipelines. A set of flags tunes how it searches and what it reports.',
              points: [
                { term: 'Recursive search', detail: 'The minus r flag walks a directory tree searching every file it finds.' },
                { term: 'Line numbers', detail: 'The minus n flag prefixes each match with the line number where it was found.' },
                { term: 'Ignore case', detail: 'The minus i flag makes the pattern match without regard to letter case.' },
                { term: 'Quiet mode', detail: 'The minus q flag suppresses output so you can use the exit status inside an if.' },
              ],
            },
          },
          {
            id: 'bash-sed-usage',
            code: "sed 's/foo/bar/g' file.txt        # replace every foo with bar\nsed -n '2,5p' file.txt            # print only lines 2-5\nsed -i.bak 's/old/new/' config    # edit in place, keep a .bak",
            note: "`sed` is a stream editor that transforms text line by line, most commonly with its `s/pattern/replacement/` substitution. The trailing `g` replaces all matches on a line rather than just the first. Use `-i` to edit files in place, and supply a suffix like `-i.bak` to keep a backup.",
            explanation: {
              heading: 'Transforming text with sed',
              intro: 'The sed tool is a stream editor that reads text one line at a time and applies editing commands to it. Its most common job is substituting text using a pattern and replacement.',
              points: [
                { term: 'Substitution command', detail: 'The s command replaces text matching a pattern with a replacement on each line.' },
                { term: 'Global flag', detail: 'A trailing g makes the substitution replace every match on a line rather than only the first.' },
                { term: 'Print selected lines', detail: 'Combining the minus n option with a p command prints only the lines you choose.' },
                { term: 'In place editing', detail: 'The minus i option edits files directly and a suffix after it keeps a backup copy.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'bash-awk',
        title: 'awk',
        level: 2,
        slug: 'awk',
        concepts: [
          {
            id: 'bash-awk-usage',
            code: "awk '{print $1, $3}' data.txt          # print columns 1 and 3\nawk -F, '{sum += $2} END {print sum}' csv # sum a CSV column\nawk '$3 > 100 {print $0}' report.txt      # filter by a field",
            note: "`awk` processes text as records and fields, splitting each line into `$1`, `$2`, and so on. Its programs are `pattern { action }` pairs, and `-F` sets the field separator for formats like CSV. The special `END` block runs after all input, which is perfect for printing totals.",
            explanation: {
              heading: 'Field oriented processing with awk',
              intro: 'The awk tool treats each input line as a record split into fields, which makes columnar data easy to work with. Programs are written as pattern and action pairs that run for matching lines.',
              points: [
                { term: 'Records and fields', detail: 'Each line becomes a record and its whitespace separated pieces become numbered fields.' },
                { term: 'Pattern action pairs', detail: 'An action in braces runs for every line that matches the pattern in front of it.' },
                { term: 'Field separator', detail: 'The minus F option sets the character that separates fields for formats like comma separated values.' },
                { term: 'End block', detail: 'The special END block runs once after all input which is ideal for printing totals.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'bash-find-xargs',
        title: 'find & xargs',
        level: 2,
        slug: 'find-xargs',
        concepts: [
          {
            id: 'bash-find-usage',
            code: "find . -name '*.log' -type f -mtime +7\nfind . -name '*.tmp' -delete\nfind . -type f -print0 | xargs -0 grep -l \"TODO\"",
            note: "`find` walks a directory tree and selects files by name, type, age, size, and more. Combine it with `xargs` to run a command over the results in batches, which is faster than one process per file. Use `-print0` with `xargs -0` so filenames containing spaces or newlines are handled safely.",
            explanation: {
              heading: 'Finding files and acting on them',
              intro: 'The find tool walks a directory tree and selects files by many criteria such as name, type, age, and size. It is often paired with xargs to run a command efficiently over the matches.',
              points: [
                { term: 'Rich selection', detail: 'Tests like name, type, and modification time filter the tree down to exactly the files you want.' },
                { term: 'Batch with xargs', detail: 'Piping results to xargs runs a command over many files at once instead of one process per file.' },
                { term: 'Null delimiters', detail: 'The print zero option and the xargs zero option separate names by a null byte so spaces and newlines are safe.' },
                { term: 'Run commands directly', detail: 'The exec action can run a command on each match without involving xargs at all.' },
              ],
            },
            example: "find . -name '*.sh' -exec shellcheck {} +   # run a command directly",
          },
        ],
        children: [],
      },
    ],
  },

  // 13. Best Practices
  {
    id: 'bash-best-practices',
    title: 'Best Practices',
    level: 1,
    slug: 'best-practices',
    concepts: [],
    children: [
      {
        id: 'bash-strict-mode',
        title: 'Strict Mode',
        level: 2,
        slug: 'strict-mode',
        concepts: [
          {
            id: 'bash-set-euo',
            code: "#!/usr/bin/env bash\nset -euo pipefail\nIFS=$'\\n\\t'",
            note: "`set -e` exits on the first failing command, `set -u` errors on unset variables, and `set -o pipefail` makes a pipeline fail if any stage fails. Together they turn silent bugs into loud, early failures. Tightening `IFS` to newline and tab reduces surprises from word splitting on spaces.",
            explanation: {
              heading: 'Strict mode for safer scripts',
              intro: 'A trio of set options turns bash into a stricter language that fails fast on common mistakes rather than plowing ahead silently. Combined with a tightened field separator they catch bugs early.',
              points: [
                { term: 'Exit on error', detail: 'The minus e option stops the script as soon as a command returns a failure status.' },
                { term: 'Unset is an error', detail: 'The minus u option treats a reference to an unset variable as an error instead of an empty string.' },
                { term: 'Pipeline failures', detail: 'The pipefail option makes a pipeline fail when any stage fails, not only the last one.' },
                { term: 'Tighter field splitting', detail: 'Setting IFS to newline and tab reduces surprises from splitting on ordinary spaces.' },
              ],
            },
            example: "# Opt out of -e for a command you expect might fail:\nset +e; risky_command; status=$?; set -e",
          },
        ],
        children: [],
      },
      {
        id: 'bash-quoting-safety',
        title: 'Quoting & Safety',
        level: 2,
        slug: 'quoting-safety',
        concepts: [
          {
            id: 'bash-quote-everything',
            code: "cp \"$src\" \"$dest\"          # quote to survive spaces\nrm -- \"$file\"              # -- stops option injection\nfor f in \"$@\"; do echo \"$f\"; done",
            note: "Always quote variable expansions so values with spaces, tabs, or glob characters are treated as single arguments. Use `--` before filename arguments so a name that starts with a dash is not mistaken for an option. These habits prevent a whole class of subtle and dangerous bugs.",
            explanation: {
              heading: 'Quoting habits that prevent bugs',
              intro: 'A large share of shell bugs come from unquoted expansions that split on spaces or expand as globs. A few consistent habits protect against these subtle and sometimes dangerous mistakes.',
              points: [
                { term: 'Quote every expansion', detail: 'Wrapping expansions in double quotes keeps values with spaces or glob characters as a single argument.' },
                { term: 'End of options marker', detail: 'Placing a double dash before filenames stops a name that begins with a dash from looking like an option.' },
                { term: 'Forward arguments safely', detail: 'Quoting the at sign expansion forwards each argument intact to another command.' },
                { term: 'Consistency matters', detail: 'Applying these habits everywhere removes an entire class of hard to spot failures.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'bash-shellcheck',
        title: 'Linting with ShellCheck',
        level: 2,
        slug: 'shellcheck',
        concepts: [
          {
            id: 'bash-shellcheck-usage',
            code: "shellcheck script.sh\n# fix or explicitly ignore a specific finding:\n# shellcheck disable=SC2086\necho $unquoted",
            note: "ShellCheck is a static analysis tool that catches common shell mistakes like unquoted variables, useless uses of cat, and broken conditionals. Run it on every script and treat its warnings as bugs to fix rather than noise. When a warning is genuinely a false positive, silence just that line with a `# shellcheck disable=CODE` comment.",
            explanation: {
              heading: 'Catching mistakes with ShellCheck',
              intro: 'ShellCheck is a static analysis tool that reads a script and reports common shell mistakes before you ever run it. Treating its findings as real bugs steadily raises the quality of your scripts.',
              points: [
                { term: 'Static analysis', detail: 'ShellCheck inspects the script text and flags issues like unquoted variables and broken conditionals.' },
                { term: 'Run it routinely', detail: 'Running it on every script turns whole categories of latent bugs into visible warnings.' },
                { term: 'Treat warnings seriously', detail: 'Most findings point at genuine problems rather than noise so they are worth fixing.' },
                { term: 'Targeted suppression', detail: 'A disable comment silences a single false positive by its specific code without hiding others.' },
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
