<?php

use App\Models\Dev\Children\Children;


// check database connection
$conn = null;
$conn = checkDbConnection($conn);
// make use of classes
if (array_key_exists("id", $_GET)) {
    checkPayload($data);
    $val = new Children($conn);
    $val->id["value"] = $_GET["id"];
    $val->columnNames["child_is_active"] = $data["isActive"];
    checkId($val->id["value"]);
    $query = checkActive($val);
    http_response_code(200); // OK
    returnSuccess($val, "child Archive", $query);
}

checkEndpoint();
