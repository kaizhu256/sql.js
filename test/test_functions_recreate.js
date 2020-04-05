"use strict";

exports.test = function (sql, assert) {
    var db;
    var i;
    var lastStep;
    var result;
    var result_str;
    function add() {
        return i;
    }
    // Test 1: Create a database, Register single function, close database,
    // repeat 1000 times
    for (i = 1; i <= 1000; i += 1) {
        lastStep = (i === 1000);
        db = new sql.Database();
        try {
            db.create_function("TestFunction" + i, add);
        } catch (e) {
            assert.ok(
                false,
                "Test 1: Recreate database "
                + i
                + "th times and register function failed with exception:" + e
            );
            db.close();
            break;
        }
        result = db.exec("SELECT TestFunction" + i + "()");
        result_str = result[0]["values"][0][0];
        if ((result_str !== i) || lastStep) {
            assert.equal(
                result_str,
                i,
                "Test 1: Recreate database "
                + i + "th times and register function"
            );
            db.close();
            break;
        }
        db.close();
    }

    // Test 2: Create a database, Register same function  1000 times,
    // close database
    db = new sql.Database();
    for (i = 1; i <= 1000; i += 1) {
        lastStep = (i === 1000);
        try {
            db.create_function("TestFunction", add);
        } catch (e) {
            assert.ok(
                false,
                "Test 2: Reregister function "
                + i + "th times failed with exception:" + e
            );
            break;
        }
        result = db.exec("SELECT TestFunction()");
        result_str = result[0]["values"][0][0];
        if ((result_str !== i) || lastStep) {
            assert.equal(
                result_str,
                i,
                "Test 2: Reregister function " + i + "th times"
            );
            break;
        }
    }
    db.close();
};


if (module === require.main) {
    var target_file = process.argv[2];
    var sql_loader = require("./load_sql_lib");
    sql_loader(target_file).then(function (sql) {
        require("test").run({
            "test creating multiple functions": function (assert) {
                exports.test(sql, assert);
            }
        });
    });
}
