<?php

use App\Models\Dev\Settings\Users\Roles\Roles;

// check database connection
$conn = null;
$conn = checkDbConnection($conn);
$val = new Roles($conn);

if (empty($_GET)) {
    $query = checkReadAll($val);
    http_response_code(200);
    getQueriedData($query);
}

//return 404 if endpoint not found
checkEndpoint();