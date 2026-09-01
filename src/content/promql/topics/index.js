// PromQL topic tree.

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  {
    id: 'promql-vectors',
    title: 'Instant and Range Vectors',
    level: 1,
    slug: 'vectors',
    concepts: [],
    children: [
      {
        id: 'promql-vector-ops',
        title: 'Vector Types',
        level: 2,
        slug: 'vector-ops',
        concepts: [
          {
            id: 'promql-vector-basic',
            code: "# Instant vector: latest value per series\nhttp_requests_total\n\n# Range vector: samples over the last 5 minutes\nhttp_requests_total[5m]",
            note: 'An instant vector returns one sample per matching series at the query time. A range vector uses [duration] to return a window of samples, which functions like rate() require.',
            explanation: {
              heading: 'Instant versus range vectors',
              intro: 'Every PromQL selector produces one of two vector shapes, and knowing which one you have determines what you can do with it.',
              points: [
                { term: 'Instant vector', detail: 'Returns a single most-recent sample for each matching series at the evaluation time.' },
                { term: 'Range vector', detail: 'Adds a bracketed duration to gather many samples per series across a time window.' },
                { term: 'Function inputs', detail: 'Rate-style functions require a range vector because they need multiple samples to compute change.' },
                { term: 'Not graphable', detail: 'A raw range vector cannot be plotted directly and must be wrapped in a function that returns an instant vector.' },
              ],
            },
            example: "# You cannot graph a range vector directly; wrap it in a function",
          },
          {
            id: 'promql-scalar',
            code: "# A scalar is a single numeric value\nscalar(count(up))\n\n# scalar() extracts the value from a single-series vector\nscalar(node_load1)",
            note: 'A scalar is a bare number with no labels. scalar() converts a one-series instant vector into a scalar, returning NaN if the vector has zero or more than one series.',
            explanation: {
              heading: 'Scalars and conversions',
              intro: 'A scalar is the simplest PromQL value type, and dedicated functions convert between scalars and vectors.',
              points: [
                { term: 'No labels', detail: 'A scalar is a single floating-point number that carries no label set at all.' },
                { term: 'scalar() function', detail: 'Extracts the numeric value from an instant vector that contains exactly one series.' },
                { term: 'NaN result', detail: 'scalar() returns NaN when the input vector has zero series or more than one series.' },
                { term: 'vector() reverse', detail: 'vector(s) turns a scalar back into a single-series instant vector with no labels.' },
              ],
            },
            example: "# vector(1) does the reverse: turns a scalar into a vector",
          },
          {
            id: 'promql-duration-syntax',
            code: "http_requests_total[5m]   # 5 minutes\nhttp_requests_total[1h30m] # 1 hour 30 minutes\nhttp_requests_total[7d]   # 7 days",
            note: 'Range durations use unit suffixes: ms, s, m, h, d, w, y. Units can be combined largest-first. The window must be at least two scrape intervals wide for rate-style functions to work.',
            explanation: {
              heading: 'Duration syntax rules',
              intro: 'Range windows are written with compact duration literals that follow a few consistent formatting rules.',
              points: [
                { term: 'Unit suffixes', detail: 'Supported units are milliseconds, seconds, minutes, hours, days, weeks, and years.' },
                { term: 'Largest first', detail: 'Combined durations must list units from largest to smallest, such as one hour then thirty minutes.' },
                { term: 'Minimum width', detail: 'A window needs at least two scrape intervals so rate-style functions have two samples to compare.' },
                { term: 'Stability tip', detail: 'Choosing a window that spans four or more scrapes gives smoother and more reliable rate results.' },
              ],
            },
            example: "# Pick a range covering 4+ scrapes for stable rate() results",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'promql-selectors',
    title: 'Selectors and Label Matchers',
    level: 1,
    slug: 'selectors',
    concepts: [],
    children: [
      {
        id: 'promql-selector-ops',
        title: 'Label Matching',
        level: 2,
        slug: 'selector-ops',
        concepts: [
          {
            id: 'promql-selector-basic',
            code: "http_requests_total{job=\"api\", status=~\"5..\", env!=\"dev\"}",
            note: 'Curly-brace selectors filter series by labels. = matches exactly, != negates, =~ matches a regex, and !~ negates a regex. Combine matchers to target precise series.',
            explanation: {
              heading: 'Label matcher operators',
              intro: 'Selectors narrow the set of series by testing label values against four matcher operators.',
              points: [
                { term: 'Equality match', detail: 'The equals operator keeps only series whose label value is exactly the given string.' },
                { term: 'Negation match', detail: 'The not-equals operator drops series whose label value equals the given string.' },
                { term: 'Regex match', detail: 'The equals-tilde operator keeps series whose label value matches the anchored regular expression.' },
                { term: 'Regex negation', detail: 'The bang-tilde operator drops series whose label value matches the regular expression.' },
                { term: 'Combining', detail: 'Multiple matchers inside the braces are joined with logical AND to target precise series.' },
              ],
            },
            example: "{__name__=~\"node_.*\"} # match by metric name regex",
          },
          {
            id: 'promql-selector-empty',
            code: "# Match series that do NOT have the canary label\nhttp_requests_total{canary=\"\"}\n\n# Match series that DO have any env value\nhttp_requests_total{env=~\".+\"}",
            note: 'An empty-string matcher (label=\"\") selects series missing that label entirely. Conversely, =~\".+\" requires a non-empty value, a handy trick for filtering on label presence.',
            explanation: {
              heading: 'Presence and absence matching',
              intro: 'PromQL treats a missing label as an empty string, which enables clever tests for label presence.',
              points: [
                { term: 'Empty means absent', detail: 'Matching a label against the empty string selects series that lack that label completely.' },
                { term: 'Requiring a value', detail: 'Matching against the regex dot-plus keeps only series where the label has a non-empty value.' },
                { term: 'Absence patterns', detail: 'Both an empty equality match and a negated dot-plus regex mean the label is effectively absent.' },
                { term: 'Filtering use', detail: 'These tricks let you split series into those that carry an optional label and those that do not.' },
              ],
            },
            example: "# label=\"\" and label!~\".+\" both mean the label is absent",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'promql-rate',
    title: 'rate and irate',
    level: 1,
    slug: 'rate',
    concepts: [],
    children: [
      {
        id: 'promql-rate-ops',
        title: 'Counter Rates',
        level: 2,
        slug: 'rate-ops',
        concepts: [
          {
            id: 'promql-rate-basic',
            code: "# Average per-second rate over 5m\nrate(http_requests_total[5m])\n\n# Instantaneous rate from the last two samples\nirate(http_requests_total[5m])",
            note: 'rate computes the average per-second increase of a counter over the range, smoothing spikes and handling resets. irate uses only the last two samples for a more reactive value.',
            explanation: {
              heading: 'rate versus irate',
              intro: 'Both functions convert a rising counter into a per-second rate, but they differ in how many samples they use.',
              points: [
                { term: 'rate averaging', detail: 'rate uses all samples in the range to compute an average per-second increase, which smooths short spikes.' },
                { term: 'Reset handling', detail: 'rate automatically detects counter resets from restarts and treats them as continued growth.' },
                { term: 'irate reactivity', detail: 'irate uses only the final two samples, producing a more responsive but noisier value.' },
                { term: 'When to use', detail: 'Prefer rate for alerting stability and irate for fast-moving dashboards where recency matters.' },
              ],
            },
            example: "# Use rate for alerting, irate for volatile dashboards",
          },
          {
            id: 'promql-rate-aggregation-order',
            code: "# Correct: rate BEFORE sum\nsum(rate(http_requests_total[5m]))\n\n# Wrong: sum hides counter resets from rate\nrate(sum(http_requests_total)[5m:])",
            note: 'Always apply rate() to raw counters first, then aggregate. Summing counters before rate() breaks reset detection and produces incorrect results. This ordering rule is the most common PromQL mistake.',
            explanation: {
              heading: 'Rate before aggregation',
              intro: 'The order in which you apply rate and sum is not interchangeable, and getting it wrong silently corrupts results.',
              points: [
                { term: 'Correct order', detail: 'Apply rate to each raw counter series first, then wrap the result in sum or another aggregator.' },
                { term: 'Why order matters', detail: 'rate needs to see each individual counter so it can detect resets when a target restarts.' },
                { term: 'Broken order', detail: 'Summing counters first hides individual resets and produces sudden drops that rate misreads.' },
                { term: 'Common mistake', detail: 'This reversed ordering is one of the most frequent errors PromQL beginners make.' },
              ],
            },
            example: "# rate() must see the individual counter to detect restarts",
          },
        ],
        children: [],
      },
      {
        id: 'promql-resets-changes',
        title: 'resets and changes',
        level: 2,
        slug: 'resets-changes',
        concepts: [
          {
            id: 'promql-resets-basic',
            code: "# Count counter resets (e.g. restarts) in 1h\nresets(process_cpu_seconds_total[1h])\n\n# Count how often a gauge changed value in 1h\nchanges(node_boot_time_seconds[1h])",
            note: 'resets() counts how many times a counter went backwards in the range, indicating restarts. changes() counts how often any sample differed from its predecessor, useful for detecting flapping gauges.',
            explanation: {
              heading: 'Counting resets and changes',
              intro: 'These two functions summarize how a series behaved over a window by counting specific kinds of events.',
              points: [
                { term: 'resets counts drops', detail: 'resets reports how many times a counter decreased within the range, which usually signals a restart.' },
                { term: 'changes counts diffs', detail: 'changes reports how many times a sample differed from the one before it across the range.' },
                { term: 'Flapping detection', detail: 'changes is useful for spotting gauges that toggle back and forth, such as a state that flaps.' },
                { term: 'Operational signal', detail: 'A spike in resets often lines up with pods or processes restarting under load.' },
              ],
            },
            example: "# A spike in resets() often correlates with pod restarts",
          },
          {
            id: 'promql-delta-idelta',
            code: "# Difference between first and last gauge sample\ndelta(cpu_temp_celsius[1h])\n\n# Difference of the last two samples\nidelta(cpu_temp_celsius[1h])",
            note: 'delta computes the difference between the first and last values of a gauge over the range, interpolating for the window edges. idelta uses only the final two samples. Both are for gauges, not counters.',
            explanation: {
              heading: 'delta versus idelta',
              intro: 'Both functions measure how much a gauge changed, differing in how many samples they consider.',
              points: [
                { term: 'delta span', detail: 'delta computes the difference between the first and last values across the whole range.' },
                { term: 'Edge interpolation', detail: 'delta interpolates at the window boundaries to estimate values at the exact range edges.' },
                { term: 'idelta pair', detail: 'idelta uses only the final two samples for an instantaneous difference.' },
                { term: 'Gauges only', detail: 'Both functions assume a gauge; use increase for counters that reset.' },
              ],
            },
            example: "# Use delta for gauges; use increase for counters",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'promql-aggregation',
    title: 'Aggregation Operators',
    level: 1,
    slug: 'aggregation',
    concepts: [],
    children: [
      {
        id: 'promql-agg-ops',
        title: 'sum, avg, by, without',
        level: 2,
        slug: 'agg-ops',
        concepts: [
          {
            id: 'promql-agg-basic',
            code: "sum by (service) (rate(http_requests_total[5m]))\n\navg without (instance) (node_cpu_seconds_total)",
            note: 'Aggregation operators (sum, avg, min, max, count, stddev) collapse many series into fewer. by (labels) keeps only those labels; without (labels) drops them from the result.',
            explanation: {
              heading: 'Aggregating with by and without',
              intro: 'Aggregation operators reduce many input series into a smaller set, and grouping clauses control the output labels.',
              points: [
                { term: 'Common operators', detail: 'sum, avg, min, max, count, and stddev each collapse multiple series into fewer results.' },
                { term: 'by clause', detail: 'The by clause keeps only the listed labels and groups series that share those values.' },
                { term: 'without clause', detail: 'The without clause drops the listed labels and groups on everything that remains.' },
                { term: 'Default behavior', detail: 'With no grouping clause the operator reduces all matching series into a single result.' },
              ],
            },
            example: "count(up == 1) # number of healthy targets",
          },
          {
            id: 'promql-count-values',
            code: "# Count how many series report each version\ncount_values(\"version\", build_info)\n\n# Distinct label-value combinations\ncount(count by (instance) (up))",
            note: 'count_values counts how many series share each distinct value, outputting a new label. It is handy for tallying versions or status codes. count without a group gives a grand total series count.',
            explanation: {
              heading: 'Counting distinct values',
              intro: 'count_values answers how many series report each unique value, which differs from a plain series count.',
              points: [
                { term: 'Groups by value', detail: 'count_values buckets series by their sample value rather than by label.' },
                { term: 'New output label', detail: 'It writes each distinct value into a new label whose name you supply.' },
                { term: 'Typical uses', detail: 'It is handy for tallying how many instances run each build version or return each status code.' },
                { term: 'Contrast with count', detail: 'A plain count without grouping just returns the total number of matching series.' },
              ],
            },
            example: "# count_values turns each value into its own output series",
          },
          {
            id: 'promql-group-quantile',
            code: "# The 0.9 quantile across instances per job\nquantile by (job) (0.9, node_load1)\n\n# group() reduces to one series per group with value 1\ngroup by (datacenter) (up)",
            note: 'quantile aggregates a phi-quantile across series in each group. group() collapses to a constant 1 per group, useful for existence tests and set operations without caring about values.',
            explanation: {
              heading: 'quantile and group aggregators',
              intro: 'These aggregators serve different needs, one computing a statistical quantile and the other testing existence.',
              points: [
                { term: 'quantile parameter', detail: 'quantile takes a phi between zero and one and estimates that quantile across the grouped series.' },
                { term: 'Median example', detail: 'Passing a phi of one half computes the median value across the series in each group.' },
                { term: 'group collapses', detail: 'group reduces each group to a single series whose value is always one.' },
                { term: 'Existence tests', detail: 'group is useful when you only care that a group exists, not about its numeric value.' },
              ],
            },
            example: "# quantile(0.5, ...) is the median across series",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'promql-functions',
    title: 'Functions',
    level: 1,
    slug: 'functions',
    concepts: [],
    children: [
      {
        id: 'promql-function-ops',
        title: 'increase and histogram_quantile',
        level: 2,
        slug: 'function-ops',
        concepts: [
          {
            id: 'promql-function-basic',
            code: "# Total increase over 1 hour\nincrease(http_requests_total[1h])\n\n# 95th percentile latency from a histogram\nhistogram_quantile(0.95,\n  sum(rate(http_request_duration_seconds_bucket[5m])) by (le))",
            note: 'increase gives the total counter growth over a range. histogram_quantile estimates a percentile from bucketed histogram data; the le (less-or-equal) label must be preserved.',
            explanation: {
              heading: 'increase and histogram quantiles',
              intro: 'These functions cover two common needs, total counter growth and percentile estimation from histograms.',
              points: [
                { term: 'increase total', detail: 'increase reports the total growth of a counter across the range, accounting for resets.' },
                { term: 'Quantile estimate', detail: 'histogram_quantile estimates a percentile from cumulative histogram buckets.' },
                { term: 'The le label', detail: 'The less-or-equal bucket label must be preserved through aggregation for the estimate to work.' },
                { term: 'Aggregate by le', detail: 'Sum the bucket series grouped by le before passing them to histogram_quantile.' },
              ],
            },
            example: "# Sum the _bucket series by (le) before computing the quantile",
          },
          {
            id: 'promql-over-time',
            code: "# Smooth a gauge with a moving average\navg_over_time(node_load1[10m])\n\n# Peak and floor over a window\nmax_over_time(temperature[1h])\nmin_over_time(temperature[1h])",
            note: 'The _over_time family (avg, max, min, sum, count, last, stddev, quantile) aggregates the samples of a range vector along time for each series, unlike rate which measures growth.',
            explanation: {
              heading: 'Aggregating over time',
              intro: 'The over-time functions summarize the samples within a range for each series, reducing them along the time axis.',
              points: [
                { term: 'Per-series scope', detail: 'Each over-time function operates independently on the samples of every matching series.' },
                { term: 'Function family', detail: 'The family includes average, max, min, sum, count, last, standard deviation, and quantile variants.' },
                { term: 'Time not growth', detail: 'Unlike rate, these functions summarize existing values rather than measuring per-second change.' },
                { term: 'last carries forward', detail: 'last_over_time returns the most recent sample, effectively carrying the latest value forward.' },
              ],
            },
            example: "# last_over_time carries the most recent sample forward",
          },
          {
            id: 'promql-clamp-round',
            code: "# Bound values into a range\nclamp_max(rate(errors_total[5m]), 100)\nclamp_min(temperature, 0)\n\n# Round to nearest multiple\nround(node_memory_usage_bytes, 1024)",
            note: 'clamp_min and clamp_max cap values at a floor or ceiling, useful for sanitizing noisy data before charting. round() snaps values to the nearest multiple of an increment.',
            explanation: {
              heading: 'Clamping and rounding',
              intro: 'These shaping functions constrain or normalize sample values before they reach a chart or alert.',
              points: [
                { term: 'clamp_min floor', detail: 'clamp_min raises any value below the floor up to that floor.' },
                { term: 'clamp_max ceiling', detail: 'clamp_max lowers any value above the ceiling down to that ceiling.' },
                { term: 'round snapping', detail: 'round snaps each value to the nearest multiple of a chosen increment.' },
                { term: 'Dashboard use', detail: 'Clamping keeps extreme outliers from distorting the scale of a dashboard axis.' },
              ],
            },
            example: "# clamp keeps outliers from distorting a dashboard axis",
          },
        ],
        children: [],
      },
      {
        id: 'promql-predict-deriv',
        title: 'deriv and predict_linear',
        level: 2,
        slug: 'predict-deriv',
        concepts: [
          {
            id: 'promql-predict-basic',
            code: "# Predict free disk space 4 hours from now\npredict_linear(node_filesystem_free_bytes[1h], 4 * 3600) < 0\n\n# Per-second slope of a gauge\nderiv(node_filesystem_free_bytes[1h])",
            note: 'predict_linear fits a linear regression over a range and extrapolates the value a given number of seconds ahead, ideal for capacity alerts. deriv gives the per-second slope of a gauge.',
            explanation: {
              heading: 'Forecasting with regression',
              intro: 'These functions apply linear regression to a gauge range, one projecting forward and one reporting slope.',
              points: [
                { term: 'predict_linear', detail: 'predict_linear fits a straight line to the range and extrapolates the value a set number of seconds ahead.' },
                { term: 'Capacity alerts', detail: 'It lets you alert before a resource like disk space runs out rather than after.' },
                { term: 'deriv slope', detail: 'deriv reports the per-second slope of the fitted line for a gauge.' },
                { term: 'Gauge input', detail: 'Both functions expect a gauge range vector, not a monotonic counter.' },
              ],
            },
            example: "# Alert before a disk fills rather than after it is full",
          },
          {
            id: 'promql-holt-winters',
            code: "# Smoothed trend for anomaly baselines\nholt_winters(node_load1[1h], 0.5, 0.5)",
            note: 'holt_winters applies double-exponential smoothing to a gauge range, dampening noise while following trends. The two factors control level and trend smoothing, useful for forecasting-style baselines.',
            explanation: {
              heading: 'Double exponential smoothing',
              intro: 'holt_winters smooths a noisy gauge while still tracking its underlying trend, controlled by two factors.',
              points: [
                { term: 'Smoothing goal', detail: 'It dampens short-term noise so the output follows the meaningful trend of the data.' },
                { term: 'Level factor', detail: 'The first factor controls how strongly recent values influence the smoothed level.' },
                { term: 'Trend factor', detail: 'The second factor controls how quickly the estimated trend adapts to changes.' },
                { term: 'Slower with lower', detail: 'Lower factors make the output follow the raw data more slowly and smoothly.' },
              ],
            },
            example: "# Lower smoothing factors follow the data more slowly",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'promql-binary-operators',
    title: 'Binary Operators',
    level: 1,
    slug: 'binary-operators',
    concepts: [],
    children: [
      {
        id: 'promql-binary-ops',
        title: 'Arithmetic and Comparison',
        level: 2,
        slug: 'binary-ops',
        concepts: [
          {
            id: 'promql-binary-basic',
            code: "# Error ratio as a percentage\nsum(rate(http_requests_total{status=~\"5..\"}[5m]))\n  / sum(rate(http_requests_total[5m])) * 100\n\n# Free memory below 10%\nnode_memory_free_bytes / node_memory_total_bytes < 0.1",
            note: 'Binary operators do arithmetic (+, -, *, /) and comparisons (>, <, ==). Vector-to-vector operations match series on identical label sets. Comparisons filter series by default.',
            explanation: {
              heading: 'Arithmetic and comparison',
              intro: 'Binary operators combine two values, supporting both math and comparison with rules for matching series.',
              points: [
                { term: 'Arithmetic set', detail: 'Addition, subtraction, multiplication, and division compute new values between operands.' },
                { term: 'Comparison set', detail: 'Greater-than, less-than, and equals compare values between operands.' },
                { term: 'Label matching', detail: 'Vector-to-vector operations pair series that share an identical set of labels.' },
                { term: 'Filtering default', detail: 'By default a comparison drops series that fail the test rather than returning a boolean.' },
              ],
            },
            example: "on (instance) # control which labels are matched for the join",
          },
          {
            id: 'promql-vector-matching',
            code: "# many-to-one join: attach a per-instance limit\nnode_memory_used_bytes\n  / on (instance) group_left node_memory_total_bytes\n\n# bool turns a comparison into 0/1 instead of filtering\nup == bool 1",
            note: 'group_left / group_right enable many-to-one matches where one side has extra series. The bool modifier makes a comparison return 0 or 1 for every series rather than dropping non-matches.',
            explanation: {
              heading: 'Vector matching modifiers',
              intro: 'When the two sides of an operation do not line up one-to-one, matching modifiers describe how to pair them.',
              points: [
                { term: 'One-to-one default', detail: 'By default each series on the left pairs with exactly one series on the right that shares its labels.' },
                { term: 'group_left', detail: 'group_left allows many series on the left to match a single series on the right.' },
                { term: 'group_right', detail: 'group_right is the mirror case where the many side is on the right.' },
                { term: 'Carrying labels', detail: 'Listing labels after group_left copies extra labels from the one side onto each result.' },
                { term: 'bool modifier', detail: 'The bool keyword makes comparisons return zero or one for every series instead of filtering.' },
              ],
            },
            example: "# Use group_left(label) to carry extra labels from the one side",
          },
          {
            id: 'promql-set-operators',
            code: "# Series present in both\nup and http_requests_total\n\n# Series in the first but not the second\nup unless on (job) maintenance_mode\n\n# Union of two vectors\nup or absent(up)",
            note: 'The set operators and, or, and unless filter one vector by the presence of series in another, matching on labels. They are essential for combining conditions and building fallback expressions.',
            explanation: {
              heading: 'Set operators',
              intro: 'Set operators combine two vectors based on which series exist on each side, matching by label set.',
              points: [
                { term: 'and intersection', detail: 'The and operator keeps left-side series that have a matching series on the right.' },
                { term: 'or union', detail: 'The or operator returns left-side series plus any right-side series that were not matched.' },
                { term: 'unless difference', detail: 'The unless operator keeps left-side series that have no match on the right.' },
                { term: 'Practical use', detail: 'unless is often used to exclude a set, such as removing nodes currently in maintenance.' },
              ],
            },
            example: "# unless subtracts a set, e.g. exclude nodes in maintenance",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'promql-offset',
    title: 'Offset',
    level: 1,
    slug: 'offset',
    concepts: [],
    children: [
      {
        id: 'promql-offset-ops',
        title: 'Time Shifting',
        level: 2,
        slug: 'offset-ops',
        concepts: [
          {
            id: 'promql-offset-basic',
            code: "# Requests now vs one hour ago\nrate(http_requests_total[5m])\n  - rate(http_requests_total[5m] offset 1h)",
            note: 'The offset modifier shifts a query back in time, letting you compare current values against a past window. It applies to the vector immediately before it.',
            explanation: {
              heading: 'Shifting queries back in time',
              intro: 'The offset modifier lets a selector look into the past so you can compare now against then.',
              points: [
                { term: 'Backward shift', detail: 'offset moves the evaluation of a selector back by a fixed duration.' },
                { term: 'Scope', detail: 'It applies only to the vector selector immediately in front of it.' },
                { term: 'Comparison use', detail: 'Subtracting an offset copy from the current value reveals growth or decline over time.' },
                { term: 'Duration syntax', detail: 'The shift accepts the same duration units as range windows, such as one week.' },
              ],
            },
            example: "http_requests_total offset 1w # value one week ago",
          },
          {
            id: 'promql-at-modifier',
            code: "# Pin evaluation to a fixed Unix timestamp\nhttp_requests_total @ 1609459200\n\n# Value at the start of the query range\nhttp_requests_total @ start()",
            note: 'The @ modifier evaluates a selector at an absolute time rather than the query time, useful for anchoring comparisons. start() and end() reference the range boundaries in a range query.',
            explanation: {
              heading: 'The at modifier',
              intro: 'The at modifier pins a selector to a fixed moment instead of moving with the query evaluation time.',
              points: [
                { term: 'Absolute time', detail: 'The at modifier evaluates its selector at a specific Unix timestamp you provide.' },
                { term: 'Anchoring', detail: 'It anchors a value so comparisons reference a stable point rather than a sliding one.' },
                { term: 'start and end', detail: 'The start and end helpers refer to the boundaries of a range query window.' },
                { term: 'Combining', detail: 'The at modifier can be paired with offset for precise historical comparisons.' },
              ],
            },
            example: "# Combine @ and offset for precise historical comparisons",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'promql-subqueries',
    title: 'Subqueries',
    level: 1,
    slug: 'subqueries',
    concepts: [],
    children: [
      {
        id: 'promql-subquery-ops',
        title: 'Range over Range',
        level: 2,
        slug: 'subquery-ops',
        concepts: [
          {
            id: 'promql-subquery-basic',
            code: "# Max 5m rate observed over the last hour\nmax_over_time(\n  rate(http_requests_total[5m])[1h:1m]\n)",
            note: 'A subquery evaluates an instant expression over a range at a fixed step, written [range:step]. It lets you apply range functions to results that are themselves computed over a range.',
            explanation: {
              heading: 'Range over a range',
              intro: 'A subquery runs an instant expression repeatedly across a window, turning its results into a new range vector.',
              points: [
                { term: 'Bracket syntax', detail: 'A subquery is written with a range and a step separated by a colon inside brackets.' },
                { term: 'Repeated evaluation', detail: 'The inner expression is evaluated once per step across the outer range.' },
                { term: 'Enables nesting', detail: 'It lets range functions like max_over_time consume a rate that is itself computed over a range.' },
                { term: 'Step meaning', detail: 'A one-minute step over one hour evaluates the inner expression sixty times.' },
              ],
            },
            example: "# [1h:1m] evaluates the inner rate every minute for an hour",
          },
          {
            id: 'promql-subquery-cost',
            code: "# Expensive: recomputed on every dashboard load\nmax_over_time(rate(http_requests_total[5m])[24h:1m])\n\n# Better: back it with a recording rule\nmax_over_time(job:http_requests:rate5m[24h:1m])",
            note: 'Subqueries are powerful but costly because the inner expression is re-evaluated at every step. For long windows or hot dashboards, precompute the inner rate with a recording rule instead.',
            explanation: {
              heading: 'Subquery cost',
              intro: 'Subqueries are convenient but can be expensive, so it helps to understand where the cost comes from.',
              points: [
                { term: 'Repeated work', detail: 'The inner expression is recomputed at every step, multiplying the query cost.' },
                { term: 'Long windows hurt', detail: 'Wide ranges with small steps generate many evaluations and slow queries down.' },
                { term: 'Recording rule fix', detail: 'Precomputing the inner rate as a recording rule turns the subquery into a cheap lookup.' },
                { term: 'Default step', detail: 'Omitting the step makes it default to the global evaluation interval.' },
              ],
            },
            example: "# Omitting the step defaults to the global evaluation interval",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'promql-recording-rules',
    title: 'Recording Rules',
    level: 1,
    slug: 'recording-rules',
    concepts: [],
    children: [
      {
        id: 'promql-recording-ops',
        title: 'Precomputed Series',
        level: 2,
        slug: 'recording-ops',
        concepts: [
          {
            id: 'promql-recording-basic',
            code: "groups:\n  - name: http\n    rules:\n      - record: job:http_requests:rate5m\n        expr: sum by (job) (rate(http_requests_total[5m]))",
            note: 'A recording rule precomputes an expensive expression on a schedule and stores it as a new time series. Dashboards then query the cheap recorded metric instead of recomputing.',
            explanation: {
              heading: 'Precomputing series',
              intro: 'Recording rules trade a little background work for much faster queries by materializing results ahead of time.',
              points: [
                { term: 'Scheduled evaluation', detail: 'A recording rule runs its expression on a fixed interval defined by its group.' },
                { term: 'Stored output', detail: 'The result is saved as a brand new time series under the record name.' },
                { term: 'Cheap dashboards', detail: 'Dashboards query the stored series instead of recomputing the expensive expression each load.' },
                { term: 'Naming convention', detail: 'Recorded metrics follow a level colon metric colon operation naming pattern.' },
              ],
            },
            example: "# Naming convention: level:metric:operation",
          },
          {
            id: 'promql-recording-chaining',
            code: "groups:\n  - name: rollups\n    interval: 30s\n    rules:\n      - record: instance:cpu:rate5m\n        expr: rate(node_cpu_seconds_total[5m])\n      - record: job:cpu:rate5m\n        expr: sum by (job) (instance:cpu:rate5m)",
            note: 'Rules within a group evaluate in order, so a later rule can reuse the output of an earlier one to build multi-level rollups. Set interval to control how often the group runs.',
            explanation: {
              heading: 'Chaining recording rules',
              intro: 'Because rules in a group run sequentially, you can layer them to build progressively coarser rollups.',
              points: [
                { term: 'Ordered evaluation', detail: 'Rules within a group are evaluated top to bottom in the order they are written.' },
                { term: 'Reusing output', detail: 'A later rule can reference the series produced by an earlier rule in the same group.' },
                { term: 'Multi-level rollups', detail: 'This lets an instance-level rate feed a job-level aggregation without recomputation.' },
                { term: 'Group interval', detail: 'The group interval setting controls how often all its rules run.' },
              ],
            },
            example: "# Ordering matters: the job rollup depends on the instance rule",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'promql-alerting',
    title: 'Alerting Expressions',
    level: 1,
    slug: 'alerting',
    concepts: [],
    children: [
      {
        id: 'promql-alerting-ops',
        title: 'Alert Rules',
        level: 2,
        slug: 'alerting-ops',
        concepts: [
          {
            id: 'promql-alerting-basic',
            code: "- alert: HighErrorRate\n  expr: >\n    sum(rate(http_requests_total{status=~\"5..\"}[5m]))\n      / sum(rate(http_requests_total[5m])) > 0.05\n  for: 10m\n  labels:\n    severity: page",
            note: 'An alerting rule fires when its expression returns any series. for requires the condition to hold continuously before firing, which suppresses brief flapping. Labels route the alert.',
            explanation: {
              heading: 'How alert rules fire',
              intro: 'An alerting rule turns a PromQL expression into notifications, with timing and routing controlled by extra fields.',
              points: [
                { term: 'Firing condition', detail: 'The alert becomes active whenever its expression returns one or more series.' },
                { term: 'for duration', detail: 'The for clause requires the condition to stay true continuously before the alert actually fires.' },
                { term: 'Flapping control', detail: 'Requiring a sustained condition suppresses alerts on brief transient spikes.' },
                { term: 'Routing labels', detail: 'Labels attached to the alert determine how downstream routing and paging handle it.' },
              ],
            },
            example: "# for: 10m avoids alerting on transient spikes",
          },
          {
            id: 'promql-alert-absent',
            code: "- alert: TargetDown\n  expr: absent(up{job=\"api\"} == 1)\n  for: 5m\n  annotations:\n    summary: \"No healthy api targets for {{ $labels.job }}\"",
            note: 'absent() returns a series when its argument has no data, making it the standard way to alert on missing metrics or dead targets. Annotations use {{ $labels.x }} and {{ $value }} templating.',
            explanation: {
              heading: 'Alerting on absence',
              intro: 'Detecting missing data is as important as detecting bad data, and absent is the tool built for that job.',
              points: [
                { term: 'Absent behavior', detail: 'absent returns a result only when its argument produces no matching series.' },
                { term: 'Missing metric alerts', detail: 'It is the standard way to fire when an expected metric or target has gone silent.' },
                { term: 'Label templating', detail: 'Annotations can interpolate label values using the labels templating syntax.' },
                { term: 'Value templating', detail: 'Annotations can also embed the firing value using the value templating variable.' },
              ],
            },
            example: "# absent() is the go-to pattern for detecting silence",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'promql-label-manipulation',
    title: 'Label Manipulation',
    level: 1,
    slug: 'label-manipulation',
    concepts: [],
    children: [
      {
        id: 'promql-label-ops',
        title: 'label_replace and label_join',
        level: 2,
        slug: 'label-ops',
        concepts: [
          {
            id: 'promql-label-basic',
            code: "label_replace(\n  up,\n  \"host\", \"$1\", \"instance\", \"([^:]+):.*\"\n)",
            note: 'label_replace derives a new label from an existing one using a regex capture, useful for reshaping labels for joins or display. label_join concatenates several labels into one.',
            explanation: {
              heading: 'Deriving labels with regex',
              intro: 'label_replace rewrites or creates a label by capturing part of an existing label value.',
              points: [
                { term: 'Regex capture', detail: 'It matches a source label against a regular expression and captures groups from it.' },
                { term: 'New destination', detail: 'The captured value is written into a destination label, which may be new or existing.' },
                { term: 'Reshaping use', detail: 'It is useful for extracting a hostname or reshaping labels so two vectors can join.' },
                { term: 'Related join', detail: 'label_join is the companion that concatenates several labels into one instead.' },
              ],
            },
            example: "# Extracts the hostname portion of instance into a host label",
          },
          {
            id: 'promql-label-join',
            code: "label_join(\n  up,\n  \"target\", \"/\",\n  \"job\", \"instance\"\n)",
            note: 'label_join builds a new label by concatenating one or more source labels with a chosen separator. It is the inverse pattern of label_replace and helps create composite keys for matching.',
            explanation: {
              heading: 'Joining labels together',
              intro: 'label_join composes a new label value by gluing several source labels together with a separator.',
              points: [
                { term: 'Concatenation', detail: 'It joins one or more source label values into a single destination label.' },
                { term: 'Chosen separator', detail: 'A separator string of your choice is inserted between each joined value.' },
                { term: 'Composite keys', detail: 'The combined label can act as a composite key for matching series across vectors.' },
                { term: 'Inverse of replace', detail: 'It complements label_replace, which splits values apart rather than combining them.' },
              ],
            },
            example: "# Produces target=\"api/10.0.0.1:9090\" from job and instance",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'promql-counters-gauges',
    title: 'Counters vs Gauges',
    level: 1,
    slug: 'counters-gauges',
    concepts: [],
    children: [
      {
        id: 'promql-metric-types',
        title: 'Metric Types',
        level: 2,
        slug: 'metric-types',
        concepts: [
          {
            id: 'promql-metric-basic',
            code: "# Counter: only goes up; use rate/increase\nrate(http_requests_total[5m])\n\n# Gauge: goes up and down; use the value directly\nnode_memory_free_bytes",
            note: 'A counter monotonically increases and resets to zero on restart, so query it with rate or increase. A gauge can rise and fall and is read directly or with avg_over_time.',
            explanation: {
              heading: 'Counters versus gauges',
              intro: 'The two most common metric types behave differently, and each demands a different querying approach.',
              points: [
                { term: 'Counter behavior', detail: 'A counter only increases and drops back to zero when its process restarts.' },
                { term: 'Querying counters', detail: 'Counters are almost always queried through rate or increase rather than read raw.' },
                { term: 'Gauge behavior', detail: 'A gauge can move up or down freely to represent a current measurement.' },
                { term: 'Querying gauges', detail: 'Gauges are read directly or smoothed with functions like avg_over_time.' },
              ],
            },
            example: "avg_over_time(node_memory_free_bytes[5m]) # smooth a gauge",
          },
          {
            id: 'promql-summary-histogram',
            code: "# Histogram: cumulative buckets by le\nhistogram_quantile(0.99,\n  rate(request_duration_seconds_bucket[5m]))\n\n# Summary: precomputed quantiles from the client\nrequest_duration_seconds{quantile=\"0.99\"}",
            note: 'Histograms expose _bucket, _sum, and _count series and let you compute quantiles server-side and aggregate them. Summaries expose client-computed quantiles that cannot be aggregated across instances.',
            explanation: {
              heading: 'Histograms versus summaries',
              intro: 'Both metric types capture distributions, but they differ sharply in where quantiles are computed.',
              points: [
                { term: 'Histogram series', detail: 'A histogram exposes bucket, sum, and count series describing the distribution.' },
                { term: 'Server-side quantiles', detail: 'Histogram buckets let you compute and aggregate quantiles on the query side.' },
                { term: 'Summary quantiles', detail: 'A summary exposes quantiles precomputed by the client at collection time.' },
                { term: 'Aggregation limit', detail: 'Summary quantiles cannot be meaningfully combined across instances, unlike histogram buckets.' },
              ],
            },
            example: "# Prefer histograms when you need to combine quantiles across pods",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'promql-topk',
    title: 'topk and bottomk',
    level: 1,
    slug: 'topk',
    concepts: [],
    children: [
      {
        id: 'promql-topk-ops',
        title: 'Selecting Extremes',
        level: 2,
        slug: 'topk-ops',
        concepts: [
          {
            id: 'promql-topk-basic',
            code: "# Top 5 pods by memory\ntopk(5, container_memory_usage_bytes{namespace=\"prod\"})\n\n# Bottom 3 targets by scrape duration\nbottomk(3, scrape_duration_seconds)",
            note: 'topk returns the k series with the largest values and bottomk the smallest, preserving their labels. They are handy for surfacing the heaviest consumers in a dashboard.',
            explanation: {
              heading: 'Selecting extremes',
              intro: 'topk and bottomk trim a large result down to just the highest or lowest ranked series.',
              points: [
                { term: 'topk largest', detail: 'topk keeps the k series with the greatest values from the input.' },
                { term: 'bottomk smallest', detail: 'bottomk keeps the k series with the smallest values from the input.' },
                { term: 'Labels preserved', detail: 'Both functions keep the full label set of each selected series.' },
                { term: 'Not a total', detail: 'Unlike sum, they return individual series rather than collapsing to a single number.' },
              ],
            },
            example: "# Unlike sum, topk keeps individual series, not a total",
          },
          {
            id: 'promql-topk-grouped',
            code: "# Top 3 endpoints per service\ntopk(3, sum by (service, endpoint) (rate(http_requests_total[5m])))\n\n# sort the whole result descending\nsort_desc(sum by (job) (up))",
            note: 'topk operates over the entire result set, so pre-aggregate by the grouping labels to get top-N per group. sort and sort_desc order series for display without limiting how many are returned.',
            explanation: {
              heading: 'Grouped extremes and sorting',
              intro: 'Getting a top-N per group requires shaping the data first, since topk itself has no grouping clause.',
              points: [
                { term: 'Global scope', detail: 'topk ranks across the entire result set rather than within groups.' },
                { term: 'Pre-aggregate', detail: 'Aggregate by the grouping labels first so each group is reduced before ranking.' },
                { term: 'sort ordering', detail: 'sort arranges series in ascending order for display without dropping any.' },
                { term: 'sort_desc ordering', detail: 'sort_desc arranges series in descending order while keeping the full result set.' },
              ],
            },
            example: "# topk does not group; aggregate first to get per-group extremes",
          },
        ],
        children: [],
      },
    ],
  },
];

export default topics;
