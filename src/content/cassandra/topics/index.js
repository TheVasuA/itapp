// Cassandra CQL topic tree.

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  {
    id: 'cql-keyspaces',
    title: 'Keyspaces',
    level: 1,
    slug: 'keyspaces',
    concepts: [],
    children: [
      {
        id: 'cql-keyspace-ops',
        title: 'Creating Keyspaces',
        level: 2,
        slug: 'keyspace-ops',
        concepts: [
          {
            id: 'cql-create-keyspace',
            code: "CREATE KEYSPACE IF NOT EXISTS my_app\n  WITH replication = {\n    'class': 'NetworkTopologyStrategy',\n    'datacenter1': 3\n  };\n\nUSE my_app;",
            note: 'A keyspace is the top-level namespace, like a database. The replication strategy and factor determine how many copies of data live on how many nodes across datacenters.',
            explanation: {
              heading: 'Keyspaces and Replication',
              intro: 'A keyspace is the outermost container for tables and defines how their data is replicated across the cluster.',
              points: [
                { term: 'NetworkTopologyStrategy', detail: 'The production choice; you set a replication factor per datacenter so copies are placed on distinct racks for fault tolerance.' },
                { term: 'SimpleStrategy', detail: 'Only suitable for a single datacenter or local development because it ignores rack and datacenter topology.' },
                { term: 'Replication factor', detail: 'The number of nodes that hold a copy of each row; a factor of 3 is a common default that tolerates one node loss at QUORUM.' },
                { term: 'IF NOT EXISTS', detail: 'Makes the CREATE idempotent so re-running the statement does not raise an error if the keyspace is already present.' },
              ],
            },
            example: "// SimpleStrategy is for single-DC dev; NetworkTopologyStrategy for prod",
          },
          {
            id: 'cql-alter-keyspace',
            code: "ALTER KEYSPACE my_app\n  WITH replication = {\n    'class': 'NetworkTopologyStrategy',\n    'dc-east': 3,\n    'dc-west': 3\n  };\n\nDESCRIBE KEYSPACE my_app;",
            note: 'ALTER KEYSPACE changes the replication factor, for example when adding a datacenter. After increasing replication you must run nodetool repair so existing data is copied to the new replicas.',
            explanation: {
              heading: 'Altering Replication Safely',
              intro: 'Changing a keyspace replication setting adjusts where new copies live, but it does not automatically move existing data.',
              points: [
                { term: 'Repair is mandatory', detail: 'Raising the replication factor only tells Cassandra where copies should be; nodetool repair actually streams existing rows to the new replicas.' },
                { term: 'Adding a datacenter', detail: 'A common reason to alter a keyspace is expanding to a new region, where you add a per-datacenter entry to the replication map.' },
                { term: 'DESCRIBE KEYSPACE', detail: 'Confirms the current schema and replication settings so you can verify the change took effect before repairing.' },
                { term: 'Consistency window', detail: 'Until repair completes, reads at higher consistency levels against the new replicas may miss data.' },
              ],
            },
            example: "// Always repair after raising the replication factor",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'cql-tables',
    title: 'Tables',
    level: 1,
    slug: 'tables',
    concepts: [],
    children: [
      {
        id: 'cql-table-ops',
        title: 'Defining Tables',
        level: 2,
        slug: 'table-ops',
        concepts: [
          {
            id: 'cql-create-table',
            code: "CREATE TABLE users (\n  user_id UUID PRIMARY KEY,\n  email TEXT,\n  name TEXT,\n  created_at TIMESTAMP\n);",
            note: 'Tables define columns and a primary key. Common types include UUID, TEXT, INT, BIGINT, TIMESTAMP, BOOLEAN, and DECIMAL. Design each table around a specific query.',
            explanation: {
              heading: 'Defining a Table',
              intro: 'A table declares its columns, their types, and a primary key that determines both uniqueness and data placement.',
              points: [
                { term: 'Primary key first', detail: 'Every table needs a primary key; when declared inline on one column, that column is the partition key.' },
                { term: 'Rich type system', detail: 'CQL offers UUID, TEXT, INT, BIGINT, TIMESTAMP, BOOLEAN, DECIMAL, and more, plus collections and user-defined types.' },
                { term: 'Query-driven design', detail: 'Because there are no joins, each table is shaped to answer one access pattern rather than to normalize entities.' },
                { term: 'ALTER is cheap', detail: 'Adding a column is a metadata-only change, but you cannot change a column type or the primary key after creation.' },
              ],
            },
            example: "ALTER TABLE users ADD phone TEXT;",
          },
          {
            id: 'cql-table-options',
            code: "CREATE TABLE sensor_data (\n  sensor_id UUID,\n  ts TIMESTAMP,\n  reading DOUBLE,\n  PRIMARY KEY (sensor_id, ts)\n) WITH default_time_to_live = 604800\n  AND compaction = { 'class': 'TimeWindowCompactionStrategy' };",
            note: 'Table options tune storage behavior: default_time_to_live expires rows automatically, and compaction strategy affects write/read tradeoffs. TimeWindowCompactionStrategy suits append-only time-series data.',
            explanation: {
              heading: 'Tuning Table Storage',
              intro: 'The WITH clause attaches storage options that control expiration, compaction, and other physical behavior of a table.',
              points: [
                { term: 'default_time_to_live', detail: 'Applies a TTL in seconds to every row so data expires automatically without an explicit per-write TTL.' },
                { term: 'Compaction strategy', detail: 'Chooses how SSTables are merged; the strategy trades write amplification against read latency and disk usage.' },
                { term: 'TimeWindowCompactionStrategy', detail: 'Groups data into time buckets so whole SSTables of expired time-series data can be dropped cheaply.' },
                { term: 'Set at create time', detail: 'Options can be changed later with ALTER TABLE, but choosing them upfront avoids costly re-compaction.' },
              ],
            },
            example: "// TWCS groups SSTables by time window for efficient TTL cleanup",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'cql-primary-key',
    title: 'Primary Key Design',
    level: 1,
    slug: 'primary-key',
    concepts: [],
    children: [
      {
        id: 'cql-partition-clustering',
        title: 'Partition and Clustering Keys',
        level: 2,
        slug: 'partition-clustering',
        concepts: [
          {
            id: 'cql-composite-key',
            code: "CREATE TABLE messages (\n  channel_id UUID,\n  sent_at TIMESTAMP,\n  user_id UUID,\n  body TEXT,\n  PRIMARY KEY ((channel_id), sent_at)\n) WITH CLUSTERING ORDER BY (sent_at DESC);",
            note: 'The partition key (in the inner parentheses) picks the node that stores the row. Clustering columns sort rows within a partition, enabling efficient range scans there.',
            explanation: {
              heading: 'Partition and Clustering Keys',
              intro: 'The primary key splits into a partition key that locates data and clustering columns that order it within each partition.',
              points: [
                { term: 'Partition key', detail: 'Hashed by the partitioner to choose which node owns the row, so it controls data distribution and must be in every query.' },
                { term: 'Clustering columns', detail: 'Sort rows inside a single partition on disk, which is what makes range scans and ORDER BY efficient.' },
                { term: 'CLUSTERING ORDER BY', detail: 'Sets the on-disk sort direction, so reading newest-first data becomes a cheap sequential read.' },
                { term: 'Composite partition key', detail: 'Wrapping several columns in extra parentheses combines them into one partition key to spread load more evenly.' },
              ],
            },
            example: "PRIMARY KEY ((org_id, year), month, day) // composite partition key",
          },
          {
            id: 'cql-partition-sizing',
            code: "-- Bad: unbounded partition grows forever\nPRIMARY KEY ((sensor_id), ts)\n\n-- Good: bucket by day to cap partition size\nPRIMARY KEY ((sensor_id, day), ts)",
            note: 'A partition should stay bounded, ideally under ~100MB and 100k rows. High-volume time-series tables add a time bucket (day or month) to the partition key so no single partition grows without limit.',
            explanation: {
              heading: 'Sizing Partitions',
              intro: 'Partition size directly affects performance, so a good model keeps each partition bounded rather than letting it grow forever.',
              points: [
                { term: 'Practical limits', detail: 'Aim to keep partitions under roughly 100MB and 100k rows so reads and repairs stay fast and memory pressure stays low.' },
                { term: 'Unbounded growth', detail: 'A key like sensor_id alone accumulates every reading forever, creating a giant partition that eventually cripples the node.' },
                { term: 'Time bucketing', detail: 'Adding a day or month component to the partition key caps each partition and spreads writes across many nodes.' },
                { term: 'Bucket tradeoff', detail: 'Smaller buckets bound size better but require querying more buckets to cover a wide time range.' },
              ],
            },
            example: "// Bucketing spreads a hot time-series across many partitions",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'cql-insert',
    title: 'Inserting Data',
    level: 1,
    slug: 'insert',
    concepts: [],
    children: [
      {
        id: 'cql-insert-ops',
        title: 'INSERT and Upserts',
        level: 2,
        slug: 'insert-ops',
        concepts: [
          {
            id: 'cql-insert-basic',
            code: "INSERT INTO users (user_id, email, name, created_at)\nVALUES (uuid(), 'a@x.com', 'Alice', toTimestamp(now()));\n\nINSERT INTO users (user_id, email) VALUES (?, ?) IF NOT EXISTS;",
            note: 'INSERT in Cassandra is an upsert: it creates or overwrites the row for that primary key. IF NOT EXISTS enables a lightweight transaction (Paxos) to avoid clobbering.',
            explanation: {
              heading: 'Inserts Are Upserts',
              intro: 'Writing data in Cassandra never fails on a duplicate key; an INSERT simply creates or replaces the row for that primary key.',
              points: [
                { term: 'No distinction from update', detail: 'INSERT and UPDATE both upsert, so an INSERT on an existing key overwrites the specified columns without error.' },
                { term: 'IF NOT EXISTS', detail: 'Forces a lightweight transaction over Paxos to check existence first, at a significant latency cost.' },
                { term: 'Generator functions', detail: 'uuid() produces a random type 4 UUID and now() plus toTimestamp help populate keys and timestamps server-side.' },
                { term: 'Last write wins', detail: 'Without a conditional, concurrent writes to the same cell are resolved by their write timestamp, not by insert order.' },
              ],
            },
            example: "// uuid() and now() are built-in generator functions",
          },
          {
            id: 'cql-prepared-statements',
            code: "// Driver side: prepare once, execute many times\nconst stmt = await client.prepare(\n  'INSERT INTO users (user_id, email) VALUES (?, ?)'\n);\nawait client.execute(stmt, [id, email], { prepare: true });",
            note: 'Prepared statements parse and plan a query once, then reuse it with bound parameters, cutting overhead and preventing CQL injection. They are the recommended way to run repeated parameterized queries.',
            explanation: {
              heading: 'Prepared Statements',
              intro: 'Preparing a statement once and executing it many times with bound values is the recommended pattern for repeated queries.',
              points: [
                { term: 'Parse once', detail: 'The server parses and plans the query a single time and caches it, so subsequent executions skip that work.' },
                { term: 'Injection safe', detail: 'Values travel as bound parameters rather than being concatenated into the CQL text, which prevents injection.' },
                { term: 'Token-aware routing', detail: 'Because the driver knows the key columns, it can route bound requests straight to a replica that owns the data.' },
                { term: 'Prepare at startup', detail: 'Prepare each statement once on connection rather than on every call to avoid needless round trips.' },
              ],
            },
            example: "// Bound ? placeholders are safe and fast to reuse",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'cql-select',
    title: 'Querying Data',
    level: 1,
    slug: 'select',
    concepts: [],
    children: [
      {
        id: 'cql-select-ops',
        title: 'SELECT and Filtering',
        level: 2,
        slug: 'select-ops',
        concepts: [
          {
            id: 'cql-select-basic',
            code: "SELECT * FROM messages\nWHERE channel_id = 550e8400-e29b-41d4-a716-446655440000\n  AND sent_at > '2024-01-01'\nORDER BY sent_at DESC\nLIMIT 50;",
            note: 'Queries must supply the full partition key in WHERE, then may range over clustering columns. ALLOW FILTERING exists but scans broadly and should be avoided in production.',
            explanation: {
              heading: 'Reading With SELECT',
              intro: 'Efficient reads target a known partition, so the query planner requires the partition key and only ranges over clustering columns.',
              points: [
                { term: 'Full partition key', detail: 'The WHERE clause must equality-match every partition key column so Cassandra can find the owning node directly.' },
                { term: 'Clustering ranges', detail: 'After the partition key, you can apply range predicates on clustering columns in their defined order.' },
                { term: 'ORDER BY limits', detail: 'Sorting is only allowed on clustering columns and only in the defined or fully reversed order.' },
                { term: 'ALLOW FILTERING danger', detail: 'It permits scans that read across partitions, which does not scale and usually signals a missing query table.' },
              ],
            },
            example: "// ORDER BY only works on clustering columns",
          },
          {
            id: 'cql-token-paging',
            code: "-- Scan across partitions by token range\nSELECT * FROM users\nWHERE token(user_id) > token(?)\nLIMIT 1000;",
            note: 'The token() function exposes the partitioner hash, letting you page across all partitions in token order for full-table scans. Driver-level paging (fetch size) is preferred for normal result pagination.',
            explanation: {
              heading: 'Paging and Token Scans',
              intro: 'There are two distinct ways to page results: automatic driver paging within a query and manual token ranges for full scans.',
              points: [
                { term: 'token() function', detail: 'Returns the partitioner hash of a value, letting you walk every partition in token order for a full-table scan.' },
                { term: 'Driver paging', detail: 'Setting a fetch size makes the driver stream results in pages transparently, which is preferred for normal pagination.' },
                { term: 'Full scans are heavy', detail: 'Token-range scans touch every node and are meant for batch export or analytics, not interactive queries.' },
                { term: 'Not row offsets', detail: 'Cassandra has no OFFSET, so pagination is cursor-based on the paging state rather than skipping N rows.' },
              ],
            },
            example: "// Prefer automatic driver paging over manual token ranges when possible",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'cql-update-delete',
    title: 'Update and Delete',
    level: 1,
    slug: 'update-delete',
    concepts: [],
    children: [
      {
        id: 'cql-mutate-ops',
        title: 'UPDATE and DELETE',
        level: 2,
        slug: 'mutate-ops',
        concepts: [
          {
            id: 'cql-update-basic',
            code: "UPDATE users SET name = 'Alice B.' WHERE user_id = ?;\n\nDELETE email FROM users WHERE user_id = ?;\nDELETE FROM users WHERE user_id = ?;",
            note: 'UPDATE requires the full primary key and, like INSERT, is an upsert. DELETE can remove specific columns or the entire row. Deletes write tombstones that are cleaned up later.',
            explanation: {
              heading: 'Updating and Deleting',
              intro: 'Mutations always target a specific primary key, and both UPDATE and DELETE behave differently from a traditional relational database.',
              points: [
                { term: 'UPDATE is an upsert', detail: 'It creates the row if the key does not exist, so there is no separate insert-or-update logic to write.' },
                { term: 'Column vs row delete', detail: 'You can delete a single column, leaving the rest of the row, or delete the whole row by omitting column names.' },
                { term: 'Tombstones', detail: 'Every delete writes a marker rather than removing data immediately, which is reclaimed only during later compaction.' },
                { term: 'USING TTL', detail: 'An UPDATE can attach a TTL so the affected columns expire automatically after the given number of seconds.' },
              ],
            },
            example: "UPDATE users USING TTL 3600 SET status = 'temp' WHERE user_id = ?;",
          },
          {
            id: 'cql-tombstones',
            code: "-- Deleting many rows creates tombstones that slow reads\nDELETE FROM events WHERE device_id = ? AND ts < ?;\n\n-- gc_grace_seconds controls how long tombstones live\nALTER TABLE events WITH gc_grace_seconds = 86400;",
            note: 'Cassandra never edits data in place; deletes write tombstone markers that persist for gc_grace_seconds before compaction reclaims them. Excessive tombstones degrade read performance and can fail queries.',
            explanation: {
              heading: 'Understanding Tombstones',
              intro: 'Because storage is append-only, deletions are recorded as tombstones that shadow older data until they are compacted away.',
              points: [
                { term: 'gc_grace_seconds', detail: 'Tombstones must live at least this long, defaulting to ten days, so repair can propagate the delete to every replica.' },
                { term: 'Zombie data risk', detail: 'If a replica misses a delete and the tombstone is purged before repair runs, the deleted row can resurrect.' },
                { term: 'Read amplification', detail: 'Reads must scan past tombstones, and passing a threshold triggers warnings or query failures.' },
                { term: 'Avoid queue patterns', detail: 'Workloads that repeatedly write then delete the same partition build up tombstones and perform poorly.' },
              ],
            },
            example: "// Avoid queue-like delete-heavy workloads to limit tombstones",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'cql-collections',
    title: 'Collections',
    level: 1,
    slug: 'collections',
    concepts: [],
    children: [
      {
        id: 'cql-collection-ops',
        title: 'List, Set, and Map',
        level: 2,
        slug: 'collection-ops',
        concepts: [
          {
            id: 'cql-collections-basic',
            code: "CREATE TABLE profiles (\n  id UUID PRIMARY KEY,\n  emails SET<TEXT>,\n  tags LIST<TEXT>,\n  prefs MAP<TEXT, TEXT>\n);\n\nUPDATE profiles SET emails = emails + {'a@x.com'} WHERE id = ?;",
            note: 'Collections store multiple values in one column. SET holds unique values, LIST keeps order, and MAP holds key-value pairs. Keep collections small; they are read entirely.',
            explanation: {
              heading: 'Collection Columns',
              intro: 'Collections let a single column hold several values, offering three shapes for different needs.',
              points: [
                { term: 'SET', detail: 'Stores unique unordered values and is often the safest collection because its element updates are idempotent.' },
                { term: 'LIST', detail: 'Preserves insertion order and allows duplicates, but ordered operations make some list writes non-idempotent.' },
                { term: 'MAP', detail: 'Holds typed key-value pairs, letting you read or update an individual entry by its key.' },
                { term: 'Keep them small', detail: 'A collection is read in full and has a practical element limit, so it is not a substitute for a table of rows.' },
              ],
            },
            example: "UPDATE profiles SET prefs['theme'] = 'dark' WHERE id = ?;",
          },
          {
            id: 'cql-collection-updates',
            code: "-- Append and prepend to a list\nUPDATE profiles SET tags = tags + ['new'] WHERE id = ?;\nUPDATE profiles SET tags = ['first'] + tags WHERE id = ?;\n\n-- Remove a set element\nUPDATE profiles SET emails = emails - {'old@x.com'} WHERE id = ?;",
            note: 'Collections support element-level updates without reading the whole value: + appends to lists or adds to sets/maps, and - removes. This avoids the read-modify-write cycle of replacing the entire collection.',
            explanation: {
              heading: 'Element-Level Updates',
              intro: 'Collections can be modified in place with plus and minus operators so you avoid rewriting the entire value.',
              points: [
                { term: 'Add and remove', detail: 'The plus operator appends to lists or adds to sets and maps, while minus removes matching elements.' },
                { term: 'No read required', detail: 'These updates are blind writes, so Cassandra does not read the current collection before applying them.' },
                { term: 'List append gotcha', detail: 'Appending to a list is not idempotent, so a retried append after a timeout can add the value twice.' },
                { term: 'Prefer sets', detail: 'Set and map element operations are idempotent, making them safer under retries than list operations.' },
              ],
            },
            example: "// Element updates on sets and maps are idempotent; list appends are not",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'cql-indexes',
    title: 'Secondary Indexes',
    level: 1,
    slug: 'indexes',
    concepts: [],
    children: [
      {
        id: 'cql-index-ops',
        title: 'Creating Indexes',
        level: 2,
        slug: 'index-ops',
        concepts: [
          {
            id: 'cql-secondary-index',
            code: "CREATE INDEX ON users (email);\n\nSELECT * FROM users WHERE email = 'a@x.com';",
            note: 'A secondary index lets you query on a non-key column. It works best for low-cardinality columns within a partition; high-cardinality global indexes scan many nodes and are slow.',
            explanation: {
              heading: 'Secondary Indexes',
              intro: 'A secondary index enables lookups on a non-key column, but its performance depends heavily on cardinality and query scope.',
              points: [
                { term: 'Local index', detail: 'Each node indexes only its own data, so a query without the partition key must fan out to every node.' },
                { term: 'Low cardinality is best', detail: 'Indexes work well when combined with a partition key or on columns with a small set of distinct values.' },
                { term: 'High cardinality trap', detail: 'Indexing something like an email on a huge table forces a scatter-gather across the cluster and is slow.' },
                { term: 'Prefer query tables', detail: 'For frequent lookups on a distinct value, a purpose-built denormalized table outperforms a secondary index.' },
              ],
            },
            example: "// Prefer a dedicated query table over indexing high-cardinality columns",
          },
          {
            id: 'cql-sasi-index',
            code: "CREATE CUSTOM INDEX name_idx ON users (name)\n  USING 'org.apache.cassandra.index.sasi.SASIIndex'\n  WITH OPTIONS = { 'mode': 'CONTAINS' };\n\nSELECT * FROM users WHERE name LIKE '%ali%';",
            note: 'A SASI (SSTable-Attached Secondary Index) supports text LIKE and range queries that regular indexes cannot. It is more flexible but heavier; for demanding search needs a dedicated search engine is often better.',
            explanation: {
              heading: 'SASI Indexes',
              intro: 'SASI is a custom index type that adds text matching and range search capabilities beyond the standard secondary index.',
              points: [
                { term: 'LIKE queries', detail: 'CONTAINS mode enables prefix, suffix, and substring matching on text columns using the LIKE operator.' },
                { term: 'Range support', detail: 'SASI can index numeric or date columns for inequality queries that plain secondary indexes do not handle well.' },
                { term: 'Heavier cost', detail: 'It adds write and memory overhead and has been considered experimental, so evaluate it carefully before production use.' },
                { term: 'Search engines', detail: 'For rich full-text search, an external engine such as Elasticsearch usually outperforms in-database SASI indexes.' },
              ],
            },
            example: "// SASI enables prefix, suffix, and CONTAINS text search",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'cql-materialized-views',
    title: 'Materialized Views',
    level: 1,
    slug: 'materialized-views',
    concepts: [],
    children: [
      {
        id: 'cql-mv-ops',
        title: 'Creating Views',
        level: 2,
        slug: 'mv-ops',
        concepts: [
          {
            id: 'cql-mv-basic',
            code: "CREATE MATERIALIZED VIEW users_by_email AS\n  SELECT * FROM users\n  WHERE email IS NOT NULL AND user_id IS NOT NULL\n  PRIMARY KEY (email, user_id);",
            note: 'A materialized view maintains a second copy of a table keyed differently, so you can query by another column efficiently. Cassandra keeps it in sync automatically on writes.',
            explanation: {
              heading: 'Materialized Views',
              intro: 'A materialized view is a server-maintained denormalization that mirrors a base table under a different primary key.',
              points: [
                { term: 'Automatic sync', detail: 'Writes to the base table are propagated to the view by Cassandra, so you do not update both by hand.' },
                { term: 'Query by new key', detail: 'The view lets you look up rows by a column that was not efficiently queryable in the base table.' },
                { term: 'IS NOT NULL guards', detail: 'View definitions require the new key columns to be non-null so every base row maps to a valid view row.' },
                { term: 'Base read on write', detail: 'Maintaining the view triggers a read of the base row per write, adding overhead compared to a plain table.' },
              ],
            },
            example: "SELECT * FROM users_by_email WHERE email = 'a@x.com';",
          },
          {
            id: 'cql-mv-tradeoffs',
            code: "-- The view's PRIMARY KEY must include all base primary key columns\nPRIMARY KEY (email, user_id)\n-- Alternative: maintain a query table manually via BATCH",
            note: 'A view primary key must contain every base-table key column plus at most one extra. Views add write amplification and have historically had consistency edge cases, so many teams maintain query tables by hand.',
            explanation: {
              heading: 'View Tradeoffs',
              intro: 'Materialized views are convenient but come with constraints and reliability concerns that lead many teams to prefer manual query tables.',
              points: [
                { term: 'Key constraint', detail: 'A view primary key must include all base primary key columns plus at most one additional column.' },
                { term: 'Write amplification', detail: 'Each base write can trigger extra reads and writes to keep the view current, increasing load.' },
                { term: 'Consistency caveats', detail: 'Views have historically had edge cases where they drift out of sync, so they were long treated as experimental.' },
                { term: 'Manual alternative', detail: 'Maintaining a separate query table via batches gives full control over consistency and structure.' },
              ],
            },
            example: "// Manual query tables give more control than materialized views",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'cql-ttl',
    title: 'TTL and Expiration',
    level: 1,
    slug: 'ttl',
    concepts: [],
    children: [
      {
        id: 'cql-ttl-ops',
        title: 'Time-To-Live',
        level: 2,
        slug: 'ttl-ops',
        concepts: [
          {
            id: 'cql-ttl-basic',
            code: "INSERT INTO sessions (id, token) VALUES (?, ?) USING TTL 3600;\n\nSELECT TTL(token) FROM sessions WHERE id = ?;",
            note: 'TTL sets an expiration in seconds; the column or row disappears automatically afterward. TTL() reads remaining seconds. Useful for sessions, caches, and temporary state.',
            explanation: {
              heading: 'Time-To-Live Basics',
              intro: 'TTL attaches a countdown to written data so it expires on its own, which is ideal for transient state.',
              points: [
                { term: 'Per-write expiry', detail: 'USING TTL sets how many seconds the inserted columns live before they are automatically removed.' },
                { term: 'TTL function', detail: 'SELECT TTL(column) returns the remaining seconds for a value, or null if it has no expiration.' },
                { term: 'Cell-level', detail: 'TTL applies to individual non-key columns, so different columns in a row can expire at different times.' },
                { term: 'Great for sessions', detail: 'Session tokens, caches, and temporary flags are natural fits since manual cleanup becomes unnecessary.' },
              ],
            },
            example: "// TTL of 0 or none means the data never expires",
          },
          {
            id: 'cql-ttl-tombstones',
            code: "-- Expired data becomes tombstones until compaction\nALTER TABLE sessions WITH default_time_to_live = 3600\n  AND compaction = { 'class': 'TimeWindowCompactionStrategy' };",
            note: 'TTL expiry produces tombstones just like deletes, so heavy TTL churn can hurt reads. Pairing TTL with TimeWindowCompactionStrategy lets whole expired SSTables be dropped cheaply instead of scanning tombstones.',
            explanation: {
              heading: 'TTL and Tombstones',
              intro: 'Expiration is not free; when data times out it leaves tombstones, so the compaction strategy matters for TTL-heavy tables.',
              points: [
                { term: 'Expiry equals delete', detail: 'A TTL that lapses creates a tombstone just like an explicit delete, adding read overhead until compaction.' },
                { term: 'TWCS pairing', detail: 'TimeWindowCompactionStrategy can drop entire expired SSTables at once rather than scanning individual tombstones.' },
                { term: 'default_time_to_live', detail: 'Setting a table-level TTL ensures every row expires consistently, which aligns cleanly with time-window buckets.' },
                { term: 'Avoid mixed TTLs', detail: 'Widely varying TTLs within one TWCS window prevent whole-SSTable drops and reduce its efficiency.' },
              ],
            },
            example: "// TWCS + TTL efficiently ages out time-series data",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'cql-batch',
    title: 'Batches',
    level: 1,
    slug: 'batch',
    concepts: [],
    children: [
      {
        id: 'cql-batch-ops',
        title: 'BATCH Statements',
        level: 2,
        slug: 'batch-ops',
        concepts: [
          {
            id: 'cql-batch-basic',
            code: "BEGIN BATCH\n  INSERT INTO users (user_id, name) VALUES (?, 'Alice');\n  INSERT INTO users_by_email (email, user_id) VALUES ('a@x.com', ?);\nAPPLY BATCH;",
            note: 'A batch groups writes so denormalized tables stay consistent. Use logged batches for atomicity across a few partitions, not as a bulk-loading tool, which hurts performance.',
            explanation: {
              heading: 'Logged Batches',
              intro: 'A logged batch guarantees that a small set of related writes all eventually apply, which keeps denormalized tables in sync.',
              points: [
                { term: 'Atomicity, not isolation', detail: 'All statements eventually succeed, but other reads may see partial results while the batch is applying.' },
                { term: 'Batch log cost', detail: 'The coordinator writes the batch to a log on replicas first, adding overhead to guarantee completion.' },
                { term: 'Not for bulk loading', detail: 'Using large multi-partition batches to speed up loading actually overloads the coordinator and slows the cluster.' },
                { term: 'Keep it narrow', detail: 'Batches work best across a single or a few partitions that must stay consistent, such as a table and its view table.' },
              ],
            },
            example: "// Keep batches to a single or few partitions",
          },
          {
            id: 'cql-unlogged-batch',
            code: "BEGIN UNLOGGED BATCH\n  INSERT INTO events (id, ts, data) VALUES (?, ?, ?);\n  INSERT INTO events (id, ts, data) VALUES (?, ?, ?);\nAPPLY BATCH;",
            note: 'An UNLOGGED batch skips the batch log, giving no atomicity guarantee but less overhead. It only helps when all statements target the same partition; spanning partitions with unlogged batches is an anti-pattern.',
            explanation: {
              heading: 'Unlogged Batches',
              intro: 'An unlogged batch trades the atomicity guarantee for lower overhead, but it is only beneficial in one narrow case.',
              points: [
                { term: 'No batch log', detail: 'Skipping the batch log means there is no promise that all statements apply if the coordinator fails midway.' },
                { term: 'Same-partition only', detail: 'The single legitimate use is combining writes to one partition into a single mutation for efficiency.' },
                { term: 'Multi-partition anti-pattern', detail: 'Spanning partitions with an unlogged batch scatters work across nodes and typically performs worse than separate writes.' },
                { term: 'Prefer async writes', detail: 'For unrelated writes, issuing individual asynchronous statements usually beats forcing them into a batch.' },
              ],
            },
            example: "// Single-partition unlogged batches are the only safe speedup",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'cql-consistency',
    title: 'Consistency Levels',
    level: 1,
    slug: 'consistency',
    concepts: [],
    children: [
      {
        id: 'cql-consistency-ops',
        title: 'Tunable Consistency',
        level: 2,
        slug: 'consistency-ops',
        concepts: [
          {
            id: 'cql-consistency-basic',
            code: "CONSISTENCY QUORUM;\nSELECT * FROM users WHERE user_id = ?;\n\nCONSISTENCY LOCAL_ONE;",
            note: 'Consistency level sets how many replicas must respond. QUORUM balances safety and availability; ONE is fastest but riskier. Read + write levels overlapping guarantees strong reads.',
            explanation: {
              heading: 'Tunable Consistency',
              intro: 'Cassandra lets you pick per-query how many replicas must acknowledge, trading latency and availability against consistency.',
              points: [
                { term: 'QUORUM', detail: 'Requires a majority of replicas, balancing durability and availability while tolerating the loss of a minority.' },
                { term: 'ONE and LOCAL_ONE', detail: 'Fastest options that need only one replica, but a stale or failed replica can return old data.' },
                { term: 'Strong read rule', detail: 'When read plus write consistency exceeds the replication factor, reads are guaranteed to see the latest write.' },
                { term: 'LOCAL variants', detail: 'LOCAL_QUORUM and LOCAL_ONE keep requests within one datacenter to avoid slow cross-region round trips.' },
              ],
            },
            example: "// R + W > RF gives strong consistency (e.g. QUORUM reads and writes)",
          },
          {
            id: 'cql-lwt',
            code: "UPDATE accounts SET balance = 90\nWHERE id = ?\nIF balance = 100;",
            note: 'Lightweight transactions (IF conditions) use the Paxos protocol for compare-and-set semantics across replicas, providing linearizable updates. They are far slower than normal writes, so use them sparingly.',
            explanation: {
              heading: 'Lightweight Transactions',
              intro: 'Lightweight transactions add conditional writes with linearizable guarantees for the rare cases that need compare-and-set.',
              points: [
                { term: 'Paxos rounds', detail: 'An IF condition runs a multi-phase Paxos consensus, so a single LWT costs several round trips instead of one.' },
                { term: 'Compare-and-set', detail: 'The write only applies if the current value matches the condition, preventing lost updates under contention.' },
                { term: 'Use sparingly', detail: 'Because they are much slower, reserve LWTs for correctness-critical operations like claiming a unique username.' },
                { term: 'SERIAL reads', detail: 'To read the latest LWT-written value reliably, use a SERIAL consistency level that also goes through Paxos.' },
              ],
            },
            example: "// LWT is for correctness-critical updates like unique claims",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'cql-counters',
    title: 'Counters',
    level: 1,
    slug: 'counters',
    concepts: [],
    children: [
      {
        id: 'cql-counter-ops',
        title: 'Counter Columns',
        level: 2,
        slug: 'counter-ops',
        concepts: [
          {
            id: 'cql-counter-basic',
            code: "CREATE TABLE page_views (\n  page_id TEXT PRIMARY KEY,\n  views COUNTER\n);\n\nUPDATE page_views SET views = views + 1 WHERE page_id = 'home';",
            note: 'A counter column supports distributed atomic increments and decrements. A counter table can only contain counter columns plus the primary key, and rows cannot be INSERTed.',
            explanation: {
              heading: 'Counter Columns',
              intro: 'Counters are a special column type for distributed running totals that support atomic increment and decrement.',
              points: [
                { term: 'Atomic add', detail: 'Updates like views = views + 1 apply relative changes safely across replicas without a read first.' },
                { term: 'Table restrictions', detail: 'A counter table may only hold counter columns alongside the primary key; mixing regular columns is not allowed.' },
                { term: 'No INSERT', detail: 'You cannot INSERT a counter row; it comes into existence through an UPDATE that increments it.' },
                { term: 'No TTL', detail: 'Counter columns do not support TTL or explicit value assignment, only relative increments and decrements.' },
              ],
            },
            example: "UPDATE page_views SET views = views - 1 WHERE page_id = 'home';",
          },
          {
            id: 'cql-counter-caveats',
            code: "-- Counters are NOT idempotent on retry\n-- A timed-out increment may or may not have applied\nUPDATE page_views SET views = views + 1 WHERE page_id = 'home';",
            note: 'Counter updates are not idempotent, so a retried increment after a timeout risks double-counting. For exact counts under failures, prefer storing raw events and aggregating, reserving counters for approximate metrics.',
            explanation: {
              heading: 'Counter Caveats',
              intro: 'Counters trade exactness for convenience, so understanding their failure behavior is essential before relying on them.',
              points: [
                { term: 'Not idempotent', detail: 'A retried increment can apply twice because there is no way to tell if a timed-out request already took effect.' },
                { term: 'Timeout ambiguity', detail: 'On a write timeout you cannot know whether the increment applied, so blind retries risk overcounting.' },
                { term: 'Approximate metrics', detail: 'Counters suit dashboards and rough tallies where small drift under failures is acceptable.' },
                { term: 'Exact-count alternative', detail: 'For precise counts, store immutable events and aggregate them so operations stay idempotent and replayable.' },
              ],
            },
            example: "// Do not blindly retry a timed-out counter increment",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'cql-udt',
    title: 'User-Defined Types',
    level: 1,
    slug: 'udt',
    concepts: [],
    children: [
      {
        id: 'cql-udt-ops',
        title: 'Defining and Using UDTs',
        level: 2,
        slug: 'udt-ops',
        concepts: [
          {
            id: 'cql-udt-basic',
            code: "CREATE TYPE address (\n  street TEXT,\n  city TEXT,\n  zip TEXT\n);\n\nCREATE TABLE users (\n  id UUID PRIMARY KEY,\n  home FROZEN<address>\n);",
            note: 'A UDT groups related fields into a reusable structured type. Nested UDTs are usually FROZEN, meaning the whole value is written and read as a single immutable unit.',
            explanation: {
              heading: 'User-Defined Types',
              intro: 'A UDT bundles several named fields into one reusable type so structured data can live inside a single column.',
              points: [
                { term: 'Reusable structure', detail: 'Define a type like address once and use it as a column type across many tables.' },
                { term: 'Keyspace scoped', detail: 'UDTs belong to the keyspace where they are created and can be referenced by any table within it.' },
                { term: 'FROZEN when nested', detail: 'A UDT used inside a collection or as a nested type must be frozen, serializing it as one immutable blob.' },
                { term: 'Literal syntax', detail: 'You write a UDT value as a brace-enclosed set of field assignments matching the type definition.' },
              ],
            },
            example: "INSERT INTO users (id, home) VALUES (uuid(), {street:'1 Main', city:'Seattle', zip:'98101'});",
          },
          {
            id: 'cql-frozen-vs-nonfrozen',
            code: "-- Non-frozen UDT allows updating individual fields\nCREATE TABLE users (id UUID PRIMARY KEY, home address);\nUPDATE users SET home.city = 'Portland' WHERE id = ?;",
            note: 'A non-frozen UDT (at top level) lets you update individual fields in place, while FROZEN treats the value as a single blob you must rewrite entirely. Collections of UDTs generally require FROZEN.',
            explanation: {
              heading: 'Frozen vs Non-Frozen',
              intro: 'Whether a UDT is frozen decides if you can update its fields individually or must rewrite the whole value.',
              points: [
                { term: 'Non-frozen fields', detail: 'A top-level non-frozen UDT allows updating one sub-field, such as home.city, without touching the others.' },
                { term: 'Frozen as a blob', detail: 'A frozen UDT is stored and overwritten as a single unit, so any change rewrites the entire value.' },
                { term: 'Collections need frozen', detail: 'UDTs placed inside collections generally must be frozen because element-level nested mutation is not supported.' },
                { term: 'Choose by write pattern', detail: 'Pick non-frozen when you frequently update individual fields and frozen when the value changes as a whole.' },
              ],
            },
            example: "// Use non-frozen when you update sub-fields often",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'cql-data-modeling',
    title: 'Data Modeling',
    level: 1,
    slug: 'data-modeling',
    concepts: [],
    children: [
      {
        id: 'cql-query-first',
        title: 'Query-First Modeling',
        level: 2,
        slug: 'query-first',
        concepts: [
          {
            id: 'cql-modeling-basic',
            code: "-- Query: get orders for a user, newest first\nCREATE TABLE orders_by_user (\n  user_id UUID,\n  order_ts TIMESTAMP,\n  order_id UUID,\n  total DECIMAL,\n  PRIMARY KEY ((user_id), order_ts)\n) WITH CLUSTERING ORDER BY (order_ts DESC);",
            note: 'In Cassandra you model around queries, not entities. Denormalize into a table per access pattern, duplicating data as needed. Avoid joins and unbounded partitions.',
            explanation: {
              heading: 'Query-First Modeling',
              intro: 'Cassandra data modeling starts from the queries the application runs, not from normalized entities and relationships.',
              points: [
                { term: 'Table per query', detail: 'Design a separate table for each access pattern so every read hits a single partition efficiently.' },
                { term: 'Denormalize freely', detail: 'Duplicating data across tables is expected and healthy because storage is cheap and joins do not exist.' },
                { term: 'Key drives everything', detail: 'Choose the partition and clustering key so the exact query shape maps to a bounded, ordered partition.' },
                { term: 'No joins', detail: 'Since the engine cannot join, related data you need together must be stored together at write time.' },
              ],
            },
            example: "// One table per query; duplication is expected and healthy",
          },
          {
            id: 'cql-modeling-antipatterns',
            code: "-- Anti-pattern: querying without the partition key\nSELECT * FROM orders_by_user WHERE total > 100 ALLOW FILTERING;\n\n-- Anti-pattern: unbounded partition, hot key, huge collections",
            note: 'Common modeling mistakes include relying on ALLOW FILTERING, creating unbounded or hot partitions, and storing large collections. Each forces cluster-wide scans or memory pressure that ruins Cassandra performance.',
            explanation: {
              heading: 'Modeling Anti-Patterns',
              intro: 'A handful of recurring mistakes undermine Cassandra performance, and recognizing them early saves painful redesigns.',
              points: [
                { term: 'ALLOW FILTERING', detail: 'Reaching for it signals a missing query table because it forces scans that do not scale as data grows.' },
                { term: 'Unbounded partitions', detail: 'A partition that grows forever eventually causes slow reads, long repairs, and memory pressure on its node.' },
                { term: 'Hot partitions', detail: 'A key that concentrates most traffic on one partition overloads a single node while others sit idle.' },
                { term: 'Oversized collections', detail: 'Large collections are read in full and strain memory, so model many items as rows in a table instead.' },
              ],
            },
            example: "// If you reach for ALLOW FILTERING, you likely need another table",
          },
        ],
        children: [],
      },
      {
        id: 'cql-time-series',
        title: 'Time-Series Patterns',
        level: 2,
        slug: 'time-series',
        concepts: [
          {
            id: 'cql-timeseries-bucketing',
            code: "CREATE TABLE metrics_by_day (\n  device_id UUID,\n  day DATE,\n  ts TIMESTAMP,\n  value DOUBLE,\n  PRIMARY KEY ((device_id, day), ts)\n) WITH CLUSTERING ORDER BY (ts DESC);",
            note: 'The canonical time-series model buckets by device plus a time window (day) in the partition key and clusters by timestamp. This keeps partitions bounded while allowing efficient recent-first range reads.',
            explanation: {
              heading: 'Time-Series Bucketing',
              intro: 'The standard time-series pattern combines an entity and a time bucket in the partition key with a timestamp clustering column.',
              points: [
                { term: 'Composite partition', detail: 'Pairing device_id with a day bucket bounds each partition and distributes writes across nodes over time.' },
                { term: 'Cluster by timestamp', detail: 'Clustering on ts stores readings in time order so range scans within a bucket are sequential and fast.' },
                { term: 'DESC ordering', detail: 'Setting descending clustering order makes the common recent-first query read from the front of the partition.' },
                { term: 'Bucket sizing', detail: 'Pick a window like day or hour so each partition stays under the practical size limit for your write rate.' },
              ],
            },
            example: "// Choose a bucket size that keeps partitions under ~100MB",
          },
          {
            id: 'cql-timeseries-query',
            code: "SELECT * FROM metrics_by_day\nWHERE device_id = ? AND day = '2024-06-01'\n  AND ts >= '2024-06-01T08:00:00' AND ts < '2024-06-01T09:00:00';",
            note: 'Querying a bucketed time-series requires the full partition key (device plus day) then a clustering range on ts. Spanning multiple days means issuing one query per day bucket and merging client-side.',
            explanation: {
              heading: 'Querying Time-Series',
              intro: 'Reading bucketed time-series data means supplying the full partition key and then a range over the timestamp.',
              points: [
                { term: 'Full key required', detail: 'You must specify both the device and the day bucket so the query targets a single partition.' },
                { term: 'Clustering range', detail: 'After the partition key, a range on ts efficiently returns the readings within a time window.' },
                { term: 'Crossing buckets', detail: 'A query spanning several days needs one query per day bucket, since each is a distinct partition.' },
                { term: 'Client-side merge', detail: 'Results from multiple bucket queries are combined and ordered in the application layer.' },
              ],
            },
            example: "// Reads that cross buckets need one query per bucket",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'cql-operations',
    title: 'Operations',
    level: 1,
    slug: 'operations',
    concepts: [],
    children: [
      {
        id: 'cql-repair-ops',
        title: 'Repair and Compaction',
        level: 2,
        slug: 'repair-ops',
        concepts: [
          {
            id: 'cql-nodetool-repair',
            code: "# Anti-entropy repair keeps replicas consistent\nnodetool repair my_app\n\n# Check pending compactions and status\nnodetool compactionstats\nnodetool status",
            note: 'Because Cassandra is eventually consistent, nodetool repair reconciles divergent replicas and must run regularly (within gc_grace_seconds) to prevent deleted data from resurrecting. nodetool status shows the ring.',
            explanation: {
              heading: 'Repair and Nodetool',
              intro: 'Because replicas can drift under eventual consistency, anti-entropy repair is a routine operational duty rather than an option.',
              points: [
                { term: 'Anti-entropy repair', detail: 'nodetool repair compares replicas and streams missing data so all copies converge to the same state.' },
                { term: 'Run within grace', detail: 'Repair must complete more often than gc_grace_seconds, or purged tombstones can let deleted data reappear.' },
                { term: 'nodetool status', detail: 'Shows each node in the ring with its state and load, which is the first check for cluster health.' },
                { term: 'compactionstats', detail: 'Reveals pending compactions so you can gauge write pressure and background maintenance backlog.' },
              ],
            },
            example: "// Skipping repair can cause tombstoned data to reappear",
          },
          {
            id: 'cql-compaction-strategies',
            code: "-- SizeTiered: default, write-heavy general use\n-- Leveled (LCS): read-heavy, predictable read latency\n-- TimeWindow (TWCS): time-series with TTL\nALTER TABLE events\n  WITH compaction = { 'class': 'LeveledCompactionStrategy' };",
            note: 'Compaction merges SSTables to reclaim space and bound reads. SizeTiered suits write-heavy loads, Leveled optimizes read latency at higher write cost, and TimeWindow efficiently ages out TTL time-series data.',
            explanation: {
              heading: 'Compaction Strategies',
              intro: 'Compaction merges the many SSTables produced by writes, and the chosen strategy shapes the read, write, and space tradeoff.',
              points: [
                { term: 'SizeTieredCompactionStrategy', detail: 'The default that merges similarly sized SSTables; efficient for write-heavy loads but can raise read latency.' },
                { term: 'LeveledCompactionStrategy', detail: 'Organizes data into levels for predictable low read latency at the cost of more write amplification.' },
                { term: 'TimeWindowCompactionStrategy', detail: 'Groups data by time window so TTL time-series data can be dropped as whole expired SSTables.' },
                { term: 'Match to workload', detail: 'Choose the strategy from the table access pattern rather than leaving every table on the default.' },
              ],
            },
            example: "// Match the compaction strategy to the table's access pattern",
          },
        ],
        children: [],
      },
    ],
  },
];

export default topics;
