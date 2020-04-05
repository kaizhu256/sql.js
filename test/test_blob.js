"use strict";

exports.test = function (SQL, assert) {
    var array;
    var bigArray;
    var db;
    var i;
    var res;
    var stmt;

    db = new SQL.Database();
    // Insert binary data. This is invalid UTF8 on purpose
    db.exec(
        "CREATE TABLE test (data); INSERT INTO test VALUES (x'6162ff'),(x'00')"
    );

    stmt = db.prepare("INSERT INTO test VALUES (?)");
    bigArray = new Uint8Array(1e6);
    bigArray[500] = 0x42;
    stmt.run([bigArray]);

    stmt = db.prepare("SELECT * FROM test ORDER BY length(data) DESC");

    stmt.step();
    array = stmt.get()[0];
    assert.equal(
        array.length,
        bigArray.length,
        "BLOB read from the database should be the same size"
        + " as the one that was inserted"
    );
    for (i = 0; i < array.length; i += 1) {
        // Avoid doing 1e6 assert, to not pollute the console
        if (array[i] !== bigArray[i]) {
            assert.fail(
                array[i],
                bigArray[i],
                "The blob stored in the database should be exactly the same"
                + " as the one that was inserted"
            );
        }
    }

    stmt.step();
    res = stmt.get();
    assert.deepEqual(res, [new Uint8Array([0x61, 0x62, 0xff])], "Reading BLOB");

    stmt.step();
    res = stmt.get();
    assert.deepEqual(
        res,
        [new Uint8Array([0x00])],
        "Reading BLOB with a null byte"
    );

    assert.strictEqual(
        stmt.step(),
        false,
        "stmt.step() should return false after all values were read"
    );
    db.close();
};

if (module === require.main) {
    require("./load_sql_lib")(process.argv[2]).then(function (sql) {
        require("test").run({
            "test blob": function (assert) {
                exports.test(sql, assert);
            }
        });
    }).catch(function (e) {
        console.error(e);
    });
}
