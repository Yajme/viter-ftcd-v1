<?php

use App\Models\Dev\Settings\Category\Category;



// check database connection
$conn = null;
$conn = checkDbConnection($conn);
// make use of classes
$val = new Category($conn);
$val->columnNames["category_name"] = trim($data["category_name"]);
$val->columnNames["category_description"] = $data["category_description"];

// isNameExist($val, $val->columnNames["role_name"]);
$query = checkCreate($val);
http_response_code(201); // CREATED
returnSuccess($val, "Roles Create", $query);
