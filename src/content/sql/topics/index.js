// Standard SQL topic tree.

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  {
    id: 'sql-select-basics',
    title: 'SELECT Basics',
    level: 1,
    slug: 'select-basics',
    concepts: [],
    children: [
      {
        id: 'sql-select-columns',
        title: 'Selecting Columns',
        level: 2,
        slug: 'select-columns',
        concepts: [
          {
            id: 'sql-select-all',
            code: "SELECT * FROM employees;",
            note: "SELECT * returns every column of every row. In production prefer naming columns explicitly so the result shape is stable and only needed data is read.",
            explanation: {
              heading: 'Selecting Every Column with the Star',
              intro: 'The asterisk is a shorthand that tells the database to return all columns of the matching rows in the order they were defined.',
              points: [
                { term: 'Result shape', detail: 'The star expands to whatever columns exist at query time, so adding or reordering columns silently changes what your query returns.' },
                { term: 'Wasted I/O', detail: 'It reads and transfers columns you may not need, including large text or blob fields, which hurts network and memory use.' },
                { term: 'Index coverage', detail: 'Naming only the columns you use lets the planner satisfy a query from a covering index without touching the base table.' },
                { term: 'Ad hoc versus production', detail: 'The star is fine for quick exploration but explicit column lists are safer and clearer in application code.' },
              ],
            },
            example: "SELECT id, first_name, last_name FROM employees;",
          },
          {
            id: 'sql-select-alias',
            code: "SELECT first_name AS fname, salary * 12 AS annual_salary\nFROM employees;",
            note: "Column aliases (AS) rename output columns and label computed expressions. The AS keyword is optional but improves readability.",
            explanation: {
              heading: 'Naming Output Columns with Aliases',
              intro: 'An alias gives a result column a readable name, which is especially useful for computed expressions that would otherwise get an unpredictable machine name.',
              points: [
                { term: 'Optional keyword', detail: 'Writing AS is optional; salary AS pay and salary pay mean the same thing, but AS reads more clearly.' },
                { term: 'Computed columns', detail: 'Expressions like salary times 12 have no natural name, so an alias is the only way to label them meaningfully.' },
                { term: 'Scope in the same query', detail: 'In standard SQL a SELECT alias cannot be reused in WHERE because WHERE is evaluated before SELECT; it is usable in ORDER BY.' },
                { term: 'Quoting', detail: 'Use double quotes for aliases that contain spaces or reserved words, for example AS "Total Pay".' },
              ],
            },
            example: "SELECT price * quantity AS line_total FROM order_items;",
          },
          {
            id: 'sql-select-distinct',
            code: "SELECT DISTINCT department FROM employees;",
            note: "DISTINCT removes duplicate rows from the result. It applies to the whole selected row, not just the first column.",
            explanation: {
              heading: 'Removing Duplicate Rows with DISTINCT',
              intro: 'DISTINCT collapses rows that are identical across all selected columns into a single row in the output.',
              points: [
                { term: 'Whole row', detail: 'It considers every column in the SELECT list together, so DISTINCT country, city keeps each unique pair, not each unique country.' },
                { term: 'NULL handling', detail: 'Two NULL values are treated as equal for the purpose of DISTINCT, so duplicate NULL rows collapse to one.' },
                { term: 'Cost', detail: 'Removing duplicates usually requires a sort or hash step, which adds work on large result sets.' },
                { term: 'Not a fix for joins', detail: 'Reaching for DISTINCT to hide duplicate rows from a bad join often masks the real problem in the join condition.' },
              ],
            },
            example: "SELECT DISTINCT country, city FROM customers;",
          },
          {
            id: 'sql-select-literals',
            code: "SELECT\n  'active' AS status,\n  CURRENT_DATE AS today,\n  price * 1.1 AS with_tax\nFROM products;",
            note: "A SELECT list can contain literals and expressions, not just columns. This is handy for tagging rows with a constant or computing derived values without touching the stored data.",
            explanation: {
              heading: 'Literals and Expressions in the SELECT List',
              intro: 'A projection can return constants, arithmetic, function calls, and other computed values alongside or instead of stored columns.',
              points: [
                { term: 'Constant tagging', detail: 'A literal like active AS status stamps the same value onto every returned row, useful for labeling or combining result sets.' },
                { term: 'Derived values', detail: 'Expressions such as price times 1.1 compute on the fly and never change the stored data.' },
                { term: 'Per row evaluation', detail: 'Each expression is evaluated once per row, so functions like CURRENT_DATE reflect the moment the query runs.' },
                { term: 'No table needed', detail: 'A SELECT of pure constants can run without a FROM clause in many dialects, handy for quick tests.' },
              ],
            },
            example: "SELECT 1 AS one;  -- a query needs no table for constants",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'sql-filtering',
    title: 'Filtering with WHERE',
    level: 1,
    slug: 'filtering',
    concepts: [],
    children: [
      {
        id: 'sql-where-predicates',
        title: 'Predicates and Operators',
        level: 2,
        slug: 'predicates',
        concepts: [
          {
            id: 'sql-where-basic',
            code: "SELECT * FROM products\nWHERE price > 100 AND category = 'electronics';",
            note: "WHERE filters rows before grouping. Combine conditions with AND / OR and group them with parentheses to control precedence.",
            explanation: {
              heading: 'Filtering Rows with WHERE',
              intro: 'The WHERE clause keeps only the rows whose predicate evaluates to TRUE, and it runs before grouping and aggregation.',
              points: [
                { term: 'Boolean logic', detail: 'AND and OR combine predicates, and parentheses make precedence explicit since AND binds tighter than OR.' },
                { term: 'Runs early', detail: 'WHERE filters individual rows before GROUP BY, so it cannot reference aggregate results; that is what HAVING is for.' },
                { term: 'Sargability', detail: 'Predicates that leave the column bare, like price greater than 100, can use an index, while wrapping the column in a function often prevents that.' },
                { term: 'Three valued logic', detail: 'A row is only kept when the predicate is TRUE; UNKNOWN results from NULL comparisons are excluded.' },
              ],
            },
            example: "SELECT * FROM orders WHERE status = 'open' OR total > 500;",
          },
          {
            id: 'sql-where-in-between',
            code: "SELECT * FROM employees\nWHERE department IN ('Sales', 'Marketing')\n  AND hire_date BETWEEN '2020-01-01' AND '2023-12-31';",
            note: "IN tests membership in a set, BETWEEN tests an inclusive range. Both are shorthand for longer OR / comparison chains.",
            explanation: {
              heading: 'Membership and Ranges with IN and BETWEEN',
              intro: 'IN and BETWEEN are compact operators that replace long chains of OR conditions and comparison pairs.',
              points: [
                { term: 'IN as OR', detail: 'x IN (1, 2, 3) is equivalent to x equals 1 OR x equals 2 OR x equals 3, just easier to read.' },
                { term: 'BETWEEN is inclusive', detail: 'a BETWEEN 1 AND 10 includes both endpoints, matching a greater-than-or-equal and less-than-or-equal pair.' },
                { term: 'NULL and NOT IN', detail: 'NOT IN with a list that contains NULL can return no rows unexpectedly because the comparison becomes UNKNOWN.' },
                { term: 'Subquery form', detail: 'IN also accepts a subquery, letting you test membership against the result of another query.' },
              ],
            },
            example: "SELECT * FROM products WHERE id IN (1, 2, 3);",
          },
          {
            id: 'sql-where-null-like',
            code: "SELECT * FROM customers\nWHERE phone IS NULL\n  AND name LIKE 'A%';",
            note: "Use IS NULL / IS NOT NULL to test for missing values (= NULL never matches). LIKE performs pattern matching with % (any run) and _ (single char).",
            explanation: {
              heading: 'Testing for NULL and Matching Patterns',
              intro: 'Missing values need the IS NULL operator, and text matching uses LIKE with its two wildcard characters.',
              points: [
                { term: 'Why not equals NULL', detail: 'Comparing anything to NULL with equals yields UNKNOWN, so column equals NULL never matches; use IS NULL instead.' },
                { term: 'LIKE wildcards', detail: 'The percent sign matches any run of characters including none, and the underscore matches exactly one character.' },
                { term: 'Leading wildcard cost', detail: 'A pattern that starts with a percent sign, like percent dot pdf, cannot use a normal index and forces a scan.' },
                { term: 'Escaping', detail: 'To match a literal percent or underscore, define an ESCAPE character and prefix the wildcard with it.' },
              ],
            },
            example: "SELECT * FROM files WHERE name LIKE '%.pdf';",
          },
        ],
        children: [],
      },
      {
        id: 'sql-null-handling',
        title: 'NULL and Three-Valued Logic',
        level: 2,
        slug: 'null-handling',
        concepts: [
          {
            id: 'sql-null-logic',
            code: "SELECT * FROM t WHERE value <> 5;  -- excludes rows where value IS NULL\nSELECT * FROM t WHERE value <> 5 OR value IS NULL;",
            note: "SQL uses three-valued logic: comparisons with NULL yield UNKNOWN, and WHERE keeps only rows that are TRUE. So value <> 5 silently drops NULL rows unless you add an IS NULL check.",
            explanation: {
              heading: 'Three Valued Logic and NULL',
              intro: 'SQL predicates can be TRUE, FALSE, or UNKNOWN, and NULL is the reason the third value exists.',
              points: [
                { term: 'NULL means unknown', detail: 'NULL represents a missing or unknown value, not zero and not an empty string.' },
                { term: 'Comparisons yield UNKNOWN', detail: 'Any comparison involving NULL, including NULL equals NULL, returns UNKNOWN rather than TRUE or FALSE.' },
                { term: 'WHERE keeps only TRUE', detail: 'Because UNKNOWN is not TRUE, a filter like value not equal to 5 silently drops rows where value is NULL.' },
                { term: 'Explicit NULL checks', detail: 'Add OR value IS NULL when you want to include the missing-value rows in the result.' },
              ],
            },
            example: "SELECT NULL = NULL;  -- returns NULL, not true",
          },
          {
            id: 'sql-coalesce-nullif',
            code: "SELECT COALESCE(nickname, first_name, 'friend') AS display,\n       NULLIF(discount, 0) AS discount_or_null\nFROM users;",
            note: "COALESCE returns the first non-NULL argument, ideal for defaults and fallbacks. NULLIF returns NULL when two values are equal, useful for turning sentinels like 0 into NULL.",
            explanation: {
              heading: 'Handling NULL with COALESCE and NULLIF',
              intro: 'These two functions convert between NULL and concrete values, which is essential for defaults and for avoiding errors like divide by zero.',
              points: [
                { term: 'COALESCE', detail: 'It scans its arguments left to right and returns the first one that is not NULL, so you can supply a chain of fallbacks.' },
                { term: 'NULLIF', detail: 'It returns NULL when its two arguments are equal and otherwise returns the first, handy for turning sentinel values into NULL.' },
                { term: 'Divide by zero guard', detail: 'Dividing by NULLIF of the denominator and zero yields NULL instead of raising an error when the denominator is zero.' },
                { term: 'Type consistency', detail: 'All COALESCE arguments should share a compatible type so the result has a well defined type.' },
              ],
            },
            example: "SELECT COALESCE(SUM(amount), 0) FROM payments;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'sql-sorting-limiting',
    title: 'Sorting and Limiting',
    level: 1,
    slug: 'sorting-limiting',
    concepts: [],
    children: [
      {
        id: 'sql-order-by',
        title: 'ORDER BY and Paging',
        level: 2,
        slug: 'order-by',
        concepts: [
          {
            id: 'sql-order-basic',
            code: "SELECT name, salary FROM employees\nORDER BY salary DESC, name ASC;",
            note: "ORDER BY sorts the result. List multiple keys for tie-breaking; ASC is the default, DESC reverses. Sorting happens after WHERE and GROUP BY.",
            explanation: {
              heading: 'Sorting Results with ORDER BY',
              intro: 'ORDER BY defines the order of rows in the output and is the only way to guarantee a specific ordering.',
              points: [
                { term: 'Multiple keys', detail: 'List several columns to break ties; the second key orders rows that are equal on the first, and so on.' },
                { term: 'Direction', detail: 'ASC is the default and DESC reverses it, and each key can have its own direction.' },
                { term: 'Runs last', detail: 'Sorting happens after WHERE, GROUP BY, and SELECT, so it can reference SELECT aliases.' },
                { term: 'No implicit order', detail: 'Without ORDER BY the database may return rows in any order, so never rely on physical storage order.' },
              ],
            },
            example: "SELECT * FROM posts ORDER BY published_at DESC;",
          },
          {
            id: 'sql-fetch-offset',
            code: "SELECT * FROM products\nORDER BY id\nOFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY;",
            note: "The SQL-standard OFFSET ... FETCH clause implements paging. OFFSET skips rows, FETCH NEXT limits how many are returned. Always pair with ORDER BY for deterministic results.",
            explanation: {
              heading: 'Paging with OFFSET and FETCH',
              intro: 'The standard OFFSET and FETCH clause returns a window of rows, which is the building block of page-by-page navigation.',
              points: [
                { term: 'OFFSET skips', detail: 'OFFSET tells the database how many leading rows to discard before returning results.' },
                { term: 'FETCH limits', detail: 'FETCH NEXT n ROWS ONLY caps the number of rows returned after the offset is applied.' },
                { term: 'Order dependency', detail: 'Without a stable ORDER BY the same page number can return different rows on different runs.' },
                { term: 'Deep page cost', detail: 'Large offsets still scan and discard all the skipped rows, so keyset paging on an indexed key scales better for deep pages.' },
              ],
            },
            example: "SELECT * FROM logs ORDER BY ts FETCH FIRST 5 ROWS ONLY;",
          },
          {
            id: 'sql-order-nulls',
            code: "SELECT name, end_date FROM projects\nORDER BY end_date DESC NULLS LAST;",
            note: "NULLS FIRST / NULLS LAST control where missing values sort. This makes ordering predictable when a column is nullable, for example pushing open-ended projects to the bottom.",
            explanation: {
              heading: 'Placing NULLs in Sorted Output',
              intro: 'When a sort column contains NULLs, NULLS FIRST and NULLS LAST let you decide exactly where those rows land.',
              points: [
                { term: 'Explicit placement', detail: 'NULLS FIRST puts missing values at the top and NULLS LAST at the bottom regardless of ascending or descending.' },
                { term: 'Dialect defaults', detail: 'Databases differ on where NULLs go by default, so being explicit keeps behavior portable and predictable.' },
                { term: 'Practical framing', detail: 'It lets you push open-ended or unknown rows to the end so the meaningful values appear first.' },
                { term: 'Per key', detail: 'The clause attaches to a single sort key, so different keys in the same ORDER BY can treat NULLs differently.' },
              ],
            },
            example: "SELECT * FROM t ORDER BY score ASC NULLS FIRST;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'sql-aggregation',
    title: 'Aggregation and Grouping',
    level: 1,
    slug: 'aggregation',
    concepts: [],
    children: [
      {
        id: 'sql-aggregate-functions',
        title: 'Aggregate Functions',
        level: 2,
        slug: 'aggregate-functions',
        concepts: [
          {
            id: 'sql-agg-basic',
            code: "SELECT COUNT(*) AS total,\n       AVG(salary) AS avg_salary,\n       MAX(salary) AS top_salary\nFROM employees;",
            note: "Aggregate functions (COUNT, SUM, AVG, MIN, MAX) collapse many rows into one summary value. COUNT(*) counts rows; COUNT(col) ignores NULLs.",
            explanation: {
              heading: 'Summarizing Rows with Aggregate Functions',
              intro: 'Aggregate functions reduce a group of rows down to a single summary value such as a count, sum, or average.',
              points: [
                { term: 'COUNT variants', detail: 'COUNT star counts every row while COUNT of a column counts only rows where that column is not NULL.' },
                { term: 'NULLs skipped', detail: 'SUM, AVG, MIN, and MAX ignore NULL inputs, so an average is over the non-NULL values only.' },
                { term: 'Whole table or per group', detail: 'Without GROUP BY the aggregate spans the whole table; with it, one value is produced per group.' },
                { term: 'AVG and integers', detail: 'Averaging integer columns may truncate in some dialects, so cast to a decimal type when you need fractional precision.' },
              ],
            },
            example: "SELECT SUM(total) FROM orders WHERE status = 'paid';",
          },
          {
            id: 'sql-count-distinct',
            code: "SELECT COUNT(DISTINCT customer_id) AS unique_customers,\n       COUNT(*) AS total_orders\nFROM orders;",
            note: "COUNT(DISTINCT col) counts unique non-NULL values, useful for cardinality like distinct customers. Contrast with COUNT(*) which counts all rows including duplicates.",
            explanation: {
              heading: 'Counting Unique Values',
              intro: 'Adding DISTINCT inside an aggregate makes it operate on the set of distinct values rather than every row.',
              points: [
                { term: 'Unique cardinality', detail: 'COUNT of DISTINCT column returns how many different values appear, such as the number of distinct customers.' },
                { term: 'NULLs excluded', detail: 'Like other aggregates, DISTINCT counting ignores NULL, so unknown values do not inflate the total.' },
                { term: 'Contrast with star', detail: 'COUNT star counts all rows including duplicates, which answers a different question than distinct counting.' },
                { term: 'Cost', detail: 'DISTINCT aggregation must deduplicate values, so it is heavier than a plain count on large data sets.' },
              ],
            },
            example: "SELECT AVG(DISTINCT price) FROM products;",
          },
        ],
        children: [],
      },
      {
        id: 'sql-group-having',
        title: 'GROUP BY and HAVING',
        level: 2,
        slug: 'group-having',
        concepts: [
          {
            id: 'sql-group-basic',
            code: "SELECT department, COUNT(*) AS headcount\nFROM employees\nGROUP BY department;",
            note: "GROUP BY partitions rows into groups so aggregates are computed per group. Every non-aggregated column in SELECT must appear in GROUP BY.",
            explanation: {
              heading: 'Grouping Rows with GROUP BY',
              intro: 'GROUP BY buckets rows that share the same values in the listed columns, then computes each aggregate once per bucket.',
              points: [
                { term: 'One row per group', detail: 'The result has a single row for each distinct combination of the grouping columns.' },
                { term: 'Projection rule', detail: 'Every column in SELECT must either appear in GROUP BY or be wrapped in an aggregate function.' },
                { term: 'NULL groups', detail: 'Rows with NULL in a grouping column are gathered into their own single group.' },
                { term: 'Order of operations', detail: 'GROUP BY runs after WHERE, so WHERE trims rows before they are grouped.' },
              ],
            },
            example: "SELECT customer_id, SUM(total) FROM orders GROUP BY customer_id;",
          },
          {
            id: 'sql-having',
            code: "SELECT department, AVG(salary) AS avg_salary\nFROM employees\nGROUP BY department\nHAVING AVG(salary) > 50000;",
            note: "HAVING filters groups after aggregation, whereas WHERE filters rows before it. Use HAVING for conditions on aggregate results.",
            explanation: {
              heading: 'Filtering Groups with HAVING',
              intro: 'HAVING applies a condition to whole groups after aggregates have been computed, which WHERE cannot do.',
              points: [
                { term: 'After aggregation', detail: 'HAVING runs once per group and can reference aggregate results like the count or average of a group.' },
                { term: 'WHERE versus HAVING', detail: 'Use WHERE to remove rows before grouping and HAVING to remove groups afterward for efficiency.' },
                { term: 'Combine both', detail: 'A query can filter rows in WHERE and then filter the resulting groups in HAVING.' },
                { term: 'Runs before SELECT', detail: 'In standard SQL, HAVING is evaluated before the SELECT list, so it repeats the aggregate expression rather than an alias.' },
              ],
            },
            example: "SELECT product_id, COUNT(*) c FROM sales GROUP BY product_id HAVING COUNT(*) > 10;",
          },
          {
            id: 'sql-grouping-sets',
            code: "SELECT region, product, SUM(sales)\nFROM orders\nGROUP BY ROLLUP (region, product);",
            note: "GROUPING SETS, ROLLUP, and CUBE compute several grouping levels in one query. ROLLUP adds subtotals and a grand total; CUBE produces every combination of the grouped columns.",
            explanation: {
              heading: 'Multi Level Grouping with ROLLUP and CUBE',
              intro: 'These extensions let one query return several grouping levels at once, producing subtotals and grand totals for reporting.',
              points: [
                { term: 'ROLLUP', detail: 'It builds a hierarchy from left to right, adding subtotals for each prefix plus one grand total row.' },
                { term: 'CUBE', detail: 'It produces every possible combination of the grouped columns, giving subtotals along all dimensions.' },
                { term: 'GROUPING SETS', detail: 'It lets you list exactly the grouping combinations you want instead of a full rollup or cube.' },
                { term: 'Identifying totals', detail: 'The GROUPING function marks which columns are aggregated away in a given row so you can tell subtotals from real NULLs.' },
              ],
            },
            example: "SELECT a, b, SUM(x) FROM t GROUP BY CUBE (a, b);",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'sql-joins',
    title: 'Joins',
    level: 1,
    slug: 'joins',
    concepts: [],
    children: [
      {
        id: 'sql-inner-outer-joins',
        title: 'Inner and Outer Joins',
        level: 2,
        slug: 'inner-outer',
        concepts: [
          {
            id: 'sql-inner-join',
            code: "SELECT e.name, d.department_name\nFROM employees e\nINNER JOIN departments d ON e.dept_id = d.id;",
            note: "INNER JOIN returns only rows that match in both tables on the ON condition. Table aliases (e, d) keep join conditions concise.",
            explanation: {
              heading: 'Combining Tables with INNER JOIN',
              intro: 'An inner join pairs rows from two tables wherever the ON condition holds and drops rows that have no match on either side.',
              points: [
                { term: 'Match required', detail: 'Only combinations that satisfy the ON predicate appear, so unmatched rows from both tables are excluded.' },
                { term: 'ON versus WHERE', detail: 'The ON clause expresses how tables relate, while WHERE filters the joined result afterward.' },
                { term: 'Table aliases', detail: 'Short aliases like e and d qualify column names and keep multi table conditions readable.' },
                { term: 'Ambiguous columns', detail: 'When both tables share a column name, qualify it with the table or alias to avoid an ambiguity error.' },
              ],
            },
            example: "SELECT o.id, c.name FROM orders o JOIN customers c ON o.customer_id = c.id;",
          },
          {
            id: 'sql-left-right-join',
            code: "SELECT c.name, o.id AS order_id\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id;",
            note: "LEFT JOIN keeps every row from the left table, filling NULLs where the right has no match. RIGHT JOIN is the mirror; FULL JOIN keeps unmatched rows from both sides.",
            explanation: {
              heading: 'Preserving Rows with Outer Joins',
              intro: 'Outer joins keep unmatched rows from one or both tables, filling the missing side with NULLs.',
              points: [
                { term: 'LEFT JOIN', detail: 'It returns every row from the left table and pads the right side columns with NULL when there is no match.' },
                { term: 'RIGHT and FULL', detail: 'RIGHT JOIN mirrors LEFT for the right table, and FULL JOIN keeps unmatched rows from both sides.' },
                { term: 'Filter placement', detail: 'Putting a right-table condition in WHERE can turn a LEFT JOIN back into an inner join, so keep such conditions in the ON clause.' },
                { term: 'Detecting non matches', detail: 'A NULL in a right-side column after a LEFT JOIN signals that no matching row existed.' },
              ],
            },
            example: "SELECT * FROM a FULL OUTER JOIN b ON a.k = b.k;",
          },
          {
            id: 'sql-anti-join',
            code: "SELECT c.name\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id\nWHERE o.id IS NULL;",
            note: "An anti-join finds rows in one table with no match in another: LEFT JOIN then filter WHERE the right side IS NULL. Here it lists customers who have never placed an order.",
            explanation: {
              heading: 'Finding Non Matches with an Anti Join',
              intro: 'An anti-join returns rows from one table that have no corresponding row in another, answering questions like which records are missing a relationship.',
              points: [
                { term: 'The pattern', detail: 'Perform a LEFT JOIN and then keep only rows where a right-side column IS NULL, meaning no match was found.' },
                { term: 'Which column to test', detail: 'Test a column that can never be NULL in a real match, such as the right table primary key.' },
                { term: 'NOT EXISTS alternative', detail: 'NOT EXISTS expresses the same idea and is often clearer and safer around NULLs than NOT IN.' },
                { term: 'Use cases', detail: 'It finds orphans and gaps, like customers with no orders or products never sold.' },
              ],
            },
            example: "SELECT * FROM p LEFT JOIN oos ON oos.pid = p.id WHERE oos.pid IS NULL;",
          },
        ],
        children: [],
      },
      {
        id: 'sql-self-cross-joins',
        title: 'Self and Cross Joins',
        level: 2,
        slug: 'self-cross',
        concepts: [
          {
            id: 'sql-self-join',
            code: "SELECT e.name AS employee, m.name AS manager\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id;",
            note: "A self join joins a table to itself using two aliases, useful for hierarchical relationships like employee/manager.",
            explanation: {
              heading: 'Joining a Table to Itself',
              intro: 'A self join treats one table as two by giving it two aliases, letting you relate rows to other rows in the same table.',
              points: [
                { term: 'Two aliases', detail: 'Each reference needs its own alias so the ON clause can distinguish the two copies of the table.' },
                { term: 'Hierarchies', detail: 'It naturally models parent-child links like employee to manager stored in the same table.' },
                { term: 'Outer variant', detail: 'Use a LEFT self join when the related row may not exist, for example a top level employee with no manager.' },
                { term: 'Recursion limit', detail: 'A single self join reaches one level; walking arbitrary depth needs a recursive CTE instead.' },
              ],
            },
            example: "SELECT a.name, b.name FROM nodes a JOIN nodes b ON a.parent_id = b.id;",
          },
          {
            id: 'sql-cross-join',
            code: "SELECT s.size, c.color\nFROM sizes s\nCROSS JOIN colors c;",
            note: "CROSS JOIN produces the Cartesian product: every row of the first table paired with every row of the second. Use it deliberately for combinations.",
            explanation: {
              heading: 'Producing Combinations with CROSS JOIN',
              intro: 'A cross join pairs every row of one table with every row of another, yielding the Cartesian product with no join condition.',
              points: [
                { term: 'Row count', detail: 'The result size is the product of the two row counts, so small inputs can explode into huge outputs.' },
                { term: 'No ON clause', detail: 'Unlike other joins it has no matching condition; every pairing is produced.' },
                { term: 'Intentional use', detail: 'It is useful for generating grids like sizes crossed with colors or dates crossed with shifts.' },
                { term: 'Accidental cross joins', detail: 'A missing or wrong join condition can silently turn an inner join into a Cartesian product and blow up results.' },
              ],
            },
            example: "SELECT * FROM days CROSS JOIN shifts;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'sql-subqueries',
    title: 'Subqueries',
    level: 1,
    slug: 'subqueries',
    concepts: [],
    children: [
      {
        id: 'sql-subquery-types',
        title: 'Scalar, IN, and Correlated',
        level: 2,
        slug: 'subquery-types',
        concepts: [
          {
            id: 'sql-subquery-scalar',
            code: "SELECT name, salary\nFROM employees\nWHERE salary > (SELECT AVG(salary) FROM employees);",
            note: "A scalar subquery returns a single value usable in comparisons. A subquery in WHERE ... IN (...) tests membership against a result set.",
            explanation: {
              heading: 'Scalar and IN Subqueries',
              intro: 'A subquery is a query nested inside another; its shape determines where it can be used.',
              points: [
                { term: 'Scalar subquery', detail: 'When it returns exactly one row and one column it acts as a single value, usable anywhere an expression is allowed.' },
                { term: 'Too many rows', detail: 'A scalar subquery that returns more than one row raises an error, so constrain it to a single value.' },
                { term: 'IN subquery', detail: 'A subquery returning one column feeds an IN test, keeping outer rows whose value appears in that column.' },
                { term: 'NOT IN caution', detail: 'If the subquery can return NULL, NOT IN may unexpectedly yield no rows; prefer NOT EXISTS there.' },
              ],
            },
            example: "SELECT * FROM orders WHERE customer_id IN (SELECT id FROM vip_customers);",
          },
          {
            id: 'sql-subquery-correlated',
            code: "SELECT e.name\nFROM employees e\nWHERE EXISTS (\n  SELECT 1 FROM sales s WHERE s.employee_id = e.id\n);",
            note: "A correlated subquery references the outer query and re-evaluates per outer row. EXISTS returns true as soon as one matching row is found.",
            explanation: {
              heading: 'Correlated Subqueries and EXISTS',
              intro: 'A correlated subquery depends on a value from the outer query, so it is conceptually re-evaluated for each outer row.',
              points: [
                { term: 'Outer reference', detail: 'It mentions a column from the enclosing query, which links the inner result to the current outer row.' },
                { term: 'EXISTS short circuits', detail: 'EXISTS returns TRUE as soon as the subquery yields any row, so the select list inside is irrelevant and often just 1.' },
                { term: 'NOT EXISTS', detail: 'It is the standard, NULL-safe way to express an anti-join, keeping rows with no matching inner row.' },
                { term: 'Performance', detail: 'Optimizers frequently rewrite correlated EXISTS into a semi-join, so it need not be slow despite the per-row mental model.' },
              ],
            },
            example: "SELECT * FROM p WHERE NOT EXISTS (SELECT 1 FROM oos WHERE oos.pid = p.id);",
          },
          {
            id: 'sql-subquery-from',
            code: "SELECT dept, avg_sal\nFROM (\n  SELECT department AS dept, AVG(salary) AS avg_sal\n  FROM employees GROUP BY department\n) AS dept_avg\nWHERE avg_sal > 60000;",
            note: "A subquery in FROM (a derived table) is treated as a temporary table and must be aliased. It lets you filter or join on the result of an aggregation computed inline.",
            explanation: {
              heading: 'Derived Tables in the FROM Clause',
              intro: 'A subquery placed in FROM produces a temporary result set that the outer query can select from, filter, or join like any table.',
              points: [
                { term: 'Alias required', detail: 'A derived table must be given a name so the outer query can reference it and its columns.' },
                { term: 'Aggregate then filter', detail: 'It lets you compute an aggregate first and then filter or join on that result, which a flat query cannot do directly.' },
                { term: 'Scope', detail: 'A derived table exists only for the duration of the query and is not visible elsewhere.' },
                { term: 'CTE alternative', detail: 'A WITH clause expresses the same idea with better readability and the option to reuse the result.' },
              ],
            },
            example: "SELECT MAX(c) FROM (SELECT COUNT(*) c FROM t GROUP BY k) x;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'sql-set-operations',
    title: 'Set Operations',
    level: 1,
    slug: 'set-operations',
    concepts: [],
    children: [
      {
        id: 'sql-union-intersect-except',
        title: 'UNION, INTERSECT, EXCEPT',
        level: 2,
        slug: 'union-intersect-except',
        concepts: [
          {
            id: 'sql-union',
            code: "SELECT city FROM customers\nUNION\nSELECT city FROM suppliers;",
            note: "UNION combines two result sets and removes duplicates; UNION ALL keeps them and is faster. Both queries must have compatible column counts and types.",
            explanation: {
              heading: 'Stacking Result Sets with UNION',
              intro: 'UNION appends the rows of one query to another vertically, unlike a join which combines columns horizontally.',
              points: [
                { term: 'Compatible shape', detail: 'Both queries must have the same number of columns with matching data types in the same order.' },
                { term: 'UNION versus UNION ALL', detail: 'Plain UNION removes duplicate rows, while UNION ALL keeps every row and skips the deduplication cost.' },
                { term: 'Prefer ALL when safe', detail: 'When you know the inputs cannot overlap, UNION ALL avoids an unnecessary and expensive sort or hash.' },
                { term: 'Column names', detail: 'The output takes its column names from the first query in the union.' },
              ],
            },
            example: "SELECT id FROM a UNION ALL SELECT id FROM b;",
          },
          {
            id: 'sql-intersect-except',
            code: "SELECT id FROM active_users\nEXCEPT\nSELECT id FROM banned_users;",
            note: "INTERSECT returns rows present in both queries; EXCEPT (MINUS in some dialects) returns rows in the first query but not the second.",
            explanation: {
              heading: 'Set Difference and Intersection',
              intro: 'INTERSECT and EXCEPT compute the common and the leftover rows between two compatible result sets.',
              points: [
                { term: 'INTERSECT', detail: 'It returns only the rows that appear in both queries, giving the overlap of the two sets.' },
                { term: 'EXCEPT', detail: 'It returns rows from the first query that are absent from the second; some dialects call this MINUS.' },
                { term: 'Duplicate handling', detail: 'By default these operators treat inputs as sets and remove duplicates unless the ALL variant is used.' },
                { term: 'Order matters for EXCEPT', detail: 'Swapping the two queries in EXCEPT changes the result because it is directional.' },
              ],
            },
            example: "SELECT sku FROM warehouse_a INTERSECT SELECT sku FROM warehouse_b;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'sql-ddl',
    title: 'Data Definition (DDL)',
    level: 1,
    slug: 'ddl',
    concepts: [],
    children: [
      {
        id: 'sql-create-alter-drop',
        title: 'CREATE, ALTER, DROP',
        level: 2,
        slug: 'create-alter-drop',
        concepts: [
          {
            id: 'sql-create-table',
            code: "CREATE TABLE employees (\n  id INTEGER PRIMARY KEY,\n  name VARCHAR(100) NOT NULL,\n  dept_id INTEGER,\n  hire_date DATE DEFAULT CURRENT_DATE\n);",
            note: "CREATE TABLE defines a new table with columns, types, and inline constraints. DEFAULT supplies a value when none is given on insert.",
            explanation: {
              heading: 'Defining Tables with CREATE TABLE',
              intro: 'CREATE TABLE declares a new relation by listing its columns, their data types, and any constraints that guard the data.',
              points: [
                { term: 'Types matter', detail: 'Each column has a data type that constrains what it can store and how it sorts and compares.' },
                { term: 'Inline constraints', detail: 'PRIMARY KEY, NOT NULL, UNIQUE, and CHECK can be declared right on the column or as separate table constraints.' },
                { term: 'DEFAULT values', detail: 'A DEFAULT supplies a value automatically when an insert omits the column, for example CURRENT_DATE for a timestamp.' },
                { term: 'Idempotent creation', detail: 'IF NOT EXISTS avoids an error when the table is already present, useful in setup scripts.' },
              ],
            },
            example: "CREATE TABLE tags (id INT PRIMARY KEY, label TEXT UNIQUE);",
          },
          {
            id: 'sql-alter-drop',
            code: "ALTER TABLE employees ADD COLUMN email VARCHAR(255);\nALTER TABLE employees DROP COLUMN dept_id;\nDROP TABLE IF EXISTS temp_data;",
            note: "ALTER TABLE modifies existing structure (add/drop/rename columns). DROP TABLE removes it entirely; IF EXISTS avoids an error when the table is absent.",
            explanation: {
              heading: 'Changing and Removing Tables',
              intro: 'ALTER TABLE evolves an existing schema in place, while DROP TABLE deletes the table and all its data.',
              points: [
                { term: 'ALTER operations', detail: 'It can add, drop, rename, or retype columns and add or remove constraints on a live table.' },
                { term: 'DROP is destructive', detail: 'DROP TABLE permanently removes the definition and every row, so it should be used with care.' },
                { term: 'IF EXISTS', detail: 'Adding IF EXISTS makes DROP a no-op instead of an error when the table is not there.' },
                { term: 'Locking impact', detail: 'Some ALTER operations rewrite the table and hold locks, which can affect availability on large tables.' },
              ],
            },
            example: "ALTER TABLE users RENAME COLUMN uname TO username;",
          },
          {
            id: 'sql-truncate',
            code: "TRUNCATE TABLE staging;",
            note: "TRUNCATE removes all rows quickly by deallocating data pages, unlike DELETE which logs each row. It cannot use a WHERE clause and typically resets identity counters.",
            explanation: {
              heading: 'Emptying a Table with TRUNCATE',
              intro: 'TRUNCATE clears every row from a table in one fast, set-based operation rather than deleting rows individually.',
              points: [
                { term: 'Speed', detail: 'It deallocates data pages instead of logging each row, so it is far faster than DELETE on large tables.' },
                { term: 'No WHERE', detail: 'TRUNCATE always removes all rows and cannot target a subset, unlike DELETE with a filter.' },
                { term: 'Identity reset', detail: 'It typically resets auto increment or identity counters, whereas DELETE leaves them unchanged.' },
                { term: 'Constraints', detail: 'It may be blocked by foreign keys referencing the table and behaves differently across dialects regarding transactions.' },
              ],
            },
            example: "DELETE FROM staging;  -- slower, row-by-row, keeps identity",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'sql-dml',
    title: 'Data Manipulation (DML)',
    level: 1,
    slug: 'dml',
    concepts: [],
    children: [
      {
        id: 'sql-insert-update-delete',
        title: 'INSERT, UPDATE, DELETE',
        level: 2,
        slug: 'insert-update-delete',
        concepts: [
          {
            id: 'sql-insert',
            code: "INSERT INTO employees (name, dept_id)\nVALUES ('Ada Lovelace', 3),\n       ('Alan Turing', 3);",
            note: "INSERT adds rows. List target columns explicitly and provide matching VALUES; multiple value tuples insert several rows at once.",
            explanation: {
              heading: 'Adding Rows with INSERT',
              intro: 'INSERT writes new rows into a table, either from literal values or from the result of a query.',
              points: [
                { term: 'Name your columns', detail: 'Listing target columns explicitly makes the statement resilient to column additions or reordering.' },
                { term: 'Multi row inserts', detail: 'Providing several comma-separated value tuples inserts many rows in a single, efficient statement.' },
                { term: 'Insert from select', detail: 'INSERT INTO followed by a SELECT copies rows from another query, useful for archiving or seeding.' },
                { term: 'Defaults and omissions', detail: 'Omitted columns take their DEFAULT or NULL, so ensure required columns are supplied.' },
              ],
            },
            example: "INSERT INTO logs (msg) SELECT note FROM staging;",
          },
          {
            id: 'sql-update-delete',
            code: "UPDATE employees SET salary = salary * 1.1 WHERE dept_id = 3;\nDELETE FROM employees WHERE hire_date < '2000-01-01';",
            note: "UPDATE changes existing rows; DELETE removes them. Always include a WHERE clause unless you truly intend to affect every row.",
            explanation: {
              heading: 'Modifying and Removing Rows',
              intro: 'UPDATE changes values in existing rows and DELETE removes rows, and both are governed by their WHERE clause.',
              points: [
                { term: 'WHERE is critical', detail: 'Omitting WHERE makes UPDATE or DELETE affect every row in the table, which is rarely intended.' },
                { term: 'Expressions in SET', detail: 'UPDATE can compute new values from old ones, such as setting salary to salary times 1.1.' },
                { term: 'Preview first', detail: 'Running a SELECT with the same WHERE first shows exactly which rows will be changed.' },
                { term: 'Transactions', detail: 'Wrapping changes in a transaction lets you roll back if the affected row count looks wrong.' },
              ],
            },
            example: "DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP;",
          },
          {
            id: 'sql-merge',
            code: "MERGE INTO target t\nUSING source s ON t.id = s.id\nWHEN MATCHED THEN UPDATE SET t.val = s.val\nWHEN NOT MATCHED THEN INSERT (id, val) VALUES (s.id, s.val);",
            note: "The standard MERGE statement performs an upsert: it updates rows that match the ON condition and inserts those that do not, in a single set-based operation.",
            explanation: {
              heading: 'Upserting with MERGE',
              intro: 'MERGE combines insert, update, and sometimes delete into one statement driven by whether source rows match target rows.',
              points: [
                { term: 'Match logic', detail: 'The ON condition decides which source rows already exist in the target and which are new.' },
                { term: 'WHEN clauses', detail: 'WHEN MATCHED updates existing rows and WHEN NOT MATCHED inserts the new ones in a single pass.' },
                { term: 'Set based', detail: 'It processes many rows at once, which is cleaner and often faster than looping inserts and updates.' },
                { term: 'Dialect differences', detail: 'Some engines use INSERT with ON CONFLICT instead, and MERGE semantics can vary between databases.' },
              ],
            },
            example: "-- dialects vary: PostgreSQL/SQLite use INSERT ... ON CONFLICT",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'sql-constraints',
    title: 'Constraints',
    level: 1,
    slug: 'constraints',
    concepts: [],
    children: [
      {
        id: 'sql-key-constraints',
        title: 'Keys and Checks',
        level: 2,
        slug: 'keys-checks',
        concepts: [
          {
            id: 'sql-pk-fk',
            code: "CREATE TABLE orders (\n  id INTEGER PRIMARY KEY,\n  customer_id INTEGER NOT NULL,\n  FOREIGN KEY (customer_id) REFERENCES customers(id)\n);",
            note: "PRIMARY KEY uniquely identifies rows and forbids NULL. FOREIGN KEY enforces referential integrity by requiring a matching row in the referenced table.",
            explanation: {
              heading: 'Primary and Foreign Keys',
              intro: 'Keys are the constraints that give rows identity and tie related tables together reliably.',
              points: [
                { term: 'PRIMARY KEY', detail: 'It uniquely identifies each row, forbids NULL, and a table can have only one primary key.' },
                { term: 'FOREIGN KEY', detail: 'It requires each value to match an existing key in the referenced table, enforcing referential integrity.' },
                { term: 'Automatic index', detail: 'A primary key is backed by a unique index, which also speeds up lookups on that column.' },
                { term: 'Composite keys', detail: 'A key can span several columns, useful for junction tables where the pair is what must be unique.' },
              ],
            },
            example: "FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE CASCADE;",
          },
          {
            id: 'sql-unique-check',
            code: "CREATE TABLE accounts (\n  email VARCHAR(255) UNIQUE,\n  age INTEGER CHECK (age >= 0)\n);",
            note: "UNIQUE forbids duplicate values in a column. CHECK enforces a boolean condition on each row, rejecting inserts/updates that violate it.",
            explanation: {
              heading: 'Enforcing Rules with UNIQUE and CHECK',
              intro: 'UNIQUE and CHECK constraints keep bad data out by validating values before they are stored.',
              points: [
                { term: 'UNIQUE', detail: 'It forbids duplicate values in a column or combination of columns, guaranteeing distinct entries.' },
                { term: 'UNIQUE and NULL', detail: 'Most databases allow multiple NULLs in a unique column because NULLs are not considered equal.' },
                { term: 'CHECK', detail: 'It validates a boolean condition per row and rejects any insert or update that makes it false.' },
                { term: 'Named constraints', detail: 'Naming a constraint gives clearer error messages and makes it easy to drop later.' },
              ],
            },
            example: "ALTER TABLE p ADD CONSTRAINT chk_price CHECK (price > 0);",
          },
          {
            id: 'sql-fk-actions',
            code: "CREATE TABLE order_items (\n  order_id INT REFERENCES orders(id) ON DELETE CASCADE,\n  product_id INT REFERENCES products(id) ON DELETE RESTRICT\n);",
            note: "Referential actions control what happens when a parent row is removed: CASCADE deletes children, RESTRICT/NO ACTION blocks the delete, and SET NULL clears the child's foreign key.",
            explanation: {
              heading: 'Referential Actions on Foreign Keys',
              intro: 'ON DELETE and ON UPDATE actions tell the database what to do to child rows when a referenced parent row changes or disappears.',
              points: [
                { term: 'CASCADE', detail: 'It propagates the change, so deleting a parent also deletes its child rows automatically.' },
                { term: 'RESTRICT and NO ACTION', detail: 'They block the parent operation while dependent child rows still exist.' },
                { term: 'SET NULL', detail: 'It clears the child foreign key to NULL, which requires that the column allows NULL.' },
                { term: 'Choose deliberately', detail: 'CASCADE is convenient but can delete more than expected, so pick the action that matches your data lifecycle.' },
              ],
            },
            example: "FOREIGN KEY (cat_id) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE SET NULL;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'sql-indexes-views',
    title: 'Indexes and Views',
    level: 1,
    slug: 'indexes-views',
    concepts: [],
    children: [
      {
        id: 'sql-indexes',
        title: 'Indexes',
        level: 2,
        slug: 'indexes',
        concepts: [
          {
            id: 'sql-create-index',
            code: "CREATE INDEX idx_emp_dept ON employees(dept_id);\nCREATE UNIQUE INDEX idx_email ON users(email);",
            note: "Indexes speed up lookups and joins at the cost of extra storage and slower writes. Composite indexes follow a leftmost-prefix rule for the columns listed.",
            explanation: {
              heading: 'Creating Indexes',
              intro: 'An index is an auxiliary data structure that lets the database find rows without scanning the whole table.',
              points: [
                { term: 'Speeds reads', detail: 'Indexes accelerate lookups, joins, and sorts on the indexed columns by avoiding full table scans.' },
                { term: 'Composite prefix', detail: 'A multi column index helps queries that filter on a leftmost prefix of its columns, not any arbitrary subset.' },
                { term: 'Unique index', detail: 'A unique index also enforces uniqueness while providing the same lookup speedup.' },
                { term: 'Selectivity', detail: 'Indexes help most on selective, high-cardinality columns; indexing a low-variety column often gives little benefit.' },
              ],
            },
            example: "CREATE INDEX idx_name ON customers(last_name, first_name);",
          },
          {
            id: 'sql-index-tradeoffs',
            code: "-- helps reads:\nSELECT * FROM orders WHERE customer_id = 5;\n-- but every INSERT/UPDATE must maintain the index\nCREATE INDEX idx_cust ON orders(customer_id);",
            note: "Each index accelerates matching queries but adds write and storage overhead, so index the columns you actually filter, join, or sort on rather than every column. Composite order matters.",
            explanation: {
              heading: 'The Tradeoffs of Indexing',
              intro: 'Indexes are not free; every one you add speeds some reads while slowing writes and consuming space.',
              points: [
                { term: 'Write cost', detail: 'Every insert, update, or delete must maintain each affected index, so extra indexes slow down writes.' },
                { term: 'Storage', detail: 'Indexes occupy disk and memory, sometimes rivaling the size of the table itself.' },
                { term: 'Index what you query', detail: 'Add indexes for the columns you actually filter, join, or sort on rather than indexing everything.' },
                { term: 'Prune the unused', detail: 'Dropping indexes that queries never use reclaims space and removes write overhead.' },
              ],
            },
            example: "DROP INDEX idx_cust;  -- remove unused indexes",
          },
        ],
        children: [],
      },
      {
        id: 'sql-views',
        title: 'Views',
        level: 2,
        slug: 'views',
        concepts: [
          {
            id: 'sql-create-view',
            code: "CREATE VIEW active_employees AS\nSELECT id, name, dept_id\nFROM employees\nWHERE status = 'active';",
            note: "A view is a stored named query that behaves like a virtual table. It simplifies complex queries and can restrict which columns/rows callers see.",
            explanation: {
              heading: 'Virtual Tables with Views',
              intro: 'A view stores a query under a name so it can be selected from like a table, without storing any data itself.',
              points: [
                { term: 'Always current', detail: 'A view re-runs its underlying query each time it is used, so it always reflects the latest base data.' },
                { term: 'Simplifies access', detail: 'It hides complex joins and calculations behind a simple name that callers can query easily.' },
                { term: 'Security layer', detail: 'Exposing only certain columns or filtered rows through a view restricts what consumers can see.' },
                { term: 'Updatability limits', detail: 'Simple views may be updatable, but those with joins, aggregates, or DISTINCT usually are not.' },
              ],
            },
            example: "SELECT * FROM active_employees WHERE dept_id = 3;",
          },
          {
            id: 'sql-materialized-view',
            code: "CREATE MATERIALIZED VIEW monthly_sales AS\nSELECT month, SUM(total) AS revenue FROM orders GROUP BY month;",
            note: "A materialized view stores the query's result physically for fast reads and must be refreshed when the underlying data changes, trading freshness for speed on expensive aggregations.",
            explanation: {
              heading: 'Precomputed Results with Materialized Views',
              intro: 'Unlike a plain view, a materialized view stores its query result on disk so reads are fast, at the cost of freshness.',
              points: [
                { term: 'Stored result', detail: 'The computed rows are physically saved, so querying it does not re-run the expensive underlying query.' },
                { term: 'Needs refreshing', detail: 'Because the data is a snapshot, it must be refreshed to pick up changes in the base tables.' },
                { term: 'Freshness tradeoff', detail: 'You trade up-to-date results for speed, which suits heavy aggregations that change infrequently.' },
                { term: 'Refresh strategies', detail: 'Refreshes can be manual or scheduled, and some engines support concurrent refresh to avoid blocking readers.' },
              ],
            },
            example: "REFRESH MATERIALIZED VIEW monthly_sales;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'sql-window-functions',
    title: 'Window Functions',
    level: 1,
    slug: 'window-functions',
    concepts: [],
    children: [
      {
        id: 'sql-window-basics',
        title: 'OVER, PARTITION, Ranking',
        level: 2,
        slug: 'window-basics',
        concepts: [
          {
            id: 'sql-window-rownumber',
            code: "SELECT name, department, salary,\n  ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn\nFROM employees;",
            note: "Window functions compute across a set of rows related to the current row without collapsing them. PARTITION BY groups; ORDER BY defines the ordering within each partition.",
            explanation: {
              heading: 'Row Aware Calculations with Window Functions',
              intro: 'A window function computes a value over a set of rows related to the current row while still returning every individual row.',
              points: [
                { term: 'Rows preserved', detail: 'Unlike GROUP BY aggregates, window functions do not collapse rows, so each input row keeps its output.' },
                { term: 'PARTITION BY', detail: 'It divides rows into independent groups, restarting the calculation for each partition.' },
                { term: 'ORDER BY in OVER', detail: 'Ordering within the window defines the sequence for ranking and running calculations.' },
                { term: 'Ranking functions', detail: 'ROW_NUMBER assigns unique positions, while RANK and DENSE_RANK handle ties differently.' },
              ],
            },
            example: "SELECT *, RANK() OVER (ORDER BY score DESC) FROM results;",
          },
          {
            id: 'sql-window-lag-lead',
            code: "SELECT month, revenue,\n  LAG(revenue) OVER (ORDER BY month) AS prev_month\nFROM monthly_sales;",
            note: "LAG / LEAD access a prior or following row's value within the window, ideal for period-over-period comparisons without a self join.",
            explanation: {
              heading: 'Looking at Neighboring Rows with LAG and LEAD',
              intro: 'LAG and LEAD reach into earlier or later rows of the ordered window, making period-over-period math simple.',
              points: [
                { term: 'LAG', detail: 'It returns a value from a preceding row, for example last month revenue alongside this month.' },
                { term: 'LEAD', detail: 'It returns a value from a following row, useful for comparing to the next period.' },
                { term: 'Offset and default', detail: 'Both accept an offset for how many rows to look and a default value to use when there is no such row.' },
                { term: 'No self join', detail: 'They replace the awkward self join that would otherwise be needed to line up adjacent rows.' },
              ],
            },
            example: "SELECT day, temp - LAG(temp) OVER (ORDER BY day) AS delta FROM weather;",
          },
          {
            id: 'sql-window-frames',
            code: "SELECT day, amount,\n  SUM(amount) OVER (\n    ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW\n  ) AS rolling_7day\nFROM sales;",
            note: "A frame clause (ROWS/RANGE BETWEEN ...) limits which rows an aggregate window function sees, enabling moving averages and running totals over a sliding window.",
            explanation: {
              heading: 'Sliding Windows with Frame Clauses',
              intro: 'A frame clause narrows a window to a moving range of rows around the current row, powering running totals and moving averages.',
              points: [
                { term: 'ROWS versus RANGE', detail: 'ROWS counts a fixed number of physical rows while RANGE groups rows with equal ordering values as peers.' },
                { term: 'Frame bounds', detail: 'Bounds like 6 PRECEDING and CURRENT ROW define the window edges for each row.' },
                { term: 'Running versus moving', detail: 'An unbounded start gives a running total, while a fixed-size frame gives a moving average.' },
                { term: 'Default frame', detail: 'When ORDER BY is present without an explicit frame, the default often runs from the start to the current row, which can surprise you.' },
              ],
            },
            example: "AVG(x) OVER (ORDER BY d ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'sql-ctes',
    title: 'CTEs and Recursion',
    level: 1,
    slug: 'ctes',
    concepts: [],
    children: [
      {
        id: 'sql-cte-basics',
        title: 'WITH and Recursive CTEs',
        level: 2,
        slug: 'cte-basics',
        concepts: [
          {
            id: 'sql-cte-basic',
            code: "WITH active_users AS (\n  SELECT * FROM users WHERE status = 'active'\n)\nSELECT department, COUNT(*)\nFROM active_users\nGROUP BY department;",
            note: "A Common Table Expression (CTE) defines a named temporary result set with WITH, improving readability and letting you reference it multiple times in one query.",
            explanation: {
              heading: 'Naming Subqueries with CTEs',
              intro: 'A common table expression uses WITH to name a query block that the main query can then reference by name.',
              points: [
                { term: 'Readability', detail: 'It breaks a complex query into named, top-to-bottom steps that read like a pipeline.' },
                { term: 'Reuse', detail: 'A CTE can be referenced multiple times in the same query without repeating its definition.' },
                { term: 'Scope', detail: 'The name exists only for the single statement that defines it and disappears afterward.' },
                { term: 'Optimizer note', detail: 'Depending on the engine a CTE may be inlined or materialized, which can affect performance.' },
              ],
            },
            example: "WITH t AS (SELECT 1 AS n) SELECT n FROM t;",
          },
          {
            id: 'sql-cte-recursive',
            code: "WITH RECURSIVE org AS (\n  SELECT id, name, manager_id FROM employees WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.id, e.name, e.manager_id\n  FROM employees e JOIN org o ON e.manager_id = o.id\n)\nSELECT * FROM org;",
            note: "A recursive CTE has an anchor member and a recursive member joined by UNION ALL, walking hierarchical or graph data such as org charts or trees.",
            explanation: {
              heading: 'Walking Hierarchies with Recursive CTEs',
              intro: 'A recursive CTE repeatedly feeds its own output back into itself, letting SQL traverse trees and graphs of unknown depth.',
              points: [
                { term: 'Anchor member', detail: 'The first query provides the starting rows, such as the top of an org chart with no manager.' },
                { term: 'Recursive member', detail: 'The second query joins back to the CTE, and UNION ALL appends each new level until no rows are produced.' },
                { term: 'Termination', detail: 'It must eventually return no new rows, or the recursion runs away; a depth counter or condition guards against cycles.' },
                { term: 'Use cases', detail: 'It handles org charts, bill of materials, folder trees, and number or date series generation.' },
              ],
            },
            example: "WITH RECURSIVE nums(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM nums WHERE n < 10) SELECT * FROM nums;",
          },
          {
            id: 'sql-cte-multiple',
            code: "WITH paid AS (\n  SELECT * FROM orders WHERE status = 'paid'\n),\nbig AS (\n  SELECT customer_id FROM paid GROUP BY customer_id HAVING SUM(total) > 1000\n)\nSELECT * FROM big;",
            note: "One WITH clause can define several comma-separated CTEs, and later CTEs may reference earlier ones. This lets you build a query as a readable pipeline of named steps.",
            explanation: {
              heading: 'Chaining Multiple CTEs',
              intro: 'A single WITH clause can hold several named subqueries, letting you compose a complex query as a sequence of readable, self contained steps.',
              points: [
                { term: 'Comma separated', detail: 'List each CTE after the WITH keyword separated by commas, and only the final SELECT consumes them.' },
                { term: 'Reference earlier ones', detail: 'A later CTE may select from any CTE defined before it, forming a pipeline of named steps.' },
                { term: 'Readability', detail: 'Naming each stage makes intent clear and avoids deeply nested subqueries that are hard to follow.' },
                { term: 'Scope', detail: 'The CTE names exist only within the statement and vanish once the query finishes.' },
              ],
            },
            example: "WITH a AS (...), b AS (SELECT * FROM a) SELECT * FROM b;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'sql-transactions',
    title: 'Transactions',
    level: 1,
    slug: 'transactions',
    concepts: [],
    children: [
      {
        id: 'sql-acid',
        title: 'ACID and Isolation Levels',
        level: 2,
        slug: 'acid',
        concepts: [
          {
            id: 'sql-transaction-basic',
            code: "BEGIN TRANSACTION;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;",
            note: "Transactions guarantee Atomicity, Consistency, Isolation, and Durability (ACID). Wrap related changes so they all succeed or all roll back together.",
            explanation: {
              heading: 'Grouping Work with Transactions',
              intro: 'A transaction bundles several statements into one unit that either fully commits or fully rolls back, which is the foundation of the ACID guarantees.',
              points: [
                { term: 'Atomicity', detail: 'All statements between BEGIN and COMMIT succeed together, or a rollback undoes every one of them.' },
                { term: 'Consistency', detail: 'A committed transaction moves the database from one valid state to another, respecting every constraint.' },
                { term: 'Isolation', detail: 'Concurrent transactions do not see each other partial work, as governed by the isolation level.' },
                { term: 'Durability', detail: 'Once a transaction commits, its effects survive crashes and power loss because they are written to durable storage.' },
              ],
            },
            example: "BEGIN; DELETE FROM cart WHERE user_id = 5; ROLLBACK;",
          },
          {
            id: 'sql-isolation-levels',
            code: "SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;",
            note: "Isolation levels (READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE) trade concurrency for consistency, controlling dirty/non-repeatable/phantom reads.",
            explanation: {
              heading: 'Trading Concurrency for Consistency',
              intro: 'The isolation level decides which concurrency anomalies a transaction may observe, letting you balance strictness against throughput.',
              points: [
                { term: 'READ UNCOMMITTED', detail: 'The weakest level allows dirty reads, meaning a transaction can see changes another has not yet committed.' },
                { term: 'READ COMMITTED', detail: 'It prevents dirty reads but still allows non-repeatable reads where the same row can change between two reads.' },
                { term: 'REPEATABLE READ', detail: 'It keeps read rows stable within the transaction but may still allow phantom rows to appear in a re-run range query.' },
                { term: 'SERIALIZABLE', detail: 'The strictest level makes transactions behave as if they ran one after another, preventing all these anomalies at some cost to concurrency.' },
              ],
            },
            example: "SET TRANSACTION ISOLATION LEVEL READ COMMITTED;",
          },
          {
            id: 'sql-savepoints',
            code: "BEGIN;\nINSERT INTO log(msg) VALUES ('a');\nSAVEPOINT sp1;\nINSERT INTO log(msg) VALUES ('b');\nROLLBACK TO sp1;  -- undoes 'b', keeps 'a'\nCOMMIT;",
            note: "SAVEPOINT marks a checkpoint inside a transaction; ROLLBACK TO rewinds to it without aborting the whole transaction, enabling partial recovery within a larger unit of work.",
            explanation: {
              heading: 'Partial Rollback with Savepoints',
              intro: 'A savepoint is a named checkpoint inside a transaction that you can roll back to without discarding all the work done so far.',
              points: [
                { term: 'Named checkpoint', detail: 'SAVEPOINT records the current state under a name so you can return to it later in the same transaction.' },
                { term: 'ROLLBACK TO', detail: 'It undoes everything after the savepoint while keeping earlier changes and the transaction still open.' },
                { term: 'RELEASE', detail: 'Releasing a savepoint discards the marker when you no longer need it, without undoing any work.' },
                { term: 'Nested logic', detail: 'Savepoints let you retry or abandon a risky sub-step inside a larger unit of work rather than restarting everything.' },
              ],
            },
            example: "RELEASE SAVEPOINT sp1;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'sql-functions',
    title: 'Built-in Functions',
    level: 1,
    slug: 'functions',
    concepts: [],
    children: [
      {
        id: 'sql-string-functions',
        title: 'String and Date Functions',
        level: 2,
        slug: 'string-date',
        concepts: [
          {
            id: 'sql-string-fns',
            code: "SELECT UPPER(name),\n       LENGTH(name),\n       SUBSTRING(name FROM 1 FOR 3),\n       name || ' (' || department || ')' AS label\nFROM employees;",
            note: "Standard string functions include UPPER/LOWER, LENGTH, TRIM, and SUBSTRING. The || operator concatenates strings in standard SQL.",
            explanation: {
              heading: 'Manipulating Text with String Functions',
              intro: 'SQL provides a set of standard functions for changing case, measuring length, trimming, extracting, and joining text values.',
              points: [
                { term: 'Case and length', detail: 'UPPER and LOWER change case while LENGTH reports the number of characters in a string.' },
                { term: 'TRIM', detail: 'TRIM strips leading, trailing, or both kinds of unwanted characters, most often spaces around user input.' },
                { term: 'SUBSTRING', detail: 'SUBSTRING extracts a portion of a string given a starting position and an optional length.' },
                { term: 'Concatenation', detail: 'The double pipe operator joins strings in standard SQL, though some dialects also offer a CONCAT function.' },
              ],
            },
            example: "SELECT TRIM(BOTH ' ' FROM raw_input) FROM staging;",
          },
          {
            id: 'sql-date-fns',
            code: "SELECT CURRENT_DATE,\n       EXTRACT(YEAR FROM hire_date) AS hire_year,\n       hire_date + INTERVAL '30' DAY AS review_date\nFROM employees;",
            note: "Date/time functions include CURRENT_DATE / CURRENT_TIMESTAMP, EXTRACT for parts, and INTERVAL arithmetic for adding or subtracting durations.",
            explanation: {
              heading: 'Working with Dates and Times',
              intro: 'Standard SQL offers functions to read the current moment, pull out parts of a date, and shift dates by durations.',
              points: [
                { term: 'Current moment', detail: 'CURRENT_DATE returns today, and CURRENT_TIMESTAMP returns the current date and time when the query runs.' },
                { term: 'EXTRACT', detail: 'EXTRACT pulls a single field such as the year, month, or day out of a date or timestamp value.' },
                { term: 'INTERVAL arithmetic', detail: 'Adding or subtracting an INTERVAL shifts a date by a duration, for example thirty days ahead of a hire date.' },
                { term: 'Dialect variation', detail: 'Exact function names and formatting differ across databases, so consult the target engine for portability.' },
              ],
            },
            example: "SELECT EXTRACT(MONTH FROM order_date) FROM orders;",
          },
        ],
        children: [],
      },
      {
        id: 'sql-case-expression',
        title: 'CASE Expressions',
        level: 2,
        slug: 'case',
        concepts: [
          {
            id: 'sql-case-basic',
            code: "SELECT name,\n  CASE\n    WHEN salary >= 100000 THEN 'high'\n    WHEN salary >= 50000 THEN 'medium'\n    ELSE 'low'\n  END AS salary_band\nFROM employees;",
            note: "CASE is SQL's conditional expression, returning a value based on the first matching WHEN. Use it for derived categories, conditional aggregation, and inline branching.",
            explanation: {
              heading: 'Conditional Logic with CASE',
              intro: 'CASE is the SQL conditional expression that returns a value based on the first branch whose condition holds true.',
              points: [
                { term: 'First match wins', detail: 'CASE evaluates each WHEN in order and returns the result of the first one that is true.' },
                { term: 'ELSE default', detail: 'An optional ELSE supplies a fallback value, and without it a non-matching row yields NULL.' },
                { term: 'Searched and simple forms', detail: 'The searched form tests a boolean per WHEN, while the simple form compares one expression against several values.' },
                { term: 'An expression', detail: 'Because CASE returns a value, it can appear in SELECT, WHERE, ORDER BY, and inside aggregate functions.' },
              ],
            },
            example: "SELECT SUM(CASE WHEN status='paid' THEN total ELSE 0 END) FROM orders;",
          },
          {
            id: 'sql-pivot-case',
            code: "SELECT product,\n  SUM(CASE WHEN quarter = 'Q1' THEN revenue END) AS q1,\n  SUM(CASE WHEN quarter = 'Q2' THEN revenue END) AS q2\nFROM sales\nGROUP BY product;",
            note: "Wrapping CASE inside an aggregate rotates rows into columns (a manual pivot). Each CASE isolates the value for one category and the aggregate collapses it per group.",
            explanation: {
              heading: 'Pivoting Rows into Columns',
              intro: 'Placing a CASE inside an aggregate turns distinct row values into separate columns, a portable way to pivot without a dedicated PIVOT clause.',
              points: [
                { term: 'One column per category', detail: 'Each aggregated CASE captures values for a single category, becoming its own column in the output.' },
                { term: 'Aggregate collapses', detail: 'GROUP BY collapses the many rows per group, and each CASE contributes that group value for its category.' },
                { term: 'NULL for non matches', detail: 'When a CASE has no ELSE, non-matching rows produce NULL, which SUM and COUNT simply ignore.' },
                { term: 'Portable pivot', detail: 'This pattern works in any dialect, unlike the proprietary PIVOT keyword found only in some databases.' },
              ],
            },
            example: "COUNT(CASE WHEN active THEN 1 END) AS active_count",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'sql-normalization',
    title: 'Normalization and Design',
    level: 1,
    slug: 'normalization',
    concepts: [],
    children: [
      {
        id: 'sql-normal-forms',
        title: 'Normal Forms',
        level: 2,
        slug: 'normal-forms',
        concepts: [
          {
            id: 'sql-normalization-basic',
            code: "-- Unnormalized: orders(id, customer_name, item1, item2, item3)\n-- Normalized:\nCREATE TABLE customers (id INT PRIMARY KEY, name VARCHAR(100));\nCREATE TABLE orders (id INT PRIMARY KEY, customer_id INT REFERENCES customers(id));\nCREATE TABLE order_items (order_id INT, product_id INT, qty INT);",
            note: "Normalization removes redundancy by splitting data into related tables. 1NF removes repeating groups, 2NF removes partial dependencies, 3NF removes transitive dependencies.",
            explanation: {
              heading: 'Reducing Redundancy with Normal Forms',
              intro: 'Normalization organizes data into related tables so each fact is stored once, which reduces redundancy and prevents update anomalies.',
              points: [
                { term: 'First normal form', detail: 'It removes repeating groups so each column holds a single atomic value and each row is unique.' },
                { term: 'Second normal form', detail: 'It removes partial dependencies, meaning every non-key column depends on the whole composite key, not just part of it.' },
                { term: 'Third normal form', detail: 'It removes transitive dependencies so non-key columns depend only on the key and not on other non-key columns.' },
                { term: 'Anomaly prevention', detail: 'Storing each fact once avoids insert, update, and delete anomalies that redundant data would cause.' },
              ],
            },
            example: "-- One fact stored once; relationships expressed via foreign keys.",
          },
          {
            id: 'sql-denormalization',
            code: "-- Deliberately store a derived/duplicated value for read speed\nALTER TABLE orders ADD COLUMN item_count INT;\nUPDATE orders o\nSET item_count = (SELECT COUNT(*) FROM order_items WHERE order_id = o.id);",
            note: "Denormalization intentionally reintroduces redundancy (cached counts, duplicated columns) to speed reads on hot paths. It trades write complexity and consistency risk for query performance.",
            explanation: {
              heading: 'Trading Purity for Read Speed',
              intro: 'Denormalization deliberately reintroduces redundancy to make reads faster, accepting more complex writes in exchange for query performance.',
              points: [
                { term: 'Cached values', detail: 'Storing a precomputed count or duplicated column avoids recomputing it on every read of a hot path.' },
                { term: 'Fewer joins', detail: 'Duplicating a related value into a table can remove a join, which speeds up frequent read queries.' },
                { term: 'Consistency risk', detail: 'The duplicated data can drift out of sync, so writes must update every copy to keep it correct.' },
                { term: 'A deliberate tradeoff', detail: 'Apply it only where measured read pressure justifies the added write complexity, not as a default.' },
              ],
            },
            example: "-- keep the cached value in sync with triggers or app logic",
          },
        ],
        children: [],
      },
      {
        id: 'sql-relationships',
        title: 'Relationships and Junction Tables',
        level: 2,
        slug: 'relationships',
        concepts: [
          {
            id: 'sql-many-to-many',
            code: "CREATE TABLE students (id INT PRIMARY KEY, name TEXT);\nCREATE TABLE courses (id INT PRIMARY KEY, title TEXT);\nCREATE TABLE enrollments (\n  student_id INT REFERENCES students(id),\n  course_id  INT REFERENCES courses(id),\n  PRIMARY KEY (student_id, course_id)\n);",
            note: "A many-to-many relationship is modeled with a junction (join) table holding foreign keys to both sides. A composite primary key on those keys prevents duplicate pairings.",
            explanation: {
              heading: 'Modeling Many to Many Links',
              intro: 'A many-to-many relationship cannot live in either table directly, so a junction table records each pairing between the two sides.',
              points: [
                { term: 'Junction table', detail: 'A separate table holds a foreign key to each side, with one row per relationship between them.' },
                { term: 'Composite primary key', detail: 'Making the pair of foreign keys the primary key ensures each pairing appears at most once.' },
                { term: 'Extra attributes', detail: 'The junction table can carry data about the relationship itself, such as an enrollment date or a role.' },
                { term: 'Query through the middle', detail: 'You join from one side through the junction table to reach the other side of the relationship.' },
              ],
            },
            example: "SELECT c.title FROM courses c JOIN enrollments e ON e.course_id = c.id WHERE e.student_id = 1;",
          },
          {
            id: 'sql-one-to-many',
            code: "CREATE TABLE authors (id INT PRIMARY KEY, name TEXT);\nCREATE TABLE books (\n  id INT PRIMARY KEY,\n  title TEXT,\n  author_id INT REFERENCES authors(id)\n);",
            note: "A one-to-many relationship puts the foreign key on the 'many' side: many books reference one author. The FK column lives in the child table and points to the parent's primary key.",
            explanation: {
              heading: 'Modeling One to Many Links',
              intro: 'A one-to-many relationship connects a single parent row to many child rows by placing the foreign key on the child, or many, side.',
              points: [
                { term: 'Foreign key on the many side', detail: 'The child table carries a foreign key pointing to the parent primary key, so many books can reference one author.' },
                { term: 'Parent stays clean', detail: 'The parent table needs no list of children because each child points back to its parent instead.' },
                { term: 'Optional or required', detail: 'Allowing NULL in the foreign key makes the parent optional, while NOT NULL forces every child to have a parent.' },
                { term: 'Query direction', detail: 'Filter the child table by the foreign key to fetch all children of a given parent row.' },
              ],
            },
            example: "SELECT * FROM books WHERE author_id = 1;",
          },
        ],
        children: [],
      },
    ],
  },
];

export default topics;
