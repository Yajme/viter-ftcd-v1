<?php

use App\Models\Dev\Settings\Users\Roles\Roles;



// check database connection
$conn = null;
$conn = checkDbConnection($conn);
// make use of classes
$val = new Roles($conn);
$val->columnNames["role_name"] = trim($data["role_name"]);
$val->columnNames["role_description"] = $data["role_description"];


// isNameExist($val, $val->columnNames["role_name"]);
$query = checkCreate($val);
http_response_code(201); // CREATED
returnSuccess($val, "Roles Create", $query);
