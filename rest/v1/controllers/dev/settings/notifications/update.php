<?php

use App\Models\Dev\Settings\Notifications\Notifications;



// check database connection
$conn = null;
$conn = checkDbConnection($conn);
// make use of classes
if (array_key_exists("id", $_GET)) {
    $val = new Notifications($conn);
$val->columnNames["notification_name"] = trim($data["notification_name"]);
$val->columnNames["notification_email"] = trim($data["notification_email"]);
$val->columnNames["notification_phone"] = trim($data["notification_phone"]);
$val->columnNames["notification_purpose"] = trim($data["notification_purpose"]);
 
    $val->id["value"] = $_GET["id"];

    //Data validation
    checkId($val->id["value"]);
    // compareName($val, $data["department_name_old"], $val->department_name);
    $query = checkUpdate($val);
    http_response_code(200); // OK
    returnSuccess($val, "Notifications Update", $query);
}

checkEndpoint();
