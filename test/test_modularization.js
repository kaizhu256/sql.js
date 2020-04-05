"use strict";

var targetFile = process.argv[2];
exports.test = function (SQL, assert, done, sqlLibFilename) {
    if (!sqlLibFilename) {
        // Whew - this is ugly and fragile and makes way too many assumptions
        // about how these tests are run from all.js
        // However, this is the quickest way to make sure that we are testing
        // the lib that is requested
        sqlLibFilename = (
            targetFile
                ? "../dist/sql-" + targetFile + ".js"
                : "../dist/sql-wasm.js"
        );
    }

    require(sqlLibFilename)().then(function (sqlModule1) {
        require(sqlLibFilename)().then(function (sqlModule2) {
            var db;
            assert.equal(
                SQL,
                sqlModule1,
                "Initializing the module multiple times only creates it once"
            );
            assert.equal(
                sqlModule1,
                sqlModule2,
                "Initializing the module multiple times only creates it once"
            );
            db = new sqlModule1.Database();
            assert.equal(
                Object.getPrototypeOf(db),
                SQL.Database.prototype,
                "sqlModule1 has a Database object that has the same prototype"
                + " as the originally loaded SQL module"
            );
            assert.equal(
                Object.getPrototypeOf(db),
                sqlModule2.Database.prototype,
                "sqlModule1 has a Database object that has the same prototype"
                + " as the sqlModule2"
            );


            db = new sqlModule2.Database();
            assert.equal(
                Object.getPrototypeOf(db),
                sqlModule1.Database.prototype,
                "sqlModule2 has a Database object that has the same prototype"
                + " as the sqlModule1"
            );

            done();
        });
    });
};

if (module === require.main) {
    require("./load_sql_lib")(targetFile).then(function (sql) {
        require("test").run({
            "test modularization": function (assert, done) {
                // TODO: Dry this up so that this code isn't duped
                // between here and load_sql_lib.js
                var sqlJsLibFilename = (
                    targetFile
                        ? "../dist/sql-" + targetFile + ".js"
                        : "../dist/sql-wasm.js"
                );
                exports.test(sql, assert, done, sqlJsLibFilename);
            }
        });
    }).catch(function (e) {
        console.error(e);
    });
}
