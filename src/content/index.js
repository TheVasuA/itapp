// Content registry — the single source of every language in the catalog.
//
// Each language contributes a `meta` descriptor and a topic tree (an array of
// ConceptNodes). The Content Access Layer (lib/content.js) consumes this
// registry to build a language root node, resolve slugs, and enumerate routes.
//
// To add a language: create `src/content/<key>/meta.js` and
// `src/content/<key>/topics/index.js`, then import and register it below.

import javascriptMeta from './javascript/meta';
import javascriptTopics from './javascript/topics';
import pythonMeta from './python/meta';
import pythonTopics from './python/topics';

// Database - SQL
import sqlMeta from './sql/meta';
import sqlTopics from './sql/topics';
import mysqlMeta from './mysql/meta';
import mysqlTopics from './mysql/topics';
import postgresqlMeta from './postgresql/meta';
import postgresqlTopics from './postgresql/topics';
import sqliteMeta from './sqlite/meta';
import sqliteTopics from './sqlite/topics';
import mssqlMeta from './mssql/meta';
import mssqlTopics from './mssql/topics';
import oracleMeta from './oracle/meta';
import oracleTopics from './oracle/topics';
import mariadbMeta from './mariadb/meta';
import mariadbTopics from './mariadb/topics';

// Database - NoSQL
import mongodbMeta from './mongodb/meta';
import mongodbTopics from './mongodb/topics';
import redisMeta from './redis/meta';
import redisTopics from './redis/topics';
import cassandraMeta from './cassandra/meta';
import cassandraTopics from './cassandra/topics';
import neo4jMeta from './neo4j/meta';
import neo4jTopics from './neo4j/topics';
import elasticsearchMeta from './elasticsearch/meta';
import elasticsearchTopics from './elasticsearch/topics';
import dynamodbMeta from './dynamodb/meta';
import dynamodbTopics from './dynamodb/topics';
import graphqlMeta from './graphql/meta';
import graphqlTopics from './graphql/topics';
import sparqlMeta from './sparql/meta';
import sparqlTopics from './sparql/topics';
import influxdbMeta from './influxdb/meta';
import influxdbTopics from './influxdb/topics';
import promqlMeta from './promql/meta';
import promqlTopics from './promql/topics';
import typescriptMeta from './typescript/meta';
import typescriptTopics from './typescript/topics';
import javaMeta from './java/meta';
import javaTopics from './java/topics';
import csharpMeta from './csharp/meta';
import csharpTopics from './csharp/topics';
import goMeta from './go/meta';
import goTopics from './go/topics';
import phpMeta from './php/meta';
import phpTopics from './php/topics';
import rubyMeta from './ruby/meta';
import rubyTopics from './ruby/topics';
import scalaMeta from './scala/meta';
import scalaTopics from './scala/topics';
import haskellMeta from './haskell/meta';
import haskellTopics from './haskell/topics';
import cppMeta from './cpp/meta';
import cppTopics from './cpp/topics';
import cMeta from './c/meta';
import cTopics from './c/topics';
import rustMeta from './rust/meta';
import rustTopics from './rust/topics';
import assemblyMeta from './assembly/meta';
import assemblyTopics from './assembly/topics';
import kotlinMeta from './kotlin/meta';
import kotlinTopics from './kotlin/topics';
import swiftMeta from './swift/meta';
import swiftTopics from './swift/topics';
import dartMeta from './dart/meta';
import dartTopics from './dart/topics';
import objectivecMeta from './objectivec/meta';
import objectivecTopics from './objectivec/topics';
import perlMeta from './perl/meta';
import perlTopics from './perl/topics';
import bashMeta from './bash/meta';
import bashTopics from './bash/topics';
import rMeta from './r/meta';
import rTopics from './r/topics';
import matlabMeta from './matlab/meta';
import matlabTopics from './matlab/topics';

/**
 * Ordered category descriptors. Drives home-page section order and headings.
 * Each registered language's `category` must be one of these keys.
 * @type {Array<{ key: string, label: string, order: number }>}
 */
export const CATEGORIES = [
  { key: 'frontend', label: 'Frontend', order: 1 },
  { key: 'backend', label: 'Backend', order: 2 },
  { key: 'mobile', label: 'Mobile', order: 3 },
  { key: 'systems', label: 'Systems / Low-level', order: 4 },
  { key: 'scripting', label: 'Scripting & Automation', order: 5 },
  { key: 'data', label: 'Data & Scientific', order: 6 },
  { key: 'database-sql', label: 'Databases (SQL)', order: 7 },
  { key: 'database-nosql', label: 'NoSQL & Query Languages', order: 8 },
];

/** Set of allowed category keys for fast validation. */
export const CATEGORY_KEYS = new Set(CATEGORIES.map((c) => c.key));

/**
 * Language registry: key -> { meta, topics }.
 * `topics` is the ordered list of top-level ConceptNodes for the language.
 * @type {Object.<string, { meta: object, topics: object[] }>}
 */
export const registry = {
  javascript: { meta: javascriptMeta, topics: javascriptTopics },
  typescript: { meta: typescriptMeta, topics: typescriptTopics },
  python: { meta: pythonMeta, topics: pythonTopics },
  java: { meta: javaMeta, topics: javaTopics },
  csharp: { meta: csharpMeta, topics: csharpTopics },
  go: { meta: goMeta, topics: goTopics },
  php: { meta: phpMeta, topics: phpTopics },
  ruby: { meta: rubyMeta, topics: rubyTopics },
  scala: { meta: scalaMeta, topics: scalaTopics },
  haskell: { meta: haskellMeta, topics: haskellTopics },
  cpp: { meta: cppMeta, topics: cppTopics },
  c: { meta: cMeta, topics: cTopics },
  rust: { meta: rustMeta, topics: rustTopics },
  assembly: { meta: assemblyMeta, topics: assemblyTopics },
  kotlin: { meta: kotlinMeta, topics: kotlinTopics },
  swift: { meta: swiftMeta, topics: swiftTopics },
  dart: { meta: dartMeta, topics: dartTopics },
  objectivec: { meta: objectivecMeta, topics: objectivecTopics },
  perl: { meta: perlMeta, topics: perlTopics },
  bash: { meta: bashMeta, topics: bashTopics },
  r: { meta: rMeta, topics: rTopics },
  matlab: { meta: matlabMeta, topics: matlabTopics },

  // Database - SQL
  sql: { meta: sqlMeta, topics: sqlTopics },
  mysql: { meta: mysqlMeta, topics: mysqlTopics },
  postgresql: { meta: postgresqlMeta, topics: postgresqlTopics },
  sqlite: { meta: sqliteMeta, topics: sqliteTopics },
  mssql: { meta: mssqlMeta, topics: mssqlTopics },
  oracle: { meta: oracleMeta, topics: oracleTopics },
  mariadb: { meta: mariadbMeta, topics: mariadbTopics },

  // Database - NoSQL
  mongodb: { meta: mongodbMeta, topics: mongodbTopics },
  redis: { meta: redisMeta, topics: redisTopics },
  cassandra: { meta: cassandraMeta, topics: cassandraTopics },
  neo4j: { meta: neo4jMeta, topics: neo4jTopics },
  elasticsearch: { meta: elasticsearchMeta, topics: elasticsearchTopics },
  dynamodb: { meta: dynamodbMeta, topics: dynamodbTopics },
  graphql: { meta: graphqlMeta, topics: graphqlTopics },
  sparql: { meta: sparqlMeta, topics: sparqlTopics },
  influxdb: { meta: influxdbMeta, topics: influxdbTopics },
  promql: { meta: promqlMeta, topics: promqlTopics },
};

export default registry;
