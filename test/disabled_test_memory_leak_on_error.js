// See: https://github.com/kripken/sql.js/issues/306

"use strict";

exports.test = function (sql, assert) {
    var db;
    var errors;
    var i;
    var runs;
    errors = 0;
    runs = 10000;
    for (i = 0; i < runs; i += 1) {
        db = new sql.Database();
        try {
            db.exec("CREATE TABLE cats (name TEXT NOT NULL, age INTEGER NULL)");
            db.exec("INSERT INTO cats (name, age) VALUES (NULL, 3)");
        } catch (e) {
            errors += (
                e.toString() === "Error: NOT NULL constraint failed: cats.name"
            );
        }
        db.close();
    }
    assert.equal(
        errors,
        runs,
        "Multiple constraint violation errors do not trigger an OOM error"
    );
};

if (module === require.main) {
    require("./load_sql_lib")(process.argv[2]).then(function (sql) {
        require("test").run({
            "test memory leak on error": function (assert) {
                exports.test(sql, assert);
            }
        });
    }).catch(function (e) {
        console.error(e);
        assert.fail(e);
    });
}
