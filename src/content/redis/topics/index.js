// Redis topic tree.

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  {
    id: 'redis-strings',
    title: 'Strings',
    level: 1,
    slug: 'strings',
    concepts: [],
    children: [
      {
        id: 'redis-string-ops',
        title: 'String Commands',
        level: 2,
        slug: 'string-ops',
        concepts: [
          {
            id: 'redis-set-get',
            code: "SET user:1:name \"Alice\"\nGET user:1:name\nMSET k1 \"v1\" k2 \"v2\"\nMGET k1 k2\nSETNX lock:job \"1\"",
            note: 'Strings hold text, numbers, or serialized blobs up to 512MB. MSET/MGET batch multiple keys. SETNX only sets if the key does not exist, useful for simple locks.',
            explanation: {
              heading: 'The Redis String: The Universal Value',
              intro: 'The string is the most basic Redis value type, but it is far more than plain text. It is a binary-safe byte sequence that can hold any serialized data, and it backs several other structures under the hood.',
              points: [
                { term: 'Binary safe', detail: 'A string can store text, an integer, a float, or a JPEG. Redis does not interpret the bytes, so any language can serialize objects into it.' },
                { term: '512MB ceiling', detail: 'A single string value can grow up to 512 megabytes, but keeping values small keeps memory and network transfer fast.' },
                { term: 'MSET and MGET batch', detail: 'These operate on many keys in one round trip, cutting network latency compared to issuing separate SET and GET calls in a loop.' },
                { term: 'SETNX is atomic', detail: 'It sets a key only when it is absent and returns whether it succeeded, which is the classic building block for a naive lock, though SET with NX and PX is safer.' },
              ],
            },
            example: "APPEND log \"line\\n\"; GETRANGE log 0 9",
          },
          {
            id: 'redis-incr',
            code: "INCR page:views\nINCRBY score 10\nDECR stock:42\nINCRBYFLOAT price 0.5",
            note: 'Numeric strings support atomic counters. INCR/DECR change by one; INCRBY and INCRBYFLOAT change by an arbitrary amount without a read-modify-write race.',
            explanation: {
              heading: 'Atomic Counters Without Race Conditions',
              intro: 'When a string holds a number, Redis can increment or decrement it as a single atomic operation. This removes the read-modify-write race that plagues counters built in application code.',
              points: [
                { term: 'Single atomic step', detail: 'INCR reads, adds one, and stores the result server-side in one operation, so two clients incrementing at the same time never lose an update.' },
                { term: 'Auto-initialization', detail: 'If the key does not exist, Redis treats it as zero before incrementing, so you do not need to seed the counter first.' },
                { term: 'INCRBY and INCRBYFLOAT', detail: 'These change the value by any integer or floating-point amount, useful for scores, balances, and quotas.' },
                { term: 'Type enforcement', detail: 'If the string does not parse as a number, the command returns an error rather than corrupting the value.' },
              ],
            },
            example: "// INCR returns the new value after incrementing",
          },
          {
            id: 'redis-set-options',
            code: "SET session:abc \"data\" EX 300 NX\nSET config:v \"2\" XX GET",
            note: 'SET takes modifiers that fold several commands into one atomic call: EX/PX set a TTL, NX sets only if absent, XX only if present, and GET returns the previous value while setting the new one.',
            explanation: {
              heading: 'SET Modifiers: One Atomic Command',
              intro: 'The modern SET command absorbs the jobs of SETNX, SETEX, and GETSET through option flags. Combining them into one call keeps the operation atomic, which matters for locks and conditional writes.',
              points: [
                { term: 'EX and PX', detail: 'Attach an expiry in seconds or milliseconds at write time, so the key and its TTL are set together with no window where the key lives forever.' },
                { term: 'NX and XX', detail: 'NX writes only if the key is absent and XX only if it already exists, giving you insert-only or update-only semantics.' },
                { term: 'GET flag', detail: 'Returns the previous value while storing the new one, replacing the old GETSET command with a single atomic swap.' },
                { term: 'Lock recipe', detail: 'SET key value NX PX 10000 is the recommended way to acquire a self-expiring lock in one atomic step.' },
              ],
            },
            example: "// SET key val NX EX 30 is an atomic lock-with-expiry",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'redis-expiration',
    title: 'Expiration and TTL',
    level: 1,
    slug: 'expiration',
    concepts: [],
    children: [
      {
        id: 'redis-ttl-ops',
        title: 'Setting and Reading TTL',
        level: 2,
        slug: 'ttl',
        concepts: [
          {
            id: 'redis-ttl',
            code: "SET cache:product:42 \"{...}\" EX 300\nTTL cache:product:42\nEXPIRE cache:product:42 600\nPERSIST cache:product:42",
            note: 'Keys can expire automatically. Set TTL with EX (seconds) or PX (milliseconds) at write time, or EXPIRE on existing keys. PERSIST removes the expiration.',
            explanation: {
              heading: 'Time-To-Live: Self-Cleaning Keys',
              intro: 'Every Redis key can carry an expiration, after which Redis removes it automatically. This is what makes Redis such a natural fit for caches, sessions, and temporary tokens.',
              points: [
                { term: 'Set at write or later', detail: 'Use EX or PX inside SET to expire on write, or call EXPIRE on a key that already exists to add a TTL afterward.' },
                { term: 'TTL return codes', detail: 'TTL returns the remaining seconds, or -1 when the key exists with no expiry, or -2 when the key does not exist at all.' },
                { term: 'PERSIST removes expiry', detail: 'It clears the TTL so the key becomes permanent again without changing its value.' },
                { term: 'Lazy plus active deletion', detail: 'Redis removes expired keys both when they are accessed and via a background sampler, so an expired key may briefly linger in memory before deletion.' },
              ],
            },
            example: "// TTL returns -1 (no expiry) or -2 (key missing)",
          },
          {
            id: 'redis-eviction',
            code: "# redis.conf memory policy\nmaxmemory 512mb\nmaxmemory-policy allkeys-lru\n\n# alternatives: volatile-ttl, allkeys-lfu, noeviction",
            note: 'When memory hits maxmemory, the eviction policy decides what to drop. allkeys-lru evicts least-recently-used keys for a pure cache; volatile-* policies only evict keys that have a TTL set.',
            explanation: {
              heading: 'Eviction: What Happens When Memory Fills',
              intro: 'Once the dataset reaches the maxmemory limit, Redis must decide whether to reject writes or discard existing keys. The maxmemory-policy setting controls that choice.',
              points: [
                { term: 'allkeys versus volatile', detail: 'allkeys policies can evict any key, ideal for a pure cache, while volatile policies only touch keys that have a TTL, protecting persistent data.' },
                { term: 'LRU versus LFU', detail: 'LRU drops the least recently used key, while LFU drops the least frequently used one, which better resists one-off scans polluting the cache.' },
                { term: 'noeviction', detail: 'The default rejects new writes with an error once memory is full instead of discarding data, which can surprise applications expecting a cache.' },
                { term: 'Approximate sampling', detail: 'Redis approximates LRU and LFU by sampling a handful of keys rather than scanning all of them, trading perfect accuracy for speed.' },
              ],
            },
            example: "// Use volatile-lru to protect keys without an expiry",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'redis-hashes',
    title: 'Hashes',
    level: 1,
    slug: 'hashes',
    concepts: [],
    children: [
      {
        id: 'redis-hash-ops',
        title: 'Hash Commands',
        level: 2,
        slug: 'hash-ops',
        concepts: [
          {
            id: 'redis-hset',
            code: "HSET user:1001 name \"Alice\" email \"a@x.com\" age 30\nHGET user:1001 name\nHGETALL user:1001\nHINCRBY user:1001 age 1",
            note: 'Hashes store field-value pairs under one key, ideal for representing objects compactly. HSET writes fields, HGETALL reads them all, HINCRBY increments a numeric field.',
            explanation: {
              heading: 'Hashes: Objects Under One Key',
              intro: 'A hash maps field names to values inside a single key, which is the natural way to model an object like a user or a product. It groups related data so you can update one field without rewriting the whole record.',
              points: [
                { term: 'Field-level operations', detail: 'HSET and HGET read and write individual fields, so you avoid serializing and reserializing an entire object for a one-field change.' },
                { term: 'HINCRBY on fields', detail: 'You can atomically increment a numeric field, perfect for per-object counters like a login count kept beside a user record.' },
                { term: 'Memory efficient when small', detail: 'Small hashes are stored in a compact encoding, using far less memory than one string key per field.' },
                { term: 'HGETALL caution', detail: 'Reading every field of a very large hash blocks the server for the duration, so prefer HMGET or HSCAN when a hash grows big.' },
              ],
            },
            example: "HDEL user:1001 age; HEXISTS user:1001 email",
          },
          {
            id: 'redis-hash-partial',
            code: "HMGET user:1001 name email\nHKEYS user:1001\nHVALS user:1001\nHSCAN user:1001 0 MATCH \"pref:*\"",
            note: 'HMGET fetches selected fields without loading the whole object. HKEYS and HVALS list field names or values, and HSCAN iterates a large hash incrementally instead of returning everything at once.',
            explanation: {
              heading: 'Reading Hashes Efficiently',
              intro: 'When a hash holds many fields, pulling everything back is wasteful. Redis offers targeted and incremental readers so you fetch only what you need without blocking the server.',
              points: [
                { term: 'HMGET for projections', detail: 'It returns just the fields you name, similar to selecting specific columns, avoiding the bandwidth of HGETALL.' },
                { term: 'HKEYS and HVALS', detail: 'These return only the field names or only the values, handy when you want to enumerate structure or aggregate values.' },
                { term: 'HSCAN iterates safely', detail: 'It walks a large hash in small cursor-based batches so a single command never stalls Redis with a huge reply.' },
                { term: 'Missing fields', detail: 'HMGET returns a null placeholder for any requested field that does not exist rather than raising an error.' },
              ],
            },
            example: "// HMGET avoids the cost of HGETALL on large hashes",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'redis-lists',
    title: 'Lists',
    level: 1,
    slug: 'lists',
    concepts: [],
    children: [
      {
        id: 'redis-list-ops',
        title: 'List Commands',
        level: 2,
        slug: 'list-ops',
        concepts: [
          {
            id: 'redis-lpush-rpop',
            code: "LPUSH queue:jobs \"job1\"\nRPUSH queue:jobs \"job2\"\nLRANGE queue:jobs 0 -1\nBRPOP queue:jobs 5",
            note: 'Lists are ordered collections. Push to either end with LPUSH/RPUSH and pop with LPOP/RPOP. BRPOP blocks until an item arrives, enabling simple work queues.',
            explanation: {
              heading: 'Lists: Ordered Sequences and Queues',
              intro: 'A Redis list is a linked sequence of strings kept in insertion order. Because you can push and pop from both ends, lists naturally model stacks, queues, and job pipelines.',
              points: [
                { term: 'Two-ended pushes', detail: 'LPUSH prepends and RPUSH appends, so pairing LPUSH with RPOP gives a first-in-first-out queue and LPUSH with LPOP gives a stack.' },
                { term: 'Blocking pops', detail: 'BRPOP and BLPOP wait for an element to appear instead of returning empty, letting a consumer sleep until work arrives without polling.' },
                { term: 'Fast at the ends', detail: 'Head and tail operations are constant time, but indexing into the middle with LINDEX is proportional to the offset.' },
                { term: 'Producer and consumer', detail: 'One process pushes jobs and another blocks on a pop, forming a simple reliable work queue without extra infrastructure.' },
              ],
            },
            example: "// LPUSH + BRPOP builds a producer/consumer queue",
          },
          {
            id: 'redis-list-trim',
            code: "LPUSH recent:events \"e1\"\nLTRIM recent:events 0 99\nLLEN recent:events\nLINDEX recent:events 0",
            note: 'LTRIM keeps only a range of elements, discarding the rest, which caps a list at a fixed size. Combined with LPUSH it maintains a rolling window such as the 100 most recent events.',
            explanation: {
              heading: 'Capping Lists with LTRIM',
              intro: 'Left unchecked, a list can grow forever. LTRIM lets you keep only a slice, which turns a list into a bounded buffer of the most recent items.',
              points: [
                { term: 'Keeps a range', detail: 'LTRIM key 0 99 retains the first hundred elements and discards everything else, so the list never exceeds that size.' },
                { term: 'Rolling window recipe', detail: 'Do LPUSH then LTRIM together to push a new item and immediately drop the oldest, maintaining a fixed newest-N feed.' },
                { term: 'Negative indexes', detail: 'Ranges accept negative positions counting from the end, so -1 is the last element, matching how LRANGE works.' },
                { term: 'LLEN and LINDEX', detail: 'LLEN reports the current length and LINDEX reads a single position, useful for inspecting a capped buffer.' },
              ],
            },
            example: "// LPUSH + LTRIM 0 99 keeps the newest 100 items",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'redis-sets',
    title: 'Sets',
    level: 1,
    slug: 'sets',
    concepts: [],
    children: [
      {
        id: 'redis-set-ops',
        title: 'Set Commands',
        level: 2,
        slug: 'set-ops',
        concepts: [
          {
            id: 'redis-sadd',
            code: "SADD tags:post:1 \"redis\" \"nosql\" \"cache\"\nSMEMBERS tags:post:1\nSINTER tags:post:1 tags:post:2\nSCARD tags:post:1",
            note: 'Sets store unique unordered members. SADD adds, SMEMBERS lists all. SINTER, SUNION, and SDIFF compute set algebra, useful for tags and relationship queries.',
            explanation: {
              heading: 'Sets: Unique Members and Set Algebra',
              intro: 'A set is an unordered collection where every member is distinct. Redis enforces uniqueness for you and provides the classic intersection, union, and difference operations directly on the server.',
              points: [
                { term: 'Automatic dedup', detail: 'SADD ignores members that already exist, so you never store a duplicate, which suits tags, unique visitors, and follower lists.' },
                { term: 'Set algebra server-side', detail: 'SINTER, SUNION, and SDIFF combine sets without pulling members to the client, enabling queries like shared tags or mutual friends.' },
                { term: 'SISMEMBER is fast', detail: 'Membership checks are constant time, making sets ideal for answering does this element belong questions at scale.' },
                { term: 'SMEMBERS caution', detail: 'Returning every member of a huge set can block Redis, so use SSCAN to iterate large sets incrementally.' },
              ],
            },
            example: "SISMEMBER tags:post:1 \"redis\" // 1 if present",
          },
          {
            id: 'redis-set-store',
            code: "SINTERSTORE common:tags tags:post:1 tags:post:2\nSPOP raffle:entries 3\nSRANDMEMBER raffle:entries 5",
            note: 'The *STORE variants save set-algebra results into a new key for reuse. SPOP removes and returns random members (e.g. a raffle draw), while SRANDMEMBER samples without removing.',
            explanation: {
              heading: 'Storing Results and Random Sampling',
              intro: 'Beyond basic membership, sets support persisting computed results and drawing random members. These make sets a fit for materialized queries and fair random selection.',
              points: [
                { term: 'STORE variants', detail: 'SINTERSTORE, SUNIONSTORE, and SDIFFSTORE write their result into a destination key so you can cache an expensive combination and reuse it.' },
                { term: 'SPOP is destructive', detail: 'It removes and returns random members, which is exactly what a raffle draw or a one-time work assignment needs.' },
                { term: 'SRANDMEMBER is not', detail: 'It samples random members without removing them, useful for showing a random subset while keeping the full set intact.' },
                { term: 'Count argument sign', detail: 'A positive count returns distinct members while a negative count with SRANDMEMBER may repeat members, allowing sampling with replacement.' },
              ],
            },
            example: "// SRANDMEMBER picks random items non-destructively",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'redis-sorted-sets',
    title: 'Sorted Sets',
    level: 1,
    slug: 'sorted-sets',
    concepts: [],
    children: [
      {
        id: 'redis-zset-ops',
        title: 'Sorted Set Commands',
        level: 2,
        slug: 'zset-ops',
        concepts: [
          {
            id: 'redis-zadd',
            code: "ZADD leaderboard 100 \"alice\" 85 \"bob\" 92 \"carol\"\nZREVRANGE leaderboard 0 2 WITHSCORES\nZRANK leaderboard \"bob\"\nZINCRBY leaderboard 5 \"bob\"",
            note: 'Sorted sets order members by a numeric score. ZADD sets scores, ZREVRANGE reads top-N, ZRANK returns position, and ZINCRBY adjusts a score atomically.',
            explanation: {
              heading: 'Sorted Sets: Ranked Unique Members',
              intro: 'A sorted set pairs each unique member with a numeric score and keeps members ordered by that score. This combination of uniqueness and ordering powers leaderboards, priority queues, and time-series indexes.',
              points: [
                { term: 'Score-ordered', detail: 'Members stay sorted by score automatically, so reading the top or bottom N is a fast range query rather than a sort.' },
                { term: 'ZRANK and ZREVRANGE', detail: 'ZRANK gives a member position in the ordering while ZREVRANGE reads the highest scorers first, together answering where am I and who is on top.' },
                { term: 'ZINCRBY is atomic', detail: 'It adjusts a member score and re-sorts in one step, so concurrent score updates on a leaderboard never conflict.' },
                { term: 'Efficient operations', detail: 'Adds and rank lookups scale logarithmically with the number of members, staying fast even for very large leaderboards.' },
              ],
            },
            example: "// Ideal for leaderboards, rate limiting, and priority queues",
          },
          {
            id: 'redis-zrangebyscore',
            code: "ZRANGEBYSCORE events 1609459200 1609545600\nZREMRANGEBYSCORE events -inf 1609459200\nZCOUNT events 90 100",
            note: 'Range-by-score commands select or remove members whose score falls in a window, perfect for time-bucketed data. ZREMRANGEBYSCORE prunes old entries, a common sliding-window rate-limiter step.',
            explanation: {
              heading: 'Querying by Score Range',
              intro: 'Because members are ordered by score, you can slice a sorted set by a score window. Treating scores as timestamps turns a sorted set into an efficient time-range index.',
              points: [
                { term: 'ZRANGEBYSCORE', detail: 'Selects members whose score falls between a minimum and maximum, ideal for pulling events within a time window.' },
                { term: 'ZREMRANGEBYSCORE prunes', detail: 'It deletes members below a threshold in one call, which is how sliding-window rate limiters drop timestamps older than the window.' },
                { term: 'Infinity bounds', detail: 'The special -inf and +inf bounds let you open one side of a range, for example removing everything up to a cutoff.' },
                { term: 'ZCOUNT for totals', detail: 'It counts members in a score range without returning them, useful for reporting how many events fell in a bucket.' },
              ],
            },
            example: "// Store timestamps as scores to query recent events",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'redis-pubsub',
    title: 'Pub/Sub',
    level: 1,
    slug: 'pubsub',
    concepts: [],
    children: [
      {
        id: 'redis-pubsub-ops',
        title: 'Publish and Subscribe',
        level: 2,
        slug: 'pubsub-ops',
        concepts: [
          {
            id: 'redis-pubsub-basic',
            code: "-- Subscriber\nSUBSCRIBE notifications\nPSUBSCRIBE news.*\n\n-- Publisher\nPUBLISH notifications \"Server restarting\"",
            note: 'Pub/Sub broadcasts messages to all current subscribers of a channel. PSUBSCRIBE matches channel patterns. Messages are fire-and-forget, so offline clients miss them.',
            explanation: {
              heading: 'Pub/Sub: Fire-and-Forget Messaging',
              intro: 'Publish and Subscribe decouples senders from receivers through named channels. A publisher pushes a message and every client currently subscribed receives it, with no queue or storage in between.',
              points: [
                { term: 'Pattern subscriptions', detail: 'PSUBSCRIBE listens on wildcard patterns like news.* so one subscriber can catch a whole family of channels.' },
                { term: 'No persistence', detail: 'Messages exist only in the moment; a client that is disconnected or subscribes later never sees messages it missed.' },
                { term: 'At-most-once delivery', detail: 'Each subscriber receives a message zero or one times, so Pub/Sub suits notifications rather than tasks that must not be lost.' },
                { term: 'Choose Streams for durability', detail: 'When you need replay, acknowledgment, or consumer groups, a Redis Stream is the durable alternative to Pub/Sub.' },
              ],
            },
            example: "// Use Streams instead when you need durable messaging",
          },
          {
            id: 'redis-keyspace-notifications',
            code: "CONFIG SET notify-keyspace-events KEA\nPSUBSCRIBE \"__keyevent@0__:expired\"",
            note: 'Keyspace notifications turn data changes into Pub/Sub events, so clients can react when keys are set, deleted, or expire. Enabling the expired event lets you trigger logic exactly when a TTL fires.',
            explanation: {
              heading: 'Keyspace Notifications: Reacting to Changes',
              intro: 'Keyspace notifications publish an event whenever a key is modified, deleted, or expires. Subscribing to these lets your application react to data changes instead of polling for them.',
              points: [
                { term: 'Off by default', detail: 'You must enable them with the notify-keyspace-events config because they add overhead, and the flags select which event classes fire.' },
                { term: 'Keyspace versus keyevent', detail: 'Keyspace channels are keyed by the key name and keyevent channels are keyed by the operation, so you subscribe by key or by event type.' },
                { term: 'Expired event timing', detail: 'The expired event fires when Redis actually removes the key, which can lag slightly behind the TTL since deletion is lazy plus sampled.' },
                { term: 'Delivery caveat', detail: 'Notifications ride on Pub/Sub, so they are fire-and-forget and a disconnected listener will miss events during its downtime.' },
              ],
            },
            example: "// Listen on __keyevent@0__:expired to run cleanup on expiry",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'redis-transactions',
    title: 'Transactions',
    level: 1,
    slug: 'transactions',
    concepts: [],
    children: [
      {
        id: 'redis-multi-exec',
        title: 'MULTI / EXEC',
        level: 2,
        slug: 'multi-exec',
        concepts: [
          {
            id: 'redis-transaction-basic',
            code: "WATCH balance:a\nMULTI\nDECRBY balance:a 100\nINCRBY balance:b 100\nEXEC",
            note: 'MULTI queues commands and EXEC runs them atomically as a unit. WATCH provides optimistic locking: if a watched key changes before EXEC, the transaction aborts.',
            explanation: {
              heading: 'MULTI and EXEC: Queued Atomic Execution',
              intro: 'A Redis transaction batches commands with MULTI, then runs them all in sequence at EXEC without any other client interleaving. WATCH adds optimistic concurrency control on top.',
              points: [
                { term: 'Commands are queued', detail: 'After MULTI, each command is buffered and returns QUEUED rather than executing, and they all run only when EXEC is called.' },
                { term: 'Isolated execution', detail: 'Once EXEC starts, the whole batch runs without interruption, so no other clients commands slip in between them.' },
                { term: 'WATCH for optimistic locking', detail: 'If any watched key is modified by another client before EXEC, the transaction aborts and returns null so you can retry.' },
                { term: 'DISCARD to abandon', detail: 'It clears the queued commands and exits the transaction without executing anything.' },
              ],
            },
            example: "// DISCARD cancels a queued transaction before EXEC",
          },
          {
            id: 'redis-transaction-semantics',
            code: "MULTI\nSET k1 v1\nINCR notanumber   # error surfaces at EXEC, others still run\nEXEC",
            note: 'Redis transactions have no rollback: queued commands all execute even if one fails at runtime, unlike SQL. They guarantee isolation (no interleaving) but not the all-or-nothing atomicity of a database.',
            explanation: {
              heading: 'Transaction Semantics: No Rollback',
              intro: 'Redis transactions differ sharply from SQL transactions. They isolate a batch of commands but do not undo already-run commands if a later one fails, so understanding the two failure modes matters.',
              points: [
                { term: 'Errors before EXEC', detail: 'A syntax error while queueing marks the transaction bad and EXEC refuses to run the whole batch.' },
                { term: 'Errors during EXEC', detail: 'If a command fails at runtime, such as INCR on a non-number, the other queued commands still execute and there is no rollback.' },
                { term: 'Isolation not atomicity', detail: 'You get the guarantee that nothing interleaves, but not the database promise that a partial failure reverts everything.' },
                { term: 'Validate first', detail: 'Because you cannot undo, check inputs before EXEC or move the logic into a Lua script when you need conditional behavior.' },
              ],
            },
            example: "// Validate inputs before EXEC since there is no rollback",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'redis-scripting',
    title: 'Lua Scripting',
    level: 1,
    slug: 'scripting',
    concepts: [],
    children: [
      {
        id: 'redis-eval',
        title: 'EVAL and Scripts',
        level: 2,
        slug: 'eval',
        concepts: [
          {
            id: 'redis-lua-script',
            code: "EVAL \"if redis.call('GET', KEYS[1]) == ARGV[1] then return redis.call('DEL', KEYS[1]) else return 0 end\" 1 lock:job token123",
            note: 'Lua scripts run atomically on the server, combining multiple commands without round trips. KEYS and ARGV pass parameters. SCRIPT LOAD plus EVALSHA caches scripts by hash.',
            explanation: {
              heading: 'EVAL: Atomic Server-Side Logic',
              intro: 'EVAL runs a Lua script inside Redis, letting you compose several commands with conditionals into one atomic unit. Nothing else runs while the script executes, which makes read-then-write logic safe.',
              points: [
                { term: 'Atomic and blocking', detail: 'A script runs to completion with no other command interleaving, so keep scripts short because they block the whole server.' },
                { term: 'KEYS and ARGV', detail: 'Pass key names through KEYS and data through ARGV rather than hardcoding them, which keeps scripts reusable and cluster-safe.' },
                { term: 'Fewer round trips', detail: 'Logic that would need multiple client-server exchanges collapses into a single call, cutting latency for compound operations.' },
                { term: 'Compare-and-delete', detail: 'A common use is releasing a lock only when the stored token matches, which cannot be done safely with separate GET and DEL.' },
              ],
            },
            example: "// Common for safe lock release and compare-and-delete",
          },
          {
            id: 'redis-evalsha',
            code: "SCRIPT LOAD \"return redis.call('INCRBY', KEYS[1], ARGV[1])\"\n// -> \"a1b2c3...\"\nEVALSHA a1b2c3... 1 counter 5",
            note: 'SCRIPT LOAD registers a script and returns its SHA1; EVALSHA then invokes it by hash, avoiding resending the source each call. Clients typically cache the SHA and fall back to EVAL on a NOSCRIPT error.',
            explanation: {
              heading: 'EVALSHA: Caching Scripts by Hash',
              intro: 'Sending a full Lua script on every call wastes bandwidth. SCRIPT LOAD stores the script once and hands back its SHA1, which EVALSHA then uses to run the cached copy.',
              points: [
                { term: 'Load once, run by hash', detail: 'SCRIPT LOAD compiles and caches the script server-side and returns a SHA1 that identifies it for later EVALSHA calls.' },
                { term: 'NOSCRIPT fallback', detail: 'If the server restarts or flushes its script cache, EVALSHA fails with NOSCRIPT, so clients retry with EVAL to reload it.' },
                { term: 'Bandwidth savings', detail: 'For a script run thousands of times, sending a short hash instead of the full source meaningfully reduces network traffic.' },
                { term: 'Same atomicity', detail: 'EVALSHA runs identically to EVAL, so the atomic and blocking behavior of the script is unchanged.' },
              ],
            },
            example: "// EVALSHA cuts bandwidth for frequently-run scripts",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'redis-streams',
    title: 'Streams',
    level: 1,
    slug: 'streams',
    concepts: [],
    children: [
      {
        id: 'redis-stream-ops',
        title: 'Stream Commands',
        level: 2,
        slug: 'stream-ops',
        concepts: [
          {
            id: 'redis-xadd',
            code: "XADD events * type \"login\" user \"alice\"\nXLEN events\nXRANGE events - +\nXREADGROUP GROUP workers c1 COUNT 10 STREAMS events >",
            note: 'Streams are append-only logs with unique IDs. XADD appends entries, XRANGE reads them, and consumer groups (XREADGROUP) distribute processing with acknowledgment and replay.',
            explanation: {
              heading: 'Streams: Durable Append-Only Logs',
              intro: 'A stream is an append-only log of entries, each with a unique time-ordered ID and a set of field-value pairs. Unlike Pub/Sub, entries persist, so consumers can read history and replay.',
              points: [
                { term: 'Time-ordered IDs', detail: 'XADD assigns each entry an ID of milliseconds plus a sequence number, keeping entries strictly ordered and letting you range-scan by time.' },
                { term: 'XRANGE reads history', detail: 'Because entries are stored, you can read past events with XRANGE using the special - and + bounds for start and end.' },
                { term: 'Consumer groups', detail: 'XREADGROUP splits a stream across multiple consumers so each entry is delivered to exactly one member of the group for parallel processing.' },
                { term: 'Capped growth', detail: 'Streams grow indefinitely unless you trim them, so use MAXLEN with XADD to bound memory usage.' },
              ],
            },
            example: "XACK events workers 1526569495631-0",
          },
          {
            id: 'redis-stream-groups',
            code: "XGROUP CREATE events workers 0\nXREADGROUP GROUP workers c1 COUNT 5 STREAMS events >\nXPENDING events workers\nXCLAIM events workers c2 60000 1526569495631-0",
            note: 'Consumer groups track which entries each consumer has read but not acknowledged. XPENDING inspects unacked messages and XCLAIM reassigns stuck ones to another consumer, giving at-least-once delivery.',
            explanation: {
              heading: 'Consumer Groups and Reliable Delivery',
              intro: 'Consumer groups give streams reliable, at-least-once processing. Redis records every entry delivered to a consumer as pending until that consumer explicitly acknowledges it.',
              points: [
                { term: 'Pending entries list', detail: 'Each unacknowledged entry sits in a pending list per consumer, so a crash does not silently lose the message.' },
                { term: 'XACK confirms done', detail: 'A consumer calls XACK after processing, which removes the entry from the pending list and completes delivery.' },
                { term: 'XPENDING inspects', detail: 'It reports which entries are outstanding and how long they have been idle, helping you detect stuck or dead consumers.' },
                { term: 'XCLAIM reassigns', detail: 'A healthy consumer can claim entries idle beyond a timeout, taking over work a crashed consumer never acknowledged.' },
              ],
            },
            example: "// XCLAIM lets a healthy worker take over a crashed one's messages",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'redis-bitmaps-hll',
    title: 'Bitmaps and HyperLogLog',
    level: 1,
    slug: 'bitmaps-hll',
    concepts: [],
    children: [
      {
        id: 'redis-probabilistic',
        title: 'Bit and Cardinality Structures',
        level: 2,
        slug: 'probabilistic',
        concepts: [
          {
            id: 'redis-bitmap-pf',
            code: "SETBIT active:2024-01-01 42 1\nBITCOUNT active:2024-01-01\n\nPFADD visitors:home \"user1\" \"user2\"\nPFCOUNT visitors:home",
            note: 'Bitmaps track boolean flags per offset compactly (e.g. daily active users). HyperLogLog (PFADD/PFCOUNT) estimates unique counts in ~12KB regardless of cardinality.',
            explanation: {
              heading: 'Bitmaps and HyperLogLog: Compact Analytics',
              intro: 'Both structures let you track large populations with tiny memory. Bitmaps store one bit per user offset for exact flags, while HyperLogLog estimates unique counts using a fixed small footprint.',
              points: [
                { term: 'Bitmaps are exact', detail: 'SETBIT flips the bit at an offset and BITCOUNT counts the set bits, giving an exact answer to how many users were active.' },
                { term: 'Offset as identity', detail: 'Mapping each user to a stable integer offset lets millions of daily-active flags fit in a single compact string.' },
                { term: 'HyperLogLog estimates', detail: 'PFADD and PFCOUNT approximate the number of unique items with about a 0.81 percent standard error, trading exactness for size.' },
                { term: 'Constant memory', detail: 'A HyperLogLog uses roughly 12KB no matter whether you add a thousand or a billion distinct items.' },
              ],
            },
            example: "// PFCOUNT trades exactness for tiny memory usage",
          },
          {
            id: 'redis-bitop-pfmerge',
            code: "# Combine daily active bitmaps into a weekly one\nBITOP OR active:week active:d1 active:d2 active:d3\nBITCOUNT active:week\n\n# Merge unique-visitor estimates\nPFMERGE visitors:week visitors:d1 visitors:d2",
            note: 'BITOP applies AND/OR/XOR across bitmaps, so weekly retention comes from ORing daily flags. PFMERGE unions HyperLogLogs, letting you combine per-day unique counts into a period without double-counting.',
            explanation: {
              heading: 'Combining Bitmaps and HyperLogLogs',
              intro: 'The real power of these structures shows when you combine them across time. Boolean logic on bitmaps and unions of HyperLogLogs turn per-day data into per-period analytics.',
              points: [
                { term: 'BITOP boolean logic', detail: 'It applies AND, OR, XOR, or NOT across bitmaps into a destination key, so ORing seven daily bitmaps yields weekly active users.' },
                { term: 'Intersection for retention', detail: 'BITOP AND across two days finds users active on both, a direct way to measure day-over-day retention.' },
                { term: 'PFMERGE unions estimates', detail: 'It combines several HyperLogLogs into one so per-day unique counts merge into a weekly unique count without double-counting overlaps.' },
                { term: 'Order of magnitude cheaper', detail: 'These merges compute analytics that would otherwise require storing and deduplicating every raw event.' },
              ],
            },
            example: "// BITOP AND across two days finds users active on both",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'redis-keys',
    title: 'Keys and Scanning',
    level: 1,
    slug: 'keys',
    concepts: [],
    children: [
      {
        id: 'redis-key-mgmt',
        title: 'Key Management',
        level: 2,
        slug: 'key-mgmt',
        concepts: [
          {
            id: 'redis-scan',
            code: "SCAN 0 MATCH \"session:*\" COUNT 100\nEXISTS user:1\nTYPE user:1\nDEL user:1 user:2\nRENAME old new",
            note: 'SCAN iterates keys incrementally with a cursor, avoiding the blocking KEYS command in production. EXISTS, TYPE, DEL, and RENAME manage individual keys.',
            explanation: {
              heading: 'Scanning Keys Without Blocking',
              intro: 'Enumerating keys safely is a common need, but the obvious command is dangerous at scale. SCAN provides a cursor-based alternative that never freezes the server.',
              points: [
                { term: 'KEYS blocks', detail: 'KEYS scans the entire keyspace in one shot and stalls Redis for its whole run, so it is unsafe on a large production database.' },
                { term: 'SCAN is incremental', detail: 'It returns a batch of keys plus a cursor to resume from, spreading the work across many small calls that do not block.' },
                { term: 'Weak guarantees', detail: 'SCAN promises every key present the whole time is returned at least once, but keys added or removed mid-scan may or may not appear.' },
                { term: 'COUNT and MATCH', detail: 'COUNT hints how much work per call and MATCH filters by pattern, though filtering happens after fetching so it does not speed up the scan itself.' },
              ],
            },
            example: "// Never use KEYS * on a large production database",
          },
          {
            id: 'redis-key-naming',
            code: "user:1001:profile\nuser:1001:sessions\norder:2024:{shard}:count\n// colon-delimited, namespaced, predictable",
            note: 'Redis has no tables, so a colon-delimited naming convention (object:id:field) provides structure and makes SCAN patterns effective. Consistent prefixes keep related keys groupable and discoverable.',
            explanation: {
              heading: 'Key Naming as Schema',
              intro: 'Redis is a flat key-value store with no tables or columns, so the structure lives in your key names. A disciplined naming convention is what makes a Redis dataset navigable and maintainable.',
              points: [
                { term: 'Colon namespacing', detail: 'The object:id:field convention like user:1001:profile groups related keys and reads like a path, giving informal structure to a flat store.' },
                { term: 'Enables pattern scans', detail: 'Consistent prefixes let SCAN with a MATCH pattern find all keys for one entity, such as every session for a user.' },
                { term: 'Predictable and greppable', detail: 'Stable naming means code can construct any key from its parts without a lookup table, reducing bugs.' },
                { term: 'Hash tags for cluster', detail: 'In a cluster, wrapping part of the key in braces forces related keys onto the same shard so multi-key operations work.' },
              ],
            },
            example: "// Good key naming is the substitute for a schema in Redis",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'redis-persistence',
    title: 'Persistence',
    level: 1,
    slug: 'persistence',
    concepts: [],
    children: [
      {
        id: 'redis-rdb-aof',
        title: 'RDB and AOF',
        level: 2,
        slug: 'rdb-aof',
        concepts: [
          {
            id: 'redis-persistence-config',
            code: "# RDB snapshot every 60s if >=1000 keys changed\nsave 60 1000\n\n# AOF append-only log for durability\nappendonly yes\nappendfsync everysec",
            note: 'RDB takes point-in-time snapshots (compact, faster restart). AOF logs every write for better durability. Many deployments enable both to balance speed and safety.',
            explanation: {
              heading: 'RDB and AOF: Two Durability Models',
              intro: 'Redis keeps data in memory but can persist to disk two ways. RDB writes periodic snapshots while AOF logs each write command, and each trades durability against performance differently.',
              points: [
                { term: 'RDB snapshots', detail: 'A point-in-time dump is compact and loads fast on restart, but data written since the last snapshot is lost if Redis crashes.' },
                { term: 'AOF logs writes', detail: 'Appending every write command gives finer durability, and appendfsync everysec limits worst-case loss to about one second of data.' },
                { term: 'Fork on save', detail: 'BGSAVE forks a child process so the parent keeps serving requests, using copy-on-write memory during the snapshot.' },
                { term: 'Use both', detail: 'Enabling RDB and AOF together gives fast restarts from the snapshot plus the tighter durability of the append log.' },
              ],
            },
            example: "BGSAVE // trigger a background snapshot manually",
          },
          {
            id: 'redis-aof-rewrite',
            code: "BGREWRITEAOF\n\n# auto-rewrite when AOF doubles in size\nauto-aof-rewrite-percentage 100\nauto-aof-rewrite-min-size 64mb",
            note: 'The AOF grows with every write, so Redis periodically rewrites it into a compact form representing the current dataset. BGREWRITEAOF triggers this manually; auto-rewrite settings automate it by size growth.',
            explanation: {
              heading: 'AOF Rewrite: Keeping the Log Compact',
              intro: 'Because the append-only file records every write, it would balloon over time as keys are repeatedly changed. Rewriting compacts it into the minimal set of commands that reproduce the current data.',
              points: [
                { term: 'Compaction goal', detail: 'A rewrite replaces a long history of writes to a key with the single command needed to recreate its current value.' },
                { term: 'BGREWRITEAOF is background', detail: 'It forks a child to build the new file while the main process keeps serving, then swaps the file in when done.' },
                { term: 'Auto-rewrite triggers', detail: 'The percentage and min-size settings kick off a rewrite once the file grows past a multiple of its post-rewrite size.' },
                { term: 'Bounds disk and load time', detail: 'Without rewrites the AOF grows unbounded and restart replay slows, so compaction protects both disk usage and startup speed.' },
              ],
            },
            example: "// AOF rewrite keeps the log from growing unbounded",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'redis-caching',
    title: 'Caching Patterns',
    level: 1,
    slug: 'caching',
    concepts: [],
    children: [
      {
        id: 'redis-cache-aside',
        title: 'Cache-Aside and Pipelining',
        level: 2,
        slug: 'cache-aside',
        concepts: [
          {
            id: 'redis-cache-pattern',
            code: "// Cache-aside pseudocode\nvalue = GET cache:key\nif (!value) {\n  value = db.load()\n  SET cache:key value EX 300\n}\n\n// Pipelining: batch commands in one round trip\nMULTI ... or client.pipeline()",
            note: 'Cache-aside loads from the database on a miss then populates the cache with a TTL. Pipelining sends many commands without waiting for each reply, cutting network latency dramatically.',
            explanation: {
              heading: 'Cache-Aside and Pipelining',
              intro: 'Cache-aside is the most common caching pattern, where the application manages the cache around a slower database. Pipelining is an unrelated but powerful trick for reducing round-trip latency.',
              points: [
                { term: 'Read path', detail: 'On a cache miss the app loads from the database, writes the value into Redis with a TTL, then returns it, so the next read is a hit.' },
                { term: 'App owns the cache', detail: 'Redis does not know about the database, so your code decides what to cache and when, which keeps the pattern simple and explicit.' },
                { term: 'Always set a TTL', detail: 'An expiry bounds how stale a cached value can get and lets rarely-read entries fall out of memory naturally.' },
                { term: 'Pipelining batches', detail: 'Sending many commands before reading any replies removes the per-command wait, turning N round trips into roughly one.' },
              ],
            },
            example: "// Set a TTL on cached entries to avoid stale data",
          },
          {
            id: 'redis-cache-stampede',
            code: "// Jitter the TTL to avoid synchronized expiry\nSET cache:key value EX (300 + random(0, 60))\n\n// Or guard rebuilds with a short-lived lock\nSET lock:key 1 NX EX 10",
            note: 'A cache stampede happens when a popular key expires and many requests rebuild it at once. Adding random TTL jitter spreads expirations, and a rebuild lock ensures only one client repopulates the value.',
            explanation: {
              heading: 'Preventing Cache Stampedes',
              intro: 'When a hot cached key expires, every concurrent request misses at once and hammers the database to rebuild the same value. This thundering herd can overwhelm the backend, so caches need protection.',
              points: [
                { term: 'The stampede', detail: 'A single popular key expiring can send hundreds of simultaneous requests to the database, all recomputing the identical value.' },
                { term: 'TTL jitter', detail: 'Adding a random offset to each expiry spreads out when keys die so they do not all miss at the same instant.' },
                { term: 'Rebuild lock', detail: 'A short-lived SET with NX lets only the first client rebuild the value while others briefly wait or serve a stale copy.' },
                { term: 'Early recomputation', detail: 'Refreshing a value slightly before it expires avoids ever presenting an empty cache to concurrent readers.' },
              ],
            },
            example: "// TTL jitter + a rebuild lock prevent thundering-herd reloads",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'redis-geo',
    title: 'Geospatial',
    level: 1,
    slug: 'geo',
    concepts: [],
    children: [
      {
        id: 'redis-geo-ops',
        title: 'Geo Commands',
        level: 2,
        slug: 'geo-ops',
        concepts: [
          {
            id: 'redis-geoadd',
            code: "GEOADD stores -122.34 47.62 \"seattle\" -73.99 40.73 \"nyc\"\nGEODIST stores seattle nyc km\nGEOSEARCH stores FROMLONLAT -122.3 47.6 BYRADIUS 50 km ASC",
            note: 'Geo commands store longitude/latitude points in a sorted set encoded as geohashes. GEODIST measures distance and GEOSEARCH finds members within a radius or box, powering "nearby" features.',
            explanation: {
              heading: 'Geospatial: Location-Aware Queries',
              intro: 'The geo commands let Redis answer proximity questions like which stores are near me. Under the hood they store coordinates as geohash scores in an ordinary sorted set.',
              points: [
                { term: 'Sorted set underneath', detail: 'GEOADD encodes longitude and latitude into a single geohash score, so a geo key is really a sorted set and ZREM or ZRANGE still work on it.' },
                { term: 'GEODIST measures', detail: 'It returns the distance between two stored members in the unit you request, such as meters or kilometers.' },
                { term: 'GEOSEARCH finds nearby', detail: 'It returns members within a radius or a rectangular box around a point, optionally sorted by distance for a nearest-first list.' },
                { term: 'Precision limits', detail: 'Geohash encoding introduces small rounding, so results near a boundary are approximate rather than exact to the millimeter.' },
              ],
            },
            example: "// Geo data is a sorted set, so ZREM removes a point",
          },
          {
            id: 'redis-geosearch-store',
            code: "GEOSEARCHSTORE nearby stores FROMMEMBER seattle BYRADIUS 100 km ASC COUNT 10\nZRANGE nearby 0 -1",
            note: 'GEOSEARCHSTORE saves the results of a radius search into a new sorted set for reuse or further processing. Because the underlying type is a sorted set, all ZSET commands work on the stored result.',
            explanation: {
              heading: 'Storing Geo Search Results',
              intro: 'GEOSEARCHSTORE runs the same proximity query as GEOSEARCH but writes the matches into a new key instead of returning them. This lets you cache or post-process a location result.',
              points: [
                { term: 'Persists the matches', detail: 'The result becomes a new sorted set you can reuse across requests instead of recomputing the search each time.' },
                { term: 'FROMMEMBER searches', detail: 'You can search relative to an existing stored point rather than raw coordinates, for example stores near a given store.' },
                { term: 'ZSET commands apply', detail: 'Because the output is a sorted set, ZRANGE, ZCARD, and other ZSET commands work directly on the stored results.' },
                { term: 'STOREDIST option', detail: 'You can store the distance as the score instead of the geohash, making the result ordered by how close each match is.' },
              ],
            },
            example: "// FROMMEMBER searches relative to an existing point",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'redis-rate-limiting',
    title: 'Rate Limiting',
    level: 1,
    slug: 'rate-limiting',
    concepts: [],
    children: [
      {
        id: 'redis-rate-limit-ops',
        title: 'Counters and Windows',
        level: 2,
        slug: 'rate-limit-ops',
        concepts: [
          {
            id: 'redis-fixed-window',
            code: "// Fixed-window limiter: N requests per minute\nMULTI\nINCR rate:user:1:202401011200\nEXPIRE rate:user:1:202401011200 60\nEXEC\n// reject if the INCR result exceeds the limit",
            note: 'A fixed-window limiter increments a per-window counter keyed by a truncated timestamp and sets a TTL. It is simple and cheap but allows bursts at window boundaries where two windows briefly overlap.',
            explanation: {
              heading: 'Fixed-Window Rate Limiting',
              intro: 'The simplest rate limiter counts requests per time bucket. Embedding the truncated timestamp in the key means each new window starts fresh with almost no bookkeeping.',
              points: [
                { term: 'Counter per window', detail: 'INCR bumps a key like rate:user:1:minute and rejects the request once the count passes the limit for that bucket.' },
                { term: 'TTL auto-resets', detail: 'Setting an expiry equal to the window length lets the counter vanish on its own, so no cleanup job is needed.' },
                { term: 'Cheap and simple', detail: 'It uses one counter and one TTL per user per window, making it very low cost in both memory and CPU.' },
                { term: 'Boundary burst flaw', detail: 'A client can send a full allowance at the end of one window and another at the start of the next, briefly doubling the intended rate.' },
              ],
            },
            example: "// The key embeds the minute so it resets automatically",
          },
          {
            id: 'redis-sliding-window',
            code: "// Sliding-window log with a sorted set of timestamps\nZREMRANGEBYSCORE rate:user:1 0 (now - 60000)\nZADD rate:user:1 now now\nZCARD rate:user:1   // current count in the last 60s",
            note: 'A sliding-window log stores each request timestamp as a sorted-set score, prunes entries older than the window, and counts the rest. It is more accurate than fixed windows at the cost of more memory.',
            explanation: {
              heading: 'Sliding-Window Rate Limiting',
              intro: 'A sliding-window log fixes the boundary burst problem by tracking the exact timestamp of every request. It counts only requests within the trailing window rather than a fixed bucket.',
              points: [
                { term: 'Timestamps as scores', detail: 'Each request is added to a sorted set with its timestamp as the score, giving an exact log of when requests happened.' },
                { term: 'Prune then count', detail: 'ZREMRANGEBYSCORE removes entries older than the window and ZCARD counts what remains, yielding the precise current rate.' },
                { term: 'More accurate', detail: 'Because the window truly slides with time, it never allows the doubled burst that fixed windows permit at their edges.' },
                { term: 'Higher cost', detail: 'It stores one entry per request within the window, using more memory than a single counter, so bound the window and set a TTL.' },
              ],
            },
            example: "// ZCARD after pruning gives the exact requests in the window",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'redis-locks',
    title: 'Distributed Locks',
    level: 1,
    slug: 'locks',
    concepts: [],
    children: [
      {
        id: 'redis-lock-ops',
        title: 'Acquiring and Releasing Locks',
        level: 2,
        slug: 'lock-ops',
        concepts: [
          {
            id: 'redis-lock-acquire',
            code: "// Acquire: unique token + expiry so a crash cannot deadlock\nSET lock:resource <token> NX PX 10000",
            note: 'A single SET with NX and PX atomically acquires a lock only if free and auto-expires it, preventing deadlocks if the holder crashes. The random token identifies the owner for safe release.',
            explanation: {
              heading: 'Acquiring a Distributed Lock',
              intro: 'A distributed lock coordinates access to a shared resource across processes. A single atomic SET with the right flags is the correct way to acquire one safely.',
              points: [
                { term: 'NX for mutual exclusion', detail: 'NX makes the SET succeed only when the key is absent, so exactly one client can hold the lock at a time.' },
                { term: 'PX prevents deadlock', detail: 'An expiry ensures the lock releases automatically if the holder crashes before unlocking, so the resource never stays locked forever.' },
                { term: 'Unique owner token', detail: 'Storing a random token as the value lets the owner prove it still holds the lock, which matters for safe release.' },
                { term: 'One atomic call', detail: 'Combining NX and PX in a single SET avoids the race a separate set-then-expire would open if a crash landed between the two.' },
              ],
            },
            example: "// PX ensures the lock is never held forever",
          },
          {
            id: 'redis-lock-release',
            code: "// Release only if we still own it (compare-and-delete)\nEVAL \"if redis.call('GET', KEYS[1]) == ARGV[1] then return redis.call('DEL', KEYS[1]) else return 0 end\" 1 lock:resource <token>",
            note: 'Releasing must verify ownership before deleting, or a client could delete a lock another process re-acquired after its TTL expired. A Lua script makes the check-and-delete atomic. Redlock extends this across nodes.',
            explanation: {
              heading: 'Releasing a Lock Safely',
              intro: 'Releasing a lock is trickier than it looks because a slow client might delete a lock that already expired and was retaken by someone else. Ownership must be verified atomically before deletion.',
              points: [
                { term: 'The wrong-delete risk', detail: 'If your lock expired and another client acquired it, a plain DEL would delete their lock, breaking mutual exclusion.' },
                { term: 'Compare then delete', detail: 'Release must check the stored token matches yours and only then delete, so you never remove a lock you no longer own.' },
                { term: 'Lua for atomicity', detail: 'A short Lua script does the get, compare, and delete as one atomic step, since separate GET and DEL leave a race in between.' },
                { term: 'Redlock across nodes', detail: 'For locks spanning multiple independent Redis instances, the Redlock algorithm extends this idea to tolerate node failures.' },
              ],
            },
            example: "// Never plain-DEL a lock; always compare the token first",
          },
        ],
        children: [],
      },
    ],
  },
];

export default topics;
