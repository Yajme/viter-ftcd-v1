<?php

use App\Models\Dev\Settings\Users\System\System;

// check database connection
$conn = null;
$conn = checkDbConnection($conn);
// make use of classes
if (array_key_exists("id", $_GET)) {
    $val = new System($conn);
    $val->columnNames["user_name"] = trim($data["user_name"]);
    $val->columnNames["user_email"] = $data["user_email"];
    $val->columnNames["user_role_id"] = $data["user_role_id"];

    $val->id["value"] = $_GET["id"];

    //Data validation
    checkId($val->id["value"]);
    // compareName($val, $data["department_name_old"], $val->department_name);
    $query = checkUpdate($val);
    http_response_code(200); // OK
    returnSuccess($val, "System User Update", $query);
}

checkEndpoint();
