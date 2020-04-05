"use strict";

module.exports = function (sqlLibraryType) {
    var begin;
    var initSqlJs;
    var sqlJsLib;
    // Use sql-wasm.js by default
    sqlJsLib = (
        sqlLibraryType
            ? "../dist/sql-" + sqlLibraryType + ".js"
            : "../dist/sql-wasm.js"
    );
    begin = new Date();
    initSqlJs = require(sqlJsLib);
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
