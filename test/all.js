"use strict";

var fs;
var sqlLibType;
var sqlLibLoader;

fs = require("fs");

sqlLibType = process.argv[2];
sqlLibLoader = require("./load_sql_lib");

Error.stackTraceLimit = 200;

sqlLibLoader(sqlLibType).then(function (sql) {
    var file;
    var files;
    var i;
    var m;
    var name;
    var testModule;
    files = fs.readdirSync(__dirname);
    for (i = 0; i < files.length; i += 1) {
        file = files[i];
        m = /^test_(.+)\.js$/.exec(file);
        if (m !== null) {
            name = m[1];
            testModule = require("./" + file);
            if (testModule.test) {
                exports["test " + name] = testModule.test.bind(null, sql);
            }
        }
    }
    if (module === require.main) require("test").run(exports);
}).catch(function (e) {
    console.error(e);
});
