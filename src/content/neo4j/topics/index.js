// Neo4j Cypher topic tree.

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  {
    id: 'cypher-nodes',
    title: 'Nodes',
    level: 1,
    slug: 'nodes',
    concepts: [],
    children: [
      {
        id: 'cypher-node-syntax',
        title: 'Node Syntax and Labels',
        level: 2,
        slug: 'node-syntax',
        concepts: [
          {
            id: 'cypher-node-basic',
            code: "(alice:Person {name: 'Alice', age: 30})\n(product:Product:OnSale {sku: 'ABC'})",
            note: 'Nodes are written in parentheses with optional labels (after a colon) and a map of properties. A node may carry multiple labels to categorize it several ways.',
            explanation: {
              heading: 'Node Syntax and Multiple Labels',
              intro: 'Nodes are the core entities in a property graph, written as parentheses that optionally carry labels and properties.',
              points: [
                { term: 'Variable', detail: 'The name before the colon, like alice, binds the node so you can reference it later in the same query.' },
                { term: 'Labels', detail: 'Words after a colon, like :Person, group nodes into categories and let the planner use label-specific indexes.' },
                { term: 'Multiple labels', detail: 'A node can hold several labels such as :Product:OnSale, allowing it to belong to more than one category at once.' },
                { term: 'Property map', detail: 'The curly-brace map holds key-value properties and is optional, so a bare node like () is valid.' },
              ],
            },
            example: "() // an anonymous node matches anything",
          },
          {
            id: 'cypher-property-types',
            code: "CREATE (e:Event {\n  name: 'Launch',\n  attendees: 250,\n  price: 19.99,\n  public: true,\n  tags: ['tech', 'ai'],\n  when: datetime('2024-06-01T10:00:00Z')\n})",
            note: 'Node and relationship properties hold scalars (string, integer, float, boolean), temporal types like date and datetime, and homogeneous lists. Neo4j has no nested maps as property values.',
            explanation: {
              heading: 'Allowed Property Value Types',
              intro: 'Properties store simple values on nodes and relationships, but the set of allowed types is deliberately narrow.',
              points: [
                { term: 'Scalars', detail: 'Strings, integers, floats, and booleans are the basic property values you will use most often.' },
                { term: 'Temporal types', detail: 'Date, time, datetime, and duration are first-class values, so store timestamps as these rather than as strings.' },
                { term: 'Homogeneous lists', detail: 'A list property must contain a single primitive type, so mixing strings and numbers in one list is not allowed.' },
                { term: 'No nested maps', detail: 'You cannot store a map or an object as a property value, so nested data must be modeled as separate related nodes.' },
              ],
            },
            example: "// Lists must contain a single primitive type",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'cypher-relationships',
    title: 'Relationships',
    level: 1,
    slug: 'relationships',
    concepts: [],
    children: [
      {
        id: 'cypher-rel-syntax',
        title: 'Relationship Syntax',
        level: 2,
        slug: 'rel-syntax',
        concepts: [
          {
            id: 'cypher-rel-basic',
            code: "(a:Person)-[:KNOWS {since: 2020}]->(b:Person)\n(a)-[r:RATED]->(m:Movie)\n(a)<-[:FOLLOWS]-(b)",
            note: 'Relationships use bracketed types with an arrow showing direction. They can hold properties too. Relationships are always directed but you can traverse them either way.',
            explanation: {
              heading: 'Directed Relationships and Traversal',
              intro: 'Relationships connect two nodes with a typed, directed link that can also carry its own properties.',
              points: [
                { term: 'Type', detail: 'The word after the colon inside brackets, like KNOWS, names the relationship type and is required when creating one.' },
                { term: 'Direction', detail: 'The arrow -> or <- records a stored direction, so every relationship always has a defined start and end node.' },
                { term: 'Properties', detail: 'Relationships hold properties in a map, such as {since: 2020}, letting you attach data to the connection itself.' },
                { term: 'Undirected match', detail: 'Omitting the arrow head, as in (a)-[:KNOWS]-(b), matches the relationship in either direction without changing how it is stored.' },
              ],
            },
            example: "(a)-[:KNOWS]-(b) // undirected match traverses both ways",
          },
          {
            id: 'cypher-rel-multiple-types',
            code: "MATCH (a:Person)-[r:KNOWS|FOLLOWS|BLOCKS]->(b:Person)\nRETURN type(r) AS relationship, b.name",
            note: 'A pattern can match several relationship types by separating them with |. The type() function returns the concrete type of a matched relationship, useful when a pattern spans multiple kinds.',
            explanation: {
              heading: 'Matching Multiple Relationship Types',
              intro: 'A single pattern can span several relationship types, letting one query cover related but distinct connections.',
              points: [
                { term: 'Pipe alternation', detail: 'Separate types with a vertical bar, as in KNOWS|FOLLOWS|BLOCKS, to match any relationship of those types.' },
                { term: 'type() function', detail: 'Calling type(r) on a matched relationship returns its concrete type as a string, revealing which alternative matched.' },
                { term: 'Single traversal', detail: 'Alternation matches in one traversal rather than requiring a separate query per type, keeping the pattern compact.' },
                { term: 'Bind the relationship', detail: 'You must give the relationship a variable like r to inspect it later with functions such as type().' },
              ],
            },
            example: "// type(r) reveals which of the alternatives matched",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'cypher-create',
    title: 'CREATE',
    level: 1,
    slug: 'create',
    concepts: [],
    children: [
      {
        id: 'cypher-create-ops',
        title: 'Creating Data',
        level: 2,
        slug: 'create-ops',
        concepts: [
          {
            id: 'cypher-create-basic',
            code: "CREATE (alice:Person {name: 'Alice'})\nCREATE (bob:Person {name: 'Bob'})\nCREATE (alice)-[:KNOWS {since: 2020}]->(bob);",
            note: 'CREATE always inserts new nodes and relationships. Referencing an existing variable connects new relationships to already-matched nodes.',
            explanation: {
              heading: 'Inserting New Graph Data',
              intro: 'CREATE unconditionally adds nodes and relationships to the graph, making it the direct way to build new structure.',
              points: [
                { term: 'Always inserts', detail: 'CREATE never checks for existing data, so running it twice produces duplicate nodes and relationships.' },
                { term: 'Reusing variables', detail: 'A variable bound earlier, like alice, lets a later CREATE attach a new relationship to that same node.' },
                { term: 'Combining with MATCH', detail: 'Precede CREATE with MATCH to connect brand-new relationships between nodes that already exist in the graph.' },
                { term: 'Prefer MERGE for dedup', detail: 'When you need to avoid duplicates, use MERGE instead, since CREATE has no matching behavior.' },
              ],
            },
            example: "// CREATE never matches existing data; it always adds",
          },
          {
            id: 'cypher-create-from-params',
            code: "UNWIND $people AS person\nCREATE (p:Person)\nSET p = person;\n// params: { people: [{name:'A', age:30}, {name:'B', age:25}] }",
            note: 'Bulk-create by UNWINDing a parameter list of maps into rows, then creating a node per row. SET p = map copies all map keys as properties, an efficient pattern for importing batches of data.',
            explanation: {
              heading: 'Batch Insert from Parameters',
              intro: 'Passing a list of maps as a parameter and unwinding it lets you create many nodes in a single efficient query.',
              points: [
                { term: 'UNWIND', detail: 'UNWIND turns a list parameter into one row per element, so each map becomes an individual node to create.' },
                { term: 'SET p = map', detail: 'Assigning a map with SET p = person copies every key of the map onto the node as a property in one step.' },
                { term: 'Parameters', detail: 'Sending data as $people keeps the query text constant, letting the planner cache and reuse the execution plan.' },
                { term: 'Import performance', detail: 'One parameterized query with UNWIND is far faster than building and sending thousands of individual CREATE statements.' },
              ],
            },
            example: "// Parameterized batch inserts avoid building huge query strings",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'cypher-match',
    title: 'MATCH',
    level: 1,
    slug: 'match',
    concepts: [],
    children: [
      {
        id: 'cypher-match-ops',
        title: 'Pattern Matching',
        level: 2,
        slug: 'match-ops',
        concepts: [
          {
            id: 'cypher-match-basic',
            code: "MATCH (p:Person)-[:KNOWS]->(friend:Person)\nWHERE p.name = 'Alice'\nRETURN friend.name, friend.age;",
            note: 'MATCH finds subgraphs matching a pattern. It is the primary read clause. Specify labels and relationship types to narrow the traversal and improve performance.',
            explanation: {
              heading: 'Finding Subgraphs with MATCH',
              intro: 'MATCH is the main read clause, describing a pattern of nodes and relationships that Cypher searches the graph for.',
              points: [
                { term: 'Pattern matching', detail: 'MATCH returns every subgraph that fits the described shape, binding its variables to each combination found.' },
                { term: 'Labels narrow scope', detail: 'Adding a label like :Person limits the search to those nodes and lets the planner use an index for a faster start.' },
                { term: 'Relationship types', detail: 'Naming a type such as :KNOWS restricts traversal to those edges, avoiding scanning unrelated connections.' },
                { term: 'Anchor the pattern', detail: 'A WHERE clause or a property in the pattern gives the planner a concrete starting point instead of a full scan.' },
              ],
            },
            example: "OPTIONAL MATCH (p)-[:OWNS]->(pet) // null if no match",
          },
          {
            id: 'cypher-optional-match',
            code: "MATCH (p:Person {name: 'Alice'})\nOPTIONAL MATCH (p)-[:OWNS]->(pet:Pet)\nRETURN p.name, pet.name AS petName;",
            note: 'OPTIONAL MATCH behaves like a SQL LEFT JOIN: if the pattern does not match, its variables bind to null rather than dropping the row. Use it to include entities that may lack related data.',
            explanation: {
              heading: 'OPTIONAL MATCH and Missing Data',
              intro: 'OPTIONAL MATCH keeps rows even when the pattern has no match, filling the unmatched variables with null.',
              points: [
                { term: 'Like a LEFT JOIN', detail: 'It preserves the incoming rows and only adds related data when it exists, mirroring a SQL left outer join.' },
                { term: 'Binds to null', detail: 'When the optional pattern fails to match, its variables become null instead of removing the row from results.' },
                { term: 'Order matters', detail: 'Place OPTIONAL MATCH after the required MATCH so the mandatory rows are established before the optional extension.' },
                { term: 'Filtering caution', detail: 'A WHERE on an optional variable should sit inside the OPTIONAL MATCH scope, or it may discard the null rows you wanted to keep.' },
              ],
            },
            example: "// Without OPTIONAL, Alice would vanish if she owns no pet",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'cypher-where',
    title: 'WHERE',
    level: 1,
    slug: 'where',
    concepts: [],
    children: [
      {
        id: 'cypher-where-ops',
        title: 'Filtering',
        level: 2,
        slug: 'where-ops',
        concepts: [
          {
            id: 'cypher-where-basic',
            code: "MATCH (p:Person)\nWHERE p.age > 21 AND p.name STARTS WITH 'A'\n  AND EXISTS { (p)-[:OWNS]->(:Car) }\nRETURN p;",
            note: 'WHERE filters matched patterns with comparisons, boolean logic, string predicates (STARTS WITH, CONTAINS), and pattern existence checks. It refines what MATCH returns.',
            explanation: {
              heading: 'Filtering Matches with WHERE',
              intro: 'WHERE constrains the rows a MATCH produces, keeping only those that satisfy its boolean conditions.',
              points: [
                { term: 'Comparisons and logic', detail: 'Combine operators like > and = with AND, OR, and NOT to express compound filtering conditions.' },
                { term: 'String predicates', detail: 'STARTS WITH, ENDS WITH, and CONTAINS filter text, and can use an index for prefix searches with STARTS WITH.' },
                { term: 'Pattern predicates', detail: 'An EXISTS { pattern } test keeps only nodes that participate in a given relationship pattern.' },
                { term: 'IN lists', detail: 'The IN operator checks membership against a list, as in p.role IN [admin, editor], for concise multi-value filters.' },
              ],
            },
            example: "WHERE p.role IN ['admin', 'editor']",
          },
          {
            id: 'cypher-where-not-exists',
            code: "MATCH (p:Person)\nWHERE NOT EXISTS { (p)-[:KNOWS]->(:Person) }\nRETURN p.name AS loner;",
            note: 'A NOT EXISTS pattern predicate finds nodes lacking a relationship, expressing anti-joins concisely. Existence subqueries can contain their own WHERE clause to test more specific structural conditions.',
            explanation: {
              heading: 'Anti-Joins with NOT EXISTS',
              intro: 'Negating an existence check finds nodes that are missing a particular relationship or structure.',
              points: [
                { term: 'NOT EXISTS pattern', detail: 'Wrapping a pattern in NOT EXISTS { ... } keeps only nodes for which that pattern has no match at all.' },
                { term: 'Anti-join', detail: 'This expresses the graph equivalent of a SQL anti-join, selecting rows with no related counterpart.' },
                { term: 'Inner WHERE', detail: 'The existence subquery can hold its own WHERE clause to test more specific structural or property conditions.' },
                { term: 'Finding orphans', detail: 'It is the natural way to locate disconnected or orphan nodes that lack an expected relationship.' },
              ],
            },
            example: "// Great for finding orphan or disconnected nodes",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'cypher-return',
    title: 'RETURN',
    level: 1,
    slug: 'return',
    concepts: [],
    children: [
      {
        id: 'cypher-return-ops',
        title: 'Projecting Results',
        level: 2,
        slug: 'return-ops',
        concepts: [
          {
            id: 'cypher-return-basic',
            code: "MATCH (p:Person)\nRETURN p.name AS name, p.age AS age\nORDER BY age DESC\nLIMIT 10;",
            note: 'RETURN projects the output columns. AS renames them. Combine with ORDER BY, SKIP, and LIMIT to sort and paginate. DISTINCT removes duplicate rows.',
            explanation: {
              heading: 'Projecting Output with RETURN',
              intro: 'RETURN defines the columns a query produces, selecting properties, nodes, relationships, or computed values.',
              points: [
                { term: 'Column aliasing', detail: 'The AS keyword renames an output column, as in p.name AS name, giving results readable, stable headers.' },
                { term: 'DISTINCT', detail: 'Prefixing with DISTINCT removes duplicate result rows, useful when a traversal yields the same value repeatedly.' },
                { term: 'Sorting and paging', detail: 'ORDER BY, SKIP, and LIMIT attach to RETURN to sort and paginate the projected results.' },
                { term: 'Returning entities', detail: 'You can return whole nodes or relationships, not just properties, to hand full objects back to the client.' },
              ],
            },
            example: "RETURN DISTINCT p.city;",
          },
          {
            id: 'cypher-return-expressions',
            code: "MATCH (p:Person)-[:POSTED]->(post)\nRETURN p.name,\n  count(post) AS posts,\n  p.age > 30 AS senior,\n  coalesce(p.nickname, p.name) AS displayName;",
            note: 'RETURN can compute expressions, not just properties: arithmetic, boolean predicates, function calls, and coalesce for fallbacks. This shapes output without a separate transformation step.',
            explanation: {
              heading: 'Computed Expressions in RETURN',
              intro: 'RETURN can evaluate expressions on the fly, letting the query shape and derive output values directly.',
              points: [
                { term: 'Arithmetic and predicates', detail: 'Expressions like p.age > 30 or price * quantity compute booleans and numbers as returned columns.' },
                { term: 'Function calls', detail: 'Scalar and aggregate functions such as count() and toUpper() can appear directly in the projection.' },
                { term: 'coalesce fallback', detail: 'coalesce(a, b) returns the first non-null argument, providing a default when a property may be missing.' },
                { term: 'No extra step', detail: 'Computing in RETURN avoids a separate transformation clause, keeping simple shaping inside one query.' },
              ],
            },
            example: "// coalesce returns the first non-null argument",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'cypher-merge',
    title: 'MERGE',
    level: 1,
    slug: 'merge',
    concepts: [],
    children: [
      {
        id: 'cypher-merge-ops',
        title: 'Upserting with MERGE',
        level: 2,
        slug: 'merge-ops',
        concepts: [
          {
            id: 'cypher-merge-basic',
            code: "MERGE (p:Person {email: 'a@x.com'})\nON CREATE SET p.created = timestamp()\nON MATCH SET p.lastSeen = timestamp();",
            note: 'MERGE matches an existing pattern or creates it if absent, avoiding duplicates. ON CREATE and ON MATCH set properties conditionally. Back it with a uniqueness constraint.',
            explanation: {
              heading: 'Upserting with MERGE',
              intro: 'MERGE is get-or-create: it matches an existing pattern when present and otherwise creates it, preventing duplicates.',
              points: [
                { term: 'Match or create', detail: 'MERGE first tries to match the exact pattern, and only creates it when no matching data already exists.' },
                { term: 'ON CREATE', detail: 'An ON CREATE SET clause runs only when the pattern was newly created, ideal for setting a created timestamp.' },
                { term: 'ON MATCH', detail: 'An ON MATCH SET clause runs only when an existing pattern was found, useful for updating a last-seen value.' },
                { term: 'Back with a constraint', detail: 'A uniqueness constraint on the merge property both prevents duplicates and gives MERGE an index for speed.' },
              ],
            },
            example: "// MERGE the whole pattern to avoid partial duplicates",
          },
          {
            id: 'cypher-merge-relationship',
            code: "MATCH (a:Person {email: 'a@x.com'})\nMATCH (b:Person {email: 'b@x.com'})\nMERGE (a)-[r:KNOWS]->(b)\nON CREATE SET r.since = date();",
            note: 'MERGE nodes separately first, then MERGE the relationship between the matched variables. Merging the whole path at once can accidentally create duplicate nodes if either endpoint does not yet exist.',
            explanation: {
              heading: 'Merging Relationships Safely',
              intro: 'When upserting a relationship, resolve the endpoint nodes first so MERGE does not accidentally duplicate them.',
              points: [
                { term: 'Match endpoints first', detail: 'Use MATCH or a separate MERGE for each node so both endpoints are bound before the relationship is merged.' },
                { term: 'Merge only the edge', detail: 'MERGE (a)-[:KNOWS]->(b) between bound variables creates just the relationship when it is missing.' },
                { term: 'Whole-path risk', detail: 'Merging an entire path at once forces the full pattern to match, so a missing endpoint causes new duplicate nodes.' },
                { term: 'Direction is part of match', detail: 'MERGE respects the arrow direction, so a differently directed relationship is treated as not matching.' },
              ],
            },
            example: "// Match endpoints, then merge only the relationship",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'cypher-set-delete',
    title: 'SET and DELETE',
    level: 1,
    slug: 'set-delete',
    concepts: [],
    children: [
      {
        id: 'cypher-mutate-ops',
        title: 'Updating and Removing',
        level: 2,
        slug: 'mutate-ops',
        concepts: [
          {
            id: 'cypher-set-delete-basic',
            code: "MATCH (p:Person {name: 'Alice'})\nSET p.age = 31, p:Verified\nREMOVE p.tempFlag;\n\nMATCH (p:Person {name: 'Old'})\nDETACH DELETE p;",
            note: 'SET updates properties or adds labels; REMOVE strips them. DELETE removes nodes and relationships, but a node with relationships needs DETACH DELETE to remove them together.',
            explanation: {
              heading: 'Updating and Removing Graph Data',
              intro: 'SET, REMOVE, and DELETE are the write clauses that change properties, labels, and the structure of the graph.',
              points: [
                { term: 'SET', detail: 'SET updates or adds a property, and can also attach a label with syntax like p:Verified.' },
                { term: 'REMOVE', detail: 'REMOVE strips a property or a label from a node, the inverse of the two SET behaviors.' },
                { term: 'DELETE', detail: 'DELETE removes nodes and relationships, but deleting a node that still has relationships raises an error.' },
                { term: 'DETACH DELETE', detail: 'DETACH DELETE removes a node together with all its relationships in one step, avoiding that error.' },
              ],
            },
            example: "// DETACH DELETE avoids errors on connected nodes",
          },
          {
            id: 'cypher-set-map',
            code: "MATCH (p:Person {id: $id})\nSET p += $updates;\n// += merges the map, keeping other properties\n\nMATCH (p:Person {id: $id})\nSET p = $replacement;\n// = replaces ALL properties",
            note: 'SET n += map merges keys, updating or adding properties while leaving others intact, whereas SET n = map replaces the entire property set. The += form is the safe choice for partial updates.',
            explanation: {
              heading: 'Map Assignment: Merge vs Replace',
              intro: 'Assigning a whole map to a node has two forms that differ in whether they keep or discard existing properties.',
              points: [
                { term: 'SET n += map', detail: 'The += form merges the map, updating listed keys and adding new ones while leaving other properties untouched.' },
                { term: 'SET n = map', detail: 'The = form replaces the entire property set, so any property not in the map is removed from the node.' },
                { term: 'Patch semantics', detail: 'Use += when applying a partial update from $updates so unmentioned fields are preserved.' },
                { term: 'Full replacement', detail: 'Use = only when you truly intend to overwrite every property, such as loading a complete new record.' },
              ],
            },
            example: "// Use += for patch semantics, = for full replacement",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'cypher-aggregation',
    title: 'Aggregation',
    level: 1,
    slug: 'aggregation',
    concepts: [],
    children: [
      {
        id: 'cypher-agg-ops',
        title: 'Aggregation Functions',
        level: 2,
        slug: 'agg-ops',
        concepts: [
          {
            id: 'cypher-agg-basic',
            code: "MATCH (p:Person)-[:WORKS_AT]->(c:Company)\nRETURN c.name AS company,\n  count(p) AS employees,\n  collect(p.name) AS names\nORDER BY employees DESC;",
            note: 'Aggregations include count, sum, avg, min, max, and collect (gathers values into a list). Any non-aggregated column in RETURN automatically becomes a grouping key.',
            explanation: {
              heading: 'Aggregation and Implicit Grouping',
              intro: 'Aggregate functions summarize many rows into one value, and Cypher groups the rows automatically.',
              points: [
                { term: 'Common aggregates', detail: 'count, sum, avg, min, and max reduce a set of values into a single number per group.' },
                { term: 'collect', detail: 'collect gathers values from many rows into a single list, turning grouped rows into an array.' },
                { term: 'Implicit grouping', detail: 'Any non-aggregated column in the same RETURN becomes a grouping key, with no explicit GROUP BY needed.' },
                { term: 'count(*) vs count(x)', detail: 'count(*) tallies rows while count(x) skips rows where x is null, so the choice affects the total.' },
              ],
            },
            example: "RETURN avg(r.rating) AS score",
          },
          {
            id: 'cypher-agg-distinct',
            code: "MATCH (p:Person)-[:VISITED]->(city:City)\nRETURN p.name,\n  count(DISTINCT city) AS uniqueCities,\n  collect(DISTINCT city.name) AS cities;",
            note: 'DISTINCT inside an aggregate counts or collects only unique values, so a person visiting the same city twice counts once. Combine collect(DISTINCT ...) to build deduplicated lists per group.',
            explanation: {
              heading: 'DISTINCT Inside Aggregates',
              intro: 'Placing DISTINCT within an aggregate deduplicates values before they are counted or collected.',
              points: [
                { term: 'count(DISTINCT x)', detail: 'This counts only unique values of x, so repeated visits to the same city are tallied once.' },
                { term: 'collect(DISTINCT x)', detail: 'This builds a list with duplicates removed, producing a deduplicated array per group.' },
                { term: 'Scope of DISTINCT', detail: 'The DISTINCT applies within each group, not across the whole result set, matching the implicit grouping.' },
                { term: 'SQL parallel', detail: 'count(DISTINCT x) is the graph equivalent of SQL COUNT(DISTINCT x), a familiar deduplicating count.' },
              ],
            },
            example: "// count(DISTINCT x) is the graph equivalent of SQL COUNT(DISTINCT)",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'cypher-paths',
    title: 'Path Queries',
    level: 1,
    slug: 'paths',
    concepts: [],
    children: [
      {
        id: 'cypher-var-length',
        title: 'Variable-Length Paths',
        level: 2,
        slug: 'var-length',
        concepts: [
          {
            id: 'cypher-var-length-basic',
            code: "MATCH (a:Person {name: 'Alice'})-[:KNOWS*1..3]->(reachable)\nRETURN DISTINCT reachable.name;",
            note: 'A relationship pattern with *min..max traverses a range of hops. This finds friends-of-friends and deeper connections. Bound the depth to keep queries fast.',
            explanation: {
              heading: 'Variable-Length Path Traversal',
              intro: 'Adding a star and a range to a relationship lets one pattern span a variable number of hops through the graph.',
              points: [
                { term: 'Range syntax', detail: 'The form *min..max, such as *1..3, matches paths of between one and three relationships of that type.' },
                { term: 'Deep connections', detail: 'This is how you reach friends-of-friends and further, following chains of the same relationship type.' },
                { term: 'Bound the depth', detail: 'Always cap the maximum hops, because an unbounded *  can explore huge portions of the graph and run slowly.' },
                { term: 'Use DISTINCT', detail: 'The same node may be reachable by several paths, so DISTINCT on the result removes repeated endpoints.' },
              ],
            },
            example: "[:KNOWS*] // any depth (use with care)",
          },
          {
            id: 'cypher-var-length-collect',
            code: "MATCH (a:Person {name:'Alice'})-[:KNOWS*2]->(fof)\nWHERE NOT (a)-[:KNOWS]->(fof) AND a <> fof\nRETURN DISTINCT fof.name AS suggestion;",
            note: 'A fixed hop count like *2 finds exactly friends-of-friends. Excluding direct connections and the start node itself turns this into a friend-recommendation query, a classic graph use case.',
            explanation: {
              heading: 'Friend Recommendations at Fixed Depth',
              intro: 'A fixed hop count targets a specific distance, which is the basis for a classic friend-of-a-friend suggestion query.',
              points: [
                { term: 'Fixed depth', detail: 'Writing *2 matches paths of exactly two hops, reaching friends-of-friends and no one closer or farther.' },
                { term: 'Exclude direct friends', detail: 'A NOT (a)-[:KNOWS]->(fof) predicate drops people the start node already knows directly.' },
                { term: 'Exclude self', detail: 'The condition a <> fof removes the start node, which two hops can otherwise loop back to.' },
                { term: 'DISTINCT suggestions', detail: 'RETURN DISTINCT collapses the many two-hop paths to the same person into a single recommendation.' },
              ],
            },
            example: "// Filter out existing friends to recommend only new people",
          },
        ],
        children: [],
      },
      {
        id: 'cypher-shortest-path',
        title: 'Shortest Path',
        level: 2,
        slug: 'shortest-path',
        concepts: [
          {
            id: 'cypher-shortest-basic',
            code: "MATCH path = shortestPath(\n  (a:Person {name: 'Alice'})-[:KNOWS*]-(b:Person {name: 'Eve'})\n)\nRETURN path, length(path);",
            note: 'shortestPath finds the minimum-hop connection between two nodes; allShortestPaths returns every equal-length route. length() gives the number of relationships in the path.',
            explanation: {
              heading: 'Finding the Shortest Path',
              intro: 'The shortestPath function computes the fewest-hop route between two nodes, a common degrees-of-separation query.',
              points: [
                { term: 'shortestPath', detail: 'It returns one minimum-length path between the two endpoints, ideal for connection or reachability checks.' },
                { term: 'allShortestPaths', detail: 'This variant returns every path that ties for the minimum length, when you need all equally short routes.' },
                { term: 'length()', detail: 'length(path) reports the number of relationships in the matched path, the actual degree of separation.' },
                { term: 'Bound the search', detail: 'Combine with a max-hop bound like *..6 to keep the search efficient on large, densely connected graphs.' },
              ],
            },
            example: "// Great for degrees-of-separation queries",
          },
          {
            id: 'cypher-path-functions',
            code: "MATCH path = (a:Person {name:'Alice'})-[:KNOWS*..4]-(b:Person {name:'Eve'})\nRETURN nodes(path) AS people,\n  relationships(path) AS links,\n  length(path) AS hops;",
            note: 'nodes(path) and relationships(path) decompose a bound path variable into its ordered lists of nodes and relationships. This lets you inspect or transform every element along a matched route.',
            explanation: {
              heading: 'Decomposing a Bound Path',
              intro: 'Binding a path to a variable unlocks functions that break it into its ordered nodes and relationships.',
              points: [
                { term: 'Bind with path =', detail: 'Assigning a pattern to a variable, as in path = (a)-[...]-(b), captures the whole route for later inspection.' },
                { term: 'nodes(path)', detail: 'This returns the ordered list of nodes visited along the path, from the start node to the end node.' },
                { term: 'relationships(path)', detail: 'This returns the ordered list of relationships traversed, one fewer than the number of nodes.' },
                { term: 'length(path)', detail: 'length reports the relationship count, matching the size of the relationships list.' },
              ],
            },
            example: "// Bind a path with `path =` to use these functions",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'cypher-with',
    title: 'WITH',
    level: 1,
    slug: 'with',
    concepts: [],
    children: [
      {
        id: 'cypher-with-ops',
        title: 'Chaining with WITH',
        level: 2,
        slug: 'with-ops',
        concepts: [
          {
            id: 'cypher-with-basic',
            code: "MATCH (p:Person)-[:POSTED]->(post)\nWITH p, count(post) AS posts\nWHERE posts > 5\nRETURN p.name, posts;",
            note: 'WITH pipes results between query parts, letting you aggregate then filter (like SQL HAVING), or limit intermediate results before continuing. It is essential for multi-stage queries.',
            explanation: {
              heading: 'Chaining Query Parts with WITH',
              intro: 'WITH passes results from one query segment to the next, enabling multi-stage pipelines within a single query.',
              points: [
                { term: 'Pipe between parts', detail: 'WITH forwards chosen variables to the following clauses, connecting stages of a longer query.' },
                { term: 'Filter aggregates', detail: 'A WHERE after WITH filters on aggregated values, giving the effect of SQL HAVING.' },
                { term: 'Scope control', detail: 'Only the variables named in WITH stay in scope afterward, so anything omitted is dropped.' },
                { term: 'Aliasing required', detail: 'Expressions passed through WITH must be aliased with AS so later clauses can refer to them by name.' },
              ],
            },
            example: "// WHERE after WITH filters on aggregated values",
          },
          {
            id: 'cypher-with-limit-pipeline',
            code: "MATCH (p:Person)-[:POSTED]->(post)\nWITH p, count(post) AS posts\nORDER BY posts DESC\nLIMIT 5\nMATCH (p)-[:LIVES_IN]->(city)\nRETURN p.name, posts, city.name;",
            note: 'WITH can carry ORDER BY and LIMIT to trim intermediate results before an expensive follow-up MATCH, greatly reducing work. Only variables listed in WITH remain in scope afterward.',
            explanation: {
              heading: 'Trimming Rows Mid-Pipeline',
              intro: 'Attaching ORDER BY and LIMIT to WITH reduces intermediate rows before a costly next step, saving work.',
              points: [
                { term: 'ORDER BY on WITH', detail: 'Sorting at the WITH stage lets you rank intermediate results before selecting a subset.' },
                { term: 'LIMIT early', detail: 'Applying LIMIT before a follow-up MATCH shrinks the rows the expensive traversal must process.' },
                { term: 'Top-N then expand', detail: 'A common pattern narrows to the top few rows, then expands the pattern only for those.' },
                { term: 'Scope narrowing', detail: 'Variables not carried through WITH are discarded, keeping later stages lean.' },
              ],
            },
            example: "// Narrow to the top 5 before expanding the pattern further",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'cypher-order-limit',
    title: 'Ordering and Pagination',
    level: 1,
    slug: 'order-limit',
    concepts: [],
    children: [
      {
        id: 'cypher-order-ops',
        title: 'ORDER BY, SKIP, LIMIT',
        level: 2,
        slug: 'order-ops',
        concepts: [
          {
            id: 'cypher-order-basic',
            code: "MATCH (m:Movie)\nRETURN m.title, m.rating\nORDER BY m.rating DESC\nSKIP 20\nLIMIT 10;",
            note: 'ORDER BY sorts results (ASC by default, DESC for descending). SKIP and LIMIT paginate. Order matters: sort before limiting to get the correct top-N.',
            explanation: {
              heading: 'Sorting and Paginating Results',
              intro: 'ORDER BY, SKIP, and LIMIT together control how rows are sorted and sliced into pages.',
              points: [
                { term: 'ORDER BY direction', detail: 'Sorting is ascending by default, and appending DESC reverses it to descending for that key.' },
                { term: 'Multi-key sort', detail: 'Listing several keys, as in ORDER BY m.year, m.title, breaks ties using the later keys in order.' },
                { term: 'SKIP and LIMIT', detail: 'SKIP discards a number of leading rows and LIMIT caps how many are returned, together forming pages.' },
                { term: 'Sort before limit', detail: 'LIMIT applies after ORDER BY, so sorting first is required to get a correct top-N result.' },
              ],
            },
            example: "ORDER BY m.year, m.title // multi-key sort",
          },
          {
            id: 'cypher-order-params',
            code: "MATCH (m:Movie)\nRETURN m.title, m.rating\nORDER BY m.rating DESC\nSKIP $offset LIMIT $pageSize;\n// params: { offset: 40, pageSize: 20 }",
            note: 'Parameterizing SKIP and LIMIT keeps a paginated query cacheable in the query planner across page requests. Passing the offset and page size as parameters avoids recompiling the query for each page.',
            explanation: {
              heading: 'Parameterized Pagination',
              intro: 'Passing the page offset and size as parameters lets the query planner reuse one compiled plan across pages.',
              points: [
                { term: 'Parameters not literals', detail: 'Using $offset and $pageSize instead of inline numbers keeps the query text identical for every page.' },
                { term: 'Plan caching', detail: 'Identical query text lets Neo4j cache and reuse the execution plan rather than recompiling per request.' },
                { term: 'SKIP as offset', detail: 'SKIP $offset advances past earlier pages, while LIMIT $pageSize returns the current page size.' },
                { term: 'Deep-page caution', detail: 'Very large SKIP values still scan skipped rows, so key-set paging can be faster for deep pages.' },
              ],
            },
            example: "// Parameterized paging reuses the same execution plan",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'cypher-constraints',
    title: 'Indexes and Constraints',
    level: 1,
    slug: 'constraints',
    concepts: [],
    children: [
      {
        id: 'cypher-index-ops',
        title: 'Indexes and Uniqueness',
        level: 2,
        slug: 'index-ops',
        concepts: [
          {
            id: 'cypher-index-basic',
            code: "CREATE INDEX person_name FOR (p:Person) ON (p.name);\n\nCREATE CONSTRAINT unique_email\n  FOR (p:Person) REQUIRE p.email IS UNIQUE;",
            note: 'Indexes speed up lookups on properties. Uniqueness constraints prevent duplicate values and create a backing index. Node key constraints combine uniqueness with existence.',
            explanation: {
              heading: 'Indexes and Uniqueness Constraints',
              intro: 'Indexes accelerate property lookups, while constraints enforce data integrity and create their own backing indexes.',
              points: [
                { term: 'Property index', detail: 'CREATE INDEX on a label and property lets MATCH find nodes by that property without scanning every node.' },
                { term: 'Uniqueness constraint', detail: 'A REQUIRE ... IS UNIQUE constraint blocks duplicate values and automatically builds an index behind it.' },
                { term: 'Node key', detail: 'A node key constraint combines uniqueness with existence, requiring the property to be both present and unique.' },
                { term: 'Speeds up MERGE', detail: 'A unique constraint makes MERGE on that property both safe against duplicates and fast through the backing index.' },
              ],
            },
            example: "// A unique constraint makes MERGE on that property safe and fast",
          },
          {
            id: 'cypher-fulltext-index',
            code: "CREATE FULLTEXT INDEX bookSearch\n  FOR (b:Book) ON EACH [b.title, b.summary];\n\nCALL db.index.fulltext.queryNodes('bookSearch', 'graph algorithms')\nYIELD node, score RETURN node.title, score;",
            note: 'A full-text index (backed by Lucene) enables tokenized, scored text search across properties, unlike exact-match property indexes. Query it through the db.index.fulltext procedures to get relevance scores.',
            explanation: {
              heading: 'Full-Text Search Indexes',
              intro: 'A full-text index enables tokenized, ranked text search across properties, going beyond exact-match lookups.',
              points: [
                { term: 'Lucene backed', detail: 'Full-text indexes are powered by Lucene, so they tokenize text and support fuzzy and phrase queries.' },
                { term: 'Multiple properties', detail: 'ON EACH lets one index cover several properties, such as a book title and summary together.' },
                { term: 'Procedure access', detail: 'Query it with CALL db.index.fulltext.queryNodes rather than a plain MATCH on the property.' },
                { term: 'Relevance score', detail: 'Results yield a score column ranking matches by relevance, unlike a boolean exact-match index.' },
              ],
            },
            example: "// Full-text indexes support fuzzy and phrase queries",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'cypher-list-functions',
    title: 'List Functions',
    level: 1,
    slug: 'list-functions',
    concepts: [],
    children: [
      {
        id: 'cypher-list-ops',
        title: 'Working with Lists',
        level: 2,
        slug: 'list-ops',
        concepts: [
          {
            id: 'cypher-list-basic',
            code: "WITH [1, 2, 3, 4, 5] AS nums\nRETURN [n IN nums WHERE n % 2 = 0] AS evens,\n  [n IN nums | n * n] AS squares,\n  size(nums) AS len;",
            note: 'List comprehensions filter and transform lists inline. range() builds sequences, size() counts elements, and reduce() folds a list into a single value. UNWIND expands a list into rows.',
            explanation: {
              heading: 'List Comprehensions and Helpers',
              intro: 'Cypher lists come with inline comprehensions and helper functions for filtering, transforming, and expanding them.',
              points: [
                { term: 'Filter form', detail: 'The pattern [n IN list WHERE cond] keeps only elements that satisfy the condition.' },
                { term: 'Transform form', detail: 'The pattern [n IN list | expr] maps each element through an expression to build a new list.' },
                { term: 'size and range', detail: 'size(list) counts elements and range(start, end) builds a sequence of integers.' },
                { term: 'UNWIND', detail: 'UNWIND expands a list into one row per element, the bridge from a list back into ordinary rows.' },
              ],
            },
            example: "UNWIND [1,2,3] AS x RETURN x; // one row per element",
          },
          {
            id: 'cypher-reduce-predicates',
            code: "WITH [3, 7, 2, 9] AS nums\nRETURN reduce(total = 0, n IN nums | total + n) AS sum,\n  any(n IN nums WHERE n > 8) AS hasBig,\n  all(n IN nums WHERE n > 0) AS allPositive;",
            note: 'reduce folds a list into one value with an accumulator. The predicate functions any, all, none, and single test elements against a condition, returning a boolean, handy inside WHERE clauses.',
            explanation: {
              heading: 'Reduce and List Predicates',
              intro: 'reduce collapses a list into a single value, while predicate functions test whether elements meet a condition.',
              points: [
                { term: 'reduce accumulator', detail: 'reduce(total = 0, n IN nums | total + n) threads an accumulator through the list to fold it into one value.' },
                { term: 'any and all', detail: 'any returns true when at least one element matches, and all returns true only when every element matches.' },
                { term: 'none and single', detail: 'none is true when no element matches, and single is true when exactly one element matches.' },
                { term: 'Use in WHERE', detail: 'These predicates return a boolean, making them a natural fit inside a WHERE clause to filter on list contents.' },
              ],
            },
            example: "// any/all/none evaluate a predicate across list elements",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'cypher-procedures',
    title: 'Procedures and Subqueries',
    level: 1,
    slug: 'procedures',
    concepts: [],
    children: [
      {
        id: 'cypher-call-ops',
        title: 'CALL and APOC',
        level: 2,
        slug: 'call-ops',
        concepts: [
          {
            id: 'cypher-call-basic',
            code: "CALL db.labels() YIELD label RETURN label;\n\nCALL apoc.periodic.iterate(\n  'MATCH (p:Person) RETURN p',\n  'SET p.processed = true',\n  { batchSize: 1000 }\n);",
            note: 'CALL invokes a procedure, yielding its result columns with YIELD. Built-in db.* procedures introspect the graph, while the APOC library adds hundreds of utilities like batched updates and data import.',
            explanation: {
              heading: 'Calling Procedures and APOC',
              intro: 'CALL runs a stored procedure, exposing its output columns and giving access to built-in and library utilities.',
              points: [
                { term: 'CALL with YIELD', detail: 'CALL invokes the procedure and YIELD names which of its result columns become available in the query.' },
                { term: 'Built-in db procedures', detail: 'Procedures like db.labels() introspect the schema, listing labels, relationship types, and indexes.' },
                { term: 'APOC library', detail: 'APOC is an add-on library adding hundreds of utilities for data import, refactoring, and batch processing.' },
                { term: 'Batched writes', detail: 'apoc.periodic.iterate runs updates in batches, avoiding one enormous transaction on large datasets.' },
              ],
            },
            example: "// apoc.periodic.iterate batches large writes to avoid huge transactions",
          },
          {
            id: 'cypher-call-subquery',
            code: "MATCH (p:Person)\nCALL {\n  WITH p\n  MATCH (p)-[:POSTED]->(post)\n  RETURN count(post) AS posts\n}\nRETURN p.name, posts;",
            note: 'A CALL { ... } subquery runs a nested query per incoming row, importing variables with WITH. It scopes aggregations and enables post-per-row processing that a flat query cannot express cleanly.',
            explanation: {
              heading: 'CALL Subqueries per Row',
              intro: 'A CALL block runs a nested query for each incoming row, scoping its work to that single outer record.',
              points: [
                { term: 'Per-row execution', detail: 'The subquery executes once for every row entering the CALL, isolating its logic to that row.' },
                { term: 'Import with WITH', detail: 'An inner WITH, like WITH p, imports outer variables into the subquery scope so they can be used inside.' },
                { term: 'Scoped aggregation', detail: 'Aggregations inside the subquery apply per outer row, giving counts per record rather than one global total.' },
                { term: 'Return values out', detail: 'The subquery RETURN adds its columns back to each outer row for use in the final projection.' },
              ],
            },
            example: "// CALL subqueries isolate aggregation to each outer row",
          },
        ],
        children: [],
      },
      {
        id: 'cypher-temporal-ops',
        title: 'Temporal and Spatial',
        level: 2,
        slug: 'temporal-ops',
        concepts: [
          {
            id: 'cypher-temporal-basic',
            code: "RETURN date() AS today,\n  datetime() AS now,\n  duration.between(date('2020-01-01'), date()) AS age;\n\nMATCH (e:Event)\nWHERE e.start >= datetime('2024-01-01T00:00:00Z')\nRETURN e;",
            note: 'Cypher has first-class temporal types (date, time, datetime, duration) with constructors and arithmetic via duration.between. Store timestamps as temporal values, not strings, to enable correct comparisons.',
            explanation: {
              heading: 'First-Class Temporal Types',
              intro: 'Cypher treats dates and times as native types with their own constructors, arithmetic, and comparisons.',
              points: [
                { term: 'Temporal types', detail: 'date, time, datetime, and duration are built-in types created by functions like date() and datetime().' },
                { term: 'duration.between', detail: 'duration.between(a, b) computes the interval separating two instants, such as an age from a birth date.' },
                { term: 'Store as temporal', detail: 'Saving timestamps as datetime values rather than strings enables correct ordering and range comparisons.' },
                { term: 'Range filtering', detail: 'Comparing a temporal property against a datetime literal filters events within a time window in WHERE.' },
              ],
            },
            example: "// duration.between computes an interval between two instants",
          },
          {
            id: 'cypher-point-distance',
            code: "MATCH (store:Store)\nWITH store, point({latitude: 47.6, longitude: -122.3}) AS origin\nWHERE point.distance(store.location, origin) < 5000\nRETURN store.name;",
            note: 'The point() function builds a spatial value from coordinates, and point.distance returns the distance in meters between two points. This enables proximity searches directly in Cypher without external tooling.',
            explanation: {
              heading: 'Spatial Points and Distance',
              intro: 'Cypher supports spatial point values and distance math, so proximity searches run natively in the database.',
              points: [
                { term: 'point()', detail: 'point() builds a spatial value from coordinates, accepting latitude and longitude for geographic points.' },
                { term: 'point.distance', detail: 'point.distance(a, b) returns the distance in meters between two points, ready to use in a WHERE filter.' },
                { term: 'Proximity search', detail: 'Comparing point.distance against a radius finds nearby entities such as stores within five kilometers.' },
                { term: 'Point index', detail: 'A point index on the location property speeds up these spatial queries on large datasets.' },
              ],
            },
            example: "// Index location properties with a point index for speed",
          },
        ],
        children: [],
      },
    ],
  },
];

export default topics;
