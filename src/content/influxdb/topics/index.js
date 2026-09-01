// InfluxDB topic tree.

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  {
    id: 'influx-line-protocol',
    title: 'Line Protocol',
    level: 1,
    slug: 'line-protocol',
    concepts: [],
    children: [
      {
        id: 'influx-lp-ops',
        title: 'Writing Points',
        level: 2,
        slug: 'lp-ops',
        concepts: [
          {
            id: 'influx-lp-basic',
            code: "// measurement,tag=value field=value timestamp\ncpu,host=web-01,region=us-east usage=72.5,idle=27.5 1609459200000000000\nmemory,host=web-01 used=8192i,total=16384i 1609459200000000000",
            note: 'Line protocol is the write format: measurement name, comma-separated tags (indexed metadata), a space, comma-separated fields (the values), and an optional nanosecond timestamp.',
            explanation: {
              heading: 'Anatomy of a write',
              intro: 'Line protocol is the text format InfluxDB uses to ingest points, and every element sits in a fixed order.',
              points: [
                { term: 'Measurement', detail: 'The first token names the measurement, similar to a table, and groups related points together.' },
                { term: 'Tag set', detail: 'Comma-separated key equals value pairs follow the measurement and are indexed for fast filtering.' },
                { term: 'Field set', detail: 'After a space come the field key equals value pairs that hold the actual measured data.' },
                { term: 'Timestamp', detail: 'A trailing integer gives the time in nanoseconds by default, and it is optional because the server can assign one.' },
              ],
            },
            example: "// Integer fields get an 'i' suffix; strings use quotes",
          },
          {
            id: 'influx-lp-types',
            code: "sensor,loc=lab temp=21.4,ok=true,label=\"north\" 1609459200000000000\n// float: 21.4   boolean: true\n// string: \"north\"   integer: 42i   unsigned: 42u",
            note: 'Field types are inferred from syntax: plain numbers are floats, an i suffix means integer, u means unsigned, true/false are booleans, and quoted text is a string. A field keeps its first type per series.',
            explanation: {
              heading: 'How field types are inferred',
              intro: 'InfluxDB reads the field value syntax to decide its type, and that type becomes fixed for the series.',
              points: [
                { term: 'Floats', detail: 'A bare number such as 21.4 is stored as a float, which is the default numeric type.' },
                { term: 'Integers and unsigned', detail: 'An i suffix marks a signed integer and a u suffix marks an unsigned integer.' },
                { term: 'Booleans', detail: 'The literals true and false, without quotes, are stored as boolean fields.' },
                { term: 'Strings', detail: 'Text wrapped in double quotes is stored as a string field rather than parsed as a number.' },
                { term: 'Type is sticky', detail: 'The first type written for a field sets it, so later writes with a different type are rejected.' },
              ],
            },
            example: "// Mixing float and integer for one field causes a write error",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'influx-data-model',
    title: 'Data Model',
    level: 1,
    slug: 'data-model',
    concepts: [],
    children: [
      {
        id: 'influx-model-ops',
        title: 'Measurements, Tags, Fields',
        level: 2,
        slug: 'model-ops',
        concepts: [
          {
            id: 'influx-model-basic',
            code: "// measurement: cpu\n// tags (indexed):  host, region\n// fields (values): usage, idle\n// series = measurement + unique tag set",
            note: 'Tags are indexed strings used for filtering and grouping; fields hold the actual measured values and are not indexed. A unique measurement plus tag-set combination forms a series.',
            explanation: {
              heading: 'Tags versus fields',
              intro: 'The data model splits metadata from measurements, and where you place a value affects both query speed and storage.',
              points: [
                { term: 'Tags are indexed', detail: 'Tag keys and values are always strings and are indexed, making them ideal for WHERE and GROUP BY clauses.' },
                { term: 'Fields are not indexed', detail: 'Fields store the numbers or text you measure, and filtering on a field must scan values rather than an index.' },
                { term: 'Series identity', detail: 'A series is the unique pairing of a measurement with a specific set of tag values.' },
                { term: 'Design impact', detail: 'Choosing what becomes a tag shapes how efficiently you can slice and aggregate the data later.' },
              ],
            },
            example: "// Keep tag cardinality low to protect performance",
          },
          {
            id: 'influx-cardinality',
            code: "// High cardinality (BAD): unique id per point\nrequests,request_id=8f3a2b1c...  duration=12\n\n// Lower cardinality (GOOD): bounded tag values\nrequests,endpoint=/login,status=200  duration=12",
            note: 'Series cardinality is the count of unique tag-value combinations. Putting unbounded values like UUIDs or emails in tags explodes cardinality and memory use. Store such values in fields instead.',
            explanation: {
              heading: 'Controlling series cardinality',
              intro: 'Cardinality is the number of distinct series, and it is one of the strongest drivers of InfluxDB performance and memory use.',
              points: [
                { term: 'Definition', detail: 'Cardinality counts every unique combination of measurement and tag values in the database.' },
                { term: 'Unbounded tags hurt', detail: 'Putting identifiers like UUIDs, request IDs, or emails in tags creates a near-infinite number of series.' },
                { term: 'Memory pressure', detail: 'The index that maps series must fit in memory, so runaway cardinality can exhaust RAM.' },
                { term: 'Prefer fields', detail: 'Store high-cardinality identifiers as fields, where they do not multiply the series count.' },
              ],
            },
            example: "// Use fields, not tags, for high-cardinality identifiers",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'influx-flux-basics',
    title: 'Flux Basics',
    level: 1,
    slug: 'flux-basics',
    concepts: [],
    children: [
      {
        id: 'influx-flux-from',
        title: 'from / range / filter',
        level: 2,
        slug: 'flux-from',
        concepts: [
          {
            id: 'influx-flux-basic',
            code: "from(bucket: \"metrics\")\n  |> range(start: -1h)\n  |> filter(fn: (r) => r._measurement == \"cpu\" and r.host == \"web-01\")",
            note: 'Flux is a functional pipeline language. from selects a bucket, range restricts the time window (required first), and filter keeps rows matching a predicate. |> pipes data forward.',
            explanation: {
              heading: 'The core Flux pipeline',
              intro: 'Almost every Flux query begins with the same three stages that source data and narrow it down before any transformation.',
              points: [
                { term: 'from', detail: 'Selects the bucket to read, which is the storage container that holds the time-series data.' },
                { term: 'range', detail: 'Restricts the query to a time window and must come first because InfluxDB is time-indexed.' },
                { term: 'filter', detail: 'Keeps only the rows where the predicate function returns true, such as a specific measurement or host.' },
                { term: 'Pipe forward operator', detail: 'The pipe forward operator passes the output table of one function as the input of the next.' },
              ],
            },
            example: "// range(start: -1h, stop: now()) sets an explicit window",
          },
          {
            id: 'influx-flux-variables',
            code: "start = -6h\ncpuData = from(bucket: \"metrics\")\n  |> range(start: start)\n  |> filter(fn: (r) => r._measurement == \"cpu\")\n\ncpuData |> mean()",
            note: 'Flux lets you assign pipelines and values to variables for reuse and readability. A stored stream can be piped into multiple downstream operations, avoiding repeated from/range/filter boilerplate.',
            explanation: {
              heading: 'Variables and reuse',
              intro: 'Flux treats streams and scalars as first-class values you can name, which keeps larger scripts readable and avoids duplication.',
              points: [
                { term: 'Scalar variables', detail: 'You can bind values like a start duration to a name and reference it in several places.' },
                { term: 'Stream variables', detail: 'A full pipeline can be assigned to a variable so its result is defined once.' },
                { term: 'Reuse downstream', detail: 'A stored stream can feed multiple later operations without repeating the from, range, and filter chain.' },
                { term: 'Readability', detail: 'Naming intermediate steps makes complex queries easier to follow and maintain.' },
              ],
            },
            example: "// Assigning a stream to a name reuses it across queries",
          },
        ],
        children: [],
      },
      {
        id: 'influx-flux-keep-drop',
        title: 'keep, drop, rename',
        level: 2,
        slug: 'flux-keep-drop',
        concepts: [
          {
            id: 'influx-keep-drop-basic',
            code: "from(bucket: \"metrics\")\n  |> range(start: -1h)\n  |> filter(fn: (r) => r._measurement == \"cpu\")\n  |> keep(columns: [\"_time\", \"_value\", \"host\"])\n  |> rename(columns: {_value: \"usage\"})",
            note: 'keep narrows a table to the listed columns and drop removes specific ones, trimming output for charts or CSV export. rename gives columns friendlier names without changing the data.',
            explanation: {
              heading: 'Shaping columns',
              intro: 'These schema functions tidy the table before results leave the query, controlling which columns appear and what they are called.',
              points: [
                { term: 'keep', detail: 'Retains only the columns you list and discards everything else, giving an explicit whitelist.' },
                { term: 'drop', detail: 'Removes the named columns while keeping the rest, acting as the complementary blacklist.' },
                { term: 'rename', detail: 'Assigns friendlier names to columns without altering the underlying values.' },
                { term: 'Leaner output', detail: 'Trimming columns reduces payload size for charts, dashboards, and CSV export.' },
              ],
            },
            example: "// keep reduces payload size before yielding results",
          },
          {
            id: 'influx-sort-limit',
            code: "from(bucket: \"metrics\")\n  |> range(start: -1h)\n  |> filter(fn: (r) => r._field == \"usage\")\n  |> sort(columns: [\"_value\"], desc: true)\n  |> limit(n: 10)",
            note: 'sort orders rows within each table by one or more columns, and limit caps how many rows each table returns. Together they surface top-N results, such as the ten highest CPU readings in a window.',
            explanation: {
              heading: 'Ordering and top-N',
              intro: 'Combining sort and limit is the standard pattern for finding the largest or smallest values in a window.',
              points: [
                { term: 'sort', detail: 'Reorders rows by one or more columns, with desc set to true for descending order.' },
                { term: 'limit', detail: 'Caps the number of rows returned, so the two together yield a top-N list.' },
                { term: 'Per table scope', detail: 'Both functions operate within each table independently, not across the whole stream.' },
                { term: 'Global ranking', detail: 'To rank across all series, ungroup into one table first so the limit spans everything.' },
              ],
            },
            example: "// limit applies per table, so group first for global top-N",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'influx-influxql',
    title: 'InfluxQL',
    level: 1,
    slug: 'influxql',
    concepts: [],
    children: [
      {
        id: 'influx-influxql-select',
        title: 'SELECT Queries',
        level: 2,
        slug: 'influxql-select',
        concepts: [
          {
            id: 'influx-influxql-basic',
            code: "SELECT MEAN(usage) AS avg_cpu\nFROM cpu\nWHERE host = 'web-01' AND time > now() - 1h\nGROUP BY time(5m)\nFILL(previous)",
            note: 'InfluxQL is a SQL-like language for time-series. GROUP BY time() buckets data into fixed windows and FILL controls empty buckets (previous, null, linear, or a constant value).',
            explanation: {
              heading: 'SQL-like time queries',
              intro: 'InfluxQL offers a familiar SQL flavor tuned for time-series, with special clauses for bucketing over time.',
              points: [
                { term: 'FROM', detail: 'Names the measurement being queried, playing the role a table plays in SQL.' },
                { term: 'GROUP BY time', detail: 'Buckets rows into fixed intervals such as five minutes so aggregates apply per window.' },
                { term: 'FILL', detail: 'Decides what an empty bucket returns, using previous, null, linear, or a constant value.' },
                { term: 'WHERE with time', detail: 'The WHERE clause filters on tags and on the time column to bound the query.' },
              ],
            },
            example: "// FROM names the measurement, like a SQL table",
          },
          {
            id: 'influx-influxql-tags',
            code: "SELECT MEAN(usage) FROM cpu\nWHERE time > now() - 6h\nGROUP BY host, time(10m)\n\nSHOW TAG VALUES FROM cpu WITH KEY = \"region\"",
            note: 'GROUP BY a tag returns a separate series per tag value, combinable with time() for per-host trends. SHOW TAG VALUES and SHOW MEASUREMENTS introspect the schema without reading field data.',
            explanation: {
              heading: 'Grouping by tags and introspection',
              intro: 'InfluxQL can split results by tag and can also explore the schema directly through SHOW statements.',
              points: [
                { term: 'GROUP BY tag', detail: 'Produces one output series for each distinct value of the tag, such as one per host.' },
                { term: 'Combine with time', detail: 'Pairing a tag with GROUP BY time gives per-tag trends over successive intervals.' },
                { term: 'SHOW TAG VALUES', detail: 'Lists the distinct values for a tag key without scanning any field data.' },
                { term: 'SHOW MEASUREMENTS', detail: 'Enumerates the measurements present, helping you discover the schema.' },
              ],
            },
            example: "// GROUP BY host produces one result series per host",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'influx-aggregations',
    title: 'Aggregations',
    level: 1,
    slug: 'aggregations',
    concepts: [],
    children: [
      {
        id: 'influx-agg-ops',
        title: 'Aggregate Functions',
        level: 2,
        slug: 'agg-ops',
        concepts: [
          {
            id: 'influx-agg-basic',
            code: "from(bucket: \"metrics\")\n  |> range(start: -24h)\n  |> filter(fn: (r) => r._measurement == \"cpu\")\n  |> mean()\n  |> yield(name: \"daily_mean\")",
            note: 'Aggregate functions collapse many points into one: mean, sum, count, min, max, median, and stddev. yield names an output stream so a script can emit several results.',
            explanation: {
              heading: 'Collapsing points to a value',
              intro: 'Aggregate functions reduce a whole table of points down to a single computed number per table.',
              points: [
                { term: 'Common aggregates', detail: 'mean, sum, count, min, max, median, and stddev cover most summary needs.' },
                { term: 'Per table', detail: 'Each aggregate runs on every table in the stream, so grouping decides the granularity.' },
                { term: 'yield', detail: 'Names an output stream so a single script can emit several distinct results.' },
                { term: 'Synthesized value', detail: 'The output is a new computed value rather than one of the original points.' },
              ],
            },
            example: "// Combine with group() to aggregate per host",
          },
          {
            id: 'influx-selectors',
            code: "from(bucket: \"metrics\")\n  |> range(start: -1h)\n  |> filter(fn: (r) => r._field == \"usage\")\n  |> max()   // keeps the row with the largest value, with its _time",
            note: 'Selector functions (first, last, max, min, top) return actual points rather than computed values, preserving the original timestamp and tags. This differs from aggregates like mean that synthesize a value.',
            explanation: {
              heading: 'Selectors keep real points',
              intro: 'Selector functions pick existing rows out of the stream instead of computing a new number, so metadata survives.',
              points: [
                { term: 'Return real rows', detail: 'first, last, max, min, and top return actual points that already exist in the data.' },
                { term: 'Preserve timestamp', detail: 'Because the row is real, its original time and tags come along with the value.' },
                { term: 'Contrast with aggregates', detail: 'Aggregates like mean synthesize a value that never appeared in the raw data.' },
                { term: 'Latest reading', detail: 'last is the idiomatic way to fetch the most recent point per series.' },
              ],
            },
            example: "// Use last() to get the most recent reading per series",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'influx-windowing',
    title: 'Windowing',
    level: 1,
    slug: 'windowing',
    concepts: [],
    children: [
      {
        id: 'influx-window-ops',
        title: 'window and aggregateWindow',
        level: 2,
        slug: 'window-ops',
        concepts: [
          {
            id: 'influx-window-basic',
            code: "from(bucket: \"metrics\")\n  |> range(start: -6h)\n  |> filter(fn: (r) => r._field == \"usage\")\n  |> aggregateWindow(every: 5m, fn: mean, createEmpty: false)",
            note: 'aggregateWindow splits the stream into time buckets and applies a function to each, producing evenly spaced points ideal for charts. window() alone reshapes tables without aggregating.',
            explanation: {
              heading: 'Windowed aggregation',
              intro: 'aggregateWindow is the workhorse for turning irregular raw points into regular, chart-friendly intervals.',
              points: [
                { term: 'every', detail: 'Sets the bucket width, so every set to five minutes yields one value per five-minute span.' },
                { term: 'fn', detail: 'Chooses the aggregate applied to each bucket, such as mean, sum, or max.' },
                { term: 'createEmpty', detail: 'Controls whether buckets with no data still emit a point, useful for consistent axes.' },
                { term: 'window alone', detail: 'The window function reshapes tables by time without aggregating, giving finer control.' },
              ],
            },
            example: "// every: 5m yields one mean value per 5-minute bucket",
          },
          {
            id: 'influx-window-offset',
            code: "from(bucket: \"metrics\")\n  |> range(start: -1d)\n  |> aggregateWindow(every: 1h, fn: sum, offset: 30m, timeSrc: \"_start\")",
            note: 'offset shifts window boundaries, useful for aligning to business hours or timezones. timeSrc chooses whether each windowed point is timestamped at the window start or stop, affecting chart alignment.',
            explanation: {
              heading: 'Aligning window boundaries',
              intro: 'Fine-tuning where windows begin and how their points are timestamped makes charts line up with real-world clocks.',
              points: [
                { term: 'offset', detail: 'Shifts the start of each window, helpful for aligning to business hours or a timezone.' },
                { term: 'timeSrc', detail: 'Selects whether the resulting point takes the window start or stop time.' },
                { term: 'Chart alignment', detail: 'The timestamp choice affects whether a bar sits at the beginning or end of its interval.' },
                { term: 'createEmpty for gaps', detail: 'Setting createEmpty to true emits null-valued points so gaps stay visible.' },
              ],
            },
            example: "// createEmpty: true emits null-valued points for gaps",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'influx-group',
    title: 'Grouping',
    level: 1,
    slug: 'group',
    concepts: [],
    children: [
      {
        id: 'influx-group-ops',
        title: 'group',
        level: 2,
        slug: 'group-ops',
        concepts: [
          {
            id: 'influx-group-basic',
            code: "from(bucket: \"metrics\")\n  |> range(start: -1h)\n  |> filter(fn: (r) => r._measurement == \"cpu\")\n  |> group(columns: [\"region\"])\n  |> mean()",
            note: 'group reorganizes the stream by the given columns so downstream aggregates apply per group. group(columns: []) ungroups everything into a single table.',
            explanation: {
              heading: 'Regrouping the stream',
              intro: 'group redefines how rows are partitioned into tables, which determines how later aggregates are applied.',
              points: [
                { term: 'Group key', detail: 'The listed columns become the new group key, so each unique combination forms its own table.' },
                { term: 'Per group aggregates', detail: 'Downstream functions like mean run once per table, yielding one result per group.' },
                { term: 'Ungroup', detail: 'Calling group with an empty columns list merges everything into a single table.' },
                { term: 'Reshape not filter', detail: 'group changes partitioning only and does not add or remove any rows.' },
              ],
            },
            example: "// Grouping by region yields one mean per region",
          },
          {
            id: 'influx-group-mode',
            code: "// Group by everything EXCEPT host, merging hosts together\n  |> group(columns: [\"host\"], mode: \"except\")\n\n// Recombine all series into one table\n  |> group()",
            note: 'The mode argument controls grouping: by (default) groups on the listed columns, while except groups on all others. Calling group() with no arguments merges every series into a single table.',
            explanation: {
              heading: 'Group modes explained',
              intro: 'The mode argument flips the meaning of the column list, letting you include or exclude dimensions with the same call.',
              points: [
                { term: 'by mode', detail: 'The default groups on exactly the columns you list, ignoring the rest.' },
                { term: 'except mode', detail: 'Groups on every column except the listed ones, which merges across that dimension.' },
                { term: 'Collapse a dimension', detail: 'except is handy for aggregating away one tag, such as combining all hosts.' },
                { term: 'No arguments', detail: 'Calling group with no arguments flattens every series into one table.' },
              ],
            },
            example: "// mode: \"except\" is handy to aggregate across one dimension",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'influx-retention',
    title: 'Retention Policies',
    level: 1,
    slug: 'retention',
    concepts: [],
    children: [
      {
        id: 'influx-retention-ops',
        title: 'Data Retention',
        level: 2,
        slug: 'retention-ops',
        concepts: [
          {
            id: 'influx-retention-basic',
            code: "-- InfluxQL retention policy (v1)\nCREATE RETENTION POLICY \"one_month\" ON \"mydb\"\n  DURATION 30d REPLICATION 1 DEFAULT;\n\n-- v2: set retention on the bucket instead",
            note: 'A retention policy sets how long data is kept before automatic deletion, controlling storage costs. In InfluxDB 2.x this is a per-bucket retention duration rather than a named policy.',
            explanation: {
              heading: 'How long data lives',
              intro: 'Retention governs the lifespan of points, letting old data expire automatically so storage does not grow without bound.',
              points: [
                { term: 'Automatic deletion', detail: 'Once data passes the retention duration it is dropped without any manual cleanup.' },
                { term: 'Cost control', detail: 'Shorter retention keeps disk usage and cost in check for high-volume metrics.' },
                { term: 'Version one policies', detail: 'In InfluxDB one point x a named retention policy attaches to a database.' },
                { term: 'Version two buckets', detail: 'In InfluxDB two point x retention is a duration set directly on the bucket.' },
              ],
            },
            example: "// DURATION 0s means keep data forever",
          },
          {
            id: 'influx-bucket-mgmt',
            code: "# CLI: create a bucket with 90-day retention\ninflux bucket create --name metrics --retention 90d\n\n# Update retention on an existing bucket\ninflux bucket update --id <id> --retention 30d",
            note: 'In InfluxDB 2.x buckets are the storage unit that carry retention. The influx CLI creates and updates buckets, and each write targets a bucket rather than a database and retention policy pair.',
            explanation: {
              heading: 'Buckets as storage units',
              intro: 'In InfluxDB two point x the bucket replaces the older database and retention policy pair as the unit you read from and write to.',
              points: [
                { term: 'Retention on the bucket', detail: 'Each bucket carries its own retention duration that governs everything stored inside it.' },
                { term: 'influx CLI', detail: 'The influx command line tool creates, updates, and lists buckets and their settings.' },
                { term: 'Write target', detail: 'Every write names a bucket, simplifying the older model of a database plus a policy.' },
                { term: 'Tiered storage', detail: 'Pairing a short-retention raw bucket with a longer rollup bucket balances detail and cost.' },
              ],
            },
            example: "// A shorter retention on raw data plus a rollup bucket saves cost",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'influx-tasks',
    title: 'Tasks and Continuous Queries',
    level: 1,
    slug: 'tasks',
    concepts: [],
    children: [
      {
        id: 'influx-task-ops',
        title: 'Scheduled Downsampling',
        level: 2,
        slug: 'task-ops',
        concepts: [
          {
            id: 'influx-task-basic',
            code: "option task = { name: \"downsample_cpu\", every: 1h }\n\nfrom(bucket: \"metrics\")\n  |> range(start: -task.every)\n  |> filter(fn: (r) => r._measurement == \"cpu\")\n  |> aggregateWindow(every: 5m, fn: mean)\n  |> to(bucket: \"metrics_downsampled\")",
            note: 'A Flux task runs on a schedule to transform data, most often downsampling raw metrics into lower-resolution rollups. In v1 this role was filled by continuous queries.',
            explanation: {
              heading: 'Scheduled Flux tasks',
              intro: 'A task is a Flux script that InfluxDB runs on a timer, most commonly to reshape or summarize data automatically.',
              points: [
                { term: 'option task', detail: 'A task option block declares the name and schedule that turns a script into a task.' },
                { term: 'Downsampling role', detail: 'The most common task rolls raw metrics up into a coarser, cheaper resolution.' },
                { term: 'to writes results', detail: 'The to function persists the transformed stream into a destination bucket.' },
                { term: 'Successor to continuous queries', detail: 'Tasks replace the continuous queries that handled scheduled work in InfluxDB one point x.' },
              ],
            },
            example: "// to() writes the results into another bucket",
          },
          {
            id: 'influx-task-cron',
            code: "option task = {\n  name: \"nightly_rollup\",\n  cron: \"0 2 * * *\",\n  offset: 5m\n}",
            note: 'Tasks schedule with either every (a fixed interval) or cron (a crontab expression) for calendar-aligned runs. offset delays execution so late-arriving data is included before the task reads its window.',
            explanation: {
              heading: 'Task scheduling options',
              intro: 'A task can run on a simple interval or a calendar schedule, and an offset ensures it waits for complete data.',
              points: [
                { term: 'every', detail: 'Runs the task on a fixed repeating interval such as once an hour.' },
                { term: 'cron', detail: 'Uses a crontab expression for calendar-aligned runs like a fixed daily time.' },
                { term: 'offset', detail: 'Delays each run so late-arriving points land before the task reads its window.' },
                { term: 'Pick one schedule', detail: 'A task uses either every or cron, not both, to define when it fires.' },
              ],
            },
            example: "// cron gives precise control like \"run at 2am daily\"",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'influx-math',
    title: 'Math Across Fields',
    level: 1,
    slug: 'math',
    concepts: [],
    children: [
      {
        id: 'influx-math-ops',
        title: 'map and Arithmetic',
        level: 2,
        slug: 'math-ops',
        concepts: [
          {
            id: 'influx-math-basic',
            code: "from(bucket: \"metrics\")\n  |> range(start: -1h)\n  |> filter(fn: (r) => r._field == \"used\" or r._field == \"total\")\n  |> pivot(rowKey: [\"_time\"], columnKey: [\"_field\"], valueColumn: \"_value\")\n  |> map(fn: (r) => ({ r with pct: r.used / r.total * 100.0 }))",
            note: 'map applies a function to every row to compute derived values. Combine it with pivot so multiple fields share a row, enabling arithmetic across fields like a usage percentage.',
            explanation: {
              heading: 'Row-level computation',
              intro: 'map runs a function over every row, which is how Flux computes new columns and performs arithmetic.',
              points: [
                { term: 'Per row function', detail: 'The function receives each record as r and returns a new record for that row.' },
                { term: 'record with syntax', detail: 'The record with pattern copies existing columns and adds or overrides one.' },
                { term: 'Needs pivot first', detail: 'Cross-field math requires pivot so the fields you combine sit in the same row.' },
                { term: 'Derived metrics', detail: 'A common use is computing a percentage such as used divided by total times one hundred.' },
              ],
            },
            example: "// r with pct adds a new column to each record",
          },
          {
            id: 'influx-conditional-map',
            code: "  |> map(fn: (r) => ({ r with\n    level: if r._value > 90.0 then \"critical\"\n           else if r._value > 70.0 then \"warn\"\n           else \"ok\"\n  }))",
            note: 'Flux supports if/else if/else expressions inside map, letting you classify or bucket values into labels. This is useful for turning raw metrics into status categories for alerting or coloring charts.',
            explanation: {
              heading: 'Conditional classification',
              intro: 'Inside map you can use if and else branches to convert numeric values into meaningful labels.',
              points: [
                { term: 'Expression form', detail: 'Flux conditionals are expressions that return a value rather than statements that run side effects.' },
                { term: 'Chained branches', detail: 'You can chain if, else if, and else to sort values into several categories.' },
                { term: 'Status labels', detail: 'A typical use maps thresholds to labels like critical, warn, and ok.' },
                { term: 'Feeds visuals and alerts', detail: 'The resulting labels drive chart coloring and alert routing.' },
              ],
            },
            example: "// Conditional expressions return a value, not a statement",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'influx-joins',
    title: 'Joins',
    level: 1,
    slug: 'joins',
    concepts: [],
    children: [
      {
        id: 'influx-join-ops',
        title: 'Joining Streams',
        level: 2,
        slug: 'join-ops',
        concepts: [
          {
            id: 'influx-join-basic',
            code: "cpu = from(bucket: \"metrics\") |> range(start: -1h) |> filter(fn: (r) => r._measurement == \"cpu\")\nmem = from(bucket: \"metrics\") |> range(start: -1h) |> filter(fn: (r) => r._measurement == \"mem\")\n\njoin(tables: {c: cpu, m: mem}, on: [\"_time\", \"host\"])",
            note: 'join merges two streams on matching key columns, aligning different measurements by time and tags. Assign each source to a variable, then join on shared columns like _time and host.',
            explanation: {
              heading: 'Aligning two streams',
              intro: 'join combines rows from two separate queries wherever their key columns match, placing them side by side.',
              points: [
                { term: 'Named tables', detail: 'Each source stream is assigned a key in the tables argument, such as c and m.' },
                { term: 'on columns', detail: 'The on list names the shared columns, commonly time and a tag like host, that define a match.' },
                { term: 'Prefixed output', detail: 'Result columns are prefixed with the table keys to avoid name collisions.' },
                { term: 'Inner match', detail: 'Only rows present in both streams for a given key survive the join.' },
              ],
            },
            example: "// Output columns are prefixed with the table keys (c, m)",
          },
          {
            id: 'influx-union',
            code: "union(tables: [cpu, mem])\n  |> sort(columns: [\"_time\"])",
            note: 'Unlike join, union concatenates the rows of multiple streams into one without matching keys, useful for charting several measurements on one graph. sort reorders the combined result by time.',
            explanation: {
              heading: 'Concatenating streams',
              intro: 'union stacks the rows of several streams into a single output without trying to match keys.',
              points: [
                { term: 'No key matching', detail: 'union simply appends all rows, unlike join which requires matching key columns.' },
                { term: 'One graph', detail: 'It is handy for plotting several measurements together on the same chart.' },
                { term: 'sort afterward', detail: 'Because rows arrive interleaved, a sort by time usually follows to restore order.' },
                { term: 'Contrast with join', detail: 'union stacks rows vertically while join aligns them side by side.' },
              ],
            },
            example: "// union stacks rows; join aligns them side by side",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'influx-pivot',
    title: 'Pivot',
    level: 1,
    slug: 'pivot',
    concepts: [],
    children: [
      {
        id: 'influx-pivot-ops',
        title: 'Reshaping with pivot',
        level: 2,
        slug: 'pivot-ops',
        concepts: [
          {
            id: 'influx-pivot-basic',
            code: "from(bucket: \"metrics\")\n  |> range(start: -1h)\n  |> filter(fn: (r) => r._measurement == \"cpu\")\n  |> pivot(rowKey: [\"_time\"], columnKey: [\"_field\"], valueColumn: \"_value\")",
            note: 'pivot turns a narrow field-per-row table into a wide one with a column per field, aligned by row key. This produces spreadsheet-like output and enables cross-field math.',
            explanation: {
              heading: 'Narrow to wide',
              intro: 'pivot reshapes the default one-field-per-row layout into a wide table where each field has its own column.',
              points: [
                { term: 'rowKey', detail: 'Names the columns, usually time, that identify a single output row.' },
                { term: 'columnKey', detail: 'Names the column whose values become new column headers, typically the field.' },
                { term: 'valueColumn', detail: 'Points to the column whose values fill the new wide cells.' },
                { term: 'Enables math', detail: 'With fields side by side in one row, arithmetic across fields becomes possible.' },
              ],
            },
            example: "// Each distinct _field becomes its own column",
          },
          {
            id: 'influx-schema-toframe',
            code: "import \"influxdata/influxdb/schema\"\n\nfrom(bucket: \"metrics\")\n  |> range(start: -1h)\n  |> filter(fn: (r) => r._measurement == \"cpu\")\n  |> schema.fieldsAsCols()",
            note: 'schema.fieldsAsCols() is a convenience wrapper around pivot that turns every field into its own column keyed by time. It is the idiomatic shortcut when you simply want a wide table of all fields.',
            explanation: {
              heading: 'The fields-as-columns shortcut',
              intro: 'schema.fieldsAsCols wraps the common pivot pattern so you do not have to spell out its arguments every time.',
              points: [
                { term: 'Import required', detail: 'It lives in the influxdata influxdb schema package, which you import before use.' },
                { term: 'Pivots on time', detail: 'It keys rows by time and turns each field into its own column automatically.' },
                { term: 'Fewer arguments', detail: 'It saves writing the full rowKey, columnKey, and valueColumn arguments of pivot.' },
                { term: 'Idiomatic wide table', detail: 'It is the preferred choice when you just want every field as a column.' },
              ],
            },
            example: "// fieldsAsCols() saves writing the full pivot arguments",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'influx-downsampling',
    title: 'Downsampling',
    level: 1,
    slug: 'downsampling',
    concepts: [],
    children: [
      {
        id: 'influx-downsample-ops',
        title: 'Reducing Resolution',
        level: 2,
        slug: 'downsample-ops',
        concepts: [
          {
            id: 'influx-downsample-basic',
            code: "from(bucket: \"raw\")\n  |> range(start: -30d)\n  |> filter(fn: (r) => r._measurement == \"cpu\")\n  |> aggregateWindow(every: 1h, fn: mean)\n  |> to(bucket: \"rollup_1h\")",
            note: 'Downsampling aggregates high-frequency raw data into coarser intervals for long-term storage, cutting cost while preserving trends. Typically run on a schedule as a task.',
            explanation: {
              heading: 'Trading detail for longevity',
              intro: 'Downsampling summarizes dense raw points into a lower resolution that is far cheaper to keep for the long term.',
              points: [
                { term: 'Coarser intervals', detail: 'Raw points are aggregated into wider windows such as one value per hour.' },
                { term: 'Cost savings', detail: 'Fewer points mean less disk, so long-term storage stays affordable.' },
                { term: 'Preserves trends', detail: 'Overall shape and trends survive even though fine detail is lost.' },
                { term: 'Runs as a task', detail: 'It is usually scheduled as a task and writes to a separate rollup bucket.' },
              ],
            },
            example: "// Keep raw data short-term, downsampled data long-term",
          },
          {
            id: 'influx-multi-rollup',
            code: "// Preserve multiple statistics per window\ndata = from(bucket: \"raw\") |> range(start: -task.every)\ndata |> aggregateWindow(every: 1h, fn: mean) |> set(key: \"agg\", value: \"mean\") |> to(bucket: \"rollup\")\ndata |> aggregateWindow(every: 1h, fn: max)  |> set(key: \"agg\", value: \"max\")  |> to(bucket: \"rollup\")",
            note: 'A single mean loses peaks and troughs, so production rollups often store several aggregates (mean, max, min) per window, tagged to distinguish them. This keeps summary charts faithful to the raw data.',
            explanation: {
              heading: 'Preserving peaks in rollups',
              intro: 'Keeping only a mean hides extremes, so robust downsampling stores multiple statistics per window.',
              points: [
                { term: 'Mean hides extremes', detail: 'A single average smooths away the highest and lowest readings in a window.' },
                { term: 'Multiple aggregates', detail: 'Storing mean, max, and min per window retains both the trend and the range.' },
                { term: 'Tag to distinguish', detail: 'Each rollup is tagged with its aggregation type so the series stay separate.' },
                { term: 'Faithful summaries', detail: 'The extra statistics keep summary charts truthful about the original data.' },
              ],
            },
            example: "// Tag each rollup with its aggregation type to keep them distinct",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'influx-transformations',
    title: 'Transformations',
    level: 1,
    slug: 'transformations',
    concepts: [],
    children: [
      {
        id: 'influx-transform-ops',
        title: 'derivative and increase',
        level: 2,
        slug: 'transform-ops',
        concepts: [
          {
            id: 'influx-transform-basic',
            code: "from(bucket: \"metrics\")\n  |> range(start: -1h)\n  |> filter(fn: (r) => r._field == \"bytes_total\")\n  |> derivative(unit: 1s, nonNegative: true)",
            note: 'derivative computes the rate of change between points, and increase sums the positive deltas of a monotonic counter. nonNegative:true ignores drops from counter resets.',
            explanation: {
              heading: 'Rates from counters',
              intro: 'These transformations turn ever-growing counters into meaningful rates and totals.',
              points: [
                { term: 'derivative', detail: 'Computes the change between consecutive points, normalized to a unit of time.' },
                { term: 'increase', detail: 'Sums only the positive deltas of a monotonic counter to give a running total.' },
                { term: 'nonNegative', detail: 'Setting nonNegative to true discards the drops that appear when a counter resets.' },
                { term: 'Per-second rate', detail: 'With a unit of one second, derivative converts a cumulative counter into a per-second rate.' },
              ],
            },
            example: "// Turns a cumulative counter into a per-second rate",
          },
          {
            id: 'influx-moving-average',
            code: "from(bucket: \"metrics\")\n  |> range(start: -6h)\n  |> filter(fn: (r) => r._field == \"usage\")\n  |> movingAverage(n: 5)\n  |> timedMovingAverage(every: 1m, period: 10m)",
            note: 'movingAverage smooths noisy series by averaging the last n points, while timedMovingAverage averages over a time period regardless of point count. Both reduce jitter for clearer trend lines.',
            explanation: {
              heading: 'Smoothing noisy data',
              intro: 'Moving averages reduce jitter so the underlying trend of a volatile series becomes easier to see.',
              points: [
                { term: 'movingAverage', detail: 'Averages the last n points, so the smoothing window is defined by a count.' },
                { term: 'timedMovingAverage', detail: 'Averages over a fixed time period regardless of how many points fall inside it.' },
                { term: 'Irregular intervals', detail: 'The time-based variant copes better when samples arrive at uneven spacing.' },
                { term: 'Clearer trends', detail: 'Both dampen short-term noise to reveal the longer-term direction.' },
              ],
            },
            example: "// timedMovingAverage handles irregular sample intervals better",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'influx-alerts',
    title: 'Checks and Alerts',
    level: 1,
    slug: 'alerts',
    concepts: [],
    children: [
      {
        id: 'influx-alert-ops',
        title: 'Thresholds and Notifications',
        level: 2,
        slug: 'alert-ops',
        concepts: [
          {
            id: 'influx-monitor-check',
            code: "import \"influxdata/influxdb/monitor\"\n\nfrom(bucket: \"metrics\")\n  |> range(start: -5m)\n  |> filter(fn: (r) => r._field == \"usage\")\n  |> monitor.check(\n    crit: (r) => r._value > 90.0,\n    warn: (r) => r._value > 70.0,\n    messageFn: (r) => \"CPU at ${r._value}\"\n  )",
            note: 'The monitor package evaluates a stream against threshold predicates and records a status level (ok, warn, crit) per point. Checks usually run as scheduled tasks, writing statuses to a dedicated bucket.',
            explanation: {
              heading: 'Threshold checks',
              intro: 'The monitor package grades each incoming point against thresholds and records a status that alerts can act on.',
              points: [
                { term: 'Status levels', detail: 'Each point is tagged ok, warn, or crit based on which predicate it satisfies.' },
                { term: 'Predicate functions', detail: 'The crit and warn arguments are functions that return a boolean for a row.' },
                { term: 'messageFn', detail: 'A message function builds the human-readable text attached to each status.' },
                { term: 'Runs as a task', detail: 'Checks usually run on a schedule and write statuses to a dedicated bucket.' },
              ],
            },
            example: "// crit and warn are predicate functions returning a boolean",
          },
          {
            id: 'influx-deadman',
            code: "import \"influxdata/influxdb/monitor\"\nimport \"experimental\"\n\nfrom(bucket: \"metrics\")\n  |> range(start: -10m)\n  |> filter(fn: (r) => r._measurement == \"heartbeat\")\n  |> monitor.deadman(t: experimental.subDuration(d: 5m, from: now()))",
            note: 'monitor.deadman flags series that have stopped reporting by a given time, the standard way to alert on a silent or dead host. It complements threshold checks by catching missing data rather than bad values.',
            explanation: {
              heading: 'Detecting silence',
              intro: 'A deadman check watches for the absence of data, alerting when a series stops reporting altogether.',
              points: [
                { term: 'Missing data', detail: 'It flags series that have sent nothing since a given cutoff time.' },
                { term: 'Silent host use case', detail: 'It is the standard way to catch a crashed agent or an unreachable host.' },
                { term: 'Time cutoff', detail: 'The t argument sets the moment before which a series must have reported.' },
                { term: 'Complements thresholds', detail: 'It catches missing data, where threshold checks only catch bad values.' },
              ],
            },
            example: "// Deadman alerts detect agents that stopped sending metrics",
          },
        ],
        children: [],
      },
    ],
  },
];

export default topics;
