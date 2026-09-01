// DynamoDB (PartiQL) topic tree.

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  {
    id: 'ddb-primary-keys',
    title: 'Primary Keys',
    level: 1,
    slug: 'primary-keys',
    concepts: [],
    children: [
      {
        id: 'ddb-key-schema',
        title: 'Partition and Sort Keys',
        level: 2,
        slug: 'key-schema',
        concepts: [
          {
            id: 'ddb-key-basic',
            code: "// Composite key: partition (pk) + sort (sk)\n{ pk: 'USER#123', sk: 'PROFILE' }\n{ pk: 'USER#123', sk: 'ORDER#2024-01-01' }\n{ pk: 'USER#123', sk: 'ORDER#2024-02-15' }",
            note: 'The partition key determines which physical partition stores an item; the optional sort key orders items within a partition. Together they must be unique per item.',
            explanation: {
              heading: 'How composite keys work',
              intro: 'Every DynamoDB item is addressed by a primary key that can be a single partition key or a partition key paired with a sort key.',
              points: [
                { term: 'Partition key', detail: 'DynamoDB hashes the partition key to decide which physical partition holds the item.' },
                { term: 'Sort key', detail: 'The optional sort key orders items that share a partition key, enabling range queries within that partition.' },
                { term: 'Uniqueness', detail: 'The full primary key, partition key plus sort key when present, must be unique across the table.' },
                { term: 'Prefixed sort keys', detail: 'Prefixes like PROFILE or ORDER# let one partition hold several related item types.' },
              ],
            },
            example: "// Prefixed sort keys let you model item types in one table",
          },
          {
            id: 'ddb-key-distribution',
            code: "// Good: high-cardinality partition key spreads load\n{ pk: 'USER#8f3a2', sk: 'EVENT#...' }\n\n// Bad: few hot partitions concentrate traffic\n{ pk: 'STATUS#active', sk: 'USER#...' }",
            note: 'DynamoDB spreads throughput across partitions by hashing the partition key. Low-cardinality or skewed keys create hot partitions that throttle. Choose keys that distribute traffic evenly.',
            explanation: {
              heading: 'Avoiding hot partitions',
              intro: 'Even traffic distribution is the single most important factor for DynamoDB performance at scale.',
              points: [
                { term: 'Hashing', detail: 'DynamoDB hashes the partition key value to map each item to a physical partition.' },
                { term: 'High cardinality', detail: 'Keys with many distinct values, such as user or event identifiers, spread reads and writes evenly.' },
                { term: 'Hot partitions', detail: 'Low-cardinality or heavily skewed keys concentrate traffic and cause throttling on a few partitions.' },
                { term: 'Write sharding', detail: 'Appending a random suffix to a busy key spreads its load across multiple partitions.' },
              ],
            },
            example: "// Add a suffix shard to a hot key: STATUS#active#3",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'ddb-put-get',
    title: 'PutItem and GetItem',
    level: 1,
    slug: 'put-get',
    concepts: [],
    children: [
      {
        id: 'ddb-item-ops',
        title: 'Writing and Reading Items',
        level: 2,
        slug: 'item-ops',
        concepts: [
          {
            id: 'ddb-put-get-basic',
            code: "await client.send(new PutCommand({\n  TableName: 'App',\n  Item: { pk: 'USER#123', sk: 'PROFILE', name: 'Alice' }\n}));\n\nawait client.send(new GetCommand({\n  TableName: 'App',\n  Key: { pk: 'USER#123', sk: 'PROFILE' }\n}));",
            note: 'PutItem writes or fully replaces an item by primary key. GetItem fetches a single item by its full key. Both are the cheapest, fastest single-item operations.',
            explanation: {
              heading: 'Single-item reads and writes',
              intro: 'PutItem and GetItem are the primitive operations that address exactly one item by its primary key.',
              points: [
                { term: 'PutItem', detail: 'Creates a new item or fully replaces an existing one that has the same primary key.' },
                { term: 'GetItem', detail: 'Retrieves one item and requires the complete primary key, both partition and sort key when present.' },
                { term: 'Efficiency', detail: 'Because they touch a single item on one partition, they are the fastest and cheapest operations.' },
                { term: 'Full replacement', detail: 'PutItem overwrites the whole item, so use UpdateItem when you want to change only some attributes.' },
              ],
            },
            example: "// GetItem requires the complete primary key",
          },
          {
            id: 'ddb-consistent-read',
            code: "await client.send(new GetCommand({\n  TableName: 'App',\n  Key: { pk: 'USER#123', sk: 'PROFILE' },\n  ConsistentRead: true\n}));",
            note: 'By default GetItem is eventually consistent and cheaper. Set ConsistentRead: true for a strongly consistent read that reflects all prior writes, at double the read cost. GSIs cannot be read consistently.',
            explanation: {
              heading: 'Read consistency models',
              intro: 'DynamoDB lets you trade cost against freshness by choosing how consistent a read must be.',
              points: [
                { term: 'Eventually consistent', detail: 'The default read is cheapest but may not yet reflect a very recent write.' },
                { term: 'Strongly consistent', detail: 'Setting ConsistentRead to true returns the latest committed data at double the read cost.' },
                { term: 'Index limitation', detail: 'Global secondary indexes support only eventually consistent reads, never strong reads.' },
                { term: 'When to use', detail: 'Reserve strong reads for cases where reading slightly stale data would be incorrect.' },
              ],
            },
            example: "// Use strong reads only when stale data is unacceptable",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'ddb-query',
    title: 'Query',
    level: 1,
    slug: 'query',
    concepts: [],
    children: [
      {
        id: 'ddb-key-condition',
        title: 'Key Condition Expressions',
        level: 2,
        slug: 'key-condition',
        concepts: [
          {
            id: 'ddb-query-basic',
            code: "await client.send(new QueryCommand({\n  TableName: 'App',\n  KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',\n  ExpressionAttributeValues: {\n    ':pk': 'USER#123',\n    ':prefix': 'ORDER#2024'\n  }\n}));",
            note: 'Query retrieves items sharing a partition key, optionally narrowing the sort key with =, <, >, between, or begins_with. It is efficient because it reads only one partition.',
            explanation: {
              heading: 'Querying a partition',
              intro: 'Query is the workhorse read operation that targets a single partition and optionally filters by sort key.',
              points: [
                { term: 'Partition key equality', detail: 'A Query must specify one partition key value with an equality condition.' },
                { term: 'Sort key conditions', detail: 'The sort key can be narrowed with equality, comparison, between, or begins_with.' },
                { term: 'Efficiency', detail: 'Query reads only the matching partition, so it stays fast as the table grows.' },
                { term: 'Ordering', detail: 'Setting ScanIndexForward to false returns matching items in descending sort key order.' },
              ],
            },
            example: "// ScanIndexForward: false returns items newest-first",
          },
          {
            id: 'ddb-query-between',
            code: "new QueryCommand({\n  TableName: 'App',\n  KeyConditionExpression: 'pk = :pk AND sk BETWEEN :from AND :to',\n  ExpressionAttributeValues: {\n    ':pk': 'USER#123',\n    ':from': 'ORDER#2024-01',\n    ':to': 'ORDER#2024-03'\n  }\n});",
            note: 'The sort key supports range conditions like BETWEEN and comparison operators, which is why timestamp or version sort keys enable efficient time-range and pagination queries within a partition.',
            explanation: {
              heading: 'Sort key range queries',
              intro: 'Range conditions on the sort key unlock time-window and slice queries without scanning extra data.',
              points: [
                { term: 'BETWEEN', detail: 'BETWEEN matches sort key values within a lower and upper bound, inclusive of both ends.' },
                { term: 'Comparisons', detail: 'Operators like greater than and less than select ranges above or below a value.' },
                { term: 'Timestamp keys', detail: 'Storing sortable timestamps as the sort key makes time-range queries natural and cheap.' },
                { term: 'Server-side filtering', detail: 'Range conditions run in the key layer, so only matching items are read and billed.' },
              ],
            },
            example: "// BETWEEN is inclusive on both bounds",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'ddb-scan',
    title: 'Scan',
    level: 1,
    slug: 'scan',
    concepts: [],
    children: [
      {
        id: 'ddb-scan-ops',
        title: 'Scanning Tables',
        level: 2,
        slug: 'scan-ops',
        concepts: [
          {
            id: 'ddb-scan-basic',
            code: "await client.send(new ScanCommand({\n  TableName: 'App',\n  FilterExpression: 'attribute_exists(email)',\n  Limit: 100\n}));",
            note: 'Scan reads every item in a table, then applies any filter. It is expensive and should be avoided for hot paths; prefer Query on a key or index whenever possible.',
            explanation: {
              heading: 'Why Scan is costly',
              intro: 'Scan walks the entire table, making it the operation of last resort for anything on a request path.',
              points: [
                { term: 'Full read', detail: 'Scan reads every item in the table or index regardless of any filter you apply.' },
                { term: 'Filter timing', detail: 'Filters are applied after items are read, so you pay to read items that are then discarded.' },
                { term: 'Prefer Query', detail: 'A Query on a key or secondary index reads far less data and should be used whenever possible.' },
                { term: 'Valid uses', detail: 'Scan is reasonable for one-off exports, migrations, or small tables, not hot request paths.' },
              ],
            },
            example: "// Use parallel scans (Segment/TotalSegments) for large exports",
          },
          {
            id: 'ddb-parallel-scan',
            code: "// Worker n of 4 scans a distinct slice\nnew ScanCommand({\n  TableName: 'App',\n  Segment: 0,\n  TotalSegments: 4\n});",
            note: 'Parallel scan splits a table into TotalSegments logical slices that workers read concurrently, dramatically speeding full-table jobs. It consumes throughput fast, so cap it on provisioned tables.',
            explanation: {
              heading: 'Parallelizing full scans',
              intro: 'Parallel scan divides the work across many workers to finish large full-table jobs much faster.',
              points: [
                { term: 'Segments', detail: 'TotalSegments defines how many logical slices the table is divided into for concurrent reading.' },
                { term: 'Worker identity', detail: 'Each worker passes a distinct Segment number from zero up to TotalSegments minus one.' },
                { term: 'Throughput cost', detail: 'Many concurrent scanners consume capacity quickly, so throttle segment count on provisioned tables.' },
                { term: 'Best fit', detail: 'Parallel scan suits bulk exports and analytics jobs, not latency-sensitive queries.' },
              ],
            },
            example: "// Each worker passes a unique Segment from 0..TotalSegments-1",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'ddb-filter-expressions',
    title: 'Filter Expressions',
    level: 1,
    slug: 'filter-expressions',
    concepts: [],
    children: [
      {
        id: 'ddb-filter-ops',
        title: 'Filtering Results',
        level: 2,
        slug: 'filter-ops',
        concepts: [
          {
            id: 'ddb-filter-basic',
            code: "new QueryCommand({\n  TableName: 'App',\n  KeyConditionExpression: 'pk = :pk',\n  FilterExpression: '#s = :status AND price > :min',\n  ExpressionAttributeNames: { '#s': 'status' },\n  ExpressionAttributeValues: { ':pk': 'ORDERS', ':status': 'open', ':min': 10 }\n});",
            note: 'Filter expressions run after items are read, removing non-matching ones before returning. They do not reduce read cost. ExpressionAttributeNames alias reserved words like status.',
            explanation: {
              heading: 'Post-read filtering',
              intro: 'Filter expressions trim results after the fact, so they shape output without saving capacity.',
              points: [
                { term: 'Applied after read', detail: 'Filters run once matching key items are read, then drop items that fail the condition.' },
                { term: 'No cost savings', detail: 'You are billed for every item read, not for the smaller set that survives the filter.' },
                { term: 'Reserved words', detail: 'ExpressionAttributeNames aliases reserved words such as status so they can appear in expressions.' },
                { term: 'Keys versus filters', detail: 'Prefer key conditions to select data and use filters only for attributes outside the key.' },
              ],
            },
            example: "// You are billed for items read, not items returned",
          },
          {
            id: 'ddb-filter-functions',
            code: "FilterExpression: 'begins_with(sku, :p) AND contains(tags, :t) AND attribute_type(meta, :type)',\nExpressionAttributeValues: {\n  ':p': 'BOOK-', ':t': 'sale', ':type': 'M'\n}",
            note: 'Filter and condition expressions share functions: attribute_exists, attribute_not_exists, begins_with, contains, size, and attribute_type. contains works on strings and sets; size compares length or set count.',
            explanation: {
              heading: 'Expression functions',
              intro: 'A shared set of built-in functions powers both filter and condition expressions.',
              points: [
                { term: 'Existence checks', detail: 'attribute_exists and attribute_not_exists test whether a named attribute is present on an item.' },
                { term: 'String and set match', detail: 'begins_with tests a string prefix while contains matches a substring or a set member.' },
                { term: 'Size', detail: 'size returns string length, set count, or list length so you can compare against a number.' },
                { term: 'Type check', detail: 'attribute_type confirms an attribute holds a specific DynamoDB type such as string, number, or map.' },
              ],
            },
            example: "// size(cart) > :n filters items whose list attribute is long",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'ddb-projection-expressions',
    title: 'Projection Expressions',
    level: 1,
    slug: 'projection-expressions',
    concepts: [],
    children: [
      {
        id: 'ddb-projection-ops',
        title: 'Selecting Attributes',
        level: 2,
        slug: 'projection-ops',
        concepts: [
          {
            id: 'ddb-projection-basic',
            code: "new GetCommand({\n  TableName: 'App',\n  Key: { pk: 'USER#123', sk: 'PROFILE' },\n  ProjectionExpression: 'pk, #n, email',\n  ExpressionAttributeNames: { '#n': 'name' }\n});",
            note: 'A projection expression returns only the listed attributes, shrinking the response payload. It reduces bandwidth but not read-capacity cost, which is based on item size read.',
            explanation: {
              heading: 'Selecting attributes',
              intro: 'A projection expression declares exactly which attributes come back in the response.',
              points: [
                { term: 'Attribute list', detail: 'Only the named attributes are returned, so unlisted fields are omitted from each item.' },
                { term: 'Bandwidth savings', detail: 'Smaller responses reduce payload size and network transfer over the wire.' },
                { term: 'No capacity savings', detail: 'Read capacity is based on the full item size read, not on the projected subset.' },
                { term: 'Reserved words', detail: 'Use ExpressionAttributeNames to alias reserved keywords such as name within the projection.' },
              ],
            },
            example: "// Alias reserved keywords with ExpressionAttributeNames",
          },
          {
            id: 'ddb-projection-nested',
            code: "ProjectionExpression: 'profile.address.city, orders[0].total',\n// document path syntax into maps and lists",
            note: 'Projection expressions can reach into nested map attributes with dot notation and into list elements with [index]. This returns just the sub-fields you need from deeply structured items.',
            explanation: {
              heading: 'Document path projection',
              intro: 'Projection expressions understand document paths, so you can pull specific fields out of nested structures.',
              points: [
                { term: 'Dot notation', detail: 'A path like profile.address.city reaches into nested map attributes to select one sub-field.' },
                { term: 'List indexing', detail: 'Square brackets with an index, such as orders[0], select a specific element from a list.' },
                { term: 'Targeted returns', detail: 'Combining paths returns only the needed sub-fields from large, deeply structured items.' },
                { term: 'Payload trimming', detail: 'This is useful for shrinking responses when items contain big maps or lists you do not need.' },
              ],
            },
            example: "// Combine document paths to trim large nested items",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'ddb-indexes',
    title: 'Secondary Indexes',
    level: 1,
    slug: 'indexes',
    concepts: [],
    children: [
      {
        id: 'ddb-gsi-lsi',
        title: 'GSI and LSI',
        level: 2,
        slug: 'gsi-lsi',
        concepts: [
          {
            id: 'ddb-index-basic',
            code: "// Query a Global Secondary Index\nnew QueryCommand({\n  TableName: 'App',\n  IndexName: 'GSI1',\n  KeyConditionExpression: 'gsi1pk = :v',\n  ExpressionAttributeValues: { ':v': 'EMAIL#a@x.com' }\n});",
            note: 'A GSI has its own partition/sort key and supports new access patterns with eventual consistency. An LSI shares the table partition key but adds an alternate sort key, allowing strong reads.',
            explanation: {
              heading: 'GSI versus LSI',
              intro: 'Secondary indexes add extra access patterns, and the two kinds differ in flexibility and consistency.',
              points: [
                { term: 'Global secondary index', detail: 'A GSI defines its own partition and sort key, enabling access patterns unrelated to the table key.' },
                { term: 'Local secondary index', detail: 'An LSI reuses the table partition key but adds an alternate sort key for the same partitions.' },
                { term: 'Consistency', detail: 'GSIs are eventually consistent, while LSIs support strongly consistent reads.' },
                { term: 'Creation timing', detail: 'You can add a GSI anytime, but an LSI must be defined when the table is created.' },
              ],
            },
            example: "// Overload GSI keys (gsi1pk/gsi1sk) for many patterns in single-table design",
          },
          {
            id: 'ddb-sparse-index',
            code: "// Only items that have gsi1pk appear in the index\n{ pk: 'ORDER#1', gsi1pk: 'OPEN', total: 50 }   // indexed\n{ pk: 'ORDER#2', total: 30 }                    // absent from GSI",
            note: 'A sparse index only contains items that define the index key attribute. Writing the key only for a subset (e.g. open orders) creates a cheap, pre-filtered index of exactly those items.',
            explanation: {
              heading: 'Sparse index pattern',
              intro: 'A sparse index takes advantage of the rule that items without the index key never appear in it.',
              points: [
                { term: 'Membership rule', detail: 'An item is included in an index only if it defines the attributes used as the index key.' },
                { term: 'Pre-filtering', detail: 'Writing the index key only for a subset, such as open orders, builds a cheap pre-filtered view.' },
                { term: 'Adding and removing', detail: 'Setting the key attribute adds an item to the index and deleting the attribute removes it.' },
                { term: 'Cost benefit', detail: 'Because only relevant items are indexed, storage and query cost stay small.' },
              ],
            },
            example: "// Delete the GSI key attribute to remove an item from the index",
          },
          {
            id: 'ddb-index-projection',
            code: "// Table definition (IaC snippet)\n{\n  IndexName: 'GSI1',\n  Projection: { ProjectionType: 'INCLUDE', NonKeyAttributes: ['status', 'total'] }\n}",
            note: 'Index projection controls which attributes are copied into the index: KEYS_ONLY, INCLUDE (a chosen subset), or ALL. Smaller projections cost less storage but may force a table fetch for missing fields.',
            explanation: {
              heading: 'Choosing a projection',
              intro: 'Projection type decides which attributes are duplicated into an index, balancing storage against extra fetches.',
              points: [
                { term: 'KEYS_ONLY', detail: 'Only the table and index key attributes are stored, giving the smallest and cheapest index.' },
                { term: 'INCLUDE', detail: 'The keys plus a chosen list of non-key attributes are copied into the index.' },
                { term: 'ALL', detail: 'Every attribute is projected, so index queries never need to read back from the base table.' },
                { term: 'Trade-off', detail: 'Smaller projections save storage but may force a follow-up table fetch for attributes not present.' },
              ],
            },
            example: "// Project only what your index queries read to save cost",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'ddb-partiql',
    title: 'PartiQL',
    level: 1,
    slug: 'partiql',
    concepts: [],
    children: [
      {
        id: 'ddb-partiql-ops',
        title: 'SQL-Compatible Statements',
        level: 2,
        slug: 'partiql-ops',
        concepts: [
          {
            id: 'ddb-partiql-basic',
            code: "SELECT * FROM \"App\"\nWHERE pk = 'USER#123' AND begins_with(sk, 'ORDER#');\n\nINSERT INTO \"App\" VALUE {'pk': 'USER#456', 'sk': 'PROFILE', 'name': 'Bob'};\n\nUPDATE \"App\" SET status = 'active' WHERE pk = 'USER#456' AND sk = 'PROFILE';",
            note: 'PartiQL brings SQL-like syntax to DynamoDB with SELECT, INSERT, UPDATE, and DELETE. A SELECT with a key equality runs as an efficient Query; without one it becomes a full Scan.',
            explanation: {
              heading: 'SQL-style access',
              intro: 'PartiQL offers a familiar SQL dialect over DynamoDB while still mapping to the same underlying operations.',
              points: [
                { term: 'Four statements', detail: 'SELECT, INSERT, UPDATE, and DELETE cover reading and writing items with SQL-like syntax.' },
                { term: 'Query versus scan', detail: 'A SELECT with a partition key equality runs as an efficient Query rather than a full Scan.' },
                { term: 'Hidden cost', detail: 'A SELECT without a key condition scans the whole table, which can be expensive.' },
                { term: 'Same engine', detail: 'PartiQL is a surface syntax, so the same capacity and consistency rules still apply.' },
              ],
            },
            example: "// Include the partition key in WHERE to avoid a scan",
          },
          {
            id: 'ddb-partiql-index',
            code: "SELECT * FROM \"App\".\"GSI1\"\nWHERE gsi1pk = 'EMAIL#a@x.com';\n\nSELECT * FROM \"App\" WHERE pk = 'U#1' AND sk IN ['P', 'SETTINGS'];",
            note: 'Query a secondary index by appending its name to the table with dot notation. PartiQL also supports IN lists and functions like begins_with and contains inside the WHERE clause.',
            explanation: {
              heading: 'PartiQL on indexes',
              intro: 'PartiQL can target secondary indexes and use several operators inside the WHERE clause.',
              points: [
                { term: 'Index reference', detail: 'Appending the index name to the table with dot notation directs the query to that index.' },
                { term: 'Quoted identifiers', detail: 'Table and index names are written as separate quoted identifiers in the FROM clause.' },
                { term: 'IN lists', detail: 'An IN list matches a sort key or attribute against several candidate values at once.' },
                { term: 'Functions', detail: 'Functions such as begins_with and contains are available inside the WHERE clause.' },
              ],
            },
            example: "// Quote the table and index names as separate identifiers",
          },
          {
            id: 'ddb-partiql-batch',
            code: "await client.send(new BatchExecuteStatementCommand({\n  Statements: [\n    { Statement: \"SELECT * FROM App WHERE pk = 'U#1' AND sk = 'P'\" },\n    { Statement: \"SELECT * FROM App WHERE pk = 'U#2' AND sk = 'P'\" }\n  ]\n}));",
            note: 'BatchExecuteStatement runs up to 25 PartiQL statements in one call, each targeting a single item by full key. It mixes reads and writes but, like other batches, is not transactional.',
            explanation: {
              heading: 'Batching PartiQL',
              intro: 'BatchExecuteStatement bundles many single-item PartiQL statements to cut round trips.',
              points: [
                { term: 'Statement limit', detail: 'Up to 25 statements run in one call, reducing per-request network overhead.' },
                { term: 'Single-item scope', detail: 'Each statement must resolve to exactly one primary key, not a range of items.' },
                { term: 'Mixed operations', detail: 'A single batch can combine reads and writes across different items.' },
                { term: 'Not atomic', detail: 'Like other batches, it is not transactional, so individual statements can fail independently.' },
              ],
            },
            example: "// Each batched statement must resolve to one primary key",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'ddb-single-table',
    title: 'Single-Table Design',
    level: 1,
    slug: 'single-table',
    concepts: [],
    children: [
      {
        id: 'ddb-single-table-ops',
        title: 'Modeling Many Entities',
        level: 2,
        slug: 'single-table-ops',
        concepts: [
          {
            id: 'ddb-single-table-basic',
            code: "// One table holds many entity types\n{ pk: 'USER#1',  sk: 'USER#1',        type: 'User' }\n{ pk: 'USER#1',  sk: 'ORDER#1001',   type: 'Order' }\n{ pk: 'ORDER#1001', sk: 'ITEM#5',     type: 'LineItem' }",
            note: 'Single-table design stores multiple entity types together and uses key overloading plus GSIs to serve every access pattern with few requests. It trades intuitiveness for performance and cost.',
            explanation: {
              heading: 'One table, many entities',
              intro: 'Single-table design co-locates related entities so common access patterns resolve in as few requests as possible.',
              points: [
                { term: 'Key overloading', detail: 'Generic key names hold different prefixed values so one attribute serves many entity types.' },
                { term: 'Access-pattern first', detail: 'You design keys from the queries you need, not from a normalized entity model.' },
                { term: 'Fewer requests', detail: 'Related items sharing a partition can be fetched together, avoiding multiple round trips.' },
                { term: 'The trade-off', detail: 'The table is harder to read at a glance but performs and scales far better.' },
              ],
            },
            example: "// Design keys from your access patterns, not your entities",
          },
          {
            id: 'ddb-adjacency-list',
            code: "// Model a many-to-many graph with duplicated edges\n{ pk: 'USER#1',  sk: 'GROUP#42' }   // membership\n{ pk: 'GROUP#42', sk: 'USER#1' }    // reverse edge\n// Query pk='USER#1' for a user's groups; pk='GROUP#42' for members",
            note: 'The adjacency-list pattern models many-to-many relationships by storing an item for each direction of an edge. Querying either partition key then lists the related entities in one request.',
            explanation: {
              heading: 'Adjacency-list graphs',
              intro: 'The adjacency-list pattern represents many-to-many relationships as edge items you can traverse from either side.',
              points: [
                { term: 'Edge items', detail: 'Each relationship is stored as an item whose keys encode the two connected entities.' },
                { term: 'Bidirectional lookup', detail: 'Writing an item for each direction lets you query members of a group or groups of a user.' },
                { term: 'Single-request queries', detail: 'A Query on one partition key returns all directly related entities at once.' },
                { term: 'Index reuse', detail: 'A GSI on the sort key can serve the reverse direction from a single stored edge.' },
              ],
            },
            example: "// A GSI on sk can serve both directions from a single edge item",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'ddb-batch',
    title: 'Batch Operations',
    level: 1,
    slug: 'batch',
    concepts: [],
    children: [
      {
        id: 'ddb-batch-ops',
        title: 'BatchGet and BatchWrite',
        level: 2,
        slug: 'batch-ops',
        concepts: [
          {
            id: 'ddb-batch-basic',
            code: "await client.send(new BatchWriteCommand({\n  RequestItems: {\n    'App': [\n      { PutRequest: { Item: { pk: 'U#1', sk: 'P' } } },\n      { DeleteRequest: { Key: { pk: 'U#2', sk: 'P' } } }\n    ]\n  }\n}));",
            note: 'BatchWriteItem groups up to 25 puts/deletes and BatchGetItem fetches up to 100 items in one call. They reduce round trips but can return UnprocessedItems you must retry.',
            explanation: {
              heading: 'Batching many items',
              intro: 'Batch operations pack many single-item requests into one call to cut network overhead.',
              points: [
                { term: 'BatchWriteItem', detail: 'Groups up to 25 put or delete requests in a single call across one or more tables.' },
                { term: 'BatchGetItem', detail: 'Fetches up to 100 items by primary key in one request.' },
                { term: 'Unprocessed items', detail: 'Throttling or size limits can leave some requests unprocessed, and you must retry them.' },
                { term: 'Not atomic', detail: 'Batches are not transactional, so partial success is possible and expected.' },
              ],
            },
            example: "// Batches are not transactional; retry UnprocessedItems",
          },
          {
            id: 'ddb-transactions',
            code: "await client.send(new TransactWriteCommand({\n  TransactItems: [\n    { Update: { TableName: 'App', Key: { pk: 'A', sk: 'BAL' }, UpdateExpression: 'SET amt = amt - :n', ExpressionAttributeValues: { ':n': 100 } } },\n    { Update: { TableName: 'App', Key: { pk: 'B', sk: 'BAL' }, UpdateExpression: 'SET amt = amt + :n', ExpressionAttributeValues: { ':n': 100 } } }\n  ]\n}));",
            note: 'TransactWriteItems applies up to 100 writes atomically: all succeed or all roll back. Unlike batches, transactions guarantee ACID semantics, ideal for transfers and invariants across items.',
            explanation: {
              heading: 'Atomic transactions',
              intro: 'Transactions give all-or-nothing guarantees across multiple items, which batches cannot provide.',
              points: [
                { term: 'All or nothing', detail: 'TransactWriteItems applies up to 100 writes so that either every write succeeds or none does.' },
                { term: 'ACID semantics', detail: 'Transactions guarantee atomicity, consistency, isolation, and durability across the affected items.' },
                { term: 'Consistent reads', detail: 'TransactGetItems reads several items as a single consistent snapshot.' },
                { term: 'Ideal uses', detail: 'Transfers, inventory checks, and cross-item invariants are natural fits for transactions.' },
              ],
            },
            example: "// TransactGetItems reads multiple items in a consistent snapshot",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'ddb-conditional-writes',
    title: 'Conditional Writes',
    level: 1,
    slug: 'conditional-writes',
    concepts: [],
    children: [
      {
        id: 'ddb-conditional-ops',
        title: 'Condition Expressions',
        level: 2,
        slug: 'conditional-ops',
        concepts: [
          {
            id: 'ddb-conditional-basic',
            code: "new PutCommand({\n  TableName: 'App',\n  Item: { pk: 'USER#1', sk: 'PROFILE', email: 'a@x.com' },\n  ConditionExpression: 'attribute_not_exists(pk)'\n});",
            note: 'A condition expression makes a write succeed only if the condition holds, preventing overwrites and enabling optimistic locking. A failed condition throws ConditionalCheckFailedException.',
            explanation: {
              heading: 'Guarded writes',
              intro: 'Condition expressions attach a predicate to a write so it only proceeds when the data is in an expected state.',
              points: [
                { term: 'Conditional success', detail: 'The write commits only if the condition evaluates to true against the current item.' },
                { term: 'Preventing overwrites', detail: 'attribute_not_exists on the key ensures a put creates a new item rather than replacing one.' },
                { term: 'Failure signal', detail: 'A failed condition raises ConditionalCheckFailedException instead of writing.' },
                { term: 'Optimistic locking', detail: 'Checking a version attribute lets concurrent writers detect and resolve conflicts.' },
              ],
            },
            example: "ConditionExpression: 'version = :v' // optimistic concurrency",
          },
          {
            id: 'ddb-optimistic-locking',
            code: "new UpdateCommand({\n  TableName: 'App',\n  Key: { pk: 'DOC#1', sk: 'META' },\n  UpdateExpression: 'SET body = :b, version = version + :one',\n  ConditionExpression: 'version = :expected',\n  ExpressionAttributeValues: { ':b': 'new', ':one': 1, ':expected': 4 }\n});",
            note: 'Optimistic concurrency reads the current version, then writes only if the version is unchanged, incrementing it atomically. A concurrent writer causes the condition to fail so you can retry with fresh data.',
            explanation: {
              heading: 'Optimistic concurrency',
              intro: 'Optimistic locking assumes conflicts are rare and detects them at write time using a version attribute.',
              points: [
                { term: 'Version read', detail: 'The client reads the current version number along with the item data.' },
                { term: 'Guarded update', detail: 'The update only commits when the stored version still equals the version that was read.' },
                { term: 'Atomic increment', detail: 'The same write bumps the version so future writers see the change.' },
                { term: 'Retry on conflict', detail: 'If a concurrent writer wins, the condition fails and you re-read and retry with fresh data.' },
              ],
            },
            example: "// On ConditionalCheckFailed, re-read and retry the update",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'ddb-update-expressions',
    title: 'Update Expressions',
    level: 1,
    slug: 'update-expressions',
    concepts: [],
    children: [
      {
        id: 'ddb-update-ops',
        title: 'SET, ADD, REMOVE, DELETE',
        level: 2,
        slug: 'update-ops',
        concepts: [
          {
            id: 'ddb-update-basic',
            code: "new UpdateCommand({\n  TableName: 'App',\n  Key: { pk: 'PRODUCT#42', sk: 'META' },\n  UpdateExpression: 'SET price = :p ADD viewCount :inc REMOVE oldField',\n  ExpressionAttributeValues: { ':p': 29.99, ':inc': 1 }\n});",
            note: 'Update expressions modify parts of an item in place. SET assigns, ADD increments numbers or adds to sets, REMOVE deletes attributes, and DELETE removes elements from a set.',
            explanation: {
              heading: 'In-place item updates',
              intro: 'Update expressions change individual attributes without reading and rewriting the whole item.',
              points: [
                { term: 'SET', detail: 'SET assigns a value to an attribute or writes computed values such as list_append results.' },
                { term: 'ADD', detail: 'ADD increments a number attribute or inserts elements into a set atomically.' },
                { term: 'REMOVE', detail: 'REMOVE deletes attributes or specific list elements from the item.' },
                { term: 'DELETE', detail: 'DELETE removes one or more elements from a set attribute.' },
              ],
            },
            example: "// list_append(col, :new) appends to a list attribute",
          },
          {
            id: 'ddb-update-if-not-exists',
            code: "UpdateExpression: 'SET createdAt = if_not_exists(createdAt, :now), loginCount = loginCount + :one',\nExpressionAttributeValues: { ':now': 1735689600, ':one': 1 }",
            note: 'if_not_exists(attr, default) sets an attribute only the first time, leaving it untouched on later updates. It is perfect for stamping a createdAt while also incrementing a counter in the same call.',
            explanation: {
              heading: 'Initialize once',
              intro: 'The if_not_exists function lets an update set a default only when an attribute is missing.',
              points: [
                { term: 'First-write default', detail: 'if_not_exists returns the existing value or the supplied default when the attribute is absent.' },
                { term: 'Idempotent stamps', detail: 'It is ideal for a createdAt timestamp that must be written only on the first update.' },
                { term: 'Combined updates', detail: 'The same call can stamp a field once while incrementing a counter every time.' },
                { term: 'No prior read', detail: 'You avoid a separate read to check whether the attribute already exists.' },
              ],
            },
            example: "// Combine an initialize-once field with an in-place increment",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'ddb-ttl',
    title: 'TTL',
    level: 1,
    slug: 'ttl',
    concepts: [],
    children: [
      {
        id: 'ddb-ttl-ops',
        title: 'Time-To-Live Expiry',
        level: 2,
        slug: 'ttl-ops',
        concepts: [
          {
            id: 'ddb-ttl-basic',
            code: "// Store a Unix epoch (seconds) in the TTL attribute\n{\n  pk: 'SESSION#abc',\n  sk: 'META',\n  expiresAt: 1735689600\n}",
            note: 'When TTL is enabled on an attribute, DynamoDB deletes items shortly after that epoch timestamp passes, at no write cost. Deletion is background and can lag by up to 48 hours.',
            explanation: {
              heading: 'Automatic expiry',
              intro: 'Time-to-live lets DynamoDB clean up expired items for you based on a timestamp attribute.',
              points: [
                { term: 'Epoch attribute', detail: 'TTL reads a chosen attribute holding a Unix epoch time in seconds.' },
                { term: 'Free deletion', detail: 'Background TTL deletes consume no write capacity, unlike explicit delete calls.' },
                { term: 'Deletion lag', detail: 'Removal is asynchronous and can lag by up to 48 hours after expiry.' },
                { term: 'Good fits', detail: 'Sessions, caches, and time-bound event data are natural candidates for TTL.' },
              ],
            },
            example: "// Great for sessions, caches, and event data cleanup",
          },
          {
            id: 'ddb-ttl-filter',
            code: "// Filter out logically-expired items still awaiting deletion\nnew QueryCommand({\n  TableName: 'App',\n  KeyConditionExpression: 'pk = :pk',\n  FilterExpression: 'expiresAt > :now',\n  ExpressionAttributeValues: { ':pk': 'SESSION#abc', ':now': Math.floor(Date.now() / 1000) }\n});",
            note: 'Because TTL deletion is not immediate, queries can still return expired items for up to 48 hours. Add a filter on the TTL attribute to hide them, and use TTL Streams to react to deletions.',
            explanation: {
              heading: 'Handling TTL lag',
              intro: 'Because expiry is not instant, applications must treat logically expired items with care.',
              points: [
                { term: 'Visible after expiry', detail: 'Expired items can still appear in queries for up to 48 hours before deletion.' },
                { term: 'Defensive filter', detail: 'A filter comparing the TTL attribute to the current time hides items that have logically expired.' },
                { term: 'React with streams', detail: 'TTL deletions appear in DynamoDB Streams so you can archive or process expired items.' },
                { term: 'Not for precision', detail: 'Never depend on TTL for exact real-time expiry because timing is only approximate.' },
              ],
            },
            example: "// Never rely on TTL for precise, real-time expiry",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'ddb-pagination',
    title: 'Pagination',
    level: 1,
    slug: 'pagination',
    concepts: [],
    children: [
      {
        id: 'ddb-pagination-ops',
        title: 'LastEvaluatedKey',
        level: 2,
        slug: 'pagination-ops',
        concepts: [
          {
            id: 'ddb-pagination-basic',
            code: "let key;\ndo {\n  const res = await client.send(new QueryCommand({\n    TableName: 'App',\n    KeyConditionExpression: 'pk = :pk',\n    ExpressionAttributeValues: { ':pk': 'USER#1' },\n    ExclusiveStartKey: key\n  }));\n  key = res.LastEvaluatedKey;\n} while (key);",
            note: 'Query and Scan return at most 1MB. If more data exists they include LastEvaluatedKey; pass it back as ExclusiveStartKey to fetch the next page until it is undefined.',
            explanation: {
              heading: 'Paging through results',
              intro: 'DynamoDB caps each read response, so large result sets are retrieved page by page.',
              points: [
                { term: 'One megabyte limit', detail: 'Query and Scan return at most one megabyte of data per call.' },
                { term: 'LastEvaluatedKey', detail: 'When more data remains, the response includes a LastEvaluatedKey marking where it stopped.' },
                { term: 'ExclusiveStartKey', detail: 'Passing that key back as ExclusiveStartKey resumes reading from the next item.' },
                { term: 'Loop until done', detail: 'Repeat until LastEvaluatedKey is undefined, which signals the last page.' },
              ],
            },
            example: "// Loop until LastEvaluatedKey is undefined to read everything",
          },
          {
            id: 'ddb-pagination-token',
            code: "// Send an opaque token to the client for stateless paging\nconst token = res.LastEvaluatedKey\n  ? Buffer.from(JSON.stringify(res.LastEvaluatedKey)).toString('base64')\n  : null;\n// Next request decodes it back into ExclusiveStartKey",
            note: 'For web APIs, serialize LastEvaluatedKey into an opaque cursor token (e.g. base64 JSON) and return it to the client. The next request decodes it, enabling stateless forward pagination.',
            explanation: {
              heading: 'Cursor tokens for APIs',
              intro: 'Web APIs expose pagination without server state by handing the client an opaque cursor.',
              points: [
                { term: 'Serialize the key', detail: 'Encode LastEvaluatedKey, often as base64 JSON, into a token the client can hold.' },
                { term: 'Opaque to clients', detail: 'The token is treated as a black box so clients do not depend on its internal shape.' },
                { term: 'Stateless server', detail: 'Decoding the token back into ExclusiveStartKey means the server keeps no session state.' },
                { term: 'End signal', detail: 'Returning a null token tells the client there are no more pages to fetch.' },
              ],
            },
            example: "// A null token signals the client there are no more pages",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'ddb-streams',
    title: 'DynamoDB Streams',
    level: 1,
    slug: 'streams',
    concepts: [],
    children: [
      {
        id: 'ddb-streams-ops',
        title: 'Change Data Capture',
        level: 2,
        slug: 'streams-ops',
        concepts: [
          {
            id: 'ddb-streams-basic',
            code: "// Enable a stream with NEW_AND_OLD_IMAGES, then consume via Lambda\nexports.handler = async (event) => {\n  for (const record of event.Records) {\n    if (record.eventName === 'MODIFY') {\n      const before = record.dynamodb.OldImage;\n      const after  = record.dynamodb.NewImage;\n    }\n  }\n};",
            note: 'DynamoDB Streams captures an ordered log of item changes (INSERT, MODIFY, REMOVE) for 24 hours. A Lambda trigger processes records to fan out updates, maintain aggregates, or sync to other stores.',
            explanation: {
              heading: 'Change data capture',
              intro: 'DynamoDB Streams exposes a time-ordered log of every item change for downstream processing.',
              points: [
                { term: 'Event types', detail: 'Records capture INSERT, MODIFY, and REMOVE events as items change.' },
                { term: 'Retention', detail: 'Stream records are available for 24 hours before they expire.' },
                { term: 'Lambda triggers', detail: 'A Lambda function can consume records to fan out updates or maintain aggregates.' },
                { term: 'Stream view type', detail: 'StreamViewType controls whether records include old, new, or both item images.' },
              ],
            },
            example: "// StreamViewType controls whether you get old, new, or both images",
          },
          {
            id: 'ddb-streams-ttl-events',
            code: "// A TTL deletion appears as a REMOVE with a system principal\nif (record.eventName === 'REMOVE' &&\n    record.userIdentity?.principalId === 'dynamodb.amazonaws.com') {\n  // this deletion was triggered by TTL expiry\n}",
            note: 'TTL deletions surface in the stream as REMOVE events marked with a DynamoDB service principal, letting you archive or react to expired items. This pairs streams with TTL for reliable cleanup pipelines.',
            explanation: {
              heading: 'Reacting to TTL deletes',
              intro: 'Combining streams with TTL lets you observe and act on items as they automatically expire.',
              points: [
                { term: 'REMOVE events', detail: 'A TTL deletion appears in the stream as a REMOVE event just like a manual delete.' },
                { term: 'Service principal', detail: 'The record is tagged with the DynamoDB service principal so TTL deletes are distinguishable.' },
                { term: 'Archival hook', detail: 'You can copy the expiring item to cold storage before it is fully removed.' },
                { term: 'Cleanup pipelines', detail: 'Pairing TTL with streams builds reliable expire-then-process workflows.' },
              ],
            },
            example: "// Detect TTL-driven deletes to archive expiring data",
          },
        ],
        children: [],
      },
    ],
  },
];

export default topics;
