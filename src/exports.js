/* jslint utility2:true */
var RegisterExtensionFunctions;
var i;
var sqlite3_bind_blob;
var sqlite3_bind_double;
var sqlite3_bind_int;
var sqlite3_bind_parameter_index;
var sqlite3_bind_text;
var sqlite3_changes;
var sqlite3_clear_bindings;
var sqlite3_close_v2;
var sqlite3_column_blob;
var sqlite3_column_bytes;
var sqlite3_column_double;
var sqlite3_column_name;
var sqlite3_column_text;
var sqlite3_column_type;
var sqlite3_create_function_v2;
var sqlite3_data_count;
var sqlite3_errmsg;
var sqlite3_exec;
var sqlite3_finalize;
var sqlite3_free;
var sqlite3_open;
var sqlite3_prepare_v2;
var sqlite3_prepare_v2_sqlptr;
var sqlite3_reset;
var sqlite3_result_blob;
var sqlite3_result_double;
var sqlite3_result_error;
var sqlite3_result_int64;
var sqlite3_result_int;
var sqlite3_result_null;
var sqlite3_result_text;
var sqlite3_step;
var sqlite3_value_blob;
var sqlite3_value_bytes;
var sqlite3_value_double;
var sqlite3_value_int;
var sqlite3_value_text;
var sqlite3_value_type;

sqlite3_open = Module.cwrap("sqlite3_open", "number", ["string", "number"]);
sqlite3_close_v2 = Module.cwrap("sqlite3_close_v2", "number", ["number"]);
sqlite3_exec = Module.cwrap(
    "sqlite3_exec",
    "number",
    [
        "number", "string", "number", "number", "number"
    ]
);
sqlite3_free = Module.cwrap("sqlite3_free", "", ["number"]);
sqlite3_changes = Module.cwrap("sqlite3_changes", "number", ["number"]);

// Prepared statements
//// prepare
sqlite3_prepare_v2 = Module.cwrap("sqlite3_prepare_v2", "number", ["number", "string", "number", "number", "number"]);
// Version of sqlite3_prepare_v2 to which a pointer to a string that is already
// in memory is passed.
sqlite3_prepare_v2_sqlptr = Module.cwrap("sqlite3_prepare_v2", "number", ["number", "number", "number", "number", "number"]);
//// Bind parameters

// int sqlite3_bind_text(sqlite3_stmt*, int, const char*, int n, void(*)(void*));
// We declare const char* as a number, because we will manually allocate the memory and pass a pointer to the function
sqlite3_bind_text = Module.cwrap("sqlite3_bind_text", "number", ["number", "number", "number", "number", "number"]);
sqlite3_bind_blob = Module.cwrap("sqlite3_bind_blob", "number", ["number", "number", "number", "number", "number"]);
sqlite3_bind_double = Module.cwrap("sqlite3_bind_double", "number", ["number", "number", "number"]);
sqlite3_bind_int = Module.cwrap("sqlite3_bind_int", "number", ["number", "number", "number"]);
sqlite3_bind_parameter_index = Module.cwrap("sqlite3_bind_parameter_index", "number", ["number", "string"]);
sqlite3_step = Module.cwrap("sqlite3_step", "number", ["number"]);
sqlite3_errmsg = Module.cwrap("sqlite3_errmsg", "string", ["number"]);
sqlite3_data_count = Module.cwrap("sqlite3_data_count", "number", ["number"]);
sqlite3_column_double = Module.cwrap("sqlite3_column_double", "number", ["number", "number"]);
sqlite3_column_text = Module.cwrap("sqlite3_column_text", "string", ["number", "number"]);
sqlite3_column_blob = Module.cwrap("sqlite3_column_blob", "number", ["number", "number"]);
sqlite3_column_bytes = Module.cwrap("sqlite3_column_bytes", "number", ["number", "number"]);
sqlite3_column_type = Module.cwrap("sqlite3_column_type", "number", ["number", "number"]);
sqlite3_column_name = Module.cwrap("sqlite3_column_name", "string", ["number", "number"]);
sqlite3_reset = Module.cwrap("sqlite3_reset", "number", ["number"]);
sqlite3_clear_bindings = Module.cwrap("sqlite3_clear_bindings", "number", ["number"]);
sqlite3_finalize = Module.cwrap("sqlite3_finalize", "number", ["number"]);
sqlite3_create_function_v2 = Module.cwrap("sqlite3_create_function_v2", "number", ["number", "string", "number", "number", "number", "number", "number", "number", "number"]);
sqlite3_value_type = Module.cwrap("sqlite3_value_type", "number", ["number"]);
sqlite3_value_bytes = Module.cwrap("sqlite3_value_bytes", "number", ["number"]);
sqlite3_value_text = Module.cwrap("sqlite3_value_text", "string", ["number"]);
sqlite3_value_int = Module.cwrap("sqlite3_value_int", "number", ["number"]);
sqlite3_value_blob = Module.cwrap("sqlite3_value_blob", "number", ["number"]);
sqlite3_value_double = Module.cwrap("sqlite3_value_double", "number", ["number"]);
sqlite3_result_double = Module.cwrap("sqlite3_result_double", "", ["number", "number"]);
sqlite3_result_null = Module.cwrap("sqlite3_result_null", "", ["number"]);
sqlite3_result_text = Module.cwrap("sqlite3_result_text", "", ["number", "string", "number", "number"]);
sqlite3_result_blob = Module.cwrap("sqlite3_result_blob", "", ["number", "number", "number", "number"]);
sqlite3_result_int = Module.cwrap("sqlite3_result_int", "", ["number", "number"]);
sqlite3_result_int64 = Module.cwrap("sqlite3_result_int64", "", ["number", "number"]);
sqlite3_result_error = Module.cwrap("sqlite3_result_error", "", ["number", "string", "number"]);
RegisterExtensionFunctions = Module.cwrap("RegisterExtensionFunctions", "number", ["number"]);
this.SQL = {
    "Database": Database
};
for (i in this.SQL) {
    Module[i] = this.SQL[i];
}
