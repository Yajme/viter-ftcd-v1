<?php

use App\Models\Dev\Settings\Users\Roles\Roles;


// check database connection
$conn = null;
$conn = checkDbConnection($conn);
// make use of classes
if (array_key_exists("id", $_GET)) {
    $val = new Roles($conn);
    $val->columnNames["role_name"] = trim($data["role_name"]);
    $val->columnNames["role_description"] = $data["role_description"];


    $val->id["value"] = $_GET["id"];

    //Data validation
    checkId($val->id["value"]);
    // compareName($val, $data["department_name_old"], $val->department_name);
    $query = checkUpdate($val);
    http_response_code(200); // OK
    returnSuccess($val, "System User Update", $query);
}

checkEndpoint();
