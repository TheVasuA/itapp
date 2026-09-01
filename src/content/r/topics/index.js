// R topic tree.
//
// Each node is a ConceptNode: { id, title, level, slug?, concepts[], children[] }.
// Routable nodes carry a `slug`. Every Concept renders in the fixed order
// code -> note -> example (example optional).

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  // 1. Basics & Assignment
  {
    id: 'r-basics',
    title: 'Basics & Assignment',
    level: 1,
    slug: 'basics',
    concepts: [],
    children: [
      {
        id: 'r-assignment',
        title: 'Assignment Operators',
        level: 2,
        slug: 'assignment',
        concepts: [
          {
            id: 'r-assign-arrow',
            code: 'x <- 10\ny = 5\n42 -> z\nprint(x + y + z)  # 57',
            note: 'The idiomatic assignment operator in R is `<-`. The `=` operator also works but is conventionally reserved for function arguments. The rightward `->` is valid but rarely used.',
            explanation: {
              heading: 'The assignment arrow',
              intro: 'R binds a value to a name using the assignment arrow, written as a less than sign followed by a dash. The dash arrow is the community standard, while the equals sign is kept mostly for passing named arguments inside function calls.',
              points: [
                { term: 'Standard arrow', detail: 'The left arrow made of a less than sign and a dash is the idiomatic way to assign in scripts and packages.' },
                { term: 'Equals for arguments', detail: 'The equals sign works for assignment but by convention is reserved for naming arguments in a function call.' },
                { term: 'Rightward assign', detail: 'A dash followed by a greater than sign assigns to the name on the right and is occasionally handy at the end of a pipe.' },
                { term: 'Global assign', detail: 'A double left arrow assigns into an enclosing or global scope, which should be used sparingly.' },
              ],
            },
            example: 'a <- b <- 0  # chained assignment sets both to 0',
          },
          {
            id: 'r-assign-print',
            code: 'result <- 3 * 7   # assigns silently\nresult            # auto-prints in console: 21\n(x <- 5)          # wrap in parens to assign AND print',
            note: 'Typing a name at the console prints its value. Assignment itself is silent, so wrapping an assignment in parentheses is a handy trick to assign and display in one line.',
            explanation: {
              heading: 'Auto-printing at the console',
              intro: 'When you type a bare expression at the R console, R evaluates it and prints the result automatically. Assignment returns its value invisibly, so nothing shows unless you force it to print.',
              points: [
                { term: 'Bare names print', detail: 'Entering a name alone evaluates it and displays the value in the console.' },
                { term: 'Silent assignment', detail: 'An assignment produces its value invisibly, so it does not print on its own.' },
                { term: 'Parentheses trick', detail: 'Wrapping an assignment in parentheses makes the result visible and assigns it in a single line.' },
                { term: 'Scripts differ', detail: 'Inside scripts and functions you must call print explicitly, since only the top-level console auto-prints.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'r-comments-help',
        title: 'Comments & Help',
        level: 2,
        slug: 'comments-help',
        concepts: [
          {
            id: 'r-comments',
            code: '# This is a comment; R has no block comment syntax\nx <- 5  # inline comments start with #\n?mean   # open help for the mean function\nhelp("sum")',
            note: 'Comments begin with `#` and run to the end of the line. R has no multi-line comment syntax. Use `?name` or `help("name")` to open documentation for any function.',
            explanation: {
              heading: 'Comments and built-in help',
              intro: 'R comments start with the hash sign and continue to the end of the line, with no block comment form. The language ships with rich documentation that you reach through the question mark and help functions.',
              points: [
                { term: 'Line comments only', detail: 'Everything after a hash sign on a line is ignored, and there is no multi-line comment syntax.' },
                { term: 'Quick help', detail: 'Prefixing a function name with a question mark opens its help page.' },
                { term: 'Help function', detail: 'The help function with a quoted name does the same and works well for operators and reserved words.' },
                { term: 'Search and examples', detail: 'A double question mark searches all help, and the example function runs a function documented examples.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'r-packages',
        title: 'Packages',
        level: 2,
        slug: 'packages',
        concepts: [
          {
            id: 'r-packages-install',
            code: 'install.packages("dplyr")   # download from CRAN (once)\nlibrary(dplyr)              # load into session (each time)\ndplyr::filter(mtcars, mpg > 20)  # use without loading',
            note: 'Install a package once with `install.packages()`, which downloads it from CRAN. Load it into each new session with `library()`. Use `package::function` to call a function without loading the whole package.',
            explanation: {
              heading: 'Installing and loading packages',
              intro: 'R functionality lives in packages downloaded from the central CRAN repository. You install a package once onto disk, then load it into each fresh session before its functions become available.',
              points: [
                { term: 'Install once', detail: 'The install packages function downloads and saves a package to your library on disk a single time.' },
                { term: 'Load each session', detail: 'The library function attaches an installed package so its functions can be called in the current session.' },
                { term: 'Namespaced calls', detail: 'Writing the package name, two colons, and the function name calls it without attaching the whole package.' },
                { term: 'CRAN source', detail: 'By default packages come from CRAN, the curated network of mirrors that hosts thousands of R packages.' },
              ],
            },
          },
          {
            id: 'r-packages-tidyverse',
            code: 'install.packages("tidyverse")\nlibrary(tidyverse)  # loads dplyr, ggplot2, tidyr, readr, and more',
            note: 'The tidyverse is a meta-package that bundles the core data science packages together. Loading it with one call gives you a consistent, well-integrated toolkit for analysis.',
            explanation: {
              heading: 'The tidyverse meta-package',
              intro: 'The tidyverse is a single package that pulls in a family of data science packages sharing a common design philosophy. Loading it gives you tools for import, tidying, transformation, and visualization in one consistent style.',
              points: [
                { term: 'One import', detail: 'A single library call loads dplyr, ggplot2, tidyr, readr, and other core members at once.' },
                { term: 'Shared design', detail: 'Member packages follow consistent naming and data-first argument order so they compose smoothly.' },
                { term: 'Tibbles', detail: 'The tidyverse favors the tibble, a modern data frame with cleaner printing and no surprise type changes.' },
                { term: 'Pipe friendly', detail: 'Functions are built to chain through the pipe, reading as a sequence of clear steps.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 2. Vectors & Vectorization
  {
    id: 'r-vectors',
    title: 'Vectors & Vectorization',
    level: 1,
    slug: 'vectors',
    concepts: [],
    children: [
      {
        id: 'r-vectors-create',
        title: 'Creating Vectors',
        level: 2,
        slug: 'create',
        concepts: [
          {
            id: 'r-vectors-c',
            code: 'nums <- c(1, 2, 3, 4, 5)\nwords <- c("apple", "banana")\nlength(nums)  # 5',
            note: 'The atomic vector is the fundamental data structure in R; even a single value is a length-1 vector. Use `c()` to combine values into a vector. All elements must share one type.',
            explanation: {
              heading: 'Vectors are the base unit',
              intro: 'In R the atomic vector is the fundamental building block, and there is no separate scalar type, so even a lone number is a vector of length one. The combine function joins values into a single vector where every element shares one type.',
              points: [
                { term: 'No scalars', detail: 'A single value is really a length-one vector, which is why most operations naturally work on whole vectors.' },
                { term: 'Combine function', detail: 'The c function glues individual values or vectors together into one longer vector.' },
                { term: 'One type', detail: 'All elements of an atomic vector must share a single type such as numeric, character, or logical.' },
                { term: 'Type coercion', detail: 'Mixing types forces silent coercion to the most flexible type, usually character.' },
              ],
            },
            example: 'mixed <- c(1, "two", TRUE)  # coerced to character: "1" "two" "TRUE"',
          },
          {
            id: 'r-vectors-seq',
            code: '1:5              # 1 2 3 4 5\nseq(0, 1, by = 0.25)   # 0.00 0.25 0.50 0.75 1.00\nrep(c(0, 1), times = 3)  # 0 1 0 1 0 1',
            note: 'The colon operator `:` builds integer sequences. Use `seq()` for finer control over step size or length, and `rep()` to repeat values a given number of times.',
            explanation: {
              heading: 'Building sequences',
              intro: 'R offers several quick ways to construct patterned vectors without loops. The colon builds simple integer runs, while dedicated functions give control over step size, length, and repetition.',
              points: [
                { term: 'Colon operator', detail: 'The colon between two numbers produces a consecutive integer sequence in either direction.' },
                { term: 'Seq for steps', detail: 'The seq function lets you set the step size or the total length precisely.' },
                { term: 'Rep for repeats', detail: 'The rep function repeats values a fixed number of times or up to a target length.' },
                { term: 'Vectorized building', detail: 'These helpers create whole vectors at once, which is faster and clearer than growing one in a loop.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'r-vectors-names',
        title: 'Named Vectors',
        level: 2,
        slug: 'names',
        concepts: [
          {
            id: 'r-vectors-named',
            code: 'ages <- c(alice = 30, bob = 25)\nages["alice"]        # 30\nnames(ages)          # "alice" "bob"',
            note: 'Vector elements can carry names, letting you index by label instead of position. Assign names inline or with the `names()` function. This is a lightweight alternative to a full data structure.',
            explanation: {
              heading: 'Named vectors',
              intro: 'Each element of a vector can be tagged with a name, giving you a simple key-to-value mapping. You can then look up elements by their label rather than remembering positions.',
              points: [
                { term: 'Label access', detail: 'Indexing with a name in brackets returns the element tagged with that label.' },
                { term: 'Inline names', detail: 'Writing name equals value inside the combine function attaches names as you build the vector.' },
                { term: 'Names function', detail: 'The names function reads existing names or assigns new ones after the fact.' },
                { term: 'Lightweight map', detail: 'Named vectors act as a compact lookup table when a full list or data frame would be overkill.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'r-vec-arithmetic',
        title: 'Element-wise Arithmetic',
        level: 2,
        slug: 'arithmetic',
        concepts: [
          {
            id: 'r-vec-elementwise',
            code: 'a <- c(1, 2, 3)\nb <- c(10, 20, 30)\na + b        # 11 22 33\na * 2        # 2 4 6',
            note: 'Arithmetic in R is vectorized: operations apply to each element without an explicit loop. This makes code shorter and much faster than element-by-element iteration.',
            explanation: {
              heading: 'Vectorized arithmetic',
              intro: 'Arithmetic operators in R act on entire vectors at once, applying element by element across matching positions. This vectorized style removes the need for explicit loops and runs much faster because the work happens in compiled code.',
              points: [
                { term: 'Element-wise', detail: 'Adding or multiplying two vectors combines their matching positions to produce a new vector.' },
                { term: 'Scalar broadcast', detail: 'Combining a vector with a single value applies that value to every element.' },
                { term: 'No loops needed', detail: 'Vectorized expressions replace hand-written loops and read closer to the underlying math.' },
                { term: 'Speed', detail: 'The looping happens inside fast compiled routines rather than the slower interpreter.' },
              ],
            },
          },
          {
            id: 'r-vec-recycling',
            code: 'c(1, 2, 3, 4) + c(10, 20)  # 11 22 13 24',
            note: 'When vectors differ in length, R recycles the shorter one to match the longer. Recycling is powerful but silent, so watch for length mismatches that are not clean multiples.',
            explanation: {
              heading: 'Recycling rules',
              intro: 'When an operation combines vectors of different lengths, R repeats the shorter vector from the start until it matches the longer one. This recycling is convenient but happens quietly, so a length mismatch can produce unexpected results.',
              points: [
                { term: 'Repeat to match', detail: 'The shorter vector is reused from its beginning until it lines up with the longer vector.' },
                { term: 'Clean multiples', detail: 'Recycling is intended for cases where the longer length is a whole multiple of the shorter one.' },
                { term: 'Warning on mismatch', detail: 'If the lengths are not a clean multiple, R still recycles but issues a warning.' },
                { term: 'Scalar case', detail: 'The common single-value case is just recycling of a length-one vector across the whole operation.' },
              ],
            },
            example: 'c(1, 2, 3) + c(10, 20)  # warning: longer length is not a multiple',
          },
        ],
        children: [],
      },
      {
        id: 'r-vec-logical',
        title: 'Logical & Comparison',
        level: 2,
        slug: 'logical',
        concepts: [
          {
            id: 'r-vec-compare',
            code: 'x <- c(5, 12, 8, 3)\nx > 6          # FALSE TRUE TRUE FALSE\nsum(x > 6)     # 2 (TRUE counts as 1)\nany(x > 10)    # TRUE',
            note: 'Comparison operators return logical vectors. Because TRUE equals 1 and FALSE equals 0, `sum()` on a logical vector counts matches. Use `any()` and `all()` to reduce to a single value.',
            explanation: {
              heading: 'Logical vectors and comparison',
              intro: 'Comparison operators run element by element and return a logical vector of true and false values. Because true counts as one and false as zero, you can summarize those results with ordinary numeric functions.',
              points: [
                { term: 'Vector results', detail: 'A comparison against a vector yields one logical value per element.' },
                { term: 'True as one', detail: 'Logical values behave as one and zero in arithmetic, so summing them counts the true cases.' },
                { term: 'Any and all', detail: 'The any function reports whether at least one value is true, while all reports whether every value is true.' },
                { term: 'Mean as proportion', detail: 'Taking the mean of a logical vector gives the fraction of elements that are true.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 3. Data Types & Factors
  {
    id: 'r-data-types',
    title: 'Data Types & Factors',
    level: 1,
    slug: 'data-types',
    concepts: [],
    children: [
      {
        id: 'r-types-atomic',
        title: 'Atomic Types',
        level: 2,
        slug: 'atomic',
        concepts: [
          {
            id: 'r-types-basic',
            code: 'class(3.14)     # "numeric"\nclass(2L)       # "integer" (L suffix)\nclass("hi")     # "character"\nclass(TRUE)     # "logical"',
            note: 'R has six atomic types; the common ones are numeric (double), integer, character, and logical. Append `L` to write an integer literal. Use `class()` or `typeof()` to inspect a value.',
            explanation: {
              heading: 'Atomic types',
              intro: 'Every atomic vector holds one of a small set of basic types, and the ones you use daily are double, integer, character, and logical. R decides the type from how you write a literal, and you can inspect it with dedicated functions.',
              points: [
                { term: 'Numeric default', detail: 'Plain numbers are stored as doubles, R name for double precision floating point values.' },
                { term: 'Integer literal', detail: 'Appending a capital L to a whole number forces it to be an integer rather than a double.' },
                { term: 'Character and logical', detail: 'Quoted text is character, and the reserved words for true and false are logical.' },
                { term: 'Inspecting type', detail: 'The class and typeof functions report how a value is stored at different levels of detail.' },
              ],
            },
          },
          {
            id: 'r-types-coerce',
            code: 'as.numeric("42")    # 42\nas.character(3.5)   # "3.5"\nas.integer(TRUE)    # 1\nas.numeric("abc")   # NA with warning',
            note: 'Coercion functions convert between types explicitly. Failed conversions produce `NA` and a warning rather than an error, so always check results when converting user input.',
            explanation: {
              heading: 'Explicit type coercion',
              intro: 'The as-dot family of functions converts a value from one type to another on demand. When a conversion cannot succeed, R fills in a missing value and warns rather than stopping with an error.',
              points: [
                { term: 'As functions', detail: 'Functions like as numeric and as character request an explicit conversion to a target type.' },
                { term: 'Failure yields NA', detail: 'A value that cannot be converted becomes NA accompanied by a warning.' },
                { term: 'Logical to number', detail: 'Converting logical values gives one for true and zero for false.' },
                { term: 'Check user input', detail: 'Because failures are silent apart from a warning, validate converted input before relying on it.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'r-types-check',
        title: 'Checking Types',
        level: 2,
        slug: 'check',
        concepts: [
          {
            id: 'r-types-is',
            code: 'is.numeric(5)        # TRUE\nis.character("x")    # TRUE\nis.na(NA)            # TRUE\nis.null(NULL)        # TRUE',
            note: 'The `is.*()` family returns a logical answer about a value type or state. These predicates are the safe way to test values before operating on them, especially for `NA` and `NULL`.',
            explanation: {
              heading: 'Type-checking predicates',
              intro: 'The is-dot family of functions asks a yes or no question about the type or state of a value and returns a logical answer. They are the reliable way to test a value before you operate on it.',
              points: [
                { term: 'Predicate style', detail: 'Each is-dot function returns a single true or false describing whether a value has a given type or state.' },
                { term: 'Missing check', detail: 'The is na function is the correct way to detect missing values, since comparing against NA does not work.' },
                { term: 'Null check', detail: 'The is null function tests for the empty NULL object, which stands apart from NA.' },
                { term: 'Guard first', detail: 'Testing with a predicate before an operation prevents surprising results from unexpected inputs.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'r-factors',
        title: 'Factors',
        level: 2,
        slug: 'factors',
        concepts: [
          {
            id: 'r-factors-intro',
            code: 'sizes <- factor(c("S", "L", "M", "S"))\nlevels(sizes)   # "L" "M" "S" (alphabetical)\ntable(sizes)    # counts per level',
            note: 'Factors store categorical data as integer codes mapped to a set of labels called levels. They are memory efficient and signal to statistical functions that a variable is categorical.',
            explanation: {
              heading: 'Factors for categories',
              intro: 'A factor represents categorical data by storing compact integer codes together with a set of text labels called levels. This tells statistical functions that a variable is a category rather than free text or a number.',
              points: [
                { term: 'Codes plus levels', detail: 'Each value is stored as an integer that points into a shared table of level labels.' },
                { term: 'Fixed set', detail: 'The levels define the allowed categories, and values outside that set become missing.' },
                { term: 'Statistical meaning', detail: 'Modeling and plotting functions treat factors as grouping variables automatically.' },
                { term: 'Level order', detail: 'By default levels sort alphabetically, which affects how tables and charts are arranged.' },
              ],
            },
          },
          {
            id: 'r-factors-order',
            code: 'sizes <- factor(\n  c("S", "L", "M"),\n  levels = c("S", "M", "L"),\n  ordered = TRUE\n)\nsizes[1] < sizes[2]  # TRUE',
            note: 'Set `levels` explicitly to control ordering rather than relying on alphabetical order. With `ordered = TRUE`, the levels gain a rank so comparison operators become meaningful.',
            explanation: {
              heading: 'Ordered factors',
              intro: 'You can pass the levels argument to fix the order of categories instead of accepting the default alphabetical order. Marking a factor as ordered gives its levels a rank so that comparisons between them make sense.',
              points: [
                { term: 'Explicit levels', detail: 'Supplying the levels argument sets the exact order in which categories are recognized.' },
                { term: 'Ordered flag', detail: 'Setting ordered to true turns the factor into a ranked scale rather than plain labels.' },
                { term: 'Comparisons work', detail: 'On an ordered factor the less than and greater than operators compare by level rank.' },
                { term: 'Natural scales', detail: 'Ordered factors suit ratings and sizes where the categories have an inherent sequence.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 4. Data Structures
  {
    id: 'r-structures',
    title: 'Data Structures',
    level: 1,
    slug: 'structures',
    concepts: [],
    children: [
      {
        id: 'r-lists-create',
        title: 'Lists',
        level: 2,
        slug: 'lists',
        concepts: [
          {
            id: 'r-lists-intro',
            code: 'person <- list(\n  name = "Alice",\n  age = 30,\n  scores = c(90, 85, 88)\n)\nperson$name       # "Alice"\nperson[["scores"]]  # 90 85 88',
            note: 'Lists are containers that can hold elements of different types and lengths, including other lists. They are ideal for structured or nested data where vectors would be too rigid.',
            explanation: {
              heading: 'Lists as flexible containers',
              intro: 'A list is a general container whose elements can be any type and any length, including other lists. This makes lists the natural choice for structured or nested data that an atomic vector cannot hold.',
              points: [
                { term: 'Mixed contents', detail: 'One list can hold numbers, text, vectors, and even nested lists side by side.' },
                { term: 'Named elements', detail: 'Elements are often given names so you can retrieve them by label with the dollar sign.' },
                { term: 'Nesting', detail: 'Because a list element can itself be a list, lists model tree-shaped data cleanly.' },
                { term: 'Function results', detail: 'Many R functions return lists, since a list can bundle several outputs of different shapes.' },
              ],
            },
          },
          {
            id: 'r-lists-brackets',
            code: 'x <- list(a = 1, b = 2, c = 3)\nx[["a"]]   # 1 (the element itself)\nx["a"]     # a sub-list containing a\nx$b        # 2',
            note: 'Use double brackets `[[ ]]` or `$` to extract a single element from a list. Single brackets `[ ]` return a sub-list, preserving the list structure around the result.',
            explanation: {
              heading: 'List indexing operators',
              intro: 'Lists offer two bracket styles that behave differently. Double brackets and the dollar sign reach inside to pull out a single element, while single brackets keep the list wrapper and return a smaller list.',
              points: [
                { term: 'Double brackets', detail: 'Double brackets extract the actual element itself, not a list containing it.' },
                { term: 'Dollar sign', detail: 'The dollar sign fetches a named element and is the most common shorthand.' },
                { term: 'Single brackets', detail: 'Single brackets return a sub-list, preserving the list structure around the selected elements.' },
                { term: 'Shape matters', detail: 'Choosing the wrong bracket is a frequent source of bugs when a later step expects a bare value.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'r-matrices',
        title: 'Matrices',
        level: 2,
        slug: 'matrices',
        concepts: [
          {
            id: 'r-matrices-intro',
            code: 'm <- matrix(1:6, nrow = 2, ncol = 3)\ndim(m)      # 2 3\nm[1, 2]     # element at row 1, col 2\nm[, 2]      # entire second column',
            note: 'A matrix is a two-dimensional vector where all elements share one type. Data fills column-by-column by default. Index with `[row, col]`, leaving a slot blank to select a whole row or column.',
            explanation: {
              heading: 'Matrices',
              intro: 'A matrix is really an atomic vector given two dimensions, so all of its elements must share a single type. Values fill the grid one column at a time by default, and you index with a row and column pair.',
              points: [
                { term: 'Two-dimensional vector', detail: 'A matrix is a vector plus a dimension attribute describing rows and columns.' },
                { term: 'Column-major fill', detail: 'Supplied values fill down the first column, then the next, unless you request row-wise filling.' },
                { term: 'Row-column index', detail: 'Indexing with a row and column in brackets selects a single cell.' },
                { term: 'Blank slot', detail: 'Leaving the row or column position empty selects an entire row or column.' },
              ],
            },
          },
          {
            id: 'r-matrices-math',
            code: 'a <- matrix(1:4, nrow = 2)\nt(a)          # transpose\na %*% a       # matrix multiplication\nrowSums(a)    # sum of each row',
            note: 'The `%*%` operator performs true matrix multiplication, while `*` multiplies element-wise. Helpers like `t()`, `rowSums()`, and `colMeans()` cover common linear algebra tasks.',
            explanation: {
              heading: 'Matrix math',
              intro: 'R distinguishes between element-wise arithmetic and genuine linear algebra on matrices. The percent-star-percent operator does true matrix multiplication, while the plain star multiplies matching cells.',
              points: [
                { term: 'True multiplication', detail: 'The percent-star-percent operator multiplies matrices in the linear algebra sense, combining rows with columns.' },
                { term: 'Element-wise star', detail: 'The plain star multiplies corresponding cells rather than doing matrix multiplication.' },
                { term: 'Transpose', detail: 'The t function flips a matrix so its rows become columns.' },
                { term: 'Row and column helpers', detail: 'Functions like row sums and column means summarize along a chosen dimension quickly.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'r-dataframes',
        title: 'Data Frames',
        level: 2,
        slug: 'dataframes',
        concepts: [
          {
            id: 'r-df-intro',
            code: 'df <- data.frame(\n  name = c("Alice", "Bob"),\n  age = c(30, 25),\n  stringsAsFactors = FALSE\n)\ndf$age    # 30 25\nnrow(df)  # 2',
            note: 'A data frame is a table where each column is a vector of equal length, and columns may hold different types. It is the primary structure for tabular analysis in R.',
            explanation: {
              heading: 'Data frames',
              intro: 'A data frame is R core table structure, built as a list of equal-length column vectors. Each column can be a different type, which mirrors how real datasets mix numbers, text, and categories.',
              points: [
                { term: 'Columns as vectors', detail: 'Every column is a vector, and all columns must share the same length.' },
                { term: 'Mixed types', detail: 'Different columns can hold different types, unlike a matrix which is uniform.' },
                { term: 'List underneath', detail: 'A data frame is technically a list of columns, so list-style access also works on it.' },
                { term: 'Analysis workhorse', detail: 'Most modeling, plotting, and dplyr functions expect their input as a data frame.' },
              ],
            },
            example: 'df[df$age > 28, ]  # rows where age exceeds 28',
          },
          {
            id: 'r-df-summary',
            code: 'head(df, 3)   # first 3 rows\nstr(df)       # structure and types\nsummary(df)   # per-column statistics\ncolnames(df)  # column names',
            note: 'Start every analysis by inspecting the data. `head()` shows the top rows, `str()` reveals column types compactly, and `summary()` gives descriptive statistics for each column.',
            explanation: {
              heading: 'Inspecting a data frame',
              intro: 'Before analyzing data it pays to look at its shape and contents with a few quick functions. Together they reveal the first rows, the column types, and basic statistics for each column.',
              points: [
                { term: 'Head for preview', detail: 'The head function shows the first several rows so you can sanity-check the layout.' },
                { term: 'Str for structure', detail: 'The str function compactly lists each column with its type and a few sample values.' },
                { term: 'Summary statistics', detail: 'The summary function reports descriptive statistics or counts for every column.' },
                { term: 'Names and dimensions', detail: 'Helpers like col names and n row report the labels and size of the table.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 5. Indexing & Subsetting
  {
    id: 'r-indexing',
    title: 'Indexing & Subsetting',
    level: 1,
    slug: 'indexing',
    concepts: [],
    children: [
      {
        id: 'r-index-vector',
        title: 'Vector Indexing',
        level: 2,
        slug: 'vector',
        concepts: [
          {
            id: 'r-index-position',
            code: 'x <- c(10, 20, 30, 40)\nx[2]         # 20 (1-indexed)\nx[c(1, 3)]   # 10 30\nx[-1]        # drop first: 20 30 40',
            note: 'R vectors are 1-indexed. Positive indices select elements, negative indices drop them, and passing a vector of indices selects multiple positions at once.',
            explanation: {
              heading: 'Positional indexing',
              intro: 'R numbers vector positions starting at one rather than zero. Positive numbers pick elements to keep, negative numbers drop elements, and a vector of positions selects several at once.',
              points: [
                { term: 'One-based', detail: 'The first element sits at position one, which differs from many other languages.' },
                { term: 'Positive selects', detail: 'A positive index returns the element at that position.' },
                { term: 'Negative drops', detail: 'A negative index removes the element at that position and returns the rest.' },
                { term: 'Multiple positions', detail: 'Passing a vector of indices in brackets selects all of those positions together.' },
              ],
            },
          },
          {
            id: 'r-index-logical',
            code: 'x <- c(10, 20, 30, 40)\nx[x > 15]         # 20 30 40\nx[c(TRUE, FALSE)] # recycled mask: 10 30',
            note: 'Logical indexing selects elements where the mask is TRUE, which is the most common filtering idiom in R. The mask is recycled if it is shorter than the vector.',
            explanation: {
              heading: 'Logical indexing',
              intro: 'Indexing a vector with a logical mask keeps every element whose matching position is true. This is the most common way to filter data in R and reads naturally as a condition.',
              points: [
                { term: 'True keeps', detail: 'Elements aligned with a true value are returned, and those aligned with false are dropped.' },
                { term: 'Condition masks', detail: 'A comparison such as greater than produces the logical mask directly inside the brackets.' },
                { term: 'Recycling', detail: 'A mask shorter than the vector is recycled to cover it, so short masks repeat.' },
                { term: 'Assignment target', detail: 'A logical mask can also sit on the left of an assignment to update only the selected elements.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'r-index-df',
        title: 'Data Frame Subsetting',
        level: 2,
        slug: 'dataframe',
        concepts: [
          {
            id: 'r-index-df-rows',
            code: 'df[df$age > 25, ]          # rows matching condition\ndf[, c("name", "age")]     # selected columns\nsubset(df, age > 25, select = name)',
            note: 'Subset a data frame with `df[rows, cols]`, using a logical vector for rows and names or positions for columns. The `subset()` function offers a more readable alternative for interactive work.',
            explanation: {
              heading: 'Data frame subsetting',
              intro: 'A data frame is indexed with a row selector and a column selector separated by a comma. Rows are commonly chosen with a logical condition and columns by name or position.',
              points: [
                { term: 'Row then column', detail: 'The part before the comma selects rows and the part after selects columns.' },
                { term: 'Logical rows', detail: 'A logical vector, often from a comparison on a column, keeps the rows that are true.' },
                { term: 'Column by name', detail: 'Columns can be chosen with a character vector of names or with numeric positions.' },
                { term: 'Subset function', detail: 'The subset function offers a tidier syntax for interactive filtering and column selection.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 6. Control Flow & Functions
  {
    id: 'r-control-functions',
    title: 'Control Flow & Functions',
    level: 1,
    slug: 'control-functions',
    concepts: [],
    children: [
      {
        id: 'r-cf-conditionals',
        title: 'Conditionals',
        level: 2,
        slug: 'conditionals',
        concepts: [
          {
            id: 'r-cf-if',
            code: 'x <- 7\nif (x > 5) {\n  print("big")\n} else {\n  print("small")\n}\nifelse(x > 5, "big", "small")  # vectorized',
            note: 'Use `if`/`else` for a single scalar condition. For element-wise choices across a vector, use the vectorized `ifelse()`, which returns a value for each element based on its own condition.',
            explanation: {
              heading: 'Conditionals',
              intro: 'The if and else keywords branch on a single true or false value to choose one block of code. When you need a decision for every element of a vector, the ifelse function makes the choice element by element.',
              points: [
                { term: 'Scalar if', detail: 'The if keyword expects a single condition and runs one branch or the other.' },
                { term: 'Vectorized ifelse', detail: 'The ifelse function tests each element and returns a matching value from the two choices.' },
                { term: 'Return values', detail: 'An if expression itself returns a value, so it can be assigned directly.' },
                { term: 'Missing handling', detail: 'A missing value in the ifelse condition produces a missing value in that position.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'r-cf-loops',
        title: 'Loops',
        level: 2,
        slug: 'loops',
        concepts: [
          {
            id: 'r-cf-for',
            code: 'for (i in 1:3) {\n  print(i * 10)\n}\n\nn <- 0\nwhile (n < 3) {\n  n <- n + 1\n}',
            note: 'A `for` loop iterates over the elements of a vector or list, while a `while` loop runs until its condition becomes FALSE. For simple transformations, prefer vectorized operations or the apply family over explicit loops.',
            explanation: {
              heading: 'Loops',
              intro: 'A for loop walks over the elements of a vector or list one at a time, while a while loop repeats until its condition turns false. In R these are often a last resort, since vectorized operations and the apply family are usually clearer and faster.',
              points: [
                { term: 'For over elements', detail: 'A for loop binds each element of a sequence to a variable in turn.' },
                { term: 'While on condition', detail: 'A while loop keeps running its body as long as the condition stays true.' },
                { term: 'Prefer vectorization', detail: 'For simple transformations a vectorized expression usually beats an explicit loop.' },
                { term: 'Preallocate', detail: 'If you must loop, size the output first, since growing a vector inside a loop is slow.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'r-fn-define',
        title: 'Defining Functions',
        level: 2,
        slug: 'define',
        concepts: [
          {
            id: 'r-fn-basic',
            code: 'greet <- function(name) {\n  paste("Hello,", name)\n}\ngreet("Alice")  # "Hello, Alice"',
            note: 'Functions are created with `function()` and assigned to a name like any other value. The last expression evaluated is returned automatically, so an explicit `return()` is optional.',
            explanation: {
              heading: 'Defining functions',
              intro: 'In R functions are first-class values created with the function keyword and stored in a name just like any other object. The value of the last expression in the body is returned automatically, so an explicit return call is optional.',
              points: [
                { term: 'First-class values', detail: 'A function can be assigned, passed as an argument, and returned from another function.' },
                { term: 'Implicit return', detail: 'The last expression evaluated becomes the return value without a return statement.' },
                { term: 'Optional return', detail: 'An explicit return is used mainly to exit early from the middle of a function.' },
                { term: 'Lexical scope', detail: 'A function sees variables from where it was defined, which enables closures.' },
              ],
            },
          },
          {
            id: 'r-fn-defaults',
            code: 'power <- function(x, exp = 2) {\n  x ^ exp\n}\npower(3)        # 9 (uses default)\npower(2, 3)     # 8',
            note: 'Parameters can have default values, making them optional at the call site. You may also pass arguments by name, which improves readability and lets you skip earlier optional arguments.',
            explanation: {
              heading: 'Default and named arguments',
              intro: 'Function parameters can carry default values, so callers may omit them and fall back on the default. Arguments can also be supplied by name, which improves readability and lets you skip over earlier optional ones.',
              points: [
                { term: 'Defaults', detail: 'A parameter written with an equals value uses that value whenever the caller leaves it out.' },
                { term: 'Named passing', detail: 'Supplying arguments by name makes calls self-documenting and order-independent.' },
                { term: 'Lazy defaults', detail: 'Because arguments are evaluated lazily, a default can even refer to other parameters.' },
                { term: 'Partial matching', detail: 'R can match a shortened argument name when it is unambiguous, though full names are clearer.' },
              ],
            },
          },
          {
            id: 'r-fn-lambda',
            code: 'sapply(1:3, function(x) x^2)  # 1 4 9\nsapply(1:3, \\(x) x^2)         # R 4.1+ shorthand',
            note: 'Anonymous functions are defined inline without a name, most often as arguments to apply-family functions. R 4.1 introduced the backslash `\\(x)` shorthand as a shorter way to write them.',
            explanation: {
              heading: 'Anonymous functions',
              intro: 'An anonymous function is defined right where it is used, without being assigned a name. They appear most often as the function argument to apply-family calls, and R 4.1 added a shorter backslash form.',
              points: [
                { term: 'Inline definition', detail: 'You write the whole function directly in the spot where it is needed.' },
                { term: 'Apply companion', detail: 'They pair naturally with the apply family to describe a one-off transformation.' },
                { term: 'Backslash shorthand', detail: 'From R 4.1 a backslash before the parameter list is a compact way to write a lambda.' },
                { term: 'No name needed', detail: 'Skipping a name keeps throwaway logic close to where it is applied.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 7. Apply Family
  {
    id: 'r-apply',
    title: 'Apply Family',
    level: 1,
    slug: 'apply',
    concepts: [],
    children: [
      {
        id: 'r-apply-lapply-sapply',
        title: 'lapply & sapply',
        level: 2,
        slug: 'lapply-sapply',
        concepts: [
          {
            id: 'r-apply-lapply',
            code: 'lapply(1:3, function(x) x * 2)   # returns a list\nsapply(1:3, function(x) x * 2)   # simplifies to vector: 2 4 6',
            note: '`lapply()` applies a function to each element and always returns a list. `sapply()` is a friendly wrapper that simplifies the result to a vector or matrix when possible.',
            explanation: {
              heading: 'lapply and sapply',
              intro: 'These functions apply a given function to every element of a vector or list without an explicit loop. The lapply function always returns a list, while sapply tries to simplify the result into a vector or matrix.',
              points: [
                { term: 'lapply returns list', detail: 'The lapply function keeps every result in a list, one entry per input element.' },
                { term: 'sapply simplifies', detail: 'The sapply function collapses the results to a vector or matrix when the shapes line up.' },
                { term: 'Functional style', detail: 'Both express iteration as applying a function, which reads clearly and avoids index bookkeeping.' },
                { term: 'Simplify caution', detail: 'Because sapply guesses the output shape, its type can vary with the data, which sometimes surprises callers.' },
              ],
            },
          },
          {
            id: 'r-apply-vapply',
            code: 'vapply(1:3, function(x) x^2, numeric(1))  # 1 4 9',
            note: '`vapply()` works like `sapply()` but requires you to declare the type and length of each result. This safety check prevents surprising output shapes in production code.',
            explanation: {
              heading: 'vapply for safety',
              intro: 'The vapply function behaves like sapply but asks you to state the type and length that each result must have. That declared template makes the output shape predictable, which is valuable in production code.',
              points: [
                { term: 'Declared template', detail: 'A template argument states the type and length expected from every call.' },
                { term: 'Fails loudly', detail: 'If a result does not match the template, vapply raises an error instead of guessing.' },
                { term: 'Stable output', detail: 'The declared shape guarantees a consistent result type across different inputs.' },
                { term: 'Safer than sapply', detail: 'The extra check trades a little verbosity for protection against surprising shapes.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'r-apply-apply-mapply',
        title: 'apply & mapply',
        level: 2,
        slug: 'apply-mapply',
        concepts: [
          {
            id: 'r-apply-matrix',
            code: 'm <- matrix(1:6, nrow = 2)\napply(m, 1, sum)   # row sums: margin 1\napply(m, 2, sum)   # column sums: margin 2',
            note: '`apply()` runs a function over the rows (margin 1) or columns (margin 2) of a matrix or array. It is the go-to tool for aggregating along a dimension.',
            explanation: {
              heading: 'apply over margins',
              intro: 'The apply function runs a function across one dimension of a matrix or array, chosen by a margin number. Margin one works over rows and margin two works over columns.',
              points: [
                { term: 'Margin one', detail: 'Passing one as the margin applies the function to each row.' },
                { term: 'Margin two', detail: 'Passing two as the margin applies the function to each column.' },
                { term: 'Any function', detail: 'The applied function can be a built-in like sum or any custom function.' },
                { term: 'Matrix focus', detail: 'Unlike lapply, apply is designed for the rows and columns of matrices and arrays.' },
              ],
            },
          },
          {
            id: 'r-apply-mapply',
            code: 'mapply(function(a, b) a + b, 1:3, 4:6)  # 5 7 9',
            note: '`mapply()` is the multivariate version of `sapply()`, applying a function to corresponding elements of several vectors in parallel. Use it when your function needs more than one input per call.',
            explanation: {
              heading: 'mapply for multiple inputs',
              intro: 'The mapply function is the multivariate cousin of sapply, walking through several vectors at the same time. On each step it takes one element from each vector and passes them together to the function.',
              points: [
                { term: 'Parallel inputs', detail: 'Corresponding elements from several vectors are combined on each call.' },
                { term: 'Multi-argument function', detail: 'Use it when the function needs more than one input per iteration.' },
                { term: 'Simplifies result', detail: 'Like sapply it tries to collapse the results into a vector or matrix.' },
                { term: 'Zips vectors', detail: 'It effectively zips the vectors together the way a paired loop would.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 8. The Pipe
  {
    id: 'r-pipe',
    title: 'The Pipe',
    level: 1,
    slug: 'pipe',
    concepts: [],
    children: [
      {
        id: 'r-pipe-native',
        title: 'Native Pipe',
        level: 2,
        slug: 'native',
        concepts: [
          {
            id: 'r-pipe-base',
            code: 'c(1, 2, 3, 4) |> sum()   # 10\nc(4, 1, 3) |> sort() |> rev()  # 4 3 1',
            note: 'The native pipe `|>`, added in R 4.1, passes the left-hand value as the first argument to the right-hand function. It chains operations left to right, mirroring how you read the steps.',
            explanation: {
              heading: 'The native pipe',
              intro: 'The native pipe, written as a bar followed by a greater than sign and added in R 4.1, feeds the value on its left into the function on its right as the first argument. Chaining pipes lets you read a data transformation as a left-to-right sequence of steps.',
              points: [
                { term: 'First argument', detail: 'The left-hand value is inserted as the first argument of the right-hand function call.' },
                { term: 'Reads in order', detail: 'Piped steps run left to right, matching the order you think about them.' },
                { term: 'Base R', detail: 'The native pipe is part of base R and needs no package.' },
                { term: 'Flat calls', detail: 'It replaces deeply nested calls with a flat, readable chain.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'r-pipe-magrittr',
        title: 'magrittr Pipe',
        level: 2,
        slug: 'magrittr',
        concepts: [
          {
            id: 'r-pipe-percent',
            code: 'library(dplyr)\nc(1, 2, 3) %>% sum()          # 6\nmtcars %>% head(2) %>% nrow() # 2',
            note: 'The `%>%` pipe from the magrittr package predates the native pipe and is used throughout the tidyverse. It supports a `.` placeholder for the value, giving it more flexibility than `|>`.',
            explanation: {
              heading: 'The magrittr pipe',
              intro: 'The magrittr pipe, written as percent greater-than percent, came before the native pipe and is used throughout the tidyverse. It also supports a dot placeholder, letting the piped value land in any argument position.',
              points: [
                { term: 'Tidyverse standard', detail: 'This pipe appears across dplyr and other tidyverse code and comes from the magrittr package.' },
                { term: 'Dot placeholder', detail: 'A dot marks where the piped value should go when it is not the first argument.' },
                { term: 'More flexible', detail: 'The placeholder makes it more flexible than the native pipe for awkward argument orders.' },
                { term: 'Needs a package', detail: 'Unlike the native pipe it requires loading magrittr or a package that re-exports it.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 9. Tidyverse
  {
    id: 'r-tidyverse',
    title: 'Tidyverse',
    level: 1,
    slug: 'tidyverse',
    concepts: [],
    children: [
      {
        id: 'r-dplyr-verbs',
        title: 'dplyr Core Verbs',
        level: 2,
        slug: 'dplyr-verbs',
        concepts: [
          {
            id: 'r-dplyr-filter-select',
            code: 'library(dplyr)\nmtcars %>%\n  filter(mpg > 20) %>%\n  select(mpg, cyl, hp)',
            note: 'dplyr provides a grammar of data manipulation. `filter()` keeps rows matching a condition, and `select()` keeps or drops columns by name. Chaining them with the pipe reads like a sentence.',
            explanation: {
              heading: 'dplyr filter and select',
              intro: 'The dplyr package offers a small set of verbs that read like a grammar for reshaping tables. The filter verb keeps rows that match a condition and the select verb keeps or drops columns by name.',
              points: [
                { term: 'Filter rows', detail: 'The filter verb keeps only the rows where its condition is true.' },
                { term: 'Select columns', detail: 'The select verb chooses columns by name or drops them with a leading minus.' },
                { term: 'Pipe chaining', detail: 'Joining verbs with the pipe reads like a sentence describing the transformation.' },
                { term: 'Bare column names', detail: 'Verbs refer to columns by unquoted name, a tidyverse convention called tidy evaluation.' },
              ],
            },
          },
          {
            id: 'r-dplyr-mutate',
            code: 'mtcars %>%\n  mutate(power_ratio = hp / wt) %>%\n  arrange(desc(power_ratio))',
            note: '`mutate()` adds or modifies columns using vectorized expressions over existing ones. Combine it with `arrange()` to sort rows, using `desc()` for descending order.',
            explanation: {
              heading: 'dplyr mutate and arrange',
              intro: 'The mutate verb creates or changes columns using vectorized expressions over the existing ones. The arrange verb reorders rows, and the desc helper flips a column to descending order.',
              points: [
                { term: 'Add columns', detail: 'The mutate verb defines new columns from expressions over current columns.' },
                { term: 'Vectorized', detail: 'Expressions inside mutate operate on whole columns at once rather than row by row.' },
                { term: 'Sort rows', detail: 'The arrange verb reorders rows by one or more columns.' },
                { term: 'Descending', detail: 'Wrapping a column in desc sorts it from high to low.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'r-dplyr-aggregate',
        title: 'Grouping & Summarising',
        level: 2,
        slug: 'aggregate',
        concepts: [
          {
            id: 'r-dplyr-group',
            code: 'mtcars %>%\n  group_by(cyl) %>%\n  summarise(\n    avg_mpg = mean(mpg),\n    n = n()\n  )',
            note: '`group_by()` splits the data into groups, and `summarise()` collapses each group to a single row of aggregate values. Together they replace manual split-apply-combine loops.',
            explanation: {
              heading: 'Grouping and summarising',
              intro: 'The group by verb tags a table so later operations run separately within each group. Paired with summarise, which collapses each group to one row of aggregate values, they replace hand-written split-apply-combine loops.',
              points: [
                { term: 'Group by keys', detail: 'The group by verb marks one or more columns as the grouping keys.' },
                { term: 'Summarise per group', detail: 'The summarise verb computes an aggregate such as a mean for each group, yielding one row each.' },
                { term: 'Count helper', detail: 'The n function inside summarise returns the number of rows in the current group.' },
                { term: 'Split apply combine', detail: 'Together these verbs express the classic pattern of splitting, aggregating, and recombining.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'r-tidyr-reshape',
        title: 'tidyr Reshaping',
        level: 2,
        slug: 'tidyr',
        concepts: [
          {
            id: 'r-tidyr-pivot-longer',
            code: 'library(tidyr)\nwide %>%\n  pivot_longer(\n    cols = c(q1, q2, q3),\n    names_to = "quarter",\n    values_to = "sales"\n  )',
            note: '`pivot_longer()` reshapes wide data into a long, tidy format where each row is one observation. This layout is what most tidyverse functions and ggplot2 expect.',
            explanation: {
              heading: 'Reshaping to long form',
              intro: 'The pivot longer function turns several wide columns into two columns, one holding the former column names and one holding their values. The resulting long, tidy shape puts each observation on its own row, which most tidyverse tools expect.',
              points: [
                { term: 'Wide to long', detail: 'Multiple value columns are stacked into a single name column and a single value column.' },
                { term: 'Names to', detail: 'The names to argument sets the name of the new column that holds the old column names.' },
                { term: 'Values to', detail: 'The values to argument sets the name of the new column that holds the gathered values.' },
                { term: 'Tidy data', detail: 'The long layout matches the tidy data ideal and feeds ggplot2 naturally.' },
              ],
            },
          },
          {
            id: 'r-tidyr-pivot-wider',
            code: 'long %>%\n  pivot_wider(\n    names_from = quarter,\n    values_from = sales\n  )',
            note: '`pivot_wider()` is the inverse of `pivot_longer()`, spreading one column of names across new columns. Use it to build summary tables or prepare data for display.',
            explanation: {
              heading: 'Reshaping to wide form',
              intro: 'The pivot wider function reverses pivot longer by spreading the values of one column across many new columns. It is handy for building compact summary tables meant for display.',
              points: [
                { term: 'Long to wide', detail: 'Distinct entries in one column become separate columns in the result.' },
                { term: 'Names from', detail: 'The names from argument names the column whose values become the new column headers.' },
                { term: 'Values from', detail: 'The values from argument names the column that fills the new cells.' },
                { term: 'Inverse of longer', detail: 'It undoes pivot longer, so the two functions convert freely between layouts.' },
              ],
            },
          },
          {
            id: 'r-tidyr-separate',
            code: 'df %>%\n  separate(full_name, into = c("first", "last"), sep = " ") %>%\n  drop_na()',
            note: '`separate()` splits one column into several based on a delimiter, while `unite()` does the reverse. Pair these with `drop_na()` to clean incomplete rows during reshaping.',
            explanation: {
              heading: 'Splitting and joining columns',
              intro: 'The separate function breaks one column into several new columns using a delimiter, and the unite function joins columns back together. During reshaping these pair well with drop na, which removes rows that contain missing values.',
              points: [
                { term: 'Separate splits', detail: 'The separate function divides a column into pieces at a chosen delimiter.' },
                { term: 'Unite joins', detail: 'The unite function combines several columns into one, inserting a separator.' },
                { term: 'Into argument', detail: 'The into argument names the new columns that separate should create.' },
                { term: 'Drop missing', detail: 'The drop na function removes rows that hold missing values to tidy the result.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 10. Data Import & Missing Values
  {
    id: 'r-io-missing',
    title: 'Data Import & Missing Values',
    level: 1,
    slug: 'io-missing',
    concepts: [],
    children: [
      {
        id: 'r-read-csv',
        title: 'Reading CSV Files',
        level: 2,
        slug: 'csv',
        concepts: [
          {
            id: 'r-read-csv-base',
            code: 'df <- read.csv("data.csv", stringsAsFactors = FALSE)\nhead(df)\nwrite.csv(df, "out.csv", row.names = FALSE)',
            note: '`read.csv()` loads a comma-separated file into a data frame, inferring column types. Set `stringsAsFactors = FALSE` on older R versions to keep text as character. Write back with `write.csv()`.',
            explanation: {
              heading: 'Reading CSV with base R',
              intro: 'The read csv function loads a comma-separated file into a data frame, guessing each column type as it goes. On older R versions you set the strings as factors argument to false to keep text columns as plain character.',
              points: [
                { term: 'Loads a data frame', detail: 'The read csv function returns the file contents as a data frame.' },
                { term: 'Type inference', detail: 'Column types are guessed from the values in each field.' },
                { term: 'Strings as factors', detail: 'Setting this argument to false keeps text as character rather than converting it to factors.' },
                { term: 'Write back', detail: 'The write csv function saves a data frame back out, usually with row names turned off.' },
              ],
            },
          },
          {
            id: 'r-read-readr',
            code: 'library(readr)\ndf <- read_csv("data.csv")   # faster, returns a tibble',
            note: 'The readr package offers `read_csv()`, which is faster, gives clearer type messages, and returns a tibble. It is the tidyverse standard for reading flat files.',
            explanation: {
              heading: 'Reading CSV with readr',
              intro: 'The readr package provides a read csv function that is faster than the base version and reports the column types it detected. It returns a tibble and is the tidyverse standard for reading flat files.',
              points: [
                { term: 'Faster parsing', detail: 'The readr reader is notably quicker on large files than the base function.' },
                { term: 'Type messages', detail: 'It prints a clear summary of the column types it inferred while reading.' },
                { term: 'Returns a tibble', detail: 'The result is a tibble, the tidyverse data frame with cleaner printing.' },
                { term: 'No factor surprise', detail: 'Text stays as character by default, avoiding the old factor conversion.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'r-na-detect',
        title: 'Detecting NA',
        level: 2,
        slug: 'na-detect',
        concepts: [
          {
            id: 'r-na-isna',
            code: 'x <- c(1, NA, 3, NA)\nis.na(x)          # FALSE TRUE FALSE TRUE\nsum(is.na(x))     # 2\nanyNA(x)          # TRUE',
            note: '`NA` represents a missing value in R. Never test with `x == NA`, since any comparison with `NA` yields `NA`. Use `is.na()` to detect missing values reliably.',
            explanation: {
              heading: 'Detecting missing values',
              intro: 'R uses the special value NA to mark data that is missing or unknown. Any comparison against NA returns NA rather than true or false, so you must use dedicated functions to test for it.',
              points: [
                { term: 'NA is contagious', detail: 'Most operations involving NA return NA, propagating the missingness outward.' },
                { term: 'No equality test', detail: 'Comparing a value to NA yields NA, so equality checks never work for detection.' },
                { term: 'is na function', detail: 'The is na function returns true wherever a value is missing.' },
                { term: 'anyNA shortcut', detail: 'The any NA function quickly reports whether a vector contains any missing values at all.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'r-na-handle',
        title: 'Handling NA',
        level: 2,
        slug: 'na-handle',
        concepts: [
          {
            id: 'r-na-narm',
            code: 'x <- c(1, NA, 3)\nmean(x)              # NA\nmean(x, na.rm = TRUE) # 2\nna.omit(x)           # drop NA values',
            note: 'Many summary functions return `NA` if any input is missing. Pass `na.rm = TRUE` to ignore missing values during the calculation, or use `na.omit()` to remove them from the data first.',
            explanation: {
              heading: 'Handling missing values',
              intro: 'Because missingness spreads, summary functions like mean return NA when any input is missing. You can pass the na remove argument to skip missing values during the calculation, or strip them from the data beforehand.',
              points: [
                { term: 'Default is NA', detail: 'Summaries such as mean and sum return NA if even one value is missing.' },
                { term: 'na remove argument', detail: 'Setting the na remove argument to true tells the function to ignore missing values.' },
                { term: 'na omit', detail: 'The na omit function drops missing entries from a vector or rows from a data frame.' },
                { term: 'Decide intent', detail: 'Choose between ignoring and removing based on whether the missing rows matter downstream.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 11. Strings & Dates
  {
    id: 'r-strings-dates',
    title: 'Strings & Dates',
    level: 1,
    slug: 'strings-dates',
    concepts: [],
    children: [
      {
        id: 'r-strings-base',
        title: 'Base String Functions',
        level: 2,
        slug: 'strings-base',
        concepts: [
          {
            id: 'r-strings-core',
            code: 'paste("Hello", "World")          # "Hello World"\npaste0("file", ".csv")           # "file.csv"\nnchar("hello")                   # 5\ntoupper("abc")                   # "ABC"',
            note: '`paste()` joins strings with a separator (space by default), while `paste0()` uses none. `nchar()` counts characters, and `toupper()`/`tolower()` change case. All are vectorized.',
            explanation: {
              heading: 'Base string functions',
              intro: 'Base R includes a handful of vectorized string helpers for joining, measuring, and changing case. They work element by element across whole character vectors, not just single strings.',
              points: [
                { term: 'Paste joins', detail: 'The paste function combines strings with a separator, using a space by default.' },
                { term: 'Paste zero', detail: 'The paste zero variant joins strings with no separator at all.' },
                { term: 'Count characters', detail: 'The n char function reports the number of characters in each string.' },
                { term: 'Change case', detail: 'The to upper and to lower functions convert text to a single case.' },
              ],
            },
          },
          {
            id: 'r-strings-sub',
            code: 'substr("hello", 1, 3)            # "hel"\nsub("a", "o", "banana")          # "bonana" (first only)\ngsub("a", "o", "banana")         # "bonono" (all)',
            note: 'Use `substr()` to extract by position, `sub()` to replace the first pattern match, and `gsub()` to replace every match. The `sub`/`gsub` functions accept regular expressions.',
            explanation: {
              heading: 'Extracting and replacing',
              intro: 'These base functions pull out or replace parts of strings. The substr function works by character position, while sub and gsub replace text that matches a pattern.',
              points: [
                { term: 'Substr by position', detail: 'The substr function returns the characters between a start and stop position.' },
                { term: 'Sub replaces first', detail: 'The sub function replaces only the first match of a pattern.' },
                { term: 'Gsub replaces all', detail: 'The gsub function replaces every match of a pattern in the string.' },
                { term: 'Regex aware', detail: 'Both sub and gsub interpret their pattern as a regular expression by default.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'r-strings-stringr',
        title: 'stringr Package',
        level: 2,
        slug: 'stringr',
        concepts: [
          {
            id: 'r-strings-stringr-fns',
            code: 'library(stringr)\nstr_detect("banana", "an")    # TRUE\nstr_replace_all("a-b-c", "-", "_")  # "a_b_c"\nstr_split("a,b,c", ",")       # list of parts',
            note: 'The stringr package provides consistent, well-named string functions that all start with `str_`. The argument order (string first, pattern second) makes them pipe-friendly.',
            explanation: {
              heading: 'The stringr package',
              intro: 'The stringr package offers a tidy set of string functions whose names all begin with str underscore. They take the string first and the pattern second, which makes them fit naturally into a pipe.',
              points: [
                { term: 'Consistent naming', detail: 'Every function shares the str underscore prefix, making them easy to discover.' },
                { term: 'String first', detail: 'The string is the first argument, so these functions chain cleanly after a pipe.' },
                { term: 'Detect and replace', detail: 'Functions like str detect and str replace all cover the common matching tasks.' },
                { term: 'Vectorized', detail: 'They operate over whole character vectors and handle missing values predictably.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'r-dates',
        title: 'Working with Dates',
        level: 2,
        slug: 'dates',
        concepts: [
          {
            id: 'r-dates-parse',
            code: 'd <- as.Date("2024-03-15")\nformat(d, "%d/%m/%Y")   # "15/03/2024"\nd + 30                  # add 30 days\nSys.Date()              # today',
            note: 'The `Date` class stores calendar dates as days since 1970-01-01. Parse strings with `as.Date()`, do arithmetic directly, and reformat output with `format()` using strftime codes.',
            explanation: {
              heading: 'Base R dates',
              intro: 'The Date class represents a calendar day as a count of days since the start of 1970. You parse text into a Date, do arithmetic on it directly, and format it back to text with pattern codes.',
              points: [
                { term: 'Days since epoch', detail: 'A Date is stored internally as the number of days since the first of January 1970.' },
                { term: 'Parse with as Date', detail: 'The as Date function turns a date string into a proper Date object.' },
                { term: 'Direct arithmetic', detail: 'Adding a number to a Date advances it by that many days.' },
                { term: 'Format codes', detail: 'The format function reshapes a Date into text using percent codes for day, month, and year.' },
              ],
            },
          },
          {
            id: 'r-dates-lubridate-fns',
            code: 'library(lubridate)\nd <- ymd("2024-03-15")\nmonth(d)    # 3\nwday(d, label = TRUE)  # Fri\nd %m+% months(1)       # add one month safely',
            note: 'The lubridate package makes dates easy with parsers like `ymd()` and extractors like `month()` and `wday()`. It handles month-length edge cases and time zones more gracefully than base R.',
            explanation: {
              heading: 'Dates with lubridate',
              intro: 'The lubridate package smooths over the rough edges of date handling in R. It offers memorable parsers named after the field order and clean extractor functions for components like month and weekday.',
              points: [
                { term: 'Order-named parsers', detail: 'A parser like ymd reads a string in year, month, day order without a format string.' },
                { term: 'Component extractors', detail: 'Functions such as month and wday pull individual parts out of a date.' },
                { term: 'Safe arithmetic', detail: 'Special operators add months while respecting different month lengths.' },
                { term: 'Time zones', detail: 'It handles time zones and daylight saving more gracefully than base R.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 12. Statistics & Plotting
  {
    id: 'r-stats-plots',
    title: 'Statistics & Plotting',
    level: 1,
    slug: 'stats-plots',
    concepts: [],
    children: [
      {
        id: 'r-stats-summary',
        title: 'Summary Statistics',
        level: 2,
        slug: 'summary-stats',
        concepts: [
          {
            id: 'r-stats-descriptive',
            code: 'x <- c(4, 8, 15, 16, 23, 42)\nmean(x)     # 18\nmedian(x)   # 15.5\nsd(x)       # standard deviation\nquantile(x) # 0% 25% 50% 75% 100%',
            note: 'R ships with a full set of descriptive statistics: `mean()`, `median()`, `sd()`, `var()`, and `quantile()`. Remember to pass `na.rm = TRUE` when your data may contain missing values.',
            explanation: {
              heading: 'Descriptive statistics',
              intro: 'R was built for statistics, so common summaries come built in and vectorized. Functions for the average, middle value, spread, and percentiles all take a vector and return a concise summary.',
              points: [
                { term: 'Center measures', detail: 'The mean and median functions describe the typical value of a vector.' },
                { term: 'Spread measures', detail: 'The sd and var functions report the standard deviation and variance.' },
                { term: 'Quantiles', detail: 'The quantile function returns cut points such as the quartiles of the data.' },
                { term: 'Missing values', detail: 'Passing the na remove argument as true keeps missing values from returning NA.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'r-stats-models',
        title: 'Linear Models',
        level: 2,
        slug: 'models',
        concepts: [
          {
            id: 'r-stats-lm',
            code: 'model <- lm(mpg ~ wt + hp, data = mtcars)\nsummary(model)      # coefficients, R-squared\npredict(model, mtcars[1:3, ])',
            note: '`lm()` fits a linear regression using formula syntax where `y ~ x` means "y explained by x". Call `summary()` for coefficients and fit statistics, and `predict()` to score new data.',
            explanation: {
              heading: 'Linear models',
              intro: 'The lm function fits a linear regression described by R formula interface, where the tilde reads as explained by. The fitted model object can then be summarized for its coefficients or used to predict new data.',
              points: [
                { term: 'Formula interface', detail: 'A formula with a tilde states which response is explained by which predictors.' },
                { term: 'Fit with lm', detail: 'The lm function estimates the regression and returns a model object.' },
                { term: 'Summary output', detail: 'Calling summary on the model shows coefficients, significance, and the R-squared fit.' },
                { term: 'Predict new data', detail: 'The predict function scores fresh observations using the fitted model.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'r-plot-base',
        title: 'Base Graphics',
        level: 2,
        slug: 'plot-base',
        concepts: [
          {
            id: 'r-plot-base-fns',
            code: 'plot(mtcars$wt, mtcars$mpg,\n     main = "Weight vs MPG",\n     xlab = "Weight", ylab = "MPG")\nhist(mtcars$mpg)\nabline(lm(mpg ~ wt, data = mtcars))',
            note: 'Base R graphics work by drawing on a canvas: `plot()` starts a scatter plot and functions like `abline()` add layers. `hist()` and `boxplot()` cover common one-variable charts.',
            explanation: {
              heading: 'Base graphics',
              intro: 'Base R plotting works like painting on a canvas, where one function opens a plot and others draw on top of it. The plot function starts a chart and helpers such as abline add lines or points afterward.',
              points: [
                { term: 'Canvas model', detail: 'A high-level call opens the plot and later calls add layers to the same canvas.' },
                { term: 'Plot starts it', detail: 'The plot function creates a scatter or line chart from x and y values.' },
                { term: 'Add layers', detail: 'Functions like abline draw a fitted line or reference onto the existing plot.' },
                { term: 'One-variable charts', detail: 'The hist and boxplot functions summarize the distribution of a single variable.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'r-plot-ggplot',
        title: 'ggplot2 Intro',
        level: 2,
        slug: 'ggplot2',
        concepts: [
          {
            id: 'r-plot-ggplot-basic',
            code: 'library(ggplot2)\nggplot(mtcars, aes(x = wt, y = mpg)) +\n  geom_point() +\n  geom_smooth(method = "lm") +\n  labs(title = "Weight vs MPG")',
            note: 'ggplot2 builds plots from a grammar of graphics: map data to aesthetics with `aes()`, then add geometry layers with `+`. This layered approach makes complex, publication-quality plots readable.',
            explanation: {
              heading: 'ggplot2 grammar of graphics',
              intro: 'The ggplot2 package builds charts from a grammar of graphics, where you map data columns to visual aesthetics and then stack geometry layers. Layers are combined with the plus sign, which keeps even complex plots readable.',
              points: [
                { term: 'Aesthetic mapping', detail: 'The aes function links data columns to visual channels such as x, y, and color.' },
                { term: 'Geometry layers', detail: 'Geom functions like geom point draw the data using a chosen shape.' },
                { term: 'Plus to add', detail: 'Layers, scales, and labels are combined with the plus sign into one plot.' },
                { term: 'Layered design', detail: 'The layered grammar makes it easy to build up polished, publication-quality figures.' },
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
