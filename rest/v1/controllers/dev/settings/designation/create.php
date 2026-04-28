<?php

use App\Models\Dev\Settings\Designation\Designation;

// check database connection
$conn = null;
$conn = checkDbConnection($conn);
// make use of classes
$val = new Designation($conn);
$val->columnNames["designation_name"] = trim($data["designation_name"]);
$val->columnNames["designation_category_id"] = trim($data["designation_category_id"]);



// isNameExist($val, $val->columnNames["role_name"]);
$query = checkCreate($val);
http_response_code(201); // CREATED
returnSuccess($val, "Designation Create", $query);
