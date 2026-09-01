const topics = [
  {
    id: 'perl-basics',
    title: 'Perl Basics',
    level: 1,
    slug: 'basics',
    concepts: [],
    children: [
      {
        id: 'perl-basics-boilerplate',
        title: 'Pragmas and First Program',
        level: 2,
        slug: 'boilerplate',
        concepts: [
          {
            id: 'perl-basics-strict-warnings',
            code: "#!/usr/bin/perl\nuse strict;\nuse warnings;\n\nprint \"Hello, World!\\n\";",
            note: 'Always start scripts with `use strict` and `use warnings`. Strict forces you to declare variables and catches many typos at compile time, while warnings flags risky runtime behavior like using undefined values. These two lines are the foundation of reliable modern Perl.',
            explanation: {
              heading: 'strict and warnings',
              intro: 'Enabling strict and warnings at the top of every Perl program catches common mistakes early and enforces cleaner coding habits.',
              points: [
                { term: 'use strict', detail: 'It requires variables to be declared and forbids risky constructs like symbolic references.' },
                { term: 'use warnings', detail: 'It reports questionable code such as using an undefined value.' },
                { term: 'Always enable', detail: 'Modern Perl code should start with both pragmas as a baseline.' },
                { term: 'Catches typos', detail: 'Declared variables mean a misspelled name becomes a compile-time error.' },
              ],
            },
            example: "perl hello.pl  # run it from the shell",
          },
          {
            id: 'perl-basics-say',
            code: "use v5.36;\n\nsay 'Hello';        # like print, but adds a newline\nsay for (1..3);     # 1, 2, 3 each on their own line",
            note: 'Requesting a recent Perl version with `use v5.36` (or `use feature \'say\'`) enables `say`, which prints its argument followed by a newline. It also turns on strict and warnings automatically. This keeps everyday printing tidy without trailing newlines.',
            explanation: {
              heading: 'Printing output',
              intro: 'Perl prints with the print function, and the say feature adds an automatic newline for convenience.',
              points: [
                { term: 'print writes text', detail: 'The print function outputs its arguments with no added newline.' },
                { term: 'say adds newline', detail: 'The say function prints its arguments followed by a newline.' },
                { term: 'Enable say', detail: 'You turn on say with a feature pragma or a recent version declaration.' },
                { term: 'List arguments', detail: 'Both accept a list of values to output in sequence.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'perl-basics-comments',
        title: 'Comments and Statements',
        level: 2,
        slug: 'comments',
        concepts: [
          {
            id: 'perl-basics-comment-syntax',
            code: "# This is a single-line comment\nmy $count = 42;   # statements end with a semicolon\n\n=pod\nThis is a POD block, used for documentation.\nIt is ignored when the program runs.\n=cut",
            note: 'Everything after `#` on a line is a comment. Every simple statement ends with a semicolon. For longer documentation Perl uses POD blocks that start with `=pod` (or another `=` directive) and end with `=cut`.',
            explanation: {
              heading: 'Comments',
              intro: 'Perl uses hash comments for notes and provides a POD documentation format for larger blocks of text.',
              points: [
                { term: 'Hash comments', detail: 'A hash symbol starts a comment running to the end of the line.' },
                { term: 'POD documentation', detail: 'Plain old documentation blocks embed formatted docs in the source.' },
                { term: 'POD as block comment', detail: 'A POD section can also serve as a multi-line comment.' },
                { term: 'Ignored by interpreter', detail: 'Comments and POD are skipped when the program runs.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'perl-variables',
    title: 'Variables and Sigils',
    level: 1,
    slug: 'variables',
    concepts: [],
    children: [
      {
        id: 'perl-variables-sigils',
        title: 'The Three Sigils',
        level: 2,
        slug: 'sigils',
        concepts: [
          {
            id: 'perl-variables-sigil-intro',
            code: "my $scalar = 'one value';       # $ scalar\nmy @array  = (1, 2, 3);         # @ array\nmy %hash   = (name => 'Ada');   # % hash",
            note: 'Perl marks variable kinds with sigils: `$` for a single scalar, `@` for an ordered array, and `%` for a key/value hash. The sigil tells you and Perl what shape of data you are working with. This is central to reading any Perl code.',
            explanation: {
              heading: 'Sigils',
              intro: 'Perl marks each variable type with a leading sigil that indicates whether it holds a single value, a list, or key-value pairs.',
              points: [
                { term: 'Dollar for scalars', detail: 'A dollar sign marks a scalar holding one value.' },
                { term: 'At sign for arrays', detail: 'An at sign marks an ordered list of values.' },
                { term: 'Percent for hashes', detail: 'A percent sign marks a collection of key-value pairs.' },
                { term: 'Type at a glance', detail: 'The sigil makes a variable\'s kind obvious in the code.' },
              ],
            },
          },
          {
            id: 'perl-variables-my-scope',
            code: "my $name = 'Grace';   # lexical, scoped to the enclosing block\n{\n  my $name = 'Alan';  # a separate variable inside this block\n  print \"$name\\n\";    # Alan\n}\nprint \"$name\\n\";      # Grace",
            note: 'Declare variables with `my` to give them lexical scope, meaning they exist only within the enclosing block or file. This prevents accidental clashes and is required under `use strict`. Prefer `my` over global variables in almost all code.',
            explanation: {
              heading: 'Lexical scope with my',
              intro: 'The my keyword declares a lexically scoped variable that exists only within the enclosing block, which is essential under strict mode.',
              points: [
                { term: 'my declares', detail: 'The my keyword creates a new lexical variable.' },
                { term: 'Block scoped', detail: 'The variable is visible only inside the block where it is declared.' },
                { term: 'Required by strict', detail: 'Under strict mode variables must be declared with my or similar.' },
                { term: 'Avoids globals', detail: 'Lexical scoping keeps variables from leaking across the program.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'perl-variables-access',
        title: 'Accessing Elements',
        level: 2,
        slug: 'access',
        concepts: [
          {
            id: 'perl-variables-element-sigil',
            code: "my @nums = (10, 20, 30);\nprint $nums[0];        # 10 - single element uses $\n\nmy %age = (bob => 30);\nprint $age{bob};       # 30 - single value uses $",
            note: 'When you pull a single element out of an array or hash you use the `$` sigil because you are getting one scalar. So `$nums[0]` indexes the array `@nums`, and `$age{bob}` looks up a key in `%age`. The container sigil and the access sigil differ on purpose.',
            explanation: {
              heading: 'Element access sigils',
              intro: 'When accessing a single element of an array or hash, the sigil reflects the scalar being retrieved rather than the whole container.',
              points: [
                { term: 'Dollar for one element', detail: 'Reading a single element uses a dollar sign because it yields a scalar.' },
                { term: 'Array indexing', detail: 'Square brackets select an array element by numeric index.' },
                { term: 'Hash lookup', detail: 'Curly braces select a hash value by its key.' },
                { term: 'Common confusion', detail: 'The sigil describes the value fetched, not the variable\'s type.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'perl-scalars',
    title: 'Scalars',
    level: 1,
    slug: 'scalars',
    concepts: [],
    children: [
      {
        id: 'perl-scalars-numbers-strings',
        title: 'Numbers and Strings',
        level: 2,
        slug: 'numbers-strings',
        concepts: [
          {
            id: 'perl-scalars-types',
            code: "my $int   = 42;\nmy $float = 3.14;\nmy $str   = 'perl';\nmy $sum   = $int + 8;        # 50\nmy $greet = 'Hi ' . $str;    # string concat with .",
            note: 'A scalar holds a single value: a number, a string, or a reference. Perl converts between numbers and strings automatically based on context, so you rarely declare types. Use `+` for arithmetic and `.` for string concatenation.',
            explanation: {
              heading: 'Scalar values',
              intro: 'A scalar holds a single value that can be a number, a string, or a reference, and Perl converts between numbers and strings as needed.',
              points: [
                { term: 'One value', detail: 'A scalar stores a single number, string, or reference.' },
                { term: 'Automatic conversion', detail: 'Perl converts between numeric and string forms based on context.' },
                { term: 'No fixed type', detail: 'The same scalar can hold a number now and a string later.' },
                { term: 'References too', detail: 'A scalar can hold a reference to another data structure.' },
              ],
            },
          },
          {
            id: 'perl-scalars-undef',
            code: "my $x;                    # undef until assigned\nprint 'unset' unless defined $x;\n$x //= 'default';         # assign only if undefined\nprint $x;                 # default",
            note: 'An unassigned scalar holds the special value `undef`. Test for it with `defined`, and use the defined-or operator `//` (or its assignment form `//=`) to supply a fallback. This is the clean way to handle missing values.',
            explanation: {
              heading: 'The undef value',
              intro: 'The undef value represents the absence of a value, and Perl provides ways to test for and assign it explicitly.',
              points: [
                { term: 'Means no value', detail: 'An unset scalar holds undef until given a value.' },
                { term: 'defined test', detail: 'The defined function checks whether a scalar has a real value.' },
                { term: 'Warnings on use', detail: 'Using undef where a value is expected can trigger a warning.' },
                { term: 'Explicit undef', detail: 'You can assign undef to clear a variable.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'perl-scalars-truth',
        title: 'Truthiness',
        level: 2,
        slug: 'truthiness',
        concepts: [
          {
            id: 'perl-scalars-truth-rules',
            code: "print 'false' unless 0;       # 0 is false\nprint 'false' unless '';      # empty string is false\nprint 'false' unless '0';     # the string \"0\" is false\nprint 'true'  if '0.0';       # but \"0.0\" is TRUE",
            note: 'Perl treats a value as false if it is `0`, the empty string, the string `\'0\'`, or `undef`; everything else is true. A surprising case is that the string `\'0.0\'` is true because it is neither empty nor exactly `\'0\'`. Keep this in mind when testing user input.',
            explanation: {
              heading: 'Truthiness rules',
              intro: 'Perl treats a small set of values as false in a boolean context and everything else as true, which affects conditionals.',
              points: [
                { term: 'Falsy values', detail: 'Zero, the empty string, the string zero, and undef are false.' },
                { term: 'Everything else true', detail: 'Any other value, including most strings, is considered true.' },
                { term: 'String zero caveat', detail: 'The single-character string zero is false but other numeric strings are true.' },
                { term: 'No boolean type', detail: 'Perl has no dedicated boolean; it uses these value rules instead.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'perl-arrays',
    title: 'Arrays',
    level: 1,
    slug: 'arrays',
    concepts: [],
    children: [
      {
        id: 'perl-arrays-basics',
        title: 'Creating and Indexing',
        level: 2,
        slug: 'creating',
        concepts: [
          {
            id: 'perl-arrays-intro',
            code: "my @fruit = ('apple', 'pear', 'plum');\nmy @words = qw(fast simple flexible);   # qw splits on whitespace\nprint $fruit[1];       # pear\nprint $fruit[-1];      # plum (negative counts from the end)\nprint scalar @fruit;   # 3 (length in scalar context)",
            note: 'Arrays are ordered lists indexed from zero, and negative indices count back from the end. The `qw()` operator is a handy shortcut for a list of barewords without quotes and commas. Using an array in scalar context, such as `scalar @fruit`, gives its length.',
            explanation: {
              heading: 'Arrays',
              intro: 'An array is an ordered list of scalars indexed from zero, and it grows or shrinks automatically as you add or remove elements.',
              points: [
                { term: 'Ordered list', detail: 'Elements keep their insertion order and are accessed by index.' },
                { term: 'Zero-based', detail: 'The first element sits at index zero.' },
                { term: 'Negative indices', detail: 'A negative index counts back from the end of the array.' },
                { term: 'Dynamic size', detail: 'Arrays resize automatically as elements are added or removed.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'perl-arrays-mutation',
        title: 'Push, Pop, Shift, Splice',
        level: 2,
        slug: 'mutation',
        concepts: [
          {
            id: 'perl-arrays-stack-queue',
            code: "my @q = (1, 2, 3);\npush @q, 4;          # (1,2,3,4) add to end\nmy $last = pop @q;   # 4, now (1,2,3)\nmy $first = shift @q;# 1, now (2,3)\nunshift @q, 0;       # (0,2,3) add to front",
            note: 'Use `push`/`pop` to add and remove at the end of an array, and `shift`/`unshift` at the front. Together they let one array act as a stack or a queue. All four modify the array in place.',
            explanation: {
              heading: 'Stack and queue operations',
              intro: 'Perl arrays support push, pop, shift, and unshift, letting them act as stacks or queues depending on which ends you use.',
              points: [
                { term: 'push and pop', detail: 'These add to and remove from the end of the array.' },
                { term: 'shift and unshift', detail: 'These remove from and add to the front of the array.' },
                { term: 'Stack behavior', detail: 'Using push and pop together treats the array as a stack.' },
                { term: 'Queue behavior', detail: 'Combining push with shift treats the array as a queue.' },
              ],
            },
          },
          {
            id: 'perl-arrays-splice',
            code: "my @a = (1, 2, 3, 4, 5);\nmy @removed = splice(@a, 1, 2);   # removes 2,3 => @a is (1,4,5)\nsplice(@a, 1, 0, 'x', 'y');       # insert without removing",
            note: '`splice` removes, replaces, or inserts elements anywhere in an array using an offset and a length. It returns the removed elements, so it doubles as an extraction tool. Passing a length of 0 inserts new items without deleting any.',
            explanation: {
              heading: 'Splice',
              intro: 'The splice function removes, replaces, or inserts elements at any position in an array, returning the removed elements.',
              points: [
                { term: 'Flexible editing', detail: 'It can remove, insert, or replace elements anywhere in the array.' },
                { term: 'Offset and length', detail: 'You specify where to start and how many elements to affect.' },
                { term: 'Returns removed', detail: 'It returns the elements it took out of the array.' },
                { term: 'In-place', detail: 'It modifies the original array directly.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'perl-arrays-slices',
        title: 'Slices and Ranges',
        level: 2,
        slug: 'slices',
        concepts: [
          {
            id: 'perl-arrays-slice-intro',
            code: "my @letters = ('a' .. 'e');   # range operator: a,b,c,d,e\nmy @some = @letters[1, 3];    # slice: (b, d)\nmy @head = @letters[0 .. 2];  # (a, b, c)",
            note: 'The range operator `..` builds a sequence of numbers or letters. A slice uses the `@` sigil with a list of indices in brackets to pull several elements at once. Slices are a concise way to reorder or subset arrays.',
            explanation: {
              heading: 'Array slices',
              intro: 'A slice extracts several elements at once by listing multiple indices, returning them as a new list.',
              points: [
                { term: 'Multiple indices', detail: 'You provide a list of indices to select several elements.' },
                { term: 'At sign sigil', detail: 'A slice uses the at sign because it produces a list.' },
                { term: 'Ranges allowed', detail: 'A range of indices selects a contiguous run of elements.' },
                { term: 'Assignable', detail: 'You can assign to a slice to update several elements at once.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'perl-hashes',
    title: 'Hashes',
    level: 1,
    slug: 'hashes',
    concepts: [],
    children: [
      {
        id: 'perl-hashes-basics',
        title: 'Key/Value Pairs',
        level: 2,
        slug: 'basics',
        concepts: [
          {
            id: 'perl-hashes-intro',
            code: "my %color = (\n  sky   => 'blue',\n  grass => 'green',\n);\nprint $color{sky};        # blue\n$color{sun} = 'yellow';   # add a pair\ndelete $color{grass};     # remove a pair",
            note: 'A hash maps unique keys to values and is unordered. The fat comma `=>` autoquotes the word to its left, making declarations readable. Access a single value with `$hash{key}`, and manage entries with plain assignment and `delete`.',
            explanation: {
              heading: 'Hashes',
              intro: 'A hash stores unordered key-value pairs where each unique string key maps to a scalar value, ideal for fast lookups.',
              points: [
                { term: 'Key-value pairs', detail: 'Each entry associates a string key with a scalar value.' },
                { term: 'Unordered', detail: 'Hash entries have no guaranteed order when iterated.' },
                { term: 'Fast lookup', detail: 'Retrieving a value by its key is efficient.' },
                { term: 'Unique keys', detail: 'Assigning to an existing key overwrites its previous value.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'perl-hashes-inspect',
        title: 'Keys, Values, and Existence',
        level: 2,
        slug: 'inspect',
        concepts: [
          {
            id: 'perl-hashes-keys-values',
            code: "my %age = (bob => 30, ada => 36);\nmy @names = keys %age;      # list of keys\nmy @ages  = values %age;    # list of values\n\nwhile (my ($name, $n) = each %age) {\n  print \"$name is $n\\n\";\n}",
            note: '`keys` and `values` return the keys and values of a hash as lists, in matching order within a single run. The `each` iterator hands back one key/value pair at a time, which is memory friendly for large hashes. Order between runs is not guaranteed.',
            explanation: {
              heading: 'keys and values',
              intro: 'The keys and values functions return lists of a hash\'s keys or values, which you commonly use to iterate over its contents.',
              points: [
                { term: 'keys function', detail: 'It returns a list of all the keys in the hash.' },
                { term: 'values function', detail: 'It returns a list of all the values in the hash.' },
                { term: 'each for pairs', detail: 'The each function walks key-value pairs one at a time.' },
                { term: 'Order not guaranteed', detail: 'The returned order is arbitrary unless you sort it.' },
              ],
            },
          },
          {
            id: 'perl-hashes-exists',
            code: "my %seen = (apple => 1);\nprint 'yes' if exists $seen{apple};   # key is present\nprint 'no'  unless exists $seen{pear};\nprint 'set' if defined $seen{apple};  # key present AND value defined",
            note: 'Use `exists` to ask whether a key is present, even if its value is `undef`. Use `defined` to ask whether the stored value is not `undef`. Distinguishing the two avoids subtle bugs when values can legitimately be undefined.',
            explanation: {
              heading: 'exists and delete',
              intro: 'The exists function tests whether a hash key is present and delete removes an entry, distinct from a key merely holding undef.',
              points: [
                { term: 'exists tests presence', detail: 'It reports whether a key exists regardless of its value.' },
                { term: 'delete removes', detail: 'The delete function removes a key and its value from the hash.' },
                { term: 'Undef versus missing', detail: 'A key can exist while holding undef, which differs from being absent.' },
                { term: 'Avoids autovivification', detail: 'Checking with exists avoids accidentally creating nested structures.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'perl-context',
    title: 'Context',
    level: 1,
    slug: 'context',
    concepts: [],
    children: [
      {
        id: 'perl-context-scalar-list',
        title: 'Scalar vs List Context',
        level: 2,
        slug: 'scalar-list',
        concepts: [
          {
            id: 'perl-context-intro',
            code: "my @data = (10, 20, 30);\nmy $count = @data;         # scalar context => 3 (length)\nmy ($first) = @data;       # list context => 10\nmy $n = () = 'a b c' =~ /\\w/g;   # count matches: 3",
            note: 'Perl expressions behave differently depending on whether they are used in scalar or list context. Assigning an array to a scalar yields its length, while assigning to a list of variables copies elements. Understanding context explains much of Perl behavior.',
            explanation: {
              heading: 'Context',
              intro: 'Perl expressions behave differently in scalar versus list context, a core concept that determines how values are interpreted.',
              points: [
                { term: 'Scalar context', detail: 'It expects a single value, so an array yields its element count.' },
                { term: 'List context', detail: 'It expects a list, so an array yields all its elements.' },
                { term: 'Context propagates', detail: 'The surrounding operation imposes the context on its operands.' },
                { term: 'Common gotcha', detail: 'Misunderstanding context is a frequent source of surprises for newcomers.' },
              ],
            },
          },
          {
            id: 'perl-context-wantarray',
            code: "sub items {\n  return wantarray ? (1, 2, 3) : 3;\n}\nmy @list = items();   # (1, 2, 3)\nmy $one  = items();   # 3",
            note: 'Inside a subroutine `wantarray` reports whether the caller wants a list, a scalar, or nothing. This lets a function tailor its return value to how it is being used. Many core functions like `localtime` use this trick.',
            explanation: {
              heading: 'wantarray',
              intro: 'The wantarray function lets a subroutine detect the context it was called in and return an appropriate value accordingly.',
              points: [
                { term: 'Detects context', detail: 'It reports whether the caller wants a list or a scalar.' },
                { term: 'Context-sensitive returns', detail: 'A subroutine can return different results based on context.' },
                { term: 'Three states', detail: 'It distinguishes list, scalar, and void contexts.' },
                { term: 'Flexible APIs', detail: 'It enables functions that adapt to how they are used.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'perl-strings',
    title: 'String Operations',
    level: 1,
    slug: 'strings',
    concepts: [],
    children: [
      {
        id: 'perl-strings-core',
        title: 'Core String Functions',
        level: 2,
        slug: 'core',
        concepts: [
          {
            id: 'perl-strings-functions',
            code: "my $s = 'Perl';\nprint length($s);        # 4\nprint uc($s);            # PERL\nprint index('hello', 'l');   # 2\nprint substr('hello', 1, 3); # ell\nprint join('-', 'a', 'b');   # a-b\nmy @parts = split /,/, 'x,y,z';  # (x, y, z)",
            note: 'Perl has rich built-in string tools: `length`, `uc`/`lc`, `index`, and `substr` for inspection and slicing. `join` glues a list into a string with a separator, and `split` breaks a string on a pattern. These cover most everyday text work.',
            explanation: {
              heading: 'String functions',
              intro: 'Perl includes many built-in string functions for measuring, searching, extracting, and transforming text.',
              points: [
                { term: 'length', detail: 'The length function returns the number of characters in a string.' },
                { term: 'index and rindex', detail: 'These find the position of a substring from the front or back.' },
                { term: 'substr', detail: 'The substr function extracts or replaces part of a string.' },
                { term: 'uc and lc', detail: 'These convert a string to upper or lower case.' },
              ],
            },
          },
          {
            id: 'perl-strings-repeat-interp',
            code: "my $line = '=' x 10;      # '==========' (x repeats strings)\nmy $name = 'Ada';\nprint \"Hello, $name!\\n\";  # interpolation in double quotes\nprint 'Cost: $5\\n';       # single quotes: literal, no interpolation",
            note: 'The repetition operator `x` builds repeated strings, handy for separators. Double-quoted strings interpolate variables and escapes like `\\n`, while single-quoted strings are literal. Choose quotes based on whether you want interpolation.',
            explanation: {
              heading: 'Repetition and interpolation',
              intro: 'Double-quoted strings interpolate variables, and the repetition operator builds a string by repeating another a given number of times.',
              points: [
                { term: 'Double quotes interpolate', detail: 'Variables inside double quotes are replaced with their values.' },
                { term: 'Single quotes literal', detail: 'Single-quoted strings take their contents almost verbatim.' },
                { term: 'Repetition operator', detail: 'The x operator repeats a string a specified number of times.' },
                { term: 'Concatenation', detail: 'The dot operator joins two strings together.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'perl-strings-chomp',
        title: 'Trimming Input',
        level: 2,
        slug: 'trimming',
        concepts: [
          {
            id: 'perl-strings-chomp-intro',
            code: "my $line = \"hello\\n\";\nchomp $line;              # removes the trailing newline\nprint length($line);      # 5\n\nmy $s = '  spaced  ';\n$s =~ s/^\\s+|\\s+$//g;      # trim leading/trailing whitespace",
            note: '`chomp` removes a trailing newline from a string, which is essential after reading a line of input. To trim general whitespace, a substitution with `\\s` at the start and end of the string does the job. Both operate on the variable in place.',
            explanation: {
              heading: 'chomp and chop',
              intro: 'The chomp function removes a trailing newline from a string, commonly used to clean up lines read from input.',
              points: [
                { term: 'chomp removes newline', detail: 'It strips a trailing line separator if one is present.' },
                { term: 'chop removes last char', detail: 'The chop function removes the final character unconditionally.' },
                { term: 'In-place', detail: 'Both modify the string variable directly.' },
                { term: 'Cleaning input', detail: 'chomp is typically applied to each line read from a file or standard input.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'perl-regex',
    title: 'Regular Expressions',
    level: 1,
    slug: 'regex',
    concepts: [],
    children: [
      {
        id: 'perl-regex-match',
        title: 'Matching',
        level: 2,
        slug: 'match',
        concepts: [
          {
            id: 'perl-regex-match-intro',
            code: "my $text = 'order 12345 shipped';\nif ($text =~ /(\\d+)/) {\n  print \"id: $1\\n\";     # captured group => 12345\n}\nmy @all = $text =~ /(\\w+)/g;   # all words with /g",
            note: 'The bind operator `=~` applies a regex to a string, and `//` delimits the pattern. Parentheses capture parts of the match into `$1`, `$2`, and so on. Adding the `/g` flag in list context returns every match.',
            explanation: {
              heading: 'Regex matching',
              intro: 'Perl has powerful built-in regular expressions, with the bind operator applying a pattern to a string to test or capture matches.',
              points: [
                { term: 'Bind operator', detail: 'The equals-tilde operator applies a pattern to a target string.' },
                { term: 'Match syntax', detail: 'A pattern between slashes tests whether the string matches.' },
                { term: 'Capture groups', detail: 'Parentheses capture matched portions into numbered variables.' },
                { term: 'Regex heritage', detail: 'Perl\'s regular expressions influenced many other languages.' },
              ],
            },
          },
          {
            id: 'perl-regex-flags',
            code: "my $s = \"Line1\\nLine2\";\nprint 'yes' if $s =~ /line1/i;   # /i case-insensitive\nprint 'yes' if $s =~ /^Line2/m;  # /m multiline anchors\nmy $re = qr/\\d+/;                # precompiled pattern\nprint 'digit' if $s =~ $re;",
            note: 'Flags modify how a pattern behaves: `/i` ignores case, `/m` makes `^` and `$` match at line boundaries, and `/x` allows whitespace and comments in the pattern. The `qr//` operator precompiles a regex into a reusable value. Combine flags freely.',
            explanation: {
              heading: 'Regex flags',
              intro: 'Flags after a regular expression modify its behavior, such as ignoring case or matching across multiple lines.',
              points: [
                { term: 'Case-insensitive', detail: 'An i flag makes the match ignore letter case.' },
                { term: 'Global', detail: 'A g flag finds all matches rather than just the first.' },
                { term: 'Multiline and single-line', detail: 'The m and s flags change how anchors and the dot behave.' },
                { term: 'Extended', detail: 'An x flag allows whitespace and comments inside the pattern.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'perl-regex-substitute',
        title: 'Substitution and Transliteration',
        level: 2,
        slug: 'substitute',
        concepts: [
          {
            id: 'perl-regex-subst',
            code: "my $s = 'cats and cats';\n(my $copy = $s) =~ s/cats/dogs/g;   # dogs and dogs\nmy $count = ($s =~ s/cats/dogs/g); # 2 (number replaced)\n$s =~ s/(\\w+)/\\u$1/g;              # Capitalize each word",
            note: 'The `s///` operator replaces text matching a pattern; add `/g` to replace every occurrence. It returns the number of substitutions made, and the replacement side can use captured groups like `$1`. In list-free scalar context it works in place on the bound variable.',
            explanation: {
              heading: 'Substitution',
              intro: 'The substitution operator finds text matching a pattern and replaces it, optionally replacing every occurrence globally.',
              points: [
                { term: 's operator', detail: 'The s form replaces matched text with a replacement string.' },
                { term: 'Global flag', detail: 'A g flag replaces all matches instead of only the first.' },
                { term: 'Uses captures', detail: 'The replacement can reference captured groups from the match.' },
                { term: 'In-place edit', detail: 'By default it modifies the bound variable directly.' },
              ],
            },
          },
          {
            id: 'perl-regex-tr',
            code: "my $s = 'Hello';\n(my $rot = $s) =~ tr/A-Za-z/N-ZA-Mn-za-m/;  # ROT13 => Uryyb\nmy $vowels = ($s =~ tr/aeiouAEIOU//);       # count vowels => 2",
            note: 'The transliteration operator `tr///` (also spelled `y///`) maps characters one-to-one, useful for case tricks, ROT13, or character counting. Without a replacement list it simply counts matching characters. It is faster than a regex for plain character swaps.',
            explanation: {
              heading: 'Transliteration',
              intro: 'The transliteration operator replaces individual characters with others, useful for simple character-by-character mapping and counting.',
              points: [
                { term: 'tr operator', detail: 'It maps each character in one set to the corresponding character in another.' },
                { term: 'Not a regex', detail: 'It works on single characters, not full patterns.' },
                { term: 'Counting', detail: 'It can count how many characters matched without changing them.' },
                { term: 'Case conversion', detail: 'Mapping letter ranges can change case efficiently.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'perl-control-flow',
    title: 'Control Flow',
    level: 1,
    slug: 'control-flow',
    concepts: [],
    children: [
      {
        id: 'perl-control-conditionals',
        title: 'Conditionals',
        level: 2,
        slug: 'conditionals',
        concepts: [
          {
            id: 'perl-control-if-unless',
            code: "my $n = 7;\nif ($n > 10) {\n  print \"big\\n\";\n} elsif ($n > 5) {\n  print \"medium\\n\";\n} else {\n  print \"small\\n\";\n}\nprint \"odd\\n\" if $n % 2;   # statement modifier",
            note: 'Perl uses `if`/`elsif`/`else` with parentheses and braces. The complement `unless` reads naturally for negative tests. Any statement can take a trailing modifier like `... if COND`, which is idiomatic for short one-line guards.',
            explanation: {
              heading: 'if and unless',
              intro: 'Perl offers standard if and elsif conditionals plus a negated unless, and any of them can be written as a trailing statement modifier.',
              points: [
                { term: 'unless is if-not', detail: 'The unless keyword runs its block when the condition is false.' },
                { term: 'elsif chains', detail: 'Multiple elsif branches test several conditions in order.' },
                { term: 'Statement modifiers', detail: 'You can append if or unless after a single statement.' },
                { term: 'Readable negatives', detail: 'unless expresses negative conditions more clearly than negating with if.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'perl-control-ternary',
        title: 'Ternary and Logical Flow',
        level: 2,
        slug: 'ternary',
        concepts: [
          {
            id: 'perl-control-ternary-intro',
            code: "my $age = 20;\nmy $label = $age >= 18 ? 'adult' : 'minor';\n\nopen(my $fh, '<', 'f.txt') or die \"cannot open: $!\";\nmy $val = $config || 'default';   # first truthy value",
            note: 'The ternary operator `COND ? A : B` chooses between two values in one expression. The low-precedence `or` is idiomatic for error handling after operations like `open`, while `||` supplies fallback values. These keep control flow concise and readable.',
            explanation: {
              heading: 'Ternary operator',
              intro: 'The ternary conditional operator chooses between two values based on a condition, providing a compact alternative to a full if statement.',
              points: [
                { term: 'Question and colon', detail: 'A question mark and colon separate the condition and the two results.' },
                { term: 'Returns a value', detail: 'It evaluates to one of its two branches.' },
                { term: 'Inline choice', detail: 'It fits neatly inside larger expressions and assignments.' },
                { term: 'Keep it simple', detail: 'Deeply nested ternaries hurt readability and are best avoided.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'perl-loops',
    title: 'Loops',
    level: 1,
    slug: 'loops',
    concepts: [],
    children: [
      {
        id: 'perl-loops-foreach',
        title: 'foreach and while',
        level: 2,
        slug: 'foreach',
        concepts: [
          {
            id: 'perl-loops-foreach-intro',
            code: "for my $item (@list) {\n  print \"$item\\n\";\n}\nfor my $i (0 .. 9) { print $i; }   # 0..9\n\nwhile (my $line = <$fh>) {\n  chomp $line;\n}",
            note: '`for`/`foreach` iterates over a list, binding each element to a lexical loop variable. A range like `0 .. 9` produces a counted loop. `while` repeats as long as its condition is true, which is the usual way to read a file line by line.',
            explanation: {
              heading: 'foreach loops',
              intro: 'The foreach loop iterates over each element of a list, binding the current element to a loop variable each pass.',
              points: [
                { term: 'Iterates a list', detail: 'It runs its block once for each element of a list or array.' },
                { term: 'Loop variable', detail: 'Each iteration binds the current element to a named variable.' },
                { term: 'Aliases elements', detail: 'The loop variable aliases the element, so modifying it changes the array.' },
                { term: 'for synonym', detail: 'The keywords for and foreach are interchangeable in Perl.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'perl-loops-control',
        title: 'Loop Control',
        level: 2,
        slug: 'control',
        concepts: [
          {
            id: 'perl-loops-next-last',
            code: "for my $n (1 .. 10) {\n  next if $n % 2;    # skip odd numbers\n  last if $n > 6;    # stop the loop\n  print \"$n \";       # 2 4 6\n}\n\nOUTER: for my $i (1..3) {\n  for my $j (1..3) {\n    next OUTER if $j == 2;\n  }\n}",
            note: '`next` skips to the next iteration and `last` exits the loop entirely, replacing continue and break from other languages. A label like `OUTER:` lets these commands target an enclosing loop directly. `redo` restarts the current iteration without re-evaluating the condition.',
            explanation: {
              heading: 'next and last',
              intro: 'The next and last keywords control loop flow, skipping to the next iteration or exiting the loop entirely.',
              points: [
                { term: 'next skips', detail: 'The next keyword jumps to the following iteration.' },
                { term: 'last exits', detail: 'The last keyword breaks out of the loop immediately.' },
                { term: 'redo repeats', detail: 'The redo keyword restarts the current iteration without re-testing.' },
                { term: 'Labels', detail: 'A loop label lets these keywords target an outer loop.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'perl-subroutines',
    title: 'Subroutines',
    level: 1,
    slug: 'subroutines',
    concepts: [],
    children: [
      {
        id: 'perl-subs-args',
        title: 'Arguments and @_',
        level: 2,
        slug: 'arguments',
        concepts: [
          {
            id: 'perl-subs-at-underscore',
            code: "sub greet {\n  my ($name, $greeting) = @_;   # unpack arguments\n  $greeting //= 'Hello';\n  return \"$greeting, $name!\";\n}\nprint greet('Ada');            # Hello, Ada!\nprint greet('Ada', 'Hi');      # Hi, Ada!",
            note: 'Every subroutine receives its arguments in the special array `@_`. The idiomatic first line unpacks them into named lexical variables with `my (...) = @_`. Combine this with `//=` to give parameters sensible defaults.',
            explanation: {
              heading: 'The argument array',
              intro: 'Subroutine arguments arrive in a special array, and you typically unpack them into named variables at the start of the subroutine.',
              points: [
                { term: 'Underscore array', detail: 'All arguments are passed in the special underscore array.' },
                { term: 'Unpack arguments', detail: 'You commonly copy the array into named my variables first.' },
                { term: 'Flattened list', detail: 'Arrays and hashes are flattened into a single argument list.' },
                { term: 'Aliased elements', detail: 'The array elements alias the caller\'s arguments, allowing modification.' },
              ],
            },
          },
          {
            id: 'perl-subs-signatures',
            code: "use v5.36;\nsub add ($x, $y = 0) {\n  return $x + $y;\n}\nprint add(2, 3);   # 5\nprint add(2);      # 2 (default used)",
            note: 'Modern Perl supports subroutine signatures, enabled by a recent `use v5.xx`. They declare parameters directly in the definition, including defaults, which is clearer than manually unpacking `@_`. Signatures also check the argument count for you.',
            explanation: {
              heading: 'Subroutine signatures',
              intro: 'Modern Perl supports subroutine signatures that declare named parameters directly, replacing manual unpacking of the argument array.',
              points: [
                { term: 'Named parameters', detail: 'A signature lists parameter variables in the subroutine definition.' },
                { term: 'Cleaner code', detail: 'Signatures remove boilerplate that unpacks the argument array.' },
                { term: 'Default values', detail: 'A parameter can specify a default used when omitted.' },
                { term: 'Feature enabled', detail: 'Signatures are enabled by a feature pragma or a recent version.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'perl-subs-return',
        title: 'Return Values',
        level: 2,
        slug: 'return',
        concepts: [
          {
            id: 'perl-subs-return-list',
            code: "sub minmax {\n  my @sorted = sort { $a <=> $b } @_;\n  return ($sorted[0], $sorted[-1]);\n}\nmy ($lo, $hi) = minmax(4, 1, 9);   # 1 and 9",
            note: 'A subroutine can return a list, which the caller unpacks into several variables. Without an explicit `return`, a sub yields the value of its last evaluated expression. Returning lists is a natural way to hand back multiple results.',
            explanation: {
              heading: 'Returning values',
              intro: 'A Perl subroutine can return a scalar or a list, and its behavior often depends on the context in which it is called.',
              points: [
                { term: 'return keyword', detail: 'The return statement hands a value or list back to the caller.' },
                { term: 'Implicit return', detail: 'Without an explicit return, the last evaluated expression is returned.' },
                { term: 'List returns', detail: 'A subroutine can return multiple values as a list.' },
                { term: 'Context aware', detail: 'The caller\'s context can shape what a subroutine returns.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'perl-references',
    title: 'References',
    level: 1,
    slug: 'references',
    concepts: [],
    children: [
      {
        id: 'perl-refs-basics',
        title: 'Taking and Dereferencing',
        level: 2,
        slug: 'basics',
        concepts: [
          {
            id: 'perl-refs-intro',
            code: "my @arr = (1, 2, 3);\nmy $aref = \\@arr;          # reference to the array\nprint $$aref[0];           # 1 (classic deref)\nprint $aref->[0];          # 1 (arrow deref, preferred)\nprint \"@$aref\\n\";          # 1 2 3",
            note: 'A reference is a scalar that points at another variable, created with the backslash operator. To reach the data you dereference it, and the arrow operator `->` is the clearest way for arrays and hashes. References make it possible to build complex, nested structures.',
            explanation: {
              heading: 'References',
              intro: 'A reference is a scalar that points to another value, enabling nested data structures and passing collections without flattening them.',
              points: [
                { term: 'Backslash creates', detail: 'A backslash before a variable produces a reference to it.' },
                { term: 'Scalar pointer', detail: 'A reference is stored as a scalar regardless of what it points to.' },
                { term: 'Dereferencing', detail: 'A sigil in front of a reference retrieves the underlying value.' },
                { term: 'Enables structures', detail: 'References let arrays and hashes nest inside one another.' },
              ],
            },
          },
          {
            id: 'perl-refs-anon',
            code: "my $aref = [1, 2, 3];               # anonymous array ref\nmy $href = { name => 'Ada' };       # anonymous hash ref\nprint $aref->[1];                   # 2\nprint $href->{name};                # Ada",
            note: 'Square brackets create an anonymous array reference and curly braces create an anonymous hash reference, without needing a named variable first. These are the everyday building blocks for nested data. Access their contents with the arrow operator.',
            explanation: {
              heading: 'Anonymous structures',
              intro: 'You can create references to unnamed arrays and hashes directly, which is the usual way to build complex nested data.',
              points: [
                { term: 'Anonymous array', detail: 'Square brackets create a reference to an unnamed array.' },
                { term: 'Anonymous hash', detail: 'Curly braces create a reference to an unnamed hash.' },
                { term: 'Nesting', detail: 'These references combine to form multi-level data structures.' },
                { term: 'Arrow dereferencing', detail: 'The arrow operator accesses elements through a reference.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'perl-refs-code',
        title: 'Code References',
        level: 2,
        slug: 'code-refs',
        concepts: [
          {
            id: 'perl-refs-coderef',
            code: "my $double = sub { return $_[0] * 2 };\nprint $double->(5);        # 10\n\nmy %dispatch = (\n  add => sub { $_[0] + $_[1] },\n  sub => sub { $_[0] - $_[1] },\n);\nprint $dispatch{add}->(2, 3);   # 5",
            note: 'An anonymous subroutine stored in a scalar is a code reference, called with `$ref->(...)`. Code refs enable callbacks and dispatch tables, where a hash maps names to behaviors. This is a clean, extensible alternative to long if/elsif chains.',
            explanation: {
              heading: 'Code references',
              intro: 'A code reference points to a subroutine, letting you store functions in variables, pass them as arguments, and build callbacks.',
              points: [
                { term: 'Reference a sub', detail: 'A backslash before a subroutine name yields a code reference.' },
                { term: 'Anonymous subs', detail: 'The sub keyword without a name creates a code reference inline.' },
                { term: 'Call through arrow', detail: 'The arrow operator invokes the referenced subroutine.' },
                { term: 'Callbacks', detail: 'Code references enable passing behavior into other functions.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'perl-data-structures',
    title: 'Complex Data Structures',
    level: 1,
    slug: 'data-structures',
    concepts: [],
    children: [
      {
        id: 'perl-data-nested',
        title: 'Nested Structures',
        level: 2,
        slug: 'nested',
        concepts: [
          {
            id: 'perl-data-aoh',
            code: "my @people = (\n  { name => 'Ada',  langs => ['Perl', 'C'] },\n  { name => 'Alan', langs => ['ML'] },\n);\nprint $people[0]{name};           # Ada\nprint $people[0]{langs}[1];       # C\npush @{ $people[1]{langs} }, 'Perl';",
            note: 'By nesting array and hash references you can model records, tables, and trees. An array of hashes is a common shape, and the arrow between adjacent brackets is optional so `$people[0]{name}` reads cleanly. Dereference with `@{ ... }` when you need the whole inner array.',
            explanation: {
              heading: 'Nested data structures',
              intro: 'Combining references lets you build structures like an array of hashes, the common shape for representing tabular or record data.',
              points: [
                { term: 'References enable nesting', detail: 'Because arrays and hashes hold scalars, references let them nest.' },
                { term: 'Array of hashes', detail: 'A common pattern stores each record as a hash inside an array.' },
                { term: 'Arrow access', detail: 'The arrow operator navigates through the nested levels.' },
                { term: 'Arbitrary depth', detail: 'You can nest structures as deeply as your data requires.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'perl-data-inspect',
        title: 'Inspecting Structures',
        level: 2,
        slug: 'inspect',
        concepts: [
          {
            id: 'perl-data-dumper',
            code: "use Data::Dumper;\n$Data::Dumper::Sortkeys = 1;   # deterministic key order\nmy $data = { list => [1, 2], name => 'x' };\nprint Dumper($data);",
            note: '`Data::Dumper` is a core module that renders any nested structure as readable Perl, which is invaluable for debugging. Setting `$Data::Dumper::Sortkeys` makes hash output deterministic. Reach for it whenever you are unsure what a reference actually contains.',
            explanation: {
              heading: 'Data::Dumper',
              intro: 'The Data::Dumper module prints a readable representation of complex data structures, which is invaluable for debugging.',
              points: [
                { term: 'Inspect structures', detail: 'It renders nested arrays and hashes as readable text.' },
                { term: 'Debugging aid', detail: 'It quickly reveals the shape and contents of a data structure.' },
                { term: 'Core module', detail: 'It ships with Perl, so no installation is needed.' },
                { term: 'Configurable output', detail: 'Settings control indentation, sorting, and formatting.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'perl-file-io',
    title: 'File I/O',
    level: 1,
    slug: 'file-io',
    concepts: [],
    children: [
      {
        id: 'perl-file-read',
        title: 'Reading Files',
        level: 2,
        slug: 'read',
        concepts: [
          {
            id: 'perl-file-read-intro',
            code: "open(my $fh, '<', 'data.txt') or die \"open failed: $!\";\nwhile (my $line = <$fh>) {\n  chomp $line;\n  print \"got: $line\\n\";\n}\nclose($fh);\n\nmy @lines = do { open my $f, '<', 'data.txt' or die $!; <$f> };",
            note: 'Open a file with the three-argument form of `open`, using a lexical filehandle and checking for failure with `or die`. Read one line at a time with the diamond operator `<$fh>` in a `while` loop, or slurp all lines at once in list context. The `$!` variable holds the system error message.',
            explanation: {
              heading: 'Reading files',
              intro: 'Perl opens a file into a filehandle and reads it line by line with the diamond operator, ideal for processing text.',
              points: [
                { term: 'open a filehandle', detail: 'The open function associates a filehandle with a file for reading.' },
                { term: 'Diamond operator', detail: 'The angle-bracket operator reads the next line from a filehandle.' },
                { term: 'Line by line', detail: 'Reading in a while loop processes one line at a time.' },
                { term: 'Check open', detail: 'You should verify that open succeeded, often with a die on failure.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'perl-file-write',
        title: 'Writing Files',
        level: 2,
        slug: 'write',
        concepts: [
          {
            id: 'perl-file-write-intro',
            code: "open(my $out, '>', 'log.txt') or die $!;   # > truncates\nprint $out \"first line\\n\";\nclose($out);\n\nopen(my $app, '>>', 'log.txt') or die $!;  # >> appends\nprint $app \"added line\\n\";\nclose($app);",
            note: 'Open with `>` to write (truncating any existing content) or `>>` to append. Print to the filehandle by placing it right after `print` with no comma. Always close the handle so buffered data is flushed to disk.',
            explanation: {
              heading: 'Writing files',
              intro: 'Opening a file in write or append mode lets you print output to it through its filehandle, then close it when finished.',
              points: [
                { term: 'Write mode', detail: 'Opening with the write mode truncates and creates the file.' },
                { term: 'Append mode', detail: 'Opening with the append mode adds to the end of an existing file.' },
                { term: 'print to handle', detail: 'You direct print output to the filehandle to write data.' },
                { term: 'Close the handle', detail: 'Closing the filehandle flushes and releases the file.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'perl-special-vars',
    title: 'Special Variables',
    level: 1,
    slug: 'special-vars',
    concepts: [],
    children: [
      {
        id: 'perl-special-underscore',
        title: 'The Default Variable $_',
        level: 2,
        slug: 'default',
        concepts: [
          {
            id: 'perl-special-underscore-intro',
            code: "for (1 .. 3) {\n  print;          # prints $_ by default\n}\nfor (qw(a b c)) {\n  print uc;       # UC of $_ => A B C\n}\nmy @big = grep { $_ > 2 } (1, 2, 3, 4);",
            note: 'Many Perl constructs default to the topic variable `$_` when you omit an argument. A bare `for` loop, `print`, and functions like `grep` and `map` all read from `$_`. This underlies much of Perl compact, idiomatic style.',
            explanation: {
              heading: 'The default variable',
              intro: 'Perl\'s default scalar variable is used implicitly by many functions and constructs, keeping common one-line operations concise.',
              points: [
                { term: 'Implicit target', detail: 'Many functions operate on the default variable when given no argument.' },
                { term: 'Loop default', detail: 'A foreach loop with no named variable uses the default one.' },
                { term: 'Concise idioms', detail: 'It enables terse patterns for reading and matching input.' },
                { term: 'Use carefully', detail: 'Overreliance on it can make code harder to read.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'perl-special-argv-env',
        title: '@ARGV and %ENV',
        level: 2,
        slug: 'argv-env',
        concepts: [
          {
            id: 'perl-special-argv',
            code: "# perl script.pl one two\nprint \"count: \", scalar @ARGV, \"\\n\";  # 2\nprint \"first: $ARGV[0]\\n\";              # one\nmy $home = $ENV{HOME} // $ENV{USERPROFILE};\nprint \"home: $home\\n\";",
            note: 'The array `@ARGV` holds the command-line arguments passed to your script, without the program name. The hash `%ENV` exposes the process environment variables. Together they let a script respond to how and where it was invoked.',
            explanation: {
              heading: 'Command-line arguments',
              intro: 'The argument vector array holds the command-line arguments passed to a Perl script, and a related handle reads named input files.',
              points: [
                { term: 'Argument array', detail: 'The argument vector array contains the command-line parameters.' },
                { term: 'No program name', detail: 'Unlike some languages, it excludes the script name, held separately.' },
                { term: 'Diamond reads files', detail: 'The empty diamond operator reads lines from files named on the command line.' },
                { term: 'Shift arguments', detail: 'You can shift values off the argument array to consume them.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'perl-list-tools',
    title: 'Sorting, map and grep',
    level: 1,
    slug: 'list-tools',
    concepts: [],
    children: [
      {
        id: 'perl-list-sort',
        title: 'Sorting',
        level: 2,
        slug: 'sort',
        concepts: [
          {
            id: 'perl-list-sort-intro',
            code: "my @nums = (10, 2, 33, 4);\nmy @asc  = sort { $a <=> $b } @nums;   # numeric: 2,4,10,33\nmy @desc = sort { $b <=> $a } @nums;   # 33,10,4,2\nmy @words = sort { lc($a) cmp lc($b) } qw(Banana apple);",
            note: 'By default `sort` orders items as strings, so numbers need an explicit comparator. Use the spaceship `<=>` for numeric order and `cmp` for string order, with `$a` and `$b` as the two items being compared. Swap `$a` and `$b` to reverse the direction.',
            explanation: {
              heading: 'Sorting lists',
              intro: 'The sort function orders a list, defaulting to string comparison but accepting a custom comparison block for other orderings.',
              points: [
                { term: 'Default is string', detail: 'Without a block, sort compares elements as strings.' },
                { term: 'Comparison block', detail: 'A block using two special variables defines a custom order.' },
                { term: 'Numeric sort', detail: 'The spaceship operator in the block sorts numbers correctly.' },
                { term: 'Returns new list', detail: 'sort returns a sorted list and leaves the original unchanged.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'perl-list-map-grep',
        title: 'map and grep',
        level: 2,
        slug: 'map-grep',
        concepts: [
          {
            id: 'perl-list-map-grep-intro',
            code: "my @nums = (1, 2, 3, 4);\nmy @squares = map { $_ * $_ } @nums;       # 1,4,9,16\nmy @evens   = grep { $_ % 2 == 0 } @nums;  # 2,4\nmy %index = map { $_ => 1 } @nums;         # build a lookup hash",
            note: '`map` transforms each element of a list into one or more results, while `grep` keeps only the elements for which the block is true. Both iterate using `$_`. A common idiom is `map { $_ => 1 }` to turn a list into a set-style hash for fast membership tests.',
            explanation: {
              heading: 'map and grep',
              intro: 'The map function transforms each element of a list and grep filters a list by a condition, both common functional tools in Perl.',
              points: [
                { term: 'map transforms', detail: 'It applies a block to each element and collects the results.' },
                { term: 'grep filters', detail: 'It keeps only the elements for which the block is true.' },
                { term: 'Default variable', detail: 'Inside the block each element is available as the default variable.' },
                { term: 'Chainable', detail: 'map and grep combine to build concise list pipelines.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'perl-modules',
    title: 'Modules and CPAN',
    level: 1,
    slug: 'modules',
    concepts: [],
    children: [
      {
        id: 'perl-modules-use',
        title: 'Using Modules',
        level: 2,
        slug: 'use',
        concepts: [
          {
            id: 'perl-modules-use-intro',
            code: "use strict;\nuse warnings;\nuse List::Util qw(sum max first);\n\nmy $total = sum(1, 2, 3);       # 6\nmy $biggest = max(4, 9, 2);     # 9\nmy $found = first { $_ > 3 } (1, 2, 5);  # 5",
            note: '`use` loads a module at compile time and can import named functions into your namespace. Core modules like `List::Util` provide well-tested helpers such as `sum`, `max`, and `first`. Importing only what you need keeps your namespace clean.',
            explanation: {
              heading: 'Using modules',
              intro: 'The use statement loads a module at compile time and imports its symbols, giving access to reusable functionality.',
              points: [
                { term: 'Compile-time load', detail: 'use loads the module while the program is being compiled.' },
                { term: 'Imports symbols', detail: 'It brings the module\'s exported functions into your namespace.' },
                { term: 'require alternative', detail: 'The require statement loads a module at runtime instead.' },
                { term: 'Pragmas', detail: 'Some uses, like strict, enable language behaviors rather than libraries.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'perl-modules-cpan',
        title: 'CPAN and Writing Modules',
        level: 2,
        slug: 'cpan',
        concepts: [
          {
            id: 'perl-modules-cpan-install',
            code: "# install from the shell using the modern client\n# cpanm Try::Tiny\n# cpanm --local-lib=~/perl5 DateTime\n\nuse Try::Tiny;   # then use it in your code",
            note: 'CPAN is Perl vast archive of reusable modules. The `cpanm` client installs distributions by name, optionally into a local library directory to avoid touching system Perl. After installing, load a module with `use` like any other.',
            explanation: {
              heading: 'CPAN modules',
              intro: 'CPAN is Perl\'s vast repository of reusable modules, installed with tools like the cpan client to extend your programs.',
              points: [
                { term: 'Central repository', detail: 'CPAN hosts thousands of shared Perl modules.' },
                { term: 'cpan client', detail: 'A command-line client downloads and installs modules and dependencies.' },
                { term: 'cpanm alternative', detail: 'The cpanminus tool offers a simpler, faster installation experience.' },
                { term: 'Reuse over reinvention', detail: 'Using CPAN modules saves writing common functionality yourself.' },
              ],
            },
          },
          {
            id: 'perl-modules-package',
            code: "package My::Math;\nuse strict;\nuse warnings;\n\nsub square { return $_[0] ** 2 }\n\n1;   # a module must return a true value",
            note: 'A module is a file whose `package` declaration matches its path, for example `My/Math.pm` for `My::Math`. Define subroutines inside, and end the file with a true value (conventionally `1;`) so `use` succeeds. This is how you organize reusable code.',
            explanation: {
              heading: 'Packages',
              intro: 'The package keyword declares a namespace that groups related variables and subroutines, the foundation for modules and classes.',
              points: [
                { term: 'Declares a namespace', detail: 'A package groups symbols under a distinct name.' },
                { term: 'Avoids collisions', detail: 'Namespacing prevents name clashes between different code units.' },
                { term: 'Module basis', detail: 'A module is typically a package saved in a matching file.' },
                { term: 'Class foundation', detail: 'Object-oriented Perl builds classes on top of packages.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'perl-oop',
    title: 'Object-Oriented Perl',
    level: 1,
    slug: 'oop',
    concepts: [],
    children: [
      {
        id: 'perl-oop-class',
        title: 'Packages, bless, and Methods',
        level: 2,
        slug: 'class',
        concepts: [
          {
            id: 'perl-oop-bless',
            code: "package Point;\nsub new {\n  my ($class, %args) = @_;\n  my $self = { x => $args{x}, y => $args{y} };\n  return bless $self, $class;\n}\nsub x { return $_[0]->{x} }\n1;\n\n# usage:\nmy $p = Point->new(x => 3, y => 4);\nprint $p->x;   # 3",
            note: 'Classic Perl objects are references that have been `bless`ed into a package, which associates them with that package methods. A `new` constructor builds a hash of state and blesses it. Methods receive the object as their first argument, accessed via `$_[0]` or unpacked with `my $self = shift`.',
            explanation: {
              heading: 'Objects with bless',
              intro: 'Perl builds objects by blessing a reference into a package, which tells Perl that the reference belongs to that class.',
              points: [
                { term: 'bless a reference', detail: 'The bless function associates a reference with a class package.' },
                { term: 'Constructor pattern', detail: 'A new subroutine typically creates and blesses a reference.' },
                { term: 'Methods are subs', detail: 'Class methods are ordinary subroutines in the package.' },
                { term: 'Arrow calls methods', detail: 'The arrow operator invokes a method on a blessed object.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'perl-oop-inheritance',
        title: 'Inheritance',
        level: 2,
        slug: 'inheritance',
        concepts: [
          {
            id: 'perl-oop-parent',
            code: "package Point3D;\nuse parent -norequire, 'Point';\n\nsub new {\n  my ($class, %args) = @_;\n  my $self = Point::new($class, %args);\n  $self->{z} = $args{z};\n  return $self;\n}\n1;",
            note: 'The `use parent` pragma sets a class ancestry so method calls fall through to parent classes. A subclass can call the parent constructor to reuse its setup, then add its own fields. For larger projects, object systems like `Moo` or `Moose` reduce this boilerplate.',
            explanation: {
              heading: 'Inheritance',
              intro: 'A class declares its parents to inherit their methods, and Perl searches the inheritance chain when a method is called.',
              points: [
                { term: 'parent pragma', detail: 'The parent pragma declares the classes to inherit from.' },
                { term: 'Method resolution', detail: 'Perl searches parent classes when a method is not found locally.' },
                { term: 'SUPER call', detail: 'The SUPER pseudo-class invokes a parent\'s version of a method.' },
                { term: 'Modern alternatives', detail: 'Frameworks like Moose offer richer object systems on top of this.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'perl-error-handling',
    title: 'Error Handling',
    level: 1,
    slug: 'error-handling',
    concepts: [],
    children: [
      {
        id: 'perl-error-eval-die',
        title: 'die and eval',
        level: 2,
        slug: 'eval-die',
        concepts: [
          {
            id: 'perl-error-eval-intro',
            code: "my $result = eval {\n  die \"something broke\\n\" if $bad;\n  return 42;\n};\nif ($@) {\n  warn \"caught: $@\";   # $@ holds the error\n} else {\n  print \"ok: $result\\n\";\n}",
            note: '`die` throws an exception, and a block `eval { ... }` catches it so your program does not simply exit. After the eval, the special variable `$@` holds the error message, or is empty on success. Always check `$@` immediately, before other operations can reset it.',
            explanation: {
              heading: 'Error handling with eval',
              intro: 'The block form of eval traps runtime errors so the program can recover, with the error message left in a special variable.',
              points: [
                { term: 'eval traps errors', detail: 'A die inside an eval block is caught rather than ending the program.' },
                { term: 'Error variable', detail: 'After the block, the special error variable holds any error message.' },
                { term: 'die raises', detail: 'The die function throws an error that eval can catch.' },
                { term: 'Check after', detail: 'You test the error variable to see whether the block failed.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'perl-error-try-tiny',
        title: 'Try::Tiny',
        level: 2,
        slug: 'try-tiny',
        concepts: [
          {
            id: 'perl-error-try-tiny-intro',
            code: "use Try::Tiny;\n\nmy $value = try {\n  risky_operation();\n} catch {\n  warn \"failed: $_\";   # error is in $_ here\n  return undef;\n};",
            note: '`Try::Tiny` provides clean `try`/`catch` blocks that avoid the well-known pitfalls of bare `eval` and `$@`. Inside the `catch` block the error is available in `$_`. It is the recommended way to handle exceptions robustly in real programs.',
            explanation: {
              heading: 'Try::Tiny',
              intro: 'The Try::Tiny module provides clean try and catch blocks that avoid subtle pitfalls of using eval directly for error handling.',
              points: [
                { term: 'try and catch', detail: 'It offers readable try and catch blocks for handling errors.' },
                { term: 'Avoids eval pitfalls', detail: 'It sidesteps common bugs around the error variable being clobbered.' },
                { term: 'Error passed in', detail: 'The catch block receives the error as an argument.' },
                { term: 'Lightweight', detail: 'The module is small and focused on safe exception handling.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'perl-formatting',
    title: 'Formatting and Here-Docs',
    level: 1,
    slug: 'formatting',
    concepts: [],
    children: [
      {
        id: 'perl-format-printf',
        title: 'printf and sprintf',
        level: 2,
        slug: 'printf',
        concepts: [
          {
            id: 'perl-format-printf-intro',
            code: "printf \"%-10s %5.2f\\n\", 'total', 3.14159;   # total        3.14\nmy $s = sprintf '%05d', 42;                  # '00042'\nprintf \"%x\\n\", 255;                          # ff (hex)",
            note: '`printf` prints a formatted string, while `sprintf` returns one instead of printing. Format codes control width, precision, padding, and base: `%s` for strings, `%d` for integers, `%f` for floats, and `%x` for hex. A leading minus left-justifies and a leading zero pads with zeros.',
            explanation: {
              heading: 'Formatted output',
              intro: 'The printf and sprintf functions format values using placeholder specifiers, giving precise control over numeric and string output.',
              points: [
                { term: 'printf prints', detail: 'It writes formatted text directly to output.' },
                { term: 'sprintf returns', detail: 'It returns the formatted string instead of printing it.' },
                { term: 'Format specifiers', detail: 'Percent-prefixed codes control width, precision, and type.' },
                { term: 'Number formatting', detail: 'It is ideal for aligning columns and fixing decimal places.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'perl-format-heredoc',
        title: 'Here-Documents',
        level: 2,
        slug: 'here-docs',
        concepts: [
          {
            id: 'perl-format-heredoc-intro',
            code: "my $name = 'Ada';\nmy $msg = <<\"END\";\nDear $name,\n  Welcome aboard.\nEND\n\nmy $raw = <<'END';\nNo $interpolation here.\nEND",
            note: 'A here-doc lets you write a multi-line string that ends at a chosen terminator. Using a double-quoted label like `<<\"END\"` interpolates variables, while a single-quoted `<<\'END\'` keeps the text literal. The indented form `<<~END` also lets you strip leading whitespace for tidy code.',
            explanation: {
              heading: 'Heredocs',
              intro: 'A heredoc lets you write a multi-line block of text inline, with interpolation controlled by how the terminator is quoted.',
              points: [
                { term: 'Multi-line text', detail: 'A heredoc captures several lines up to a chosen terminator.' },
                { term: 'Interpolation control', detail: 'Quoting the terminator determines whether variables interpolate.' },
                { term: 'Indented form', detail: 'A tilde before the terminator allows indenting the closing marker.' },
                { term: 'Templates', detail: 'Heredocs are handy for embedding blocks of formatted output.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'perl-one-liners',
    title: 'Idiomatic One-Liners',
    level: 1,
    slug: 'one-liners',
    concepts: [],
    children: [
      {
        id: 'perl-oneliners-command',
        title: 'Command-Line Perl',
        level: 2,
        slug: 'command-line',
        concepts: [
          {
            id: 'perl-oneliners-intro',
            code: "# -e run code, -n loop over lines, -p loop and print\nperl -ne 'print if /error/i' app.log\nperl -pe 's/\\r//g' win.txt          # strip carriage returns\nperl -lne '$sum += $_; END { print $sum }' nums.txt",
            note: 'The `-e` flag runs code from the command line, `-n` wraps it in a line-reading loop, and `-p` does the same but prints `$_` automatically after each pass. Add `-l` to handle line endings for you. These flags turn Perl into a powerful text-processing swiss army knife.',
            explanation: {
              heading: 'One-liners',
              intro: 'Perl excels at command-line one-liners that process text, using flags to run code against each line of input.',
              points: [
                { term: 'Execute flag', detail: 'The execute flag runs the program given on the command line.' },
                { term: 'Line loop flag', detail: 'A loop flag wraps the code so it runs for each input line.' },
                { term: 'Auto-print', detail: 'A print flag automatically outputs each processed line.' },
                { term: 'Text processing', detail: 'One-liners are powerful for quick filtering and editing of files.' },
              ],
            },
          },
          {
            id: 'perl-oneliners-inplace',
            code: "perl -i.bak -pe 's/foo/bar/g' file.txt   # edit in place, keep .bak\nperl -F, -lane 'print $F[1]' data.csv    # -a autosplit, -F sets sep",
            note: 'The `-i` flag edits files in place, and giving it a suffix like `.bak` keeps a backup copy. The `-a` flag autosplits each line into the array `@F`, with `-F` choosing the delimiter. Combined, these make quick field extraction and bulk edits trivial from the shell.',
            explanation: {
              heading: 'In-place editing',
              intro: 'The in-place edit flag lets a one-liner modify files directly, optionally keeping a backup of the original contents.',
              points: [
                { term: 'In-place flag', detail: 'The edit flag rewrites each named file with the processed output.' },
                { term: 'Backups', detail: 'Supplying an extension to the flag saves a backup copy first.' },
                { term: 'Batch edits', detail: 'It applies the same transformation across many files at once.' },
                { term: 'Use with care', detail: 'Without a backup the original content is replaced permanently.' },
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
