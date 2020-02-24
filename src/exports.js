// Generated by CoffeeScript 1.12.7
var RegisterExtensionFunctions, i, sqlite3_bind_blob, sqlite3_bind_double, sqlite3_bind_int, sqlite3_bind_parameter_index, sqlite3_bind_text, sqlite3_changes, sqlite3_clear_bindings, sqlite3_close_v2, sqlite3_column_blob, sqlite3_column_bytes, sqlite3_column_double, sqlite3_column_name, sqlite3_column_text, sqlite3_column_type, sqlite3_create_function_v2, sqlite3_data_count, sqlite3_errmsg, sqlite3_exec, sqlite3_finalize, sqlite3_free, sqlite3_open, sqlite3_prepare_v2, sqlite3_prepare_v2_sqlptr, sqlite3_reset, sqlite3_result_blob, sqlite3_result_double, sqlite3_result_error, sqlite3_result_int, sqlite3_result_int64, sqlite3_result_null, sqlite3_result_text, sqlite3_step, sqlite3_value_blob, sqlite3_value_bytes, sqlite3_value_double, sqlite3_value_int, sqlite3_value_text, sqlite3_value_type;

sqlite3_open = Module['cwrap']('sqlite3_open', 'number', ['string', 'number']);

sqlite3_close_v2 = Module['cwrap']('sqlite3_close_v2', 'number', ['number']);

sqlite3_exec = Module['cwrap']('sqlite3_exec', 'number', ['number', 'string', 'number', 'number', 'number']);

sqlite3_free = Module['cwrap']('sqlite3_free', '', ['number']);

sqlite3_changes = Module['cwrap']('sqlite3_changes', 'number', ['number']);

sqlite3_prepare_v2 = Module['cwrap']('sqlite3_prepare_v2', 'number', ['number', 'string', 'number', 'number', 'number']);

sqlite3_prepare_v2_sqlptr = Module['cwrap']('sqlite3_prepare_v2', 'number', ['number', 'number', 'number', 'number', 'number']);

sqlite3_bind_text = Module['cwrap']('sqlite3_bind_text', 'number', ['number', 'number', 'number', 'number', 'number']);

sqlite3_bind_blob = Module['cwrap']('sqlite3_bind_blob', 'number', ['number', 'number', 'number', 'number', 'number']);

sqlite3_bind_double = Module['cwrap']('sqlite3_bind_double', 'number', ['number', 'number', 'number']);

sqlite3_bind_int = Module['cwrap']('sqlite3_bind_int', 'number', ['number', 'number', 'number']);

sqlite3_bind_parameter_index = Module['cwrap']('sqlite3_bind_parameter_index', 'number', ['number', 'string']);

sqlite3_step = Module['cwrap']('sqlite3_step', 'number', ['number']);

sqlite3_errmsg = Module['cwrap']('sqlite3_errmsg', 'string', ['number']);

sqlite3_data_count = Module['cwrap']('sqlite3_data_count', 'number', ['number']);

sqlite3_column_double = Module['cwrap']('sqlite3_column_double', 'number', ['number', 'number']);

sqlite3_column_text = Module['cwrap']('sqlite3_column_text', 'string', ['number', 'number']);

sqlite3_column_blob = Module['cwrap']('sqlite3_column_blob', 'number', ['number', 'number']);

sqlite3_column_bytes = Module['cwrap']('sqlite3_column_bytes', 'number', ['number', 'number']);

sqlite3_column_type = Module['cwrap']('sqlite3_column_type', 'number', ['number', 'number']);

sqlite3_column_name = Module['cwrap']('sqlite3_column_name', 'string', ['number', 'number']);

sqlite3_reset = Module['cwrap']('sqlite3_reset', 'number', ['number']);

sqlite3_clear_bindings = Module['cwrap']('sqlite3_clear_bindings', 'number', ['number']);

sqlite3_finalize = Module['cwrap']('sqlite3_finalize', 'number', ['number']);

sqlite3_create_function_v2 = Module['cwrap']('sqlite3_create_function_v2', 'number', ['number', 'string', 'number', 'number', 'number', 'number', 'number', 'number', 'number']);

sqlite3_value_type = Module['cwrap']('sqlite3_value_type', 'number', ['number']);

sqlite3_value_bytes = Module['cwrap']('sqlite3_value_bytes', 'number', ['number']);

sqlite3_value_text = Module['cwrap']('sqlite3_value_text', 'string', ['number']);

sqlite3_value_int = Module['cwrap']('sqlite3_value_int', 'number', ['number']);

sqlite3_value_blob = Module['cwrap']('sqlite3_value_blob', 'number', ['number']);

sqlite3_value_double = Module['cwrap']('sqlite3_value_double', 'number', ['number']);

sqlite3_result_double = Module['cwrap']('sqlite3_result_double', '', ['number', 'number']);

sqlite3_result_null = Module['cwrap']('sqlite3_result_null', '', ['number']);

sqlite3_result_text = Module['cwrap']('sqlite3_result_text', '', ['number', 'string', 'number', 'number']);

sqlite3_result_blob = Module['cwrap']('sqlite3_result_blob', '', ['number', 'number', 'number', 'number']);

sqlite3_result_int = Module['cwrap']('sqlite3_result_int', '', ['number', 'number']);

sqlite3_result_int64 = Module['cwrap']('sqlite3_result_int64', '', ['number', 'number']);

sqlite3_result_error = Module['cwrap']('sqlite3_result_error', '', ['number', 'string', 'number']);

RegisterExtensionFunctions = Module['cwrap']('RegisterExtensionFunctions', 'number', ['number']);

this['SQL'] = {
  'Database': Database
};

for (i in this['SQL']) {
  Module[i] = this['SQL'][i];
}
