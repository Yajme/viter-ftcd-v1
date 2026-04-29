<?php

use App\Models\Dev\Children\Children;


// check database connection
$conn = null;
$conn = checkDbConnection($conn);
// make use of classes
$val = new Children($conn);


$val->columnNames["child_full_name"] = trim($data["child_full_name"]);
$val->columnNames["child_birthdate"] = trim($data["child_birthdate"]);
$val->columnNames["child_story"] = trim($data["child_story"]);
$val->columnNames["child_donation_limit"] = trim($data["child_donation_limit"]);
$val->columnNames["child_residency"] = trim($data["child_residency"]);

$query = checkCreate($val);
http_response_code(201); // CREATED
returnSuccess($val, "Roles Create", $query);
