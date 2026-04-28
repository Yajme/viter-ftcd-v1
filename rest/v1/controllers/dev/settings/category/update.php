<?php

use App\Models\Dev\Settings\Category\Category;


// check database connection
$conn = null;
$conn = checkDbConnection($conn);
// make use of classes
if (array_key_exists("id", $_GET)) {

    $val = new Category($conn);
    $val->columnNames["category_name"] = trim($data["category_name"]);
    $val->columnNames["category_description"] = $data["category_description"];

    $val->id["value"] = $_GET["id"];

    //Data validation
    checkId($val->id["value"]);
    // compareName($val, $data["department_name_old"], $val->department_name);
    $query = checkUpdate($val);
    http_response_code(200); // OK
    returnSuccess($val, "Category Update", $query);
}

checkEndpoint();
