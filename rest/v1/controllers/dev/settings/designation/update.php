<?php

use App\Models\Dev\Settings\Designation\Designation;

// check database connection
$conn = null;
$conn = checkDbConnection($conn);
// make use of classes
if (array_key_exists("id", $_GET)) {
    $val = new Designation($conn);
    $val->columnNames["designation_name"] = trim($data["designation_name"]);
    $val->columnNames["designation_category_id"] = $data["designation_category_id"];


    $val->id["value"] = $_GET["id"];

    //Data validation
    checkId($val->id["value"]);
    // compareName($val, $data["department_name_old"], $val->department_name);
    $query = checkUpdate($val);
    http_response_code(200); // OK
    returnSuccess($val, "System User Update", $query);
}

checkEndpoint();
