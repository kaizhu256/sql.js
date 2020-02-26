/* jslint utility2:true */
/*global Database Module*/
var RegisterExtensionFunctions; // jslint ignore:line
var sqlite3_bind_blob; // jslint ignore:line
var sqlite3_bind_double; // jslint ignore:line
var sqlite3_bind_int; // jslint ignore:line
var sqlite3_bind_parameter_index; // jslint ignore:line
var sqlite3_bind_text; // jslint ignore:line
var sqlite3_changes; // jslint ignore:line
var sqlite3_clear_bindings; // jslint ignore:line
var sqlite3_close_v2; // jslint ignore:line
var sqlite3_column_blob; // jslint ignore:line
var sqlite3_column_bytes; // jslint ignore:line
var sqlite3_column_double; // jslint ignore:line
var sqlite3_column_name; // jslint ignore:line
var sqlite3_column_text; // jslint ignore:line
var sqlite3_column_type; // jslint ignore:line
var sqlite3_create_function_v2; // jslint ignore:line
var sqlite3_data_count; // jslint ignore:line
var sqlite3_errmsg; // jslint ignore:line
var sqlite3_exec; // jslint ignore:line
var sqlite3_finalize; // jslint ignore:line
var sqlite3_free; // jslint ignore:line
var sqlite3_open; // jslint ignore:line
var sqlite3_prepare_v2; // jslint ignore:line
var sqlite3_prepare_v2_sqlptr; // jslint ignore:line
var sqlite3_reset; // jslint ignore:line
var sqlite3_result_blob; // jslint ignore:line
var sqlite3_result_double; // jslint ignore:line
var sqlite3_result_error; // jslint ignore:line
var sqlite3_result_int64; // jslint ignore:line
var sqlite3_result_int; // jslint ignore:line
var sqlite3_result_null; // jslint ignore:line
var sqlite3_result_text; // jslint ignore:line
var sqlite3_step; // jslint ignore:line
var sqlite3_value_blob; // jslint ignore:line
var sqlite3_value_bytes; // jslint ignore:line
var sqlite3_value_double; // jslint ignore:line
var sqlite3_value_int; // jslint ignore:line
var sqlite3_value_text; // jslint ignore:line
var sqlite3_value_type; // jslint ignore:line

sqlite3_open = Module.cwrap("sqlite3_open", "number", [
    "string", "number"
]);
sqlite3_close_v2 = Module.cwrap("sqlite3_close_v2", "number", [
    "number"
]);
sqlite3_exec = Module.cwrap("sqlite3_exec", "number", [
    "number", "string", "number", "number", "number"
]);
sqlite3_free = Module.cwrap("sqlite3_free", "", [
    "number"
]);
sqlite3_changes = Module.cwrap("sqlite3_changes", "number", [
    "number"
]);

// Prepared statements
//// prepare
sqlite3_prepare_v2 = Module.cwrap("sqlite3_prepare_v2", "number", [
    "number", "string", "number", "number", "number"
]);
// Version of sqlite3_prepare_v2 to which a pointer to a string that is already
// in memory is passed.
sqlite3_prepare_v2_sqlptr = Module.cwrap("sqlite3_prepare_v2", "number", [
    "number", "number", "number", "number", "number"
]);
//// Bind parameters

// int sqlite3_bind_text(
//     sqlite3_stmt*, int, const char*, int n, void(*)(void*)
// );
// We declare const char* as a number, because we will manually allocate
// the memory and pass a pointer to the function
sqlite3_bind_text = Module.cwrap("sqlite3_bind_text", "number", [
    "number", "number", "number", "number", "number"
]);
sqlite3_bind_blob = Module.cwrap("sqlite3_bind_blob", "number", [
    "number", "number", "number", "number", "number"
]);
sqlite3_bind_double = Module.cwrap("sqlite3_bind_double", "number", [
    "number", "number", "number"
]);
sqlite3_bind_int = Module.cwrap("sqlite3_bind_int", "number", [
    "number", "number", "number"
]);
sqlite3_bind_parameter_index = Module.cwrap(
    "sqlite3_bind_parameter_index",
    "number",
    [
        "number", "string"
    ]
);
sqlite3_step = Module.cwrap("sqlite3_step", "number", [
    "number"
]);
sqlite3_errmsg = Module.cwrap("sqlite3_errmsg", "string", [
    "number"
]);
sqlite3_data_count = Module.cwrap("sqlite3_data_count", "number", [
    "number"
]);
sqlite3_column_double = Module.cwrap("sqlite3_column_double", "number", [
    "number", "number"
]);
sqlite3_column_text = Module.cwrap("sqlite3_column_text", "string", [
    "number", "number"
]);
sqlite3_column_blob = Module.cwrap("sqlite3_column_blob", "number", [
    "number", "number"
]);
sqlite3_column_bytes = Module.cwrap("sqlite3_column_bytes", "number", [
    "number", "number"
]);
sqlite3_column_type = Module.cwrap("sqlite3_column_type", "number", [
    "number", "number"
]);
sqlite3_column_name = Module.cwrap("sqlite3_column_name", "string", [
    "number", "number"
]);
sqlite3_reset = Module.cwrap("sqlite3_reset", "number", [
    "number"
]);
sqlite3_clear_bindings = Module.cwrap("sqlite3_clear_bindings", "number", [
    "number"
]);
sqlite3_finalize = Module.cwrap("sqlite3_finalize", "number", [
    "number"
]);
sqlite3_create_function_v2 = Module.cwrap(
    "sqlite3_create_function_v2",
    "number",
    [
        "number",
        "string",
        "number",
        "number",
        "number",
        "number",
        "number",
        "number",
        "number"
    ]
);
sqlite3_value_type = Module.cwrap("sqlite3_value_type", "number", [
    "number"
]);
sqlite3_value_bytes = Module.cwrap("sqlite3_value_bytes", "number", [
    "number"
]);
sqlite3_value_text = Module.cwrap("sqlite3_value_text", "string", [
    "number"
]);
sqlite3_value_int = Module.cwrap("sqlite3_value_int", "number", [
    "number"
]);
sqlite3_value_blob = Module.cwrap("sqlite3_value_blob", "number", [
    "number"
]);
sqlite3_value_double = Module.cwrap("sqlite3_value_double", "number", [
    "number"
]);
sqlite3_result_double = Module.cwrap("sqlite3_result_double", "", [
    "number", "number"
]);
sqlite3_result_null = Module.cwrap("sqlite3_result_null", "", [
    "number"
]);
sqlite3_result_text = Module.cwrap("sqlite3_result_text", "", [
    "number", "string", "number", "number"
]);
sqlite3_result_blob = Module.cwrap("sqlite3_result_blob", "", [
    "number", "number", "number", "number"
]);
sqlite3_result_int = Module.cwrap("sqlite3_result_int", "", [
    "number", "number"
]);
sqlite3_result_int64 = Module.cwrap("sqlite3_result_int64", "", [
    "number", "number"
]);
sqlite3_result_error = Module.cwrap("sqlite3_result_error", "", [
    "number", "string", "number"
]);
RegisterExtensionFunctions = Module.cwrap(
    "RegisterExtensionFunctions",
    "number",
    [
        "number"
    ]
);
this.SQL = {
    "Database": Database
};
Object.keys(this.SQL).forEach(function (i) {
    Module[i] = this.SQL[i];
});
