"use strict";

exports.test = function (SQL, assert) {
    var db = new SQL.Database();
    var expectedResult;
    var res;
    db.exec("CREATE TABLE test (data); INSERT INTO test VALUES (1);");

    // Open a transaction
    db.exec("BEGIN TRANSACTION;");

    // Insert a row
    db.exec("INSERT INTO test VALUES (4);");

    // Rollback
    db.exec("ROLLBACK;");

    res = db.exec("SELECT data FROM test WHERE data = 4;");
    expectedResult = [];
    assert.deepEqual(res, expectedResult, "transaction rollbacks work");

    // Open a transaction
    db.exec("BEGIN TRANSACTION;");

    // Insert a row
    db.exec("INSERT INTO test VALUES (4);");

    // Commit
    db.exec("COMMIT;");

    res = db.exec("SELECT data FROM test WHERE data = 4;");
    expectedResult = [{
        columns: ["data"],
        values: [
            [4]
        ]
    }];
    assert.deepEqual(res, expectedResult, "transaction commits work");

    // Open a transaction
    db.exec("BEGIN TRANSACTION;");

    // Insert a row
    db.exec("INSERT INTO test VALUES (5);");

    // Rollback
    db.exec("ROLLBACK;");

    res = db.exec("SELECT data FROM test WHERE data IN (4,5);");
    expectedResult = [{
        columns: ["data"],
        values: [
            [4]
        ]
    }];
    assert.deepEqual(
        res,
        expectedResult,
        "transaction rollbacks after commits work"
    );

    db.close();
};

if (module === require.main) {
    var target_file = process.argv[2];
    var sql_loader = require("./load_sql_lib");
    sql_loader(target_file).then(function (sql) {
        require("test").run({
            "test transactions": function (assert) {
                exports.test(sql, assert);
            }
        });
    }).catch(function (e) {
        console.error(e);
        assert.fail(e);
    });
}
