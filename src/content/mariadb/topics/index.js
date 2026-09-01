// MariaDB topic tree.

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  {
    id: 'maria-vs-mysql',
    title: 'MariaDB vs MySQL',
    level: 1,
    slug: 'vs-mysql',
    concepts: [],
    children: [
      {
        id: 'maria-differences',
        title: 'Dialect Differences',
        level: 2,
        slug: 'differences',
        concepts: [
          {
            id: 'maria-diff-basic',
            code: "SELECT VERSION();  -- e.g. 11.4.2-MariaDB\n-- MariaDB adds: SEQUENCE objects, RETURNING, system-versioned tables,\n-- dynamic/INVISIBLE columns, and extra engines (Aria, ColumnStore).",
            note: "MariaDB began as a MySQL fork and stays largely compatible, but adds features MySQL lacks (sequences, RETURNING, temporal tables) and differs in some JSON and optimizer internals.",
            explanation: {
              heading: 'Fork with extra features',
              intro: 'MariaDB started as a drop-in MySQL fork after the Oracle acquisition and kept the wire protocol and most SQL, then grew its own capabilities on top.',
              points: [
                { term: 'Shared heritage', detail: 'The client protocol, connectors, and most SQL syntax match MySQL, so many applications and drivers work against either server.' },
                { term: 'Extra SQL objects', detail: 'MariaDB adds SEQUENCE objects, the RETURNING clause, and system-versioned temporal tables that stock MySQL does not provide.' },
                { term: 'Storage engine range', detail: 'Beyond InnoDB it ships Aria, ColumnStore, and Spider, giving more engine choices than a typical MySQL install.' },
                { term: 'Diverging internals', detail: 'Optimizer behavior, some JSON handling, and default settings have drifted, so version parity should never be assumed.' },
              ],
            },
            example: "SELECT @@version_comment;",
          },
          {
            id: 'maria-json-difference',
            code: "-- MySQL: JSON is a native binary type\n-- MariaDB: JSON is an alias for LONGTEXT + JSON_VALID CHECK\nSELECT JSON_VALID('{\"a\":1}');  -- 1",
            note: "A key difference: MariaDB stores JSON as validated text (LONGTEXT) rather than MySQL's binary type. Most JSON functions match, but the storage format and some operators differ.",
            explanation: {
              heading: 'JSON as validated text',
              intro: 'MariaDB and MySQL both expose a JSON type, but under the hood they store documents very differently, which affects storage size and some operators.',
              points: [
                { term: 'Alias for LONGTEXT', detail: 'In MariaDB the JSON type is an alias for LONGTEXT with an automatic JSON_VALID CHECK constraint rather than a packed binary format.' },
                { term: 'MySQL binary type', detail: 'MySQL stores JSON in a compact binary layout that speeds up path access and preserves key order, which MariaDB does not replicate byte for byte.' },
                { term: 'Function compatibility', detail: 'Common functions such as JSON_EXTRACT, JSON_VALUE, and JSON_SET behave the same way, easing most day to day queries.' },
                { term: 'Watch the operators', detail: 'Comparison, indexing strategy, and some operator support differ, so plan migrations and benchmark rather than assuming identical behavior.' },
              ],
            },
            example: "CREATE TABLE t (doc JSON CHECK (JSON_VALID(doc)));",
          },
          {
            id: 'maria-compat-flags',
            code: "SELECT @@sql_mode;\n-- MariaDB and MySQL 8 differ in default sql_mode, auth plugins,\n-- and reserved words; test migrations rather than assuming parity.",
            note: "Despite shared roots, MariaDB and modern MySQL have diverged in authentication plugins, default sql_mode, and some function behavior. Treat them as related but distinct dialects when porting apps.",
            explanation: {
              heading: 'Compatibility is not identity',
              intro: 'The two servers share ancestry but have grown apart in defaults and plugins, so a migration between them needs testing rather than a blind swap.',
              points: [
                { term: 'Authentication plugins', detail: 'MariaDB and MySQL 8 default to different auth plugins, so credentials and connectors may need adjustment when switching servers.' },
                { term: 'sql_mode defaults', detail: 'The default sql_mode flags differ, changing how strict the server is about invalid dates, zero values, and truncation.' },
                { term: 'Reserved words', detail: 'Each server has added its own reserved keywords, so identifiers valid in one can break parsing in the other.' },
                { term: 'Test the migration', detail: 'Run the full test suite against the target server rather than assuming feature parity between the dialects.' },
              ],
            },
            example: "SET sql_mode = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION';",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'maria-data-types',
    title: 'Data Types',
    level: 1,
    slug: 'data-types',
    concepts: [],
    children: [
      {
        id: 'maria-types-usage',
        title: 'Types and JSON Storage',
        level: 2,
        slug: 'types-usage',
        concepts: [
          {
            id: 'maria-types-basic',
            code: "CREATE TABLE products (\n  id INT UNSIGNED PRIMARY KEY,\n  price DECIMAL(10,2),\n  attrs JSON,        -- alias for LONGTEXT + CHECK\n  uid UUID           -- native UUID type (10.7+)\n);",
            note: "MariaDB shares MySQL numeric/string/date types. JSON is an alias for LONGTEXT with JSON validation, and a dedicated UUID type was added in 10.7.",
            explanation: {
              heading: 'Familiar types plus extras',
              intro: 'Most column types carry over directly from MySQL, while a few MariaDB additions handle documents and identifiers more conveniently.',
              points: [
                { term: 'Numeric family', detail: 'INT, BIGINT, DECIMAL, FLOAT, and their UNSIGNED variants behave as in MySQL, with DECIMAL preferred for exact money values.' },
                { term: 'String and date types', detail: 'VARCHAR, TEXT, DATE, DATETIME, and TIMESTAMP match MySQL semantics, including TIMESTAMP time zone conversion.' },
                { term: 'JSON storage', detail: 'The JSON type is LONGTEXT plus a JSON_VALID check, so it validates content but stores it as text rather than binary.' },
                { term: 'Native UUID', detail: 'Since version 10.7 a dedicated UUID type stores 128-bit identifiers compactly while displaying them in hyphenated form.' },
              ],
            },
            example: "CREATE TABLE t (g INT UNSIGNED ZEROFILL);",
          },
          {
            id: 'maria-uuid-type',
            code: "CREATE TABLE sessions (id UUID DEFAULT UUID(), token TEXT);\nINSERT INTO sessions (token) VALUES ('abc');\nSELECT id FROM sessions;  -- readable hyphenated UUID",
            note: "The native UUID type (10.7+) stores 128-bit values compactly (16 bytes) yet displays them in the familiar hyphenated form, avoiding the manual BINARY(16) conversion MySQL requires.",
            explanation: {
              heading: 'Compact readable identifiers',
              intro: 'The dedicated UUID type gives you the storage efficiency of binary while keeping the readable text form, so you avoid the trade-offs older schemas had to make.',
              points: [
                { term: 'Sixteen byte storage', detail: 'Values are packed into 16 bytes internally rather than a 36 character string, saving space and improving index density.' },
                { term: 'Readable output', detail: 'Selecting a UUID column returns the familiar hyphenated form automatically, with no manual HEX or formatting step.' },
                { term: 'No BINARY workaround', detail: 'MySQL commonly uses BINARY(16) with UUID_TO_BIN and BIN_TO_UUID, which the native MariaDB type makes unnecessary.' },
                { term: 'Sensible defaults', detail: 'A column can default to UUID() so new rows receive a generated identifier without application code doing the work.' },
              ],
            },
            example: "SELECT UUID();  -- generate a v1 UUID",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'maria-storage-engines',
    title: 'Storage Engines',
    level: 1,
    slug: 'storage-engines',
    concepts: [],
    children: [
      {
        id: 'maria-engines-usage',
        title: 'Aria and ColumnStore',
        level: 2,
        slug: 'engines-usage',
        concepts: [
          {
            id: 'maria-aria',
            code: "CREATE TABLE cache (id INT, data TEXT) ENGINE=Aria;\nCREATE TABLE analytics (\n  event_date DATE, event_type VARCHAR(50), value BIGINT\n) ENGINE=ColumnStore;",
            note: "Aria is a crash-safe MyISAM replacement good for internal/temp tables. ColumnStore is a columnar engine for analytics over large datasets. InnoDB remains the transactional default.",
            explanation: {
              heading: 'Engines for different jobs',
              intro: 'MariaDB bundles several storage engines beyond InnoDB, each tuned for a specific access pattern so you can match the engine to the workload.',
              points: [
                { term: 'InnoDB default', detail: 'InnoDB is the transactional workhorse offering row locking, foreign keys, and crash recovery for general purpose tables.' },
                { term: 'Aria engine', detail: 'Aria is a crash-safe successor to MyISAM, used internally for system and temporary tables and useful for fast read heavy data.' },
                { term: 'ColumnStore engine', detail: 'ColumnStore stores data by column and is built for analytical scans and aggregation over very large datasets.' },
                { term: 'Per table choice', detail: 'The ENGINE clause is set per table, so a single database can mix transactional and analytical engines as needed.' },
              ],
            },
            example: "SELECT engine FROM information_schema.tables WHERE table_name='cache';",
          },
          {
            id: 'maria-engine-choice',
            code: "-- InnoDB: OLTP, transactions, FKs (default)\n-- Aria:   temp/system tables, fast reads\n-- ColumnStore: OLAP aggregate scans\n-- Spider: sharding across remote servers\nCREATE TABLE big (id INT) ENGINE=InnoDB;",
            note: "MariaDB is pluggable: pick InnoDB for general transactional work, ColumnStore for analytical scans, and Spider to shard a logical table across remote backends. Engines can be mixed per table.",
            explanation: {
              heading: 'Choosing the right engine',
              intro: 'Because storage engines are pluggable, picking one is a design decision driven by the read and write pattern of each table.',
              points: [
                { term: 'OLTP with InnoDB', detail: 'Choose InnoDB when you need transactions, foreign keys, and concurrent row level writes, which covers most operational tables.' },
                { term: 'OLAP with ColumnStore', detail: 'Choose ColumnStore for reporting tables where queries scan and aggregate large volumes rather than fetch single rows.' },
                { term: 'Sharding with Spider', detail: 'Spider makes a local table a proxy for data spread across remote servers, enabling horizontal scaling of a logical table.' },
                { term: 'Switch with ALTER', detail: 'ALTER TABLE ENGINE rebuilds a table under a different engine, so a choice can be revised as workloads change.' },
              ],
            },
            example: "ALTER TABLE cache ENGINE=InnoDB;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'maria-sequences',
    title: 'Sequences',
    level: 1,
    slug: 'sequences',
    concepts: [],
    children: [
      {
        id: 'maria-sequences-usage',
        title: 'SEQUENCE Objects',
        level: 2,
        slug: 'sequences-usage',
        concepts: [
          {
            id: 'maria-seq-basic',
            code: "CREATE SEQUENCE order_seq START WITH 1000 INCREMENT BY 1;\nSELECT NEXT VALUE FOR order_seq;\nSELECT NEXTVAL(order_seq);",
            note: "MariaDB supports SQL-standard SEQUENCE objects (unlike MySQL, which only has AUTO_INCREMENT). Sequences can be shared across tables and queried with NEXT VALUE FOR or NEXTVAL().",
            explanation: {
              heading: 'Standard sequence objects',
              intro: 'Sequences are independent database objects that hand out numbers on demand, giving more control than a per table AUTO_INCREMENT counter.',
              points: [
                { term: 'Not just AUTO_INCREMENT', detail: 'Unlike MySQL, MariaDB offers first class SEQUENCE objects that exist separately from any single table.' },
                { term: 'Shared across tables', detail: 'One sequence can supply identifiers to several tables, which is useful when ids must be unique across a group of tables.' },
                { term: 'Two syntaxes', detail: 'Fetch the next number with the SQL standard NEXT VALUE FOR or the shorter NEXTVAL() function form.' },
                { term: 'Configurable behavior', detail: 'START WITH, INCREMENT BY, MINVALUE, and MAXVALUE let you tailor the starting point and step of the generated numbers.' },
              ],
            },
            example: "SELECT PREVIOUS VALUE FOR order_seq;",
          },
          {
            id: 'maria-seq-default',
            code: "CREATE SEQUENCE inv_seq;\nCREATE TABLE invoices (\n  id INT DEFAULT NEXTVAL(inv_seq) PRIMARY KEY,\n  amount DECIMAL(10,2)\n);\nINSERT INTO invoices (amount) VALUES (99.00);",
            note: "A sequence can drive a column DEFAULT, giving AUTO_INCREMENT-like behavior while letting several tables share one number space or letting you reserve ids before insert.",
            explanation: {
              heading: 'Sequences as column defaults',
              intro: 'Wiring a sequence into a column DEFAULT gives automatic id assignment while keeping the flexibility that a standalone sequence provides.',
              points: [
                { term: 'DEFAULT NEXTVAL', detail: 'Setting a column DEFAULT to NEXTVAL of a sequence auto populates it on insert, much like AUTO_INCREMENT.' },
                { term: 'Shared number space', detail: 'Multiple tables can point their defaults at one sequence when identifiers must not collide across those tables.' },
                { term: 'Reserve ids early', detail: 'You can call NEXTVAL to grab an id in application code before the row is inserted, useful for building related records.' },
                { term: 'Adjustable at runtime', detail: 'ALTER SEQUENCE RESTART WITH resets the counter, handy after bulk loads or when aligning environments.' },
              ],
            },
            example: "ALTER SEQUENCE inv_seq RESTART WITH 5000;",
          },
          {
            id: 'maria-seq-cache',
            code: "CREATE SEQUENCE fast_seq CACHE 1000 NOCYCLE;\nCREATE SEQUENCE wrap_seq MAXVALUE 100 CYCLE;",
            note: "CACHE pre-allocates a block of values per connection for speed (at the cost of gaps), while CYCLE/NOCYCLE controls whether the sequence wraps back to its start after hitting MAXVALUE.",
            explanation: {
              heading: 'Tuning cache and cycling',
              intro: 'Sequence options trade throughput against gap free numbering and decide what happens when the counter reaches its ceiling.',
              points: [
                { term: 'CACHE for speed', detail: 'CACHE reserves a block of values per connection so most NEXTVAL calls avoid touching the on disk counter.' },
                { term: 'Gaps are expected', detail: 'Cached values that are never used are lost on disconnect or crash, so cached sequences can leave gaps in the numbers.' },
                { term: 'CYCLE wraps around', detail: 'With CYCLE the sequence restarts from its minimum after reaching MAXVALUE, which suits rotating identifiers.' },
                { term: 'NOCYCLE stops', detail: 'With NOCYCLE the sequence raises an error once MAXVALUE is exhausted rather than silently reusing numbers.' },
              ],
            },
            example: "SELECT NEXTVAL(fast_seq);",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'maria-temporal',
    title: 'System-Versioned Tables',
    level: 1,
    slug: 'temporal',
    concepts: [],
    children: [
      {
        id: 'maria-temporal-usage',
        title: 'Temporal Queries',
        level: 2,
        slug: 'temporal-usage',
        concepts: [
          {
            id: 'maria-temporal-basic',
            code: "CREATE TABLE products (\n  id INT PRIMARY KEY,\n  name VARCHAR(255),\n  price DECIMAL(10,2)\n) WITH SYSTEM VERSIONING;\n\nSELECT * FROM products FOR SYSTEM_TIME AS OF '2024-01-01';",
            note: "System-versioned tables automatically retain row history. Query past states with FOR SYSTEM_TIME AS OF / BETWEEN, removing the need for manual audit tables.",
            explanation: {
              heading: 'Built-in row history',
              intro: 'System versioning lets the database itself remember every past state of a row, turning point in time queries into a first class feature.',
              points: [
                { term: 'Automatic retention', detail: 'Adding WITH SYSTEM VERSIONING makes the engine keep old row versions whenever a row is updated or deleted.' },
                { term: 'Time travel queries', detail: 'FOR SYSTEM_TIME AS OF returns the table as it looked at a given moment without any extra history tables.' },
                { term: 'No manual auditing', detail: 'The feature replaces hand rolled audit tables and triggers that developers previously wrote to track changes.' },
                { term: 'See everything', detail: 'FOR SYSTEM_TIME ALL exposes current and historical rows together for full lifecycle analysis.' },
              ],
            },
            example: "SELECT * FROM products FOR SYSTEM_TIME ALL;",
          },
          {
            id: 'maria-temporal-between',
            code: "SELECT id, price, row_start, row_end\nFROM products FOR SYSTEM_TIME\n  BETWEEN '2024-01-01' AND '2024-06-30'\nWHERE id = 1;",
            note: "FOR SYSTEM_TIME BETWEEN returns every historical version of a row in a period. The hidden row_start/row_end columns expose each version's validity window for audit trails.",
            explanation: {
              heading: 'Querying version windows',
              intro: 'Temporal queries can return not just one snapshot but the full set of versions valid over a period, backed by hidden timestamp columns.',
              points: [
                { term: 'BETWEEN a period', detail: 'FOR SYSTEM_TIME BETWEEN two timestamps returns every row version whose validity overlaps that range.' },
                { term: 'Hidden timestamps', detail: 'The row_start and row_end columns record when each version became current and when it was superseded.' },
                { term: 'Audit trails', detail: 'Reading those windows reconstructs exactly what a record looked like at any time, ideal for compliance and audit needs.' },
                { term: 'Relative moments', detail: 'AS OF can use expressions like NOW() minus an interval to look back a fixed amount of time.' },
              ],
            },
            example: "SELECT * FROM products FOR SYSTEM_TIME AS OF NOW() - INTERVAL 1 DAY;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'maria-generated-columns',
    title: 'Virtual and Persistent Columns',
    level: 1,
    slug: 'generated-columns',
    concepts: [],
    children: [
      {
        id: 'maria-generated-usage',
        title: 'Computed Columns',
        level: 2,
        slug: 'generated-usage',
        concepts: [
          {
            id: 'maria-generated-basic',
            code: "CREATE TABLE orders (\n  price DECIMAL(10,2),\n  qty INT,\n  total DECIMAL(12,2) AS (price * qty) PERSISTENT\n);",
            note: "MariaDB computes generated columns as VIRTUAL (evaluated on read) or PERSISTENT (stored on write, indexable). PERSISTENT is MariaDB's term for MySQL's STORED.",
            explanation: {
              heading: 'Virtual versus persistent',
              intro: 'Generated columns derive their value from an expression, and the storage keyword decides when that expression is evaluated and whether the result is saved.',
              points: [
                { term: 'VIRTUAL columns', detail: 'A VIRTUAL column is computed each time it is read and takes no row storage, which suits rarely queried derivations.' },
                { term: 'PERSISTENT columns', detail: 'A PERSISTENT column is computed on write and stored on disk, so reads are cheap and the column can be indexed.' },
                { term: 'MySQL STORED', detail: 'PERSISTENT is the MariaDB spelling for what MySQL calls STORED, so cross dialect schemas should map the two.' },
                { term: 'Expression driven', detail: 'The AS clause holds a deterministic expression over other columns, keeping the derived value always in sync.' },
              ],
            },
            example: "ALTER TABLE u ADD dom VARCHAR(100) AS (SUBSTRING_INDEX(email,'@',-1)) VIRTUAL;",
          },
          {
            id: 'maria-generated-index',
            code: "CREATE TABLE users (\n  email VARCHAR(255),\n  email_lc VARCHAR(255) AS (LOWER(email)) PERSISTENT,\n  INDEX (email_lc)\n);\nSELECT * FROM users WHERE email_lc = 'a@x.com';",
            note: "Only PERSISTENT generated columns can be indexed. Extract or normalize a value (like a lowercased email or a JSON field) into a PERSISTENT column, then index it for fast lookups.",
            explanation: {
              heading: 'Indexing derived values',
              intro: 'A common pattern is to normalize or extract a value into a stored generated column and index it, so expensive expressions do not run on every query.',
              points: [
                { term: 'Persistent to index', detail: 'Only PERSISTENT generated columns hold their value on disk, which is what an index needs to reference.' },
                { term: 'Normalize once', detail: 'Storing a lowercased or trimmed form lets case insensitive lookups hit an index instead of scanning every row.' },
                { term: 'Extract JSON fields', detail: 'Pulling a JSON path into a persistent column gives a normal indexable column for querying document data quickly.' },
                { term: 'Fast lookups', detail: 'Adding an INDEX on the generated column turns a full table scan into an efficient index seek.' },
              ],
            },
            example: "ALTER TABLE users ADD INDEX idx_lc (email_lc);",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'maria-json',
    title: 'JSON Functions',
    level: 1,
    slug: 'json',
    concepts: [],
    children: [
      {
        id: 'maria-json-usage',
        title: 'Querying JSON',
        level: 2,
        slug: 'json-usage',
        concepts: [
          {
            id: 'maria-json-basic',
            code: "SELECT JSON_VALUE(attrs, '$.color') AS color\nFROM products\nWHERE JSON_EXISTS(attrs, '$.warranty');",
            note: "MariaDB provides JSON functions such as JSON_VALUE, JSON_QUERY, JSON_EXTRACT, JSON_EXISTS, and JSON_SET. JSON is stored as validated text rather than a binary type.",
            explanation: {
              heading: 'Reading and editing JSON',
              intro: 'MariaDB ships a full set of JSON functions to pull scalars, extract subdocuments, test for keys, and modify documents in place.',
              points: [
                { term: 'JSON_VALUE', detail: 'JSON_VALUE returns a single scalar at a path, which is convenient for filtering and selecting individual fields.' },
                { term: 'JSON_QUERY and EXTRACT', detail: 'JSON_QUERY returns an object or array subdocument while JSON_EXTRACT is the general path based accessor.' },
                { term: 'JSON_EXISTS', detail: 'JSON_EXISTS tests whether a path is present, letting queries filter rows that contain a given key.' },
                { term: 'JSON_SET updates', detail: 'JSON_SET and its siblings modify a document and return the new text, since JSON is stored as validated text.' },
              ],
            },
            example: "UPDATE products SET attrs = JSON_SET(attrs, '$.stock', 5) WHERE id = 1;",
          },
          {
            id: 'maria-json-table',
            code: "SELECT p.id, jt.tag\nFROM products p,\n     JSON_TABLE(p.attrs, '$.tags[*]' COLUMNS (tag VARCHAR(50) PATH '$')) AS jt;",
            note: "JSON_TABLE (10.6+) turns a JSON array or object into a relational rowset you can join like a table, letting you expand nested arrays into rows for aggregation and filtering.",
            explanation: {
              heading: 'JSON into rows',
              intro: 'JSON_TABLE bridges document and relational worlds by projecting a JSON structure into a virtual table you can join and aggregate.',
              points: [
                { term: 'Available from 10.6', detail: 'JSON_TABLE was introduced in MariaDB 10.6, so older servers need a different approach to shred JSON arrays.' },
                { term: 'Array to rows', detail: 'A path with an array wildcard expands each element into its own row, unnesting a document for set based queries.' },
                { term: 'Typed COLUMNS', detail: 'The COLUMNS clause maps JSON paths to named, typed columns so downstream SQL treats them like ordinary fields.' },
                { term: 'Join like a table', detail: 'Because it yields a rowset, JSON_TABLE can join to real tables and feed GROUP BY and WHERE clauses.' },
              ],
            },
            example: "SELECT JSON_ARRAYAGG(name) FROM products;",
          },
          {
            id: 'maria-json-agg',
            code: "SELECT dept,\n       JSON_ARRAYAGG(name) AS names,\n       JSON_OBJECTAGG(id, name) AS by_id\nFROM employees\nGROUP BY dept;",
            note: "JSON_ARRAYAGG builds a JSON array from grouped rows and JSON_OBJECTAGG builds a key-value object, letting a query return nested JSON documents directly for API responses.",
            explanation: {
              heading: 'Aggregating into JSON',
              intro: 'JSON aggregate functions collapse many rows into a single JSON value, which lets the database assemble API shaped documents directly.',
              points: [
                { term: 'JSON_ARRAYAGG', detail: 'JSON_ARRAYAGG gathers a column across a group into a JSON array, useful for collecting child values per parent.' },
                { term: 'JSON_OBJECTAGG', detail: 'JSON_OBJECTAGG pairs two columns into a JSON object of keys and values from the grouped rows.' },
                { term: 'Nested documents', detail: 'Combining these with GROUP BY produces nested JSON so the client receives ready to use structures.' },
                { term: 'Fewer round trips', detail: 'Building the document in SQL avoids reshaping flat rows in application code and cuts result processing.' },
              ],
            },
            example: "SELECT JSON_OBJECT('id', id, 'name', name) FROM employees;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'maria-ctes',
    title: 'Common Table Expressions',
    level: 1,
    slug: 'ctes',
    concepts: [],
    children: [
      {
        id: 'maria-ctes-usage',
        title: 'WITH and Recursion',
        level: 2,
        slug: 'ctes-usage',
        concepts: [
          {
            id: 'maria-cte-basic',
            code: "WITH RECURSIVE seq AS (\n  SELECT 1 AS n\n  UNION ALL\n  SELECT n + 1 FROM seq WHERE n < 10\n)\nSELECT n FROM seq;",
            note: "MariaDB 10.2+ supports standard CTEs with WITH and recursive CTEs for hierarchical data, using an anchor and recursive member joined by UNION ALL.",
            explanation: {
              heading: 'WITH clauses and recursion',
              intro: 'Common table expressions name a subquery so it reads cleanly, and the recursive form lets a query reference itself to walk hierarchies.',
              points: [
                { term: 'Available from 10.2', detail: 'MariaDB added standard WITH syntax in 10.2, bringing it in line with the SQL standard and modern MySQL.' },
                { term: 'Readable subqueries', detail: 'A non recursive CTE factors a subquery into a named block, improving readability and allowing reuse within one statement.' },
                { term: 'Anchor and recursive member', detail: 'A recursive CTE has a base anchor query and a recursive member that references the CTE, joined with UNION ALL.' },
                { term: 'Termination matters', detail: 'The recursive member needs a condition that eventually returns no rows, or the recursion would not stop.' },
              ],
            },
            example: "WITH t AS (SELECT * FROM orders WHERE total > 100) SELECT COUNT(*) FROM t;",
          },
          {
            id: 'maria-cte-hierarchy',
            code: "WITH RECURSIVE tree AS (\n  SELECT id, parent_id, name, 0 AS depth FROM categories WHERE parent_id IS NULL\n  UNION ALL\n  SELECT c.id, c.parent_id, c.name, t.depth + 1\n  FROM categories c JOIN tree t ON c.parent_id = t.id\n)\nSELECT * FROM tree ORDER BY depth;",
            note: "Recursive CTEs walk parent/child hierarchies such as category trees or org charts, tracking depth in the recursive member. This replaces MySQL-era hierarchy workarounds.",
            explanation: {
              heading: 'Walking hierarchies',
              intro: 'Recursive CTEs shine on self referencing data like category trees and org charts, replacing the awkward loops older MySQL versions required.',
              points: [
                { term: 'Parent child traversal', detail: 'The recursive member joins each row back to its parent, following the chain from roots down to leaves.' },
                { term: 'Track depth', detail: 'Carrying a depth counter in the recursive member records how many levels deep each row sits for ordering or indenting.' },
                { term: 'Roots as anchor', detail: 'The anchor query selects the top level rows, typically those with a null parent, to seed the recursion.' },
                { term: 'No more workarounds', detail: 'This removes the need for stored procedure loops or nested set tricks used before recursive CTEs existed.' },
              ],
            },
            example: "WITH cte AS (SELECT 1 n) SELECT n FROM cte;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'maria-window-functions',
    title: 'Window Functions',
    level: 1,
    slug: 'window-functions',
    concepts: [],
    children: [
      {
        id: 'maria-window-usage',
        title: 'OVER and Ranking',
        level: 2,
        slug: 'window-usage',
        concepts: [
          {
            id: 'maria-window-basic',
            code: "SELECT name, department, salary,\n  RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank\nFROM employees;",
            note: "MariaDB 10.2+ supports window functions: ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, and aggregates over frames, computed without collapsing rows.",
            explanation: {
              heading: 'Calculations over windows',
              intro: 'Window functions compute values across a set of related rows while still returning every input row, unlike GROUP BY which collapses them.',
              points: [
                { term: 'Available from 10.2', detail: 'MariaDB gained window functions in 10.2, matching the analytical capabilities found in other standard SQL databases.' },
                { term: 'Ranking functions', detail: 'ROW_NUMBER, RANK, and DENSE_RANK assign positions within an ordered partition for top N and leaderboard style queries.' },
                { term: 'The OVER clause', detail: 'PARTITION BY splits rows into groups and ORDER BY defines the sequence the window function walks.' },
                { term: 'Rows preserved', detail: 'Every source row remains in the output, so detail and the computed value appear side by side.' },
              ],
            },
            example: "SELECT *, SUM(v) OVER (ORDER BY d) AS running FROM m;",
          },
          {
            id: 'maria-window-lag',
            code: "SELECT month, revenue,\n  LAG(revenue) OVER (ORDER BY month) AS prev,\n  revenue - LAG(revenue) OVER (ORDER BY month) AS delta\nFROM monthly_sales;",
            note: "LAG and LEAD reach the previous or next row within the ordered window, ideal for period-over-period deltas without a self join. Supply a default to replace the boundary NULL.",
            explanation: {
              heading: 'Comparing neighbouring rows',
              intro: 'LAG and LEAD let a row peek at earlier or later rows in the same ordered window, which makes trend and delta calculations concise.',
              points: [
                { term: 'LAG looks back', detail: 'LAG returns a value from a preceding row, perfect for comparing a period to the one before it.' },
                { term: 'LEAD looks ahead', detail: 'LEAD reaches into a following row, useful for forecasting differences or showing an upcoming value.' },
                { term: 'No self join', detail: 'These functions replace correlated self joins that were previously needed to align adjacent rows.' },
                { term: 'Boundary default', detail: 'A third argument supplies a value to use when there is no neighbour, replacing the NULL at the edges.' },
              ],
            },
            example: "SELECT LEAD(revenue, 1, 0) OVER (ORDER BY month) FROM monthly_sales;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'maria-stored-procedures',
    title: 'Stored Procedures',
    level: 1,
    slug: 'stored-procedures',
    concepts: [],
    children: [
      {
        id: 'maria-procs-usage',
        title: 'Procedures',
        level: 2,
        slug: 'procs-usage',
        concepts: [
          {
            id: 'maria-proc-basic',
            code: "DELIMITER //\nCREATE PROCEDURE add_bonus(IN dept INT, IN pct DECIMAL(4,2))\nBEGIN\n  UPDATE employees SET salary = salary * (1 + pct) WHERE dept_id = dept;\nEND //\nDELIMITER ;",
            note: "Stored procedures package server-side logic with IN/OUT/INOUT parameters. As in MySQL, change DELIMITER so the body's semicolons are not treated as statement terminators.",
            explanation: {
              heading: 'Server side routines',
              intro: 'Stored procedures move reusable logic into the database, exposing parameters so callers can pass data in and receive results back.',
              points: [
                { term: 'Parameter modes', detail: 'IN passes a value in, OUT returns one to the caller, and INOUT does both within a single parameter.' },
                { term: 'Change the delimiter', detail: 'Because the body contains semicolons, you switch DELIMITER so the client does not end the definition early.' },
                { term: 'Call to invoke', detail: 'A procedure runs via CALL and can perform multiple statements as one server side operation.' },
                { term: 'MySQL heritage', detail: 'The procedural syntax mirrors MySQL, so routines port with little change beyond dialect specific functions.' },
              ],
            },
            example: "CALL add_bonus(3, 0.10);",
          },
          {
            id: 'maria-proc-handler',
            code: "DELIMITER //\nCREATE PROCEDURE safe_transfer(a INT, b INT, amt DECIMAL(10,2))\nBEGIN\n  DECLARE EXIT HANDLER FOR SQLEXCEPTION\n  BEGIN\n    ROLLBACK;\n    RESIGNAL;\n  END;\n  START TRANSACTION;\n  UPDATE accounts SET balance = balance - amt WHERE id = a;\n  UPDATE accounts SET balance = balance + amt WHERE id = b;\n  COMMIT;\nEND //\nDELIMITER ;",
            note: "A DECLARE ... HANDLER FOR SQLEXCEPTION block traps errors inside a routine so you can ROLLBACK and RESIGNAL. EXIT handlers stop the routine; CONTINUE handlers resume after the failed statement.",
            explanation: {
              heading: 'Handling routine errors',
              intro: 'Condition handlers give stored routines structured error handling so a failure can be cleaned up rather than left half done.',
              points: [
                { term: 'Trap SQLEXCEPTION', detail: 'A handler for SQLEXCEPTION catches any error raised inside the routine so recovery logic can run.' },
                { term: 'Roll back safely', detail: 'Inside the handler you typically ROLLBACK the transaction to undo partial work before re-raising.' },
                { term: 'EXIT versus CONTINUE', detail: 'An EXIT handler ends the enclosing block, while a CONTINUE handler resumes at the statement after the failure.' },
                { term: 'RESIGNAL propagates', detail: 'RESIGNAL re-throws the condition so the caller still learns the operation failed after cleanup.' },
              ],
            },
            example: "DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'maria-triggers',
    title: 'Triggers',
    level: 1,
    slug: 'triggers',
    concepts: [],
    children: [
      {
        id: 'maria-triggers-usage',
        title: 'Row Triggers',
        level: 2,
        slug: 'triggers-usage',
        concepts: [
          {
            id: 'maria-trigger-basic',
            code: "CREATE TRIGGER trg_updated\nBEFORE UPDATE ON accounts\nFOR EACH ROW\nSET NEW.updated_at = NOW();",
            note: "Triggers fire BEFORE or AFTER INSERT/UPDATE/DELETE on each row, accessing OLD and NEW pseudo-rows. MariaDB also allows multiple triggers per event using FOLLOWS/PRECEDES.",
            explanation: {
              heading: 'Row level triggers',
              intro: 'Triggers run procedural code automatically in response to data changes, with access to the row values before and after the change.',
              points: [
                { term: 'Timing and event', detail: 'A trigger fires BEFORE or AFTER an INSERT, UPDATE, or DELETE, and MariaDB triggers act once per affected row.' },
                { term: 'OLD and NEW rows', detail: 'NEW holds the incoming values and OLD holds the prior values, letting you validate or transform data in flight.' },
                { term: 'Common uses', detail: 'Typical work includes stamping timestamps, enforcing rules, and writing audit records to another table.' },
                { term: 'Multiple per event', detail: 'MariaDB permits several triggers for the same event, which older MySQL versions did not allow.' },
              ],
            },
            example: "CREATE TRIGGER log_del AFTER DELETE ON t FOR EACH ROW INSERT INTO audit(id) VALUES(OLD.id);",
          },
          {
            id: 'maria-trigger-order',
            code: "CREATE TRIGGER trg_a BEFORE INSERT ON t FOR EACH ROW SET NEW.a = 1;\nCREATE TRIGGER trg_b BEFORE INSERT ON t FOR EACH ROW FOLLOWS trg_a\n  SET NEW.b = NEW.a + 1;",
            note: "MariaDB allows several triggers for the same event and lets you order them with FOLLOWS or PRECEDES another trigger, so multiple BEFORE INSERT triggers run in a defined sequence.",
            explanation: {
              heading: 'Ordering multiple triggers',
              intro: 'When more than one trigger reacts to the same event, MariaDB lets you pin their execution order so dependent logic runs predictably.',
              points: [
                { term: 'Several per event', detail: 'You can define multiple BEFORE INSERT or other triggers on one table for the same timing and action.' },
                { term: 'FOLLOWS keyword', detail: 'FOLLOWS names an existing trigger that the new one should run after, chaining dependent steps.' },
                { term: 'PRECEDES keyword', detail: 'PRECEDES inserts the new trigger before a named one, useful when a value must be set first.' },
                { term: 'Predictable pipeline', detail: 'Explicit ordering turns several triggers into a defined pipeline rather than an undefined sequence.' },
              ],
            },
            example: "CREATE TRIGGER trg_c BEFORE INSERT ON t FOR EACH ROW PRECEDES trg_b SET NEW.c = 0;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'maria-returning',
    title: 'RETURNING Clause',
    level: 1,
    slug: 'returning',
    concepts: [],
    children: [
      {
        id: 'maria-returning-usage',
        title: 'Returning Affected Rows',
        level: 2,
        slug: 'returning-usage',
        concepts: [
          {
            id: 'maria-returning-basic',
            code: "INSERT INTO users (email) VALUES ('a@x.com')\nRETURNING id, email;\n\nDELETE FROM sessions WHERE expired = 1\nRETURNING id;",
            note: "MariaDB 10.5+ supports a RETURNING clause on INSERT and DELETE (a feature MySQL lacks), returning columns from affected rows in a single round trip.",
            explanation: {
              heading: 'Data back from writes',
              intro: 'The RETURNING clause lets a write statement hand back columns from the rows it changed, saving a separate query to read them.',
              points: [
                { term: 'Available from 10.5', detail: 'MariaDB added RETURNING in 10.5, a capability that standard MySQL still does not offer.' },
                { term: 'INSERT and DELETE', detail: 'You can attach RETURNING to an INSERT to fetch generated ids or to a DELETE to capture removed rows.' },
                { term: 'One round trip', detail: 'The values come back with the statement, avoiding a follow up SELECT and reducing latency.' },
                { term: 'Multiple rows', detail: 'A multi row insert returns a row of output per inserted row, so batch operations report all their ids.' },
              ],
            },
            example: "INSERT INTO t (v) VALUES (1),(2) RETURNING id;",
          },
          {
            id: 'maria-returning-replace',
            code: "REPLACE INTO settings (k, v) VALUES ('theme', 'dark')\nRETURNING id, k, v;",
            note: "RETURNING also works with REPLACE, letting you capture the resulting row (including a regenerated id) after an insert-or-replace, avoiding a follow-up SELECT.",
            explanation: {
              heading: 'RETURNING with REPLACE',
              intro: 'REPLACE deletes any conflicting row and inserts a fresh one, and RETURNING lets you read the outcome of that combined action immediately.',
              points: [
                { term: 'Insert or replace', detail: 'REPLACE inserts a row, or if a key conflicts, deletes the old row first and inserts the new one.' },
                { term: 'Regenerated id', detail: 'Because the old row is deleted, an auto generated id can change, and RETURNING reveals the resulting value.' },
                { term: 'Skip the SELECT', detail: 'Capturing the resulting row inline avoids a separate query to discover what REPLACE produced.' },
                { term: 'Consistent pattern', detail: 'RETURNING behaves the same across INSERT, DELETE, and REPLACE, keeping write patterns uniform.' },
              ],
            },
            example: "INSERT INTO counters (name) VALUES ('x') RETURNING id;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'maria-dynamic-columns',
    title: 'Dynamic Columns',
    level: 1,
    slug: 'dynamic-columns',
    concepts: [],
    children: [
      {
        id: 'maria-dynamic-usage',
        title: 'Schema-Flexible Blobs',
        level: 2,
        slug: 'dynamic-usage',
        concepts: [
          {
            id: 'maria-dynamic-basic',
            code: "UPDATE items\nSET attrs = COLUMN_CREATE('color', 'red', 'size', 'L')\nWHERE id = 1;\n\nSELECT COLUMN_GET(attrs, 'color' AS CHAR) FROM items WHERE id = 1;",
            note: "Dynamic columns store a set of key-value pairs inside a single BLOB column via COLUMN_CREATE/COLUMN_GET, giving schema-flexible storage. JSON is now usually preferred.",
            explanation: {
              heading: 'Key value blobs',
              intro: 'Dynamic columns were an early MariaDB answer to schema flexible data, packing arbitrary attributes into one BLOB column.',
              points: [
                { term: 'COLUMN_CREATE', detail: 'COLUMN_CREATE builds a blob from name and value pairs, letting each row carry its own set of attributes.' },
                { term: 'COLUMN_GET', detail: 'COLUMN_GET reads back a named attribute and casts it to a type, so stored values can be used in queries.' },
                { term: 'Schema flexible', detail: 'Rows can hold different keys, which suits sparse or evolving attributes without altering the table.' },
                { term: 'JSON preferred now', detail: 'For new work the JSON functions are usually favored, and dynamic columns are considered legacy.' },
              ],
            },
            example: "SELECT COLUMN_LIST(attrs) FROM items WHERE id = 1;",
          },
          {
            id: 'maria-dynamic-json',
            code: "SELECT COLUMN_JSON(attrs) FROM items WHERE id = 1;\n-- e.g. {\"color\":\"red\",\"size\":\"L\"}",
            note: "COLUMN_JSON converts a dynamic-column blob to a JSON document, a handy bridge when migrating legacy dynamic columns to the JSON functions now favored for schema-flexible data.",
            explanation: {
              heading: 'Bridging to JSON',
              intro: 'COLUMN_JSON turns the opaque dynamic column blob into readable JSON, which makes migration to the modern JSON functions straightforward.',
              points: [
                { term: 'Blob to document', detail: 'COLUMN_JSON serializes all key value pairs in a dynamic column blob into a single JSON document.' },
                { term: 'Migration aid', detail: 'Reading legacy blobs as JSON lets you copy them into JSON columns and adopt current tooling.' },
                { term: 'COLUMN_ADD edits', detail: 'COLUMN_ADD inserts or updates a key inside the blob, still supporting existing dynamic column data.' },
                { term: 'Inspect easily', detail: 'The JSON form is human readable, which helps when debugging or verifying converted values.' },
              ],
            },
            example: "UPDATE items SET attrs = COLUMN_ADD(attrs, 'stock', 5) WHERE id = 1;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'maria-invisible-columns',
    title: 'INVISIBLE Columns',
    level: 1,
    slug: 'invisible-columns',
    concepts: [],
    children: [
      {
        id: 'maria-invisible-usage',
        title: 'Hidden Columns',
        level: 2,
        slug: 'invisible-usage',
        concepts: [
          {
            id: 'maria-invisible-basic',
            code: "CREATE TABLE t (\n  id INT PRIMARY KEY,\n  secret VARCHAR(100) INVISIBLE\n);\nSELECT * FROM t;          -- omits secret\nSELECT id, secret FROM t; -- explicit access works",
            note: "INVISIBLE columns are hidden from SELECT * and must be named explicitly to read or insert. Useful for adding columns without breaking legacy queries or SELECT *.",
            explanation: {
              heading: 'Columns hidden by default',
              intro: 'An INVISIBLE column exists and stores data like any other, but it stays out of the implicit column list unless you ask for it by name.',
              points: [
                { term: 'Hidden from SELECT star', detail: 'A SELECT * skips INVISIBLE columns, so their addition does not change the shape of existing wildcard queries.' },
                { term: 'Explicit access works', detail: 'Naming the column directly in a SELECT or INSERT reads and writes it normally.' },
                { term: 'Protect legacy code', detail: 'Applications that rely on SELECT * column order keep working when a new INVISIBLE column is added.' },
                { term: 'Toggle visibility', detail: 'ALTER TABLE can flip a column between VISIBLE and INVISIBLE as needs change.' },
              ],
            },
            example: "ALTER TABLE t MODIFY secret VARCHAR(100) VISIBLE;",
          },
          {
            id: 'maria-invisible-migration',
            code: "-- add a column safely to a table used by SELECT * apps\nALTER TABLE orders ADD COLUMN note TEXT INVISIBLE;\nINSERT INTO orders (id, note) VALUES (1, 'gift');",
            note: "INVISIBLE columns ease online schema evolution: add a column that legacy SELECT * code ignores, backfill it, and later flip it VISIBLE once all consumers expect it.",
            explanation: {
              heading: 'Safe schema evolution',
              intro: 'INVISIBLE columns give a staged path for adding fields to busy tables without breaking code that still assumes the old shape.',
              points: [
                { term: 'Add unseen', detail: 'A new column added as INVISIBLE is ignored by SELECT * consumers, so rollout does not require a coordinated deploy.' },
                { term: 'Backfill quietly', detail: 'You can populate the column with historical values while old code remains unaware of it.' },
                { term: 'Flip when ready', detail: 'Once every consumer expects the column, ALTER TABLE marks it VISIBLE to expose it broadly.' },
                { term: 'Lower risk changes', detail: 'This phased approach reduces the blast radius of schema changes on live systems.' },
              ],
            },
            example: "ALTER TABLE orders MODIFY note TEXT VISIBLE;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'maria-transactions',
    title: 'Transactions',
    level: 1,
    slug: 'transactions',
    concepts: [],
    children: [
      {
        id: 'maria-transactions-usage',
        title: 'Transactions and Locking',
        level: 2,
        slug: 'transactions-usage',
        concepts: [
          {
            id: 'maria-transaction-basic',
            code: "START TRANSACTION;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;",
            note: "With InnoDB, MariaDB transactions use START TRANSACTION/COMMIT/ROLLBACK and support SELECT ... FOR UPDATE row locks and configurable isolation levels.",
            explanation: {
              heading: 'Transactional basics',
              intro: 'Backed by InnoDB, MariaDB groups statements into atomic transactions and offers row locking to coordinate concurrent access.',
              points: [
                { term: 'Explicit boundaries', detail: 'START TRANSACTION begins a unit of work that COMMIT makes permanent or ROLLBACK discards entirely.' },
                { term: 'Atomic writes', detail: 'Either all statements in the transaction take effect or none do, protecting invariants like a balanced transfer.' },
                { term: 'Row locking', detail: 'SELECT FOR UPDATE locks the matched rows so another transaction cannot change them until you commit.' },
                { term: 'InnoDB required', detail: 'Full transactional behavior depends on a transactional engine such as InnoDB rather than Aria or MyISAM.' },
              ],
            },
            example: "SELECT * FROM inventory WHERE id = 5 FOR UPDATE;",
          },
          {
            id: 'maria-savepoints',
            code: "START TRANSACTION;\nINSERT INTO log(msg) VALUES ('a');\nSAVEPOINT sp1;\nINSERT INTO log(msg) VALUES ('b');\nROLLBACK TO sp1;  -- undoes 'b'\nCOMMIT;",
            note: "SAVEPOINT marks a checkpoint within a transaction; ROLLBACK TO undoes work after it without aborting the whole transaction. SELECT ... FOR UPDATE SKIP LOCKED helps build job queues.",
            explanation: {
              heading: 'Savepoints and queues',
              intro: 'Savepoints give finer control inside a transaction, and locking hints such as SKIP LOCKED enable concurrent job queue patterns.',
              points: [
                { term: 'Mark a checkpoint', detail: 'SAVEPOINT names a point in the transaction that you can later return to without losing earlier work.' },
                { term: 'Partial rollback', detail: 'ROLLBACK TO undoes only the statements after the savepoint while keeping the transaction open.' },
                { term: 'SKIP LOCKED', detail: 'SELECT FOR UPDATE SKIP LOCKED ignores rows another session already locked, so workers grab different jobs.' },
                { term: 'Queue friendly', detail: 'This lets several workers claim distinct rows concurrently, a common building block for job queues.' },
              ],
            },
            example: "SELECT * FROM jobs WHERE done=0 LIMIT 1 FOR UPDATE SKIP LOCKED;",
          },
          {
            id: 'maria-isolation-levels',
            code: "SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;\nSELECT @@tx_isolation;  -- InnoDB default: REPEATABLE-READ",
            note: "Like MySQL, InnoDB in MariaDB defaults to REPEATABLE READ. Lowering to READ COMMITTED reduces gap locking for high-concurrency workloads; SERIALIZABLE gives the strictest consistency.",
            explanation: {
              heading: 'Choosing isolation levels',
              intro: 'Isolation level sets how much one transaction can observe the uncommitted or changing work of others, trading consistency against concurrency.',
              points: [
                { term: 'REPEATABLE READ default', detail: 'InnoDB defaults to REPEATABLE READ, so repeated reads in a transaction see a stable snapshot.' },
                { term: 'READ COMMITTED', detail: 'Lowering to READ COMMITTED reduces gap locking, which can raise throughput on high concurrency workloads.' },
                { term: 'SERIALIZABLE', detail: 'SERIALIZABLE is the strictest level, making transactions behave as if run one at a time at the cost of more locking.' },
                { term: 'Scope of the setting', detail: 'You can set the level for the session or a single upcoming transaction to match the operation at hand.' },
              ],
            },
            example: "SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;",
          },
        ],
        children: [],
      },
    ],
  },
];

export default topics;
