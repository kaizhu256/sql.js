/* jslint utility2:true */
/*global
    SQL
    importScripts
    initSqlJs
    postMessage
    self
*/
// Since this is only included in web worker builds,
// I'm not sure if we need to detect this.
// In fact, it seems like we might want to throw an error
// if importScripts isn't available.
var createDb;
var db;
var sqlModuleReady;

if (typeof importScripts === "function") {
    db = null;
    createDb = function (data) {
        if (db !== null) {
            db.close();
        }
        db = new SQL.Database(data);
        return db;
    };
    sqlModuleReady = initSqlJs();
    self.onmessage = function (event) {
        return sqlModuleReady.then(function () {
            var buff;
            var callback;
            var data;
            var done;
            var result;
            data = event.data;
            switch (
                data !== null
                ? data.action
                : undefined
            ) {
            case "open":
                buff = data.buffer;
                createDb(
                    buff
                    ? new Uint8Array(buff)
                    : undefined
                );
                return postMessage({
                    "id": data.id,
                    "ready": true
                });
            case "exec":
                if (db === null) {
                    createDb();
                }
                if (!data.sql) {
                    throw "exec: Missing query string";
                }
                return postMessage({
                    "id": data.id,
                    "results": db.exec(data.sql)
                });
            case "each":
                if (db === null) {
                    createDb();
                }
                callback = function (row) {
                    return postMessage({
                        "id": data.id,
                        "row": row,
                        "finished": false
                    });
                };
                done = function () {
                    return postMessage({
                        "id": data.id,
                        "finished": true
                    });
                };
                return db.each(data.sql, data.params, callback, done);
            case "export":
                buff = db.export();
                result = {
                    "id": data.id,
                    "buffer": buff
                };
                try {
                    return postMessage(result, [
                        result
                    ]);
                } catch (ignore) {
                    return postMessage(result);
                }
            case "close":
                return (
                    db !== null
                    ? db.close()
                    : undefined
                );
            default:
                throw new Error("Invalid action : " + (
                    data !== null
                    ? data.action
                    : undefined
                ));
            }
        }).catch(function (err) {
            return postMessage({
                "id": event.data.id,
                "error": err.message
            });
        });
    };
}
