"use strict";

exports.test = function (sql, assert) {
    var db;
    var expectedResult;
    var res;

    db = new sql.Database();
    res = db.exec("CREATE TABLE test (str_data, data);");

    db.run("INSERT INTO test VALUES ('Hello World!', 1);");
    db.run("INSERT INTO test VALUES ('', 2);");
    db.run("INSERT INTO test VALUES ('', 2);");
    db.run("INSERT INTO test VALUES ('', 4);");
    db.run("INSERT INTO test VALUES ('', 5);");
    db.run("INSERT INTO test VALUES ('', 6);");
    db.run("INSERT INTO test VALUES ('', 7);");
    db.run("INSERT INTO test VALUES ('', 8);");
    db.run("INSERT INTO test VALUES ('', 9);");

    res = db.exec("SELECT mode(data) FROM test;");
    expectedResult = [{
        columns: ["mode(data)"],
        values: [
            [2]
        ]
    }];
    assert.deepEqual(res, expectedResult, "mode() function works");

    res = db.exec("SELECT lower_quartile(data) FROM test;");
    expectedResult = [{
        columns: ["lower_quartile(data)"],
        values: [
            [2]
        ]
    }];
    assert.deepEqual(res, expectedResult, "upper_quartile() function works");

    res = db.exec("SELECT upper_quartile(data) FROM test;");
    expectedResult = [{
        columns: ["upper_quartile(data)"],
        values: [
            [7]
        ]
    }];
    assert.deepEqual(res, expectedResult, "upper_quartile() function works");

    res = db.exec("SELECT variance(data) FROM test;");
    assert.equal(
        res[0]["values"][0][0].toFixed(2),
        8.11,
        "variance() function works"
    );

    res = db.exec("SELECT stdev(data) FROM test;");
    assert.equal(
        res[0]["values"][0][0].toFixed(2),
        2.85,
        "stdev() function works"
    );

    res = db.exec("SELECT acos(data) FROM test;");
    assert.equal(
        res[0]["values"][0][0].toFixed(2),
        0,
        "acos() function works"
    );

    res = db.exec("SELECT asin(data) FROM test;");
    assert.equal(
        res[0]["values"][0][0].toFixed(2),
        1.57,
        "asin() function works"
    );

    res = db.exec("SELECT atan2(data, 1) FROM test;");
    assert.equal(
        res[0]["values"][0][0].toFixed(2),
        0.79,
        "atan2() function works"
    );

    res = db.exec("SELECT difference(str_data, 'ello World!') FROM test;");
    assert.equal(res[0]["values"][0][0], 3, "difference() function works");

    res = db.exec("SELECT ceil(4.1)");
    assert.equal(res[0]["values"][0][0], 5, "ceil() function works");

    res = db.exec("SELECT floor(4.1)");
    assert.equal(res[0]["values"][0][0], 4, "floor() function works");

    res = db.exec("SELECT pi()");
    assert.equal(
        res[0]["values"][0][0].toFixed(5),
        3.14159,
        "pi() function works"
    );

    res = db.exec("SELECT reverse(str_data) FROM test;");
    assert.equal(
        res[0]["values"][0][0],
        "!dlroW olleH",
        "reverse() function works"
    );
};

if (module === require.main) {
    require("./load_sql_lib")(process.argv[2]).then(function (sql) {
        require("test").run({
            "test extension functions": function (assert) {
                exports.test(sql, assert);
            }
        });
    }).catch(function (e) {
        console.error(e);
        assert.fail(e);
    });
}
