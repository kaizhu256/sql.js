/* jslint utility2:true */
/*global
    ALLOC_NORMAL
    FS
    HEAP8
    NULL
    RegisterExtensionFunctions
    _free
    allocate
    allocateUTF8OnStack
    getValue
    intArrayFromString
    setValue
    sqlite3_bind_blob
    sqlite3_bind_int
    sqlite3_bind_double
    sqlite3_bind_parameter_index
    sqlite3_bind_text
    sqlite3_clear_bindings
    sqlite3_column_blob
    sqlite3_column_bytes
    sqlite3_column_double
    sqlite3_column_name
    sqlite3_column_text
    sqlite3_column_type
    sqlite3_data_count
    sqlite3_exec
    sqlite3_finalize
    sqlite3_open
    sqlite3_prepare_v2
    sqlite3_prepare_v2_sqlptr
    sqlite3_reset
    sqlite3_step
    stackAlloc
    stackSave
*/
// @copyright Ophir LOJKINE

var Database; // jslint ignore:line
var SQLite;
var Statement;
var apiTemp;

apiTemp = stackAlloc(4);

SQLite = {};

/* Represents a prepared statement.

Prepared statements allow you to have a template sql string,
that you can execute multiple times with different parameters.

You can't instantiate this class directly, you have to use a
[Database](Database.html) object in order to create a statement.

**Warning**: When you close a database (using db.close()),
all its statements are closed too and become unusable.

@see Database.html#prepare-dynamic
@see https://en.wikipedia.org/wiki/Prepared_statement
 */



(function () {
    // Statements can't be created by the API user, only by Database::prepare
    // @private
    // @nodoc
    Statement = function (stmt1, db) {
        this.stmt = stmt1;
        this.db = db;
        // Index of the leftmost parameter is 1
        this.pos = 1;
        // Pointers to allocated memory,
        // that need to be freed when the statemend is destroyed
        this.allocatedmem = [];
    };

    /* Bind values to the parameters, after having reseted the statement

    SQL statements can have parameters,
    named *'?', '?NNN', ':VVV', '@VVV', '$VVV'*,
    where NNN is a number and VVV a string.
    This function binds these parameters to the given values.

    *Warning*: ':', '@', and '$' are included in the parameters names

    ## Binding values to named parameters
    @example Bind values to named parameters
        var stmt = db.prepare(
            "UPDATE test SET a=@newval WHERE id BETWEEN $mini AND $maxi"
        );
        stmt.bind({$mini:10, $maxi:20, '@newval':5});
    - Create a statement that contains parameters like '$VVV', ':VVV', '@VVV'
    - Call Statement.bind with an object as parameter

    ## Binding values to parameters
    @example Bind values to anonymous parameters
        var stmt = db.prepare("UPDATE test SET a=? WHERE id BETWEEN ? AND ?");
        stmt.bind([5, 10, 20]);
      - Create a statement that contains parameters like '?', '?NNN'
      - Call Statement.bind with an array as parameter

    ## Value types
    Javascript type | SQLite type
    --- | ---
    number | REAL, INTEGER
    boolean | INTEGER
    string | TEXT
    Array, Uint8Array | BLOB
    null | NULL
    @see http://www.sqlite.org/datatype3.html

    @see http://www.sqlite.org/lang_expr.html#varparam
    @param values [Array,Object] The values to bind
    @return [Boolean] true if it worked
    @throw [String] SQLite Error
      */

    Statement.prototype.bind = function (values) {
        if (!this.stmt) {
            throw "Statement closed";
        }
        this.reset();
        if (Array.isArray(values)) {
            return this.bindFromArray(values);
        } else {
            return this.bindFromObject(values);
        }
    };

    /* Execute the statement, fetching the the next line of result,
    that can be retrieved with [Statement.get()](#get-dynamic) .

    @return [Boolean] true if a row of result available
    @throw [String] SQLite Error
      */

    Statement.prototype.step = function () {
        var ret;
        if (!this.stmt) {
            throw "Statement closed";
        }
        this.pos = 1;
        ret = sqlite3_step(this.stmt);
        switch (ret) {
        case SQLite.ROW:
            return true;
        case SQLite.DONE:
            return false;
        default:
            return this.db.handleError(ret);
        }
    };

    // Internal methods to retrieve data from the results of a statement
    // that has been executed
    Statement.prototype.getNumber = function (pos) {
        if (pos === null) {
            pos = this.pos;
            this.pos += 1;
        }
        return sqlite3_column_double(this.stmt, pos);
    };

    Statement.prototype.getString = function (pos) {
        if (pos === null) {
            pos = this.pos;
            this.pos += 1;
        }
        return sqlite3_column_text(this.stmt, pos);
    };

    Statement.prototype.getBlob = function (pos) {
        var i;
        var ptr;
        var result;
        var size;
        if (pos === null) {
            pos = this.pos;
            this.pos += 1;
        }
        size = sqlite3_column_bytes(this.stmt, pos);
        ptr = sqlite3_column_blob(this.stmt, pos);
        result = new Uint8Array(size);
        i = 0;
        while (i < size) {
            result[i] = HEAP8[ptr + i];
            i += 1;
        }
        return result;
    };

    /* Get one row of results of a statement.
    If the first parameter is not provided, step must have been called
    before get.
    @param [Array,Object] Optional: If set, the values will be bound
    to the statement, and it will be executed
    @return [Array<String,Number,Uint8Array,null>] One row of result

    @example Print all the rows of the table test to the console

        var stmt = db.prepare("SELECT * FROM test");
        while (stmt.step()) console.log(stmt.get());
    */

    Statement.prototype.get = function (params) {
        var field;
        var ref;
        var results1;
        if (params !== null) {
            if (this.bind(params)) {
                this.step();
            }
        }
        results1 = [];
        field = 0;
        ref = sqlite3_data_count(this.stmt);
        while (field < ref) {
            switch (sqlite3_column_type(this.stmt, field)) {
            case SQLite.INTEGER:
            case SQLite.FLOAT:
                results1.push(this.getNumber(field));
                break;
            case SQLite.TEXT:
                results1.push(this.getString(field));
                break;
            case SQLite.BLOB:
                results1.push(this.getBlob(field));
                break;
            default:
                results1.push(null);
            }
            field += 1;
        }
        return results1;
    };

    /* Get the list of column names of a row of result of a statement.
    @return [Array<String>] The names of the columns
    @example

        var stmt = db.prepare(
            "SELECT 5 AS nbr, x'616200' AS data, NULL AS null_value;"
        );
        stmt.step(); // Execute the statement
        console.log(stmt.getColumnNames());
        // Will print ['nbr','data','null_value']
    */

    Statement.prototype.getColumnNames = function () {
        var i;
        var ref;
        var results1;
        results1 = [];
        i = 0;
        ref = sqlite3_data_count(this.stmt);
        while (i < ref) {
            results1.push(sqlite3_column_name(this.stmt, i));
            i += 1;
        }
        return results1;
    };

    /* Get one row of result as a javascript object, associating column names
    with their value in the current row.
    @param [Array,Object] Optional: If set, the values will be bound
    to the statement, and it will be executed
    @return [Object] The row of result
    @see [Statement.get](#get-dynamic)

    @example

        var stmt = db.prepare(
            "SELECT 5 AS nbr, x'616200' AS data, NULL AS null_value;"
        );
        stmt.step(); // Execute the statement
        console.log(stmt.getAsObject());
        // Will print {nbr:5, data: Uint8Array([1,2,3]), null_value:null}
    */

    Statement.prototype.getAsObject = function (params) {
        var i;
        var k;
        var len;
        var name;
        var names;
        var rowObject;
        var values;
        values = this.get(params);
        names = this.getColumnNames();
        rowObject = {};
        i = 0;
        k = 0;
        len = names.length;
        while (k < len) {
            name = names[i];
            rowObject[name] = values[i];
            k += 1;
            i = k;
        }
        return rowObject;
    };

    /* Shorthand for bind + step + reset
    Bind the values, execute the statement, ignoring the rows it returns,
    and resets it
    @param [Array,Object] Value to bind to the statement
      */

    Statement.prototype.run = function (values) {
        if (values !== null) {
            this.bind(values);
        }
        this.step();
        return this.reset();
    };

    // Internal methods to bind values to parameters
    Statement.prototype.bindString = function (string, pos) {
        var bytes;
        var strptr;
        if (pos === null) {
            pos = this.pos;
            this.pos += 1;
        }
        bytes = intArrayFromString(string);
        strptr = allocate(bytes, "i8", ALLOC_NORMAL);
        this.allocatedmem.push(strptr);
        this.db.handleError(
            sqlite3_bind_text(this.stmt, pos, strptr, bytes.length - 1, 0)
        );
        return true;
    };

    Statement.prototype.bindBlob = function (array, pos) {
        var blobptr;
        if (pos === null) {
            pos = this.pos;
            this.pos += 1;
        }
        blobptr = allocate(array, "i8", ALLOC_NORMAL);
        this.allocatedmem.push(blobptr);
        this.db.handleError(
            sqlite3_bind_blob(this.stmt, pos, blobptr, array.length, 0)
        );
        return true;
    };

    Statement.prototype.bindNumber = function (num, pos) {
        var bindfunc;
        if (pos === null) {
            pos = this.pos;
            this.pos += 1;
        }
        bindfunc = (
            num === (num | 0)
            ? sqlite3_bind_int
            : sqlite3_bind_double
        );
        this.db.handleError(bindfunc(this.stmt, pos, num));
        return true;
    };

    Statement.prototype.bindNull = function (pos) {
        if (pos === null) {
            pos = this.pos;
            this.pos += 1;
        }
        return sqlite3_bind_blob(this.stmt, pos, 0, 0, 0) === SQLite.OK;
    };

    // Call bindNumber or bindString appropriatly
    Statement.prototype.bindValue = function (val, pos) {
        if (pos === null) {
            pos = this.pos;
            this.pos += 1;
        }
        switch (typeof val) {
        case "string":
            return this.bindString(val, pos);
        case "number":
        case "boolean":
            return this.bindNumber(val + 0, pos);
        case "object":
            if (val === null) {
                return this.bindNull(pos);
            } else if (val.length !== null) {
                return this.bindBlob(val, pos);
            } else {
                throw (
                    "Wrong API use : tried to bind a value of an unknown type ("
                    + val
                    + ")."
                );
            }
        }
    };

    /* Bind names and values of an object to the named parameters
    of the statement
    @param [Object]
    @private
    @nodoc
    */

    Statement.prototype.bindFromObject = function (valuesObj) {
        Object.keys(valuesObj).forEach(function (name) {
            var num;
            var value;
            value = valuesObj[name];
            num = sqlite3_bind_parameter_index(this.stmt, name);
            if (num !== 0) {
                this.bindValue(value, num);
            }
        });
        return true;
    };

    /* Bind values to numbered parameters
    @param [Array]
    @private
    @nodoc
      */

    Statement.prototype.bindFromArray = function (values) {
        var k;
        var len;
        var num;
        var value;
        num = 0;
        k = 0;
        len = values.length;
        while (k < len) {
            value = values[num];
            this.bindValue(value, num + 1);
            k += 1;
            num = k;
        }
        return true;
    };

    /* Reset a statement, so that it's parameters can be bound to new values
    It also clears all previous bindings, freeing the memory
    used by bound parameters.
    */

    Statement.prototype.reset = function () {
        this.freemem();
        return (
            sqlite3_clear_bindings(this.stmt) === SQLite.OK
            && sqlite3_reset(this.stmt) === SQLite.OK
        );
    };

    /* Free the memory allocated during parameter binding
      */

    Statement.prototype.freemem = function () {
        var mem;
        while (true) {
            mem = this.allocatedmem.pop();
            if (!mem) {
                break;
            }
            _free(mem);
        }
        return null;
    };

    /* Free the memory used by the statement
    @return [Boolean] true in case of success
      */

    Statement.prototype.free = function () {
        var res;
        this.freemem();
        res = sqlite3_finalize(this.stmt) === SQLite.OK;
        delete this.db.statements[this.stmt];
        this.stmt = NULL;
        return res;
    };
}());



(function () {
    Database = function (data) {
        this.filename = "dbfile_" + (0xffffffff * Math.random() >>> 0);
        if (data !== null) {
            FS.createDataFile("/", this.filename, data, true, true);
        }
        this.handleError(sqlite3_open(this.filename, apiTemp));
        this.db = getValue(apiTemp, "i32");
        RegisterExtensionFunctions(this.db); // jslint ignore:line
        this.statements = {};
        this.functions = {};
    };

    /* Execute an SQL query, ignoring the rows it returns.

    @param sql [String] a string containing some SQL text to execute
    @param params [Array] (*optional*) When the SQL statement contains
    placeholders, you can pass them in here. They will be bound to the
    statement before it is executed.

    If you use the params argument, you **cannot** provide an sql string
    that contains several
    queries (separated by ';')

    @example Insert values in a table
        db.run(
            "INSERT INTO test VALUES (:age, :name)", {':age':18, ':name':'John'}
        );

    @return [Database] The database object (useful for method chaining)
    */

    Database.prototype.run = function (sql, params) {
        var stmt;
        if (!this.db) {
            throw "Database closed";
        }
        if (params) {
            stmt = this.prepare(sql, params);
            try {
                stmt.step();
            } catch (errCaught) {
                throw errCaught; // jslint ignore:line
            } finally {
                stmt.free();
            }
        } else {
            this.handleError(sqlite3_exec(this.db, sql, 0, 0, apiTemp));
        }
        return this;
    };

    /* Execute an SQL query, and returns the result.

    This is a wrapper against Database.prepare, Statement.step, Statement.get,
    and Statement.free.

    The result is an array of result elements. There are as many result elements
    as the number of statements in your sql string
    (statements are separated by a semicolon)

    Each result element is an object with two properties:
        'columns' : the name of the columns of the result
        (as returned by Statement.getColumnNames())
        'values' : an array of rows. Each row is itself an array of values

    ## Example use
    We have the following table, named *test* :

    | id | age |  name  |
    |:--:|:---:|:------:|
    | 1  |  1  | Ling   |
    | 2  |  18 | Paul   |
    | 3  |  3  | Markus |

    We query it like that:
    ```javascript
    var db = new SQL.Database();
    var res = db.exec("SELECT id FROM test; SELECT age,name FROM test;");
    ```

    `res` is now :
    ```javascript
        [
            {columns: ['id'], values:[[1],[2],[3]]},
            {
                columns: ['age','name'],
                values:[[1,'Ling'],[18,'Paul'],[3,'Markus']]
            }
        ]
    ```

    @param sql [String] a string containing some SQL text to execute
    @return [Array<QueryResults>] An array of results.
      */

/* jslint ignore:start */
    Database.prototype.exec = function (sql) {
        var curresult;
        var nextSqlPtr;
        var pStmt;
        var pzTail;
        var results;
        var stack;
        var stmt;
        if (!this.db) {
            throw "Database closed";
        }
        stack = stackSave();
        try {
            nextSqlPtr = allocateUTF8OnStack(sql);
            pzTail = stackAlloc(4);
            results = [];
            while (getValue(nextSqlPtr, "i8") !== NULL) {
                setValue(apiTemp, 0, "i32");
                setValue(pzTail, 0, "i32");
                this.handleError(
                    sqlite3_prepare_v2_sqlptr(
                        this.db,
                        nextSqlPtr,
                        -1,
                        apiTemp,
                        pzTail
                    )
                );
                pStmt = getValue(apiTemp, "i32");
                nextSqlPtr = getValue(pzTail, "i32");
                if (pStmt !== NULL) {
                    curresult = null;
                    stmt = new Statement(pStmt, this);
                    try {
                        while (stmt.step()) {
                            if (curresult === null) {
                                curresult = {
                                    "columns": stmt.getColumnNames(),
                                    "values": []
                                };
                                results.push(curresult);
                            }
                            curresult.values.push(stmt.get());
                        }
                    } finally {
                        stmt.free();
                    }
                }
            }
            return results;
        } finally {
            stackRestore(stack);
        }
    };
/* jslint ignore:end */

    /* Execute an sql statement, and call a callback for each row of result.

    **Currently** this method is synchronous, it will not return until
    the callback has
    been called on every row of the result. But this might change.

    @param sql [String] A string of SQL text. Can contain placeholders
    that will be
    bound to the parameters given as the second argument
    @param params [Array<String,Number,null,Uint8Array>] (*optional*) Parameters
    to bind to the query
    @param callback [Function(Object)] A function that will be called
    on each row of result
    @param done [Function] A function that will be called when all rows
    have been retrieved

    @return [Database] The database object. Useful for method chaining

    @example Read values from a table
        db.each(
            "SELECT name,age FROM users WHERE age >= $majority",
            {$majority:18},
            function(row){console.log(row.name + " is a grown-up.")}
        );
    */

    Database.prototype.each = function (sql, params, callback, done) {
        var stmt;
        if (typeof params === "function") {
            done = callback;
            callback = params;
            params = undefined;
        }
        stmt = this.prepare(sql, params);
        try {
            while (stmt.step()) {
                callback(stmt.getAsObject());
            }
        } catch (errCaught) {
            throw errCaught; // jslint ignore:line
        } finally {
            stmt.free();
        }
        if (typeof done === "function") {
            return done();
        }
    };

    /* Prepare an SQL statement
    @param sql [String] a string of SQL, that can contain placeholders
    ('?', ':VVV', ':AAA', '@AAA')
    @param params [Array] (*optional*) values to bind to placeholders
    @return [Statement] the resulting statement
    @throw [String] SQLite error
      */

    Database.prototype.prepare = function (sql, params) {
        var pStmt;
        var stmt;
        setValue(apiTemp, 0, "i32");
        this.handleError(sqlite3_prepare_v2(this.db, sql, -1, apiTemp, NULL));
        pStmt = getValue(apiTemp, "i32");
        if (pStmt === NULL) {
            throw "Nothing to prepare";
        }
        stmt = new Statement(pStmt, this);
        if (params !== null) {
            stmt.bind(params);
        }
        this.statements[pStmt] = stmt;
        return stmt;
    };

    /* Exports the contents of the database to a binary array
    @return [Uint8Array] An array of bytes of the SQLite3 database file
      */

    Database.prototype.export = function () {
        var _;
        var binaryDb;
        var func;
        var ref1;
        var ref;
        var stmt;
        ref = this.statements;
        for (_ in ref) {
            stmt = ref[_];
            stmt.free();
        }
        ref1 = this.functions;
        for (_ in ref1) {
            func = ref1[_];
            removeFunction(func);
        }
        this.functions = {};
        this.handleError(sqlite3_close_v2(this.db));
        binaryDb = FS.readFile(this.filename, {
            encoding: "binary"
        });
        this.handleError(sqlite3_open(this.filename, apiTemp));
        this.db = getValue(apiTemp, "i32");
        return binaryDb;
    };

    /* Close the database, and all associated prepared statements.

    The memory associated to the database and all associated statements
    will be freed.

    **Warning**: A statement belonging to a database that has been closed cannot
    be used anymore.

    Databases **must** be closed, when you're finished with them, or the
    memory consumption will grow forever
      */

    Database.prototype.close = function () {
        var _;
        var func;
        var ref1;
        var ref;
        var stmt;
        ref = this.statements;
        for (_ in ref) {
            stmt = ref[_];
            stmt.free();
        }
        ref1 = this.functions;
        for (_ in ref1) {
            func = ref1[_];
            removeFunction(func);
        }
        this.functions = {};
        this.handleError(sqlite3_close_v2(this.db));
        FS.unlink("/" + this.filename);
        return this.db = null;
    };

    /* Analyze a result code, return null if no error occured, and throw
    an error with a descriptive message otherwise
    @nodoc
      */

    Database.prototype.handleError = function (returnCode) {
        var errmsg;
        if (returnCode === SQLite.OK) {
            return null;
        } else {
            errmsg = sqlite3_errmsg(this.db);
            throw new Error(errmsg);
        }
    };

    /* Returns the number of rows modified, inserted or deleted by the
    most recently completed INSERT, UPDATE or DELETE statement on the
    database Executing any other type of SQL statement does not modify
    the value returned by this function.

    @return [Number] the number of rows modified
      */

    Database.prototype.getRowsModified = function () {
        return sqlite3_changes(this.db);
    };

    /* Register a custom function with SQLite
    @example Register a simple function
            db.create_function("addOne", function(x) {return x+1;})
            db.exec("SELECT addOne(1)") // = 2

    @param name [String] the name of the function as referenced in SQL statements.
    @param func [Function] the actual function to be executed.
      */

    Database.prototype.create_function = function (name, func) {
        var func_ptr;
        var wrapped_func;
        wrapped_func = function (cx, argc, argv) {
            var arg;
            var args;
            var blobptr;
            var data_func;
            var error;
            var i;
            var k;
            var ref;
            var result;
            var value_ptr;
            var value_type;
            args = [];
            i = 0;
            k = 0;
            ref = argc;
            while (
                0 <= ref
                ? k < ref
                : k > ref
            ) {
                value_ptr = getValue(argv + (4 * i), "i32");
                value_type = sqlite3_value_type(value_ptr);
                data_func = (function () {
                    switch (false) {
                    case value_type !== 1:
                        return sqlite3_value_double;
                    case value_type !== 2:
                        return sqlite3_value_double;
                    case value_type !== 3:
                        return sqlite3_value_text;
                    case value_type !== 4:
                        return function (ptr) {
                            var blob_arg;
                            var blob_ptr;
                            var j;
                            var l;
                            var ref1;
                            var size;
                            size = sqlite3_value_bytes(ptr);
                            blob_ptr = sqlite3_value_blob(ptr);
                            blob_arg = new Uint8Array(size);
                            j = 0;
                            l = 0;
                            ref1 = size;
                            while (
                                0 <= ref1
                                    ? l < ref1
                                : l > ref1
                            ) {
                                blob_arg[j] = HEAP8[blob_ptr + j];
                                l += (
                                    0 <= ref1
                                    ? 1
                                    : -1
                                );
                                j = l;
                            }
                            return blob_arg;
                        };
                    default:
                        return function (ptr) {
                            return null;
                        };
                    }
                })();
                arg = data_func(value_ptr);
                args.push(arg);
                k += (
                    0 <= ref
                    ? 1
                    : -1
                );
                i = k;
            }
            try {
                result = func.apply(null, args);
            } catch (error1) {
                error = error1;
                sqlite3_result_error(cx, error, -1);
                return;
            }
            switch (typeof result) {
            case "boolean":
            sqlite3_result_int(cx, result ? 1 : 0);
                break;
            case "number":
            sqlite3_result_double(cx, result);
                break;
            case "string":
            sqlite3_result_text(cx, result, -1, -1);
                break;
            case "object":
                if (result === null) {
                sqlite3_result_null(cx);
                } else if (result.length !== null) {
                    blobptr = allocate(result, "i8", ALLOC_NORMAL);
                        sqlite3_result_blob(cx, blobptr, result.length, -1);
                    _free(blobptr);
                } else {
                sqlite3_result_error(cx, "Wrong API use : tried to return a value of an unknown type (" + result + ").", -1);
                }
                break;
            default:
            sqlite3_result_null(cx);
            }
        };
        if (name in this.functions) {
            removeFunction(this.functions[name]);
            delete this.functions[name];
        }
        func_ptr = addFunction(wrapped_func);
        this.functions[name] = func_ptr;
        this.handleError(sqlite3_create_function_v2(this.db, name, func.length, SQLite.UTF8, 0, func_ptr, 0, 0, 0));
        return this;
    };

    return Database;
}());
