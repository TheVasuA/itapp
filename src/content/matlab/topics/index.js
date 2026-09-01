// MATLAB topic tree.
//
// Each node is a ConceptNode: { id, title, level, slug?, concepts[], children[] }.
// Routable nodes carry a `slug`. Every Concept renders in the fixed order
// code -> note -> example (example optional).

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  // 1. Basics & Command Window
  {
    id: 'matlab-basics',
    title: 'Basics & Command Window',
    level: 1,
    slug: 'basics',
    concepts: [],
    children: [
      {
        id: 'matlab-command-window',
        title: 'The Command Window',
        level: 2,
        slug: 'command-window',
        concepts: [
          {
            id: 'matlab-cw-intro',
            code: "2 + 3          % prints: ans = 5\nx = 10;        % semicolon suppresses output\ndisp(x)        % prints: 10",
            note: 'The Command Window evaluates expressions interactively and shows results immediately. Ending a statement with a semicolon suppresses the automatic display of its value. The special variable ans holds the last unassigned result.',
            explanation: {
              heading: 'Interactive evaluation',
              intro: 'The Command Window is a read eval print loop where each line you type is evaluated at once and its result shown. It is the fastest way to try ideas, inspect variables, and check syntax before committing code to a script.',
              points: [
                { term: 'Semicolon suppresses output', detail: 'Ending a statement with a semicolon computes the value but hides the automatic display, which keeps the window uncluttered.' },
                { term: 'The ans variable', detail: 'Any expression whose result is not assigned to a name is stored in the automatic variable named ans.' },
                { term: 'Everything is an array', detail: 'Even the number five is a one by one matrix, so results print with matrix formatting rules.' },
                { term: 'Immediate feedback', detail: 'Values persist in the workspace after evaluation, letting you build up a computation step by step.' },
              ],
            },
          },
          {
            id: 'matlab-cw-help',
            code: "help sin       % text help in the command window\ndoc plot       % opens full documentation\nlookfor mean   % searches help text for a keyword",
            note: 'MATLAB ships with excellent built-in documentation. Use help for a quick summary, doc for the full reference page, and lookfor to search when you only remember part of a name.',
            explanation: {
              heading: 'Built-in documentation',
              intro: 'MATLAB bundles thorough documentation reachable without leaving the environment. Knowing which command to use saves time when learning a new function or recalling its calling syntax.',
              points: [
                { term: 'help name', detail: 'Prints a concise text summary of a function directly in the Command Window.' },
                { term: 'doc name', detail: 'Opens the full reference page with examples and related links in the documentation browser.' },
                { term: 'lookfor keyword', detail: 'Searches the first help line of every function for a keyword when you only recall part of a name.' },
                { term: 'Discoverability', detail: 'These tools make the large standard library approachable without memorizing exact function names.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'matlab-comments-formatting',
        title: 'Comments & Formatting',
        level: 2,
        slug: 'comments-formatting',
        concepts: [
          {
            id: 'matlab-comments-intro',
            code: "% This is a single-line comment\nx = 5;  % inline comment after code\n\n%{\nThis is a\nblock comment\n%}",
            note: 'A percent sign begins a comment that runs to the end of the line. Block comments are wrapped in %{ and %} on their own lines. Clear comments make scripts easier to revisit and share.',
            explanation: {
              heading: 'Commenting code',
              intro: 'Comments document intent and are ignored during execution. MATLAB offers both single line and block styles so you can annotate a single expression or a whole passage of code.',
              points: [
                { term: 'Line comment', detail: 'A percent sign starts a comment that runs to the end of the current line, useful for inline notes.' },
                { term: 'Block comment', detail: 'Text between percent brace and brace percent on their own lines is skipped, ideal for disabling several lines.' },
                { term: 'Editor sections', detail: 'A double percent starts a code section that the editor can run independently for quick experiments.' },
                { term: 'Readable scripts', detail: 'Well placed comments explain the why behind code, making later revisits and sharing far easier.' },
              ],
            },
          },
          {
            id: 'matlab-line-continuation',
            code: "total = 1 + 2 + 3 + ...\n        4 + 5 + 6;",
            note: 'Three dots (...) continue a statement onto the next line. This keeps long expressions readable without changing how MATLAB evaluates them.',
            explanation: {
              heading: 'Continuing long lines',
              intro: 'The line continuation operator lets a single statement span several physical lines. It improves readability of long arithmetic, function calls, and array literals without altering how MATLAB parses them.',
              points: [
                { term: 'Three dots', detail: 'A trailing ellipsis tells MATLAB the statement continues on the following line.' },
                { term: 'No change in meaning', detail: 'The joined lines are evaluated exactly as if they were written on one line.' },
                { term: 'Aligned formatting', detail: 'Indenting the continued portion visually groups related terms for easier scanning.' },
                { term: 'Trailing comments', detail: 'Anything after the three dots on the same line is treated as a comment and ignored.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 2. Variables & Workspace
  {
    id: 'matlab-variables',
    title: 'Variables & Workspace',
    level: 1,
    slug: 'variables',
    concepts: [],
    children: [
      {
        id: 'matlab-variables-assign',
        title: 'Assigning Variables',
        level: 2,
        slug: 'assigning-variables',
        concepts: [
          {
            id: 'matlab-var-assign',
            code: "radius = 5;\narea = pi * radius^2;\nname = 'MATLAB';   % char array\nisReady = true;    % logical",
            note: 'Variables are created simply by assigning a value; there is no separate declaration. Names must start with a letter and are case-sensitive. MATLAB infers the type from the value, and everything is stored as an array under the hood.',
            explanation: {
              heading: 'Creating variables',
              intro: 'MATLAB variables spring into existence the moment you assign to them, with no separate declaration step. The type follows from the value, and internally every variable is an array even when it holds a single value.',
              points: [
                { term: 'No declarations', detail: 'Assigning a value with the equals sign both creates the variable and sets its contents.' },
                { term: 'Case sensitive names', detail: 'Names must begin with a letter and treat uppercase and lowercase letters as distinct.' },
                { term: 'Inferred type', detail: 'The class such as double, char, or logical is determined automatically from the assigned value.' },
                { term: 'Arrays everywhere', detail: 'A scalar is simply a one by one array, so the same operations apply uniformly at any size.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'matlab-workspace',
        title: 'Managing the Workspace',
        level: 2,
        slug: 'workspace',
        concepts: [
          {
            id: 'matlab-workspace-intro',
            code: "who            % list variable names\nwhos           % list names, size, class, bytes\nclear x        % remove variable x\nclearvars      % remove all variables\nclc            % clear the command window text",
            note: 'The workspace holds every variable currently in memory. Use who and whos to inspect it, clear to free specific variables, and clc to tidy the display. Clearing the workspace between experiments avoids stale values causing confusing results.',
            explanation: {
              heading: 'Inspecting the workspace',
              intro: 'The workspace is the collection of variables currently held in memory. Inspecting and cleaning it keeps experiments reproducible and prevents leftover values from silently affecting later results.',
              points: [
                { term: 'who and whos', detail: 'The who command lists variable names while whos adds size, class, and memory usage for each.' },
                { term: 'clear', detail: 'Removing named variables or all variables frees memory and avoids stale state between runs.' },
                { term: 'clc', detail: 'Clearing the Command Window text tidies the display without touching any variables.' },
                { term: 'Reproducibility', detail: 'Starting from a clean workspace ensures a script depends only on its own inputs.' },
              ],
            },
          },
          {
            id: 'matlab-workspace-save',
            code: "save results.mat x y   % save selected variables\nsave session.mat      % save everything\nload results.mat       % restore variables",
            note: 'MAT-files store workspace variables in MATLAB\'s native binary format. save writes them to disk and load brings them back, which is handy for pausing and resuming long analyses.',
            explanation: {
              heading: 'Saving and loading state',
              intro: 'MAT files are the native binary format for storing workspace variables on disk. They let you pause a long analysis, share intermediate data, or restore an exact set of variables in a later session.',
              points: [
                { term: 'save', detail: 'Writes chosen variables, or the whole workspace when none are named, to a mat file.' },
                { term: 'load', detail: 'Reads variables back from a mat file into the current workspace, recreating them by name.' },
                { term: 'Selective storage', detail: 'Listing specific variable names keeps the file small and focused on what matters.' },
                { term: 'Reproducible sessions', detail: 'Restoring saved data avoids rerunning expensive computations when you resume work.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 3. Matrices & Vectors
  {
    id: 'matlab-matrices',
    title: 'Matrices & Vectors',
    level: 1,
    slug: 'matrices',
    concepts: [],
    children: [
      {
        id: 'matlab-creating-arrays',
        title: 'Creating Matrices & Vectors',
        level: 2,
        slug: 'creating-arrays',
        concepts: [
          {
            id: 'matlab-create-intro',
            code: "row = [1 2 3 4];        % row vector (spaces or commas)\ncol = [1; 2; 3];        % column vector (semicolons)\nA = [1 2 3; 4 5 6];     % 2x3 matrix",
            note: 'Square brackets build arrays. Spaces or commas separate elements within a row, and semicolons start a new row. MATLAB is built around matrices, so even a single number is a 1x1 matrix.',
            explanation: {
              heading: 'Building arrays by hand',
              intro: 'Square brackets are the literal syntax for constructing matrices and vectors. Because MATLAB is matrix centered, mastering this notation is the foundation for nearly every other operation.',
              points: [
                { term: 'Row separators', detail: 'Spaces or commas between values place them side by side in the same row.' },
                { term: 'Row breaks', detail: 'A semicolon inside the brackets ends the current row and begins the next one.' },
                { term: 'Rectangular shape', detail: 'Every row must contain the same number of elements or MATLAB reports a dimension error.' },
                { term: 'Scalars are matrices', detail: 'A lone number is a one by one matrix, so array rules apply uniformly at any size.' },
              ],
            },
          },
          {
            id: 'matlab-builtin-arrays',
            code: "z = zeros(3);        % 3x3 of zeros\no = ones(2, 4);      % 2x4 of ones\ni = eye(3);          % 3x3 identity matrix\nr = rand(2, 2);      % uniform random values",
            note: 'Built-in constructors create common arrays quickly. zeros, ones, and rand accept either one size (square) or explicit row and column counts, while eye builds an identity matrix.',
            explanation: {
              heading: 'Constructor functions',
              intro: 'Rather than typing out repetitive literals, MATLAB provides constructors that generate common arrays of any size. These are also the standard way to preallocate storage before filling an array.',
              points: [
                { term: 'zeros and ones', detail: 'Create arrays filled entirely with zero or one at a size you specify.' },
                { term: 'Size arguments', detail: 'Passing one number gives a square result while two numbers set explicit row and column counts.' },
                { term: 'eye', detail: 'Builds an identity matrix with ones on the main diagonal and zeros elsewhere.' },
                { term: 'rand', detail: 'Fills an array with uniformly distributed random values, useful for tests and simulations.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'matlab-array-size',
        title: 'Size & Shape',
        level: 2,
        slug: 'size-shape',
        concepts: [
          {
            id: 'matlab-size-intro',
            code: "A = [1 2 3; 4 5 6];\nsize(A)        % [2 3]\nnumel(A)       % 6 total elements\nlength(A)      % 3 (largest dimension)\nreshape(A, 3, 2)",
            note: 'size returns the number of rows and columns, numel gives the total element count, and length returns the largest dimension. reshape rearranges the same data into a new shape as long as the element count matches.',
            explanation: {
              heading: 'Querying and reshaping',
              intro: 'Understanding an array shape is essential before operating on it, since many errors come from mismatched dimensions. These functions report the size and let you rearrange data without copying values.',
              points: [
                { term: 'size', detail: 'Returns the count of rows and columns, and can report a single dimension when asked.' },
                { term: 'numel', detail: 'Gives the total number of elements regardless of how they are arranged.' },
                { term: 'length', detail: 'Returns the largest dimension, which for a vector is simply its element count.' },
                { term: 'reshape', detail: 'Reorders the same elements into a new shape as long as the total element count is unchanged.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'matlab-concatenation',
        title: 'Concatenation',
        level: 2,
        slug: 'concatenation',
        concepts: [
          {
            id: 'matlab-concat-intro',
            code: "a = [1 2 3];\nb = [4 5 6];\nhorz = [a b];        % horizontal: 1x6\nvert = [a; b];       % vertical: 2x3\nc = cat(1, a, b);    % same as vertical",
            note: 'Arrays are joined by placing them inside brackets, using spaces for horizontal and semicolons for vertical concatenation. Dimensions must line up along the joining edge. The cat function does the same with an explicit dimension argument.',
            explanation: {
              heading: 'Joining arrays',
              intro: 'Concatenation combines smaller arrays into a larger one along a chosen direction. The bracket syntax reuses the same rules as building literals, so joining feels natural once you know array construction.',
              points: [
                { term: 'Horizontal join', detail: 'Placing arrays with a space or comma between them stacks columns side by side.' },
                { term: 'Vertical join', detail: 'Using a semicolon between arrays stacks them one on top of another.' },
                { term: 'Matching edges', detail: 'The shared dimension must agree, so vertical joins need equal column counts.' },
                { term: 'cat function', detail: 'The cat function joins along an explicit dimension number and extends naturally to higher dimensions.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 4. Matrix & Element-wise Operations
  {
    id: 'matlab-operations',
    title: 'Matrix & Element-wise Operations',
    level: 1,
    slug: 'operations',
    concepts: [],
    children: [
      {
        id: 'matlab-matrix-arithmetic',
        title: 'Matrix Arithmetic',
        level: 2,
        slug: 'matrix-arithmetic',
        concepts: [
          {
            id: 'matlab-matmul-intro',
            code: "A = [1 2; 3 4];\nB = [5 6; 7 8];\nC = A * B;      % matrix multiplication\nD = A + B;      % element-wise addition\nE = A^2;        % A * A",
            note: 'The * operator performs true matrix multiplication, so inner dimensions must agree. Addition and subtraction work element by element on same-sized matrices. The ^ operator raises a square matrix to a power via repeated matrix multiplication.',
            explanation: {
              heading: 'Matrix arithmetic',
              intro: 'The plain arithmetic operators follow linear algebra conventions in MATLAB. Knowing when an operator acts on the whole matrix versus element by element prevents a large class of subtle bugs.',
              points: [
                { term: 'Matrix multiply', detail: 'The star operator performs true matrix multiplication, so inner dimensions must agree.' },
                { term: 'Addition and subtraction', detail: 'The plus and minus operators combine equally sized matrices entry by entry.' },
                { term: 'Matrix power', detail: 'The caret operator raises a square matrix to a power by repeated matrix multiplication.' },
                { term: 'Dimension checks', detail: 'Mismatched sizes raise an error, a helpful signal that the intended operation was element-wise.' },
              ],
            },
          },
          {
            id: 'matlab-transpose',
            code: "v = [1 2 3];\nvt = v';        % transpose to a column\nA = [1 2; 3 4];\nAt = A';        % swap rows and columns",
            note: 'The apostrophe transposes an array, turning rows into columns. For complex arrays it computes the conjugate transpose; use .\' when you want a plain transpose without conjugation.',
            explanation: {
              heading: 'Transposing arrays',
              intro: 'Transposing swaps the rows and columns of an array, which is common when aligning data for matrix operations. MATLAB distinguishes between a conjugate transpose and a plain transpose for complex data.',
              points: [
                { term: 'Apostrophe', detail: 'The single apostrophe flips rows into columns and columns into rows.' },
                { term: 'Conjugate transpose', detail: 'For complex arrays the apostrophe also conjugates each entry, which matters in linear algebra.' },
                { term: 'Dot apostrophe', detail: 'The dot apostrophe form transposes without conjugation when you want the raw rearrangement.' },
                { term: 'Vector reshaping', detail: 'Transposing a row vector produces a column vector, a frequent need before matrix multiplication.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'matlab-dot-operators',
        title: 'Element-wise Dot Operators',
        level: 2,
        slug: 'dot-operators',
        concepts: [
          {
            id: 'matlab-dot-intro',
            code: "A = [1 2; 3 4];\nB = [5 6; 7 8];\nA .* B     % element-wise multiply: [5 12; 21 32]\nA ./ B     % element-wise divide\nA .^ 2     % square each element: [1 4; 9 16]",
            note: 'Prefixing an operator with a dot makes it act element by element. So A .* B multiplies matching entries, while A * B does matrix multiplication. This distinction is one of the most important things to master in MATLAB.',
            explanation: {
              heading: 'Element-wise operators',
              intro: 'Adding a dot in front of an operator switches it from a matrix operation to one that works on each pair of matching entries. This distinction is central to writing correct and fast MATLAB code.',
              points: [
                { term: 'Dot star', detail: 'Multiplies corresponding entries of two same sized arrays rather than doing matrix multiplication.' },
                { term: 'Dot slash', detail: 'Divides matching entries, producing a result the same size as the inputs.' },
                { term: 'Dot caret', detail: 'Raises each entry to a power individually instead of computing a matrix power.' },
                { term: 'Common bug', detail: 'Forgetting the dot invokes a matrix operation and often triggers a dimension error or wrong result.' },
              ],
            },
            example: "prices = [10 20 30];\nqty    = [2 1 5];\nrevenue = prices .* qty;   % [20 20 150]",
          },
          {
            id: 'matlab-broadcasting',
            code: "A = [1 2 3; 4 5 6];\ncol = [10; 20];\nA + col        % col added to each column\nA .* 2         % scalar expands automatically",
            note: 'MATLAB uses implicit expansion (broadcasting) so a scalar or a compatible vector automatically stretches to match a larger array. A column vector combines with each column, and a row vector with each row, avoiding manual replication.',
            explanation: {
              heading: 'Implicit expansion',
              intro: 'Implicit expansion, also called broadcasting, lets arrays of compatible but different shapes combine without manually replicating data. It makes many computations concise and memory efficient.',
              points: [
                { term: 'Scalar expansion', detail: 'A single value automatically applies to every element of the other array.' },
                { term: 'Column vector', detail: 'A column vector combines with each column of a matrix, expanding across the rows.' },
                { term: 'Row vector', detail: 'A row vector combines with each row of a matrix, expanding across the columns.' },
                { term: 'Avoids repmat', detail: 'Expansion happens automatically so you rarely need to replicate arrays by hand.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 5. Indexing, Slicing & the Colon Operator
  {
    id: 'matlab-indexing',
    title: 'Indexing, Slicing & the Colon',
    level: 1,
    slug: 'indexing',
    concepts: [],
    children: [
      {
        id: 'matlab-basic-indexing',
        title: 'Basic Indexing',
        level: 2,
        slug: 'basic-indexing',
        concepts: [
          {
            id: 'matlab-index-intro',
            code: "v = [10 20 30 40 50];\nv(1)        % 10 (1-based indexing)\nv(end)      % 50 (last element)\nv(end-1)    % 40\nA = [1 2; 3 4];\nA(2, 1)     % 3 (row 2, column 1)",
            note: 'MATLAB indices start at 1, not 0. The keyword end refers to the last position along a dimension, so v(end) is always the final element. Matrices are indexed with (row, column).',
            explanation: {
              heading: 'One-based indexing',
              intro: 'MATLAB numbers array positions starting from one, which differs from many other languages. Indexing uses parentheses and follows a row then column convention for matrices.',
              points: [
                { term: 'Starts at one', detail: 'The first element is at position one, not zero, a common source of mistakes for newcomers.' },
                { term: 'The end keyword', detail: 'Inside an index, end refers to the last valid position along that dimension.' },
                { term: 'Arithmetic on end', detail: 'Expressions like end minus one select positions relative to the final element.' },
                { term: 'Row then column', detail: 'A matrix element is addressed as parenthesis row comma column, in that order.' },
              ],
            },
          },
          {
            id: 'matlab-linear-index',
            code: "A = [1 2 3; 4 5 6];\nA(4)        % 5 — column-major linear index\nA(:)        % all elements as a column",
            note: 'A single index into a matrix walks the elements in column-major order, going down each column before moving to the next. The colon by itself, A(:), flattens the whole array into one column vector.',
            explanation: {
              heading: 'Linear indexing',
              intro: 'A matrix can be addressed with a single index that treats its elements as one long sequence. MATLAB stores data in column-major order, which determines how that sequence is traversed.',
              points: [
                { term: 'Column-major order', detail: 'A single index walks down each column completely before moving to the next column.' },
                { term: 'Colon flatten', detail: 'Writing A of colon returns every element as a single column vector.' },
                { term: 'Storage layout', detail: 'Column-major storage means operations along columns are typically more cache friendly.' },
                { term: 'sub2ind and ind2sub', detail: 'Helper functions convert between row column subscripts and linear indices when needed.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'matlab-slicing-assign',
        title: 'Slicing & Assignment',
        level: 2,
        slug: 'slicing-assignment',
        concepts: [
          {
            id: 'matlab-slice-intro',
            code: "A = magic(4);\nA(1, :)         % entire first row\nA(:, 2)         % entire second column\nA(2:3, 1:2)     % a 2x2 sub-block\nA(1, :) = 0;    % overwrite the first row",
            note: 'A colon selects every element along a dimension, so A(1, :) is the whole first row. Ranges pick sub-blocks, and you can assign into a slice to update many elements at once. Growing an array by assigning past its end is also allowed.',
            explanation: {
              heading: 'Slicing and assignment',
              intro: 'Slicing selects rectangular portions of an array using colons and ranges, and the same syntax works on the left of an assignment to update many elements together. This is far cleaner than looping over positions.',
              points: [
                { term: 'Whole dimension', detail: 'A bare colon selects every element along that dimension, giving a full row or column.' },
                { term: 'Range slices', detail: 'A start to stop range picks a contiguous sub block of the array.' },
                { term: 'Slice assignment', detail: 'Assigning to a slice overwrites all selected elements in a single statement.' },
                { term: 'Growing arrays', detail: 'Assigning past the current bounds automatically enlarges the array, padding with zeros as needed.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'matlab-colon',
        title: 'The Colon Operator',
        level: 2,
        slug: 'colon-operator',
        concepts: [
          {
            id: 'matlab-colon-intro',
            code: "1:5           % [1 2 3 4 5]\n0:2:10        % [0 2 4 6 8 10] with step 2\n10:-1:1       % counts down from 10 to 1\n0:0.25:1      % [0 0.25 0.5 0.75 1]",
            note: 'The colon operator generates evenly spaced vectors. The form start:end steps by one, while start:step:end uses a custom increment that may be negative or fractional. These ranges drive loops, sampling, and slicing throughout MATLAB.',
            explanation: {
              heading: 'The colon operator',
              intro: 'The colon operator produces a vector of evenly spaced values and is one of the most used pieces of MATLAB syntax. It powers loops, sampling grids, and slice selections everywhere in the language.',
              points: [
                { term: 'Default step', detail: 'The form start colon stop increases by one between the two endpoints.' },
                { term: 'Custom step', detail: 'The form start colon step colon stop lets you choose the increment between values.' },
                { term: 'Negative or fractional', detail: 'Steps may count downward or use fractional increments for fine grids.' },
                { term: 'Drives slicing', detail: 'The same ranges select sub blocks of arrays and control for loop iterations.' },
              ],
            },
          },
          {
            id: 'matlab-linspace',
            code: "linspace(0, 1, 5)     % [0 0.25 0.5 0.75 1]\nlinspace(0, 2*pi, 100)  % 100 points for a smooth plot",
            note: 'linspace generates a fixed number of evenly spaced points between two endpoints, both inclusive. It is often clearer than the colon operator when you care about the count of samples rather than the step size.',
            explanation: {
              heading: 'Fixed count sampling',
              intro: 'The linspace function creates a vector with an exact number of evenly spaced points spanning two endpoints. It is preferred when the number of samples matters more than the spacing between them.',
              points: [
                { term: 'Inclusive endpoints', detail: 'Both the start and stop values are included in the generated vector.' },
                { term: 'Sample count', detail: 'The third argument sets exactly how many points are produced.' },
                { term: 'Clearer intent', detail: 'It avoids fiddly step arithmetic when you know the desired number of samples.' },
                { term: 'Plotting grids', detail: 'It is ideal for generating smooth x values to evaluate and plot a function.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 6. Control Flow & Loops
  {
    id: 'matlab-control-flow',
    title: 'Control Flow & Loops',
    level: 1,
    slug: 'control-flow',
    concepts: [],
    children: [
      {
        id: 'matlab-if-else',
        title: 'If / ElseIf / Else & Switch',
        level: 2,
        slug: 'conditionals',
        concepts: [
          {
            id: 'matlab-if-intro',
            code: "score = 82;\nif score >= 90\n    grade = 'A';\nelseif score >= 80\n    grade = 'B';\nelse\n    grade = 'C';\nend",
            note: 'Conditional blocks start with if and close with end. Use elseif for additional branches and else for the fallback. Conditions are true when they evaluate to a nonzero (or logical true) value.',
            explanation: {
              heading: 'Conditional branching',
              intro: 'The if construct runs a block of code only when a condition holds, with optional branches for other cases. MATLAB uses explicit end keywords rather than braces to close each block.',
              points: [
                { term: 'if and end', detail: 'Every conditional opens with if and closes with a matching end keyword.' },
                { term: 'elseif', detail: 'Additional elseif branches test further conditions in order until one matches.' },
                { term: 'else', detail: 'An optional else block runs when none of the earlier conditions are true.' },
                { term: 'Truthiness', detail: 'A condition counts as true when it evaluates to a nonzero or logical true value.' },
              ],
            },
          },
          {
            id: 'matlab-switch-intro',
            code: "color = 'red';\nswitch color\n    case 'red'\n        code = '#FF0000';\n    case {'green', 'lime'}\n        code = '#00FF00';\n    otherwise\n        code = '#000000';\nend",
            note: 'switch compares one expression against several case values and runs the first match. A case can list several options inside curly braces, and otherwise handles anything unmatched. Unlike C, MATLAB cases do not fall through.',
            explanation: {
              heading: 'Switch statements',
              intro: 'A switch compares one expression against a series of candidate values and runs the matching branch. It reads more cleanly than a long chain of conditionals when testing a single value.',
              points: [
                { term: 'First match wins', detail: 'The case whose value equals the expression runs, and the rest are skipped.' },
                { term: 'Grouped cases', detail: 'A case can list several values in curly braces to share one branch.' },
                { term: 'otherwise', detail: 'The otherwise branch handles any value that matches none of the listed cases.' },
                { term: 'No fall through', detail: 'Unlike C, MATLAB does not continue into the next case, so no break is needed.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'matlab-loops',
        title: 'For & While Loops',
        level: 2,
        slug: 'loops',
        concepts: [
          {
            id: 'matlab-for-intro',
            code: "total = 0;\nfor i = 1:5\n    total = total + i;\nend\n% total is 15\n\nfor c = ['a' 'b' 'c']\n    disp(c)\nend",
            note: 'A for loop iterates over the columns of an array, most commonly a range produced by the colon operator. The loop variable takes each value in turn. Loops close with end, just like conditionals.',
            explanation: {
              heading: 'For loops',
              intro: 'A for loop repeats a block once for each column of the array it iterates over, most often a colon range. The loop variable receives each column in turn, which for a range means each successive value.',
              points: [
                { term: 'Column iteration', detail: 'The loop variable takes each column of the supplied array on successive passes.' },
                { term: 'Range driven', detail: 'A colon range is the most common source of loop values, counting from start to stop.' },
                { term: 'Closes with end', detail: 'The loop body ends at a matching end keyword just like a conditional.' },
                { term: 'Prefer vectorization', detail: 'Many loops can be replaced by whole array operations that run faster and read better.' },
              ],
            },
          },
          {
            id: 'matlab-while-intro',
            code: "n = 1;\nwhile n < 100\n    n = n * 2;\nend\n% n is 128\n\nfor k = 1:10\n    if mod(k, 2) == 0, continue; end\n    if k > 7, break; end\nend",
            note: 'A while loop repeats as long as its condition stays true. Use break to exit a loop early and continue to skip to the next iteration. Always make sure the condition eventually becomes false to avoid infinite loops.',
            explanation: {
              heading: 'While loops and control',
              intro: 'A while loop keeps running its body as long as a condition remains true, which suits situations where the iteration count is not known in advance. Loop control keywords let you alter the normal flow.',
              points: [
                { term: 'Condition check', detail: 'The condition is tested before each pass and the loop stops once it becomes false.' },
                { term: 'break', detail: 'The break keyword exits the enclosing loop immediately, skipping any remaining iterations.' },
                { term: 'continue', detail: 'The continue keyword skips the rest of the current pass and moves to the next iteration.' },
                { term: 'Avoid infinite loops', detail: 'Ensure the body eventually makes the condition false to prevent an endless loop.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'matlab-vectorization',
        title: 'Prefer Vectorization',
        level: 2,
        slug: 'vectorization',
        concepts: [
          {
            id: 'matlab-vectorize-intro',
            code: "% Loop version (slower)\nx = 1:1000;\ny = zeros(1, 1000);\nfor i = 1:1000\n    y(i) = x(i)^2;\nend\n\n% Vectorized version (faster, clearer)\ny = x.^2;",
            note: 'MATLAB is optimized for whole-array operations, so replacing loops with vectorized expressions is usually faster and more readable. Element-wise operators like .^ and .* let you transform entire arrays at once. Reach for vectorization before writing an explicit loop.',
            explanation: {
              heading: 'Vectorization',
              intro: 'Vectorization means expressing a computation as an operation on whole arrays instead of looping over individual elements. MATLAB runs these array operations in optimized internal code, so they are both faster and clearer.',
              points: [
                { term: 'Whole array math', detail: 'Element-wise operators apply a transform to every entry in one expression.' },
                { term: 'Speed', detail: 'Built in array operations avoid the overhead of interpreting a loop for each element.' },
                { term: 'Readability', detail: 'A vectorized line often mirrors the mathematical formula it implements.' },
                { term: 'Loop last resort', detail: 'Reach for an explicit loop only when a computation cannot be expressed on whole arrays.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 7. Functions & Scripts
  {
    id: 'matlab-functions',
    title: 'Functions & Scripts',
    level: 1,
    slug: 'functions',
    concepts: [],
    children: [
      {
        id: 'matlab-scripts',
        title: 'Scripts',
        level: 2,
        slug: 'scripts',
        concepts: [
          {
            id: 'matlab-script-intro',
            code: "% saved as analyze.m — run by typing: analyze\ndata = [4 8 15 16 23 42];\nm = mean(data);\ns = std(data);\nfprintf('Mean = %.2f, Std = %.2f\\n', m, s);",
            note: 'A script is a plain .m file containing a sequence of commands that run in the base workspace. Scripts are ideal for driving an analysis or automating repetitive steps. Run one by typing its file name (without the .m extension).',
            explanation: {
              heading: 'Scripts',
              intro: 'A script is an m file that runs a saved sequence of commands as if you had typed them in the Command Window. Scripts share the base workspace, which makes them handy for driving an analysis you refine over time.',
              points: [
                { term: 'Plain command list', detail: 'A script stores ordinary statements that execute top to bottom when run.' },
                { term: 'Base workspace', detail: 'Scripts read and write the same variables that live in the base workspace.' },
                { term: 'Run by name', detail: 'Typing the file name without the m extension runs the script.' },
                { term: 'Automation', detail: 'They capture repetitive steps so an analysis can be rerun reliably.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'matlab-function-def',
        title: 'Defining Functions',
        level: 2,
        slug: 'defining-functions',
        concepts: [
          {
            id: 'matlab-function-intro',
            code: "function area = circleArea(radius)\n    area = pi * radius^2;\nend\n\n% multiple outputs\nfunction [mn, mx] = bounds2(v)\n    mn = min(v);\n    mx = max(v);\nend",
            note: 'A function starts with the function keyword and names its outputs, its name, and its inputs. Outputs are returned by assigning to the declared output variables. Functions can return several values inside square brackets, and they run in their own private workspace.',
            explanation: {
              heading: 'Defining functions',
              intro: 'A function packages reusable logic with named inputs and outputs and runs in its own private workspace. Unlike scripts, functions do not touch the caller variables except through their declared arguments.',
              points: [
                { term: 'function header', detail: 'The header names the outputs, the function name, and the input parameters.' },
                { term: 'Return by assignment', detail: 'Outputs are produced by assigning values to the declared output variable names.' },
                { term: 'Multiple outputs', detail: 'Listing several names in square brackets lets a function return more than one value.' },
                { term: 'Private workspace', detail: 'Local variables are isolated, so functions avoid side effects on the caller state.' },
              ],
            },
            example: "a = circleArea(2);          % 12.566...\n[lo, hi] = bounds2([3 1 4 1 5]);  % lo=1, hi=5",
          },
        ],
        children: [],
      },
      {
        id: 'matlab-anonymous',
        title: 'Anonymous Functions',
        level: 2,
        slug: 'anonymous-functions',
        concepts: [
          {
            id: 'matlab-anon-intro',
            code: "square = @(x) x.^2;\nsquare(5)          % 25\n\nadd = @(a, b) a + b;\nadd(3, 4)          % 7\n\nfh = @sin;         % handle to a named function\nfh(pi/2)           % 1",
            note: 'An anonymous function is defined inline with @(args) expression and stored in a variable. The @ symbol also creates a handle to an existing named function. Handles let you pass functions as arguments to other functions.',
            explanation: {
              heading: 'Anonymous functions',
              intro: 'An anonymous function is a short unnamed function written inline and stored in a variable as a function handle. Handles turn functions into values you can pass around, which enables flexible, composable code.',
              points: [
                { term: 'Inline syntax', detail: 'The at sign followed by parenthesized arguments and an expression defines the function.' },
                { term: 'Function handle', detail: 'The at sign before a name creates a handle to an existing named function.' },
                { term: 'Passable values', detail: 'Handles can be stored, passed to other functions, and called later.' },
                { term: 'Single expression', detail: 'An anonymous function body is limited to one expression rather than many statements.' },
              ],
            },
          },
          {
            id: 'matlab-anon-capture',
            code: "gain = 3;\nscale = @(x) gain * x;   % captures the current value of gain\nscale(10)                % 30\n\narrayfun(@(x) x^2, [1 2 3])   % [1 4 9]",
            note: 'Anonymous functions capture the values of workspace variables at the moment they are created, freezing them inside the handle. Helpers like arrayfun and cellfun apply a function handle across an array or cell array without writing a loop.',
            explanation: {
              heading: 'Capturing and applying handles',
              intro: 'When an anonymous function is created it snapshots the current values of any workspace variables it uses. Combined with functions that apply a handle over a collection, this enables concise loop free processing.',
              points: [
                { term: 'Value capture', detail: 'Referenced variables are frozen at the moment the handle is created, not when it is called.' },
                { term: 'arrayfun', detail: 'Applies a handle to each element of a numeric array and gathers the results.' },
                { term: 'cellfun', detail: 'Applies a handle to each cell of a cell array, useful for mixed data.' },
                { term: 'No manual loop', detail: 'These helpers express per element work without writing an explicit for loop.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 8. Cell Arrays & Structs
  {
    id: 'matlab-containers',
    title: 'Cell Arrays & Structs',
    level: 1,
    slug: 'containers',
    concepts: [],
    children: [
      {
        id: 'matlab-cell-arrays',
        title: 'Cell Arrays',
        level: 2,
        slug: 'cell-arrays',
        concepts: [
          {
            id: 'matlab-cell-intro',
            code: "c = {'apple', 42, [1 2 3]};\nc{1}          % 'apple' — content indexing\nc(1)          % {'apple'} — a 1x1 cell\nc{3}(2)       % 2 — index inside the stored array",
            note: 'Cell arrays hold values of different types and sizes in each cell, using curly braces. Use curly braces c{i} to pull out the stored content, and parentheses c(i) to get a sub cell array. They are perfect for lists of strings or mixed data.',
            explanation: {
              heading: 'Cell arrays',
              intro: 'A cell array is a container whose cells can each hold a different type and size of data. This flexibility makes it the natural choice for lists of text or heterogeneous collections that a plain matrix cannot store.',
              points: [
                { term: 'Curly brace literals', detail: 'Curly braces build a cell array where each cell can hold any kind of value.' },
                { term: 'Content indexing', detail: 'Curly brace indexing pulls out the value stored inside a cell.' },
                { term: 'Cell indexing', detail: 'Parenthesis indexing returns a smaller cell array rather than the raw content.' },
                { term: 'Mixed data', detail: 'Cells suit ragged or mixed data such as strings of differing lengths.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'matlab-structs',
        title: 'Structures',
        level: 2,
        slug: 'structs',
        concepts: [
          {
            id: 'matlab-struct-intro',
            code: "s.name = 'Ada';\ns.age = 36;\ns.scores = [90 85 92];\ns.name          % 'Ada'\n\np = struct('x', 1, 'y', 2);",
            note: 'A struct groups related values under named fields, accessed with dot notation. Fields can be added at any time simply by assigning to them. Structs model records neatly, such as a person with a name, age, and scores.',
            explanation: {
              heading: 'Structures',
              intro: 'A struct bundles related values together under named fields, much like a record in other languages. Fields are reached with dot notation and can be added on the fly, which keeps related data organized.',
              points: [
                { term: 'Named fields', detail: 'Each piece of data lives under a descriptive field name accessed with a dot.' },
                { term: 'Dynamic fields', detail: 'A new field is created simply by assigning to a name that does not yet exist.' },
                { term: 'Mixed contents', detail: 'Different fields can hold different types and sizes, from scalars to arrays.' },
                { term: 'Record modeling', detail: 'Structs naturally represent entities such as a person with a name, age, and scores.' },
              ],
            },
          },
          {
            id: 'matlab-struct-array',
            code: "people(1).name = 'Ada';\npeople(2).name = 'Alan';\n{people.name}     % {'Ada' 'Alan'} — gather a field\nfieldnames(people)  % list field names",
            note: 'Structs can form arrays where every element shares the same fields, which is a common way to store many records. Collecting one field across the array with {s.field} produces a comma-separated list. fieldnames reports the available fields.',
            explanation: {
              heading: 'Struct arrays',
              intro: 'A struct array holds many records that all share the same set of fields, making it a tidy way to store a collection of similar items. Gathering one field across the array yields a list you can wrap into a cell or matrix.',
              points: [
                { term: 'Shared fields', detail: 'Every element of the array has the same field names, forming a uniform record set.' },
                { term: 'Field gathering', detail: 'Referencing a field across the array produces a comma separated list of values.' },
                { term: 'Collecting values', detail: 'Wrapping that list in curly braces or brackets builds a cell array or numeric array.' },
                { term: 'fieldnames', detail: 'The fieldnames function reports the field names available on the struct.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 9. Strings & Character Arrays
  {
    id: 'matlab-strings',
    title: 'Strings & Character Arrays',
    level: 1,
    slug: 'strings',
    concepts: [],
    children: [
      {
        id: 'matlab-char-vs-string',
        title: 'Char Arrays vs Strings',
        level: 2,
        slug: 'char-vs-string',
        concepts: [
          {
            id: 'matlab-char-intro',
            code: "c = 'hello';       % char array, single quotes\ns = \"hello\";       % string, double quotes\nclass(c)           % 'char'\nclass(s)           % 'string'\nc(1)               % 'h'",
            note: 'Single quotes create a classic char array, where each character is one element. Double quotes create a string object, introduced in modern MATLAB, which behaves as a single scalar value. Strings support convenient methods and are generally preferred for text.',
            explanation: {
              heading: 'Char arrays and strings',
              intro: 'MATLAB has two text types with different quoting. Char arrays treat text as a sequence of individual characters, while string objects treat a piece of text as a single scalar value with many convenient methods.',
              points: [
                { term: 'Single quotes', detail: 'Single quotes create a char array where each character occupies one element.' },
                { term: 'Double quotes', detail: 'Double quotes create a string object that acts as one scalar value.' },
                { term: 'Indexing difference', detail: 'Indexing a char array returns characters, while a string is treated as a whole.' },
                { term: 'Prefer strings', detail: 'String objects support helpful methods and are generally the better default for text.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'matlab-string-ops',
        title: 'String Operations',
        level: 2,
        slug: 'string-operations',
        concepts: [
          {
            id: 'matlab-string-ops-intro',
            code: "a = \"data\";\nb = \"set\";\nc = a + b;              % \"dataset\" — string concatenation\nupper(\"abc\")            % \"ABC\"\nstrrep(\"a-b-c\", \"-\", \"_\")  % \"a_b_c\"\nsplit(\"1,2,3\", \",\")     % [\"1\"; \"2\"; \"3\"]",
            note: 'String objects support the + operator for concatenation and many helper functions like upper, strrep, and split. For char arrays, use strcat or square brackets to join text. sprintf builds formatted text from numbers and other values.',
            explanation: {
              heading: 'Working with text',
              intro: 'String objects come with a rich toolkit for transforming and combining text. Knowing the common helpers lets you clean, join, and reformat text without dropping down to manual character manipulation.',
              points: [
                { term: 'Concatenation', detail: 'The plus operator joins string objects, while brackets or strcat join char arrays.' },
                { term: 'Case and replace', detail: 'Functions like upper change case and strrep swaps one substring for another.' },
                { term: 'split', detail: 'The split function breaks text apart at a delimiter into separate pieces.' },
                { term: 'sprintf', detail: 'The sprintf function builds formatted text by inserting numbers and values into a template.' },
              ],
            },
            example: "name = \"Ada\";\nmsg = sprintf(\"Hello, %s! You have %d messages.\", name, 3);",
          },
        ],
        children: [],
      },
    ],
  },

  // 10. Logical Indexing
  {
    id: 'matlab-logical',
    title: 'Logical Indexing',
    level: 1,
    slug: 'logical-indexing',
    concepts: [],
    children: [
      {
        id: 'matlab-logical-masks',
        title: 'Logical Masks',
        level: 2,
        slug: 'logical-masks',
        concepts: [
          {
            id: 'matlab-logical-intro',
            code: "v = [4 8 15 16 23 42];\nmask = v > 15;      % [0 0 0 1 1 1] logical\nv(mask)             % [16 23 42]\nv(v > 15)           % same thing in one step",
            note: 'A comparison produces a logical array of true and false values the same size as the input. Using that logical array as an index selects only the elements where the condition holds. This is a powerful, loop-free way to filter data.',
            explanation: {
              heading: 'Logical masks',
              intro: 'Comparing an array against a condition yields a logical mask of true and false values the same size as the input. Using that mask as an index keeps only the elements that satisfy the condition, all without a loop.',
              points: [
                { term: 'Comparison result', detail: 'An operator like greater than produces a logical array matching the input size.' },
                { term: 'Mask indexing', detail: 'Indexing with a logical array selects the elements aligned with true entries.' },
                { term: 'One step filter', detail: 'Writing the comparison directly inside the index filters data in a single expression.' },
                { term: 'Loop free', detail: 'This approach replaces element by element loops with a concise whole array operation.' },
              ],
            },
          },
          {
            id: 'matlab-logical-assign',
            code: "v = [4 8 15 16 23 42];\nv(v > 20) = 0;      % zero out large values\nfind(v == 0)        % indices where v is 0\nany(v > 100)        % false\nall(v >= 0)         % true",
            note: 'You can assign into a logical selection to modify matching elements in place. find returns the positions where a condition is true, while any and all reduce a logical array to a single true or false. These tools express conditions concisely.',
            explanation: {
              heading: 'Acting on conditions',
              intro: 'Logical arrays do more than filter values; you can assign into a masked selection and summarize conditions across an array. These tools express selection and testing logic compactly.',
              points: [
                { term: 'Masked assignment', detail: 'Assigning to a logical selection updates only the elements where the mask is true.' },
                { term: 'find', detail: 'The find function returns the positions at which a condition holds.' },
                { term: 'any', detail: 'The any function reports whether at least one element satisfies the condition.' },
                { term: 'all', detail: 'The all function reports whether every element satisfies the condition.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 11. Plotting & Visualization
  {
    id: 'matlab-plotting',
    title: 'Plotting & Visualization',
    level: 1,
    slug: 'plotting',
    concepts: [],
    children: [
      {
        id: 'matlab-plot-basics',
        title: 'Line Plots',
        level: 2,
        slug: 'line-plots',
        concepts: [
          {
            id: 'matlab-plot-intro',
            code: "x = 0:0.1:2*pi;\ny = sin(x);\nplot(x, y, 'r-', 'LineWidth', 2);\ntitle('Sine Wave');\nxlabel('x'); ylabel('sin(x)');\ngrid on;",
            note: "plot draws a 2D line from paired x and y vectors. A format string like 'r-' sets color and line style, and name-value pairs adjust properties such as LineWidth. Functions like title, xlabel, and grid annotate the axes.",
            explanation: {
              heading: 'Line plots',
              intro: 'The plot function draws a two dimensional line by connecting points given as paired x and y vectors. A short format string and name value options let you control appearance, while separate functions add labels and grids.',
              points: [
                { term: 'Paired vectors', detail: 'The x and y inputs must be the same length so each point has a coordinate.' },
                { term: 'Format string', detail: 'A short code such as r dash sets the line color and style at once.' },
                { term: 'Name value pairs', detail: 'Options like LineWidth fine tune properties beyond the format string.' },
                { term: 'Annotations', detail: 'Functions such as title, xlabel, and grid describe and decorate the axes.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'matlab-hold-legend',
        title: 'Hold, Legend & Subplots',
        level: 2,
        slug: 'hold-subplots',
        concepts: [
          {
            id: 'matlab-hold-intro',
            code: "x = 0:0.1:2*pi;\nplot(x, sin(x));\nhold on;\nplot(x, cos(x));\nhold off;\nlegend('sin', 'cos');",
            note: 'By default each plot call clears the axes first. hold on keeps existing lines so you can overlay several curves, and hold off restores the default. legend labels each series in the order it was drawn.',
            explanation: {
              heading: 'Overlaying and labeling',
              intro: 'By default a new plot replaces whatever was in the axes, so drawing several curves together requires holding the axes. A legend then identifies each series so a combined chart stays readable.',
              points: [
                { term: 'hold on', detail: 'Keeps existing lines so subsequent plot calls add to the same axes.' },
                { term: 'hold off', detail: 'Restores the default behavior where the next plot clears the axes.' },
                { term: 'legend', detail: 'Labels each drawn series, matching entries to lines in draw order.' },
                { term: 'Comparisons', detail: 'Overlaying curves makes it easy to compare related functions on one chart.' },
              ],
            },
          },
          {
            id: 'matlab-subplot-intro',
            code: "figure;\nsubplot(2, 1, 1);\nplot(1:10, rand(1, 10));\ntitle('Top');\nsubplot(2, 1, 2);\nbar(1:5, [3 1 4 1 5]);\ntitle('Bottom');",
            note: 'figure opens a new plotting window. subplot(rows, cols, k) divides a figure into a grid and selects the k-th cell for the next plot, letting you show multiple charts together. This is ideal for comparing related views side by side.',
            explanation: {
              heading: 'Figures and subplots',
              intro: 'A figure is a window that hosts one or more axes, and subplot carves that figure into a grid of separate plotting cells. This lets you present several related charts together in a single view.',
              points: [
                { term: 'figure', detail: 'Opens a fresh plotting window so new charts do not overwrite existing ones.' },
                { term: 'Grid layout', detail: 'The subplot function specifies how many rows and columns of cells to create.' },
                { term: 'Cell selection', detail: 'The third argument picks which cell the next plotting command draws into.' },
                { term: 'Side by side', detail: 'Subplots are ideal for comparing related views within one figure.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'matlab-3d-plotting',
        title: '3D Plotting Basics',
        level: 2,
        slug: '3d-plotting',
        concepts: [
          {
            id: 'matlab-plot3-intro',
            code: "t = 0:0.1:10*pi;\nx = sin(t);\ny = cos(t);\nz = t;\nplot3(x, y, z, 'LineWidth', 1.5);\ngrid on;\nxlabel('x'); ylabel('y'); zlabel('z');",
            note: 'plot3 draws a curve through points in three dimensions using x, y, and z vectors. It is the 3D counterpart of plot and works well for parametric curves like a helix. Rotate the figure interactively to inspect the shape.',
            explanation: {
              heading: 'Three dimensional curves',
              intro: 'The plot3 function extends line plotting into three dimensions by taking x, y, and z vectors of coordinates. It shines for visualizing parametric curves whose path winds through space.',
              points: [
                { term: 'Three coordinate vectors', detail: 'Each point needs an x, a y, and a z value, so all three vectors share a length.' },
                { term: 'Parametric curves', detail: 'Driving the vectors from a common parameter traces shapes such as a helix.' },
                { term: 'Counterpart of plot', detail: 'It behaves like plot but adds the third spatial dimension.' },
                { term: 'Interactive rotation', detail: 'Rotating the figure reveals the true shape from different viewpoints.' },
              ],
            },
          },
          {
            id: 'matlab-surf-intro',
            code: "[X, Y] = meshgrid(-2:0.2:2, -2:0.2:2);\nZ = X.^2 + Y.^2;\nsurf(X, Y, Z);      % filled surface\n% mesh(X, Y, Z);    % wireframe alternative\ncolorbar;",
            note: 'meshgrid builds the coordinate matrices X and Y that cover a rectangular region. Evaluating a function element-wise over them gives the heights Z. surf renders a shaded surface while mesh draws a wireframe, and colorbar shows the value scale.',
            explanation: {
              heading: 'Surface plots',
              intro: 'Plotting a surface starts by building coordinate grids that cover a rectangular region, then evaluating a function over them to get heights. The result can be shown as a shaded surface or a wireframe.',
              points: [
                { term: 'meshgrid', detail: 'Builds the paired coordinate matrices that span the region of interest.' },
                { term: 'Element-wise heights', detail: 'Evaluating a function on the grids with dot operators fills the height matrix.' },
                { term: 'surf and mesh', detail: 'The surf function draws a filled surface while mesh draws a wireframe version.' },
                { term: 'colorbar', detail: 'Adding a colorbar shows how colors map to the underlying values.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 12. File I/O & Linear Algebra
  {
    id: 'matlab-io-linalg',
    title: 'File I/O & Linear Algebra',
    level: 1,
    slug: 'io-linear-algebra',
    concepts: [],
    children: [
      {
        id: 'matlab-tabular-io',
        title: 'File Input & Output',
        level: 2,
        slug: 'file-io',
        concepts: [
          {
            id: 'matlab-readtable-intro',
            code: "T = readtable('data.csv');\nT.Properties.VariableNames   % column names\nfirstCol = T{:, 1};          % values from column 1\nwritetable(T, 'output.csv');",
            note: 'readtable imports spreadsheet and delimited files into a table, a container with named columns of possibly different types. Access columns by name with dot notation or by position with braces. writetable exports a table back to disk.',
            explanation: {
              heading: 'Reading tabular data',
              intro: 'The readtable function imports spreadsheet and delimited files into a table, a container whose columns carry names and may hold different types. Tables make column oriented data easy to access and export.',
              points: [
                { term: 'readtable', detail: 'Imports a delimited or spreadsheet file, inferring column names and types.' },
                { term: 'Column by name', detail: 'Dot notation retrieves a named column as a vector of values.' },
                { term: 'Column by position', detail: 'Brace indexing extracts columns by their numeric position.' },
                { term: 'writetable', detail: 'Exports a table back to a file, preserving the column names.' },
              ],
            },
          },
          {
            id: 'matlab-fopen-intro',
            code: "fid = fopen('log.txt', 'w');\nfprintf(fid, 'Value: %d\\n', 42);\nfclose(fid);\n\ntext = fileread('log.txt');",
            note: 'fopen opens a file and returns an identifier used by fprintf and fscanf for formatted reading and writing. Always pair fopen with fclose to release the file. For simply loading an entire text file, fileread is the quickest option.',
            explanation: {
              heading: 'Low-level file access',
              intro: 'For fine grained text handling, MATLAB offers low level file functions that open a stream, read or write formatted data, and then close it. This gives precise control when higher level readers are not a good fit.',
              points: [
                { term: 'fopen', detail: 'Opens a file in a chosen mode and returns an identifier used by later calls.' },
                { term: 'fprintf and fscanf', detail: 'Write and read formatted text through the identifier returned by fopen.' },
                { term: 'fclose', detail: 'Always closing the file releases the operating system handle and flushes output.' },
                { term: 'fileread', detail: 'For loading a whole text file at once, fileread is the quickest option.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'matlab-solving-systems',
        title: 'Solving Linear Systems',
        level: 2,
        slug: 'solving-systems',
        concepts: [
          {
            id: 'matlab-backslash-intro',
            code: "A = [2 1; 1 3];\nb = [5; 10];\nx = A \\ b;      % solve A*x = b\n% x = [1; 3]",
            note: 'The backslash operator solves the linear system A*x = b efficiently and accurately. It chooses an appropriate algorithm automatically and is strongly preferred over computing inv(A)*b. For overdetermined systems it returns a least-squares solution.',
            explanation: {
              heading: 'Solving linear systems',
              intro: 'The backslash operator is MATLAB preferred way to solve a system of linear equations. It inspects the matrix and selects a suitable, numerically sound algorithm automatically, which beats forming an explicit inverse.',
              points: [
                { term: 'Backslash operator', detail: 'Writing A backslash b solves the system A times x equals b for the unknown x.' },
                { term: 'Automatic algorithm', detail: 'It picks a factorization suited to the matrix structure without extra effort.' },
                { term: 'Avoid explicit inverse', detail: 'It is faster and more accurate than computing an inverse and multiplying.' },
                { term: 'Least squares', detail: 'For overdetermined systems it returns the least squares best fit solution.' },
              ],
            },
          },
          {
            id: 'matlab-inv',
            code: "A = [4 7; 2 6];\nAi = inv(A);       % matrix inverse\nd = det(A);        % determinant: 10\nr = rank(A);       % rank: 2",
            note: 'inv computes the matrix inverse, det the determinant, and rank the number of independent rows or columns. Explicit inverses are useful for analysis, but for solving equations prefer the backslash operator for better numerical stability.',
            explanation: {
              heading: 'Matrix properties',
              intro: 'MATLAB provides direct functions for classic matrix quantities used in analysis. While these are valuable for understanding a matrix, solving equations should still go through the backslash operator.',
              points: [
                { term: 'inv', detail: 'Computes the matrix inverse, useful for analysis but rarely needed to solve systems.' },
                { term: 'det', detail: 'Returns the determinant, which signals whether a matrix is singular.' },
                { term: 'rank', detail: 'Reports the number of independent rows or columns in the matrix.' },
                { term: 'Stability caution', detail: 'Prefer backslash over an explicit inverse for better numerical stability.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'matlab-eigen',
        title: 'Eigenvalues & Decompositions',
        level: 2,
        slug: 'eigenvalues',
        concepts: [
          {
            id: 'matlab-eig-intro',
            code: "A = [2 0; 0 3];\ne = eig(A);            % [2; 3] eigenvalues\n[V, D] = eig(A);       % eigenvectors V, eigenvalues on diag(D)\n[U, S, W] = svd(A);    % singular value decomposition",
            note: 'eig returns the eigenvalues of a matrix, and with two outputs it also gives the eigenvectors. svd computes the singular value decomposition, a robust tool for rank, conditioning, and data compression. These functions underpin much of scientific computing.',
            explanation: {
              heading: 'Eigenvalues and decompositions',
              intro: 'Matrix decompositions expose deep structure that underlies much of scientific computing. MATLAB exposes the eigenvalue decomposition and the singular value decomposition as concise function calls.',
              points: [
                { term: 'eig', detail: 'Returns the eigenvalues, and with a second output also the eigenvectors.' },
                { term: 'svd', detail: 'Computes the singular value decomposition, a robust and versatile factorization.' },
                { term: 'Applications', detail: 'These tools support rank estimation, conditioning analysis, and data compression.' },
                { term: 'Multiple outputs', detail: 'Requesting extra outputs returns the factor matrices rather than just values.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 13. Polynomials, Built-ins & Best Practices
  {
    id: 'matlab-toolkit',
    title: 'Polynomials, Built-ins & Best Practices',
    level: 1,
    slug: 'toolkit',
    concepts: [],
    children: [
      {
        id: 'matlab-polynomials',
        title: 'Polynomials',
        level: 2,
        slug: 'polynomials',
        concepts: [
          {
            id: 'matlab-polyval-intro',
            code: "% x^2 - 3x + 2, coefficients high to low\np = [1 -3 2];\npolyval(p, 4)      % 6\nr = roots(p);      % [2; 1]\npoly([2 1])        % [1 -3 2] rebuild from roots",
            note: 'A polynomial is stored as a row vector of coefficients ordered from the highest power down to the constant. polyval evaluates it at given points, roots finds where it equals zero, and poly reconstructs coefficients from a set of roots.',
            explanation: {
              heading: 'Representing polynomials',
              intro: 'MATLAB represents a polynomial as a simple row vector of coefficients, so ordinary array tools apply. A small family of functions evaluates it, finds its roots, and rebuilds it from those roots.',
              points: [
                { term: 'Coefficient vector', detail: 'Coefficients run from the highest power down to the constant term.' },
                { term: 'polyval', detail: 'Evaluates the polynomial at one or many points, element-wise on arrays.' },
                { term: 'roots', detail: 'Finds the values at which the polynomial equals zero.' },
                { term: 'poly', detail: 'Reconstructs the coefficient vector from a given set of roots.' },
              ],
            },
          },
          {
            id: 'matlab-polyfit-intro',
            code: "x = 0:5;\ny = [0 0.9 4.1 9.2 15.8 25.1];\np = polyfit(x, y, 2);   % best-fit quadratic\nyfit = polyval(p, x);",
            note: 'polyfit finds the polynomial coefficients of a chosen degree that best fit data in the least-squares sense. Pairing it with polyval lets you evaluate the fitted curve at any points. This is a quick way to model trends in measured data.',
            explanation: {
              heading: 'Fitting polynomials',
              intro: 'The polyfit function finds polynomial coefficients that best match measured data in the least squares sense. Combined with polyval it gives a quick way to model and evaluate a trend through noisy points.',
              points: [
                { term: 'polyfit', detail: 'Computes the best fit coefficients for a chosen polynomial degree.' },
                { term: 'Least squares', detail: 'The fit minimizes the summed squared error between the curve and the data.' },
                { term: 'Degree choice', detail: 'A higher degree flexes more but risks overfitting the sample points.' },
                { term: 'Evaluate the fit', detail: 'Passing the coefficients to polyval traces the fitted curve at any points.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'matlab-builtins',
        title: 'Common Built-in Functions',
        level: 2,
        slug: 'built-in-functions',
        concepts: [
          {
            id: 'matlab-math-intro',
            code: "abs(-7)        % 7\nsqrt(16)       % 4\nexp(1)         % 2.7183\nmod(10, 3)     % 1\nround(2.6)     % 3\nfloor(2.9)     % 2",
            note: 'MATLAB provides a rich set of elementary math functions that operate element-wise on arrays. abs, sqrt, exp, and log handle common transforms, while round, floor, ceil, and mod cover rounding and remainders. Applying them to a whole array at once is idiomatic.',
            explanation: {
              heading: 'Elementary math functions',
              intro: 'MATLAB ships a broad set of elementary math functions that operate element-wise, so a single call transforms an entire array. This makes applying a formula across many values both concise and fast.',
              points: [
                { term: 'Transforms', detail: 'Functions like abs, sqrt, exp, and log apply common operations to each element.' },
                { term: 'Rounding', detail: 'The round, floor, and ceil functions convert values to nearby integers.' },
                { term: 'mod', detail: 'The mod function returns the remainder after division, useful for cycles.' },
                { term: 'Whole array use', detail: 'Passing an array applies the function to every element at once.' },
              ],
            },
          },
          {
            id: 'matlab-stats-intro',
            code: "v = [4 8 15 16 23 42];\nsum(v)         % 108\nmean(v)        % 18\nmax(v)         % 42\nmin(v)         % 4\nsort(v, 'descend')   % [42 23 16 15 8 4]",
            note: 'Aggregation functions like sum, mean, max, and min reduce arrays to summary values. On a matrix they operate down each column by default, and you can pass a dimension argument to change that. sort and unique reorganize data for analysis.',
            explanation: {
              heading: 'Aggregating data',
              intro: 'Reduction functions condense an array into summary statistics such as a total or an average. On matrices they work down each column by default, and a dimension argument lets you choose the direction.',
              points: [
                { term: 'Reductions', detail: 'Functions like sum, mean, max, and min collapse many values into one summary.' },
                { term: 'Column default', detail: 'On a matrix these operate down each column unless told otherwise.' },
                { term: 'Dimension argument', detail: 'Passing a dimension number switches the reduction to rows or another axis.' },
                { term: 'Reorganizing', detail: 'The sort and unique functions reorder and deduplicate data for analysis.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: 'matlab-best-practices',
        title: 'Preallocation & Clean Code',
        level: 2,
        slug: 'best-practices',
        concepts: [
          {
            id: 'matlab-prealloc-intro',
            code: "% Slow: array grows every iteration\ny = [];\nfor i = 1:1000\n    y(i) = i^2;\nend\n\n% Fast: preallocate once\ny = zeros(1, 1000);\nfor i = 1:1000\n    y(i) = i^2;\nend",
            note: 'Growing an array inside a loop forces MATLAB to reallocate and copy memory on every iteration, which is slow. Preallocating with zeros (or a similar constructor) reserves the space once so the loop only writes values. Always size arrays ahead of loops that fill them.',
            explanation: {
              heading: 'Preallocation',
              intro: 'Letting an array grow one element at a time inside a loop forces repeated memory reallocation and copying, which scales poorly. Reserving the full size up front lets the loop simply write into place.',
              points: [
                { term: 'Growth is costly', detail: 'Expanding an array each iteration copies all existing data to new memory.' },
                { term: 'Reserve once', detail: 'Constructors like zeros allocate the whole array before the loop begins.' },
                { term: 'Write in place', detail: 'With space reserved, the loop only assigns values without resizing.' },
                { term: 'Know the size', detail: 'Preallocation applies whenever the final length is known ahead of time.' },
              ],
            },
          },
          {
            id: 'matlab-clean-intro',
            code: "temps = [72 68 75 80];\naboveAvg = temps > mean(temps);\nhotDays = temps(aboveAvg);\n\nfor i = 1:3\n    result = i^2;   % semicolon suppresses display\nend",
            note: 'Favor vectorized expressions and descriptive variable names so code reads like the problem it solves. End statements with semicolons to avoid flooding the command window, especially inside loops. Small, focused functions are easier to test and reuse than long scripts.',
            explanation: {
              heading: 'Writing clean code',
              intro: 'Readable MATLAB favors clear names, vectorized expressions, and quiet output so the code communicates intent. A few consistent habits keep programs easy to test, reuse, and hand to others.',
              points: [
                { term: 'Descriptive names', detail: 'Meaningful variable names make code read like the problem it solves.' },
                { term: 'Suppress output', detail: 'Ending statements with semicolons prevents flooding the Command Window inside loops.' },
                { term: 'Prefer vectorization', detail: 'Whole array expressions are usually clearer and faster than explicit loops.' },
                { term: 'Small functions', detail: 'Short focused functions are easier to test and reuse than long scripts.' },
              ],
            },
            example: "function y = safeSqrt(x)\n    if any(x < 0)\n        error('Input must be non-negative');\n    end\n    y = sqrt(x);\nend",
          },
        ],
        children: [],
      },
    ],
  },
];

export default topics;
