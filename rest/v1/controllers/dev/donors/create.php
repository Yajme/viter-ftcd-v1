<?php

use App\Models\Dev\Donor\Donors;

// check database connection
$conn = null;
$conn = checkDbConnection($conn);
// make use of classes
$val = new Donors($conn);

$val->columnNames["donor_is_active"] = trim($data["donor_is_active"]);
$val->columnNames["donor_full_name"] = trim($data["donor_full_name"]);
$val->columnNames["donor_email"] = trim($data["donor_email"]);
$val->columnNames["donor_contact"] = trim($data["donor_contact"]);
$val->columnNames["donor_address"] = trim($data["donor_address"]);
$val->columnNames["donor_city"] = trim($data["donor_city"]);
$val->columnNames["donor_province"] = trim($data["donor_province"]);
$val->columnNames["donor_country"] = trim($data["donor_country"]);
$val->columnNames["donor_zip"] = trim($data["donor_zip"]);

$query = checkCreate($val);
http_response_code(201); // CREATED
returnSuccess($val, "Roles Create", $query);
