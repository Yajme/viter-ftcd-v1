<?php

use App\Models\Dev\Children\Children;

// check database connection
$conn = null;
$conn = checkDbConnection($conn);
// make use of classes
if (array_key_exists("id", $_GET)) {

    $val = new Children($conn);
    $val->columnNames["child_full_name"] = trim($data["child_full_name"]);
    $val->columnNames["child_birthdate"] = trim($data["child_birthdate"]);
    $val->columnNames["child_story"] = trim($data["child_story"]);
    $val->columnNames["child_donation_limit"] = trim($data["child_donation_limit"]);
    $val->columnNames["child_residency"] = trim($data["child_residency"]);

    $val->id["value"] = $_GET["id"];

    //Data validation
    checkId($val->id["value"]);
    // compareName($val, $data["department_name_old"], $val->department_name);
    $query = checkUpdate($val);
    http_response_code(200); // OK
    returnSuccess($val, "Children Update", $query);
}

checkEndpoint();
