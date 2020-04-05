"use strict";

module.exports = function (sqlLibraryType) {
    // Use sql-wasm.js by default
    var sqlJsLib = (
        sqlLibraryType
            ? "../dist/sql-" + sqlLibraryType + ".js"
            : "../dist/sql-wasm.js"
    );
    var begin = new Date();
    var initSqlJs = require(sqlJsLib);
    return initSqlJs().then(function (sql) {
        console.log(
            "Loaded and inited "
            + sqlJsLib
            + " in "
            + (new Date() - begin)
            + "ms"
        );
        return sql;
    });
};
