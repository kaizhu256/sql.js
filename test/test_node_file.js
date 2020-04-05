"use strict";

exports.test = function (SQL, assert) {
    var db;
    var filebuffer;
    var fs;
    var path;
    var res;

    // Node filesystem module - You know that.
    fs = require("fs");

    // Ditto, path module
    path = require("path");

    filebuffer = fs.readFileSync(path.join(__dirname, "test.sqlite"));

    // Works
    db = new SQL.Database(filebuffer);

    // [{"columns":["id","content"],"values":[["0","hello"],["1","world"]]}]
    res = db.exec("SELECT * FROM test WHERE id = 0");
    assert.deepEqual(
        res,
        [{ columns: ["id", "content"], values: [[0, "hello"]] }],
        "One should be able to read the contents of an SQLite database file"
        + " read from disk"
    );
    db.close();
};

if (module === require.main) {
    require("./load_sql_lib")(process.argv[2]).then(function (sql) {
        require("test").run({
            "test node file": function (assert) {
                exports.test(sql, assert);
            }
        });
    }).catch(function (e) {
        console.error(e);
        assert.fail(e);
    });
}
