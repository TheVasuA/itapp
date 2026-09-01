// PostgreSQL topic tree.

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  {
    id: 'pg-data-types',
    title: 'Data Types',
    level: 1,
    slug: 'data-types',
    concepts: [],
    children: [
      {
        id: 'pg-core-types',
        title: 'Core and Custom Types',
        level: 2,
        slug: 'core-types',
        concepts: [
          {
            id: 'pg-numeric-text',
            code: "CREATE TABLE items (\n  id INTEGER,\n  price NUMERIC(10,2),\n  name TEXT,\n  active BOOLEAN DEFAULT true\n);",
            note: "PostgreSQL has rich built-in types: NUMERIC for exact decimals, TEXT for unbounded strings, BOOLEAN, UUID, INET, and more. TEXT and VARCHAR perform identically.",
            explanation: {
              heading: 'Rich built-in type system',
              intro: 'PostgreSQL ships with a broad catalog of first-class types, so you rarely need to overload strings to model your data.',
              points: [
                { term: 'NUMERIC for money', detail: 'NUMERIC stores exact decimal values with no floating-point rounding, making it the right choice for currency and precise measurements.' },
                { term: 'TEXT versus VARCHAR', detail: 'TEXT and VARCHAR are stored the same way and perform identically, so prefer TEXT unless you need an enforced length limit.' },
                { term: 'Specialized types', detail: 'UUID, INET, CIDR, and MACADDR validate and store domain-specific values with built-in operators instead of generic strings.' },
                { term: 'BOOLEAN is real', detail: 'PostgreSQL has a native three-valued BOOLEAN type that accepts true, false, and NULL rather than emulating it with an integer.' },
              ],
            },
            example: "CREATE TABLE t (id UUID DEFAULT gen_random_uuid());",
          },
          {
            id: 'pg-enum-domain',
            code: "CREATE TYPE mood AS ENUM ('happy', 'sad', 'neutral');\nCREATE DOMAIN positive_int AS INTEGER CHECK (VALUE > 0);",
            note: "Custom ENUM types constrain a column to a fixed ordered set of labels. DOMAINs wrap a base type with reusable constraints applied everywhere the domain is used.",
            explanation: {
              heading: 'ENUM and DOMAIN custom types',
              intro: 'Custom types let you push validation into the schema so invalid data cannot be stored in the first place.',
              points: [
                { term: 'Ordered ENUM labels', detail: 'An ENUM defines a fixed set of labels that sort in declaration order, so ORDER BY on the column follows the order you listed.' },
                { term: 'Reusable DOMAIN checks', detail: 'A DOMAIN attaches CHECK constraints and defaults to a base type once, and every column using the domain inherits those rules.' },
                { term: 'Altering ENUMs', detail: 'You can add new labels with ALTER TYPE ... ADD VALUE, but removing or reordering labels requires recreating the type.' },
                { term: 'Central validation', detail: 'Both keep constraint logic in one place, which is easier to maintain than repeating CHECK clauses on many tables.' },
              ],
            },
            example: "CREATE TABLE survey (feeling mood, score positive_int);",
          },
          {
            id: 'pg-range-types',
            code: "CREATE TABLE reservations (\n  room INT,\n  during TSRANGE,\n  EXCLUDE USING GIST (room WITH =, during WITH &&)\n);",
            note: "Range types like INT4RANGE and TSRANGE store an interval as one value. Combined with an EXCLUDE constraint they can prevent overlapping bookings declaratively.",
            explanation: {
              heading: 'Range types and exclusion',
              intro: 'Range types model an interval as a single value with inclusive or exclusive bounds, unlocking powerful containment and overlap logic.',
              points: [
                { term: 'One value, two bounds', detail: 'A range packs a lower and upper bound plus their inclusivity into one column, so INT4RANGE or TSRANGE replaces a pair of columns.' },
                { term: 'Overlap operator', detail: 'The ampersand-ampersand operator tests whether two ranges overlap, and the at-greater-than operator tests containment of a point or sub-range.' },
                { term: 'EXCLUDE constraints', detail: 'An EXCLUDE USING GIST constraint can forbid overlapping ranges per key, preventing double bookings without application-side checks.' },
                { term: 'GiST backing', detail: 'Range overlap and exclusion constraints rely on a GiST index, which PostgreSQL builds to enforce them efficiently.' },
              ],
            },
            example: "SELECT '[2024-01-01,2024-01-10)'::daterange @> '2024-01-05'::date;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'pg-serial-identity',
    title: 'SERIAL and IDENTITY',
    level: 1,
    slug: 'serial-identity',
    concepts: [],
    children: [
      {
        id: 'pg-auto-keys',
        title: 'Auto-Generated Keys',
        level: 2,
        slug: 'auto-keys',
        concepts: [
          {
            id: 'pg-identity',
            code: "CREATE TABLE users (\n  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  email TEXT NOT NULL\n);",
            note: "GENERATED ... AS IDENTITY is the SQL-standard way to auto-number rows and is preferred over the older SERIAL pseudo-type, which creates a backing sequence.",
            explanation: {
              heading: 'IDENTITY over SERIAL',
              intro: 'IDENTITY columns are the modern, standards-based way to auto-number rows and avoid several sharp edges of the legacy SERIAL type.',
              points: [
                { term: 'ALWAYS versus BY DEFAULT', detail: 'GENERATED ALWAYS blocks manual inserts into the key unless you use OVERRIDING SYSTEM VALUE, while BY DEFAULT lets callers supply their own value.' },
                { term: 'Cleaner ownership', detail: 'IDENTITY manages its underlying sequence internally, so dropping the table removes the sequence without the ownership quirks SERIAL could leave behind.' },
                { term: 'SERIAL is sugar', detail: 'SERIAL is a shorthand that creates an integer column, a sequence, and a default, but it does not restrict manual inserts the way IDENTITY can.' },
                { term: 'Pick the width', detail: 'Use BIGINT identity for tables expected to exceed two billion rows so the key does not overflow.' },
              ],
            },
            example: "CREATE TABLE t (id BIGINT GENERATED BY DEFAULT AS IDENTITY);",
          },
          {
            id: 'pg-sequences',
            code: "CREATE SEQUENCE order_no START 1000;\nSELECT nextval('order_no'), currval('order_no');\nALTER SEQUENCE order_no RESTART WITH 5000;",
            note: "Sequences are standalone number generators. nextval advances and returns the next value, currval returns the last value in this session, and setval/RESTART reset the counter.",
            explanation: {
              heading: 'Sequence generators',
              intro: 'Sequences are independent counter objects that hand out unique numbers, and they underpin both SERIAL and IDENTITY columns.',
              points: [
                { term: 'nextval advances', detail: 'Calling nextval atomically increments the sequence and returns the new value, guaranteeing distinct numbers across concurrent sessions.' },
                { term: 'currval is per session', detail: 'currval returns the value most recently produced by nextval in the current session, so it is not affected by other sessions.' },
                { term: 'Gaps are expected', detail: 'Sequences are not transactional, so a rolled-back transaction still consumes numbers and leaves gaps, which is by design for concurrency.' },
                { term: 'Manual reset', detail: 'setval and ALTER SEQUENCE RESTART let you reposition the counter, useful after bulk loads that inserted explicit key values.' },
              ],
            },
            example: "SELECT setval('order_no', 2000);",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'pg-jsonb',
    title: 'JSONB',
    level: 1,
    slug: 'jsonb',
    concepts: [],
    children: [
      {
        id: 'pg-jsonb-usage',
        title: 'JSONB Operators',
        level: 2,
        slug: 'jsonb-usage',
        concepts: [
          {
            id: 'pg-jsonb-query',
            code: "SELECT name, profile->>'email' AS email\nFROM users\nWHERE profile @> '{\"role\": \"admin\"}'::jsonb;",
            note: "JSONB stores decomposed binary JSON that supports indexing. Use -> for JSON, ->> for text, #> for paths, and @> for containment. GIN indexes accelerate @> lookups.",
            explanation: {
              heading: 'Querying JSONB documents',
              intro: 'JSONB stores JSON in a decomposed binary form, which strips insignificant whitespace, drops duplicate keys, and enables rich indexing and operators.',
              points: [
                { term: 'Arrow operators', detail: 'The single arrow returns a JSON value while the double arrow returns text, so use the double arrow when you want a plain string to compare or display.' },
                { term: 'Containment matching', detail: 'The at-greater-than operator tests whether the left document contains the right one, which is the idiomatic way to filter by nested keys.' },
                { term: 'GIN acceleration', detail: 'A GIN index over a JSONB column makes containment and key-existence queries fast instead of scanning every row.' },
                { term: 'JSONB versus JSON', detail: 'JSONB is preferred for querying because JSON keeps the raw text and reparses on every access, which is slower and unindexable for containment.' },
              ],
            },
            example: "CREATE INDEX idx_profile ON users USING GIN (profile);",
          },
          {
            id: 'pg-jsonb-build',
            code: "SELECT jsonb_build_object('id', id, 'name', name) AS doc\nFROM products;",
            note: "jsonb_build_object and jsonb_agg construct JSON from rows. jsonb_set updates a path, and jsonb_array_elements expands arrays into rows.",
            explanation: {
              heading: 'Building and reshaping JSONB',
              intro: 'PostgreSQL provides a family of functions to assemble JSON from relational rows and to expand JSON back into rows.',
              points: [
                { term: 'Build objects', detail: 'jsonb_build_object takes alternating key and value arguments to construct a document per row from ordinary columns.' },
                { term: 'Aggregate to arrays', detail: 'jsonb_agg collapses many rows into a single JSON array, which pairs well with GROUP BY to nest child records under a parent.' },
                { term: 'Update in place', detail: 'jsonb_set replaces the value at a given path and returns a new document, since JSONB values are immutable and functions return copies.' },
                { term: 'Expand arrays', detail: 'jsonb_array_elements turns each element of a JSON array into its own row so you can join or filter the contents relationally.' },
              ],
            },
            example: "SELECT jsonb_agg(name) FROM products;",
          },
          {
            id: 'pg-jsonb-path',
            code: "SELECT jsonb_path_query(data, '$.items[*] ? (@.price > 100)')\nFROM carts;",
            note: "The SQL/JSON path language (PG 12+) queries JSONB with jsonb_path_query and the @@ / @? operators, supporting filters, wildcards, and array navigation in one expression.",
            explanation: {
              heading: 'SQL/JSON path queries',
              intro: 'The SQL/JSON path language, added in PostgreSQL 12, expresses complex navigation and filtering of JSONB in a single compact string.',
              points: [
                { term: 'Path syntax', detail: 'A path starts at the dollar-sign root and walks keys and array indexes, with the star wildcard matching every element or member.' },
                { term: 'Inline filters', detail: 'A filter written with a question mark and an at-sign predicate keeps only the matching elements, so you can select array items by value.' },
                { term: 'Match operators', detail: 'The at-question-mark operator tests whether any item matches a path, and the double-at operator evaluates a path predicate to a boolean for WHERE clauses.' },
                { term: 'Extract with function', detail: 'jsonb_path_query returns each matching item as a row, which is handy for pulling many nested values at once.' },
              ],
            },
            example: "SELECT * FROM carts WHERE data @? '$.items[*] ? (@.qty > 0)';",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'pg-arrays',
    title: 'Arrays',
    level: 1,
    slug: 'arrays',
    concepts: [],
    children: [
      {
        id: 'pg-arrays-usage',
        title: 'Array Columns',
        level: 2,
        slug: 'arrays-usage',
        concepts: [
          {
            id: 'pg-array-basic',
            code: "SELECT name\nFROM products\nWHERE tags @> ARRAY['electronics']::text[];",
            note: "PostgreSQL supports native array columns. Use @> for contains, && for overlap, array_length for size, and unnest() to expand an array into rows.",
            explanation: {
              heading: 'Native array columns',
              intro: 'Any PostgreSQL type can become an array column, letting a single field hold an ordered list with dedicated operators and functions.',
              points: [
                { term: 'Containment and overlap', detail: 'The at-greater-than operator checks that an array contains all given elements, while the ampersand-ampersand operator checks that two arrays share any element.' },
                { term: 'One-based indexing', detail: 'Array elements are addressed starting at index one, which differs from the zero-based indexing common in general-purpose languages.' },
                { term: 'Measuring size', detail: 'array_length reports the number of elements along a dimension, and cardinality counts all elements across dimensions.' },
                { term: 'Expand with unnest', detail: 'unnest turns each element into its own row so you can join, aggregate, or filter array contents using normal relational tools.' },
              ],
            },
            example: "SELECT unnest(tags) AS tag FROM products WHERE id = 1;",
          },
          {
            id: 'pg-array-agg',
            code: "SELECT customer_id, array_agg(product_id ORDER BY product_id) AS products\nFROM orders\nGROUP BY customer_id;",
            note: "array_agg collapses grouped rows into an array (the inverse of unnest). Use ARRAY(subquery) or array_agg DISTINCT to build arrays from related rows in one query.",
            explanation: {
              heading: 'Aggregating rows into arrays',
              intro: 'array_agg is the inverse of unnest, gathering many values from a group into one array so related rows collapse into a single field.',
              points: [
                { term: 'Ordered aggregation', detail: 'You can attach an ORDER BY inside array_agg so the resulting array preserves a meaningful order rather than an arbitrary one.' },
                { term: 'Deduplicate elements', detail: 'array_agg with DISTINCT drops repeated values, which is useful when the grouping produces duplicate tags or labels.' },
                { term: 'ARRAY subquery form', detail: 'Wrapping a subquery in ARRAY builds an array directly from its result rows without needing GROUP BY on the outer query.' },
                { term: 'Nulls included', detail: 'array_agg keeps NULL group members by default, so filter them out first if an array of only real values is required.' },
              ],
            },
            example: "SELECT array_agg(DISTINCT tag) FROM post_tags;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'pg-ctes',
    title: 'CTEs and Recursion',
    level: 1,
    slug: 'ctes',
    concepts: [],
    children: [
      {
        id: 'pg-cte-usage',
        title: 'WITH and Recursive CTEs',
        level: 2,
        slug: 'cte-usage',
        concepts: [
          {
            id: 'pg-cte-basic',
            code: "WITH recent AS (\n  SELECT * FROM orders WHERE created_at > now() - interval '7 days'\n)\nSELECT customer_id, count(*) FROM recent GROUP BY customer_id;",
            note: "CTEs (WITH) name subquery results for readability and reuse. Since PG 12 they inline by default; add MATERIALIZED to force a temp result.",
            explanation: {
              heading: 'Common table expressions',
              intro: 'A WITH clause names a subquery so a complex statement reads top to bottom, and PostgreSQL 12 changed how these are executed by default.',
              points: [
                { term: 'Readable structure', detail: 'Naming intermediate results lets you break a large query into labeled steps that are easier to follow and reference more than once.' },
                { term: 'Inlining by default', detail: 'Since PostgreSQL 12 a CTE referenced once is folded into the main query, so the planner can push down filters and choose better plans.' },
                { term: 'Force materialization', detail: 'Adding MATERIALIZED computes the CTE once into a temporary result, which helps when the subquery is expensive and reused several times.' },
                { term: 'Optimization fence gone', detail: 'Before version 12 every CTE acted as an optimization barrier, so upgrading can change plans for queries that relied on that behavior.' },
              ],
            },
            example: "WITH t AS MATERIALIZED (SELECT * FROM big_view) SELECT * FROM t;",
          },
          {
            id: 'pg-cte-recursive',
            code: "WITH RECURSIVE tree AS (\n  SELECT id, parent_id, name FROM categories WHERE parent_id IS NULL\n  UNION ALL\n  SELECT c.id, c.parent_id, c.name\n  FROM categories c JOIN tree t ON c.parent_id = t.id\n)\nSELECT * FROM tree;",
            note: "Recursive CTEs walk hierarchical data with an anchor member and a recursive member joined by UNION ALL, terminating when the recursive part returns no rows.",
            explanation: {
              heading: 'Recursive CTEs for hierarchies',
              intro: 'WITH RECURSIVE lets a query reference itself, which is the standard technique for traversing trees, graphs, and generated series.',
              points: [
                { term: 'Anchor member', detail: 'The first part before UNION ALL produces the starting rows, such as the root nodes of a category tree.' },
                { term: 'Recursive member', detail: 'The second part joins back to the CTE name to expand one level at a time, feeding its output back in until it produces no new rows.' },
                { term: 'Termination', detail: 'Recursion stops when the recursive member returns an empty set, so the join condition must eventually exclude all remaining rows.' },
                { term: 'Avoid cycles', detail: 'For graphs that may contain loops, track visited nodes in an array or use a depth limit to prevent infinite recursion.' },
              ],
            },
            example: "WITH RECURSIVE n(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM n WHERE x<5) SELECT x FROM n;",
          },
          {
            id: 'pg-cte-data-modifying',
            code: "WITH moved AS (\n  DELETE FROM orders WHERE created_at < '2020-01-01'\n  RETURNING *\n)\nINSERT INTO orders_archive SELECT * FROM moved;",
            note: "PostgreSQL allows data-modifying statements inside WITH. Combined with RETURNING, one query can delete rows and insert them elsewhere atomically, ideal for archiving.",
            explanation: {
              heading: 'Data-modifying CTEs',
              intro: 'PostgreSQL uniquely allows INSERT, UPDATE, and DELETE inside a WITH clause, chaining write operations into one atomic statement.',
              points: [
                { term: 'Feed with RETURNING', detail: 'A writing CTE uses RETURNING to emit affected rows, which a later part of the same statement can consume as input.' },
                { term: 'Archive pattern', detail: 'A common use is deleting old rows in one CTE and inserting the returned rows into an archive table in the outer query.' },
                { term: 'Single snapshot', detail: 'All parts of the statement see the same snapshot of the data, so the sub-statements do not observe each other changes.' },
                { term: 'One execution each', detail: 'Each modifying CTE runs exactly once regardless of how many times it is referenced, keeping side effects predictable.' },
              ],
            },
            example: "WITH upd AS (UPDATE t SET v=1 RETURNING id) SELECT count(*) FROM upd;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'pg-window-functions',
    title: 'Window Functions',
    level: 1,
    slug: 'window-functions',
    concepts: [],
    children: [
      {
        id: 'pg-window-usage',
        title: 'OVER and Frames',
        level: 2,
        slug: 'window-usage',
        concepts: [
          {
            id: 'pg-window-rank',
            code: "SELECT department, employee, salary,\n  RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank\nFROM salaries;",
            note: "Window functions compute across partitions without collapsing rows. PostgreSQL supports RANK, DENSE_RANK, ROW_NUMBER, LAG, LEAD, and custom frames with ROWS/RANGE.",
            explanation: {
              heading: 'Window function basics',
              intro: 'Window functions compute a value over a set of related rows while still returning every input row, unlike aggregates that collapse groups.',
              points: [
                { term: 'PARTITION BY groups', detail: 'The PARTITION BY clause splits rows into independent groups, restarting the calculation for each department, customer, or other key.' },
                { term: 'Ranking family', detail: 'RANK leaves gaps after ties, DENSE_RANK does not, and ROW_NUMBER assigns a unique sequential number regardless of ties.' },
                { term: 'Offset functions', detail: 'LAG and LEAD read a value from a preceding or following row, which makes period-over-period comparisons straightforward.' },
                { term: 'Frame clauses', detail: 'A ROWS or RANGE frame limits which rows feed a running aggregate, enabling moving averages and cumulative sums.' },
              ],
            },
            example: "SELECT *, avg(x) OVER (ORDER BY d ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) FROM m;",
          },
          {
            id: 'pg-window-named',
            code: "SELECT employee, salary,\n  rank() OVER w AS r,\n  salary - avg(salary) OVER w AS diff\nFROM salaries\nWINDOW w AS (PARTITION BY department ORDER BY salary DESC);",
            note: "A named WINDOW clause defines a window once and reuses it across several window functions, avoiding repetition and keeping complex analytic queries readable.",
            explanation: {
              heading: 'Named window definitions',
              intro: 'A WINDOW clause lets you name a window specification once and reference it from many functions, keeping analytic queries concise.',
              points: [
                { term: 'Define once', detail: 'The WINDOW clause after the FROM list gives a name to a PARTITION BY and ORDER BY spec that several OVER references can share.' },
                { term: 'Less repetition', detail: 'Reusing the name avoids retyping the same partition and ordering for each function, reducing the chance of subtle mismatches.' },
                { term: 'Multiple functions', detail: 'Different window functions such as rank and avg can all point at the same named window, computing over identical row sets.' },
                { term: 'Extendable specs', detail: 'A named window can be used as a base that another OVER clause refines, for example adding a frame on top of the shared partition.' },
              ],
            },
            example: "WINDOW w AS (PARTITION BY dept)",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'pg-plpgsql',
    title: 'PL/pgSQL Functions',
    level: 1,
    slug: 'plpgsql',
    concepts: [],
    children: [
      {
        id: 'pg-plpgsql-usage',
        title: 'Functions and Logic',
        level: 2,
        slug: 'plpgsql-usage',
        concepts: [
          {
            id: 'pg-plpgsql-function',
            code: "CREATE OR REPLACE FUNCTION increment_counter(counter_id INT)\nRETURNS INT AS $$\nDECLARE new_val INT;\nBEGIN\n  UPDATE counters SET value = value + 1 WHERE id = counter_id\n  RETURNING value INTO new_val;\n  RETURN new_val;\nEND;\n$$ LANGUAGE plpgsql;",
            note: "PL/pgSQL is the procedural language for functions and triggers. It supports variables (DECLARE), control flow, RETURNING INTO, and exception handling with EXCEPTION blocks.",
            explanation: {
              heading: 'PL/pgSQL procedural functions',
              intro: 'PL/pgSQL adds imperative programming to PostgreSQL, letting functions declare variables, branch, loop, and handle errors inside the database.',
              points: [
                { term: 'Dollar quoting', detail: 'The function body is wrapped in dollar-sign delimiters so single quotes inside the code do not need escaping.' },
                { term: 'Variables and flow', detail: 'A DECLARE section defines typed variables, and IF, LOOP, and FOR give the control flow that plain SQL lacks.' },
                { term: 'Capture results', detail: 'RETURNING INTO stores columns from a modifying statement directly into variables, avoiding a separate query.' },
                { term: 'Exception blocks', detail: 'An EXCEPTION section traps errors such as unique_violation and runs recovery logic, rolling back to the start of the block.' },
              ],
            },
            example: "SELECT increment_counter(1);",
          },
          {
            id: 'pg-returns-table',
            code: "CREATE FUNCTION top_customers(min_spend NUMERIC)\nRETURNS TABLE(id INT, spent NUMERIC) AS $$\nBEGIN\n  RETURN QUERY\n    SELECT customer_id, sum(total) FROM orders\n    GROUP BY customer_id HAVING sum(total) > min_spend;\nEND;\n$$ LANGUAGE plpgsql;",
            note: "A set-returning function declared RETURNS TABLE(...) yields multiple rows via RETURN QUERY. Callers use it in FROM like a table, passing arguments as parameters.",
            explanation: {
              heading: 'Set-returning functions',
              intro: 'A function declared RETURNS TABLE produces multiple rows, so it behaves like a parameterized view you can join and filter.',
              points: [
                { term: 'RETURN QUERY', detail: 'RETURN QUERY streams the rows of a SELECT out of the function, and it can be called several times to append more result sets.' },
                { term: 'Use it in FROM', detail: 'Callers place the function in the FROM clause and pass arguments, treating its output like an ordinary table source.' },
                { term: 'Named output columns', detail: 'The column names and types in RETURNS TABLE define the shape of the result, so callers can reference those columns by name.' },
                { term: 'Composable logic', detail: 'Because it returns a relation, you can join it with other tables, apply WHERE, and aggregate its output like any subquery.' },
              ],
            },
            example: "SELECT * FROM top_customers(1000);",
          },
          {
            id: 'pg-procedures',
            code: "CREATE PROCEDURE transfer(a INT, b INT, amt NUMERIC) AS $$\nBEGIN\n  UPDATE accounts SET balance = balance - amt WHERE id = a;\n  UPDATE accounts SET balance = balance + amt WHERE id = b;\n  COMMIT;\nEND;\n$$ LANGUAGE plpgsql;\nCALL transfer(1, 2, 100);",
            note: "Unlike functions, PROCEDUREs (PG 11+) can manage transactions with COMMIT/ROLLBACK inside the body and are invoked with CALL. Use them for multi-step operations that control their own transactions.",
            explanation: {
              heading: 'Procedures and transactions',
              intro: 'Stored procedures, introduced in PostgreSQL 11, differ from functions chiefly by being able to control transactions from inside their body.',
              points: [
                { term: 'Invoked with CALL', detail: 'Procedures run through the CALL statement rather than being embedded in a SELECT, since they do not return a single value.' },
                { term: 'Transaction control', detail: 'A procedure can issue COMMIT and ROLLBACK between statements, which functions cannot do because they run inside the caller transaction.' },
                { term: 'Batch workloads', detail: 'This makes procedures well suited to long batch jobs that need to commit in chunks so locks and undo do not accumulate.' },
                { term: 'No return value', detail: 'Procedures return results only through INOUT parameters, so use a function when you need a computed value back.' },
              ],
            },
            example: "CALL transfer(1, 2, 50);",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'pg-triggers',
    title: 'Triggers',
    level: 1,
    slug: 'triggers',
    concepts: [],
    children: [
      {
        id: 'pg-triggers-usage',
        title: 'Trigger Functions',
        level: 2,
        slug: 'triggers-usage',
        concepts: [
          {
            id: 'pg-trigger-basic',
            code: "CREATE FUNCTION set_updated() RETURNS TRIGGER AS $$\nBEGIN\n  NEW.updated_at = now();\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql;\n\nCREATE TRIGGER trg_updated BEFORE UPDATE ON docs\nFOR EACH ROW EXECUTE FUNCTION set_updated();",
            note: "In PostgreSQL a trigger calls a trigger function returning TRIGGER. Access NEW/OLD rows; BEFORE triggers may modify NEW and must RETURN it.",
            explanation: {
              heading: 'Trigger functions',
              intro: 'PostgreSQL triggers are split into a reusable function returning the TRIGGER type and a CREATE TRIGGER binding that attaches it to a table event.',
              points: [
                { term: 'Two-part design', detail: 'You first write a function returning TRIGGER, then bind it with CREATE TRIGGER, so one function can serve several tables.' },
                { term: 'NEW and OLD rows', detail: 'Inside the function the NEW record holds the incoming row and OLD holds the previous row, available depending on the operation.' },
                { term: 'BEFORE can rewrite', detail: 'A row-level BEFORE trigger may change fields on NEW and must return it, which is how columns like updated_at are set automatically.' },
                { term: 'Return controls flow', detail: 'Returning NULL from a BEFORE row trigger cancels the operation for that row, while AFTER triggers ignore the return value.' },
              ],
            },
            example: "CREATE TRIGGER audit AFTER DELETE ON t FOR EACH ROW EXECUTE FUNCTION log_delete();",
          },
          {
            id: 'pg-trigger-conditional',
            code: "CREATE TRIGGER trg_price\nAFTER UPDATE OF price ON products\nFOR EACH ROW\nWHEN (OLD.price IS DISTINCT FROM NEW.price)\nEXECUTE FUNCTION log_price_change();",
            note: "UPDATE OF column and a WHEN condition limit when a trigger fires, avoiding needless calls. IS DISTINCT FROM compares safely even when values are NULL.",
            explanation: {
              heading: 'Conditional trigger firing',
              intro: 'PostgreSQL can narrow when a trigger runs so it fires only for relevant changes, saving work and avoiding spurious side effects.',
              points: [
                { term: 'Watch specific columns', detail: 'UPDATE OF names the columns whose change should fire the trigger, so edits to unrelated columns skip it entirely.' },
                { term: 'WHEN predicate', detail: 'A WHEN condition is evaluated before the function runs and only fires it when the expression over OLD and NEW is true.' },
                { term: 'Null-safe comparison', detail: 'IS DISTINCT FROM treats NULL as a comparable value, so it correctly detects a change even when one side is NULL.' },
                { term: 'Fewer dead tuples', detail: 'Skipping no-op firings reduces redundant writes and logging, which keeps table bloat and trigger overhead down.' },
              ],
            },
            example: "WHEN (NEW.status = 'shipped')",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'pg-indexes',
    title: 'Indexes',
    level: 1,
    slug: 'indexes',
    concepts: [],
    children: [
      {
        id: 'pg-index-types',
        title: 'B-tree, GIN, GiST',
        level: 2,
        slug: 'index-types',
        concepts: [
          {
            id: 'pg-btree',
            code: "CREATE INDEX idx_email ON users(email);\nCREATE INDEX idx_active ON users(email) WHERE active;",
            note: "B-tree is the default index for equality and range queries. Partial indexes (WHERE) index a subset of rows; expression indexes index computed values.",
            explanation: {
              heading: 'B-tree and specialized indexes',
              intro: 'B-tree is the default and most versatile PostgreSQL index, and partial and expression variants let you tailor it precisely to a workload.',
              points: [
                { term: 'Equality and range', detail: 'B-tree serves equality, range, and ORDER BY because it keeps keys sorted, which is why it is the default access method.' },
                { term: 'Partial indexes', detail: 'A WHERE clause on the index limits it to a subset of rows, shrinking the index and speeding queries that always filter on that condition.' },
                { term: 'Expression indexes', detail: 'Indexing a computed value such as lower(email) lets case-insensitive lookups use the index instead of scanning the table.' },
                { term: 'Match the predicate', detail: 'For a partial or expression index to help, the query must use the same expression or condition the index was built on.' },
              ],
            },
            example: "CREATE INDEX idx_lower ON users(lower(email));",
          },
          {
            id: 'pg-gin-gist',
            code: "CREATE INDEX idx_tags ON products USING GIN (tags);\nCREATE INDEX idx_geo ON places USING GiST (location);",
            note: "GIN indexes suit multi-value data (arrays, JSONB, full-text). GiST supports geometric and range types and nearest-neighbor searches.",
            explanation: {
              heading: 'GIN and GiST index methods',
              intro: 'Beyond B-tree, PostgreSQL offers GIN and GiST access methods built for values that contain many components or need proximity search.',
              points: [
                { term: 'GIN for many values', detail: 'GIN indexes each element of a composite value, making it ideal for arrays, JSONB containment, and full-text tsvector columns.' },
                { term: 'GiST for shapes', detail: 'GiST is a balanced tree framework that supports geometric types, range overlap, and other operators B-tree cannot express.' },
                { term: 'Nearest neighbor', detail: 'GiST can answer ordered nearest-neighbor queries with the distance operator, returning the closest rows first.' },
                { term: 'Operator classes', detail: 'Choosing an operator class such as jsonb_path_ops tunes what a GIN index supports and how large it becomes.' },
              ],
            },
            example: "CREATE INDEX idx_doc ON items USING GIN (doc jsonb_path_ops);",
          },
          {
            id: 'pg-explain-analyze',
            code: "EXPLAIN (ANALYZE, BUFFERS)\nSELECT * FROM orders WHERE customer_id = 5;",
            note: "EXPLAIN shows the planned strategy; adding ANALYZE runs the query and reports actual times and row counts. Watch for Seq Scan on large tables and big gaps between estimated and actual rows.",
            explanation: {
              heading: 'Reading query plans',
              intro: 'EXPLAIN reveals how the planner intends to run a query, and ANALYZE proves what actually happened so you can find slow spots.',
              points: [
                { term: 'Plan versus reality', detail: 'Plain EXPLAIN shows estimates only, while EXPLAIN ANALYZE executes the query and reports real timing and row counts.' },
                { term: 'Estimate mismatches', detail: 'A large gap between estimated and actual rows often signals stale statistics, so running ANALYZE on the table can fix bad plans.' },
                { term: 'Scan types', detail: 'A Seq Scan reads the whole table, which is fine for small tables but a red flag on large ones where an index scan should apply.' },
                { term: 'BUFFERS detail', detail: 'Adding BUFFERS shows how many pages came from cache versus disk, helping distinguish a slow query from a cold cache.' },
              ],
            },
            example: "CREATE INDEX CONCURRENTLY idx_cust ON orders(customer_id);",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'pg-fulltext',
    title: 'Full-Text Search',
    level: 1,
    slug: 'fulltext',
    concepts: [],
    children: [
      {
        id: 'pg-fulltext-usage',
        title: 'tsvector and tsquery',
        level: 2,
        slug: 'fulltext-usage',
        concepts: [
          {
            id: 'pg-fulltext-search',
            code: "SELECT title\nFROM articles\nWHERE to_tsvector('english', body) @@ to_tsquery('english', 'index & tuning');",
            note: "Full-text search converts text to a tsvector (lexemes) matched against a tsquery with @@. Store a generated tsvector column and GIN-index it for speed.",
            explanation: {
              heading: 'Full-text search fundamentals',
              intro: 'PostgreSQL full-text search normalizes documents into lexemes so searches match word stems rather than exact substrings.',
              points: [
                { term: 'tsvector documents', detail: 'to_tsvector parses text with a language configuration, lowercases it, and reduces words to lexemes while dropping stop words.' },
                { term: 'tsquery patterns', detail: 'to_tsquery builds a search expression that can combine terms with and, or, and not operators against the tsvector.' },
                { term: 'Match operator', detail: 'The double-at operator returns true when a tsvector satisfies a tsquery, which is the core of a full-text WHERE clause.' },
                { term: 'Ranking results', detail: 'ts_rank scores how well each match fits the query so you can order the most relevant documents first.' },
              ],
            },
            example: "SELECT ts_rank(to_tsvector(body), to_tsquery('sql')) FROM docs;",
          },
          {
            id: 'pg-fulltext-generated',
            code: "ALTER TABLE articles ADD COLUMN search tsvector\n  GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || body)) STORED;\nCREATE INDEX idx_search ON articles USING GIN (search);",
            note: "A STORED generated tsvector column keeps the search index in sync automatically and can be GIN-indexed, making MATCH queries against precomputed lexemes fast.",
            explanation: {
              heading: 'Generated tsvector columns',
              intro: 'Storing the tsvector as a generated column removes the need for triggers and keeps the searchable form always current.',
              points: [
                { term: 'Auto maintenance', detail: 'A GENERATED ALWAYS AS STORED column recomputes the tsvector whenever the source text changes, so it never drifts out of sync.' },
                { term: 'Index the column', detail: 'Building a GIN index on the stored tsvector lets match queries read precomputed lexemes instead of parsing text at query time.' },
                { term: 'Combine fields', detail: 'The generation expression can concatenate title and body so a single column and index cover several text fields at once.' },
                { term: 'Weighting option', detail: 'Wrapping parts with setweight lets ranking favor matches in a title over matches in the body when scoring results.' },
              ],
            },
            example: "SELECT * FROM articles WHERE search @@ to_tsquery('performance');",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'pg-returning-upsert',
    title: 'RETURNING and UPSERT',
    level: 1,
    slug: 'returning-upsert',
    concepts: [],
    children: [
      {
        id: 'pg-returning',
        title: 'RETURNING Clause',
        level: 2,
        slug: 'returning',
        concepts: [
          {
            id: 'pg-returning-basic',
            code: "INSERT INTO users (email) VALUES ('a@x.com')\nRETURNING id, created_at;",
            note: "RETURNING lets INSERT/UPDATE/DELETE return columns from affected rows in one round trip, eliminating a follow-up SELECT for generated keys or defaults.",
            explanation: {
              heading: 'The RETURNING clause',
              intro: 'RETURNING turns a write statement into one that also reports the rows it changed, saving an extra query and a round trip.',
              points: [
                { term: 'Read generated values', detail: 'It is the idiomatic way to fetch an auto-generated identity key or a default value right after inserting a row.' },
                { term: 'Works on all writes', detail: 'INSERT, UPDATE, and DELETE all support RETURNING, so you can report exactly which rows an operation touched.' },
                { term: 'Column expressions', detail: 'The clause accepts any expression over the affected rows, not just plain columns, so you can compute derived values in the same step.' },
                { term: 'Feed a CTE', detail: 'RETURNING output can flow into a surrounding data-modifying CTE to chain writes without an intermediate table.' },
              ],
            },
            example: "DELETE FROM sessions WHERE expired RETURNING id;",
          },
        ],
        children: [],
      },
      {
        id: 'pg-on-conflict',
        title: 'ON CONFLICT (Upsert)',
        level: 2,
        slug: 'on-conflict',
        concepts: [
          {
            id: 'pg-upsert',
            code: "INSERT INTO counters (name, hits) VALUES ('home', 1)\nON CONFLICT (name)\nDO UPDATE SET hits = counters.hits + EXCLUDED.hits;",
            note: "INSERT ... ON CONFLICT implements upsert. Specify the conflict target, then DO NOTHING or DO UPDATE. EXCLUDED refers to the row proposed for insertion.",
            explanation: {
              heading: 'Upsert with ON CONFLICT',
              intro: 'ON CONFLICT turns an INSERT into an upsert, resolving a unique or primary key clash atomically without a race between checking and writing.',
              points: [
                { term: 'Conflict target', detail: 'You name the column list or constraint that defines a duplicate, so PostgreSQL knows which unique index to watch.' },
                { term: 'Two actions', detail: 'DO NOTHING silently skips duplicates, while DO UPDATE modifies the existing row using the values you supply.' },
                { term: 'The EXCLUDED row', detail: 'Inside DO UPDATE the EXCLUDED pseudo-table exposes the values that were proposed for insertion, so you can merge them in.' },
                { term: 'Atomic and safe', detail: 'The whole operation is a single statement, avoiding the classic check-then-insert race under concurrency.' },
              ],
            },
            example: "INSERT INTO t (id,v) VALUES (1,2) ON CONFLICT (id) DO NOTHING;",
          },
          {
            id: 'pg-upsert-where',
            code: "INSERT INTO prices (sku, amount) VALUES ('A1', 9.99)\nON CONFLICT (sku) DO UPDATE\n  SET amount = EXCLUDED.amount\n  WHERE prices.amount IS DISTINCT FROM EXCLUDED.amount;",
            note: "The DO UPDATE branch can carry its own WHERE to skip no-op writes, reducing dead tuples and trigger firings when the incoming value matches the stored one.",
            explanation: {
              heading: 'Conditional upsert updates',
              intro: 'The DO UPDATE branch accepts a WHERE clause so an upsert can decline to rewrite a row when nothing actually changed.',
              points: [
                { term: 'Skip no-op writes', detail: 'A WHERE that compares the stored value with EXCLUDED avoids updating rows whose data is already identical to the incoming row.' },
                { term: 'Less bloat', detail: 'Because every update creates a new row version under MVCC, skipping needless writes reduces dead tuples and vacuum work.' },
                { term: 'Fewer trigger firings', detail: 'Not writing unchanged rows also prevents update triggers from running, avoiding redundant audit or notification side effects.' },
                { term: 'Target by constraint', detail: 'You can identify the conflict by naming a constraint with ON CONSTRAINT instead of listing the columns explicitly.' },
              ],
            },
            example: "ON CONFLICT ON CONSTRAINT prices_sku_key DO NOTHING;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'pg-schemas-extensions',
    title: 'Schemas and Extensions',
    level: 1,
    slug: 'schemas-extensions',
    concepts: [],
    children: [
      {
        id: 'pg-schemas',
        title: 'Schemas',
        level: 2,
        slug: 'schemas',
        concepts: [
          {
            id: 'pg-schema-basic',
            code: "CREATE SCHEMA billing;\nCREATE TABLE billing.invoices (id INT PRIMARY KEY);\nSET search_path TO billing, public;",
            note: "Schemas are namespaces within a database that group tables and other objects. search_path determines which schemas are searched for unqualified names.",
            explanation: {
              heading: 'Schemas as namespaces',
              intro: 'A schema is a namespace inside a database that lets you organize objects and allow tables of the same name to coexist in different groupings.',
              points: [
                { term: 'Logical grouping', detail: 'Schemas separate objects by module, tenant, or team, so a billing schema and a public schema can each hold their own tables.' },
                { term: 'The search_path', detail: 'The search_path setting lists which schemas to check for unqualified names, and the first match wins when several schemas share a name.' },
                { term: 'Qualify to be exact', detail: 'Writing schema.table removes ambiguity and is recommended in scripts where the search_path might differ between environments.' },
                { term: 'Default public', detail: 'New objects land in the public schema unless you qualify the name or change the search_path first.' },
              ],
            },
            example: "SELECT * FROM billing.invoices;",
          },
        ],
        children: [],
      },
      {
        id: 'pg-extensions',
        title: 'Extensions',
        level: 2,
        slug: 'extensions',
        concepts: [
          {
            id: 'pg-extension-basic',
            code: "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";\nCREATE EXTENSION IF NOT EXISTS pg_trgm;",
            note: "Extensions add packaged functionality: uuid-ossp for UUIDs, pg_trgm for trigram similarity search, postgis for spatial data, and hstore for key-value columns.",
            explanation: {
              heading: 'Installing extensions',
              intro: 'Extensions bundle functions, types, and operators so you can add major capabilities to a database with a single command.',
              points: [
                { term: 'CREATE EXTENSION', detail: 'Running CREATE EXTENSION installs the packaged objects, and IF NOT EXISTS makes the statement safe to run repeatedly in migrations.' },
                { term: 'Popular choices', detail: 'pg_trgm adds fuzzy matching, postgis adds spatial types, hstore adds key-value columns, and uuid-ossp generates UUIDs.' },
                { term: 'Schema placement', detail: 'An extension can be installed into a chosen schema, which keeps its objects tidy and controls how they appear on the search_path.' },
                { term: 'Discoverability', detail: 'The pg_available_extensions view lists what the server can install, while pg_extension shows what is already active.' },
              ],
            },
            example: "SELECT * FROM pg_available_extensions;",
          },
          {
            id: 'pg-trgm-search',
            code: "CREATE INDEX idx_name_trgm ON products USING GIN (name gin_trgm_ops);\nSELECT name FROM products WHERE name ILIKE '%wiget%';\nSELECT name, similarity(name, 'wiget') FROM products ORDER BY 2 DESC;",
            note: "The pg_trgm extension enables fast fuzzy matching: a GIN trigram index speeds ILIKE and % (similarity) searches, useful for typo-tolerant autocomplete.",
            explanation: {
              heading: 'Trigram fuzzy matching',
              intro: 'The pg_trgm extension breaks strings into three-character trigrams so PostgreSQL can measure similarity and accelerate pattern searches.',
              points: [
                { term: 'Similarity operator', detail: 'The percent operator returns true when two strings share enough trigrams, which tolerates typos and minor spelling differences.' },
                { term: 'Index pattern search', detail: 'A GIN or GiST index with the trigram operator class speeds up ILIKE and pattern matches that would otherwise scan the whole table.' },
                { term: 'Ranking by closeness', detail: 'The similarity function returns a score you can sort by, so the closest matches appear first in autocomplete results.' },
                { term: 'Leading wildcards', detail: 'Unlike B-tree, a trigram index can accelerate patterns with a wildcard at the start, such as searching for text anywhere in a name.' },
              ],
            },
            example: "SELECT * FROM products WHERE name % 'widgt';",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'pg-transactions',
    title: 'Transactions',
    level: 1,
    slug: 'transactions',
    concepts: [],
    children: [
      {
        id: 'pg-transactions-usage',
        title: 'MVCC and Savepoints',
        level: 2,
        slug: 'transactions-usage',
        concepts: [
          {
            id: 'pg-transaction-basic',
            code: "BEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nSAVEPOINT before_credit;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;",
            note: "PostgreSQL uses MVCC so readers never block writers. SAVEPOINT creates a rollback point within a transaction; ROLLBACK TO undoes work after it without aborting the whole transaction.",
            explanation: {
              heading: 'MVCC and savepoints',
              intro: 'Multiversion concurrency control gives each transaction a consistent snapshot, and savepoints add fine-grained rollback within a transaction.',
              points: [
                { term: 'Readers and writers', detail: 'Under MVCC a read sees a snapshot from its start, so readers never block writers and writers never block readers.' },
                { term: 'Row versions', detail: 'An update writes a new row version rather than overwriting, which is why dead tuples accumulate and VACUUM must reclaim them.' },
                { term: 'Savepoints', detail: 'SAVEPOINT marks a point you can return to, and ROLLBACK TO undoes only the work after it while keeping the transaction alive.' },
                { term: 'Partial recovery', detail: 'This lets a long transaction retry a failed step without discarding everything it has already accomplished.' },
              ],
            },
            example: "ROLLBACK TO before_credit;",
          },
          {
            id: 'pg-advisory-locks',
            code: "SELECT pg_advisory_lock(42);\n-- do exclusive work keyed to id 42\nSELECT pg_advisory_unlock(42);",
            note: "Advisory locks are application-defined locks keyed by an integer, independent of any row. They coordinate work (like a job runner) without locking table data. Session locks must be released explicitly.",
            explanation: {
              heading: 'Advisory locks',
              intro: 'Advisory locks let an application coordinate its own critical sections using an integer key, without tying the lock to any table row.',
              points: [
                { term: 'Application defined', detail: 'The lock has no meaning to the database beyond its key, so the application decides what a given number represents.' },
                { term: 'Session versus transaction', detail: 'Session-level locks persist until you unlock them or disconnect, while transaction-level locks release automatically at commit or rollback.' },
                { term: 'Non-blocking attempt', detail: 'pg_try_advisory_lock returns immediately with true or false instead of waiting, which suits workers that should move on if busy.' },
                { term: 'Single-runner pattern', detail: 'They are ideal for ensuring only one instance of a job runs at a time across many application processes.' },
              ],
            },
            example: "SELECT pg_try_advisory_lock(42);  -- non-blocking attempt",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'pg-lateral-joins',
    title: 'LATERAL Joins',
    level: 1,
    slug: 'lateral-joins',
    concepts: [],
    children: [
      {
        id: 'pg-lateral-usage',
        title: 'Correlated Set Joins',
        level: 2,
        slug: 'lateral-usage',
        concepts: [
          {
            id: 'pg-lateral-basic',
            code: "SELECT u.id, recent.title\nFROM users u\nCROSS JOIN LATERAL (\n  SELECT title FROM posts p\n  WHERE p.user_id = u.id ORDER BY created_at DESC LIMIT 3\n) recent;",
            note: "LATERAL lets a subquery reference columns from preceding FROM items, enabling per-row top-N queries and set-returning function joins that a plain subquery cannot express.",
            explanation: {
              heading: 'LATERAL correlated joins',
              intro: 'A LATERAL subquery may reference columns from earlier items in the FROM clause, running once per outer row like a correlated loop.',
              points: [
                { term: 'Reference outer rows', detail: 'Unlike a normal subquery in FROM, a LATERAL one can use columns from the tables listed before it.' },
                { term: 'Top-N per group', detail: 'It cleanly expresses per-row limits, such as fetching the three most recent posts for each user with an inner LIMIT.' },
                { term: 'Join set functions', detail: 'LATERAL is the idiomatic way to join a set-returning function like unnest against each row of a table.' },
                { term: 'CROSS versus LEFT', detail: 'A CROSS JOIN LATERAL drops outer rows with no match, while LEFT JOIN LATERAL with ON true keeps them with nulls.' },
              ],
            },
            example: "SELECT * FROM t, LATERAL unnest(t.arr) AS x;",
          },
          {
            id: 'pg-distinct-on',
            code: "SELECT DISTINCT ON (user_id) user_id, title, created_at\nFROM posts\nORDER BY user_id, created_at DESC;",
            note: "DISTINCT ON (a PostgreSQL extension) keeps the first row per group as defined by the leading ORDER BY columns, a concise way to fetch the latest row per key without window functions.",
            explanation: {
              heading: 'DISTINCT ON per-group rows',
              intro: 'DISTINCT ON is a PostgreSQL extension that keeps only the first row for each distinct value of the listed expressions.',
              points: [
                { term: 'First per group', detail: 'It returns one row per group defined by the DISTINCT ON columns, discarding the rest of each group.' },
                { term: 'ORDER BY decides which', detail: 'The leading ORDER BY columns must match the DISTINCT ON list, and the following columns choose which row survives as the first.' },
                { term: 'Latest-row shortcut', detail: 'Sorting by a timestamp descending after the key is a concise way to grab the most recent record per key.' },
                { term: 'Simpler than windows', detail: 'It often reads more cleanly than a ROW_NUMBER window filtered to rank one, though the window form is more portable.' },
              ],
            },
            example: "SELECT DISTINCT ON (customer_id) * FROM orders ORDER BY customer_id, total DESC;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'pg-generated-columns',
    title: 'Generated Columns',
    level: 1,
    slug: 'generated-columns',
    concepts: [],
    children: [
      {
        id: 'pg-generated-usage',
        title: 'Stored Generated Columns',
        level: 2,
        slug: 'generated-usage',
        concepts: [
          {
            id: 'pg-generated-basic',
            code: "CREATE TABLE orders (\n  price NUMERIC,\n  qty INT,\n  total NUMERIC GENERATED ALWAYS AS (price * qty) STORED\n);",
            note: "PostgreSQL supports STORED generated columns computed from other columns of the same row on write. They cannot reference other rows or use volatile functions.",
            explanation: {
              heading: 'Stored generated columns',
              intro: 'A generated column derives its value from other columns of the same row and is maintained by the database, not by application code.',
              points: [
                { term: 'Computed on write', detail: 'A STORED generated column is calculated and saved whenever the row is inserted or updated, so reads are as fast as any plain column.' },
                { term: 'Same-row only', detail: 'The expression may reference only columns of the current row, so it cannot look up values from other rows or tables.' },
                { term: 'Must be immutable', detail: 'Volatile functions like now or random are disallowed because the stored value must be reproducible from the row data.' },
                { term: 'Read only for callers', detail: 'You cannot write directly to a generated column, which guarantees it always reflects its defining expression.' },
              ],
            },
            example: "ALTER TABLE t ADD area NUMERIC GENERATED ALWAYS AS (w * h) STORED;",
          },
          {
            id: 'pg-materialized-view',
            code: "CREATE MATERIALIZED VIEW sales_by_month AS\nSELECT date_trunc('month', created_at) AS m, sum(total) AS revenue\nFROM orders GROUP BY 1;\nREFRESH MATERIALIZED VIEW CONCURRENTLY sales_by_month;",
            note: "A materialized view stores the query result on disk for fast reads and is refreshed on demand. REFRESH ... CONCURRENTLY (which needs a unique index) avoids locking readers during refresh.",
            explanation: {
              heading: 'Materialized views',
              intro: 'A materialized view caches the result of an expensive query on disk, trading freshness for fast repeated reads.',
              points: [
                { term: 'Stored result', detail: 'Unlike a regular view, a materialized view physically stores its rows, so queries against it avoid recomputing the underlying joins and aggregates.' },
                { term: 'Manual refresh', detail: 'The cached data goes stale as base tables change, so you run REFRESH MATERIALIZED VIEW to recompute it on your own schedule.' },
                { term: 'Concurrent refresh', detail: 'REFRESH with CONCURRENTLY rebuilds the view without blocking readers, but it requires a unique index on the view.' },
                { term: 'Index like a table', detail: 'You can add indexes to a materialized view to speed queries against the cached rows just as you would with a real table.' },
              ],
            },
            example: "CREATE UNIQUE INDEX ON sales_by_month (m);",
          },
        ],
        children: [],
      },
    ],
  },
];

export default topics;
