// MySQL topic tree.

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  {
    id: 'mysql-data-types',
    title: 'Data Types',
    level: 1,
    slug: 'data-types',
    concepts: [],
    children: [
      {
        id: 'mysql-numeric-string-types',
        title: 'Numeric and String Types',
        level: 2,
        slug: 'numeric-string',
        concepts: [
          {
            id: 'mysql-numeric-types',
            code: "CREATE TABLE products (\n  id INT UNSIGNED PRIMARY KEY,\n  price DECIMAL(10, 2) NOT NULL,\n  quantity SMALLINT DEFAULT 0,\n  rating FLOAT\n);",
            note: "MySQL offers TINYINT/SMALLINT/INT/BIGINT for integers, DECIMAL for exact money math, and FLOAT/DOUBLE for approximate values. UNSIGNED doubles the positive range.",
            explanation: {
              heading: 'Choosing MySQL numeric types',
              intro: 'MySQL provides several numeric families that trade storage size for range and precision. Picking the right one keeps rows compact and math correct.',
              points: [
                { term: 'Integer sizes', detail: 'TINYINT uses 1 byte, SMALLINT 2, MEDIUMINT 3, INT 4, and BIGINT 8, so pick the smallest type that fits your value range.' },
                { term: 'UNSIGNED range', detail: 'Adding UNSIGNED removes negative values and shifts the whole range upward, so TINYINT UNSIGNED spans 0 to 255 instead of minus 128 to 127.' },
                { term: 'Exact vs approximate', detail: 'DECIMAL stores fixed-point values exactly and is required for money, while FLOAT and DOUBLE are binary approximations that can introduce rounding error.' },
                { term: 'Display width is cosmetic', detail: 'The number in INT(11) only affected zero-fill display and is deprecated in MySQL 8.0, so it never changes the stored range.' },
              ],
            },
            example: "CREATE TABLE t (n TINYINT UNSIGNED);  -- range 0..255",
          },
          {
            id: 'mysql-string-types',
            code: "CREATE TABLE posts (\n  title VARCHAR(255) NOT NULL,\n  body TEXT,\n  status ENUM('draft', 'published', 'archived') DEFAULT 'draft'\n);",
            note: "VARCHAR stores variable-length strings, CHAR is fixed-length, TEXT holds large content, and ENUM constrains a column to a fixed list of string values.",
            explanation: {
              heading: 'String and enum storage',
              intro: 'MySQL has distinct string types tuned for short values, fixed codes, large blobs, and constrained lists. Matching the type to the data controls storage and indexing behavior.',
              points: [
                { term: 'VARCHAR vs CHAR', detail: 'VARCHAR stores only the bytes used plus a length prefix, while CHAR pads to a fixed width, so CHAR suits short constant-length codes.' },
                { term: 'TEXT family', detail: 'TINYTEXT, TEXT, MEDIUMTEXT, and LONGTEXT hold progressively larger content and are stored partly off-page in InnoDB rather than inline.' },
                { term: 'ENUM constraints', detail: 'ENUM restricts a column to a fixed list and stores each value as a compact integer index internally, but reordering the list can be costly.' },
                { term: 'Index length limits', detail: 'You often cannot index a full TEXT column and must use a prefix length, whereas a bounded VARCHAR can be fully indexed.' },
              ],
            },
            example: "ALTER TABLE posts MODIFY body MEDIUMTEXT;",
          },
          {
            id: 'mysql-charset-collation',
            code: "CREATE TABLE messages (\n  body TEXT\n) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;",
            note: "Use utf8mb4 (not the legacy utf8) to store full 4-byte characters like emoji. The collation controls comparison and sorting; _ci is case-insensitive, _bin is byte-exact.",
            explanation: {
              heading: 'Character sets and collations',
              intro: 'A character set defines which characters can be stored and a collation defines how they compare and sort. In MySQL the pairing matters for correctness and index behavior.',
              points: [
                { term: 'Prefer utf8mb4', detail: 'The legacy utf8 alias stores at most 3 bytes per character and cannot hold emoji or some Asian scripts, while utf8mb4 supports the full Unicode range.' },
                { term: 'Collation suffixes', detail: 'A suffix of _ci means case-insensitive and accent-insensitive comparison, while _bin compares raw bytes for exact matching.' },
                { term: 'Comparison and sorting', detail: 'Collation drives ORDER BY order and equality in WHERE, so two rows differing only in case may be treated as equal under a _ci collation.' },
                { term: 'Index compatibility', detail: 'Joining or comparing columns with different collations can prevent index use, so keep related columns on the same character set and collation.' },
              ],
            },
            example: "ALTER TABLE messages CONVERT TO CHARACTER SET utf8mb4;",
          },
        ],
        children: [],
      },
      {
        id: 'mysql-date-types',
        title: 'Date and Time Types',
        level: 2,
        slug: 'date-time-types',
        concepts: [
          {
            id: 'mysql-datetime',
            code: "CREATE TABLE events (\n  id INT PRIMARY KEY,\n  starts_at DATETIME,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);",
            note: "DATETIME stores a fixed date-time; TIMESTAMP is stored in UTC and converts to the session time zone. TIMESTAMP columns can auto-populate with CURRENT_TIMESTAMP.",
            explanation: {
              heading: 'DATETIME versus TIMESTAMP',
              intro: 'MySQL has two main date-time types that differ in time zone handling, storage, and range. The choice affects how stored values behave across sessions and servers.',
              points: [
                { term: 'Time zone behavior', detail: 'TIMESTAMP is converted to UTC on write and back to the session time zone on read, while DATETIME stores the literal value with no conversion.' },
                { term: 'Automatic values', detail: 'Both types support DEFAULT CURRENT_TIMESTAMP and ON UPDATE CURRENT_TIMESTAMP so a column can record insert and update times automatically.' },
                { term: 'Storage size', detail: 'TIMESTAMP uses 4 bytes and DATETIME uses 5 bytes in current MySQL, with extra bytes for fractional seconds precision.' },
                { term: 'Session dependence', detail: 'Because TIMESTAMP shifts with @@session.time_zone, the same stored row can display differently for clients in different zones.' },
              ],
            },
            example: "ALTER TABLE events MODIFY updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;",
          },
          {
            id: 'mysql-timestamp-range',
            code: "-- TIMESTAMP: 1970-2038 (UTC), 4 bytes\n-- DATETIME:  1000-9999, 8 bytes, no time zone conversion\nSELECT @@session.time_zone, UTC_TIMESTAMP(), NOW();",
            note: "TIMESTAMP is limited to 1970–2038 and shifts with the session time zone, while DATETIME spans a huge range but stores no zone. Choose DATETIME for future/historic dates beyond 2038.",
            explanation: {
              heading: 'Range and the 2038 limit',
              intro: 'The two date-time types differ sharply in the span of dates they can represent. Knowing the limits prevents overflow and time zone surprises.',
              points: [
                { term: 'TIMESTAMP window', detail: 'TIMESTAMP can only represent 1970-01-01 UTC through early 2038 because it is based on a 32-bit Unix epoch counter.' },
                { term: 'DATETIME window', detail: 'DATETIME spans years 1000 through 9999, making it the safe choice for far-future scheduling or historical records.' },
                { term: 'Zone conversion cost', detail: 'TIMESTAMP values depend on the session time zone setting, so a misconfigured @@session.time_zone can silently shift displayed times.' },
                { term: 'Setting the zone', detail: 'Running SET time_zone with a fixed offset like plus 00 colon 00 makes TIMESTAMP behavior predictable regardless of the server default.' },
              ],
            },
            example: "SET time_zone = '+00:00';",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'mysql-auto-increment',
    title: 'AUTO_INCREMENT',
    level: 1,
    slug: 'auto-increment',
    concepts: [],
    children: [
      {
        id: 'mysql-auto-increment-usage',
        title: 'Surrogate Keys',
        level: 2,
        slug: 'surrogate-keys',
        concepts: [
          {
            id: 'mysql-auto-inc',
            code: "CREATE TABLE users (\n  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,\n  email VARCHAR(255) NOT NULL\n);\nINSERT INTO users (email) VALUES ('a@x.com');\nSELECT LAST_INSERT_ID();",
            note: "AUTO_INCREMENT generates a unique increasing integer per insert. LAST_INSERT_ID() returns the value assigned by the most recent insert in the session.",
            explanation: {
              heading: 'How AUTO_INCREMENT works',
              intro: 'AUTO_INCREMENT lets InnoDB assign a new surrogate key for each inserted row without the application supplying one. It is the standard way to create primary keys in MySQL.',
              points: [
                { term: 'One per table', detail: 'A table may have only one AUTO_INCREMENT column and it must be indexed, typically as the primary key.' },
                { term: 'Session-scoped read back', detail: 'LAST_INSERT_ID returns the first auto value generated by the current session, so concurrent inserts by other sessions do not disturb your result.' },
                { term: 'Gaps are normal', detail: 'Rolled back or failed inserts consume values, so the sequence can have gaps and should not be assumed contiguous.' },
                { term: 'Resetting the counter', detail: 'ALTER TABLE with AUTO_INCREMENT sets the next value, but it cannot be set below the current maximum key already present.' },
              ],
            },
            example: "ALTER TABLE users AUTO_INCREMENT = 1000;",
          },
          {
            id: 'mysql-uuid-keys',
            code: "CREATE TABLE sessions (\n  id BINARY(16) PRIMARY KEY,\n  user_id BIGINT\n);\nINSERT INTO sessions (id) VALUES (UUID_TO_BIN(UUID(), 1));",
            note: "For distributed or non-sequential keys, store UUIDs as BINARY(16) using UUID_TO_BIN/BIN_TO_UUID. The optional swap flag reorders bytes so UUIDv1 values stay index-friendly.",
            explanation: {
              heading: 'Storing UUIDs efficiently',
              intro: 'UUIDs allow key generation without a central counter, which helps distributed systems. In MySQL they need care so they do not bloat or fragment InnoDB indexes.',
              points: [
                { term: 'Binary storage', detail: 'Storing a UUID as BINARY(16) uses half the space of the 36-character text form and shrinks every secondary index that carries the primary key.' },
                { term: 'Conversion helpers', detail: 'UUID_TO_BIN and BIN_TO_UUID convert between the text and binary forms so applications can still read a familiar hyphenated string.' },
                { term: 'The swap flag', detail: 'Passing 1 as the swap argument reorders the time fields of a version 1 UUID so values increase over time and insert near the end of the clustered index.' },
                { term: 'Random key cost', detail: 'A fully random primary key scatters inserts across the clustered index causing page splits, which is why sequential or swapped keys perform better.' },
              ],
            },
            example: "SELECT BIN_TO_UUID(id, 1) FROM sessions;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'mysql-storage-engines',
    title: 'Storage Engines',
    level: 1,
    slug: 'storage-engines',
    concepts: [],
    children: [
      {
        id: 'mysql-innodb-myisam',
        title: 'InnoDB and MyISAM',
        level: 2,
        slug: 'innodb-myisam',
        concepts: [
          {
            id: 'mysql-innodb',
            code: "CREATE TABLE orders (\n  id BIGINT AUTO_INCREMENT PRIMARY KEY,\n  total DECIMAL(10,2)\n) ENGINE=InnoDB;",
            note: "InnoDB is the default engine: ACID transactions, row-level locking, foreign keys, and crash recovery. MyISAM is table-locked and lacks transactions but is compact for read-only data.",
            explanation: {
              heading: 'InnoDB versus MyISAM',
              intro: 'MySQL supports pluggable storage engines that decide how tables are stored and locked. InnoDB is the modern default while MyISAM is a legacy engine kept for compatibility.',
              points: [
                { term: 'Transactions', detail: 'InnoDB is fully ACID with COMMIT and ROLLBACK, while MyISAM has no transaction support so partial writes cannot be undone.' },
                { term: 'Locking granularity', detail: 'InnoDB locks individual rows allowing high write concurrency, whereas MyISAM locks the entire table on writes and serializes concurrent updates.' },
                { term: 'Referential integrity', detail: 'Only InnoDB enforces foreign key constraints, so MyISAM cannot guarantee that related rows exist.' },
                { term: 'Crash recovery', detail: 'InnoDB uses a redo log to recover automatically after a crash, while MyISAM tables can be left corrupt and may need REPAIR TABLE.' },
              ],
            },
            example: "SELECT engine FROM information_schema.tables WHERE table_name = 'orders';",
          },
          {
            id: 'mysql-clustered-index',
            code: "-- InnoDB stores rows in primary-key order (clustered index)\n-- Secondary indexes store the PK as the row pointer\nCREATE TABLE t (\n  id BIGINT AUTO_INCREMENT PRIMARY KEY,\n  email VARCHAR(255),\n  INDEX idx_email (email)\n) ENGINE=InnoDB;",
            note: "InnoDB tables are organized as a clustered index on the primary key, so PK lookups are fast and secondary indexes carry the PK value. Keep the primary key small and monotonic.",
            explanation: {
              heading: 'The clustered index',
              intro: 'InnoDB physically stores table rows inside the primary key index rather than in a separate heap. This design shapes how lookups and secondary indexes perform.',
              points: [
                { term: 'Rows live in the PK', detail: 'The clustered index holds the full row ordered by primary key, so a primary key lookup fetches the row directly with no extra step.' },
                { term: 'Secondary index pointers', detail: 'Every secondary index stores the primary key value as its row pointer, so a large primary key inflates all secondary indexes.' },
                { term: 'Two-step lookups', detail: 'A secondary index lookup first finds the primary key then reads the clustered index again, unless the index already covers the query.' },
                { term: 'Prefer small monotonic keys', detail: 'A small ever-increasing key like a BIGINT AUTO_INCREMENT keeps inserts appending to the end and avoids page splits.' },
              ],
            },
            example: "-- a random UUID PK bloats every secondary index",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'mysql-string-date-functions',
    title: 'String and Date Functions',
    level: 1,
    slug: 'string-date-functions',
    concepts: [],
    children: [
      {
        id: 'mysql-functions',
        title: 'Common Functions',
        level: 2,
        slug: 'common-functions',
        concepts: [
          {
            id: 'mysql-string-fns',
            code: "SELECT CONCAT(first_name, ' ', last_name) AS full_name,\n       UPPER(email),\n       SUBSTRING(phone, 1, 3) AS area_code\nFROM contacts;",
            note: "MySQL string functions include CONCAT (|| is not concat by default), CONCAT_WS, UPPER/LOWER, SUBSTRING, TRIM, and REPLACE.",
            explanation: {
              heading: 'Common string functions',
              intro: 'MySQL ships a rich set of built-in functions for combining, trimming, and transforming text. A few differ from other SQL dialects in important ways.',
              points: [
                { term: 'Concatenation', detail: 'CONCAT joins arguments and CONCAT_WS adds a separator between them, since the double pipe operator is logical OR in MySQL by default rather than concatenation.' },
                { term: 'Case and trimming', detail: 'UPPER and LOWER change case while TRIM, LTRIM, and RTRIM remove leading or trailing spaces or a specified character.' },
                { term: 'Substrings', detail: 'SUBSTRING extracts by position and length using a 1-based index, and SUBSTRING_INDEX splits around a delimiter.' },
                { term: 'Search and replace', detail: 'REPLACE swaps every occurrence of a substring, and its behavior respects the column collation for matching.' },
              ],
            },
            example: "SELECT REPLACE(sku, '-', '') FROM products;",
          },
          {
            id: 'mysql-date-fns',
            code: "SELECT NOW(),\n       DATE_FORMAT(created_at, '%Y-%m-%d'),\n       DATE_ADD(created_at, INTERVAL 7 DAY) AS due\nFROM tasks;",
            note: "Date functions include NOW/CURDATE, DATE_FORMAT for custom output, DATE_ADD/DATE_SUB with INTERVAL, and DATEDIFF for day differences.",
            explanation: {
              heading: 'Working with dates',
              intro: 'MySQL provides functions to read the current time, reformat values, and do date arithmetic. They cover most reporting and scheduling needs.',
              points: [
                { term: 'Current time', detail: 'NOW returns the full date and time while CURDATE returns just the date, both based on the session time zone.' },
                { term: 'Formatting output', detail: 'DATE_FORMAT turns a date into a custom string using format codes such as percent Y for year and percent m for month.' },
                { term: 'Interval arithmetic', detail: 'DATE_ADD and DATE_SUB shift a date by an INTERVAL expression like INTERVAL 7 DAY, handling month and year boundaries correctly.' },
                { term: 'Differences', detail: 'DATEDIFF returns the whole-day difference between two dates, while TIMESTAMPDIFF can return the gap in other units like minutes or months.' },
              ],
            },
            example: "SELECT DATEDIFF(NOW(), created_at) AS age_days FROM tasks;",
          },
          {
            id: 'mysql-group-concat',
            code: "SELECT customer_id,\n       GROUP_CONCAT(product_name ORDER BY product_name SEPARATOR ', ') AS items\nFROM order_lines\nGROUP BY customer_id;",
            note: "GROUP_CONCAT collapses grouped rows into one delimited string, with optional ORDER BY and SEPARATOR. Raise group_concat_max_len if results get truncated.",
            explanation: {
              heading: 'Aggregating rows into text',
              intro: 'GROUP_CONCAT is a MySQL aggregate that joins values from a group into a single delimited string. It is handy for compact summaries of related rows.',
              points: [
                { term: 'Grouped output', detail: 'Within a GROUP BY query it concatenates one column across all rows of each group into a single string result.' },
                { term: 'Ordering and separator', detail: 'An inner ORDER BY sorts the concatenated values and SEPARATOR sets the delimiter, which defaults to a comma.' },
                { term: 'Removing duplicates', detail: 'Adding DISTINCT inside GROUP_CONCAT collapses repeated values so each appears only once in the output.' },
                { term: 'Length limit', detail: 'Results are silently cut at group_concat_max_len bytes, so raise that session variable when long lists get truncated.' },
              ],
            },
            example: "SELECT GROUP_CONCAT(DISTINCT tag) FROM post_tags;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'mysql-json',
    title: 'JSON Support',
    level: 1,
    slug: 'json',
    concepts: [],
    children: [
      {
        id: 'mysql-json-usage',
        title: 'JSON Columns and Functions',
        level: 2,
        slug: 'json-usage',
        concepts: [
          {
            id: 'mysql-json-query',
            code: "SELECT name, metadata->>'$.email' AS email\nFROM users\nWHERE JSON_CONTAINS(metadata, '\"admin\"', '$.roles');",
            note: "MySQL 5.7+ has a native JSON type. Use -> to extract JSON, ->> to extract unquoted text, and JSON_CONTAINS to search inside documents.",
            explanation: {
              heading: 'Querying JSON documents',
              intro: 'MySQL stores JSON in an optimized binary format and offers operators and functions to read inside documents. This lets you keep semi-structured data in a relational table.',
              points: [
                { term: 'Path expressions', detail: 'JSON paths start with a dollar sign, so dollar dot email selects a top-level field and bracket notation indexes into arrays.' },
                { term: 'Extraction operators', detail: 'The arrow operator returns a JSON value while the double arrow operator returns the value unquoted as plain text.' },
                { term: 'Searching', detail: 'JSON_CONTAINS tests whether a document contains a candidate value at an optional path, returning 1 or 0.' },
                { term: 'Validation on write', detail: 'The native JSON type validates documents on insert and rejects malformed JSON, unlike storing JSON in a plain text column.' },
              ],
            },
            example: "SELECT JSON_EXTRACT(data, '$.items[0].id') FROM carts;",
          },
          {
            id: 'mysql-json-modify',
            code: "UPDATE users\nSET metadata = JSON_SET(metadata, '$.verified', true)\nWHERE id = 1;",
            note: "JSON_SET inserts or updates a path, JSON_INSERT only adds missing paths, and JSON_REMOVE deletes a path. These return a new JSON document.",
            explanation: {
              heading: 'Modifying JSON values',
              intro: 'MySQL provides functions that produce an updated JSON document from an existing one. They differ mainly in how they treat paths that already exist.',
              points: [
                { term: 'JSON_SET', detail: 'JSON_SET adds a value if the path is missing and overwrites it if the path already exists, making it the general-purpose update.' },
                { term: 'JSON_INSERT', detail: 'JSON_INSERT only writes when the path does not yet exist, leaving existing values untouched.' },
                { term: 'JSON_REMOVE', detail: 'JSON_REMOVE deletes the element at a given path and can take several paths in one call.' },
                { term: 'Functional style', detail: 'These functions return a new document rather than mutating in place, so you assign the result back to the column in an UPDATE.' },
              ],
            },
            example: "UPDATE u SET data = JSON_REMOVE(data, '$.temp') WHERE id = 5;",
          },
          {
            id: 'mysql-json-index',
            code: "ALTER TABLE users\n  ADD email VARCHAR(255) AS (metadata->>'$.email') STORED,\n  ADD INDEX idx_email (email);",
            note: "JSON columns cannot be indexed directly. Extract a value into a STORED generated column and index that, so lookups on JSON attributes use the index rather than scanning documents.",
            explanation: {
              heading: 'Indexing JSON attributes',
              intro: 'A whole JSON column cannot carry a normal index, so MySQL needs an indexable expression derived from it. This turns document lookups into fast index seeks.',
              points: [
                { term: 'Generated column path', detail: 'Extract the attribute into a STORED generated column with an expression, then create an ordinary index on that column.' },
                { term: 'Functional index path', detail: 'MySQL 8.0 can index an expression directly using a functional key part, avoiding a visible extra column.' },
                { term: 'Type matters', detail: 'The extracted value should be cast to a concrete type such as CHAR or an integer so the index has a defined, comparable type.' },
                { term: 'Query must match', detail: 'The query predicate has to use the same expression as the index for the optimizer to apply it instead of scanning documents.' },
              ],
            },
            example: "CREATE INDEX idx_role ON users((CAST(metadata->>'$.role' AS CHAR(20))));",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'mysql-indexes',
    title: 'Indexes and EXPLAIN',
    level: 1,
    slug: 'indexes',
    concepts: [],
    children: [
      {
        id: 'mysql-index-tuning',
        title: 'Indexing and Query Plans',
        level: 2,
        slug: 'index-tuning',
        concepts: [
          {
            id: 'mysql-index-create',
            code: "CREATE INDEX idx_email ON users(email);\nCREATE INDEX idx_name ON users(last_name, first_name);",
            note: "Indexes speed reads but slow writes. Composite indexes obey the leftmost-prefix rule: idx_name helps queries filtering on last_name or last_name+first_name.",
            explanation: {
              heading: 'Index design tradeoffs',
              intro: 'Indexes make lookups fast by keeping sorted copies of key columns, but they add cost to writes. Composite indexes in particular follow strict ordering rules.',
              points: [
                { term: 'Read vs write cost', detail: 'Each index accelerates matching reads but must be updated on every INSERT, UPDATE, and DELETE, so unused indexes only add overhead.' },
                { term: 'Leftmost prefix rule', detail: 'A composite index on last_name and first_name can serve filters on last_name alone or both columns, but not on first_name by itself.' },
                { term: 'Column order matters', detail: 'Put the most selective or most frequently filtered column first so more queries can use the leftmost prefix.' },
                { term: 'Inspecting indexes', detail: 'SHOW INDEX FROM lists the indexes on a table along with their column order and estimated cardinality.' },
              ],
            },
            example: "SHOW INDEX FROM users;",
          },
          {
            id: 'mysql-explain',
            code: "EXPLAIN SELECT * FROM users WHERE email = 'x@y.com';",
            note: "EXPLAIN shows the query plan: which index is used, join order, and estimated rows. Watch for type=ALL (full scan) and missing keys as tuning targets.",
            explanation: {
              heading: 'Reading query plans',
              intro: 'EXPLAIN asks the MySQL optimizer to describe how it intends to run a query. Reading its output is the first step in diagnosing slow statements.',
              points: [
                { term: 'Access type', detail: 'The type column ranges from good values like const and ref down to ALL, where type equals ALL means a full table scan worth avoiding.' },
                { term: 'Chosen index', detail: 'The key column shows which index the optimizer picked, and a NULL there signals no usable index was found.' },
                { term: 'Row estimates', detail: 'The rows column estimates how many rows each step examines, so large numbers point to where filtering is weak.' },
                { term: 'Actual timing', detail: 'EXPLAIN ANALYZE in MySQL 8.0 runs the query and reports real timings and row counts, revealing gaps between estimates and reality.' },
              ],
            },
            example: "EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 5;",
          },
          {
            id: 'mysql-covering-index',
            code: "CREATE INDEX idx_cover ON orders(customer_id, status, total);\nEXPLAIN SELECT total FROM orders WHERE customer_id = 5 AND status = 'paid';\n-- Extra: Using index",
            note: "A covering index contains every column a query reads, so InnoDB answers it from the index alone. Look for 'Using index' in the EXPLAIN Extra column to confirm.",
            explanation: {
              heading: 'Covering indexes',
              intro: 'A covering index includes every column a query needs so the engine never has to read the base row. In InnoDB this avoids a second trip to the clustered index.',
              points: [
                { term: 'No table lookup', detail: 'When the index holds all referenced columns, InnoDB satisfies the query from the index pages alone and skips reading the clustered index.' },
                { term: 'Confirming coverage', detail: 'The EXPLAIN Extra column shows Using index when an index is covering, as opposed to Using index condition or a plain lookup.' },
                { term: 'Column ordering', detail: 'Place the equality filter columns first, then range columns, then the selected columns so the index can both seek and cover.' },
                { term: 'Width tradeoff', detail: 'Adding columns to cover a query widens the index and slows writes, so cover only hot, high-value queries.' },
              ],
            },
            example: "-- order matters: filter columns first, then selected columns",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'mysql-fulltext',
    title: 'Full-Text Search',
    level: 1,
    slug: 'fulltext',
    concepts: [],
    children: [
      {
        id: 'mysql-fulltext-usage',
        title: 'FULLTEXT Indexes',
        level: 2,
        slug: 'fulltext-usage',
        concepts: [
          {
            id: 'mysql-fulltext-search',
            code: "ALTER TABLE articles ADD FULLTEXT(title, body);\nSELECT * FROM articles\nWHERE MATCH(title, body) AGAINST('mysql tuning' IN NATURAL LANGUAGE MODE);",
            note: "FULLTEXT indexes enable word-based search with MATCH ... AGAINST. Boolean mode supports +required, -excluded, and wildcard* operators.",
            explanation: {
              heading: 'Full-text search basics',
              intro: 'A FULLTEXT index tokenizes text into words so MySQL can search natural language rather than doing slow LIKE scans. InnoDB has supported it since MySQL 5.6.',
              points: [
                { term: 'MATCH AGAINST', detail: 'Searches use the MATCH column list AGAINST search term syntax, and the column list must match a defined FULLTEXT index.' },
                { term: 'Natural language mode', detail: 'The default natural language mode ranks results by relevance and ignores very common stopwords.' },
                { term: 'Boolean mode', detail: 'Boolean mode adds operators such as plus for required, minus for excluded, and a trailing asterisk for prefix wildcards.' },
                { term: 'Word length limits', detail: 'By default very short words are ignored, controlled by the innodb_ft_min_token_size setting for InnoDB tables.' },
              ],
            },
            example: "SELECT * FROM articles WHERE MATCH(body) AGAINST('+index -myisam' IN BOOLEAN MODE);",
          },
          {
            id: 'mysql-fulltext-relevance',
            code: "SELECT id,\n       MATCH(title, body) AGAINST('performance tuning') AS score\nFROM articles\nWHERE MATCH(title, body) AGAINST('performance tuning')\nORDER BY score DESC;",
            note: "Used in the SELECT list, MATCH ... AGAINST returns a relevance score you can sort by. Reusing the same expression in WHERE and SELECT lets MySQL compute it once.",
            explanation: {
              heading: 'Relevance ranking',
              intro: 'The same MATCH expression that filters rows also yields a numeric relevance score. Exposing that score lets you order results by how well they match.',
              points: [
                { term: 'Score in SELECT', detail: 'Placing MATCH AGAINST in the select list returns a floating-point relevance value for each row instead of a boolean filter.' },
                { term: 'Sorting by relevance', detail: 'Ordering by that score descending puts the most relevant documents first, which is the usual search result order.' },
                { term: 'Compute once', detail: 'Using the identical MATCH expression in both WHERE and SELECT lets MySQL evaluate the full-text search a single time.' },
                { term: 'Score meaning', detail: 'The value combines term frequency and how rare the words are across the table, so it is only comparable within one query.' },
              ],
            },
            example: "ORDER BY MATCH(body) AGAINST('sql') DESC LIMIT 10;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'mysql-stored-procedures',
    title: 'Stored Procedures',
    level: 1,
    slug: 'stored-procedures',
    concepts: [],
    children: [
      {
        id: 'mysql-procedures-usage',
        title: 'Procedures and Parameters',
        level: 2,
        slug: 'procedures-usage',
        concepts: [
          {
            id: 'mysql-proc-basic',
            code: "DELIMITER //\nCREATE PROCEDURE add_bonus(IN dept INT, IN pct DECIMAL(4,2))\nBEGIN\n  UPDATE employees SET salary = salary * (1 + pct)\n  WHERE dept_id = dept;\nEND //\nDELIMITER ;",
            note: "Stored procedures package SQL logic on the server. Parameters use IN, OUT, or INOUT modes. Change DELIMITER so the body's semicolons are not treated as statement ends.",
            explanation: {
              heading: 'Defining stored procedures',
              intro: 'A stored procedure is named SQL logic saved on the server and invoked with CALL. It centralizes multi-statement operations close to the data.',
              points: [
                { term: 'Parameter modes', detail: 'IN passes a value in, OUT returns a value to the caller, and INOUT does both, letting procedures communicate results.' },
                { term: 'DELIMITER trick', detail: 'Since the body contains semicolons, you temporarily change the client DELIMITER so the whole CREATE PROCEDURE is sent as one statement.' },
                { term: 'Invocation', detail: 'You run a procedure with CALL followed by its name and arguments rather than SELECT.' },
                { term: 'Server-side benefits', detail: 'Keeping logic on the server can cut round trips and centralize rules, though it moves application logic into the database.' },
              ],
            },
            example: "CALL add_bonus(3, 0.10);",
          },
          {
            id: 'mysql-proc-cursor-handler',
            code: "DELIMITER //\nCREATE PROCEDURE sum_salaries(OUT total DECIMAL(12,2))\nBEGIN\n  DECLARE done INT DEFAULT 0;\n  DECLARE s DECIMAL(10,2);\n  DECLARE cur CURSOR FOR SELECT salary FROM employees;\n  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;\n  SET total = 0;\n  OPEN cur;\n  read_loop: LOOP\n    FETCH cur INTO s;\n    IF done THEN LEAVE read_loop; END IF;\n    SET total = total + s;\n  END LOOP;\n  CLOSE cur;\nEND //\nDELIMITER ;",
            note: "Inside routines you can declare CURSORs and DECLARE ... HANDLER blocks to react to conditions like NOT FOUND or SQLEXCEPTION. Labeled loops with LEAVE control iteration.",
            explanation: {
              heading: 'Cursors and handlers',
              intro: 'MySQL routines can iterate over query results with cursors and react to events with condition handlers. Together they enable row-by-row procedural logic.',
              points: [
                { term: 'Cursor lifecycle', detail: 'You DECLARE a cursor over a query, OPEN it, FETCH rows one at a time, and CLOSE it when done.' },
                { term: 'NOT FOUND handler', detail: 'A CONTINUE HANDLER FOR NOT FOUND sets a flag when FETCH runs past the last row, which the loop checks to stop.' },
                { term: 'Exception handling', detail: 'An EXIT HANDLER FOR SQLEXCEPTION can catch errors and, for example, issue a ROLLBACK before leaving the block.' },
                { term: 'Labeled loops', detail: 'Naming a loop with a label lets LEAVE exit it and ITERATE restart it, giving structured control over iteration.' },
              ],
            },
            example: "DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'mysql-triggers',
    title: 'Triggers',
    level: 1,
    slug: 'triggers',
    concepts: [],
    children: [
      {
        id: 'mysql-triggers-usage',
        title: 'Row-Level Triggers',
        level: 2,
        slug: 'triggers-usage',
        concepts: [
          {
            id: 'mysql-trigger-basic',
            code: "CREATE TRIGGER trg_audit\nBEFORE UPDATE ON accounts\nFOR EACH ROW\nSET NEW.updated_at = NOW();",
            note: "Triggers run automatically BEFORE or AFTER INSERT/UPDATE/DELETE. Access OLD and NEW pseudo-rows to read or modify values; BEFORE triggers can change NEW.",
            explanation: {
              heading: 'How triggers fire',
              intro: 'A trigger is procedural code that MySQL runs automatically when rows change on a table. It reacts to data events without the application asking.',
              points: [
                { term: 'Timing and event', detail: 'Each trigger fires either BEFORE or AFTER an INSERT, UPDATE, or DELETE on one table.' },
                { term: 'OLD and NEW rows', detail: 'NEW holds the incoming row for inserts and updates while OLD holds the prior row for updates and deletes.' },
                { term: 'Modifying values', detail: 'A BEFORE trigger may assign to NEW columns to adjust the row before it is written, such as stamping an updated_at time.' },
                { term: 'Per row execution', detail: 'MySQL triggers are FOR EACH ROW, so the body runs once for every affected row rather than once per statement.' },
              ],
            },
            example: "CREATE TRIGGER log_del AFTER DELETE ON users FOR EACH ROW INSERT INTO audit(uid) VALUES (OLD.id);",
          },
          {
            id: 'mysql-trigger-validate',
            code: "DELIMITER //\nCREATE TRIGGER trg_check_price\nBEFORE INSERT ON products\nFOR EACH ROW\nBEGIN\n  IF NEW.price < 0 THEN\n    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'price must be >= 0';\n  END IF;\nEND //\nDELIMITER ;",
            note: "A BEFORE trigger can enforce business rules and reject invalid rows by raising an error with SIGNAL SQLSTATE '45000'. This runs before the row is written.",
            explanation: {
              heading: 'Validating with SIGNAL',
              intro: 'Triggers can enforce rules that go beyond column constraints by actively raising errors. SIGNAL is the MySQL statement that throws a custom error.',
              points: [
                { term: 'Reject before write', detail: 'A BEFORE INSERT or BEFORE UPDATE trigger checks the NEW row and can abort the change before any data is stored.' },
                { term: 'Raising an error', detail: 'SIGNAL SQLSTATE with the generic user code 45000 raises an exception that stops the statement and rolls back its effects.' },
                { term: 'Custom messages', detail: 'Setting MESSAGE_TEXT gives the client a clear reason for the rejection instead of a generic constraint error.' },
                { term: 'Business rules', detail: 'This is useful for cross-column rules that CHECK constraints or simple types cannot express, such as conditional validation.' },
              ],
            },
            example: "SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'invalid';",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'mysql-views',
    title: 'Views',
    level: 1,
    slug: 'views',
    concepts: [],
    children: [
      {
        id: 'mysql-views-usage',
        title: 'Creating Views',
        level: 2,
        slug: 'views-usage',
        concepts: [
          {
            id: 'mysql-view-basic',
            code: "CREATE VIEW top_customers AS\nSELECT customer_id, SUM(total) AS spent\nFROM orders\nGROUP BY customer_id\nHAVING SUM(total) > 1000;",
            note: "A view is a saved query exposed as a virtual table. It simplifies repeated queries and can hide columns. Simple views are updatable; aggregated ones are read-only.",
            explanation: {
              heading: 'What a view provides',
              intro: 'A view stores a SELECT statement under a name so it can be queried like a table. It abstracts complex or repeated logic behind a simple interface.',
              points: [
                { term: 'Virtual table', detail: 'A view holds no data of its own and runs its defining query each time it is referenced.' },
                { term: 'Simplify and hide', detail: 'Views can encapsulate joins and aggregations and expose only chosen columns, hiding sensitive fields from consumers.' },
                { term: 'Updatability', detail: 'A simple one-table view without aggregation can accept INSERT and UPDATE, while views using GROUP BY or DISTINCT are read-only.' },
                { term: 'Merge vs temptable', detail: 'MySQL runs a view either by merging it into the outer query or by materializing it into a temporary table depending on its definition.' },
              ],
            },
            example: "SELECT * FROM top_customers ORDER BY spent DESC;",
          },
          {
            id: 'mysql-view-check-option',
            code: "CREATE VIEW active_users AS\nSELECT * FROM users WHERE active = 1\nWITH CHECK OPTION;",
            note: "For an updatable view, WITH CHECK OPTION blocks INSERT/UPDATE that would produce rows failing the view's WHERE clause, keeping data consistent with the view's definition.",
            explanation: {
              heading: 'Guarding updatable views',
              intro: 'An updatable view normally lets writes pass through to the base table even if the new row would fall outside the view. WITH CHECK OPTION closes that gap.',
              points: [
                { term: 'Enforce the filter', detail: 'WITH CHECK OPTION rejects any INSERT or UPDATE through the view that would create a row not matching the view WHERE clause.' },
                { term: 'Prevent row escape', detail: 'Without it, updating a column can push a row out of the view so it silently disappears from later reads.' },
                { term: 'Local vs cascaded', detail: 'CASCADED checks conditions of underlying views too, while LOCAL checks only this view definition.' },
                { term: 'Consistency', detail: 'The option keeps the writable view honest, so what you can insert always matches what the view will show.' },
              ],
            },
            example: "UPDATE active_users SET active = 0 WHERE id = 1;  -- rejected",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'mysql-transactions',
    title: 'Transactions and Locking',
    level: 1,
    slug: 'transactions',
    concepts: [],
    children: [
      {
        id: 'mysql-transactions-usage',
        title: 'Transactions and Locks',
        level: 2,
        slug: 'transactions-usage',
        concepts: [
          {
            id: 'mysql-transaction-basic',
            code: "START TRANSACTION;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;",
            note: "InnoDB transactions start with START TRANSACTION (or BEGIN) and end with COMMIT or ROLLBACK. Set autocommit off to control transaction boundaries explicitly.",
            explanation: {
              heading: 'Transaction boundaries',
              intro: 'InnoDB groups statements into transactions that either fully apply or fully undo. Controlling where a transaction begins and ends keeps related changes atomic.',
              points: [
                { term: 'Explicit start', detail: 'START TRANSACTION or its alias BEGIN opens a transaction that spans the following statements until it ends.' },
                { term: 'Commit or rollback', detail: 'COMMIT makes all changes durable while ROLLBACK discards them, so a failed multi-step operation leaves no partial state.' },
                { term: 'Autocommit mode', detail: 'By default autocommit is on and each statement commits immediately, so setting autocommit to 0 lets you batch several statements.' },
                { term: 'Implicit commits', detail: 'Certain statements like most DDL cause an implicit commit, ending the current transaction whether or not you intended it.' },
              ],
            },
            example: "SET autocommit = 0;",
          },
          {
            id: 'mysql-locking',
            code: "START TRANSACTION;\nSELECT * FROM inventory WHERE id = 5 FOR UPDATE;\n-- other sessions block until COMMIT\nUPDATE inventory SET qty = qty - 1 WHERE id = 5;\nCOMMIT;",
            note: "SELECT ... FOR UPDATE takes exclusive row locks so concurrent transactions cannot modify the rows until you commit, preventing lost updates. FOR SHARE takes shared locks.",
            explanation: {
              heading: 'Locking reads',
              intro: 'InnoDB lets a SELECT take locks so a transaction can read data and safely update it without interference. This coordinates concurrent access to the same rows.',
              points: [
                { term: 'FOR UPDATE', detail: 'FOR UPDATE places exclusive locks on the matched rows so no other transaction can modify or lock them until you commit.' },
                { term: 'FOR SHARE', detail: 'FOR SHARE takes shared locks that let others read but block writes, useful when you must ensure a row stays unchanged while you act on it.' },
                { term: 'Preventing lost updates', detail: 'Reading a value with FOR UPDATE before writing it back stops two transactions from overwriting each other blindly.' },
                { term: 'Blocking and deadlocks', detail: 'Waiting transactions block until the lock holder commits, and conflicting lock orders can produce a deadlock that InnoDB detects and rolls one back.' },
              ],
            },
            example: "SELECT * FROM seats WHERE id = 1 FOR UPDATE;",
          },
          {
            id: 'mysql-isolation-levels',
            code: "SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;\n-- InnoDB default is REPEATABLE READ",
            note: "InnoDB defaults to REPEATABLE READ, which prevents non-repeatable reads via consistent snapshots. READ COMMITTED sees each statement's latest committed data and reduces gap locking.",
            explanation: {
              heading: 'Isolation levels',
              intro: 'The isolation level controls how much one transaction sees of concurrent changes. InnoDB supports the four standard levels with a distinctive default.',
              points: [
                { term: 'REPEATABLE READ default', detail: 'InnoDB defaults to REPEATABLE READ, giving each transaction a consistent snapshot so repeated reads return the same rows.' },
                { term: 'READ COMMITTED', detail: 'READ COMMITTED refreshes the snapshot per statement, so it sees newly committed rows and holds fewer gap locks, reducing lock contention.' },
                { term: 'Gap locking', detail: 'Under REPEATABLE READ, InnoDB locks gaps between index values to prevent phantom rows, which READ COMMITTED largely avoids.' },
                { term: 'Checking the level', detail: 'Selecting the @@transaction_isolation system variable reports the active level for the session.' },
              ],
            },
            example: "SELECT @@transaction_isolation;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'mysql-user-management',
    title: 'User Management and GRANT',
    level: 1,
    slug: 'user-management',
    concepts: [],
    children: [
      {
        id: 'mysql-grants',
        title: 'Users and Privileges',
        level: 2,
        slug: 'grants',
        concepts: [
          {
            id: 'mysql-grant-basic',
            code: "CREATE USER 'app'@'%' IDENTIFIED BY 'secret';\nGRANT SELECT, INSERT, UPDATE ON shop.* TO 'app'@'%';\nFLUSH PRIVILEGES;",
            note: "Users are identified by name@host. GRANT assigns privileges at global, database, table, or column scope; REVOKE removes them. FLUSH PRIVILEGES reloads grant tables.",
            explanation: {
              heading: 'Users and privileges',
              intro: 'MySQL access control ties privileges to accounts that combine a username and a host pattern. GRANT and REVOKE manage what each account may do.',
              points: [
                { term: 'Account identity', detail: 'An account is name at host, so app at percent matches connections from any host while app at localhost matches only the local machine.' },
                { term: 'Privilege scope', detail: 'GRANT can apply at global, single database, single table, or individual column level, letting you scope access precisely.' },
                { term: 'Revoking access', detail: 'REVOKE removes previously granted privileges from an account using the same scope syntax as GRANT.' },
                { term: 'Reloading grants', detail: 'GRANT and REVOKE update grant tables in memory automatically, but FLUSH PRIVILEGES forces a reload after direct edits to those tables.' },
              ],
            },
            example: "REVOKE INSERT ON shop.* FROM 'app'@'%';",
          },
          {
            id: 'mysql-roles',
            code: "CREATE ROLE 'reader';\nGRANT SELECT ON shop.* TO 'reader';\nGRANT 'reader' TO 'app'@'%';\nSET DEFAULT ROLE 'reader' TO 'app'@'%';",
            note: "MySQL 8.0 roles bundle privileges so you grant a role to many users instead of repeating GRANTs. Users activate roles per session or via SET DEFAULT ROLE.",
            explanation: {
              heading: 'Roles bundle privileges',
              intro: 'Roles let you group a set of privileges under a name and assign them as a unit. MySQL 8.0 introduced them to simplify managing many accounts.',
              points: [
                { term: 'Create and grant', detail: 'You CREATE ROLE, grant privileges to the role, then grant the role to accounts so the accounts inherit those privileges.' },
                { term: 'Activation required', detail: 'Granted roles are not active until enabled, so a session uses SET ROLE or the account has a default role set.' },
                { term: 'Default roles', detail: 'SET DEFAULT ROLE makes chosen roles activate automatically at login so users need no extra step.' },
                { term: 'Central maintenance', detail: 'Changing a role privilege updates every account that holds it, avoiding repeated GRANT statements across many users.' },
              ],
            },
            example: "SHOW GRANTS FOR 'app'@'%' USING 'reader';",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'mysql-limit-upsert',
    title: 'LIMIT and Upsert',
    level: 1,
    slug: 'limit-upsert',
    concepts: [],
    children: [
      {
        id: 'mysql-limit',
        title: 'LIMIT and Paging',
        level: 2,
        slug: 'limit',
        concepts: [
          {
            id: 'mysql-limit-basic',
            code: "SELECT * FROM products\nORDER BY id\nLIMIT 10 OFFSET 20;",
            note: "MySQL uses LIMIT count [OFFSET n] for paging. LIMIT 20, 10 is the older offset-first syntax. Always pair with ORDER BY for stable pages.",
            explanation: {
              heading: 'LIMIT and paging',
              intro: 'LIMIT restricts how many rows a query returns and, with an offset, how many it skips. It is the basic building block of pagination in MySQL.',
              points: [
                { term: 'Count and offset', detail: 'LIMIT count OFFSET n returns count rows after skipping n, so LIMIT 10 OFFSET 20 fetches the third page of ten.' },
                { term: 'Legacy syntax', detail: 'The two-argument form LIMIT 20 comma 10 puts the offset first then the count, which is easy to reverse by mistake.' },
                { term: 'Order for stability', detail: 'Without an ORDER BY the row order is undefined, so pages can overlap or drop rows between requests.' },
                { term: 'Tie breaking', detail: 'Include a unique column like the primary key in ORDER BY so rows with equal sort keys still page deterministically.' },
              ],
            },
            example: "SELECT * FROM logs ORDER BY ts DESC LIMIT 5;",
          },
          {
            id: 'mysql-keyset-pagination',
            code: "SELECT * FROM products\nWHERE id > 1000        -- last id from previous page\nORDER BY id\nLIMIT 10;",
            note: "Large OFFSETs are slow because MySQL scans and discards skipped rows. Keyset (seek) pagination filters by the last seen key instead, giving stable performance on deep pages.",
            explanation: {
              heading: 'Keyset pagination',
              intro: 'Offset paging degrades on deep pages because the engine still reads and throws away every skipped row. Keyset pagination seeks straight to the next page.',
              points: [
                { term: 'Offset cost', detail: 'LIMIT with a large OFFSET must scan all skipped rows first, so page 10000 grows steadily slower as the offset grows.' },
                { term: 'Seek by last key', detail: 'Keyset paging remembers the last row key and filters with a WHERE clause like id greater than the last id instead of an offset.' },
                { term: 'Composite ordering', detail: 'When ordering by a non-unique column, compare a tuple such as created_at then id so ties break consistently across pages.' },
                { term: 'Index alignment', detail: 'The seek columns should match an index in the same order so each page is a fast range scan with constant cost.' },
              ],
            },
            example: "WHERE (created_at, id) < (?, ?) ORDER BY created_at DESC, id DESC LIMIT 20;",
          },
        ],
        children: [],
      },
      {
        id: 'mysql-on-duplicate',
        title: 'ON DUPLICATE KEY UPDATE',
        level: 2,
        slug: 'on-duplicate',
        concepts: [
          {
            id: 'mysql-upsert',
            code: "INSERT INTO counters (name, hits)\nVALUES ('home', 1)\nON DUPLICATE KEY UPDATE hits = hits + 1;",
            note: "ON DUPLICATE KEY UPDATE turns an INSERT into an upsert: on a unique/primary-key conflict it runs the UPDATE instead. Reference the attempted value with VALUES() or the row alias.",
            explanation: {
              heading: 'Insert-or-update in one statement',
              intro: 'ON DUPLICATE KEY UPDATE lets a single INSERT insert a new row or update the existing one when a key already matches. It avoids a separate check-then-write round trip.',
              points: [
                { term: 'Conflict trigger', detail: 'The UPDATE clause runs only when the insert would violate a PRIMARY KEY or UNIQUE index, otherwise the row is inserted normally.' },
                { term: 'Referencing the new value', detail: 'Inside the UPDATE you read the value that would have been inserted with VALUES(col) on older versions or a row alias on MySQL 8.0.19+.' },
                { term: 'Common counter pattern', detail: 'Incrementing a column such as hits = hits + 1 makes it easy to maintain counters or last-seen timestamps atomically.' },
                { term: 'Watch multiple unique keys', detail: 'If a row can conflict on more than one unique index the update target is ambiguous, so design the table with a single decisive key.' },
              ],
            },
            example: "INSERT INTO t (id, v) VALUES (1, 5) ON DUPLICATE KEY UPDATE v = VALUES(v);",
          },
          {
            id: 'mysql-insert-ignore-replace',
            code: "INSERT IGNORE INTO tags (label) VALUES ('sql');\nREPLACE INTO settings (k, v) VALUES ('theme', 'dark');",
            note: "INSERT IGNORE skips rows that would violate a unique key (silently discarding errors). REPLACE deletes any conflicting row then inserts the new one, which can fire triggers and reset AUTO_INCREMENT.",
            explanation: {
              heading: 'INSERT IGNORE versus REPLACE',
              intro: 'MySQL offers two more conflict strategies beyond upsert, and they behave very differently. Knowing what each does prevents silent data loss.',
              points: [
                { term: 'INSERT IGNORE', detail: 'On a duplicate-key or other convertible error it skips the offending row and turns the error into a warning instead of failing the statement.' },
                { term: 'REPLACE is delete + insert', detail: 'REPLACE removes any row conflicting on a unique key and inserts a brand new one, so it is not an in-place update.' },
                { term: 'Side effects of REPLACE', detail: 'Because it deletes first, REPLACE fires DELETE triggers, can assign a new AUTO_INCREMENT id, and may cascade foreign-key deletes.' },
                { term: 'Choosing safely', detail: 'Prefer ON DUPLICATE KEY UPDATE when you want to preserve unspecified columns, and reserve REPLACE for truly full-row replacement.' },
              ],
            },
            example: "INSERT IGNORE INTO users (email) VALUES ('dup@x.com');",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'mysql-generated-columns',
    title: 'Generated Columns',
    level: 1,
    slug: 'generated-columns',
    concepts: [],
    children: [
      {
        id: 'mysql-generated-usage',
        title: 'Virtual and Stored Columns',
        level: 2,
        slug: 'generated-usage',
        concepts: [
          {
            id: 'mysql-generated-basic',
            code: "CREATE TABLE orders (\n  price DECIMAL(10,2),\n  qty INT,\n  total DECIMAL(12,2) AS (price * qty) STORED\n);",
            note: "Generated columns derive their value from other columns. VIRTUAL columns compute on read; STORED columns persist on write and can be indexed.",
            explanation: {
              heading: 'Virtual and stored generated columns',
              intro: 'A generated column is defined by an expression over other columns rather than by direct input. MySQL computes it for you, keeping derived data consistent.',
              points: [
                { term: 'VIRTUAL columns', detail: 'A VIRTUAL column is computed each time a row is read and stores nothing on disk, so it is cheap on writes but adds a little read cost.' },
                { term: 'STORED columns', detail: 'A STORED column persists its computed value on insert and update, taking disk space but allowing it to be indexed directly.' },
                { term: 'Consistency guarantee', detail: 'Because the value comes from an expression, it always stays in sync with its source columns and cannot drift out of date.' },
                { term: 'Typical uses', detail: 'Common cases include precomputed totals, extracted JSON fields, or normalized copies used to build indexes for faster lookups.' },
              ],
            },
            example: "ALTER TABLE users ADD domain VARCHAR(100) AS (SUBSTRING_INDEX(email,'@',-1)) VIRTUAL;",
          },
          {
            id: 'mysql-functional-index',
            code: "CREATE TABLE users (\n  email VARCHAR(255),\n  INDEX idx_lower ((LOWER(email)))\n);\nSELECT * FROM users WHERE LOWER(email) = 'a@x.com';",
            note: "MySQL 8.0 functional key parts index an expression directly (note the double parentheses), so case-insensitive or computed lookups use an index without a separate generated column.",
            explanation: {
              heading: 'Functional key parts',
              intro: 'MySQL 8.0 can index the result of an expression instead of a raw column, letting derived lookups use an index. It removes the need to add and maintain a generated column just for indexing.',
              points: [
                { term: 'Index an expression', detail: 'A functional key part wraps an expression such as LOWER(email) so queries filtering on that same expression can seek the index.' },
                { term: 'Double parentheses', detail: 'The expression must be enclosed in an extra set of parentheses, distinguishing it from an ordinary column reference in the index definition.' },
                { term: 'Match the query', detail: 'The index only helps when the WHERE clause uses the identical expression, so the query and index must agree exactly.' },
                { term: 'Built on generated columns', detail: 'Internally MySQL implements this with a hidden virtual generated column, giving the same benefit with less schema to manage.' },
              ],
            },
            example: "CREATE INDEX idx_year ON events((YEAR(starts_at)));",
          },
        ],
        children: [],
      },
    ],
  },
];

export default topics;
