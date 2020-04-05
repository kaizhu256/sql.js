"use strict";

exports.test = function (sql, assert) {
    // Create a database
    var db = new sql.Database();
    // Ultra-simple query
    var stmt = db.prepare("VALUES (?)");
    // Bind null to the parameter and get the result
    assert.deepEqual(stmt.get([null]), [null],
        "binding a null value to a statement parameter");
    db.close();
};

if (module === require.main) {
    require("./load_sql_lib")(process.argv[2]).then(function (sql) {
        require("test").run({
            "test issue 76": function (assert) {
                exports.test(sql, assert);
            }
        });
    }).catch(function (e) {
        console.error(e);
        assert.fail(e);
    });
}
