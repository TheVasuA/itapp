// MS SQL Server (T-SQL) topic tree.

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  {
    id: 'tsql-variables',
    title: 'Variables',
    level: 1,
    slug: 'variables',
    concepts: [],
    children: [
      {
        id: 'tsql-declare-set',
        title: 'DECLARE and SET',
        level: 2,
        slug: 'declare-set',
        concepts: [
          {
            id: 'tsql-declare-basic',
            code: "DECLARE @count INT = 0;\nDECLARE @name NVARCHAR(100);\nSET @name = N'Production';\nSELECT @count = COUNT(*) FROM sys.tables;",
            note: "T-SQL variables use the @ prefix and are declared with DECLARE. SET assigns one value; SELECT can assign from a query and set several variables at once.",
            explanation: {
              heading: 'Declaring and Assigning Variables',
              intro: 'In T-SQL every local variable name begins with an at sign and must be declared before use, usually within the same batch. Assignment can happen at declaration or later through SET or SELECT.',
              points: [
                { term: 'DECLARE', detail: 'Introduces one or more typed variables and can supply an initial value inline, for example DECLARE at-count INT equals 0.' },
                { term: 'SET', detail: 'Assigns a single scalar value to one variable and is the clearest choice for straightforward assignments.' },
                { term: 'SELECT assignment', detail: 'Can populate several variables at once from a query, which is handy when reading multiple columns from one row.' },
                { term: 'Batch scope', detail: 'A variable lives only for the batch that declares it and is not visible to later batches separated by GO.' },
              ],
            },
            example: "DECLARE @now DATETIME2 = SYSDATETIME();",
          },
          {
            id: 'tsql-set-vs-select',
            code: "DECLARE @v INT;\nSET @v = (SELECT TOP 1 id FROM t ORDER BY id);  -- errors if >1 row\nSELECT @v = id FROM t WHERE id = -1;              -- leaves @v unchanged if no rows",
            note: "SET assigns exactly one value and errors if the subquery returns multiple rows. SELECT assigns from the last matching row and, importantly, leaves the variable untouched when no rows match.",
            explanation: {
              heading: 'SET Versus SELECT Assignment',
              intro: 'Both SET and SELECT can assign a value from a query, but they behave differently when the query returns zero or many rows. Choosing the right one prevents subtle logic bugs.',
              points: [
                { term: 'Multiple rows', detail: 'SET raises an error if its subquery returns more than one row, whereas SELECT silently keeps only the value from the last row processed.' },
                { term: 'No rows', detail: 'When the query matches nothing, SET stores NULL but SELECT leaves the variable at its previous value, which can surprise the unwary.' },
                { term: 'Safety', detail: 'Prefer SET for single-value assignments because its strictness surfaces unexpected cardinality instead of hiding it.' },
                { term: 'Multiple targets', detail: 'Use SELECT when you intentionally want to assign several variables from one row in a single pass.' },
              ],
            },
            example: "SELECT @v = 5;  -- simple literal assignment",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'tsql-control-flow',
    title: 'Control of Flow',
    level: 1,
    slug: 'control-flow',
    concepts: [],
    children: [
      {
        id: 'tsql-if-while',
        title: 'IF, WHILE, BEGIN/END',
        level: 2,
        slug: 'if-while',
        concepts: [
          {
            id: 'tsql-if-basic',
            code: "IF @count = 0\n  PRINT 'No records';\nELSE\nBEGIN\n  PRINT CONCAT('Found: ', @count);\nEND;",
            note: "IF/ELSE branch on a boolean expression. Wrap multiple statements in BEGIN/END. Use these in procedures and scripts for procedural logic.",
            explanation: {
              heading: 'Branching with IF and ELSE',
              intro: 'T-SQL provides procedural IF and ELSE for making decisions inside batches, procedures, and triggers. Unlike CASE, these control which statements actually run.',
              points: [
                { term: 'Boolean condition', detail: 'IF evaluates a predicate and runs the following statement only when it is true, optionally falling through to ELSE.' },
                { term: 'BEGIN and END', detail: 'A single statement follows IF by default, so wrap several statements in a BEGIN and END block to treat them as one unit.' },
                { term: 'EXISTS checks', detail: 'IF EXISTS with a subquery is an efficient way to branch on whether any matching rows are present.' },
                { term: 'Set-based first', detail: 'Reach for procedural branching for control logic, but keep data manipulation set-based whenever possible for performance.' },
              ],
            },
            example: "IF EXISTS (SELECT 1 FROM t WHERE id = 1) PRINT 'exists';",
          },
          {
            id: 'tsql-while-basic',
            code: "DECLARE @i INT = 1;\nWHILE @i <= 5\nBEGIN\n  PRINT @i;\n  SET @i = @i + 1;\nEND;",
            note: "WHILE loops while its condition is true. BREAK exits the loop and CONTINUE skips to the next iteration. Set-based SQL is preferred over loops when possible.",
            explanation: {
              heading: 'Iterating with WHILE',
              intro: 'The WHILE loop repeats a statement or block as long as its condition stays true. It is useful for batching work, but set-based operations usually outperform row-by-row loops.',
              points: [
                { term: 'Condition test', detail: 'The predicate is checked before each pass, so the body may never run if the condition is false to begin with.' },
                { term: 'BREAK', detail: 'Exits the loop immediately, skipping any remaining iterations.' },
                { term: 'CONTINUE', detail: 'Skips the rest of the current iteration and jumps back to re-evaluate the condition.' },
                { term: 'Batched deletes', detail: 'A common valid use is deleting or updating in chunks with DELETE TOP inside a loop to limit transaction and lock size.' },
              ],
            },
            example: "WHILE (SELECT COUNT(*) FROM queue) > 0 BEGIN DELETE TOP (100) FROM queue; END;",
          },
          {
            id: 'tsql-case-expression',
            code: "SELECT Name,\n  CASE\n    WHEN Salary >= 100000 THEN 'high'\n    WHEN Salary >= 50000 THEN 'medium'\n    ELSE 'low'\n  END AS Band\nFROM Employees;",
            note: "CASE is an expression, not a control-flow statement, so it works inside SELECT, WHERE, and ORDER BY. Use it for derived categories and conditional aggregation.",
            explanation: {
              heading: 'The CASE Expression',
              intro: 'CASE returns a value based on conditions and can appear anywhere an expression is allowed. Because it is not a statement, it composes naturally into queries.',
              points: [
                { term: 'Searched form', detail: 'A sequence of WHEN predicates evaluates top to bottom and returns the result of the first match, or the ELSE value otherwise.' },
                { term: 'Anywhere an expression fits', detail: 'CASE works in the select list, in WHERE and ORDER BY, and inside aggregate functions.' },
                { term: 'Conditional aggregation', detail: 'Wrapping CASE inside SUM or COUNT lets you compute pivoted totals without the PIVOT operator.' },
                { term: 'Implicit ELSE NULL', detail: 'When no branch matches and no ELSE is supplied, CASE returns NULL rather than raising an error.' },
              ],
            },
            example: "SELECT SUM(CASE WHEN Status='paid' THEN Total ELSE 0 END) FROM Orders;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'tsql-stored-procedures',
    title: 'Stored Procedures',
    level: 1,
    slug: 'stored-procedures',
    concepts: [],
    children: [
      {
        id: 'tsql-procs-usage',
        title: 'Procedures and Parameters',
        level: 2,
        slug: 'procs-usage',
        concepts: [
          {
            id: 'tsql-proc-basic',
            code: "CREATE PROCEDURE GetOrdersByCustomer\n  @CustomerId INT,\n  @Status NVARCHAR(20) = NULL\nAS\nBEGIN\n  SET NOCOUNT ON;\n  SELECT * FROM Orders\n  WHERE CustomerId = @CustomerId\n    AND (@Status IS NULL OR Status = @Status);\nEND;",
            note: "Stored procedures encapsulate reusable logic with optional default parameters. SET NOCOUNT ON suppresses row-count messages. Use OUTPUT parameters to return scalars.",
            explanation: {
              heading: 'Creating Stored Procedures',
              intro: 'A stored procedure packages T-SQL statements under a name so they can be executed repeatedly with different arguments. Procedures promote reuse, security, and cached execution plans.',
              points: [
                { term: 'Parameters', detail: 'Inputs are declared with the at sign and a type, and can carry a default value so callers may omit them.' },
                { term: 'SET NOCOUNT ON', detail: 'Suppresses the rows-affected messages, reducing network chatter and avoiding confusion for some client libraries.' },
                { term: 'Optional filters', detail: 'A predicate like at-Status IS NULL OR Status equals at-Status is a common pattern for parameters that may or may not be supplied.' },
                { term: 'Plan reuse', detail: 'Procedures let SQL Server cache and reuse a compiled plan, which can improve performance for frequently run logic.' },
              ],
            },
            example: "EXEC GetOrdersByCustomer @CustomerId = 42, @Status = 'shipped';",
          },
          {
            id: 'tsql-proc-output',
            code: "CREATE PROCEDURE CountOrders\n  @CustomerId INT,\n  @Total INT OUTPUT\nAS\nBEGIN\n  SELECT @Total = COUNT(*) FROM Orders WHERE CustomerId = @CustomerId;\nEND;",
            note: "OUTPUT parameters return scalar values to the caller. Declare a variable, pass it with OUTPUT on EXEC, and read it afterward. Procedures can also RETURN an integer status code.",
            explanation: {
              heading: 'Returning Values with OUTPUT',
              intro: 'Besides returning result sets, a procedure can hand scalar values back to the caller through OUTPUT parameters. This is the idiomatic way to return a computed number or identifier.',
              points: [
                { term: 'OUTPUT keyword', detail: 'Mark the parameter with OUTPUT in both the CREATE PROCEDURE definition and on the EXEC call.' },
                { term: 'Caller variable', detail: 'Declare a local variable, pass it with OUTPUT, then read its populated value after the procedure finishes.' },
                { term: 'RETURN code', detail: 'A procedure can also RETURN a single integer, conventionally used for a status or error code rather than data.' },
                { term: 'Multiple outputs', detail: 'A procedure may expose several OUTPUT parameters to return more than one scalar in a single call.' },
              ],
            },
            example: "DECLARE @n INT; EXEC CountOrders 42, @n OUTPUT; PRINT @n;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'tsql-functions',
    title: 'User-Defined Functions',
    level: 1,
    slug: 'functions',
    concepts: [],
    children: [
      {
        id: 'tsql-udf-usage',
        title: 'Scalar and Table Functions',
        level: 2,
        slug: 'udf-usage',
        concepts: [
          {
            id: 'tsql-scalar-udf',
            code: "CREATE FUNCTION dbo.FullName(@first NVARCHAR(50), @last NVARCHAR(50))\nRETURNS NVARCHAR(101)\nAS\nBEGIN\n  RETURN @first + N' ' + @last;\nEND;",
            note: "Scalar UDFs return a single value; inline table-valued functions return a table and often perform better. UDFs cannot modify data or use side effects.",
            explanation: {
              heading: 'Scalar User-Defined Functions',
              intro: 'A scalar UDF encapsulates a calculation that returns one value and can be called wherever an expression is valid. They aid readability but carry performance caveats.',
              points: [
                { term: 'Single return value', detail: 'RETURNS declares the scalar type, and a RETURN statement supplies the computed result.' },
                { term: 'No side effects', detail: 'Functions cannot modify data or call procedures that do, keeping them deterministic and safe to use in queries.' },
                { term: 'Performance cost', detail: 'Row-by-row scalar functions can slow queries, though SQL Server 2019 added inlining that mitigates this for many cases.' },
                { term: 'Schema qualify', detail: 'Call functions with the schema prefix such as dbo dot FullName so the engine resolves them without ambiguity.' },
              ],
            },
            example: "SELECT dbo.FullName(first_name, last_name) FROM employees;",
          },
          {
            id: 'tsql-tvf',
            code: "CREATE FUNCTION dbo.OrdersByYear(@year INT)\nRETURNS TABLE\nAS\nRETURN (SELECT * FROM Orders WHERE YEAR(OrderDate) = @year);",
            note: "Inline table-valued functions (iTVFs) are parameterized views that the optimizer can inline, unlike multi-statement TVFs which materialize results.",
            explanation: {
              heading: 'Inline Table-Valued Functions',
              intro: 'An inline table-valued function returns a rowset defined by a single RETURN query. Because the optimizer can expand it into the calling query, it behaves like a parameterized view.',
              points: [
                { term: 'RETURNS TABLE', detail: 'The body is one SELECT wrapped in RETURN, with no BEGIN and END block or intermediate variables.' },
                { term: 'Optimizer inlining', detail: 'SQL Server folds the function definition into the outer plan, so it can use indexes and statistics efficiently.' },
                { term: 'Versus multi-statement', detail: 'Multi-statement TVFs build results into a table variable first, which often hides row estimates and hurts plans.' },
                { term: 'Composable', detail: 'You query an inline TVF in the FROM clause just like a table or view, passing arguments in parentheses.' },
              ],
            },
            example: "SELECT * FROM dbo.OrdersByYear(2024);",
          },
          {
            id: 'tsql-cross-apply',
            code: "SELECT c.Name, o.Total\nFROM Customers c\nCROSS APPLY dbo.OrdersByYear(2024) o\nWHERE o.CustomerId = c.Id;",
            note: "APPLY invokes a table-valued function once per outer row, passing that row's columns as arguments. CROSS APPLY drops rows with no match; OUTER APPLY keeps them with NULLs.",
            explanation: {
              heading: 'CROSS APPLY and OUTER APPLY',
              intro: 'The APPLY operator joins each row of the left input to a table expression evaluated for that row. It shines when the right side depends on values from the left.',
              points: [
                { term: 'Correlated input', detail: 'Unlike a normal join, the right-hand table function or subquery can reference columns from the current outer row.' },
                { term: 'CROSS APPLY', detail: 'Behaves like an inner join, discarding outer rows for which the right side returns no rows.' },
                { term: 'OUTER APPLY', detail: 'Behaves like a left outer join, keeping every outer row and filling missing right-side columns with NULL.' },
                { term: 'Top-N per group', detail: 'APPLY paired with a TOP query is a clean way to fetch, for example, the most recent order per customer.' },
              ],
            },
            example: "SELECT * FROM t OUTER APPLY dbo.Recent(t.id) r;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'tsql-ctes',
    title: 'CTEs',
    level: 1,
    slug: 'ctes',
    concepts: [],
    children: [
      {
        id: 'tsql-cte-usage',
        title: 'WITH and Recursion',
        level: 2,
        slug: 'cte-usage',
        concepts: [
          {
            id: 'tsql-cte-basic',
            code: "WITH RankedSales AS (\n  SELECT SalesPersonId, SUM(Total) AS Revenue\n  FROM Sales GROUP BY SalesPersonId\n)\nSELECT * FROM RankedSales WHERE Revenue > 10000;",
            note: "A CTE defined with WITH scopes a named result set to the next statement. Recursive CTEs use an anchor and a recursive member joined by UNION ALL.",
            explanation: {
              heading: 'Common Table Expressions',
              intro: 'A CTE names a temporary result set introduced by WITH that exists only for the statement immediately following it. It improves readability and enables recursion.',
              points: [
                { term: 'WITH clause', detail: 'Defines the named query before the main SELECT, INSERT, UPDATE, or DELETE that references it.' },
                { term: 'Single-statement scope', detail: 'The CTE is visible only to the one statement that follows, unlike a view which persists in the schema.' },
                { term: 'Readability', detail: 'Breaking a complex query into named building blocks often reads more clearly than nested subqueries.' },
                { term: 'Foundation for recursion', detail: 'The same syntax supports recursive CTEs when an anchor and recursive member are combined with UNION ALL.' },
              ],
            },
            example: "WITH n AS (SELECT 1 AS x UNION ALL SELECT x+1 FROM n WHERE x<5) SELECT * FROM n;",
          },
          {
            id: 'tsql-cte-recursive',
            code: "WITH Org AS (\n  SELECT Id, Name, ManagerId, 0 AS Lvl FROM Employees WHERE ManagerId IS NULL\n  UNION ALL\n  SELECT e.Id, e.Name, e.ManagerId, o.Lvl + 1\n  FROM Employees e JOIN Org o ON e.ManagerId = o.Id\n)\nSELECT * FROM Org OPTION (MAXRECURSION 100);",
            note: "Recursive CTEs walk hierarchies with an anchor member and a recursive member. T-SQL caps recursion at 100 levels by default; override with OPTION (MAXRECURSION n).",
            explanation: {
              heading: 'Recursive CTEs',
              intro: 'A recursive CTE traverses hierarchical or graph-like data such as org charts or bills of materials. It repeatedly joins the CTE to itself until no new rows are produced.',
              points: [
                { term: 'Anchor member', detail: 'The first SELECT provides the starting rows, for example the top-level employees with no manager.' },
                { term: 'Recursive member', detail: 'The second SELECT references the CTE and joins to it, generating each next level of the hierarchy.' },
                { term: 'UNION ALL', detail: 'The anchor and recursive members must be combined with UNION ALL, which is required for recursion.' },
                { term: 'MAXRECURSION', detail: 'T-SQL stops after 100 iterations by default; OPTION MAXRECURSION n raises the cap, and zero removes it entirely.' },
              ],
            },
            example: "OPTION (MAXRECURSION 0);  -- unlimited (use with care)",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'tsql-merge',
    title: 'MERGE',
    level: 1,
    slug: 'merge',
    concepts: [],
    children: [
      {
        id: 'tsql-merge-usage',
        title: 'Upsert with MERGE',
        level: 2,
        slug: 'merge-usage',
        concepts: [
          {
            id: 'tsql-merge-basic',
            code: "MERGE INTO target AS t\nUSING source AS s ON t.id = s.id\nWHEN MATCHED THEN UPDATE SET t.name = s.name\nWHEN NOT MATCHED THEN INSERT (id, name) VALUES (s.id, s.name)\nWHEN NOT MATCHED BY SOURCE THEN DELETE;",
            note: "MERGE performs insert, update, and delete in one atomic statement by comparing target and source. Always terminate MERGE with a semicolon.",
            explanation: {
              heading: 'Upserting with MERGE',
              intro: 'MERGE compares a target table against a source and applies inserts, updates, and deletes based on whether rows match. It expresses an upsert in a single statement.',
              points: [
                { term: 'ON predicate', detail: 'The join condition determines which target rows correspond to which source rows.' },
                { term: 'WHEN MATCHED', detail: 'Handles rows found in both sides, typically performing an UPDATE of the target.' },
                { term: 'WHEN NOT MATCHED', detail: 'Handles source rows absent from the target, usually inserting them, while NOT MATCHED BY SOURCE can delete target-only rows.' },
                { term: 'Semicolon required', detail: 'A MERGE statement must end with a semicolon, and testing it carefully is wise given historically reported edge-case bugs.' },
              ],
            },
            example: "MERGE dim AS t USING stg AS s ON t.k=s.k WHEN NOT MATCHED THEN INSERT(k) VALUES(s.k);",
          },
          {
            id: 'tsql-merge-output',
            code: "MERGE INTO target AS t\nUSING source AS s ON t.id = s.id\nWHEN MATCHED THEN UPDATE SET t.name = s.name\nWHEN NOT MATCHED THEN INSERT (id, name) VALUES (s.id, s.name)\nOUTPUT $action, inserted.id, deleted.name;",
            note: "The OUTPUT clause reports what MERGE did per row: $action returns 'INSERT', 'UPDATE', or 'DELETE', while inserted/deleted expose new and old values for auditing.",
            explanation: {
              heading: 'Capturing MERGE Results',
              intro: 'The OUTPUT clause reports exactly what MERGE did to each row, which is invaluable for auditing and for feeding downstream processes. It exposes both the action and the affected data.',
              points: [
                { term: 'Dollar-sign action', detail: 'The special column shows whether each row was inserted, updated, or deleted as a text value.' },
                { term: 'inserted pseudo-table', detail: 'Holds the new column values for rows that were inserted or updated.' },
                { term: 'deleted pseudo-table', detail: 'Holds the prior column values for rows that were updated or deleted, enabling before-and-after comparisons.' },
                { term: 'INTO a table', detail: 'OUTPUT can stream its rows into a table or table variable to persist an audit trail of the change.' },
              ],
            },
            example: "OUTPUT $action INTO @changes;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'tsql-error-handling',
    title: 'Error Handling',
    level: 1,
    slug: 'error-handling',
    concepts: [],
    children: [
      {
        id: 'tsql-try-catch',
        title: 'TRY/CATCH',
        level: 2,
        slug: 'try-catch',
        concepts: [
          {
            id: 'tsql-try-catch-basic',
            code: "BEGIN TRY\n  BEGIN TRANSACTION;\n  UPDATE accounts SET balance = balance - 100 WHERE id = 1;\n  COMMIT;\nEND TRY\nBEGIN CATCH\n  IF @@TRANCOUNT > 0 ROLLBACK;\n  THROW;\nEND CATCH;",
            note: "TRY/CATCH traps runtime errors. In CATCH, inspect ERROR_MESSAGE()/ERROR_NUMBER(), roll back if a transaction is open, and re-raise with THROW.",
            explanation: {
              heading: 'Structured Error Handling',
              intro: 'TRY and CATCH let T-SQL trap runtime errors and respond gracefully rather than aborting the batch. Pairing it with transactions ensures atomic recovery.',
              points: [
                { term: 'BEGIN TRY block', detail: 'Wraps the statements that might fail; if any error of sufficient severity occurs, control jumps to the CATCH block.' },
                { term: 'Error functions', detail: 'Inside CATCH, functions such as ERROR_MESSAGE, ERROR_NUMBER, and ERROR_SEVERITY describe what went wrong.' },
                { term: 'Rollback check', detail: 'Test at-at-TRANCOUNT and ROLLBACK any open transaction so partial work is not committed.' },
                { term: 'Re-raise', detail: 'Calling THROW with no arguments in CATCH re-raises the original error to the caller after cleanup.' },
              ],
            },
            example: "BEGIN CATCH SELECT ERROR_MESSAGE() AS msg; END CATCH;",
          },
          {
            id: 'tsql-throw-raiserror',
            code: "IF @qty < 0\n  THROW 50001, 'Quantity cannot be negative', 1;\n\n-- older style\nRAISERROR('Bad value: %d', 16, 1, @qty);",
            note: "THROW (2012+) raises an error with a number >= 50000, message, and state, and re-raises the original error when called bare in CATCH. RAISERROR is the older API supporting format arguments.",
            explanation: {
              heading: 'THROW Versus RAISERROR',
              intro: 'T-SQL offers two ways to raise your own errors. THROW is the modern, simpler choice, while RAISERROR remains for formatted messages and legacy code.',
              points: [
                { term: 'THROW', detail: 'Introduced in SQL Server 2012, it takes an error number of at least 50000, a message, and a state, and always uses severity 16.' },
                { term: 'Bare THROW', detail: 'Called with no arguments inside CATCH, it re-raises the current error preserving the original number and message.' },
                { term: 'RAISERROR', detail: 'The older statement supports printf-style format arguments and custom severity levels, but does not re-raise the original error.' },
                { term: 'Statement terminator', detail: 'The statement before THROW must be terminated with a semicolon, a common gotcha when adopting it.' },
              ],
            },
            example: "THROW;  -- re-raise the current error inside CATCH",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'tsql-temp-tables',
    title: 'Temp Tables and Table Variables',
    level: 1,
    slug: 'temp-tables',
    concepts: [],
    children: [
      {
        id: 'tsql-temp-usage',
        title: 'Temporary Storage',
        level: 2,
        slug: 'temp-usage',
        concepts: [
          {
            id: 'tsql-temp-basic',
            code: "CREATE TABLE #staging (id INT, name NVARCHAR(50));\nINSERT INTO #staging VALUES (1, 'a');\n\nDECLARE @vars TABLE (id INT, name NVARCHAR(50));\nINSERT INTO @vars VALUES (2, 'b');",
            note: "#temp tables live in tempdb, support indexes and statistics, and last for the session. Table variables (@var) are scoped to the batch and better for small sets.",
            explanation: {
              heading: 'Temp Tables and Table Variables',
              intro: 'Both temp tables and table variables hold intermediate rowsets in tempdb, but they differ in scope, statistics, and performance characteristics. Choosing correctly affects plan quality.',
              points: [
                { term: 'Hash temp tables', detail: 'A name prefixed with a single hash lives for the session, supports indexes and statistics, and suits larger intermediate results.' },
                { term: 'Table variables', detail: 'Declared with the at sign, they are scoped to the batch and generally best for small row counts.' },
                { term: 'Statistics', detail: 'Temp tables get column statistics that help the optimizer, whereas table variables historically estimate one row, though newer versions improved this.' },
                { term: 'Cleanup', detail: 'Temp tables drop automatically at session end but can be dropped explicitly with DROP TABLE to free tempdb sooner.' },
              ],
            },
            example: "SELECT * FROM #staging;  DROP TABLE #staging;",
          },
          {
            id: 'tsql-table-valued-param',
            code: "CREATE TYPE IdList AS TABLE (Id INT PRIMARY KEY);\n\nCREATE PROCEDURE DeleteMany @Ids IdList READONLY\nAS\n  DELETE FROM Orders WHERE Id IN (SELECT Id FROM @Ids);",
            note: "Table-valued parameters pass a whole set of rows to a procedure via a user-defined table type. The parameter is READONLY, making bulk operations one round trip instead of many.",
            explanation: {
              heading: 'Table-Valued Parameters',
              intro: 'Table-valued parameters let you send an entire set of rows to a procedure in one call, which is far more efficient than looping one row at a time. They rely on a user-defined table type.',
              points: [
                { term: 'CREATE TYPE', detail: 'A user-defined table type defines the columns and any keys the parameter will carry.' },
                { term: 'READONLY', detail: 'The parameter must be marked READONLY, so the procedure can read but not modify the passed rows.' },
                { term: 'One round trip', detail: 'Sending many rows at once avoids repeated network round trips and per-row overhead.' },
                { term: 'Set-based use', detail: 'Inside the procedure the parameter behaves like a table, so it joins or filters naturally against other tables.' },
              ],
            },
            example: "DECLARE @ids IdList; INSERT @ids VALUES (1),(2); EXEC DeleteMany @ids;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'tsql-window-functions',
    title: 'Window Functions and Ranking',
    level: 1,
    slug: 'window-functions',
    concepts: [],
    children: [
      {
        id: 'tsql-window-usage',
        title: 'OVER and Ranking',
        level: 2,
        slug: 'window-usage',
        concepts: [
          {
            id: 'tsql-window-rank',
            code: "SELECT Name, Department, Salary,\n  ROW_NUMBER() OVER (PARTITION BY Department ORDER BY Salary DESC) AS rn,\n  RANK() OVER (ORDER BY Salary DESC) AS rnk\nFROM Employees;",
            note: "Window functions compute over a set of rows with OVER. ROW_NUMBER, RANK, DENSE_RANK, NTILE rank rows; LAG/LEAD reach neighboring rows; SUM/AVG can use frames.",
            explanation: {
              heading: 'Window Functions and Ranking',
              intro: 'Window functions compute a value across a related set of rows defined by the OVER clause without collapsing them the way GROUP BY does. They power ranking and running calculations.',
              points: [
                { term: 'OVER clause', detail: 'Defines the window using optional PARTITION BY to group rows and ORDER BY to sequence them.' },
                { term: 'ROW_NUMBER', detail: 'Assigns a unique sequential number per partition, ideal for de-duplication and paging.' },
                { term: 'RANK and DENSE_RANK', detail: 'Both handle ties, but RANK leaves gaps in the numbering while DENSE_RANK does not.' },
                { term: 'Aggregate windows', detail: 'SUM or AVG with OVER and a frame clause produce running totals and moving averages.' },
              ],
            },
            example: "SELECT *, SUM(amt) OVER (ORDER BY dt ROWS UNBOUNDED PRECEDING) AS running FROM t;",
          },
          {
            id: 'tsql-window-lag-lead',
            code: "SELECT MonthEnd, Revenue,\n  LAG(Revenue) OVER (ORDER BY MonthEnd) AS PrevRevenue,\n  Revenue - LAG(Revenue) OVER (ORDER BY MonthEnd) AS Delta\nFROM MonthlySales;",
            note: "LAG and LEAD read a prior or following row's value within the window, ideal for period-over-period comparisons. Provide a default third argument to replace the edge NULL.",
            explanation: {
              heading: 'Offset Functions LAG and LEAD',
              intro: 'LAG and LEAD peek at values from earlier or later rows within an ordered window, so you can compare a row to its neighbors without a self-join. They are perfect for trend calculations.',
              points: [
                { term: 'LAG', detail: 'Returns a column value from a row that comes before the current one in the window ordering.' },
                { term: 'LEAD', detail: 'Returns a column value from a row that comes after the current one in the window ordering.' },
                { term: 'Offset argument', detail: 'An optional second argument controls how many rows back or forward to look, defaulting to one.' },
                { term: 'Default value', detail: 'A third argument supplies a fallback for the edge rows where no neighbor exists, replacing the NULL.' },
              ],
            },
            example: "SELECT LEAD(Revenue, 1, 0) OVER (ORDER BY MonthEnd) FROM MonthlySales;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'tsql-string-date-functions',
    title: 'String and Date Functions',
    level: 1,
    slug: 'string-date-functions',
    concepts: [],
    children: [
      {
        id: 'tsql-fns-usage',
        title: 'Common Functions',
        level: 2,
        slug: 'fns-usage',
        concepts: [
          {
            id: 'tsql-string-fns',
            code: "SELECT CONCAT(FirstName, ' ', LastName) AS FullName,\n       UPPER(Email),\n       LEFT(Phone, 3) AS AreaCode,\n       FORMAT(Salary, 'C', 'en-US') AS Pay\nFROM Employees;",
            note: "T-SQL string functions include CONCAT, UPPER/LOWER, LEFT/RIGHT, SUBSTRING, REPLACE, and STRING_AGG. FORMAT applies .NET format strings but is slower at scale.",
            explanation: {
              heading: 'String Functions',
              intro: 'T-SQL ships a rich set of string functions for building, trimming, and reshaping text. Knowing their NULL handling and performance traits helps you pick the right one.',
              points: [
                { term: 'CONCAT', detail: 'Joins arguments into one string and treats NULL inputs as empty, unlike the plus operator which propagates NULL.' },
                { term: 'Substring family', detail: 'LEFT, RIGHT, and SUBSTRING extract portions of a string by position and length.' },
                { term: 'STRING_AGG', detail: 'Concatenates values across rows into a single delimited string, replacing older FOR XML PATH tricks.' },
                { term: 'FORMAT caution', detail: 'FORMAT applies dot-NET culture-aware patterns but is notably slower, so avoid it in large result sets.' },
              ],
            },
            example: "SELECT STRING_AGG(Name, ', ') FROM Employees;",
          },
          {
            id: 'tsql-date-fns',
            code: "SELECT GETDATE(),\n       DATEADD(DAY, 7, OrderDate) AS Due,\n       DATEDIFF(DAY, OrderDate, GETDATE()) AS AgeDays,\n       YEAR(OrderDate) AS OrderYear\nFROM Orders;",
            note: "Date functions include GETDATE/SYSDATETIME, DATEADD, DATEDIFF, DATEPART, YEAR/MONTH/DAY, and EOMONTH. Use DATETIME2 for higher precision than DATETIME.",
            explanation: {
              heading: 'Date and Time Functions',
              intro: 'T-SQL provides functions to read the current time, do date arithmetic, and extract parts of a date. Picking the right type and function keeps calculations accurate.',
              points: [
                { term: 'Current time', detail: 'GETDATE returns a DATETIME while SYSDATETIME returns the more precise DATETIME2 value.' },
                { term: 'DATEADD and DATEDIFF', detail: 'DATEADD shifts a date by an interval, and DATEDIFF measures the whole boundaries crossed between two dates.' },
                { term: 'Extraction', detail: 'DATEPART, YEAR, MONTH, and DAY pull individual components out of a date value.' },
                { term: 'Prefer DATETIME2', detail: 'DATETIME2 offers greater precision and a wider range than the legacy DATETIME type, so favor it for new columns.' },
              ],
            },
            example: "SELECT EOMONTH(GETDATE()) AS MonthEnd;",
          },
          {
            id: 'tsql-string-split',
            code: "SELECT value\nFROM STRING_SPLIT('a,b,c', ',');\n\nSELECT TRIM(value) FROM STRING_SPLIT(@csv, ',') WHERE value <> '';",
            note: "STRING_SPLIT (2016+) turns a delimited string into a one-column table of values, the inverse of STRING_AGG. Combine with TRIM to clean whitespace from each element.",
            explanation: {
              heading: 'Splitting Delimited Strings',
              intro: 'STRING_SPLIT converts a delimited string into a set of rows, which is the natural inverse of aggregating rows into a string. It replaces hand-rolled splitter functions.',
              points: [
                { term: 'Table-valued result', detail: 'The function returns a one-column rowset named value that you query in the FROM clause.' },
                { term: 'Version support', detail: 'It was introduced in SQL Server 2016, with an ordinal column added in later versions to preserve element order.' },
                { term: 'Trim elements', detail: 'Wrapping value in TRIM removes stray whitespace around each piece of the split string.' },
                { term: 'Single-character delimiter', detail: 'The separator must be a single character, so multi-character delimiters need a different approach.' },
              ],
            },
            example: "SELECT COUNT(*) FROM STRING_SPLIT(@tags, ',');",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'tsql-transactions',
    title: 'Transactions',
    level: 1,
    slug: 'transactions',
    concepts: [],
    children: [
      {
        id: 'tsql-transactions-usage',
        title: 'Explicit Transactions',
        level: 2,
        slug: 'transactions-usage',
        concepts: [
          {
            id: 'tsql-transaction-basic',
            code: "BEGIN TRANSACTION;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT TRANSACTION;",
            note: "BEGIN TRANSACTION starts an explicit transaction; COMMIT or ROLLBACK ends it. @@TRANCOUNT tracks nesting. Combine with TRY/CATCH for safe error handling.",
            explanation: {
              heading: 'Explicit Transactions',
              intro: 'An explicit transaction groups several statements so they succeed or fail as a unit, preserving data integrity. Control statements mark its beginning and end.',
              points: [
                { term: 'BEGIN TRANSACTION', detail: 'Starts a transaction, after which changes are provisional until finalized.' },
                { term: 'COMMIT and ROLLBACK', detail: 'COMMIT makes all changes permanent, while ROLLBACK undoes everything since the transaction began.' },
                { term: 'TRANCOUNT', detail: 'The at-at-TRANCOUNT function reports the current nesting depth, useful for deciding whether to roll back.' },
                { term: 'Pair with TRY CATCH', detail: 'Wrapping transactions in TRY and CATCH ensures a failure triggers a rollback instead of leaving work half done.' },
              ],
            },
            example: "SET TRANSACTION ISOLATION LEVEL READ COMMITTED;",
          },
          {
            id: 'tsql-snapshot-isolation',
            code: "ALTER DATABASE Shop SET READ_COMMITTED_SNAPSHOT ON;\nSET TRANSACTION ISOLATION LEVEL SNAPSHOT;\nBEGIN TRAN;\nSELECT * FROM inventory;  -- reads a consistent version, no blocking\nCOMMIT;",
            note: "Snapshot isolation uses row versioning so readers see a consistent point-in-time view without blocking writers. Enable it at the database level before using SNAPSHOT transactions.",
            explanation: {
              heading: 'Snapshot Isolation',
              intro: 'Snapshot isolation lets readers see a consistent version of the data as of the transaction start, avoiding the blocking common under the default locking model. It relies on row versioning in tempdb.',
              points: [
                { term: 'Row versioning', detail: 'SQL Server keeps prior row versions so a reader gets a stable point-in-time view without taking shared locks.' },
                { term: 'Enable at database', detail: 'The database option ALLOW_SNAPSHOT_ISOLATION or READ_COMMITTED_SNAPSHOT must be turned on first.' },
                { term: 'Readers do not block writers', detail: 'Because reads use versions, they neither block nor are blocked by writes, improving concurrency.' },
                { term: 'Tempdb cost', detail: 'Version stores consume tempdb space, so plan capacity when enabling it on busy systems.' },
              ],
            },
            example: "SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'tsql-triggers',
    title: 'Triggers',
    level: 1,
    slug: 'triggers',
    concepts: [],
    children: [
      {
        id: 'tsql-triggers-usage',
        title: 'DML Triggers',
        level: 2,
        slug: 'triggers-usage',
        concepts: [
          {
            id: 'tsql-trigger-basic',
            code: "CREATE TRIGGER trg_audit ON Accounts\nAFTER UPDATE\nAS\nBEGIN\n  SET NOCOUNT ON;\n  INSERT INTO Audit (AccountId, OldBalance, NewBalance)\n  SELECT d.Id, d.Balance, i.Balance\n  FROM deleted d JOIN inserted i ON d.Id = i.Id;\nEND;",
            note: "DML triggers fire AFTER or INSTEAD OF INSERT/UPDATE/DELETE. The inserted and deleted pseudo-tables hold the new and old row versions and are set-based.",
            explanation: {
              heading: 'DML Triggers',
              intro: 'A DML trigger is code that runs automatically in response to data changes on a table. It is commonly used for auditing, enforcing rules, and cascading updates.',
              points: [
                { term: 'AFTER triggers', detail: 'Fire once the triggering INSERT, UPDATE, or DELETE has passed constraints, ideal for logging and auditing.' },
                { term: 'INSTEAD OF triggers', detail: 'Replace the triggering action, often used to make otherwise non-updatable views modifiable.' },
                { term: 'inserted and deleted', detail: 'These pseudo-tables expose the new and old row images and are central to writing trigger logic.' },
                { term: 'Same transaction', detail: 'Trigger code runs inside the statement transaction, so an error or ROLLBACK inside it undoes the change.' },
              ],
            },
            example: "CREATE TRIGGER t ON Orders INSTEAD OF DELETE AS BEGIN UPDATE Orders SET Deleted=1; END;",
          },
          {
            id: 'tsql-trigger-set-based',
            code: "CREATE TRIGGER trg_stock ON OrderItems\nAFTER INSERT\nAS\nBEGIN\n  UPDATE p SET Stock = p.Stock - i.Qty\n  FROM Products p\n  JOIN inserted i ON i.ProductId = p.Id;\nEND;",
            note: "Triggers fire once per statement, not per row, so inserted/deleted can hold many rows. Write set-based logic that joins to inserted/deleted rather than assuming a single row.",
            explanation: {
              heading: 'Writing Set-Based Triggers',
              intro: 'A frequent trigger mistake is assuming only one row changed. SQL Server fires the trigger once per statement, so the pseudo-tables may contain many rows.',
              points: [
                { term: 'Once per statement', detail: 'A single UPDATE affecting a thousand rows fires the trigger one time with a thousand rows in inserted.' },
                { term: 'Join, do not scalarize', detail: 'Join to inserted and deleted in set-based statements instead of reading a value into a variable.' },
                { term: 'UPDATE function', detail: 'The UPDATE column-check helps a trigger react only when a specific column was part of the statement.' },
                { term: 'Keep it lean', detail: 'Because triggers run inside the transaction, heavy logic increases lock duration and can hurt concurrency.' },
              ],
            },
            example: "IF UPDATE(Price) PRINT 'price changed';  -- column-level check",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'tsql-dynamic-sql',
    title: 'Dynamic SQL',
    level: 1,
    slug: 'dynamic-sql',
    concepts: [],
    children: [
      {
        id: 'tsql-dynamic-usage',
        title: 'sp_executesql',
        level: 2,
        slug: 'dynamic-usage',
        concepts: [
          {
            id: 'tsql-dynamic-basic',
            code: "DECLARE @sql NVARCHAR(MAX) = N'SELECT * FROM Orders WHERE CustomerId = @cid';\nEXEC sp_executesql @sql, N'@cid INT', @cid = 42;",
            note: "sp_executesql runs dynamically built SQL with parameters, avoiding injection and enabling plan reuse. Prefer it over EXEC(@sql) string concatenation.",
            explanation: {
              heading: 'Parameterized Dynamic SQL',
              intro: 'When a query must be built at runtime, sp_executesql runs the generated text while still binding values as parameters. This is both safer and faster than raw string concatenation.',
              points: [
                { term: 'Parameter binding', detail: 'A parameter definition string and named arguments pass data values without interpolating them into the SQL text.' },
                { term: 'Injection safety', detail: 'Binding values as parameters prevents malicious input from altering the statement structure.' },
                { term: 'Plan reuse', detail: 'Because the SQL text stays constant while values vary, SQL Server can cache and reuse the execution plan.' },
                { term: 'Prefer over EXEC', detail: 'Plain EXEC with a concatenated string cannot parameterize values and is more vulnerable and less cache-friendly.' },
              ],
            },
            example: "EXEC sp_executesql N'SELECT @@VERSION';",
          },
          {
            id: 'tsql-dynamic-quotename',
            code: "DECLARE @sql NVARCHAR(MAX) =\n  N'SELECT * FROM ' + QUOTENAME(@tableName) + N' WHERE id = @id';\nEXEC sp_executesql @sql, N'@id INT', @id = 5;",
            note: "Object names (table/column) cannot be parameterized, so wrap them with QUOTENAME to safely bracket-quote identifiers and block injection, while still binding data values as parameters.",
            explanation: {
              heading: 'Safely Quoting Identifiers',
              intro: 'Parameters bind data values, but table and column names cannot be parameterized. When those names are dynamic, QUOTENAME protects against injection through identifiers.',
              points: [
                { term: 'Why identifiers differ', detail: 'A parameter placeholder can stand in for a value but not for the name of a table or column.' },
                { term: 'QUOTENAME', detail: 'Wraps an identifier in square brackets and escapes any embedded brackets, neutralizing injection attempts.' },
                { term: 'Combine approaches', detail: 'Quote identifiers with QUOTENAME while still binding data values through sp_executesql parameters.' },
                { term: 'Validate where possible', detail: 'For maximum safety, also check dynamic object names against system catalog views before using them.' },
              ],
            },
            example: "SELECT QUOTENAME('my table');  -- [my table]",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'tsql-pivot',
    title: 'PIVOT and UNPIVOT',
    level: 1,
    slug: 'pivot',
    concepts: [],
    children: [
      {
        id: 'tsql-pivot-usage',
        title: 'Rotating Rows and Columns',
        level: 2,
        slug: 'pivot-usage',
        concepts: [
          {
            id: 'tsql-pivot-basic',
            code: "SELECT *\nFROM (SELECT Year, Quarter, Revenue FROM Sales) AS src\nPIVOT (SUM(Revenue) FOR Quarter IN ([Q1],[Q2],[Q3],[Q4])) AS p;",
            note: "PIVOT rotates row values into columns using an aggregate; UNPIVOT does the reverse, turning columns into rows. Column names in IN must be bracketed identifiers.",
            explanation: {
              heading: 'Rotating Data with PIVOT',
              intro: 'PIVOT reshapes rows into columns by aggregating one column across the distinct values of another. UNPIVOT performs the reverse transformation.',
              points: [
                { term: 'Aggregate required', detail: 'PIVOT applies an aggregate such as SUM to combine the source rows landing in each output cell.' },
                { term: 'FOR and IN', detail: 'The FOR clause names the column whose values become columns, listed as bracketed identifiers in IN.' },
                { term: 'Fixed column list', detail: 'The target columns must be known and listed explicitly, so a truly dynamic set needs dynamic SQL.' },
                { term: 'UNPIVOT', detail: 'Turns a set of columns back into rows, useful for normalizing wide tables into a tall format.' },
              ],
            },
            example: "SELECT * FROM t UNPIVOT (val FOR q IN ([Q1],[Q2])) AS u;",
          },
          {
            id: 'tsql-conditional-agg',
            code: "SELECT Year,\n  SUM(CASE WHEN Quarter='Q1' THEN Revenue END) AS Q1,\n  SUM(CASE WHEN Quarter='Q2' THEN Revenue END) AS Q2\nFROM Sales\nGROUP BY Year;",
            note: "Conditional aggregation with SUM(CASE ...) is a flexible alternative to PIVOT: it works across all versions, supports multiple measures, and reads clearly for a fixed set of columns.",
            explanation: {
              heading: 'Conditional Aggregation',
              intro: 'Wrapping a CASE expression inside an aggregate is a versatile way to pivot data manually. It often reads more clearly than PIVOT and handles several measures at once.',
              points: [
                { term: 'SUM with CASE', detail: 'Each output column sums a value only when the CASE condition matches, producing a pivoted total.' },
                { term: 'COUNT with CASE', detail: 'Counting a CASE that returns a value for matches and NULL otherwise tallies rows meeting a condition.' },
                { term: 'Multiple measures', detail: 'Unlike PIVOT which handles one aggregate, this technique can compute many different columns in one pass.' },
                { term: 'Version independent', detail: 'It works on every SQL Server version and needs no special operator, making it broadly portable.' },
              ],
            },
            example: "SELECT COUNT(CASE WHEN Status='paid' THEN 1 END) AS Paid FROM Orders;",
          },
        ],
        children: [],
      },
    ],
  },
  {
    id: 'tsql-top-identity',
    title: 'TOP and IDENTITY',
    level: 1,
    slug: 'top-identity',
    concepts: [],
    children: [
      {
        id: 'tsql-top',
        title: 'TOP',
        level: 2,
        slug: 'top',
        concepts: [
          {
            id: 'tsql-top-basic',
            code: "SELECT TOP (10) * FROM Orders ORDER BY Total DESC;\nSELECT TOP (5) PERCENT * FROM Orders ORDER BY Total DESC;",
            note: "TOP (n) limits the number of rows returned; TOP (n) PERCENT limits by percentage. Combine with ORDER BY for deterministic results and WITH TIES to include ties.",
            explanation: {
              heading: 'Limiting Rows with TOP',
              intro: 'TOP restricts how many rows a query returns or affects. Pairing it with ORDER BY is essential to make the selected rows predictable.',
              points: [
                { term: 'TOP with a count', detail: 'TOP inside parentheses returns the specified number of rows, and the parentheses are recommended modern syntax.' },
                { term: 'PERCENT', detail: 'TOP n PERCENT returns that fraction of the result set rather than a fixed count.' },
                { term: 'ORDER BY matters', detail: 'Without an ORDER BY, which rows appear is undefined, so always order for deterministic results.' },
                { term: 'WITH TIES', detail: 'Adding WITH TIES includes extra rows that share the boundary value of the ordering column.' },
              ],
            },
            example: "DELETE TOP (100) FROM Queue;",
          },
          {
            id: 'tsql-offset-fetch',
            code: "SELECT * FROM Orders\nORDER BY Id\nOFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY;",
            note: "OFFSET ... FETCH (2012+) implements SQL-standard paging and requires an ORDER BY. It is clearer than TOP for skip/take patterns driven by page number and page size.",
            explanation: {
              heading: 'Paging with OFFSET FETCH',
              intro: 'OFFSET and FETCH implement standard skip-and-take paging introduced in SQL Server 2012. They express page navigation more naturally than TOP-based workarounds.',
              points: [
                { term: 'OFFSET', detail: 'Skips a number of rows from the start of the ordered result before returning any.' },
                { term: 'FETCH NEXT', detail: 'Returns the next batch of rows, typically sized to the page length.' },
                { term: 'ORDER BY required', detail: 'The clause only works with an ORDER BY, since paging needs a defined row sequence.' },
                { term: 'Deep-page cost', detail: 'Large offsets still scan and discard the skipped rows, so keyset paging can be faster for very deep pages.' },
              ],
            },
            example: "OFFSET @page * @size ROWS FETCH NEXT @size ROWS ONLY;",
          },
        ],
        children: [],
      },
      {
        id: 'tsql-identity',
        title: 'IDENTITY',
        level: 2,
        slug: 'identity',
        concepts: [
          {
            id: 'tsql-identity-basic',
            code: "CREATE TABLE Users (\n  Id INT IDENTITY(1,1) PRIMARY KEY,\n  Email NVARCHAR(255)\n);\nINSERT INTO Users (Email) VALUES ('a@x.com');\nSELECT SCOPE_IDENTITY();",
            note: "IDENTITY(seed, increment) auto-numbers a column. SCOPE_IDENTITY() returns the last identity value generated in the current scope, safer than @@IDENTITY.",
            explanation: {
              heading: 'IDENTITY Columns',
              intro: 'An IDENTITY column auto-generates increasing numbers as rows are inserted, the usual way to create surrogate primary keys. Retrieving the generated value correctly matters.',
              points: [
                { term: 'Seed and increment', detail: 'IDENTITY takes a starting seed and a step, so IDENTITY of 1 comma 1 begins at one and rises by one.' },
                { term: 'SCOPE_IDENTITY', detail: 'Returns the last identity value produced in the current scope, avoiding values generated by triggers.' },
                { term: 'Avoid at-at-IDENTITY', detail: 'The at-at-IDENTITY function ignores scope and can return a value from a trigger, which is a common bug.' },
                { term: 'IDENTITY_INSERT', detail: 'Setting IDENTITY_INSERT ON temporarily lets you supply explicit values, useful during data migration.' },
              ],
            },
            example: "SET IDENTITY_INSERT Users ON;",
          },
          {
            id: 'tsql-sequence',
            code: "CREATE SEQUENCE OrderNo START WITH 1000 INCREMENT BY 1;\nSELECT NEXT VALUE FOR OrderNo;\nINSERT INTO Orders (No) VALUES (NEXT VALUE FOR OrderNo);",
            note: "SEQUENCE objects (2012+) generate numbers independent of any table, so several tables can share one counter. Unlike IDENTITY, you can fetch the next value before inserting.",
            explanation: {
              heading: 'SEQUENCE Objects',
              intro: 'A SEQUENCE is a standalone schema object that dispenses numbers on request, independent of any single table. It offers flexibility that IDENTITY cannot.',
              points: [
                { term: 'Shared counter', detail: 'Multiple tables can draw from one sequence, giving them values from a common pool.' },
                { term: 'NEXT VALUE FOR', detail: 'This expression fetches the next number and can be used before or during an insert.' },
                { term: 'Value before insert', detail: 'Unlike IDENTITY, you can obtain the key value first and then use it in related rows.' },
                { term: 'Configurable', detail: 'A sequence supports start, increment, cache, cycle, and can be RESTART-ed to a new value with ALTER SEQUENCE.' },
              ],
            },
            example: "ALTER SEQUENCE OrderNo RESTART WITH 5000;",
          },
        ],
        children: [],
      },
    ],
  },
];

export default topics;
