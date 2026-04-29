<?php

use App\Models\Dev\Children\Children;


// check database connection
$conn = null;
$conn = checkDbConnection($conn);
// make use of classes
if (array_key_exists("id", $_GET)) {
    $val = new Children($conn);
    $val->setId($_GET["id"]);

    checkId($val->getId());
    $query = checkDelete($val);
    http_response_code(200); // OK
    returnSuccess($val, "Children Delete", $query);
}

checkEndpoint();
