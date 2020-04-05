"use strict";

exports.test = function (SQL, assert) {
    var count;
    var db;
    var dbCopy;
    var filebuffer;
    var fs;
    var newCount;
    var origCount;
    var path;

    fs = require("fs");
    path = require("path");

    filebuffer = fs.readFileSync(path.join(__dirname, "issue55.db"));

    // Works
    db = new SQL.Database(filebuffer);

    origCount = db.prepare(
        "SELECT COUNT(*) AS count FROM networklocation"
    ).getAsObject({}).count;

    db.run(
        "INSERT INTO networklocation (x, y, network_id, floor_id)"
        + " VALUES (?, ?, ?, ?)",
        [123, 123, 1, 1]
    );

    count = db.prepare(
        "SELECT COUNT(*) AS count FROM networklocation"
    ).getAsObject({}).count;

    assert.equal(count, origCount + 1, "The row has been inserted");
    dbCopy = new SQL.Database(db.export());
    newCount = dbCopy.prepare(
        "SELECT COUNT(*) AS count FROM networklocation"
    ).getAsObject({}).count;
    assert.equal(newCount, count, "export and reimport copies all the data");
};

if (module === require.main) {
    require("./load_sql_lib")(process.argv[2]).then(function (sql) {
        require("test").run({
            "test issue 55": function (assert) {
                exports.test(sql, assert);
            }
        });
    }).catch(function (e) {
        console.error(e);
        assert.fail(e);
    });
}
