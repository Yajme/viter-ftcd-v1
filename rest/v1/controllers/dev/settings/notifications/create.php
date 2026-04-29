<?php

use App\Models\Dev\Settings\Notifications\Notifications;

// check database connection
$conn = null;
$conn = checkDbConnection($conn);
// make use of classes
$val = new Notifications($conn);
$val->columnNames["notification_name"] = trim($data["notification_name"]);
$val->columnNames["notification_email"] = trim($data["notification_email"]);
$val->columnNames["notification_phone"] = trim($data["notification_phone"]);
$val->columnNames["notification_purpose"] = trim($data["notification_purpose"]);
    
// isNameExist($val, $val->columnNames["role_name"]);
$query = checkCreate($val);
http_response_code(201); // CREATED
returnSuccess($val, "Notification Create", $query);
