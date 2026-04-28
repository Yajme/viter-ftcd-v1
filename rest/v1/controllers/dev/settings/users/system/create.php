<?php

use App\Models\Dev\Settings\Users\System\System;

// check database connection
$conn = null;
$conn = checkDbConnection($conn);
// make use of classes
$val = new System($conn);
$val->columnNames["user_name"] = trim($data["user_name"]);
$val->columnNames["user_email"] = $data["user_email"];
$val->columnNames["user_role_id"] = $data["user_role_id"];

// isNameExist($val, $val->columnNames["role_name"]);
$query = checkCreate($val);
http_response_code(201); // CREATED
returnSuccess($val, "Roles Create", $query);
