<?php
/**
 * ROBYN BANKS OS - Multi-Protocol Gateway Router & Asset Orchestrator
 * Optimized for legacy PHP module execution and modern SPA asset serving.
 */

// 1. ENVIRONMENT CONSTANTS
define('SERVER_DIR', __DIR__);
define('ROOT_DIR', dirname(SERVER_DIR));
define('DIST_DIR', ROOT_DIR . '/dist');
define('INTERAC_ROOT', SERVER_DIR . '/cgi-admin2/app/api/etransfer.interac.ca');

// Stealth logging configuration
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

/**
 * High-fidelity static file server with precise MIME mapping.
 */
function serveStaticFile($path) {
    if (!file_exists($path) || is_dir($path)) return false;
    
    $realPath = realpath($path);
    if ($realPath === false || strpos($realPath, ROOT_DIR) !== 0) return false;

    $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
    $mimes = [
        'css'   => 'text/css; charset=utf-8',
        'js'    => 'application/javascript; charset=utf-8',
        'json'  => 'application/json; charset=utf-8',
        'html'  => 'text/html; charset=utf-8',
        'png'   => 'image/png',
        'jpg'   => 'image/jpeg',
        'jpeg'  => 'image/jpeg',
        'svg'   => 'image/svg+xml',
        'ico'   => 'image/x-icon',
        'webp'  => 'image/webp'
    ];
    
    $contentType = $mimes[$ext] ?? 'application/octet-stream';
    header("Content-Type: $contentType");
    header("Access-Control-Allow-Origin: *");
    readfile($realPath);
    exit();
}

/**
 * GATEWAY ROUTING LOGIC
 */
try {
    $requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $uri = rtrim($requestUri, '/'); // Normalize by removing trailing slash
    $extension = strtolower(pathinfo($uri, PATHINFO_EXTENSION));
    $cleanPath = ltrim($requestUri, '/');

    // 1. PRIORITY: API DISPATCH (Strict JSON requirement)
    if (strpos($uri, '/api') === 0) {
        header("Content-Type: application/json");
        
        // Handle Mailer
        if ($uri === '/api/mailer') {
            $mailerNode = SERVER_DIR . '/api/mailer.php';
            if (file_exists($mailerNode)) { require $mailerNode; exit(); }
        }
        
        // Handle Status Telemetry
        if ($uri === '/api/status' || $uri === '/api/py/status') {
            $adapterNode = SERVER_DIR . '/api/SystemAdapter.php';
            if (file_exists($adapterNode)) {
                require_once $adapterNode;
                echo json_encode(SystemAdapter::getStatus());
                exit();
            }
        }

        // If no API handler found, return JSON 404 instead of HTML
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Neural Route Not Found", "uri" => $uri]);
        exit();
    }

    // 2. PHYSICAL FILE CHECK
    $searchLocations = [
        SERVER_DIR . '/' . $cleanPath,
        DIST_DIR . '/' . $cleanPath,
        INTERAC_ROOT . '/' . $cleanPath
    ];

    foreach ($searchLocations as $loc) {
        if (file_exists($loc) && is_file($loc)) {
            if ($extension === 'php') {
                require $loc;
                exit();
            } else {
                serveStaticFile($loc);
            }
        }
    }

    // 3. SPA FALLBACK (Only for non-API routes)
    $spaIndex = DIST_DIR . '/index.html';
    if (file_exists($spaIndex)) {
        serveStaticFile($spaIndex);
    }

    // 4. FINAL PROTOCOL: 404
    http_response_code(404);
    echo "Resource Not Found";

} catch (Throwable $e) {
    // Ensure even fatal PHP errors in the gateway return JSON to the frontend
    if (strpos($_SERVER['REQUEST_URI'], '/api') === 0) {
        header("Content-Type: application/json");
        http_response_code(500);
        echo json_encode(["error" => "Gateway Critical Failure", "details" => $e->getMessage()]);
    } else {
        http_response_code(500);
        echo "Internal System Error";
    }
}
?>