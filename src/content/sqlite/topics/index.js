// SQLite topic tree.

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  {
    id: 'sqlite-type-affinity',
    title: 'Type Affinity',
    level: 1,
    slug: 'type-affinity',
    concepts: [],
    children: [
      {
        id: 'sqlite-affinity-rules',
        title: 'Dynamic Typing',
        level: 2,
        slug: 'affinity-rules',
        concepts: [
          {
            id: 'sqlite-affinity-basic',
            code: "-- Affinities: TEXT, NUMERIC, INTEGER, REAL, BLOB\nCREATE TABLE flexible (\n  a TEXT,        -- TEXT affinity\n  b VARCHAR(10), -- TEXT affinity\n  c INTEGER,     -- INTEGER affinity\n  d BLOB         -- no affinity\n);",
            note: "SQLite uses dynamic typing: a column has an affinity that guides but does not enforce storage. VARCHAR(100) has TEXT affinity; the length is ignored.",
            explanation: {
              heading: 'How Column Affinity Works',
              intro: 'Unlike most databases, SQLite does not force a value to match its column type. Instead the declared type maps to one of five affinities that gently steer how values are stored.',
              points: [
                { term: 'Affinity not enforcement', detail: 'The declared type is a hint; SQLite will still store a value of a different storage class if it does not match the affinity.' },
                { term: 'Type name matching', detail: 'Affinity is chosen by scanning the declared type string, so VARCHAR, CHAR, and CLOB all resolve to TEXT affinity regardless of any length in parentheses.' },
                { term: 'Length is ignored', detail: 'A width such as the number in VARCHAR(100) has no effect at all; SQLite never truncates or validates string length from the type.' },
                { term: 'Conversion attempts', detail: 'When inserting into a column with NUMERIC or INTEGER affinity, SQLite tries to convert a text value into a number before storing it.' },
              ],
            },
            example: "INSERT INTO flexible (c) VALUES ('123');  -- stored as integer 123",
          },
          {
            id: 'sqlite-strict-tables',
            code: "CREATE TABLE t (\n  id INTEGER,\n  name TEXT\n) STRICT;",
            note: "STRICT tables (SQLite 3.37+) enforce declared types, rejecting mismatched values. Use them when you want rigid typing like other databases.",
            explanation: {
              heading: 'Opting Into Rigid Typing',
              intro: 'STRICT tables turn off SQLite flexible typing for a single table, making it behave more like a traditional relational database that validates every value.',
              points: [
                { term: 'Enforced types', detail: 'Each column value must match its declared type or be NULL, otherwise the write fails with a type error.' },
                { term: 'Limited type set', detail: 'STRICT tables only allow INT, INTEGER, REAL, TEXT, BLOB, and ANY as column types, so vague type names are rejected at creation time.' },
                { term: 'ANY escape hatch', detail: 'Declaring a column as ANY lets it hold any storage class while still living inside a STRICT table.' },
                { term: 'Version requirement', detail: 'STRICT was added in SQLite 3.37, so older engines will not recognise the keyword and will reject the schema.' },
              ],
            },
            example: "INSERT INTO t (id, name) VALUES ('abc', 'x');  -- error under STRICT",
          },
          {
            id: 'sqlite-affinity-storage-classes',
            code: "SELECT typeof(1), typeof(1.0), typeof('a'), typeof(x'00'), typeof(NULL);\n-- integer | real | text | blob | null",
            note: "Every stored value has one of five storage classes: NULL, INTEGER, REAL, TEXT, or BLOB. The typeof() function reports the actual class of a value, which can vary row to row within the same column.",
            explanation: {
              heading: 'The Five Storage Classes',
              intro: 'In SQLite the type belongs to the value, not the column, so a single column can hold different storage classes across different rows.',
              points: [
                { term: 'Value level typing', detail: 'INTEGER, REAL, TEXT, BLOB, and NULL are properties of each individual value rather than of the column that stores it.' },
                { term: 'typeof reports reality', detail: 'The typeof() function returns the true storage class of a value, which is the reliable way to inspect what was actually stored.' },
                { term: 'Rows can differ', detail: 'Because affinity does not enforce a class, two rows in the same column can legitimately report different results from typeof().' },
                { term: 'INTEGER and REAL split', detail: 'Numbers are stored as INTEGER when they have no fractional part and as REAL otherwise, which affects comparisons and arithmetic.' },
              ],
            },
            example: "SELECT typeof(c) FROM flexible;  -- may differ per row",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'sqlite-create-table',
    title: 'Creating Tables',
    level: 1,
    slug: 'create-table',
    concepts: [],
    children: [
      {
        id: 'sqlite-schema',
        title: 'Schema Definition',
        level: 2,
        slug: 'schema',
        concepts: [
          {
            id: 'sqlite-create-basic',
            code: "CREATE TABLE IF NOT EXISTS notes (\n  id INTEGER PRIMARY KEY AUTOINCREMENT,\n  title TEXT NOT NULL,\n  body TEXT DEFAULT '',\n  created_at TEXT DEFAULT (datetime('now'))\n);",
            note: "CREATE TABLE defines columns and constraints. IF NOT EXISTS makes it idempotent. DEFAULT can use expressions like datetime('now') wrapped in parentheses.",
            explanation: {
              heading: 'Defining a Table',
              intro: 'CREATE TABLE lays out the columns, their affinities, and any constraints, forming the core of a SQLite schema stored inside the single database file.',
              points: [
                { term: 'Idempotent creation', detail: 'Adding IF NOT EXISTS lets the statement run safely on startup without error when the table already exists.' },
                { term: 'Expression defaults', detail: 'A DEFAULT can be a constant or an expression such as datetime with the value now, but the expression must be wrapped in parentheses.' },
                { term: 'Inline constraints', detail: 'NOT NULL, UNIQUE, PRIMARY KEY, and CHECK can be declared directly on a column or at the table level.' },
                { term: 'Schema in the file', detail: 'The definition is recorded in the sqlite_schema table inside the same single-file database, so no separate catalog exists.' },
              ],
            },
            example: "CREATE TABLE tags (id INTEGER PRIMARY KEY, label TEXT UNIQUE);",
          },
          {
            id: 'sqlite-generated-columns',
            code: "CREATE TABLE orders (\n  price REAL,\n  qty INTEGER,\n  total REAL GENERATED ALWAYS AS (price * qty) STORED\n);",
            note: "SQLite 3.31+ supports generated columns computed from other columns. VIRTUAL columns are recomputed on read; STORED columns persist on write and can be indexed.",
            explanation: {
              heading: 'Computed Columns',
              intro: 'Generated columns derive their value from an expression over other columns in the same row, letting you store a formula once instead of repeating it in queries.',
              points: [
                { term: 'VIRTUAL by default', detail: 'A VIRTUAL generated column is recomputed every time it is read and uses no extra storage in the database file.' },
                { term: 'STORED persists', detail: 'A STORED column is computed at write time and saved on disk, so it can be indexed and read without recalculation.' },
                { term: 'Same row only', detail: 'The expression may reference other columns of the same row but cannot use subqueries or other rows.' },
                { term: 'Version support', detail: 'Generated columns arrived in SQLite 3.31, so they are unavailable on older builds.' },
              ],
            },
            example: "CREATE TABLE u (email TEXT, domain TEXT AS (substr(email, instr(email,'@')+1)) VIRTUAL);",
          },
          {
            id: 'sqlite-alter-table',
            code: "ALTER TABLE notes ADD COLUMN pinned INTEGER DEFAULT 0;\nALTER TABLE notes RENAME COLUMN body TO content;\nALTER TABLE notes RENAME TO memos;",
            note: "SQLite's ALTER TABLE is limited: it can add a column, rename a column (3.25+), or rename the table. To drop or change a column, recreate the table and copy data.",
            explanation: {
              heading: 'Limited Schema Changes',
              intro: 'SQLite ALTER TABLE supports only a small set of operations compared to server databases, reflecting its lightweight single-file design.',
              points: [
                { term: 'Add and rename', detail: 'You can add a new column, rename an existing column from version 3.25, and rename the whole table.' },
                { term: 'Drop column later', detail: 'Dropping a column was only added in SQLite 3.35 and is not available on earlier engines.' },
                { term: 'Rebuild for the rest', detail: 'To change a column type or reorder columns you create a new table, copy the data across, then drop and rename.' },
                { term: 'Added columns need care', detail: 'A newly added column must be nullable or carry a constant default, since existing rows cannot run an arbitrary expression.' },
              ],
            },
            example: "ALTER TABLE memos DROP COLUMN pinned;  -- supported in 3.35+",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'sqlite-primary-key-rowid',
    title: 'PRIMARY KEY and ROWID',
    level: 1,
    slug: 'primary-key-rowid',
    concepts: [],
    children: [
      {
        id: 'sqlite-rowid',
        title: 'ROWID Tables',
        level: 2,
        slug: 'rowid',
        concepts: [
          {
            id: 'sqlite-rowid-alias',
            code: "CREATE TABLE items (\n  id INTEGER PRIMARY KEY,  -- alias for rowid\n  name TEXT\n);\nSELECT rowid, * FROM items;",
            note: "An INTEGER PRIMARY KEY column becomes an alias for the hidden rowid, giving fast lookups. AUTOINCREMENT prevents reuse of deleted ids but adds overhead.",
            explanation: {
              heading: 'The rowid Alias',
              intro: 'Ordinary SQLite tables carry a hidden 64-bit rowid key, and declaring INTEGER PRIMARY KEY simply aliases that internal key for direct, fast access.',
              points: [
                { term: 'Exact alias rule', detail: 'Only the exact type INTEGER PRIMARY KEY becomes the rowid alias; writing BIGINT or INT PRIMARY KEY creates a separate ordinary column.' },
                { term: 'Fast primary lookups', detail: 'Because the rowid is the b-tree key, lookups by the aliased column are the fastest possible path to a row.' },
                { term: 'Automatic assignment', detail: 'If you omit the id on insert, SQLite assigns the next available rowid, which you can read with last_insert_rowid.' },
                { term: 'Reuse without AUTOINCREMENT', detail: 'Without AUTOINCREMENT, SQLite is free to reuse the rowids of deleted rows.' },
              ],
            },
            example: "SELECT last_insert_rowid();",
          },
          {
            id: 'sqlite-autoincrement-tradeoff',
            code: "CREATE TABLE log (\n  id INTEGER PRIMARY KEY AUTOINCREMENT,\n  msg TEXT\n);\n-- AUTOINCREMENT tracks max id in sqlite_sequence",
            note: "Without AUTOINCREMENT, SQLite may reuse rowids from deleted rows. AUTOINCREMENT guarantees monotonically increasing ids by tracking state in sqlite_sequence, at a small cost.",
            explanation: {
              heading: 'AUTOINCREMENT Tradeoffs',
              intro: 'AUTOINCREMENT changes how SQLite chooses new rowids, guaranteeing that ids never decrease at the price of extra bookkeeping.',
              points: [
                { term: 'No reuse guarantee', detail: 'With AUTOINCREMENT a deleted rowid is never handed out again, so ids strictly increase over the life of the table.' },
                { term: 'sqlite_sequence table', detail: 'SQLite tracks the largest ever id per table in an internal sqlite_sequence table that it updates on each insert.' },
                { term: 'Extra cost', detail: 'The bookkeeping adds a small read and write per insert, so it should be used only when non-reuse actually matters.' },
                { term: 'Default is enough', detail: 'For most tables the default rowid behaviour is faster and still produces unique, generally increasing ids.' },
              ],
            },
            example: "SELECT * FROM sqlite_sequence WHERE name = 'log';",
          },
        ],
        children: [],
      },
      {
        id: 'sqlite-without-rowid',
        title: 'WITHOUT ROWID',
        level: 2,
        slug: 'without-rowid',
        concepts: [
          {
            id: 'sqlite-without-rowid-basic',
            code: "CREATE TABLE kv (\n  key TEXT PRIMARY KEY,\n  value TEXT\n) WITHOUT ROWID;",
            note: "WITHOUT ROWID tables store rows in a B-tree keyed by the primary key instead of a hidden rowid, saving space and speeding lookups for non-integer keys.",
            explanation: {
              heading: 'Clustered Primary Key Storage',
              intro: 'A WITHOUT ROWID table drops the hidden rowid and instead clusters the actual row data directly on the declared primary key.',
              points: [
                { term: 'Primary key required', detail: 'These tables must declare an explicit PRIMARY KEY because there is no rowid to fall back on.' },
                { term: 'Clustered layout', detail: 'Rows are stored in a single b-tree ordered by the primary key, so no separate rowid index is maintained.' },
                { term: 'Space savings', detail: 'For tables with a natural key this avoids duplicating the key in a secondary index and reduces file size.' },
                { term: 'Direct key lookups', detail: 'Searching by the primary key goes straight to the data without an extra indirection through a rowid.' },
              ],
            },
            example: "CREATE TABLE lookup (code TEXT PRIMARY KEY, name TEXT) WITHOUT ROWID;",
          },
          {
            id: 'sqlite-without-rowid-when',
            code: "-- Good fit: natural text/composite key, many small rows\nCREATE TABLE settings (\n  scope TEXT,\n  key   TEXT,\n  value TEXT,\n  PRIMARY KEY (scope, key)\n) WITHOUT ROWID;",
            note: "WITHOUT ROWID is best when the primary key is a natural non-integer or composite key and rows are small. It avoids the extra rowid index but requires an explicit PRIMARY KEY.",
            explanation: {
              heading: 'When To Choose WITHOUT ROWID',
              intro: 'WITHOUT ROWID is a targeted optimisation that pays off for specific shapes of data rather than being a universal default.',
              points: [
                { term: 'Natural keys', detail: 'It shines when the primary key is a text or composite key you would query on anyway, avoiding a redundant rowid.' },
                { term: 'Small rows', detail: 'The design works best when rows are small; large rows can hurt because the whole row lives in the key b-tree.' },
                { term: 'Composite keys', detail: 'Multi-column primary keys, common in join and settings tables, map naturally onto the clustered layout.' },
                { term: 'Not always faster', detail: 'For integer surrogate keys an ordinary rowid table is usually simpler and at least as fast.' },
              ],
            },
            example: "SELECT value FROM settings WHERE scope = 'ui' AND key = 'theme';",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'sqlite-constraints',
    title: 'Constraints',
    level: 1,
    slug: 'constraints',
    concepts: [],
    children: [
      {
        id: 'sqlite-constraints-usage',
        title: 'Keys, Checks, Foreign Keys',
        level: 2,
        slug: 'constraints-usage',
        concepts: [
          {
            id: 'sqlite-fk',
            code: "PRAGMA foreign_keys = ON;\nCREATE TABLE orders (\n  id INTEGER PRIMARY KEY,\n  customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE\n);",
            note: "SQLite enforces foreign keys only when PRAGMA foreign_keys = ON (off by default per connection). CHECK, UNIQUE, and NOT NULL work as in standard SQL.",
            explanation: {
              heading: 'Constraints and Foreign Keys',
              intro: 'SQLite supports the usual SQL constraints, but foreign key enforcement is a per-connection setting that is switched off by default for backward compatibility.',
              points: [
                { term: 'FK off by default', detail: 'Foreign key checks only run when you issue PRAGMA foreign_keys equal to ON, and the setting resets for each new connection.' },
                { term: 'Referential actions', detail: 'Clauses like ON DELETE CASCADE or ON DELETE SET NULL define how child rows react when a parent row changes or is removed.' },
                { term: 'Standard constraints', detail: 'CHECK, UNIQUE, and NOT NULL behave as in standard SQL and are always enforced regardless of the pragma.' },
                { term: 'Set it early', detail: 'Because the pragma is connection scoped, applications typically enable it immediately after opening the database.' },
              ],
            },
            example: "CREATE TABLE t (age INTEGER CHECK (age >= 0));",
          },
          {
            id: 'sqlite-conflict-clause',
            code: "CREATE TABLE users (\n  email TEXT UNIQUE ON CONFLICT IGNORE,\n  name TEXT NOT NULL ON CONFLICT REPLACE DEFAULT 'anon'\n);",
            note: "SQLite lets you attach an ON CONFLICT resolution (ROLLBACK, ABORT, FAIL, IGNORE, REPLACE) directly to a constraint, controlling what happens when it is violated.",
            explanation: {
              heading: 'Constraint Conflict Policies',
              intro: 'SQLite offers a per-constraint conflict clause, a feature specific to SQLite, that decides what happens the moment a constraint is broken.',
              points: [
                { term: 'Five resolutions', detail: 'The choices are ROLLBACK, ABORT, FAIL, IGNORE, and REPLACE, each handling a violation differently.' },
                { term: 'ABORT is default', detail: 'Without a clause the default is ABORT, which undoes the current statement but keeps the surrounding transaction.' },
                { term: 'IGNORE skips rows', detail: 'IGNORE lets the offending row be silently skipped while the rest of the statement continues.' },
                { term: 'REPLACE overwrites', detail: 'REPLACE deletes the existing conflicting row and inserts the new one, which can trigger cascading deletes.' },
              ],
            },
            example: "INSERT INTO users (email) VALUES ('dup@x.com');  -- silently ignored if duplicate",
          },
          {
            id: 'sqlite-composite-unique',
            code: "CREATE TABLE enrollments (\n  student_id INTEGER,\n  course_id INTEGER,\n  UNIQUE (student_id, course_id)\n);",
            note: "A table-level UNIQUE constraint over multiple columns forbids duplicate combinations while allowing repeats in any single column. This models many-to-many join tables cleanly.",
            explanation: {
              heading: 'Composite Unique Constraints',
              intro: 'A UNIQUE constraint spanning several columns enforces uniqueness of the combination, not of each column on its own.',
              points: [
                { term: 'Combination uniqueness', detail: 'Only the full tuple of listed columns must be unique, so any individual column can repeat freely.' },
                { term: 'Join table modelling', detail: 'This is the natural way to prevent duplicate pairings in a many-to-many link table such as enrollments.' },
                { term: 'Backed by an index', detail: 'SQLite implements the constraint with an automatic unique index, which also speeds up lookups on those columns.' },
                { term: 'NULL handling', detail: 'Following SQL rules, NULLs are treated as distinct, so multiple rows with a NULL in the key can coexist.' },
              ],
            },
            example: "INSERT INTO enrollments VALUES (1, 10);  -- second identical pair rejected",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'sqlite-dml',
    title: 'INSERT, UPDATE, DELETE',
    level: 1,
    slug: 'dml',
    concepts: [],
    children: [
      {
        id: 'sqlite-dml-usage',
        title: 'Modifying Data',
        level: 2,
        slug: 'dml-usage',
        concepts: [
          {
            id: 'sqlite-insert',
            code: "INSERT INTO notes (title, body) VALUES ('First', 'hello');\nUPDATE notes SET body = 'edited' WHERE id = 1;\nDELETE FROM notes WHERE id = 1;",
            note: "INSERT/UPDATE/DELETE work as in standard SQL. INSERT supports multiple value tuples and INSERT ... SELECT. Always scope UPDATE/DELETE with WHERE.",
            explanation: {
              heading: 'Modifying Rows',
              intro: 'The three data manipulation statements follow standard SQL in SQLite, with a few conveniences for bulk work and some safety habits worth keeping.',
              points: [
                { term: 'Multi-row insert', detail: 'A single INSERT can supply several value tuples separated by commas, which is far faster than one statement per row.' },
                { term: 'Insert from select', detail: 'INSERT with a SELECT copies rows from a query result, handy for archiving or transforming data.' },
                { term: 'Scope with WHERE', detail: 'An UPDATE or DELETE without a WHERE clause silently touches every row, so always constrain them.' },
                { term: 'Wrap in transactions', detail: 'Grouping many changes in one transaction avoids fsyncing per statement and is dramatically faster.' },
              ],
            },
            example: "INSERT INTO notes (title) VALUES ('a'), ('b'), ('c');",
          },
          {
            id: 'sqlite-insert-or',
            code: "INSERT OR REPLACE INTO users (id, email) VALUES (1, 'a@x.com');\nINSERT OR IGNORE INTO users (id, email) VALUES (1, 'dup@x.com');",
            note: "The INSERT OR variants apply a conflict policy inline: REPLACE overwrites the conflicting row, IGNORE skips it, and ABORT (default) fails the statement. REPLACE deletes then re-inserts.",
            explanation: {
              heading: 'INSERT OR Conflict Handling',
              intro: 'The INSERT OR forms attach a conflict resolution to a single statement, a SQLite shorthand that overrides any policy declared on the constraints.',
              points: [
                { term: 'Inline policy', detail: 'Writing INSERT OR REPLACE or INSERT OR IGNORE sets the conflict behaviour for just that one statement.' },
                { term: 'REPLACE is destructive', detail: 'REPLACE deletes the conflicting row and inserts a fresh one, which resets defaults and can fire delete triggers.' },
                { term: 'IGNORE for skip', detail: 'IGNORE quietly discards rows that would violate a constraint while inserting the rest.' },
                { term: 'Prefer upsert', detail: 'When you want to update specific columns instead of replacing the whole row, ON CONFLICT DO UPDATE is usually the better tool.' },
              ],
            },
            example: "INSERT OR IGNORE INTO tags (label) VALUES ('sql');",
          },
          {
            id: 'sqlite-returning',
            code: "INSERT INTO notes (title) VALUES ('Draft')\nRETURNING id, created_at;",
            note: "SQLite 3.35+ supports a RETURNING clause on INSERT, UPDATE, and DELETE, returning columns from affected rows without a follow-up SELECT.",
            explanation: {
              heading: 'Returning Affected Rows',
              intro: 'The RETURNING clause lets a write statement hand back data from the rows it changed, saving a separate query round trip.',
              points: [
                { term: 'Works on all writes', detail: 'RETURNING can be added to INSERT, UPDATE, and DELETE to report the rows each touched.' },
                { term: 'Read generated values', detail: 'It is ideal for capturing auto-assigned ids or expression defaults such as a created timestamp immediately after insert.' },
                { term: 'Any expression', detail: 'The clause can return columns or computed expressions over the affected row, similar to a SELECT list.' },
                { term: 'Version requirement', detail: 'RETURNING was introduced in SQLite 3.35, so earlier engines still need a follow-up SELECT.' },
              ],
            },
            example: "DELETE FROM notes WHERE id = 5 RETURNING title;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'sqlite-select-joins',
    title: 'SELECT and Joins',
    level: 1,
    slug: 'select-joins',
    concepts: [],
    children: [
      {
        id: 'sqlite-select-usage',
        title: 'Querying and Joining',
        level: 2,
        slug: 'select-usage',
        concepts: [
          {
            id: 'sqlite-join-basic',
            code: "SELECT n.title, u.name\nFROM notes n\nJOIN users u ON u.id = n.user_id\nWHERE u.active = 1\nORDER BY n.created_at DESC;",
            note: "SQLite supports INNER, LEFT, and CROSS joins. RIGHT and FULL OUTER joins were added in 3.39. Booleans are stored as integers 0/1.",
            explanation: {
              heading: 'Joining Tables',
              intro: 'SQLite joins follow standard SQL semantics, though the set of outer join types available depends on the engine version.',
              points: [
                { term: 'Core join types', detail: 'INNER, LEFT OUTER, and CROSS joins have long been supported and cover most query needs.' },
                { term: 'Newer outer joins', detail: 'RIGHT OUTER and FULL OUTER joins were added in SQLite 3.39, so older versions must rewrite them as LEFT joins.' },
                { term: 'Booleans as integers', detail: 'SQLite has no native boolean type, so true and false are stored as the integers 1 and 0.' },
                { term: 'Filter in ON or WHERE', detail: 'For outer joins, placing a condition in ON versus WHERE changes whether unmatched rows survive.' },
              ],
            },
            example: "SELECT * FROM a LEFT JOIN b ON a.k = b.k;",
          },
          {
            id: 'sqlite-window-functions',
            code: "SELECT title, user_id,\n  ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS rn\nFROM notes;",
            note: "SQLite 3.25+ supports window functions with OVER: ROW_NUMBER, RANK, LAG, LEAD, and running aggregates. They compute across related rows without collapsing the result.",
            explanation: {
              heading: 'Window Functions',
              intro: 'Window functions compute a value over a set of rows related to the current row while still returning every row, unlike a grouping aggregate.',
              points: [
                { term: 'OVER clause', detail: 'The OVER clause defines the window, optionally with PARTITION BY to segment rows and ORDER BY to sequence them.' },
                { term: 'Ranking functions', detail: 'ROW_NUMBER, RANK, and DENSE_RANK number or rank rows within each partition.' },
                { term: 'Offset access', detail: 'LAG and LEAD read a value from a previous or following row, useful for comparing sequential records.' },
                { term: 'Running aggregates', detail: 'Ordinary aggregates like SUM become running totals when given an ORDER BY inside OVER.' },
              ],
            },
            example: "SELECT *, SUM(amt) OVER (ORDER BY id) AS running FROM ledger;",
          },
          {
            id: 'sqlite-cte',
            code: "WITH recent AS (\n  SELECT * FROM notes WHERE created_at > datetime('now','-7 days')\n)\nSELECT user_id, COUNT(*) FROM recent GROUP BY user_id;",
            note: "Common table expressions (WITH) name a subquery for readability and reuse. SQLite also supports WITH RECURSIVE for walking hierarchies and generating sequences.",
            explanation: {
              heading: 'Common Table Expressions',
              intro: 'A common table expression names a temporary result set with WITH, making complex queries easier to read and enabling recursion.',
              points: [
                { term: 'Named subquery', detail: 'A CTE gives a subquery a name you can reference in the main statement, avoiding deeply nested queries.' },
                { term: 'Reuse in one query', detail: 'The named result can be referenced multiple times within the same statement for clarity.' },
                { term: 'Recursive form', detail: 'WITH RECURSIVE unions a base case with a self referencing step, ideal for tree traversal and generating series.' },
                { term: 'Termination needed', detail: 'A recursive CTE must include a condition that eventually stops adding rows or it will loop indefinitely.' },
              ],
            },
            example: "WITH RECURSIVE c(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM c WHERE n<5) SELECT n FROM c;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'sqlite-indexes',
    title: 'Indexes',
    level: 1,
    slug: 'indexes',
    concepts: [],
    children: [
      {
        id: 'sqlite-indexes-usage',
        title: 'Creating Indexes',
        level: 2,
        slug: 'indexes-usage',
        concepts: [
          {
            id: 'sqlite-index-basic',
            code: "CREATE INDEX idx_notes_user ON notes(user_id);\nCREATE UNIQUE INDEX idx_email ON users(email);\nCREATE INDEX idx_active ON users(email) WHERE active = 1;",
            note: "Indexes speed up filtering and joining. SQLite supports composite, unique, partial (WHERE), and expression indexes. Use EXPLAIN QUERY PLAN to confirm usage.",
            explanation: {
              heading: 'Index Varieties',
              intro: 'Indexes let SQLite locate rows without scanning the whole table, and the engine offers several flavours for different query shapes.',
              points: [
                { term: 'Composite indexes', detail: 'An index over several columns accelerates queries that filter on a leading prefix of those columns.' },
                { term: 'Partial indexes', detail: 'Adding a WHERE clause to CREATE INDEX indexes only matching rows, shrinking the index and speeding targeted queries.' },
                { term: 'Expression indexes', detail: 'You can index the result of an expression so queries filtering on that same expression can use the index.' },
                { term: 'Verify with the planner', detail: 'EXPLAIN QUERY PLAN reveals whether a query actually uses an index or falls back to a full scan.' },
              ],
            },
            example: "EXPLAIN QUERY PLAN SELECT * FROM notes WHERE user_id = 5;",
          },
          {
            id: 'sqlite-covering-index',
            code: "CREATE INDEX idx_cover ON notes(user_id, created_at, title);\n-- query can be answered from the index alone\nSELECT title FROM notes WHERE user_id = 5 ORDER BY created_at;",
            note: "A covering index includes every column a query needs, so SQLite reads only the index and skips the table b-tree. EXPLAIN QUERY PLAN shows 'USING COVERING INDEX'.",
            explanation: {
              heading: 'Covering Indexes',
              intro: 'A covering index holds every column a query touches, letting SQLite answer entirely from the index and skip reading the main table b-tree.',
              points: [
                { term: 'All columns present', detail: 'The index must contain both the filtered columns and any columns the query selects for it to be covering.' },
                { term: 'Skips the table', detail: 'Because the data lives in the index, SQLite avoids the extra lookup into the table, reducing input and output.' },
                { term: 'Planner confirmation', detail: 'EXPLAIN QUERY PLAN reports USING COVERING INDEX when the optimisation applies.' },
                { term: 'Column order matters', detail: 'Placing filter columns first and selected columns after keeps the index usable for both searching and covering.' },
              ],
            },
            example: "EXPLAIN QUERY PLAN SELECT title FROM notes WHERE user_id = 5;",
          },
          {
            id: 'sqlite-analyze',
            code: "ANALYZE;\n-- gathers statistics into sqlite_stat1 for the planner",
            note: "ANALYZE collects statistics about index selectivity into sqlite_stat1, helping the query planner pick better indexes. Rerun it after large data changes.",
            explanation: {
              heading: 'Gathering Planner Statistics',
              intro: 'ANALYZE measures how selective each index is and stores that knowledge so the query planner can make smarter choices.',
              points: [
                { term: 'Writes sqlite_stat1', detail: 'The command records distribution statistics into the sqlite_stat1 table that the planner consults.' },
                { term: 'Better index choices', detail: 'With accurate statistics SQLite can prefer a highly selective index over a poor one or a full scan.' },
                { term: 'Rerun after changes', detail: 'Statistics drift as data grows or shifts, so re-running ANALYZE after large modifications keeps plans sharp.' },
                { term: 'Scope options', detail: 'You can analyse the whole database, a single table, or a single index depending on what changed.' },
              ],
            },
            example: "ANALYZE notes;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'sqlite-views',
    title: 'Views',
    level: 1,
    slug: 'views',
    concepts: [],
    children: [
      {
        id: 'sqlite-views-usage',
        title: 'Creating Views',
        level: 2,
        slug: 'views-usage',
        concepts: [
          {
            id: 'sqlite-view-basic',
            code: "CREATE VIEW recent_notes AS\nSELECT id, title FROM notes\nWHERE created_at > datetime('now', '-7 days');",
            note: "Views are stored read-only queries in SQLite. Use INSTEAD OF triggers if you need to make a view writable.",
            explanation: {
              heading: 'Read-Only Views',
              intro: 'A view is a named saved query that behaves like a virtual table for reading, packaging complex logic behind a simple name.',
              points: [
                { term: 'Stored query', detail: 'The view definition holds a SELECT statement that runs whenever the view is queried, so results always reflect current data.' },
                { term: 'Read only by default', detail: 'In SQLite you cannot INSERT, UPDATE, or DELETE directly against a plain view.' },
                { term: 'Simplifies access', detail: 'Views hide joins and filters, giving callers a clean, consistent interface to underlying tables.' },
                { term: 'Writable via triggers', detail: 'Attaching INSTEAD OF triggers is the only way to make writes through a view work.' },
              ],
            },
            example: "SELECT * FROM recent_notes;",
          },
          {
            id: 'sqlite-instead-of-view',
            code: "CREATE VIEW active_users AS SELECT id, name FROM users WHERE active = 1;\nCREATE TRIGGER active_users_ins INSTEAD OF INSERT ON active_users\nBEGIN\n  INSERT INTO users (name, active) VALUES (NEW.name, 1);\nEND;",
            note: "An INSTEAD OF trigger intercepts INSERT/UPDATE/DELETE on a view and runs custom logic against base tables, effectively making the view writable.",
            explanation: {
              heading: 'Writable Views With Triggers',
              intro: 'INSTEAD OF triggers replace the default write behaviour on a view, letting you translate a write into concrete changes on base tables.',
              points: [
                { term: 'Intercepts writes', detail: 'The trigger fires instead of the attempted INSERT, UPDATE, or DELETE on the view rather than after it.' },
                { term: 'NEW and OLD rows', detail: 'Inside the trigger, NEW and OLD expose the incoming and existing values you route to the underlying tables.' },
                { term: 'View only', detail: 'INSTEAD OF triggers can be defined only on views, not on ordinary tables.' },
                { term: 'Custom logic', detail: 'You can validate, transform, or fan out a single view write across several base tables.' },
              ],
            },
            example: "INSERT INTO active_users (name) VALUES ('Ada');",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'sqlite-transactions',
    title: 'Transactions',
    level: 1,
    slug: 'transactions',
    concepts: [],
    children: [
      {
        id: 'sqlite-transactions-usage',
        title: 'Atomic Writes',
        level: 2,
        slug: 'transactions-usage',
        concepts: [
          {
            id: 'sqlite-transaction-basic',
            code: "BEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;",
            note: "SQLite transactions are ACID and file-level. Wrapping many inserts in one transaction is dramatically faster than committing each. Use ROLLBACK to abort.",
            explanation: {
              heading: 'ACID Transactions',
              intro: 'SQLite gives full ACID transactions over its single database file, so a batch of changes either all succeed or all roll back.',
              points: [
                { term: 'All or nothing', detail: 'Everything between BEGIN and COMMIT is atomic, and ROLLBACK discards the whole batch if anything goes wrong.' },
                { term: 'Batch for speed', detail: 'Because each COMMIT flushes to disk, grouping many writes into one transaction is dramatically faster than autocommitting each.' },
                { term: 'File level locking', detail: 'SQLite coordinates access with locks on the database file, which shapes how concurrent writers behave.' },
                { term: 'Autocommit default', detail: 'Without an explicit BEGIN, every statement runs in its own implicit transaction.' },
              ],
            },
            example: "BEGIN; INSERT INTO log(msg) VALUES ('x'); ROLLBACK;",
          },
          {
            id: 'sqlite-savepoints',
            code: "BEGIN;\nINSERT INTO log(msg) VALUES ('a');\nSAVEPOINT sp1;\nINSERT INTO log(msg) VALUES ('b');\nROLLBACK TO sp1;  -- undoes 'b', keeps 'a'\nCOMMIT;",
            note: "SAVEPOINT creates a named checkpoint inside a transaction. ROLLBACK TO undoes work done after it without aborting the whole transaction; RELEASE discards the savepoint.",
            explanation: {
              heading: 'Nested Savepoints',
              intro: 'Savepoints add named checkpoints within a transaction so you can undo part of the work without abandoning everything.',
              points: [
                { term: 'Named checkpoint', detail: 'SAVEPOINT gives a marker a name that you can later roll back to or release.' },
                { term: 'Partial rollback', detail: 'ROLLBACK TO a savepoint undoes changes made after it while keeping earlier work and the transaction open.' },
                { term: 'RELEASE merges', detail: 'RELEASE removes the savepoint and folds its changes into the enclosing transaction or savepoint.' },
                { term: 'Nestable', detail: 'Savepoints can be stacked, letting complex operations manage independent, rewindable sub-steps.' },
              ],
            },
            example: "SAVEPOINT batch; RELEASE batch;",
          },
          {
            id: 'sqlite-immediate-deferred',
            code: "BEGIN IMMEDIATE;  -- acquires a write lock right away\nUPDATE accounts SET balance = balance - 10 WHERE id = 1;\nCOMMIT;",
            note: "BEGIN DEFERRED (the default) delays locking until first access; BEGIN IMMEDIATE takes a write lock immediately, avoiding SQLITE_BUSY under concurrency at the cost of earlier blocking.",
            explanation: {
              heading: 'Transaction Locking Modes',
              intro: 'The way a transaction begins decides when SQLite acquires its locks, which strongly affects behaviour under concurrent writers.',
              points: [
                { term: 'DEFERRED default', detail: 'BEGIN DEFERRED takes no lock until the first read or write, maximising concurrency but risking a later busy error.' },
                { term: 'IMMEDIATE write lock', detail: 'BEGIN IMMEDIATE grabs a write lock at once, so if it succeeds the transaction will not hit SQLITE_BUSY on upgrade.' },
                { term: 'Avoiding busy errors', detail: 'For write heavy critical sections, starting IMMEDIATE prevents a mid-transaction failure when another writer holds the lock.' },
                { term: 'Earlier blocking cost', detail: 'The tradeoff is that IMMEDIATE blocks other writers sooner, reducing overall concurrency.' },
              ],
            },
            example: "BEGIN IMMEDIATE; -- good for write-heavy critical sections",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'sqlite-functions',
    title: 'Built-in Functions',
    level: 1,
    slug: 'functions',
    concepts: [],
    children: [
      {
        id: 'sqlite-functions-usage',
        title: 'Common Functions',
        level: 2,
        slug: 'functions-usage',
        concepts: [
          {
            id: 'sqlite-fns-basic',
            code: "SELECT upper(name),\n       length(name),\n       substr(name, 1, 3),\n       coalesce(nickname, name) AS display\nFROM users;",
            note: "Core scalar functions include upper/lower, length, substr, replace, coalesce, and ifnull. Date/time functions use datetime, date, strftime with modifiers.",
            explanation: {
              heading: 'Core Scalar Functions',
              intro: 'SQLite ships a compact set of built-in scalar functions that operate on a single value and cover the most common text and null handling needs.',
              points: [
                { term: 'Text helpers', detail: 'Functions like upper, lower, length, substr, and replace transform and inspect text values.' },
                { term: 'Null coalescing', detail: 'coalesce returns the first non-null argument and ifnull substitutes a fallback when a value is null.' },
                { term: 'Affinity awareness', detail: 'Because of dynamic typing, functions such as length behave differently on TEXT versus BLOB values.' },
                { term: 'Date and time', detail: 'Date handling is done through date, datetime, and strftime rather than a dedicated date type.' },
              ],
            },
            example: "SELECT strftime('%Y-%m', created_at) AS month FROM notes;",
          },
          {
            id: 'sqlite-datetime-fns',
            code: "SELECT date('now'),\n       datetime('now', 'localtime'),\n       datetime('now', '+1 day', 'start of month'),\n       julianday('now') - julianday(created_at) AS age_days\nFROM notes;",
            note: "SQLite has no dedicated date type; dates are TEXT/REAL/INTEGER manipulated by date(), datetime(), julianday(), and strftime() with modifiers like '+1 day' or 'start of month'.",
            explanation: {
              heading: 'Working With Dates',
              intro: 'SQLite has no built-in date or time type, so it represents temporal values as text, real, or integer numbers interpreted by dedicated functions.',
              points: [
                { term: 'Three storage formats', detail: 'A date can be an ISO text string, a Julian day as a REAL, or a Unix timestamp as an INTEGER.' },
                { term: 'Conversion functions', detail: 'date, datetime, julianday, and strftime read those formats and produce formatted or numeric results.' },
                { term: 'Modifiers', detail: 'Arguments such as the string plus one day or start of month shift a value, and they can be chained.' },
                { term: 'Format with strftime', detail: 'strftime with format codes extracts pieces like year, month, or day of week from a stored value.' },
              ],
            },
            example: "SELECT strftime('%w', 'now');  -- day of week 0-6",
          },
          {
            id: 'sqlite-aggregate-fns',
            code: "SELECT user_id,\n       COUNT(*) AS n,\n       group_concat(title, '; ') AS titles\nFROM notes\nGROUP BY user_id;",
            note: "Aggregate functions include COUNT, SUM, AVG, MIN, MAX, and group_concat, which joins grouped text values with an optional separator. total() returns a float sum even over NULLs.",
            explanation: {
              heading: 'Aggregate Functions',
              intro: 'Aggregates collapse many rows into a single summary value, usually paired with GROUP BY to summarise each group.',
              points: [
                { term: 'Standard aggregates', detail: 'COUNT, SUM, AVG, MIN, and MAX compute the common numeric and counting summaries.' },
                { term: 'group_concat', detail: 'group_concat joins the text of grouped rows with an optional separator, handy for compact lists.' },
                { term: 'SUM versus total', detail: 'SUM can return null over only-null input while total always returns a floating point value, even zero.' },
                { term: 'DISTINCT inside', detail: 'Most aggregates accept DISTINCT to consider only unique values, for example counting distinct users.' },
              ],
            },
            example: "SELECT group_concat(DISTINCT tag) FROM note_tags;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'sqlite-json1',
    title: 'JSON1 Extension',
    level: 1,
    slug: 'json1',
    concepts: [],
    children: [
      {
        id: 'sqlite-json-usage',
        title: 'JSON Functions',
        level: 2,
        slug: 'json-usage',
        concepts: [
          {
            id: 'sqlite-json-basic',
            code: "SELECT json_extract(metadata, '$.author') AS author\nFROM documents\nWHERE json_extract(metadata, '$.year') > 2020;",
            note: "The built-in JSON1 functions parse and query JSON text columns. json_extract reads a path, json_set updates one, and json_each expands arrays/objects into rows.",
            explanation: {
              heading: 'Querying JSON Columns',
              intro: 'The JSON1 functions, now built in by default, let SQLite treat text columns as JSON documents you can read and reshape inside SQL.',
              points: [
                { term: 'Path extraction', detail: 'json_extract pulls a value out of a JSON document using a path expression starting with a dollar sign.' },
                { term: 'In place updates', detail: 'json_set, json_insert, and json_replace return a new JSON string with a path modified.' },
                { term: 'Expand to rows', detail: 'json_each is a table valued function that turns a JSON array or object into one row per element for joining.' },
                { term: 'Stored as text', detail: 'JSON is kept as ordinary text, so validity is only checked by the JSON functions, not enforced by the column.' },
              ],
            },
            example: "SELECT value FROM documents, json_each(documents.tags);",
          },
          {
            id: 'sqlite-json-arrow',
            code: "SELECT metadata -> '$.author' AS json_author,\n       metadata ->> '$.author' AS text_author\nFROM documents;",
            note: "SQLite 3.38+ adds the -> and ->> operators as shorthand for json_extract: -> returns a JSON value, ->> returns a plain SQL text/number, mirroring MySQL and PostgreSQL syntax.",
            explanation: {
              heading: 'JSON Arrow Operators',
              intro: 'The arrow operators are concise shorthands for json_extract, added to match the syntax popularised by MySQL and PostgreSQL.',
              points: [
                { term: 'Single arrow', detail: 'The single arrow returns the extracted value as a JSON representation, keeping quotes and structure.' },
                { term: 'Double arrow', detail: 'The double arrow returns a plain SQL text or number, unwrapping the JSON so it is ready to use directly.' },
                { term: 'Path on the right', detail: 'The right operand is a JSON path, and a bare key is also accepted as a convenience.' },
                { term: 'Version support', detail: 'Both operators arrived in SQLite 3.38, so older engines must call json_extract explicitly.' },
              ],
            },
            example: "SELECT metadata ->> '$.year' FROM documents;",
          },
          {
            id: 'sqlite-json-build',
            code: "SELECT json_object('id', id, 'title', title) AS doc,\n       json_group_array(title) AS all_titles\nFROM notes;",
            note: "json_object and json_array build JSON from columns; json_group_array and json_group_object aggregate rows into a JSON array or object, useful for API responses.",
            explanation: {
              heading: 'Building JSON Output',
              intro: 'SQLite can assemble JSON on the fly from query results, which is handy when the database directly feeds an API layer.',
              points: [
                { term: 'Per row builders', detail: 'json_object builds an object from key and value pairs while json_array builds an array from a list of values.' },
                { term: 'Aggregating builders', detail: 'json_group_array and json_group_object are aggregates that gather many rows into one JSON array or object.' },
                { term: 'Nesting', detail: 'These functions compose, so you can wrap json_object inside json_group_array to produce a list of records.' },
                { term: 'API friendly', detail: 'Returning JSON straight from a query can remove a serialization step in the application.' },
              ],
            },
            example: "SELECT json_group_array(json_object('id', id, 'title', title)) FROM notes;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'sqlite-upsert',
    title: 'UPSERT',
    level: 1,
    slug: 'upsert',
    concepts: [],
    children: [
      {
        id: 'sqlite-upsert-usage',
        title: 'ON CONFLICT',
        level: 2,
        slug: 'upsert-usage',
        concepts: [
          {
            id: 'sqlite-upsert-basic',
            code: "INSERT INTO counters (name, hits) VALUES ('home', 1)\nON CONFLICT(name)\nDO UPDATE SET hits = hits + 1;",
            note: "SQLite 3.24+ supports upsert via INSERT ... ON CONFLICT. Provide the conflicting column(s) and DO NOTHING or DO UPDATE, referencing new values with excluded.",
            explanation: {
              heading: 'Insert Or Update',
              intro: 'Upsert lets a single statement insert a new row or update the existing one when a uniqueness conflict occurs, avoiding read-then-write logic.',
              points: [
                { term: 'Conflict target', detail: 'You name the column or constraint that may conflict so SQLite knows which existing row to consider.' },
                { term: 'DO NOTHING or UPDATE', detail: 'On conflict you either skip the insert with DO NOTHING or modify the existing row with DO UPDATE.' },
                { term: 'The excluded row', detail: 'Inside DO UPDATE, the excluded prefix refers to the values that failed to insert so you can copy them in.' },
                { term: 'Version support', detail: 'Upsert was introduced in SQLite 3.24 and follows the syntax pioneered by PostgreSQL.' },
              ],
            },
            example: "INSERT INTO t (id,v) VALUES (1,9) ON CONFLICT(id) DO UPDATE SET v = excluded.v;",
          },
          {
            id: 'sqlite-upsert-conditional',
            code: "INSERT INTO prices (sku, amount) VALUES ('A1', 9.99)\nON CONFLICT(sku) DO UPDATE SET amount = excluded.amount\nWHERE excluded.amount <> prices.amount;",
            note: "The DO UPDATE clause accepts its own WHERE, so you can skip pointless writes (for example, only update when the value actually changed). excluded holds the row that failed to insert.",
            explanation: {
              heading: 'Conditional Upserts',
              intro: 'A DO UPDATE can carry its own WHERE clause, giving fine control over when the update actually fires during an upsert.',
              points: [
                { term: 'Guarded update', detail: 'The WHERE on DO UPDATE lets the update run only when a condition holds, such as the value having changed.' },
                { term: 'Skip needless writes', detail: 'Avoiding a no-op write can prevent unnecessary trigger firing and reduce write amplification.' },
                { term: 'Compare old and new', detail: 'The condition can reference both the existing row and the excluded row that failed to insert.' },
                { term: 'Falls through to nothing', detail: 'If the WHERE is not satisfied, the conflicting row is simply left unchanged.' },
              ],
            },
            example: "ON CONFLICT(sku) DO NOTHING;  -- keep existing row",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'sqlite-fts5',
    title: 'Full-Text Search (FTS5)',
    level: 1,
    slug: 'fts5',
    concepts: [],
    children: [
      {
        id: 'sqlite-fts5-usage',
        title: 'FTS5 Virtual Tables',
        level: 2,
        slug: 'fts5-usage',
        concepts: [
          {
            id: 'sqlite-fts5-basic',
            code: "CREATE VIRTUAL TABLE docs_fts USING fts5(title, body);\nINSERT INTO docs_fts (title, body) VALUES ('SQLite', 'fast embedded db');\nSELECT * FROM docs_fts WHERE docs_fts MATCH 'embedded';",
            note: "FTS5 is a virtual-table module for full-text search. Query with MATCH; it supports phrase queries, prefix (embed*), boolean operators, and bm25() ranking.",
            explanation: {
              heading: 'Full-Text Search Basics',
              intro: 'FTS5 is a built-in virtual table module that indexes text for fast full-text queries far beyond what a LIKE scan can do.',
              points: [
                { term: 'Virtual table', detail: 'You create an FTS5 table with the USING clause, and it maintains an inverted index of the indexed columns.' },
                { term: 'MATCH operator', detail: 'Queries use the MATCH operator, which supports phrases, prefixes with a trailing star, and boolean combinations.' },
                { term: 'Relevance ranking', detail: 'The bm25 function scores how well a row matches, letting you order results by relevance.' },
                { term: 'Tokenizers', detail: 'Configurable tokenizers control how text is split into searchable terms, including case folding and stemming options.' },
              ],
            },
            example: "SELECT *, bm25(docs_fts) FROM docs_fts WHERE docs_fts MATCH 'db' ORDER BY bm25(docs_fts);",
          },
          {
            id: 'sqlite-fts5-external-content',
            code: "CREATE VIRTUAL TABLE docs_fts USING fts5(\n  title, body, content='docs', content_rowid='id'\n);\n-- keep the index in sync with triggers on docs",
            note: "An external-content FTS5 table indexes an existing table without duplicating its data by referencing content and content_rowid. You maintain it with INSERT/DELETE triggers on the base table.",
            explanation: {
              heading: 'External-Content Indexes',
              intro: 'An external-content FTS5 table builds a search index over an existing table without storing a second copy of the text, saving space in the single database file.',
              points: [
                { term: 'Points at a table', detail: 'The content and content_rowid options tell FTS5 which base table and key column hold the real data.' },
                { term: 'No duplication', detail: 'Only the search index is stored, so the potentially large text is not duplicated on disk.' },
                { term: 'Trigger maintenance', detail: 'You keep the index current with INSERT, UPDATE, and DELETE triggers on the base table.' },
                { term: 'Rebuild command', detail: 'Issuing the special rebuild command regenerates the index from the base content when it drifts.' },
              ],
            },
            example: "INSERT INTO docs_fts(docs_fts) VALUES('rebuild');",
          },
          {
            id: 'sqlite-fts5-highlight',
            code: "SELECT highlight(docs_fts, 1, '[', ']') AS snippet\nFROM docs_fts\nWHERE docs_fts MATCH 'embedded';",
            note: "FTS5 auxiliary functions enrich results: highlight() wraps matched terms, snippet() returns a short excerpt around a match, and bm25() ranks relevance.",
            explanation: {
              heading: 'FTS5 Result Helpers',
              intro: 'FTS5 provides auxiliary functions that turn raw matches into user-ready output such as highlighted terms and short excerpts.',
              points: [
                { term: 'Highlight terms', detail: 'The highlight function wraps each matched term in markers you supply, ideal for emphasising hits.' },
                { term: 'Snippet excerpts', detail: 'The snippet function returns a short window of text around a match with an ellipsis for omitted parts.' },
                { term: 'Relevance score', detail: 'bm25 provides a numeric relevance score so results can be ordered from most to least relevant.' },
                { term: 'Column argument', detail: 'These functions take a column index so you can target the specific field to highlight or excerpt.' },
              ],
            },
            example: "SELECT snippet(docs_fts, 1, '<b>', '</b>', '...', 10) FROM docs_fts WHERE docs_fts MATCH 'db';",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'sqlite-attach',
    title: 'Attaching Databases',
    level: 1,
    slug: 'attach',
    concepts: [],
    children: [
      {
        id: 'sqlite-attach-usage',
        title: 'ATTACH and Cross-DB Queries',
        level: 2,
        slug: 'attach-usage',
        concepts: [
          {
            id: 'sqlite-attach-basic',
            code: "ATTACH DATABASE 'archive.db' AS archive;\nINSERT INTO archive.orders SELECT * FROM main.orders WHERE created_at < '2020-01-01';\nDETACH DATABASE archive;",
            note: "ATTACH connects another database file under a schema name so queries can span both. Reference tables as schema.table. DETACH disconnects it.",
            explanation: {
              heading: 'Attaching Extra Databases',
              intro: 'ATTACH lets one connection open several database files at once, each under its own schema name, so a single query can reach across them.',
              points: [
                { term: 'Schema prefix', detail: 'After attaching, you address tables as schema dot table, with main being the primary database.' },
                { term: 'Cross database work', detail: 'This makes it easy to copy or archive rows between separate single-file databases in one statement.' },
                { term: 'Transactions span files', detail: 'A transaction can cover attached databases, though full atomicity across files depends on the journal mode.' },
                { term: 'DETACH when done', detail: 'DETACH releases an attached database, and there is a limit on how many can be attached at once.' },
              ],
            },
            example: "SELECT * FROM archive.orders;",
          },
          {
            id: 'sqlite-backup-vacuum-into',
            code: "VACUUM main INTO 'backup.db';",
            note: "VACUUM INTO (3.27+) writes a compact, defragmented copy of the database to a new file, providing a simple consistent backup without extra tooling.",
            explanation: {
              heading: 'Compact Backups',
              intro: 'VACUUM rebuilds the database to reclaim space, and the INTO form writes that clean copy to a new file as a simple backup.',
              points: [
                { term: 'Reclaim free pages', detail: 'A plain VACUUM rewrites the file in place, defragmenting it and returning unused pages to the operating system.' },
                { term: 'Backup to a file', detail: 'VACUUM INTO writes a fresh, compact copy to a named file without disturbing the original.' },
                { term: 'Consistent snapshot', detail: 'The copy is a transactionally consistent point-in-time image, safe to use as a backup.' },
                { term: 'Version support', detail: 'The INTO variant was added in SQLite 3.27, offering backup without external tools.' },
              ],
            },
            example: "VACUUM;  -- rebuild in place to reclaim free pages",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'sqlite-pragmas',
    title: 'Pragmas',
    level: 1,
    slug: 'pragmas',
    concepts: [],
    children: [
      {
        id: 'sqlite-pragmas-usage',
        title: 'Tuning with PRAGMA',
        level: 2,
        slug: 'pragmas-usage',
        concepts: [
          {
            id: 'sqlite-pragma-basic',
            code: "PRAGMA journal_mode = WAL;\nPRAGMA foreign_keys = ON;\nPRAGMA synchronous = NORMAL;",
            note: "PRAGMAs configure the connection and database. WAL enables concurrent readers with one writer; foreign_keys turns on FK enforcement; synchronous trades durability for speed.",
            explanation: {
              heading: 'Tuning With Pragmas',
              intro: 'Pragmas are SQLite-specific commands that read or set engine options controlling behaviour, performance, and durability.',
              points: [
                { term: 'WAL journal mode', detail: 'Setting journal_mode to WAL lets many readers work while a single writer proceeds, improving concurrency.' },
                { term: 'Foreign key toggle', detail: 'The foreign_keys pragma enables constraint enforcement and must be set on each connection.' },
                { term: 'Durability tradeoff', detail: 'Lowering synchronous, for example to NORMAL, speeds writes but widens the window for data loss on a crash.' },
                { term: 'Connection scope', detail: 'Many pragmas apply only to the current connection, so applications set them right after opening.' },
              ],
            },
            example: "PRAGMA table_info(notes);",
          },
          {
            id: 'sqlite-pragma-introspection',
            code: "PRAGMA table_info(notes);\nPRAGMA index_list(notes);\nPRAGMA foreign_key_list(orders);\nPRAGMA integrity_check;",
            note: "Introspection pragmas describe the schema: table_info lists columns, index_list lists indexes, foreign_key_list shows FKs, and integrity_check verifies the database is not corrupt.",
            explanation: {
              heading: 'Inspecting The Schema',
              intro: 'A family of pragmas lets you interrogate the structure and health of a SQLite database at runtime without a separate catalog.',
              points: [
                { term: 'Describe columns', detail: 'table_info returns each column with its name, declared type, nullability, and default.' },
                { term: 'List indexes and keys', detail: 'index_list and foreign_key_list enumerate a table indexes and its foreign key relationships.' },
                { term: 'Integrity check', detail: 'integrity_check scans the database structure and reports any corruption it finds.' },
                { term: 'Foreign key check', detail: 'foreign_key_check reports rows that violate declared foreign keys, useful after enabling enforcement.' },
              ],
            },
            example: "PRAGMA foreign_key_check;  -- report FK violations",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'sqlite-use-cases',
    title: 'Use Cases',
    level: 1,
    slug: 'use-cases',
    concepts: [],
    children: [
      {
        id: 'sqlite-embedded',
        title: 'Embedded and Edge',
        level: 2,
        slug: 'embedded',
        concepts: [
          {
            id: 'sqlite-embedded-pattern',
            code: "import Database from 'better-sqlite3';\n\nconst db = new Database('app.db');\ndb.pragma('journal_mode = WAL');\nconst stmt = db.prepare('SELECT * FROM users WHERE id = ?');\nconst user = stmt.get(42);",
            note: "SQLite is a serverless embedded database ideal for mobile, desktop, CLI tools, tests, and edge functions. Prepared statements are reusable and fast.",
            explanation: {
              heading: 'Embedded Database Model',
              intro: 'SQLite runs inside the host process with no separate server, storing the whole database in a single file, which suits many local and edge scenarios.',
              points: [
                { term: 'Serverless', detail: 'There is no daemon to install or manage; the library reads and writes the database file directly.' },
                { term: 'Single file', detail: 'An entire database lives in one portable file that is easy to copy, ship, or embed in an application.' },
                { term: 'Great fit cases', detail: 'It excels for mobile apps, desktop tools, CLIs, test suites, and edge functions where a full server is overkill.' },
                { term: 'Prepared statements', detail: 'Compiling a statement once and reusing it with bound parameters is both faster and safer against injection.' },
              ],
            },
            example: "const rows = db.prepare('SELECT * FROM notes').all();",
          },
          {
            id: 'sqlite-transaction-helper',
            code: "const insertMany = db.transaction((rows) => {\n  const stmt = db.prepare('INSERT INTO notes (title) VALUES (?)');\n  for (const r of rows) stmt.run(r.title);\n});\ninsertMany([{ title: 'a' }, { title: 'b' }]);",
            note: "Wrapping bulk writes in a single transaction (here via better-sqlite3's transaction helper) is orders of magnitude faster than autocommitting each row, since each commit fsyncs to disk.",
            explanation: {
              heading: 'Fast Bulk Writes',
              intro: 'Grouping many writes into one transaction removes the biggest performance cost in SQLite, which is the disk flush that accompanies each commit.',
              points: [
                { term: 'One flush not many', detail: 'A single transaction fsyncs once at commit instead of once per row, so bulk inserts speed up enormously.' },
                { term: 'Transaction helper', detail: 'Drivers such as better-sqlite3 wrap a function in BEGIN and COMMIT, rolling back automatically if it throws.' },
                { term: 'Reuse statements', detail: 'Preparing the insert once and running it in a loop avoids recompiling the SQL for every row.' },
                { term: 'Atomic batch', detail: 'Because the whole batch is one transaction, a failure leaves the database untouched rather than half written.' },
              ],
            },
            example: "const count = db.prepare('SELECT COUNT(*) c FROM notes').get().c;",
          },
        ],
        children: [],
      },
    ],
  },
];

export default topics;
