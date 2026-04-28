<?php
declare(strict_types=1);


require_once __DIR__ . '/../../vendor/autoload.php';
if (PHP_SAPI !== 'cli') {
    require_once __DIR__ . '/header.php';
}

error_reporting(E_ALL);
ini_set('display_errors', '0'); // prod-safe

set_error_handler(function($severity, $message, $file, $line) {
    throw new ErrorException($message, 0, $severity, $file, $line);
});

set_exception_handler(function(Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    error_log($e->getMessage() . "\n" . $e->getTraceAsString()); // ✅ stack trace here
    echo json_encode([
        'success' => false,
        'error'   => 'Internal Server Error'
    ]);
});

register_shutdown_function(function() {
    $e = error_get_last();
    if ($e && in_array($e['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
        http_response_code(500);
        header('Content-Type: application/json');
        error_log("Fatal error: {$e['message']} in {$e['file']} on line {$e['line']}");
        echo json_encode(['success' => false, 'error' => 'Fatal error']);
    }
});
