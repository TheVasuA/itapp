// Elasticsearch topic tree.

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  {
    id: 'es-match',
    title: 'Match Query',
    level: 1,
    slug: 'match',
    concepts: [],
    children: [
      {
        id: 'es-match-ops',
        title: 'Full-Text Match',
        level: 2,
        slug: 'match-ops',
        concepts: [
          {
            id: 'es-match-basic',
            code: "GET /products/_search\n{\n  \"query\": {\n    \"match\": { \"description\": \"lightweight running shoes\" }\n  }\n}",
            note: 'match analyzes the input the same way the field was indexed, then finds documents sharing terms. It powers relevance-ranked full-text search and is the default text query.',
            explanation: {
              heading: 'How match works',
              intro: 'The match query is the workhorse of full-text search, converting user input into analyzed terms and ranking documents by relevance.',
              points: [
                { term: 'Analyzed input', detail: 'The query string passes through the same analyzer as the field, so casing, stemming, and stopwords are handled consistently.' },
                { term: 'Term matching', detail: 'Documents that share one or more of the produced terms are considered matches, not just exact string equality.' },
                { term: 'Relevance scoring', detail: 'Results are ranked by a similarity score so the most relevant documents surface first.' },
                { term: 'Operator control', detail: 'By default terms are combined with OR, but setting operator to and requires every term to be present.' },
              ],
            },
            example: "\"match\": { \"title\": { \"query\": \"red shoes\", \"operator\": \"and\" } }",
          },
          {
            id: 'es-match-phrase',
            code: "GET /articles/_search\n{\n  \"query\": {\n    \"match_phrase\": {\n      \"body\": { \"query\": \"quick brown fox\", \"slop\": 1 }\n    }\n  }\n}",
            note: 'match_phrase requires the terms to appear in order and adjacent. slop allows a number of positional moves between terms, so slop:1 still matches words a short distance apart.',
            explanation: {
              heading: 'Phrase and proximity matching',
              intro: 'The match_phrase query looks for terms occurring together in a specific order, which is ideal for exact multi-word expressions.',
              points: [
                { term: 'Order matters', detail: 'Terms must appear in the same sequence they were written, unlike the plain match query.' },
                { term: 'Adjacency', detail: 'By default the terms must sit next to each other with no words in between.' },
                { term: 'Slop tolerance', detail: 'The slop parameter permits a number of positional moves, loosening strict adjacency for near matches.' },
                { term: 'Position data', detail: 'This relies on term positions stored in the index, so it only works on analyzed text fields.' },
              ],
            },
            example: "// Use match_phrase for exact multi-word expressions",
          },
          {
            id: 'es-match-fuzzy',
            code: "GET /products/_search\n{\n  \"query\": {\n    \"match\": {\n      \"name\": { \"query\": \"runing shoes\", \"fuzziness\": \"AUTO\" }\n    }\n  }\n}",
            note: 'fuzziness allows approximate matching within an edit distance, tolerating typos and misspellings. AUTO scales the allowed edits by term length, matching short words strictly and long words loosely.',
            explanation: {
              heading: 'Fuzzy typo-tolerant search',
              intro: 'Fuzziness lets a match query find terms that are close but not identical, forgiving common spelling mistakes.',
              points: [
                { term: 'Edit distance', detail: 'Fuzziness measures the number of single-character insertions, deletions, or substitutions allowed between terms.' },
                { term: 'AUTO scaling', detail: 'The AUTO setting allows more edits for longer words and none for very short ones, balancing recall and precision.' },
                { term: 'Typo tolerance', detail: 'Searching for runing can still match running, which improves the experience for imperfect input.' },
                { term: 'Performance cost', detail: 'Fuzzy matching expands each term into many variants, so it is heavier than exact matching.' },
              ],
            },
            example: "// fuzziness: 2 permits up to two character edits",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'es-term',
    title: 'Term Query',
    level: 1,
    slug: 'term',
    concepts: [],
    children: [
      {
        id: 'es-term-ops',
        title: 'Exact Term Match',
        level: 2,
        slug: 'term-ops',
        concepts: [
          {
            id: 'es-term-basic',
            code: "GET /products/_search\n{\n  \"query\": {\n    \"term\": { \"status.keyword\": \"active\" }\n  }\n}",
            note: 'term matches an exact, un-analyzed value. Use it on keyword fields, IDs, booleans, and enums. terms matches any of several exact values, like SQL IN.',
            explanation: {
              heading: 'Exact value matching',
              intro: 'The term query looks for an exact, unanalyzed value and is the right tool for structured, non-text fields.',
              points: [
                { term: 'No analysis', detail: 'The search value is not tokenized or lowercased, so it must match the stored term byte for byte.' },
                { term: 'Right field types', detail: 'Use it on keyword fields, numbers, booleans, dates, and enums rather than analyzed text.' },
                { term: 'terms for lists', detail: 'The terms query accepts an array of values and matches any of them, similar to the SQL IN operator.' },
                { term: 'Text pitfall', detail: 'Running term against an analyzed text field often fails because the stored tokens are lowercased and split.' },
              ],
            },
            example: "\"terms\": { \"tags.keyword\": [\"sale\", \"new\"] }",
          },
          {
            id: 'es-exists-prefix',
            code: "// Documents where a field is present\n{ \"query\": { \"exists\": { \"field\": \"email\" } } }\n\n// Prefix match on a keyword field\n{ \"query\": { \"prefix\": { \"sku.keyword\": \"BOOK-\" } } }",
            note: 'exists matches documents that have any non-null value for a field, useful for filtering sparse data. prefix and wildcard match keyword patterns but can be slow, so avoid leading wildcards.',
            explanation: {
              heading: 'Presence and pattern queries',
              intro: 'The exists, prefix, and wildcard queries help you filter on field presence and partial keyword patterns.',
              points: [
                { term: 'exists check', detail: 'It matches any document that stores at least one non-null value for the named field.' },
                { term: 'Finding gaps', detail: 'Wrapping exists in a must_not clause finds documents where the field is missing or empty.' },
                { term: 'prefix matching', detail: 'The prefix query finds keyword terms that begin with a given string, such as an SKU code family.' },
                { term: 'Wildcard cost', detail: 'Leading wildcards force a scan of every term and are slow, so anchor patterns at the start when possible.' },
              ],
            },
            example: "// Combine exists in a must_not to find missing fields",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'es-bool',
    title: 'Bool Query',
    level: 1,
    slug: 'bool',
    concepts: [],
    children: [
      {
        id: 'es-bool-ops',
        title: 'Combining Clauses',
        level: 2,
        slug: 'bool-ops',
        concepts: [
          {
            id: 'es-bool-basic',
            code: "GET /products/_search\n{\n  \"query\": {\n    \"bool\": {\n      \"must\":     [{ \"match\": { \"name\": \"shoes\" } }],\n      \"filter\":   [{ \"range\": { \"price\": { \"lte\": 100 } } }],\n      \"should\":   [{ \"term\": { \"brand\": \"acme\" } }],\n      \"must_not\": [{ \"term\": { \"status\": \"discontinued\" } }]\n    }\n  }\n}",
            note: 'bool combines clauses: must (AND, scored), filter (AND, unscored and cached), should (OR, boosts score), must_not (NOT). filter is fastest for exact yes/no criteria.',
            explanation: {
              heading: 'Combining query clauses',
              intro: 'The bool query composes several sub-queries into one, giving you AND, OR, and NOT logic with fine control over scoring.',
              points: [
                { term: 'must clause', detail: 'Every must clause has to match and contributes to the relevance score, behaving like a scored AND.' },
                { term: 'filter clause', detail: 'Filters must match too but are unscored and cacheable, making them the fastest choice for yes or no criteria.' },
                { term: 'should clause', detail: 'Should clauses are optional and boost the score of documents that satisfy them, acting like an OR.' },
                { term: 'must_not clause', detail: 'These exclude documents that match and, like filters, run without affecting the score.' },
              ],
            },
            example: "// Put non-scoring criteria in filter for speed and caching",
          },
          {
            id: 'es-minimum-should-match',
            code: "\"bool\": {\n  \"should\": [\n    { \"term\": { \"tags\": \"sale\" } },\n    { \"term\": { \"tags\": \"new\" } },\n    { \"term\": { \"tags\": \"popular\" } }\n  ],\n  \"minimum_should_match\": 2\n}",
            note: 'When a bool has no must or filter, at least one should must match. minimum_should_match forces a minimum number (or percentage) of optional clauses to match, tightening OR logic into "at least N of these".',
            explanation: {
              heading: 'Tuning optional clauses',
              intro: 'The minimum_should_match setting controls how many optional should clauses a document must satisfy to be a hit.',
              points: [
                { term: 'Default behavior', detail: 'When a bool query has no must or filter, at least one should clause must match by default.' },
                { term: 'Fixed count', detail: 'Setting a number like 2 requires that many of the optional clauses to match before a document qualifies.' },
                { term: 'Percentage form', detail: 'A percentage such as 75 percent scales the requirement with the total number of should clauses.' },
                { term: 'Precision control', detail: 'Raising the minimum tightens loose OR logic and filters out weakly relevant results.' },
              ],
            },
            example: "// minimum_should_match: \"75%\" scales with clause count",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'es-range',
    title: 'Range Query',
    level: 1,
    slug: 'range',
    concepts: [],
    children: [
      {
        id: 'es-range-ops',
        title: 'Range Filtering',
        level: 2,
        slug: 'range-ops',
        concepts: [
          {
            id: 'es-range-basic',
            code: "GET /orders/_search\n{\n  \"query\": {\n    \"range\": {\n      \"created\": { \"gte\": \"now-7d/d\", \"lte\": \"now/d\" }\n    }\n  }\n}",
            note: 'range matches numeric, date, and IP fields with gt, gte, lt, lte. Date math like now-7d/d expresses relative windows, handy for time-based dashboards.',
            explanation: {
              heading: 'Querying value ranges',
              intro: 'The range query selects documents whose field falls within numeric, date, or IP bounds you specify.',
              points: [
                { term: 'Boundary operators', detail: 'Use gt and gte for lower bounds and lt and lte for upper bounds, mixing them as needed.' },
                { term: 'Supported types', detail: 'It works on numbers, dates, and IP address fields rather than analyzed text.' },
                { term: 'Date math', detail: 'Expressions such as now minus 7d over d describe relative time windows for dashboards.' },
                { term: 'Filter friendly', detail: 'Because ranges are yes or no criteria, placing them in a filter clause keeps them fast and cacheable.' },
              ],
            },
            example: "\"range\": { \"price\": { \"gte\": 10, \"lt\": 100 } }",
          },
          {
            id: 'es-date-math',
            code: "// Rounding: /d snaps to start of day\n\"gte\": \"now-1M/M\"   // start of last month\n\"lte\": \"2024-01-15||+1w\" // anchored date plus one week",
            note: 'Date math combines an anchor (now or an explicit date with ||), an offset like +1w, and rounding with /unit. Rounding to /d improves filter cache hits by reusing the same bucketed bounds.',
            explanation: {
              heading: 'Anatomy of date math',
              intro: 'Date math lets you express relative and rounded dates directly in a query without computing timestamps in your application.',
              points: [
                { term: 'Anchor point', detail: 'Every expression starts from now or an explicit date followed by the double-pipe separator.' },
                { term: 'Offsets', detail: 'Add or subtract durations like plus 1w or minus 7d to shift the anchor forward or backward.' },
                { term: 'Rounding', detail: 'A trailing slash and unit, such as over d, snaps the value to the start of that time bucket.' },
                { term: 'Cache benefit', detail: 'Rounded bounds repeat across requests, so the filter cache can reuse previous results.' },
              ],
            },
            example: "// Round range bounds so the query cache can reuse results",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'es-multi-match',
    title: 'Multi-Match Query',
    level: 1,
    slug: 'multi-match',
    concepts: [],
    children: [
      {
        id: 'es-multi-match-ops',
        title: 'Searching Multiple Fields',
        level: 2,
        slug: 'multi-match-ops',
        concepts: [
          {
            id: 'es-multi-match-basic',
            code: "GET /products/_search\n{\n  \"query\": {\n    \"multi_match\": {\n      \"query\": \"wireless headphones\",\n      \"fields\": [\"name^3\", \"description\", \"brand\"],\n      \"type\": \"best_fields\"\n    }\n  }\n}",
            note: 'multi_match runs a match across several fields at once. The ^ boosts a field weight. Types like best_fields, most_fields, and cross_fields tune how per-field scores combine.',
            explanation: {
              heading: 'Searching across fields',
              intro: 'The multi_match query fans a single search string out over several fields and merges the results into one relevance score.',
              points: [
                { term: 'Multiple fields', detail: 'One query string is matched against a list of fields such as name, description, and brand.' },
                { term: 'Field boosting', detail: 'A caret followed by a number raises a field weight, so name with caret 3 counts three times more.' },
                { term: 'Combination types', detail: 'The type parameter chooses how per-field scores merge, with options like best_fields and cross_fields.' },
                { term: 'Convenience', detail: 'It saves writing a bool query with one match clause per field while keeping scoring flexible.' },
              ],
            },
            example: "// name^3 makes title matches count three times more",
          },
          {
            id: 'es-multi-match-types',
            code: "// best_fields: highest single-field score wins (default)\n// most_fields: sum matches across analyzed variants\n// cross_fields: treat fields as one big field\n{ \"multi_match\": { \"query\": \"john smith\", \"type\": \"cross_fields\", \"fields\": [\"first\", \"last\"] } }",
            note: 'best_fields favors documents where one field matches strongly; most_fields rewards matches spread across field variants; cross_fields groups terms across fields, ideal for names split into parts.',
            explanation: {
              heading: 'Choosing a multi-match type',
              intro: 'Each multi_match type combines per-field scores differently, so picking the right one shapes your relevance.',
              points: [
                { term: 'best_fields', detail: 'It takes the highest single-field score, favoring documents where one field matches strongly, and is the default.' },
                { term: 'most_fields', detail: 'It sums scores across analyzed variants of the same content, rewarding matches spread over many fields.' },
                { term: 'cross_fields', detail: 'It treats several fields as one combined field, ideal when terms are split across parts like first and last name.' },
                { term: 'phrase variants', detail: 'The phrase and phrase_prefix types apply phrase matching per field for stricter ordering.' },
              ],
            },
            example: "// Use cross_fields when a full name spans first/last fields",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'es-mapping',
    title: 'Mapping',
    level: 1,
    slug: 'mapping',
    concepts: [],
    children: [
      {
        id: 'es-mapping-ops',
        title: 'Field Types and Mapping',
        level: 2,
        slug: 'mapping-ops',
        concepts: [
          {
            id: 'es-mapping-basic',
            code: "PUT /products\n{\n  \"mappings\": {\n    \"properties\": {\n      \"name\":  { \"type\": \"text\" },\n      \"sku\":   { \"type\": \"keyword\" },\n      \"price\": { \"type\": \"double\" },\n      \"created\": { \"type\": \"date\" }\n    }\n  }\n}",
            note: 'Mapping defines field types. text is analyzed for full-text search; keyword is stored verbatim for filtering, sorting, and aggregation. Choose types deliberately since they are hard to change.',
            explanation: {
              heading: 'Defining field types',
              intro: 'A mapping is the schema of an index, declaring how each field is stored and searched.',
              points: [
                { term: 'text type', detail: 'Text fields are analyzed into tokens for full-text search but cannot be sorted or aggregated directly.' },
                { term: 'keyword type', detail: 'Keyword fields store the raw value verbatim, which is what powers filtering, sorting, and aggregation.' },
                { term: 'Choose carefully', detail: 'Field types are difficult to change once data is indexed, so decide deliberately up front.' },
                { term: 'Reindex to change', detail: 'Altering a type usually means creating a new index and reindexing the existing documents.' },
              ],
            },
            example: "// A text field can have a .keyword sub-field for exact use",
          },
          {
            id: 'es-multi-fields',
            code: "\"name\": {\n  \"type\": \"text\",\n  \"fields\": {\n    \"keyword\": { \"type\": \"keyword\", \"ignore_above\": 256 },\n    \"suggest\": { \"type\": \"completion\" }\n  }\n}",
            note: 'Multi-fields index the same source under several types at once, so one name field supports full-text search, exact keyword sorting/aggregation, and autocomplete without duplicating the data.',
            explanation: {
              heading: 'Indexing one field many ways',
              intro: 'Multi-fields let a single source value be indexed under several analyzers or types at the same time.',
              points: [
                { term: 'One source', detail: 'You define sub-fields under a fields block, and Elasticsearch populates them all from the same input.' },
                { term: 'Search plus sort', detail: 'A text main field handles search while a keyword sub-field enables exact sorting and aggregation.' },
                { term: 'Extra behaviors', detail: 'Additional sub-fields can add autocomplete completion or alternative analyzers as needed.' },
                { term: 'No duplication', detail: 'You avoid storing the same data twice in your documents since the sub-fields are derived automatically.' },
              ],
            },
            example: "// Query name for search, name.keyword to sort or aggregate",
          },
          {
            id: 'es-dynamic-mapping',
            code: "PUT /logs\n{\n  \"mappings\": {\n    \"dynamic\": \"strict\",\n    \"properties\": { \"level\": { \"type\": \"keyword\" } }\n  }\n}",
            note: 'By default Elasticsearch guesses types for new fields (dynamic mapping). Setting dynamic to strict rejects unknown fields, and false ignores them, both preventing accidental mapping explosion.',
            explanation: {
              heading: 'Controlling dynamic mapping',
              intro: 'The dynamic setting decides what happens when a document contains a field the mapping has not seen before.',
              points: [
                { term: 'Default guessing', detail: 'By default Elasticsearch infers a type for new fields and adds them to the mapping automatically.' },
                { term: 'strict mode', detail: 'Setting dynamic to strict rejects documents that carry unknown fields, catching typos at index time.' },
                { term: 'false mode', detail: 'Setting dynamic to false keeps unknown fields in the source but does not index or map them.' },
                { term: 'Avoiding explosion', detail: 'Both non-default modes prevent an uncontrolled growth of fields that can bloat the mapping.' },
              ],
            },
            example: "// strict mapping catches typos in field names at index time",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'es-analyzers',
    title: 'Analyzers',
    level: 1,
    slug: 'analyzers',
    concepts: [],
    children: [
      {
        id: 'es-analyzer-ops',
        title: 'Text Analysis',
        level: 2,
        slug: 'analyzer-ops',
        concepts: [
          {
            id: 'es-analyzer-basic',
            code: "POST /_analyze\n{\n  \"analyzer\": \"standard\",\n  \"text\": \"The Quick Brown Foxes!\"\n}\n// tokens: [the, quick, brown, foxes]",
            note: 'Analyzers turn text into searchable tokens through a tokenizer and filters (lowercasing, stemming, stopwords). The same analyzer must run at index and query time for matches to line up.',
            explanation: {
              heading: 'How text becomes tokens',
              intro: 'An analyzer transforms raw text into the normalized tokens that Elasticsearch actually stores and searches.',
              points: [
                { term: 'Tokenizer', detail: 'The tokenizer splits text into individual terms, for example breaking on whitespace and punctuation.' },
                { term: 'Token filters', detail: 'Filters then lowercase, stem, or remove stopwords so variants of a word match each other.' },
                { term: 'Index and query symmetry', detail: 'The same analysis must run at index time and query time or the terms will not line up.' },
                { term: 'Debugging', detail: 'The analyze API shows the exact tokens produced, which helps diagnose why a search fails to match.' },
              ],
            },
            example: "// Use the _analyze API to debug how text is tokenized",
          },
          {
            id: 'es-custom-analyzer',
            code: "PUT /blog\n{\n  \"settings\": {\n    \"analysis\": {\n      \"analyzer\": {\n        \"folding\": {\n          \"tokenizer\": \"standard\",\n          \"filter\": [\"lowercase\", \"asciifolding\"]\n        }\n      }\n    }\n  }\n}",
            note: 'A custom analyzer chains a character filter, tokenizer, and token filters. asciifolding maps accented characters to plain ASCII so a search for "cafe" matches "café", improving international recall.',
            explanation: {
              heading: 'Building a custom analyzer',
              intro: 'When the built-in analyzers do not fit, you can assemble your own from character filters, a tokenizer, and token filters.',
              points: [
                { term: 'Character filters', detail: 'These run first to clean raw text, for example stripping HTML before tokenization.' },
                { term: 'Tokenizer choice', detail: 'A single tokenizer defines how the cleaned text is split into terms.' },
                { term: 'Token filters', detail: 'An ordered list of filters transforms the tokens, adding lowercasing, stemming, or folding.' },
                { term: 'asciifolding', detail: 'The asciifolding filter maps accented letters to plain ASCII so cafe matches the accented form.' },
              ],
            },
            example: "// Assign a custom analyzer to a field with \"analyzer\": \"folding\"",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'es-aggregations',
    title: 'Aggregations',
    level: 1,
    slug: 'aggregations',
    concepts: [],
    children: [
      {
        id: 'es-bucket-metric',
        title: 'Bucket and Metric Aggs',
        level: 2,
        slug: 'bucket-metric',
        concepts: [
          {
            id: 'es-terms-agg',
            code: "GET /orders/_search\n{\n  \"size\": 0,\n  \"aggs\": {\n    \"by_status\": {\n      \"terms\": { \"field\": \"status.keyword\" },\n      \"aggs\": { \"avg_amount\": { \"avg\": { \"field\": \"amount\" } } }\n    }\n  }\n}",
            note: 'Bucket aggregations group documents (terms, range, date_histogram). Metric aggregations compute values (avg, sum, min, max, cardinality). Nest them for multi-level analytics.',
            explanation: {
              heading: 'Buckets versus metrics',
              intro: 'Aggregations summarize data into groups and computed values, turning a search index into an analytics engine.',
              points: [
                { term: 'Bucket aggregations', detail: 'These group documents into buckets by criteria such as terms, ranges, or time intervals.' },
                { term: 'Metric aggregations', detail: 'These compute a value over documents, including avg, sum, min, max, and cardinality.' },
                { term: 'Nesting', detail: 'Placing a metric inside a bucket produces multi-level analytics like average amount per status.' },
                { term: 'size zero', detail: 'Setting size to 0 skips returning matching documents and returns only the aggregation output.' },
              ],
            },
            example: "// size:0 skips hits and returns only aggregation results",
          },
          {
            id: 'es-date-histogram',
            code: "\"aggs\": {\n  \"sales_over_time\": {\n    \"date_histogram\": {\n      \"field\": \"created\",\n      \"calendar_interval\": \"day\"\n    }\n  }\n}",
            note: 'date_histogram buckets documents into fixed time intervals for time-series charts. calendar_interval respects calendar boundaries like month; fixed_interval uses exact durations.',
            explanation: {
              heading: 'Bucketing over time',
              intro: 'The date_histogram aggregation groups documents into time intervals, the foundation of most time-series charts.',
              points: [
                { term: 'Time buckets', detail: 'Documents are placed into consecutive intervals based on a date field such as created.' },
                { term: 'calendar_interval', detail: 'This respects calendar boundaries, so a month bucket accounts for months of differing lengths.' },
                { term: 'fixed_interval', detail: 'This uses exact durations like 30 days, giving uniform buckets regardless of the calendar.' },
                { term: 'Nested metrics', detail: 'Adding a sum or avg inside each bucket produces series like revenue per day.' },
              ],
            },
            example: "// Combine with a nested sum agg for revenue-per-day",
          },
          {
            id: 'es-cardinality-agg',
            code: "\"aggs\": {\n  \"unique_visitors\": {\n    \"cardinality\": { \"field\": \"user_id\" }\n  }\n}",
            note: 'cardinality estimates the number of distinct values using the HyperLogLog++ algorithm, giving fast approximate counts at low memory cost. It trades a small error for scalability on high-cardinality fields.',
            explanation: {
              heading: 'Counting distinct values',
              intro: 'The cardinality aggregation estimates how many unique values a field has without scanning every document exactly.',
              points: [
                { term: 'Approximate counts', detail: 'It returns an estimate rather than an exact distinct count, trading a small error for speed.' },
                { term: 'HyperLogLog plus plus', detail: 'The underlying algorithm keeps memory use low even on fields with millions of unique values.' },
                { term: 'Scalability', detail: 'This design lets it handle high-cardinality fields like user identifiers efficiently.' },
                { term: 'precision_threshold', detail: 'Raising this value improves accuracy for smaller sets at the cost of more memory.' },
              ],
            },
            example: "// Use precision_threshold to trade accuracy for memory",
          },
        ],
        children: [],
      },
      {
        id: 'es-pipeline-aggs',
        title: 'Pipeline Aggregations',
        level: 2,
        slug: 'pipeline-aggs',
        concepts: [
          {
            id: 'es-pipeline-basic',
            code: "\"aggs\": {\n  \"per_day\": {\n    \"date_histogram\": { \"field\": \"created\", \"calendar_interval\": \"day\" },\n    \"aggs\": {\n      \"revenue\": { \"sum\": { \"field\": \"amount\" } },\n      \"cumulative\": { \"cumulative_sum\": { \"buckets_path\": \"revenue\" } }\n    }\n  }\n}",
            note: 'Pipeline aggregations run on the output of other aggregations rather than documents. cumulative_sum, derivative, and moving_avg reference a sibling metric via buckets_path to compute running totals and trends.',
            explanation: {
              heading: 'Aggregating over aggregations',
              intro: 'Pipeline aggregations take the results of other aggregations as input, letting you derive trends from existing buckets.',
              points: [
                { term: 'Second stage', detail: 'They operate on the output of sibling or parent aggregations rather than on the raw documents.' },
                { term: 'buckets_path', detail: 'This parameter names which metric feeds the pipeline, wiring one aggregation into another.' },
                { term: 'Common types', detail: 'cumulative_sum builds running totals, derivative measures change, and moving_avg smooths a series.' },
                { term: 'Trend analysis', detail: 'They are ideal for computing growth, momentum, and rolling values on top of time buckets.' },
              ],
            },
            example: "// buckets_path points at the metric feeding the pipeline",
          },
          {
            id: 'es-bucket-selector',
            code: "\"aggs\": {\n  \"by_customer\": {\n    \"terms\": { \"field\": \"customer.keyword\" },\n    \"aggs\": {\n      \"total\": { \"sum\": { \"field\": \"amount\" } },\n      \"big_spenders\": {\n        \"bucket_selector\": {\n          \"buckets_path\": { \"t\": \"total\" },\n          \"script\": \"params.t > 1000\"\n        }\n      }\n    }\n  }\n}",
            note: 'bucket_selector is a pipeline aggregation that filters buckets after computing their metrics, the aggregation equivalent of SQL HAVING. bucket_sort can then order and paginate the surviving buckets.',
            explanation: {
              heading: 'Filtering and sorting buckets',
              intro: 'The bucket_selector and bucket_sort pipelines refine grouped results after their metrics are calculated.',
              points: [
                { term: 'Post-metric filtering', detail: 'bucket_selector drops buckets that fail a condition, acting like the SQL HAVING clause.' },
                { term: 'Script condition', detail: 'A small script referencing metric values via buckets_path decides which buckets to keep.' },
                { term: 'bucket_sort', detail: 'This pipeline orders the surviving buckets and can also paginate them with from and size.' },
                { term: 'Common use', detail: 'Together they surface groups meeting a threshold, such as customers who spent over a limit.' },
              ],
            },
            example: "// Use bucket_selector to keep only groups meeting a threshold",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'es-sorting',
    title: 'Sorting',
    level: 1,
    slug: 'sorting',
    concepts: [],
    children: [
      {
        id: 'es-sort-ops',
        title: 'Sorting Results',
        level: 2,
        slug: 'sort-ops',
        concepts: [
          {
            id: 'es-sort-basic',
            code: "GET /products/_search\n{\n  \"sort\": [\n    { \"price\": \"asc\" },\n    { \"_score\": \"desc\" }\n  ],\n  \"query\": { \"match_all\": {} }\n}",
            note: 'sort orders results by one or more fields; _score sorts by relevance. Sorting on text fields requires a keyword sub-field, since analyzed text cannot be sorted directly.',
            explanation: {
              heading: 'Ordering search results',
              intro: 'The sort clause controls the order of hits, letting you rank by field values or by relevance.',
              points: [
                { term: 'Multi-field sort', detail: 'You can list several fields, and ties on the first are broken by the next in order.' },
                { term: 'Score sorting', detail: 'The special _score field sorts by relevance and is the default when no sort is given.' },
                { term: 'Text limitation', detail: 'Analyzed text cannot be sorted directly, so you sort on a keyword sub-field instead.' },
                { term: 'Direction', detail: 'Each key accepts asc or desc to set ascending or descending order independently.' },
              ],
            },
            example: "// Default sort is by _score descending",
          },
          {
            id: 'es-sort-modes',
            code: "\"sort\": [\n  { \"ratings\": { \"order\": \"desc\", \"mode\": \"avg\" } },\n  { \"_geo_distance\": { \"location\": { \"lat\": 40.7, \"lon\": -74 }, \"order\": \"asc\", \"unit\": \"km\" } }\n]",
            note: 'For multi-valued fields, mode picks how to reduce them (min, max, avg, sum, median) before sorting. _geo_distance sorts documents by proximity to a point, powering "nearest first" results.',
            explanation: {
              heading: 'Advanced sorting options',
              intro: 'Beyond simple field sorts, Elasticsearch can reduce multi-valued fields and order documents by geographic distance.',
              points: [
                { term: 'Sort mode', detail: 'For a field holding many values, mode chooses min, max, avg, sum, or median before comparing.' },
                { term: 'Geo distance', detail: 'The _geo_distance sort orders documents by how close they are to a reference point.' },
                { term: 'Nearest first', detail: 'Combined with asc order this powers common nearest first result lists.' },
                { term: 'Field requirement', detail: 'Geo sorting needs the location stored as a geo_point mapped field.' },
              ],
            },
            example: "// Geo-distance sort needs a geo_point mapped field",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'es-pagination',
    title: 'Pagination',
    level: 1,
    slug: 'pagination',
    concepts: [],
    children: [
      {
        id: 'es-pagination-ops',
        title: 'from/size and search_after',
        level: 2,
        slug: 'pagination-ops',
        concepts: [
          {
            id: 'es-pagination-basic',
            code: "// Shallow pagination\nGET /products/_search\n{ \"from\": 20, \"size\": 10, \"query\": { \"match_all\": {} } }\n\n// Deep pagination\n{ \"size\": 10, \"search_after\": [29.99, \"sku123\"], \"sort\": [\"price\", \"sku\"] }",
            note: 'from/size is simple but expensive past a few thousand results. For deep pagination use search_after with a stable sort, which pages efficiently without a large offset.',
            explanation: {
              heading: 'Paging through results',
              intro: 'Elasticsearch offers two paging styles, one simple for shallow pages and one efficient for deep ones.',
              points: [
                { term: 'from and size', detail: 'This offset-based paging is easy but grows costly past a few thousand results.' },
                { term: 'Deep page cost', detail: 'Large offsets force each shard to gather and sort many documents before discarding most.' },
                { term: 'search_after', detail: 'This pages by the sort values of the last hit, avoiding a growing offset entirely.' },
                { term: 'Stable sort', detail: 'search_after needs a deterministic sort, often including a tiebreaker field, to page reliably.' },
              ],
            },
            example: "// search_after uses the sort values of the last hit",
          },
          {
            id: 'es-pit-scroll',
            code: "// Open a point-in-time for consistent deep paging\nPOST /products/_pit?keep_alive=1m\n\n// Then reuse the pit id with search_after across requests\n{ \"pit\": { \"id\": \"46To...\", \"keep_alive\": \"1m\" }, \"sort\": [{ \"_shard_doc\": \"asc\" }] }",
            note: 'A point-in-time (PIT) freezes the index state so search_after pages over a consistent snapshot even as data changes. It replaced the older scroll API for most deep-pagination and export jobs.',
            explanation: {
              heading: 'Consistent deep paging',
              intro: 'A point-in-time preserves a snapshot of the index so long paging jobs see stable data even while writes continue.',
              points: [
                { term: 'Frozen view', detail: 'Opening a point-in-time captures the current index state and returns an identifier to reuse.' },
                { term: 'Consistency', detail: 'Paging with search_after against that identifier avoids missing or duplicated documents from concurrent changes.' },
                { term: 'keep_alive', detail: 'A keep_alive duration controls how long the snapshot is retained before it expires.' },
                { term: 'Replaces scroll', detail: 'It supersedes the older scroll API for most deep-pagination and export workloads.' },
              ],
            },
            example: "// Always pair search_after deep paging with a PIT for consistency",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'es-highlighting',
    title: 'Highlighting',
    level: 1,
    slug: 'highlighting',
    concepts: [],
    children: [
      {
        id: 'es-highlight-ops',
        title: 'Result Highlighting',
        level: 2,
        slug: 'highlight-ops',
        concepts: [
          {
            id: 'es-highlight-basic',
            code: "GET /articles/_search\n{\n  \"query\": { \"match\": { \"body\": \"elasticsearch\" } },\n  \"highlight\": {\n    \"fields\": { \"body\": {} }\n  }\n}",
            note: 'Highlighting returns snippets of matching text with the query terms wrapped in <em> tags by default. Use it to show users why a document matched their search.',
            explanation: {
              heading: 'Highlighting matched terms',
              intro: 'Highlighting extracts and marks up the portions of a field that matched the query so users see why a result appeared.',
              points: [
                { term: 'Matched snippets', detail: 'It returns fragments of the field text containing the query terms rather than the whole field.' },
                { term: 'Default tags', detail: 'Matching terms are wrapped in em tags unless you override them.' },
                { term: 'Custom tags', detail: 'The pre_tags and post_tags settings let you wrap matches in mark or any markup your UI needs.' },
                { term: 'User feedback', detail: 'Showing the matched context helps users judge relevance at a glance.' },
              ],
            },
            example: "\"pre_tags\": [\"<mark>\"], \"post_tags\": [\"</mark>\"]",
          },
          {
            id: 'es-highlight-fragments',
            code: "\"highlight\": {\n  \"fields\": {\n    \"body\": { \"fragment_size\": 150, \"number_of_fragments\": 3 }\n  }\n}",
            note: 'fragment_size controls snippet length and number_of_fragments how many snippets to return per field. Setting number_of_fragments to 0 highlights and returns the entire field instead of snippets.',
            explanation: {
              heading: 'Shaping highlight fragments',
              intro: 'Fragment settings control how large and how many highlighted snippets Elasticsearch returns per field.',
              points: [
                { term: 'fragment_size', detail: 'This sets the approximate character length of each returned snippet.' },
                { term: 'number_of_fragments', detail: 'This caps how many separate snippets are returned for a single field.' },
                { term: 'Whole field', detail: 'Setting number_of_fragments to 0 highlights and returns the entire field instead of snippets.' },
                { term: 'Layout fit', detail: 'Tuning these values keeps highlights sized to your result card design.' },
              ],
            },
            example: "// Tune fragment size to fit your search-result card layout",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'es-nested',
    title: 'Nested Queries',
    level: 1,
    slug: 'nested',
    concepts: [],
    children: [
      {
        id: 'es-nested-ops',
        title: 'Nested Objects',
        level: 2,
        slug: 'nested-ops',
        concepts: [
          {
            id: 'es-nested-basic',
            code: "GET /products/_search\n{\n  \"query\": {\n    \"nested\": {\n      \"path\": \"reviews\",\n      \"query\": {\n        \"bool\": {\n          \"must\": [\n            { \"match\": { \"reviews.author\": \"alice\" } },\n            { \"range\": { \"reviews.rating\": { \"gte\": 4 } } }\n          ]\n        }\n      }\n    }\n  }\n}",
            note: 'A nested field type keeps array-of-object relationships intact so conditions apply to the same sub-object. Without it, ES flattens arrays and matches across different objects.',
            explanation: {
              heading: 'Querying arrays of objects',
              intro: 'The nested type preserves the boundaries between objects in an array so query conditions apply to a single sub-object.',
              points: [
                { term: 'Flattening problem', detail: 'Plain object arrays are flattened, so conditions can wrongly match values from different objects.' },
                { term: 'Nested type', detail: 'Mapping the field as nested indexes each sub-object separately to keep its fields together.' },
                { term: 'nested query', detail: 'A nested query targets a path and applies its clauses within the same sub-document.' },
                { term: 'Storage cost', detail: 'Each nested object becomes a hidden document, so heavy nesting increases index size.' },
              ],
            },
            example: "// Map the field as \"type\": \"nested\" to enable this",
          },
          {
            id: 'es-nested-inner-hits',
            code: "\"nested\": {\n  \"path\": \"reviews\",\n  \"query\": { \"match\": { \"reviews.text\": \"comfortable\" } },\n  \"inner_hits\": { \"size\": 3 }\n}",
            note: 'inner_hits returns exactly which nested sub-documents matched, not just the parent. This lets you display the specific reviews or line items responsible for a hit rather than the whole document.',
            explanation: {
              heading: 'Revealing matched sub-documents',
              intro: 'The inner_hits option surfaces which specific nested objects caused a parent document to match.',
              points: [
                { term: 'Parent plus detail', detail: 'A nested query normally returns only the parent, hiding which sub-object matched.' },
                { term: 'inner_hits', detail: 'Adding inner_hits attaches the matching nested objects to each result.' },
                { term: 'Precise display', detail: 'This lets you show the exact review or line item responsible instead of the whole document.' },
                { term: 'Controls', detail: 'You can limit the number returned and sort them just like top-level hits.' },
              ],
            },
            example: "// inner_hits is essential to show why a nested doc matched",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'es-index-management',
    title: 'Index Management',
    level: 1,
    slug: 'index-management',
    concepts: [],
    children: [
      {
        id: 'es-index-ops',
        title: 'Indices and Aliases',
        level: 2,
        slug: 'index-ops',
        concepts: [
          {
            id: 'es-index-basic',
            code: "PUT /products-v1\nPOST /_aliases\n{\n  \"actions\": [\n    { \"add\": { \"index\": \"products-v1\", \"alias\": \"products\" } }\n  ]\n}\n\nGET /_cat/indices?v",
            note: 'Aliases point a stable name at a physical index, enabling zero-downtime reindexing: build a new index, then atomically swap the alias. _cat APIs give a quick operational view.',
            explanation: {
              heading: 'Stable names with aliases',
              intro: 'Aliases give applications a constant name that can point to different physical indices over time.',
              points: [
                { term: 'Indirection', detail: 'An alias is a pointer, so application code queries the alias rather than a versioned index name.' },
                { term: 'Atomic swap', detail: 'Repointing an alias happens in a single action, enabling zero-downtime reindexing.' },
                { term: 'Reindex flow', detail: 'You build a new index, verify it, then swap the alias without changing client code.' },
                { term: 'cat APIs', detail: 'The cat family gives compact, human-readable views of indices and aliases for operations.' },
              ],
            },
            example: "// Query the alias so app code never changes on reindex",
          },
          {
            id: 'es-reindex',
            code: "POST /_reindex\n{\n  \"source\": { \"index\": \"products-v1\" },\n  \"dest\":   { \"index\": \"products-v2\" }\n}",
            note: 'Reindex copies documents from one index to another, the standard way to apply a new mapping since existing field types cannot change in place. Combine it with an alias swap for zero downtime.',
            explanation: {
              heading: 'Copying to a new index',
              intro: 'The reindex API rebuilds data into a fresh index, which is how you apply mapping changes that cannot be made in place.',
              points: [
                { term: 'Document copy', detail: 'It reads documents from a source index and writes them into a destination index.' },
                { term: 'Mapping changes', detail: 'Since field types are fixed once indexed, reindexing into a new mapping is the standard fix.' },
                { term: 'Transformation', detail: 'An optional script or query can filter or reshape documents as they are copied.' },
                { term: 'Zero downtime', detail: 'Pairing reindex with an alias swap lets clients cut over without an outage.' },
              ],
            },
            example: "// Add a script or query to transform docs during reindex",
          },
        ],
        children: [],
      },
      {
        id: 'es-ilm-ops',
        title: 'Index Lifecycle Management',
        level: 2,
        slug: 'ilm-ops',
        concepts: [
          {
            id: 'es-ilm-basic',
            code: "PUT /_ilm/policy/logs\n{\n  \"policy\": {\n    \"phases\": {\n      \"hot\":    { \"actions\": { \"rollover\": { \"max_size\": \"50gb\", \"max_age\": \"7d\" } } },\n      \"delete\": { \"min_age\": \"30d\", \"actions\": { \"delete\": {} } }\n    }\n  }\n}",
            note: 'ILM automates time-series index management through hot, warm, cold, and delete phases. rollover starts a fresh index when one grows too large or old, and later phases shrink, freeze, or delete data.',
            explanation: {
              heading: 'Automating index lifecycle',
              intro: 'Index Lifecycle Management moves time-series data through phases automatically so storage stays bounded without manual work.',
              points: [
                { term: 'Phases', detail: 'A policy defines hot, warm, cold, and delete phases that data progresses through as it ages.' },
                { term: 'Rollover', detail: 'The rollover action starts a fresh index once the current one exceeds a size or age limit.' },
                { term: 'Cost tiering', detail: 'Later phases shrink, freeze, or move data to cheaper hardware to reduce storage cost.' },
                { term: 'Automatic cleanup', detail: 'The delete phase removes old indices on schedule, keeping log storage under control.' },
              ],
            },
            example: "// ILM keeps log storage bounded without manual cleanup",
          },
          {
            id: 'es-data-stream',
            code: "PUT /_index_template/logs-tpl\n{\n  \"index_patterns\": [\"logs-*\"],\n  \"data_stream\": {},\n  \"template\": { \"settings\": { \"index.lifecycle.name\": \"logs\" } }\n}\n\nPOST /logs-app/_doc\n{ \"@timestamp\": \"2024-01-01T00:00:00Z\", \"message\": \"hi\" }",
            note: 'A data stream is an append-only abstraction over a series of backing indices that ILM rolls over automatically. You write to one stream name and read across all its indices, ideal for logs and metrics.',
            explanation: {
              heading: 'Append-only data streams',
              intro: 'A data stream presents one logical name over many backing indices, tailored for continuously arriving time-series data.',
              points: [
                { term: 'Single write target', detail: 'You index into one stream name and Elasticsearch routes writes to the current backing index.' },
                { term: 'Read across all', detail: 'Searches span every backing index, so queries see the full history transparently.' },
                { term: 'Automatic rollover', detail: 'ILM creates new backing indices behind the scenes as data grows or ages.' },
                { term: 'Timestamp required', detail: 'Every document must carry an at timestamp field so it can be placed in the series.' },
              ],
            },
            example: "// Data streams require an @timestamp field on every document",
          },
        ],
        children: [],
      },
    ],
  },
];

export default topics;
