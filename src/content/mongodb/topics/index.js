// MongoDB (MQL) topic tree.

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  {
    id: 'mongo-crud',
    title: 'CRUD Operations',
    level: 1,
    slug: 'crud',
    concepts: [],
    children: [
      {
        id: 'mongo-insert',
        title: 'Inserting Documents',
        level: 2,
        slug: 'insert',
        concepts: [
          {
            id: 'mongo-insert-one',
            code: "db.users.insertOne({\n  name: 'Alice',\n  email: 'alice@example.com',\n  age: 30,\n  createdAt: new Date()\n});",
            note: 'insertOne adds a single document and returns the generated _id. If you omit _id, MongoDB creates an ObjectId automatically.',
            explanation: {
              heading: 'Inserting a Single Document',
              intro: 'insertOne writes exactly one document into a collection and hands back the identifier it was stored under, creating the collection on first use if it does not yet exist.',
              points: [
                { term: 'Automatic _id', detail: 'When you leave out _id, the server assigns a unique 12-byte ObjectId that encodes a timestamp, so inserts are roughly ordered by creation time.' },
                { term: 'Acknowledged result', detail: 'The return value contains acknowledged:true and insertedId, letting you capture the new key without a follow-up query.' },
                { term: 'Schemaless by default', detail: 'Documents in the same collection can have different fields, so insertOne does not require a predefined schema unless validation is configured.' },
                { term: 'Duplicate keys fail', detail: 'If you supply an _id that already exists, the insert is rejected with a duplicate key error rather than overwriting the existing document.' },
              ],
            },
            example: "// Returns: { acknowledged: true, insertedId: ObjectId('...') }",
          },
          {
            id: 'mongo-insert-many',
            code: "db.users.insertMany([\n  { name: 'Bob', age: 25 },\n  { name: 'Carol', age: 41 }\n], { ordered: false });",
            note: 'insertMany writes an array of documents. With ordered:false, remaining inserts continue even if one fails, which improves throughput on bulk loads.',
            explanation: {
              heading: 'Inserting Many Documents at Once',
              intro: 'insertMany sends an array of documents to the server in a single command, which is far more efficient than calling insertOne in a loop.',
              points: [
                { term: 'Ordered by default', detail: 'Without options the insert runs ordered, so it stops at the first error and skips the remaining documents in the array.' },
                { term: 'Unordered continues', detail: 'Passing ordered:false tells the server to attempt every document and report all failures together, which raises throughput on bulk loads.' },
                { term: 'insertedIds map', detail: 'The result returns insertedIds as an object keyed by the position of each document in the input array.' },
                { term: 'Batch size limits', detail: 'Very large arrays are split into batches under the hood, and the whole command is capped by the maximum BSON message size.' },
              ],
            },
            example: "// insertedIds is an object keyed by array index",
          },
        ],
        children: [],
      },
      {
        id: 'mongo-read',
        title: 'Reading Documents',
        level: 2,
        slug: 'read',
        concepts: [
          {
            id: 'mongo-find',
            code: "db.users.find({ status: 'active' });\ndb.users.findOne({ email: 'alice@example.com' });",
            note: 'find returns a cursor over all matching documents; findOne returns just the first match or null. An empty filter {} matches every document.',
            explanation: {
              heading: 'Finding Documents',
              intro: 'find and findOne are the primary read operations, differing in whether they return a stream of results or a single document.',
              points: [
                { term: 'Cursor vs document', detail: 'find returns a cursor you iterate to pull matches in batches, while findOne returns one document object or null when nothing matches.' },
                { term: 'Empty filter matches all', detail: 'An empty filter {} selects every document in the collection, which is the idiomatic way to scan or count everything.' },
                { term: 'Filter is an implicit AND', detail: 'Multiple fields in the filter must all match, and each field can use query operators for richer conditions.' },
                { term: 'Order is not guaranteed', detail: 'Without an explicit sort the result order is undefined, so add sort when you rely on ordering.' },
              ],
            },
            example: "db.users.find({}).count(); // total documents",
          },
          {
            id: 'mongo-count-distinct',
            code: "db.users.countDocuments({ status: 'active' });\ndb.users.estimatedDocumentCount();\ndb.users.distinct('country', { status: 'active' });",
            note: 'countDocuments runs an accurate count honoring the filter, while estimatedDocumentCount reads collection metadata for a fast, unfiltered approximation. distinct returns the unique values of a field.',
            explanation: {
              heading: 'Counting and Distinct Values',
              intro: 'MongoDB offers three related read helpers for tallying documents and extracting unique field values, each with different accuracy and cost tradeoffs.',
              points: [
                { term: 'Accurate counts', detail: 'countDocuments applies your filter and scans matching documents, giving an exact total that always respects the current data.' },
                { term: 'Fast estimates', detail: 'estimatedDocumentCount reads cached collection metadata and ignores any filter, so it is very fast but may lag reality after crashes.' },
                { term: 'Unique values', detail: 'distinct returns an array of the unique values for one field, optionally narrowed by a filter.' },
                { term: 'Index awareness', detail: 'A count or distinct that matches an index can be answered without touching full documents, which greatly reduces work on large collections.' },
              ],
            },
            example: "// distinct returns an array like [ 'US', 'CA', 'GB' ]",
          },
          {
            id: 'mongo-cursor-iterate',
            code: "const cursor = db.users.find({ age: { $gte: 18 } });\nwhile (cursor.hasNext()) {\n  printjson(cursor.next());\n}\ncursor.forEach(doc => print(doc.name));",
            note: 'A find call returns a lazy cursor that fetches documents in batches rather than all at once. Iterate it with hasNext/next or forEach; the cursor is exhausted after a full pass.',
            explanation: {
              heading: 'Iterating a Cursor',
              intro: 'A cursor is a lazy pointer into the result set that pulls documents from the server in batches as you consume them, keeping memory use low.',
              points: [
                { term: 'Lazy batching', detail: 'The server returns a first batch and fetches more only as you iterate, so a large result set does not load entirely into memory at once.' },
                { term: 'Single pass', detail: 'A cursor is consumed as you read it, so once you reach the end with next or forEach it is exhausted and cannot be reused.' },
                { term: 'Materialize with toArray', detail: 'Calling toArray pulls every remaining document into an in-memory array, which is convenient but defeats the memory benefit of batching.' },
                { term: 'Cursor timeout', detail: 'An idle cursor is closed by the server after a timeout, so long gaps between iterations can invalidate it unless noCursorTimeout is set.' },
              ],
            },
            example: "db.users.find().toArray(); // materialize all into memory",
          },
        ],
        children: [],
      },
      {
        id: 'mongo-write',
        title: 'Updating and Deleting',
        level: 2,
        slug: 'write',
        concepts: [
          {
            id: 'mongo-update-one',
            code: "db.users.updateOne(\n  { _id: ObjectId('...') },\n  { $set: { status: 'active' } }\n);",
            note: 'updateOne modifies the first matching document. updateMany applies to all matches. Always use update operators like $set rather than passing a raw replacement object.',
            explanation: {
              heading: 'Updating Documents',
              intro: 'updateOne and updateMany change existing documents in place using update operators that describe exactly which fields to modify.',
              points: [
                { term: 'One vs many', detail: 'updateOne touches only the first matching document, while updateMany applies the same change to every match.' },
                { term: 'Use operators', detail: 'Update operators like $set change only the named fields, whereas passing a plain object would replace the entire document and drop everything else.' },
                { term: 'Result counts', detail: 'The result reports matchedCount and modifiedCount, so you can tell whether documents were found and whether their values actually changed.' },
                { term: 'Field-level atomicity', detail: 'Each single-document update is atomic, so concurrent writers never see a half-applied change to one document.' },
              ],
            },
            example: "db.users.replaceOne({ _id: id }, wholeNewDoc); // full replace",
          },
          {
            id: 'mongo-delete-one',
            code: "db.users.deleteOne({ status: 'banned' });\ndb.users.deleteMany({ lastLogin: { $lt: cutoff } });",
            note: 'deleteOne removes the first match; deleteMany removes all matches. Both return a deletedCount so you can confirm how many documents were affected.',
            explanation: {
              heading: 'Deleting Documents',
              intro: 'deleteOne and deleteMany permanently remove documents that match a filter and report how many were removed.',
              points: [
                { term: 'One vs many', detail: 'deleteOne removes only the first matching document, while deleteMany removes every document the filter selects.' },
                { term: 'Confirm with deletedCount', detail: 'Both return deletedCount so you can verify the operation removed the number of documents you expected.' },
                { term: 'Empty filter is dangerous', detail: 'deleteMany with an empty filter {} removes every document in the collection, so always double check the filter before running it.' },
                { term: 'No implicit undo', detail: 'Deletes are not reversible on their own, so rely on backups or soft-delete flags when data must be recoverable.' },
              ],
            },
            example: "// { acknowledged: true, deletedCount: 1 }",
          },
        ],
        children: [],
      },
      {
        id: 'mongo-find-and-modify',
        title: 'Atomic Find-and-Modify',
        level: 2,
        slug: 'find-and-modify',
        concepts: [
          {
            id: 'mongo-find-one-and-update',
            code: "db.counters.findOneAndUpdate(\n  { _id: 'orderId' },\n  { $inc: { seq: 1 } },\n  { returnDocument: 'after' }\n);",
            note: 'findOneAndUpdate atomically updates a single document and returns it in one round trip. Use returnDocument:"after" to get the modified version, which is ideal for atomic counters and work queues.',
            explanation: {
              heading: 'Atomic Update and Return',
              intro: 'findOneAndUpdate combines a modify and a read into one atomic step, so no other operation can slip in between the change and the value you read back.',
              points: [
                { term: 'Single round trip', detail: 'The document is updated and returned together, saving an extra query and avoiding a race between reading and writing.' },
                { term: 'Before or after', detail: 'returnDocument controls whether you receive the document as it was before the update or after it, with after being typical for counters.' },
                { term: 'Ideal for counters', detail: 'Pairing it with $inc gives a safe sequence generator, since each caller gets a unique incremented value.' },
                { term: 'Sort picks the target', detail: 'When several documents match, a sort option decides which single document is updated and returned.' },
              ],
            },
            example: "// Returns the document with seq already incremented",
          },
          {
            id: 'mongo-upsert',
            code: "db.profiles.updateOne(\n  { userId: 42 },\n  { $set: { lastSeen: new Date() }, $setOnInsert: { created: new Date() } },\n  { upsert: true }\n);",
            note: 'With upsert:true an update inserts a new document when no match is found, using the filter fields plus the update as the seed. $setOnInsert applies fields only on the insert path, not on updates.',
            explanation: {
              heading: 'Upserts',
              intro: 'An upsert turns an update into insert-or-update logic, creating a document when the filter matches nothing and modifying it otherwise.',
              points: [
                { term: 'Seeded from filter', detail: 'When inserting, the new document combines the equality fields from the filter with the fields set by the update operators.' },
                { term: 'Insert-only fields', detail: '$setOnInsert applies its fields only when a new document is created, which is perfect for stamping a created date once.' },
                { term: 'Detect the insert', detail: 'The result populates upsertedId only when a new document was created, so you can tell inserts from updates.' },
                { term: 'Concurrency needs a unique index', detail: 'Two simultaneous upserts can both try to insert, so a unique index on the filter fields prevents duplicates.' },
              ],
            },
            example: "// upsertedId is populated only when a new doc was created",
          },
          {
            id: 'mongo-find-one-and-delete',
            code: "db.tasks.findOneAndDelete(\n  { status: 'queued' },\n  { sort: { priority: -1 } }\n);",
            note: 'findOneAndDelete atomically removes one document and returns it, honoring the sort to pick which match wins. This is a common pattern for pulling the highest-priority item off a queue safely.',
            explanation: {
              heading: 'Atomic Delete and Return',
              intro: 'findOneAndDelete removes a single document and hands it back in the same atomic operation, ensuring no two workers can claim the same item.',
              points: [
                { term: 'Claim safely', detail: 'Because the delete and read are atomic, competing consumers each receive a different document, which is the core of a safe work queue.' },
                { term: 'Sort selects the winner', detail: 'A sort option chooses which matching document is removed, letting you pull the highest priority or oldest item first.' },
                { term: 'Returns the removed doc', detail: 'You get the full document that was deleted, or null when the filter matched nothing.' },
                { term: 'One at a time', detail: 'It always affects exactly one document, so batch draining requires calling it repeatedly rather than deleting many at once.' },
              ],
            },
            example: "// Returns the deleted document, or null if none matched",
          },
        ],
        children: [],
      },
      {
        id: 'mongo-bulk-write',
        title: 'Bulk Writes',
        level: 2,
        slug: 'bulk-write',
        concepts: [
          {
            id: 'mongo-bulk-write-ops',
            code: "db.inventory.bulkWrite([\n  { insertOne: { document: { sku: 'A1', qty: 5 } } },\n  { updateOne: { filter: { sku: 'B2' }, update: { $inc: { qty: -1 } } } },\n  { deleteOne: { filter: { sku: 'C3' } } }\n], { ordered: true });",
            note: 'bulkWrite batches inserts, updates, and deletes into a single server round trip, which is far faster than issuing them one at a time. The result reports counts per operation type.',
            explanation: {
              heading: 'Mixed Bulk Writes',
              intro: 'bulkWrite groups a mix of insert, update, replace, and delete operations into one command, cutting network overhead dramatically.',
              points: [
                { term: 'Mixed operations', detail: 'A single call can combine insertOne, updateOne, updateMany, replaceOne, deleteOne, and deleteMany entries in one array.' },
                { term: 'Per-type counts', detail: 'The result breaks down insertedCount, modifiedCount, deletedCount, and upsertedCount so you can audit what happened.' },
                { term: 'Fewer round trips', detail: 'Batching many writes into one request avoids the per-command latency you would pay issuing each write separately.' },
                { term: 'Not a transaction', detail: 'By default the operations are not atomic together, so a failure partway leaves earlier writes applied unless wrapped in a transaction.' },
              ],
            },
            example: "// { insertedCount: 1, modifiedCount: 1, deletedCount: 1 }",
          },
          {
            id: 'mongo-bulk-ordered',
            code: "// ordered: stops at the first error\ndb.logs.bulkWrite(ops, { ordered: true });\n// unordered: attempts every op, reports all errors\ndb.logs.bulkWrite(ops, { ordered: false });",
            note: 'An ordered bulk write executes operations in sequence and halts on the first failure, while an unordered write attempts them all and may run in parallel. Unordered maximizes throughput when operations are independent.',
            explanation: {
              heading: 'Ordered vs Unordered Bulk',
              intro: 'The ordered option controls whether a bulk write stops at the first error or pushes through every operation regardless of failures.',
              points: [
                { term: 'Ordered stops early', detail: 'With ordered:true operations run in the given sequence and the batch aborts at the first error, leaving later operations unapplied.' },
                { term: 'Unordered continues', detail: 'With ordered:false the server attempts every operation, may execute them in parallel, and reports all errors at the end.' },
                { term: 'Throughput tradeoff', detail: 'Unordered is faster for independent operations, while ordered is safer when a later write depends on an earlier one succeeding.' },
                { term: 'Collect the failures', detail: 'Failures are gathered in the writeErrors array of the result, so you can inspect which operations did not apply.' },
              ],
            },
            example: "// Unordered collects failures in result.writeErrors",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'mongo-query-operators',
    title: 'Query Operators',
    level: 1,
    slug: 'query-operators',
    concepts: [],
    children: [
      {
        id: 'mongo-comparison',
        title: 'Comparison and Set Operators',
        level: 2,
        slug: 'comparison',
        concepts: [
          {
            id: 'mongo-comparison-ops',
            code: "db.products.find({\n  price: { $gte: 10, $lte: 100 },\n  category: { $in: ['books', 'toys'] },\n  status: { $ne: 'discontinued' }\n});",
            note: 'Comparison operators include $gt, $gte, $lt, $lte, $eq, $ne. Set operators $in and $nin match against a list of values.',
            explanation: {
              heading: 'Comparison and Set Operators',
              intro: 'Comparison operators express range and equality conditions, while set operators match a field against a list of candidate values.',
              points: [
                { term: 'Range operators', detail: '$gt, $gte, $lt, and $lte build open or closed ranges, and combining $gte with $lt on one field selects a half-open interval.' },
                { term: 'Equality and inequality', detail: '$eq matches an exact value and $ne matches anything except it, though $ne can prevent index use because it must scan non-matches.' },
                { term: 'Membership with $in', detail: '$in matches when the field equals any value in the list, which is cleaner than chaining many $or conditions.' },
                { term: 'Array fields', detail: 'On an array field these operators match if any element satisfies the condition, so $in on tags matches documents sharing any listed tag.' },
              ],
            },
            example: "db.products.find({ tags: { $nin: ['clearance'] } });",
          },
          {
            id: 'mongo-comparison-dates',
            code: "db.orders.find({\n  createdAt: {\n    $gte: ISODate('2024-01-01'),\n    $lt: ISODate('2024-02-01')\n  }\n});",
            note: 'The same comparison operators work on dates, which sort chronologically. A half-open range ($gte start, $lt end) is the clean way to select a full month without off-by-one boundary issues.',
            explanation: {
              heading: 'Querying Date Ranges',
              intro: 'Dates are stored as BSON Date values that compare and sort chronologically, so the ordinary comparison operators work directly on them.',
              points: [
                { term: 'Half-open ranges', detail: 'Using $gte on the start and $lt on the next boundary cleanly captures a whole period without double counting the edge.' },
                { term: 'Avoid boundary bugs', detail: 'Pairing $gte with $lt sidesteps the off-by-one issues that arise when both ends are inclusive around midnight.' },
                { term: 'Store as Date', detail: 'Keeping timestamps as real Date values rather than strings ensures comparisons follow chronological order instead of lexicographic order.' },
                { term: 'UTC storage', detail: 'MongoDB stores dates in UTC, so apply time-zone conversion in your application or aggregation when local boundaries matter.' },
              ],
            },
            example: "// Matches all of January 2024",
          },
        ],
        children: [],
      },
      {
        id: 'mongo-logical',
        title: 'Logical and Element Operators',
        level: 2,
        slug: 'logical',
        concepts: [
          {
            id: 'mongo-logical-ops',
            code: "db.users.find({\n  $or: [\n    { age: { $lt: 18 } },\n    { age: { $gt: 65 } }\n  ],\n  email: { $exists: true }\n});",
            note: '$or, $and, $nor combine conditions. $exists tests for field presence and $type checks BSON types. Top-level fields are implicitly ANDed.',
            explanation: {
              heading: 'Logical and Element Operators',
              intro: 'Logical operators join several conditions into one filter, while element operators test whether a field exists and what type it holds.',
              points: [
                { term: 'Implicit AND', detail: 'Listing multiple fields at the top level requires all of them to match, so $and is only needed when combining conditions on the same field.' },
                { term: 'Alternatives with $or', detail: '$or matches when any of its clauses match, and it can use indexes on each clause when they exist.' },
                { term: 'Presence with $exists', detail: '$exists:true matches documents that have the field at all, while $exists:false matches documents missing it, regardless of value.' },
                { term: 'Type checks', detail: '$type matches by BSON type such as string or int, which is useful in mixed collections where a field holds different types.' },
              ],
            },
            example: "db.users.find({ phone: { $exists: false } });",
          },
          {
            id: 'mongo-expr-mod',
            code: "db.orders.find({\n  $expr: { $gt: ['$spent', '$budget'] }\n});\n\ndb.numbers.find({ value: { $mod: [4, 0] } });",
            note: '$expr lets a query compare two fields of the same document using aggregation expressions, which a plain filter cannot do. $mod matches when a field divided by the divisor leaves the given remainder.',
            explanation: {
              heading: 'Expression and Modulo Matching',
              intro: '$expr brings the power of aggregation expressions into find, and $mod filters numbers by their remainder after division.',
              points: [
                { term: 'Field to field', detail: '$expr can compare two fields of the same document, such as spent greater than budget, which a plain filter cannot express.' },
                { term: 'Aggregation power', detail: 'Inside $expr you can use operators like $gt, $add, and $cond to build computed conditions right in the query.' },
                { term: 'Index limitations', detail: '$expr often cannot use indexes as effectively as plain field conditions, so pair it with selective indexed filters when possible.' },
                { term: 'Modulo matching', detail: '$mod takes a divisor and remainder, so [4, 0] matches values evenly divisible by four, handy for sampling or bucketing by id.' },
              ],
            },
            example: "// $mod: [4, 0] matches multiples of 4",
          },
        ],
        children: [],
      },
      {
        id: 'mongo-regex',
        title: 'Pattern Matching with $regex',
        level: 2,
        slug: 'regex',
        concepts: [
          {
            id: 'mongo-regex-basic',
            code: "db.users.find({ name: { $regex: '^A', $options: 'i' } });\ndb.users.find({ email: /@example\\.com$/ });",
            note: '$regex matches string fields against a regular expression, with $options like "i" for case-insensitive. You can also pass a native /pattern/ literal directly as the field value.',
            explanation: {
              heading: 'Basic Pattern Matching',
              intro: '$regex filters string fields using regular expressions, supporting both an operator form and a native pattern literal.',
              points: [
                { term: 'Two ways to write it', detail: 'You can use { field: { $regex: pattern, $options: flags } } or pass a native /pattern/flags literal directly as the field value.' },
                { term: 'Case-insensitive flag', detail: 'The i option ignores letter case, so a search for a name matches regardless of how it was capitalized.' },
                { term: 'Anchors matter', detail: 'A leading ^ anchors to the start of the string, which is important for both correctness and index usage.' },
                { term: 'Escape special chars', detail: 'Characters like a dot are regex metacharacters, so escape them when you want a literal match rather than any character.' },
              ],
            },
            example: "// ^A with 'i' matches names starting with A or a",
          },
          {
            id: 'mongo-regex-anchored',
            code: "// Anchored prefix can use an index:\ndb.products.find({ sku: { $regex: '^ABC' } });\n// Unanchored or case-insensitive usually cannot:\ndb.products.find({ sku: { $regex: 'ABC', $options: 'i' } });",
            note: 'A left-anchored, case-sensitive regex on an indexed field can use that index efficiently. Leading wildcards or case-insensitive flags force a full scan, so prefer a text index for open-ended search.',
            explanation: {
              heading: 'Anchored Regex and Indexes',
              intro: 'Whether a regular expression can use an index depends heavily on anchoring and case sensitivity, which drives its performance.',
              points: [
                { term: 'Anchored prefixes use indexes', detail: 'A pattern anchored with ^ and without the case-insensitive flag can seek directly into an index like a prefix range scan.' },
                { term: 'Wildcards force scans', detail: 'A pattern without a leading anchor must examine every value, turning the query into a slow full collection scan.' },
                { term: 'Case-insensitive is costly', detail: 'The i flag generally prevents index use because the stored order is case-sensitive, so it also triggers a scan.' },
                { term: 'Prefer text or search indexes', detail: 'For open-ended or fuzzy matching, a text index or Atlas Search is far more efficient than a broad regex.' },
              ],
            },
            example: "// Prefer anchored ^ patterns for indexed lookups",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'mongo-projection',
    title: 'Projection',
    level: 1,
    slug: 'projection',
    concepts: [],
    children: [
      {
        id: 'mongo-field-projection',
        title: 'Selecting Fields',
        level: 2,
        slug: 'fields',
        concepts: [
          {
            id: 'mongo-projection-basic',
            code: "db.users.find(\n  { status: 'active' },\n  { name: 1, email: 1, _id: 0 }\n);",
            note: 'The second argument to find controls which fields return. Use 1 to include and 0 to exclude. You cannot mix include and exclude except to suppress _id.',
            explanation: {
              heading: 'Selecting Fields with Projection',
              intro: 'A projection is the second argument to find that limits which fields each returned document carries, trimming network and memory cost.',
              points: [
                { term: 'Include or exclude', detail: 'Set a field to 1 to keep it or 0 to drop it, choosing one mode for the whole projection.' },
                { term: 'No mixing', detail: 'You cannot combine inclusion and exclusion in the same projection, except that you may always exclude _id alongside included fields.' },
                { term: 'Default _id', detail: 'The _id field is returned by default, so add _id:0 explicitly when you do not want it.' },
                { term: 'Covered queries', detail: 'When a query and its projection are fully served by an index, MongoDB can answer it without reading the documents at all.' },
              ],
            },
            example: "db.users.find({}, { password: 0 }); // exclude one field",
          },
          {
            id: 'mongo-projection-array',
            code: "db.posts.find(\n  { author: 'Alice' },\n  { comments: { $slice: 3 }, title: 1 }\n);",
            note: '$slice limits how many array elements are returned. $elemMatch and positional $ project only matching array entries, reducing payload size.',
            explanation: {
              heading: 'Projecting Array Fields',
              intro: 'Array projection operators return only part of an array field so responses stay small when documents hold long lists.',
              points: [
                { term: 'Limit with $slice', detail: '$slice returns the first or last N elements, and the two-element form skips then takes a count for simple pagination inside an array.' },
                { term: 'Match one element', detail: 'The positional $ projects only the first array element that matched the query filter, rather than the whole array.' },
                { term: 'Filter with $elemMatch', detail: 'In a projection, $elemMatch returns only the first element that satisfies its own condition, which can differ from the query filter.' },
                { term: 'Smaller payloads', detail: 'Returning a handful of elements instead of an entire array reduces network transfer and client memory for large arrays.' },
              ],
            },
            example: "{ comments: { $slice: [10, 5] } } // skip 10, take 5",
          },
          {
            id: 'mongo-projection-computed',
            code: "db.orders.find(\n  {},\n  {\n    item: 1,\n    total: { $multiply: ['$price', '$qty'] },\n    _id: 0\n  }\n);",
            note: 'Aggregation-expression projection can compute new fields inline within find, such as multiplying two stored fields. This produces derived values without a separate aggregation pipeline.',
            explanation: {
              heading: 'Computed Projection Fields',
              intro: 'A projection can hold aggregation expressions that build brand new fields from existing ones, all within a single find call.',
              points: [
                { term: 'Derive on read', detail: 'Expressions like $multiply combine stored fields into a computed value returned only in the result, without changing the document.' },
                { term: 'No extra pipeline', detail: 'For simple derived values you can compute inline rather than switching to a full aggregate call.' },
                { term: 'Reference fields with $', detail: 'Inside expressions you refer to a stored field by prefixing its name with a dollar sign, such as $price.' },
                { term: 'Computed on the server', detail: 'The calculation happens on the server before sending results, so clients receive the finished value directly.' },
              ],
            },
            example: "// Each result gains a computed total field",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'mongo-sort-limit',
    title: 'Sorting and Pagination',
    level: 1,
    slug: 'sort-limit',
    concepts: [],
    children: [
      {
        id: 'mongo-cursor-modifiers',
        title: 'Cursor Modifiers',
        level: 2,
        slug: 'cursor',
        concepts: [
          {
            id: 'mongo-sort-skip-limit',
            code: "db.products.find({ inStock: true })\n  .sort({ price: -1, name: 1 })\n  .skip(20)\n  .limit(10);",
            note: 'sort orders results (1 ascending, -1 descending). skip and limit implement pagination, but deep skips are slow — prefer range-based pagination on an indexed field.',
            explanation: {
              heading: 'Sort, Skip, and Limit',
              intro: 'These cursor modifiers order the result set and carve out a page of documents from it.',
              points: [
                { term: 'Sort direction', detail: 'Use 1 for ascending and -1 for descending, and list multiple fields to break ties in a defined order.' },
                { term: 'Index-backed sorts', detail: 'A sort that matches an index avoids an in-memory sort, which otherwise has a memory cap that can fail on large result sets.' },
                { term: 'Pagination pair', detail: 'skip discards the first N matches and limit caps how many are returned, together forming classic page-number pagination.' },
                { term: 'Deep skip is slow', detail: 'skip still walks and throws away all skipped documents, so pages deep into the data get progressively slower.' },
              ],
            },
            example: "// Page 3 with page size 10: skip(20).limit(10)",
          },
          {
            id: 'mongo-range-pagination',
            code: "// Instead of skip, page by the last seen _id\ndb.products.find({ _id: { $gt: lastId } })\n  .sort({ _id: 1 })\n  .limit(10);",
            note: 'Range-based (keyset) pagination remembers the last returned key and asks for values after it, staying fast at any depth. Unlike skip, it does not re-scan and discard earlier documents on each page.',
            explanation: {
              heading: 'Range-Based Pagination',
              intro: 'Keyset pagination pages by remembering the last key seen and querying for records after it, keeping every page fast no matter how deep.',
              points: [
                { term: 'Seek not skip', detail: 'It filters with a condition like _id greater than the last id, so the index seeks straight to the next page instead of counting past earlier rows.' },
                { term: 'Constant speed', detail: 'Because nothing is scanned and discarded, page one thousand is as fast as page one.' },
                { term: 'Needs a sortable key', detail: 'It requires a unique, ordered field such as _id so there is a stable boundary between pages.' },
                { term: 'No jumping', detail: 'The tradeoff is you can only move forward or backward relative to a known key, not jump directly to an arbitrary page number.' },
              ],
            },
            example: "// lastId is the _id of the final row on the previous page",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'mongo-update-operators',
    title: 'Update Operators',
    level: 1,
    slug: 'update-operators',
    concepts: [],
    children: [
      {
        id: 'mongo-field-updates',
        title: 'Field and Numeric Updates',
        level: 2,
        slug: 'field-updates',
        concepts: [
          {
            id: 'mongo-set-inc',
            code: "db.products.updateOne(\n  { _id: id },\n  {\n    $set: { onSale: true },\n    $inc: { viewCount: 1 },\n    $unset: { legacyField: '' }\n  }\n);",
            note: '$set assigns fields, $inc increments numbers, $mul multiplies, $unset removes fields, and $rename changes field names. $min and $max update only if the new value beats the current one.',
            explanation: {
              heading: 'Field and Numeric Update Operators',
              intro: 'Field update operators change specific parts of a document without rewriting the whole thing, each expressing a precise intent.',
              points: [
                { term: 'Assign and remove', detail: '$set writes a field value, creating it if absent, while $unset removes a field entirely from the document.' },
                { term: 'Numeric math', detail: '$inc adds a value, using a negative number to decrement, and $mul multiplies the current value in place.' },
                { term: 'Rename fields', detail: '$rename moves a value from one field name to another, useful during gradual schema migrations.' },
                { term: 'Conditional min and max', detail: '$min updates only when the new value is smaller and $max only when it is larger, tracking running extremes safely.' },
              ],
            },
            example: "{ $inc: { stock: -1 } } // decrement",
          },
          {
            id: 'mongo-current-date',
            code: "db.sessions.updateOne(\n  { _id: id },\n  {\n    $currentDate: { lastModified: true },\n    $min: { lowPrice: 9.99 },\n    $max: { highPrice: 19.99 }\n  }\n);",
            note: '$currentDate stamps a field with the server time, avoiding clock differences between clients. $min and $max conditionally lower or raise a field, useful for tracking running extremes.',
            explanation: {
              heading: 'Timestamps and Conditional Extremes',
              intro: 'These operators stamp server time and adjust fields only when a new value moves the recorded extreme.',
              points: [
                { term: 'Server-side time', detail: '$currentDate uses the server clock, so timestamps stay consistent even when clients disagree on the time.' },
                { term: 'Date or timestamp', detail: 'By default $currentDate writes a Date, but you can request a BSON timestamp type when you need one for replication-style ordering.' },
                { term: 'Lower with $min', detail: '$min replaces the field only if the supplied value is smaller than the stored one, ideal for tracking a lowest-seen value.' },
                { term: 'Raise with $max', detail: '$max replaces the field only if the supplied value is larger, keeping a running maximum without a read-modify-write cycle.' },
              ],
            },
            example: "// $currentDate: { ts: { $type: 'timestamp' } } for a BSON timestamp",
          },
        ],
        children: [],
      },
      {
        id: 'mongo-array-updates',
        title: 'Array Update Operators',
        level: 2,
        slug: 'array-updates',
        concepts: [
          {
            id: 'mongo-push-pull',
            code: "db.users.updateOne(\n  { _id: id },\n  {\n    $push: { tags: { $each: ['new', 'featured'] } },\n    $addToSet: { roles: 'editor' },\n    $pull: { tags: 'stale' }\n  }\n);",
            note: '$push appends (use $each for multiple), $addToSet appends only if absent, $pull removes matching elements, and $pop removes the first or last item.',
            explanation: {
              heading: 'Array Update Operators',
              intro: 'Array operators add, deduplicate, and remove elements in place so you can mutate a list without replacing the entire field.',
              points: [
                { term: 'Append with $push', detail: '$push adds one element, or many at once when combined with $each, and can even sort and slice the array in the same step.' },
                { term: 'Deduplicate with $addToSet', detail: '$addToSet adds a value only if it is not already present, keeping the array free of duplicates.' },
                { term: 'Remove with $pull', detail: '$pull removes every element that matches a value or condition, while $pullAll removes each element in a given list.' },
                { term: 'Ends with $pop', detail: '$pop removes the last element when passed 1 and the first element when passed -1.' },
              ],
            },
            example: "{ $push: { scores: { $each: [90], $sort: -1, $slice: 5 } } }",
          },
          {
            id: 'mongo-positional-update',
            code: "db.orders.updateOne(\n  { _id: id, 'items.sku': 'A1' },\n  { $set: { 'items.$.qty': 3 } }\n);\n\ndb.orders.updateOne(\n  { _id: id },\n  { $inc: { 'items.$[e].qty': 1 } },\n  { arrayFilters: [{ 'e.qty': { $lt: 5 } }] }\n);",
            note: 'The positional $ updates the first array element matched by the query. The filtered positional $[<id>] with arrayFilters updates every element meeting a condition, allowing precise multi-element edits.',
            explanation: {
              heading: 'Positional Array Updates',
              intro: 'Positional operators target specific elements inside an array by matched position or by a per-element condition.',
              points: [
                { term: 'First match with $', detail: 'The positional $ updates the first array element that the query filter matched, so the filter must include a condition on that array.' },
                { term: 'All matches with $[]', detail: 'The all-positional $[] applies the update to every element of the array regardless of value.' },
                { term: 'Filtered with arrayFilters', detail: 'The filtered form $[name] with arrayFilters updates only elements meeting a named condition, enabling precise multi-element edits.' },
                { term: 'One layer at a time', detail: 'These operators address a single array level, so deeply nested arrays may need multiple identifiers in the arrayFilters list.' },
              ],
            },
            example: "// arrayFilters targets all items with qty < 5",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'mongo-aggregation',
    title: 'Aggregation Pipeline',
    level: 1,
    slug: 'aggregation',
    concepts: [],
    children: [
      {
        id: 'mongo-pipeline-stages',
        title: 'Core Pipeline Stages',
        level: 2,
        slug: 'pipeline',
        concepts: [
          {
            id: 'mongo-group-project',
            code: "db.orders.aggregate([\n  { $match: { status: 'completed' } },\n  { $group: { _id: '$customerId', total: { $sum: '$amount' } } },\n  { $project: { customer: '$_id', total: 1, _id: 0 } },\n  { $sort: { total: -1 } },\n  { $limit: 10 }\n]);",
            note: 'Stages transform documents in sequence: $match filters, $group aggregates, $project reshapes, $sort orders. Put $match early to reduce documents before expensive stages.',
            explanation: {
              heading: 'Core Pipeline Stages',
              intro: 'An aggregation pipeline passes documents through an ordered list of stages, each transforming the stream before handing it to the next.',
              points: [
                { term: 'Filter early', detail: 'Placing $match near the front cuts the document count before costly stages, and an early $match can use indexes like a normal query.' },
                { term: 'Group aggregates', detail: '$group collapses documents by a key and computes accumulators like $sum, $avg, and $max over each group.' },
                { term: 'Reshape with $project', detail: '$project chooses, renames, and computes fields, letting you build the exact output shape you want.' },
                { term: 'Order and stage limits', detail: '$sort orders the stream, and pushing $sort plus $limit together lets the engine keep only the top results in memory.' },
              ],
            },
            example: "{ $group: { _id: null, avg: { $avg: '$amount' } } }",
          },
          {
            id: 'mongo-unwind-count',
            code: "db.posts.aggregate([\n  { $unwind: '$tags' },\n  { $group: { _id: '$tags', posts: { $sum: 1 } } },\n  { $sort: { posts: -1 } }\n]);",
            note: '$unwind expands an array field into one document per element, which lets you group or count by individual array values. This is the standard way to compute tag frequencies or similar per-item stats.',
            explanation: {
              heading: 'Unwinding Arrays',
              intro: '$unwind flattens an array field into a separate document for each element, turning nested lists into rows you can group and count.',
              points: [
                { term: 'One doc per element', detail: 'A document with three tags becomes three documents that are identical except for the single tag value.' },
                { term: 'Enables per-item grouping', detail: 'After unwinding you can $group by the element to compute frequencies, such as how many posts carry each tag.' },
                { term: 'Empty arrays drop', detail: 'By default documents with an empty or missing array are removed, so set preserveNullAndEmptyArrays to keep them.' },
                { term: 'Track the index', detail: 'The includeArrayIndex option can record each element original position, useful when order matters downstream.' },
              ],
            },
            example: "// One row per distinct tag, with a post count",
          },
        ],
        children: [],
      },
      {
        id: 'mongo-lookup',
        title: 'Joins with $lookup',
        level: 2,
        slug: 'lookup',
        concepts: [
          {
            id: 'mongo-lookup-basic',
            code: "db.orders.aggregate([\n  { $lookup: {\n      from: 'customers',\n      localField: 'customerId',\n      foreignField: '_id',\n      as: 'customer'\n  }},\n  { $unwind: '$customer' }\n]);",
            note: '$lookup performs a left outer join to another collection, storing matches in an array. $unwind flattens that array into individual documents.',
            explanation: {
              heading: 'Joining with $lookup',
              intro: '$lookup enriches each document by pulling in related documents from another collection, MongoDB equivalent of a left outer join.',
              points: [
                { term: 'Left outer join', detail: 'Every input document is kept, and matches from the foreign collection are attached, with an empty array when nothing matches.' },
                { term: 'Results as an array', detail: 'Matches land in the field named by as, so a following $unwind is common when you expect at most one match.' },
                { term: 'Local and foreign fields', detail: 'The simple form joins where localField equals foreignField, comparing one field from each collection.' },
                { term: 'Index the foreign key', detail: 'An index on the foreignField keeps the join efficient, since without it each input document triggers a scan.' },
              ],
            },
            example: "// Each order now has a single customer object",
          },
          {
            id: 'mongo-lookup-pipeline',
            code: "db.orders.aggregate([\n  { $lookup: {\n      from: 'items',\n      let: { oid: '$_id' },\n      pipeline: [\n        { $match: { $expr: { $eq: ['$orderId', '$$oid'] } } },\n        { $project: { name: 1, price: 1 } }\n      ],\n      as: 'lineItems'\n  }}\n]);",
            note: 'The pipeline form of $lookup passes local values in with let and runs a sub-pipeline against the foreign collection. This supports joins with extra conditions or projections, not just simple field equality.',
            explanation: {
              heading: 'Pipeline-Form $lookup',
              intro: 'The pipeline form of $lookup runs a full sub-pipeline against the foreign collection, enabling joins with conditions beyond simple equality.',
              points: [
                { term: 'Pass variables with let', detail: 'The let clause captures fields from the local document as variables the sub-pipeline can reference.' },
                { term: 'Reference with double dollar', detail: 'Inside the sub-pipeline you read a let variable with a double-dollar prefix, and it must sit inside $expr to compare against foreign fields.' },
                { term: 'Rich matching', detail: 'The sub-pipeline can filter on ranges, project fewer fields, or sort, giving far more control than the localField form.' },
                { term: 'Cost awareness', detail: 'The sub-pipeline runs per input document, so keep it selective and indexed to avoid heavy repeated work.' },
              ],
            },
            example: "// $$oid references the let variable inside the sub-pipeline",
          },
        ],
        children: [],
      },
      {
        id: 'mongo-facet-bucket',
        title: 'Faceting and Bucketing',
        level: 2,
        slug: 'facet-bucket',
        concepts: [
          {
            id: 'mongo-facet',
            code: "db.products.aggregate([\n  { $facet: {\n      byCategory: [ { $group: { _id: '$category', n: { $sum: 1 } } } ],\n      priceStats: [ { $group: { _id: null, avg: { $avg: '$price' } } } ]\n  }}\n]);",
            note: '$facet runs several independent sub-pipelines over the same input and returns their results side by side in one document. It is perfect for dashboards that need multiple aggregations from a single query.',
            explanation: {
              heading: 'Multi-Facet Aggregation',
              intro: '$facet executes several sub-pipelines over the exact same input set and returns all their outputs together in a single document.',
              points: [
                { term: 'Shared input', detail: 'Every facet sees the same documents that entered the stage, so you compute multiple views without re-querying.' },
                { term: 'Named outputs', detail: 'Each sub-pipeline result is stored under its own field name, producing one document with a field per facet.' },
                { term: 'Great for dashboards', detail: 'It answers several dashboard questions, like counts by category and overall price stats, in one round trip.' },
                { term: 'Runs in memory', detail: 'Facets process within the stage rather than streaming, so keep the incoming set trimmed by an earlier $match.' },
              ],
            },
            example: "// Output: { byCategory: [...], priceStats: [...] }",
          },
          {
            id: 'mongo-bucket',
            code: "db.products.aggregate([\n  { $bucket: {\n      groupBy: '$price',\n      boundaries: [0, 10, 50, 100],\n      default: 'other',\n      output: { count: { $sum: 1 } }\n  }}\n]);",
            note: '$bucket groups documents into ranges defined by explicit boundaries, sending out-of-range values to the default bucket. $bucketAuto instead picks boundaries automatically to spread documents into a target number of buckets.',
            explanation: {
              heading: 'Bucketing into Ranges',
              intro: '$bucket sorts documents into ranges you define so you can build histograms and range-based summaries.',
              points: [
                { term: 'Explicit boundaries', detail: 'The boundaries array defines half-open ranges, so a value falls into the bucket whose lower edge it meets but whose upper edge it stays below.' },
                { term: 'Default catches strays', detail: 'Values outside every boundary go into the bucket named by default, which prevents them from being silently dropped.' },
                { term: 'Custom output', detail: 'The output option computes accumulators per bucket, such as a count or an average, just like $group.' },
                { term: 'Automatic with $bucketAuto', detail: '$bucketAuto instead picks the boundaries for you to spread documents evenly across a requested number of buckets.' },
              ],
            },
            example: "// Buckets: [0,10), [10,50), [50,100), other",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'mongo-indexes',
    title: 'Indexes',
    level: 1,
    slug: 'indexes',
    concepts: [],
    children: [
      {
        id: 'mongo-index-types',
        title: 'Index Types',
        level: 2,
        slug: 'index-types',
        concepts: [
          {
            id: 'mongo-compound-index',
            code: "db.users.createIndex({ lastName: 1, firstName: 1 });\ndb.users.createIndex({ email: 1 }, { unique: true });\ndb.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });",
            note: 'Compound indexes serve queries matching a left prefix of their fields. Unique indexes enforce distinct values. TTL indexes automatically expire documents after a set time.',
            explanation: {
              heading: 'Index Types',
              intro: 'MongoDB offers several index kinds that speed up queries and enforce constraints, each suited to a different access pattern.',
              points: [
                { term: 'Compound prefixes', detail: 'A compound index can serve any query that filters a left prefix of its fields, so field order determines which queries it helps.' },
                { term: 'Unique constraints', detail: 'A unique index rejects a second document with the same indexed value, which is how you enforce uniqueness like emails.' },
                { term: 'Automatic expiry', detail: 'A TTL index on a date field lets the server delete documents a set number of seconds after that date, ideal for sessions or logs.' },
                { term: 'Write cost', detail: 'Every index must be maintained on writes, so extra indexes speed reads but slow inserts and updates.' },
              ],
            },
            example: "db.users.find({ lastName: 'Smith' }); // uses the index",
          },
          {
            id: 'mongo-explain',
            code: "db.users.find({ email: 'a@b.com' }).explain('executionStats');",
            note: 'explain reveals the query plan. Look for IXSCAN (index used) versus COLLSCAN (full scan). totalDocsExamined near nReturned means the index is efficient.',
            explanation: {
              heading: 'Reading Query Plans with explain',
              intro: 'explain shows how the server intends to run a query, which is the primary tool for diagnosing slow or unindexed operations.',
              points: [
                { term: 'Index vs scan', detail: 'An IXSCAN stage means an index is being used, while a COLLSCAN means the query reads every document, usually a sign a useful index is missing.' },
                { term: 'Examined vs returned', detail: 'When totalDocsExamined is close to nReturned the index is selective, but a large gap means the query reads far more than it keeps.' },
                { term: 'Execution stats mode', detail: 'Passing executionStats actually runs the query and reports real timings and counts, not just the estimated plan.' },
                { term: 'Winning plan', detail: 'The optimizer compares candidate plans and caches a winner, so explain reflects the plan it currently favors for that shape.' },
              ],
            },
            example: "// stage: 'IXSCAN' indicates an index-backed query",
          },
          {
            id: 'mongo-partial-index',
            code: "db.orders.createIndex(\n  { userId: 1 },\n  { partialFilterExpression: { status: 'active' } }\n);",
            note: 'A partial index only covers documents matching a filter, making it smaller and cheaper to maintain than a full index. Queries must include the same condition for the planner to use it.',
            explanation: {
              heading: 'Partial Indexes',
              intro: 'A partial index indexes only the subset of documents matching a filter expression, shrinking its size and upkeep cost.',
              points: [
                { term: 'Index a subset', detail: 'The partialFilterExpression decides which documents are indexed, so an index on active orders skips all the inactive ones.' },
                { term: 'Query must overlap', detail: 'The planner uses the index only when the query includes a condition guaranteeing results fall within the indexed subset.' },
                { term: 'Cheaper to maintain', detail: 'Fewer indexed entries mean smaller storage and less write overhead than a full index on the same field.' },
                { term: 'Sparse-like behavior', detail: 'A partial filter on field existence can replace a sparse index while giving you more control over exactly what is indexed.' },
              ],
            },
            example: "// Only active orders are indexed here",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'mongo-text-search',
    title: 'Text Search',
    level: 1,
    slug: 'text-search',
    concepts: [],
    children: [
      {
        id: 'mongo-text-index',
        title: 'Text Indexes and Queries',
        level: 2,
        slug: 'text',
        concepts: [
          {
            id: 'mongo-text-query',
            code: "db.articles.createIndex({ title: 'text', body: 'text' });\n\ndb.articles.find(\n  { $text: { $search: 'mongodb tutorial' } },\n  { score: { $meta: 'textScore' } }\n).sort({ score: { $meta: 'textScore' } });",
            note: 'A text index enables full-text search via $text. Results can be ranked by relevance using the textScore metadata. A collection can have only one text index.',
            explanation: {
              heading: 'Text Indexes and Queries',
              intro: 'A text index tokenizes string fields so you can run keyword searches with $text and rank results by relevance.',
              points: [
                { term: 'One per collection', detail: 'A collection can hold only a single text index, though that index may cover several string fields at once.' },
                { term: 'Relevance score', detail: 'Each match carries a textScore in its metadata that you can project and sort by to order results from most to least relevant.' },
                { term: 'Search syntax', detail: 'The search string treats words as OR terms, quotes force an exact phrase, and a leading minus excludes a term.' },
                { term: 'Stemming applied', detail: 'Terms are stemmed and stop words removed based on language, so running matches run as well.' },
              ],
            },
            example: "$search: '\"exact phrase\" -excluded'",
          },
          {
            id: 'mongo-text-weights',
            code: "db.articles.createIndex(\n  { title: 'text', body: 'text' },\n  { weights: { title: 10, body: 1 }, default_language: 'english' }\n);",
            note: 'Field weights make matches in some fields count more toward the relevance score, so a title hit ranks above a body hit. default_language selects the stemming and stop-word rules applied during indexing.',
            explanation: {
              heading: 'Text Index Weights and Language',
              intro: 'Weights and language options tune how a text index scores matches and how it processes words during indexing.',
              points: [
                { term: 'Per-field weights', detail: 'Assigning a higher weight to a field multiplies the score of matches there, so a title hit can outrank a body hit.' },
                { term: 'Default weight', detail: 'Fields without an explicit weight default to one, so weights are relative multipliers rather than absolute scores.' },
                { term: 'Language rules', detail: 'default_language chooses which stemming and stop-word list applies, affecting how words are reduced to their roots.' },
                { term: 'Per-document language', detail: 'A language_override field lets individual documents specify their own language, overriding the index default.' },
              ],
            },
            example: "// A title match scores ~10x a body match here",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'mongo-array-queries',
    title: 'Array Queries',
    level: 1,
    slug: 'array-queries',
    concepts: [],
    children: [
      {
        id: 'mongo-array-matching',
        title: 'Matching Array Elements',
        level: 2,
        slug: 'array-matching',
        concepts: [
          {
            id: 'mongo-elem-match',
            code: "db.products.find({\n  reviews: { $elemMatch: { rating: { $gte: 4 }, verified: true } }\n});\n\ndb.products.find({ 'tags': { $all: ['sale', 'new'] } });",
            note: '$elemMatch requires all conditions to match the same array element. $all requires the array to contain every listed value. $size matches arrays of an exact length.',
            explanation: {
              heading: 'Matching Array Elements',
              intro: 'These operators express conditions about array contents, from a single element satisfying several rules to whole-array requirements.',
              points: [
                { term: 'Same element with $elemMatch', detail: '$elemMatch requires one array element to satisfy all its conditions together, unlike separate conditions that may match different elements.' },
                { term: 'Contains all with $all', detail: '$all matches when the array contains every listed value, regardless of order or extra elements.' },
                { term: 'Exact length with $size', detail: '$size matches arrays with an exact element count, but it accepts only a fixed number, not a range.' },
                { term: 'Implicit element match', detail: 'A plain condition on an array field matches if any single element satisfies it, which is why $elemMatch exists for stricter cases.' },
              ],
            },
            example: "db.products.find({ tags: { $size: 3 } });",
          },
          {
            id: 'mongo-array-index-query',
            code: "db.matrix.find({ 'grid.0': { $gt: 0 } });\ndb.orders.find({ 'items.2': { $exists: true } });",
            note: 'You can query an array by numeric position using dot notation, where grid.0 is the first element. Testing items.2 with $exists checks whether the array has at least three elements.',
            explanation: {
              heading: 'Querying by Array Position',
              intro: 'Dot notation with a numeric index lets you target a specific slot in an array for both filtering and existence checks.',
              points: [
                { term: 'Zero-based positions', detail: 'The path grid.0 refers to the first element, grid.1 the second, and so on, since array indexes start at zero.' },
                { term: 'Length via $exists', detail: 'Checking that items.2 exists confirms the array has at least three elements, a handy way to filter by minimum length.' },
                { term: 'Quote paths in shells', detail: 'Because a path like items.2 mixes a field with a number, quote it as a string key in query documents.' },
                { term: 'Position is brittle', detail: 'Relying on fixed positions is fragile when array order changes, so prefer $elemMatch when you care about content rather than slot.' },
              ],
            },
            example: "// 'items.2' exists means length >= 3",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'mongo-embedded',
    title: 'Embedded Documents',
    level: 1,
    slug: 'embedded',
    concepts: [],
    children: [
      {
        id: 'mongo-nested-access',
        title: 'Querying Nested Fields',
        level: 2,
        slug: 'nested',
        concepts: [
          {
            id: 'mongo-dot-notation',
            code: "db.users.find({ 'address.city': 'Seattle' });\n\ndb.users.updateOne(\n  { _id: id },\n  { $set: { 'address.zip': '98101' } }\n);",
            note: 'Dot notation reaches into embedded documents for both queries and updates. Quote the field path when it contains a dot.',
            explanation: {
              heading: 'Querying Nested Fields',
              intro: 'Dot notation lets you reach fields inside embedded documents to both filter and update them without touching the parent object.',
              points: [
                { term: 'Reach into subdocuments', detail: 'A path like address.city matches the city field inside the embedded address document.' },
                { term: 'Quote the path', detail: 'Because the path contains a dot, write it as a quoted string key so it is not misread as separate fields.' },
                { term: 'Targeted updates', detail: 'Setting address.zip with $set changes only that nested field and leaves the rest of the embedded document intact.' },
                { term: 'Mix with array index', detail: 'You can combine array positions and field names, as in items.0.sku, to reach into an object inside an array.' },
              ],
            },
            example: "db.orders.find({ 'items.0.sku': 'ABC' }); // by array index",
          },
          {
            id: 'mongo-embedded-exact-match',
            code: "// Exact match: order and all fields must match\ndb.users.find({ address: { city: 'Seattle', zip: '98101' } });\n// Dot notation: matches regardless of other fields or order\ndb.users.find({ 'address.city': 'Seattle' });",
            note: 'Matching a whole embedded document requires every field and their order to match exactly, which is fragile. Dot notation on individual sub-fields is usually what you want because it ignores unrelated fields.',
            explanation: {
              heading: 'Exact vs Dot-Notation Matching',
              intro: 'There is a sharp difference between matching an entire embedded document and matching individual sub-fields with dot notation.',
              points: [
                { term: 'Exact match is strict', detail: 'Passing a whole subdocument requires the same fields in the same order with no extras, so it breaks when the shape changes.' },
                { term: 'Dot notation is flexible', detail: 'Matching address.city ignores every other field in the subdocument, which is almost always the behavior you want.' },
                { term: 'Order sensitivity', detail: 'Full-document equality is sensitive to field order because it compares the stored BSON, unlike per-field matching.' },
                { term: 'Combine conditions', detail: 'Several dot-notation conditions can target different sub-fields independently without demanding the whole object match.' },
              ],
            },
            example: "// Prefer 'address.city' over matching the full sub-document",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'mongo-schema-design',
    title: 'Schema Design',
    level: 1,
    slug: 'schema-design',
    concepts: [],
    children: [
      {
        id: 'mongo-modeling-patterns',
        title: 'Embedding vs Referencing',
        level: 2,
        slug: 'modeling',
        concepts: [
          {
            id: 'mongo-embed-vs-ref',
            code: "// Embedding: one-to-few, read together\n{ _id: 1, name: 'Alice', addresses: [ { city: 'Seattle' } ] }\n\n// Referencing: one-to-many, large or shared\n{ _id: 1, name: 'Alice' }\n{ _id: 10, userId: 1, body: 'A post' }",
            note: 'Embed data that is accessed together and bounded in size. Reference data that is large, unbounded, or shared across documents to avoid duplication and the 16MB document limit.',
            explanation: {
              heading: 'Embedding vs Referencing',
              intro: 'The central schema decision in MongoDB is whether to nest related data inside a document or store it separately and link by id.',
              points: [
                { term: 'Embed for locality', detail: 'Embed data that is read together and bounded in size, so a single read returns everything without extra queries.' },
                { term: 'Reference for growth', detail: 'Reference data that is large, unbounded, or shared, keeping documents small and avoiding duplicated copies.' },
                { term: 'Respect the size limit', detail: 'A single document cannot exceed 16MB, so unbounded arrays must be referenced rather than embedded.' },
                { term: 'Model around access', detail: 'Design the shape around how the application reads and writes, favoring embedding for one-to-few and referencing for one-to-many.' },
              ],
            },
            example: "// Rule of thumb: embed one-to-few, reference one-to-many",
          },
          {
            id: 'mongo-schema-validation',
            code: "db.createCollection('users', {\n  validator: {\n    $jsonSchema: {\n      bsonType: 'object',\n      required: ['email'],\n      properties: {\n        email: { bsonType: 'string' },\n        age: { bsonType: 'int', minimum: 0 }\n      }\n    }\n  }\n});",
            note: 'Schema validation enforces structure on an otherwise flexible collection using $jsonSchema rules. Documents that fail validation are rejected, adding a safety net without giving up the document model.',
            explanation: {
              heading: 'Schema Validation',
              intro: 'Schema validation lets you enforce structural rules on a collection so bad documents are caught while keeping the flexible document model.',
              points: [
                { term: 'JSON Schema rules', detail: '$jsonSchema declares required fields, allowed types, and value constraints like minimum, which the server checks on write.' },
                { term: 'Reject or warn', detail: 'validationAction:error rejects invalid writes, while warn only logs them, useful for auditing before enforcing.' },
                { term: 'Applies to new writes', detail: 'Validation runs on inserts and updates going forward, so existing documents are not retroactively checked unless you rewrite them.' },
                { term: 'Optional strictness', detail: 'validationLevel can be set to moderate so only new documents and already-valid ones are validated during updates.' },
              ],
            },
            example: "// validationAction: 'warn' logs instead of rejecting",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'mongo-transactions',
    title: 'Transactions',
    level: 1,
    slug: 'transactions',
    concepts: [],
    children: [
      {
        id: 'mongo-multi-doc-tx',
        title: 'Multi-Document Transactions',
        level: 2,
        slug: 'multi-doc',
        concepts: [
          {
            id: 'mongo-transaction-basic',
            code: "const session = client.startSession();\ntry {\n  session.startTransaction();\n  await accounts.updateOne({ _id: 'a' }, { $inc: { balance: -100 } }, { session });\n  await accounts.updateOne({ _id: 'b' }, { $inc: { balance: 100 } }, { session });\n  await session.commitTransaction();\n} catch (e) {\n  await session.abortTransaction();\n} finally {\n  await session.endSession();\n}",
            note: 'Transactions give all-or-nothing atomicity across multiple documents and collections. Pass the session to every operation, then commit or abort. They require a replica set or sharded cluster.',
            explanation: {
              heading: 'Multi-Document Transactions',
              intro: 'A transaction groups several operations so they all commit together or all roll back, extending atomicity beyond a single document.',
              points: [
                { term: 'Session is required', detail: 'You start a session, begin the transaction, and pass that session to every operation you want included in it.' },
                { term: 'Commit or abort', detail: 'Calling commitTransaction makes all changes visible at once, while abortTransaction discards them entirely on error.' },
                { term: 'Cluster requirement', detail: 'Transactions need a replica set or sharded cluster, so they do not work on a standalone server.' },
                { term: 'Use sparingly', detail: 'Single-document writes are already atomic, so reserve transactions for genuinely cross-document invariants to avoid their overhead.' },
              ],
            },
            example: "// A single-document update is already atomic without a transaction",
          },
          {
            id: 'mongo-concerns',
            code: "db.orders.insertOne(doc, {\n  writeConcern: { w: 'majority', j: true, wtimeout: 5000 }\n});\n\ndb.orders.find().readConcern('majority');",
            note: 'A write concern controls how many replica-set members must acknowledge a write before it is considered durable; w:"majority" with j:true waits for a journaled majority. A read concern sets the consistency guarantee for reads.',
            explanation: {
              heading: 'Write and Read Concerns',
              intro: 'Write and read concerns tune the durability of writes and the consistency of reads, trading latency for stronger guarantees.',
              points: [
                { term: 'Acknowledgement level', detail: 'The w value sets how many members must confirm a write, with majority ensuring it survives the failure of any single member.' },
                { term: 'Journal durability', detail: 'Setting j:true waits until the write is recorded to the on-disk journal, so it is not lost if the process crashes.' },
                { term: 'Read visibility', detail: 'A read concern like majority returns only data that has been committed to a majority, avoiding reads that could later roll back.' },
                { term: 'Latency tradeoff', detail: 'Stronger concerns wait for more members and disk flushes, so they add latency in exchange for safety.' },
              ],
            },
            example: "// readConcern 'majority' returns only durable, committed data",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'mongo-geospatial',
    title: 'Geospatial Queries',
    level: 1,
    slug: 'geospatial',
    concepts: [],
    children: [
      {
        id: 'mongo-geo-near',
        title: 'Geospatial Indexes and Queries',
        level: 2,
        slug: 'geo-near',
        concepts: [
          {
            id: 'mongo-near',
            code: "db.places.createIndex({ location: '2dsphere' });\n\ndb.places.find({\n  location: {\n    $near: {\n      $geometry: { type: 'Point', coordinates: [-122.33, 47.61] },\n      $maxDistance: 5000\n    }\n  }\n});",
            note: 'A 2dsphere index supports GeoJSON points and polygons. $near returns documents sorted by distance; $geoWithin finds points inside a shape. Distances are in meters.',
            explanation: {
              heading: 'Geospatial Indexes and $near',
              intro: 'A 2dsphere index models locations on a sphere so you can run proximity and containment queries against GeoJSON data.',
              points: [
                { term: 'GeoJSON support', detail: 'A 2dsphere index understands GeoJSON points, lines, and polygons and computes distances across the curved surface of the earth.' },
                { term: 'Sorted by distance', detail: '$near returns matching documents ordered from nearest to farthest and can cap results with a maximum distance.' },
                { term: 'Distances in meters', detail: 'When using GeoJSON, $maxDistance and returned distances are expressed in meters.' },
                { term: 'Coordinate order', detail: 'GeoJSON coordinates are given as longitude then latitude, which is the reverse of how people often say them.' },
              ],
            },
            example: "$geoWithin: { $centerSphere: [[lng, lat], radius] }",
          },
          {
            id: 'mongo-geo-within',
            code: "db.places.find({\n  location: {\n    $geoWithin: {\n      $geometry: {\n        type: 'Polygon',\n        coordinates: [[[-122.4,47.5],[-122.2,47.5],[-122.2,47.7],[-122.4,47.7],[-122.4,47.5]]]\n      }\n    }\n  }\n});",
            note: '$geoWithin returns every document whose point falls inside a given polygon, without sorting by distance. Unlike $near it needs no proximity computation, so it is well suited to region or bounding-box filters.',
            explanation: {
              heading: 'Containment with $geoWithin',
              intro: '$geoWithin selects every location that falls inside a given shape, making it the tool for region and bounding-box filters.',
              points: [
                { term: 'Inside a shape', detail: 'It matches documents whose point lies within the supplied polygon or circle, ignoring how close to the edge they are.' },
                { term: 'No distance sort', detail: 'Unlike $near it does not compute or sort by distance, so it is cheaper when you only need membership in an area.' },
                { term: 'Close the polygon', detail: 'A polygon ring must repeat its first coordinate as its last so the boundary forms a closed loop.' },
                { term: 'Circle option', detail: 'The $centerSphere form defines a circular region from a center point and a radius in radians for quick radius searches.' },
              ],
            },
            example: "// The polygon's first and last coordinate must match to close it",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'mongo-change-streams',
    title: 'Change Streams',
    level: 1,
    slug: 'change-streams',
    concepts: [],
    children: [
      {
        id: 'mongo-change-stream-topic',
        title: 'Watching for Changes',
        level: 2,
        slug: 'watch',
        concepts: [
          {
            id: 'mongo-change-stream-basic',
            code: "const stream = db.orders.watch([\n  { $match: { operationType: 'insert' } }\n]);\nstream.on('change', next => {\n  print(next.operationType, next.fullDocument);\n});",
            note: 'A change stream delivers a real-time feed of inserts, updates, and deletes on a collection, database, or cluster. You can filter the stream with an aggregation pipeline, here limiting it to inserts. Change streams require a replica set.',
            explanation: {
              heading: 'Watching for Changes',
              intro: 'A change stream is a live, ordered feed of data changes that lets applications react to writes without polling.',
              points: [
                { term: 'Real-time events', detail: 'Each event describes an operation such as insert, update, or delete, so you can drive downstream systems as data changes.' },
                { term: 'Filter with a pipeline', detail: 'You can pass an aggregation pipeline to watch, narrowing the feed to only the operations or fields you care about.' },
                { term: 'Scope choices', detail: 'You can open a stream on one collection, a whole database, or the entire cluster depending on how broad a view you need.' },
                { term: 'Replica set required', detail: 'Change streams build on the oplog, so they need a replica set or sharded cluster rather than a standalone server.' },
              ],
            },
            example: "// operationType is 'insert', 'update', 'delete', etc.",
          },
          {
            id: 'mongo-change-stream-resume',
            code: "const stream = db.orders.watch([], {\n  resumeAfter: savedResumeToken,\n  fullDocument: 'updateLookup'\n});",
            note: 'Every change event carries a resume token; passing it as resumeAfter lets a client reconnect and continue exactly where it left off after a disruption. fullDocument:"updateLookup" includes the whole current document on updates.',
            explanation: {
              heading: 'Resuming Change Streams',
              intro: 'Resume tokens make change streams durable across disconnects, and lookup options enrich update events with full documents.',
              points: [
                { term: 'Resume tokens', detail: 'Every event carries a token, and passing the last one as resumeAfter lets a client reconnect exactly where it stopped.' },
                { term: 'Persist the token', detail: 'Storing the token durably between runs is what lets processing survive a crash without missing or replaying events.' },
                { term: 'Full document on update', detail: 'By default an update event only lists changed fields, so fullDocument:updateLookup fetches the whole current document.' },
                { term: 'Token validity window', detail: 'A resume token stays valid only while its point is still in the oplog, so a very long outage can make resuming impossible.' },
              ],
            },
            example: "// Persist next._id as the resume token between runs",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'mongo-collection-management',
    title: 'Collection Management',
    level: 1,
    slug: 'collection-management',
    concepts: [],
    children: [
      {
        id: 'mongo-capped-collections',
        title: 'Capped Collections',
        level: 2,
        slug: 'capped',
        concepts: [
          {
            id: 'mongo-capped-create',
            code: "db.createCollection('logs', {\n  capped: true,\n  size: 1048576,\n  max: 10000\n});",
            note: 'A capped collection is a fixed-size ring buffer that automatically overwrites its oldest documents once the size or document cap is reached. It preserves insertion order and is ideal for rolling logs.',
            explanation: {
              heading: 'Capped Collections',
              intro: 'A capped collection is a fixed-size, insertion-ordered store that behaves like a ring buffer, recycling space as it fills.',
              points: [
                { term: 'Fixed size', detail: 'You set a byte size and optionally a document cap, and once reached the oldest documents are overwritten to make room.' },
                { term: 'Insertion order', detail: 'Documents are kept in the order they were inserted, so a natural scan returns them oldest to newest without a sort.' },
                { term: 'No arbitrary delete', detail: 'You cannot delete individual documents, and updates must not grow a document beyond its original size.' },
                { term: 'Great for logs', detail: 'The automatic aging of old data makes capped collections a natural fit for rolling logs and recent-event buffers.' },
              ],
            },
            example: "// size is in bytes; max caps the document count",
          },
          {
            id: 'mongo-capped-tailable',
            code: "const cursor = db.logs.find({}).tailable().awaitData();\n// The cursor stays open and yields new documents as they arrive",
            note: 'A tailable cursor on a capped collection does not close when it reaches the end; instead it waits and returns new documents as they are inserted. This gives a simple publish/subscribe feed over a capped collection.',
            explanation: {
              heading: 'Tailable Cursors',
              intro: 'A tailable cursor stays open at the end of a capped collection and streams new documents as they arrive, like following a log.',
              points: [
                { term: 'Stays open', detail: 'Instead of closing when it reaches the last document, a tailable cursor waits for more inserts to appear.' },
                { term: 'Await data', detail: 'Adding awaitData makes the cursor block briefly for new documents rather than spinning in a tight polling loop.' },
                { term: 'Capped only', detail: 'Tailable cursors work only on capped collections, since they rely on the natural insertion order being preserved.' },
                { term: 'Simple feed', detail: 'The pattern gives a lightweight publish and subscribe feed, similar in spirit to following a growing log file.' },
              ],
            },
            example: "// Similar in spirit to `tail -f` on a log file",
          },
        ],
        children: [],
      },
    ],
  },
];

export default topics;
