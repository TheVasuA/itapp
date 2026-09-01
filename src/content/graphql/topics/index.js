// GraphQL topic tree.

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  {
    id: 'gql-queries',
    title: 'Queries',
    level: 1,
    slug: 'queries',
    concepts: [],
    children: [
      {
        id: 'gql-query-ops',
        title: 'Fields and Selection Sets',
        level: 2,
        slug: 'query-ops',
        concepts: [
          {
            id: 'gql-query-basic',
            code: "query {\n  user(id: \"1\") {\n    name\n    email\n    posts {\n      title\n    }\n  }\n}",
            note: 'A query requests exactly the fields you need inside a selection set, avoiding over-fetching. Nested selection sets traverse relationships in a single round trip.',
            explanation: {
              heading: 'Shape the response you want',
              intro: 'A GraphQL query is a declarative description of the exact data you need. The server returns a response whose structure mirrors the query itself.',
              points: [
                { term: 'Selection set', detail: 'The braces after a field list the sub-fields to return, and only those fields appear in the response.' },
                { term: 'No over-fetching', detail: 'You ask for precisely the fields you need, so responses do not carry unused data like a fixed REST payload might.' },
                { term: 'Nested traversal', detail: 'Nested selection sets follow relationships such as user to posts and resolve them together in one request.' },
                { term: 'Single round trip', detail: 'Related data across multiple levels is fetched in one network call instead of many sequential requests.' },
              ],
            },
            example: "// The response mirrors the shape of the query",
          },
          {
            id: 'gql-operation-name',
            code: "query GetDashboard {\n  me { name }\n  notifications { count }\n}",
            note: 'Naming an operation (query GetDashboard) aids debugging, logging, and caching, and is required when a document holds multiple operations. The anonymous shorthand { ... } is fine only for quick one-offs.',
            explanation: {
              heading: 'Name your operations',
              intro: 'Giving an operation an explicit name turns an anonymous request into a labeled, identifiable unit. This small habit pays off across tooling and observability.',
              points: [
                { term: 'Clearer debugging', detail: 'Named operations appear in logs, traces, and error reports, so you can pinpoint which request misbehaved.' },
                { term: 'Multiple operations', detail: 'A name is required when one document defines more than one operation, since the client must say which to run.' },
                { term: 'Caching and metrics', detail: 'Servers and gateways key caching and performance metrics off the operation name.' },
                { term: 'Anonymous shorthand', detail: 'The bare braces form is convenient only for quick throwaway queries in a playground.' },
              ],
            },
            example: "// Named operations show up clearly in server logs and traces",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'gql-arguments',
    title: 'Arguments',
    level: 1,
    slug: 'arguments',
    concepts: [],
    children: [
      {
        id: 'gql-argument-ops',
        title: 'Field Arguments',
        level: 2,
        slug: 'argument-ops',
        concepts: [
          {
            id: 'gql-argument-basic',
            code: "query {\n  products(category: \"books\", first: 10, sortBy: PRICE_ASC) {\n    name\n    price\n  }\n}",
            note: 'Arguments parameterize fields to filter, paginate, or sort. Any field can take arguments, and each field resolves its arguments independently, even nested ones.',
            explanation: {
              heading: 'Parameterize any field',
              intro: 'Arguments let a client pass inputs to a field, turning a static request into a dynamic one. They are the primary way to control what a field returns.',
              points: [
                { term: 'Filter, paginate, sort', detail: 'Common uses include narrowing results, limiting counts, and choosing an order.' },
                { term: 'Available on any field', detail: 'Not just root fields but any field in the tree can declare and accept arguments.' },
                { term: 'Independent resolution', detail: 'Each field evaluates its own arguments, so nested fields can be parameterized separately.' },
                { term: 'Typed inputs', detail: 'Every argument has a schema type, so the server validates values before a resolver runs.' },
              ],
            },
            example: "user(id: \"1\") { avatar(size: 200) }",
          },
          {
            id: 'gql-argument-defaults',
            code: "type Query {\n  products(first: Int = 20, sortBy: SortOrder = NEWEST): [Product!]!\n}",
            note: 'Schema fields can declare default values for arguments, so clients may omit them. Defaults document sensible behavior and keep queries concise while still allowing overrides when needed.',
            explanation: {
              heading: 'Default argument values',
              intro: 'The schema can assign a default to any argument so clients are free to leave it out. Defaults encode sensible behavior directly in the type system.',
              points: [
                { term: 'Optional arguments', detail: 'When a default exists the client may omit the argument and the server fills in the declared value.' },
                { term: 'Self-documenting', detail: 'The default appears in the schema, so consumers can see the expected behavior without extra docs.' },
                { term: 'Concise queries', detail: 'Callers only specify the arguments they want to change, keeping query text short.' },
                { term: 'Overridable', detail: 'Supplying a value always replaces the default for that request.' },
              ],
            },
            example: "// Omitting first uses the schema default of 20",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'gql-mutations',
    title: 'Mutations',
    level: 1,
    slug: 'mutations',
    concepts: [],
    children: [
      {
        id: 'gql-mutation-ops',
        title: 'Modifying Data',
        level: 2,
        slug: 'mutation-ops',
        concepts: [
          {
            id: 'gql-mutation-basic',
            code: "mutation CreatePost($input: PostInput!) {\n  createPost(input: $input) {\n    id\n    title\n    author { name }\n  }\n}",
            note: 'Mutations change server-side data and return the resulting object so clients can update their state. Top-level mutation fields run in series, unlike query fields.',
            explanation: {
              heading: 'Change data safely',
              intro: 'Mutations are the operation type for writes such as creating, updating, or deleting data. They also return data so clients can refresh their local state.',
              points: [
                { term: 'Write operations', detail: 'Any change to server-side state should go through a mutation rather than a query.' },
                { term: 'Returns a result', detail: 'A mutation selects fields on the affected object, letting the client update its cache from the response.' },
                { term: 'Serial execution', detail: 'Top-level mutation fields run one after another in order, so earlier writes complete before later ones begin.' },
                { term: 'Structured inputs', detail: 'Complex arguments are usually grouped into an input type for clarity and reuse.' },
              ],
            },
            example: "// Pass complex arguments via input types",
          },
          {
            id: 'gql-mutation-payload',
            code: "type CreatePostPayload {\n  post: Post\n  errors: [UserError!]!\n}\n\ntype UserError { field: String, message: String! }",
            note: 'A payload type wraps a mutation result alongside a structured errors list, letting clients handle validation failures as data rather than top-level exceptions. This is a widely adopted mutation-design convention.',
            explanation: {
              heading: 'Errors as data',
              intro: 'A payload type is a wrapper returned by a mutation that carries both the result object and a list of user-facing errors. It models expected failures as normal data.',
              points: [
                { term: 'Wrapper object', detail: 'The payload holds the created or updated entity plus a dedicated errors field.' },
                { term: 'Structured errors', detail: 'Each error can point to a specific field and message, so clients render precise feedback.' },
                { term: 'Not top-level errors', detail: 'Validation problems stay inside data rather than surfacing as protocol-level GraphQL errors.' },
                { term: 'Common convention', detail: 'This pattern is widely adopted because it makes recoverable failures easy to handle in the UI.' },
              ],
            },
            example: "// Returning userErrors avoids overloading GraphQL errors",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'gql-subscriptions',
    title: 'Subscriptions',
    level: 1,
    slug: 'subscriptions',
    concepts: [],
    children: [
      {
        id: 'gql-subscription-ops',
        title: 'Real-Time Updates',
        level: 2,
        slug: 'subscription-ops',
        concepts: [
          {
            id: 'gql-subscription-basic',
            code: "subscription OnMessageAdded($channelId: ID!) {\n  messageAdded(channelId: $channelId) {\n    id\n    text\n    sender { name }\n  }\n}",
            note: 'Subscriptions stream data over a persistent connection (usually WebSocket), pushing updates when a server-side event fires. They suit chat, notifications, and live feeds.',
            explanation: {
              heading: 'Real-time server push',
              intro: 'A subscription is a long-lived operation that lets the server push data to the client whenever a relevant event occurs. It complements request-response queries and mutations.',
              points: [
                { term: 'Persistent connection', detail: 'The transport is usually a WebSocket kept open so the server can send messages at any time.' },
                { term: 'Event driven', detail: 'A new payload is delivered each time a matching server-side event fires.' },
                { term: 'Same selection sets', detail: 'The client chooses fields on each event exactly as it would in a query.' },
                { term: 'Ideal use cases', detail: 'Chat messages, notifications, and live dashboards benefit most from streamed updates.' },
              ],
            },
            example: "// The client receives a new payload per matching event",
          },
          {
            id: 'gql-subscription-resolver',
            code: "const resolvers = {\n  Subscription: {\n    messageAdded: {\n      subscribe: (_, { channelId }, { pubsub }) =>\n        pubsub.asyncIterator(`MSG_${channelId}`)\n    }\n  }\n};",
            note: 'A subscription resolver returns an async iterator, typically from a PubSub engine, that yields events. The server publishes to a topic elsewhere (e.g. after a mutation) and subscribers on that topic receive it.',
            explanation: {
              heading: 'Wiring subscription resolvers',
              intro: 'Unlike other resolvers, a subscription resolver provides a subscribe function that returns an async iterator. Events flow through a publish and subscribe channel.',
              points: [
                { term: 'Async iterator', detail: 'The subscribe function returns an iterator that yields a value each time an event is published.' },
                { term: 'PubSub engine', detail: 'A publish and subscribe library manages topics and delivers events to interested subscribers.' },
                { term: 'Topics', detail: 'Subscribers listen on a named topic, often keyed by an argument such as a channel identifier.' },
                { term: 'Publishing elsewhere', detail: 'Some other code, commonly a mutation, publishes to the topic to trigger delivery.' },
              ],
            },
            example: "// pubsub.publish is called from the mutation that creates a message",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'gql-schema',
    title: 'Schema and Object Types',
    level: 1,
    slug: 'schema',
    concepts: [],
    children: [
      {
        id: 'gql-object-types',
        title: 'Type Definitions',
        level: 2,
        slug: 'object-types',
        concepts: [
          {
            id: 'gql-type-basic',
            code: "type User {\n  id: ID!\n  name: String!\n  email: String!\n  posts: [Post!]!\n}\n\ntype Post {\n  id: ID!\n  title: String!\n  author: User!\n}",
            note: 'The schema is the contract: object types declare fields and their types. ! marks non-null; [Post!]! is a non-null list of non-null Posts. Query, Mutation, and Subscription are root types.',
            explanation: {
              heading: 'The schema as contract',
              intro: 'Object types are the building blocks of a GraphQL schema, declaring the fields available and the type of each. Together they form a strict contract between client and server.',
              points: [
                { term: 'Fields and types', detail: 'Each object type lists named fields, and every field has a declared output type.' },
                { term: 'Non-null marker', detail: 'An exclamation mark after a type means the value can never be null.' },
                { term: 'List types', detail: 'Square brackets denote a list, and the inner and outer non-null markers apply independently.' },
                { term: 'Root types', detail: 'Query, Mutation, and Subscription are the special entry points into the graph.' },
              ],
            },
            example: "// The schema is strongly typed and introspectable",
          },
          {
            id: 'gql-nullability',
            code: "field: String     # nullable\nfield: String!    # non-null\nlist: [String]    # nullable list of nullable items\nlist: [String!]!  # non-null list of non-null items",
            note: 'Nullability is part of the type. A null in a non-null field propagates the error up to the nearest nullable parent, so overusing ! can wipe out large response sections when one field fails.',
            explanation: {
              heading: 'Nullability and its cost',
              intro: 'Whether a field can be null is encoded in its type, not left to convention. This makes nullability a deliberate design decision with real consequences.',
              points: [
                { term: 'Part of the type', detail: 'A trailing exclamation mark makes a field non-null, and its absence makes it nullable.' },
                { term: 'Error propagation', detail: 'If a non-null field resolves to null, the error bubbles up to the nearest nullable ancestor.' },
                { term: 'Cascading nulls', detail: 'Overusing non-null can turn one failure into a large section of the response becoming null.' },
                { term: 'Be conservative', detail: 'Reserve non-null for values you can genuinely guarantee to reduce blast radius on failure.' },
              ],
            },
            example: "// Be conservative with ! to avoid cascading null errors",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'gql-scalars',
    title: 'Scalars',
    level: 1,
    slug: 'scalars',
    concepts: [],
    children: [
      {
        id: 'gql-scalar-ops',
        title: 'Scalar Types',
        level: 2,
        slug: 'scalar-ops',
        concepts: [
          {
            id: 'gql-scalar-basic',
            code: "type Event {\n  id: ID!\n  name: String!\n  attendees: Int!\n  price: Float\n  isPublic: Boolean!\n  startsAt: DateTime  # custom scalar\n}",
            note: 'Built-in scalars are Int, Float, String, Boolean, and ID. Scalars are the leaf values of a query. You can define custom scalars like DateTime or JSON with their own serialization.',
            explanation: {
              heading: 'Leaf values of a query',
              intro: 'Scalars represent the concrete primitive values at the tips of a query where no further fields can be selected. GraphQL ships with a small built-in set and allows custom ones.',
              points: [
                { term: 'Built-in set', detail: 'The standard scalars are Int, Float, String, Boolean, and ID.' },
                { term: 'Leaf nodes', detail: 'A scalar cannot have a selection set, so it terminates a branch of the query.' },
                { term: 'ID semantics', detail: 'ID is serialized as a string but signals a unique identifier rather than human-readable text.' },
                { term: 'Custom scalars', detail: 'You can declare types like DateTime or JSON to model domain values with their own rules.' },
              ],
            },
            example: "scalar DateTime // declares a custom scalar",
          },
          {
            id: 'gql-custom-scalar-impl',
            code: "const DateTime = new GraphQLScalarType({\n  name: 'DateTime',\n  serialize: (v) => v.toISOString(),   // server -> client\n  parseValue: (v) => new Date(v),       // client var -> server\n  parseLiteral: (ast) => new Date(ast.value)\n});",
            note: 'A custom scalar defines serialize (output), parseValue (input variables), and parseLiteral (inline literals). This centralizes validation and formatting for values like dates, emails, or URLs.',
            explanation: {
              heading: 'Implementing a custom scalar',
              intro: 'A custom scalar is defined by three functions that control how values cross the boundary between server and client. Together they centralize validation and formatting.',
              points: [
                { term: 'serialize', detail: 'Converts an internal value into the form sent to the client, such as a date turned into a string.' },
                { term: 'parseValue', detail: 'Coerces an incoming value from query variables into the internal representation.' },
                { term: 'parseLiteral', detail: 'Handles values written inline in the query document rather than passed as variables.' },
                { term: 'Central validation', detail: 'Malformed values are rejected in one place before any resolver executes.' },
              ],
            },
            example: "// The scalar rejects malformed input before resolvers run",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'gql-input-types',
    title: 'Input Types',
    level: 1,
    slug: 'input-types',
    concepts: [],
    children: [
      {
        id: 'gql-input-ops',
        title: 'Input Object Types',
        level: 2,
        slug: 'input-ops',
        concepts: [
          {
            id: 'gql-input-basic',
            code: "input PostInput {\n  title: String!\n  body: String\n  tags: [String!]\n}\n\ntype Mutation {\n  createPost(input: PostInput!): Post!\n}",
            note: 'Input types bundle arguments for mutations and complex filters. They differ from object types: their fields cannot have arguments or resolvers and can only reference other input types and scalars.',
            explanation: {
              heading: 'Bundling arguments as input',
              intro: 'Input object types group related arguments into a single structured value. They are distinct from output object types and follow tighter rules.',
              points: [
                { term: 'Grouped arguments', detail: 'One input type replaces a long list of individual arguments on a mutation or field.' },
                { term: 'No resolvers', detail: 'Input fields hold data only and cannot have resolver functions attached.' },
                { term: 'No field arguments', detail: 'Fields inside an input type cannot themselves take arguments.' },
                { term: 'Restricted references', detail: 'Input fields may reference only scalars, enums, and other input types.' },
              ],
            },
            example: "// Use input types instead of long argument lists",
          },
          {
            id: 'gql-input-nested-filter',
            code: "input ProductFilter {\n  category: String\n  price: RangeInput\n  inStock: Boolean\n}\n\ninput RangeInput { min: Float, max: Float }",
            note: 'Input types nest, making them ideal for rich filter and search arguments. A single filter input keeps a query field clean and is far easier to evolve than a growing list of individual arguments.',
            explanation: {
              heading: 'Nested filters and search',
              intro: 'Because input types can contain other input types, they compose into deep structures. This makes them a natural fit for expressive filtering and search arguments.',
              points: [
                { term: 'Nesting', detail: 'An input field can be another input type, such as a price range inside a product filter.' },
                { term: 'Clean field signature', detail: 'A single filter argument keeps the query field readable no matter how many criteria exist.' },
                { term: 'Easy to evolve', detail: 'Adding a new optional criterion means adding a field to the input rather than a new argument.' },
                { term: 'Expressive queries', detail: 'Clients can combine multiple conditions in one structured value.' },
              ],
            },
            example: "products(filter: { category: \"books\", price: { max: 30 } })",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'gql-enums',
    title: 'Enums',
    level: 1,
    slug: 'enums',
    concepts: [],
    children: [
      {
        id: 'gql-enum-ops',
        title: 'Enumeration Types',
        level: 2,
        slug: 'enum-ops',
        concepts: [
          {
            id: 'gql-enum-basic',
            code: "enum Role {\n  ADMIN\n  EDITOR\n  VIEWER\n}\n\ntype User {\n  role: Role!\n}",
            note: 'An enum restricts a field to a fixed set of named values, which the server validates automatically. Enums document intent and prevent invalid inputs at the type level.',
            explanation: {
              heading: 'A fixed set of values',
              intro: 'An enum type constrains a field or argument to one of a predefined list of named values. This encodes valid options directly in the schema.',
              points: [
                { term: 'Named values', detail: 'Enum members are symbolic names, conventionally written in uppercase.' },
                { term: 'Automatic validation', detail: 'The server rejects any value outside the declared set before a resolver runs.' },
                { term: 'Self-documenting', detail: 'The full list of choices is visible in the schema and introspection tools.' },
                { term: 'Type-level safety', detail: 'Invalid inputs are impossible to express rather than caught later in logic.' },
              ],
            },
            example: "users(role: ADMIN) { name }",
          },
          {
            id: 'gql-enum-internal-value',
            code: "const resolvers = {\n  Role: { ADMIN: 'admin_v2', EDITOR: 2, VIEWER: 3 }\n};",
            note: 'On the server an enum value can map to a different internal representation (a database string or number). Clients always see the schema name while resolvers work with the mapped internal value transparently.',
            explanation: {
              heading: 'Internal enum mapping',
              intro: 'GraphQL lets the server associate each public enum name with a different internal value. This decouples the API vocabulary from storage details.',
              points: [
                { term: 'Public name', detail: 'Clients always see and send the schema enum name, unaware of the internal value.' },
                { term: 'Internal value', detail: 'Resolvers receive the mapped value, which can be a database string or a number.' },
                { term: 'Transparent translation', detail: 'The GraphQL layer converts between the two directions automatically.' },
                { term: 'Storage independence', detail: 'You can change internal representations without altering the public schema.' },
              ],
            },
            example: "// Decouples the public enum name from storage details",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'gql-interfaces',
    title: 'Interfaces',
    level: 1,
    slug: 'interfaces',
    concepts: [],
    children: [
      {
        id: 'gql-interface-ops',
        title: 'Shared Field Contracts',
        level: 2,
        slug: 'interface-ops',
        concepts: [
          {
            id: 'gql-interface-basic',
            code: "interface Node {\n  id: ID!\n}\n\ntype User implements Node {\n  id: ID!\n  name: String!\n}\n\ntype Post implements Node {\n  id: ID!\n  title: String!\n}",
            note: 'An interface defines fields that multiple types must implement, enabling polymorphic fields. Query interface fields with inline fragments to select type-specific data.',
            explanation: {
              heading: 'Shared field contracts',
              intro: 'An interface declares a set of fields that every implementing type must provide. It enables polymorphic fields that can return any of several related types.',
              points: [
                { term: 'Required fields', detail: 'Each type that implements the interface must define every field the interface declares.' },
                { term: 'Polymorphic return', detail: 'A field typed as an interface can resolve to any implementing type.' },
                { term: 'Shared selection', detail: 'Clients can select the common interface fields without knowing the concrete type.' },
                { term: 'Inline fragments', detail: 'Use fragments on a specific type to reach fields unique to that implementer.' },
              ],
            },
            example: "node(id: \"1\") { id ... on User { name } }",
          },
          {
            id: 'gql-resolve-type',
            code: "const resolvers = {\n  Node: {\n    __resolveType: (obj) =>\n      obj.title ? 'Post' : 'User'\n  }\n};",
            note: 'When a field returns an interface or union, the server needs __resolveType to tell which concrete type each value is. It inspects the object and returns the type name so the right fields resolve.',
            explanation: {
              heading: 'Resolving the concrete type',
              intro: 'When a field returns an abstract type, GraphQL must decide which concrete type each value actually is. The resolveType function makes that determination.',
              points: [
                { term: 'Abstract fields', detail: 'Interfaces and unions do not name a single concrete type, so runtime resolution is needed.' },
                { term: 'Inspects the value', detail: 'The function examines the returned object to detect distinguishing properties.' },
                { term: 'Returns a type name', detail: 'It returns the string name of the matching concrete type in the schema.' },
                { term: 'Drives field selection', detail: 'The chosen type determines which fields and fragments apply for that value.' },
              ],
            },
            example: "// __resolveType drives correct field selection at runtime",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'gql-unions',
    title: 'Unions',
    level: 1,
    slug: 'unions',
    concepts: [],
    children: [
      {
        id: 'gql-union-ops',
        title: 'Union Types',
        level: 2,
        slug: 'union-ops',
        concepts: [
          {
            id: 'gql-union-basic',
            code: "union SearchResult = User | Post | Comment\n\nquery {\n  search(term: \"graphql\") {\n    ... on User { name }\n    ... on Post { title }\n  }\n}",
            note: 'A union represents a field that returns one of several types with no shared fields. Unlike interfaces, unions declare no common fields, so you must use inline fragments per type.',
            explanation: {
              heading: 'One of several types',
              intro: 'A union type lists several object types that a field might return without requiring any shared fields. It models heterogeneous results such as mixed search hits.',
              points: [
                { term: 'Member types', detail: 'The union enumerates the concrete object types a field can resolve to.' },
                { term: 'No common fields', detail: 'Unlike an interface, a union imposes no shared field contract on its members.' },
                { term: 'Inline fragments required', detail: 'Because there are no common fields, you select per type using inline fragments.' },
                { term: 'Heterogeneous results', detail: 'Unions fit results that group unrelated types, such as users, posts, and comments.' },
              ],
            },
            example: "// __typename tells clients which concrete type was returned",
          },
          {
            id: 'gql-union-typename',
            code: "query {\n  search(term: \"x\") {\n    __typename\n    ... on User { name }\n    ... on Post { title }\n  }\n}",
            note: 'Requesting __typename returns the concrete type name for each result, letting clients branch on it to render the right component. It is the standard way to discriminate union members on the client.',
            explanation: {
              heading: 'Discriminating with typename',
              intro: 'The typename meta-field returns the concrete type name of each object in a response. It is the standard tool for handling abstract types on the client.',
              points: [
                { term: 'Meta-field', detail: 'typename is available on every object and needs no schema definition.' },
                { term: 'Concrete name', detail: 'It returns the actual type of each value, such as User or Post.' },
                { term: 'Client branching', detail: 'Clients switch on the returned name to render the matching component.' },
                { term: 'Cache normalization', detail: 'Client caches also use typename to key and normalize stored objects.' },
              ],
            },
            example: "// switch on result.__typename in client code",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'gql-fragments',
    title: 'Fragments',
    level: 1,
    slug: 'fragments',
    concepts: [],
    children: [
      {
        id: 'gql-fragment-ops',
        title: 'Reusable Field Sets',
        level: 2,
        slug: 'fragment-ops',
        concepts: [
          {
            id: 'gql-fragment-basic',
            code: "fragment UserFields on User {\n  id\n  name\n  email\n}\n\nquery {\n  me { ...UserFields }\n  admin { ...UserFields }\n}",
            note: 'A fragment names a reusable selection set, reducing duplication across queries. Inline fragments (... on Type) handle interfaces and unions without a named definition.',
            explanation: {
              heading: 'Reusable selection sets',
              intro: 'A fragment captures a selection of fields under a name so it can be reused across queries. This keeps repeated field lists in one place.',
              points: [
                { term: 'Named definition', detail: 'A fragment is declared on a type and spread into queries with the spread operator.' },
                { term: 'Less duplication', detail: 'Shared field sets live in one fragment instead of being copied into every query.' },
                { term: 'Inline fragments', detail: 'An unnamed fragment on a type selects type-specific fields for interfaces and unions.' },
                { term: 'Easier maintenance', detail: 'Changing the fragment updates every query that spreads it.' },
              ],
            },
            example: "// Fragments keep queries DRY and maintainable",
          },
          {
            id: 'gql-fragment-colocation',
            code: "// Component declares exactly the data it needs\nconst UserCard_user = gql`\n  fragment UserCard_user on User { name avatarUrl }\n`;\n// Parent composes child fragments into one query",
            note: 'Fragment colocation lets each UI component define its own data requirements as a fragment, which parents compose into a single query. This keeps data needs beside the component that renders them.',
            explanation: {
              heading: 'Colocating data with UI',
              intro: 'Fragment colocation is a client pattern where each component declares the data it needs as a fragment. Parent components compose these fragments into one query.',
              points: [
                { term: 'Component owns its data', detail: 'A component defines a fragment listing exactly the fields it renders.' },
                { term: 'Parents compose', detail: 'A parent spreads child fragments into a single query for the whole view.' },
                { term: 'Local reasoning', detail: 'Data requirements live next to the code that uses them, easing changes.' },
                { term: 'Framework support', detail: 'Clients like Relay build tooling and guarantees on top of this pattern.' },
              ],
            },
            example: "// Client frameworks like Relay build on fragment colocation",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'gql-variables',
    title: 'Variables',
    level: 1,
    slug: 'variables',
    concepts: [],
    children: [
      {
        id: 'gql-variable-ops',
        title: 'Query Variables',
        level: 2,
        slug: 'variable-ops',
        concepts: [
          {
            id: 'gql-variable-basic',
            code: "query GetUser($id: ID!, $withPosts: Boolean = false) {\n  user(id: $id) {\n    name\n    posts @include(if: $withPosts) { title }\n  }\n}\n// variables: { \"id\": \"1\", \"withPosts\": true }",
            note: 'Variables parameterize an operation so the same query works with different inputs and stays cacheable. Declare them with a type and optional default in the operation signature.',
            explanation: {
              heading: 'Parameterizing operations',
              intro: 'Variables let one operation accept dynamic inputs passed alongside the query text. This keeps the query stable while the values change per request.',
              points: [
                { term: 'Declared with types', detail: 'Each variable is named and typed in the operation signature, optionally with a default.' },
                { term: 'Stable query text', detail: 'The document stays the same across requests, which improves caching and reuse.' },
                { term: 'Separate values', detail: 'Actual values are sent in a distinct variables object rather than inlined.' },
                { term: 'Server validation', detail: 'The server checks each value against its declared type before executing.' },
              ],
            },
            example: "// Variables are passed as a separate JSON object",
          },
          {
            id: 'gql-variable-input-object',
            code: "mutation Save($input: PostInput!) {\n  createPost(input: $input) { id }\n}\n// variables: { \"input\": { \"title\": \"Hi\", \"tags\": [\"a\"] } }",
            note: 'A variable can be a whole input object, keeping the query text stable while the client sends structured data. This separation improves security (no string interpolation) and caching of the query document.',
            explanation: {
              heading: 'Whole objects as variables',
              intro: 'A single variable can hold an entire input object rather than just a scalar. The client sends structured data while the query document stays fixed.',
              points: [
                { term: 'Structured payloads', detail: 'Complex nested inputs travel as one variable instead of many separate ones.' },
                { term: 'No string building', detail: 'Values never get concatenated into query text, avoiding brittle construction.' },
                { term: 'Injection safety', detail: 'Keeping values out of the query text removes a class of injection risks.' },
                { term: 'Better caching', detail: 'A stable document string can be cached and reused across different inputs.' },
              ],
            },
            example: "// Passing objects as variables avoids brittle query building",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'gql-directives',
    title: 'Directives',
    level: 1,
    slug: 'directives',
    concepts: [],
    children: [
      {
        id: 'gql-directive-ops',
        title: 'Query Directives',
        level: 2,
        slug: 'directive-ops',
        concepts: [
          {
            id: 'gql-directive-basic',
            code: "query($detailed: Boolean!) {\n  user(id: \"1\") {\n    name\n    bio @include(if: $detailed)\n    legacyId @deprecated\n  }\n}",
            note: 'Directives modify execution. @include and @skip conditionally add or omit fields based on variables. Schema directives like @deprecated annotate the type system.',
            explanation: {
              heading: 'Modifying execution',
              intro: 'Directives are annotations prefixed with an at sign that alter how a query executes or how the schema behaves. Two of them are built into every GraphQL server.',
              points: [
                { term: 'include', detail: 'Adds a field to the result only when its condition evaluates to true.' },
                { term: 'skip', detail: 'Omits a field when its condition is true, the inverse of include.' },
                { term: 'Variable driven', detail: 'The conditions are usually supplied by query variables at runtime.' },
                { term: 'Schema directives', detail: 'Annotations like deprecated describe the type system rather than a single query.' },
              ],
            },
            example: "field @skip(if: $hide) // omit when hide is true",
          },
          {
            id: 'gql-custom-directive',
            code: "directive @auth(role: Role!) on FIELD_DEFINITION\n\ntype Query {\n  adminStats: Stats! @auth(role: ADMIN)\n}",
            note: 'Custom schema directives declare reusable metadata that a server transforms into behavior, such as authorization, rate limiting, or formatting. They attach to schema locations like FIELD_DEFINITION.',
            explanation: {
              heading: 'Custom schema directives',
              intro: 'A custom directive defines reusable metadata that the server interprets to add behavior. It lets teams express cross-cutting concerns declaratively in the schema.',
              points: [
                { term: 'Declared once', detail: 'You define the directive name, its arguments, and the locations it may appear on.' },
                { term: 'Attaches to locations', detail: 'Directives target schema positions such as a field definition or an object type.' },
                { term: 'Server transforms it', detail: 'Server code reads the directive and wraps resolvers to enforce the intended behavior.' },
                { term: 'Common uses', detail: 'Authorization, rate limiting, and output formatting are typical applications.' },
              ],
            },
            example: "// @auth centralizes access control declaratively in the schema",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'gql-resolvers',
    title: 'Resolvers',
    level: 1,
    slug: 'resolvers',
    concepts: [],
    children: [
      {
        id: 'gql-resolver-ops',
        title: 'Field Resolvers',
        level: 2,
        slug: 'resolver-ops',
        concepts: [
          {
            id: 'gql-resolver-basic',
            code: "const resolvers = {\n  Query: {\n    user: (parent, args, ctx) => ctx.db.user(args.id)\n  },\n  User: {\n    posts: (user, args, ctx) => ctx.db.postsByAuthor(user.id)\n  }\n};",
            note: 'A resolver is a function that produces the value for a field. It receives parent, args, context, and info. Nested resolvers run per field, so batch with DataLoader to avoid N+1 queries.',
            explanation: {
              heading: 'Producing field values',
              intro: 'A resolver is the function the server runs to compute the value of a single field. Every field can have one, and they compose into the full response.',
              points: [
                { term: 'Four arguments', detail: 'Resolvers receive the parent value, the field arguments, a shared context, and an info object.' },
                { term: 'Parent chaining', detail: 'The parent argument is the value returned by the field one level up.' },
                { term: 'Shared context', detail: 'Context carries per-request state such as authentication and database handles.' },
                { term: 'Per-field execution', detail: 'Nested resolvers run for each field, so batching prevents repeated backend calls.' },
              ],
            },
            example: "// context carries auth, db handles, and per-request state",
          },
          {
            id: 'gql-dataloader',
            code: "const userLoader = new DataLoader(ids =>\n  db.usersByIds(ids)  // one batched query for many ids\n);\n// In a resolver:\nauthor: (post) => userLoader.load(post.authorId)",
            note: 'DataLoader batches the individual loads made across many resolvers in a single tick into one backend call and caches them per request. It is the standard cure for the N+1 query problem in GraphQL.',
            explanation: {
              heading: 'Solving the N plus 1 problem',
              intro: 'DataLoader is a utility that collects many individual data loads and coalesces them into a single batched backend call. It is the standard defense against redundant queries.',
              points: [
                { term: 'Batching', detail: 'Loads requested during one tick are gathered and sent as one batched query.' },
                { term: 'Per-request cache', detail: 'Repeated loads for the same key within a request return the cached value.' },
                { term: 'N plus 1 cure', detail: 'It collapses one query per item into a single query for all items.' },
                { term: 'Load function', detail: 'You provide a batch function that maps a list of keys to a list of values.' },
              ],
            },
            example: "// load() defers and coalesces requests into batchLoadFn",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'gql-aliases',
    title: 'Aliases',
    level: 1,
    slug: 'aliases',
    concepts: [],
    children: [
      {
        id: 'gql-alias-ops',
        title: 'Renaming Result Fields',
        level: 2,
        slug: 'alias-ops',
        concepts: [
          {
            id: 'gql-alias-basic',
            code: "query {\n  current: user(id: \"1\") { name }\n  previous: user(id: \"2\") { name }\n}",
            note: 'Aliases rename fields in the response, which is required when querying the same field with different arguments. Each alias becomes a distinct key in the result object.',
            explanation: {
              heading: 'Renaming result fields',
              intro: 'An alias assigns a different key to a field in the response. It is essential when the same field appears more than once with different arguments.',
              points: [
                { term: 'Custom response key', detail: 'The alias replaces the field name as the key in the returned JSON.' },
                { term: 'Avoids collisions', detail: 'Querying one field twice with different arguments needs distinct aliases.' },
                { term: 'Distinct entries', detail: 'Each alias becomes its own separate key in the result object.' },
                { term: 'Field unchanged', detail: 'Only the response key changes, not which server field is executed.' },
              ],
            },
            example: "// Without aliases the two user fields would collide",
          },
          {
            id: 'gql-alias-reshape',
            code: "query {\n  user(id: \"1\") {\n    displayName: name\n    contact: email\n  }\n}",
            note: 'Beyond disambiguation, aliases let a client shape response keys to match its own model, decoupling frontend field names from the schema. The server field is unchanged; only the JSON key differs.',
            explanation: {
              heading: 'Reshaping to fit the client',
              intro: 'Aliases do more than disambiguate; they let a client map schema field names onto its own preferred keys. This decouples frontend models from the server vocabulary.',
              points: [
                { term: 'Client-friendly keys', detail: 'A field can be renamed to match an existing client-side data structure.' },
                { term: 'Decoupling', detail: 'Frontend naming no longer has to track the exact schema field names.' },
                { term: 'Server unaffected', detail: 'The underlying resolver runs identically regardless of the alias chosen.' },
                { term: 'Only the key differs', detail: 'The value is the same, but it lands under the alias in the response.' },
              ],
            },
            example: "// Alias fields to fit an existing client-side data structure",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'gql-pagination',
    title: 'Pagination',
    level: 1,
    slug: 'pagination',
    concepts: [],
    children: [
      {
        id: 'gql-pagination-ops',
        title: 'Cursor Connections',
        level: 2,
        slug: 'pagination-ops',
        concepts: [
          {
            id: 'gql-pagination-basic',
            code: "query {\n  posts(first: 10, after: \"cursor123\") {\n    edges {\n      cursor\n      node { title }\n    }\n    pageInfo { hasNextPage endCursor }\n  }\n}",
            note: 'The Relay connection pattern paginates with edges (node + cursor) and pageInfo. Cursor-based paging is stable under inserts, unlike offset paging, and scales to large lists.',
            explanation: {
              heading: 'Cursor connections',
              intro: 'The connection pattern is a standard shape for cursor-based pagination popularized by Relay. It wraps results in edges and metadata rather than a plain list.',
              points: [
                { term: 'Edges and nodes', detail: 'Each edge holds a node, the actual item, plus a cursor marking its position.' },
                { term: 'pageInfo', detail: 'A metadata object reports whether more pages exist and the ending cursor.' },
                { term: 'Stable under inserts', detail: 'Cursors reference a position by key, so new items do not shift results.' },
                { term: 'Scales to large lists', detail: 'Fetching after a cursor avoids counting past skipped rows.' },
              ],
            },
            example: "// Pass endCursor as the next after value",
          },
          {
            id: 'gql-pagination-offset',
            code: "query {\n  posts(limit: 10, offset: 20) {\n    id\n    title\n  }\n}",
            note: 'Offset pagination (limit/offset) is simpler and fine for small, stable datasets or numbered pages. It can skip or repeat items when the underlying list changes, which cursor pagination avoids.',
            explanation: {
              heading: 'Offset pagination tradeoffs',
              intro: 'Offset pagination fetches a slice using a limit and a starting offset. It is simple to implement and understand but has drawbacks on changing data.',
              points: [
                { term: 'Limit and offset', detail: 'The client asks for a count of items starting from a numeric position.' },
                { term: 'Simple and familiar', detail: 'It maps naturally to numbered page controls and small datasets.' },
                { term: 'Drift on changes', detail: 'Inserts or deletes can cause items to be skipped or repeated between pages.' },
                { term: 'When to prefer cursors', detail: 'Infinite scroll and fast-changing lists are better served by cursor pagination.' },
              ],
            },
            example: "// Prefer cursors for infinite scroll and fast-changing data",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'gql-errors',
    title: 'Error Handling',
    level: 1,
    slug: 'errors',
    concepts: [],
    children: [
      {
        id: 'gql-error-ops',
        title: 'Errors and Partial Data',
        level: 2,
        slug: 'error-ops',
        concepts: [
          {
            id: 'gql-error-basic',
            code: "{\n  \"data\": { \"user\": null },\n  \"errors\": [{\n    \"message\": \"Not authorized\",\n    \"path\": [\"user\"],\n    \"extensions\": { \"code\": \"FORBIDDEN\" }\n  }]\n}",
            note: 'A GraphQL response can carry both data and errors. Each error includes a message, the path to the failing field, and an extensions object where servers put a machine-readable code for clients to branch on.',
            explanation: {
              heading: 'The errors array',
              intro: 'A GraphQL response can return a data object and an errors array together. Each error entry follows a defined shape that clients can inspect programmatically.',
              points: [
                { term: 'message', detail: 'A human-readable description of what went wrong, meant for developers.' },
                { term: 'path', detail: 'The path to the field that failed, locating the error within the response tree.' },
                { term: 'extensions', detail: 'A free-form object where servers place a machine-readable code and extra detail.' },
                { term: 'Branch on code', detail: 'Clients should switch on the extensions code rather than parsing the message.' },
              ],
            },
            example: "// Clients inspect extensions.code, not the human message",
          },
          {
            id: 'gql-error-partial',
            code: "// A nullable field that errors returns null there\n// while sibling fields still resolve successfully\n{ \"data\": { \"me\": { \"name\": \"A\", \"avatar\": null } }, \"errors\": [ ... ] }",
            note: 'Because GraphQL resolves fields independently, one failing nullable field returns null and records an error while the rest of the response still succeeds. This partial-success model is unique compared to REST.',
            explanation: {
              heading: 'Partial success model',
              intro: 'GraphQL resolves each field independently, so a single failure does not have to fail the whole response. This partial-success behavior differs from typical REST endpoints.',
              points: [
                { term: 'Independent fields', detail: 'Each field resolves on its own, so one failing field does not block its siblings.' },
                { term: 'Null plus error', detail: 'A failing nullable field returns null and adds an entry to the errors array.' },
                { term: 'Rest still succeeds', detail: 'Fields that resolve normally remain present alongside the partial nulls.' },
                { term: 'Design for resilience', detail: 'Choosing nullable fields lets one failure avoid sinking the entire query.' },
              ],
            },
            example: "// Design nullable fields so one failure need not sink the query",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'gql-introspection',
    title: 'Introspection',
    level: 1,
    slug: 'introspection',
    concepts: [],
    children: [
      {
        id: 'gql-introspection-ops',
        title: 'Querying the Schema',
        level: 2,
        slug: 'introspection-ops',
        concepts: [
          {
            id: 'gql-introspection-basic',
            code: "query {\n  __schema {\n    types { name kind }\n    queryType { name }\n  }\n  __type(name: \"User\") { fields { name } }\n}",
            note: 'GraphQL exposes its own schema through the __schema and __type meta-fields. Tools like GraphiQL and code generators use introspection to power autocomplete, docs, and type generation.',
            explanation: {
              heading: 'Querying the schema itself',
              intro: 'Introspection lets clients query the structure of the schema using special meta-fields. The API can describe itself in the same language used to query data.',
              points: [
                { term: 'schema meta-field', detail: 'It returns all types, root operations, and directives the server defines.' },
                { term: 'type meta-field', detail: 'It looks up a single named type and reports its fields and kind.' },
                { term: 'Powers tooling', detail: 'Editors and playgrounds use it for autocomplete and inline documentation.' },
                { term: 'Code generation', detail: 'Generators read the schema to produce typed client bindings.' },
              ],
            },
            example: "// Introspection makes the API self-documenting",
          },
          {
            id: 'gql-introspection-security',
            code: "// Production hardening (Apollo Server example)\nnew ApolloServer({\n  schema,\n  introspection: process.env.NODE_ENV !== 'production'\n});",
            note: 'Introspection can reveal your entire API surface, so many teams disable it in production or gate it behind auth to reduce reconnaissance by attackers. Persisted queries are a common complementary hardening step.',
            explanation: {
              heading: 'Hardening introspection',
              intro: 'The same introspection that helps developers can also help attackers map your API. Production deployments often restrict it as part of a broader security posture.',
              points: [
                { term: 'Exposes the surface', detail: 'Introspection reveals every type and field, aiding reconnaissance if left open.' },
                { term: 'Disable in production', detail: 'Many teams turn introspection off outside of development environments.' },
                { term: 'Gate behind auth', detail: 'An alternative is allowing introspection only for authenticated internal users.' },
                { term: 'Persisted queries', detail: 'Allowing only pre-registered operations further shrinks the attack surface.' },
              ],
            },
            example: "// Disable introspection in prod to shrink the attack surface",
          },
        ],
        children: [],
      },
    ],
  },
];

export default topics;
