<?php
namespace App\V1\Middleware;

use App\Core\Response;

/**
 * CorsMiddleware
 *
 * Handles Cross-Origin Resource Sharing (CORS) for the API.
 *
 * How CORS works:
 *  1. Browser sends a "preflight" OPTIONS request to check if the real
 *     request is allowed.
 *  2. Server responds with which origins, methods, and headers are permitted.
 *  3. Browser proceeds with the real request only if the preflight passes.
 *
 * Usage in api.php:
 *   CorsMiddleware::handle();
 */
class CorsMiddleware
{
    // -------------------------------------------------------------------------
    // Configuration
    // Modify these constants to match your environment
    // -------------------------------------------------------------------------

    /**
     * Allowed origins.
     * Use ['*'] ONLY for fully public APIs with no authentication.
     * For authenticated APIs, always list specific origins.
     */
    private const ALLOWED_ORIGINS = [
        'https://yourdomain.com',
        'https://app.yourdomain.com',
        'http://localhost:3000',     // local dev frontend
        'http://localhost:5173',     // vite dev server
    ];

    /**
     * Allowed HTTP methods.
     */
    private const ALLOWED_METHODS = [
        'GET',
        'POST',
        'PUT',
        'DELETE',
        'OPTIONS',
    ];

    /**
     * Allowed request headers.
     * Add any custom headers your frontend sends.
     */
    private const ALLOWED_HEADERS = [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
    ];

    /**
     * Headers the browser is allowed to read from the response.
     */
    private const EXPOSED_HEADERS = [
        'X-Total-Count',
        'X-Page',
    ];

    /**
     * How long (seconds) browsers can cache the preflight response.
     * 86400 = 24 hours. Reduces preflight requests in production.
     */
    private const MAX_AGE = 86400;

    /**
     * Whether to allow cookies / credentials in cross-origin requests.
     * If true, ALLOWED_ORIGINS must NOT contain '*'.
     */
    private const ALLOW_CREDENTIALS = false;

    // -------------------------------------------------------------------------
    // Entry Point
    // -------------------------------------------------------------------------

    public static function handle(): void
    {
        $origin = self::resolveOrigin();

        self::setOriginHeader($origin);
        self::setStandardHeaders();

        // Preflight — browser is asking "can I make this request?"
        // Respond immediately, no need to go further into the app.
        if (self::isPreflight()) {
            self::sendPreflight();
        }
    }

    // -------------------------------------------------------------------------
    // Private — Origin Resolution
    // -------------------------------------------------------------------------

    /**
     * Returns the request origin if it's in the allowlist, null otherwise.
     */
    private static function resolveOrigin(): ?string
    {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? null;

        if ($origin === null) {
            return null; // same-origin or non-browser request
        }

        if (self::isAllowedOrigin($origin)) {
            return $origin;
        }

        // Origin present but not in allowlist
        self::rejectOrigin($origin);
    }

    private static function isAllowedOrigin(string $origin): bool
    {
        return in_array($origin, self::ALLOWED_ORIGINS, strict: true);
    }

    // -------------------------------------------------------------------------
    // Private — Header Setters
    // -------------------------------------------------------------------------

    private static function setOriginHeader(?string $origin): void
    {
        if ($origin === null) return;

        // Echo back the specific allowed origin (not '*')
        // This is required when Allow-Credentials is true,
        // and is best practice even when it's false.
        header("Access-Control-Allow-Origin: {$origin}");

        // Vary tells proxies/CDNs this response differs by Origin
        // Prevents a cached response for origin A being served to origin B
        header('Vary: Origin');
    }

    private static function setStandardHeaders(): void
    {
        if (self::ALLOW_CREDENTIALS) {
            header('Access-Control-Allow-Credentials: true');
        }

        if (!empty(self::EXPOSED_HEADERS)) {
            header('Access-Control-Expose-Headers: ' . implode(', ', self::EXPOSED_HEADERS));
        }
    }

    // -------------------------------------------------------------------------
    // Private — Preflight Handling
    // -------------------------------------------------------------------------

    private static function isPreflight(): bool
    {
        return $_SERVER['REQUEST_METHOD'] === 'OPTIONS'
            && isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']);
    }

    private static function sendPreflight(): never
    {
        header('Access-Control-Allow-Methods: ' . implode(', ', self::ALLOWED_METHODS));
        header('Access-Control-Allow-Headers: ' . implode(', ', self::ALLOWED_HEADERS));
        header('Access-Control-Max-Age: ' . self::MAX_AGE);

        http_response_code(204); // No Content — preflight needs no body
        exit();
    }

    // -------------------------------------------------------------------------
    // Private — Rejection
    // -------------------------------------------------------------------------

    private static function rejectOrigin(string $origin): never
    {
        $response = new Response();
        $response->setSuccess(false);
        $response->setStatusCode(403);
        $response->setData([
            'success' => false,
            'type'    => 'cors_error',
            'error'   => "Origin '{$origin}' is not allowed.",
        ]);
        $response->send();
        exit();
    }
}